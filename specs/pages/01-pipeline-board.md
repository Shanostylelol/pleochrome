# Spec: 01 — Pipeline Board (Main CRM Dashboard)

**Phase:** 1 (Pipeline Board)
**Step:** 1.1 through 1.5
**Depends On:** All Phase 0 Foundation specs (00 through 05)
**Produces:** Kanban pipeline view at `/crm` with stats ribbon, path filters, asset cards, real-time updates
**Estimated Time:** 4-6 hours

---

## CLAUDE.md Rules That Apply

- `API Rules #1`: All data mutations go through tRPC. No direct Supabase client calls from components (except Realtime subscriptions).
- `API Rules #2`: Every mutation must invalidate affected queries.
- `API Rules #3`: Activity logging is automatic (DB triggers). Do NOT manually insert activity_log rows.
- `Component Rules #2`: Every visual component MUST use the neumorphic design system.
- `Component Rules #3`: Every component MUST support dark AND light mode.
- `CRM Architecture`: This page reads from Layer 3 (instance layer) via the `v_pipeline_board` view.
- `DO NOT`: Use "stone" or "stones" as a data model term — use "asset" or "assets".
- `DO NOT`: Claim any partner is "locked in".
- `Design System`: Raised cards, pressed columns, concave filter pills.

---

## URL

```
/crm          — Pipeline Board (same page)
/crm/pipeline — Alias (optional, redirects to /crm)
```

---

## Data Source

**Primary view:** `v_pipeline_board` — one row per non-archived asset with:
- `id`, `name`, `asset_type`, `reference_code`
- `value_path`, `current_phase`, `current_step`, `status`
- `claimed_value`, `offering_value`
- `asset_holder_entity`, `lead_team_member_id`, `lead_name`
- `total_steps`, `completed_steps`, `blocked_steps`, `active_steps`
- `open_tasks`, `overdue_tasks`
- `document_count`
- `last_activity_at`
- `days_in_phase`
- `created_at`, `updated_at`

---

## Page Layout

```
+------------------------------------------------------------+
| PAGE HEADER                                                |
| "Pipeline Board" (h1, display font)                        |
| "Track all assets through the governance workflow" (desc)  |
| [+ New Asset] button (right-aligned)                       |
+------------------------------------------------------------+
|                                                            |
| STATS RIBBON (4 cards in a row)                            |
| [ Total AUM ] [ Active Assets ] [ Avg Days ] [ Compliance]|
|                                                            |
+------------------------------------------------------------+
|                                                            |
| PATH FILTER PILLS                                          |
| [All] [Fractional] [Tokenization] [Debt]                  |
|                                                            |
+------------------------------------------------------------+
|                                                            |
| KANBAN BOARD (4 columns, horizontal scroll on overflow)    |
| [ Acquisition ] [ Preparation ] [ Execution ] [ Distrib. ]|
| [ card ]        [ card ]        [ card ]      [ card ]    |
| [ card ]        [ card ]                                   |
| [ card ]                                                   |
|                                                            |
+------------------------------------------------------------+
```

---

## Section 1: Page Header

**Components used:** None (plain HTML + CSS variables)

**Layout:**
- Left: `h1` "Pipeline Board" (`font-family: var(--font-display)`, `font-size: 28px`, `font-weight: 600`, `color: var(--text-primary)`)
- Left below: description text (`font-size: 14px`, `color: var(--text-secondary)`)
- Right: `NeuButton variant="primary" icon={<Plus />}` with label "New Asset"

**User interaction:**
- Click "New Asset" button: navigates to `/crm/assets/new` (New Asset Wizard — Phase 7). For now (Phase 1), show a `NeuModal` with a simple form: name, asset_type, value_path, holder_entity. On submit, call `assets.create` mutation.

---

## Section 2: Stats Ribbon

**Components used:** `NeuCard` (variant="raised-sm")

Four stat cards in a horizontal row with `display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-md)`.

### Stat Card 1: Total AUM (Assets Under Management)

- Label: "Total AUM" (`font-size: 12px`, `color: var(--text-muted)`, `text-transform: uppercase`, `letter-spacing: 0.5px`)
- Value: `$X,XXX,XXX` (`font-size: 24px`, `font-weight: 700`, `color: var(--text-primary)`, `font-family: var(--font-body)`)
- Calculation: `SUM(offering_value)` across all non-archived assets. If `offering_value` is null, use `claimed_value`.
- Icon: `DollarSign` (Lucide), `color: var(--emerald)`, top-right of card

### Stat Card 2: Active Assets

