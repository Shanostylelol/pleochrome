'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { trpc } from '@/lib/trpc'
import { NeuCard, NeuBadge, NeuButton, NeuTabs, NeuAvatar } from '@/components/ui'
import { PhaseTimeline } from '@/components/crm/PhaseTimeline'
import {
  ChevronRight, Edit3, FileUp, MessageSquare, Download,
  LayoutGrid, Shield, FileText, CheckSquare, Activity,
  Lock, DollarSign, Handshake, Clock,
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
  const [activeTab, setActiveTab] = useState('overview')
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
            <NeuButton icon={<Edit3 className="h-4 w-4" />} size="sm" fullWidth>Edit</NeuButton>
            <NeuButton variant="ghost" icon={<FileUp className="h-4 w-4" />} size="sm" fullWidth>Add Doc</NeuButton>
            <NeuButton variant="ghost" icon={<MessageSquare className="h-4 w-4" />} size="sm" fullWidth>Note</NeuButton>
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
          <PlaceholderTab label="Documents" count={documents.length} description="Document management will be built in Phase 3" />
        )}
        {activeTab === 'tasks' && (
          <PlaceholderTab label="Tasks" count={tasks.length} description="Task dashboard will be built in Phase 4" />
        )}
        {activeTab === 'activity' && (
          <ActivityTab activity={activity} />
        )}
        {activeTab === 'gates' && (
          <PlaceholderTab label="Gates" description="Gate checks will be built in Phase 2.6" />
        )}
        {activeTab === 'financials' && (
          <PlaceholderTab label="Financials" description="Financial tracking will be built in Phase 7" />
        )}
        {activeTab === 'partners' && (
          <PartnersTab partners={partners} />
        )}
      </div>
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

function PlaceholderTab({ label, count, description }: { label: string; count?: number; description: string }) {
  return (
    <NeuCard variant="pressed" padding="lg" className="text-center">
      <p className="text-sm text-[var(--text-muted)]">
        {label}{count !== undefined ? ` (${count} items)` : ''} — {description}
      </p>
    </NeuCard>
  )
}
