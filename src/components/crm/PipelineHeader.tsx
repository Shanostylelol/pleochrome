'use client'

import { NeuButton, NeuToggle } from '@/components/ui'
import { Plus, LayoutGrid, List, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ViewMode = 'kanban' | 'list' | 'dashboard'

interface PipelineHeaderProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  onNewAsset: () => void
  showArchived?: boolean
  onShowArchivedChange?: (v: boolean) => void
}

export function PipelineHeader({ viewMode, onViewModeChange, onNewAsset, showArchived = false, onShowArchivedChange }: PipelineHeaderProps) {
  return (
    <div className="sticky top-[var(--header-height)] z-20 bg-[var(--bg-body)] pb-3 max-w-full overflow-hidden">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-semibold text-[var(--text-primary)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Pipeline Board
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Track all assets through the governance workflow
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="p-0.5 rounded-[var(--radius-md)] bg-[var(--bg-body)] shadow-[var(--shadow-pressed)] hidden sm:flex">
            <button
              onClick={() => onViewModeChange('dashboard')}
              className={cn(
                'p-2 rounded-[var(--radius-sm)] transition-all',
                viewMode === 'dashboard'
                  ? 'bg-[var(--bg-surface)] shadow-[var(--shadow-raised-sm)] text-[var(--text-primary)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              )}
              aria-label="Dashboard view"
            >
              <BarChart3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => onViewModeChange('kanban')}
              className={cn(
                'p-2 rounded-[var(--radius-sm)] transition-all',
                viewMode === 'kanban'
                  ? 'bg-[var(--bg-surface)] shadow-[var(--shadow-raised-sm)] text-[var(--text-primary)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              )}
              aria-label="Kanban view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={cn(
                'p-2 rounded-[var(--radius-sm)] transition-all',
                viewMode === 'list'
                  ? 'bg-[var(--bg-surface)] shadow-[var(--shadow-raised-sm)] text-[var(--text-primary)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              )}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
          {onShowArchivedChange && (
            <label className="hidden lg:flex items-center gap-1.5 cursor-pointer select-none">
              <NeuToggle enabled={showArchived} onChange={onShowArchivedChange} />
              <span className="text-xs text-[var(--text-muted)]">Archived</span>
            </label>
          )}
          <NeuButton icon={<Plus className="h-4 w-4" />} onClick={onNewAsset}>
            <span className="hidden sm:inline">New Asset</span>
          </NeuButton>
        </div>
      </div>
    </div>
  )
}
