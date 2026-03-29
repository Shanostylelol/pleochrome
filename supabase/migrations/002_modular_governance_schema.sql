-- ============================================================================
-- PLEOCHROME POWERHOUSE CRM — Migration 002: Modular Governance Schema
-- ============================================================================
-- Version: 2.0
-- Date: 2026-03-27
-- Description: Three-layer orchestration architecture for partner-agnostic
--              workflow management across all value paths.
--
-- Architecture:
--   LAYER 1 — Governance (Immutable Requirements)
--     governance_requirements: The "why" — regulatory requirements that must be met
--     governance_documents: Required document types per requirement
--
--   LAYER 2 — Templates (Partner-Configurable)
--     partner_modules: Partner capability packages
--     module_tasks: Partner-specific tasks that fulfill governance requirements
--     default_tasks: Generic tasks when no partner module is assigned
--
--   LAYER 3 — Instances (Execution Records)
--     asset_task_instances: Actual task execution records per asset
--     ALTER asset_steps: Link to governance layer
--
--   ASSEMBLY FUNCTION
--     assemble_asset_workflow(): Builds asset workflow from governance + partner modules
--
-- This migration is ADDITIVE — it does not drop or replace any tables
-- from migration 001. Backward compatibility is preserved.
-- ============================================================================


-- ============================================================================
-- 0. NEW ENUM TYPES
-- ============================================================================

-- Task type classification for modular tasks
create type task_type as enum (
  'action',       -- Something a person does (e.g., "submit form to SEC")
  'upload',       -- A document must be uploaded
  'review',       -- Someone must review and approve
  'approval',     -- Formal sign-off required
  'automated'     -- System-executed (e.g., oracle check, smart contract deployment)
);


-- ============================================================================
-- 1. LAYER 1 — GOVERNANCE (Immutable Requirements)
-- ============================================================================
-- These tables define WHAT must happen and WHY. They are the regulatory
-- backbone. Every row answers: "What regulation requires this step?"

-- --------------------------------------------------------------------------
-- 1.1 GOVERNANCE REQUIREMENTS — The immutable regulatory requirements
-- --------------------------------------------------------------------------
-- Each row represents one regulatory or business requirement that must be
-- satisfied during the asset lifecycle. These are path-aware: some apply
-- to all paths (value_path IS NULL), others to specific paths.

create table governance_requirements (
  id                    uuid primary key default uuid_generate_v4(),

  -- Scope
  value_path            value_path,                    -- NULL = applies to ALL paths (shared)
  phase                 workflow_phase not null,

  -- Identification
  step_number           text not null,                 -- e.g., "1.3", "2.4", "3.1"
  title                 text not null,                 -- The governance requirement name
  description           text not null,                 -- What must be satisfied

  -- Regulatory basis — THE "WHY"
  regulatory_basis      text not null,                 -- Plain-language why this step exists
  regulatory_citation   text,                          -- Exact rule/law (e.g., "17 CFR 230.506(c)(2)(ii)")
  source_url            text,                          -- Link to the regulation

  -- Gate information
  is_gate               boolean not null default false,
  gate_id               text,                          -- e.g., "G1", "G2", "G3"

  -- Required artifacts
  required_documents    text[] default '{}',           -- Document types that must be uploaded
  required_approvals    jsonb default '{}',            -- Who must approve

  -- Display
  sort_order            integer not null default 0,
  is_active             boolean not null default true,

  -- Timestamps
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),

  -- Prevent duplicate step numbers within a path+phase
  unique(value_path, phase, step_number)
);

create index idx_gov_req_value_path on governance_requirements(value_path);
create index idx_gov_req_phase on governance_requirements(phase);
create index idx_gov_req_is_gate on governance_requirements(is_gate) where is_gate = true;
create index idx_gov_req_sort on governance_requirements(sort_order);
create index idx_gov_req_active on governance_requirements(is_active) where is_active = true;

-- Auto-update timestamp
create trigger trg_governance_requirements_updated_at
  before update on governance_requirements
  for each row execute function moddatetime(updated_at);

comment on table governance_requirements is
  'Layer 1: Immutable governance requirements. Each row is a regulatory or business requirement with its legal basis.';


-- --------------------------------------------------------------------------
-- 1.2 GOVERNANCE DOCUMENTS — Required document types per requirement
-- --------------------------------------------------------------------------

create table governance_documents (
  id                        uuid primary key default uuid_generate_v4(),
  governance_requirement_id uuid not null references governance_requirements(id) on delete cascade,

  document_type             text not null,              -- e.g., "gia_report", "ppm", "custody_receipt"
  description               text,                       -- What this document proves
  is_required               boolean not null default true,
  template_url              text,                       -- Link to a template if available

  created_at                timestamptz not null default now()
);

create index idx_gov_docs_requirement on governance_documents(governance_requirement_id);

comment on table governance_documents is
  'Required document types per governance requirement. Links compliance steps to their evidence artifacts.';


-- ============================================================================
-- 2. LAYER 2 — TEMPLATES (Partner-Configurable)
-- ============================================================================
-- These tables define HOW governance requirements are fulfilled.
-- Different partners have different tools, platforms, and processes.

-- --------------------------------------------------------------------------
-- 2.1 PARTNER MODULES — Partner capability packages
-- --------------------------------------------------------------------------

