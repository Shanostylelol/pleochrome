# E2E Test Findings — March 30, 2026

## Test Session Summary

### What Was Tested
- Pipeline Board: page load, stats, value model filters, view toggles, asset cards
- Dark mode toggle: full page switch works
- Cmd+K search: cross-entity search (assets, contacts, meetings)
- New Asset creation: Quick Add modal, form fill, Tokenization value model
- Asset detail page: hero, breadcrumb, tabs, Overview tab content
- Workflow tab: stage rendering, progress bars, search/filter bar
- Workflow instantiation: 35 stages, 92 tasks for Tokenization template

### Bugs Found & Fixed During Testing

| # | Bug | Severity | Status | Fix |
|---|-----|----------|--------|-----|
| 1 | **Workflow instantiation broken** — `instantiate_from_template()` referenced `gate_criteria` column that doesn't exist on `asset_stages` table | CRITICAL | FIXED | Migration `20260330600002_fix_instantiation_function.sql` — removed `gate_criteria` from INSERT |
| 2 | **Nested `<button>` hydration error** — Stage header was `<button>` containing NeuButton `<button>` | HIGH | FIXED (earlier) | Changed to `<div role="button">` |
| 3 | **Cancelled subtasks visible** — `getById` didn't filter `is_hidden` | HIGH | FIXED (earlier) | Added `.eq('is_hidden', false)` to subtasks/tasks/stages queries |
| 4 | **Assignee dropdown showing "Unassigned" after selection** | MEDIUM | FIXED (earlier) | Added `assigned_to` to Task interface + data pipeline |
| 5 | **Subtask completion calling task complete** | HIGH | FIXED (earlier) | Added separate `onCompleteSubtask` callback chain |

### Issues Found But NOT Yet Fixed

| # | Issue | Severity | Description |
|---|-------|----------|-------------|
| 1 | **Quick Add modal says "Value Path" not "Value Model"** | LOW | UI label mismatch with architecture terminology |
| 2 | **No description field in Quick Add modal** | LOW | Would be useful for initial notes |
| 3 | **No currency formatting on estimated value input** | LOW | Raw number field, should show $X,XXX,XXX |
| 4 | **Overview tab metadata fields not editable inline** | MEDIUM | Origin, Carat Weight, GIA Report, Vault Provider, SPV Name — all show dashes but no way to edit without opening Edit modal |
| 5 | **"Undecided" value model creates asset with no workflow** | MEDIUM | If user selects Undecided, no template instantiation occurs and the Workflow tab is empty. Should either warn or block |
| 6 | **Task count shows 0/3, 0/4 etc. but subtask counts not shown** | LOW | Stage header shows task completion but not subtask completion |

### Features Verified Working
- [x] Pipeline Board loads with 6 phase columns and stats
- [x] Value model filter tabs (All, Fractional, Tokenization, Debt, Broker, Barter)
- [x] View toggle (Dashboard/Kanban/List icons)
- [x] Dark mode toggle works across entire page
- [x] Cmd+K search returns assets, contacts, meetings
- [x] New Asset creation via Quick Add modal
- [x] Asset detail page with all 10 tabs
- [x] Workflow tab with 35 stages, 92 tasks (after fix)
- [x] Progress bars on stage headers
- [x] Search bar and status filters on Workflow tab
- [x] Stage Start/Complete buttons fire correctly
- [x] Task Start/Complete buttons fire correctly
- [x] Task delete from ... menu works
- [x] Subtask checkbox completion works
- [x] Subtask status cycling (TO DO → IN PROGRESS → DONE)
- [x] Per-task assignment dropdown (3 team members)
- [x] Per-task Files section (collapsible)
- [x] Per-task Comments section (collapsible, post works, @mention highlighting)
- [x] Zero console errors on all tested pages

### Features NOT YET Tested (Remaining from Checklist)
- [ ] Subtask inline title editing (double-click)
- [ ] Subtask type selector (click type dot)
- [ ] Subtask notes (expand textarea)
- [ ] Subtask DnD reorder
- [ ] Add Subtask with type
- [ ] Task DnD reorder (visual persistence)
- [ ] Stage DnD reorder (visual persistence)
- [ ] Task inline title editing (double-click)
- [ ] Task type badge change
- [ ] Set Reminder form
- [ ] File upload (now that bucket exists)
- [ ] File download/delete
- [ ] Comment reply threading
- [ ] Comment edit/delete (own comments)
- [ ] Edit Asset modal
- [ ] Advance Phase (with gate warning)
- [ ] Save Template
- [ ] Export JSON
- [ ] Documents tab
- [ ] Activity tab
- [ ] Gates tab
- [ ] Financials tab
- [ ] Partners tab
- [ ] Meetings tab
- [ ] Tasks page (/crm/tasks)
- [ ] Contacts page (/crm/contacts)
- [ ] Partners page (/crm/partners)
- [ ] Meetings page (/crm/meetings)
- [ ] Templates page (/crm/templates)
- [ ] Approvals page (/crm/approvals)
- [ ] Mobile 375px viewport
- [ ] Dark mode on all pages
