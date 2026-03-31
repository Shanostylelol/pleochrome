'use client'

import { useState, useRef, useEffect } from 'react'
import {
  ChevronDown, ChevronRight, Shield, Plus, Check, X,
  Upload, Calendar, Truck, ArrowUpRight, ArrowDownLeft,
  ShieldCheck, Eye, Search, FileText, Mail, Zap, Trash2,
  ArrowUp, ArrowDown, type LucideIcon,
} from 'lucide-react'
import { NeuCard, NeuBadge, NeuButton, NeuInput } from '@/components/ui'
import { useToast } from '@/components/ui/NeuToast'
import { PHASES, TASK_TYPES, type PhaseKey, type TaskTypeKey } from '@/lib/constants'
import { trpc } from '@/lib/trpc'

const ICON_MAP: Record<string, LucideIcon> = {
  Upload, Calendar, Truck, ArrowUpRight, ArrowDownLeft,
  ShieldCheck, Eye, Search, FileText, Mail, Zap,
}

/* eslint-disable @typescript-eslint/no-explicit-any */

// ── Inline editable text ──────────────────────────────────────────
function InlineEdit({ value, onSave, className }: { value: string; onSave: (v: string) => void; className?: string }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => { if (editing) ref.current?.focus() }, [editing])

  if (!editing) {
    return (
      <span
        className={`cursor-pointer select-none ${className ?? ''}`}
        onDoubleClick={() => { setDraft(value); setEditing(true) }}
        title="Double-click to edit"
      >
        {value}
      </span>
    )
  }

  const commit = () => {
    const trimmed = draft.trim()
    if (trimmed && trimmed !== value) onSave(trimmed)
    setEditing(false)
  }

  return (
    <input
      ref={ref}
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === 'Enter') commit()
        if (e.key === 'Escape') setEditing(false)
      }}
      className="bg-transparent border-b border-[var(--border)] text-[var(--text-primary)] outline-none px-0 py-0 text-inherit font-inherit w-full"
    />
  )
}

// ── Phase section with stages ──────────────────────────────────────
export function TemplatePhaseSection({ phaseKey, stages, tasksByStage, subtasksByTask, templateId, utils }: {
  phaseKey: PhaseKey
  stages: any[]
  tasksByStage: Record<string, any[]>
  subtasksByTask: Record<string, any[]>
  templateId: string
  utils: any
}) {
  const phaseConfig = PHASES[phaseKey]
  const [expanded, setExpanded] = useState(true)
  const [addingStage, setAddingStage] = useState(false)
  const [newStageName, setNewStageName] = useState('')

  const { toast: phaseToast } = useToast()
  const addStageMut = trpc.templates.addStage.useMutation({
    onSuccess: () => { utils.templates.getById.invalidate({ templateId }); setAddingStage(false); setNewStageName('') },
    onError: (e) => phaseToast(e.message, 'error'),
  })

  return (
    <div>
      <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-2 w-full text-left group py-1">
        {expanded ? <ChevronDown className="h-4 w-4 text-[var(--text-muted)]" /> : <ChevronRight className="h-4 w-4 text-[var(--text-muted)]" />}
        <div className="w-2 h-2 rounded-full" style={{ background: phaseConfig.color }} />
        <span className="text-sm font-semibold text-[var(--text-primary)]">{phaseConfig.label}</span>
        <span className="text-[10px] text-[var(--text-muted)]">{stages.length} stage{stages.length !== 1 ? 's' : ''}</span>
      </button>

      {expanded && (
        <div className="ml-6 space-y-2 mt-1">
          {stages.map((stage) => (
            <StageRow key={stage.id} stage={stage} tasks={tasksByStage[stage.id] ?? []} subtasksByTask={subtasksByTask} templateId={templateId} utils={utils} />
          ))}

          {addingStage ? (
            <div className="flex items-center gap-2">
              <NeuInput
                placeholder="Stage name..." value={newStageName} onChange={(e) => setNewStageName(e.target.value)} className="!h-8 text-xs"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newStageName.trim()) addStageMut.mutate({ templateId, phase: phaseKey, name: newStageName.trim() })
                  if (e.key === 'Escape') { setAddingStage(false); setNewStageName('') }
                }}
                autoFocus
              />
              <NeuButton size="sm" icon={<Check className="h-3 w-3" />} onClick={() => newStageName.trim() && addStageMut.mutate({ templateId, phase: phaseKey, name: newStageName.trim() })} loading={addStageMut.isPending} disabled={!newStageName.trim()} className="!h-8" />
              <NeuButton size="sm" variant="ghost" onClick={() => { setAddingStage(false); setNewStageName('') }} className="!h-8"><X className="h-3 w-3" /></NeuButton>
            </div>
          ) : (
            <button onClick={() => setAddingStage(true)} className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--teal)] transition-colors py-1">
              <Plus className="h-3 w-3" /> Add Stage
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// ── Subtask list with add/delete ──────────────────────────────────
function SubtaskList({ subs, taskId, addSubtaskMut, removeSubtaskMut }: {
  subs: any[]; taskId: string; addSubtaskMut: any; removeSubtaskMut: any
}) {
  const [adding, setAdding] = useState(false)
  const [title, setTitle] = useState('')
  function handleAdd() {
    if (!title.trim()) return
    addSubtaskMut.mutate({ templateTaskId: taskId, title: title.trim() })
    setTitle(''); setAdding(false)
  }
  return (
    <div className="ml-7 space-y-0.5">
      {subs.map((st: any) => (
        <div key={st.id} className="group flex items-center gap-2 py-0.5">
          <div className="w-1 h-1 rounded-full bg-[var(--text-muted)]" />
          <span className="text-[11px] text-[var(--text-secondary)] flex-1 truncate">{st.title}</span>
          {st.subtask_type && <span className="text-[9px] text-[var(--text-muted)] capitalize">{st.subtask_type.replace('_', ' ')}</span>}
          {st.requires_approval && <NeuBadge color="amber" size="sm">Approval</NeuBadge>}
          <button onClick={() => removeSubtaskMut.mutate({ subtaskId: st.id })}
            className="p-0.5 text-[var(--text-placeholder)] hover:text-[var(--ruby)] transition-colors opacity-0 group-hover:opacity-100" title="Delete subtask">
            <Trash2 className="h-2.5 w-2.5" />
          </button>
        </div>
      ))}
      {adding ? (
        <div className="flex items-center gap-1 pt-0.5">
          <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); if (e.key === 'Escape') { setAdding(false); setTitle('') } }}
            onBlur={() => { if (!title.trim()) setAdding(false) }}
            placeholder="Subtask title..."
            className="flex-1 h-6 text-[11px] rounded-[var(--radius-sm)] px-1.5 bg-[var(--bg-input)] text-[var(--text-primary)] placeholder:text-[var(--text-placeholder)] shadow-[var(--shadow-pressed)] border border-[var(--border)] focus:outline-none focus:border-[var(--teal)]" />
          <button onClick={handleAdd} className="text-[var(--teal)] hover:text-[var(--text-primary)]"><Check className="h-3 w-3" /></button>
          <button onClick={() => { setAdding(false); setTitle('') }} className="text-[var(--text-muted)]"><X className="h-3 w-3" /></button>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} className="flex items-center gap-1 text-[10px] text-[var(--text-muted)] hover:text-[var(--teal)] transition-colors py-0.5">
          <Plus className="h-2.5 w-2.5" /> Subtask
        </button>
      )}
    </div>
  )
}

