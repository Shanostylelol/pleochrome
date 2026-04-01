'use client'

import { useState } from 'react'
import { trpc } from '@/lib/trpc'
import { NeuCard, NeuBadge, NeuButton, NeuModal, NeuInput, NeuSelect, NeuTextarea, NeuSkeleton } from '@/components/ui'
import { Plus, MessageCircle, Mail, Phone, Video, Users } from 'lucide-react'

const TYPE_ICON: Record<string, typeof Mail> = {
  email: Mail,
  phone: Phone,
  video_call: Video,
  in_person: Users,
  text: MessageCircle,
  other: MessageCircle,
}

const TYPE_COLOR: Record<string, 'teal' | 'amethyst' | 'sapphire' | 'amber' | 'gray'> = {
  email: 'teal',
  phone: 'amethyst',
  video_call: 'sapphire',
  in_person: 'amber',
  text: 'gray',
  other: 'gray',
}

function formatDate(date: string | null | undefined): string {
  if (!date) return '---'
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export function ContactCommsTab({ contactId }: { contactId: string }) {
  const [showAdd, setShowAdd] = useState(false)
  const [commType, setCommType] = useState<'email' | 'phone' | 'video_call' | 'in_person'>('email')
  const [direction, setDirection] = useState<'inbound' | 'outbound'>('outbound')
  const [subject, setSubject] = useState('')
  const [summary, setSummary] = useState('')

  const { data: comms = [], isLoading } = trpc.communications.listByContact.useQuery({ contactId })
  const utils = trpc.useUtils()
  const createMut = trpc.communications.create.useMutation({
    onSuccess: () => {
      utils.communications.listByContact.invalidate({ contactId })
      setShowAdd(false)
      setSubject('')
      setSummary('')
    },
  })

  if (isLoading) {
    return (
      <NeuSkeleton variant="text" lines={3} />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">
          Communications ({comms.length})
        </h3>
        <NeuButton icon={<Plus className="h-4 w-4" />} size="sm" onClick={() => setShowAdd(true)}>
          Log Communication
        </NeuButton>
      </div>

      {comms.length === 0 ? (
        <NeuCard variant="pressed" padding="lg" className="text-center">
          <MessageCircle className="h-10 w-10 text-[var(--text-placeholder)] mx-auto mb-3" />
          <p className="text-sm text-[var(--text-muted)]">No communications logged yet</p>
        </NeuCard>
      ) : (
        <div className="space-y-2">
          {comms.map((c: Record<string, unknown>) => {
            const ct = (c.comm_type as string) ?? 'other'
            const Icon = TYPE_ICON[ct] ?? MessageCircle
            return (
              <NeuCard key={c.id as string} variant="raised" padding="md">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-[var(--radius-md)] bg-[var(--bg-body)] shadow-[var(--shadow-pressed)] flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="h-4 w-4 text-[var(--text-muted)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <p className="font-medium text-sm text-[var(--text-primary)] truncate">
                        {(c.subject as string) || ct.replace(/_/g, ' ').replace(/\b\w/g, (ch) => ch.toUpperCase())}
                      </p>
                      <div className="flex gap-1.5">
                        <NeuBadge color={TYPE_COLOR[ct] ?? 'gray'} size="sm">
                          {ct.replace(/_/g, ' ')}
                        </NeuBadge>
                        <NeuBadge color={c.direction === 'inbound' ? 'emerald' : 'sapphire'} size="sm">
                          {(c.direction as string) ?? 'outbound'}
                        </NeuBadge>
                      </div>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-2">
                      {(c.summary as string) ?? '---'}
                    </p>
                    <p className="text-[11px] text-[var(--text-muted)] mt-1">
                      {formatDate(c.performed_at as string)}
                    </p>
                  </div>
                </div>
              </NeuCard>
            )
          })}
        </div>
      )}

      {/* Log Communication Modal */}
      <NeuModal open={showAdd} onClose={() => setShowAdd(false)} title="Log Communication">
        <div className="space-y-4">
          <NeuSelect
            label="Type"
            value={commType}
            onChange={(e) => setCommType(e.target.value as typeof commType)}
            options={[
              { value: 'email', label: 'Email' },
              { value: 'phone', label: 'Phone' },
              { value: 'video_call', label: 'Video Call' },
              { value: 'in_person', label: 'In Person' },
            ]}
          />
          <NeuSelect
            label="Direction"
            value={direction}
            onChange={(e) => setDirection(e.target.value as 'inbound' | 'outbound')}
            options={[
              { value: 'outbound', label: 'Outbound' },
              { value: 'inbound', label: 'Inbound' },
            ]}
          />
          <NeuInput label="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Brief subject line" />
          <NeuTextarea label="Summary" value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="What was discussed?" />
          <div className="flex justify-end gap-2 pt-2">
            <NeuButton variant="ghost" onClick={() => setShowAdd(false)}>Cancel</NeuButton>
            <NeuButton
              loading={createMut.isPending}
              disabled={!summary.trim()}
              onClick={() => createMut.mutate({
                contactId,
                commType,
                direction,
                subject: subject || undefined,
                summary: summary.trim(),
              })}
            >
              Log
            </NeuButton>
          </div>
        </div>
      </NeuModal>
    </div>
  )
}
