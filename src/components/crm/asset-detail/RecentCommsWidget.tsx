'use client'

import Link from 'next/link'
import { Phone, Mail, MessageSquare, Video } from 'lucide-react'
import { NeuCard, NeuBadge } from '@/components/ui'
import { trpc } from '@/lib/trpc'

const TYPE_ICON: Record<string, React.ReactNode> = {
  call: <Phone className="h-3.5 w-3.5" />,
  email: <Mail className="h-3.5 w-3.5" />,
  meeting: <Video className="h-3.5 w-3.5" />,
  note: <MessageSquare className="h-3.5 w-3.5" />,
}

const TYPE_COLOR: Record<string, string> = {
  call: 'var(--teal)', email: 'var(--sapphire)', meeting: 'var(--amethyst)', note: 'var(--text-muted)',
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export function RecentCommsWidget({ assetId }: { assetId: string }) {
  const { data: comms = [] } = trpc.communications.listByAsset.useQuery({ assetId, limit: 5 })

  if (comms.length === 0) return null

  return (
    <NeuCard variant="raised" padding="md">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">Recent Communications</h3>
        <Link href={`/crm/assets/${assetId}?tab=communications`}
          className="text-xs text-[var(--teal)] hover:text-[var(--text-primary)] transition-colors">
          View all →
        </Link>
      </div>
      <div className="space-y-2">
        {(comms as Record<string, unknown>[]).map((c) => {
          const performer = c.team_members as { full_name: string } | null
          const contact = c.contacts as { full_name: string } | null
          const partner = c.partners as { name: string } | null
          const commType = (c.communication_type as string) ?? 'note'
          return (
            <div key={c.id as string} className="flex items-start gap-2.5 text-xs">
              <div className="mt-0.5 shrink-0" style={{ color: TYPE_COLOR[commType] ?? 'var(--text-muted)' }}>
                {TYPE_ICON[commType] ?? <MessageSquare className="h-3.5 w-3.5" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[var(--text-primary)] truncate">{(c.subject as string) ?? commType}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  {performer && <span className="text-[var(--text-muted)]">{performer.full_name}</span>}
                  {(contact || partner) && (
                    <span className="text-[var(--text-muted)]">→ {contact?.full_name ?? partner?.name}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <NeuBadge color="gray" size="sm">{commType}</NeuBadge>
                <span className="text-[var(--text-placeholder)] ml-1">{timeAgo(c.performed_at as string)}</span>
              </div>
            </div>
          )
        })}
      </div>
    </NeuCard>
  )
}
