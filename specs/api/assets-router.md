# API Spec: Assets tRPC Router

**Phase:** 1 — Pipeline Board (with extensions in Phases 2, 7)
**File:** `src/server/routers/assets.ts`
**Priority:** P0
**Dependencies:** Phase 0 (Foundation — tRPC setup, Supabase client, auth context)
**Spec Version:** 1.0

---

## PURPOSE

The assets router is the primary tRPC router for all asset (stone) CRUD operations, pipeline queries, and workflow assembly. It handles the full lifecycle from creation through archival.

---

## DATABASE TABLES ACCESSED

| Table | Operations | Notes |
|-------|-----------|-------|
| `assets` | SELECT, INSERT, UPDATE | Primary asset table. No DELETE — assets are archived. |
| `contacts` | SELECT, INSERT | Holder contact creation during asset creation |
| `asset_steps` | SELECT | Step data for asset detail + pipeline progress |
| `asset_task_instances` | SELECT | Task data for progress calculations |
| `asset_partners` | SELECT, INSERT, DELETE | Partner assignments |
| `partner_modules` | SELECT | Module data for workflow assembly |
| `governance_requirements` | SELECT | Requirements for step count preview |
| `team_members` | SELECT | Team data for assignment |
| `documents` | SELECT | Document counts for pipeline cards |
| `activity_log` | (auto via triggers) | All mutations auto-logged |

### Views

| View | Used By |
|------|---------|
| `v_pipeline_board` | `assets.list` — pre-computed pipeline data |

---

## PROCEDURES

### `assets.list`

**Type:** query
**Purpose:** Fetch all assets for the pipeline board and asset list view with computed metrics.

**Input (Zod):**
```typescript
z.object({
  valuePath: z.enum(['all', 'fractional_securities', 'tokenization', 'debt_instruments', 'evaluating']).default('all'),
  assetType: z.enum(['all', 'gemstone', 'real_estate', 'precious_metal', 'mineral_rights', 'other']).default('all'),
  status: z.enum(['all', 'prospect', 'screening', 'active', 'paused', 'completed', 'terminated']).default('all'),
  teamMemberId: z.string().uuid().optional(),
  search: z.string().optional(),
  sortBy: z.enum(['name', 'reference_code', 'created_at', 'current_phase', 'claimed_value']).default('created_at'),
  sortDir: z.enum(['asc', 'desc']).default('desc'),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(10).max(100).default(50),
})
```

**Output:**
```typescript
{
  assets: {
    id: string;
    name: string;
    referenceCode: string;
    assetType: string;
    valuePath: string | null;
    currentPhase: number;
    status: string;
    estimatedValue: number | null;
    offeringValue: number | null;
    holderName: string;
    holderId: string;
    stepsCompleted: number;
    stepsTotal: number;
    tasksCompleted: number;
    tasksTotal: number;
    tasksOverdue: number;
    documentsCount: number;
    complianceScore: number;
    daysInPipeline: number;
    daysInCurrentPhase: number;
    riskLevel: 'low' | 'moderate' | 'high' | 'critical';
    assignedTeam: { id: string; name: string; avatarUrl: string }[];
    currentStepNumber: string;
    currentStepTitle: string;
    createdAt: string;
    updatedAt: string;
  }[];
  total: number;
  page: number;
}
```

**Query Pattern:**
- Read from `v_pipeline_board` view for pre-computed metrics
- JOIN with `team_members` via asset team assignment
- Search applies ILIKE on `name`, `reference_code`, and holder contact name
- Pagination: OFFSET/LIMIT (acceptable for < 1000 assets)

---

### `assets.getById`

**Type:** query
**Purpose:** Full asset record with all metadata for the asset detail page.

**Input:**
```typescript
z.object({
  assetId: z.string().uuid(),
})
```

