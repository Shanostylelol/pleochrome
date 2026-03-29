# Page Spec: Governance Templates

**Phase:** 7 — Governance Templates + Compliance + Settings
**URL:** `/crm/templates`
**Priority:** P0
**Dependencies:** Phase 0 (Foundation), Phase 2 (Asset Detail — governance steps are instances of these templates)
**Estimated Build Time:** 4-5 hours
**Spec Version:** 1.0

---

## PURPOSE

Manage the two configuration layers of the CRM: **Governance Requirements** (Layer 1 — immutable regulatory steps) and **Partner Modules** (Layer 2 — configurable task modules per partner). This page defines WHAT must happen (governance) and HOW it happens (partner modules). Changes here affect all future assets created and can update existing assets via workflow reassembly.

**Permission restriction:** Only CEO, CTO, and Compliance Officer roles can modify governance requirements. This is enforced by RLS at the database level AND at the UI level (buttons hidden/disabled for other roles).

---

## DATA SOURCES

### Database Tables

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `governance_requirements` | Layer 1 — regulatory requirements | `id`, `step_number`, `title`, `phase_id`, `value_path_scope` (shared/fractional/tokenization/debt), `regulatory_basis`, `citation`, `source_url`, `is_gate`, `required_documents` (JSONB), `required_approvals` (JSONB), `default_tasks` (JSONB), `sort_order`, `is_active`, `created_by`, `created_at` |
| `partner_modules` | Layer 2 — partner task modules | `id`, `partner_id`, `name`, `description`, `functions_covered` (text[]), `value_paths` (text[]), `version`, `is_active`, `created_by`, `created_at` |
| `module_tasks` | Tasks within a module | `id`, `module_id`, `governance_requirement_id`, `title`, `description`, `type`, `replaces_default`, `sort_order` |
| `partners` | Partner info for module grouping | `id`, `name`, `type` |
| `assets` | Count of assets using each module | Via `asset_partners` |
| `asset_partners` | Which assets use which modules | `asset_id`, `partner_id`, `role_on_stone` |
| `activity_log` | Audit trail for template changes | Immutable |

---

## PAGE LAYOUT

### Header

```
[Title] "Governance Templates" — Cormorant Garamond, 28px, --text-primary
[Subtitle] "Layer 1: Governance Requirements | Layer 2: Partner Modules"
  — DM Sans 13px, --text-muted
```

### Section Toggle

Component: NeuTabs, large variant, full-width

```
[Tab: "Governance Requirements"] — default active
[Tab: "Partner Modules"]
```

Each tab is 48px height, full-width. Active: `--accent-teal` bottom border, `--text-primary`. Inactive: `--text-muted`.

---

## SECTION A: GOVERNANCE REQUIREMENTS

### Filter Bar

Layout: flex row, 8px gap, flex-wrap

| Filter | Component | Options |
|--------|-----------|---------|
| Path Scope | NeuTabs (pills) | "Shared (All Paths)" (default), "Fractional-Specific", "Tokenization-Specific", "Debt-Specific" |
| Phase | NeuSelect | "All Phases", "Phase 1: Acquisition", "Phase 2: Preparation", "Phase 3: [varies by path]", "Phase 4: [varies by path]" |
| Search | NeuInput | "Search requirements..." |

### Requirements List

Organized hierarchically: Path Scope > Phase > Individual Requirements

