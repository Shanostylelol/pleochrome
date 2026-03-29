# Page Spec: Activity / Audit Trail

**Phase:** 4 — Tasks + Activity
**URL:** `/crm/activity`
**Priority:** P0
**Dependencies:** Phase 0 (Foundation)
**Estimated Build Time:** 2-3 hours
**Spec Version:** 1.0

---

## PURPOSE

Global immutable audit trail across ALL assets, partners, and team actions. This is the compliance-grade evidence chain that investors and regulators will review. Every mutation in the system is logged here automatically by database triggers. This page is read-only by design — no edit, no delete, no modification of any kind.

**CRITICAL RULE: NO edit or delete controls anywhere on this page. The feed is permanently read-only. This is enforced at the database level (RLS: SELECT only, no UPDATE/DELETE policies) and must be enforced at the UI level (no edit buttons, no delete buttons, no modification affordances).**

---

## DATA SOURCES

### Database Tables

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `activity_log` | Immutable audit trail | `id`, `stone_id`, `user_id`, `action_type`, `entity_type`, `entity_id`, `details` (JSONB), `created_at` |
| `stones` | Asset reference for display | `id`, `name`, `reference_code` |
| `partners` | Partner reference for display | `id`, `name` |
| `team_members` | User info for display | `id`, `full_name`, `avatar_url` |

### Key Indexes (for performance)

- `(created_at DESC)` — primary ordering
- `(action_type, created_at DESC)` — type filter
- `(user_id, created_at DESC)` — user filter
- `(stone_id, created_at DESC)` — asset filter

---

## PAGE LAYOUT

### Header

```
[Title] "Activity Log" — Cormorant Garamond, 28px, --text-primary
[Subtitle] "Immutable audit trail — records cannot be edited or deleted"
  — DM Sans 12px, --text-muted, italic
[Right Section]
  [Button: "Export Audit Trail"] — NeuButton primary, icon: download
    Click: opens export dialog
```

### Stats Bar

Layout: 3 stat cards, horizontal row, equal width, 8px gap
Component: NeuCard raised

| Stat | Label | Notes |
|------|-------|-------|
| Total Events | "[X] Total Events" | Count of all activity_log rows |
| Today | "[X] Events Today" | Count where `created_at >= today start` |
| This Week | "[X] Events This Week" | Count where `created_at >= this week start` |

### Filter Bar

Layout: flex row, 8px gap, flex-wrap

| Filter | Component | Options |
|--------|-----------|---------|
| Search | NeuInput (full-width, prominent) | "Search activity..." — full-text across action descriptions and details |
| Asset | NeuSelect (searchable) | "All Assets" + asset names |
| Partner | NeuSelect (searchable) | "All Partners" + partner names |
| Team Member | NeuSelect | "All" + team member names |
| Action Type | NeuSelect | "All", "Document", "Step", "Gate", "Task", "Comment", "Status Change", "Partner", "System" |
| Date Range | NeuDateRangePicker | Default: last 30 days |

### Activity Feed

Vertical list, chronological (newest first), cursor-based pagination.

**Pagination:** "Load more" button at bottom (loads 50 entries at a time). Using cursor-based pagination (not offset) because `activity_log` can grow large — cursor = `created_at` of last loaded entry.

```
[Element: ActivityEntry] — flex row, 12px gap, padding 12px 0
  [Left Column: Type Indicator] — 20px width
    [ColorDot] — 8px circle, colored by action type
    [VerticalLine] — 1px connecting line to next entry, --border-default

  [Right Column: Content] — flex-1
    [Row 1: Timestamp]
      "2026-03-29 14:32:15 UTC" — JetBrains Mono 11px, --text-muted
    [Row 2: User + Action]
      [NeuAvatar] — 20px
      [UserName] "Shane Pierson" — DM Sans 13px, 500 weight, --text-primary
      [ActionText] "uploaded GIA Grading Report" — DM Sans 13px, --text-secondary
    [Row 3: References]
      [AssetBadge] "Emerald Barrel #017093" — NeuBadge linked, --accent-teal bg at 15%
      [PartnerBadge] "Bull Blockchain Law" — NeuBadge linked, --accent-amethyst bg at 15% (if applicable)
      [StepRef] "Step 2.1" — JetBrains Mono 11px, linked
    [Row 4: Detail Text] (if exists)
      "Report #2186543921, file: GIA-017093-2026.pdf" — DM Sans 12px, --text-muted
    [Row 5: Expandable Detail] (if details JSONB has more)
      [ExpandButton] "Show details" — DM Sans 11px, --text-muted, click to expand
      [ExpandedContent] — NeuCard flat, --bg-tertiary, padding 12px
        Pre-formatted JSON of full details JSONB (before/after state)
        — JetBrains Mono 11px, --text-muted
```

