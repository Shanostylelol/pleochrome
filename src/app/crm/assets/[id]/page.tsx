'use client'

import { useState, useRef, useEffect } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { saveAs } from 'file-saver'
import { trpc } from '@/lib/trpc'
import { createClient } from '@/lib/supabase'
import { trackAssetView } from '@/lib/recently-viewed'
import { NeuCard, NeuBadge, NeuButton, NeuTabs, NeuAvatar, NeuSkeleton, NeuConfirmDialog } from '@/components/ui'
import { PhaseTimeline } from '@/components/crm/PhaseTimeline'
import {
  OverviewTab, WorkflowTab, TasksTab, DocumentsTab,
  CommentsTab, ActivityTab, GatesTab, PartnersTab,
  FinancialsTab, MeetingsTab, CommunicationsTab, EditAssetModal, SaveTemplateModal,
} from '@/components/crm/asset-detail'
import { GateWarningModal, type GateWarning } from '@/components/crm/GateWarningModal'
import { SetReminderModal } from '@/components/crm/SetReminderModal'
import {
  ChevronRight, Edit3, FileUp, MessageSquare, Download, LayoutGrid,
  Shield, FileText, CheckSquare, Activity, Lock, DollarSign,
  Handshake, MessageCircle, ArrowRight, Copy, Calendar, Phone,
  MoreHorizontal, Bell,
} from 'lucide-react'
import { VALUE_MODELS, ASSET_STATUSES, PHASES, PHASE_ORDER, type PhaseKey } from '@/lib/constants'
import { cn } from '@/lib/utils'
import type { Stage } from '@/components/crm/StageAccordion'
import type { Task } from '@/components/crm/TaskCard'

type BadgeColor = 'emerald' | 'teal' | 'sapphire' | 'amber' | 'chartreuse' | 'ruby' | 'amethyst' | 'gray'
const MODEL_COLOR: Record<string, BadgeColor> = { fractional_securities: 'emerald', tokenization: 'teal', debt_instrument: 'sapphire', broker_sale: 'amber', barter: 'gray' }
const STATUS_COLOR: Record<string, BadgeColor> = { active: 'teal', paused: 'amber', completed: 'chartreuse', terminated: 'ruby', archived: 'gray' }
const fmtType = (t: string) => t.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
const fmt = (v: number | null | undefined) => v ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v) : 'TBD'

const IC = 'h-4 w-4'
const TABS = [
  { id: 'overview', label: 'Overview', icon: <LayoutGrid className={IC} /> },
  { id: 'workflow', label: 'Workflow', icon: <Shield className={IC} /> },
  { id: 'documents', label: 'Documents', icon: <FileText className={IC} /> },
  { id: 'comments', label: 'Comments', icon: <MessageCircle className={IC} /> },
  { id: 'tasks', label: 'Tasks', icon: <CheckSquare className={IC} /> },
  { id: 'activity', label: 'Activity', icon: <Activity className={IC} /> },
  { id: 'gates', label: 'Gates', icon: <Lock className={IC} /> },
  { id: 'financials', label: 'Financials', icon: <DollarSign className={IC} /> },
  { id: 'partners', label: 'Partners', icon: <Handshake className={IC} /> },
  { id: 'communications', label: 'Comms', icon: <Phone className={IC} /> },
  { id: 'meetings', label: 'Meetings', icon: <Calendar className={IC} /> },
]