```
[Element: PathGroup] — collapsible section
  [Header] "SHARED REQUIREMENTS (All Paths)" — DM Sans 14px, 600 weight, uppercase, --text-muted
    or "TOKENIZATION-SPECIFIC", "FRACTIONAL-SPECIFIC", "DEBT-SPECIFIC"
  [Divider] — 1px --border-default

  [Element: PhaseGroup] — collapsible section, indented 16px
    [Header] — NeuCard flat, --bg-secondary, padding 12px
      "Phase 2: Preparation" — DM Sans 16px, 600 weight, --text-primary
      [StepCountBadge] "10 requirements" — NeuBadge, --text-muted
      [ChevronIcon] — expand/collapse

    [Element: RequirementRow] — flex row, 48px height, border-bottom --border-default
      Hover: --bg-tertiary
      Click: expand for full detail

      [StepNumber] "2.4" — JetBrains Mono 14px, --text-muted, 48px fixed width
      [StepTitle] "Sequential 3-Appraisal Process" — DM Sans 14px, --text-primary, flex-1
      [RegulatoryBasisPreview] — DM Sans 11px, --text-muted, truncated, 200px max
      [IsGateBadge] "Gate" — NeuBadge, --accent-gold bg at 15%, gold text (only if is_gate)
      [RequiredDocsCount] "3 docs" — DM Sans 11px, icon: file, --text-muted
      [DefaultTasksCount] "5 tasks" — DM Sans 11px, icon: check-square, --text-muted
      [SortOrder] — DM Sans 11px, --text-muted, JetBrains Mono
      [Actions] (visible only for CEO/CTO/Compliance)
        [Button: "Edit"] — icon button, ghost
        [Button: "Deactivate"] — icon button, ghost, --accent-amber
          Click: confirmation dialog, sets is_active=false, activity logged

    [Expanded RequirementDetail] — NeuCard raised, padding 20px, border-left 4px --accent-teal
      Animation: max-height transition 300ms ease

      [Section: Regulatory Basis]
        NeuCard flat, --bg-tertiary, border-left 3px --accent-sapphire
        [Icon] info-circle, --accent-sapphire
        [Text] Full regulatory basis text — DM Sans 13px, --text-secondary
        [Citation] Citation text — DM Sans 12px, --text-muted, italic
        [SourceLink] — --accent-teal, opens in new tab

      [Section: Default Tasks]
        [Header] "Default Tasks" — DM Sans 14px, 600 weight
        Vertical list:
          Each task: checkbox icon (unchecked, decorative) + title + type badge + description
          — DM Sans 13px, --text-primary (title), --text-muted (description)

      [Section: Required Documents]
        [Header] "Required Documents" — DM Sans 14px, 600 weight
        Vertical list:
          Each: document type name + "Required" (ruby) or "Optional" (gray) NeuBadge

      [Section: Required Approvals]
        [Header] "Required Approvals" — DM Sans 14px, 600 weight
        Vertical list:
          Each: approver role + approval type
```

### Add Requirement (CEO/CTO/Compliance only)

```
[Button: "Add Governance Requirement"] — NeuButton primary, --accent-teal
  Visible only when ctx.user.role IN ('ceo', 'cto', 'compliance_officer')
  Opens NeuModal, 640px wide

  Fields:
    Step Number — NeuInput, required (e.g., "2.11")
    Title — NeuInput, required
    Phase — NeuSelect (1-4), required
    Path Scope — NeuSelect (shared/fractional/tokenization/debt), required
    Regulatory Basis — Textarea, required (full legal justification)
    Citation — NeuInput (e.g., "USPAP Standard 8")
    Source URL — NeuInput (URL)
    Is Gate Step — NeuToggle (yes/no)
    Sort Order — NeuInput (number)
    Default Tasks — Repeater field (add/remove tasks with title + type + description)
    Required Documents — Repeater field (document type + required/optional toggle)
    Required Approvals — Repeater field (approver role + approval type)

  Footer: "Create Requirement" (NeuButton primary) + "Cancel" (NeuButton ghost)
  On create: activity logged, appears in list
```

---

## SECTION B: PARTNER MODULES

### Filter Bar

| Filter | Component | Options |
|--------|-----------|---------|
| Partner | NeuSelect (searchable) | "All Partners" + partner names |
| Function | NeuSelect | "All Functions", "BD", "ATS", "Transfer Agent", "Tokenization", "KYC", "Vault", "Counsel", "Appraiser" |
| Value Path | NeuSelect | "All Paths", "Fractional", "Tokenization", "Debt" |
| Search | NeuInput | "Search modules..." |

### Module List — Grouped by Partner

