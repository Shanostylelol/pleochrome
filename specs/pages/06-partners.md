# Page Spec: Partners Directory + Partner Detail

**Phase:** 5 — Partners + Meetings + Contacts
**URLs:** `/crm/partners` (directory), `/crm/partners/[id]` (detail)
**Priority:** P0
**Dependencies:** Phase 0 (Foundation), Phase 2 (Asset Detail — partner tab)
**Estimated Build Time:** 4-5 hours
**Spec Version:** 1.0

---

## PURPOSE

Manage all external partners — vaults, broker-dealers, counsel, tokenization platforms, appraisers, transfer agents, KYC providers, and ATS operators. The directory provides browse/filter/search across all partners. The detail page shows full partner profiles with DD summaries, modules, meetings, contacts, documents, assigned assets, and activity history.

PleoChrome is **partner-agnostic** — the CRM must never imply commitment to any specific partner. Partners are all in evaluation or engagement stages.

---

## DATA SOURCES

### Database Tables

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `partners` | Partner records | `id`, `name`, `type`, `website`, `dd_status`, `dd_score`, `risk_level`, `functions_covered` (text[]), `last_contact_date`, `notes`, `metadata` (JSONB), `created_at` |
| `contacts` | People at partner orgs | `id`, `partner_id`, `full_name`, `title`, `email`, `phone`, `is_primary`, `notes` |
| `asset_partners` | Junction: assets <-> partners | `id`, `asset_id`, `partner_id`, `role_on_stone`, `engagement_date` |
| `partner_modules` | Partner task modules (Layer 2) | `id`, `partner_id`, `name`, `description`, `functions_covered`, `value_paths`, `version`, `is_active` |
| `module_tasks` | Tasks within partner modules | `id`, `module_id`, `governance_requirement_id`, `title`, `description`, `type`, `sort_order` |
| `meeting_notes` | Meeting records associated with partner | `id`, `partner_id`, `asset_id`, `title`, `meeting_date`, `summary`, `action_items` |
| `documents` | DD reports, contracts, NDAs | `id`, `partner_id`, `document_type`, `filename` |
| `assets` | Assets associated with partner | `id`, `name`, `reference_code`, `current_phase` |
| `activity_log` | Activity entries related to partner | `entity_type='partner'`, `entity_id=partner_id` |
| `team_members` | Uploader/assignee info | `id`, `full_name`, `avatar_url` |

---

## PAGE 1: PARTNERS DIRECTORY (`/crm/partners`)

### Header

```
[Title] "Partners" — Cormorant Garamond, 28px, --text-primary
[Right Section]
  [Button: "Add Partner"] — NeuButton primary, --accent-teal, icon: plus
  [Toggle: ViewMode] Grid (icon) | List (icon) — NeuButton group
```

### Filter Bar

Layout: flex row, 8px gap, flex-wrap

| Filter | Component | Options |
|--------|-----------|---------|
| Type | NeuSelect | "All Types", "Vault", "BD/Placement", "Counsel", "Tokenization Platform", "Appraiser", "Transfer Agent", "KYC Provider", "Insurance", "ATS", "Other" |
| DD Status | NeuSelect | "All", "Not Started", "In Progress", "Complete" |
| Risk Level | NeuSelect | "All", "Low", "Moderate", "High" |
| Search | NeuInput | "Search partners..." — 240px |
| Group by Type | NeuToggle | Off (default) / On — groups cards under collapsible type headings |

### Grid View (Default)

Responsive grid: 3 columns on xl, 2 on lg, 1 on sm
Gap: 16px

**PartnerCard (NeuCard raised):**

