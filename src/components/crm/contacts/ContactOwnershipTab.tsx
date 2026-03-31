'use client'

import { useState } from 'react'
import Link from 'next/link'
import { NeuCard, NeuBadge, NeuProgress, NeuButton } from '@/components/ui'
import { Building2, User, Gem, Plus } from 'lucide-react'
import { LinkAssetModal } from './LinkAssetModal'
import { AddBeneficialOwnerModal } from './AddBeneficialOwnerModal'

type OwnerLink = Record<string, unknown>
type OwnedAsset = Record<string, unknown>

interface Props {
  contactId: string
  contactType: string
  ownedBy: OwnerLink[]
  ownsEntities: OwnerLink[]
  ownedAssets: OwnedAsset[]
}

export function ContactOwnershipTab({ contactId, contactType, ownedBy, ownsEntities, ownedAssets }: Props) {
  const isEntity = contactType === 'entity'
  const [showLink, setShowLink] = useState(false)
  const [showAddOwner, setShowAddOwner] = useState(false)

  return (
    <div className="space-y-4">
      {/* If entity -- show beneficial owners */}
      {isEntity && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">
              Beneficial Owners ({ownedBy.length})
            </h3>
            <NeuButton icon={<Plus className="h-4 w-4" />} size="sm" onClick={() => setShowAddOwner(true)}>
              Add Beneficial Owner
            </NeuButton>
          </div>
          {ownedBy.length === 0 ? (
            <NeuCard variant="pressed" padding="lg" className="text-center">
              <User className="h-10 w-10 text-[var(--text-placeholder)] mx-auto mb-3" />
              <p className="text-sm text-[var(--text-muted)]">No beneficial owners recorded</p>
            </NeuCard>
          ) : (
            ownedBy.map((link) => {
              const child = link.contacts as Record<string, unknown> | null
              const pct = (link.ownership_percentage as number) ?? 0
              return (
                <NeuCard key={link.id as string} variant="raised" padding="md">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-[var(--bg-body)] shadow-[var(--shadow-pressed)] flex items-center justify-center shrink-0">
                        {child?.contact_type === 'entity' ? (
                          <Building2 className="h-4 w-4 text-[var(--text-muted)]" />
                        ) : (
                          <User className="h-4 w-4 text-[var(--text-muted)]" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/crm/contacts/${child?.id ?? ''}`}
                          className="font-medium text-sm text-[var(--text-primary)] hover:text-[var(--teal)]"
                        >
                          {(child?.full_name as string) ?? '---'}
                        </Link>
                        <div className="flex gap-1.5 mt-0.5">
                          <NeuBadge
                            color={child?.contact_type === 'entity' ? 'sapphire' : 'amethyst'}
                            size="sm"
                          >
                            {child?.contact_type === 'entity' ? 'Entity' : 'Individual'}
                          </NeuBadge>
                          {(link.is_control_person as boolean) && (
                            <NeuBadge color="amber" size="sm">Control Person</NeuBadge>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-[var(--text-primary)] tabular-nums shrink-0">
                      {pct}%
                    </span>
                  </div>
                  <NeuProgress value={pct} color={pct >= 25 ? 'teal' : 'amber'} showLabel={false} />
                </NeuCard>
              )
            })
          )}
        </div>
      )}

      {/* If individual -- show entities they own */}
      {!isEntity && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">
            Entities Owned ({ownsEntities.length})
          </h3>
          {ownsEntities.length === 0 ? (
            <NeuCard variant="pressed" padding="lg" className="text-center">
              <Building2 className="h-10 w-10 text-[var(--text-placeholder)] mx-auto mb-3" />
              <p className="text-sm text-[var(--text-muted)]">Not linked to any entities</p>
            </NeuCard>
          ) : (
            ownsEntities.map((link) => {
              const parent = link.contacts as Record<string, unknown> | null
              const pct = (link.ownership_percentage as number) ?? 0
              return (
                <NeuCard key={link.id as string} variant="raised" padding="md">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <Link
                      href={`/crm/contacts/${parent?.id ?? ''}`}
                      className="font-medium text-sm text-[var(--text-primary)] hover:text-[var(--teal)]"
                    >
                      {(parent?.full_name as string) ?? '---'}
                    </Link>
                    <span className="text-sm font-semibold text-[var(--text-primary)] tabular-nums">
                      {pct}%
                    </span>
                  </div>
                  <NeuProgress value={pct} color="teal" showLabel={false} />
                </NeuCard>
              )
            })
          )}
        </div>
      )}

      {/* Linked Assets */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">
            Linked Assets ({ownedAssets.length})
          </h3>
          <NeuButton icon={<Plus className="h-4 w-4" />} size="sm" onClick={() => setShowLink(true)}>
            Link to Asset
          </NeuButton>
        </div>
        {ownedAssets.length === 0 ? (
          <NeuCard variant="pressed" padding="lg" className="text-center">
            <Gem className="h-10 w-10 text-[var(--text-placeholder)] mx-auto mb-3" />
            <p className="text-sm text-[var(--text-muted)]">No linked assets</p>
          </NeuCard>
        ) : (
          ownedAssets.map((a) => {
            const asset = a.assets as Record<string, unknown> | null
            const statusStr = (asset?.status as string) ?? ''
            return (
              <NeuCard key={a.id as string} variant="raised" padding="md" hoverable>
                <Link href={`/crm/assets/${asset?.id ?? ''}`} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-[var(--text-primary)] truncate">
                      {(asset?.name as string) ?? '---'}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-xs text-[var(--text-muted)]" style={{ fontFamily: 'var(--font-mono)' }}>
                        {(asset?.reference_code as string) ?? ''}
                      </span>
                      <NeuBadge color="gray" size="sm">
                        {((a.role as string) ?? 'holder').replace(/_/g, ' ')}
                      </NeuBadge>
                      {statusStr && (
                        <NeuBadge color={statusStr === 'active' ? 'teal' : 'gray'} size="sm">
                          {statusStr}
                        </NeuBadge>
                      )}
                    </div>
                  </div>
                  {(a.ownership_percentage as number | null) != null && (
                    <span className="text-sm font-semibold text-[var(--text-primary)] tabular-nums shrink-0">
                      {a.ownership_percentage as number}%
                    </span>
                  )}
                </Link>
              </NeuCard>
            )
          })
        )}
      </div>

      <LinkAssetModal open={showLink} onClose={() => setShowLink(false)} contactId={contactId} />
      {isEntity && (
        <AddBeneficialOwnerModal
          open={showAddOwner}
          onClose={() => setShowAddOwner(false)}
          parentContactId={contactId}
        />
      )}
    </div>
  )
}
