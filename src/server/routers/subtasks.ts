import { TRPCError } from '@trpc/server'
import { createRouter, protectedProcedure } from '../trpc'
import {
  createSubtaskInput, updateSubtaskInput, completeSubtaskInput,
  reorderSubtasksInput, toggleSubtaskHiddenInput,
} from '@/lib/validation/subtask'
import { uuidSchema } from '@/lib/validation/shared'
import { z } from 'zod'

export const subtasksRouter = createRouter({
  // ── List subtasks by task ──────────────────────────────────────
  listByTask: protectedProcedure
    .input(z.object({
      taskId: uuidSchema,
      includeHidden: z.boolean().default(false),
    }))
    .query(async ({ ctx, input }) => {
      let query = ctx.db
        .from('subtasks')
        .select('*, team_members!subtasks_assigned_to_fkey(id, full_name)')
        .eq('task_id', input.taskId)
        .order('sort_order')

      if (!input.includeHidden) {
        query = query.eq('is_hidden', false)
      }

      const { data, error } = await query
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data ?? []
    }),

  // ── Create subtask ─────────────────────────────────────────────
  create: protectedProcedure
    .input(createSubtaskInput)
    .mutation(async ({ ctx, input }) => {
      // Get max sort_order
      const { data: existing } = await ctx.db
        .from('subtasks')
        .select('sort_order')
        .eq('task_id', input.taskId)
        .order('sort_order', { ascending: false })
        .limit(1)
        .maybeSingle()

      const nextOrder = (existing?.sort_order ?? -1) + 1

      const { data, error } = await ctx.db
        .from('subtasks')
        .insert({
          task_id: input.taskId,
          title: input.title,
          description: input.description ?? null,
          assigned_to: input.assignedTo ?? null,
          assigned_by: input.assignedTo ? ctx.user.id : null,
          requires_approval: input.requiresApproval,
          subtask_type: (input.subtaskType ?? null) as never,
          sort_order: nextOrder,
          status: 'todo' as const,
        } as never)
        .select()
        .single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  // ── Update subtask ─────────────────────────────────────────────
  update: protectedProcedure
    .input(updateSubtaskInput)
    .mutation(async ({ ctx, input }) => {
      const { subtaskId, ...fields } = input
      const updates: Record<string, unknown> = {}

      if (fields.title !== undefined) updates.title = fields.title
      if (fields.description !== undefined) updates.description = fields.description
      if (fields.assignedTo !== undefined) {
        updates.assigned_to = fields.assignedTo
        if (fields.assignedTo) updates.assigned_by = ctx.user.id
      }
      if (fields.notes !== undefined) updates.notes = fields.notes
      if (fields.subtaskType !== undefined) updates.subtask_type = fields.subtaskType
      if (fields.status !== undefined) {
        updates.status = fields.status
        if (fields.status === 'in_progress' && !updates.started_at) updates.started_at = new Date().toISOString()
        if (fields.status === 'done') {
          updates.completed_at = new Date().toISOString()
          updates.completed_by = ctx.user.id
        }
      }

      if (Object.keys(updates).length === 0) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'No fields to update' })
      }

      const { data, error } = await ctx.db
        .from('subtasks')
        .update(updates as never)
        .eq('id', subtaskId)
        .select()
        .single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })

      // Notify assignee when subtask is assigned
      if (fields.assignedTo && fields.assignedTo !== ctx.user.id) {
        const subtaskTitle = data?.title ?? 'a subtask'
        await ctx.db.from('notifications').insert({
          recipient_id: fields.assignedTo,
          title: 'Subtask assigned to you',
          message: `${ctx.user.full_name} assigned "${subtaskTitle}" to you`,
          type: 'subtask_assigned' as never,
          subtask_id: subtaskId,
        } as never)
      }

      // Auto-create communication_log entry for call/email/communication subtask types
      if (fields.notes && data) {
        const subType = (data as Record<string, unknown>).subtask_type as string | undefined
        if (subType && ['call', 'email', 'communication'].includes(subType)) {
          try {
            const parsed = JSON.parse(fields.notes)
            if (parsed.text || parsed.call_to || parsed.email_to) {
              // Get the task to find the asset_id
              const { data: task } = await ctx.db.from('tasks').select('asset_id').eq('id', (data as Record<string, unknown>).task_id as string).single()
              await ctx.db.from('communication_log').insert({
                asset_id: task?.asset_id ?? null,
                task_id: (data as Record<string, unknown>).task_id,
                comm_type: subType === 'call' ? 'phone' : subType,
                direction: 'outbound',
                summary: parsed.text || `${subType} logged`,
                duration_minutes: parsed.duration_min ?? null,
                performed_by: ctx.user.id,
                performed_at: new Date().toISOString(),
              } as never)
            }
          } catch { /* notes not JSON — skip */ }
        }
      }

      return data
    }),

  // ── Complete subtask ───────────────────────────────────────────
  complete: protectedProcedure
    .input(completeSubtaskInput)
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.db
        .from('subtasks')
        .update({
          status: 'done' as const,
          completed_at: new Date().toISOString(),
          completed_by: ctx.user.id,
        } as never)
        .eq('id', input.subtaskId)
        .select()
        .single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  // ── Reorder subtasks within a task ─────────────────────────────
  reorder: protectedProcedure
    .input(reorderSubtasksInput)
    .mutation(async ({ ctx, input }) => {
      const updates = input.subtaskIds.map((id, index) =>
        ctx.db
          .from('subtasks')
          .update({ sort_order: index } as never)
          .eq('id', id)
          .eq('task_id', input.taskId)
      )

      await Promise.all(updates)
      return { success: true, count: input.subtaskIds.length }
    }),

  // ── Soft delete subtask (set status to cancelled) ──────────────
  softDelete: protectedProcedure
    .input(z.object({ subtaskId: uuidSchema }))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.db
        .from('subtasks')
        .update({ status: 'cancelled' as const, is_hidden: true } as never)
        .eq('id', input.subtaskId)
        .select()
        .single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  // ── Toggle subtask visibility ──────────────────────────────────
  toggleHidden: protectedProcedure
    .input(toggleSubtaskHiddenInput)
    .mutation(async ({ ctx, input }) => {
      const { data: subtask } = await ctx.db
        .from('subtasks')
        .select('is_hidden')
        .eq('id', input.subtaskId)
        .single()

      if (!subtask) throw new TRPCError({ code: 'NOT_FOUND', message: 'Subtask not found' })

      const { data, error } = await ctx.db
        .from('subtasks')
        .update({ is_hidden: !subtask.is_hidden } as never)
        .eq('id', input.subtaskId)
        .select()
        .single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),
})
