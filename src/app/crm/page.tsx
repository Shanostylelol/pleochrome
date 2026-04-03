'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { trpc } from '@/lib/trpc'
import { createClient } from '@/lib/supabase'
import { NeuCard, NeuButton, NeuBadge, NeuSkeleton } from '@/components/ui'
import { AssetCard } from '@/components/crm/AssetCard'
import { PipelineHeader, type ViewMode } from '@/components/crm/PipelineHeader'
import { PipelineStatsRibbon } from '@/components/crm/PipelineStatsRibbon'
import { PipelineFilterBar } from '@/components/crm/PipelineFilterBar'
import { QuickAddModal } from '@/components/crm/QuickAddModal'
import { PipelineDashboardView } from '@/components/crm/PipelineDashboardView'
import { Plus, Inbox, GripVertical } from 'lucide-react'
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors,
  type DragEndEvent, DragOverlay, type DragStartEvent,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useRouter, useSearchParams } from 'next/navigation'
import { useToast } from '@/components/ui/NeuToast'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PipelineBoard = any

// V2: value_model values replace value_path
type PathFilter = 'fractional_securities' | 'tokenization' | 'debt_instrument' | 'broker_sale' | 'barter'

// ─── Shared constants ────────────────────────────────────

type KanbanColumn = { id: string; label: string; color: string; phases: string[] }

const COLUMNS: KanbanColumn[] = [
  { id: 'lead', label: 'Lead', color: 'var(--phase-lead)', phases: ['lead'] },
  { id: 'intake', label: 'Intake', color: 'var(--phase-intake)', phases: ['intake'] },
  { id: 'asset_maturity', label: 'Maturity', color: 'var(--phase-asset-maturity)', phases: ['asset_maturity'] },
  { id: 'security', label: 'Security', color: 'var(--phase-security)', phases: ['security'] },
  { id: 'value_creation', label: 'Value', color: 'var(--phase-value-creation)', phases: ['value_creation'] },
  { id: 'distribution', label: 'Distribution', color: 'var(--phase-distribution)', phases: ['distribution'] },
]

const PHASE_LABEL: Record<string, string> = {
  lead: 'Lead', intake: 'Intake', asset_maturity: 'Asset Maturity',
  security: 'Security', value_creation: 'Value Creation', distribution: 'Distribution',
}

const PATH_LABEL: Record<string, string> = {
  fractional_securities: 'Fractional', tokenization: 'Tokenization', debt_instrument: 'Debt',
  broker_sale: 'Broker Sale', barter: 'Barter',
}

const PATH_COLOR: Record<string, string> = {
  fractional_securities: 'emerald', tokenization: 'teal', debt_instrument: 'sapphire',
  broker_sale: 'amber', barter: 'amethyst',
}

const STATUS_COLOR: Record<string, 'emerald' | 'teal' | 'amber' | 'chartreuse' | 'ruby' | 'gray'> = {
  active: 'teal', paused: 'amber', completed: 'chartreuse', terminated: 'ruby', archived: 'gray',
}

function fmtVal(val: number | null): string {
  if (!val) return 'TBD'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val)
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

function getColumnForPhase(phase: string): string | undefined {
  return COLUMNS.find((c) => c.phases.includes(phase))?.id
}

// ─── Sortable Card wrapper ─────────────────────────────
function SortableAssetCard({ asset }: { asset: PipelineBoard }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: asset.id! })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }
  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div className="relative group">
        <div
          {...listeners}
          className="absolute left-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing z-10 p-1"
        >
          <GripVertical className="h-4 w-4 text-[var(--text-muted)]" />
        </div>
        <AssetCard asset={asset} />
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════
export default function PipelineBoardPage() {
  return <Suspense><PipelineBoardInner /></Suspense>
}

const LS_FILTER_KEY = 'plc-pipeline-filter'
const LS_VIEW_KEY = 'plc-pipeline-view'

