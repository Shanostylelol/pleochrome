'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Handshake, Plus, Mail, Phone, ExternalLink, X } from 'lucide-react'
import { NeuCard, NeuBadge, NeuButton, NeuAvatar, NeuInput, NeuTextarea, NeuSelect } from '@/components/ui'
import { trpc } from '@/lib/trpc'

const ddColorMap: Record<string, 'gray' | 'amber' | 'chartreuse' | 'ruby'> = {
  not_started: 'gray', in_progress: 'amber', passed: 'chartreuse', failed: 'ruby',
}

export default function PartnersPage() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const { data: partners = [], isLoading } = trpc.partners.list.useQuery()

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
            Partners
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">{partners.length} partners</p>
        </div>
        <NeuButton icon={<Plus className="h-4 w-4" />} onClick={() => setShowCreateModal(true)}>
          <span className="hidden sm:inline">Add Partner</span>
        </NeuButton>
      </div>

      {isLoading ? (
        <p className="text-[var(--text-muted)] text-center py-10">Loading partners...</p>
      ) : partners.length === 0 ? (
        <NeuCard variant="pressed" padding="lg" className="text-center">
          <Handshake className="h-12 w-12 text-[var(--text-placeholder)] mx-auto mb-3" />
          <p className="text-sm text-[var(--text-muted)]">No partners yet</p>
        </NeuCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {partners.map((p) => (
            <Link key={p.id} href={`/crm/partners/${p.id}`}>
              <NeuCard variant="raised" padding="md" hoverable>
                <div className="flex items-center gap-3 mb-3">
                  <NeuAvatar name={p.name} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{p.name}</p>
                    <NeuBadge color="amethyst" size="sm">{p.type}</NeuBadge>
                  </div>
                </div>
                <div className="space-y-1.5 text-xs text-[var(--text-secondary)]">
                  {p.contact_name && <p>{p.contact_name}</p>}
                  {p.contact_email && (
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />{p.contact_email}
                    </span>
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
          ))}
        </div>
      )}
      {showCreateModal && <PartnerCreateModal onClose={() => setShowCreateModal(false)} />}
    </div>
  )
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

function PartnerCreateModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('')
  const [partnerType, setPartnerType] = useState('appraiser')
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [website, setWebsite] = useState('')
  const [description, setDescription] = useState('')
  const utils = trpc.useUtils()

  const mutation = trpc.partners.create.useMutation({
    onSuccess: () => {
      utils.partners.list.invalidate()
      onClose()
    },
  })

  const handleSubmit = () => {
    mutation.mutate({
      name,
      partnerType,
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
          <NeuInput
            label="Name"
            placeholder="Partner name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <NeuSelect
            label="Type"
            value={partnerType}
            onChange={(e) => setPartnerType(e.target.value)}
          >
            {PARTNER_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </NeuSelect>
          <NeuInput
            label="Contact Name"
            placeholder="Contact person"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
          />
          <NeuInput
            label="Contact Email"
            type="email"
            placeholder="email@example.com"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
          />
          <NeuInput
            label="Contact Phone"
            placeholder="+1 (555) 000-0000"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
          />
          <NeuInput
            label="Website"
            placeholder="https://example.com"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
          <NeuTextarea
            label="Description"
            placeholder="Optional notes about this partner"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <NeuButton variant="ghost" onClick={onClose} fullWidth>Cancel</NeuButton>
          <NeuButton onClick={handleSubmit} loading={mutation.isPending} disabled={!name.trim()} fullWidth>Add Partner</NeuButton>
        </div>
        {mutation.error && <p className="text-sm text-[var(--ruby)]">{mutation.error.message}</p>}
      </NeuCard>
    </div>
  )
}
