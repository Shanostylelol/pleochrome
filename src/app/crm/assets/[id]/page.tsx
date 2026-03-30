'use client'

import { useState } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { trpc } from '@/lib/trpc'
import { NeuCard, NeuBadge, NeuButton, NeuTabs, NeuAvatar, NeuInput, NeuTextarea } from '@/components/ui'
import { PhaseTimeline } from '@/components/crm/PhaseTimeline'
import {
  ChevronRight, Edit3, FileUp, MessageSquare, Download,
  LayoutGrid, Shield, FileText, CheckSquare, Activity,
  Lock, DollarSign, Handshake, Clock, X,
} from 'lucide-react'

const pathColorMap: Record<string, 'emerald' | 'teal' | 'sapphire' | 'amber' | 'gray'> = {
  fractional_securities: 'emerald',
  tokenization: 'teal',
  debt_instruments: 'sapphire',
  evaluating: 'amber',
}
const pathLabels: Record<string, string> = {
  fractional_securities: 'Fractional',
  tokenization: 'Tokenization',
  debt_instruments: 'Debt',
  evaluating: 'Evaluating',
}
const statusColorMap: Record<string, 'emerald' | 'teal' | 'amber' | 'chartreuse' | 'ruby' | 'gray'> = {
  prospect: 'gray',
  screening: 'emerald',
  active: 'teal',
  paused: 'amber',
  completed: 'chartreuse',
  terminated: 'ruby',
}

function formatAssetType(type: string): string {
  return type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function fmt(val: number | null | undefined): string {
  if (!val) return 'TBD'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val)
}

const TABS = [
  { id: 'overview', label: 'Overview', icon: <LayoutGrid className="h-4 w-4" /> },
  { id: 'governance', label: 'Governance', icon: <Shield className="h-4 w-4" /> },
  { id: 'documents', label: 'Documents', icon: <FileText className="h-4 w-4" /> },
  { id: 'tasks', label: 'Tasks', icon: <CheckSquare className="h-4 w-4" /> },
  { id: 'activity', label: 'Activity', icon: <Activity className="h-4 w-4" /> },
  { id: 'gates', label: 'Gates', icon: <Lock className="h-4 w-4" /> },
  { id: 'financials', label: 'Financials', icon: <DollarSign className="h-4 w-4" /> },
  { id: 'partners', label: 'Partners', icon: <Handshake className="h-4 w-4" /> },
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
  const { data, isLoading, error } = trpc.assets.getById.useQuery({ assetId: params.id })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-[var(--text-muted)]">Loading asset...</p>
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

  const { asset, steps, documents, tasks, activity, partners } = data
  const meta = (asset.metadata ?? {}) as Record<string, unknown>
  const totalSteps = steps.length

  const tabsWithCounts = TABS.map((t) => {
    if (t.id === 'governance') return { ...t, count: totalSteps }
    if (t.id === 'documents') return { ...t, count: documents.length }
    if (t.id === 'tasks') return { ...t, count: tasks.length }
    if (t.id === 'partners') return { ...t, count: partners.length }
    return t
  })

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
              <NeuBadge color={statusColorMap[asset.status] ?? 'gray'}>{asset.status}</NeuBadge>
              {asset.value_path && (
                <NeuBadge color={pathColorMap[asset.value_path] ?? 'gray'}>
                  {pathLabels[asset.value_path] ?? asset.value_path}
                </NeuBadge>
              )}
              <NeuBadge color="gray">{formatAssetType(asset.asset_type)}</NeuBadge>
            </div>

            {asset.asset_holder_entity && (
              <p className="text-sm text-[var(--text-secondary)] mt-2">{asset.asset_holder_entity}</p>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Appraised</p>
                <p className="text-lg font-bold text-[var(--text-primary)]">{fmt(asset.claimed_value)}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Offering</p>
                <p className="text-lg font-bold text-[var(--text-primary)]">{fmt(asset.offering_value)}</p>
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
            <NeuButton variant="ghost" icon={<FileUp className="h-4 w-4" />} size="sm" fullWidth onClick={() => setActiveTab('documents')}>Add Doc</NeuButton>
            <NeuButton variant="ghost" icon={<MessageSquare className="h-4 w-4" />} size="sm" fullWidth onClick={() => setActiveTab('activity')}>Note</NeuButton>
            <NeuButton variant="ghost" icon={<Download className="h-4 w-4" />} size="sm" fullWidth disabled>Export</NeuButton>
          </div>
        </div>
      </NeuCard>

      {/* Phase Timeline */}
      <NeuCard variant="pressed" padding="sm">
        <PhaseTimeline currentPhase={asset.current_phase} />
      </NeuCard>

      {/* Tabs */}
      <NeuTabs tabs={tabsWithCounts} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && (
          <OverviewTab asset={asset} meta={meta} />
        )}
        {activeTab === 'governance' && (
          <GovernanceTab steps={steps} />
        )}
        {activeTab === 'documents' && (
          <DocumentsTab assetId={params.id} documents={documents} />
        )}
        {activeTab === 'tasks' && (
          <TasksTab assetId={params.id} tasks={tasks} />
        )}
        {activeTab === 'activity' && (
          <ActivityTab activity={activity} />
        )}
        {activeTab === 'gates' && (
          <GatesTab />
        )}
        {activeTab === 'financials' && (
          <FinancialsTab asset={asset} />
        )}
        {activeTab === 'partners' && (
          <PartnersTab partners={partners} />
        )}
      </div>

      {showEdit && <EditAssetModal asset={asset} assetId={params.id} onClose={() => setShowEdit(false)} />}
    </div>
  )
}

