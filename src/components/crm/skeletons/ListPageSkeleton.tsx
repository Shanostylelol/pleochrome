'use client'

import { NeuSkeleton } from '@/components/ui/NeuSkeleton'

export function ListPageSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <NeuSkeleton variant="text" lines={1} className="w-48" />
        <NeuSkeleton variant="button" className="ml-auto" />
      </div>
      <NeuSkeleton variant="card" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 py-2">
          <NeuSkeleton variant="avatar" />
          <div className="flex-1 space-y-1.5">
            <NeuSkeleton variant="text" lines={1} className="w-3/4" />
            <NeuSkeleton variant="text" lines={1} className="w-1/2" />
          </div>
          <NeuSkeleton variant="button" className="w-16" />
        </div>
      ))}
    </div>
  )
}