- Label: "Active Assets"
- Value: `X` (count)
- Calculation: `COUNT(*)` where `status IN ('prospect', 'screening', 'active', 'paused')`
- Icon: `Gem` (Lucide), `color: var(--teal)`

### Stat Card 3: Avg Days in Phase

- Label: "Avg Days in Phase"
- Value: `X days`
- Calculation: `AVG(days_in_phase)` across active assets
- Icon: `Clock` (Lucide), `color: var(--amber)`

### Stat Card 4: Compliance Score

- Label: "Compliance Score"
- Value: `XX%`
- Calculation: `(SUM(completed_steps) / SUM(total_steps)) * 100` across all active assets. If no steps exist, show "N/A".
- Icon: `Shield` (Lucide), `color: var(--chartreuse)` if >= 80%, `var(--amber)` if 50-79%, `var(--ruby)` if < 50%
- Visual: small `NeuProgress` bar beneath the percentage, colored by score range

### Data source for stats:

```typescript
// tRPC route: assets.getStats
// Input: { pathFilter?: ValuePath } (optional — stats change when path filter is active)
// Output: { totalAum: number, activeAssets: number, avgDaysInPhase: number, complianceScore: number }
```

---

## Section 3: Path Filter Pills

**Components used:** Custom filter pill buttons (not NeuBadge — these are interactive)

**Layout:** Horizontal row, `display: flex`, `gap: var(--space-sm)`, wrapped in a pressed/concave container (`--shadow-pressed`, `--bg-body`, `padding: 4px`, `border-radius: var(--radius-lg)`)

**Filter options:**

| Label | Value | Color (active bg) |
|-------|-------|--------------------|
| All | `null` | `var(--text-muted)` (gray) |
| Fractional | `'fractional_securities'` | `var(--emerald)` |
| Tokenization | `'tokenization'` | `var(--teal)` |
| Debt | `'debt_instruments'` | `var(--sapphire)` |

**Pill styles:**
- Container (trough): concave/pressed, `border-radius: var(--radius-lg)`, `padding: 4px`
- Inactive pill: `background: var(--bg-surface)`, `color: var(--text-muted)`, `box-shadow: var(--shadow-raised-sm)`, `border-radius: var(--radius-md)`, `padding: 8px 16px`, `font-size: 13px`, `font-weight: 500`
- Hover (inactive): `color: var(--text-secondary)`, `transform: translateY(-1px)`, `box-shadow: var(--shadow-raised)`
- Active (inactive): `box-shadow: var(--shadow-pressed)`, `transform: translateY(0)`
- Selected pill: `background: {path-color}`, `color: white`, `box-shadow: var(--shadow-raised-sm)`

**User interaction:**
- Click a pill: sets the active filter
- Active filter stored in component state (not URL — it resets on navigation)
- Filter affects: kanban cards (only show matching path), stats ribbon (recalculated)
- "All" shows all assets regardless of path

---

## Section 4: Kanban Board

**Components used:** `NeuCard` (for each column and asset card), `NeuBadge`, `NeuProgress`, `NeuAvatar`

### Column Mapping

Assets are sorted into columns based on their `current_phase`:

| Column | Label | Color | Phases Included |
|--------|-------|-------|-----------------|
| 1 | Acquisition | `var(--emerald)` | `phase_0_foundation`, `phase_1_intake` |
| 2 | Preparation | `var(--teal)` | `phase_2_certification`, `phase_3_custody` |
| 3 | Execution | Path-colored (see below) | `phase_4_legal`, `phase_5_tokenization`, `phase_6_regulatory` |
| 4 | Distribution | `var(--amber)` | `phase_7_distribution`, `phase_8_ongoing` |

**Execution column color:**
- If asset is `fractional_securities`: `var(--emerald)`
- If asset is `tokenization`: `var(--teal)`
- If asset is `debt_instruments`: `var(--sapphire)`
- If asset is `evaluating`: `var(--amber)`

### Column Layout

```
+---------------------------+
| COLUMN HEADER             |
| [colored dot] Acquisition |
| 3 assets                  |
+---------------------------+
| (pressed/concave trough)  |
|                           |
| +-------ASSET CARD------+ |
| | PC-2026-001            | |
| | Emerald Barrel #017093 | |
| | [emerald] [tokenize]   | |
| | $15,400,000            | |
| | ████████░░░░ 67%       | |
| | Step 2.3 · 14 days     | |
| | [avatar] [avatar]      | |
| +------------------------+ |
|                           |
| +-------ASSET CARD------+ |
| | ...                    | |
| +------------------------+ |
+---------------------------+
```

