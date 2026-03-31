-- ============================================================
-- EXPAND: Tokenization Template + Shared Template Subtasks
-- ============================================================
-- 1. Add missing Tokenization Phase 5 stages (5.T3 PoR, 5.T6 Form D, 5.T7 Blue Sky)
-- 2. Split Distribution 6.T3 "First Close & Secondary Market" into two stages
-- 3. Add subtasks to Shared template stages (1.1, 1.2, 2.1, 3.1)
-- 4. Fix sort_order gaps to match V2-UNIFIED-PHASE-MAPPING.md
-- ============================================================
-- Source: specs/V2-UNIFIED-PHASE-MAPPING.md (lines 200-275)
--         specs/V2-COMPLETE-TASK-DENSITY.md (subtask detail)
-- ============================================================

DO $$
DECLARE
  v_token_id    UUID;
  v_shared_id   UUID;
  v_stage_id    UUID;
  v_task_id     UUID;
  v_existing_stage_id UUID;
BEGIN

-- ============================================================
-- GET TEMPLATE IDs
-- ============================================================
SELECT id INTO v_token_id
FROM workflow_templates
WHERE value_model = 'tokenization' AND is_system = true
LIMIT 1;

SELECT id INTO v_shared_id
FROM workflow_templates
WHERE value_model IS NULL AND is_system = true AND is_default = true
LIMIT 1;

IF v_token_id IS NULL THEN
  RAISE EXCEPTION 'Tokenization template not found';
END IF;

IF v_shared_id IS NULL THEN
  RAISE EXCEPTION 'Shared template not found';
END IF;

-- ============================================================
-- SECTION 1: RENUMBER TOKENIZATION PHASE 5 STAGES
-- ============================================================
-- Current mapping (wrong):
--   sort_order 0 = 5.T1 Platform Config (correct)
--   sort_order 1 = 5.T2 Testnet (correct)
--   sort_order 2 = 5.T3 Smart Contract Audit (WRONG — should be 5.T4)
--   sort_order 3 = 5.T4 Mainnet + Form D + Blue Sky combined (WRONG — should split)
--   sort_order 4 = 5.T5 Investor Verification (WRONG — should be 5.T8)
--
-- Target mapping (per spec V2-UNIFIED-PHASE-MAPPING.md):
--   sort_order 0 = 5.T1 Platform Configuration
--   sort_order 1 = 5.T2 Testnet Deployment & Testing
--   sort_order 2 = 5.T3 Chainlink Proof of Reserve Integration (NEW)
--   sort_order 3 = 5.T4 Smart Contract Audit (was sort_order 2)
--   sort_order 4 = 5.T5 Mainnet Deployment (split from old sort_order 3)
--   sort_order 5 = 5.T6 File Form D with SEC via EDGAR (NEW, split)
--   sort_order 6 = 5.T7 Blue Sky State Notice Filings (NEW, split)
--   sort_order 7 = 5.T8 Investor Verification Setup (was sort_order 4, is gate)

-- Step 1a: Bump Investor Verification (gate) from sort_order 4 to 7
UPDATE template_stages
SET sort_order = 7
WHERE template_id = v_token_id
  AND phase = 'value_creation'
  AND sort_order = 4
  AND name LIKE 'Investor Verification%';

-- Step 1b: Bump "Mainnet Deployment & SEC Filing" from sort_order 3 to 4
-- We will later split Form D / Blue Sky into separate stages, so this becomes just "Mainnet Deployment"
UPDATE template_stages
SET sort_order = 4,
    name = 'Mainnet Deployment',
    description = 'Deploy audited smart contracts to Polygon mainnet with 3-of-3 multi-sig mint authorization.'
WHERE template_id = v_token_id
  AND phase = 'value_creation'
  AND sort_order = 3
  AND name LIKE 'Mainnet%';

-- Step 1c: Bump Smart Contract Audit from sort_order 2 to 3
UPDATE template_stages
SET sort_order = 3
WHERE template_id = v_token_id
  AND phase = 'value_creation'
  AND sort_order = 2
  AND name LIKE 'Smart Contract%';

-- Step 1d: Remove "File Form D" and "File Blue Sky" tasks from the old combined Mainnet stage
-- (They will be their own stages now)
-- Find the Mainnet Deployment stage (now at sort_order 4)
SELECT id INTO v_existing_stage_id
FROM template_stages
WHERE template_id = v_token_id
  AND phase = 'value_creation'
  AND sort_order = 4
  AND name = 'Mainnet Deployment';

-- Delete the Form D task from the mainnet stage
DELETE FROM template_tasks
WHERE template_stage_id = v_existing_stage_id
  AND title LIKE 'File Form D%';

