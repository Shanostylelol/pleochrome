'use client'

import { useState, useRef, useEffect } from 'react'
import { X, GripVertical, ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NeuCheckbox } from '@/components/ui/NeuCheckbox'
import { NeuBadge } from '@/components/ui/NeuBadge'
import { SUBTASK_STATUSES, SUBTASK_TYPES, type SubtaskTypeKey } from '@/lib/constants'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { SubtaskTypeRenderer } from './SubtaskTypeRenderer'
import type { Subtask } from './SubtaskChecklist'

const statusColorMap: Record<keyof typeof SUBTASK_STATUSES, 'gray' | 'teal' | 'chartreuse' | 'amber' | 'ruby'> = {
  todo: 'gray', in_progress: 'teal', pending_approval: 'amber',
  approved: 'chartreuse', rejected: 'ruby', done: 'chartreuse', cancelled: 'gray',
}
const STATUS_CYCLE: (keyof typeof SUBTASK_STATUSES)[] = ['todo', 'in_progress', 'done']
const SUBTASK_TYPE_KEYS = Object.keys(SUBTASK_TYPES) as SubtaskTypeKey[]

interface SortableSubtaskRowProps {
  st: Subtask
  taskId: string
  assetId?: string
  currentUserId: string
  autoExpand?: boolean
  onComplete: (id: string) => void
  onDelete?: (id: string) => void
  onUpdate?: (id: string, fields: { title?: string; subtaskType?: string; notes?: string; status?: string }) => void
}

