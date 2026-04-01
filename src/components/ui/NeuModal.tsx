'use client'

import { useEffect, useCallback, useRef, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NeuCard } from './NeuCard'

const FOCUSABLE = 'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])'

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
  const containerRef = useRef<HTMLDivElement>(null)
  const previousFocus = useRef<HTMLElement | null>(null)

  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') { onClose(); return }
    if (e.key !== 'Tab' || !containerRef.current) return
    const focusable = Array.from(containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE))
    if (!focusable.length) return
    const first = focusable[0], last = focusable[focusable.length - 1]
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus() }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus() }
    }
  }, [onClose])

  useEffect(() => {
    if (!open) return
    previousFocus.current = document.activeElement as HTMLElement
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'
    // Focus first focusable element
    requestAnimationFrame(() => {
      const focusable = containerRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE)
      focusable?.[0]?.focus()
    })
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
      previousFocus.current?.focus()
    }
  }, [open, handleEscape])

  return (
    <AnimatePresence>
    {open && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <motion.div
        className="absolute inset-0 bg-[var(--overlay)]"
        onClick={onClose}
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
      />

      {/* Modal content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        className={cn('relative z-10 w-full', maxWidthClasses[maxWidth])}
      >
      <NeuCard
        ref={containerRef}
        variant="raised"
        padding="lg"
        className={cn('w-full max-h-[80vh] sm:max-h-[90vh] overflow-y-auto', className)}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2
            id="modal-title"
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
      </motion.div>
    </div>
    )}
    </AnimatePresence>
  )
}
