'use client'

import { trpc } from '@/lib/trpc'
import { NeuCard } from '@/components/ui/NeuCard'
import { NeuBadge } from '@/components/ui/NeuBadge'
import { NeuAvatar } from '@/components/ui/NeuAvatar'
import { NeuProgress } from '@/components/ui/NeuProgress'
import { NeuSkeleton } from '@/components/ui/NeuSkeleton'

interface TeamWorkloadViewProps {
  onSelectMember?: (memberId: string) => void
}

export function TeamWorkloadView({ onSelectMember }: TeamWorkloadViewProps) {
  const { data: workload = [], isLoading } = trpc.tasks.getTeamWorkload.useQuery()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <NeuSkeleton variant="card" /><NeuSkeleton variant="card" /><NeuSkeleton variant="card" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {workload.map((member) => {
        const openTasks = member.todo + member.inProgress + member.blocked
        const pct = member.total > 0 ? Math.round((member.done / member.total) * 100) : 0
        return (
          <NeuCard key={member.memberId} variant="raised" padding="md"
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onSelectMember?.(member.memberId)}>
            <div className="flex items-center gap-3 mb-3">
              <NeuAvatar name={member.name} size="md" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{member.name}</p>
                {member.role && <p className="text-xs text-[var(--text-muted)]">{member.role}</p>}
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-3">
              {member.todo > 0 && <NeuBadge color="gray" size="sm">{member.todo} To Do</NeuBadge>}
              {member.inProgress > 0 && <NeuBadge color="teal" size="sm">{member.inProgress} Active</NeuBadge>}
              {member.blocked > 0 && <NeuBadge color="ruby" size="sm">{member.blocked} Blocked</NeuBadge>}
              {member.overdue > 0 && <NeuBadge color="amber" size="sm">{member.overdue} Overdue</NeuBadge>}
              {member.done > 0 && <NeuBadge color="chartreuse" size="sm">{member.done} Done</NeuBadge>}
            </div>

            <div className="flex items-center gap-2">
              <NeuProgress value={pct} color={pct === 100 ? 'emerald' : 'teal'} />
              <span className="text-[10px] text-[var(--text-muted)] shrink-0">{pct}%</span>
            </div>

            <p className="text-[10px] text-[var(--text-muted)] mt-1">{openTasks} open · {member.total} total</p>
          </NeuCard>
        )
      })}
    </div>
  )
}
