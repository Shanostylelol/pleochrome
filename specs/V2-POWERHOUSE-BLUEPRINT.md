# PleoChrome Powerhouse CRM V2 — Complete Architecture Blueprint

**Date:** 2026-03-29
**Author:** Architecture Session
**Status:** DESIGN COMPLETE — Ready for phased implementation

---

## Table of Contents

1. [Migration Strategy](#1-migration-strategy)
2. [SQL Schema — Enums](#2-sql-schema--enums)
3. [SQL Schema — Tables](#3-sql-schema--tables)
4. [SQL Schema — Indexes](#4-sql-schema--indexes)
5. [SQL Schema — Triggers & Functions](#5-sql-schema--triggers--functions)
6. [SQL Schema — RPC Functions](#6-sql-schema--rpc-functions)
7. [SQL Schema — Row Level Security](#7-sql-schema--row-level-security)
8. [SQL Schema — Views](#8-sql-schema--views)
9. [Template Architecture](#9-template-architecture)
10. [tRPC Router Plan](#10-trpc-router-plan)
11. [Page & Component Plan](#11-page--component-plan)
12. [Edge Cases & Design Decisions](#12-edge-cases--design-decisions)

---

## 1. Migration Strategy

### What to KEEP
- `team_members` table — 3 users (Shane/CEO, David/CTO, Chris/CRO). Preserved exactly as-is.
- `auth.users` references from team_members.

### What to DROP (V1 tables being replaced)
All other V1 tables are replaced by the V2 schema. The migration creates the new schema alongside the old, migrates any salvageable data, then drops the old tables.

### Migration Steps

```sql
-- Step 1: Create all V2 enums (new names to avoid collision with V1 enums)
-- Step 2: Create all V2 tables (new names where needed, or direct replacement)
-- Step 3: Migrate team_members FK references to V2 tables
-- Step 4: Drop V1 tables in reverse dependency order
-- Step 5: Drop V1 enums
-- Step 6: Rename V2 enums if needed (or keep new names)
-- Step 7: Seed default stage templates for all 6 phases x 5 models
-- Step 8: Re-enable RLS on all new tables
```

Since the V1 data was already wiped (migration `20260330120000_wipe_seed_data.sql`), and only `team_members` has real data, the migration is straightforward: drop everything except `team_members`, create V2 from scratch.

**Critical:** The `team_members` table structure is unchanged. Its `id` column is the FK target for `assigned_to`, `created_by`, etc. throughout V2.

---

## 2. SQL Schema — Enums

```sql
-- ============================================================================
-- POWERHOUSE CRM V2 — ENUM TYPES
-- ============================================================================

-- 2.1 The 6 lifecycle phases (kanban columns)
CREATE TYPE v2_phase AS ENUM (
  'lead',              -- Initial contact, minimal info
  'intake',            -- Full asset details, provenance, holder contact
  'asset_maturity',    -- Certification, appraisal, custody, insurance
  'security',          -- Legal structuring, regulatory filings, compliance
  'value_creation',    -- Execution of chosen value creation model
  'distribution'       -- Investor placement, secondary market, ongoing
);

-- 2.2 The 5 value creation models
CREATE TYPE v2_value_model AS ENUM (
  'tokenization',
  'fractional_securities',
  'debt_instrument',
  'broker_sale',
  'barter'
);

-- 2.3 Asset lifecycle status
CREATE TYPE v2_asset_status AS ENUM (
  'active',        -- In pipeline, being worked
  'paused',        -- On hold (blocker, waiting on external)
  'completed',     -- Offering live / deal closed
  'terminated',    -- Deal killed / walked away
  'archived'       -- Historical record, read-only
);

-- 2.4 Stage status
CREATE TYPE v2_stage_status AS ENUM (
  'not_started',
  'in_progress',
  'completed',
  'skipped'
);

-- 2.5 Task types (the 9 types from requirements)
CREATE TYPE v2_task_type AS ENUM (
  'document_upload',    -- File must be attached
  'meeting',            -- Scheduled meeting required
  'physical_action',    -- Something done in the physical world
  'payment_outgoing',   -- Cost to pay
  'payment_incoming',   -- Deposit/payment to receive
  'approval',           -- Requires one or more approvers
  'due_diligence',      -- DD report to complete
  'filing',             -- Regulatory filing to submit
  'automated'           -- Future automation hook
);

-- 2.6 Task status
CREATE TYPE v2_task_status AS ENUM (
  'todo',
  'in_progress',
  'blocked',
  'pending_approval',   -- Waiting for approval chain
  'approved',           -- All approvals received
  'rejected',           -- Approval rejected (needs rework)
  'done',
  'cancelled'
);

-- 2.7 Subtask status
CREATE TYPE v2_subtask_status AS ENUM (
  'todo',
  'in_progress',
  'pending_approval',
  'approved',
  'rejected',
  'done',
  'cancelled'
);

-- 2.8 Approval decision
CREATE TYPE v2_approval_decision AS ENUM (
  'pending',
  'approved',
  'rejected',
  'abstained'
);

-- 2.9 Notification type
CREATE TYPE v2_notification_type AS ENUM (
  'comment_mention',      -- Someone @mentioned you in a comment
  'comment_reply',        -- Someone replied to your comment
  'task_assigned',        -- A task was assigned to you
  'subtask_assigned',     -- A subtask was assigned to you
  'approval_requested',   -- Your approval is needed
  'approval_decision',    -- An approval you requested was decided
  'stage_completed',      -- A stage was completed
  'phase_advanced',       -- An asset advanced to a new phase
  'document_uploaded',    -- A document was uploaded to your task
  'deadline_approaching', -- Task/subtask due date within 48h
  'deadline_overdue',     -- Task/subtask is past due
  'gate_ready',           -- A gate check is ready for review
  'asset_status_changed'  -- Asset status changed
);

-- 2.10 Audit action types
CREATE TYPE v2_audit_action AS ENUM (
  'created',
  'updated',
  'deleted',
  'status_changed',
  'phase_advanced',
  'stage_completed',
  'task_completed',
  'subtask_completed',
  'approval_requested',
  'approval_decided',
  'document_uploaded',
  'document_locked',
  'document_unlocked',
  'comment_posted',
  'template_saved',
  'template_instantiated',
  'gate_passed',
  'gate_failed',
  'asset_archived',
  'asset_terminated'
);

-- 2.11 Partner types (expanded)
CREATE TYPE v2_partner_type AS ENUM (
  'appraiser',
  'vault_custodian',
  'broker_dealer',
  'securities_counsel',
  'general_counsel',
  'transfer_agent',
  'tokenization_platform',
  'oracle_provider',
  'insurance_broker',
  'kyc_provider',
  'registered_agent',
  'auditor',
  'smart_contract_auditor',
  'gemological_lab',
  'escrow_agent',
  'title_company',
  'surveyor',
  'environmental',
  'other'
);

-- 2.12 Contact role
CREATE TYPE v2_contact_role AS ENUM (
  'asset_holder',
  'beneficial_owner',
  'investor',
  'partner_contact',
  'counsel',
  'appraiser',
  'vault_manager',
  'regulator',
  'broker',
  'other'
);

-- 2.13 Document category (simplified from 40+ V1 enum to a flexible text field)
-- V2 uses TEXT for document_type to allow growth without migrations.
-- Canonical values are enforced at the application/Zod layer.

-- 2.14 Risk level
CREATE TYPE v2_risk_level AS ENUM (
  'low',
  'medium',
  'high',
  'critical'
);

-- 2.15 Due diligence status
CREATE TYPE v2_dd_status AS ENUM (
  'not_started',
  'in_progress',
  'passed',
  'failed',
  'expired',
  'waived'
);

-- 2.16 KYC status
CREATE TYPE v2_kyc_status AS ENUM (
  'not_started',
  'pending',
  'verified',
  'failed',
  'expired'
);
```

---

## 3. SQL Schema — Tables

### 3.1 team_members (PRESERVED FROM V1)

No changes. Kept as-is with its existing columns, triggers, and data.

### 3.2 assets

```sql
CREATE TABLE assets (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identity
  name                    TEXT NOT NULL,
  asset_type              TEXT NOT NULL,           -- emerald, sapphire, real_estate, mineral_rights, etc.
  description             TEXT,
  reference_code          TEXT UNIQUE NOT NULL,    -- PC-YYYY-XXXX (generated, unique with retry)

  -- Physical attributes
  carat_weight            DECIMAL(12,2),
  asset_count             INTEGER,                 -- For lots/barrels
  origin                  TEXT,                    -- Geographic origin
  current_location        TEXT,

  -- Valuation
  claimed_value           DECIMAL(15,2),
  appraised_value         DECIMAL(15,2),           -- Post-appraisal (renamed from offering_value)
  currency                TEXT NOT NULL DEFAULT 'USD',

  -- Pipeline position
  current_phase           v2_phase NOT NULL DEFAULT 'lead',
  value_model             v2_value_model,          -- NULL until model selected (can happen at intake or later)
  status                  v2_asset_status NOT NULL DEFAULT 'active',

  -- Ownership
  asset_holder_contact_id UUID,                    -- FK added after contacts table
  asset_holder_entity     TEXT,

  -- SPV / Legal
  spv_name                TEXT,
  spv_ein                 TEXT,

  -- Team
  lead_team_member_id     UUID REFERENCES team_members(id) ON DELETE SET NULL,
  assigned_team_ids       UUID[] DEFAULT '{}',

  -- Template origin: which template was used to instantiate this asset's workflow
  source_template_id      UUID,                    -- FK to workflow_templates, set on instantiation
  -- NULL means "custom workflow" or "pre-template era"

  -- Flexible metadata
  metadata                JSONB NOT NULL DEFAULT '{}',

  -- Timestamps
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at            TIMESTAMPTZ,
  terminated_at           TIMESTAMPTZ,
  termination_reason      TEXT,

  -- Soft delete
  is_deleted              BOOLEAN NOT NULL DEFAULT false,
  deleted_at              TIMESTAMPTZ,
  deleted_by              UUID REFERENCES team_members(id)
);
```

### 3.3 contacts

```sql
CREATE TABLE contacts (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name         TEXT NOT NULL,
  role              v2_contact_role NOT NULL DEFAULT 'other',
  title             TEXT,
  entity            TEXT,
  email             TEXT,
  phone             TEXT,
  address           TEXT,

  -- Compliance
  kyc_status        v2_kyc_status NOT NULL DEFAULT 'not_started',
  kyc_verified_at   TIMESTAMPTZ,
  kyc_expires_at    TIMESTAMPTZ,
  ofac_status       TEXT DEFAULT 'not_screened',
  ofac_screened_at  TIMESTAMPTZ,
  pep_status        TEXT DEFAULT 'not_screened',
  pep_screened_at   TIMESTAMPTZ,

  -- Relationships
  partner_id        UUID,                          -- FK to partners (added after partners table)

  -- Notes
  notes             TEXT,
  tags              TEXT[] DEFAULT '{}',
  metadata          JSONB NOT NULL DEFAULT '{}',

  -- Soft delete
  is_deleted        BOOLEAN NOT NULL DEFAULT false,

  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Deferred FK from assets
ALTER TABLE assets
  ADD CONSTRAINT fk_assets_holder_contact
  FOREIGN KEY (asset_holder_contact_id)
  REFERENCES contacts(id) ON DELETE SET NULL;
```

### 3.4 partners

```sql
CREATE TABLE partners (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name              TEXT NOT NULL,
  type              v2_partner_type NOT NULL,
  website           TEXT,
  description       TEXT,

  -- Due diligence
  dd_status         v2_dd_status NOT NULL DEFAULT 'not_started',
  dd_report_url     TEXT,
  dd_completed_at   TIMESTAMPTZ,
  dd_expires_at     TIMESTAMPTZ,
  risk_level        v2_risk_level,

  -- Primary contact
  contact_name      TEXT,
  contact_email     TEXT,
  contact_phone     TEXT,
  contact_title     TEXT,

  -- Engagement
  engagement_status TEXT DEFAULT 'evaluating',
  contract_start    DATE,
  contract_end      DATE,
  fee_structure     JSONB,

  notes             TEXT,
  tags              TEXT[] DEFAULT '{}',
  metadata          JSONB NOT NULL DEFAULT '{}',

  -- Soft delete
  is_deleted        BOOLEAN NOT NULL DEFAULT false,

  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Deferred FK from contacts
ALTER TABLE contacts
  ADD CONSTRAINT fk_contacts_partner
  FOREIGN KEY (partner_id)
  REFERENCES partners(id) ON DELETE SET NULL;
```

### 3.5 asset_partners (junction)

```sql
CREATE TABLE asset_partners (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id        UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  partner_id      UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  role_on_asset   TEXT,
  engagement_date DATE,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE(asset_id, partner_id)
);
```

### 3.6 workflow_templates (Template Layer)

This is the heart of the template system. Each template defines a reusable set of stages for a given combination of phases and value creation model.

```sql
CREATE TABLE workflow_templates (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,                     -- e.g., "Default Tokenization", "Gemstone Full Pipeline"
  description     TEXT,

  -- Scope
  value_model     v2_value_model,                    -- NULL = universal (applies to any model)
  -- A template can be model-specific or universal.
  -- Model-specific templates provide stages for the value_creation phase.
  -- Universal templates provide stages for shared phases (lead, intake, etc.).

  -- Origin
  is_system        BOOLEAN NOT NULL DEFAULT false,   -- System-provided defaults (non-deletable)
  is_default       BOOLEAN NOT NULL DEFAULT false,   -- Auto-applied when matching value_model
  source_asset_id  UUID REFERENCES assets(id) ON DELETE SET NULL,
  -- If this template was saved from an asset's current state

  -- Versioning
  version          INTEGER NOT NULL DEFAULT 1,
  parent_template_id UUID REFERENCES workflow_templates(id) ON DELETE SET NULL,
  -- When a template is updated, the old version is kept, and a new version is created.
  -- Assets that were instantiated from the old version keep their reference.

  -- Metadata
  created_by      UUID REFERENCES team_members(id),
  metadata        JSONB NOT NULL DEFAULT '{}',

  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 3.7 template_stages

```sql
CREATE TABLE template_stages (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id         UUID NOT NULL REFERENCES workflow_templates(id) ON DELETE CASCADE,

  -- Position
  phase               v2_phase NOT NULL,
  sort_order          INTEGER NOT NULL DEFAULT 0,

  -- Identity
  name                TEXT NOT NULL,                  -- e.g., "GIA Lab Submission"
  description         TEXT,

  -- Governance reference (optional — links this stage to a regulatory requirement)
  regulatory_basis    TEXT,
  regulatory_citation TEXT,
  source_url          TEXT,

  -- Gate
  is_gate             BOOLEAN NOT NULL DEFAULT false,
  gate_id             TEXT,                           -- e.g., "G1", "G2"

  -- Visibility
  is_hidden           BOOLEAN NOT NULL DEFAULT false,

  -- Required documents at this stage
  required_document_types TEXT[] DEFAULT '{}',

  -- Required approvals
  required_approvals  JSONB DEFAULT '{}',
  -- Format: { "roles": ["ceo", "cto"], "min_approvals": 2 }

  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE(template_id, phase, sort_order)
);
```

### 3.8 template_tasks

```sql
CREATE TABLE template_tasks (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_stage_id   UUID NOT NULL REFERENCES template_stages(id) ON DELETE CASCADE,

  -- Task definition
  title               TEXT NOT NULL,
  description         TEXT,
  task_type           v2_task_type NOT NULL DEFAULT 'physical_action',

  -- Default assignment
  default_assignee_role TEXT,                         -- e.g., "ceo", "cto", "cro"

  -- Scheduling
  estimated_duration_days INTEGER,
  relative_due_offset_days INTEGER,                   -- Days after stage start

  -- Approval configuration (for task_type = 'approval')
  approval_config     JSONB DEFAULT '{}',
  -- Format: { "approvers": ["ceo", "cto"], "min_approvals": 1, "sequential": false }

  -- Payment fields (for payment_outgoing / payment_incoming)
  estimated_amount    DECIMAL(15,2),
  payment_recipient   TEXT,
  payment_description TEXT,

  -- Ordering
  sort_order          INTEGER NOT NULL DEFAULT 0,

  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 3.9 template_subtasks

```sql
CREATE TABLE template_subtasks (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_task_id    UUID NOT NULL REFERENCES template_tasks(id) ON DELETE CASCADE,

  title               TEXT NOT NULL,
  description         TEXT,
  default_assignee_role TEXT,
  sort_order          INTEGER NOT NULL DEFAULT 0,

  -- Approval on subtask
  requires_approval   BOOLEAN NOT NULL DEFAULT false,
  approval_config     JSONB DEFAULT '{}',

  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 3.10 asset_stages (Instance Layer — one per asset per stage)

```sql
CREATE TABLE asset_stages (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id            UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,

  -- Position
  phase               v2_phase NOT NULL,
  sort_order          INTEGER NOT NULL DEFAULT 0,

  -- Identity (copied from template at instantiation, then independently editable)
  name                TEXT NOT NULL,
  description         TEXT,

  -- Template origin
  source_template_stage_id UUID REFERENCES template_stages(id) ON DELETE SET NULL,
  -- Tracks which template stage this was created from.
  -- NULL if manually added after instantiation.

  -- Status
  status              v2_stage_status NOT NULL DEFAULT 'not_started',
  started_at          TIMESTAMPTZ,
  completed_at        TIMESTAMPTZ,
  completed_by        UUID REFERENCES team_members(id),

  -- Gate
  is_gate             BOOLEAN NOT NULL DEFAULT false,
  gate_id             TEXT,
  gate_passed_at      TIMESTAMPTZ,
  gate_passed_by      UUID REFERENCES team_members(id),

  -- Visibility (hide without deleting)
  is_hidden           BOOLEAN NOT NULL DEFAULT false,

  -- Governance
  regulatory_basis    TEXT,
  regulatory_citation TEXT,
  required_document_types TEXT[] DEFAULT '{}',
  required_approvals  JSONB DEFAULT '{}',

  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE(asset_id, phase, sort_order)
);
```

### 3.11 tasks (Instance Layer — work items within stages)

```sql
CREATE TABLE tasks (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id            UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  stage_id            UUID NOT NULL REFERENCES asset_stages(id) ON DELETE CASCADE,

  -- Template origin
  source_template_task_id UUID REFERENCES template_tasks(id) ON DELETE SET NULL,

  -- Task definition
  title               TEXT NOT NULL,
  description         TEXT,
  task_type           v2_task_type NOT NULL DEFAULT 'physical_action',

  -- Assignment
  assigned_to         UUID REFERENCES team_members(id) ON DELETE SET NULL,
  assigned_by         UUID REFERENCES team_members(id),
  assigned_at         TIMESTAMPTZ,

  -- Status
  status              v2_task_status NOT NULL DEFAULT 'todo',
  started_at          TIMESTAMPTZ,
  completed_at        TIMESTAMPTZ,
  completed_by        UUID REFERENCES team_members(id),

  -- Scheduling
  due_date            TIMESTAMPTZ,
  estimated_duration_days INTEGER,

  -- Payment fields
  estimated_amount    DECIMAL(15,2),
  actual_amount       DECIMAL(15,2),
  payment_recipient   TEXT,
  payment_description TEXT,
  payment_reference   TEXT,                          -- Check #, wire ref, etc.

  -- Evidence / proof of completion
  evidence_urls       TEXT[] DEFAULT '{}',

  -- Notes
  notes               TEXT,

  -- Ordering within stage
  sort_order          INTEGER NOT NULL DEFAULT 0,

  -- Soft delete
  is_deleted          BOOLEAN NOT NULL DEFAULT false,

  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 3.12 subtasks

```sql
CREATE TABLE subtasks (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id             UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,

  -- Template origin
  source_template_subtask_id UUID REFERENCES template_subtasks(id) ON DELETE SET NULL,

  -- Definition
  title               TEXT NOT NULL,
  description         TEXT,

  -- Assignment
  assigned_to         UUID REFERENCES team_members(id) ON DELETE SET NULL,
  assigned_by         UUID REFERENCES team_members(id),

  -- Status
  status              v2_subtask_status NOT NULL DEFAULT 'todo',
  started_at          TIMESTAMPTZ,
  completed_at        TIMESTAMPTZ,
  completed_by        UUID REFERENCES team_members(id),

  -- Approval
  requires_approval   BOOLEAN NOT NULL DEFAULT false,

  -- Ordering
  sort_order          INTEGER NOT NULL DEFAULT 0,

  -- Notes
  notes               TEXT,

  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 3.13 approvals

Tracks multi-level approval chains on tasks and subtasks.

```sql
CREATE TABLE approvals (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Polymorphic target: either a task or a subtask
  task_id             UUID REFERENCES tasks(id) ON DELETE CASCADE,
  subtask_id          UUID REFERENCES subtasks(id) ON DELETE CASCADE,
  -- Exactly one must be non-null (enforced by CHECK)

  -- Approval request
  requested_by        UUID NOT NULL REFERENCES team_members(id),
  requested_at        TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Approver
  approver_id         UUID NOT NULL REFERENCES team_members(id),
  approver_role       TEXT,                          -- Role at time of request (for audit)

  -- Decision
  decision            v2_approval_decision NOT NULL DEFAULT 'pending',
  decided_at          TIMESTAMPTZ,
  reason              TEXT,                          -- Required for rejections

  -- Ordering (for sequential approvals: step 1, step 2, etc.)
  approval_order      INTEGER NOT NULL DEFAULT 0,

  -- Metadata
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT chk_approval_target CHECK (
    (task_id IS NOT NULL AND subtask_id IS NULL) OR
    (task_id IS NULL AND subtask_id IS NOT NULL)
  )
);
```

### 3.14 documents

```sql
CREATE TABLE documents (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Polymorphic associations
  asset_id            UUID REFERENCES assets(id) ON DELETE CASCADE,
  stage_id            UUID REFERENCES asset_stages(id) ON DELETE SET NULL,
  task_id             UUID REFERENCES tasks(id) ON DELETE SET NULL,
  partner_id          UUID REFERENCES partners(id) ON DELETE SET NULL,
  contact_id          UUID REFERENCES contacts(id) ON DELETE SET NULL,

  -- Document identity
  document_type       TEXT NOT NULL,                  -- Flexible text (validated at app layer)
  title               TEXT NOT NULL,
  description         TEXT,

  -- File info
  filename            TEXT NOT NULL,
  file_size_bytes     BIGINT,
  mime_type           TEXT,
  storage_bucket      TEXT NOT NULL,
  storage_path        TEXT NOT NULL,

  -- Versioning
  version             INTEGER NOT NULL DEFAULT 1,
  parent_document_id  UUID REFERENCES documents(id) ON DELETE SET NULL,
  is_current          BOOLEAN NOT NULL DEFAULT true,

  -- Security / Legal hold
  is_locked           BOOLEAN NOT NULL DEFAULT false,
  locked_by           UUID REFERENCES team_members(id),
  locked_at           TIMESTAMPTZ,
  lock_reason         TEXT,

  -- Audit
  uploaded_by         UUID REFERENCES team_members(id),
  uploaded_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  verified_by         UUID REFERENCES team_members(id),
  verified_at         TIMESTAMPTZ,

  -- Expiration
  expires_at          TIMESTAMPTZ,

  -- Tags
  tags                TEXT[] DEFAULT '{}',
  notes               TEXT,

  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 3.15 comments

```sql
CREATE TABLE comments (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Polymorphic parent (exactly one non-null)
  task_id             UUID REFERENCES tasks(id) ON DELETE CASCADE,
  subtask_id          UUID REFERENCES subtasks(id) ON DELETE CASCADE,
  asset_id            UUID REFERENCES assets(id) ON DELETE CASCADE,
  stage_id            UUID REFERENCES asset_stages(id) ON DELETE CASCADE,
  -- At least one must be non-null. Multiple can be set for context
  -- (e.g., a comment on a task within a stage within an asset).

  -- Content
  body                TEXT NOT NULL,
  author_id           UUID NOT NULL REFERENCES team_members(id),

  -- Threading
  parent_comment_id   UUID REFERENCES comments(id) ON DELETE CASCADE,

  -- Mentions
  mentioned_team_ids  UUID[] DEFAULT '{}',

  -- Editing
  is_edited           BOOLEAN NOT NULL DEFAULT false,
  edited_at           TIMESTAMPTZ,

  -- Soft delete (preserve thread integrity)
  is_deleted          BOOLEAN NOT NULL DEFAULT false,

  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 3.16 activity_log (Immutable audit trail)

```sql
CREATE TABLE activity_log (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- What was affected (multiple FKs for rich context)
  asset_id            UUID REFERENCES assets(id) ON DELETE SET NULL,
  stage_id            UUID REFERENCES asset_stages(id) ON DELETE SET NULL,
  task_id             UUID REFERENCES tasks(id) ON DELETE SET NULL,
  subtask_id          UUID REFERENCES subtasks(id) ON DELETE SET NULL,
  document_id         UUID REFERENCES documents(id) ON DELETE SET NULL,
  partner_id          UUID REFERENCES partners(id) ON DELETE SET NULL,
  contact_id          UUID REFERENCES contacts(id) ON DELETE SET NULL,
  comment_id          UUID REFERENCES comments(id) ON DELETE SET NULL,

  -- What happened
  entity_type         TEXT NOT NULL,
  action              v2_audit_action NOT NULL,
  detail              TEXT,                          -- Human-readable summary
  changes             JSONB,                         -- { field: { old: x, new: y } }

  -- Who did it
  performed_by        UUID REFERENCES team_members(id),
  performed_by_name   TEXT,                          -- Denormalized for immutability
  performed_at        TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Context
  ip_address          INET,
  user_agent          TEXT,
  request_id          TEXT,

  -- Classification
  severity            TEXT DEFAULT 'info',
  category            TEXT                           -- compliance, operational, security, financial
);
```

### 3.17 notifications

```sql
CREATE TABLE notifications (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id        UUID NOT NULL REFERENCES team_members(id) ON DELETE CASCADE,

  -- Content
  title               TEXT NOT NULL,
  message             TEXT NOT NULL,
  type                v2_notification_type NOT NULL,

  -- Context (polymorphic — links to the relevant entity)
  asset_id            UUID REFERENCES assets(id) ON DELETE CASCADE,
  stage_id            UUID REFERENCES asset_stages(id) ON DELETE SET NULL,
  task_id             UUID REFERENCES tasks(id) ON DELETE SET NULL,
  subtask_id          UUID REFERENCES subtasks(id) ON DELETE SET NULL,
  comment_id          UUID REFERENCES comments(id) ON DELETE SET NULL,
  approval_id         UUID REFERENCES approvals(id) ON DELETE SET NULL,

  -- Deep link
  action_url          TEXT,

  -- Status
  is_read             BOOLEAN NOT NULL DEFAULT false,
  read_at             TIMESTAMPTZ,
  is_dismissed        BOOLEAN NOT NULL DEFAULT false,

  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 3.18 meeting_notes

```sql
CREATE TABLE meeting_notes (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id            UUID REFERENCES assets(id) ON DELETE SET NULL,
  partner_id          UUID REFERENCES partners(id) ON DELETE SET NULL,
  task_id             UUID REFERENCES tasks(id) ON DELETE SET NULL,

  title               TEXT NOT NULL,
  meeting_date        TIMESTAMPTZ NOT NULL,
  duration_minutes    INTEGER,
  location            TEXT,
  meeting_type        TEXT,

  attendees           JSONB NOT NULL DEFAULT '[]',
  created_by          UUID REFERENCES team_members(id),

  agenda              TEXT,
  summary             TEXT,
  transcript          TEXT,
  ai_summary          TEXT,
  key_decisions       TEXT,
  action_items        JSONB DEFAULT '[]',

  follow_up_date      DATE,
  follow_up_notes     TEXT,
  tags                TEXT[] DEFAULT '{}',

  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 3.19 gate_checks

```sql
CREATE TABLE gate_checks (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id            UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  stage_id            UUID NOT NULL REFERENCES asset_stages(id) ON DELETE CASCADE,

  -- Result
  passed              BOOLEAN NOT NULL,
  checked_by          UUID NOT NULL REFERENCES team_members(id),
  checked_at          TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Gate conditions evaluated
  conditions          JSONB NOT NULL DEFAULT '[]',
  -- Format: [{ "condition": "text", "met": true/false, "notes": "..." }]
  blockers            JSONB DEFAULT '[]',

  -- Approval
  approved_by         UUID REFERENCES team_members(id),
  approved_at         TIMESTAMPTZ,

  notes               TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

## 4. SQL Schema — Indexes

```sql
-- assets
CREATE INDEX idx_assets_status ON assets(status) WHERE NOT is_deleted;
CREATE INDEX idx_assets_phase ON assets(current_phase) WHERE NOT is_deleted;
CREATE INDEX idx_assets_value_model ON assets(value_model) WHERE NOT is_deleted;
CREATE INDEX idx_assets_reference ON assets(reference_code);
CREATE INDEX idx_assets_lead ON assets(lead_team_member_id);
CREATE INDEX idx_assets_template ON assets(source_template_id);
CREATE INDEX idx_assets_metadata ON assets USING GIN(metadata);
CREATE INDEX idx_assets_created ON assets(created_at DESC);

-- contacts
CREATE INDEX idx_contacts_role ON contacts(role);
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_contacts_partner ON contacts(partner_id);
CREATE INDEX idx_contacts_kyc ON contacts(kyc_status);

-- partners
CREATE INDEX idx_partners_type ON partners(type) WHERE NOT is_deleted;
CREATE INDEX idx_partners_dd ON partners(dd_status);
CREATE INDEX idx_partners_engagement ON partners(engagement_status);

-- asset_partners
CREATE INDEX idx_asset_partners_asset ON asset_partners(asset_id);
CREATE INDEX idx_asset_partners_partner ON asset_partners(partner_id);

-- workflow_templates
CREATE INDEX idx_templates_model ON workflow_templates(value_model);
CREATE INDEX idx_templates_default ON workflow_templates(is_default) WHERE is_default;
CREATE INDEX idx_templates_system ON workflow_templates(is_system) WHERE is_system;

-- template_stages
CREATE INDEX idx_template_stages_template ON template_stages(template_id);
CREATE INDEX idx_template_stages_phase ON template_stages(phase);
CREATE INDEX idx_template_stages_sort ON template_stages(template_id, phase, sort_order);

-- template_tasks
CREATE INDEX idx_template_tasks_stage ON template_tasks(template_stage_id);
CREATE INDEX idx_template_tasks_sort ON template_tasks(template_stage_id, sort_order);

-- template_subtasks
CREATE INDEX idx_template_subtasks_task ON template_subtasks(template_task_id);

-- asset_stages
CREATE INDEX idx_asset_stages_asset ON asset_stages(asset_id);
CREATE INDEX idx_asset_stages_phase ON asset_stages(phase);
CREATE INDEX idx_asset_stages_status ON asset_stages(status);
CREATE INDEX idx_asset_stages_sort ON asset_stages(asset_id, phase, sort_order);
CREATE INDEX idx_asset_stages_gate ON asset_stages(is_gate) WHERE is_gate;
CREATE INDEX idx_asset_stages_hidden ON asset_stages(is_hidden) WHERE is_hidden;
CREATE INDEX idx_asset_stages_source ON asset_stages(source_template_stage_id);

-- tasks
CREATE INDEX idx_tasks_asset ON tasks(asset_id) WHERE NOT is_deleted;
CREATE INDEX idx_tasks_stage ON tasks(stage_id) WHERE NOT is_deleted;
CREATE INDEX idx_tasks_assigned ON tasks(assigned_to) WHERE NOT is_deleted;
CREATE INDEX idx_tasks_status ON tasks(status) WHERE NOT is_deleted;
CREATE INDEX idx_tasks_type ON tasks(task_type);
CREATE INDEX idx_tasks_due ON tasks(due_date) WHERE status NOT IN ('done', 'cancelled') AND NOT is_deleted;
CREATE INDEX idx_tasks_sort ON tasks(stage_id, sort_order);

-- subtasks
CREATE INDEX idx_subtasks_task ON subtasks(task_id);
CREATE INDEX idx_subtasks_assigned ON subtasks(assigned_to);
CREATE INDEX idx_subtasks_status ON subtasks(status);

-- approvals
CREATE INDEX idx_approvals_task ON approvals(task_id) WHERE task_id IS NOT NULL;
CREATE INDEX idx_approvals_subtask ON approvals(subtask_id) WHERE subtask_id IS NOT NULL;
CREATE INDEX idx_approvals_approver ON approvals(approver_id);
CREATE INDEX idx_approvals_pending ON approvals(decision) WHERE decision = 'pending';
CREATE INDEX idx_approvals_requested_by ON approvals(requested_by);

-- documents
CREATE INDEX idx_documents_asset ON documents(asset_id);
CREATE INDEX idx_documents_stage ON documents(stage_id);
CREATE INDEX idx_documents_task ON documents(task_id);
CREATE INDEX idx_documents_partner ON documents(partner_id);
CREATE INDEX idx_documents_type ON documents(document_type);
CREATE INDEX idx_documents_locked ON documents(is_locked) WHERE is_locked;
CREATE INDEX idx_documents_current ON documents(is_current) WHERE is_current;
CREATE INDEX idx_documents_expires ON documents(expires_at) WHERE expires_at IS NOT NULL;

-- comments
CREATE INDEX idx_comments_task ON comments(task_id) WHERE task_id IS NOT NULL;
CREATE INDEX idx_comments_subtask ON comments(subtask_id) WHERE subtask_id IS NOT NULL;
CREATE INDEX idx_comments_asset ON comments(asset_id) WHERE asset_id IS NOT NULL;
CREATE INDEX idx_comments_stage ON comments(stage_id) WHERE stage_id IS NOT NULL;
CREATE INDEX idx_comments_author ON comments(author_id);
CREATE INDEX idx_comments_parent ON comments(parent_comment_id);
CREATE INDEX idx_comments_created ON comments(created_at DESC);

-- activity_log
CREATE INDEX idx_activity_asset ON activity_log(asset_id);
CREATE INDEX idx_activity_performed_at ON activity_log(performed_at DESC);
CREATE INDEX idx_activity_entity ON activity_log(entity_type);
CREATE INDEX idx_activity_action ON activity_log(action);
CREATE INDEX idx_activity_category ON activity_log(category);
CREATE INDEX idx_activity_performer ON activity_log(performed_by);
CREATE INDEX idx_activity_task ON activity_log(task_id);

-- notifications
CREATE INDEX idx_notifications_recipient ON notifications(recipient_id);
CREATE INDEX idx_notifications_unread ON notifications(recipient_id, is_read) WHERE NOT is_read;
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_asset ON notifications(asset_id);

-- meeting_notes
CREATE INDEX idx_meetings_asset ON meeting_notes(asset_id);
CREATE INDEX idx_meetings_partner ON meeting_notes(partner_id);
CREATE INDEX idx_meetings_date ON meeting_notes(meeting_date DESC);
CREATE INDEX idx_meetings_task ON meeting_notes(task_id);

-- gate_checks
CREATE INDEX idx_gates_asset ON gate_checks(asset_id);
CREATE INDEX idx_gates_stage ON gate_checks(stage_id);
CREATE INDEX idx_gates_passed ON gate_checks(passed);
```

---

## 5. SQL Schema — Triggers & Functions

```sql
-- ============================================================================
-- AUTO-UPDATE updated_at ON ALL TABLES
-- ============================================================================

CREATE TRIGGER trg_assets_updated_at
  BEFORE UPDATE ON assets FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);

CREATE TRIGGER trg_contacts_updated_at
  BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);

CREATE TRIGGER trg_partners_updated_at
  BEFORE UPDATE ON partners FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);

CREATE TRIGGER trg_workflow_templates_updated_at
  BEFORE UPDATE ON workflow_templates FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);

CREATE TRIGGER trg_template_stages_updated_at
  BEFORE UPDATE ON template_stages FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);

CREATE TRIGGER trg_template_tasks_updated_at
  BEFORE UPDATE ON template_tasks FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);

CREATE TRIGGER trg_template_subtasks_updated_at
  BEFORE UPDATE ON template_subtasks FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);

CREATE TRIGGER trg_asset_stages_updated_at
  BEFORE UPDATE ON asset_stages FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);

CREATE TRIGGER trg_tasks_updated_at
  BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);

CREATE TRIGGER trg_subtasks_updated_at
  BEFORE UPDATE ON subtasks FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);

CREATE TRIGGER trg_approvals_updated_at
  BEFORE UPDATE ON approvals FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);

CREATE TRIGGER trg_documents_updated_at
  BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);

CREATE TRIGGER trg_comments_updated_at
  BEFORE UPDATE ON comments FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);

CREATE TRIGGER trg_meeting_notes_updated_at
  BEFORE UPDATE ON meeting_notes FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);


-- ============================================================================
-- IMMUTABLE ACTIVITY LOG — Prevent UPDATE and DELETE
-- ============================================================================

CREATE OR REPLACE FUNCTION prevent_activity_log_mutation()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'activity_log is immutable. UPDATE and DELETE operations are prohibited.';
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_activity_log_no_update
  BEFORE UPDATE ON activity_log FOR EACH ROW
  EXECUTE FUNCTION prevent_activity_log_mutation();

CREATE TRIGGER trg_activity_log_no_delete
  BEFORE DELETE ON activity_log FOR EACH ROW
  EXECUTE FUNCTION prevent_activity_log_mutation();


-- ============================================================================
-- PREVENT DELETE ON LOCKED DOCUMENTS
-- ============================================================================

CREATE OR REPLACE FUNCTION prevent_locked_document_delete()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.is_locked THEN
    RAISE EXCEPTION 'Cannot delete locked document %. Unlock it first.', OLD.id;
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_documents_no_locked_delete
  BEFORE DELETE ON documents FOR EACH ROW
  EXECUTE FUNCTION prevent_locked_document_delete();


-- ============================================================================
-- AUTO-LOG ACTIVITY ON KEY MUTATIONS
-- ============================================================================
-- Trigger-based audit logging for critical tables.
-- This ensures activity_log is populated by the database, not the application.

CREATE OR REPLACE FUNCTION log_asset_changes()
RETURNS TRIGGER AS $$
DECLARE
  v_changes JSONB := '{}';
  v_action v2_audit_action;
  v_detail TEXT;
BEGIN
  IF TG_OP = 'INSERT' THEN
    v_action := 'created';
    v_detail := 'Asset created: ' || NEW.name;
    INSERT INTO activity_log (asset_id, entity_type, action, detail, performed_at)
    VALUES (NEW.id, 'asset', v_action, v_detail, now());
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Track phase changes
    IF OLD.current_phase IS DISTINCT FROM NEW.current_phase THEN
      v_action := 'phase_advanced';
      v_changes := jsonb_build_object('current_phase', jsonb_build_object('old', OLD.current_phase::TEXT, 'new', NEW.current_phase::TEXT));
      v_detail := 'Phase changed from ' || OLD.current_phase::TEXT || ' to ' || NEW.current_phase::TEXT;
    -- Track status changes
    ELSIF OLD.status IS DISTINCT FROM NEW.status THEN
      v_action := 'status_changed';
      v_changes := jsonb_build_object('status', jsonb_build_object('old', OLD.status::TEXT, 'new', NEW.status::TEXT));
      v_detail := 'Status changed from ' || OLD.status::TEXT || ' to ' || NEW.status::TEXT;
    ELSE
      v_action := 'updated';
      v_detail := 'Asset updated: ' || NEW.name;
    END IF;
    INSERT INTO activity_log (asset_id, entity_type, action, detail, changes, performed_at)
    VALUES (NEW.id, 'asset', v_action, v_detail, v_changes, now());
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_assets_audit
  AFTER INSERT OR UPDATE ON assets FOR EACH ROW
  EXECUTE FUNCTION log_asset_changes();


CREATE OR REPLACE FUNCTION log_task_changes()
RETURNS TRIGGER AS $$
DECLARE
  v_action v2_audit_action;
  v_detail TEXT;
BEGIN
  IF TG_OP = 'INSERT' THEN
    v_action := 'created';
    v_detail := 'Task created: ' || NEW.title;
  ELSIF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status AND NEW.status = 'done' THEN
    v_action := 'task_completed';
    v_detail := 'Task completed: ' || NEW.title;
  ELSE
    v_action := 'updated';
    v_detail := 'Task updated: ' || NEW.title;
  END IF;
  INSERT INTO activity_log (asset_id, task_id, stage_id, entity_type, action, detail, performed_by, performed_at)
  VALUES (NEW.asset_id, NEW.id, NEW.stage_id, 'task', v_action, v_detail, NEW.completed_by, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_tasks_audit
  AFTER INSERT OR UPDATE ON tasks FOR EACH ROW
  EXECUTE FUNCTION log_task_changes();


CREATE OR REPLACE FUNCTION log_document_upload()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO activity_log (asset_id, document_id, entity_type, action, detail, performed_by, performed_at)
  VALUES (NEW.asset_id, NEW.id, 'document', 'document_uploaded',
          'Document uploaded: ' || NEW.title, NEW.uploaded_by, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_documents_audit
  AFTER INSERT ON documents FOR EACH ROW
  EXECUTE FUNCTION log_document_upload();


CREATE OR REPLACE FUNCTION log_comment_posted()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO activity_log (
    asset_id, task_id, subtask_id, comment_id, entity_type, action, detail, performed_by, performed_at
  ) VALUES (
    NEW.asset_id, NEW.task_id, NEW.subtask_id, NEW.id,
    'comment', 'comment_posted',
    'Comment posted by team member',
    NEW.author_id, now()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_comments_audit
  AFTER INSERT ON comments FOR EACH ROW
  EXECUTE FUNCTION log_comment_posted();
```

---

## 6. SQL Schema — RPC Functions

### 6.1 instantiate_workflow — Create stages/tasks/subtasks from a template

```sql
CREATE OR REPLACE FUNCTION instantiate_workflow(
  p_asset_id UUID,
  p_template_id UUID
) RETURNS VOID AS $$
DECLARE
  v_stage RECORD;
  v_task RECORD;
  v_subtask RECORD;
  v_new_stage_id UUID;
  v_new_task_id UUID;
BEGIN
  -- Record which template was used
  UPDATE assets SET source_template_id = p_template_id WHERE id = p_asset_id;

  -- Copy stages
  FOR v_stage IN
    SELECT * FROM template_stages
    WHERE template_id = p_template_id
    ORDER BY phase, sort_order
  LOOP
    INSERT INTO asset_stages (
      asset_id, phase, sort_order, name, description,
      source_template_stage_id, is_gate, gate_id,
      regulatory_basis, regulatory_citation,
      required_document_types, required_approvals
    ) VALUES (
      p_asset_id, v_stage.phase, v_stage.sort_order, v_stage.name, v_stage.description,
      v_stage.id, v_stage.is_gate, v_stage.gate_id,
      v_stage.regulatory_basis, v_stage.regulatory_citation,
      v_stage.required_document_types, v_stage.required_approvals
    ) RETURNING id INTO v_new_stage_id;

    -- Copy tasks for this stage
    FOR v_task IN
      SELECT * FROM template_tasks
      WHERE template_stage_id = v_stage.id
      ORDER BY sort_order
    LOOP
      INSERT INTO tasks (
        asset_id, stage_id, source_template_task_id,
        title, description, task_type,
        estimated_duration_days, estimated_amount,
        payment_recipient, payment_description, sort_order
      ) VALUES (
        p_asset_id, v_new_stage_id, v_task.id,
        v_task.title, v_task.description, v_task.task_type,
        v_task.estimated_duration_days, v_task.estimated_amount,
        v_task.payment_recipient, v_task.payment_description, v_task.sort_order
      ) RETURNING id INTO v_new_task_id;

      -- Resolve default assignee from role
      -- (deferred to application layer — role -> team_member lookup)

      -- Copy subtasks for this task
      FOR v_subtask IN
        SELECT * FROM template_subtasks
        WHERE template_task_id = v_task.id
        ORDER BY sort_order
      LOOP
        INSERT INTO subtasks (
          task_id, source_template_subtask_id,
          title, description, requires_approval, sort_order
        ) VALUES (
          v_new_task_id, v_subtask.id,
          v_subtask.title, v_subtask.description,
          v_subtask.requires_approval, v_subtask.sort_order
        );
      END LOOP;
    END LOOP;
  END LOOP;

  -- Log the instantiation
  INSERT INTO activity_log (asset_id, entity_type, action, detail, performed_at)
  VALUES (p_asset_id, 'asset', 'template_instantiated',
          'Workflow instantiated from template: ' || p_template_id::TEXT, now());
END;
$$ LANGUAGE plpgsql;
```

### 6.2 save_as_template — Capture an asset's current workflow as a new template

```sql
CREATE OR REPLACE FUNCTION save_as_template(
  p_asset_id UUID,
  p_template_name TEXT,
  p_description TEXT DEFAULT NULL,
  p_created_by UUID DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  v_template_id UUID;
  v_asset RECORD;
  v_stage RECORD;
  v_task RECORD;
  v_subtask RECORD;
  v_new_stage_id UUID;
  v_new_task_id UUID;
BEGIN
  -- Get asset info
  SELECT * INTO v_asset FROM assets WHERE id = p_asset_id;

  -- Create the template
  INSERT INTO workflow_templates (
    name, description, value_model, source_asset_id, created_by
  ) VALUES (
    p_template_name, p_description, v_asset.value_model, p_asset_id, p_created_by
  ) RETURNING id INTO v_template_id;

  -- Copy all asset_stages -> template_stages
  FOR v_stage IN
    SELECT * FROM asset_stages
    WHERE asset_id = p_asset_id
    ORDER BY phase, sort_order
  LOOP
    INSERT INTO template_stages (
      template_id, phase, sort_order, name, description,
      regulatory_basis, regulatory_citation,
      is_gate, gate_id, is_hidden,
      required_document_types, required_approvals
    ) VALUES (
      v_template_id, v_stage.phase, v_stage.sort_order, v_stage.name, v_stage.description,
      v_stage.regulatory_basis, v_stage.regulatory_citation,
      v_stage.is_gate, v_stage.gate_id, v_stage.is_hidden,
      v_stage.required_document_types, v_stage.required_approvals
    ) RETURNING id INTO v_new_stage_id;

    -- Copy tasks for this stage
    FOR v_task IN
      SELECT * FROM tasks
      WHERE stage_id = v_stage.id AND NOT is_deleted
      ORDER BY sort_order
    LOOP
      INSERT INTO template_tasks (
        template_stage_id, title, description, task_type,
        estimated_duration_days, estimated_amount,
        payment_recipient, payment_description, sort_order
      ) VALUES (
        v_new_stage_id, v_task.title, v_task.description, v_task.task_type,
        v_task.estimated_duration_days, v_task.estimated_amount,
        v_task.payment_recipient, v_task.payment_description, v_task.sort_order
      ) RETURNING id INTO v_new_task_id;

      -- Copy subtasks
      FOR v_subtask IN
        SELECT * FROM subtasks
        WHERE task_id = v_task.id
        ORDER BY sort_order
      LOOP
        INSERT INTO template_subtasks (
          template_task_id, title, description,
          requires_approval, sort_order
        ) VALUES (
          v_new_task_id, v_subtask.title, v_subtask.description,
          v_subtask.requires_approval, v_subtask.sort_order
        );
      END LOOP;
    END LOOP;
  END LOOP;

  -- Log
  INSERT INTO activity_log (asset_id, entity_type, action, detail, performed_by, performed_at)
  VALUES (p_asset_id, 'template', 'template_saved',
          'Template saved: ' || p_template_name, p_created_by, now());

  RETURN v_template_id;
END;
$$ LANGUAGE plpgsql;
```

### 6.3 evaluate_gate — Check if a gate stage can be passed

```sql
CREATE OR REPLACE FUNCTION evaluate_gate(
  p_stage_id UUID,
  p_checked_by UUID
) RETURNS JSONB AS $$
DECLARE
  v_stage RECORD;
  v_conditions JSONB := '[]';
  v_all_tasks_done BOOLEAN;
  v_required_docs_present BOOLEAN;
  v_all_prior_stages_done BOOLEAN;
  v_can_pass BOOLEAN := true;
  v_result JSONB;
BEGIN
  SELECT * INTO v_stage FROM asset_stages WHERE id = p_stage_id;

  IF NOT v_stage.is_gate THEN
    RAISE EXCEPTION 'Stage % is not a gate', p_stage_id;
  END IF;

  -- Condition 1: All tasks in preceding stages (same phase, lower sort_order) are done
  SELECT NOT EXISTS (
    SELECT 1 FROM tasks t
    JOIN asset_stages s ON t.stage_id = s.id
    WHERE s.asset_id = v_stage.asset_id
      AND s.phase = v_stage.phase
      AND s.sort_order < v_stage.sort_order
      AND NOT s.is_hidden
      AND t.status NOT IN ('done', 'cancelled')
      AND NOT t.is_deleted
  ) INTO v_all_tasks_done;

  v_conditions := v_conditions || jsonb_build_object(
    'condition', 'All tasks in preceding stages are completed',
    'met', v_all_tasks_done
  );
  IF NOT v_all_tasks_done THEN v_can_pass := false; END IF;

  -- Condition 2: All required documents are uploaded
  SELECT NOT EXISTS (
    SELECT unnest(v_stage.required_document_types) AS req_type
    EXCEPT
    SELECT d.document_type FROM documents d
    WHERE d.asset_id = v_stage.asset_id AND d.is_current
  ) INTO v_required_docs_present;

  v_conditions := v_conditions || jsonb_build_object(
    'condition', 'All required documents are uploaded',
    'met', v_required_docs_present
  );
  IF NOT v_required_docs_present THEN v_can_pass := false; END IF;

  -- Condition 3: All prior stages in this phase are completed
  SELECT NOT EXISTS (
    SELECT 1 FROM asset_stages
    WHERE asset_id = v_stage.asset_id
      AND phase = v_stage.phase
      AND sort_order < v_stage.sort_order
      AND NOT is_hidden
      AND status != 'completed'
  ) INTO v_all_prior_stages_done;

  v_conditions := v_conditions || jsonb_build_object(
    'condition', 'All prior stages in this phase are completed',
    'met', v_all_prior_stages_done
  );
  IF NOT v_all_prior_stages_done THEN v_can_pass := false; END IF;

  v_result := jsonb_build_object(
    'can_pass', v_can_pass,
    'conditions', v_conditions,
    'stage_id', p_stage_id,
    'gate_id', v_stage.gate_id
  );

  -- Record the check
  INSERT INTO gate_checks (asset_id, stage_id, passed, checked_by, conditions)
  VALUES (v_stage.asset_id, p_stage_id, v_can_pass, p_checked_by, v_conditions);

  RETURN v_result;
END;
$$ LANGUAGE plpgsql;
```

### 6.4 advance_phase — Move an asset to the next phase

```sql
CREATE OR REPLACE FUNCTION advance_phase(
  p_asset_id UUID,
  p_performed_by UUID
) RETURNS v2_phase AS $$
DECLARE
  v_asset RECORD;
  v_next_phase v2_phase;
  v_phase_order TEXT[] := ARRAY['lead', 'intake', 'asset_maturity', 'security', 'value_creation', 'distribution'];
  v_current_idx INTEGER;
BEGIN
  SELECT * INTO v_asset FROM assets WHERE id = p_asset_id;

  -- Find current phase index
  SELECT array_position(v_phase_order, v_asset.current_phase::TEXT) INTO v_current_idx;

  IF v_current_idx IS NULL OR v_current_idx >= array_length(v_phase_order, 1) THEN
    RAISE EXCEPTION 'Cannot advance beyond distribution phase';
  END IF;

  v_next_phase := v_phase_order[v_current_idx + 1]::v2_phase;

  -- Verify all gates in current phase are passed
  IF EXISTS (
    SELECT 1 FROM asset_stages
    WHERE asset_id = p_asset_id
      AND phase = v_asset.current_phase
      AND is_gate
      AND NOT is_hidden
      AND gate_passed_at IS NULL
  ) THEN
    RAISE EXCEPTION 'Cannot advance: unpassed gates in current phase';
  END IF;

  UPDATE assets SET current_phase = v_next_phase WHERE id = p_asset_id;

  RETURN v_next_phase;
END;
$$ LANGUAGE plpgsql;
```

### 6.5 generate_asset_report — Comprehensive report data

```sql
CREATE OR REPLACE FUNCTION generate_asset_report(p_asset_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'asset', row_to_json(a),
    'holder_contact', (SELECT row_to_json(c) FROM contacts c WHERE c.id = a.asset_holder_contact_id),
    'stages', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'stage', row_to_json(s),
          'tasks', (
            SELECT jsonb_agg(
              jsonb_build_object(
                'task', row_to_json(t),
                'subtasks', (SELECT jsonb_agg(row_to_json(st)) FROM subtasks st WHERE st.task_id = t.id),
                'documents', (SELECT jsonb_agg(row_to_json(d)) FROM documents d WHERE d.task_id = t.id AND d.is_current),
                'comments', (SELECT jsonb_agg(row_to_json(cm) ORDER BY cm.created_at) FROM comments cm WHERE cm.task_id = t.id AND NOT cm.is_deleted),
                'approvals', (SELECT jsonb_agg(row_to_json(ap)) FROM approvals ap WHERE ap.task_id = t.id)
              ) ORDER BY t.sort_order
            ) FROM tasks t WHERE t.stage_id = s.id AND NOT t.is_deleted
          )
        ) ORDER BY s.phase, s.sort_order
      ) FROM asset_stages s WHERE s.asset_id = a.id
    ),
    'partners', (
      SELECT jsonb_agg(row_to_json(p))
      FROM asset_partners ap
      JOIN partners p ON p.id = ap.partner_id
      WHERE ap.asset_id = a.id
    ),
    'documents', (
      SELECT jsonb_agg(row_to_json(d))
      FROM documents d WHERE d.asset_id = a.id AND d.is_current
    ),
    'gate_checks', (
      SELECT jsonb_agg(row_to_json(gc) ORDER BY gc.checked_at)
      FROM gate_checks gc WHERE gc.asset_id = a.id
    ),
    'activity', (
      SELECT jsonb_agg(row_to_json(al) ORDER BY al.performed_at DESC)
      FROM activity_log al WHERE al.asset_id = a.id
      LIMIT 200
    ),
    'generated_at', now()
  ) INTO v_result
  FROM assets a
  WHERE a.id = p_asset_id;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql;
```

### 6.6 batch_document_paths — Get storage paths for batch download

```sql
CREATE OR REPLACE FUNCTION batch_document_paths(
  p_asset_id UUID,
  p_document_ids UUID[] DEFAULT NULL
) RETURNS TABLE (
  document_id UUID,
  title TEXT,
  filename TEXT,
  storage_bucket TEXT,
  storage_path TEXT,
  file_size_bytes BIGINT,
  document_type TEXT,
  stage_name TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    d.id,
    d.title,
    d.filename,
    d.storage_bucket,
    d.storage_path,
    d.file_size_bytes,
    d.document_type,
    s.name AS stage_name
  FROM documents d
  LEFT JOIN asset_stages s ON d.stage_id = s.id
  WHERE d.asset_id = p_asset_id
    AND d.is_current
    AND (p_document_ids IS NULL OR d.id = ANY(p_document_ids));
END;
$$ LANGUAGE plpgsql;
```

### 6.7 is_team_member helper (preserved from V1)

```sql
CREATE OR REPLACE FUNCTION is_team_member()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM team_members
    WHERE auth_user_id = auth.uid()
      AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 7. SQL Schema — Row Level Security

```sql
-- Enable RLS on all tables
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_subtasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE subtasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE gate_checks ENABLE ROW LEVEL SECURITY;

-- Pattern: All active team members can SELECT on all tables.
-- All active team members can INSERT/UPDATE on all tables.
-- Activity log: INSERT only (no update/delete enforced by trigger).
-- Notifications: each user sees only their own.

-- MACRO: Create standard team-member policies for a table
-- (We write each explicitly for clarity)

-- assets
CREATE POLICY "Team can view assets" ON assets FOR SELECT USING (is_team_member());
CREATE POLICY "Team can create assets" ON assets FOR INSERT WITH CHECK (is_team_member());
CREATE POLICY "Team can update assets" ON assets FOR UPDATE USING (is_team_member());

-- contacts
CREATE POLICY "Team can view contacts" ON contacts FOR SELECT USING (is_team_member());
CREATE POLICY "Team can create contacts" ON contacts FOR INSERT WITH CHECK (is_team_member());
CREATE POLICY "Team can update contacts" ON contacts FOR UPDATE USING (is_team_member());

-- partners
CREATE POLICY "Team can view partners" ON partners FOR SELECT USING (is_team_member());
CREATE POLICY "Team can create partners" ON partners FOR INSERT WITH CHECK (is_team_member());
CREATE POLICY "Team can update partners" ON partners FOR UPDATE USING (is_team_member());

-- asset_partners
CREATE POLICY "Team can view asset_partners" ON asset_partners FOR SELECT USING (is_team_member());
CREATE POLICY "Team can manage asset_partners" ON asset_partners FOR ALL USING (is_team_member());

-- workflow_templates
CREATE POLICY "Team can view templates" ON workflow_templates FOR SELECT USING (is_team_member());
CREATE POLICY "Team can create templates" ON workflow_templates FOR INSERT WITH CHECK (is_team_member());
CREATE POLICY "Team can update templates" ON workflow_templates FOR UPDATE USING (is_team_member());

-- template_stages
CREATE POLICY "Team can view template_stages" ON template_stages FOR SELECT USING (is_team_member());
CREATE POLICY "Team can manage template_stages" ON template_stages FOR ALL USING (is_team_member());

-- template_tasks
CREATE POLICY "Team can view template_tasks" ON template_tasks FOR SELECT USING (is_team_member());
CREATE POLICY "Team can manage template_tasks" ON template_tasks FOR ALL USING (is_team_member());

-- template_subtasks
CREATE POLICY "Team can view template_subtasks" ON template_subtasks FOR SELECT USING (is_team_member());
CREATE POLICY "Team can manage template_subtasks" ON template_subtasks FOR ALL USING (is_team_member());

-- asset_stages
CREATE POLICY "Team can view stages" ON asset_stages FOR SELECT USING (is_team_member());
CREATE POLICY "Team can create stages" ON asset_stages FOR INSERT WITH CHECK (is_team_member());
CREATE POLICY "Team can update stages" ON asset_stages FOR UPDATE USING (is_team_member());

-- tasks
CREATE POLICY "Team can view tasks" ON tasks FOR SELECT USING (is_team_member());
CREATE POLICY "Team can create tasks" ON tasks FOR INSERT WITH CHECK (is_team_member());
CREATE POLICY "Team can update tasks" ON tasks FOR UPDATE USING (is_team_member());

-- subtasks
CREATE POLICY "Team can view subtasks" ON subtasks FOR SELECT USING (is_team_member());
CREATE POLICY "Team can manage subtasks" ON subtasks FOR ALL USING (is_team_member());

-- approvals
CREATE POLICY "Team can view approvals" ON approvals FOR SELECT USING (is_team_member());
CREATE POLICY "Team can create approvals" ON approvals FOR INSERT WITH CHECK (is_team_member());
CREATE POLICY "Team can update approvals" ON approvals FOR UPDATE USING (is_team_member());

-- documents
CREATE POLICY "Team can view documents" ON documents FOR SELECT USING (is_team_member());
CREATE POLICY "Team can create documents" ON documents FOR INSERT WITH CHECK (is_team_member());
CREATE POLICY "Team can update documents" ON documents FOR UPDATE USING (is_team_member());
CREATE POLICY "Team can delete unlocked documents" ON documents FOR DELETE USING (is_team_member() AND NOT is_locked);

-- comments
CREATE POLICY "Team can view comments" ON comments FOR SELECT USING (is_team_member());
CREATE POLICY "Team can create comments" ON comments FOR INSERT WITH CHECK (is_team_member());
CREATE POLICY "Team can update own comments" ON comments FOR UPDATE USING (
  is_team_member() AND author_id = (
    SELECT id FROM team_members WHERE auth_user_id = auth.uid()
  )
);

-- activity_log (INSERT ONLY)
CREATE POLICY "Team can view activity" ON activity_log FOR SELECT USING (is_team_member());
CREATE POLICY "Team can insert activity" ON activity_log FOR INSERT WITH CHECK (is_team_member());
-- No UPDATE or DELETE policies. Triggers enforce immutability.

-- notifications (user sees own only)
CREATE POLICY "User sees own notifications" ON notifications FOR SELECT USING (
  recipient_id = (SELECT id FROM team_members WHERE auth_user_id = auth.uid())
);
CREATE POLICY "System can create notifications" ON notifications FOR INSERT WITH CHECK (is_team_member());
CREATE POLICY "User can update own notifications" ON notifications FOR UPDATE USING (
  recipient_id = (SELECT id FROM team_members WHERE auth_user_id = auth.uid())
);

-- meeting_notes
CREATE POLICY "Team can view meetings" ON meeting_notes FOR SELECT USING (is_team_member());
CREATE POLICY "Team can create meetings" ON meeting_notes FOR INSERT WITH CHECK (is_team_member());
CREATE POLICY "Team can update meetings" ON meeting_notes FOR UPDATE USING (is_team_member());

-- gate_checks
CREATE POLICY "Team can view gates" ON gate_checks FOR SELECT USING (is_team_member());
CREATE POLICY "Team can create gates" ON gate_checks FOR INSERT WITH CHECK (is_team_member());
```

---

## 8. SQL Schema — Views

```sql
-- ============================================================================
-- VIEWS
-- ============================================================================

-- 8.1 Pipeline summary (for kanban board)
CREATE OR REPLACE VIEW v_pipeline AS
SELECT
  a.id,
  a.name,
  a.asset_type,
  a.reference_code,
  a.current_phase,
  a.value_model,
  a.status,
  a.claimed_value,
  a.appraised_value,
  a.lead_team_member_id,
  tm.full_name AS lead_name,
  a.created_at,
  a.updated_at,
  -- Progress: count of completed stages / total non-hidden stages
  (SELECT COUNT(*) FROM asset_stages s WHERE s.asset_id = a.id AND s.status = 'completed' AND NOT s.is_hidden)
    AS stages_completed,
  (SELECT COUNT(*) FROM asset_stages s WHERE s.asset_id = a.id AND NOT s.is_hidden)
    AS stages_total,
  -- Open task count
  (SELECT COUNT(*) FROM tasks t WHERE t.asset_id = a.id AND t.status NOT IN ('done', 'cancelled') AND NOT t.is_deleted)
    AS open_tasks,
  -- Overdue task count
  (SELECT COUNT(*) FROM tasks t WHERE t.asset_id = a.id AND t.due_date < now() AND t.status NOT IN ('done', 'cancelled') AND NOT t.is_deleted)
    AS overdue_tasks
FROM assets a
LEFT JOIN team_members tm ON tm.id = a.lead_team_member_id
WHERE NOT a.is_deleted;


-- 8.2 Task dashboard view
CREATE OR REPLACE VIEW v_task_dashboard AS
SELECT
  t.id,
  t.title,
  t.description,
  t.task_type,
  t.status,
  t.assigned_to,
  tm.full_name AS assignee_name,
  t.due_date,
  t.asset_id,
  a.name AS asset_name,
  a.reference_code AS asset_reference,
  t.stage_id,
  s.name AS stage_name,
  s.phase,
  t.sort_order,
  t.created_at,
  t.updated_at,
  -- Subtask progress
  (SELECT COUNT(*) FROM subtasks st WHERE st.task_id = t.id AND st.status = 'done') AS subtasks_done,
  (SELECT COUNT(*) FROM subtasks st WHERE st.task_id = t.id) AS subtasks_total,
  -- Pending approvals
  (SELECT COUNT(*) FROM approvals ap WHERE ap.task_id = t.id AND ap.decision = 'pending') AS pending_approvals
FROM tasks t
LEFT JOIN team_members tm ON tm.id = t.assigned_to
LEFT JOIN assets a ON a.id = t.asset_id
LEFT JOIN asset_stages s ON s.id = t.stage_id
WHERE NOT t.is_deleted;


-- 8.3 Document library view
CREATE OR REPLACE VIEW v_document_library AS
SELECT
  d.id,
  d.title,
  d.document_type,
  d.filename,
  d.file_size_bytes,
  d.mime_type,
  d.storage_bucket,
  d.storage_path,
  d.version,
  d.is_current,
  d.is_locked,
  d.uploaded_by,
  tm.full_name AS uploaded_by_name,
  d.uploaded_at,
  d.verified_by,
  d.verified_at,
  d.expires_at,
  d.asset_id,
  a.name AS asset_name,
  a.reference_code AS asset_reference,
  d.stage_id,
  s.name AS stage_name,
  d.task_id,
  t.title AS task_title,
  d.partner_id,
  p.name AS partner_name,
  d.tags,
  d.created_at
FROM documents d
LEFT JOIN team_members tm ON tm.id = d.uploaded_by
LEFT JOIN assets a ON a.id = d.asset_id
LEFT JOIN asset_stages s ON s.id = d.stage_id
LEFT JOIN tasks t ON t.id = d.task_id
LEFT JOIN partners p ON p.id = d.partner_id;


-- 8.4 Approval queue view
CREATE OR REPLACE VIEW v_approval_queue AS
SELECT
  ap.id AS approval_id,
  ap.approver_id,
  tm_approver.full_name AS approver_name,
  ap.decision,
  ap.requested_at,
  ap.requested_by,
  tm_requester.full_name AS requester_name,
  ap.approval_order,
  -- Task info (if task approval)
  ap.task_id,
  t.title AS task_title,
  t.asset_id,
  a_t.name AS task_asset_name,
  -- Subtask info (if subtask approval)
  ap.subtask_id,
  st.title AS subtask_title,
  st_task.asset_id AS subtask_asset_id
FROM approvals ap
LEFT JOIN team_members tm_approver ON tm_approver.id = ap.approver_id
LEFT JOIN team_members tm_requester ON tm_requester.id = ap.requested_by
LEFT JOIN tasks t ON t.id = ap.task_id
LEFT JOIN assets a_t ON a_t.id = t.asset_id
LEFT JOIN subtasks st ON st.id = ap.subtask_id
LEFT JOIN tasks st_task ON st_task.id = st.task_id
WHERE ap.decision = 'pending';
```

---

## 9. Template Architecture

### How Templates Work

```
SYSTEM DEFAULT TEMPLATES (is_system=true, is_default=true)
├── "Shared Phases" (value_model=NULL)
│   ├── Lead stages (3 stages, 5 tasks)
│   ├── Intake stages (10 stages, 25 tasks)
│   └── Asset Maturity stages (10 stages, 30 tasks)
├── "Tokenization Pipeline" (value_model=tokenization)
│   ├── Security stages (specific to tokenization)
│   ├── Value Creation stages (smart contracts, PoR, etc.)
│   └── Distribution stages (token minting, ATS, etc.)
├── "Fractional Securities Pipeline" (value_model=fractional_securities)
│   ├── Security stages (BD engagement, unit structure, etc.)
│   ├── Value Creation stages (subscription processing, etc.)
│   └── Distribution stages (Form D, investor outreach, etc.)
├── "Debt Instrument Pipeline" (value_model=debt_instrument)
│   └── ... specific stages
├── "Broker Sale Pipeline" (value_model=broker_sale)
│   └── ... specific stages
└── "Barter Pipeline" (value_model=barter)
    └── ... specific stages
```

### Instantiation Flow

1. **Asset created** -> Lead phase with just the "Shared Phases" template stages for lead phase.
2. **Value model selected** (intake or later) -> model-specific template is merged:
   - Shared template stages for `security`, `value_creation`, `distribution` are supplemented by model-specific stages.
   - `instantiate_workflow()` is called, which copies template_stages + template_tasks + template_subtasks into the asset's instance tables.
3. **After instantiation**, the asset's stages/tasks are independent copies. Editing them does NOT affect the template or other assets.

### Template Updates After Instantiation

- Template edits are **forward-only**: they only affect NEW assets instantiated from that template.
- Existing assets keep their snapshot. This is by design for compliance (you cannot retroactively change a regulated workflow after it has started).
- If you need to apply template changes to an existing asset, the UI will offer "Sync from Template" which:
  1. Shows a diff of what would change
  2. Requires manual approval for each change
  3. Only adds NEW stages/tasks — never removes or overwrites existing completed work

### Save As Template

- Any asset's current workflow can be saved as a new template via `save_as_template()`.
- The saved template captures: all stages (including hidden ones), all tasks, all subtasks, with their current names/descriptions/types.
- It does NOT capture: statuses, assignments, dates, comments, documents, approvals (those are instance-level data).
- The saved template gets `source_asset_id` set for traceability.

---

## 10. tRPC Router Plan

### 10.1 `assets` Router

| Procedure | Type | Description |
|-----------|------|-------------|
| `list` | query | Paginated list with filters (phase, status, value_model, search). Returns `v_pipeline` view data. Cursor-based pagination. |
| `getById` | query | Full asset detail with stages, tasks, subtasks, documents, comments, partners, recent activity. |
| `create` | mutation | Create new asset (lead phase). Auto-generates reference code with collision retry. |
| `update` | mutation | Update asset fields (name, description, valuation, metadata, etc.). |
| `updatePhase` | mutation | Advance to next phase. Calls `advance_phase()` RPC which validates gates. |
| `updateStatus` | mutation | Change status (active/paused/completed/terminated/archived). |
| `selectValueModel` | mutation | Set value_model and trigger template instantiation for model-specific phases. |
| `softDelete` | mutation | Soft-delete (set is_deleted=true). |
| `restore` | mutation | Restore from soft delete. |
| `saveAsTemplate` | mutation | Call `save_as_template()` RPC. |
| `instantiateWorkflow` | mutation | Call `instantiate_workflow()` RPC with a template_id. |
| `generateReport` | query | Call `generate_asset_report()` RPC. Returns full JSONB report. |
| `checkReferenceUnique` | query | Validate reference code uniqueness. |
| `getStats` | query | Pipeline stats: count by phase, total value by model, overdue tasks, etc. |

### 10.2 `stages` Router

| Procedure | Type | Description |
|-----------|------|-------------|
| `listByAsset` | query | All stages for an asset, grouped by phase, ordered by sort_order. |
| `create` | mutation | Add a custom stage to an asset (not from template). |
| `update` | mutation | Update stage name, description, regulatory fields. |
| `updateStatus` | mutation | Change stage status (not_started -> in_progress -> completed). |
| `reorder` | mutation | Batch update sort_order for stages within a phase. Accepts array of {id, sort_order}. |
| `toggleHidden` | mutation | Toggle is_hidden flag. |
| `evaluateGate` | mutation | Call `evaluate_gate()` RPC. Returns conditions and pass/fail. |
| `passGate` | mutation | Mark gate as passed (sets gate_passed_at, gate_passed_by). |

### 10.3 `tasks` Router

| Procedure | Type | Description |
|-----------|------|-------------|
| `list` | query | Paginated task list with filters (status, type, assignee, asset, due date range). Uses `v_task_dashboard` view. |
| `getById` | query | Full task detail with subtasks, comments, documents, approvals. |
| `create` | mutation | Create task within a stage. |
| `update` | mutation | Update task fields. |
| `updateStatus` | mutation | Change status with validation (e.g., cannot complete if pending approvals). |
| `assign` | mutation | Assign/reassign task to team member. Creates notification. |
| `reorder` | mutation | Batch reorder tasks within a stage. |
| `softDelete` | mutation | Soft-delete task. |
| `getMyTasks` | query | Tasks assigned to current user. |
| `getOverdue` | query | All overdue tasks across all assets. |
| `getDueToday` | query | Tasks due within 24 hours. |

### 10.4 `subtasks` Router

| Procedure | Type | Description |
|-----------|------|-------------|
| `listByTask` | query | All subtasks for a task. |
| `create` | mutation | Create subtask. |
| `update` | mutation | Update subtask. |
| `updateStatus` | mutation | Change status. If requires_approval, routes to approval flow. |
| `assign` | mutation | Assign subtask. |
| `reorder` | mutation | Reorder within task. |
| `delete` | mutation | Hard delete (subtasks don't have soft delete since they're granular). |

### 10.5 `approvals` Router

| Procedure | Type | Description |
|-----------|------|-------------|
| `getQueue` | query | All pending approvals for current user. Uses `v_approval_queue` view. |
| `getByTask` | query | All approvals for a specific task. |
| `getBySubtask` | query | All approvals for a specific subtask. |
| `request` | mutation | Create approval request(s). Supports multiple approvers. Creates notifications. |
| `decide` | mutation | Record approval decision (approved/rejected/abstained). If all required approvals met, auto-advance task/subtask status. Creates notifications. |
| `cancel` | mutation | Cancel a pending approval request. |

### 10.6 `documents` Router

| Procedure | Type | Description |
|-----------|------|-------------|
| `list` | query | Paginated document list with filters (asset, stage, task, type, locked, expired). Uses `v_document_library` view. |
| `getById` | query | Single document detail with version chain (parent_document_id). |
| `create` | mutation | Create document record after file upload to Supabase Storage. |
| `update` | mutation | Update metadata (title, type, tags, notes). |
| `uploadNewVersion` | mutation | Create new version: set old version's is_current=false, create new row with version+1. |
| `lock` | mutation | Set is_locked=true with reason. |
| `unlock` | mutation | Set is_locked=false. |
| `delete` | mutation | Delete document (blocked if locked). Also deletes from Storage. |
| `getVersionChain` | query | All versions of a document (follow parent_document_id chain). |
| `getBatchPaths` | query | Call `batch_document_paths()` for ZIP download. Returns storage paths. |
| `getRequiredChecklist` | query | For an asset: compare required_document_types from all stages against uploaded documents. Return missing/present status per type. |

### 10.7 `comments` Router

| Procedure | Type | Description |
|-----------|------|-------------|
| `listByEntity` | query | Comments for a task, subtask, asset, or stage. Includes author info. Threaded (parent_comment_id). |
| `create` | mutation | Post comment. Parse @mentions from body. Create notifications for mentioned users and for reply-to author. |
| `update` | mutation | Edit own comment. Sets is_edited=true. |
| `softDelete` | mutation | Soft delete (preserve thread). |

### 10.8 `notifications` Router

| Procedure | Type | Description |
|-----------|------|-------------|
| `list` | query | All notifications for current user. Paginated. Filter by type, read/unread. |
| `getUnreadCount` | query | Count of unread notifications for current user. |
| `markRead` | mutation | Mark one notification as read. |
| `markAllRead` | mutation | Mark all as read for current user. |
| `dismiss` | mutation | Dismiss a notification. |

### 10.9 `templates` Router

| Procedure | Type | Description |
|-----------|------|-------------|
| `list` | query | All templates with stage/task counts. Filter by value_model, system/custom. |
| `getById` | query | Full template with stages, tasks, subtasks. |
| `create` | mutation | Create blank template. |
| `update` | mutation | Update template metadata. |
| `delete` | mutation | Delete non-system template (only if no assets reference it, or with confirmation). |
| `duplicate` | mutation | Clone a template with new name. |
| `addStage` | mutation | Add stage to template. |
| `updateStage` | mutation | Update template stage. |
| `removeStage` | mutation | Remove stage from template. |
| `reorderStages` | mutation | Batch reorder stages. |
| `addTask` | mutation | Add task to template stage. |
| `updateTask` | mutation | Update template task. |
| `removeTask` | mutation | Remove task from template. |
| `addSubtask` | mutation | Add subtask to template task. |
| `updateSubtask` | mutation | Update template subtask. |
| `removeSubtask` | mutation | Remove subtask from template. |

### 10.10 `partners` Router

| Procedure | Type | Description |
|-----------|------|-------------|
| `list` | query | Paginated partner list. Filter by type, dd_status, engagement_status. |
| `getById` | query | Partner detail with contacts, assets, documents. |
| `create` | mutation | Create partner. |
| `update` | mutation | Update partner. |
| `softDelete` | mutation | Soft-delete partner. |
| `linkToAsset` | mutation | Create asset_partners row. |
| `unlinkFromAsset` | mutation | Remove asset_partners row. |

### 10.11 `contacts` Router

| Procedure | Type | Description |
|-----------|------|-------------|
| `list` | query | Paginated contact list. Filter by role, kyc_status. |
| `getById` | query | Contact detail. |
| `create` | mutation | Create contact. |
| `update` | mutation | Update contact. |
| `softDelete` | mutation | Soft-delete. |

### 10.12 `meetings` Router

| Procedure | Type | Description |
|-----------|------|-------------|
| `list` | query | Paginated meeting list. Filter by asset, partner, date range. |
| `getById` | query | Meeting detail. |
| `create` | mutation | Create meeting. |
| `update` | mutation | Update meeting. |
| `delete` | mutation | Delete meeting. |

### 10.13 `activity` Router

| Procedure | Type | Description |
|-----------|------|-------------|
| `list` | query | Paginated activity log. Filter by asset, entity_type, action, performer, date range. |
| `getByAsset` | query | Activity for a specific asset. |
| `export` | query | Export activity log as structured data for CSV/PDF generation. |

### 10.14 `dashboard` Router

| Procedure | Type | Description |
|-----------|------|-------------|
| `getOverview` | query | Executive dashboard data: pipeline funnel (count per phase), total AUM, value by model, risk indicators, compliance score. |
| `getApprovalSummary` | query | Pending approvals by approver. |
| `getTaskSummary` | query | Open/overdue/due-today/completed-this-week counts. |
| `getRecentActivity` | query | Last 20 activity entries across all assets. |

### 10.15 `search` Router

| Procedure | Type | Description |
|-----------|------|-------------|
| `global` | query | Full-text search across assets (name, reference_code), tasks (title), documents (title, filename), partners (name), contacts (full_name, email). Returns categorized results. Uses pg_trgm for fuzzy matching. |

### 10.16 `health` Router

| Procedure | Type | Description |
|-----------|------|-------------|
| `check` | query | Database connectivity check. Returns ok/error. |

---

## 11. Page & Component Plan

### Route Tree

```
/                                    ← Public landing page
/crm                                 ← CRM shell (auth-gated)
  /crm                               ← Pipeline Board (kanban, list, dashboard views)
  /crm/assets                        ← Asset list (table view, filters, search)
  /crm/assets/new                    ← New Asset Wizard (intake form)
  /crm/assets/[id]                   ← Asset Detail (tabbed interface)
  /crm/tasks                         ← Task Dashboard (kanban, list, calendar views)
  /crm/approvals                     ← Approval Queue
  /crm/documents                     ← Document Library
  /crm/partners                      ← Partner directory
  /crm/partners/[id]                 ← Partner detail
  /crm/contacts                      ← Contact directory
  /crm/contacts/[id]                 ← Contact detail
  /crm/meetings                      ← Meeting log
  /crm/activity                      ← Audit trail / activity feed
  /crm/templates                     ← Template library
  /crm/templates/[id]                ← Template editor (stages/tasks/subtasks)
  /crm/compliance                    ← Compliance dashboard
  /crm/team                          ← Team directory
  /crm/settings                      ← Settings page
  /crm/reports                       ← Report generation
  /crm/reports/[assetId]             ← Asset report (printable)
```

### Key Components Per Page

#### `/crm` — Pipeline Board
- `PipelineKanban` — 6 phase columns, asset cards, drag-and-drop between phases with gate validation
- `PipelineList` — Table view with sortable columns
- `PipelineDashboard` — Executive overview (funnel chart, AUM, risk)
- `ViewToggle` — Switch between kanban/list/dashboard
- `QuickAddModal` — Minimal form to create a lead (name, type, claimed_value)
- `StatsRibbon` — Active/paused/overdue/completed counts
- `PhaseFilter` / `ModelFilter` / `StatusFilter`
- `AssetCard` — Kanban card showing name, type, value, progress bar, assignee avatar

#### `/crm/assets/[id]` — Asset Detail
Tabs:
1. **Overview** — Asset metadata, valuation, timeline, partner badges, key stats
2. **Workflow** — Phase-grouped stages, expandable to show tasks, subtasks, progress bars
3. **Tasks** — Flat task list for this asset with filters
4. **Documents** — Document list with upload zone, required checklist, version chains
5. **Comments** — Threaded comment feed for the asset
6. **Partners** — Linked partners with role context
7. **Financials** — Payment tracking (outgoing costs, incoming deposits), model-specific cards
8. **Activity** — Audit trail scoped to this asset
9. **Gates** — Gate milestones with pass/fail status and conditions

Components:
- `PhaseTimeline` — Horizontal phase progress indicator
- `StageAccordion` — Expandable stage with task list, progress, gate indicator
- `TaskCard` — Task with type icon, status badge, assignee, subtask progress, comment count
- `SubtaskChecklist` — Checkbox list within a task
- `ApprovalBanner` — Shows pending approvals on a task
- `DocumentUploadZone` — Drag-and-drop upload area per task/stage
- `CommentThread` — Threaded comments with @mention, reply, edit
- `RequiredDocChecklist` — Shows required doc types vs uploaded (green check / red X)
- `EditAssetModal` — Full edit form for asset metadata
- `SaveAsTemplateModal` — Name + description + save
- `GateEvaluationPanel` — Shows conditions, blockers, pass button

#### `/crm/tasks` — Task Dashboard
- `TaskKanban` — Columns by status (todo, in_progress, blocked, pending_approval, done)
- `TaskList` — Table view with sortable columns
- `TaskCalendar` — Calendar view showing tasks by due date
- `TaskFilters` — Asset, type, assignee, status, due date range
- `TaskStats` — Open, overdue, due today, completed this week
- `CreateTaskModal` — Full task creation form

#### `/crm/approvals` — Approval Queue
- `ApprovalList` — Pending approvals for current user
- `ApprovalCard` — Shows task/subtask context, requested by, requested at
- `ApprovalDecisionModal` — Approve/reject with reason

#### `/crm/documents` — Document Library
- `DocumentTable` — Sortable, filterable table of all documents
- `DocumentGrid` — Card view with thumbnail/type icon
- `DocumentFilters` — Asset, stage, type, locked, expired, date range
- `DocumentPreviewModal` — In-browser PDF/image viewer
- `BatchDownloadButton` — Select multiple -> ZIP download (client-side JSZip or server Edge Function)
- `VersionTimeline` — Shows version chain for a document

#### `/crm/templates` — Template Library
- `TemplateList` — Cards showing template name, model, stage/task counts, system badge
- `CreateTemplateModal` — Name, description, value_model

#### `/crm/templates/[id]` — Template Editor
- `TemplateStageList` — Ordered list of stages grouped by phase, with drag-to-reorder
- `StageEditor` — Inline edit stage name, description, regulatory fields, gate config, required docs
- `TaskEditor` — Add/edit/remove tasks within a stage
- `SubtaskEditor` — Add/edit/remove subtasks within a task
- `AddStageButton` — Add new stage to a phase
- `TemplatePreview` — Read-only view of the full template tree

#### `/crm/partners` — Partner Directory
- `PartnerTable` — Filterable by type, DD status, engagement
- `PartnerCard` — Name, type badge, DD status indicator, contact info
- `CreatePartnerModal`

#### `/crm/partners/[id]` — Partner Detail
- `PartnerOverview` — Contact info, DD status, risk level, fee structure
- `LinkedAssets` — Assets this partner is involved with
- `PartnerDocuments` — Documents associated with this partner
- `PartnerActivity` — Activity log filtered to this partner

#### `/crm/contacts` — Contact Directory
- `ContactTable` — Filterable by role, KYC status
- `CreateContactModal`

#### `/crm/contacts/[id]` — Contact Detail
- `ContactOverview` — Personal info, KYC/OFAC/PEP status
- `LinkedAssets` — Assets this contact is associated with

#### `/crm/meetings` — Meeting Log
- `MeetingList` — Table with date, title, asset, partner
- `CreateMeetingModal`
- `MeetingDetailModal` — Full meeting view with transcript, action items

#### `/crm/activity` — Audit Trail
- `ActivityFeed` — Paginated, filterable activity log
- `ActivityFilters` — Entity type, action, performer, date range, asset
- `ExportButton` — CSV/PDF export

#### `/crm/compliance` — Compliance Dashboard
- `ComplianceScorecard` — Per-asset compliance percentage
- `ExpiringDocuments` — Documents approaching expiration
- `MissingDocuments` — Required documents not yet uploaded
- `GateStatus` — Gates across all assets with pass/fail
- `RiskMatrix` — Assets by risk level

#### `/crm/reports` — Report Generation
- `ReportBuilder` — Select asset, report type, date range
- `ReportPreview` — Full asset report with all phases/stages/tasks/subtasks/documents/comments

#### `/crm/team` — Team Directory
- `TeamGrid` — 3 team members with roles, avatars, task counts

#### `/crm/settings` — Settings
- `ProfileSettings` — Avatar, notification preferences
- `SystemSettings` — Default template selection, reference code format

### Shared Components (src/components/ui/)

| Component | Description |
|-----------|-------------|
| `NeuCard` | Neumorphic raised card |
| `NeuButton` | Neumorphic button (raised -> pressed on click) |
| `NeuInput` | Neumorphic concave input |
| `NeuSelect` | Neumorphic select dropdown |
| `NeuTabs` | Neumorphic tab bar (pressed container, raised active) |
| `NeuBadge` | Status/type badge |
| `NeuModal` | Modal dialog with backdrop |
| `NeuTooltip` | Hover tooltip |
| `NeuDropdown` | Dropdown menu |
| `NeuToggle` | Toggle switch |
| `NeuCheckbox` | Checkbox (pressed -> raised+colored) |
| `NeuAvatar` | Team member avatar |
| `NeuProgress` | Progress bar |
| `NeuSkeleton` | Loading skeleton |
| `NeuPagination` | Cursor-based pagination controls |
| `NeuEmptyState` | Empty state placeholder |
| `NeuConfirmDialog` | Confirmation dialog |
| `NeuDragHandle` | Drag indicator for reorderable lists |
| `NeuFileUpload` | Drag-and-drop file upload zone |

---

## 12. Edge Cases & Design Decisions

### Template Updates After Asset Instantiation

**Decision:** Templates are snapshot-based. When `instantiate_workflow()` runs, it copies the template's stages/tasks/subtasks into the asset's instance tables. After that, the asset's workflow is independent. Template edits affect only future instantiations.

**Rationale:** In a regulated environment, you cannot retroactively change a workflow that is already in progress. The snapshot model preserves compliance integrity.

**Optional sync:** A future "Sync from Template" feature can diff the asset's current stages against the template and show proposed additions. It will never auto-delete or overwrite completed work.

### Approval Chains

**How sequential approvals work:**
1. When an approval is requested, multiple rows are inserted into `approvals` with different `approval_order` values.
2. The first approver (order=0) is notified immediately.
3. When they approve, the next approver (order=1) is notified.
4. If any approver rejects, the chain stops and the task/subtask status is set to `rejected`.
5. When all required approvals are received, the task/subtask auto-advances to `approved` status.

**How parallel approvals work:**
1. All approval rows are inserted with the same `approval_order` (0).
2. All approvers are notified simultaneously.
3. When `min_approvals` threshold from `approval_config` is met, the item advances.

**The `approval_config` JSONB structure:**
```json
{
  "approvers": ["uuid1", "uuid2"],
  "min_approvals": 2,
  "sequential": false
}
```

### Comment Reply Notifications

When a comment is posted:
1. If it has a `parent_comment_id`, the parent comment's author gets a `comment_reply` notification.
2. Any user whose UUID appears in `mentioned_team_ids` gets a `comment_mention` notification.
3. The @mention parsing happens at the application layer (tRPC mutation parses `@Shane`, `@David`, `@Chris` from the body text and resolves to UUIDs).

### Save As Template — What Is Captured

| Captured | Not Captured |
|----------|-------------|
| Stage names, descriptions, order | Stage statuses, completion dates |
| Task titles, descriptions, types | Task assignments, due dates |
| Task sort orders | Task statuses, evidence, comments |
| Subtask titles, approval flags | Subtask assignments, statuses |
| Regulatory basis/citation | Documents, approvals |
| Gate configuration | Gate check results |
| Hidden flag on stages | Activity log entries |
| Required document types | Actual uploaded documents |
| Estimated amounts | Actual payment amounts |

### Batch Document Download

**At the DB level:** `batch_document_paths()` returns the storage_bucket + storage_path for all documents matching the filter. The application layer uses these paths to:

1. **Client-side approach (preferred for <100MB):** Fetch each file from Supabase Storage signed URL, stream into JSZip, trigger download.
2. **Server-side approach (for >100MB):** A Supabase Edge Function or Next.js Route Handler fetches files from Storage, streams them into a ZIP archive, and returns the stream to the client.

The DB function provides the file manifest. The actual ZIP assembly happens outside PostgreSQL.

### Reference Code Collision Prevention

The `reference_code` generation uses a retry loop:
```
1. Generate: PC-{YYYY}-{random 4 digits}
2. Check uniqueness via assets.checkReferenceUnique
3. If collision, regenerate with different random digits
4. Max 5 retries before failing with error
```

This replaces the V1 approach of using `Date.now()` last 4 digits which was vulnerable to collision.

### Soft Delete vs Hard Delete

| Entity | Delete Strategy | Reason |
|--------|----------------|--------|
| Assets | Soft delete (is_deleted) | Compliance — must retain records |
| Tasks | Soft delete (is_deleted) | Audit trail preservation |
| Subtasks | Hard delete | Granular, replaceable, no audit requirement |
| Stages | Never deleted — hide instead (is_hidden) | Compliance — stage history matters |
| Documents | Hard delete (if not locked) | Storage cleanup. Locked docs cannot be deleted. |
| Comments | Soft delete (is_deleted) | Thread integrity |
| Partners | Soft delete (is_deleted) | Relationship history |
| Contacts | Soft delete (is_deleted) | KYC records must be retained |
| Templates | Hard delete (if no assets reference them) | Cleanup. System templates cannot be deleted. |
| Activity log | NEVER deleted | Immutable audit trail |
| Notifications | Hard delete when dismissed | No retention requirement |
| Gate checks | NEVER deleted | Compliance record |
| Approvals | NEVER deleted | Compliance record |

### Pagination Strategy

All list queries use **cursor-based pagination** (not offset):
- Cursor is the `id` of the last item returned (UUID, lexicographically sortable when combined with created_at).
- Default page size: 25 items.
- Response includes `nextCursor` and `hasMore`.
- This avoids the offset-skip performance degradation at scale.

### Optimistic Locking

For concurrent edit protection, the `update` mutations on assets, tasks, and stages include an `expected_updated_at` parameter. The mutation checks:
```sql
WHERE id = $1 AND updated_at = $2
```
If no rows match (someone else updated in between), the mutation returns an error asking the user to reload.

---

## Entity Relationship Summary

```
workflow_templates
  └─ template_stages (1:N)
       └─ template_tasks (1:N)
            └─ template_subtasks (1:N)

assets
  ├─ asset_stages (1:N)
  │    └─ tasks (1:N)
  │         ├─ subtasks (1:N)
  │         ├─ approvals (1:N)
  │         ├─ documents (1:N)
  │         └─ comments (1:N)
  ├─ documents (1:N, at asset level)
  ├─ comments (1:N, at asset level)
  ├─ gate_checks (1:N)
  ├─ meeting_notes (1:N)
  ├─ activity_log (1:N)
  ├─ notifications (via context FKs)
  └─ asset_partners (N:M with partners)

team_members
  ├─ assigned_to on tasks/subtasks
  ├─ approver on approvals
  ├─ author on comments
  ├─ uploaded_by on documents
  ├─ recipient on notifications
  └─ performed_by on activity_log

contacts
  └─ asset_holder_contact_id on assets

partners
  ├─ asset_partners (N:M with assets)
  ├─ documents (1:N)
  └─ meeting_notes (1:N)
```

---

## Default Template Seed Data

The migration should seed these system templates:

1. **"Shared Phases — Lead & Intake"** (value_model=NULL, is_system=true, is_default=true)
   - Lead stages: Initial Contact, NDA & Introduction, Preliminary Assessment
   - Intake stages: KYC/KYB, Provenance Documentation, Certification Review, Preliminary Valuation, Engagement Agreement, Deal Committee Review, Source Gate, Evidence Gate

2. **"Shared Phases — Asset Maturity"** (value_model=NULL, is_system=true, is_default=true)
   - Stages: GIA Lab Submission, SSEF/Gubelin Origin, Appraiser Panel Selection, Sequential 3-Appraisal Process, Variance Analysis, Vault Selection & Transfer, Insurance Verification, SPV Formation, PPM & Legal Documents, Chainlink PoR Setup, Verification Gate, Custody Gate, Legal Gate

3. **"Tokenization Pipeline"** (value_model=tokenization, is_system=true, is_default=true)
   - Security stages: [tokenization-specific legal]
   - Value Creation stages: Platform Configuration, ERC-3643 Compliance Rules, Testnet Deployment, Smart Contract Audit, PoR Activation, Mainnet Deployment, Platform Gate
   - Distribution stages: Form D Filing, Blue Sky Filings, Investor Marketing, Investor KYC, Subscription Processing, Token Minting, Cap Table Update, Ongoing Reporting, Secondary Transfers, Redemption/Exit, Offering Gate

4. **"Fractional Securities Pipeline"** (value_model=fractional_securities, is_system=true, is_default=true)

5. **"Debt Instrument Pipeline"** (value_model=debt_instrument, is_system=true, is_default=true)

6. **"Broker Sale Pipeline"** (value_model=broker_sale, is_system=true, is_default=true)

7. **"Barter Pipeline"** (value_model=barter, is_system=true, is_default=true)

Templates 4-7 will be seeded with appropriate stages and tasks based on the existing governance_requirements data from V1 (which covered tokenization, fractional, and debt paths) plus new stages for broker_sale and barter.

---

*End of V2 Architecture Blueprint*
