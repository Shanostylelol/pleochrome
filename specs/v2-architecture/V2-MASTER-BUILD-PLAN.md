# PleoChrome V2 — Master Build Plan (FINAL)
# Replaces V2-IMPLEMENTATION-PLAN.md — this is the authoritative build sequence

> Date: 2026-03-30
> Methodology: Build → Test (API + Browser + Mobile) → Fix → Verify → Commit
> Rule: NO phase starts until the previous phase passes ALL tests
> Rule: EVERY UI phase includes mobile (375px) testing — not deferred
> Rule: `npm run build` after EVERY file change — zero errors required

---

## Pre-Flight: Before Starting ANY Phase

```
[ ] Read CLAUDE.md (project rules)
[ ] Read V2-ARCHITECTURE-RULES.md (code standards)
[ ] Read V2-MIGRATION-ADDENDUM.md (schema fixes)
[ ] Read the specific phase section below
[ ] Verify dev server running: npm run dev
[ ] Verify Supabase connected: curl /api/trpc/health.check
```

---

## Phase 0: Design System & Constants (BEFORE any code)
**Duration:** ~30 min
**Risk:** LOW but blocks everything
**Dependencies:** None

### What to Build:
1. Update `src/styles/neumorphic.css` — add V2 CSS variables:
   - Phase colors: `--phase-lead`, `--phase-intake`, `--phase-asset-maturity`, `--phase-security`, `--phase-value-creation`, `--phase-distribution`
   - Value model colors: `--model-tokenization`, `--model-fractional`, `--model-debt`, `--model-broker`, `--model-barter`
   - Gray color: `--gray`, `--gray-bg`
   - Notification variables, comment thread variables, approval badge variables
2. Rewrite `src/lib/design-system.ts` — replace all V1 constants with V2:
   - PHASE_COLORS → 6 phases
   - STATUS_COLORS → V2 statuses (active/paused/completed/terminated/archived)
   - Remove V1 PATH_COLORS
3. Create `src/lib/constants.ts` — single source of truth:
   - PHASES, VALUE_MODELS, TASK_TYPES, ASSET_STATUSES, STAGE_STATUSES (from Architecture Rules)
4. Create `src/components/ui/NeuModal.tsx` — shared modal wrapper
5. Create `src/lib/validation/shared.ts` — shared Zod fragments (uuid, pagination cursor, etc.)

### Testing:
```
[ ] npm run build passes
[ ] Dark mode: all new CSS variables resolve correctly
[ ] Light mode: all new CSS variables resolve correctly
[ ] NeuModal renders correctly (test with a simple trigger)
```

---

## Phase 1: Database Migration
**Duration:** ~2 hours
**Risk:** HIGH (foundation for everything)

### What to Build:
1. Write V2 SQL migration (single file) containing:
   - 16 enums (with `review` + `communication` in task_type, `qualified_intermediary` in partner_type)
   - 28 tables (19 blueprint + 3 partner + 3 ownership + meetings + sops + reminders)
   - All column additions from Migration Addendum (is_hidden, partner_id, partner_type, contact fields)
   - All indexes
   - Immutable trigger for activity_log
   - updated_at auto-triggers for all tables
   - All 6 RPC functions (instantiate_workflow, save_as_template, evaluate_gate, advance_phase, generate_asset_report, batch_document_paths)
2. Drop V1 tables (all except team_members)
3. Drop V1 enums
4. Seed 6 workflow templates (1 shared + 5 model-specific) with stages/tasks/subtasks from V2-COMPLETE-TASK-DENSITY.md
5. Seed default meeting agenda templates
6. Regenerate `database.types.ts`
7. Rewrite `src/lib/types.ts` with V2 type aliases

