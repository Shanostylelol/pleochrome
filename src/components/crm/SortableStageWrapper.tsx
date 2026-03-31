'use client'

import { GripVertical } from 'lucide-react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

// ── Sortable stage wrapper ────────────────────────────────
export function SortableStageWrapper({ id, children }: { id: string; children: React.ReactNode }) {
  const { setNodeRef, setActivatorNodeRef, listeners, attributes, transform, transition, isDragging } = useSortable({ id })
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : undefined, zIndex: isDragging ? 10 : undefined, position: 'relative' as const }
  return (
    <div ref={setNodeRef} style={style} className="flex items-start gap-1">
      <button ref={setActivatorNodeRef} {...listeners} {...attributes}
        className="mt-4 p-2 text-[var(--text-placeholder)] hover:text-[var(--text-muted)] cursor-grab active:cursor-grabbing shrink-0"
        aria-label="Drag to reorder">
        <GripVertical className="h-4 w-4" />
      </button>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  )
}
