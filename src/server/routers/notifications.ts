import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { createRouter, protectedProcedure } from '../trpc'
import { uuidSchema } from '@/lib/validation/shared'

export const notificationsRouter = createRouter({
  // ── List notifications for current user ────────────────────────
  list: protectedProcedure
    .input(z.object({
      unreadOnly: z.boolean().default(false),
      limit: z.number().int().min(1).max(100).default(50),
      cursor: uuidSchema.optional(),
    }).optional())
    .query(async ({ ctx, input }) => {
      let query = ctx.db
        .from('notifications')
        .select('*')
        .eq('recipient_id', ctx.user.id)
        .eq('is_dismissed', false)
        .order('created_at', { ascending: false })
        .limit(input?.limit ?? 50)

      if (input?.unreadOnly) query = query.eq('is_read', false)
      if (input?.cursor) query = query.lt('id', input.cursor)

      const { data, error } = await query
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data ?? []
    }),

  // ── Get unread count ───────────────────────────────────────────
  getUnreadCount: protectedProcedure
    .query(async ({ ctx }) => {
      const { count, error } = await ctx.db
        .from('notifications')
        .select('id', { count: 'exact', head: true })
        .eq('recipient_id', ctx.user.id)
        .eq('is_read', false)
        .eq('is_dismissed', false)

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return { count: count ?? 0 }
    }),

  // ── Mark single notification as read ───────────────────────────
  markRead: protectedProcedure
    .input(z.object({ notificationId: uuidSchema }))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.db
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() } as never)
        .eq('id', input.notificationId)
        .eq('recipient_id', ctx.user.id)
        .select()
        .single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  // ── Mark all notifications as read ─────────────────────────────
  markAllRead: protectedProcedure
    .mutation(async ({ ctx }) => {
      const { error } = await ctx.db
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() } as never)
        .eq('recipient_id', ctx.user.id)
        .eq('is_read', false)

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return { success: true }
    }),

  // ── Dismiss notification ───────────────────────────────────────
  dismiss: protectedProcedure
    .input(z.object({ notificationId: uuidSchema }))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.db
        .from('notifications')
        .update({ is_dismissed: true } as never)
        .eq('id', input.notificationId)
        .eq('recipient_id', ctx.user.id)
        .select()
        .single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),
})
