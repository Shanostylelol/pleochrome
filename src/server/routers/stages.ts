import { TRPCError } from '@trpc/server'
import { createRouter, protectedProcedure } from '../trpc'
import {
  createStageInput, updateStageStatusInput,
  reorderStagesInput, toggleStageHiddenInput,
} from '@/lib/validation/stage'
import { uuidSchema } from '@/lib/validation/shared'
import { z } from 'zod'

export const stagesRouter = createRouter({
  // ── List stages by asset, grouped by phase ─────────────────────
  listByAsset: protectedProcedure
    .input(z.object({
      assetId: uuidSchema,
      includeHidden: z.boolean().default(false),
    }))
    .query(async ({ ctx, input }) => {
      let query = ctx.db
        .from('asset_stages')
        .select('*')
        .eq('asset_id', input.assetId)
        .order('phase')
        .order('sort_order')

      if (!input.includeHidden) {
        query = query.eq('is_hidden', false)
      }

      const { data, error } = await query
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data ?? []
    }),

  // ── Get single stage by ID ─────────────────────────────────────
  getById: protectedProcedure
    .input(z.object({ stageId: uuidSchema }))
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.db
        .from('asset_stages')
        .select('*')
        .eq('id', input.stageId)
        .single()

      if (error) throw new TRPCError({ code: 'NOT_FOUND', message: 'Stage not found' })
      return data
    }),

  // ── Create custom stage on live asset ──────────────────────────
  create: protectedProcedure
    .input(createStageInput)
    .mutation(async ({ ctx, input }) => {
      // Get max sort_order for this phase
      const { data: existing } = await ctx.db
        .from('asset_stages')
        .select('sort_order')
        .eq('asset_id', input.assetId)
        .eq('phase', input.phase)
        .order('sort_order', { ascending: false })
        .limit(1)
        .maybeSingle()

      const nextOrder = (existing?.sort_order ?? -1) + 1

      const { data, error } = await ctx.db
        .from('asset_stages')
        .insert({
          asset_id: input.assetId,
          phase: input.phase,
          name: input.name,
          description: input.description ?? null,
          sort_order: nextOrder,
          is_gate: input.isGate,
          gate_id: input.gateId ?? null,
          status: 'not_started' as const,
        })
        .select()
        .single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  // ── Update stage status ────────────────────────────────────────
  updateStatus: protectedProcedure
    .input(updateStageStatusInput)
    .mutation(async ({ ctx, input }) => {
      const updates: Record<string, unknown> = { status: input.status }

      if (input.status === 'in_progress') {
        updates.started_at = new Date().toISOString()
      }
      if (input.status === 'completed') {
        updates.completed_at = new Date().toISOString()
        updates.completed_by = ctx.user.id
      }

      const { data, error } = await ctx.db
        .from('asset_stages')
        .update(updates as never)
        .eq('id', input.stageId)
        .select()
        .single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })

      // Notify team members when stage is completed
      if (input.status === 'completed' && data) {
        const stageName = data.name ?? 'A stage'
        const assetId = data.asset_id
        const { data: teamMembers } = await ctx.db
          .from('team_members')
          .select('id')
          .eq('is_active', true)
          .neq('id', ctx.user.id)

        if (teamMembers && teamMembers.length > 0) {
          const notifications = teamMembers.map((m) => ({
            recipient_id: m.id,
            title: 'Stage completed',
            message: `${ctx.user.full_name} completed stage "${stageName}"`,
            type: 'stage_completed' as never,
            asset_id: assetId,
          }))
          await ctx.db.from('notifications').insert(notifications as never[])
        }
      }

      return data
    }),

  // ── Reorder stages within a phase ──────────────────────────────
  reorder: protectedProcedure
    .input(reorderStagesInput)
    .mutation(async ({ ctx, input }) => {
      const updates = input.stageIds.map((id, index) =>
        ctx.db
          .from('asset_stages')
          .update({ sort_order: index } as never)
          .eq('id', id)
          .eq('asset_id', input.assetId)
          .eq('phase', input.phase)
      )

      await Promise.all(updates)
      return { success: true, count: input.stageIds.length }
    }),

  // ── Toggle stage visibility ────────────────────────────────────
  toggleHidden: protectedProcedure
    .input(toggleStageHiddenInput)
    .mutation(async ({ ctx, input }) => {
      const { data: stage } = await ctx.db
        .from('asset_stages')
        .select('is_hidden')
        .eq('id', input.stageId)
        .single()

      if (!stage) throw new TRPCError({ code: 'NOT_FOUND', message: 'Stage not found' })

      const { data, error } = await ctx.db
        .from('asset_stages')
        .update({ is_hidden: !stage.is_hidden } as never)
        .eq('id', input.stageId)
        .select()
        .single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),
})
