-- ============================================================
-- SEED: 6 Workflow Templates for PleoChrome V2
-- 1 Shared Pipeline (phases 1-3, all models)
-- 5 Model-Specific Pipelines (phases 4-6, per value model)
-- ============================================================
-- Source: specs/V2-UNIFIED-PHASE-MAPPING.md
--         specs/V2-COMPLETE-TASK-DENSITY.md
-- ============================================================

DO $$
DECLARE
  -- Template IDs
  v_shared_id   UUID;
  v_token_id    UUID;
  v_frac_id     UUID;
  v_debt_id     UUID;
  v_broker_id   UUID;
  v_barter_id   UUID;

  -- Reusable stage / task IDs
  v_stage_id    UUID;
  v_task_id     UUID;

BEGIN

-- ============================================================
-- 1. SHARED TEMPLATE (Phases 1-3 — Lead, Intake, Asset Maturity)
-- ============================================================
INSERT INTO workflow_templates (name, description, value_model, is_system, is_default)
VALUES (
  'Shared Pipeline (Lead + Intake + Maturity)',
  'Universal stages for all value models — phases 1-3. Covers lead qualification, intake/onboarding, and asset maturity certification.',
  NULL, true, true
) RETURNING id INTO v_shared_id;

-- ────────────────────────────────────────────────────────────
-- PHASE 1: LEAD (4 stages)
-- ────────────────────────────────────────────────────────────

-- Stage 1.1: Initial Outreach & Source ID
INSERT INTO template_stages (template_id, phase, sort_order, name, description)
VALUES (v_shared_id, 'lead', 0, 'Initial Outreach & Source ID',
  'Source asset holders through pipeline channels, confirm eligibility, and create lead record.')
RETURNING id INTO v_stage_id;

  -- Task 1.1.1
  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES (v_stage_id, 'Identify asset holder through pipeline sources',
    'Search dealer pipeline, vault partner inventory reports, and inbound inquiry queue to identify potential asset holders.',
    'review', 'cro', 0)
  RETURNING id INTO v_task_id;

    INSERT INTO template_subtasks (template_task_id, title, description, default_assignee_role, sort_order)
    VALUES
      (v_task_id, 'Search dealer pipeline and vault partner inventory reports',
       'Review dealer network contacts, vault inventory alerts, and inbound inquiry queue. Log timestamped search with source channels queried.', 'cro', 0),
      (v_task_id, 'Screen source/referrer reputation',
       'Check referrer for prior bad acts, sanctions associations, or known fraud. Upload source screening memo.', 'cro', 1),
      (v_task_id, 'Tag source channel in CRM',
       'Select source channel: referral / dealer / direct / broker / auction / inbound. Record tag with timestamp.', 'cro', 2);

  -- Task 1.1.2
  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES (v_stage_id, 'Confirm asset class eligibility and minimum value',
    'Verify asset is in a supported class and meets minimum value thresholds ($250K debt, $500K metals/minerals, $1M securities/RE).',
    'review', 'cro', 1)
  RETURNING id INTO v_task_id;

    INSERT INTO template_subtasks (template_task_id, title, description, default_assignee_role, sort_order)
    VALUES
      (v_task_id, 'Verify asset is in supported class',
       'Confirm asset class (gemstone, precious metal, real estate, mineral rights) against policy. Log eligibility status.', 'cro', 0),
      (v_task_id, 'Confirm minimum value threshold',
       'Check: $250K minimum for debt, $500K for metals/minerals, $1M for securities/RE. Log preliminary value estimate.', 'cro', 1),
      (v_task_id, 'Check asset type against lending/offering policy',
       'Reference LTV caps by class, regulatory barriers, and market liquidity. Log policy check result.', 'cro', 2);

  -- Task 1.1.3
  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES (v_stage_id, 'Create lead record in CRM pipeline',
    'Enter holder contact info, asset description, source channel. Assign initial pipeline stage and lead owner.',
    'automated', 'cro', 2);


-- Stage 1.2: Holder Qualification & Screening
INSERT INTO template_stages (template_id, phase, sort_order, name, description)
VALUES (v_shared_id, 'lead', 1, 'Holder Qualification & Screening',
  'Execute NDA, run preliminary KYC/KYB, assess holder sophistication, and verify ownership.')
RETURNING id INTO v_stage_id;

  -- Task 1.2.1
  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES (v_stage_id, 'Execute mutual NDA with asset holder',
    'Send NDA template, negotiate modifications, obtain wet/e-signature, file executed NDA in document library.',
    'document_upload', 'cro', 0)
  RETURNING id INTO v_task_id;

    INSERT INTO template_subtasks (template_task_id, title, description, default_assignee_role, sort_order)
    VALUES
      (v_task_id, 'Send NDA template to holder',
       'Send standard mutual NDA via email. Log outbound email with timestamp and recipient.', 'cro', 0),
      (v_task_id, 'Negotiate any modifications and obtain signature',
       'Review holder redlines, negotiate terms, obtain wet or e-signature. Upload executed NDA.', 'cro', 1),
      (v_task_id, 'File executed NDA in document library',
       'Tag NDA to asset record and mark stage requirement complete. Lock document.', 'cro', 2);

  -- Task 1.2.2
  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES (v_stage_id, 'Preliminary KYC/KYB screening',
    'Collect government ID or formation docs. Run OFAC/SDN, PEP, and adverse media screens. Verify beneficial ownership. Compliance sign-off.',
    'due_diligence', 'ceo', 1)
  RETURNING id INTO v_task_id;

    INSERT INTO template_subtasks (template_task_id, title, description, default_assignee_role, sort_order)
    VALUES
      (v_task_id, 'Collect government-issued ID or entity formation docs',
       'Request passport/DL for individuals; articles of formation and certificate of good standing for entities.', 'ceo', 0),
      (v_task_id, 'Run OFAC/SDN list screening',
       'Screen holder name, aliases, entity name against OFAC SDN, EU/UK sanctions lists. Log CLEAR or MATCH.', 'ceo', 1),
      (v_task_id, 'Run PEP check and adverse media scan',
       'Screen against global PEP databases and news/court/regulatory databases. Log results.', 'ceo', 2);

  -- Task 1.2.3
  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES (v_stage_id, 'Holder sophistication assessment',
    'Assess holder experience with the value path, evaluate understanding of custody requirements, document intended outcome and timeline.',
    'review', 'cro', 2);

  -- Task 1.2.4
  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES (v_stage_id, 'Preliminary title/ownership verification',
    'Request proof of ownership, run preliminary lien/encumbrance check (UCC search, title search), flag competing claims.',
    'due_diligence', 'ceo', 3);


-- Stage 1.3: Asset Screening & Preliminary Assessment
INSERT INTO template_stages (template_id, phase, sort_order, name, description)
VALUES (v_shared_id, 'lead', 2, 'Asset Screening & Preliminary Assessment',
  'Collect existing documentation, perform desktop valuation, preliminary risk assessment, and borrower financial capacity check.')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Collect existing asset documentation',
     'Request all existing third-party reports from holder (GIA, appraisals, title reports, production reports). Upload and verify authenticity.',
     'document_upload', 'cro', 0),
    (v_stage_id, 'Desktop valuation estimate',
     'Research comparable sales and market data. Calculate preliminary value range and estimate maximum offering/loan amount.',
     'review', 'cro', 1),
    (v_stage_id, 'Preliminary risk assessment',
     'Evaluate provenance quality, market liquidity, jurisdictional regulatory risks. Assign composite risk rating (LOW/MEDIUM/HIGH/CRITICAL).',
     'review', 'ceo', 2),
    (v_stage_id, 'Borrower/holder financial capacity check (if debt path)',
     'Request financial statements or tax returns. Assess DSCR for business-purpose. Verify intended use of proceeds.',
     'review', 'cro', 3);


