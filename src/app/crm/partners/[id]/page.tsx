'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { trpc } from '@/lib/trpc'
import { NeuCard, NeuBadge, NeuButton, NeuTabs, NeuAvatar } from '@/components/ui'
import {
  ChevronRight, Edit3, ExternalLink, Mail, Phone, User,
  LayoutGrid, Gem, FileText, Globe, Calendar, Handshake,
} from 'lucide-react'

// ─── Constants ─────────────────────────────────────────
const DD_STATUS_COLOR: Record<string, 'gray' | 'amber' | 'chartreuse' | 'ruby'> = {
  not_started: 'gray',
  in_progress: 'amber',
  passed: 'chartreuse',
  failed: 'ruby',
}

const DD_STATUS_LABEL: Record<string, string> = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  passed: 'Passed',
  failed: 'Failed',
}

function formatPartnerType(type: string): string {
  return type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function formatDate(date: string | null | undefined): string {
  if (!date) return '---'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const TABS = [
  { id: 'overview', label: 'Overview', icon: <LayoutGrid className="h-4 w-4" /> },
  { id: 'assets', label: 'Assets', icon: <Gem className="h-4 w-4" /> },
  { id: 'documents', label: 'Documents', icon: <FileText className="h-4 w-4" /> },
]

// ═══════════════════════════════════════════════════════
export default function PartnerDetailPage() {
  const params = useParams<{ id: string }>()
  const [activeTab, setActiveTab] = useState('overview')

  const { data: partner, isLoading, error } = trpc.partners.getById.useQuery({
    partnerId: params.id,
  })

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

  const ddStatus = (partner.dd_status as string) ?? 'not_started'
  const partnerType = (partner.type as string) ?? 'other'

  return (
    <div className="space-y-4 max-w-5xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[13px]">
        <Link
          href="/crm/partners"
          className="text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
        >
          Partners
        </Link>
        <ChevronRight className="h-3 w-3 text-[var(--text-muted)]" />
        <span className="font-semibold text-[var(--text-primary)]">{partner.name}</span>
      </nav>

      {/* Hero Card */}
      <NeuCard variant="raised" padding="lg">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left — Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-4">
              <NeuAvatar name={partner.name} size="lg" />
              <div className="min-w-0 flex-1">
                <h1
                  className="text-2xl font-semibold text-[var(--text-primary)] truncate"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {partner.name}
                </h1>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  <NeuBadge color="amethyst">{formatPartnerType(partnerType)}</NeuBadge>
                  <NeuBadge color={DD_STATUS_COLOR[ddStatus] ?? 'gray'}>
                    DD: {DD_STATUS_LABEL[ddStatus] ?? ddStatus}
                  </NeuBadge>
                </div>
              </div>
            </div>

            {/* Contact Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
              {partner.contact_name && (
                <div className="flex items-center gap-2.5 text-sm">
                  <div className="w-8 h-8 rounded-[var(--radius-md)] bg-[var(--bg-body)] shadow-[var(--shadow-pressed)] flex items-center justify-center shrink-0">
                    <User className="h-4 w-4 text-[var(--text-muted)]" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                      Contact
                    </p>
                    <p className="text-[var(--text-primary)]">{partner.contact_name}</p>
                  </div>
                </div>
              )}

              {partner.contact_email && (
                <div className="flex items-center gap-2.5 text-sm">
                  <div className="w-8 h-8 rounded-[var(--radius-md)] bg-[var(--bg-body)] shadow-[var(--shadow-pressed)] flex items-center justify-center shrink-0">
                    <Mail className="h-4 w-4 text-[var(--text-muted)]" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                      Email
                    </p>
                    <a
                      href={`mailto:${partner.contact_email}`}
                      className="text-[var(--teal)] hover:underline"
                    >
                      {partner.contact_email}
                    </a>
                  </div>
                </div>
              )}

              {partner.contact_phone && (
                <div className="flex items-center gap-2.5 text-sm">
                  <div className="w-8 h-8 rounded-[var(--radius-md)] bg-[var(--bg-body)] shadow-[var(--shadow-pressed)] flex items-center justify-center shrink-0">
                    <Phone className="h-4 w-4 text-[var(--text-muted)]" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                      Phone
                    </p>
                    <p className="text-[var(--text-primary)]">{partner.contact_phone}</p>
                  </div>
                </div>
              )}

              {partner.website && (
                <div className="flex items-center gap-2.5 text-sm">
                  <div className="w-8 h-8 rounded-[var(--radius-md)] bg-[var(--bg-body)] shadow-[var(--shadow-pressed)] flex items-center justify-center shrink-0">
                    <Globe className="h-4 w-4 text-[var(--text-muted)]" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                      Website
                    </p>
                    <a
                      href={partner.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[var(--teal)] hover:underline"
                    >
                      {partner.website}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right — Actions */}
          <div className="flex lg:flex-col gap-2 flex-wrap lg:w-40 shrink-0">
            <NeuButton
              variant="ghost"
              icon={<Edit3 className="h-4 w-4" />}
              size="sm"
              fullWidth
              disabled
            >
              Edit
            </NeuButton>
            {partner.website && (
              <a
                href={partner.website}
                target="_blank"
                rel="noreferrer"
                className="w-full"
              >
                <NeuButton
                  variant="ghost"
                  icon={<ExternalLink className="h-4 w-4" />}
                  size="sm"
                  fullWidth
                >
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
        {activeTab === 'assets' && <AssetsTab />}
        {activeTab === 'documents' && <DocumentsTab />}
      </div>
    </div>
  )
}

// ─── Overview Tab ──────────────────────────────────────
function OverviewTab({ partner }: { partner: Record<string, unknown> }) {
  const ddStatus = (partner.dd_status as string) ?? 'not_started'
  const engagementStatus = (partner.engagement_status as string) ?? '---'

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Description & Notes */}
      <NeuCard variant="raised" padding="md">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Description</h3>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          {(partner.notes as string) || (partner.description as string) || 'No description provided.'}
        </p>
      </NeuCard>

      {/* Status & Engagement */}
      <NeuCard variant="raised" padding="md">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Status</h3>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <dt className="text-[var(--text-muted)]">Due Diligence</dt>
            <dd>
              <NeuBadge color={DD_STATUS_COLOR[ddStatus] ?? 'gray'} size="sm">
                {DD_STATUS_LABEL[ddStatus] ?? ddStatus}
              </NeuBadge>
            </dd>
          </div>
          <div className="flex justify-between items-center">
            <dt className="text-[var(--text-muted)]">Engagement</dt>
            <dd className="text-[var(--text-primary)] capitalize">
              {engagementStatus.replace(/_/g, ' ')}
            </dd>
          </div>
          <div className="flex justify-between items-center">
            <dt className="text-[var(--text-muted)]">Partner Type</dt>
            <dd>
              <NeuBadge color="amethyst" size="sm">
                {formatPartnerType((partner.type as string) ?? 'other')}
              </NeuBadge>
            </dd>
          </div>
        </dl>
      </NeuCard>

      {/* Dates */}
      <NeuCard variant="raised" padding="md">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Timeline</h3>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <dt className="text-[var(--text-muted)] flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              Created
            </dt>
            <dd className="text-[var(--text-primary)]">{formatDate(partner.created_at as string)}</dd>
          </div>
          <div className="flex justify-between items-center">
            <dt className="text-[var(--text-muted)] flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              Updated
            </dt>
            <dd className="text-[var(--text-primary)]">{formatDate(partner.updated_at as string)}</dd>
          </div>
          {(partner.contract_start_date as string | null) != null && (
            <div className="flex justify-between items-center">
              <dt className="text-[var(--text-muted)] flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                Contract Start
              </dt>
              <dd className="text-[var(--text-primary)]">
                {formatDate(partner.contract_start_date as string)}
              </dd>
            </div>
          )}
          {(partner.contract_end_date as string | null) != null && (
            <div className="flex justify-between items-center">
              <dt className="text-[var(--text-muted)] flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                Contract End
              </dt>
              <dd className="text-[var(--text-primary)]">
                {formatDate(partner.contract_end_date as string)}
              </dd>
            </div>
          )}
        </dl>
      </NeuCard>

      {/* Notes */}
      <NeuCard variant="raised" padding="md">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Notes</h3>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          {(partner.notes as string) || 'No notes recorded.'}
        </p>
      </NeuCard>
    </div>
  )
}

// ─── Assets Tab ────────────────────────────────────────
function AssetsTab() {
  return (
    <NeuCard variant="pressed" padding="lg" className="text-center">
      <Handshake className="h-10 w-10 text-[var(--text-placeholder)] mx-auto mb-3" />
      <p className="text-sm text-[var(--text-muted)]">
        Assets assigned to this partner will appear here
      </p>
      <p className="text-xs text-[var(--text-placeholder)] mt-1">
        Asset-partner assignments are managed from individual asset pages
      </p>
    </NeuCard>
  )
}

// ─── Documents Tab ─────────────────────────────────────
function DocumentsTab() {
  return (
    <NeuCard variant="pressed" padding="lg" className="text-center">
      <FileText className="h-10 w-10 text-[var(--text-placeholder)] mx-auto mb-3" />
      <p className="text-sm text-[var(--text-muted)]">Documents for this partner</p>
      <p className="text-xs text-[var(--text-placeholder)] mt-1">
        Contracts, NDAs, and due diligence documents will be stored here
      </p>
    </NeuCard>
  )
}
