'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Calendar, CheckSquare } from 'lucide-react'
import { NeuCard, NeuBadge } from '@/components/ui'
import { cn } from '@/lib/utils'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December']

interface Meeting { id: string; title: string; meeting_date: string; meeting_type?: string | null; asset_id?: string | null }
interface Task { id: string; title: string; due_date: string; asset_id: string; status: string }

interface CalendarViewProps {
  meetings: Meeting[]
  tasks?: Task[]
}

type DayEvent = { type: 'meeting'; id: string; title: string; href: string } | { type: 'task'; id: string; title: string; href: string; status: string }

export function CalendarView({ meetings, tasks = [] }: CalendarViewProps) {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selectedDay, setSelectedDay] = useState<string | null>(null)

  const prevMonth = () => { if (month === 0) { setYear(y => y - 1); setMonth(11) } else setMonth(m => m - 1) }
  const nextMonth = () => { if (month === 11) { setYear(y => y + 1); setMonth(0) } else setMonth(m => m + 1) }

  // Build event map: YYYY-MM-DD → events[]
  const eventMap = useMemo(() => {
    const map = new Map<string, DayEvent[]>()
    const add = (dateStr: string, ev: DayEvent) => {
      const key = dateStr.slice(0, 10)
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(ev)
    }
    meetings.forEach(m => {
      if (m.meeting_date) add(m.meeting_date, {
        type: 'meeting', id: m.id, title: m.title,
        href: m.asset_id ? `/crm/assets/${m.asset_id}?tab=meetings` : '/crm/meetings',
      })
    })
    tasks.forEach(t => {
      if (t.due_date) add(t.due_date, {
        type: 'task', id: t.id, title: t.title, status: t.status,
        href: `/crm/assets/${t.asset_id}?tab=workflow&taskId=${t.id}`,
      })
    })
    return map
  }, [meetings, tasks])

  // Calendar grid cells
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  // Pad to full rows
  while (cells.length % 7 !== 0) cells.push(null)

  const todayStr = today.toISOString().slice(0, 10)
  const selectedEvents = selectedDay ? (eventMap.get(selectedDay) ?? []) : []

  return (
    <div className="space-y-4">
      {/* Month navigation */}
      <div className="flex items-center gap-3">
        <button onClick={prevMonth} className="p-1.5 rounded-[var(--radius-sm)] hover:bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <h3 className="text-base font-semibold text-[var(--text-primary)] flex-1 text-center">
          {MONTHS[month]} {year}
        </h3>
        <button onClick={nextMonth} className="p-1.5 rounded-[var(--radius-sm)] hover:bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-4">
        {/* Calendar grid */}
        <NeuCard variant="pressed" padding="sm">
          {/* Day headers */}
          <div className="grid grid-cols-7 mb-1">
            {DAYS.map(d => (
              <div key={d} className="text-center text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] py-1">
                {d}
              </div>
            ))}
          </div>
          {/* Rows */}
          <div className="grid grid-cols-7">
            {cells.map((day, i) => {
              if (!day) return <div key={`empty-${i}`} className="aspect-square" />
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
              const events = eventMap.get(dateStr) ?? []
              const isToday = dateStr === todayStr
              const isSelected = dateStr === selectedDay
              const hasEvents = events.length > 0
              const meetingCount = events.filter(e => e.type === 'meeting').length
              const taskCount = events.filter(e => e.type === 'task').length
              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDay(isSelected ? null : dateStr)}
                  className={cn(
                    'aspect-square flex flex-col items-center justify-start pt-1 pb-0.5 rounded-[var(--radius-sm)] transition-colors text-xs',
                    isSelected ? 'bg-[var(--teal)] text-white' : 'hover:bg-[var(--bg-elevated)]',
                    isToday && !isSelected && 'ring-1 ring-[var(--teal)]',
                  )}
                >
                  <span className={cn('font-medium leading-none', isToday && !isSelected && 'text-[var(--teal)]', isSelected && 'text-white')}>
                    {day}
                  </span>
                  {hasEvents && (
                    <div className="flex gap-0.5 mt-0.5 flex-wrap justify-center">
                      {meetingCount > 0 && <span className="w-1.5 h-1.5 rounded-full bg-[var(--sapphire)]" style={isSelected ? { background: 'rgba(255,255,255,0.8)' } : undefined} />}
                      {taskCount > 0 && <span className="w-1.5 h-1.5 rounded-full bg-[var(--amber)]" style={isSelected ? { background: 'rgba(255,255,255,0.6)' } : undefined} />}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
          {/* Legend */}
          <div className="flex items-center gap-4 pt-2 border-t border-[var(--border)] mt-2">
            <span className="flex items-center gap-1.5 text-[11px] text-[var(--text-muted)]">
              <span className="w-2 h-2 rounded-full bg-[var(--sapphire)]" /> Meetings
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-[var(--text-muted)]">
              <span className="w-2 h-2 rounded-full bg-[var(--amber)]" /> Tasks due
            </span>
          </div>
        </NeuCard>

        {/* Day detail panel */}
        <NeuCard variant="raised" padding="sm" className="min-h-[200px]">
          {!selectedDay ? (
            <div className="flex flex-col items-center justify-center h-full py-8 text-center">
              <Calendar className="h-8 w-8 text-[var(--text-placeholder)] mb-2" />
              <p className="text-sm text-[var(--text-muted)]">Select a day</p>
              <p className="text-xs text-[var(--text-placeholder)] mt-1">to see events</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                {new Date(selectedDay + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </p>
              {selectedEvents.length === 0 ? (
                <p className="text-xs text-[var(--text-muted)] py-4 text-center">No events</p>
              ) : selectedEvents.map((ev) => (
                <Link key={ev.id} href={ev.href}
                  className="flex items-start gap-2 px-2 py-1.5 rounded-[var(--radius-sm)] hover:bg-[var(--bg-elevated)] transition-colors text-xs">
                  {ev.type === 'meeting'
                    ? <Calendar className="h-3.5 w-3.5 text-[var(--sapphire)] shrink-0 mt-0.5" />
                    : <CheckSquare className="h-3.5 w-3.5 text-[var(--amber)] shrink-0 mt-0.5" />
                  }
                  <div className="flex-1 min-w-0">
                    <p className="text-[var(--text-primary)] truncate">{ev.title}</p>
                    {'status' in ev && <NeuBadge color={ev.status === 'done' ? 'chartreuse' : ev.status === 'blocked' ? 'ruby' : 'gray'} size="sm">{ev.status}</NeuBadge>}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </NeuCard>
      </div>
    </div>
  )
}