```
[Row 1: Identity]
  [LogoArea] — 48px square, NeuCard flat, --bg-tertiary
    Partner logo (if available) or initials (first letters of name)
  [Name] "Bull Blockchain Law" — DM Sans 16px, 600 weight, --text-primary
  [TypeBadge] "Counsel" — NeuBadge, --accent-amethyst

[Row 2: DD Status]
  [DDStatusBadge]
    - "Complete" — NeuBadge, --accent-emerald
    - "In Progress" — NeuBadge, --accent-amber
    - "Not Started" — NeuBadge, --text-muted
  [RiskLevel]
    - "Low Risk" — green dot (8px) + DM Sans 12px, --accent-emerald
    - "Moderate Risk" — amber dot + --accent-amber
    - "High Risk" — red dot + --accent-ruby
  [DDScore] "8.5/10" — JetBrains Mono 13px, --text-primary (if available)

[Row 3: Functions Covered]
  Layout: flex row, flex-wrap, 4px gap
  NeuBadge tags for each function: "Securities Law" "PPM Drafting" "SEC Filing"
    — --accent-amethyst at 15% bg, small pills, DM Sans 11px

[Row 4: Stats]
  "2 active modules" — DM Sans 12px, --text-muted
  "Active on 1 asset" — DM Sans 12px, --text-muted
  "Last contact: Mar 15" — DM Sans 12px, --text-muted

[Row 5: Quick Actions]
  [Button: "View DD Report"] — NeuButton ghost, small
  [Button: "Add Note"] — NeuButton ghost, small

Hover: transform scale(1.01), box-shadow: --shadow-card
Click: navigates to /crm/partners/[id]
```

### List View

Sortable table with NeuCard raised rows:

| Column | Width | Content | Sortable |
|--------|-------|---------|----------|
| Logo | 48px | Logo/initials | No |
| Name | flex | Partner name, linked | Yes |
| Type | 140px | NeuBadge type | Yes |
| DD Status | 120px | NeuBadge status | Yes |
| Risk | 100px | Colored dot + text | Yes |
| DD Score | 80px | "8.5/10" mono | Yes |
| Functions | 200px | Badge tags, truncated | No |
| Assets | 80px | Count, linked | Yes |
| Last Contact | 120px | Date | Yes |
| Actions | 100px | View DD, Edit icon buttons | No |

### Category Grouping ("Group by Type" toggle ON)

When enabled, partners are organized under collapsible NeuCard headers:

```
[GroupHeader: "Counsel"] — NeuCard flat, --bg-secondary
  [TypeBadge] "Counsel" — --accent-amethyst
  [Count] "3 partners"
  [Chevron] expand/collapse

  [PartnerCard] Bull Blockchain Law
  [PartnerCard] Some Other Counsel
  [PartnerCard] Third Counsel

[GroupHeader: "Tokenization Platform"]
  [PartnerCard] Brickken
  [PartnerCard] Zoniqx
```

---

## PAGE 2: PARTNER DETAIL (`/crm/partners/[id]`)

### Hero Section

```
[Breadcrumb] "Partners > Bull Blockchain Law" — DM Sans 12px, --text-muted

[Row 1: Identity]
  [Logo] — 64px square, NeuCard flat, --bg-tertiary
  [Name] "Bull Blockchain Law" — Cormorant Garamond, 28px, --text-primary
  [TypeBadge] "Counsel" — NeuBadge
  [Website] "bullblockchainlaw.com" — linked, --accent-teal

[Row 2: Status Indicators]
  [DDStatusBadge] "DD Complete" — NeuBadge, --accent-emerald
  [RiskLevel] "Low Risk" — green dot + text
  [DDScore] "8.5/10" — JetBrains Mono 18px, --text-primary

[Row 3: Functions Covered]
  NeuBadge row: "Securities Law" "PPM Drafting" "SEC Filing" "MSB Counsel" "Blue Sky Filings"

[Row 4: Primary Contact]
  Contact name, email (linked), phone
  [Button: "Edit"] — NeuButton ghost, small

[Row 5: Actions]
  [Button: "Edit Partner"] — NeuButton ghost
  [Button: "Add Note"] — NeuButton ghost
  [Button: "Log Meeting"] — NeuButton ghost
```

### Tab Navigation

Component: NeuTabs, bottom-border variant

| Tab | Badge | Content |
|-----|-------|---------|
| Overview | — | DD summary (default active) |
| Modules | Count badge | Partner modules list |
| Meetings | — | Meeting history with this partner |
| Contacts | Count badge | People at this organization |
| Documents | Count badge | DD reports, contracts, NDAs |
| Assets | Count badge | Assets assigned to this partner |
| Activity | — | Activity feed filtered to this partner |

