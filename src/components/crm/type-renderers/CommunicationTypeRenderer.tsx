'use client'

import { useState } from 'react'
import { Phone, Mail, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NeuButton } from '@/components/ui/NeuButton'
import { useToast } from '@/components/ui/NeuToast'
import { parseSubtaskNotes, serializeSubtaskNotes } from '@/lib/subtask-notes'
import type { SubtaskTypeKey } from '@/lib/constants'
import type { Subtask } from '../SubtaskChecklist'

interface CommunicationTypeRendererProps {
  subtask: Subtask
  typeKey: SubtaskTypeKey
  onUpdate: (subtaskId: string, fields: { notes?: string }) => void
}

const OUTCOMES = ['connected', 'voicemail', 'no_answer', 'busy'] as const
const COMM_TYPES = ['email', 'phone', 'video_call', 'in_person', 'text', 'other'] as const
const DIRECTIONS = ['inbound', 'outbound'] as const

function fieldCn() {
  return cn('w-full h-7 text-xs rounded-[var(--radius-sm)] px-2',
    'bg-[var(--bg-input)] text-[var(--text-primary)] placeholder:text-[var(--text-placeholder)]',
    'shadow-[var(--shadow-pressed)] border border-[var(--border)]',
    'focus:outline-none focus:border-[var(--teal)]')
}

function textareaCn() {
  return cn('w-full text-xs rounded-[var(--radius-sm)] px-2 py-1.5 resize-none',
    'bg-[var(--bg-input)] text-[var(--text-primary)] placeholder:text-[var(--text-placeholder)]',
    'shadow-[var(--shadow-pressed)] border border-[var(--border)]',
    'focus:outline-none focus:border-[var(--teal)]')
}

export function CommunicationTypeRenderer({ subtask, typeKey, onUpdate }: CommunicationTypeRendererProps) {
  const { toast } = useToast()
  const parsed = parseSubtaskNotes(subtask.notes)

  const [text, setText] = useState(parsed.text ?? '')
  const [callTo, setCallTo] = useState((parsed.call_to as string) ?? '')
  const [duration, setDuration] = useState((parsed.duration_min as number) ?? 0)
  const [outcome, setOutcome] = useState((parsed.outcome as string) ?? '')
  const [emailTo, setEmailTo] = useState((parsed.email_to as string) ?? '')
  const [emailSubject, setEmailSubject] = useState((parsed.email_subject as string) ?? '')
  const [commType, setCommType] = useState((parsed.comm_type as string) ?? 'phone')
  const [direction, setDirection] = useState((parsed.direction as string) ?? 'outbound')
  const [saving, setSaving] = useState(false)

  function save(extra: Record<string, unknown> = {}) {
    setSaving(true)
    const data = { ...parsed, _type: typeKey, text, ...extra }
    onUpdate(subtask.id, { notes: serializeSubtaskNotes(data) })
    toast('Saved', 'success')
    setTimeout(() => setSaving(false), 500)
  }

  if (typeKey === 'call') {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-1">
          <Phone className="h-4 w-4 text-[var(--emerald)]" />
          <span className="text-xs font-medium text-[var(--text-muted)]">Call Log</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] font-medium text-[var(--text-muted)] mb-0.5 block">Who</label>
            <input value={callTo} onChange={(e) => setCallTo(e.target.value)} placeholder="Contact name..." className={fieldCn()} />
          </div>
          <div>
            <label className="text-[10px] font-medium text-[var(--text-muted)] mb-0.5 block">Duration (min)</label>
            <input type="number" value={duration || ''} onChange={(e) => setDuration(Number(e.target.value))} placeholder="0" className={fieldCn()} />
          </div>
        </div>
        <div>
          <label className="text-[10px] font-medium text-[var(--text-muted)] mb-0.5 block">Outcome</label>
          <select value={outcome} onChange={(e) => setOutcome(e.target.value)} className={fieldCn()}>
            <option value="">Select...</option>
            {OUTCOMES.map((o) => <option key={o} value={o}>{o.replace('_', ' ')}</option>)}
          </select>
        </div>
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Call notes..." rows={2} className={textareaCn()} />
        <NeuButton size="sm" loading={saving} onClick={() => save({ call_to: callTo, duration_min: duration, outcome })} className="!h-7">
          Save Call Log
        </NeuButton>
      </div>
    )
  }

  if (typeKey === 'email') {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-1">
          <Mail className="h-4 w-4 text-[var(--teal)]" />
          <span className="text-xs font-medium text-[var(--text-muted)]">Email Log</span>
        </div>
        <div>
          <label className="text-[10px] font-medium text-[var(--text-muted)] mb-0.5 block">To</label>
          <input value={emailTo} onChange={(e) => setEmailTo(e.target.value)} placeholder="Recipient..." className={fieldCn()} />
        </div>
        <div>
          <label className="text-[10px] font-medium text-[var(--text-muted)] mb-0.5 block">Subject</label>
          <input value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} placeholder="Email subject..." className={fieldCn()} />
        </div>
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Email summary..." rows={3} className={textareaCn()} />
        <NeuButton size="sm" loading={saving} onClick={() => save({ email_to: emailTo, email_subject: emailSubject })} className="!h-7">
          Save Email Log
        </NeuButton>
      </div>
    )
  }

  // communication (generic)
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-1">
        <MessageSquare className="h-4 w-4 text-[var(--amethyst)]" />
        <span className="text-xs font-medium text-[var(--text-muted)]">Communication Log</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] font-medium text-[var(--text-muted)] mb-0.5 block">Type</label>
          <select value={commType} onChange={(e) => setCommType(e.target.value)} className={fieldCn()}>
            {COMM_TYPES.map((t) => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[10px] font-medium text-[var(--text-muted)] mb-0.5 block">Direction</label>
          <select value={direction} onChange={(e) => setDirection(e.target.value)} className={fieldCn()}>
            {DIRECTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>
      <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Summary..." rows={3} className={textareaCn()} />
      <NeuButton size="sm" loading={saving} onClick={() => save({ comm_type: commType, direction })} className="!h-7">
        Save Log
      </NeuButton>
    </div>
  )
}
