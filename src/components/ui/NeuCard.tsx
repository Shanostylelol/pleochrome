'use client'

import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface NeuCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'raised' | 'raised-sm' | 'pressed' | 'flat'
  hoverable?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
  as?: 'div' | 'button' | 'article'
}

const paddingMap = {
  none: '',
  sm: 'p-[var(--space-sm)]',
  md: 'p-[var(--space-md)]',
  lg: 'p-[var(--space-lg)]',
}

const variantMap = {
  raised: 'neu-raised',
  'raised-sm': 'neu-raised-sm',
  pressed: 'neu-pressed',
  flat: 'neu-flat',
}

export const NeuCard = forwardRef<HTMLDivElement, NeuCardProps>(
  ({ variant = 'raised', hoverable = false, padding = 'md', as = 'div', className, children, ...props }, ref) => {
    const Component = as as 'div'
    return (
      <Component
        ref={ref}
        className={cn(
          variantMap[variant],
          paddingMap[padding],
          hoverable && 'neu-card-hover cursor-pointer',
          as === 'button' && 'neu-btn-press focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)]',
          className
        )}
        {...props}
      >
        {children}
      </Component>
    )
  }
)
NeuCard.displayName = 'NeuCard'
