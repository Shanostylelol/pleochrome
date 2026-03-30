# PleoChrome V2 — Architecture Rules
# MANDATORY — Read before writing ANY V2 code

> Date: 2026-03-30
> Purpose: Prevent monolithic code, ensure consistency, enable global updates

---

## 1. FILE SIZE LIMITS

| File Type | Max Lines | Action If Exceeded |
|-----------|-----------|-------------------|
| Page file (page.tsx) | 300 | Extract tab content into separate component files |
| Component file (.tsx) | 250 | Split into sub-components |
| Router file (.ts) | 300 | Split into sub-routers or extract helpers |
| Utility file (.ts) | 200 | Split by domain |

**Enforcement:** If a file exceeds its limit during a build step, STOP and refactor before continuing.

---

## 2. COMPONENT ARCHITECTURE

### 2.1 No Inline Components in Page Files

V1 anti-pattern (DON'T DO THIS):
```tsx
// page.tsx — 660 lines with 8 inline tab components
function GovernanceTab({ ... }) { /* 80 lines */ }
function DocumentsTab({ ... }) { /* 70 lines */ }
function TasksTab({ ... }) { /* 50 lines */ }
// etc.
```

V2 pattern (DO THIS):
```tsx
// page.tsx — 150 lines, imports tab components
import { WorkflowTab } from '@/components/crm/asset-detail/WorkflowTab'
import { DocumentsTab } from '@/components/crm/asset-detail/DocumentsTab'
import { CommentsTab } from '@/components/crm/asset-detail/CommentsTab'
```

### 2.2 Component File Organization

```
src/components/
  ui/                      ← Neumorphic primitives (NeuCard, NeuButton, etc.)
  crm/                     ← CRM-specific composites
    shared/                ← Used across multiple pages
      StageAccordion.tsx
      TaskCard.tsx
      SubtaskChecklist.tsx
      CommentThread.tsx
      DocumentUploadZone.tsx
      ApprovalChain.tsx
      OwnershipTree.tsx
      NotificationPanel.tsx
    pipeline/              ← Pipeline Board components
      PipelineKanban.tsx
      PipelineList.tsx
      PipelineDashboard.tsx
      AssetCard.tsx
    asset-detail/          ← Asset Detail tab components
      WorkflowTab.tsx
      TasksTab.tsx
      DocumentsTab.tsx
      CommentsTab.tsx
      PartnersTab.tsx
      FinancialsTab.tsx
      ActivityTab.tsx
      GatesTab.tsx
      OverviewTab.tsx
    templates/             ← Template editor components
      TemplateStageList.tsx
      StageEditor.tsx
      TaskEditor.tsx
    modals/                ← All modal dialogs
      CreateAssetModal.tsx
      EditAssetModal.tsx
      CreateTaskModal.tsx
      SaveAsTemplateModal.tsx
      ConfirmHideModal.tsx
      GateWarningModal.tsx
      AddOwnerModal.tsx
```

### 2.3 Shared Modal Pattern

Every modal MUST use the same wrapper pattern:

```tsx
// components/ui/NeuModal.tsx — CREATE THIS FIRST
export function NeuModal({ open, onClose, title, children, maxWidth = 'md' }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[var(--overlay)]" onClick={onClose} />
      <NeuCard variant="raised" padding="lg"
        className={`relative z-10 w-full max-h-[90vh] overflow-y-auto ${maxWidthClass}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-display)' }}>{title}</h2>
          <button onClick={onClose}><X className="h-5 w-5" /></button>
        </div>
        {children}
      </NeuCard>
    </div>
  )
}
```

V1 has 8+ hand-written modal wrappers with slight variations. V2 uses ONE.

---

## 3. CSS RULES — NO HARDCODING

### 3.1 Colors MUST Use CSS Variables

```tsx
// WRONG
className="text-white bg-[#1B6B4A]"
className="text-gray-500"
style={{ color: '#C47A1A' }}

// RIGHT
className="text-[var(--text-primary)] bg-[var(--emerald)]"
className="text-[var(--text-muted)]"
style={{ color: 'var(--amber)' }}
```

### 3.2 Shadows MUST Use Design System

```tsx
// WRONG
className="shadow-lg"
style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}

// RIGHT
className="shadow-[var(--shadow-raised)]"
className="shadow-[var(--shadow-pressed)]"
```

### 3.3 New V2 CSS Variables to Add

```css
/* Phase colors */
--phase-lead: var(--text-muted);           /* Gray #6B7280 */
--phase-intake: var(--emerald);             /* #1B6B4A */
--phase-asset-maturity: var(--teal);        /* #1A8B7A */
--phase-security: var(--sapphire);          /* #1E3A6E */
--phase-value-creation: var(--amethyst);    /* #5B2D8E */
--phase-distribution: var(--amber);         /* #C47A1A */

/* Value model colors */
--model-tokenization: var(--teal);
--model-fractional: var(--emerald);
--model-debt: var(--sapphire);
--model-broker: var(--amber);
--model-barter: var(--amethyst);

