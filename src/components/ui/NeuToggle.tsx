'use client'

import { cn } from '@/lib/utils'

export interface NeuToggleProps {
  enabled: boolean
  onChange: (enabled: boolean) => void
  label?: string
  disabled?: boolean
}

export function NeuToggle({ enabled, onChange, label, disabled }: NeuToggleProps) {
  return (
    <label
      className={cn(
        'inline-flex items-center gap-2 cursor-pointer select-none',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        disabled={disabled}
        onClick={() => !disabled && onChange(!enabled)}
        className={cn(
          'relative w-11 h-6 rounded-full transition-colors duration-200',
          'shadow-[var(--shadow-pressed)]',
          'focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)]',
          enabled ? 'bg-[var(--teal)]' : 'bg-[var(--bg-input)]'
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-transform duration-200',
            'bg-[var(--bg-surface)] shadow-[var(--shadow-raised-sm)]',
            enabled && 'translate-x-5'
          )}
        />
      </button>
      {label && <span className="text-sm text-[var(--text-primary)]">{label}</span>}
    </label>
  )
}
