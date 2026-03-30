# PleoChrome V2 — Phased Implementation Plan

> Date: 2026-03-30
> Methodology: Build → Test → Fix → Verify → Commit for EVERY phase
> Rule: NO phase starts until the previous phase passes ALL tests

---

## Phase 1: Database Migration & Type Generation
**Duration:** ~2 hours
**Risk:** HIGH (foundation for everything)

### 1.1 Write V2 SQL Migration
- Create all 16 enums (v2_phase, v2_value_model, v2_task_type, etc.)
- Create all 19 tables from V2-POWERHOUSE-BLUEPRINT.md
- **ADDITIONS to blueprint:**
  - Add `is_hidden BOOLEAN NOT NULL DEFAULT false` to `tasks` table
  - Add `is_hidden BOOLEAN NOT NULL DEFAULT false` to `subtasks` table
  - Add `is_hidden BOOLEAN NOT NULL DEFAULT false` to `template_tasks` table
  - Add `is_hidden BOOLEAN NOT NULL DEFAULT false` to `template_subtasks` table
- Create indexes on all FK columns and common query patterns
- Create immutable trigger for activity_log
- Create updated_at auto-trigger for all tables
- Preserve team_members table exactly as-is

### 1.2 Create RPC Functions
- `instantiate_workflow(asset_id, template_id)` — copy template stages/tasks/subtasks to asset
- `save_as_template(asset_id, name, description)` — snapshot asset workflow as template
- `evaluate_gate(asset_id, phase)` — check gate conditions, return **ADVISORY** pass/fail + warnings (does NOT block)
- `advance_phase(asset_id, target_phase)` — move asset to new phase. Calls evaluate_gate() and returns warnings but **ALWAYS allows the move** (soft gates, not hard blockers). User sees a warning dialog with incomplete items but can click "Proceed Anyway"
- `generate_asset_report(asset_id)` — return complete JSONB report
- `batch_document_paths(asset_id)` — return storage paths for ZIP download

**IMPORTANT: Gates are ADVISORY, not blocking.** The gate evaluation returns a list of incomplete stages/tasks/documents as warnings, but the user can always override and advance. The override is logged in activity_log with the user's ID and reason.

### 1.3 Seed Default Templates
- Seed 5 workflow templates (Tokenization, Fractional, Debt, Broker Sale, Barter)
- Each with stages from V2-UNIFIED-PHASE-MAPPING.md
- Each stage with tasks from V2-COMPLETE-TASK-DENSITY.md
- Each task with subtasks and document requirements

### 1.4 Drop V1 Tables
- Drop all V1 tables except team_members
- Drop V1 enums
- Clean up views that reference V1 tables

### 1.5 Regenerate Types
- Run `npx supabase gen types typescript` to regenerate database.types.ts
- Update src/lib/types.ts with V2 type aliases

### Testing — Phase 1
```
[ ] Migration applies without errors: `supabase db push`
[ ] All 19 tables exist with correct columns
[ ] All 16 enums have correct values
[ ] Team members table unchanged (3 rows)
[ ] 5 workflow templates seeded with correct stage/task/subtask counts
[ ] `instantiate_workflow()` creates correct records for each template
[ ] `evaluate_gate()` returns correct pass/fail
[ ] `advance_phase()` blocks when gate fails, advances when passes
[ ] `generate_asset_report()` returns valid JSONB
[ ] `database.types.ts` regenerated with no errors
[ ] `npm run build` passes with zero errors
```
**Manual Test:** Open Supabase dashboard, verify tables, run each RPC function manually

---

## Phase 2: Core Routers (Assets, Stages, Tasks, Subtasks)
**Duration:** ~3 hours
**Risk:** HIGH (API layer for all pages)
**Depends on:** Phase 1 complete

### 2.1 Rewrite Assets Router
- `list` — query assets with new phase/status/value_model filters
- `getById` — full asset with stages, tasks, subtasks, documents, comments, contacts
- `create` — create asset + auto-instantiate workflow from template
- `update` — update asset metadata
- `advancePhase` — call advance_phase() RPC
- `archive` — soft delete
- `getStats` — dashboard stats with new phases

### 2.2 Create Stages Router
- `listByAsset` — stages for an asset grouped by phase
- `updateStatus` — start/complete/skip a stage
- `reorder` — change sort_order (drag-drop)
- `hide/unhide` — toggle is_hidden with confirmation
- `getById` — stage with all tasks

