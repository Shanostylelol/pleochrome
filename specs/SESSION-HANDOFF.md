# Session Handoff — PleoChrome Powerhouse CRM V2

**Last Updated:** 2026-04-01 (Sessions 7-8 final)
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

## CURRENT STATE — FEATURE COMPLETE

**Latest commit: `70bf78b`** — Build clean, zero TS errors.

### Session 8 Changes (most recent)

**Notes/Comments consistency at all levels:**
- Per-file notes on ALL document attachments (stage/task/subtask) — hover sticky-note icon, inline edit
- Document preview modal: shows/edits notes field (saved to documents.notes)
- Global documents table: shows 📝 indicator and notes preview
- Asset detail DocCard: shows 📝 indicator + description in card
- `TaskDetailSection`: `defaultOpen` prop — stage/task/subtask files and comments now default open
- Stage "Notes & Comments" visible by default (was collapsed)
- Subtask files and comments visible by default (was collapsed)

**UX improvements:**
- CommandPalette: "Recently Viewed" section (localStorage, top 5 assets)
  + "Quick Actions" section (New Asset/Meeting/Reminder/Contact/Partner)
- Pipeline kanban: column headers show total overdue task count in ruby
- CompactWorkflowView: stage status badge is clickable (cycles not_started→in_progress→completed)
- OverviewTab: description now uses multiline textarea, PoR status editable
  + Current Location + Item Count added to their sections
  + Insurance Provider/Value added to Legal section

### All Features Complete (Sessions 1-8)

Every planned item done + major quality sweep across 8 sessions.

### Remaining (Genuinely Deferred)

| Feature | Notes |
|---------|-------|
| Email digests | Requires Resend/email setup |
| Push notifications | Requires service worker push API |
| Investor portal | FEATURE-PIPELINE.md |
| Audit certification PDF | FEATURE-PIPELINE.md |

---

## ARCHITECTURE NOTES

- **Stack**: Next.js 16 + React 19 + TypeScript + Tailwind v4 + Supabase + tRPC + motion v12
- **tRPC**: 25 routers in `src/server/routers/`
- **localStorage**: `plc-pipeline-filter`, `plc-pipeline-view`, `plc-recently-viewed`, `pleochrome-notifs`, `plc-notif-*`
- **useSearchParams** → `<Suspense>` wrapper required (pipeline page)
- **motion** → import from `motion/react`
- **New DB fields** → `(asset as Record<string, unknown>).field` until gen types re-run
- **Per-file notes**: `documents.update { notes }` — available at stage/task/subtask level
- **Stage comments**: `EntityCommentThread entityType="stage"` in StageAccordion (defaultOpen)
- **TaskDetailSection**: `defaultOpen` prop added, `count` badge prop available

---

## FEATURE PIPELINE (deferred)

See `specs/FEATURE-PIPELINE.md`:
- Investor/stakeholder portal
- Audit certification PDF
- Batch pipeline operations
- Partner auto-task creation
- Partner performance metrics
