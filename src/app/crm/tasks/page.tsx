'use client'

import { useState } from 'react'
import { CheckSquare, Plus, LayoutGrid, List } from 'lucide-react'
import { NeuCard, NeuButton, NeuTabs, NeuInput, NeuTextarea, NeuSelect, NeuModal } from '@/components/ui'
import { TASK_TYPES, type TaskTypeKey } from '@/lib/constants'
import { trpc } from '@/lib/trpc'
import { TaskKanbanView } from '@/components/crm/TaskKanbanView'
import { TaskListView } from '@/components/crm/TaskListView'
import { TeamWorkloadView } from '@/components/crm/TeamWorkloadView'

const STATUS_TABS = [
  { id: 'all', label: 'All' },
  { id: 'mine', label: 'My Tasks' },
  { id: 'team', label: 'Team' },
  { id: 'todo', label: 'To Do' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'blocked', label: 'Blocked' },
  { id: 'done', label: 'Done' },
]

const TASK_TYPE_OPTIONS = Object.entries(TASK_TYPES).map(([key, cfg]) => ({
  value: key,
  label: cfg.label,
}))

export default function TasksPage() {
  const [filter, setFilter] = useState('all')
  const [view, setView] = useState<'kanban' | 'list'>('kanban')
  const [showCreate, setShowCreate] = useState(false)
  const utils = trpc.useUtils()

  const isMyTasks = filter === 'mine'
  const statusFilter = !isMyTasks && filter !== 'all' ? filter : undefined

  const { data: allTasks = [], isLoading: loadingAll } = trpc.tasks.list.useQuery(
    statusFilter ? { status: statusFilter } : undefined,
    { enabled: !isMyTasks },
  )
  const { data: myTasks = [], isLoading: loadingMy } = trpc.tasks.getMyTasks.useQuery(
    undefined,
    { enabled: isMyTasks },
  )

  const updateStatus = trpc.tasks.updateStatus.useMutation({
    onSuccess: () => { utils.tasks.list.invalidate(); utils.tasks.getMyTasks.invalidate() },
  })
  const completeTask = trpc.tasks.complete.useMutation({
    onSuccess: () => { utils.tasks.list.invalidate(); utils.tasks.getMyTasks.invalidate() },
  })

  const handleUpdateStatus = (taskId: string, status: string) =>
    updateStatus.mutate({ taskId, status: status as 'todo' | 'in_progress' | 'blocked' | 'pending_approval' | 'approved' | 'rejected' | 'done' | 'cancelled' })
  const handleComplete = (taskId: string) => completeTask.mutate({ taskId })

  const tasks = isMyTasks ? myTasks : allTasks
  const isLoading = isMyTasks ? loadingMy : loadingAll

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-semibold text-[var(--text-primary)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Task Dashboard
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            {tasks.length} task{tasks.length !== 1 ? 's' : ''}
          </p>
        </div>
        <NeuButton icon={<Plus className="h-4 w-4" />} onClick={() => setShowCreate(true)}>
          <span className="hidden sm:inline">New Task</span>
        </NeuButton>
      </div>

      {/* Controls row: filters + view toggle */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <NeuTabs tabs={STATUS_TABS} activeTab={filter} onTabChange={setFilter} size="sm" />
        <div className="flex gap-1 p-1 rounded-[var(--radius-md)] bg-[var(--bg-body)] shadow-[var(--shadow-pressed)]">
          <button
            onClick={() => setView('kanban')}
            className={`p-2 rounded-[var(--radius-sm)] transition-all ${
              view === 'kanban'
                ? 'bg-[var(--bg-surface)] shadow-[var(--shadow-raised-sm)] text-[var(--text-primary)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
            }`}
            title="Kanban view"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setView('list')}
            className={`p-2 rounded-[var(--radius-sm)] transition-all ${
              view === 'list'
                ? 'bg-[var(--bg-surface)] shadow-[var(--shadow-raised-sm)] text-[var(--text-primary)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
            }`}
            title="List view"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      {filter === 'team' ? (
        <TeamWorkloadView onSelectMember={(id) => { setFilter(id === 'unassigned' ? 'all' : 'mine') }} />
      ) : isLoading ? (
        <p className="text-[var(--text-muted)] text-center py-10">Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <NeuCard variant="pressed" padding="lg" className="text-center">
          <CheckSquare className="h-12 w-12 text-[var(--text-placeholder)] mx-auto mb-3" />
          <p className="text-sm text-[var(--text-muted)]">No tasks found</p>
        </NeuCard>
      ) : view === 'kanban' ? (
        <TaskKanbanView tasks={tasks as any} onUpdateStatus={handleUpdateStatus} onComplete={handleComplete} />
      ) : (
        <TaskListView tasks={tasks as any} onUpdateStatus={handleUpdateStatus} onComplete={handleComplete} grouped={isMyTasks} />
      )}

      {/* Create modal */}
      <TaskCreateModal open={showCreate} onClose={() => setShowCreate(false)} />
    </div>
  )
}

function TaskCreateModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [assetId, setAssetId] = useState('')
  const [stageId, setStageId] = useState('')
  const [taskType, setTaskType] = useState<string>('physical_action')
  const [dueDate, setDueDate] = useState('')
  const [dueDateWarning, setDueDateWarning] = useState('')
  const utils = trpc.useUtils()

  const validateDueDate = (val: string) => {
    if (val) {
      const today = new Date(); today.setHours(0, 0, 0, 0)
      if (new Date(val + 'T00:00:00') < today) setDueDateWarning('This date is in the past')
      else setDueDateWarning('')
    } else { setDueDateWarning('') }
  }

  const { data: assets = [] } = trpc.assets.list.useQuery(undefined, { enabled: open })
  const { data: stages = [] } = trpc.stages.listByAsset.useQuery(
    { assetId },
    { enabled: !!assetId },
  )

  const mutation = trpc.tasks.create.useMutation({
    onSuccess: () => {
      utils.tasks.list.invalidate()
      utils.tasks.getMyTasks.invalidate()
      resetAndClose()
    },
  })

  const resetAndClose = () => {
    setTitle(''); setDescription(''); setAssetId(''); setStageId(''); setTaskType('physical_action'); setDueDate('')
    setDueDateWarning('')
    onClose()
  }

  const handleAssetChange = (newAssetId: string) => {
    setAssetId(newAssetId)
    setStageId('')
  }

  const handleSubmit = () => {
    if (!assetId || !stageId || !title.trim()) return
    mutation.mutate({
      title: title.trim(),
      assetId,
      stageId,
      taskType: taskType as TaskTypeKey,
      description: description.trim() || undefined,
      dueDate: dueDate || undefined,
    } as any)
  }

  return (
    <NeuModal open={open} onClose={resetAndClose} title="New Task" maxWidth="md">
      <div className="space-y-3">
        <NeuInput
          label="Title *"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <NeuSelect
          label="Asset *"
          value={assetId}
          onChange={(e) => handleAssetChange(e.target.value)}
          placeholder="Select asset..."
          options={(assets as any[]).map((a) => ({
            value: a.id,
            label: `${a.reference_code} - ${a.name}`,
          }))}
        />
        <NeuSelect
          label="Stage *"
          value={stageId}
          onChange={(e) => setStageId(e.target.value)}
          placeholder={assetId ? 'Select stage...' : 'Select an asset first'}
          disabled={!assetId}
          options={(stages as { id: string; name: string; phase: string }[]).map((s) => ({
            value: s.id,
            label: `${s.phase.replace(/_/g, ' ')} — ${s.name}`,
          }))}
        />
        <NeuSelect
          label="Task Type"
          value={taskType}
          onChange={(e) => setTaskType(e.target.value)}
          options={TASK_TYPE_OPTIONS}
        />
        <NeuTextarea
          label="Description"
          placeholder="Optional description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
        <div>
          <NeuInput
            label="Due Date"
            type="date"
            value={dueDate}
            onChange={(e) => { setDueDate(e.target.value); validateDueDate(e.target.value) }}
            onBlur={() => validateDueDate(dueDate)}
          />
          {dueDateWarning && (
            <p className="text-xs text-[var(--amber)] mt-1">{dueDateWarning}</p>
          )}
        </div>
      </div>
      <div className="flex gap-3 pt-4">
        <NeuButton variant="ghost" onClick={resetAndClose} fullWidth>Cancel</NeuButton>
        <NeuButton
          onClick={handleSubmit}
          loading={mutation.isPending}
          disabled={!title.trim() || !assetId || !stageId}
          fullWidth
        >
          Create Task
        </NeuButton>
      </div>
      {mutation.error && (
        <p className="text-sm text-[var(--ruby)] mt-2">{mutation.error.message}</p>
      )}
    </NeuModal>
  )
}