function PipelineBoardInner() {
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const [pathFilter, setPathFilter] = useState<PathFilter | null>(() => {
    if (typeof window === 'undefined') return null
    return (localStorage.getItem(LS_FILTER_KEY) as PathFilter) || null
  })
  const [phaseHighlight, setPhaseHighlight] = useState<string | null>(null)
  const [showQuickAdd, setShowQuickAdd] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window === 'undefined') return 'kanban'
    return (localStorage.getItem(LS_VIEW_KEY) as ViewMode) || 'kanban'
  })
  const [showArchived, setShowArchived] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [pendingMove, setPendingMove] = useState<{ assetId: string; assetName: string; fromPhase: string; toPhase: string; newPhase: string } | null>(null)
  const router = useRouter()

  // Persist filter + view mode changes
  const handlePathFilterChange = (f: PathFilter | null) => {
    setPathFilter(f)
    if (f) localStorage.setItem(LS_FILTER_KEY, f)
    else localStorage.removeItem(LS_FILTER_KEY)
  }
  const handleViewModeChange = (v: ViewMode) => {
    setViewMode(v)
    localStorage.setItem(LS_VIEW_KEY, v)
  }

  // Read ?phase= param from URL (e.g. from dashboard funnel click)
  useEffect(() => {
    const phase = searchParams.get('phase')
    if (phase) setPhaseHighlight(phase)
  }, [searchParams])

  const [pipelineSearch, setPipelineSearch] = useState('')
  const utils = trpc.useUtils()
  const { data: rawAssets = [], isLoading } = trpc.assets.listForPipeline.useQuery(
    (pathFilter || showArchived) ? { ...(pathFilter ? { valueModel: pathFilter } : {}), ...(showArchived ? { includeArchived: true } : {}) } : undefined
  )
  const assets = pipelineSearch
    ? rawAssets.filter(a => ((a.name ?? '') + ' ' + (a.reference_code ?? '')).toLowerCase().includes(pipelineSearch.toLowerCase()))
    : rawAssets
  const { data: stats } = trpc.assets.getStats.useQuery(pathFilter ? { valueModel: pathFilter } : undefined)
  const updatePhase = trpc.assets.advancePhase.useMutation({
    onSuccess: () => { setPendingMove(null); utils.assets.listForPipeline.invalidate(); utils.assets.getStats.invalidate() },
    onError: (err) => { setPendingMove(null); toast(err.message, 'error') },
  })

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel('pipeline-board')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'assets' }, () => {
        utils.assets.listForPipeline.invalidate()
        utils.assets.getStats.invalidate()
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [utils])

  const grouped = groupByColumn(assets)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }, [])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setActiveId(null)
    const { active, over } = event
    if (!over) return

    const assetId = active.id as string
    const targetColId = over.id as string

    const targetCol = COLUMNS.find((c) => c.id === targetColId)
    if (!targetCol) return

    const currentAsset = assets.find((a) => a.id === assetId)
    if (!currentAsset) return

    const currentCol = getColumnForPhase(currentAsset.current_phase as string)
    if (currentCol === targetColId) return

    const newPhase = targetCol.phases[0]
    const fromLabel = PHASE_LABEL[currentAsset.current_phase as string] ?? currentAsset.current_phase
    const toLabel = PHASE_LABEL[newPhase] ?? newPhase
    setPendingMove({ assetId, assetName: currentAsset.name ?? 'Asset', fromPhase: fromLabel as string, toPhase: toLabel as string, newPhase })
  }, [assets])

  const activeAsset = activeId ? assets.find((a) => a.id === activeId) : null

  return (
    <div className="space-y-6 overflow-x-clip">
      {/* ─── Header (sticky) ─── */}
      <PipelineHeader viewMode={viewMode} onViewModeChange={handleViewModeChange} onNewAsset={() => setShowQuickAdd(true)} showArchived={showArchived} onShowArchivedChange={setShowArchived} />

      {/* ─── Stats Ribbon ─── */}
      <PipelineStatsRibbon stats={stats} />

      {/* ─── Path Filter Pills ─── */}
      <PipelineFilterBar pathFilter={pathFilter} onPathFilterChange={handlePathFilterChange} assetCount={assets.length} search={pipelineSearch} onSearchChange={setPipelineSearch} />

      {/* ─── Content ─── */}
      {isLoading ? (
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <NeuSkeleton variant="card" /><NeuSkeleton variant="card" /><NeuSkeleton variant="card" /><NeuSkeleton variant="card" />
          </div>
          <NeuSkeleton variant="text" lines={3} />
        </div>
      ) : viewMode === 'dashboard' ? (
        /* ─── Dashboard View ─── */
        <PipelineDashboardView />
      ) : viewMode === 'kanban' ? (
        /* ─── Kanban View ─── */
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none">
            {COLUMNS.map((col) => {
              const colAssets = grouped[col.id]
              return (
                <SortableContext key={col.id} items={colAssets.map((a) => a.id!)} strategy={verticalListSortingStrategy} id={col.id}>
                  <DroppableColumn col={col} assets={colAssets} highlighted={phaseHighlight === col.id} />
                </SortableContext>
              )
            })}
          </div>
          <DragOverlay>
            {activeAsset && <AssetCard asset={activeAsset} />}
          </DragOverlay>
        </DndContext>
      ) : (
        /* ─── List View ─── */
        <NeuCard variant="raised" padding="none" className="overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--bg-body)]">
                <th className="text-left px-4 py-3 font-semibold text-[var(--text-muted)] text-xs uppercase tracking-wider">Reference</th>
                <th className="text-left px-4 py-3 font-semibold text-[var(--text-muted)] text-xs uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-[var(--text-muted)] text-xs uppercase tracking-wider hidden md:table-cell">Type</th>
                <th className="text-left px-4 py-3 font-semibold text-[var(--text-muted)] text-xs uppercase tracking-wider hidden lg:table-cell">Path</th>
                <th className="text-left px-4 py-3 font-semibold text-[var(--text-muted)] text-xs uppercase tracking-wider">Phase</th>
                <th className="text-right px-4 py-3 font-semibold text-[var(--text-muted)] text-xs uppercase tracking-wider">Value</th>
                <th className="text-left px-4 py-3 font-semibold text-[var(--text-muted)] text-xs uppercase tracking-wider hidden lg:table-cell">Status</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset) => (
                <tr
                  key={asset.id}
                  onClick={() => router.push(`/crm/assets/${asset.id}`)}
                  className="border-b border-[var(--border)] hover:bg-[var(--bg-elevated)] cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-[var(--text-muted)]" style={{ fontFamily: 'var(--font-mono)' }}>
                    {asset.reference_code}
                  </td>
                  <td className="px-4 py-3 font-semibold text-[var(--text-primary)]">{asset.name}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <NeuBadge color="gray" size="sm">{(asset.asset_type ?? '').replace(/_/g, ' ')}</NeuBadge>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <NeuBadge color={(PATH_COLOR[asset.value_model as string] ?? 'gray') as 'gray'} size="sm">
                      {PATH_LABEL[asset.value_model as string] ?? asset.value_model}
                    </NeuBadge>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[var(--text-secondary)]">{PHASE_LABEL[asset.current_phase as string] ?? asset.current_phase}</span>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-[var(--text-primary)]">
                    {fmtVal(asset.appraised_value ?? asset.claimed_value)}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <NeuBadge color={STATUS_COLOR[asset.status as string] ?? 'gray'} size="sm">{asset.status}</NeuBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </NeuCard>
      )}

      {/* Mobile FAB */}
      <button
        onClick={() => setShowQuickAdd(true)}
        className="md:hidden fixed bottom-[calc(var(--bottom-nav-height)+16px+env(safe-area-inset-bottom))] right-4 z-30 w-14 h-14 rounded-full bg-[var(--teal)] text-white shadow-[var(--shadow-raised)] flex items-center justify-center neu-btn-press"
      >
        <Plus className="h-6 w-6" />
      </button>

      {/* Phase Move Confirmation */}
      {pendingMove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[var(--overlay)]" onClick={() => setPendingMove(null)} />
          <NeuCard variant="raised" padding="lg" className="relative w-full max-w-sm z-10 space-y-4">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
              Confirm Phase Change
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">
              Move <strong>{pendingMove.assetName}</strong> from <NeuBadge color="gray" size="sm">{pendingMove.fromPhase}</NeuBadge> to <NeuBadge color="teal" size="sm">{pendingMove.toPhase}</NeuBadge>?
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              This will update the asset&apos;s governance phase. Gate checks will be validated.
            </p>
            <div className="flex gap-3 pt-2">
              <NeuButton variant="ghost" onClick={() => setPendingMove(null)} fullWidth>Cancel</NeuButton>
              <NeuButton
                onClick={() => {
                  updatePhase.mutate({
                    assetId: pendingMove.assetId,
                    targetPhase: pendingMove.newPhase as 'lead' | 'intake' | 'asset_maturity' | 'security' | 'value_creation' | 'distribution',
                  })
                }}
                loading={updatePhase.isPending}
                fullWidth
              >
                Confirm Move
              </NeuButton>
            </div>
          </NeuCard>
        </div>
      )}

      {showQuickAdd && <QuickAddModal onClose={() => setShowQuickAdd(false)} />}
    </div>
  )
}

