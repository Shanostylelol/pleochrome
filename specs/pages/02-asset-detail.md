# Spec: 02 — Asset Detail (Core Workflow Page)

**Phase:** 2 (Asset Detail + Governance)
**Steps:** 2.1 through 2.7
**Depends On:** Phase 1 complete (Pipeline Board, assets router with list/create)
**Produces:** Full asset detail page with 8 tabs, governance workflow, gate checks
**Estimated Time:** 6-8 hours

---

## CLAUDE.md Rules That Apply

- `API Rules #1`: All data mutations go through tRPC.
- `API Rules #2`: Every mutation must invalidate affected queries.
- `API Rules #3`: Activity logging is automatic (DB triggers). Do NOT manually insert activity_log rows.
- `Component Rules #2`: Every visual component MUST use the neumorphic design system.
- `Component Rules #3`: Every component MUST support dark AND light mode.
- `CRM Architecture`: This page touches ALL three layers. Governance tab reads Layer 1 (governance_requirements). Step tasks read Layer 2 (module_tasks/default_tasks) and Layer 3 (asset_task_instances). The hero reads Layer 3 (assets + asset_steps).
- `Database Rules #3`: The `activity_log` table is IMMUTABLE. No UPDATE or DELETE operations.
- `Database Rules #4`: Documents with `is_locked = true` cannot be deleted.
- `DO NOT`: Use "stone" or "stones" — use "asset" or "assets".
- `DO NOT`: Hardcode colors or shadows — use design system variables.

---

## URL

```
/crm/assets/[id]
```

Where `[id]` is the asset's UUID.

---

## Data Sources

| Table/View | What It Provides |
|------------|-----------------|
| `assets` | Core asset record (name, value, phase, status, metadata JSONB) |
| `asset_steps` | All governance steps for this asset (with status, progress) |
| `asset_task_instances` | Tasks per step (Layer 3 execution records) |
| `governance_requirements` | Regulatory basis for each step (Layer 1) |
| `documents` | Documents attached to this asset or its steps |
| `activity_log` | Immutable audit trail filtered by asset_id |
| `gate_checks` | Gate passage records for this asset |
| `comments` | Threaded comments on steps and the asset |
| `asset_partners` | Partners assigned to this asset |
| `team_members` | Team member details for avatars and assignees |
| `contacts` | Asset holder contact information |
| `tasks` | Ad-hoc tasks for this asset (in addition to asset_task_instances) |

---

## Page Layout

```
+------------------------------------------------------------------+
| BREADCRUMB: Pipeline > Emerald Barrel #017093                     |
+------------------------------------------------------------------+
| HERO SECTION                                                      |
| [Edit] [Add Doc] [Add Note] [Export]                              |
|                                                                   |
| Emerald Barrel #017093                    PC-2026-001             |
| [Active] [Tokenization] [Emerald]                                 |
| White Oak Partners II LLC                                         |
|                                                                   |
| Appraised: $18M  Offering: $15.4M  Raised: $0  Investors: 0      |
| Lead: [Shane avatar] Shane    Team: [David] [Chris]               |
+------------------------------------------------------------------+
| PHASE TIMELINE (horizontal)                                       |
| (0)----(1)----(2)----[3]----(4)----(5)----(6)----(7)----(8)      |
|  done   done  active  next  ...                                   |
+------------------------------------------------------------------+
| TAB BAR                                                           |
| [Overview] [Governance] [Documents] [Tasks] [Activity]            |
| [Gates] [Financials] [Partners]                                   |
+------------------------------------------------------------------+
| TAB CONTENT                                                       |
| (renders active tab's content below)                              |
|                                                                   |
+------------------------------------------------------------------+
```

---

## Section 1: Breadcrumb

**Components used:** None (simple nav links)

```
Pipeline > Emerald Barrel #017093
```

- "Pipeline" links to `/crm`
- ">" separator in `color: var(--text-muted)`
- Current page name in `color: var(--text-primary)`, `font-weight: 600`
- `font-size: 13px`

---

## Section 2: Hero

**Components used:** `NeuCard` (variant="raised"), `NeuBadge`, `NeuAvatar`, `NeuButton`

### Layout

Two-column inside a `NeuCard`:

**Left column (70%):**

1. **Asset name:** `font-family: var(--font-display)`, `font-size: 28px`, `font-weight: 600`, `color: var(--text-primary)`

