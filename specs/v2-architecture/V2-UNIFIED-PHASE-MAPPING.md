# PleoChrome V2 — Unified Phase Mapping
# Every Value Creation Model Mapped to 6 Global Phases

> Date: 2026-03-30
> Source: Consolidated from Drive research (14 files) + Debt/Broker/Barter workflow spec
> Purpose: Single source of truth for what stages live under each phase per model

---

## Overview

Every asset in PleoChrome flows through **6 global phases** (the kanban columns). Within each phase, the **stages** differ based on the selected **value creation model**. The first 3 phases are largely shared. Phase 4 starts to diverge. Phases 5-6 are model-specific.

```
PHASE 1: LEAD ──────────── (shared across all models)
PHASE 2: INTAKE ─────────── (shared across all models)
PHASE 3: ASSET MATURITY ─── (shared across all models)
PHASE 4: SECURITY ──────── (diverges by model)
PHASE 5: VALUE CREATION ── (completely model-specific)
PHASE 6: DISTRIBUTION ──── (diverges by model)
```

**5 Value Creation Models:**
- **T** = Tokenization (ERC-3643 / Reg D 506(c))
- **F** = Fractional Securities (Reg D / Reg A+ / Reg CF)
- **D** = Debt Instrument (Asset-backed lending)
- **B** = Broker Sale (Traditional brokered sale)
- **X** = Barter/Exchange (Asset-for-asset trade)

---

## PHASE 1: LEAD
**Color:** Gray `#6B7280`
**Duration:** 1-3 weeks
**Purpose:** Source, qualify, and screen potential deals
**Shared across:** ALL models (identical stages)

### Stages

| # | Stage | Task Types | Gate |
|---|-------|------------|------|
| 1.1 | Initial Outreach & Source ID | action, action, action | — |
| 1.2 | Holder Qualification & Screening | upload (NDA), action (KYC/KYB), action (OFAC/SDN/PEP), review (sophistication) | — |
| 1.3 | Asset Screening & Preliminary Assessment | upload (existing docs), action (desktop valuation), review (risk assessment), action (financial capacity) | — |
| 1.4 | Internal Deal Committee Review | action (memo), approval (vote), action (communicate decision) | **GATE: Lead Qualification** |

**Gate Criteria:**
- [ ] KYC/KYB passed (no OFAC/SDN hits)
- [ ] Asset class confirmed eligible
- [ ] Preliminary valuation meets minimum threshold
- [ ] Deal committee approved
- [ ] Engagement agreement sent

**Key Documents:** NDA, KYC Report, OFAC Screening, PEP Screening, Deal Summary Memo

---

## PHASE 2: INTAKE
**Color:** Emerald `#1B6B4A`
**Duration:** 2-4 weeks
**Purpose:** Full asset profiling, holder onboarding, engagement execution
**Shared across:** ALL models (identical stages, slight variations by asset class)

### Stages

| # | Stage | Task Types | Gate |
|---|-------|------------|------|
| 2.1 | Asset Holder Intake Questionnaire | upload (completed questionnaire + supporting docs) | — |
| 2.2 | Full KYC/KYB Verification | action (identity verification), upload (beneficial ownership), approval (compliance sign-off) | — |
| 2.3 | OFAC/SDN & PEP Screening (Formal) | action (screening), upload (results documentation) | — |
| 2.4 | Provenance Review & Chain of Custody | review (provenance), upload (chain of custody docs), action (OECD conflict assessment) | — |
| 2.5 | Existing Documentation Review | review (inventory), action (gap analysis) | — |
| 2.6 | Engagement Agreement Execution | upload (agreement), approval (legal review), payment_incoming (retainer if applicable) | **GATE: Intake Complete** |

**Gate Criteria:**
- [ ] Identity fully verified
- [ ] Sanctions screening CLEAR
- [ ] PEP screening CLEAR
- [ ] Provenance documented (gaps identified)
- [ ] All existing docs inventoried
- [ ] Engagement agreement signed
- [ ] No disqualifying red flags

