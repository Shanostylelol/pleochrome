-- ============================================================================
-- PLEOCHROME POWERHOUSE CRM — Complete Supabase Schema
-- ============================================================================
-- Version: 1.0
-- Date: 2026-03-27
-- Description: Deal/pipeline CRM for tracking real-world asset tokenization
--              workflows across three value paths: Fractional Securities,
--              Tokenization, and Debt Instruments.
--
-- Architecture:
--   - PostgreSQL 15+ on Supabase
--   - Row Level Security (RLS) on every table
--   - Immutable append-only audit trail
--   - JSONB master record for flexible metadata
--   - Partitioned activity log for performance at scale
--   - UUID primary keys throughout
--   - All timestamps UTC with timezone (timestamptz)
--
-- Naming Conventions:
--   - snake_case for all identifiers
--   - Plural table names (assets, documents, partners)
--   - Foreign keys: <referenced_table_singular>_id
--   - Indexes: idx_<table>_<column(s)>
--   - Constraints: chk_<table>_<description>
--   - Triggers: trg_<table>_<action>
-- ============================================================================


-- ============================================================================
-- 0. EXTENSIONS
-- ============================================================================

create extension if not exists "pgcrypto";        -- Cryptographic functions (gen_random_uuid() is built-in PG13+)
create extension if not exists "moddatetime";     -- Auto-update updated_at


-- ============================================================================
-- 1. ENUM TYPES
-- ============================================================================

-- Value path the stone is being processed through
create type value_path as enum (
  'fractional_securities',  -- Reg D 506(c), fractional LLC units
  'tokenization',           -- ERC-3643/ERC-7518 security tokens
  'debt_instruments',       -- Asset-backed lending, UCC Article 9
  'evaluating'              -- Path not yet determined
);

-- Current phase in the workflow (maps to TOKENIZATION-WORKFLOW-COMPLETE.md)
create type workflow_phase as enum (
  'phase_0_foundation',
  'phase_1_intake',
  'phase_2_certification',
  'phase_3_custody',
  'phase_4_legal',
  'phase_5_tokenization',
  'phase_6_regulatory',
  'phase_7_distribution',
  'phase_8_ongoing'
);

-- Step completion status
create type step_status as enum (
  'not_started',
  'in_progress',
  'blocked',
  'completed',
  'skipped'         -- Some steps may not apply to all value paths
);

-- Stone lifecycle status
create type asset_status as enum (
  'prospect',       -- Initial inquiry, not yet engaged
  'screening',      -- In intake/due diligence
  'active',         -- Actively being processed through pipeline
  'paused',         -- Temporarily on hold (blocker, waiting on external)
  'completed',      -- Offering live and in ongoing management
  'terminated',     -- Deal killed / walked away
  'archived'        -- Historical record
);

-- Partner types
create type partner_type as enum (
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
  'other'
);

-- Due diligence status
create type dd_status as enum (
  'not_started',
  'in_progress',
  'passed',
  'failed',
  'expired',        -- DD report older than 12 months
  'waived'          -- Waived with documented justification
);

-- Risk level assessment
create type risk_level as enum (
  'low',
  'medium',
  'high',
  'critical'
);

-- Document types (compliance-specific categories)
create type document_type as enum (
  -- Gemological
  'gia_report',
  'ssef_report',
  'appraisal_report',
  -- Legal / Corporate
  'articles_of_organization',
  'operating_agreement',
  'board_resolution',
  'engagement_agreement',
  'ppm',
  'subscription_agreement',
  'investor_questionnaire',
  'accreditation_verification',
  'legal_opinion',
  -- Compliance / KYC
  'kyc_report',
  'aml_policy',
  'ofac_screening',
  'pep_screening',
  'sanctions_screening',
  'background_check',
  -- Custody
  'custody_receipt',
  'insurance_certificate',
  'transport_manifest',
  'vault_agreement',
  -- Tokenization
  'smart_contract_audit',
  'token_deployment_record',
  'chainlink_por_config',
  -- Regulatory
  'form_d_filing',
  'blue_sky_filing',
  'form_d_amendment',
  -- Financial
  'investor_report',
  'tax_document',
  'fee_schedule',
  'invoice',
  -- Partner DD
  'dd_report',
  'partner_agreement',
  'nda',
  -- Other
  'meeting_recording',
  'transcript',
  'photo',
  'correspondence',
  'other'
);

-- Task priority
create type task_priority as enum (
  'low',
  'medium',
  'high',
  'urgent',
  'blocker'
);

-- Task status
create type task_status as enum (
  'todo',
  'in_progress',
  'review',
  'done',
  'cancelled'
);

-- KYC status for contacts
create type kyc_status as enum (
  'not_started',
  'pending',
  'verified',
  'failed',
  'expired'
);

-- Contact role
create type contact_role as enum (
  'asset_holder',
  'beneficial_owner',
  'investor',
  'partner_contact',
  'counsel',
  'appraiser',
  'vault_manager',
  'regulator',
  'other'
);


-- ============================================================================
-- 2. CORE TABLES
-- ============================================================================

-- --------------------------------------------------------------------------
-- 2.1 TEAM MEMBERS — The PleoChrome internal team
-- --------------------------------------------------------------------------
-- Links to Supabase auth.users for authentication, but stores CRM-specific
-- profile data separately. This table is the source of truth for who can
-- do what inside Powerhouse.

