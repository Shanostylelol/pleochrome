'use client'

import { useState } from 'react'
import { DollarSign, ArrowUpRight, ArrowDownLeft } from 'lucide-react'
import { trpc } from '@/lib/trpc'
import { NeuCard } from '@/components/ui/NeuCard'
import { useToast } from '@/components/ui/NeuToast'
import type { Task } from '@/components/crm/TaskCard'

// ── Types ─────────────────────────────────────────────────
interface FinancialsTabProps {
  tasks: Task[]
  asset: Record<string, unknown>
  assetId: string
}

// ── Helpers ───────────────────────────────────────────────
function fmt(val: number | null | undefined): string {
  if (!val) return '$0.00'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val)
}

function fmtCompact(val: number | null | undefined): string {
  if (!val) return 'TBD'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(val)
}

// ── Component ─────────────────────────────────────────────
export function FinancialsTab({ tasks, asset, assetId }: FinancialsTabProps) {
  const meta = (asset.metadata ?? {}) as Record<string, unknown>

  // Compute totals from task payment fields
  const incomingTasks = tasks.filter((t) => t.payment_direction === 'incoming' && t.payment_amount)
  const outgoingTasks = tasks.filter((t) => t.payment_direction === 'outgoing' && t.payment_amount)
  const totalIncoming = incomingTasks.reduce((sum, t) => sum + (t.payment_amount ?? 0), 0)
  const totalOutgoing = outgoingTasks.reduce((sum, t) => sum + (t.payment_amount ?? 0), 0)
  const net = totalIncoming - totalOutgoing

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <NeuCard variant="raised-sm" padding="sm">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Claimed Value</p>
          <p className="text-lg font-bold text-[var(--text-primary)]">{fmtCompact(asset.claimed_value as number | null)}</p>
        </NeuCard>
        <NeuCard variant="raised-sm" padding="sm">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Appraised</p>
          <p className="text-lg font-bold text-[var(--text-primary)]">{fmtCompact(asset.appraised_value as number | null)}</p>
        </NeuCard>
        <NeuCard variant="raised-sm" padding="sm">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Capital Raised</p>
          <p className="text-lg font-bold text-[var(--text-primary)]">{fmtCompact(meta.capital_raised as number | null)}</p>
        </NeuCard>
        <NeuCard variant="raised-sm" padding="sm">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Investors</p>
          <p className="text-lg font-bold text-[var(--text-primary)]">{(meta.investor_count as number) ?? 0}</p>
        </NeuCard>
      </div>

      {/* Revenue / Costs from tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <NeuCard variant="raised" padding="md">
          <div className="flex items-center gap-2 mb-3">
            <ArrowDownLeft className="h-4 w-4 text-[var(--chartreuse)]" />
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Incoming</h3>
          </div>
          <p className="text-xl font-bold text-[var(--chartreuse)]">{fmt(totalIncoming)}</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            {incomingTasks.length} {incomingTasks.length === 1 ? 'payment' : 'payments'}
          </p>
        </NeuCard>

        <NeuCard variant="raised" padding="md">
          <div className="flex items-center gap-2 mb-3">
            <ArrowUpRight className="h-4 w-4 text-[var(--ruby)]" />
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Outgoing</h3>
          </div>
          <p className="text-xl font-bold text-[var(--ruby)]">{fmt(totalOutgoing)}</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            {outgoingTasks.length} {outgoingTasks.length === 1 ? 'payment' : 'payments'}
          </p>
        </NeuCard>

        <NeuCard variant="raised" padding="md">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="h-4 w-4 text-[var(--teal)]" />
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Net</h3>
          </div>
          <p className={`text-xl font-bold ${net >= 0 ? 'text-[var(--chartreuse)]' : 'text-[var(--ruby)]'}`}>
            {fmt(net)}
          </p>
        </NeuCard>
      </div>

      {/* Cost-to-Complete + Projections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <NeuCard variant="raised" padding="md">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Cost to Complete</h3>
          {(() => {
            const incompleteTasks = tasks.filter(t => t.status !== 'done' && t.status !== 'cancelled' && t.payment_direction === 'outgoing' && t.payment_amount)
            const costToComplete = incompleteTasks.reduce((s, t) => s + (t.payment_amount ?? 0), 0)
            return (
              <div>
                <p className="text-xl font-bold text-[var(--text-primary)]">{fmt(costToComplete)}</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">{incompleteTasks.length} remaining payments across incomplete tasks</p>
              </div>
            )
          })()}
        </NeuCard>

        <NeuCard variant="raised" padding="md">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Revenue Projection</h3>
          {(() => {
            const targetRaise = (meta.target_raise as number) ?? 0
            const mgmtFee = (meta.management_fee_pct as number) ?? 2.0
            const projectedRevenue = targetRaise * (mgmtFee / 100)
            return targetRaise > 0 ? (
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-muted)]">Target Raise</span>
                  <span className="text-[var(--text-primary)] font-medium">{fmtCompact(targetRaise)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-muted)]">Mgmt Fee</span>
                  <span className="text-[var(--text-primary)] font-medium">{mgmtFee}%</span>
                </div>
                <div className="flex justify-between text-sm pt-1 border-t border-[var(--border)]">
                  <span className="text-[var(--text-muted)] font-semibold">Projected Revenue</span>
                  <span className="text-[var(--emerald)] font-bold">{fmtCompact(projectedRevenue)}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-[var(--text-muted)]">Set target_raise and management_fee_pct in asset metadata to see projections</p>
            )
          })()}
        </NeuCard>
      </div>

      {/* Structure */}
      <NeuCard variant="raised" padding="md">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Structure</h3>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-[var(--text-muted)]">SPV Name</dt>
            <dd className="text-[var(--text-primary)]">{(asset.spv_name as string) ?? '\u2014'}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-[var(--text-muted)]">Value Model</dt>
            <dd className="text-[var(--text-primary)]">{(asset.value_model as string) ?? '\u2014'}</dd>
          </div>
        </dl>
      </NeuCard>
    </div>
  )
}