**Output:**
```typescript
{
  asset: {
    id: string;
    name: string;
    referenceCode: string;
    assetType: string;
    valuePath: string | null;
    currentPhase: number;
    status: string;
    estimatedValue: number | null;
    metadata: AssetMetadata; // Full JSONB — holder, certification, appraisals, custody, legal, tokenization, etc.
    holder: Contact;
    assignedTeam: TeamMember[];
    partnerAssignments: {
      partner: Partner;
      module: PartnerModule | null;
      role: string;
    }[];
    stepsCompleted: number;
    stepsTotal: number;
    complianceScore: number;
    daysInPipeline: number;
    createdAt: string;
    updatedAt: string;
  }
}
```

**Query Pattern:**
- SELECT from `assets` WHERE id = assetId
- JOIN with `contacts` for holder info
- JOIN with `asset_partners` -> `partners` -> `partner_modules` for partner data
- Compute steps progress from `asset_steps`
- Return full `metadata` JSONB for overview tab cards

---

### `assets.getStats`

**Type:** query
**Purpose:** Pipeline-level statistics for the stats ribbon on the Pipeline Board.

**Input:**
```typescript
z.object({
  pathFilter: z.enum(['fractional_securities', 'tokenization', 'debt_instruments']).optional(),
}).optional()
```
Note: The Pipeline Board spec (01-pipeline-board.md) passes a `pathFilter` when a filter pill is active. Stats recalculate per path.

**Output:**
```typescript
{
  totalPipelineAUM: number;        // SUM of offering_value (or estimated_value) across active assets
  activeAssetCount: number;         // COUNT of active assets
  avgDaysInPipeline: number;        // AVG days since creation for active assets
  complianceScore: number;          // Global compliance score (avg across all active assets)
  newThisMonth: number;             // COUNT of assets created this month
  aumTrendThisMonth: number;        // Delta in AUM from last month
}
```

**Query Pattern:**
- Aggregation query on `assets` WHERE status IN ('prospect', 'screening', 'active', 'paused')
- Compliance score from `v_compliance_dashboard` or computed in query

---

### `assets.create`

**Type:** mutation
**Purpose:** Create a new asset from the New Asset Wizard. Calls `assemble_asset_workflow()`.

**Input (Zod):**
```typescript
z.object({
  name: z.string().min(1).max(255),
  assetType: z.enum(['gemstone', 'real_estate', 'precious_metal', 'mineral_rights', 'other']),
  customAssetType: z.string().max(100).optional(),
  referenceCode: z.string().min(1).max(50),
  estimatedValue: z.number().positive().optional(),
  sourceChannel: z.enum(['vault_inventory', 'dealer_network', 'direct_holder', 'partner_referral', 'inbound']).optional(),
  description: z.string().max(2000).optional(),
  valuePath: z.enum(['fractional_securities', 'tokenization', 'debt_instruments', 'evaluating']).optional(),
  holder: z.union([
    z.object({ type: z.literal('existing'), contactId: z.string().uuid() }),
    z.object({
      type: z.literal('new'),
      name: z.string().min(1),
      holderType: z.enum(['individual', 'entity']),
      entityName: z.string().optional(),
      stateOfFormation: z.string().optional(),
      email: z.string().email().optional(),
      phone: z.string().optional(),
      address: z.string().optional(),
    }),
  ]),
  partners: z.array(z.object({
    partnerId: z.string().uuid(),
    moduleId: z.string().uuid().optional(),
    role: z.string(),
  })).optional(),
  leadTeamMemberId: z.string().uuid(),
  additionalTeamMemberIds: z.array(z.string().uuid()).optional(),
})
```

**Output:**
```typescript
{
  asset: Asset;
  stepsCreated: number;
  tasksCreated: number;
  gatesCreated: number;
}
```

**Mutation Pattern:**
1. Validate `referenceCode` uniqueness
2. If holder.type === 'new': INSERT into `contacts`, get `contact_id`
3. INSERT into `assets`:
   - `name`, `asset_type`, `reference_code`, `value_path`
   - `claimed_value` (maps from input `estimatedValue`), `description`
   - NOTE: `sourceChannel` has no dedicated column — store in `metadata` JSONB as `metadata.source_channel`
   - `asset_holder_contact_id` = contact_id
   - `lead_team_member_id` = leadTeamMemberId
   - `current_phase` = 'phase_1_intake' (workflow_phase enum, not integer)
   - `status` = 'prospect' (asset_status enum — new assets start as prospects)
   - `metadata` = initial JSONB with holder info
