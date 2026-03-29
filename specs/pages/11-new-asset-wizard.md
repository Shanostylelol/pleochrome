# Page Spec: New Asset Wizard

**Phase:** 7 — Governance Templates + Compliance + Settings (also referenced in Phase 1)
**URL:** `/crm/assets/new`
**Priority:** P0
**Dependencies:** Phase 0 (Foundation), Phase 7 (Templates — governance requirements + partner modules for workflow assembly)
**Estimated Build Time:** 3-4 hours
**Spec Version:** 1.0

---

## PURPOSE

5-step wizard for creating a new asset and initializing its governance pipeline. This is the entry point for every new deal entering the system. On completion, the wizard creates the asset record, populates governance steps from templates, generates default tasks, and redirects to the new asset's detail page.

The wizard calls `assemble_asset_workflow()` which is the critical function that converts governance templates (Layer 1) and partner modules (Layer 2) into actual task instances (Layer 3).

---

## DATA SOURCES

### Database Tables (Reads)

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `governance_requirements` | Template for steps to create | `step_number`, `title`, `phase_id`, `value_path_scope`, `is_active` |
| `partner_modules` | Partner task modules for assignment | `id`, `partner_id`, `name`, `functions_covered`, `value_paths` |
| `partners` | Partner selection | `id`, `name`, `type` |
| `contacts` | Existing holder contacts | `id`, `full_name`, `email`, `entity_name` |
| `team_members` | Team assignment | `id`, `full_name`, `role`, `avatar_url` |

### Database Tables (Writes — on create)

| Table | Operations |
|-------|-----------|
| `stones` | INSERT new asset record |
| `contacts` | INSERT new contact if holder is new |
| `asset_steps` | INSERT steps from governance_requirements (via `assemble_asset_workflow()`) |
| `asset_task_instances` | INSERT tasks from module_tasks (via `assemble_asset_workflow()`) |
| `asset_partners` | INSERT partner assignments |
| `activity_log` | Automatic via DB triggers |
| `notifications` | Automatic — team notified of new asset |

---

## WIZARD LAYOUT

### Shell

```
[Layout]
  Full-page view (not modal) at /crm/assets/new
  Background: --bg-primary
  Max-width: 720px, centered
  Padding: 48px 32px

[StepIndicator] — horizontal, top of content
  5 numbered circles connected by lines
  States:
    Complete: filled --accent-teal, white checkmark
    Current: --accent-teal border, pulsing subtle glow
    Upcoming: dashed --border-default, --text-muted number
  Step labels below circles: "Basic Info", "Value Path", "Holder", "Partners", "Review"

[ContentArea] — center, form for current step

[NavigationButtons] — bottom, flex row, space-between
  [Button: "Back"] — NeuButton ghost (hidden on step 1)
  [Button: "Save Draft"] — NeuButton ghost, --text-muted (stores in localStorage)
  [Button: "Next"] — NeuButton primary, --accent-teal (steps 1-4)
  [Button: "Create Asset"] — NeuButton primary, --accent-teal (step 5 only)
```

---

## STEP 1: BASIC INFORMATION

```
[StepTitle] "Basic Information" — DM Sans 20px, 600 weight
[StepDescription] "Tell us about the asset entering the pipeline" — DM Sans 14px, --text-muted

[Field: Asset Name] — NeuInput, required
  Label: "Asset Name"
  Placeholder: "e.g., Emerald Barrel #017093"
  Validation: min 1 char, max 255 chars

[Field: Asset Type] — NeuSelect, required
  Label: "Asset Type"
  Options: "Gemstone", "Real Estate", "Precious Metal", "Mineral Rights", "Other"
  If "Other": show NeuInput for custom type text

[Field: Reference Code] — NeuInput, auto-generated but editable
  Label: "Reference Code"
  Value: auto-generated "PC-{YEAR}-{SEQ}" (e.g., "PC-2026-003")
  Helper text: "Auto-generated. Edit if you need a custom reference."
  Validation: unique (check via tRPC on blur)

[Field: Estimated Value] — NeuInput (currency), optional
  Label: "Preliminary Value Estimate"
  Placeholder: "$0"
  Format: currency with commas

[Field: Source Channel] — NeuSelect, optional
  Label: "Source Channel"
  Options: "Vault Inventory", "Dealer Network", "Direct Holder", "Partner Referral", "Inbound"

[Field: Description] — Textarea (NeuInput variant), optional
  Label: "Description"
  Placeholder: "Brief description of the asset and its source..."
  Max: 2000 characters with counter

[Validation] All required fields filled → "Next" enabled
```

---

## STEP 2: VALUE PATH SELECTION

