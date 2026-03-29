'use client'

import { useRouter } from 'next/navigation'
import { NeuCard, NeuBadge, NeuProgress, NeuAvatar } from '@/components/ui'
import { Clock, AlertCircle } from 'lucide-react'
import type { PipelineBoard } from '@/lib/types'

const pathColorMap: Record<string, 'emerald' | 'teal' | 'sapphire' | 'amber' | 'gray'> = {
  fractional_securities: 'emerald',
  tokenization: 'teal',
  debt_instruments: 'sapphire',
  evaluating: 'amber',
}

const pathLabelMap: Record<string, string> = {
  fractional_securities: 'Fractional',
  tokenization: 'Tokenization',
  debt_instruments: 'Debt',
  evaluating: 'Evaluating',
}

function formatCurrency(value: number | null): string {
  if (!value) return 'TBD'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
}

export function AssetCard({ asset }: { asset: PipelineBoard }) {
  const router = useRouter()
  const total = asset.total_steps ?? 0
  const completed = asset.completed_steps ?? 0
  const blocked = asset.blocked_steps ?? 0
  const overdue = asset.overdue_tasks ?? 0
  const pct = total > 0 ? (completed / total) * 100 : 0
  const hasRisk = blocked > 0 || overdue > 0

  const progressColor = blocked > 0 ? 'ruby' : pct > 80 ? 'chartreuse' : 'teal'

  return (
    <NeuCard
      variant="raised-sm"
      hoverable
      padding="sm"
      className="cursor-pointer relative"
      onClick={() => router.push(`/crm/assets/${asset.id}`)}
    >
      {hasRisk && (
        <div className="absolute top-2 right-2">
          <AlertCircle className="h-4 w-4 text-[var(--ruby)]" />
        </div>
      )}

      <p className="text-[11px] font-medium text-[var(--text-muted)]" style={{ fontFamily: 'var(--font-mono)' }}>
        {asset.reference_code}
      </p>

      <p className="text-sm font-semibold text-[var(--text-primary)] mt-1 truncate pr-4">
        {asset.name}
      </p>

      <div className="flex flex-wrap gap-1 mt-2">
        <NeuBadge color="gray" size="sm">
          {asset.asset_type}
        </NeuBadge>
        {asset.value_path && (
          <NeuBadge color={pathColorMap[asset.value_path] ?? 'gray'} size="sm">
            {pathLabelMap[asset.value_path] ?? asset.value_path}
          </NeuBadge>
        )}
        {asset.status === 'paused' && <NeuBadge color="amber" size="sm">Paused</NeuBadge>}
      </div>

      <p className="text-base font-bold text-[var(--text-primary)] mt-2">
        {formatCurrency(asset.offering_value ?? asset.claimed_value)}
      </p>

      {total > 0 && (
        <div className="mt-2">
          <NeuProgress value={completed} max={total} color={progressColor} size="sm" showLabel />
        </div>
      )}

      <div className="flex items-center gap-1.5 mt-2 text-xs text-[var(--text-secondary)]">
        <Clock className="h-3 w-3" />
        <span>
          {asset.current_step ?? asset.current_phase} &middot; {asset.days_in_phase ?? 0}d
        </span>
      </div>

      {asset.lead_name && (
        <div className="mt-2">
          <NeuAvatar name={asset.lead_name} size="sm" />
        </div>
      )}
    </NeuCard>
  )
}
