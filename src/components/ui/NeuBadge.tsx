'use client'

import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface NeuBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  color: 'emerald' | 'teal' | 'sapphire' | 'amethyst' | 'ruby' | 'amber' | 'chartreuse' | 'gray'
  size?: 'sm' | 'md'
  dot?: boolean
}

const colorMap = {
  emerald: 'bg-[var(--emerald-bg)] text-[var(--emerald)]',
  teal: 'bg-[var(--teal-bg)] text-[var(--teal)]',
  sapphire: 'bg-[var(--sapphire-bg)] text-[var(--sapphire)]',
  amethyst: 'bg-[var(--amethyst-bg)] text-[var(--amethyst)]',
  ruby: 'bg-[var(--ruby-bg)] text-[var(--ruby)]',
  amber: 'bg-[var(--amber-bg)] text-[var(--amber)]',
  chartreuse: 'bg-[var(--chartreuse-bg)] text-[var(--chartreuse)]',
  gray: 'bg-[var(--bg-elevated)] text-[var(--text-muted)]',
}

const dotColorMap = {
  emerald: 'bg-[var(--emerald)]',
  teal: 'bg-[var(--teal)]',
  sapphire: 'bg-[var(--sapphire)]',
  amethyst: 'bg-[var(--amethyst)]',
  ruby: 'bg-[var(--ruby)]',
  amber: 'bg-[var(--amber)]',
  chartreuse: 'bg-[var(--chartreuse)]',
  gray: 'bg-[var(--text-muted)]',
}

export function NeuBadge({ color, size = 'sm', dot, className, children, ...props }: NeuBadgeProps) {
  if (dot) {
    return (
      <span
        className={cn('inline-block w-2 h-2 rounded-full', dotColorMap[color], className)}
        {...props}
      />
    )
  }

  return (
    <span
      className={cn(
        'inline-flex items-center font-semibold uppercase tracking-wider rounded-full',
        'shadow-[2px_2px_4px_rgba(0,0,0,0.15),-1px_-1px_3px_rgba(255,255,255,0.05)]',
        colorMap[color],
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-3 py-1 text-xs',
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
