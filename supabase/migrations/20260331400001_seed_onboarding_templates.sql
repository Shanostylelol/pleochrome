-- Seed partner onboarding templates per partner type

-- APPRAISER
DO $$ DECLARE v_tid UUID;
BEGIN
  INSERT INTO partner_onboarding_templates (name, partner_type, is_default, is_system, description)
  VALUES ('Appraiser Onboarding', 'appraiser', true, true, 'Standard onboarding for gemological appraisers and valuation partners')
  RETURNING id INTO v_tid;

  INSERT INTO partner_onboarding_template_items (template_id, stage, item_name, item_type, description, sort_order) VALUES
    (v_tid, 'discovery', 'Initial discovery call', 'communication', 'Introductory call to assess capabilities and fit', 0),
    (v_tid, 'discovery', 'Capability assessment', 'verification', 'Review appraiser specializations and experience', 1),
    (v_tid, 'discovery', 'Fee schedule received', 'document', 'Collect pricing and cost structure', 2),
    (v_tid, 'due_diligence', 'Credentials verification (GIA/AGA)', 'verification', 'Verify gemological certifications and accreditations', 3),
    (v_tid, 'due_diligence', 'Insurance certificate', 'document', 'Professional liability / E&O insurance verification', 4),
    (v_tid, 'due_diligence', 'Sample appraisal review', 'verification', 'Review sample reports for methodology and thoroughness', 5),
    (v_tid, 'due_diligence', 'Reference check', 'verification', 'Contact 2+ previous clients for reference', 6),
    (v_tid, 'contracting', 'NDA executed', 'document', 'Mutual non-disclosure agreement', 7),
    (v_tid, 'contracting', 'Engagement letter signed', 'document', 'Formal engagement terms and scope', 8),
    (v_tid, 'contracting', 'Fee schedule approved', 'compliance', 'Internal approval of pricing', 9),
    (v_tid, 'approval', 'Compliance officer sign-off', 'compliance', 'Final approval to engage partner', 10);
END $$;

-- VAULT CUSTODIAN
DO $$ DECLARE v_tid UUID;
BEGIN
  INSERT INTO partner_onboarding_templates (name, partner_type, is_default, is_system, description)
  VALUES ('Custody Partner Onboarding', 'vault_custodian', true, true, 'Standard onboarding for vault and custody providers')
  RETURNING id INTO v_tid;

  INSERT INTO partner_onboarding_template_items (template_id, stage, item_name, item_type, description, sort_order) VALUES
    (v_tid, 'discovery', 'Initial discovery call', 'communication', 'Introductory call to assess facilities and capabilities', 0),
    (v_tid, 'discovery', 'Fee schedule received', 'document', 'Storage, transit, and insurance pricing', 1),
    (v_tid, 'due_diligence', 'Facility security audit', 'verification', 'Physical security assessment of vault facility', 2),
    (v_tid, 'due_diligence', 'Insurance limits review', 'document', 'Coverage limits and policy review', 3),
    (v_tid, 'due_diligence', 'Chain of custody SOP', 'document', 'Standard operating procedures for asset handling', 4),
    (v_tid, 'due_diligence', 'PoR capability assessment', 'verification', 'Proof of Reserve integration capability', 5),
    (v_tid, 'due_diligence', 'Transit insurance verification', 'document', 'Insurance during asset transport', 6),
    (v_tid, 'contracting', 'NDA executed', 'document', 'Mutual non-disclosure agreement', 7),
    (v_tid, 'contracting', 'Master services agreement', 'document', 'Full custody agreement with terms', 8),
    (v_tid, 'approval', 'Compliance officer sign-off', 'compliance', 'Final approval to engage partner', 9);
END $$;

