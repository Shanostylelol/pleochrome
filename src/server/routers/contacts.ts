import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { createRouter, protectedProcedure } from '../trpc'
import { uuidSchema, paginationSchema } from '@/lib/validation/shared'

export const contactsRouter = createRouter({
  list: protectedProcedure
    .input(z.object({
      contactType: z.enum(['individual', 'entity']).optional(),
      role: z.string().optional(),
      kycStatus: z.string().optional(),
      search: z.string().max(200).optional(),
      ...paginationSchema.shape,
    }).optional())
    .query(async ({ ctx, input }) => {
      let query = ctx.db
        .from('contacts')
        .select('*')
        .eq('is_deleted', false)
        .order('full_name')
        .limit(input?.limit ?? 50)

      if (input?.contactType) query = query.eq('contact_type', input.contactType)
      if (input?.role) query = query.eq('role', input.role as never)
      if (input?.kycStatus) query = query.eq('kyc_status', input.kycStatus as never)
      if (input?.search) query = query.or(`full_name.ilike.%${input.search}%,email.ilike.%${input.search}%,entity_name.ilike.%${input.search}%`)

      const { data, error } = await query
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data ?? []
    }),

  getById: protectedProcedure
    .input(z.object({ contactId: uuidSchema }))
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.db
        .from('contacts')
        .select('*')
        .eq('id', input.contactId)
        .single()

      if (error) throw new TRPCError({ code: 'NOT_FOUND', message: 'Contact not found' })

      // Get owned assets
      const { data: ownedAssets } = await ctx.db
        .from('asset_owners')
        .select('*, assets!asset_owners_asset_id_fkey(id, name, reference_code, status)')
        .eq('contact_id', input.contactId)

      // Get KYC records
      const { data: kycRecords } = await ctx.db
        .from('kyc_records')
        .select('*')
        .eq('contact_id', input.contactId)
        .order('performed_at', { ascending: false })

      // Get ownership links (as parent — who owns this entity)
      const { data: ownedBy } = await ctx.db
        .from('ownership_links')
        .select('*, contacts!ownership_links_child_contact_id_fkey(id, full_name, contact_type)')
        .eq('parent_contact_id', input.contactId)
        .eq('is_active', true)

      // Get ownership links (as child — who this entity/person owns)
      const { data: ownsEntities } = await ctx.db
        .from('ownership_links')
        .select('*, contacts!ownership_links_parent_contact_id_fkey(id, full_name, contact_type)')
        .eq('child_contact_id', input.contactId)
        .eq('is_active', true)

      return {
        contact: data,
        ownedAssets: ownedAssets ?? [],
        kycRecords: kycRecords ?? [],
        ownedBy: ownedBy ?? [],
        ownsEntities: ownsEntities ?? [],
      }
    }),

  create: protectedProcedure
    .input(z.object({
      fullName: z.string().min(1).max(255),
      contactType: z.enum(['individual', 'entity']).default('individual'),
      role: z.string().optional(),
      title: z.string().max(100).optional(),
      entity: z.string().max(255).optional(),
      email: z.string().email().optional(),
      phone: z.string().max(30).optional(),
      address: z.string().max(500).optional(),
      // Individual fields
      dateOfBirth: z.string().optional(),
      citizenship: z.string().max(100).optional(),
      // Entity fields
      entityName: z.string().max(255).optional(),
      entityType: z.string().max(100).optional(),
      stateOfFormation: z.string().max(100).optional(),
      ein: z.string().max(20).optional(),
      website: z.string().max(255).optional(),
      // Relationship
      source: z.string().max(255).optional(),
      notes: z.string().max(5000).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.db
        .from('contacts')
        .insert({
          full_name: input.fullName,
          contact_type: input.contactType,
          role: input.role ?? 'other',
          title: input.title ?? null,
          entity: input.entity ?? null,
          email: input.email ?? null,
          phone: input.phone ?? null,
          address: input.address ?? null,
          date_of_birth: input.dateOfBirth ?? null,
          citizenship: input.citizenship ?? null,
          entity_name: input.entityName ?? null,
          entity_type: input.entityType ?? null,
          state_of_formation: input.stateOfFormation ?? null,
          ein: input.ein ?? null,
          website: input.website ?? null,
          source: input.source ?? null,
          notes: input.notes ?? null,
        } as never)
        .select()
        .single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  update: protectedProcedure
    .input(z.object({
      contactId: uuidSchema,
      fullName: z.string().min(1).max(255).optional(),
      email: z.string().email().optional(),
      phone: z.string().max(30).optional(),
      address: z.string().max(500).optional(),
      title: z.string().max(100).optional(),
      notes: z.string().max(5000).optional(),
      relationshipStatus: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { contactId, ...fields } = input
      const updates: Record<string, unknown> = {}
      if (fields.fullName !== undefined) updates.full_name = fields.fullName
      if (fields.email !== undefined) updates.email = fields.email
      if (fields.phone !== undefined) updates.phone = fields.phone
      if (fields.address !== undefined) updates.address = fields.address
      if (fields.title !== undefined) updates.title = fields.title
      if (fields.notes !== undefined) updates.notes = fields.notes
      if (fields.relationshipStatus !== undefined) updates.relationship_status = fields.relationshipStatus

      const { data, error } = await ctx.db
        .from('contacts')
        .update(updates as never)
        .eq('id', contactId)
        .select()
        .single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  linkToAsset: protectedProcedure
    .input(z.object({
      contactId: uuidSchema,
      assetId: uuidSchema,
      role: z.string().default('holder'),
      ownershipPercentage: z.number().min(0).max(100).optional(),
      isPrimary: z.boolean().default(false),
    }))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.db
        .from('asset_owners')
        .insert({
          asset_id: input.assetId,
          contact_id: input.contactId,
          role: input.role,
          ownership_percentage: input.ownershipPercentage ?? null,
          is_primary: input.isPrimary,
        } as never)
        .select()
        .single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })

      // Auto-seed owner onboarding items from default template
      if (data) {
        const { data: contact } = await ctx.db.from('contacts').select('contact_type').eq('id', input.contactId).single()
        const contactType = (contact?.contact_type as string) ?? 'individual'

        const { data: existingItems } = await ctx.db.from('contact_onboarding_items').select('id').eq('contact_id', input.contactId).limit(1)
        if (!existingItems || existingItems.length === 0) {
          const { data: defaultTemplate } = await ctx.db
            .from('owner_onboarding_templates')
            .select('id')
            .eq('contact_type', contactType)
            .eq('is_default', true)
            .maybeSingle()

          if (defaultTemplate) {
            await ctx.db.rpc('instantiate_owner_onboarding', {
              p_contact_id: input.contactId,
              p_template_id: defaultTemplate.id,
            })
          }
        }
      }

      return data
    }),

  // ── Contact onboarding items ──────────────────────────────────
  getOnboardingItems: protectedProcedure
    .input(z.object({ contactId: uuidSchema }))
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.db
        .from('contact_onboarding_items')
        .select('*')
        .eq('contact_id', input.contactId)
        .order('sort_order')

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data ?? []
    }),

  updateOnboardingItem: protectedProcedure
    .input(z.object({
      itemId: uuidSchema,
      status: z.string().optional(),
      notes: z.string().optional(),
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

      const { data, error } = await ctx.db
        .from('contact_onboarding_items')
        .update(updates as never)
        .eq('id', input.itemId)
        .select()
        .single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),
})
