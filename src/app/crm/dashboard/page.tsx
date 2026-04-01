'use client'

import { LayoutDashboard, AlertTriangle, CheckCircle2, Clock, Activity, Check, AlarmClock } from 'lucide-react'
import { NeuCard, NeuBadge, NeuProgress, NeuSkeleton } from '@/components/ui'
import { trpc } from '@/lib/trpc'
import { PHASES, type PhaseKey } from '@/lib/constants'
import Link from 'next/link'
import { TASK_TYPES, type TaskTypeKey } from '@/lib/constants'

const PHASE_COLORS: Record<string, string> = {
  lead: 'var(--gray)', intake: 'var(--emerald)', asset_maturity: 'var(--teal)',
  security: 'var(--sapphire)', value_creation: 'var(--amethyst)', distribution: 'var(--amber)',
}
const MODEL_COLORS: Record<string, string> = {
  fractional_securities: 'var(--emerald)', tokenization: 'var(--teal)', debt_instrument: 'var(--sapphire)',
  broker_sale: 'var(--amber)', barter: 'var(--amethyst)', undecided: 'var(--gray)',
}

export default function DashboardPage() {
  const { data: funnel, isLoading: fL } = trpc.dashboard.getPipelineFunnel.useQuery()
  const { data: byPath, isLoading: pL } = trpc.dashboard.getAssetsByPath.useQuery()
  const { data: risks, isLoading: rL } = trpc.dashboard.getRiskIndicators.useQuery()
  const { data: recent, isLoading: aL } = trpc.dashboard.getRecentActivity.useQuery()
  const { data: myDay, isLoading: mL } = trpc.dashboard.getMyDay.useQuery()
  const { data: comp, isLoading: cL } = trpc.dashboard.getComplianceSummary.useQuery()
  const { data: velocity, isLoading: vL } = trpc.dashboard.getPipelineVelocity.useQuery()

  // Safe typed access
  const funnelArr = funnel ?? []
  const pathArr = byPath ?? []
  const riskArr = risks ?? []
  const recentArr = recent ?? []
  const myDayObj = myDay ?? { tasks: [], approvals: [], reminders: [], unreadNotifications: 0 }
  const compArr = comp ?? []
  const velocityArr = velocity ?? []

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
          <LayoutDashboard className="h-6 w-6 inline mr-2 -mt-1" />Dashboard
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Your day at a glance</p>
      </div>

      {/* My Day — Actionable Items */}
      <NeuCard variant="raised" padding="md">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3">My Day</h2>
        {mL ? <NeuSkeleton variant="text" lines={4} /> : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* My Tasks */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--teal)]" />
                <span className="text-xs font-semibold text-[var(--text-secondary)]">My Tasks ({myDayObj.tasks?.length ?? 0})</span>
              </div>
              {(myDayObj.tasks ?? []).length === 0 ? (
                <p className="text-xs text-[var(--text-muted)]">No tasks assigned</p>
              ) : (myDayObj.tasks ?? []).slice(0, 5).map((t: any) => {
                const cfg = TASK_TYPES[t.task_type as TaskTypeKey]
                return (
                  <Link key={t.id} href={`/crm/assets/${t.asset_id}?tab=workflow&taskId=${t.id}`}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-[var(--radius-sm)] hover:bg-[var(--bg-elevated)] transition-colors text-xs">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: cfg?.color ?? 'var(--gray)' }} />
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-[var(--text-primary)]">{t.title}</p>
                      {t.assets?.name && <p className="truncate text-[var(--text-muted)] text-[10px]">{t.assets.name}</p>}
                    </div>
                    {t.due_date && (
                      <span className={`shrink-0 ${new Date(t.due_date).getTime() < Date.now() ? 'text-[var(--ruby)]' : 'text-[var(--text-muted)]'}`}>
                        {new Date(t.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
            {/* Approvals */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-[var(--amber)]" />
                <span className="text-xs font-semibold text-[var(--text-secondary)]">Approvals ({myDayObj.approvals?.length ?? 0})</span>
              </div>
              {(myDayObj.approvals ?? []).length === 0 ? (
                <p className="text-xs text-[var(--text-muted)]">No pending approvals</p>
              ) : (myDayObj.approvals ?? []).slice(0, 5).map((a: any) => (
                <Link key={a.id} href={`/crm/approvals`}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-[var(--radius-sm)] hover:bg-[var(--bg-elevated)] transition-colors text-xs">
                  <span className="truncate flex-1 text-[var(--text-primary)]">{(a.tasks as any)?.title ?? 'Approval'}</span>
                </Link>
              ))}
            </div>
            {/* Reminders */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-[var(--amethyst)]" />
                <span className="text-xs font-semibold text-[var(--text-secondary)]">Reminders ({myDayObj.reminders?.length ?? 0})</span>
              </div>
              {(myDayObj.reminders ?? []).length === 0 ? (
                <p className="text-xs text-[var(--text-muted)]">No upcoming reminders</p>
              ) : (myDayObj.reminders ?? []).slice(0, 5).map((r: any) => (
                <div key={r.id} className="flex items-center gap-1 px-2 py-1 rounded-[var(--radius-sm)] hover:bg-[var(--bg-elevated)] transition-colors group text-xs">
                  <span className="truncate flex-1 text-[var(--text-primary)]">{r.title}</span>
                  <span className="text-[var(--text-muted)] shrink-0">{new Date(r.remind_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  <DismissReminderButton reminderId={r.id} />
                </div>
              ))}
            </div>
          </div>
        )}
      </NeuCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pipeline Funnel */}
        <NeuCard variant="raised" padding="md">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3">Pipeline Funnel</h2>
          {fL ? <NeuSkeleton variant="text" lines={6} /> : (
            <div className="space-y-2">
              {funnelArr.map((p) => {
                const maxC = Math.max(...funnelArr.map(x => x.count), 1)
                return (
                  <Link key={p.phase} href={`/crm?phase=${p.phase}`} className="flex items-center gap-3 hover:bg-[var(--bg-elevated)] rounded-[var(--radius-sm)] px-1 -mx-1 transition-colors">
                    <span className="text-xs text-[var(--text-muted)] w-20 truncate">{(p as Record<string, unknown>).label as string ?? PHASES[p.phase as PhaseKey]?.label ?? p.phase}</span>
                    <div className="flex-1 h-5 rounded-[var(--radius-sm)] bg-[var(--bg-elevated)] overflow-hidden">
                      <div className="h-full rounded-[var(--radius-sm)]" style={{ width: `${(p.count / maxC) * 100}%`, background: PHASE_COLORS[p.phase] ?? 'var(--gray)' }} />
                    </div>
                    <span className="text-sm font-bold text-[var(--text-primary)] w-8 text-right tabular-nums">{p.count}</span>
                  </Link>
                )
              })}
            </div>
          )}
        </NeuCard>

        {/* AUM by Value Model */}
        <NeuCard variant="raised" padding="md">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3">AUM by Value Model</h2>
          {pL ? <NeuSkeleton variant="text" lines={5} /> : (
            <div className="space-y-2">
              {pathArr.map((m) => (
                <div key={m.path} className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: MODEL_COLORS[m.path] ?? 'var(--gray)' }} />
                  <span className="text-xs text-[var(--text-secondary)] flex-1">{m.name}</span>
                  <span className="text-xs text-[var(--text-muted)]">{m.count} assets</span>
                  <span className="text-sm font-bold text-[var(--text-primary)] tabular-nums">
                    ${(m.value / 1_000_000).toFixed(1)}M
                  </span>
                </div>
              ))}
            </div>
          )}
        </NeuCard>

        {/* Risk Indicators */}
        <NeuCard variant="raised" padding="md">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3">Risk Indicators</h2>
          {rL ? <NeuSkeleton variant="text" lines={3} /> : (
            <div className="space-y-3">
              {riskArr.map((r, i) => (
                <div key={i} className="flex items-center gap-3">
                  {r.severity === 'high' ? <AlertTriangle className="h-4 w-4 text-[var(--ruby)] shrink-0" />
                    : r.severity === 'medium' ? <AlertTriangle className="h-4 w-4 text-[var(--amber)] shrink-0" />
                    : <CheckCircle2 className="h-4 w-4 text-[var(--chartreuse)] shrink-0" />}
                  <span className="text-xs text-[var(--text-secondary)] flex-1">{r.label}</span>
                  <NeuBadge color={r.severity === 'high' ? 'ruby' : r.severity === 'medium' ? 'amber' : 'chartreuse'} size="sm">{r.severity}</NeuBadge>
                </div>
              ))}
            </div>
          )}
        </NeuCard>

        {/* Compliance Summary */}
        <NeuCard variant="raised" padding="md">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3">Compliance Scores</h2>
          {cL ? <NeuSkeleton variant="text" lines={4} /> : compArr.length === 0 ? (
            <p className="text-xs text-[var(--text-muted)]">No compliance data yet</p>
          ) : (
            <div className="space-y-2">
              {compArr.slice(0, 6).map((c) => (
                <div key={c.id} className="flex items-center gap-3">
                  <Link href={`/crm/assets/${c.id}`} className="text-xs text-[var(--text-primary)] hover:text-[var(--teal)] truncate flex-1">{c.name}</Link>
                  <div className="w-16"><NeuProgress value={c.score} color={c.score >= 80 ? 'emerald' : c.score >= 50 ? 'teal' : 'ruby'} size="sm" /></div>
                  <span className="text-xs font-bold text-[var(--text-primary)] tabular-nums w-8 text-right">{c.score}%</span>
                </div>
              ))}
            </div>
          )}
        </NeuCard>
      </div>

      {/* Pipeline Velocity */}
      <NeuCard variant="raised" padding="md">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3">Pipeline Velocity (last 30 days)</h2>
        {vL ? <NeuSkeleton variant="text" lines={6} /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left pb-2 font-semibold text-[var(--text-muted)] uppercase tracking-wider">Phase</th>
                  <th className="text-right pb-2 font-semibold text-[var(--text-muted)] uppercase tracking-wider">Assets</th>
                  <th className="text-right pb-2 font-semibold text-[var(--text-muted)] uppercase tracking-wider">Advanced</th>
                  <th className="text-right pb-2 font-semibold text-[var(--text-muted)] uppercase tracking-wider">Avg Days</th>
                </tr>
              </thead>
              <tbody>
                {velocityArr.map((v) => {
                  const ph = v.phase as string
                  const avgColor = (v.avgDaysInPhase ?? 0) > 60 ? 'var(--ruby)' : (v.avgDaysInPhase ?? 0) > 30 ? 'var(--amber)' : 'var(--chartreuse)'
                  return (
                    <tr key={ph} className="border-b border-[var(--border)] hover:bg-[var(--bg-elevated)] transition-colors">
                      <td className="py-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: PHASE_COLORS[ph] ?? 'var(--gray)' }} />
                          <span className="text-[var(--text-secondary)]">{v.label as string}</span>
                        </div>
                      </td>
                      <td className="py-2 text-right tabular-nums text-[var(--text-primary)] font-medium">{v.assetCount as number}</td>
                      <td className="py-2 text-right tabular-nums">
                        <NeuBadge color={(v.advanced30d as number) > 0 ? 'emerald' : 'gray'} size="sm">{v.advanced30d as number}</NeuBadge>
                      </td>
                      <td className="py-2 text-right tabular-nums font-bold" style={{ color: v.avgDaysInPhase != null ? avgColor : 'var(--text-muted)' }}>
                        {v.avgDaysInPhase != null ? `${v.avgDaysInPhase}d` : '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </NeuCard>

      {/* Recent Activity */}
      <NeuCard variant="raised" padding="md">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Recent Activity</h2>
          <Link href="/crm/activity" className="text-xs text-[var(--teal)] hover:text-[var(--text-primary)]">View all →</Link>
        </div>
        {aL ? <NeuSkeleton variant="text" lines={5} /> : recentArr.length === 0 ? (
          <p className="text-xs text-[var(--text-muted)]">No recent activity</p>
        ) : (
          <div className="space-y-2">
            {recentArr.slice(0, 8).map((a) => (
              <div key={a.id} className="flex items-center gap-2 text-xs">
                <NeuBadge color={a.action.includes('created') ? 'emerald' : a.action.includes('updated') ? 'teal' : 'gray'} size="sm">
                  {a.action.replace(/_/g, ' ')}
                </NeuBadge>
                <span className="text-[var(--text-secondary)] truncate flex-1">{a.detail ?? a.action.replace(/_/g, ' ')}</span>
                <span className="text-[var(--text-muted)] shrink-0">
                  {new Date(a.performed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            ))}
          </div>
        )}
      </NeuCard>
    </div>
  )
}

// DayStat removed — replaced with inline actionable items

function DismissReminderButton({ reminderId }: { reminderId: string }) {
  const utils = trpc.useUtils()
  const dismiss = trpc.reminders.dismiss.useMutation({
    onSuccess: () => { utils.dashboard.getMyDay.invalidate(); utils.reminders.list.invalidate() },
  })
  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); dismiss.mutate({ reminderId }) }}
      aria-label="Dismiss reminder"
      className="opacity-0 group-hover:opacity-100 p-1 rounded-[var(--radius-sm)] text-[var(--chartreuse)] hover:bg-[var(--bg-body)] transition-all shrink-0"
    >
      <Check className="h-3 w-3" />
    </button>
  )
}