create table partner_modules (
  id                uuid primary key default uuid_generate_v4(),
  partner_id        uuid not null references partners(id) on delete cascade,

  module_name       text not null,                     -- e.g., "Rialto Full-Stack Module"
  description       text,
  covers_functions  text[] default '{}',               -- e.g., ["tokenization", "bd", "ats", "transfer_agent"]
  value_paths       value_path[] default '{}',         -- Which paths this module applies to
  is_active         boolean not null default true,
  version           integer not null default 1,

  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index idx_partner_modules_partner on partner_modules(partner_id);
create index idx_partner_modules_active on partner_modules(is_active) where is_active = true;

create trigger trg_partner_modules_updated_at
  before update on partner_modules
  for each row execute function moddatetime(updated_at);

comment on table partner_modules is
  'Layer 2: Partner capability modules. Each module defines how a partner fulfills governance requirements.';


-- --------------------------------------------------------------------------
-- 2.2 MODULE TASKS — Partner-specific tasks
-- --------------------------------------------------------------------------

create table module_tasks (
  id                        uuid primary key default uuid_generate_v4(),
  partner_module_id         uuid not null references partner_modules(id) on delete cascade,
  governance_requirement_id uuid not null references governance_requirements(id) on delete cascade,

  task_title                text not null,
  task_description          text,
  task_type                 task_type not null default 'action',
  assigned_role             text,                       -- Default role (e.g., "compliance_officer", "cto")
  estimated_duration        text,                       -- e.g., "2-3 business days"
  sort_order                integer not null default 0,
  replaces_default          boolean not null default false,  -- If true, replaces default tasks; if false, adds to them
  is_active                 boolean not null default true,

  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now()
);

create index idx_module_tasks_module on module_tasks(partner_module_id);
create index idx_module_tasks_gov_req on module_tasks(governance_requirement_id);
create index idx_module_tasks_sort on module_tasks(sort_order);

create trigger trg_module_tasks_updated_at
  before update on module_tasks
  for each row execute function moddatetime(updated_at);

comment on table module_tasks is
  'Layer 2: Partner-specific tasks that fulfill governance requirements. Can replace or extend default tasks.';


-- --------------------------------------------------------------------------
-- 2.3 DEFAULT TASKS — Generic tasks when no partner module is assigned
-- --------------------------------------------------------------------------

create table default_tasks (
  id                        uuid primary key default uuid_generate_v4(),
  governance_requirement_id uuid not null references governance_requirements(id) on delete cascade,

  task_title                text not null,
  task_description          text,
  task_type                 task_type not null default 'action',
  assigned_role             text,                       -- Default role assignment
  estimated_duration        text,                       -- e.g., "1-2 weeks"
  sort_order                integer not null default 0,

  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now()
);

create index idx_default_tasks_gov_req on default_tasks(governance_requirement_id);
create index idx_default_tasks_sort on default_tasks(sort_order);

create trigger trg_default_tasks_updated_at
  before update on default_tasks
  for each row execute function moddatetime(updated_at);

comment on table default_tasks is
  'Layer 2: Generic default tasks for each governance requirement. Used when no partner module covers the requirement.';


-- ============================================================================
-- 3. LAYER 3 — INSTANCES (Execution Records)
-- ============================================================================

-- --------------------------------------------------------------------------
-- 3.1 ALTER asset_steps — Link to governance layer
-- --------------------------------------------------------------------------

alter table asset_steps
  add column if not exists governance_requirement_id uuid references governance_requirements(id) on delete set null,
  add column if not exists partner_module_id uuid references partner_modules(id) on delete set null;

create index idx_asset_steps_gov_req on asset_steps(governance_requirement_id);
create index idx_asset_steps_partner_module on asset_steps(partner_module_id);


-- --------------------------------------------------------------------------
-- 3.2 ASSET TASK INSTANCES — Actual execution records per asset
-- --------------------------------------------------------------------------

create table asset_task_instances (
  id                uuid primary key default uuid_generate_v4(),
  asset_id          uuid not null references assets(id) on delete cascade,
  asset_step_id     uuid not null references asset_steps(id) on delete cascade,

  -- Source tracking
  source_task_id    uuid,                              -- Reference to module_tasks or default_tasks
  source_type       text not null default 'default',   -- 'default' or 'module'

  -- Task details (copied from source at creation time for immutability)
  title             text not null,
  description       text,
  task_type         task_type not null default 'action',

  -- Assignment
  assigned_to       uuid references team_members(id) on delete set null,

  -- Status
  status            task_status not null default 'todo',
  completed_at      timestamptz,
  completed_by      uuid references team_members(id) on delete set null,

  -- Evidence
  evidence_url      text,                              -- Link to document proving completion
  notes             text,

  -- Timestamps
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index idx_task_instances_asset on asset_task_instances(asset_id);
create index idx_task_instances_step on asset_task_instances(asset_step_id);
create index idx_task_instances_status on asset_task_instances(status);
create index idx_task_instances_assigned on asset_task_instances(assigned_to);
create index idx_task_instances_source on asset_task_instances(source_type, source_task_id);
create index idx_task_instances_open on asset_task_instances(status)
  where status not in ('done', 'cancelled');

create trigger trg_task_instances_updated_at
  before update on asset_task_instances
  for each row execute function moddatetime(updated_at);

comment on table asset_task_instances is
  'Layer 3: Actual task execution records per asset. Created by assemble_asset_workflow() from governance + partner modules.';


-- ============================================================================
-- 4. ROW LEVEL SECURITY — All new tables
-- ============================================================================

alter table governance_requirements enable row level security;
alter table governance_documents enable row level security;
alter table partner_modules enable row level security;
alter table module_tasks enable row level security;
alter table default_tasks enable row level security;
alter table asset_task_instances enable row level security;

-- Governance requirements: all team members can read, only active team can write
create policy "Team members can view governance requirements"
  on governance_requirements for select
  using (is_team_member());

create policy "Team members can create governance requirements"
  on governance_requirements for insert
  with check (is_team_member());

create policy "Team members can update governance requirements"
  on governance_requirements for update
  using (is_team_member())
  with check (is_team_member());

-- Governance documents
create policy "Team members can view governance documents"
  on governance_documents for select
  using (is_team_member());

create policy "Team members can manage governance documents"
  on governance_documents for insert
  with check (is_team_member());

create policy "Team members can update governance documents"
  on governance_documents for update
  using (is_team_member())
  with check (is_team_member());

-- Partner modules
create policy "Team members can view partner modules"
  on partner_modules for select
  using (is_team_member());

create policy "Team members can create partner modules"
  on partner_modules for insert
  with check (is_team_member());

create policy "Team members can update partner modules"
  on partner_modules for update
  using (is_team_member())
  with check (is_team_member());

-- Module tasks
create policy "Team members can view module tasks"
  on module_tasks for select
  using (is_team_member());

create policy "Team members can create module tasks"
  on module_tasks for insert
  with check (is_team_member());

create policy "Team members can update module tasks"
  on module_tasks for update
  using (is_team_member())
  with check (is_team_member());

-- Default tasks
create policy "Team members can view default tasks"
  on default_tasks for select
  using (is_team_member());

create policy "Team members can create default tasks"
  on default_tasks for insert
  with check (is_team_member());

create policy "Team members can update default tasks"
  on default_tasks for update
  using (is_team_member())
  with check (is_team_member());

-- Asset task instances
create policy "Team members can view task instances"
  on asset_task_instances for select
  using (is_team_member());

create policy "Team members can create task instances"
  on asset_task_instances for insert
  with check (is_team_member());

create policy "Team members can update task instances"
  on asset_task_instances for update
  using (is_team_member())
  with check (is_team_member());

create policy "Team members can delete task instances"
  on asset_task_instances for delete
  using (is_team_member());


-- ============================================================================
-- 5. SEED DATA — Governance Requirements
-- ============================================================================
-- Every governance requirement includes:
--   1. regulatory_basis: WHY this step exists (plain language)
--   2. regulatory_citation: The actual rule/law
--   3. source_url: Where to verify
--
-- Steps sourced from portal-data.ts (SHARED_PHASES, TOKENIZATION_PHASES,
-- FRACTIONAL_PHASES, DEBT_PHASES) + 10 missing steps from the validation log.

-- ═══════════════════════════════════════════════════════════════
-- SHARED PHASES (value_path IS NULL — apply to ALL paths)
-- ═══════════════════════════════════════════════════════════════

-- ── Phase 1: Acquisition ──────────────────────────────────────

insert into governance_requirements (value_path, phase, step_number, title, description, regulatory_basis, regulatory_citation, source_url, is_gate, gate_id, required_documents, required_approvals, sort_order) values

-- 1.1 Identify Target Asset
(null, 'phase_1_intake', '1.1', 'Identify Target Asset',
 'Source from vault inventories, dealer networks, and direct holders. Confirm minimum value threshold ($1M+), stone type eligibility, and holder willingness.',
 'Securities offerings require sufficient asset value to justify regulatory compliance costs. The $1M minimum ensures economic viability of the offering structure and satisfies institutional investor expectations for asset quality.',
 null, null,
 false, null,
 '{}', '{}',
 101),

-- 1.2 Holder Introduction & NDA
(null, 'phase_1_intake', '1.2', 'Holder Introduction & NDA',
 'First contact with asset holder. Execute mutual NDA. Share PleoChrome overview deck. Assess holder sophistication and expectations.',
 'NDAs protect trade secrets and material non-public information during the evaluation period. Required for compliance with insider trading regulations and to preserve confidentiality of offering structure details.',
 'Defend Trade Secrets Act, 18 U.S.C. 1836',
 'https://www.law.cornell.edu/uscode/text/18/1836',
 false, null,
 '{"nda"}', '{}',
 102),

-- 1.3 KYC / KYB on Asset Holder
(null, 'phase_1_intake', '1.3', 'KYC / KYB on Asset Holder',
 'Run full identity verification on the individual or entity. OFAC/SDN screening. PEP check. Adverse media scan. For entities: verify beneficial ownership (>25% owners).',
 'Bank Secrecy Act and FinCEN regulations require identification and verification of all parties in financial transactions. OFAC sanctions compliance is mandatory — transacting with an SDN-listed person is a federal crime. Dealers in Precious Metals and Stones (DPMS) have heightened AML obligations.',
 'BSA 31 USC 5311-5332; FinCEN 31 CFR Part 1027; OFAC 31 CFR Part 501',
 'https://www.fincen.gov/news/news-releases/dealers-precious-metals-stones-or-jewels-required-establish-anti-money-0',
 false, null,
 '{"kyc_report", "ofac_screening", "pep_screening"}',
 '{"internal": ["compliance_officer"]}',
 103),

-- 1.4 Provenance Documentation
(null, 'phase_1_intake', '1.4', 'Provenance Documentation',
 'Collect complete chain of custody: mine/origin to dealer to current holder. Verify Kimberley Process compliance if applicable. Flag any gaps in the chain.',
 'Provenance establishes clean title and regulatory compliance. The Kimberley Process Certification Scheme (KPCS) is required for rough diamond trade under the Clean Diamond Trade Act. For colored stones, provenance documentation is a due diligence best practice that protects against stolen property claims and enhances asset credibility for investors.',
 'Clean Diamond Trade Act, 19 U.S.C. 3901-3913; UCC 2-403 (good faith purchaser)',
 'https://www.law.cornell.edu/uscode/text/19/3901',
 false, null,
 '{"correspondence"}', '{}',
 104),

-- 1.5 Existing Certification Review
(null, 'phase_1_intake', '1.5', 'Existing Certification Review',
 'Collect prior GIA/SSEF/Gubelin reports. Verify report numbers against lab databases. Assess if re-certification is needed based on report age and scope.',
 'Independent gemological certification establishes the physical properties and value basis of the asset. Stale or unverified reports cannot support an offering valuation. GIA Report Check allows online verification of report authenticity.',
 null,
 'https://www.gia.edu/report-check-landing',
 false, null,
 '{"gia_report", "ssef_report"}', '{}',
 105),

-- 1.6 Preliminary Valuation Estimate
(null, 'phase_1_intake', '1.6', 'Preliminary Valuation Estimate',
 'Desktop valuation using comparable auction results, dealer price lists, and prior appraisals. Sets expectations — not the offering value.',
 'Preliminary valuation is required for internal deal committee review and to establish whether the asset justifies the compliance expenditure. This is NOT the offering value and must be clearly distinguished from the formal USPAP appraisal process.',
 null, null,
 false, null,
 '{}', '{}',
 106),

-- 1.7 Engagement Agreement
(null, 'phase_1_intake', '1.7', 'Engagement Agreement',
 'Execute formal engagement with asset holder. Define fee structure, timeline expectations, and mutual obligations. Include representations and warranties regarding asset title and encumbrances.',
 'A written engagement agreement establishes the legal relationship, defines scope of services, allocates risk, and provides contractual basis for fee collection. Required for professional liability insurance coverage and to establish clear expectations with the asset holder.',
 null, null,
 false, null,
 '{"engagement_agreement"}', '{}',
 107),

-- 1.8 Internal Deal Committee Review
(null, 'phase_1_intake', '1.8', 'Internal Deal Committee Review',
 'Founders review deal package. Go/No-Go decision based on provenance quality, valuation potential, holder reliability, and regulatory risk assessment.',
 'Internal deal committee review is a SOC 2 processing integrity control and a best practice for securities compliance. Documented decision-making provides evidence of reasonable judgment and protects against liability claims.',
 null, null,
 false, null,
 '{}', '{"internal": ["ceo", "cto", "cro"]}',
 108),

-- G1: SOURCE GATE
(null, 'phase_1_intake', '1.G1', 'GATE: Source Gate',
 'Asset holder verified. KYC passed. Provenance documented. Engagement signed. All intake requirements satisfied.',
 'Gate-based progression ensures no asset advances without satisfying all prerequisites. This is a SOC 2 processing integrity control and maps to the compliance-grade evidence chain that securities regulators expect.',
 null, null,
 true, 'G1',
 '{}', '{"internal": ["ceo", "compliance_officer"]}',
 109),

-- G2: EVIDENCE GATE
(null, 'phase_1_intake', '1.G2', 'GATE: Evidence Gate',
 'Prior certifications verified. Preliminary valuation within range. No red flags in provenance chain. Deal committee approval obtained.',
 'The evidence gate ensures that sufficient due diligence has been performed before committing resources to the certification and valuation phase. Prevents wasted expenditure on assets with unresolvable issues.',
 null, null,
 true, 'G2',
 '{}', '{"internal": ["ceo", "cro"]}',
 110),

-- ── Phase 2: Preparation / Certification & Valuation ──────────

-- 2.1 GIA Lab Submission
(null, 'phase_2_certification', '2.1', 'GIA Lab Submission',
 'Submit stone(s) to GIA laboratory for grading. Species identification, color grade, clarity, cut, carat weight, and origin determination.',
 'Independent gemological certification from a globally recognized laboratory is essential for establishing the physical characteristics and authenticity of the asset. GIA is the industry standard accepted by institutional investors, insurance underwriters, and auction houses worldwide.',
 null,
 'https://www.gia.edu/gem-lab-service/colored-stone-analysis-report-service',
 false, null,
 '{"gia_report"}', '{}',
 201),

-- 2.2 SSEF / Gubelin Origin
(null, 'phase_2_certification', '2.2', 'SSEF / Gubelin Origin Determination',
 'For high-value colored stones, obtain supplemental origin determination from SSEF or Gubelin. Strengthens provenance chain with independent geographic origin verification.',
 'Supplemental origin reports from a second independent laboratory strengthen the provenance chain and reduce origin dispute risk. SSEF and Gubelin are the two other globally recognized colored stone laboratories alongside GIA.',
 null,
 'https://www.ssef.ch/',
 false, null,
 '{"ssef_report"}', '{}',
 202),

-- 2.3 Appraiser Panel Selection
(null, 'phase_2_certification', '2.3', 'Appraiser Panel Selection',
 'Identify and vet three independent USPAP-compliant appraisers. Verify credentials (CGA/MGA), insurance, independence, and no conflicts of interest.',
 'USPAP (Uniform Standards of Professional Appraisal Practice) is the recognized ethical and performance standard for professional appraisers in the United States. Using three independent appraisers exceeds industry standard (typically 1-2) and provides institutional-grade valuation confidence.',
 'USPAP Standards Rule 7 (Personal Property Appraisal)',
 'https://www.appraisalfoundation.org/imis/TAF/Standards/Appraisal_Standards/Uniform_Standards_of_Professional_Appraisal_Practice/TAF/USPAP.aspx',
 false, null,
 '{}', '{}',
 203),

-- 2.4 Sequential 3-Appraisal Process
(null, 'phase_2_certification', '2.4', 'Sequential 3-Appraisal Process',
 'Each appraiser works independently with sealed prior values. Stone moves sequentially. Ensures no cross-contamination of valuations. All appraisals must be USPAP-compliant with prohibited percentage fees.',
 'The sequential sealed-value methodology prevents anchoring bias and ensures independent valuation. USPAP Ethics Rule prohibits fees based on a percentage of appraised value. This three-appraisal approach is a competitive differentiator — most securities offerings use 1-2 appraisals.',
 'USPAP Ethics Rule (fee prohibition); USPAP Standards Rules 7-8',
 'https://www.appraisalfoundation.org/imis/TAF/Standards/Appraisal_Standards/Uniform_Standards_of_Professional_Appraisal_Practice/TAF/USPAP.aspx',
 false, null,
 '{"appraisal_report"}', '{}',
 204),

-- 2.5 Variance Analysis
(null, 'phase_2_certification', '2.5', 'Variance Analysis',
 'Compare all three appraisals. If variance exceeds 15-20%, trigger review. Offering value = average of two lowest appraisals. Conservative methodology protects investors.',
 'Variance analysis is a statistical due diligence control. Using the average of the two lowest appraisals (not the highest) demonstrates conservative valuation methodology required for investor protection and regulatory defensibility.',
 null, null,
 false, null,
 '{}', '{"internal": ["ceo", "cro"]}',
 205),

-- 2.6 Vault Selection & Transfer
(null, 'phase_2_certification', '2.6', 'Vault Selection & Transfer',
 'Select institutional vault (Brinks or Malca-Amit). Arrange insured transport. Execute custody agreement with segregated storage. Vault must provide API access for Proof of Reserve.',
 'Institutional custody is required for investor protection and regulatory compliance. Segregated storage ensures the asset is not commingled. API access enables automated Proof of Reserve verification via Chainlink oracle.',
 null, null,
 false, null,
 '{"custody_receipt", "vault_agreement", "insurance_certificate", "transport_manifest"}', '{}',
 206),

-- 2.7 Insurance Verification
(null, 'phase_2_certification', '2.7', 'Insurance Verification',
 'Verify vault specie insurance covers full appraised value. Confirm transit insurance for the appraisal chain. Obtain coverage certificates naming PleoChrome SPV as additional insured.',
 'Specie insurance is required to protect investor capital in the event of loss, theft, or damage. Coverage must equal or exceed the offering value. Certificate of insurance naming the SPV as additional insured is standard institutional practice.',
 null, null,
 false, null,
 '{"insurance_certificate"}', '{}',
 207),

-- 2.8 SPV Formation
(null, 'phase_2_certification', '2.8', 'SPV Formation',
 'Form dedicated Series LLC under PleoChrome Holdings. Obtain EIN. Open SPV bank account. Draft operating agreement. Each asset gets its own Series to provide liability isolation.',
 'SPV (Special Purpose Vehicle) formation is required to isolate asset risk from the parent company and from other assets. Series LLC structure under Wyoming law allows multiple series with separate liability without forming separate entities. Required for securities offering structure.',
 'Wyoming LLC Act 17-29-211 (Series LLC)',
 'https://sos.wyo.gov/Business/docs/LLC_General_Info.pdf',
 false, null,
 '{"articles_of_organization", "operating_agreement"}',
 '{"external": ["securities_counsel"]}',
 208),

-- 2.9 PPM & Legal Documents
(null, 'phase_2_certification', '2.9', 'PPM & Legal Documents',
 'Securities counsel drafts Private Placement Memorandum, Subscription Agreement, Investor Questionnaire, and path-specific offering documents. Full compliance review.',
 'The PPM is the primary disclosure document for Regulation D offerings. It must disclose all material risks, conflicts of interest, fee structures, and use of proceeds. Failure to provide adequate disclosure exposes the issuer to Section 12(a)(2) rescission liability.',
 'Securities Act Section 12(a)(2), 15 U.S.C. 77l; SEC Rule 502(b)',
 'https://www.law.cornell.edu/uscode/text/15/77l',
 false, null,
 '{"ppm", "subscription_agreement", "investor_questionnaire"}',
 '{"external": ["securities_counsel"]}',
 209),

-- 2.10 Chainlink Proof of Reserve Setup
(null, 'phase_2_certification', '2.10', 'Chainlink Proof of Reserve Setup',
 'Configure Chainlink PoR oracle feed connecting vault inventory to on-chain verification. Develop custom external adapter for vault API. Test attestation on testnet.',
 'Proof of Reserve provides cryptographic verification that physical assets backing the tokens actually exist in custody. This is an investor protection mechanism that enables real-time verification of reserves without trusting the issuer alone. Chainlink BUILD program provides enhanced access to oracle services.',
 null,
 'https://docs.chain.link/data-feeds/proof-of-reserve',
 false, null,
 '{"chainlink_por_config"}', '{}',
 210),

-- G3: VERIFICATION GATE
(null, 'phase_2_certification', '2.G3', 'GATE: Verification Gate',
 'All lab reports received. Three appraisals complete. Variance within threshold. Offering value locked.',
 'The verification gate ensures all physical asset verification is complete before proceeding to legal structuring. Offering value must be locked before PPM drafting can be finalized.',
 null, null,
 true, 'G3',
 '{}', '{"internal": ["ceo", "compliance_officer"], "external": ["securities_counsel"]}',
 211),

-- G4: CUSTODY GATE
(null, 'phase_2_certification', '2.G4', 'GATE: Custody Gate',
 'Stone in institutional vault. Insurance verified. Transport completed. Custody receipt issued. PoR oracle configured.',
 'The custody gate ensures the asset is physically secured and insured before the offering is structured. Institutional custody is a prerequisite for the PPM and investor confidence.',
 null, null,
 true, 'G4',
 '{}', '{"internal": ["ceo", "cto"]}',
 212),

-- G5: LEGAL GATE
(null, 'phase_2_certification', '2.G5', 'GATE: Legal Gate',
 'SPV formed. PPM finalized. All legal documents reviewed by counsel. Compliance sign-off obtained.',
 'The legal gate ensures all legal structuring is complete and reviewed before any regulatory filings or investor solicitation. PPM must be finalized before Form D filing and investor outreach.',
 null, null,
 true, 'G5',
 '{}', '{"internal": ["ceo", "compliance_officer"], "external": ["securities_counsel"]}',
 213);


-- ═══════════════════════════════════════════════════════════════
-- TOKENIZATION-SPECIFIC PHASES (value_path = 'tokenization')
-- ═══════════════════════════════════════════════════════════════

insert into governance_requirements (value_path, phase, step_number, title, description, regulatory_basis, regulatory_citation, source_url, is_gate, gate_id, required_documents, required_approvals, sort_order) values

-- Phase 3: Tokenization — Smart Contract Deployment

('tokenization', 'phase_3_custody', '3.1', 'Platform Configuration',
 'Configure token parameters on the selected tokenization platform. Set symbol, total supply, compliance rules, jurisdiction restrictions, and investor whitelist requirements.',
 'Token parameters must match the terms described in the PPM. Any deviation between the smart contract configuration and the legal documents creates a compliance risk. Platform selection (Brickken ERC-3643, Zoniqx ERC-7518, or Rialto in-house) determines the specific technical implementation.',
 'SEC Statement on Tokenized Securities (Jan 28, 2026)',
 'https://www.sec.gov/newsroom/speeches-statements/corp-fin-statement-tokenized-securities-012826',
 false, null,
 '{}', '{"internal": ["cto"]}',
 301),

('tokenization', 'phase_3_custody', '3.2', 'ERC-3643 Compliance Rules',
 'Define on-chain compliance: accredited investor whitelist via ONCHAINID, jurisdiction blocks, transfer restrictions, holding period enforcement (Rule 144: 12 months for non-reporting issuer).',
 'ERC-3643 embeds compliance at the smart contract level. Every transfer is validated before execution. Rule 144 requires a 12-month holding period for restricted securities of non-reporting issuers. On-chain enforcement automates this requirement.',
 '17 CFR 230.144 (Rule 144); ERC-3643 Standard',
 'https://docs.erc3643.org/erc-3643',
 false, null,
 '{}', '{"internal": ["cto"], "external": ["securities_counsel"]}',
 302),

('tokenization', 'phase_3_custody', '3.3', 'Testnet Deployment & Testing',
 'Deploy all 6 ERC-3643 contracts to Polygon testnet: Token, Identity Registry, Identity Registry Storage, Trusted Issuers Registry, Claim Topics Registry, and Compliance Contract. Test minting, transfers, compliance rule enforcement, and PoR oracle integration.',
 'Testnet deployment is a security best practice required by OWASP Smart Contract Top 10 (2026). Testing in a non-production environment prevents loss of funds from bugs. All edge cases including failed transfers, unauthorized minting, and oracle failure scenarios must be tested.',
 'OWASP Smart Contract Top 10 (2026)',
 'https://scs.owasp.org/sctop10/',
 false, null,
 '{}', '{}',
 303),

('tokenization', 'phase_3_custody', '3.4', 'Smart Contract Audit',
 'Independent security audit of all deployed contracts by a reputable auditing firm. Remediate any findings. Obtain clean audit report before mainnet deployment.',
 'Smart contract audits are an industry-standard security requirement for any tokenized securities offering. The OWASP Smart Contract Top 10 (2026) identifies access control vulnerabilities, business logic vulnerabilities, and price oracle manipulation as the top three risks. An audit must cover all 6 ERC-3643 contracts plus the Chainlink PoR integration.',
 'OWASP Smart Contract Top 10: SC01 (Access Control), SC02 (Business Logic), SC03 (Price Oracle Manipulation)',
 'https://scs.owasp.org/sctop10/',
 false, null,
 '{"smart_contract_audit"}',
 '{"external": ["smart_contract_auditor"]}',
 304),

('tokenization', 'phase_3_custody', '3.5', 'Chainlink PoR Oracle Activation',
 'Activate Proof of Reserve feed on mainnet. Verify oracle-gated minting blocks token creation if reserves are unconfirmed. Final integration test.',
 'Oracle-gated minting ensures that tokens cannot be created without verified custody of the underlying asset. This provides cryptographic proof of backing and prevents over-issuance. Chainlink BUILD program provides enhanced oracle services.',
 null,
 'https://docs.chain.link/data-feeds/proof-of-reserve',
 false, null,
 '{}', '{"internal": ["cto"]}',
 305),

('tokenization', 'phase_3_custody', '3.6', 'Mainnet Deployment',
 'Deploy security token to Polygon mainnet. Final configuration review by counsel. Token contract addresses recorded. Contract is live and immutable.',
 'Mainnet deployment is the final irreversible step. The SEC confirmed in January 2026 that tokenized securities are still securities under existing federal law. The smart contract must exactly implement the terms described in the PPM.',
 'SEC Statement on Tokenized Securities (Jan 28, 2026)',
 'https://www.sec.gov/newsroom/speeches-statements/corp-fin-statement-tokenized-securities-012826',
 false, null,
 '{"token_deployment_record"}',
 '{"internal": ["cto", "ceo"], "external": ["securities_counsel"]}',
 306),

-- G6: PLATFORM GATE
('tokenization', 'phase_3_custody', '3.G6', 'GATE: Platform Gate',
 'Smart contract audited. PoR verified. Token deployed on mainnet. Parameters match legal documents exactly.',
 'Platform gate ensures the technical implementation matches the legal offering documents before any tokens are minted or distributed to investors.',
 null, null,
 true, 'G6',
 '{}', '{"internal": ["cto", "ceo", "compliance_officer"], "external": ["securities_counsel"]}',
 307),

-- Phase 4: Distribution — Investor Onboarding

('tokenization', 'phase_4_legal', '4.1', 'Form D Filing',
 'File Form D with SEC via EDGAR within 15 calendar days of first sale. Annual amendments required if offering continues. No SEC filing fee.',
 'Regulation D requires Form D notice filing with the SEC within 15 calendar days of the first sale of securities. The date of first sale is when the first investor is irrevocably contractually committed to invest. Failure to file does not invalidate the exemption but may trigger SEC enforcement action.',
 '17 CFR 230.503 (Form D filing requirement)',
 'https://www.sec.gov/resources-small-businesses/exempt-offerings/filing-form-d-notice',
 false, null,
 '{"form_d_filing"}', '{"external": ["securities_counsel"]}',
 401),

('tokenization', 'phase_4_legal', '4.2', 'Blue Sky State Filings',
 'File state securities notices in applicable jurisdictions. New York requires pre-filing before first sale. Rhode Island requires 10-day pre-filing. Most states via NASAA EFD within 15 days. Florida does NOT require filing for Rule 506.',
 '46 states require notice filing for Reg D 506 offerings. New York requires notice BEFORE first sale with fees approximately 4x other states. Filing via NASAA Electronic Filing Depository (EFD) for most states.',
 'State Blue Sky Laws; NSMIA Section 18(b)(4)(F)',
 'https://www.nasaa.org/industry-resources/electronic-filing/',
 false, null,
 '{"blue_sky_filing"}', '{"external": ["securities_counsel"]}',
 402),

('tokenization', 'phase_4_legal', '4.3', 'Investor Marketing (506c)',
 'General solicitation permitted under Reg D 506(c). Targeted outreach to accredited investors via networks, events, and digital campaigns. All marketing materials must be reviewed by counsel and BD (if engaged).',
 'Rule 506(c) permits general solicitation and advertising, unlike Rule 506(b). However, all purchasers must be accredited investors with reasonable steps taken to verify accreditation. Marketing materials are not filed with the SEC but must not contain material misstatements.',
 '17 CFR 230.506(c)',
 'https://www.sec.gov/resources-small-businesses/exempt-offerings/general-solicitation-rule-506c',
 false, null,
 '{}', '{"external": ["securities_counsel"]}',
 403),

('tokenization', 'phase_4_legal', '4.4', 'Investor KYC & Accreditation',
 'Each investor completes KYC, sanctions screening, and accredited investor verification. For $200K+ minimum investments by natural persons: self-certification with written representation permitted per March 2025 SEC no-action letter. For entities with total asset accreditation: $1M minimum. Investor must represent investment is not third-party financed.',
 'Rule 506(c) requires the issuer to take "reasonable steps to verify" that all purchasers are accredited investors. The March 2025 SEC no-action letter provides a safe harbor for self-certification at higher investment minimums. KYC/AML screening is required under BSA/FinCEN regulations.',
 '17 CFR 230.506(c)(2)(ii); SEC No-Action Letter (March 12, 2025)',
 'https://www.sec.gov/resources-small-businesses/exempt-offerings/general-solicitation-rule-506c',
 false, null,
 '{"kyc_report", "accreditation_verification"}',
 '{"internal": ["compliance_officer"]}',
 404),

('tokenization', 'phase_4_legal', '4.5', 'Subscription Processing',
 'Investor signs subscription agreement, funds wire. Compliance review on each subscription. PleoChrome success fee collected at closing.',
 'Subscription agreements create the binding contractual commitment between the investor and the SPV. Each subscription must be reviewed for completeness, including investor questionnaire, accreditation verification, and KYC clearance. The subscription date triggers the 15-day Form D filing deadline if it is the first sale.',
 null, null,
 false, null,
 '{"subscription_agreement", "investor_questionnaire"}',
 '{"internal": ["compliance_officer", "ceo"]}',
 405),

('tokenization', 'phase_4_legal', '4.6', 'Token Minting',
 'Tokens minted to investor whitelisted wallet only after subscription confirmed and funded. Oracle verifies reserves before mint. ONCHAINID claim must be issued for investor identity.',
 'Oracle-gated minting prevents token issuance without verified reserves. ONCHAINID stores hashed identity claims on-chain (no PII) to enable compliant transfer enforcement. ERC-3643 compliance contract validates every mint operation.',
 'ERC-3643 Standard; Chainlink PoR',
 'https://docs.erc3643.org/erc-3643',
 false, null,
 '{}', '{"internal": ["cto"]}',
 406),

('tokenization', 'phase_4_legal', '4.7', 'Cap Table Update',
 'Transfer agent records updated. On-chain and off-chain cap tables reconciled. Investor confirmation sent. FINRA Form 5123 filed by BD within 15 days if BD engaged.',
 'Transfer agent must maintain the official record of security ownership. On-chain and off-chain records must reconcile exactly. FINRA Rule 5123 requires broker-dealers to file private placement documents within 15 calendar days of first sale.',
 'Securities Exchange Act Section 17A (Transfer Agent); FINRA Rule 5123',
 'https://www.finra.org/rules-guidance/rulebooks/finra-rules/5123',
 false, null,
 '{}', '{}',
 407),

('tokenization', 'phase_4_legal', '4.8', 'Ongoing Reporting',
 'Quarterly NAV updates. Annual re-appraisal. K-1 tax distribution by March 15. Compliance monitoring. Form D annual amendments.',
 'Ongoing reporting obligations arise from both the PPM commitments to investors and regulatory requirements. Form D annual amendments are required if the offering continues beyond one year. K-1 tax documents are required for partnership/LLC pass-through entities.',
 'IRC Section 6031 (K-1 reporting); 17 CFR 230.503(a) (Form D amendment)',
 'https://www.sec.gov/resources-small-businesses/exempt-offerings/filing-form-d-notice',
 false, null,
 '{"investor_report", "tax_document", "form_d_amendment", "appraisal_report"}', '{}',
 408),

('tokenization', 'phase_4_legal', '4.9', 'Secondary Transfer Facilitation',
 'Compliant peer-to-peer transfers via ATS. ERC-3643 compliance checks enforced automatically on every trade. Rule 144 holding period (12 months for non-reporting issuer) must be observed.',
 'Secondary transfers of restricted securities must comply with Rule 144 or another exemption. ERC-3643 automates compliance enforcement at the smart contract level. ATS (Alternative Trading System) must be registered with the SEC under Regulation ATS.',
 '17 CFR 230.144 (Rule 144); Regulation ATS, 17 CFR 242.300-303',
 'https://www.sec.gov/reports/rule-144-selling-restricted-control-securities',
 false, null,
 '{}', '{}',
 409),

('tokenization', 'phase_4_legal', '4.10', 'Redemption / Exit',
 'Upon asset sale or offering close: token burn, proceeds distribution per waterfall, SPV dissolution, final K-1, UCC termination if applicable.',
 'Orderly wind-down requires destruction of the security tokens (burn), distribution of proceeds according to the waterfall defined in the operating agreement, final tax reporting (K-1), and dissolution of the SPV entity.',
 null, null,
 false, null,
 '{"tax_document"}', '{"internal": ["ceo"], "external": ["securities_counsel"]}',
 410),

-- G7: OFFERING GATE
('tokenization', 'phase_4_legal', '4.G7', 'GATE: Offering Gate',
 'Form D filed. Blue sky notices submitted. Investor pipeline operational. First subscription processed and confirmed.',
 'Offering gate confirms all regulatory filings are complete and the investor pipeline is operational before scaling investor outreach.',
 null, null,
 true, 'G7',
 '{}', '{"internal": ["ceo", "compliance_officer"]}',
 411);


-- ═══════════════════════════════════════════════════════════════
-- FRACTIONAL-SPECIFIC PHASES (value_path = 'fractional_securities')
-- ═══════════════════════════════════════════════════════════════

insert into governance_requirements (value_path, phase, step_number, title, description, regulatory_basis, regulatory_citation, source_url, is_gate, gate_id, required_documents, required_approvals, sort_order) values

-- Phase 3: Securities Structuring

('fractional_securities', 'phase_3_custody', '3.1', 'Transfer Agent Engagement',
 'Select and engage SEC-registered transfer agent (Vertalo, Rialto Transfer Services, or equivalent). Configure cap table for fractional units.',
 'Transfer agents must be registered with the SEC under Section 17A of the Securities Exchange Act. The transfer agent maintains the official record of security ownership, processes transfers, and issues/cancels certificates.',
 'Securities Exchange Act Section 17A, 15 U.S.C. 78q-1',
 'https://www.sec.gov/resources-small-businesses/going-public/transfer-agents',
 false, null,
 '{"partner_agreement"}', '{}',
 301),

('fractional_securities', 'phase_3_custody', '3.2', 'BD / Placement Agent Engagement',
 'Engage broker-dealer of record for primary distribution (Rialto Markets, Dalmore Group, or equivalent). Define placement terms and commission structure.',
 'Broker-dealers must be registered with FINRA and the SEC. Using a registered BD for primary distribution ensures compliance with securities distribution requirements. FINRA Rule 5123 requires the BD to file offering documents within 15 days of first sale.',
 'Securities Exchange Act Section 15; FINRA Rule 5123',
 'https://www.finra.org/rules-guidance/rulebooks/finra-rules/5123',
 false, null,
 '{"partner_agreement"}', '{}',
 302),

('fractional_securities', 'phase_3_custody', '3.3', 'Unit Structure Configuration',
 'Define fractional unit parameters: total units, minimum investment, unit price, investor rights, voting provisions, distribution waterfall.',
 'Unit structure must be defined before legal documents can be drafted. The structure determines investor economics, governance rights, and liquidity terms. Must comply with the applicable SEC exemption requirements.',
 null, null,
 false, null,
 '{}', '{"internal": ["ceo"], "external": ["securities_counsel"]}',
 303),

('fractional_securities', 'phase_3_custody', '3.4', 'Regulatory Exemption Selection',
 'Determine optimal SEC exemption: Reg D 506(c) (accredited only, unlimited raise) vs Reg A+ (all investors, up to $75M) vs Reg CF (all investors, up to $5M). Decision based on target investor base, raise amount, and timeline.',
 'Each SEC exemption has different requirements, costs, and investor access. Reg D 506(c): accredited investors only, no raise limit, 15-day Form D filing. Reg A+: all investors, up to $75M, SEC qualification required (2-6 months). Reg CF: all investors, up to $5M, via registered funding portal.',
 '17 CFR 230.506(c); Regulation A, 17 CFR 230.251-263; Regulation CF, 17 CFR 227',
 'https://www.sec.gov/resources-small-businesses/capital-raising-building-blocks/regulation',
 false, null,
 '{}', '{"internal": ["ceo"], "external": ["securities_counsel"]}',
 304),

('fractional_securities', 'phase_3_custody', '3.5', 'Form D / Form 1-A Preparation',
 'Prepare SEC filing based on chosen exemption. Form D for Reg D (filed within 15 days of first sale) or Form 1-A for Reg A+ (SEC qualification required before any sales).',
 'Form D is a notice filing required under Regulation D. Form 1-A is the offering circular for Reg A+ that must be qualified by the SEC before any sales occur. EDGAR account setup requires Login.gov with MFA (mandatory since EDGAR Next, September 2025).',
 '17 CFR 230.503 (Form D); 17 CFR 230.252 (Form 1-A)',
 'https://www.sec.gov/resources-small-businesses/exempt-offerings/filing-form-d-notice',
 false, null,
 '{"form_d_filing"}', '{"external": ["securities_counsel"]}',
 305),

-- G6F: SECURITIES GATE
('fractional_securities', 'phase_3_custody', '3.G6F', 'GATE: Securities Gate',
 'Transfer agent engaged. BD engaged. Units structured. SEC filing prepared. Compliance review complete.',
 'Securities gate ensures all distribution infrastructure is in place before investor outreach begins.',
 null, null,
 true, 'G6F',
 '{}', '{"internal": ["ceo", "compliance_officer"], "external": ["securities_counsel"]}',
 306),

-- Phase 4: Distribution & Management

('fractional_securities', 'phase_4_legal', '4.1', 'Investor Outreach',
 'Targeted marketing to qualified investors. General solicitation permitted under 506(c). Content marketing, events, referral networks.',
 'Rule 506(c) permits general solicitation and advertising provided all purchasers are accredited investors with reasonable verification steps taken.',
 '17 CFR 230.506(c)',
 'https://www.sec.gov/resources-small-businesses/exempt-offerings/general-solicitation-rule-506c',
 false, null,
 '{}', '{}',
 401),

('fractional_securities', 'phase_4_legal', '4.2', 'Investor KYC & Accreditation',
 'Each investor completes identity verification, sanctions screening, and accreditation check. Self-certification at $200K+ minimum or third-party verification letter.',
 'Rule 506(c) requires reasonable steps to verify accredited investor status. The March 2025 SEC no-action letter provides a safe harbor for self-certification at higher minimums ($200K natural persons, $1M entities).',
 '17 CFR 230.506(c)(2)(ii)',
 'https://www.sec.gov/resources-small-businesses/exempt-offerings/general-solicitation-rule-506c',
 false, null,
 '{"kyc_report", "accreditation_verification"}',
 '{"internal": ["compliance_officer"]}',
 402),

('fractional_securities', 'phase_4_legal', '4.3', 'Subscription & Unit Issuance',
 'Investor signs subscription agreement, wires funds. Transfer agent issues fractional units. Cap table updated.',
 'Subscription creates the binding commitment. Transfer agent must record the issuance and maintain the cap table as the official shareholder registry.',
 'Securities Exchange Act Section 17A',
 null,
 false, null,
 '{"subscription_agreement"}', '{"internal": ["compliance_officer"]}',
 403),

('fractional_securities', 'phase_4_legal', '4.4', 'Cap Table Management',
 'Maintain official shareholder registry. Track all unit holders, transfer restrictions, and compliance status.',
 'Transfer agent is the official record keeper. Cap table must reflect all outstanding units, holder identities, transfer restrictions, and compliance status.',
 'Securities Exchange Act Section 17A',
 null,
 false, null,
 '{}', '{}',
 404),

('fractional_securities', 'phase_4_legal', '4.5', 'Quarterly Reporting',
 'Quarterly NAV updates based on market conditions. Investor communications. Compliance monitoring. Custody verification.',
 'Quarterly reporting is a PPM commitment and best practice for investor relations. NAV calculation must be based on documented methodology.',
 null, null,
 false, null,
 '{"investor_report"}', '{}',
 405),

('fractional_securities', 'phase_4_legal', '4.6', 'Annual Obligations',
 'Annual independent re-appraisal. K-1 tax distribution by March 15. Form D amendment. Blue sky renewals. Independent compliance audit.',
 'K-1 reporting is required for partnership/LLC pass-through entities by March 15. Form D annual amendments are required if the offering continues. Blue sky renewals vary by state.',
 'IRC Section 6031; 17 CFR 230.503(a)',
 null,
 false, null,
 '{"tax_document", "appraisal_report", "form_d_amendment"}', '{}',
 406),

('fractional_securities', 'phase_4_legal', '4.7', 'Secondary Transfer Facilitation',
 'If ATS available: facilitate compliant unit transfers between investors. Otherwise: handle transfer requests manually through transfer agent.',
 'Secondary transfers of restricted securities must comply with Rule 144 or another exemption. ATS operation requires registration under Regulation ATS.',
 '17 CFR 230.144; Regulation ATS',
 null,
 false, null,
 '{}', '{}',
 407),

('fractional_securities', 'phase_4_legal', '4.8', 'Exit / Liquidation',
 'Upon asset sale: distribute proceeds per waterfall. File final K-1. Dissolve SPV. Cancel all units. File Form D termination.',
 'Orderly wind-down requires distribution per operating agreement waterfall, final tax reporting, entity dissolution, and regulatory notification.',
 null, null,
 false, null,
 '{"tax_document"}', '{"internal": ["ceo"], "external": ["securities_counsel"]}',
 408),

-- G7F: OFFERING GATE
('fractional_securities', 'phase_4_legal', '4.G7F', 'GATE: Offering Gate',
 'SEC filing submitted. Investor pipeline operational. First subscription processed. Cap table active.',
 'Offering gate confirms all regulatory filings are complete and the investor pipeline is operational.',
 null, null,
 true, 'G7F',
 '{}', '{"internal": ["ceo", "compliance_officer"]}',
 409);


-- ═══════════════════════════════════════════════════════════════
-- DEBT-SPECIFIC PHASES (value_path = 'debt_instruments')
-- ═══════════════════════════════════════════════════════════════

insert into governance_requirements (value_path, phase, step_number, title, description, regulatory_basis, regulatory_citation, source_url, is_gate, gate_id, required_documents, required_approvals, sort_order) values

-- Phase 3: Loan Structuring

('debt_instruments', 'phase_3_custody', '3.1', 'UCC-1 Financing Statement',
 'File UCC-1 with secretary of state to perfect security interest in the gemstone collateral under Article 9. Dual approach: filing + possession for belt-and-suspenders protection.',
 'UCC Article 9 governs security interests in personal property (including gemstones). A UCC-1 financing statement filed with the secretary of state in the debtors state of organization perfects the security interest by filing. Possession by a bailee (vault custodian) provides additional perfection. UCC-1 filings have a 5-year effectiveness period requiring continuation statements.',
 'UCC 9-310 (Filing), 9-313 (Possession), 9-501 (Place of Filing), 9-515 (Duration)',
 'https://www.law.cornell.edu/ucc/9',
 false, null,
 '{}', '{"external": ["general_counsel"]}',
 301),

('debt_instruments', 'phase_3_custody', '3.2', 'Lender Identification',
 'Source lending capital: institutional lenders, alternative credit funds, family offices, or syndication partners. Match to borrower needs and collateral type.',
 'Identifying qualified lenders who understand gemstone-collateralized lending. For loan participations offered to investors, the Reves test determines whether participation notes are securities requiring Reg D 506(c) compliance.',
 'Reves v. Ernst & Young, 494 U.S. 56 (1990)',
 null,
 false, null,
 '{}', '{}',
 302),

('debt_instruments', 'phase_3_custody', '3.3', 'Loan Terms Structuring',
 'Define rate (12-18% APR), LTV (50-70%), term (12-36 months), payment schedule, covenants, and default triggers. Draft security agreement and promissory note.',
 'Loan terms must comply with state usury laws for the applicable jurisdiction. PleoChrome targets business-purpose loans (often exempt from consumer usury caps). LTV of 50-70% is conservative relative to market (50-80%) given the rigorous 3-appraisal valuation methodology.',
 'State usury laws (varies); UCC Article 9',
 null,
 false, null,
 '{}', '{"external": ["general_counsel"]}',
 303),

('debt_instruments', 'phase_3_custody', '3.4', 'Collateral Custody Agreement',
 'Execute tripartite agreement between borrower, lender, and vault. Define release conditions, reappraisal triggers, and default procedures.',
 'Tripartite custody agreement is required to establish the vault as a bailee holding the collateral for the benefit of the secured party (lender). Defines conditions under which collateral may be released, which protects both lender and borrower.',
 'UCC 9-313 (Perfection by Possession)',
 null,
 false, null,
 '{"vault_agreement"}', '{"external": ["general_counsel"]}',
 304),

('debt_instruments', 'phase_3_custody', '3.5', 'Insurance & Coverage Verification',
 'Verify specie insurance covers collateral value for full loan term. Confirm lender is named as loss payee. Obtain coverage certificates.',
 'Insurance is required to protect the secured partys interest in the collateral. Lender must be named as loss payee to ensure insurance proceeds are directed to the secured party in the event of a loss.',
 null, null,
 false, null,
 '{"insurance_certificate"}', '{}',
 305),

-- G6D: COLLATERAL GATE
('debt_instruments', 'phase_3_custody', '3.G6D', 'GATE: Collateral Gate',
 'UCC-1 perfected. Lender engaged. Terms set. Custody agreement executed. Insurance verified.',
 'Collateral gate ensures the security interest is perfected and all parties are aligned before loan origination.',
 null, null,
 true, 'G6D',
 '{}', '{"internal": ["ceo"], "external": ["general_counsel"]}',
 306),

-- Phase 4: Capital & Servicing

('debt_instruments', 'phase_4_legal', '4.1', 'Loan Origination & Closing',
 'Execute promissory note, security agreement, and guaranty. Disburse funds to borrower. Activate loan servicing. PleoChrome origination fee collected (2%).',
 'Loan closing creates the binding obligation. The promissory note evidences the debt, the security agreement grants the lien, and the guaranty (if applicable) provides additional credit support. PleoChrome earns an origination fee at closing.',
 null, null,
 false, null,
 '{}', '{"internal": ["ceo"], "external": ["general_counsel"]}',
 401),

('debt_instruments', 'phase_4_legal', '4.2', 'Participation Notes (if applicable)',
 'If offering loan participations to investors: structure as Reg D 506(c) securities. Draft note PPM, file Form D, onboard note investors.',
 'Under the Reves test (Reves v. Ernst & Young, 494 U.S. 56, 1990), loan participation notes offered to investors for investment return are presumed to be securities. PleoChrome model of offering participation notes to accredited investors is distinguishable from Kirschner v. JP Morgan (2023, institutional syndicated loans).',
 'Reves v. Ernst & Young, 494 U.S. 56 (1990); 17 CFR 230.506(c)',
 null,
 false, null,
 '{"ppm", "form_d_filing"}', '{"external": ["securities_counsel"]}',
 402),

('debt_instruments', 'phase_4_legal', '4.3', 'Payment Servicing',
 'Monthly payment collection, escrow management, and distribution to lender(s). PleoChrome earns servicing fee (0.75%/year of outstanding balance).',
 'Loan servicing requires timely collection and distribution of payments. Escrow management protects reserves for insurance, taxes, and reappraisal costs.',
 null, null,
 false, null,
 '{}', '{}',
 403),

('debt_instruments', 'phase_4_legal', '4.4', 'Collateral Monitoring',
 'Quarterly PoR verification. Annual reappraisal of collateral value. If LTV exceeds covenant threshold, trigger margin call or additional collateral requirement.',
 'Ongoing collateral monitoring is required to maintain the LTV covenant. If collateral value declines, the lender security is impaired. Annual reappraisal ensures the valuation remains current. Chainlink PoR provides automated custody verification.',
 null, null,
 false, null,
 '{"appraisal_report"}', '{}',
 404),

('debt_instruments', 'phase_4_legal', '4.5', 'Default & Workout Procedures',
 'If borrower defaults (30+ days late): issue notice, 30-day cure period, then foreclosure. UCC 9-610 commercially reasonable disposition of collateral.',
 'UCC Article 9 Part 6 governs the enforcement of security interests after default. Section 9-610 requires a "commercially reasonable" disposition of collateral. The secured party must provide reasonable notification to the debtor and other secured parties before disposition.',
 'UCC 9-610 (Disposition after Default), 9-611 (Notification), 9-612 (Timeliness)',
 'https://www.law.cornell.edu/ucc/9/9-610',
 false, null,
 '{}', '{"external": ["general_counsel"]}',
 405),

('debt_instruments', 'phase_4_legal', '4.6', 'Loan Maturity & Collateral Release',
 'Upon payoff: confirm full principal + interest received. Release collateral from vault. File UCC-3 termination statement. Close loan file.',
 'UCC 9-513 requires the secured party to file a UCC-3 termination statement within 20 days of receiving an authenticated demand from the debtor after the obligation is paid in full.',
 'UCC 9-513 (Termination Statement)',
 'https://www.law.cornell.edu/ucc/9/9-513',
 false, null,
 '{}', '{}',
 406),

-- G7D: SERVICING GATE
('debt_instruments', 'phase_4_legal', '4.G7D', 'GATE: Servicing Gate',
 'Loan originated. Payments current. Collateral monitored. Servicing operational.',
 'Servicing gate confirms the loan is performing and all monitoring systems are active.',
 null, null,
 true, 'G7D',
 '{}', '{"internal": ["ceo"]}',
 407);


-- ═══════════════════════════════════════════════════════════════
-- MISSING STEPS FROM VALIDATION LOG (10 gaps + 3 additional)
-- ═══════════════════════════════════════════════════════════════
-- These steps were identified as gaps in the tokenization audit.
-- They apply to specific phases and paths.

insert into governance_requirements (value_path, phase, step_number, title, description, regulatory_basis, regulatory_citation, source_url, is_gate, gate_id, required_documents, required_approvals, sort_order) values

-- 1. Bad Actor Background Checks (CRITICAL — P0)
(null, 'phase_2_certification', '2.11', 'Bad Actor Background Checks (Rule 506(d))',
 'Comprehensive Rule 506(d) disqualification screening on ALL covered persons: directors, officers, >20% beneficial owners, promoters, compensated solicitors, and their directors/officers. Lookback periods: criminal convictions (5yr issuer/10yr others), court injunctions (5yr), regulatory orders (10yr), SRO bars (for duration of order).',
 'Rule 506(d) disqualifies offerings if any "covered person" has specified bad acts within the lookback period. A single disqualifying event can kill the entire offering. This is a hard gate that must be cleared before any securities are offered.',
 '17 CFR 230.506(d) (Bad Actor Disqualification)',
 'https://www.sec.gov/resources-small-businesses/small-business-compliance-guides/disqualification-felons-other-bad-actors-rule-506-offerings-related-disclosure-requirements',
 false, null,
 '{"background_check"}',
 '{"internal": ["compliance_officer"], "external": ["securities_counsel"]}',
 214),

-- 2. Investor Accreditation Re-Verification Schedule
(null, 'phase_4_legal', '4.11', 'Investor Accreditation Re-Verification Schedule',
 'Establish schedule for re-verifying accredited investor status. Particularly critical for secondary transfers where buyer accreditation must be current at time of transfer.',
 'While Rule 506(c) requires verification at the time of sale, secondary transfers through the ERC-3643 compliance contract also require current accreditation. Stale accreditation data creates compliance risk for transfer enforcement.',
 '17 CFR 230.506(c)(2)(ii)',
 null,
 false, null,
 '{}', '{"internal": ["compliance_officer"]}',
 412),

-- 3. Investor Wallet Setup and Security Guidance (Tokenization-specific)
('tokenization', 'phase_4_legal', '4.11', 'Investor Wallet Setup and Security Guidance',
 'Guide HNW traditional investors through wallet creation, private key management, and security best practices. Provide approved wallet list. Document wallet addresses for ONCHAINID binding.',
 'Tokenized security holders must have compatible wallets. HNW traditional investors unfamiliar with cryptocurrency will need guided onboarding. Wallet address binding to ONCHAINID is required for ERC-3643 compliance enforcement.',
 'ERC-3643 Standard (ONCHAINID)',
 'https://docs.erc3643.org/erc-3643',
 false, null,
 '{}', '{}',
 412),

-- 4. Escrow Structure and Release Conditions (CRITICAL — P0)
(null, 'phase_2_certification', '2.12', 'Escrow Structure and Release Conditions',
 'Define escrow arrangements for investor funds: minimum raise (soft cap), release conditions, refund procedures if minimum not met. Document escrow agent engagement and fee structure.',
 'Without documented escrow release conditions, investor funds are at regulatory risk. SEC and state regulators expect escrow protections for investor capital in blind pool or offering scenarios. Escrow structure must be disclosed in the PPM.',
 null, null,
 false, null,
 '{}', '{"external": ["securities_counsel"]}',
 215),

-- 5. Disaster Recovery and Business Continuity Plan
(null, 'phase_2_certification', '2.13', 'Disaster Recovery and Business Continuity Plan',
 'Document BCP/DRP covering: database recovery (RPO/RTO), vault operator failover, key person risk mitigation, smart contract upgrade procedures (if applicable), and investor communication protocols during disruption.',
 'SOC 2 Availability criteria require documented business continuity and disaster recovery plans. Institutional investors and partners will request BCP documentation during due diligence. Supabase provides the technical backup mechanism but PleoChrome must document how it uses them.',
 'SOC 2 Trust Service Criteria: Availability (A1)',
 'https://www.aicpa-cima.com/topic/audit-assurance/audit-and-assurance-greater-than-soc-2',
 false, null,
 '{}', '{"internal": ["cto", "ceo"]}',
 216),

-- 6. Investor Communication Cadence and Templates
(null, 'phase_4_legal', '4.12', 'Investor Communication Cadence and Templates',
 'Establish regular investor communication schedule: quarterly updates, annual reports, material event notices, and ad hoc communications. Create templates for consistent, professional investor relations.',
 'Consistent investor communication is a PPM commitment and best practice for maintaining investor confidence and regulatory compliance. Material events should be communicated promptly even though Reg D does not have the same reporting requirements as public companies.',
 null, null,
 false, null,
 '{}', '{}',
 413),

-- 7. Secondary Market Liquidity Plan
('tokenization', 'phase_3_custody', '3.7', 'Secondary Market Liquidity Plan',
 'Develop concrete ATS engagement plan for secondary trading. Define market-making approach, trading rules, and compliance monitoring for secondary transfers.',
 'Secondary market liquidity is the core tokenization value proposition. Without a concrete ATS plan, tokens are illiquid and the tokenization premium over traditional fractional ownership is minimal. ATS must be registered with the SEC under Regulation ATS.',
 'Regulation ATS, 17 CFR 242.300-303',
 null,
 false, null,
 '{}', '{}',
 308),

-- 8. FINRA Form 5123 Detail (already covered in 4.7, adding as standalone)
-- Note: Covered within step 4.7 Cap Table Update for tokenization path.
-- Adding as shared step for fractional and debt paths where BD is engaged.

-- 9. Tax Counsel Engagement
(null, 'phase_2_certification', '2.14', 'Tax Counsel Engagement',
 'Engage specialized tax counsel to address: 28% collectibles tax rate for gemstones, UBTI analysis for tax-exempt investors (IRAs, foundations), FIRPTA withholding for non-US investors, K-1 reporting structure, and state tax nexus analysis.',
 'Gemstones are classified as collectibles under IRC Section 408(m)(2), subject to a maximum 28% long-term capital gains rate (vs. 0/15/20% for non-collectible assets). UBTI may apply to tax-exempt investors if SPV is structured as a partnership. These issues require specialized tax counsel beyond securities counsel.',
 'IRC Section 408(m)(2) (collectibles); IRC Section 511-514 (UBTI)',
 'https://www.irs.gov/taxtopics/tc409',
 false, null,
 '{}', '{"external": ["securities_counsel"]}',
 217),

-- 10. Reg S Parallel Offering (Tokenization-specific, P2)
('tokenization', 'phase_4_legal', '4.12', 'Reg S Parallel Offering Evaluation',
 'Evaluate whether to conduct a parallel Regulation S offering for non-US investors. If proceeding: implement geographic restrictions in ERC-3643 compliance contract, engage international counsel, and ensure no directed selling efforts in the US.',
 'Regulation S provides a safe harbor from SEC registration for offshore transactions. A parallel Reg S offering alongside Reg D 506(c) can expand the investor base to non-US accredited investors. ERC-3643 jurisdiction restrictions can enforce geographic compliance automatically.',
 '17 CFR 230.901-905 (Regulation S)',
 'https://www.sec.gov/about/reports-publications/investorpubsregsexhtm',
 false, null,
 '{}', '{"external": ["securities_counsel"]}',
 413),

-- 11. Form D Pre-filing Strategy
(null, 'phase_4_legal', '4.13', 'Form D Pre-Filing Strategy',
 'Evaluate filing Form D before first sale as a protective measure. Some practitioners file early to establish the exemption record and avoid any timing disputes.',
 'SEC guidance allows pre-filing of Form D before the first sale. Filing early can provide a protective record and avoid any disputes about whether the 15-day deadline was met. The filing establishes an EDGAR record of the exemption claim.',
 '17 CFR 230.503',
 'https://www.sec.gov/resources-small-businesses/exempt-offerings/filing-form-d-notice',
 false, null,
 '{}', '{"external": ["securities_counsel"]}',
 414),

-- 12. EDGAR Next New Filer Onboarding
(null, 'phase_4_legal', '4.14', 'EDGAR Next New Filer Onboarding',
 'Set up EDGAR filing capability: create Login.gov account with MFA, submit Form ID with notarized authentication document, obtain CIK number. Required for Form D filing. Factor in processing time for new filer onboarding.',
 'EDGAR Next enrollment (mandatory since September 15, 2025) requires Login.gov with multi-factor authentication. New filers must submit Form ID with a notarized authentication document. After December 19, 2025, non-enrolled filers must re-apply.',
 'SEC EDGAR Next Requirements',
 'https://www.sec.gov/newsroom/whats-new/compliance-edgar-next-now-required-file-edgar',
 false, null,
 '{}', '{}',
 415),

-- 13. Section 12(g) Holder Threshold Monitoring
(null, 'phase_4_legal', '4.15', 'Section 12(g) Holder Threshold Monitoring',
 'Monitor total holder count to stay under 2,000 record holders (or 500 non-accredited, though 506(c) is all-accredited). Exceeding the threshold with total assets over $10M triggers Exchange Act registration requirements.',
 'Section 12(g) of the Exchange Act requires registration if the issuer has total assets exceeding $10M AND a class of equity securities held of record by 2,000 persons (or 500 non-accredited investors). For 506(c) offerings (all accredited), the binding threshold is 2,000 total holders.',
 'Securities Exchange Act Section 12(g), 15 U.S.C. 78l(g)',
 'https://www.sec.gov/resources-small-businesses/going-public/exchange-act-reporting-registration',
 false, null,
 '{}', '{}',
 416);


-- ============================================================================
-- 6. SEED DATA — Default Tasks
-- ============================================================================
-- Generic tasks for each governance requirement when no partner module is assigned.

-- Helper: Insert default tasks for shared Phase 1 requirements
do $$
declare
  r record;
begin
  -- Phase 1 tasks
  for r in select id, step_number, title from governance_requirements where phase = 'phase_1_intake' and not is_gate order by sort_order
  loop
    case r.step_number
      when '1.1' then
        insert into default_tasks (governance_requirement_id, task_title, task_description, task_type, assigned_role, estimated_duration, sort_order) values
          (r.id, 'Source asset from pipeline', 'Review current pipeline for eligible assets meeting $1M+ threshold', 'action', 'cro', '1-2 weeks', 1),
          (r.id, 'Confirm holder willingness', 'Initial outreach to gauge holder interest and verify basic eligibility', 'action', 'cro', '2-3 days', 2);
      when '1.2' then
        insert into default_tasks (governance_requirement_id, task_title, task_description, task_type, assigned_role, estimated_duration, sort_order) values
          (r.id, 'Draft and send NDA', 'Prepare mutual NDA from template and send to asset holder for execution', 'action', 'ceo', '1-2 days', 1),
          (r.id, 'Execute NDA', 'Obtain signed NDA from both parties', 'upload', 'ceo', '3-5 days', 2),
          (r.id, 'Share overview deck', 'Send PleoChrome overview presentation to asset holder', 'action', 'cro', '1 day', 3);
      when '1.3' then
        insert into default_tasks (governance_requirement_id, task_title, task_description, task_type, assigned_role, estimated_duration, sort_order) values
          (r.id, 'Run KYC/KYB verification', 'Submit holder identity to KYC provider for verification', 'action', 'compliance_officer', '2-3 days', 1),
          (r.id, 'Run OFAC/SDN screening', 'Screen holder against OFAC Specially Designated Nationals list', 'automated', 'compliance_officer', '1 day', 2),
          (r.id, 'Run PEP screening', 'Screen holder against Politically Exposed Persons databases', 'automated', 'compliance_officer', '1 day', 3),
          (r.id, 'Run adverse media scan', 'Check public records and media for negative information', 'action', 'compliance_officer', '1-2 days', 4),
          (r.id, 'Compliance officer sign-off', 'Review all screening results and approve or flag', 'approval', 'compliance_officer', '1 day', 5);
      when '1.4' then
        insert into default_tasks (governance_requirement_id, task_title, task_description, task_type, assigned_role, estimated_duration, sort_order) values
          (r.id, 'Collect chain of custody documents', 'Request all provenance documentation from holder', 'upload', 'cro', '1-2 weeks', 1),
          (r.id, 'Verify Kimberley Process compliance', 'If applicable, verify Kimberley Process certificates are valid', 'review', 'compliance_officer', '2-3 days', 2),
          (r.id, 'Flag provenance gaps', 'Document any gaps in the chain of custody and assess risk', 'review', 'ceo', '2-3 days', 3);
      when '1.5' then
        insert into default_tasks (governance_requirement_id, task_title, task_description, task_type, assigned_role, estimated_duration, sort_order) values
          (r.id, 'Collect existing lab reports', 'Gather all prior GIA/SSEF/Gubelin reports from holder', 'upload', 'cro', '3-5 days', 1),
          (r.id, 'Verify reports online', 'Cross-reference report numbers against lab databases (GIA Report Check)', 'action', 'cto', '1-2 days', 2),
          (r.id, 'Assess re-certification need', 'Determine if reports are current and sufficient or if re-certification is required', 'review', 'ceo', '1 day', 3);
      when '1.6' then
        insert into default_tasks (governance_requirement_id, task_title, task_description, task_type, assigned_role, estimated_duration, sort_order) values
          (r.id, 'Conduct desktop valuation', 'Research comparable auction results, dealer price lists, and prior appraisals', 'action', 'cro', '3-5 days', 1),
          (r.id, 'Document valuation methodology', 'Record sources and methodology used for preliminary estimate', 'upload', 'cro', '1 day', 2);
      when '1.7' then
        insert into default_tasks (governance_requirement_id, task_title, task_description, task_type, assigned_role, estimated_duration, sort_order) values
          (r.id, 'Draft engagement agreement', 'Prepare engagement agreement from template with deal-specific terms', 'action', 'ceo', '2-3 days', 1),
          (r.id, 'Counsel review of engagement', 'Securities counsel reviews and approves engagement agreement', 'review', 'securities_counsel', '3-5 days', 2),
          (r.id, 'Execute engagement agreement', 'Obtain signatures from all parties', 'upload', 'ceo', '3-5 days', 3);
      when '1.8' then
        insert into default_tasks (governance_requirement_id, task_title, task_description, task_type, assigned_role, estimated_duration, sort_order) values
          (r.id, 'Prepare deal package', 'Compile all intake materials into deal committee review package', 'action', 'cro', '1-2 days', 1),
          (r.id, 'Founders Go/No-Go decision', 'All three founders review and vote on deal advancement', 'approval', 'ceo', '1-2 days', 2),
          (r.id, 'Document decision rationale', 'Record the decision and rationale in activity log', 'action', 'ceo', '1 day', 3);
      else null; -- Gates handled separately
    end case;
  end loop;

  -- Phase 2 tasks
  for r in select id, step_number, title from governance_requirements where phase = 'phase_2_certification' and value_path is null and not is_gate order by sort_order
  loop
    case r.step_number
      when '2.1' then
        insert into default_tasks (governance_requirement_id, task_title, task_description, task_type, assigned_role, estimated_duration, sort_order) values
          (r.id, 'Submit stone(s) to GIA', 'Arrange physical submission of stone(s) to GIA laboratory', 'action', 'cro', '2-3 days', 1),
          (r.id, 'Track GIA processing', 'Monitor GIA portal for report completion', 'action', 'cro', '2-4 weeks', 2),
          (r.id, 'Upload GIA report', 'Upload completed GIA report to document management system', 'upload', 'cro', '1 day', 3);
      when '2.2' then
        insert into default_tasks (governance_requirement_id, task_title, task_description, task_type, assigned_role, estimated_duration, sort_order) values
          (r.id, 'Evaluate need for supplemental origin', 'Assess whether SSEF/Gubelin report strengthens the offering', 'review', 'ceo', '1 day', 1),
          (r.id, 'Submit to SSEF/Gubelin (if needed)', 'Arrange supplemental lab submission', 'action', 'cro', '2-4 weeks', 2);
      when '2.3' then
        insert into default_tasks (governance_requirement_id, task_title, task_description, task_type, assigned_role, estimated_duration, sort_order) values
          (r.id, 'Research qualified appraisers', 'Identify CGA/MGA credentialed appraisers with gemstone specialization', 'action', 'cro', '1 week', 1),
          (r.id, 'Verify credentials and independence', 'Confirm each appraiser credentials, insurance, and no conflicts', 'review', 'compliance_officer', '3-5 days', 2),
          (r.id, 'Engage three appraisers', 'Execute engagement letters with three selected appraisers', 'action', 'ceo', '3-5 days', 3);
      when '2.4' then
        insert into default_tasks (governance_requirement_id, task_title, task_description, task_type, assigned_role, estimated_duration, sort_order) values
          (r.id, 'Coordinate sequential appraisal logistics', 'Arrange stone transport between appraisers with sealed prior values', 'action', 'cro', '3-5 weeks', 1),
          (r.id, 'Upload all three appraisal reports', 'Upload completed USPAP-compliant appraisal reports', 'upload', 'cro', '1-2 days', 2);
      when '2.5' then
        insert into default_tasks (governance_requirement_id, task_title, task_description, task_type, assigned_role, estimated_duration, sort_order) values
          (r.id, 'Calculate variance across appraisals', 'Compare all three appraisals and compute variance percentage', 'action', 'cto', '1 day', 1),
          (r.id, 'Determine offering value', 'Calculate offering value as average of two lowest appraisals', 'action', 'ceo', '1 day', 2),
          (r.id, 'Lock offering value', 'Formally approve and lock the offering value in the CRM', 'approval', 'ceo', '1 day', 3);
      when '2.6' then
        insert into default_tasks (governance_requirement_id, task_title, task_description, task_type, assigned_role, estimated_duration, sort_order) values
          (r.id, 'Select vault partner', 'Evaluate and select Brinks, Malca-Amit, or equivalent', 'action', 'cro', '1-2 weeks', 1),
          (r.id, 'Execute custody agreement', 'Draft and execute custody agreement with segregated storage', 'action', 'ceo', '1 week', 2),
          (r.id, 'Arrange insured transport', 'Coordinate secure transport to vault facility', 'action', 'cro', '3-5 days', 3),
          (r.id, 'Confirm vault intake', 'Verify stone received at vault, obtain custody receipt', 'upload', 'cro', '1-2 days', 4);
      when '2.7' then
        insert into default_tasks (governance_requirement_id, task_title, task_description, task_type, assigned_role, estimated_duration, sort_order) values
          (r.id, 'Verify insurance coverage', 'Confirm specie insurance covers full appraised value', 'review', 'ceo', '1-2 days', 1),
          (r.id, 'Obtain insurance certificate', 'Request certificate naming SPV as additional insured', 'upload', 'ceo', '3-5 days', 2);
      when '2.8' then
        insert into default_tasks (governance_requirement_id, task_title, task_description, task_type, assigned_role, estimated_duration, sort_order) values
          (r.id, 'File Articles of Organization', 'File Series LLC with Wyoming SOS ($100 + $10/series)', 'action', 'ceo', '3-5 days', 1),
          (r.id, 'Obtain EIN', 'Apply for EIN from IRS for the SPV', 'action', 'ceo', '1 day', 2),
          (r.id, 'Open SPV bank account', 'Open dedicated bank account for the SPV', 'action', 'ceo', '1-2 weeks', 3),
          (r.id, 'Draft operating agreement', 'Counsel drafts operating agreement for the Series LLC', 'action', 'securities_counsel', '2-3 weeks', 4);
      when '2.9' then
        insert into default_tasks (governance_requirement_id, task_title, task_description, task_type, assigned_role, estimated_duration, sort_order) values
          (r.id, 'Engage securities counsel for PPM', 'Provide deal parameters to counsel for PPM drafting', 'action', 'ceo', '1 week', 1),
          (r.id, 'Review PPM draft', 'Review and comment on initial PPM draft', 'review', 'ceo', '1-2 weeks', 2),
          (r.id, 'Finalize subscription agreement', 'Review and approve subscription agreement', 'review', 'ceo', '1 week', 3),
          (r.id, 'Upload final legal document set', 'Upload all finalized legal documents', 'upload', 'ceo', '1 day', 4);
      when '2.10' then
        insert into default_tasks (governance_requirement_id, task_title, task_description, task_type, assigned_role, estimated_duration, sort_order) values
          (r.id, 'Develop custom external adapter', 'Build adapter connecting vault API to Chainlink oracle network', 'action', 'cto', '2-3 weeks', 1),
          (r.id, 'Test PoR on testnet', 'Deploy and test PoR feed on Polygon testnet', 'action', 'cto', '1 week', 2),
          (r.id, 'Verify oracle-gated minting', 'Test that minting is blocked when PoR is unconfirmed', 'action', 'cto', '2-3 days', 3);
      when '2.11' then
        insert into default_tasks (governance_requirement_id, task_title, task_description, task_type, assigned_role, estimated_duration, sort_order) values
          (r.id, 'Identify all covered persons', 'List all directors, officers, >20% owners, promoters, and compensated solicitors', 'action', 'compliance_officer', '1-2 days', 1),
          (r.id, 'Run background checks', 'Submit covered persons for 506(d) background screening', 'action', 'compliance_officer', '1-2 weeks', 2),
          (r.id, 'Counsel review of results', 'Securities counsel reviews findings and provides clearance or flags', 'review', 'securities_counsel', '3-5 days', 3),
          (r.id, 'Document 506(d) clearance', 'Record clearance in compliance file with supporting evidence', 'upload', 'compliance_officer', '1 day', 4);
      when '2.12' then
        insert into default_tasks (governance_requirement_id, task_title, task_description, task_type, assigned_role, estimated_duration, sort_order) values
          (r.id, 'Define escrow structure', 'Determine escrow agent, minimum raise (soft cap), and release conditions', 'action', 'ceo', '1 week', 1),
          (r.id, 'Engage escrow agent', 'Execute escrow agreement with selected escrow agent', 'action', 'ceo', '1-2 weeks', 2),
          (r.id, 'Document in PPM', 'Ensure escrow terms are fully disclosed in the PPM', 'review', 'securities_counsel', '1 week', 3);
      when '2.13' then
        insert into default_tasks (governance_requirement_id, task_title, task_description, task_type, assigned_role, estimated_duration, sort_order) values
          (r.id, 'Draft BCP/DRP', 'Create business continuity and disaster recovery plan', 'action', 'cto', '1-2 weeks', 1),
          (r.id, 'Test backup recovery', 'Validate Supabase backup and restore procedures', 'action', 'cto', '1-2 days', 2),
          (r.id, 'Document RPO/RTO targets', 'Define and document recovery point and recovery time objectives', 'upload', 'cto', '1 day', 3);
      when '2.14' then
        insert into default_tasks (governance_requirement_id, task_title, task_description, task_type, assigned_role, estimated_duration, sort_order) values
          (r.id, 'Engage tax counsel', 'Identify and engage counsel with collectibles tax and UBTI expertise', 'action', 'ceo', '1-2 weeks', 1),
          (r.id, 'Obtain tax structure opinion', 'Tax counsel provides opinion on 28% collectibles rate, UBTI, FIRPTA implications', 'review', 'securities_counsel', '2-3 weeks', 2),
          (r.id, 'Incorporate into PPM risk factors', 'Ensure tax risks are properly disclosed in the PPM', 'review', 'securities_counsel', '1 week', 3);
      else null;
    end case;
  end loop;

  -- Gate tasks (all gates get a standard review + approval task)
  for r in select id, step_number, title, gate_id from governance_requirements where is_gate = true order by sort_order
  loop
    insert into default_tasks (governance_requirement_id, task_title, task_description, task_type, assigned_role, estimated_duration, sort_order) values
      (r.id, 'Gate review: ' || r.title, 'Review all prerequisites for ' || coalesce(r.gate_id, 'gate') || '. Verify all conditions are met. Document any blockers.', 'review', 'compliance_officer', '1-2 days', 1),
      (r.id, 'Gate approval: ' || r.title, 'Formal approval to pass ' || coalesce(r.gate_id, 'gate') || '. All founders must sign off.', 'approval', 'ceo', '1 day', 2);
  end loop;
end $$;


-- ============================================================================
-- 7. SEED DATA — Example Partner Module (Rialto Full-Stack)
-- ============================================================================
-- This demonstrates how a partner module replaces/extends default tasks.
-- The Rialto partner must already exist in the partners table.

do $$
declare
  v_rialto_partner_id uuid;
  v_rialto_module_id uuid;
  v_gov_req_id uuid;
begin
  -- Check if Rialto partner exists (may not exist if seed data was not run)
  select id into v_rialto_partner_id from partners where name ilike '%rialto%' limit 1;

  -- If Rialto doesn't exist, create it for the example
  if v_rialto_partner_id is null then
    insert into partners (name, type, engagement_status, website, description, notes)
    values (
      'Rialto Markets',
      'broker_dealer',
      'evaluating',
      'https://rialtomarkets.com',
      'Full-stack securities infrastructure: BD, ATS, Transfer Agent, Tokenization, KYC/AML, White-Label Portal (RiMES)',
      'Example partner module for governance schema demonstration. Not yet engaged.'
    )
    returning id into v_rialto_partner_id;
  end if;

  -- Create the Rialto Full-Stack Module
  insert into partner_modules (partner_id, module_name, description, covers_functions, value_paths, version)
  values (
    v_rialto_partner_id,
    'Rialto Full-Stack Module',
    'Single partner covers BD, ATS, Transfer Agent, Tokenization, KYC/AML, and White-Label Portal. Replaces multi-vendor coordination with integrated platform.',
    array['broker_dealer', 'ats', 'transfer_agent', 'tokenization', 'kyc_aml', 'white_label'],
    array['tokenization'::value_path, 'fractional_securities'::value_path],
    1
  )
  returning id into v_rialto_module_id;

  -- Rialto module tasks for tokenization Phase 3 — Platform Configuration
  select id into v_gov_req_id from governance_requirements
    where value_path = 'tokenization' and step_number = '3.1' limit 1;

  if v_gov_req_id is not null then
    insert into module_tasks (partner_module_id, governance_requirement_id, task_title, task_description, task_type, assigned_role, estimated_duration, sort_order, replaces_default) values
      (v_rialto_module_id, v_gov_req_id, 'Configure token on Rialto platform', 'Use Rialto dashboard to set token symbol, supply, compliance rules. Rialto handles ERC-3643 deployment internally.', 'action', 'cto', '3-5 days', 1, true),
      (v_rialto_module_id, v_gov_req_id, 'Rialto compliance rule review', 'Rialto compliance team reviews and approves on-chain rules configuration', 'review', 'cto', '2-3 days', 2, false);
  end if;

  -- Rialto module tasks for Smart Contract Audit
  select id into v_gov_req_id from governance_requirements
    where value_path = 'tokenization' and step_number = '3.4' limit 1;

  if v_gov_req_id is not null then
    insert into module_tasks (partner_module_id, governance_requirement_id, task_title, task_description, task_type, assigned_role, estimated_duration, sort_order, replaces_default) values
      (v_rialto_module_id, v_gov_req_id, 'Rialto provides audit from partner firm', 'Rialto coordinates smart contract audit through their approved auditing partner. Cost included in platform fee.', 'action', 'cto', '2-4 weeks', 1, true),
      (v_rialto_module_id, v_gov_req_id, 'Review audit findings with Rialto', 'Joint review of audit report with Rialto engineering team', 'review', 'cto', '2-3 days', 2, false);
  end if;

  -- Rialto module tasks for Investor KYC (tokenization path)
  select id into v_gov_req_id from governance_requirements
    where value_path = 'tokenization' and step_number = '4.4' limit 1;

  if v_gov_req_id is not null then
    insert into module_tasks (partner_module_id, governance_requirement_id, task_title, task_description, task_type, assigned_role, estimated_duration, sort_order, replaces_default) values
      (v_rialto_module_id, v_gov_req_id, 'Investor completes KYC via Rialto portal', 'Rialto integrated KYC/AML handles investor identity verification, sanctions screening, and accreditation check.', 'automated', 'compliance_officer', '1-3 days', 1, true),
      (v_rialto_module_id, v_gov_req_id, 'Review Rialto KYC results', 'PleoChrome compliance officer reviews Rialto KYC clearance report', 'review', 'compliance_officer', '1 day', 2, false);
  end if;

  -- Rialto module tasks for Transfer Agent (fractional path)
  select id into v_gov_req_id from governance_requirements
    where value_path = 'fractional_securities' and step_number = '3.1' limit 1;

  if v_gov_req_id is not null then
    insert into module_tasks (partner_module_id, governance_requirement_id, task_title, task_description, task_type, assigned_role, estimated_duration, sort_order, replaces_default) values
      (v_rialto_module_id, v_gov_req_id, 'Configure Rialto Transfer Services', 'Set up cap table on Rialto Transfer Services platform. Integrated with Rialto BD and ATS.', 'action', 'ceo', '1-2 weeks', 1, true);
  end if;

  -- Rialto module tasks for BD Engagement (fractional path)
  select id into v_gov_req_id from governance_requirements
    where value_path = 'fractional_securities' and step_number = '3.2' limit 1;

  if v_gov_req_id is not null then
    insert into module_tasks (partner_module_id, governance_requirement_id, task_title, task_description, task_type, assigned_role, estimated_duration, sort_order, replaces_default) values
      (v_rialto_module_id, v_gov_req_id, 'Execute Rialto Markets BD agreement', 'Single agreement covers BD services, ATS access, and distribution. $50K setup + $5K/mo.', 'action', 'ceo', '1-2 weeks', 1, true);
  end if;

end $$;


-- ============================================================================
-- 8. ASSEMBLY FUNCTION — Build asset workflow from governance + modules
-- ============================================================================

create or replace function assemble_asset_workflow(
  p_asset_id uuid,
  p_value_path value_path,
  p_partner_module_ids uuid[] default '{}'
)
returns void as $$
declare
  v_gov_req record;
  v_step_id uuid;
  v_module_task record;
  v_default_task record;
  v_has_module_tasks boolean;
  v_module_replaces boolean;
  v_matched_module_id uuid;
  v_step_sort integer := 0;
begin
  -- ──────────────────────────────────────────────────────────────
  -- 1. Get all governance requirements for this value path
  --    (including shared requirements where value_path IS NULL)
  -- ──────────────────────────────────────────────────────────────
  for v_gov_req in
    select *
    from governance_requirements
    where is_active = true
      and (value_path = p_value_path or value_path is null)
    order by sort_order
  loop
    v_step_sort := v_step_sort + 1;

    -- ──────────────────────────────────────────────────────────
    -- 2. Create an asset_step for each governance requirement
    -- ──────────────────────────────────────────────────────────

    -- Find if any partner module covers this requirement
    v_matched_module_id := null;
    if array_length(p_partner_module_ids, 1) > 0 then
      select mt.partner_module_id into v_matched_module_id
      from module_tasks mt
      where mt.governance_requirement_id = v_gov_req.id
        and mt.partner_module_id = any(p_partner_module_ids)
        and mt.is_active = true
      limit 1;
    end if;

    insert into asset_steps (
      asset_id, phase, step_number, step_title, step_description,
      is_gate, sort_order,
      governance_requirement_id, partner_module_id
    ) values (
      p_asset_id,
      v_gov_req.phase,
      v_gov_req.step_number,
      v_gov_req.title,
      v_gov_req.description,
      v_gov_req.is_gate,
      v_step_sort,
      v_gov_req.id,
      v_matched_module_id
    )
    returning id into v_step_id;

    -- ──────────────────────────────────────────────────────────
    -- 3. Create task instances from partner module or defaults
    -- ──────────────────────────────────────────────────────────

    v_has_module_tasks := false;
    v_module_replaces := false;

    -- Check if any module task for this step has replaces_default = true
    -- This is a PER-STEP decision: if ANY module task replaces, ALL defaults are dropped
    if v_matched_module_id is not null then
      select exists(
        select 1 from module_tasks
        where governance_requirement_id = v_gov_req.id
          and partner_module_id = any(p_partner_module_ids)
          and is_active = true
          and replaces_default = true
      ) into v_module_replaces;

      -- Insert all module tasks for this governance step
      for v_module_task in
        select *
        from module_tasks
        where governance_requirement_id = v_gov_req.id
          and partner_module_id = v_matched_module_id
          and is_active = true
        order by sort_order
      loop
        v_has_module_tasks := true;

        insert into asset_task_instances (
          asset_id, asset_step_id, source_task_id, source_type,
          title, description, task_type
        ) values (
          p_asset_id, v_step_id, v_module_task.id, 'module',
          v_module_task.task_title, v_module_task.task_description, v_module_task.task_type
        );
      end loop;
    end if;

    -- Add default tasks ONLY if no module tasks exist OR module does not replace defaults
    if not v_has_module_tasks or not v_module_replaces then
      for v_default_task in
        select *
        from default_tasks
        where governance_requirement_id = v_gov_req.id
        order by sort_order
      loop
        insert into asset_task_instances (
          asset_id, asset_step_id, source_task_id, source_type,
          title, description, task_type
        ) values (
          p_asset_id, v_step_id, v_default_task.id, 'default',
          v_default_task.task_title, v_default_task.task_description, v_default_task.task_type
        );
      end loop;
    end if;

  end loop;

  -- ──────────────────────────────────────────────────────────────
  -- 4. Log the assembly in activity_log
  -- ──────────────────────────────────────────────────────────────
  insert into activity_log (
    asset_id, entity_type, action, detail,
    changes, category, severity
  ) values (
    p_asset_id,
    'asset',
    'workflow_assembled',
    'Workflow assembled for value path: ' || p_value_path::text ||
    ' with ' || coalesce(array_length(p_partner_module_ids, 1), 0)::text || ' partner module(s)',
    jsonb_build_object(
      'value_path', p_value_path::text,
      'partner_module_ids', to_jsonb(p_partner_module_ids),
      'governance_layer', 'v2_modular'
    ),
    'operational',
    'info'
  );

end;
$$ language plpgsql security invoker;

comment on function assemble_asset_workflow is
  'Assembles a complete asset workflow from governance requirements and partner modules. Creates asset_steps and asset_task_instances.';


-- ============================================================================
-- 9. VIEWS — Governance-aware views
-- ============================================================================

-- Governance coverage view: shows which requirements have module vs default tasks
create or replace view v_governance_coverage as
select
  gr.id as governance_requirement_id,
  gr.value_path,
  gr.phase,
  gr.step_number,
  gr.title,
  gr.is_gate,
  gr.regulatory_citation,
  (select count(*) from default_tasks dt where dt.governance_requirement_id = gr.id) as default_task_count,
  (select count(distinct mt.partner_module_id) from module_tasks mt where mt.governance_requirement_id = gr.id) as module_coverage_count,
  (select string_agg(distinct pm.module_name, ', ')
   from module_tasks mt
   join partner_modules pm on pm.id = mt.partner_module_id
   where mt.governance_requirement_id = gr.id) as covered_by_modules
from governance_requirements gr
where gr.is_active = true
order by gr.sort_order;

-- Asset workflow progress view: shows step completion with governance context
create or replace view v_asset_governance_progress as
select
  s.id as asset_id,
  s.name as asset_name,
  s.value_path,
  ast.id as step_id,
  ast.step_number,
  ast.step_title,
  ast.status as step_status,
  ast.phase,
  gr.regulatory_basis,
  gr.regulatory_citation,
  gr.is_gate,
  gr.gate_id,
  pm.module_name as partner_module,
  (select count(*) from asset_task_instances ati where ati.asset_step_id = ast.id) as total_tasks,
  (select count(*) from asset_task_instances ati where ati.asset_step_id = ast.id and ati.status = 'done') as completed_tasks
from assets s
join asset_steps ast on ast.asset_id = s.id
left join governance_requirements gr on gr.id = ast.governance_requirement_id
left join partner_modules pm on pm.id = ast.partner_module_id
where s.status not in ('archived', 'terminated')
order by s.id, ast.sort_order;


-- ============================================================================
-- 10. AUTO-LOG TASK INSTANCE COMPLETIONS
-- ============================================================================

create or replace function log_task_instance_completion()
returns trigger as $$
begin
  if old.status is distinct from new.status and new.status = 'done' then
    insert into activity_log (
      asset_id, entity_type, action, detail,
      performed_by, category, severity
    ) values (
      new.asset_id,
      'task_instance',
      'task_completed',
      'Task "' || new.title || '" completed (source: ' || new.source_type || ')',
      new.completed_by,
      'operational',
      'info'
    );
  end if;
  return new;
end;
$$ language plpgsql;

create trigger trg_task_instances_log_completion
  after update on asset_task_instances
  for each row execute function log_task_instance_completion();


-- ============================================================================
-- END OF MIGRATION 002
-- ============================================================================
-- Summary:
--   - 6 new tables: governance_requirements, governance_documents, partner_modules,
--     module_tasks, default_tasks, asset_task_instances
--   - 2 new columns on asset_steps: governance_requirement_id, partner_module_id
--   - 1 new enum: task_type
--   - 1 assembly function: assemble_asset_workflow()
--   - 2 new views: v_governance_coverage, v_asset_governance_progress
--   - 1 new trigger: log_task_instance_completion
--   - Full RLS on all new tables
--   - Seeded with:
--     * ~70 governance requirements across all 3 value paths + shared phases
--     * ~100+ default tasks
--     * 1 example partner module (Rialto Full-Stack) with ~10 module tasks
--   - Zero changes to existing tables (except additive ALTER on asset_steps)
-- ============================================================================


-- ============================================================================
-- 11. DEPRECATE OLD FUNCTION + ADD ROLE-BASED GOVERNANCE RESTRICTIONS
-- ============================================================================

-- Deprecate the old populate_asset_steps function from migration 001
-- The new assemble_asset_workflow() function supersedes it
comment on function populate_asset_steps is
  'DEPRECATED — Use assemble_asset_workflow() from migration 002 instead. This function creates legacy hardcoded steps without governance requirement linkage.';

-- Restrict governance requirement modifications to CEO/Compliance roles
-- Drop and recreate the insert/update policies with role checks
drop policy if exists "Team members can insert governance_requirements" on governance_requirements;
drop policy if exists "Team members can update governance_requirements" on governance_requirements;

create policy "Authorized roles can insert governance_requirements"
  on governance_requirements for insert
  with check (
    exists(
      select 1 from team_members
      where auth_user_id = auth.uid()
        and is_active = true
        and role in ('CEO', 'CTO', 'Compliance Officer')
    )
  );

create policy "Authorized roles can update governance_requirements"
  on governance_requirements for update
  using (
    exists(
      select 1 from team_members
      where auth_user_id = auth.uid()
        and is_active = true
        and role in ('CEO', 'CTO', 'Compliance Officer')
    )
  );

-- Add unified tasks view that combines both task systems
create or replace view v_unified_tasks as
select
  ati.id,
  ati.asset_id,
  ati.asset_step_id,
  ati.title,
  ati.description,
  ati.task_type::text as task_type,
  ati.assigned_to,
  ati.status::text as status,
  ati.completed_at,
  ati.completed_by,
  ati.evidence_url,
  ati.notes,
  ati.created_at,
  'governance' as task_source,
  ast.step_number,
  ast.phase::text as phase,
  a.name as asset_name,
  a.asset_reference
from asset_task_instances ati
join asset_steps ast on ast.id = ati.asset_step_id
join assets a on a.id = ati.asset_id

union all

select
  t.id,
  t.asset_id,
  t.step_id as asset_step_id,
  t.title,
  t.description,
  t.priority::text as task_type,
  t.assigned_to,
  t.status::text as status,
  t.completed_at,
  t.completed_by,
  null as evidence_url,
  t.notes,
  t.created_at,
  'adhoc' as task_source,
  null as step_number,
  null as phase,
  a.name as asset_name,
  a.asset_reference
from tasks t
left join assets a on a.id = t.asset_id;
-- ============================================================================
