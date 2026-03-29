'use client'

import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

export interface NeuButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
  loading?: boolean
  fullWidth?: boolean
}

const sizeStyles = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2.5',
}

const variantStyles = {
  primary: 'bg-[var(--teal)] text-white shadow-[var(--shadow-raised-sm)] hover:bg-[var(--teal-light)]',
  ghost: 'bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]',
  danger: 'bg-[var(--ruby)] text-white shadow-[var(--shadow-raised-sm)] hover:bg-[var(--ruby-light)]',
  success: 'bg-[var(--emerald)] text-white shadow-[var(--shadow-raised-sm)] hover:bg-[var(--emerald-light)]',
}

export const NeuButton = forwardRef<HTMLButtonElement, NeuButtonProps>(
  ({ variant = 'primary', size = 'md', icon, loading, fullWidth, className, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-[var(--radius-md)] transition-all',
          'focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:ring-offset-1',
          'neu-btn-press',
          sizeStyles[size],
          variantStyles[variant],
          fullWidth && 'w-full',
          (disabled || loading) && 'opacity-50 cursor-not-allowed shadow-none',
          className
        )}
        {...props}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
        {children}
      </button>
    )
  }
)
NeuButton.displayName = 'NeuButton'