### 2.3 Rewrite Tasks Router
- `listByAsset` — all tasks for an asset
- `listByStage` — tasks for a specific stage
- `create` — create task on a LIVE ASSET stage (+ button on workflow tab)
- `update` — update task details (title, description, type, assignee, due date)
- `complete` — mark done (check approval requirements first)
- `requestApproval` — trigger approval chain
- `getMyTasks` — tasks assigned to current user across all assets
- **`reorder`** — batch update sort_order for tasks within a stage (drag-and-drop)
- **`toggleHidden`** — hide/unhide a task on a live asset (with confirmation dialog)

### 2.4 Create Subtasks Router
- `listByTask` — subtasks for a task
- `create` — add subtask to a task on a LIVE ASSET (+ button under any task)
- `complete` — mark subtask done (log timestamp, team member)
- `update` — update subtask details
- **`reorder`** — batch update sort_order for subtasks within a task (drag-and-drop)
- **`toggleHidden`** — hide/unhide a subtask

### Testing — Phase 2
```
[ ] assets.list returns empty array (no assets yet)
[ ] assets.create creates asset + instantiates 30+ stages from template
[ ] assets.getById returns asset with stages, tasks, subtasks
[ ] stages.listByAsset returns stages grouped by phase
[ ] stages.updateStatus changes status with timestamps
[ ] stages.reorder changes sort_order correctly
[ ] stages.hide sets is_hidden=true
[ ] tasks.listByStage returns tasks for a stage
[ ] tasks.create adds task to a stage
[ ] tasks.complete marks task done
[ ] subtasks.listByTask returns subtasks
[ ] subtasks.complete marks subtask done with timestamp
[ ] npm run build passes
```
**Manual Test:** Use curl or tRPC playground to create an asset and verify the full hierarchy is created

---

## Phase 3: Supporting Routers (Documents, Comments, Approvals, Notifications)
**Duration:** ~3 hours
**Risk:** MEDIUM
**Depends on:** Phase 2 complete

### 3.1 Rewrite Documents Router
- `listByAsset` — all documents for an asset
- `listByTask` — documents for a specific task
- `create` — upload document linked to task/stage/asset
- `getDownloadUrl` — signed URL generation
- `lock/unlock` — document locking
- `delete` — soft delete with storage cleanup
- `getRequiredChecklist` — required vs uploaded per stage
- `batchDownloadPaths` — call RPC for ZIP

### 3.2 Create Comments Router
- `listByEntity` — comments for task/subtask/asset (polymorphic)
- `create` — post comment with @mention detection
- `reply` — reply to a comment (parent_comment_id)
- `edit` — edit own comment
- `delete` — soft delete (preserve thread)

### 3.3 Create Approvals Router
- `listPending` — pending approvals for current user
- `listByTask` — approval chain for a task
- `request` — create approval request
- `decide` — approve/reject with reason
- `getMyQueue` — all pending approvals across all assets

### 3.4 Create Notifications Router
- `list` — notifications for current user (paginated)
- `markRead` — mark single notification read
- `markAllRead` — mark all read
- `getUnreadCount` — badge count for header

### 3.5 Rewrite Activity Router
- `list` — new audit action types, entity linking
- `listByAsset` — scoped to asset
- `export` — CSV/JSON export

### Testing — Phase 3
```
[ ] documents.create uploads file linked to task
[ ] documents.listByTask returns correct documents
[ ] documents.getRequiredChecklist shows required vs uploaded
[ ] comments.create posts comment with timestamp
[ ] comments.reply creates threaded reply
[ ] comments.create with @mention generates notification
[ ] approvals.request creates pending approval
[ ] approvals.decide records decision with timestamp
[ ] approvals.listPending returns only current user's approvals
[ ] notifications.list returns notifications
[ ] notifications.getUnreadCount returns correct count
[ ] activity.list returns new action types
[ ] npm run build passes
```
**Manual Test:** Create asset → upload document to a task → post comment → request approval → decide approval → verify notifications generated

---

## Phase 4: Templates & Contacts Routers
**Duration:** ~2 hours
**Risk:** MEDIUM
**Depends on:** Phase 2 complete

### 4.1 Create Templates Router
- `list` — all templates with stage/task counts
- `getById` — full template with stages/tasks/subtasks
- `create` — create blank template for a value model
- `updateStage` — edit stage in template
- `addStage/removeStage` — add/remove stages
- `updateTask` — edit task in template
- `addTask/removeTask` — add/remove tasks
- `updateSubtask` — edit subtask in template
- `addSubtask/removeSubtask` — add/remove subtasks
- `reorderStages` — change sort_order
- `saveFromAsset` — snapshot asset workflow as new template
- `instantiateToAsset` — apply template to asset

