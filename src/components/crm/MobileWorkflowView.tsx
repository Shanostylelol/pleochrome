'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronRight, ArrowLeft, Edit3, Plus, Check } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { PHASES, PHASE_ORDER, TASK_TYPES, TASK_STATUSES, type PhaseKey, type TaskTypeKey, type TaskStatusKey, type StageStatusKey } from '@/lib/constants'
import { NeuBadge } from '@/components/ui/NeuBadge'
import { NeuButton } from '@/components/ui/NeuButton'
import { trpc } from '@/lib/trpc'
import { useToast } from '@/components/ui/NeuToast'
import type { Stage } from './StageAccordion'
import type { Task } from './TaskCard'

/* eslint-disable @typescript-eslint/no-explicit-any */

// ── Status colors ────────────────────────────────────────
const statusColor: Record<string, 'gray' | 'amber' | 'chartreuse' | 'teal' | 'ruby'> = {
  not_started: 'gray', in_progress: 'teal', completed: 'chartreuse', blocked: 'ruby',
}
const taskStatusColor: Record<string, 'gray' | 'amber' | 'chartreuse' | 'teal' | 'ruby'> = {
  todo: 'gray', in_progress: 'teal', done: 'chartreuse', blocked: 'ruby',
  pending_approval: 'amber', approved: 'chartreuse', rejected: 'ruby', cancelled: 'gray',
}

// ── Props ────────────────────────────────────────────────
interface MobileWorkflowViewProps {
  stagesByPhase: Map<PhaseKey, Stage[]>
  tasksByStage: Map<string, Task[]>
  subtasksByTask: Map<string, any[]>
  stages: Stage[]
  assetId: string
  onOpenTask: (task: Task, stage: Stage) => void
  onUpdateStageStatus: (stageId: string, status: StageStatusKey) => void
  onCompleteTask: (taskId: string) => void
  onSubmitTask: (stageId: string, title: string) => void
  focusTaskId?: string | null
}

