'use client'

import { useState, useEffect } from 'react'
import { trpc } from '@/lib/trpc'
import { NeuModal } from '@/components/ui/NeuModal'
import { NeuButton } from '@/components/ui/NeuButton'
import { NeuInput, NeuTextarea } from '@/components/ui/NeuInput'
import { NeuSelect } from '@/components/ui/NeuSelect'

interface EditPartnerModalProps {
  open: boolean
  onClose: () => void
  partner: Record<string, unknown>
  onSuccess: () => void
}

const ENGAGEMENT_OPTIONS = [
  { value: 'prospecting', label: 'Prospecting' },
  { value: 'evaluating', label: 'Evaluating' },
  { value: 'onboarding', label: 'Onboarding' },
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' },
  { value: 'terminated', label: 'Terminated' },
]

export function EditPartnerModal({ open, onClose, partner, onSuccess }: EditPartnerModalProps) {
  const [name, setName] = useState('')
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [website, setWebsite] = useState('')
  const [description, setDescription] = useState('')
  const [engagementStatus, setEngagementStatus] = useState('')
  const [emailError, setEmailError] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [websiteError, setWebsiteError] = useState('')

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

  const validateWebsite = (val: string) => {
    if (val && !/^https?:\/\/.+/.test(val)) {
      setWebsiteError('URL must start with http:// or https://')
    } else {
      setWebsiteError('')
    }
  }

  const hasErrors = !!emailError || !!phoneError || !!websiteError

  useEffect(() => {
    if (open && partner) {
      setName((partner.name as string) ?? '')
      setContactName((partner.contact_name as string) ?? '')
      setContactEmail((partner.contact_email as string) ?? '')
      setContactPhone((partner.contact_phone as string) ?? '')
      setWebsite((partner.website as string) ?? '')
      setDescription((partner.description as string) ?? '')
      setEngagementStatus((partner.engagement_status as string) ?? '')
      setEmailError('')
      setPhoneError('')
      setWebsiteError('')
    }
  }, [open, partner])

  const mutation = trpc.partners.update.useMutation({
    onSuccess: () => {
      onSuccess()
      onClose()
    },
  })

  const handleSubmit = () => {
    if (!name.trim() || hasErrors) return
    mutation.mutate({
      partnerId: partner.id as string,
      name: name.trim(),
      contactName: contactName.trim() || undefined,
      contactEmail: contactEmail.trim() || undefined,
      contactPhone: contactPhone.trim() || undefined,
      website: website.trim() || undefined,
      description: description.trim() || undefined,
      engagementStatus: engagementStatus || undefined,
    })
  }

  return (
    <NeuModal open={open} onClose={onClose} title="Edit Partner" maxWidth="md">
      <div className="space-y-3">
        <NeuInput
          label="Partner Name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <NeuInput
            label="Contact Name"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
          />
          <NeuInput
            label="Contact Email"
            type="email"
            value={contactEmail}
            onChange={(e) => { setContactEmail(e.target.value); validateEmail(e.target.value) }}
            onBlur={() => validateEmail(contactEmail)}
            error={emailError || undefined}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <NeuInput
            label="Contact Phone"
            value={contactPhone}
            onChange={(e) => { setContactPhone(e.target.value); validatePhone(e.target.value) }}
            onBlur={() => validatePhone(contactPhone)}
            error={phoneError || undefined}
          />
          <NeuInput
            label="Website"
            value={website}
            onChange={(e) => { setWebsite(e.target.value); validateWebsite(e.target.value) }}
            onBlur={() => validateWebsite(website)}
            error={websiteError || undefined}
          />
        </div>
        <NeuSelect
          label="Engagement Status"
          value={engagementStatus}
          onChange={(e) => setEngagementStatus(e.target.value)}
          placeholder="Select status..."
          options={ENGAGEMENT_OPTIONS}
        />
        <NeuTextarea
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>
      <div className="flex gap-3 pt-4">
        <NeuButton variant="ghost" onClick={onClose} fullWidth>Cancel</NeuButton>
        <NeuButton
          onClick={handleSubmit}
          loading={mutation.isPending}
          disabled={!name.trim() || hasErrors}
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
