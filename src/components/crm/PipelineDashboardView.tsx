'use client'

import { trpc } from '@/lib/trpc'
import { NeuCard, NeuBadge } from '@/components/ui'
import Link from 'next/link'
import { AlertTriangle, CheckSquare, ShieldCheck, Bell, Calendar } from 'lucide-react'
import { TASK_TYPES, type TaskTypeKey } from '@/lib/constants'

function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`
  return `$${value.toFixed(0)}`
}

export function PipelineDashboardView() {
  const { data: funnel = [] } = trpc.dashboard.getPipelineFunnel.useQuery()
  const { data: pathData = [] } = trpc.dashboard.getAssetsByPath.useQuery()
  const { data: risks = [] } = trpc.dashboard.getRiskIndicators.useQuery()
  const { data: myDay } = trpc.dashboard.getMyDay.useQuery()

  const maxFunnel = Math.max(...funnel.map((f) => f.count), 1)
  const totalValue = pathData.reduce((s, p) => s + p.value, 0)
  const totalAssets = pathData.reduce((s, p) => s + p.count, 0)

  const pathColors: Record<string, string> = {
    fractional_securities: 'var(--emerald)', tokenization: 'var(--teal)',
    debt_instrument: 'var(--sapphire)', broker_sale: 'var(--amber)', barter: 'var(--text-muted)',
  }

  const myTasks = myDay?.tasks ?? []
  const myApprovals = myDay?.approvals ?? []
  const myReminders = myDay?.reminders ?? []

  return (
    <div className="space-y-6">
      {/* My Day — Personal Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* My Tasks */}
        <NeuCard variant="raised" padding="md">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
            <CheckSquare className="h-4 w-4 text-[var(--teal)]" /> My Tasks
            {myTasks.length > 0 && (
              <span className="ml-auto text-xs font-bold text-[var(--teal)]">{myTasks.length}</span>
            )}
          </h3>
          {myTasks.length === 0 ? (
            <p className="text-xs text-[var(--text-muted)] py-4 text-center">No open tasks</p>
          ) : (
            <div className="space-y-1.5">
              {myTasks.slice(0, 5).map((t) => {
                const taskCfg = TASK_TYPES[t.task_type as TaskTypeKey]
                const assetData = t.assets as { name: string } | null
                return (
                  <Link key={t.id} href={`/crm/assets/${t.asset_id}?tab=workflow&taskId=${t.id}`} className="block">
                    <div className="flex items-center gap-2 px-2 py-1.5 rounded-[var(--radius-sm)] hover:bg-[var(--bg-elevated)] transition-colors">
                      <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: taskCfg?.color ?? 'var(--text-muted)' }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-[var(--text-primary)] truncate">{t.title}</p>
                        {assetData?.name && <p className="text-[10px] text-[var(--text-muted)] truncate">{assetData.name}</p>}
                      </div>
                      {t.due_date && (
                        <span className="text-[10px] text-[var(--text-muted)] shrink-0" style={{ fontFamily: 'var(--font-mono)' }}>
                          {new Date(t.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </NeuCard>

        {/* Pending Approvals */}
        <NeuCard variant="raised" padding="md">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[var(--amber)]" /> Pending Approvals
            {myApprovals.length > 0 && (
              <span className="ml-auto text-xs font-bold text-[var(--amber)]">{myApprovals.length}</span>
            )}
          </h3>
          {myApprovals.length === 0 ? (
            <p className="text-xs text-[var(--text-muted)] py-4 text-center">No pending approvals</p>
          ) : (
            <div className="space-y-1.5">
              {myApprovals.slice(0, 5).map((a) => {
                const taskData = a.tasks as { title: string; asset_id: string } | null
                return (
                  <div key={a.id} className="flex items-center gap-2 px-2 py-1.5 rounded-[var(--radius-sm)] hover:bg-[var(--bg-elevated)] transition-colors">
                    <NeuBadge color="amber" dot />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-[var(--text-primary)] truncate">{taskData?.title ?? 'Approval'}</p>
                      <p className="text-[10px] text-[var(--text-muted)]">
                        Requested {new Date(a.requested_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </NeuCard>

        {/* Upcoming Reminders */}
        <NeuCard variant="raised" padding="md">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
            <Bell className="h-4 w-4 text-[var(--amethyst)]" /> Reminders (7 days)
            {myReminders.length > 0 && (
              <span className="ml-auto text-xs font-bold text-[var(--amethyst)]">{myReminders.length}</span>
            )}
          </h3>
          {myReminders.length === 0 ? (
            <p className="text-xs text-[var(--text-muted)] py-4 text-center">No upcoming reminders</p>
          ) : (
            <div className="space-y-1.5">
              {myReminders.slice(0, 5).map((r) => (
                <div key={r.id} className="flex items-center gap-2 px-2 py-1.5 rounded-[var(--radius-sm)] hover:bg-[var(--bg-elevated)] transition-colors">
                  <Calendar className="h-3.5 w-3.5 text-[var(--amethyst)] shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-[var(--text-primary)] truncate">{r.title}</p>
                  </div>
                  <span className="text-[10px] text-[var(--text-muted)] shrink-0" style={{ fontFamily: 'var(--font-mono)' }}>
                    {new Date(r.remind_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </NeuCard>
      </div>

      {/* Pipeline Funnel */}
      <NeuCard variant="raised" padding="md">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Pipeline Funnel</h3>
        <div className="space-y-2">
          {funnel.map((f) => (
            <div key={f.phase} className="flex items-center gap-3">
              <span className="text-xs text-[var(--text-muted)] w-24 text-right truncate">{f.phase}</span>
              <div className="flex-1 h-7 rounded-[var(--radius-sm)] bg-[var(--bg-body)] shadow-[var(--shadow-pressed)] overflow-hidden">
                <div className="h-full rounded-[var(--radius-sm)] bg-[var(--teal)] transition-all"
                  style={{ width: `${Math.max((f.count / maxFunnel) * 100, f.count > 0 ? 8 : 0)}%` }} />
              </div>
              <span className="text-sm font-bold text-[var(--text-primary)] w-8 text-right">{f.count}</span>
            </div>
          ))}
        </div>
      </NeuCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* AUM by Model */}
        <NeuCard variant="raised" padding="md">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">AUM by Model</h3>
          {pathData.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)] text-center py-6">No assets yet</p>
          ) : (
            <div className="space-y-3">
              {pathData.map((p) => {
                const pct = totalValue > 0 ? (p.value / totalValue) * 100 : 0
                return (
                  <div key={p.path}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-[var(--text-secondary)]">{p.name}</span>
                      <span className="text-xs text-[var(--text-muted)]">{p.count} assets &middot; {formatCurrency(p.value)}</span>
                    </div>
                    <div className="h-3 rounded-full bg-[var(--bg-body)] shadow-[var(--shadow-pressed)] overflow-hidden">
                      <div className="h-full rounded-full transition-all"
                        style={{ width: `${Math.max(pct, p.value > 0 ? 5 : 0)}%`, backgroundColor: pathColors[p.path] ?? 'var(--teal)' }} />
                    </div>
                  </div>
                )
              })}
              <div className="pt-2 border-t border-[var(--border)] flex justify-between">
                <span className="text-xs font-semibold text-[var(--text-primary)]">{totalAssets} total assets</span>
                <span className="text-xs font-semibold text-[var(--text-primary)]">{formatCurrency(totalValue)} AUM</span>
              </div>
            </div>
          )}
        </NeuCard>

        {/* Risk Indicators */}
        <NeuCard variant="raised" padding="md">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Risk Indicators</h3>
          <div className="space-y-2">
            {risks.map((risk, i) => (
              <div key={i} className="flex items-start gap-3 px-3 py-2 rounded-[var(--radius-md)] bg-[var(--bg-body)] shadow-[var(--shadow-pressed)]">
                <AlertTriangle className={`h-4 w-4 shrink-0 mt-0.5 ${
                  risk.severity === 'high' ? 'text-[var(--ruby)]' : risk.severity === 'medium' ? 'text-[var(--amber)]' : 'text-[var(--chartreuse)]'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[var(--text-primary)]">{risk.label}</p>
                  <p className="text-xs text-[var(--text-muted)] truncate">{risk.detail}</p>
                </div>
                <NeuBadge color={risk.severity === 'high' ? 'ruby' : risk.severity === 'medium' ? 'amber' : 'chartreuse'} size="sm">
                  {risk.severity}
                </NeuBadge>
              </div>
            ))}
          </div>
        </NeuCard>
      </div>
    </div>
  )
}
