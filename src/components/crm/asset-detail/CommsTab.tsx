'use client'

import { useState } from 'react'
import {
  Mail, Phone, Video, Users, MessageSquare, ArrowUpRight, ArrowDownLeft,
  Plus, Clock, MapPin, Calendar, ChevronDown, User,
} from 'lucide-react'
import {
  NeuCard, NeuBadge, NeuButton, NeuInput, NeuTextarea, NeuSelect, NeuModal, NeuSkeleton,
} from '@/components/ui'
import { trpc } from '@/lib/trpc'
import { MeetingDetail } from '@/components/crm/MeetingDetail'

/* eslint-disable @typescript-eslint/no-explicit-any */

// ── Shared constants ────────────────────────────────────
type TabFilter = 'all' | 'meetings' | 'comms'

const COMM_TYPES = [
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'video_call', label: 'Video Call' },
  { value: 'in_person', label: 'In Person' },
  { value: 'text', label: 'Text' },
  { value: 'other', label: 'Other' },
]
const DIRECTIONS = [
  { value: 'inbound', label: 'Inbound' },
  { value: 'outbound', label: 'Outbound' },
]
const MEETING_TYPES = [
  { value: 'call', label: 'Call' },
  { value: 'video', label: 'Video' },
  { value: 'in_person', label: 'In Person' },
]

const commTypeColor: Record<string, 'teal' | 'amber' | 'amethyst' | 'sapphire' | 'gray'> = {
  email: 'teal', phone: 'amber', video_call: 'amethyst', in_person: 'sapphire', text: 'gray', other: 'gray',
}
const commTypeIcon: Record<string, React.ReactNode> = {
  email: <Mail className="h-4 w-4" />, phone: <Phone className="h-4 w-4" />,
  video_call: <Video className="h-4 w-4" />, in_person: <Users className="h-4 w-4" />,
  text: <MessageSquare className="h-4 w-4" />, other: <MessageSquare className="h-4 w-4" />,
}
const meetingTypeIcon: Record<string, React.ReactNode> = {
  call: <Phone className="h-4 w-4" />, video: <Video className="h-4 w-4" />, in_person: <User className="h-4 w-4" />,
}
const meetingTypeColor: Record<string, 'teal' | 'amethyst' | 'sapphire'> = {
  call: 'teal', video: 'amethyst', in_person: 'sapphire',
}

// ── Main Component ──────────────────────────────────────
interface CommsTabProps { assetId: string }

