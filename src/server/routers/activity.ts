import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { createRouter, protectedProcedure } from '../trpc'

export const activityRouter = createRouter({
  list: protectedProcedure
    .input(z.object({
      assetId: z.string().uuid().optional(),
      category: z.string().optional(),
      limit: z.number().int().min(10).max(500).default(100),
      offset: z.number().int().min(0).default(0),
    }).optional())
    .query(async ({ ctx, input }) => {
      let query = ctx.db
        .from('activity_log')
        .select('*, team_members!activity_log_performed_by_fkey(full_name, email)')
        .order('performed_at', { ascending: false })
        .range(input?.offset ?? 0, (input?.offset ?? 0) + (input?.limit ?? 100) - 1)

      if (input?.assetId) query = query.eq('asset_id', input.assetId)
      if (input?.category) query = query.eq('category', input.category)

      const { data, error } = await query
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data ?? []
    }),
})
