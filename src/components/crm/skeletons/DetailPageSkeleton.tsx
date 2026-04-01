'use client'

import { NeuSkeleton } from '@/components/ui/NeuSkeleton'

export function DetailPageSkeleton() {
  return (
    <div className="space-y-4">
      <NeuSkeleton variant="card" />
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <NeuSkeleton key={i} variant="button" className="w-20" />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NeuSkeleton variant="text" lines={4} />
        <NeuSkeleton variant="text" lines={4} />
      </div>
      <NeuSkeleton variant="card" />
    </div>
  )
}