### Testing:
```
[ ] supabase db push applies without errors
[ ] 28 tables exist with correct columns (verify in Supabase dashboard)
[ ] 16 enums have ALL correct values (including review, communication, qualified_intermediary)
[ ] team_members unchanged (3 rows: Shane, David, Chris)
[ ] 6 workflow templates seeded:
    [ ] Shared (Lead + Intake + Asset Maturity): X stages
    [ ] Tokenization (Security + Value Creation + Distribution): X stages
    [ ] Fractional Securities: X stages
    [ ] Debt Instrument: X stages
    [ ] Broker Sale: X stages
    [ ] Barter: X stages
[ ] instantiate_workflow() creates correct records for Tokenization template
[ ] evaluate_gate() returns advisory warnings (not errors)
[ ] advance_phase() ALWAYS moves asset (returns warnings, never blocks)
[ ] save_as_template() creates new template from asset
[ ] generate_asset_report() returns valid JSONB
[ ] database.types.ts regenerated, npm run build passes with zero errors
```
**Manual:** Open Supabase dashboard → verify every table → run each RPC via SQL editor

---

## Phase 2: Core Routers
**Duration:** ~3 hours
**Risk:** HIGH
**Dependencies:** Phase 1

### What to Build:
1. **assets** router — list, getById, create (with workflow instantiation), update, advancePhase (soft gate), archive, getStats
2. **stages** router — listByAsset, create, updateStatus, reorder, toggleHidden, getById
3. **tasks** router — listByAsset, listByStage, create, update, complete, reorder, toggleHidden, requestApproval, getMyTasks
4. **subtasks** router — listByTask, create, complete, update, reorder, toggleHidden
5. **Register** all in _app.ts
6. **Create Zod schemas** in src/lib/validation/ for asset, stage, task, subtask input types

### Testing:
```
[ ] assets.create creates asset + instantiates workflow (30+ stages)
[ ] assets.getById returns full hierarchy (asset → stages → tasks → subtasks)
[ ] assets.list returns assets with phase/status/value_model filters
[ ] assets.advancePhase returns warnings but ALWAYS advances
[ ] stages.listByAsset returns stages grouped by phase, respects is_hidden
[ ] stages.create adds custom stage to live asset
[ ] stages.reorder persists new sort_order
[ ] stages.toggleHidden toggles is_hidden
[ ] tasks.listByStage returns tasks, respects is_hidden
[ ] tasks.create adds task to live stage with type
[ ] tasks.complete marks done with timestamp + completed_by
[ ] tasks.reorder persists new sort_order
[ ] tasks.toggleHidden works
[ ] subtasks.listByTask returns subtasks
[ ] subtasks.create adds subtask to live task
[ ] subtasks.complete marks done with timestamp
[ ] npm run build passes
```
**API Test:** curl every endpoint with real data, verify JSON responses

---

## Phase 3: Supporting Routers
**Duration:** ~3 hours
**Risk:** MEDIUM
**Dependencies:** Phase 2

### What to Build:
1. **documents** router — listByAsset, listByTask, create (linked to task), getDownloadUrl, lock/unlock, delete, getRequiredChecklist, batchDownloadPaths
2. **comments** router — listByEntity (polymorphic), create (with @mention detection → notifications), reply, edit, delete
3. **approvals** router — listPending, listByTask, request (creates chain), decide (approve/reject + chain advance), getMyQueue
4. **notifications** router — list (paginated), markRead, markAllRead, getUnreadCount
5. **activity** router — list (new action types), listByAsset, export (CSV/JSON)

### Testing:
```
[ ] documents.create uploads file linked to task + stage + asset
[ ] documents.getRequiredChecklist returns required vs uploaded per stage
[ ] documents.batchDownloadPaths returns correct storage paths
[ ] comments.create with @david posts comment + creates notification for David
[ ] comments.reply creates threaded reply + notifies parent author
[ ] approvals.request creates pending approval + notifies approver
[ ] approvals.decide('approved') advances chain (if sequential) or completes (if final)
[ ] approvals.decide('rejected') sets task to rejected + notifies assignee
[ ] notifications.getUnreadCount returns correct number
[ ] notifications.markRead changes is_read
[ ] activity.list returns V2 action types
[ ] activity.listByAsset scopes correctly
[ ] npm run build passes
```

---