function OverviewTab({ asset, meta }: { asset: Record<string, unknown>; meta: Record<string, unknown> }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <NeuCard variant="raised" padding="md">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Holder Information</h3>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-[var(--text-muted)]">Entity</dt>
            <dd className="text-[var(--text-primary)]">{(asset.asset_holder_entity as string) ?? '—'}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-[var(--text-muted)]">Description</dt>
            <dd className="text-[var(--text-primary)] text-right max-w-[60%]">{(asset.description as string) ?? '—'}</dd>
          </div>
        </dl>
      </NeuCard>

      <NeuCard variant="raised" padding="md">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Certification</h3>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-[var(--text-muted)]">Origin</dt>
            <dd className="text-[var(--text-primary)]">{(meta.origin as string) ?? (asset.origin as string) ?? '—'}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-[var(--text-muted)]">Carat Weight</dt>
            <dd className="text-[var(--text-primary)]">{(meta.carat_weight as number) ?? (asset.carat_weight as number) ?? '—'} ct</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-[var(--text-muted)]">GIA Report</dt>
            <dd className="text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-mono)' }}>{(meta.gia_report_number as string) ?? '—'}</dd>
          </div>
        </dl>
      </NeuCard>

      <NeuCard variant="raised" padding="md">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Custody</h3>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-[var(--text-muted)]">Vault Provider</dt>
            <dd className="text-[var(--text-primary)]">{(meta.vault_provider as string) ?? '—'}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-[var(--text-muted)]">PoR Status</dt>
            <dd><NeuBadge color="gray" size="sm">{(meta.por_status as string) ?? 'Pending'}</NeuBadge></dd>
          </div>
        </dl>
      </NeuCard>

      <NeuCard variant="raised" padding="md">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Legal</h3>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-[var(--text-muted)]">SPV Name</dt>
            <dd className="text-[var(--text-primary)]">{(asset.spv_name as string) ?? '—'}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-[var(--text-muted)]">SPV EIN</dt>
            <dd className="text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-mono)' }}>{(asset.spv_ein as string) ?? '—'}</dd>
          </div>
        </dl>
      </NeuCard>
    </div>
  )
}