**Column container styles:**
- `flex: 1`, `min-width: 280px`, `max-width: 340px`
- Header: `padding: var(--space-md)`, column label in `font-weight: 600`, asset count in `font-size: 12px`, `color: var(--text-muted)`
- Column dot: 8px circle with column color
- Card area: `background: var(--bg-body)`, `box-shadow: var(--shadow-pressed)` (concave trough), `border-radius: var(--radius-lg)`, `padding: var(--space-sm)`, `min-height: 200px`, vertical scroll if > 5 cards
- Gap between cards: `var(--space-sm)`

### Asset Card

**Component: `src/components/crm/AssetCard.tsx`**

```typescript
export interface AssetCardProps {
  asset: PipelineBoard  // Type from v_pipeline_board view
}
```

**Card content (top to bottom):**

1. **Reference code:** `font-family: var(--font-mono)`, `font-size: 11px`, `color: var(--text-muted)` (e.g., "PC-2026-001")

2. **Asset name:** `font-size: 14px`, `font-weight: 600`, `color: var(--text-primary)`, truncate with ellipsis if > 1 line

3. **Badge row:** horizontal flex, `gap: 4px`
   - Asset type badge: `NeuBadge color="gray" size="sm"` (e.g., "Emerald")
   - Path badge: `NeuBadge color={pathColor} size="sm"` (e.g., "Tokenization" in teal)
   - Status badge (if paused/blocked): `NeuBadge color="ruby" size="sm"` "Paused" or `NeuBadge color="amber" size="sm"` "Blocked"

4. **Value:** `font-size: 16px`, `font-weight: 700`, `color: var(--text-primary)`. Show `offering_value` if set, else `claimed_value`. Format: `$15,400,000`. If no value, show "TBD" in muted.

5. **Progress bar:** `NeuProgress` showing `completed_steps / total_steps * 100`. Color: `teal` if in progress, `chartreuse` if > 80%, `ruby` if blocked_steps > 0.

6. **Current step + days:** `font-size: 12px`, `color: var(--text-secondary)`. Format: "Step 2.3 - 14 days" with a `Clock` icon.

7. **Team avatars:** `display: flex` with overlapping `NeuAvatar size="sm"` for each assigned team member. Max 3 visible, then "+X" badge.

8. **Risk indicator (optional):** If `blocked_steps > 0` or `overdue_tasks > 0`, show a small red dot in the top-right corner of the card.

**Card styles:**
- `NeuCard variant="raised-sm" hoverable padding="sm"`
- `cursor: pointer`
- On hover: shadow intensifies (`--shadow-card-hover`), slight translateY(-1px)

**User interaction:**
- Click card: `router.push(\`/crm/assets/${asset.id}\`)` (navigates to Asset Detail page)

### Empty Column State

When a column has no assets (after filtering):

```
+---------------------------+
| [muted icon: Inbox]       |
| No assets in Acquisition  |
| Assets in this phase      |
| will appear here.         |
+---------------------------+
```

- Icon: `Inbox` (Lucide), 40px, `color: var(--text-placeholder)`
- Text: `font-size: 14px`, `color: var(--text-muted)`, centered
- Subtext: `font-size: 12px`, `color: var(--text-placeholder)`

---

## Section 5: Real-Time Updates

**Supabase Realtime subscription** on the `assets` table. When an asset is created, updated, or deleted, the pipeline board refreshes automatically.

```typescript
// In the Pipeline Board page component:

import { createClient } from '@/lib/supabase'

useEffect(() => {
  const supabase = createClient()

  const channel = supabase
    .channel('pipeline-board')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'assets' },
      () => {
        // Invalidate the assets.list query to trigger a refetch
        utils.assets.list.invalidate()
        utils.assets.getStats.invalidate()
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}, [utils])
```