2. **Reference code:** `font-family: var(--font-mono)`, `font-size: 13px`, `color: var(--text-muted)` — displayed next to or below the name

3. **Badge row:** `display: flex`, `gap: 6px`, `margin-top: 8px`
   - Status badge: `NeuBadge` colored by `STATUS_COLORS[status]` (e.g., "Active" = teal)
   - Path badge: `NeuBadge` colored by `PATH_COLORS[value_path]` (e.g., "Tokenization" = teal)
   - Type badge: `NeuBadge color="gray"` (e.g., "Emerald")

4. **Holder:** `font-size: 14px`, `color: var(--text-secondary)`, entity name

5. **Key metrics row:** `display: grid`, `grid-template-columns: repeat(4, 1fr)`, `gap: var(--space-md)`, `margin-top: var(--space-md)`
   - Each metric: label (12px muted uppercase) + value (20px bold primary)
   - Appraised Value: `claimed_value` formatted
   - Offering Value: `offering_value` formatted (or "TBD")
   - Capital Raised: from metadata or $0
   - Investors: from metadata or 0

6. **Team row:** Lead avatar + name, then other team avatars

**Right column (30%):**

Action buttons stacked vertically:
- `NeuButton variant="primary" icon={<Edit3 />}` "Edit Asset"
- `NeuButton variant="ghost" icon={<FileUp />}` "Add Document"
- `NeuButton variant="ghost" icon={<MessageSquare />}` "Add Note"
- `NeuButton variant="ghost" icon={<Download />}` "Export"

**User interactions:**
| Action | What Happens |
|--------|-------------|
| Click "Edit Asset" | Opens NeuModal with asset edit form. On save: `assets.update` mutation. |
| Click "Add Document" | Opens document upload modal (scrolls to Documents tab). |
| Click "Add Note" | Opens comment input (scrolls to Overview tab notes section). |
| Click "Export" | Downloads asset summary as CSV/PDF (Phase 4 feature — show disabled for now). |

---

## Section 3: Phase Timeline

**Components used:** Custom `PhaseTimeline` component

A horizontal connected-dot visualization showing the asset's progress through all phases.

```
  (0) ---- (1) ---- (2) ---- [3] ---- (4) ---- (5) ---- (6) ---- (7) ---- (8)
  done     done    active    next     pending  pending  pending  pending  pending
```

**Phase dot states:**
- Completed: filled circle with `var(--chartreuse)`, checkmark inside
- Active (current): larger filled circle with `var(--teal)`, pulsing glow animation
- Next (not started, immediately after current): outlined circle with `var(--text-muted)`
- Pending (future): small outlined circle with `var(--text-placeholder)`

**Connecting lines:**
- Completed: solid line, `var(--chartreuse)`
- Active to next: gradient from `var(--teal)` to `var(--text-muted)`
- Future: dashed line, `var(--text-placeholder)`

**Labels:** Phase name beneath each dot, `font-size: 11px`, `color: var(--text-muted)` for pending, `var(--text-secondary)` for completed, `var(--text-primary)` for active.

**Phase names (from current_phase enum):**
| Phase | Display Name |
|-------|-------------|
| phase_0_foundation | Foundation |
| phase_1_intake | Intake |
| phase_2_certification | Certification |
| phase_3_custody | Custody |
| phase_4_legal | Legal |
| phase_5_tokenization | Tokenization |
| phase_6_regulatory | Regulatory |
| phase_7_distribution | Distribution |
| phase_8_ongoing | Ongoing |

**User interaction:**
- Click a completed or active phase dot: scrolls the Governance tab to that phase section
- Hover: tooltip with phase name and step count (e.g., "Certification: 10 steps, 7 complete")

---

## Section 4: Tab Bar

**Components used:** `NeuTabs`

8 tabs:

| Tab ID | Label | Icon (Lucide) | Count Badge |
|--------|-------|---------------|-------------|
| `overview` | Overview | `LayoutGrid` | - |
| `governance` | Governance | `Shield` | Total steps count |
| `documents` | Documents | `FileText` | Document count |
| `tasks` | Tasks | `CheckSquare` | Open tasks count |
| `activity` | Activity | `Activity` | - |
| `gates` | Gates | `Lock` | Gate count |
| `financials` | Financials | `DollarSign` | - |
| `partners` | Partners | `Handshake` | Partner count |

Default active tab: `overview`

