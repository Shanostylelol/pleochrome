'use client'

import { cn } from '@/lib/utils'

export interface NeuSkeletonProps {
  variant?: 'text' | 'card' | 'avatar' | 'button'
  lines?: number
  className?: string
}

const textWidths = ['w-full', 'w-4/5', 'w-3/5', 'w-5/6', 'w-2/3', 'w-full', 'w-3/4']

export function NeuSkeleton({ variant = 'text', lines = 3, className }: NeuSkeletonProps) {
  if (variant === 'avatar') {
    return (
      <div
        className={cn(
          'neu-skeleton h-10 w-10 rounded-full',
          className
        )}
      />
    )
  }

  if (variant === 'button') {
    return (
      <div
        className={cn(
          'neu-skeleton h-10 w-24 rounded-[var(--radius-md)]',
          className
        )}
      />
    )
  }

  if (variant === 'card') {
    return (
      <div
        className={cn(
          'neu-skeleton h-32 w-full rounded-[var(--radius-md)]',
          className
        )}
      />
    )
  }

  // Text variant — horizontal bars with varying widths
  return (
    <div className={cn('space-y-2.5', className)}>
      {Array.from({ length: lines }, (_, i) => (
        <div
          key={i}
          className={cn(
            'neu-skeleton h-3.5 rounded',
            textWidths[i % textWidths.length]
          )}
        />
      ))}
    </div>
  )
}

NeuSkeleton.displayName = 'NeuSkeleton'
