'use client'

import { useState, useEffect } from 'react'
import { trpc } from '@/lib/trpc'
import { createClient } from '@/lib/supabase'
import { NeuCard, NeuButton, NeuProgress, NeuInput } from '@/components/ui'
import { AssetCard } from '@/components/crm/AssetCard'
import { Plus, DollarSign, Gem, Clock, Shield, Inbox, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PipelineBoard } from '@/lib/types'

type PathFilter = 'fractional_securities' | 'tokenization' | 'debt_instruments'

const PATH_FILTERS: { label: string; value: PathFilter | null; color: string; activeClass: string }[] = [
  { label: 'All', value: null, color: 'var(--text-muted)', activeClass: 'bg-[var(--text-muted)]' },
  { label: 'Fractional', value: 'fractional_securities', color: 'var(--emerald)', activeClass: 'bg-[var(--emerald)]' },
  { label: 'Tokenization', value: 'tokenization', color: 'var(--teal)', activeClass: 'bg-[var(--teal)]' },
  { label: 'Debt', value: 'debt_instruments', color: 'var(--sapphire)', activeClass: 'bg-[var(--sapphire)]' },
]

type KanbanColumn = {
  id: string
  label: string
  color: string
  phases: string[]
}

const COLUMNS: KanbanColumn[] = [
  { id: 'acquisition', label: 'Acquisition', color: 'var(--emerald)', phases: ['phase_0_foundation', 'phase_1_intake'] },
  { id: 'preparation', label: 'Preparation', color: 'var(--teal)', phases: ['phase_2_certification', 'phase_3_custody'] },
  { id: 'execution', label: 'Execution', color: 'var(--amethyst)', phases: ['phase_4_legal', 'phase_5_tokenization', 'phase_6_regulatory'] },
  { id: 'distribution', label: 'Distribution', color: 'var(--amber)', phases: ['phase_7_distribution', 'phase_8_ongoing'] },
]

