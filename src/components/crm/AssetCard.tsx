'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MoreHorizontal, ArrowRight, Archive } from 'lucide-react'
import { NeuCard, NeuBadge, NeuAvatar, NeuProgress, NeuConfirmDialog } from '@/components/ui'
import { trpc } from '@/lib/trpc'
import { useToast } from '@/components/ui/NeuToast'
import { PHASES, PHASE_ORDER, type PhaseKey } from '@/lib/constants'

// ── Value model color mapping ──────────────────────────────────────
const valueModelColorMap: Record<string, 'emerald' | 'teal' | 'sapphire' | 'amber' | 'gray'> = {
  fractional_securities: 'emerald',
  tokenization: 'teal',
  debt_instrument: 'sapphire',
  broker_sale: 'amber',
  barter: 'gray',
}

const valueModelLabelMap: Record<string, string> = {
  fractional_securities: 'Fractional',
  tokenization: 'Tokenization',
  debt_instrument: 'Debt',
  broker_sale: 'Broker Sale',
  barter: 'Barter',
}

// ── Phase color mapping (CSS variable names) ───────────────────────
const phaseColorMap: Record<string, string> = {
  lead: 'var(--text-muted)',
  intake: 'var(--sapphire)',
  asset_maturity: 'var(--amethyst)',
  security: 'var(--emerald)',
  value_creation: 'var(--teal)',
  distribution: 'var(--amber)',
}

const phaseLabelMap: Record<string, string> = {
  lead: 'Lead',
  intake: 'Intake',
  asset_maturity: 'Asset Maturity',
  security: 'Security',
  value_creation: 'Value Creation',
  distribution: 'Distribution',
}

// ── Status dot color mapping ───────────────────────────────────────
const statusDotMap: Record<string, { color: string; label: string }> = {
  active: { color: 'var(--teal)', label: 'Active' },
  paused: { color: 'var(--amber)', label: 'Paused' },
  archived: { color: 'var(--text-muted)', label: 'Archived' },
}