Tab state stored in URL search params (e.g., `/crm/assets/[id]?tab=governance`) so tabs are linkable and survive page refreshes.

---

## Tab 1: Overview

**Components used:** `NeuCard` (6 cards in 2x3 grid), `NeuBadge`, `NeuButton`

### Layout: `display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-md)`

On screens < 1024px: `grid-template-columns: 1fr` (single column)

### Card 1: Holder Information

**NeuCard variant="raised" with header "Holder Information"**

| Field | Source | Display |
|-------|--------|---------|
| Name | `asset_holder_entity` or contact `full_name` | Text |
| Entity Type | contact `entity` | Text |
| KYC Status | contact `kyc_status` | NeuBadge (emerald=verified, amber=pending, ruby=failed, gray=not_started) |
| OFAC Status | contact `ofac_status` | NeuBadge |
| PEP Status | contact `pep_status` | NeuBadge |
| Engagement Status | `metadata.engagement_status` | Text |
| Email | contact `email` | Text (clickable mailto) |
| Phone | contact `phone` | Text (clickable tel) |

**Actions:**
- "View DD Report" button: opens document viewer for the holder's DD report (if exists)
- "View Holder Documents" subsection: lists documents where `contact_id` matches holder

### Card 2: Certification

| Field | Source | Display |
|-------|--------|---------|
| GIA Report # | `metadata.gia_report_number` | Mono text |
| Origin | `origin` | Text |
| Grade/Quality | `metadata.grade` | Text |
| Carat Weight | `carat_weight` | Number with "ct" suffix |
| Verified | `metadata.certification_verified` | NeuBadge (chartreuse=yes, gray=no) |
| Lab | `metadata.lab` | Text (e.g., "GIA") |

### Card 3: Appraisals

| Field | Source | Display |
|-------|--------|---------|
| Appraisal 1 | `metadata.appraisals[0]` | Currency |
| Appraisal 2 | `metadata.appraisals[1]` | Currency |
| Appraisal 3 | `metadata.appraisals[2]` | Currency |
| Variance | Calculated (max-min)/avg*100 | Percentage with NeuBadge (chartreuse if <15%, amber if 15-20%, ruby if >20%) |
| Offering Value | `offering_value` | Currency, bold |

### Card 4: Custody

| Field | Source | Display |
|-------|--------|---------|
| Vault Provider | `metadata.vault_provider` | Text |
| Custody Receipt | `metadata.custody_receipt_id` | Mono text |
| Insured Value | `metadata.insured_value` | Currency |
| PoR Status | `metadata.por_status` | NeuBadge |
| Insurance Expiry | `metadata.insurance_expiry` | Date, amber if < 90 days |

### Card 5: Legal

| Field | Source | Display |
|-------|--------|---------|
| SPV Name | `spv_name` | Text |
| SPV EIN | `spv_ein` | Mono text |
| PPM Version | `metadata.ppm_version` | Text |
| Securities Counsel | `metadata.counsel` | Text |
| Form D Status | `metadata.form_d_status` | NeuBadge |

### Card 6: Distribution

Content varies by `value_path`:

**Tokenization:**
| Field | Source | Display |
|-------|--------|---------|
| Token Symbol | `metadata.token_symbol` | Mono text |
| Total Supply | `metadata.total_supply` | Number |
| Contract Address | `metadata.contract_address` | Mono text, truncated |
| Chain | `metadata.chain` | Text (e.g., "Polygon") |
| Investors | `metadata.investor_count` | Number |

**Fractional:**
| Field | Source | Display |
|-------|--------|---------|
| Total Units | `metadata.total_units` | Number |
| Unit Price | `metadata.unit_price` | Currency |
| Min Investment | `metadata.min_investment` | Currency |
| Transfer Agent | `metadata.transfer_agent` | Text |
| BD | `metadata.broker_dealer` | Text |

**Debt:**
| Field | Source | Display |
|-------|--------|---------|
| Loan Amount | `metadata.loan_amount` | Currency |
| LTV Ratio | `metadata.ltv_ratio` | Percentage |
| Interest Rate | `metadata.interest_rate` | Percentage |
| Term | `metadata.loan_term` | Text (e.g., "24 months") |
| Lender | `metadata.lender` | Text |

---

## Tab 2: Governance (The Core Workflow Tab)

**Components used:** `NeuCard`, `NeuBadge`, `NeuCheckbox`, `NeuButton`, `NeuModal`, `NeuProgress`, `NeuInput`

