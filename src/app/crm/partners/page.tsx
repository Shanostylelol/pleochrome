'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Handshake, Plus, Mail, Phone, X, LayoutGrid, List, Download } from 'lucide-react'
import { NeuCard, NeuBadge, NeuButton, NeuAvatar, NeuInput, NeuTextarea, NeuSelect } from '@/components/ui'
import { ListPageSkeleton } from '@/components/crm/skeletons'
import { trpc } from '@/lib/trpc'
import { exportCSV } from '@/lib/csv-export'

const ddColorMap: Record<string, 'gray' | 'amber' | 'chartreuse' | 'ruby'> = {
  not_started: 'gray', in_progress: 'amber', passed: 'chartreuse', failed: 'ruby',
}

const PARTNER_TYPES = [
  { value: 'appraiser', label: 'Appraiser' },
  { value: 'vault_custodian', label: 'Vault Custodian' },
  { value: 'broker_dealer', label: 'Broker Dealer' },
  { value: 'securities_counsel', label: 'Securities Counsel' },
  { value: 'general_counsel', label: 'General Counsel' },
  { value: 'transfer_agent', label: 'Transfer Agent' },
  { value: 'insurance_provider', label: 'Insurance Provider' },
  { value: 'gemological_lab', label: 'Gemological Lab' },
  { value: 'blockchain_platform', label: 'Blockchain Platform' },
  { value: 'oracle_provider', label: 'Oracle Provider' },
  { value: 'marketing_agency', label: 'Marketing Agency' },
  { value: 'compliance_consultant', label: 'Compliance Consultant' },
  { value: 'auditor', label: 'Auditor' },
  { value: 'tax_advisor', label: 'Tax Advisor' },
  { value: 'other', label: 'Other' },
]

const TYPE_LABEL_MAP: Record<string, string> = Object.fromEntries(PARTNER_TYPES.map((t) => [t.value, t.label]))

const DD_STATUS_OPTS = [
  { value: '', label: 'All DD Status' },
  { value: 'not_started', label: 'Not Started' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'passed', label: 'Passed' },
  { value: 'failed', label: 'Failed' },
]

