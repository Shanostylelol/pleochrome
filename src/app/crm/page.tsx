'use client'

import { useState, useEffect, useCallback } from 'react'
import { trpc } from '@/lib/trpc'
import { createClient } from '@/lib/supabase'
import { NeuCard, NeuButton, NeuProgress, NeuInput, NeuBadge, NeuSkeleton } from '@/components/ui'
import { AssetCard } from '@/components/crm/AssetCard'
import Link from 'next/link'
import { Plus, DollarSign, Gem, Clock, Shield, Inbox, X, LayoutGrid, List, GripVertical, BarChart3, AlertTriangle, CheckSquare, ShieldCheck, Bell, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TASK_TYPES, type TaskTypeKey } from '@/lib/constants'
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors,
  type DragEndEvent, DragOverlay, type DragStartEvent,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useRouter } from 'next/navigation'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PipelineBoard = any

// V2: value_model values replace value_path
type PathFilter = 'fractional_securities' | 'tokenization' | 'debt_instrument' | 'broker_sale' | 'barter'
type ViewMode = 'kanban' | 'list' | 'dashboard'

const PATH_FILTERS: { label: string; value: PathFilter | null; color: string }[] = [
  { label: 'All', value: null, color: 'var(--text-muted)' },
  { label: 'Fractional', value: 'fractional_securities', color: 'var(--emerald)' },
  { label: 'Tokenization', value: 'tokenization', color: 'var(--teal)' },
  { label: 'Debt', value: 'debt_instrument', color: 'var(--sapphire)' },
  { label: 'Broker', value: 'broker_sale', color: 'var(--amber)' },
  { label: 'Barter', value: 'barter', color: 'var(--amethyst)' },
]

type KanbanColumn = { id: string; label: string; color: string; phases: string[] }

// V2 phases
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