-- Delete the Blue Sky task from the mainnet stage
DELETE FROM template_tasks
WHERE template_stage_id = v_existing_stage_id
  AND title LIKE 'File Blue Sky%';

-- ============================================================
-- SECTION 2: ADD NEW TOKENIZATION PHASE 5 STAGES
-- ============================================================

-- ── 5.T3: Chainlink Proof of Reserve Integration (sort_order 2) ──
INSERT INTO template_stages (template_id, phase, sort_order, name, description)
VALUES (v_token_id, 'value_creation', 2, 'Chainlink Proof of Reserve Integration',
  'Build external adapter for vault API, deploy to Chainlink testnet, connect PoR feed to identity registry, validate against physical vault inventory.')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Build external adapter for vault API',
     'Develop Chainlink external adapter that queries the vault custody API for real-time reserve data.',
     'automated', 'cto', 0),
    (v_stage_id, 'Deploy PoR adapter to Chainlink testnet',
     'Deploy the external adapter to Chainlink testnet. Configure job spec and test data feed accuracy.',
     'automated', 'cto', 1),
    (v_stage_id, 'Connect PoR feed to identity registry contract',
     'Wire the Chainlink PoR feed into the ERC-3643 identity registry contract for on-chain attestation.',
     'automated', 'cto', 2),
    (v_stage_id, 'Validate PoR reporting against physical vault inventory',
     'Cross-check on-chain PoR data against physical vault inventory records. Document variance analysis. Compliance sign-off.',
     'review', 'ceo', 3);


-- ── 5.T6: File Form D with SEC via EDGAR (sort_order 5) ──
INSERT INTO template_stages (template_id, phase, sort_order, name, description)
VALUES (v_token_id, 'value_creation', 5, 'File Form D with SEC via EDGAR',
  'Complete pre-filing checklist, submit Form D via EDGAR, track 15-day filing deadline, file amendments for material changes.')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Complete pre-filing checklist (CIK, entity info, offering terms)',
     'Verify CIK number registered, entity information current, offering terms finalized. Complete EDGAR pre-filing checklist.',
     'filing', 'ceo', 0),
    (v_stage_id, 'Submit Form D to EDGAR',
     'File Form D (Reg D 506(c)) via SEC EDGAR system. Upload filing confirmation and EDGAR acceptance receipt.',
     'filing', 'ceo', 1),
    (v_stage_id, 'Track 15-day post-first-sale filing deadline',
     'Monitor first-sale date. Form D must be filed within 15 calendar days of first sale. Set automated reminders.',
     'review', 'ceo', 2),
    (v_stage_id, 'File Form D amendment for material changes',
     'File Form D amendment via EDGAR for any material changes to offering terms, use of proceeds, or issuer information.',
     'filing', 'ceo', 3);


-- ── 5.T7: Blue Sky State Notice Filings (sort_order 6) ──
INSERT INTO template_stages (template_id, phase, sort_order, name, description)
VALUES (v_token_id, 'value_creation', 6, 'Blue Sky State Notice Filings',
  'Generate 46-state filing checklist, submit state notices with fees, track per-state approval status.')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Generate 46-state filing checklist',
     'Prepare comprehensive checklist of Blue Sky filing requirements for each state where offering will be made. Note state-specific fees and forms.',
     'filing', 'ceo', 0),
    (v_stage_id, 'Submit state notices with required fees',
     'File state notice forms with each applicable state securities regulator. Process filing fee payments. Upload receipts.',
     'payment_outgoing', 'ceo', 1),
    (v_stage_id, 'Track per-state approval status',
     'Maintain tracking spreadsheet of filing status per state: submitted, pending, approved, rejected. Follow up on outstanding filings.',
     'review', 'ceo', 2);


-- ============================================================
-- SECTION 3: SPLIT DISTRIBUTION 6.T3/6.T4
-- ============================================================
-- Current Distribution stages:
--   sort_order 0 = 6.T1 Investor Outreach
--   sort_order 1 = 6.T2 Investor Processing
--   sort_order 2 = 6.T3 "First Close & Secondary Market" (COMBINED — needs split)
--   sort_order 3 = 6.T4 Ongoing Compliance (gate)
--
-- Target:
--   sort_order 0 = 6.T1 Investor Outreach
--   sort_order 1 = 6.T2 Investor Processing
--   sort_order 2 = 6.T3 First Close (keep existing, rename)
--   sort_order 3 = 6.T4 Secondary Market Enablement (NEW)
--   sort_order 4 = 6.T5 Ongoing Compliance (gate, renumber)

