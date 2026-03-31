'use client'

import { useState, useRef, useEffect, type KeyboardEvent } from 'react'
import { Plus, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SUBTASK_TYPES, type SubtaskTypeKey } from '@/lib/constants'
import { SUBTASK_STATUSES } from '@/lib/constants'
import {
  DndContext, DragOverlay, closestCenter, type DragEndEvent, type DragStartEvent,
  PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core'
import {
  SortableContext, verticalListSortingStrategy, arrayMove,
} from '@dnd-kit/sortable'
import { SortableSubtaskRow } from './SortableSubtaskRow'

export interface Subtask {
  id: string
  title: string
  status: keyof typeof SUBTASK_STATUSES
  subtask_type?: string
  notes?: string
  assignee?: { name: string; avatar_url?: string }
}

export interface SubtaskChecklistProps {
  subtasks: Subtask[]
  taskId: string
  assetId?: string
  currentUserId: string
  onComplete: (subtaskId: string) => void
  onAddSubtask: (title: string, subtaskType?: string) => void
  onDelete?: (subtaskId: string) => void
  onUpdate?: (subtaskId: string, fields: { title?: string; subtaskType?: string; notes?: string; status?: string }) => void
  onReorder?: (subtaskIds: string[]) => void
}

const SUBTASK_TYPE_KEYS = Object.keys(SUBTASK_TYPES) as SubtaskTypeKey[]

export function SubtaskChecklist({
  subtasks, taskId, assetId, currentUserId,
  onComplete, onAddSubtask, onDelete, onUpdate, onReorder,
}: SubtaskChecklistProps) {
  const [newTitle, setNewTitle] = useState('')
  const [newType, setNewType] = useState<string>('')
  const [isAdding, setIsAdding] = useState(false)
  const [activeDragId, setActiveDragId] = useState<string | null>(null)
  const [newlyCreatedId, setNewlyCreatedId] = useState<string | null>(null)
  const prevCountRef = useRef(subtasks.length)

  // Detect newly added subtask and auto-expand it
  useEffect(() => {
    if (subtasks.length > prevCountRef.current) {
      const lastSubtask = subtasks[subtasks.length - 1]
      if (lastSubtask?.subtask_type) setNewlyCreatedId(lastSubtask.id)
    }
    prevCountRef.current = subtasks.length
  }, [subtasks])

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))
  const subtaskIds = subtasks.map((s) => s.id)

  function handleAdd() {
    const trimmed = newTitle.trim()
    if (!trimmed) return
    onAddSubtask(trimmed, newType || undefined)
    setNewTitle('')
    setNewType('')
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleAdd()
    if (e.key === 'Escape') { setNewTitle(''); setNewType(''); setIsAdding(false) }
  }

  function handleDragStart(event: DragStartEvent) { setActiveDragId(event.active.id as string) }

  function handleDragEnd(event: DragEndEvent) {
    setActiveDragId(null)
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIdx = subtaskIds.indexOf(active.id as string)
    const newIdx = subtaskIds.indexOf(over.id as string)
    if (oldIdx === -1 || newIdx === -1) return
    onReorder?.(arrayMove(subtaskIds, oldIdx, newIdx))
  }

  return (
    <div className="space-y-0.5">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <SortableContext items={subtaskIds} strategy={verticalListSortingStrategy}>
          {subtasks.map((st) => (
            <SortableSubtaskRow key={st.id} st={st} taskId={taskId} assetId={assetId}
              currentUserId={currentUserId} autoExpand={st.id === newlyCreatedId}
              onComplete={onComplete} onDelete={onDelete} onUpdate={onUpdate} />
          ))}
        </SortableContext>
        <DragOverlay>
          {activeDragId && (() => {
            const st = subtasks.find(s => s.id === activeDragId)
            if (!st) return null
            return (
              <div className="px-3 py-2 bg-[var(--bg-surface)] shadow-[var(--shadow-raised)] rounded-[var(--radius-sm)] text-sm text-[var(--text-primary)] max-w-xs truncate">
                {st.title}
              </div>
            )
          })()}
        </DragOverlay>
      </DndContext>

      {/* Add subtask */}
      {isAdding ? (
        <div className="flex items-center gap-2 pt-1 px-1">
          <select value={newType} onChange={(e) => setNewType(e.target.value)}
            className={cn('h-7 text-[11px] rounded-[var(--radius-sm)] px-1',
              'bg-[var(--bg-input)] text-[var(--text-secondary)]',
              'shadow-[var(--shadow-pressed)] border border-[var(--border)]',
              'focus:outline-none focus:border-[var(--teal)]')}>
            <option value="">No type</option>
            {SUBTASK_TYPE_KEYS.map((key) => (
              <option key={key} value={key}>{SUBTASK_TYPES[key].label}</option>
            ))}
          </select>
          <input value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Subtask title..."
            className={cn('flex-1 h-7 text-sm rounded-[var(--radius-sm)] px-2',
              'bg-[var(--bg-input)] text-[var(--text-primary)] placeholder:text-[var(--text-placeholder)]',
              'shadow-[var(--shadow-pressed)] border border-[var(--border)]',
              'focus:outline-none focus:border-[var(--teal)]')} />
          <button onClick={() => { setIsAdding(false); setNewTitle(''); setNewType('') }}
            className="p-1 text-[var(--text-muted)] hover:text-[var(--ruby)] transition-colors shrink-0"
            title="Cancel">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <button onClick={() => setIsAdding(true)}
          className={cn('flex items-center gap-1.5 text-xs font-medium text-[var(--text-muted)]',
            'hover:text-[var(--teal)] transition-colors py-1 px-2')}>
          <Plus className="h-3.5 w-3.5" />
          Add Subtask
        </button>
      )}
    </div>
  )
}