This is the most complex tab. It shows the full governance workflow organized by phases.

### Layout

Phases are rendered as collapsible sections, top to bottom:

```
+------------------------------------------------------------------+
| [v] Phase 1: Intake (5/8 steps complete)          [NeuProgress]  |
+------------------------------------------------------------------+
|  1.1 Identify Target Asset          [completed]  2/2 tasks  1 doc |
|  1.2 Holder Introduction & NDA      [completed]  1/1 tasks  1 doc |
|  1.3 KYC / KYB on Asset Holder      [in_progress] 0/3 tasks 0 doc|
|      [expand arrow]                                               |
|  ...                                                              |
|  --- G1: SOURCE GATE ---                                          |
|  [Evaluate Gate] or [Gate Passed: 2026-03-15]                    |
|  --- G2: EVIDENCE GATE ---                                        |
|  [Evaluate Gate]                                                  |
+------------------------------------------------------------------+
| [v] Phase 2: Certification (2/10 steps complete)                  |
+------------------------------------------------------------------+
| ...                                                               |
```

### Phase Section

**Collapsed state:**
- `NeuCard variant="pressed"` (concave background)
- Phase number + title: `font-size: 16px`, `font-weight: 600`, `color: var(--text-primary)`
- Progress summary: "5/8 steps" + `NeuProgress` bar
- Click to expand

**Expanded state:**
- `NeuCard variant="raised"` (elevated)
- Phase header as above
- Step rows listed below

### Step Row (Collapsed)

Each governance step is a row:

```
[status icon]  1.3  KYC / KYB on Asset Holder  [in_progress]  2/3 tasks  1 doc  [approval badge]  [>]
```

| Element | Source | Display |
|---------|--------|---------|
| Status icon | `asset_steps.status` | Circle: gray (not_started), teal spinning (in_progress), red (blocked), green check (completed), gray dash (skipped) |
| Step number | `asset_steps.step_number` | Mono text, `font-size: 12px` |
| Title | `asset_steps.step_title` | `font-size: 14px`, `font-weight: 500` |
| Status badge | `asset_steps.status` | `NeuBadge` colored by `STEP_STATUS_COLORS` |
| Task progress | Count from `asset_task_instances` | "2/3 tasks" text |
| Doc progress | Count from `documents` where `step_id` = this step | "1 doc" text |
| Approval status | From `governance_requirements.required_approvals` | NeuBadge "Approved" (chartreuse) or "Pending" (amber) |
| Expand arrow | - | Chevron icon |

### Step Row (Expanded)

When clicked, the step row expands to show full detail:

```
+------------------------------------------------------------------+
| 1.3 KYC / KYB on Asset Holder                    [in_progress]   |
|                                                                   |
| REGULATORY BASIS                                                  |
| +--------------------------------------------------------------+ |
| | Bank Secrecy Act and FinCEN regulations require...           | |
| | Citation: BSA 31 USC 5311-5332; FinCEN 31 CFR Part 1027     | |
| | Source: https://www.fincen.gov/...                           | |
| +--------------------------------------------------------------+ |
|                                                                   |
| TASKS                                                             |
| [x] Run OFAC/SDN screening on holder entity    [done]            |
| [x] Complete KYC identity verification          [done]            |
| [ ] Submit beneficial ownership disclosure      [todo]            |
|                                                                   |
| DOCUMENTS                                                         |
| [kyc_report.pdf]   Uploaded 2026-03-15  [View] [Lock]            |
| [ofac_screening]   Required - not uploaded     [Upload]           |
| [pep_screening]    Required - not uploaded     [Upload]           |
|                                                                   |
| APPROVALS                                                         |
| Compliance Officer:  [Pending]                                    |
|                                                                   |
| COMMENTS (3)                                                      |
| Shane: "Kandi's entity structure is complex..."  Mar 15           |
|   David: "I'll follow up with the registered agent" Mar 16       |
| Chris: "Background check came back clean" Mar 17                 |
| [Add comment...]                                                  |
|                                                                   |
| ACTIVITY (filtered to this step)                                  |
| Mar 15 — Step started by Shane                                    |
| Mar 15 — Document "kyc_report.pdf" uploaded                      |
| Mar 16 — Task "Run OFAC screening" completed by David            |
+------------------------------------------------------------------+
```

#### Regulatory Basis Box

