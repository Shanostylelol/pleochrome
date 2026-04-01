'use client'

import { useState } from 'react'

interface TaskDetailSectionProps {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
  defaultOpen?: boolean
  count?: number
}

export function TaskDetailSection({ icon, label, children, defaultOpen = false, count }: TaskDetailSectionProps) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div>
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors py-0.5">
        {icon} {label}
        {count != null && count > 0 && <span className="text-[10px] font-bold text-[var(--teal)] ml-0.5">{count}</span>}
        <span className="text-[10px] font-normal">{open ? '▾' : '▸'}</span>
      </button>
      {open && <div className="mt-1">{children}</div>}
    </div>
  )
}
