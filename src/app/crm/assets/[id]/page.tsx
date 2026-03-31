'use client'

import { useState } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { saveAs } from 'file-saver'
import { trpc } from '@/lib/trpc'
import { NeuCard, NeuBadge, NeuButton, NeuTabs, NeuAvatar, NeuSkeleton } from '@/components/ui'
import { PhaseTimeline } from '@/components/crm/PhaseTimeline'
import {
  OverviewTab, WorkflowTab, TasksTab, DocumentsTab,
  CommentsTab, ActivityTab, GatesTab, PartnersTab,
  FinancialsTab, MeetingsTab, CommunicationsTab, EditAssetModal, SaveTemplateModal,
} from '@/components/crm/asset-detail'
import { GateWarningModal, type GateWarning } from '@/components/crm/GateWarningModal'
import {
  ChevronRight, Edit3, FileUp, MessageSquare, Download, LayoutGrid,
  Shield, FileText, CheckSquare, Activity, Lock, DollarSign,
  Handshake, MessageCircle, ArrowRight, Copy, Calendar, Phone,
} from 'lucide-react'
import { VALUE_MODELS, ASSET_STATUSES, PHASES, PHASE_ORDER, type PhaseKey } from '@/lib/constants'
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

// ── Page component ────────────────────────────────────────
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

  const utils = trpc.useUtils()
  const { data, isLoading, error } = trpc.assets.getById.useQuery({ assetId: params.id })

  const [exportLoading, setExportLoading] = useState(false)
  const [exportMenuOpen, setExportMenuOpen] = useState(false)

  const advanceMutation = trpc.assets.advancePhase.useMutation({
    onSuccess: (result) => {
      const res = result as { warnings?: GateWarning[]; new_phase?: string }
      if (res.warnings && res.warnings.length > 0) {
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

  // Transform raw data for V2 components
  const typedStages: Stage[] = stages.map((s) => ({
    id: s.id,
    name: s.name,
    status: s.status as Stage['status'],
    phase: s.phase as PhaseKey,
    is_gate: s.is_gate,
    sort_order: s.sort_order,
  }))

  const typedTasks: Task[] = tasks.map((t) => ({
    id: t.id,
    title: t.title,
    description: t.description ?? undefined,
    notes: t.notes ?? undefined,
    task_type: t.task_type as Task['task_type'],
    status: t.status as Task['status'],
    due_date: t.due_date ?? undefined,
    assigned_to: t.assigned_to ?? undefined,
    assignee: t.team_members
      ? { name: (t.team_members as { full_name: string }).full_name }
      : undefined,
    payment_amount: t.estimated_amount ?? undefined,
    payment_direction: t.task_type === 'payment_incoming' ? 'incoming' as const
      : t.task_type === 'payment_outgoing' ? 'outgoing' as const
      : undefined,
    stage_id: t.stage_id,
  })) as (Task & { stage_id: string })[]

  const typedSubtasks = subtasks.map((st) => ({
    id: st.id,
    task_id: st.task_id,
    title: st.title,
    status: st.status,
    subtask_type: (st as Record<string, unknown>).subtask_type as string | undefined,
    notes: (st as Record<string, unknown>).notes as string | undefined,
    assignee: undefined,
  }))

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
    <div className="space-y-4 max-w-6xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[13px]">
        <Link href="/crm" className="text-[var(--text-muted)] hover:text-[var(--text-secondary)]">Pipeline</Link>
        <ChevronRight className="h-3 w-3 text-[var(--text-muted)]" />
        <span className="font-semibold text-[var(--text-primary)]">{asset.name}</span>
      </nav>

      {/* Hero */}
      <NeuCard variant="raised" padding="lg">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-semibold text-[var(--text-primary)] truncate" style={{ fontFamily: 'var(--font-display)' }}>
              {asset.name}
            </h1>
            <p className="text-[13px] text-[var(--text-muted)] mt-0.5" style={{ fontFamily: 'var(--font-mono)' }}>
              {asset.reference_code}
            </p>

            <div className="flex flex-wrap gap-1.5 mt-3">
              <NeuBadge color={STATUS_COLOR[statusKey] ?? 'gray'}>{ASSET_STATUSES[statusKey]?.label ?? asset.status}</NeuBadge>
              {modelLabel && (
                <NeuBadge color={MODEL_COLOR[modelKey ?? ''] ?? 'gray'}>{modelLabel}</NeuBadge>
              )}
              <NeuBadge color="gray">{fmtType(asset.asset_type)}</NeuBadge>
            </div>

            {asset.asset_holder_entity && (
              <p className="text-sm text-[var(--text-secondary)] mt-2">{asset.asset_holder_entity}</p>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Claimed</p>
                <p className="text-lg font-bold text-[var(--text-primary)]">{fmt(asset.claimed_value)}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Appraised</p>
                <p className="text-lg font-bold text-[var(--text-primary)]">{fmt(asset.appraised_value)}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Raised</p>
                <p className="text-lg font-bold text-[var(--text-primary)]">{fmt(meta.capital_raised as number | null)}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Investors</p>
                <p className="text-lg font-bold text-[var(--text-primary)]">{(meta.investor_count as number) ?? 0}</p>
              </div>
            </div>

            {asset.team_members && (
              <div className="flex items-center gap-2 mt-3">
                <NeuAvatar name={(asset.team_members as { full_name: string }).full_name} size="sm" />
                <span className="text-sm text-[var(--text-secondary)]">
                  {(asset.team_members as { full_name: string }).full_name}
                </span>
              </div>
            )}
          </div>

          <div className="flex lg:flex-col gap-2 flex-wrap lg:w-44 shrink-0">
            <NeuButton icon={<Edit3 className="h-4 w-4" />} size="sm" fullWidth onClick={() => setShowEdit(true)}>Edit</NeuButton>
            <NeuButton
              variant="ghost"
              icon={<ArrowRight className="h-4 w-4" />}
              size="sm"
              fullWidth
              disabled={advanceMutation.isPending || !nextPhase}
              onClick={() => {
                if (!nextPhase) return
                advanceMutation.mutate({ assetId: params.id, targetPhase: nextPhase })
              }}
            >
              {nextPhase ? `Advance to ${PHASES[nextPhase].label}` : 'Final Phase'}
            </NeuButton>
            <NeuButton variant="ghost" icon={<Copy className="h-4 w-4" />} size="sm" fullWidth onClick={() => setShowSaveTemplate(true)}>Save Template</NeuButton>
            <NeuButton variant="ghost" icon={<FileUp className="h-4 w-4" />} size="sm" fullWidth onClick={() => setActiveTab('documents')}>Add Doc</NeuButton>
            <NeuButton variant="ghost" icon={<MessageSquare className="h-4 w-4" />} size="sm" fullWidth onClick={() => setActiveTab('comments')}>Comment</NeuButton>
            <div className="relative">
              <NeuButton variant="ghost" icon={<Download className="h-4 w-4" />} size="sm" fullWidth
                disabled={exportLoading} onClick={() => setExportMenuOpen(!exportMenuOpen)}>
                Export
              </NeuButton>
              {exportMenuOpen && (
                <div className="absolute right-0 top-full mt-1 z-20 neu-raised-sm p-1 min-w-[150px]">
                  <button onClick={handleExportJSON} className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-[var(--radius-sm)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]">Export JSON</button>
                  <button onClick={handleExportCSV} className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-[var(--radius-sm)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]">Export CSV</button>
                  <button onClick={handlePrint} className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-[var(--radius-sm)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]">Print Report</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </NeuCard>

      {/* Phase Timeline */}
      <NeuCard variant="pressed" padding="sm">
        <PhaseTimeline currentPhase={asset.current_phase as PhaseKey} />
      </NeuCard>

      {/* Tabs */}
      <NeuTabs tabs={tabsWithCounts} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && <OverviewTab asset={asset} assetId={params.id} />}
        {activeTab === 'workflow' && <WorkflowTab assetId={params.id} stages={typedStages} tasks={typedTasks} subtasks={typedSubtasks} />}
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

      {showEdit && <EditAssetModal asset={asset} assetId={params.id} onClose={() => setShowEdit(false)} />}
      <SaveTemplateModal open={showSaveTemplate} onClose={() => setShowSaveTemplate(false)} assetId={params.id} />
      <GateWarningModal
        open={showGateModal}
        onClose={() => setShowGateModal(false)}
        onProceed={() => {
          advanceMutation.mutate({ assetId: params.id, targetPhase: gateTargetPhase as PhaseKey, force: true })
        }}
        warnings={gateWarnings}
        targetPhase={gateTargetPhase}
      />
    </div>
  )
}
