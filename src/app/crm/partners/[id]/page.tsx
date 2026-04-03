'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { trpc } from '@/lib/trpc'
import { NeuCard, NeuBadge, NeuButton, NeuTabs, NeuAvatar } from '@/components/ui'
import { PartnerOnboardingTab } from '@/components/crm/partners/PartnerOnboardingTab'
// Credentials merged into Documents tab
import { PartnerAssignmentsTab } from '@/components/crm/partners/PartnerAssignmentsTab'
import { EditPartnerModal } from '@/components/crm/partners/EditPartnerModal'
import { PartnerDocumentsTab } from '@/components/crm/partners/PartnerDocumentsTab'
import { PartnerCommsTab } from '@/components/crm/partners/PartnerCommsTab'
import { ListPageSkeleton } from '@/components/crm/skeletons'
import {
  ChevronRight, Edit3, ExternalLink, Mail, Phone,
  LayoutGrid, ClipboardCheck, Gem, Calendar, FileText, MessageCircle, Bell,
} from 'lucide-react'
import { SetReminderModal } from '@/components/crm/SetReminderModal'

// ── Constants ─────────────────────────────────────────────
const DD_COLOR: Record<string, 'gray' | 'amber' | 'chartreuse' | 'ruby'> = {
  not_started: 'gray', in_progress: 'amber', passed: 'chartreuse', failed: 'ruby',
}
const DD_LABEL: Record<string, string> = {
  not_started: 'Not Started', in_progress: 'In Progress', passed: 'Passed', failed: 'Failed',
}
const ENGAGEMENT_COLOR: Record<string, 'gray' | 'teal' | 'amber' | 'ruby' | 'chartreuse'> = {
  prospecting: 'gray', evaluating: 'amber', onboarding: 'teal', active: 'chartreuse', paused: 'ruby', terminated: 'ruby',
}

function fmt(s: string): string {
  return s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}