-- Stage 1.4: Internal Deal Committee Review (GATE G1)
INSERT INTO template_stages (template_id, phase, sort_order, name, description, is_gate, gate_id)
VALUES (v_shared_id, 'lead', 3, 'Internal Deal Committee Review',
  'Compile lead screening results, convene deal committee vote (Go/No-Go/Conditional), communicate decision to holder.',
  true, 'G1')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Prepare deal summary memo',
     'Compile all preliminary data: asset details, holder info, KYC results, valuation, risk assessment. Attach supporting memos. Provide recommendation.',
     'review', 'cro', 0),
    (v_stage_id, 'Deal committee vote (Go/No-Go)',
     'Schedule deal committee meeting. CEO, CTO, CRO each review and cast vote. Document final decision and conditions.',
     'approval', 'ceo', 1),
    (v_stage_id, 'Communicate decision to holder',
     'If GO: send engagement agreement. If NO-GO: send professional decline. If CONDITIONAL: outline conditions for proceeding.',
     'communication', 'cro', 2);


-- ────────────────────────────────────────────────────────────
-- PHASE 2: INTAKE (6 stages)
-- ────────────────────────────────────────────────────────────

-- Stage 2.1: Asset Holder Intake Questionnaire
INSERT INTO template_stages (template_id, phase, sort_order, name, description)
VALUES (v_shared_id, 'intake', 0, 'Asset Holder Intake Questionnaire',
  'Comprehensive questionnaire capturing holder info, asset description, custody, provenance, certifications, liens, desired outcome, timeline.')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Send intake questionnaire to asset holder',
     'Deliver standardized questionnaire covering: entity type, contact, asset description, location, provenance history, existing certs, liens, desired outcome, timeline.',
     'communication', 'cro', 0),
    (v_stage_id, 'Receive and review completed questionnaire',
     'Upload completed questionnaire and all supporting documents. Review for completeness and flag any gaps.',
     'document_upload', 'cro', 1),
    (v_stage_id, 'Validate questionnaire data against lead screening',
     'Cross-reference questionnaire answers with preliminary lead data. Flag discrepancies for follow-up.',
     'review', 'ceo', 2);


-- Stage 2.2: Full KYC/KYB Verification
INSERT INTO template_stages (template_id, phase, sort_order, name, description)
VALUES (v_shared_id, 'intake', 1, 'Full KYC/KYB Verification',
  'Formal identity verification, beneficial ownership documentation, and compliance sign-off.')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Complete formal identity verification',
     'Run enhanced KYC/KYB using verified identity providers. Document all beneficial owners (>25% per CDD Rule).',
     'due_diligence', 'ceo', 0),
    (v_stage_id, 'Upload beneficial ownership documentation',
     'Collect and upload beneficial ownership certification, ownership structure chart, and ID for each beneficial owner.',
     'document_upload', 'ceo', 1),
    (v_stage_id, 'Compliance officer sign-off on KYC/KYB',
     'Review all verification results. Issue formal clearance: PASS / CONDITIONAL / FAIL with rationale.',
     'approval', 'ceo', 2);


-- Stage 2.3: OFAC/SDN & PEP Screening (Formal)
INSERT INTO template_stages (template_id, phase, sort_order, name, description)
VALUES (v_shared_id, 'intake', 2, 'OFAC/SDN & PEP Screening (Formal)',
  'Formal sanctions and politically exposed person screening with documented results.')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Run formal OFAC/SDN screening',
     'Screen all parties (holder, beneficial owners, entity) against OFAC SDN, EU, UK, and UN sanctions lists. Upload results documentation.',
     'due_diligence', 'ceo', 0),
    (v_stage_id, 'Upload screening results documentation',
     'Archive all screening certificates and results with timestamps, list versions, and clear/match determinations.',
     'document_upload', 'ceo', 1);


-- Stage 2.4: Provenance Review & Chain of Custody
INSERT INTO template_stages (template_id, phase, sort_order, name, description)
VALUES (v_shared_id, 'intake', 3, 'Provenance Review & Chain of Custody',
  'Detailed provenance investigation, chain of custody documentation, and OECD conflict mineral assessment.')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Review provenance documentation',
     'Analyze full chain of custody from origin to current holder. Identify gaps, verify transfer documents.',
     'review', 'ceo', 0),
    (v_stage_id, 'Upload chain of custody documentation',
     'Collect and upload all provenance records: bills of sale, import/export records, prior ownership transfers.',
     'document_upload', 'cro', 1),
    (v_stage_id, 'OECD conflict mineral/resource assessment',
     'For applicable asset classes: assess compliance with OECD Due Diligence Guidance for responsible supply chains.',
     'due_diligence', 'ceo', 2);


-- Stage 2.5: Existing Documentation Review
INSERT INTO template_stages (template_id, phase, sort_order, name, description)
VALUES (v_shared_id, 'intake', 4, 'Existing Documentation Review',
  'Inventory all existing documentation and perform gap analysis against requirements.')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Inventory all existing asset documentation',
     'Catalog every document received: certifications, appraisals, title reports, insurance, prior agreements. Note age and validity.',
     'review', 'cro', 0),
    (v_stage_id, 'Gap analysis against requirements',
     'Compare existing documents against full requirements for the target value model. Produce gap report with action items.',
     'review', 'ceo', 1);


-- Stage 2.6: Engagement Agreement Execution (GATE G2)
INSERT INTO template_stages (template_id, phase, sort_order, name, description, is_gate, gate_id)
VALUES (v_shared_id, 'intake', 5, 'Engagement Agreement Execution',
  'Execute formal engagement agreement. Legal review, retainer collection if applicable. Gate: Intake Complete.',
  true, 'G2')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Upload engagement agreement for legal review',
     'Upload executed engagement agreement draft. Route to legal counsel for review and approval.',
     'document_upload', 'cro', 0),
    (v_stage_id, 'Legal review and approval of engagement agreement',
     'Legal counsel reviews terms, conditions, and obligations. Approve or request modifications.',
     'approval', 'ceo', 1),
    (v_stage_id, 'Collect retainer payment (if applicable)',
     'Process engagement retainer per agreement terms. Upload payment confirmation.',
     'payment_incoming', 'cro', 2);


-- ────────────────────────────────────────────────────────────
-- PHASE 3: ASSET MATURITY (6 stages per user spec; mapping from 7 in source)
-- ────────────────────────────────────────────────────────────

-- Stage 3.1: Independent Appraisal
INSERT INTO template_stages (template_id, phase, sort_order, name, description)
VALUES (v_shared_id, 'asset_maturity', 0, 'Independent Appraisal',
  'Engage certified appraisers, conduct 3 independent USPAP-compliant appraisals, variance analysis, and value determination.')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Engage appraisal panel (3 independent appraisers)',
     'Select and engage 3 certified, independent appraisers. Verify credentials. Execute appraiser agreements.',
     'meeting', 'cro', 0),
    (v_stage_id, 'Complete sequential appraisal process',
     'Transport asset to each appraiser. Collect 3 USPAP-compliant appraisal reports. Maintain chain of custody.',
     'physical_action', 'cro', 1),
    (v_stage_id, 'Variance analysis and value determination',
     'Calculate variance across 3 appraisals (must be within 15-20%). Document final offering value. Obtain sign-off.',
     'review', 'ceo', 2);


-- Stage 3.2: Physical Custody Transfer
INSERT INTO template_stages (template_id, phase, sort_order, name, description)
VALUES (v_shared_id, 'asset_maturity', 1, 'Physical Custody Transfer',
  'Select institutional vault, execute custody agreement, transfer asset via insured transport.')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Vault selection and evaluation',
     'Evaluate institutional vault options (Brinks, Malca-Amit, etc.). Assess security, insurance, reporting capabilities.',
     'meeting', 'cro', 0),
    (v_stage_id, 'Execute custody agreement',
     'Negotiate and execute custody/storage agreement with selected vault. Upload executed agreement.',
     'document_upload', 'ceo', 1),
    (v_stage_id, 'Insured transport and custody transfer',
     'Arrange insured transport to vault. Transfer physical custody. Obtain vault receipt and segregated storage confirmation.',
     'physical_action', 'cro', 2);


-- Stage 3.3: Insurance Placement
INSERT INTO template_stages (template_id, phase, sort_order, name, description)
VALUES (v_shared_id, 'asset_maturity', 2, 'Insurance Placement',
  'Place specie insurance and transit insurance covering full appraised value.')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Place specie insurance covering full appraised value',
     'Engage specialty insurance broker. Obtain specie insurance policy covering full appraised value in vault.',
     'document_upload', 'cro', 0),
    (v_stage_id, 'Verify insurance policy and upload certificate',
     'Verify policy terms, coverage limits, exclusions. Upload insurance certificate to asset record.',
     'review', 'ceo', 1);


