import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { createRouter, protectedProcedure } from '../trpc'
import { uuidSchema } from '@/lib/validation/shared'

export const communicationsRouter = createRouter({
  create: protectedProcedure
    .input(z.object({
      contactId: uuidSchema.optional(),
      partnerId: uuidSchema.optional(),
      assetId: uuidSchema.optional(),
      taskId: uuidSchema.optional(),
      commType: z.enum(['email', 'phone', 'video_call', 'in_person', 'text', 'other']),
      direction: z.enum(['inbound', 'outbound']).default('outbound'),
      subject: z.string().max(255).optional(),
      summary: z.string().min(1).max(5000),
      durationMinutes: z.number().int().positive().optional(),
      attendees: z.array(z.string()).optional(),
      actionItems: z.array(z.string()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.db.from('communication_log').insert({
        contact_id: input.contactId ?? null,
        partner_id: input.partnerId ?? null,
        asset_id: input.assetId ?? null,
        task_id: input.taskId ?? null,
        comm_type: input.commType,
        direction: input.direction,
        subject: input.subject ?? null,
        summary: input.summary,
        duration_minutes: input.durationMinutes ?? null,
        attendees: input.attendees ?? [],
        action_items: input.actionItems ?? [],
        performed_by: ctx.user.id,
      } as never).select().single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  listByContact: protectedProcedure
    .input(z.object({ contactId: uuidSchema, limit: z.number().int().default(50) }))
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.db.from('communication_log')
        .select('*, team_members!communication_log_performed_by_fkey(full_name)')
        .eq('contact_id', input.contactId)
        .order('performed_at', { ascending: false })
        .limit(input.limit)
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data ?? []
    }),

  listByPartner: protectedProcedure
    .input(z.object({ partnerId: uuidSchema, limit: z.number().int().default(50) }))
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.db.from('communication_log')
        .select('*, team_members!communication_log_performed_by_fkey(full_name)')
        .eq('partner_id', input.partnerId)
        .order('performed_at', { ascending: false })
        .limit(input.limit)
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data ?? []
    }),

  listByAsset: protectedProcedure
    .input(z.object({ assetId: uuidSchema, limit: z.number().int().default(50) }))
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.db.from('communication_log')
        .select('*, team_members!communication_log_performed_by_fkey(full_name), contacts!communication_log_contact_id_fkey(full_name), partners!communication_log_partner_id_fkey(name)')
        .eq('asset_id', input.assetId)
        .order('performed_at', { ascending: false })
        .limit(input.limit)
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data ?? []
    }),
})
