'use client'

import { useState } from 'react'

interface TaskDetailSectionProps {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}

export function TaskDetailSection({ icon, label, children }: TaskDetailSectionProps) {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors py-0.5">
        {icon} {label}
        <span className="text-[10px] font-normal">{open ? '▾' : '▸'}</span>
      </button>
      {open && <div className="mt-1">{children}</div>}
    </div>
  )
}
