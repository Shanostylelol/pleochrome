'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { trpc } from '@/lib/trpc'
import { NeuCard } from '@/components/ui/NeuCard'
import { NeuBadge } from '@/components/ui/NeuBadge'
import { NeuButton } from '@/components/ui/NeuButton'
import { useToast } from '@/components/ui/NeuToast'
import { NeuSkeleton } from '@/components/ui/NeuSkeleton'
import { User, Building2, Plus, Crown } from 'lucide-react'
import { AddOwnerModal } from './AddOwnerModal'
import { ComplianceBadge } from '@/components/crm/ComplianceBadge'
import { RecentCommsWidget } from './RecentCommsWidget'

type BadgeColor = 'emerald' | 'teal' | 'sapphire' | 'amber' | 'chartreuse' | 'ruby' | 'amethyst' | 'gray'
const KYC_COLOR: Record<string, BadgeColor> = {
  verified: 'chartreuse', pending: 'amber', failed: 'ruby', not_started: 'gray', expired: 'ruby',
}

interface OverviewTabProps {
  asset: Record<string, unknown>
  assetId: string
}

// ── Inline editable field ────────────────────────────────
function EditableField({ label, value, onSave, mono, multiline }: {
  label: string; value: string; onSave: (v: string) => void; mono?: boolean; multiline?: boolean
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (editing) {
      if (multiline) textareaRef.current?.focus()
      else inputRef.current?.focus()
    }
  }, [editing, multiline])

  function commit() {
    const trimmed = draft.trim()
    if (trimmed !== value) onSave(trimmed)
    setEditing(false)
  }

  if (multiline) {
    return (
      <div className="space-y-1">
        <dt className="text-[var(--text-muted)]">{label}</dt>
        {editing ? (
          <textarea ref={textareaRef} value={draft} onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => { if (e.key === 'Escape') { setDraft(value); setEditing(false) } }}
            rows={3}
            className="w-full text-sm bg-transparent border border-[var(--teal)] rounded-[var(--radius-sm)] text-[var(--text-primary)] outline-none px-2 py-1 resize-none"
          />
        ) : (
          <dd onClick={() => { setDraft(value); setEditing(true) }}
            className="text-[var(--text-primary)] text-sm cursor-pointer hover:text-[var(--teal)] transition-colors whitespace-pre-wrap"
            title="Click to edit">
            {value || <span className="text-[var(--text-placeholder)] italic">Click to add...</span>}
          </dd>
        )}
      </div>
    )
  }

  return (
    <div className="flex justify-between">
      <dt className="text-[var(--text-muted)]">{label}</dt>
      {editing ? (
        <input ref={inputRef} value={draft} onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') { setDraft(value); setEditing(false) } }}
          className="text-right text-sm bg-transparent border-b border-[var(--teal)] text-[var(--text-primary)] outline-none w-[60%] px-1"
          style={mono ? { fontFamily: 'var(--font-mono)' } : undefined} />
      ) : (
        <dd onClick={() => { setDraft(value); setEditing(true) }}
          className="text-[var(--text-primary)] cursor-pointer hover:text-[var(--teal)] transition-colors"
          style={mono ? { fontFamily: 'var(--font-mono)' } : undefined}
          title="Click to edit">
          {value || '\u2014'}
        </dd>
      )}
    </div>
  )
}

