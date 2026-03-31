'use client'

import { NeuCard } from '@/components/ui'
import { Mail, Phone, MapPin, Globe, Calendar, User, Briefcase } from 'lucide-react'

type Contact = Record<string, unknown>

function formatDate(date: string | null | undefined): string {
  if (!date) return '---'
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: string | null | undefined }) {
  if (!value) return null
  return (
    <div className="flex items-center gap-2.5 text-sm">
      <div className="w-8 h-8 rounded-[var(--radius-md)] bg-[var(--bg-body)] shadow-[var(--shadow-pressed)] flex items-center justify-center shrink-0">
        <Icon className="h-4 w-4 text-[var(--text-muted)]" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">{label}</p>
        <p className="text-[var(--text-primary)] truncate">{value}</p>
      </div>
    </div>
  )
}

export function ContactOverviewTab({ contact }: { contact: Contact }) {
  const isEntity = contact.contact_type === 'entity'

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Contact Details */}
      <NeuCard variant="raised" padding="md">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoRow icon={Mail} label="Email" value={contact.email as string} />
          <InfoRow icon={Phone} label="Phone" value={contact.phone as string} />
          <InfoRow icon={MapPin} label="Address" value={contact.address as string} />
          <InfoRow icon={Globe} label="Website" value={contact.website as string} />
          <InfoRow icon={User} label="Title" value={contact.title as string} />
          <InfoRow icon={Briefcase} label="Entity" value={contact.entity as string} />
        </div>
      </NeuCard>

      {/* Entity-specific or Individual-specific */}
      <NeuCard variant="raised" padding="md">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
          {isEntity ? 'Entity Details' : 'Personal Details'}
        </h3>
        <dl className="space-y-3 text-sm">
          {isEntity ? (
            <>
              <DetailRow label="Entity Name" value={contact.entity_name as string} />
              <DetailRow label="Entity Type" value={contact.entity_type as string} />
              <DetailRow label="State of Formation" value={contact.state_of_formation as string} />
              <DetailRow label="EIN" value={contact.ein as string} />
            </>
          ) : (
            <>
              <DetailRow label="Date of Birth" value={formatDate(contact.date_of_birth as string)} />
              <DetailRow label="Citizenship" value={contact.citizenship as string} />
            </>
          )}
          <DetailRow label="Source" value={contact.source as string} />
        </dl>
      </NeuCard>

      {/* Timeline */}
      <NeuCard variant="raised" padding="md">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Timeline</h3>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <dt className="text-[var(--text-muted)] flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" /> Created
            </dt>
            <dd className="text-[var(--text-primary)]">{formatDate(contact.created_at as string)}</dd>
          </div>
          <div className="flex justify-between items-center">
            <dt className="text-[var(--text-muted)] flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" /> Updated
            </dt>
            <dd className="text-[var(--text-primary)]">{formatDate(contact.updated_at as string)}</dd>
          </div>
        </dl>
      </NeuCard>

      {/* Notes */}
      <NeuCard variant="raised" padding="md">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Notes</h3>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">
          {(contact.notes as string) || 'No notes recorded.'}
        </p>
      </NeuCard>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="flex justify-between items-center">
      <dt className="text-[var(--text-muted)]">{label}</dt>
      <dd className="text-[var(--text-primary)]">{value || '---'}</dd>
    </div>
  )
}
