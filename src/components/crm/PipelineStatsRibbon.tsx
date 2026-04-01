'use client'

import { NeuCard } from '@/components/ui'
import { DollarSign, Gem, Clock, Shield } from 'lucide-react'

interface PipelineStats {
  totalAum: number
  activeCount: number
  avgDays: number
  totalCount: number
}

interface PipelineStatsRibbonProps {
  stats: PipelineStats | undefined
}

function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`
  return `$${value.toFixed(0)}`
}

export function PipelineStatsRibbon({ stats }: PipelineStatsRibbonProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <NeuCard variant="raised-sm" padding="md">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Total AUM</span>
          <DollarSign className="h-4 w-4 text-[var(--emerald)]" />
        </div>
        <p className="text-xl font-bold text-[var(--text-primary)]">{stats ? formatCurrency(stats.totalAum) : '—'}</p>
      </NeuCard>
      <NeuCard variant="raised-sm" padding="md">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Active Assets</span>
          <Gem className="h-4 w-4 text-[var(--teal)]" />
        </div>
        <p className="text-xl font-bold text-[var(--text-primary)]">{stats?.activeCount ?? 0}</p>
      </NeuCard>
      <NeuCard variant="raised-sm" padding="md">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Avg Days</span>
          <Clock className="h-4 w-4 text-[var(--amber)]" />
        </div>
        <p className="text-xl font-bold text-[var(--text-primary)]">{stats?.avgDays ?? 0}d</p>
      </NeuCard>
      <NeuCard variant="raised-sm" padding="md">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Total</span>
          <Shield className="h-4 w-4 text-[var(--teal)]" />
        </div>
        <p className="text-xl font-bold text-[var(--text-primary)]">{stats?.totalCount ?? 0}</p>
      </NeuCard>
    </div>
  )
}
