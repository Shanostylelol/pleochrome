# EXHAUSTIVE WORKFLOW AUDIT: FRACTIONAL SECURITIES & DEBT INSTRUMENTS

**Date:** March 27, 2026
**Auditor:** Claude Opus 4.6 (automated, validated against web research)
**Scope:** Path-specific Phases 3-4 for Fractional Securities and Debt Instruments
**Source Documents:**
- `FRACTIONAL-SECURITIES-VALUE-CREATION-PATH.md` (14-step workflow)
- `STRATEGY-6-DEBT-INSTRUMENTS-AND-ASSET-BACKED-LENDING.md` (Sub-Paths A/B/C)
- `src/lib/portal-data.ts` (FRACTIONAL_PHASES, DEBT_PHASES, SHARED_PHASES)
**Validation Sources:** SEC.gov, FINRA.org, Cornell Law UCC Art. 9, OCC Comptroller's Handbook, Masterworks filings, Percent platform, Borro/Diamond Banc/Qollateral operations

---

## AUDIT METHODOLOGY

For each step in Phases 3-4 of both workflows, this audit produces:
1. **Documents required** -- exact document names
2. **Tasks to complete** -- granular checkbox items
3. **Data fields to capture** -- for the master JSON record
4. **Sources/links** -- external systems to reference
5. **Audit log entries** -- what gets logged
6. **Compliance checkpoints** -- what regulators/investors want to see
7. **AI automation opportunities**
8. **MISSING STEPS** -- gaps identified by comparison to Masterworks, Percent, Borro/Diamond Banc

---

# PART 1: FRACTIONAL SECURITIES -- PHASE 3 (Securities Structuring) & PHASE 4 (Distribution & Management)

---

## PHASE 3: SECURITIES STRUCTURING

### Step 3.1: Transfer Agent Engagement

**portal-data.ts reference:** `{ num: "3.1", title: "Transfer Agent Engagement", ... cost: "$5K-$20K", timeline: "2-4 weeks" }`
**Strategy doc reference:** FRACTIONAL-SECURITIES Step 6

#### 1. Documents Required
- [ ] Transfer Agent Engagement Letter (signed by SPV manager + TA)
- [ ] Transfer Agent Agreement (full contract -- recordkeeping, transfer processing, fees, confidentiality, indemnification, portability clause)
- [ ] Transfer Agent SEC Registration Verification (Section 17A of Securities Exchange Act of 1934)
- [ ] Transfer Agent Insurance Certificate (E&O coverage)
- [ ] DRS (Direct Registration System) Configuration Specification
- [ ] Lost Certificate / Lost Token Recovery Procedures Document
- [ ] Distribution Processing Workflow Document
- [ ] Transfer Agent Fee Schedule (signed)
- [ ] Data Security / SOC 2 Report from TA (or equivalent)
- [ ] Integration Specification (if digital TA + tokenization platform reconciliation needed)

#### 2. Tasks to Complete
- [ ] Research and shortlist 3+ SEC-registered transfer agents (Vertalo, Rialto Transfer Services, Colonial Stock Transfer, Pacific Stock Transfer, Securitize, Texture)
- [ ] Verify SEC registration status of each candidate via SEC EDGAR TA search
- [ ] Request proposals from shortlisted TAs
- [ ] Evaluate TA compatibility with chosen unit structure (percentage interest vs membership units vs hybrid)
- [ ] Evaluate TA compatibility with chosen regulatory pathway (Reg D, Reg A+, Reg CF)
- [ ] Evaluate TA blockchain/token support (if hybrid model: ERC-3643 on Polygon)
- [ ] Negotiate fee schedule (setup, annual maintenance, per-transfer, per-distribution, annual statements)
- [ ] Review transfer agent agreement with securities counsel
- [ ] Confirm TA compliance with Rule 17Ad-6 (recordkeeping) and Rule 17Ad-7 (retention)
- [ ] Confirm TA has records portability clause (what happens if TA goes out of business)
- [ ] Initialize shareholder registry in TA system
- [ ] Configure DRS or digital registry
- [ ] Test integration with tokenization platform (if applicable)
- [ ] Document distribution processing workflow
- [ ] Document lost certificate/token recovery procedures
- [ ] Execute Transfer Agent Agreement
- [ ] Confirm TA SOC 2 Type II compliance or equivalent security certification

#### 3. Data Fields to Capture (Master JSON)
```json
{
  "transferAgent": {
    "name": "",
    "secRegistrationNumber": "",
    "address": "",
    "primaryContact": { "name": "", "email": "", "phone": "" },
    "agreementDate": "",
    "agreementExpirationDate": "",
    "setupFee": 0,
    "annualFee": 0,
    "perTransferFee": 0,
    "perDistributionFee": 0,
    "annualStatementFee": 0,
    "supportsBlockchain": false,
    "supportedTokenStandards": [],
    "recordsPortabilityClause": true,
    "soc2Certified": false,
    "insuranceCoverageAmount": 0,
    "drsConfigured": false,
    "integrationStatus": "pending | configured | tested | live"
  }
}
```

#### 4. Sources/Links
- SEC Transfer Agent Search: https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&type=TA&dateb=&owner=include&count=40
- Rule 17Ad-6: https://www.law.cornell.edu/cfr/text/17/240.17Ad-6
- Rule 17Ad-7: https://www.law.cornell.edu/cfr/text/17/240.17Ad-7
- Vertalo: https://www.vertalo.com
- Rialto Transfer Services: https://www.rialtomarkets.com
- Colonial Stock Transfer: https://www.colonialstock.com

#### 5. Audit Log Entries
- `TA_SHORTLIST_CREATED` -- date, candidates, evaluation criteria
- `TA_SELECTED` -- date, provider, rationale, fee terms
- `TA_AGREEMENT_EXECUTED` -- date, parties, key terms
- `TA_REGISTRY_INITIALIZED` -- date, SPV name, unit structure configured
- `TA_INTEGRATION_TESTED` -- date, platform, test results
- `TA_LIVE` -- date, confirmation of operational status

#### 6. Compliance Checkpoints
- [ ] TA is SEC-registered under Section 17A (MANDATORY for Reg A+; strongly recommended for Reg D)
- [ ] TA agreement addresses all SEC required areas: record maintenance, transfer processing, lost certificates, dividends/distributions, corporate actions, confidentiality, indemnification
- [ ] TA can enforce transfer restrictions required by the offering (holding periods for Reg D/Reg CF)
- [ ] TA can process all required SEC filings (Form 253G2 supplements for Reg A+)
- [ ] TA maintains backup/disaster recovery for registry data
- [ ] TA is not on any SEC enforcement list

#### 7. AI Automation Opportunities
- **Automated TA vendor scoring**: AI scores TA proposals against a weighted matrix (cost, capabilities, blockchain support, regulatory pathway fit)
- **Registry reconciliation bot**: Automated daily reconciliation between on-chain token registry and off-chain TA records (if hybrid model)
- **Distribution processing automation**: AI calculates and validates pro-rata distributions before sending to TA for processing
- **Anomaly detection**: Flag unusual transfer requests or patterns

---

### Step 3.2: BD / Placement Agent Engagement

**portal-data.ts reference:** `{ num: "3.2", title: "BD / Placement Agent Engagement", ... cost: "$10K-$25K setup", timeline: "2-6 weeks" }`
**Strategy doc reference:** FRACTIONAL-SECURITIES Step 7

