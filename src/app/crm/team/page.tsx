'use client'

import { Users, Mail } from 'lucide-react'
import { NeuCard, NeuBadge, NeuAvatar } from '@/components/ui'

const teamMembers = [
  { name: 'Shane Pierson', role: 'CEO', email: 'shane@pleochrome.com', title: 'Chief Executive Officer & CCO' },
  { name: 'David', role: 'CTO', email: 'david@pleochrome.com', title: 'Chief Technology Officer & COO' },
  { name: 'Chris', role: 'CRO', email: 'chris@pleochrome.com', title: 'Chief Revenue Officer' },
]

const roleColor: Record<string, 'emerald' | 'teal' | 'amber'> = {
  CEO: 'emerald', CTO: 'teal', CRO: 'amber',
}

export default function TeamPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
          Team
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">PleoChrome founding team</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {teamMembers.map((m) => (
          <NeuCard key={m.email} variant="raised" padding="lg" className="text-center">
            <NeuAvatar name={m.name} size="lg" />
            <h3 className="text-base font-semibold text-[var(--text-primary)] mt-3">{m.name}</h3>
            <NeuBadge color={roleColor[m.role] ?? 'gray'} size="sm">{m.role}</NeuBadge>
            <p className="text-xs text-[var(--text-muted)] mt-2">{m.title}</p>
            <a href={`mailto:${m.email}`} className="flex items-center justify-center gap-1 text-xs text-[var(--text-secondary)] hover:text-[var(--teal)] mt-2">
              <Mail className="h-3 w-3" />{m.email}
            </a>
          </NeuCard>
        ))}
      </div>
    </div>
  )
}
