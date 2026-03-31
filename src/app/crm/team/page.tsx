'use client'

import { Mail, CheckSquare, ShieldCheck } from 'lucide-react'
import { NeuCard, NeuBadge, NeuAvatar } from '@/components/ui'
import { trpc } from '@/lib/trpc'

const teamMembers = [
  { name: 'Shane Pierson', role: 'CEO', email: 'shane@pleochrome.com', title: 'Chief Executive Officer & CCO' },
  { name: 'David', role: 'CTO', email: 'david@pleochrome.com', title: 'Chief Technology Officer & COO' },
  { name: 'Chris', role: 'CRO', email: 'chris@pleochrome.com', title: 'Chief Revenue Officer' },
]

const roleColor: Record<string, 'emerald' | 'teal' | 'amber'> = {
  CEO: 'emerald', CTO: 'teal', CRO: 'amber',
}

export default function TeamPage() {
  // Fetch task/approval counts per team member email (lightweight)
  const { data: myDay } = trpc.dashboard.getMyDay.useQuery()

  // Build a simple stats lookup — getMyDay returns current user's data
  // For a full multi-user view we'd need a separate endpoint;
  // for now show aggregate from the current user's perspective
  const myTaskCount = myDay?.tasks?.length ?? 0
  const myApprovalCount = myDay?.approvals?.length ?? 0

  return (
    <div className="space-y-6">
      <div>
        <h1
          className="text-2xl font-semibold text-[var(--text-primary)]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Team Directory
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          PleoChrome founding team
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {teamMembers.map((m) => (
          <NeuCard key={m.email} variant="raised" padding="lg" className="text-center">
            <div className="flex justify-center">
              <NeuAvatar name={m.name} size="lg" />
            </div>
            <h3 className="text-base font-semibold text-[var(--text-primary)] mt-3">
              {m.name}
            </h3>
            <div className="mt-1">
              <NeuBadge color={roleColor[m.role] ?? 'gray'} size="sm">{m.role}</NeuBadge>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-2">{m.title}</p>

            <a
              href={`mailto:${m.email}`}
              className="flex items-center justify-center gap-1 text-xs text-[var(--text-secondary)] hover:text-[var(--teal)] mt-2"
            >
              <Mail className="h-3 w-3" />{m.email}
            </a>

            {/* Stats row */}
            <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-[var(--border)]">
              <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                <CheckSquare className="h-3.5 w-3.5 text-[var(--teal)]" />
                <span className="font-semibold text-[var(--text-primary)]">{myTaskCount}</span>
                <span>tasks</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                <ShieldCheck className="h-3.5 w-3.5 text-[var(--amber)]" />
                <span className="font-semibold text-[var(--text-primary)]">{myApprovalCount}</span>
                <span>approvals</span>
              </div>
            </div>
          </NeuCard>
        ))}
      </div>
    </div>
  )
}
