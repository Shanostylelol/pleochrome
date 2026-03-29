# Page Spec: Compliance Dashboard

**Phase:** 7 — Governance Templates + Compliance + Settings
**URL:** `/crm/compliance`
**Priority:** P0
**Dependencies:** Phase 0 (Foundation), Phase 2 (Asset Detail — step completion data), Phase 3 (Documents — expiry tracking), Phase 4 (Tasks — overdue tracking)
**Estimated Build Time:** 3-4 hours
**Spec Version:** 1.0

---

## PURPOSE

Proactive compliance monitoring. What is expiring, what needs renewal, what is overdue, what is at risk. This is the "don't get caught" view — designed to surface compliance issues BEFORE they become problems. The dashboard aggregates data from across the entire system (documents, tasks, governance steps, partner DD) into a single actionable view.

For investors and regulators, this page demonstrates that PleoChrome has systematic compliance monitoring, not ad-hoc manual tracking.

---

## DATA SOURCES

### Database Tables

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `documents` | Document expiry tracking | `expires_at`, `is_locked`, `document_type` |
| `stones` | Asset metadata (insurance, KYC, filing dates) | `metadata` JSONB (custody.insurance_expires, holder.kyc_verified_date, regulatory_filings.form_d, etc.) |
| `tasks` | Overdue task tracking | `due_date`, `status`, `assigned_to` |
| `asset_task_instances` | Governance task completion | `status`, `due_date` |
| `asset_steps` | Step completion status | `status`, `phase_id` |
| `governance_requirements` | Total required steps count | `is_active`, `phase_id` |
| `partners` | DD refresh tracking | `dd_status`, `last_contact_date` |
| `team_members` | Assignment info | `id`, `full_name`, `avatar_url` |

### Views

| View | Purpose |
|------|---------|
| `v_compliance_dashboard` | Pre-computed compliance alerts, expiry items, and scores |

---

## PAGE LAYOUT

### Header

```
[Title] "Compliance Dashboard" — Cormorant Garamond, 28px, --text-primary
[Subtitle] "Proactive monitoring of compliance deadlines, expirations, and requirements"
  — DM Sans 13px, --text-muted
```

### KPI Cards

Layout: 4 cards in horizontal row, equal width, 16px gap
Component: NeuCard raised, 80px height

| KPI | Label | Value | Color | Calculation |
|-----|-------|-------|-------|-------------|
| Overall Score | "Compliance Score" | "87%" | Green (90%+), Amber (70-89%), Ruby (<70%) | % of governance steps with all tasks complete + all documents uploaded across all active assets |
| Assets at Risk | "Assets at Risk" | "1" | --accent-ruby if > 0, --accent-emerald if 0 | Count of assets with any critical or warning compliance items |
| Overdue Items | "Overdue Items" | "3" | --accent-ruby if > 0, --accent-emerald if 0 | Count of all overdue tasks + expired documents + missed deadlines |
| Upcoming Deadlines | "Upcoming (30 Days)" | "12" | --accent-amber if > 5, --text-primary otherwise | Count of items due within next 30 days |

**Compliance Score Visualization:**
- Circular progress ring (48px diameter) inside the card
- Track: `--border-default`
- Fill: colored by score level (emerald/amber/ruby)
- Animated on load: 0% to current value over 600ms

### Alert Sections

Layout: 3 cards in horizontal row, equal width, 16px gap

**Card: Critical (Ruby)**
```
NeuCard raised
Background: rgba(166,29,58,0.08) (--accent-ruby at 8%)
Border-left: 4px --accent-ruby
[Header] "CRITICAL" — DM Sans 14px, 700 weight, --accent-ruby, icon: alert-triangle
[Count] "3 items" — DM Sans 24px, 600 weight, --text-primary

[ItemList] — vertical, max 5 visible, "View all" link if more
  Each item:
    [Icon] alert-triangle, 16px, --accent-ruby
    [Description] "Vault insurance expires in 5 days" — DM Sans 13px, --text-primary
    [AssetRef] "Emerald Barrel #017093" — DM Sans 11px, --accent-teal, linked
    [DueDate] "Apr 2" — JetBrains Mono 11px, --accent-ruby
    [ActionButton] "Resolve" — NeuButton ghost, small
```

**Card: Warning (Amber)**
```
NeuCard raised
Background: rgba(196,122,26,0.08) (--accent-amber at 8%)
Border-left: 4px --accent-amber
[Header] "ATTENTION" — DM Sans 14px, 700 weight, --accent-amber, icon: alert-circle
[Count] "7 items"
[ItemList] — same structure as Critical, amber color
```

**Card: Upcoming (Sapphire)**
```
NeuCard raised
Background: rgba(30,58,110,0.08) (--accent-sapphire at 8%)
Border-left: 4px --accent-sapphire
[Header] "UPCOMING" — DM Sans 14px, 700 weight, --accent-sapphire, icon: info
[Count] "12 items"
[ItemList] — same structure, sapphire color
```

### Alert Types