function formatAssetType(type: string): string {
  return type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function formatCurrency(value: number | null): string {
  if (!value) return 'TBD'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function AssetCard({ asset }: { asset: any }) {
  const router = useRouter()
  const { toast } = useToast()
  const utils = trpc.useUtils()
  const [menuOpen, setMenuOpen] = useState(false)
  const [confirmArchive, setConfirmArchive] = useState(false)

  const archiveMut = trpc.assets.archive.useMutation({
    onSuccess: () => { utils.assets.listForPipeline.invalidate(); toast('Asset archived', 'success') },
    onError: (err) => toast(err.message, 'error'),
  })
  const advanceMut = trpc.assets.advancePhase.useMutation({
    onSuccess: () => { utils.assets.listForPipeline.invalidate(); toast('Phase advanced', 'success') },
    onError: (err) => toast(err.message, 'error'),
  })

  const phase = (asset.current_phase as string) ?? 'lead'
  const borderColor = phaseColorMap[phase] ?? 'var(--text-muted)'
  const status = statusDotMap[asset.status as string] ?? statusDotMap.active
  const displayValue = asset.appraised_value ?? asset.claimed_value

  return (
    <NeuCard
      variant="raised-sm"
      hoverable
      padding="none"
      className="cursor-pointer relative overflow-hidden group"
      onClick={() => router.push(`/crm/assets/${asset.id}`)}
    >
      {/* Phase color left border indicator */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-[var(--radius-md)]"
        style={{ backgroundColor: borderColor }}
      />

      <div className="pl-4 pr-3 py-3">
        {/* Top row: reference code + status dot */}
        <div className="flex items-center justify-between">
          <p
            className="text-[11px] font-medium text-[var(--text-muted)]"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {asset.reference_code}
          </p>
          <div className="flex items-center gap-1 shrink-0">
            <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: status.color }} title={status.label} />
            <div className="relative">
              <button onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen) }}
                className="p-1 rounded-[var(--radius-sm)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors opacity-0 group-hover:opacity-100"
                aria-label="Asset actions">
                <MoreHorizontal className="h-3.5 w-3.5" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-6 z-30 neu-raised-sm p-1 min-w-[140px]" onClick={(e) => e.stopPropagation()}>
                  {(() => {
                    const idx = PHASE_ORDER.indexOf(phase as PhaseKey)
                    const nextPhase = idx >= 0 && idx < PHASE_ORDER.length - 1 ? PHASE_ORDER[idx + 1] : null
                    return nextPhase ? (
                      <button onClick={() => { advanceMut.mutate({ assetId: asset.id, targetPhase: nextPhase }); setMenuOpen(false) }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-xs rounded-[var(--radius-sm)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]">
                        <ArrowRight className="h-3 w-3" /> Advance to {PHASES[nextPhase]?.label}
                      </button>
                    ) : null
                  })()}
                  <button onClick={() => { setConfirmArchive(true); setMenuOpen(false) }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-xs rounded-[var(--radius-sm)] text-[var(--ruby)] hover:bg-[color-mix(in_srgb,var(--ruby)_10%,transparent)]">
                    <Archive className="h-3 w-3" /> Archive
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Asset name */}
        <p className="text-sm font-semibold text-[var(--text-primary)] mt-1 truncate pr-2">
          {asset.name}
        </p>

        {/* Badges row: asset type + value model */}
        <div className="flex flex-wrap gap-1 mt-2">
          <NeuBadge color="gray" size="sm">
            {formatAssetType(asset.asset_type ?? 'other')}
          </NeuBadge>
          {asset.value_model && (
            <NeuBadge color={valueModelColorMap[asset.value_model] ?? 'gray'} size="sm">
              {valueModelLabelMap[asset.value_model] ?? asset.value_model}
            </NeuBadge>
          )}
        </div>

        {/* Value + phase row */}
        <div className="flex items-end justify-between mt-2">
          <p className="text-base font-bold text-[var(--text-primary)]">
            {formatCurrency(displayValue)}
          </p>
          <span
            className="text-[11px] font-medium px-1.5 py-0.5 rounded"
            style={{
              color: borderColor,
              backgroundColor: 'var(--bg-elevated)',
            }}
          >
            {phaseLabelMap[phase] ?? phase}
          </span>
        </div>

        {/* Task progress */}
        {asset.taskProgress && asset.taskProgress.total > 0 && (
          <div className="mt-2">
            <div className="flex items-center gap-2">
              <div className="flex-1"><NeuProgress value={asset.taskProgress.completed} max={asset.taskProgress.total} color="teal" size="sm" /></div>
              <span className="text-[11px] text-[var(--text-muted)] tabular-nums shrink-0">
                {asset.taskProgress.completed}/{asset.taskProgress.total}
              </span>
            </div>
            <div className="flex items-center justify-between mt-1">
              {asset.taskProgress.nextTask ? (
                <p className="text-[11px] text-[var(--text-muted)] truncate flex-1">
                  Next: {asset.taskProgress.nextTask}
                </p>
              ) : <span />}
              {(asset.taskProgress.overdueCount ?? 0) > 0 && (
                <span className="text-[10px] font-bold text-[var(--ruby)] shrink-0 ml-2">
                  {asset.taskProgress.overdueCount} overdue
                </span>
              )}
            </div>
          </div>
        )}

        {/* Target date indicator */}
        {asset.target_completion_date && (() => {
          const days = Math.ceil((new Date(asset.target_completion_date).getTime() - Date.now()) / 86400000)
          const color = days < 0 ? 'var(--ruby)' : days <= 14 ? 'var(--amber)' : 'var(--chartreuse)'
          return (
            <p className="text-[11px] mt-1 truncate" style={{ color }}>
              {days < 0 ? `${Math.abs(days)}d overdue` : days === 0 ? 'Due today' : `${days}d to target`}
            </p>
          )
        })()}

        {/* Lead assignee avatar */}
        {asset.team_members?.full_name && (
          <div className="mt-2 pt-2 border-t border-[var(--border)]">
            <div className="flex items-center gap-2">
              <NeuAvatar name={asset.team_members.full_name} size="sm" />
              <span className="text-xs text-[var(--text-secondary)] truncate">
                {asset.team_members.full_name}
              </span>
            </div>
          </div>
        )}
      </div>
      <NeuConfirmDialog
        open={confirmArchive}
        onClose={() => setConfirmArchive(false)}
        onConfirm={() => { archiveMut.mutate({ assetId: asset.id, reason: 'Archived from pipeline' }); setConfirmArchive(false) }}
        title="Archive Asset"
        message={`Archive "${asset.name}"? It will be hidden from the pipeline.`}
        confirmLabel="Archive"
        variant="danger"
        loading={archiveMut.isPending}
      />
    </NeuCard>
  )
}
