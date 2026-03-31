# PleoChrome V2 — Codebase Retrofit Analysis

> Date: 2026-03-30
> Purpose: Map every existing file to its V2 fate (KEEP/REWRITE/DELETE/NEW)

---

## SUMMARY

| Category | Files | Keep As-Is | Rewrite | Delete | New |
|----------|-------|-----------|---------|--------|-----|
| UI Components | 13 | 13 | 0 | 0 | 8+ |
| CRM Components | 10 | 4 | 6 | 0 | 15+ |
| CRM Pages | 15 | 0 | 15 | 0 | 8 |
| tRPC Routers | 13 | 1 | 8 | 4 | 5 |
| Lib Files | 7 | 3 | 2 | 2 | 4 |
| Server Core | 1 | 0 | 1 | 0 | 0 |
| Supabase | 4 | 3 | 0 | 0 | 1 |
| **Total** | **63** | **24** | **32** | **6** | **41+** |

---

## UI COMPONENTS (src/components/ui/) — ALL KEEP

These are design system primitives. They work and don't depend on business logic.

| File | Lines | V2 Fate | Notes |
|------|-------|---------|-------|
| NeuCard.tsx | ~90 | **KEEP** | Neumorphic card — used everywhere |
| NeuButton.tsx | ~80 | **KEEP** | Button with variants |
| NeuInput.tsx | ~100 | **KEEP** | Input + Textarea |
| NeuSelect.tsx | ~70 | **KEEP** | Select dropdown |
| NeuBadge.tsx | ~50 | **KEEP** | Status/type badges |
| NeuTabs.tsx | ~60 | **KEEP** | Tab navigation |
| NeuCheckbox.tsx | ~40 | **KEEP** | Checkbox with neumorphic style |
| NeuToggle.tsx | ~40 | **KEEP** | Toggle switch |
| NeuProgress.tsx | ~40 | **KEEP** | Progress bar |
| NeuAvatar.tsx | ~40 | **KEEP** | User avatar with initials |
| NeuToast.tsx | ~80 | **KEEP** | Toast notifications |
| index.ts | ~11 | **KEEP** | Barrel export |
| glowing-effect.tsx | ~50 | **KEEP** | Visual effect |

**NEW UI Components Needed:**
- `NeuDropzone.tsx` — Drag-and-drop file upload zone
- `NeuCommentThread.tsx` — Threaded comment display
- `NeuApprovalBanner.tsx` — Approval request/decision display
- `NeuTimeline.tsx` — Vertical timeline for activity
- `NeuNotificationBell.tsx` — Notification dropdown
- `NeuModal.tsx` — Reusable modal wrapper (currently inline in every page)
- `NeuPagination.tsx` — Cursor-based pagination controls
- `NeuSortableList.tsx` — Drag-reorderable list (using @dnd-kit)

---

## CRM COMPONENTS (src/components/crm/) — MIXED

| File | Lines | V2 Fate | Reason |
|------|-------|---------|--------|
| CRMSidebar.tsx | ~130 | **REWRITE** | New nav items (Approvals, Contacts, Reports), new phase names |
| CRMHeader.tsx | ~60 | **REWRITE** | Add notification bell, approval count badge |
| CRMBottomNav.tsx | ~50 | **REWRITE** | Update nav items for V2 |
| CommandPalette.tsx | ~120 | **REWRITE** | Search needs to cover new entities (stages, subtasks, contacts) |
| PhaseTimeline.tsx | ~80 | **REWRITE** | New 6 phases (Lead→Intake→Asset Maturity→Security→Value Creation→Distribution) |
| AssetCard.tsx | ~100 | **REWRITE** | New phase names, value model badge, stage progress |
| MobileDrawer.tsx | ~60 | **KEEP** | Generic drawer, no business logic |
| MoreSheet.tsx | ~50 | **KEEP** | Generic sheet, update nav items |
| OfflineBanner.tsx | ~30 | **KEEP** | No change needed |
| ThemeProvider.tsx | ~30 | **KEEP** | No change needed |

**NEW CRM Components Needed:**
- `StageAccordion.tsx` — Expandable stage with tasks/subtasks/progress
- `TaskCard.tsx` — Task display with type icon, assignee, subtask progress, comments
- `SubtaskChecklist.tsx` — Checkbox list within a task
- `CommentThread.tsx` — Threaded comments per task/subtask
- `ApprovalChain.tsx` — Multi-level approval display and actions
- `DocumentUploadZone.tsx` — Per-task drag-drop upload
- `RequiredDocChecklist.tsx` — Required vs uploaded doc status
- `NotificationPanel.tsx` — Slide-out notification list
- `GateEvaluationPanel.tsx` — Gate conditions and pass button
- `SaveAsTemplateModal.tsx` — Save workflow as template
- `WorkflowTimeline.tsx` — Visual pipeline progress (horizontal phase bars)
- `PaymentTracker.tsx` — Outgoing/incoming payment tracking per task
- `AssetIntakeForm.tsx` — Full intake form with contact info, provenance
- `ReportViewer.tsx` — Printable project report
- `TemplateStageEditor.tsx` — Drag-reorderable stage list for template editing