4. INSERT into `asset_partners` for each partner assignment
5. Call `assemble_asset_workflow(asset_id, value_path, partner_assignments)`:
   - Reads `governance_requirements` matching value_path_scope (shared + path-specific)
   - Creates `asset_steps` for each requirement
   - For each step with partner module: creates `asset_task_instances` from `module_tasks`
   - For each step without partner module: creates tasks from `default_tasks` JSONB
   - Creates gate check placeholders
6. DB triggers automatically log to `activity_log`
7. DB triggers automatically send notifications to assigned team

**Cache Invalidation:**
- `assets.list` — new asset in pipeline
- `assets.getStats` — counts changed
- `v_pipeline_board` — new row

---

### `assets.update`

**Type:** mutation
**Purpose:** Update asset metadata (name, description, estimated value, metadata JSONB).

**Input:**
```typescript
z.object({
  assetId: z.string().uuid(),
  name: z.string().min(1).max(255).optional(),
  estimatedValue: z.number().positive().optional(),
  description: z.string().max(2000).optional(),
  metadata: z.record(z.any()).optional(), // Partial metadata JSONB merge
})
```

**Mutation Pattern:**
- UPDATE `assets` SET fields WHERE id = assetId
- For metadata: use PostgreSQL `jsonb_deep_merge` or `||` operator for partial updates
- DB trigger logs before/after diff to `activity_log`

**Cache Invalidation:** `assets.getById`, `assets.list`

---

### `assets.updatePhase`

**Type:** mutation
**Purpose:** Advance asset to next phase (called after gate passage).

**Input:**
```typescript
z.object({
  assetId: z.string().uuid(),
  newPhase: z.enum([
    'phase_0_foundation', 'phase_1_intake', 'phase_2_certification',
    'phase_3_custody', 'phase_4_legal', 'phase_5_tokenization',
    'phase_6_regulatory', 'phase_7_distribution', 'phase_8_ongoing'
  ]),
  gateCheckId: z.string().uuid(), // Reference to the gate check that authorized this
})
```

**Mutation Pattern:**
- Verify gate check exists and result = 'passed'
- UPDATE `assets` SET `current_phase` = newPhase WHERE id = assetId (uses workflow_phase enum, not integer)
- DB trigger logs phase transition
- Send notifications to team

**Cache Invalidation:** `assets.getById`, `assets.list` (card moves columns)

**Realtime:** This mutation should trigger Supabase Realtime updates so the pipeline board auto-updates.

---

### `assets.archive`

**Type:** mutation
**Purpose:** Archive an asset (soft delete — sets status to 'archived').

**Input:**
```typescript
z.object({
  assetId: z.string().uuid(),
  reason: z.string().min(1).max(1000),
})
```

**Mutation Pattern:**
- UPDATE `assets` SET `status` = 'archived', `metadata.archive_reason` = reason
- DB trigger logs with reason
- Confirmation required (enforced at UI level with dialog)
- Asset remains queryable but filtered out of default views

**Cache Invalidation:** `assets.list`, `assets.getStats`

---

### `assets.checkReferenceUnique`

**Type:** query
**Purpose:** Check if a reference code is unique (used in New Asset Wizard Step 1).

**Input:**
```typescript
z.object({
  referenceCode: z.string().min(1),
})
```

**Output:**
```typescript
{ isUnique: boolean }
```

**Query:** `SELECT COUNT(*) FROM assets WHERE reference_code = $1`

---

### `assets.getCreatePreview`

**Type:** query
**Purpose:** Preview how many steps/tasks/gates will be created for a given value path and partner selection.