export function CommsTab({ assetId }: CommsTabProps) {
  const [filter, setFilter] = useState<TabFilter>('all')
  const [showLogComm, setShowLogComm] = useState(false)
  const [showNewMeeting, setShowNewMeeting] = useState(false)
  const [expandedMeetingId, setExpandedMeetingId] = useState<string | null>(null)

  const { data: comms = [], isLoading: commsLoading } = trpc.communications.listByAsset.useQuery({ assetId })
  const { data: meetings = [], isLoading: meetingsLoading } = trpc.meetings.list.useQuery({ assetId })

  const isLoading = commsLoading || meetingsLoading

  // Merge into unified timeline sorted by date desc
  const timeline = [
    ...meetings.map((m: any) => ({ kind: 'meeting' as const, date: new Date(m.meeting_date).getTime(), data: m })),
    ...comms.map((c: any) => ({ kind: 'comm' as const, date: new Date(c.performed_at).getTime(), data: c })),
  ]
    .filter(item => filter === 'all' || (filter === 'meetings' ? item.kind === 'meeting' : item.kind === 'comm'))
    .sort((a, b) => b.date - a.date)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">
            Communications ({timeline.length})
          </h3>
          <div className="flex items-center rounded-[var(--radius-sm)] shadow-[var(--shadow-pressed)] bg-[var(--bg-input)] p-0.5">
            {(['all', 'meetings', 'comms'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-2 py-0.5 text-[11px] rounded-[var(--radius-xs)] transition-all ${filter === f ? 'shadow-[var(--shadow-raised-sm)] bg-[var(--bg-surface)] text-[var(--text-primary)] font-semibold' : 'text-[var(--text-muted)]'}`}>
                {f === 'all' ? 'All' : f === 'meetings' ? 'Meetings' : 'Logs'}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <NeuButton icon={<Calendar className="h-3.5 w-3.5" />} size="sm" variant="ghost" onClick={() => setShowNewMeeting(true)}>Meeting</NeuButton>
          <NeuButton icon={<Plus className="h-3.5 w-3.5" />} size="sm" onClick={() => setShowLogComm(true)}>Log</NeuButton>
        </div>
      </div>

      {/* Timeline */}
      {isLoading ? (
        <NeuSkeleton variant="text" lines={4} />
      ) : timeline.length === 0 ? (
        <NeuCard variant="pressed" padding="lg" className="text-center">
          <MessageSquare className="h-10 w-10 text-[var(--text-placeholder)] mx-auto mb-3" />
          <p className="text-sm text-[var(--text-muted)]">No communications yet</p>
          <p className="text-xs text-[var(--text-placeholder)] mt-1">Log a call, email, or schedule a meeting</p>
        </NeuCard>
      ) : (
        <div className="space-y-2">
          {timeline.map(item => item.kind === 'meeting' ? (
            expandedMeetingId === item.data.id ? (
              <MeetingDetail key={item.data.id} meeting={item.data} onClose={() => setExpandedMeetingId(null)} />
            ) : (
              <MeetingRow key={item.data.id} meeting={item.data} onClick={() => setExpandedMeetingId(item.data.id)} />
            )
          ) : (
            <CommRow key={item.data.id} comm={item.data} />
          ))}
        </div>
      )}

      <LogCommModal open={showLogComm} onClose={() => setShowLogComm(false)} assetId={assetId} />
      <NewMeetingModal open={showNewMeeting} onClose={() => setShowNewMeeting(false)} assetId={assetId} />
    </div>
  )
}

// ── Meeting Row ─────────────────────────────────────────
function MeetingRow({ meeting, onClick }: { meeting: any; onClick: () => void }) {
  const mType = meeting.meeting_type as string | null
  const attendees = (meeting.attendees as Array<{ name: string }>) ?? []
  return (
    <NeuCard variant="raised-sm" padding="sm" hoverable className="cursor-pointer" onClick={onClick}>
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-[var(--radius-sm)] bg-[var(--bg-input)] shadow-[var(--shadow-pressed)] shrink-0">
          {mType && meetingTypeIcon[mType] ? meetingTypeIcon[mType] : <Calendar className="h-4 w-4 text-[var(--text-muted)]" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[var(--text-primary)] truncate">{meeting.title}</p>
          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[var(--text-muted)]">
            <span className="flex items-center gap-0.5"><Clock className="h-3 w-3" />{new Date(meeting.meeting_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            {meeting.duration_minutes && <span>{meeting.duration_minutes}m</span>}
            {meeting.location && <span className="flex items-center gap-0.5 truncate"><MapPin className="h-3 w-3" />{meeting.location}</span>}
            {attendees.length > 0 && <span className="flex items-center gap-0.5"><Users className="h-3 w-3" />{attendees.length}</span>}
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {mType && <NeuBadge color={meetingTypeColor[mType] ?? 'gray'} size="sm">{mType.replace(/_/g, ' ')}</NeuBadge>}
          <NeuBadge color="emerald" size="sm">meeting</NeuBadge>
          <ChevronDown className="h-3.5 w-3.5 text-[var(--text-muted)]" />
        </div>
      </div>
    </NeuCard>
  )
}

// ── Communication Row ───────────────────────────────────
function CommRow({ comm }: { comm: any }) {
  const commType = comm.comm_type as string
  const performer = comm.team_members as Record<string, unknown> | null
  const summary = (comm.summary as string) ?? ''
  const truncated = summary.length > 120 ? summary.slice(0, 120) + '...' : summary
  return (
    <NeuCard variant="raised-sm" padding="sm">
      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-[var(--radius-sm)] bg-[var(--bg-input)] shadow-[var(--shadow-pressed)] shrink-0">
          {commTypeIcon[commType] ?? <MessageSquare className="h-4 w-4 text-[var(--text-muted)]" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <NeuBadge color={commTypeColor[commType] ?? 'gray'} size="sm">{commType.replace(/_/g, ' ')}</NeuBadge>
            <NeuBadge color={comm.direction === 'inbound' ? 'chartreuse' : 'sapphire'} size="sm">
              {comm.direction === 'inbound' ? <><ArrowDownLeft className="h-3 w-3 mr-0.5 inline" />In</> : <><ArrowUpRight className="h-3 w-3 mr-0.5 inline" />Out</>}
            </NeuBadge>
            {comm.subject && <span className="text-xs font-medium text-[var(--text-primary)] truncate">{comm.subject}</span>}
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-1">{truncated}</p>
          <div className="flex items-center gap-2 mt-1 text-[11px] text-[var(--text-muted)]">
            <span className="flex items-center gap-0.5"><Clock className="h-3 w-3" />{new Date(comm.performed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            {comm.duration_minutes && <span>{comm.duration_minutes}m</span>}
            {performer?.full_name && <span>{performer.full_name as string}</span>}
          </div>
        </div>
      </div>
    </NeuCard>
  )
}

// ── Log Communication Modal ─────────────────────────────
function LogCommModal({ open, onClose, assetId }: { open: boolean; onClose: () => void; assetId: string }) {
  const [commType, setCommType] = useState('')
  const [direction, setDirection] = useState('outbound')
  const [subject, setSubject] = useState('')
  const [summary, setSummary] = useState('')
  const [duration, setDuration] = useState('')
  const utils = trpc.useUtils()
  const mutation = trpc.communications.create.useMutation({
    onSuccess: () => { utils.communications.listByAsset.invalidate({ assetId }); resetAndClose() },
  })
  const resetAndClose = () => { setCommType(''); setDirection('outbound'); setSubject(''); setSummary(''); setDuration(''); onClose() }
  const handleSubmit = () => {
    if (!commType || !summary.trim()) return
    mutation.mutate({
      assetId, commType: commType as any, direction: direction as any,
      subject: subject.trim() || undefined, summary: summary.trim(),
      durationMinutes: duration ? parseInt(duration) : undefined,
    })
  }
  return (
    <NeuModal open={open} onClose={resetAndClose} title="Log Communication" maxWidth="lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <NeuSelect label="Type *" value={commType} onChange={e => setCommType(e.target.value)} placeholder="Select type..." options={COMM_TYPES} />
        <NeuSelect label="Direction" value={direction} onChange={e => setDirection(e.target.value)} options={DIRECTIONS} />
        <NeuInput label="Subject" placeholder="Brief subject" value={subject} onChange={e => setSubject(e.target.value)} />
        <NeuInput label="Duration (min)" type="number" placeholder="15" value={duration} onChange={e => setDuration(e.target.value)} />
      </div>
      <NeuTextarea label="Summary *" placeholder="What was discussed..." value={summary} onChange={e => setSummary(e.target.value)} rows={3} className="mt-3" />
      <div className="flex gap-3 pt-4">
        <NeuButton variant="ghost" onClick={resetAndClose} fullWidth>Cancel</NeuButton>
        <NeuButton onClick={handleSubmit} loading={mutation.isPending} disabled={!commType || !summary.trim()} fullWidth>Log</NeuButton>
      </div>
      {mutation.error && <p className="text-sm text-[var(--ruby)] mt-2">{mutation.error.message}</p>}
    </NeuModal>
  )
}

// ── New Meeting Modal ───────────────────────────────────
function NewMeetingModal({ open, onClose, assetId }: { open: boolean; onClose: () => void; assetId: string }) {
  const [title, setTitle] = useState('')
  const [meetingDate, setMeetingDate] = useState('')
  const [duration, setDuration] = useState('')
  const [location, setLocation] = useState('')
  const [meetingType, setMeetingType] = useState('')
  const [agenda, setAgenda] = useState('')
  const [attendeesText, setAttendeesText] = useState('')
  const utils = trpc.useUtils()
  const mutation = trpc.meetings.create.useMutation({
    onSuccess: () => { utils.meetings.list.invalidate(); resetAndClose() },
  })
  const resetAndClose = () => { setTitle(''); setMeetingDate(''); setDuration(''); setLocation(''); setMeetingType(''); setAgenda(''); setAttendeesText(''); onClose() }
  const handleSubmit = () => {
    if (!title.trim() || !meetingDate) return
    mutation.mutate({
      title: title.trim(), meetingDate,
      durationMinutes: duration ? parseInt(duration) : undefined,
      location: location.trim() || undefined, meetingType: meetingType || undefined,
      assetId, agenda: agenda.trim() || undefined,
      attendees: attendeesText.trim() ? attendeesText.split('\n').map(s => s.trim()).filter(Boolean).map(name => ({ name })) : undefined,
    })
  }
  return (
    <NeuModal open={open} onClose={resetAndClose} title="New Meeting" maxWidth="lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <NeuInput label="Title *" placeholder="Meeting title" value={title} onChange={e => setTitle(e.target.value)} />
        <NeuInput label="Date & Time *" type="datetime-local" value={meetingDate} onChange={e => setMeetingDate(e.target.value)} />
        <NeuInput label="Duration (min)" type="number" placeholder="30" value={duration} onChange={e => setDuration(e.target.value)} />
        <NeuInput label="Location" placeholder="Office, Zoom, etc." value={location} onChange={e => setLocation(e.target.value)} />
        <NeuSelect label="Type" value={meetingType} onChange={e => setMeetingType(e.target.value)} placeholder="Select type..." options={MEETING_TYPES} />
      </div>
      <NeuTextarea label="Attendees (one per line)" placeholder={'Shane Pierson\nDavid Smith'} value={attendeesText} onChange={e => setAttendeesText(e.target.value)} rows={2} className="mt-3" />
      <NeuTextarea label="Agenda" placeholder="Meeting agenda..." value={agenda} onChange={e => setAgenda(e.target.value)} rows={3} className="mt-3" />
      <div className="flex gap-3 pt-4">
        <NeuButton variant="ghost" onClick={resetAndClose} fullWidth>Cancel</NeuButton>
        <NeuButton onClick={handleSubmit} loading={mutation.isPending} disabled={!title.trim() || !meetingDate} fullWidth>Create Meeting</NeuButton>
      </div>
      {mutation.error && <p className="text-sm text-[var(--ruby)] mt-2">{mutation.error.message}</p>}
    </NeuModal>
  )
}
