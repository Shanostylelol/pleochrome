import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { createRouter, protectedProcedure } from '../trpc'

export const assetsRouter = createRouter({
  list: protectedProcedure
    .input(
      z.object({
        pathFilter: z.enum(['fractional_securities', 'tokenization', 'debt_instruments']).optional(),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      let query = ctx.db
        .from('v_pipeline_board')
        .select('*')
        .order('current_phase', { ascending: true })
        .order('updated_at', { ascending: false })

      if (input?.pathFilter) {
        query = query.eq('value_path', input.pathFilter)
      }

      const { data, error } = await query
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data ?? []
    }),

  getById: protectedProcedure
    .input(z.object({ assetId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.db
        .from('assets')
        .select('*, team_members!assets_lead_team_member_id_fkey(*)')
        .eq('id', input.assetId)
        .single()

      if (error) throw new TRPCError({ code: 'NOT_FOUND', message: 'Asset not found' })

      const { data: steps } = await ctx.db
        .from('asset_steps')
        .select('*')
        .eq('asset_id', input.assetId)
        .order('phase_number', { ascending: true })
        .order('step_number', { ascending: true })

      const { data: documents } = await ctx.db
        .from('documents')
        .select('*')
        .eq('asset_id', input.assetId)
        .order('created_at', { ascending: false })

      const { data: tasks } = await ctx.db
        .from('tasks')
        .select('*')
        .eq('asset_id', input.assetId)
        .order('created_at', { ascending: false })

      const { data: activity } = await ctx.db
        .from('activity_log')
        .select('*')
        .eq('asset_id', input.assetId)
        .order('created_at', { ascending: false })
        .limit(50)

      const { data: comments } = await ctx.db
        .from('comments')
        .select('*, team_members(*)')
        .eq('entity_id', input.assetId)
        .eq('entity_type', 'asset')
        .order('created_at', { ascending: false })

      const { data: partners } = await ctx.db
        .from('asset_partners')
        .select('*, partners(*)')
        .eq('asset_id', input.assetId)

      return {
        asset: data,
        steps: steps ?? [],
        documents: documents ?? [],
        tasks: tasks ?? [],
        activity: activity ?? [],
        comments: comments ?? [],
        partners: partners ?? [],
      }
    }),

  getStats: protectedProcedure
    .input(
      z.object({
        pathFilter: z.enum(['fractional_securities', 'tokenization', 'debt_instruments']).optional(),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      let query = ctx.db
        .from('assets')
        .select('offering_value, claimed_value, current_phase, status, created_at')
        .in('status', ['prospect', 'screening', 'active', 'paused'])

      if (input?.pathFilter) {
        query = query.eq('value_path', input.pathFilter)
      }

      const { data: assets, error } = await query
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })

      const list = assets ?? []
      const totalAum = list.reduce((sum, a) => sum + (a.offering_value ?? a.claimed_value ?? 0), 0)
      const activeCount = list.length
      const avgDays = activeCount > 0
        ? Math.round(list.reduce((sum, a) => {
            const created = new Date(a.created_at).getTime()
            const now = Date.now()
            return sum + (now - created) / (1000 * 60 * 60 * 24)
          }, 0) / activeCount)
        : 0

      const { data: compliance } = await ctx.db
        .from('v_pipeline_board')
        .select('total_steps, completed_steps')
        .in('status', ['prospect', 'screening', 'active', 'paused'])

      const complianceList = compliance ?? []
      const totalSteps = complianceList.reduce((s, r) => s + (r.total_steps ?? 0), 0)
      const completedSteps = complianceList.reduce((s, r) => s + (r.completed_steps ?? 0), 0)
      const complianceScore = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0

      return {
        totalAum,
        activeCount,
        avgDays,
        complianceScore,
      }
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(255),
        assetType: z.enum(['gemstone', 'real_estate', 'precious_metal', 'mineral_rights', 'other']),
        valuePath: z.enum(['fractional_securities', 'tokenization', 'debt_instruments', 'evaluating']).default('evaluating'),
        estimatedValue: z.number().positive().optional(),
        holderEntity: z.string().min(1).max(255),
        description: z.string().max(2000).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Generate unique reference code with retry
      let refCode = ''
      for (let attempt = 0; attempt < 5; attempt++) {
        refCode = `PC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`
        const { data: existing } = await ctx.db
          .from('assets')
          .select('id')
          .eq('reference_code', refCode)
          .maybeSingle()
        if (!existing) break
        if (attempt === 4) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Could not generate unique reference code after 5 attempts' })
      }

      const { data, error } = await ctx.db
        .from('assets')
        .insert({
          name: input.name,
          asset_type: input.assetType,
          reference_code: refCode,
          value_path: input.valuePath,
          claimed_value: input.estimatedValue ?? null,
          asset_holder_entity: input.holderEntity,
          description: input.description ?? null,
          current_phase: 'phase_1_intake',
          status: 'prospect',
          lead_team_member_id: ctx.user.id,
        })
        .select()
        .single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })

      // Assemble governance workflow (skip if evaluating — no path yet)
      let stepsCreated = 0
      if (input.valuePath !== 'evaluating') {
        try {
          await ctx.db.rpc('assemble_asset_workflow', {
            p_asset_id: data.id,
            p_value_path: input.valuePath,
            p_partner_module_ids: [],
          })
          const { count } = await ctx.db.from('asset_steps').select('*', { count: 'exact', head: true }).eq('asset_id', data.id)
          stepsCreated = count ?? 0
        } catch (e) {
          console.error('[assets.create] Workflow assembly failed:', e)
        }
      }

      return { ...data, stepsCreated }
    }),

  update: protectedProcedure
    .input(z.object({
      assetId: z.string().uuid(),
      name: z.string().min(1).max(255).optional(),
      description: z.string().max(2000).optional(),
      claimedValue: z.number().positive().optional(),
      offeringValue: z.number().positive().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const updates: Record<string, unknown> = {}
      if (input.name !== undefined) updates.name = input.name
      if (input.description !== undefined) updates.description = input.description
      if (input.claimedValue !== undefined) updates.claimed_value = input.claimedValue
      if (input.offeringValue !== undefined) updates.offering_value = input.offeringValue

      const { data, error } = await ctx.db
        .from('assets')
        .update(updates as never)
        .eq('id', input.assetId)
        .select()
        .single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  updatePhase: protectedProcedure
    .input(z.object({
      assetId: z.string().uuid(),
      newPhase: z.enum([
        'phase_0_foundation', 'phase_1_intake', 'phase_2_certification',
        'phase_3_custody', 'phase_4_legal', 'phase_5_tokenization',
        'phase_6_regulatory', 'phase_7_distribution', 'phase_8_ongoing',
      ]),
      reason: z.string().optional(),
      force: z.boolean().default(false),
    }))
    .mutation(async ({ ctx, input }) => {
      // 1. Get current asset
      const { data: asset } = await ctx.db.from('assets').select('current_phase, status, name').eq('id', input.assetId).single()
      if (!asset) throw new TRPCError({ code: 'NOT_FOUND', message: 'Asset not found' })

      // 2. Validate sequential transition (unless force)
      const phaseOrder = ['phase_0_foundation', 'phase_1_intake', 'phase_2_certification', 'phase_3_custody', 'phase_4_legal', 'phase_5_tokenization', 'phase_6_regulatory', 'phase_7_distribution', 'phase_8_ongoing']
      const currentIdx = phaseOrder.indexOf(asset.current_phase)
      const newIdx = phaseOrder.indexOf(input.newPhase)

      if (!input.force && Math.abs(newIdx - currentIdx) > 1) {
        return { asset: null, gatesPassed: false, blockers: [`Cannot skip from ${asset.current_phase} to ${input.newPhase}. Transitions must be sequential.`] }
      }

      // 3. Check incomplete steps in current phase (only for forward transitions)
      if (!input.force && newIdx > currentIdx) {
        const { data: incompleteSteps } = await ctx.db
          .from('asset_steps')
          .select('name, status')
          .eq('asset_id', input.assetId)
          .eq('phase', asset.current_phase as never)
          .in('status', ['not_started', 'in_progress'] as never[])

        if (incompleteSteps && incompleteSteps.length > 0) {
          return {
            asset: null,
            gatesPassed: false,
            blockers: incompleteSteps.map((s: any) => `Step "${s.name}" is ${s.status}`)
          }
        }
      }

      // 4. Update phase
      const { data, error } = await ctx.db
        .from('assets')
        .update({ current_phase: input.newPhase } as never)
        .eq('id', input.assetId)
        .select()
        .single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return { asset: data, gatesPassed: true, blockers: [] }
    }),

  archive: protectedProcedure
    .input(z.object({
      assetId: z.string().uuid(),
      reason: z.string().min(1).max(1000),
    }))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.db
        .from('assets')
        .update({ status: 'archived', termination_reason: input.reason } as never)
        .eq('id', input.assetId)
        .select()
        .single()
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  assembleWorkflow: protectedProcedure
    .input(z.object({
      assetId: z.string().uuid(),
      valuePath: z.enum(['fractional_securities', 'tokenization', 'debt_instruments']),
      partnerModuleIds: z.array(z.string().uuid()).default([]),
    }))
    .mutation(async ({ ctx, input }) => {
      // Clear existing workflow
      await ctx.db.from('asset_task_instances').delete().eq('asset_id', input.assetId)
      await ctx.db.from('asset_steps').delete().eq('asset_id', input.assetId)

      // Assemble new workflow from governance requirements + partner modules
      const { error } = await ctx.db.rpc('assemble_asset_workflow', {
        p_asset_id: input.assetId,
        p_value_path: input.valuePath,
        p_partner_module_ids: input.partnerModuleIds,
      })
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })

      const { count: stepsCount } = await ctx.db.from('asset_steps').select('*', { count: 'exact', head: true }).eq('asset_id', input.assetId)
      const { count: tasksCount } = await ctx.db.from('asset_task_instances').select('*', { count: 'exact', head: true }).eq('asset_id', input.assetId)

      return { stepsCreated: stepsCount ?? 0, tasksCreated: tasksCount ?? 0 }
    }),
})
