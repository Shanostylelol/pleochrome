'use client'

import { useState } from 'react'
import { StickyNote, ArrowRight, Eye, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NeuButton } from '@/components/ui/NeuButton'
import { useToast } from '@/components/ui/NeuToast'
import { parseSubtaskNotes, serializeSubtaskNotes } from '@/lib/subtask-notes'
import type { SubtaskTypeKey } from '@/lib/constants'
import type { Subtask } from '../SubtaskChecklist'

interface SimpleTypeRendererProps {
  subtask: Subtask
  typeKey: SubtaskTypeKey
  onUpdate: (subtaskId: string, fields: { notes?: string }) => void
}

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

export function SimpleTypeRenderer({ subtask, typeKey, onUpdate }: SimpleTypeRendererProps) {
  const { toast } = useToast()
  const parsed = parseSubtaskNotes(subtask.notes)
  const [text, setText] = useState(parsed.text ?? '')
  const [saving, setSaving] = useState(false)

  // Type-specific state
  const [dueDate, setDueDate] = useState((parsed.due_date as string) ?? '')
  const [linkedEntity, setLinkedEntity] = useState((parsed.linked_entity as string) ?? '')
  const [decision, setDecision] = useState((parsed.decision as string) ?? '')
  const [refNumber, setRefNumber] = useState((parsed.reference_number as string) ?? '')
  const [filingDate, setFilingDate] = useState((parsed.filing_date as string) ?? '')
  const [location, setLocation] = useState((parsed.location as string) ?? '')

  function save(extra: Record<string, unknown> = {}) {
    setSaving(true)
    const data = { ...parsed, _type: typeKey, text, ...extra }
    onUpdate(subtask.id, { notes: serializeSubtaskNotes(data) })
    toast('Saved', 'success')
    setTimeout(() => setSaving(false), 500)
  }

  if (typeKey === 'note') {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <StickyNote className="h-4 w-4 text-[var(--amber)]" />
          <span className="text-xs font-medium text-[var(--text-muted)]">Note</span>
        </div>
        <textarea value={text} onChange={(e) => setText(e.target.value)}
          placeholder="Write your note..."
          rows={4} className={textareaCn()} />
        <div className="flex items-center gap-2">
          <NeuButton size="sm" loading={saving} onClick={() => save()} className="!h-7">Save Note</NeuButton>
          {typeof parsed.saved_at === 'string' && (
            <span className="text-[10px] text-[var(--text-muted)]">
              Last saved {new Date(parsed.saved_at).toLocaleString()}
            </span>
          )}
        </div>
      </div>
    )
  }

  if (typeKey === 'follow_up') {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <ArrowRight className="h-4 w-4 text-[var(--amber)]" />
          <span className="text-xs font-medium text-[var(--text-muted)]">Follow Up</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] font-medium text-[var(--text-muted)] mb-0.5 block">Due Date</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={fieldCn()} />
          </div>
          <div>
            <label className="text-[10px] font-medium text-[var(--text-muted)] mb-0.5 block">Linked To</label>
            <input value={linkedEntity} onChange={(e) => setLinkedEntity(e.target.value)}
              placeholder="Task, contact, etc..." className={fieldCn()} />
          </div>
        </div>
        <textarea value={text} onChange={(e) => setText(e.target.value)}
          placeholder="Follow-up notes..." rows={2} className={textareaCn()} />
        <NeuButton size="sm" loading={saving} onClick={() => save({ due_date: dueDate, linked_entity: linkedEntity })} className="!h-7">
          Save Follow Up
        </NeuButton>
      </div>
    )
  }

  if (typeKey === 'review') {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-[var(--teal)]" />
          <span className="text-xs font-medium text-[var(--text-muted)]">Review Decision</span>
        </div>
        <div className="flex gap-2">
          <NeuButton size="sm" variant={decision === 'approved' ? 'primary' : 'ghost'}
            icon={<CheckCircle className="h-3.5 w-3.5" />}
            onClick={() => setDecision('approved')}
            className={cn('!h-7', decision === 'approved' && '!bg-[var(--emerald)] !text-[var(--text-on-accent)]')}>
            Approved
          </NeuButton>
          <NeuButton size="sm" variant={decision === 'rejected' ? 'primary' : 'ghost'}
            icon={<XCircle className="h-3.5 w-3.5" />}
            onClick={() => setDecision('rejected')}
            className={cn('!h-7', decision === 'rejected' && '!bg-[var(--ruby)] !text-[var(--text-on-accent)]')}>
            Rejected
          </NeuButton>
          <NeuButton size="sm" variant={decision === 'needs_changes' ? 'primary' : 'ghost'}
            icon={<AlertCircle className="h-3.5 w-3.5" />}
            onClick={() => setDecision('needs_changes')}
            className={cn('!h-7', decision === 'needs_changes' && '!bg-[var(--amber)] !text-[var(--text-on-accent)]')}>
            Needs Changes
          </NeuButton>
        </div>
        <textarea value={text} onChange={(e) => setText(e.target.value)}
          placeholder="Review notes..." rows={3} className={textareaCn()} />
        <NeuButton size="sm" loading={saving}
          onClick={() => save({ decision, decided_at: decision ? new Date().toISOString() : undefined })}
          className="!h-7">
          Save Review
        </NeuButton>
      </div>
    )
  }

  // filing
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <FileText className="h-4 w-4 text-[var(--sapphire)]" />
        <span className="text-xs font-medium text-[var(--text-muted)]">Filing Record</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] font-medium text-[var(--text-muted)] mb-0.5 block">Reference #</label>
          <input value={refNumber} onChange={(e) => setRefNumber(e.target.value)} placeholder="REF-001..." className={fieldCn()} />
        </div>
        <div>
          <label className="text-[10px] font-medium text-[var(--text-muted)] mb-0.5 block">Filing Date</label>
          <input type="date" value={filingDate} onChange={(e) => setFilingDate(e.target.value)} className={fieldCn()} />
        </div>
      </div>
      <div>
        <label className="text-[10px] font-medium text-[var(--text-muted)] mb-0.5 block">Location / Jurisdiction</label>
        <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Where filed..." className={fieldCn()} />
      </div>
      <textarea value={text} onChange={(e) => setText(e.target.value)}
        placeholder="Filing notes..." rows={2} className={textareaCn()} />
      <NeuButton size="sm" loading={saving}
        onClick={() => save({ reference_number: refNumber, filing_date: filingDate, location })}
        className="!h-7">
        Save Filing
      </NeuButton>
    </div>
  )
}
