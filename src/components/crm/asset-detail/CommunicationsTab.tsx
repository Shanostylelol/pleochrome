'use client'

import { useState } from 'react'
import {
  Mail, Phone, Video, Users, MessageSquare, ArrowUpRight, ArrowDownLeft, Plus, Clock,
} from 'lucide-react'
import {
  NeuCard, NeuBadge, NeuButton, NeuInput, NeuTextarea, NeuSelect, NeuModal,
} from '@/components/ui'
import { trpc } from '@/lib/trpc'

/* eslint-disable @typescript-eslint/no-explicit-any */

// ── Constants ────────────────────────────────────────────
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

const typeBadgeColor: Record<string, 'teal' | 'amber' | 'amethyst' | 'sapphire' | 'gray'> = {
  email: 'teal',
  phone: 'amber',
  video_call: 'amethyst',
  in_person: 'sapphire',
  text: 'gray',
  other: 'gray',
}

const typeIcons: Record<string, React.ReactNode> = {
  email: <Mail className="h-4 w-4" />,
  phone: <Phone className="h-4 w-4" />,
  video_call: <Video className="h-4 w-4" />,
  in_person: <Users className="h-4 w-4" />,
  text: <MessageSquare className="h-4 w-4" />,
  other: <MessageSquare className="h-4 w-4" />,
}

// ── Props ────────────────────────────────────────────────
interface CommunicationsTabProps {
  assetId: string
}

// ── Component ────────────────────────────────────────────
export function CommunicationsTab({ assetId }: CommunicationsTabProps) {
  const [showCreate, setShowCreate] = useState(false)
  const { data: comms = [], isLoading } = trpc.communications.listByAsset.useQuery({ assetId })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">
          Communications ({comms.length})
        </h3>
        <NeuButton icon={<Plus className="h-4 w-4" />} size="sm" onClick={() => setShowCreate(true)}>
          Log Communication
        </NeuButton>
      </div>

      {isLoading ? (
        <p className="text-[var(--text-muted)] text-center py-10">Loading communications...</p>
      ) : comms.length === 0 ? (
        <NeuCard variant="pressed" padding="lg" className="text-center">
          <MessageSquare className="h-10 w-10 text-[var(--text-placeholder)] mx-auto mb-3" />
          <p className="text-sm text-[var(--text-muted)]">No communications logged for this asset</p>
          <p className="text-xs text-[var(--text-placeholder)] mt-1">
            Log a call, email, or meeting to keep a record
          </p>
        </NeuCard>
      ) : (
        <div className="space-y-3">
          {comms.map((c: any) => (
            <CommCard key={c.id} comm={c} />
          ))}
        </div>
      )}

      <LogCommModal open={showCreate} onClose={() => setShowCreate(false)} assetId={assetId} />
    </div>
  )
}

// ── Card ─────────────────────────────────────────────────
function CommCard({ comm }: { comm: any }) {
  const commType = comm.comm_type as string
  const performer = comm.team_members as Record<string, unknown> | null
  const summary = (comm.summary as string) ?? ''
  const truncated = summary.length > 160 ? summary.slice(0, 160) + '...' : summary

  return (
    <NeuCard variant="raised-sm" padding="md">
      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-[var(--radius-md)] shrink-0"
          style={{ background: `color-mix(in srgb, var(--${typeBadgeColor[commType] ?? 'gray'}) 15%, transparent)` }}>
          {typeIcons[commType] ?? <MessageSquare className="h-4 w-4" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <NeuBadge color={typeBadgeColor[commType] ?? 'gray'} size="sm">
              {commType.replace(/_/g, ' ')}
            </NeuBadge>
            <NeuBadge color={comm.direction === 'inbound' ? 'chartreuse' : 'sapphire'} size="sm">
              {comm.direction === 'inbound'
                ? <><ArrowDownLeft className="h-3 w-3 mr-0.5 inline" />In</>
                : <><ArrowUpRight className="h-3 w-3 mr-0.5 inline" />Out</>}
            </NeuBadge>
          </div>
          {comm.subject && (
            <p className="text-sm font-medium text-[var(--text-primary)] mt-1.5 truncate">
              {comm.subject}
            </p>
          )}
          <p className="text-sm text-[var(--text-secondary)] mt-1">{truncated}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-[var(--text-muted)]">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {new Date(comm.performed_at).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric',
              })}
            </span>
            {comm.duration_minutes && <span>{comm.duration_minutes}min</span>}
            {performer?.full_name && <span>{performer.full_name as string}</span>}
          </div>
        </div>
      </div>
    </NeuCard>
  )
}

// ── Create Modal ─────────────────────────────────────────
function LogCommModal({ open, onClose, assetId }: {
  open: boolean; onClose: () => void; assetId: string
}) {
  const [commType, setCommType] = useState('')
  const [direction, setDirection] = useState('outbound')
  const [subject, setSubject] = useState('')
  const [summary, setSummary] = useState('')
  const [duration, setDuration] = useState('')
  const utils = trpc.useUtils()

  const mutation = trpc.communications.create.useMutation({
    onSuccess: () => {
      utils.communications.listByAsset.invalidate({ assetId })
      resetAndClose()
    },
  })

  const resetAndClose = () => {
    setCommType(''); setDirection('outbound'); setSubject('')
    setSummary(''); setDuration('')
    onClose()
  }

  const handleSubmit = () => {
    if (!commType || !summary.trim()) return
    mutation.mutate({
      assetId,
      commType: commType as 'email' | 'phone' | 'video_call' | 'in_person' | 'text' | 'other',
      direction: direction as 'inbound' | 'outbound',
      subject: subject.trim() || undefined,
      summary: summary.trim(),
      durationMinutes: duration ? parseInt(duration) : undefined,
    })
  }

  return (
    <NeuModal open={open} onClose={resetAndClose} title="Log Communication" maxWidth="lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <NeuSelect
          label="Type *"
          value={commType}
          onChange={(e) => setCommType(e.target.value)}
          placeholder="Select type..."
          options={COMM_TYPES}
        />
        <NeuSelect
          label="Direction"
          value={direction}
          onChange={(e) => setDirection(e.target.value)}
          options={DIRECTIONS}
        />
        <NeuInput
          label="Subject"
          placeholder="Brief subject line"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <NeuInput
          label="Duration (minutes)"
          type="number"
          placeholder="e.g., 15"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
      </div>
      <NeuTextarea
        label="Summary *"
        placeholder="What was discussed..."
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        rows={4}
        className="mt-3"
      />
      <div className="flex gap-3 pt-4">
        <NeuButton variant="ghost" onClick={resetAndClose} fullWidth>Cancel</NeuButton>
        <NeuButton
          onClick={handleSubmit}
          loading={mutation.isPending}
          disabled={!commType || !summary.trim()}
          fullWidth
        >
          Log Communication
        </NeuButton>
      </div>
      {mutation.error && (
        <p className="text-sm text-[var(--ruby)] mt-2">{mutation.error.message}</p>
      )}
    </NeuModal>
  )
}
