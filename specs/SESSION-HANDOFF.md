# Session Handoff — PleoChrome Powerhouse CRM V2

**Last Updated:** 2026-04-01 (Sessions 8-9 final)
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

**Latest commit: `375bb11`** — Build clean, zero TS errors.

---

## CURRENT STATE — FEATURE COMPLETE + QUALITY COMPLETE

### Session 9 Changes (most recent)

**Workflow automation:**
- `tasks.complete` + `tasks.updateStatus`: auto-start stage (first task → in_progress) and auto-complete stage (all tasks done)
- Stage inline rename: double-click stage name to edit in-place
- `stages.rename` mutation added

**UI improvements:**
- Task description + notes: inline editable textareas in TaskCardDetails
- Meeting create forms: datetime-local for date+time, attendees textarea
- Meeting card/detail: shows time (e.g. "at 2:00 PM") when non-midnight
- Asset hero: reference code is clickable to copy to clipboard
- Target date shown in compact sticky header when set
- Compliance page: fixed tab link (?tab=governance → ?tab=gates), clickable partner/contact names
- Partner credentials: delete button (soft-delete via is_active=false)
- Contacts list: phone column added with tel: link

**Filter improvements:**
- Tasks page: type filter dropdown (All Types + all task types)
- EntityFileList: document type selector before upload (General/Appraisal/Certificate/etc.)

**Data quality:**
- `partners.deleteCredential` mutation
- Auto-stage-start/complete wired to both `tasks.complete` and `tasks.updateStatus`

### All Features (Sessions 1-9) — All Complete

Every planned phase done + extensive quality improvements across 9 sessions.

### Truly Remaining (Genuinely Deferred)

| Feature | Notes |
|---------|-------|
| Email digests | Requires Resend setup |
| Push notifications | Requires service worker push API |
| Investor portal | FEATURE-PIPELINE.md |
| Audit PDF export | FEATURE-PIPELINE.md |

---

## ARCHITECTURE NOTES

- **Stack**: Next.js 16 + React 19 + TypeScript + Tailwind v4 + Supabase + tRPC + motion v12
- **tRPC**: 25 routers in `src/server/routers/`
- **localStorage**: `plc-pipeline-filter`, `plc-pipeline-view`, `plc-recently-viewed`, `pleochrome-notifs`, `plc-notif-*`
- **Auto-stage logic**: in `tasks.complete` and `tasks.updateStatus` — auto-starts/completes stages
- **Stage rename**: `stages.rename` mutation, double-click on stage name in accordion
- **Per-file notes**: `documents.update { notes }` — available at stage/task/subtask level
- **Stage comments**: `EntityCommentThread entityType="stage"` in StageAccordion (defaultOpen)
- **Document type on upload**: EntityFileList has type dropdown before "Attach File"

---

## FEATURE PIPELINE (deferred)

See `specs/FEATURE-PIPELINE.md`:
- Investor/stakeholder portal
- Audit certification PDF
- Batch pipeline operations
- Partner auto-task creation
- Partner performance metrics