**NOTE:** This is a direct Supabase client call, which is the ONE exception to the "all data through tRPC" rule (per CLAUDE.md API Rules #1: "except Realtime subscriptions").

---

## tRPC Routes Required

### Router: `src/server/routers/assets.ts`

Add to `_app.ts`: `assets: assetsRouter`

#### Route: `assets.list`

```typescript
assets.list = protectedProcedure
  .input(z.object({
    pathFilter: z.enum([
      'fractional_securities',
      'tokenization',
      'debt_instruments',
    ]).optional(),
  }).optional())
  .query(async ({ ctx, input }) => {
    let query = ctx.db
      .from('v_pipeline_board')
      .select('*')
      .order('current_phase', { ascending: true })
      .order('updated_at', { ascending: false })

    if (input?.pathFilter) {
      query = query.eq('value_path', input.pathFilter)
    }

    const { data, error } = await query

    if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
    return data ?? []
  })
```

**Input:** `{ pathFilter?: ValuePath }`
**Output:** `PipelineBoard[]`
**Database tables/views read:** `v_pipeline_board` (which reads from `assets`, `team_members`, `asset_steps`, `tasks`, `documents`, `activity_log`, `gate_checks`)

#### Route: `assets.getStats`

```typescript
assets.getStats = protectedProcedure
  .input(z.object({
    pathFilter: z.enum([
      'fractional_securities',
      'tokenization',
      'debt_instruments',
    ]).optional(),
  }).optional())
  .query(async ({ ctx, input }) => {
    let query = ctx.db.from('v_pipeline_board').select('*')

    if (input?.pathFilter) {
      query = query.eq('value_path', input.pathFilter)
    }

    const { data, error } = await query
    if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })

    const assets = data ?? []
    const active = assets.filter(a =>
      ['prospect', 'screening', 'active', 'paused'].includes(a.status ?? '')
    )

    const totalAum = assets.reduce((sum, a) =>
      sum + (Number(a.offering_value) || Number(a.claimed_value) || 0), 0
    )

    const avgDaysInPhase = active.length > 0
      ? Math.round(active.reduce((sum, a) => sum + (a.days_in_phase ?? 0), 0) / active.length)
      : 0

    const totalSteps = assets.reduce((sum, a) => sum + (a.total_steps ?? 0), 0)
    const completedSteps = assets.reduce((sum, a) => sum + (a.completed_steps ?? 0), 0)
    const complianceScore = totalSteps > 0
      ? Math.round((completedSteps / totalSteps) * 100)
      : 0

    return {
      totalAum,
      activeAssets: active.length,
      avgDaysInPhase,
      complianceScore,
    }
  })
```

**Input:** `{ pathFilter?: ValuePath }`
**Output:** `{ totalAum: number, activeAssets: number, avgDaysInPhase: number, complianceScore: number }`
**Database tables/views read:** `v_pipeline_board`

#### Route: `assets.create`

```typescript
assets.create = protectedProcedure
  .input(z.object({
    name: z.string().min(1).max(200),
    asset_type: z.string().min(1).max(100),
    value_path: z.enum(['fractional_securities', 'tokenization', 'debt_instruments', 'evaluating']),
    asset_holder_entity: z.string().optional(),
    claimed_value: z.number().optional(),
    description: z.string().optional(),
  }))
  .mutation(async ({ ctx, input }) => {
    // 1. Generate reference code
    const { data: refCode } = await ctx.db.rpc('generate_asset_reference')

    // 2. Create the asset
    const { data: asset, error } = await ctx.db
      .from('assets')
      .insert({
        name: input.name,
        asset_type: input.asset_type,
        value_path: input.value_path,
        asset_holder_entity: input.asset_holder_entity ?? null,
        claimed_value: input.claimed_value ?? null,
        description: input.description ?? null,
        reference_code: refCode,
        lead_team_member_id: ctx.user.id,
        assigned_team_ids: [ctx.user.id],
        status: 'prospect',
        current_phase: 'phase_0_foundation',
      })
      .select()
      .single()

    if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })

    // 3. Populate workflow steps
    await ctx.db.rpc('populate_asset_steps', {
      p_asset_id: asset.id,
      p_value_path: input.value_path,
    })

    // 4. Activity log entry is handled by the database trigger (log_stone_changes)

    return asset
  })
```

**Input:** `{ name, asset_type, value_path, asset_holder_entity?, claimed_value?, description? }`
**Output:** `Asset` (newly created)
**Database tables written:** `assets` (INSERT), `asset_steps` (via `populate_asset_steps` function)
**Database tables read:** None (function calls)
**Triggers fired:** `log_stone_changes` on assets insert (auto-logs to activity_log)

---

## Complete Component List

| Component | File | Usage on This Page |
|-----------|------|--------------------|
| `NeuCard` | `src/components/ui/NeuCard.tsx` | Stats cards, asset cards |
| `NeuButton` | `src/components/ui/NeuButton.tsx` | "New Asset" button, quick action buttons |
| `NeuBadge` | `src/components/ui/NeuBadge.tsx` | Asset type, path, status badges |
| `NeuProgress` | `src/components/ui/NeuProgress.tsx` | Step completion progress on each card |
| `NeuAvatar` | `src/components/ui/NeuAvatar.tsx` | Team member avatars on cards |
| `NeuModal` | `src/components/ui/NeuModal.tsx` | Simple "New Asset" form modal (temp) |
| `NeuInput` | `src/components/ui/NeuInput.tsx` | Form fields in the new asset modal |
| `NeuSelect` | `src/components/ui/NeuSelect.tsx` | Path selector in the new asset modal |
| `NeuSkeleton` | `src/components/ui/NeuSkeleton.tsx` | Loading state for stats and cards |
| `AssetCard` | `src/components/crm/AssetCard.tsx` | Individual kanban card |

---

## Complete File List

| File | Purpose |
|------|---------|
| `src/app/crm/page.tsx` | Pipeline Board page component |
| `src/components/crm/AssetCard.tsx` | Kanban asset card |
| `src/components/crm/StatsRibbon.tsx` | Stats ribbon (4 cards) |
| `src/components/crm/PathFilter.tsx` | Path filter pill bar |
| `src/components/crm/KanbanBoard.tsx` | Kanban column layout |
| `src/components/crm/KanbanColumn.tsx` | Individual kanban column |
| `src/components/crm/NewAssetModal.tsx` | Simple new asset form (temp — replaced by wizard in Phase 7) |
| `src/server/routers/assets.ts` | tRPC assets router |
| `src/server/routers/_app.ts` | Updated to include assets router |

---

## Database Tables/Views Used

| Table/View | Operation | Purpose |
|------------|-----------|---------|
| `v_pipeline_board` | SELECT | All pipeline data (assets + computed fields) |
| `assets` | INSERT | Create new asset |
| `assets` | REALTIME | Subscribe to changes for live updates |
| `asset_steps` | INSERT (via function) | Auto-populated by `populate_asset_steps()` |
| `team_members` | SELECT (via view join) | Lead name on pipeline view |
| `activity_log` | INSERT (via trigger) | Automatic logging on asset changes |

---

## tRPC Routes Summary

| Route | Type | Auth | Input | Output |
|-------|------|------|-------|--------|
| `assets.list` | Query | Protected | `{ pathFilter? }` | `PipelineBoard[]` |
| `assets.getStats` | Query | Protected | `{ pathFilter? }` | `{ totalAum, activeAssets, avgDaysInPhase, complianceScore }` |
| `assets.create` | Mutation | Protected | `{ name, asset_type, value_path, ... }` | `Asset` |

---

## Seed Data for Testing

After building the page, seed a test asset to verify the pipeline works:

```sql
-- Run via Supabase SQL Editor or supabase db execute

-- Get Shane's team member ID
DO $$
DECLARE
  shane_id uuid;
  asset_id uuid;
BEGIN
  SELECT id INTO shane_id FROM team_members WHERE email = 'shane@pleochrome.com';

  -- Create test asset
  INSERT INTO assets (
    name, asset_type, reference_code, value_path, current_phase, status,
    claimed_value, offering_value, asset_holder_entity,
    lead_team_member_id, assigned_team_ids, description
  ) VALUES (
    'Emerald Barrel #017093', 'emerald', 'PC-2026-001',
    'tokenization', 'phase_2_certification', 'active',
    18000000, 15400000, 'White Oak Partners II LLC',
    shane_id, ARRAY[shane_id],
    'Barrel of 17,093 emeralds from Colombian mines. Primary asset for tokenization pilot.'
  ) RETURNING id INTO asset_id;

  -- Populate workflow steps
  PERFORM populate_asset_steps(asset_id, 'tokenization');
END $$;
```

---

## Verification Checklist

| Check | How | Expected |
|-------|-----|----------|
| Page loads at `/crm` | Browser | Pipeline board renders |
| Stats ribbon shows data | Visual | 4 stat cards with calculated values |
| Path filter pills work | Click "Tokenization" | Only tokenization assets shown |
| "All" filter shows everything | Click "All" | All assets visible |
| Kanban columns render | Visual | 4 columns with headers and colored dots |
| Asset card displays all info | Visual | Reference, name, badges, value, progress, step, avatars |
| Click asset card | Click | Navigates to `/crm/assets/[id]` |
| Empty column state | Filter to path with no assets | "No assets in [phase]" message |
| "New Asset" button works | Click | Modal opens with form |
| New asset creation | Fill form, submit | Asset appears in kanban (via Realtime) |
| Real-time updates | Create asset in another tab/SQL | Pipeline refreshes automatically |
| Loading state | Throttle network | Skeleton cards visible |
| Stats update with filter | Toggle filters | Stats recalculate |
| Responsive layout | Resize window | Columns stack or scroll horizontally |
| `npm run build` passes | `npm run build` | Zero errors |