// ── Main Component ──────────────────────────────────────
export function MobileWorkflowView({
  stagesByPhase, tasksByStage, subtasksByTask, stages, assetId,
  onOpenTask, onUpdateStageStatus, onCompleteTask,
  onSubmitTask, focusTaskId,
}: MobileWorkflowViewProps) {
  const [activeStageId, setActiveStageId] = useState<string | null>(null)
  const activeStage = activeStageId ? stages.find(s => s.id === activeStageId) : null

  // Deep-link: if focusTaskId is set, navigate to its stage
  useEffect(() => {
    if (!focusTaskId) return
    for (const [, pStages] of stagesByPhase) {
      for (const s of pStages) {
        const tasks = tasksByStage.get(s.id) ?? []
        if (tasks.some(t => t.id === focusTaskId)) {
          setActiveStageId(s.id)
          return
        }
      }
    }
  }, [focusTaskId]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {activeStage ? (
          <motion.div key="stage-detail"
            initial={{ x: '100%', opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'tween', duration: 0.2 }}>
            <StageDetail
              stage={activeStage}
              tasks={tasksByStage.get(activeStage.id) ?? []}
              subtasksByTask={subtasksByTask}
              onBack={() => setActiveStageId(null)}
              onOpenTask={(task) => onOpenTask(task, activeStage)}
              onUpdateStageStatus={onUpdateStageStatus}
              onCompleteTask={onCompleteTask}
              onSubmitTask={onSubmitTask}
            />
          </motion.div>
        ) : (
          <motion.div key="stage-list"
            initial={{ x: '-50%', opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: '-50%', opacity: 0 }}
            transition={{ type: 'tween', duration: 0.15 }}>
            <StageList
              stagesByPhase={stagesByPhase}
              tasksByStage={tasksByStage}
              onSelectStage={setActiveStageId}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Level 0: Phase/Stage List ───────────────────────────
function StageList({ stagesByPhase, tasksByStage, onSelectStage }: {
  stagesByPhase: Map<PhaseKey, Stage[]>
  tasksByStage: Map<string, Task[]>
  onSelectStage: (stageId: string) => void
}) {
  return (
    <div className="space-y-4">
      {PHASE_ORDER.map(phaseKey => {
        const phaseStages = stagesByPhase.get(phaseKey)
        if (!phaseStages?.length) return null
        const phase = PHASES[phaseKey]
        return (
          <div key={phaseKey}>
            {/* Phase header */}
            <div className="flex items-center gap-2 mb-1.5 px-1">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: phase.color }} />
              <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">{phase.label}</span>
              <span className="text-[10px] text-[var(--text-muted)]">{phaseStages.length} stages</span>
            </div>

            {/* Stage rows */}
            <div className="space-y-1">
              {phaseStages.map(stage => {
                const tasks = tasksByStage.get(stage.id) ?? []
                const done = tasks.filter(t => t.status === 'done').length
                return (
                  <button key={stage.id} onClick={() => onSelectStage(stage.id)}
                    className="w-full flex items-center gap-2 min-h-[44px] px-3 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] transition-colors text-left">
                    <span className="w-1 h-6 rounded-full shrink-0" style={{ background: phase.color }} />
                    <span className="flex-1 text-sm text-[var(--text-primary)] min-w-0 truncate">{stage.name}</span>
                    <NeuBadge color={statusColor[stage.status] ?? 'gray'} size="sm">{stage.status === 'not_started' ? 'New' : stage.status === 'in_progress' ? 'Active' : stage.status === 'completed' ? 'Done' : stage.status}</NeuBadge>
                    {tasks.length > 0 && (
                      <span className="text-[11px] text-[var(--text-muted)] tabular-nums shrink-0">{done}/{tasks.length}</span>
                    )}
                    <ChevronRight className="h-4 w-4 text-[var(--text-placeholder)] shrink-0" />
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Level 1: Stage Detail ───────────────────────────────
function StageDetail({ stage, tasks, subtasksByTask, onBack, onOpenTask, onUpdateStageStatus, onCompleteTask, onSubmitTask }: {
  stage: Stage; tasks: Task[]; subtasksByTask: Map<string, any[]>
  onBack: () => void; onOpenTask: (task: Task) => void
  onUpdateStageStatus: (stageId: string, status: StageStatusKey) => void
  onCompleteTask: (taskId: string) => void
  onSubmitTask: (stageId: string, title: string) => void
}) {
  const [editingName, setEditingName] = useState(false)
  const [nameDraft, setNameDraft] = useState(stage.name)
  const [addingTask, setAddingTask] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const utils = trpc.useUtils()
  const { toast } = useToast()

  const renameMut = trpc.stages.rename.useMutation({
    onSuccess: () => utils.assets.getById.invalidate(),
    onError: (err) => toast(err.message, 'error'),
  })

  useEffect(() => { if (editingName) inputRef.current?.focus() }, [editingName])

  function handleRenameSubmit() {
    const trimmed = nameDraft.trim()
    if (trimmed && trimmed !== stage.name) renameMut.mutate({ stageId: stage.id, name: trimmed })
    else setNameDraft(stage.name)
    setEditingName(false)
  }

  function handleAddTaskSubmit() {
    if (!newTaskTitle.trim()) return
    onSubmitTask(stage.id, newTaskTitle.trim())
    setNewTaskTitle('')
    setAddingTask(false)
  }

  return (
    <div>
      {/* Sticky header */}
      <div className="sticky top-0 z-10 flex items-center gap-2 px-2 py-2.5 bg-[var(--bg-body)] border-b border-[var(--border)]">
        <button onClick={onBack} className="p-2 -ml-1 rounded-[var(--radius-sm)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        {editingName ? (
          <input ref={inputRef} value={nameDraft}
            onChange={(e) => setNameDraft(e.target.value)}
            onBlur={handleRenameSubmit}
            onKeyDown={(e) => { if (e.key === 'Enter') handleRenameSubmit(); if (e.key === 'Escape') { setNameDraft(stage.name); setEditingName(false) } }}
            className="flex-1 text-sm font-semibold bg-[var(--bg-input)] border border-[var(--teal)] text-[var(--text-primary)] rounded-[var(--radius-sm)] px-2 py-1 outline-none min-w-0" />
        ) : (
          <span className="flex-1 text-sm font-semibold text-[var(--text-primary)] truncate">{stage.name}</span>
        )}
        <button onClick={() => { setNameDraft(stage.name); setEditingName(true) }}
          className="p-1.5 text-[var(--text-muted)] hover:text-[var(--teal)] transition-colors shrink-0">
          <Edit3 className="h-3.5 w-3.5" />
        </button>
        <NeuBadge color={statusColor[stage.status] ?? 'gray'} size="sm">
          {stage.status === 'not_started' ? 'New' : stage.status === 'in_progress' ? 'Active' : stage.status === 'completed' ? 'Done' : stage.status}
        </NeuBadge>
      </div>

      {/* Stage actions */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-[var(--border)]">
        {stage.status === 'not_started' && (
          <NeuButton size="sm" variant="ghost" onClick={() => onUpdateStageStatus(stage.id, 'in_progress')} className="!h-7 !text-xs text-[var(--teal)]">Start Stage</NeuButton>
        )}
        {stage.status === 'in_progress' && (
          <NeuButton size="sm" variant="ghost" onClick={() => onUpdateStageStatus(stage.id, 'completed')} className="!h-7 !text-xs text-[var(--chartreuse)]">Complete Stage</NeuButton>
        )}
        <div className="ml-auto">
          <NeuButton size="sm" variant="ghost" icon={<Plus className="h-3.5 w-3.5" />}
            onClick={() => setAddingTask(true)} className="!h-7 !text-xs">Add Task</NeuButton>
        </div>
      </div>

      {/* Add task inline */}
      {addingTask && (
        <div className="flex items-center gap-2 px-3 py-2 border-b border-[var(--border)] bg-[var(--bg-elevated)]">
          <input value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleAddTaskSubmit(); if (e.key === 'Escape') { setNewTaskTitle(''); setAddingTask(false) } }}
            placeholder="Task title..." autoFocus
            className="flex-1 h-8 text-sm px-2 rounded-[var(--radius-sm)] bg-[var(--bg-input)] text-[var(--text-primary)] shadow-[var(--shadow-pressed)] border border-[var(--border)] focus:outline-none focus:border-[var(--teal)]" />
          <NeuButton size="sm" onClick={handleAddTaskSubmit} disabled={!newTaskTitle.trim()} className="!h-8">Add</NeuButton>
        </div>
      )}

      {/* Task list */}
      <div className="divide-y divide-[var(--border)]">
        {tasks.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)] text-center py-8">No tasks in this stage</p>
        ) : tasks.map(task => {
          const typeCfg = TASK_TYPES[task.task_type as TaskTypeKey]
          const statusCfg = TASK_STATUSES[task.status as TaskStatusKey]
          const subs = subtasksByTask.get(task.id) ?? []
          const subsDone = subs.filter((s: any) => s.status === 'done').length
          const isDone = task.status === 'done'
          return (
            <button key={task.id} onClick={() => onOpenTask(task)}
              className={`w-full flex items-center gap-2.5 min-h-[48px] px-3 py-2.5 text-left hover:bg-[var(--bg-elevated)] transition-colors ${isDone ? 'opacity-60' : ''}`}>
              {/* Complete button */}
              {!isDone ? (
                <button onClick={(e) => { e.stopPropagation(); onCompleteTask(task.id) }}
                  className="w-5 h-5 rounded-full border-2 shrink-0 transition-colors hover:border-[var(--chartreuse)]"
                  style={{ borderColor: typeCfg?.color ?? 'var(--border)' }} />
              ) : (
                <div className="w-5 h-5 rounded-full bg-[var(--chartreuse)] flex items-center justify-center shrink-0">
                  <Check className="h-3 w-3 text-white" />
                </div>
              )}
              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm truncate ${isDone ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'}`}>{task.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <NeuBadge color={taskStatusColor[task.status] ?? 'gray'} size="sm">{statusCfg?.label ?? task.status}</NeuBadge>
                  {subs.length > 0 && <span className="text-[10px] text-[var(--text-muted)]">{subsDone}/{subs.length} subtasks</span>}
                  {task.due_date && <span className="text-[10px] text-[var(--text-muted)]">{new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>}
                </div>
              </div>
              {/* Type indicator */}
              <span className="w-1.5 h-6 rounded-full shrink-0" style={{ background: typeCfg?.color ?? 'var(--border)' }} />
              <ChevronRight className="h-4 w-4 text-[var(--text-placeholder)] shrink-0" />
            </button>
          )
        })}
      </div>
    </div>
  )
}