## Phase 4: Contacts, Partners, Ownership, KYC, Communications, Meetings, Templates, Reports
**Duration:** ~4 hours
**Risk:** MEDIUM
**Dependencies:** Phase 2-3

### What to Build:
1. **contacts** router — list, getById, create (individual + entity), update, linkToAsset
2. **ownership** router — getOwnershipTree, addBeneficialOwner, updateLink, removeLink
3. **kyc** router — listByContact, create, update, getExpiring, getIncomplete
4. **partners** router (enhanced) — list, getById, create, update, getOnboardingItems, createOnboardingItem, updateOnboardingItem, getCredentials, addCredential, getExpiringCredentials
5. **communications** router — create, listByContact, listByPartner, listByAsset
6. **meetings** router — list, getById, create, update, complete (with transcript + action items), convertActionItem (→ task), getAgendaTemplate, delete
7. **templates** router — list, getById, create, updateStage, addStage, removeStage, reorderStages, updateTask, addTask, removeTask, reorderTasks, updateSubtask, addSubtask, removeSubtask, reorderSubtasks, saveFromAsset, instantiateToAsset
8. **reports** router — generateAssetReport, batchDocumentDownload
9. **sops** router — list, getById, getForTask, create, update
10. **reminders** router — list, create, dismiss, snooze, delete
11. **dashboard** router — getMyDay, getPipelineFunnel, getAssetsByModel, getComplianceSummary, getRiskIndicators, getExpiringCredentials, getExpiringKYC
12. **search** router — global search across all V2 entities

### Testing:
```
[ ] contacts.create individual with KYC fields
[ ] contacts.create entity with KYB fields
[ ] ownership.addBeneficialOwner creates link
[ ] ownership.getOwnershipTree returns recursive tree
[ ] kyc.create records KYC check
[ ] kyc.getExpiring returns records expiring within 30 days
[ ] partners.getOnboardingItems returns DD items
[ ] partners.addCredential stores credential with expiry
[ ] communications.create logs a communication
[ ] meetings.create creates meeting with agenda
[ ] meetings.complete saves transcript + action items
[ ] meetings.convertActionItem creates linked task
[ ] templates.addStage adds stage to template
[ ] templates.reorderStages persists order
[ ] templates.saveFromAsset snapshots asset workflow
[ ] reports.generateAssetReport returns complete JSONB
[ ] sops.getForTask returns matching SOP
[ ] reminders.create creates reminder
[ ] dashboard.getMyDay returns personalized data
[ ] search returns results from all entity types
[ ] npm run build passes
```
**API Test:** curl every endpoint, verify responses

---

## Phase 5: Pipeline Board + Asset Detail + New Asset Wizard
**Duration:** ~4 hours
**Risk:** HIGH (most complex UI)
**Dependencies:** Phases 0-4

### What to Build:
1. **Pipeline Board** — 6 phase columns, value model filter, DnD with advisory gates, dashboard view, list view, stats ribbon
2. **Asset Detail** — 9 tabs (Overview, Workflow, Tasks, Documents, Comments, Partners, Financials, Activity, Gates)
   - Workflow tab: StageAccordion + TaskCard + SubtaskChecklist + DnD reorder + hide/unhide + "+ Add" buttons
   - Documents tab: per-task docs, required checklist, batch download
   - Comments tab: threaded comments with @mentions
   - Partners tab: linked partners with badges, "Assign Partner" button
   - Financials tab: payment tracking computed from tasks
   - Gates tab: advisory gate evaluation with "Proceed Anyway"
3. **New Asset Wizard** — 5 steps (basic → contact → asset details → value model → review)
4. **Components** (in src/components/crm/):
   - shared/: StageAccordion, TaskCard, SubtaskChecklist, CommentThread, DocumentUploadZone, ApprovalChain, OwnershipTree
   - pipeline/: PipelineKanban, PipelineList, PipelineDashboard, AssetCard
   - asset-detail/: WorkflowTab, TasksTab, DocumentsTab, CommentsTab, PartnersTab, FinancialsTab, ActivityTab, GatesTab, OverviewTab
   - modals/: CreateAssetModal, EditAssetModal, CreateTaskModal, SaveAsTemplateModal, ConfirmHideModal, GateWarningModal