-- Stage 3.4: Proof of Reserve Setup (if applicable)
INSERT INTO template_stages (template_id, phase, sort_order, name, description)
VALUES (v_shared_id, 'asset_maturity', 3, 'Proof of Reserve Setup (if applicable)',
  'Configure vault API/reporting feed and Chainlink Proof of Reserve integration for applicable models.')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Vault API/reporting activation',
     'Configure vault API feed for real-time custody verification. Verify data accuracy against physical holdings.',
     'automated', 'cto', 0),
    (v_stage_id, 'Proof of Reserve integration (Chainlink)',
     'Build external adapter, connect PoR feed. Verify on-chain attestation matches vault data.',
     'automated', 'cto', 1);


-- Stage 3.5: Environmental & Condition Assessment
INSERT INTO template_stages (template_id, phase, sort_order, name, description)
VALUES (v_shared_id, 'asset_maturity', 4, 'Environmental & Condition Assessment',
  'Asset-class-specific certification and condition reporting.')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Submit for lab certification (GIA/SSEF/LBMA)',
     'Submit asset to appropriate certification authority. Obtain certification report (GIA ID & Origin, SSEF, LBMA Assay, etc.).',
     'physical_action', 'cro', 0),
    (v_stage_id, 'Environmental/condition assessment',
     'For RE: Phase I Environmental. For minerals: geological survey. For gems: condition assessment. Upload reports.',
     'document_upload', 'cro', 1);


-- Stage 3.6: Asset Maturity Certification (GATE G3)
INSERT INTO template_stages (template_id, phase, sort_order, name, description, is_gate, gate_id)
VALUES (v_shared_id, 'asset_maturity', 5, 'Asset Maturity Certification',
  'Final certification that asset is appraised, in vault, insured, and reporting-ready. Gate: Asset Maturity.',
  true, 'G3')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Compile maturity certification package',
     'Assemble all lab reports, appraisals, vault receipt, insurance cert, PoR confirmation into certification package.',
     'review', 'ceo', 0),
    (v_stage_id, 'CEO sign-off: Asset Maturity Gate',
     'CEO reviews all documentation. Confirm: certified, appraised (variance OK), vaulted, insured, reporting active.',
     'approval', 'ceo', 1);


-- ============================================================
-- 2. TOKENIZATION TEMPLATE (Phases 4-6)
-- ============================================================
INSERT INTO workflow_templates (name, description, value_model, is_system, is_default)
VALUES (
  'Tokenization Pipeline (Security + Value Creation + Distribution)',
  'ERC-3643 / Reg D 506(c) tokenization workflow — SPV formation, smart contracts, token issuance, investor distribution.',
  'tokenization', true, true
) RETURNING id INTO v_token_id;

-- ── Phase 4: Security (Tokenization) ─────────────────────────

-- 4.T1: Series SPV Formation
INSERT INTO template_stages (template_id, phase, sort_order, name, description)
VALUES (v_token_id, 'security', 0, 'Series SPV Formation',
  'File series designation under master SPV, obtain EIN, execute Series Operating Agreement.')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'File series designation with state',
     'File series LLC designation under master PleoChrome SPV. Obtain EIN from IRS.', 'filing', 'ceo', 0),
    (v_stage_id, 'Execute Series Operating Agreement',
     'Draft and execute Series Operating Agreement defining token holder rights, distributions, governance.', 'document_upload', 'ceo', 1);

-- 4.T2: PPM Drafting
INSERT INTO template_stages (template_id, phase, sort_order, name, description)
VALUES (v_token_id, 'security', 1, 'PPM Drafting (60-150 pages)',
  'Draft Private Placement Memorandum, Subscription Agreement, and Token Purchase Agreement with securities counsel.')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Draft PPM with securities counsel',
     'Engage Bull Blockchain Law (or equivalent). Draft 60-150 page PPM covering risk factors, use of proceeds, token economics.', 'review', 'ceo', 0),
    (v_stage_id, 'Draft Subscription Agreement and Token Purchase Agreement',
     'Create investor subscription and token purchase documents. Legal review.', 'document_upload', 'ceo', 1),
    (v_stage_id, 'Legal review and finalization of offering documents',
     'Final securities counsel review. Address all comments. Lock documents for distribution.', 'approval', 'ceo', 2);

-- 4.T3: Investor Questionnaire & Accreditation Forms
INSERT INTO template_stages (template_id, phase, sort_order, name, description)
VALUES (v_token_id, 'security', 2, 'Investor Questionnaire & Accreditation Forms',
  'Prepare accredited investor verification forms and investor suitability questionnaire.')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Draft investor questionnaire and accreditation templates',
     'Create templates for accredited investor verification (income, net worth, professional certification paths).', 'review', 'ceo', 0),
    (v_stage_id, 'Legal review of investor forms',
     'Securities counsel reviews all investor-facing forms for compliance.', 'approval', 'ceo', 1);

-- 4.T4: Custody Agreement (SPV ↔ Vault)
INSERT INTO template_stages (template_id, phase, sort_order, name, description)
VALUES (v_token_id, 'security', 3, 'Custody Agreement (SPV ↔ Vault)',
  'Negotiate and execute custody control agreement between Series SPV and vault provider.')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Negotiate custody agreement terms',
     'Negotiate SPV ↔ vault custody control agreement. Define access, reporting, insurance, and release conditions.', 'meeting', 'ceo', 0),
    (v_stage_id, 'Execute custody agreement',
     'Legal sign-off and execution of custody control agreement. Upload executed document.', 'document_upload', 'ceo', 1);

-- 4.T5: MSB Classification Legal Opinion
INSERT INTO template_stages (template_id, phase, sort_order, name, description)
VALUES (v_token_id, 'security', 4, 'MSB Classification Legal Opinion',
  'Obtain legal opinion on money services business classification and fund flow analysis.')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Engage counsel for MSB classification opinion',
     'Engage specialized counsel to analyze whether token issuance triggers MSB registration. Conduct fund flow analysis.', 'review', 'ceo', 0),
    (v_stage_id, 'Upload legal opinion',
     'Receive and upload MSB classification legal opinion with fund flow analysis.', 'document_upload', 'ceo', 1);

-- 4.T6: Form D Preparation (GATE G4)
INSERT INTO template_stages (template_id, phase, sort_order, name, description, is_gate, gate_id)
VALUES (v_token_id, 'security', 5, 'Form D Preparation',
  'Prepare EDGAR filing for Form D (Reg D 506(c)). Gate: Security Complete (Token).', true, 'G4')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Prepare Form D EDGAR filing',
     'Prepare all Form D fields for EDGAR submission. Legal review of filing content.', 'filing', 'ceo', 0),
    (v_stage_id, 'Final security compliance sign-off',
     'CEO/Compliance reviews all security phase deliverables. Gate approval required before value creation.', 'approval', 'ceo', 1);


-- ── Phase 5: Value Creation (Tokenization) ──────────────────

-- 5.T1: Platform Configuration
INSERT INTO template_stages (template_id, phase, sort_order, name, description)
VALUES (v_token_id, 'value_creation', 0, 'Platform Configuration (Brickken/Zoniqx)',
  'Configure token parameters, compliance rules, and identity registry on selected tokenization platform.')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Configure token parameters and compliance rules',
     'Set token supply, transfer restrictions, compliance modules (ERC-3643 TREX), identity registry.', 'automated', 'cto', 0),
    (v_stage_id, 'Upload platform configuration documentation',
     'Document all configuration parameters, compliance rules, and identity registry settings.', 'document_upload', 'cto', 1);

-- 5.T2: Testnet Deployment & Testing
INSERT INTO template_stages (template_id, phase, sort_order, name, description)
VALUES (v_token_id, 'value_creation', 1, 'Testnet Deployment & Testing',
  'Deploy smart contracts to testnet, run full test suite including mint/transfer/compliance/block scenarios.')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Deploy to testnet and run full test suite',
     'Deploy token contracts to Polygon Mumbai testnet. Test mint, transfer, compliance blocking, burn, pause.', 'automated', 'cto', 0),
    (v_stage_id, 'Upload test report',
     'Document all test results. Flag any failures. Must pass 100% before mainnet.', 'document_upload', 'cto', 1);

