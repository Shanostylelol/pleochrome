# Session Handoff — PleoChrome Powerhouse CRM V2

**Last Updated:** 2026-04-01 (Sessions 5-6 final)
**Purpose:** Read this FIRST on any machine. Tells you exactly where to pick up.

---

## QUICK START (new machine or new session)

```bash
cd ~/Projects/pleochrome
git pull
npm install
npx supabase start
npx supabase db push          # Apply: add_target_completion_date migration
npm run dev                   # :3000
```

---

## CURRENT STATE — PRODUCTION-READY

The CRM is now fully production-ready as a daily workflow tool. All planned phases complete + significant additional features added in sessions 5-6.

### What's DONE (Sessions 1-6)

**Core Phases (0-F4):** All done — see previous handoffs for details.

**Sessions 5-6 additional features:**
- Reminders system: SetReminderModal, /crm/reminders page, sidebar badge, dashboard dismiss
- Team workload: getWorkload procedure + live stats on team page
- Documents batch download with JSZip
- CalendarView with task due dates wired
- CommandPalette: keyboard nav + quick filter chips + deep-links for tasks/docs
- Velocity widget on dashboard
- Saved pipeline filters (localStorage)
- Activity page: user dropdown filter
- Notification preferences in settings (5 per-type toggles)
- Partner Comms tab (PartnerCommsTab + Log Communication modal)
- RecentCommsWidget on asset OverviewTab
- Description field editable on OverviewTab
- asset_holder_entity editable (OverviewTab inline + EditAssetModal)
- FinancialsTab: target_raise + management_fee_pct inline-editable projections
- Pipeline cards: overdueCount indicator in ruby
- listForPipeline: computes overdueCount per asset
- Dashboard My Day: task items show asset name + overdue due dates in ruby
- Search deep-links: tasks → /crm/assets/{id}?tab=workflow&taskId={id}
- Contacts/assets CSV export on all list pages
- Assets list CSV export
- ARIA labels on all icon-only buttons (8 components)

### REMAINING (genuinely deferred)

| Feature | Notes |
|---------|-------|
| Email digests | Requires Resend/email setup |
| Push notifications | Requires service worker push API |
| Investor portal | Deferred — see FEATURE-PIPELINE.md |
| Audit certification PDF | Deferred |
| Batch pipeline operations | Deferred |
| Partner auto-task creation | Deferred |
| Deep-link Chrome test | timing fix applied, verify in live session |

### KNOWN ACTIVE BUGS
1. **DB migration**: Run `npx supabase db push` to apply `20260401000000_add_target_completion_date.sql`
2. **Turbopack**: `kill -9 $(lsof -ti:3000) && npm run dev` if stale
3. **LSP false positives**: Many "unused" warnings from the LSP are false — `npx tsc --noEmit` is authoritative (zero errors)
4. **Pre-existing TS warnings**: partners.ts + contacts.ts for `partner_onboarding_templates` / `contact_onboarding_items` — these are `as unknown as` casts, not real errors

---

## ARCHITECTURE NOTES

- **Stack**: Next.js 16 + React 19 + TypeScript strict + Tailwind v4 + Supabase + tRPC + motion v12
- **tRPC routers**: 25 routers in `src/server/routers/`
- **localStorage keys**: `plc-pipeline-filter`, `plc-pipeline-view`, `pleochrome-notifs`, `plc-notif-*`
- **No overflow-y:auto on .crm-content** — removed to enable `position: sticky`
- **useSearchParams** — must be wrapped in `<Suspense>` in any Next.js page
- **motion** — import from `motion/react` (not `framer-motion`)
- **New field access**: Use `(asset as Record<string, unknown>).field` until `npx supabase gen types` is re-run

---

## FEATURE PIPELINE (deferred)
See `specs/FEATURE-PIPELINE.md`:
- Investor/stakeholder portal view
- Audit certification
- Auto-document requests
- Batch pipeline operations
- Partner auto-task creation
- Partner performance metrics
