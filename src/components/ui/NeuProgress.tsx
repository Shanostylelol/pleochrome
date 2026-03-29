'use client'

import { cn } from '@/lib/utils'

export interface NeuProgressProps {
  value: number
  max?: number
  color?: 'teal' | 'emerald' | 'amber' | 'ruby' | 'chartreuse'
  size?: 'sm' | 'md'
  showLabel?: boolean
}

const colorMap = {
  teal: 'bg-[var(--teal)]',
  emerald: 'bg-[var(--emerald)]',
  amber: 'bg-[var(--amber)]',
  ruby: 'bg-[var(--ruby)]',
  chartreuse: 'bg-[var(--chartreuse)]',
}

export function NeuProgress({ value, max = 100, color = 'teal', size = 'sm', showLabel }: NeuProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          'flex-1 rounded-full bg-[var(--bg-input)] shadow-[var(--shadow-pressed)]',
          size === 'sm' ? 'h-2' : 'h-3'
        )}
      >
        <div
          className={cn(
            'h-full rounded-full shadow-[var(--shadow-raised-sm)] transition-[width] duration-300',
            colorMap[color]
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-semibold text-[var(--text-secondary)] tabular-nums min-w-[2.5rem] text-right">
          {Math.round(pct)}%
        </span>
      )}
    </div>
  )
}
