'use client'

import { Handshake, Plus, Mail, Phone, ExternalLink } from 'lucide-react'
import { NeuCard, NeuBadge, NeuButton, NeuAvatar } from '@/components/ui'
import { trpc } from '@/lib/trpc'

const ddColorMap: Record<string, 'gray' | 'amber' | 'chartreuse' | 'ruby'> = {
  not_started: 'gray', in_progress: 'amber', passed: 'chartreuse', failed: 'ruby',
}

export default function PartnersPage() {
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
        <NeuButton icon={<Plus className="h-4 w-4" />}>
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
            <NeuCard key={p.id} variant="raised" padding="md" hoverable>
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
                  <a href={`mailto:${p.contact_email}`} className="flex items-center gap-1 hover:text-[var(--teal)]">
                    <Mail className="h-3 w-3" />{p.contact_email}
                  </a>
                )}
                {p.contact_phone && (
                  <p className="flex items-center gap-1"><Phone className="h-3 w-3" />{p.contact_phone}</p>
                )}
                {p.website && (
                  <a href={p.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-[var(--teal)]">
                    <ExternalLink className="h-3 w-3" />{p.website}
                  </a>
                )}
              </div>
              <div className="mt-3 pt-2 border-t border-[var(--border)]">
                <NeuBadge color={ddColorMap[p.dd_status] ?? 'gray'} size="sm">DD: {p.dd_status}</NeuBadge>
              </div>
            </NeuCard>
          ))}
        </div>
      )}
    </div>
  )
}
