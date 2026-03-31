'use client'

import { useState, useMemo } from 'react'
import { Plus, Search } from 'lucide-react'
import { PHASES, PHASE_ORDER, type PhaseKey } from '@/lib/constants'
import { useWorkflowMutations } from './useWorkflowMutations'
import { NeuButton } from '@/components/ui/NeuButton'
import { NeuCard } from '@/components/ui/NeuCard'
import { NeuInput } from '@/components/ui/NeuInput'
import { StageAccordion, type Stage } from '@/components/crm/StageAccordion'
import { SortableStageWrapper } from '@/components/crm/SortableStageWrapper'
import { DndContext, DragOverlay, closestCenter, type DragEndEvent, type DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { ConfirmHideModal } from '@/components/crm/ConfirmHideModal'
import { BulkActionBar } from '@/components/crm/BulkActionBar'
import { trpc } from '@/lib/trpc'
import type { Task } from '@/components/crm/TaskCard'
import type { Subtask } from '@/components/crm/SubtaskChecklist'

// ── Types ─────────────────────────────────────────────────
interface WorkflowTabProps {
  assetId: string
  stages: Stage[]
  tasks: Task[]
  subtasks: Array<{ id: string; task_id: string; title: string; status: string; subtask_type?: string; notes?: string; assignee?: { name: string; avatar_url?: string } }>
}

const STATUS_FILTERS = [
  { id: 'all', label: 'All' }, { id: 'todo', label: 'To Do' },
  { id: 'in_progress', label: 'Active' }, { id: 'blocked', label: 'Blocked' }, { id: 'done', label: 'Done' },
]

// ── Component ─────────────────────────────────────────────
export function WorkflowTab({ assetId, stages, tasks, subtasks }: WorkflowTabProps) {
  const [expandedStages, setExpandedStages] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [addingStageForPhase, setAddingStageForPhase] = useState<PhaseKey | null>(null)
  const [addingTaskForStage, setAddingTaskForStage] = useState<string | null>(null)
  const [newStageName, setNewStageName] = useState('')
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [hideTarget, setHideTarget] = useState<{ type: 'stage' | 'task'; id: string; name: string } | null>(null)
  const [activeStageDragId, setActiveStageDragId] = useState<string | null>(null)
  const [selectMode, setSelectMode] = useState(false)
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(new Set())
  const { data: currentUser } = trpc.team.getCurrentUser.useQuery()
  const currentUserId = currentUser?.id ?? ''

  // ── Optimistic reorder state ───────────────────────────
  const [localTaskOrder, setLocalTaskOrder] = useState<Map<string, string[]>>(new Map())
  const [localStageOrder, setLocalStageOrder] = useState<Map<string, string[]>>(new Map())

  // ── Mutations + handlers (extracted hook) ──────────────
  const {
    createTask, createSubtask, createStage,
    toggleStageHidden, toggleTaskHidden, reorderStages,
    handleCompleteTask, handleCompleteSubtask,
    handleUpdateStageStatus, handleUpdateTaskStatus,
    handleDeleteTask, handleUpdateTask, handleReorderTasks,
    handleDeleteSubtask, handleAddSubtask,
    handleUpdateSubtask, handleReorderSubtasks,
  } = useWorkflowMutations({ assetId, setLocalTaskOrder, setLocalStageOrder })

  const stageDndSensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 12 } }))

  // ── Local UI handlers ──────────────────────────────────
  const toggleExpanded = (stageId: string) =>
    setExpandedStages((prev) => { const n = new Set(prev); n.has(stageId) ? n.delete(stageId) : n.add(stageId); return n })
  const handleAddTask = (stageId: string) => { setAddingTaskForStage(stageId); setNewTaskTitle('') }
  const handleSubmitTask = (stageId: string) => {
    if (!newTaskTitle.trim()) return
    createTask.mutate({ stageId, assetId, title: newTaskTitle.trim() }, {
      onSuccess: () => { setNewTaskTitle(''); setAddingTaskForStage(null) },
    })
  }
  const handleHideStage = (stageId: string) => {
    const s = stages.find((x) => x.id === stageId)
    if (s) setHideTarget({ type: 'stage', id: stageId, name: s.name })
  }
  const handleHideTask = (taskId: string) => {
    const t = tasks.find((x) => x.id === taskId)
    if (t) setHideTarget({ type: 'task', id: taskId, name: t.title })
  }
  const confirmHide = () => {
    if (!hideTarget) return
    if (hideTarget.type === 'stage') toggleStageHidden.mutate({ stageId: hideTarget.id })
    else toggleTaskHidden.mutate({ taskId: hideTarget.id })
    setHideTarget(null)
  }
  const handleAddStage = (phase: PhaseKey) => {
    if (!newStageName.trim()) return
    createStage.mutate({ assetId, phase, name: newStageName.trim(), isGate: false }, {
      onSuccess: () => { setNewStageName(''); setAddingStageForPhase(null) },
    })
  }

  // ── Derived data ────────────────────────────────────────
  const lowerQuery = searchQuery.toLowerCase()
  const filteredTasks = useMemo(() => tasks.filter((t) => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false
    if (lowerQuery && !t.title.toLowerCase().includes(lowerQuery)) return false
    return true
  }), [tasks, statusFilter, lowerQuery])

  const tasksByStage = new Map<string, Task[]>()
  for (const t of filteredTasks) {
    const sid = (t as unknown as { stage_id: string }).stage_id ?? ''
    if (!tasksByStage.has(sid)) tasksByStage.set(sid, [])
    tasksByStage.get(sid)!.push(t)
  }
  for (const [sid, ids] of localTaskOrder) {
    const st = tasksByStage.get(sid); if (!st) continue
    const m = new Map(st.map((t) => [t.id, t]))
    const sorted = ids.map((id) => m.get(id)).filter(Boolean) as Task[]
    for (const t of st) { if (!ids.includes(t.id)) sorted.push(t) }
    tasksByStage.set(sid, sorted)
  }
  const subtasksByTask = new Map<string, Subtask[]>()
  for (const st of subtasks) {
    if (!subtasksByTask.has(st.task_id)) subtasksByTask.set(st.task_id, [])
    subtasksByTask.get(st.task_id)!.push({
      id: st.id, title: st.title, status: st.status as Subtask['status'],
      subtask_type: st.subtask_type, notes: st.notes, assignee: st.assignee,
    })
  }
  const stagesByPhase = new Map<PhaseKey, Stage[]>()
  for (const s of stages) {
    if (!stagesByPhase.has(s.phase)) stagesByPhase.set(s.phase, [])
    stagesByPhase.get(s.phase)!.push(s)
  }
  for (const [pk, ids] of localStageOrder) {
    const ps = stagesByPhase.get(pk as PhaseKey); if (!ps) continue
    const m = new Map(ps.map((s) => [s.id, s]))
    const sorted = ids.map((id) => m.get(id)).filter(Boolean) as Stage[]
    for (const s of ps) { if (!ids.includes(s.id)) sorted.push(s) }
    stagesByPhase.set(pk as PhaseKey, sorted)
  }

  // ── Render ───────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Search + filter bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--text-muted)]" />
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..." className="w-full h-8 text-sm pl-8 pr-3 rounded-[var(--radius-md)] bg-[var(--bg-input)] text-[var(--text-primary)] placeholder:text-[var(--text-placeholder)] shadow-[var(--shadow-pressed)] border border-[var(--border)] focus:outline-none focus:border-[var(--teal)]" />
        </div>
        <div className="flex gap-1">
          {STATUS_FILTERS.map((f) => (
            <button key={f.id} onClick={() => setStatusFilter(f.id)}
              className={`px-2.5 py-1 text-xs rounded-[var(--radius-sm)] transition-all ${
                statusFilter === f.id
                  ? 'bg-[var(--bg-surface)] shadow-[var(--shadow-raised-sm)] text-[var(--text-primary)] font-medium'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              }`}>{f.label}</button>
          ))}
          <button onClick={() => { setSelectMode(!selectMode); if (selectMode) setSelectedTaskIds(new Set()) }}
            className={`px-2.5 py-1 text-xs rounded-[var(--radius-sm)] transition-all ${
              selectMode
                ? 'bg-[var(--teal)] text-white font-medium'
                : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
            }`}>Select</button>
        </div>
      </div>

      {PHASE_ORDER.map((phaseKey) => {
        const phase = PHASES[phaseKey]
        const phaseStages = stagesByPhase.get(phaseKey) ?? []
        const handleStageDragStart = (event: DragStartEvent) => {
          setActiveStageDragId(event.active.id as string)
        }
        const handleStageDragEnd = (event: DragEndEvent) => {
          setActiveStageDragId(null)
          const { active, over } = event
          if (!over || active.id === over.id) return
          const ids = phaseStages.map((s) => s.id)
          const oi = ids.indexOf(active.id as string), ni = ids.indexOf(over.id as string)
          if (oi === -1 || ni === -1) return
          const newOrder = arrayMove(ids, oi, ni)
          setLocalStageOrder((prev) => new Map(prev).set(phaseKey, newOrder))
          reorderStages.mutate({ assetId, phase: phaseKey, stageIds: newOrder })
        }
        return (
          <div key={phaseKey}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-3 h-3 rounded-full shrink-0" style={{ background: phase.color }} />
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">{phase.label}</h3>
              <span className="text-xs text-[var(--text-muted)]">{phaseStages.length} {phaseStages.length === 1 ? 'stage' : 'stages'}</span>
            </div>
            {phaseStages.length === 0 ? (
              <NeuCard variant="pressed" padding="sm" className="text-center">
                <p className="text-sm text-[var(--text-muted)] py-2">No stages in this phase.</p>
              </NeuCard>
            ) : (
              <DndContext sensors={stageDndSensors} collisionDetection={closestCenter} onDragStart={handleStageDragStart} onDragEnd={handleStageDragEnd}>
                <SortableContext items={phaseStages.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2">
                    {phaseStages
                      .filter((stage) => statusFilter === 'all' || (tasksByStage.get(stage.id)?.length ?? 0) > 0)
                      .map((stage) => {
                      const stageTasks = tasksByStage.get(stage.id) ?? []
                      const stageSubtasks: Record<string, Subtask[]> = {}
                      for (const t of stageTasks) { stageSubtasks[t.id] = subtasksByTask.get(t.id) ?? [] }
                      return (
                        <SortableStageWrapper key={stage.id} id={stage.id}>
                          <StageAccordion
                            stage={stage} tasks={stageTasks} subtasks={stageSubtasks}
                            isExpanded={expandedStages.has(stage.id)}
                            onToggle={() => toggleExpanded(stage.id)}
                            onReorderTasks={handleReorderTasks} onHideStage={handleHideStage}
                            onAddTask={handleAddTask} phaseColor={phase.color}
                            onCompleteTask={handleCompleteTask} onHideTask={handleHideTask}
                            onAddSubtask={handleAddSubtask} onReorderSubtasks={handleReorderSubtasks}
                            onUpdateStageStatus={handleUpdateStageStatus} onUpdateTaskStatus={handleUpdateTaskStatus}
                            onDeleteTask={handleDeleteTask} onUpdateTask={handleUpdateTask}
                            onDeleteSubtask={handleDeleteSubtask} onUpdateSubtask={handleUpdateSubtask}
                            onCompleteSubtask={handleCompleteSubtask}
                            assetId={assetId}
                            currentUserId={currentUserId}
                          />
                          {addingTaskForStage === stage.id && (
                            <div className="flex items-center gap-2 mt-2 ml-3">
                              <NeuInput autoFocus value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') handleSubmitTask(stage.id); if (e.key === 'Escape') setAddingTaskForStage(null) }}
                                placeholder="New task title..." className="flex-1" />
                              <NeuButton size="sm" onClick={() => handleSubmitTask(stage.id)} disabled={!newTaskTitle.trim()} loading={createTask.isPending}>Add</NeuButton>
                              <NeuButton variant="ghost" size="sm" onClick={() => setAddingTaskForStage(null)}>Cancel</NeuButton>
                            </div>
                          )}
                        </SortableStageWrapper>
                      )
                    })}
                  </div>
                </SortableContext>
                <DragOverlay>
                  {activeStageDragId && (() => {
                    const s = phaseStages.find(st => st.id === activeStageDragId)
                    if (!s) return null
                    return (
                      <NeuCard variant="raised" padding="sm" className="shadow-lg opacity-90">
                        <p className="text-sm font-semibold text-[var(--text-primary)]">{s.name}</p>
                      </NeuCard>
                    )
                  })()}
                </DragOverlay>
              </DndContext>
            )}
            {addingStageForPhase === phaseKey ? (
              <div className="flex items-center gap-2 mt-2">
                <NeuInput autoFocus value={newStageName} onChange={(e) => setNewStageName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddStage(phaseKey); if (e.key === 'Escape') setAddingStageForPhase(null) }}
                  placeholder="Stage name..." className="flex-1" />
                <NeuButton size="sm" onClick={() => handleAddStage(phaseKey)} disabled={!newStageName.trim()} loading={createStage.isPending}>Add</NeuButton>
                <NeuButton variant="ghost" size="sm" onClick={() => setAddingStageForPhase(null)}>Cancel</NeuButton>
              </div>
            ) : (
              <NeuButton variant="ghost" size="sm" icon={<Plus className="h-3.5 w-3.5" />}
                onClick={() => { setAddingStageForPhase(phaseKey); setNewStageName('') }} className="mt-2">
                Add Stage
              </NeuButton>
            )}
          </div>
        )
      })}

      {/* Confirm hide modal */}
      <ConfirmHideModal
        open={!!hideTarget}
        onClose={() => setHideTarget(null)}
        onConfirm={confirmHide}
        entityType={hideTarget?.type ?? 'stage'}
        entityName={hideTarget?.name ?? ''}
      />

      {selectMode && (
        <BulkActionBar
          selectedIds={selectedTaskIds}
          assetId={assetId}
          onClear={() => { setSelectedTaskIds(new Set()); setSelectMode(false) }}
          onDone={() => { setSelectedTaskIds(new Set()); setSelectMode(false) }}
        />
      )}
    </div>
  )
}