### Tab: Overview (DD Summary)

```
[Section: Key Findings]
  NeuCard raised, full width
  Rich text summary of due diligence findings
  [Button: "Edit"] — NeuButton ghost (saves version history)

[Section: Strengths]
  NeuCard raised
  Bulleted list (each item editable)
  Green left border (--accent-emerald)

[Section: Risks]
  NeuCard raised
  Bulleted list with severity NeuBadge per item (critical/high/moderate/low)
  Amber left border (--accent-amber)

[Section: Recommendation]
  NeuCard raised
  One of: "Recommended for engagement" (emerald bg), "Proceed with caution" (amber bg), "Do not engage" (ruby bg)
  Backed by DD score
  Ruby left border if negative
```

### Tab: Modules

```
[Element: ModuleList] — vertical list, 8px gap

[Element: ModuleCard] — NeuCard raised
  [Row 1: Name + Version]
    [ModuleName] "Bull Blockchain — PPM + Form D Module" — DM Sans 16px, 600 weight
    [VersionBadge] "v1.0" — JetBrains Mono, NeuBadge
  [Row 2: Description]
    DM Sans 14px, --text-secondary
  [Row 3: Badges]
    [Functions] NeuBadge tags — --accent-amethyst
    [ValuePaths] NeuBadge tags — path colors (emerald/teal/sapphire)
  [Row 4: Stats]
    "8 tasks" | "Active on 2 assets" | "Last updated: Mar 20" — DM Sans 12px, --text-muted
  [ExpandButton] "Show tasks" — NeuButton ghost
  [ExpandedContent] — task list with governance step mapping
    Table: Task | Governance Step | Replaces Default?

[Button: "Create Module"] — NeuButton primary, --accent-teal
```

### Tab: Meetings

```
[Element: MeetingTimeline] — chronological, newest first
  Each entry (reuse MeetingCard component from Phase 5):
    Date + time, title, attendees (avatar stack), summary preview (2 lines), action item count
    Click: navigates to /crm/meetings/[meeting_id]

[Button: "Log Meeting"] — NeuButton primary
  Opens meeting form pre-populated with this partner
```

### Tab: Contacts

```
[Element: ContactList] — NeuCard raised per contact

[ContactCard]
  [Avatar] — NeuAvatar 40px (initials)
  [Name] "John Smith" — DM Sans 16px, --text-primary
  [Title] "Partner, Securities Practice" — DM Sans 13px, --text-secondary
  [Email] — linked, icon: mail
  [Phone] — icon: phone
  [PrimaryBadge] "Primary Contact" — NeuBadge --accent-teal (if is_primary)
  [LastContact] "Last contact: Mar 15" — DM Sans 11px, --text-muted
  [Actions] Edit | Remove

[Button: "Add Contact"] — NeuButton primary, --accent-teal
```

### Tab: Documents

```
Reuse DocumentTable component from Phase 3 (specs/pages/03-documents.md)
Filtered to: partner_id = current partner
Include: DD reports, contracts, proposals, NDAs, correspondence
Upload button pre-populates partner association
```

### Tab: Assets

```
[Element: AssetTable] — sortable table

Columns: Reference (mono), Asset Name (linked), Phase, Active Module, Partner Role
Click row: navigates to /crm/assets/[id]
```

### Tab: Activity

```
Reuse ActivityFeed component from Phase 4 (specs/pages/05-activity.md)
Filtered to: activity_log entries where entity_type='partner' AND entity_id=this partner's ID
OR activity_log entries related to assets where this partner is assigned
```

---

## COMPONENTS USED

