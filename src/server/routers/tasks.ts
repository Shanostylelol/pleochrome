import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { createRouter, protectedProcedure } from '../trpc'

export const tasksRouter = createRouter({
  list: protectedProcedure
    .input(
      z.object({
        assetId: z.string().uuid().optional(),
        status: z.string().optional(),
        assignedTo: z.string().uuid().optional(),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      let query = ctx.db
        .from('tasks')
        .select('*, assets!tasks_asset_id_fkey(name, reference_code), team_members!tasks_assigned_to_fkey(full_name)')
        .order('created_at', { ascending: false })

      if (input?.assetId) query = query.eq('asset_id', input.assetId)
      if (input?.status) query = query.eq('status', input.status as never)
      if (input?.assignedTo) query = query.eq('assigned_to', input.assignedTo)

      const { data, error } = await query.limit(200)
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data ?? []
    }),

  complete: protectedProcedure
    .input(z.object({ taskId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.db
        .from('tasks')
        .update({ status: 'done', completed_at: new Date().toISOString(), completed_by: ctx.user.id })
        .eq('id', input.taskId)
        .select()
        .single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1).max(500),
        description: z.string().max(2000).optional(),
        assetId: z.string().uuid().optional(),
        stepId: z.string().uuid().optional(),
        assignedTo: z.string().uuid().optional(),
        priority: z.enum(['low', 'medium', 'high', 'urgent', 'blocker']).default('medium'),
        dueDate: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.db
        .from('tasks')
        .insert({
          title: input.title,
          description: input.description ?? null,
          asset_id: input.assetId ?? null,
          step_id: input.stepId ?? null,
          assigned_to: input.assignedTo ?? null,
          priority: input.priority,
          due_date: input.dueDate ?? null,
          status: 'todo',
          assigned_by: ctx.user.id,
        } as never)
        .select()
        .single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),
})
