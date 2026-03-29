'use client'

import { WifiOff } from 'lucide-react'
import { NeuCard, NeuButton } from '@/components/ui'

export default function OfflinePage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <NeuCard variant="raised" padding="lg" className="text-center max-w-md">
        <WifiOff className="h-12 w-12 text-[var(--amber)] mx-auto mb-4" />
        <h1 className="text-xl font-semibold text-[var(--text-primary)] mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          You&apos;re Offline
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mb-4">
          PleoChrome Powerhouse requires an internet connection for real-time data.
          Your recent changes have been saved and will sync when you reconnect.
        </p>
        <NeuButton onClick={() => window.location.reload()}>
          Try Again
        </NeuButton>
      </NeuCard>
    </div>
  )
}