-- SECURITIES COUNSEL / LEGAL
DO $$ DECLARE v_tid UUID;
BEGIN
  INSERT INTO partner_onboarding_templates (name, partner_type, is_default, is_system, description)
  VALUES ('Legal Partner Onboarding', 'securities_counsel', true, true, 'Standard onboarding for legal counsel and law firms')
  RETURNING id INTO v_tid;

  INSERT INTO partner_onboarding_template_items (template_id, stage, item_name, item_type, description, sort_order) VALUES
    (v_tid, 'discovery', 'Initial discovery call', 'communication', 'Introductory call to assess expertise and availability', 0),
    (v_tid, 'discovery', 'Fee schedule received', 'document', 'Hourly rates, retainer structure, engagement model', 1),
    (v_tid, 'due_diligence', 'Bar admission verification', 'verification', 'Verify active bar membership in relevant jurisdictions', 2),
    (v_tid, 'due_diligence', 'Malpractice insurance', 'document', 'Professional liability insurance verification', 3),
    (v_tid, 'due_diligence', 'Conflict of interest check', 'verification', 'Ensure no conflicts with existing clients', 4),
    (v_tid, 'due_diligence', 'Specialization proof', 'document', 'Evidence of securities/blockchain law expertise', 5),
    (v_tid, 'contracting', 'NDA executed', 'document', 'Mutual non-disclosure agreement', 6),
    (v_tid, 'contracting', 'Engagement letter signed', 'document', 'Formal engagement with scope and terms', 7),
    (v_tid, 'approval', 'Compliance officer sign-off', 'compliance', 'Final approval to engage partner', 8);
END $$;

-- TOKENIZATION PLATFORM
DO $$ DECLARE v_tid UUID;
BEGIN
  INSERT INTO partner_onboarding_templates (name, partner_type, is_default, is_system, description)
  VALUES ('Tokenization Platform Onboarding', 'tokenization_platform', true, true, 'Standard onboarding for tokenization technology partners')
  RETURNING id INTO v_tid;

  INSERT INTO partner_onboarding_template_items (template_id, stage, item_name, item_type, description, sort_order) VALUES
    (v_tid, 'discovery', 'Initial discovery call', 'communication', 'Platform demo and capability assessment', 0),
    (v_tid, 'discovery', 'Fee structure received', 'document', 'Platform fees, token deployment costs, ongoing fees', 1),
    (v_tid, 'due_diligence', 'Smart contract audit history', 'verification', 'Review third-party audit reports', 2),
    (v_tid, 'due_diligence', 'Token standard compliance', 'verification', 'ERC-3643 or ERC-7518 compliance verification', 3),
    (v_tid, 'due_diligence', 'Compliance track record', 'verification', 'Review regulatory history and compliance capabilities', 4),
    (v_tid, 'integration', 'Integration specification', 'document', 'API documentation and integration requirements', 5),
    (v_tid, 'integration', 'Test deployment completed', 'verification', 'Successful test token deployment on testnet', 6),
    (v_tid, 'contracting', 'NDA executed', 'document', 'Mutual non-disclosure agreement', 7),
    (v_tid, 'contracting', 'Master services agreement', 'document', 'Full platform agreement with SLAs', 8),
    (v_tid, 'approval', 'Compliance officer sign-off', 'compliance', 'Final approval to engage partner', 9);
END $$;

-- TRANSFER AGENT / ATS
DO $$ DECLARE v_tid UUID;
BEGIN
  INSERT INTO partner_onboarding_templates (name, partner_type, is_default, is_system, description)
  VALUES ('Transfer Agent / ATS Onboarding', 'transfer_agent', true, true, 'Standard onboarding for transfer agents and alternative trading systems')
  RETURNING id INTO v_tid;

  INSERT INTO partner_onboarding_template_items (template_id, stage, item_name, item_type, description, sort_order) VALUES
    (v_tid, 'discovery', 'Initial discovery call', 'communication', 'Platform demo and distribution capabilities', 0),
    (v_tid, 'discovery', 'Fee schedule received', 'document', 'Platform fees, per-transaction costs, minimums', 1),
    (v_tid, 'due_diligence', 'SEC registration verification', 'verification', 'Form TA or ATS registration confirmation', 2),
    (v_tid, 'due_diligence', 'FINRA membership check', 'verification', 'Active FINRA membership and CRD lookup', 3),
    (v_tid, 'due_diligence', 'AML program review', 'compliance', 'Anti-money laundering compliance program assessment', 4),
    (v_tid, 'due_diligence', 'Settlement mechanics review', 'verification', 'DVP, T+2, custody integration capabilities', 5),
    (v_tid, 'contracting', 'NDA executed', 'document', 'Mutual non-disclosure agreement', 6),
    (v_tid, 'contracting', 'Platform agreement signed', 'document', 'Full agreement with distribution terms', 7),
    (v_tid, 'approval', 'Compliance officer sign-off', 'compliance', 'Final approval to engage partner', 8);