```
[StepTitle] "Value Path" — DM Sans 20px, 600 weight
[StepDescription] "How will this asset create value?" — DM Sans 14px, --text-muted

[PathCards] — 3 large NeuCard raised, side by side (flex row, wrap on mobile)
  Each card: min-width 200px, cursor pointer

  [PathCard: Fractional Securities]
    [ColorBar] — 4px top border, --accent-emerald
    [PathName] "Fractional Securities" — DM Sans 18px, 600 weight
    [Tagline] "Divide and Distribute" — DM Sans 13px, --text-secondary
    [Description] From VALUE_PATHS.fractional.description in portal-data.ts
      — DM Sans 13px, --text-muted
    [PhasePreview] "Phases: Acquisition > Preparation > Securities Structuring > Distribution"
      — DM Sans 11px, --text-muted

  [PathCard: Tokenization]
    [ColorBar] — 4px top border, --accent-teal
    [PathName] "Tokenization" — same styling
    [Tagline] "Programmable Ownership"
    [Description] From VALUE_PATHS.tokenization.description

  [PathCard: Debt Instruments]
    [ColorBar] — 4px top border, --accent-sapphire
    [PathName] "Debt Instruments" — same styling
    [Tagline] "Borrow Against Value"
    [Description] From VALUE_PATHS.debt.description

Selected card: highlighted border (path color, 3px), background at 10% opacity of path color
Unselected cards: standard NeuCard raised

[Option: Undecided]
  Below cards: NeuCheckbox + "Not sure yet — assign a value path later"
  If checked: deselects any card, only shared Phases 1-2 are initialized
  DM Sans 13px, --text-muted
```

---

## STEP 3: HOLDER INFORMATION

```
[StepTitle] "Asset Holder" — DM Sans 20px, 600 weight
[StepDescription] "Who owns or controls this asset?" — DM Sans 14px, --text-muted

[Toggle: "Select Existing" | "Create New"] — NeuTabs pill variant

[Option A: Select Existing]
  [NeuSelect (searchable)] — search contacts database
    Displays: name + entity type + email
    On select: auto-fills display below
  [SelectedContact] — NeuCard flat, shows contact details read-only

[Option B: Create New]
  [Field: Holder Name] — NeuInput, required
  [Field: Holder Type] — NeuSelect, required
    Options: "Individual", "Entity (LLC, Corp, Trust)"
  [If Entity:]
    [Field: Entity Name] — NeuInput, required
    [Field: State of Formation] — NeuSelect (US states)
  [Field: Email] — NeuInput, type email, optional
  [Field: Phone] — NeuInput, optional
  [Field: Address] — NeuInput, optional (full address line)

[Validation] Holder name filled (or existing selected) → "Next" enabled
```

---

## STEP 4: PARTNER ASSIGNMENT

```
[StepTitle] "Partner Assignment" — DM Sans 20px, 600 weight
[StepDescription] "Which partners will work on this asset?" — DM Sans 14px, --text-muted
[Helper] "You can add or change partners later from the asset detail page."
  — DM Sans 12px, --text-muted, italic

[PartnerList] — currently assigned partners (starts empty)

[Button: "Add Partner"] — NeuButton ghost, --accent-teal, icon: plus
  Opens selection flow:
    1. NeuSelect (searchable): select a partner from existing partners
    2. After partner selected: show available modules for this partner
       (filtered by the value path selected in Step 2)
    3. Select module (or "No module — manual tasks")
    4. Define role on this asset (text input or select from: Lead Counsel, BD, Tokenization Platform, Vault, Appraiser, Transfer Agent, KYC Provider, Other)
    5. Partner appears in assigned list

[AssignedPartnerRow] — NeuCard flat per partner
  [PartnerName] — DM Sans 14px, --text-primary
  [TypeBadge] — NeuBadge
  [ModuleName] — DM Sans 12px, --text-secondary (or "No module" in --text-muted)
  [RoleBadge] — NeuBadge
  [RemoveButton] — X icon, --accent-ruby

[TeamAssignment]
  [Field: Lead Team Member] — NeuSelect, required
    Options: team members with avatars + roles
  [Field: Additional Team Members] — Multi-select NeuSelect
    Options: team members

[Validation] At least 1 team member assigned → "Next" enabled (partners optional)
```

---

## STEP 5: REVIEW & CREATE