function GovernanceTab({ steps }: { steps: Array<Record<string, unknown>> }) {
  if (steps.length === 0) {
    return (
      <NeuCard variant="pressed" padding="lg" className="text-center">
        <Shield className="h-10 w-10 text-[var(--text-placeholder)] mx-auto mb-3" />
        <p className="text-sm text-[var(--text-muted)]">No governance steps created yet.</p>
        <p className="text-xs text-[var(--text-placeholder)] mt-1">Steps are created when the asset workflow is assembled.</p>
      </NeuCard>
    )
  }

  const grouped: Record<string, Array<Record<string, unknown>>> = {}
  steps.forEach((s) => {
    const phase = (s.phase_name as string) ?? `Phase ${s.phase_number}`
    if (!grouped[phase]) grouped[phase] = []
    grouped[phase].push(s)
  })

  const stepStatusColor: Record<string, 'teal' | 'chartreuse' | 'ruby' | 'gray'> = {
    not_started: 'gray',
    in_progress: 'teal',
    blocked: 'ruby',
    completed: 'chartreuse',
    skipped: 'gray',
  }

  return (
    <div className="space-y-4">
      {Object.entries(grouped).map(([phaseName, phaseSteps]) => (
        <NeuCard key={phaseName} variant="raised" padding="md">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">{phaseName}</h3>
          <div className="space-y-2">
            {phaseSteps.map((step) => (
              <div key={step.id as string} className="flex items-center gap-3 px-3 py-2 rounded-[var(--radius-md)] bg-[var(--bg-body)] shadow-[var(--shadow-pressed)]">
                <NeuBadge color={stepStatusColor[(step.status as string) ?? 'not_started'] ?? 'gray'} dot />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--text-primary)] truncate">{step.name as string}</p>
                  <p className="text-xs text-[var(--text-muted)]">Step {step.phase_number as number}.{step.step_number as number}</p>
                </div>
                <NeuBadge color={stepStatusColor[(step.status as string) ?? 'not_started'] ?? 'gray'} size="sm">
                  {(step.status as string) ?? 'not_started'}
                </NeuBadge>
              </div>
            ))}
          </div>
        </NeuCard>
      ))}
    </div>
  )
}

function ActivityTab({ activity }: { activity: Array<Record<string, unknown>> }) {
  if (activity.length === 0) {
    return (
      <NeuCard variant="pressed" padding="lg" className="text-center">
        <Activity className="h-10 w-10 text-[var(--text-placeholder)] mx-auto mb-3" />
        <p className="text-sm text-[var(--text-muted)]">No activity recorded yet.</p>
      </NeuCard>
    )
  }

  return (
    <NeuCard variant="raised" padding="md">
      <div className="space-y-3">
        {activity.map((entry) => (
          <div key={entry.id as string} className="flex items-start gap-3 pb-3 border-b border-[var(--border)] last:border-0">
            <Clock className="h-4 w-4 text-[var(--text-muted)] mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-[var(--text-primary)]">{entry.action as string}</p>
              <p className="text-xs text-[var(--text-muted)]">
                {new Date(entry.created_at as string).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </NeuCard>
  )
}

function PartnersTab({ partners }: { partners: Array<Record<string, unknown>> }) {
  if (partners.length === 0) {
    return (
      <NeuCard variant="pressed" padding="lg" className="text-center">
        <Handshake className="h-10 w-10 text-[var(--text-placeholder)] mx-auto mb-3" />
        <p className="text-sm text-[var(--text-muted)]">No partners assigned yet.</p>
      </NeuCard>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {partners.map((ap) => {
        const partner = ap.partners as Record<string, unknown> | null
        return (
          <NeuCard key={ap.id as string} variant="raised" padding="md" hoverable>
            <div className="flex items-center gap-3">
              <NeuAvatar name={(partner?.name as string) ?? 'Partner'} />
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">{(partner?.name as string) ?? 'Unknown'}</p>
                <p className="text-xs text-[var(--text-muted)]">{(ap.role_on_asset as string) ?? 'Partner'}</p>
              </div>
            </div>
          </NeuCard>
        )
      })}
    </div>
  )
}

function DocumentsTab({ assetId, documents }: { assetId: string; documents: Array<Record<string, unknown>> }) {
  const [uploading, setUploading] = useState(false)
  const utils = trpc.useUtils()
  const createDoc = trpc.documents.create.useMutation({
    onSuccess: () => utils.assets.getById.invalidate({ assetId }),
  })

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const { createClient: createBrowser } = await import('@/lib/supabase')
      const supabase = createBrowser()
      const path = `${assetId}/${Date.now()}-${file.name}`
      const { error } = await supabase.storage.from('asset-documents').upload(path, file)
      if (error) throw error
      await createDoc.mutateAsync({
        title: file.name.replace(/\.[^.]+$/, ''),
        filename: file.name,
        storagePath: path,
        storageBucket: 'asset-documents',
        mimeType: file.type,
        fileSizeBytes: file.size,
        documentType: 'other',
        assetId,
      })
    } catch (err) {
      console.error('Upload failed:', err)
    }
    setUploading(false)
    e.target.value = ''
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--text-secondary)]">{documents.length} documents</p>
        <label className="cursor-pointer inline-block">
          <span className="inline-flex items-center justify-center gap-2 h-8 px-3 text-xs font-medium rounded-[var(--radius-md)] bg-[var(--teal)] text-white shadow-[var(--shadow-raised-sm)] hover:bg-[var(--teal-light)] transition-all neu-btn-press">
            <FileUp className="h-4 w-4" />
            {uploading ? 'Uploading...' : 'Upload'}
          </span>
          <input type="file" className="hidden" onChange={handleUpload} accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.png,.jpg,.jpeg,.webp" />
        </label>
      </div>
      {documents.length === 0 ? (
        <NeuCard variant="pressed" padding="lg" className="text-center">
          <FileText className="h-10 w-10 text-[var(--text-placeholder)] mx-auto mb-3" />
          <p className="text-sm text-[var(--text-muted)]">No documents attached</p>
          <p className="text-xs text-[var(--text-placeholder)] mt-1">Upload documents for this asset</p>
        </NeuCard>
      ) : (
        <div className="space-y-2">
          {documents.map((doc) => (
            <NeuCard key={doc.id as string} variant="raised-sm" padding="sm" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--teal-bg)] text-[var(--teal)] flex items-center justify-center shrink-0">
                <FileText className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--text-primary)] truncate">{(doc.title ?? doc.filename) as string}</p>
                <p className="text-xs text-[var(--text-muted)]">
                  {doc.document_type as string} · {((doc.file_size_bytes as number) / 1024).toFixed(0)} KB
                </p>
              </div>
              <NeuBadge color="gray" size="sm">{doc.document_type as string}</NeuBadge>
            </NeuCard>
          ))}
        </div>
      )}
    </div>
  )
}

