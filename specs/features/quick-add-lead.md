# Quick Add — Lead Asset Capture

**Priority:** P0 (MVP)
**Phase:** 1 (Pipeline Board)
**Complexity:** Simple

---

## Purpose

Allow rapid capture of a potential asset opportunity in under 30 seconds. This is the "jot it down between meetings" flow. No governance workflow is assembled until the lead is manually activated.

## Asset Lifecycle

```
LEAD (quick capture) → QUALIFIED (reviewed, worth pursuing) → ACTIVE (workflow assembled, in pipeline)
```

- **Lead:** Minimal data. No governance steps. No tasks. Just the opportunity captured.
- **Qualified:** Team has reviewed. Decision to pursue. Still no workflow.
- **Active:** Value path selected, partners assigned, `assemble_asset_workflow()` called. Full governance pipeline starts.

## Status Mapping

| Stage | asset_status | In Pipeline? | Governance Steps? |
|-------|-------------|-------------|-------------------|
| Lead | `prospect` | Leads column only | No |
| Qualified | `screening` | Leads column (highlighted) | No |
| Active | `active` | Phase 1+ columns | Yes (assembled) |

## UI: Quick Add Modal

**Trigger:** Floating "+" button on Pipeline Board OR "Quick Add" in sidebar nav OR keyboard shortcut "N"

**Modal:** Compact NeuModal (not full-page wizard). Neumorphic raised, centered, ~480px wide.

**Fields:**

| Field | Type | Required | Placeholder |
|-------|------|----------|-------------|
| Asset Name | NeuInput text | Yes | "e.g., Colombian Emerald Lot #3" |
| Asset Type | NeuSelect | Yes | Gemstone / Real Estate / Precious Metal / Mineral Rights / Other |
| Estimated Value | NeuInput currency | Yes | "$0" (with dollar prefix) |
| Location | NeuInput text | No | "e.g., Olympic Vault, Tacoma WA" |
| Holder Name | NeuInput text | Yes | "Person or entity name" |
| Holder Email | NeuInput email | No | "email@example.com" |
| Holder Phone | NeuInput tel | No | "+1 (555) 000-0000" |
| Source | NeuSelect | No | Vault Inventory / Dealer Network / Direct Holder / Partner Referral / Inbound / Other |
| Notes | NeuInput textarea | No | "Any context about the opportunity..." |

**Buttons:**
- "Save Lead" (NeuButton primary) — creates the asset with status='prospect'
- "Save & Add Another" (NeuButton ghost) — saves and resets form
- "Cancel" (NeuButton ghost) — closes modal

**On Save:**
1. Insert into `assets` table with:
   - status = 'prospect'
   - current_phase = NULL (not in pipeline yet)
   - current_step = NULL
   - value_path = NULL (not selected yet)
   - metadata JSONB: `{ holder: { name, email, phone }, location, source, notes }`
   - auto-generated asset_reference (e.g., "PC-2026-003")
2. Insert into `activity_log`: "Lead asset created: [name]"
3. Do NOT call `assemble_asset_workflow()` — no governance steps yet
4. Show NeuToast: "Lead saved: [asset name]"
5. Asset appears in Leads column on Pipeline Board

## UI: Leads Column on Pipeline Board

**Option A (recommended):** Add a "Leads" column to the LEFT of the kanban board
- Column header: "Leads" with a subtle different background (gray instead of colored)
- Lead cards: simplified — just name, type badge, value, holder name, source badge, date added
- No progress bar (no governance steps to track)
- Action buttons on each lead card:
  - "Qualify" — changes status to 'screening', highlights the card
  - "Activate" — opens a mini-wizard: select value path → select partners → creates governance workflow → moves to Phase 1
  - "Archive" — soft-deletes (sets status to 'rejected')

**Option B:** Separate "Leads" tab above the kanban (not a column)
- Tab bar: "Pipeline" (default) | "Leads" (count badge)
- Leads view: table/list format, sortable, with bulk activate/archive

**Recommendation:** Option A for MVP (simpler, everything visible at once). Switch to Option B if leads volume exceeds 10-15.

## UI: Activate Flow (Lead → Active)

When user clicks "Activate" on a lead:

1. **Step 1:** Value Path selection (Fractional / Tokenization / Debt) — 3 cards, click to select
2. **Step 2:** Partner Assignment (optional) — checkboxes for available partner modules, or "Skip — I'll assign later"
3. **Step 3:** Confirm — "This will create [X] governance steps and [Y] tasks. Activate?"
4. On confirm:
   - Update asset status to 'active'
   - Set current_phase to 'phase_1_intake'
   - Set value_path
   - Call `assemble_asset_workflow(asset_id, value_path, partner_module_ids)`
   - Asset moves from Leads column to Phase 1 column in the kanban
   - Activity log: "Asset activated for [value_path] path with [N] governance steps"

## tRPC Routes

```typescript
// Quick add
assets.quickAdd: {
  input: { name, assetType, estimatedValue, location?, holderName, holderEmail?, holderPhone?, source?, notes? }
  output: { id, assetReference }
}

// Activate lead
assets.activate: {
  input: { assetId, valuePath, partnerModuleIds? }
  output: { id, stepsCreated, tasksCreated }
}

// Qualify lead
assets.qualify: {
  input: { assetId }
  output: { id, status }
}
```

## Database

Uses existing `assets` table. No schema changes needed. The `status` enum already has 'prospect' and 'screening'.

The `metadata` JSONB field stores the quick-add data:
```json
{
  "holder": {
    "name": "White Oak Partners II LLC",
    "email": "contact@whiteoakpartners.com",
    "phone": "+1 (253) 555-0192"
  },
  "location": "Olympic Vault, Tacoma WA",
  "source": "partner_referral",
  "notes": "Chris's contact. 7 barrels of raw emeralds. $103M appraised. Provenance needs review."
}
```

## Test Criteria

1. Quick Add modal opens from "+" button
2. Form validates (name and type required)
3. Save creates asset with status='prospect'
4. Asset appears in Leads column
5. "Activate" opens mini-wizard
6. Selecting path + confirming creates governance steps
7. Asset moves to Phase 1 column
8. Activity log records both creation and activation