export default function AssetDetailPage() {
  const params = useParams<{ id: string }>()
  const searchParams = useSearchParams()
  const router = useRouter()
  const activeTab = searchParams.get('tab') ?? 'overview'
  const setActiveTab = (tab: string) => {
    router.replace(`/crm/assets/${params.id}?tab=${tab}`, { scroll: false })
  }
  const [showEdit, setShowEdit] = useState(false)
  const [showSaveTemplate, setShowSaveTemplate] = useState(false)
  const [gateWarnings, setGateWarnings] = useState<GateWarning[]>([])
  const [gateTargetPhase, setGateTargetPhase] = useState('')
  const [showGateModal, setShowGateModal] = useState(false)
  const [showActions, setShowActions] = useState(false)
  const [isCompact, setIsCompact] = useState(false)
  const [confirmAdvance, setConfirmAdvance] = useState(false)
  const [confirmDuplicate, setConfirmDuplicate] = useState(false)
  const [showReminder, setShowReminder] = useState(false)

  const heroRef = useRef<HTMLDivElement>(null)

  // Show compact header when hero scrolls out of view
  useEffect(() => {
    function onScroll() {
      if (!heroRef.current) return
      const rect = heroRef.current.getBoundingClientRect()
      setIsCompact(rect.bottom < 56) // 56 = header height
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const utils = trpc.useUtils()
  const { data, isLoading, error } = trpc.assets.getById.useQuery({ assetId: params.id })

  // Realtime: invalidate when tasks/stages/documents change for this asset
  useEffect(() => {
    const supabase = createClient()
    const channel = supabase.channel(`asset-detail-${params.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks', filter: `asset_id=eq.${params.id}` },
        () => utils.assets.getById.invalidate({ assetId: params.id }))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'asset_stages', filter: `asset_id=eq.${params.id}` },
        () => utils.assets.getById.invalidate({ assetId: params.id }))
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [params.id, utils])

  const [exportLoading, setExportLoading] = useState(false)
  const [exportMenuOpen, setExportMenuOpen] = useState(false)

  const updateStatusMutation = trpc.assets.update.useMutation({
    onSuccess: () => {
      utils.assets.getById.invalidate({ assetId: params.id })
      utils.assets.listForPipeline.invalidate()
      utils.assets.list.invalidate()
    },
  })

  const duplicateMutation = trpc.assets.duplicate.useMutation({
    onSuccess: (newAsset) => {
      router.push(`/crm/assets/${(newAsset as { id: string }).id}`)
    },
  })

  const advanceMutation = trpc.assets.advancePhase.useMutation({
    onSuccess: (result) => {
      const res = result as { blocked?: boolean; warnings?: GateWarning[]; new_phase?: string; requiresOverride?: boolean }
      if (res.blocked && res.warnings) {
        setGateWarnings(res.warnings)
        setGateTargetPhase(nextPhase ?? '')
        setShowGateModal(true)
        return // Don't invalidate — phase didn't advance
      }
      if (res.warnings && res.warnings.length > 0 && !res.blocked) {
        setGateWarnings(res.warnings)
        setGateTargetPhase(res.new_phase ?? '')
        setShowGateModal(true)
      }
      utils.assets.getById.invalidate({ assetId: params.id })
    },
  })

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        <NeuSkeleton variant="card" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <NeuSkeleton variant="text" lines={4} />
          <NeuSkeleton variant="text" lines={4} />
        </div>
        <NeuSkeleton variant="card" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <NeuCard variant="raised" padding="lg">
        <p className="text-[var(--ruby)]">Error: {error?.message ?? 'Asset not found'}</p>
      </NeuCard>
    )
  }

  const { asset, stages, tasks, subtasks, documents, activity, comments, partners } = data
  const meta = (asset.metadata ?? {}) as Record<string, unknown>

  // Track recently viewed (once per asset ID, not on every render)
  useEffect(() => {
    trackAssetView({
      id: asset.id as string,
      name: asset.name as string,
      reference_code: asset.reference_code as string | null,
      current_phase: asset.current_phase as string | null,
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asset.id])

  const typedStages: Stage[] = stages.map((s) => ({
    id: s.id, name: s.name, status: s.status as Stage['status'],
    phase: s.phase as PhaseKey, is_gate: s.is_gate, sort_order: s.sort_order,
  }))

  const typedTasks: Task[] = tasks.map((t) => ({
    id: t.id, title: t.title, description: t.description ?? undefined,
    notes: t.notes ?? undefined, task_type: t.task_type as Task['task_type'],
    status: t.status as Task['status'], due_date: t.due_date ?? undefined,
    assigned_to: t.assigned_to ?? undefined,
    assignee: t.team_members ? { name: (t.team_members as { full_name: string }).full_name } : undefined,
    payment_amount: t.estimated_amount ?? undefined,
    payment_direction: t.task_type === 'payment_incoming' ? 'incoming' as const
      : t.task_type === 'payment_outgoing' ? 'outgoing' as const : undefined,
    stage_id: t.stage_id,
  })) as (Task & { stage_id: string })[]

  const typedSubtasks = subtasks.map((st) => ({
    id: st.id, task_id: st.task_id, title: st.title, status: st.status,
    subtask_type: (st as Record<string, unknown>).subtask_type as string | undefined,
    notes: (st as Record<string, unknown>).notes as string | undefined,
    assignee: undefined,
  }))

  const targetDateStr = (asset as Record<string, unknown>).target_completion_date as string | null | undefined
  const targetDaysLeft = targetDateStr ? Math.ceil((new Date(targetDateStr).getTime() - Date.now()) / 86400000) : null
  const targetColor = targetDaysLeft == null ? '' : targetDaysLeft < 0 ? 'var(--ruby)' : targetDaysLeft <= 14 ? 'var(--amber)' : 'var(--chartreuse)'
  const targetLabel = targetDaysLeft == null ? '' : targetDaysLeft < 0 ? `${Math.abs(targetDaysLeft)}d overdue` : targetDaysLeft === 0 ? 'Due today' : `${targetDaysLeft}d left`

  const countMap: Record<string, number> = { workflow: stages.length, documents: documents.length, tasks: tasks.length, comments: comments.length, partners: partners.length }
  const tabsWithCounts = TABS.map((t) => countMap[t.id] != null ? { ...t, count: countMap[t.id] } : t)
  const modelKey = asset.value_model as keyof typeof VALUE_MODELS | null
  const modelLabel = modelKey ? VALUE_MODELS[modelKey]?.label ?? modelKey : null
  const statusKey = asset.status as keyof typeof ASSET_STATUSES
  const currentUserId = comments[0] ? ((comments[0].team_members as Record<string, unknown> | null)?.id as string) ?? '' : ''
  const currentIdx = PHASE_ORDER.indexOf(asset.current_phase as PhaseKey)
  const nextPhase: PhaseKey | null = currentIdx >= 0 && currentIdx < PHASE_ORDER.length - 1 ? PHASE_ORDER[currentIdx + 1] : null

  const handleExportJSON = async () => {
    setExportLoading(true); setExportMenuOpen(false)
    try {
      const report = await utils.reports.generateAssetReport.fetch({ assetId: params.id })
      saveAs(new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' }), `${asset.reference_code}-report.json`)
    } catch { /* handled */ } finally { setExportLoading(false) }
  }
  const handleExportCSV = async () => {
    setExportLoading(true); setExportMenuOpen(false)
    try {
      const headers = 'Stage,Task,Type,Status,Assigned To,Due Date\n'
      const rows = tasks.map((t) => {
        const stage = stages.find(s => s.id === (t as Record<string, unknown>).stage_id)
        return `"${stage?.name ?? ''}","${t.title}","${t.task_type}","${t.status}","${(t as Record<string, unknown>).assigned_to ?? ''}","${(t as Record<string, unknown>).due_date ?? ''}"`
      }).join('\n')
      saveAs(new Blob([headers + rows], { type: 'text/csv;charset=utf-8' }), `${asset.reference_code}-tasks.csv`)
    } catch { /* handled */ } finally { setExportLoading(false) }
  }
  const handlePrint = () => { setExportMenuOpen(false); window.print() }

  return (
    <div className="max-w-6xl">
      {/* ── Compact sticky header (appears on scroll) ── */}
      <div
        className={cn(
          'sticky z-30 transition-all duration-200',
          'top-[var(--header-height)]',
          isCompact
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-1 pointer-events-none max-h-0 overflow-hidden'
        )}
      >
        <div className="flex items-center gap-3 px-4 py-2 rounded-b-[var(--radius-md)] bg-[var(--bg-surface)] shadow-[var(--shadow-raised)] border-b border-[var(--border)]">
          <h2 className="text-sm font-semibold text-[var(--text-primary)] truncate flex-1">{asset.name}</h2>
          <div className="flex items-center gap-1.5 shrink-0">
            <NeuBadge color={STATUS_COLOR[statusKey] ?? 'gray'} size="sm">{ASSET_STATUSES[statusKey]?.label ?? asset.status}</NeuBadge>
            <span className="text-[10px] text-[var(--text-muted)] font-mono">{PHASES[asset.current_phase as PhaseKey]?.label ?? asset.current_phase}</span>
            {targetDateStr && targetDaysLeft !== null && (
              <span className="text-[10px] font-bold" style={{ color: targetColor }}>{targetLabel}</span>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <NeuButton variant="ghost" size="sm" className="!h-7 !px-2" onClick={() => setShowEdit(true)}>
              <Edit3 className="h-3.5 w-3.5" />
            </NeuButton>
            {nextPhase && (
              <NeuButton size="sm" className="!h-7 !px-2 !text-xs" disabled={advanceMutation.isPending}
                onClick={() => setConfirmAdvance(true)}>
                <ArrowRight className="h-3.5 w-3.5 mr-1" /> {PHASES[nextPhase].label}
              </NeuButton>
            )}
          </div>
        </div>
        <div className="px-0 pt-1 pb-1 bg-[var(--bg-body)]">
          <NeuTabs tabs={tabsWithCounts} activeTab={activeTab} onTabChange={setActiveTab} size="sm" />
        </div>
      </div>

      <div className="space-y-3">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[13px]">
          <Link href="/crm" className="text-[var(--text-muted)] hover:text-[var(--text-secondary)]">Pipeline</Link>
          <ChevronRight className="h-3 w-3 text-[var(--text-muted)]" />
          <span className="font-semibold text-[var(--text-primary)] truncate">{asset.name}</span>
        </nav>

        {/* ── Hero card (full version) ── */}
        <div ref={heroRef}>
          <NeuCard variant="raised" padding="md">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 min-w-0">
                {/* Title row */}
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <h1 className="text-xl lg:text-2xl font-semibold text-[var(--text-primary)] truncate" style={{ fontFamily: 'var(--font-display)' }}>
                      {asset.name}
                    </h1>
                    <button
                      onClick={() => { navigator.clipboard.writeText(asset.reference_code as string); }}
                      title="Copy reference code"
                      className="text-[11px] text-[var(--text-muted)] hover:text-[var(--teal)] transition-colors flex items-center gap-1 group"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      {asset.reference_code}
                      <Copy className="h-2.5 w-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </div>
                </div>

                {/* Badges + holder — single line */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <NeuBadge color={STATUS_COLOR[statusKey] ?? 'gray'} size="sm">{ASSET_STATUSES[statusKey]?.label ?? asset.status}</NeuBadge>
                  {modelLabel && <NeuBadge color={MODEL_COLOR[modelKey ?? ''] ?? 'gray'} size="sm">{modelLabel}</NeuBadge>}
                  <NeuBadge color="gray" size="sm">{fmtType(asset.asset_type)}</NeuBadge>
                  {asset.asset_holder_entity && (
                    <span className="text-xs text-[var(--text-secondary)] ml-1">{asset.asset_holder_entity}</span>
                  )}
                </div>

                {/* Compact value metrics — inline on one row */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-1 mt-3 text-sm">
                  <div><span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Claimed </span><span className="font-bold text-[var(--text-primary)]">{fmt(asset.claimed_value)}</span></div>
                  <div><span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Appraised </span><span className="font-bold text-[var(--text-primary)]">{fmt(asset.appraised_value)}</span></div>
                  <div><span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Raised </span><span className="font-bold text-[var(--text-primary)]">{fmt(meta.capital_raised as number | null)}</span></div>
                  <div><span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Investors </span><span className="font-bold text-[var(--text-primary)]">{(meta.investor_count as number) ?? 0}</span></div>
                  {targetDateStr && (
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Target </span>
                      <span className="font-bold" style={{ color: targetColor }}>{targetLabel}</span>
                      <span className="text-[10px] text-[var(--text-muted)] ml-1">({new Date(targetDateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})</span>
                    </div>
                  )}
                  {asset.team_members && (
                    <div className="flex items-center gap-1.5 ml-auto">
                      <NeuAvatar name={(asset.team_members as { full_name: string }).full_name} size="sm" />
                      <span className="text-xs text-[var(--text-secondary)]">{(asset.team_members as { full_name: string }).full_name}</span>
                    </div>
                  )}
                </div>

                {/* Phase timeline — merged into hero */}
                <div className="mt-3 pt-3 border-t border-[var(--border)]">
                  <PhaseTimeline currentPhase={asset.current_phase as PhaseKey} />
                </div>
              </div>

              {/* Actions — collapsed behind menu on mobile */}
              <div className="hidden lg:flex lg:flex-col gap-1.5 lg:w-40 shrink-0">
                <NeuButton icon={<Edit3 className="h-4 w-4" />} size="sm" fullWidth onClick={() => setShowEdit(true)}>Edit</NeuButton>
                <NeuButton variant="ghost" icon={<ArrowRight className="h-4 w-4" />} size="sm" fullWidth
                  disabled={advanceMutation.isPending || !nextPhase}
                  onClick={() => { if (nextPhase) setConfirmAdvance(true) }}>
                  {nextPhase ? `Advance to ${PHASES[nextPhase].label}` : 'Final Phase'}
                </NeuButton>
                {asset.status === 'active' && (
                  <NeuButton variant="ghost" size="sm" fullWidth onClick={() => updateStatusMutation.mutate({ assetId: params.id, status: 'paused' })}
                    loading={updateStatusMutation.isPending}>
                    Pause Asset
                  </NeuButton>
                )}
                {asset.status === 'paused' && (
                  <NeuButton variant="ghost" size="sm" fullWidth onClick={() => updateStatusMutation.mutate({ assetId: params.id, status: 'active' })}
                    loading={updateStatusMutation.isPending}>
                    Resume Asset
                  </NeuButton>
                )}
                <NeuButton variant="ghost" icon={<Bell className="h-4 w-4" />} size="sm" fullWidth onClick={() => setShowReminder(true)}>Set Reminder</NeuButton>
                <NeuButton variant="ghost" icon={<Copy className="h-4 w-4" />} size="sm" fullWidth onClick={() => setConfirmDuplicate(true)} loading={duplicateMutation.isPending}>Duplicate</NeuButton>
                <NeuButton variant="ghost" icon={<Copy className="h-4 w-4" />} size="sm" fullWidth onClick={() => setShowSaveTemplate(true)}>Save Template</NeuButton>
                <NeuButton variant="ghost" icon={<FileUp className="h-4 w-4" />} size="sm" fullWidth onClick={() => setActiveTab('documents')}>Add Doc</NeuButton>
                <NeuButton variant="ghost" icon={<MessageSquare className="h-4 w-4" />} size="sm" fullWidth onClick={() => setActiveTab('comments')}>Comment</NeuButton>
                <div className="relative">
                  <NeuButton variant="ghost" icon={<Download className="h-4 w-4" />} size="sm" fullWidth
                    disabled={exportLoading} onClick={() => setExportMenuOpen(!exportMenuOpen)}>Export</NeuButton>
                  {exportMenuOpen && (
                    <div className="absolute right-0 top-full mt-1 z-20 neu-raised-sm p-1 min-w-[150px]">
                      <button onClick={handleExportJSON} className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-[var(--radius-sm)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]">JSON</button>
                      <button onClick={handleExportCSV} className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-[var(--radius-sm)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]">CSV</button>
                      <button onClick={handlePrint} className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-[var(--radius-sm)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]">Print</button>
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile action menu */}
              <div className="lg:hidden flex items-center gap-2">
                <NeuButton icon={<Edit3 className="h-4 w-4" />} size="sm" onClick={() => setShowEdit(true)}>Edit</NeuButton>
                {nextPhase && (
                  <NeuButton size="sm" icon={<ArrowRight className="h-4 w-4" />} disabled={advanceMutation.isPending}
                    onClick={() => setConfirmAdvance(true)}>
                    {PHASES[nextPhase].label}
                  </NeuButton>
                )}
                <div className="relative ml-auto">
                  <NeuButton variant="ghost" size="sm" icon={<MoreHorizontal className="h-4 w-4" />}
                    onClick={() => setShowActions(!showActions)} />
                  {showActions && (
                    <div className="absolute right-0 top-full mt-1 z-20 neu-raised-sm p-1 min-w-[160px]">
                      <button onClick={() => { setShowReminder(true); setShowActions(false) }} className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-[var(--radius-sm)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]"><Bell className="h-3.5 w-3.5" /> Set Reminder</button>
                      <button onClick={() => { setConfirmDuplicate(true); setShowActions(false) }} className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-[var(--radius-sm)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]"><Copy className="h-3.5 w-3.5" /> Duplicate</button>
                      <button onClick={() => { setShowSaveTemplate(true); setShowActions(false) }} className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-[var(--radius-sm)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]"><Copy className="h-3.5 w-3.5" /> Save Template</button>
                      <button onClick={() => { setActiveTab('documents'); setShowActions(false) }} className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-[var(--radius-sm)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]"><FileUp className="h-3.5 w-3.5" /> Add Doc</button>
                      <button onClick={() => { setActiveTab('comments'); setShowActions(false) }} className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-[var(--radius-sm)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]"><MessageSquare className="h-3.5 w-3.5" /> Comment</button>
                      <button onClick={handleExportJSON} className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-[var(--radius-sm)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]"><Download className="h-3.5 w-3.5" /> Export</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </NeuCard>
        </div>

        {/* Tabs (non-sticky instance — the sticky copy is above) */}
        <NeuTabs tabs={tabsWithCounts} activeTab={activeTab} onTabChange={setActiveTab} />

        {/* No workflow nudge — visible on overview when no stages exist */}
        {stages.length === 0 && activeTab === 'overview' && (
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-[var(--radius-md)] bg-[var(--amber-bg)] border border-[var(--amber)] border-opacity-30">
            <span className="text-xs text-[var(--amber)]">⚡ No workflow stages yet.</span>
            <button onClick={() => setActiveTab('workflow')}
              className="text-xs font-semibold text-[var(--amber)] hover:text-[var(--text-primary)] underline transition-colors">
              Go to Workflow tab to apply a template →
            </button>
          </div>
        )}

        {/* Tab Content */}
        <div>
          {activeTab === 'overview' && <OverviewTab asset={asset} assetId={params.id} />}
          {activeTab === 'workflow' && <WorkflowTab assetId={params.id} assetType={asset.asset_type as string} valueModel={asset.value_model as string | null} stages={typedStages} tasks={typedTasks} subtasks={typedSubtasks} focusTaskId={searchParams.get('taskId')} />}
          {activeTab === 'documents' && <DocumentsTab assetId={params.id} documents={documents} stages={typedStages} />}
          {activeTab === 'comments' && <CommentsTab assetId={params.id} currentUserId={currentUserId}
            tasks={typedTasks.map(t => ({ id: t.id, title: t.title, stage_id: (t as unknown as { stage_id: string }).stage_id }))}
            stages={typedStages.map(s => ({ id: s.id, name: s.name }))} />}
          {activeTab === 'tasks' && <TasksTab assetId={params.id} tasks={typedTasks} subtasks={typedSubtasks} />}
          {activeTab === 'activity' && <ActivityTab activity={activity} assetName={asset.reference_code as string} />}
          {activeTab === 'gates' && <GatesTab assetId={params.id} stages={typedStages} />}
          {activeTab === 'financials' && <FinancialsTab tasks={typedTasks} asset={asset} assetId={params.id} />}
          {activeTab === 'partners' && <PartnersTab partners={partners} assetId={params.id} />}
          {activeTab === 'communications' && <CommunicationsTab assetId={params.id} />}
          {activeTab === 'meetings' && <MeetingsTab assetId={params.id} />}
        </div>
      </div>

      {showEdit && <EditAssetModal asset={asset} assetId={params.id} onClose={() => setShowEdit(false)} />}
      <SaveTemplateModal open={showSaveTemplate} onClose={() => setShowSaveTemplate(false)} assetId={params.id} />
      <SetReminderModal open={showReminder} onClose={() => setShowReminder(false)} assetId={params.id} assetName={asset.name as string} />
      <GateWarningModal
        open={showGateModal}
        onClose={() => setShowGateModal(false)}
        onProceed={(reason) => advanceMutation.mutate({ assetId: params.id, targetPhase: gateTargetPhase as PhaseKey, force: true, overrideReason: reason })}
        warnings={gateWarnings}
        targetPhase={gateTargetPhase}
      />
      <NeuConfirmDialog
        open={confirmDuplicate}
        onClose={() => setConfirmDuplicate(false)}
        onConfirm={() => { setConfirmDuplicate(false); duplicateMutation.mutate({ assetId: params.id }) }}
        title="Duplicate Asset"
        message={`Create a copy of "${asset.name}"? The duplicate will be reset to Lead phase with a new reference code.`}
        confirmLabel="Duplicate"
        loading={duplicateMutation.isPending}
      />
      {nextPhase && (
        <NeuConfirmDialog
          open={confirmAdvance}
          onClose={() => setConfirmAdvance(false)}
          onConfirm={() => {
            setConfirmAdvance(false)
            advanceMutation.mutate({ assetId: params.id, targetPhase: nextPhase })
          }}
          title="Advance Phase"
          message={`Advance from ${PHASES[asset.current_phase as PhaseKey]?.label ?? asset.current_phase} to ${PHASES[nextPhase].label}? This will be logged to the audit trail.`}
          confirmLabel={`Advance to ${PHASES[nextPhase].label}`}
        />
      )}
    </div>
  )
}