-- 5.T3: Smart Contract Audit
INSERT INTO template_stages (template_id, phase, sort_order, name, description)
VALUES (v_token_id, 'value_creation', 2, 'Smart Contract Audit',
  'Engage third-party auditor, review findings, remediate issues, obtain audit pass.')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Engage smart contract auditor',
     'Select and engage reputable smart contract audit firm. Submit contracts for review.', 'meeting', 'cto', 0),
    (v_stage_id, 'Review audit findings and remediate',
     'Address all critical and high severity findings. Re-submit for verification.', 'review', 'cto', 1),
    (v_stage_id, 'Upload audit report and obtain pass',
     'Upload final audit report. Must show all critical/high findings resolved.', 'approval', 'cto', 2);

-- 5.T4: Mainnet Deployment & Form D Filing
INSERT INTO template_stages (template_id, phase, sort_order, name, description)
VALUES (v_token_id, 'value_creation', 3, 'Mainnet Deployment & SEC Filing',
  'Deploy to Polygon mainnet, file Form D with SEC via EDGAR, file Blue Sky state notices.')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Deploy to Polygon mainnet',
     'Deploy audited contracts to Polygon mainnet. Verify parameters. Require 3-of-3 multi-sig for mint authorization.', 'automated', 'cto', 0),
    (v_stage_id, 'File Form D with SEC (EDGAR)',
     'Submit Form D via EDGAR. Upload confirmation and CIK number.', 'filing', 'ceo', 1),
    (v_stage_id, 'File Blue Sky state notices (46 states)',
     'Submit state notice filings. Upload tracking spreadsheet with status per state.', 'filing', 'ceo', 2);

-- 5.T5: Investor Verification Setup (GATE G5)
INSERT INTO template_stages (template_id, phase, sort_order, name, description, is_gate, gate_id)
VALUES (v_token_id, 'value_creation', 4, 'Investor Verification Setup',
  'Configure accredited investor verification flow and investor KYC. Gate: Value Creation Complete (Token).', true, 'G5')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Set up accredited investor verification flow',
     'Configure third-party accreditation verification (income, net worth, professional cert paths).', 'automated', 'cto', 0),
    (v_stage_id, 'Configure investor KYC pipeline',
     'Set up identity verification, sanctions screening, and onboarding flow for token investors.', 'automated', 'cto', 1),
    (v_stage_id, 'End-to-end investor onboarding test',
     'Run full test: KYC → accreditation → subscription → token mint. Verify compliance blocking for unqualified.', 'review', 'ceo', 2);


-- ── Phase 6: Distribution (Tokenization) ────────────────────

-- 6.T1: Investor Outreach
INSERT INTO template_stages (template_id, phase, sort_order, name, description)
VALUES (v_token_id, 'distribution', 0, 'Investor Outreach (506(c) General Solicitation)',
  'Launch marketing campaign under Reg D 506(c) general solicitation. Investor presentations and roadshow.')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Launch investor marketing campaign',
     'Execute general solicitation strategy: digital marketing, accredited investor networks, pitch deck distribution.', 'communication', 'cro', 0),
    (v_stage_id, 'Conduct investor presentations',
     'Schedule and conduct investor presentations. Track interest and follow-ups.', 'meeting', 'cro', 1);

-- 6.T2: Investor Processing
INSERT INTO template_stages (template_id, phase, sort_order, name, description)
VALUES (v_token_id, 'distribution', 1, 'Investor Processing (per investor)',
  'KYC each investor, verify accreditation, execute subscription docs, receive wire, mint tokens.')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Process investor KYC and accreditation',
     'Run KYC, verify accredited investor status, collect subscription documents.', 'due_diligence', 'ceo', 0),
    (v_stage_id, 'Receive investment wire and mint tokens',
     'Receive investor wire. Upon confirmation, mint tokens to verified wallet address.', 'payment_incoming', 'cro', 1);

-- 6.T3: First Close & Secondary Market
INSERT INTO template_stages (template_id, phase, sort_order, name, description)
VALUES (v_token_id, 'distribution', 2, 'First Close & Secondary Market',
  'Authorize first close, file Form D amendment, enable ATS listing for secondary trading.')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Authorize first close',
     'CEO authorizes first close. File Form D with SEC within 15 days of first sale. Send investor welcome packages.', 'approval', 'ceo', 0),
    (v_stage_id, 'Enable secondary market (ATS listing)',
     'List tokens on ATS (tZERO, Securitize, Rialto). Configure trading rules and transfer restrictions.', 'automated', 'cto', 1);

-- 6.T4: Ongoing Compliance (GATE G6)
INSERT INTO template_stages (template_id, phase, sort_order, name, description, is_gate, gate_id)
VALUES (v_token_id, 'distribution', 3, 'Ongoing Compliance',
  'Quarterly sanctions re-screen, vault verification, investor updates. Annual reappraisal and K-1s. Gate: Distribution Complete.', true, 'G6')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Quarterly compliance cycle',
     'Re-screen all investors against sanctions lists. Verify vault custody. Send investor updates.', 'due_diligence', 'ceo', 0),
    (v_stage_id, 'Annual reappraisal and Form D amendment',
     'Conduct annual asset reappraisal. File Form D annual amendment. Issue K-1s to all token holders.', 'filing', 'ceo', 1),
    (v_stage_id, 'Chainlink PoR maintenance',
     'Maintain Proof of Reserve feed. Verify on-chain attestation matches vault data quarterly.', 'automated', 'cto', 2);


-- ============================================================
-- 3. FRACTIONAL SECURITIES TEMPLATE (Phases 4-6)
-- ============================================================
INSERT INTO workflow_templates (name, description, value_model, is_system, is_default)
VALUES (
  'Fractional Securities Pipeline (Security + Value Creation + Distribution)',
  'Reg D / Reg A+ / Reg CF fractional unit offering — SPV formation, unit structuring, transfer agent, investor distribution.',
  'fractional_securities', true, true
) RETURNING id INTO v_frac_id;

-- ── Phase 4: Security (Fractional) ──────────────────────────

-- 4.F1: Regulatory Pathway Selection
INSERT INTO template_stages (template_id, phase, sort_order, name, description)
VALUES (v_frac_id, 'security', 0, 'Regulatory Pathway Selection',
  'Evaluate Reg D vs Reg A+ vs Reg CF. Counsel recommendation and decision matrix.')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Regulatory pathway decision matrix',
     'Analyze Reg D (accredited only, no limit) vs Reg A+ ($75M cap, non-accredited) vs Reg CF ($5M cap). Document recommendation.', 'review', 'ceo', 0),
    (v_stage_id, 'Securities counsel recommendation',
     'Counsel provides formal recommendation on regulatory pathway. CEO approval.', 'approval', 'ceo', 1);

-- 4.F2: Series SPV Formation & Unit Structuring
INSERT INTO template_stages (template_id, phase, sort_order, name, description)
VALUES (v_frac_id, 'security', 1, 'Series SPV Formation & Unit Structuring',
  'File series SPV, define unit classes (A/B/Preferred), execute operating agreement.')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'File series SPV and define unit classes',
     'File series LLC designation. Define Class A/B/Preferred units with voting rights, distribution waterfall.', 'filing', 'ceo', 0),
    (v_stage_id, 'Execute Series Operating Agreement',
     'Draft and execute operating agreement defining fractional unit holder rights.', 'document_upload', 'ceo', 1);

-- 4.F3: Offering Document Preparation
INSERT INTO template_stages (template_id, phase, sort_order, name, description)
VALUES (v_frac_id, 'security', 2, 'Offering Document Preparation',
  'Draft PPM (Reg D), Form 1-A (Reg A+), or Form C (Reg CF) with securities counsel.')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Draft offering documents',
     'Draft PPM or Form 1-A/C per selected regulatory pathway. Include risk factors, financials, use of proceeds.', 'review', 'ceo', 0),
    (v_stage_id, 'Legal review and finalization',
     'Securities counsel reviews all offering documents. Finalize for distribution.', 'approval', 'ceo', 1);

-- 4.F4: Transfer Agent & Broker-Dealer Engagement
INSERT INTO template_stages (template_id, phase, sort_order, name, description)
VALUES (v_frac_id, 'security', 3, 'Transfer Agent & Broker-Dealer Engagement',
  'Engage transfer agent for unit management and broker-dealer for distribution.')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Engage transfer agent',
     'Evaluate and engage registered transfer agent. Execute TA agreement for unit issuance and transfer tracking.', 'meeting', 'cro', 0),
    (v_stage_id, 'Engage broker-dealer',
     'Evaluate BD options (Dalmore, Rialto). Execute BD agreement. File FINRA 5123 if applicable.', 'meeting', 'cro', 1);