**Key Documents:** Intake Questionnaire, KYC Clearance Report, OFAC Results, PEP Results, Provenance Report, Engagement Agreement

**Intake Questionnaire Captures (per Drive research):**
- Asset holder name, entity type, contact info
- Asset description (type, quantity, estimated value)
- Current location/custody
- Provenance/chain of custody history
- Existing certifications (GIA, SSEF, assay, title)
- Existing appraisals
- Existing liens or encumbrances
- Import/export history
- Desired outcome (which value creation path)
- Timeline expectations

---

## PHASE 3: ASSET MATURITY
**Color:** Teal `#1A8B7A`
**Duration:** 4-10 weeks
**Purpose:** Certify, appraise, secure custody, insure
**Shared across:** ALL models (stages vary slightly by asset class but same structure)

### Stages

| # | Stage | Task Types | Gate |
|---|-------|------------|------|
| 3.1 | Certification | physical_action (lab submission), upload (lab reports) | — |
| 3.2 | Appraisal Panel Selection | meeting (appraiser engagement), upload (signed agreements), review (credential verification) | — |
| 3.3 | Sequential Appraisal Process | physical_action (transport to appraisers), upload (3 USPAP reports), action (chain of custody tracking) | — |
| 3.4 | Variance Analysis & Value Determination | review (variance calc), approval (value sign-off), upload (Variance Analysis Report) | — |
| 3.5 | Vault Selection & Custody Transfer | meeting (vault evaluation), physical_action (insured transport), upload (vault receipt, insurance cert) | — |
| 3.6 | Insurance Verification | action (policy verification), upload (specie insurance, transit insurance) | — |
| 3.7 | Vault API/Reporting Activation | action (API setup), review (data verification) | **GATE: Asset Maturity** |

**Gate Criteria:**
- [ ] All lab reports received and verified (GIA/SSEF for gems, LBMA assay for metals, title commitment for RE, reserve report for minerals)
- [ ] 3 independent appraisals completed (USPAP compliant)
- [ ] Variance ≤15-20% across appraisals
- [ ] Offering value documented and approved
- [ ] Asset in institutional vault with segregated storage
- [ ] Vault receipt in hand
- [ ] Insurance covers full appraised value
- [ ] API/reporting feed active (if applicable)

**Certification by Asset Class:**
| Asset Class | Primary Cert | Secondary Cert |
|-------------|-------------|----------------|
| Gemstone | GIA ID & Origin Report | SSEF Origin Determination |
| Precious Metal | LBMA Assay Report | Refiner Certificate |
| Real Estate | Title Commitment | Survey, Environmental Phase I |
| Mineral Rights | Title Opinion | Geological Survey, Reserve Report |

**Key Documents:** GIA/SSEF Reports, 3x Appraisal Reports, Variance Analysis, Vault Receipt, Custody Agreement, Insurance Certificates, Transit Insurance, Shipping Manifest

---

## PHASE 4: SECURITY
**Color:** Sapphire `#1E3A6E`
**Duration:** 2-6 weeks
**Purpose:** Legal structuring, regulatory filings, compliance preparation
**DIVERGES BY MODEL starting here**

### Stages — TOKENIZATION (T)

| # | Stage | Task Types | Gate |
|---|-------|------------|------|
| 4.T1 | Series SPV Formation | action (file series designation), upload (Series Operating Agreement, EIN) | — |
| 4.T2 | PPM Drafting (60-150 pages) | action (draft), review (legal review), upload (PPM, Sub Agreement, Token Purchase Agreement) | — |
| 4.T3 | Investor Questionnaire & Accreditation Forms | action (draft), review (legal review), upload (templates) | — |
| 4.T4 | Custody Agreement (SPV ↔ Vault) | action (negotiate), approval (legal sign-off), upload (executed agreement) | — |
| 4.T5 | MSB Classification Legal Opinion | action (engage counsel), upload (legal opinion), review (fund flow analysis) | — |
| 4.T6 | Form D Preparation | action (prepare EDGAR filing), review (legal review) | **GATE: Security (Token)** |

