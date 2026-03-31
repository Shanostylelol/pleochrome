import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { createRouter, protectedProcedure } from '../trpc'
import { uuidSchema } from '@/lib/validation/shared'

// Extract @mentions from comment body — matches @name patterns
function extractMentionNames(body: string): string[] {
  const matches = body.match(/@(\w+(?:\s\w+)?)/g)
  if (!matches) return []
  return matches.map(m => m.slice(1).toLowerCase())
}

export const commentsRouter = createRouter({
  // ── List comments (polymorphic — by task, asset, stage, subtask) ──
  listByEntity: protectedProcedure
    .input(z.object({
      taskId: uuidSchema.optional(),
      subtaskId: uuidSchema.optional(),
      assetId: uuidSchema.optional(),
      stageId: uuidSchema.optional(),
      includeDeleted: z.boolean().default(false),
    }))
    .query(async ({ ctx, input }) => {
      let query = ctx.db
        .from('comments')
        .select('*, team_members!comments_author_id_fkey(id, full_name, email, role)')
        .order('created_at', { ascending: true })

      if (!input.includeDeleted) query = query.eq('is_deleted', false)
      if (input.taskId) query = query.eq('task_id', input.taskId)
      if (input.subtaskId) query = query.eq('subtask_id', input.subtaskId)
      if (input.assetId) query = query.eq('asset_id', input.assetId)
      if (input.stageId) query = query.eq('stage_id', input.stageId)

      const { data, error } = await query
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data ?? []
    }),

  // ── List ALL comments for an asset (across tasks, subtasks, stages) ──
  listAllForAsset: protectedProcedure
    .input(z.object({ assetId: uuidSchema }))
    .query(async ({ ctx, input }) => {
      // Get all task IDs and stage IDs for this asset
      const { data: tasks } = await ctx.db.from('tasks').select('id').eq('asset_id', input.assetId).eq('is_deleted', false)
      const { data: stages } = await ctx.db.from('asset_stages').select('id').eq('asset_id', input.assetId)
      const taskIds = (tasks ?? []).map(t => t.id)
      const stageIds = (stages ?? []).map(s => s.id)

      // Get subtask IDs from those tasks
      let subtaskIds: string[] = []
      if (taskIds.length > 0) {
        const { data: subtasks } = await ctx.db.from('subtasks').select('id').in('task_id', taskIds)
        subtaskIds = (subtasks ?? []).map(s => s.id)
      }

      // Build OR filter for all entity levels
      const filters: string[] = [`asset_id.eq.${input.assetId}`]
      if (taskIds.length > 0) filters.push(...taskIds.map(id => `task_id.eq.${id}`))
      if (stageIds.length > 0) filters.push(...stageIds.map(id => `stage_id.eq.${id}`))
      if (subtaskIds.length > 0) filters.push(...subtaskIds.map(id => `subtask_id.eq.${id}`))

      const { data, error } = await ctx.db
        .from('comments')
        .select('*, team_members!comments_author_id_fkey(id, full_name)')
        .or(filters.join(','))
        .eq('is_deleted', false)
        .order('created_at', { ascending: false })
        .limit(200)

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data ?? []
    }),

  // ── Create comment (with @mention → notification) ──────────────
  create: protectedProcedure
    .input(z.object({
      body: z.string().min(1).max(5000),
      taskId: uuidSchema.optional(),
      subtaskId: uuidSchema.optional(),
      assetId: uuidSchema.optional(),
      stageId: uuidSchema.optional(),
      parentCommentId: uuidSchema.optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Detect @mentions and resolve to team member IDs
      const mentionNames = extractMentionNames(input.body)
      let mentionedTeamIds: string[] = []

      if (mentionNames.length > 0) {
        const { data: members } = await ctx.db
          .from('team_members')
          .select('id, full_name')
          .eq('is_active', true)

        mentionedTeamIds = (members ?? [])
          .filter(m => mentionNames.some(name =>
            m.full_name.toLowerCase().includes(name) ||
            name.includes(m.full_name.split(' ')[0].toLowerCase())
          ))
          .map(m => m.id)
      }

      const { data: comment, error } = await ctx.db
        .from('comments')
        .insert({
          body: input.body,
          author_id: ctx.user.id,
          task_id: input.taskId ?? null,
          subtask_id: input.subtaskId ?? null,
          asset_id: input.assetId ?? null,
          stage_id: input.stageId ?? null,
          parent_comment_id: input.parentCommentId ?? null,
          mentioned_team_ids: mentionedTeamIds,
        } as never)
        .select('*, team_members!comments_author_id_fkey(id, full_name)')
        .single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })

      // Create notifications for @mentioned team members
      if (mentionedTeamIds.length > 0) {
        const notifications = mentionedTeamIds
          .filter(id => id !== ctx.user.id) // Don't notify yourself
          .map(recipientId => ({
            recipient_id: recipientId,
            title: 'You were mentioned in a comment',
            message: `${ctx.user.full_name} mentioned you: "${input.body.slice(0, 100)}${input.body.length > 100 ? '...' : ''}"`,
            type: 'comment_mention' as const,
            asset_id: input.assetId ?? null,
            task_id: input.taskId ?? null,
            subtask_id: input.subtaskId ?? null,
            comment_id: comment.id,
          }))

        if (notifications.length > 0) {
          await ctx.db.from('notifications').insert(notifications as never[])
        }
      }

      // If this is a reply, notify the parent comment author
      if (input.parentCommentId) {
        const { data: parentComment } = await ctx.db
          .from('comments')
          .select('author_id')
          .eq('id', input.parentCommentId)
          .single()

        if (parentComment && parentComment.author_id !== ctx.user.id) {
          await ctx.db.from('notifications').insert({
            recipient_id: parentComment.author_id,
            title: 'Reply to your comment',
            message: `${ctx.user.full_name} replied: "${input.body.slice(0, 100)}${input.body.length > 100 ? '...' : ''}"`,
            type: 'comment_reply' as const,
            asset_id: input.assetId ?? null,
            task_id: input.taskId ?? null,
            comment_id: comment.id,
          } as never)
        }
      }

      return comment
    }),

  // ── Edit comment ───────────────────────────────────────────────
  edit: protectedProcedure
    .input(z.object({
      commentId: uuidSchema,
      body: z.string().min(1).max(5000),
    }))
    .mutation(async ({ ctx, input }) => {
      const { data: existing } = await ctx.db
        .from('comments')
        .select('author_id')
        .eq('id', input.commentId)
        .single()

      if (!existing) throw new TRPCError({ code: 'NOT_FOUND', message: 'Comment not found' })
      if (existing.author_id !== ctx.user.id) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'You can only edit your own comments' })
      }

      const { data, error } = await ctx.db
        .from('comments')
        .update({
          body: input.body,
          is_edited: true,
          edited_at: new Date().toISOString(),
        } as never)
        .eq('id', input.commentId)
        .select()
        .single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  // ── Soft-delete comment ────────────────────────────────────────
  delete: protectedProcedure
    .input(z.object({ commentId: uuidSchema }))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.db
        .from('comments')
        .update({ is_deleted: true } as never)
        .eq('id', input.commentId)
        .eq('author_id', ctx.user.id)
        .select()
        .single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),
})