### Activity Type Color Coding

| Action Type | Dot Color | Icon |
|-------------|-----------|------|
| document | `--accent-sapphire` (#1E3A6E) | file |
| step | `--accent-emerald` (#1B6B4A) | layers |
| gate | `--accent-gold` (#D4AF37) | shield |
| task | `--accent-amethyst` (#5B2D8E) | check-square |
| alert | `--accent-ruby` (#A61D3A) | alert-triangle |
| system | `--text-muted` (#64748b) | zap |
| comment | `--accent-teal` (#1A8B7A) | message-square |
| partner | `--accent-amethyst` (#5B2D8E) | handshake |
| status_change | `--accent-amber` (#C47A1A) | refresh-cw |

### Export Dialog

Trigger: "Export Audit Trail" button
Component: NeuModal, 480px wide

```
[Title] "Export Audit Trail"
[Subtitle] "For investor/regulator audit purposes"

[Field: Date Range] — NeuDateRangePicker, default: all time
[Field: Asset Filter] — NeuSelect, "All Assets" + options
[Field: Partner Filter] — NeuSelect, "All Partners" + options
[Field: Team Member] — NeuSelect, "All" + options
[Field: Action Type] — NeuSelect multi-select, "All" + type options
[Field: Format] — Radio group: "PDF" | "CSV"
  - PDF: Formatted report with PleoChrome branding, headers, pagination
  - CSV: Raw data export with all columns

[Button: "Generate Export"] — NeuButton primary
[Button: "Cancel"] — NeuButton ghost

Export generation:
  - CSV: immediate download via tRPC query
  - PDF: queued to Edge Function, download link returned (may take seconds for large exports)
```

---

## COMPONENTS USED

| Component | Source | Usage |
|-----------|--------|-------|
| NeuCard | `src/components/ui/NeuCard` | Stat cards, expanded detail containers |
| NeuButton | `src/components/ui/NeuButton` | Export button, load more, expand/collapse |
| NeuBadge | `src/components/ui/NeuBadge` | Asset/partner reference badges, action type badges |
| NeuInput | `src/components/ui/NeuInput` | Search input |
| NeuSelect | `src/components/ui/NeuSelect` | All filter dropdowns |
| NeuModal | `src/components/ui/NeuModal` | Export dialog |
| NeuAvatar | `src/components/ui/NeuAvatar` | User avatars in feed entries |

### New CRM Components

| Component | Path | Purpose |
|-----------|------|---------|
| ActivityFeed | `src/components/crm/ActivityFeed` | Chronological feed with type dots and connecting lines |
| ActivityEntry | `src/components/crm/ActivityEntry` | Single feed entry (reused on Asset Detail Activity tab) |
| ActivityStatsBar | `src/components/crm/ActivityStatsBar` | 3-stat summary cards |
| ExportAuditDialog | `src/components/crm/ExportAuditDialog` | Export configuration modal |

---

## tRPC ROUTES

### Router: `src/server/routers/activity.ts`

| Procedure | Type | Input | Output | Notes |
|-----------|------|-------|--------|-------|
| `activity.list` | query | `{ search?, assetId?, partnerId?, userId?, actionType?, dateFrom?, dateTo?, cursor?, limit? }` | `{ entries: ActivityEntry[], nextCursor: string \| null, stats: ActivityStats }` | Cursor-based pagination. Cursor = `created_at` ISO string of last entry. Default limit: 50. JOINs with stones, partners, team_members. |
| `activity.getStats` | query | `{}` | `{ total: number, today: number, thisWeek: number }` | Aggregation counts for stats bar. |
| `activity.export` | mutation | `{ format: 'csv' \| 'pdf', assetId?, partnerId?, userId?, actionType?, dateFrom?, dateTo? }` | `{ downloadUrl: string }` | CSV: generates immediately, returns signed URL. PDF: calls Edge Function for formatted report. |

### Zod Schemas

```typescript
const ActivityListInput = z.object({
  search: z.string().optional(),
  assetId: z.string().uuid().optional(),
  partnerId: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
  actionType: z.enum(['all', 'document', 'step', 'gate', 'task', 'comment', 'status_change', 'partner', 'system']).default('all'),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  cursor: z.string().datetime().optional(),
  limit: z.number().int().min(10).max(100).default(50),
});

const ActivityExportInput = z.object({
  format: z.enum(['csv', 'pdf']),
  assetId: z.string().uuid().optional(),
  partnerId: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
  actionType: z.enum(['all', 'document', 'step', 'gate', 'task', 'comment', 'status_change', 'partner', 'system']).default('all'),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
});
```

---

## TIMESTAMP FORMATTING

All timestamps stored as `TIMESTAMPTZ` (UTC with second precision).

Display format: `YYYY-MM-DD HH:MM:SS UTC` — JetBrains Mono 11px
- Example: "2026-03-29 14:32:15 UTC"
- Timezone: always display UTC for audit consistency
- Tooltip on hover: user's local timezone conversion via `Intl.DateTimeFormat`

---

## TEST CRITERIA

| # | Test | Expected Result |
|---|------|-----------------|
| 1 | Navigate to `/crm/activity` | Page renders with stats, feed, filters |
| 2 | Stats accuracy | Total, today, this week counts match actual data |
| 3 | Feed shows entries newest first | Most recent entry at top |
| 4 | Timestamps are UTC and second-precise | Format: "2026-03-29 14:32:15 UTC" |
| 5 | Filter by asset | Only entries for selected asset shown |
| 6 | Filter by action type "Gate" | Only gate-related entries shown |
| 7 | Filter by date range | Only entries within range shown |
| 8 | Search by keyword | Matches against action text and details |
| 9 | Load more button | Next 50 entries load, appended to feed |
| 10 | Expand entry detail | JSONB details shown in formatted view |
| 11 | Click asset badge | Navigates to `/crm/assets/[id]` |
| 12 | Click partner badge | Navigates to `/crm/partners/[id]` |
| 13 | NO edit buttons exist anywhere | Verify no edit/delete affordances in DOM |
| 14 | NO delete buttons exist anywhere | Verify no delete affordances in DOM |
| 15 | Export CSV | CSV file downloads with correct filtered data |
| 16 | Export PDF | PDF downloads with PleoChrome branding and filtered data |
| 17 | `npm run build` | Zero errors |
| 18 | Dark mode | All elements correct |
| 19 | Light mode | All elements correct |
| 20 | Empty state (no activity) | "No activity recorded yet" message |
| 21 | Color-coded dots | Each action type has correct dot color |

---

## CLAUDE.md RULES APPLIED

- **`activity_log` is IMMUTABLE:** No UPDATE or DELETE. No frontend controls that suggest mutability.
- **Activity logging is automatic:** DB triggers handle all entries. NO manual frontend inserts.
- **Neumorphic design system:** All visual elements use CSS custom properties
- **Dark + light mode:** CSS custom properties throughout
- **tRPC for data access:** All queries go through tRPC, not direct Supabase client calls
- **"asset" not "stone":** UI displays "Asset" even though DB column is `stone_id`

---

## DEPENDENCIES

| Dependency | Phase | What's Needed |
|------------|-------|---------------|
| Foundation (Phase 0) | 0 | Atomic components, tRPC, Supabase |

### What This Phase Provides to Others

| Consumer | What |
|----------|------|
| Phase 2 (Asset Detail) | Asset Detail Activity tab reuses ActivityFeed + ActivityEntry components (filtered by asset_id) |
| Phase 5 (Partners) | Partner Detail Activity tab reuses ActivityFeed (filtered by partner_id) |
| Phase 7 (Compliance) | Compliance dashboard links to filtered activity views |
| ALL phases | Every mutation in the system generates activity entries automatically |
