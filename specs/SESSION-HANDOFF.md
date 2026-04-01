# Session Handoff — PleoChrome Powerhouse CRM V2

**Last Updated:** 2026-04-01 (Session 3 final)
**Purpose:** Read this FIRST on any machine. Tells you exactly where to pick up.

---

## QUICK START (new machine or new session)

```bash
cd ~/Projects/pleochrome
git pull
npm install                          # Install any new deps
npx supabase start                   # Start local DB (if needed)
npm run dev                          # Start dev server on :3000
```

Then open: http://localhost:3000/crm

The plan is at: `~/.claude/plans/lexical-weaving-scott.md`

---

## CURRENT STATE

### What's DONE (Phases 0-8 + A-B partial)

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
| B2 | Enhanced Search (prefix filters: overdue:, blocked:, phase:) | ✅ Done |
| C2 | Enforced phase gating (pre-check + override reason) | ✅ Done |
| C3 | Financial projections (cost-to-complete, revenue projection) | ✅ Done |
| D | Comms unification (subtask calls → communication_log) | ✅ Done |
| E1 | Asset duplication (assets.duplicate mutation) | ✅ Done |
| E2 | CSV export utility (src/lib/csv-export.ts) | ✅ Done |
| E3 | Print stylesheet (src/styles/print.css) | ✅ Done |

### What's REMAINING

| Phase | Feature | Priority |
|-------|---------|----------|
| C1 | Asset target dates/SLA — needs DB migration | HIGH |
| B1 bug | Funnel bar click uses PHASES[p.phase].label (capitalized) instead of p.phase (lowercase) for URL — fix the href to use `p.phase` not the label | HIGH |
| E4 | Enhanced audit/activity filters (date range, user, entity type) | MEDIUM |
| F1 | Calendar view for meetings + task due dates | MEDIUM |
| F2 | Animations (accordion expand, modal enter/exit) | LOW |
| F3 | Accessibility (focus trap in NeuModal, ARIA labels) | MEDIUM |
| F4 | Pipeline extras (velocity, saved filters, notif prefs) | LOW |
| -- | Wire ?phase= URL param in pipeline page to filter | MEDIUM |
| -- | Duplicate button in asset detail actions menu | MEDIUM |
| -- | CSV export buttons on list pages | MEDIUM |
| -- | Print button in asset detail Export menu | MEDIUM |

### KNOWN BUGS
1. **Funnel bar click** → uses capitalized label in URL (`/crm?phase=Lead`) but pipeline doesn't read the `phase` param to filter. Two fixes needed:
   - In `dashboard/page.tsx`: change href to use `p.phase` (lowercase key, e.g. "lead") not the label
   - In `page.tsx`: read `searchParams.get('phase')` on mount and apply to kanban filter
2. **Deep-link auto-expand**: `?tab=workflow&taskId=X` navigates correctly and expands the right stage, but timing is tight — the fix (`tasks.length` dependency) was applied but not Chrome-tested fully
3. **Turbopack caching**: Requires dev server restart after major changes. Always `kill -9 $(lsof -ti:3000) && npm run dev` if things look stale

---

## KEY FILES CREATED THIS SESSION

### New Components
- `src/components/ui/NeuConfirmDialog.tsx` — Reusable confirm dialog
- `src/components/crm/CompactWorkflowView.tsx` — Dense flat workflow list
- `src/components/crm/TaskDetailDrawer.tsx` — Slide-out task detail panel
- `src/components/crm/skeletons/ListPageSkeleton.tsx` — Skeleton for list pages
- `src/components/crm/skeletons/DetailPageSkeleton.tsx` — Skeleton for detail pages
- `src/components/crm/CurrentUserProvider.tsx` — Dynamic user context
- `src/components/crm/PipelineHeader.tsx` — Sticky pipeline header with + New Asset
- `src/components/crm/PipelineStatsRibbon.tsx` — KPI cards bar
- `src/components/crm/PipelineFilterBar.tsx` — Value model filter pills
- `src/components/crm/QuickAddModal.tsx` — Quick Add Asset modal
- `src/components/crm/PipelineDashboardView.tsx` — Inline dashboard view in pipeline
- `src/app/crm/dashboard/page.tsx` — Standalone dashboard page
- `src/lib/csv-export.ts` — CSV export utility
- `src/styles/print.css` — Print stylesheet

### Key Modifications
- `src/styles/neumorphic.css` — Breakpoints, max-width, landscape, --text-on-accent
- `src/server/routers/assets.ts` — listForPipeline, duplicate, advancePhase gating
- `src/server/routers/search.ts` — Prefix filter search + getQuickFilterCounts
- `src/server/routers/subtasks.ts` — Communication_log auto-entry on call/email
- `src/components/crm/AssetCard.tsx` — Progress bars, next task, quick actions menu
- `src/app/crm/page.tsx` — Refactored to use extracted components
- `src/app/crm/assets/[id]/page.tsx` — Confirm advance, focusTaskId deep-link
- `src/components/crm/asset-detail/WorkflowTab.tsx` — focusTaskId auto-expand, compact toggle
- `src/components/crm/GateWarningModal.tsx` — Override reason textarea

---

## ARCHITECTURE NOTES

- **tRPC routers**: 25 routers in `src/server/routers/`
- **Stack**: Next.js 16 + React 19 + TypeScript + Tailwind v4 + Supabase + tRPC
- **Design system**: All components use CSS custom properties (`var(--teal)`, etc.)
- **No overflow-y:auto on .crm-content** — removed to enable `position: sticky`
- **max-width on .crm-content** — prevents kanban from expanding page width
- **Supabase gen types fails** — new tables use `(ctx.db.from as Function)()` cast
- **NeuConfirmDialog** — use for ALL destructive actions going forward
- **focusTaskId deep-link** — all task navigation links now use `?tab=workflow&taskId={id}`

---

## FEATURE PIPELINE (deferred)
Logged at `specs/FEATURE-PIPELINE.md`:
- Investor/stakeholder portal view
- Audit certification
- Auto-document requests
- Batch pipeline operations
- Partner auto-task creation
- Partner performance metrics