function TasksTab({ assetId, tasks }: { assetId: string; tasks: Array<Record<string, unknown>> }) {
  const [showCreate, setShowCreate] = useState(false)
  const [title, setTitle] = useState('')
  const utils = trpc.useUtils()
  const createTask = trpc.tasks.create.useMutation({
    onSuccess: () => { utils.assets.getById.invalidate({ assetId }); setShowCreate(false); setTitle('') },
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--text-secondary)]">{tasks.length} tasks</p>
        <NeuButton icon={<CheckSquare className="h-4 w-4" />} size="sm" onClick={() => setShowCreate(!showCreate)}>Add Task</NeuButton>
      </div>
      {showCreate && (
        <NeuCard variant="pressed" padding="md" className="flex gap-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="New task title..."
            className="flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-placeholder)] outline-none"
            onKeyDown={(e) => e.key === 'Enter' && title.trim() && createTask.mutate({ title, assetId })}
          />
          <NeuButton size="sm" onClick={() => createTask.mutate({ title, assetId })} disabled={!title.trim()} loading={createTask.isPending}>
            Create
          </NeuButton>
        </NeuCard>
      )}
      {tasks.length === 0 && !showCreate ? (
        <NeuCard variant="pressed" padding="lg" className="text-center">
          <CheckSquare className="h-10 w-10 text-[var(--text-placeholder)] mx-auto mb-3" />
          <p className="text-sm text-[var(--text-muted)]">No tasks for this asset</p>
        </NeuCard>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => (
            <NeuCard key={task.id as string} variant="raised-sm" padding="sm" className="flex items-center gap-3">
              <div className={`w-2.5 h-2.5 rounded-full ${(task.status as string) === 'done' ? 'bg-[var(--chartreuse)]' : 'bg-[var(--teal)]'}`} />
              <p className={`text-sm flex-1 ${(task.status as string) === 'done' ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'}`}>
                {task.title as string}
              </p>
              <NeuBadge color={(task.status as string) === 'done' ? 'chartreuse' : 'gray'} size="sm">{task.status as string}</NeuBadge>
            </NeuCard>
          ))}
        </div>
      )}
    </div>
  )
}