```
[StepTitle] "Review & Create" — DM Sans 20px, 600 weight
[StepDescription] "Confirm the details below" — DM Sans 14px, --text-muted

[SummaryCard] — NeuCard raised, full-width

  [Section: Basic Info] — [Edit] link next to header
    Asset Name: "Emerald Barrel #017093"
    Type: "Gemstone"
    Reference: "PC-2026-003"
    Estimated Value: "$18,000,000"
    Source: "Dealer Network"

  [Divider]

  [Section: Value Path] — [Edit] link
    Path: "Tokenization" with --accent-teal badge
    Or: "Undecided — Phases 1-2 only"

  [Divider]

  [Section: Holder] — [Edit] link
    Name: "White Oak Partners II LLC"
    Type: "Entity (LLC)"
    Contact: "kandi@example.com"

  [Divider]

  [Section: Partners] — [Edit] link
    List of assigned partners with module names
    Or: "No partners assigned yet"

  [Divider]

  [Section: Team] — [Edit] link
    Lead: avatar + name + role
    Additional: avatar stack

  [Divider]

  [Section: What This Will Create]
    NeuCard flat, --bg-tertiary, border-left 3px --accent-teal
    "Creating this asset will generate:"
    - "1 asset record"
    - "X governance steps" (count from governance_requirements matching path scope)
    - "X default tasks" (count from module tasks + default tasks)
    - "Y gate checkpoints" (count of gates)
    "All steps, tasks, and gates will appear in the asset's Governance tab."

[Confirmation Checkbox] — NeuCheckbox, required
  "I confirm this information is accurate and I want to create this asset"

[Button: "Create Asset"] — NeuButton primary, --accent-teal, large
  Disabled until checkbox is checked
  Loading state: spinner + "Creating..." text during API call
```

### On Create Flow

1. Call `assets.create` tRPC mutation with all wizard data
2. Server-side:
   a. Insert into `stones` table
   b. Insert or link contact record
   c. Insert into `asset_partners` for each partner assignment
   d. Call `assemble_asset_workflow(asset_id, value_path, partner_assignments)`
      - Creates `asset_steps` from `governance_requirements`
      - Creates `asset_task_instances` from `module_tasks` + default tasks
   e. Activity log entries created by DB triggers
   f. Notifications sent to assigned team members
3. On success: redirect to `/crm/assets/[new_asset_id]`
4. Toast: "Asset created successfully. Governance pipeline initialized."

### Save Draft (localStorage)

- "Save Draft" button available on all steps
- Stores current wizard state in `localStorage` key: `pleochrome_new_asset_draft`
- On page load: check for draft, show "Resume draft?" prompt
- Draft cleared on successful creation
- Draft format: JSON of all step data + current step number

---

## COMPONENTS USED

| Component | Source | Usage |
|-----------|--------|-------|
| NeuCard | `src/components/ui/NeuCard` | Path cards, summary card, partner rows |
| NeuButton | `src/components/ui/NeuButton` | Next, Back, Create Asset, Save Draft, Add Partner |
| NeuInput | `src/components/ui/NeuInput` | All text fields, currency fields |
| NeuSelect | `src/components/ui/NeuSelect` | Dropdowns for type, path, contacts, partners, team |
| NeuCheckbox | `src/components/ui/NeuCheckbox` | Confirmation checkbox, "Undecided" toggle |
| NeuBadge | `src/components/ui/NeuBadge` | Path badges, type badges, partner role badges |
| NeuTabs | `src/components/ui/NeuTabs` | "Select Existing" / "Create New" toggle |
| NeuAvatar | `src/components/ui/NeuAvatar` | Team member avatars |
| NeuProgress | `src/components/ui/NeuProgress` | Step indicator (custom variant) |

### New CRM Components

| Component | Path | Purpose |
|-----------|------|---------|
| WizardShell | `src/components/crm/WizardShell` | Step indicator + navigation + content wrapper |
| WizardStepIndicator | `src/components/crm/WizardStepIndicator` | Horizontal step progress dots |
| PathSelectorCards | `src/components/crm/PathSelectorCards` | 3 selectable path cards with descriptions |
| HolderForm | `src/components/crm/HolderForm` | Existing/new holder selection with form |
| PartnerAssignmentList | `src/components/crm/PartnerAssignmentList` | Partner selection + module assignment list |
| AssetReviewSummary | `src/components/crm/AssetReviewSummary` | Review step summary with edit links |

---

## tRPC ROUTES

### Router: `src/server/routers/assets.ts` (extends existing)

| Procedure | Type | Input | Output | Notes |
|-----------|------|-------|--------|-------|
| `assets.create` | mutation | `AssetCreateInput` (see below) | `{ asset: Asset, stepsCreated: number, tasksCreated: number, gatesCreated: number }` | Creates asset + holder contact (if new) + partner assignments + calls assemble_asset_workflow(). Activity logged. |
| `assets.checkReferenceUnique` | query | `{ referenceCode }` | `{ isUnique: boolean }` | Used on blur in Step 1 to validate reference code uniqueness. |
| `assets.getCreatePreview` | query | `{ valuePath, partnerModuleIds }` | `{ stepCount: number, taskCount: number, gateCount: number }` | Preview of what will be created — used in Step 5 summary. |

### Zod Schemas