| Type | Description | Trigger Condition | Urgency |
|------|-------------|-------------------|---------|
| insurance_expiry | Vault insurance expiring | expires_at < now + 90d | Critical (<7d), Warning (<30d), Upcoming (<90d) |
| document_expiry | Time-sensitive document expiring | documents.expires_at approaching | Critical (<7d), Warning (<30d), Upcoming (<90d) |
| appraisal_due | Annual reappraisal needed | Last appraisal > 11 months ago | Warning (<30d to 1yr), Upcoming (<90d) |
| filing_deadline | Regulatory filing due | Form D 15-day window, blue sky renewals | Critical (overdue), Warning (<7d), Upcoming (<30d) |
| task_overdue | Task past due date | tasks.due_date < now AND status != complete | Critical (>7d overdue), Warning (1-7d overdue) |
| compliance_gap | Required document missing | Governance step requires doc, none uploaded | Warning (step in progress), Upcoming (step upcoming) |
| kyc_expiry | KYC verification expiring | holder.kyc_verified_date + 1yr approaching | Critical (<30d), Warning (<90d) |
| dd_refresh | Partner DD needs refresh | partners.last_contact_date + 6mo approaching | Warning (<30d), Upcoming (<90d) |

### Compliance Calendar

Component: NeuCard raised, full-width, height 400px

```
[Header] "Compliance Calendar" — DM Sans 16px, 600 weight
[Navigation] < April 2026 > — month navigation arrows
[MonthGrid] — standard calendar grid, 7 columns (Sun-Sat)

Each day cell:
  [DayNumber] — DM Sans 12px
  [Dots] — colored dots for items due on that date
    Ruby dot: overdue/expired
    Amber dot: expiring within 30 days
    Sapphire dot: upcoming within 90 days
    Emerald dot: completed/resolved

  Click date: opens side panel showing all compliance items for that date
  Click item in side panel: navigates to relevant asset/partner/document
```

### Compliance Items Table

Position: below calendar, full-width

**Filter Bar:**

| Filter | Component | Options |
|--------|-----------|---------|
| Urgency | NeuSelect | "All", "Critical", "Warning", "Upcoming", "Resolved" |
| Type | NeuSelect | "All", "Insurance Expiry", "Document Expiry", "Appraisal Due", "Filing Deadline", "Task Overdue", "Compliance Gap", "KYC Expiry", "DD Refresh" |
| Asset | NeuSelect (searchable) | "All Assets" + asset names |
| Partner | NeuSelect (searchable) | "All Partners" + partner names |

**Table:**

| Column | Width | Content | Sortable |
|--------|-------|---------|----------|
| Urgency | 40px | Colored dot (ruby/amber/sapphire/emerald) | Yes |
| Type | 140px | NeuBadge by alert type | Yes |
| Description | flex | Alert description text | No |
| Asset/Partner | 180px | NeuBadge linked reference | Yes |
| Deadline Date | 120px | Date, JetBrains Mono | Yes |
| Days Remaining | 100px | Number (negative = overdue, styled ruby) | Yes |
| Assigned To | 140px | NeuAvatar 24px + name | Yes |
| Status | 100px | NeuBadge: "Open", "In Progress", "Resolved" | Yes |
| Actions | 140px | "Resolve" + "Snooze" + "View Details" icon buttons | No |

**Row interactions:**
- Hover: `--bg-tertiary`
- Overdue rows: `rgba(166,29,58,0.06)` background
- Click "Resolve": marks item as resolved, activity logged
- Click "Snooze": pushes reminder forward by 7 days (configurable)
- Click "View Details": navigates to relevant entity (asset, document, partner)

---

## COMPLIANCE SCORE CALCULATION

```
Score = (fully_compliant_steps / total_required_steps) * 100

Where:
  fully_compliant_step = step where:
    - ALL required tasks are complete
    - ALL required documents are uploaded (and not expired)
    - ALL required approvals are granted

  total_required_steps = count of active governance requirements
    across all active assets

Per-asset score:
  asset_score = (asset's compliant steps / asset's total steps) * 100

Global score:
  global_score = average of all active asset scores
```

This calculation runs as a database view (`v_compliance_dashboard`) for performance.

---

## COMPONENTS USED

| Component | Source | Usage |
|-----------|--------|-------|
| NeuCard | `src/components/ui/NeuCard` | KPI cards, alert sections, calendar container, table container |
| NeuButton | `src/components/ui/NeuButton` | Resolve, Snooze, View Details |
| NeuBadge | `src/components/ui/NeuBadge` | Alert type, urgency, status, asset/partner refs |
| NeuSelect | `src/components/ui/NeuSelect` | Filter dropdowns |
| NeuAvatar | `src/components/ui/NeuAvatar` | Assigned to avatars |
| NeuProgress | `src/components/ui/NeuProgress` | Compliance score ring |

### New CRM Components

| Component | Path | Purpose |
|-----------|------|---------|
| ComplianceKPICards | `src/components/crm/ComplianceKPICards` | 4-card KPI summary row |
| ComplianceAlertCard | `src/components/crm/ComplianceAlertCard` | Critical/Warning/Upcoming alert card |
| ComplianceCalendar | `src/components/crm/ComplianceCalendar` | Month view calendar with compliance dots |
| ComplianceItemTable | `src/components/crm/ComplianceItemTable` | Sortable compliance items table |
| ComplianceScoreRing | `src/components/crm/ComplianceScoreRing` | Animated circular progress indicator |

