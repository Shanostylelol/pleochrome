'use client'

import { useState } from 'react'
import { CheckSquare, Plus, Check } from 'lucide-react'
import { NeuCard, NeuBadge, NeuButton, NeuTabs } from '@/components/ui'
import { trpc } from '@/lib/trpc'

const priorityMap: Record<string, 'ruby' | 'amber' | 'teal' | 'gray'> = {
  blocker: 'ruby', urgent: 'ruby', high: 'amber', medium: 'teal', low: 'gray',
}

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'todo', label: 'To Do' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'done', label: 'Done' },
]

export default function TasksPage() {
  const [filter, setFilter] = useState('all')
  const { data: tasks = [], isLoading } = trpc.tasks.list.useQuery(
    filter !== 'all' ? { status: filter } : undefined
  )
  const utils = trpc.useUtils()
  const completeMut = trpc.tasks.complete.useMutation({
    onSuccess: () => utils.tasks.list.invalidate(),
  })

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
            Task Dashboard
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">{tasks.length} tasks</p>
        </div>
        <NeuButton icon={<Plus className="h-4 w-4" />}>
          <span className="hidden sm:inline">New Task</span>
        </NeuButton>
      </div>

      <NeuTabs tabs={TABS} activeTab={filter} onTabChange={setFilter} />

      {isLoading ? (
        <p className="text-[var(--text-muted)] text-center py-10">Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <NeuCard variant="pressed" padding="lg" className="text-center">
          <CheckSquare className="h-12 w-12 text-[var(--text-placeholder)] mx-auto mb-3" />
          <p className="text-sm text-[var(--text-muted)]">No tasks found</p>
        </NeuCard>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => (
            <NeuCard key={task.id} variant="raised-sm" padding="sm" className="flex items-center gap-3">
              <button
                onClick={() => task.status !== 'done' && completeMut.mutate({ taskId: task.id })}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                  task.status === 'done'
                    ? 'bg-[var(--chartreuse)] border-[var(--chartreuse)] text-white'
                    : 'border-[var(--border)] hover:border-[var(--teal)]'
                }`}
              >
                {task.status === 'done' && <Check className="h-3.5 w-3.5" />}
              </button>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${task.status === 'done' ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'}`}>
                  {task.title}
                </p>
                <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mt-0.5">
                  {task.due_date && <span>Due {new Date(task.due_date).toLocaleDateString()}</span>}
                  {(task.assets as { name: string } | null)?.name && (
                    <span>&middot; {(task.assets as { name: string }).name}</span>
                  )}
                </div>
              </div>
              <NeuBadge color={priorityMap[task.priority] ?? 'gray'} size="sm">{task.priority}</NeuBadge>
            </NeuCard>
          ))}
        </div>
      )}
    </div>
  )
}
