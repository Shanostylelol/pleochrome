# PleoChrome Powerhouse CRM -- Wireframe Architecture Specification

**Version:** 1.0
**Date:** 2026-03-27
**Classification:** Build Blueprint -- Design & Development Reference
**Authors:** Shane Pierson (CEO), Claude Opus 4.6 (Architecture)
**Prerequisite Documents:**
- `POWERHOUSE-CRM-SCHEMA-DESIGN.md` (database schema + UI/UX direction)
- `SCALABILITY-AND-INFRASTRUCTURE-REVIEW.md` (infrastructure roadmap)
- `TOKENIZATION-WORKFLOW-AUDIT-SPEC.md` (tokenization governance steps)
- `EXHAUSTIVE-WORKFLOW-AUDIT-FRACTIONAL-AND-DEBT.md` (fractional + debt governance steps)
- `src/lib/portal-data.ts` (value paths, phases, steps, partners, costs)

---

## TABLE OF CONTENTS

1. [Architecture Overview](#1-architecture-overview)
2. [Three-Layer CRM Model](#2-three-layer-crm-model)
3. [Design System & Tokens](#3-design-system--tokens)
4. [Global Shell & Navigation](#4-global-shell--navigation)
5. [Page 1: Pipeline Board (Main Dashboard)](#5-page-1-pipeline-board)
6. [Page 2: Asset Detail View](#6-page-2-asset-detail-view)
7. [Page 3: Asset List View](#7-page-3-asset-list-view)
8. [Page 4: Partners Directory](#8-page-4-partners-directory)
9. [Page 5: Partner Detail](#9-page-5-partner-detail)
10. [Page 6: Document Library](#10-page-6-document-library)
11. [Page 7: Task Dashboard](#11-page-7-task-dashboard)
12. [Page 8: Meetings](#12-page-8-meetings)
13. [Page 9: Activity / Audit Trail](#13-page-9-activity--audit-trail)
14. [Page 10: Team](#14-page-10-team)
15. [Page 11: Governance Templates](#15-page-11-governance-templates)
16. [Page 12: Compliance Dashboard](#16-page-12-compliance-dashboard)
17. [Page 13: Settings](#17-page-13-settings)
18. [Page 14: New Asset Wizard](#18-page-14-new-asset-wizard)
19. [Global Overlays & Interactions](#19-global-overlays--interactions)
20. [Interaction Patterns & Flows](#20-interaction-patterns--flows)
21. [Responsive Behavior](#21-responsive-behavior)
22. [Accessibility Requirements](#22-accessibility-requirements)
23. [Data Loading & Empty States](#23-data-loading--empty-states)

---

## 1. ARCHITECTURE OVERVIEW

### What This CRM Is

The Powerhouse CRM is PleoChrome's internal operations platform for managing high-value real-world assets through governance-gated workflows from acquisition to distribution. It is:

- **Asset-centric:** Everything revolves around the `assets` table. A "stone" is any asset being processed -- gemstone barrels, individual stones, real estate lots, precious metal holdings, mineral rights packages.
- **Partner-agnostic:** Governance steps are regulatory requirements. Tasks within those steps are pluggable per partner. Switch from Brickken to Zoniqx? The governance steps stay; only the task modules change.
- **Asset-agnostic:** The same 4-phase governance pipeline handles gemstones, real estate, precious metals, and mineral rights. Asset type affects metadata fields, not workflow structure.
- **Path-aware:** Three value paths (Fractional Securities, Tokenization, Debt Instruments) share Phases 1-2, then diverge into path-specific Phases 3-4.

### Tech Stack (from Schema Design)

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 + React 19 + TypeScript strict + Tailwind v4 + shadcn/ui |
| API | tRPC (typed API layer) |
| Database | PostgreSQL 15+ (Supabase managed) |
| Auth | Supabase Auth (email/password + magic link + MFA) |
| Storage | Supabase Storage (5 buckets) |
| State | TanStack Query (React Query) for server state |
| Realtime | Supabase Realtime for pipeline + task + notification updates |

### URL Structure

```
/crm                          -- Pipeline Board (main dashboard)
/crm/assets                   -- Asset List View
/crm/assets/[asset_id]        -- Asset Detail View
/crm/assets/new               -- New Asset Wizard
/crm/partners                 -- Partners Directory
/crm/partners/[partner_id]    -- Partner Detail
/crm/documents                -- Document Library
/crm/tasks                    -- Task Dashboard
/crm/meetings                 -- Meeting List
/crm/meetings/[meeting_id]    -- Meeting Detail
/crm/activity                 -- Global Audit Trail
/crm/team                     -- Team Directory
/crm/team/[member_id]         -- Team Member Detail
/crm/templates                -- Governance Templates & Partner Modules
/crm/compliance               -- Compliance Dashboard
/crm/settings                 -- Application Settings
```

---

## 2. THREE-LAYER CRM MODEL

The CRM operates on a three-layer separation that is critical to understand before reading any wireframe.

### Layer 1: Governance (Immutable Regulatory Requirements)

These are the non-negotiable steps that exist because regulators, laws, or industry standards require them. They do NOT change when you switch partners. They are enforced at the database level.

**Examples:**
- "Three independent USPAP-compliant appraisals" -- required by Reg D 506(c) best practices for asset-backed securities
- "KYC/KYB on asset holder" -- required by FinCEN BSA/AML
- "Form D filing within 15 days of first sale" -- required by SEC
- "UCC-1 filing to perfect security interest" -- required by UCC Article 9

**In the UI:** Governance steps appear as collapsible rows in the Governance tab of the Asset Detail page. They have a regulatory citation, required document slots, and approval requirements. They CANNOT be deleted -- only deactivated (with audit trail).

### Layer 2: Templates (Partner-Configurable Task Modules)

These are the specific tasks, tools, and procedures that fulfill governance requirements. They vary by partner.

**Example:** Governance Step "Deploy Security Token on Mainnet" is fulfilled differently by:
- **Brickken Module:** Configure ERC-3643 in Brickken dashboard, deploy via Brickken API, verify ONCHAINID compliance
- **Zoniqx Module:** Configure ERC-7518 in Zoniqx TPaaS, deploy via Zoniqx API, verify zCompliance rules
- **Rialto Module:** Configure in RiMES platform, deploy via Rialto in-house tokenization

**In the UI:** Partner modules appear in the Templates page. When assigned to an asset, their tasks appear nested under the governance step they fulfill. Swapping a module replaces those tasks (old ones marked "Superseded", new ones created) without touching the governance step.

### Layer 3: Instances (Actual Execution Records)

These are the real records of what happened. Task completions, document uploads, gate passages, approval decisions. All logged in the immutable `activity_log`.

**In the UI:** Instance data appears throughout -- task checkboxes, document uploads, activity feeds, gate check records. All timestamped, all attributed to a user, all immutable.

---

## 3. DESIGN SYSTEM & TOKENS

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-primary` | `#030712` | Main background (body, sidebar) |
| `--bg-secondary` | `#0a1628` | Card backgrounds, panel surfaces |
| `--bg-tertiary` | `#111827` | Elevated surfaces (modals, dropdowns, hover states) |
| `--bg-input` | `#0f172a` | Input field backgrounds |
| `--border-default` | `#1e293b` | Borders, dividers, card outlines |
| `--border-focus` | `#334155` | Focus rings, active borders |
| `--text-primary` | `#f8fafc` | Headings, primary labels, values |
| `--text-secondary` | `#94a3b8` | Body text, descriptions, secondary labels |
| `--text-muted` | `#64748b` | Timestamps, metadata, disabled text |
| `--text-placeholder` | `#475569` | Input placeholders |
| `--accent-emerald` | `#1B6B4A` | Fractional path, success states, completed steps, Phase 1 |
| `--accent-teal` | `#1A8B7A` | Tokenization path, active/in-progress states, Phase 2 |
| `--accent-sapphire` | `#1E3A6E` | Debt path, information states, links |
| `--accent-amethyst` | `#5B2D8E` | Tags, partner badges, categories |
| `--accent-ruby` | `#A61D3A` | Errors, blocked, critical, failed, overdue |
| `--accent-amber` | `#C47A1A` | Warnings, attention needed, Distribution phase |
| `--accent-chartreuse` | `#7BA31E` | New items, recently added |
| `--accent-gold` | `#D4AF37` | Gate passage, completion celebrations |

### Phase Colors

| Phase | Name | Color | Usage |
|-------|------|-------|-------|
| Phase 1 | Acquisition | `#1B6B4A` (emerald) | Phase 1 column header, cards, progress bars |
| Phase 2 | Preparation | `#1A8B7A` (teal) | Phase 2 column header, cards, progress bars |
| Phase 3 | Path-Specific | Varies by path | Tokenization: `#1A8B7A`, Fractional: `#1B6B4A`, Debt: `#1E3A6E` |
| Phase 4 | Distribution/Servicing | `#C47A1A` (amber) | Phase 4 column header, cards, progress bars |

### Value Path Colors

| Path | Color | Light BG | Label |
|------|-------|----------|-------|
| Fractional Securities | `#1B6B4A` | `rgba(27,107,74,0.15)` | Emerald pill |
| Tokenization | `#1A8B7A` | `rgba(26,139,122,0.15)` | Teal pill |
| Debt Instruments | `#1E3A6E` | `rgba(30,58,110,0.15)` | Sapphire pill |

### Status Badge Variants

| Status | Color | Style |
|--------|-------|-------|
| `not_started` | `#64748b` | Gray pill, muted text |
| `in_progress` | `#1A8B7A` | Teal pill, white text |
| `complete` | `#1B6B4A` | Emerald pill, white text |
| `blocked` | `#A61D3A` | Ruby pill, white text |
| `skipped` | `#475569` | Dark gray pill, strikethrough text |
| `on_hold` | `#C47A1A` | Amber pill, white text |
| `superseded` | `#475569` | Dark gray pill, italic text |

### Risk Level Indicators

| Level | Color | Icon |
|-------|-------|------|
| Low | `#1B6B4A` | Green dot |
| Moderate | `#C47A1A` | Amber dot |
| High | `#A61D3A` | Red dot |
| Critical | `#A61D3A` | Red pulsing dot |

### Typography

| Token | Font | Weight | Size |
|-------|------|--------|------|
| `--font-display` | Cormorant Garamond | 600 | 28-36px -- page titles only |
| `--font-heading` | DM Sans | 600 | 18-24px -- section headers |
| `--font-body` | DM Sans | 400 | 14-16px -- body text |
| `--font-label` | DM Sans | 500 | 12-14px -- labels, badges |
| `--font-mono` | JetBrains Mono | 400 | 12-14px -- reference codes, IDs, step numbers |
| `--font-small` | DM Sans | 400 | 11-12px -- timestamps, metadata |

### Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | 4px | Tight padding (inside badges) |
| `--space-sm` | 8px | Inner padding (card internals) |
| `--space-md` | 16px | Standard padding (card padding, gaps) |
| `--space-lg` | 24px | Section gaps, large padding |
| `--space-xl` | 32px | Page margins, major section breaks |
| `--space-2xl` | 48px | Hero section padding |

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 4px | Badges, small pills |
| `--radius-md` | 8px | Cards, inputs, buttons |
| `--radius-lg` | 12px | Modals, panels |
| `--radius-full` | 9999px | Avatars, dots, pill tabs |

### Shadow System

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-card` | `0 1px 3px rgba(0,0,0,0.3)` | Card elevation |
| `--shadow-panel` | `0 4px 12px rgba(0,0,0,0.4)` | Panels, dropdowns |
| `--shadow-modal` | `0 8px 32px rgba(0,0,0,0.6)` | Modals, slide-overs |

---

## 4. GLOBAL SHELL & NAVIGATION

### Layout Structure

```
+----+---------------------------------------------------+
|    |  HEADER BAR (56px height)                         |
| S  +---------------------------------------------------+
| I  |                                                   |
| D  |  MAIN CONTENT AREA                                |
| E  |  (scrollable, full remaining height)              |
| B  |                                                   |
| A  |                                                   |
| R  |                                                   |
|    |                                                   |
| 64 |                                                   |
| px |                                                   |
|    |                                                   |
+----+---------------------------------------------------+
```

### Left Sidebar

**Width:** 64px collapsed (icon-only) | 240px expanded
**Behavior:** Collapsed by default on screens < 1280px. Toggle button at top. Remembers state in localStorage.
**Background:** `--bg-primary` with `--border-default` right border

**Elements (top to bottom):**

```
[Element: SidebarToggle]
  - Hamburger icon (collapsed) / X icon (expanded)
  - Positioned at top of sidebar
  - Click: toggles sidebar width with 200ms ease transition

[Element: LogoMark]
  - PleoChrome gem icon (collapsed) | "PleoChrome Powerhouse" text + icon (expanded)
  - Height: 48px
  - Bottom border divider

[Element: NavGroup — Primary]
  [NavItem: Pipeline]
    - Icon: LayoutGrid (kanban)
    - URL: /crm
    - Active indicator: 3px left border in --accent-teal, bg --bg-tertiary
    - Tooltip on hover when collapsed: "Pipeline"

  [NavItem: Assets]
    - Icon: Gem (diamond/gem shape)
    - URL: /crm/assets
    - Badge: total active asset count (e.g., "3")

  [NavItem: Partners]
    - Icon: Handshake
    - URL: /crm/partners

  [NavItem: Documents]
    - Icon: FileText
    - URL: /crm/documents
    - Badge: count of pending required documents (if > 0, ruby color)

  [NavItem: Tasks]
    - Icon: CheckSquare
    - URL: /crm/tasks
    - Badge: overdue task count (ruby color if > 0)

  [NavItem: Meetings]
    - Icon: Calendar
    - URL: /crm/meetings

[Element: NavGroup — Monitoring]
  [NavItem: Activity]
    - Icon: Clock
    - URL: /crm/activity

  [NavItem: Compliance]
    - Icon: ShieldCheck
    - URL: /crm/compliance
    - Badge: count of items needing attention (amber if > 0, ruby if critical)

  [NavItem: Team]
    - Icon: Users
    - URL: /crm/team

[Element: NavGroup — Configuration]
  [NavItem: Templates]
    - Icon: Puzzle (or Layers)
    - URL: /crm/templates

  [NavItem: Settings]
    - Icon: Settings (gear)
    - URL: /crm/settings

[Element: QuickAction — bottom of sidebar]
  [Button: "New Asset"]
    - Icon: Plus
    - Full-width when expanded, icon-only when collapsed
    - Background: --accent-teal
    - Click: opens New Asset Wizard (/crm/assets/new)
    - Tooltip when collapsed: "New Asset"

[Element: UserSection — very bottom]
  [Avatar: CurrentUser]
    - 32px circular avatar
    - When expanded: avatar + name + role
    - Click: opens user dropdown (Profile, Settings, Logout)
```

**NavItem Interaction States:**
- Default: `--text-secondary`, no background
- Hover: `--text-primary`, `--bg-tertiary` background, 150ms transition
- Active (current page): `--text-primary`, 3px left border accent, `--bg-secondary` background
- Badge: 18px circle, right-aligned, `--accent-ruby` background for urgent, `--text-muted` background for informational

### Header Bar

**Height:** 56px
**Background:** `--bg-secondary` with `--border-default` bottom border
**Layout:** Flex row, items center, space-between

**Left Section:**
```
[Element: Breadcrumb]
  - Dynamic based on current page
  - Format: "Pipeline" or "Assets > Emerald Barrel #017093" or "Partners > Bull Blockchain Law"
  - Separator: " > " in --text-muted
  - Each segment is a link (except the last, which is plain text)
  - Font: --font-body, --text-secondary for segments, --text-primary for current
```

**Center Section (Pipeline Board only):**
```
[Element: PathFilter]
  - Three pill tabs + "All" tab
  - Layout: horizontal pill group with 2px gap
  - Background: --bg-tertiary (container), --bg-primary (inactive pill), path color (active pill)
  - Labels: "All" | "Fractional" | "Tokenization" | "Debt"
  - Active pill: filled with path color, white text
  - Animated sliding indicator: 200ms ease, width matches active pill
  - Colors: All = --text-primary on --bg-tertiary, Fractional = emerald, Tokenization = teal, Debt = sapphire
  - Click: filters pipeline board columns to show only phases for that path
    - "All" shows all 4 columns (shared phases show combined, path-specific phases show per path)
    - Selecting a path shows: Phase 1 (Acquisition) | Phase 2 (Preparation) | Phase 3 (Path-Specific) | Phase 4 (Distribution/Servicing)
```

**Right Section:**
```
[Element: SearchTrigger]
  - Icon: Search (magnifying glass)
  - Placeholder text (when expanded): "Search assets, partners, documents..."
  - Click: opens Command Palette (Cmd+K)
  - Keyboard shortcut displayed: "Cmd+K" in --text-muted badge

[Element: ThemeToggle]
  - Icon: Sun (light mode) / Moon (dark mode)
  - Click: toggles between dark and light themes
  - Default: dark mode

[Element: NotificationBell]
  - Icon: Bell
  - Badge: unread count (ruby if > 0)
  - Click: opens Notification Center slide-in panel from right
  - Hover: subtle scale(1.05)

[Element: UserAvatar]
  - 32px circular avatar with 2px border
  - Click: opens dropdown menu
    - [MenuItem] "Shane Pierson" -- name, non-interactive header
    - [MenuItem] "CEO" -- role, non-interactive subheader
    - [Divider]
    - [MenuItem] "Profile" -- link to /crm/settings#profile
    - [MenuItem] "Settings" -- link to /crm/settings
    - [Divider]
    - [MenuItem] "Sign Out" -- triggers auth signout
```

---

## 5. PAGE 1: PIPELINE BOARD

**URL:** `/crm` (also accessible at `/crm/pipeline`)
**Purpose:** Bird's-eye view of all assets across the governance pipeline. The main screen users see every day. The "mission control" view.
**Data Source:** `v_pipeline_board` database view

### Stats Ribbon

**Layout:** 4 cards in a horizontal row, equal width, 16px gap
**Position:** Fixed at top of main content area, below header
**Height:** 80px per card

```
[Card: TotalPipelineAUM]
  - Label: "Total Pipeline AUM" -- --font-label, --text-secondary, uppercase
  - Value: "$9.65M" -- --font-heading, 24px, --text-primary, formatted with commas
  - Trend: "+$2.1M this month" or "-$500K this month"
    - Positive: --accent-emerald text with up-arrow icon
    - Negative: --accent-ruby text with down-arrow icon
  - Background: --bg-secondary
  - Left border: 3px --accent-teal

[Card: ActiveAssets]
  - Label: "Active Assets" -- same style
  - Value: "3" -- large number
  - Badge: "1 new this month" -- --accent-chartreuse badge
  - Background: --bg-secondary
  - Left border: 3px --accent-emerald

[Card: AvgDaysToClose]
  - Label: "Avg Days in Pipeline" -- same style
  - Value: "47" -- large number
  - Subtext: sparkline chart showing last 6 months trend (48px wide, 24px tall)
    - Rendered as inline SVG, --accent-teal stroke, no fill
  - Background: --bg-secondary
  - Left border: 3px --accent-amber

[Card: ComplianceScore]
  - Label: "Compliance Score" -- same style
  - Value: "87%" -- large number
  - Visual: circular progress ring (32px diameter)
    - Track: --border-default
    - Fill: green (90%+), amber (70-89%), ruby (<70%)
    - Animated on load: 0 to current value over 600ms
  - Tooltip: "Score = % of required governance steps fully documented across all active assets"
  - Background: --bg-secondary
  - Left border: 3px matching score color
```

### Filter Bar

**Position:** Below stats ribbon, 16px gap
**Layout:** Flex row, items center, 8px gap, wrapping on narrow screens

```
[Element: PathFilter] -- (duplicated here if not in header, OR synced with header)
  - Already described in Header Bar center section
  - On the Pipeline Board, this is prominently displayed in the center of the header

[Element: AssetTypeFilter]
  - Type: shadcn Select dropdown
  - Options: "All Types" (default) | "Gemstone" | "Real Estate" | "Precious Metal" | "Mineral Rights" | "Other"
  - Width: 180px
  - Icon: Gem icon prefix

[Element: StatusFilter]
  - Type: shadcn Select dropdown
  - Options: "All Statuses" (default) | "Active" | "Blocked" | "On Hold" | "Complete"
  - Width: 160px

[Element: TeamFilter]
  - Type: shadcn Select dropdown
  - Options: "All Team" (default) | [avatar + name for each team member]
  - Width: 180px

[Element: SearchBar]
  - Type: text input with search icon
  - Placeholder: "Search by name, reference, or holder..."
  - Width: 280px
  - Behavior: filters cards in real-time as user types (debounced 300ms)
  - Clear button (X) appears when text is entered
```

### Kanban Board

**Layout:** Horizontal scrollable container with 4 columns (or variable based on path filter)
**Column width:** Min 320px, flex-grow to fill available space, max 420px
**Column gap:** 16px
**Board padding:** 16px on all sides
**Scroll:** Horizontal scroll when columns exceed viewport. Vertical scroll within each column for cards.

**Column Configuration by Path Filter:**

| Filter | Columns |
|--------|---------|
| All | Phase 1: Acquisition | Phase 2: Preparation | Phase 3: Mixed (shows path badge on each card) | Phase 4: Mixed |
| Fractional | Phase 1: Acquisition | Phase 2: Preparation | Phase 3: Securities Structuring | Phase 4: Distribution & Management |
| Tokenization | Phase 1: Acquisition | Phase 2: Preparation | Phase 3: Tokenization | Phase 4: Distribution |
| Debt | Phase 1: Acquisition | Phase 2: Preparation | Phase 3: Loan Structuring | Phase 4: Capital & Servicing |

**Column Structure:**

```
[Element: KanbanColumn]
  - Width: min 320px, flex
  - Background: --bg-primary (slightly darker than page)
  - Border-radius: --radius-lg (top only)
  - Overflow-y: auto (vertical scroll for cards)
  - Max-height: calc(100vh - header - stats - filters - padding)

  [Element: ColumnHeader]
    - Height: 48px
    - Background: --bg-secondary
    - Top border: 4px solid [phase color]
    - Border-radius: --radius-lg (top corners only)
    - Layout: flex row, space-between, items center
    - Padding: 0 16px
    - Left side:
      - Phase name: --font-heading, 16px, --text-primary
      - Phase subtitle: --font-small, --text-muted (e.g., "Building the Pipeline")
    - Right side:
      - Asset count badge: circular, 24px, --bg-tertiary, --text-secondary
        - e.g., "2" for 2 assets in this phase

  [Element: ColumnContent]
    - Padding: 8px
    - Gap: 8px between cards
    - Vertical scroll if cards overflow
```

### Asset Card (within Kanban Column)

```
[Element: AssetCard]
  - Background: --bg-secondary
  - Border: 1px --border-default
  - Border-left: 4px solid [phase color]
  - Border-radius: --radius-md
  - Padding: 12px 16px
  - Cursor: pointer
  - Min-height: 160px

  [Row 1: Reference]
    - Text: "PC-2026-001" -- --font-mono, 11px, --text-muted
    - Right-aligned: Days in phase badge
      - Format: "12d" (12 days)
      - Background: --bg-tertiary
      - Color: --text-muted (normal), --accent-amber (>30 days), --accent-ruby (>60 days)

  [Row 2: Asset Name]
    - Text: "Emerald Barrel #017093" -- --font-heading, 16px, --text-primary
    - Truncate with ellipsis if > 1 line
    - Font-weight: 600

  [Row 3: Badges]
    - Layout: flex row, 6px gap, flex-wrap
    - [Badge: AssetType] "Gemstone" -- --accent-amethyst background, white text, 11px
    - [Badge: ValuePath] "Tokenization" -- path color background, white text, 11px
    - [Badge: Status] "Active" or "Blocked" -- status color

  [Row 4: Value]
    - Text: "$9.65M" -- --font-heading, 20px, --text-primary
    - Subtext: "Offering Value" -- --font-small, --text-muted
    - If no offering value yet: "$10-18M est." in --text-secondary

  [Row 5: Progress Bar]
    - Full-width progress bar, 6px height, --radius-full
    - Track: --border-default
    - Fill: [phase color], width = (completed steps / total steps in current phase) * 100%
    - Right text: "4/10 steps" -- --font-small, --text-muted

  [Row 6: Current Step]
    - Text: "Step 2.4 -- Sequential Appraisals" -- --font-small, --text-secondary
    - Icon prefix: play icon (in-progress) or check (complete) or alert-triangle (blocked)

  [Row 7: Footer]
    - Layout: flex row, space-between, items center
    - Left: Team member avatars (stacked, max 3, 24px each with -8px overlap)
      - Hover on stack: tooltip with all assigned names
    - Center: Risk indicator dot (8px circle)
      - Green: low risk
      - Amber: moderate risk
      - Red: high or critical risk
    - Right: Document count icon + number (e.g., file-icon "12")

  [Interaction: Hover]
    - Border-color: [phase color] at 40% opacity
    - Transform: scale(1.01)
    - Box-shadow: --shadow-card
    - Transition: all 150ms ease

  [Interaction: Click]
    - Opens Asset Slide-Over panel (see Global Overlays)
    - OR navigates to /crm/assets/[asset_id] (configurable in settings: "slide-over" or "full page")

  [Interaction: Drag]
    - NOT supported. Assets advance through governance gates, not manual drag.
    - If user attempts to drag: brief tooltip appears -- "Assets advance through gate checks"
```

### Empty Column State

```
[Element: EmptyColumn]
  - Center-aligned content within the column
  - [Illustration] Subtle gem outline icon, 48px, --text-muted at 30% opacity
  - [Text] "No assets in [Phase Name]" -- --font-body, --text-muted
  - [Button] "Create new asset" -- ghost button, --accent-teal text
    - Only shown in Phase 1 column
    - Click: opens New Asset Wizard
```

### Pipeline Board -- Keyboard Navigation

| Key | Action |
|-----|--------|
| `Tab` | Move focus between cards |
| `Enter` | Open focused card (slide-over or navigate) |
| `Arrow Left/Right` | Move focus between columns |
| `Arrow Up/Down` | Move focus between cards within a column |
| `Cmd+K` | Open command palette |
| `N` | Open New Asset Wizard (when no input is focused) |

---

## 6. PAGE 2: ASSET DETAIL VIEW

**URL:** `/crm/assets/[asset_id]`
**Purpose:** Complete view of a single asset -- its governance progress, documents, tasks, activity, and all associated data. This is the primary working page for managing an asset through the pipeline.
**Data Source:** `assets` table + all related tables via `asset_id` foreign key

### Hero Section

**Height:** Auto (approximately 200px)
**Background:** Subtle gradient from --bg-secondary to --bg-primary
**Padding:** 24px 32px

```
[Element: Breadcrumb]
  - "Pipeline > Assets > Emerald Barrel #017093"
  - Each segment linked except current (last)
  - Style: --font-small, --text-muted, hover --text-secondary

[Row 1: Reference + Status]
  - Layout: flex row, items center, 12px gap
  - [Text: Reference] "PC-2026-001" -- --font-mono, 14px, --text-muted
  - [Badge: Status] "In Progress" -- status color badge
    - States: "In Progress" (teal), "Blocked" (ruby), "Complete" (gold), "On Hold" (amber), "Terminated" (gray)
  - [Badge: Priority] "High Priority" -- optional, only if flagged
    - Background: --accent-ruby at 15%, --accent-ruby text

[Row 2: Asset Name]
  - [Text] "Emerald Barrel #017093" -- --font-display (Cormorant Garamond), 32px, --text-primary
  - Editable on click (inline edit with save/cancel)

[Row 3: Badges + Holder]
  - Layout: flex row, items center, 8px gap
  - [Badge: AssetType] "Gemstone" -- --accent-amethyst
  - [Badge: ValuePath] "Tokenization" -- path color
  - [Separator] " | " in --text-muted
  - [Link: Holder] "White Oak Partners II LLC" -- --text-secondary, hover --accent-teal
    - Click: navigates to the holder's contact record (future)
    - Icon: external-link if linking to contact page

[Row 4: Key Metrics Inline]
  - Layout: flex row, items center, 24px gap
  - Each metric:
    - Label: --font-small, --text-muted, uppercase
    - Value: --font-body, --text-primary, bold
  - Metrics displayed:
    - "Appraised: $18.3M" (if available, else "--")
    - "Offering: $9.65M" (if available)
    - "Raised: $0" (if in distribution phase)
    - "Investors: 0" (if in distribution phase)
    - Metrics that are not yet applicable show as "--" in --text-muted

[Row 5: Team + Actions]
  - Layout: flex row, space-between, items center
  - Left: Assigned team members
    - Avatar stack (32px each, -8px overlap, max 5)
    - Hover: tooltip with name + role
    - [Link] "+ Manage" -- --text-muted, hover --accent-teal
    - Click "Manage": opens team assignment modal
  - Right: Action buttons
    - [Button: "Edit Asset"] -- ghost/outline style, --text-secondary
    - [Button: "Add Document"] -- ghost/outline, --text-secondary, icon: upload
    - [Button: "Add Note"] -- ghost/outline, --text-secondary, icon: message-square
    - [Button: "Export Audit Trail"] -- ghost/outline, --text-secondary, icon: download
      - Click: triggers PDF/CSV export of all activity for this asset
    - [DropdownTrigger: "More"] -- three-dot menu
      - [MenuItem] "Archive Asset"
      - [MenuItem] "Change Value Path" (with confirmation dialog)
      - [MenuItem] "Duplicate Asset" (creates copy with blank progress)
```

### Phase Timeline (Horizontal)

**Position:** Below hero section, full-width
**Height:** 80px
**Background:** --bg-secondary with --border-default top/bottom borders

```
[Element: PhaseTimeline]
  - Layout: flex row, justify-evenly, items center
  - Padding: 16px 32px
  - 4 phase nodes connected by lines

  [Element: PhaseNode] (repeated for each phase)
    - Layout: vertical stack, items center
    - Width: flexible, equal distribution

    [Circle/Diamond]
      - Size: 40px diameter
      - States:
        - Completed: filled with phase color, white checkmark icon inside
        - Current: phase color border (3px), pulsing glow animation (keyframe: opacity 0.4 to 1.0, 2s ease-in-out infinite)
        - Upcoming: dashed border (2px), --border-default color
        - Blocked: solid border (3px), --accent-ruby, warning-triangle icon inside
      - Click: scrolls the tab content below to that phase's governance steps

    [Phase Name]
      - Text below circle: "1. Acquisition" -- --font-label, 12px
      - Color: --text-primary (completed/current), --text-muted (upcoming)

    [Step Count]
      - Text below name: "8/8 steps" -- --font-small, 11px, --text-muted
      - Color: --accent-emerald if complete, --text-secondary if current, --text-muted if upcoming

  [Element: ConnectingLine] (between each pair of nodes)
    - Height: 2px
    - Position: horizontally centered between nodes, vertically centered on circles
    - Style:
      - Completed segments: solid line, phase color
      - Current-to-next: dashed line, --border-default
      - Future segments: dashed line, --border-default at 50% opacity
```

### Tab Navigation

**Position:** Below phase timeline
**Style:** shadcn Tabs component, bottom-border variant
**Padding:** 0 32px

```
[Element: TabBar]
  - Layout: flex row, 0 gap
  - Border-bottom: 1px --border-default

  [Tab: "Overview"] -- default active
  [Tab: "Governance"] -- main working view, badge with "X blocked" if any
  [Tab: "Documents"] -- badge with pending count
  [Tab: "Tasks"] -- badge with overdue count
  [Tab: "Activity"] -- no badge
  [Tab: "Gates"] -- no badge
  [Tab: "Financials"] -- no badge
  [Tab: "Partners"] -- no badge

  Each tab:
    - Padding: 12px 20px
    - Font: --font-label, 13px
    - Color: --text-muted (inactive), --text-primary (active)
    - Active indicator: 2px bottom border in --accent-teal
    - Hover (inactive): --text-secondary, --bg-tertiary background
    - Badge (if present): 16px circle, right of label text, --accent-ruby
```

### Tab: Overview

**Purpose:** At-a-glance summary of the asset's key data across all domains.
**Layout:** Responsive grid -- 2 columns on medium screens, 3 columns on wide screens
**Gap:** 16px
**Padding:** 24px 32px

```
[Card: Holder Information]
  - Header: "Asset Holder" with users icon
  - Fields:
    - Name: "White Oak Partners II LLC" -- --text-primary, linked
    - Principal: "Emiel A. Kandi" -- --text-secondary
    - Entity Type: "LLC" -- badge
    - KYC Status: badge -- "Verified" (green), "Pending" (amber), "Failed" (ruby), "Expired" (ruby)
    - KYC Verified Date: "2026-04-15" -- --text-muted
    - OFAC Status: "Clear" -- green badge
    - OFAC Screened Date: "2026-04-15" -- --text-muted
    - PEP Status: "Clear" -- green badge
    - Engagement Agreement: "Signed" (green badge) or "Pending" (amber badge)
    - Enhanced DD Required: "Yes" with ruby warning badge if true
      - Reason shown below if true: --text-muted, italic
  - Footer link: "View full KYC record" -- --accent-teal

[Card: Certification]
  - Header: "Certification" with award icon
  - Fields:
    - GIA Reports: "1 of 1 received" with count badge
      - Each report: report number (linked to gia.edu verification URL), stone description, grade summary
    - SSEF Reports: count or "Not required"
    - Total Stones Certified: "150" -- --text-primary
    - Total Carat Weight: "4,500 ct" -- --text-primary
    - Certification Complete: green check or amber pending
    - Certification Cost: "$25,000" -- --text-secondary
  - Footer link: "View all certification documents" -- --accent-teal

[Card: Appraisals]
  - Header: "Appraisals" with scale icon
  - Fields:
    - For each of 3 appraisers:
      - Appraiser name + credentials badge (CGA, USPAP)
      - Value: "$9,500,000" -- --text-primary
      - Date: "2026-06-15" -- --text-muted
      - USPAP Compliant: green check
    - Variance: "7.37%" -- green if < 15%, amber if 15-20%, ruby if > 20%
    - Offering Value: "$9,650,000" -- --font-heading, 18px, --text-primary, highlighted with --bg-tertiary background
    - Methodology: "Average of two lowest" -- --text-muted, italic
  - Footer link: "View appraisal documents" -- --accent-teal

[Card: Custody]
  - Header: "Custody & Insurance" with lock icon
  - Fields:
    - Current Vault: "Brink's Diamond & Jewelry" -- --text-primary, linked to partner
    - Location: "New York, NY" -- --text-secondary
    - Receipt Number: "BRK-2026-XXXXX" -- --font-mono
    - Insured Value: "$10,000,000" -- --text-primary
    - Insurance Carrier: "Lloyd's of London" -- --text-secondary
    - Insurance Expires: "2027-07-20" -- date
      - If < 30 days: amber background, warning icon
      - If expired: ruby background, alert icon
    - PoR Status: "Active" green badge or "Inactive" amber badge
    - API Feed Active: green check or red X
  - Previous Custody: collapsible section listing prior vaults
  - Footer link: "View custody documents" -- --accent-teal

[Card: Legal]
  - Header: "Legal & SPV" with gavel icon
  - Fields:
    - SPV Name: "PleoChrome Series A LLC" -- --text-primary
    - SPV Type: "Wyoming Series LLC" -- badge
    - EIN: "XX-XXXXXXX" -- --font-mono
    - Formation Date: "2026-05-01" -- --text-muted
    - PPM Version: "1.0" + date -- linked to document
    - Counsel: "Bull Blockchain Law" -- linked to partner
    - Regulatory Framework: "Reg D 506(c)" -- badge
    - Form D Status: "Filed" (green) or "Not Filed" (amber) or "Overdue" (ruby)
    - MSB Classification: "Exempt" -- badge
  - Footer link: "View legal documents" -- --accent-teal

[Card: Path-Specific Summary]
  - Header varies by path:
    - Tokenization: "Tokenization" with code icon
    - Fractional: "Securities" with layers icon
    - Debt: "Loan" with banknote icon
  - Fields for Tokenization:
    - Platform: "Brickken" -- linked to partner
    - Token Standard: "ERC-3643" -- badge
    - Blockchain: "Polygon" -- badge
    - Contract Address: "0x1a2b...3c4d" -- --font-mono, truncated, copy button
    - Total Tokens: "965,000" / Minted: "0"
    - Token Price: "$10.00"
    - Token Symbol: "PLEO-A"
    - Smart Contract Audit: "CertiK -- Clean" (green) or "Pending" (amber)
    - PoR Feed: "Active" (green) or "Not configured" (gray)
  - Fields for Fractional:
    - Transfer Agent: name, linked to partner
    - BD: name, linked to partner
    - Total Units / Issued: "9,650 / 0"
    - Min Investment: "$100,000"
    - Investors Onboarded: "0"
    - Cap Table: "View cap table" link
  - Fields for Debt:
    - Lender: name, linked to partner or contact
    - Loan Amount: "$5,000,000"
    - LTV Ratio: "52%" -- green if < 60%, amber if 60-70%, ruby if > 70%
    - Interest Rate: "14% APR"
    - Term: "24 months"
    - Maturity Date: "2028-07-01"
    - UCC-1 Status: "Filed" (green) / "Pending" (amber)
    - Payment Status: "Current" (green) / "Past Due" (ruby)
  - Footer link: "View path details" -- --accent-teal

[Card: Risk Register]
  - Header: "Risk Register" with alert-triangle icon
  - List of identified risks:
    - Each risk: severity badge (critical/high/moderate/low) + description (truncated) + status badge (monitoring/mitigated/resolved)
  - If no risks: "No risks identified" in --text-muted
  - Footer link: "View all risks" or "Add risk" -- --accent-teal
```

### Tab: Governance (Primary Working View)

**Purpose:** The step-by-step governance workflow. This is where the team does their daily work -- completing tasks, uploading documents, requesting approvals, and passing gates.
**Layout:** Single column, full width
**Padding:** 24px 32px

**Structure:** Organized by Phase, then by Governance Step within each phase. Gate checks appear between phases.

```
[Element: PhaseSection] (repeated for each phase: 1, 2, 3, 4)
  - Collapsible section
  - Default state: current phase expanded, completed phases collapsed, upcoming phases collapsed

  [Element: PhaseSectionHeader]
    - Layout: flex row, items center, 12px gap
    - Click: toggles expand/collapse with 200ms ease transition
    - [Chevron] Right (collapsed) / Down (expanded) -- --text-muted
    - [PhaseNumber] "Phase 2" -- --font-mono, --text-muted
    - [PhaseName] "Preparation: Certification & Valuation" -- --font-heading, 18px, --text-primary
    - [ProgressBadge] "6/10 steps complete" -- pill badge, phase color
    - [StatusBadge] "In Progress" -- status badge
    - Background: --bg-secondary, bottom-border --border-default
    - Padding: 16px

  [Element: StepList] (within expanded phase)
    - Vertical list, 0 gap (steps touch each other with dividers)

    [Element: GovernanceStep] (repeated for each step)
      - Two states: collapsed (summary row) and expanded (full detail)

      [Collapsed View — Summary Row]
        - Layout: flex row, items center
        - Height: 52px
        - Padding: 12px 16px
        - Border-bottom: 1px --border-default
        - Background: --bg-primary
        - Hover: --bg-secondary
        - Click: toggles expand/collapse

        [Left Section]
          - [StepNumber] "2.4" -- --font-mono, 14px, --text-muted, 36px fixed width
          - [StepTitle] "Sequential 3-Appraisal Process" -- --font-body, --text-primary
          - [StatusBadge] -- one of:
            - "Not Started" (gray)
            - "In Progress" (teal)
            - "Complete" (emerald + checkmark)
            - "Blocked" (ruby + X)
            - "Skipped" (gray, strikethrough on title)

        [Right Section]
          - [TaskProgress] "3/5 tasks" -- --font-small, --text-muted, icon: check-square
          - [DocProgress] "2/3 documents" -- --font-small, --text-muted, icon: file
          - [ApprovalStatus] "Awaiting review" or "Approved by Chris" -- --font-small
            - Amber if awaiting, green if approved, ruby if rejected
          - [Chevron] -- --text-muted

      [Expanded View — Full Detail]
        - Background: --bg-secondary
        - Padding: 16px 16px 24px 16px
        - Border-left: 4px solid [phase color]
        - Animated expand: max-height transition 300ms ease

        [Section: Regulatory Basis]
          - Style: callout box with info icon
          - Background: --bg-tertiary
          - Border: 1px --border-default
          - Border-left: 3px --accent-sapphire
          - Padding: 12px 16px
          - Icon: info-circle, --accent-sapphire
          - Text: "Required by [regulatory basis]. [Citation text with link to source]"
          - Font: --font-small, --text-secondary
          - Example: "Sequential independent appraisals are required to establish fair market value for Reg D 506(c) offerings. Each appraiser must work independently with sealed prior values to prevent valuation contamination. (USPAP Standard 8)"
          - Link text is --accent-teal, opens in new tab

        [Section: Tasks]
          - Header: "Tasks" with checklist icon + count badge
          - Vertical list of task items

          [Element: TaskItem]
            - Layout: flex row, items center, 8px gap
            - Height: 40px
            - Padding: 4px 12px

            [Checkbox]
              - Unchecked: --border-default border, --bg-input fill
              - Checked: --accent-emerald fill, white checkmark
              - Click: marks task complete, logs in activity, updates progress

            [TypeIcon] -- 16px, positioned before title
              - Action: play-circle (--accent-teal)
              - Upload: upload-cloud (--accent-sapphire)
              - Review: eye (--accent-amethyst)
              - Approval: shield-check (--accent-amber)
              - Automated: zap (--accent-chartreuse)

            [TaskTitle]
              - Text: "Contact first USPAP appraiser and schedule" -- --font-body, --text-primary
              - If completed: --text-muted with strikethrough

            [AssigneeAvatar]
              - 24px circle, right margin
              - If unassigned: dashed circle with "+" icon
              - Click: opens assignee picker dropdown

            [DueDate]
              - Text: "Apr 15" -- --font-small
              - Color: --text-muted (normal), --accent-amber (due today), --accent-ruby (overdue)

            [StatusBadge]
              - Same as step status variants
              - Additional: "Overdue" badge (ruby) if past due

            [ExpandArrow]
              - Click: expands task to show description, evidence link, notes
              - Expanded content:
                - Description text: --font-small, --text-secondary
                - Evidence/link: linked URL if any
                - Notes: text input for task-specific notes
                - Completion info (if complete): "Completed by Shane on 2026-04-15 at 14:30"

          [Button: "Add custom task"]
            - Ghost button, --text-muted, icon: plus
            - Click: inline form appears (title, type, assignee, due date)
            - Custom tasks are always associated with the current governance step

        [Section: Documents]
          - Header: "Required Documents" with file icon + count badge
          - List of required document slots

          [Element: DocumentSlot]
            - Two states: uploaded and missing

            [Uploaded Document]
              - Layout: flex row, items center
              - [TypeBadge] -- colored by category (certification=emerald, legal=amber, appraisal=teal)
              - [Filename] "gia-report-017093-2026.pdf" -- --font-body, --text-primary
              - [Version] "v2" -- --font-small, --text-muted badge
              - [Date] "2026-05-20" -- --font-small, --text-muted
              - [UploadedBy] avatar, 20px
              - [Actions]
                - Preview (eye icon) -- opens inline preview or modal
                - Download (download icon) -- direct download
                - Replace (refresh icon) -- uploads new version, preserves old
                - Lock (lock icon) -- applies legal hold, prevents deletion
                  - If locked: lock icon is filled, --accent-ruby color
                  - Locked documents show "Legally held" badge
              - Background: --bg-tertiary

            [Missing Document]
              - Layout: dashed border box, --border-default
              - [TypeLabel] "GIA Grading Report" -- --text-muted, italic
              - [StatusLabel] "Required" -- ruby badge
              - [UploadZone]
                - "Drop file here or click to upload" -- --text-muted
                - Drag state: border becomes --accent-teal, background gains slight teal tint
                - Click: opens file browser
                - After upload: transitions to Uploaded Document state

          [Button: "Add document"]
            - Ghost button, --text-muted, icon: plus
            - Click: opens file browser with document type selector

        [Section: Approvals]
          - Header: "Required Approvals" with shield icon
          - Only shown if the step has approval requirements

          [Element: ApprovalItem]
            - [ApproverInfo] Name + role (e.g., "Chris Ramsey -- CRO")
            - [Status]
              - Pending: amber badge, "Awaiting review"
              - Approved: green badge, "Approved on [date]"
              - Rejected: ruby badge, "Changes requested on [date]"
            - [Notes] If rejected: notes from approver shown below, --text-secondary
            - [Action Button]
              - If current user is the approver: "Approve" (green) and "Request Changes" (amber) buttons
              - If not: "Request Approval" button (sends notification to approver)

        [Section: Comments / Notes]
          - Header: "Notes" with message-square icon
          - Threaded comment list
          - Each comment:
            - [Avatar] 28px
            - [AuthorName] -- --font-label, --text-primary
            - [Timestamp] -- --font-small, --text-muted (e.g., "2 hours ago")
            - [Text] -- --font-body, --text-secondary
            - [ReplyButton] -- "Reply" link, --text-muted
            - Replies indented 32px with left border --border-default
          - [Input: "Add note"]
            - Text area, auto-expanding
            - "Post" button (--accent-teal)
            - Supports @mentions (triggers search for team member names)

        [Section: Step Activity Log]
          - Header: "Activity for this step" with clock icon
          - Filtered chronological entries for this step only
          - Compact view: timestamp + user + action, one line each
          - "View in full activity log" link at bottom

  [Element: GateCheck] (between PhaseSection groups)
    - Full-width card, prominent styling
    - Background: --bg-secondary
    - Border: 2px solid [gate color based on status]
    - Border-radius: --radius-lg
    - Padding: 20px 24px
    - Margin: 24px 0

    [Header Row]
      - Layout: flex row, items center, 12px gap
      - [Icon] Shield (24px)
        - OPEN: --text-muted
        - READY: --accent-gold, pulsing glow
        - PASSED: --accent-emerald
      - [GateName] "GATE G3 -- VERIFICATION GATE" -- --font-heading, 16px, uppercase
      - [StatusBadge]
        - "OPEN" -- gray/muted
        - "READY" -- gold, pulsing subtle border glow animation
        - "PASSED" -- emerald with checkmark

    [Conditions Checklist]
      - Vertical list, each condition on its own row
      - [Element: GateCondition]
        - [Icon] Check-circle (green) or X-circle (red) or minus-circle (gray/pending)
        - [Text] "All lab reports received and verified" -- --text-primary
        - [Auto-Check Label] "(Auto-evaluated)" in --text-muted if the system checks this automatically
        - Auto-evaluated conditions check data in real-time (e.g., count of uploaded GIA reports >= expected count)
        - Manual conditions show as checkboxes for authorized team members

    [Action Section]
      - Only visible when gate status is READY or when all conditions are green

      [Button: "Pass Gate"]
        - Style: primary button, --accent-gold background, dark text
        - Disabled state: grayed out when any condition is not met
        - Enabled state: gold background with subtle shine/shimmer animation
        - Click flow:
          1. Confirmation dialog: "Are you sure you want to pass Gate G3? This action is permanent and will be logged."
          2. User confirms
          3. Gate status -> PASSED
          4. Immutable gate_checks record created
          5. Asset's current phase advances
          6. Activity log entry created
          7. Notifications sent to team
          8. Kanban board updates in real-time (card moves columns)
          9. Success toast: "Gate G3 passed. Asset advanced to Phase 3."

    [Passed Gate Record]
      - Only shown when status = PASSED
      - "This gate was passed on [date] at [time] by [person] -- all [X] conditions were met."
      - --text-secondary, italic
      - Cannot be edited or reversed
```

### Tab: Documents

**Purpose:** All documents associated with this asset, organized for browse and upload.
**Layout:** Filter bar + document grid/list

```
[Filter Bar]
  - Layout: flex row, items center, 8px gap, flex-wrap
  - [Select: Type] "All Types" | "GIA Report" | "Appraisal" | "PPM" | "Insurance Certificate" | "Subscription Agreement" | "Legal Opinion" | "Board Resolution" | ...
  - [Select: Phase] "All Phases" | "Phase 1" | "Phase 2" | "Phase 3" | "Phase 4"
  - [Select: Status] "All" | "Uploaded" | "Missing/Required" | "Expired" | "Locked"
  - [SearchInput] "Search documents..." -- filters by filename, type, or content

[Element: UploadZone]
  - Position: top of document area, collapsible
  - Height: 80px (when visible)
  - Style: dashed border, --border-default, centered text
  - Text: "Drag files here to upload, or click to browse" -- --text-muted
  - Drag state: border becomes solid --accent-teal, background tints
  - After file selection:
    1. Document type suggestion: "This looks like a GIA Report. Is that correct?" with dropdown to change
    2. Step association: "Associate with Step 2.1 -- GIA Lab Submission?" with dropdown to change
    3. "Upload" button
  - Supports multi-file upload

[View Toggle]
  - [Button: Grid] -- icon: grid (cards with previews)
  - [Button: List] -- icon: list (table rows)

[Grid View]
  - Responsive grid: 4 columns on wide, 3 on medium, 2 on narrow
  - [Element: DocumentCard]
    - Background: --bg-secondary
    - Border: 1px --border-default
    - Padding: 16px
    - [TypeBadge] -- colored by category at top
    - [Preview] -- first page thumbnail for PDFs, image preview for images, file icon for others
      - 160px height, contained fit
    - [Filename] "gia-report-017093.pdf" -- --font-body, --text-primary, truncated
    - [Version] "v2" -- badge if version > 1
    - [Meta] "Uploaded by Shane on Apr 15" -- --font-small, --text-muted
    - [StepRef] "Step 2.1" -- --font-mono, --text-muted
    - [LockIcon] -- visible if locked, --accent-ruby
    - [Actions on hover] Preview | Download | Replace
    - Click: opens document preview modal

[List View]
  - shadcn Table component
  - Columns:
    - Type (badge) -- 120px
    - Filename -- flex
    - Version -- 60px
    - Step -- 80px, --font-mono
    - Uploaded By -- avatar + name, 160px
    - Date -- 100px
    - Size -- 80px
    - Status -- 80px (badge: active/locked/expired)
    - Actions -- 120px (icon buttons: preview, download, replace, lock)
  - Sortable by any column
  - Row hover: --bg-tertiary

[Missing Documents Section]
  - If any required documents are missing, show a callout:
  - Background: --accent-ruby at 10%
  - Border-left: 3px --accent-ruby
  - Header: "X required documents missing" -- --accent-ruby
  - List of missing document types with their step references
  - Each row has an "Upload" button
```

### Tab: Tasks

**Purpose:** All tasks for this asset across all phases and steps.
**Layout:** Filter bar + grouped task list

```
[Filter Bar]
  - [Select: Status] "All" | "Open" | "Completed" | "Overdue" | "Blocked"
  - [Select: Phase] "All Phases" | "Phase 1" | "Phase 2" | ...
  - [Select: Assignee] "All" | [team member names]
  - [Select: Priority] "All" | "Urgent" | "High" | "Medium" | "Low"

[Task List — Grouped by Phase, then Step]
  - [PhaseGroup Header] "Phase 2: Preparation" -- --font-heading, 14px, collapsible
    - [StepGroup Header] "Step 2.4 -- Sequential Appraisals" -- --font-label, 13px, indented
      - [TaskItem] -- same as described in Governance tab
        - But here includes: Phase column, Step column, Priority badge
      - [TaskItem]
    - [StepGroup Header] "Step 2.5 -- Variance Analysis"
      - [TaskItem]

[Summary Stats Banner]
  - Position: top of task list, below filters
  - Layout: flex row, 24px gap
  - [Stat] "X Open" -- --text-primary
  - [Stat] "X Overdue" -- --accent-ruby
  - [Stat] "X Due Today" -- --accent-amber
  - [Stat] "X Completed This Week" -- --accent-emerald
  - [Stat] "X Blocked" -- --accent-ruby
```

### Tab: Activity

**Purpose:** Complete immutable audit trail for this asset.

```
[Filter Buttons]
  - Pill group: "All" | "Documents" | "Steps" | "Gates" | "Tasks" | "Comments"
  - Active pill: --accent-teal, others --bg-tertiary

[Element: ActivityFeed]
  - Vertical list, chronological (newest first)
  - Infinite scroll (loads 50 at a time)

  [Element: ActivityEntry]
    - Layout: flex row, 12px gap
    - Left: colored dot (8px) + vertical connecting line to next entry
      - Document actions: --accent-sapphire dot
      - Step actions: --accent-emerald dot
      - Gate actions: --accent-gold dot
      - Task actions: --accent-amethyst dot
      - Alert/error: --accent-ruby dot
    - Right: content
      - [Timestamp] "2026-03-29 14:32:15 UTC" -- --font-mono, 11px, --text-muted
      - [UserInfo] avatar (20px) + "Shane Pierson" -- --font-label, --text-primary
      - [Action] "uploaded GIA Grading Report" -- --font-body, --text-secondary
      - [Detail] "Report #2186543921, file: GIA-017093-2026.pdf" -- --font-small, --text-muted
      - [StepRef] "Step 2.1" -- --font-mono, 11px, linked to step in Governance tab

  [Important: NO edit or delete controls anywhere on this feed]
  - The feed is append-only
  - Activity entries are rendered as read-only

[Export Button]
  - Position: top-right of tab content
  - Text: "Export Audit Trail"
  - Click: opens export dialog
    - Format: PDF or CSV
    - Date range: all or custom
    - Filter: all types or selected types
    - "Generate Export" button
```

### Tab: Gates

**Purpose:** History of all gate check records for this asset.

```
[Element: GateRecordList]
  - Vertical list of gate check records, chronological

  [Element: GateRecord]
    - Background: --bg-secondary
    - Border: 1px --border-default
    - Border-left: 4px [status color]
    - Padding: 16px
    - Margin-bottom: 12px

    [Header]
      - [GateID] "G3" -- --font-mono, 14px, --text-muted
      - [GateName] "VERIFICATION GATE" -- --font-heading, 16px
      - [StatusBadge] "PASSED" (green) | "FAILED" (ruby) | "PENDING" (gray)

    [ConditionsList]
      - Each condition: check/X icon + text + pass/fail
      - All in a compact list

    [Result Details]
      - If PASSED: "Passed on [date] at [time] by [person]. All [X] conditions met."
      - If FAILED: "Failed on [date] at [time] by [person]. [X] conditions not met."
        - Blockers listed with resolution notes
      - Style: --text-secondary, --font-small

    [Notes]
      - Any notes attached to the gate check
      - Read-only
```

### Tab: Financials

**Purpose:** Cost tracking, fee calculations, and revenue projections for this asset.

```
[Section: Fee Summary]
  - Based on offering value and revenue model from portal-data.ts
  - Cards:
    - [Card: Setup Fee] 2% of offering value = calculated amount
    - [Card: Success Fee] 1.5% of capital raised = calculated amount
    - [Card: Admin Fee] 0.75%/yr of AUM = calculated amount
    - [Card: Path-Specific Fees] vary by path (secondary trading fee, origination fee, servicing fee, etc.)

[Section: Cost Tracking]
  - Table with columns: Category | Estimated | Actual | Variance | Status
  - Categories from CostLine data:
    - Legal (PPM, SEC filings, counsel)
    - Certification (GIA, SSEF)
    - Appraisal (3 appraisers)
    - Custody (vault, insurance)
    - Tokenization/Securities (platform, audit, BD)
    - Regulatory Filings (Form D, blue sky)
    - Marketing
    - Other
  - Each row: editable "Actual" field with running total
  - Total row at bottom with highlight

[Section: Revenue Projection]
  - Year 1-5 projection table
  - Based on: offering value, success rate, fee structure, admin fee, path-specific revenue
  - Read-only calculated fields
  - "Edit Assumptions" button opens modal to adjust projection inputs
```

### Tab: Partners

**Purpose:** Which partners are assigned to this asset, their modules, and management controls.

```
[Partner List]
  - Vertical list of assigned partners

  [Element: AssignedPartnerRow]
    - Layout: flex row, items center
    - [PartnerLogo/Icon] -- 40px
    - [PartnerName] -- --text-primary, linked to partner detail page
    - [TypeBadge] "Tokenization Platform" or "Vault" or "BD" etc.
    - [DDStatus] badge: "Complete" (green) | "In Progress" (amber) | "Not Started" (gray)
    - [ActiveModule] "Brickken ERC-3643 Module" -- --text-secondary
    - [Actions]
      - "View DD Report" -- link
      - "Switch Module" -- button (opens module swap flow)
      - "Remove Partner" -- ghost button, --accent-ruby (with confirmation)

[Button: "Add Partner"]
  - Opens partner selection modal
  - Search/filter available partners
  - Select partner -> select module -> confirm
  - New partner tasks are added to relevant governance steps

[Module Swap Flow]
  - Triggered by "Switch Module" button
  - [Step 1: Select New Module]
    - Shows available modules for the same function
    - e.g., "Brickken ERC-3643" -> "Zoniqx ERC-7518" or "Rialto In-House"
  - [Step 2: Impact Preview]
    - "Switching from Brickken ERC-3643 Module to Zoniqx TPaaS Module"
    - "3 Brickken-specific tasks will be marked 'Superseded'"
    - "4 Zoniqx-specific tasks will be created"
    - Lists specific tasks being removed/added
    - Warning: "Completed tasks from the old module will be preserved in history"
  - [Step 3: Confirm]
    - "Confirm Switch" button
    - On confirm:
      1. Old module tasks marked "Superseded" (preserved, not deleted)
      2. New module tasks created and linked to governance steps
      3. Activity log entry with full before/after details
      4. Notification to team members
```

---

## 7. PAGE 3: ASSET LIST VIEW

**URL:** `/crm/assets`
**Purpose:** Table/grid view of all assets with sorting, filtering, bulk actions, and export.

### Header

```
[Row 1]
  - [Title] "Assets" -- --font-display, 28px
  - [Right: Actions]
    - [Button: "New Asset"] -- primary, --accent-teal
    - [Button: "Export"] -- ghost, icon: download
    - [Toggle: ViewMode] Grid (icon) | Table (icon)
```

### Filter Bar

```
[Layout: flex row, 8px gap, flex-wrap]
  - [Select: Value Path] "All Paths" | "Fractional" | "Tokenization" | "Debt"
  - [Select: Asset Type] "All Types" | "Gemstone" | "Real Estate" | "Precious Metal" | "Mineral Rights" | "Other"
  - [Select: Phase] "All Phases" | "Phase 1" | "Phase 2" | "Phase 3" | "Phase 4" | "Complete"
  - [Select: Status] "All" | "Active" | "Blocked" | "On Hold" | "Complete" | "Terminated"
  - [Select: Team Member] "All" | [team member options]
  - [DateRange] Date range picker for "created date" or "last activity"
  - [SearchInput] "Search by name, reference, holder..." -- 280px
  - [Button: "Clear Filters"] -- ghost, --text-muted (visible when any filter active)
```

### Table View

```
[Element: AssetsTable]
  - shadcn Table component
  - Sortable columns (click header to sort, click again to reverse)
  - Current sort indicated by arrow icon in column header

  Columns:
  | Column | Width | Content |
  |--------|-------|---------|
  | Checkbox | 40px | Bulk selection checkbox |
  | Reference | 120px | "PC-2026-001" -- --font-mono, linked |
  | Name | flex | Asset name -- --text-primary, bold, linked to detail |
  | Type | 100px | Asset type badge |
  | Path | 120px | Value path badge (colored) |
  | Phase | 140px | Phase name + number |
  | Current Step | 180px | Step number + title, truncated |
  | Value | 120px | "$9.65M" -- right-aligned |
  | Holder | 160px | Name, linked |
  | Days | 60px | Days in pipeline -- color-coded |
  | Status | 100px | Status badge |
  | Compliance | 80px | "87%" with color indicator |
  | Actions | 80px | Three-dot dropdown: View, Edit, Archive |

  Row interactions:
  - Hover: --bg-tertiary background
  - Click row: navigate to Asset Detail
  - Click checkbox: select for bulk actions

[Element: BulkActions]
  - Appears when 1+ rows selected
  - Fixed bar at bottom of table
  - Background: --bg-tertiary
  - Text: "X assets selected"
  - [Button: "Export Selected"] -- CSV/PDF options
  - [Button: "Assign Team Member"] -- opens assignment modal
  - [Button: "Change Status"] -- opens status dropdown
  - [Button: "Deselect All"] -- ghost
```

### Grid View

```
[Element: AssetsGrid]
  - Responsive grid: 4 cols on xl, 3 on lg, 2 on md, 1 on sm
  - Gap: 16px

  [Element: AssetGridCard]
    - Same as AssetCard from Pipeline Board but with additional fields:
      - Holder name below value
      - Compliance percentage badge
      - Days in pipeline badge
    - Click: navigates to Asset Detail
```

### Pagination

```
[Element: Pagination]
  - Position: bottom of table/grid
  - Layout: flex row, space-between
  - Left: "Showing 1-20 of 47 assets"
  - Right: Page number pills + Previous/Next buttons
  - Page sizes: 20 (default), 50, 100
```

---

## 8. PAGE 4: PARTNERS DIRECTORY

**URL:** `/crm/partners`
**Purpose:** Browse, filter, and manage all external partners.

### Header

```
[Title] "Partners" -- --font-display, 28px
[Right] [Button: "Add Partner"] -- primary, --accent-teal
[Toggle: ViewMode] Grid | List
```

### Filter Bar

```
[Select: Type] "All Types" | "Vault" | "BD/Placement" | "Counsel" | "Tokenization Platform" | "Appraiser" | "Transfer Agent" | "KYC Provider" | "Insurance" | "ATS" | "Other"
[Select: DD Status] "All" | "Not Started" | "In Progress" | "Complete"
[Select: Risk Level] "All" | "Low" | "Moderate" | "High"
[SearchInput] "Search partners..." -- 240px
```

### Partner Grid

```
[Element: PartnerCard]
  - Background: --bg-secondary
  - Border: 1px --border-default
  - Border-radius: --radius-md
  - Padding: 20px
  - Width: min 280px
  - Cursor: pointer
  - Click: navigate to Partner Detail

  [Row 1: Identity]
    - [LogoArea] 48px square, --bg-tertiary, partner logo or initials
    - [Name] "Bull Blockchain Law" -- --font-heading, 16px, --text-primary
    - [TypeBadge] "Counsel" -- colored by category

  [Row 2: DD Status]
    - [DDStatusBadge] "Complete" (green) | "In Progress" (amber) | "Not Started" (gray)
    - [RiskLevel] "Low Risk" -- green dot + text, or "Moderate Risk" -- amber, or "High Risk" -- red
    - [DDScore] "8.5/10" -- --font-mono if available

  [Row 3: Functions]
    - Layout: flex row, flex-wrap, 4px gap
    - Badges for each function: "Securities Law" "PPM Drafting" "SEC Filing" -- --accent-amethyst at 15%, small pills

  [Row 4: Stats]
    - "2 active modules" -- --text-muted
    - "Active on 1 asset" -- --text-muted
    - "Last contact: Mar 15" -- --text-muted

  [Row 5: Quick Actions]
    - [Button: "View DD Report"] -- ghost, small
    - [Button: "Add Note"] -- ghost, small
    - [Button: "Edit"] -- ghost, small

  Hover: scale(1.01), --shadow-card
```

---

## 9. PAGE 5: PARTNER DETAIL

**URL:** `/crm/partners/[partner_id]`
**Purpose:** Full partner profile including DD summary, modules, history, and associated assets.

### Hero Section

```
[Breadcrumb] "Partners > Bull Blockchain Law"

[Row 1: Identity]
  - [Logo] 64px, --bg-tertiary
  - [Name] "Bull Blockchain Law" -- --font-display, 28px
  - [TypeBadge] "Counsel"
  - [Website] linked URL if available

[Row 2: Status]
  - [DDStatus] "DD Complete" -- green badge
  - [RiskLevel] "Low Risk" -- green dot + text
  - [DDScore] "8.5/10" -- --font-mono, large

[Row 3: Functions Covered]
  - Badge row: "Securities Law" "PPM Drafting" "SEC Filing" "MSB Counsel" "Blue Sky Filings"

[Row 4: Contact Info]
  - Primary contact name, email, phone
  - "Edit" button
```

### Tab Navigation

```
[Tab: "DD Summary"] -- default
[Tab: "Modules"]
[Tab: "Meeting History"]
[Tab: "Contacts"]
[Tab: "Documents"]
[Tab: "Assets"]
[Tab: "Activity"]
```

### Tab: DD Summary

```
[Section: Key Findings]
  - Rich text summary of due diligence findings
  - Editable (with version history)

[Section: Strengths]
  - Bulleted list of identified strengths

[Section: Risks]
  - Bulleted list of identified risks with severity badges

[Section: Recommendation]
  - Text field: "Recommended for engagement" or "Proceed with caution" or "Do not engage"
  - Backed by DD score calculation
```

### Tab: Modules

```
[Element: ModuleList]
  - All partner modules this partner provides

  [Element: ModuleCard]
    - [ModuleName] "Bull Blockchain Law -- PPM + Form D Module"
    - [Description] -- --text-secondary
    - [Functions] badges
    - [ValuePaths] which paths this module applies to
    - [TaskCount] "8 tasks in this module"
    - [ActiveOn] "Active on 1 asset" with linked asset names
    - [Version] "v1.0"
    - [ExpandButton] shows full task list mapped to governance steps
```

### Tab: Meeting History

```
[Element: MeetingTimeline]
  - Chronological list, newest first
  - Each entry:
    - Date + time
    - Title
    - Attendees (avatars)
    - Summary preview (2 lines)
    - Action items count
    - Click: opens meeting detail
  - [Button: "Log Meeting"] -- add new meeting note for this partner
```

### Tab: Contacts

```
[Element: ContactList]
  - People at this partner organization
  - Each: name, title, email, phone, last contact date
  - [Button: "Add Contact"]
```

### Tab: Documents

```
[Element: DocumentList]
  - DD reports, contracts, proposals, NDAs, correspondence
  - Same document list component as Asset Detail Documents tab
  - Filtered to this partner
```

### Tab: Assets

```
[Element: AssetList]
  - Table of assets this partner is assigned to
  - Columns: Reference, Name, Phase, Module Active, Role
  - Click: navigates to asset detail
```

### Tab: Activity

```
[Element: ActivityFeed]
  - All activity entries related to this partner
  - Same ActivityEntry component as Asset Detail Activity tab
  - Filtered to partner-related events
```

---

## 10. PAGE 6: DOCUMENT LIBRARY

**URL:** `/crm/documents`
**Purpose:** Central document repository across all assets and partners. Global search and management.

### Header

```
[Title] "Document Library" -- --font-display, 28px
[Right]
  - [Button: "Upload"] -- primary, --accent-teal, icon: upload-cloud
  - [Toggle: ViewMode] Grid | List
[StorageStats]
  - "[X] documents | [Y.Z] GB used | [N] locked" -- --font-small, --text-muted, right-aligned
```

### Search & Filters

```
[Element: SearchBar]
  - Full-width, prominent
  - Icon: search
  - Placeholder: "Search by filename, document type, or content..."
  - Full-text search across filenames and metadata
  - Debounced 300ms

[Filter Bar]
  - [Select: Document Type] "All Types" | "GIA Report" | "Appraisal" | "PPM" | "Insurance Certificate" | "Legal Opinion" | "Subscription Agreement" | "Board Resolution" | "Meeting Transcript" | "DD Report" | "Contract" | "NDA" | "Other"
  - [Select: Asset] "All Assets" | [asset name options]
  - [Select: Partner] "All Partners" | [partner name options]
  - [Select: Phase] "All Phases" | "Phase 1" | "Phase 2" | "Phase 3" | "Phase 4"
  - [Select: Uploaded By] "All" | [team member options]
  - [DateRange] Date range picker
  - [Select: Status] "All" | "Active" | "Locked" | "Superseded"
```

### Upload Zone

```
[Element: GlobalUploadZone]
  - Position: below filters, collapsible (collapsed by default, expanded when "Upload" button clicked)
  - Drag-and-drop area, 120px height
  - "Drag files here or click to browse"
  - Multi-file support
  - After file selection:
    1. AI-suggested document type based on filename
    2. Asset association dropdown
    3. Step association dropdown (filtered by selected asset)
    4. Optional: partner association
    5. "Upload" button per file, or "Upload All" batch button
```

### Document Table/Grid

```
[Table Columns]
  - Type (badge) -- 120px
  - Filename -- flex, linked
  - Version -- 60px ("v2")
  - Asset -- 180px, linked to asset
  - Step -- 80px, --font-mono
  - Partner -- 140px (if associated with partner)
  - Uploaded By -- avatar + name, 140px
  - Date -- 100px
  - Size -- 80px
  - Lock Status -- 60px (lock icon if locked, --accent-ruby)
  - Actions -- 120px
    - Preview (eye)
    - Download (download)
    - Version History (clock) -- opens modal with all versions
    - Lock/Unlock (lock/unlock toggle)

[Grid View]
  - Same card layout as Asset Detail Documents tab Grid View
  - Includes asset name badge on each card
```

---

## 11. PAGE 7: TASK DASHBOARD

**URL:** `/crm/tasks`
**Purpose:** Cross-asset task management. What needs to be done across ALL assets. The "to-do" view.

### Header

```
[Title] "Tasks" -- --font-display, 28px
[Right]
  - [Toggle: ViewMode] List | Board | Calendar
  - [Button: "New Task"] -- primary (opens task creation modal)
```

### Summary Stats Bar

```
[Layout: flex row, 5 stat cards, equal width, 8px gap]
  - [Stat: Open] "12 Open" -- --text-primary, white number on --bg-secondary
  - [Stat: Overdue] "3 Overdue" -- --accent-ruby number
  - [Stat: DueToday] "5 Due Today" -- --accent-amber number
  - [Stat: CompletedThisWeek] "8 Completed This Week" -- --accent-emerald number
  - [Stat: Blocked] "2 Blocked" -- --accent-ruby number
```

### Filter Bar

```
[Select: Status] "All" | "Open" | "Completed" | "Overdue" | "Blocked"
[Select: Asset] "All Assets" | [asset name options]
[Select: Phase] "All Phases" | [phase options]
[Select: Assignee] "All" | "My Tasks" | [team member options]
[Select: Priority] "All" | "Urgent" | "High" | "Medium" | "Low"
[Select: Due Date] "All" | "Overdue" | "Due Today" | "Due This Week" | "Due This Month"
[Select: Task Type] "All" | "Action" | "Upload" | "Review" | "Approval" | "Automated"
[Select: Grouping] "By Asset" (default) | "By Assignee" | "By Phase" | "By Priority" | "By Due Date"
```

### List View

```
[Task List — Grouped by selected grouping option]

[Element: GroupHeader]
  - Group name: "Emerald Barrel #017093" (by asset) or "Shane Pierson" (by assignee) or "Phase 2" (by phase)
  - Task count in group
  - Collapsible
  - Open/overdue count badge if > 0

[Element: TaskRow]
  - Layout: flex row, items center
  - Height: 44px
  - Padding: 8px 16px
  - Border-bottom: 1px --border-default
  - Hover: --bg-tertiary

  [Checkbox] -- quick complete (marks task as done)
  [PriorityDot] -- 8px circle: urgent=ruby, high=amber, medium=sapphire, low=gray
  [TypeIcon] -- 16px: action/upload/review/approval/automated
  [TaskTitle] -- --font-body, --text-primary (strikethrough if completed)
  [AssetName] -- --font-small, --text-muted, linked (when not grouping by asset)
  [StepRef] -- "Step 2.4" -- --font-mono, 11px, --text-muted
  [AssigneeAvatar] -- 24px circle
  [DueDate] -- --font-small, color-coded: --text-muted (normal), --accent-amber (today), --accent-ruby (overdue)
  [StatusBadge] -- same as step status variants
  [QuickActions on hover]
    - Complete (check icon)
    - Reassign (user-plus icon)
    - Add note (message icon)
    - View in context (external-link -- navigates to the step in the asset's Governance tab)
```

### Board View (Kanban by Status)

```
[Columns]
  - "To Do" (not_started)
  - "In Progress" (in_progress)
  - "Blocked" (blocked)
  - "Done" (complete)

[Cards]
  - Compact task cards within each column
  - Title, asset name (small), step ref, assignee avatar, due date
  - Drag-and-drop supported between columns (status change)
  - Drop triggers: status change + activity log entry
```

### Calendar View

```
[Element: CalendarGrid]
  - Month view (default) with week/day toggles
  - Tasks displayed as dots/chips on their due dates
  - Color-coded by priority
  - Click a date: shows task list for that day in a side panel
  - Click a task: opens task detail modal
  - Overdue tasks highlighted with ruby background on past dates
```

### Task Creation Modal

```
[Element: NewTaskModal]
  - Triggered by "New Task" button
  - Fields:
    - Title (required) -- text input
    - Description -- text area
    - Asset (required) -- select dropdown with search
    - Step (required) -- select dropdown, filtered by selected asset
    - Type -- select: Action | Upload | Review | Approval | Automated
    - Assignee -- select dropdown with team member avatars
    - Priority -- select: Urgent | High | Medium | Low
    - Due Date -- date picker
  - [Button: "Create Task"] -- primary
  - [Button: "Cancel"] -- ghost
```

---

## 12. PAGE 8: MEETINGS

**URL:** `/crm/meetings`
**Purpose:** Meeting records with summaries, transcripts, action items, and partner/asset associations.

### Header

```
[Title] "Meetings" -- --font-display, 28px
[Right] [Button: "Log Meeting"] -- primary, --accent-teal
```

### Filter Bar

```
[SearchInput] "Search meetings..."
[Select: Asset] "All Assets" | [asset options]
[Select: Partner] "All Partners" | [partner options]
[DateRange] Date range picker
```

### Meeting List

```
[Element: MeetingList]
  - Chronological, newest first
  - Infinite scroll

  [Element: MeetingCard]
    - Background: --bg-secondary
    - Border: 1px --border-default
    - Padding: 16px
    - Margin-bottom: 8px
    - Cursor: pointer
    - Click: navigates to /crm/meetings/[meeting_id]

    [Row 1]
      - [DateBadge] "Mar 15, 2026 | 2:00 PM PST" -- --font-mono, 12px, --text-muted
      - [DurationBadge] "45 min" -- --text-muted
    [Row 2]
      - [Title] "Rialto Markets Intro Call" -- --font-heading, 16px, --text-primary
    [Row 3]
      - [Attendees] avatar stack (max 5, 24px each) + "Shane, David, Rialto Team"
    [Row 4]
      - [Associations]
        - [AssetBadge] "Emerald Barrel #017093" -- linked, if associated
        - [PartnerBadge] "Rialto Markets" -- linked, if associated
    [Row 5]
      - [SummaryPreview] First 2 lines of summary -- --text-secondary, truncated
    [Row 6]
      - [ActionItems] "3 open / 5 total action items" -- --font-small, --text-muted
      - [Attachments] paperclip icon + count if > 0
```

### Meeting Detail

**URL:** `/crm/meetings/[meeting_id]`

```
[Breadcrumb] "Meetings > Rialto Markets Intro Call"

[Header]
  - [Date] "March 15, 2026, 2:00 PM PST" -- --text-muted
  - [Title] "Rialto Markets Intro Call" -- --font-display, 28px
  - [Attendees] Full avatar + name list
  - [Associations] Asset link + Partner link
  - [Actions]
    - [Button: "Edit"] -- ghost
    - [Button: "Delete"] -- ghost, --accent-ruby (with confirmation)

[Section: Summary]
  - Rich text editor / display
  - Editable with save button
  - Version history available

[Section: AI Summary]
  - Auto-generated when transcript is provided
  - Styled as a callout box with AI icon
  - Background: --bg-tertiary
  - "Key Topics:" bulleted list
  - "Decisions Made:" bulleted list
  - "Next Steps:" bulleted list
  - [Button: "Regenerate"] -- ghost, if transcript exists

[Section: Full Transcript]
  - Collapsible section (collapsed by default)
  - Pre-formatted text block
  - --font-small, --text-secondary
  - Speaker labels in --text-primary, bold

[Section: Action Items]
  - Each action item is linked to a task in the task system
  - [Element: ActionItem]
    - Checkbox + title + assignee + due date + status
    - "Create as Task" button for items not yet linked
    - Linked items show the task reference

[Section: Recording]
  - If recording URL provided: audio/video player embed
  - Or link to external recording

[Section: Attachments]
  - File list with download links
  - Upload button to add attachments
```

### New Meeting Form

```
[Element: NewMeetingForm]
  - Fields:
    - Date/Time (required) -- datetime picker
    - Title (required) -- text input
    - Attendees -- multi-select of team members + free text for external
    - Associated Asset -- select (optional)
    - Associated Partner -- select (optional)
    - Duration -- number input (minutes)
    - Summary -- rich text editor
    - Transcript -- large text area ("Paste transcript here")
    - Recording URL -- text input (optional)
    - Attachments -- file upload zone
  - [Button: "Save Meeting"] -- primary
  - [Button: "Save & Generate AI Summary"] -- secondary (enabled when transcript has content)
```

---

## 13. PAGE 9: ACTIVITY / AUDIT TRAIL

**URL:** `/crm/activity`
**Purpose:** Global immutable audit trail across ALL assets, partners, and team actions. This is the compliance-grade evidence chain.

### Header

```
[Title] "Activity Log" -- --font-display, 28px
[Subtitle] "Immutable audit trail -- records cannot be edited or deleted" -- --font-small, --text-muted
[Right]
  - [Button: "Export Audit Trail"] -- primary, icon: download
    - Click: opens export dialog
      - Date range picker
      - Filter by: asset, partner, team member, action type
      - Format: PDF or CSV
      - "Generate Export" button
      - Note: "For investor/regulator audit purposes"
```

### Stats Bar

```
[Layout: flex row, 3 stat cards]
  - [Stat] "47,832 Total Events" -- --text-primary
  - [Stat] "124 Events Today" -- --text-primary
  - [Stat] "892 Events This Week" -- --text-primary
```

### Filter Bar

```
[SearchInput] "Search activity..." -- full-text search across action descriptions
[Select: Asset] "All Assets" | [asset options]
[Select: Partner] "All Partners" | [partner options]
[Select: Team Member] "All" | [team member options]
[Select: Action Type] "All" | "Document" | "Step" | "Gate" | "Task" | "Comment" | "Status Change" | "Partner" | "System"
[DateRange] Date range picker -- default: last 30 days
```

### Activity Feed

```
[Element: GlobalActivityFeed]
  - Same ActivityEntry component as Asset Detail Activity tab
  - But includes asset name badge on each entry (since this is cross-asset)
  - Infinite scroll, loads 50 entries at a time
  - Each entry:
    - Colored type dot
    - Precise timestamp (full UTC)
    - User avatar + name
    - Action description
    - Asset reference (linked)
    - Partner reference (linked, if applicable)
    - Step reference (linked, if applicable)
    - Detail text (expandable for full JSON changes record)

[CRITICAL: NO edit or delete controls on this page. No "delete" in the three-dot menu. No "edit" button. This feed is permanently read-only.]
```

---

## 14. PAGE 10: TEAM

**URL:** `/crm/team`
**Purpose:** Internal team directory with DD status, role assignments, and workload overview.

### Header

```
[Title] "Team" -- --font-display, 28px
[Right] [Button: "Invite Team Member"] -- primary, --accent-teal
```

### Team Grid

```
[Element: TeamMemberCard]
  - Background: --bg-secondary
  - Border: 1px --border-default
  - Padding: 20px
  - Width: min 280px
  - Cursor: pointer

  [Avatar] 64px circle, centered
  [Name] "Shane Pierson" -- --font-heading, 18px, --text-primary, centered
  [Role] "CEO" -- --font-label, --text-secondary, centered
  [DDStatus] "DD Complete" -- green badge, centered
  [RiskLevel] "Low Risk" -- green dot + text

  [Stats Row]
    - Layout: flex row, justify-evenly, border-top --border-default, padding-top 12px
    - [Stat] "12" label "Active Tasks" -- stacked, centered
    - [Stat] "3" label "Assets Assigned" -- stacked, centered
    - [Stat] "2" label "Overdue" -- stacked, centered, --accent-ruby if > 0

  [ContactInfo]
    - Email icon + email (linked)
    - Phone icon + phone

  Click: navigates to /crm/team/[member_id]
```

### Team Member Detail

**URL:** `/crm/team/[member_id]`

```
[Breadcrumb] "Team > Shane Pierson"

[Hero]
  - Avatar (96px), Name, Role, DD status, risk level
  - Contact info
  - [Button: "Edit Profile"] -- ghost

[Tab: "Profile"]
  - Full DD report summary
  - Background check status
  - Document links (DD report, background check)
  - Date joined, last active

[Tab: "Tasks"]
  - All tasks assigned to this team member across all assets
  - Same TaskRow component, grouped by asset

[Tab: "Assets"]
  - Assets assigned to this team member
  - Table: Reference, Name, Phase, Role on Asset

[Tab: "Activity"]
  - Activity feed filtered to this team member's actions
  - Same ActivityEntry component

[Tab: "Meetings"]
  - Meeting history for this team member
  - Same MeetingCard component
```

---

## 15. PAGE 11: GOVERNANCE TEMPLATES

**URL:** `/crm/templates`
**Purpose:** Manage the governance requirements (Layer 1) and partner modules (Layer 2). This is the configuration layer that defines how the CRM operates.

### Header

```
[Title] "Governance Templates" -- --font-display, 28px
[Subtitle] "Layer 1: Governance Requirements | Layer 2: Partner Modules" -- --font-small, --text-muted
```

### Section Toggle

```
[Element: SectionToggle]
  - Two large tabs: "Governance Requirements" | "Partner Modules"
  - Full-width, 48px height
  - Active: --accent-teal bottom border, --text-primary
  - Inactive: --text-muted
```

### Section A: Governance Requirements

**Purpose:** View and manage the immutable governance steps that form the pipeline. These are the regulatory requirements that every asset must pass through regardless of partner.

```
[Filter Bar]
  - [Select: Path Scope] "Shared (All Paths)" | "Fractional-Specific" | "Tokenization-Specific" | "Debt-Specific"
  - [Select: Phase] "All Phases" | "Phase 1" | "Phase 2" | "Phase 3" | "Phase 4"
  - [SearchInput] "Search requirements..."

[Requirement List — Organized by Path, then Phase, then Step]

[Element: PathGroup]
  - Header: "SHARED REQUIREMENTS (All Paths)" or "TOKENIZATION-SPECIFIC" etc.
  - Collapsible

  [Element: PhaseGroup]
    - Header: "Phase 2: Preparation" with step count badge
    - Collapsible

    [Element: RequirementRow]
      - Layout: flex row, items center
      - Height: 48px
      - Padding: 8px 16px
      - Border-bottom: 1px --border-default
      - Click: expand for full detail

      [StepNumber] "2.4" -- --font-mono, 36px fixed width
      [StepTitle] "Sequential 3-Appraisal Process" -- --font-body, --text-primary
      [PhaseBadge] "Phase 2" -- small badge
      [IsGate?] "Gate" badge (gold) -- only if this step is part of a gate check
      [RequiredDocs] "3 docs" -- --font-small, file icon
      [RequiredApprovals] "1 approval" -- --font-small, shield icon
      [DefaultTasks] "5 tasks" -- --font-small, checklist icon
      [Actions]
        - "Edit" -- icon button (modify requirements, not delete)
        - "Deactivate" -- icon button (marks as inactive, does not delete, audit logged)

    [Expanded RequirementDetail]
      - Background: --bg-secondary
      - Padding: 16px

      [Regulatory Citation]
        - The full legal/regulatory basis for this step
        - Source URL linked
        - Styled as info callout (same as Governance tab regulatory basis)

      [Default Tasks]
        - List of tasks that are created by default when this step is instantiated for an asset
        - Each: task title, type, description
        - These are the tasks that apply when no partner module overrides them

      [Required Documents]
        - List of document types required by this step
        - Each: document type name, required/optional badge

      [Required Approvals]
        - List of approvals required (e.g., "Securities counsel sign-off", "CRO approval")
        - Each: approver role, approval type

      [Gate Conditions (if applicable)]
        - List of conditions this step contributes to gate passage
        - Each: condition text, auto-evaluable (yes/no)

[Button: "Add Governance Requirement"]
  - Opens form: step number, title, phase, path scope, regulatory basis, tasks, documents, approvals
  - Activity logged

[Button: "Import from Template"]
  - Loads a standard template: "Reg D 506(c) Tokenization", "Reg D 506(c) Fractional", "Asset-Backed Lending", etc.
  - Shows preview of all steps that will be created
  - "Import" button
```

### Section B: Partner Modules

**Purpose:** View and manage partner task modules (Layer 2). These define how specific partners fulfill governance requirements.

```
[Filter Bar]
  - [Select: Partner] "All Partners" | [partner name options]
  - [Select: Function] "All Functions" | "BD" | "ATS" | "Transfer Agent" | "Tokenization" | "KYC" | "Vault" | "Counsel" | "Appraiser"
  - [Select: Value Path] "All Paths" | "Fractional" | "Tokenization" | "Debt"
  - [SearchInput] "Search modules..."

[Module List — Grouped by Partner]

[Element: PartnerModuleGroup]
  - Header: "Bull Blockchain Law" with partner type badge
  - Collapsible

  [Element: ModuleCard]
    - Background: --bg-secondary
    - Border: 1px --border-default
    - Padding: 16px
    - Margin-bottom: 8px

    [Row 1]
      - [ModuleName] "Bull Blockchain -- PPM + Form D Module" -- --font-heading, 16px
      - [Version] "v1.0" -- --font-mono badge

    [Row 2]
      - [Description] "Complete legal document package for Reg D 506(c) tokenized offerings" -- --text-secondary

    [Row 3: Badges]
      - [Functions] "Securities Law" "PPM" "Form D" -- amethyst badges
      - [Paths] "Tokenization" "Fractional" -- path color badges

    [Row 4: Stats]
      - "8 tasks" | "Active on 2 assets" | "Last updated: Mar 20"

    [Expand Button]
      - Shows full task list with governance step mapping

    [Expanded: Task-to-Step Mapping]
      - Table:
        | Task | Governance Step | Replaces Default? |
        |------|----------------|-------------------|
        | "Draft PPM" | Step 2.9 | Yes (replaces generic "Draft legal docs") |
        | "SEC compliance review" | Step 2.9 | Extends (adds to defaults) |
        | "File Form D on EDGAR" | Step 4.1 | Yes |
      - Each row shows whether the module task replaces or extends the default governance tasks

    [Actions]
      - "Edit Module" -- opens module editor
      - "Clone Module" -- creates a copy for modification
      - "Deactivate" -- marks inactive (audit logged)

[Button: "Create Module"]
  - Multi-step wizard:
    1. Name, description, partner, functions, value paths
    2. Map tasks to governance steps (search/select governance steps, add tasks)
    3. For each task: define if it replaces or extends the default tasks
    4. Review and save

[Button: "Clone Module"]
  - Select source module
  - New name, new partner
  - Creates a copy with all task mappings
  - Edit as needed
```

---

## 16. PAGE 12: COMPLIANCE DASHBOARD

**URL:** `/crm/compliance`
**Purpose:** Proactive compliance monitoring. What is expiring, what needs renewal, what is overdue. The "don't get caught" view.
**Data Source:** `v_compliance_dashboard` database view

### Header

```
[Title] "Compliance Dashboard" -- --font-display, 28px
[Subtitle] "Proactive monitoring of compliance deadlines, expirations, and requirements" -- --font-small, --text-muted
```

### Alert Summary

```
[Layout: 3 cards, horizontal row]

[Card: Critical (Red)]
  - Background: --accent-ruby at 10%
  - Border-left: 4px --accent-ruby
  - Header: "CRITICAL" with alert-triangle icon, --accent-ruby
  - Count: "3 items" -- large number
  - Items listed:
    - "Vault insurance expires in 5 days -- Emerald Barrel #017093"
    - "KYC expired -- holder John Smith"
    - "Form D amendment overdue"

[Card: Warning (Amber)]
  - Background: --accent-amber at 10%
  - Border-left: 4px --accent-amber
  - Header: "ATTENTION" with alert-circle icon, --accent-amber
  - Count: "7 items"
  - Items listed:
    - "DD refresh due in 28 days -- Bull Blockchain Law"
    - "Insurance renewal in 25 days -- Diamond Lot #002"
    - etc.

[Card: Upcoming (Blue)]
  - Background: --accent-sapphire at 10%
  - Border-left: 4px --accent-sapphire
  - Header: "UPCOMING" with info icon, --accent-sapphire
  - Count: "12 items"
  - Items listed:
    - "Quarterly re-screening due Apr 15"
    - "Annual audit due May 1"
    - etc.
```

### Compliance Calendar

```
[Element: ComplianceCalendar]
  - Month view calendar
  - Events shown as colored dots/chips on dates:
    - Ruby: overdue/expired
    - Amber: expiring within 30 days
    - Sapphire: upcoming within 90 days
    - Emerald: completed/renewed
  - Click date: shows detail panel on right with all items for that date
  - Click item: navigates to relevant asset/partner/document
```

### Compliance Item Table

```
[Filter Bar]
  - [Select: Urgency] "All" | "Critical" | "Attention" | "Upcoming" | "Completed"
  - [Select: Type] "All" | "Insurance Expiry" | "KYC Expiry" | "DD Refresh" | "Filing Deadline" | "Re-appraisal" | "Annual Report"
  - [Select: Asset] "All Assets" | [options]
  - [Select: Partner] "All Partners" | [options]

[Table Columns]
  - Urgency (colored dot)
  - Item Type (badge)
  - Description
  - Asset/Partner (linked)
  - Deadline Date
  - Days Remaining (negative = overdue, styled ruby)
  - Assigned To (avatar)
  - Status ("Open" | "In Progress" | "Resolved")
  - Actions: "Resolve" | "Snooze" | "View Details"
```

---

## 17. PAGE 13: SETTINGS

**URL:** `/crm/settings`
**Purpose:** Application settings, user preferences, integrations, and data management.

### Navigation

```
[Left: SettingsNav]
  - Vertical list of setting sections
  - "Profile"
  - "Notifications"
  - "Integrations"
  - "Data Management"
  - "Security"
  - "Appearance"
  - Clicking a section scrolls the right panel to that section

[Right: SettingsContent]
  - Scrollable content area
```

### Section: Profile

```
[Avatar Upload] -- 96px circle, click to change
[Name] -- text input
[Email] -- text input (read-only, linked to Supabase Auth)
[Role] -- text display (set by admin)
[Phone] -- text input
[Bio] -- text area
[Button: "Save Changes"]
```

### Section: Notifications

```
[Notification Preferences]
  - Toggle rows for each event type:

  | Event | In-App | Email |
  |-------|--------|-------|
  | Task assigned to me | [on] | [on] |
  | Task overdue | [on] | [on] |
  | Document uploaded to my asset | [on] | [off] |
  | Gate ready for review | [on] | [on] |
  | Gate passed | [on] | [on] |
  | Approval requested from me | [on] | [on] |
  | Comment mentioning me | [on] | [off] |
  | Insurance expiry warning | [on] | [on] |
  | KYC expiry warning | [on] | [on] |
  | New asset created | [on] | [off] |
  | Meeting action item assigned | [on] | [off] |

  Each row: event description + in-app toggle + email toggle
  [Button: "Save Preferences"]
```

### Section: Integrations

```
[Card: Google Drive]
  - Status: "Connected" (green) or "Not Connected" (gray)
  - Connected account email
  - Sync folder path
  - [Button: "Connect"] or [Button: "Disconnect"]

[Card: Supabase]
  - Project reference (read-only, from env)
  - Region
  - Plan

[Card: Future Integrations]
  - Chainlink PoR Feed -- "Coming in Phase 2"
  - Tokenization Platform API -- "Coming in Phase 2"
  - DocuSign -- "Coming in Phase 2"
  - Each with "Notify me when available" toggle

[Card: API Keys]
  - For future external integrations
  - Generate/revoke API keys
  - Key name, created date, last used, scopes
  - "Generate New Key" button
```

### Section: Data Management

```
[Card: Export]
  - "Export All Data" -- JSON or CSV
  - Date range filter
  - Table selection (which tables to include)
  - [Button: "Generate Export"]
  - Previous exports listed with download links

[Card: Backup]
  - Backup schedule display (from Supabase)
  - Last backup date + time
  - "Manual backup" link (documentation)

[Card: Record Retention]
  - Display current policy: "Activity logs: indefinite | Documents: 7 years | KYC records: 5 years"
  - Non-editable in Phase 1 (policy set by compliance officer)
```

### Section: Security

```
[Card: Multi-Factor Authentication]
  - Status: "Enabled" (green) or "Not Enabled" (amber)
  - [Button: "Enable MFA"] or [Button: "Manage MFA"]
  - Supports TOTP (authenticator app)

[Card: Session Management]
  - Current session info: device, IP, location, started
  - Active sessions list (if multiple)
  - [Button: "Sign Out All Other Sessions"]

[Card: Login History]
  - Table: date, device, IP, location, status (success/failed)
  - Last 30 days
```

### Section: Appearance

```
[Setting: Theme]
  - Toggle: Dark Mode (default) | Light Mode
  - Preview thumbnail

[Setting: Density]
  - Radio: Compact | Comfortable (default) | Spacious
  - Affects padding, font sizes, and spacing throughout the app

[Setting: Pipeline Card Click Behavior]
  - Radio: "Open slide-over panel" (default) | "Navigate to full page"

[Setting: Sidebar]
  - Toggle: "Auto-collapse sidebar on narrow screens" (default on)
  - Toggle: "Remember sidebar state" (default on)
```

---

## 18. PAGE 14: NEW ASSET WIZARD

**URL:** `/crm/assets/new`
**Purpose:** Step-by-step wizard to create a new asset and initialize its governance pipeline.

### Wizard Layout

```
[Layout]
  - Modal or full-page (configurable)
  - Step indicator at top showing progress
  - Content area in center
  - Navigation buttons at bottom: "Back" | "Next" | "Create Asset" (final step)
```

### Step 1: Basic Information

```
[Fields]
  - Asset Name (required) -- text input, e.g., "Emerald Barrel #017093"
  - Asset Type (required) -- select: Gemstone | Real Estate | Precious Metal | Mineral Rights | Other
    - If "Other": text input for custom type
  - Reference Code -- auto-generated ("PC-2026-XXX") but editable
  - Preliminary Value Estimate -- currency input
  - Source Channel -- select: Vault Inventory | Dealer Network | Direct Holder | Partner Referral | Inbound
  - Description -- text area (optional)
```

### Step 2: Asset Holder

```
[Fields]
  - Select existing contact or create new
  - [Option A: Select Existing]
    - Search/select from contacts database
  - [Option B: Create New]
    - Holder Name (required)
    - Holder Type: Individual | Entity
    - If Entity: Entity Name, State of Formation
    - Email
    - Phone
    - Address
```

### Step 3: Value Path Selection

```
[Element: PathSelector]
  - Three large cards, side by side
  - Each card:
    - Path name: "Fractional Securities" / "Tokenization" / "Debt Instruments"
    - Tagline: "Divide and Distribute" / "Programmable Ownership" / "Borrow Against Value"
    - Color bar: emerald / teal / sapphire
    - Brief description (from portal-data.ts)
    - "Select" button
  - Selected card: highlighted border (path color), filled background at 10% opacity
  - [Option: "Undecided"]
    - Text below cards: "Not sure yet? You can assign a value path later."
    - If selected: only shared Phases 1-2 are initialized
```

### Step 4: Team Assignment

```
[Fields]
  - Lead Team Member (required) -- select from team members
  - Additional Team Members -- multi-select
  - Each member: name + role + avatar
```

### Step 5: Review & Create

```
[Summary Card]
  - All entered information displayed for review
  - Edit links next to each section
  - "This will create:"
    - 1 asset record
    - X governance steps (based on path selection)
    - X default tasks
    - Gate checkpoints listed
  - [Checkbox] "I confirm this information is accurate" (required)
  - [Button: "Create Asset"] -- primary, --accent-teal
    - Creates asset record
    - Pre-populates asset_steps from governance templates
    - Creates default tasks
    - Logs in activity trail
    - Sends notification to assigned team
    - Redirects to /crm/assets/[new_asset_id]
```

---

## 19. GLOBAL OVERLAYS & INTERACTIONS

### Asset Slide-Over Panel

```
[Element: AssetSlideOver]
  - Trigger: clicking an asset card from the Pipeline Board (if configured)
  - Position: right side of screen
  - Width: 480px
  - Height: full viewport height
  - Background: --bg-secondary
  - Shadow: --shadow-modal
  - Animation: slide in from right, 250ms ease
  - Overlay: semi-transparent backdrop (click to dismiss)

  [Header]
    - [CloseButton] X icon, top-right
    - [OpenFull] "Open full view" link -- navigates to /crm/assets/[asset_id]
    - [AssetName] -- --font-heading, 20px
    - [Reference] -- --font-mono, --text-muted
    - [StatusBadge]

  [Body]
    - Compact version of Asset Detail:
      - Phase Timeline (horizontal, compressed)
      - Key metrics (value, phase, compliance score)
      - Current step with task list
      - Quick task completion checkboxes
      - Recent activity (last 5 entries)

  [Footer]
    - [Button: "Add Document"] -- ghost
    - [Button: "Add Note"] -- ghost
    - [Button: "Open Full View"] -- primary

  [Interaction: Outside Click] -- dismisses panel
  [Interaction: Escape Key] -- dismisses panel
  [Interaction: Swipe Right] -- dismisses panel (touch devices)
```

### Command Palette (Cmd+K)

```
[Element: CommandPalette]
  - Trigger: Cmd+K (Mac) or Ctrl+K (Windows) or clicking search trigger in header
  - Position: centered modal, 560px wide
  - Background: --bg-secondary
  - Border: 1px --border-focus
  - Shadow: --shadow-modal
  - Border-radius: --radius-lg
  - Animation: scale from 0.95 to 1.0, fade in, 150ms

  [SearchInput]
    - Full-width, no border, large font (16px)
    - Placeholder: "Search assets, partners, documents, tasks..."
    - Icon: search icon left
    - Auto-focused on open

  [Results Section]
    - Grouped by type:
      - "Assets" -- matching asset names/references
      - "Partners" -- matching partner names
      - "Documents" -- matching filenames
      - "Tasks" -- matching task titles
      - "Team" -- matching team member names
    - Each result: type icon + name + subtitle (e.g., asset reference, partner type)
    - Keyboard navigation: arrow up/down to select, Enter to navigate
    - Max 8 results per group

  [Quick Actions Section] (shown when input is empty)
    - "New Asset" -- opens New Asset Wizard
    - "New Meeting" -- opens New Meeting form
    - "Search Documents" -- filters to documents
    - "My Tasks" -- navigates to tasks filtered to current user
    - "Recent" -- last 5 visited pages

  [Interaction: Escape] -- closes palette
  [Interaction: Click result] -- navigates and closes
  [Interaction: Outside Click] -- closes palette
```

### Notification Center

```
[Element: NotificationCenter]
  - Trigger: clicking notification bell in header
  - Position: slide-in panel from right, 360px wide
  - Height: full viewport
  - Background: --bg-secondary
  - Shadow: --shadow-panel

  [Header]
    - "Notifications" -- --font-heading, 18px
    - "Mark all read" -- link, --text-muted (marks all as read)
    - Close button (X)

  [Notification List]
    - Vertical list, newest first
    - Grouped by: "Today" | "Yesterday" | "Earlier This Week" | "Older"

    [Element: NotificationItem]
      - Background: --bg-tertiary if unread, --bg-secondary if read
      - Padding: 12px 16px
      - Border-bottom: 1px --border-default
      - Click: navigates to the relevant page (asset, task, etc.) and marks as read

      [TypeIcon] -- colored by type:
        - Task: check-square, --accent-amethyst
        - Document: file, --accent-sapphire
        - Gate: shield, --accent-gold
        - Approval: shield-check, --accent-amber
        - Alert: alert-triangle, --accent-ruby
        - System: zap, --text-muted

      [Text] "Shane uploaded GIA Report to Emerald Barrel #017093" -- --font-body, --text-primary
      [Timestamp] "2 hours ago" -- --font-small, --text-muted
      [UnreadDot] -- 8px --accent-teal dot (only if unread)
```

### Toast Messages

```
[Element: Toast]
  - Position: bottom-right corner, 16px from edges
  - Width: 360px
  - Background: --bg-tertiary
  - Border: 1px --border-default
  - Border-left: 4px [type color]
  - Border-radius: --radius-md
  - Shadow: --shadow-panel
  - Padding: 12px 16px
  - Animation: slide up from bottom, 200ms ease

  [Layout]
    - [TypeIcon] -- 20px, colored by type
    - [Title] "Document Uploaded" -- --font-label, --text-primary
    - [Message] "GIA Report v2 uploaded to Step 2.1" -- --font-small, --text-secondary
    - [CloseButton] X icon, top-right
    - [ActionLink] "View" -- optional, navigates to relevant page

  [Types]
    - Success: emerald left border, check-circle icon
    - Info: sapphire left border, info icon
    - Warning: amber left border, alert-triangle icon
    - Error: ruby left border, x-circle icon

  [Behavior]
    - Auto-dismiss: 5 seconds
    - Manual dismiss: click X
    - Stack: up to 3 toasts visible, newest at bottom
    - Click toast body: navigates to relevant page (if applicable)
```

### Confirmation Dialogs

```
[Element: ConfirmationDialog]
  - Standard shadcn AlertDialog pattern
  - Center of screen, 440px wide
  - Semi-transparent backdrop
  - Used for:
    - Gate passage
    - Asset archival/termination
    - Partner removal
    - Document deletion (non-locked only)
    - Module swap
  - Content:
    - Title: "Confirm [Action]" -- --font-heading
    - Description: explains what will happen -- --text-secondary
    - Impact list (if applicable): what records will be created/modified
    - [Button: Confirm Action] -- colored by severity (emerald for positive, ruby for destructive)
    - [Button: "Cancel"] -- ghost
  - Destructive actions: confirm button is ruby colored
  - Positive actions (gate passage): confirm button is gold colored
```

---

## 20. INTERACTION PATTERNS & FLOWS

### Flow 1: Approval Workflow

```
1. User completes all tasks in a governance step
2. System detects: step has required approval(s)
3. UI update: "Approval Required" banner appears on the step
   - Banner: --accent-amber background at 15%, amber left border
   - Text: "This step requires approval from [Approver Name / Role]"
   - [Button: "Request Approval"]

4. User clicks "Request Approval"
   - Notification sent to required approver(s) (in-app + email)
   - Step status changes to "Awaiting Approval"
   - Activity log: "Approval requested from [name] for Step [X.Y]"

5. Approver receives notification, navigates to the step
   - Approver sees all tasks marked complete, all documents uploaded
   - Approver reviews each item

6. Approver clicks one of:
   [Button: "Approve"] -- green
     - Step status -> "Complete"
     - Activity log: "Step [X.Y] approved by [name] at [timestamp]"
     - Notification to step assignee: "Your step was approved"
     - If this was the last step in a phase: gate check becomes READY

   [Button: "Request Changes"] -- amber
     - Modal: text area for notes (required)
     - Step status -> "Blocked" with approver's notes displayed
     - Activity log: "Changes requested by [name] for Step [X.Y]. Notes: [text]"
     - Notification to step assignee: "Changes requested on Step [X.Y]"
```

### Flow 2: Gate Passage

```
1. All governance steps within a phase show status "Complete"
2. System auto-evaluates gate conditions:
   - Checks document counts against requirements
   - Checks task completion percentages
   - Checks approval statuses
3. Gate check card transitions from OPEN to READY
   - Visual: gold pulsing glow animation on the gate card
   - Notification to team: "Gate [GX] is ready for review"

4. Authorized team member opens the gate check card
   - Reviews all conditions (auto-evaluated + manual)
   - Auto-evaluated conditions show green check or red X
   - Manual conditions have checkboxes for the reviewer

5. If all conditions are green:
   - [Button: "Pass Gate"] becomes enabled (gold background, shimmer animation)
   - User clicks "Pass Gate"

6. Confirmation dialog:
   - "You are about to pass Gate G3 (VERIFICATION GATE)"
   - "This will advance the asset to Phase 3: Tokenization"
   - "This action creates a permanent record and cannot be undone."
   - [Button: "Pass Gate"] gold | [Button: "Cancel"] ghost

7. On confirmation:
   - Gate status -> PASSED
   - Immutable gate_checks record created with:
     - Gate ID, asset ID, checked_by, checked_at
     - All conditions with pass/fail status
     - Notes (if any)
   - Asset's current_phase advances to next phase
   - Activity log entry with full gate passage details
   - Notifications sent to entire team
   - Pipeline board updates in real-time (Supabase Realtime):
     - Asset card animates from old column to new column
   - Success toast: "Gate G3 passed successfully. Emerald Barrel #017093 advanced to Phase 3."
```

### Flow 3: Document Upload

```
1. User triggers upload via:
   - Upload zone on a governance step
   - "Add Document" button in Asset Detail
   - Global Document Library upload
   - Drag-and-drop onto any upload zone

2. File selection dialog opens (or file is dropped)

3. AI document classification:
   - System analyzes filename and (optionally) content
   - Suggests document type: "This looks like a GIA Grading Report"
   - User confirms or corrects via dropdown

4. Association:
   - Asset: pre-selected if uploading from asset context, otherwise dropdown
   - Step: suggested based on document type, editable dropdown
   - Partner: optional, suggested if document relates to a partner

5. Upload:
   - File uploaded to Supabase Storage (appropriate bucket)
   - Document record created in documents table:
     - Type, filename, version (1 for new, incremented for replacements)
     - Asset ID, step ID, uploaded_by, uploaded_at
     - File path, file size, mime type
   - If replacing existing document:
     - Previous version: parent_document_id set, version incremented
     - Previous file preserved in storage (not deleted)
     - Both versions visible in version history
   - Activity log: "Document uploaded: [filename] v[version] for Step [X.Y]"
   - Notification to relevant team members

6. Post-upload:
   - Document slot on governance step shows "Uploaded" state
   - Step progress updates (e.g., "2/3 documents" -> "3/3 documents")
   - If this was the last required document: may trigger step completion check
```

### Flow 4: Partner Module Swap

```
1. User navigates to Asset Detail > Partners tab
2. Clicks "Switch Module" on a partner row

3. Step 1 -- Select New Module:
   - Modal shows available modules for the same function
   - Example: Current = "Brickken ERC-3643 Module"
   - Available alternatives: "Zoniqx TPaaS Module", "Rialto In-House Module"
   - User selects new module

4. Step 2 -- Impact Preview:
   - System calculates the difference
   - Shows:
     - "Switching from Brickken ERC-3643 Module to Zoniqx TPaaS Module"
     - "Tasks to be superseded (3):"
       - "Configure ERC-3643 in Brickken dashboard" (Step 3.1)
       - "Deploy via Brickken API" (Step 3.6)
       - "Verify ONCHAINID compliance" (Step 3.2)
     - "New tasks to be created (4):"
       - "Configure ERC-7518 in Zoniqx TPaaS" (Step 3.1)
       - "Deploy via Zoniqx API" (Step 3.6)
       - "Verify zCompliance rules" (Step 3.2)
       - "Run Zoniqx compliance test suite" (Step 3.3)
     - Warning: "2 of the superseded tasks are already completed. Their records will be preserved in history."

5. Step 3 -- Confirm:
   - "I understand this will modify the task list for this asset"
   - [Button: "Confirm Switch"]

6. On confirmation:
   - Old module tasks: status -> "Superseded", preserved in task history
   - New module tasks: created and linked to governance steps
   - Activity log: detailed before/after record
   - Notifications to team members
   - Toast: "Module switched successfully. 4 new tasks created."
```

### Flow 5: Real-Time Updates

```
[Supabase Realtime Subscriptions]
  - Pipeline Board subscribes to: assets (status, phase changes)
  - Asset Detail subscribes to: asset_steps, tasks, documents, comments for that asset
  - Task Dashboard subscribes to: tasks table
  - Notification Center subscribes to: notifications for current user

[When a real-time update is received:]
  - Pipeline Board: asset card animates to new position if phase changed
  - Asset Detail: governance step progress bar updates, task checkbox checks
  - Task Dashboard: new task appears or status badge updates
  - Notification Center: badge count increments, new notification appears at top
  - Toast: optional toast notification for significant events (gate passed, document uploaded)
```

---

## 21. RESPONSIVE BEHAVIOR

### Breakpoints

| Breakpoint | Width | Layout Changes |
|------------|-------|----------------|
| `xl` | 1440px+ | Full layout, sidebar expanded, 4-column grid |
| `lg` | 1280px | Sidebar collapsed by default, 3-column grid |
| `md` | 1024px | Sidebar icon-only, 2-column grid, kanban scrolls horizontally |
| `sm` | 768px | No sidebar (hamburger menu), single column, cards stack |
| `xs` | < 640px | Mobile-optimized, full-width cards, simplified views |

### Pipeline Board Responsive

```
xl (1440px+): 4 kanban columns visible, sidebar expanded
lg (1280px):  4 kanban columns visible, sidebar collapsed
md (1024px):  3 kanban columns visible, horizontal scroll for 4th
sm (768px):   2 kanban columns visible, horizontal scroll
xs (<640px):  1 kanban column visible, horizontal scroll with snap
              Stats ribbon stacks to 2x2 grid
              Filter bar becomes collapsible "Filters" button
```

### Asset Detail Responsive

```
xl: 3-column overview grid, full-width governance steps
lg: 2-column overview grid
md: 2-column overview grid, tabs become scrollable horizontal
sm: 1-column overview grid, tabs become dropdown selector
xs: 1-column, simplified cards, collapsible sections
```

### Tables Responsive

```
xl-lg: Full table with all columns
md: Hide lower-priority columns (compliance %, days, actions)
sm: Card view instead of table (each row becomes a card)
xs: Compact card view
```

---

## 22. ACCESSIBILITY REQUIREMENTS

### WCAG 2.1 AA Compliance

```
[Color Contrast]
  - All text meets 4.5:1 contrast ratio against background
  - Large text (18px+) meets 3:1 ratio
  - Interactive elements meet 3:1 ratio against adjacent colors
  - Status badges use both color AND text/icon (never color alone)

[Keyboard Navigation]
  - All interactive elements reachable via Tab key
  - Focus indicators: 2px --border-focus outline
  - Enter/Space activates buttons and checkboxes
  - Escape closes modals, slide-overs, dropdowns
  - Arrow keys navigate within lists, grids, kanban columns

[Screen Reader Support]
  - ARIA labels on all interactive elements
  - ARIA live regions for:
    - Toast notifications
    - Real-time updates (task completion, phase advancement)
    - Loading states
  - ARIA roles: navigation, main, complementary, dialog
  - Status badges include aria-label (e.g., aria-label="Status: In Progress")
  - Progress bars include aria-valuenow, aria-valuemin, aria-valuemax

[Motion]
  - All animations respect prefers-reduced-motion
  - Pulsing glow on gates: replaced with static border in reduced-motion
  - Slide-over transitions: instant in reduced-motion
  - Kanban card hover scale: disabled in reduced-motion

[Focus Management]
  - When modals open: focus moves to first interactive element in modal
  - When modals close: focus returns to trigger element
  - When slide-over opens: focus moves to close button
  - When a new page loads: focus moves to main content heading
```

---

## 23. DATA LOADING & EMPTY STATES

### Loading States

```
[Skeleton Loading]
  - All pages use skeleton placeholders during data fetch
  - Skeleton style: --bg-tertiary animated pulse (opacity 0.5 to 1.0)
  - Pipeline Board: skeleton card shapes in each column
  - Tables: skeleton rows (8 rows)
  - Cards: skeleton rectangles matching card layout
  - Duration: shown for minimum 200ms to prevent flash

[Inline Loading]
  - Button actions (save, upload, approve): button shows spinner + "Saving..." text
  - Disabled while loading to prevent double-submit
  - Success: button shows check icon briefly (1s) then reverts

[Progressive Loading]
  - Pipeline Board stats load independently from kanban cards
  - Asset Detail hero loads before tabs
  - Tab content loads when tab is selected (not pre-loaded)
  - Activity feeds use infinite scroll (50 items at a time)
```

### Empty States

```
[Pipeline Board -- No Assets]
  - Center of board area
  - [Illustration] Large gem outline, --text-muted at 20% opacity
  - [Heading] "No assets in your pipeline" -- --font-heading, 20px, --text-primary
  - [Text] "Create your first asset to begin tracking it through the governance pipeline." -- --text-secondary
  - [Button: "Create First Asset"] -- primary, --accent-teal, large

[Asset List -- No Results (after filtering)]
  - [Heading] "No assets match your filters" -- --text-primary
  - [Text] "Try adjusting your filters or search terms." -- --text-secondary
  - [Button: "Clear Filters"] -- ghost

[Tasks -- No Open Tasks]
  - [Illustration] Checkmark in circle
  - [Heading] "All caught up!" -- --text-primary
  - [Text] "No open tasks across any of your assets." -- --text-secondary

[Activity -- No Entries]
  - [Heading] "No activity recorded" -- --text-primary
  - [Text] "Activity will appear here as you interact with assets, documents, and tasks." -- --text-secondary

[Documents -- No Documents]
  - [Heading] "No documents uploaded" -- --text-primary
  - [Text] "Upload your first document to get started." -- --text-secondary
  - [Button: "Upload Document"] -- primary

[Meetings -- No Meetings]
  - [Heading] "No meetings logged" -- --text-primary
  - [Text] "Log your partner and investor meetings to keep a record." -- --text-secondary
  - [Button: "Log First Meeting"] -- primary

[Partners -- No Partners]
  - [Heading] "No partners added" -- --text-primary
  - [Text] "Add your vault operators, legal counsel, broker-dealers, and tokenization platforms." -- --text-secondary
  - [Button: "Add First Partner"] -- primary
```

### Error States

```
[Page-Level Error]
  - Full-page error display
  - [Heading] "Something went wrong" -- --text-primary
  - [Text] Error details in --text-secondary
  - [Button: "Try Again"] -- primary
  - [Button: "Go to Pipeline"] -- ghost

[Component-Level Error]
  - Red border on the failed component
  - Error message below: --accent-ruby text
  - "Retry" button if applicable

[Network Error]
  - Toast notification: "Connection lost. Retrying..."
  - Auto-retry with exponential backoff
  - When restored: toast: "Connection restored"

[Permission Error]
  - "You don't have permission to perform this action."
  - "Contact your administrator." -- --text-secondary
```

---

## END OF WIREFRAME SPECIFICATION

### Document Metadata

| Field | Value |
|-------|-------|
| Total Pages Specified | 14 (including 2 sub-pages: Partner Detail, Meeting Detail, Team Member Detail) |
| Total Interactive Elements | ~180 unique element types |
| Total Data Fields Covered | Matches full JSONB metadata structure from Schema Design |
| Database Views Referenced | `v_pipeline_board`, `v_task_dashboard`, `v_compliance_dashboard` |
| Tables Referenced | All 13 CRM tables |
| Storage Buckets Referenced | All 5 Supabase Storage buckets |
| Governance Steps Covered | Phase 0 (6 steps) + Phase 1 (8) + Phase 2 (10) + Phase 3 (5-6 per path) + Phase 4 (8-10 per path) |
| Gate Checks Covered | G0, G1, G2, G3, G4, G5, G6/G6F/G6D, G7/G7F/G7D |
| Value Paths Covered | Fractional Securities, Tokenization, Debt Instruments |
| Partner Stacks Referenced | Rialto Full-Stack, Rialto+Zoniqx, Rialto+Brickken, Multi-Partner |

### Implementation Priority

| Priority | Pages | Rationale |
|----------|-------|-----------|
| P0 (Week 1-3) | Pipeline Board, Asset Detail (Overview + Governance tabs), New Asset Wizard | Core daily workflow |
| P1 (Week 3-5) | Asset List, Document Library, Task Dashboard | Operational necessities |
| P2 (Week 5-7) | Partners Directory, Partner Detail, Meetings, Activity Trail | Partner management + audit |
| P3 (Week 7-9) | Governance Templates, Compliance Dashboard, Team, Settings | Configuration + monitoring |