function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`
  return `$${value.toFixed(0)}`
}

function groupByColumn(assets: PipelineBoard[]): Record<string, PipelineBoard[]> {
  const grouped: Record<string, PipelineBoard[]> = {}
  COLUMNS.forEach((col) => { grouped[col.id] = [] })

  assets.forEach((asset) => {
    const col = COLUMNS.find((c) => asset.current_phase && c.phases.includes(asset.current_phase as string))
    if (col) grouped[col.id].push(asset)
  })

  return grouped
}

export default function PipelineBoardPage() {
  const [pathFilter, setPathFilter] = useState<PathFilter | null>(null)
  const [showQuickAdd, setShowQuickAdd] = useState(false)

  const utils = trpc.useUtils()

  const { data: assets = [], isLoading } = trpc.assets.list.useQuery(
    pathFilter ? { pathFilter } : undefined
  )
  const { data: stats } = trpc.assets.getStats.useQuery(
    pathFilter ? { pathFilter } : undefined
  )

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel('pipeline-board')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'assets' }, () => {
        utils.assets.list.invalidate()
        utils.assets.getStats.invalidate()
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [utils])

  const grouped = groupByColumn(assets)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
            Pipeline Board
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Track all assets through the governance workflow</p>
        </div>
        <NeuButton icon={<Plus className="h-4 w-4" />} onClick={() => setShowQuickAdd(true)}>
          <span className="hidden sm:inline">New Asset</span>
        </NeuButton>
      </div>

      {/* Stats Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <NeuCard variant="raised-sm" padding="md">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Total AUM</span>
            <DollarSign className="h-4 w-4 text-[var(--emerald)]" />
          </div>
          <p className="text-xl font-bold text-[var(--text-primary)]">
            {stats ? formatCurrency(stats.totalAum) : '—'}
          </p>
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
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Compliance</span>
            <Shield className={cn('h-4 w-4', (stats?.complianceScore ?? 0) >= 80 ? 'text-[var(--chartreuse)]' : (stats?.complianceScore ?? 0) >= 50 ? 'text-[var(--amber)]' : 'text-[var(--ruby)]')} />
          </div>
          <p className="text-xl font-bold text-[var(--text-primary)]">
            {stats?.complianceScore !== undefined ? `${stats.complianceScore}%` : 'N/A'}
          </p>
          {stats && stats.complianceScore > 0 && (
            <NeuProgress
              value={stats.complianceScore}
              max={100}
              color={stats.complianceScore >= 80 ? 'chartreuse' : stats.complianceScore >= 50 ? 'amber' : 'ruby'}
              size="sm"
            />
          )}
        </NeuCard>
      </div>

      {/* Path Filter Pills */}
      <div className="p-1 rounded-[var(--radius-lg)] bg-[var(--bg-body)] shadow-[var(--shadow-pressed)] inline-flex gap-1">
        {PATH_FILTERS.map((f) => {
          const isActive = pathFilter === f.value
          return (
            <button
              key={f.label}
              onClick={() => setPathFilter(isActive && f.value !== null ? null : f.value)}
              className={cn(
                'px-4 py-2 rounded-[var(--radius-md)] text-sm font-medium transition-all',
                'focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)]',
                isActive
                  ? 'text-white shadow-[var(--shadow-raised-sm)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)] shadow-[var(--shadow-raised-sm)] bg-[var(--bg-surface)]'
              )}
              style={isActive ? { backgroundColor: f.color } : undefined}
            >
              {f.label}
            </button>
          )
        })}
      </div>

      {/* Kanban Board */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-[var(--text-muted)]">Loading pipeline...</p>
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none">
          {COLUMNS.map((col) => {
            const colAssets = grouped[col.id]
            return (
              <div key={col.id} className="flex-shrink-0 w-[280px] lg:w-[320px]">
                {/* Column Header */}
                <div className="flex items-center gap-2 px-3 py-2.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col.color }} />
                  <span className="text-sm font-semibold text-[var(--text-primary)]">{col.label}</span>
                  <span className="text-xs text-[var(--text-muted)] ml-auto">{colAssets.length}</span>
                </div>

                {/* Column Trough */}
                <div className="rounded-[var(--radius-lg)] bg-[var(--bg-body)] shadow-[var(--shadow-pressed)] p-2 min-h-[200px] space-y-2 overflow-y-auto max-h-[calc(100vh-360px)]">
                  {colAssets.length > 0 ? (
                    colAssets.map((asset) => (
                      <AssetCard key={asset.id} asset={asset} />
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <Inbox className="h-10 w-10 text-[var(--text-placeholder)] mb-2" />
                      <p className="text-sm text-[var(--text-muted)]">No assets in {col.label}</p>
                      <p className="text-xs text-[var(--text-placeholder)]">Assets in this phase will appear here</p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Mobile FAB */}
      <button
        onClick={() => setShowQuickAdd(true)}
        className="md:hidden fixed bottom-[calc(var(--bottom-nav-height)+16px+env(safe-area-inset-bottom))] right-4 z-30 w-14 h-14 rounded-full bg-[var(--teal)] text-white shadow-[var(--shadow-raised)] flex items-center justify-center neu-btn-press"
      >
        <Plus className="h-6 w-6" />
      </button>

      {/* Quick Add Modal */}
      {showQuickAdd && <QuickAddModal onClose={() => setShowQuickAdd(false)} />}
    </div>
  )
}

function QuickAddModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('')
  const [assetType, setAssetType] = useState<'gemstone' | 'real_estate' | 'precious_metal' | 'mineral_rights' | 'other'>('gemstone')
  const [valuePath, setValuePath] = useState<'fractional_securities' | 'tokenization' | 'debt_instruments' | 'evaluating'>('evaluating')
  const [holderEntity, setHolderEntity] = useState('')
  const [estimatedValue, setEstimatedValue] = useState('')

  const utils = trpc.useUtils()
  const createMutation = trpc.assets.create.useMutation({
    onSuccess: () => {
      utils.assets.list.invalidate()
      utils.assets.getStats.invalidate()
      onClose()
    },
  })

  const handleSubmit = () => {
    if (!name.trim() || !holderEntity.trim()) return
    createMutation.mutate({
      name: name.trim(),
      assetType,
      valuePath,
      holderEntity: holderEntity.trim(),
      estimatedValue: estimatedValue ? parseFloat(estimatedValue) : undefined,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[var(--overlay)]" onClick={onClose} />
      <NeuCard variant="raised" padding="lg" className="relative w-full max-w-md z-10 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
            Quick Add Asset
          </h2>
          <button onClick={onClose} className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)]">
            <X className="h-5 w-5" />
          </button>
        </div>

        <NeuInput label="Asset Name *" placeholder="e.g., Emerald Barrel #017093" value={name} onChange={(e) => setName(e.target.value)} />
        <NeuInput label="Holder Entity *" placeholder="e.g., Kandi International LLC" value={holderEntity} onChange={(e) => setHolderEntity(e.target.value)} />

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[var(--text-secondary)]">Asset Type</label>
            <select
              value={assetType}
              onChange={(e) => setAssetType(e.target.value as typeof assetType)}
              className="h-11 rounded-[var(--radius-md)] border px-3 text-sm bg-[var(--bg-input)] text-[var(--text-primary)] shadow-[var(--shadow-pressed)] border-[var(--border)] focus:outline-none focus:border-[var(--teal)]"
            >
              <option value="gemstone">Gemstone</option>
              <option value="real_estate">Real Estate</option>
              <option value="precious_metal">Precious Metal</option>
              <option value="mineral_rights">Mineral Rights</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[var(--text-secondary)]">Value Path</label>
            <select
              value={valuePath}
              onChange={(e) => setValuePath(e.target.value as typeof valuePath)}
              className="h-11 rounded-[var(--radius-md)] border px-3 text-sm bg-[var(--bg-input)] text-[var(--text-primary)] shadow-[var(--shadow-pressed)] border-[var(--border)] focus:outline-none focus:border-[var(--teal)]"
            >
              <option value="evaluating">Evaluating</option>
              <option value="fractional_securities">Fractional</option>
              <option value="tokenization">Tokenization</option>
              <option value="debt_instruments">Debt</option>
            </select>
          </div>
        </div>

        <NeuInput
          label="Estimated Value"
          placeholder="e.g., 15400000"
          type="number"
          value={estimatedValue}
          onChange={(e) => setEstimatedValue(e.target.value)}
        />

        <div className="flex gap-3 pt-2">
          <NeuButton variant="ghost" onClick={onClose} fullWidth>Cancel</NeuButton>
          <NeuButton
            onClick={handleSubmit}
            loading={createMutation.isPending}
            disabled={!name.trim() || !holderEntity.trim()}
            fullWidth
          >
            Create Asset
          </NeuButton>
        </div>

        {createMutation.error && (
          <p className="text-sm text-[var(--ruby)]">{createMutation.error.message}</p>
        )}
      </NeuCard>
    </div>
  )
}
