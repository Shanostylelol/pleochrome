'use client'

import { useState } from 'react'
import { trpc } from '@/lib/trpc'
import { NeuButton } from '@/components/ui/NeuButton'
import { NeuInput } from '@/components/ui/NeuInput'
import { NeuSelect } from '@/components/ui/NeuSelect'
import { NeuModal } from '@/components/ui/NeuModal'

interface Props {
  open: boolean
  onClose: () => void
  contactId: string
}

export function LinkAssetModal({ open, onClose, contactId }: Props) {
  const [assetId, setAssetId] = useState('')
  const [role, setRole] = useState('holder')
  const [ownershipPct, setOwnershipPct] = useState('')
  const utils = trpc.useUtils()

  const { data: assets = [] } = trpc.assets.list.useQuery(undefined, { enabled: open })

  const mutation = trpc.contacts.linkToAsset.useMutation({
    onSuccess: () => {
      utils.contacts.getById.invalidate({ contactId })
      setAssetId('')
      setRole('holder')
      setOwnershipPct('')
      onClose()
    },
  })

  const handleSubmit = () => {
    if (!assetId) return
    const pct = ownershipPct ? parseFloat(ownershipPct) : undefined
    mutation.mutate({
      contactId,
      assetId,
      role: role.trim() || 'holder',
      ownershipPercentage: pct && !isNaN(pct) ? pct : undefined,
    })
  }

  return (
    <NeuModal open={open} onClose={onClose} title="Link to Asset" maxWidth="sm">
      <div className="space-y-3">
        <NeuSelect
          label="Asset *"
          value={assetId}
          onChange={(e) => setAssetId(e.target.value)}
          placeholder="Select asset..."
          options={(assets as { id: string; name: string; reference_code: string }[]).map((a) => ({
            value: a.id,
            label: `${a.reference_code} - ${a.name}`,
          }))}
        />
        <NeuInput
          label="Role"
          placeholder="e.g. holder, beneficiary..."
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
        <NeuInput
          label="Ownership %"
          type="number"
          placeholder="0-100"
          value={ownershipPct}
          onChange={(e) => setOwnershipPct(e.target.value)}
          min={0}
          max={100}
        />
      </div>
      <div className="flex gap-3 pt-4">
        <NeuButton variant="ghost" onClick={onClose} fullWidth>Cancel</NeuButton>
        <NeuButton
          onClick={handleSubmit}
          loading={mutation.isPending}
          disabled={!assetId}
          fullWidth
        >
          Link Asset
        </NeuButton>
      </div>
      {mutation.error && (
        <p className="text-sm text-[var(--ruby)] mt-2">{mutation.error.message}</p>
      )}
    </NeuModal>
  )
}
