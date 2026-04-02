'use client'

import { useState } from 'react'
import { Calendar, Plus, Clock, MapPin, Users, Video, Phone, User, Download, LayoutList, CalendarDays } from 'lucide-react'
import { exportCSV } from '@/lib/csv-export'
import {
  NeuCard, NeuBadge, NeuButton, NeuInput, NeuTextarea, NeuSelect, NeuModal,
} from '@/components/ui'
import { trpc } from '@/lib/trpc'
import { MeetingDetail } from '@/components/crm/MeetingDetail'
import { CalendarView } from '@/components/crm/CalendarView'
import { ListPageSkeleton } from '@/components/crm/skeletons'

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

export default function MeetingsPage() {
  const [showCreate, setShowCreate] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [view, setView] = useState<'list' | 'calendar'>('list')
  const [typeFilter, setTypeFilter] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const queryInput = {
    ...(typeFilter ? { meetingType: typeFilter } : {}),
    ...(dateFrom ? { dateFrom } : {}),
    ...(dateTo ? { dateTo } : {}),
  }
  const { data: meetings = [], isLoading } = trpc.meetings.list.useQuery(Object.keys(queryInput).length ? queryInput : undefined)
  const { data: tasksWithDates = [] } = trpc.tasks.list.useQuery(undefined, { select: (tasks) => tasks.filter((t) => !!t.due_date) })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-semibold text-[var(--text-primary)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Meetings
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            {meetings.length} meeting{meetings.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 rounded-[var(--radius-md)] bg-[var(--bg-body)] shadow-[var(--shadow-pressed)]">
            <button onClick={() => setView('list')} title="List view"
              className={`p-1.5 rounded-[var(--radius-sm)] transition-all ${view === 'list' ? 'bg-[var(--bg-surface)] shadow-[var(--shadow-raised-sm)] text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>
              <LayoutList className="h-4 w-4" />
            </button>
            <button onClick={() => setView('calendar')} title="Calendar view"
              className={`p-1.5 rounded-[var(--radius-sm)] transition-all ${view === 'calendar' ? 'bg-[var(--bg-surface)] shadow-[var(--shadow-raised-sm)] text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>
              <CalendarDays className="h-4 w-4" />
            </button>
          </div>
          <NeuButton variant="ghost" icon={<Download className="h-4 w-4" />} size="sm"
            onClick={() => exportCSV('meetings.csv', [
              { key: 'title', label: 'Title' }, { key: 'meeting_type', label: 'Type' },
              { key: 'meeting_date', label: 'Date' }, { key: 'location', label: 'Location' },
            ], meetings as Record<string, unknown>[])}>
            <span className="hidden sm:inline">CSV</span>
          </NeuButton>
          <NeuButton icon={<Plus className="h-4 w-4" />} onClick={() => setShowCreate(true)}>
            <span className="hidden sm:inline">New Meeting</span>
          </NeuButton>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <NeuSelect value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="!w-36">
          <option value="">All Types</option>
          {MEETING_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </NeuSelect>
        <NeuInput type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="!w-36" />
        <NeuInput type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="!w-36" />
        {(typeFilter || dateFrom || dateTo) && (
          <button onClick={() => { setTypeFilter(''); setDateFrom(''); setDateTo('') }}
            className="text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">
            Clear filters ×
          </button>
        )}
      </div>

      {/* Calendar or list */}
      {view === 'calendar' ? (
        isLoading ? <ListPageSkeleton /> : <CalendarView meetings={meetings} tasks={tasksWithDates as { id: string; title: string; due_date: string; asset_id: string; status: string }[]} />
      ) : null}

      {/* Meeting list */}
      {view === 'list' && (isLoading ? (
        <ListPageSkeleton />
      ) : meetings.length === 0 ? (
        <NeuCard variant="pressed" padding="lg" className="text-center">
          <Calendar className="h-12 w-12 text-[var(--text-placeholder)] mx-auto mb-3" />
          <p className="text-sm text-[var(--text-muted)]">No meetings yet</p>
          <p className="text-xs text-[var(--text-placeholder)] mt-1">
            Schedule your first meeting to get started
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
                <MeetingCard
                  meeting={m}
                  onClick={() => setExpandedId(m.id)}
                />
              )}
            </div>
          ))}
        </div>
      ))}

      {/* Create modal */}
      <CreateMeetingModal open={showCreate} onClose={() => setShowCreate(false)} />
    </div>
  )
}