### Stages — FRACTIONAL SECURITIES (F)

| # | Stage | Task Types | Gate |
|---|-------|------------|------|
| 4.F1 | Regulatory Pathway Selection | review (Reg D vs Reg A+ vs Reg CF decision matrix), approval (counsel recommendation) | — |
| 4.F2 | Series SPV Formation & Unit Structuring | action (file series), action (define unit classes A/B/Preferred), upload (Series OA) | — |
| 4.F3 | Offering Document Preparation | action (draft PPM or Form 1-A or Form C), review (legal), upload (offering docs) | — |
| 4.F4 | Transfer Agent Engagement | meeting (TA evaluation), action (execute agreement), upload (TA agreement) | — |
| 4.F5 | Broker-Dealer Engagement | meeting (BD evaluation), action (execute BD agreement), upload (BD agreement, FINRA 5123) | — |
| 4.F6 | SEC Filing Preparation | action (prepare Form D / Form 1-A / Form C), review (legal review) | **GATE: Security (Fractional)** |

### Stages — DEBT INSTRUMENT (D)

| # | Stage | Task Types | Gate |
|---|-------|------------|------|
| 4.D1 | Business-Purpose vs Consumer-Purpose Determination | review (loan purpose analysis), upload (determination memo) | — |
| 4.D2 | UCC-1 Drafting & Pre-Filing Search | action (UCC search), action (draft UCC-1), upload (search results) | — |
| 4.D3 | Promissory Note Structuring | action (draft note), review (usury analysis per jurisdiction), upload (note draft) | — |
| 4.D4 | Security Agreement & Pledge Agreement | action (draft), review (legal), upload (Security Agreement, Pledge Agreement) | — |
| 4.D5 | Tripartite Custody Control Agreement | action (negotiate vault + borrower + lender), upload (executed CCA) | — |
| 4.D6 | State Lending License Analysis | review (license requirements by state), action (obtain license if needed) | — |
| 4.D7 | External Counsel Review | review (all docs), approval (compliance sign-off) | **GATE: Security (Debt)** |

### Stages — BROKER SALE (B)

| # | Stage | Task Types | Gate |
|---|-------|------------|------|
| 4.B1 | Broker/Dealer Selection | meeting (evaluate auction houses, dealers, RE brokers, mineral brokers), action (engage broker) | — |
| 4.B2 | Listing/Consignment Agreement | action (draft), review (legal), upload (executed agreement), review (commission structure) | — |
| 4.B3 | Reserve Price & Marketing Strategy | review (pricing strategy), approval (Shane sign-off), action (marketing plan) | — |
| 4.B4 | Seller Disclosure Preparation | action (prepare disclosures), upload (condition reports, inspection reports) | **GATE: Security (Broker)** |

### Stages — BARTER/EXCHANGE (X)

| # | Stage | Task Types | Gate |
|---|-------|------------|------|
| 4.X1 | 1031 Exchange Eligibility Determination | review (IRC 1031 analysis — real property only post-TCJA 2017), upload (tax counsel opinion) | — |
| 4.X2 | Qualified Intermediary Engagement (if 1031) | action (engage QI), upload (QI agreement), payment_outgoing (QI deposit) | — |
| 4.X3 | Counterparty Due Diligence | action (KYC on counterparty), action (appraise counterparty asset), upload (DD results) | — |
| 4.X4 | Exchange Agreement Drafting | action (draft), review (legal + tax counsel), upload (exchange agreement) | **GATE: Security (Barter)** |

---