---

## CRM PAGES (src/app/crm/) — ALL REWRITE

Every page needs to be rewritten for V2 data models, but the layout patterns are reusable.

| File | Lines | V2 Fate | What Changes |
|------|-------|---------|-------------|
| page.tsx (Pipeline) | ~477 | **REWRITE** | 6 new phases, value model filter, dashboard view updates |
| assets/page.tsx | ~150 | **REWRITE** | New columns (value_model, phase names), new filters |
| assets/[id]/page.tsx | ~660 | **REWRITE** | Completely new tab structure: Workflow tab replaces Governance, new Comments/Financials tabs |
| assets/new/page.tsx | ~200 | **REWRITE** | Full intake form with contact info, provenance, asset details |
| templates/page.tsx | ~350 | **REWRITE** | Template editor with stage/task/subtask CRUD, drag-reorder |
| tasks/page.tsx | ~167 | **REWRITE** | New task types, subtask support, approval status |
| documents/page.tsx | ~251 | **REWRITE** | Per-task association, required doc checklist, batch download |
| partners/page.tsx | ~192 | **REWRITE** | Minor — new partner types, module linking |
| partners/[id]/page.tsx | ~150 | **REWRITE** | Add linked assets, modules, activity tabs |
| compliance/page.tsx | ~75 | **REWRITE** | Gate status, missing docs, risk matrix |
| activity/page.tsx | ~110 | **REWRITE** | New audit action types, entity linking |
| meetings/page.tsx | ~100 | **REWRITE** | Link to tasks, meeting notes |
| team/page.tsx | ~80 | **REWRITE** | Task counts, approval counts per member |
| settings/page.tsx | ~80 | **REWRITE** | Default template selection, notification prefs |
| layout.tsx | ~60 | **KEEP-ISH** | Minor updates for notification provider |

**NEW Pages:**
- `/crm/approvals/page.tsx` — Approval queue for current user
- `/crm/contacts/page.tsx` — Contact directory with KYC status
- `/crm/contacts/[id]/page.tsx` — Contact detail
- `/crm/templates/[id]/page.tsx` — Template editor (stage/task/subtask CRUD)
- `/crm/reports/page.tsx` — Report generation
- `/crm/reports/[assetId]/page.tsx` — Printable asset report
- `/crm/notifications/page.tsx` — Full notification history (optional, could be panel)
- `/crm/assets/[id]/print/page.tsx` — Print-optimized asset report

---

## tRPC ROUTERS (src/server/routers/) — HEAVY REWRITE

| File | Lines | V2 Fate | Reason |
|------|-------|---------|--------|
| _app.ts | ~30 | **REWRITE** | Register new routers, remove deleted ones |
| assets.ts | ~320 | **REWRITE** | New phase enum, value_model, contact FK, template instantiation |
| documents.ts | ~130 | **REWRITE** | Per-task/stage association, version chains, batch paths |
| tasks.ts | ~70 | **REWRITE** | New task types, subtask support, approval chain |
| partners.ts | ~80 | **REWRITE** | Minor updates for new partner types |
| activity.ts | ~50 | **REWRITE** | New audit action types |
| dashboard.ts | ~140 | **REWRITE** | New phase names, value model breakdown |
| search.ts | ~80 | **REWRITE** | Search new entities (stages, subtasks, contacts) |
| health.ts | ~20 | **KEEP** | No change needed |
| governance.ts | ~150 | **DELETE** | Replaced by templates router |
| steps.ts | ~46 | **DELETE** | Replaced by stages router |
| asset-task-instances.ts | ~64 | **DELETE** | Absorbed into tasks router |
| meetings.ts | ~40 | **DELETE** | Rebuilt as meetings router with task linking |

**NEW Routers:**
- `stages.ts` — Stage CRUD, reorder, hide/unhide, status updates
- `subtasks.ts` — Subtask CRUD, completion, approval triggers
- `approvals.ts` — Request, decide (approve/reject), chain management
- `comments.ts` — Create, reply, edit, @mention resolution
- `notifications.ts` — List, mark read, preferences
- `contacts.ts` — Contact CRUD, KYC/OFAC status
- `templates.ts` — Template CRUD, stage/task/subtask editing, instantiation, save-as-template
- `reports.ts` — Generate asset report JSON, batch document paths
- `meetings.ts` — Rebuilt with task/asset linking