-- Step 3a: Bump Ongoing Compliance gate from sort_order 3 to 4
UPDATE template_stages
SET sort_order = 4
WHERE template_id = v_token_id
  AND phase = 'distribution'
  AND sort_order = 3
  AND name LIKE 'Ongoing Compliance%';

-- Step 3b: Rename the combined stage to just "First Close"
SELECT id INTO v_existing_stage_id
FROM template_stages
WHERE template_id = v_token_id
  AND phase = 'distribution'
  AND sort_order = 2
  AND name LIKE 'First Close%';

UPDATE template_stages
SET name = 'First Close',
    description = 'Authorize first close, file Form D within 15 days of first sale, send investor welcome packages.'
WHERE id = v_existing_stage_id;

-- Remove the secondary market task from First Close stage
DELETE FROM template_tasks
WHERE template_stage_id = v_existing_stage_id
  AND title LIKE 'Enable secondary market%';

-- Add missing tasks to First Close
INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
VALUES
  (v_existing_stage_id, 'File Form D within 15 days of first sale',
   'Submit Form D filing with SEC within 15 calendar days of first token sale. Upload EDGAR confirmation.',
   'filing', 'ceo', 1),
  (v_existing_stage_id, 'Send investor welcome packages',
   'Distribute welcome packages to all investors with token details, reporting schedule, and contact information.',
   'communication', 'cro', 2);

-- Step 3c: Insert new 6.T4 Secondary Market Enablement stage
INSERT INTO template_stages (template_id, phase, sort_order, name, description)
VALUES (v_token_id, 'distribution', 3, 'Secondary Market Enablement',
  'Apply for ATS listing, configure secondary trading rules and restrictions, test secondary market trading flow.')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Apply for ATS listing (Rialto Markets / tZERO)',
     'Submit application for alternative trading system listing. Provide required issuer documentation, token contract details, and compliance certifications.',
     'filing', 'cro', 0),
    (v_stage_id, 'Configure secondary trading rules and restrictions',
     'Set up transfer restrictions, holding periods, accredited investor gating, and compliance rules on the ATS platform.',
     'review', 'cto', 1),
    (v_stage_id, 'Test secondary market trading flow',
     'Execute end-to-end test of secondary trading: list, match, settle. Verify compliance enforcement and transfer agent integration.',
     'review', 'cto', 2);


-- ============================================================
-- SECTION 4: EXPAND SHARED TEMPLATE SUBTASKS
-- ============================================================

-- ── Stage 1.1 (Initial Outreach) — subtasks already exist for tasks 1.1.1 and 1.1.2
-- The existing seed already has appropriate subtasks for these tasks.
-- (Search dealer pipeline, Screen source reputation, Tag source channel for 1.1.1)
-- (Verify asset class, Confirm minimum value, Check lending policy for 1.1.2)
-- No changes needed here.

-- ── Stage 1.2 (Holder Qualification) — expand subtasks ──────────

-- 1.2.1: Execute NDA — currently has 3 subtasks, spec calls for 4 distinct ones
-- Find the NDA task
SELECT t.id INTO v_task_id
FROM template_tasks t
JOIN template_stages s ON s.id = t.template_stage_id
WHERE s.template_id = v_shared_id
  AND s.phase = 'lead'
  AND s.sort_order = 1
  AND t.title LIKE 'Execute mutual NDA%';

-- Delete existing subtasks to replace with the 4-subtask spec version
DELETE FROM template_subtasks WHERE template_task_id = v_task_id;

INSERT INTO template_subtasks (template_task_id, title, description, default_assignee_role, sort_order)
VALUES
  (v_task_id, 'Send NDA template to holder',
   'Send standard mutual NDA via email. Log outbound email with timestamp and recipient.', 'ceo', 0),
  (v_task_id, 'Negotiate any modifications',
   'Review holder redlines, negotiate terms. Upload redline version with negotiation notes.', 'ceo', 1),
  (v_task_id, 'Obtain wet or e-signature',
   'Both parties sign executed NDA. Upload executed NDA. Record signature date and lock document.', 'ceo', 2),
  (v_task_id, 'File executed NDA in document library',
   'Tag NDA to asset record. Mark stage requirement complete. Document association logged.', 'ceo', 3);

-- 1.2.2: Preliminary KYC — currently has 3 subtasks, spec calls for 6
SELECT t.id INTO v_task_id
FROM template_tasks t
JOIN template_stages s ON s.id = t.template_stage_id
WHERE s.template_id = v_shared_id
  AND s.phase = 'lead'
  AND s.sort_order = 1
  AND t.title LIKE 'Preliminary KYC%';

