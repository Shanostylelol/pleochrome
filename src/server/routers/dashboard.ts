import { TRPCError } from '@trpc/server'
import { createRouter, protectedProcedure } from '../trpc'

export const dashboardRouter = createRouter({
  getPipelineFunnel: protectedProcedure.query(async ({ ctx }) => {
    // V2 phases
    const phases = [
      'lead', 'intake', 'asset_maturity',
      'security', 'value_creation', 'distribution',
    ]
    const phaseLabels: Record<string, string> = {
      lead: 'Lead',
      intake: 'Intake',
      asset_maturity: 'Asset Maturity',
      security: 'Security',
      value_creation: 'Value Creation',
      distribution: 'Distribution',
    }

    const { data: assets, error } = await ctx.db
      .from('assets')
      .select('current_phase, status')
      .in('status', ['active', 'paused'])

    if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })

    const funnel = phases.map((phase) => ({
      phase,  // lowercase key for URL param
      label: phaseLabels[phase] ?? phase,
      count: (assets ?? []).filter((a) => a.current_phase === phase).length,
    }))

    return funnel
  }),

  getAssetsByPath: protectedProcedure.query(async ({ ctx }) => {
    const { data: assets, error } = await ctx.db
      .from('assets')
      .select('value_model, appraised_value, claimed_value')
      .in('status', ['active', 'paused'])

    if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })

    const pathLabels: Record<string, string> = {
      fractional_securities: 'Fractional',
      tokenization: 'Tokenization',
      debt_instrument: 'Debt',
      broker_sale: 'Broker Sale',
      barter: 'Barter',
    }

    const grouped: Record<string, { count: number; value: number }> = {}
    for (const a of assets ?? []) {
      const path = a.value_model ?? 'undecided'
      if (!grouped[path]) grouped[path] = { count: 0, value: 0 }
      grouped[path].count++
      grouped[path].value += a.appraised_value ?? a.claimed_value ?? 0
    }

    return Object.entries(grouped).map(([path, data]) => ({
      name: pathLabels[path] ?? path,
      path,
      count: data.count,
      value: data.value,
    }))
  }),

  getComplianceSummary: protectedProcedure.query(async ({ ctx }) => {
    const { data: assets, error } = await ctx.db
      .from('assets')
      .select('id, name, current_phase, status')
      .in('status', ['active', 'paused'])

    if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
    if (!assets || assets.length === 0) return []

    // Batch fetch all stage counts in one query
    const assetIds = assets.map(a => a.id)
    const { data: stages } = await ctx.db
      .from('asset_stages')
      .select('asset_id, status')
      .in('asset_id', assetIds)

    // Group in JS
    const stageMap = new Map<string, { total: number; completed: number }>()
    for (const s of stages ?? []) {
      if (!stageMap.has(s.asset_id)) stageMap.set(s.asset_id, { total: 0, completed: 0 })
      const m = stageMap.get(s.asset_id)!
      m.total++
      if (s.status === 'completed') m.completed++
    }

    return assets.map(a => {
      const { total = 0, completed = 0 } = stageMap.get(a.id) ?? {}
      return {
        id: a.id, name: a.name, phase: a.current_phase,
        totalSteps: total, completedSteps: completed,
        score: total > 0 ? Math.round((completed / total) * 100) : 0,
      }
    })
  }),

  getRiskIndicators: protectedProcedure.query(async ({ ctx }) => {
    const risks: Array<{ label: string; severity: 'low' | 'medium' | 'high'; detail: string; href?: string }> = []

    // Check for stale assets (no activity in 14+ days)
    const { data: staleAssets } = await ctx.db
      .from('assets')
      .select('id, name, updated_at')
      .in('status', ['active'])
      .lt('updated_at', new Date(Date.now() - 14 * 86400000).toISOString())

    if (staleAssets && staleAssets.length > 0) {
      risks.push({
        label: `${staleAssets.length} stale asset${staleAssets.length > 1 ? 's' : ''} (no updates in 14+ days)`,
        severity: 'medium',
        detail: staleAssets.map((a) => a.name).join(', '),
        href: '/crm/assets',
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
        label: `${overdueTasks.length} overdue task${overdueTasks.length > 1 ? 's' : ''}`,
        severity: 'high',
        detail: `${overdueTasks.length} tasks past their due date`,
        href: '/crm/tasks',
      })
    }

    // Check for blocked tasks
    const { count: blockedCount } = await ctx.db
      .from('tasks')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'blocked')
      .eq('is_deleted', false)

    if ((blockedCount ?? 0) > 0) {
      risks.push({
        label: `${blockedCount} blocked task${blockedCount === 1 ? '' : 's'}`,
        severity: 'high',
        detail: 'Tasks blocked and needing attention',
        href: '/crm/tasks',
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
      .select('*')
      .order('performed_at', { ascending: false })
      .limit(10)

    if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
    return data ?? []
  }),

  // ── My Day (personalized dashboard) ────────────────────────────
  getMyDay: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id

    // My tasks (open, assigned to me)
    const { data: myTasks } = await ctx.db
      .from('tasks')
      .select('id, title, status, due_date, task_type, asset_id, assets!tasks_asset_id_fkey(name)')
      .eq('assigned_to', userId)
      .eq('is_deleted', false)
      .in('status', ['todo', 'in_progress', 'blocked'] as never[])
      .order('due_date', { ascending: true, nullsFirst: false })
      .limit(10)

    // My pending approvals
    const { data: myApprovals } = await ctx.db
      .from('approvals')
      .select('id, task_id, requested_at, tasks!approvals_task_id_fkey(title, asset_id)')
      .eq('approver_id', userId)
      .eq('decision', 'pending')
      .order('requested_at')
      .limit(10)

    // My upcoming reminders (next 7 days)
    const weekFromNow = new Date(Date.now() + 7 * 86_400_000).toISOString()
    const { data: myReminders } = await ctx.db
      .from('reminders')
      .select('id, title, remind_at, asset_id, status')
      .eq('remind_user_id', userId)
      .in('status', ['pending', 'snoozed'])
      .lt('remind_at', weekFromNow)
      .order('remind_at')
      .limit(10)

    // Unread notifications count
    const { count: unreadCount } = await ctx.db
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('recipient_id', userId)
      .eq('is_read', false)
      .eq('is_dismissed', false)

    return {
      tasks: myTasks ?? [],
      approvals: myApprovals ?? [],
      reminders: myReminders ?? [],
      unreadNotifications: unreadCount ?? 0,
    }
  }),

  // ── Pipeline Velocity ─────────────────────────────────
  // Returns: assets advanced per phase in last 30 days + avg days in current phase
  getPipelineVelocity: protectedProcedure.query(async ({ ctx }) => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 86_400_000).toISOString()
    const phases = ['lead', 'intake', 'asset_maturity', 'security', 'value_creation', 'distribution']
    const phaseLabels: Record<string, string> = {
      lead: 'Lead', intake: 'Intake', asset_maturity: 'Asset Maturity',
      security: 'Security', value_creation: 'Value Creation', distribution: 'Distribution',
    }

    // Count phase_advanced events per phase in last 30 days
    const { data: advanceEvents } = await ctx.db
      .from('activity_log')
      .select('detail')
      .eq('action', 'phase_advanced' as never)
      .gte('performed_at', thirtyDaysAgo)

    // Count from detail field "to: <phase>"
    const throughput: Record<string, number> = {}
    ;(advanceEvents ?? []).forEach((e) => {
      const detail = (e.detail as string) ?? ''
      const match = detail.match(/to[:\s]+(\w+)/i)
      if (match) {
        const ph = match[1].toLowerCase()
        throughput[ph] = (throughput[ph] ?? 0) + 1
      }
    })

    // Avg days in current phase (using updated_at as proxy for last phase change)
    const { data: activeAssets } = await ctx.db
      .from('assets')
      .select('current_phase, updated_at')
      .in('status', ['active', 'paused'])
      .eq('is_deleted', false)

    const phaseDays: Record<string, number[]> = {}
    ;(activeAssets ?? []).forEach((a) => {
      if (!a.current_phase || !a.updated_at) return
      const days = Math.floor((Date.now() - new Date(a.updated_at).getTime()) / 86_400_000)
      ;(phaseDays[a.current_phase] ??= []).push(days)
    })

    return phases.map((phase) => {
      const days = phaseDays[phase] ?? []
      const avgDays = days.length > 0 ? Math.round(days.reduce((a, b) => a + b, 0) / days.length) : null
      return {
        phase,
        label: phaseLabels[phase],
        advanced30d: throughput[phase] ?? 0,
        avgDaysInPhase: avgDays,
        assetCount: days.length,
      }
    })
  }),
})
