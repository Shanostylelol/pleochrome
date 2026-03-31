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