| Component | Source | Usage |
|-----------|--------|-------|
| NeuCard | `src/components/ui/NeuCard` | Partner cards, module cards, contact cards, section containers |
| NeuButton | `src/components/ui/NeuButton` | Add Partner, Edit, Log Meeting, Create Module, view toggle |
| NeuBadge | `src/components/ui/NeuBadge` | Type, DD status, risk level, functions, value paths, version |
| NeuInput | `src/components/ui/NeuInput` | Search, form fields |
| NeuSelect | `src/components/ui/NeuSelect` | Filter dropdowns |
| NeuTabs | `src/components/ui/NeuTabs` | Partner detail tab navigation |
| NeuToggle | `src/components/ui/NeuToggle` | Group by Type toggle |
| NeuAvatar | `src/components/ui/NeuAvatar` | Contact avatars, meeting attendees |
| NeuModal | `src/components/ui/NeuModal` | Add Partner form, Add Contact form |

### New CRM Components

| Component | Path | Purpose |
|-----------|------|---------|
| PartnerCard | `src/components/crm/PartnerCard` | Grid view partner card |
| PartnerHero | `src/components/crm/PartnerHero` | Partner detail hero section |
| PartnerDDSummary | `src/components/crm/PartnerDDSummary` | Overview tab DD sections |
| PartnerModuleCard | `src/components/crm/PartnerModuleCard` | Module card with expandable task list |
| ContactCard | `src/components/crm/ContactCard` | Contact person card |
| RiskDot | `src/components/crm/RiskDot` | Colored risk level indicator (reusable) |

---

## tRPC ROUTES

### Router: `src/server/routers/partners.ts`

| Procedure | Type | Input | Output | Notes |
|-----------|------|-------|--------|-------|
| `partners.list` | query | `{ search?, type?, ddStatus?, riskLevel?, sortBy?, sortDir? }` | `{ partners: Partner[] }` | With counts for active modules and assigned assets. |
| `partners.getById` | query | `{ partnerId }` | `{ partner: PartnerFull }` | Full partner with primary contact, function list, DD summary. |
| `partners.create` | mutation | `{ name, type, website?, functions?, notes? }` | `{ partner: Partner }` | Activity logged. DD status defaults to 'not_started'. |
| `partners.update` | mutation | `{ partnerId, name?, type?, website?, ddStatus?, ddScore?, riskLevel?, functions?, notes? }` | `{ partner: Partner }` | Activity logged with before/after diff. |
| `partners.getModules` | query | `{ partnerId }` | `{ modules: PartnerModule[] }` | All modules for this partner with task counts and active asset counts. |
| `partners.getContacts` | query | `{ partnerId }` | `{ contacts: Contact[] }` | All contacts at this partner org. |
| `partners.createContact` | mutation | `{ partnerId, fullName, title?, email?, phone?, isPrimary? }` | `{ contact: Contact }` | Activity logged. |
| `partners.updateContact` | mutation | `{ contactId, fullName?, title?, email?, phone?, isPrimary? }` | `{ contact: Contact }` | Activity logged. |
| `partners.getMeetings` | query | `{ partnerId }` | `{ meetings: Meeting[] }` | All meetings associated with this partner, sorted by date desc. |
| `partners.getDocuments` | query | `{ partnerId }` | `{ documents: Document[] }` | All documents associated with this partner. |
| `partners.getAssets` | query | `{ partnerId }` | `{ assets: AssetPartnerAssignment[] }` | Assets with this partner assigned, including role and module name. |
| `partners.getActivity` | query | `{ partnerId, cursor?, limit? }` | `{ entries: ActivityEntry[], nextCursor: string \| null }` | Activity feed filtered to partner. |

### Zod Schemas

```typescript
const PartnerListInput = z.object({
  search: z.string().optional(),
  type: z.enum(['all', 'vault', 'bd_placement', 'counsel', 'tokenization', 'appraiser', 'transfer_agent', 'kyc_provider', 'insurance', 'ats', 'other']).default('all'),
  ddStatus: z.enum(['all', 'not_started', 'in_progress', 'complete']).default('all'),
  riskLevel: z.enum(['all', 'low', 'moderate', 'high']).default('all'),
  sortBy: z.enum(['name', 'type', 'dd_status', 'risk_level', 'last_contact_date']).default('name'),
  sortDir: z.enum(['asc', 'desc']).default('asc'),
});

const PartnerCreateInput = z.object({
  name: z.string().min(1).max(255),
  type: z.enum(['vault', 'bd_placement', 'counsel', 'tokenization', 'appraiser', 'transfer_agent', 'kyc_provider', 'insurance', 'ats', 'other']),
  website: z.string().url().optional(),
  functions: z.array(z.string()).optional(),
  notes: z.string().max(10000).optional(),
});
```

