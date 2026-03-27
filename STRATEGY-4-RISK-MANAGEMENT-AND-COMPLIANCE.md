# PLEOCHROME STRATEGY DOCUMENT 4: RISK MANAGEMENT & COMPLIANCE FRAMEWORK

**Document Version:** 1.0
**Date:** March 19, 2026
**Classification:** Confidential -- Internal Use Only
**Prepared for:** Shane Pierson (CEO), David Whiting (CTO/COO), Chris Ramsey (CRO)
**Purpose:** Institutional-grade compliance and risk management framework for PleoChrome Holdings LLC

---

## TABLE OF CONTENTS

1. [Compliance Program Architecture](#1-compliance-program-architecture)
2. [Compliance Officer Role](#2-compliance-officer-role)
3. [Risk Framework](#3-risk-framework)
4. [Kandi Asset Provenance Risk Management](#4-kandi-asset-provenance-risk-management)
5. [Insurance Program Design](#5-insurance-program-design)
6. [Regulatory Monitoring](#6-regulatory-monitoring)
7. [Incident Response Plan](#7-incident-response-plan)
8. [SOC 2 Roadmap](#8-soc-2-roadmap)

---

## 1. COMPLIANCE PROGRAM ARCHITECTURE

PleoChrome operates at the intersection of securities law (Reg D 506(c)), blockchain technology (ERC-3643 on Polygon), physical asset custody (gemstones), and financial crime prevention (BSA/AML). The compliance program must address all four domains simultaneously. This section defines the complete compliance architecture that PleoChrome must build before accepting its first investor dollar.

### 1.1 AML/KYC Policy

PleoChrome's AML/KYC Policy must be a standalone written document, reviewed annually and approved by the Compliance Officer. It must contain, at minimum, the following components:

**Policy Statement and Scope**
- Statement of PleoChrome's commitment to preventing money laundering, terrorist financing, and other illicit financial activity
- Definition of scope: all investors, asset holders, counterparties, and intermediaries who interact with PleoChrome's platform
- Statement that the policy applies regardless of transaction size, investor location, or asset type
- Acknowledgment of PleoChrome's obligations under the Bank Secrecy Act (BSA), USA PATRIOT Act, and FinCEN regulations
- Reference to the pending determination of whether PleoChrome qualifies as a Money Services Business (MSB) under FinCEN rules -- counsel must opine on this (see Section 1.10)

**Customer Identification Program (CIP)**
- Procedures for collecting the following minimum information from each natural person: full legal name, date of birth, residential address (not a P.O. Box), government-issued identification number (SSN for U.S. persons, passport number for non-U.S. persons)
- For entities: legal name, jurisdiction of organization, principal place of business, EIN or foreign equivalent, identification and verification of all beneficial owners holding 25% or more equity, and identification of one individual with significant control
- Acceptable forms of identification: government-issued photo ID (passport, driver's license, state ID), articles of organization/incorporation (entities), partnership agreements
- Procedures for verifying identification: documentary verification (inspecting documents), non-documentary verification (cross-referencing databases, credit bureau checks, public records searches), or a combination
- Recordkeeping: copies of all identification documents must be retained for a minimum of five years after the account is closed or the relationship ends

**Customer Due Diligence (CDD)**
- Risk-based categorization of all customers into Low, Medium, and High risk tiers
- Factors determining risk tier: country of residence/incorporation, nature of business, source of funds, source of wealth, transaction size, political exposure, sanctions exposure, industry risk, adverse media
- Standard CDD procedures applied to all customers regardless of risk tier: identity verification, sanctions screening, PEP screening, adverse media screening
- Frequency of CDD refresh: annually for Low risk, semi-annually for Medium risk, upon each transaction or quarterly for High risk

**Enhanced Due Diligence (EDD)**

EDD is mandatory for:
- Any investor or asset holder who is a Politically Exposed Person (PEP) or a close associate or family member of a PEP
- Any investor or asset holder from a FATF grey-list or black-list jurisdiction
- Any transaction where the source of funds cannot be readily explained
- Any asset holder with adverse media, criminal history, or regulatory action history
- Emiel Kandi or any party connected to the Kandi barrel (if PleoChrome proceeds with this asset)
- Any transaction exceeding $1,000,000

EDD procedures include:
- Senior management approval required before the relationship can be established or the transaction processed
- Deeper investigation into source of funds and source of wealth, with documentary evidence required
- Enhanced ongoing monitoring with more frequent reviews
- Documented rationale for the decision to proceed, including any conditions imposed
- Review by outside counsel if the situation involves criminal history, ongoing litigation, or regulatory action

**Ongoing Monitoring**
- All investors and asset holders are subject to continuous sanctions screening (automated alerts via screening platform)
- All investors re-screened against OFAC, EU, and UN sanctions lists at least quarterly
- Unusual transaction patterns flagged for manual review: rapid accumulation of tokens, token purchases inconsistent with stated investment objectives, requests to transfer tokens to wallets in high-risk jurisdictions, requests for expedited processing without clear business reason
- Threshold-based alerts: any single transaction exceeding $50,000 triggers enhanced review; any series of transactions totaling $100,000+ within 30 days triggers pattern analysis

### 1.2 Sanctions Screening Program

**Mandatory Screening Lists**

| List | Source | Screening Frequency | URL |
|------|--------|-------------------|-----|
| OFAC SDN List | U.S. Treasury | Every onboarding + quarterly | sanctionssearch.ofac.treas.gov |
| OFAC Consolidated Sanctions | U.S. Treasury | Every onboarding + quarterly | home.treasury.gov/policy-issues/financial-sanctions/consolidated-sanctions-list |
| OFAC Sectoral Sanctions | U.S. Treasury | Every onboarding + quarterly | home.treasury.gov/policy-issues/financial-sanctions/specially-designated-nationals-and-blocked-persons-list-sdn-human-readable-lists |
| EU Consolidated Sanctions | European External Action Service | Every onboarding + quarterly | data.europa.eu/data/datasets/consolidated-list-of-persons-groups-and-entities-subject-to-eu-financial-sanctions |
| UN Security Council Consolidated List | United Nations | Every onboarding + quarterly | scsanctions.un.org/consolidated |
| FATF High-Risk Jurisdictions | FATF | Quarterly (updated three times per year) | fatf-gafi.org/en/countries/black-and-grey-lists.html |

**Screening Procedures**
- Every individual and entity is screened before onboarding against all lists above
- Screening must cover: primary name, all known aliases, date of birth (for individuals), country of residence/incorporation, passport/ID numbers
- Fuzzy matching enabled: screen for phonetic variations, transliterations, and partial matches
- Every screening result documented and retained for five years, including "no results found" outcomes
- If a screening produces a potential match: escalate immediately to the Compliance Officer for manual review. The Compliance Officer must determine within 48 hours whether the match is a true positive (in which case the transaction is blocked and, if applicable, a SAR is filed) or a false positive (in which case the rationale for dismissal is documented)

**Tools**
- **Phase 1 (pre-revenue):** Manual screening via sanctionssearch.ofac.treas.gov (free) supplemented by opensanctions.org (free for non-commercial use)
- **Phase 2 (post-first-close):** Automated screening platform. Options include: Comply Advantage ($10,000-25,000/yr), Dow Jones Risk & Compliance ($15,000-40,000/yr), Refinitiv World-Check ($12,000-30,000/yr), or Chainalysis KYT for on-chain monitoring ($15,000-50,000/yr)
- **Phase 3 (scaling):** Integrated sanctions/PEP/adverse media platform with API integration into PleoChrome's investor onboarding flow

**Wallet Screening (Blockchain-Specific)**
- Before minting tokens to any wallet address, the wallet must be screened against known sanctioned wallet lists
- Tools: Chainalysis KYT, TRM Labs, Elliptic Lens
- Wallets flagged for interaction with OFAC-sanctioned addresses (e.g., Tornado Cash, Blender.io) must be rejected
- Ongoing monitoring of all wallets holding PleoChrome tokens for subsequent sanctioned interactions

### 1.3 PEP Screening Process

**Definition:** A Politically Exposed Person is an individual who holds or has held a prominent public function, including heads of state, senior government officials, judicial officials, senior military officers, senior executives of state-owned corporations, and important political party officials. Close family members and known close associates of PEPs are also classified as PEPs.

**Screening Procedure:**
1. At onboarding, every natural person is screened against PEP databases
2. Screening covers: the individual, their spouse, parents, siblings, children, and known business partners
3. If a PEP is identified: automatic escalation to EDD. Senior management (CEO) must approve the relationship
4. Additional requirements for PEP investors: documented source of funds with supporting evidence, documented source of wealth, enhanced ongoing monitoring, annual review by the Compliance Officer

**PEP Databases:**
- OpenSanctions (free, open-source): opensanctions.org
- Dow Jones PEP database (commercial): djkyc.com
- World-Check (Refinitiv/LSEG): refinitiv.com/en/products/world-check-kyc-screening
- ComplyAdvantage PEP lists: complyadvantage.com

**Important Note:** PEP status does not automatically disqualify an investor. Many PEPs are legitimate investors. However, the enhanced scrutiny is required because PEPs pose a higher risk of corruption and illicit fund flows.

### 1.4 Customer Due Diligence (CDD) and Enhanced Due Diligence (EDD)

**CDD Tiers and Criteria**

| Risk Tier | Criteria | Procedures | Review Frequency |
|-----------|----------|-----------|-----------------|
| **Low** | U.S. person, accredited investor, clean sanctions/PEP/adverse media screens, source of funds is salary/investment income, no adverse indicators | Standard CIP, sanctions screening, PEP screening, adverse media check | Annually |
| **Medium** | Non-U.S. person from non-high-risk jurisdiction, entity with complex ownership structure, large transaction relative to stated wealth, first-time alternative asset investor | All Low procedures PLUS source of funds documentation, beneficial ownership analysis, enhanced adverse media review | Semi-annually |
| **High** | PEP or close associate/family member, person from FATF grey/black-list jurisdiction, person with criminal history or regulatory action, person connected to a sanctioned country, any connection to the Kandi provenance chain, source of funds inconsistent with stated occupation, adverse media hits | All Medium procedures PLUS senior management approval, source of wealth documentation, independent verification of key claims, outside counsel review (if criminal/regulatory history), quarterly or per-transaction review | Quarterly or per transaction |

**EDD Documentation Requirements (High Risk)**
- Signed declaration of source of funds identifying specific accounts, investments, or income streams
- Supporting documentation (bank statements, tax returns, sale proceeds, inheritance documents)
- Signed declaration of source of wealth (how the person accumulated their net worth)
- Explanation of the purpose and intended nature of the business relationship
- Documented rationale by the Compliance Officer for accepting or rejecting the relationship
- If accepted: specific conditions imposed (e.g., transaction limits, enhanced reporting, periodic re-verification)

### 1.5 Transaction Monitoring

**What to Monitor**
- All primary token purchases (mint events)
- All secondary market transfers (if PleoChrome has visibility)
- All redemption requests
- All distributions from the SPV
- All payments to PleoChrome from asset holders
- All payments from PleoChrome to vendors, partners, or service providers exceeding $10,000

**Monitoring Rules**

| Rule | Trigger | Action |
|------|---------|--------|
| Large transaction | Single transaction > $50,000 | Enhanced review within 2 business days |
| Structuring | Multiple transactions by same party totaling > $100,000 within 30 days, each individually below $50,000 | Investigate for potential structuring; escalate to Compliance Officer |
| Geographic risk | Transaction involving person or entity in FATF grey/black-list jurisdiction | Block transaction pending EDD and senior management approval |
| Sanctions alert | Real-time or batch screening produces a potential match | Immediately suspend transaction; Compliance Officer reviews within 48 hours |
| Velocity | More than 3 transactions by same party within 7 days | Enhanced review for business rationale |
| Inconsistency | Transaction size inconsistent with investor's stated financial profile | Request updated financial information; escalate if unexplained |
| Transfer to unverified wallet | Token transfer attempt to a wallet not in the ERC-3643 Identity Registry | Automatically blocked by smart contract (ERC-3643 feature) |

### 1.6 Suspicious Activity Report (SAR) Filing Procedures

**Note:** Whether PleoChrome is required to file SARs depends on its MSB status determination. Even if PleoChrome is not classified as an MSB, it is best practice to have SAR procedures in place, and PleoChrome's broker-dealer partner (if engaged) has independent SAR filing obligations.

**When to File**
- Known or suspected money laundering
- Known or suspected terrorist financing
- Transactions that have no apparent business purpose and for which no reasonable explanation can be obtained
- Transactions designed to evade BSA reporting requirements (structuring)
- Use of proceeds from criminal activity
- Any transaction involving $5,000 or more where PleoChrome knows, suspects, or has reason to suspect that the transaction involves funds from illegal activity, is designed to evade reporting requirements, or has no business or apparent lawful purpose

**SAR Filing Process**
1. Employee identifies suspicious activity and reports internally to the Compliance Officer within 24 hours
2. Compliance Officer investigates and documents findings within 5 business days
3. If the activity is determined to be suspicious: Compliance Officer files SAR via FinCEN's BSA E-Filing System (bsaefiling.fincen.treas.gov) within 30 calendar days of initial detection. If no suspect is identified, the filing deadline extends to 60 days
4. If the activity involves an ongoing emergency (e.g., terrorism): verbal notification to FinCEN immediately, followed by written SAR within 30 days
5. All SAR filings are confidential. PleoChrome must NOT notify the subject of the SAR (tipping off is a federal offense under 31 USC 5318(g)(2))
6. Supporting documentation retained for five years from the date of filing

**Recordkeeping**
- A SAR decision log must be maintained, documenting every suspicious activity referral, the investigation conducted, the decision (file or not file), and the rationale
- All SARs filed must be indexed and retrievable
- SAR-related records must be stored separately from other customer files and accessible only to the Compliance Officer, CEO, and outside counsel

### 1.7 Compliance Training Program

**Who Must Be Trained**
- All three founders (Shane, David, Chris)
- Any future employees, contractors, or agents who have customer-facing roles, access to customer data, or involvement in transaction processing
- Board members or advisors (when established)

**Training Content**

| Module | Content | Frequency |
|--------|---------|-----------|
| BSA/AML Fundamentals | Money laundering stages (placement, layering, integration), terrorist financing, trade-based money laundering, crypto-specific typologies | Annual (initial + refresher) |
| KYC/CDD Procedures | PleoChrome's specific CIP requirements, CDD tiers, EDD triggers, documentation requirements | Annual (initial + refresher) |
| Sanctions Compliance | OFAC SDN list screening, secondary sanctions risk, consequences of sanctions violations (criminal penalties up to $20M and 30 years imprisonment per violation) | Annual (initial + refresher) |
| SAR Recognition and Filing | Red flags for suspicious activity, internal escalation procedures, SAR filing process, tipping-off prohibition | Annual (initial + refresher) |
| Securities Compliance | Reg D 506(c) requirements, accredited investor verification, general solicitation rules, anti-fraud provisions, bad actor disqualification | Annual (initial + refresher) |
| Blockchain-Specific Risks | Wallet screening, tornado cash and mixer detection, transaction analysis, smart contract exploit indicators | Annual (initial + refresher) |
| Data Privacy | Investor PII handling, data retention, breach notification requirements, CCPA/state privacy law compliance | Annual (initial + refresher) |
| Insider Trading and Material Non-Public Information | Handling of MNPI, trading restrictions, tipping prohibitions | Annual (initial + refresher) |

**Training Delivery**
- **Phase 1 (pre-revenue):** Self-study using free resources: ACAMS free courses (acams.org), FinCEN advisories (fincen.gov/resources/advisories), SEC small business resources (sec.gov/resources-small-businesses)
- **Phase 2 (post-first-close):** Formal training via compliance training platform: BSA/AML training from ACAMS ($500-2,000/person/course), Traliant ($300-500/person/yr for compliance training suite), or KnowBe4 ($15-25/user/month for security + compliance training)
- **Documentation:** Completion records for every training session, including date, attendee name, trainer/platform, and topics covered. Retained for five years.

### 1.8 Independent Testing (Annual Audit)

**Requirement:** An independent test of PleoChrome's BSA/AML program must be conducted at least annually. The tester must have no role in implementing or managing the program.

**Who Can Perform Independent Testing**
- An external accounting firm with BSA/AML audit experience
- A specialized AML compliance consulting firm
- A qualified internal auditor (only feasible when PleoChrome has sufficient headcount to separate audit from compliance functions -- unlikely before 20+ employees)

**Scope of Annual Independent Test**
- Adequacy of CIP/CDD/EDD procedures as documented
- Effectiveness of sanctions screening (sample testing of actual screenings performed)
- Transaction monitoring coverage and effectiveness
- SAR decision log review (were reportable events properly escalated and filed?)
- Training program effectiveness and completion rates
- Record retention compliance
- Policy and procedure currency (have policies been updated to reflect regulatory changes?)
- Testing of sample customer files against policy requirements

**Cost:** $5,000-15,000/year for an external firm to conduct a focused BSA/AML independent test for a small fintech. This is distinct from a SOC 2 audit (see Section 8).

**Timeline:** First independent test should be conducted within 12 months of the first investor closing.

### 1.9 Record Retention Policy

| Record Type | Minimum Retention Period | Format | Storage |
|-------------|-------------------------|--------|---------|
| CIP/KYC records (identification documents, verification results) | 5 years after relationship termination | Digital (scanned originals) | Encrypted cloud storage with access controls |
| CDD/EDD records (risk assessments, source of funds documentation) | 5 years after relationship termination | Digital | Encrypted cloud storage |
| Sanctions screening results | 5 years from date of screening | Digital | Compliance file system |
| SAR filings and supporting documentation | 5 years from date of filing | Digital | Restricted access (Compliance Officer + CEO only) |
| Transaction records | 5 years from date of transaction | Digital (blockchain provides permanent record; off-chain records supplemental) | Compliance file system + blockchain |
| Training records | 5 years from date of training | Digital | HR/Compliance file system |
| Independent test reports | 5 years from date of report | Digital | Compliance file system |
| PPM and offering documents | Life of the entity + 5 years | Digital + physical (one signed copy) | Legal file system |
| Investor correspondence | 5 years from date of communication | Digital | Investor relations system |
| Board/management meeting minutes | Life of the entity + 5 years | Digital | Corporate records |
| Insurance policies | Life of policy + 5 years | Digital + physical | Finance file system |
| Smart contract audit reports | Life of the entity | Digital | Technical file system |
| AML/KYC Policy (all versions) | Life of the entity | Digital | Compliance file system |

**Destruction:** Records past the retention period may be destroyed only with written approval from the Compliance Officer, after confirming no pending litigation, regulatory inquiry, or investigation that would require preservation. All destruction must be documented.

### 1.10 Whistleblower Procedures

**Policy Statement:** PleoChrome encourages and protects employees, contractors, and partners who report in good faith any activity they believe to be illegal, unethical, or in violation of PleoChrome's policies.

**How to Report**
- **Internal:** Report to the Compliance Officer (if the report does not concern the Compliance Officer) or to the CEO (if the report concerns the Compliance Officer)
- **External:** Employees and contractors retain the right to report directly to the SEC (sec.gov/whistleblower), FinCEN, FINRA, or any other relevant regulator without first reporting internally
- Reports may be made anonymously

**Protections**
- PleoChrome will not retaliate against any person who makes a good-faith report of potential violations
- Retaliation includes termination, demotion, suspension, threats, harassment, or any other adverse action
- Any person who retaliates against a whistleblower will be subject to disciplinary action up to and including termination
- The SEC Whistleblower Program provides financial awards (10-30% of monetary sanctions exceeding $1,000,000) and anti-retaliation protections under Dodd-Frank Section 21F

**Investigation Procedures**
1. All reports are documented and assigned to an investigator (Compliance Officer or outside counsel)
2. The investigation is conducted confidentially to the extent possible
3. The reporter receives acknowledgment within 5 business days (unless anonymous)
4. Findings are documented and reported to the CEO (or the Board, if the report concerns the CEO)
5. Corrective actions are implemented and documented
6. The reporter is informed of the outcome to the extent appropriate (without compromising confidentiality of other parties)

### 1.11 MSB Status Determination (Critical Threshold Decision)

**Why This Matters:** Operating as an unregistered Money Services Business is a federal crime (18 USC 1960). Securities counsel must provide a written legal opinion on whether PleoChrome's activities require FinCEN registration as an MSB.

**Key Analysis Points:**
- Does PleoChrome "accept and transmit value" at any point in the token purchase process? If investor funds flow through PleoChrome's bank account (even briefly) before reaching the SPV, PleoChrome may be a "money transmitter" under BSA rules
- Does PleoChrome "issue" the tokens? Under FinCEN's 2019 guidance on convertible virtual currencies, the administrator of a CVC system is generally an MSB
- If Brickken handles token issuance and the SPV account directly receives investor funds, PleoChrome's argument for exemption is stronger
- If a broker-dealer handles all fund flows, PleoChrome's MSB risk is significantly reduced (the BD is already separately regulated)

**If PleoChrome IS an MSB:**
- Register with FinCEN (no fee, online at fincen.gov)
- Obtain state money transmitter licenses in up to 47 states (cost: $500,000+ over 12-18 months, with surety bond requirements of $25,000-500,000 per state)
- Comply with all BSA/AML requirements (which PleoChrome is already building)
- This is the nightmare scenario -- 47-state licensing is an existential cost for a startup

**If PleoChrome is NOT an MSB:**
- Document the legal basis for the exemption (counsel's written opinion)
- Maintain compliance procedures anyway (best practice and required for partner onboarding)
- Re-evaluate whenever the business model changes

**Budget for Legal Opinion:** $2,000-5,000 from securities counsel. This must be obtained no later than Week 6 per the Critical Next Steps action plan.

---

## 2. COMPLIANCE OFFICER ROLE

### 2.1 Why the CRO Should Not Also Serve as Compliance Officer

The original action plan designated Chris Ramsey as Chief Compliance Officer (CCO). This creates a conflict of interest that should be corrected.

**The Conflict:**
- Chris's primary role is Chief Revenue Officer (CRO): he drives revenue through asset holder relationships, investor introductions, and partnership development
- The Compliance Officer's job is to say "no" when compliance requirements are not met, even if saying no kills a deal
- A person whose compensation and success metrics are tied to revenue generation cannot simultaneously serve as the independent compliance gatekeeper
- Regulators (SEC, FinCEN, FINRA) expect the compliance function to be independent from revenue-generating activities

**Recommended Approach:** As CEO, Shane serves as interim Compliance Officer, a standard practice for early-stage companies, with David providing operational support. Chris's 33 years of legal experience make him an invaluable resource for reviewing documents and identifying compliance issues. That experience should be leveraged -- but in a consultative capacity, not as the person with sign-off authority. The Compliance Officer must be someone whose only job is compliance and who has no revenue incentive to approve a questionable transaction.

### 2.2 Separation of Duties Requirements

| Function | Who Should Do It | Who Should NOT Do It |
|----------|-----------------|---------------------|
| AML/KYC policy drafting | Chris (initial draft leverage his legal experience) + Compliance Officer (review and approval) | David (CTO -- different function) |
| Sanctions screening execution | David (operational execution) | Chris (conflict with CRO role) |
| Sanctions screening oversight | Compliance Officer | Chris or Shane |
| SAR filing decision | Compliance Officer | Anyone with a revenue interest in the transaction |
| EDD approval for high-risk clients | Compliance Officer + CEO (joint approval) | CRO alone |
| Marketing material compliance review | Compliance Officer + outside counsel | Marketing team alone |
| Investor complaint handling | Compliance Officer (initial receipt and investigation) | CRO (conflict -- CRO may prioritize relationship preservation over compliance) |
| Annual independent test oversight | Compliance Officer (coordination) | CEO or CRO (must be independent) |
| PPM disclosure review | Compliance Officer + outside counsel | No single person alone |
| Form D filing | Outside counsel + Compliance Officer verification | Unchecked |

### 2.3 Phase 1: Fractional / Outsourced CCO

**Recommendation:** Engage a fractional Chief Compliance Officer immediately upon entity formation. This person should be independent of the founding team and have specific experience in securities compliance, AML/KYC, and ideally digital asset or fintech compliance.

**What a Fractional CCO Does**
- Reviews and approves the AML/KYC policy
- Signs off on all investor onboarding (sanctions screening, CDD/EDD)
- Reviews marketing materials for compliance before distribution
- Handles SAR decision-making
- Coordinates the annual independent test
- Serves as the point of contact for regulatory inquiries
- Provides quarterly compliance reports to the CEO
- Attends weekly team meetings (or bi-weekly) to address compliance questions

**Where to Find Fractional CCOs**

| Provider | Specialty | Estimated Cost | Notes |
|----------|-----------|---------------|-------|
| ComplianceAlpha | Fintech/crypto CCO-as-a-service | $50,000-80,000/yr | Dedicated fractional CCO with digital asset experience |
| Oyster Consulting | BD/RIA compliance | $60,000-100,000/yr | Strong securities compliance background |
| RIA Compliance Consultants | Investment advisor compliance | $40,000-70,000/yr | Securities-focused |
| CryptoCompli | Crypto/blockchain compliance | $50,000-90,000/yr | Specific digital asset expertise |
| NRS Compliance (National Regulatory Services) | BD/RIA compliance outsourcing | $60,000-120,000/yr | Full compliance outsourcing for broker-dealers |
| ACA Group (formerly ACA Compliance) | Full compliance outsourcing | $75,000-150,000/yr | Institutional-grade, serves major funds and BDs |
| Individual contractors (via LinkedIn, ACAMS network) | Variable | $150-350/hr (10-20 hrs/month = $18,000-84,000/yr) | More flexible but less institutional support |

**Selection Criteria for Fractional CCO**
- Must have no ownership interest in PleoChrome or any asset holder
- Must have no revenue-based compensation tied to PleoChrome deals
- Must have at least 5 years of BSA/AML compliance experience
- Must have securities compliance experience (Reg D preferred, not required)
- Digital asset/blockchain compliance experience strongly preferred
- Must be willing to serve as the named Compliance Officer in regulatory filings and partner due diligence
- Must carry professional liability (E&O) insurance
- Must be available within 24 hours for urgent compliance decisions (sanctions alerts, SAR decisions)

### 2.4 Phase 2: When to Bring CCO In-House

**Triggers for In-House CCO Hire:**
- AUM exceeds $50,000,000 (multiple tokenized assets under management)
- Number of investors exceeds 100
- Transaction volume exceeds 50 per quarter
- PleoChrome obtains its own BD registration or transfer agent registration
- Regulatory examination or enforcement action occurs
- Insurance carrier or BD partner requires an in-house CCO

**In-House CCO Profile**
- Title: Chief Compliance Officer
- Reports to: CEO (not CRO, not CTO)
- Salary range: $120,000-200,000 base + benefits
- Required qualifications: CAMS (Certified Anti-Money Laundering Specialist), Series 7 or Series 24 (if PleoChrome has BD involvement), 7+ years compliance experience, digital asset experience preferred
- First hire in the compliance function; will build out the team as needed

**Timeline:** Realistically, PleoChrome will operate with a fractional CCO for 12-24 months (covering the first 2-3 tokenized assets). In-house CCO becomes necessary when the volume and complexity exceed what 10-20 hours per month can cover.

### 2.5 Chris Ramsey's Compliance Consultation Role

Chris is not the Compliance Officer. His role is CRO with compliance consultation responsibilities:

**What Chris DOES:**
- Drafts initial versions of compliance documents (leveraging 33 years of legal experience) for the CCO and outside counsel to review and approve
- Serves as primary liaison between PleoChrome and outside securities counsel
- Conducts first-pass review of PPM sections, engagement agreements, and investor-facing documents
- Identifies potential compliance issues in new asset holder relationships and escalates them to the CCO
- Monitors regulatory developments and alerts the team to relevant changes
- Interviews and evaluates appraiser candidates for independence and qualifications
- Reviews marketing materials for obvious compliance issues before forwarding to CCO and counsel for formal approval

---

## 3. RISK FRAMEWORK

### 3.1 Risk Taxonomy

The following risk taxonomy identifies every material risk facing PleoChrome, categorized by type, assessed for probability and impact, and assigned to a specific owner with defined mitigation and monitoring procedures.

**Probability Scale:**
- 1 (Very Low): < 5% chance in next 12 months
- 2 (Low): 5-15%
- 3 (Moderate): 15-40%
- 4 (High): 40-70%
- 5 (Very High): > 70%

**Impact Scale:**
- 1 (Negligible): < $10,000 loss, no operational disruption, no reputational effect
- 2 (Minor): $10,000-50,000 loss, temporary disruption, limited reputational effect
- 3 (Moderate): $50,000-250,000 loss, significant disruption, moderate reputational effect
- 4 (Severe): $250,000-1,000,000 loss, major disruption, significant reputational damage
- 5 (Catastrophic): > $1,000,000 loss, existential threat, potentially fatal reputational damage

**Risk Score = Probability x Impact** (1-25 scale)

---

### RISK 1: Regulatory Risk (SEC)

**Description:** The SEC could take enforcement action against PleoChrome for violations of securities laws, including failure to properly register securities, inadequate investor verification, misleading disclosures, or failure to file Form D.

| Attribute | Assessment |
|-----------|-----------|
| **Probability** | 2 (Low) -- 506(c) is well-established; the SEC is actively encouraging tokenization. Risk increases if PleoChrome fails to follow procedures |
| **Impact** | 5 (Catastrophic) -- SEC enforcement can result in disgorgement of all investor funds, civil penalties, injunctions prohibiting future securities offerings, and personal liability for officers |
| **Risk Score** | 10 |
| **Owner** | Shane (CEO) + Fractional CCO |

**Mitigation:**
- Engage experienced securities counsel before any offering activity
- Ensure PPM is comprehensive, accurate, and reviewed by counsel
- File Form D within 15 days of first sale (file before first sale if possible)
- Verify every investor's accredited status per 506(c) requirements
- Maintain complete records of all verification procedures
- Ensure all marketing materials are reviewed by counsel before publication
- Conduct bad actor checks on all covered persons per Rule 506(d)
- Never sell to a non-accredited investor under any circumstances

**Monitoring:**
- Quarterly compliance review by fractional CCO
- Annual independent compliance test
- Securities counsel retainer for ongoing regulatory questions
- Monitor SEC enforcement actions, no-action letters, and staff statements related to tokenized securities
- Track SEC rulemaking on transfer agent reform and digital asset regulation

---

### RISK 2: Regulatory Risk (FinCEN / BSA)

**Description:** PleoChrome could be required to register as a Money Services Business (MSB) with FinCEN and obtain state money transmitter licenses, or face criminal prosecution for operating as an unregistered MSB.

| Attribute | Assessment |
|-----------|-----------|
| **Probability** | 3 (Moderate) -- Depends on how fund flows are structured. If investor funds pass through PleoChrome, MSB risk is high. If funds go directly to SPV or through a BD, risk is low |
| **Impact** | 5 (Catastrophic) -- Operating as an unregistered MSB is a federal crime (18 USC 1960). Penalties include up to 5 years imprisonment and $250,000 fine per violation. State money transmitter licensing costs $500,000+ |
| **Risk Score** | 15 |
| **Owner** | Shane (CEO) + outside counsel |

**Mitigation:**
- Obtain written legal opinion on MSB status from securities counsel no later than Week 6
- Structure all fund flows to minimize PleoChrome's role in value transmission: investor funds go directly to SPV bank account, not through PleoChrome
- If a BD is engaged, all investor fund flows go through the BD
- If PleoChrome IS determined to be an MSB: immediately register with FinCEN (free, online) and begin state licensing process -- OR restructure operations to avoid MSB classification
- Maintain full BSA/AML compliance program regardless of MSB determination (addresses partner requirements and provides defense-in-depth)

**Monitoring:**
- Track FinCEN guidance on digital asset intermediaries
- Review fund flow architecture before each new offering to confirm non-MSB structure
- Annual legal review of MSB status as business model evolves

---

### RISK 3: Regulatory Risk (State Regulators)

**Description:** State securities regulators could bring enforcement actions for failure to file blue sky notices, violation of state anti-fraud provisions, or unauthorized broker-dealer activity. Certain states (New York, Massachusetts, California) are particularly aggressive.

| Attribute | Assessment |
|-----------|-----------|
| **Probability** | 2 (Low) -- Blue sky compliance is straightforward for 506(c) offerings; federal preemption limits state authority |
| **Impact** | 3 (Moderate) -- State enforcement can result in fines, cease-and-desist orders, and prohibition from offering securities in that state |
| **Risk Score** | 6 |
| **Owner** | Outside counsel + fractional CCO |

**Mitigation:**
- File blue sky notices in every state where securities are sold, within 15 days of first sale in each state
- File New York notice BEFORE first sale (unique NY requirement)
- Use EFD (Electronic Filing Depository) for states that accept it; manual filing for NY and FL
- Track all investor locations and file in corresponding states
- Ensure all marketing materials comply with state advertising requirements (which are preempted for 506(c) but state anti-fraud rules still apply)
- Maintain state filing calendar with renewal dates

**Monitoring:**
- Track state blue sky filing deadlines
- Monitor NASAA (North American Securities Administrators Association) for new state-level digital asset requirements
- Annual review of state filings for completeness and currency

---

### RISK 4: Legal Risk (Lawsuits and Liability)

**Description:** Investor lawsuits, asset holder disputes, partner claims, IP infringement, or other legal actions against PleoChrome or its officers.

| Attribute | Assessment |
|-----------|-----------|
| **Probability** | 3 (Moderate) -- Alternative investments attract litigation; the Kandi provenance situation increases exposure |
| **Impact** | 4 (Severe) -- Litigation costs $50,000-500,000+ even if PleoChrome prevails; adverse judgment could be catastrophic |
| **Risk Score** | 12 |
| **Owner** | Shane (CEO) + outside counsel |

**Mitigation:**
- D&O insurance with adequate limits (see Section 5)
- E&O / professional liability insurance
- Comprehensive risk factors in the PPM -- the primary legal defense against investor fraud claims is demonstrating that all material information was disclosed
- Clear engagement agreements with every asset holder, appraiser, vault, and service provider
- Operating agreement with clear dispute resolution procedures (arbitration preferred to reduce litigation costs)
- Clear separation of PleoChrome's role (orchestrator, not custodian, dealer, or investment advisor)
- Document every decision, every communication, and every compliance review

**Monitoring:**
- Quarterly review of all active contracts for compliance and renewal
- Immediate engagement of litigation counsel if any demand letter, complaint, or regulatory inquiry is received
- Annual review of insurance coverage adequacy

---

### RISK 5: Operational Risk (Process Failures, Human Error)

**Description:** Errors in investor onboarding (minting tokens to wrong wallet), KYC processing mistakes (approving an unqualified investor), misconfigured smart contract compliance rules, incorrect NAV calculations, missed filing deadlines.

| Attribute | Assessment |
|-----------|-----------|
| **Probability** | 4 (High) -- A team of 3 handling complex multi-step processes with no redundancy has elevated human error risk |
| **Impact** | 3 (Moderate) -- Most operational errors are recoverable (ERC-3643 has freeze and force-transfer capabilities), but could result in regulatory violations, investor complaints, or financial loss |
| **Risk Score** | 12 |
| **Owner** | David (CTO) |

**Mitigation:**
- Documented Standard Operating Procedures (SOPs) for every critical process: investor onboarding, token minting, sanctions screening, NAV calculation, filing deadlines, vault coordination
- Two-person verification for all high-impact operations: token minting requires both David and Shane to approve; smart contract parameter changes require both David and Shane
- Multi-signature wallet for all smart contract admin operations (2-of-3 multisig minimum)
- Automated calendar reminders for all recurring deadlines: Form D annual amendment, blue sky renewals, insurance renewals, sanctions re-screening
- Testnet deployment and testing before every mainnet operation
- Post-incident review for every operational error, no matter how minor, with documented root cause and corrective action

**Monitoring:**
- Weekly operational checklist reviewed at Monday team meeting
- Monthly process audit by fractional CCO (review of sample investor files, screening logs, and transaction records)
- Annual SOP review and update

---

### RISK 6: Technology Risk (Smart Contract Bugs, Hacks, Platform Downtime)

**Description:** Smart contract vulnerabilities that could allow unauthorized minting, theft of tokens, bypass of compliance rules, or permanent loss of admin access. Platform downtime (Polygon, Brickken, or PleoChrome systems) could prevent investor access or token operations.

| Attribute | Assessment |
|-----------|-----------|
| **Probability** | 2 (Low) -- ERC-3643 is a well-audited standard; Brickken's contracts are pre-audited; PleoChrome will commission an independent audit |
| **Impact** | 5 (Catastrophic) -- A smart contract exploit could result in total loss of token value, unauthorized transfers, or permanent freezing of all tokens |
| **Risk Score** | 10 |
| **Owner** | David (CTO) |

**Mitigation:**
- Independent smart contract audit before mainnet deployment ($15,000-50,000 from OpenZeppelin, CertiK, Quantstamp, QuillAudits, or Sherlock)
- DO NOT deploy to mainnet with any unresolved critical or high-severity audit findings
- Multi-sig wallet for Owner and Agent roles (never a single private key)
- Hardware wallet storage for all admin keys (Ledger or Trezor)
- Private key backup procedures: encrypted seed phrases stored in separate physical locations (e.g., bank safe deposit box + personal safe in different cities)
- Key succession plan documented in the Operating Agreement: if David is incapacitated, who has access to deploy emergency operations?
- ERC-3643 emergency functions: pause() capability for all transfers in case of exploit; setAddressFrozen() for individual wallet freezes
- Oracle fallback plan: if Chainlink PoR fails, design contracts to allow manual attestation via multisig as a temporary measure
- Brickken contingency: maintain all contract ABIs, deployment addresses, and interaction scripts independent of Brickken's platform

**Monitoring:**
- Monitor smart contract events on-chain (Tenderly, Defender, or custom monitoring)
- Subscribe to security advisories for Solidity, OpenZeppelin, Polygon, and ERC-3643
- Review Brickken platform status and announcements monthly
- Review Chainlink PoR feed status daily (automated alert if feed goes stale)

---

### RISK 7: Custody Risk (Vault Breach, Insurance Gaps)

**Description:** Physical theft, damage, or loss of gemstones in vault custody. Insurance gaps due to appreciation above insured value. Vault operator insolvency. Transit losses during appraisal chain.

| Attribute | Assessment |
|-----------|-----------|
| **Probability** | 1 (Very Low) -- Institutional vaults (Brink's, Malca-Amit) have near-zero historical loss rates. Grade XII vaults are hardened against most physical threats |
| **Impact** | 5 (Catastrophic) -- Total loss of underlying asset. Even with insurance, claim processing takes months and may not cover full current value |
| **Risk Score** | 5 |
| **Owner** | David (CTO) -- vault operations; Shane (CEO) -- insurance oversight |

**Mitigation:**
- Use only institutional-grade vault facilities with segregated (allocated) storage -- NEVER commingled
- Specie insurance covering full current appraised value, adjusted annually after each reappraisal
- Require vault to maintain its own liability insurance independent of PleoChrome's specie coverage
- Transit insurance for every movement of stones (GIA submission, appraiser visits, vault transfers) -- Brink's or Malca-Amit armored transit
- Operating agreement mandates annual reappraisal with automatic insurance coverage adjustment
- Custody agreement must specify: vault is bailee (PleoChrome/SPV retains ownership), gemstones are not part of vault's bankruptcy estate, vault must provide immediate notification of any security incident
- Evaluate vault's financial health annually: review financial statements, check for liens or lawsuits, confirm insurance is current

**Monitoring:**
- Daily or weekly custody confirmation from vault (API feed or written report)
- Annual vault inspection (in-person verification that stones are present and match GIA certificates)
- Chainlink PoR feed connected to vault data for continuous on-chain custody verification
- Insurance renewal calendar: 90-day advance renewal notice
- Annual reappraisal triggers insurance adjustment review within 30 days

---

### RISK 8: Valuation Risk (Appraisal Accuracy, Market Movements)

**Description:** Gemstone valuations are inherently subjective. Appraisals can vary significantly. Market conditions can cause gemstone values to appreciate or depreciate unpredictably. Investors may dispute the offering value.

| Attribute | Assessment |
|-----------|-----------|
| **Probability** | 3 (Moderate) -- Gemstone markets are opaque compared to gold or equities; the "3-Appraisal Rule" reduces but does not eliminate valuation risk |
| **Impact** | 3 (Moderate) -- If the offering is overpriced, investors lose money; if underpriced, the asset holder and PleoChrome leave money on the table. Significant variance between appraisals creates credibility issues |
| **Risk Score** | 9 |
| **Owner** | David (CTO) -- appraisal coordination; Shane (CEO) -- pricing decision |

**Mitigation:**
- Three independent USPAP-compliant appraisals from CGA/MGA-credentialed appraisers with no affiliations to PleoChrome, the asset holder, the vault, or each other
- Offering value = average of the two lowest appraisals (conservative methodology)
- If any two appraisals differ by more than 15-20%, commission a fourth tiebreaker appraisal
- GIA Identification and Origin Reports for all significant stones (independently verifiable at gia.edu)
- SSEF Origin Determination for stones where Colombian vs. Zambian origin significantly affects value
- Annual reappraisal by a single independent appraiser to update NAV
- Full disclosure in PPM of valuation methodology, inherent subjectivity, and risk of depreciation
- Subscription to GemGuide or Gemval for market data to support quarterly NAV commentary

**Monitoring:**
- Track gemstone market indices quarterly (Gemval GVA, Gemfields auction results, Christie's/Sotheby's sales)
- Annual reappraisal with comparison to prior valuations
- Monitor lab-grown gemstone developments that could affect natural stone values

---

### RISK 9: Counterparty Risk (Brickken, Chainlink, Vault, BD Failures)

**Description:** Key service providers could fail, change terms, or become unable to deliver their services. PleoChrome's business depends on multiple external partners, any of whom could create operational disruption.

| Attribute | Assessment |
|-----------|-----------|
| **Probability** | 2 (Low) for Chainlink (massive, well-funded); 3 (Moderate) for Brickken (startup risk); 1 (Very Low) for Brink's/Malca-Amit (established institutions); 2 (Low) for BD/Dalmore |
| **Impact** | 3 (Moderate) for any single provider failure -- PleoChrome can migrate to alternatives, but migration costs time and money |
| **Risk Score** | 6-9 (varies by counterparty) |
| **Owner** | Shane (CEO) -- partnership oversight; David (CTO) -- technical migration planning |

**Mitigation by Counterparty:**

| Counterparty | Mitigation | Contingency If They Fail |
|--------------|-----------|------------------------|
| **Brickken** | Maintain all contract ABIs, deployment records, and admin keys independent of Brickken. Understand how to interact with contracts directly via ethers.js or Hardhat scripts | ERC-3643 tokens persist on-chain regardless of Brickken. Build or source replacement management UI. Evaluate Tokeny (original ERC-3643 developer) or Securitize as alternatives |
| **Chainlink** | Design oracle contracts with updateable feed address. Consider multi-oracle architecture from launch | Switch to Band Protocol, API3, Pyth, or Tellor. Or implement manual attestation via multisig as interim measure |
| **Vault (Brink's/Malca-Amit)** | Custody agreement with 90-day termination notice. Insurance covering transit risk during vault changes | Transfer stones to alternative institutional vault. Multiple vault providers in the pipeline from initial RFP process |
| **Broker-Dealer (Dalmore)** | Engagement letter with clear termination provisions. Maintain issuer exemption capability (PleoChrome can self-distribute under Section 3(a)(4)) | Engage alternative BD: North Capital, Rialto Markets, or tZERO. Or distribute exclusively under issuer exemption |
| **Transfer Agent** | Maintain parallel off-chain cap table records. ERC-3643 Identity Registry serves as on-chain backup | Engage alternative digital transfer agent: Vertalo, KoreConX, or operate as own transfer agent (no SEC registration required for non-reporting issuers) |

**Monitoring:**
- Quarterly business health check on all critical counterparties
- Annual review of all counterparty contracts for terms, renewal, and exit provisions
- Maintain "war room" contingency plans documented and accessible to all three founders

---

### RISK 10: Reputational Risk

**Description:** Negative publicity that damages PleoChrome's credibility with investors, partners, or regulators. Sources include: discovery of Kandi's criminal history, media scrutiny of the gemstone tokenization model, social media attacks, partner failures that reflect on PleoChrome.

| Attribute | Assessment |
|-----------|-----------|
| **Probability** | 3 (Moderate) -- The Kandi provenance will be discovered by any serious due diligence. The question is not "if" but "when" and "how it is framed" |
| **Impact** | 4 (Severe) -- Institutional investors and BD partners will walk away if they feel blindsided. Proactive disclosure controls the narrative; discovery through a third party's DD process is far more damaging |
| **Risk Score** | 12 |
| **Owner** | Shane (CEO) -- narrative control |

**Mitigation:**
- Proactive disclosure strategy for Kandi provenance (see Section 4 -- detailed)
- Professional, institutional-quality website and materials (already live at pleochrome.com)
- Consistent messaging: PleoChrome is an orchestration platform (not a dealer, not a vault, not an exchange)
- No claims that cannot be substantiated
- No crypto-bro aesthetics, no "guaranteed returns," no hype
- Crisis communication templates prepared in advance (see Section 7)
- Media inquiry protocol: all media inquiries go through Shane; no one else speaks on the record without Shane's approval
- Google Alert monitoring for "PleoChrome," "Emiel Kandi," and relevant variations

**Monitoring:**
- Weekly Google Alerts review
- Monthly social media monitoring
- Track all partner and investor due diligence inquiries that reference reputation-related topics
- Debrief after every partner meeting to identify reputation concerns raised

---

### RISK 11: Market Risk (No Investors, Illiquidity)

**Description:** Failure to attract sufficient accredited investors to the offering. Token holders unable to sell on secondary markets due to illiquidity. Broader economic downturn reducing appetite for alternative investments.

| Attribute | Assessment |
|-----------|-----------|
| **Probability** | 3 (Moderate) -- First-time issuer with no track record, novel asset class, high minimum investment, and restricted securities with no guaranteed secondary market |
| **Impact** | 4 (Severe) -- If the offering fails to raise sufficient capital, PleoChrome cannot cover ongoing costs, SPV becomes insolvent, and the team has invested $100,000-250,000 with no return |
| **Risk Score** | 12 |
| **Owner** | Shane (CEO) -- investor pipeline; Chris (CRO) -- relationship development |

**Mitigation:**
- Engage a BD of record (Dalmore Group recommended) for credibility and distribution support
- Develop a robust investor pipeline before the offering launches: target 50+ qualified leads before first sale
- Leverage Chris's existing $1.5B+ pipeline of GIA-certified asset holders as proof of supply -- supply-side credibility attracts demand-side investors
- Position gemstone tokens as portfolio diversification (uncorrelated to stocks and bonds) with 5-8% historical annual appreciation
- Minimum viable raise: determine the minimum capital raise that covers all SPV operating costs for 24 months and set that as the minimum offering amount in the PPM
- Escrow arrangement: hold investor funds in escrow until minimum raise is achieved; return funds if minimum is not met
- Build secondary market pathway from Day 1: engage ATS provider (tZERO, North Capital PPEX) alongside primary offering

**Monitoring:**
- Weekly pipeline metrics: leads generated, meetings held, PPM downloads, subscription commitments
- Monthly conversion funnel analysis: outreach -> meeting -> PPM review -> subscription -> close
- Quarterly market sentiment assessment: alternative investment market conditions, crypto market conditions, HNW investor appetite

---

### RISK 12: Key Person Risk (Team of 3)

**Description:** PleoChrome is entirely dependent on three individuals. Loss of any one founder (departure, death, disability, incapacitation) could be existential. Each founder holds unique, non-redundant expertise: Shane (business development, investor relationships), David (all technology), Chris (all asset holder relationships, compliance consultation).

| Attribute | Assessment |
|-----------|-----------|
| **Probability** | 2 (Low) -- Statistically unlikely in any given year for any individual; elevated slightly by the small team size |
| **Impact** | 5 (Catastrophic) -- Loss of David means no one can operate smart contracts, manage the oracle, or handle technical operations. Loss of Shane means no investor relationships or corporate leadership. Loss of Chris means no asset holder pipeline or compliance consultation |
| **Risk Score** | 10 |
| **Owner** | Shane (CEO) -- succession planning |

**Mitigation:**
- Operating Agreement must include comprehensive succession provisions: what happens if a member dies, becomes disabled, or voluntarily departs
- Key person insurance: $1,000,000-2,000,000 policy on each founder ($500-1,500/person/year for term life + disability)
- Cross-training: each founder documents their critical processes in written SOPs that another founder can follow
- Smart contract admin key escrow: a sealed envelope with recovery instructions stored with outside counsel or in a bank safe deposit box, accessible by the surviving founders
- David documents all technical procedures (Brickken configuration, Chainlink integration, wallet operations, deployment scripts) in a technical operations manual that Shane or a future hire could follow
- Chris documents all asset holder relationships, pipeline contacts, and relationship history in CRM (not just in his head)
- Shane documents all investor relationships, partner contacts, and corporate governance decisions
- Buy-sell agreement in the Operating Agreement: surviving founders can purchase departed founder's interest at a fair price determined by a formula or independent valuation

**Monitoring:**
- Quarterly review of SOPs and technical documentation currency
- Annual review of key person insurance coverage adequacy
- Annual review of Operating Agreement succession provisions

---

### 3.2 Risk Register Summary

| # | Risk | Probability | Impact | Score | Owner | Priority |
|---|------|------------|--------|-------|-------|----------|
| 10 | Reputational (Kandi provenance, media) | 3 | 4 | **12** | Shane | HIGH |
| 2 | Regulatory (FinCEN/MSB) | 3 | 5 | **15** | Shane + counsel | CRITICAL |
| 4 | Legal (lawsuits, liability) | 3 | 4 | **12** | Shane + counsel | HIGH |
| 5 | Operational (process failures) | 4 | 3 | **12** | David | HIGH |
| 11 | Market (no investors, illiquidity) | 3 | 4 | **12** | Shane + Chris | HIGH |
| 1 | Regulatory (SEC) | 2 | 5 | **10** | Shane + CCO | HIGH |
| 6 | Technology (smart contract bugs) | 2 | 5 | **10** | David | HIGH |
| 12 | Key person (team of 3) | 2 | 5 | **10** | Shane | HIGH |
| 8 | Valuation (appraisal accuracy) | 3 | 3 | **9** | David + Shane | MEDIUM |
| 9 | Counterparty (Brickken, Chainlink, vault) | 2-3 | 3 | **6-9** | Shane + David | MEDIUM |
| 3 | Regulatory (state) | 2 | 3 | **6** | Counsel + CCO | MEDIUM |
| 7 | Custody (vault breach, insurance gap) | 1 | 5 | **5** | David + Shane | MEDIUM |

---

## 4. KANDI ASSET PROVENANCE RISK MANAGEMENT

### 4.1 Current State of Knowledge

**The Asset:** Approximately $10-18M barrel of emeralds held at Olympic Vault, Tacoma, WA.

**The Owner:** Emiel A. Kandi, through White Oak Partners II LLC.

**The Problem:** Kandi is a convicted federal felon (Case No. CR13-5369-RBL, W.D. Wash., April 2014 guilty plea). Conspiracy to Submit False Statements in Loan Applications and Making False Statements to HUD. Sentenced to 5 years in federal prison, $831,000+ in restitution.

**Additional Complications:**
- The ownership chain involves Jeff Goodell, also convicted of bank fraud (stealing $1M from the Tacoma Rescue Mission), who allegedly faked loan forms for an $8.716M line of credit secured by "four barrels of uncut emeralds worth $47 million"
- Two former associates allegedly changed company state records and moved emeralds from Tacoma to Florida without Kandi's permission
- Kandi transferred all membership shares to himself in 2016
- 2019 default judgment in Pierce County Superior Court (defendants did not appear -- one was in state prison for homicide)
- 2019 probation violations alleged (self-employment without permission, failure to disclose assets)
- Unpaid $62K vault bill at Olympic Vault

### 4.2 Decision Framework: Proceed, Disclose, or Walk

**Decision Tree:**

```
Securities Counsel Engaged?
├── NO → STOP. Engage counsel first. Do not make this decision without legal advice.
│
└── YES → Counsel conducts full investigation
    │
    ├── Does federal restitution lien exist on the emeralds?
    │   ├── YES → WALK AWAY. Federal liens cannot be worked around.
    │   │         The DOJ has a superior claim on Kandi's assets until
    │   │         $831K+ restitution is satisfied.
    │   │
    │   └── NO (or restitution satisfied) → Continue analysis
    │
    ├── Is the 2019 default judgment legally valid and final?
    │   ├── NO (subject to challenge) → WALK AWAY. Ownership dispute =
    │   │                                 unresolvable title risk.
    │   │
    │   └── YES → Continue analysis
    │
    ├── Is White Oak Partners II LLC in good standing with the state?
    │   ├── NO (dissolved, revoked, or administratively inactive) → WALK AWAY
    │   │                                                           or require
    │   │                                                           reinstatement
    │   │                                                           before proceeding.
    │   │
    │   └── YES → Continue analysis
    │
    ├── Is Kandi currently under supervised release or probation?
    │   ├── YES → Does his supervision permit commercial transactions
    │   │         involving the emeralds?
    │   │   ├── NO → WALK AWAY until supervision concludes.
    │   │   └── YES (documented written permission from PO) → Continue
    │   │
    │   └── NO (supervision completed) → Continue analysis
    │
    └── Counsel's overall legal opinion:
        ├── "WALK AWAY" → Find different first asset (see 4.4)
        ├── "PROCEED WITH FULL DISCLOSURE" → See 5.3
        └── "NEEDS MORE INVESTIGATION" → Extend timeline by 1-2 weeks.
                                          Do NOT proceed without clear answer.
```

### 4.3 If Proceeding: Required Risk Disclosures in the PPM

If securities counsel determines the provenance is legally defensible and PleoChrome proceeds, the following MUST appear in the PPM Risk Factors section (drafted by counsel, not PleoChrome):

**Required Disclosure Topics:**

1. **Asset Holder Criminal History:** Full disclosure of Kandi's federal conviction, charges, sentence, and restitution obligation. Do not minimize or editorialize. State the facts.

2. **Ownership Chain Complexity:** Disclosure of the White Oak Partners II LLC history, including the disputed management changes, interstate movement of assets, Jeff Goodell's separate bank fraud conviction, and the 2019 default judgment. Disclosure that the default judgment was obtained when defendants failed to appear and that one defendant was incarcerated for a separate homicide conviction.

3. **Federal Restitution Obligations:** Disclosure of whether the $831K+ restitution has been satisfied or remains outstanding. If outstanding, disclosure that the U.S. government may have a lien or enforcement interest in Kandi's assets.

4. **Vault Bill and Custody Status:** Disclosure of the $62K unpaid vault bill and its resolution (or pending resolution). Disclosure of any risk that the vault may exercise a possessory lien on the stones.

5. **Supervision Status:** Disclosure of whether Kandi is currently under federal supervised release and any conditions that may affect his ability to engage in commercial transactions involving the emeralds.

6. **Third-Party Claims:** Disclosure that third parties (the former associates who moved the stones to Florida) may claim an interest in the emeralds, despite the 2019 default judgment.

7. **Provenance Risk:** General disclosure that the provenance and chain of custody for the asset is more complex than a typical private-sale acquisition, and that investors should consider this complexity as a material risk factor.

**Legal Opinion Required:** Securities counsel must provide a written legal opinion letter, retained in PleoChrome's files (not published in the PPM), opining that the provenance chain is sufficiently clear to support a securities offering. This opinion should address title risk, lien risk, and ownership dispute risk.

### 4.4 If Walking Away: How to Find Alternative First Assets

If counsel advises walking away from the Kandi barrel, PleoChrome must pivot to a different first asset. The pipeline reportedly contains $1.5B+ in GIA-certified assets with interest in tokenization.

**Alternative First Asset Criteria:**
- Clean ownership: single identified owner or entity with clear, undisputed title
- No criminal history or regulatory action in the ownership chain
- Existing GIA certification (saves 4-6 weeks)
- Value between $2,000,000 and $15,000,000 (large enough to be meaningful, small enough to raise within 6-12 months)
- Owner willing to pay vault and appraisal costs (not PleoChrome)
- Owner available and cooperative for KYC/EDD process
- Stones currently in a U.S.-based vault (simplifies logistics)
- No outstanding liens, encumbrances, or competing claims

**Timeline Impact of Walking Away:**
- Weeks 1-3 work (entity formation, counsel engagement, insurance) is NOT wasted -- it applies to any asset
- Asset-specific work (Kandi investigation, vault bill resolution) is sunk cost ($4,000-10,000)
- New asset intake process: 4-6 weeks (intake questionnaire, KYC, provenance review, GIA submission if needed, appraiser engagement)
- Total delay: approximately 6-8 weeks from the pivot decision to reaching the same point in the timeline with a new asset

**Action If Walking Away:**
1. Chris identifies the top 3 candidates from the pipeline immediately
2. Chris conducts preliminary screening: clean ownership, GIA certification status, value range, owner willingness
3. Shane engages counsel to review the top candidate's provenance before executing a new engagement agreement
4. Parallel-track: while screening new assets, continue all infrastructure work (entity, insurance, AML policy, Brickken sandbox, Chainlink application)

### 4.5 Federal Restitution Lien Investigation Process

This is the single most important factual question for the Kandi decision. If the $831,000+ federal restitution has not been satisfied, the United States has a lien on Kandi's assets under the Mandatory Victims Restitution Act (MVRA).

**Investigation Steps:**

1. **PACER search:** Outside counsel searches the federal court docket (Case No. CR13-5369-RBL, W.D. Wash.) for any recorded satisfaction of judgment, lien releases, or modifications to the restitution order. Cost: $0.10/page via PACER.

2. **U.S. Attorney's Office inquiry:** Counsel contacts the U.S. Attorney's Office for the Western District of Washington to determine the current status of restitution payments. The Financial Litigation Unit tracks restitution collection.

3. **Federal lien search:** Check the county recorder's office (Pierce County, WA, where Kandi and White Oak Partners II LLC are located) for any recorded federal liens. Also check Hillsborough County, FL (where the stones were allegedly moved).

4. **Probation/supervised release status:** Counsel can request information through the U.S. Probation Office for the Western District of Washington (with Kandi's consent) or determine supervision status from the PACER docket.

5. **White Oak Partners II LLC status:** Search Washington Secretary of State records (sos.wa.gov) for the current status of the entity, its registered agent, annual report compliance, and any administrative dissolution.

**Possible Outcomes:**
- Restitution fully paid and satisfied: Favorable. Proceed with standard provenance analysis.
- Restitution partially paid, payment plan active: Moderate risk. Counsel must determine if the DOJ could assert a claim against the emeralds. The MVRA lien attaches to "all property and rights to property" of the debtor.
- Restitution unpaid, in default: High risk. The DOJ may seek to seize assets to satisfy the restitution obligation. WALK AWAY.
- Unable to determine: Counsel must assume the worst and advise accordingly. Likely WALK AWAY until the status can be confirmed.

---

## 5. INSURANCE PROGRAM DESIGN

### 5.1 Directors & Officers (D&O) Insurance

**What It Covers:** Claims against PleoChrome's officers and directors for wrongful acts in their management capacity: breach of fiduciary duty, misrepresentation, errors in judgment, failure to comply with regulations, securities law violations (defense costs only -- intentional fraud is excluded), and investor lawsuits alleging management failures.

**Coverage Structure:**
- **Side A:** Covers individual directors/officers when the company cannot indemnify them (e.g., company is bankrupt). Pays defense costs and settlements directly to the individual.
- **Side B:** Reimburses the company when it indemnifies its directors/officers.
- **Side C (Entity Coverage):** Covers the company itself for securities claims. Essential for a securities issuer.

**Recommended Limits:** $1,000,000-2,000,000 aggregate limit for a startup. Increase to $5,000,000+ as AUM grows.

**Exclusions to Watch:**
- Prior acts / pending and prior litigation exclusion (make sure policy covers claims arising from acts before the policy inception, unless a specific claim was already pending)
- Regulatory investigation exclusion (some policies exclude SEC or FinCEN investigations -- reject these policies)
- Blockchain/crypto exclusion (some carriers add blanket crypto exclusions -- reject these policies)
- Insured vs. insured exclusion (prevents one officer from suing another and collecting under D&O -- standard but review scope)
- Bodily injury / property damage exclusion (standard; not relevant to PleoChrome's operations)
- Professional services exclusion (may create a gap -- see E&O below)

**Estimated Annual Premium:** $7,500-15,000 for $1M limit; $12,000-25,000 for $2M limit. Fintech/crypto companies face premiums 2-3x higher than traditional businesses due to perceived regulatory risk.

### 5.2 Errors & Omissions (E&O) / Professional Liability

**What It Covers:** Claims arising from professional services rendered by PleoChrome: negligent due diligence, errors in appraisal coordination, mistakes in token configuration, failure to properly screen investors, incorrect NAV calculations, inadequate disclosures, and failure to detect fraud in the provenance chain.

**Why PleoChrome Needs It:** PleoChrome is providing professional orchestration services (verification, appraisal coordination, compliance, custody arrangement, tokenization). If any of these services are performed negligently and investors suffer losses, E&O provides defense and indemnity.

**Recommended Limits:** $1,000,000-2,000,000 aggregate.

**Exclusions to Watch:**
- Known claims or circumstances exclusion
- Prior acts date (ensure it covers the full period of PleoChrome's operations)
- Intellectual property infringement exclusion (may be relevant if PleoChrome's technology infringes third-party IP)
- Exclusion for criminal, dishonest, or fraudulent acts (standard and appropriate)

**Estimated Annual Premium:** $5,000-15,000 for $1M limit.

### 5.3 Cyber Liability Insurance

**What It Covers:** Data breaches, ransomware attacks, unauthorized access to investor PII, business email compromise, regulatory fines for privacy violations, forensic investigation costs, notification costs, credit monitoring for affected individuals, and business interruption from cyber events.

**Why PleoChrome Needs It:** PleoChrome handles investor PII (names, SSNs, addresses, financial information), smart contract admin keys, and wallet addresses. A data breach could expose investor identities and enable targeted social engineering attacks against high-net-worth individuals.

**Coverage Components:**
- **First-party:** Direct costs to PleoChrome: forensic investigation, notification, credit monitoring, business interruption, data recovery, ransomware payments
- **Third-party:** Claims by affected individuals, regulatory fines (CCPA, state privacy laws), legal defense, settlements

**Recommended Limits:** $1,000,000 minimum. $2,000,000 preferred given the high-net-worth investor base.

**Exclusions to Watch:**
- War and state-sponsored cyber attack exclusion (Lloyd's market has expanded this since 2023 -- review carefully)
- Cryptocurrency and digital asset exclusion (some cyber policies now exclude all crypto-related claims -- reject these)
- Failure to maintain minimum security standards exclusion (ensure PleoChrome can meet the policy's security requirements: MFA, encryption, patch management, etc.)

**Estimated Annual Premium:** $3,000-10,000 for $1M limit. Fintech/crypto premium loading applies.

### 5.4 General Liability (GL)

**What It Covers:** Third-party bodily injury, property damage, personal injury (defamation, slander), and advertising injury. Standard business coverage.

**Why PleoChrome Needs It:** Required by most office leases and vendor contracts. Provides baseline protection for any in-person meetings, events, or office operations.

**Recommended Limits:** $1,000,000 per occurrence / $2,000,000 aggregate (standard).

**Estimated Annual Premium:** $1,000-3,000 for a small professional services firm.

### 5.5 Crime / Fidelity Bond

**What It Covers:** Losses caused by employee dishonesty: theft, forgery, fraud, computer fraud, and fund transfer fraud. For a team of 3 where each person has access to company accounts, investor funds (indirectly through SPV), and smart contract admin keys, this coverage is critical.

**Specific Scenarios for PleoChrome:**
- A team member misappropriates investor funds from the SPV account
- A team member uses admin keys to mint unauthorized tokens and sell them
- A team member transfers stones from the vault without authorization
- Social engineering attack where an impersonator tricks a team member into transferring funds

**Recommended Limits:** $500,000-1,000,000.

**Estimated Annual Premium:** $1,500-5,000 for $500K limit.

### 5.6 Inland Marine (Transit Insurance)

**What It Covers:** Physical loss or damage to gemstones while in transit between locations (vault to GIA lab, GIA lab to appraiser, appraiser to appraiser, appraiser to permanent vault). This is NOT vault storage insurance -- it is movement-specific.

**When Needed:**
- Every time stones are removed from the vault for any reason
- During the appraisal chain (3 sequential appraisers = at least 4 transit legs)
- During GIA or SSEF lab submission (additional transit legs)
- During vault-to-vault transfer (if moving from Olympic to Brink's/Malca-Amit)

**Coverage Details:**
- All-risk basis covering theft, damage, loss during transit
- Coverage while in temporary custody of the appraiser or lab
- Carrier must be rated A- or better by AM Best

**Recommended Limits:** Full appraised value per shipment.

**Estimated Annual Premium:** $2,000-15,000 per transit event for a $10M cargo. For a typical first-asset appraisal chain with 5-7 transit legs, budget $10,000-50,000 total transit insurance costs.

**Carriers:** Brink's and Malca-Amit both offer integrated transit insurance as part of their armored transport services. Obtain a certificate of insurance for each shipment and verify coverage limits match the cargo value.

### 5.7 Specie Insurance (Vault Storage)

**What It Covers:** Physical loss or damage to gemstones while in vault custody. This is the primary insurance for the underlying asset. See the Tokenized Gemstone Operational Research document (Section 2) for detailed analysis.

**Coverage Basis:** "All risks of physical loss or damage" with specific perils including theft, robbery, fire, flood, windstorm, earthquake, employee infidelity (insider theft), mysterious disappearance, and accidental damage.

**Standard Exclusions:** War, nuclear/chemical/biological/radiological attacks, cyber attacks, state-sponsored attacks, gradual deterioration, government confiscation, pre-existing damage.

**Coordination with Vault Partner:**
- The vault operator maintains its OWN liability insurance (covering negligence by vault employees)
- The SPV maintains its OWN specie insurance (covering the full value of stored stones)
- These are separate policies with separate beneficiaries
- Both must be in place before stones are placed in custody

**The Appreciation Gap Problem:**
- Stones insured at $10M. Reappraisal shows $12M. Insurance only covers $10M.
- Solution: annual reappraisal with mandatory insurance coverage adjustment within 30 days of new appraisal
- Operating agreement must mandate this process

**Recommended Limits:** Full current appraised value (not original purchase price or offering price).

**Estimated Annual Premium:** 1-2% of insured value = $100,000-200,000 for $10M in stones. This is the single largest ongoing cost for the SPV.

**Carriers Specializing in Specie:**
- **Lloyd's of London syndicates:** The global standard for specie insurance. Access through a Lloyd's broker.
- **AXA XL:** Specie insurance for high-value portable assets.
- **Chubb:** High-value article insurance (Masterpiece program).
- **Berkley Asset Protection (a W.R. Berkley company):** Specialized specie and fine art coverage.
- **CNA Hardy:** Lloyd's syndicate with specie expertise.

**Recommended Brokers:**
- **Lockton Companies:** Largest privately held insurance brokerage; strong specie practice
- **Marsh McLennan:** Global broker with specialty practices including specie
- **Aon:** Global broker with fine art and specie capabilities
- **DeWitt Stern (now part of Risk Strategies):** Specialized in fine art, jewelry, and collectibles insurance
- **Jewelers Mutual:** Specialist in jewelry and gemstone insurance; may be appropriate for smaller values or initial coverage

### 5.8 Total Insurance Program -- Annual Premium Estimates

| Coverage | Limit | Estimated Annual Premium |
|----------|-------|------------------------|
| D&O | $2,000,000 | $12,000-25,000 |
| E&O / Professional Liability | $1,000,000 | $5,000-15,000 |
| Cyber Liability | $1,000,000 | $3,000-10,000 |
| General Liability | $1M/$2M | $1,000-3,000 |
| Crime / Fidelity Bond | $500,000 | $1,500-5,000 |
| Key Person Insurance (3 policies) | $1,500,000 each | $1,500-4,500 |
| Inland Marine (transit, per-event) | Full value | $10,000-50,000 (total for appraisal chain) |
| Specie (vault storage, paid by SPV) | $10,000,000 | $100,000-200,000 |
| **TOTAL (PleoChrome entity)** | | **$24,000-62,500/yr** |
| **TOTAL (including SPV specie)** | | **$134,000-312,500/yr** |

**Note:** Specie and transit insurance premiums are SPV costs (paid from the offering reserve, reducing NAV). D&O, E&O, Cyber, GL, Crime, and Key Person are PleoChrome entity costs (paid from PleoChrome's operating budget, funded by management fees and success fees).

### 5.9 Recommended Insurance Brokers for Fintech/Crypto

| Broker | Specialty | Why Recommended |
|--------|-----------|----------------|
| **Founder Shield** | Fintech, crypto, and startup insurance. Pre-built packages for digital asset companies | Understands the crypto/fintech landscape; will not auto-exclude digital asset operations. Quick quoting process. |
| **Vouch Insurance** | Startup insurance platform with fintech expertise | Modern, technology-driven process. Good for D&O + E&O + Cyber bundles. May not handle specie. |
| **Embroker** | Technology and fintech insurance | Strong online platform. D&O, E&O, and Cyber available with crypto-aware underwriting. |
| **Lockton** | Full-service global broker with specialty specie practice | Best option for combining corporate lines (D&O, E&O) with specie insurance in a single broker relationship. |
| **DeWitt Stern / Risk Strategies** | Fine art, jewelry, and collectibles specialist | Best for specie and transit insurance specifically. Deep expertise in high-value physical asset coverage. |

**Recommended Approach:**
- Use **Founder Shield or Vouch** for D&O + E&O + Cyber + GL bundle (request quotes from both)
- Use **Lockton or DeWitt Stern** for specie and transit insurance (these require specialist underwriting)
- Request all quotes simultaneously in Week 1-2 to avoid delays in underwriting

---

## 6. REGULATORY MONITORING

### 6.1 How to Stay Current

**Federal Securities (SEC)**

| Source | What to Monitor | Frequency | URL |
|--------|----------------|-----------|-----|
| SEC.gov Newsroom | Press releases, speeches, staff statements, enforcement actions | Weekly | sec.gov/newsroom |
| SEC Rulemaking | Proposed and final rules affecting tokenized securities, transfer agents, Regulation D | Monthly | sec.gov/rules-regulations |
| SEC No-Action Letters | Staff guidance on novel structures (self-certification, tokenization) | Monthly | sec.gov/about/divisions-offices/division-corporation-finance/cf-noaction |
| SEC Division of Corporation Finance Statements | Staff positions on tokenized securities, digital assets | As published | sec.gov/divisions/corpfin |
| Cooley PubCo blog | Expert analysis of SEC developments | Weekly | cooley.com/news/insight |
| Morrison Foerster FinReg | Analysis of fintech/crypto regulatory developments | Weekly | mofo.com |
| Davis Polk Briefing: Governance | Corporate governance and securities updates | Monthly | davispolk.com |

**FinCEN / BSA / AML**

| Source | What to Monitor | Frequency | URL |
|--------|----------------|-----------|-----|
| FinCEN.gov Advisories | Advisories on money laundering typologies, sanctions evasion, new threats | As published | fincen.gov/resources/advisories |
| FinCEN Rulemakings | Proposed rules on MSB definitions, CDD requirements, beneficial ownership | Monthly | fincen.gov/resources/statutes-and-regulations |
| FATF Grey/Black Lists | Additions and removals of high-risk jurisdictions | Three times/year | fatf-gafi.org |
| OFAC Recent Actions | New sanctions designations, SDN list updates, enforcement actions | Weekly | home.treasury.gov/policy-issues/financial-sanctions/recent-actions |

**CFTC / Digital Commodities**

| Source | What to Monitor | Frequency | URL |
|--------|----------------|-----------|-----|
| CFTC.gov | Joint SEC-CFTC harmonization developments, digital commodity classifications | Monthly | cftc.gov |
| Project Crypto updates | Joint regulatory framework progress | As published | Through SEC/CFTC press releases |

**State Regulators**

| Source | What to Monitor | Frequency | URL |
|--------|----------------|-----------|-----|
| NASAA (North American Securities Administrators Association) | State regulatory coordination, enforcement trends, model rules | Monthly | nasaa.org |
| Individual state regulators (NY, MA, CA, TX, FL) | State-specific digital asset laws, enforcement actions | Quarterly per state | State regulator websites |

**Legislation**

| Source | What to Monitor | Frequency | URL |
|--------|----------------|-----------|-----|
| Congress.gov | CLARITY Act progress, stablecoin legislation, digital asset bills | Monthly | congress.gov |
| Arnold & Porter Regulatory Tracker | Comprehensive digital asset legislation tracking | Monthly | arnoldporter.com |

**Industry / Technical**

| Source | What to Monitor | Frequency | URL |
|--------|----------------|-----------|-----|
| ERC-3643 Association | Standard updates, ecosystem developments, regulatory presentations | Monthly | erc3643.org |
| Brickken blog | Platform updates, regulatory compliance features | Monthly | brickken.com/blog |
| Chainlink blog | Oracle developments, PoR updates, BUILD program news | Monthly | blog.chain.link |
| OpenZeppelin Security Advisories | Smart contract vulnerabilities, Solidity security updates | As published | blog.openzeppelin.com |
| Polygon blog | Network updates, fee changes, governance proposals | Monthly | polygon.technology/blog |

### 6.2 MiCA (EU) Preparation for International Expansion

PleoChrome's initial offering is U.S.-focused (Reg D 506(c), accredited investors only). However, if PleoChrome expands to international investors, the EU's Markets in Crypto-Assets Regulation (MiCA) is the most significant regulatory framework to address.

**MiCA Overview (effective June 30, 2024 for stablecoins; December 30, 2024 for CASPs):**
- Classifies crypto-assets into three categories: e-money tokens, asset-referenced tokens, and other crypto-assets
- Requires authorization for Crypto-Asset Service Providers (CASPs)
- PleoChrome's tokenized securities may fall OUTSIDE MiCA's scope (MiCA Article 2(4)(a) excludes financial instruments covered by MiFID II, which includes transferable securities)
- If the tokens are classified as MiFID II financial instruments (which they likely are, as they represent investment interests), PleoChrome would need to comply with existing MiFID II / Prospectus Regulation frameworks, not MiCA
- This means EU expansion would require a prospectus (or applicable exemption) and a MiFID II-licensed distributor

**Preparation Steps (Start at Month 12+):**
1. Engage EU-qualified securities counsel to determine classification under MiFID II vs. MiCA
2. Identify EU distribution partners with MiFID II licenses (Securitize has EU MiFID II license as of late 2025)
3. Evaluate Reg S exemption for non-U.S. offerings (companion to Reg D for international sales)
4. Consider UK FCA requirements separately (post-Brexit, UK has its own digital asset regulatory framework)
5. Budget $50,000-150,000 for EU regulatory setup and legal opinions

### 6.3 Compliance Calendar

| Date/Frequency | Action | Owner | Reference |
|---------------|--------|-------|-----------|
| **Within 15 days of first sale** | File Form D with SEC via EDGAR | Outside counsel | SEC Rule 503 |
| **Within 15 days of first sale in each state** | File blue sky notice in that state | Outside counsel | State securities laws |
| **Before first sale in New York** | File NY blue sky notice (pre-filing required) | Outside counsel | NY General Business Law Art. 23-A |
| **Quarterly** | Re-screen all investors against OFAC, EU, UN sanctions lists | David + CCO | AML/KYC Policy |
| **Quarterly** | Publish NAV update to investors | David | Operating Agreement |
| **Quarterly** | Review and update compliance risk assessment | CCO | BSA/AML requirement |
| **Annually (on Form D anniversary)** | File Form D annual amendment if offering continues | Outside counsel | SEC Rule 503 |
| **Annually** | Renew blue sky filings in all applicable states | Outside counsel | State securities laws |
| **Annually** | Independent BSA/AML compliance test | CCO + external auditor | BSA requirement |
| **Annually** | Conduct compliance training for all team members | CCO | AML/KYC Policy |
| **Annually** | Reappraise gemstones and adjust insurance coverage | David + appraiser | Operating Agreement |
| **Annually** | Review and update AML/KYC Policy | CCO | BSA best practices |
| **Annually** | Renew all insurance policies (D&O, E&O, Cyber, GL, Specie) | Shane | Insurance program |
| **Annually** | Wyoming LLC annual report (anniversary month) | David | Wyoming statute |
| **Annually** | K-1 tax document preparation and distribution | CPA/accountant | IRS requirements |
| **Annually** | Review Operating Agreement for needed amendments | Outside counsel | Corporate governance |
| **Annually** | Review all counterparty contracts for renewal/renegotiation | Shane | Contract management |
| **Annually** | Review key person insurance adequacy | Shane | Insurance program |
| **As needed** | File SAR within 30 days of detecting suspicious activity | CCO | BSA 31 CFR 1022.320 |
| **As needed** | Update compliance modules on smart contracts for regulatory changes | David | ERC-3643 operations |
| **As needed** | Bad actor checks when new covered persons are added | CCO | Rule 506(d) |

---

## 7. INCIDENT RESPONSE PLAN

### 7.1 SEC Inquiry or Examination

**Detection:** Receipt of a letter, email, or phone call from SEC staff requesting documents, information, or scheduling an examination.

**Response Protocol:**

| Step | Action | Timeline | Owner |
|------|--------|----------|-------|
| 1 | Forward SEC communication immediately to outside counsel WITHOUT responding | Within 1 hour of receipt | Whoever receives it -> Shane -> counsel |
| 2 | Counsel reviews the inquiry to determine scope and nature (informal inquiry, formal investigation, examination) | Within 24 hours | Outside counsel |
| 3 | Implement document preservation hold: no destruction or modification of ANY documents, emails, records, or data | Immediately upon receipt | All team members |
| 4 | Counsel prepares response strategy and communicates to team | Within 48 hours | Outside counsel |
| 5 | Respond to SEC through counsel only -- NO direct communication with SEC staff without counsel present | Per counsel guidance | Outside counsel |
| 6 | Notify D&O insurance carrier of potential claim | Within policy-specified timeframe (typically 30 days) | Shane |
| 7 | Notify BD partner (if applicable) -- they may have independent notification obligations | Within 24 hours | Shane |
| 8 | Do NOT notify investors unless counsel advises it is necessary or required | Per counsel guidance | Shane + counsel |

**Critical Rules:**
- NEVER respond to SEC inquiries without outside counsel
- NEVER destroy documents after receiving an inquiry (spoliation of evidence is a separate federal offense)
- NEVER mislead SEC staff (providing false information to the SEC is a federal crime under 18 USC 1001)
- NEVER discuss the inquiry with investors, partners, or media without counsel approval
- Cooperate fully and promptly -- the SEC views non-cooperation extremely negatively

### 7.2 Investor Complaint

**Detection:** Receipt of a formal or informal complaint from a current or prospective investor.

**Response Protocol:**

| Step | Action | Timeline | Owner |
|------|--------|----------|-------|
| 1 | Log the complaint in the Investor Complaint Register: date received, complainant name, nature of complaint, desired resolution | Within 24 hours | CCO |
| 2 | Acknowledge receipt to the investor | Within 2 business days | CCO |
| 3 | Investigate the complaint: review relevant records, speak with involved team members, assess merit | Within 10 business days | CCO |
| 4 | If complaint has merit: develop resolution plan with input from counsel | Within 15 business days | CCO + counsel |
| 5 | Communicate resolution to investor | Within 20 business days | CCO |
| 6 | If complaint alleges fraud, securities law violation, or material misrepresentation: escalate immediately to counsel | Immediately | CCO -> counsel |
| 7 | Document the investigation, findings, resolution, and any corrective actions taken | Concurrent with investigation | CCO |
| 8 | Retain complaint records for 5 years | Ongoing | CCO |

**Template Acknowledgment:**

> Dear [Investor Name],
>
> Thank you for bringing your concern to our attention. We have received your [letter/email] dated [date] and have logged it as Complaint No. [number].
>
> Your complaint will be reviewed by our Compliance Officer. We will respond with our findings and any proposed resolution within 20 business days. If you have additional information to provide, please send it to [compliance@pleochrome.com].
>
> We take all investor concerns seriously and are committed to addressing them promptly and fairly.
>
> Sincerely,
> [CCO Name]
> Compliance Officer, PleoChrome Holdings LLC

### 7.3 Data Breach

**Detection:** Unauthorized access to investor PII, admin credentials, smart contract keys, or other sensitive data.

**Response Protocol:**

| Step | Action | Timeline | Owner |
|------|--------|----------|-------|
| 1 | Contain the breach: revoke compromised credentials, rotate API keys, change passwords, isolate affected systems | Immediately | David |
| 2 | If smart contract admin keys are compromised: execute pause() on all token contracts to halt transfers | Immediately | David + Shane (2-of-3 multisig) |
| 3 | Assess scope: what data was accessed? How many individuals affected? What is the nature of the data? | Within 24 hours | David |
| 4 | Engage forensic investigation firm (if breach is significant) | Within 48 hours | Shane |
| 5 | Notify outside counsel | Within 24 hours | Shane |
| 6 | Notify cyber insurance carrier | Within policy-specified timeframe | Shane |
| 7 | Determine notification obligations: most states require notification to affected individuals within 30-60 days; California requires notification within 72 hours of discovery for certain breaches; SEC may require notification for material cybersecurity incidents (Rule 10 of Regulation S-P) | Per counsel guidance | Counsel + CCO |
| 8 | Prepare and send notification letters to affected individuals | Per applicable state deadlines | Counsel + CCO |
| 9 | Offer credit monitoring services to affected individuals (if SSNs or financial data exposed) | With notification | Shane |
| 10 | Conduct root cause analysis and implement corrective measures | Within 30 days | David |
| 11 | File incident report with relevant regulators if required | Per counsel guidance | Counsel |

### 7.4 Smart Contract Exploit

**Detection:** Unauthorized token minting, bypass of compliance rules, unauthorized transfers, or abnormal on-chain activity.

**Response Protocol:**

| Step | Action | Timeline | Owner |
|------|--------|----------|-------|
| 1 | Execute pause() on the affected token contract to halt ALL transfers | Immediately | David + Shane (2-of-3 multisig) |
| 2 | Identify the nature of the exploit: unauthorized minting? compliance bypass? reentrancy? | Within 1 hour | David |
| 3 | Assess damage: how many tokens affected? What is the financial impact? Are any investor wallets compromised? | Within 4 hours | David |
| 4 | If unauthorized tokens were minted: identify the receiving wallets and execute setAddressFrozen() to freeze them | Within 1 hour of identification | David |
| 5 | Notify Brickken (if exploit involves their infrastructure) | Within 4 hours | David |
| 6 | Notify Chainlink (if exploit involves oracle manipulation) | Within 4 hours | David |
| 7 | Engage smart contract security firm for emergency audit | Within 24 hours | David + Shane |
| 8 | Notify outside counsel | Within 24 hours | Shane |
| 9 | Notify insurance carriers (cyber and D&O) | Within 48 hours | Shane |
| 10 | Prepare investor communication | Within 48 hours | Shane + CCO |
| 11 | Implement fix on testnet, verify, and deploy to mainnet | Only after independent verification | David |
| 12 | Unpause contracts only when the fix is deployed and verified | After security firm approval | David + Shane |

**Investor Communication Template (Smart Contract Incident):**

> Dear PleoChrome Investors,
>
> We are writing to inform you of a security incident affecting the [token name] smart contract on the Polygon network. On [date], we detected [brief factual description of what happened].
>
> Immediate Actions Taken:
> - All token transfers have been temporarily paused as a precautionary measure
> - The affected wallets have been frozen
> - We have engaged [security firm] to conduct an emergency audit
> - Our outside counsel has been notified
>
> Impact Assessment:
> [Description of impact -- or "We are currently assessing the full impact and will provide an update within [timeframe]"]
>
> Your tokens remain recorded on the blockchain and your ownership rights are unaffected. The pause is a protective measure enabled by the ERC-3643 standard specifically for situations like this.
>
> We will provide an update within [48 hours / one week] with the results of the security audit and our remediation plan.
>
> If you have questions, please contact [compliance@pleochrome.com].
>
> Sincerely,
> Shane Pierson
> CEO, PleoChrome Holdings LLC

### 7.5 Vault Incident (Theft, Damage, or Access Issue)

**Response Protocol:**

| Step | Action | Timeline | Owner |
|------|--------|----------|-------|
| 1 | Contact vault operator to confirm the nature and scope of the incident | Immediately upon notification | David |
| 2 | Request written incident report from vault operator | Within 24 hours | David |
| 3 | File specie insurance claim | Within policy-specified timeframe (typically 48-72 hours) | Shane |
| 4 | Notify outside counsel | Within 24 hours | Shane |
| 5 | If total loss: update Chainlink PoR feed to reflect change in custody status | Within 24 hours | David |
| 6 | If partial damage: arrange for independent damage assessment by a GIA-credentialed appraiser | Within 1 week | David |
| 7 | Notify investors of the incident and insurance claim status | Within 5 business days | Shane + CCO |
| 8 | Work with insurer through claims process (expect 3-12 months for high-value specie claims) | Ongoing | Shane |
| 9 | If insurer pays claim: distribute proceeds per Operating Agreement (reinvest, distribute to investors, or hybrid) | Per Operating Agreement | Shane |

### 7.6 Sanctions Hit on an Investor

**Detection:** A current investor or token holder appears on a sanctions list update (OFAC SDN, EU, or UN).

**Response Protocol:**

| Step | Action | Timeline | Owner |
|------|--------|----------|-------|
| 1 | Freeze the investor's wallet immediately using setAddressFrozen() | Immediately upon confirmed match | David + CCO |
| 2 | Block any pending distributions to the investor | Immediately | David |
| 3 | Confirm the match is a true positive (not a false positive due to name similarity) | Within 24 hours | CCO |
| 4 | If true positive: file a Blocked Transactions Report with OFAC within 10 business days | Within 10 business days | CCO |
| 5 | Notify outside counsel | Within 24 hours | Shane |
| 6 | Do NOT notify the sanctioned investor that they have been blocked (depending on the sanctions program, notification may be prohibited or restricted) | Per counsel guidance | Counsel |
| 7 | Retain all frozen tokens and blocked funds; they cannot be released without OFAC authorization (specific license) | Until OFAC guidance received | CCO |
| 8 | Apply for a specific license from OFAC if there is a legitimate basis for releasing the assets | Per counsel guidance | Counsel |
| 9 | File SAR if the sanctions hit suggests the investor intentionally concealed their status | Within 30 days | CCO |

### 7.7 Media Inquiry About Business or Team Backgrounds

**Detection:** A journalist, blogger, or social media account contacts PleoChrome or publishes content about Kandi's criminal background, or other business concerns.

**Response Protocol:**

| Step | Action | Timeline | Owner |
|------|--------|----------|-------|
| 1 | All media inquiries are routed to Shane immediately. No one else responds on the record. | Immediately | All team members -> Shane |
| 2 | Assess the nature of the inquiry: factual question, hostile investigation, neutral profile? | Within 2 hours | Shane |
| 3 | If the inquiry involves legal or regulatory matters: consult with outside counsel before responding | Before any response | Shane + counsel |
| 4 | Prepare a written response using approved language (see proactive disclosure framework in Section 4) | Within 24 hours | Shane |
| 5 | Respond factually and without defensiveness. Do not volunteer information beyond what is asked. | Per Shane's judgment | Shane |
| 6 | If the inquiry is hostile or suggests an upcoming negative story: engage a crisis communications consultant (budget $5,000-15,000 for initial engagement) | Within 24 hours of identifying hostile intent | Shane |
| 7 | Monitor subsequent coverage and correct factual errors through direct outreach to the journalist or publication | Ongoing | Shane |

**Prepared Statement (Kandi Provenance -- Only If PleoChrome Proceeds with Kandi):**

> PleoChrome conducts rigorous due diligence on all assets in its pipeline, including comprehensive background checks, legal title verification, and provenance chain analysis. All material information regarding the provenance of our assets is fully disclosed to investors in our Private Placement Memorandum, which is reviewed by independent securities counsel. We do not comment on the specifics of individual asset holder backgrounds beyond what is disclosed in our offering documents.

### 7.8 Escalation Procedures

| Severity | Definition | Escalation Path | Response Time |
|----------|-----------|----------------|---------------|
| **Critical** | SEC enforcement action, criminal investigation, smart contract exploit with financial loss, sanctions violation, data breach affecting investor PII | Immediately to Shane -> Immediately to outside counsel -> Insurance carriers within 24 hours | Within 1 hour |
| **High** | Investor complaint alleging fraud, media inquiry about business operations, vault security incident, counterparty failure, sanctions alert (pending confirmation) | Within 4 hours to CCO -> Within 24 hours to Shane -> Within 48 hours to counsel (if warranted) | Within 4 hours |
| **Medium** | Operational error (wrong wallet, missed filing deadline), minor investor complaint, partner contract issue, technology outage (non-security) | Within 24 hours to CCO -> Within 48 hours to Shane | Within 24 hours |
| **Low** | Routine compliance question, process improvement suggestion, minor system issue | At next weekly team meeting | Within 1 week |

### 7.9 Legal Notification Requirements Summary

| Event | Who to Notify | Deadline |
|-------|--------------|----------|
| SEC inquiry/subpoena | Outside counsel | Immediately |
| Data breach (investor PII) | State AG (varies: CA within 72 hours, most states 30-60 days), affected individuals, HHS (if health data) | Per state law |
| Sanctions violation (blocked transaction) | OFAC (Blocked Transactions Report within 10 business days) | 10 business days |
| Suspicious activity | FinCEN (SAR within 30 days; 60 days if no suspect identified) | 30 days |
| D&O/E&O/Cyber claim | Insurance carrier | Per policy (typically 30 days; "as soon as practicable" for some policies) |
| Smart contract exploit | Brickken, Chainlink (affected partners); investors (per Operating Agreement) | 24-48 hours |
| Vault incident | Insurance carrier; investors (per Operating Agreement) | Per policy / 5 business days |
| Change in offering terms | SEC (Form D amendment); state regulators (blue sky amendment); investors | "As soon as practicable" |
| Litigation filed against PleoChrome | Insurance carrier; investors (if material) | Per policy / promptly |

---

## 8. SOC 2 ROADMAP

### 8.1 Why SOC 2 Matters for PleoChrome

SOC 2 (System and Organization Controls 2) is an audit framework developed by the AICPA that evaluates a service organization's controls relevant to security, availability, processing integrity, confidentiality, and privacy. For PleoChrome:

- **Institutional partners** (Brink's, Malca-Amit, Chainlink, broker-dealers) will ask for a SOC 2 report before entering into material partnerships
- **Accredited investors** in the $200K+ range expect institutional-grade operational controls
- **Insurance carriers** may reduce premiums for organizations with SOC 2 certification
- **Regulatory credibility** -- demonstrating an audited control environment strengthens PleoChrome's position if the SEC or FinCEN ever examines the business
- **Competitive differentiation** -- most early-stage tokenization platforms do not have SOC 2; achieving it positions PleoChrome as institutionally serious

### 8.2 SOC 2 Trust Service Criteria (TSC)

PleoChrome should pursue SOC 2 Type II covering the following Trust Service Criteria:

| TSC | Relevance to PleoChrome | Priority |
|-----|------------------------|----------|
| **Security** (Common Criteria -- required for all SOC 2 reports) | Smart contract admin key management, investor data protection, wallet security, access controls, system monitoring | REQUIRED |
| **Availability** | Platform uptime (PleoChrome website, investor portal, oracle feeds), system redundancy | HIGH |
| **Processing Integrity** | Accurate token minting, correct NAV calculations, reliable sanctions screening, accurate investor verification | HIGH |
| **Confidentiality** | Investor PII protection, offering document confidentiality, trade secrets | HIGH |
| **Privacy** | Collection, use, retention, and disposal of investor personal information | MEDIUM (relevant but may defer to SOC 2 + CCPA compliance) |

### 8.3 Gap Analysis Approach

**Phase 1: Readiness Assessment (Month 6-8)**

Engage a SOC 2 readiness assessor (different firm from the eventual auditor) to:

1. Document all current controls (formal and informal)
2. Map controls against SOC 2 Trust Service Criteria
3. Identify gaps between current state and SOC 2 requirements
4. Prioritize remediation items by criticality and effort
5. Produce a written readiness report with a remediation roadmap

**Cost:** $5,000-15,000 for a readiness assessment from a mid-tier firm.

**Common Gaps Expected for a 3-Person Startup:**
- No formal access control policy (who has access to what systems and why)
- No change management process for smart contract updates
- No formal incident response plan (this document provides one -- implement it)
- No log monitoring or alerting system
- No formal vendor management program
- No formal risk assessment process (this document provides one -- implement it)
- No data classification policy
- No employee security awareness training program
- No formal backup and recovery procedures for critical data

### 8.4 Critical Controls to Implement First

Before engaging a SOC 2 auditor, PleoChrome must implement these foundational controls:

**Tier 1: Implement Immediately (Month 1-3)**

| Control | Implementation | Cost |
|---------|---------------|------|
| Multi-factor authentication (MFA) on all accounts | Enable MFA on Google Workspace, GitHub, Brickken, Vercel, all cloud services | $0 |
| Password policy | Minimum 16 characters, unique per service, password manager required (1Password Teams or Bitwarden) | $0-100/yr |
| Smart contract key management | Hardware wallets for all admin keys; 2-of-3 multisig for critical operations; documented key recovery procedures | $200-600 (hardware wallets) |
| Access control inventory | Document who has access to every system, what level of access, and why | $0 |
| Incident response plan | This document (Section 8) -- formalize and test | $0 |
| Risk assessment | This document (Section 3) -- formalize and update quarterly | $0 |
| AML/KYC policy | This document (Section 1) -- formalize as standalone policy document | $0-3,000 |

**Tier 2: Implement Before SOC 2 Type I (Month 3-9)**

| Control | Implementation | Cost |
|---------|---------------|------|
| Endpoint security | Endpoint detection and response (EDR) on all team devices: CrowdStrike Falcon Go ($8/endpoint/month) or SentinelOne | $300-600/yr |
| Vulnerability scanning | Automated vulnerability scanning of all internet-facing systems: Qualys, Tenable, or free tools (OWASP ZAP for web apps) | $0-5,000/yr |
| Log management | Centralized logging for all critical systems with 90-day retention: Datadog, Splunk Cloud, or AWS CloudWatch | $0-3,000/yr |
| Change management | Documented approval process for all smart contract updates, system configuration changes, and code deployments | $0 |
| Vendor management | Documented assessment of all critical vendors (Brickken, Chainlink, vault, BD, insurance carriers) for security and business continuity | $0 |
| Data classification policy | Classify all data as Public, Internal, Confidential, or Restricted; define handling requirements for each | $0 |
| Business continuity / disaster recovery plan | Documented plan for continuing operations if key systems or team members are unavailable | $0 |
| Security awareness training | Annual training for all team members on phishing, social engineering, data handling | $300-1,000/yr |
| Backup and recovery | Automated backup of all critical off-chain data (investor records, compliance files, corporate documents) with tested restoration procedures | $0-500/yr |
| Encryption | Encryption at rest for all stored data (investor PII, financial records); encryption in transit (TLS 1.2+ for all communications) | $0 (standard in modern cloud platforms) |

### 8.5 Timeline to SOC 2 Type I

**SOC 2 Type I** evaluates the design of controls at a specific point in time. It answers: "Are the right controls in place?"

| Phase | Duration | Activities | Cost |
|-------|----------|-----------|------|
| Readiness assessment | Month 6-8 | Engage assessor; receive gap analysis; begin remediation | $5,000-15,000 |
| Remediation | Month 8-12 | Implement all Tier 2 controls; document policies and procedures; build evidence of control operation | $5,000-15,000 (tools + implementation) |
| Auditor engagement | Month 12 | Select SOC 2 auditor (must be different from readiness assessor); sign engagement letter | $15,000-35,000 (audit fee) |
| Type I audit | Month 13-15 | Auditor examines control design; interviews team; reviews documentation | Included in audit fee |
| Report issuance | Month 15 | Receive SOC 2 Type I report | -- |
| **Total to Type I** | **~15 months from start** | | **$25,000-65,000** |

### 8.6 Timeline to SOC 2 Type II

**SOC 2 Type II** evaluates the operating effectiveness of controls over a period of time (minimum 6 months, typically 12 months). It answers: "Are the controls working as designed, consistently?"

| Phase | Duration | Activities | Cost |
|-------|----------|-----------|------|
| Type I achieved | Month 15 | Controls designed and documented | -- |
| Observation period | Month 15-27 | Controls operate for 6-12 months; evidence collected continuously | Ongoing operational costs |
| Type II audit | Month 27-30 | Auditor examines 6-12 months of control operation evidence | $20,000-50,000 (audit fee) |
| Report issuance | Month 30 | Receive SOC 2 Type II report | -- |
| **Total to Type II** | **~30 months from start (18 months from Type I)** | | **$45,000-115,000 cumulative** |

### 8.7 SOC 2 Cost Breakdown

| Item | Cost | When |
|------|------|------|
| Readiness assessment | $5,000-15,000 | Month 6 |
| Compliance platform (Vanta, Drata, or Secureframe) | $6,000-18,000/yr | Month 8+ |
| Security tools (EDR, vulnerability scanning, log management) | $3,000-10,000/yr | Month 8+ |
| Control implementation labor (internal time or consultant) | $5,000-15,000 | Month 8-12 |
| SOC 2 Type I audit | $15,000-35,000 | Month 12 |
| SOC 2 Type II audit | $20,000-50,000 | Month 27 |
| Annual SOC 2 Type II renewal | $15,000-40,000/yr | Annually after Type II |
| **Total Year 1 (through Type I)** | **$34,000-93,000** | |
| **Total Year 2-3 (through Type II)** | **$41,000-108,000 additional** | |

### 8.8 Compliance Automation Platforms

These platforms automate evidence collection, policy management, and auditor workflows, reducing the time and effort required for SOC 2:

| Platform | Annual Cost | Key Features | Best For |
|----------|------------|-------------|---------|
| **Vanta** | $6,000-15,000/yr (Startup tier) | Automated evidence collection, 200+ integrations, continuous monitoring, auditor network, AI-powered questionnaire responses | Startups seeking fast SOC 2 with broad integrations |
| **Drata** | $7,500-18,000/yr | Automated control monitoring, trust center, compliance-as-code, extensive cloud integrations | Companies with complex cloud infrastructure |
| **Secureframe** | $6,000-12,000/yr | Automated compliance, policy templates, employee onboarding automation, vendor management | Cost-conscious startups wanting turnkey compliance |
| **Laika** | $8,000-15,000/yr | Compliance workflow management, questionnaire management, evidence repository | Companies managing multiple compliance frameworks |

**Recommendation:** **Vanta** is the most common choice for early-stage fintech companies. It integrates with Google Workspace (PleoChrome's email/docs platform), GitHub (code repository), Vercel (hosting), and most cloud services. Start with Vanta in Month 8 to begin automated evidence collection well before the Type I audit.

### 8.9 SOC 2 Auditor Selection

**Who Can Audit:** SOC 2 audits must be performed by a licensed CPA firm. The firm must be independent from PleoChrome (cannot be the same firm that provides tax or bookkeeping services).

**Recommended SOC 2 Auditors for Startups/Fintech:**

| Firm | Specialty | Price Range | Notes |
|------|-----------|-------------|-------|
| Prescient Assurance | Startups and tech companies | $15,000-30,000 | Popular with Vanta users; fast turnaround |
| A-LIGN | Technology and fintech | $20,000-40,000 | Experienced with crypto/fintech companies |
| Johanson Group | Startups | $12,000-25,000 | Cost-effective option for first-time audits |
| Schellman | Technology and regulated industries | $25,000-50,000 | Higher-end; strong reputation with institutional partners |
| Moss Adams | Technology and fintech | $25,000-45,000 | Regional firm with strong tech practice |
| Armanino | Blockchain and digital assets | $25,000-50,000 | Specific blockchain/crypto audit experience |

**Selection Criteria:**
- Experience auditing fintech or digital asset companies (ask for references)
- Familiarity with blockchain technology and smart contract controls
- Reasonable pricing for a 3-person startup with limited scope
- Responsive communication and clear timeline commitments
- NOT the same firm providing any other services to PleoChrome

---

## APPENDIX A: REGULATORY AGENCY CONTACT INFORMATION

| Agency | Purpose | Contact |
|--------|---------|---------|
| SEC Division of Corporation Finance | Form D questions, Reg D guidance | sec.gov, (202) 551-3460 |
| SEC Office of Investor Education and Advocacy | Investor complaints received by SEC | sec.gov/oiea |
| SEC EDGAR | Form D filing system | sec.gov/submit-filings |
| FinCEN | MSB registration, SAR filing, BSA questions | fincen.gov, 1-800-767-2825 |
| OFAC | Sanctions questions, license applications | home.treasury.gov/policy-issues/financial-sanctions, 1-800-540-6322 |
| FINRA | BD regulatory questions, Form 5123 filing | finra.org, (301) 590-6500 |
| NASAA / EFD | Blue sky filings for most states | nasaa.org, efd.nasaa.org |
| Wyoming Secretary of State | LLC filings, annual reports | wyobiz.wyo.gov |
| IRS | EIN, tax questions | irs.gov |
| FBI IC3 | Cyber crime reporting | ic3.fbi.gov |

---

## APPENDIX B: DOCUMENT VERSION HISTORY

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | March 19, 2026 | PleoChrome Strategy Team | Initial release |

---

**END OF DOCUMENT**

*This document should be reviewed and updated at least annually, or whenever there is a material change to PleoChrome's business model, regulatory environment, team composition, or risk profile.*

*IMPORTANT: This document is for internal planning purposes only and does not constitute legal advice. All compliance policies, procedures, and disclosures must be reviewed and approved by PleoChrome's independent securities counsel before implementation.*

*Last updated: March 19, 2026*
