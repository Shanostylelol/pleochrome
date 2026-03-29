'use client'

import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface NeuInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  icon?: React.ReactNode
}

export const NeuInput = forwardRef<HTMLInputElement, NeuInputProps>(
  ({ label, error, helperText, icon, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold text-[var(--text-secondary)]">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full h-11 rounded-[var(--radius-md)] border px-3 text-sm',
              'bg-[var(--bg-input)] text-[var(--text-primary)] placeholder:text-[var(--text-placeholder)]',
              'shadow-[var(--shadow-pressed)] border-[var(--border)]',
              'transition-all duration-200',
              'focus:outline-none focus:border-[var(--teal)] focus:shadow-[var(--shadow-pressed),0_0_0_2px_rgba(26,139,122,0.3)]',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              error && 'border-[var(--ruby)] focus:border-[var(--ruby)] focus:shadow-[var(--shadow-pressed),0_0_0_2px_rgba(166,29,58,0.3)]',
              icon && 'pl-10',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-[var(--ruby)]">{error}</p>}
        {!error && helperText && <p className="text-xs text-[var(--text-muted)]">{helperText}</p>}
      </div>
    )
  }
)
NeuInput.displayName = 'NeuInput'

export interface NeuTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
}

export const NeuTextarea = forwardRef<HTMLTextAreaElement, NeuTextareaProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold text-[var(--text-secondary)]">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            'w-full min-h-[80px] rounded-[var(--radius-md)] border px-3 py-2.5 text-sm resize-y',
            'bg-[var(--bg-input)] text-[var(--text-primary)] placeholder:text-[var(--text-placeholder)]',
            'shadow-[var(--shadow-pressed)] border-[var(--border)]',
            'transition-all duration-200',
            'focus:outline-none focus:border-[var(--teal)] focus:shadow-[var(--shadow-pressed),0_0_0_2px_rgba(26,139,122,0.3)]',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-[var(--ruby)]',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-[var(--ruby)]">{error}</p>}
        {!error && helperText && <p className="text-xs text-[var(--text-muted)]">{helperText}</p>}
      </div>
    )
  }
)
NeuTextarea.displayName = 'NeuTextarea'
