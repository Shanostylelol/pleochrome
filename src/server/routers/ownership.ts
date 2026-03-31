import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { createRouter, protectedProcedure } from '../trpc'
import { uuidSchema } from '@/lib/validation/shared'

export const ownershipRouter = createRouter({
  // ── Get asset owners (contacts linked via asset_owners) ─────────
  getAssetOwners: protectedProcedure
    .input(z.object({ assetId: uuidSchema }))
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.db
        .from('asset_owners')
        .select('*, contacts!asset_owners_contact_id_fkey(id, full_name, contact_type, kyc_status, email)')
        .eq('asset_id', input.assetId)
        .order('is_primary', { ascending: false })

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data ?? []
    }),

  // ── Get ownership tree (recursive entity look-through) ─────────
  getOwnershipTree: protectedProcedure
    .input(z.object({ contactId: uuidSchema }))
    .query(async ({ ctx, input }) => {
      // Get all ownership links where this contact is the parent (entity)
      const { data: directOwners } = await ctx.db
        .from('ownership_links')
        .select('*, contacts!ownership_links_child_contact_id_fkey(id, full_name, contact_type, kyc_status)')
        .eq('parent_contact_id', input.contactId)
        .eq('is_active', true)
        .order('ownership_percentage', { ascending: false })

      // For each entity owner, recursively get their owners
      const tree = await Promise.all((directOwners ?? []).map(async (link) => {
        const child = link.contacts as { id: string; full_name: string; contact_type: string; kyc_status: string } | null
        let subOwners: typeof directOwners = []

        if (child?.contact_type === 'entity') {
          const { data } = await ctx.db
            .from('ownership_links')
            .select('*, contacts!ownership_links_child_contact_id_fkey(id, full_name, contact_type, kyc_status)')
            .eq('parent_contact_id', child.id)
            .eq('is_active', true)
          subOwners = data ?? []
        }

        return {
          link,
          contact: child,
          subOwners: subOwners.map(sub => ({
            link: sub,
            contact: sub.contacts,
          })),
        }
      }))

      return tree
    }),

  // ── Add beneficial owner link ──────────────────────────────────
  addBeneficialOwner: protectedProcedure
    .input(z.object({
      parentContactId: uuidSchema,
      childContactId: uuidSchema,
      ownershipPercentage: z.number().min(0).max(100).optional(),
      isControlPerson: z.boolean().default(false),
      roleTitle: z.string().max(255).optional(),
      relationshipType: z.string().default('beneficial_owner'),
    }))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.db
        .from('ownership_links')
        .insert({
          parent_contact_id: input.parentContactId,
          child_contact_id: input.childContactId,
          ownership_percentage: input.ownershipPercentage ?? null,
          is_control_person: input.isControlPerson,
          role_title: input.roleTitle ?? null,
          relationship_type: input.relationshipType,
          verified_by: ctx.user.id,
          verified_at: new Date().toISOString(),
        } as never)
        .select()
        .single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  updateLink: protectedProcedure
    .input(z.object({
      linkId: uuidSchema,
      ownershipPercentage: z.number().min(0).max(100).optional(),
      isControlPerson: z.boolean().optional(),
      roleTitle: z.string().max(255).optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { linkId, ...fields } = input
      const updates: Record<string, unknown> = {}
      if (fields.ownershipPercentage !== undefined) updates.ownership_percentage = fields.ownershipPercentage
      if (fields.isControlPerson !== undefined) updates.is_control_person = fields.isControlPerson
      if (fields.roleTitle !== undefined) updates.role_title = fields.roleTitle
      if (fields.isActive !== undefined) updates.is_active = fields.isActive

      const { data, error } = await ctx.db
        .from('ownership_links')
        .update(updates as never)
        .eq('id', linkId)
        .select()
        .single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  removeLink: protectedProcedure
    .input(z.object({ linkId: uuidSchema }))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.db
        .from('ownership_links')
        .update({ is_active: false, termination_date: new Date().toISOString().split('T')[0] } as never)
        .eq('id', input.linkId)
        .select()
        .single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),
})
