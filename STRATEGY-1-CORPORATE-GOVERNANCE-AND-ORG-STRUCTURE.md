# PLEOCHROME STRATEGY DOCUMENT 1: CORPORATE GOVERNANCE & ORGANIZATIONAL STRUCTURE

**Document Version:** 1.1
**Date:** March 19, 2026
**Last Updated:** 2026-03-27

### Recent Changes (2026-03-27)
- Updated tagline references to "Value from Every Angle" per Decision #001
- Added three-path value creation scope (Fractional Securities, Tokenization, Debt Instruments) per Decision #002
- Updated partner references to reflect platform-agnostic approach (Brickken and Zoniqx under evaluation) per Decisions #003, #004
- Confirmed Shane as interim CCO per existing audit findings
**Classification:** Confidential -- Founding Team Only
**Prepared for:** Shane Pierson, David Whiting, Chris Ramsey

---

## TABLE OF CONTENTS

1. [Executive Team Profiles & Assessment](#1-executive-team-profiles--assessment)
2. [Organizational Chart & Reporting Structure](#2-organizational-chart--reporting-structure)
3. [Role & Responsibility Matrix (RACI)](#3-role--responsibility-matrix-raci)
4. [Shane Pierson -- CEO Responsibilities](#4-shane-pierson--ceo-responsibilities)
5. [David Whiting -- CTO & COO Responsibilities](#5-david-whiting--cto--coo-responsibilities)
6. [Chris Ramsey -- CRO Responsibilities](#6-chris-ramsey--cro-responsibilities)
7. [Operating Agreement Key Terms](#7-operating-agreement-key-terms)
8. [Compensation Framework](#8-compensation-framework)
9. [Weekly/Monthly Operating Cadence](#9-weeklymonthly-operating-cadence)

---

## 1. EXECUTIVE TEAM PROFILES & ASSESSMENT

### Shane Pierson -- Chief Executive Officer (Founder)

| Dimension | Detail |
|-----------|--------|
| **Age** | 42 |
| **Education** | BS Business & Technology, Stevens Institute of Technology |
| **Career** | 20 years in SBA lending at FDIC-insured banks |
| **Current Role** | SBA National Sales Manager, CB&T / Phoenix Lender Services (#25 SBA lender nationally) |
| **Publications** | 3 articles in Scotsman Guide (premier mortgage/lending trade publication) |
| **Ventures** | Co-founded Lords of Lending podcast/platform (lordsoflending.com) |
| **Location** | Charlotte, NC |
| **Background Check** | CLEAN -- zero adverse findings |
| **Core Strengths** | Sales, business development, institutional relationship building, fintech product vision, content creation, regulatory-adjacent experience (SBA lending operates under heavy federal oversight) |
| **Development Areas** | No direct securities industry experience; no blockchain/Web3 technical background; first time as CEO of a securities-adjacent company |

**Strategic Value to PleoChrome:** Shane brings two rare assets. First, 20 years of selling complex financial products to institutional buyers -- the exact muscle memory needed to raise capital from accredited investors. Second, a publisher's instinct for content and positioning (Scotsman Guide articles, podcast) that will be critical for the 506(c) general solicitation strategy. His SBA lending career means he understands federal regulatory scrutiny, compliance documentation, and the importance of never cutting corners on paperwork. He knows what bank examiners look for because he has lived under examination for two decades.

---

### David Whiting -- Chief Technology Officer & Chief Operating Officer

| Dimension | Detail |
|-----------|--------|
| **Education** | MS Statistics, Texas A&M University; BS Statistics, Utah Valley University |
| **Career** | 7+ years across data engineering and analytics |
| **Key Employers** | SONAR/FreightWaves (Inc. 5000 #85), SchoolsFirst Federal Credit Union ($34B AUM), Discover Financial Services |
| **Publications** | Co-author on peer-reviewed research (statistical methods) |
| **Technical Skills** | Python, SQL, data pipelines, statistical modeling, Dash applications, data infrastructure design |
| **Location** | Naples, FL |
| **Background Check** | CLEAN |
| **Character Note** | Eagle Scout (speaks to personal discipline and integrity) |
| **Core Strengths** | Data engineering, statistical rigor, pipeline architecture, financial institution experience (SchoolsFirst, Discover), research methodology |
| **Development Areas** | Introductory blockchain certification only; needs significant ramp-up on Web3, Polygon, ERC-3643, Solidity, smart contract architecture, Chainlink oracle development |

**Strategic Value to PleoChrome:** David is the team's builder. His data engineering background at freight analytics (SONAR) and financial services (Discover, SchoolsFirst) means he understands how to design systems that move data reliably, audit-traceably, and at scale. The Chainlink Proof of Reserve integration is fundamentally a data pipeline problem: vault inventory data flows through an external adapter to oracle nodes to an on-chain aggregator. David's statistical background also makes him the right person to design the variance analysis framework for the three-appraisal model. His published research demonstrates the rigor that institutional investors and regulators will want to see in PleoChrome's reporting.

**Critical Ramp-Up Required:** David's blockchain certification is introductory only. Before mainnet deployment, he must develop working proficiency in:
- Polygon network architecture and gas mechanics
- ERC-3643 (T-REX) token standard -- identity registry, compliance modules, claim topics
- Solidity fundamentals (enough to read and verify tokenization platform contracts, not necessarily write from scratch)
- Chainlink external adapter development (Node.js or Python web service architecture)
- Wallet management, key custody, and multisig operations
- Smart contract security patterns and common vulnerabilities

**Recommended Learning Path (6-8 weeks, parallel with business buildout):**
1. Weeks 1-2: Polygon Academy + ERC-3643 whitepaper + tokenization platform documentation (Brickken and/or Zoniqx)
2. Weeks 3-4: Chainlink developer documentation + external adapter tutorials
3. Weeks 5-6: Deploy test ERC-20 on Polygon Mumbai, then ERC-3643 via tokenization platform sandbox (Brickken or Zoniqx -- see Decision #003)
4. Weeks 7-8: Build a minimal Chainlink external adapter connecting to a mock vault API
5. Ongoing: Audit report review (read 3-5 published ERC-3643 audit reports to understand common findings)

---

### Chris Ramsey -- Chief Revenue Officer

| Dimension | Detail |
|-----------|--------|
| **Age** | 63 |
| **Education** | BA, Villanova University; JD, Widener University School of Law |
| **Career** | 33 years of legal experience (Washington state) |
| **Prior Venture** | Prior gemstone tokenization venture -- reached proof-of-concept stage on one asset before partnership dissolved |
| **Location** | Naples, FL / Seattle, WA |
| **Background Check** | CLEAN -- no criminal record, no civil fraud findings, no financial judgments |
| **Core Strengths** | Deep network of gemstone asset holders, prior experience with gemstone tokenization mechanics, legal analytical framework, understanding of the full pipeline from asset intake to tokenization |
| **Development Areas** | Age 63 limits long-term runway; no direct securities sales experience; technology skills unknown |

**Strategic Value to PleoChrome:** Chris is the team's relationship engine and pipeline builder. His 33 years of legal experience -- including a JD from Widener and a BA from Villanova -- give him an analytical framework that few CROs possess. He can evaluate provenance chains, assess legal title risk, and identify deal-killers before PleoChrome invests operational resources. His prior gemstone tokenization venture means he has already navigated the specific challenges of this business model once, and brings that hard-won knowledge to PleoChrome's improved framework. Most importantly, Chris's network of gemstone asset holders, estate attorneys, dealers, and collectors is PleoChrome's most immediate go-to-market asset. He is the reason PleoChrome has a $1.5B+ pipeline of interested asset holders.

---

## 2. ORGANIZATIONAL CHART & REPORTING STRUCTURE

### Current Structure (Pre-Revenue)

```
                    ┌─────────────────────┐
                    │   BOARD OF MANAGERS  │
                    │  (All 3 Members)     │
                    │  Major decisions     │
                    │  require [X]% vote   │
                    └─────────┬───────────┘
                              │
                    ┌─────────┴───────────┐
                    │   Shane Pierson      │
                    │   CEO                │
                    │   Day-to-day mgmt    │
                    │   authority          │
                    └────┬──────────┬──────┘
                         │          │
            ┌────────────┴──┐   ┌──┴────────────┐
            │ David Whiting │   │ Chris Ramsey   │
            │ CTO & COO     │   │ CRO            │
            │               │   │                │
            │ Technology     │   │ Revenue        │
            │ Operations     │   │ Asset Pipeline │
            │ Infrastructure │   │ Partnerships   │
            └───────────────┘   └────────────────┘
```

### Authority Lines

| Authority Level | Decisions | Who Decides |
|----------------|-----------|-------------|
| **Day-to-Day Operations** | Vendor selection under $5K, meeting scheduling, internal process changes, hiring contractors under $2,500/month | CEO (Shane) -- unilateral |
| **Material Commitments** | Contracts over $5K, new partner engagements, insurance selection, hiring decisions, significant process changes | CEO + one other member (majority) |
| **Strategic / Structural** | Equity changes, new member admission, entity restructuring, debt over $25K, pivot decisions, asset acceptance/rejection, PPM approval | All three members (unanimous or supermajority) |
| **Technology Architecture** | Stack decisions, deployment approvals, smart contract deployment, security protocols | CTO (David) -- recommends to CEO for approval |
| **Revenue Commitments** | Asset holder engagement terms, fee negotiations, investor term modifications | CRO (Chris) -- recommends to CEO for approval |

### Functional Reporting (Who Reports to Whom on What)

| Function | Primary Owner | Reports To | Informed |
|----------|--------------|-----------|----------|
| Technology roadmap | David | Shane | Chris |
| Smart contract status | David | Shane + Chris | -- |
| Compliance monitoring | David (execution) | Shane (accountability) | Chris (oversight) |
| Asset holder relationships | Chris | Shane | David |
| Investor pipeline | Shane + Chris | Board of Managers | David |
| Financial management | Shane | Board of Managers | David, Chris |
| Legal counsel coordination | Shane | Board of Managers | David, Chris |
| Partner relationships (tokenization platform, Chainlink) | Shane (strategy), David (technical) | Board of Managers | Chris |
| Vault operations | David | Shane | Chris |
| Quarterly investor reporting | David (prepares) | Shane (approves + sends) | Chris (reviews) |

### Board of Advisors -- Recommendations

PleoChrome should assemble a 3-5 person advisory board within 90 days of entity formation. Advisors provide credibility, specialized expertise, and network access without the liability or governance complexity of a formal board of directors.

**Recommended Advisory Board Composition:**

| Seat | Profile | Why | Compensation |
|------|---------|-----|-------------|
| **Securities Regulatory Advisor** | Former SEC enforcement attorney or FINRA examiner with 15+ years experience | Provides regulatory credibility and can red-flag issues before they become violations. Name on advisory board signals to BDs, investors, and regulators that PleoChrome takes compliance seriously | 0.25-0.5% equity (vesting over 2 years) + expenses |
| **Gemology / Precious Stones Advisor** | GIA Fellow or senior GIA alumnus with 20+ years in institutional gemstone markets | Validates PleoChrome's appraisal methodology and vault selection. Provides credibility with asset holders and appraisers | 0.25-0.5% equity (vesting over 2 years) + expenses |
| **Blockchain / DeFi Advisor** | Senior engineer or CTO who has shipped ERC-3643 or equivalent regulated token projects | Fills the Web3 experience gap on the founding team. Can review David's technical architecture and flag risks before deployment | 0.25-0.5% equity (vesting over 2 years) + expenses |
| **Family Office / HNW Distribution Advisor** | Former family office allocator or wealth management executive who has invested in alternative assets | Opens doors to the exact investor audience PleoChrome is targeting. Can validate the investment thesis and marketing materials | 0.25-0.5% equity (vesting over 2 years) + expenses |
| **Insurance / Risk Management Advisor** | Specie insurance specialist or risk management professional from Lloyds, AIG, or specialty markets | Ensures PleoChrome's custody and insurance architecture meets institutional standards. Rare expertise that is hard to hire | 0.25% equity (vesting over 2 years) + expenses |

**Advisory Board Terms:**
- 1-year initial commitment, renewable annually
- Quarterly advisory calls (1 hour each) + ad hoc availability (up to 3 hours/quarter)
- Written advisory agreement with IP assignment and confidentiality provisions
- No voting rights, no fiduciary duties, no management authority
- Clear disclosure that advisors are NOT officers and do not speak for PleoChrome

**Sourcing Advisors:**
- Shane's SBA lending network (financial institution connections)
- Chris's legal and asset holder network
- LinkedIn targeted outreach (use same institutional-luxury brand positioning)
- Tokenization platform partner networks (Brickken, Zoniqx -- they may recommend Web3 advisors)
- GIA alumni network

### When to Hire Key Roles

The founding team of three can operate the business through the first asset closing and early operations. Hiring prematurely burns cash before revenue arrives and creates management overhead the team cannot yet afford. Below are the triggers -- not dates -- for each key hire.

| Role | Hire When... | Type | Budget |
|------|-------------|------|--------|
| **Compliance Officer (dedicated)** | PleoChrome manages 3+ SPVs simultaneously OR regulatory complexity exceeds the team's bandwidth OR a BD/regulator requires a dedicated CCO | Fractional (10-20 hrs/month) initially, then full-time | $5,000-12,000/month fractional; $120,000-180,000/yr FTE |
| **General Counsel (fractional)** | Monthly legal spend exceeds $15K for 3+ consecutive months OR the volume of contracts, amendments, and legal questions overwhelms counsel retainer | Fractional (10-15 hrs/month) | $5,000-10,000/month |
| **Operations Analyst** | The team is processing 2+ assets simultaneously AND investor onboarding volume exceeds 5 new investors per month | Full-time hire | $65,000-90,000/yr |
| **Investor Relations Manager** | Active investor count exceeds 15 AND quarterly reporting + ad hoc communications consume more than 20 hours/month | Part-time or fractional | $4,000-8,000/month |
| **Marketing / Content Manager** | 506(c) outreach strategy requires weekly content production (LinkedIn, email, webinars) AND Shane's investor relationship time is being consumed by content creation | Contract initially | $3,000-6,000/month |
| **CFO / Controller (fractional)** | PleoChrome manages SPV financials across 2+ series AND K-1 preparation for 10+ investors requires dedicated financial oversight | Fractional (10-15 hrs/month) | $4,000-8,000/month |

---

## 3. ROLE & RESPONSIBILITY MATRIX (RACI)

**Legend:**
- **R** = Responsible (does the work)
- **A** = Accountable (owns the outcome, has final authority)
- **C** = Consulted (provides input before the work is done)
- **I** = Informed (notified after the work is done)

### Corporate & Legal Functions

| Function | Shane (CEO) | David (CTO/COO) | Chris (CRO) | External |
|----------|:-----------:|:----------------:|:------------:|:--------:|
| Entity formation (Wyoming LLC) | R, A | I | C | Registered Agent (R) |
| Operating Agreement drafting | A | C | C | Securities Counsel (R) |
| Operating Agreement execution | R | R | R | -- |
| EIN and bank account setup | R, A | I | I | -- |
| Board resolution drafting | R, A | I | C | -- |
| Annual Wyoming filings | I | R | I | Registered Agent (R) |
| Corporate minutes and records | R, A | I | C | -- |
| Securities counsel selection | A | C | C | -- |
| Securities counsel management | R, A | I | C | -- |
| Insurance procurement | A | R | C | Insurance Broker (R) |
| Insurance renewal management | I | R, A | I | Insurance Broker (R) |

### Asset Pipeline & Due Diligence

| Function | Shane (CEO) | David (CTO/COO) | Chris (CRO) | External |
|----------|:-----------:|:----------------:|:------------:|:--------:|
| Asset holder relationship management | C | I | R, A | -- |
| Asset holder sourcing and intake | C | I | R, A | -- |
| Asset holder KYC/KYB execution | I | R | C | KYC Provider (R) |
| Asset holder KYC/KYB approval | A | I | C | -- |
| OFAC/SDN/PEP screening (execution) | I | R | I | -- |
| OFAC/SDN/PEP screening (oversight) | A | I | C | -- |
| Provenance and chain of custody review | C | R | C | Securities Counsel (C) |
| Due diligence on asset holders | C | R | R, A | Background Check Provider (R) |
| Due diligence on partners (vaults, BDs) | C | R | C | -- |
| Engagement Agreement negotiation | A | I | R | Securities Counsel (C) |
| Engagement Agreement execution | R, A | I | C | -- |

### Verification & Valuation

| Function | Shane (CEO) | David (CTO/COO) | Chris (CRO) | External |
|----------|:-----------:|:----------------:|:------------:|:--------:|
| GIA submission logistics | I | R, A | I | GIA Lab (R) |
| GIA report verification | I | R, A | C | -- |
| Appraiser panel selection | A | R | C | -- |
| Appraiser independence confirmation | I | C | R | Appraisers (R) |
| Appraiser coordination (scheduling, shipping) | I | R, A | I | Transit Provider (R) |
| Appraisal variance analysis | A | R | C | -- |
| Final offering value determination | R, A | C | C | Securities Counsel (C) |
| Annual re-appraisal coordination | I | R, A | I | Appraisers (R) |

### Custody & Insurance

| Function | Shane (CEO) | David (CTO/COO) | Chris (CRO) | External |
|----------|:-----------:|:----------------:|:------------:|:--------:|
| Vault partner evaluation | A | R | C | -- |
| Vault partner selection | R, A | C | C | -- |
| Custody agreement negotiation | A | C | C | Securities Counsel (R) |
| Vault operations (transit, inspections) | I | R, A | I | Vault Provider (R) |
| Vault API/feed integration | I | R, A | I | Vault Provider (C) |
| Specie insurance procurement | A | R | I | Insurance Broker (R) |
| Custody verification (ongoing) | I | R, A | I | Vault Provider (R) |
| Insurance coverage verification | I | R, A | I | Insurance Broker (R) |

### Technology & Smart Contracts

| Function | Shane (CEO) | David (CTO/COO) | Chris (CRO) | External |
|----------|:-----------:|:----------------:|:------------:|:--------:|
| Tokenization platform configuration | C | R, A | I | Platform vendor (C) |
| Tokenization platform selection and management | A | C | I | Platform vendor (R) |
| Token design (name, symbol, supply, rules) | A | R | C | Securities Counsel (C) |
| Smart contract deployment (testnet) | I | R, A | I | -- |
| Smart contract deployment (mainnet) | A | R | C | -- |
| Smart contract testing | I | R, A | I | -- |
| Smart contract audit engagement | A | R | I | Audit Firm (R) |
| Smart contract audit remediation | I | R, A | I | Audit Firm (C) |
| Chainlink PoR external adapter development | I | R, A | I | Chainlink (C) |
| Chainlink PoR integration and testing | C | R, A | I | Chainlink (C) |
| Chainlink BUILD program application | R | C | I | Chainlink (R) |
| Website and technology platform | C | R, A | I | -- |
| Data infrastructure and reporting systems | I | R, A | I | -- |
| Security monitoring and incident response | A | R | I | -- |

### Compliance & Regulatory

| Function | Shane (CEO) | David (CTO/COO) | Chris (CRO) | External |
|----------|:-----------:|:----------------:|:------------:|:--------:|
| AML/KYC policy drafting | A | C | I | Securities Counsel (C) |
| AML/KYC program execution | I | R | I | KYC Provider (R) |
| AML/KYC program oversight | A | I | C | -- |
| Sanctions screening (quarterly) | I | R | I | -- |
| SAR filing (if needed) | A | R | C | FinCEN (R) |
| SEC Form D filing | A | I | I | Securities Counsel (R) |
| Blue sky state filings | I | I | I | Securities Counsel (R) |
| MSB determination and compliance | A | C | C | Securities Counsel (R) |
| Regulatory change monitoring | C | I | R | Securities Counsel (C) |
| Compliance documentation and record retention | A | R | C | -- |
| Annual compliance review | A | R | C | External Auditor (R) |

### Securities Offering & Investors

| Function | Shane (CEO) | David (CTO/COO) | Chris (CRO) | External |
|----------|:-----------:|:----------------:|:------------:|:--------:|
| PPM drafting and review | A | I | C | Securities Counsel (R) |
| PPM finalization and approval | R, A | I | C | Securities Counsel (R) |
| Subscription Agreement drafting | I | I | C | Securities Counsel (R) |
| Token Purchase Agreement drafting | C | C | I | Securities Counsel (R) |
| Investor pipeline development | R | I | R | BD (C) |
| Investor outreach and meetings | R, A | I | R | BD (C) |
| Investor onboarding (KYC, accreditation) | I | R | I | Verification Provider (R) |
| Investor wallet setup assistance | I | R, A | I | -- |
| Investor communications (ongoing) | R, A | C | I | -- |
| Quarterly investor reports | A | R | C | -- |
| Investor data room maintenance | I | R, A | I | -- |
| Cap table management | A | R | I | -- |
| BD engagement and management | R, A | I | C | BD (R) |

### Marketing & Business Development

| Function | Shane (CEO) | David (CTO/COO) | Chris (CRO) | External |
|----------|:-----------:|:----------------:|:------------:|:--------:|
| Marketing strategy | R, A | I | C | -- |
| Marketing materials creation | R | C | I | Designer (R) |
| Marketing compliance review | A | I | C | Securities Counsel (R), BD (C) |
| Content creation (articles, LinkedIn) | R, A | I | I | -- |
| Website updates | C | R, A | I | -- |
| Partnership development (tokenization platform) | R, A | C | I | Platform vendor (R) |
| Partnership development (Chainlink) | R, A | C | I | Chainlink (R) |
| Partnership development (Vaults) | A | R | C | Vault Providers (R) |
| Partnership development (BDs/ATS) | R, A | I | C | BD (R) |

### Finance & Administration

| Function | Shane (CEO) | David (CTO/COO) | Chris (CRO) | External |
|----------|:-----------:|:----------------:|:------------:|:--------:|
| Financial modeling and budgeting | R, A | C | C | -- |
| Cash flow management | R, A | I | I | -- |
| Capital call management | R, A | I | I | -- |
| Bookkeeping and accounting | A | I | I | CPA/Bookkeeper (R) |
| Tax preparation (entity) | A | I | I | CPA (R) |
| K-1 preparation (SPV investors) | A | R | I | CPA (R) |
| Banking relationship management | R, A | I | I | -- |
| Accounts payable | R, A | I | I | -- |

---

## 4. SHANE PIERSON -- CEO RESPONSIBILITIES

### The CEO's Job at PleoChrome

At a three-person startup preparing a regulated securities offering, the CEO's role is not strategy deck creation or vision speeches. It is three things, in order of priority:

1. **Get the money in the door.** Raise capital from accredited investors. This is the single activity that determines whether PleoChrome survives.
2. **Manage the critical relationships.** Securities counsel, tokenization platform partners (Brickken/Zoniqx), Chainlink, broker-dealers, and the first institutional investor relationships are all CEO-level relationships.
3. **Make the decisions that only the CEO can make.** Asset acceptance/rejection, offering value sign-off, PPM approval, team capital calls, and hiring.

Everything else should be delegated.

### Daily Operating Framework

**Morning Block (7:00 AM - 10:00 AM ET):**
- Review overnight communications (email, Slack, partner messages)
- Review cash position and upcoming commitments (5 min daily)
- Prepare for any investor or partner meetings scheduled for the day
- Respond to time-sensitive counsel or BD communications

**Core Block (10:00 AM - 3:00 PM ET):**
- Investor meetings and outreach calls (target: 2-3 per day during active fundraising)
- Partner relationship meetings (Brickken, Chainlink, BD -- as scheduled)
- Securities counsel check-ins (weekly or as needed)
- Content creation for 506(c) marketing (LinkedIn posts, articles, email campaigns)

**Afternoon Block (3:00 PM - 5:00 PM ET):**
- Internal team coordination (David, Chris)
- Document review (PPM sections, engagement agreements, compliance docs)
- Strategic planning and pipeline review
- Administrative tasks (banking, filings, insurance)

### Weekly Priorities

| Day | Primary Focus |
|-----|--------------|
| **Monday** | Weekly team check-in (9 AM). Pipeline review. Set priorities for the week. Review all metrics. |
| **Tuesday** | Investor outreach day. Schedule all investor calls/meetings for Tuesdays and Thursdays. |
| **Wednesday** | Partner and counsel day. Brickken, Chainlink, BD, and legal check-ins. |
| **Thursday** | Investor outreach day. Second investor meeting day of the week. |
| **Friday** | Administrative and strategic. Document review, financial management, content creation, next-week planning. |

### Weekly Time Allocation

| Activity | Hours/Week | Percentage |
|----------|-----------|------------|
| Investor outreach and relationship management | 15 | 30% |
| Partner relationship management (tokenization platform, Chainlink, BD, vaults) | 10 | 20% |
| Legal and regulatory coordination (counsel, filings, document review) | 8 | 16% |
| Team leadership and strategic planning | 7 | 14% |
| Financial management (cash flow, budgeting, capital calls) | 5 | 10% |
| Content creation and marketing | 3 | 6% |
| Administrative | 2 | 4% |
| **Total** | **50** | **100%** |

### What Shane Must Own Personally

These cannot be delegated:

1. **The investor close.** Shane is the closer. When an accredited investor is ready to commit capital, Shane must be in the room (or on the call). This is a founder-sells business until revenue supports an investor relations hire.

2. **The securities counsel relationship.** Counsel reports to Shane. Shane reviews every PPM section, every legal opinion, every compliance determination. He does not need to be a lawyer -- he needs to be the person who asks "what does this mean for us?" and ensures counsel's work product is actionable.

3. **The tokenization platform and Chainlink partnerships.** These are strategic partnerships that define PleoChrome's infrastructure. The business relationship is Shane's. David owns the technical integration, but the partnership terms, commercial negotiations, and escalations go through Shane. [UPDATED 2026-03-27: Both Brickken and Zoniqx are under evaluation per Decisions #003/#004.]

4. **The final go/no-go on every asset.** When the team brings an asset through the 7-Gate framework, Shane makes the final call on whether PleoChrome accepts it. This decision carries the company's reputation and legal exposure.

5. **Capital calls.** When PleoChrome needs more capital from the founding team, Shane initiates the conversation and manages the process.

6. **Brand and positioning.** How PleoChrome presents itself to the world -- the website, the pitch deck, the LinkedIn presence, the partner portal -- is Shane's domain. The "billionaire-comfortable" standard is his to enforce.

### What Shane Should Delegate

| Activity | Delegate To | Why |
|----------|------------|-----|
| Token configuration and deployment | David | Technical execution is CTO domain |
| Vault operations (transit, custody, API) | David | Operational logistics is COO domain |
| GIA submission tracking | David | Operational logistics |
| KYC/AML screening execution | David | Operational execution |
| Sanctions screening | David | Routine operational compliance |
| Appraiser coordination | David | Operational logistics |
| Quarterly report preparation | David (prepares), Shane (reviews and sends) | Data-heavy preparation is CTO/COO work |
| Compliance document drafting | David (drafts), Shane (approves) | Execution vs. accountability |
| Asset holder intake management | Chris | CRO owns the pipeline |
| Asset holder relationship day-to-day | Chris | CRO owns ongoing relationships |
| Regulatory monitoring | Chris | CRO tracks market and regulatory changes |
| Insurance applications and renewals | David | Operational administration |

### Key Relationships Shane Owns

| Relationship | Frequency of Contact | Purpose |
|-------------|---------------------|---------|
| Securities counsel (lead attorney) | Weekly during PPM drafting; monthly after | Legal strategy, document review, regulatory guidance |
| Tokenization platform (Brickken and/or Zoniqx) | Biweekly during integration; monthly after | Partnership terms, feature requests, escalations |
| Chainlink (BUILD program contact) | Monthly | PoR integration support, partnership development |
| Broker-dealer (Dalmore or selected BD) | Weekly during offering; monthly otherwise | Compliance review, marketing approval, investor coordination |
| Top 5 investor relationships | As needed (responsive within 24 hours) | Capital raising, relationship management |
| Banking relationship (Mercury/Relay) | Monthly | Cash management, wire processing |

### CEO Decision Rights

Shane has unilateral decision authority on:
- Spending up to $5,000 per commitment
- Scheduling and prioritizing team activities
- Day-to-day operational decisions
- Marketing content approval (within compliance-reviewed guidelines)
- Contractor engagement under $2,500/month
- Meeting and outreach scheduling
- Internal process changes

Shane requires one other member's approval for:
- Spending over $5,000 per commitment
- New partner engagements
- Insurance selection and binding
- Hiring decisions (employees or contractors over $2,500/month)
- Technology architecture changes

Shane requires all three members' approval for:
- Accepting or rejecting an asset for the pipeline
- Setting offering value and token pricing
- Approving the PPM
- Making equity changes or admitting new members
- Taking on debt over $25,000
- Pivoting business strategy
- Issuing capital calls

---

## 5. DAVID WHITING -- CTO & COO RESPONSIBILITIES

### The CTO/COO's Job at PleoChrome

David wears two hats. As CTO, he owns everything that involves code, configuration, integration, and technical architecture. As COO, he owns the operational machinery that makes PleoChrome function day-to-day: the processes, the logistics, the compliance execution, the reporting systems. The combination makes sense at a three-person company because PleoChrome's operations ARE technology -- tokenization platform configuration (Brickken or Zoniqx -- see Decision #003), Chainlink integration, vault API feeds, investor onboarding systems, and data pipelines.

### Technology Stack Ownership

David is the single point of technical authority. Nothing deploys without his approval. Nothing integrates without his architecture review.

**Owned Systems:**

| System | David's Responsibility | Current Status |
|--------|----------------------|----------------|
| **PleoChrome Website** (pleochrome.com) | Next.js application, Vercel deployment, content updates, performance | LIVE (7 routes + partner portal) |
| **Tokenization Platform** | Token configuration, compliance rules, KYC settings, dashboard management. Evaluating Brickken (ERC-3643) and Zoniqx (ERC-7518) per Decision #003/#004 | PENDING (sandbox access requested for both) |
| **Chainlink PoR** | External adapter development, oracle feed configuration, monitoring | NOT STARTED |
| **Investor Onboarding System** | KYC flow, accreditation verification, wallet setup, subscription processing | NOT STARTED |
| **Reporting Infrastructure** | Quarterly NAV calculations, investor reports, compliance logs, sanctions screening records | NOT STARTED |
| **Data Room** | DocSend/Dealroom setup, document management, access controls | NOT STARTED |
| **Internal Systems** | Google Workspace administration, Drive structure, calendar management | ACTIVE |
| **Smart Contracts** | ERC-3643 or ERC-7518 token (via selected tokenization platform), compliance modules, identity registry | NOT STARTED |
| **Security Infrastructure** | Key management, wallet security, multisig setup, access controls | NOT STARTED |

### Data Infrastructure and Reporting

David's statistics and data engineering background makes him the natural owner of PleoChrome's data layer:

**Investor Data Pipeline:**
- KYC/AML data ingestion and storage
- Accreditation verification records
- Subscription and wire tracking
- Token distribution records
- Cap table maintenance

**Asset Data Pipeline:**
- GIA report data (certificate numbers, grades, origins, weights)
- Appraisal data (three independent valuations per asset)
- Variance analysis engine
- NAV calculation engine (current value based on latest appraisal)
- Provenance and chain of custody records

**Compliance Data Pipeline:**
- OFAC/SDN screening results (quarterly re-screens)
- PEP screening results
- Sanctions screening logs with timestamps
- SAR filing records (if ever needed)
- Blue sky filing tracker (state-by-state)

**Operational Reporting:**
- Vault custody confirmation log
- Insurance coverage verification log
- Chainlink PoR uptime monitoring
- Token contract state monitoring (paused/unpaused, frozen addresses, compliance events)
- Cash flow dashboard

### Tokenization Platform Management

David is the platform administrator. He configures, tests, and deploys through the selected tokenization platform dashboard. [UPDATED 2026-03-27: PleoChrome is evaluating both Brickken (ERC-3643) and Zoniqx (ERC-7518) per Decisions #003 and #004. References below apply to whichever platform is selected after the 30-day evaluation period.]

**Pre-Launch Responsibilities:**
1. Obtain and configure sandbox access (both platforms during evaluation)
2. Map PleoChrome's compliance requirements to the platform's compliance module configuration
3. Configure token parameters (name, symbol, total supply, compliance rules)
4. Test KYC integration flow
5. Deploy to testnet and run comprehensive test suite
6. Coordinate with platform support on any configuration limitations
7. Prepare mainnet deployment checklist
8. Deploy to mainnet (with Shane's approval)

**Post-Launch Responsibilities:**
1. Monitor token contract health (no unexpected state changes)
2. Process investor whitelisting (after KYC clearance)
3. Execute token minting operations
4. Monitor compliance module for blocked transactions
5. Manage platform subscription (renewal, tier changes)
6. Coordinate with platform vendor on updates or breaking changes
7. Maintain backup of all configuration data and contract ABIs

### Chainlink Integration

This is David's most technically demanding responsibility and the one that requires the most ramp-up.

**Architecture (David Must Build):**

```
┌──────────────┐    ┌──────────────────┐    ┌─────────────────┐    ┌──────────────┐
│  Vault API   │───>│ External Adapter  │───>│  Chainlink Node  │───>│  PoR Contract│
│  (or manual  │    │  (Node.js/Python) │    │  Network (3+    │    │  (Polygon)   │
│  feed)       │    │  David builds     │    │  independent)    │    │              │
└──────────────┘    └──────────────────┘    └─────────────────┘    └──────────────┘
                                                                          │
                                                                          v
                                                                   ┌──────────────┐
                                                                   │ ERC-3643     │
                                                                   │ Token        │
                                                                   │ (mint-gate)  │
                                                                   └──────────────┘
```

**Development Phases:**
1. Build external adapter that reads vault inventory data (REST API or manual JSON feed)
2. Deploy adapter to a reliable hosting environment (AWS Lambda or similar)
3. Configure Chainlink node job specification
4. Deploy PoR aggregator contract on Polygon testnet
5. Test oracle-gated minting: token contract queries PoR before allowing mint
6. Verify failure modes: what happens if PoR feed goes stale? If vault reports negative? If oracle nodes disagree?
7. Deploy to mainnet (with Shane's approval)
8. Monitor feed uptime and staleness (target: 99.5%+ uptime)

### Smart Contract Deployment and Testing

**Testnet Phase (David owns entirely):**
- Deploy ERC-3643 token via selected tokenization platform on Polygon Amoy testnet
- Configure compliance modules (KYC required, accredited investor only, US jurisdiction)
- Test scenarios:
  - Mint to whitelisted wallet (should succeed)
  - Transfer to non-whitelisted wallet (should fail)
  - Transfer between whitelisted wallets (should succeed)
  - Mint exceeding PoR-reported reserves (should fail)
  - Freeze/unfreeze address (should work as expected)
  - Pause/unpause contract (should work as expected)
- Document all test results with transaction hashes

**Mainnet Phase (David executes, Shane approves):**
- Pre-deployment checklist verification (token name matches PPM, supply matches offering value / price)
- Deploy with multisig governance (no single key can modify the contract)
- Verify deployment parameters match testnet configuration exactly
- Record all contract addresses permanently
- Set up monitoring for contract events

### Operational Process Design

David designs and documents the standard operating procedures for:

1. **Investor Onboarding SOP:** Step-by-step from first contact to token in wallet
2. **Asset Intake SOP:** From asset holder introduction to Gate 1 clearance
3. **GIA Submission SOP:** From stone selection to verified report receipt
4. **Appraisal Chain SOP:** From appraiser selection to variance analysis
5. **Vault Transit SOP:** From pickup to custody acknowledgment
6. **Sanctions Screening SOP:** Quarterly re-screening of all parties
7. **Quarterly Reporting SOP:** Data collection, NAV calculation, report generation, distribution
8. **Incident Response SOP:** Smart contract vulnerability, vault breach, compliance violation, key compromise

### Investor Onboarding Systems

David builds and operates the end-to-end investor onboarding pipeline:

```
Investor Interest ──> KYC Submission ──> Accreditation Verification ──> PPM Review
       │                    │                      │                        │
       v                    v                      v                        v
  CRM Entry          KYC Provider           Self-Cert / 3rd Party    Data Room Access
                     (Brickken or                                    (DocSend/Brickken)
                      external)
       │                    │                      │                        │
       v                    v                      v                        v
Subscription ──────> Wire Instructions ──────> Wire Confirmed ──────> Token Minted
  Agreement                                    (bank confirms)        (Brickken)
  Signed                                            │                      │
                                                    v                      v
                                              Cap Table Updated    Wallet Confirmed
                                              (David maintains)    (on-chain)
```

### Security and Compliance Monitoring Systems

David builds and maintains:

1. **Wallet and Key Security:**
   - Multisig configuration for all operational wallets
   - Key backup and recovery procedures
   - Access control matrix (who can sign what)
   - Hardware wallet procurement and setup

2. **On-Chain Monitoring:**
   - Token contract event monitoring (transfers, compliance blocks, mints)
   - PoR feed staleness alerts
   - Gas price monitoring (for operational transactions)
   - Unusual activity detection

3. **Compliance Monitoring:**
   - Quarterly sanctions re-screening automation
   - Investor accreditation expiration tracking
   - Blue sky filing deadline tracking
   - Insurance renewal tracking
   - Annual re-appraisal scheduling

### What David Needs to Learn / Ramp Up On

**Priority 1 -- Critical for First Asset (Weeks 1-6):**

| Topic | Resource | Time Investment | Success Metric |
|-------|----------|----------------|----------------|
| ERC-3643 Token Standard | T-REX whitepaper + Tokeny documentation | 20 hours | Can explain identity registry, compliance modules, and claim topics without notes |
| Polygon Network | Polygon Academy + developer docs | 15 hours | Can deploy a contract on Polygon Amoy testnet and explain gas mechanics |
| Tokenization Platform(s) | Brickken and Zoniqx documentation + sandbox exploration | 20 hours | Can configure and deploy a token through either platform's dashboard |
| Wallet Management | MetaMask + Gnosis Safe documentation | 10 hours | Can set up multisig, manage keys, execute transactions |
| Solidity Basics | CryptoZombies + OpenZeppelin docs | 25 hours | Can read and understand ERC-3643 contract code; can identify common vulnerabilities |

**Priority 2 -- Required for Launch (Weeks 4-10):**

| Topic | Resource | Time Investment | Success Metric |
|-------|----------|----------------|----------------|
| Chainlink External Adapters | Chainlink developer documentation + tutorials | 20 hours | Can build and deploy a working external adapter that reads from a REST API |
| Chainlink Proof of Reserve | PoR documentation + existing PoR implementations | 15 hours | Can explain the full PoR architecture and deploy a feed on testnet |
| Smart Contract Security | Trail of Bits "Building Secure Smart Contracts" + audit report review | 15 hours | Can identify the OWASP Top 10 smart contract vulnerabilities; can review an audit report and understand findings |

**Priority 3 -- Valuable for Operations (Ongoing):**

| Topic | Resource | Time Investment | Success Metric |
|-------|----------|----------------|----------------|
| USPAP Appraisal Standards | USPAP overview + sample reports | 10 hours | Can verify that an appraisal report meets USPAP requirements |
| Reg D 506(c) Mechanics | SEC guidance + counsel discussions | 10 hours | Can explain accreditation verification requirements and general solicitation rules |
| SOC 2 Readiness | SOC 2 overview + control framework | 10 hours | Can identify which controls PleoChrome needs to implement for eventual SOC 2 audit |

### David's Weekly Time Allocation

| Activity | Hours/Week | Percentage |
|----------|-----------|------------|
| Token/smart contract technical work | 15 | 30% |
| Chainlink and oracle integration | 10 | 20% |
| Operational execution (KYC, vault, GIA, transit) | 10 | 20% |
| Reporting and data management | 5 | 10% |
| Learning and ramp-up (Web3, blockchain) | 5 | 10% |
| Systems and infrastructure | 3 | 6% |
| Team meetings and coordination | 2 | 4% |
| **Total** | **50** | **100%** |

---

## 6. CHRIS RAMSEY -- CRO RESPONSIBILITIES

### The CRO's Job at PleoChrome

Chris's primary value to PleoChrome is not compliance, not legal analysis, and not operations. It is relationships. Chris has the connections to asset holders, the understanding of the gemstone market, and the prior experience with gemstone tokenization. The CRO title reflects this: Chris is responsible for the revenue pipeline, which at PleoChrome means sourcing assets and developing the partnerships that move stones from raw inventory to tokenized securities.

### Asset Holder Pipeline Management

This is Chris's highest-priority function. PleoChrome's revenue depends entirely on processing assets. No assets, no tokens, no investors, no revenue.

**Pipeline Stages (Chris Manages):**

```
Stage 1: IDENTIFICATION
Chris identifies and qualifies potential asset holders from his network
├── Does the holder have GIA-certified stones?
├── Estimated value above $5M threshold?
├── Can the holder demonstrate clear provenance?
├── Is the holder willing to undergo KYC/AML screening?
└── Is the holder financially stable (can they pay setup costs)?

Stage 2: INTRODUCTION
Chris introduces PleoChrome, explains the 7-Gate Framework
├── Initial call or meeting (Chris leads)
├── Share one-pager and website
├── Gauge genuine interest vs. tire-kicking
└── If qualified → advance to Stage 3

Stage 3: ENGAGEMENT
Shane + Chris present the engagement terms
├── Explain fee structure (2% setup, 1.5% success, 0.75% annual)
├── Explain the 7-Gate process and timeline
├── Explain asset holder obligations (vault bill current, KYC, provenance docs)
├── Share draft Engagement Agreement
└── If terms accepted → advance to Stage 4

Stage 4: INTAKE
David takes over operational intake; Chris maintains relationship
├── Asset holder completes Intake Questionnaire
├── KYC/KYB processing
├── OFAC/SDN screening
├── Provenance documentation submission
└── Gate 1 decision (Shane, with input from Chris and David)
```

**Chris's Pipeline Metrics:**

| Metric | Target (Year 1) | How Measured |
|--------|-----------------|-------------|
| Active conversations with asset holders | 10-15 at any time | CRM pipeline |
| New qualified introductions per month | 2-3 | CRM entries |
| Conversion rate (introduction to engagement) | 20-30% | Pipeline tracking |
| Assets in active intake | 2-3 at any time (after first asset closes) | Pipeline tracking |
| Pipeline value (total estimated value of assets in conversation) | $50M+ | Pipeline tracking |

### Revenue Generation Strategy

Chris, in coordination with Shane, develops and executes the revenue strategy:

**Primary Revenue Channels (Chris Responsible for Pipeline):**

1. **Asset Holder Fees:** Chris sources the assets; PleoChrome earns setup fees (2%), success fees (1.5% of capital raised), and annual admin fees (0.75% AUM)
2. **Investor Introductions:** Chris's network includes potential investors and family offices. Every qualified investor introduction is revenue potential
3. **Referral Partnerships:** Chris develops relationships with:
   - Gemstone dealers who may have clients interested in tokenization
   - Family offices with gemstone holdings
   - Trust and estate attorneys managing high-value estate gemstone assets
   - Insurance companies that insure gemstone collections (they know who has the assets)

**Revenue Targets (Chris's Accountability):**

| Milestone | Target | Chris's Contribution |
|-----------|--------|---------------------|
| First asset in pipeline | Week 1 (already done -- Kandi barrel) | Existing relationship |
| First engagement signed | Week 5 | Relationship management |
| Second asset identified | Week 15 | Network outreach |
| $50M pipeline value | Month 8 | Active sourcing |
| 3 assets in various pipeline stages | Month 12 | Sustained effort |

### Partner Relationship Management

Chris manages day-to-day relationships with specific partners where his legal and industry background adds value:

| Partner Type | Chris's Role | Shane's Role | David's Role |
|-------------|-------------|-------------|-------------|
| Asset holders | Primary relationship owner (day-to-day) | Executive sponsor (closes, escalations) | Operational coordinator (intake, logistics) |
| Appraisers | Interview lead, credential verification | Final selection approval | Logistics and scheduling |
| Vault providers | Background research, reference checks | Negotiation and selection | API integration, operations |
| Estate and trust attorneys | Network development and referral cultivation | -- | -- |
| Insurance brokers (specie) | Research and initial contact | Negotiation and binding | Application processing |

### Investor Pipeline Development

Chris contributes to investor development through:

1. **Warm Introductions:** Leveraging his 33-year professional network to introduce accredited investors to Shane
2. **Industry Event Attendance:** Representing PleoChrome at gemstone industry events, alternative investment conferences, and high-net-worth networking events
3. **Content Contribution:** Providing market insights for PleoChrome's thought leadership content (Shane writes, Chris provides market intelligence)
4. **Due Diligence Support:** When prospective investors want to validate PleoChrome's industry expertise, Chris can speak credibly to the gemstone market, custody considerations, and valuation methodology

### Leveraging His Existing Network

Chris's network from his prior gemstone tokenization venture and 33 years of legal practice is PleoChrome's most immediate go-to-market asset:

**Network Mapping Exercise (Chris Should Complete in Week 1):**

| Category | Names to List | Purpose |
|----------|--------------|---------|
| Gemstone asset holders (known) | Every person Chris knows who has or controls GIA-certified gemstones | Pipeline sourcing |
| Gemstone dealers and brokers | Industry contacts who know where assets are | Referral relationships |
| High-net-worth individuals | Contacts with $1M+ investable assets who invest in alternatives | Investor introductions to Shane |
| Family offices | Any family office contacts, even indirect | Investor pipeline |
| Attorneys (trust/estate/tax) | Lawyer contacts who manage estates with gemstone assets | Asset sourcing |
| Insurance professionals | Contacts in specie or fine art insurance | Asset sourcing + vault recommendations |
| Prior venture contacts | Everyone from the prior gemstone tokenization venture, including: former partners, service providers, vault contacts, and asset holders who expressed interest | Restart conversations with PleoChrome's improved framework |

**Critical Rule:** Chris should NOT contact anyone on behalf of PleoChrome until (a) the entity is formed, (b) there is a website to point them to (already done), and (c) the AML/KYC policy exists. Reaching out without these basics signals amateurism.

### Compliance Officer Designation

As CEO, Shane serves as interim Compliance Officer, a standard practice for early-stage companies. David executes compliance procedures (screening, monitoring, documentation), and Chris reviews compliance documents for substance (leveraging his legal analytical background). When budget permits, PleoChrome will hire a fractional CCO to take over the formal compliance function.

Chris is CRO -- Chief Revenue Officer. This title:
- Accurately reflects his primary function (revenue pipeline)
- Signals commercial focus to partners and investors

### Chris's Weekly Time Allocation

| Activity | Hours/Week | Percentage |
|----------|-----------|------------|
| Asset holder relationship management | 15 | 38% |
| Pipeline development (outreach, meetings, cultivation) | 10 | 25% |
| Partner due diligence and research | 5 | 13% |
| Document review (PPM sections, agreements, compliance) | 4 | 10% |
| Investor introductions and support | 3 | 7% |
| Team meetings and coordination | 2 | 5% |
| Industry monitoring and competitive intelligence | 1 | 2% |
| **Total** | **40** | **100%** |

---

## 7. OPERATING AGREEMENT KEY TERMS

**IMPORTANT NOTE:** This section presents frameworks and considerations for discussion with your securities counsel. PleoChrome's Operating Agreement must be drafted by a qualified attorney. The frameworks below are industry-standard approaches for multi-founder LLCs in regulated fintech, provided so the founding team can have an informed conversation with counsel rather than starting from zero.

### Equity Split Considerations

There are several common frameworks for allocating equity among co-founders. PleoChrome should evaluate which framework (or hybrid) best reflects the team's situation.

**Framework A: Equal Split**

| Approach | Rationale | Risk |
|----------|-----------|------|
| 33.3% / 33.3% / 33.3% | Simplicity. All three founders are essential. Signals equality and mutual respect. Common in teams where all three contribute different but equally critical skills. | If one founder contributes materially more capital, IP, or sweat equity, an equal split may breed resentment. Also creates unanimous-vote dynamics that can deadlock. |

**Framework B: Lead Founder Premium**

| Approach | Rationale | Risk |
|----------|-----------|------|
| CEO gets larger share (e.g., 40-50%), remaining founders split the balance | Reflects the CEO's role as ultimate decision-maker, largest personal risk-taker, and the person whose departure would most threaten the company. Common when one founder conceived the idea and brought the team together. | If the premium is too large, the other founders may feel like employees rather than partners. Must be balanced by vesting and performance provisions. |

**Framework C: Contribution-Weighted**

| Approach | Rationale | Risk |
|----------|-----------|------|
| Equity proportional to capital contributed + IP value + sweat equity value | Most "fair" in a mathematical sense. Each founder's contribution is quantified and equity allocated accordingly. | Extremely difficult to value non-cash contributions objectively. What is a network of asset holders worth? What is the ability to build the technology worth? Debates over valuation can poison founder relationships. |

**Framework D: Dynamic Equity (Slicing Pie Model)**

| Approach | Rationale | Risk |
|----------|-----------|------|
| Equity is not fixed at formation. Instead, each founder's share adjusts based on ongoing contributions (time, cash, IP, relationships) tracked in a contribution log | Avoids the problem of guessing future contributions at Day 1. Naturally rewards the founder who puts in the most. Well-documented methodology (Mike Moyer's "Slicing Pie"). | Requires rigorous tracking. Can create uncertainty that makes it hard to present a stable cap table to investors and partners. Most investors prefer a fixed cap table. |

**Factors to Weigh in Your Discussion:**

| Factor | Shane | David | Chris |
|--------|-------|-------|-------|
| **Conceived the business** | Who brought the team together and defined the vision? | | |
| **Capital contribution** | Will all three contribute equally? If not, how much difference? | | |
| **Full-time commitment** | Is everyone going full-time? Part-time? How soon? | | |
| **Opportunity cost** | Shane is leaving a national sales manager role. David has a data career. Chris is semi-retired. Whose sacrifice is greatest? | | |
| **Network value** | Shane: SBA/banking network. David: financial services technical contacts. Chris: gemstone asset holders and industry relationships. | | |
| **Prior art** | Chris attempted a prior gemstone tokenization venture. Does that prior attempt contribute IP or learning value to PleoChrome? | | |
| **Risk of departure** | Whose departure would be most damaging? Least recoverable? | | |
| **Age and runway** | Chris at 63 has a shorter working horizon than Shane at 42 or David (age not specified). Does the agreement need to account for expected tenure? | | |

### Vesting Schedules

Vesting protects the company and the remaining founders if a founder departs early. Without vesting, a founder could receive their full equity allocation on Day 1 and leave on Day 2.

**Standard Startup Vesting:**
- 4-year vesting period with 1-year cliff
- After the cliff, equity vests monthly or quarterly
- Example: 25% vests at 12 months (cliff), then 1/48th per month for 36 more months

**Modified Vesting for Mature Founders:**
- 3-year vesting period with 6-month cliff (shorter timeline acknowledges that these are experienced professionals, not 25-year-old first-time founders)
- After the cliff, equity vests quarterly
- Acceleration triggers: change of control, termination without cause

**Reverse Vesting (Recommended for LLCs):**
- All equity is issued on Day 1 (for tax purposes)
- Company retains a repurchase right on unvested units
- Repurchase right lapses according to the vesting schedule
- More tax-efficient than forward vesting for LLC members

**Acceleration Provisions to Discuss:**

| Trigger | Single Trigger | Double Trigger |
|---------|---------------|----------------|
| **Change of control** (company is acquired) | All unvested equity accelerates immediately | Acceleration only if the founder is also terminated or materially demoted within 12 months of change of control |
| **Termination without cause** | Accelerate 12 months of additional vesting | Accelerate 6 months of additional vesting |
| **Death or disability** | Full acceleration | Full acceleration |

**Recommendation:** Use double-trigger acceleration. Single-trigger creates a moral hazard where founders are incentivized to sell the company early to capture unvested equity. Double-trigger protects founders from being pushed out after an acquisition while preserving alignment.

### Decision-Making Authority Thresholds

The Operating Agreement must clearly define three tiers of decision authority:

**Tier 1: Manager Decisions (CEO Acts Alone)**

| Category | Threshold |
|----------|-----------|
| Operating expenses | Up to $5,000 per commitment |
| Contractor engagement | Up to $2,500/month |
| Scheduling and prioritization | Unlimited |
| Internal process changes | Within approved budget |
| Marketing content (within approved guidelines) | Unlimited |
| Day-to-day vendor management | Within approved budget |
| Employee direction and supervision | Unlimited |

**Tier 2: Majority Decisions (2 of 3 Members)**

| Category | Threshold |
|----------|-----------|
| Operating expenses | $5,001 - $50,000 per commitment |
| New partner engagements | All |
| Insurance selection | All |
| Hiring (employees or contractors over $2,500/month) | All |
| Technology architecture changes | All |
| Office/workspace commitments | All |
| Legal engagement changes (new counsel, new BD) | All |

**Tier 3: Supermajority or Unanimous Decisions (All 3 Members)**

| Category | Threshold |
|----------|-----------|
| Equity allocation changes | Unanimous |
| New member admission | Unanimous |
| Capital calls | Unanimous |
| Debt over $25,000 | Unanimous |
| Asset acceptance or rejection | Unanimous |
| PPM approval | Unanimous |
| Offering value and token pricing | Unanimous |
| Entity dissolution | Unanimous |
| Strategy pivot | Unanimous |
| Sale of the company | Unanimous |
| Amendment to Operating Agreement | Unanimous |

**Deadlock Resolution:**

If the three members cannot reach agreement on a Tier 3 decision after two formal discussions separated by at least 7 days:

1. Engage a mutually agreed-upon mediator (48-hour mediation session)
2. If mediation fails, engage a mutually agreed-upon arbitrator for binding arbitration
3. If the parties cannot agree on an arbitrator, use JAMS or AAA arbitration rules
4. Venue: [to be determined -- should match the LLC's home state jurisdiction]

### IP Assignment

Every line of code, every document, every design, every process, every relationship cultivated on behalf of PleoChrome belongs to PleoChrome, not to the individual founder.

**The Operating Agreement Must Include:**

1. **Present Assignment:** Each member assigns to PleoChrome all intellectual property created for or related to PleoChrome's business, including but not limited to:
   - Software code (website, smart contracts, external adapters, scripts)
   - Documentation (PPM sections drafted by team, SOPs, process documents)
   - Brand assets (logo, design system, color palette, domain name)
   - Data (investor lists, pipeline contacts, screening results)
   - Business methods and processes (7-Gate Framework, variance analysis methodology)

2. **Prior Art Carve-Out:** Each member retains ownership of IP created before PleoChrome's formation, listed on a schedule attached to the Operating Agreement. For Chris, this must address: does any IP from his prior gemstone tokenization venture transfer to PleoChrome? Is there a license? Is it a clean-room rebuild?

3. **Work-for-Hire Acknowledgment:** All work product created by members in connection with PleoChrome's business is work-for-hire owned by PleoChrome.

4. **Post-Departure Rights:** Departing members retain no license to use PleoChrome IP. PleoChrome retains full rights to all contributed IP.

### Non-Compete / Non-Solicit

**Non-Compete:**
- During membership AND for 18-24 months after departure
- Scope: Cannot start, join, or advise a competing gemstone tokenization business
- Geographic limitation: United States (or nationwide if the court requires geographic scope)
- Narrowly tailored to PleoChrome's specific business: tokenization of physical gemstones as regulated digital securities
- Does NOT prevent a departing member from working in general fintech, blockchain, lending, or gemology

**Non-Solicit:**
- During membership AND for 24 months after departure
- Cannot solicit or hire PleoChrome employees or contractors
- Cannot solicit PleoChrome's clients (asset holders, investors) for a competing business
- Cannot solicit PleoChrome's partners (Brickken, Chainlink, vault providers, BDs) for a competing business

**Enforceability Note:** Non-compete enforceability varies by state. Wyoming generally enforces reasonable non-competes. Florida does as well. Washington state heavily scrutinizes them. The Operating Agreement should specify that Wyoming law governs.

### Departure / Buyout Provisions

**Voluntary Departure (Member Chooses to Leave):**

| Element | Provision |
|---------|-----------|
| Notice period | 90 days written notice |
| Vested equity | Member retains vested units |
| Unvested equity | Company repurchases at original cost (effectively $0 if no capital was contributed) |
| Buyout price for vested equity | Fair Market Value determined by independent valuation, paid over 24-36 months |
| FMV methodology | Trailing 12-month revenue multiple (3-5x) or book value, whichever is greater. If less than 12 months of revenue, use book value |
| Restrictions | Non-compete and non-solicit activate upon departure |
| Knowledge transfer | 90-day transition period; departing member must cooperate fully |

**Involuntary Removal (For Cause):**

| Cause | Example | Consequence |
|-------|---------|-------------|
| Felony conviction | Criminal charge relevant to the business | Immediate removal; buyout at lower of FMV or book value; non-compete activates |
| Material breach of Operating Agreement | Unauthorized transactions, self-dealing, breach of fiduciary duty | Removal by majority vote after 30-day cure period; buyout at FMV minus damages |
| Bankruptcy or insolvency | Personal bankruptcy filing | Removal by majority vote; buyout at FMV over 36 months |
| Disability (unable to perform for 90+ consecutive days) | Incapacitating illness or injury | Sympathetic buyout at full FMV; accelerated vesting; no non-compete |
| Death | -- | Estate receives FMV buyout over 24 months; company has first right of refusal; key-person life insurance funds the buyout |

**Involuntary Removal (Without Cause):**

| Element | Provision |
|---------|-----------|
| Vote required | Unanimous vote of remaining members |
| Buyout price | Full FMV of vested equity |
| Payment terms | Lump sum within 90 days or structured payments over 12 months |
| Acceleration | All remaining vesting accelerates by 12 months |
| Non-compete | Reduced to 12 months (instead of 18-24) |

**Key-Person Insurance:**
- PleoChrome should carry $500K-$1M key-person life insurance on each founder
- Policy owned by PleoChrome, not the individual
- Proceeds fund buyout obligations in the event of death
- Cost: approximately $500-1,500/year per person (term life, depending on age and health)

### Capital Contribution Requirements

**Initial Contributions:**
- Each member commits an initial capital contribution as documented in Schedule A of the Operating Agreement
- Capital contributions are NOT loans -- they create equity, not debt
- Capital contributions are at-risk -- if PleoChrome fails, contributions are lost

**Additional Capital Calls:**
- Require unanimous approval
- Each member has 30 days to fund their proportional share
- If a member cannot fund, the remaining members may:
  - (a) Fund the shortfall and receive proportional equity dilution of the non-funding member
  - (b) Seek external capital (new member admission, also requires unanimous approval)
  - (c) Reduce the capital call amount

**Anti-Dilution Protection:**
- If one member funds a capital call and another does not, the funding member receives additional equity proportional to their excess contribution
- This creates natural accountability: if you cannot fund, your ownership shrinks

---

## 8. COMPENSATION FRAMEWORK

### When Can Founders Take Salary?

Founders should NOT take salary until PleoChrome has sufficient revenue to cover operating costs AND salary, with a runway buffer. Paying salary from contributed capital is burning equity for living expenses rather than building the business.

**Milestone-Based Salary Activation:**

| Milestone | Salary Eligibility | Rationale |
|-----------|-------------------|-----------|
| **Entity formed, pre-revenue** | No salary. All effort is sweat equity. | Cash is needed for legal, insurance, and infrastructure. Every dollar spent on salary is a dollar not spent on getting the first token sold. |
| **First investor closes ($500K+ raised)** | Members may take a modest stipend ($2,000-4,000/month each) from the setup fee revenue | The setup fee (~$193K) provides a revenue base. Stipends acknowledge full-time effort while preserving capital. |
| **$2M+ raised, positive monthly cash flow** | Members may take market-rate salary (discounted 30-50% from market) | Revenue is established and recurring admin fees are generating cash flow. Discounted salary acknowledges the equity upside. |
| **$5M+ raised, 6+ months positive cash flow** | Members may take full market-rate salary | Business is proven. Revenue supports operations, overhead, and founder compensation. |
| **Second asset closed, $10M+ AUM** | Full market-rate salary + performance bonuses | Growth stage. Company can afford competitive compensation. |

**Market-Rate Salary Benchmarks (for comparison, NOT for Day 1):**

| Role | Early Stage Fintech (Series Seed/A) | Adjusted for PleoChrome (3-person startup) |
|------|-------------------------------------|-------------------------------------------|
| CEO | $150,000-250,000 | $100,000-150,000 |
| CTO/COO | $140,000-220,000 | $90,000-130,000 |
| CRO | $130,000-200,000 | $85,000-120,000 |

**Note:** These salary levels are only relevant AFTER the $5M+ milestone. Before that, the numbers above are academic. The priority is preserving capital for business operations.

### Equity vs. Cash Compensation Tradeoffs

At different stages, the optimal compensation mix shifts:

| Stage | Cash | Equity | Logic |
|-------|------|--------|-------|
| **Pre-revenue** | 0% | 100% (founding equity) | Cash is scarce. Equity is abundant. All work is investment in the future. |
| **First revenue ($500K raised)** | 20-30% of market (stipend) | Founding equity (vesting) | Cash begins flowing but must be conserved. Equity provides the primary incentive. |
| **Growth ($2-5M raised)** | 50-70% of market | Founding equity (vesting continues) | Revenue supports partial salary. Equity remains the dominant incentive but founders need to pay mortgages. |
| **Scale ($5M+ raised, 2+ assets)** | 80-100% of market | Founding equity (fully vested or near) + performance equity grants | Business is proven. Competitive salary attracts and retains talent (including founders). Performance equity aligns incentives with growth. |

### Advisory Board Compensation Norms

Industry standard for startup advisory boards:

| Engagement Level | Equity Grant | Vesting | Cash |
|-----------------|-------------|---------|------|
| **Light touch** (quarterly calls, email availability) | 0.10-0.25% | 2 years, quarterly | None |
| **Active advisor** (monthly calls, introductions, strategic input) | 0.25-0.50% | 2 years, quarterly | None or $500-1,000/meeting |
| **Heavy engagement** (weekly involvement, board meetings, hands-on mentorship) | 0.50-1.00% | 2-3 years, quarterly | $1,000-2,500/month |

**For PleoChrome:** Target the "Active advisor" tier. Offer 0.25-0.50% equity vesting over 2 years with no cash compensation until PleoChrome is cash-flow positive. Advisors who demand cash upfront are not aligned with the startup's risk-reward profile.

**Total advisory pool:** Reserve 2-3% of equity for the advisory board (all advisors combined). This is a standard allocation that leaves ample room for the founding team while providing meaningful incentive for advisors.

### When to Hire Employees vs. Contractors

**Use Contractors When:**
- The engagement is project-based with a defined deliverable (e.g., smart contract audit, PPM drafting, website design)
- The skill is needed part-time or intermittently (e.g., fractional CFO, compliance consultant)
- The skill is highly specialized and PleoChrome cannot afford a full-time expert (e.g., Chainlink external adapter developer)
- The engagement is exploratory and may not continue (e.g., testing a new marketing channel)

**Hire Employees When:**
- The role requires 30+ hours per week of ongoing work
- The person needs access to sensitive systems and data on a daily basis
- The role involves judgment calls that require deep institutional knowledge (not just task execution)
- PleoChrome needs to control HOW the work is done, not just WHAT is done (IRS classification test)
- The cost of contractor turnover and re-onboarding exceeds the cost of employment

**Practical Guidance for PleoChrome's First 12 Months:**

| Need | Employee or Contractor? | Why |
|------|------------------------|-----|
| Securities counsel | Contractor (law firm) | Project-based, specialized, episodic |
| Smart contract auditor | Contractor | Project-based, one-time per asset |
| Fractional CFO | Contractor | 10-15 hrs/month, specialized |
| Marketing designer | Contractor | Project-based, can use multiple freelancers |
| Website developer (beyond David) | Contractor | Project-based |
| Compliance officer | Contractor initially (fractional CCO), employee when 3+ SPVs | Part-time initially; grows into full-time |
| Investor relations | Employee when needed | Requires daily institutional knowledge, ongoing judgment |
| Operations analyst | Employee when needed | Needs deep system access, ongoing work |

---

## 9. WEEKLY/MONTHLY OPERATING CADENCE

### Weekly Team Meeting Agenda Template

**Meeting:** PleoChrome Weekly Sync
**When:** Every Monday, 9:00 AM ET
**Duration:** 45 minutes (strict)
**Format:** Video call (Google Meet)
**Required:** Shane, David, Chris

```
============================================================
PLEOCHROME WEEKLY SYNC
Date: _______________
Week #: _____ (counting from entity formation)
============================================================

SECTION 1: DASHBOARD REVIEW (5 minutes)
──────────────────────────────────────────
Shane presents:

  Cash Position
  ├── Bank balance: $__________
  ├── Outstanding commitments (next 30 days): $__________
  ├── Net available: $__________
  └── Months of runway at current burn: ____ months

  Revenue (once live)
  ├── Capital raised (cumulative): $__________
  ├── Fees earned this month: $__________
  └── Investors closed (cumulative): ____

  Pipeline (Chris reports)
  ├── Asset holders in conversation: ____
  ├── Assets in active intake: ____
  └── Investor leads generated this week: ____

SECTION 2: BLOCKERS AND RISKS (10 minutes)
──────────────────────────────────────────
Each person names their #1 blocker. Team discusses resolution.

  Shane's blocker: ________________________________
    Resolution / owner / deadline: _________________

  David's blocker: ________________________________
    Resolution / owner / deadline: _________________

  Chris's blocker: ________________________________
    Resolution / owner / deadline: _________________

  New risks identified: ____________________________

SECTION 3: LAST WEEK REVIEW (5 minutes)
──────────────────────────────────────────
Each person: 3 things committed, 3 things delivered (or not, and why)

  Shane:
  1. Committed: ____________  Delivered: [Y/N]  If N, why: ___
  2. Committed: ____________  Delivered: [Y/N]  If N, why: ___
  3. Committed: ____________  Delivered: [Y/N]  If N, why: ___

  David:
  1. Committed: ____________  Delivered: [Y/N]  If N, why: ___
  2. Committed: ____________  Delivered: [Y/N]  If N, why: ___
  3. Committed: ____________  Delivered: [Y/N]  If N, why: ___

  Chris:
  1. Committed: ____________  Delivered: [Y/N]  If N, why: ___
  2. Committed: ____________  Delivered: [Y/N]  If N, why: ___
  3. Committed: ____________  Delivered: [Y/N]  If N, why: ___

SECTION 4: THIS WEEK'S COMMITMENTS (10 minutes)
──────────────────────────────────────────
Each person commits to exactly 3 priorities for the week.
These must be specific and measurable.

  Shane:
  1. ______________________________________________ by [day]
  2. ______________________________________________ by [day]
  3. ______________________________________________ by [day]

  David:
  1. ______________________________________________ by [day]
  2. ______________________________________________ by [day]
  3. ______________________________________________ by [day]

  Chris:
  1. ______________________________________________ by [day]
  2. ______________________________________________ by [day]
  3. ______________________________________________ by [day]

SECTION 5: DECISIONS NEEDED (10 minutes)
──────────────────────────────────────────
List any decisions that require group input.

  Decision 1: ____________________________________
    Options: A) __________ B) __________ C) __________
    Analysis: ____________________________________
    Decision: __________ (or defer to [date])

  Decision 2: ____________________________________
    Options: A) __________ B) __________
    Decision: __________

SECTION 6: EXTERNAL PARTNER STATUS (5 minutes)
──────────────────────────────────────────
Quick status update on each active external relationship.

  Securities Counsel:    [ ] On track  [ ] At risk  [ ] Blocked
    Update: ____________________________________________

  Brickken:              [ ] On track  [ ] At risk  [ ] Blocked
    Update: ____________________________________________

  Chainlink:             [ ] On track  [ ] At risk  [ ] Blocked
    Update: ____________________________________________

  Broker-Dealer:         [ ] On track  [ ] At risk  [ ] Blocked
    Update: ____________________________________________

  Vault Provider:        [ ] On track  [ ] At risk  [ ] Blocked
    Update: ____________________________________________

  GIA / Appraisers:      [ ] On track  [ ] At risk  [ ] Blocked
    Update: ____________________________________________

  Insurance:             [ ] On track  [ ] At risk  [ ] Blocked
    Update: ____________________________________________

──────────────────────────────────────────
NEXT MEETING: Monday, __________, 9:00 AM ET
Notes taken by: __________
============================================================
```

### Monthly Board/Partner Review Template

**Meeting:** PleoChrome Monthly Review
**When:** First Wednesday of each month, 10:00 AM ET
**Duration:** 90 minutes
**Format:** Video call with screen-share (prepared slides or dashboard)
**Required:** Shane, David, Chris
**Optional:** Advisory board members (quarterly, see below)

```
============================================================
PLEOCHROME MONTHLY REVIEW
Month: _______________  |  Date: _______________
============================================================

PART 1: FINANCIAL REVIEW (20 minutes)
──────────────────────────────────────────
Presented by: Shane

  1.1 INCOME STATEMENT (Month)
  ┌──────────────────────────────┬──────────┬──────────┬──────────┐
  │ Line Item                    │ Budget   │ Actual   │ Variance │
  ├──────────────────────────────┼──────────┼──────────┼──────────┤
  │ Setup fees earned            │          │          │          │
  │ Success fees earned          │          │          │          │
  │ Annual admin fees earned     │          │          │          │
  │ TOTAL REVENUE                │          │          │          │
  ├──────────────────────────────┼──────────┼──────────┼──────────┤
  │ Legal & compliance           │          │          │          │
  │ Insurance                    │          │          │          │
  │ Technology (Brickken, infra) │          │          │          │
  │ Vault & custody              │          │          │          │
  │ Marketing                    │          │          │          │
  │ G&A                          │          │          │          │
  │ TOTAL EXPENSES               │          │          │          │
  ├──────────────────────────────┼──────────┼──────────┼──────────┤
  │ NET INCOME (LOSS)            │          │          │          │
  └──────────────────────────────┴──────────┴──────────┴──────────┘

  1.2 CASH POSITION
  ├── Opening balance: $__________
  ├── Inflows: $__________
  ├── Outflows: $__________
  ├── Closing balance: $__________
  └── Runway (months at current burn): ____ months

  1.3 CAPITAL CALL STATUS
  ├── Total contributed to date: $__________ (Shane $___ / David $___ / Chris $___)
  ├── Remaining commitment: $__________
  └── Next anticipated call: $__________ by [date]

PART 2: PIPELINE AND REVENUE REVIEW (20 minutes)
──────────────────────────────────────────
Presented by: Chris (assets) and Shane (investors)

  2.1 ASSET PIPELINE
  ┌────────────────┬──────────┬─────────────┬───────────┬──────────┐
  │ Asset          │ Stage    │ Est. Value  │ Next Step │ ETA      │
  ├────────────────┼──────────┼─────────────┼───────────┼──────────┤
  │                │          │             │           │          │
  │                │          │             │           │          │
  │                │          │             │           │          │
  └────────────────┴──────────┴─────────────┴───────────┴──────────┘

  2.2 INVESTOR PIPELINE
  ┌────────────────┬──────────┬─────────────┬───────────┬──────────┐
  │ Investor       │ Stage    │ Est. Invest │ Next Step │ ETA      │
  ├────────────────┼──────────┼─────────────┼───────────┼──────────┤
  │                │          │             │           │          │
  │                │          │             │           │          │
  │                │          │             │           │          │
  └────────────────┴──────────┴─────────────┴───────────┴──────────┘

  2.3 REVENUE METRICS
  ├── AUM (total assets under management): $__________
  ├── Investors (total): ____
  ├── Capital raised (cumulative): $__________
  ├── Revenue (cumulative): $__________
  └── Revenue run rate (annualized): $__________

PART 3: TECHNOLOGY AND OPERATIONS REVIEW (15 minutes)
──────────────────────────────────────────
Presented by: David

  3.1 PLATFORM STATUS
  ├── Brickken: [ ] Operational  [ ] Issue  [ ] Down
  ├── Chainlink PoR: [ ] Operational  [ ] Issue  [ ] Down
  ├── Website: [ ] Operational  [ ] Issue  [ ] Down
  ├── Investor Portal: [ ] Operational  [ ] Issue  [ ] Down
  └── Uptime (30-day): ____%

  3.2 SECURITY
  ├── Security incidents this month: ____
  ├── Vulnerability scans: [ ] Current  [ ] Overdue
  ├── Key management: [ ] Compliant  [ ] Issue
  └── Access reviews: [ ] Current  [ ] Overdue

  3.3 OPERATIONAL METRICS
  ├── Investor onboardings processed: ____
  ├── KYC clearance rate: ____%
  ├── Average onboarding time (days): ____
  ├── Sanctions screenings completed: ____
  └── Outstanding operational items: ____

PART 4: COMPLIANCE AND RISK REVIEW (15 minutes)
──────────────────────────────────────────
Presented by: Shane (as Compliance Officer)

  4.1 REGULATORY STATUS
  ├── Form D: [ ] Filed  [ ] Current  [ ] Amendment needed
  ├── Blue sky filings: ____ states filed / ____ states needed
  ├── AML/KYC policy: [ ] Current  [ ] Review needed
  ├── Sanctions screening: [ ] Current  [ ] Overdue
  └── Regulatory changes to monitor: ________________________________

  4.2 INSURANCE STATUS
  ├── D&O: [ ] Active  │ Expiry: __________  │ Limit: $__________
  ├── E&O: [ ] Active  │ Expiry: __________  │ Limit: $__________
  ├── Cyber: [ ] Active │ Expiry: __________  │ Limit: $__________
  ├── GL: [ ] Active   │ Expiry: __________  │ Limit: $__________
  └── Specie: [ ] Active│ Expiry: __________  │ Limit: $__________

  4.3 RISK REGISTER (Top 5)
  ┌──────────────────────────┬──────────┬──────────┬──────────────────┐
  │ Risk                     │ Severity │ Status   │ Mitigation       │
  ├──────────────────────────┼──────────┼──────────┼──────────────────┤
  │                          │          │          │                  │
  │                          │          │          │                  │
  │                          │          │          │                  │
  │                          │          │          │                  │
  │                          │          │          │                  │
  └──────────────────────────┴──────────┴──────────┴──────────────────┘

PART 5: STRATEGIC DISCUSSION (15 minutes)
──────────────────────────────────────────
  5.1 Key strategic questions for this month:
      ________________________________________________
      ________________________________________________

  5.2 Competitive landscape changes:
      ________________________________________________

  5.3 Partnership opportunities:
      ________________________________________________

PART 6: ACTION ITEMS (5 minutes)
──────────────────────────────────────────
  ┌──────────────────────────────────┬──────────┬──────────┐
  │ Action Item                      │ Owner    │ Due Date │
  ├──────────────────────────────────┼──────────┼──────────┤
  │                                  │          │          │
  │                                  │          │          │
  │                                  │          │          │
  │                                  │          │          │
  │                                  │          │          │
  └──────────────────────────────────┴──────────┴──────────┘

──────────────────────────────────────────
NEXT MONTHLY REVIEW: __________, 10:00 AM ET
============================================================
```

### Quarterly Strategic Review

**Meeting:** PleoChrome Quarterly Strategic Review
**When:** Third Wednesday of March, June, September, December
**Duration:** 3 hours (with 15-minute break)
**Format:** In-person preferred (Naples, FL or Charlotte, NC, rotating); video if necessary
**Required:** Shane, David, Chris
**Invited:** Advisory board members (this is their quarterly engagement commitment)

**Quarterly Review Agenda:**

```
============================================================
PLEOCHROME QUARTERLY STRATEGIC REVIEW
Quarter: Q__ 20__  |  Date: _______________
============================================================

HOUR 1: LOOK BACK (60 minutes)
──────────────────────────────────────────

  1. Financial Performance vs. Plan (15 min)
     - Revenue vs. budget
     - Expenses vs. budget
     - Cash position vs. projection
     - Capital call status

  2. Milestone Achievement (15 min)
     - Which quarterly milestones were hit?
     - Which were missed? Why?
     - Revised timeline for missed milestones

  3. Team Performance (15 min)
     - Each founder self-assesses: What went well? What needs improvement?
     - Peer feedback (constructive, specific, actionable)
     - Bandwidth assessment: Is anyone overloaded or underutilized?

  4. Partner Performance (15 min)
     - Securities counsel: quality, responsiveness, cost
     - Brickken: platform reliability, support quality
     - Chainlink: program engagement, technical support
     - BD: compliance review speed, investor support quality
     - Vault: custody reliability, reporting quality, cost

── 15-MINUTE BREAK ──

HOUR 2: LOOK FORWARD (60 minutes)
──────────────────────────────────────────

  5. Market and Competitive Landscape (15 min)
     - New competitors or competitive offerings
     - Regulatory changes (SEC, FinCEN, state)
     - Technology changes (blockchain, tokenization platforms)
     - Market conditions (gemstone market, alternative investments, crypto)

  6. Next Quarter Priorities (20 min)
     - Top 3 company-level priorities for Q+1
     - Top 3 priorities per founder
     - Resource allocation: Where should we invest more? Less?

  7. Strategic Questions (15 min)
     - Should we expand to new asset types? When?
     - Should we hire? Who, and funded how?
     - Should we raise external capital? When and how much?
     - Should we change our fee structure based on market feedback?

  8. Budget and Cash Plan for Next Quarter (10 min)
     - Projected revenue
     - Planned expenses
     - Capital call needs (if any)
     - Contingency reserves

HOUR 3: ADVISORY INPUT + DOCUMENTATION (45 minutes)
──────────────────────────────────────────

  9. Advisory Board Discussion (30 min) [when advisors present]
     - Advisor reactions to quarterly performance
     - Advisor recommendations on strategy
     - Advisor introductions and connections to offer
     - Advisor concerns or red flags

  10. Document and Assign (15 min)
      - Summarize all decisions made
      - Assign all action items with owners and deadlines
      - Update strategic plan document
      - Schedule next quarterly review

============================================================
```

### Communication Tools and Norms

| Tool | Purpose | Expected Response Time |
|------|---------|----------------------|
| **Google Chat / Slack** (choose one) | Day-to-day team communication, quick questions, status updates | Within 4 business hours |
| **Email** (pleochrome.com addresses) | External communications, formal internal communications, decisions that need a paper trail | Within 24 business hours |
| **Google Meet** | All scheduled meetings (weekly sync, monthly review, partner calls) | As scheduled |
| **Phone Call** | Urgent matters that cannot wait for chat/email response | Immediate (pick up or return within 1 hour) |
| **Text Message** | Emergency only (system down, security incident, legal emergency) | Immediate |
| **Google Drive** | All document storage, collaboration, and version control | N/A (async) |
| **GitHub** | Code and technical documentation | N/A (async) |

**Communication Norms:**

1. **No surprises rule.** If something goes wrong -- a partner pulls out, an investor backs off, a legal issue surfaces, a system breaks -- the person who discovers it tells the team IMMEDIATELY. Not at the next weekly meeting. Immediately.

2. **Written decisions.** Every material decision is documented in writing (email or Google Doc) within 24 hours of being made. The documentation includes: what was decided, why, who voted how, and what the next action is.

3. **48-hour document review.** When one team member sends a document for review (PPM section, partner agreement, SOP), the other members have 48 hours to review and comment. If no comments in 48 hours, the document is deemed approved. This prevents review bottlenecks.

4. **Weekly written updates.** In addition to the Monday sync, each team member posts a written update to the shared channel every Friday by 5 PM ET:
   - 3 things accomplished this week
   - 3 things planned for next week
   - 1 blocker or concern (or "none")
   This creates an asynchronous record that supplements the live meeting.

5. **External communication authority.** Only Shane sends communications to investors and institutional partners (BD, counsel, Chainlink, Brickken) unless that function has been explicitly delegated. David communicates with technical partners (Brickken support, vault IT, GIA lab). Chris communicates with asset holders and appraiser candidates. Nobody freelances communications outside their domain.

6. **Confidentiality.** Nothing about PleoChrome's internal operations, financials, team dynamics, legal strategy, or pipeline is shared with anyone outside the team without the explicit approval of at least two members. This includes casual conversations at industry events.

---

## APPENDIX A: GOVERNANCE CALENDAR (ANNUAL VIEW)

| Frequency | Activity | Owner | Participants |
|-----------|----------|-------|-------------|
| **Weekly** | Monday team sync (45 min) | Shane (chairs) | All three |
| **Weekly** | Friday written update | Each founder | All three (read) |
| **Monthly** | Monthly review (90 min) | Shane (chairs) | All three |
| **Monthly** | Financial reconciliation | Shane | David (data support) |
| **Monthly** | Insurance and compliance checklist | David | Shane (reviews) |
| **Quarterly** | Strategic review (3 hours) | Shane (chairs) | All three + advisors |
| **Quarterly** | Sanctions re-screening | David | Shane (oversight) |
| **Quarterly** | Investor quarterly report | David (prepares) | Shane (approves + distributes) |
| **Annually** | Operating Agreement review | Shane + counsel | All three |
| **Annually** | Insurance renewal | David | Shane (approval) |
| **Annually** | Independent compliance audit | External auditor | Shane + David |
| **Annually** | Re-appraisal coordination (per asset) | David | Shane (approval) |
| **Annually** | K-1 preparation and distribution | CPA | Shane + David |
| **Annually** | Wyoming annual report filing | David | Shane (verification) |
| **Annually** | Board of Advisors renewal/recruitment | Shane | All three |
| **Annually** | Key-person insurance review | David | Shane (approval) |
| **Annually** | Team compensation review | Shane | All three |

---

## APPENDIX B: FIRST 90-DAY GOVERNANCE CHECKLIST

Before PleoChrome processes its first asset, these governance items must be complete:

- [ ] Wyoming LLC filed with Secretary of State
- [ ] Registered agent designated and confirmed
- [ ] EIN obtained from IRS
- [ ] Business bank account opened and funded
- [ ] Operating Agreement drafted by counsel, reviewed by all three members, and executed
- [ ] IP Assignment agreements signed by all three members
- [ ] Non-compete/non-solicit agreements signed by all three members
- [ ] Compliance Officer designated (Shane, initially)
- [ ] AML/KYC Policy drafted and adopted (board resolution)
- [ ] OFAC/SDN screening completed on all three founders
- [ ] D&O insurance bound
- [ ] E&O insurance bound
- [ ] Cyber liability insurance bound
- [ ] Key-person life insurance applied for (all three founders)
- [ ] Google Workspace DKIM configured and verified
- [ ] Advisory board recruiting initiated (minimum 2 advisors by Day 90)
- [ ] Advisory agreements drafted (template approved by counsel)
- [ ] Weekly sync meeting established and first meeting held
- [ ] Communication norms document distributed and acknowledged by all three members
- [ ] Capital contribution schedule agreed and initial contributions funded
- [ ] Financial tracking system established (QuickBooks, Xero, or equivalent)
- [ ] Conflicts of interest policy adopted (each founder discloses outside business interests)
- [ ] Document retention policy adopted (7-year minimum for securities records)
- [ ] Incident response plan drafted (smart contract, security, compliance, legal)

---

## APPENDIX C: FOUNDER CONFLICT RESOLUTION PROTOCOL

When founders disagree on a material issue, the following protocol applies:

**Level 1: Discussion (Day 1)**
- State the disagreement clearly in writing (Google Doc or email)
- Each person writes their position and rationale (maximum 1 page each)
- All three read all positions before discussing

**Level 2: Structured Debate (Day 2-3)**
- 30-minute meeting dedicated solely to this issue
- Each person has 5 uninterrupted minutes to present their view
- 15 minutes of open discussion
- Attempt a vote (majority or unanimous, depending on the issue type)

**Level 3: Data Gathering (Day 4-7)**
- If no resolution, identify what additional information would resolve the disagreement
- Assign one person to gather that information within 5 business days
- Reconvene with the new data

**Level 4: Advisory Input (Day 8-14)**
- If still unresolved, present the issue to one or more advisory board members for input
- Advisor input is non-binding but may break the deadlock

**Level 5: Mediation (Day 15-21)**
- Engage a professional mediator (JAMS or AAA)
- 4-hour mediation session
- Mediator facilitates but does not decide

**Level 6: Arbitration (Day 22+)**
- If mediation fails, binding arbitration per the Operating Agreement
- Single arbitrator, chosen from JAMS panel by mutual agreement
- Decision is final and binding

**Critical Rule:** While any conflict resolution process above Level 2 is active, ALL THREE FOUNDERS must continue performing their regular duties in good faith. Disagreement on one issue does not justify disengagement from operations.

---

**END OF DOCUMENT**

*This document should be reviewed and discussed by all three founders before entity formation. Key provisions (especially equity split, vesting, decision authority, and departure terms) must be finalized in the Operating Agreement drafted by securities counsel.*

*This strategy document is internal guidance for the founding team. It is NOT a legal document and does NOT constitute legal advice. All legal provisions described herein must be implemented through properly drafted legal agreements reviewed by qualified counsel.*

*Document classification: CONFIDENTIAL -- Founding Team Only*
*Last updated: March 19, 2026*
