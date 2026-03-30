import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { createRouter, protectedProcedure } from '../trpc'

export const assetTaskInstancesRouter = createRouter({
  listByAsset: protectedProcedure
    .input(z.object({ assetId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.db
        .from('asset_task_instances')
        .select('*')
        .eq('asset_id', input.assetId)
        .order('created_at', { ascending: true })
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data ?? []
    }),

  listByStep: protectedProcedure
    .input(z.object({ stepId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.db
        .from('asset_task_instances')
        .select('*')
        .eq('asset_step_id', input.stepId)
        .order('created_at', { ascending: true })
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data ?? []
    }),

  complete: protectedProcedure
    .input(z.object({ taskId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.db
        .from('asset_task_instances')
        .update({ status: 'done', completed_at: new Date().toISOString(), completed_by: ctx.user.id } as never)
        .eq('id', input.taskId)
        .select()
        .single()
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  updateStatus: protectedProcedure
    .input(z.object({
      taskId: z.string().uuid(),
      status: z.enum(['todo', 'in_progress', 'review', 'done', 'cancelled']),
    }))
    .mutation(async ({ ctx, input }) => {
      const updates: Record<string, unknown> = { status: input.status }
      if (input.status === 'done') {
        updates.completed_at = new Date().toISOString()
        updates.completed_by = ctx.user.id
      }
      const { data, error } = await ctx.db
        .from('asset_task_instances')
        .update(updates as never)
        .eq('id', input.taskId)
        .select()
        .single()
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),
})