-- 4.F5: SEC Filing Preparation (GATE G4)
INSERT INTO template_stages (template_id, phase, sort_order, name, description, is_gate, gate_id)
VALUES (v_frac_id, 'security', 4, 'SEC Filing Preparation',
  'Prepare Form D / Form 1-A / Form C for SEC submission. Gate: Security Complete (Fractional).', true, 'G4')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Prepare SEC filing',
     'Prepare all filing content per selected pathway. Legal review before submission.', 'filing', 'ceo', 0),
    (v_stage_id, 'Final security compliance sign-off',
     'CEO/Compliance reviews all security phase deliverables. Gate approval.', 'approval', 'ceo', 1);

-- ── Phase 5: Value Creation (Fractional) ────────────────────

-- 5.F1: SEC Filing & Qualification
INSERT INTO template_stages (template_id, phase, sort_order, name, description)
VALUES (v_frac_id, 'value_creation', 0, 'SEC Filing & Qualification',
  'File with SEC. For Reg A+: await qualification. For Reg D: file Form D within 15 days of first sale.')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Submit SEC filing',
     'File Form D, Form 1-A, or Form C via EDGAR. Upload filing confirmation.', 'filing', 'ceo', 0),
    (v_stage_id, 'Blue Sky state filings (if Reg D)',
     'File state notice filings per Blue Sky requirements. Track status per state.', 'filing', 'ceo', 1);

-- 5.F2: Investor Onboarding Infrastructure
INSERT INTO template_stages (template_id, phase, sort_order, name, description)
VALUES (v_frac_id, 'value_creation', 1, 'Investor Onboarding Infrastructure',
  'Build KYC/AML flow, accreditation verification, e-signature, and escrow setup.')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Configure KYC/AML and accreditation flow',
     'Set up investor identity verification, AML screening, and accreditation verification (if Reg D).', 'automated', 'cto', 0),
    (v_stage_id, 'Set up e-signature and escrow',
     'Configure e-signature flow for subscription agreements. Set up escrow account for investor funds.', 'automated', 'cto', 1);

-- 5.F3: Investor Data Room & Marketing
INSERT INTO template_stages (template_id, phase, sort_order, name, description)
VALUES (v_frac_id, 'value_creation', 2, 'Investor Data Room & Marketing',
  'Assemble investor data room, prepare marketing materials with compliance review.')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Build investor data room',
     'Assemble PPM, certifications, appraisals, vault receipt, insurance, team bios into secure data room.', 'document_upload', 'cro', 0),
    (v_stage_id, 'Prepare marketing materials (counsel-reviewed)',
     'Create pitch deck, one-pager, email templates. Counsel compliance review. BD approval.', 'review', 'cro', 1);

-- 5.F4: E2E Investor Onboarding Test (GATE G5)
INSERT INTO template_stages (template_id, phase, sort_order, name, description, is_gate, gate_id)
VALUES (v_frac_id, 'value_creation', 3, 'E2E Investor Onboarding Test',
  'Test full investor flow: KYC → accreditation → subscription → escrow. Gate: Value Creation Complete (Fractional).', true, 'G5')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Run end-to-end investor onboarding test',
     'Execute full test flow. Verify compliance blocking for unqualified investors.', 'review', 'cto', 0),
    (v_stage_id, 'Gate sign-off: Value Creation Complete',
     'CEO approves readiness to launch offering based on test results.', 'approval', 'ceo', 1);

-- ── Phase 6: Distribution (Fractional) ──────────────────────

-- 6.F1: Capital Raise & Subscription Processing
INSERT INTO template_stages (template_id, phase, sort_order, name, description)
VALUES (v_frac_id, 'distribution', 0, 'Capital Raise & Subscription Processing',
  'Investor outreach, subscription agreement execution, investment receipt.')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Investor outreach and subscription processing',
     'Execute investor outreach strategy. Process subscription agreements. Receive investment wires.', 'communication', 'cro', 0),
    (v_stage_id, 'Receive and process investor payments',
     'Track incoming wires. Match to subscription agreements. Update cap table.', 'payment_incoming', 'cro', 1);

-- 6.F2: Unit Issuance
INSERT INTO template_stages (template_id, phase, sort_order, name, description)
VALUES (v_frac_id, 'distribution', 1, 'Unit Issuance',
  'Issue fractional units via transfer agent, distribute confirmations.')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Issue fractional units via transfer agent',
     'Instruct transfer agent to issue units per subscription amounts. Upload unit certificates/confirmations.', 'automated', 'cto', 0),
    (v_stage_id, 'Distribute investor confirmations',
     'Send unit certificates and welcome packages to all investors.', 'communication', 'cro', 1);

-- 6.F3: Ongoing Reporting & Exit (GATE G6)
INSERT INTO template_stages (template_id, phase, sort_order, name, description, is_gate, gate_id)
VALUES (v_frac_id, 'distribution', 2, 'Ongoing Reporting & Exit',
  'SEC reporting (Form 1-K, 1-SA, C-AR), secondary market trading, eventual exit/liquidation. Gate: Distribution Complete.', true, 'G6')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Ongoing SEC reporting',
     'File required reports: Form 1-K (annual, Reg A+), Form 1-SA (semi-annual), Form C-AR (annual, Reg CF).', 'filing', 'ceo', 0),
    (v_stage_id, 'Secondary market trading management',
     'List on ATS. Manage transfers via transfer agent. Ensure compliance with transfer restrictions.', 'automated', 'cto', 1),
    (v_stage_id, 'Exit/liquidation event planning',
     'Plan and execute exit: asset sale, distribution waterfall, SPV dissolution, final K-1s.', 'review', 'ceo', 2);


-- ============================================================
-- 4. DEBT INSTRUMENT TEMPLATE (Phases 4-6)
-- ============================================================
INSERT INTO workflow_templates (name, description, value_model, is_system, is_default)
VALUES (
  'Debt Instrument Pipeline (Security + Value Creation + Distribution)',
  'Asset-backed lending workflow — UCC Article 9, loan origination, servicing, collateral management.',
  'debt_instrument', true, true
) RETURNING id INTO v_debt_id;

-- ── Phase 4: Security (Debt) ────────────────────────────────

-- 4.D1: Business-Purpose Determination
INSERT INTO template_stages (template_id, phase, sort_order, name, description)
VALUES (v_debt_id, 'security', 0, 'Business-Purpose vs Consumer-Purpose Determination',
  'Analyze loan purpose to determine regulatory framework. Business-purpose exempts from TILA/RESPA.')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Loan purpose analysis',
     'Analyze borrower stated use of proceeds. Determine business-purpose vs consumer-purpose classification.', 'review', 'ceo', 0),
    (v_stage_id, 'Upload determination memo',
     'Document classification with regulatory basis. If consumer-purpose: flag TILA/RESPA requirements.', 'document_upload', 'ceo', 1);

-- 4.D2: UCC-1 Drafting & Pre-Filing Search
INSERT INTO template_stages (template_id, phase, sort_order, name, description)
VALUES (v_debt_id, 'security', 1, 'UCC-1 Drafting & Pre-Filing Search',
  'Run UCC search to identify existing liens. Draft UCC-1 financing statement for collateral perfection.')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Run UCC lien search',
     'Search Secretary of State UCC filings for existing liens on proposed collateral. Upload search results.', 'due_diligence', 'ceo', 0),
    (v_stage_id, 'Draft UCC-1 financing statement',
     'Draft UCC-1 describing collateral precisely. Legal review before filing.', 'document_upload', 'ceo', 1);

-- 4.D3: Loan Document Preparation
INSERT INTO template_stages (template_id, phase, sort_order, name, description)
VALUES (v_debt_id, 'security', 2, 'Loan Document Preparation',
  'Draft promissory note, security agreement, and pledge agreement with usury analysis.')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Draft promissory note with usury analysis',
     'Structure note terms (rate, maturity, amortization). Conduct usury analysis per borrower jurisdiction.', 'review', 'ceo', 0),
    (v_stage_id, 'Draft security agreement and pledge agreement',
     'Create security agreement granting security interest in collateral. Draft pledge agreement.', 'document_upload', 'ceo', 1),
    (v_stage_id, 'Legal review of all loan documents',
     'External counsel reviews note, security agreement, pledge agreement. Address all comments.', 'approval', 'ceo', 2);