```
[Element: PartnerModuleGroup] — collapsible section
  [Header] — NeuCard flat, --bg-secondary
    [PartnerName] "Bull Blockchain Law" — DM Sans 16px, 600 weight
    [TypeBadge] "Counsel" — NeuBadge, --accent-amethyst
    [ModuleCount] "2 modules" — NeuBadge, --text-muted
    [ChevronIcon]

  [Element: ModuleCard] — NeuCard raised, padding 16px, margin-bottom 8px

    [Row 1: Name + Version]
      [ModuleName] "Bull Blockchain — PPM + Form D Module" — DM Sans 16px, 600 weight
      [VersionBadge] "v1.0" — JetBrains Mono, NeuBadge

    [Row 2: Description]
      DM Sans 13px, --text-secondary

    [Row 3: Badges]
      [Functions] NeuBadge tags — --accent-amethyst bg at 15%
      [ValuePaths] NeuBadge tags — path colors

    [Row 4: Stats]
      "8 tasks" — icon: check-square
      "Active on 2 assets" — icon: gem
      "Last updated: Mar 20" — icon: clock
      All: DM Sans 12px, --text-muted

    [ExpandButton] "Show task mapping" — NeuButton ghost, small
    [ExpandedContent] — NeuCard flat, --bg-tertiary

      [Task-to-Governance-Step Mapping Table]
        | Column | Content |
        | Task Title | Module task title |
        | Governance Step | Step number + title from governance_requirements |
        | Replaces Default? | "Yes" (replaces generic) or "Extends" (adds to defaults) — NeuBadge |

    [Actions]
      [Button: "Edit Module"] — NeuButton ghost, small
      [Button: "Clone Module"] — NeuButton ghost, small
      [Button: "Deactivate"] — NeuButton ghost, small, --accent-amber
```

### Create Module Wizard

Trigger: "Create Module" button
Component: NeuModal, 700px wide, multi-step wizard

**Step 1: Basic Info**
- Module Name — NeuInput, required
- Description — Textarea
- Partner — NeuSelect (searchable), required
- Functions Covered — Multi-select NeuBadge tags
- Value Paths — Multi-select (Fractional, Tokenization, Debt)

**Step 2: Map Tasks to Governance Steps**
- Left column: governance requirements list (searchable, filterable by phase)
- Right column: task builder
- For each governance step: "Add Task" button
  - Task title — NeuInput
  - Task description — Textarea
  - Task type — NeuSelect (action/upload/review/approval/automated)
  - Replaces Default? — NeuToggle (yes = replaces generic tasks, no = extends)
- Visual: drag to reorder tasks within a step

**Step 3: Review**
- Summary of all mapped tasks
- Total task count
- Governance coverage: "Covers X of Y requirements in [Phase]"
- "Create Module" button

### Clone Module

```
[Button: "Clone Module"] — on existing module card
  Opens NeuModal:
    Source module name (read-only)
    New module name — NeuInput, required
    New partner — NeuSelect (defaults to same partner)
    "Clone" button creates copy with all task mappings
    User can then edit the clone
```

---

## COMPONENTS USED

| Component | Source | Usage |
|-----------|--------|-------|
| NeuCard | `src/components/ui/NeuCard` | Requirement rows, module cards, expanded details |
| NeuButton | `src/components/ui/NeuButton` | Add, Edit, Deactivate, Clone, Create |
| NeuBadge | `src/components/ui/NeuBadge` | Gate, functions, paths, version, counts |
| NeuInput | `src/components/ui/NeuInput` | Search, form fields |
| NeuSelect | `src/components/ui/NeuSelect` | Filters, form fields |
| NeuTabs | `src/components/ui/NeuTabs` | Section toggle (Requirements / Modules), path scope pills |
| NeuToggle | `src/components/ui/NeuToggle` | Is Gate toggle, Replaces Default toggle |
| NeuModal | `src/components/ui/NeuModal` | Add requirement, create module wizard, clone |

### New CRM Components