/* Gray (missing from V1) */
--gray: #6B7280;
--gray-bg: rgba(107, 114, 128, 0.15);
```

---

## 4. CONSTANTS FILE — SINGLE SOURCE OF TRUTH

Create `src/lib/constants.ts`:

```typescript
import { type LucideIcon } from 'lucide-react'

// Phase display config
export const PHASES = {
  lead:            { label: 'Lead',            color: 'var(--phase-lead)',            order: 0 },
  intake:          { label: 'Intake',          color: 'var(--phase-intake)',          order: 1 },
  asset_maturity:  { label: 'Asset Maturity',  color: 'var(--phase-asset-maturity)',  order: 2 },
  security:        { label: 'Security',        color: 'var(--phase-security)',        order: 3 },
  value_creation:  { label: 'Value Creation',  color: 'var(--phase-value-creation)',  order: 4 },
  distribution:    { label: 'Distribution',    color: 'var(--phase-distribution)',    order: 5 },
} as const

// Value model display config
export const VALUE_MODELS = {
  tokenization:          { label: 'Tokenization',          color: 'var(--model-tokenization)' },
  fractional_securities: { label: 'Fractional Securities', color: 'var(--model-fractional)' },
  debt_instrument:       { label: 'Debt Instrument',       color: 'var(--model-debt)' },
  broker_sale:           { label: 'Broker Sale',           color: 'var(--model-broker)' },
  barter:                { label: 'Barter / Exchange',     color: 'var(--model-barter)' },
} as const

// Task type display config (icon names from lucide-react)
export const TASK_TYPES = {
  document_upload:  { label: 'Document Upload',  icon: 'Upload',         color: 'var(--teal)' },
  meeting:          { label: 'Meeting',           icon: 'Calendar',       color: 'var(--amethyst)' },
  physical_action:  { label: 'Physical Action',   icon: 'Truck',          color: 'var(--amber)' },
  payment_outgoing: { label: 'Payment Out',       icon: 'ArrowUpRight',   color: 'var(--ruby)' },
  payment_incoming: { label: 'Payment In',        icon: 'ArrowDownLeft',  color: 'var(--chartreuse)' },
  approval:         { label: 'Approval',          icon: 'ShieldCheck',    color: 'var(--sapphire)' },
  review:           { label: 'Review',            icon: 'Eye',            color: 'var(--teal)' },
  due_diligence:    { label: 'Due Diligence',     icon: 'Search',         color: 'var(--emerald)' },
  filing:           { label: 'Filing',            icon: 'FileText',       color: 'var(--sapphire)' },
  communication:    { label: 'Communication',     icon: 'Mail',           color: 'var(--amethyst)' },
  automated:        { label: 'Automated',         icon: 'Zap',            color: 'var(--amber)' },
} as const

// Asset status config
export const ASSET_STATUSES = {
  active:     { label: 'Active',     color: 'var(--teal)' },
  paused:     { label: 'Paused',     color: 'var(--amber)' },
  completed:  { label: 'Completed',  color: 'var(--chartreuse)' },
  terminated: { label: 'Terminated', color: 'var(--ruby)' },
  archived:   { label: 'Archived',   color: 'var(--text-muted)' },
} as const

// Stage/task status config
export const STAGE_STATUSES = {
  not_started: { label: 'Not Started', color: 'var(--text-muted)' },
  in_progress: { label: 'In Progress', color: 'var(--teal)' },
  completed:   { label: 'Completed',   color: 'var(--chartreuse)' },
  skipped:     { label: 'Skipped',     color: 'var(--text-placeholder)' },
} as const
```

**Rule:** Every component that needs phase colors, task type icons, or status labels imports from `constants.ts`. NEVER hardcode these values in components.

---

## 5. tRPC ROUTER RULES

### 5.1 Every Mutation Invalidates Affected Queries

```typescript
// WRONG — mutation with no invalidation
createTask.mutate({ ... })

// RIGHT — mutation with targeted invalidation
const utils = trpc.useUtils()
const createTask = trpc.tasks.create.useMutation({
  onSuccess: () => {
    utils.tasks.listByStage.invalidate({ stageId })
    utils.stages.listByAsset.invalidate({ assetId })
    utils.assets.getById.invalidate({ assetId })
  },
})
```

### 5.2 Zod Schemas in Shared Files

```
src/lib/validation/
  asset.ts     ← Zod schemas for asset CRUD
  task.ts      ← Zod schemas for task/subtask
  template.ts  ← Zod schemas for template editing
  contact.ts   ← Zod schemas for contact/KYC
  partner.ts   ← Zod schemas for partner/onboarding
  shared.ts    ← Shared schema fragments (uuid, pagination, etc.)
```

Import in BOTH tRPC routers AND client components — single source of truth.

### 5.3 Router Helper Extraction

If a router procedure exceeds 50 lines, extract the logic:

```typescript
// WRONG — 80-line procedure inline
create: protectedProcedure.input(...).mutation(async ({ ctx, input }) => {
  // 80 lines of business logic
})

