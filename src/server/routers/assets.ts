import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { createRouter, protectedProcedure } from '../trpc'
import {
  createAssetInput, updateAssetInput, advancePhaseInput,
  listAssetsInput, archiveAssetInput,
} from '@/lib/validation/asset'
import { assetIdInput } from '@/lib/validation/shared'

export const assetsRouter = createRouter({
  // ── List assets with filters ───────────────────────────────────
  list: protectedProcedure
    .input(listAssetsInput.optional())
    .query(async ({ ctx, input }) => {
      let query = ctx.db
        .from('assets')
        .select('*, team_members!assets_lead_team_member_id_fkey(id, full_name, role)')
        .eq('is_deleted', false)
        .order('updated_at', { ascending: false })

      if (input?.valueModel) query = query.eq('value_model', input.valueModel)
      if (input?.status) query = query.eq('status', input.status)
      if (input?.phase) query = query.eq('current_phase', input.phase)
      if (input?.leadTeamMemberId) query = query.eq('lead_team_member_id', input.leadTeamMemberId)
      if (input?.search) query = query.or(`name.ilike.%${input.search}%,reference_code.ilike.%${input.search}%`)

      const limit = input?.limit ?? 50
      query = query.limit(limit)
      if (input?.cursor) query = query.lt('id', input.cursor)

      const { data, error } = await query
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data ?? []
    }),

  // ── List for pipeline with task progress ──────────────────────
  listForPipeline: protectedProcedure
    .input(listAssetsInput.optional())
    .query(async ({ ctx, input }) => {
      const statusFilter = input?.includeArchived
        ? ['active', 'paused', 'archived'] as const
        : ['active', 'paused'] as const
      let query = ctx.db
        .from('assets')
        .select('*, team_members!assets_lead_team_member_id_fkey(id, full_name, role)')
        .eq('is_deleted', false)
        .in('status', statusFilter)
        .order('updated_at', { ascending: false })

      if (input?.valueModel) query = query.eq('value_model', input.valueModel)
      if (input?.status) query = query.eq('status', input.status)
      if (input?.phase) query = query.eq('current_phase', input.phase)
      if (input?.search) query = query.or(`name.ilike.%${input.search}%,reference_code.ilike.%${input.search}%`)
      query = query.limit(input?.limit ?? 50)

      const { data: assets, error } = await query
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      if (!assets || assets.length === 0) return []

      // Batch fetch task progress for all assets
      const assetIds = assets.map(a => a.id)
      const now = new Date().toISOString()
      const { data: tasks } = await ctx.db
        .from('tasks')
        .select('asset_id, status, title, sort_order, due_date')
        .in('asset_id', assetIds)
        .eq('is_deleted', false)
        .eq('is_hidden', false)

      // Compute progress + overdue per asset
      const progressMap = new Map<string, { total: number; completed: number; nextTask: string | null; overdueCount: number }>()
      for (const t of tasks ?? []) {
        if (!progressMap.has(t.asset_id)) progressMap.set(t.asset_id, { total: 0, completed: 0, nextTask: null, overdueCount: 0 })
        const p = progressMap.get(t.asset_id)!
        p.total++
        if (t.status === 'done' || t.status === 'cancelled') p.completed++
        else {
          if (!p.nextTask) p.nextTask = t.title
          if (t.due_date && t.due_date < now) p.overdueCount++
        }
      }

      return assets.map(a => ({
        ...a,
        taskProgress: progressMap.get(a.id) ?? { total: 0, completed: 0, nextTask: null, overdueCount: 0 },
      }))
    }),

  // ── Get full asset hierarchy ───────────────────────────────────
  getById: protectedProcedure
    .input(assetIdInput)
    .query(async ({ ctx, input }) => {
      const { data: asset, error } = await ctx.db
        .from('assets')
        .select('*, team_members!assets_lead_team_member_id_fkey(*)')
        .eq('id', input.assetId)
        .single()

      if (error || !asset) throw new TRPCError({ code: 'NOT_FOUND', message: 'Asset not found' })

      // Fetch stages with nested tasks and subtasks
      const { data: stages } = await ctx.db
        .from('asset_stages')
        .select('*')
        .eq('asset_id', input.assetId)
        .eq('is_hidden', false)
        .order('phase')
        .order('sort_order')

      const stageIds = (stages ?? []).map(s => s.id)

      const { data: tasks } = stageIds.length > 0
        ? await ctx.db
            .from('tasks')
            .select('*, team_members!tasks_assigned_to_fkey(id, full_name)')
            .in('stage_id', stageIds)
            .eq('is_deleted', false)
            .eq('is_hidden', false)
            .order('sort_order')
        : { data: [] }

      const taskIds = (tasks ?? []).map(t => t.id)

      const { data: subtasks } = taskIds.length > 0
        ? await ctx.db
            .from('subtasks')
            .select('*')
            .in('task_id', taskIds)
            .eq('is_hidden', false)
            .order('sort_order')
        : { data: [] }

      const { data: documents } = await ctx.db
        .from('documents')
        .select('*')
        .eq('asset_id', input.assetId)
        .eq('is_current', true)
        .order('created_at', { ascending: false })

      const { data: activity } = await ctx.db
        .from('activity_log')
        .select('*, team_members!activity_log_performed_by_fkey(full_name)')
        .eq('asset_id', input.assetId)
        .order('performed_at', { ascending: false })
        .limit(100)

      const { data: comments } = await ctx.db
        .from('comments')
        .select('*, team_members!comments_author_id_fkey(id, full_name)')
        .eq('asset_id', input.assetId)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false })

      const { data: partners } = await ctx.db
        .from('asset_partners')
        .select('*, partners(*)')
        .eq('asset_id', input.assetId)

      return {
        asset,
        stages: stages ?? [],
        tasks: tasks ?? [],
        subtasks: subtasks ?? [],
        documents: documents ?? [],
        activity: activity ?? [],
        comments: comments ?? [],
        partners: partners ?? [],
      }
    }),

  // ── Create asset + instantiate workflow ─────────────────────────
  create: protectedProcedure
    .input(createAssetInput)
    .mutation(async ({ ctx, input }) => {
      // Generate unique reference code
      let refCode = ''
      for (let attempt = 0; attempt < 5; attempt++) {
        refCode = `PC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`
        const { data: existing } = await ctx.db
          .from('assets')
          .select('id')
          .eq('reference_code', refCode)
          .maybeSingle()
        if (!existing) break
        if (attempt === 4) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Could not generate unique reference code' })
      }

      const { data: asset, error } = await ctx.db
        .from('assets')
        .insert({
          name: input.name,
          asset_type: input.assetType,
          reference_code: refCode,
          description: input.description ?? null,
          value_model: input.valueModel ?? null,
          claimed_value: input.claimedValue ?? null,
          asset_holder_entity: input.holderEntity,
          origin: input.origin ?? null,
          carat_weight: input.caratWeight ?? null,
          asset_count: input.assetCount ?? null,
          current_phase: 'lead' as const,
          status: 'active' as const,
          lead_team_member_id: input.leadTeamMemberId ?? ctx.user.id,
        })
        .select()
        .single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })

      // Instantiate workflow from templates (if value model selected)
      // Passes asset_type so asset-type-specific templates take precedence if they exist
      let workflowResult = null
      if (input.valueModel) {
        const { data: rpcResult } = await ctx.db.rpc('instantiate_workflow', {
          p_asset_id: asset.id,
          p_value_model: input.valueModel,
          p_asset_type: input.assetType ?? null,
        })
        workflowResult = rpcResult
      }

      return { asset, workflow: workflowResult }
    }),

  // ── Update asset fields ────────────────────────────────────────
  update: protectedProcedure
    .input(updateAssetInput)
    .mutation(async ({ ctx, input }) => {
      const { assetId, ...fields } = input
      const updates: Record<string, unknown> = {}

      if (fields.name !== undefined) updates.name = fields.name
      if (fields.description !== undefined) updates.description = fields.description
      if (fields.claimedValue !== undefined) updates.claimed_value = fields.claimedValue
      if (fields.appraisedValue !== undefined) updates.appraised_value = fields.appraisedValue
      if (fields.valueModel !== undefined) updates.value_model = fields.valueModel
      if (fields.origin !== undefined) updates.origin = fields.origin
      if (fields.caratWeight !== undefined) updates.carat_weight = fields.caratWeight
      if (fields.assetCount !== undefined) updates.asset_count = fields.assetCount
      if (fields.currentLocation !== undefined) updates.current_location = fields.currentLocation
      if (fields.spvName !== undefined) updates.spv_name = fields.spvName
      if (fields.spvEin !== undefined) updates.spv_ein = fields.spvEin
      if (fields.leadTeamMemberId !== undefined) updates.lead_team_member_id = fields.leadTeamMemberId
      if (fields.metadata !== undefined) updates.metadata = fields.metadata
      if (fields.targetCompletionDate !== undefined) updates.target_completion_date = fields.targetCompletionDate
      if (fields.assetType !== undefined) updates.asset_type = fields.assetType
      if (fields.holderEntity !== undefined) updates.asset_holder_entity = fields.holderEntity
      if (fields.status !== undefined) updates.status = fields.status

      if (Object.keys(updates).length === 0) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'No fields to update' })
      }

      const { data, error } = await ctx.db
        .from('assets')
        .update(updates as never)
        .eq('id', assetId)
        .select()
        .single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  // ── Advance phase (enforced gates with override) ────────────────
  advancePhase: protectedProcedure
    .input(advancePhaseInput)
    .mutation(async ({ ctx, input }) => {
      // Pre-check: find incomplete tasks in current phase gate stages
      if (!input.force) {
        const { data: asset } = await ctx.db.from('assets').select('current_phase').eq('id', input.assetId).single()
        if (asset) {
          const { data: gateStages } = await ctx.db
            .from('asset_stages')
            .select('id, name')
            .eq('asset_id', input.assetId)
            .eq('phase', asset.current_phase)
            .eq('is_gate', true)
          if (gateStages && gateStages.length > 0) {
            const gateIds = gateStages.map(s => s.id)
            const { data: incompleteTasks } = await ctx.db
              .from('tasks')
              .select('id, title, status, stage_id')
              .in('stage_id', gateIds)
              .eq('is_deleted', false)
              .not('status', 'in', '("done","cancelled")')
            if (incompleteTasks && incompleteTasks.length > 0) {
              return {
                blocked: true,
                warnings: incompleteTasks.map(t => ({
                  taskId: t.id,
                  taskTitle: t.title,
                  stageName: gateStages.find(s => s.id === t.stage_id)?.name ?? '',
                })),
                requiresOverride: true,
              }
            }
          }
        }
      }

      // Proceed with advance (either no blockers or force=true with reason)
      const { data, error } = await ctx.db.rpc('advance_phase', {
        p_asset_id: input.assetId,
        p_target_phase: input.targetPhase,
        p_force: input.force,
        p_override_reason: input.overrideReason ?? undefined,
      })

      if (error) {
        // Fallback: direct update if RPC fails (e.g., current_setting issue)
        const { data: asset, error: updateError } = await ctx.db
          .from('assets')
          .update({ current_phase: input.targetPhase } as never)
          .eq('id', input.assetId)
          .select()
          .single()

        if (updateError) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: updateError.message })
        return { success: true, new_phase: input.targetPhase, warnings: [], was_overridden: false, asset }
      }

      // Notify all team members about phase advance
      const { data: teamMembers } = await ctx.db
        .from('team_members')
        .select('id')
        .eq('is_active', true)
        .neq('id', ctx.user.id)

      if (teamMembers && teamMembers.length > 0) {
        const { data: asset } = await ctx.db.from('assets').select('name').eq('id', input.assetId).single()
        const assetName = asset?.name ?? 'Asset'
        const notifications = teamMembers.map((m) => ({
          recipient_id: m.id,
          title: 'Phase advanced',
          message: `${ctx.user.full_name} advanced "${assetName}" to ${input.targetPhase.replace('_', ' ')}`,
          type: 'phase_advanced' as never,
          asset_id: input.assetId,
        }))
        await ctx.db.from('notifications').insert(notifications as never[])
      }

      return data
    }),

  // ── Archive asset ──────────────────────────────────────────────
  archive: protectedProcedure
    .input(archiveAssetInput)
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.db
        .from('assets')
        .update({
          status: 'archived' as const,
          termination_reason: input.reason,
        } as never)
        .eq('id', input.assetId)
        .select()
        .single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  // ── Get pipeline stats ─────────────────────────────────────────
  getStats: protectedProcedure
    .input(listAssetsInput.optional())
    .query(async ({ ctx, input }) => {
      let query = ctx.db
        .from('assets')
        .select('appraised_value, claimed_value, current_phase, status, created_at, value_model')
        .eq('is_deleted', false)

      if (input?.valueModel) query = query.eq('value_model', input.valueModel)
      if (input?.status) query = query.eq('status', input.status)

      const { data: assets } = await query
      const list = assets ?? []

      const active = list.filter(a => a.status === 'active' || a.status === 'paused')
      const totalAum = active.reduce((sum, a) => sum + (a.appraised_value ?? a.claimed_value ?? 0), 0)

      const avgDays = active.length > 0
        ? Math.round(active.reduce((sum, a) => {
            return sum + (Date.now() - new Date(a.created_at).getTime()) / 86_400_000
          }, 0) / active.length)
        : 0

      // Phase distribution
      const phaseDistribution: Record<string, number> = {}
      for (const a of list) {
        phaseDistribution[a.current_phase] = (phaseDistribution[a.current_phase] ?? 0) + 1
      }

      // Model distribution
      const modelDistribution: Record<string, number> = {}
      for (const a of list) {
        const model = a.value_model ?? 'unassigned'
        modelDistribution[model] = (modelDistribution[model] ?? 0) + 1
      }

      return {
        totalAum,
        activeCount: active.length,
        totalCount: list.length,
        avgDays,
        phaseDistribution,
        modelDistribution,
      }
    }),

  // ── Instantiate workflow on existing asset ──────────────────────
  instantiateWorkflow: protectedProcedure
    .input(assetIdInput.extend({
      valueModel: createAssetInput.shape.valueModel.unwrap(),
      assetType: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.db.rpc('instantiate_workflow', {
        p_asset_id: input.assetId,
        p_value_model: input.valueModel,
        p_asset_type: input.assetType ?? null,
      })

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      // Invalidate from caller side
      return data
    }),

  // ── Pivot value model (archive old phases 4-6, instantiate new) ──
  pivotValueModel: protectedProcedure
    .input(z.object({
      assetId: z.string().uuid(),
      newValueModel: z.enum(['tokenization', 'fractional_securities', 'debt_instrument', 'broker_sale', 'barter']),
      reason: z.string().min(1).max(2000),
    }))
    .mutation(async ({ ctx, input }) => {
      // 1. Get current asset
      const { data: asset } = await ctx.db.from('assets')
        .select('id, value_model, asset_type, name').eq('id', input.assetId).single()
      if (!asset) throw new TRPCError({ code: 'NOT_FOUND', message: 'Asset not found' })

      const oldModel = asset.value_model
      if (oldModel === input.newValueModel) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'New value model is the same as current' })
      }

      // 2. Count in-progress/done tasks in phases 4-6 (impact check)
      const { data: impactedTasks } = await ctx.db.from('tasks')
        .select('id, title, status, stage_id')
        .eq('asset_id', input.assetId)
        .eq('is_deleted', false)
        .in('status', ['in_progress', 'done', 'blocked'] as never[])

      const { data: phase456Stages } = await ctx.db.from('asset_stages')
        .select('id, phase, name, status')
        .eq('asset_id', input.assetId)
        .in('phase', ['security', 'value_creation', 'distribution'] as never[])
        .eq('is_hidden', false)

      const phase456Ids = new Set((phase456Stages ?? []).map(s => s.id))
      const affectedTasks = (impactedTasks ?? []).filter(t => phase456Ids.has(t.stage_id))

      // 3. Archive old phases 4-6: mark stages as skipped + hidden
      if (phase456Stages && phase456Stages.length > 0) {
        const stageIds = phase456Stages.map(s => s.id)
        await ctx.db.from('asset_stages')
          .update({ status: 'skipped', is_hidden: true } as never)
          .in('id', stageIds)

        // Also mark their tasks as cancelled
        await ctx.db.from('tasks')
          .update({ status: 'cancelled' } as never)
          .in('stage_id', stageIds)
          .eq('is_deleted', false)
          .in('status', ['todo', 'in_progress', 'blocked'] as never[])
      }

      // 4. Find and apply new model-specific template (phases 4-6 only)
      const { data: newTemplate } = await ctx.db.from('workflow_templates')
        .select('id')
        .eq('value_model', input.newValueModel as never)
        .eq('is_default', true)
        .eq('is_system', true)
        .maybeSingle()

      let stagesCreated = 0
      if (newTemplate) {
        await ctx.db.rpc('instantiate_from_template', {
          p_asset_id: input.assetId,
          p_template_id: newTemplate.id,
        })
        const { count } = await ctx.db.from('asset_stages')
          .select('id', { count: 'exact', head: true })
          .eq('asset_id', input.assetId)
          .in('phase', ['security', 'value_creation', 'distribution'] as never[])
          .eq('is_hidden', false)
        stagesCreated = count ?? 0
      }

      // 5. Update asset value_model
      await ctx.db.from('assets')
        .update({ value_model: input.newValueModel } as never)
        .eq('id', input.assetId)

      // 6. Log the pivot
      await ctx.db.from('activity_log').insert({
        asset_id: input.assetId,
        entity_type: 'asset',
        action: 'value_model_pivoted' as never,
        detail: `Pivoted from ${oldModel ?? 'undecided'} to ${input.newValueModel}. Reason: ${input.reason}. ${(phase456Stages ?? []).length} stages archived, ${stagesCreated} new stages created. ${affectedTasks.length} in-progress tasks affected.`,
        performed_by: ctx.user.id,
        performed_at: new Date().toISOString(),
      } as never)

      return {
        oldModel,
        newModel: input.newValueModel,
        archivedStages: (phase456Stages ?? []).length,
        newStages: stagesCreated,
        affectedTasks: affectedTasks.length,
      }
    }),

  // ── Duplicate asset ────────────────────────────────────────────
  duplicate: protectedProcedure
    .input(assetIdInput)
    .mutation(async ({ ctx, input }) => {
      const { data: original, error: fetchErr } = await ctx.db
        .from('assets')
        .select('*')
        .eq('id', input.assetId)
        .single()
      if (fetchErr || !original) throw new TRPCError({ code: 'NOT_FOUND', message: 'Asset not found' })

      const refCode = `PC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
      const { data: newAsset, error: insertErr } = await ctx.db
        .from('assets')
        .insert({
          name: `${original.name} (Copy)`,
          reference_code: refCode,
          asset_type: original.asset_type,
          value_model: original.value_model,
          asset_holder_entity: original.asset_holder_entity,
          claimed_value: original.claimed_value,
          description: original.description,
          currency: original.currency,
          origin: original.origin,
          current_phase: 'lead',
          status: 'active',
          lead_team_member_id: ctx.user.id,
          metadata: original.metadata,
        } as never)
        .select()
        .single()

      if (insertErr) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: insertErr.message })
      return newAsset
    }),
})
