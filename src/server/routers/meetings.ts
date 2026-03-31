import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { createRouter, protectedProcedure } from '../trpc'
import { uuidSchema } from '@/lib/validation/shared'

export const meetingsRouter = createRouter({
  list: protectedProcedure
    .input(z.object({
      assetId: uuidSchema.optional(),
      partnerId: uuidSchema.optional(),
      limit: z.number().int().default(50),
    }).optional())
    .query(async ({ ctx, input }) => {
      let query = ctx.db.from('meeting_notes')
        .select('*, assets!meeting_notes_asset_id_fkey(name, reference_code), partners!meeting_notes_partner_id_fkey(name), team_members!meeting_notes_created_by_fkey(full_name)')
        .order('meeting_date', { ascending: false })
        .limit(input?.limit ?? 50)

      if (input?.assetId) query = query.eq('asset_id', input.assetId)
      if (input?.partnerId) query = query.eq('partner_id', input.partnerId)

      const { data, error } = await query
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data ?? []
    }),

  getById: protectedProcedure
    .input(z.object({ meetingId: uuidSchema }))
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.db.from('meeting_notes')
        .select('*, assets!meeting_notes_asset_id_fkey(name, reference_code), partners!meeting_notes_partner_id_fkey(name)')
        .eq('id', input.meetingId).single()
      if (error) throw new TRPCError({ code: 'NOT_FOUND', message: 'Meeting not found' })
      return data
    }),

  create: protectedProcedure
    .input(z.object({
      title: z.string().min(1).max(500),
      meetingDate: z.string(),
      durationMinutes: z.number().int().positive().optional(),
      location: z.string().max(255).optional(),
      meetingType: z.string().max(100).optional(),
      assetId: uuidSchema.optional(),
      partnerId: uuidSchema.optional(),
      taskId: uuidSchema.optional(),
      attendees: z.array(z.object({ name: z.string(), role: z.string().optional() })).optional(),
      agenda: z.string().max(5000).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.db.from('meeting_notes').insert({
        title: input.title,
        meeting_date: input.meetingDate,
        duration_minutes: input.durationMinutes ?? null,
        location: input.location ?? null,
        meeting_type: input.meetingType ?? null,
        asset_id: input.assetId ?? null,
        partner_id: input.partnerId ?? null,
        task_id: input.taskId ?? null,
        attendees: input.attendees ?? [],
        agenda: input.agenda ?? null,
        created_by: ctx.user.id,
      } as never).select().single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  update: protectedProcedure
    .input(z.object({
      meetingId: uuidSchema,
      title: z.string().max(500).optional(),
      summary: z.string().max(10000).optional(),
      keyDecisions: z.string().max(5000).optional(),
      followUpDate: z.string().optional(),
      followUpNotes: z.string().max(2000).optional(),
      tags: z.array(z.string()).optional(),
      actionItems: z.array(z.object({
        title: z.string(),
        assignee: z.string().optional(),
        dueDate: z.string().optional(),
        converted: z.boolean().optional(),
      })).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { meetingId, ...fields } = input
      const updates: Record<string, unknown> = {}
      if (fields.title !== undefined) updates.title = fields.title
      if (fields.summary !== undefined) updates.summary = fields.summary
      if (fields.keyDecisions !== undefined) updates.key_decisions = fields.keyDecisions
      if (fields.followUpDate !== undefined) updates.follow_up_date = fields.followUpDate
      if (fields.followUpNotes !== undefined) updates.follow_up_notes = fields.followUpNotes
      if (fields.tags !== undefined) updates.tags = fields.tags
      if (fields.actionItems !== undefined) updates.action_items = fields.actionItems

      const { data, error } = await ctx.db.from('meeting_notes').update(updates as never).eq('id', meetingId).select().single()
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  // ── Complete meeting with transcript + action items ─────────────
  complete: protectedProcedure
    .input(z.object({
      meetingId: uuidSchema,
      summary: z.string().min(1).max(10000),
      transcript: z.string().max(100000).optional(),
      aiSummary: z.string().max(10000).optional(),
      keyDecisions: z.string().max(5000).optional(),
      actionItems: z.array(z.object({
        title: z.string(),
        assignee: z.string().optional(),
        dueDate: z.string().optional(),
      })).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.db.from('meeting_notes').update({
        summary: input.summary,
        transcript: input.transcript ?? null,
        ai_summary: input.aiSummary ?? null,
        key_decisions: input.keyDecisions ?? null,
        action_items: input.actionItems ?? [],
      } as never).eq('id', input.meetingId).select().single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  // ── Convert action item to task ────────────────────────────────
  convertActionItem: protectedProcedure
    .input(z.object({
      meetingId: uuidSchema,
      actionItemIndex: z.number().int().min(0),
      assetId: uuidSchema,
      stageId: uuidSchema,
    }))
    .mutation(async ({ ctx, input }) => {
      const { data: meeting } = await ctx.db.from('meeting_notes')
        .select('action_items').eq('id', input.meetingId).single()

      if (!meeting) throw new TRPCError({ code: 'NOT_FOUND', message: 'Meeting not found' })

      const items = (meeting.action_items as Array<{ title: string; assignee?: string; dueDate?: string }>) ?? []
      const item = items[input.actionItemIndex]
      if (!item) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Action item not found' })

      const { data: task, error } = await ctx.db.from('tasks').insert({
        asset_id: input.assetId,
        stage_id: input.stageId,
        title: item.title,
        task_type: 'meeting',
        status: 'todo',
        notes: `Created from meeting action item`,
        due_date: item.dueDate ?? null,
      } as never).select().single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return task
    }),

  delete: protectedProcedure
    .input(z.object({ meetingId: uuidSchema }))
    .mutation(async ({ ctx, input }) => {
      const { error } = await ctx.db.from('meeting_notes').delete().eq('id', input.meetingId)
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return { success: true }
    }),
})