// ── Stage row with tasks ──────────────────────────────────────────
function StageRow({ stage, tasks, subtasksByTask, templateId, utils }: {
  stage: any; tasks: any[]; subtasksByTask: Record<string, any[]>; templateId: string; utils: any
}) {
  const [expanded, setExpanded] = useState(false)
  const [addingTask, setAddingTask] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [confirmDeleteStage, setConfirmDeleteStage] = useState(false)

  const { toast } = useToast()
  const inv = () => utils.templates.getById.invalidate({ templateId })
  const err = (e: { message: string }) => toast(e.message, 'error')

  const addTaskMut = trpc.templates.addTask.useMutation({ onSuccess: () => { inv(); setAddingTask(false); setNewTaskTitle('') }, onError: err })
  const removeTaskMut = trpc.templates.removeTask.useMutation({ onSuccess: inv, onError: err })
  const removeStageMut = trpc.templates.removeStage.useMutation({ onSuccess: inv, onError: err })
  const updateStageMut = trpc.templates.updateStage.useMutation({ onSuccess: inv, onError: err })
  const updateTaskMut = trpc.templates.updateTask.useMutation({ onSuccess: inv, onError: err })
  const addSubtaskMut = trpc.templates.addSubtask.useMutation({ onSuccess: inv, onError: err })
  const removeSubtaskMut = trpc.templates.removeSubtask.useMutation({ onSuccess: inv, onError: err })
  const reorderTasksMut = trpc.templates.reorderTasks.useMutation({ onSuccess: inv, onError: err })

  return (
    <NeuCard variant="pressed" padding="sm">
      <div className="flex items-center gap-2">
        <button onClick={() => setExpanded(!expanded)} className="shrink-0">
          {expanded ? <ChevronDown className="h-3.5 w-3.5 text-[var(--text-muted)]" /> : <ChevronRight className="h-3.5 w-3.5 text-[var(--text-muted)]" />}
        </button>
        <InlineEdit
          value={stage.name}
          onSave={(name) => updateStageMut.mutate({ stageId: stage.id, name })}
          className="text-sm text-[var(--text-primary)] flex-1 truncate"
        />
        {stage.is_gate && <NeuBadge color="amber" size="sm"><Shield className="h-3 w-3 inline mr-0.5" />Gate</NeuBadge>}
        <span className="text-[10px] text-[var(--text-muted)]">{tasks.length} task{tasks.length !== 1 ? 's' : ''}</span>
        {confirmDeleteStage ? (
          <div className="flex items-center gap-1">
            <NeuButton size="sm" variant="ghost" onClick={() => removeStageMut.mutate({ stageId: stage.id })} loading={removeStageMut.isPending} className="!h-6 !px-1.5 text-[var(--ruby)]">
              <Check className="h-3 w-3" />
            </NeuButton>
            <NeuButton size="sm" variant="ghost" onClick={() => setConfirmDeleteStage(false)} className="!h-6 !px-1.5">
              <X className="h-3 w-3" />
            </NeuButton>
          </div>
        ) : (
          <button onClick={() => setConfirmDeleteStage(true)} className="p-0.5 text-[var(--text-placeholder)] hover:text-[var(--ruby)] transition-colors" title="Delete stage">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {expanded && (
        <div className="mt-2 ml-5 space-y-1.5">
          {tasks.map((task, tIdx) => {
            const typeKey = task.task_type as TaskTypeKey
            const typeConfig = TASK_TYPES[typeKey]
            const TaskIcon = typeConfig ? ICON_MAP[typeConfig.icon] ?? FileText : FileText
            const subs = subtasksByTask[task.id] ?? []

            function moveTask(dir: -1 | 1) {
              const ids = tasks.map((t: any) => t.id)
              const from = tIdx; const to = tIdx + dir
              if (to < 0 || to >= ids.length) return
              ;[ids[from], ids[to]] = [ids[to], ids[from]]
              reorderTasksMut.mutate({ templateStageId: stage.id, taskIds: ids })
            }

            return (
              <div key={task.id} className="space-y-1">
                <div className="flex items-center gap-1 py-1">
                  <div className="flex flex-col shrink-0">
                    <button onClick={() => moveTask(-1)} disabled={tIdx === 0} className="text-[var(--text-placeholder)] hover:text-[var(--text-primary)] disabled:opacity-20 transition-colors" title="Move up">
                      <ArrowUp className="h-3 w-3" />
                    </button>
                    <button onClick={() => moveTask(1)} disabled={tIdx === tasks.length - 1} className="text-[var(--text-placeholder)] hover:text-[var(--text-primary)] disabled:opacity-20 transition-colors" title="Move down">
                      <ArrowDown className="h-3 w-3" />
                    </button>
                  </div>
                  <TaskIcon className="h-3.5 w-3.5 shrink-0" style={{ color: typeConfig?.color ?? 'var(--text-muted)' }} />
                  <InlineEdit value={task.title} onSave={(title) => updateTaskMut.mutate({ taskId: task.id, title })} className="text-xs text-[var(--text-primary)] flex-1 truncate" />
                  <NeuBadge color={typeBadgeColor(task.task_type)} size="sm">{typeConfig?.label ?? task.task_type}</NeuBadge>
                  <button onClick={() => removeTaskMut.mutate({ taskId: task.id })} className="p-0.5 text-[var(--text-placeholder)] hover:text-[var(--ruby)] transition-colors" title="Delete task">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
                <SubtaskList subs={subs} taskId={task.id} addSubtaskMut={addSubtaskMut} removeSubtaskMut={removeSubtaskMut} />
              </div>
            )
          })}

          {addingTask ? (
            <div className="flex items-center gap-2 pt-1">
              <NeuInput
                placeholder="Task title..." value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} className="!h-7 text-xs"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newTaskTitle.trim()) addTaskMut.mutate({ templateStageId: stage.id, title: newTaskTitle.trim() })
                  if (e.key === 'Escape') { setAddingTask(false); setNewTaskTitle('') }
                }}
                autoFocus
              />
              <NeuButton size="sm" icon={<Check className="h-3 w-3" />} onClick={() => newTaskTitle.trim() && addTaskMut.mutate({ templateStageId: stage.id, title: newTaskTitle.trim() })} loading={addTaskMut.isPending} disabled={!newTaskTitle.trim()} className="!h-7" />
              <NeuButton size="sm" variant="ghost" onClick={() => { setAddingTask(false); setNewTaskTitle('') }} className="!h-7"><X className="h-3 w-3" /></NeuButton>
            </div>
          ) : (
            <button onClick={() => setAddingTask(true)} className="flex items-center gap-1 text-[11px] text-[var(--text-muted)] hover:text-[var(--teal)] transition-colors py-0.5">
              <Plus className="h-3 w-3" /> Add Task
            </button>
          )}
        </div>
      )}
    </NeuCard>
  )
}

// ── Badge color helper ────────────────────────────────────────────
function typeBadgeColor(taskType: string): 'teal' | 'amethyst' | 'amber' | 'ruby' | 'chartreuse' | 'sapphire' | 'emerald' | 'gray' {
  const map: Record<string, 'teal' | 'amethyst' | 'amber' | 'ruby' | 'chartreuse' | 'sapphire' | 'emerald' | 'gray'> = {
    document_upload: 'teal', meeting: 'amethyst', physical_action: 'amber',
    payment_outgoing: 'ruby', payment_incoming: 'chartreuse', approval: 'sapphire',
    review: 'teal', due_diligence: 'emerald', filing: 'sapphire',
    communication: 'amethyst', automated: 'amber',
  }
  return map[taskType] ?? 'gray'
}