#### 1. Documents Required
- [ ] Broker-Dealer Engagement Letter (signed)
- [ ] BD Due Diligence Completion Letter
- [ ] BD Fee Schedule (setup, success fee %, FINRA filing reimbursement)
- [ ] FINRA Form 5123 (Private Placement of Securities) -- filed within 15 calendar days of first sale
- [ ] BD Compliance Manual excerpt (relevant sections for this offering)
- [ ] Marketing Material Compliance Review Approval(s) from BD
- [ ] BD AML/KYC Procedures Coordination Memo
- [ ] BD FINRA registration confirmation (CRD verification)
- [ ] BD insurance certificate (E&O)
- [ ] BD due diligence questionnaire (completed by PleoChrome for BD's review)
- [ ] Selling Agreement (if BD is acting as placement agent, not just BD of record)

#### 2. Tasks to Complete
- [ ] Identify BD model: BD-of-Record (compliance-only) vs Full-Service Placement Agent vs Funding Portal (Reg CF)
- [ ] Shortlist candidates: Dalmore Group, Rialto Markets, North Capital, StartEngine, Republic, DealMaker, Securitize, tZERO
- [ ] Verify FINRA registration via FINRA BrokerCheck (CRD number)
- [ ] Request BD proposals and fee schedules
- [ ] Evaluate BD experience with alternative/exotic assets (gemstones, collectibles)
- [ ] Evaluate BD distribution capabilities (investor network size, marketing support)
- [ ] Share PPM/Offering Circular drafts for BD due diligence review
- [ ] Respond to BD due diligence questions
- [ ] Negotiate engagement letter terms (fee %, exclusivity, territory, termination rights)
- [ ] Review engagement letter with securities counsel
- [ ] Execute BD engagement letter
- [ ] Coordinate AML/KYC procedures between PleoChrome and BD
- [ ] Submit all marketing materials to BD compliance for review/approval
- [ ] Prepare for FINRA Form 5123 filing (due within 15 calendar days of first sale)
- [ ] Confirm BD will file Form 5123 with FINRA Corporate Financing Department
- [ ] Establish investor suitability/accreditation verification procedures in coordination with BD
- [ ] Calculate total investor cost (PleoChrome fees + BD fees) and confirm under NASAA 10-12% guideline
- [ ] If Reg CF: engage SEC-registered funding portal (Wefunder, Republic, StartEngine, DealMaker)

#### 3. Data Fields to Capture
```json
{
  "brokerDealer": {
    "firmName": "",
    "crdNumber": "",
    "finraRegistered": true,
    "engagementModel": "bd-of-record | placement-agent | funding-portal",
    "primaryContact": { "name": "", "email": "", "phone": "" },
    "engagementLetterDate": "",
    "setupFee": 0,
    "successFeeRate": 0,
    "finraFilingFee": 0,
    "dueDiligenceComplete": false,
    "dueDiligenceCompletionDate": "",
    "form5123Filed": false,
    "form5123FilingDate": "",
    "marketingMaterialsApproved": [],
    "totalInvestorCostPct": 0,
    "exclusiveAgreement": false,
    "terminationNoticeDays": 0
  }
}
```

#### 4. Sources/Links
- FINRA BrokerCheck: https://brokercheck.finra.org
- FINRA Rule 5123: https://www.finra.org/rules-guidance/rulebooks/finra-rules/5123
- FINRA Private Placement Filing System: https://www.finra.org/filing-reporting/private-placements
- FINRA Form 5123 FAQ: https://www.finra.org/rules-guidance/guidance/faqs/finra-rules-5122-5123
- Dalmore Group: https://dalmorefg.com
- Rialto Markets: https://www.rialtomarkets.com

#### 5. Audit Log Entries
- `BD_SHORTLIST_CREATED` -- date, candidates, model type
- `BD_SELECTED` -- date, firm, CRD #, engagement model, fee terms
- `BD_DUE_DILIGENCE_STARTED` -- date, documents provided
- `BD_DUE_DILIGENCE_COMPLETE` -- date, completion letter received
- `BD_ENGAGEMENT_EXECUTED` -- date, parties, key terms
- `BD_MARKETING_APPROVAL` -- date, material name, approval status
- `BD_FORM_5123_FILED` -- date, FINRA confirmation
- `BD_FEE_PAID` -- date, amount, milestone

#### 6. Compliance Checkpoints
- [ ] BD is current FINRA member in good standing (CRD verified)
- [ ] BD has no relevant disciplinary history (FINRA BrokerCheck reviewed)
- [ ] BD engagement letter reviewed by securities counsel
- [ ] All marketing materials approved by BD compliance before distribution
- [ ] FINRA Form 5123 filed within 15 calendar days of first sale (CRITICAL deadline)
- [ ] Total fees to investors (PleoChrome + BD + all others) do not exceed NASAA 10-12% guideline
- [ ] BD has documented procedures for investor suitability review
- [ ] Section 15 Exchange Act compliance: any person receiving transaction-based compensation for selling securities is properly registered
- [ ] If Reg CF: all transactions MUST go through the registered funding portal or BD -- PleoChrome cannot accept subscriptions directly

#### 7. AI Automation Opportunities
- **BD proposal comparison matrix**: Auto-generate comparison of BD proposals with weighted scoring
- **Fee impact calculator**: Model total investor cost under different BD fee scenarios
- **FINRA filing deadline tracker**: Automated alert system for Form 5123 15-day deadline
- **Marketing compliance pre-screen**: AI reviews marketing materials against common FINRA communications rules violations before BD submission

---

### Step 3.3: Unit Structure Configuration

**portal-data.ts reference:** `{ num: "3.3", title: "Unit Structure Configuration", ... timeline: "1-2 weeks" }`
**Strategy doc reference:** FRACTIONAL-SECURITIES Step 4

#### 1. Documents Required
- [ ] SPV Operating Agreement (executed, with complete class definitions)
- [ ] Unit Pricing Memo (justification for par value, total units, pricing methodology)
- [ ] Cap Table Initialization Report
- [ ] Tax Classification Election Documentation (Form 8832 if electing, or partnership default memo)
- [ ] Distribution Waterfall Schedule (detailed with examples)
- [ ] Anti-Dilution Provision Summary
- [ ] Drag-Along / Tag-Along Rights Summary (if applicable)
- [ ] Information Rights Summary
- [ ] Exit Provisions Summary
- [ ] Token-to-Unit Mapping Specification (if hybrid/tokenized)
- [ ] Class A / Class B / Preferred Terms Sheet

#### 2. Tasks to Complete
- [ ] Select unit structure model: Percentage Interest (simple) vs Membership Units (recommended) vs Hybrid (units + ERC-3643 tokens)
- [ ] Determine total authorized units based on offering size and target minimum investment
- [ ] Set par value per unit
- [ ] Set minimum investment amount (# of units)
- [ ] Define Class A (investor) rights: economic rights, limited voting, no management authority
- [ ] Define Class B (manager -- PleoChrome) rights: sole management authority, carried interest percentage, annual management share, voting control
- [ ] Define Preferred shares (if applicable): liquidation preference for setup/acquisition costs
- [ ] Draft distribution waterfall with numerical examples
- [ ] Define transfer restrictions aligned with regulatory pathway (Reg D: restricted 6-12 months; Reg A+: freely tradeable; Reg CF: 1-year hold)
- [ ] Define redemption rights (if any)
- [ ] Define information rights (quarterly updates, annual reports, access to data room)
- [ ] Draft anti-dilution protections
- [ ] Obtain tax counsel opinion on partnership allocation modeling
- [ ] Verify tax classification: partnership (default for multi-member LLC) vs election on Form 8832
- [ ] Initialize cap table in selected platform
- [ ] If tokenized: deploy ERC-3643 smart contract with 1:1 unit-to-token mapping on testnet
- [ ] Reconcile legal cap table structure with on-chain parameters (if hybrid)
- [ ] Securities counsel review and sign-off on complete unit structure

#### 3. Data Fields to Capture
```json
{
  "unitStructure": {
    "model": "percentage | membership-units | hybrid",
    "totalAuthorizedUnits": 0,
    "parValuePerUnit": 0,
    "minimumInvestmentUnits": 0,
    "minimumInvestmentDollar": 0,
    "classes": [
      {
        "name": "Class A",
        "holder": "investors",
        "economicRights": "pro-rata",
        "votingRights": "limited | none",
        "managementAuthority": false,
        "transferRestrictions": "",
        "holdingPeriod": ""
      },
      {
        "name": "Class B",
        "holder": "PleoChrome Holdings LLC",
        "carriedInterestPct": 0,
        "annualManagementSharePct": 0,
        "votingControl": true
      }
    ],
    "preferredShares": {
      "exists": false,
      "liquidationPreference": 0,
      "holder": ""
    },
    "distributionWaterfall": [],
    "antiDilution": true,
    "dragAlongTagAlong": false,
    "redemptionRights": false,
    "taxClassification": "partnership | s-corp | c-corp",
    "tokenized": false,
    "tokenContractAddress": "",
    "tokenStandard": "ERC-3643"
  }
}
```

#### 4. Sources/Links
- Wyoming LLC Act: https://law.justia.com/codes/wyoming/title-17/chapter-29/
- IRS Form 8832: https://www.irs.gov/forms-pubs/about-form-8832
- Masterworks SEC filings (example structure): https://www.sec.gov/cgi-bin/browse-edgar?company=masterworks&CIK=&type=1-A&dateb=&owner=include&count=40&search_text=&action=getcompany

#### 5. Audit Log Entries
- `UNIT_STRUCTURE_SELECTED` -- date, model, rationale
- `UNIT_PRICING_SET` -- date, total units, par value, minimum investment
- `CLASS_DEFINITIONS_FINALIZED` -- date, class details
- `WATERFALL_APPROVED` -- date, waterfall terms
- `TAX_OPINION_RECEIVED` -- date, classification, counsel name
- `CAP_TABLE_INITIALIZED` -- date, platform, units configured
- `TOKEN_DEPLOYED_TESTNET` -- date, contract address, chain (if hybrid)
- `COUNSEL_SIGNOFF_UNIT_STRUCTURE` -- date, counsel name, approval memo

#### 6. Compliance Checkpoints
- [ ] Unit structure complies with Securities Act requirements for the chosen exemption
- [ ] Transfer restrictions match regulatory pathway (Reg D restricted, Reg A+ freely tradeable, Reg CF 1-year hold)
- [ ] If Reg A+ and following Masterworks model: Class A (investor), Class B (manager), Preferred classes are properly defined
- [ ] Operating agreement has been reviewed by securities counsel AND tax counsel
- [ ] Tax classification is appropriate (partnership for pass-through; avoid accidental C-corp classification)
- [ ] Distribution waterfall clearly documented and examples included in PPM
- [ ] If tokenized: on-chain compliance rules match legal transfer restrictions exactly
- [ ] Manager rights (Class B) are not so concentrated as to deter sophisticated investors
- [ ] All covered persons under Rule 506(d) / Reg A Rule 262 have cleared bad actor checks

#### 7. AI Automation Opportunities
- **Unit pricing optimizer**: AI models different unit counts, par values, and minimum investments against target investor demographics
- **Waterfall calculator**: Automated distribution waterfall calculation engine with investor-facing dashboard
- **Cap table reconciliation**: Real-time reconciliation between legal cap table, TA records, and on-chain state
- **Investor impact modeling**: AI shows each investor their returns under different exit scenarios

---

### Step 3.4: Regulatory Exemption Selection

**portal-data.ts reference:** `{ num: "3.4", title: "Regulatory Exemption Selection", ... timeline: "1 week" }`
**Strategy doc reference:** FRACTIONAL-SECURITIES Step 2

#### 1. Documents Required
- [ ] Regulatory Pathway Selection Memo (signed by CEO and counsel)
- [ ] Budget Estimate for Chosen Pathway
- [ ] Timeline Estimate for Chosen Pathway
- [ ] Preliminary Offering Structure Summary (units, price, minimum)
- [ ] Legal Opinion on Reg A+ Eligibility (if Reg A+ chosen -- must address "mineral rights" exclusion)
- [ ] Blank Check Company Analysis Memo (Reg A+ -- confirm PleoChrome is NOT a blank check company)
- [ ] Weighted Decision Matrix (scored and documented)

#### 2. Tasks to Complete
- [ ] Confirm asset eligibility under each exemption
- [ ] For Reg A+: obtain counsel opinion that gemstone SPV interests are NOT "fractional undivided interests in mineral rights" (CRITICAL -- Reg A explicitly excludes these)
- [ ] For Reg A+: confirm issuer is not a "blank check company" (PleoChrome has identified business purpose)
- [ ] For Reg A+: confirm issuer organized in US or Canada
- [ ] For Reg CF: confirm issuer organized in US and is not Exchange Act reporting company
- [ ] Run weighted decision matrix against all criteria (offering size, target investors, speed, budget, community goals, reporting tolerance)
- [ ] Model all-in cost for each pathway
- [ ] Model time-to-first-sale for each pathway
- [ ] Model break-even offering size for each pathway
- [ ] Present analysis to CEO for decision
- [ ] Document decision rationale
- [ ] Brief all team members on selected pathway and implications

#### 3. Data Fields to Capture
```json
{
  "regulatoryPathway": {
    "selected": "reg-d-506c | reg-a-plus-tier2 | reg-cf",
    "decisionDate": "",
    "decisionMemo": "",
    "counselName": "",
    "mineralRightsOpinion": "",
    "estimatedCost": { "low": 0, "mid": 0, "high": 0 },
    "estimatedTimeline": "",
    "breakEvenOfferingSize": 0,
    "maxRaise": 0,
    "investorEligibility": "accredited-only | all-investors",
    "holdingPeriodRestriction": "",
    "secReviewRequired": false,
    "ongoingReportingBurden": "low | medium | high",
    "generalSolicitationPermitted": true
  }
}
```

#### 4. Sources/Links
- SEC Regulation A guidance: https://www.sec.gov/resources-small-businesses/small-business-compliance-guides/regulation-guidance-issuers
- SEC Regulation D: https://www.sec.gov/resources-small-businesses/exempt-offerings
- SEC Regulation CF: https://www.sec.gov/education/smallbusiness/exemptofferings/regcrowdfunding
- NASAA Guidelines: https://www.nasaa.org

#### 5. Audit Log Entries
- `PATHWAY_ANALYSIS_STARTED` -- date, pathways evaluated
- `MINERAL_RIGHTS_OPINION_REQUESTED` -- date, counsel (Reg A+ only)
- `MINERAL_RIGHTS_OPINION_RECEIVED` -- date, outcome (eligible/ineligible)
- `PATHWAY_SELECTED` -- date, pathway, rationale, CEO signature
- `PATHWAY_MEMO_DISTRIBUTED` -- date, distribution list

#### 6. Compliance Checkpoints
- [ ] Written legal opinion on file confirming asset eligibility under chosen exemption
- [ ] If Reg A+: mineral rights exclusion analysis documented and signed by counsel
- [ ] All covered persons confirmed eligible (no bad actor disqualifications) under chosen exemption's rules
- [ ] Decision matrix and rationale preserved for investor and regulatory inquiry
- [ ] Budget allocated and approved by board/manager

#### 7. AI Automation Opportunities
- **Pathway recommender engine**: AI ingests asset characteristics, target investor profile, budget, and timeline to recommend optimal pathway with confidence scores
- **Cost/revenue modeler**: Dynamic financial model showing projected P&L for each pathway
- **Regulatory news monitor**: AI monitors SEC and FINRA for rule changes affecting chosen pathway

---

### Step 3.5: Form D / Form 1-A Preparation

**portal-data.ts reference:** `{ num: "3.5", title: "Form D / Form 1-A Preparation", ... timeline: "1-4 weeks" }`
**Strategy doc reference:** FRACTIONAL-SECURITIES Steps 5 and 8

#### 1. Documents Required

**For Reg D 506(c):**
- [ ] Private Placement Memorandum (PPM) -- 60-150 pages
- [ ] Subscription Agreement
- [ ] Operating Agreement / LP Agreement
- [ ] Investor Questionnaire
- [ ] Accredited Investor Certification Form
- [ ] Escrow Agreement (if applicable)
- [ ] Token Purchase Agreement (if tokenized)
- [ ] Smart Contract Audit Report (if tokenized)
- [ ] Form D (prepared for EDGAR filing within 15 days of first sale)
- [ ] Blue Sky State Notice Filing Forms (each state)

**For Reg A+ Tier 2:**
- [ ] Form 1-A Part I: Notification
- [ ] Form 1-A Part II: Offering Circular (cover page, risk factors, dilution analysis, plan of distribution, use of proceeds, management, financial statements)
- [ ] Form 1-A Part III: Exhibits (Articles of Organization, Operating Agreement, Subscription Agreement, Transfer Agent Agreement, Escrow Agreement, Legal Opinions, Consent of Auditor)
- [ ] 2 Years of AUDITED Financial Statements (PCAOB standard for Tier 2)
- [ ] Tax Opinion Letter
- [ ] Testing the Waters Materials (if used pre-qualification)
- [ ] "Testing the Waters" Legend for pre-qualification marketing

**For Reg CF:**
- [ ] Form C Offering Statement
- [ ] Business Plan Description
- [ ] Financial Statements (audited if >$618K; reviewed if $124K-$618K; self-certified if <$124K)
- [ ] Use of Proceeds
- [ ] Risk Factors
- [ ] Officers/Directors Disclosure
- [ ] Material Terms of Securities

**All Pathways:**
- [ ] EDGAR Account Credentials (Login.gov account with MFA, Form ID submitted, CIK received)
- [ ] FINRA Form 5123 materials (for BD filing)
- [ ] Legal Opinion Letters
- [ ] Bad Actor Questionnaires (all covered persons)

#### 2. Tasks to Complete
- [ ] Engage securities attorney for primary document drafting
- [ ] Engage tax attorney for tax sections
- [ ] If Reg A+: engage PCAOB-registered auditor for 2-year audited financials
- [ ] Draft primary disclosure document
- [ ] Include comprehensive risk factors (the #1 source of securities fraud liability)
- [ ] Include all required disclosures: management bios, conflicts of interest, use of proceeds, dilution analysis, compensation table
- [ ] Review all factual claims against underlying documentation (GIA reports, appraisals, vault receipts)
- [ ] Attorney review cycles (1-3 rounds per pathway)
- [ ] BD compliance review of all documents (if BD engaged)
- [ ] Create Login.gov account with MFA
- [ ] Submit Form ID for EDGAR access (notarized authentication required)
- [ ] Receive CIK number from SEC
- [ ] Prepare Form D / Form 1-A / Form C for electronic filing
- [ ] If Reg A+: file Form 1-A on EDGAR; prepare for SEC comment letters (1-3 rounds, 10 business days per response)
- [ ] If Reg A+: respond to each comment letter thoroughly (do NOT rush -- quality > speed)
- [ ] If Reg A+: file amendments as needed
- [ ] If Reg A+: wait for SEC qualification order
- [ ] Prepare blue sky state notice filings for all target states
- [ ] File FINRA Form 5123 within 15 calendar days of first sale (via BD)

#### 3. Data Fields to Capture
```json
{
  "secFiling": {
    "pathway": "",
    "primaryDocument": "PPM | offering-circular | form-c",
    "draftVersion": 0,
    "attorneyReviewCycles": 0,
    "bdReviewComplete": false,
    "edgarCik": "",
    "edgarLoginCreated": false,
    "formIdSubmitted": false,
    "formType": "D | 1-A | C",
    "filingDate": "",
    "filingConfirmation": "",
    "secQualificationDate": "",
    "commentLettersReceived": 0,
    "commentLettersResolved": 0,
    "blueSkysStatesFile": [],
    "finraForm5123Filed": false,
    "finraForm5123Date": "",
    "auditedFinancials": false,
    "auditorName": "",
    "auditorPcaobRegistered": false,
    "testingTheWatersUsed": false,
    "riskFactorsCount": 0,
    "totalLegalCost": 0
  }
}
```

#### 4. Sources/Links
- EDGAR filing: https://www.sec.gov/submit-filings
- EDGAR Next (Login.gov): https://www.sec.gov/edgar/filer-information/how-do-i/edgar-next-faq
- Form D: https://www.sec.gov/forms/formd
- Form 1-A: https://www.sec.gov/files/form1a.pdf
- Form C: https://www.sec.gov/forms/formc
- Blue Sky Filing Service: https://www.colonialfilings.com
- FINRA Form 5123: https://www.finra.org/rules-guidance/rulebooks/finra-rules/5123
- SEC Comment Letter Process: https://viewpoint.pwc.com/dt/us/en/pwc/sec_comment_letters/comment_letter_trends_DM/The_comment_letter_process.html

#### 5. Audit Log Entries
- `PPM_DRAFTING_STARTED` -- date, counsel name
- `PPM_DRAFT_VERSION` -- date, version number, changes summary
- `PPM_ATTORNEY_REVIEW` -- date, cycle number, findings count
- `PPM_BD_REVIEW` -- date, approval/rejection, changes requested
- `EDGAR_ACCOUNT_CREATED` -- date, CIK number
- `SEC_FILING_SUBMITTED` -- date, form type, EDGAR confirmation
- `SEC_COMMENT_LETTER_RECEIVED` -- date, comment count
- `SEC_COMMENT_RESPONSE_FILED` -- date, response version
- `SEC_QUALIFICATION_RECEIVED` -- date (Reg A+ only)
- `BLUE_SKY_FILED` -- date, state, confirmation
- `FINRA_5123_FILED` -- date, confirmation

#### 6. Compliance Checkpoints
- [ ] PPM/Offering Circular risk factors are comprehensive and cover ALL material risks (gemstone market, appraisal, custody, liquidity, regulatory, key person, blockchain if applicable)
- [ ] No inconsistency between marketing materials and offering documents
- [ ] Bad actor disclosures for ALL covered persons (officers, directors, 20%+ equity holders, promoters, compensated solicitors)
- [ ] All financial statements current (not stale)
- [ ] If Reg A+: audited financials prepared by PCAOB-registered firm, 2-year coverage
- [ ] Form D filed within 15 days of first sale (violation does not invalidate exemption but triggers SEC/state enforcement risk)
- [ ] Blue sky filings completed in all states where securities are offered/sold
- [ ] FINRA Form 5123 filed within 15 calendar days of first sale
- [ ] SEC qualification obtained before ANY sales (Reg A+ ONLY -- cannot sell until qualified)
- [ ] No forward-looking statements without reasonable basis and prominent disclaimers
- [ ] No claims of SEC approval or endorsement anywhere in materials
- [ ] E-SIGN Act compliance for electronic subscription agreements

#### 7. AI Automation Opportunities
- **Risk factor generator**: AI generates comprehensive risk factors based on asset type, regulatory pathway, and operational structure
- **Comment letter response drafter**: AI drafts responses to SEC comment letters based on the specific comments and prior PleoChrome filings
- **Blue sky filing tracker**: Automated tracking of filing deadlines and confirmations across all 50+ jurisdictions
- **Document consistency checker**: AI compares marketing materials against PPM/Offering Circular for inconsistencies

---

## PHASE 4: DISTRIBUTION & MANAGEMENT

### Step 4.1: Investor Outreach

**portal-data.ts reference:** `{ num: "4.1", title: "Investor Outreach", ... cost: "$5K-$30K" }`
**Strategy doc reference:** FRACTIONAL-SECURITIES Step 10

#### 1. Documents Required
- [ ] Marketing Plan Document (channels, budget, timeline, KPIs)
- [ ] Pitch Deck (attorney-reviewed, BD-approved)
- [ ] One-Pager / Fact Sheet (attorney-reviewed, BD-approved)
- [ ] Website / Landing Page (compliance-reviewed)
- [ ] Ad Creative (all formats -- attorney/BD reviewed)
- [ ] Email Drip Sequences (compliance-reviewed)
- [ ] Webinar Presentation Slides
- [ ] Data Room Configuration (DocSend/Digify) with offering documents
- [ ] Event Calendar and Attendance Plan
- [ ] Attorney Compliance Review Letters for ALL materials
- [ ] BD Approval Documentation for ALL materials
- [ ] CRM Configuration Documentation
- [ ] "Testing the Waters" Materials with Legend (Reg A+ pre-qualification only)
- [ ] "Accredited Investors Only" Disclaimer Template (Reg D 506(c))

#### 2. Tasks to Complete
- [ ] Develop marketing plan with channel allocation and budget
- [ ] Create all marketing materials
- [ ] Submit ALL materials to securities counsel for compliance review
- [ ] Submit ALL materials to BD compliance for approval
- [ ] Ensure "accredited investors only" language on all Reg D materials
- [ ] Ensure risk disclosures on all materials (including social media posts)
- [ ] If Reg A+: include "testing the waters" legend if used before qualification
- [ ] If Reg CF: ensure all advertising directs investors to the registered funding portal
- [ ] Configure investor CRM
- [ ] Set up and test email drip sequences
- [ ] Configure data room with offering documents
- [ ] Plan webinar schedule (monthly recommended)
- [ ] Plan event attendance calendar
- [ ] Set up LinkedIn Sales Navigator for prospecting
- [ ] Set up Google Ads and LinkedIn Ads campaigns
- [ ] Activate PR/media relations
- [ ] Create social media content calendar with compliance disclaimers
- [ ] Track all marketing spend against budget

#### 3. Data Fields to Capture
```json
{
  "marketing": {
    "totalBudget": 0,
    "channelBudgets": {
      "linkedinAds": 0,
      "googleAds": 0,
      "email": 0,
      "events": 0,
      "pr": 0,
      "content": 0,
      "webinars": 0
    },
    "materialsCreated": [],
    "materialsApprovedByCounsel": [],
    "materialsApprovedByBD": [],
    "investorPipelineCount": 0,
    "websiteVisitors": 0,
    "dataRoomViews": 0,
    "webinarAttendees": 0,
    "costPerAcquisition": 0,
    "conversionRate": 0
  }
}
```

#### 4. Audit Log Entries
- `MARKETING_PLAN_APPROVED` -- date, budget, channels
- `MATERIAL_CREATED` -- date, material name, type
- `MATERIAL_COUNSEL_APPROVED` -- date, material name, counsel name
- `MATERIAL_BD_APPROVED` -- date, material name, BD name
- `CAMPAIGN_LAUNCHED` -- date, channel, budget
- `INVESTOR_LEAD_CREATED` -- date, source, investor type

#### 5. Compliance Checkpoints
- [ ] ALL marketing materials reviewed and approved by securities counsel (anti-fraud Rule 10b-5)
- [ ] ALL materials reviewed and approved by BD compliance (FINRA communications rules)
- [ ] No guaranteed or projected specific returns without reasonable basis + disclaimers
- [ ] No claims of SEC approval or endorsement
- [ ] Risk disclosures present on ALL materials including social media posts
- [ ] If Reg D 506(c): "accredited investors only" language on all materials
- [ ] If Reg A+ pre-qualification: "testing the waters" legend included
- [ ] If Reg CF: all advertising directs to registered funding portal; no direct subscription acceptance
- [ ] FINRA Rule 5123 compliance for BD marketing involvement
- [ ] No inconsistency between marketing claims and PPM/Offering Circular disclosures

---

### Step 4.2: Investor KYC & Accreditation

**portal-data.ts reference:** `{ num: "4.2", title: "Investor KYC & Accreditation", ... tags: ["dg", "lg", "ai"] }`
**Strategy doc reference:** FRACTIONAL-SECURITIES Step 9

#### 1. Documents Required
- [ ] KYC/AML Policy Document
- [ ] CIP (Customer Identification Program) Procedures
- [ ] CDD (Customer Due Diligence) Procedures
- [ ] EDD (Enhanced Due Diligence) Procedures (for high-risk investors)
- [ ] OFAC/SDN Screening Records (per investor)
- [ ] PEP Screening Records (per investor)
- [ ] Accredited Investor Verification Records (Reg D only):
  - Third-party verification letter (from BD, RIA, attorney, or CPA), OR
  - Tax returns + W-2s (income test), OR
  - Bank/brokerage statements (net worth test), OR
  - Self-certification (March 2025 SEC no-action letter: permitted if minimum investment >= $200K for natural persons or >= $1M for entities AND not third-party financed)
- [ ] Investment Limit Self-Certification (Reg A+ non-accredited / Reg CF)
- [ ] Investor Questionnaire (completed)
- [ ] Subscription Agreement (executed via E-SIGN compliant platform)
- [ ] Escrow Agreement / Instructions
- [ ] Wire/ACH Confirmation (anti-fraud: verify funds from named investor's account)
- [ ] SAR Filing (if warranted by AML screening)

#### 2. Tasks to Complete
- [ ] Configure KYC/AML platform (Plaid Identity, VerifyInvestor, InvestReady, Parallel Markets, Sumsub)
- [ ] Configure accreditation verification platform (VerifyInvestor, InvestReady) -- Reg D only
- [ ] Configure investment limit calculator (Reg CF)
- [ ] Set up E-signature subscription agreement workflow (DocuSign, HelloSign)
- [ ] Establish escrow account (if applicable)
- [ ] Set up payment processing (ACH/wire)
- [ ] Test entire investor onboarding flow end-to-end
- [ ] For each investor: run KYC/AML, OFAC, PEP screening
- [ ] For Reg D: verify accredited investor status using SEC-approved methods
- [ ] For Reg D with $200K+ minimum: self-certification is acceptable per March 2025 no-action letter
- [ ] For Reg A+: non-accredited investors self-certify investment limits (10% of income or net worth)
- [ ] For Reg CF: verify aggregate investment limits across all Reg CF offerings in 12-month period
- [ ] Process each subscription agreement execution
- [ ] Collect and verify funds (wire/ACH anti-fraud controls)
- [ ] File SARs if warranted
- [ ] Maintain complete compliance audit trail for every step

#### 3. Data Fields to Capture (per investor)
```json
{
  "investor": {
    "id": "",
    "fullName": "",
    "entityName": "",
    "investorType": "individual | entity | trust | ira",
    "kycStatus": "pending | passed | failed | flagged",
    "kycCompletionDate": "",
    "ofacScreeningResult": "clear | flagged",
    "pepScreeningResult": "clear | flagged",
    "accreditedStatus": "verified | self-certified | not-required | pending",
    "accreditationMethod": "third-party-letter | tax-returns | bank-statements | self-cert-200k | professional-cert",
    "accreditationVerificationDate": "",
    "investmentAmount": 0,
    "unitsSubscribed": 0,
    "subscriptionAgreementDate": "",
    "fundsReceivedDate": "",
    "fundingMethod": "wire | ach | check",
    "fundSourceVerified": true,
    "sarFiled": false,
    "investmentLimitCompliant": true,
    "onboardingComplete": false
  }
}
```

#### 4. Compliance Checkpoints
- [ ] Every investor has completed KYC/AML before funds accepted
- [ ] Every investor screened against OFAC/SDN list (current list, not stale)
- [ ] For Reg D 506(c): "reasonable steps to verify" accredited status for EVERY investor -- no exceptions
- [ ] Self-certification ONLY acceptable per March 2025 no-action letter conditions ($200K+ minimum, not third-party financed)
- [ ] For Reg CF: 48-hour cancellation right communicated to each investor
- [ ] For Reg CF: 5-business-day notice period if material changes to offering
- [ ] Subscription agreement compliant with E-SIGN Act
- [ ] Wire/ACH anti-fraud: funds verified as coming from named investor's account
- [ ] Complete audit trail maintained for every onboarding step

---

### Step 4.3: Subscription & Unit Issuance

**portal-data.ts reference:** `{ num: "4.3", title: "Subscription & Unit Issuance", ... tags: ["lg", "dg"] }`
**Strategy doc reference:** FRACTIONAL-SECURITIES Step 11

#### 1. Documents Required
- [ ] Executed Subscription Agreement (per investor)
- [ ] Wire/ACH Confirmation (per investor)
- [ ] Unit Issuance Confirmation (from Transfer Agent)
- [ ] Updated Cap Table
- [ ] Investor Welcome Package
- [ ] Escrow Release Authorization (if escrow used)
- [ ] Form D Filing Confirmation (Reg D -- within 15 days of first sale)
- [ ] Form 253G2 Filing (Reg A+ -- offering circular supplement per completed sale)
- [ ] K-1 Allocation Worksheet (initialized)
- [ ] Token Minting Confirmation (if hybrid/tokenized)

#### 2. Tasks to Complete
- [ ] Process each subscription: verify KYC complete, accreditation verified, subscription agreement signed, funds received
- [ ] Release funds from escrow (if escrow used and minimum threshold met)
- [ ] Instruct Transfer Agent to issue units to investor
- [ ] Update official cap table
- [ ] If tokenized: mint tokens to investor's whitelisted wallet (oracle verifies reserves before mint)
- [ ] Reconcile on-chain and off-chain cap tables (if hybrid)
- [ ] Send investor welcome package (reporting schedule, data room access, contact info)
- [ ] Initialize K-1 allocation worksheet for each investor
- [ ] File Form D on EDGAR (Reg D -- within 15 days of FIRST sale)
- [ ] File Form 253G2 on EDGAR (Reg A+ -- for each completed sale)
- [ ] Collect PleoChrome success fee from offering proceeds
- [ ] Update vault insurance to name all unit holders (or SPV as insured)

#### 3. Audit Log Entries
- `SUBSCRIPTION_RECEIVED` -- date, investor ID, amount
- `SUBSCRIPTION_VERIFIED` -- date, investor ID, all checks passed
- `ESCROW_RELEASED` -- date, amount, authorization
- `UNITS_ISSUED` -- date, investor ID, unit count, TA confirmation
- `TOKENS_MINTED` -- date, investor wallet, token count, tx hash (if hybrid)
- `CAP_TABLE_UPDATED` -- date, total units outstanding
- `FORM_D_FILED` -- date, EDGAR confirmation
- `FORM_253G2_FILED` -- date, EDGAR confirmation (Reg A+)
- `SUCCESS_FEE_COLLECTED` -- date, amount
- `WELCOME_PACKAGE_SENT` -- date, investor ID

#### 4. Compliance Checkpoints
- [ ] No units issued until ALL investor qualification steps complete (KYC, accreditation, subscription execution, funds received)
- [ ] Form D filed within 15 days of first sale (Reg D)
- [ ] Form 253G2 filed for each completed sale (Reg A+)
- [ ] Escrow conditions met before release
- [ ] Transfer agent records match PleoChrome internal records
- [ ] On-chain token count matches off-chain unit count (if hybrid)
- [ ] Insurance updated to cover all holders
- [ ] PleoChrome success fee properly calculated and documented

---

### Step 4.4: Cap Table Management

**portal-data.ts reference:** `{ num: "4.4", title: "Cap Table Management", ... tags: ["dg"] }`

#### 1. Documents Required
- [ ] Official Shareholder/Unitholder Registry (maintained by Transfer Agent)
- [ ] Monthly Cap Table Reconciliation Report
- [ ] Transfer Restriction Log
- [ ] Compliance Status Report (per investor -- accreditation current, KYC current, sanctions clear)

#### 2. Tasks to Complete
- [ ] Establish monthly cap table reconciliation process
- [ ] If hybrid: reconcile on-chain state with off-chain TA records monthly
- [ ] Track transfer restrictions per investor (holding period compliance)
- [ ] Monitor investor compliance status (accreditation, sanctions re-screening)
- [ ] Document any cap table changes with full audit trail

---

### Step 4.5: Quarterly Reporting

**portal-data.ts reference:** `{ num: "4.5", title: "Quarterly Reporting", ... tags: ["dg", "ai"] }`
**Strategy doc reference:** FRACTIONAL-SECURITIES Step 12

#### 1. Documents Required
- [ ] Quarterly NAV Update Report
- [ ] Quarterly Investor Communication (PDF/email)
- [ ] Quarterly Vault Verification Confirmation
- [ ] Quarterly Sanctions Re-Screening Results
- [ ] Market Conditions Summary

#### 2. Tasks to Complete
- [ ] Calculate current NAV based on most recent appraisal and market conditions
- [ ] Obtain vault verification confirmation from custodian
- [ ] Run sanctions re-screening on all investors
- [ ] Draft quarterly investor update
- [ ] Review update with counsel (for material disclosures)
- [ ] Distribute to all investors via email/portal
- [ ] Archive all reports

#### 3. AI Automation Opportunities
- **NAV calculator**: AI ingests market data, comparable sales, and appraisal data to generate quarterly NAV estimates
- **Automated investor report generator**: AI drafts quarterly reports from structured data inputs
- **Sanctions screening automation**: Automated batch screening with flag/alert system
- **Chainlink PoR verification**: Automated daily custody verification (if tokenized)

---

### Step 4.6: Annual Obligations

**portal-data.ts reference:** `{ num: "4.6", title: "Annual Obligations", ... tags: ["lg", "dg"] }`

#### 1. Documents Required
- [ ] Annual Independent Reappraisal Report
- [ ] NAV Recalculation Memo
- [ ] K-1 Schedule (per investor) -- due March 15
- [ ] Partnership Tax Return (Form 1065) -- due March 15 (ext: Sept 15)
- [ ] Form D Amendment (Reg D, if offering continues)
- [ ] Form 1-K Annual Report (Reg A+ -- within 120 days of FY end)
- [ ] Form 1-SA Semi-Annual Report (Reg A+ -- within 90 days of H1 end)
- [ ] Form 1-U Current Event Report (Reg A+ -- promptly after material events)
- [ ] Form C-AR Annual Report (Reg CF -- within 120 days of FY end)
- [ ] Audited Financial Statements (Reg A+ -- PCAOB standard)
- [ ] Blue Sky Renewal Filings (Reg D -- varies by state)
- [ ] Insurance Renewal Certificate
- [ ] Bad Actor Re-Check Results (all covered persons)
- [ ] AML Program Annual Review
- [ ] Chainlink PoR Attestation Update (if tokenized)
- [ ] Independent Compliance Audit Report

#### 2. Tasks to Complete (Annual Calendar)
- [ ] Q1: Prepare and deliver K-1s by March 15
- [ ] Q1: File Form 1065 by March 15 (or extension)
- [ ] Q1: Initiate annual reappraisal
- [ ] Q1: Conduct annual compliance review with securities counsel
- [ ] Q2: File Form 1-K annual report (Reg A+, by April 30 for 12/31 FY)
- [ ] Q2: File Form C-AR annual report (Reg CF, by April 30 for 12/31 FY)
- [ ] Q2: Insurance renewal
- [ ] Q3: File Form 1-SA semi-annual report (Reg A+, by September 28)
- [ ] Q3: Blue sky renewal filings (Reg D)
- [ ] Q3: Form D annual amendment (Reg D, if offering continues)
- [ ] Q4: Finalize annual reappraisal results, recalculate NAV
- [ ] Q4: Update Chainlink PoR attestation (if tokenized)
- [ ] Q4: Prepare for next K-1 season
- [ ] Q4: Bad actor re-check for all covered persons
- [ ] Q4: AML program annual review

---

### Step 4.7: Secondary Transfer Facilitation

**portal-data.ts reference:** `{ num: "4.7", title: "Secondary Transfer Facilitation", ... tags: ["dg", "lg"] }`
**Strategy doc reference:** FRACTIONAL-SECURITIES Step 13

#### 1. Documents Required
- [ ] ATS Listing Agreement (signed with registered ATS)
- [ ] ATS Technical Integration Specification
- [ ] Secondary Trading Rules and Procedures
- [ ] Investor Notification: Secondary Trading Available
- [ ] Compliance Procedures for Secondary Trades
- [ ] Transfer Agent Transfer Instructions Template
- [ ] KYC/AML Requirements for Secondary Market Participants

#### 2. Tasks to Complete
- [ ] Select registered ATS (tZERO, Securitize Markets, PPEX, Rialto Markets, StartEngine Secondary)
- [ ] Verify ATS registration with SEC (Regulation ATS, Rules 300-304)
- [ ] Negotiate listing agreement
- [ ] Complete technical integration (token/unit transfer bridge)
- [ ] Define and document compliance procedures for secondary trades
- [ ] Ensure KYC/AML for all secondary market participants
- [ ] For Reg D: enforce 6-12 month holding period under Rule 144 before allowing secondary trades
- [ ] For Reg A+: securities are freely tradeable -- no holding period restriction
- [ ] For Reg CF: enforce 1-year holding period (exceptions: transfers to issuer, accredited investors, family, estate)
- [ ] For tokenized: ensure on-chain transfer compliance (ERC-3643) aligns with off-chain legal requirements
- [ ] Notify all investors when secondary trading is available
- [ ] Monitor secondary trading volume and price discovery
- [ ] Update shareholder registry for every secondary transfer via Transfer Agent

#### 3. Compliance Checkpoints
- [ ] ALL secondary trading occurs on a registered ATS or national securities exchange (CRITICAL -- Rally enforcement action precedent)
- [ ] ATS complies with Regulation ATS (Rules 300-304)
- [ ] Transfer restrictions enforced (holding periods per regulatory pathway)
- [ ] KYC/AML completed for all secondary market participants
- [ ] Transfer Agent processes every transfer and updates registry
- [ ] On-chain compliance rules match off-chain requirements (if tokenized)
- [ ] No proprietary trading platform operated without ATS registration

---

### Step 4.8: Exit / Liquidation

**portal-data.ts reference:** `{ num: "4.8", title: "Exit / Liquidation", ... tags: ["lg", "rw", "dg"] }`
**Strategy doc reference:** FRACTIONAL-SECURITIES Step 14

#### 1. Documents Required
- [ ] Sale Agreement for Gemstones (auction or private sale)
- [ ] Independent Sale Valuation (arm's-length pricing confirmation)
- [ ] Final Distribution Waterfall Calculations
- [ ] Wire Transfer Confirmations to All Investors
- [ ] Final K-1 Packages (all investors)
- [ ] SPV Dissolution Documents (Articles of Dissolution -- Wyoming SOS)
- [ ] Form 1-Z (Reg A+ -- suspend reporting)
- [ ] Form D Amendment (Reg D -- final)
- [ ] Form C-AR Final (Reg CF)
- [ ] Final Form 1065 (partnership tax return)
- [ ] Token Burn/Retirement Confirmation (if tokenized)
- [ ] Transfer Agent Registry Close-Out
- [ ] Insurance Termination Confirmation
- [ ] Vault Release/Transport Documentation
- [ ] Final Investor Communication

#### 2. Tasks to Complete
- [ ] Source buyer(s): auction house (Christie's, Sotheby's, Heritage) or private sale
- [ ] Obtain independent valuation at time of sale
- [ ] Negotiate sale terms
- [ ] Execute sale
- [ ] Calculate final distribution waterfall:
  1. Pay all SPV debts/obligations
  2. Return of capital to investors
  3. Preferred return (if applicable, e.g., 8% hurdle)
  4. Carried interest to PleoChrome (15-20% of profits above hurdle)
  5. Remaining proceeds pro-rata to investors
- [ ] Wire distribution to all investors
- [ ] Prepare and distribute final K-1s
- [ ] File final partnership tax return (Form 1065)
- [ ] File Form 1-Z (Reg A+) or Form D amendment (Reg D)
- [ ] Dissolve SPV per Wyoming LLC Act (file Articles of Dissolution)
- [ ] If tokenized: burn/retire all tokens
- [ ] Close Transfer Agent registry
- [ ] Terminate vault custody and insurance
- [ ] Send final investor communication
- [ ] Archive complete SPV file for 5+ years

#### 3. Compliance Checkpoints
- [ ] Manager acted in fiduciary capacity during sale (duty of loyalty, duty of care)
- [ ] Independent valuation confirms arm's-length pricing
- [ ] Distribution waterfall follows SPV operating agreement exactly
- [ ] Final K-1s distributed to all investors
- [ ] All SEC filings completed (Form 1-Z, Form D amendment, Form C-AR final)
- [ ] SPV properly dissolved per state law
- [ ] All records archived for 5+ years
- [ ] Tax treatment disclosed: collectibles may be subject to 28% capital gains rate

---

# PART 2: DEBT INSTRUMENTS -- PHASE 3 (Loan Structuring) & PHASE 4 (Capital & Servicing)

---

## PHASE 3: LOAN STRUCTURING

### Step 3.1: UCC-1 Financing Statement

**portal-data.ts reference:** `{ num: "3.1", title: "UCC-1 Financing Statement", ... cost: "$5-$50/state", timeline: "1-2 weeks" }`
**Strategy doc reference:** STRATEGY-6 Section 7

#### 1. Documents Required
- [ ] UCC-1 Financing Statement (form prepared)
- [ ] UCC Search Report (pre-filing -- confirm no existing liens on borrower or specific collateral)
- [ ] Security Agreement (borrower grants security interest in gemstones to lender)
- [ ] Pledge Agreement (evidencing physical custody pledge)
- [ ] Custody Control Agreement (directs vault to follow lender/PleoChrome instructions)
- [ ] Collateral Description Schedule (GIA certificate numbers, carat weights, descriptions, vault receipt numbers)
- [ ] Filing Fee Payment Confirmation
- [ ] Filing Acknowledgment from Secretary of State
- [ ] UCC-1 Filing Receipt

#### 2. Tasks to Complete
- [ ] Determine filing jurisdiction: state where DEBTOR is located (individual: principal residence; entity: state of organization)
- [ ] Conduct pre-filing UCC search ($25-$150) to confirm no existing liens against borrower or specific collateral
- [ ] Prepare UCC-1 Financing Statement:
  - Debtor name (MUST match legal name exactly -- errors can invalidate filing)
  - Secured party name (lender, or PleoChrome as agent for lender)
  - Collateral description (use broad + specific language -- see template in Strategy Doc Section 7.4)
- [ ] File UCC-1 electronically with Secretary of State ($5-$50 per state)
- [ ] Receive filing acknowledgment (1-5 business days)
- [ ] If borrower has multiple jurisdictions: file in additional states
- [ ] Calendar UCC-3 Continuation Statement deadline (before 5-year anniversary)
- [ ] ALSO perfect by possession: ensure Custody Control Agreement directs vault to hold for secured party benefit (belt-and-suspenders approach)
- [ ] Verify filing is searchable in Secretary of State database

#### UCC Filing Specifics by State
| State | Filing Office | Electronic Filing | Cost | Notes |
|-------|--------------|-------------------|------|-------|
| **Wyoming** | Secretary of State | Yes (wyoming.gov) | $15 | PleoChrome home state -- most likely filing location for entity borrowers |
| **Delaware** | Dept. of State, UCC Division | Yes (delaware.gov) | $165 initial + $55/page amendment | Common for LLC borrowers organized in DE |
| **California** | Secretary of State | Yes (sos.ca.gov) | $5 online, $10 paper | For CA-based individual borrowers |
| **New York** | Dept. of State | Yes (dos.ny.gov) | $20 per page | For NY-based borrowers |
| **Texas** | Secretary of State | Yes (sos.texas.gov) | $15 | For TX-based borrowers |
| **Florida** | Dept. of State | Yes (sunbiz.org) | $10 | For FL-based borrowers |
| **Nevada** | Secretary of State | Yes (nvsos.gov) | $20 | Common LLC state |

#### 3. Data Fields to Capture
```json
{
  "uccFiling": {
    "filingType": "UCC-1 | UCC-3-continuation | UCC-3-termination | UCC-3-amendment",
    "filingState": "",
    "filingOffice": "",
    "filingDate": "",
    "filingNumber": "",
    "debtorName": "",
    "debtorType": "individual | entity",
    "debtorAddress": "",
    "securedPartyName": "",
    "collateralDescription": "",
    "giaNumbers": [],
    "filingFee": 0,
    "filingAcknowledgmentReceived": false,
    "searchConducted": true,
    "searchDate": "",
    "priorLiensFound": false,
    "continuationDueDate": "",
    "terminationDate": "",
    "perfectionMethod": "filing | possession | both"
  }
}
```

#### 4. Sources/Links
- UCC Article 9: https://www.law.cornell.edu/ucc/9
- Wyoming SOS UCC Filing: https://sos.wyo.gov/Business/UCC.aspx
- Delaware UCC Filing: https://icis.corp.delaware.gov/UCCR/UCCFiling
- UCC Articles 9 and 12 (Digital Assets): https://www.lowenstein.com/news-insights/publications/articles/ucc-articles-9-and-12-a-modern-legal-framework-for-secured-transactions-and-digital-assets-citron-caporale-podolnyy

#### 5. Audit Log Entries
- `UCC_SEARCH_CONDUCTED` -- date, jurisdiction, result (clear/liens found)
- `UCC1_FILED` -- date, state, filing number, debtor, secured party
- `UCC1_ACKNOWLEDGED` -- date, state confirmation
- `UCC3_CONTINUATION_SCHEDULED` -- date, due date
- `UCC3_CONTINUATION_FILED` -- date, state, filing number
- `UCC3_TERMINATION_FILED` -- date, state, filing number (at loan payoff)

#### 6. Compliance Checkpoints
- [ ] Pre-filing UCC search confirms NO existing liens on borrower or specific collateral
- [ ] Debtor name on UCC-1 matches legal name EXACTLY (UCC 9-503 -- errors can make filing seriously misleading and ineffective)
- [ ] Collateral description "reasonably identifies" the collateral (UCC 9-108) -- include GIA cert numbers, carat weights, types, vault receipt numbers
- [ ] Filed in correct jurisdiction (debtor's state of organization for entities; principal residence for individuals)
- [ ] BOTH filing AND possession used for maximum protection (belt-and-suspenders)
- [ ] UCC-3 Continuation Statement calendared before 5-year expiration
- [ ] UCC filing is searchable in Secretary of State database after filing
- [ ] No PMSI (Purchase Money Security Interest) priority issues identified

#### 7. AI Automation Opportunities
- **UCC deadline tracker**: Automated calendar for continuation, amendment, and termination deadlines across all active loans
- **Debtor name validator**: AI verifies debtor name against entity records and flags potential discrepancies
- **Multi-state filing automation**: Automated filing across multiple jurisdictions with status tracking
- **Lien monitoring**: Continuous monitoring of UCC filings against PleoChrome borrowers for competing liens

---

### Step 3.2: Lender Identification

**portal-data.ts reference:** `{ num: "3.2", title: "Lender Identification", ... timeline: "2-4 weeks" }`
**Strategy doc reference:** STRATEGY-6 Step A5

#### 1. Documents Required
- [ ] Lender Qualification Questionnaire
- [ ] Lender KYC/AML Records
- [ ] Lender Accreditation Verification (if note offering under Sub-Path B)
- [ ] Lender CRM Profile
- [ ] Term Sheet (preliminary, for lender review)
- [ ] Deal Summary / Teaser Document

#### 2. Tasks to Complete
- [ ] Source capital providers: family offices, alternative credit funds, HNW individuals, specialty lenders, syndication partners
- [ ] Qualify each lender prospect (capital availability, risk appetite, asset class experience, regulatory status)
- [ ] Run KYC/AML on lender
- [ ] If lender will participate via note offering (Sub-Path B): verify accredited investor status
- [ ] Present deal summary and preliminary term sheet
- [ ] Match lender risk profile to borrower/collateral characteristics
- [ ] Negotiate preliminary terms
- [ ] Build and maintain lender network database (target: 5-10 active capital providers)

#### 3. Data Fields to Capture
```json
{
  "lender": {
    "id": "",
    "name": "",
    "type": "family-office | credit-fund | hnw-individual | specialty-lender | syndicate",
    "contact": { "name": "", "email": "", "phone": "" },
    "capitalAvailable": 0,
    "riskAppetite": "conservative | moderate | aggressive",
    "assetClassExperience": [],
    "kycComplete": false,
    "accreditedVerified": false,
    "preferredLTV": "",
    "preferredTerm": "",
    "preferredRate": ""
  }
}
```

#### 4. Compliance Checkpoints
- [ ] Lender KYC/AML completed before any loan documentation
- [ ] If note offering (Sub-Path B): lender accreditation verified per Reg D 506(c) standards
- [ ] Lender is not subject to any sanctions or regulatory restrictions

---

### Step 3.3: Loan Terms Structuring

**portal-data.ts reference:** `{ num: "3.3", title: "Loan Terms Structuring", ... cost: "$5K-$10K", timeline: "1-2 weeks" }`
**Strategy doc reference:** STRATEGY-6 Steps A3 and A5

#### Loan Document Checklist
- [ ] **1. Promissory Note** -- principal amount, interest rate (12-18% APR), payment schedule, maturity date (12-36 months), default provisions, prepayment terms
- [ ] **2. Security Agreement** -- grants lender perfected security interest in gemstones; describes collateral by GIA certificate numbers; includes representations and warranties
- [ ] **3. Pledge Agreement** -- additional document evidencing physical custody pledge to secured party
- [ ] **4. Custody Control Agreement** -- tripartite (borrower, lender, vault); directs vault to follow lender/PleoChrome instructions re: collateral release
- [ ] **5. Loan Servicing Agreement** -- appoints PleoChrome as servicing agent; defines servicing duties, fee, reporting
- [ ] **6. Personal Guarantee** (optional) -- if borrower is entity, principal may provide personal guarantee
- [ ] **7. UCC-1 Financing Statement** -- filed with Secretary of State (see Step 3.1)
- [ ] **8. Insurance Assignment** -- assigns specie insurance proceeds to lender as loss payee
- [ ] **9. Intercreditor Agreement** (if multiple lenders) -- defines priority, payment waterfall, voting rights
- [ ] **10. Borrower Certificate of Representations** -- certifies all statements in loan application are true
- [ ] **11. Lender Commitment Letter** (from lender to borrower/PleoChrome)
- [ ] **12. Fee Letter** -- details all fees (origination, servicing, late, prepayment)

#### 2. Tasks to Complete
- [ ] Calculate LTV per PleoChrome's LTV schedule (30-60% depending on stone type/origin/treatment)
- [ ] Determine maximum loan amount
- [ ] Structure interest rate: fixed preferred (12-18% APR total: 10-14% to lender + 2-4% PleoChrome spread)
- [ ] Structure payment schedule: monthly or quarterly interest payments, bullet principal at maturity
- [ ] Define loan covenants: no additional liens, maintain insurance, no change of ownership, collateral value maintenance
- [ ] Define events of default (payment, financial, collateral impairment, insurance lapse, covenant breach, fraud, regulatory)
- [ ] Define cure periods for each default event
- [ ] Define remedies: workout/modification, acceleration, collateral foreclosure
- [ ] Verify usury law compliance:
  - Total all-in rate (including amortized fees) <= 24% APR as safety margin
  - Wyoming/Delaware choice-of-law provision
  - Entity borrower requirement (no loans to natural persons)
  - Business/investment purpose certification
- [ ] Verify TILA compliance (likely exempt for business/investment purpose loans)
- [ ] If multiple lenders: draft intercreditor agreement
- [ ] Securities/lending counsel review of all documents
- [ ] Present final terms to borrower and lender for approval
- [ ] Execute all loan documents

#### Default/Workout Procedures Checklist
- [ ] Payment default notice template (issued within 3 business days)
- [ ] Cure period tracking system (5-30 days per default type)
- [ ] Workout/modification negotiation procedures
- [ ] Loan acceleration notice template
- [ ] UCC 9-610 commercially reasonable disposition procedures:
  - [ ] Notice of disposition to borrower (UCC 9-611 -- 10 days for non-consumer)
  - [ ] Borrower right of redemption period (UCC 9-623)
  - [ ] Fresh appraisal of collateral
  - [ ] Select disposition method (private dealer sale, public auction, private auction, tokenized sale, broker sale)
  - [ ] Execute sale
  - [ ] Apply proceeds per waterfall (UCC 9-615):
    1. Reasonable expenses of liquidation
    2. Outstanding obligation (principal + interest + fees)
    3. Subordinate security interests
    4. Surplus to borrower
  - [ ] Account to borrower for surplus or deficiency (UCC 9-616)
  - [ ] If non-recourse: absorb loss
  - [ ] If recourse: pursue deficiency judgment
  - [ ] File UCC-3 Termination

#### Collateral Monitoring Requirements
- [ ] Monthly: Vault custody verification (Chainlink PoR or vault report)
- [ ] Daily: Chainlink PoR feed monitoring (automated alert for stale/failed feed)
- [ ] Quarterly: Borrower sanctions re-screening (OFAC, EU, UN)
- [ ] Annually: Independent reappraisal by USPAP-compliant appraiser
- [ ] Annually: LTV recalculation; if LTV exceeds covenant threshold, trigger margin call
- [ ] Annually: Insurance renewal verification (coverage >= loan principal)
- [ ] Semi-annually: Borrower financial status check (recourse loans)
- [ ] Monthly/quarterly: Lender reporting (collateral status, payment status, NAV, market conditions)
- [ ] Before 5th anniversary: UCC-1 Continuation Statement
- [ ] Physical inspection: Annual by PleoChrome representative (verify gemstones match GIA certs)
- [ ] Photography: High-resolution photos at deposit (baseline for damage claims)

#### 3. Data Fields to Capture
```json
{
  "loan": {
    "loanId": "",
    "borrowerName": "",
    "lenderName": "",
    "collateralDescription": "",
    "giaNumbers": [],
    "appraisedValue": 0,
    "ltv": 0,
    "principalAmount": 0,
    "interestRate": 0,
    "lenderRate": 0,
    "pleochromeSpread": 0,
    "term": "",
    "maturityDate": "",
    "paymentFrequency": "monthly | quarterly",
    "paymentSchedule": [],
    "originationFee": 0,
    "servicingFeeRate": 0,
    "latePaymentFee": "",
    "prepaymentPremium": "",
    "covenants": [],
    "defaultEvents": [],
    "curePeriods": {},
    "recourse": true,
    "usury": {
      "choiceOfLaw": "Wyoming",
      "allInRate": 0,
      "entityBorrower": true,
      "businessPurpose": true,
      "safetyMarginCompliant": true
    },
    "documents": {
      "promissoryNote": false,
      "securityAgreement": false,
      "pledgeAgreement": false,
      "custodyControlAgreement": false,
      "loanServicingAgreement": false,
      "personalGuaranty": false,
      "ucc1Filed": false,
      "insuranceAssignment": false,
      "intercreditorAgreement": false,
      "borrowerCertificate": false,
      "lenderCommitment": false,
      "feeLetter": false
    }
  }
}
```

#### 4. Sources/Links
- UCC 9-610 (Commercially Reasonable Disposition): https://www.law.cornell.edu/ucc/9/9-610
- UCC 9-611 (Notification): https://www.law.cornell.edu/ucc/9/9-611
- UCC 9-615 (Application of Proceeds): https://www.law.cornell.edu/ucc/9/9-615
- UCC 9-623 (Right of Redemption): https://www.law.cornell.edu/ucc/9/9-623
- OCC Comptroller's Handbook -- Asset-Based Lending: https://www.occ.treas.gov/publications-and-resources/publications/comptrollers-handbook/files/asset-based-lending/pub-ch-asset-based-lending.pdf
- State Usury Rates: https://www.csbs.org/newsroom/csbs-releases-comprehensive-state-usury-rate-tool

#### 5. Audit Log Entries
- `LTV_CALCULATED` -- date, appraisal value, LTV ratio, max loan amount
- `LOAN_TERMS_STRUCTURED` -- date, rate, term, covenants
- `USURY_COMPLIANCE_VERIFIED` -- date, all-in rate, jurisdiction, method
- `LOAN_DOCS_DRAFTED` -- date, counsel name, document list
- `LOAN_DOCS_EXECUTED` -- date, parties, key terms
- `DEFAULT_EVENT_OCCURRED` -- date, type, cure period start
- `DEFAULT_CURED` -- date, method
- `DEFAULT_UNCURED` -- date, lender election
- `COLLATERAL_LIQUIDATION_INITIATED` -- date, method
- `COLLATERAL_SOLD` -- date, method, price, proceeds distribution

#### 6. Compliance Checkpoints
- [ ] All-in rate (including amortized fees) does not exceed 24% APR safety margin
- [ ] Choice-of-law provision (Wyoming/Delaware) properly documented
- [ ] Borrower is an entity (not natural person for consumer) -- or business purpose certification on file
- [ ] TILA compliance analyzed (likely exempt for business/investment purpose)
- [ ] All loan documents reviewed by lending counsel
- [ ] Collateral description in security agreement matches UCC-1 filing
- [ ] Insurance assignment executed and lender named as loss payee
- [ ] UCC 9-610 commercially reasonable standard documented for all disposition procedures
- [ ] Borrower protections documented: right of redemption (9-623), notice (9-611), surplus entitlement (9-615(d)), accounting (9-616)

---

### Step 3.4: Collateral Custody Agreement

**portal-data.ts reference:** `{ num: "3.4", title: "Collateral Custody Agreement", ... cost: "$3K", timeline: "1 week" }`
**Strategy doc reference:** STRATEGY-6 Step A4

#### 1. Documents Required
- [ ] Tripartite Custody Agreement (borrower, lender/PleoChrome, vault)
- [ ] Vault Receipt (warehouse receipt listing all deposited gemstones with GIA numbers)
- [ ] Custody Verification Memo
- [ ] High-Resolution Gemstone Photography (baseline at deposit)

#### 2. Tasks to Complete
- [ ] Execute Tripartite Custody Agreement specifying:
  - Vault is bailee; borrower retains legal ownership until default
  - Gemstones are segregated (allocated, NOT commingled)
  - Vault will not release without written PleoChrome/lender authorization
  - After loan origination: release requires PleoChrome (agent) authorization only
  - Gemstones are NOT part of vault's bankruptcy estate
  - Vault carries its own liability insurance
  - Vault provides immediate notification of any security incident
  - Environmental controls specified (temperature, humidity)
- [ ] Arrange armored transit to vault (Brink's, Malca-Amit, Loomis)
- [ ] Obtain transit insurance for full value
- [ ] Vault intake and inspection
- [ ] Photograph all gemstones at deposit (high-resolution, gemological detail)
- [ ] Obtain official Vault Receipt
- [ ] Verify Chainlink PoR activation (or manual attestation)

#### 3. Compliance Checkpoints
- [ ] Custody agreement is tripartite (borrower, lender/agent, vault)
- [ ] Segregated (allocated) storage -- NOT commingled
- [ ] Release protocol requires PleoChrome authorization after loan origination
- [ ] Gemstones excluded from vault's bankruptcy estate (bailment structure)
- [ ] Vault insurance verified (separate from borrower's specie insurance)
- [ ] Transit insurance covers full value during any movement
- [ ] Chainlink PoR or equivalent custody verification active

---

### Step 3.5: Insurance & Coverage Verification

**portal-data.ts reference:** `{ num: "3.5", title: "Insurance & Coverage Verification", ... tags: ["lg", "pt"] }`
**Strategy doc reference:** STRATEGY-6 Section 9

#### 1. Documents Required
- [ ] Specie Insurance Certificate (full appraised value, updated annually)
- [ ] Transit Insurance Certificate
- [ ] Insurance Assignment (lender named as first loss payee; PleoChrome as additional insured)
- [ ] Vault Operator Liability Policy Confirmation
- [ ] PleoChrome E&O Insurance Certificate ($2M-$5M)
- [ ] PleoChrome D&O Insurance Certificate ($2M-$5M)
- [ ] Insurance Gap Analysis Memo

#### 2. Tasks to Complete
- [ ] Verify specie insurance covers full appraised value
- [ ] Confirm lender named as first loss payee
- [ ] Confirm PleoChrome named as additional insured
- [ ] Verify transit insurance for any movement
- [ ] Review policy exclusions (war, nuclear, terrorism)
- [ ] Confirm deductible amount is within acceptable LTV buffer
- [ ] Set up 90-day advance renewal notice
- [ ] Identify secondary insurer on standby
- [ ] Document insurance gap analysis

#### 3. Insurance Providers
- Lloyd's of London (specie syndicates)
- AXA XL (specie desk)
- Chubb (valuable articles)
- Berkley Asset Protection
- Hugh Wood Inc. (specie broker)

---

## PHASE 4: CAPITAL & SERVICING

### Step 4.1: Loan Origination & Closing

**portal-data.ts reference:** `{ num: "4.1", title: "Loan Origination & Closing", ... cost: "2% origination", tags: ["lg", "dg", "rw"] }`
**Strategy doc reference:** STRATEGY-6 Steps A5 and A6

#### 1. Documents Required
- [ ] Complete Executed Loan Package (all 12 documents from Step 3.3)
- [ ] Wire Confirmation of Loan Proceeds to Borrower
- [ ] UCC-1 Filing Receipt (confirmed accepted by SOS)
- [ ] Borrower Payment Schedule
- [ ] Closing Binder (complete set of all executed documents)
- [ ] Loan Tape Entry (master loan tracking record)
- [ ] Lender Welcome Package (servicing contact, reporting schedule, collateral verification access)
- [ ] Post-Closing Checklist Completion

#### 2. Tasks to Complete
- [ ] Confirm all closing conditions met:
  - All loan documents executed
  - UCC-1 accepted by Secretary of State
  - Insurance certificate received and valid
  - Vault custody receipt matches GIA documentation
  - All KYC/AML clear
- [ ] Authorize disbursement of loan proceeds
- [ ] Verify wire instructions by phone (anti-wire-fraud)
- [ ] Confirm wire transfer to borrower
- [ ] Collect PleoChrome origination fee (1.5-3.0% of principal from borrower)
- [ ] Collect placement fee (0.5-1.0% from lender)
- [ ] Open servicing file in loan administration system
- [ ] Create borrower payment schedule
- [ ] Send lender welcome package
- [ ] Complete post-closing checklist (all documents signed, dated, filed)
- [ ] Identify and cure any post-closing document deficiencies (missing signatures, incorrect dates)

#### 3. Data Fields to Capture
```json
{
  "closing": {
    "closingDate": "",
    "allConditionsMet": true,
    "wireAmount": 0,
    "wireConfirmation": "",
    "wireVerifiedByPhone": true,
    "originationFeeCollected": 0,
    "placementFeeCollected": 0,
    "servicingFileOpened": true,
    "paymentScheduleCreated": true,
    "lenderWelcomePackageSent": true,
    "postClosingComplete": true,
    "deficienciesIdentified": [],
    "deficienciesCured": []
  }
}
```

#### 4. Audit Log Entries
- `CLOSING_CONDITIONS_VERIFIED` -- date, checklist completion
- `WIRE_AUTHORIZED` -- date, amount, authorized by
- `WIRE_CONFIRMED` -- date, confirmation number
- `ORIGINATION_FEE_COLLECTED` -- date, amount
- `PLACEMENT_FEE_COLLECTED` -- date, amount
- `SERVICING_FILE_OPENED` -- date, loan ID
- `POST_CLOSING_COMPLETE` -- date, deficiencies (if any)

---

### Step 4.2: Participation Notes (if applicable)

**portal-data.ts reference:** `{ num: "4.2", title: "Participation Notes (if applicable)", ... cost: "$50K-$80K", tags: ["lg", "dg"] }`
**Strategy doc reference:** STRATEGY-6 Section 4 (Sub-Path B)

#### 1. Documents Required
- [ ] Note PPM (Private Placement Memorandum -- distinct from equity/tokenization PPM)
- [ ] Note Indenture or Note Purchase Agreement
- [ ] Subscription Agreement (for note purchasers)
- [ ] Investor Questionnaire and Accredited Investor Certification
- [ ] Form D (filed within 15 days of first note sale)
- [ ] Blue Sky State Filings
- [ ] SPV Formation Documents (new Series LLC or new series under existing)
- [ ] Tax Counsel Opinion on Note Tax Treatment
- [ ] If tokenized: ERC-3643 Note Token Deployment + Smart Contract Audit
- [ ] Payment Waterfall Schedule
- [ ] Reves Test Analysis Memo (confirming notes ARE securities -- must comply with Reg D 506(c))

#### 2. Tasks to Complete
- [ ] Confirm Reves Test analysis: loan participation interests ARE securities
- [ ] Form new SPV (or new series) for note program
- [ ] Draft Note PPM with comprehensive risk disclosures (gemstone market risk, appraisal risk, custody risk, borrower default risk, illiquidity risk)
- [ ] Structure note terms: denomination ($25K-$250K min), coupon (8-14%), maturity (12-36 months), security (senior secured), LTV (30-60%), payment waterfall, prepayment terms
- [ ] Engage BD for note distribution (if separate from primary offering BD)
- [ ] File Form D within 15 days of first note sale
- [ ] File blue sky notices
- [ ] Market notes to accredited investors
- [ ] Verify accreditation for every note purchaser
- [ ] Process subscriptions and issue notes
- [ ] If tokenized: deploy note tokens on Polygon (ERC-3643) after smart contract audit
- [ ] Begin quarterly interest distributions to note holders
- [ ] Provide quarterly reports: payment status, collateral status, LTV update
- [ ] Issue annual K-1 (if SPV is partnership) or 1099-INT (if notes are debt instruments)

#### 3. Compliance Checkpoints
- [ ] Reves Test analysis documented and signed by counsel
- [ ] Full Reg D 506(c) compliance for note offering
- [ ] Every note purchaser verified accredited
- [ ] PPM comprehensively discloses all risks
- [ ] Form D filed within 15 days of first note sale
- [ ] Investment Company Act exemption analysis documented (Section 3(c)(1), 3(c)(7), or operating company)
- [ ] Broker-dealer considerations addressed (Section 15 Exchange Act)
- [ ] Payment waterfall clearly defined and disclosed

---

### Step 4.3: Payment Servicing

**portal-data.ts reference:** `{ num: "4.3", title: "Payment Servicing", ... tags: ["dg", "ai"] }`
**Strategy doc reference:** STRATEGY-6 Step A7

#### 1. Documents Required
- [ ] Monthly/Quarterly Lender Reports
- [ ] Monthly/Quarterly Payment Records
- [ ] Payment Confirmation to Borrower (receipt)
- [ ] Distribution Confirmation to Lender/Note Holders
- [ ] Servicing System Records

#### 2. Tasks to Complete
- [ ] Collect borrower interest payment (ACH or wire) monthly/quarterly
- [ ] Deduct PleoChrome servicing fee (0.50-1.00% per annum of outstanding balance)
- [ ] Remit net interest to lender(s)/note holders
- [ ] Maintain accurate payment records
- [ ] Provide written receipt to borrower
- [ ] Monitor for late payments (>10 days triggers late fee)
- [ ] File SARs if any suspicious payment activity
- [ ] Issue lender/investor reports (monthly or quarterly)

#### 3. AI Automation Opportunities
- **Automated payment collection**: ACH auto-debit with retry logic for failed payments
- **Automated distribution calculation**: Pro-rata distribution to multiple note holders with servicing fee deduction
- **Delinquency prediction**: AI analyzes payment patterns to predict potential defaults
- **Automated reporting**: AI generates lender reports from payment data

---

### Step 4.4: Collateral Monitoring

**portal-data.ts reference:** `{ num: "4.4", title: "Collateral Monitoring", ... cost: "$2K/yr reappraisal", tags: ["dg", "pt", "ai"] }`
**Strategy doc reference:** STRATEGY-6 Steps A7 and Section 9

#### 1. Documents Required
- [ ] Monthly Vault Custody Verification Report
- [ ] Daily Chainlink PoR Feed Status Log
- [ ] Quarterly Sanctions Re-Screening Results
- [ ] Annual Reappraisal Report
- [ ] Annual LTV Recalculation Memo
- [ ] Annual Insurance Renewal Confirmation
- [ ] Semi-Annual Borrower Financial Status Report (recourse loans)
- [ ] Monthly/Quarterly Lender Report (collateral section)
- [ ] Physical Inspection Report (annual)

#### 2. Tasks to Complete
- [ ] Monthly: verify vault custody (Chainlink PoR or vault attestation)
- [ ] Daily: monitor Chainlink PoR feed for stale/failed data (automated alert)
- [ ] Quarterly: run sanctions re-screening on borrower
- [ ] Annually: commission independent reappraisal
- [ ] Annually: recalculate LTV with updated appraisal
- [ ] If LTV exceeds covenant threshold: issue margin call to borrower (additional collateral or principal paydown)
- [ ] Annually: verify and renew insurance (coverage >= loan principal + accrued interest)
- [ ] Semi-annually: check borrower financial status (recourse loans)
- [ ] Annually: physical inspection by PleoChrome representative
- [ ] Before 5th anniversary: file UCC-3 Continuation Statement
- [ ] Monthly/quarterly: generate and distribute lender reports

#### 3. Compliance Checkpoints
- [ ] Custody verification performed at least monthly
- [ ] Insurance coverage maintained at all times (no gaps)
- [ ] UCC-1 remains perfected (continuation filed before 5-year expiration)
- [ ] Sanctions re-screening current (at least quarterly)
- [ ] Reappraisal completed annually
- [ ] LTV within covenant threshold at all times
- [ ] Lender reporting timely and accurate

---

### Step 4.5: Default & Workout Procedures

**portal-data.ts reference:** `{ num: "4.5", title: "Default & Workout Procedures", ... tags: ["lg", "rw"] }`
**Strategy doc reference:** STRATEGY-6 Section 10

#### 1. Documents Required
- [ ] Default Notice (to borrower -- within 3 business days of event)
- [ ] Cure Period Tracking Log
- [ ] Lender Notification and Recommendation Memo
- [ ] Workout/Modification Agreement (if workout)
- [ ] Loan Acceleration Notice (if acceleration)
- [ ] UCC 9-611 Notice of Disposition (to borrower -- 10 days for non-consumer)
- [ ] Fresh Appraisal at Liquidation
- [ ] Sale Agreement (dealer, auction, or private sale)
- [ ] Proceeds Distribution Memo (per UCC 9-615 waterfall)
- [ ] Surplus/Deficiency Accounting (per UCC 9-616)
- [ ] UCC-3 Termination Statement (after disposition)

#### 2. Tasks to Complete
- [ ] Identify event of default (payment, financial, collateral, insurance, covenant, fraud, regulatory)
- [ ] Issue default notice to borrower within 3 business days
- [ ] Track cure period (5-30 days per default type)
- [ ] If cured: resume normal servicing
- [ ] If NOT cured: notify lender with recommendation
- [ ] Lender elects remedy: workout, acceleration, or foreclosure
- [ ] If workout: negotiate modified terms
- [ ] If acceleration: issue acceleration notice
- [ ] If foreclosure:
  - Issue UCC 9-611 notice (10 days)
  - Allow borrower redemption period (UCC 9-623)
  - Commission fresh appraisal
  - Select commercially reasonable disposition method
  - Execute sale
  - Apply proceeds per UCC 9-615 waterfall
  - Account to borrower for surplus or deficiency (UCC 9-616)
  - File UCC-3 Termination Statement

---

### Step 4.6: Loan Maturity & Collateral Release

**portal-data.ts reference:** `{ num: "4.6", title: "Loan Maturity & Collateral Release", ... tags: ["lg", "rw", "dg"] }`
**Strategy doc reference:** STRATEGY-6 Step A8

#### 1. Documents Required
- [ ] Payoff Statement
- [ ] Wire Confirmation of Final Payment
- [ ] UCC-3 Termination Statement (filed)
- [ ] Vault Release Instruction Letter
- [ ] Armored Transit Confirmation (if returning to borrower)
- [ ] Final Lender Accounting
- [ ] Loan Closed Confirmation (servicing system)
- [ ] Renewal/Extension Documents (if applicable -- new/amended promissory note, reappraisal)

#### 2. Tasks to Complete
- [ ] Prepare payoff statement (outstanding principal + accrued interest + fees)
- [ ] Receive and verify final payment
- [ ] Instruct vault to release collateral to borrower
- [ ] Arrange armored transit for collateral return (if needed)
- [ ] File UCC-3 Termination Statement with Secretary of State
- [ ] Prepare final lender accounting
- [ ] Close loan in servicing system
- [ ] Archive complete loan file for 5+ years
- [ ] If renewal: commission reappraisal, execute new/amended documents, file UCC continuation if needed
- [ ] If refinance: coordinate simultaneous closing with new lender

---

# PART 3: MISSING STEPS IDENTIFIED

## Comparison Analysis: PleoChrome vs Masterworks / Percent / Borro-Diamond Banc

### MISSING FROM FRACTIONAL SECURITIES WORKFLOW

| # | Missing Step | Where It Should Go | Who Does It | Why It Matters | Priority |
|---|-------------|-------------------|-------------|----------------|----------|
| F1 | **Independent Compliance Officer / CCO Designation** | Phase 3, before securities structuring | PleoChrome must designate or hire a Chief Compliance Officer | Masterworks has dedicated compliance staff; SEC expects named CCO for ongoing offerings | HIGH |
| F2 | **Investor Relations Platform Selection & Configuration** | Phase 3, Step 3.3 (parallel) | David (CTO) | Masterworks has a proprietary investor portal with dashboard, NAV tracking, secondary trading; PleoChrome needs equivalent | HIGH |
| F3 | **Escrow Agent Engagement** (as separate step) | Phase 3, between Steps 3.2 and 3.5 | Securities counsel + David | Reg A+ and many Reg D offerings require escrow of investor funds until minimum raise threshold met; not called out as explicit step | MEDIUM |
| F4 | **Testing the Waters Campaign** (Reg A+ specific) | Phase 4, before Step 4.1 (pre-qualification) | Marketing + counsel | Masterworks runs "testing the waters" campaigns to build waitlists during SEC qualification; this is a revenue-delay mitigation strategy | HIGH (Reg A+ only) |
| F5 | **FINRA BD Due Diligence Questionnaire Preparation** | Phase 3, Step 3.2 (part of BD engagement) | PleoChrome must complete the BD's DDQ, not just engage them | BDs conduct reverse diligence on the issuer; PleoChrome needs prepared DDQ responses | MEDIUM |
| F6 | **Investor Data Security / Privacy Policy** | Phase 3, Step 3.5 (parallel with legal docs) | David + counsel | SEC Reg S-P compliance for investor PII; cyber insurance; SOC 2 or equivalent | HIGH |
| F7 | **Anti-Money Laundering Program Formalization** | Phase 3, before any investor onboarding | David as compliance officer | Not legally required for non-BD entities, but ALL BD partners will require it; best practice per FinCEN guidance | HIGH |
| F8 | **Investor Suitability Assessment** (beyond accreditation) | Phase 4, Step 4.2 | BD compliance | FINRA Reg BI (Best Interest) requires suitability analysis beyond accreditation verification; BD must confirm investment is suitable | MEDIUM |
| F9 | **Offering Circular / PPM Annual Update** (for continuing offerings) | Phase 4, annual obligations | Counsel | Reg A+ requires updated offering circular if material facts change; Reg D PPM should be updated annually | HIGH |
| F10 | **Independent Board / Advisory Board Formation** | Phase 3, entity formation context | Shane (CEO) | Masterworks has independent board members for each SPV; institutional investors expect governance beyond founder control | MEDIUM |
| F11 | **Investor Communication Templates Library** | Phase 4, Step 4.5 | David + marketing | Standardized templates for: welcome email, subscription confirmation, unit issuance, quarterly updates, K-1 delivery, material events, exit notification | LOW |
| F12 | **Cross-Offering Investor Portal** | Phase 4, post-first offering | David (CTO) | Masterworks investors can see all their holdings across paintings in one portal; PleoChrome needs this for multi-SPV management | MEDIUM |
| F13 | **Market-Making / Liquidity Provision Strategy** | Phase 4, Step 4.7 | Shane + BD | Rally and Masterworks both have mechanisms to ensure secondary market liquidity; thin markets with no market maker fail | MEDIUM |
| F14 | **Reg S International Offering Component** | Phase 4, parallel offering | Counsel | Strategy doc mentions Reg S for non-US investors but no workflow step exists; Masterworks has international investor access | LOW (Year 2+) |

### MISSING FROM DEBT INSTRUMENTS WORKFLOW

| # | Missing Step | Where It Should Go | Who Does It | Why It Matters | Priority |
|---|-------------|-------------------|-------------|----------------|----------|
| D1 | **50-State Lending License Analysis** (as formal step) | Phase 3, Step 3.0 (before any loan structuring) | Lending counsel | Strategy doc discusses licensing in Section 8 but no explicit workflow step; this is a GATING item | CRITICAL |
| D2 | **NMLS Registration** (as formal step) | Phase 3, after license analysis | Compliance + counsel | Strategy doc mentions NMLS in Section 8 but no step; required in many states for loan arrangers | HIGH |
| D3 | **Borrower Credit/Financial Analysis** (for recourse loans) | Phase 3, after Step 3.2 | PleoChrome | Borro/Diamond Banc may skip credit checks (non-recourse), but if PleoChrome offers recourse loans, borrower creditworthiness matters | MEDIUM |
| D4 | **Lender Network CRM & Deal Flow Pipeline** | Phase 3, Step 3.2 (infrastructure) | Chris + David | Percent maintains an active investor/lender network with deal flow tools; PleoChrome needs formal pipeline management | HIGH |
| D5 | **Loan Servicing Software Selection & Implementation** | Phase 4, before Step 4.3 | David (CTO) | Strategy doc mentions Nortridge, Mortgage Automator, LoanPro but no formal selection step; servicing on spreadsheets is not scalable | HIGH |
| D6 | **Borrower Portal / Self-Service Platform** | Phase 4, parallel with Step 4.3 | David (CTO) | Borro and Diamond Banc offer online portals for borrowers; Percent provides investor dashboards; PleoChrome needs both | MEDIUM |
| D7 | **Interest Rate Spread Disclosure / Conflict of Interest Policy** | Phase 3, Step 3.3 | Counsel | If PleoChrome earns a spread between borrower rate and lender yield, this is a conflict of interest that must be disclosed to both parties | HIGH |
| D8 | **Loan Committee Formal Approval Process** | Phase 3, before Step 3.3 | Shane + David + Chris | Formal credit committee approval for each loan, with documented rationale, risk assessment, and conditions | HIGH |
| D9 | **Borrower Financial Condition Monitoring** (ongoing) | Phase 4, Step 4.4 (expand) | PleoChrome servicing | Beyond collateral monitoring: for recourse loans, ongoing monitoring of borrower's financial health (financial statements, tax returns) | MEDIUM |
| D10 | **Investment Company Act Compliance Review** (formal step) | Phase 3, if Sub-Path B | Counsel | Strategy doc discusses ICA in Section 6.3 but no formal step; if PleoChrome holds loans or note participations, ICA analysis is CRITICAL | HIGH |
| D11 | **Wire Fraud Prevention Protocol** | Phase 4, Step 4.1 | David + operations | Explicit protocol for verifying wire instructions (verbal callback verification of wire routing numbers) to prevent wire fraud | HIGH |
| D12 | **Late Payment Collection & Enforcement SOP** | Phase 4, between Steps 4.3 and 4.5 | Servicing officer | Formalized escalation: 5-day late notice, 10-day fee trigger, 30-day default trigger, with templates and procedures | MEDIUM |
| D13 | **Gemstone Market Monitoring & Alert System** | Phase 4, Step 4.4 (expand) | David + Chris | Automated monitoring of gemstone market indices (GemGuide, Gemval) with alerts if market moves threaten LTV covenants | MEDIUM |
| D14 | **Loan Tape / Portfolio Reporting** | Phase 4, Step 4.3 (expand) | David | Consolidated loan tape (Excel/database) tracking all active loans, performance, collateral values, payment status -- essential for portfolio management and potential note offering | HIGH |

---

# PART 4: PORTAL-DATA.TS ALIGNMENT CHECK

## Gaps Between Strategy Documents and portal-data.ts

| Issue | Strategy Doc Says | portal-data.ts Says | Recommendation |
|-------|-----------------|--------------------|----|
| **Fractional Phase 3 missing steps** | 14 steps in strategy doc (Steps 1-14) | Only 5 steps in Phase 3 (3.1-3.5) | Phase 3 correctly consolidates the pre-distribution steps; however, Steps 3.4 (Regulatory Exemption Selection) duplicates Phase 1-2 shared work; consider removing or marking as "confirms decision from Phase 2" |
| **Fractional Phase 4 step count** | Steps 9-14 in strategy doc | 8 steps (4.1-4.8) in portal-data.ts | Good consolidation. However, Step 13 (Secondary Market) and Step 14 (Exit) deserve more granular sub-steps in the portal |
| **Debt Phase 3 missing custody as separate step** | Strategy doc has explicit Step A4 (Collateral Transfer to Institutional Custody) | Phase 3 has only 5 steps; custody is in Step 3.4 (Collateral Custody Agreement) | Acceptable consolidation, but ensure custody agreement step also covers physical transfer logistics, vault inspection, PoR activation |
| **Debt Phase 3 LTV rates** | Strategy doc: 30-60% LTV range with detailed stone-type schedule | portal-data.ts Step 3.3: "LTV (50-70%)" | **MISMATCH** -- portal says 50-70%, strategy doc says 30-60%. The strategy doc is more conservative and likely more accurate. Update portal-data.ts to match strategy doc (30-60%). |
| **Debt Phase 3 interest rate** | Strategy doc: 12-18% APR total | portal-data.ts Step 3.3: "rate (12-18% APR)" | Match -- good |
| **Debt Phase 4 missing Sub-Path C (DeFi)** | Strategy doc has full Sub-Path C workflow (Steps C1-C3) | Not represented in portal-data.ts | Consider adding Sub-Path C as optional Phase 5 or as expansion steps within Phase 4 (Year 3-4 feature) |
| **Revenue model debt fees** | Strategy doc: origination 1.5-3.0%, servicing 0.50-1.00%, spread 2-4% | portal-data.ts: origination 2%, servicing 0.75%/yr, spread 3% | Close but not exact. portal-data.ts uses mid-range estimates -- acceptable for display purposes |
| **Missing partner stack for Debt** | Debt path doesn't need tokenization partners but does need: lending counsel, vault, insurance, servicing software | PARTNER_STACKS only covers tokenization/BD/ATS/TA partners | Consider adding a LENDING_PARTNERS stack to portal-data.ts |

---

# PART 5: RECOMMENDED PRIORITY ACTIONS

## Immediate (Before First Offering)

1. **Designate CCO** (F1) -- Name David Whiting as interim CCO or engage outside compliance consultant
2. **Formalize AML Program** (F7) -- Required by every BD partner; must be in place before BD engagement
3. **50-State Lending License Analysis** (D1) -- GATING item for entire debt vertical; engage lending counsel immediately
4. **Fix LTV Mismatch in portal-data.ts** -- Change Debt Step 3.3 from "50-70%" to "30-60%" to match strategy doc
5. **Wire Fraud Prevention Protocol** (D11) -- Simple to implement, prevents catastrophic loss
6. **Investor Data Security Policy** (F6) -- SEC Reg S-P compliance; required before accepting any investor PII
7. **Loan Committee Formation** (D8) -- Establish formal credit committee with documented approval process

## Near-Term (First 3 Months)

8. **Investor Relations Platform** (F2) -- Build or select portal for investor dashboard, NAV tracking, document access
9. **Loan Servicing Software** (D5) -- Select and implement before first loan
10. **NMLS Registration** (D2) -- Register in initial target states (Wyoming, Texas, Florida)
11. **Testing the Waters Strategy** (F4) -- Prepare for Reg A+ pathway
12. **Interest Rate Spread Disclosure Policy** (D7) -- Document and disclose to both parties

## Medium-Term (3-12 Months)

13. **Cross-Offering Investor Portal** (F12) -- As second offering launches
14. **Borrower Portal** (D6) -- Self-service for payment history, statements
15. **Gemstone Market Monitoring** (D13) -- Automated alerts
16. **Loan Tape / Portfolio Reporting** (D14) -- Consolidated tracking
17. **Investment Company Act Analysis** (D10) -- Before Sub-Path B launch

---

**END OF AUDIT**

*This audit was generated by analyzing the complete text of FRACTIONAL-SECURITIES-VALUE-CREATION-PATH.md (1,618 lines), STRATEGY-6-DEBT-INSTRUMENTS-AND-ASSET-BACKED-LENDING.md (1,685 lines), and src/lib/portal-data.ts (399 lines), validated against web research on current SEC, FINRA, UCC Article 9, and industry best practices.*

Sources:
- [SEC Regulation A Guidance](https://www.sec.gov/resources-small-businesses/small-business-compliance-guides/regulation-guidance-issuers)
- [SEC Exempt Offerings](https://www.sec.gov/resources-small-businesses/exempt-offerings)
- [FINRA Private Placements](https://www.finra.org/rules-guidance/key-topics/private-placements)
- [FINRA Rule 5123](https://www.finra.org/rules-guidance/rulebooks/finra-rules/5123)
- [UCC Article 9 - Cornell Law](https://www.law.cornell.edu/ucc/9)
- [OCC Asset-Based Lending Handbook](https://www.occ.treas.gov/publications-and-resources/publications/comptrollers-handbook/files/asset-based-lending/pub-ch-asset-based-lending.pdf)
- [Reg D PPM Checklist 2025](https://ogscapital.com/article/reg-d-ppm-checklist-2025/)
- [Reg A+ Offering Timeline - Manhattan Street Capital](https://www.manhattanstreetcapital.com/faq/for-fundraisers/what-timeline-for-a-reg-a-offering)
- [Masterworks Disclosure](https://www.masterworks.com/about/disclosure)
- [Percent Private Credit](https://percent.com/)
- [Borro Luxury Asset Lending](https://borro.com/)
- [Diamond Banc FAQ](https://www.diamondbanc.com/frequently-asked-questions/)
- [SEC Comment Letter Process - PwC](https://viewpoint.pwc.com/dt/us/en/pwc/sec_comment_letters/comment_letter_trends_DM/The_comment_letter_process.html)
- [UCC Articles 9 and 12 - Lowenstein Sandler](https://www.lowenstein.com/news-insights/publications/articles/ucc-articles-9-and-12-a-modern-legal-framework-for-secured-transactions-and-digital-assets-citron-caporale-podolnyy)
- [NCUA Loan Participation Best Practices](https://ncua.gov/regulation-supervision/letters-credit-unions-other-guidance/evaluating-loan-participation-programs)
- [SEC 2026 Examination Priorities](https://www.sec.gov/newsroom/press-releases/2025-132-sec-division-examinations-announces-2026-priorities)