// ─── Droppable Column ──────────────────────────────────
function DroppableColumn({ col, assets, highlighted }: { col: KanbanColumn; assets: PipelineBoard[]; highlighted?: boolean }) {
  const { setNodeRef } = useSortable({ id: col.id })
  const overdueTotal = assets.reduce((sum, a) => sum + ((a.taskProgress?.overdueCount as number) ?? 0), 0)

  return (
    <div className="flex-shrink-0 w-[280px] lg:w-[320px]">
      <div className={`flex items-center gap-2 px-3 py-2.5 rounded-t-[var(--radius-md)] transition-colors ${highlighted ? 'bg-[var(--bg-elevated)]' : ''}`}>
        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col.color }} />
        <span className="text-sm font-semibold text-[var(--text-primary)]">{col.label}</span>
        {highlighted && <span className="text-[10px] font-bold uppercase tracking-wider ml-1" style={{ color: col.color }}>Filtered</span>}
        <span className="text-xs text-[var(--text-muted)] ml-auto">{assets.length}</span>
        {overdueTotal > 0 && (
          <span className="text-[10px] font-bold text-[var(--ruby)] ml-1" title={`${overdueTotal} overdue tasks`}>
            {overdueTotal} overdue
          </span>
        )}
      </div>
      <div
        ref={setNodeRef}
        className={`rounded-b-[var(--radius-lg)] bg-[var(--bg-body)] p-2 min-h-[200px] space-y-2 overflow-y-auto max-h-[calc(100vh-360px)] transition-all ${highlighted ? 'shadow-[0_0_0_2px_var(--teal),var(--shadow-pressed)]' : 'shadow-[var(--shadow-pressed)]'}`}
      >
        {assets.length > 0 ? (
          assets.map((asset) => <SortableAssetCard key={asset.id} asset={asset} />)
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Inbox className="h-10 w-10 text-[var(--text-placeholder)] mb-2" />
            <p className="text-sm text-[var(--text-muted)]">No assets in {col.label}</p>
            <p className="text-xs text-[var(--text-placeholder)]">Drag assets here or they&apos;ll appear when phase changes</p>
          </div>
        )}
      </div>
    </div>
  )
}
