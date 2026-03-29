# Feature Spec: Global Fuzzy Search (Cmd+K Command Palette)

**Phase:** 6 — Search + Filters + Navigation
**Trigger:** `Cmd+K` (Mac) / `Ctrl+K` (Windows) / Click search trigger in header
**Priority:** P0
**Dependencies:** Phases 1-5 complete (data must exist across all entity types to search)
**Estimated Build Time:** 2-3 hours
**Spec Version:** 1.0

---

## PURPOSE

A command palette that searches across all entity types — assets, partners, documents, tasks, meetings, and activity. Provides instant navigation to any item in the system. Supports keyboard navigation, recent items, and quick actions.

---

## DATA SOURCES

### Search Targets

| Entity | Table | Searchable Fields | Result Display |
|--------|-------|-------------------|----------------|
| Assets | `stones` | `name`, `reference_code`, `metadata->holder->name` | Name, reference code, type badge, phase |
| Partners | `partners` | `name` | Name, type badge, DD status |
| Documents | `documents` | `filename`, `document_type` | Filename, type badge, asset name |
| Tasks | `tasks` + `asset_task_instances` | `title` | Title, asset name, assignee, status |
| Meetings | `meeting_notes` | `title`, `summary` | Title, date, partner/asset badges |
| Activity | `activity_log` | `details->>'action'`, `details->>'detail'` | Action text, timestamp, user |

---

## UI SPECIFICATION

### Command Palette Modal

```
[Element: CommandPalette]
  Position: centered, 560px wide
  Background: --bg-secondary
  Border: 1px --border-focus
  Shadow: --shadow-modal
  Border-radius: --radius-lg (12px)
  Animation: scale from 0.95 to 1.0, fade in, 150ms ease
  Z-index: 9999 (above everything)

  [SearchInput] — full-width, no visible border, auto-focused
    Font: DM Sans 16px, --text-primary
    Placeholder: "Search assets, partners, documents, tasks..."
    Icon: search icon on left, --text-muted
    [Keyboard hint] "ESC to close" — right side, JetBrains Mono 11px, --text-muted

  [Divider] — 1px --border-default

  [ResultsSection] — max-height 400px, overflow-y scroll
```

### Results — When Input Has Text

Results grouped by entity type. Max 5 results per group. Groups only shown if they have matches.

```
[Group: "Assets"]
  [ResultItem]
    [Icon] — gem, 16px, --accent-teal
    [PrimaryText] "Emerald Barrel #017093" — DM Sans 14px, --text-primary
    [SecondaryText] "PC-2026-001 · Gemstone · Phase 2" — DM Sans 12px, --text-muted
    [Highlight] — matching portion of text bolded

[Group: "Partners"]
  [ResultItem]
    [Icon] — handshake, 16px, --accent-amethyst
    [PrimaryText] "Bull Blockchain Law" — DM Sans 14px, --text-primary
    [SecondaryText] "Counsel · DD Complete" — DM Sans 12px, --text-muted

[Group: "Documents"]
  [ResultItem]
    [Icon] — file-text, 16px, --accent-sapphire
    [PrimaryText] "gia-report-017093-2026.pdf" — DM Sans 14px, --text-primary
    [SecondaryText] "GIA Report · Emerald Barrel #017093 · Step 2.1" — DM Sans 12px, --text-muted

[Group: "Tasks"]
  [ResultItem]
    [Icon] — check-square, 16px, --accent-amethyst
    [PrimaryText] "Contact first USPAP appraiser" — DM Sans 14px, --text-primary
    [SecondaryText] "Emerald Barrel · Step 2.3 · Assigned: Shane" — DM Sans 12px, --text-muted

[Group: "Meetings"]
  [ResultItem]
    [Icon] — calendar, 16px, --accent-teal
    [PrimaryText] "Rialto Markets Intro Call" — DM Sans 14px, --text-primary
    [SecondaryText] "Mar 15, 2026 · Rialto Markets" — DM Sans 12px, --text-muted
```

Each result item:
- Height: 48px
- Padding: 8px 16px
- Hover: `--bg-tertiary` background
- Selected (keyboard): `--bg-tertiary` background + left border 3px `--accent-teal`
- Click or Enter: navigates to item and closes palette

### Quick Actions — When Input Is Empty

Shown before the user types anything:

```
[Section: "Quick Actions"]
  [ActionItem] "New Asset" — icon: plus, navigates to /crm/assets/new
  [ActionItem] "New Meeting" — icon: calendar-plus, navigates to /crm/meetings (with create modal)
  [ActionItem] "My Tasks" — icon: check-square, navigates to /crm/tasks?assignee=me
  [ActionItem] "Compliance Dashboard" — icon: shield, navigates to /crm/compliance

[Section: "Recent"] — last 5 accessed items from localStorage
  [RecentItem] icon + name + type label
  Each stored as: { type, id, name, url, accessedAt }
```

