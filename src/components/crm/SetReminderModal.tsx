'use client'

import { useState } from 'react'
import { trpc } from '@/lib/trpc'
import { NeuModal, NeuInput, NeuTextarea, NeuSelect, NeuButton } from '@/components/ui'
import { useToast } from '@/components/ui/NeuToast'

interface SetReminderModalProps {
  open: boolean
  onClose: () => void
  assetId?: string
  assetName?: string
}

const QUICK_OPTIONS = [
  { label: 'In 1 hour', hours: 1 },
  { label: 'Tomorrow morning', hours: 20 },
  { label: 'In 3 days', hours: 72 },
  { label: 'In 1 week', hours: 168 },
]

const RECURRENCE_OPTS = [
  { value: '', label: 'No recurrence' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'annually', label: 'Annually' },
]

export function SetReminderModal({ open, onClose, assetId, assetName }: SetReminderModalProps) {
  const { toast } = useToast()
  const utils = trpc.useUtils()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [remindAt, setRemindAt] = useState('')
  const [recurrence, setRecurrence] = useState('')
  const [titleError, setTitleError] = useState('')

  const createMut = trpc.reminders.create.useMutation({
    onSuccess: () => {
      toast('Reminder set', 'success')
      utils.dashboard.getMyDay.invalidate()
      onClose()
      setTitle(''); setDescription(''); setRemindAt(''); setRecurrence(''); setTitleError('')
    },
    onError: (err) => toast(err.message, 'error'),
  })

  const handleQuick = (hours: number) => {
    const d = new Date(Date.now() + hours * 3_600_000)
    setRemindAt(d.toISOString().slice(0, 16))
  }

  const handleSubmit = () => {
    if (!title.trim()) { setTitleError('Title is required'); return }
    if (!remindAt) { setTitleError('Remind date is required'); return }
    setTitleError('')
    createMut.mutate({
      title: title.trim(),
      description: description.trim() || undefined,
      remindAt: new Date(remindAt).toISOString(),
      assetId: assetId || undefined,
      isRecurring: !!recurrence,
      recurrenceRule: (recurrence || undefined) as 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually' | undefined,
    })
  }

  return (
    <NeuModal open={open} onClose={onClose} title="Set Reminder" maxWidth="sm">
      <div className="space-y-4">
        {assetName && <p className="text-xs text-[var(--text-muted)]">For: <span className="font-medium text-[var(--text-secondary)]">{assetName}</span></p>}

        <NeuInput
          label="Title *"
          placeholder="e.g. Follow up with appraiser"
          value={title}
          onChange={(e) => { setTitle(e.target.value); if (titleError) setTitleError('') }}
          error={titleError}
        />

        {/* Quick pick buttons */}
        <div>
          <p className="text-xs text-[var(--text-muted)] mb-2">Quick pick</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_OPTIONS.map((q) => (
              <button key={q.label} onClick={() => handleQuick(q.hours)}
                className="px-2.5 py-1 text-xs rounded-[var(--radius-sm)] bg-[var(--bg-body)] shadow-[var(--shadow-raised-sm)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] transition-colors">
                {q.label}
              </button>
            ))}
          </div>
        </div>

        <NeuInput
          label="Remind at *"
          type="datetime-local"
          value={remindAt}
          onChange={(e) => setRemindAt(e.target.value)}
        />

        <NeuTextarea
          label="Note (optional)"
          placeholder="Any additional context..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
        />

        <NeuSelect
          label="Recurrence"
          value={recurrence}
          onChange={(e) => setRecurrence(e.target.value)}
        >
          {RECURRENCE_OPTS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </NeuSelect>

        <div className="flex gap-3 pt-1">
          <NeuButton variant="ghost" onClick={onClose} fullWidth>Cancel</NeuButton>
          <NeuButton onClick={handleSubmit} loading={createMut.isPending} disabled={!title.trim() || !remindAt} fullWidth>
            Set Reminder
          </NeuButton>
        </div>
      </div>
    </NeuModal>
  )
}
