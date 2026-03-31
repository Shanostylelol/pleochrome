'use client'

import { NeuModal } from '@/components/ui/NeuModal'
import { NeuButton } from '@/components/ui/NeuButton'

export interface ConfirmHideModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  entityType: 'stage' | 'task' | 'subtask'
  entityName: string
}

export function ConfirmHideModal({
  open,
  onClose,
  onConfirm,
  entityType,
  entityName,
}: ConfirmHideModalProps) {
  return (
    <NeuModal open={open} onClose={onClose} title={`Hide ${entityType}?`} maxWidth="sm">
      <p className="text-sm text-[var(--text-secondary)] mb-6">
        Are you sure you want to hide {entityType}{' '}
        <span className="font-semibold text-[var(--text-primary)]">&ldquo;{entityName}&rdquo;</span>?
        It can be unhidden later.
      </p>

      <div className="flex items-center justify-end gap-3">
        <NeuButton variant="ghost" size="sm" onClick={onClose}>
          Cancel
        </NeuButton>
        <NeuButton
          variant="danger"
          size="sm"
          onClick={() => {
            onConfirm()
            onClose()
          }}
        >
          Hide
        </NeuButton>
      </div>
    </NeuModal>
  )
}
