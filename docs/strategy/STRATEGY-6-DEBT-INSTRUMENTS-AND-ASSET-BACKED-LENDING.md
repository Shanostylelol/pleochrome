# PLEOCHROME STRATEGY DOCUMENT 6: DEBT INSTRUMENTS & ASSET-BACKED LENDING

**Document Version:** 1.0
**Date:** March 27, 2026
**Classification:** Confidential -- Internal Use Only
**Prepared for:** Shane Pierson (CEO), David Whiting (CTO/COO), Chris Ramsey (CRO)
**Purpose:** Complete value creation path for gemstone-collateralized lending, loan participation notes, and DeFi collateralization -- the second major revenue vertical for PleoChrome Holdings LLC

---

## TABLE OF CONTENTS

1. [Executive Summary](#1-executive-summary)
2. [Market Landscape: Precious Asset Lending](#2-market-landscape-precious-asset-lending)
3. [Sub-Path A: Direct Asset-Backed Lending](#3-sub-path-a-direct-asset-backed-lending)
4. [Sub-Path B: Loan Participation Notes](#4-sub-path-b-loan-participation-notes)
5. [Sub-Path C: DeFi Collateralization](#5-sub-path-c-defi-collateralization)
6. [Legal and Regulatory Framework](#6-legal-and-regulatory-framework)
7. [UCC Article 9: Secured Transactions for Gemstones](#7-ucc-article-9-secured-transactions-for-gemstones)
8. [Licensing Requirements](#8-licensing-requirements)
9. [Collateral Custody and Insurance During Loan Term](#9-collateral-custody-and-insurance-during-loan-term)
10. [Default, Workout, and Liquidation Procedures](#10-default-workout-and-liquidation-procedures)
11. [Interest Rate Structures and Usury Law](#11-interest-rate-structures-and-usury-law)
12. [Ongoing Loan Servicing Obligations](#12-ongoing-loan-servicing-obligations)
13. [Complete PleoChrome Fee Structure for Lending Orchestration](#13-complete-pleochrome-fee-structure-for-lending-orchestration)
14. [Competitive Comparison](#14-competitive-comparison)
15. [Revenue Projections](#15-revenue-projections)
16. [Risk Register: Lending-Specific Risks](#16-risk-register-lending-specific-risks)
17. [Implementation Roadmap](#17-implementation-roadmap)
18. [Sources](#18-sources)

---

## 1. EXECUTIVE SUMMARY

PleoChrome's core business is gemstone tokenization orchestration under Reg D 506(c). The **Debt Instruments / Asset-Backed Lending** vertical represents the second major value creation path, leveraging the same infrastructure PleoChrome has already built -- GIA-certified gemstones, institutional vault custody, Chainlink Proof of Reserve, independent appraisals, and a growing network of accredited investors and UHNW asset holders.

### 1.1 The Opportunity

The luxury asset-backed lending market is large, fragmented, and ripe for disruption:

| Market Segment | Estimated Size | Key Players | PleoChrome Advantage |
|----------------|---------------|-------------|---------------------|
| Luxury asset collateral lending (US) | $5-10B+ annually | Borro, Vasco Assets, Diamond Banc, Qollateral | Institutional-grade custody + appraisal infrastructure already in place |
| Private credit / asset-backed notes | $1.7T+ globally (private credit) | Percent (fka Cadence), Yieldstreet, Pipe | Exotic collateral class (gemstones) with verified reserves via Chainlink PoR |
| DeFi RWA lending | $24B+ TVL in RWA protocols (2026) | Aave Horizon, MakerDAO, Centrifuge, Goldfinch | Tokenized gemstone assets (ERC-3643) ready for DeFi collateral integration |

### 1.2 Three Sub-Paths

| Sub-Path | Model | PleoChrome Role | Regulatory Complexity | Revenue Potential | Timeline |
|----------|-------|-----------------|----------------------|-------------------|----------|
| **A. Direct Asset-Backed Lending** | PleoChrome arranges loans collateralized by vaulted, appraised gemstones | Loan arranger / origination platform (NOT the lender) | MEDIUM -- depends on licensing structure | $500K-$2M/yr at scale | Year 1-2 |
| **B. Loan Participation Notes** | PleoChrome structures participations in gem-backed loans as securities offered to accredited investors | Securities issuer / note program sponsor | HIGH -- notes are securities; Reg D 506(c) applies | $1M-$5M/yr at scale | Year 2-3 |
| **C. DeFi Collateralization** | Tokenized gemstone assets (ERC-3643 tokens) used as collateral in DeFi lending protocols | Collateral enabler / protocol integrator | MEDIUM-HIGH -- regulatory uncertainty in DeFi | $250K-$1M/yr at scale | Year 3-4 |

### 1.3 Why This Vertical

1. **Infrastructure reuse:** PleoChrome's 7-Gate Framework (GIA certification, 3-appraisal valuation, institutional custody, Chainlink PoR, ERC-3643 tokenization) is exactly the infrastructure needed to underwrite and secure asset-backed loans
2. **Client demand:** Asset holders who engage PleoChrome for tokenization may prefer lending over equity dilution -- "borrow against your gemstones instead of selling fractional ownership"
3. **Investor demand:** Accredited investors who want gemstone exposure with fixed-income characteristics (regular interest payments, defined maturity, collateral protection) rather than equity-like tokenized ownership
4. **Revenue acceleration:** Lending fees are collected upfront and monthly, not just at token offering milestones. Servicing fees create immediate recurring revenue
5. **Competitive moat:** No existing luxury asset lender has institutional vault custody + blockchain-verified reserves + SEC-compliant token infrastructure

---

## 2. MARKET LANDSCAPE: PRECIOUS ASSET LENDING

### 2.1 Existing Players

#### Borro (borro.com) -- Market Leader

| Attribute | Detail |
|-----------|--------|
| **Model** | Direct collateral lending against luxury assets |
| **Assets accepted** | Jewelry, diamonds, colored gemstones (emeralds, rubies, sapphires), watches, fine art, wine, handbags, classic cars |
| **Loan range** | $2,000 - $10M+ |
| **LTV** | 50-70% of secondary market value |
| **Interest rates** | 3-10% per month (36-120% annualized) |
| **Term** | Short-term (6 months or less) |
| **Credit check** | None |
| **Personal guarantee** | None (non-recourse) |
| **Funding speed** | 1-2 business days |
| **Custody** | Borro takes physical possession of collateral |
| **Clients served** | 15,000+ |
| **Key differentiator** | Speed, discretion, no credit requirements |

#### Vasco Assets (vascoassets.com)

| Attribute | Detail |
|-----------|--------|
| **Model** | Collateral loans + asset sales (dual model) |
| **Assets accepted** | Diamonds, gemstones, jewelry, rare coins, art, paintings, sculptures, watches, precious metals, exotic vehicles, yachts |
| **LTV** | 50-70% |
| **Proprietary product** | LuxLoc -- luxury collateral line of credit (revolving credit against deposited assets) |
| **Key differentiator** | Broadest asset class coverage; revolving credit product |

#### Diamond Banc (diamondbanc.com)

| Attribute | Detail |
|-----------|--------|
| **Model** | Direct collateral lending focused on jewelry/diamonds |
| **Assets accepted** | Jewelry, diamonds, watches, precious metals, designer pieces |
| **Funding speed** | 1-2 business days |
| **Process** | All private -- no credit checks, no financial disclosures |
| **Key differentiator** | Jewelry-specialist expertise; nationwide network |

#### Qollateral (qollateral.com)

| Attribute | Detail |
|-----------|--------|
| **Model** | Luxury asset-backed lending, NYC-based |
| **Assets accepted** | Fine jewelry, diamonds, rare colored gemstones (rubies, emeralds, sapphires), watches, handbags, gold |
| **Loan range** | $2,000 - $10M (same-day) |
| **LTV** | Up to 80% appraised value (highest in market) |
| **Interest payments** | Due every 4 months |
| **Funding** | Same day -- cash, check, or wire |
| **Credit impact** | None -- no credit check, no credit bureau reporting |
| **Key differentiator** | Highest LTV (up to 80%); $10M same-day limit; colored gemstone specialization |

#### Percent (percent.com) -- formerly Cadence

| Attribute | Detail |
|-----------|--------|
| **Model** | Private credit investment platform -- structures asset-backed notes for accredited investors |
| **Assets** | Consumer loans, receivables, litigation finance, merchant cash advances, real estate, and various asset-backed securities |
| **Minimum investment** | $500 per deal |
| **Returns** | 14.47% average annualized return on matured deals; current weighted APY ~16.72% |
| **Total funded** | $1.68B+ in private credit deals |
| **Key differentiator** | NOT a direct lender -- structures participations and notes backed by underlying asset pools |

#### IntaCapital Swiss SA (intacapitalswiss.com)

| Attribute | Detail |
|-----------|--------|
| **Model** | International precious stone financing |
| **Focus** | Mining companies, dealers, and large holders seeking working capital against certified inventory |
| **Key differentiator** | International scope; mining/production financing |

### 2.2 Market Gaps PleoChrome Can Fill

| Gap in Current Market | PleoChrome's Answer |
|----------------------|-------------------|
| **No institutional-grade verification** -- existing lenders do their own appraisals with varying rigor | PleoChrome's 3-appraisal rule + GIA certification + SSEF origin reports = the most rigorous collateral verification in the market |
| **No blockchain-verified custody** -- borrowers and lenders trust the lender/pawnbroker on custody | Chainlink Proof of Reserve + ERC-3643 token registry = cryptographically verifiable, real-time proof that collateral exists and is in custody |
| **No secondary market for loan interests** -- lenders hold 100% of loan risk | PleoChrome can tokenize loan participation interests, enabling fractional investment in gem-backed loans |
| **Predatory rates** -- 36-120% annualized is the norm for luxury pawn-style lending | PleoChrome-arranged loans between institutional lenders and creditworthy borrowers can offer 12-24% annualized (still attractive yield, but not predatory) |
| **No DeFi integration** -- existing lenders are entirely off-chain | PleoChrome's tokenized gemstones can be used as collateral in DeFi protocols, creating an entirely new capital access channel |
| **Short terms only** -- existing lenders offer 6-month terms maximum | PleoChrome can structure 12-36 month loans with quarterly interest payments, suitable for estate planning, business financing, and portfolio leveraging |

---

## 3. SUB-PATH A: DIRECT ASSET-BACKED LENDING

### 3.1 Overview

In this model, PleoChrome acts as a **loan arranger and servicing agent** -- NOT as the direct lender. PleoChrome connects gemstone asset holders (borrowers) with capital providers (lenders -- family offices, HNW individuals, specialty lenders, credit funds) and manages the collateral custody, valuation, and servicing infrastructure.

**Critical structural distinction:** PleoChrome does NOT lend its own capital. PleoChrome is the orchestrator. This distinction is critical for licensing purposes (see Section 8).

### 3.2 Step-by-Step Workflow

---

#### STEP A1: BORROWER INTAKE AND QUALIFICATION

**Step Name:** Borrower Application and Asset Qualification

**Description:** A gemstone holder approaches PleoChrome seeking to borrow against their assets rather than tokenize them. PleoChrome evaluates whether the borrower and their assets qualify for the lending program.

**Who Is Involved:**
- **PleoChrome** -- intake coordinator, initial screening
- **Asset holder / borrower** -- applicant
- **Chris Ramsey (CRO)** -- relationship management, preliminary asset evaluation

**Legal Gates:**
- KYC/AML screening of borrower (same CIP/CDD/EDD framework from Strategy Document 4, Section 1.1)
- OFAC sanctions screening
- PEP screening
- Source-of-funds/source-of-wealth documentation for High-risk borrowers
- Bad Actor screening (Rule 506(d)) -- relevant if loan participation notes will later be offered
- Verify borrower is not subject to any court order, lien, or judgment encumbering the gemstones

**Cost Gates:**
| Item | Low | Mid | High |
|------|-----|-----|------|
| KYC/AML screening (manual Phase 1) | $0 | $50 | $150 |
| Automated screening platform (Phase 2+) | $50 | $150 | $500 |
| Legal review of borrower qualification | $500 | $1,500 | $3,000 |
| **Total** | **$550** | **$1,700** | **$3,650** |

**Timeline:** 3-7 business days

**Dependencies:**
- PleoChrome's AML/KYC policy fully in place (Strategy Doc 4)
- Sanctions screening tools operational
- Engagement agreement template for lending track (distinct from tokenization engagement)

**Revenue for PleoChrome:**
- **Application fee:** $500-$2,500 (non-refundable, credited toward origination fee if loan closes)

**Deliverables/Outputs:**
- Borrower qualification memo (approved/declined with rationale)
- Completed KYC file
- Preliminary asset description and holder-provided documentation
- Executed lending engagement letter

**Risk Factors:**
- Borrower may have undisclosed liens on gemstones
- Borrower identity fraud
- Sanctioned or PEP borrower requiring EDD that delays or kills the deal
- Provenance issues discovered later that disqualify the asset

---

#### STEP A2: GEMSTONE APPRAISAL AND CERTIFICATION

**Step Name:** Collateral Verification and Valuation

**Description:** PleoChrome deploys its 7-Gate Framework to verify, certify, and value the gemstones that will serve as loan collateral. This is the same process used for tokenization, ensuring consistent institutional-grade verification.

**Who Is Involved:**
- **PleoChrome** -- process orchestration, appraiser coordination
- **GIA (Gemological Institute of America)** -- gemstone identification and origin reports
- **3 Independent Appraisers** -- USPAP-compliant, CGA/MGA-credentialed, no affiliations to PleoChrome or borrower
- **Asset holder / borrower** -- provides physical access to gemstones

**Legal Gates:**
- GIA Identification and Origin Reports for all significant stones
- SSEF Origin Determination where geographic origin significantly affects value (e.g., Colombian vs. Zambian emerald)
- All appraisals must be USPAP-compliant
- Appraiser independence verified (no financial relationship with PleoChrome, borrower, or each other)
- If any two appraisals differ by more than 15-20%, a fourth tiebreaker appraisal is required

**Cost Gates:**
| Item | Low | Mid | High |
|------|-----|-----|------|
| GIA Identification Report(s) | $5,000 | $15,000 | $50,000 |
| SSEF Origin Determination | $2,000 | $5,000 | $10,000 |
| Appraisal #1 (independent USPAP) | $3,000 | $7,500 | $15,000 |
| Appraisal #2 (independent USPAP) | $3,000 | $7,500 | $15,000 |
| Appraisal #3 (independent USPAP) | $3,000 | $7,500 | $15,000 |
| Fourth tiebreaker appraisal (if needed) | $0 | $0 | $15,000 |
| Armored transit for appraisals (Brink's/Malca-Amit) | $1,000 | $3,000 | $8,000 |
| Transit insurance | $500 | $1,500 | $5,000 |
| **Total** | **$17,500** | **$47,000** | **$133,000** |

**Who Pays:** The borrower pays all appraisal and certification costs upfront. These costs are either (a) passed through at cost, or (b) PleoChrome charges a markup of 10-20% as part of its arrangement fee.

**Timeline:** 6-10 weeks (GIA turnaround is the bottleneck -- 3-6 weeks for standard service)

**Dependencies:**
- Physical gemstones available for GIA submission and appraiser inspection
- Pre-vetted appraiser panel (same panel used for tokenization)
- Armored transit arrangements in place
- Transit insurance policy active

**Revenue for PleoChrome:**
- **Appraisal coordination fee:** 10-20% markup on pass-through appraisal costs ($1,750-$26,600)
- OR flat coordination fee of $5,000-$15,000

**Deliverables/Outputs:**
- GIA Identification and Origin Report(s)
- SSEF Origin Determination (if applicable)
- Three independent USPAP-compliant appraisals
- PleoChrome Valuation Summary Report (average of two lowest appraisals = "lending value")
- Collateral photographs (high-resolution, gemological detail)
- Provenance documentation file

**Risk Factors:**
- GIA may identify treatments that significantly reduce value
- Wide appraisal variance (>15-20%) signals market uncertainty and higher lending risk
- Transit risk during appraisal chain
- Gemstones may be seized if law enforcement issues a hold order during the process

---

#### STEP A3: COLLATERAL VALUE DETERMINATION AND LTV CALCULATION

**Step Name:** Loan-to-Value Determination

**Description:** Based on the completed appraisals, PleoChrome calculates the maximum loan amount using conservative LTV ratios appropriate for gemstone collateral.

**Who Is Involved:**
- **PleoChrome** -- LTV calculation, risk assessment
- **Securities/lending counsel** -- review of LTV methodology documentation

**Legal Gates:**
- LTV methodology must be documented and consistently applied
- If loan participation notes will later be offered (Sub-Path B), the LTV methodology becomes a material disclosure item

**PleoChrome's Proposed LTV Schedule:**

| Collateral Type | LTV Range | Rationale |
|----------------|-----------|-----------|
| GIA-certified emeralds (Colombian origin, untreated) | 40-55% | Premium stones with strong market; origin premium provides cushion |
| GIA-certified emeralds (other origin or treated) | 30-45% | Lower market demand; treatment reduces resale certainty |
| GIA-certified rubies (Burmese, unheated) | 45-60% | Strongest colored stone market; consistently appreciating |
| GIA-certified rubies (other origin or heated) | 35-50% | Still valuable but less market certainty |
| GIA-certified sapphires (Kashmir, Ceylon, untreated) | 40-55% | Strong collector market |
| GIA-certified sapphires (other origin or heated) | 30-45% | Good but more common |
| Mixed gemstone collections (diversified barrel) | 35-50% | Diversification benefit offset by complexity of liquidation |
| Alexandrite, padparadscha, paraiba tourmaline | 40-55% | Ultra-rare; small market but high per-carat values |

**How This Compares to Market:**

| Lender | Typical LTV | Appraisal Rigor |
|--------|------------|-----------------|
| Borro | 50-70% | Internal appraisal only |
| Qollateral | Up to 80% | Internal + lab reports |
| Vasco Assets | 50-70% | Internal appraisal |
| Diamond Banc | 50-70% | Internal expertise |
| **PleoChrome** | **30-60%** | **3 independent USPAP appraisals + GIA certification** |

**PleoChrome's LTV is intentionally lower** because:
1. Lower LTV protects the lender (and PleoChrome's reputation) against gemstone market volatility
2. The institutional-grade appraisal process provides much higher confidence in the stated value, so a lower LTV against a more reliable value is actually comparable to a higher LTV against an uncertain value
3. Conservative LTV is a selling point for note purchasers in Sub-Path B

**Cost Gates:**
| Item | Low | Mid | High |
|------|-----|-----|------|
| LTV analysis and risk assessment | $0 (internal) | $0 (internal) | $0 (internal) |
| Legal review of LTV methodology | $1,000 | $2,500 | $5,000 |
| **Total** | **$1,000** | **$2,500** | **$5,000** |

**Timeline:** 2-3 business days after appraisals complete

**Dependencies:**
- All three appraisals complete with no variance issues
- Gemstone market data current (GemGuide, Gemval subscription)

**Revenue for PleoChrome:**
- No direct fee at this step (embedded in origination fee at Step A5)

**Deliverables/Outputs:**
- LTV Calculation Memo
- Maximum Loan Amount determination
- Risk tier classification (Low/Medium/High based on stone type, origin, market conditions)

**Risk Factors:**
- Gemstone markets are illiquid and opaque; LTV calculation based on appraised value may not reflect achievable liquidation price
- Rapid market decline between appraisal and loan origination
- Borrower may dispute the LTV and maximum loan amount

---

#### STEP A4: COLLATERAL TRANSFER TO INSTITUTIONAL CUSTODY

**Step Name:** Collateral Deposit and Custody Verification

**Description:** Gemstones are transferred from the borrower to an institutional vault facility (Brink's, Malca-Amit, or equivalent) where they will remain for the duration of the loan. Custody is verified via Chainlink Proof of Reserve.

**Who Is Involved:**
- **PleoChrome** -- custody coordination, vault instruction letter
- **Asset holder / borrower** -- delivers gemstones to vault
- **Institutional vault (Brink's, Malca-Amit, Loomis)** -- receives, inspects, secures gemstones
- **Chainlink PoR oracle** -- on-chain verification of custody status

**Legal Gates:**
- Executed Custody Agreement (tripartite: PleoChrome, borrower, vault)
- Custody agreement must specify that:
  - Vault is bailee; borrower retains legal ownership until default
  - Gemstones are segregated (allocated storage, NOT commingled)
  - Vault will not release gemstones without written authorization from both PleoChrome (as agent for lender) and borrower
  - After loan origination, release requires PleoChrome (agent) authorization only
  - Gemstones are NOT part of vault's bankruptcy estate
  - Vault carries its own liability insurance
  - Vault provides immediate notification of any security incident
- UCC-1 Financing Statement filed (see Section 7)
- Specie insurance bound (see Section 9)

**Cost Gates:**
| Item | Low | Mid | High |
|------|-----|-----|------|
| Armored transit to vault | $500 | $2,000 | $5,000 |
| Transit insurance | $500 | $1,500 | $5,000 |
| Vault intake/inspection fee | $500 | $1,000 | $3,000 |
| Annual vault custody fee (0.3-0.5% of collateral value) | $3,000 | $25,000 | $75,000 |
| Specie insurance (0.2-0.4% of insured value annually) | $2,000 | $20,000 | $60,000 |
| UCC-1 filing fee | $10 | $30 | $100 |
| Chainlink PoR setup (if not already active) | $5,000 | $10,000 | $25,000 |
| **Total Year 1** | **$11,510** | **$59,530** | **$173,100** |

**Who Pays:** Custody and insurance costs are typically borne by the borrower (deducted from loan proceeds or paid separately). UCC filing and PoR costs are PleoChrome's operational expense (recovered through servicing fees).

**Timeline:** 3-7 business days (vault intake after gemstones arrive)

**Dependencies:**
- Vault agreement in place (same vaults used for tokenization)
- Insurance broker relationship active
- Chainlink PoR oracle deployed (or manual attestation until PoR is live)
- UCC-1 form prepared

**Revenue for PleoChrome:**
- **Custody arrangement fee:** $1,000-$5,000 one-time
- **Ongoing custody oversight fee:** Embedded in monthly servicing fee (Step A7)

**Deliverables/Outputs:**
- Vault Receipt (official warehouse receipt listing all deposited gemstones with GIA numbers)
- Specie Insurance Certificate naming lender as loss payee and PleoChrome as additional insured
- UCC-1 Financing Statement (filed)
- Chainlink PoR activation confirmation (on-chain)
- Custody Verification Memo

**Risk Factors:**
- Transit loss or damage before vault receipt
- Vault operator error in receiving/cataloging
- Insurance gap between borrower possession and vault custody
- Vault insolvency (mitigated by bailee structure and bankruptcy-remote provisions)

---

#### STEP A5: LENDER MATCHING AND LOAN ORIGINATION

**Step Name:** Capital Provider Sourcing and Loan Documentation

**Description:** PleoChrome matches the qualified borrower and verified collateral with an appropriate capital provider (lender). PleoChrome structures the loan terms, prepares documentation, and coordinates the closing.

**Who Is Involved:**
- **PleoChrome** -- loan structuring, documentation, lender sourcing
- **Capital provider / lender** -- family office, credit fund, HNW individual, or specialty lender
- **Asset holder / borrower** -- executes loan documents
- **Securities/lending counsel** -- prepares or reviews loan documents
- **Custodian/vault** -- issues confirmation of custody

**Legal Gates:**
- Executed Promissory Note (borrower to lender)
- Executed Security Agreement (borrower grants security interest in gemstones to lender)
- UCC-1 Financing Statement perfecting security interest (if not already filed at Step A4)
- Lender Accreditation Verification (if lender is investing through a note offering under Sub-Path B)
- Truth in Lending Act (TILA) compliance -- ONLY if borrower is a natural person borrowing for personal, family, or household purposes (likely exempt for business/investment purpose loans)
- Usury law compliance for the applicable jurisdiction (see Section 11)
- Intercreditor agreement (if multiple lenders participate)

**Loan Documentation Package:**
1. **Promissory Note** -- principal amount, interest rate, payment schedule, maturity date, default provisions
2. **Security Agreement** -- grants lender a perfected security interest in the gemstones; describes collateral by reference to GIA certificates
3. **Pledge Agreement** -- additional document evidencing the pledge of physical custody to secured party
4. **Custody Control Agreement** -- directs vault to follow lender/PleoChrome instructions regarding collateral release
5. **Loan Servicing Agreement** -- appoints PleoChrome as servicing agent
6. **Personal Guarantee** (optional) -- if the borrower is an entity, the principal may provide a personal guarantee
7. **UCC-1 Financing Statement** -- filed with the Secretary of State
8. **Insurance Assignment** -- assigns specie insurance proceeds to lender as loss payee

**Cost Gates:**
| Item | Low | Mid | High |
|------|-----|-----|------|
| Legal counsel -- loan document preparation | $5,000 | $15,000 | $35,000 |
| Legal counsel -- lender-side review | $2,000 | $5,000 | $15,000 |
| UCC-1 filing (if not already filed) | $10 | $30 | $100 |
| UCC search (to confirm no prior liens) | $25 | $50 | $150 |
| Title opinion / lien search | $500 | $1,500 | $3,000 |
| Escrow agent for loan proceeds (if used) | $500 | $1,500 | $3,000 |
| **Total** | **$8,035** | **$23,080** | **$56,250** |

**Who Pays:** Legal costs are split by negotiation. Typically borrower pays PleoChrome's origination fee which covers PleoChrome's legal costs; lender pays their own counsel.

**Timeline:** 2-4 weeks (from lender match to loan closing)

**Dependencies:**
- Collateral in vault and verified (Steps A2-A4 complete)
- At least one qualified capital provider in PleoChrome's lender network
- All legal documents prepared and reviewed
- Insurance certificate with lender named as loss payee

**Revenue for PleoChrome:**
- **Origination fee (from borrower):** 1.5-3.0% of loan principal
- **Placement fee (from lender):** 0.5-1.0% of loan principal (paid by lender for access to the deal)
- **Example on a $5M loan:**
  - Borrower origination fee (2.0%): $100,000
  - Lender placement fee (0.75%): $37,500
  - **Total origination revenue: $137,500**

**Deliverables/Outputs:**
- Executed loan package (all documents above)
- Wire confirmation of loan proceeds to borrower
- Updated UCC-1 (if amended)
- Loan Tape entry (master loan tracking record)
- Lender welcome package (servicing contact, reporting schedule, collateral verification access)

**Risk Factors:**
- Lender may require additional collateral protections PleoChrome cannot accommodate
- Loan terms may not satisfy borrower's needs (lower principal, higher rate than expected)
- Lender default on funding commitment
- Market downturn between term sheet and closing affects appetite

---

#### STEP A6: LOAN FUNDING AND POST-CLOSING

**Step Name:** Disbursement and Post-Closing Administration

**Description:** Loan proceeds are disbursed to the borrower. PleoChrome completes all post-closing administrative tasks and activates the servicing infrastructure.

**Who Is Involved:**
- **PleoChrome** -- closing coordinator, servicing setup
- **Lender** -- wires loan proceeds
- **Borrower** -- receives funds
- **Escrow agent (if applicable)** -- manages fund flow

**Legal Gates:**
- Confirm all closing conditions have been met before authorizing disbursement
- Verify UCC-1 has been accepted by Secretary of State (search confirmation)
- Confirm insurance certificate received and valid
- Confirm vault custody receipt matches GIA documentation

**Cost Gates:**
| Item | Low | Mid | High |
|------|-----|-----|------|
| Wire transfer fees | $25 | $50 | $100 |
| Post-closing legal review | $500 | $1,500 | $3,000 |
| Servicing system setup | $0 (internal) | $500 | $2,000 |
| **Total** | **$525** | **$2,050** | **$5,100** |

**Timeline:** 1-3 business days after loan document execution

**Dependencies:**
- All prior steps complete
- Lender has wired funds to escrow or directly to borrower
- All conditions precedent satisfied

**Revenue for PleoChrome:**
- Origination fee collected at closing (see Step A5)

**Deliverables/Outputs:**
- Closing Binder (complete executed loan package)
- UCC-1 filing receipt from Secretary of State
- Wire confirmation
- Borrower payment schedule
- Servicing file opened in PleoChrome's loan administration system

**Risk Factors:**
- Wire fraud risk (verify all wire instructions by phone)
- Post-closing document deficiencies (missing signatures, incorrect dates)
- UCC filing rejection by Secretary of State (extremely rare; usually clerical error)

---

#### STEP A7: ONGOING LOAN SERVICING

**Step Name:** Monthly Servicing and Collateral Monitoring

**Description:** PleoChrome serves as the loan servicing agent throughout the loan term, collecting interest payments from the borrower, remitting to the lender, monitoring collateral value, maintaining custody verification, and managing insurance renewals.

**Who Is Involved:**
- **PleoChrome** -- loan servicer
- **Borrower** -- makes monthly/quarterly interest payments
- **Lender** -- receives interest distributions
- **Vault** -- provides ongoing custody confirmations
- **Insurance carrier** -- maintains specie coverage
- **Appraiser (annual)** -- re-appraisal for collateral value monitoring

**Legal Gates:**
- Comply with Loan Servicing Agreement terms
- Maintain accurate payment records
- Provide timely borrower notices (payment reminders, default notices if applicable)
- Annual reappraisal to verify collateral coverage ratio
- Ongoing sanctions re-screening of borrower (quarterly)
- UCC-1 continuation statement filed before 5-year expiration (if loan term exceeds 5 years)
- Insurance coverage maintained at or above loan principal amount

**Ongoing Servicing Tasks:**

| Task | Frequency | Description |
|------|-----------|-------------|
| Collect borrower interest payment | Monthly or quarterly | ACH or wire from borrower |
| Remit interest to lender (less servicing fee) | Monthly or quarterly | Net of PleoChrome's servicing spread |
| Vault custody verification | Monthly | Confirm gemstones remain in custody (Chainlink PoR or vault report) |
| Chainlink PoR feed monitoring | Daily (automated) | Alert if feed goes stale or reports custody failure |
| Borrower sanctions re-screening | Quarterly | OFAC, EU, UN sanctions lists |
| Insurance renewal coordination | Annually | Ensure specie coverage remains current and adequate |
| Collateral reappraisal | Annually | Single independent appraiser; compare to original LTV |
| LTV recalculation | Annually (or upon reappraisal) | If LTV exceeds maximum, trigger margin call or loan modification |
| Borrower financial status check | Semi-annually | For recourse loans: verify borrower's financial condition |
| Lender reporting | Monthly or quarterly | Collateral status, payment status, NAV update, market conditions |
| UCC continuation filing | Before 5th anniversary | Maintain perfected security interest |

**Cost Gates:**
| Item | Low | Mid | High |
|------|-----|-----|------|
| Loan servicing system/software | $0 (spreadsheet) | $200/month | $1,000/month |
| Annual reappraisal | $3,000 | $7,500 | $15,000 |
| Sanctions re-screening (4x/year) | $0 (manual) | $200 | $2,000 |
| Insurance renewal coordination | $0 (internal) | $500 | $1,000 |
| UCC continuation filing (every 5 years) | $10 | $30 | $100 |
| Chainlink PoR maintenance | $500/yr | $2,500/yr | $10,000/yr |
| Legal counsel (ad hoc questions) | $500/yr | $2,500/yr | $10,000/yr |
| **Total Annual** | **$4,010** | **$16,130** | **$51,100** |

**Timeline:** Continuous throughout loan term

**Dependencies:**
- Servicing agreement executed
- Payment processing infrastructure (bank account, ACH capability)
- Automated monitoring tools (Chainlink PoR, sanctions screening)
- Appraiser panel maintained

**Revenue for PleoChrome:**
- **Monthly servicing fee:** 0.50-1.00% of outstanding loan principal per annum (collected monthly)
  - On a $5M loan at 0.75% annual servicing: $37,500/year ($3,125/month)
- **Interest rate spread:** PleoChrome may earn a spread between the rate charged to the borrower and the rate paid to the lender (e.g., borrower pays 18% annualized; lender receives 14% annualized; PleoChrome retains 4% spread = $200,000/year on a $5M loan)
  - OR the servicing fee replaces the spread (one or the other, not both, depending on structure)
- **Reappraisal coordination fee:** $1,000-$3,000/year per loan
- **Late payment fees:** 5% of overdue amount (passed through to lender or retained by servicer per agreement)

**Deliverables/Outputs:**
- Monthly/quarterly lender reports
- Monthly/quarterly payment records
- Annual reappraisal report and LTV recalculation
- Annual insurance confirmation
- Sanctions screening log
- Chainlink PoR audit trail

**Risk Factors:**
- Borrower default (see Section 10)
- Collateral value decline below LTV threshold (margin call situation)
- Insurance lapse
- Chainlink PoR disruption
- PleoChrome operational failure in servicing (payments misrouted, deadlines missed)

---

#### STEP A8: LOAN MATURITY, PAYOFF, OR RENEWAL

**Step Name:** Loan Resolution

**Description:** At loan maturity, the borrower repays principal and any accrued interest, PleoChrome releases the collateral, and the security interest is terminated.

**Who Is Involved:**
- **PleoChrome** -- payoff coordination, collateral release
- **Borrower** -- repays loan
- **Lender** -- receives principal repayment
- **Vault** -- releases gemstones upon PleoChrome instruction
- **Secretary of State** -- UCC-3 termination filing

**Scenarios:**

| Scenario | Process | PleoChrome Action |
|----------|---------|-------------------|
| **Full payoff at maturity** | Borrower pays outstanding principal + interest + any fees | Verify payment, instruct vault to release collateral, file UCC-3 termination, close servicing file |
| **Early payoff** | Borrower prepays (may include prepayment premium per note terms) | Same as above; collect any prepayment fee per agreement |
| **Loan renewal / extension** | Borrower and lender agree to extend term | New or amended promissory note; reappraisal to confirm current LTV; UCC continuation if needed |
| **Refinance with new lender** | New lender pays off existing lender; new loan documents | Simultaneous closing: old lender paid off, new UCC-1 filed, same collateral remains in vault |
| **Default** | Borrower fails to pay | See Section 10 (Default/Workout/Liquidation) |

**Cost Gates:**
| Item | Low | Mid | High |
|------|-----|-----|------|
| Payoff processing | $0 (internal) | $250 | $500 |
| UCC-3 Termination Statement filing | $10 | $30 | $50 |
| Vault release fee | $100 | $500 | $1,000 |
| Armored transit (return to borrower) | $500 | $2,000 | $5,000 |
| Legal review (if renewal/refi) | $1,000 | $5,000 | $15,000 |
| **Total (payoff)** | **$610** | **$2,780** | **$6,550** |
| **Total (renewal/refi)** | **$1,610** | **$7,780** | **$21,550** |

**Timeline:**
- Payoff: 3-7 business days from receipt of funds to collateral release
- Renewal: 2-4 weeks (reappraisal + new documents)
- Refinance: 3-6 weeks (full new lender process)

**Revenue for PleoChrome:**
- **Payoff administration fee:** $500-$2,000
- **Renewal origination fee:** 0.5-1.0% of renewed principal (reduced from initial origination since collateral is already verified)
- **Refinance origination fee:** 1.0-2.0% of new loan principal

**Deliverables/Outputs:**
- Payoff statement
- UCC-3 Termination Statement (filed)
- Vault release instruction letter
- Armored transit confirmation
- Final lender accounting
- Loan closed in servicing system

**Risk Factors:**
- Borrower disputes payoff amount
- Collateral damage discovered at release
- Vault delays in processing release
- Disputes over late fees or accrued interest calculations

---

### 3.3 Total Fee Stack -- Direct Lending (Sub-Path A)

**Example: $10M gemstone collection, $5M loan at 50% LTV, 24-month term**

| Fee | Amount | When Collected |
|-----|--------|----------------|
| Application fee | $1,500 | At application |
| Appraisal coordination fee | $8,000 | After appraisals complete |
| Custody arrangement fee | $3,000 | At vault deposit |
| Origination fee (2% of $5M, from borrower) | $100,000 | At loan closing |
| Placement fee (0.75% of $5M, from lender) | $37,500 | At loan closing |
| Annual servicing fee (0.75% of $5M x 2 years) | $75,000 | Monthly over 24 months |
| Interest rate spread (4% of $5M x 2 years) | $400,000 | Monthly over 24 months |
| Reappraisal coordination (2 annual) | $4,000 | Annually |
| Payoff administration fee | $1,000 | At maturity |
| **Total PleoChrome Revenue (24-month loan)** | **$630,000** | |
| **Annualized Revenue** | **$315,000** | |

---

## 4. SUB-PATH B: LOAN PARTICIPATION NOTES

### 4.1 Overview

In this model, PleoChrome originates or arranges gemstone-collateralized loans (as in Sub-Path A), then structures **participation interests in those loans** as securities offered to accredited investors under Reg D 506(c). This allows PleoChrome to:

1. Source capital from multiple investors for a single large loan
2. Create a fixed-income security product backed by gemstone collateral
3. Generate additional fee revenue from the note offering process

### 4.2 When Is a Loan Participation Interest a Security?

**The Reves Test (Supreme Court, 1993):** Every note is presumed to be a security. This presumption is rebutted only if the note "bears a strong family resemblance" to categories of notes judicially recognized as non-securities:
- Notes for consumer financing
- Notes secured by a home mortgage
- Short-term notes secured by liens on small businesses
- Notes evidencing character loans to bank customers
- Short-term notes secured by accounts receivable
- Notes formalizing open-account debts in ordinary business

**Critical analysis for PleoChrome:**

| Factor | Reves Test Question | PleoChrome Loan Participation Notes |
|--------|-------------------|-------------------------------------|
| **Motivation** | Why are seller and buyer entering the transaction? | Seller (PleoChrome/borrower): to raise capital. Buyer (investor): to earn a return on investment. This looks like an investment context = SECURITY |
| **Plan of distribution** | Are the instruments being offered to a broad segment of the public? | Under 506(c), notes would be offered broadly to accredited investors with general solicitation = SECURITY |
| **Reasonable expectations** | Would a reasonable investor expect the note to be a security? | Yes -- investor is purchasing a fractional participation in a loan for yield = SECURITY |
| **Risk-reducing factor** | Is there an alternative regulatory scheme that reduces the risk? | The collateralization reduces credit risk but does not change the securities analysis = SECURITY |

**Conclusion: Loan participation interests offered to investors by PleoChrome WILL BE securities.** They must be offered under a securities exemption (Reg D 506(c), the same framework PleoChrome uses for tokenization).

**Important distinction:** The Kirschner v. JP Morgan Chase Bank (2nd Circuit, 2023) decision held that syndicated loans between sophisticated institutional parties are NOT securities. However, that case involved direct loan participations between banks, not notes offered to the public or accredited investors for investment purposes. PleoChrome's model is closer to a note offering than a bank syndication.

### 4.3 Step-by-Step Workflow

---

#### STEP B1: LOAN ORIGINATION (Same as Steps A1-A4)

The underlying loan is originated using the same process as Sub-Path A, Steps A1-A4. The borrower is qualified, gemstones are appraised and certified, collateral is deposited in custody, and the loan terms are structured.

**Additional consideration:** When PleoChrome intends to offer participation notes, the loan documents must be structured from the outset to contemplate participation. The promissory note should permit assignment and participation of interests.

---

#### STEP B2: NOTE PROGRAM STRUCTURING

**Step Name:** Participation Note Securities Structuring

**Description:** PleoChrome (through a dedicated SPV) structures the loan participation interests as securities (notes) to be offered to accredited investors.

**Who Is Involved:**
- **PleoChrome** -- program sponsor
- **SPV (Wyoming Series LLC)** -- note issuer (same SPV structure used for tokenization)
- **Securities counsel** -- structures the offering, drafts PPM and note documents
- **Tax counsel** -- advises on note tax treatment
- **Transfer agent (Vertalo or Securitize)** -- if notes are tokenized

**Legal Gates:**
- SPV formation (or use existing Series LLC with a new series for the note program)
- PPM drafted specifically for note offering (distinct from equity/tokenization PPM)
- Note Indenture or Note Purchase Agreement
- Reg D 506(c) exemption -- all note purchasers must be verified accredited investors
- Form D filing within 15 days of first note sale
- Blue Sky filings in all states where notes are sold
- If notes are tokenized: ERC-3643 compliance, transfer agent engagement, all requirements from SEC-COMPLIANCE-RESEARCH.md

**Key Note Terms to Structure:**

| Term | Range | Notes |
|------|-------|-------|
| Note denomination | $25,000 - $250,000 minimum | Higher minimum for first offering; lower minimum when track record established |
| Interest rate (coupon) | 8-14% annualized | Fixed rate; paid quarterly or semi-annually |
| Maturity | 12-36 months | Matched to underlying loan maturity |
| Security | Senior secured -- backed by gemstone collateral via the underlying loan | Notes participate in the security interest |
| LTV | 30-60% (underlying loan) | Conservative collateral coverage |
| Payment waterfall | Interest -> PleoChrome servicing fee -> Principal reserve -> Investors | Defined payment priority |
| Prepayment | Permitted after 6-month lockup, with 1-2% prepayment premium | Provides yield protection for investors |
| Default remedy | Collateral liquidation (see Section 10) | Proceeds distributed to note holders per waterfall |

**Cost Gates:**
| Item | Low | Mid | High |
|------|-----|-----|------|
| Securities counsel -- note PPM and documents | $25,000 | $50,000 | $100,000 |
| SPV formation (new series) | $1,000 | $2,500 | $5,000 |
| Tax counsel opinion | $5,000 | $10,000 | $15,000 |
| Transfer agent setup (if tokenized notes) | $5,000 | $15,000 | $25,000 |
| Smart contract audit (if tokenized) | $10,000 | $25,000 | $50,000 |
| Form D + Blue Sky filings | $5,000 | $10,000 | $15,000 |
| **Total** | **$51,000** | **$112,500** | **$210,000** |

**Timeline:** 6-10 weeks (can overlap with underlying loan origination)

**Dependencies:**
- Underlying loan fully originated and funded (or commitment from lead lender)
- Securities counsel engaged with note offering experience
- SPV structure approved by counsel

**Revenue for PleoChrome:**
- **Structuring fee:** 1.0-2.0% of total note offering amount
- **Example:** $5M note offering x 1.5% = $75,000

**Deliverables/Outputs:**
- Note PPM (Private Placement Memorandum)
- Note Indenture or Note Purchase Agreement
- Subscription Agreement for note purchasers
- Investor Questionnaire and Accredited Investor Certification
- Form D (filed)
- Blue Sky filings (filed)
- If tokenized: ERC-3643 note tokens deployed on Polygon

**Risk Factors:**
- SEC treats notes as securities -- full compliance required
- PPM must comprehensively disclose all risks of gemstone-backed notes (gemstone market risk, appraisal risk, custody risk, borrower default risk, illiquidity risk)
- If the underlying loan defaults, note holders may not recover full principal even after collateral liquidation
- Regulatory change risk (SEC or state regulators challenge the note structure)

---

#### STEP B3: NOTE OFFERING AND INVESTOR ONBOARDING

**Step Name:** Note Distribution to Accredited Investors

**Description:** PleoChrome markets the note offering to accredited investors, processes subscriptions, verifies accreditation, and issues notes.

**Who Is Involved:**
- **PleoChrome** -- marketing, investor relations, subscription processing
- **Broker-dealer (Dalmore or equivalent)** -- if engaged for distribution
- **Accredited investors** -- note purchasers
- **Accreditation verification platform (VerifyInvestor, InvestReady)** -- investor verification
- **Transfer agent** -- records note ownership

**Legal Gates:**
- All 506(c) requirements apply (same as tokenization offering):
  - General solicitation permitted
  - Every investor must be verified accredited
  - Anti-fraud rules apply to all marketing
  - Risk disclosures required
- Subscription agreement executed by each investor
- Accredited investor verification completed per SEC standards (including March 2025 no-action letter for $200K+ minimum investment self-certification)

**Cost Gates:**
| Item | Low | Mid | High |
|------|-----|-----|------|
| Marketing and investor acquisition | $10,000 | $35,000 | $80,000 |
| Broker-dealer fees (1-3% of capital raised) | $50,000 | $100,000 | $150,000 |
| Investor verification ($50-$150/investor) | $1,500 | $5,000 | $15,000 |
| **Total** | **$61,500** | **$140,000** | **$245,000** |

**Timeline:** 4-12 weeks (active fundraising period)

**Dependencies:**
- PPM complete and counsel-approved
- Marketing materials reviewed by counsel
- BD engagement (if applicable)
- Investor verification platform configured

**Revenue for PleoChrome:**
- **Success fee (from note offering):** 1.0-1.5% of capital raised
- **Example:** $5M raised x 1.25% = $62,500

**Deliverables/Outputs:**
- Executed subscription agreements from all investors
- Accreditation verification records
- KYC/AML files for each investor
- Note registry (or on-chain token registry if tokenized)
- Wire confirmations for all investor funding
- Investor welcome package (reporting schedule, collateral verification access, servicing contact)

**Risk Factors:**
- Insufficient investor demand (offering does not fill)
- Investor withdrawal before closing
- Verification failure (investor cannot prove accreditation)
- BD relationship issues

---

#### STEP B4: NOTE SERVICING (Ongoing)

**Step Name:** Interest Distribution and Note Administration

**Description:** Throughout the note term, PleoChrome services the underlying loan, collects interest from the borrower, and distributes interest payments to note holders according to the payment waterfall.

**Process Flow:**
```
Borrower pays interest -> PleoChrome (servicer) ->
  1. PleoChrome servicing fee deducted
  2. Principal reserve (if structured)
  3. Net interest distributed pro-rata to note holders
```

**Revenue for PleoChrome:**
- **Servicing fee:** 0.50-1.00% per annum of outstanding note balance
- **Interest spread:** Difference between borrower rate and note coupon
  - Example: Borrower pays 18%; Note holders receive 12%; PleoChrome retains 6% spread
  - On $5M: $300,000/year in spread income
- **Late fees, extension fees, modification fees:** As applicable

**Deliverables/Outputs:**
- Quarterly interest distributions to note holders
- Quarterly investor reports (payment status, collateral status, LTV update)
- Annual K-1 tax documents (if SPV is partnership) or 1099-INT (if notes are debt instruments)
- Ongoing Chainlink PoR verification
- Annual reappraisal reports

---

#### STEP B5: NOTE MATURITY AND PRINCIPAL RETURN

At maturity, the borrower repays the loan principal. PleoChrome distributes principal to note holders pro-rata, files UCC-3 termination, releases collateral, and closes the note program.

**Revenue for PleoChrome:**
- **Exit administration fee:** $2,000-$10,000

---

### 4.4 Total Fee Stack -- Loan Participation Notes (Sub-Path B)

**Example: $10M gemstone collection, $5M loan, $5M note offering to 20 investors, 24-month term**

| Fee | Amount | When Collected |
|-----|--------|----------------|
| All Sub-Path A fees (origination, servicing) | $630,000 | Per Sub-Path A schedule |
| Note structuring fee (1.5% of $5M) | $75,000 | At note offering launch |
| Note offering success fee (1.25% of $5M) | $62,500 | As investors fund |
| Additional interest spread from note structure (6% of $5M x 2 years) | $600,000 | Monthly over 24 months |
| Note servicing premium (additional reporting, distributions to 20 investors) | $25,000/year x 2 | Over 24 months |
| Exit administration fee | $5,000 | At maturity |
| **Total PleoChrome Revenue (24-month program)** | **~$1,422,500** | |
| **Annualized Revenue** | **~$711,250** | |

**Note:** The interest spread in Sub-Path B replaces (not adds to) the interest spread in Sub-Path A. The total is additive for fees unique to the note structuring.

---

## 5. SUB-PATH C: DeFi COLLATERALIZATION

### 5.1 Overview

In this model, PleoChrome's tokenized gemstone assets (ERC-3643 tokens already issued through the tokenization vertical) are used as collateral in DeFi lending protocols. Token holders can deposit their gemstone tokens into DeFi protocols to borrow stablecoins (USDC, GHO, DAI) against the value of their tokenized gemstone holdings.

### 5.2 Current DeFi RWA Lending Landscape (March 2026)

| Protocol | TVL/AUM | RWA Integration | Collateral Types | Relevance to PleoChrome |
|----------|---------|-----------------|-----------------|------------------------|
| **MakerDAO (Sky)** | $2B+ in RWA collateral | Native vaults for RWA | Tokenized Treasuries, structured credit, money market funds | Could accept gemstone tokens if sufficient liquidity/price oracle exists |
| **Aave (Horizon)** | $580M+ net deposits | Permissioned V3 market for institutions | Tokenized Treasuries, CLOs; Chainlink NAV feeds for pricing | Most promising for PleoChrome -- Chainlink integration already aligned |
| **Centrifuge** | $1.1B+ active loans | Pool-based RWA lending | Trade receivables, real estate, structured credit | Infrastructure for PleoChrome to create gemstone lending pools |
| **Goldfinch** | Active | Off-chain collateral focus | Emerging market business loans | Less relevant (different collateral thesis) |

### 5.3 Technical Requirements

For PleoChrome's ERC-3643 gemstone tokens to be accepted as DeFi collateral, the following infrastructure must exist:

**1. Price Oracle**
- A reliable on-chain price feed for gemstone tokens
- Chainlink PoR already verifies custody; an additional NAV oracle feed is needed
- PleoChrome would publish NAV on-chain via Chainlink custom data feed
- NAV updates: weekly or monthly (not daily -- gemstones are illiquid; daily price feeds would be artificial)

**2. Liquidation Mechanism**
- DeFi protocols require the ability to liquidate collateral if the loan becomes undercollateralized
- For gemstone tokens, liquidation would mean selling the tokens on a secondary market or through an auction mechanism
- Requires an active secondary market for gemstone tokens (ATS/OTC trading)
- OR a guaranteed buyback mechanism by PleoChrome/SPV at NAV

**3. Compliance Wrapper**
- ERC-3643 tokens have built-in transfer restrictions (only verified identities can hold tokens)
- DeFi protocol smart contracts must be whitelisted in the Identity Registry to receive tokens as collateral
- The protocol itself must pass KYC/AML verification through the ERC-3643 compliance module

**4. Insurance/Guarantee Layer**
- DeFi lenders will want assurance that the underlying gemstones are insured
- Chainlink PoR provides custody verification
- Insurance certificate status could be published on-chain via an additional oracle

### 5.4 Step-by-Step Workflow

---

#### STEP C1: TOKEN HOLDER INITIATES DeFi BORROW

**Step Name:** Collateral Deposit into DeFi Protocol

**Description:** A holder of PleoChrome ERC-3643 gemstone tokens deposits their tokens into a DeFi lending protocol (Aave Horizon, Centrifuge pool, or custom PleoChrome protocol) as collateral to borrow stablecoins.

**Who Is Involved:**
- **Token holder** -- deposits gemstone tokens as collateral
- **DeFi protocol** -- receives tokens, issues loan (stablecoins)
- **PleoChrome** -- maintains oracle feeds, compliance module, and integration infrastructure
- **Chainlink** -- provides NAV oracle and PoR verification

**Legal Gates:**
- Token holder must be a verified accredited investor (already enforced by ERC-3643 Identity Registry)
- DeFi protocol must be whitelisted in ERC-3643 compliance module
- Terms of the SPV operating agreement must permit token holders to pledge tokens as DeFi collateral
- Securities counsel must opine on whether DeFi borrowing creates any new securities implications for the underlying gemstone tokens

**Cost Gates:**
| Item | Low | Mid | High |
|------|-----|-----|------|
| Oracle development and deployment (NAV feed) | $10,000 | $25,000 | $75,000 |
| DeFi protocol integration development | $15,000 | $50,000 | $150,000 |
| Smart contract audit (integration) | $10,000 | $25,000 | $50,000 |
| Legal opinion (DeFi collateral implications) | $5,000 | $15,000 | $30,000 |
| **Total (one-time setup)** | **$40,000** | **$115,000** | **$305,000** |

**Timeline:** 3-6 months for protocol integration (one-time)

**Dependencies:**
- Active tokenized gemstone offering with secondary market liquidity
- Chainlink NAV oracle deployed and operational
- At least one DeFi protocol willing to accept gemstone tokens as collateral
- Legal opinion confirming permissibility

**Revenue for PleoChrome:**
- **Protocol integration fee (one-time):** Negotiated with DeFi protocol
- **Ongoing oracle maintenance fee:** Embedded in servicing costs to the SPV
- **DeFi yield spread:** PleoChrome may earn a portion of the interest rate charged by the DeFi protocol (revenue share with protocol)

**Risk Factors:**
- Smart contract risk in the DeFi protocol (hack, exploit, bug)
- Oracle failure leading to incorrect liquidation
- Regulatory enforcement against DeFi lending protocols
- Token illiquidity preventing orderly DeFi liquidation
- ERC-3643 transfer restrictions may be incompatible with DeFi protocol mechanics

---

#### STEP C2: ONGOING DeFi POSITION MANAGEMENT

**Step Name:** Position Monitoring and Oracle Maintenance

**Description:** While gemstone tokens are deposited as DeFi collateral, PleoChrome maintains the infrastructure that keeps the position viable: oracle feeds, compliance whitelists, and custody verification.

**Revenue for PleoChrome:**
- **DeFi enablement fee:** 0.25-0.50% per annum of DeFi-collateralized token value
- **Oracle maintenance:** Recovered through SPV admin fees

---

#### STEP C3: DeFi LOAN REPAYMENT OR LIQUIDATION

**Step Name:** Position Resolution

**Description:** The token holder either repays the DeFi loan (recovering their gemstone tokens) or the position is liquidated (tokens sold to repay the DeFi loan).

**Liquidation Scenario:**
If the gemstone token NAV falls below the DeFi protocol's liquidation threshold, the protocol will attempt to sell the tokens. This requires:
1. An active buyer in the secondary market, OR
2. A PleoChrome/SPV buyback guarantee at NAV, OR
3. An auction mechanism with a minimum reserve price

**Risk Factors:**
- Liquidation at below-NAV prices due to thin secondary market
- Token transfer restrictions (ERC-3643) may slow or prevent DeFi liquidation
- Legal uncertainty about enforcement of DeFi smart contract liquidations on security tokens

---

### 5.5 PleoChrome's DeFi Strategy: Phase Approach

| Phase | Timing | Action | Revenue Potential |
|-------|--------|--------|-------------------|
| **Phase 1: Research & Legal** | Year 2 | Securities counsel opinion on DeFi collateral use for security tokens; identify protocol partners | $0 |
| **Phase 2: Pilot Integration** | Year 2-3 | Integrate with one DeFi protocol (Aave Horizon or Centrifuge) with a small pool; deploy NAV oracle | $50K-$100K/yr |
| **Phase 3: Scale** | Year 3-4 | Multiple protocol integrations; marketing DeFi borrowing as a feature to token holders | $250K-$1M/yr |

---

## 6. LEGAL AND REGULATORY FRAMEWORK

### 6.1 Federal Securities Law

**When are loans/notes securities?**

| Structure | Securities Status | Legal Basis |
|-----------|------------------|-------------|
| **Direct loan (single lender to single borrower)** | Generally NOT a security | Not offered to the public; commercial/banking context |
| **Loan participation sold to investors** | Likely a SECURITY under the Reves test | Offered for investment purposes; distributed broadly |
| **Tokenized loan participation notes** | Definitely a SECURITY | Investment contract + note = securities under both Howey and Reves |
| **DeFi borrowing against tokens** | Uncertain -- depends on structure | The underlying tokens are securities; the DeFi loan itself may not be |

**Implication:** Sub-Path A (direct lending) may not require securities registration if PleoChrome is merely arranging a bilateral loan. Sub-Paths B and C almost certainly require Reg D 506(c) compliance.

### 6.2 Broker-Dealer Considerations

| Activity | BD Registration Required? | Analysis |
|----------|--------------------------|----------|
| PleoChrome arranges a loan between a borrower and a single lender | Likely NO -- this is loan brokerage, not securities brokerage | Loan brokerage is regulated at the state level, not by FINRA |
| PleoChrome offers loan participation notes to investors | Potentially YES -- if notes are securities, distributing them may require BD involvement | Use a BD of record (Dalmore) or rely on issuer exemption (Section 3(a)(4) of the Exchange Act) |
| PleoChrome structures tokenized notes and lists them on an ATS | BD/ATS registration required for the trading venue | PleoChrome partners with an existing registered ATS (tZERO, Securitize) |

### 6.3 Investment Company Act Considerations

If PleoChrome originates or holds loans as its primary business, it could be classified as an "investment company" under the Investment Company Act of 1940. Exemptions to evaluate:

| Exemption | Applicability |
|-----------|--------------|
| **Section 3(c)(1)** | "Qualifying private fund" -- fewer than 100 beneficial owners, not making public offering | May apply if note holders are limited |
| **Section 3(c)(7)** | "Qualified purchaser fund" -- all investors are "qualified purchasers" ($5M+ investments) | Higher threshold than accredited investor |
| **Section 3(c)(5)(A)** | Primarily engaged in purchasing notes secured by liens on real property | Does NOT apply -- gemstones are not real property |
| **Section 3(c)(5)(C)** | Not within jurisdiction if not an investment company by definition | Must evaluate |
| **Operating company exemption** | PleoChrome is primarily an operating company (orchestration platform), not an investment fund | Strongest argument if PleoChrome does not hold loans on its own balance sheet |

**Recommendation:** Structure PleoChrome as an arranging/servicing platform, NOT as a loan originator that holds loans on its balance sheet. Each loan should be originated by or for the SPV, with PleoChrome earning fees for arrangement and servicing. This preserves the "operating company" characterization.

---

## 7. UCC ARTICLE 9: SECURED TRANSACTIONS FOR GEMSTONES

### 7.1 Overview

UCC Article 9 governs security interests in personal property (including gemstones). To have a valid, enforceable, and priority security interest in gemstone collateral, PleoChrome must ensure proper **attachment** and **perfection**.

### 7.2 Attachment (Creating the Security Interest)

Three requirements for attachment:

| Requirement | How PleoChrome Satisfies It |
|-------------|---------------------------|
| **1. Value has been given** | The lender extends the loan (gives value to borrower) |
| **2. Debtor has rights in the collateral** | Borrower owns the gemstones (verified through provenance documentation, title opinion) |
| **3. Debtor has authenticated a security agreement describing the collateral** | Borrower signs a Security Agreement that describes the gemstones by reference to GIA certificate numbers, carat weights, descriptions, and vault receipt numbers |

### 7.3 Perfection (Establishing Priority)

Perfection determines priority over other creditors. For gemstones (tangible personal property classified as "goods" under UCC 9-102(a)(44)), there are two methods:

**Method 1: Filing a UCC-1 Financing Statement**
- File with the Secretary of State in the state where the **debtor is located** (for individuals: state of principal residence; for entities: state of organization)
- The financing statement need only "reasonably identify" the collateral -- a description by GIA certificate number, carat weight, and type is sufficient
- Filing is effective for **5 years** from the date of filing
- Must file a **UCC-3 Continuation Statement** before the 5-year expiration to maintain perfection
- Cost: $5-$50 per filing depending on state

**Method 2: Possession by the Secured Party**
- The secured party (lender or agent) takes physical possession of the gemstones
- Perfection by possession is immediate and does not require filing
- In PleoChrome's model, the gemstones are in a vault controlled by PleoChrome as agent for the lender -- this constitutes constructive possession
- A **Custody Control Agreement** directing the vault to hold gemstones for the benefit of the secured party perfects the interest

**Recommended approach:** BOTH methods. File a UCC-1 AND maintain possession through the vault custody arrangement. Belt-and-suspenders approach protects against any dispute about whether PleoChrome/vault possession constitutes "possession by the secured party."

### 7.4 UCC Filing Procedures and Costs

| Step | Action | Cost | Notes |
|------|--------|------|-------|
| 1 | Conduct UCC search (pre-filing) | $25-$150 | Search for existing liens against borrower and specific collateral |
| 2 | Prepare UCC-1 Financing Statement | $0 (internal) | Debtor name, secured party name, collateral description |
| 3 | File UCC-1 with Secretary of State | $5-$50 | Varies by state; electronic filing is cheaper |
| 4 | Receive filing acknowledgment | $0 | 1-5 business days |
| 5 | File in additional states (if borrower has multiple jurisdictions) | $5-$50 per state | May not be necessary if debtor is organized in one state |
| 6 | File UCC-3 Continuation (before 5th anniversary) | $5-$50 | Required to maintain perfection |
| 7 | File UCC-3 Termination (at loan payoff) | $5-$50 | Required to release the security interest |

**Collateral Description Example for UCC-1:**

> All gemstones, precious stones, and mineral specimens, whether loose or set, including without limitation the following items identified by GIA Certificate Numbers: [GIA-XXXXXXXXX], [GIA-XXXXXXXXX], [GIA-XXXXXXXXX]; together with all GIA Identification Reports, Origin Reports, and laboratory certifications relating thereto; all vault receipts, warehouse receipts, and custody agreements; all insurance policies and proceeds thereof; and all proceeds of the foregoing.

### 7.5 Priority Issues

| Scenario | Priority Rule | Mitigation |
|----------|--------------|------------|
| Competing UCC filings | First to file or perfect has priority (UCC 9-322(a)(1)) | Conduct thorough UCC search before lending; file immediately |
| Purchase money security interest | PMSI in goods has priority over earlier filing if perfected within 20 days of delivery (UCC 9-324) | Unlikely scenario for gemstones, but verify no PMSI exists |
| Buyer in ordinary course | A buyer in the ordinary course of business takes free of a security interest (UCC 9-320(a)) | Gemstones in a vault are NOT being sold in the ordinary course -- this exception should not apply |
| Lien creditors and trustees in bankruptcy | A perfected security interest has priority over a lien creditor or bankruptcy trustee | Ensure perfection BEFORE any borrower financial difficulty |

---

## 8. LICENSING REQUIREMENTS

### 8.1 Federal Licensing

| Requirement | Applicability to PleoChrome | Action Required |
|-------------|---------------------------|-----------------|
| **FinCEN MSB registration** | If PleoChrome transmits funds or is determined to be an MSB (see Strategy Doc 4, Section 1.11) | Obtain legal opinion; register if required ($0 filing fee) |
| **SEC registration (as BD or investment adviser)** | If PleoChrome distributes securities (notes) without a BD, or provides investment advice | Use BD of record for note distribution; do NOT provide individualized investment advice |
| **FINRA membership** | Only if PleoChrome registers as a BD | NOT recommended -- use partner BD |

### 8.2 State Licensing

The state lending license landscape is the most complex regulatory issue for PleoChrome's lending vertical.

**General Principle:** Most states require a license to "engage in the business of making loans." However, there are critical exemptions:

| Exemption Category | Description | PleoChrome Applicability |
|-------------------|-------------|------------------------|
| **Arranger/broker exemption** | Many states distinguish between making a loan and arranging/brokering a loan. Arrangers may not need a lender license | HIGH -- PleoChrome arranges but does not lend its own capital |
| **Commercial/business purpose exemption** | Many states exempt loans made for business or investment purposes (not consumer/personal) | HIGH -- gemstone-collateralized loans are for business/investment purposes |
| **Institutional lender exemption** | Loans from banks, insurance companies, and other institutional lenders are often exempt | MEDIUM -- depends on the identity of PleoChrome's capital providers |
| **Transaction amount exemption** | Some states exempt loans above a certain threshold (e.g., California exempts commercial financings over $2.5M from the CFL) | MEDIUM -- PleoChrome loans are typically $1M+ |
| **Accredited investor exemption** | Some states exempt transactions with accredited investors from lending regulations | MEDIUM -- all PleoChrome note investors are accredited |
| **Pawnbroker licensing** | If PleoChrome takes possession of personal property as collateral and the loan is to a consumer, pawnbroker licensing may apply | LOW -- PleoChrome's loans are commercial/investment purpose, not consumer pawn |

**State-by-State Analysis (Key States):**

| State | License Requirement | PleoChrome Exemption Path |
|-------|-------------------|--------------------------|
| **California** | California Financing Law (CFL) requires a license for commercial lenders | Exempt if loan is >$2.5M (most PleoChrome loans); exempt if PleoChrome is only a broker/arranger |
| **New York** | Licensed Lender Law; expanding commercial finance disclosure rules | Broker exemption may apply; must monitor NY legislative developments |
| **Texas** | Relatively permissive for commercial lending; Consumer Credit Commissioner oversight for consumer loans | Business purpose loans largely unregulated |
| **Florida** | Consumer Finance Act; exemptions for commercial loans | Business purpose loans exempt from consumer lending requirements |
| **Wyoming** | PleoChrome's home state; relatively light regulation | Minimal requirements for non-consumer commercial lending |
| **Illinois** | Consumer Installment Loan Act; commercial exemptions | Business purpose loans exempt |
| **Massachusetts** | Aggressive enforcement; small loan licensing | Monitor carefully; business purpose exemption likely applies |

**Recommended Approach:**

1. **Engage a multi-state lending compliance counsel** to perform a 50-state licensing analysis specifically for PleoChrome's model (cost: $15,000-$40,000)
2. **Structure all loans as business/investment purpose** -- never consumer/personal purpose -- to maximize exemptions
3. **PleoChrome acts as arranger/broker, NOT direct lender** -- the SPV or institutional capital provider is the "lender" of record
4. **Register on NMLS** as a loan broker/arranger in states where required ($500-$5,000 per state, surety bond may be required)
5. **Phase approach:** Start with loans to borrowers located in borrower-friendly states (Wyoming, Texas, Florida); expand to more regulated states as the compliance infrastructure matures

### 8.3 Licensing Cost Estimates

| Licensing Track | One-Time Cost | Annual Cost | Timeline |
|----------------|--------------|-------------|----------|
| **50-state legal analysis** | $15,000-$40,000 | N/A | 4-8 weeks |
| **NMLS registration (as loan broker in 5-10 key states)** | $5,000-$25,000 | $2,000-$10,000 | 4-12 weeks per state |
| **Surety bonds (if required by states)** | $1,000-$10,000 per state | $500-$5,000/yr per state | 1-2 weeks |
| **State-specific filings and renewals** | $500-$2,000 per state | $250-$1,000/yr per state | Ongoing |
| **Full 50-state licensing (if ever needed -- nightmare scenario)** | $200,000-$500,000+ | $50,000-$150,000+/yr | 12-18 months |

---

## 9. COLLATERAL CUSTODY AND INSURANCE DURING LOAN TERM

### 9.1 Custody Requirements

| Requirement | Standard | Rationale |
|-------------|----------|-----------|
| **Vault grade** | Grade XII or equivalent | Hardened against physical threats; same standard as PleoChrome tokenization |
| **Storage type** | Segregated (allocated) | Gemstones individually identified and stored separately, NOT commingled with other customers' assets |
| **Access protocol** | Dual authorization (PleoChrome + vault manager) for any access | Prevents unauthorized removal |
| **Release protocol** | Written PleoChrome authorization required; borrower cannot independently access during loan term | Protects lender's security interest |
| **Monitoring** | Daily Chainlink PoR verification or minimum weekly vault report | Continuous proof that collateral exists and is in custody |
| **Inspection** | Annual physical inspection by PleoChrome representative | Verify gemstones match GIA certificates and vault receipt |
| **Photography** | High-resolution photographs of all gemstones upon deposit | Baseline for any damage claims |
| **Environmental controls** | Temperature and humidity controlled (gemstones can be sensitive to extreme conditions) | Protects collateral value |

### 9.2 Insurance Requirements

| Coverage Type | Coverage Amount | Who Pays | Loss Payee |
|---------------|----------------|----------|------------|
| **Specie insurance (gemstone all-risk)** | Full appraised value (updated annually after reappraisal) | Borrower (deducted from loan proceeds or paid separately) | Lender as first loss payee; PleoChrome as additional insured |
| **Transit insurance** | Full value during any movement | Borrower or PleoChrome | Lender |
| **Vault operator liability** | Per vault's own policy | Vault operator | Varies |
| **PleoChrome E&O** | $2M-$5M | PleoChrome | PleoChrome |
| **PleoChrome D&O** | $2M-$5M | PleoChrome | PleoChrome |

**Insurance Providers (Specie/Gemstone):**
- Lloyd's of London (specie syndicates)
- AXA XL (specie desk)
- Chubb (valuable articles)
- Berkley Asset Protection
- Hugh Wood Inc. (specie broker)

**Annual specie insurance cost:** Approximately 0.15-0.40% of insured value (on $10M of gemstones: $15,000-$40,000/year)

### 9.3 Insurance Gap Risks

| Gap | Risk | Mitigation |
|-----|------|------------|
| Appraisal increase exceeds insured amount | Under-insurance if gemstones appreciate | Annual reappraisal triggers automatic insurance adjustment |
| Insurance lapse during renewal | Uninsured period | 90-day advance renewal notice; secondary insurer on standby |
| Exclusions (war, nuclear, terrorism) | Catastrophic loss without coverage | Review policy exclusions with broker; consider supplemental coverage |
| Deductible exceeds loan cushion | LTV + deductible could result in loss to lender | Ensure LTV provides adequate buffer above deductible |

---

## 10. DEFAULT, WORKOUT, AND LIQUIDATION PROCEDURES

### 10.1 Events of Default

The promissory note and security agreement should define the following events of default:

| Event | Description | Cure Period |
|-------|-------------|-------------|
| **Payment default** | Failure to make any interest or principal payment when due | 5-10 business days written notice |
| **Financial default** | Borrower bankruptcy, insolvency, or receivership | No cure (acceleration) |
| **Collateral impairment** | Material damage to, loss of, or decline in value of collateral below LTV threshold | 30 days to provide additional collateral or pay down principal |
| **Insurance default** | Lapse of specie insurance | 10 business days to reinstate |
| **Covenant breach** | Violation of loan covenants (e.g., prohibited additional liens on collateral, change of borrower ownership) | 15-30 days to cure |
| **Cross-default** | Default on other material obligations | Varies |
| **Fraud** | Material misrepresentation in loan application or collateral documentation | No cure (immediate acceleration) |
| **Regulatory event** | Government seizure, forfeiture order, or OFAC designation affecting borrower or collateral | No cure |

### 10.2 Default Workflow

```
Event of Default Occurs
    |
    v
PleoChrome Issues Default Notice to Borrower (within 3 business days)
    |
    v
Cure Period Begins (per agreement terms)
    |
    v
[If Cured] --> Default resolved; servicing continues
    |
[If NOT Cured] --> PleoChrome notifies lender; recommends course of action
    |
    v
Lender Elects Remedy:
    |
    |--> [Workout/Modification] --> Negotiate modified terms (rate increase,
    |                                additional collateral, payment plan)
    |
    |--> [Loan Acceleration] --> Entire principal + accrued interest due immediately
    |                            Borrower has 10-30 days to pay in full
    |
    |--> [Collateral Foreclosure] --> PleoChrome initiates liquidation process
```

### 10.3 Collateral Liquidation Process

| Step | Action | Timeline | Who |
|------|--------|----------|-----|
| 1 | Lender provides written direction to liquidate | Day 0 | Lender |
| 2 | PleoChrome provides "commercially reasonable" notice to borrower (UCC 9-611) | Day 1-5 | PleoChrome |
| 3 | Wait for any borrower redemption (borrower's right to redeem under UCC 9-623) | Day 5-15 | Borrower |
| 4 | Commission fresh appraisal of gemstones (establishes current market value) | Day 5-20 | PleoChrome + appraiser |
| 5 | Select disposition method (see below) | Day 15-20 | PleoChrome + lender |
| 6 | Execute sale in commercially reasonable manner (UCC 9-610) | Day 20-90 | PleoChrome |
| 7 | Apply proceeds per payment waterfall (UCC 9-615) | Day of sale + 3 | PleoChrome |
| 8 | Account to borrower for any surplus; pursue deficiency if loan is recourse | Day of sale + 10 | PleoChrome |
| 9 | File UCC-3 Termination Statement | Day of sale + 15 | PleoChrome |

**Disposition Methods (UCC 9-610 -- "commercially reasonable"):**

| Method | Description | Best For | Timeline |
|--------|-------------|----------|----------|
| **Private sale to dealer** | PleoChrome negotiates sale to gemstone dealer(s) in Chris's network | Quick liquidity; known buyers | 2-4 weeks |
| **Public auction (Christie's, Sotheby's, Heritage)** | Consign gemstones to a major auction house | Maximum price for exceptional stones | 3-6 months (auction schedule) |
| **Private auction (invited bidders)** | PleoChrome organizes a private sale among qualified buyers | Faster than public auction; competitive bidding | 4-8 weeks |
| **Tokenized sale** | If gemstones are already tokenized, sell tokens on secondary market (ATS) | Fastest if liquid secondary market exists | 1-4 weeks |
| **Broker sale** | Engage a gemstone broker to find buyers | Good for unusual or specialized stones | 4-12 weeks |

**"Commercially Reasonable" Standard (UCC 9-610(b)):**
Every aspect of the disposition must be commercially reasonable, including method, manner, time, place, and terms. For gemstones:
- Selling at fire-sale prices to a single buyer without marketing is NOT commercially reasonable
- Selling at auction through a recognized auction house IS commercially reasonable
- Selling through a dealer network at or near appraised value IS commercially reasonable
- Selling after proper notice and reasonable marketing period IS commercially reasonable

### 10.4 Payment Waterfall on Liquidation

Proceeds of collateral liquidation are applied in the following order (UCC 9-615):

1. **Reasonable expenses of liquidation** (auction fees, legal fees, transit costs, insurance during liquidation period)
2. **Satisfaction of the obligation secured** (outstanding principal + accrued interest + default interest + fees)
3. **Satisfaction of subordinate security interests** (if any junior liens exist)
4. **Surplus to borrower** (any excess proceeds belong to the borrower)

If proceeds are insufficient to satisfy the obligation:
- **Non-recourse loan:** Lender absorbs the loss; no deficiency claim against borrower
- **Recourse loan:** Lender may pursue a deficiency judgment against borrower for the shortfall

### 10.5 Borrower Protections

| Protection | UCC Basis | Practical Impact |
|------------|-----------|-----------------|
| **Right of redemption** | UCC 9-623 | Borrower may redeem collateral by paying full obligation + expenses at any time before sale |
| **Notice requirement** | UCC 9-611 | Borrower must receive notice of disposition (10 days for non-consumer transactions) |
| **Commercially reasonable disposition** | UCC 9-610 | Protects borrower from fire sales |
| **Surplus entitlement** | UCC 9-615(d) | Borrower receives any excess proceeds |
| **Accounting obligation** | UCC 9-616 | Secured party must account to borrower for surplus or deficiency |

---

## 11. INTEREST RATE STRUCTURES AND USURY LAW

### 11.1 Interest Rate Models

| Model | Description | PleoChrome Application |
|-------|-------------|----------------------|
| **Fixed rate** | Single rate for the entire loan term | Preferred for gemstone-backed loans -- simplicity, predictability, easier for note investors |
| **Variable rate** | Rate adjusts based on an index (e.g., SOFR + spread) | May be used for longer-term loans (24-36 months) |
| **Payment-in-kind (PIK)** | Interest is added to principal rather than paid in cash | Useful for borrowers with irregular cash flow; increases LTV risk over time |
| **Origination discount** | Loan is funded at less than face value (e.g., $4.8M funded for $5M note) | Effective additional yield; must be disclosed |

### 11.2 Proposed Rate Structure for PleoChrome-Arranged Loans

| Component | Rate/Amount | Notes |
|-----------|-------------|-------|
| **Base interest rate (to lender/note holders)** | 10-14% annualized | Depends on collateral quality, LTV, term, borrower profile |
| **PleoChrome servicing spread** | 2-4% annualized | Retained by PleoChrome from gross interest |
| **Total borrower rate** | 12-18% annualized | Competitive vs. Borro (36-120% annualized) and luxury pawn (24-60%+) |
| **Origination fee (borrower)** | 1.5-3.0% of loan amount | One-time, at closing |
| **Late payment fee** | 5% of overdue amount | Collected if payment is >10 days late |
| **Prepayment premium** | 1-2% of outstanding principal | If repaid in first 6 months; none after 6 months |
| **Extension fee** | 0.5-1.0% of outstanding principal | If borrower requests term extension |

### 11.3 Usury Law Compliance

**The usury problem:** Every state has its own maximum interest rate cap. Violating usury laws can result in penalties ranging from loss of interest to voiding of the entire loan to treble damages.

**PleoChrome's Usury Mitigation Strategy:**

| Strategy | Description | Effectiveness |
|----------|-------------|--------------|
| **Business purpose exemption** | Most states exempt business/investment purpose loans from consumer usury caps | HIGH -- all PleoChrome loans are business/investment purpose |
| **Choice of law** | Loan agreement specifies governing law of a state with high or no usury cap (e.g., Wyoming, Delaware, Nevada, Utah) | HIGH -- but must have nexus to chosen state |
| **Entity borrower requirement** | Require borrowers to be entities (LLC, trust, corporation), not individuals | HIGH -- many states exempt entity borrowers from usury limits entirely |
| **Minimum loan amount** | Set minimum loan at $500,000+ | MEDIUM -- some states exempt large loans from usury caps |
| **Bank partnership model** | Partner with a federally chartered bank that originates the loan; bank can "export" its home state's rate under the National Bank Act (12 USC 85) | HIGH -- but complex and requires a bank partner |

**State Usury Rate Summary (Key States):**

| State | General Usury Cap | Business Loan Exemption? | Notes |
|-------|------------------|-------------------------|-------|
| **Wyoming** | No general usury cap | N/A | PleoChrome home state; very favorable |
| **California** | 10% (constitutional limit) | Yes, for loans >$300K | Business loans >$300K to non-individuals are exempt from usury |
| **New York** | 16% civil; 25% criminal | Partial | Corporate borrowers and loans >$2.5M have higher thresholds |
| **Texas** | 18% | Yes, generally | Business purpose loans largely unregulated for rate |
| **Florida** | 18% (simple), 25% (criminal) | Partial | Commercial loans have higher caps |
| **Delaware** | No general cap | N/A | Very favorable |
| **Nevada** | No general cap | N/A | Very favorable |
| **Utah** | No general cap | N/A | Very favorable |

**Recommendation:** Structure all PleoChrome-arranged loans with:
1. Wyoming or Delaware choice-of-law provision
2. Entity borrower requirement (no loans to natural persons)
3. Business/investment purpose certification in loan documents
4. Total all-in rate (including fees amortized over term) of no more than 24% annualized to provide a safety margin in all jurisdictions

---

## 12. ONGOING LOAN SERVICING OBLIGATIONS

### 12.1 Servicer Responsibilities

| Obligation | Description | Frequency | Compliance Requirement |
|-----------|-------------|-----------|----------------------|
| **Payment collection** | Collect borrower payments; apply to principal, interest, fees per agreement | Monthly/quarterly | Accurate accounting; written receipt |
| **Payment remittance** | Remit net interest to lender(s) after deducting servicing fee | Monthly/quarterly | Timely remittance per servicing agreement |
| **Escrow management** | If loan requires tax or insurance escrow | As needed | Proper escrow accounting |
| **Default monitoring** | Track payment status; identify delinquencies | Daily/weekly | Timely default notices |
| **Collateral monitoring** | Verify custody, insurance, value | Monthly/annually | Chainlink PoR + annual reappraisal |
| **Borrower communication** | Payment statements, notices, modification correspondence | As needed | Written, documented |
| **Lender reporting** | Collateral status, payment history, market updates | Monthly/quarterly | Accurate, timely |
| **Regulatory compliance** | Sanctions re-screening, AML monitoring | Quarterly | Per PleoChrome AML policy |
| **Record retention** | Maintain complete loan file | Duration of loan + 5 years | Per retention schedule |
| **Tax reporting** | Issue 1099-INT to investors; year-end statements | Annual | IRS compliance |
| **Insurance monitoring** | Track policy expiration, renewal, adequacy | Ongoing + annual | No gaps in coverage |
| **UCC maintenance** | Continuation filings before 5-year expiration | Every 5 years | Must not lapse |

### 12.2 Servicing Technology

| Tool | Purpose | Cost | Phase |
|------|---------|------|-------|
| **Spreadsheet (Google Sheets/Excel)** | Basic loan tracking for first 1-5 loans | $0 | Phase 1 |
| **Nortridge Loan Management System** | Purpose-built loan servicing software; handles complex payment structures | $500-$2,000/month | Phase 2 |
| **Mortgage Automator / LoanPro** | Cloud-based loan servicing with automated payment processing, borrower portals, reporting | $500-$3,000/month | Phase 2 |
| **Custom-built (on PleoChrome tech stack)** | Next.js + Supabase loan management integrated with Chainlink PoR and investor portal | $25,000-$75,000 development cost | Phase 3 |

---

## 13. COMPLETE PLEOCHROME FEE STRUCTURE FOR LENDING ORCHESTRATION

### 13.1 Borrower-Side Fees

| Fee | Rate/Amount | When Collected | Description |
|-----|-------------|----------------|-------------|
| **Application fee** | $500-$2,500 | At application | Non-refundable; credited to origination fee if loan closes |
| **Appraisal coordination fee** | 10-20% markup on appraisal costs, or $5,000-$15,000 flat | After appraisals complete | Compensation for managing 3-appraiser process |
| **Origination fee** | 1.5-3.0% of loan principal | At loan closing | Primary upfront revenue |
| **Custody arrangement fee** | $1,000-$5,000 | At vault deposit | For coordinating custody transfer |
| **Monthly/quarterly interest** | 12-18% annualized | Ongoing during loan term | Includes PleoChrome's spread (2-4%) |
| **Annual reappraisal fee** | $1,000-$3,000 | Annually | Coordination of annual collateral revaluation |
| **Late payment fee** | 5% of overdue amount | When payment is >10 days late | Penalty; may be shared with lender |
| **Prepayment premium** | 1-2% of outstanding principal | If repaid in first 6 months | Yield protection |
| **Extension fee** | 0.5-1.0% of outstanding principal | At extension | For loan term extensions |
| **Payoff administration fee** | $500-$2,000 | At loan payoff | For processing payoff and collateral release |

### 13.2 Lender/Investor-Side Fees

| Fee | Rate/Amount | When Collected | Description |
|-----|-------------|----------------|-------------|
| **Placement fee** | 0.5-1.0% of capital deployed | At loan closing | Access fee for the deal |
| **Note structuring fee** | 1.0-2.0% of note offering amount | At note offering launch | For Sub-Path B only |
| **Note offering success fee** | 1.0-1.5% of capital raised | As investors fund | For Sub-Path B only |
| **Servicing fee** | 0.50-1.00% of outstanding loan/note balance per annum | Monthly/quarterly | Ongoing administration |
| **Interest rate spread** | 2-4% annualized (difference between borrower rate and lender yield) | Monthly/quarterly | Primary ongoing revenue |
| **DeFi enablement fee** | 0.25-0.50% per annum of DeFi-collateralized token value | Monthly/quarterly | For Sub-Path C only |

### 13.3 Total Revenue Potential by Loan Size

| Loan Size | Sub-Path A Revenue (2 years) | Sub-Path B Revenue (2 years) | Sub-Path C Revenue (2 years) |
|-----------|-------|-------|-------|
| $1M | ~$130,000 | ~$280,000 | ~$10,000-$25,000 |
| $5M | ~$630,000 | ~$1,400,000 | ~$50,000-$125,000 |
| $10M | ~$1,260,000 | ~$2,800,000 | ~$100,000-$250,000 |
| $25M | ~$3,150,000 | ~$7,000,000 | ~$250,000-$625,000 |

---

## 14. COMPETITIVE COMPARISON

### 14.1 PleoChrome vs. Existing Luxury Asset Lenders

| Feature | Borro | Vasco Assets | Diamond Banc | Qollateral | **PleoChrome** |
|---------|-------|-------------|-------------|------------|----------------|
| **Maximum LTV** | 50-70% | 50-70% | 50-70% | Up to 80% | **30-60%** (conservative) |
| **Interest rate** | 36-120% annualized | 24-60%+ annualized | Competitive with market | Competitive | **12-18% annualized** |
| **Appraisal rigor** | Internal | Internal | Internal | Internal + lab reports | **3 independent USPAP + GIA** |
| **Loan term** | Up to 6 months | Short-term | Short-term | 4-month cycles | **12-36 months** |
| **Maximum loan** | $10M+ | Multi-million | Multi-million | $10M | **No fixed cap** |
| **Blockchain verification** | No | No | No | No | **Chainlink PoR** |
| **Custody standard** | Lender vault | Lender vault | Lender vault | Lender vault | **Institutional vault (Brink's/Malca-Amit)** |
| **Secondary market for loan interests** | No | No | No | No | **Yes (tokenized participation notes)** |
| **Regulatory framework** | Pawnbroker/lender license | Pawnbroker/lender license | Licensed lender | Licensed lender | **Reg D 506(c) + state compliance** |
| **DeFi integration** | No | No | No | No | **Yes (future)** |
| **Ongoing reporting to borrower/lender** | Minimal | Minimal | Minimal | Minimal | **Quarterly institutional reports** |

### 14.2 PleoChrome vs. Private Credit Platforms

| Feature | Percent | Yieldstreet | **PleoChrome** |
|---------|---------|-------------|----------------|
| **Asset type** | Consumer loans, receivables, various | Real estate, art, legal, marine | **Gemstones (unique asset class)** |
| **Minimum investment** | $500 | $2,500+ | **$25,000-$250,000** |
| **Average return** | 14-17% | 8-15% | **10-14% (note holders)** |
| **Collateral verification** | Varies by deal | Varies | **GIA + 3 appraisals + Chainlink PoR** |
| **Total funded** | $1.68B+ | $4B+ | **$0 (startup)** |
| **Regulatory structure** | Reg D | Various exemptions | **Reg D 506(c)** |

---

## 15. REVENUE PROJECTIONS

### 15.1 Year 1-5 Lending Revenue Model

**Assumptions:**
- Average loan size: $5M
- Average term: 18 months
- Average origination fee: 2% (borrower) + 0.75% (lender)
- Average interest rate spread: 3% per annum
- Average servicing fee: 0.75% per annum
- Sub-Path B (note participation) begins Year 2
- Sub-Path C (DeFi) begins Year 3

| Year | New Loans | Avg. Loan Size | Active Loan Balance | Origination Revenue | Spread + Servicing Revenue | Note Offering Revenue | Total Lending Revenue |
|------|-----------|---------------|--------------------|--------------------|--------------------------|----------------------|---------------------|
| 1 | 2 | $3M | $6M | $165,000 | $225,000 | $0 | **$390,000** |
| 2 | 5 | $5M | $20M | $687,500 | $750,000 | $200,000 | **$1,637,500** |
| 3 | 8 | $6M | $40M | $1,320,000 | $1,500,000 | $600,000 | **$3,420,000** |
| 4 | 12 | $7M | $70M | $2,310,000 | $2,625,000 | $1,000,000 | **$5,935,000** |
| 5 | 15 | $8M | $100M | $3,300,000 | $3,750,000 | $1,500,000 | **$8,550,000** |

### 15.2 Combined Revenue (Tokenization + Lending)

| Year | Tokenization Revenue (per Strategy Doc 2) | Lending Revenue | **Combined Revenue** |
|------|------------------------------------------|-----------------|---------------------|
| 1 | $327,500 | $390,000 | **$717,500** |
| 2 | $1,133,250 | $1,637,500 | **$2,770,750** |
| 3 | $2,890,000 | $3,420,000 | **$6,310,000** |
| 4 | $5,195,000 (projected) | $5,935,000 | **$11,130,000** |
| 5 | $7,687,500 | $8,550,000 | **$16,237,500** |

**Key insight:** The lending vertical has the potential to **match or exceed** the tokenization vertical in revenue by Year 2, and together they create a combined platform generating $16M+ annually by Year 5. The verticals are synergistic -- every tokenized gemstone is a potential loan collateral asset, and every lending client is a potential tokenization client.

---

## 16. RISK REGISTER: LENDING-SPECIFIC RISKS

| # | Risk | Prob. | Impact | Score | Owner | Mitigation |
|---|------|-------|--------|-------|-------|------------|
| L1 | **Borrower default** -- borrower fails to repay | 3 | 3 | 9 | Shane + PleoChrome as servicer | Conservative LTV (30-60%); institutional custody; defined workout procedures |
| L2 | **Collateral value decline** -- gemstone market drops below LTV | 2 | 4 | 8 | David (monitoring) | Annual reappraisal; margin call provisions; LTV buffer |
| L3 | **Licensing enforcement** -- state regulator alleges unlicensed lending | 2 | 4 | 8 | Shane + counsel | 50-state legal analysis; arranger structure; business purpose loans |
| L4 | **Usury violation** -- all-in rate exceeds state cap | 1 | 5 | 5 | Counsel | Entity borrower requirement; Wyoming/Delaware choice of law; rate below 24% |
| L5 | **Securities violation (notes)** -- SEC enforcement on loan participation notes | 2 | 5 | 10 | Shane + CCO + counsel | Full Reg D 506(c) compliance for all note offerings |
| L6 | **Liquidation recovery shortfall** -- collateral sale does not cover outstanding loan | 2 | 4 | 8 | PleoChrome as servicer | Conservative LTV; commercially reasonable disposition; insurance |
| L7 | **DeFi protocol failure** -- smart contract hack or exploit affecting collateralized tokens | 2 | 5 | 10 | David (CTO) | Thorough protocol due diligence; start with audited protocols only; limit exposure |
| L8 | **Oracle failure** -- Chainlink PoR or NAV feed provides incorrect data | 2 | 4 | 8 | David (CTO) | Multi-oracle architecture; manual override capability; daily monitoring |
| L9 | **Insurance gap during loan term** -- specie insurance lapses or is inadequate | 1 | 5 | 5 | David (operations) | 90-day advance renewal; dual insurer standby; automated tracking |
| L10 | **Reputational risk** -- borrower default or liquidation generates negative publicity | 2 | 3 | 6 | Shane | Discretion provisions in all agreements; private sale preference; professional communications |

---

## 17. IMPLEMENTATION ROADMAP

### Phase 1: Foundation (Months 1-6)

| Task | Timeline | Cost | Owner | Deliverable |
|------|----------|------|-------|-------------|
| Engage lending/securities counsel for legal analysis | Month 1 | $15,000-$40,000 | Shane | 50-state licensing memo + structure opinion |
| Design loan product terms and documentation | Months 1-3 | $15,000-$35,000 | Shane + counsel | Template loan docs (promissory note, security agreement, pledge agreement, custody control agreement) |
| Build lender/capital provider network | Months 1-6 | $0 (BD effort) | Chris + Shane | 5-10 qualified capital providers (family offices, credit funds, HNW individuals) |
| Establish UCC filing procedures | Month 2 | $1,000-$3,000 | David | UCC search + filing SOP |
| Obtain state licensing analysis | Month 2-3 | Included in counsel engagement | Counsel | State-by-state go/no-go matrix |
| Register as loan broker/arranger (key states) | Months 3-6 | $5,000-$25,000 | Shane + compliance | NMLS registrations in 5-10 states |
| Develop lending page on pleochrome.com | Month 3-4 | $5,000-$15,000 | David | Marketing presence for lending vertical |
| Create borrower intake and qualification SOP | Month 3 | $0 (internal) | David | Written procedures |
| **Total Phase 1 Investment** | | **$41,000-$118,000** | | |

### Phase 2: First Loans (Months 6-12)

| Task | Timeline | Cost | Owner | Deliverable |
|------|----------|------|-------|-------------|
| Originate first 1-2 loans (Sub-Path A) | Months 6-10 | Variable (legal per deal) | Shane + Chris | Executed loan packages; revenue begins |
| Build servicing infrastructure | Months 6-8 | $0-$5,000 | David | Loan tracking system; payment processing |
| Develop lender reporting templates | Month 7 | $0 (internal) | David | Quarterly lender reports |
| Evaluate loan servicing software | Month 8-10 | $500-$2,000/month | David | Software selection and implementation |
| Begin loan participation note structuring (Sub-Path B) | Month 10-12 | $50,000-$100,000 | Shane + counsel | Note PPM and documents |
| **Total Phase 2 Investment** | | **$50,500-$107,000** (beyond deal-level costs) | | |

### Phase 3: Scale and Product Expansion (Months 12-24)

| Task | Timeline | Cost | Owner | Deliverable |
|------|----------|------|-------|-------------|
| Launch first note offering (Sub-Path B) | Month 12-14 | Included in Phase 2 prep | Shane | First note offering live |
| Scale to 5+ active loans | Month 12-18 | Variable | All | Growing loan book |
| Expand state licensing (additional states) | Month 12-18 | $10,000-$50,000 | Shane + compliance | Broader geographic coverage |
| Hire dedicated loan servicing officer | Month 14-18 | $75,000-$100,000/yr | Shane | First lending-vertical hire |
| Begin DeFi integration research (Sub-Path C) | Month 18-24 | $10,000-$30,000 | David | Legal opinion + technical feasibility assessment |
| **Total Phase 3 Investment** | | **$95,000-$180,000** (annualized, excluding deal costs) | | |

### Phase 4: Full Platform (Months 24-36)

| Task | Timeline | Cost | Owner | Deliverable |
|------|----------|------|-------|-------------|
| Active loan book exceeds $20M | Month 24 | N/A | All | Scale milestone |
| Multiple note offerings live | Month 24-30 | Variable | Shane | Recurring note program |
| DeFi pilot integration (Sub-Path C) | Month 24-30 | $40,000-$150,000 | David | First DeFi collateral position |
| Custom loan servicing platform (on PleoChrome tech stack) | Month 24-36 | $25,000-$75,000 | David | Integrated servicing + reporting + PoR |
| Evaluate becoming a direct lender (balance sheet lending) | Month 30-36 | Legal analysis cost | Shane + counsel | Strategic decision on capital deployment |

---

## 18. SOURCES

Research and market data referenced in this document:

- [Borro -- Luxury Asset Lending](https://borro.com/)
- [Borro -- Jewelry & Diamond Loans](https://borro.com/assets-jewelry-diamonds/)
- [Borro -- Luxury Asset Lending & Financing Guide 2026](https://borro.com/resources/)
- [Vasco Assets -- Collateral Loans](https://www.vascoassets.com/power-collateral-loans/)
- [Vasco Assets -- Diamond Loans](https://www.vascoassets.com/get-a-loan-with-diamonds/)
- [Diamond Banc -- Jewelry Loans](https://www.diamondbanc.com/use-your-jewelry-to-get-a-loan/)
- [Qollateral -- Fine Jewelry Loans Up to $10M](https://qollateral.com/collateral-resources/fine-jewelry-pr/)
- [Qollateral -- Loan-to-Value Ratio](https://qollateral.com/collateral-resources/loan-to-value-ratio/)
- [Percent -- Private Credit Investing](https://percent.com/)
- [Percent -- How It Works](https://percent.com/investors-how-it-works)
- [UCC Article 9 -- Secured Transactions (Cornell Law)](https://www.law.cornell.edu/ucc/9)
- [UCC Articles 9 and 12: Modern Legal Framework for Secured Transactions -- Lowenstein Sandler](https://www.lowenstein.com/news-insights/publications/articles/ucc-articles-9-and-12-a-modern-legal-framework-for-secured-transactions-and-digital-assets-citron-caporale-podolnyy)
- [Private Lending Funds: When Is a Note a Security? -- Cott Law Group](https://cottlawgroup.com/private-lending-funds-when-is-a-note-a-security/)
- [Reves Test and Howey Test -- Securities Law Blog](https://securities-law-blog.com/2014/11/25/what-is-a-security-the-howey-test-and-reves-test/)
- [Second Circuit Affirms Syndicated Loans Are Not Securities -- Ballard Spahr](https://www.ballardspahr.com/insights/alerts-and-articles/2023/08/second-circuit-affirms-syndicated-loans-are-not-securities)
- [Kirschner v. JP Morgan Chase Bank -- Venable LLP Analysis](https://www.venable.com/insights/publications/2023/10/are-loans-securities-the-united-states-court-of)
- [Loan Participations vs. Syndications -- GAAP Dynamics](https://www.gaapdynamics.com/insights/blog/2021/06/29/loan-participations-vs-syndications-whats-the-deal/)
- [Loan Participation vs. Syndication -- Avana Capital](https://avanacapital.com/business-loans/loan-participation-vs-syndication/)
- [State Lending License Requirements -- Private Lender Link](https://privatelenderlink.com/2024/12/states-that-require-a-license-for-private-lending/)
- [California Finance Lenders Law Exemptions -- Strategy Law](https://strategylaw.com/blog-announcements/lenders-and-licensing-and-exemptions-the-world-according-to-the-california-finance-lenders-law/)
- [Commercial Loan Licensing -- Integrity Mortgage Licensing](https://integritymortgagelicensing.com/lists-of-licensing-requirements/commercial-loan-licensing/)
- [State Regulatory Landscape for Commercial Lenders -- Bloomberg Law](https://news.bloomberglaw.com/us-law-week/state-regulatory-landscape-shifts-for-commercial-loan-lenders)
- [Usury Laws by State -- WalletHub](https://wallethub.com/edu/cc/usury-laws/25568)
- [CSBS State Usury Rate Tool](https://www.csbs.org/newsroom/csbs-releases-comprehensive-state-usury-rate-tool)
- [Usury Law: Interest Rate Limits and Loan Violations -- Daeryun Law](https://www.daeryunlaw.com/us/practices/detail/usury-laws)
- [Understanding Securities Exemption in Private Lending -- AAPL](https://aaplonline.com/articles/legal/understanding-securities-exemption-in-private-lending/)
- [RWA Tokenization in 2026 Guide -- Blocklr](https://blocklr.com/news/rwa-tokenization-2026-guide/)
- [Aave Horizon -- Institutional Stablecoin Borrowing Against Tokenized RWAs -- The Block](https://www.theblock.co/post/368440/aave-labs-horizon-stablecoin-borrowing-tokenized-rwas)
- [Centrifuge -- Real World Asset Protocol](https://centrifuge.io/)
- [MakerDAO RWA Market via Centrifuge -- Medium](https://medium.com/centrifuge/rwa-market-the-aave-market-for-real-world-assets-goes-live-48976b984dde)
- [The Institutional Wave of 2026: RWAs Redefining DeFi -- Medium](https://medium.com/@ancilartech/the-institutional-wave-of-2026-how-real-world-assets-are-about-to-redefine-defi-a9e4989f5dd4)
- [DeFi Enables RWA-Based Lending -- RWA.io](https://www.rwa.io/post/how-defi-is-enabling-rwa-based-lending)
- [Real-World Assets in Onchain Finance Report -- RedStone](https://blog.redstone.finance/2025/06/26/real-world-assets-in-onchain-finance-report/)
- [Digital Asset-Backed Lending Explained -- Polytrade](https://blog.polytrade.finance/real-world-assets/digital-asset-backed-lending-explained-simply/)
- [IntaCapital Swiss -- Financing Within the Precious Stone Industry](https://intacapitalswiss.com/financing-within-the-precious-stone-industry/)
- [Watch and Jewelry Loans -- Luxury Collateral Lending Guide -- Ameta Finance](https://ametafinancegroup.com/watch-and-jewelry-loans-luxury-collateral-lending/)
- [Gemstones as Collateral for Secured Loan -- Silver Coin Investor](https://www.silver-coin-investor.com/gemstones-as-collateral-for-secured-loan.html)
- [Platinum Global Bridging Finance -- Loans Against Gemstones](https://www.platinumglobalbridgingfinance.co.uk/luxury-asset-loans/loans-against-gemstones/)

---

**END OF DOCUMENT**

*This document should be reviewed by securities counsel and lending counsel before any lending operations commence. All cost estimates are indicative and subject to market conditions, jurisdictional requirements, and negotiation with service providers.*