-- 4.D4: Tripartite Custody Control Agreement
INSERT INTO template_stages (template_id, phase, sort_order, name, description)
VALUES (v_debt_id, 'security', 3, 'Tripartite Custody Control Agreement',
  'Negotiate and execute three-party agreement between lender, borrower, and vault for collateral control.')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Negotiate tripartite custody control agreement',
     'Negotiate terms between PleoChrome (lender), borrower, and vault provider. Define release conditions.', 'meeting', 'ceo', 0),
    (v_stage_id, 'Execute custody control agreement',
     'All three parties sign. Upload executed CCA. Vault acknowledges lender security interest.', 'document_upload', 'ceo', 1);

-- 4.D5: External Counsel Review (GATE G4)
INSERT INTO template_stages (template_id, phase, sort_order, name, description, is_gate, gate_id)
VALUES (v_debt_id, 'security', 4, 'External Counsel Review',
  'External counsel reviews all loan documents. Compliance sign-off. Gate: Security Complete (Debt).', true, 'G4')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'External counsel review of all documents',
     'Counsel reviews complete loan document package: note, security agreement, UCC-1, CCA, pledge.', 'review', 'ceo', 0),
    (v_stage_id, 'Compliance sign-off — Security gate',
     'CEO/Compliance final approval. All documents ready for closing.', 'approval', 'ceo', 1);

-- ── Phase 5: Value Creation (Debt) ──────────────────────────

-- 5.D1: Pre-Closing Verification
INSERT INTO template_stages (template_id, phase, sort_order, name, description)
VALUES (v_debt_id, 'value_creation', 0, 'Pre-Closing Verification',
  'Verify all documents complete, recheck title/liens, prepare closing checklist.')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Pre-closing document verification',
     'Verify all loan documents are complete, properly executed, and consistent. Run closing checklist.', 'review', 'ceo', 0),
    (v_stage_id, 'Title/lien recheck',
     'Re-run UCC search to confirm no new liens filed since initial search. Upload updated results.', 'due_diligence', 'ceo', 1);

-- 5.D2: UCC-1 Filing & Loan Closing
INSERT INTO template_stages (template_id, phase, sort_order, name, description)
VALUES (v_debt_id, 'value_creation', 1, 'UCC-1 Filing & Loan Closing',
  'File UCC-1 with Secretary of State, conduct closing meeting, execute all documents.')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'File UCC-1 with Secretary of State',
     'Submit UCC-1 financing statement. Upload filing receipt with file number and date.', 'filing', 'ceo', 0),
    (v_stage_id, 'Conduct loan closing',
     'Closing meeting with borrower. Execute all documents. Upload closing binder.', 'meeting', 'ceo', 1),
    (v_stage_id, 'Compliance final sign-off on closing',
     'Compliance reviews executed package. Approve for disbursement.', 'approval', 'ceo', 2);

-- 5.D3: Fund Disbursement
INSERT INTO template_stages (template_id, phase, sort_order, name, description)
VALUES (v_debt_id, 'value_creation', 2, 'Fund Disbursement',
  'Wire loan proceeds to borrower with internal approval and confirmation.')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Internal wire approval',
     'CEO approves wire disbursement. Dual authorization required.', 'approval', 'ceo', 0),
    (v_stage_id, 'Wire loan proceeds to borrower',
     'Initiate wire transfer. Upload wire confirmation and receipt.', 'payment_outgoing', 'cro', 1);

-- 5.D4: Post-Closing & Participation Notes (GATE G5)
INSERT INTO template_stages (template_id, phase, sort_order, name, description, is_gate, gate_id)
VALUES (v_debt_id, 'value_creation', 3, 'Post-Closing & Participation Notes',
  'Assemble closing binder. Structure loan participation notes if syndicating (Reg D 506(c)). Gate: Value Creation Complete.', true, 'G5')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Assemble post-closing binder',
     'Compile all executed documents, filing receipts, wire confirmations into permanent loan file.', 'document_upload', 'ceo', 0),
    (v_stage_id, 'Structure loan participation notes (if syndicating)',
     'If syndicating: structure note program, file Reg D 506(c), prepare Note PPM.', 'review', 'ceo', 1);

-- ── Phase 6: Distribution (Debt) ────────────────────────────

-- 6.D1: Lender/Investor Matching
INSERT INTO template_stages (template_id, phase, sort_order, name, description)
VALUES (v_debt_id, 'distribution', 0, 'Lender/Investor Matching & Note Sale',
  'Market participation notes to lender network. Conduct lender presentations. Receive note purchases.')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Market participation notes to lender network',
     'Distribute note offering materials to qualified lenders/investors. Track interest.', 'communication', 'cro', 0),
    (v_stage_id, 'Conduct lender presentations',
     'Present loan details, collateral, terms to prospective note participants.', 'meeting', 'cro', 1),
    (v_stage_id, 'Process note purchases',
     'Execute participation agreements. Receive investment wires.', 'payment_incoming', 'cro', 2);

-- 6.D2: Loan Servicing
INSERT INTO template_stages (template_id, phase, sort_order, name, description)
VALUES (v_debt_id, 'distribution', 1, 'Monthly/Quarterly Loan Servicing',
  'Process borrower payments, monitor delinquency, maintain payment records.')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Process borrower payments',
     'Receive and process monthly/quarterly loan payments. Track against amortization schedule.', 'payment_incoming', 'cro', 0),
    (v_stage_id, 'Delinquency monitoring',
     'Monitor payment status. Flag late payments. Initiate collection procedures per loan agreement.', 'review', 'ceo', 1);

-- 6.D3: Collateral Verification & Reappraisal
INSERT INTO template_stages (template_id, phase, sort_order, name, description)
VALUES (v_debt_id, 'distribution', 2, 'Quarterly Collateral Verification & Annual Reappraisal',
  'Quarterly vault verification, PoR check, sanctions re-screen. Annual reappraisal and LTV recalculation.')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Quarterly collateral verification',
     'Verify vault custody, PoR check, sanctions re-screen on borrower. Document results.', 'due_diligence', 'ceo', 0),
    (v_stage_id, 'Annual reappraisal and LTV recalculation',
     'Conduct annual reappraisal. Recalculate LTV. Issue margin call if LTV breaches covenant.', 'physical_action', 'cro', 1);

-- 6.D4: Loan Maturity & Tax Reporting (GATE G6)
INSERT INTO template_stages (template_id, phase, sort_order, name, description, is_gate, gate_id)
VALUES (v_debt_id, 'distribution', 3, 'Loan Maturity / Payoff & Tax Reporting',
  'Process payoff, file UCC-3 termination, release collateral. File tax forms (1098, 1099-INT, K-1). Gate: Distribution Complete.', true, 'G6')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Process loan payoff',
     'Receive payoff amount. File UCC-3 termination statement. Release collateral from vault.', 'payment_incoming', 'cro', 0),
    (v_stage_id, 'File UCC-3 termination',
     'Submit UCC-3 termination statement with Secretary of State. Upload filing receipt.', 'filing', 'ceo', 1),
    (v_stage_id, 'Annual tax reporting',
     'File Form 1098, 1099-INT, K-1 (if participation notes) as applicable.', 'filing', 'ceo', 2);


-- ============================================================
-- 5. BROKER SALE TEMPLATE (Phases 4-6)
-- ============================================================
INSERT INTO workflow_templates (name, description, value_model, is_system, is_default)
VALUES (
  'Broker Sale Pipeline (Security + Value Creation + Distribution)',
  'Traditional brokered sale workflow — broker engagement, listing, marketing, negotiation, closing, settlement.',
  'broker_sale', true, true
) RETURNING id INTO v_broker_id;

-- ── Phase 4: Security (Broker Sale) ─────────────────────────

-- 4.B1: Broker/Dealer Selection
INSERT INTO template_stages (template_id, phase, sort_order, name, description)
VALUES (v_broker_id, 'security', 0, 'Broker/Dealer Selection',
  'Evaluate and engage appropriate broker: auction houses, dealers, RE brokers, or mineral brokers.')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Evaluate broker candidates',
     'Research and evaluate auction houses, specialty dealers, RE brokers, mineral brokers per asset class.', 'meeting', 'cro', 0),
    (v_stage_id, 'Engage selected broker',
     'Execute engagement agreement with selected broker. Define scope, commission, exclusivity terms.', 'document_upload', 'cro', 1);