---

## PARTNER TYPE BADGES

| Type | Color | Label |
|------|-------|-------|
| vault | `--accent-sapphire` | Vault |
| bd_placement | `--accent-emerald` | BD/Placement |
| counsel | `--accent-amber` | Counsel |
| tokenization | `--accent-teal` | Tokenization |
| appraiser | `--accent-amethyst` | Appraiser |
| transfer_agent | `--accent-emerald` | Transfer Agent |
| kyc_provider | `--accent-amethyst` | KYC Provider |
| insurance | `--accent-sapphire` | Insurance |
| ats | `--accent-teal` | ATS |
| other | `--text-muted` | Other |

---

## TEST CRITERIA

| # | Test | Expected Result |
|---|------|-----------------|
| 1 | Navigate to `/crm/partners` | Directory renders with partner grid |
| 2 | Filter by type "Counsel" | Only counsel partners shown |
| 3 | Filter by DD Status "Complete" | Only DD-complete partners shown |
| 4 | Filter by Risk Level "Low" | Only low-risk partners shown |
| 5 | Search by name | Grid filters in real-time |
| 6 | Toggle Grid/List view | View switches correctly |
| 7 | Toggle "Group by Type" | Partners organized under type headings |
| 8 | Click partner card | Navigates to partner detail |
| 9 | Partner detail hero renders | Name, type, DD status, risk, functions, contact info |
| 10 | Overview tab | DD summary with strengths, risks, recommendation |
| 11 | Modules tab | List of partner modules with task counts |
| 12 | Expand module task list | Shows task-to-governance-step mapping |
| 13 | Meetings tab | Chronological meeting list for this partner |
| 14 | Contacts tab | Contact cards with name, title, email, phone |
| 15 | Add Contact | Form opens, contact created, appears in list |
| 16 | Documents tab | Documents filtered to partner |
| 17 | Assets tab | Assets where this partner is assigned |
| 18 | Activity tab | Activity feed filtered to partner |
| 19 | Add Partner | Form opens, partner created, appears in directory |
| 20 | Edit Partner | Fields update, activity logged |
| 21 | List view sortable columns | Sort by name, type, DD status, risk, last contact |
| 22 | `npm run build` | Zero errors |
| 23 | Dark mode | All elements correct |
| 24 | Light mode | All elements correct |
| 25 | Empty state (no partners) | "No partners yet. Add your first partner." |

---

## CLAUDE.md RULES APPLIED

- **Platform-agnostic:** No Brickken/Zoniqx/Rialto commitment in UI. All partners shown as evaluation/engagement stage.
- **Partner-agnostic:** The DD status, risk level, and recommendation system treats all partners equally.
- **Neumorphic design system:** NeuCard raised for cards, CSS custom properties for all visual elements.
- **Dark + light mode:** CSS custom properties throughout.
- **tRPC for mutations:** All partner CRUD goes through tRPC.
- **Activity logging is automatic:** DB triggers handle audit trail.
- **No prop drilling beyond 2 levels:** Use TanStack Query for partner data.

---

## DEPENDENCIES

| Dependency | Phase | What's Needed |
|------------|-------|---------------|
| Foundation (Phase 0) | 0 | Atomic components, tRPC, Supabase |
| Documents (Phase 3) | 3 | DocumentTable component reused on partner Documents tab |
| Activity (Phase 4) | 4 | ActivityFeed component reused on partner Activity tab |

### What This Phase Provides to Others

| Consumer | What |
|----------|------|
| Phase 2 (Asset Detail) | Partners tab on Asset Detail shows assigned partners from this data |
| Phase 5 (Meetings) | Meetings linked to partners via `partner_id` |
| Phase 7 (Templates) | Partner modules created/managed here are used in governance template system |
| Phase 7 (Compliance) | DD refresh deadlines tracked from partner data |
| Phase 6 (Search) | Partners searchable in global search |