### No Results State

```
"No results for '[query]'" — DM Sans 14px, --text-muted, centered
"Try searching for assets, partners, documents, or tasks" — DM Sans 12px, --text-muted
```

---

## KEYBOARD NAVIGATION

| Key | Action |
|-----|--------|
| `Cmd+K` / `Ctrl+K` | Open palette |
| `Escape` | Close palette |
| `Arrow Down` | Move selection to next result |
| `Arrow Up` | Move selection to previous result |
| `Enter` | Navigate to selected result and close |
| `Tab` | Move to next group header |
| Typing | Filters results in real-time (debounced 200ms) |

Selection wraps: Arrow Down from last item goes to first item. Arrow Up from first goes to last.

---

## RECENT ITEMS

Stored in `localStorage` key: `pleochrome_recent_items`

```typescript
interface RecentItem {
  type: 'asset' | 'partner' | 'document' | 'task' | 'meeting';
  id: string;
  name: string;
  url: string;
  accessedAt: string; // ISO timestamp
}
```

- Max 10 items stored, FIFO
- Updated every time user navigates to a detail page
- Display last 5 in Quick Actions section
- "Clear recent" link at bottom of recent section

---

## RESULT ACTIONS

Each result has a default action (navigate) and optional secondary actions:

| Entity | Default Action | Secondary Action |
|--------|---------------|------------------|
| Asset | Navigate to `/crm/assets/[id]` | Copy reference code to clipboard |
| Partner | Navigate to `/crm/partners/[id]` | — |
| Document | Navigate to document (opens preview) | Copy filename |
| Task | Navigate to task in context (asset governance tab) | — |
| Meeting | Navigate to `/crm/meetings/[id]` | — |

Copy action: small copy icon on right side of result item, click copies text, shows "Copied" tooltip for 1.5s.

---

## COMPONENTS USED

| Component | Source | Usage |
|-----------|--------|-------|
| NeuModal | `src/components/ui/NeuModal` | Command palette overlay (custom variant — no header/footer) |
| NeuInput | `src/components/ui/NeuInput` | Search input (custom variant — borderless, large) |
| NeuBadge | `src/components/ui/NeuBadge` | Type badges in secondary text |

### New Components

| Component | Path | Purpose |
|-----------|------|---------|
| CommandPalette | `src/components/crm/CommandPalette` | Main command palette component |
| SearchResultItem | `src/components/crm/SearchResultItem` | Individual result row |
| SearchResultGroup | `src/components/crm/SearchResultGroup` | Group header + result list |
| QuickActions | `src/components/crm/QuickActions` | Empty-state quick action list |
| RecentItems | `src/components/crm/RecentItems` | Recent items from localStorage |

---

## tRPC ROUTES

### Router: `src/server/routers/search.ts`

| Procedure | Type | Input | Output | Notes |
|-----------|------|-------|--------|-------|
| `search.global` | query | `{ query: string, limit?: number }` | `{ results: GroupedResults }` | Searches all entity types in parallel. Returns grouped results. |

### Implementation

```typescript
const SearchInput = z.object({
  query: z.string().min(1).max(200),
  limit: z.number().int().min(1).max(10).default(5), // per group
});

// Output structure
interface GroupedResults {
  assets: SearchResult[];
  partners: SearchResult[];
  documents: SearchResult[];
  tasks: SearchResult[];
  meetings: SearchResult[];
}

interface SearchResult {
  id: string;
  type: 'asset' | 'partner' | 'document' | 'task' | 'meeting';
  primaryText: string;
  secondaryText: string;
  url: string;
  icon: string;
  metadata: Record<string, any>;
}
```

### Query Strategy

Search uses `ILIKE` with `%query%` pattern across multiple tables in a single database round-trip using parallel CTEs:

