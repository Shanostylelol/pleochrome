import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { createRouter, protectedProcedure } from '../trpc'
import { uuidSchema } from '@/lib/validation/shared'

export const partnersRouter = createRouter({
  list: protectedProcedure
    .input(z.object({
      partnerType: z.string().optional(),
      engagementStatus: z.string().optional(),
      search: z.string().max(200).optional(),
    }).optional())
    .query(async ({ ctx, input }) => {
      let query = ctx.db.from('partners').select('*').eq('is_deleted', false).order('name')
      if (input?.partnerType) query = query.eq('type', input.partnerType as never)
      if (input?.engagementStatus) query = query.eq('engagement_status', input.engagementStatus)
      if (input?.search) query = query.ilike('name', `%${input.search}%`)

      const { data, error } = await query
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data ?? []
    }),

  getById: protectedProcedure
    .input(z.object({ partnerId: uuidSchema }))
    .query(async ({ ctx, input }) => {
      const { data: partner, error } = await ctx.db
        .from('partners')
        .select('*')
        .eq('id', input.partnerId)
        .single()
      if (error) throw new TRPCError({ code: 'NOT_FOUND', message: 'Partner not found' })

      const [onboarding, credentials, assets] = await Promise.all([
        ctx.db.from('partner_onboarding_items').select('*').eq('partner_id', input.partnerId).order('created_at'),
        ctx.db.from('partner_credentials').select('*').eq('partner_id', input.partnerId).order('expires_at'),
        ctx.db.from('asset_partners').select('*, assets!asset_partners_asset_id_fkey(id, name, reference_code, status)').eq('partner_id', input.partnerId),
      ])

      return {
        partner,
        onboardingItems: onboarding.data ?? [],
        credentials: credentials.data ?? [],
        assets: assets.data ?? [],
      }
    }),

  create: protectedProcedure
    .input(z.object({
      name: z.string().min(1).max(255),
      partnerType: z.string(),
      contactName: z.string().optional(),
      contactEmail: z.string().email().optional(),
      contactPhone: z.string().optional(),
      contactTitle: z.string().optional(),
      website: z.string().optional(),
      description: z.string().max(2000).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.db.from('partners').insert({
        name: input.name,
        type: input.partnerType,
        contact_name: input.contactName ?? null,
        contact_email: input.contactEmail ?? null,
        contact_phone: input.contactPhone ?? null,
        contact_title: input.contactTitle ?? null,
        website: input.website ?? null,
        description: input.description ?? null,
      } as never).select().single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })

      // Auto-create contact record for partner's contact person
      if (input.contactName && input.contactEmail && data) {
        const { data: existing } = await ctx.db
          .from('contacts')
          .select('id')
          .eq('email', input.contactEmail)
          .maybeSingle()

        if (!existing) {
          await ctx.db.from('contacts').insert({
            full_name: input.contactName,
            email: input.contactEmail,
            phone: input.contactPhone ?? null,
            title: input.contactTitle ?? null,
            contact_type: 'individual',
            role: 'partner_contact',
            partner_id: data.id,
          } as never)
        } else {
          await ctx.db.from('contacts').update({
            partner_id: data.id,
          } as never).eq('id', existing.id)
        }
      }

      // Auto-seed onboarding items from default template for this partner type
      if (data) {
        const { data: defaultTemplate } = await ctx.db
          .from('partner_onboarding_templates')
          .select('id')
          .eq('partner_type', input.partnerType)
          .eq('is_default', true)
          .maybeSingle()

        if (defaultTemplate) {
          await ctx.db.rpc('instantiate_partner_onboarding', {
            p_partner_id: data.id,
            p_template_id: defaultTemplate.id,
          })
        }
      }

      return data
    }),

  // ── Get onboarding templates ──────────────────────────────────
  getOnboardingTemplates: protectedProcedure
    .input(z.object({ partnerType: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      let query = ctx.db.from('partner_onboarding_templates').select('*').order('name')
      if (input?.partnerType) query = query.eq('partner_type', input.partnerType)
      const { data, error } = await query
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data ?? []
    }),

  // ── Apply template to partner ─────────────────────────────────
  applyOnboardingTemplate: protectedProcedure
    .input(z.object({ partnerId: uuidSchema, templateId: uuidSchema }))
    .mutation(async ({ ctx, input }) => {
      const { error } = await ctx.db.rpc('instantiate_partner_onboarding', {
        p_partner_id: input.partnerId,
        p_template_id: input.templateId,
      })
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return { success: true }
    }),

  update: protectedProcedure
    .input(z.object({
      partnerId: uuidSchema,
      name: z.string().min(1).max(255).optional(),
      contactName: z.string().optional(),
      contactEmail: z.string().email().optional(),
      contactPhone: z.string().optional(),
      website: z.string().optional(),
      description: z.string().max(2000).optional(),
      engagementStatus: z.string().optional(),
      ddStatus: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { partnerId, ...fields } = input
      const updates: Record<string, unknown> = {}
      if (fields.name !== undefined) updates.name = fields.name
      if (fields.contactName !== undefined) updates.contact_name = fields.contactName
      if (fields.contactEmail !== undefined) updates.contact_email = fields.contactEmail
      if (fields.contactPhone !== undefined) updates.contact_phone = fields.contactPhone
      if (fields.website !== undefined) updates.website = fields.website
      if (fields.description !== undefined) updates.description = fields.description
      if (fields.engagementStatus !== undefined) updates.engagement_status = fields.engagementStatus
      if (fields.ddStatus !== undefined) updates.dd_status = fields.ddStatus

      const { data, error } = await ctx.db.from('partners').update(updates as never).eq('id', partnerId).select().single()
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  // ── Link partner to asset ─────────────────────────────────────────
  linkToAsset: protectedProcedure
    .input(z.object({
      partnerId: uuidSchema,
      assetId: uuidSchema,
      roleOnAsset: z.string().max(255).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.db.from('asset_partners').insert({
        asset_id: input.assetId,
        partner_id: input.partnerId,
        role_on_asset: input.roleOnAsset ?? null,
      } as never).select().single()
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  // ── Onboarding Items ───────────────────────────────────────────
  getOnboardingItems: protectedProcedure
    .input(z.object({ partnerId: uuidSchema }))
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.db.from('partner_onboarding_items').select('*').eq('partner_id', input.partnerId).order('sort_order').order('created_at')
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data ?? []
    }),

  createOnboardingItem: protectedProcedure
    .input(z.object({
      partnerId: uuidSchema,
      itemName: z.string().min(1).max(255),
      itemType: z.string().min(1),
      stage: z.string().optional(),
      description: z.string().max(1000).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.db.from('partner_onboarding_items').insert({
        partner_id: input.partnerId,
        item_name: input.itemName,
        item_type: input.itemType,
        stage: input.stage ?? 'general',
        description: input.description ?? null,
      } as never).select().single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  updateOnboardingItem: protectedProcedure
    .input(z.object({
      itemId: uuidSchema,
      status: z.string().optional(),
      notes: z.string().max(1000).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const updates: Record<string, unknown> = {}
      if (input.status !== undefined) {
        updates.status = input.status
        if (input.status === 'verified') {
          updates.verified_at = new Date().toISOString()
          updates.verified_by = ctx.user.id
        }
      }
      if (input.notes !== undefined) updates.notes = input.notes

      const { data, error } = await ctx.db.from('partner_onboarding_items').update(updates as never).eq('id', input.itemId).select().single()
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  deleteOnboardingItem: protectedProcedure
    .input(z.object({ itemId: uuidSchema }))
    .mutation(async ({ ctx, input }) => {
      const { error } = await ctx.db.from('partner_onboarding_items').delete().eq('id', input.itemId)
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return { success: true }
    }),

  // ── Credentials ────────────────────────────────────────────────
  getCredentials: protectedProcedure
    .input(z.object({ partnerId: uuidSchema }))
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.db.from('partner_credentials').select('*').eq('partner_id', input.partnerId).order('expires_at')
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data ?? []
    }),

  addCredential: protectedProcedure
    .input(z.object({
      partnerId: uuidSchema,
      credentialType: z.string().min(1),
      credentialName: z.string().min(1).max(255),
      issuingBody: z.string().max(255).optional(),
      credentialNumber: z.string().max(100).optional(),
      issuedAt: z.string().optional(),
      expiresAt: z.string().optional(),
      verificationUrl: z.string().max(500).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.db.from('partner_credentials').insert({
        partner_id: input.partnerId,
        credential_type: input.credentialType,
        credential_name: input.credentialName,
        issuing_body: input.issuingBody ?? null,
        credential_number: input.credentialNumber ?? null,
        issued_at: input.issuedAt ?? null,
        expires_at: input.expiresAt ?? null,
        verification_url: input.verificationUrl ?? null,
      } as never).select().single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  getExpiringCredentials: protectedProcedure
    .input(z.object({ daysAhead: z.number().int().min(1).max(365).default(60) }))
    .query(async ({ ctx, input }) => {
      const cutoff = new Date(Date.now() + input.daysAhead * 86_400_000).toISOString().split('T')[0]
      const { data, error } = await ctx.db
        .from('partner_credentials')
        .select('*, partners!partner_credentials_partner_id_fkey(id, name)')
        .eq('is_active', true)
        .lt('expires_at', cutoff)
        .gt('expires_at', new Date().toISOString().split('T')[0])
        .order('expires_at')

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data ?? []
    }),
})