-- 4.B2: Listing/Consignment Agreement
INSERT INTO template_stages (template_id, phase, sort_order, name, description)
VALUES (v_broker_id, 'security', 1, 'Listing/Consignment Agreement',
  'Draft, review, and execute listing or consignment agreement. Define commission structure.')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Draft listing/consignment agreement',
     'Draft agreement defining listing terms, commission rate, marketing obligations, duration, exclusivity.', 'document_upload', 'ceo', 0),
    (v_stage_id, 'Legal review of listing agreement',
     'Legal counsel reviews terms. Verify commission structure is market-rate.', 'approval', 'ceo', 1);

-- 4.B3: Reserve Price & Marketing Strategy
INSERT INTO template_stages (template_id, phase, sort_order, name, description)
VALUES (v_broker_id, 'security', 2, 'Reserve Price & Marketing Strategy',
  'Set reserve/minimum price, develop marketing strategy, CEO sign-off.')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Set reserve price and pricing strategy',
     'Analyze market comps, appraisal values, and timing. Set reserve/minimum acceptable price.', 'review', 'ceo', 0),
    (v_stage_id, 'Develop marketing plan',
     'Create marketing strategy: channels, materials, timeline, target buyer profiles.', 'review', 'cro', 1);

-- 4.B4: Seller Disclosure Preparation (GATE G4)
INSERT INTO template_stages (template_id, phase, sort_order, name, description, is_gate, gate_id)
VALUES (v_broker_id, 'security', 3, 'Seller Disclosure Preparation',
  'Prepare required disclosures, condition reports, inspection reports. Gate: Security Complete (Broker).', true, 'G4')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Prepare seller disclosures',
     'Prepare all required disclosures per asset class: condition reports, known defects, encumbrances.', 'document_upload', 'ceo', 0),
    (v_stage_id, 'Security gate sign-off',
     'CEO reviews all listing and disclosure documents. Approve to proceed with marketing.', 'approval', 'ceo', 1);

-- ── Phase 5: Value Creation (Broker Sale) ───────────────────

-- 5.B1: Marketing Campaign Launch
INSERT INTO template_stages (template_id, phase, sort_order, name, description)
VALUES (v_broker_id, 'value_creation', 0, 'Marketing Campaign Launch',
  'List asset on appropriate markets, distribute to buyer network, launch marketing materials.')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'List asset on market platforms',
     'List on appropriate platforms: auction houses, MLS, mineral exchanges, dealer networks.', 'communication', 'cro', 0),
    (v_stage_id, 'Distribute marketing materials',
     'Send materials to broker buyer network. Launch digital and targeted campaigns.', 'communication', 'cro', 1);

-- 5.B2: Buyer Inquiry Management
INSERT INTO template_stages (template_id, phase, sort_order, name, description)
VALUES (v_broker_id, 'value_creation', 1, 'Buyer Inquiry Management',
  'Qualify buyers, conduct presentations, track interest levels.')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Qualify buyer inquiries',
     'Screen buyer inquiries for financial capacity and seriousness. NDA qualified buyers.', 'review', 'cro', 0),
    (v_stage_id, 'Conduct buyer presentations',
     'Schedule and conduct presentations with qualified buyers. Share data room access.', 'meeting', 'cro', 1);

-- 5.B3: Offer Negotiation & Purchase Agreement (GATE G5)
INSERT INTO template_stages (template_id, phase, sort_order, name, description, is_gate, gate_id)
VALUES (v_broker_id, 'value_creation', 2, 'Offer Negotiation & Purchase Agreement',
  'Evaluate offers, negotiate terms, execute purchase agreement, collect earnest money. Gate: Value Creation Complete.', true, 'G5')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Evaluate and negotiate offers',
     'Receive offers. Evaluate against reserve price. Negotiate counter-offers.', 'review', 'ceo', 0),
    (v_stage_id, 'Execute purchase agreement',
     'Draft purchase agreement. Legal review. Execute with buyer. Upload executed agreement.', 'document_upload', 'ceo', 1),
    (v_stage_id, 'Collect earnest money deposit',
     'Receive earnest money per purchase agreement terms. Upload deposit confirmation.', 'payment_incoming', 'cro', 2);

-- ── Phase 6: Distribution (Broker Sale) ─────────────────────

-- 6.B1: Closing & Title Transfer
INSERT INTO template_stages (template_id, phase, sort_order, name, description)
VALUES (v_broker_id, 'distribution', 0, 'Closing & Title Transfer',
  'Conduct closing, transfer title, deliver asset physically or via custodian.')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Conduct closing meeting',
     'Execute all closing documents. Transfer title/ownership. Bill of sale.', 'meeting', 'ceo', 0),
    (v_stage_id, 'Physical asset delivery',
     'Arrange insured transport to buyer or buyer designated custodian. Obtain delivery confirmation.', 'physical_action', 'cro', 1);

-- 6.B2: Payment Collection & Settlement
INSERT INTO template_stages (template_id, phase, sort_order, name, description)
VALUES (v_broker_id, 'distribution', 1, 'Payment Collection & Settlement',
  'Collect sale proceeds, pay broker commission, release escrow.')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Collect sale proceeds',
     'Receive buyer wire for full purchase price. Upload wire confirmation.', 'payment_incoming', 'cro', 0),
    (v_stage_id, 'Pay broker commission',
     'Calculate and wire broker commission per listing agreement. Upload confirmation.', 'payment_outgoing', 'cro', 1),
    (v_stage_id, 'Release escrow',
     'Release escrow funds per agreement terms. Document final settlement.', 'payment_outgoing', 'cro', 2);

-- 6.B3: Post-Sale Documentation (GATE G6)
INSERT INTO template_stages (template_id, phase, sort_order, name, description, is_gate, gate_id)
VALUES (v_broker_id, 'distribution', 2, 'Post-Sale Documentation',
  'Archive closing docs, transfer insurance, file tax reporting. Gate: Distribution Complete (Broker).', true, 'G6')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Archive closing documents',
     'Upload all closing documents: bill of sale, transfer docs, settlement statement, wire confirmations.', 'document_upload', 'cro', 0),
    (v_stage_id, 'Transfer/cancel insurance',
     'Transfer insurance to buyer or cancel policy. Obtain confirmation.', 'communication', 'cro', 1),
    (v_stage_id, 'File tax reporting (Form 8949 / Schedule D)',
     'Report capital gain/loss on Form 8949. File Schedule D. Upload tax documentation.', 'filing', 'ceo', 2);


-- ============================================================
-- 6. BARTER / EXCHANGE TEMPLATE (Phases 4-6)
-- ============================================================
INSERT INTO workflow_templates (name, description, value_model, is_system, is_default)
VALUES (
  'Barter / Exchange Pipeline (Security + Value Creation + Distribution)',
  'Asset-for-asset exchange workflow — 1031 eligibility, QI engagement, counterparty DD, simultaneous transfer.',
  'barter', true, true
) RETURNING id INTO v_barter_id;

-- ── Phase 4: Security (Barter) ──────────────────────────────

-- 4.X1: 1031 Exchange Eligibility
INSERT INTO template_stages (template_id, phase, sort_order, name, description)
VALUES (v_barter_id, 'security', 0, '1031 Exchange Eligibility Determination',
  'Analyze IRC 1031 eligibility — real property only post-TCJA 2017. Obtain tax counsel opinion.')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'IRC 1031 eligibility analysis',
     'Analyze whether assets qualify for 1031 exchange (real property only post-TCJA 2017). Document findings.', 'review', 'ceo', 0),
    (v_stage_id, 'Obtain tax counsel opinion',
     'Engage tax counsel for formal opinion on 1031 eligibility. Upload opinion letter.', 'document_upload', 'ceo', 1);