---

## tRPC ROUTES

### Router: `src/server/routers/compliance.ts`

| Procedure | Type | Input | Output | Notes |
|-----------|------|-------|--------|-------|
| `compliance.getDashboard` | query | `{}` | `{ score: number, assetsAtRisk: number, overdueItems: number, upcomingCount: number, perAssetScores: AssetScore[] }` | Reads from `v_compliance_dashboard` view. |
| `compliance.getAlerts` | query | `{ urgency?, type?, assetId?, partnerId?, sortBy?, sortDir?, page?, pageSize? }` | `{ alerts: ComplianceAlert[], total: number }` | Paginated list of all compliance alerts with filters. |
| `compliance.getCalendar` | query | `{ year, month }` | `{ items: CalendarItem[] }` | All compliance items for the specified month, with date and urgency color. |
| `compliance.resolveAlert` | mutation | `{ alertId }` | `{ alert: ComplianceAlert }` | Marks as resolved. Activity logged. |
| `compliance.snoozeAlert` | mutation | `{ alertId, snoozeDays? }` | `{ alert: ComplianceAlert }` | Pushes reminder forward. Default: 7 days. Activity logged. |

### Zod Schemas

```typescript
const ComplianceAlertListInput = z.object({
  urgency: z.enum(['all', 'critical', 'warning', 'upcoming', 'resolved']).default('all'),
  type: z.enum(['all', 'insurance_expiry', 'document_expiry', 'appraisal_due', 'filing_deadline', 'task_overdue', 'compliance_gap', 'kyc_expiry', 'dd_refresh']).default('all'),
  assetId: z.string().uuid().optional(),
  partnerId: z.string().uuid().optional(),
  sortBy: z.enum(['urgency', 'type', 'deadline_date', 'days_remaining']).default('days_remaining'),
  sortDir: z.enum(['asc', 'desc']).default('asc'),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(10).max(100).default(50),
});

const ComplianceCalendarInput = z.object({
  year: z.number().int().min(2024).max(2030),
  month: z.number().int().min(1).max(12),
});
```

---

## TEST CRITERIA

| # | Test | Expected Result |
|---|------|-----------------|
| 1 | Navigate to `/crm/compliance` | Page renders with KPIs, alerts, calendar, table |
| 2 | Compliance score calculation | Score matches manual calculation from step/doc/approval data |
| 3 | KPI card colors | Green at 90%+, amber 70-89%, ruby <70% |
| 4 | Critical alerts show correct items | Items due within 7 days or overdue |
| 5 | Warning alerts show correct items | Items due within 30 days |
| 6 | Upcoming alerts show correct items | Items due within 90 days |
| 7 | Calendar shows dots on correct dates | Color-coded by urgency |
| 8 | Click calendar date | Side panel shows items for that date |
| 9 | Filter compliance table by urgency | Only selected urgency shown |
| 10 | Filter by type | Only selected type shown |
| 11 | Sort by days remaining | Ascending (most urgent first) |
| 12 | Resolve an alert | Status changes to "Resolved", activity logged |
| 13 | Snooze an alert | Reminder pushed forward 7 days |
| 14 | Click "View Details" | Navigates to relevant entity |
| 15 | Overdue rows highlighted | Ruby background on overdue items |
| 16 | Days remaining negative for overdue | Shows "-3" in ruby text |
| 17 | Per-asset scores available | Each asset has individual compliance percentage |
| 18 | Score ring animated | Animates from 0% to value on page load |
| 19 | `npm run build` | Zero errors |
| 20 | Dark mode | All elements correct |
| 21 | Light mode | All elements correct |
| 22 | Empty state (no alerts) | "All clear — no compliance issues detected" with emerald styling |

---

## CLAUDE.md RULES APPLIED

- **Neumorphic design system:** NeuCard raised for all cards, CSS custom properties for colors
- **Dark + light mode:** All colors via CSS variables
- **tRPC for data access:** All queries through tRPC, views for performance
- **Activity logging is automatic:** Resolve/snooze actions logged by triggers
- **"asset" not "stone":** All UI text uses "Asset"
- **Insurance/document expiry warnings:** P0 feature per FEATURE-MAP C.7

---

## DEPENDENCIES

| Dependency | Phase | What's Needed |
|------------|-------|---------------|
| Foundation (Phase 0) | 0 | Atomic components, tRPC |
| Asset Detail (Phase 2) | 2 | Governance step completion data |
| Documents (Phase 3) | 3 | Document expiry dates |
| Tasks (Phase 4) | 4 | Overdue task data |
| Partners (Phase 5) | 5 | DD refresh tracking |

### What This Phase Provides to Others

| Consumer | What |
|----------|------|
| Pipeline Board (Phase 1) | Compliance score shown in stats ribbon |
| Asset Detail (Phase 2) | Per-asset compliance score on hero section |
| CRM Shell | Sidebar compliance nav badge count |
