'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { trpc } from '@/lib/trpc'
import { NeuCard, NeuBadge, NeuButton, NeuTabs, NeuAvatar } from '@/components/ui'
import { PartnerOnboardingTab } from '@/components/crm/partners/PartnerOnboardingTab'
import { PartnerCredentialsTab } from '@/components/crm/partners/PartnerCredentialsTab'
import { PartnerAssignmentsTab } from '@/components/crm/partners/PartnerAssignmentsTab'
import { EditPartnerModal } from '@/components/crm/partners/EditPartnerModal'
import { PartnerDocumentsTab } from '@/components/crm/partners/PartnerDocumentsTab'
import {
  ChevronRight, Edit3, ExternalLink, Mail, Phone, User, Globe,
  LayoutGrid, ClipboardCheck, Award, Gem, Calendar, FileText,
} from 'lucide-react'

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
const RISK_COLOR: Record<string, 'gray' | 'chartreuse' | 'amber' | 'ruby'> = {
  low: 'chartreuse', medium: 'amber', high: 'ruby', unknown: 'gray',
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
  { id: 'credentials', label: 'Credentials', icon: <Award className="h-4 w-4" /> },
  { id: 'assignments', label: 'Assignments', icon: <Gem className="h-4 w-4" /> },
  { id: 'documents', label: 'Documents', icon: <FileText className="h-4 w-4" /> },
]

// ═══════════════════════════════════════════════════════════
export default function PartnerDetailPage() {
  const params = useParams<{ id: string }>()
  const [activeTab, setActiveTab] = useState('overview')
  const [showEdit, setShowEdit] = useState(false)
  const utils = trpc.useUtils()

  const { data, isLoading, error } = trpc.partners.getById.useQuery({ partnerId: params.id })
  const partner = data?.partner as Record<string, unknown> | undefined

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-[var(--text-muted)]">Loading partner...</p>
      </div>
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
  const risk = (partner.risk_level as string) ?? 'unknown'
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

      {/* Hero Card */}
      <NeuCard variant="raised" padding="lg">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-4">
              <NeuAvatar name={partner.name as string} size="lg" />
              <div className="min-w-0 flex-1">
                <h1
                  className="text-2xl font-semibold text-[var(--text-primary)] truncate"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {partner.name as string}
                </h1>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  <NeuBadge color="amethyst">{fmt(pType)}</NeuBadge>
                  <NeuBadge color={ENGAGEMENT_COLOR[engagement] ?? 'gray'}>{fmt(engagement)}</NeuBadge>
                  <NeuBadge color={DD_COLOR[dd] ?? 'gray'}>DD: {DD_LABEL[dd] ?? dd}</NeuBadge>
                  <NeuBadge color={RISK_COLOR[risk] ?? 'gray'}>Risk: {fmt(risk)}</NeuBadge>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
              <ContactField icon={User} label="Contact" value={partner.contact_name as string} />
              <ContactField icon={Mail} label="Email" value={partner.contact_email as string} isLink={`mailto:${partner.contact_email}`} />
              <ContactField icon={Phone} label="Phone" value={partner.contact_phone as string} />
              <ContactField icon={Globe} label="Website" value={partner.website as string} isLink={partner.website as string} external />
            </div>
          </div>

          {/* Actions */}
          <div className="flex lg:flex-col gap-2 flex-wrap lg:w-40 shrink-0">
            <NeuButton icon={<Edit3 className="h-4 w-4" />} size="sm" fullWidth onClick={() => setShowEdit(true)}>
              Edit
            </NeuButton>
            {(partner.website as string) && (
              <a href={partner.website as string} target="_blank" rel="noreferrer" className="w-full">
                <NeuButton variant="ghost" icon={<ExternalLink className="h-4 w-4" />} size="sm" fullWidth>
                  Website
                </NeuButton>
              </a>
            )}
          </div>
        </div>
      </NeuCard>

      {/* Tabs */}
      <NeuTabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && <OverviewTab partner={partner} />}
        {activeTab === 'onboarding' && <PartnerOnboardingTab partnerId={params.id} />}
        {activeTab === 'credentials' && <PartnerCredentialsTab partnerId={params.id} />}
        {activeTab === 'assignments' && <PartnerAssignmentsTab assets={data?.assets ?? []} />}
        {activeTab === 'documents' && <PartnerDocumentsTab partnerId={params.id as string} />}
      </div>

      {showEdit && partner && (
        <EditPartnerModal
          open={showEdit}
          onClose={() => setShowEdit(false)}
          partner={partner}
          onSuccess={() => utils.partners.getById.invalidate({ partnerId: params.id })}
        />
      )}
    </div>
  )
}

// ── Shared field component ─────────────────────────────────
function ContactField({ icon: Icon, label, value, isLink, external }: {
  icon: typeof Mail; label: string; value: string | null | undefined
  isLink?: string; external?: boolean
}) {
  if (!value) return null
  return (
    <div className="flex items-center gap-2.5 text-sm">
      <div className="w-8 h-8 rounded-[var(--radius-md)] bg-[var(--bg-body)] shadow-[var(--shadow-pressed)] flex items-center justify-center shrink-0">
        <Icon className="h-4 w-4 text-[var(--text-muted)]" />
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">{label}</p>
        {isLink ? (
          <a href={isLink} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})} className="text-[var(--teal)] hover:underline">
            {value}
          </a>
        ) : (
          <p className="text-[var(--text-primary)]">{value}</p>
        )}
      </div>
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
