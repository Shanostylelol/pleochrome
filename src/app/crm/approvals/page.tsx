'use client'

import { useState } from 'react'
import { ShieldCheck, Check, X, Clock, User } from 'lucide-react'
import { NeuCard, NeuButton, NeuBadge, NeuTextarea } from '@/components/ui'
import { trpc } from '@/lib/trpc'

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function ApprovalCard({ approval }: { approval: Record<string, unknown> }) {
  const [rejecting, setRejecting] = useState(false)
  const [reason, setReason] = useState('')

  const utils = trpc.useUtils()
  const decideMut = trpc.approvals.decide.useMutation({
    onSuccess: () => {
      utils.approvals.getMyQueue.invalidate()
      setRejecting(false)
      setReason('')
    },
  })

  const task = approval.tasks as {
    id: string
    title: string
    asset_id: string | null
    stage_id: string | null
    task_type: string | null
    assets: { name: string; reference_code: string } | null
  } | null

  const requester = approval.team_members as { full_name: string } | null
  const requestedAt = approval.requested_at as string | null

  const handleApprove = () => {
    decideMut.mutate({
      approvalId: approval.id as string,
      decision: 'approved',
    })
  }

  const handleReject = () => {
    decideMut.mutate({
      approvalId: approval.id as string,
      decision: 'rejected',
      reason: reason.trim() || undefined,
    })
  }

  return (
    <NeuCard variant="raised-sm" padding="md" className="space-y-3">
      {/* Task title + asset */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
            {task?.title ?? 'Untitled task'}
          </p>
          {task?.assets && (
            <p className="text-xs text-[var(--text-muted)] mt-0.5 truncate">
              {task.assets.name}
              {task.assets.reference_code && (
                <span
                  className="ml-1.5"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  ({task.assets.reference_code})
                </span>
              )}
            </p>
          )}
        </div>
        <NeuBadge color="amber" size="sm">Pending</NeuBadge>
      </div>

      {/* Requester + timestamp */}
      <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
        <span className="inline-flex items-center gap-1">
          <User className="h-3.5 w-3.5" />
          {requester?.full_name ?? 'Unknown'}
        </span>
        {requestedAt && (
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {timeAgo(requestedAt)}
          </span>
        )}
      </div>

      {/* Reject reason textarea (inline) */}
      {rejecting && (
        <NeuTextarea
          placeholder="Reason for rejection (optional)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="min-h-[60px]"
        />
      )}

      {/* Action buttons */}
      <div className="flex items-center gap-2 pt-1">
        {rejecting ? (
          <>
            <NeuButton
              variant="danger"
              size="sm"
              icon={<X className="h-4 w-4" />}
              loading={decideMut.isPending}
              onClick={handleReject}
            >
              Confirm Reject
            </NeuButton>
            <NeuButton
              variant="ghost"
              size="sm"
              onClick={() => { setRejecting(false); setReason('') }}
              disabled={decideMut.isPending}
            >
              Cancel
            </NeuButton>
          </>
        ) : (
          <>
            <NeuButton
              variant="success"
              size="sm"
              icon={<Check className="h-4 w-4" />}
              loading={decideMut.isPending}
              onClick={handleApprove}
            >
              Approve
            </NeuButton>
            <NeuButton
              variant="danger"
              size="sm"
              icon={<X className="h-4 w-4" />}
              disabled={decideMut.isPending}
              onClick={() => setRejecting(true)}
            >
              Reject
            </NeuButton>
          </>
        )}
      </div>
    </NeuCard>
  )
}

export default function ApprovalsPage() {
  const { data: queue = [], isLoading } = trpc.approvals.getMyQueue.useQuery()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1
          className="text-2xl font-semibold text-[var(--text-primary)]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Approvals
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          {queue.length} pending approval{queue.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Queue */}
      {isLoading ? (
        <p className="text-[var(--text-muted)] text-center py-10">Loading approvals...</p>
      ) : queue.length === 0 ? (
        <NeuCard variant="pressed" padding="lg" className="text-center">
          <ShieldCheck className="h-12 w-12 text-[var(--text-placeholder)] mx-auto mb-3" />
          <p className="text-sm text-[var(--text-muted)]">No pending approvals</p>
          <p className="text-xs text-[var(--text-placeholder)] mt-1">
            When someone requests your approval, it will appear here
          </p>
        </NeuCard>
      ) : (
        <div className="space-y-3">
          {queue.map((approval) => (
            <ApprovalCard
              key={(approval as Record<string, unknown>).id as string}
              approval={approval as Record<string, unknown>}
            />
          ))}
        </div>
      )}
    </div>
  )
}