function fmtDate(d: string | null | undefined): string {
  if (!d) return '---'
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const TABS = [
  { id: 'overview', label: 'Overview', icon: <LayoutGrid className="h-4 w-4" /> },
  { id: 'onboarding', label: 'Onboarding', icon: <ClipboardCheck className="h-4 w-4" /> },
  { id: 'assignments', label: 'Assignments', icon: <Gem className="h-4 w-4" /> },
  { id: 'documents', label: 'Documents', icon: <FileText className="h-4 w-4" /> },
  { id: 'comms', label: 'Comms', icon: <MessageCircle className="h-4 w-4" /> },
]

// ═══════════════════════════════════════════════════════════
export default function PartnerDetailPage() {
  const params = useParams<{ id: string }>()
  const [activeTab, setActiveTab] = useState('overview')
  const [showEdit, setShowEdit] = useState(false)
  const [showReminder, setShowReminder] = useState(false)
  const utils = trpc.useUtils()

  const { data, isLoading, error } = trpc.partners.getById.useQuery({ partnerId: params.id })
  const partner = data?.partner as Record<string, unknown> | undefined

  if (isLoading) {
    return (
      <ListPageSkeleton />
    )
  }

  if (error || !partner) {
    return (
      <NeuCard variant="raised" padding="lg">
        <p className="text-[var(--ruby)]">Error: {error?.message ?? 'Partner not found'}</p>
      </NeuCard>
    )
  }

  const dd = (partner.dd_status as string) ?? 'not_started'
  const engagement = (partner.engagement_status as string) ?? 'prospecting'
  const pType = (partner.type as string) ?? 'other'

  return (
    <div className="space-y-4 max-w-5xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[13px]">
        <Link href="/crm/partners" className="text-[var(--text-muted)] hover:text-[var(--text-secondary)]">
          Partners
        </Link>
        <ChevronRight className="h-3 w-3 text-[var(--text-muted)]" />
        <span className="font-semibold text-[var(--text-primary)]">{partner.name as string}</span>
      </nav>

      {/* Hero — compact bar */}
      <div className="flex items-center gap-3">
        <NeuAvatar name={partner.name as string} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-base lg:text-lg font-semibold text-[var(--text-primary)] truncate">{partner.name as string}</h1>
            <NeuBadge color="amethyst" size="sm">{fmt(pType)}</NeuBadge>
            <NeuBadge color={ENGAGEMENT_COLOR[engagement] ?? 'gray'} size="sm">{fmt(engagement)}</NeuBadge>
            <NeuBadge color={DD_COLOR[dd] ?? 'gray'} size="sm">DD: {DD_LABEL[dd] ?? dd}</NeuBadge>
          </div>
          <div className="flex items-center gap-3 mt-0.5 text-xs text-[var(--text-muted)]">
            {(partner.contact_name as string) && <span>{partner.contact_name as string}</span>}
            {(partner.contact_email as string) && (
              <a href={`mailto:${partner.contact_email}`} className="flex items-center gap-1 hover:text-[var(--teal)] transition-colors">
                <Mail className="h-3 w-3" />{partner.contact_email as string}
              </a>
            )}
            {(partner.contact_phone as string) && (
              <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{partner.contact_phone as string}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <NeuButton icon={<Edit3 className="h-3.5 w-3.5" />} size="sm" variant="ghost" onClick={() => setShowEdit(true)} />
          <NeuButton icon={<Bell className="h-3.5 w-3.5" />} size="sm" variant="ghost" onClick={() => setShowReminder(true)} />
          {(partner.website as string) && (
            <a href={partner.website as string} target="_blank" rel="noreferrer">
              <NeuButton icon={<ExternalLink className="h-3.5 w-3.5" />} size="sm" variant="ghost" />
            </a>
          )}
        </div>
      </div>

      {/* Tabs */}
      <NeuTabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && <OverviewTab partner={partner} />}
        {activeTab === 'onboarding' && <PartnerOnboardingTab partnerId={params.id as string} partnerType={partner?.type as string} />}
        {activeTab === 'assignments' && <PartnerAssignmentsTab assets={data?.assets ?? []} />}
        {activeTab === 'documents' && <PartnerDocumentsTab partnerId={params.id as string} />}
        {activeTab === 'comms' && <PartnerCommsTab partnerId={params.id as string} />}
      </div>

      {showEdit && partner && (
        <EditPartnerModal
          open={showEdit}
          onClose={() => setShowEdit(false)}
          partner={partner}
          onSuccess={() => utils.partners.getById.invalidate({ partnerId: params.id })}
        />
      )}
      <SetReminderModal
        open={showReminder}
        onClose={() => setShowReminder(false)}
        assetName={(partner?.name as string) ?? 'Partner'}
      />
    </div>
  )
}


// ── Overview Tab ────────────────────────────────────────────
function OverviewTab({ partner }: { partner: Record<string, unknown> }) {
  const dd = (partner.dd_status as string) ?? 'not_started'
  const engagement = (partner.engagement_status as string) ?? '---'

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <NeuCard variant="raised" padding="md">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Description</h3>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">
          {(partner.description as string) || (partner.notes as string) || 'No description provided.'}
        </p>
      </NeuCard>

      <NeuCard variant="raised" padding="md">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Engagement</h3>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <dt className="text-[var(--text-muted)]">Due Diligence</dt>
            <dd><NeuBadge color={DD_COLOR[dd] ?? 'gray'} size="sm">{DD_LABEL[dd] ?? dd}</NeuBadge></dd>
          </div>
          <div className="flex justify-between items-center">
            <dt className="text-[var(--text-muted)]">Engagement Status</dt>
            <dd className="text-[var(--text-primary)] capitalize">{engagement.replace(/_/g, ' ')}</dd>
          </div>
          <div className="flex justify-between items-center">
            <dt className="text-[var(--text-muted)]">Partner Type</dt>
            <dd><NeuBadge color="amethyst" size="sm">{fmt((partner.type as string) ?? 'other')}</NeuBadge></dd>
          </div>
        </dl>
      </NeuCard>

      <NeuCard variant="raised" padding="md">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Timeline</h3>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <dt className="text-[var(--text-muted)] flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> Created</dt>
            <dd className="text-[var(--text-primary)]">{fmtDate(partner.created_at as string)}</dd>
          </div>
          <div className="flex justify-between items-center">
            <dt className="text-[var(--text-muted)] flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> Updated</dt>
            <dd className="text-[var(--text-primary)]">{fmtDate(partner.updated_at as string)}</dd>
          </div>
          {(partner.contract_start_date as string) && (
            <div className="flex justify-between items-center">
              <dt className="text-[var(--text-muted)] flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> Contract Start</dt>
              <dd className="text-[var(--text-primary)]">{fmtDate(partner.contract_start_date as string)}</dd>
            </div>
          )}
          {(partner.contract_end_date as string) && (
            <div className="flex justify-between items-center">
              <dt className="text-[var(--text-muted)] flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> Contract End</dt>
              <dd className="text-[var(--text-primary)]">{fmtDate(partner.contract_end_date as string)}</dd>
            </div>
          )}
        </dl>
      </NeuCard>

      <NeuCard variant="raised" padding="md">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Notes</h3>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">
          {(partner.notes as string) || 'No notes recorded.'}
        </p>
      </NeuCard>
    </div>
  )
}