- `NeuCard variant="pressed"` with `padding: var(--space-md)`
- Header: "Regulatory Basis" in `font-size: 12px`, `text-transform: uppercase`, `color: var(--text-muted)`
- Body: `governance_requirements.regulatory_basis` text in `font-size: 13px`, `color: var(--text-secondary)`
- Citation: `governance_requirements.regulatory_citation` in `font-family: var(--font-mono)`, `font-size: 12px`
- Source URL: clickable link, `color: var(--teal)`, opens in new tab

**Data source:** Join `asset_steps.governance_requirement_id` -> `governance_requirements`

#### Tasks Section

- List of `asset_task_instances` where `asset_step_id` = this step
- Each task: `NeuCheckbox` + title + `NeuBadge` for status
- Clicking checkbox: calls `tasks.completeInstance` mutation, invalidates step progress

#### Documents Section

- Required documents from `governance_requirements.required_documents` array
- Uploaded documents from `documents` table where `step_id` = this step
- For each required doc type: show uploaded file OR "Required - not uploaded" with upload button
- Upload button opens file picker, uploads to Supabase Storage, creates `documents` row

#### Approvals Section

- From `governance_requirements.required_approvals` JSONB
- Shows who needs to approve and current status
- "Approve" button (for authorized users) calls `steps.approve` mutation

#### Comments Section

- From `comments` table where `entity_type = 'step'` and `entity_id` = step ID
- Threaded: parent comments + child replies (one level deep)
- Each comment: author name, avatar, timestamp, body
- "Add comment" textarea at bottom: `NeuInput` (textarea variant)
- Submit: calls `comments.create` mutation

#### Activity Section (Step-Filtered)

- From `activity_log` where `step_id` = this step
- Chronological list, most recent first
- Each entry: timestamp, action description, performed_by name
- Read-only (activity_log is immutable)

### Gate Check Rows

Between phases, gate checks appear:

```
─────────── G1: SOURCE GATE ───────────────
Conditions:
  [x] Asset holder KYC verified
  [x] Provenance documented
  [x] Engagement agreement signed
  [ ] Deal committee approval obtained

[Pass Gate]  (disabled if any condition unmet)
──────────────────────────────────────────────
```

OR if already passed:

```
─────────── G1: SOURCE GATE ───────────────
PASSED on 2026-03-15 by Shane Pierson
All 4 conditions met.
──────────────────────────────────────────────
```

**User interaction: "Pass Gate" button**

1. Click "Pass Gate": opens `NeuModal` with:
   - Gate name and description
   - All conditions listed with met/unmet status
   - Each condition is evaluated automatically:
     - Check if required steps are completed
     - Check if required documents are uploaded
     - Check if required approvals are obtained
   - Confirmation text: "Are you sure you want to pass this gate?"
   - Confirm button: `NeuButton variant="primary"` "Confirm Gate Passage"
   - Cancel button: `NeuButton variant="ghost"` "Cancel"

2. On confirm: calls `gates.passGate` mutation which:
   - Creates a `gate_checks` row with `passed: true`
   - Updates `assets.current_phase` to the next phase
   - Activity log updated automatically via trigger

3. If conditions not all met: "Pass Gate" button is disabled with tooltip showing unmet conditions

---

## Tab 3: Documents

**Components used:** `NeuCard`, `NeuBadge`, `NeuButton`, `NeuModal`

Asset-scoped document library.

| Feature | Description |
|---------|-------------|
| Filter bar | Filter by `document_type`, upload date range |
| Document list | Table/grid of documents: title, type badge, uploaded_by, date, size, version, locked status |
| Upload zone | Drag-and-drop area or "Upload" button |
| Preview modal | Click document to open preview (PDF inline, images displayed, others download) |
| Batch operations | Select multiple docs via checkboxes: download ZIP, lock, delete (if unlocked) |

**Data source:** `documents` WHERE `asset_id` = this asset AND `is_current = true`

---

## Tab 4: Tasks

**Components used:** `NeuCard`, `NeuCheckbox`, `NeuBadge`, `NeuButton`

Asset-scoped task list grouped by phase/step.

| Feature | Description |
|---------|-------------|
| Group by | Phase headers, then step headers, then tasks beneath |
| Task row | Checkbox + title + assignee avatar + due date + priority badge + status badge |
| Quick actions | Complete, reassign, change priority |
| Add task | "Add Task" button opens modal for ad-hoc tasks |

