'use client'

import { useState, useMemo } from 'react'
import { CheckSquare, Plus, LayoutGrid, List, Download, Search, ArrowUpDown } from 'lucide-react'
import { NeuCard, NeuButton, NeuTabs, NeuInput, NeuTextarea, NeuSelect, NeuModal } from '@/components/ui'
import { exportCSV } from '@/lib/csv-export'
import { TASK_TYPES, type TaskTypeKey } from '@/lib/constants'
import { trpc } from '@/lib/trpc'
import { ListPageSkeleton } from '@/components/crm/skeletons'
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

type SortKey = 'due_date' | 'status' | 'title'

export default function TasksPage() {
  const [filter, setFilter] = useState('all')
  const [view, setView] = useState<'kanban' | 'list'>('kanban')
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('due_date')
  const [typeFilter, setTypeFilter] = useState('')
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

  const rawTasks = isMyTasks ? myTasks : allTasks
  const isLoading = isMyTasks ? loadingMy : loadingAll

  const tasks = useMemo(() => {
    let t = rawTasks as Record<string, unknown>[]
    if (search) {
      const q = search.toLowerCase()
      t = t.filter(task => ((task.title as string) ?? '').toLowerCase().includes(q))
    }
    if (typeFilter) {
      t = t.filter(task => (task.task_type as string) === typeFilter)
    }
    t = [...t].sort((a, b) => {
      if (sortKey === 'due_date') {
        const da = a.due_date as string | null, db = b.due_date as string | null
        if (!da && !db) return 0
        if (!da) return 1
        if (!db) return -1
        return new Date(da).getTime() - new Date(db).getTime()
      }
      if (sortKey === 'status') return ((a.status as string) ?? '').localeCompare((b.status as string) ?? '')
      return ((a.title as string) ?? '').localeCompare((b.title as string) ?? '')
    })
    return t
  }, [rawTasks, search, sortKey, typeFilter])

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
        <div className="flex items-center gap-2">
          <NeuButton variant="ghost" icon={<Download className="h-4 w-4" />} size="sm"
            onClick={() => exportCSV('tasks.csv', [
              { key: 'title', label: 'Task' }, { key: 'task_type', label: 'Type' },
              { key: 'status', label: 'Status' }, { key: 'due_date', label: 'Due Date' },
            ], tasks as Record<string, unknown>[])}>
            <span className="hidden sm:inline">CSV</span>
          </NeuButton>
          <NeuButton icon={<Plus className="h-4 w-4" />} onClick={() => setShowCreate(true)}>
            <span className="hidden sm:inline">New Task</span>
          </NeuButton>
        </div>
      </div>

      {/* Search + sort row */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[160px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="w-full pl-9 pr-3 py-1.5 text-sm rounded-[var(--radius-md)] bg-[var(--bg-body)] shadow-[var(--shadow-pressed)] text-[var(--text-primary)] placeholder:text-[var(--text-placeholder)] outline-none focus:ring-1 focus:ring-[var(--border-focus)]"
          />
        </div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
          className="h-8 text-xs rounded-[var(--radius-sm)] px-2 bg-[var(--bg-input)] text-[var(--text-muted)] border border-[var(--border)] shadow-[var(--shadow-pressed)] focus:outline-none focus:border-[var(--teal)]">
          <option value="">All Types</option>
          {TASK_TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <div className="flex items-center gap-1.5">
          <ArrowUpDown className="h-3.5 w-3.5 text-[var(--text-muted)]" />
          {(['due_date', 'status', 'title'] as SortKey[]).map((k) => (
            <button key={k} onClick={() => setSortKey(k)}
              className={`px-2.5 py-1 text-xs rounded-[var(--radius-sm)] transition-colors ${sortKey === k ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)] font-medium' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'}`}>
              {k === 'due_date' ? 'Due' : k === 'status' ? 'Status' : 'Title'}
            </button>
          ))}
        </div>
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
        <ListPageSkeleton />
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
