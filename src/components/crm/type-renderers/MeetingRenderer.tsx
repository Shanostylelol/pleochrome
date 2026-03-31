'use client'

import { useState } from 'react'
import { Calendar, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NeuButton } from '@/components/ui/NeuButton'
import { useToast } from '@/components/ui/NeuToast'
import { trpc } from '@/lib/trpc'
import { parseSubtaskNotes, serializeSubtaskNotes } from '@/lib/subtask-notes'
import type { Subtask } from '../SubtaskChecklist'

interface MeetingRendererProps {
  subtask: Subtask
  taskId: string
  assetId?: string
  onUpdate: (subtaskId: string, fields: { notes?: string }) => void
}

const MEETING_TYPES = ['internal', 'external', 'call', 'video', 'in_person'] as const

function fieldCn() {
  return cn('w-full h-7 text-xs rounded-[var(--radius-sm)] px-2',
    'bg-[var(--bg-input)] text-[var(--text-primary)] placeholder:text-[var(--text-placeholder)]',
    'shadow-[var(--shadow-pressed)] border border-[var(--border)]',
    'focus:outline-none focus:border-[var(--teal)]')
}

export function MeetingRenderer({ subtask, taskId, assetId, onUpdate }: MeetingRendererProps) {
  const { toast } = useToast()
  const parsed = parseSubtaskNotes(subtask.notes)
  const existingMeetingId = parsed.meeting_id as string | undefined

  const [title, setTitle] = useState(subtask.title)
  const [meetingDate, setMeetingDate] = useState('')
  const [meetingType, setMeetingType] = useState<string>('internal')
  const [attendees, setAttendees] = useState('')
  const [created, setCreated] = useState(!!existingMeetingId)

  const createMeeting = trpc.meetings.create.useMutation({
    onSuccess: (data) => {
      const meetingId = (data as { id: string })?.id
      if (meetingId) {
        onUpdate(subtask.id, {
          notes: serializeSubtaskNotes({ _type: 'meeting', meeting_id: meetingId, text: `Meeting: ${title}` }),
        })
      }
      setCreated(true)
      toast('Meeting created', 'success')
    },
    onError: (err) => toast(err.message, 'error'),
  })

  function handleCreate() {
    if (!title.trim() || !meetingDate) {
      toast('Title and date are required', 'error')
      return
    }
    createMeeting.mutate({
      title: title.trim(),
      meetingDate: new Date(meetingDate).toISOString(),
      meetingType,
      attendees: attendees.split(',').map(a => a.trim()).filter(Boolean),
      taskId,
      assetId,
    } as never)
  }

  if (created || existingMeetingId) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-[var(--amethyst)]" />
          <span className="text-xs font-medium text-[var(--text-primary)]">Meeting scheduled</span>
          <a href={`/crm/meetings`} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 text-[10px] text-[var(--teal)] hover:underline ml-auto">
            View in Meetings <ExternalLink className="h-3 w-3" />
          </a>
        </div>
        <p className="text-xs text-[var(--text-secondary)]">{parsed.text ?? title}</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-1">
        <Calendar className="h-4 w-4 text-[var(--amethyst)]" />
        <span className="text-xs font-medium text-[var(--text-muted)]">Schedule Meeting</span>
      </div>
      <div>
        <label className="text-[10px] font-medium text-[var(--text-muted)] mb-0.5 block">Title *</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Meeting title..." className={fieldCn()} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] font-medium text-[var(--text-muted)] mb-0.5 block">Date *</label>
          <input type="datetime-local" value={meetingDate} onChange={(e) => setMeetingDate(e.target.value)} className={fieldCn()} />
        </div>
        <div>
          <label className="text-[10px] font-medium text-[var(--text-muted)] mb-0.5 block">Type</label>
          <select value={meetingType} onChange={(e) => setMeetingType(e.target.value)} className={fieldCn()}>
            {MEETING_TYPES.map((t) => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="text-[10px] font-medium text-[var(--text-muted)] mb-0.5 block">Attendees</label>
        <input value={attendees} onChange={(e) => setAttendees(e.target.value)}
          placeholder="Shane, David, Chris..." className={fieldCn()} />
      </div>
      <NeuButton size="sm" loading={createMeeting.isPending} onClick={handleCreate} className="!h-7">
        Create Meeting
      </NeuButton>
    </div>
  )
}