**Data sources:** `asset_task_instances` WHERE `asset_id` = this asset PLUS `tasks` WHERE `asset_id` = this asset

---

## Tab 5: Activity

**Components used:** `NeuCard`

Asset-scoped immutable audit feed.

| Feature | Description |
|---------|-------------|
| Feed | Chronological list (most recent first) |
| Each entry | Timestamp, action icon, description, performed_by, severity badge |
| Filters | By category (compliance, operational, security, financial), by severity, by date range |
| Export | "Export Audit Trail" button: downloads as CSV |
| Pagination | Load more on scroll (infinite scroll or "Load More" button) |

**Data source:** `activity_log` WHERE `asset_id` = this asset, ORDER BY `performed_at DESC`

---

## Tab 6: Gates

**Components used:** `NeuCard`, `NeuBadge`

All gate check records for this asset.

| Feature | Description |
|---------|-------------|
| Gate list | One card per gate, showing: gate name, phase from/to, passed/failed, conditions, checked_by, date |
| Passed gates | Green header, checkmark icon, all conditions shown as met |
| Failed gates | Red header, X icon, blockers listed |
| No data state | "No gate checks recorded yet" message |

**Data source:** `gate_checks` WHERE `asset_id` = this asset, ORDER BY `gate_number`

---

## Tab 7: Financials

**Components used:** `NeuCard`, `NeuProgress`

Cost tracking and revenue projection.

| Feature | Description |
|---------|-------------|
| Cost table | Estimated vs actual costs per step (from `asset_steps.estimated_cost_*` and `actual_cost`) |
| Fee calculation | Based on `REVENUE_MODELS` from `portal-data.ts`: setup fee, success fee, admin fee |
| Revenue projection | Calculated from offering_value * fee rates |
| Summary cards | Total estimated cost, total actual cost, variance, projected revenue |

**Data sources:** `asset_steps` for costs, `assets` for value, `portal-data.ts` for fee models

---

## Tab 8: Partners

**Components used:** `NeuCard`, `NeuBadge`, `NeuAvatar`, `NeuButton`

Partners assigned to this asset.

| Feature | Description |
|---------|-------------|
| Partner list | Card per partner: name, type badge, role on this asset, engagement status, DD status |
| Module status | If a partner_module is assigned, show module name and task completion |
| "Assign Partner" | Button opens modal to pick from global partners list |
| "Switch Module" | Button on each partner to change their module assignment |

**Data sources:** `asset_partners` JOIN `partners` WHERE `asset_id` = this asset. `partner_modules` for module info.

---

## tRPC Routes Required

### Additions to `src/server/routers/assets.ts`

| Route | Type | Input | Output |
|-------|------|-------|--------|
| `assets.getById` | Query | `{ id: string }` | Full asset with joined contact + team members |
| `assets.update` | Mutation | `{ id, ...partial fields }` | Updated asset |

### New Router: `src/server/routers/steps.ts`

| Route | Type | Input | Output |
|-------|------|-------|--------|
| `steps.getByAsset` | Query | `{ assetId: string }` | All steps with governance requirement join, task counts, doc counts |
| `steps.updateStatus` | Mutation | `{ stepId, status, blockedReason? }` | Updated step |
| `steps.approve` | Mutation | `{ stepId }` | Updated step with approval |

### New Router: `src/server/routers/tasks.ts` (partial — full spec in Phase 4)

| Route | Type | Input | Output |
|-------|------|-------|--------|
| `tasks.getByAsset` | Query | `{ assetId: string }` | All task instances + ad-hoc tasks |
| `tasks.completeInstance` | Mutation | `{ instanceId }` | Updated task instance |

### New Router: `src/server/routers/documents.ts` (partial — full spec in Phase 3)

| Route | Type | Input | Output |
|-------|------|-------|--------|
| `documents.getByAsset` | Query | `{ assetId: string, documentType? }` | Documents for this asset |
| `documents.upload` | Mutation | `{ assetId, stepId?, title, documentType, filename, storagePath, ... }` | Created document record |

### New Router: `src/server/routers/activity.ts`

| Route | Type | Input | Output |
|-------|------|-------|--------|
| `activity.getByAsset` | Query | `{ assetId: string, category?, severity?, limit?, offset? }` | Activity log entries |

### New Router: `src/server/routers/gates.ts`

