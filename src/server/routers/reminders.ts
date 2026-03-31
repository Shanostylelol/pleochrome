import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { createRouter, protectedProcedure } from '../trpc'
import { uuidSchema } from '@/lib/validation/shared'

export const remindersRouter = createRouter({
  list: protectedProcedure
    .input(z.object({
      status: z.enum(['pending', 'sent', 'dismissed', 'snoozed']).optional(),
      limit: z.number().int().default(50),
    }).optional())
    .query(async ({ ctx, input }) => {
      let query = ctx.db.from('reminders')
        .select('*, assets!reminders_asset_id_fkey(name, reference_code), contacts!reminders_contact_id_fkey(full_name), partners!reminders_partner_id_fkey(name)')
        .eq('remind_user_id', ctx.user.id)
        .order('remind_at')
        .limit(input?.limit ?? 50)

      if (input?.status) query = query.eq('status', input.status)
      else query = query.in('status', ['pending', 'snoozed'])

      const { data, error } = await query
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data ?? []
    }),

  create: protectedProcedure
    .input(z.object({
      title: z.string().min(1).max(255),
      description: z.string().max(2000).optional(),
      remindAt: z.string().datetime(),
      assetId: uuidSchema.optional(),
      taskId: uuidSchema.optional(),
      contactId: uuidSchema.optional(),
      partnerId: uuidSchema.optional(),
      meetingId: uuidSchema.optional(),
      isRecurring: z.boolean().default(false),
      recurrenceRule: z.enum(['daily', 'weekly', 'monthly', 'quarterly', 'annually']).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.db.from('reminders').insert({
        title: input.title,
        description: input.description ?? null,
        remind_at: input.remindAt,
        remind_user_id: ctx.user.id,
        asset_id: input.assetId ?? null,
        task_id: input.taskId ?? null,
        contact_id: input.contactId ?? null,
        partner_id: input.partnerId ?? null,
        meeting_id: input.meetingId ?? null,
        is_recurring: input.isRecurring,
        recurrence_rule: input.recurrenceRule ?? null,
        created_by: ctx.user.id,
      } as never).select().single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  snooze: protectedProcedure
    .input(z.object({
      reminderId: uuidSchema,
      snoozedUntil: z.string().datetime(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.db.from('reminders')
        .update({ status: 'snoozed', snoozed_until: input.snoozedUntil } as never)
        .eq('id', input.reminderId).eq('remind_user_id', ctx.user.id)
        .select().single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  dismiss: protectedProcedure
    .input(z.object({ reminderId: uuidSchema }))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.db.from('reminders')
        .update({ status: 'dismissed' } as never)
        .eq('id', input.reminderId).eq('remind_user_id', ctx.user.id)
        .select().single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  delete: protectedProcedure
    .input(z.object({ reminderId: uuidSchema }))
    .mutation(async ({ ctx, input }) => {
      const { error } = await ctx.db.from('reminders').delete()
        .eq('id', input.reminderId).eq('remind_user_id', ctx.user.id)
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return { success: true }
    }),
})