## PHASE 5: VALUE CREATION
**Color:** Amethyst `#5B2D8E`
**Duration:** 2-12 weeks (varies greatly by model)
**Purpose:** Execute the chosen value creation strategy
**COMPLETELY MODEL-SPECIFIC**

### Stages — TOKENIZATION (T)

| # | Stage | Task Types | Gate |
|---|-------|------------|------|
| 5.T1 | Platform Configuration (Brickken/Zoniqx) | action (configure token params), action (set compliance rules), upload (configuration docs) | — |
| 5.T2 | Testnet Deployment & Testing | action (deploy to testnet), action (test mint/transfer/compliance/block), upload (test report) | — |
| 5.T3 | Chainlink Proof of Reserve Integration | action (BUILD application), action (deploy external adapter), action (connect PoR feed) | — |
| 5.T4 | Smart Contract Audit | action (engage auditor), upload (audit report), review (remediation), approval (audit pass) | — |
| 5.T5 | Mainnet Deployment | action (deploy to Polygon mainnet), review (param verification), approval (3-of-3 mint auth) | — |
| 5.T6 | File Form D with SEC (EDGAR) | filing (Form D), upload (confirmation, CIK number) | — |
| 5.T7 | Blue Sky State Notice Filings | filing (46 state notices), upload (tracking spreadsheet) | — |
| 5.T8 | Investor Verification Setup | action (set up accreditation verification flow), action (configure KYC for investors) | **GATE: Value Creation (Token)** |

### Stages — FRACTIONAL SECURITIES (F)

| # | Stage | Task Types | Gate |
|---|-------|------------|------|
| 5.F1 | SEC Filing & Qualification | filing (Form D / Form 1-A / Form C), upload (filing confirmation) | — |
| 5.F2 | Blue Sky Filings (if Reg D) | filing (state notices), upload (tracking spreadsheet) | — |
| 5.F3 | Investor Onboarding Infrastructure | action (KYC/AML flow), action (accreditation verification), action (e-signature), action (escrow setup) | — |
| 5.F4 | Investor Data Room Build | action (assemble PPM, GIA, appraisals, vault receipt, insurance, bios), upload (data room link) | — |
| 5.F5 | Marketing Material Preparation | action (pitch deck, one-pager, email templates), review (counsel compliance review), approval (BD approval) | — |
| 5.F6 | E2E Investor Onboarding Test | action (test full flow), upload (test report) | **GATE: Value Creation (Fractional)** |

### Stages — DEBT INSTRUMENT (D)

| # | Stage | Task Types | Gate |
|---|-------|------------|------|
| 5.D1 | Pre-Closing Verification | review (all docs complete), review (title/lien recheck), action (closing checklist) | — |
| 5.D2 | UCC-1 Filing | filing (UCC-1 with Secretary of State), upload (filing receipt) | — |
| 5.D3 | Loan Closing & Execution | meeting (closing meeting), upload (all executed docs), approval (compliance final sign-off) | — |
| 5.D4 | Fund Disbursement | payment_outgoing (wire to borrower), upload (wire confirmation), approval (internal wire approval) | — |
| 5.D5 | Post-Closing File Assembly | action (assemble closing binder), upload (closing binder) | — |
| 5.D6 | Loan Participation Notes (Optional) | action (structure note program if syndicating), filing (Reg D 506(c) if applicable), upload (Note PPM) | **GATE: Value Creation (Debt)** |

### Stages — BROKER SALE (B)

| # | Stage | Task Types | Gate |
|---|-------|------------|------|
| 5.B1 | Marketing Campaign Launch | action (list asset), action (distribute to buyer network), upload (marketing materials) | — |
| 5.B2 | Buyer Inquiry Management | action (qualify buyers), meeting (buyer presentations), action (track interest) | — |
| 5.B3 | Offer Negotiation | action (receive/evaluate offers), meeting (negotiation), review (counter-offer analysis) | — |
| 5.B4 | Purchase Agreement Execution | action (draft), review (legal), upload (executed purchase agreement), payment_incoming (earnest money) | **GATE: Value Creation (Broker)** |