**Input:**
```typescript
z.object({
  valuePath: z.enum(['fractional_securities', 'tokenization', 'debt_instruments', 'evaluating']).optional(),
  partnerModuleIds: z.array(z.string().uuid()).optional(),
})
```

**Output:**
```typescript
{
  stepCount: number;
  taskCount: number;
  gateCount: number;
}
```

**Query:**
- Count `governance_requirements` matching path scope (shared + path-specific)
- Count tasks from selected `partner_modules` + default tasks from unmatched requirements
- Count gates from requirements where `is_gate = true`

---

## AUTH MIDDLEWARE

Every procedure uses tRPC middleware that:
1. Verifies `ctx.user` exists (authenticated)
2. Verifies `ctx.user.teamMemberId` exists (is an active team member)
3. For mutations: passes `ctx.user.id` as the actor for audit logging

```typescript
const authedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' });
  const teamMember = await getTeamMember(ctx.user.id);
  if (!teamMember || !teamMember.is_active) throw new TRPCError({ code: 'FORBIDDEN' });
  return next({ ctx: { ...ctx, teamMember } });
});
```

---

## REALTIME UPDATES

The following mutations should trigger Supabase Realtime updates:

| Mutation | Channel | Event |
|----------|---------|-------|
| `assets.create` | `pipeline` | New asset card appears |
| `assets.updatePhase` | `pipeline` | Asset card moves between columns |
| `assets.update` | `asset:{id}` | Asset detail refreshes |
| `assets.archive` | `pipeline` | Asset card removed from view |

Implementation: Supabase Realtime is handled at the database level via NOTIFY/LISTEN on the `assets` table. Frontend subscribes to the `assets` table changes.

---

## ERROR HANDLING

| Error | Code | Message |
|-------|------|---------|
| Asset not found | NOT_FOUND | "Asset not found" |
| Duplicate reference code | CONFLICT | "Reference code already exists" |
| Invalid phase transition | BAD_REQUEST | "Cannot advance to phase X without passing gate" |
| Unauthorized archive | FORBIDDEN | "Only CEO/CTO can archive assets" |
| Invalid value path | BAD_REQUEST | "Invalid value path" |

---

## TEST CRITERIA

| # | Test | Expected Result |
|---|------|-----------------|
| 1 | `assets.list` with no filters | Returns all active assets with computed metrics |
| 2 | `assets.list` with valuePath filter | Returns only assets matching path |
| 3 | `assets.list` with search | Returns assets matching name/reference/holder |
| 4 | `assets.getById` with valid ID | Returns full asset with metadata |
| 5 | `assets.getById` with invalid ID | Returns NOT_FOUND error |
| 6 | `assets.create` with valid data | Creates asset, steps, tasks, gates |
| 7 | `assets.create` with duplicate reference | Returns CONFLICT error |
| 8 | `assets.create` with new holder | Creates contact + asset |
| 9 | `assets.create` with existing holder | Links existing contact |
| 10 | `assets.update` with metadata merge | Partial metadata update preserves existing fields |
| 11 | `assets.updatePhase` with valid gate | Phase advances, activity logged |
| 12 | `assets.updatePhase` without gate | Returns BAD_REQUEST error |
| 13 | `assets.archive` sets status | Status = 'archived', reason stored |
| 14 | `assets.getStats` accuracy | AUM, count, avg days match actual data |
| 15 | Activity log entries | All mutations produce activity_log rows via triggers |
| 16 | Unauthenticated request | Returns UNAUTHORIZED |

---

## CLAUDE.md RULES APPLIED

- **tRPC for all mutations:** This IS the tRPC router — all asset operations funnel through here
- **Activity logging is automatic:** DB triggers, not manual frontend inserts
- **Auth context flows through tRPC middleware:** Every procedure gets `ctx.user`
- **Every mutation must invalidate affected queries:** Listed per procedure above
- **Never modify migration files:** Schema is read-only from this router
- **"asset" not "stone":** DB table is `assets`. Use "asset" naming consistently throughout.