### 4.2 Create Contacts Router
- `list` — all contacts with KYC/OFAC status
- `getById` — contact detail with linked assets
- `create` — create contact
- `update` — update contact info + compliance fields
- `linkToAsset` — link contact to asset with role

### 4.3 Rewrite Partners Router
- Add new partner types
- Module linking for template tasks

### 4.4 Create Reports Router
- `generateAssetReport` — call RPC, format as structured JSON
- `getAssetReportPDF` — generate printable HTML report
- `batchDocumentDownload` — get signed URLs for all asset documents

### Testing — Phase 4
```
[ ] templates.list returns 5 seeded templates
[ ] templates.getById returns full template tree
[ ] templates.updateStage modifies a stage
[ ] templates.addTask adds task to a stage
[ ] templates.reorderStages changes order
[ ] templates.saveFromAsset creates new template from asset workflow
[ ] contacts.create creates contact with compliance fields
[ ] contacts.linkToAsset creates association
[ ] reports.generateAssetReport returns complete JSONB
[ ] npm run build passes
```
**Manual Test:** Edit a template → create asset from modified template → verify changes applied

---

## Phase 5: Pipeline Board & Asset Detail Pages
**Duration:** ~4 hours
**Risk:** HIGH (most complex UI)
**Depends on:** Phases 2-4 complete

### 5.1 Rewrite Pipeline Board (page.tsx)
- 6 new phase columns (Lead, Intake, Asset Maturity, Security, Value Creation, Distribution)
- Value model filter (Tokenization, Fractional, Debt, Broker Sale, Barter)
- Dashboard view with new data
- DnD with gate validation
- Updated stats ribbon

### 5.2 Rewrite Asset Detail (assets/[id]/page.tsx)
- New hero with value model badge
- New phase timeline (6 phases)
- **Workflow tab** — Phase-grouped stages, expandable to tasks/subtasks/progress
  - **Drag-and-drop reorder** stages within a phase
  - **Drag-and-drop reorder** tasks within a stage
  - **Hide/unhide** any stage or task (confirmation dialog: "Are you sure you want to hide this? It will be removed as a requirement but can be unhidden later.")
  - **"+ Add Stage" button** at bottom of each phase section → creates custom stage
  - **"+ Add Task" button** at bottom of each stage → creates custom task with type selector
  - **"+ Add Subtask" button** at bottom of each task → creates custom subtask
  - All custom additions are saved per-asset (not affecting templates)
- **Tasks tab** — Flat task list with type icons, assignees, subtask progress
- **Documents tab** — Per-task documents, required checklist, batch download
- **Comments tab** — Threaded comments for the asset
- **Partners tab** — Linked partners with role context
- **Financials tab** — Payment tracking (costs/income), per-phase breakdown
- **Activity tab** — Audit trail scoped to asset
- **Gates tab** — Gate milestones with **ADVISORY** status (warnings, not blockers). Shows incomplete items with "Proceed Anyway" option.

### 5.3 Rewrite New Asset Wizard (assets/new/page.tsx)
- Step 1: Basic info (name, type, holder entity)
- Step 2: Contact info (holder name, email, phone, address)
- Step 3: Asset details (provenance, origin, certifications, value estimate)
- Step 4: Value model selection (with description of each)
- Step 5: Review & create (auto-instantiates workflow from template)

### 5.4 Update Components
- Rewrite PhaseTimeline for 6 phases
- Rewrite AssetCard for new data model
- Rewrite CRMSidebar with new nav items
- Rewrite CRMHeader with notification bell
- Create StageAccordion, TaskCard, SubtaskChecklist, CommentThread