### Stages — BARTER/EXCHANGE (X)

| # | Stage | Task Types | Gate |
|---|-------|------------|------|
| 5.X1 | Counterparty Asset Appraisal | physical_action (appraise received asset), upload (appraisal report) | — |
| 5.X2 | Exchange Value Equalization | review (value differential), action (cash boot calculation if needed), approval (both parties) | — |
| 5.X3 | Exchange Agreement Execution | upload (executed exchange agreement), approval (legal sign-off) | — |
| 5.X4 | 1031 Timeline Compliance (if applicable) | action (45-day ID deadline), action (180-day completion deadline), upload (QI documentation) | **GATE: Value Creation (Barter)** |

---

## PHASE 6: DISTRIBUTION
**Color:** Amber `#C47A1A`
**Duration:** Ongoing (months to years)
**Purpose:** Place with investors/buyers, manage ongoing obligations
**DIVERGES BY MODEL**

### Stages — TOKENIZATION (T)

| # | Stage | Task Types | Gate |
|---|-------|------------|------|
| 6.T1 | Investor Outreach (506(c) General Solicitation) | action (marketing campaign), meeting (investor presentations) | — |
| 6.T2 | Investor Processing (per investor) | action (KYC), action (accreditation verify), upload (subscription docs), payment_incoming (wire), action (token mint) | — |
| 6.T3 | First Close | approval (close authorization), action (Form D filing within 15 days), upload (investor welcome packages) | — |
| 6.T4 | Secondary Market Enablement | action (ATS listing — tZERO/Securitize/Rialto), action (configure trading rules) | — |
| 6.T5 | Ongoing Compliance | action (quarterly sanctions re-screen), action (quarterly vault verify), action (quarterly investor updates), action (annual reappraisal), filing (annual Form D amendment), filing (annual K-1s), action (Chainlink PoR maintenance) | **GATE: Distribution (Token)** |

### Stages — FRACTIONAL SECURITIES (F)

| # | Stage | Task Types | Gate |
|---|-------|------------|------|
| 6.F1 | Capital Raise & Subscription Processing | action (investor outreach), upload (subscription agreements per investor), payment_incoming (investments) | — |
| 6.F2 | Unit Issuance | action (issue fractional units via TA), upload (unit certificates/confirmations) | — |
| 6.F3 | Ongoing SEC Reporting | filing (Form 1-K annual for Reg A+), filing (Form 1-SA semi-annual), filing (Form C-AR annual for Reg CF) | — |
| 6.F4 | Secondary Market Trading | action (list on ATS), action (manage transfers via TA) | — |
| 6.F5 | Exit / Liquidation Event | action (asset sale), action (distribution waterfall), action (SPV dissolution), filing (Form 1-Z exit), upload (final K-1s) | **GATE: Distribution (Fractional)** |

### Stages — DEBT INSTRUMENT (D)

| # | Stage | Task Types | Gate |
|---|-------|------------|------|
| 6.D1 | Lender/Investor Matching & Note Sale | action (market participation notes if applicable), meeting (lender presentations), payment_incoming (note purchases) | — |
| 6.D2 | Monthly/Quarterly Loan Servicing | payment_incoming (borrower payments), action (payment processing), action (delinquency monitoring) | — |
| 6.D3 | Quarterly Collateral Verification | action (vault verification), action (PoR check), action (sanctions re-screen) | — |
| 6.D4 | Annual Reappraisal & LTV Recalculation | physical_action (reappraisal), review (LTV recalc), action (margin call if LTV breach) | — |
| 6.D5 | UCC Continuation Filing (every 5 years) | filing (UCC-3 continuation), upload (filing receipt) | — |
| 6.D6 | Default / Workout Procedures | action (default notice), meeting (workout negotiation), action (UCC 9-610 disposition if needed) | — |
| 6.D7 | Loan Maturity / Payoff | payment_incoming (payoff amount), filing (UCC-3 termination), physical_action (collateral release), upload (payoff statement) | — |
| 6.D8 | Tax Reporting | filing (Form 1098), filing (1099-INT), filing (K-1 if participation notes) | **GATE: Distribution (Debt)** |

