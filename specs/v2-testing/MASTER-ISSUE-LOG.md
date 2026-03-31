# Master Issue Log — PleoChrome CRM V2

**Date:** 2026-03-30
**Status:** Post-build E2E audit complete

---

## TIER 1: BREAKING / CRITICAL (Fix immediately)

| # | Issue | File(s) | What's Wrong |
|---|-------|---------|-------------|
| 1 | **Nested `<button>` in subtask type dropdown** | SubtaskChecklist.tsx L113-145 | Type dot `<button>` contains child `<button>` dropdown items. Causes hydration errors in production. Fix: change to `<div role="button">` |
| 2 | **DocumentUploadZone still fake** | DocumentUploadZone.tsx L79-97 | Comment says "actual Supabase Storage upload wired later". Returns `url: ''`. Used on Documents tab. TaskFileList does real uploads but this component doesn't. |
| 3 | **DnD has no visual drag preview** | SortableStageWrapper.tsx, SortableTaskItem.tsx | No `DragOverlay` component — dragged items just fade to 50% opacity. Users can't tell they're dragging. Pipeline kanban DOES use DragOverlay correctly. |
| 4 | **No onError handlers on any mutation** | useWorkflowMutations.ts (all 16 mutations) | If a task complete/delete/reorder fails, user sees nothing. Optimistic updates aren't reverted. Silent data corruption risk. |
| 5 | **"Maximum update depth exceeded"** | Compliance page or useWorkflowMutations | Render loop detected during testing. Need to identify exact source — may be useCallback dependency issue or stale closure. |

## TIER 2: ORPHANED / DISCONNECTED FEATURES

| # | Issue | File(s) | What's Wrong |
|---|-------|---------|-------------|
| 6 | **New Asset Wizard is unreachable** | src/app/crm/assets/new/page.tsx | Full 4-step wizard exists (Basic Info → Value Path → Valuation → Review) but NO link from anywhere. Users can only find it by typing /crm/assets/new manually. |
| 7 | **CommunicationsTab not registered** | CommunicationsTab.tsx + assets/[id]/page.tsx | Component built and imported but NOT in TABS array and NOT rendered. Completely disconnected. |
| 8 | **Quick Add says "Value Path" not "Value Model"** | src/app/crm/page.tsx L675 | Inconsistent with V2 architecture terminology. Should be "Value Model". |

## TIER 3: INCOMPLETE UX / MISSING FEATURES

| # | Issue | File(s) | What's Wrong |
|---|-------|---------|-------------|
| 9 | **Overview metadata fields not editable** | OverviewTab.tsx | Origin, Carat Weight, GIA Report, Vault Provider, SPV Name, SPV EIN — all read-only. EditAssetModal doesn't expose these fields either. No path to update them. |
| 10 | **Quick Add has no Description field** | src/app/crm/page.tsx L634-693 | EditAssetModal supports description but Quick Add doesn't. |
| 11 | **No currency formatting on Estimated Value** | src/app/crm/page.tsx L684 | Raw number input — no $ prefix, no commas, no formatting on blur. |
| 12 | **Activity badges mostly gray** | ActivityTab.tsx L13-20 | Color map only covers 6 action types. Most activity entries default to gray. Missing: stage, document, subtask, comment, approval action colors. |
| 13 | **Empty stages show during status filter** | WorkflowTab.tsx L154-232 | When user filters by "Active", stages with 0 matching tasks still render as empty cards. Should hide or indicate "0 matches". |
| 14 | **No loading skeletons** | Asset detail, WorkflowTab | NeuSkeleton component exists but unused. Pages show "Loading..." text instead of skeleton UI. |

## TIER 4: MOBILE / ACCESSIBILITY / POLISH

| # | Issue | File(s) | What's Wrong |
|---|-------|---------|-------------|
| 15 | **DnD has no keyboard alternative** | SortableTaskItem, SortableStageWrapper, SubtaskChecklist | @dnd-kit pointer events only. No keyboard reorder support. |
| 16 | **Menu button undersized (12x12px)** | TaskCard.tsx L229-231 | `p-1` padding + 4x4 icon = ~12px. Should be 44px minimum for mobile. |
| 17 | **Drag handles undersized** | SubtaskChecklist (16px), SortableTaskItem (20px) | Below 44px touch target. Hard to grab on mobile. |
| 18 | **Menu dropdowns can go off-screen** | TaskCardDetails, SubtaskChecklist | Absolute positioning with `left-0 top-7` — no viewport boundary checking. |
| 19 | **No aria-labels on icon-only buttons** | TaskCard menu button, DnD handles | Screen readers can't identify these buttons. |
| 20 | **Search bar min-width too large for small phones** | WorkflowTab.tsx L140 | `min-w-[180px]` breaks on 320px viewports. |

## TIER 5: THINGS THAT SHOULD EXIST BUT DON'T

| # | Feature | Why It Matters |
|---|---------|---------------|
| 21 | **Notification when task is assigned** | User assigns task to David — David should get a notification. Router supports it but UI doesn't trigger it. |
| 22 | **Bulk task operations** | Select multiple tasks → batch complete/assign/delete. No UI for this. |
| 23 | **Task dependencies** | "Task B blocked until Task A done." No `task_dependencies` table or UI. |
| 24 | **Recurring tasks** | Compliance tasks recur quarterly. No recurrence system. |
| 25 | **Pipeline velocity tracking** | How long does each asset spend in each phase? No `entered_at` timestamp. |
| 26 | **Team workload dashboard** | Who has the most tasks? No view grouped by assignee. |
| 27 | **Per-task activity audit trail** | Activity log captures task events but no per-task activity view. |
| 28 | **Calendar/email integration** | Meetings should sync with Google Calendar. Emails should auto-log. Future OAuth scope. |
| 29 | **Client/holder portal** | Read-only view for asset holders. |
| 30 | **PDF/CSV export from workflow** | Export task lists, compliance reports. Only JSON export exists. |

---

## WHAT'S CONFIRMED WORKING

| Feature | Status |
|---------|--------|
| Pipeline Board (stats, filters, kanban, list) | ✅ |
| Asset Creation (Quick Add) | ✅ |
| Workflow Instantiation (35 stages, 92 tasks) | ✅ (after fix) |
| Stage Start/Complete buttons | ✅ |
| Task Start/Complete/Delete | ✅ |
| Subtask checkbox completion | ✅ |
| Subtask status cycling | ✅ |
| Subtask inline title editing | ✅ |
| Subtask type selector (13 types) | ✅ |
| Subtask type dots with colors | ✅ |
| Add Subtask with type | ✅ |
| Per-task Files section (UI) | ✅ |
| Per-task Comments (post + @mention) | ✅ |
| Task assignment dropdown | ✅ |
| Progress bars on stages | ✅ |
| Search/filter in workflow | ✅ |
| Cmd+K global search | ✅ |
| Dark mode toggle | ✅ |
| All 13 sidebar nav links | ✅ |
| Contacts CRUD | ✅ |
| Partners CRUD + assignment | ✅ |
| Meetings CRUD + action items + convert to task | ✅ |
| Templates (7 templates, editor) | ✅ |
| Activity feed (959 entries, filters, export) | ✅ |
| Compliance dashboard (stats, tables) | ✅ |
| Gates tab | ✅ |
| Financials tab | ✅ |
| Owner linking (AddOwnerModal) | ✅ |
| Supabase Storage bucket created | ✅ |
| Subtask types in DB (7 new enum values) | ✅ |
| getCurrentUser tRPC procedure | ✅ |
| Comment currentUserId wired | ✅ |
