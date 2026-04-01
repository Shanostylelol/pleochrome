# Session Handoff — PleoChrome Powerhouse CRM V2

**Last Updated:** 2026-04-01 (Sessions 6-7 final)
**Purpose:** Read this FIRST on any machine. Tells you exactly where to pick up.

---

## QUICK START

```bash
cd ~/Projects/pleochrome
git pull && npm install
npx supabase start
npx supabase db push   # Apply: add_target_completion_date migration
npm run dev            # :3000
```

---

## CURRENT STATE — FULL PRODUCTION CRM

All planned phases complete + extensive quality improvements across 7 sessions.

### Session 7 Changes

**New features:**
- WorkflowTab: "Apply Template" button → modal picker using `templates.instantiateToAsset`
- WorkflowTab: Empty state CTA when no stages ("Apply Template" prominent)
- Pipeline filter bar: inline search input to filter assets by name/reference
- Pipeline board: "Archived" toggle (lg: desktop only) via `includeArchived` flag
- partners router: `listAssetsInput.includeArchived` field
- approvals router: `getPendingCount` procedure → sidebar badge
- CRMSidebar: Approvals count badge alongside Reminders badge

**Filter/sort improvements:**
- Assets list table: clickable sortable headers (Ref/Name/Phase/Value/Status)
- Contacts table: sortable Name/Type/KYC columns
- Documents table: sortable Title/Type/Date/Size columns (default: Date desc)
- Partners page: DD status filter dropdown (All/Not Started/In Progress/Passed/Failed)
- Meetings page: type + date range filters wired to meetings router

**Data quality:**
- `getComplianceSummary`: N+1 → batch fetch (1 query instead of N+1)
- `getRiskIndicators`: blocked tasks check added; risk items are now clickable links
- meetings router: added meetingType, dateFrom, dateTo filter params

**UX improvements:**
- Set Reminder: available on contact detail + partner detail (was only on asset)
- Dashboard My Day tasks: show asset name as secondary line
- Pipeline cards: "X overdue" ruby indicator when tasks are past due
- listForPipeline: computes `overdueCount` per asset
- Approvals: task title links to `/crm/assets/{id}?tab=tasks`

### All Features (Sessions 1-7)

Everything in the plan (Phases 0-F4) plus:
- Full reminders system (create/view/dismiss/snooze from anywhere)
- Partner Comms tab + Log Communication modal
- RecentCommsWidget on asset OverviewTab
- Calendar view for meetings (with task due dates)
- Keyboard nav in CommandPalette
- Pipeline velocity widget on dashboard
- Saved pipeline state (localStorage)
- Apply Template in WorkflowTab
- Sortable tables on assets/contacts/documents/partners
- Documents batch ZIP download
- All CSV exports on every list page

### What's Genuinely Remaining

| Item | Notes |
|------|-------|
| Email digests | Requires Resend setup |
| Push notifications | Requires service worker API |
| Investor portal | Deferred — FEATURE-PIPELINE.md |
| Pagination for large datasets | 50/100 limits fine for current team size |
| Chrome extension verification | Full E2E test with real data |

---

## ARCHITECTURE NOTES

- **Stack**: Next.js 16 + React 19 + TypeScript + Tailwind v4 + Supabase + tRPC + motion v12
- **tRPC routers**: 25 routers in `src/server/routers/`
- **localStorage keys**: `plc-pipeline-filter`, `plc-pipeline-view`, `pleochrome-notifs`, `plc-notif-*`
- **useSearchParams** → wrapped in `<Suspense>` (pipeline page)
- **motion** → import from `motion/react`
- **New DB fields** → `(asset as Record<string, unknown>).field` pattern until gen types re-run
- **N+1 fixed**: compliance summary now batches stage queries
- **approvals.getPendingCount** → new lightweight count query for sidebar badge

---

## FEATURE PIPELINE (deferred)

See `specs/FEATURE-PIPELINE.md`:
- Investor/stakeholder portal
- Audit certification PDF
- Batch pipeline operations
- Partner auto-task creation
- Partner performance metrics