### Stages — BROKER SALE (B)

| # | Stage | Task Types | Gate |
|---|-------|------------|------|
| 6.B1 | Closing & Title Transfer | meeting (closing), action (title transfer), physical_action (asset delivery), upload (bill of sale, transfer docs) | — |
| 6.B2 | Payment Collection | payment_incoming (sale proceeds), payment_outgoing (broker commission), action (escrow release) | — |
| 6.B3 | Post-Sale Documentation | upload (closing docs), action (insurance transfer), filing (tax reporting - Form 8949 / Schedule D) | **GATE: Distribution (Broker)** |

### Stages — BARTER/EXCHANGE (X)

| # | Stage | Task Types | Gate |
|---|-------|------------|------|
| 6.X1 | Simultaneous Asset Transfer | physical_action (deliver our asset), physical_action (receive their asset), upload (transfer docs both directions) | — |
| 6.X2 | Cash Boot Settlement (if applicable) | payment_incoming or payment_outgoing (equalizing payment), upload (wire confirmation) | — |
| 6.X3 | Post-Exchange Custody | action (vault received asset), upload (new vault receipt, insurance update) | — |
| 6.X4 | Tax Reporting | filing (Form 8824 for 1031), filing (Form 8949 for non-1031), upload (tax documentation) | **GATE: Distribution (Barter)** |

---

## STAGE COUNT SUMMARY

| Phase | Shared | T | F | D | B | X |
|-------|--------|---|---|---|---|---|
| 1. Lead | 4 | — | — | — | — | — |
| 2. Intake | 6 | — | — | — | — | — |
| 3. Asset Maturity | 7 | — | — | — | — | — |
| 4. Security | — | 6 | 6 | 7 | 4 | 4 |
| 5. Value Creation | — | 8 | 6 | 6 | 4 | 4 |
| 6. Distribution | — | 5 | 5 | 8 | 3 | 4 |
| **Total** | **17** | **19** | **17** | **21** | **11** | **12** |
| **Grand Total per model** | | **36** | **34** | **38** | **28** | **29** |

---

## TASK TYPE LEGEND

| Type | Icon | Description |
|------|------|-------------|
| action | clipboard | General work item |
| upload / document_upload | upload | File must be attached |
| meeting | calendar | Scheduled meeting required |
| physical_action | truck | Something done in the physical world (transport, vault, etc.) |
| payment_outgoing | arrow-up-right | Cost PleoChrome must pay |
| payment_incoming | arrow-down-left | Deposit/payment to receive |
| approval | shield-check | Requires one or more approvers |
| review | eye | Analysis/evaluation required |
| filing | file-text | Regulatory filing to submit |
| due_diligence | search | DD report to complete |
| automated | zap | Future automation hook |

---

## GATE SUMMARY

| Gate | Phase Transition | Key Criteria |
|------|-----------------|--------------|
| G1: Lead Qualification | Lead → Intake | KYC passed, asset eligible, committee approved |
| G2: Intake Complete | Intake → Asset Maturity | Identity verified, sanctions clear, engagement signed |
| G3: Asset Maturity | Asset Maturity → Security | Certified, appraised, in vault, insured |
| G4: Security Complete | Security → Value Creation | All legal docs executed, filings prepared, compliance sign-off |
| G5: Value Creation | Value Creation → Distribution | Tokens minted / Units issued / Loan funded / Listed / Exchange ready |
| G6: Distribution Complete | Distribution → Closed | All obligations met, reporting complete, exit/payoff done |
