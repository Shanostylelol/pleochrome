'use client'

import { useState } from 'react'
import { Plus, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NeuButton } from '@/components/ui/NeuButton'

interface StageFooterProps {
  stageId: string
  onAddTask: (stageId: string) => void
  onHideStage: (stageId: string) => void
}

export function StageFooter({ stageId, onAddTask, onHideStage }: StageFooterProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border)]">
      <NeuButton variant="ghost" size="sm" icon={<Plus className="h-3.5 w-3.5" />}
        onClick={() => onAddTask(stageId)}>
        Add Task
      </NeuButton>

      <div className="relative">
        <button
          onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen) }}
          className="p-2 rounded-[var(--radius-sm)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          aria-label="Stage options">
          <EyeOff className="h-3.5 w-3.5" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 bottom-8 z-20 neu-raised-sm p-1 min-w-[150px]">
            <button
              onClick={() => { onHideStage(stageId); setMenuOpen(false) }}
              className={cn(
                'flex items-center gap-2 w-full px-3 py-2 text-sm rounded-[var(--radius-sm)]',
                'text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] transition-colors'
              )}>
              <EyeOff className="h-3.5 w-3.5" /> Hide Stage
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
