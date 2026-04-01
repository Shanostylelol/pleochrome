'use client'

import { useState } from 'react'
import { trpc } from '@/lib/trpc'
import { NeuButton } from '@/components/ui/NeuButton'
import { NeuInput } from '@/components/ui/NeuInput'
import { NeuSelect } from '@/components/ui/NeuSelect'
import { NeuToggle } from '@/components/ui/NeuToggle'
import { NeuModal } from '@/components/ui/NeuModal'
import { useToast } from '@/components/ui/NeuToast'

interface AddOwnerModalProps {
  open: boolean
  onClose: () => void
  assetId: string
}

const ROLE_OPTIONS = [
  { value: 'asset_holder', label: 'Asset Holder' },
  { value: 'beneficial_owner', label: 'Beneficial Owner' },
  { value: 'investor', label: 'Investor' },
]

export function AddOwnerModal({ open, onClose, assetId }: AddOwnerModalProps) {
  const [mode, setMode] = useState<'select' | 'create'>('select')
  const [contactId, setContactId] = useState('')
  const [role, setRole] = useState('asset_holder')
  const [ownershipPct, setOwnershipPct] = useState('')
  const [isPrimary, setIsPrimary] = useState(false)
  const [search, setSearch] = useState('')
  // Create mode fields
  const [newName, setNewName] = useState('')
  const [newType, setNewType] = useState<'individual' | 'entity'>('individual')
  const [newEmail, setNewEmail] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const { toast } = useToast()
  const utils = trpc.useUtils()

  const { data: contacts = [] } = trpc.contacts.list.useQuery(
    { search: search || undefined, limit: 50 },
    { enabled: open && mode === 'select' },
  )

  const linkMutation = trpc.contacts.linkToAsset.useMutation({
    onSuccess: () => {
      utils.ownership.getAssetOwners.invalidate({ assetId })
      toast('Owner added', 'success')
      resetForm(); onClose()
    },
    onError: (err) => toast(err.message, 'error'),
  })

  const createMutation = trpc.contacts.create.useMutation({
    onSuccess: (data) => {
      const newContactId = (data as { id: string })?.id
      if (newContactId) {
        linkMutation.mutate({
          contactId: newContactId, assetId,
          role: role.trim() || 'asset_holder',
          ownershipPercentage: ownershipPct ? parseFloat(ownershipPct) : undefined,
          isPrimary,
        })
      }
    },
    onError: (err) => toast(err.message, 'error'),
  })

  const resetForm = () => {
    setMode('select'); setContactId(''); setRole('asset_holder'); setOwnershipPct(''); setIsPrimary(false)
    setSearch(''); setNewName(''); setNewEmail(''); setNewPhone(''); setNewType('individual')
  }

  const handleSubmitSelect = () => {
    if (!contactId) return
    linkMutation.mutate({
      contactId, assetId, role: role.trim() || 'asset_holder',
      ownershipPercentage: ownershipPct ? parseFloat(ownershipPct) : undefined,
      isPrimary,
    })
  }

  const handleSubmitCreate = () => {
    if (!newName.trim()) return
    createMutation.mutate({
      fullName: newName.trim(), contactType: newType,
      email: newEmail.trim() || undefined, phone: newPhone.trim() || undefined,
      role: role as never,
    })
  }

  const contactOptions = (contacts as { id: string; full_name: string; contact_type: string }[]).map((c) => ({
    value: c.id, label: `${c.full_name} (${c.contact_type})`,
  }))

  const isLoading = linkMutation.isPending || createMutation.isPending

  return (
    <NeuModal open={open} onClose={onClose} title="Add Asset Owner" maxWidth="sm">
      <div className="space-y-3">
        {/* Mode toggle */}
        <div className="flex gap-2 mb-2">
          <button onClick={() => setMode('select')}
            className={`flex-1 px-3 py-1.5 text-xs rounded-[var(--radius-sm)] transition-all ${
              mode === 'select' ? 'bg-[var(--bg-surface)] shadow-[var(--shadow-raised-sm)] text-[var(--text-primary)] font-medium' : 'text-[var(--text-muted)]'
            }`}>Select Existing</button>
          <button onClick={() => setMode('create')}
            className={`flex-1 px-3 py-1.5 text-xs rounded-[var(--radius-sm)] transition-all ${
              mode === 'create' ? 'bg-[var(--bg-surface)] shadow-[var(--shadow-raised-sm)] text-[var(--text-primary)] font-medium' : 'text-[var(--text-muted)]'
            }`}>Create New</button>
        </div>

        {mode === 'select' ? (
          <>
            <NeuInput label="Search Contacts" placeholder="Type to search..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <NeuSelect label="Contact *" value={contactId} onChange={(e) => setContactId(e.target.value)} placeholder="Select contact..." options={contactOptions} />
          </>
        ) : (
          <>
            <NeuInput label="Full Name *" placeholder="e.g., John Smith" value={newName} onChange={(e) => setNewName(e.target.value)} />
            <NeuSelect label="Type" value={newType} onChange={(e) => setNewType(e.target.value as 'individual' | 'entity')}
              options={[{ value: 'individual', label: 'Individual' }, { value: 'entity', label: 'Entity' }]} />
            <NeuInput label="Email" placeholder="email@example.com" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
            <NeuInput label="Phone" placeholder="+1 555-0100" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} />
          </>
        )}

        <NeuSelect label="Role *" value={role} onChange={(e) => setRole(e.target.value)} options={ROLE_OPTIONS} />
        <NeuInput label="Ownership %" type="number" placeholder="0-100" value={ownershipPct} onChange={(e) => setOwnershipPct(e.target.value)} />
        <NeuToggle enabled={isPrimary} onChange={setIsPrimary} label="Primary Owner" />
      </div>
      <div className="flex gap-3 pt-4">
        <NeuButton variant="ghost" onClick={() => { resetForm(); onClose() }} fullWidth>Cancel</NeuButton>
        <NeuButton onClick={mode === 'select' ? handleSubmitSelect : handleSubmitCreate}
          loading={isLoading} disabled={mode === 'select' ? !contactId : !newName.trim()} fullWidth>
          {mode === 'create' ? 'Create & Add' : 'Add Owner'}
        </NeuButton>
      </div>
      {(linkMutation.error || createMutation.error) && (
        <p className="text-sm text-[var(--ruby)] mt-2">{(linkMutation.error ?? createMutation.error)?.message}</p>
      )}
    </NeuModal>
  )
}
