'use client'

import { forwardRef, type SelectHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'

export interface NeuSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
  placeholder?: string
}

export const NeuSelect = forwardRef<HTMLSelectElement, NeuSelectProps>(
  ({ label, error, options, placeholder, className, id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-xs font-semibold text-[var(--text-secondary)]">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'w-full h-11 rounded-[var(--radius-md)] border px-3 pr-10 text-sm appearance-none',
              'bg-[var(--bg-input)] text-[var(--text-primary)]',
              'shadow-[var(--shadow-pressed)] border-[var(--border)]',
              'transition-all duration-200',
              'focus:outline-none focus:border-[var(--teal)] focus:shadow-[var(--shadow-pressed),0_0_0_2px_rgba(26,139,122,0.3)]',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              error && 'border-[var(--ruby)]',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)] pointer-events-none" />
        </div>
        {error && <p className="text-xs text-[var(--ruby)]">{error}</p>}
      </div>
    )
  }
)
NeuSelect.displayName = 'NeuSelect'