-- Delete existing subtasks to replace with the 6-subtask spec version
DELETE FROM template_subtasks WHERE template_task_id = v_task_id;

INSERT INTO template_subtasks (template_task_id, title, description, default_assignee_role, sort_order)
VALUES
  (v_task_id, 'Collect government-issued ID (individuals) or formation docs (entities)',
   'Request passport/DL for individuals; articles of formation and certificate of good standing for entities. Document type and issuing authority recorded.', 'ceo', 0),
  (v_task_id, 'Run OFAC/SDN list screening',
   'Screen holder name, aliases, entity name against OFAC SDN, EU/UK sanctions lists. Log CLEAR or MATCH with timestamp and list version.', 'ceo', 1),
  (v_task_id, 'Run PEP (Politically Exposed Person) check',
   'Screen against global PEP databases. Log CLEAR or FLAG with timestamp.', 'ceo', 2),
  (v_task_id, 'Run adverse media scan',
   'Search news databases, court records, regulatory enforcement actions. Upload adverse media report with findings summary.', 'ceo', 3),
  (v_task_id, 'Verify beneficial ownership (entities >25% owners per CDD Rule)',
   'Identify all beneficial owners. Collect ID for each. Upload beneficial ownership certification. Log each owner verification status.', 'ceo', 4),
  (v_task_id, 'Compliance Officer review and preliminary sign-off',
   'Review all screening results. Issue preliminary clearance or flag for enhanced due diligence. Decision logged: PASS / CONDITIONAL / FAIL with rationale.', 'ceo', 5);


-- ── Stage 2.1 (Intake Questionnaire) — add subtasks to "Send questionnaire" ──
SELECT t.id INTO v_task_id
FROM template_tasks t
JOIN template_stages s ON s.id = t.template_stage_id
WHERE s.template_id = v_shared_id
  AND s.phase = 'intake'
  AND s.sort_order = 0
  AND t.title LIKE 'Send intake questionnaire%';

INSERT INTO template_subtasks (template_task_id, title, description, default_assignee_role, sort_order)
VALUES
  (v_task_id, 'Prepare intake package',
   'Assemble standardized questionnaire with asset-class-specific sections. Include document request checklist.', 'cro', 0),
  (v_task_id, 'Send questionnaire to holder',
   'Deliver intake questionnaire via email or portal link. Log send timestamp and delivery method.', 'cro', 1),
  (v_task_id, 'Follow up on incomplete items',
   'Track completion status. Send follow-up reminders for missing sections or documents. Log each follow-up.', 'cro', 2);


-- ── Stage 3.1 (Independent Appraisal) — add subtasks to first task "Engage appraisal panel" ──
SELECT t.id INTO v_task_id
FROM template_tasks t
JOIN template_stages s ON s.id = t.template_stage_id
WHERE s.template_id = v_shared_id
  AND s.phase = 'asset_maturity'
  AND s.sort_order = 0
  AND t.title LIKE 'Engage appraisal panel%';

-- This task name is "Engage appraisal panel (3 independent appraisers)" — the spec says "Commission appraisal"
-- but the request maps to the same concept. Add subtasks:
INSERT INTO template_subtasks (template_task_id, title, description, default_assignee_role, sort_order)
VALUES
  (v_task_id, 'Select approved appraiser(s)',
   'Research and select USPAP-certified appraisers with expertise in the asset class. Verify credentials and independence.', 'cro', 0),
  (v_task_id, 'Ship/transport asset for appraisal',
   'Arrange insured transport of asset to appraiser(s). Maintain chain of custody documentation throughout.', 'cro', 1),
  (v_task_id, 'Receive appraisal report(s)',
   'Collect completed USPAP-compliant appraisal reports from each appraiser. Upload to asset record.', 'cro', 2),
  (v_task_id, 'Reconcile appraised value with claimed value',
   'Compare appraisal results against holder claimed value. Document variance analysis. Flag significant discrepancies.', 'ceo', 3);


-- ============================================================
-- SUMMARY LOG
-- ============================================================
RAISE NOTICE 'Tokenization template expanded:';
RAISE NOTICE '  Phase 5 stages: % (was 5)', (SELECT count(*) FROM template_stages WHERE template_id = v_token_id AND phase = 'value_creation');
RAISE NOTICE '  Phase 6 stages: % (was 4)', (SELECT count(*) FROM template_stages WHERE template_id = v_token_id AND phase = 'distribution');
RAISE NOTICE '  Total token stages: %', (SELECT count(*) FROM template_stages WHERE template_id = v_token_id);
RAISE NOTICE '  Total shared stages: %', (SELECT count(*) FROM template_stages WHERE template_id = v_shared_id);

END $$;