| Route | Type | Input | Output |
|-------|------|-------|--------|
| `gates.getByAsset` | Query | `{ assetId: string }` | All gate check records |
| `gates.evaluate` | Query | `{ assetId: string, gateNumber: number }` | Conditions with met/unmet status |
| `gates.passGate` | Mutation | `{ assetId, gateNumber, gateName, phaseFrom, phaseTo, conditions }` | Created gate_check record + updated asset phase |

### New Router: `src/server/routers/comments.ts`

| Route | Type | Input | Output |
|-------|------|-------|--------|
| `comments.getByEntity` | Query | `{ entityType: string, entityId: string }` | Threaded comments |
| `comments.create` | Mutation | `{ entityType, entityId, body, parentCommentId? }` | Created comment |

### New Router: `src/server/routers/partners.ts` (partial — full spec in Phase 5)

| Route | Type | Input | Output |
|-------|------|-------|--------|
| `partners.getByAsset` | Query | `{ assetId: string }` | Partners with module info |

### Update `_app.ts`

Add all new routers:

```typescript
export const appRouter = createRouter({
  health: healthRouter,
  assets: assetsRouter,
  steps: stepsRouter,
  tasks: tasksRouter,
  documents: documentsRouter,
  activity: activityRouter,
  gates: gatesRouter,
  comments: commentsRouter,
  partners: partnersRouter,
})
```

---

## Database Tables/Views Used (Complete)

| Table/View | Operations | Purpose |
|------------|------------|---------|
| `assets` | SELECT, UPDATE | Core asset data, phase updates on gate passage |
| `asset_steps` | SELECT, UPDATE | Step statuses, governance workflow |
| `asset_task_instances` | SELECT, UPDATE | Layer 3 task execution records |
| `governance_requirements` | SELECT | Layer 1 regulatory basis display |
| `governance_documents` | SELECT | Required document types per requirement |
| `documents` | SELECT, INSERT | Asset + step documents |
| `activity_log` | SELECT | Immutable audit trail (read-only from frontend) |
| `gate_checks` | SELECT, INSERT | Gate passage records |
| `comments` | SELECT, INSERT, UPDATE | Threaded comments |
| `asset_partners` | SELECT | Partner assignments |
| `partners` | SELECT | Partner details |
| `partner_modules` | SELECT | Module info for partners |
| `team_members` | SELECT | Avatars, assignee names |
| `contacts` | SELECT | Holder information |
| `tasks` | SELECT | Ad-hoc tasks |

---

## Complete Component List

| Component | File | Usage |
|-----------|------|-------|
| `NeuCard` | `src/components/ui/NeuCard.tsx` | Hero, overview cards, phase sections, step details, comment containers |
| `NeuBadge` | `src/components/ui/NeuBadge.tsx` | Status, path, type, KYC, approval, priority badges |
| `NeuTabs` | `src/components/ui/NeuTabs.tsx` | 8-tab navigation bar |
| `NeuButton` | `src/components/ui/NeuButton.tsx` | Edit, upload, comment, gate passage, approve buttons |
| `NeuModal` | `src/components/ui/NeuModal.tsx` | Edit asset, gate passage confirmation, document preview |
| `NeuInput` | `src/components/ui/NeuInput.tsx` | Comment textarea, edit form fields |
| `NeuCheckbox` | `src/components/ui/NeuCheckbox.tsx` | Task completion, gate condition display |
| `NeuProgress` | `src/components/ui/NeuProgress.tsx` | Phase progress, step progress, compliance score |
| `NeuAvatar` | `src/components/ui/NeuAvatar.tsx` | Team members, comment authors |
| `NeuSelect` | `src/components/ui/NeuSelect.tsx` | Filters, edit form dropdowns |
| `NeuSkeleton` | `src/components/ui/NeuSkeleton.tsx` | Loading states for all sections |
| `NeuToast` | `src/components/ui/NeuToast.tsx` | Success/error feedback on mutations |

---

## Complete File List