create table team_members (
  id              uuid primary key default gen_random_uuid(),
  auth_user_id    uuid unique references auth.users(id) on delete set null,
  full_name       text not null,
  email           text not null unique,
  role            text not null,                    -- CEO, CTO/COO, CRO, etc.
  title           text,                             -- Formal title
  phone           text,
  avatar_url      text,
  is_active       boolean not null default true,
  dd_status       dd_status not null default 'not_started',
  dd_report_url   text,
  permissions     jsonb not null default '{}',       -- Granular feature flags
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Seed the founding team
comment on table team_members is
  'PleoChrome internal team. Shane (CEO/CCO), David (CTO/COO), Chris (CRO).';


-- --------------------------------------------------------------------------
-- 2.2 STONES — Master asset record (one row per gemstone/barrel)
-- --------------------------------------------------------------------------
-- This is the central entity. Everything in the CRM revolves around an asset.
-- Each row represents one real-world asset being processed through the pipeline,
-- whether it is a single gemstone, a barrel of emeralds, or a future
-- non-gemstone real-world asset.

create table assets (
  id              uuid primary key default gen_random_uuid(),

  -- Identity
  name            text not null,                     -- Human-readable name ("Kandi Emerald Barrel")
  asset_type      text not null,                     -- emerald, sapphire, diamond, ruby, etc.
  description     text,                              -- Free-form description
  reference_code  text unique,                       -- Internal tracking code (e.g., PC-2026-001)

  -- Physical attributes
  carat_weight    decimal(12,2),                     -- Total carat weight
  asset_count     integer,                           -- Number of individual items (for barrels/lots)
  origin          text,                              -- Geographic origin (Colombia, Myanmar, etc.)
  current_location text,                             -- Physical location description

  -- Valuation
  claimed_value   decimal(15,2),                     -- Value claimed by asset holder
  offering_value  decimal(15,2),                     -- Determined offering value (post-appraisal)
  currency        text not null default 'USD',

  -- Pipeline position
  value_path      value_path not null default 'evaluating',
  current_phase   workflow_phase not null default 'phase_0_foundation',
  current_step    text,                              -- e.g., "2.3" for Step 2.3
  status          asset_status not null default 'prospect',

  -- Ownership / counterparty
  asset_holder_contact_id  uuid,                     -- FK to contacts (set after contact created)
  asset_holder_entity      text,                     -- Entity name if applicable (e.g., "White Oak Partners II LLC")

  -- SPV / Legal
  spv_name        text,                              -- e.g., "PleoChrome Series A LLC"
  spv_ein         text,

  -- Team assignment
  lead_team_member_id  uuid references team_members(id),
  assigned_team_ids    uuid[] default '{}',          -- Array of team_member IDs involved

  -- Flexible metadata (see JSONB structure documentation below)
  metadata        jsonb not null default '{}',

  -- Timestamps
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  completed_at    timestamptz,
  terminated_at   timestamptz,
  termination_reason text
);

create index idx_stones_status on assets(status);
create index idx_stones_current_phase on assets(current_phase);
create index idx_stones_value_path on assets(value_path);
create index idx_stones_reference_code on assets(reference_code);
create index idx_stones_lead_team_member on assets(lead_team_member_id);
create index idx_stones_metadata on assets using gin(metadata);

comment on table assets is
  'Master asset record. One row per gemstone/barrel being processed through PleoChrome pipeline.';


-- --------------------------------------------------------------------------
-- 2.3 ASSET STEPS — Tracking completion of each workflow step per asset
-- --------------------------------------------------------------------------
-- Pre-populated when an asset is created, based on its value_path.
-- Each row represents one step from the TOKENIZATION-WORKFLOW-COMPLETE.md
-- (or equivalent workflow for fractional/debt paths).

create table asset_steps (
  id              uuid primary key default gen_random_uuid(),
  asset_id        uuid not null references assets(id) on delete cascade,

  -- Step identification
  phase           workflow_phase not null,
  step_number     text not null,                     -- "0.1", "1.3", "2.5", etc.
  step_title      text not null,                     -- Human-readable title
  step_description text,                             -- What this step entails

  -- Status tracking
  status          step_status not null default 'not_started',
  started_at      timestamptz,
  completed_at    timestamptz,
  completed_by    uuid references team_members(id),
  blocked_reason  text,                              -- Why it is blocked
  blocked_at      timestamptz,

  -- Dependencies
  depends_on      uuid[],                            -- Array of asset_step IDs this depends on
  is_gate         boolean not null default false,     -- Is this a gate check?

  -- Evidence and notes
  notes           text,
  evidence_urls   text[] default '{}',               -- Links to supporting documents/evidence

  -- Cost tracking
  estimated_cost_low   decimal(12,2),
  estimated_cost_mid   decimal(12,2),
  estimated_cost_high  decimal(12,2),
  actual_cost          decimal(12,2),

  -- Timeline
  estimated_duration_days integer,
  due_date        timestamptz,

  -- Ordering
  sort_order      integer not null default 0,

  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  -- Prevent duplicate steps per asset
  unique(asset_id, step_number)
);

create index idx_asset_steps_stone on asset_steps(asset_id);
create index idx_asset_steps_status on asset_steps(status);
create index idx_asset_steps_phase on asset_steps(phase);
create index idx_asset_steps_is_gate on asset_steps(is_gate) where is_gate = true;

comment on table asset_steps is
  'Tracks completion of each workflow step per asset. Pre-populated from workflow template.';


-- --------------------------------------------------------------------------
-- 2.4 PARTNERS — External partners with due diligence status
-- --------------------------------------------------------------------------

create table partners (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  type            partner_type not null,
  website         text,
  description     text,

  -- Due diligence
  dd_status       dd_status not null default 'not_started',
  dd_report_url   text,
  dd_completed_at timestamptz,
  dd_expires_at   timestamptz,                       -- DD reports expire after 12 months
  risk_level      risk_level,

  -- Primary contact
  contact_name    text,
  contact_email   text,
  contact_phone   text,
  contact_title   text,

  -- Engagement
  engagement_status text default 'evaluating',       -- evaluating, engaged, contracted, terminated
  contract_start  date,
  contract_end    date,
  fee_structure   jsonb,                             -- Flexible fee terms

  -- Notes
  notes           text,
  tags            text[] default '{}',

  -- Metadata
  metadata        jsonb not null default '{}',

  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index idx_partners_type on partners(type);
create index idx_partners_dd_status on partners(dd_status);
create index idx_partners_engagement on partners(engagement_status);

comment on table partners is
  'External partners (appraisers, vaults, BD, counsel, platforms) with DD tracking.';


-- --------------------------------------------------------------------------
-- 2.5 CONTACTS — People associated with assets, partners, or investors
-- --------------------------------------------------------------------------

create table contacts (
  id              uuid primary key default gen_random_uuid(),
  full_name       text not null,
  role            contact_role not null default 'other',
  title           text,
  entity          text,                              -- Company/LLC name
  email           text,
  phone           text,
  address         text,

  -- Compliance
  kyc_status      kyc_status not null default 'not_started',
  kyc_verified_at timestamptz,
  kyc_expires_at  timestamptz,
  ofac_status     text default 'not_screened',       -- not_screened, clear, flagged, match
  ofac_screened_at timestamptz,
  pep_status      text default 'not_screened',       -- not_screened, clear, is_pep
  pep_screened_at timestamptz,

  -- Relationships
  partner_id      uuid references partners(id) on delete set null,
  asset_ids       uuid[] default '{}',               -- Stones this contact is associated with

  -- Notes
  notes           text,
  tags            text[] default '{}',

  -- Metadata
  metadata        jsonb not null default '{}',

  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Now add the FK from assets to contacts
alter table assets
  add constraint fk_stones_asset_holder
  foreign key (asset_holder_contact_id)
  references contacts(id) on delete set null;

create index idx_contacts_role on contacts(role);
create index idx_contacts_kyc_status on contacts(kyc_status);
create index idx_contacts_partner on contacts(partner_id);
create index idx_contacts_email on contacts(email);

comment on table contacts is
  'People associated with assets, partners, or as investors. Tracks KYC/OFAC/PEP status.';


-- --------------------------------------------------------------------------
-- 2.6 DOCUMENTS — Files attached to assets, steps, partners, or meetings
-- --------------------------------------------------------------------------
-- Metadata about files stored in Supabase Storage buckets.
-- Supports versioning: same logical document can have multiple versions.

create table documents (
  id              uuid primary key default gen_random_uuid(),

  -- Associations (polymorphic — at least one should be set)
  asset_id        uuid references assets(id) on delete cascade,
  step_id         uuid references asset_steps(id) on delete set null,
  partner_id      uuid references partners(id) on delete set null,
  contact_id      uuid references contacts(id) on delete set null,
  meeting_id      uuid,                              -- FK added after meeting_notes table

  -- Document identity
  document_type   document_type not null,
  title           text not null,                     -- Human-readable title
  description     text,

  -- File info
  filename        text not null,
  file_size_bytes bigint,
  mime_type       text,
  storage_bucket  text not null,                     -- Which Supabase bucket
  storage_path    text not null,                     -- Full path within bucket

  -- Versioning
  version         integer not null default 1,
  parent_document_id uuid references documents(id),  -- Previous version
  is_current      boolean not null default true,     -- Is this the current version?

  -- Security
  is_locked       boolean not null default false,    -- Legal hold — cannot be deleted
  locked_by       uuid references team_members(id),
  locked_at       timestamptz,
  lock_reason     text,

  -- Audit
  uploaded_by     uuid references team_members(id),
  uploaded_at     timestamptz not null default now(),
  verified_by     uuid references team_members(id),
  verified_at     timestamptz,

  -- Expiration (for time-sensitive docs like insurance certs)
  expires_at      timestamptz,

  -- Tags and notes
  tags            text[] default '{}',
  notes           text,

  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index idx_documents_stone on documents(asset_id);
create index idx_documents_step on documents(step_id);
create index idx_documents_partner on documents(partner_id);
create index idx_documents_type on documents(document_type);
create index idx_documents_is_locked on documents(is_locked) where is_locked = true;
create index idx_documents_is_current on documents(is_current) where is_current = true;
create index idx_documents_expires on documents(expires_at) where expires_at is not null;

comment on table documents is
  'File metadata for all documents. Actual files stored in Supabase Storage buckets.';


-- --------------------------------------------------------------------------
-- 2.7 ACTIVITY LOG — Immutable audit trail (append-only)
-- --------------------------------------------------------------------------
-- CRITICAL: This table is INSERT-ONLY. No UPDATE or DELETE is ever permitted.
-- RLS policies enforce this. A trigger also prevents UPDATE/DELETE at the
-- database level as a defense-in-depth measure.

create table activity_log (
  id              uuid primary key default gen_random_uuid(),

  -- What was affected
  asset_id        uuid references assets(id) on delete set null,
  step_id         uuid references asset_steps(id) on delete set null,
  partner_id      uuid references partners(id) on delete set null,
  contact_id      uuid references contacts(id) on delete set null,
  document_id     uuid references documents(id) on delete set null,

  -- What happened
  entity_type     text not null,                     -- 'stone', 'step', 'partner', etc.
  action          text not null,                     -- 'created', 'updated', 'status_changed', etc.
  detail          text,                              -- Human-readable description
  changes         jsonb,                             -- { field: { old: x, new: y } }

  -- Who did it
  performed_by    uuid references team_members(id),
  performed_by_name text,                            -- Denormalized for immutability
  performed_at    timestamptz not null default now(),

  -- Context
  ip_address      inet,
  user_agent      text,
  request_id      text,                              -- For correlating related actions

  -- Severity / classification
  severity        text default 'info',               -- info, warning, error, critical
  category        text                               -- compliance, operational, security, financial
);

-- Partition by month for performance (activity_log grows fast)
-- Note: In Supabase, partitioning is done via SQL. For initial deployment,
-- we use a simple index strategy. Partitioning can be added when volume demands it.

create index idx_activity_log_stone on activity_log(asset_id);
create index idx_activity_log_performed_at on activity_log(performed_at desc);
create index idx_activity_log_entity_type on activity_log(entity_type);
create index idx_activity_log_action on activity_log(action);
create index idx_activity_log_category on activity_log(category);
create index idx_activity_log_performed_by on activity_log(performed_by);

comment on table activity_log is
  'IMMUTABLE audit trail. INSERT-ONLY. No UPDATE or DELETE permitted. Ever.';


-- --------------------------------------------------------------------------
-- 2.8 MEETING NOTES — Meeting records with transcripts and AI summaries
-- --------------------------------------------------------------------------

create table meeting_notes (
  id              uuid primary key default gen_random_uuid(),

  -- Associations
  asset_id        uuid references assets(id) on delete set null,
  partner_id      uuid references partners(id) on delete set null,

  -- Meeting details
  title           text not null,
  meeting_date    timestamptz not null,
  duration_minutes integer,
  location        text,                              -- "Zoom", "In person — Seattle", etc.
  meeting_type    text,                              -- intro_call, dd_review, legal_review, etc.

  -- Participants
  attendees       jsonb not null default '[]',       -- [{ name, role, email }]
  created_by      uuid references team_members(id),

  -- Content
  agenda          text,
  summary         text,                              -- Human-written summary
  transcript      text,                              -- Full transcript (from Otter.ai, etc.)
  ai_summary      text,                              -- AI-generated summary
  key_decisions   text,                              -- Decisions made in meeting
  action_items    jsonb default '[]',                -- [{ task, assignee, due_date, status }]

  -- Follow-up
  follow_up_date  date,
  follow_up_notes text,

  -- Tags
  tags            text[] default '{}',

  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Add the FK from documents to meeting_notes
alter table documents
  add constraint fk_documents_meeting
  foreign key (meeting_id)
  references meeting_notes(id) on delete set null;

create index idx_meeting_notes_stone on meeting_notes(asset_id);
create index idx_meeting_notes_partner on meeting_notes(partner_id);
create index idx_meeting_notes_date on meeting_notes(meeting_date desc);

comment on table meeting_notes is
  'Meeting records with human and AI summaries, transcripts, action items.';


-- --------------------------------------------------------------------------
-- 2.9 TASKS — To-do items at each step
-- --------------------------------------------------------------------------

create table tasks (
  id              uuid primary key default gen_random_uuid(),

  -- Associations
  asset_id        uuid references assets(id) on delete cascade,
  step_id         uuid references asset_steps(id) on delete set null,
  meeting_id      uuid references meeting_notes(id) on delete set null,

  -- Task details
  title           text not null,
  description     text,
  priority        task_priority not null default 'medium',
  status          task_status not null default 'todo',

  -- Assignment
  assigned_to     uuid references team_members(id),
  assigned_by     uuid references team_members(id),

  -- Timeline
  due_date        timestamptz,
  started_at      timestamptz,
  completed_at    timestamptz,
  completed_by    uuid references team_members(id),

  -- Dependencies
  depends_on_task_id uuid references tasks(id),
  blocks_step_id     uuid references asset_steps(id),  -- If this task blocks a step

  -- Notes
  notes           text,
  tags            text[] default '{}',

  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index idx_tasks_stone on tasks(asset_id);
create index idx_tasks_step on tasks(step_id);
create index idx_tasks_assigned_to on tasks(assigned_to);
create index idx_tasks_status on tasks(status);
create index idx_tasks_due_date on tasks(due_date) where status != 'done' and status != 'cancelled';
create index idx_tasks_priority on tasks(priority) where status != 'done' and status != 'cancelled';

comment on table tasks is
  'To-do items generated from workflow steps, meetings, or manually. Assignable with due dates.';


-- --------------------------------------------------------------------------
-- 2.10 GATE CHECKS — Formal gate passage records
-- --------------------------------------------------------------------------
-- Each phase ends with a gate check. All gate conditions must be met before
-- the stone can advance to the next phase. This table records gate attempts
-- (both passed and failed).

create table gate_checks (
  id              uuid primary key default gen_random_uuid(),
  asset_id        uuid not null references assets(id) on delete cascade,

  -- Gate identification
  gate_number     integer not null,                  -- 0, 1, 2, 3, 4, 5, 6, 7
  gate_name       text not null,                     -- "Foundation Complete", "Intake Clear", etc.
  phase_from      workflow_phase not null,            -- Phase being completed
  phase_to        workflow_phase,                     -- Phase being entered (null if failed)

  -- Result
  passed          boolean not null,
  checked_by      uuid not null references team_members(id),
  checked_at      timestamptz not null default now(),

  -- Gate conditions
  conditions      jsonb not null default '[]',       -- [{ condition, met: bool, notes }]
  blockers        jsonb default '[]',                -- [{ description, severity, owner }]

  -- Approval chain
  approved_by     uuid references team_members(id),  -- Final approver (may differ from checker)
  approved_at     timestamptz,

  -- Notes
  notes           text,

  created_at      timestamptz not null default now()
);

create index idx_gate_checks_stone on gate_checks(asset_id);
create index idx_gate_checks_passed on gate_checks(passed);
create index idx_gate_checks_gate on gate_checks(gate_number);

comment on table gate_checks is
  'Formal gate passage records. Each phase transition requires a passed gate check.';


-- --------------------------------------------------------------------------
-- 2.11 ASSET PARTNERS — Junction table: which partners are involved per asset
-- --------------------------------------------------------------------------

create table asset_partners (
  id              uuid primary key default gen_random_uuid(),
  asset_id        uuid not null references assets(id) on delete cascade,
  partner_id      uuid not null references partners(id) on delete cascade,
  role_on_asset   text,                              -- "Primary Appraiser", "Vault Custodian", etc.
  engagement_date date,
  notes           text,
  created_at      timestamptz not null default now(),

  unique(asset_id, partner_id)
);

create index idx_asset_partners_stone on asset_partners(asset_id);
create index idx_asset_partners_partner on asset_partners(partner_id);

comment on table asset_partners is
  'Junction table mapping partners to specific assets with role context.';


-- --------------------------------------------------------------------------
-- 2.12 NOTIFICATIONS — In-app notification system
-- --------------------------------------------------------------------------

create table notifications (
  id              uuid primary key default gen_random_uuid(),
  recipient_id    uuid not null references team_members(id) on delete cascade,

  -- Content
  title           text not null,
  message         text not null,
  type            text not null default 'info',       -- info, warning, action_required, deadline
  priority        text not null default 'normal',     -- low, normal, high, urgent

  -- Context
  asset_id        uuid references assets(id) on delete cascade,
  step_id         uuid references asset_steps(id) on delete set null,
  task_id         uuid references tasks(id) on delete set null,
  action_url      text,                              -- Deep link within the app

  -- Status
  is_read         boolean not null default false,
  read_at         timestamptz,
  is_dismissed    boolean not null default false,

  created_at      timestamptz not null default now()
);

create index idx_notifications_recipient on notifications(recipient_id);
create index idx_notifications_unread on notifications(recipient_id, is_read)
  where is_read = false;
create index idx_notifications_stone on notifications(asset_id);

comment on table notifications is
  'In-app notifications for team members. Triggered by workflow events.';


-- --------------------------------------------------------------------------
-- 2.13 COMMENTS — Threaded comments on any entity
-- --------------------------------------------------------------------------

create table comments (
  id              uuid primary key default gen_random_uuid(),

  -- Polymorphic parent
  entity_type     text not null,                     -- 'stone', 'step', 'document', 'task', etc.
  entity_id       uuid not null,                     -- ID of the parent entity

  -- Content
  body            text not null,
  author_id       uuid not null references team_members(id),

  -- Threading
  parent_comment_id uuid references comments(id),

  -- Mentions
  mentioned_team_ids uuid[] default '{}',

  -- Editing
  is_edited       boolean not null default false,
  edited_at       timestamptz,

  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index idx_comments_entity on comments(entity_type, entity_id);
create index idx_comments_author on comments(author_id);
create index idx_comments_parent on comments(parent_comment_id);

comment on table comments is
  'Threaded comments attachable to any entity. Supports mentions and threading.';


-- ============================================================================
-- 3. TRIGGERS — Automated behaviors
-- ============================================================================

-- --------------------------------------------------------------------------
-- 3.1 Auto-update updated_at timestamps
-- --------------------------------------------------------------------------

create trigger trg_stones_updated_at
  before update on assets
  for each row execute function moddatetime(updated_at);

create trigger trg_asset_steps_updated_at
  before update on asset_steps
  for each row execute function moddatetime(updated_at);

create trigger trg_partners_updated_at
  before update on partners
  for each row execute function moddatetime(updated_at);

create trigger trg_contacts_updated_at
  before update on contacts
  for each row execute function moddatetime(updated_at);

create trigger trg_documents_updated_at
  before update on documents
  for each row execute function moddatetime(updated_at);

create trigger trg_meeting_notes_updated_at
  before update on meeting_notes
  for each row execute function moddatetime(updated_at);

create trigger trg_tasks_updated_at
  before update on tasks
  for each row execute function moddatetime(updated_at);

create trigger trg_team_members_updated_at
  before update on team_members
  for each row execute function moddatetime(updated_at);

create trigger trg_comments_updated_at
  before update on comments
  for each row execute function moddatetime(updated_at);


-- --------------------------------------------------------------------------
-- 3.2 IMMUTABLE ACTIVITY LOG — Prevent UPDATE and DELETE
-- --------------------------------------------------------------------------

create or replace function prevent_activity_log_mutation()
returns trigger as $$
begin
  raise exception 'activity_log is immutable. UPDATE and DELETE operations are prohibited.';
  return null;
end;
$$ language plpgsql;

create trigger trg_activity_log_no_update
  before update on activity_log
  for each row execute function prevent_activity_log_mutation();

create trigger trg_activity_log_no_delete
  before delete on activity_log
  for each row execute function prevent_activity_log_mutation();


-- --------------------------------------------------------------------------
-- 3.3 DOCUMENT LOCK — Prevent deletion of locked documents
-- --------------------------------------------------------------------------

create or replace function prevent_locked_document_delete()
returns trigger as $$
begin
  if old.is_locked = true then
    raise exception 'Cannot delete document % — it is under legal hold.', old.id;
    return null;
  end if;
  return old;
end;
$$ language plpgsql;

create trigger trg_documents_no_delete_locked
  before delete on documents
  for each row execute function prevent_locked_document_delete();

-- Also prevent unlocking without proper authorization
create or replace function protect_document_lock()
returns trigger as $$
begin
  -- If someone is trying to change is_locked from true to false
  if old.is_locked = true and new.is_locked = false then
    -- Only allow if the lock_reason is being cleared with a new reason
    -- In practice, this would check the user's role via auth.uid()
    -- For now, we require lock_reason to be explicitly set to track the unlock
    if new.lock_reason is null or new.lock_reason = old.lock_reason then
      raise exception 'Cannot unlock document without providing a new lock_reason documenting why the hold was lifted.';
      return null;
    end if;
  end if;
  return new;
end;
$$ language plpgsql;

create trigger trg_documents_protect_lock
  before update on documents
  for each row execute function protect_document_lock();


-- --------------------------------------------------------------------------
-- 3.4 AUTO-LOG STONE STATUS CHANGES
-- --------------------------------------------------------------------------
-- Automatically creates an activity_log entry whenever an asset's status,
-- phase, or step changes.

create or replace function log_stone_changes()
returns trigger as $$
declare
  changes_json jsonb := '{}';
begin
  if old.status is distinct from new.status then
    changes_json := changes_json || jsonb_build_object('status', jsonb_build_object('old', old.status::text, 'new', new.status::text));
  end if;
  if old.current_phase is distinct from new.current_phase then
    changes_json := changes_json || jsonb_build_object('current_phase', jsonb_build_object('old', old.current_phase::text, 'new', new.current_phase::text));
  end if;
  if old.current_step is distinct from new.current_step then
    changes_json := changes_json || jsonb_build_object('current_step', jsonb_build_object('old', old.current_step, 'new', new.current_step));
  end if;
  if old.offering_value is distinct from new.offering_value then
    changes_json := changes_json || jsonb_build_object('offering_value', jsonb_build_object('old', old.offering_value::text, 'new', new.offering_value::text));
  end if;

  if changes_json != '{}' then
    insert into activity_log (
      asset_id, entity_type, action, detail, changes,
      performed_by, category, severity
    ) values (
      new.id,
      'stone',
      case
        when old.status is distinct from new.status then 'status_changed'
        when old.current_phase is distinct from new.current_phase then 'phase_advanced'
        else 'updated'
      end,
      'Stone "' || new.name || '" updated',
      changes_json,
      new.lead_team_member_id,
      'operational',
      case
        when new.status = 'terminated' then 'critical'
        when old.current_phase is distinct from new.current_phase then 'warning'
        else 'info'
      end
    );
  end if;

  return new;
end;
$$ language plpgsql;

create trigger trg_stones_log_changes
  after update on assets
  for each row execute function log_stone_changes();


-- --------------------------------------------------------------------------
-- 3.5 AUTO-LOG STEP COMPLETIONS
-- --------------------------------------------------------------------------

create or replace function log_step_completion()
returns trigger as $$
begin
  if old.status is distinct from new.status and new.status = 'completed' then
    insert into activity_log (
      asset_id, step_id, entity_type, action, detail,
      performed_by, category, severity
    ) values (
      new.asset_id,
      new.id,
      'step',
      'step_completed',
      'Step ' || new.step_number || ' "' || new.step_title || '" completed',
      new.completed_by,
      'operational',
      'info'
    );
  end if;

  if old.status is distinct from new.status and new.status = 'blocked' then
    insert into activity_log (
      asset_id, step_id, entity_type, action, detail,
      performed_by, category, severity,
      changes
    ) values (
      new.asset_id,
      new.id,
      'step',
      'step_blocked',
      'Step ' || new.step_number || ' "' || new.step_title || '" BLOCKED: ' || coalesce(new.blocked_reason, 'No reason provided'),
      new.completed_by,
      'operational',
      'warning',
      jsonb_build_object('blocked_reason', new.blocked_reason)
    );
  end if;

  return new;
end;
$$ language plpgsql;

create trigger trg_asset_steps_log_completion
  after update on asset_steps
  for each row execute function log_step_completion();


-- ============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on ALL tables
alter table team_members enable row level security;
alter table assets enable row level security;
alter table asset_steps enable row level security;
alter table partners enable row level security;
alter table contacts enable row level security;
alter table documents enable row level security;
alter table activity_log enable row level security;
alter table meeting_notes enable row level security;
alter table tasks enable row level security;
alter table gate_checks enable row level security;
alter table asset_partners enable row level security;
alter table notifications enable row level security;
alter table comments enable row level security;

-- --------------------------------------------------------------------------
-- Helper function: Get current team member ID from auth
-- --------------------------------------------------------------------------

create or replace function get_team_member_id()
returns uuid as $$
  select id from team_members where auth_user_id = auth.uid() limit 1;
$$ language sql security definer stable;


-- --------------------------------------------------------------------------
-- Helper function: Check if current user is an active team member
-- --------------------------------------------------------------------------

create or replace function is_team_member()
returns boolean as $$
  select exists(
    select 1 from team_members
    where auth_user_id = auth.uid() and is_active = true
  );
$$ language sql security definer stable;


-- --------------------------------------------------------------------------
-- 4.1 TEAM MEMBERS policies
-- --------------------------------------------------------------------------

-- All active team members can view the team
create policy "Team members can view all team members"
  on team_members for select
  using (is_team_member());

-- Only the user themselves can update their own profile
create policy "Team members can update own profile"
  on team_members for update
  using (auth_user_id = auth.uid())
  with check (auth_user_id = auth.uid());


-- --------------------------------------------------------------------------
-- 4.2 STONES policies
-- --------------------------------------------------------------------------

-- All team members can view all assets
create policy "Team members can view all assets"
  on assets for select
  using (is_team_member());

-- All team members can insert assets
create policy "Team members can create assets"
  on assets for insert
  with check (is_team_member());

-- All team members can update assets
create policy "Team members can update assets"
  on assets for update
  using (is_team_member())
  with check (is_team_member());

-- Stones should never be hard-deleted (use terminated status instead)
-- No DELETE policy = no deletion allowed via API


-- --------------------------------------------------------------------------
-- 4.3 ASSET STEPS policies
-- --------------------------------------------------------------------------

create policy "Team members can view all steps"
  on asset_steps for select
  using (is_team_member());

create policy "Team members can create steps"
  on asset_steps for insert
  with check (is_team_member());

create policy "Team members can update steps"
  on asset_steps for update
  using (is_team_member())
  with check (is_team_member());


-- --------------------------------------------------------------------------
-- 4.4 PARTNERS policies
-- --------------------------------------------------------------------------

create policy "Team members can view all partners"
  on partners for select
  using (is_team_member());

create policy "Team members can manage partners"
  on partners for insert
  with check (is_team_member());

create policy "Team members can update partners"
  on partners for update
  using (is_team_member())
  with check (is_team_member());


-- --------------------------------------------------------------------------
-- 4.5 CONTACTS policies
-- --------------------------------------------------------------------------

create policy "Team members can view all contacts"
  on contacts for select
  using (is_team_member());

create policy "Team members can manage contacts"
  on contacts for insert
  with check (is_team_member());

create policy "Team members can update contacts"
  on contacts for update
  using (is_team_member())
  with check (is_team_member());


-- --------------------------------------------------------------------------
-- 4.6 DOCUMENTS policies
-- --------------------------------------------------------------------------

create policy "Team members can view all documents"
  on documents for select
  using (is_team_member());

create policy "Team members can upload documents"
  on documents for insert
  with check (is_team_member());

create policy "Team members can update documents"
  on documents for update
  using (is_team_member())
  with check (is_team_member());

-- Delete only if not locked
create policy "Team members can delete unlocked documents"
  on documents for delete
  using (is_team_member() and is_locked = false);


-- --------------------------------------------------------------------------
-- 4.7 ACTIVITY LOG policies — INSERT ONLY, no update/delete
-- --------------------------------------------------------------------------

create policy "Team members can view audit trail"
  on activity_log for select
  using (is_team_member());

create policy "Team members can insert audit entries"
  on activity_log for insert
  with check (is_team_member());

-- NO UPDATE policy
-- NO DELETE policy
-- Combined with the trigger, this makes the audit trail truly immutable


-- --------------------------------------------------------------------------
-- 4.8 MEETING NOTES policies
-- --------------------------------------------------------------------------

create policy "Team members can view all meeting notes"
  on meeting_notes for select
  using (is_team_member());

create policy "Team members can create meeting notes"
  on meeting_notes for insert
  with check (is_team_member());

create policy "Team members can update meeting notes"
  on meeting_notes for update
  using (is_team_member())
  with check (is_team_member());


-- --------------------------------------------------------------------------
-- 4.9 TASKS policies
-- --------------------------------------------------------------------------

create policy "Team members can view all tasks"
  on tasks for select
  using (is_team_member());

create policy "Team members can create tasks"
  on tasks for insert
  with check (is_team_member());

create policy "Team members can update tasks"
  on tasks for update
  using (is_team_member())
  with check (is_team_member());

create policy "Team members can delete tasks"
  on tasks for delete
  using (is_team_member());


-- --------------------------------------------------------------------------
-- 4.10 GATE CHECKS policies
-- --------------------------------------------------------------------------

create policy "Team members can view gate checks"
  on gate_checks for select
  using (is_team_member());

create policy "Team members can create gate checks"
  on gate_checks for insert
  with check (is_team_member());

-- Gate checks are immutable once created (no update/delete policies)


-- --------------------------------------------------------------------------
-- 4.11 ASSET PARTNERS policies
-- --------------------------------------------------------------------------

create policy "Team members can view asset partners"
  on asset_partners for select
  using (is_team_member());

create policy "Team members can manage asset partners"
  on asset_partners for insert
  with check (is_team_member());

create policy "Team members can update asset partners"
  on asset_partners for update
  using (is_team_member())
  with check (is_team_member());

create policy "Team members can remove asset partners"
  on asset_partners for delete
  using (is_team_member());


-- --------------------------------------------------------------------------
-- 4.12 NOTIFICATIONS policies — Users see only their own
-- --------------------------------------------------------------------------

create policy "Users see own notifications"
  on notifications for select
  using (recipient_id = get_team_member_id());

create policy "System can create notifications"
  on notifications for insert
  with check (is_team_member());

create policy "Users can update own notifications"
  on notifications for update
  using (recipient_id = get_team_member_id())
  with check (recipient_id = get_team_member_id());


-- --------------------------------------------------------------------------
-- 4.13 COMMENTS policies
-- --------------------------------------------------------------------------

create policy "Team members can view all comments"
  on comments for select
  using (is_team_member());

create policy "Team members can create comments"
  on comments for insert
  with check (is_team_member());

create policy "Authors can update own comments"
  on comments for update
  using (author_id = get_team_member_id())
  with check (author_id = get_team_member_id());

create policy "Authors can delete own comments"
  on comments for delete
  using (author_id = get_team_member_id());


-- ============================================================================
-- 5. VIEWS — Useful pre-built queries
-- ============================================================================

-- --------------------------------------------------------------------------
-- 5.1 Pipeline board view — one row per asset with progress summary
-- --------------------------------------------------------------------------

create or replace view v_pipeline_board as
select
  s.id,
  s.name,
  s.asset_type,
  s.reference_code,
  s.value_path,
  s.current_phase,
  s.current_step,
  s.status,
  s.claimed_value,
  s.offering_value,
  s.asset_holder_entity,
  s.lead_team_member_id,
  tm.full_name as lead_name,
  s.created_at,
  s.updated_at,

  -- Step progress
  (select count(*) from asset_steps ss where ss.asset_id = s.id) as total_steps,
  (select count(*) from asset_steps ss where ss.asset_id = s.id and ss.status = 'completed') as completed_steps,
  (select count(*) from asset_steps ss where ss.asset_id = s.id and ss.status = 'blocked') as blocked_steps,
  (select count(*) from asset_steps ss where ss.asset_id = s.id and ss.status = 'in_progress') as active_steps,

  -- Task summary
  (select count(*) from tasks t where t.asset_id = s.id and t.status in ('todo', 'in_progress')) as open_tasks,
  (select count(*) from tasks t where t.asset_id = s.id and t.status in ('todo', 'in_progress') and t.due_date < now()) as overdue_tasks,

  -- Document count
  (select count(*) from documents d where d.asset_id = s.id and d.is_current = true) as document_count,

  -- Latest activity
  (select performed_at from activity_log al where al.asset_id = s.id order by performed_at desc limit 1) as last_activity_at,

  -- Days in current phase
  extract(day from now() - coalesce(
    (select max(gc.checked_at) from gate_checks gc where gc.asset_id = s.id and gc.passed = true),
    s.created_at
  ))::integer as days_in_phase

from assets s
left join team_members tm on tm.id = s.lead_team_member_id
where s.status not in ('archived');


-- --------------------------------------------------------------------------
-- 5.2 Task dashboard — open tasks across all assets
-- --------------------------------------------------------------------------

create or replace view v_task_dashboard as
select
  t.id,
  t.title,
  t.description,
  t.priority,
  t.status,
  t.due_date,
  t.asset_id,
  s.name as asset_name,
  s.reference_code as asset_reference,
  t.step_id,
  ss.step_number,
  ss.step_title,
  t.assigned_to,
  tm.full_name as assignee_name,
  t.created_at,
  case
    when t.due_date < now() and t.status not in ('done', 'cancelled') then true
    else false
  end as is_overdue,
  case
    when t.due_date is not null then
      extract(day from t.due_date - now())::integer
    else null
  end as days_until_due
from tasks t
left join assets s on s.id = t.asset_id
left join asset_steps ss on ss.id = t.step_id
left join team_members tm on tm.id = t.assigned_to
where t.status not in ('done', 'cancelled');


-- --------------------------------------------------------------------------
-- 5.3 Compliance dashboard — expiring documents and DD statuses
-- --------------------------------------------------------------------------

create or replace view v_compliance_dashboard as
select
  'document_expiring' as alert_type,
  d.id as entity_id,
  d.title as entity_name,
  d.document_type::text as detail,
  d.expires_at as deadline,
  d.asset_id,
  s.name as asset_name,
  extract(day from d.expires_at - now())::integer as days_remaining
from documents d
left join assets s on s.id = d.asset_id
where d.expires_at is not null
  and d.expires_at < now() + interval '90 days'
  and d.is_current = true

union all

select
  'partner_dd_expiring',
  p.id,
  p.name,
  p.type::text,
  p.dd_expires_at,
  null,
  null,
  extract(day from p.dd_expires_at - now())::integer
from partners p
where p.dd_expires_at is not null
  and p.dd_expires_at < now() + interval '90 days'

union all

select
  'contact_kyc_expiring',
  c.id,
  c.full_name,
  c.role::text,
  c.kyc_expires_at,
  null,
  null,
  extract(day from c.kyc_expires_at - now())::integer
from contacts c
where c.kyc_expires_at is not null
  and c.kyc_expires_at < now() + interval '90 days'

order by days_remaining asc;


-- ============================================================================
-- 6. FUNCTIONS — Utility functions for the CRM
-- ============================================================================

-- --------------------------------------------------------------------------
-- 6.1 Generate a reference code for a new asset
-- --------------------------------------------------------------------------

create or replace function generate_asset_reference()
returns text as $$
declare
  year_part text := extract(year from now())::text;
  seq integer;
begin
  select coalesce(max(
    nullif(regexp_replace(reference_code, '^PC-' || year_part || '-', ''), reference_code)::integer
  ), 0) + 1
  into seq
  from assets
  where reference_code like 'PC-' || year_part || '-%';

  return 'PC-' || year_part || '-' || lpad(seq::text, 3, '0');
end;
$$ language plpgsql;


-- --------------------------------------------------------------------------
-- 6.2 Populate workflow steps for a new asset
-- --------------------------------------------------------------------------
-- Call this after inserting an asset to pre-populate all workflow steps.
-- The step template is based on TOKENIZATION-WORKFLOW-COMPLETE.md.
-- Different value_paths can have different step templates.

create or replace function populate_asset_steps(p_asset_id uuid, p_value_path value_path)
returns void as $$
begin
  -- Phase 0: Foundation (common to all paths)
  insert into asset_steps (asset_id, phase, step_number, step_title, sort_order, is_gate, estimated_duration_days) values
    (p_asset_id, 'phase_0_foundation', '0.1', 'Form PleoChrome Holdings LLC', 1, false, 10),
    (p_asset_id, 'phase_0_foundation', '0.2', 'Engage Securities Counsel', 2, false, 14),
    (p_asset_id, 'phase_0_foundation', '0.3', 'Designate Compliance Officer', 3, false, 1),
    (p_asset_id, 'phase_0_foundation', '0.4', 'Draft AML/KYC Policy', 4, false, 7),
    (p_asset_id, 'phase_0_foundation', '0.5', 'Obtain Business Insurance', 5, false, 21),
    (p_asset_id, 'phase_0_foundation', '0.6', 'Resolve Asset-Specific Blockers', 6, false, 21),
    (p_asset_id, 'phase_0_foundation', '0.G', 'GATE 0: Foundation Complete', 7, true, 0),

  -- Phase 1: Intake and Screening
    (p_asset_id, 'phase_1_intake', '1.1', 'Asset Holder Completes Intake Questionnaire', 10, false, 7),
    (p_asset_id, 'phase_1_intake', '1.2', 'KYC/KYB Verification on Asset Holder', 11, false, 5),
    (p_asset_id, 'phase_1_intake', '1.3', 'OFAC/SDN and PEP Screening', 12, false, 1),
    (p_asset_id, 'phase_1_intake', '1.4', 'Provenance Review and Chain of Custody', 13, false, 14),
    (p_asset_id, 'phase_1_intake', '1.5', 'Review Existing Documentation', 14, false, 5),
    (p_asset_id, 'phase_1_intake', '1.6', 'Execute Engagement Agreement', 15, false, 7),
    (p_asset_id, 'phase_1_intake', '1.G', 'GATE 1: Intake Clear', 16, true, 0),

  -- Phase 2: Certification and Valuation
    (p_asset_id, 'phase_2_certification', '2.1', 'GIA Laboratory Certification', 20, false, 42),
    (p_asset_id, 'phase_2_certification', '2.2', 'SSEF Origin Determination (If Needed)', 21, false, 14),
    (p_asset_id, 'phase_2_certification', '2.3', 'Build Approved Appraiser Panel', 22, false, 14),
    (p_asset_id, 'phase_2_certification', '2.4', 'Sequential 3-Appraisal Process', 23, false, 30),
    (p_asset_id, 'phase_2_certification', '2.5', 'Variance Analysis and Offering Value', 24, false, 3),
    (p_asset_id, 'phase_2_certification', '2.G', 'GATE 2: Verification Complete', 25, true, 0),

  -- Phase 3: Custody Transfer
    (p_asset_id, 'phase_3_custody', '3.1', 'Evaluate and Select Vault Partner', 30, false, 14),
    (p_asset_id, 'phase_3_custody', '3.2', 'Arrange Insured Transport and Vault Intake', 31, false, 7),
    (p_asset_id, 'phase_3_custody', '3.3', 'Activate Vault API/Reporting Feed', 32, false, 7),
    (p_asset_id, 'phase_3_custody', '3.G', 'GATE 3: Custody Complete', 33, true, 0),

  -- Phase 4: Legal Structuring
    (p_asset_id, 'phase_4_legal', '4.1', 'Create Series SPV', 40, false, 7),
    (p_asset_id, 'phase_4_legal', '4.2', 'Draft PPM', 41, false, 42),
    (p_asset_id, 'phase_4_legal', '4.3', 'Draft Additional Legal Documents', 42, false, 21),
    (p_asset_id, 'phase_4_legal', '4.4', 'MSB Classification Legal Opinion', 43, false, 14),
    (p_asset_id, 'phase_4_legal', '4.G', 'GATE 4: Legal Structuring Complete', 44, true, 0);

  -- Tokenization-specific steps (Phase 5)
  if p_value_path = 'tokenization' or p_value_path = 'evaluating' then
    insert into asset_steps (asset_id, phase, step_number, step_title, sort_order, is_gate, estimated_duration_days) values
      (p_asset_id, 'phase_5_tokenization', '5.1', 'Platform Configuration', 50, false, 14),
      (p_asset_id, 'phase_5_tokenization', '5.2', 'Testnet Deployment and Testing', 51, false, 14),
      (p_asset_id, 'phase_5_tokenization', '5.3', 'Chainlink Proof of Reserve Integration', 52, false, 21),
      (p_asset_id, 'phase_5_tokenization', '5.4', 'Smart Contract Audit', 53, false, 28),
      (p_asset_id, 'phase_5_tokenization', '5.5', 'Mainnet Deployment', 54, false, 7),
      (p_asset_id, 'phase_5_tokenization', '5.G', 'GATE 5: Tokenization Complete', 55, true, 0);
  end if;

  -- Phase 6: Regulatory Filings (common to all paths)
  insert into asset_steps (asset_id, phase, step_number, step_title, sort_order, is_gate, estimated_duration_days) values
    (p_asset_id, 'phase_6_regulatory', '6.1', 'File Form D with SEC', 60, false, 2),
    (p_asset_id, 'phase_6_regulatory', '6.2', 'Blue Sky State Notice Filings', 61, false, 14),
    (p_asset_id, 'phase_6_regulatory', '6.3', 'Set Up Accredited Investor Verification', 62, false, 7),
    (p_asset_id, 'phase_6_regulatory', '6.4', 'Build Investor Data Room', 63, false, 14),
    (p_asset_id, 'phase_6_regulatory', '6.5', 'Test End-to-End Investor Onboarding', 64, false, 7),
    (p_asset_id, 'phase_6_regulatory', '6.G', 'GATE 6: Launch Ready', 65, true, 0),

  -- Phase 7: Distribution
    (p_asset_id, 'phase_7_distribution', '7.1', 'Begin Targeted Investor Outreach', 70, false, 30),
    (p_asset_id, 'phase_7_distribution', '7.2', 'Process Investor Subscriptions', 71, false, 30),
    (p_asset_id, 'phase_7_distribution', '7.G', 'GATE 7: Offering Open', 72, true, 0),

  -- Phase 8: Ongoing Management
    (p_asset_id, 'phase_8_ongoing', '8.1', 'Quarterly Investor Reporting', 80, false, null),
    (p_asset_id, 'phase_8_ongoing', '8.2', 'Annual Re-Appraisal', 81, false, null),
    (p_asset_id, 'phase_8_ongoing', '8.3', 'Quarterly Sanctions Re-Screening', 82, false, null),
    (p_asset_id, 'phase_8_ongoing', '8.4', 'Annual Independent Compliance Audit', 83, false, null),
    (p_asset_id, 'phase_8_ongoing', '8.5', 'Form D Annual Amendment', 84, false, null),
    (p_asset_id, 'phase_8_ongoing', '8.6', 'Blue Sky Annual Renewals', 85, false, null),
    (p_asset_id, 'phase_8_ongoing', '8.7', 'Tax Document Preparation', 86, false, null),
    (p_asset_id, 'phase_8_ongoing', '8.8', 'AML Training', 87, false, null);
end;
$$ language plpgsql;


-- ============================================================================
-- 7. SEED DATA — Initial partner records (evaluation stage)
-- ============================================================================

-- These are the partners PleoChrome is currently evaluating.
-- All are in 'evaluating' engagement_status per project rules.

-- Note: Uncomment and run these after initial migration to seed the database.
-- They are commented out so the migration is idempotent.

/*
insert into partners (name, type, engagement_status, website, notes) values
  ('Brickken', 'tokenization_platform', 'evaluating', 'https://brickken.com', 'ERC-3643. Evaluating in parallel with Zoniqx.'),
  ('Zoniqx', 'tokenization_platform', 'evaluating', 'https://zoniqx.com', 'ERC-7518 DyCIST framework. NDA pending signature.'),
  ('Chainlink', 'oracle_provider', 'evaluating', 'https://chain.link', 'Proof of Reserve oracle integration.'),
  ('GIA', 'gemological_lab', 'evaluating', 'https://gia.edu', 'Global standard for gemstone certification.'),
  ('Brinks', 'vault_custodian', 'evaluating', 'https://brinks.com', 'Institutional-grade vault custody. Evaluating alongside Malca-Amit.'),
  ('Malca-Amit', 'vault_custodian', 'evaluating', 'https://malca-amit.com', 'Precious asset specialty custody. Evaluating alongside Brinks.'),
  ('Bull Blockchain Law', 'securities_counsel', 'evaluating', 'https://bullblockchainlaw.com', 'Consultation call to be scheduled.'),
  ('Dilendorf Law Firm', 'securities_counsel', 'evaluating', 'https://dilendorf.com', 'Backup securities counsel. Pioneer in RWA tokenization.'),
  ('Dalmore Group', 'broker_dealer', 'evaluating', 'https://dalmoregroup.com', 'Recommended BD. Not yet engaged.');
*/


-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