// ── Component ─────────────────────────────────────────────
export function OverviewTab({ asset, assetId }: OverviewTabProps) {
  const meta = (asset.metadata ?? {}) as Record<string, unknown>
  const [showAddOwner, setShowAddOwner] = useState(false)
  const { toast } = useToast()
  const utils = trpc.useUtils()

  const updateAsset = trpc.assets.update.useMutation({
    onSuccess: () => { utils.assets.getById.invalidate({ assetId }); toast('Saved', 'success') },
    onError: (err) => toast(err.message, 'error'),
  })

  function saveField(field: string, value: string) {
    updateAsset.mutate({ assetId, [field]: value || undefined } as never)
  }

  function saveMetaField(field: string, value: string) {
    updateAsset.mutate({ assetId, metadata: { ...meta, [field]: value || undefined } } as never)
  }

  const { data: owners = [], isLoading: ownersLoading } = trpc.ownership.getAssetOwners.useQuery({ assetId })

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Holder Information */}
        <NeuCard variant="raised" padding="md">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Holder Information</h3>
          <dl className="space-y-2 text-sm">
            <EditableField label="Entity" value={(asset.asset_holder_entity as string) ?? ''}
              onSave={(v) => updateAsset.mutate({ assetId, holderEntity: v || undefined } as never)} />
            <EditableField label="Description" value={(asset.description as string) ?? ''}
              onSave={(v) => saveField('description', v)} multiline />
          </dl>
        </NeuCard>

        {/* Certification */}
        <NeuCard variant="raised" padding="md">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Certification</h3>
          <dl className="space-y-2 text-sm">
            <EditableField label="Origin" value={(meta.origin as string) ?? (asset.origin as string) ?? ''}
              onSave={(v) => saveField('origin', v)} />
            <EditableField label="Carat Weight" value={String((meta.carat_weight as number) ?? (asset.carat_weight as number) ?? '')}
              onSave={(v) => saveField('caratWeight', v)} />
            <EditableField label="GIA Report" value={(meta.gia_report_number as string) ?? ''} mono
              onSave={(v) => saveMetaField('gia_report_number', v)} />
          </dl>
        </NeuCard>

        {/* Custody */}
        <NeuCard variant="raised" padding="md">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Custody</h3>
          <dl className="space-y-2 text-sm">
            <EditableField label="Vault Provider" value={(meta.vault_provider as string) ?? ''}
              onSave={(v) => saveMetaField('vault_provider', v)} />
            <EditableField label="PoR Status" value={(meta.por_status as string) ?? ''}
              onSave={(v) => saveMetaField('por_status', v)} />
          </dl>
        </NeuCard>

        {/* Legal */}
        <NeuCard variant="raised" padding="md">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Legal</h3>
          <dl className="space-y-2 text-sm">
            <EditableField label="SPV Name" value={(asset.spv_name as string) ?? ''}
              onSave={(v) => saveField('spvName', v)} />
            <EditableField label="SPV EIN" value={(asset.spv_ein as string) ?? ''} mono
              onSave={(v) => saveField('spvEin', v)} />
            <EditableField label="Insurance Provider" value={(meta.insurance_provider as string) ?? ''}
              onSave={(v) => saveMetaField('insurance_provider', v)} />
            <EditableField label="Insurance Value" value={(meta.insurance_value as string) ?? ''}
              onSave={(v) => saveMetaField('insurance_value', v)} />
          </dl>
        </NeuCard>
      </div>

      {/* Asset Owners */}
      <NeuCard variant="raised" padding="md">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">
            Asset Owners {!ownersLoading && `(${owners.length})`}
          </h3>
          <NeuButton icon={<Plus className="h-4 w-4" />} size="sm" onClick={() => setShowAddOwner(true)}>
            Add Owner
          </NeuButton>
        </div>

        {/* Compliance summary */}
        {!ownersLoading && owners.length > 0 && (() => {
          const verified = (owners as OwnerRow[]).filter(o => (o.contacts?.kyc_status as string) === 'verified').length
          const total = owners.length
          return (
            <div className="flex items-center gap-3 mb-3 p-2 rounded-[var(--radius-sm)] bg-[var(--bg-body)] shadow-[var(--shadow-pressed)]">
              <span className="text-xs font-medium text-[var(--text-muted)]">Entity Compliance:</span>
              <span className={`text-xs font-semibold ${verified === total ? 'text-[var(--chartreuse)]' : 'text-[var(--amber)]'}`}>
                {verified}/{total} verified
              </span>
              {verified < total && <span className="text-[10px] text-[var(--ruby)]">⚠ Action required</span>}
            </div>
          )
        })()}

        {Boolean(asset.asset_holder_entity) && (
          <div className="flex items-center gap-3 p-2 rounded-[var(--radius-sm)] bg-[var(--bg-body)] shadow-[var(--shadow-pressed)] mb-3">
            <div className="w-8 h-8 rounded-full bg-[var(--bg-surface)] shadow-[var(--shadow-raised-sm)] flex items-center justify-center shrink-0">
              <Building2 className="h-4 w-4 text-[var(--text-muted)]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-[var(--text-primary)] truncate">{asset.asset_holder_entity as string}</p>
              <p className="text-xs text-[var(--text-muted)]">Asset Holder Entity</p>
            </div>
          </div>
        )}

        {ownersLoading ? (
          <NeuSkeleton variant="text" lines={3} />
        ) : owners.length === 0 ? (
          <NeuCard variant="pressed" padding="md" className="text-center">
            <User className="h-8 w-8 text-[var(--text-placeholder)] mx-auto mb-2" />
            <p className="text-sm text-[var(--text-muted)]">No owners linked yet</p>
          </NeuCard>
        ) : (
          <div className="space-y-2">
            {(owners as OwnerRow[]).map((owner) => {
              const contact = owner.contacts
              const kycStatus = (contact?.kyc_status as string) ?? 'not_started'
              return (
                <div key={owner.id as string}
                  className="flex items-center gap-3 p-2 rounded-[var(--radius-sm)] bg-[var(--bg-body)] shadow-[var(--shadow-pressed)]">
                  <div className="w-8 h-8 rounded-full bg-[var(--bg-surface)] shadow-[var(--shadow-raised-sm)] flex items-center justify-center shrink-0">
                    {contact?.contact_type === 'entity' ? <Building2 className="h-4 w-4 text-[var(--text-muted)]" /> : <User className="h-4 w-4 text-[var(--text-muted)]" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Link href={`/crm/contacts/${contact?.id ?? ''}`} className="text-sm font-medium text-[var(--text-primary)] hover:text-[var(--teal)] truncate">
                        {(contact?.full_name as string) ?? '---'}
                      </Link>
                      {(owner.is_primary as boolean) && <Crown className="h-3.5 w-3.5 text-[var(--amber)] shrink-0" />}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <NeuBadge color="gray" size="sm">{((owner.role as string) ?? 'holder').replace(/_/g, ' ')}</NeuBadge>
                      <ComplianceBadge kycStatus={kycStatus} />
                    </div>
                  </div>
                  {(owner.ownership_percentage as number | null) != null && (
                    <span className="text-sm font-semibold text-[var(--text-primary)] tabular-nums shrink-0">{owner.ownership_percentage as number}%</span>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </NeuCard>

      <AddOwnerModal open={showAddOwner} onClose={() => setShowAddOwner(false)} assetId={assetId} />

      <RecentCommsWidget assetId={assetId} />
    </div>
  )
}

type OwnerRow = Record<string, unknown> & {
  contacts: { id: string; full_name: string; contact_type: string; kyc_status: string; email: string | null } | null
}
