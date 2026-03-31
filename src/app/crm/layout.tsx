import type { Metadata } from 'next'
import { CRMProviders } from './providers'
import { ThemeProvider } from '@/components/crm/ThemeProvider'
import { ToastProvider } from '@/components/ui/NeuToast'
import { CRMSidebar } from '@/components/crm/CRMSidebar'
import { CRMHeader } from '@/components/crm/CRMHeader'
import { CRMBottomNav } from '@/components/crm/CRMBottomNav'
import { OfflineBanner } from '@/components/crm/OfflineBanner'
import { KeyboardShortcuts } from '@/components/crm/KeyboardShortcuts'

export const metadata: Metadata = {
  title: 'Powerhouse CRM | PleoChrome',
  description: 'Real-world asset value orchestration platform',
}

export default function CRMLayout({ children }: { children: React.ReactNode }) {
  return (
    <CRMProviders>
      <ThemeProvider>
        <ToastProvider>
          <div className="crm-shell">
            <KeyboardShortcuts />
            <OfflineBanner />
            <CRMHeader />
            <div className="crm-body">
              <CRMSidebar />
              <main className="crm-content">
                {children}
              </main>
            </div>
            <CRMBottomNav />
          </div>
        </ToastProvider>
      </ThemeProvider>
    </CRMProviders>
  )
}
