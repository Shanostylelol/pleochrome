'use client'

import { Mail, CheckSquare, AlertCircle } from 'lucide-react'
import { NeuCard, NeuBadge, NeuAvatar, NeuSkeleton } from '@/components/ui'
import { trpc } from '@/lib/trpc'

const roleColor: Record<string, 'emerald' | 'teal' | 'amber' | 'gray'> = {
  admin: 'emerald', ceo: 'emerald', cto: 'teal', cro: 'amber',
}

const ROLE_TITLE: Record<string, string> = {
  admin: 'Administrator',
  ceo: 'Chief Executive Officer',
  cto: 'Chief Technology Officer',
  cro: 'Chief Revenue Officer',
}

export default function TeamPage() {
  const { data: members = [], isLoading } = trpc.team.getWorkload.useQuery()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
          Team Directory
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          {members.length} team member{members.length !== 1 ? 's' : ''}
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <NeuSkeleton variant="card" /><NeuSkeleton variant="card" /><NeuSkeleton variant="card" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(members as { id: string; full_name: string; email: string; role: string; open: number; blocked: number; completed: number }[]).map((m) => (
            <NeuCard key={m.id} variant="raised" padding="lg" className="text-center">
              <div className="flex justify-center">
                <NeuAvatar name={m.full_name} size="lg" />
              </div>
              <h3 className="text-base font-semibold text-[var(--text-primary)] mt-3">{m.full_name}</h3>
              <div className="mt-1">
                <NeuBadge color={roleColor[m.role?.toLowerCase()] ?? 'gray'} size="sm">
                  {m.role?.toUpperCase()}
                </NeuBadge>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-2">
                {ROLE_TITLE[m.role?.toLowerCase()] ?? m.role}
              </p>
              <a href={`mailto:${m.email}`}
                className="flex items-center justify-center gap-1 text-xs text-[var(--text-secondary)] hover:text-[var(--teal)] mt-2 transition-colors">
                <Mail className="h-3 w-3" />{m.email}
              </a>

              {/* Live workload stats */}
              <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-[var(--border)]">
                <div className="flex flex-col items-center gap-0.5">
                  <div className="flex items-center gap-1 text-xs">
                    <CheckSquare className="h-3.5 w-3.5 text-[var(--teal)]" />
                    <span className="font-bold text-[var(--text-primary)]">{m.open}</span>
                  </div>
                  <span className="text-[10px] text-[var(--text-muted)]">open</span>
                </div>
                {m.blocked > 0 && (
                  <div className="flex flex-col items-center gap-0.5">
                    <div className="flex items-center gap-1 text-xs">
                      <AlertCircle className="h-3.5 w-3.5 text-[var(--ruby)]" />
                      <span className="font-bold text-[var(--ruby)]">{m.blocked}</span>
                    </div>
                    <span className="text-[10px] text-[var(--text-muted)]">blocked</span>
                  </div>
                )}
                <div className="flex flex-col items-center gap-0.5">
                  <span className="font-bold text-[var(--text-primary)] text-xs">{m.completed}</span>
                  <span className="text-[10px] text-[var(--text-muted)]">done</span>
                </div>
              </div>
            </NeuCard>
          ))}
        </div>
      )}
    </div>
  )
}