5. **Update shell**: CRMSidebar (new nav items), CRMHeader (notification bell), PhaseTimeline (6 phases), CRMBottomNav (updated)

### Testing — INCLUDES MOBILE:
```
[ ] Pipeline shows 6 phase columns with correct colors
[ ] Value model filter works (5 models + All)
[ ] DnD between phases shows advisory warning dialog
[ ] "Proceed Anyway" advances phase and logs override
[ ] Dashboard view shows pipeline funnel, AUM by model, risk indicators
[ ] Asset detail hero shows value model badge, phase timeline
[ ] Workflow tab: stages grouped by phase, expandable to tasks/subtasks
[ ] Stage DnD reorder persists
[ ] Task DnD reorder persists
[ ] Hide stage: confirmation dialog → hidden from view
[ ] Unhide stage: returns to correct position
[ ] Hide task: same flow
[ ] "+ Add Stage": inline form → creates custom stage
[ ] "+ Add Task": inline form with type selector → creates task
[ ] "+ Add Subtask": inline form → creates subtask
[ ] Documents tab: upload zone, required checklist (✅/❌), batch download
[ ] Comments tab: post, reply, @mention renders as teal link
[ ] Partners tab: linked partners, "Assign Partner" button
[ ] Financials tab: costs/revenue/P&L computed from tasks
[ ] Gates tab: advisory with "Proceed Anyway"
[ ] New Asset wizard: all 5 steps → creates asset with workflow
[ ] Sidebar: all nav items correct, active state works
[ ] Header: notification bell with badge count
[ ] --- MOBILE (375px) ---
[ ] Pipeline: horizontal scroll on columns, FAB visible
[ ] Asset detail: tabs scroll horizontally, content stacks vertically
[ ] Wizard: full-screen steps on mobile
[ ] Bottom nav: all items accessible
[ ] Touch targets ≥ 44x44px on all interactive elements
[ ] No horizontal overflow on any page
[ ] --- DARK + LIGHT ---
[ ] All new components render correctly in both modes
[ ] npm run build passes
```
**Manual Test Shane:** Full walkthrough of asset creation → workflow interaction

---

## Phase 6: Remaining Pages
**Duration:** ~4 hours
**Risk:** MEDIUM
**Dependencies:** Phase 5

### What to Build:
1. **Task Dashboard** — kanban by status, list view, "My Tasks" filter, task type icons, subtask progress bars
2. **Approvals Page** — pending queue, approval cards, approve/reject with reason
3. **Document Library** — per-task association, required checklist view, batch download, version chain
4. **Templates List + Editor** — template cards, drag-reorder stages/tasks/subtasks, add/remove, inline edit
5. **Contacts Page + Detail** — directory with KYC status, detail with ownership tree, KYC panel, communications tab
6. **Partner Detail** (enhanced) — onboarding tab, credentials tab, communications tab, assignments tab
7. **Meetings Page** — list, create, detail with transcript paste, action item conversion
8. **Compliance Dashboard** — gate status, missing docs, expiring credentials, expiring KYC, risk matrix
9. **Reports Page + Asset Report** — report builder, print-optimized layout, batch download
10. **Activity Feed** — V2 action types, entity links, export
11. **Team Page** — task counts, approval counts
12. **Settings** — default template selection, notification preferences
13. **Updated Cmd+K Search** — all V2 entities
14. **Personal Dashboard ("My Day")** — My Tasks, My Approvals, Upcoming Meetings, Reminders, Expiring items

