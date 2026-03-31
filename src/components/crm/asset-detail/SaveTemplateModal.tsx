'use client'

import { useState } from 'react'
import { trpc } from '@/lib/trpc'
import { NeuModal } from '@/components/ui/NeuModal'
import { NeuButton } from '@/components/ui/NeuButton'
import { NeuInput, NeuTextarea } from '@/components/ui/NeuInput'

interface SaveTemplateModalProps {
  open: boolean
  onClose: () => void
  assetId: string
}

export function SaveTemplateModal({ open, onClose, assetId }: SaveTemplateModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const mutation = trpc.templates.saveFromAsset.useMutation({
    onSuccess: () => {
      setName('')
      setDescription('')
      onClose()
    },
  })

  const handleSubmit = () => {
    if (!name.trim()) return
    mutation.mutate({
      assetId,
      templateName: name.trim(),
      description: description.trim() || undefined,
    })
  }

  return (
    <NeuModal open={open} onClose={onClose} title="Save as Template" maxWidth="sm">
      <div className="space-y-3">
        <NeuInput
          label="Template Name *"
          placeholder="e.g. Gemstone Tokenization Workflow"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <NeuTextarea
          label="Description"
          placeholder="Optional description..."
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
          disabled={!name.trim()}
          fullWidth
        >
          Save Template
        </NeuButton>
      </div>
      {mutation.error && (
        <p className="text-sm text-[var(--ruby)] mt-2">{mutation.error.message}</p>
      )}
    </NeuModal>
  )
}