function MeetingCard({ meeting, onClick }: { meeting: any; onClick: () => void }) {
  const mType = meeting.meeting_type as string | null
  const attendees = (meeting.attendees as Array<{ name: string }>) ?? []
  const assetName = (meeting.assets as { name: string } | null)?.name
  const partnerName = (meeting.partners as { name: string } | null)?.name

  return (
    <NeuCard
      variant="raised-sm"
      padding="md"
      hoverable
      className="cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        {/* Type icon */}
        <div className="flex items-center justify-center w-10 h-10 rounded-[var(--radius-md)] bg-[var(--teal-bg)] text-[var(--teal)] shrink-0">
          {mType && typeIcons[mType] ? typeIcons[mType] : <Calendar className="h-5 w-5" />}
        </div>

        {/* Content */}
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

        {/* Tags */}
        <div className="flex gap-1 shrink-0 flex-wrap justify-end">
          {mType && (
            <NeuBadge color={typeColors[mType] ?? 'gray'} size="sm">
              {mType.replace(/_/g, ' ')}
            </NeuBadge>
          )}
          {assetName && <NeuBadge color="teal" size="sm">{assetName}</NeuBadge>}
          {partnerName && <NeuBadge color="amethyst" size="sm">{partnerName}</NeuBadge>}
        </div>
      </div>
    </NeuCard>
  )
}

function CreateMeetingModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [title, setTitle] = useState('')
  const [meetingDate, setMeetingDate] = useState('')
  const [duration, setDuration] = useState('')
  const [location, setLocation] = useState('')
  const [meetingType, setMeetingType] = useState('')
  const [assetId, setAssetId] = useState('')
  const [partnerId, setPartnerId] = useState('')
  const [agenda, setAgenda] = useState('')
  const [attendeesText, setAttendeesText] = useState('')
  const [durationError, setDurationError] = useState('')
  const utils = trpc.useUtils()

  const validateDuration = (val: string) => {
    if (val) {
      const num = parseInt(val, 10)
      if (isNaN(num) || num <= 0 || !Number.isInteger(Number(val))) {
        setDurationError('Duration must be a positive whole number')
      } else {
        setDurationError('')
      }
    } else {
      setDurationError('')
    }
  }

  const hasErrors = !!durationError

  const { data: assets = [] } = trpc.assets.list.useQuery(undefined, { enabled: open })
  const { data: partners = [] } = trpc.partners.list.useQuery(undefined, { enabled: open })

  const mutation = trpc.meetings.create.useMutation({
    onSuccess: () => {
      utils.meetings.list.invalidate()
      resetAndClose()
    },
  })

  const resetAndClose = () => {
    setTitle(''); setMeetingDate(''); setDuration(''); setLocation('')
    setMeetingType(''); setAssetId(''); setPartnerId(''); setAgenda(''); setAttendeesText('')
    setDurationError('')
    onClose()
  }

  const handleSubmit = () => {
    if (!title.trim() || !meetingDate || hasErrors) return
    mutation.mutate({
      title: title.trim(),
      meetingDate,
      durationMinutes: duration ? parseInt(duration) : undefined,
      location: location.trim() || undefined,
      meetingType: meetingType || undefined,
      assetId: assetId || undefined,
      partnerId: partnerId || undefined,
      agenda: agenda.trim() || undefined,
      attendees: attendeesText.trim()
        ? attendeesText.split('\n').map(s => s.trim()).filter(Boolean).map(name => ({ name }))
        : undefined,
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
          onChange={(e) => { setDuration(e.target.value); validateDuration(e.target.value) }}
          onBlur={() => validateDuration(duration)}
          min={1}
          error={durationError || undefined}
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
        <NeuSelect
          label="Asset"
          value={assetId}
          onChange={(e) => setAssetId(e.target.value)}
          placeholder="Select asset (optional)..."
          options={(assets as any[]).map((a) => ({
            value: a.id,
            label: `${a.reference_code} - ${a.name}`,
          }))}
        />
        <NeuSelect
          label="Partner"
          value={partnerId}
          onChange={(e) => setPartnerId(e.target.value)}
          placeholder="Select partner (optional)..."
          options={(partners as any[]).map((p) => ({
            value: p.id,
            label: p.name,
          }))}
        />
      </div>
      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
        <NeuTextarea
          label="Attendees (one per line)"
          placeholder="Shane Pierson&#10;David Smith&#10;..."
          value={attendeesText}
          onChange={(e) => setAttendeesText(e.target.value)}
          rows={3}
        />
        <NeuTextarea
          label="Agenda"
          placeholder="Meeting agenda..."
          value={agenda}
          onChange={(e) => setAgenda(e.target.value)}
          rows={3}
        />
      </div>
      <div className="flex gap-3 pt-4">
        <NeuButton variant="ghost" onClick={resetAndClose} fullWidth>Cancel</NeuButton>
        <NeuButton
          onClick={handleSubmit}
          loading={mutation.isPending}
          disabled={!title.trim() || !meetingDate || hasErrors}
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