### Testing — INCLUDES MOBILE:
```
[ ] Task Dashboard: kanban + list views, "My Tasks" filter, type icons
[ ] Approvals: pending queue shows, approve/reject works, notification sent
[ ] Document Library: per-task links, required checklist, batch ZIP download
[ ] Templates list: 6 templates with stage/task counts
[ ] Templates editor: DnD reorder, inline edit, add/remove stages/tasks/subtasks
[ ] Contacts: directory with KYC badges, detail with ownership tree
[ ] Contact detail: KYC panel with check history, communications tab
[ ] Partner detail: onboarding tab with DD items, credentials tab with expiry alerts
[ ] Partner detail: communications tab, assignments tab
[ ] Meetings: create with agenda template, paste transcript, convert action item to task
[ ] Compliance: gate status per asset, missing docs, expiring items
[ ] Reports: generate for asset, print preview (Ctrl+P), batch download
[ ] Activity: V2 action types, entity links, export button
[ ] Search: finds contacts, stages, subtasks, meetings
[ ] Personal dashboard: My Tasks, My Approvals, Upcoming Meetings widgets
[ ] --- MOBILE (375px) ---
[ ] All new pages render without horizontal overflow
[ ] Touch targets adequate
[ ] Bottom nav accessible
[ ] --- DARK + LIGHT ---
[ ] All pages correct in both modes
[ ] npm run build passes
```
**Manual Test Shane:** Navigate every page, click every button, verify every feature

---

## Phase 7: Notifications, Reminders, SOPs, PWA, Polish
**Duration:** ~3 hours
**Risk:** LOW
**Dependencies:** Phase 6

### What to Build:
1. **Notification bell** — header dropdown with recent notifications, unread count badge, mark read
2. **Notification panel** — full list, click to navigate, filter by type
3. **Reminder system** — "Set Reminder" button on tasks/contacts/partners/meetings, dashboard widget
4. **SOP viewer** — "View SOP" button on TaskCard, right slide-out panel with step-by-step instructions
5. **PWA update** — manifest.ts with V2 branding, shortcuts for key pages, service worker (re-enable if possible)
6. **Empty states** — every page/list has a proper empty state with guidance
7. **Loading states** — skeleton loaders on all data-dependent components
8. **Error states** — error boundaries with retry and friendly messages
9. **Keyboard shortcuts** — N (new asset), T (new task), Cmd+K (search)

### Testing — INCLUDES MOBILE + PWA:
```
[ ] Notification bell: correct unread count, dropdown shows recent
[ ] Click notification → navigates to correct entity
[ ] Mark read → count decreases
[ ] "Set Reminder" on task → creates reminder → shows in dashboard widget
[ ] "View SOP" on task → right panel with instructions
[ ] Manifest.webmanifest loads with V2 branding
[ ] App installable as PWA (Chrome "Install" prompt)
[ ] Offline banner appears when disconnected
[ ] Empty states on ALL pages when no data (verified each page)
[ ] Loading skeletons appear during fetches
[ ] Error states show friendly messages with retry
[ ] Keyboard: N opens new asset, T opens new task, Cmd+K opens search
[ ] --- MOBILE (375px) ---
[ ] Notification dropdown works on mobile
[ ] SOP panel works on mobile (full screen instead of slide-out)
[ ] All pages still responsive after additions
[ ] PWA: add to home screen on iOS/Android simulator
[ ] --- DARK + LIGHT ---
[ ] Notification panel, SOP panel, empty/loading states all correct
[ ] npm run build passes
```

---

## Phase 8: End-to-End Lifecycle Test (Shane + Claude together)
**Duration:** ~2 hours
**Risk:** CRITICAL
**Dependencies:** ALL phases complete

### What to Test:
This is a COMPLETE walkthrough. Shane drives in the browser. Claude watches via screenshots. Every issue fixed in real-time.

