import { TRPCError } from '@trpc/server'
import { createRouter, protectedProcedure } from '../trpc'
import {
  createTaskInput, updateTaskInput, completeTaskInput,
  reorderTasksInput, toggleTaskHiddenInput, requestApprovalInput,
  listMyTasksInput,
} from '@/lib/validation/task'
import { uuidSchema, taskStatusEnum } from '@/lib/validation/shared'
import { z } from 'zod'

export const tasksRouter = createRouter({
  // ── List tasks by asset ────────────────────────────────────────
  listByAsset: protectedProcedure
    .input(z.object({
      assetId: uuidSchema,
      includeHidden: z.boolean().default(false),
    }))
    .query(async ({ ctx, input }) => {
      let query = ctx.db
        .from('tasks')
        .select('*, team_members!tasks_assigned_to_fkey(id, full_name)')
        .eq('asset_id', input.assetId)
        .eq('is_deleted', false)
        .order('sort_order')

      if (!input.includeHidden) {
        query = query.eq('is_hidden', false)
      }

      const { data, error } = await query
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data ?? []
    }),

  // ── List tasks by stage ────────────────────────────────────────
  listByStage: protectedProcedure
    .input(z.object({
      stageId: uuidSchema,
      includeHidden: z.boolean().default(false),
    }))
    .query(async ({ ctx, input }) => {
      let query = ctx.db
        .from('tasks')
        .select('*, team_members!tasks_assigned_to_fkey(id, full_name), subtasks(id, title, status, sort_order, is_hidden)')
        .eq('stage_id', input.stageId)
        .eq('is_deleted', false)
        .order('sort_order')

      if (!input.includeHidden) {
        query = query.eq('is_hidden', false)
      }

      const { data, error } = await query
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data ?? []
    }),

  // ── List (backward-compat with V1 UI) ──────────────────────────
  list: protectedProcedure
    .input(z.object({
      assetId: uuidSchema.optional(),
      status: z.string().optional(),
      assignedTo: uuidSchema.optional(),
    }).optional())
    .query(async ({ ctx, input }) => {
      let query = ctx.db
        .from('tasks')
        .select('*, assets!tasks_asset_id_fkey(name, reference_code), asset_stages!tasks_stage_id_fkey(name, phase), team_members!tasks_assigned_to_fkey(id, full_name), subtasks(id, status)')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false })

      if (input?.assetId) query = query.eq('asset_id', input.assetId)
      if (input?.status) query = query.eq('status', input.status as never)
      if (input?.assignedTo) query = query.eq('assigned_to', input.assignedTo)

      const { data, error } = await query.limit(200)
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data ?? []
    }),

  // ── Create task ────────────────────────────────────────────────
  create: protectedProcedure
    .input(createTaskInput)
    .mutation(async ({ ctx, input }) => {
      // Get max sort_order in stage
      const { data: existing } = await ctx.db
        .from('tasks')
        .select('sort_order')
        .eq('stage_id', input.stageId)
        .eq('is_deleted', false)
        .order('sort_order', { ascending: false })
        .limit(1)
        .maybeSingle()

      const nextOrder = (existing?.sort_order ?? -1) + 1

      const { data, error } = await ctx.db
        .from('tasks')
        .insert({
          asset_id: input.assetId,
          stage_id: input.stageId,
          title: input.title,
          description: input.description ?? null,
          task_type: input.taskType,
          assigned_to: input.assignedTo ?? null,
          assigned_by: input.assignedTo ? ctx.user.id : null,
          assigned_at: input.assignedTo ? new Date().toISOString() : null,
          due_date: input.dueDate ?? null,
          estimated_duration_days: input.estimatedDurationDays ?? null,
          estimated_amount: input.estimatedAmount ?? null,
          payment_recipient: input.paymentRecipient ?? null,
          payment_description: input.paymentDescription ?? null,
          sort_order: nextOrder,
          status: 'todo' as const,
        })
        .select()
        .single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  // ── Update task ────────────────────────────────────────────────
  update: protectedProcedure
    .input(updateTaskInput)
    .mutation(async ({ ctx, input }) => {
      const { taskId, ...fields } = input
      const updates: Record<string, unknown> = {}

      if (fields.title !== undefined) updates.title = fields.title
      if (fields.description !== undefined) updates.description = fields.description
      if (fields.taskType !== undefined) updates.task_type = fields.taskType
      if (fields.assignedTo !== undefined) {
        updates.assigned_to = fields.assignedTo
        if (fields.assignedTo) {
          updates.assigned_by = ctx.user.id
          updates.assigned_at = new Date().toISOString()
        }
      }
      if (fields.dueDate !== undefined) updates.due_date = fields.dueDate
      if (fields.estimatedDurationDays !== undefined) updates.estimated_duration_days = fields.estimatedDurationDays
      if (fields.estimatedAmount !== undefined) updates.estimated_amount = fields.estimatedAmount
      if (fields.actualAmount !== undefined) updates.actual_amount = fields.actualAmount
      if (fields.paymentRecipient !== undefined) updates.payment_recipient = fields.paymentRecipient
      if (fields.paymentDescription !== undefined) updates.payment_description = fields.paymentDescription
      if (fields.paymentReference !== undefined) updates.payment_reference = fields.paymentReference
      if (fields.notes !== undefined) updates.notes = fields.notes

      if (Object.keys(updates).length === 0) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'No fields to update' })
      }

      const { data, error } = await ctx.db
        .from('tasks')
        .update(updates as never)
        .eq('id', taskId)
        .select('*, asset_stages!tasks_stage_id_fkey(name)')
        .single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })

      // Notify assignee when task is assigned
      if (fields.assignedTo && fields.assignedTo !== ctx.user.id) {
        const taskTitle = data?.title ?? 'a task'
        await ctx.db.from('notifications').insert({
          recipient_id: fields.assignedTo,
          title: 'Task assigned to you',
          message: `${ctx.user.full_name} assigned "${taskTitle}" to you`,
          type: 'task_assigned' as never,
          asset_id: (data as Record<string, unknown>)?.asset_id ?? null,
          task_id: taskId,
        } as never)
      }

      return data
    }),

  // ── Complete task ──────────────────────────────────────────────
  complete: protectedProcedure
    .input(completeTaskInput)
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.db
        .from('tasks')
        .update({
          status: 'done' as const,
          completed_at: new Date().toISOString(),
          completed_by: ctx.user.id,
        } as never)
        .eq('id', input.taskId)
        .select()
        .single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })

      // KYC Bridge: if this is a KYC-related task, auto-update owner's KYC status
      if (data) {
        const taskData = data as Record<string, unknown>
        const taskType = taskData.task_type as string
        const title = (taskData.title as string ?? '').toLowerCase()
        const isKycRelated = taskType === 'due_diligence' || title.includes('kyc') || title.includes('kyb') || title.includes('screening') || title.includes('verification')

        if (isKycRelated && taskData.asset_id) {
          const { data: primaryOwner } = await ctx.db
            .from('asset_owners')
            .select('contact_id')
            .eq('asset_id', taskData.asset_id as string)
            .eq('is_primary', true)
            .single()

          if (primaryOwner?.contact_id) {
            await ctx.db.from('kyc_records').insert({
              contact_id: primaryOwner.contact_id,
              check_type: `Workflow: ${taskData.title}`,
              provider: 'PleoChrome Workflow',
              status: 'passed',
              performed_by: ctx.user.id,
            } as never)

            await ctx.db.from('contacts').update({
              kyc_status: 'verified',
              kyc_verified_at: new Date().toISOString(),
            } as never).eq('id', primaryOwner.contact_id)
          }
        }
      }

      // Auto-complete stage when all non-cancelled tasks are done
      if (data) {
        const stageId = (data as Record<string, unknown>).stage_id as string | null
        if (stageId) {
          const { data: stageTasks } = await ctx.db
            .from('tasks')
            .select('status')
            .eq('stage_id', stageId)
            .eq('is_deleted', false)
            .eq('is_hidden', false)

          const nonCancelled = (stageTasks ?? []).filter(t => t.status !== 'cancelled')
          if (nonCancelled.length > 0 && nonCancelled.every(t => t.status === 'done')) {
            await ctx.db
              .from('asset_stages')
              .update({ status: 'completed' } as never)
              .eq('id', stageId)
              .in('status', ['not_started', 'in_progress'] as never[])
          }
        }
      }

      return data
    }),

  // ── Reorder tasks within a stage ───────────────────────────────
  reorder: protectedProcedure
    .input(reorderTasksInput)
    .mutation(async ({ ctx, input }) => {
      const updates = input.taskIds.map((id, index) =>
        ctx.db
          .from('tasks')
          .update({ sort_order: index } as never)
          .eq('id', id)
          .eq('stage_id', input.stageId)
      )

      await Promise.all(updates)
      return { success: true, count: input.taskIds.length }
    }),

  // ── Toggle task visibility ─────────────────────────────────────
  toggleHidden: protectedProcedure
    .input(toggleTaskHiddenInput)
    .mutation(async ({ ctx, input }) => {
      const { data: task } = await ctx.db
        .from('tasks')
        .select('is_hidden')
        .eq('id', input.taskId)
        .single()

      if (!task) throw new TRPCError({ code: 'NOT_FOUND', message: 'Task not found' })

      const { data, error } = await ctx.db
        .from('tasks')
        .update({ is_hidden: !task.is_hidden } as never)
        .eq('id', input.taskId)
        .select()
        .single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  // ── Request approval ───────────────────────────────────────────
  requestApproval: protectedProcedure
    .input(requestApprovalInput)
    .mutation(async ({ ctx, input }) => {
      // Update task status
      await ctx.db
        .from('tasks')
        .update({ status: 'pending_approval' as const } as never)
        .eq('id', input.taskId)

      // Create approval records
      const approvals = input.approverIds.map((approverId, index) => ({
        task_id: input.taskId,
        requested_by: ctx.user.id,
        approver_id: approverId,
        approval_order: input.sequential ? index : 0,
        decision: 'pending' as const,
      }))

      const { data, error } = await ctx.db
        .from('approvals')
        .insert(approvals)
        .select()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data ?? []
    }),

  // ── Update task status ────────────────────────────────────────────
  updateStatus: protectedProcedure
    .input(z.object({ taskId: uuidSchema, status: taskStatusEnum }))
    .mutation(async ({ ctx, input }) => {
      const updates: Record<string, unknown> = { status: input.status }
      if (input.status === 'in_progress') updates.started_at = new Date().toISOString()
      if (input.status === 'done') {
        updates.completed_at = new Date().toISOString()
        updates.completed_by = ctx.user.id
      }

      const { data, error } = await ctx.db
        .from('tasks')
        .update(updates as never)
        .eq('id', input.taskId)
        .select()
        .single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })

      // Auto-start stage when first task goes in_progress
      if (data && input.status === 'in_progress') {
        const stageId = (data as Record<string, unknown>).stage_id as string | null
        if (stageId) {
          await ctx.db.from('asset_stages')
            .update({ status: 'in_progress' } as never)
            .eq('id', stageId)
            .eq('status', 'not_started')
        }
      }

      // Auto-complete stage when all tasks done via updateStatus
      if (data && input.status === 'done') {
        const stageId = (data as Record<string, unknown>).stage_id as string | null
        if (stageId) {
          const { data: stageTasks } = await ctx.db
            .from('tasks').select('status')
            .eq('stage_id', stageId).eq('is_deleted', false).eq('is_hidden', false)
          const nonCancelled = (stageTasks ?? []).filter(t => t.status !== 'cancelled')
          if (nonCancelled.length > 0 && nonCancelled.every(t => t.status === 'done')) {
            await ctx.db.from('asset_stages')
              .update({ status: 'completed' } as never)
              .eq('id', stageId)
              .in('status', ['not_started', 'in_progress'] as never[])
          }
        }
      }

      return data
    }),

  // ── Soft delete task ────────────────────────────────────────────
  softDelete: protectedProcedure
    .input(z.object({ taskId: uuidSchema }))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.db
        .from('tasks')
        .update({ is_deleted: true } as never)
        .eq('id', input.taskId)
        .select()
        .single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  // ── Get my tasks (assigned to current user) ────────────────────
  getMyTasks: protectedProcedure
    .input(listMyTasksInput.optional())
    .query(async ({ ctx, input }) => {
      let query = ctx.db
        .from('tasks')
        .select('*, assets!tasks_asset_id_fkey(name, reference_code), asset_stages!tasks_stage_id_fkey(name, phase), team_members!tasks_assigned_to_fkey(id, full_name), subtasks(id, status)')
        .eq('assigned_to', ctx.user.id)
        .eq('is_deleted', false)
        .eq('is_hidden', false)
        .order('due_date', { ascending: true, nullsFirst: false })

      if (input?.status) {
        query = query.eq('status', input.status as never)
      } else {
        query = query.in('status', ['todo', 'in_progress', 'blocked', 'pending_approval'] as never[])
      }

      const limit = input?.limit ?? 50
      query = query.limit(limit)

      const { data, error } = await query
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data ?? []
    }),

  // ── Team workload ────────────────────────────────────────────
  getTeamWorkload: protectedProcedure
    .query(async ({ ctx }) => {
      const { data: members } = await ctx.db
        .from('team_members')
        .select('id, full_name, role')
        .eq('is_active', true)

      const { data: tasks } = await ctx.db
        .from('tasks')
        .select('assigned_to, status, due_date')
        .eq('is_deleted', false)
        .eq('is_hidden', false)

      const now = new Date().toISOString()
      const workload = (members ?? []).map((m) => {
        const myTasks = (tasks ?? []).filter((t) => t.assigned_to === m.id)
        return {
          memberId: m.id,
          name: m.full_name,
          role: m.role,
          todo: myTasks.filter(t => t.status === 'todo').length,
          inProgress: myTasks.filter(t => t.status === 'in_progress').length,
          blocked: myTasks.filter(t => t.status === 'blocked').length,
          done: myTasks.filter(t => t.status === 'done').length,
          overdue: myTasks.filter(t => t.due_date && t.due_date < now && t.status !== 'done' && t.status !== 'cancelled').length,
          total: myTasks.length,
        }
      })

      const unassigned = (tasks ?? []).filter(t => !t.assigned_to)
      workload.push({
        memberId: 'unassigned',
        name: 'Unassigned',
        role: '',
        todo: unassigned.filter(t => t.status === 'todo').length,
        inProgress: unassigned.filter(t => t.status === 'in_progress').length,
        blocked: unassigned.filter(t => t.status === 'blocked').length,
        done: unassigned.filter(t => t.status === 'done').length,
        overdue: unassigned.filter(t => t.due_date && t.due_date < now && t.status !== 'done' && t.status !== 'cancelled').length,
        total: unassigned.length,
      })

      return workload
    }),

  // ── Batch operations ─────────────────────────────────────────
  batchUpdateStatus: protectedProcedure
    .input(z.object({
      taskIds: z.array(uuidSchema).min(1).max(100),
      status: taskStatusEnum,
    }))
    .mutation(async ({ ctx, input }) => {
      const updates: Record<string, unknown> = { status: input.status }
      if (input.status === 'in_progress') updates.started_at = new Date().toISOString()
      if (input.status === 'done') {
        updates.completed_at = new Date().toISOString()
        updates.completed_by = ctx.user.id
      }

      const results = await Promise.all(
        input.taskIds.map((id) =>
          ctx.db.from('tasks').update(updates as never).eq('id', id).select().single()
        )
      )
      return { success: true, count: results.length }
    }),

  batchAssign: protectedProcedure
    .input(z.object({
      taskIds: z.array(uuidSchema).min(1).max(100),
      assignedTo: uuidSchema.nullable(),
    }))
    .mutation(async ({ ctx, input }) => {
      const updates = {
        assigned_to: input.assignedTo,
        assigned_by: input.assignedTo ? ctx.user.id : null,
        assigned_at: input.assignedTo ? new Date().toISOString() : null,
      }

      await Promise.all(
        input.taskIds.map((id) =>
          ctx.db.from('tasks').update(updates as never).eq('id', id)
        )
      )
      return { success: true, count: input.taskIds.length }
    }),
})
