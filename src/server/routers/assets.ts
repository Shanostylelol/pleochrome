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
      const refCode = `PC-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`

      const { data: existing } = await ctx.db
        .from('assets')
        .select('id')
        .eq('reference_code', refCode)
        .maybeSingle()

      if (existing) {
        throw new TRPCError({ code: 'CONFLICT', message: 'Reference code already exists. Please try again.' })
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
      return data
    }),

  updatePhase: protectedProcedure
    .input(
      z.object({
        assetId: z.string().uuid(),
        newPhase: z.enum([
          'phase_0_foundation', 'phase_1_intake', 'phase_2_certification',
          'phase_3_custody', 'phase_4_legal', 'phase_5_tokenization',
          'phase_6_regulatory', 'phase_7_distribution', 'phase_8_ongoing',
        ]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.db
        .from('assets')
        .update({ current_phase: input.newPhase })
        .eq('id', input.assetId)
        .select()
        .single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),
})
