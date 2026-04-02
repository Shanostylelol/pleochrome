'use client'

import { useState } from 'react'
import {
  ChevronUp, Clock, MapPin, Users, FileText, Trash2, Check, X,
} from 'lucide-react'
import { NeuCard, NeuBadge, NeuButton, NeuTextarea } from '@/components/ui'
import { trpc } from '@/lib/trpc'
import { ActionItemsSection, type ActionItem } from './ActionItemsSection'

/* eslint-disable @typescript-eslint/no-explicit-any */

// ── Types ────────────────────────────────────────────────
interface MeetingDetailProps {
  meeting: any
  onClose: () => void
}

const typeColors: Record<string, 'teal' | 'amethyst' | 'sapphire' | 'gray'> = {
  call: 'teal',
  video: 'amethyst',
  in_person: 'sapphire',
}

// ── Main Component ───────────────────────────────────────
export function MeetingDetail({ meeting, onClose }: MeetingDetailProps) {
  const [summary, setSummary] = useState(meeting.summary ?? '')
  const [transcript, setTranscript] = useState(meeting.transcript ?? '')
  const [keyDecisions, setKeyDecisions] = useState(meeting.key_decisions ?? '')
  const [saving, setSaving] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const utils = trpc.useUtils()

  const initialItems = (meeting.action_items as ActionItem[]) ?? []
  const [actionItems, setActionItems] = useState<ActionItem[]>(initialItems)

  const completeMut = trpc.meetings.complete.useMutation({
    onSuccess: () => {
      utils.meetings.list.invalidate()
      setSaving(false)
    },
    onError: () => setSaving(false),
  })

  const deleteMut = trpc.meetings.delete.useMutation({
    onSuccess: () => {
      utils.meetings.list.invalidate()
      onClose()
    },
  })

  const handleSave = () => {
    setSaving(true)
    completeMut.mutate({
      meetingId: meeting.id,
      summary: summary || 'No summary',
      transcript: transcript || undefined,
      keyDecisions: keyDecisions || undefined,
      actionItems,
    })
  }

  const attendees = (meeting.attendees as Array<{ name: string; role?: string }>) ?? []

  return (
    <NeuCard variant="raised" padding="md" className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-semibold text-[var(--text-primary)]">{meeting.title}</h3>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {new Date(meeting.meeting_date).toLocaleDateString('en-US', {
                weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
              })}
              {(() => {
                const d = new Date(meeting.meeting_date)
                const h = d.getHours(), m = d.getMinutes()
                if (h !== 0 || m !== 0) {
                  return ` at ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
                }
                return ''
              })()}
              {meeting.duration_minutes && ` · ${meeting.duration_minutes}min`}
            </span>
            {meeting.location && (
              <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {meeting.location}
              </span>
            )}
            {meeting.meeting_type && (
              <NeuBadge color={typeColors[meeting.meeting_type] ?? 'gray'} size="sm">
                {meeting.meeting_type}
              </NeuBadge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {!showDeleteConfirm ? (
            <NeuButton
              variant="ghost"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
              className="!text-[var(--ruby)]"
              title="Delete meeting"
            >
              <Trash2 className="h-4 w-4" />
            </NeuButton>
          ) : (
            <div className="flex items-center gap-1">
              <span className="text-xs text-[var(--ruby)] mr-1">Delete?</span>
              <NeuButton
                variant="ghost"
                size="sm"
                onClick={() => deleteMut.mutate({ meetingId: meeting.id })}
                loading={deleteMut.isPending}
                className="!text-[var(--ruby)]"
                title="Confirm delete"
              >
                <Check className="h-4 w-4" />
              </NeuButton>
              <NeuButton
                variant="ghost"
                size="sm"
                onClick={() => setShowDeleteConfirm(false)}
                title="Cancel"
              >
                <X className="h-4 w-4" />
              </NeuButton>
            </div>
          )}
          <NeuButton variant="ghost" size="sm" onClick={onClose}>
            <ChevronUp className="h-4 w-4" />
          </NeuButton>
        </div>
      </div>

      {/* Attendees */}
      {attendees.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <Users className="h-3.5 w-3.5 text-[var(--text-muted)]" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Attendees ({attendees.length})
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {attendees.map((a, i) => (
              <NeuBadge key={i} color="gray" size="sm">
                {a.name}{a.role ? ` (${a.role})` : ''}
              </NeuBadge>
            ))}
          </div>
        </div>
      )}

      {/* Agenda */}
      {meeting.agenda && (
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <FileText className="h-3.5 w-3.5 text-[var(--text-muted)]" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Agenda</span>
          </div>
          <p className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap">{meeting.agenda}</p>
        </div>
      )}

      {/* Summary */}
      <NeuTextarea
        label="Summary"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        rows={3}
        placeholder="Meeting summary..."
      />

      {/* Transcript */}
      <NeuTextarea
        label="Transcript"
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        rows={4}
        placeholder="Meeting transcript or notes..."
      />

      {/* Key Decisions */}
      <NeuTextarea
        label="Key Decisions"
        value={keyDecisions}
        onChange={(e) => setKeyDecisions(e.target.value)}
        rows={2}
        placeholder="Key decisions made..."
      />

      {/* Action Items */}
      <ActionItemsSection
        meetingId={meeting.id}
        assetId={meeting.asset_id}
        actionItems={actionItems}
        onItemsChange={setActionItems}
      />

      {/* Save */}
      <div className="flex gap-3 pt-2">
        <NeuButton variant="ghost" onClick={onClose} fullWidth>Close</NeuButton>
        <NeuButton onClick={handleSave} loading={saving} fullWidth>
          Save Meeting Notes
        </NeuButton>
      </div>
      {completeMut.error && (
        <p className="text-sm text-[var(--ruby)]">{completeMut.error.message}</p>
      )}
      {deleteMut.error && (
        <p className="text-sm text-[var(--ruby)]">{deleteMut.error.message}</p>
      )}
    </NeuCard>
  )
}
