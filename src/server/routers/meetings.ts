import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { createRouter, protectedProcedure } from '../trpc'

export const meetingsRouter = createRouter({
  list: protectedProcedure
    .input(
      z.object({
        assetId: z.string().uuid().optional(),
        partnerId: z.string().uuid().optional(),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      let query = ctx.db
        .from('meeting_notes')
        .select('*, assets!meeting_notes_asset_id_fkey(name, reference_code), partners!meeting_notes_partner_id_fkey(name)')
        .order('meeting_date', { ascending: false })

      if (input?.assetId) query = query.eq('asset_id', input.assetId)
      if (input?.partnerId) query = query.eq('partner_id', input.partnerId)

      const { data, error } = await query.limit(100)
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data ?? []
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1).max(500),
        meetingDate: z.string(),
        assetId: z.string().uuid().optional(),
        partnerId: z.string().uuid().optional(),
        notes: z.string().max(5000).optional(),
        actionItems: z.string().max(2000).optional(),
        attendees: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.db
        .from('meeting_notes')
        .insert({
          title: input.title,
          meeting_date: input.meetingDate,
          asset_id: input.assetId ?? null,
          partner_id: input.partnerId ?? null,
          summary: input.notes ?? null,
          action_items: input.actionItems ? JSON.parse(input.actionItems) : null,
          attendees: input.attendees ?? [],
          created_by: ctx.user.id,
        } as never)
        .select()
        .single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),
})
