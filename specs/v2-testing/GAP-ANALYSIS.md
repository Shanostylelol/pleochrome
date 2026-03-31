# PleoChrome CRM — Gap Analysis
**Date:** 2026-03-30
**Source:** Automated audit of specs vs built code + browser testing

## Priority Tiers

### P0 — CRITICAL (Blocks daily use)
- [x] Edit Asset modal (hero Edit button non-functional) — BUILDING
- [x] Asset Detail Documents tab functional — DONE
- [x] Asset Detail Tasks tab functional — DONE
- [x] Asset Detail Financials tab functional — DONE
- [x] Document upload on global Documents page — BUILDING
- [x] Hero "Add Doc" / "Note" buttons wired — BUILDING
- [x] Tab state persisted in URL params — BUILDING

### P1 — HIGH (Missing workflows)
- [ ] Lead lifecycle: Qualify → Activate → Archive flow on pipeline
- [ ] Gate check validation before phase transitions
- [ ] Governance tab: expandable steps with task instances
- [ ] `assemble_asset_workflow()` called on asset activation
- [ ] Unified task view (merge tasks + asset_task_instances)
- [ ] Comments/Notes system on assets and steps
- [ ] Document versioning UI (parent_document_id chain)
- [ ] Batch document operations (select, download ZIP, lock)
- [ ] Document preview modal (PDF/image viewer)
- [ ] Task assignee selection in create flows
- [ ] Document type auto-suggestion from filename

### P2 — MEDIUM (Enhanced UX)
- [ ] Pipeline: "Save & Add Another" on Quick Add
- [ ] Pipeline: "N" keyboard shortcut for Quick Add
- [ ] Task Dashboard: stats ribbon (Open, Overdue, Due Today, etc.)
- [ ] Task Dashboard: kanban/calendar view modes
- [ ] Task Dashboard: overdue highlighting (ruby tint)
- [ ] Document Library: 6 filter dimensions
- [ ] Document Library: sortable table columns
- [ ] Document Library: grid/card view toggle
- [ ] Partners: category grouping
- [ ] Activity: tRPC router (currently direct Supabase call)
- [ ] Phase Timeline: click-to-navigate, hover tooltips
- [ ] Overview tab: Appraisals card with variance calculation
- [ ] Overview tab: Distribution card (path-specific)

### P3 — NICE TO HAVE (Polish)
- [ ] Financials tab: path-specific views (token/fractional/debt details)
- [ ] Real-time subscriptions on asset detail page
- [ ] Task quick actions on hover
- [ ] Document drag-and-drop upload zone
- [ ] Meeting-Asset-Partner relationship badges
- [ ] Notification center
- [ ] Export audit trail (CSV + PDF)

## Document Organization Architecture (Not Yet Built)

The document system needs a clear organizational model:

1. **Per-Asset folders** — Documents grouped by asset with sub-folders by governance step
2. **Required document checklist** — From `governance_documents` table, show which documents are required per step and which are uploaded vs missing
3. **Document type taxonomy** — 40 document types in the enum, need UI to browse/filter by type
4. **Batch download** — Select multiple documents → download as ZIP (requires server-side ZIP creation or client-side JSZip)
5. **Version chain** — Documents can have `parent_document_id` for version history. UI should show version timeline
6. **Lock audit** — Locked documents show who locked, when, and why. Cannot be deleted.
7. **Expiry alerts** — Documents with `expires_at` should surface in compliance dashboard when approaching expiry

## Data Integrity Issues (from audit)

1. **Reference code collision** — `PC-YYYY-XXXX` uses last 4 digits of `Date.now()`. Needs retry loop.
2. **No pagination** — All lists use LIMIT with no offset/cursor UI. Silent data loss at 200+ records.
3. **Phase transition has zero validation** — `updatePhase` skips gate checks, required docs, required tasks.
4. **`as never` type casts** — Suppress TS checking. Schema changes become silent runtime failures.
5. **Storage path not cleaned on delete** — Orphaned files in Supabase Storage.
6. **No soft delete** — Hard deletes destroy audit evidence on a regulated platform.
7. **Activity log anonymous** — `performed_by` never resolved to a human name.
8. **No drag-and-drop confirmation** — Accidental phase moves are immediate with no undo.

## Scaling Considerations

1. **Pagination** — Asset list uses LIMIT 50 but no pagination UI. With 100+ assets, need infinite scroll or page controls.
2. **Search indexing** — Global search uses ILIKE which won't scale past ~10K records. Consider pg_trgm index or Supabase full-text search.
3. **Activity log performance** — Append-only table will grow large. Partitioning by month is defined in the schema but not enforced.
4. **File storage limits** — 50MB per file, 500MB per asset. No UI enforcement of the per-asset limit.
5. **Concurrent edits** — No optimistic locking or conflict resolution. Two users editing the same asset could overwrite each other.

## Severity Summary

| Category | Critical | High | Medium |
|----------|----------|------|--------|
| Missing from specs | 8 | 16 | 12 |
| Workflow gaps | 6 | 5 | 3 |
| Document management | 5 | 4 | 1 |
| Cross-page connections | 3 | 5 | 2 |
| Data integrity | 6 | 4 | 2 |
| **Total** | **28** | **34** | **20** |

## Top 5 Blockers for Production Use

1. No gate validation on phase transitions (anyone can skip phases)
2. No pagination (data silently lost at scale)
3. No lead activation workflow (assemble_asset_workflow never called)
4. No document download (metadata stored but files inaccessible)
5. Phase transition has no confirmation dialog (accidental moves)