### Testing — Phase 5
```
[ ] Pipeline shows 6 phase columns
[ ] Value model filter works
[ ] Dashboard view shows real data
[ ] DnD between phases triggers gate check
[ ] Asset detail shows all 9 tabs
[ ] Workflow tab shows stages grouped by phase
[ ] Clicking a stage expands to show tasks
[ ] Clicking a task shows subtasks
[ ] **Drag-and-drop reorder stages within a phase works**
[ ] **Drag-and-drop reorder tasks within a stage works**
[ ] **Hide stage shows confirmation dialog, then hides it**
[ ] **Unhide stage brings it back**
[ ] **Hide task shows confirmation dialog, then hides it**
[ ] **"+ Add Stage" button creates custom stage in a phase**
[ ] **"+ Add Task" button creates custom task in a stage with type selector**
[ ] **"+ Add Subtask" button creates custom subtask in a task**
[ ] Tasks tab shows flat list with filters
[ ] Documents tab shows per-task documents
[ ] Comments tab shows threaded comments
[ ] New Asset wizard creates asset with full workflow
[ ] **Gate evaluation shows ADVISORY warnings (not hard blockers)**
[ ] **User can "Proceed Anyway" past incomplete gates**
[ ] **Gate override logged in activity log**
[ ] All pages render at 375px (mobile) and 1440px (desktop)
[ ] Dark mode works on all new components
[ ] npm run build passes
```
**Manual Test Shane:**
- Create a new asset through the wizard
- Verify all stages appear in the Workflow tab
- **Drag a stage to reorder it → verify new order persists**
- **Hide a stage (e.g., vault transfer if stone already in vault) → confirm dialog → verify hidden**
- **Unhide it → verify it returns**
- **Click "+" to add a custom task to a stage → name it, select type → verify it appears**
- Click through each stage → verify tasks and subtasks
- Try to advance phase → **verify warning dialog (not blocker) with incomplete items**
- **Click "Proceed Anyway" → verify phase advances and override is logged**
- Switch between kanban/list/dashboard views
- **At the end, save the workflow as a new template → verify it appears in Templates page**

---

## Phase 6: Remaining Pages
**Duration:** ~3 hours
**Risk:** MEDIUM
**Depends on:** Phase 5 complete

### 6.1 Task Dashboard (tasks/page.tsx)
- Kanban by status (todo, in_progress, blocked, pending_approval, done)
- List view with sortable columns
- "My Tasks" filter
- Task type icons
- Subtask progress bars

### 6.2 Approvals Page (NEW — approvals/page.tsx)
- Pending approvals for current user
- Approval cards with context (task, asset, requester)
- Approve/reject with reason

### 6.3 Document Library (documents/page.tsx)
- Per-task association visible
- Required doc checklist view
- Batch download button
- Version chain display

### 6.4 Templates Editor (NEW — templates/[id]/page.tsx)
- Stage list grouped by phase
- Drag-reorder stages
- Inline edit stage/task/subtask
- Add/remove stages/tasks/subtasks
- Preview mode

### 6.5 Contacts Page (NEW — contacts/page.tsx + contacts/[id]/page.tsx)
- Contact directory with KYC/OFAC status
- Contact detail with linked assets

### 6.6 Reports Page (NEW — reports/page.tsx + reports/[assetId]/page.tsx)
- Asset report generation
- Print-optimized layout
- Batch document download

### 6.7 Compliance Dashboard (compliance/page.tsx)
- Gate status across all assets
- Missing documents
- Expiring documents
- Risk matrix

### 6.8 Updated Search (CommandPalette)
- Search stages, contacts, subtasks
- Recent searches

### Testing — Phase 6
```
[ ] Task Dashboard shows tasks with type icons
[ ] My Tasks filter shows only current user's tasks
[ ] Approvals page shows pending approvals
[ ] Approve/reject works with notification
[ ] Document Library shows per-task associations
[ ] Batch download works (JSZip)
[ ] Templates editor loads template with full tree
[ ] Drag-reorder stages works
[ ] Adding a task to a template stage works
[ ] Contacts page shows contact directory
[ ] Contact detail shows KYC status + linked assets
[ ] Reports page generates asset report
[ ] Report is printable (Ctrl+P)
[ ] Compliance dashboard shows gate status
[ ] Search finds stages, contacts, subtasks
[ ] npm run build passes
```
**Manual Test Shane:**
- Go to Task Dashboard → filter "My Tasks" → complete a task
- Go to Approvals → approve a pending item
- Go to Templates → edit a stage → add a task → save
- Create new asset using modified template → verify changes
- Go to Reports → generate report for an asset → print preview

---

## Phase 7: Notifications, Search, & Polish
**Duration:** ~2 hours
**Risk:** LOW
**Depends on:** Phase 6 complete

### 7.1 Notification System
- Notification bell in header with unread count
- Dropdown panel with recent notifications
- Click notification → navigate to relevant entity
- Mark read/all read

### 7.2 Full Search Update
- Cmd+K searches all V2 entities
- Recent searches saved
- Keyboard navigation

### 7.3 Mobile Responsive Pass
- Test all new pages at 375px, 768px, 1440px
- Fix any overflow, touch target, or layout issues
- Update bottom nav for new pages