export default function PartnersPage() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [typeFilter, setTypeFilter] = useState('')
  const [ddFilter, setDdFilter] = useState('')
  const [search, setSearch] = useState('')
  const { data: rawPartners = [], isLoading } = trpc.partners.list.useQuery(
    { partnerType: typeFilter || undefined, search: search || undefined }
  )
  const partners = ddFilter ? rawPartners.filter((p) => p.dd_status === ddFilter) : rawPartners

  // Group by type for list view
  const grouped = partners.reduce<Record<string, typeof partners>>((acc, p) => {
    const key = p.type ?? 'other'
    ;(acc[key] ??= []).push(p)
    return acc
  }, {})

  const sortedGroups = Object.entries(grouped).sort(([a], [b]) =>
    (TYPE_LABEL_MAP[a] ?? a).localeCompare(TYPE_LABEL_MAP[b] ?? b)
  )

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
            Partners
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">{partners.length} partners</p>
        </div>
        <div className="flex items-center gap-2">
          <NeuButton variant="ghost" icon={<Download className="h-4 w-4" />} size="sm"
            onClick={() => exportCSV('partners.csv', [
              { key: 'name', label: 'Name' }, { key: 'type', label: 'Type' },
              { key: 'dd_status', label: 'DD Status' }, { key: 'email', label: 'Email' },
            ], partners as Record<string, unknown>[])}>
            <span className="hidden sm:inline">CSV</span>
          </NeuButton>
          <NeuButton icon={<Plus className="h-4 w-4" />} onClick={() => setShowCreateModal(true)}>
            <span className="hidden sm:inline">Add Partner</span>
          </NeuButton>
        </div>
      </div>

      {/* Filters + view toggle */}
      <div className="flex flex-wrap items-center gap-3">
        <NeuInput
          placeholder="Search partners..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="!w-48 sm:!w-64"
        />
        <NeuSelect
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="!w-44"
        >
          <option value="">All Types</option>
          {PARTNER_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </NeuSelect>
        <NeuSelect
          value={ddFilter}
          onChange={(e) => setDdFilter(e.target.value)}
          className="!w-40"
        >
          {DD_STATUS_OPTS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </NeuSelect>
        <div className="ml-auto flex gap-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-[var(--radius-sm)] transition-colors ${
              viewMode === 'grid' ? 'bg-[var(--bg-surface)] shadow-[var(--shadow-raised-sm)] text-[var(--text-primary)]' : 'text-[var(--text-muted)]'
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-[var(--radius-sm)] transition-colors ${
              viewMode === 'list' ? 'bg-[var(--bg-surface)] shadow-[var(--shadow-raised-sm)] text-[var(--text-primary)]' : 'text-[var(--text-muted)]'
            }`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {isLoading ? (
        <ListPageSkeleton />
      ) : partners.length === 0 ? (
        <NeuCard variant="pressed" padding="lg" className="text-center">
          <Handshake className="h-12 w-12 text-[var(--text-placeholder)] mx-auto mb-3" />
          <p className="text-sm text-[var(--text-muted)]">{search || typeFilter ? 'No partners match your filters' : 'No partners yet'}</p>
        </NeuCard>
      ) : viewMode === 'grid' ? (
        /* ── Grid View (grouped by type) ── */
        <div className="space-y-6">
          {sortedGroups.map(([type, items]) => (
            <div key={type}>
              <div className="flex items-center gap-2 mb-3">
                <NeuBadge color="amethyst" size="sm">{TYPE_LABEL_MAP[type] ?? type}</NeuBadge>
                <span className="text-xs text-[var(--text-muted)]">{items.length}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((p) => <PartnerCard key={p.id} partner={p} />)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ── List View (grouped by type) ── */
        <div className="space-y-4">
          {sortedGroups.map(([type, items]) => (
            <div key={type}>
              <div className="flex items-center gap-2 mb-2 px-1">
                <NeuBadge color="amethyst" size="sm">{TYPE_LABEL_MAP[type] ?? type}</NeuBadge>
                <span className="text-xs text-[var(--text-muted)]">{items.length}</span>
              </div>
              <NeuCard variant="raised" padding="none" className="overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text-muted)] text-xs uppercase tracking-wider">
                      <th className="px-4 py-2 text-left font-semibold">Name</th>
                      <th className="px-4 py-2 text-left font-semibold hidden sm:table-cell">Contact</th>
                      <th className="px-4 py-2 text-left font-semibold hidden md:table-cell">Email</th>
                      <th className="px-4 py-2 text-left font-semibold hidden lg:table-cell">Phone</th>
                      <th className="px-4 py-2 text-left font-semibold">DD Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((p) => (
                      <tr key={p.id} className="border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--bg-elevated)] transition-colors">
                        <td className="px-4 py-3">
                          <Link href={`/crm/partners/${p.id}`} className="flex items-center gap-2">
                            <NeuAvatar name={p.name} size="sm" />
                            <span className="font-medium text-[var(--text-primary)] hover:text-[var(--teal)] transition-colors">{p.name}</span>
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-[var(--text-secondary)] hidden sm:table-cell">{p.contact_name ?? '—'}</td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          {p.contact_email ? (
                            <a href={`mailto:${p.contact_email}`} onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-1 text-[var(--text-secondary)] hover:text-[var(--teal)] transition-colors group text-sm">
                              <Mail className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 shrink-0" />
                              {p.contact_email}
                            </a>
                          ) : '—'}
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          {p.contact_phone ? (
                            <a href={`tel:${p.contact_phone}`} onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-1 text-[var(--text-secondary)] hover:text-[var(--teal)] transition-colors group text-sm">
                              <Phone className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 shrink-0" />
                              {p.contact_phone}
                            </a>
                          ) : '—'}
                        </td>
                        <td className="px-4 py-3">
                          <NeuBadge color={ddColorMap[p.dd_status] ?? 'gray'} size="sm">{p.dd_status}</NeuBadge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </NeuCard>
            </div>
          ))}
        </div>
      )}
      {showCreateModal && <PartnerCreateModal onClose={() => setShowCreateModal(false)} />}
    </div>
  )
}

function PartnerCard({ partner: p }: { partner: { id: string; name: string; type: string; contact_name: string | null; contact_email: string | null; contact_phone: string | null; dd_status: string } }) {
  return (
    <Link href={`/crm/partners/${p.id}`}>
      <NeuCard variant="raised" padding="md" hoverable>
        <div className="flex items-center gap-3 mb-3">
          <NeuAvatar name={p.name} />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{p.name}</p>
          </div>
        </div>
        <div className="space-y-1.5 text-xs text-[var(--text-secondary)]">
          {p.contact_name && <p>{p.contact_name}</p>}
          {p.contact_email && (
            <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{p.contact_email}</span>
          )}
          {p.contact_phone && (
            <p className="flex items-center gap-1"><Phone className="h-3 w-3" />{p.contact_phone}</p>
          )}
        </div>
        <div className="mt-3 pt-2 border-t border-[var(--border)]">
          <NeuBadge color={ddColorMap[p.dd_status] ?? 'gray'} size="sm">DD: {p.dd_status}</NeuBadge>
        </div>
      </NeuCard>
    </Link>
  )
}

function PartnerCreateModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('')
  const [partnerType, setPartnerType] = useState('appraiser')
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [website, setWebsite] = useState('')
  const [description, setDescription] = useState('')
  const [emailError, setEmailError] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [websiteError, setWebsiteError] = useState('')
  const utils = trpc.useUtils()

  const validateEmail = (val: string) => {
    if (val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      setEmailError('Please enter a valid email address')
    } else { setEmailError('') }
  }
  const validatePhone = (val: string) => {
    if (val && !/^\+?[\d\s\-().]{7,20}$/.test(val)) {
      setPhoneError('Please enter a valid phone number')
    } else { setPhoneError('') }
  }
  const validateWebsite = (val: string) => {
    if (val && !/^https?:\/\/.+/.test(val)) {
      setWebsiteError('URL must start with http:// or https://')
    } else { setWebsiteError('') }
  }

  const hasErrors = !!emailError || !!phoneError || !!websiteError

  const mutation = trpc.partners.create.useMutation({
    onSuccess: () => { utils.partners.list.invalidate(); onClose() },
  })

  const handleSubmit = () => {
    if (hasErrors) return
    mutation.mutate({
      name, partnerType,
      contactName: contactName || undefined,
      contactEmail: contactEmail || undefined,
      contactPhone: contactPhone || undefined,
      website: website || undefined,
      description: description || undefined,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[var(--overlay)]" onClick={onClose} />
      <NeuCard variant="raised" padding="lg" className="relative w-full max-w-md z-10 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>Add Partner</h2>
          <button onClick={onClose} className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)]"><X className="h-5 w-5" /></button>
        </div>
        <div className="space-y-3">
          <NeuInput label="Name *" placeholder="Partner name" value={name} onChange={(e) => setName(e.target.value)} required />
          <NeuSelect label="Type" value={partnerType} onChange={(e) => setPartnerType(e.target.value)}>
            {PARTNER_TYPES.map((t) => (<option key={t.value} value={t.value}>{t.label}</option>))}
          </NeuSelect>
          <NeuInput label="Contact Name" placeholder="Contact person" value={contactName} onChange={(e) => setContactName(e.target.value)} />
          <NeuInput label="Contact Email" type="email" placeholder="email@example.com" value={contactEmail}
            onChange={(e) => { setContactEmail(e.target.value); validateEmail(e.target.value) }}
            onBlur={() => validateEmail(contactEmail)} error={emailError || undefined} />
          <NeuInput label="Contact Phone" placeholder="+1 (555) 000-0000" value={contactPhone}
            onChange={(e) => { setContactPhone(e.target.value); validatePhone(e.target.value) }}
            onBlur={() => validatePhone(contactPhone)} error={phoneError || undefined} />
          <NeuInput label="Website" placeholder="https://example.com" value={website}
            onChange={(e) => { setWebsite(e.target.value); validateWebsite(e.target.value) }}
            onBlur={() => validateWebsite(website)} error={websiteError || undefined} />
          <NeuTextarea label="Description" placeholder="Optional notes about this partner" value={description}
            onChange={(e) => setDescription(e.target.value)} rows={3} />
        </div>
        <div className="flex gap-3 pt-2">
          <NeuButton variant="ghost" onClick={onClose} fullWidth>Cancel</NeuButton>
          <NeuButton onClick={handleSubmit} loading={mutation.isPending} disabled={!name.trim() || hasErrors} fullWidth>Add Partner</NeuButton>
        </div>
        {mutation.error && <p className="text-sm text-[var(--ruby)]">{mutation.error.message}</p>}
      </NeuCard>
    </div>
  )
}