function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`
  return `$${value.toFixed(0)}`
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
  const [pathFilter, setPathFilter] = useState<PathFilter | null>(null)
  const [showQuickAdd, setShowQuickAdd] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('kanban')
  const [activeId, setActiveId] = useState<string | null>(null)
  const [pendingMove, setPendingMove] = useState<{ assetId: string; assetName: string; fromPhase: string; toPhase: string; newPhase: string } | null>(null)
  const router = useRouter()

  const utils = trpc.useUtils()
  const { data: assets = [], isLoading } = trpc.assets.list.useQuery(pathFilter ? { valueModel: pathFilter } : undefined)
  const { data: stats } = trpc.assets.getStats.useQuery(pathFilter ? { valueModel: pathFilter } : undefined)
  const updatePhase = trpc.assets.advancePhase.useMutation({
    onSuccess: () => { utils.assets.list.invalidate(); utils.assets.getStats.invalidate() },
  })

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
            Pipeline Board
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Track all assets through the governance workflow</p>
        </div>
        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="p-0.5 rounded-[var(--radius-md)] bg-[var(--bg-body)] shadow-[var(--shadow-pressed)] hidden sm:flex">
            <button
              onClick={() => setViewMode('dashboard')}
              className={cn(
                'p-2 rounded-[var(--radius-sm)] transition-all',
                viewMode === 'dashboard'
                  ? 'bg-[var(--bg-surface)] shadow-[var(--shadow-raised-sm)] text-[var(--text-primary)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              )}
              aria-label="Dashboard view"
            >
              <BarChart3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={cn(
                'p-2 rounded-[var(--radius-sm)] transition-all',
                viewMode === 'kanban'
                  ? 'bg-[var(--bg-surface)] shadow-[var(--shadow-raised-sm)] text-[var(--text-primary)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              )}
              aria-label="Kanban view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-2 rounded-[var(--radius-sm)] transition-all',
                viewMode === 'list'
                  ? 'bg-[var(--bg-surface)] shadow-[var(--shadow-raised-sm)] text-[var(--text-primary)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              )}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
          <NeuButton icon={<Plus className="h-4 w-4" />} onClick={() => setShowQuickAdd(true)}>
            <span className="hidden sm:inline">New Asset</span>
          </NeuButton>
        </div>
      </div>

      {/* Stats Ribbon */}
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

      {/* Path Filter Pills */}
      <div className="flex items-center gap-3 flex-wrap">
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
        <span className="text-xs text-[var(--text-muted)]">{assets.length} assets</span>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <NeuSkeleton variant="card" /><NeuSkeleton variant="card" /><NeuSkeleton variant="card" /><NeuSkeleton variant="card" />
          </div>
          <NeuSkeleton variant="text" lines={3} />
        </div>
      ) : viewMode === 'dashboard' ? (
        /* ─── Dashboard View ─── */
        <DashboardView />
      ) : viewMode === 'kanban' ? (
        /* ─── Kanban View ─── */
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none">
            {COLUMNS.map((col) => {
              const colAssets = grouped[col.id]
              return (
                <SortableContext key={col.id} items={colAssets.map((a) => a.id!)} strategy={verticalListSortingStrategy} id={col.id}>
                  <DroppableColumn col={col} assets={colAssets} />
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
                  setPendingMove(null)
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
function DroppableColumn({ col, assets }: { col: KanbanColumn; assets: PipelineBoard[] }) {
  const { setNodeRef } = useSortable({ id: col.id })

  return (
    <div className="flex-shrink-0 w-[280px] lg:w-[320px]">
      <div className="flex items-center gap-2 px-3 py-2.5">
        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col.color }} />
        <span className="text-sm font-semibold text-[var(--text-primary)]">{col.label}</span>
        <span className="text-xs text-[var(--text-muted)] ml-auto">{assets.length}</span>
      </div>
      <div
        ref={setNodeRef}
        className="rounded-[var(--radius-lg)] bg-[var(--bg-body)] shadow-[var(--shadow-pressed)] p-2 min-h-[200px] space-y-2 overflow-y-auto max-h-[calc(100vh-360px)]"
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

// ─── Dashboard View (My Day + Pipeline Analytics) ────
function DashboardView() {
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
                  <Link key={t.id} href={`/crm/assets/${t.asset_id}`} className="block">
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

// ─── Quick Add Modal ───────────────────────────────────
function QuickAddModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('')
  const [assetType, setAssetType] = useState<'gemstone' | 'real_estate' | 'precious_metal' | 'mineral_rights' | 'other'>('gemstone')
  const [valuePath, setValuePath] = useState<'fractional_securities' | 'tokenization' | 'debt_instrument' | 'broker_sale' | 'barter' | ''>('')
  const [holderEntity, setHolderEntity] = useState('')
  const [description, setDescription] = useState('')
  const [estimatedValue, setEstimatedValue] = useState('')

  const utils = trpc.useUtils()
  const createMutation = trpc.assets.create.useMutation({
    onSuccess: () => { utils.assets.list.invalidate(); utils.assets.getStats.invalidate(); onClose() },
  })

  const handleSubmit = () => {
    if (!name.trim() || !holderEntity.trim()) return
    createMutation.mutate({
      name: name.trim(), assetType, valueModel: valuePath || undefined, holderEntity: holderEntity.trim(),
      description: description.trim() || undefined,
      claimedValue: estimatedValue ? parseFloat(estimatedValue.replace(/,/g, '')) : undefined,
    } as any)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[var(--overlay)]" onClick={onClose} />
      <NeuCard variant="raised" padding="lg" className="relative w-full max-w-md z-10 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>Quick Add Asset</h2>
          <button onClick={onClose} className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)]"><X className="h-5 w-5" /></button>
        </div>
        <NeuInput label="Asset Name *" placeholder="e.g., Emerald Barrel #017093" value={name} onChange={(e) => setName(e.target.value)} />
        <NeuInput label="Holder Entity *" placeholder="e.g., Kandi International LLC" value={holderEntity} onChange={(e) => setHolderEntity(e.target.value)} />
        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1 block">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2}
            placeholder="Brief asset description..."
            className="w-full text-sm rounded-[var(--radius-sm)] px-3 py-2 resize-none bg-[var(--bg-input)] text-[var(--text-primary)] placeholder:text-[var(--text-placeholder)] shadow-[var(--shadow-pressed)] border border-[var(--border)] focus:outline-none focus:border-[var(--teal)]" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[var(--text-secondary)]">Asset Type</label>
            <select value={assetType} onChange={(e) => setAssetType(e.target.value as typeof assetType)}
              className="h-11 rounded-[var(--radius-md)] border px-3 text-sm bg-[var(--bg-input)] text-[var(--text-primary)] shadow-[var(--shadow-pressed)] border-[var(--border)] focus:outline-none focus:border-[var(--teal)]">
              <option value="gemstone">Gemstone</option><option value="real_estate">Real Estate</option>
              <option value="precious_metal">Precious Metal</option><option value="mineral_rights">Mineral Rights</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[var(--text-secondary)]">Value Model</label>
            <select value={valuePath} onChange={(e) => setValuePath(e.target.value as typeof valuePath)}
              className="h-11 rounded-[var(--radius-md)] border px-3 text-sm bg-[var(--bg-input)] text-[var(--text-primary)] shadow-[var(--shadow-pressed)] border-[var(--border)] focus:outline-none focus:border-[var(--teal)]">
              <option value="">Undecided</option><option value="fractional_securities">Fractional</option>
              <option value="tokenization">Tokenization</option><option value="debt_instrument">Debt</option>
              <option value="broker_sale">Broker Sale</option><option value="barter">Barter</option>
            </select>
          </div>
        </div>
        <NeuInput label="Estimated Value" placeholder="$0"
          value={estimatedValue}
          onChange={(e) => setEstimatedValue(e.target.value.replace(/[^0-9.]/g, ''))}
          onBlur={() => {
            const num = parseFloat(estimatedValue)
            if (!isNaN(num) && num > 0) setEstimatedValue(num.toLocaleString('en-US'))
          }}
          onFocus={() => setEstimatedValue(estimatedValue.replace(/,/g, ''))} />
        <div className="flex gap-3 pt-2">
          <NeuButton variant="ghost" onClick={onClose} fullWidth>Cancel</NeuButton>
          <NeuButton onClick={handleSubmit} loading={createMutation.isPending} disabled={!name.trim() || !holderEntity.trim()} fullWidth>Create Asset</NeuButton>
        </div>
        {createMutation.error && <p className="text-sm text-[var(--ruby)]">{createMutation.error.message}</p>}
        <div className="flex justify-center pt-1 border-t border-[var(--border)]">
          <a href="/crm/assets/new" onClick={onClose} className="text-[11px] text-[var(--teal)] hover:text-[var(--text-primary)] transition-colors">
            Need more options? Try the full wizard →
          </a>
        </div>
      </NeuCard>
    </div>
  )
}
