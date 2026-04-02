'use client'

import { useState } from 'react'
import Link from 'next/link'
import { trpc } from '@/lib/trpc'
import { cn } from '@/lib/utils'
import { NeuCard, NeuBadge, NeuButton, NeuTabs, NeuInput, NeuModal, NeuSelect } from '@/components/ui'
import { Plus, Search, Users, User, Building2, Mail, Download, ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react'
import { exportCSV } from '@/lib/csv-export'
import { useMemo } from 'react'

type ContactSortKey = 'full_name' | 'kyc_status' | 'contact_type'
import { ComplianceBadge } from '@/components/crm/ComplianceBadge'
import { ListPageSkeleton } from '@/components/crm/skeletons'

// ── KYC badge color map ──────────────────────────────────
const KYC_COLOR: Record<string, 'gray' | 'amber' | 'teal' | 'chartreuse' | 'ruby'> = {
  not_started: 'gray',
  pending: 'amber',
  in_review: 'teal',
  verified: 'chartreuse',
  rejected: 'ruby',
  expired: 'ruby',
}

function formatKyc(s: string): string {
  return s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

// ═══════════════════════════════════════════════════════════
export default function ContactsListPage() {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [kycFilter, setKycFilter] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [sortKey, setSortKey] = useState<ContactSortKey>('full_name')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const contactType = filter === 'all' ? undefined : (filter as 'individual' | 'entity')
  const { data: rawContacts = [], isLoading } = trpc.contacts.list.useQuery({
    contactType,
    search: search || undefined,
    kycStatus: kycFilter || undefined,
  })
  const contacts = useMemo(() => [...rawContacts].sort((a, b) => {
    const av = (a as Record<string, unknown>)[sortKey] as string | null
    const bv = (b as Record<string, unknown>)[sortKey] as string | null
    const cmp = av == null ? 1 : bv == null ? -1 : String(av).localeCompare(String(bv))
    return sortDir === 'asc' ? cmp : -cmp
  }), [rawContacts, sortKey, sortDir])

  const toggleSort = (key: ContactSortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }
  const SortIcon = ({ col }: { col: ContactSortKey }) => sortKey !== col
    ? <ArrowUpDown className="h-3 w-3 ml-1 opacity-40" />
    : sortDir === 'asc' ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />

  // ── Create contact ──────────────────────────────────────
  const [newName, setNewName] = useState('')
  const [newType, setNewType] = useState<'individual' | 'entity'>('individual')
  const [newEmail, setNewEmail] = useState('')
  const [newRole, setNewRole] = useState('')
  const [emailError, setEmailError] = useState('')
  const utils = trpc.useUtils()
  const createMut = trpc.contacts.create.useMutation({
    onSuccess: () => {
      utils.contacts.list.invalidate()
      setShowAdd(false)
      setNewName('')
      setNewEmail('')
      setNewRole('')
      setEmailError('')
    },
  })

  const validateEmail = (val: string) => {
    if (val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      setEmailError('Please enter a valid email address')
    } else {
      setEmailError('')
    }
  }

  const hasCreateErrors = !!emailError

  const TABS = [
    { id: 'all', label: 'All', count: undefined },
    { id: 'individual', label: 'Individuals', icon: <User className="h-3.5 w-3.5" /> },
    { id: 'entity', label: 'Entities', icon: <Building2 className="h-3.5 w-3.5" /> },
  ]

  return (
    <div className="space-y-4 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1
            className="text-2xl font-semibold text-[var(--text-primary)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Contacts
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">
            {contacts.length} contact{contacts.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <NeuButton variant="ghost" icon={<Download className="h-4 w-4" />} size="sm"
            onClick={() => exportCSV('contacts.csv', [
              { key: 'full_name', label: 'Name' }, { key: 'contact_type', label: 'Type' },
              { key: 'email', label: 'Email' }, { key: 'kyc_status', label: 'KYC' },
            ], contacts as Record<string, unknown>[])}>
            <span className="hidden sm:inline">CSV</span>
          </NeuButton>
          <NeuButton icon={<Plus className="h-4 w-4" />} size="sm" onClick={() => setShowAdd(true)}>
            Add Contact
          </NeuButton>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-end">
        <NeuTabs tabs={TABS} activeTab={filter} onTabChange={setFilter} size="sm" />
        <div className="flex-1 max-w-xs">
          <NeuInput placeholder="Search contacts..." icon={<Search className="h-4 w-4" />}
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="w-full sm:w-44">
          <NeuSelect value={kycFilter} onChange={(e) => setKycFilter(e.target.value)}
            options={[
              { value: '', label: 'All Compliance' },
              { value: 'not_started', label: '🔴 Not Started' },
              { value: 'pending', label: '🟡 Pending' },
              { value: 'verified', label: '🟢 Verified' },
              { value: 'expired', label: '🔴 Expired' },
            ]} />
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <ListPageSkeleton />
      ) : contacts.length === 0 ? (
        <NeuCard variant="pressed" padding="lg" className="text-center">
          <Users className="h-10 w-10 text-[var(--text-placeholder)] mx-auto mb-3" />
          <p className="text-sm text-[var(--text-muted)]">No contacts yet</p>
          <p className="text-xs text-[var(--text-placeholder)] mt-1">
            Add your first contact to get started
          </p>
        </NeuCard>
      ) : (
        <NeuCard variant="raised" padding="none" className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                {([
                  { key: 'full_name' as ContactSortKey, label: 'Name' },
                  { key: 'contact_type' as ContactSortKey, label: 'Type' },
                  { key: null, label: 'Email' },
                  { key: null, label: 'Role' },
                  { key: 'kyc_status' as ContactSortKey, label: 'KYC Status' },
                ]).map(({ key, label }) => (
                  <th key={label} onClick={key ? () => toggleSort(key) : undefined}
                    className={`text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] ${key ? 'cursor-pointer hover:text-[var(--text-secondary)] select-none' : ''}`}>
                    <span className="inline-flex items-center">
                      {label}{key && <SortIcon col={key} />}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {contacts.map((c: Record<string, unknown>) => {
                const kyc = (c.kyc_status as string) ?? 'not_started'
                return (
                  <tr
                    key={c.id as string}
                    className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-elevated)] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/crm/contacts/${c.id}`}
                        className="font-medium text-[var(--text-primary)] hover:text-[var(--teal)]"
                      >
                        {(c.full_name as string) || (c.entity_name as string) || '---'}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <NeuBadge color={c.contact_type === 'entity' ? 'sapphire' : 'amethyst'} size="sm">
                        {c.contact_type === 'entity' ? 'Entity' : 'Individual'}
                      </NeuBadge>
                    </td>
                    <td className="px-4 py-3 text-[var(--text-secondary)]">
                      {(c.email as string) ? (
                        <a href={`mailto:${c.email}`} onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1 text-[var(--text-secondary)] hover:text-[var(--teal)] transition-colors group">
                          <Mail className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 shrink-0 transition-opacity" />
                          {c.email as string}
                        </a>
                      ) : '---'}
                    </td>
                    <td className="px-4 py-3 text-[var(--text-secondary)] capitalize">
                      {((c.role as string) ?? '---').replace(/_/g, ' ')}
                    </td>
                    <td className="px-4 py-3">
                      <ComplianceBadge kycStatus={kyc} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </NeuCard>
      )}

      {/* Add Contact Modal */}
      <NeuModal open={showAdd} onClose={() => setShowAdd(false)} title="Add Contact">
        <div className="space-y-4">
          <NeuInput label="Full Name *" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="John Smith" />
          <NeuSelect
            label="Type *"
            value={newType}
            onChange={(e) => setNewType(e.target.value as 'individual' | 'entity')}
            options={[
              { value: 'individual', label: 'Individual' },
              { value: 'entity', label: 'Entity' },
            ]}
          />
          <NeuInput
            label="Email"
            type="email"
            value={newEmail}
            onChange={(e) => { setNewEmail(e.target.value); validateEmail(e.target.value) }}
            onBlur={() => validateEmail(newEmail)}
            placeholder="john@example.com"
            error={emailError || undefined}
          />
          <NeuInput label="Role" value={newRole} onChange={(e) => setNewRole(e.target.value)} placeholder="e.g. owner, investor, advisor" />
          <div className="flex justify-end gap-2 pt-2">
            <NeuButton variant="ghost" onClick={() => setShowAdd(false)}>Cancel</NeuButton>
            <NeuButton
              loading={createMut.isPending}
              disabled={!newName.trim() || hasCreateErrors}
              onClick={() => createMut.mutate({
                fullName: newName.trim(),
                contactType: newType,
                email: newEmail || undefined,
                role: newRole || undefined,
              })}
            >
              Create
            </NeuButton>
          </div>
        </div>
      </NeuModal>
    </div>
  )
}