END $$;

-- OWNER ONBOARDING: INDIVIDUAL
DO $$ DECLARE v_tid UUID;
BEGIN
  INSERT INTO owner_onboarding_templates (name, contact_type, is_default, description)
  VALUES ('Individual Owner Onboarding', 'individual', true, 'Standard KYC/AML onboarding for individual asset holders')
  RETURNING id INTO v_tid;

  INSERT INTO owner_onboarding_template_items (template_id, stage, item_name, item_type, description, sort_order) VALUES
    (v_tid, 'identity', 'Government-issued ID collected', 'document', 'Passport, drivers license, or national ID', 0),
    (v_tid, 'identity', 'Identity verification completed', 'verification', 'ID verification check via KYC provider', 1),
    (v_tid, 'screening', 'KYC screening completed', 'verification', 'Full Know Your Customer screening', 2),
    (v_tid, 'screening', 'OFAC/SDN check completed', 'compliance', 'Office of Foreign Assets Control sanctions screening', 3),
    (v_tid, 'screening', 'PEP screening completed', 'compliance', 'Politically Exposed Person check', 4),
    (v_tid, 'screening', 'Adverse media screening', 'compliance', 'Search for negative news or legal proceedings', 5),
    (v_tid, 'accreditation', 'Accreditation verification', 'verification', 'Verify accredited investor status (if applicable)', 6),
    (v_tid, 'documents', 'Required documents uploaded', 'document', 'All mandatory documents collected and filed', 7),
    (v_tid, 'approval', 'Compliance officer sign-off', 'compliance', 'Final approval of owner onboarding', 8);
END $$;

-- OWNER ONBOARDING: ENTITY
DO $$ DECLARE v_tid UUID;
BEGIN
  INSERT INTO owner_onboarding_templates (name, contact_type, is_default, description)
  VALUES ('Entity Owner Onboarding', 'entity', true, 'Standard KYB/AML onboarding for entity asset holders')
  RETURNING id INTO v_tid;

  INSERT INTO owner_onboarding_template_items (template_id, stage, item_name, item_type, description, sort_order) VALUES
    (v_tid, 'identity', 'Formation documents collected', 'document', 'Articles of incorporation, operating agreement, etc.', 0),
    (v_tid, 'identity', 'EIN verification', 'verification', 'Employer Identification Number verification', 1),
    (v_tid, 'identity', 'KYB screening completed', 'verification', 'Know Your Business full entity screening', 2),
    (v_tid, 'screening', 'Beneficial ownership disclosure', 'document', 'Identify all 25%+ owners and control persons', 3),
    (v_tid, 'screening', 'OFAC/SDN check (entity + owners)', 'compliance', 'Sanctions screening for entity and beneficial owners', 4),
    (v_tid, 'screening', 'PEP screening (control persons)', 'compliance', 'PEP check on all control persons', 5),
    (v_tid, 'documents', 'Certificate of Good Standing', 'document', 'Current good standing from state of formation', 6),
    (v_tid, 'documents', 'Required documents uploaded', 'document', 'All mandatory entity documents collected', 7),
    (v_tid, 'approval', 'Compliance officer sign-off', 'compliance', 'Final approval of entity onboarding', 8);
END $$;
