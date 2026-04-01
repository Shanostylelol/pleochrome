# Session Handoff — PleoChrome Powerhouse CRM V2

**Last Updated:** 2026-04-01 (Session 4 final)
**Purpose:** Read this FIRST on any machine. Tells you exactly where to pick up.

---

## QUICK START (new machine or new session)

```bash
cd ~/Projects/pleochrome
git pull
npm install                          # Install any new deps
npx supabase start                   # Start local DB (if needed)
npx supabase db push                 # Apply new migration (target_completion_date)
npm run dev                          # Start dev server on :3000
```

Then open: http://localhost:3000/crm

The plan is at: `~/.claude/plans/lexical-weaving-scott.md`

---

## CURRENT STATE

### What's DONE (Phases 0-8 + A-E + F1-F3)

| Phase | Feature | Status |
|-------|---------|--------|
| 0 | ErrorBoundary, modal fix, sidebar responsive, breakpoints | ✅ Done |
| 1 | NeuConfirmDialog on all destructive actions | ✅ Done |
| 2 | CSS consistency (--text-on-accent, Neu* components) | ✅ Done |
| 3 | CompactWorkflowView + TaskDetailDrawer + toggle | ✅ Done |
| 4 | Loading skeletons across 19 files | ✅ Done |
| 5 | CurrentUserProvider, dynamic user everywhere | ✅ Done |
| 6 | Mobile polish (bottom nav, MoreSheet, landscape) | ✅ Done |
| 7 | Quick Add form validation with inline errors | ✅ Done |
| 8 | Dashboard page with 6 real-data widgets | ✅ Done |
| A1 | Pipeline page refactored 709→327 lines | ✅ Done |
| A2 | Pipeline cards: progress bars + "Next: [task]" | ✅ Done |
| A3 | Pipeline card quick actions (Advance, Archive) | ✅ Done |
| A4 | Archive flow (hidden from pipeline by default) | ✅ Done |
| -- | crm-content max-width fix (button always visible) | ✅ Done |
| -- | Deep-link tasks: ?tab=workflow&taskId= (auto-expand) | ✅ Done |
| B1 | Actionable Dashboard (clickable tasks/approvals/reminders) | ✅ Done |
| B1 bug | Funnel bar uses p.phase (lowercase) in URL | ✅ Fixed |
| B2 | Enhanced Search (prefix filters: overdue:, blocked:, phase:) | ✅ Done |
| C1 | Asset target dates/SLA — DB migration + UI | ✅ Done |
| C2 | Enforced phase gating (pre-check + override reason) | ✅ Done |
| C3 | Financial projections (cost-to-complete, revenue projection) | ✅ Done |
| D | Comms unification (subtask calls → communication_log) | ✅ Done |
| E1 | Asset duplication — mutation + Duplicate button in detail | ✅ Done |
| E2 | CSV export utility (src/lib/csv-export.ts) | ✅ Done |
| E2 | CSV export buttons on tasks/partners/contacts/meetings pages | ✅ Done |
| E3 | Print stylesheet + Print in Export menu | ✅ Done |
| E4 | Enhanced activity filters (date range, entity type) | ✅ Done |
| F1 | Calendar view for meetings + task due dates | ✅ Done |
| F2 | Animations (accordion expand, modal scale+fade) | ✅ Done |
| F3 | Accessibility (focus trap NeuModal, ARIA labels) | ✅ Done |
| -- | Wire ?phase= URL param in pipeline page | ✅ Done |

### What's REMAINING

| Phase | Feature | Priority |
|-------|---------|----------|
| F4 | Pipeline velocity widget on dashboard | LOW |
| F4 | Saved pipeline filters (localStorage) | LOW |
| F4 | Notification preferences in settings | LOW |
| -- | Activity filters: user (performedBy) dropdown | LOW |
| -- | SubtaskFileList / StageFileList ARIA download+delete | LOW |
| -- | Deep-link auto-expand Chrome-verified | VERIFY |

### KNOWN BUGS
1. **Deep-link auto-expand**: `?tab=workflow&taskId=X` timing fix was applied (tasks.length dep) but not Chrome-tested on a live session. Mark as done after verifying.
2. **Turbopack caching**: Requires dev server restart after major changes. Always `kill -9 $(lsof -ti:3000) && npm run dev` if things look stale.
3. **DB migration pending**: `20260401000000_add_target_completion_date.sql` — run `npx supabase db push` on prod/local before using target date field.

---

## SESSION 4 CHANGES

### New Files
- `src/components/crm/CalendarView.tsx` — Monthly calendar grid, meetings + task due dates, day detail panel
- `supabase/migrations/20260401000000_add_target_completion_date.sql` — adds target_completion_date to assets

### Key Modifications
- `src/app/crm/page.tsx` — ?phase= URL param wires to column highlight; Suspense wrapper for useSearchParams
- `src/app/crm/assets/[id]/page.tsx` — Duplicate button (desktop + mobile), target_completion_date hero indicator
- `src/app/crm/activity/page.tsx` — Date range + entity type filters
- `src/app/crm/meetings/page.tsx` — List/calendar view toggle, CalendarView integration
- `src/app/crm/tasks/page.tsx` — CSV export button
- `src/app/crm/partners/page.tsx` — CSV export button
- `src/app/crm/contacts/page.tsx` — CSV export button
- `src/components/crm/AssetCard.tsx` — target_completion_date days indicator
- `src/components/crm/asset-detail/EditAssetModal.tsx` — Target date field
- `src/components/crm/StageAccordion.tsx` — AnimatePresence expand/collapse
- `src/components/ui/NeuModal.tsx` — AnimatePresence scale+fade + focus trap + ARIA
- `src/server/routers/activity.ts` — dateFrom, dateTo, performedBy filter support
- `src/server/routers/assets.ts` — targetCompletionDate in update mutation
- `src/lib/validation/asset.ts` — targetCompletionDate field in updateAssetInput
- Several close buttons: aria-label added (MoreSheet, TaskDetailDrawer, NotificationPanel, MobileDrawer, QuickAddModal)
- `src/components/crm/EntityFileList.tsx` — aria-label on download/delete buttons

---

## ARCHITECTURE NOTES

- **tRPC routers**: 25 routers in `src/server/routers/`
- **Stack**: Next.js 16 + React 19 + TypeScript + Tailwind v4 + Supabase + tRPC
- **Design system**: All components use CSS custom properties (`var(--teal)`, etc.)
- **No overflow-y:auto on .crm-content** — removed to enable `position: sticky`
- **max-width on .crm-content** — prevents kanban from expanding page width
- **Supabase gen types fails** — new tables use `(ctx.db.from as Function)()` cast; new fields use `(asset as Record<string, unknown>).field`
- **NeuConfirmDialog** — use for ALL destructive actions going forward
- **focusTaskId deep-link** — all task navigation links now use `?tab=workflow&taskId={id}`
- **useSearchParams** — must be wrapped in `<Suspense>` in any Next.js page (pipeline page already fixed)
- **motion** — installed as "motion" (v12), import from `motion/react` (not `framer-motion`)

---

## FEATURE PIPELINE (deferred)
Logged at `specs/FEATURE-PIPELINE.md`:
- Investor/stakeholder portal view
- Audit certification
- Auto-document requests
- Batch pipeline operations
- Partner auto-task creation
- Partner performance metrics