```typescript
const AssetCreateInput = z.object({
  // Step 1: Basic Info
  name: z.string().min(1).max(255),
  assetType: z.enum(['gemstone', 'real_estate', 'precious_metal', 'mineral_rights', 'other']),
  customAssetType: z.string().max(100).optional(),
  referenceCode: z.string().min(1).max(50),
  estimatedValue: z.number().positive().optional(),
  sourceChannel: z.enum(['vault_inventory', 'dealer_network', 'direct_holder', 'partner_referral', 'inbound']).optional(),
  description: z.string().max(2000).optional(),

  // Step 2: Value Path
  valuePath: z.enum(['fractional', 'tokenization', 'debt']).optional(), // null = undecided

  // Step 3: Holder
  holder: z.union([
    z.object({ type: z.literal('existing'), contactId: z.string().uuid() }),
    z.object({
      type: z.literal('new'),
      name: z.string().min(1),
      holderType: z.enum(['individual', 'entity']),
      entityName: z.string().optional(),
      stateOfFormation: z.string().optional(),
      email: z.string().email().optional(),
      phone: z.string().optional(),
      address: z.string().optional(),
    }),
  ]),

  // Step 4: Partners + Team
  partners: z.array(z.object({
    partnerId: z.string().uuid(),
    moduleId: z.string().uuid().optional(),
    role: z.string(),
  })).optional(),
  leadTeamMemberId: z.string().uuid(),
  additionalTeamMemberIds: z.array(z.string().uuid()).optional(),
});
```

---

## STEP VALIDATION RULES

| Step | Required Fields | Validation |
|------|----------------|------------|
| 1 | Asset Name, Asset Type, Reference Code | Reference code unique check |
| 2 | Value Path (or "Undecided" checked) | At least one option selected |
| 3 | Holder (existing selected OR new form filled) | Holder name required |
| 4 | Lead Team Member | At least 1 team member |
| 5 | Confirmation checkbox | Must be checked |

"Next" button disabled until current step validation passes. "Back" always enabled (except step 1).

---

## TEST CRITERIA

| # | Test | Expected Result |
|---|------|-----------------|
| 1 | Navigate to `/crm/assets/new` | Wizard renders at step 1 |
| 2 | Step indicator shows step 1 active | First circle highlighted, others gray |
| 3 | Step 1: fill required fields | "Next" becomes enabled |
| 4 | Step 1: reference code uniqueness check | Shows green check (unique) or red X (duplicate) |
| 5 | Step 2: select Tokenization | Card highlighted with teal |
| 6 | Step 2: select Undecided | All cards deselected, undecided text shown |
| 7 | Step 3: select existing contact | Contact info populated |
| 8 | Step 3: create new holder | Form fields appear and validate |
| 9 | Step 4: add partner | Partner appears in list with module selection |
| 10 | Step 4: assign lead team member | Team member selected |
| 11 | Step 5: review summary accurate | All entered data displayed correctly |
| 12 | Step 5: "What This Will Create" counts | Correct step/task/gate counts from preview API |
| 13 | Step 5: confirm and create | Asset created, redirected to asset detail |
| 14 | Created asset has governance steps | Steps populated from templates |
| 15 | Created asset has tasks | Tasks populated from modules + defaults |
| 16 | Activity log entry | "Asset created: [name]" logged |
| 17 | Team notified | Notification sent to assigned team |
| 18 | Save Draft | State saved to localStorage |
| 19 | Resume Draft | Prompt shown on revisit, state restored |
| 20 | "Back" navigation | Can go back without losing data |
| 21 | `npm run build` | Zero errors |
| 22 | Dark mode | All wizard steps correct |
| 23 | Light mode | All wizard steps correct |

---

## CLAUDE.md RULES APPLIED

- **Three-Layer Governance Model:** Wizard creates Layer 3 (instances) from Layer 1 (requirements) + Layer 2 (modules)
- **`assemble_asset_workflow()` function:** Called on create, not manually assembling steps in frontend
- **"asset" not "stone":** All UI text says "Asset" (DB column: `stones`)
- **Neumorphic design system:** Path cards, form fields, summary card all use neumorphic components
- **Platform-agnostic:** Value path descriptions from `portal-data.ts`, no partner commitment implied
- **Activity logging is automatic:** DB triggers handle all entries on asset creation

---

## DEPENDENCIES

| Dependency | Phase | What's Needed |
|------------|-------|---------------|
| Foundation (Phase 0) | 0 | Atomic components, tRPC, Supabase |
| Templates (Phase 7) | 7 | Governance requirements + partner modules must exist for workflow assembly |
| Partners (Phase 5) | 5 | Partner data for Step 4 partner selection |

### What This Phase Provides to Others

| Consumer | What |
|----------|------|
| Pipeline Board (Phase 1) | New asset appears in Phase 1 column |
| Asset Detail (Phase 2) | Created asset navigable at `/crm/assets/[id]` |
| All phases | New asset generates steps, tasks, and gates that feed into all other CRM features |
