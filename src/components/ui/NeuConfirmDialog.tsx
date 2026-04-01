'use client'

import type { ReactNode } from 'react'
import { NeuModal } from './NeuModal'
import { NeuButton } from './NeuButton'

export interface NeuConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string | ReactNode
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'primary'
  loading?: boolean
}

export function NeuConfirmDialog({
  open, onClose, onConfirm, title, message,
  confirmLabel = 'Confirm', cancelLabel = 'Cancel',
  variant = 'primary', loading = false,
}: NeuConfirmDialogProps) {
  return (
    <NeuModal open={open} onClose={onClose} title={title} maxWidth="sm">
      <div className="space-y-4">
        <p className="text-sm text-[var(--text-secondary)]">{message}</p>
        <div className="flex gap-3 justify-end">
          <NeuButton variant="ghost" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </NeuButton>
          <NeuButton
            onClick={onConfirm}
            loading={loading}
            className={variant === 'danger' ? '!bg-[var(--ruby)] !shadow-none hover:!opacity-90' : ''}
          >
            {confirmLabel}
          </NeuButton>
        </div>
      </div>
    </NeuModal>
  )
}
