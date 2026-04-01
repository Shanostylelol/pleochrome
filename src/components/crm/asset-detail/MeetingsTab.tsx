'use client'

import { useState } from 'react'
import {
  Calendar, Plus, Clock, MapPin, Users, Video, Phone, User, ChevronDown,
} from 'lucide-react'
import {
  NeuCard, NeuBadge, NeuButton, NeuInput, NeuTextarea, NeuSelect, NeuModal, NeuSkeleton,
} from '@/components/ui'
import { trpc } from '@/lib/trpc'
import { MeetingDetail } from '@/components/crm/MeetingDetail'

/* eslint-disable @typescript-eslint/no-explicit-any */

const MEETING_TYPES = [
  { value: 'call', label: 'Call' },
  { value: 'video', label: 'Video' },
  { value: 'in_person', label: 'In Person' },
]

const typeIcons: Record<string, React.ReactNode> = {
  call: <Phone className="h-4 w-4" />,
  video: <Video className="h-4 w-4" />,
  in_person: <User className="h-4 w-4" />,
}

const typeColors: Record<string, 'teal' | 'amethyst' | 'sapphire' | 'gray'> = {
  call: 'teal',
  video: 'amethyst',
  in_person: 'sapphire',
}

interface MeetingsTabProps {
  assetId: string
}

export function MeetingsTab({ assetId }: MeetingsTabProps) {
  const [showCreate, setShowCreate] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const { data: meetings = [], isLoading } = trpc.meetings.list.useQuery({ assetId })

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">
          Meetings ({meetings.length})
        </h3>
        <NeuButton
          icon={<Plus className="h-4 w-4" />}
          size="sm"
          onClick={() => setShowCreate(true)}
        >
          New Meeting
        </NeuButton>
      </div>

      {/* List */}
      {isLoading ? (
        <NeuSkeleton variant="text" lines={3} />
      ) : meetings.length === 0 ? (
        <NeuCard variant="pressed" padding="lg" className="text-center">
          <Calendar className="h-10 w-10 text-[var(--text-placeholder)] mx-auto mb-3" />
          <p className="text-sm text-[var(--text-muted)]">No meetings for this asset</p>
          <p className="text-xs text-[var(--text-placeholder)] mt-1">
            Schedule a meeting to track discussions and action items
          </p>
        </NeuCard>
      ) : (
        <div className="space-y-3">
          {meetings.map((m: any) => (
            <div key={m.id}>
              {expandedId === m.id ? (
                <MeetingDetail
                  meeting={m}
                  onClose={() => setExpandedId(null)}
                />
              ) : (
                <MeetingCardCompact
                  meeting={m}
                  onClick={() => setExpandedId(m.id)}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create modal pre-filled with assetId */}
      <CreateAssetMeetingModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        assetId={assetId}
      />
    </div>
  )
}

function MeetingCardCompact({ meeting, onClick }: { meeting: any; onClick: () => void }) {
  const mType = meeting.meeting_type as string | null
  const attendees = (meeting.attendees as Array<{ name: string }>) ?? []

  return (
    <NeuCard variant="raised-sm" padding="md" hoverable className="cursor-pointer" onClick={onClick}>
      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-[var(--radius-md)] bg-[var(--teal-bg)] text-[var(--teal)] shrink-0">
          {mType && typeIcons[mType] ? typeIcons[mType] : <Calendar className="h-5 w-5" />}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[var(--text-primary)] truncate">
            {meeting.title}
          </p>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {new Date(meeting.meeting_date).toLocaleDateString('en-US', {
                weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
              })}
            </span>
            {meeting.duration_minutes && (
              <span className="text-xs text-[var(--text-muted)]">
                {meeting.duration_minutes}min
              </span>
            )}
            {meeting.location && (
              <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {meeting.location}
              </span>
            )}
            {attendees.length > 0 && (
              <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                <Users className="h-3 w-3" /> {attendees.length}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-1 shrink-0 items-center">
          {mType && (
            <NeuBadge color={typeColors[mType] ?? 'gray'} size="sm">
              {mType.replace(/_/g, ' ')}
            </NeuBadge>
          )}
          <ChevronDown className="h-4 w-4 text-[var(--text-muted)]" />
        </div>
      </div>
    </NeuCard>
  )
}

function CreateAssetMeetingModal({ open, onClose, assetId }: {
  open: boolean; onClose: () => void; assetId: string
}) {
  const [title, setTitle] = useState('')
  const [meetingDate, setMeetingDate] = useState('')
  const [duration, setDuration] = useState('')
  const [location, setLocation] = useState('')
  const [meetingType, setMeetingType] = useState('')
  const [agenda, setAgenda] = useState('')
  const utils = trpc.useUtils()

  const mutation = trpc.meetings.create.useMutation({
    onSuccess: () => {
      utils.meetings.list.invalidate()
      resetAndClose()
    },
  })

  const resetAndClose = () => {
    setTitle(''); setMeetingDate(''); setDuration('')
    setLocation(''); setMeetingType(''); setAgenda('')
    onClose()
  }

  const handleSubmit = () => {
    if (!title.trim() || !meetingDate) return
    mutation.mutate({
      title: title.trim(),
      meetingDate,
      durationMinutes: duration ? parseInt(duration) : undefined,
      location: location.trim() || undefined,
      meetingType: meetingType || undefined,
      assetId,
      agenda: agenda.trim() || undefined,
    })
  }

  return (
    <NeuModal open={open} onClose={resetAndClose} title="New Meeting" maxWidth="lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <NeuInput
          label="Title *"
          placeholder="Meeting title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <NeuInput
          label="Date *"
          type="date"
          value={meetingDate}
          onChange={(e) => setMeetingDate(e.target.value)}
        />
        <NeuInput
          label="Duration (minutes)"
          type="number"
          placeholder="e.g., 30"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
        <NeuInput
          label="Location"
          placeholder="Office, Zoom link, etc."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <NeuSelect
          label="Meeting Type"
          value={meetingType}
          onChange={(e) => setMeetingType(e.target.value)}
          placeholder="Select type..."
          options={MEETING_TYPES}
        />
      </div>
      <NeuTextarea
        label="Agenda"
        placeholder="Meeting agenda..."
        value={agenda}
        onChange={(e) => setAgenda(e.target.value)}
        rows={3}
        className="mt-3"
      />
      <div className="flex gap-3 pt-4">
        <NeuButton variant="ghost" onClick={resetAndClose} fullWidth>Cancel</NeuButton>
        <NeuButton
          onClick={handleSubmit}
          loading={mutation.isPending}
          disabled={!title.trim() || !meetingDate}
          fullWidth
        >
          Create Meeting
        </NeuButton>
      </div>
      {mutation.error && (
        <p className="text-sm text-[var(--ruby)] mt-2">{mutation.error.message}</p>
      )}
    </NeuModal>
  )
}
