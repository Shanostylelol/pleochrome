'use client'

import { useState } from 'react'
import { NeuCard } from '@/components/ui/NeuCard'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const sections = [
  {
    id: 'start',
    title: 'Getting Started',
    content: [
      { heading: 'What Is Powerhouse?', body: 'Powerhouse is PleoChrome\'s internal CRM for managing real-world assets through their entire lifecycle — from sourcing to distribution. Every gemstone, property, mineral right, or other asset you work with flows through a structured pipeline of phases, stages, and tasks.' },
      { heading: 'How to Log In', body: '1. Go to pleochrome.com/login\n2. Click Continue with Google\n3. Sign in with your @pleochrome.com Google Workspace account\n4. You\'ll land on the Pipeline board' },
      { heading: 'Mobile Access', body: 'The app works on your phone\'s browser. Save it to your home screen for native app-like experience:\n\n• iPhone: Safari > Share > Add to Home Screen\n• Android: Chrome > Menu > Add to Home Screen' },
    ],
  },
  {
    id: 'concepts',
    title: 'Core Concepts',
    content: [
      { heading: 'Assets', body: 'An asset is any real-world item PleoChrome is working to monetize. Each asset has a name, asset type (gemstone, real estate, precious metal, mineral rights, or other), a value model (how you plan to monetize it), and an auto-generated reference code.' },
      { heading: 'The Six Phases', body: 'Every asset moves through six phases in order:\n\n1. Lead — Initial sourcing and identification\n2. Intake — KYC/KYB verification, holder screening, preliminary assessment\n3. Maturity — Full appraisal, custody arrangement, insurance\n4. Security — Legal structuring (SPV, securities filings, compliance)\n5. Value Creation — Token/share creation, smart contracts, offering setup\n6. Distribution — Marketing, investor onboarding, trading/settlement' },
      { heading: 'Stages, Tasks, and Subtasks', body: 'Within each phase:\n\n• Stages are major milestones (e.g., "Holder Qualification & Screening")\n• Tasks are specific work items within a stage (e.g., "Run OFAC/SDN screening")\n• Subtasks break tasks into smaller checkable items\n\nAll names can be renamed at any time after the workflow template is applied.' },
      { heading: 'Value Models', body: '• Tokenization — ERC-3643/7518 security tokens on blockchain\n• Fractional Securities — Reg D 506(c) fractional LLC units\n• Debt Instrument — Asset-backed lending, UCC Article 9\n• Broker Sale — Direct sale through broker/dealer\n• Barter — Asset-for-asset exchange\n\nYou can change the value model mid-lifecycle using "Change Approach." Phases 1–3 work is preserved; phases 4–6 get swapped.' },
    ],
  },
  {
    id: 'workflow',
    title: 'Daily Workflow',
    content: [
      { heading: 'Creating a New Asset', body: '1. Click + New Asset from the Pipeline page\n2. Fill in the wizard:\n   • Step 1: Name, asset type, holder entity\n   • Step 2: Value model selection\n   • Step 3: Type-specific details (carat weight, property address, etc.)\n   • Step 4: Review and create\n3. The system automatically applies the appropriate workflow template' },
      { heading: 'Working Through the Workflow', body: '1. Open an asset from the Pipeline or Assets list\n2. You land on the Workflow tab — this is where you do your work\n3. Tap/click a stage to see its tasks\n4. For each task:\n   • Open to see full details, subtasks, files, comments\n   • Mark subtasks as complete with the checkbox\n   • Add notes, attach files, leave comments\n   • Change status: To Do → Active → Done\n5. When all tasks in a stage are done, mark the stage as complete\n6. When a phase is complete, advance to the next phase' },
      { heading: 'On Mobile', body: 'The workflow uses a flat drill-down — tap a stage to enter it, tap a task to see details. Use the back arrow to navigate up. Tap the pencil icon to rename any stage or task.' },
      { heading: 'Advancing Phases', body: 'Click "Advance to [Phase]" (desktop) or find it in the "..." menu (mobile). The system warns if tasks are incomplete — you can override with a reason that gets logged for audit.' },
    ],
  },
  {
    id: 'features',
    title: 'Feature Guide',
    content: [
      { heading: 'Pipeline Board', body: 'The main dashboard showing all active assets organized by phase. Filter by value model, search by name, drag assets between phases (desktop).' },
      { heading: 'Asset Tabs', body: '• Workflow — Your daily workspace: stages, tasks, subtasks\n• Overview — Asset details: holder info, type-specific fields, custody, legal, owners\n• Documents — Required documents checklist + uploaded files, grouped by stage\n• Comments — Asset-level conversation thread with @mentions\n• Comms — Meetings + communication logs (calls, emails, texts) in unified timeline\n• Activity — Immutable audit trail: every action auto-logged\n• Gates — Phase advancement gates that must be completed\n• Financials — Claimed/appraised values, payment tracking, revenue projections\n• Partners — Service providers assigned to this asset with roles' },
      { heading: 'Partners', body: 'Manage all service providers (appraisers, custodians, broker-dealers, legal counsel, etc.). Each partner has contact info, type, due diligence status, engagement status, credentials, and documents.' },
      { heading: 'Templates', body: 'Workflow templates define default stages, tasks, and subtasks for each value model. Once applied, all items are independent copies you can freely rename, add, delete, or reorder. Changes do NOT affect the template or other assets.' },
    ],
  },
  {
    id: 'tips',
    title: 'Tips & Shortcuts',
    content: [
      { heading: 'Keyboard Shortcuts', body: '• Cmd+K — Open search (assets, tasks, partners, contacts)\n• Cmd+N — Quick add asset (from Pipeline page)' },
      { heading: 'Quick Actions', body: 'From any asset, the "..." menu gives you: Pause/Resume, Set Reminder, Duplicate, Change Approach, Save as Template, Export (JSON/CSV).' },
      { heading: 'Notifications', body: 'The bell icon shows unread notifications. You\'ll be notified when assigned a task, @mentioned in a comment, or a phase is advanced.' },
    ],
  },
]

export default function HelpPage() {
  const [expandedSection, setExpandedSection] = useState<string>('start')

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
          Help & Getting Started
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Everything you need to know to use Powerhouse CRM
        </p>
      </div>

      {sections.map((section) => (
        <NeuCard key={section.id} variant="raised" padding="none" className="overflow-hidden">
          <button
            onClick={() => setExpandedSection(expandedSection === section.id ? '' : section.id)}
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[var(--bg-elevated)] transition-colors"
          >
            <h2 className="text-base font-semibold text-[var(--text-primary)]">{section.title}</h2>
            <ChevronDown className={cn(
              'h-5 w-5 text-[var(--text-muted)] transition-transform',
              expandedSection === section.id && 'rotate-180'
            )} />
          </button>

          {expandedSection === section.id && (
            <div className="px-5 pb-5 space-y-5 border-t border-[var(--border)]">
              {section.content.map((item, i) => (
                <div key={i} className="pt-4">
                  <h3 className="text-sm font-semibold text-[var(--teal)] mb-2">{item.heading}</h3>
                  <div className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
                    {item.body}
                  </div>
                </div>
              ))}
            </div>
          )}
        </NeuCard>
      ))}

      <p className="text-xs text-[var(--text-muted)] text-center pt-4">
        PleoChrome Powerhouse CRM v1.0 — Questions? Reach out to Shane or David.
      </p>
    </div>
  )
}
