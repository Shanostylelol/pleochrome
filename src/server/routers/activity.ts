import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { createRouter, protectedProcedure } from '../trpc'
import { uuidSchema } from '@/lib/validation/shared'

export const activityRouter = createRouter({
  // ── List activity (global, paginated) ──────────────────────────
  list: protectedProcedure
    .input(z.object({
      assetId: uuidSchema.optional(),
      category: z.string().optional(),
      action: z.string().optional(),
      entityType: z.string().optional(),
      performedBy: uuidSchema.optional(),
      dateFrom: z.string().optional(),
      dateTo: z.string().optional(),
      limit: z.number().int().min(10).max(500).default(100),
      cursor: uuidSchema.optional(),
    }).optional())
    .query(async ({ ctx, input }) => {
      let query = ctx.db
        .from('activity_log')
        .select('*, team_members!activity_log_performed_by_fkey(full_name, email)')
        .order('performed_at', { ascending: false })
        .limit(input?.limit ?? 100)

      if (input?.assetId) query = query.eq('asset_id', input.assetId)
      if (input?.category) query = query.eq('category', input.category)
      if (input?.action) query = query.eq('action', input.action as never)
      if (input?.entityType) query = query.eq('entity_type', input.entityType)
      if (input?.performedBy) query = query.eq('performed_by', input.performedBy)
      if (input?.dateFrom) query = query.gte('performed_at', input.dateFrom)
      if (input?.dateTo) query = query.lte('performed_at', input.dateTo + 'T23:59:59Z')
      if (input?.cursor) query = query.lt('id', input.cursor)

      const { data, error } = await query
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data ?? []
    }),

  // ── List by asset ──────────────────────────────────────────────
  listByAsset: protectedProcedure
    .input(z.object({
      assetId: uuidSchema,
      limit: z.number().int().min(10).max(500).default(100),
    }))
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.db
        .from('activity_log')
        .select('*, team_members!activity_log_performed_by_fkey(full_name)')
        .eq('asset_id', input.assetId)
        .order('performed_at', { ascending: false })
        .limit(input.limit)

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data ?? []
    }),

  // ── List by task ──────────────────────────────────────────────
  listByTask: protectedProcedure
    .input(z.object({ taskId: uuidSchema, limit: z.number().int().min(1).max(100).default(20) }))
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.db
        .from('activity_log')
        .select('*, team_members!activity_log_performed_by_fkey(full_name)')
        .eq('task_id', input.taskId)
        .order('performed_at', { ascending: false })
        .limit(input.limit)

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data ?? []
    }),

  // ── Export activity log (JSON format) ──────────────────────────
  export: protectedProcedure
    .input(z.object({
      assetId: uuidSchema.optional(),
      format: z.enum(['json', 'csv']).default('json'),
      limit: z.number().int().min(1).max(10000).default(1000),
    }))
    .query(async ({ ctx, input }) => {
      let query = ctx.db
        .from('activity_log')
        .select('id, asset_id, entity_type, action, detail, performed_by, performed_at, category, severity')
        .order('performed_at', { ascending: false })
        .limit(input.limit)

      if (input.assetId) query = query.eq('asset_id', input.assetId)

      const { data, error } = await query
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })

      const entries = data ?? []

      if (input.format === 'csv') {
        const headers = 'id,asset_id,entity_type,action,detail,performed_by,performed_at,category,severity'
        const rows = entries.map(e =>
          [e.id, e.asset_id, e.entity_type, e.action, `"${(e.detail ?? '').replace(/"/g, '""')}"`,
           e.performed_by, e.performed_at, e.category, e.severity].join(',')
        )
        return { format: 'csv', data: [headers, ...rows].join('\n'), count: entries.length }
      }

      return { format: 'json', data: entries, count: entries.length }
    }),

  // ── Get count ──────────────────────────────────────────────────
  getCount: protectedProcedure
    .input(z.object({ assetId: uuidSchema.optional() }).optional())
    .query(async ({ ctx, input }) => {
      let query = ctx.db
        .from('activity_log')
        .select('id', { count: 'exact', head: true })

      if (input?.assetId) query = query.eq('asset_id', input.assetId)

      const { count, error } = await query
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return { count: count ?? 0 }
    }),
})