```sql
WITH
  asset_matches AS (
    SELECT id, name AS primary_text,
      reference_code || ' · ' || asset_type || ' · Phase ' || current_phase AS secondary_text,
      '/crm/assets/' || id AS url
    FROM stones
    WHERE is_active = true
      AND (name ILIKE $1 OR reference_code ILIKE $1)
    LIMIT $2
  ),
  partner_matches AS (
    SELECT id, name AS primary_text,
      type || ' · DD ' || dd_status AS secondary_text,
      '/crm/partners/' || id AS url
    FROM partners
    WHERE name ILIKE $1
    LIMIT $2
  ),
  document_matches AS (
    SELECT d.id, d.filename AS primary_text,
      d.document_type || ' · ' || COALESCE(s.name, '') AS secondary_text,
      '/crm/documents?preview=' || d.id AS url
    FROM documents d
    LEFT JOIN stones s ON d.stone_id = s.id
    WHERE d.filename ILIKE $1 OR d.document_type ILIKE $1
    LIMIT $2
  ),
  task_matches AS (
    SELECT t.id, t.title AS primary_text,
      COALESCE(s.name, '') || ' · ' || COALESCE(t.step_number, '') AS secondary_text,
      '/crm/tasks?highlight=' || t.id AS url
    FROM tasks t
    LEFT JOIN stones s ON t.stone_id = s.id
    WHERE t.title ILIKE $1
    LIMIT $2
  ),
  meeting_matches AS (
    SELECT m.id, m.title AS primary_text,
      TO_CHAR(m.date, 'Mon DD, YYYY') || ' · ' || COALESCE(p.name, '') AS secondary_text,
      '/crm/meetings/' || m.id AS url
    FROM meeting_notes m
    LEFT JOIN partners p ON m.partner_id = p.id
    WHERE m.title ILIKE $1 OR m.summary ILIKE $1
    LIMIT $2
  )
SELECT 'asset' AS type, * FROM asset_matches
UNION ALL
SELECT 'partner', * FROM partner_matches
UNION ALL
SELECT 'document', * FROM document_matches
UNION ALL
SELECT 'task', * FROM task_matches
UNION ALL
SELECT 'meeting', * FROM meeting_matches;
```

Where `$1` = `'%' || sanitized_query || '%'` and `$2` = limit per group.

**Performance notes:**
- ILIKE with leading `%` does not use indexes efficiently. At PleoChrome's scale (< 1000 rows per table in year 1), this is acceptable.
- If performance degrades: add GIN trigram indexes (`CREATE INDEX ... USING GIN (name gin_trgm_ops)`) or switch to PostgreSQL full-text search with `tsvector`.
- Search is debounced 200ms on the client side to prevent excessive queries while typing.

---

## INTEGRATION WITH CRM SHELL

The CommandPalette component is mounted at the CRM layout level (`src/app/crm/layout.tsx`):

```tsx
// In CRM layout:
<CommandPalette />

// Component listens for:
// - Cmd+K / Ctrl+K keydown on document
// - Click on SearchTrigger in header bar
```

The SearchTrigger in the header bar shows:
```
[SearchIcon] [Placeholder: "Search..."] [Badge: "Cmd+K"]
```

---

## TEST CRITERIA

| # | Test | Expected Result |
|---|------|-----------------|
| 1 | Press Cmd+K | Palette opens, input focused |
| 2 | Press Escape | Palette closes |
| 3 | Click outside palette | Palette closes |
| 4 | Type "emerald" | Asset results appear matching "emerald" |
| 5 | Type "bull" | Partner "Bull Blockchain Law" appears |
| 6 | Type "gia" | Documents matching "gia" appear |
| 7 | Arrow Down moves selection | Visual indicator moves to next item |
| 8 | Arrow Up moves selection | Visual indicator moves to previous item |
| 9 | Enter on selected result | Navigates to item URL, palette closes |
| 10 | Click on result | Navigates to item URL, palette closes |
| 11 | Empty input shows Quick Actions | New Asset, New Meeting, My Tasks, Compliance |
| 12 | Empty input shows Recent Items | Last 5 accessed items from localStorage |
| 13 | No results for query | "No results" message shown |
| 14 | Search debounced | Typing fast only triggers one API call (200ms debounce) |
| 15 | Results grouped by type | Groups appear with headers, max 5 per group |
| 16 | Click search trigger in header | Palette opens |
| 17 | Copy reference code | Clipboard updated, "Copied" tooltip shown |
| 18 | Recent items update | Navigating to asset adds it to recent list |
| 19 | `npm run build` | Zero errors |
| 20 | Dark mode | Palette renders correctly |
| 21 | Light mode | Palette renders correctly |

---

## CLAUDE.md RULES APPLIED

- **Neumorphic design system:** Palette uses CSS custom properties for all colors and shadows
- **Dark + light mode:** All palette elements use theme-aware CSS variables
- **tRPC for data access:** Search query goes through tRPC, not direct Supabase
- **"asset" not "stone":** Result display says "Asset", even though table is `stones`
- **No prop drilling:** CommandPalette manages its own state internally

---

## DEPENDENCIES

| Dependency | Phase | What's Needed |
|------------|-------|---------------|
| Foundation (Phase 0) | 0 | tRPC, Supabase client |
| All Phases 1-5 | 1-5 | Data must exist across all entity types to be searchable |

### What This Feature Provides to Others

| Consumer | What |
|----------|------|
| CRM Shell | Search trigger in header opens this palette |
| All pages | Cmd+K is global, available everywhere in `/crm/*` |