export function SortableSubtaskRow({ st, taskId, assetId, currentUserId, autoExpand, onComplete, onDelete, onUpdate }: SortableSubtaskRowProps) {
  const [editing, setEditing] = useState(false)
  const [titleVal, setTitleVal] = useState(st.title)
  const [expanded, setExpanded] = useState(!!autoExpand)
  const [typeMenuOpen, setTypeMenuOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const { setNodeRef, setActivatorNodeRef, listeners, attributes, transform, transition, isDragging } = useSortable({ id: st.id })

  useEffect(() => { if (editing) inputRef.current?.focus() }, [editing])
  useEffect(() => { if (autoExpand) setExpanded(true) }, [autoExpand])

  const isDone = st.status === 'done'
  const cfg = SUBTASK_STATUSES[st.status]
  const typeKey = st.subtask_type as SubtaskTypeKey | undefined
  const typeCfg = typeKey && typeKey in SUBTASK_TYPES ? SUBTASK_TYPES[typeKey] : null

  function handleTitleSubmit() {
    const trimmed = titleVal.trim()
    if (trimmed && trimmed !== st.title) onUpdate?.(st.id, { title: trimmed })
    else setTitleVal(st.title)
    setEditing(false)
  }

  function handleStatusCycle(e: React.MouseEvent) {
    e.stopPropagation()
    const idx = STATUS_CYCLE.indexOf(st.status)
    const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length]
    if (next === 'done') onComplete(st.id)
    else onUpdate?.(st.id, { status: next })
  }

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    zIndex: isDragging ? 10 : undefined,
  }

  return (
    <div ref={setNodeRef} style={style}>
      <div className={cn(
        'group/subtask flex items-center gap-1.5 py-1.5 px-1 rounded-[var(--radius-sm)] transition-colors',
        'hover:bg-[var(--bg-elevated)]',
        expanded && 'bg-[var(--bg-elevated)]'
      )}>
        {/* Drag handle */}
        <button ref={setActivatorNodeRef} {...listeners} {...attributes} aria-label="Drag to reorder"
          className="p-2 text-[var(--text-placeholder)] hover:text-[var(--text-muted)] cursor-grab active:cursor-grabbing shrink-0 opacity-0 group-hover/subtask:opacity-100 transition-opacity">
          <GripVertical className="h-4 w-4" />
        </button>

        {/* Expand chevron */}
        <button onClick={(e) => { e.stopPropagation(); setExpanded(!expanded) }} aria-label="Expand subtask"
          className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors shrink-0">
          {expanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        </button>

        {/* Checkbox */}
        <NeuCheckbox checked={isDone} onChange={() => onComplete(st.id)} color={isDone ? 'emerald' : 'teal'} />

        {/* Type badge dropdown */}
        <div className="relative shrink-0">
          <button onClick={(e) => { e.stopPropagation(); setTypeMenuOpen(!typeMenuOpen) }}
            className={cn(
              'inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[var(--radius-sm)] text-[10px] font-medium transition-colors',
              'border border-[var(--border)] hover:border-[var(--text-muted)]',
              typeCfg ? '' : 'border-dashed'
            )}
            style={typeCfg ? { color: typeCfg.color } : undefined}>
            {typeCfg ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: typeCfg.color }} />
                {typeCfg.label}
              </>
            ) : (
              <span className="text-[var(--text-placeholder)]">Type</span>
            )}
          </button>
          {typeMenuOpen && (
            <div className="absolute left-0 top-6 z-30 neu-raised-sm p-1 min-w-[140px] max-h-48 overflow-y-auto">
              {SUBTASK_TYPE_KEYS.map((key) => (
                <button key={key} onClick={(e) => { e.stopPropagation(); onUpdate?.(st.id, { subtaskType: key }); setTypeMenuOpen(false) }}
                  className={cn('flex items-center gap-2 w-full px-2 py-1.5 text-[11px] rounded-[var(--radius-sm)]',
                    'hover:bg-[var(--bg-elevated)] transition-colors',
                    key === typeKey ? 'font-medium text-[var(--text-primary)]' : 'text-[var(--text-secondary)]')}>
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: SUBTASK_TYPES[key].color }} />
                  {SUBTASK_TYPES[key].label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Title (inline editable) */}
        {editing ? (
          <input ref={inputRef} value={titleVal}
            onChange={(e) => setTitleVal(e.target.value)}
            onBlur={handleTitleSubmit}
            onKeyDown={(e) => { if (e.key === 'Enter') handleTitleSubmit(); if (e.key === 'Escape') { setTitleVal(st.title); setEditing(false) } }}
            className={cn('flex-1 h-6 text-sm rounded-[var(--radius-sm)] px-1.5',
              'bg-[var(--bg-input)] text-[var(--text-primary)]',
              'shadow-[var(--shadow-pressed)] border border-[var(--border)]',
              'focus:outline-none focus:border-[var(--teal)]')} />
        ) : (
          <span onClick={() => setExpanded(!expanded)}
            onDoubleClick={(e) => { e.stopPropagation(); if (onUpdate) setEditing(true) }}
            className={cn('flex-1 text-sm min-w-0 truncate cursor-pointer',
              isDone ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]')}>
            {st.title}
          </span>
        )}

        {/* Status badge (clickable to cycle) */}
        <button onClick={handleStatusCycle} title="Click to cycle status"
          className="shrink-0 transition-transform hover:scale-105">
          <NeuBadge color={statusColorMap[st.status]} size="sm">{cfg.label}</NeuBadge>
        </button>

        {/* Delete */}
        {onDelete && (
          <button onClick={(e) => { e.stopPropagation(); onDelete(st.id) }}
            className={cn('p-1.5 rounded-[var(--radius-sm)] opacity-0 group-hover/subtask:opacity-100',
              'text-[var(--text-muted)] hover:text-[var(--ruby)] transition-all shrink-0')}
            title="Delete subtask">
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Expanded: type-specific renderer + files + comments */}
      {expanded && (
        <SubtaskTypeRenderer
          subtask={st}
          taskId={taskId}
          assetId={assetId}
          currentUserId={currentUserId}
          onUpdate={(id: string, fields: { title?: string; subtaskType?: string; notes?: string; status?: string }) => onUpdate?.(id, fields)}
        />
      )}
    </div>
  )
}
