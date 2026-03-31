'use client'

import { useEffect, useCallback, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NeuCard } from './NeuCard'

export interface NeuModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  className?: string
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-4xl',
}

export function NeuModal({ open, onClose, title, children, maxWidth = 'md', className }: NeuModalProps) {
  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    if (!open) return
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [open, handleEscape])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-[var(--overlay)]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal content */}
      <NeuCard
        variant="raised"
        padding="lg"
        className={cn(
          'relative z-10 w-full max-h-[90vh] overflow-y-auto',
          maxWidthClasses[maxWidth],
          className,
        )}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2
            className="text-lg font-semibold text-[var(--text-primary)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-[var(--radius-sm)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--gray-bg)] transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        {children}
      </NeuCard>
    </div>
  )
}