// RIGHT — extract to helper
import { createAssetWithWorkflow } from '../helpers/asset-helpers'
create: protectedProcedure.input(...).mutation(async ({ ctx, input }) => {
  return createAssetWithWorkflow(ctx.db, ctx.user, input)
})
```

---

## 6. SUPABASE RULES

### 6.1 Never Modify Existing Migrations
Create new migration files for changes. The 4 existing migrations are immutable.

### 6.2 Regenerate Types After EVERY Migration
```bash
npx supabase gen types typescript --project-id satrlfdnevquvnozhlvn > src/lib/database.types.ts
```

### 6.3 Activity Log is IMMUTABLE
No UPDATE or DELETE on activity_log. Ever. Triggers enforce this.

### 6.4 Soft Delete Convention
- Stages: `is_hidden` (never deleted)
- Tasks: `is_hidden` + `is_deleted` (hidden from view, or soft-deleted for audit)
- Subtasks: `is_hidden` (can be hard-deleted if no audit requirement)
- Documents: `is_deleted` (never hard-deleted — compliance)
- Comments: `is_deleted` (preserve thread integrity)
- Partners: `is_deleted` (preserve historical references)
- Contacts: `is_deleted` (FinCEN record retention)

---

## 7. TESTING RULES

### 7.1 Build Test After Every File Change
```bash
npm run build  # MUST pass with zero errors
```

### 7.2 API Test After Every Router Change
```bash
# Test the specific endpoint with curl
curl -s 'http://localhost:3000/api/trpc/[router].[procedure]' | python3 -m json.tool
```

### 7.3 Browser Test After Every Page Change
Take a screenshot via Chrome tools to verify:
- Dark mode renders correctly
- Light mode renders correctly
- 375px mobile layout works
- 1440px desktop layout works

### 7.4 Data Integrity Test After Every Mutation
After testing a mutation, verify:
- Activity log recorded the action
- Related queries return updated data
- Notifications generated (if applicable)

---

## 8. GATE UX SPECIFICATION

### Advisory Gate Warning Dialog

When a user tries to advance a phase and the gate evaluation returns warnings:

```
┌─────────────────────────────────────────┐
│  ⚠️  Phase Advancement Warning          │
│                                         │
│  Moving "Emerald Barrel" from           │
│  Intake → Asset Maturity                │
│                                         │
│  The following items are incomplete:    │
│                                         │
│  ○ Stage 2.3: OFAC Screening           │
│    └ Task: Run OFAC/SDN screening       │
│  ○ Stage 2.5: Documentation Review     │
│    └ 2 tasks incomplete                 │
│                                         │
│  These are advisory — you can proceed   │
│  without completing them.               │
│                                         │
│  Override reason (optional):            │
│  ┌─────────────────────────────────────┐│
│  │ Expedited timeline per Shane        ││
│  └─────────────────────────────────────┘│
│                                         │
│  [Cancel]  [Proceed Anyway]             │
└─────────────────────────────────────────┘
```

- Override reason is OPTIONAL (not required)
- ANY team member can override (no role restriction)
- Override is logged to activity_log with: user, reason, warnings bypassed
- The "Proceed Anyway" button uses `NeuButton` with `variant="ghost"` and amber color to indicate caution

---

## 9. TEMPLATE SEEDING TRANSFORM RULES

The 3 template data files use different formats. A transform layer is needed:

### V1 Task Type → V2 Enum Mapping
```typescript
const TASK_TYPE_MAP: Record<string, string> = {
  'action': 'physical_action',
  'upload': 'document_upload',
  'review': 'review',
  'approval': 'approval',
  'automated': 'automated',
  'meeting': 'meeting',
  'payment': 'payment_outgoing',  // Disambiguate from context
  'filing': 'filing',
}
```

### V1 Phase → V2 Phase Mapping
```typescript
const PHASE_MAP: Record<string, string> = {
  'phase_0_foundation': 'lead',
  'phase_1_intake': 'intake',
  'phase_2_certification': 'asset_maturity',
  'phase_3_custody': 'asset_maturity',
  'phase_4_legal': 'security',
  'phase_5_tokenization': 'value_creation',
  'phase_6_regulatory': 'value_creation',
  'phase_7_distribution': 'distribution',
  'phase_8_ongoing': 'distribution',
}
```

---

## 10. CHECKLIST — Before Starting Phase 1

- [ ] This document read by builder
- [ ] V2-MIGRATION-ADDENDUM.md read and understood
- [ ] V2-POWERHOUSE-BLUEPRINT.md read (sections 2-8)
- [ ] V2-COMPLETE-TASK-DENSITY.md skimmed (understand structure)
- [ ] V2-PARTNER-AND-CUSTOMER-DESIGN.md read
- [ ] V2-OWNERSHIP-AND-KYC-DESIGN.md read
- [ ] CLAUDE.md pre-flight check completed
- [ ] Current database state verified (25 tables needed, only team_members has data)