-- 4.X2: Qualified Intermediary Engagement (if 1031)
INSERT INTO template_stages (template_id, phase, sort_order, name, description)
VALUES (v_barter_id, 'security', 1, 'Qualified Intermediary Engagement (if 1031)',
  'Engage QI for 1031 exchange compliance. Execute QI agreement and deposit.')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Engage qualified intermediary',
     'Select and engage QI. Execute QI agreement defining escrow, timeline, and reporting obligations.', 'document_upload', 'ceo', 0),
    (v_stage_id, 'QI deposit',
     'Wire QI engagement deposit per agreement terms.', 'payment_outgoing', 'cro', 1);

-- 4.X3: Counterparty Due Diligence
INSERT INTO template_stages (template_id, phase, sort_order, name, description)
VALUES (v_barter_id, 'security', 2, 'Counterparty Due Diligence',
  'KYC on counterparty, appraise counterparty asset, verify counterparty ownership.')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Counterparty KYC/KYB screening',
     'Run full KYC/KYB on exchange counterparty. OFAC/SDN/PEP screening. Upload results.', 'due_diligence', 'ceo', 0),
    (v_stage_id, 'Appraise counterparty asset',
     'Engage independent appraiser for counterparty asset. Verify value claim.', 'physical_action', 'cro', 1),
    (v_stage_id, 'Verify counterparty ownership',
     'Confirm counterparty has clear title to their asset. Check for liens/encumbrances.', 'due_diligence', 'ceo', 2);

-- 4.X4: Exchange Agreement Drafting (GATE G4)
INSERT INTO template_stages (template_id, phase, sort_order, name, description, is_gate, gate_id)
VALUES (v_barter_id, 'security', 3, 'Exchange Agreement Drafting',
  'Draft exchange agreement with legal and tax counsel review. Gate: Security Complete (Barter).', true, 'G4')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Draft exchange agreement',
     'Draft comprehensive exchange agreement: asset descriptions, valuations, conditions, timelines, representations.', 'document_upload', 'ceo', 0),
    (v_stage_id, 'Legal and tax counsel review',
     'Both legal and tax counsel review exchange agreement. Address all comments.', 'approval', 'ceo', 1);

-- ── Phase 5: Value Creation (Barter) ────────────────────────

-- 5.X1: Counterparty Asset Appraisal
INSERT INTO template_stages (template_id, phase, sort_order, name, description)
VALUES (v_barter_id, 'value_creation', 0, 'Counterparty Asset Appraisal',
  'Independent appraisal of the asset being received in exchange.')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Independent appraisal of received asset',
     'Engage independent appraiser. Obtain USPAP-compliant appraisal of counterparty asset.', 'physical_action', 'cro', 0),
    (v_stage_id, 'Upload appraisal report',
     'Upload completed appraisal report. Compare to counterparty claimed value.', 'document_upload', 'cro', 1);

-- 5.X2: Exchange Value Equalization
INSERT INTO template_stages (template_id, phase, sort_order, name, description)
VALUES (v_barter_id, 'value_creation', 1, 'Exchange Value Equalization',
  'Calculate value differential, determine cash boot if needed, both parties approve terms.')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Calculate value differential and cash boot',
     'Compare appraised values. Calculate any cash boot needed to equalize exchange. Document methodology.', 'review', 'ceo', 0),
    (v_stage_id, 'Both parties approve exchange terms',
     'Present final terms to both parties. Obtain written approval of values and boot amount.', 'approval', 'ceo', 1);

-- 5.X3: Exchange Agreement Execution
INSERT INTO template_stages (template_id, phase, sort_order, name, description)
VALUES (v_barter_id, 'value_creation', 2, 'Exchange Agreement Execution',
  'Execute exchange agreement with legal sign-off.')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Execute exchange agreement',
     'Both parties sign exchange agreement. Upload fully executed document.', 'document_upload', 'ceo', 0),
    (v_stage_id, 'Legal sign-off on execution',
     'Legal counsel confirms proper execution and binding effect.', 'approval', 'ceo', 1);

-- 5.X4: 1031 Timeline Compliance (GATE G5)
INSERT INTO template_stages (template_id, phase, sort_order, name, description, is_gate, gate_id)
VALUES (v_barter_id, 'value_creation', 3, '1031 Timeline Compliance (if applicable)',
  'Monitor 45-day ID deadline and 180-day completion deadline for 1031 exchange. Gate: Value Creation Complete.', true, 'G5')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, '45-day identification deadline compliance',
     'Ensure replacement property identified within 45 days per IRC 1031. Document compliance.', 'review', 'ceo', 0),
    (v_stage_id, '180-day completion deadline compliance',
     'Ensure exchange completed within 180 days per IRC 1031. Upload QI documentation.', 'review', 'ceo', 1);

-- ── Phase 6: Distribution (Barter) ──────────────────────────

-- 6.X1: Simultaneous Asset Transfer
INSERT INTO template_stages (template_id, phase, sort_order, name, description)
VALUES (v_barter_id, 'distribution', 0, 'Simultaneous Asset Transfer',
  'Coordinate simultaneous delivery of both assets. Upload transfer documentation for both directions.')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Deliver our asset to counterparty',
     'Arrange insured transport of our asset to counterparty or their designated custodian.', 'physical_action', 'cro', 0),
    (v_stage_id, 'Receive counterparty asset',
     'Receive counterparty asset via insured transport. Verify condition matches agreement.', 'physical_action', 'cro', 1),
    (v_stage_id, 'Upload bilateral transfer documentation',
     'Document both transfers: shipping manifests, delivery confirmations, condition reports.', 'document_upload', 'cro', 2);

-- 6.X2: Cash Boot Settlement (if applicable)
INSERT INTO template_stages (template_id, phase, sort_order, name, description)
VALUES (v_barter_id, 'distribution', 1, 'Cash Boot Settlement (if applicable)',
  'Wire equalizing payment if value differential exists. Upload confirmation.')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Process cash boot payment',
     'Wire or receive equalizing payment per exchange agreement. Upload wire confirmation.', 'payment_outgoing', 'cro', 0);

-- 6.X3: Post-Exchange Custody & Insurance
INSERT INTO template_stages (template_id, phase, sort_order, name, description)
VALUES (v_barter_id, 'distribution', 2, 'Post-Exchange Custody & Insurance',
  'Vault the received asset, obtain new vault receipt, update insurance.')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'Vault received asset',
     'Transfer received asset to institutional vault. Obtain segregated storage receipt.', 'physical_action', 'cro', 0),
    (v_stage_id, 'Update insurance for received asset',
     'Place or update insurance coverage for newly received asset. Upload new certificate.', 'document_upload', 'cro', 1);

-- 6.X4: Tax Reporting (GATE G6)
INSERT INTO template_stages (template_id, phase, sort_order, name, description, is_gate, gate_id)
VALUES (v_barter_id, 'distribution', 3, 'Tax Reporting',
  'File Form 8824 (1031) or Form 8949 (non-1031). Upload tax documentation. Gate: Distribution Complete.', true, 'G6')
RETURNING id INTO v_stage_id;

  INSERT INTO template_tasks (template_stage_id, title, description, task_type, default_assignee_role, sort_order)
  VALUES
    (v_stage_id, 'File Form 8824 (1031 exchange) or Form 8949 (non-1031)',
     'Prepare and file appropriate tax form based on 1031 eligibility determination.', 'filing', 'ceo', 0),
    (v_stage_id, 'Upload complete tax documentation',
     'Archive all tax documentation: filings, basis calculations, boot reconciliation, QI statements.', 'document_upload', 'ceo', 1);


-- ============================================================
-- SUMMARY LOG
-- ============================================================
RAISE NOTICE '✅ Seeded 6 workflow templates:';
RAISE NOTICE '   1. Shared Pipeline (Lead + Intake + Maturity) — % stages', (SELECT count(*) FROM template_stages WHERE template_id = v_shared_id);
RAISE NOTICE '   2. Tokenization — % stages', (SELECT count(*) FROM template_stages WHERE template_id = v_token_id);
RAISE NOTICE '   3. Fractional Securities — % stages', (SELECT count(*) FROM template_stages WHERE template_id = v_frac_id);
RAISE NOTICE '   4. Debt Instrument — % stages', (SELECT count(*) FROM template_stages WHERE template_id = v_debt_id);
RAISE NOTICE '   5. Broker Sale — % stages', (SELECT count(*) FROM template_stages WHERE template_id = v_broker_id);
RAISE NOTICE '   6. Barter / Exchange — % stages', (SELECT count(*) FROM template_stages WHERE template_id = v_barter_id);

END $$;
