'use client'

import { useState, useEffect } from 'react'
import { trpc } from '@/lib/trpc'
import { NeuModal } from '@/components/ui/NeuModal'
import { NeuButton } from '@/components/ui/NeuButton'
import { NeuInput, NeuTextarea } from '@/components/ui/NeuInput'
import { NeuSelect } from '@/components/ui/NeuSelect'

interface EditContactModalProps {
  open: boolean
  onClose: () => void
  contact: Record<string, unknown>
  onSuccess: () => void
}

const RELATIONSHIP_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'prospecting', label: 'Prospecting' },
  { value: 'former', label: 'Former' },
]

export function EditContactModal({ open, onClose, contact, onSuccess }: EditContactModalProps) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')
  const [relationshipStatus, setRelationshipStatus] = useState('')
  const [emailError, setEmailError] = useState('')
  const [phoneError, setPhoneError] = useState('')

  const validateEmail = (val: string) => {
    if (val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      setEmailError('Please enter a valid email address')
    } else {
      setEmailError('')
    }
  }

  const validatePhone = (val: string) => {
    if (val && !/^\+?[\d\s\-().]{7,20}$/.test(val)) {
      setPhoneError('Please enter a valid phone number')
    } else {
      setPhoneError('')
    }
  }

  const hasErrors = !!emailError || !!phoneError

  useEffect(() => {
    if (open && contact) {
      setFullName((contact.full_name as string) ?? '')
      setEmail((contact.email as string) ?? '')
      setPhone((contact.phone as string) ?? '')
      setAddress((contact.address as string) ?? '')
      setTitle((contact.title as string) ?? '')
      setNotes((contact.notes as string) ?? '')
      setRelationshipStatus((contact.relationship_status as string) ?? '')
      setEmailError('')
      setPhoneError('')
    }
  }, [open, contact])

  const mutation = trpc.contacts.update.useMutation({
    onSuccess: () => {
      onSuccess()
      onClose()
    },
  })

  const handleSubmit = () => {
    if (!fullName.trim()) return
    mutation.mutate({
      contactId: contact.id as string,
      fullName: fullName.trim(),
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      address: address.trim() || undefined,
      title: title.trim() || undefined,
      notes: notes.trim() || undefined,
      relationshipStatus: relationshipStatus || undefined,
    })
  }

  return (
    <NeuModal open={open} onClose={onClose} title="Edit Contact" maxWidth="md">
      <div className="space-y-3">
        <NeuInput
          label="Full Name *"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <NeuInput
            label="Email"
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); validateEmail(e.target.value) }}
            onBlur={() => validateEmail(email)}
            error={emailError || undefined}
          />
          <NeuInput
            label="Phone"
            value={phone}
            onChange={(e) => { setPhone(e.target.value); validatePhone(e.target.value) }}
            onBlur={() => validatePhone(phone)}
            error={phoneError || undefined}
          />
        </div>
        <NeuInput
          label="Title"
          placeholder="e.g. CEO, Managing Partner..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <NeuInput
          label="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <NeuSelect
          label="Relationship Status"
          value={relationshipStatus}
          onChange={(e) => setRelationshipStatus(e.target.value)}
          placeholder="Select status..."
          options={RELATIONSHIP_OPTIONS}
        />
        <NeuTextarea
          label="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
      </div>
      <div className="flex gap-3 pt-4">
        <NeuButton variant="ghost" onClick={onClose} fullWidth>Cancel</NeuButton>
        <NeuButton
          onClick={handleSubmit}
          loading={mutation.isPending}
          disabled={!fullName.trim() || hasErrors}
          fullWidth
        >
          Save Changes
        </NeuButton>
      </div>
      {mutation.error && (
        <p className="text-sm text-[var(--ruby)] mt-2">{mutation.error.message}</p>
      )}
    </NeuModal>
  )
}