| Component | Path | Purpose |
|-----------|------|---------|
| RequirementRow | `src/components/crm/RequirementRow` | Collapsed requirement summary row |
| RequirementDetail | `src/components/crm/RequirementDetail` | Expanded requirement with regulatory basis, tasks, docs |
| ModuleCard | `src/components/crm/ModuleCard` | Partner module card with expandable task mapping |
| ModuleCreateWizard | `src/components/crm/ModuleCreateWizard` | Multi-step module creation flow |
| TaskMappingEditor | `src/components/crm/TaskMappingEditor` | Task-to-governance-step mapping interface |
| RequirementCreateForm | `src/components/crm/RequirementCreateForm` | Governance requirement creation form |

---

## tRPC ROUTES

### Router: `src/server/routers/templates.ts`

| Procedure | Type | Input | Output | Notes |
|-----------|------|-------|--------|-------|
| `templates.listRequirements` | query | `{ pathScope?, phase?, search? }` | `{ requirements: GovernanceRequirement[] }` | Grouped by path scope and phase. Includes counts for docs, tasks, approvals. |
| `templates.getRequirement` | query | `{ requirementId }` | `{ requirement: GovernanceRequirementFull }` | Full detail with default tasks, required docs, required approvals. |
| `templates.createRequirement` | mutation | `{ stepNumber, title, phaseId, pathScope, regulatoryBasis, citation?, sourceUrl?, isGate, sortOrder, defaultTasks?, requiredDocuments?, requiredApprovals? }` | `{ requirement: GovernanceRequirement }` | **CEO/CTO/Compliance only.** Activity logged. |
| `templates.updateRequirement` | mutation | `{ requirementId, ...fields }` | `{ requirement: GovernanceRequirement }` | **CEO/CTO/Compliance only.** Activity logged with before/after diff. |
| `templates.deactivateRequirement` | mutation | `{ requirementId }` | `{ requirement: GovernanceRequirement }` | Sets `is_active=false`. Does NOT delete. Activity logged. |
| `templates.listModules` | query | `{ partnerId?, function?, valuePath?, search? }` | `{ modules: PartnerModule[] }` | Grouped by partner. Includes task counts and active asset counts. |
| `templates.getModule` | query | `{ moduleId }` | `{ module: PartnerModuleFull }` | Full module with all tasks and governance step mappings. |
| `templates.createModule` | mutation | `{ name, description, partnerId, functionsCovered, valuePaths, tasks: TaskMapping[] }` | `{ module: PartnerModule }` | Activity logged. |
| `templates.updateModule` | mutation | `{ moduleId, ...fields }` | `{ module: PartnerModule }` | Activity logged. Version incremented. |
| `templates.cloneModule` | mutation | `{ sourceModuleId, newName, newPartnerId? }` | `{ module: PartnerModule }` | Deep copy of module + all task mappings. Activity logged. |
| `templates.deactivateModule` | mutation | `{ moduleId }` | `{ module: PartnerModule }` | Sets `is_active=false`. Activity logged. |

### Zod Schemas

```typescript
const RequirementCreateInput = z.object({
  stepNumber: z.string().regex(/^\d+\.\d+$/, 'Format: X.Y'),
  title: z.string().min(1).max(500),
  phaseId: z.number().int().min(1).max(4),
  pathScope: z.enum(['shared', 'fractional', 'tokenization', 'debt']),
  regulatoryBasis: z.string().min(1).max(10000),
  citation: z.string().max(500).optional(),
  sourceUrl: z.string().url().optional(),
  isGate: z.boolean().default(false),
  sortOrder: z.number().int().min(1),
  defaultTasks: z.array(z.object({
    title: z.string(),
    type: z.enum(['action', 'upload', 'review', 'approval', 'automated']),
    description: z.string().optional(),
  })).optional(),
  requiredDocuments: z.array(z.object({
    documentType: z.string(),
    required: z.boolean().default(true),
  })).optional(),
  requiredApprovals: z.array(z.object({
    role: z.string(),
    approvalType: z.string(),
  })).optional(),
});

const ModuleCreateInput = z.object({
  name: z.string().min(1).max(500),
  description: z.string().max(5000).optional(),
  partnerId: z.string().uuid(),
  functionsCovered: z.array(z.string()),
  valuePaths: z.array(z.enum(['fractional', 'tokenization', 'debt'])),
  tasks: z.array(z.object({
    governanceRequirementId: z.string().uuid(),
    title: z.string().min(1),
    description: z.string().optional(),
    type: z.enum(['action', 'upload', 'review', 'approval', 'automated']),
    replacesDefault: z.boolean().default(false),
    sortOrder: z.number().int(),
  })),
});
```

