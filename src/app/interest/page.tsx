'use client'

import dynamic from 'next/dynamic'

const InterestPageContent = dynamic(() => import('./InterestPageContent'), { ssr: false })

export default function InterestPage() {
  return <InterestPageContent />
}
