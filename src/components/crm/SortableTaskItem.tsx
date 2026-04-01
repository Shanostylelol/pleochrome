'use client'

import { GripVertical } from 'lucide-react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { TaskCard, type Task } from './TaskCard'
import { type Subtask } from './SubtaskChecklist'
import type { TaskStatusKey, TaskTypeKey } from '@/lib/constants'

// ── Props ─────────────────────────────────────────────────
export interface SortableTaskItemProps {
  task: Task
  subtasks: Subtask[]
  onCompleteTask: (taskId: string) => void
  onHideTask: (taskId: string) => void
  onAddSubtask: (taskId: string, title: string, subtaskType?: string) => void
  onReorderSubtasks: (taskId: string, subtaskIds: string[]) => void
  onUpdateTaskStatus?: (taskId: string, status: TaskStatusKey) => void
  onDeleteTask?: (taskId: string) => void
  onUpdateTask?: (taskId: string, fields: {
    title?: string; description?: string; notes?: string;
    taskType?: TaskTypeKey; dueDate?: string | null; assignedTo?: string | null
  }) => void
  onDeleteSubtask?: (subtaskId: string) => void
  onUpdateSubtask?: (subtaskId: string, fields: { title?: string; subtaskType?: string; notes?: string; status?: string }) => void
  onCompleteSubtask?: (subtaskId: string) => void
}

// ── Sortable task wrapper ─────────────────────────────────
export function SortableTaskItem({
  task,
  subtasks,
  onCompleteTask,
  onHideTask,
  onAddSubtask,
  onReorderSubtasks,
  onUpdateTaskStatus,
  onDeleteTask,
  onUpdateTask,
  onDeleteSubtask,
  onUpdateSubtask,
  onCompleteSubtask,
}: SortableTaskItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    position: 'relative' as const,
    zIndex: isDragging ? 10 : undefined,
  }

  return (
    <div ref={setNodeRef} style={style} className="flex items-start gap-1">
      <button
        ref={setActivatorNodeRef}
        {...listeners}
        {...attributes}
        className="mt-3 p-2 text-[var(--text-placeholder)] hover:text-[var(--text-muted)] cursor-grab active:cursor-grabbing shrink-0 hidden sm:block"
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <div className="flex-1 min-w-0">
        <TaskCard
          task={task}
          subtasks={subtasks}
          onComplete={onCompleteTask}
          onHide={onHideTask}
          onAddSubtask={onAddSubtask}
          onReorderSubtasks={onReorderSubtasks}
          onUpdateStatus={onUpdateTaskStatus}
          onDelete={onDeleteTask}
          onUpdate={onUpdateTask}
          onDeleteSubtask={onDeleteSubtask}
          onUpdateSubtask={onUpdateSubtask}
          onCompleteSubtask={onCompleteSubtask}
        />
      </div>
    </div>
  )
}
