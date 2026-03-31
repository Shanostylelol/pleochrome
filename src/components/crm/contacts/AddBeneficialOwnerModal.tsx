'use client'

import { useState } from 'react'
import { trpc } from '@/lib/trpc'
import { NeuButton } from '@/components/ui/NeuButton'
import { NeuInput } from '@/components/ui/NeuInput'
import { NeuSelect } from '@/components/ui/NeuSelect'
import { NeuToggle } from '@/components/ui/NeuToggle'
import { NeuModal } from '@/components/ui/NeuModal'

interface Props {
  open: boolean
  onClose: () => void
  parentContactId: string
}

const RELATIONSHIP_OPTIONS = [
  { value: 'beneficial_owner', label: 'Beneficial Owner' },
  { value: 'officer', label: 'Officer' },
  { value: 'director', label: 'Director' },
  { value: 'shareholder', label: 'Shareholder' },
]

export function AddBeneficialOwnerModal({ open, onClose, parentContactId }: Props) {
  const [childContactId, setChildContactId] = useState('')
  const [ownershipPct, setOwnershipPct] = useState('')
  const [relationshipType, setRelationshipType] = useState('beneficial_owner')
  const [isControlPerson, setIsControlPerson] = useState(false)
  const [search, setSearch] = useState('')
  const utils = trpc.useUtils()

  const { data: contacts = [] } = trpc.contacts.list.useQuery(
    { contactType: 'individual', search: search || undefined, limit: 50 },
    { enabled: open },
  )

  const mutation = trpc.ownership.addBeneficialOwner.useMutation({
    onSuccess: () => {
      utils.contacts.getById.invalidate({ contactId: parentContactId })
      utils.ownership.getOwnershipTree.invalidate({ contactId: parentContactId })
      resetForm()
      onClose()
    },
  })

  const resetForm = () => {
    setChildContactId('')
    setOwnershipPct('')
    setRelationshipType('beneficial_owner')
    setIsControlPerson(false)
    setSearch('')
  }

  const handleSubmit = () => {
    if (!childContactId) return
    const pct = ownershipPct ? parseFloat(ownershipPct) : undefined
    mutation.mutate({
      parentContactId,
      childContactId,
      ownershipPercentage: pct && !isNaN(pct) ? pct : undefined,
      isControlPerson,
      relationshipType,
    })
  }

  const contactOptions = (contacts as { id: string; full_name: string }[]).map((c) => ({
    value: c.id,
    label: c.full_name,
  }))

  return (
    <NeuModal open={open} onClose={onClose} title="Add Beneficial Owner" maxWidth="sm">
      <div className="space-y-3">
        <NeuInput
          label="Search Individuals"
          placeholder="Type to search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <NeuSelect
          label="Contact *"
          value={childContactId}
          onChange={(e) => setChildContactId(e.target.value)}
          placeholder="Select individual..."
          options={contactOptions}
        />
        <NeuSelect
          label="Relationship"
          value={relationshipType}
          onChange={(e) => setRelationshipType(e.target.value)}
          options={RELATIONSHIP_OPTIONS}
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
        <NeuToggle
          enabled={isControlPerson}
          onChange={setIsControlPerson}
          label="Control Person"
        />
      </div>
      <div className="flex gap-3 pt-4">
        <NeuButton variant="ghost" onClick={onClose} fullWidth>Cancel</NeuButton>
        <NeuButton
          onClick={handleSubmit}
          loading={mutation.isPending}
          disabled={!childContactId}
          fullWidth
        >
          Add Owner
        </NeuButton>
      </div>
      {mutation.error && (
        <p className="text-sm text-[var(--ruby)] mt-2">{mutation.error.message}</p>
      )}
    </NeuModal>
  )
}
