import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { createRouter, protectedProcedure } from '../trpc'
import { uuidSchema } from '@/lib/validation/shared'

export const approvalsRouter = createRouter({
  // ── List pending approvals for current user ────────────────────
  getMyQueue: protectedProcedure
    .input(z.object({ limit: z.number().int().min(1).max(100).default(50) }).optional())
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.db
        .from('approvals')
        .select(`
          *,
          tasks!approvals_task_id_fkey(id, title, asset_id, stage_id, task_type,
            assets!tasks_asset_id_fkey(name, reference_code)
          ),
          team_members!approvals_requested_by_fkey(full_name)
        `)
        .eq('approver_id', ctx.user.id)
        .eq('decision', 'pending')
        .order('requested_at', { ascending: true })
        .limit(input?.limit ?? 50)

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data ?? []
    }),

  // ── List approvals by task ─────────────────────────────────────
  listByTask: protectedProcedure
    .input(z.object({ taskId: uuidSchema }))
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.db
        .from('approvals')
        .select('*, team_members!approvals_approver_id_fkey(id, full_name, role)')
        .eq('task_id', input.taskId)
        .order('approval_order')
        .order('requested_at')

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data ?? []
    }),

  // ── List approvals by subtask ──────────────────────────────────
  listBySubtask: protectedProcedure
    .input(z.object({ subtaskId: uuidSchema }))
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.db
        .from('approvals')
        .select('*, team_members!approvals_approver_id_fkey(id, full_name, role)')
        .eq('subtask_id', input.subtaskId)
        .order('approval_order')

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data ?? []
    }),

  // ── Request approval (creates chain) ───────────────────────────
  request: protectedProcedure
    .input(z.object({
      taskId: uuidSchema.optional(),
      subtaskId: uuidSchema.optional(),
      approverIds: z.array(uuidSchema).min(1),
      sequential: z.boolean().default(false),
    }))
    .mutation(async ({ ctx, input }) => {
      if (!input.taskId && !input.subtaskId) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Must specify taskId or subtaskId' })
      }

      // Update task/subtask status
      if (input.taskId) {
        await ctx.db.from('tasks')
          .update({ status: 'pending_approval' as const } as never)
          .eq('id', input.taskId)
      }
      if (input.subtaskId) {
        await ctx.db.from('subtasks')
          .update({ status: 'pending_approval' as const } as never)
          .eq('id', input.subtaskId)
      }

      // Create approval records
      const approvals = input.approverIds.map((approverId, index) => ({
        task_id: input.taskId ?? null,
        subtask_id: input.subtaskId ?? null,
        requested_by: ctx.user.id,
        approver_id: approverId,
        approval_order: input.sequential ? index : 0,
        decision: 'pending' as const,
      }))

      const { data, error } = await ctx.db
        .from('approvals')
        .insert(approvals as never[])
        .select()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })

      // Get task/subtask info for notification
      let entityTitle = 'an item'
      let assetId: string | null = null
      if (input.taskId) {
        const { data: task } = await ctx.db.from('tasks').select('title, asset_id').eq('id', input.taskId).single()
        if (task) { entityTitle = task.title; assetId = task.asset_id }
      }

      // Create notifications for approvers
      const notifications = input.approverIds
        .filter(id => id !== ctx.user.id)
        .map(recipientId => ({
          recipient_id: recipientId,
          title: 'Approval requested',
          message: `${ctx.user.full_name} requested your approval on "${entityTitle}"`,
          type: 'approval_requested' as const,
          asset_id: assetId,
          task_id: input.taskId ?? null,
          subtask_id: input.subtaskId ?? null,
          approval_id: (data ?? []).find(a => a.approver_id === recipientId)?.id ?? null,
        }))

      if (notifications.length > 0) {
        await ctx.db.from('notifications').insert(notifications as never[])
      }

      return data ?? []
    }),

  // ── Decide (approve/reject) ────────────────────────────────────
  decide: protectedProcedure
    .input(z.object({
      approvalId: uuidSchema,
      decision: z.enum(['approved', 'rejected']),
      reason: z.string().max(1000).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Verify this approval is assigned to current user and pending
      const { data: approval } = await ctx.db
        .from('approvals')
        .select('*, tasks!approvals_task_id_fkey(id, title, assigned_to, asset_id)')
        .eq('id', input.approvalId)
        .eq('approver_id', ctx.user.id)
        .eq('decision', 'pending')
        .single()

      if (!approval) throw new TRPCError({ code: 'NOT_FOUND', message: 'Pending approval not found for you' })

      // Record decision
      const { data: decided, error } = await ctx.db
        .from('approvals')
        .update({
          decision: input.decision,
          decided_at: new Date().toISOString(),
          reason: input.reason ?? null,
        } as never)
        .eq('id', input.approvalId)
        .select()
        .single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })

      const targetId = approval.task_id ?? approval.subtask_id
      const targetTable = approval.task_id ? 'tasks' : 'subtasks'

      if (input.decision === 'rejected') {
        // Set task/subtask to rejected
        await ctx.db.from(targetTable)
          .update({ status: 'rejected' as const } as never)
          .eq('id', targetId!)

        // Notify the requester
        await ctx.db.from('notifications').insert({
          recipient_id: approval.requested_by,
          title: 'Approval rejected',
          message: `${ctx.user.full_name} rejected the approval${input.reason ? `: ${input.reason}` : ''}`,
          type: 'approval_decision' as const,
          task_id: approval.task_id,
          subtask_id: approval.subtask_id,
          approval_id: input.approvalId,
        } as never)
      } else {
        // Check if all approvals for this target are decided
        const { data: remaining } = await ctx.db
          .from('approvals')
          .select('id')
          .eq(approval.task_id ? 'task_id' : 'subtask_id', targetId!)
          .eq('decision', 'pending')

        if (!remaining || remaining.length === 0) {
          // All approved — auto-advance task/subtask to done
          await ctx.db.from(targetTable)
            .update({
              status: 'done' as const,
              completed_at: new Date().toISOString(),
              completed_by: ctx.user.id,
            } as never)
            .eq('id', targetId!)

          // Notify requester
          await ctx.db.from('notifications').insert({
            recipient_id: approval.requested_by,
            title: 'All approvals received',
            message: `All approvers have approved the request`,
            type: 'approval_decision' as const,
            task_id: approval.task_id,
            subtask_id: approval.subtask_id,
          } as never)
        } else {
          // Notify requester of partial progress
          await ctx.db.from('notifications').insert({
            recipient_id: approval.requested_by,
            title: 'Approval received',
            message: `${ctx.user.full_name} approved. ${remaining.length} approval(s) remaining.`,
            type: 'approval_decision' as const,
            task_id: approval.task_id,
            approval_id: input.approvalId,
          } as never)
        }
      }

      return decided
    }),

  getPendingCount: protectedProcedure.query(async ({ ctx }) => {
    const { count } = await ctx.db
      .from('approvals')
      .select('id', { count: 'exact', head: true })
      .eq('approver_id', ctx.user.id)
      .eq('decision', 'pending')
    return count ?? 0
  }),
})
