'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Handshake, Plus } from 'lucide-react'
import { trpc } from '@/lib/trpc'
import { NeuCard } from '@/components/ui/NeuCard'
import { NeuAvatar } from '@/components/ui/NeuAvatar'
import { NeuBadge } from '@/components/ui/NeuBadge'
import { NeuButton } from '@/components/ui/NeuButton'
import { NeuModal } from '@/components/ui/NeuModal'
import { NeuInput } from '@/components/ui/NeuInput'
import { NeuSelect } from '@/components/ui/NeuSelect'

// ── Types ─────────────────────────────────────────────────
interface PartnersTabProps {
  partners: Array<Record<string, unknown>>
  assetId: string
}

// ── Component ─────────────────────────────────────────────
export function PartnersTab({ partners, assetId }: PartnersTabProps) {
  const [showAdd, setShowAdd] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">
          Partners ({partners.length})
        </h3>
        <NeuButton icon={<Plus className="h-4 w-4" />} size="sm" onClick={() => setShowAdd(true)}>
          Add Partner
        </NeuButton>
      </div>

      {partners.length === 0 ? (
        <NeuCard variant="pressed" padding="lg" className="text-center">
          <Handshake className="h-10 w-10 text-[var(--text-placeholder)] mx-auto mb-3" />
          <p className="text-sm text-[var(--text-muted)]">No partners assigned yet.</p>
        </NeuCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {partners.map((ap) => {
            const partner = ap.partners as Record<string, unknown> | null
            const partnerId = partner?.id as string | null
            return (
              <Link key={ap.id as string} href={partnerId ? `/crm/partners/${partnerId}` : '#'}>
                <NeuCard variant="raised" padding="md" hoverable>
                  <div className="flex items-center gap-3">
                    <NeuAvatar name={(partner?.name as string) ?? 'Partner'} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[var(--text-primary)]">
                        {(partner?.name as string) ?? 'Unknown'}
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">
                        {(ap.role_on_asset as string) ?? 'Partner'}
                      </p>
                    </div>
                    {Boolean(ap.role_on_asset) && (
                      <NeuBadge color="gray" size="sm">{String(ap.role_on_asset)}</NeuBadge>
                    )}
                  </div>
                </NeuCard>
              </Link>
            )
          })}
        </div>
      )}

      <AddPartnerModal open={showAdd} onClose={() => setShowAdd(false)} assetId={assetId} />
    </div>
  )
}

// ── Add Partner Modal ─────────────────────────────────────
function AddPartnerModal({ open, onClose, assetId }: { open: boolean; onClose: () => void; assetId: string }) {
  const [partnerId, setPartnerId] = useState('')
  const [role, setRole] = useState('')
  const utils = trpc.useUtils()

  const { data: allPartners = [] } = trpc.partners.list.useQuery(undefined, { enabled: open })

  const mutation = trpc.partners.linkToAsset.useMutation({
    onSuccess: () => {
      utils.assets.getById.invalidate({ assetId })
      setPartnerId('')
      setRole('')
      onClose()
    },
  })

  const handleSubmit = () => {
    if (!partnerId) return
    mutation.mutate({ partnerId, assetId, roleOnAsset: role.trim() || undefined })
  }

  return (
    <NeuModal open={open} onClose={onClose} title="Add Partner to Asset" maxWidth="sm">
      <div className="space-y-3">
        <NeuSelect
          label="Partner *"
          value={partnerId}
          onChange={(e) => setPartnerId(e.target.value)}
          placeholder="Select partner..."
          options={(allPartners as { id: string; name: string }[]).map((p) => ({
            value: p.id,
            label: p.name,
          }))}
        />
        <NeuInput
          label="Role on Asset"
          placeholder="e.g. Appraiser, Custodian, Legal..."
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
      </div>
      <div className="flex gap-3 pt-4">
        <NeuButton variant="ghost" onClick={onClose} fullWidth>Cancel</NeuButton>
        <NeuButton
          onClick={handleSubmit}
          loading={mutation.isPending}
          disabled={!partnerId}
          fullWidth
        >
          Link Partner
        </NeuButton>
      </div>
      {mutation.error && (
        <p className="text-sm text-[var(--ruby)] mt-2">{mutation.error.message}</p>
      )}
    </NeuModal>
  )
}