### 7.4 Empty States
- Every page/list has a proper empty state
- Guidance text for first-time setup

### 7.5 Loading & Error States
- Skeleton loaders on all data-dependent components
- Error boundaries with retry

### Testing — Phase 7
```
[ ] Notification bell shows correct unread count
[ ] Clicking notification navigates to correct entity
[ ] Cmd+K search finds all entity types
[ ] All pages responsive at 375px, 768px, 1440px
[ ] No horizontal scroll on any viewport
[ ] All touch targets ≥ 44x44px on mobile
[ ] Empty states show on all pages when no data
[ ] Loading skeletons appear during data fetches
[ ] Error states show friendly messages
[ ] npm run build passes
```
**Manual Test Shane:**
- Post a comment with @mention → check notification appears
- Complete a task → check notification to asset lead
- Request approval → check notification to approver
- Test on phone (375px) — swipe through all pages

---

## Phase 8: End-to-End Lifecycle Test
**Duration:** ~2 hours
**Risk:** CRITICAL (validates everything)
**Depends on:** ALL phases complete

### 8.1 Create Asset from Zero
1. Click "New Asset" → fill wizard with real data
2. Select "Tokenization" value model
3. Verify 36 stages created across 6 phases
4. Verify all tasks and subtasks under each stage

### 8.2 Work Through Lead Phase
1. Start stage 1.1 → complete all tasks
2. Upload NDA → verify document appears
3. Complete KYC screening → verify subtask logged
4. Run deal committee vote → verify approval chain
5. Pass Gate G1 → verify phase advances to Intake

### 8.3 Work Through Intake Phase
1. Fill intake questionnaire
2. Upload all required documents
3. Complete all tasks
4. Pass Gate G2 → advance to Asset Maturity

### 8.4 Test All Interactive Features
1. Drag-reorder a stage within a phase → verify persists after refresh
2. Drag-reorder a task within a stage → verify persists
3. Hide a stage (e.g., vault transfer) → confirm dialog → verify hidden from view
4. Unhide it → verify it comes back in correct position
5. Hide a task → confirm dialog → verify hidden
6. Click "+ Add Stage" at bottom of a phase → create custom stage
7. Click "+ Add Task" at bottom of a stage → select type → create custom task
8. Click "+ Add Subtask" → create custom subtask
9. Post a comment on a task
10. Reply to a comment
11. Request approval on a task
12. Approve/reject the request
13. Upload a document to a task (drag-drop)
14. Advance phase with incomplete items → verify ADVISORY warning dialog
15. Click "Proceed Anyway" → verify phase advances, override logged
16. Save current workflow as template → verify appears in Templates list
17. Create NEW asset from saved template → verify custom stages/tasks carried over

### 8.5 Generate Report
1. Go to Reports → select asset
2. Generate full project report
3. Verify all phases/stages/tasks/subtasks/comments/documents included
4. Print preview → verify layout
5. Batch download all documents

### Testing — Phase 8
```
[ ] Asset created with full workflow (36 stages for tokenization)
[ ] Lead phase: all 4 stages completable
[ ] Gate G1 blocks advancement when tasks incomplete
[ ] Gate G1 passes when all tasks complete
[ ] Intake phase: all 6 stages completable
[ ] Documents upload and appear in correct task
[ ] Comments post with timestamps
[ ] Approvals chain works (request → decide)
[ ] Notifications generated for all actions
[ ] Stage reorder persists
[ ] Stage hide/unhide works
[ ] Save as template creates new template
[ ] New asset from saved template has correct stages
[ ] Report includes all data
[ ] Batch download works
[ ] Activity log shows complete audit trail
[ ] ZERO build errors
```
**Manual Test Shane:** This entire phase should be done by Shane in the browser, clicking through every feature, with me watching via screenshots and fixing issues in real-time.

---

## TOTAL ESTIMATED EFFORT

| Phase | Duration | Risk |
|-------|----------|------|
| 1: Database Migration | ~2h | HIGH |
| 2: Core Routers | ~3h | HIGH |
| 3: Supporting Routers | ~3h | MEDIUM |
| 4: Templates & Contacts | ~2h | MEDIUM |
| 5: Pipeline & Asset Detail | ~4h | HIGH |
| 6: Remaining Pages | ~3h | MEDIUM |
| 7: Notifications & Polish | ~2h | LOW |
| 8: E2E Lifecycle Test | ~2h | CRITICAL |
| **Total** | **~21h** | — |
