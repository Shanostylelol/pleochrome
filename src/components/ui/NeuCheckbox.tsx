'use client'

import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

export interface NeuCheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  disabled?: boolean
  color?: 'teal' | 'emerald' | 'ruby'
}

const colorMap = {
  teal: 'bg-[var(--teal)]',
  emerald: 'bg-[var(--emerald)]',
  ruby: 'bg-[var(--ruby)]',
}

export function NeuCheckbox({ checked, onChange, label, disabled, color = 'teal' }: NeuCheckboxProps) {
  return (
    <label
      className={cn(
        'inline-flex items-center gap-2 cursor-pointer select-none',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          'flex items-center justify-center w-5 h-5 rounded-[var(--radius-sm)] border transition-all',
          'focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)]',
          checked
            ? cn(colorMap[color], 'border-transparent shadow-[var(--shadow-raised-sm)]')
            : 'bg-[var(--bg-input)] border-[var(--border)] shadow-[var(--shadow-pressed)]'
        )}
      >
        {checked && <Check className="h-3.5 w-3.5 text-[var(--text-on-accent)]" strokeWidth={3} />}
      </button>
      {label && <span className="text-sm text-[var(--text-primary)]">{label}</span>}
    </label>
  )
}