---

## LIB FILES (src/lib/) — MIXED

| File | Lines | V2 Fate | Reason |
|------|-------|---------|--------|
| database.types.ts | ~2366 | **REGENERATE** | Auto-generated from Supabase after V2 migration |
| types.ts | ~50 | **REWRITE** | New type aliases for V2 tables |
| design-system.ts | ~100 | **REWRITE** | New phase colors, value model colors |
| supabase-server.ts | ~30 | **KEEP** | Admin client works as-is |
| supabase.ts | ~15 | **KEEP** | Browser client works as-is |
| trpc.ts | ~20 | **KEEP** | Client hooks work as-is |
| utils.ts | ~15 | **KEEP** | cn() utility, no change |
| portal-data.ts | ~200 | **DELETE** | Public portal data, not CRM |
| rwa-offering-workflow-templates.ts | ~2488 | **DELETE after seeding** | Research output, will be converted to DB seeds |

**NEW Lib Files:**
- `validation/asset.ts` — Zod schemas for asset CRUD
- `validation/task.ts` — Zod schemas for task/subtask
- `validation/template.ts` — Zod schemas for template editing
- `formatters.ts` — Currency, date, phase label, task type formatters

---

## THINGS WE'RE NOT THINKING ABOUT (Shane asked for these)

### 1. Notification System
Every action that affects another team member should generate a notification:
- Comment @mentions → notification to mentioned user
- Comment replies → notification to parent comment author
- Task assignments → notification to assignee
- Approval requests → notification to approver
- Stage completions → notification to asset lead
- Document uploads → notification to task assignee
- Deadline approaching (48h) → notification to assignee
- Deadline overdue → notification to assignee + asset lead

### 2. Time Tracking
Each task and subtask should optionally track:
- Time spent (manual entry or start/stop timer)
- Billable vs non-billable hours
- This feeds into cost tracking per asset

### 3. Cost Center Tracking
Every asset should track:
- Total costs incurred (payments_outgoing across all tasks)
- Total revenue received (payments_incoming)
- Running P&L per asset
- Cost breakdown by phase and stage

### 4. Client Communication Log
Track all communications with asset holders:
- Emails sent/received (logged manually or via integration)
- Phone calls (logged with duration, notes)
- Status update reports sent
- Document requests made

### 5. Recurring Compliance Tasks
Some tasks recur on a schedule:
- Quarterly sanctions re-screening
- Quarterly vault verification
- Annual reappraisal
- Annual insurance renewal
- Annual K-1 delivery
These need a recurring task mechanism.

### 6. Risk Register
Per-asset risk tracking:
- Identified risks with severity/likelihood
- Mitigation actions
- Risk owner
- Status updates

### 7. Workflow Automation Hooks
For future:
- Auto-create tasks when a stage starts
- Auto-notify when a deadline approaches
- Auto-block stage completion if required docs missing
- Auto-advance phase when gate conditions met
- Webhook integrations (Zapier, n8n)

### 8. Audit Export
- CSV/PDF export of complete audit trail per asset
- Filterable by date range, action type, team member
- SEC/compliance-ready format

### 9. Dashboard Widgets
Beyond current dashboard:
- My Tasks widget (assigned to me, due soon)
- My Approvals widget (pending my approval)
- Recent Comments widget (mentions + replies)
- Calendar widget (meetings + deadlines)
- Cost tracker widget (total spend this month)

### 10. Template Versioning
When a template is modified:
- Save as a new version (v1, v2, v3...)
- Assets using old version keep their workflow
- Option to "upgrade" an asset to the latest template version

---

## MIGRATION ORDER

The V2 migration should be done in this order to avoid breaking the app:

1. **Database migration** — Create V2 tables alongside V1 (don't drop V1 yet)
2. **Regenerate types** — `database.types.ts` from new schema
3. **Update lib files** — types.ts, design-system.ts, formatters
4. **Rewrite routers** — One at a time, starting with assets (most depended on)
5. **Rewrite components** — Sidebar, Header, PhaseTimeline, AssetCard
6. **Rewrite pages** — Pipeline Board first, then Asset Detail, then others
7. **Add new pages** — Approvals, Contacts, Templates editor, Reports
8. **Seed templates** — Insert stage/task/subtask templates for all 5 models
9. **Drop V1 tables** — Only after everything works on V2
10. **End-to-end test** — Create asset → complete all stages → advance through phases