| File | Purpose |
|------|---------|
| `src/app/crm/assets/[id]/page.tsx` | Asset Detail page |
| `src/components/crm/AssetHero.tsx` | Hero section |
| `src/components/crm/PhaseTimeline.tsx` | Horizontal phase progress visualization |
| `src/components/crm/OverviewTab.tsx` | Overview tab (6 data cards) |
| `src/components/crm/GovernanceTab.tsx` | Governance tab (phases, steps, tasks, docs) |
| `src/components/crm/PhaseSection.tsx` | Collapsible phase section |
| `src/components/crm/StepRow.tsx` | Individual step row (collapsed + expanded) |
| `src/components/crm/StepDetail.tsx` | Expanded step detail (tasks, docs, approvals, comments, activity) |
| `src/components/crm/RegulatoryBasis.tsx` | Regulatory basis display box |
| `src/components/crm/GateCheckRow.tsx` | Gate display between phases |
| `src/components/crm/GatePassModal.tsx` | Gate passage confirmation modal |
| `src/components/crm/DocumentsTab.tsx` | Documents tab |
| `src/components/crm/TasksTab.tsx` | Tasks tab |
| `src/components/crm/ActivityTab.tsx` | Activity tab |
| `src/components/crm/GatesTab.tsx` | Gates tab |
| `src/components/crm/FinancialsTab.tsx` | Financials tab |
| `src/components/crm/PartnersTab.tsx` | Partners tab |
| `src/components/crm/CommentThread.tsx` | Threaded comment display |
| `src/components/crm/CommentInput.tsx` | Comment input form |
| `src/components/crm/EditAssetModal.tsx` | Asset edit form modal |
| `src/server/routers/steps.ts` | Steps tRPC router |
| `src/server/routers/gates.ts` | Gates tRPC router |
| `src/server/routers/activity.ts` | Activity tRPC router |
| `src/server/routers/comments.ts` | Comments tRPC router |
| `src/server/routers/documents.ts` | Documents tRPC router (partial) |
| `src/server/routers/tasks.ts` | Tasks tRPC router (partial) |
| `src/server/routers/partners.ts` | Partners tRPC router (partial) |
| `src/server/routers/_app.ts` | Updated merged router |

---

## User Interactions (Complete)

| Interaction | What Happens |
|-------------|-------------|
| Click breadcrumb "Pipeline" | Navigates to `/crm` |
| Click "Edit Asset" | Opens edit modal, on save: `assets.update` mutation, toast on success |
| Click "Add Document" | Opens upload zone, switches to Documents tab |
| Click "Add Note" | Focuses comment input in Overview tab |
| Click phase dot in timeline | Switches to Governance tab, scrolls to that phase |
| Click tab | Switches active tab, updates URL search param |
| Click phase header (Governance) | Toggles phase expand/collapse |
| Click step row (Governance) | Toggles step expand/collapse |
| Check task checkbox | `tasks.completeInstance` mutation, updates step progress |
| Click "Upload" on missing doc | Opens file picker, uploads to Storage, creates document record |
| Click existing document | Opens preview modal (PDF/image) or downloads (other types) |
| Click "Lock" on document | `documents.lock` mutation, shows locked badge |
| Type in comment box + submit | `comments.create` mutation, comment appears in thread |
| Click "Reply" on comment | Shows nested reply input, `comments.create` with `parentCommentId` |
| Click "Pass Gate" | Opens gate modal with conditions |
| Confirm gate passage | `gates.passGate` mutation, asset phase advances, activity logged |
| Click "Assign Partner" | Opens partner selection modal |
| Filter activity by category | Adds filter param, re-queries |
| Click "Export Audit Trail" | Downloads CSV via `file-saver` |

---

## Verification Checklist

| Check | How | Expected |
|-------|-----|----------|
| Page loads at `/crm/assets/[id]` | Browser with seeded asset | Full page renders |
| Breadcrumb shows asset name | Visual | "Pipeline > [Asset Name]" |
| Hero shows all metrics | Visual | Name, ref, badges, values, team |
| Phase timeline reflects current phase | Visual | Correct dots highlighted |
| All 8 tabs render without error | Click each tab | Content loads (may be empty) |
| Overview tab: 6 cards | Visual | All cards render with correct data |
| Governance tab: phases expand | Click phase header | Steps listed |
| Governance tab: step expands | Click step row | Regulatory basis, tasks, docs, comments, activity |
| Task checkbox works | Check a task | Status updates, step progress recalculates |
| Comment creation works | Type and submit | Comment appears in thread |
| Gate conditions evaluate | View gate row | Conditions show met/unmet |
| Gate passage works | Pass a gate | Asset phase advances, gate_check created |
| Documents tab shows files | Upload a document | Document appears in list |
| Activity tab shows feed | Check after actions | Actions logged automatically |
| `npm run build` passes | `npm run build` | Zero errors |
