'use client'

import { cn } from '@/lib/utils'

type PathFilter = 'fractional_securities' | 'tokenization' | 'debt_instrument' | 'broker_sale' | 'barter'

const PATH_FILTERS: { label: string; value: PathFilter | null; color: string }[] = [
  { label: 'All', value: null, color: 'var(--text-muted)' },
  { label: 'Fractional', value: 'fractional_securities', color: 'var(--emerald)' },
  { label: 'Tokenization', value: 'tokenization', color: 'var(--teal)' },
  { label: 'Debt', value: 'debt_instrument', color: 'var(--sapphire)' },
  { label: 'Broker', value: 'broker_sale', color: 'var(--amber)' },
  { label: 'Barter', value: 'barter', color: 'var(--amethyst)' },
]

interface PipelineFilterBarProps {
  pathFilter: PathFilter | null
  onPathFilterChange: (value: PathFilter | null) => void
  assetCount: number
}

export function PipelineFilterBar({ pathFilter, onPathFilterChange, assetCount }: PipelineFilterBarProps) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="p-1 rounded-[var(--radius-lg)] bg-[var(--bg-body)] shadow-[var(--shadow-pressed)] inline-flex gap-1">
        {PATH_FILTERS.map((f) => {
          const isActive = pathFilter === f.value
          return (
            <button
              key={f.label}
              onClick={() => onPathFilterChange(isActive && f.value !== null ? null : f.value)}
              className={cn(
                'px-4 py-2 rounded-[var(--radius-md)] text-sm font-medium transition-all',
                'focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)]',
                isActive
                  ? 'text-white shadow-[var(--shadow-raised-sm)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)] shadow-[var(--shadow-raised-sm)] bg-[var(--bg-surface)]'
              )}
              style={isActive ? { backgroundColor: f.color } : undefined}
            >
              {f.label}
            </button>
          )
        })}
      </div>
      <span className="text-xs text-[var(--text-muted)]">{assetCount} assets</span>
    </div>
  )
}
