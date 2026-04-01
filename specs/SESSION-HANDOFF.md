# Session Handoff — PleoChrome Powerhouse CRM V2

**Last Updated:** 2026-04-01 (Session 5 final)
**Purpose:** Read this FIRST on any machine. Tells you exactly where to pick up.

---

## QUICK START (new machine or new session)

```bash
cd ~/Projects/pleochrome
git pull
npm install
npx supabase start
npx supabase db push                 # Apply migration: add_target_completion_date
npm run dev                          # :3000
```

Then open: http://localhost:3000/crm

---

## CURRENT STATE — ALL PLANNED PHASES COMPLETE

### What's DONE (Phases 0-8 + A-F4)

| Phase | Feature | Status |
|-------|---------|--------|
| 0 | ErrorBoundary, modal fix, sidebar responsive, breakpoints | ✅ |
| 1 | NeuConfirmDialog on all destructive actions | ✅ |
| 2 | CSS consistency (--text-on-accent, Neu* components) | ✅ |
| 3 | CompactWorkflowView + TaskDetailDrawer + toggle | ✅ |
| 4 | Loading skeletons across 19 files | ✅ |
| 5 | CurrentUserProvider, dynamic user everywhere | ✅ |
| 6 | Mobile polish (bottom nav, MoreSheet, landscape) | ✅ |
| 7 | Quick Add form validation with inline errors | ✅ |
| 8 | Dashboard page with 6 real-data widgets | ✅ |
| A1 | Pipeline page refactored 709→327 lines | ✅ |
| A2 | Pipeline cards: progress bars + "Next: [task]" | ✅ |
| A3 | Pipeline card quick actions (Advance, Archive) | ✅ |
| A4 | Archive flow (hidden from pipeline by default) | ✅ |
| B1 | Actionable Dashboard (clickable tasks/approvals/reminders) | ✅ |
| B2 | Enhanced Search (prefix filters: overdue:, blocked:, phase:) | ✅ |
| B2 | CommandPalette quick filter chips + keyboard navigation (↑↓↵) | ✅ |
| C1 | Asset target dates/SLA — DB migration + UI + pipeline card | ✅ |
| C2 | Enforced phase gating (pre-check + override reason) | ✅ |
| C3 | Financial projections (cost-to-complete, revenue projection) | ✅ |
| D | Comms unification (subtask calls → communication_log) | ✅ |
| E1 | Asset duplication — mutation + Duplicate button in detail | ✅ |
| E2 | CSV export on tasks/partners/contacts/meetings/documents pages | ✅ |
| E3 | Print stylesheet + Print in Export menu | ✅ |
| E4 | Enhanced activity filters (date range, entity type, user) | ✅ |
| F1 | Calendar view for meetings + task due dates | ✅ |
| F2 | Animations (accordion expand, modal scale+fade) | ✅ |
| F3 | Accessibility (focus trap NeuModal, ARIA labels on 8 components) | ✅ |
| F4 | Velocity widget on dashboard (30d throughput + avg days/phase) | ✅ |
| F4 | Saved pipeline filters (localStorage: filter + view mode) | ✅ |
| F4 | Notification preferences in settings (5 per-type toggles) | ✅ |
| -- | Wire ?phase= URL param in pipeline (column highlight) | ✅ |
| -- | crm-content max-width fix | ✅ |
| -- | Deep-link tasks: ?tab=workflow&taskId= (auto-expand) | ✅ |
| -- | Funnel bar URL bug FIXED (p.phase lowercase, label separate) | ✅ |

### What's REMAINING (Future Work)

All planned items complete. Potential next areas:

| Area | Description | Notes |
|------|-------------|-------|
| Investor portal | Read-only stakeholder view | Deferred to FEATURE-PIPELINE.md |
| Audit cert | Export compliance PDF | Deferred |
| Batch ops | Multi-select pipeline operations | Deferred |
| Calendar task tasks | Wire task due_dates into CalendarView | Easy add (pass tasks prop) |
| Push notifications | Browser push API | Requires service worker setup |
| Email digests | Daily summary emails | Requires Resend/email setup |

### KNOWN BUGS
1. **DB migration**: `20260401000000_add_target_completion_date.sql` — run `npx supabase db push` before `target_completion_date` field is usable.
2. **Turbopack caching**: `kill -9 $(lsof -ti:3000) && npm run dev` if things look stale.
3. **pre-existing TS warnings** in partners.ts / contacts.ts re: `partner_onboarding_templates` — these use `(ctx.db.from as Function)()` cast per architecture notes. Not errors in production.

---

## SESSION 5 CHANGES

- Velocity widget on dashboard: phase throughput (last 30d advanced count) + avg days in phase with color coding
- Saved pipeline filters: pathFilter + viewMode persist via localStorage
- Activity page: user (performedBy) dropdown filter using team.listActive
- Documents page: CSV export button
- CommandPalette: keyboard navigation (↑↓ navigate, ↵ select, hover sets index), auto-scroll, ↵ hint on row, quick filter chips
- Settings: 5 per-type notification preference toggles (persisted to localStorage)
- ARIA: SubtaskFileList + StageFileList download/delete buttons
- FIXED: getPipelineFunnel now returns `{phase (lowercase key), label, count}` — dashboard funnel bar URLs are now `/crm?phase=lead` (lowercase)

---

## ARCHITECTURE NOTES

- **Stack**: Next.js 16 + React 19 + TypeScript + Tailwind v4 + Supabase + tRPC + motion v12
- **tRPC routers**: 25 routers in `src/server/routers/`
- **No overflow-y:auto on .crm-content** — removed to enable `position: sticky`
- **max-width on .crm-content** — prevents kanban from expanding page width
- **Supabase gen types fails** — new tables use `(ctx.db.from as Function)()` cast; new fields use `(asset as Record<string, unknown>).field`
- **NeuConfirmDialog** — use for ALL destructive actions
- **focusTaskId deep-link** — all task navigation: `?tab=workflow&taskId={id}`
- **useSearchParams** — must be wrapped in `<Suspense>` in any Next.js page
- **motion** — import from `motion/react` (not `framer-motion`)
- **localStorage keys**: `plc-pipeline-filter`, `plc-pipeline-view`, `pleochrome-notifs`, `plc-notif-*`

---

## FEATURE PIPELINE (deferred)
See `specs/FEATURE-PIPELINE.md`:
- Investor/stakeholder portal view
- Audit certification
- Auto-document requests
- Batch pipeline operations
- Partner auto-task creation
- Partner performance metrics
