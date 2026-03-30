import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { createRouter, protectedProcedure } from '../trpc'

export const stepsRouter = createRouter({
  listByAsset: protectedProcedure
    .input(z.object({ assetId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.db
        .from('asset_steps')
        .select('*')
        .eq('asset_id', input.assetId)
        .order('phase_number', { ascending: true })
        .order('step_number', { ascending: true })
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data ?? []
    }),

  updateStatus: protectedProcedure
    .input(z.object({
      stepId: z.string().uuid(),
      status: z.enum(['not_started', 'in_progress', 'blocked', 'completed', 'skipped']),
      blockedReason: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const updates: Record<string, unknown> = { status: input.status }
      if (input.status === 'in_progress') updates.started_at = new Date().toISOString()
      if (input.status === 'completed') {
        updates.completed_at = new Date().toISOString()
        updates.completed_by = ctx.user.id
      }
      if (input.status === 'blocked' && input.blockedReason) {
        updates.blocked_reason = input.blockedReason
        updates.blocked_at = new Date().toISOString()
      }
      const { data, error } = await ctx.db
        .from('asset_steps')
        .update(updates as never)
        .eq('id', input.stepId)
        .select()
        .single()
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),
})
