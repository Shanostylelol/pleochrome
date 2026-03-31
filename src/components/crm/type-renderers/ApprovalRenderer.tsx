'use client'

import { useState } from 'react'
import { ShieldCheck, UserCheck, Clock, XCircle, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NeuButton } from '@/components/ui/NeuButton'
import { NeuBadge } from '@/components/ui/NeuBadge'
import { NeuAvatar } from '@/components/ui/NeuAvatar'
import { useToast } from '@/components/ui/NeuToast'
import { trpc } from '@/lib/trpc'
import type { Subtask } from '../SubtaskChecklist'

interface ApprovalRendererProps {
  subtask: Subtask
  currentUserId: string
  onUpdate: (subtaskId: string, fields: { status?: string; notes?: string }) => void
}

const decisionColors: Record<string, 'gray' | 'amber' | 'chartreuse' | 'ruby'> = {
  pending: 'amber', approved: 'chartreuse', rejected: 'ruby',
}

export function ApprovalRenderer({ subtask, currentUserId, onUpdate }: ApprovalRendererProps) {
  const { toast } = useToast()
  const utils = trpc.useUtils()
  const [showRequest, setShowRequest] = useState(false)
  const [selectedApprovers, setSelectedApprovers] = useState<string[]>([])
  const [rejectReason, setRejectReason] = useState('')
  const [decidingId, setDecidingId] = useState<string | null>(null)

  const { data: approvals = [] } = trpc.approvals.listBySubtask.useQuery({ subtaskId: subtask.id })
  const { data: teamMembers = [] } = trpc.team.listActive.useQuery()

  const requestApproval = trpc.approvals.request.useMutation({
    onSuccess: () => {
      utils.approvals.listBySubtask.invalidate({ subtaskId: subtask.id })
      setShowRequest(false)
      setSelectedApprovers([])
      toast('Approval requested', 'success')
    },
    onError: (err) => toast(err.message, 'error'),
  })

  const decide = trpc.approvals.decide.useMutation({
    onSuccess: () => {
      utils.approvals.listBySubtask.invalidate({ subtaskId: subtask.id })
      setDecidingId(null)
      setRejectReason('')
      toast('Decision recorded', 'success')
    },
    onError: (err) => toast(err.message, 'error'),
  })

  function handleRequest() {
    if (selectedApprovers.length === 0) {
      toast('Select at least one approver', 'error')
      return
    }
    requestApproval.mutate({ subtaskId: subtask.id, approverIds: selectedApprovers })
  }

  function toggleApprover(id: string) {
    setSelectedApprovers((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    )
  }

  const typedApprovals = approvals as Array<{
    id: string; decision: string; approver_id: string; reason: string | null;
    team_members: { full_name: string; role: string } | null
  }>

  const hasApprovals = typedApprovals.length > 0

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-[var(--sapphire)]" />
        <span className="text-xs font-medium text-[var(--text-muted)]">Approval</span>
      </div>

      {/* Existing approvals */}
      {hasApprovals && (
        <div className="space-y-2">
          {typedApprovals.map((a) => (
            <div key={a.id} className={cn(
              'flex items-center gap-2 p-2 rounded-[var(--radius-sm)]',
              'bg-[var(--bg-surface)] border border-[var(--border)]'
            )}>
              <NeuAvatar name={a.team_members?.full_name ?? 'Unknown'} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-[var(--text-primary)] truncate">
                  {a.team_members?.full_name ?? 'Unknown'}
                </p>
                <p className="text-[10px] text-[var(--text-muted)]">{a.team_members?.role}</p>
              </div>
              <NeuBadge color={decisionColors[a.decision] ?? 'gray'} size="sm">
                {a.decision}
              </NeuBadge>

              {/* Current user can decide if pending */}
              {a.decision === 'pending' && a.approver_id === currentUserId && (
                <div className="flex gap-1">
                  <NeuButton size="sm" variant="ghost" loading={decide.isPending && decidingId === a.id}
                    icon={<CheckCircle className="h-3.5 w-3.5" />}
                    onClick={() => { setDecidingId(a.id); decide.mutate({ approvalId: a.id, decision: 'approved' }) }}
                    className="!h-6 !px-1.5 text-[var(--emerald)]">
                    Approve
                  </NeuButton>
                  {decidingId === a.id ? (
                    <div className="flex gap-1">
                      <input value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Reason..."
                        className={cn('h-6 text-[10px] rounded-[var(--radius-sm)] px-1.5 w-24',
                          'bg-[var(--bg-input)] text-[var(--text-primary)]',
                          'shadow-[var(--shadow-pressed)] border border-[var(--border)]')} />
                      <NeuButton size="sm" variant="ghost" loading={decide.isPending}
                        onClick={() => decide.mutate({ approvalId: a.id, decision: 'rejected', reason: rejectReason || undefined })}
                        className="!h-6 !px-1.5 text-[var(--ruby)]">
                        Reject
                      </NeuButton>
                    </div>
                  ) : (
                    <NeuButton size="sm" variant="ghost"
                      icon={<XCircle className="h-3.5 w-3.5" />}
                      onClick={() => setDecidingId(a.id)}
                      className="!h-6 !px-1.5 text-[var(--ruby)]">
                      Reject
                    </NeuButton>
                  )}
                </div>
              )}
              {a.reason && (
                <p className="text-[10px] text-[var(--text-muted)] italic">{a.reason}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Request approval */}
      {!hasApprovals && !showRequest && (
        <NeuButton size="sm" variant="ghost" icon={<UserCheck className="h-3.5 w-3.5" />}
          onClick={() => setShowRequest(true)} className="!h-7">
          Request Approval
        </NeuButton>
      )}

      {showRequest && (
        <div className="space-y-2 p-2 rounded-[var(--radius-sm)] bg-[var(--bg-surface)] border border-[var(--border)]">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Select Approvers
          </span>
          <div className="space-y-1">
            {(teamMembers as Array<{ id: string; full_name: string; role: string }>).map((m) => (
              <label key={m.id} className="flex items-center gap-2 text-xs cursor-pointer py-0.5">
                <input type="checkbox" checked={selectedApprovers.includes(m.id)}
                  onChange={() => toggleApprover(m.id)} className="accent-[var(--teal)]" />
                <span className="text-[var(--text-primary)]">{m.full_name}</span>
                <span className="text-[var(--text-muted)]">({m.role})</span>
              </label>
            ))}
          </div>
          <div className="flex gap-2">
            <NeuButton size="sm" variant="ghost" onClick={() => { setShowRequest(false); setSelectedApprovers([]) }}>
              Cancel
            </NeuButton>
            <NeuButton size="sm" loading={requestApproval.isPending} onClick={handleRequest}
              disabled={selectedApprovers.length === 0}>
              Request
            </NeuButton>
          </div>
        </div>
      )}

      {hasApprovals && (
        <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-muted)]">
          <Clock className="h-3 w-3" />
          {typedApprovals.filter(a => a.decision === 'approved').length}/{typedApprovals.length} approved
        </div>
      )}
    </div>
  )
}