---

## PERMISSION MODEL

| Action | Allowed Roles | Enforcement |
|--------|--------------|-------------|
| View governance requirements | All authenticated team members | RLS: SELECT for active team members |
| Create governance requirement | CEO, CTO, Compliance Officer | RLS + tRPC middleware check |
| Edit governance requirement | CEO, CTO, Compliance Officer | RLS + tRPC middleware check |
| Deactivate governance requirement | CEO, CTO, Compliance Officer | RLS + tRPC middleware check |
| View partner modules | All authenticated team members | RLS: SELECT for active team members |
| Create partner module | All authenticated team members | No role restriction |
| Edit partner module | Module creator + CEO/CTO | tRPC middleware check |
| Clone partner module | All authenticated team members | No role restriction |

UI enforcement: buttons/actions hidden for unauthorized roles via `ctx.user.role` check.

---

## TEST CRITERIA

| # | Test | Expected Result |
|---|------|-----------------|
| 1 | Navigate to `/crm/templates` | Page renders with section toggle |
| 2 | Governance Requirements tab shows requirements | Grouped by path and phase |
| 3 | Filter by "Tokenization-Specific" | Only tokenization requirements shown |
| 4 | Filter by phase | Only requirements for selected phase shown |
| 5 | Expand a requirement | Full detail: regulatory basis, tasks, docs, approvals |
| 6 | Regulatory basis shows citation and source link | Link opens in new tab |
| 7 | Gate badge visible on gate requirements | Gold "Gate" NeuBadge shown |
| 8 | Add Requirement (as CEO) | Form opens, requirement created |
| 9 | Add Requirement (as non-CEO) | Button hidden or disabled |
| 10 | Deactivate requirement | is_active=false, row grayed out, activity logged |
| 11 | Partner Modules tab shows modules | Grouped by partner |
| 12 | Expand module task mapping | Table shows task -> governance step mapping |
| 13 | Create Module wizard | 3-step wizard completes, module created |
| 14 | Clone Module | Copy created with new name, all task mappings preserved |
| 15 | Deactivate module | is_active=false, activity logged |
| 16 | Module stats accurate | Task count, active asset count, last updated correct |
| 17 | Search works on both sections | Filters by title/name keyword |
| 18 | `npm run build` | Zero errors |
| 19 | Dark mode | All elements correct |
| 20 | Light mode | All elements correct |

---

## CLAUDE.md RULES APPLIED

- **Three-Layer Governance Model:** This page manages Layers 1 and 2. Layer 3 (instances) is created by `assemble_asset_workflow()`.
- **Governance requirements can only be modified by CEO, CTO, or Compliance Officer:** Enforced by RLS AND UI.
- **Never modify migration files directly:** Any schema changes need new migration files.
- **Activity logging is automatic:** DB triggers handle all audit entries.
- **Platform-agnostic:** Module names reference partners by name, never imply commitment.
- **Neumorphic design system:** All visual elements use CSS custom properties.

---

## DEPENDENCIES

| Dependency | Phase | What's Needed |
|------------|-------|---------------|
| Foundation (Phase 0) | 0 | Atomic components, tRPC, auth context |
| Partners (Phase 5) | 5 | Partner data for module grouping and partner selection |

### What This Phase Provides to Others

| Consumer | What |
|----------|------|
| Phase 1 (Pipeline Board) | New Asset Wizard calls `assemble_asset_workflow()` which reads from governance_requirements + partner_modules |
| Phase 2 (Asset Detail) | Governance tab displays requirement instances. Partner tab shows assigned modules. |
| Phase 5 (Partners) | Partner detail Modules tab shows modules from this system |
| Phase 7 (Compliance) | Compliance score calculated based on governance step completion |
