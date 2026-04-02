import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { createRouter, protectedProcedure } from '../trpc'
import { uuidSchema } from '@/lib/validation/shared'

export const kycRouter = createRouter({
  listByContact: protectedProcedure
    .input(z.object({ contactId: uuidSchema }))
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.db
        .from('kyc_records')
        .select('*, team_members!kyc_records_performed_by_fkey(full_name)')
        .eq('contact_id', input.contactId)
        .order('performed_at', { ascending: false })

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data ?? []
    }),

  create: protectedProcedure
    .input(z.object({
      contactId: uuidSchema,
      checkType: z.string().min(1).max(100),
      provider: z.string().max(255).optional(),
      providerReference: z.string().max(255).optional(),
      status: z.enum(['pending', 'passed', 'failed', 'expired', 'waived']).default('pending'),
      riskLevel: z.string().optional(),
      notes: z.string().max(5000).optional(),
      expiresAt: z.string().datetime().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.db
        .from('kyc_records')
        .insert({
          contact_id: input.contactId,
          check_type: input.checkType,
          provider: input.provider ?? null,
          provider_reference: input.providerReference ?? null,
          status: input.status,
          risk_level: input.riskLevel ?? null,
          notes: input.notes ?? null,
          expires_at: input.expiresAt ?? null,
          performed_by: ctx.user.id,
        } as never)
        .select()
        .single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })

      // Update contact KYC status
      if (input.status === 'passed') {
        await ctx.db.from('contacts').update({
          kyc_status: 'verified',
          kyc_verified_at: new Date().toISOString(),
          kyc_expires_at: input.expiresAt ?? null,
        } as never).eq('id', input.contactId)
      }

      return data
    }),

  update: protectedProcedure
    .input(z.object({
      recordId: uuidSchema,
      status: z.enum(['pending', 'passed', 'failed', 'expired', 'waived']).optional(),
      riskLevel: z.string().optional(),
      notes: z.string().max(5000).optional(),
      expiresAt: z.string().datetime().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { recordId, ...fields } = input
      const updates: Record<string, unknown> = {}
      if (fields.status !== undefined) updates.status = fields.status
      if (fields.riskLevel !== undefined) updates.risk_level = fields.riskLevel
      if (fields.notes !== undefined) updates.notes = fields.notes
      if (fields.expiresAt !== undefined) updates.expires_at = fields.expiresAt

      const { data, error } = await ctx.db
        .from('kyc_records')
        .update(updates as never)
        .eq('id', recordId)
        .select()
        .single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  getExpiring: protectedProcedure
    .input(z.object({ daysAhead: z.number().int().min(1).max(365).default(30) }))
    .query(async ({ ctx, input }) => {
      const cutoff = new Date(Date.now() + input.daysAhead * 86_400_000).toISOString()
      const { data, error } = await ctx.db
        .from('kyc_records')
        .select('*, contacts!kyc_records_contact_id_fkey(id, full_name, contact_type)')
        .eq('status', 'passed')
        .lt('expires_at', cutoff)
        .gt('expires_at', new Date().toISOString())
        .order('expires_at')

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data ?? []
    }),

  getIncomplete: protectedProcedure
    .query(async ({ ctx }) => {
      const { data, error } = await ctx.db
        .from('contacts')
        .select('id, full_name, contact_type, kyc_status')
        .eq('is_deleted', false)
        .in('kyc_status', ['not_started', 'pending', 'rejected', 'expired'] as never[])
        .order('full_name')

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data ?? []
    }),
})