1. **Create asset from zero** → wizard → Tokenization model → verify 36 stages created
2. **Add owner** → entity with 2 beneficial owners → verify KYC tasks created for each
3. **Work Lead phase** → complete all tasks → upload NDA → log meeting with transcript
4. **Work Intake phase** → fill questionnaire → complete KYC → upload docs
5. **Advance phase** with incomplete items → verify advisory warning → "Proceed Anyway"
6. **Assign partner** (create Rialto Markets → onboard → assign to asset → verify task auto-linking)
7. **Comment on a task** → @mention David → verify notification
8. **Request approval** on a task → approve it → verify chain completes
9. **Drag-reorder** stages and tasks → verify persistence
10. **Hide** a stage → verify hidden → unhide → verify restored
11. **Add custom stage** → add custom task → add custom subtask
12. **Log communication** with holder → verify in asset history
13. **Create meeting** → paste transcript → convert action item to task
14. **Set reminder** on a task → verify in dashboard widget
15. **Save workflow as template** → create new asset from it → verify identical
16. **Generate report** → verify all data → print preview
17. **Batch download documents** → verify ZIP structure
18. **Check compliance dashboard** → verify gate status, missing docs, expiring items
19. **Check personal dashboard** → My Tasks, My Approvals, Upcoming Meetings
20. **Test mobile (375px)** → every page navigable, every feature accessible

### Testing:
```
[ ] Full asset lifecycle: create → lead → intake → maturity → security → value creation → distribution
[ ] Owner + beneficial owners + KYC at every level
[ ] Partner assigned + tasks auto-linked
[ ] Documents: upload, required checklist, batch download, version
[ ] Comments: post, reply, @mention, notifications
[ ] Approvals: request, approve, reject, chain advance
[ ] Meetings: create, transcript, action items → tasks
[ ] Reminders: set, dismiss, snooze
[ ] SOPs: view on task
[ ] Template: save from asset, create from template
[ ] Report: generate, print, batch download
[ ] Activity trail: every action logged
[ ] Notifications: all trigger points generate notifications
[ ] DnD: stages, tasks reorder and persist
[ ] Hide/unhide: stages, tasks with confirmation
[ ] Custom additions: stages, tasks, subtasks on live asset
[ ] Advisory gates: warnings displayed, override works, logged
[ ] Mobile: all pages at 375px
[ ] PWA: installable, offline banner
[ ] Dark + light mode: all pages
[ ] ZERO build errors
```

---

## CONTEXT PRESERVATION PROTOCOL

After EVERY phase completion:
1. Update `specs/BUILD-LOG.md` with what was built, tested, and committed
2. Update `specs/SESSION-HANDOFF.md` with current state
3. Git commit with descriptive message
4. Git push to origin

Before EVERY phase start:
1. Read `specs/V2-ARCHITECTURE-RULES.md`
2. Read the specific phase section in THIS file
3. Read `specs/V2-BUILD-READINESS-AUDIT.md` for wiring details on that phase's features
4. Verify `npm run build` passes before writing any new code

If blocked:
1. Log the blocker in `specs/ERROR-LOG.md`
2. DO NOT work around it
3. Ask Shane if manual action is needed

---

## TOTAL EFFORT

| Phase | Duration | Risk | What |
|-------|----------|------|------|
| 0: Design System | ~30m | LOW | CSS vars, constants, NeuModal, Zod shared |
| 1: Database | ~2h | HIGH | 28 tables, 16 enums, 6 RPCs, seeds, types |
| 2: Core Routers | ~3h | HIGH | assets, stages, tasks, subtasks |
| 3: Supporting Routers | ~3h | MEDIUM | documents, comments, approvals, notifications, activity |
| 4: All Other Routers | ~4h | MEDIUM | contacts, ownership, KYC, partners, comms, meetings, templates, reports, SOPs, reminders, dashboard, search |
| 5: Pipeline + Asset Detail | ~4h | HIGH | Pipeline board, asset detail (9 tabs), wizard, shared components |
| 6: Remaining Pages | ~4h | MEDIUM | 14 pages: tasks, approvals, docs, templates editor, contacts, partners, meetings, compliance, reports, activity, team, settings, search, personal dashboard |
| 7: Notifications + PWA + Polish | ~3h | LOW | Notification system, reminders, SOPs, PWA, empty/loading/error states |
| 8: E2E Lifecycle Test | ~2h | CRITICAL | Full walkthrough with Shane |
| **Total** | **~25.5h** | — | Complete V2 CRM |
