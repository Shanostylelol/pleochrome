# PLEOCHROME TOKENIZATION VALUE CREATION PATH
# Exhaustive Step-by-Step Workflow Document

**Document Version:** 1.0
**Date:** March 27, 2026
**Classification:** Internal Strategy Document -- Confidential
**Scope:** Complete tokenization workflow from asset intake through ongoing management, including every legal gate, cost gate, timeline, dependency, revenue event, deliverable, and risk factor.

**Architecture:** ERC-3643 tokens on Polygon via Brickken | Chainlink Proof of Reserve | Reg D 506(c) | Accredited Investors Only | Institutional Vault Custody | Wyoming Series LLC SPV

---

## TABLE OF CONTENTS

1. [Phase 0: Foundation](#phase-0-foundation)
2. [Phase 1: Asset Intake and Screening](#phase-1-asset-intake-and-screening)
3. [Phase 2: Certification and Valuation](#phase-2-certification-and-valuation)
4. [Phase 3: Custody Transfer](#phase-3-custody-transfer)
5. [Phase 4: Legal Structuring](#phase-4-legal-structuring)
6. [Phase 5: Tokenization](#phase-5-tokenization)
7. [Phase 6: Regulatory Filings and Launch](#phase-6-regulatory-filings-and-launch)
8. [Phase 7: Distribution and Investor Onboarding](#phase-7-distribution-and-investor-onboarding)
9. [Phase 8: Ongoing Management and Compliance](#phase-8-ongoing-management-and-compliance)
10. [Complete Fee Structure and Revenue Model](#complete-fee-structure-and-revenue-model)
11. [All Regulatory Filing Requirements](#all-regulatory-filing-requirements)
12. [Smart Contract Audit Requirements](#smart-contract-audit-requirements)
13. [Transfer Agent Requirements](#transfer-agent-requirements)
14. [Broker-Dealer Requirements](#broker-dealer-requirements)
15. [Ongoing Compliance Obligations](#ongoing-compliance-obligations)
16. [Master Cost Summary](#master-cost-summary)

---

## PHASE 0: FOUNDATION
**Timeline:** Weeks 1-3 | **Must complete before processing any asset**

---

### Step 0.1: Form PleoChrome Holdings LLC (Wyoming Series LLC)

**Description:** Establish the parent legal entity as a Wyoming Series LLC. Each future tokenized asset will be a separate "series" under this parent, providing legal segregation of assets and liabilities between offerings without filing new entities for each deal.

**Who is involved:**
- **PleoChrome (Shane):** Files formation documents, obtains EIN, opens bank account
- **Wyoming Secretary of State:** Processes filing
- **Registered Agent:** Maintains Wyoming presence (Northwest Registered Agent, Wyoming Agents, etc.)
- **Securities Counsel:** Drafts Operating Agreement ($2,000-$5,000)

**Legal gates:**
- Articles of Organization must be filed at wyobiz.wyo.gov
- Operating Agreement must be drafted by securities counsel (governs member rights, capital contributions, management authority, departure/buyout, succession)
- EIN required from IRS before bank account can be opened
- Wyoming annual report due on anniversary month ($60/year minimum)

**Cost gates:**

| Item | Low | Mid | High |
|------|-----|-----|------|
| Wyoming filing fee | $100 | $100 | $100 |
| Registered agent (Year 1) | $25 | $75 | $200 |
| Operating Agreement (counsel) | $2,000 | $3,500 | $5,000 |
| EIN | $0 | $0 | $0 |
| Bank account | $0 | $0 | $0 |
| **Subtotal** | **$2,125** | **$3,675** | **$5,300** |

**Timeline:** 3-5 business days for filing; 1-2 weeks total with bank account setup.

**Dependencies:** None. This is the first step.

**Revenue for PleoChrome:** None directly. This step enables all future revenue.

**Deliverables/outputs:**
- Filed Articles of Organization
- EIN confirmation letter from IRS
- Active business bank account
- Executed Operating Agreement
- Registered agent confirmation

**Risk factors:**
- Skipping the Operating Agreement creates governance ambiguity and partner disputes later
- Without an entity, PleoChrome cannot sign contracts, collect fees, or operate legally
- Mercury bank account approval takes 1-3 days; fintech banks may require additional documentation

---

### Step 0.2: Engage Securities Counsel

**Description:** Find and retain a securities attorney who specializes in BOTH Reg D 506(c) AND digital asset/tokenized securities. This is the single most important engagement -- every subsequent legal document, filing, and compliance decision flows through counsel.

**Who is involved:**
- **PleoChrome (Shane + Chris):** Interview candidates, select firm, execute engagement letter
- **Securities Attorney:** Provides engagement letter and begins work

**Legal gates:**
- Attorney must have specific experience with tokenized securities (not just crypto, not just traditional private placements)
- Attorney must be licensed in the relevant jurisdiction
- Signed engagement letter required before any work begins

**Cost gates:**

| Attorney Tier | PPM + Full Package | Notes |
|---------------|-------------------|-------|
| Flat-fee boutique (ThePPMAttorney, PPMLawyers) | $5,000-$15,000 | Too generic for novel gemstone tokenization |
| Boutique tokenization specialist (Bull Blockchain Law) | $25,000-$60,000 | Demonstrated Brickken partnership |
| Boutique tokenization specialist (Dilendorf) | $30,000-$80,000 | Pioneer in RWA tokenization |
| Mid-tier specialist (LegalBison, Prokopiev) | $15,000-$40,000 | Cross-border RWA experience |
| BigLaw (Cooley, Latham & Watkins) | $75,000-$250,000+ | Maximum institutional credibility |
| **Recommended budget** | **$25,000-$75,000** | Bull Blockchain Law or Dilendorf |

**Timeline:** 1-2 weeks to identify, interview, and engage. PPM drafting begins immediately and takes 4-6 weeks -- this is the longest single dependency in the entire workflow.

**Dependencies:** Entity formed (Step 0.1) -- need entity to execute engagement letter.

**Revenue for PleoChrome:** None directly. Enables all revenue-generating activities.

**Deliverables/outputs:**
- Signed engagement letter with fee structure
- Attorney shortlist with credentials and quotes
- Kickoff meeting with counsel

**Risk factors:**
- Hiring a generalist who does not understand tokenization produces a weak PPM and misses critical issues (MSB classification, ERC-3643 compliance nuances)
- PPM drafting is the longest dependency (4-6 weeks) -- every week of delay here pushes the entire timeline
- If every firm quotes over $75K, boutique firms (Bull Blockchain Law, Dilendorf, LegalBison) are the fallback

---

### Step 0.3: Designate Compliance Officer

**Description:** Formally designate a member of the team as Compliance Officer via board resolution. This person is responsible for: AML/KYC program oversight, sanctions screening, regulatory filings, and SAR filing procedures. Regulators expect this designation from Day 1.

**Who is involved:**
- **PleoChrome (Shane):** Serves as interim Compliance Officer (standard practice for early-stage companies)
- **David:** Provides operational support for day-to-day compliance tasks

**Legal gates:**
- Board resolution documenting the designation
- Compliance Officer must understand BSA/AML obligations
- Must be in place before any partner engagement or investor onboarding

**Cost gates:** $0 (internal designation)

**Timeline:** 1 day

**Dependencies:** Entity formed (Step 0.1)

**Revenue for PleoChrome:** None directly. Required for partner trust and regulatory compliance.

**Deliverables/outputs:**
- Signed board resolution designating Compliance Officer
- Documentation of Compliance Officer responsibilities

**Risk factors:**
- Every partner (Brickken, vaults, broker-dealers) will ask "who is your Compliance Officer?" -- the answer must be definitive
- As CEO serving dual role, Shane must eventually transition this to a fractional CCO as the business scales

---

### Step 0.4: Draft AML/KYC Policy

**Description:** Create a written 5-page minimum AML/KYC policy document. This is the foundational compliance document that every partner, regulator, and institutional investor will request before engaging with PleoChrome.

**Who is involved:**
- **PleoChrome (Chris + Shane):** Draft the policy (Chris's legal background makes him the ideal drafter)
- **Securities Counsel:** Reviews and strengthens the policy ($1,500-$3,000 if counsel assists)

**Legal gates:**
- Must comply with Bank Secrecy Act (BSA) requirements
- Must include: Customer Due Diligence (CDD) procedures, sanctions screening process, SAR filing process, training requirements, record retention policy
- Must be in place before first asset engagement or partner onboarding

**Cost gates:**

| Approach | Cost |
|----------|------|
| Self-drafted using BSA/AML templates | $0 |
| Counsel-assisted drafting | $1,500-$3,000 |

**Timeline:** 1 week

**Dependencies:** Compliance Officer designated (Step 0.3)

**Revenue for PleoChrome:** None directly. Gate for all partner relationships.

**Deliverables/outputs:**
- Written AML/KYC Policy (minimum 5 pages)
- CDD procedures documented
- Sanctions screening procedures documented
- SAR filing procedures documented
- Training requirements documented
- Record retention policy documented

**Risk factors:**
- Without this document, Brickken, vault partners, broker-dealers, and institutional investors will not engage
- Policy must be a living document -- updated as regulations change and as the business scales

---

### Step 0.5: Obtain Business Insurance

**Description:** Secure Directors & Officers (D&O), Errors & Omissions (E&O), Cyber Liability, General Liability, and Crime/Fidelity bond insurance coverage. Fintech/crypto companies face higher premiums (2-3x standard rates).

**Who is involved:**
- **PleoChrome (David):** Requests quotes from specialized brokers
- **PleoChrome (Shane):** Compares proposals and binds coverage
- **Insurance Brokers:** Founder Shield, Vouch, Embroker (fintech-specialized)

**Legal gates:**
- Cannot sign engagement agreements with partners without active insurance
- D&O coverage required before officers sign contracts on behalf of the entity
- E&O coverage required before providing advisory/orchestration services

**Cost gates:**

| Coverage Type | Annual Low | Annual Mid | Annual High |
|---------------|-----------|-----------|------------|
| D&O Insurance | $5,000 | $10,000 | $15,000 |
| E&O Insurance | $3,000 | $6,500 | $10,000 |
| Cyber Liability | $5,000 | $10,000 | $15,000 |
| General Liability | $1,000 | $2,000 | $3,000 |
| Crime/Fidelity Bond | $1,000 | $2,000 | $3,000 |
| **Total Annual** | **$15,000** | **$30,500** | **$46,000** |

**Timeline:** 1-2 weeks for quotes; 2-4 weeks for underwriting (fintech underwriting takes longer); bind by Week 4.

**Dependencies:** Entity formed (Step 0.1)

**Revenue for PleoChrome:** None directly. Required operational infrastructure.

**Deliverables/outputs:**
- Active D&O policy
- Active E&O policy
- Active Cyber Liability policy
- Active General Liability policy
- Active Crime/Fidelity bond
- Certificate of Insurance for partner engagements

**Risk factors:**
- Crypto/fintech premiums are 2-3x higher than standard business insurance
- Underwriters will scrutinize the tokenization business model -- be transparent about the structure
- D&O alone may run $7,500-$15,000/year for a $1M limit

---

### Step 0.6: Resolve Asset-Specific Blockers (First Asset Only)

**Description:** For the first asset (the ~$10-18M barrel of emeralds at Olympic Vault, Tacoma, WA), two specific blockers must be resolved: (a) the provenance/legal opinion on the asset holder's background and ownership chain, and (b) the $62,000 unpaid vault bill.

**Who is involved:**
- **Securities Counsel:** Runs comprehensive background check (PACER federal court records, state courts, OFAC, FinCEN, all 50-state criminal records), provides legal opinion letter on provenance
- **PleoChrome (Shane):** Contacts Olympic Vault for exact account balance, negotiates vault bill resolution with asset holder
- **Asset Holder:** Pays the outstanding vault bill ($62,000)

**Legal gates:**
- Securities counsel must provide a written legal opinion on whether the provenance chain is clean enough for a Reg D 506(c) offering
- Must determine if federal restitution obligations ($831K+) have been satisfied and if DOJ has a lien on the emeralds
- Must verify the 2019 Pierce County default judgment is final and uncontested
- Must determine current legal status of White Oak Partners II LLC
- Vault bill must be resolved with written confirmation before stones can be accessed, moved, or appraised

**Cost gates:**

| Item | Low | Mid | High |
|------|-----|-----|------|
| Background check + legal opinion (provenance) | $2,000 | $5,000 | $10,000 |
| Vault bill resolution | $62,000 | $62,000 | $62,000 |
| **Subtotal** | **$64,000** | **$67,000** | **$72,000** |

Note: The $62K vault bill is the asset holder's responsibility, NOT PleoChrome's. If PleoChrome advances the cost, it must be structured as a documented loan with repayment from offering proceeds.

**Timeline:** 2-3 weeks for legal opinion; 1-2 weeks for vault bill resolution.

**Dependencies:** Securities counsel engaged (Step 0.2)

**Revenue for PleoChrome:** None directly. This is a go/no-go gate for the first asset.

**Deliverables/outputs:**
- Written legal opinion letter on provenance and viability
- Comprehensive background report
- Written confirmation from Olympic Vault that account is current
- Decision: PROCEED, DISCLOSE AND PROCEED, or WALK AWAY

**Risk factors:**
- **R1 (HIGH/CRITICAL):** Provenance poisons the offering -- investors discover the convicted felon connection and walk away
- **R2 (MEDIUM/CRITICAL):** Disputed ownership -- someone challenges the 2019 default judgment
- **R3 (MEDIUM-HIGH/CRITICAL):** Federal restitution lien -- DOJ may have a lien on the emeralds, making tokenization impossible
- If counsel says "walk away," PleoChrome needs a different first asset. The pipeline has $1.5B in interested assets, but a pivot delays the timeline by 4-6 weeks

---

### GATE 0 CHECK: Foundation Complete?

All of the following must be YES before proceeding to Phase 1:

- [ ] PleoChrome Holdings LLC formed with EIN, bank account, and Operating Agreement?
- [ ] Securities counsel engaged with signed engagement letter?
- [ ] Compliance Officer designated?
- [ ] AML/KYC policy drafted?
- [ ] Insurance bound (D&O, E&O, Cyber, GL at minimum)?
- [ ] Legal opinion on asset provenance received and decision made?
- [ ] Vault bill resolved with written confirmation?
- [ ] Internal systems set up (Google Drive, calendars, trackers)?

**IF ANY ANSWER IS NO -- STOP. DO NOT PROCEED TO PHASE 1.**

---

## PHASE 1: ASSET INTAKE AND SCREENING
**Timeline:** Weeks 3-5 | **Begins after Gate 0 is passed**

---

### Step 1.1: Asset Holder Completes Intake Questionnaire

**Description:** The asset holder completes a comprehensive intake questionnaire providing all information about the gemstone asset, their identity, how they acquired it, existing certifications, photos, and supporting documentation.

**Who is involved:**
- **Asset Holder:** Completes the questionnaire and provides all attachments
- **PleoChrome (David):** Reviews completeness, follows up on gaps

**Legal gates:**
- Gate 0 must be passed
- Questionnaire must collect sufficient information for KYC/KYB, provenance review, and initial due diligence

**Cost gates:** $0

**Timeline:** 1 week (asset holder turnaround)

**Dependencies:** Gate 0 passed

**Revenue for PleoChrome:** None at this step.

**Deliverables/outputs:**
- Completed intake questionnaire
- Supporting documentation (certifications, purchase receipts, insurance records, photos/video)
- Initial asset profile

**Risk factors:**
- Asset holder may resist detailed provenance questions -- PleoChrome must stand firm
- Incomplete questionnaires create downstream delays in appraisal, legal structuring, and PPM drafting
- For a barrel of multiple stones: must understand how many stones, quality range, loose vs. mounted, breakdown of value

---

### Step 1.2: KYC/KYB Verification on Asset Holder

**Description:** Verify the identity of the asset holder (individual or entity). For individuals: government ID + liveness check. For entities: formation documents + identify all beneficial owners >25%.

**Who is involved:**
- **PleoChrome (David):** Executes verification process
- **KYC Provider:** Brickken built-in KYC (150 included in plan), or Veriff ($0.80/check), or Didit (free)

**Legal gates:**
- Must comply with PleoChrome's AML/KYC policy
- For entities: must identify ALL beneficial owners >25% (CDD Rule requirement)
- Enhanced due diligence required for higher-risk asset holders
- Results must be documented and retained for at least 5 years

**Cost gates:** $0.80-$3.50 per check (Brickken built-in or third-party)

**Timeline:** 3-5 days

**Dependencies:** Intake questionnaire received (Step 1.1)

**Revenue for PleoChrome:** None at this step.

**Deliverables/outputs:**
- KYC clearance report
- Identity verification documentation
- Beneficial ownership identification (for entities)

**Risk factors:**
- Failure to pass KYC is a hard stop -- cannot proceed
- For complex entity structures, beneficial ownership identification can take additional time
- Enhanced due diligence may be required for certain jurisdictions or risk profiles

---

### Step 1.3: OFAC/SDN and PEP Screening

**Description:** Screen the asset holder and ALL associated persons against OFAC SDN (Specially Designated Nationals) list, EU/UN sanctions lists, and for PEP (Politically Exposed Person) status.

**Who is involved:**
- **PleoChrome (David):** Executes screening
- **OFAC:** Free screening at sanctionssearch.ofac.treas.gov
- **OpenSanctions:** Free EU/UN screening at opensanctions.org

**Legal gates:**
- Must screen every person associated with the asset, not just the primary contact
- Must screen ALL beneficial owners of entity asset holders
- Must document results even if "no results found"
- A positive match on OFAC = IMMEDIATE STOP. Cannot proceed under any circumstances
- PEP status does not automatically disqualify but requires enhanced due diligence

**Cost gates:** $0-$50 (OFAC is free; paid PEP services optional)

**Timeline:** 30 minutes per person

**Dependencies:** KYC complete (Step 1.2)

**Revenue for PleoChrome:** None at this step.

**Deliverables/outputs:**
- OFAC/SDN screening results (documented)
- EU/UN sanctions screening results (documented)
- PEP screening results (documented)
- Screening date and methodology recorded

**Risk factors:**
- A sanctions hit means immediate termination of the engagement
- PEP status requires enhanced ongoing monitoring
- Name variations and transliterations can cause false positives -- document resolution of any partial matches

---

### Step 1.4: Provenance Review and Chain of Custody

**Description:** Trace the complete chain of custody for the gemstone asset from mine to current vault. This is the "CARFAX for gemstones" -- every hand the stones have passed through must be documented. Any gap is a red flag.

**Who is involved:**
- **PleoChrome (David + Chris):** Conduct the provenance review
- **Securities Counsel:** Assists with legal analysis if provenance is complex ($0-$2,000)
- **Asset Holder:** Provides provenance documentation

**Legal gates:**
- Must determine: where stones were mined (country, mine name), every prior owner, import/export documentation, conflict zone assessment (OECD Due Diligence Guidance)
- Any gaps in the chain of custody must be documented and assessed for materiality
- Provenance issues must be disclosed in the PPM risk factors

**Cost gates:** $0-$2,000 (if counsel assists with complex provenance analysis)

**Timeline:** 1-2 weeks

**Dependencies:** Intake questionnaire received (Step 1.1)

**Revenue for PleoChrome:** None at this step.

**Deliverables/outputs:**
- Provenance report documenting complete chain of custody
- Gap analysis identifying any undocumented periods
- Risk assessment of provenance quality
- OECD conflict mineral assessment (if applicable)

**Risk factors:**
- Murky provenance can kill an offering -- investors, broker-dealers, and vaults will all scrutinize this
- For the first asset specifically: the White Oak Partners II LLC history requires extraordinary documentation
- International provenance (mining origin) may require additional verification steps

---

### Step 1.5: Review Existing Documentation

**Description:** Catalog and verify all existing documentation the asset holder possesses: GIA reports, previous appraisals, purchase receipts, insurance records, photos/video.

**Who is involved:**
- **PleoChrome (David):** Reviews and catalogs documentation
- **GIA:** Verification of existing reports at gia.edu/report-check-landing (free)

**Legal gates:**
- All existing GIA reports must be verified online -- never accept at face value
- Previous appraisals must be assessed for USPAP compliance and relevance
- Purchase receipts and insurance records provide supporting evidence for provenance and valuation

**Cost gates:** $0

**Timeline:** 3-5 days

**Dependencies:** Intake questionnaire received (Step 1.1)

**Revenue for PleoChrome:** None at this step.

**Deliverables/outputs:**
- Documentation inventory with verification status
- Assessment of existing documentation quality and gaps
- List of additional documentation needed

**Risk factors:**
- Existing appraisals may be worthless (the Heritage Jewelry 2023 appraisal for the first asset scored 58/100 -- effectively unusable)
- Fabricated GIA reports exist in the market -- online verification is mandatory
- Insurance records may reveal prior claims or losses that affect provenance

---

### Step 1.6: Execute Engagement Agreement

**Description:** Securities counsel drafts and both parties execute the formal engagement agreement between PleoChrome and the asset holder. This is THE contract governing the entire relationship.

**Who is involved:**
- **Securities Counsel:** Drafts the agreement
- **PleoChrome (Shane):** Reviews and executes
- **Asset Holder:** Reviews and executes
- Both parties sign electronically

**Legal gates:**
- Must define PleoChrome's fee structure: 2% setup fee, 1.5% success fee, 0.75% annual admin fee
- Must define asset holder's obligations: provide documentation, pay pass-through costs, cooperate with appraisals
- Must define timeline expectations, gate conditions, and termination provisions
- Must specify that funds flow through the SPV (not PleoChrome directly)

**Cost gates:** $2,000-$5,000 (counsel drafting fee)

**Timeline:** 1 week

**Dependencies:** All Steps 1.1-1.5 complete; KYC/sanctions clear; no red flags identified

**Revenue for PleoChrome:** The engagement agreement establishes the fee structure that will generate all future revenue from this asset. The 2% setup fee on a $9.65M offering = $193,000.

**Deliverables/outputs:**
- Signed engagement agreement
- Fee structure documented
- Timeline and gate conditions documented
- Termination provisions documented

**Risk factors:**
- Signing without counsel review exposes PleoChrome to unfavorable terms
- Asset holder may push back on fee structure -- 2% setup + 1.5% success + 0.75% annual is market-competitive for this asset class
- Termination provisions must be fair but protect PleoChrome's investment of time and capital

---

### GATE 1 CHECK: Can We Proceed to Valuation?

- [ ] Asset holder identity verified?
- [ ] Sanctions screening CLEAR?
- [ ] PEP screening CLEAR?
- [ ] Provenance documented (at least initial review)?
- [ ] Existing documentation reviewed and verified?
- [ ] Engagement agreement signed by both parties?
- [ ] No red flags identified (or all red flags formally addressed)?

**IF ANY ANSWER IS NO -- STOP. DO NOT PROCEED.**

---

## PHASE 2: CERTIFICATION AND VALUATION
**Timeline:** Weeks 5-10 | **Longest single phase due to sequential appraisal process**

---

### Step 2.1: GIA Laboratory Certification

**Description:** Submit all significant stones to GIA (Gemological Institute of America) for Identification & Origin Reports. GIA is the global standard -- these reports serve as the "official ID card" for each stone with exact specifications.

**Who is involved:**
- **PleoChrome (David):** Coordinates submission and logistics
- **GIA Laboratory:** Grades each stone (Carlsbad: carlsbadlab@gia.edu or New York: newyorklab@gia.edu)
- **Insured Carrier:** Transports stones to/from GIA

**Legal gates:**
- Each significant stone in the barrel needs its own GIA report
- Reports must be Identification & Origin Reports (not just identification)
- Express service available at 100% surcharge for urgent timelines

**Cost gates (GIA 2026 Fee Schedule for Emeralds):**

| Weight Range | Fee per Stone |
|-------------|---------------|
| 0.01-1.99 ct | $90 |
| 2.00-3.99 ct | $120 |
| 4.00-5.99 ct | $150 |
| 6.00-7.99 ct | $210 |
| 8.00-9.99 ct | $275 |
| 10.00-19.99 ct | $394 |
| 20.00-29.99 ct | $499 |
| 30.00-39.99 ct | $614 |
| 40.00-49.99 ct | $730 |
| 50+ ct | $840 |
| Emerald Clarity Enhancement Filler ID (add-on) | $50/stone |
| Express Service surcharge | +100% |
| Layout discount | $25 off per stone after first |

**For a barrel of 50-200 stones: $5,000-$50,000+ depending on count and sizes.**

**Timeline:** 4-6 weeks (standard); 48-72 hours (express at 100% surcharge)

**Dependencies:** Gate 1 passed; vault bill resolved (stones must be accessible)

**Revenue for PleoChrome:** None at this step. These are pass-through costs billed to the asset holder or funded from the offering.

**Deliverables/outputs:**
- GIA Identification & Origin Report for each significant stone
- Online verification confirmation for each report (gia.edu/report-check-landing)

**Risk factors:**
- GIA may determine origin is "Inconclusive" -- this significantly impacts value for Colombian emeralds where origin commands a premium
- Treatment discovery (heavy oil treatment, resin filling) can dramatically reduce value
- Express service doubles the cost but may be necessary to compress the timeline

---

### Step 2.2: SSEF Origin Determination (If Needed)

**Description:** For high-value colored stones where geographic origin significantly impacts value (Colombian emeralds command premium pricing), submit key stones to SSEF (Swiss Gemmological Institute) for spectroscopic origin determination.

**Who is involved:**
- **PleoChrome (David):** Coordinates submission
- **SSEF Laboratory:** Performs spectroscopic analysis (ssef.ch)

**Legal gates:**
- Not legally required but critical for accurate valuation of origin-dependent stones
- SSEF reports serve as independent confirmation of geographic origin claims

**Cost gates:**

| Service | Cost per Stone |
|---------|---------------|
| Standard origin determination | CHF 330-4,200 ($370-$4,700) depending on stone size |
| Express service (3 business days) | +50% surcharge |
| **Budget for key stones (5-10)** | **$2,000-$25,000** |

**Timeline:** 2 weeks (standard); 3 business days (express at 50% surcharge)

**Dependencies:** GIA reports received (Step 2.1)

**Revenue for PleoChrome:** None at this step.

**Deliverables/outputs:**
- SSEF Origin Determination Report for each submitted stone
- Spectroscopic analysis data

**Risk factors:**
- Origin determination may contradict asset holder claims, reducing offering value
- Not all stones may have determinable origin
- Cost can escalate quickly if many stones require SSEF analysis

---

### Step 2.3: Build Approved Appraiser Panel

**Description:** Identify, interview, and contract 3 independent gemological appraisers who will each independently value the collection. All 3 must be credentialed, USPAP-current, emerald-specialist, and have zero affiliation with each other, the asset holder, PleoChrome, or any vault partner.

**Who is involved:**
- **PleoChrome (David + Chris):** Interview candidates using 12-question checklist
- **ASA Directory** (appraisers.org), **AGS Directory** (americangemsociety.org), **NAJA Directory** (najaappraisers.com): Appraiser sourcing

**Legal gates:**
- Each appraiser must hold CGA (Certified Gemologist Appraiser) or MGA (Master Gemologist Appraiser) credential
- Each must be USPAP-current (Uniform Standards of Professional Appraisal Practice)
- Fee structure must be hourly or flat -- USPAP prohibits percentage-of-value fees
- Each must carry professional liability (E&O) insurance
- Must confirm ZERO affiliation with asset holder, PleoChrome, vault partner, or other appraisers
- Must confirm no disciplinary actions from any gemological association

**Cost gates:** $0 for selection process (appraiser fees in next step)

**Timeline:** 2 weeks (can run parallel with GIA submission)

**Dependencies:** None (can begin during Phase 2 in parallel)

**Revenue for PleoChrome:** None at this step.

**Deliverables/outputs:**
- 3 signed appraiser engagement agreements
- Verified credentials for each appraiser
- Independence confirmations
- 12-question interview notes for each candidate

**Risk factors:**
- Finding 3 independent appraisers with specific emerald barrel expertise may be challenging
- Appraisers with USPAP prohibition on percentage fees may quote higher flat fees for large collections
- Independence verification is critical -- any perceived affiliation undermines the entire valuation

---

### Step 2.4: Sequential 3-Appraisal Process

**Description:** Run the 3-Appraisal Rule: each appraiser physically inspects the collection and produces an independent USPAP-compliant written report. Appraisals are sequential (Appraiser 1 -> ship to Appraiser 2 -> ship to Appraiser 3) with each working independently, not knowing the others' findings.

**Who is involved:**
- **Appraiser 1, 2, 3:** Each produces independent USPAP-compliant report
- **PleoChrome (David):** Coordinates shipping between appraisers
- **Insured Carrier:** Brink's or Malca-Amit transit services

**Legal gates:**
- Each appraisal must be a formal USPAP-compliant written report
- Each must value the collection as a whole AND key individual pieces
- Each report must include: intended use, effective date, type of value, methodology, comparable sales data, certification statement
- Appraisers must work independently with no knowledge of each other's findings

**Cost gates:**

| Item | Low | Mid | High |
|------|-----|-----|------|
| Appraiser 1 fee | $3,000 | $6,500 | $10,000 |
| Transit insurance (Appraiser 1 -> 2) | $2,000 | $3,500 | $5,000 |
| Appraiser 2 fee | $3,000 | $6,500 | $10,000 |
| Transit insurance (Appraiser 2 -> 3) | $2,000 | $3,500 | $5,000 |
| Appraiser 3 fee | $3,000 | $6,500 | $10,000 |
| **Total appraisal phase** | **$13,000** | **$26,500** | **$40,000** |

**Timeline:** 5-10 business days per appraiser + transit time. Total: 3-5 weeks sequential.

**Dependencies:** GIA reports received and verified (Step 2.1); appraiser panel built (Step 2.3)

**Revenue for PleoChrome:** None at this step.

**Deliverables/outputs:**
- 3 independent USPAP-compliant written appraisal reports
- Transit insurance policies for each shipping leg
- Shipping manifests and chain of custody documentation

**Risk factors:**
- **R4 (MEDIUM/HIGH):** Appraisals reveal stones are lower quality than represented, significantly reducing offering value
- **R5 (MEDIUM/HIGH):** Appraisal variance too wide (>20%), undermining confidence in valuation -- may need a 4th tiebreaker appraisal
- Transit damage or loss (mitigated by insurance but causes significant delay)
- Sequential process creates a long critical path -- no way to compress without compromising independence

---

### Step 2.5: Variance Analysis and Offering Value Determination

**Description:** Collect all 3 appraisal reports, calculate variance, and determine the conservative offering value by averaging the two lowest appraisals.

**Who is involved:**
- **PleoChrome (David + Shane):** Performs variance analysis
- **Securities Counsel:** Reviews methodology for PPM disclosure

**Legal gates:**
- If any two appraisals differ by more than 15-20%, flag for review and potentially commission a 4th tiebreaker appraisal
- The offering value must be documented in a formal Variance Analysis Report
- This value becomes the total offering amount in the PPM

**Cost gates:** $0 (internal analysis)

**Timeline:** 2-3 days

**Dependencies:** All 3 appraisals received (Step 2.4)

**Revenue for PleoChrome:** This step determines the base for all PleoChrome fees. Example: Appraisals at $9.5M, $10.2M, $9.8M -> Offering value = ($9.5M + $9.8M) / 2 = $9.65M. PleoChrome's 2% setup fee = $193,000.

**Deliverables/outputs:**
- Variance Analysis Report
- Final offering value determination (documented)
- Token pricing calculation (offering value / token price = total supply)

**Risk factors:**
- Asset holder may be disappointed if the offering value is significantly below their expectation -- manage expectations early
- Wide variance may indicate disagreement about the asset's market, requiring additional expert consultation
- The offering value directly determines PleoChrome's revenue potential

---

### GATE 2 CHECK: Verification Complete?

- [ ] All lab reports received and verified?
- [ ] SSEF origin determination complete (if applicable)?
- [ ] All 3 independent USPAP-compliant appraisals received?
- [ ] Variance within acceptable range (<15-20%)?
- [ ] Offering value determined and formally documented?

---

## PHASE 3: CUSTODY TRANSFER
**Timeline:** Weeks 8-11 (overlaps with Phase 2)

---

### Step 3.1: Evaluate and Select Vault Partner

**Description:** Compare the current storage facility against institutional-grade alternatives (Brink's, Malca-Amit) and select the vault that will provide permanent custody during the offering period and beyond.

**Who is involved:**
- **PleoChrome (Shane + David):** Request proposals, evaluate, and select
- **Vault Partners:** Brink's (us.brinks.com/precious-metals), Malca-Amit (malca-amit.com)
- **Securities Counsel:** Reviews custody agreement terms

**Legal gates:**
- Vault must provide segregated storage (not commingled with other clients' assets)
- Insurance must cover the full appraised value
- Vault must have API or reporting feed capability (required for Chainlink PoR integration)
- Free Trade Zone (FTZ) availability preferred (duty-free storage, offered by Malca-Amit)
- Vault must be in good financial standing (the $62K unpaid bill at Olympic Vault raises concerns about institutional adequacy)

**Cost gates:**

| Provider | Annual Custody Cost (est.) | Notes |
|----------|--------------------------|-------|
| Brink's | 0.5%-1.0% of stored value ($50,000-$100,000/yr for $10M) | Global reputation, institutional-grade |
| Malca-Amit | Similar range, potentially lower in FTZ | FTZ option = duty-free |
| Olympic Vault (existing) | Unknown | Non-institutional, may lack required features |

**Timeline:** 1-2 weeks for proposals; 1 week for selection and agreement execution

**Dependencies:** Phase 1 complete; vault bill resolved (if staying at current facility)

**Revenue for PleoChrome:** None at this step. Custody costs are ongoing expenses passed through or funded from offering proceeds.

**Deliverables/outputs:**
- Vault comparison matrix
- Signed custody agreement
- Insurance verification letter
- API/reporting feed specifications

**Risk factors:**
- **R15 (MEDIUM/LOW):** Current vault may not meet institutional standards, requiring costly transfer
- Vault financial instability could put the asset at risk
- API limitations may prevent automated Chainlink PoR integration, requiring manual verification fallback

---

### Step 3.2: Arrange Insured Transport and Vault Intake

**Description:** If stones must move from the current location (or from the last appraiser) to the selected institutional vault, arrange insured armored transport. Upon arrival, the vault verifies stones against GIA reports and issues a Custody Acknowledgment.

**Who is involved:**
- **PleoChrome (David):** Coordinates transport logistics
- **Insured Carrier:** Brink's or Malca-Amit transit services
- **Vault Partner:** Receives, verifies, and issues custody receipt

**Legal gates:**
- Inland marine insurance required for transit
- Chain of custody must be documented at every handoff
- Vault must verify stones against GIA reports upon receipt
- Vault must issue segregated storage confirmation

**Cost gates:**

| Item | Low | Mid | High |
|------|-----|-----|------|
| Transit insurance (0.08% of value for inland marine) | $2,000 | $8,000 | $15,000 |
| Shipping/armored carrier | $2,000 | $5,000 | $10,000 |
| **Total transit** | **$4,000** | **$13,000** | **$25,000** |

**Timeline:** 1-2 weeks for transport arrangement; 1-3 days for vault verification upon receipt

**Dependencies:** Vault selected (Step 3.1); last appraisal complete (Step 2.4)

**Revenue for PleoChrome:** None at this step.

**Deliverables/outputs:**
- Transit insurance policy
- Shipping manifest with chain of custody documentation
- Vault Receipt / Custody Acknowledgment
- Segregated storage confirmation
- Insurance verification letter confirming coverage of full appraised value

**Risk factors:**
- Transit damage or loss (mitigated by insurance but causes major delay)
- Vault may identify discrepancies between stones received and GIA reports
- If vault insurance is insufficient for full appraised value, supplemental specie coverage must be obtained

---

### Step 3.3: Activate Vault API/Reporting Feed

**Description:** Establish the data connection between the vault's reporting system and PleoChrome's infrastructure. This feed is required for Chainlink Proof of Reserve integration and ongoing custody verification.

**Who is involved:**
- **PleoChrome (David + Shane):** Configure API integration
- **Vault Partner:** Provides API access and documentation

**Legal gates:**
- Data feed must accurately report custody status and asset details
- Must support real-time or near-real-time reporting for Chainlink PoR

**Cost gates:** Varies by vault (typically included in custody agreement or nominal additional fee)

**Timeline:** 1-2 weeks

**Dependencies:** Vault receipt issued (Step 3.2)

**Revenue for PleoChrome:** None at this step. Enables the Chainlink PoR differentiator.

**Deliverables/outputs:**
- Active API/reporting feed
- Feed documentation and credentials
- Initial verification that feed correctly reports custody status

**Risk factors:**
- **R8 (MEDIUM/MEDIUM):** If vault does not have API capability, a manual verification process is needed (vault issues monthly custody confirmations, PleoChrome publishes on-chain manually)
- API reliability issues can disrupt Chainlink PoR feed accuracy

---

### GATE 3 CHECK: Custody Complete?

- [ ] Stones in institutional-grade vault with segregated storage?
- [ ] Vault Receipt / Custody Acknowledgment in hand?
- [ ] Vault insurance covers full appraised value (confirmed in writing)?
- [ ] API/reporting feed active (or manual verification process established)?

---

## PHASE 4: LEGAL STRUCTURING
**Timeline:** Weeks 4-10 (runs in parallel with Phases 2-3)

---

### Step 4.1: Create Series A SPV Under PleoChrome Holdings LLC

**Description:** Create a new "series" under the Wyoming Series LLC specifically to hold the emerald barrel asset. This series has its own assets, liabilities, members, EIN, and bank account -- legally segregated from all other PleoChrome series.

**Who is involved:**
- **Securities Counsel:** Drafts Series A Operating Agreement
- **PleoChrome (Shane):** Files series designation, obtains EIN, opens bank account

**Legal gates:**
- Series Operating Agreement must define token holder rights (economic rights, voting rights, distribution rights)
- Series must have its own EIN and bank account
- Wyoming Series LLC costs $10 per additional series
- Token holders have rights IN THIS SERIES -- not in the parent LLC

**Cost gates:**

| Item | Low | Mid | High |
|------|-----|-----|------|
| Series A Operating Agreement (counsel) | $1,000 | $2,000 | $3,000 |
| Wyoming series filing | $10 | $10 | $10 |
| EIN | $0 | $0 | $0 |
| Bank account | $0 | $0 | $0 |
| **Subtotal** | **$1,010** | **$2,010** | **$3,010** |

**Timeline:** 1-2 weeks

**Dependencies:** Master LLC formed (Step 0.1); securities counsel engaged (Step 0.2)

**Revenue for PleoChrome:** None at this step. Creates the legal vehicle for all revenue collection.

**Deliverables/outputs:**
- Series A Operating Agreement
- Series A EIN
- Series A bank account
- Series designation filed with Wyoming SOS

**Risk factors:**
- Operating Agreement must precisely define the relationship between token ownership and legal rights in the SPV
- Imprecise drafting creates ambiguity that can be exploited in disputes

---

### Step 4.2: Draft Private Placement Memorandum (PPM)

**Description:** Securities attorney drafts the primary disclosure document -- the PPM -- which is the core legal protection for the offering and the primary document investors review before subscribing.

**Who is involved:**
- **Securities Counsel:** Primary drafter (60-150 pages)
- **Tax Counsel:** Reviews tax sections (may be same firm or separate)
- **PleoChrome (Shane + Chris):** Reviews for factual accuracy, provides management bios, business description
- **Broker-Dealer (if engaged):** Files with FINRA within 15 calendar days of first sale

**Legal gates:**
- PPM must contain all 17 standard sections (see SEC Compliance Research document for full list)
- Risk factors must be comprehensive, specific, and prioritized -- including gemstone-specific, tokenization, securities, business, regulatory, custody, market, tax, and liquidity risks
- Tax treatment of tokenized collectibles is complex -- gemstones may trigger the 28% collectibles tax rate
- Bad actor disclosure (Rule 506(d)) required for all covered persons
- The SEC does NOT review or approve PPMs for Reg D offerings
- PPM must be consistent with all marketing materials

**Cost gates:**

| Component | Low | Mid | High |
|-----------|-----|-----|------|
| PPM drafting (attorney) | $5,000 | $35,000 | $75,000 |
| Subscription Agreement | Included | Included | $8,000 |
| Operating Agreement | Included | Included | $15,000 |
| Smart contract legal review | $5,000 | $10,000 | $15,000 |
| Tax opinion letter | $5,000 | $10,000 | $15,000 |
| **Total document package** | **$15,000** | **$55,000** | **$128,000** |

Note: For PleoChrome's novel gemstone tokenization structure, expect the higher end due to: novel asset class, tokenization complexity, custody/insurance arrangements, GIA methodology documentation, and complex tax treatment.

**Timeline:** 4-6 weeks from engagement to final draft. This is the single longest dependency in the entire workflow.

**Dependencies:** SPV formed (Step 4.1); valuation finalized (Step 2.5); counsel engaged (Step 0.2)

**Revenue for PleoChrome:** None at this step. The PPM enables all token sales and therefore all revenue.

**Deliverables/outputs:**
- Finalized PPM (60-150 pages)
- Subscription Agreement
- Token Purchase Agreement (links ERC-3643 token to legal SPV rights)
- Investor Questionnaire
- Accredited Investor Certification Form

**Risk factors:**
- Insufficient risk factors = the #1 source of legal liability in private offerings
- Inconsistency between PPM and marketing materials creates fraud exposure
- Missing bad actor disclosure can disqualify the entire offering
- Stale financial information or overly optimistic projections invite fraud claims
- PPM must be updated/amended whenever material facts change

---

### Step 4.3: Draft Additional Legal Documents

**Description:** Securities counsel drafts the supporting legal agreements required for the offering structure.

**Who is involved:**
- **Securities Counsel:** Drafts all documents
- **PleoChrome (Shane):** Reviews and provides input

**Legal gates:**
- Custody Agreement must define vault obligations, insurance requirements, access procedures, reporting requirements, API feed specifications
- Token Purchase Agreement must specify exactly what the token represents, transfer restrictions, distribution/dividend rights
- All documents must be internally consistent with each other and with the PPM

**Cost gates:**

| Document | Low | Mid | High |
|----------|-----|-----|------|
| Custody Agreement | $2,000 | $3,500 | $5,000 |
| Engagement Agreement (asset holder) | $2,000 | $3,500 | $5,000 |
| Compliance review of all documents | $2,000 | $3,500 | $5,000 |
| **Subtotal** | **$6,000** | **$10,500** | **$15,000** |

**Timeline:** 2-3 weeks (parallel with PPM drafting)

**Dependencies:** PPM draft in progress (Step 4.2); vault selected (Step 3.1)

**Revenue for PleoChrome:** None at this step.

**Deliverables/outputs:**
- Custody Agreement (executed with vault partner)
- Token Purchase Agreement (finalized)
- Engagement Agreement (executed with asset holder -- may have been done in Phase 1)
- Internal compliance sign-off on all documents

**Risk factors:**
- Token Purchase Agreement is novel -- must precisely link on-chain token to off-chain legal rights
- Imprecise custody agreement terms can create ambiguity about vault obligations in a loss event

---

### Step 4.4: MSB Classification Legal Opinion

**Description:** Securities counsel provides a written legal opinion on whether PleoChrome qualifies as a Money Services Business (MSB) under FinCEN regulations. Operating as an unregistered MSB is a FEDERAL CRIME.

**Who is involved:**
- **Securities Counsel:** Provides written legal opinion
- **FinCEN:** Ultimate regulatory authority

**Legal gates:**
- If PleoChrome handles value transfer (funds or tokens), FinCEN MSB registration may be required
- If Brickken handles token issuance and transfers, and a broker-dealer handles fund flows, PleoChrome may be exempt as a pure orchestrator
- ALL fund flows should be structured through the SPV or broker-dealer, NOT through PleoChrome directly
- If MSB classification is triggered, PleoChrome would need FinCEN registration PLUS 47-state money transmitter licenses (budget $500,000+)

**Cost gates:** $2,000-$5,000 for legal opinion

**Timeline:** 2-4 weeks

**Dependencies:** Securities counsel engaged (Step 0.2); business model finalized

**Revenue for PleoChrome:** None at this step. This is a critical risk-mitigation gate.

**Deliverables/outputs:**
- Written legal opinion on MSB status
- Recommended fund flow structure to avoid MSB classification
- If MSB required: FinCEN registration plan and state money transmitter licensing roadmap

**Risk factors:**
- **R6 (MEDIUM/HIGH):** If PleoChrome is classified as an MSB, the $500K+ licensing cost could be prohibitive for a startup. Structure all fund flows to avoid this trigger.

---

### GATE 4 CHECK: Legal Structuring Complete?

- [ ] Series A SPV formed under master LLC?
- [ ] PPM finalized with compliance sign-off?
- [ ] Subscription Agreement finalized?
- [ ] Token Purchase Agreement finalized?
- [ ] Custody Agreement executed?
- [ ] MSB legal opinion received (and no registration required, or registration filed)?
- [ ] Form D prepared (ready to file within 15 days of first sale)?
- [ ] All documents internally consistent?

---

## PHASE 5: TOKENIZATION
**Timeline:** Weeks 10-14

---

### Step 5.1: Brickken Platform Configuration

**Description:** Subscribe to Brickken Enterprise tier and configure the token in the Brickken dashboard: token name, symbol, total supply, compliance rules, KYC requirements, jurisdictional restrictions, and document hashes.

**Who is involved:**
- **PleoChrome (Shane + David):** Configure all parameters
- **Brickken:** Platform provider

**Legal gates:**
- Token parameters must match legal documents exactly (name, total supply, per-token value)
- Compliance rules must enforce: KYC required, accredited investor required, US jurisdiction
- Legal document hashes must be attached on-chain for verifiability

**Cost gates (Brickken 2026 Pricing):**

| Tier | Monthly | Annual (est.) | Issuance Cap | KYCs/Year | Fit |
|------|---------|--------------|-------------|-----------|-----|
| Core | EUR 299 | EUR 3,000 | EUR 250K | 50 | NOT sufficient |
| Advanced | EUR 499 | EUR 5,000 | EUR 5M | 150 | NOT sufficient |
| Professional | EUR 999 | EUR 12,000 | Unlimited | 500 | Minimum viable |
| Enterprise | EUR 1,999 | EUR 22,000 (~$24,000) | Unlimited | 1,000 | **Recommended** |

**Recommendation:** Enterprise tier at EUR 22,000/year (~$24,000) for institutional credibility, 1,000 KYC allocations, and whitelabel capability.

**Timeline:** 3-5 days for configuration after subscription

**Dependencies:** Legal documents finalized (Gate 4); Brickken subscription active

**Revenue for PleoChrome:** None at this step. Platform cost is an operating expense.

**Deliverables/outputs:**
- Active Brickken Enterprise subscription
- Token configuration documented
- Compliance rules configured
- Legal document hashes attached

**Risk factors:**
- **R7 (LOW-MEDIUM/HIGH):** Brickken platform risk -- if Brickken goes down or changes pricing, PleoChrome needs a migration plan to Securitize, Tokeny, or Polymath
- Keep local copies of all configurations and legal document hashes as migration insurance

---

### Step 5.2: Testnet Deployment and Testing

**Description:** Deploy the ERC-3643 token to Polygon testnet and execute a comprehensive test suite verifying all compliance rules function correctly before irreversible mainnet deployment.

**Who is involved:**
- **PleoChrome (David + Shane):** Deploy and test
- **Brickken Platform:** Deploys via factory contract

**Legal gates:**
- All compliance rules must be verified working correctly before mainnet
- Testing must include positive and negative cases

**Cost gates:** $0 (testnet deployment is free)

**Timeline:** 1-2 weeks

**Dependencies:** Token configured in Brickken (Step 5.1)

**Revenue for PleoChrome:** None at this step.

**Deliverables/outputs:**
- Testnet token contract deployed
- Test report documenting:
  - Mint to whitelisted wallet -> PASS
  - Transfer to non-whitelisted wallet -> FAIL (correctly blocked)
  - Mint when PoR reports no custody -> FAIL (correctly blocked)
  - All compliance rules blocking correctly -> VERIFIED
  - Freeze/unfreeze functionality -> VERIFIED
  - Forced transfer capability -> VERIFIED

**Risk factors:**
- Testing must be thorough -- bugs discovered after mainnet deployment are extremely expensive or impossible to fix
- ERC-3643's six-contract architecture creates complex interactions that require systematic testing

---

### Step 5.3: Chainlink Proof of Reserve Integration

**Description:** Apply to the Chainlink BUILD program and integrate Chainlink Proof of Reserve (PoR) -- a decentralized oracle feed that cryptographically verifies the gemstones are in the vault. This enables mint-gating (tokens can only be minted when custody is verified) and provides ongoing real-time custody verification for investors.

**Who is involved:**
- **PleoChrome (Shane):** Applies to BUILD program at chain.link/build-program
- **PleoChrome (David):** Develops custom external adapter connecting vault API to Chainlink oracle network
- **Chainlink:** Provides oracle infrastructure and node operator network
- **Vault Partner:** Provides API data feed

**Legal gates:**
- BUILD program requires committing a percentage of token supply to LINK stakers (typically 3-5%, negotiable)
- PoR feed must accurately report custody status and valuation
- Manual fallback must exist if automated feed is unavailable

**Cost gates:**

| Item | Low | Mid | High |
|------|-----|-----|------|
| Custom external adapter development | $5,000 | $12,000 | $20,000 |
| Chainlink BUILD commitment (% of token supply) | Negotiated | Negotiated | Negotiated |
| Ongoing maintenance | $2,000/yr | $5,000/yr | $15,000/yr |
| **Total first year** | **$7,000** | **$17,000** | **$35,000** |

**Timeline:** 2-4 weeks for BUILD program application and response; 4-8 weeks for full integration

**Dependencies:** Vault API active (Step 3.3); testnet deployed (Step 5.2)

**Revenue for PleoChrome:** None directly. Chainlink PoR is a key differentiator that justifies premium pricing and builds investor confidence. It is a major competitive advantage.

**Deliverables/outputs:**
- Chainlink BUILD program application submitted/approved
- Custom external adapter deployed
- PoR feed contract deployed on Polygon testnet
- Verification that feed correctly reports custody status
- Oracle-gated minting tested (mint succeeds when PoR confirms custody; mint fails when PoR reports no custody)

**Risk factors:**
- **R8 (MEDIUM/MEDIUM):** BUILD program rejection or long integration timeline delays launch. Fallback: manual PoR where vault issues monthly custody confirmations published on-chain by PleoChrome until automated feed is live
- Vault API limitations may require building a manual bridge layer

---

### Step 5.4: Smart Contract Audit

**Description:** Engage an independent smart contract audit firm to review the deployed ERC-3643 token contract, compliance module, identity registry, and Chainlink PoR integration for security vulnerabilities.

**Who is involved:**
- **Audit Firm:** OpenZeppelin, CertiK, Quantstamp, QuillAudits, Trail of Bits, or Sherlock
- **PleoChrome (David):** Provides deployed testnet contract, documentation of custom logic, compliance rules, PoR integration

**Legal gates:**
- Audit report is required for institutional credibility and included in the PPM/investor data room
- Critical or high-severity findings must be remediated and re-audited before mainnet deployment
- Do NOT deploy to mainnet with unresolved critical findings

**Cost gates:**

| Item | Low | Mid | High |
|------|-----|-----|------|
| Initial audit (ERC-3643 mid-complexity) | $15,000 | $25,000 | $50,000 |
| Re-audit after remediation (if needed) | $5,000 | $12,000 | $20,000 |
| **Total** | **$15,000** | **$37,000** | **$70,000** |

**Timeline:** 2-4 weeks for initial audit; 1-2 weeks for remediation; 1-2 weeks for re-audit if needed

**Dependencies:** Testnet deployment stable (Step 5.2)

**Revenue for PleoChrome:** None at this step.

**Deliverables/outputs:**
- Smart contract audit report with severity classifications
- Remediation documentation (if findings identified)
- Clean audit report (after remediation)

**Risk factors:**
- **R11 (LOW/CRITICAL):** Smart contract vulnerability could result in token theft or loss. The audit mitigates this risk but cannot eliminate it entirely.
- ERC-3643 is more complex than standard ERC-20, so expect mid-to-upper-range audit pricing
- Audit firms have varying backlogs -- engage early to secure a slot
- Brickken's pre-audited base contracts reduce (but do not eliminate) the audit scope

---

### Step 5.5: Mainnet Deployment

**Description:** Deploy the ERC-3643 token contract to Polygon mainnet. This is IRREVERSIBLE -- triple-check every parameter before confirming.

**Who is involved:**
- **PleoChrome (David + Shane):** Deploy to mainnet
- **Independent Reviewer (Counsel + External):** Verify token parameters match legal documents exactly

**Legal gates:**
- All legal documents must be finalized BEFORE mainnet deployment
- Token parameters (name, symbol, total supply, compliance rules) must match PPM and Token Purchase Agreement exactly
- Configuration review by independent reviewer ($2,500-$5,000)

**Cost gates:**

| Item | Cost |
|------|------|
| Polygon mainnet gas fees | $10-$50 |
| Configuration review (independent) | $2,500-$5,000 |
| **Total** | **$2,510-$5,050** |

**Timeline:** 1 day for deployment; 1 week for configuration review

**Dependencies:** Audit passed (Step 5.4); ALL legal documents finalized (Gate 4); Chainlink PoR working on testnet (Step 5.3)

**Revenue for PleoChrome:** None at this step. Mainnet deployment enables all token sales.

**Deliverables/outputs:**
- Live mainnet token contract
- Contract addresses recorded permanently
- Chainlink PoR feed connected to mainnet (verified it is mainnet, not testnet)
- Configuration review report confirming parameters match legal documents

**Risk factors:**
- Deployment is irreversible -- any errors in parameters require workarounds (proxy pattern upgrades for logic, but not for immutable constructor parameters)
- PoR feed must be verified as connected to mainnet vault data (not testnet)

---

### GATE 5 CHECK: Tokenization Complete?

- [ ] Token deployed on Polygon mainnet with correct parameters?
- [ ] All compliance rules active and tested?
- [ ] Chainlink PoR feed live and verified (or manual fallback operational)?
- [ ] Smart contract audit passed with no critical/high findings?
- [ ] Token parameters match legal documents exactly (independently verified)?

---

## PHASE 6: REGULATORY FILINGS AND LAUNCH
**Timeline:** Weeks 13-16

---

### Step 6.1: File Form D with SEC via EDGAR

**Description:** File Form D notice filing with the SEC through the EDGAR system. This is a notice filing only -- no SEC review or approval required. Must be filed within 15 calendar days after the first sale of securities. Can (and should) be filed before the first sale.

**Who is involved:**
- **Securities Counsel:** Prepares and files
- **PleoChrome (Shane):** Provides information for filing
- **SEC/EDGAR:** Processes filing

**Legal gates:**
- Must create Login.gov account (required since September 2025 "EDGAR Next" system) with multifactor authentication
- Must obtain EDGAR CIK number via Form ID submission (requires notarized authentication document, 1-2 business days processing)
- Must file within 15 calendar days after first sale
- Form D specifies "Rule 506(c)" as the exemption claimed
- One-hour timeout on EDGAR after last keystroke -- have ALL information ready before logging in
- Annual amendment required if offering continues beyond 12 months

**Cost gates:** $0 (no SEC filing fee)

**Timeline:** 1-2 days for filing (after EDGAR account setup)

**Dependencies:** All legal documents finalized; first sale within 15 days (or filing in advance)

**Revenue for PleoChrome:** None directly. Filing is required to maintain the Reg D exemption.

**Deliverables/outputs:**
- Filed Form D
- EDGAR CIK number
- Filing confirmation receipt

**Risk factors:**
- Failure to file does not technically disqualify the Reg D exemption, but the SEC can seek an injunction prohibiting future reliance on Reg D
- States may impose penalties for failure to file corresponding blue sky notices
- The SEC has proposed (not yet adopted) rules making Form D filing a condition of the exemption

---

### Step 6.2: File Blue Sky State Notice Filings

**Description:** File notice filings in each state where securities are SOLD (not where offered). Most states require a copy of Form D plus a filing fee, filed within 15 days of first sale in that state.

**Who is involved:**
- **Securities Counsel:** Prepares and files (most states accept filings through the Electronic Filing Depository via NASAA)
- **PleoChrome:** Identifies states where investors reside

**Legal gates:**
- 46 states require notice filings for Rule 506 offerings
- Most states accept filings through the Electronic Filing Depository (EFD)
- **NEW YORK:** Requires filing BEFORE first sale (unique among all states). Does NOT use EFD -- requires manual submission. Highest fees (up to $2,135)
- **FLORIDA:** No filing fee, but notice + consent to service of process required. Does NOT use EFD
- **RHODE ISLAND:** Requires 10 days before first sale
- Federal preemption (NSMIA 1996) prevents states from requiring registration but allows notice filings, fees, consent to service of process, and anti-fraud enforcement
- Must file in additional states as investors from new states close

**Cost gates (selected key states):**

| State | Fee | Notes |
|-------|-----|-------|
| California | $300 | Fixed |
| Colorado | $50 | Lowest in the country |
| Delaware | $200-$1,000 | 0.5% of offering |
| Florida | $0 | Notice + consent required |
| New York | $300-$2,135 | Must file BEFORE first sale |
| Texas | $0-$500 | 0.1% of offering |
| Wyoming | $200 | Fixed |
| **Budget for 5-10 states** | **$1,500-$10,000** |
| **Budget for all 50 states + DC** | **$12,000-$18,000** |

**Practical note:** For a $10-18M offering with 10-50 accredited investors, expect to file in 5-15 states initially.

**Timeline:** 1-2 weeks for initial filings; ongoing as investors from new states close

**Dependencies:** Form D filed (Step 6.1); investors identified by state

**Revenue for PleoChrome:** None directly. Required for compliance.

**Deliverables/outputs:**
- Filed state notice filings for each applicable state
- Filing confirmation receipts
- Tracking spreadsheet of state filings and renewal dates

**Risk factors:**
- Missing a state filing can result in state enforcement action or fines
- New York's pre-filing requirement is easy to miss -- file NY before accepting any NY-based investor
- Blue sky renewals required annually in many states

---

### Step 6.3: Set Up Accredited Investor Verification

**Description:** Establish the system for verifying accredited investor status for every prospective investor. The March 2025 SEC no-action letter dramatically simplified verification for high-ticket offerings.

**Who is involved:**
- **PleoChrome (David):** Sets up verification flow
- **Verification Services:** VerifyInvestor.com ($50-$150/investor), InvestReady ($75/verification), EarlyIQ ($69/verification), North Capital/Accredited.AM (~$30/verification)

**Legal gates:**
- Under 506(c), the issuer MUST take "reasonable steps to verify" accredited status for EVERY purchaser
- **March 2025 SEC No-Action Letter (Game-Changer):** For investments of $200,000+ (natural persons) or $1,000,000+ (entities), self-certification is sufficient IF:
  - The issuer obtains a written representation that the investor is accredited
  - The investor represents the investment is NOT financed by a third party
  - The issuer has no information suggesting the representation is false
- Traditional verification methods remain valid: tax return review (2 years), net worth verification, professional certification (Series 7, 65, or 82), or third-party confirmation from a BD, RIA, attorney, or CPA
- Documentation must be retained for at least 5 years

**Cost gates:**

| Method | Cost per Investor | Notes |
|--------|------------------|-------|
| Self-certification ($200K+ investment) | $0 | Per March 2025 SEC guidance |
| VerifyInvestor.com | $50-$150 | Attorney-verified, 1-2 business days |
| InvestReady | $75 | Technology-driven, some instant |
| EarlyIQ | $69 | Per verification |
| North Capital (Accredited.AM) | ~$30 | Free to investors |

**Timeline:** 1-2 weeks to set up verification flow

**Dependencies:** Legal documents finalized; verification platform selected

**Revenue for PleoChrome:** None at this step.

**Deliverables/outputs:**
- Active verification flow (self-certification template and/or third-party platform integration)
- Written self-certification template reviewed by counsel
- Verification records retention system

**Risk factors:**
- Even if all investors are in fact accredited, failure to take "reasonable steps to verify" violates Rule 506(c) and can result in loss of exemption, rescission rights, and enforcement action
- Self-certification for $200K+ investments is legally sufficient but less defensive if challenged -- having third-party verification as fallback adds protection

---

### Step 6.4: Build Investor Data Room and Marketing Materials

**Description:** Create a secure data room with all investor-facing documentation and develop 506(c)-compliant marketing materials.

**Who is involved:**
- **PleoChrome (David + Shane):** Build data room, create marketing materials
- **Securities Counsel:** Reviews all marketing materials for compliance before distribution

**Legal gates:**
- 506(c) permits general solicitation and advertising (social media, website, digital ads, events, press releases, email marketing)
- ALL marketing materials MUST include risk disclosures and standard disclaimers
- Marketing materials must be consistent with the PPM (inconsistencies create fraud exposure)
- Securities counsel MUST review all materials before publication
- Cannot make false/misleading statements, guarantee returns, promise specific outcomes, or claim SEC approval
- Must include: "This is not an offer to sell or solicitation to buy. Securities are offered only to verified accredited investors via the Private Placement Memorandum."
- Keep records of all advertising materials used in the offering

**Cost gates:**

| Item | Low | Mid | High |
|------|-----|-----|------|
| Data room setup (DocSend, Dealroom, or Brickken built-in) | $0 | $250 | $500 |
| Marketing materials (design + compliance review) | $2,000 | $5,000 | $10,000 |
| **Total** | **$2,000** | **$5,250** | **$10,500** |

**Timeline:** 1-2 weeks

**Dependencies:** PPM finalized; all documentation complete

**Revenue for PleoChrome:** None at this step. Enables investor outreach.

**Deliverables/outputs:**
- Live secure data room with: PPM, GIA reports, appraisal summaries, vault receipt, insurance verification, team bios, audit report
- Marketing deck
- One-pager
- Email templates
- Risk disclosure text for all advertisements

**Risk factors:**
- Marketing claims that exceed PPM disclosures create fraud liability
- All materials must be reviewed by counsel -- distributing unreviewed materials is a compliance violation

---

### Step 6.5: Test End-to-End Investor Onboarding Flow

**Description:** Execute a complete test of the investor journey from first contact through token receipt, verifying every system works together seamlessly.

**Who is involved:**
- **PleoChrome (Shane + David):** Execute full test flow

**Legal gates:**
- Every step must function correctly: KYC -> accreditation verification -> PPM review -> subscription signing -> wire transfer instructions -> token receipt in wallet

**Cost gates:** $0 (internal testing)

**Timeline:** 1 week

**Dependencies:** All systems live (Brickken, verification, data room, mainnet contract)

**Revenue for PleoChrome:** None at this step.

**Deliverables/outputs:**
- End-to-end test report
- Issue log with resolutions
- Confirmed working investor onboarding pathway

**Risk factors:**
- Integration failures between systems (Brickken, KYC provider, verification service, payment processing) discovered at this stage are cheaper to fix than after launch

---

### GATE 6 CHECK: Launch Ready?

- [ ] Form D filed with SEC?
- [ ] Blue sky notices filed in target states?
- [ ] Accredited investor verification flow live and tested?
- [ ] Investor onboarding pathway live and tested end-to-end?
- [ ] Marketing materials compliant and approved by counsel?
- [ ] Data room live with all documentation?

---

## PHASE 7: DISTRIBUTION AND INVESTOR ONBOARDING
**Timeline:** Weeks 15+ (ongoing)

---

### Step 7.1: Begin Targeted Investor Outreach

**Description:** Launch targeted outreach to accredited investors. 506(c) permits general solicitation -- PleoChrome CAN advertise publicly.

**Who is involved:**
- **PleoChrome (Shane):** Primary investor outreach and relationship building
- **Broker-Dealer (if engaged):** Provides distribution support and investor introductions
- **PleoChrome (Chris):** Asset sourcing and partnership development

**Legal gates:**
- All communications must comply with 506(c) general solicitation rules
- All materials must include risk disclosures
- Cannot sell to non-accredited investors under any circumstances
- BD (if engaged) must file Form 5123 with FINRA within 15 days of first sale

**Cost gates:**

| Item | Monthly Cost |
|------|-------------|
| Marketing budget (LinkedIn Sales Navigator, digital ads, events) | $5,000-$25,000 |
| Broker-dealer commission (if engaged) | 1-7% of capital raised |
| **Monthly range** | **$5,000-$25,000+ (plus BD commissions)** |

**Timeline:** Ongoing from launch

**Dependencies:** All gates passed; all systems live

**Revenue for PleoChrome:** This step GENERATES revenue. See Step 7.2 for fee collection details.

**Deliverables/outputs:**
- Active investor pipeline
- Outreach tracking (conversion funnel: outreach -> meeting -> PPM review -> subscription -> close)
- Compliant marketing materials distributed

**Risk factors:**
- **R9 (MEDIUM/HIGH):** No investors -- offering fails to attract sufficient interest. Mitigate by starting outreach early (even before offering is live -- build a waitlist) and engaging a BD for distribution support
- Conservative token pricing improves investor appeal

---

### Step 7.2: Process Investor Subscriptions

**Description:** For each investor, execute the complete onboarding process and collect investment funds. This is where PleoChrome EARNS REVENUE.

**Who is involved:**
- **Investor:** Completes all verification steps, reviews PPM, signs subscription agreement, wires funds
- **PleoChrome (David):** Manages onboarding operations
- **KYC Provider:** Processes identity verification
- **Verification Service:** Confirms accredited status
- **Brickken Platform:** Mints tokens to investor wallet

**Legal gates:**
Each investor MUST complete ALL of the following before receiving tokens:
1. Pass KYC verification
2. Verify accredited investor status ($200K+ self-certification or traditional verification)
3. Pass sanctions screening (OFAC, EU/UN)
4. Review the PPM (documented acknowledgment)
5. Sign the Subscription Agreement electronically
6. Wire funds to the SPV escrow account (NOT to PleoChrome -- funds go to Series A SPV bank account)
7. Receive tokens in their verified wallet

**Cost gates (per investor):**

| Item | Cost |
|------|------|
| KYC verification | $0.80-$3.50 |
| Accredited investor verification (if not self-certifying) | $30-$150 |
| Blue sky filing (if new state) | $50-$2,135 |
| **Total per investor** | **$30-$2,300** |

**Timeline:** 1-2 weeks per investor (from first contact to tokens minted)

**Dependencies:** All systems live; investor completes all steps

**Revenue for PleoChrome at this step:**

| Fee Type | Trigger | Amount (on $9.65M offering) |
|----------|---------|---------------------------|
| **Setup fee (2%)** | Collected at first close | $193,000 |
| **Success fee (1.5%)** | Collected at each investor close | $1,500 per $100K invested |
| **Annual admin fee (0.75%)** | Begins Month 13 | $72,375/year |

**Revenue scenarios:**
- **If $5M raised by Month 5:** $193,000 setup + $75,000 success = **$268,000**
- **If fully subscribed ($9.65M) by Month 8:** $193,000 setup + $144,750 success = **$337,750**
- **Annual recurring (fully subscribed):** $72,375/year in admin fees

**Deliverables/outputs:**
- For each investor:
  - KYC clearance documentation
  - Accredited investor verification (self-cert letter or third-party letter)
  - Sanctions screening results
  - Signed Subscription Agreement
  - Wire confirmation
  - Token minting confirmation
  - Wallet address recorded

**Risk factors:**
- Wire processing delays can frustrate investors
- Wallet setup may be unfamiliar to traditional investors (Brickken's platform should mitigate this)
- Each investor adds compliance documentation requirements -- must maintain meticulous records

---

### GATE 7 CHECK: Offering is OPEN

- [ ] Investor onboarding pathway live and tested?
- [ ] KYC + accreditation flows verified?
- [ ] Form D filed?
- [ ] Marketing materials compliant?
- [ ] First investor closed and tokens minted?

---

## PHASE 8: ONGOING MANAGEMENT AND COMPLIANCE
**Timeline:** Continuous from first investor onboarding

---

### Step 8.1: Quarterly Investor Reporting

**Description:** Provide quarterly updates to all token holders on fund performance, custody status, and market conditions.

**Who is involved:**
- **PleoChrome (David + Shane):** Prepare and distribute reports

**Legal gates:**
- Operating agreement should specify reporting cadence and content
- While Reg D has minimal mandatory reporting, best practice (and competitive necessity) requires quarterly updates

**Cost gates:** $0 (internal, using templates)

**Frequency:** Quarterly

**Revenue for PleoChrome:** None directly. Investor satisfaction drives referrals and repeat investment in future offerings.

**Deliverables/outputs (each quarter):**
- NAV per token
- Vault custody confirmation
- Insurance status verification
- Market commentary on gemstone market conditions
- Chainlink PoR verification status
- Fund financial statements

---

### Step 8.2: Annual Re-Appraisal

**Description:** Minimum one independent USPAP-compliant appraisal annually to maintain accurate valuation. Triggers NAV updates for token holders.

**Who is involved:**
- **Independent Appraiser:** Conducts annual valuation
- **PleoChrome (David):** Coordinates logistics

**Cost gates:** $3,000-$10,000/year per asset

**Frequency:** Annually (at minimum)

**Revenue for PleoChrome:** Updated valuation supports the 0.75% annual admin fee calculation and maintains investor confidence.

**Deliverables/outputs:**
- Annual USPAP-compliant appraisal report
- Updated NAV per token
- Variance analysis vs. prior year

---

### Step 8.3: Quarterly Sanctions Re-Screening

**Description:** Re-screen ALL investors and asset holders against OFAC and sanctions lists quarterly.

**Who is involved:**
- **PleoChrome (David, with Shane as Compliance Officer oversight):** Executes screening

**Cost gates:** $0-$500/quarter (OFAC is free; paid services optional)

**Frequency:** Quarterly

**Deliverables/outputs:**
- Quarterly screening logs for all investors and asset holders
- Documentation of all results (including "no results found")

---

### Step 8.4: Annual Independent Compliance Audit

**Description:** Engage an external auditor to review PleoChrome's AML/KYC program, investor verification records, sanctions screening logs, and overall compliance posture.

**Who is involved:**
- **External Compliance Auditor:** Conducts review
- **PleoChrome (Shane as Compliance Officer):** Provides access to records

**Cost gates:** $5,000-$15,000/year

**Frequency:** Annually

**Deliverables/outputs:**
- Annual compliance audit report
- Findings and remediation recommendations

---

### Step 8.5: Form D Annual Amendment

**Description:** If the offering continues beyond 12 months, file an annual amendment to Form D via EDGAR.

**Who is involved:**
- **Securities Counsel:** Prepares and files amendment

**Legal gates:**
- Required if offering continues beyond 12 months
- Due on or before the one-year anniversary of the most recent filing/amendment
- Material changes require amendment "as soon as practicable"

**Cost gates:** $0 (no filing fee) + counsel time

**Frequency:** Annually (or upon material change)

---

### Step 8.6: Blue Sky Annual Renewals

**Description:** Renew notice filings in all applicable states. Many states require annual renewal.

**Who is involved:**
- **Securities Counsel or Blue Sky compliance service:** Files renewals

**Cost gates:** Same as initial filing fees per state; $3,000-$8,000 if using a compliance service like BlueSkyComply

**Frequency:** Annually

---

### Step 8.7: Tax Document Preparation and Distribution

**Description:** Prepare and distribute K-1 forms for all SPV investors, plus file Form 1065 partnership return for the SPV.

**Who is involved:**
- **CPA/Accountant:** Prepares tax documents
- **PleoChrome (David):** Distributes to investors

**Cost gates:** $3,000-$15,000/year (for 20 investors, expect $4,000-$8,000 for Form 1065 + K-1s)

**Frequency:** Annually (tax season)

**Key tax consideration:** Gemstones may trigger the 28% collectibles tax rate for long-term capital gains (vs. standard 20% LTCG rate). Tax counsel must address this in the PPM.

---

### Step 8.8: AML Training

**Description:** Annual AML/BSA training for all PleoChrome team members as required by the compliance program.

**Who is involved:**
- **All PleoChrome team members**

**Cost gates:** $500-$2,000/year

**Frequency:** Annually

---

## COMPLETE FEE STRUCTURE AND REVENUE MODEL

### PleoChrome Fee Structure

| Fee | Rate | When Collected | On $9.65M Offering |
|-----|------|---------------|-------------------|
| **Setup Fee** | 2% of offering value | At first close | $193,000 |
| **Success Fee** | 1.5% of capital raised | At each investor close | $144,750 (if fully subscribed) |
| **Annual Admin Fee** | 0.75% of AUM | Annually starting Month 13 | $72,375/year |

### Revenue Timeline

| Event | Timing | Revenue |
|-------|--------|---------|
| Setup fee collected | Week 15 (first close) | $193,000 |
| Success fees (ongoing) | Each investor close | $1,500 per $100K invested |
| Annual admin fee | Month 13+ | $72,375/year |

### Revenue Scenarios

| Scenario | Setup Fee | Success Fee | Total First Year | Annual Recurring |
|----------|-----------|-------------|-----------------|-----------------|
| $5M raised by Month 5 | $193,000 | $75,000 | $268,000 | $37,500 (on $5M) |
| $9.65M fully subscribed by Month 8 | $193,000 | $144,750 | $337,750 | $72,375 |

### Cash Flow Timeline

| Month | Cumulative Spend | Cumulative Revenue | Net Position |
|-------|-----------------|-------------------|-------------|
| Month 1 | -$10,000 | $0 | -$10,000 |
| Month 2 | -$30,000 | $0 | -$30,000 |
| Month 3 | -$80,000 | $0 | -$80,000 |
| Month 4 (first investor) | -$150,000 | $208,000 (setup + first close) | +$58,000 |
| Month 5 | -$200,000 | $243,000 | +$43,000 |
| Month 6 | -$230,000 | $290,000 | +$60,000 |
| Month 7 | -$250,000 | $320,000 | +$70,000 |
| Month 8 (fully subscribed) | -$270,000 | $337,750 | +$67,750 |

**Break-even: Month 4 (upon first investor close and setup fee collection)**

**Critical insight:** The 2% setup fee ($193K) approximately covers startup costs at the realistic estimate. But this fee is not collected until the first investor closes. PleoChrome must fund $150,000-$250,000 out of pocket before revenue arrives.

---

## ALL REGULATORY FILING REQUIREMENTS

### Federal Filings

| Filing | Agency | Form | Fee | Deadline | Notes |
|--------|--------|------|-----|----------|-------|
| Form D (initial) | SEC | Form D via EDGAR | $0 | Within 15 days of first sale | Can file in advance (recommended) |
| Form D (annual amendment) | SEC | Form D amendment | $0 | Annually if offering continues | Due on anniversary of most recent filing |
| Form D (material change) | SEC | Form D amendment | $0 | "As soon as practicable" | Required for changes to exemption, issuer name, related persons, etc. |
| Form 5123 (if BD engaged) | FINRA | Form 5123 | $300 base + 0.008% of offering | Within 15 days of first sale | BD files this; FINRA filing fee capped at $40,300 |
| FinCEN MSB Registration (if required) | FinCEN | FinCEN Form 107 | $0 | Before conducting MSB activity | Only if MSB opinion says registration required |
| Form 1065 (SPV tax return) | IRS | Form 1065 + K-1s | $0 (CPA fees for preparation) | March 15 (or September 15 with extension) | SPV files partnership return; investors receive K-1s |

### State Filings (Blue Sky)

| Filing | Agency | Form | Fee | Deadline | Notes |
|--------|--------|------|-----|----------|-------|
| Blue sky notice (initial) | Each state's securities regulator | Varies (most via EFD) | $50-$2,135 per state | Within 15 days of first sale in state | NY requires filing BEFORE first sale |
| Blue sky renewal | Each state | Same as initial | Same fees | Annually | Track state-specific deadlines |
| Wyoming annual report | Wyoming SOS | Annual report | $60-$150 | Anniversary month | Based on asset value |

### Entity Filings

| Filing | Agency | Form | Fee | Deadline |
|--------|--------|------|-----|----------|
| Articles of Organization | Wyoming SOS | Formation docs | $100 | Before operations begin |
| Series designation | Wyoming SOS | Series filing | $10 per series | Before series operations |
| EIN application | IRS | SS-4 (online) | $0 | Before opening bank account |

---

## SMART CONTRACT AUDIT REQUIREMENTS

### What Must Be Audited

The ERC-3643 architecture consists of six interlocking contracts that all require audit:

1. **Token Contract** -- the ERC-3643 permissioned token with mint, burn, freeze, forced transfer, pause, and recovery functions
2. **Identity Registry** -- maps wallet addresses to ONCHAINID identities and determines verification status
3. **Identity Registry Storage** -- separates identity data from logic (enables multi-token shared whitelist)
4. **Trusted Issuers Registry** -- defines which entities can verify investor identities
5. **Claim Topics Registry** -- defines what verification claims are required (KYC, accredited investor, AML)
6. **Compliance Contract** -- enforces offering rules (max holder count, per-country limits, lock-ups, daily transfer limits)

Plus:
7. **Chainlink PoR Integration** -- external adapter and oracle feed contract
8. **Brickken Escrow Contract** -- holds investor funds until conditions are met

### Audit Firm Options

| Firm | Estimated Cost | Reputation | Notes |
|------|---------------|------------|-------|
| OpenZeppelin | $50,000-$200,000 | Gold standard | Highest reputation; long wait times |
| Trail of Bits | $50,000-$150,000 | Elite | Deep EVM expertise |
| CertiK | $20,000-$80,000 | Established | Good for ERC standards |
| Quantstamp | $25,000-$100,000 | Established | Broad blockchain coverage |
| QuillAudits | $15,000-$40,000 | Emerging | Cost-effective for mid-complexity |
| Sherlock | $15,000-$50,000 | Emerging | Crowdsourced audit model |

### Recommended Budget

- **Initial audit:** $15,000-$50,000 (ERC-3643 is mid-complexity, above standard ERC-20)
- **Re-audit after remediation:** $5,000-$20,000 (if critical/high findings)
- **Pre-audited advantage:** Brickken's base contracts have been professionally audited, reducing the scope to custom logic, PoR integration, and configuration verification

### Audit Timeline

- **Engagement to report:** 2-4 weeks
- **Remediation:** 1-2 weeks (if findings identified)
- **Re-audit:** 1-2 weeks (if needed)
- **Total:** 4-8 weeks worst case

---

## TRANSFER AGENT REQUIREMENTS

### Legal Basis

Under the Securities Exchange Act of 1934, Section 17A, any entity performing transfer agent functions must register with the SEC. Transfer agent functions include:
- Maintaining the official shareholder registry (cap table)
- Processing transfers of ownership
- Issuing and canceling tokens/certificates
- Distributing dividends and other payments
- Processing corporate actions

### Is a Registered Transfer Agent Required?

**For Reg D private placements: No, not legally required.** Using an SEC-registered transfer agent is not mandatory for non-reporting issuers. Self-administration by the issuer is legally permitted. However, using a registered TA is **strongly recommended** because:
- It provides institutional credibility
- Eliminates manual reconciliation between on-chain and off-chain records
- Many investors and broker-dealers require it
- SEC is actively pursuing transfer agent reform (targeted for early 2026 rulemaking)

### The Dual Cap Table Problem

For tokenized securities, two records must always match:
- **Legal cap table:** Official shareholder registry maintained by transfer agent or issuer
- **Blockchain cap table:** On-chain ERC-3643 token ownership records on Polygon

ERC-3643 addresses this through the Identity Registry (mapping wallets to verified identities), Compliance Module (preventing unauthorized transfers), Agent Role (forced transfers for court orders/estate settlements), and multi-wallet identity (single ONCHAINID linked to multiple wallets).

### Transfer Agent Options for PleoChrome

| Provider | SEC Registered | Annual Cost | ERC-3643 Support | Recommendation |
|----------|---------------|-------------|-----------------|----------------|
| **Self-Administration** | N/A | $0 (internal cost) | N/A | Legally permitted but least credible |
| **Vertalo** | Yes (DTA) | Custom | Native (V-Token) | Best fit for first asset -- keyless wallets, chain swap |
| **Securitize** | Yes (TA + BD) | $25K+/year | DS Protocol (own standard) | Best for scale (3+ offerings) |
| **tZERO** | Yes (TA + BD) | Custom | Confirmed ERC-3643 support | Integrated secondary market |
| **KoreConX** | Via network | Free platform | Own blockchain (not Polygon) | Free but may not support Polygon |
| **Traditional TA** | Yes | $5,000-$15,000/yr | Manual reconciliation | Simple but error-prone |

### Transfer Agent Cost Structure

| Component | Cost Range |
|-----------|-----------|
| Platform setup/onboarding | $5,000-$25,000 |
| Smart contract deployment | $3,000-$15,000 |
| Annual platform fee | $5,000-$25,000/year |
| Per-transfer fee | $5-$50/transfer |
| Cap table management | $2,000-$10,000/year |
| Token minting | $1,000-$10,000 (one-time) |
| **First year total** | **$15,000-$50,000** |
| **Annual ongoing** | **$10,000-$25,000** |

### Recommendation

**First asset:** Self-administration is legally sufficient, supplemented by Brickken's built-in cap table. Engage Vertalo as Digital Transfer Agent if budget allows -- their keyless wallet feature removes crypto friction for traditional HNW investors.

**At scale (3+ assets):** Migrate to Securitize for the complete regulated stack (TA + BD + ATS + fund admin).

---

## BROKER-DEALER REQUIREMENTS

### When a Broker-Dealer is Legally Required

A BD is required when ANYONE receives transaction-based compensation (commissions) for soliciting or selling securities. Under 506(c), PleoChrome can self-distribute under the issuer exemption (Section 3(a)(4) of the Exchange Act) IF:
- All sales are made by bona fide employees (not independent contractors)
- No one receives commission-based compensation tied to sales
- Sales are limited to the issuer's own securities

### FINRA Filing Requirements (If BD Engaged)

| Filing | Form | Deadline | Fee |
|--------|------|----------|-----|
| Private placement notice | Form 5123 | Within 15 days of first sale | $300 base + 0.008% of offering (capped at $40,300) |
| Ongoing compliance | FINRA gateway | As required | Per BD's obligations |
| Advertising review | FINRA filing | Before or concurrent with first use | Per BD |

### Broker-Dealer Cost Models

| Model | Upfront Cost | Success Fee | Best For |
|-------|-------------|-------------|----------|
| **BD of Record (Dalmore)** | $5,000-$55,000 setup + ~$20,000 consulting | 1-3% of gross proceeds | Compliance/credibility with self-distribution |
| **Full-Service Placement Agent** | $10,000-$50,000 due diligence | 5-10% of gross proceeds | Active selling to investor networks |
| **Platform BD (Securitize, tZERO)** | Platform fees ($25K+/yr) | 1-7% per transaction | Integrated primary + secondary |
| **Self-Distribution (issuer exemption)** | $0 | $0 | Maximum cost savings, minimum credibility |

### Recommended Approach

**Engage Dalmore Group as BD of Record:** Dalmore handles regulatory supervision, FINRA filing, and compliance review ($25K-$55K setup + 1-3% success fee). PleoChrome team handles investor outreach under the issuer exemption. This is the lowest-cost path that still provides BD credibility and FINRA safety net.

**All-In BD Estimate for First Offering:**
- BD of record + FINRA compliance: $25,000-$75,000 upfront + 1-3% of raise
- On $5M raised: $75,000-$225,000 total (setup + commissions)
- On $9.65M raised: $121,750-$364,500 total

---

## ONGOING COMPLIANCE OBLIGATIONS

### Quarterly Obligations

| Obligation | Owner | Cost | Deliverable |
|------------|-------|------|-------------|
| Investor reporting (NAV, custody, market conditions) | David + Shane | $0 | Quarterly investor report |
| Sanctions re-screening (all investors + asset holders) | David + Shane | $0-$500 | Screening logs |
| Compliance monitoring review | Shane (CO) | $0 | Internal review notes |

### Annual Obligations

| Obligation | Owner | Cost | Deliverable |
|------------|-------|------|-------------|
| Form D amendment (if offering continues) | Counsel | $0 + counsel time | Filed amendment |
| Blue sky renewals (applicable states) | Counsel | $1,500-$10,000 | Renewed filings |
| Independent compliance audit | External auditor | $5,000-$15,000 | Audit report |
| Re-appraisal (minimum 1 independent) | Appraiser | $3,000-$10,000 | USPAP-compliant report |
| AML training (all team members) | All | $500-$2,000 | Training certificates |
| Tax preparation (Form 1065 + K-1s) | CPA | $3,000-$15,000 | Filed returns, distributed K-1s |
| Insurance renewal (D&O, E&O, Cyber, GL) | Shane | $14,000-$43,000 | Active policies |
| Brickken subscription renewal | Shane | ~$24,000 | Active subscription |
| Vault custody fees | Automatic | $50,000-$100,000 | Ongoing custody |
| Chainlink PoR maintenance | David | $2,000-$15,000 | Active oracle feed |
| Wyoming annual report + registered agent | Shane | $85-$350 | Filed report |
| Ongoing legal counsel retainer | Shane | $5,000-$20,000 | Available counsel |
| Accounting/bookkeeping | CPA | $3,000-$12,000 | Current books |
| **TOTAL ANNUAL ONGOING** | | **$110,000-$284,000** | |

### 5-Year Record Retention Requirements

The following must be retained for at least 5 years (best practice: retain indefinitely):
- All offering documents (PPM, Subscription Agreements, Form D)
- All investor verification records (KYC, accreditation, sanctions screening)
- All advertising and marketing materials used in the offering
- All communications with investors
- All financial records of the SPV
- All compliance logs and screening results
- All appraisal reports and GIA certifications
- Smart contract audit reports
- Custody receipts and insurance documentation

---

## MASTER COST SUMMARY

### One-Time Startup Costs (First Asset)

| Category | Low | Realistic Mid | High |
|----------|-----|--------------|------|
| **Legal - Entity Formation** | $2,125 | $3,675 | $5,300 |
| **Legal - Securities (PPM + all docs)** | $15,000 | $55,000 | $128,000 |
| **Legal - Opinions (provenance, MSB)** | $4,000 | $8,500 | $15,000 |
| **Legal - Filings (Form D + Blue Sky)** | $1,500 | $5,000 | $12,000 |
| **Certification (GIA)** | $5,000 | $20,000 | $50,000 |
| **Certification (SSEF)** | $0 | $5,000 | $25,000 |
| **Appraisals (3 independent)** | $9,000 | $18,000 | $30,000 |
| **Transit Insurance (all legs)** | $5,000 | $10,000 | $20,000 |
| **Vault Resolution** | $62,000 | $62,000 | $62,000 |
| **Insurance (Year 1)** | $15,000 | $30,500 | $46,000 |
| **Technology - Brickken (Year 1)** | $24,000 | $24,000 | $24,000 |
| **Technology - Chainlink PoR** | $5,000 | $12,000 | $20,000 |
| **Technology - Smart Contract Audit** | $15,000 | $37,000 | $70,000 |
| **Broker-Dealer Engagement** | $5,000 | $25,000 | $55,000 |
| **Marketing** | $2,000 | $5,000 | $10,000 |
| **Verification (20 investors)** | $600 | $1,500 | $3,000 |
| **Data Room** | $0 | $250 | $500 |
| **Accounting Setup** | $1,000 | $3,000 | $5,000 |
| **Contingency (10%)** | $17,123 | $32,543 | $58,080 |
| **TOTAL ONE-TIME** | **$188,348** | **$358,968** | **$638,880** |

**Without the $62K vault bill (asset holder pays):** Low: $126,348 | Mid: $296,968 | High: $576,880

**Minimum Viable Budget (stripped to essentials):**

| Item | Amount |
|------|--------|
| Entity formation | $185 |
| Boutique securities counsel (flat-fee) | $15,000 |
| Basic insurance (D&O only) | $7,500 |
| Legal opinions (provenance + MSB) | $5,000 |
| GIA certification (top 20 stones) | $5,000 |
| 3 appraisals (mid-range) | $12,000 |
| Transit insurance (2 legs) | $4,000 |
| Brickken Professional (3 months) | $3,000 |
| Smart contract audit (budget firm) | $15,000 |
| Blue sky filings (5 states) | $1,500 |
| Marketing (DIY) | $500 |
| **MINIMUM VIABLE TOTAL** | **$68,685** |

This assumes: no BD, no Chainlink PoR initially, minimal marketing, self-distribution only, and no provenance complications.

### Annual Ongoing Costs

| Category | Low | High |
|----------|-----|------|
| Vault custody (0.5-1% of $10M) | $50,000 | $100,000 |
| Insurance renewal | $14,000 | $43,000 |
| Brickken Enterprise | $24,000 | $24,000 |
| Legal counsel retainer | $5,000 | $20,000 |
| Chainlink PoR maintenance | $2,000 | $15,000 |
| Annual re-appraisal | $3,000 | $10,000 |
| Independent compliance audit | $5,000 | $15,000 |
| Accounting/tax prep | $5,000 | $15,000 |
| Sanctions screening (quarterly) | $0 | $500 |
| AML training | $500 | $2,000 |
| Wyoming annual report + agent | $85 | $350 |
| Transfer agent (if separate) | $5,000 | $20,000 |
| Marketing (ongoing) | $5,000 | $25,000 |
| Blue sky renewals | $1,500 | $10,000 |
| **TOTAL ANNUAL** | **$120,085** | **$299,850** |

### Funded By

| Revenue Source | Annual Amount (fully subscribed) |
|----------------|--------------------------------|
| Annual admin fee (0.75% of $9.65M AUM) | $72,375 |
| Success fees from additional offerings | Variable |
| **Gap to cover from success fees or additional offerings** | **$47,710-$227,475** |

The admin fee alone covers approximately 24-60% of ongoing costs. The gap must be closed by processing additional assets, increasing AUM, or restructuring the management fee.

---

## CRITICAL PATH SUMMARY

| Week | Milestone | Blocking Dependency |
|------|-----------|-------------------|
| 1-2 | Entity formed, counsel engaged, insurance quotes | None |
| 3 | Kandi legal opinion, vault bill resolved | Counsel engaged |
| 3-4 | Gate 0 passed, asset intake begins | Legal opinion received |
| 4-5 | KYC/sanctions clear, engagement signed | Gate 0 |
| 5-6 | GIA submitted, SPV formed | Gate 1 |
| 5-8 | Appraiser panel built, GIA in progress | Gate 1 |
| 6-10 | 3 sequential appraisals completed | GIA reports received |
| 4-10 | PPM and legal docs drafted (parallel) | Counsel engaged |
| 8-11 | Vault transfer, custody verified | Last appraisal done |
| 10-13 | Brickken config, testnet, Chainlink PoR | Legal docs finalized |
| 11-14 | Smart contract audit | Testnet stable |
| 13-14 | Mainnet deployment, config review | Audit passed |
| 14-15 | Form D, blue sky, investor flow tested | Mainnet live |
| 15-16+ | First investor outreach and subscriptions | All gates passed |

**Realistic total: 16-20 weeks (4-5 months) from entity formation to first token sale.**

**The critical path runs through:** Entity formation -> Securities counsel engagement -> PPM drafting (4-6 weeks, longest single dependency) -> Legal docs finalized -> Tokenization -> Launch.

---

## RISK REGISTER (COMPLETE)

| # | Risk | Probability | Impact | Mitigation |
|---|------|------------|--------|------------|
| R1 | Provenance poisons the offering | HIGH | CRITICAL | Securities counsel legal opinion before proceeding |
| R2 | Disputed ownership challenge | MEDIUM | CRITICAL | Thorough title search and legal opinion |
| R3 | Federal restitution lien on emeralds | MEDIUM-HIGH | CRITICAL | PACER research on restitution satisfaction |
| R4 | GIA reveals lower quality than represented | MEDIUM | HIGH | 3-appraisal process with conservative valuation |
| R5 | Appraisal variance >20% | MEDIUM | HIGH | Credentialed appraisers; 4th tiebreaker if needed |
| R6 | MSB classification triggers $500K+ licensing | MEDIUM | HIGH | Legal opinion + structure fund flows through SPV/BD |
| R7 | Brickken platform risk | LOW-MEDIUM | HIGH | Document processes for migration; local config copies |
| R8 | Chainlink integration delays | MEDIUM | MEDIUM | Manual PoR fallback (monthly vault confirmations) |
| R9 | No investors | MEDIUM | HIGH | Early outreach, BD engagement, conservative pricing |
| R10 | Regulatory change | LOW | MEDIUM | Securities counsel monitoring; Jan 2026 SEC statement is favorable |
| R11 | Smart contract vulnerability | LOW | CRITICAL | Independent audit; emergency pause capability |
| R12 | Vault breach or loss | VERY LOW | CRITICAL | Institutional vault + full insurance + Chainlink PoR |
| R13 | Team member departure | MEDIUM | MEDIUM | Operating agreement buyout provisions; cross-training |
| R14 | Cash burn before revenue ($250K+ out of pocket) | HIGH | MEDIUM | 2% setup fee covers startup costs once first investor closes |
| R15 | Vault inadequacy requiring costly transfer | MEDIUM | LOW | Get Brink's/Malca-Amit proposals early |

---

*End of Document*
