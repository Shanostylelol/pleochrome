import { CRMProviders } from '../crm/providers'

export default function InterestLayout({ children }: { children: React.ReactNode }) {
  return <CRMProviders>{children}</CRMProviders>
}
