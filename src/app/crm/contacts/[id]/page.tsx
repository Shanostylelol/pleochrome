'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { trpc } from '@/lib/trpc'
import { NeuCard, NeuBadge, NeuButton, NeuTabs, NeuAvatar } from '@/components/ui'
import { ContactOverviewTab } from '@/components/crm/contacts/ContactOverviewTab'
import { ContactOnboardingChecklist } from '@/components/crm/contacts/ContactOnboardingChecklist'
import { ContactKycTab } from '@/components/crm/contacts/ContactKycTab'
import { ContactOwnershipTab } from '@/components/crm/contacts/ContactOwnershipTab'
import { ContactCommsTab } from '@/components/crm/contacts/ContactCommsTab'
import { EditContactModal } from '@/components/crm/contacts/EditContactModal'
import {
  ChevronRight, Edit3, LayoutGrid, ShieldCheck, Network, MessageCircle,
  Mail, Phone, User, Building2,
} from 'lucide-react'

// ── KYC badge color ──────────────────────────────────────
const KYC_COLOR: Record<string, 'gray' | 'amber' | 'teal' | 'chartreuse' | 'ruby'> = {
  not_started: 'gray', pending: 'amber', in_review: 'teal',
  verified: 'chartreuse', rejected: 'ruby', expired: 'ruby',
}

function formatKyc(s: string): string {
  return s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

const TABS = [
  { id: 'overview', label: 'Overview', icon: <LayoutGrid className="h-4 w-4" /> },
  { id: 'kyc', label: 'KYC', icon: <ShieldCheck className="h-4 w-4" /> },
  { id: 'ownership', label: 'Ownership', icon: <Network className="h-4 w-4" /> },
  { id: 'comms', label: 'Communications', icon: <MessageCircle className="h-4 w-4" /> },
]

// ═══════════════════════════════════════════════════════════
export default function ContactDetailPage() {
  const params = useParams<{ id: string }>()
  const [activeTab, setActiveTab] = useState('overview')
  const [showEdit, setShowEdit] = useState(false)
  const utils = trpc.useUtils()

  const { data, isLoading, error } = trpc.contacts.getById.useQuery({ contactId: params.id })
  const contact = data?.contact

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-[var(--text-muted)]">Loading contact...</p>
      </div>
    )
  }

  if (error || !contact) {
    return (
      <NeuCard variant="raised" padding="lg">
        <p className="text-[var(--ruby)]">Error: {error?.message ?? 'Contact not found'}</p>
      </NeuCard>
    )
  }

  const ct = contact as Record<string, unknown>
  const kyc = (ct.kyc_status as string) ?? 'not_started'
  const isEntity = ct.contact_type === 'entity'
  const displayName = (ct.full_name as string) || (ct.entity_name as string) || '---'

  return (
    <div className="space-y-4 max-w-5xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[13px]">
        <Link href="/crm/contacts" className="text-[var(--text-muted)] hover:text-[var(--text-secondary)]">
          Contacts
        </Link>
        <ChevronRight className="h-3 w-3 text-[var(--text-muted)]" />
        <span className="font-semibold text-[var(--text-primary)]">{displayName}</span>
      </nav>

      {/* Hero Card */}
      <NeuCard variant="raised" padding="lg">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-4">
              <NeuAvatar name={displayName} size="lg" />
              <div className="min-w-0 flex-1">
                <h1
                  className="text-2xl font-semibold text-[var(--text-primary)] truncate"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {displayName}
                </h1>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  <NeuBadge color={isEntity ? 'sapphire' : 'amethyst'}>
                    {isEntity ? 'Entity' : 'Individual'}
                  </NeuBadge>
                  {(ct.role as string) && (
                    <NeuBadge color="gray">{((ct.role as string)).replace(/_/g, ' ')}</NeuBadge>
                  )}
                  <NeuBadge color={KYC_COLOR[kyc] ?? 'gray'}>
                    KYC: {formatKyc(kyc)}
                  </NeuBadge>
                </div>
              </div>
            </div>

            {/* Quick contact info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
              {(ct.email as string) && (
                <div className="flex items-center gap-2.5 text-sm">
                  <div className="w-8 h-8 rounded-[var(--radius-md)] bg-[var(--bg-body)] shadow-[var(--shadow-pressed)] flex items-center justify-center shrink-0">
                    <Mail className="h-4 w-4 text-[var(--text-muted)]" />
                  </div>
                  <a href={`mailto:${ct.email}`} className="text-[var(--teal)] hover:underline truncate">
                    {ct.email as string}
                  </a>
                </div>
              )}
              {(ct.phone as string) && (
                <div className="flex items-center gap-2.5 text-sm">
                  <div className="w-8 h-8 rounded-[var(--radius-md)] bg-[var(--bg-body)] shadow-[var(--shadow-pressed)] flex items-center justify-center shrink-0">
                    <Phone className="h-4 w-4 text-[var(--text-muted)]" />
                  </div>
                  <span className="text-[var(--text-primary)]">{ct.phone as string}</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex lg:flex-col gap-2 flex-wrap lg:w-40 shrink-0">
            <NeuButton icon={<Edit3 className="h-4 w-4" />} size="sm" fullWidth onClick={() => setShowEdit(true)}>
              Edit
            </NeuButton>
          </div>
        </div>
      </NeuCard>

      {/* Tabs */}
      <NeuTabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <ContactOnboardingChecklist contact={ct} kycRecords={data?.kycRecords ?? []} />
            <ContactOverviewTab contact={ct} />
          </div>
        )}
        {activeTab === 'kyc' && <ContactKycTab contactId={params.id} />}
        {activeTab === 'ownership' && (
          <ContactOwnershipTab
            contactId={params.id}
            contactType={(ct.contact_type as string) ?? 'individual'}
            ownedBy={data?.ownedBy ?? []}
            ownsEntities={data?.ownsEntities ?? []}
            ownedAssets={data?.ownedAssets ?? []}
          />
        )}
        {activeTab === 'comms' && <ContactCommsTab contactId={params.id} />}
      </div>

      {showEdit && (
        <EditContactModal
          open={showEdit}
          onClose={() => setShowEdit(false)}
          contact={ct}
          onSuccess={() => utils.contacts.getById.invalidate({ contactId: params.id })}
        />
      )}
    </div>
  )
}
