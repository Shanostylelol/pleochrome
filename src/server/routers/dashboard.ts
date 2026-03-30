import { TRPCError } from '@trpc/server'
import { createRouter, protectedProcedure } from '../trpc'

export const dashboardRouter = createRouter({
  getPipelineFunnel: protectedProcedure.query(async ({ ctx }) => {
    const phases = [
      'phase_1_intake', 'phase_2_certification', 'phase_3_custody',
      'phase_4_legal', 'phase_5_tokenization', 'phase_6_regulatory',
      'phase_7_distribution', 'phase_8_ongoing',
    ]
    const phaseLabels: Record<string, string> = {
      phase_1_intake: 'Intake',
      phase_2_certification: 'Certification',
      phase_3_custody: 'Custody',
      phase_4_legal: 'Legal',
      phase_5_tokenization: 'Execution',
      phase_6_regulatory: 'Regulatory',
      phase_7_distribution: 'Distribution',
      phase_8_ongoing: 'Ongoing',
    }

    const { data: assets, error } = await ctx.db
      .from('assets')
      .select('current_phase, status')
      .in('status', ['prospect', 'screening', 'active', 'paused'])

    if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })

    const funnel = phases.map((phase) => ({
      phase: phaseLabels[phase] ?? phase,
      count: (assets ?? []).filter((a) => a.current_phase === phase).length,
    }))

    return funnel
  }),

  getAssetsByPath: protectedProcedure.query(async ({ ctx }) => {
    const { data: assets, error } = await ctx.db
      .from('assets')
      .select('value_path, offering_value, claimed_value')
      .in('status', ['prospect', 'screening', 'active', 'paused'])

    if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })

    const pathLabels: Record<string, string> = {
      fractional_securities: 'Fractional',
      tokenization: 'Tokenization',
      debt_instruments: 'Debt',
      evaluating: 'Evaluating',
    }

    const grouped: Record<string, { count: number; value: number }> = {}
    for (const a of assets ?? []) {
      const path = a.value_path ?? 'evaluating'
      if (!grouped[path]) grouped[path] = { count: 0, value: 0 }
      grouped[path].count++
      grouped[path].value += a.offering_value ?? a.claimed_value ?? 0
    }

    return Object.entries(grouped).map(([path, data]) => ({
      name: pathLabels[path] ?? path,
      path,
      count: data.count,
      value: data.value,
    }))
  }),

  getComplianceSummary: protectedProcedure.query(async ({ ctx }) => {
    const { data, error } = await ctx.db
      .from('v_pipeline_board')
      .select('id, name, current_phase, total_steps, completed_steps, status')
      .in('status', ['prospect', 'screening', 'active', 'paused'])

    if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })

    return (data ?? []).map((a) => ({
      id: a.id,
      name: a.name,
      phase: a.current_phase,
      totalSteps: a.total_steps ?? 0,
      completedSteps: a.completed_steps ?? 0,
      score: a.total_steps ? Math.round(((a.completed_steps ?? 0) / a.total_steps) * 100) : 0,
    }))
  }),

  getRiskIndicators: protectedProcedure.query(async ({ ctx }) => {
    const risks: Array<{ label: string; severity: 'low' | 'medium' | 'high'; detail: string }> = []

    // Check for blocked steps
    const { data: blockedSteps } = await ctx.db
      .from('asset_steps')
      .select('id, step_title, blocked_reason, assets!asset_steps_asset_id_fkey(name)')
      .eq('status', 'blocked')

    if (blockedSteps && blockedSteps.length > 0) {
      risks.push({
        label: `${blockedSteps.length} blocked governance steps`,
        severity: 'high',
        detail: blockedSteps.map((s) => `${(s.assets as { name: string } | null)?.name}: ${s.step_title}`).join(', '),
      })
    }

    // Check for stale assets (no activity in 14+ days)
    const { data: staleAssets } = await ctx.db
      .from('assets')
      .select('id, name, updated_at')
      .in('status', ['prospect', 'screening', 'active'])
      .lt('updated_at', new Date(Date.now() - 14 * 86400000).toISOString())

    if (staleAssets && staleAssets.length > 0) {
      risks.push({
        label: `${staleAssets.length} stale assets (no updates in 14+ days)`,
        severity: 'medium',
        detail: staleAssets.map((a) => a.name).join(', '),
      })
    }

    // Check for overdue tasks
    const { data: overdueTasks } = await ctx.db
      .from('tasks')
      .select('id')
      .in('status', ['todo', 'in_progress'])
      .lt('due_date', new Date().toISOString())

    if (overdueTasks && overdueTasks.length > 0) {
      risks.push({
        label: `${overdueTasks.length} overdue tasks`,
        severity: 'high',
        detail: `${overdueTasks.length} tasks past their due date`,
      })
    }

    if (risks.length === 0) {
      risks.push({ label: 'No risk indicators detected', severity: 'low', detail: 'All systems operational' })
    }

    return risks
  }),

  getRecentActivity: protectedProcedure.query(async ({ ctx }) => {
    const { data, error } = await ctx.db
      .from('activity_log')
      .select('*, team_members!activity_log_performed_by_fkey(full_name)')
      .order('performed_at', { ascending: false })
      .limit(10)

    if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
    return data ?? []
  }),
})