function GatesTab() {
  return (
    <NeuCard variant="pressed" padding="lg" className="text-center">
      <Lock className="h-10 w-10 text-[var(--text-placeholder)] mx-auto mb-3" />
      <p className="text-sm text-[var(--text-muted)]">Gate checks track governance milestone approvals</p>
      <p className="text-xs text-[var(--text-placeholder)] mt-1">Gates are evaluated when all step requirements in a phase are complete</p>
    </NeuCard>
  )
}

function FinancialsTab({ asset }: { asset: Record<string, unknown> }) {
  const meta = (asset.metadata ?? {}) as Record<string, unknown>
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <NeuCard variant="raised" padding="md">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Valuation</h3>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-[var(--text-muted)]">Claimed Value</dt>
            <dd className="text-[var(--text-primary)] font-semibold">{fmt(asset.claimed_value as number | null)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-[var(--text-muted)]">Offering Value</dt>
            <dd className="text-[var(--text-primary)] font-semibold">{fmt(asset.offering_value as number | null)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-[var(--text-muted)]">Capital Raised</dt>
            <dd className="text-[var(--text-primary)] font-semibold">{fmt(meta.capital_raised as number | null)}</dd>
          </div>
        </dl>
      </NeuCard>
      <NeuCard variant="raised" padding="md">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Structure</h3>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-[var(--text-muted)]">SPV Name</dt>
            <dd className="text-[var(--text-primary)]">{(asset.spv_name as string) ?? '—'}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-[var(--text-muted)]">Value Path</dt>
            <dd className="text-[var(--text-primary)]">
              {pathLabels[asset.value_path as string] ?? (asset.value_path as string) ?? '—'}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-[var(--text-muted)]">Investors</dt>
            <dd className="text-[var(--text-primary)]">{(meta.investor_count as number) ?? 0}</dd>
          </div>
        </dl>
      </NeuCard>
    </div>
  )
}

// ─── Edit Asset Modal ───────────────────────────────────
function EditAssetModal({ asset, assetId, onClose }: { asset: Record<string, unknown>; assetId: string; onClose: () => void }) {
  const [name, setName] = useState((asset.name as string) ?? '')
  const [description, setDescription] = useState((asset.description as string) ?? '')
  const [claimedValue, setClaimedValue] = useState((asset.claimed_value as number)?.toString() ?? '')
  const [offeringValue, setOfferingValue] = useState((asset.offering_value as number)?.toString() ?? '')

  const utils = trpc.useUtils()
  const updateMutation = trpc.assets.update.useMutation({
    onSuccess: () => {
      utils.assets.getById.invalidate({ assetId })
      onClose()
    },
  })

  const handleSubmit = () => {
    if (!name.trim()) return
    updateMutation.mutate({
      assetId,
      name: name.trim(),
      description: description.trim() || undefined,
      claimedValue: claimedValue ? parseFloat(claimedValue) : undefined,
      offeringValue: offeringValue ? parseFloat(offeringValue) : undefined,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[var(--overlay)]" onClick={onClose} />
      <NeuCard variant="raised" padding="lg" className="relative w-full max-w-md z-10 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>Edit Asset</h2>
          <button onClick={onClose} className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)]"><X className="h-5 w-5" /></button>
        </div>

        <div className="space-y-3">
          <NeuInput
            label="Name *"
            placeholder="Asset name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <NeuTextarea
            label="Description"
            placeholder="Asset description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
          <NeuInput
            label="Claimed Value"
            placeholder="e.g., 15400000"
            type="number"
            value={claimedValue}
            onChange={(e) => setClaimedValue(e.target.value)}
          />
          <NeuInput
            label="Offering Value"
            placeholder="e.g., 12000000"
            type="number"
            value={offeringValue}
            onChange={(e) => setOfferingValue(e.target.value)}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <NeuButton variant="ghost" onClick={onClose} fullWidth>Cancel</NeuButton>
          <NeuButton onClick={handleSubmit} loading={updateMutation.isPending} disabled={!name.trim()} fullWidth>Save Changes</NeuButton>
        </div>
        {updateMutation.error && <p className="text-sm text-[var(--ruby)]">{updateMutation.error.message}</p>}
      </NeuCard>
    </div>
  )
}
