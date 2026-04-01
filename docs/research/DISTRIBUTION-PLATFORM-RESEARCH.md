# Tokenized Securities Distribution Platform Research

**Purpose:** Exhaustive research on every platform, ATS, broker-dealer, and token distributor that could work with PleoChrome for distributing tokenized gemstone-backed digital securities (ERC-3643 on Polygon, Reg D 506(c)).

**Date:** March 19, 2026

---

## Table of Contents

1. [Why PleoChrome Needs a Broker-Dealer](#part-1-why-pleochrome-needs-a-broker-dealer)
2. [Tier 1: Full-Stack Regulated Platforms (BD + ATS + Transfer Agent)](#part-2-tier-1-full-stack-regulated-platforms)
3. [Tier 2: ATS-Only or BD-Only Platforms](#part-3-tier-2-ats-only-or-bd-only-platforms)
4. [Tier 3: Tokenization Infrastructure (No BD/ATS License)](#part-4-tier-3-tokenization-infrastructure)
5. [Tier 4: International Platforms](#part-5-tier-4-international-platforms)
6. [Tier 5: Emerging / Niche Platforms](#part-6-tier-5-emerging-niche-platforms)
7. [ERC-3643 Ecosystem](#part-7-erc-3643-ecosystem)
8. [Recent Regulatory Landscape (2025-2026)](#part-8-recent-regulatory-landscape)
9. [PleoChrome-Specific Recommendations](#part-9-pleochrome-specific-recommendations)
10. [Comparison Matrix](#part-10-comparison-matrix)

---

## Part 1: Why PleoChrome Needs a Broker-Dealer

### What a Broker-Dealer Actually Does in This Context

A broker-dealer (BD) is a firm registered with the SEC and FINRA that is authorized to buy and sell securities on behalf of customers (broker) and/or for its own account (dealer). In the context of PleoChrome's tokenized gemstone-backed securities under Reg D 506(c):

**Primary Issuance (Capital Raising):**
- The BD acts as "placement agent" or "broker-dealer of record" for PleoChrome's offering
- They conduct due diligence on the offering (reviewing the PPM, financials, risk factors)
- They verify that all investors are accredited (required under 506(c))
- They handle anti-money laundering (AML) and know-your-customer (KYC) checks
- They submit the offering materials to FINRA for review (Form 5123 filing within 15 days of first sale)
- They ensure advertising and solicitation materials comply with FINRA rules
- They maintain books and records of the offering
- They may actively solicit investors (selling the securities) or simply serve as BD of record

**Secondary Trading:**
- An ATS (Alternative Trading System) provides a venue where existing token holders can sell to new buyers
- The ATS operator must be a registered BD
- The ATS handles order matching, settlement, and compliance checks on every trade
- For ERC-3643 tokens, the ATS must integrate with the on-chain compliance layer

**Custody:**
- BDs can custody tokenized securities (confirmed by SEC December 2025 guidance)
- They must maintain policies and procedures for private key management
- They must comply with Rule 15c3-3 (Customer Protection Rule)

**Transfer Agent:**
- Maintains the official record of who owns what
- Processes transfers between holders
- Handles corporate actions (dividends, votes, etc.)
- For tokenized securities, the on-chain record IS the cap table

### Why PleoChrome Cannot Skip This

1. **Legal requirement:** Under U.S. securities law, anyone who effects transactions in securities for the account of others must register as a broker-dealer. PleoChrome is offering securities (tokenized gemstone interests under Reg D 506(c)). Without a BD, PleoChrome cannot legally sell these tokens to investors.

2. **General solicitation:** Reg D 506(c) permits general solicitation (advertising), but FINRA members selling under 506(c) must follow FINRA communication rules and file materials. A BD of record ensures compliance.

3. **Accredited investor verification:** Under 506(c), the issuer must take "reasonable steps" to verify accredited status. As of March 2025, the SEC clarified that self-certification is acceptable when investors meet minimum investment thresholds, but a BD typically handles this process through established verification services (e.g., VerifyInvestor, which tZERO owns).

4. **Investor protection:** BDs are members of SIPC, providing limited investor protection. This is a trust signal for accredited investors.

5. **Secondary liquidity:** Without an ATS, token holders have no regulated venue to sell. Liquidity is a major selling point for tokenized securities vs. traditional private placements.

### What It Costs

Broker-dealer engagement costs vary significantly based on the model:

**Broker-Dealer of Record (Compliance-Only Model):**
- Setup/onboarding fee: $5,000 - $55,000 (one-time)
- Consulting fee: $15,000 - $25,000 (one-time, after FINRA review)
- Success fee on capital raised: 1% - 3% of gross proceeds
- FINRA filing fees: $300 base + 0.008% of offering proceeds (capped at $40,300 for offerings over $25M)
- Example: Dalmore Group charges ~1% on aggregate raised + $55,000 setup, or in some agreements 3% in specific states + $5,000 expenses

**Full-Service Placement Agent (Active Selling):**
- Placement fee: 5% - 10% of gross proceeds (typical range)
- Due diligence reimbursement: $10,000 - $50,000
- Equity kicker: Sometimes warrants or token allocation
- Industry standard for private placements: total front-end costs around 10-12% of gross proceeds (NASAA/FINRA guidelines cap at 10% for underwriting compensation, 15% for front-end load)

**ATS Listing (for Secondary Trading):**
- Listing fees vary by platform (most negotiate custom pricing)
- Transaction fees: 0% - 7% per trade (tZERO charges up to 7% on primary; has offered zero-fee trading for registered digital securities on secondary)
- Annual maintenance: varies

**Transfer Agent:**
- Setup: $5,000 - $25,000
- Annual maintenance: $5,000 - $20,000/year
- Per-transaction fees for transfers and corporate actions

**All-in Estimate for PleoChrome's First Offering:**
- Legal (PPM, subscription docs, Form D): $50,000 - $150,000 (separate from BD)
- BD of record + FINRA compliance: $25,000 - $75,000 upfront + 1-3% of raise
- Transfer agent: $10,000 - $25,000/year
- ATS listing for secondary: negotiated, typically $10,000 - $50,000 setup
- Total first-year infrastructure: roughly $100,000 - $300,000+ depending on raise size

### How to Engage One

1. **Identify candidates** (this document)
2. **Initial outreach:** Most platforms have "Talk to Sales" or "Partnership" forms on their websites
3. **NDA and due diligence:** The BD will want to understand your offering, business plan, and team
4. **BD due diligence on the offering:** The BD reviews your PPM, legal opinions, and compliance framework
5. **Engagement letter:** Defines scope, fees, and responsibilities
6. **FINRA filing:** BD files Form 5123 (private placement notice) within 15 days of first sale
7. **Form D filing:** PleoChrome files Form D with SEC within 15 days of first sale (can be filed without a BD, but BD helps ensure accuracy)
8. **Blue sky filings:** State-level notice filings (most states accept federal 506(c) preemption)

---

## Part 2: Tier 1 -- Full-Stack Regulated Platforms (BD + ATS + Transfer Agent)

These are the "one-stop shop" providers. They handle everything: tokenization, primary issuance, compliance, transfer agent, and secondary trading. They are the most relevant to PleoChrome.

---

### 1. Securitize (and Securitize Markets ATS)

**Website:** https://securitize.io

**What They Do:** The leading vertically integrated tokenization platform. SEC-registered broker-dealer, digital transfer agent, fund administrator, investment advisor, and ATS operator. The ONLY firm with all five SEC registrations under one roof.

**RWA / Asset-Backed Tokens:** Yes -- core business. $4B+ AUM as of October 2025. Tokenized funds for BlackRock (BUIDL), Apollo (ACRED), Hamilton Lane, KKR, VanEck, and others.

**ERC-3643 Support:** Securitize uses its own proprietary token standard (DS Protocol) rather than ERC-3643. However, as a platform, they can potentially support ERC-3643 tokens through custom integration. Their focus is on their own end-to-end stack.

**Regulatory Status:**
- SEC-registered broker-dealer
- SEC-registered transfer agent
- SEC-registered investment advisor
- SEC-regulated ATS operator
- Fund administrator
- Going public in H1 2026 via SPAC at $1.25B valuation (Cantor Equity Partners II)
- EU-licensed (MiFID II) as of late 2025

**Blockchains Supported:** Ethereum, Polygon, Avalanche, Solana, Aptos, Arbitrum, Optimism, Ink, BNB Chain (via Wormhole interoperability)

**Notable Deals:**
- BlackRock BUIDL fund ($500M+)
- Apollo ACRED fund
- Hamilton Lane tokenized funds
- KKR tokenized fund
- BNY tokenized AAA CLO fund

**Contact:** https://securitize.io -- "Get Started" / "Talk to Us" forms. HQ: 78 SW 7th Street, Suite 500, Miami, FL 33130

**Pricing:** Custom enterprise pricing. Annual platform access + technology fees. Transfer agent SaaS revenue based on tokenization fee. Not publicly listed -- must contact for quote.

**Primary / Secondary / Both:** Both. Full lifecycle from issuance through secondary trading.

**Geographic Coverage:** US (primary), EU (MiFID II license), global distribution capability.

**PleoChrome Fit:** STRONG -- but Securitize is geared toward large institutional asset managers ($100M+ AUM). PleoChrome's gemstone offering may be too small or too niche for Securitize's current focus. Worth exploring, but may face high minimums and enterprise pricing that doesn't suit a startup.

---

### 2. tZERO (tZERO Securities ATS)

**Website:** https://www.tzero.com

**What They Do:** SEC-registered broker-dealer, ATS operator, transfer agent, and clearing firm for tokenized securities. One of the oldest and largest digital securities platforms.

**RWA / Asset-Backed Tokens:** Yes. Real estate, private equity, art, corporate equity. Supports tokenized equities, debt, funds, derivatives, and RWAs.

**ERC-3643 Support:** Yes. tZERO has confirmed it is "able to support ERC-3643 digital asset securities on its end-to-end broker-dealer operated platform for primary issuances and secondary trading."

**Regulatory Status:**
- SEC-registered broker-dealer (FINRA/SIPC member)
- SEC-regulated ATS operator
- SEC-registered transfer agent
- Planning 2026 IPO
- FINRA approval to offer retail access to tokenized mutual funds (December 2025)

**Blockchains Supported:** Ethereum, Tezos, Avalanche, Stellar, XDC, Algorand. Launching tZERO Chain (proprietary L1). Polygon is NOT currently listed among supported chains, though multi-chain expansion is ongoing.

**Notable Deals:**
- TZROP (own equity token)
- Uphold partnership (December 2025)
- AGORACOM partnership for public company asset tokenization
- Agora network with North Capital (ATS-to-ATS connectivity)

**Contact:** https://www.tzero.com/tokenize -- "Let's Talk" form for issuers.

**Pricing:**
- Primary issuance: up to 7% processing fee on investor commitments + consulting fee + due diligence reimbursement + percentage of funds raised
- Secondary trading: zero-fee trading for registered digital securities; private securities retain previous fee structure
- Transfer agent: included in platform

**Primary / Secondary / Both:** Both. Full lifecycle.

**Geographic Coverage:** US-focused, with global expansion plans. 23.5-hour trading on business days.

**PleoChrome Fit:** STRONG. tZERO explicitly supports ERC-3643 and is more accessible than Securitize for mid-market issuers. Their tZERO Connect API infrastructure launched in late 2025 enables programmatic access. The Polygon chain gap is a consideration -- PleoChrome may need to bridge from Polygon or negotiate chain support. Worth a serious conversation.

---

### 3. Republic / INX (Combined Platform)

**Website:** https://republic.com | https://www.inx.co

**What They Do:** Republic acquired INX in November 2025 for $60M, creating a full-stack platform covering origination, tokenization, primary distribution, and secondary trading.

**RWA / Asset-Backed Tokens:** Yes. Republic has a tokenization division and has offered tokenized assets including real estate, private equity, and digital securities.

**ERC-3643 Support:** Not explicitly confirmed. INX's ATS supports digital securities but specific ERC-3643 compatibility is unclear.

**Regulatory Status:**
- INX Securities, LLC: SEC-registered BD, FINRA/SIPC member, ATS operator
- INX was the first ATS to execute a digital securities trade (November 2018, as Openfinance Securities)
- INX Limited: first registered digital security deemed effective by SEC (F-1 registration, 2021)
- Republic: crowdfunding platform operator (Reg CF, Reg A+, Reg D)

**Blockchains Supported:** Ethereum (primary for INX token). Multi-chain plans post-merger.

**Notable Deals:**
- INX Token (first SEC-registered digital security)
- OpenFinance Securities acquisition
- Republic Digital Acquisition SPAC ($336M IPO, May 2025)

**Contact:** https://republic.com/tokenization -- partnership inquiries. Republic has existing relationships with 2.5M+ investors.

**Pricing:** Custom. Republic typically takes success fees on capital raised.

**Primary / Secondary / Both:** Both. Republic handles primary crowdfunding/Reg D, INX provides secondary ATS.

**Geographic Coverage:** US and global (INX has Israeli origins, Republic has UK presence).

**PleoChrome Fit:** MODERATE. Republic's investor network (2.5M+) is very attractive for distribution. However, the platform is mid-merger and integration is still underway (visible changes expected late Q1/early Q2 2026). The crowdfunding DNA may not align with PleoChrome's accredited-only 506(c) approach, though Republic does support Reg D offerings.

---

### 4. Prometheum

**Website:** https://www.prometheum.com

**What They Do:** Full lifecycle blockchain securities infrastructure -- capital formation, tokenization, secondary trading, custody, clearing, settlement through SEC-registered and FINRA-member affiliates.

**RWA / Asset-Backed Tokens:** Yes. Positioning to support tokenized assets, crypto securities, and on-chain securities.

**ERC-3643 Support:** Not explicitly stated. Uses blockchain-based securities infrastructure.

**Regulatory Status:**
- Prometheum ATS: SEC-registered ATS
- Prometheum Capital: SEC-registered special purpose broker-dealer for custody
- ProFinancial Inc.: SEC-registered and FINRA-member broker-dealer (acquired May 2025) for primary issuance
- Prometheum Coinery LLC: SEC-registered digital transfer agent (registered May 2025)
- Raised $23M additional in January 2026

**Blockchains Supported:** Ethereum (Ethereum Settlement Network integration mentioned).

**Notable Deals:** Early stage -- focusing on building out infrastructure. First firm to receive FINRA approval as special purpose broker-dealer for digital asset securities custody.

**Contact:** https://www.prometheum.com -- Media: Jon Brubaker, jbrubaker@prometheum.com

**Pricing:** Not publicly available. Enterprise/custom.

**Primary / Secondary / Both:** Both. ProFinancial handles primary issuance, Prometheum ATS handles secondary.

**Geographic Coverage:** US-focused.

**PleoChrome Fit:** MODERATE. Prometheum is building the right infrastructure, but is still early-stage. Their regulatory stack is impressive (they assembled all four licenses in 2025), but they don't yet have the track record of Securitize or tZERO. Could be a good fit for a startup-to-startup relationship where PleoChrome gets more attention.

---

### 5. Ondo Finance (via Oasis Pro acquisition)

**Website:** https://ondo.finance | https://oasispromarkets.com

**What They Do:** RWA tokenization platform that acquired Oasis Pro in October 2025, gaining SEC-registered BD, ATS, and transfer agent licenses.

**RWA / Asset-Backed Tokens:** Yes -- core business. Tokenized US Treasuries (USDY, OUSG), tokenized stocks and ETFs via Ondo Global Markets.

**ERC-3643 Support:** Not confirmed. Ondo uses its own token framework.

**Regulatory Status:**
- SEC-registered broker-dealer (via Oasis Pro)
- SEC-registered ATS operator (OATSPRO -- first US-regulated ATS for digital securities with stablecoin settlement)
- SEC-registered transfer agent (via Oasis Pro)
- $1.6B TVL by September 2025

**Blockchains Supported:** Multiple EVM chains. Oasis Pro was notable for allowing settlement in USDC and DAI (stablecoin settlement).

**Notable Deals:**
- Ondo Global Markets: $320M TVL by October 2025
- SWEEP fund: $200M seed capital from State Street and Galaxy Asset Management (launching 2026)
- Tokenized US Treasuries are a core product

**Contact:** https://ondo.finance -- Institutional inquiries.

**Pricing:** Not publicly available.

**Primary / Secondary / Both:** Both. Primary issuance and secondary ATS trading.

**Geographic Coverage:** US-focused, with global DeFi distribution.

**PleoChrome Fit:** LOW. Ondo is focused on institutional-grade treasury and equity products, not alternative assets like gemstones. Their infrastructure is built for high-volume, high-TVL products. PleoChrome would likely not be a priority client.

---

## Part 3: Tier 2 -- ATS-Only or BD-Only Platforms

These provide either secondary trading (ATS) or primary issuance (BD) services, but not the full stack. PleoChrome would use these in combination with other providers.

---

### 6. Dalmore Group (Broker-Dealer of Record)

**Website:** https://dalmoregroup.com

**What They Do:** FINRA-registered broker-dealer specializing in online capital formation. Serves as "broker-dealer of record" for Reg A+, Reg CF, and Reg D offerings. Does NOT operate an ATS.

**RWA / Asset-Backed Tokens:** Growing. Actively evaluating tokenization pathways for 2026. Currently focused on traditional securities offerings with digital delivery.

**ERC-3643 Support:** Not yet. Preparing tokenization capabilities for 2026.

**Regulatory Status:**
- FINRA-registered broker-dealer (CRD# 136352)
- $3B+ raised across 1,000+ offerings
- Integrates with multiple third-party ATSs for secondary trading

**Notable Deals:** 1,000+ Reg A+, Reg CF, and Reg D offerings. Largest independent BD of record for online capital formation.

**Contact:** https://dalmoregroup.com/broker-dealer-of-record -- inquiry form. Direct engagement through their website.

**Pricing (from SEC filings):**
- Setup fee: $5,000 - $55,000 (one-time)
- Consulting fee: ~$20,000 (after FINRA No Objection Letter)
- Success fee: 1% - 3% of gross proceeds raised
- FINRA filing fees: passed through to issuer

**Primary / Secondary / Both:** Primary only (BD of record). Refers secondary to ATS partners.

**Geographic Coverage:** US.

**PleoChrome Fit:** STRONG for primary issuance. Dalmore is the most accessible and cost-effective BD of record for Reg D 506(c) offerings. They specialize in working with smaller issuers and online offerings. However, they do not yet support tokenized securities directly -- PleoChrome would need a separate tokenization platform and ATS. Watch for their 2026 tokenization launch.

---

### 7. North Capital Private Securities (PPEX ATS)

**Website:** https://www.northcapital.com | https://www.ppex.com

**What They Do:** SEC-registered broker-dealer operating the PPEX Alternative Trading System for exempt securities, including digital asset securities. Also provides custody, escrow, and KYC/AML services.

**RWA / Asset-Backed Tokens:** Yes. PPEX ATS supports digital asset securities. Launched North Capital Token Services, LLC in February 2026 for tokenization of debt, equities, and private fund interests.

**ERC-3643 Support:** Not explicitly confirmed, but supports digital asset securities broadly.

**Regulatory Status:**
- SEC-registered broker-dealer (CRD# 154559)
- FINRA/SIPC member
- SEC-registered ATS operator (PPEX)
- Non-bank trustee for qualified accounts
- Active in digital asset securities since 2017

**Blockchains Supported:** Information not publicly detailed. Focus on multi-chain through Token Services subsidiary.

**Notable Deals:**
- Agora network partnership with tZERO (ATS-to-ATS routing for tokenized securities)
- Escrow partnership with Vertalo
- Submitted comments to SEC Crypto Task Force (May 2025)

**Contact:** https://www.northcapital.com/contact-us | https://www.ppex.com/contact-us

**Pricing:** Custom. Contact for quotes.

**Primary / Secondary / Both:** Both. BD services for primary, PPEX ATS for secondary. New Token Services subsidiary for tokenization.

**Geographic Coverage:** US.

**PleoChrome Fit:** STRONG. North Capital is mid-market, accessible, and actively building tokenization infrastructure. The PPEX ATS provides secondary trading, and the Agora network with tZERO expands liquidity. The new Token Services subsidiary (February 2026) suggests they are actively courting tokenized issuers. Worth a serious conversation.

---

### 8. Texture Capital

**Website:** https://www.texture.capital

**What They Do:** FINRA-member and SEC-registered broker-dealer operating an ATS for digital asset securities. Also operates Texture Transfer Services LLC (SEC-registered transfer agent).

**RWA / Asset-Backed Tokens:** Yes. Supports tokenized equity, debt, revenue share, royalties, and funds.

**ERC-3643 Support:** Not explicitly stated, but supports EVM-based digital securities.

**Regulatory Status:**
- SEC-registered broker-dealer
- FINRA member
- SEC-registered ATS operator
- SEC-registered transfer agent (Texture Transfer Services)
- Integrated with Canton Network (institutional blockchain) in January 2025

**Blockchains Supported:** Canton Network integration (institutional privacy-enabled blockchain). EVM-compatible chains.

**Notable Deals:**
- Intain partnership for structured finance (February 2025)
- T-RIZE Group partnership for US market liquidity
- Vertalo integration for cap table management

**Contact:** 59 Strong Pl, Brooklyn, New York, 11231. LinkedIn: linkedin.com/company/texture-capital

**Pricing:** Custom. Not publicly available.

**Primary / Secondary / Both:** Both. Supports Reg A, D, and CF for primary; ATS for secondary.

**Geographic Coverage:** US.

**PleoChrome Fit:** MODERATE. Texture Capital has the right licenses and serves the mid-market, but their focus on structured finance and institutional assets (Canton Network) may mean gemstones are not a natural fit. Still worth exploring given their flexibility with alternative asset types.

---

### 9. Rialto Markets

**Website:** https://rialtomarkets.com

**What They Do:** FINRA-member, SEC-registered broker-dealer and ATS for private securities in both traditional and digital form. Offers white-label infrastructure.

**RWA / Asset-Backed Tokens:** Yes. Digital Asset Securities are a core offering.

**ERC-3643 Support:** Not explicitly stated. Supports blockchain-based digital securities broadly.

**Regulatory Status:**
- SEC-registered broker-dealer (CRD# 283477)
- FINRA/SIPC member
- SEC-registered ATS operator
- One of only nine SEC-registered Digital Alternative Trading Systems

**Blockchains Supported:** Blockchain-based smart contracts for digital securities.

**Notable Deals:**
- Inveniam Capital Partners partnership (September 2025, 20% ownership stake)
- Building first derivatives platform for tokenized private market assets
- Netcapital partnership for ATS access

**Contact:** support@rialtomarkets.com | Phone: 877-774-2586 | Website: rialtomarkets.com

**Pricing:** Custom. White-label licensing available.

**Primary / Secondary / Both:** Both. Rialto Primary for Reg A+, CF, D issuance; Rialto ATS for secondary.

**Geographic Coverage:** US.

**PleoChrome Fit:** STRONG. Rialto Markets is accessible, mid-market, and offers white-label infrastructure (RiMES). Their support for Reg D, digital securities, and white-label solutions makes them a flexible partner. The Inveniam partnership adds private market derivatives capability. Contact them early -- they seem startup-friendly.

---

### 10. StartEngine Secondary

**Website:** https://marketplace.startengine.com

**What They Do:** One of the largest securities crowdfunding platforms ($1.5B+ invested, 2.1M community). Operates an ATS for secondary trading.

**RWA / Asset-Backed Tokens:** Growing. In process of tokenizing $3B+ in digital securities using ERC-1450. Plans to become a leader in tokenized RWAs.

**ERC-3643 Support:** No. Uses ERC-1450 (proprietary standard introduced by CEO Howard Marks).

**Regulatory Status:**
- StartEngine Primary, LLC: SEC-registered broker-dealer, FINRA member
- StartEngine Secondary: SEC-regulated ATS
- $2B valuation, $70M revenue first half 2025

**Notable Deals:** 1,000+ offerings across Reg CF, Reg A+, and Reg D. Mass retail investor base.

**Contact:** https://www.startengine.com -- issuer inquiry forms.

**Pricing:** Varies by offering type. Success-based fees on capital raised.

**Primary / Secondary / Both:** Both. Heavy on primary (crowdfunding), with growing secondary ATS.

**Geographic Coverage:** US.

**PleoChrome Fit:** LOW for current needs. StartEngine's ERC-1450 standard is incompatible with PleoChrome's ERC-3643 approach. Their crowdfunding DNA (mass retail) doesn't align with Reg D 506(c) (accredited only). However, their massive investor base (2.1M) could be valuable if PleoChrome later adds a Reg A+ tier.

---

### 11. ApexInvest Markets (Apex Group / Globacap)

**Website:** https://www.apexgroup.com

**What They Do:** Apex Group ($3T+ assets under administration) acquired Globacap (London-based, FINRA/SEC-regulated) in late 2025 and launched ApexInvest Markets as a US broker-dealer and ATS for tokenized fund distribution.

**RWA / Asset-Backed Tokens:** Yes. Focus on regulated fund tokenization.

**ERC-3643 Support:** Tokeny (ERC-3643 creator) is owned by Apex Group, creating a natural ERC-3643 integration pathway.

**Regulatory Status:**
- SEC-registered broker-dealer (via Globacap)
- FINRA member
- SEC-registered ATS
- Apex Group parent has $3T+ AUA

**Notable Deals:**
- LSEG Digital Market Infrastructure collaboration
- Apex Digital 3.0 solution
- Tokeny integration (Apex owns Tokeny)

**Contact:** https://www.apexgroup.com -- institutional inquiries.

**Pricing:** Enterprise/institutional. Not publicly available.

**Primary / Secondary / Both:** Both. Distribution, capital raising, and secondary trading.

**Geographic Coverage:** Global (Apex Group has worldwide presence).

**PleoChrome Fit:** STRONG POTENTIAL. This is a key connection because Apex Group owns Tokeny (the creator of ERC-3643). ApexInvest Markets + Tokeny = a full-stack solution that natively supports ERC-3643. However, Apex is institutional-focused ($3T+ AUA) and may require large minimums. The ERC-3643 alignment makes this worth pursuing despite the size mismatch.

---

## Part 4: Tier 3 -- Tokenization Infrastructure (No BD/ATS License)

These provide the technology for tokenization but require a separate BD and ATS for distribution and trading.

---

### 12. Tokeny Solutions

**Website:** https://tokeny.com

**What They Do:** Created the ERC-3643 standard (originally T-REX) in 2018. Provides enterprise-grade tokenization platform for compliant issuance, management, and distribution of tokenized securities. Now owned by Apex Group.

**RWA / Asset-Backed Tokens:** Yes. Core business. 120+ customers, 7 years of operation.

**ERC-3643 Support:** They CREATED it. Tokeny IS ERC-3643.

**Regulatory Status:** Technology provider (not a BD or ATS). Relies on regulated partners for distribution. Part of Apex Group (which now has ApexInvest Markets BD/ATS).

**Blockchains Supported:** EVM-compatible chains including Ethereum, Polygon, Avalanche. Deep Polygon integration through Fireblocks partnership.

**Notable Deals:**
- ABN AMRO: EUR 5M green bond on Polygon using ERC-3643
- Fasanara: tokenized money market fund
- Fireblocks integration (1,300+ institutional customers)
- Hedera Asset Tokenization Studio integration
- DTCC joined ERC-3643 Association

**Contact:** https://tokeny.com -- "Get in Touch" form. Luxembourg-based.

**Pricing:** Enterprise pricing. Not publicly available. Contact directly.

**Primary / Secondary / Both:** Technology platform only. Provides issuance and lifecycle management; partners handle distribution and trading.

**Geographic Coverage:** Global. 150+ countries for KYC/AML onboarding.

**PleoChrome Fit:** CRITICAL. Tokeny is the source of ERC-3643. If PleoChrome is using Brickken for tokenization (Brickken also supports ERC-3643 on Polygon), then Tokeny is a potential alternative or complementary partner. The Apex Group ownership means Tokeny + ApexInvest Markets could provide end-to-end ERC-3643 native infrastructure. Contact Tokeny to understand how they work with issuers who are tokenizing alternative assets like gemstones.

---

### 13. Brickken

**Website:** https://www.brickken.com

**What They Do:** Enterprise tokenization platform for creating, selling, and managing digital assets. Deployed on Polygon PoS. Supports equity, bonds, real estate, and alternative assets.

**RWA / Asset-Backed Tokens:** Yes. $300M+ tokenized value across 16 countries.

**ERC-3643 Support:** Brickken supports ERC-3643 and has contributed to the standard's adoption. They also support ERC-7943 (newer standard).

**Regulatory Status:** Technology provider. Operates out of Barcelona, Spain. Not a US BD or ATS.

**Blockchains Supported:** Polygon PoS, Ethereum, and other EVM chains.

**Notable Deals:**
- $2.5M seed round in 2025 ($22.5M post-money valuation)
- $260M+ tokenized across 14 countries (as of early 2025, now $300M+)
- EBITDA positive for 2024

**Contact:** https://www.brickken.com -- "Book a Demo" and contact forms.

**Pricing:** Platform fees for tokenization. Contact for pricing.

**Primary / Secondary / Both:** Technology platform. Provides issuance tools; does not operate a BD or ATS.

**Geographic Coverage:** 16 countries. Spain-based, global reach.

**PleoChrome Fit:** ALREADY ENGAGED. PleoChrome's existing research references Brickken as a tokenization partner. Brickken provides the ERC-3643 token deployment on Polygon. PleoChrome still needs a US BD and ATS to handle distribution and secondary trading.

---

### 14. Vertalo

**Website:** https://www.vertalo.com

**What They Do:** SEC-registered transfer agent providing API-first cap table management, tokenization, and investor data infrastructure for private capital markets.

**RWA / Asset-Backed Tokens:** Yes. 100+ issuers, 100K+ investors, 300K+ securities lots across 6 countries.

**ERC-3643 Support:** Not explicitly. Uses multi-chain tokenization (Ethereum, Aptos, Tezos, Private). Supports "V-Token" delayed tokenization model.

**Regulatory Status:**
- SEC-registered transfer agent
- Not a BD or ATS (partners with BDs and ATSs like tZERO, North Capital, Texture Capital)
- Supports all 5 SEC-recognized tokenization models from January 2026 statement

**Blockchains Supported:** Ethereum, Aptos, Tezos, Private chains. 200+ GraphQL API endpoints.

**Notable Deals:**
- tZERO partnership
- North Capital escrow services partnership
- Texture Capital integration

**Contact:** Katie Campisano (media): +1-908-247-8678, katie@kamprelations.com. HQ: Austin, TX.

**Pricing:** Discounted licensing for BD/ATS firms tokenizing 10+ assets/year. Custom pricing for individual issuers.

**Primary / Secondary / Both:** Transfer agent only. Partners with BDs for distribution and ATSs for secondary.

**Geographic Coverage:** US primary, 6 countries.

**PleoChrome Fit:** MODERATE. Vertalo is a strong transfer agent option, especially given their integrations with tZERO, North Capital, and Texture Capital. If PleoChrome uses one of those ATSs, Vertalo could serve as the transfer agent layer. However, if Brickken is already handling tokenization on Polygon with ERC-3643, adding Vertalo may create redundancy unless PleoChrome needs a separate transfer agent.

---

### 15. Fireblocks

**Website:** https://www.fireblocks.com

**What They Do:** Institutional digital asset infrastructure for custody, transfer, and tokenization. 1,300+ institutional customers.

**RWA / Asset-Backed Tokens:** Yes. Tokenization Engine supports ERC-3643 through Tokeny integration.

**ERC-3643 Support:** Yes -- through integrated Tokeny T-REX smart contracts on the Fireblocks platform.

**Regulatory Status:** Infrastructure provider (not a BD or ATS). SOC 2 Type II certified. Insurance coverage.

**Blockchains Supported:** 50+ blockchains including Polygon, Ethereum, Avalanche, Solana, etc.

**Notable Deals:**
- Tokeny partnership for ERC-3643 on Polygon
- 1,300+ institutional customers including banks, exchanges, and fintechs
- Fasanara tokenized money market fund deployment

**Contact:** https://www.fireblocks.com -- "Talk to Sales" form.

**Pricing:** Enterprise pricing based on AUM and transaction volume. Not publicly available.

**Primary / Secondary / Both:** Infrastructure only. Provides custody, tokenization, and wallet infrastructure.

**Geographic Coverage:** Global.

**PleoChrome Fit:** MODERATE-HIGH. If PleoChrome needs institutional-grade custody and wants ERC-3643 on Polygon through a well-known platform, Fireblocks + Tokeny is a proven stack. However, Fireblocks is expensive and designed for large institutions. PleoChrome would still need a BD and ATS separately.

---

### 16. DigiShares

**Website:** https://digishares.io

**What They Do:** White-label tokenization platform for real estate, private equity, infrastructure, and commodities. End-to-end solution including KYC, e-signing, minting, compliance, cap table, distributions, payment integration, corporate actions, and peer-to-peer trading.

**RWA / Asset-Backed Tokens:** Yes. $1B+ in tokenized securities processed by mid-2025. 40+ countries.

**ERC-3643 Support:** Not explicitly confirmed. Uses own compliance framework.

**Regulatory Status:** Technology provider. Not a US BD or ATS. Partners with regulated entities.

**Notable Deals:** 90+ wallet integrations. Republic partnership.

**Contact:** https://digishares.io -- contact form.

**Pricing:** White-label licensing. Contact for pricing.

**Primary / Secondary / Both:** Technology platform with peer-to-peer trading capability.

**Geographic Coverage:** 40+ countries.

**PleoChrome Fit:** LOW. DigiShares is focused on real estate and doesn't have US BD/ATS licenses. PleoChrome already has Brickken for tokenization.

---

### 17. Zoniqx

**Website:** https://www.zoniqx.com

**What They Do:** Technology infrastructure for tokenized RWAs. Provides zProtocol (DyCIST/ERC-7518), zCompliance, zConnect, zPay, and zIdentity modules.

**RWA / Asset-Backed Tokens:** Yes. Operating system layer for tokenized RWAs.

**ERC-3643 Support:** Supports ERC-3643-style controls and aligns with leading security-token practices (ERC-1400, ERC-3643, ERC-7518).

**Regulatory Status:** Technology provider. Works with licensed BDs, RIAs, and institutions.

**Notable Deals:** Platform for institutional tokenization infrastructure.

**Contact:** https://www.zoniqx.com -- contact form.

**Pricing:** Enterprise. Contact for pricing.

**Primary / Secondary / Both:** Technology infrastructure only.

**Geographic Coverage:** Global.

**PleoChrome Fit:** LOW. Another tokenization tech provider when PleoChrome already has Brickken.

---

### 18. Polymesh

**Website:** https://polymesh.network

**What They Do:** Purpose-built permissioned blockchain for regulated assets. All participants must undergo KYC. Identity, compliance, confidentiality, and settlement are embedded at the chain level.

**RWA / Asset-Backed Tokens:** Yes. Designed specifically for security tokens.

**ERC-3643 Support:** No -- Polymesh is NOT EVM-compatible (it's a Substrate-based chain). Uses its own native asset framework. Incompatible with ERC-3643.

**Regulatory Status:** Blockchain network, not a BD or ATS.

**Blockchains Supported:** Polymesh only (not EVM).

**Notable Deals:**
- AlphaPoint integration (October 2025)
- BitGo custodial support
- Confidential Assets on DevNet (December 2025)

**Contact:** https://polymesh.network

**Pricing:** Transaction fees in POLYX token.

**PleoChrome Fit:** NOT COMPATIBLE. Polymesh is not EVM-compatible, so ERC-3643 tokens on Polygon cannot run on Polymesh. This is a fundamentally different tech stack.

---

## Part 5: Tier 4 -- International Platforms

These operate outside the US and may be relevant for PleoChrome's global distribution strategy.

---

### 19. Archax (UK)

**Website:** https://archax.com

**What They Do:** First FCA-regulated digital asset exchange, broker, and custodian in the UK. Also the first firm on the FCA Cryptoasset Register.

**RWA / Asset-Backed Tokens:** Yes. Tokenized Canary HBR ETF on Hedera. Tokenized collateral for Lloyds Banking Group.

**ERC-3643 Support:** Not explicitly. Uses Hedera-based tokenization primarily.

**Regulatory Status:**
- FCA-regulated exchange, broker, custodian (UK)
- Acquired Globacap Private Markets Inc. (US FINRA/SEC) in March 2025 -- but this was later acquired by Apex Group instead

**Blockchains Supported:** Hedera (primary), others.

**Notable Deals:**
- Lloyds Banking Group tokenized collateral (July 2025)
- Canary HBR ETF tokenization (November 2025)

**Contact:** https://archax.com -- institutional inquiry forms.

**Geographic Coverage:** UK, EU, US (via Globacap -- now unclear after Apex acquisition), UAE.

**PleoChrome Fit:** LOW for US distribution. Archax is UK/FCA-focused. May be relevant if PleoChrome expands to European/UK investors.

---

### 20. SDX - SIX Digital Exchange (Switzerland)

**Website:** https://www.sdx.com

**What They Do:** First fully regulated financial market infrastructure for issuance, trading, settlement, and custody of digital assets. Licensed by FINMA as stock exchange and central security depository on DLT.

**RWA / Asset-Backed Tokens:** Yes. Digital bonds, structured products.

**Regulatory Status:**
- FINMA-licensed stock exchange
- FINMA-licensed central securities depository
- Operated by SIX Group (Switzerland's principal stock exchange operator)

**Notable Deals:**
- Citi partnership (custodian and tokenization agent, Q3 2025)
- World Bank partnership with Swiss National Bank
- Digital bonds trading consolidated to SIX Swiss Exchange (June 2025)

**Contact:** https://www.sdx.com -- institutional inquiries.

**Geographic Coverage:** Switzerland, with global institutional reach.

**PleoChrome Fit:** LOW for US distribution. SDX is Swiss/European institutional infrastructure. Relevant only if PleoChrome targets Swiss qualified investors.

---

### 21. ADDX (Singapore) -- formerly iSTOX

**Website:** https://addx.co

**What They Do:** Asia's largest private market exchange for tokenized securities. Full-service capital markets platform regulated by MAS. Minimum investment as low as $20,000.

**RWA / Asset-Backed Tokens:** Yes. 60+ private market offerings. Private equity, wholesale bonds, unicorn funds.

**ERC-3643 Support:** Not confirmed. Uses own tokenization framework.

**Regulatory Status:**
- MAS-licensed Recognised Market Operator (RMO)
- MAS Capital Markets Services (CMS) licensee
- Previously known as iSTOX (graduated from MAS sandbox February 2020)
- $160M raised from SGX, Temasek, Development Bank of Japan, Hamilton Lane

**Notable Deals:**
- Project Guardian (MAS) with ANZ and Chainlink
- Hamilton Lane fund tokenization
- Stock Exchange of Thailand investment

**Contact:** https://addx.co -- investor/issuer inquiries.

**Pricing:** Platform fees on listing and transactions.

**Geographic Coverage:** Asia-Pacific, expanding to Middle East.

**PleoChrome Fit:** LOW for US distribution. ADDX is Singapore/Asia-focused. Could be relevant for global distribution to Asian accredited investors in a future phase.

---

### 22. Swarm Markets (Germany)

**Website:** https://swarm.com

**What They Do:** BaFin-regulated DeFi trading infrastructure for tokenized securities and crypto assets. First licensed DeFi platform globally.

**RWA / Asset-Backed Tokens:** Yes. Tokenized US stocks, bonds, gold, ETFs on Polygon.

**ERC-3643 Support:** Not confirmed. Uses own compliance framework on Polygon.

**Regulatory Status:**
- BaFin-regulated (German Federal Financial Supervisory Authority)
- Being acquired by Inveniam (closing Q1 2026)
- Will continue operating under existing brand and regulatory framework

**Blockchains Supported:** Polygon (primary), Ethereum.

**Notable Deals:**
- First BaFin-regulated platform to offer tokenized US Treasury bills
- First to offer tokenized Apple stock via DeFi
- Inveniam acquisition (December 2025)

**Contact:** https://swarm.com -- inquiries.

**Geographic Coverage:** EU/Germany primarily.

**PleoChrome Fit:** INTERESTING but COMPLEX. Swarm operates on Polygon (PleoChrome's chain) and is regulated, but it's EU-regulated (not SEC). The Inveniam acquisition connects them to Rialto Markets (US ATS), which could create a transatlantic bridge. Worth monitoring but not a primary partner for US Reg D distribution.

---

### 23. Backed Finance (Switzerland)

**Website:** https://backed.fi | https://assets.backed.fi

**What They Do:** Issues tokenized structured products tracking publicly traded securities under Swiss law.

**RWA / Asset-Backed Tokens:** Yes. Tokenized financial assets tracking public securities.

**ERC-3643 Support:** Not confirmed.

**Regulatory Status:** Swiss law framework. Products offered only through licensed entities to qualified investors.

**Geographic Coverage:** Europe/Switzerland.

**PleoChrome Fit:** NOT APPLICABLE. Different regulatory framework, different asset type, not relevant to US Reg D gemstone securities.

---

### 24. Matrixdock (Singapore)

**Website:** https://www.matrixdock.com

**What They Do:** RWA tokenization platform specializing in precious metals. XAUm (gold), XAGm (silver), plus platinum and palladium.

**RWA / Asset-Backed Tokens:** Yes -- specifically physical commodity-backed tokens.

**ERC-3643 Support:** No. Uses own Fungible Reserve Standard (FRS) framework.

**Regulatory Status:** Singapore-based. MAS oversight framework.

**Blockchains Supported:** Ethereum, Solana, Sui, others.

**Notable Deals:**
- Kingdom of Bhutan sovereign gold token (TER)
- CertiK audited
- Multiple chain deployments

**Contact:** https://www.matrixdock.com -- institutional inquiries.

**Geographic Coverage:** Asia-Pacific, global.

**PleoChrome Fit:** COMPETITOR INTELLIGENCE ONLY. Matrixdock tokenizes physical precious commodities (similar concept to gemstones) but uses different standards, different jurisdiction, and different asset class. Study their model for inspiration, not partnership.

---

### 25. MANTRA Chain

**Website:** https://mantrachain.io

**What They Do:** Layer-1 blockchain purpose-built for RWA tokenization with regulatory compliance as a core feature. EVM-compatible.

**RWA / Asset-Backed Tokens:** Yes. Permissionless chain for tokenization and trading of RWAs.

**ERC-3643 Support:** Not confirmed. Uses own compliance framework with Soulbound NFTs for identity.

**Regulatory Status:**
- VARA license from Dubai (DeFi license)
- Broker-Dealer and VA Management licenses under VARA
- OM token crash in April 2025 (90% drop due to forced liquidations) damaged trust

**Blockchains Supported:** MANTRA Chain (own L1, EVM-compatible). Migrating from Ethereum ERC-20.

**Notable Deals:**
- Google Cloud partnership
- DAMAC Group partnership
- MANTRA USD stablecoin (January 2026)

**Contact:** https://mantrachain.io

**Geographic Coverage:** UAE/Dubai-focused, global.

**PleoChrome Fit:** LOW. MANTRA is a separate blockchain, not a distribution/BD platform. The April 2025 OM crash and Dubai-centric regulation make this a risky association. Not relevant for US Reg D distribution.

---

### 26. Centrifuge

**Website:** https://centrifuge.io

**What They Do:** Infrastructure for onchain asset management. Connects tokenized assets to DeFi liquidity. $2B+ tokenized through the platform.

**RWA / Asset-Backed Tokens:** Yes. Core business. Janus Henderson Anemoy Treasury Fund ($400M allocation).

**ERC-3643 Support:** No. Uses own token framework on Centrifuge chain (now EVM-native after July 2025 migration).

**Regulatory Status:** DeFi protocol. Not a regulated BD or ATS.

**Blockchains Supported:** Ethereum, Base, Arbitrum, Avalanche (EVM-native as of July 2025).

**Notable Deals:**
- Janus Henderson Anemoy Treasury Fund
- Janus Henderson AAA CLO strategy
- Centrifuge Whitelabel tokenization platform (November 2025)

**Contact:** https://centrifuge.io -- institutional inquiries.

**Geographic Coverage:** Global DeFi.

**PleoChrome Fit:** NOT APPLICABLE. Centrifuge is DeFi infrastructure for lending/credit pools, not securities distribution. Not relevant for Reg D 506(c) gemstone tokens.

---

### 27. RealT

**Website:** https://realt.co

**What They Do:** Tokenized real estate marketplace. 970+ properties tokenized in the US. Tokens starting from $50.

**RWA / Asset-Backed Tokens:** Yes. Real estate-backed tokens.

**ERC-3643 Support:** Not confirmed. Uses own token framework.

**Regulatory Status:** US-based. Operates under Reg D exemptions.

**Geographic Coverage:** US.

**PleoChrome Fit:** COMPETITOR INTELLIGENCE ONLY. RealT's model (fractional ownership of physical assets via tokens under Reg D) is architecturally similar to PleoChrome's. Study their approach to compliance, KYC, and investor experience. Not a distribution partner.

---

## Part 6: Tier 5 -- Emerging and Noteworthy

---

### 28. KS GEMS (Tokenized Gemstones)

**Website:** Listed on XT.COM (April 2025)

**What They Do:** Blockchain-based tokenization of certified rare gemstones (sapphires, emeralds, rubies, alexandrites). Fractional ownership via KSGEMS token.

**RWA / Asset-Backed Tokens:** Yes -- specifically gemstones. Backed by GreenX, certified by GRS (GemResearch Swisslab). CertiK audited smart contracts.

**ERC-3643 Support:** No information available. Likely utility/DeFi token structure.

**Regulatory Status:** Not clear. Listed on XT.COM exchange.

**PleoChrome Fit:** DIRECT COMPETITOR. KS GEMS is tokenizing gemstones but appears to be using a utility token/DeFi approach rather than SEC-regulated securities. PleoChrome's Reg D 506(c) approach with ERC-3643 compliance tokens is fundamentally more institutional and regulated. Study KS GEMS's approach, marketing, and GRS certification process.

---

### 29. NYSE Tokenized Equities ATS (Upcoming)

**Website:** https://www.nyse.com (announcements)

**What They Do:** NYSE is developing a tokenized equities alternative trading platform for 24/7 trading with instant settlement and stablecoin-based funding.

**Regulatory Status:** Pending SEC and FINRA approvals. Enabled by SEC no-action relief for DTC tokenization.

**Launch Timeline:** As early as Q2 2026 (optimistic), more likely late 2026.

**PleoChrome Fit:** NOT DIRECTLY APPLICABLE. NYSE's platform is for tokenized versions of already-public equities, not private placements. However, the existence of NYSE entering this space validates the entire tokenized securities thesis.

---

### 30. DTCC / DTC Tokenization Pilot

**What They Do:** The Depository Trust Company (subsidiary of DTCC) received SEC no-action relief (December 11, 2025) to operate a 3-year pilot tokenizing DTC-custodied assets on supported blockchains.

**Timeline:** Rolling out H2 2026. Covering Russell 1000 equities, major index ETFs, and US Treasuries.

**PleoChrome Fit:** NOT DIRECTLY APPLICABLE but ENORMOUSLY VALIDATING. The fact that DTCC (which clears virtually all US equities) is tokenizing securities validates PleoChrome's entire approach. DTCC also joined the ERC-3643 Association.

---

## Part 7: ERC-3643 Ecosystem

### The ERC-3643 Association

The ERC-3643 Association is a non-profit with 92+ member organizations as of January 2025. Key members include:

**Infrastructure:**
- DTCC (joined 2025)
- Fireblocks
- Polygon
- Hedera
- Avalanche

**Platforms:**
- Tokeny (creator)
- tZERO (supports ERC-3643)
- Brickken
- 21X
- Smart Bonds
- BX Digital

**Financial Institutions:**
- ABN AMRO (EUR 5M green bond on Polygon using ERC-3643)
- EisnerAmper

**Standards Bodies:**
- ANNA (Association of National Numbering Agencies)
- DTI Foundation
- GLEIF (Global Legal Entity Identifier Foundation)

**Website:** https://www.erc3643.org/members

### Why ERC-3643 Matters for PleoChrome

PleoChrome's choice of ERC-3643 on Polygon is strategically sound because:

1. **It is THE institutional standard.** DTCC joining the association in 2025 is the strongest possible validation.
2. **Compliance is on-chain.** Identity verification, transfer restrictions, and investor eligibility are enforced at the smart contract level, not just in off-chain databases.
3. **Regulatory alignment.** The SEC's January 28, 2026 statement on tokenized securities confirms that tokenized securities are regulated securities -- ERC-3643's built-in compliance framework directly addresses this.
4. **Ecosystem depth.** Tokeny + Fireblocks + Polygon = proven deployment path. ABN AMRO's EUR 5M green bond proves real-world viability.
5. **tZERO compatibility.** tZERO explicitly supports ERC-3643 for primary issuance and secondary trading.

### Platforms Confirmed to Support ERC-3643:

| Platform | Role | ERC-3643 | Polygon |
|----------|------|----------|---------|
| Tokeny | Creator/Infra | Native | Yes |
| Brickken | Tokenization | Yes | Yes |
| tZERO | BD/ATS | Yes | Not yet |
| Fireblocks | Custody/Infra | Yes (via Tokeny) | Yes |
| Apex/ApexInvest | BD/ATS (owns Tokeny) | Yes (via Tokeny) | Likely |
| ABN AMRO | Issuer example | Yes | Yes |
| Hedera ATS | Infra | Yes (adapted) | No (Hedera) |

---

## Part 8: Recent Regulatory Landscape (2025-2026)

### SEC Statement on Tokenized Securities (January 28, 2026)

Joint statement from SEC Divisions of Corporation Finance, Investment Management, and Trading and Markets:
- Tokenized securities ARE securities under federal law, regardless of format
- Existing securities laws apply fully
- Two models identified: (1) custodial tokenized securities (underlying held in custody, token represents ownership) and (2) synthetic tokenized securities (issuer creates new security with synthetic exposure)
- PleoChrome's model is custodial: gemstones held in physical custody, tokens represent ownership interest

### SEC Broker-Dealer Custody Guidance (December 17, 2025)

- Broker-dealers CAN maintain custody of tokenized equity and debt securities under Rule 15c3-3
- Must maintain policies, procedures, and controls for private key management consistent with industry best practices
- "Physical possession" of crypto asset security is possible if BD controls private keys

### DTC No-Action Letter (December 11, 2025)

- SEC will not recommend enforcement against DTC for a 3-year tokenization pilot
- DTC-custodied assets can be tokenized on supported blockchains
- Tokenized entitlements can be transferred directly between registered wallets
- Expected launch H2 2026

### SEC Reg D 506(c) Guidance (March 2025)

- Accredited investor verification can be satisfied by self-certification when investor makes a minimum investment amount
- Simplifies the 506(c) verification burden
- Beneficial for PleoChrome's high-value gemstone tokens

### FINRA Private Placement Fee Changes (July 1, 2025)

- New fee structure: $300 base + 0.008% of offering proceeds for offerings over $25M
- Cap at $40,300
- Reimbursements for filing fees NOT considered underwriting compensation

---

## Part 9: PleoChrome-Specific Recommendations

### Recommended Approach: Build a Partner Stack

PleoChrome's needs map to a multi-partner approach:

| Function | Recommended Partners | Priority |
|----------|---------------------|----------|
| Tokenization (ERC-3643 on Polygon) | Brickken (existing) | Already engaged |
| Broker-Dealer of Record (primary issuance) | Dalmore Group OR North Capital | HIGH -- engage immediately |
| ATS for Secondary Trading | tZERO, North Capital (PPEX), or Rialto Markets | HIGH -- engage after BD |
| Transfer Agent | Vertalo OR built into ATS platform | MEDIUM |
| Institutional Custody | Fireblocks (if institutional scale) | LATER |
| Compliance/KYC/AML | Integrated via Brickken ERC-3643 + BD partner | Built-in |

### Priority Outreach List (Ranked)

**Tier A -- Contact First:**

1. **Dalmore Group** -- Most accessible BD of record for Reg D 506(c). Lowest cost entry point ($5K-$55K setup + 1-3% success fee). 1,000+ offerings. They understand online capital formation. Actively exploring tokenization for 2026.
   - Action: https://dalmoregroup.com/broker-dealer-of-record -- fill out inquiry form

2. **tZERO** -- Only Tier 1 platform to explicitly confirm ERC-3643 support. Full-stack BD/ATS/transfer agent. 23.5-hour trading. Polygon not yet supported, but multi-chain expansion ongoing.
   - Action: https://www.tzero.com/tokenize -- "Let's Talk" form

3. **North Capital / PPEX ATS** -- Mid-market BD + ATS with new tokenization subsidiary (February 2026). Agora network with tZERO expands liquidity. Accessible and startup-friendly.
   - Action: https://www.northcapital.com/contact-us

4. **Rialto Markets** -- White-label BD + ATS infrastructure. Supports Reg D digital securities. Inveniam partnership. Direct contact available.
   - Action: support@rialtomarkets.com or 877-774-2586

**Tier B -- Contact Second:**

5. **Tokeny / ApexInvest Markets** -- ERC-3643 native infrastructure + Apex Group's new US BD/ATS. The most natural technology fit for PleoChrome's ERC-3643 on Polygon approach. May be too institutional-focused.
   - Action: https://tokeny.com -- contact form

6. **Texture Capital** -- BD + ATS + transfer agent. Flexible with alternative asset types. Vertalo integration.
   - Action: https://www.texture.capital

7. **Prometheum** -- Full regulatory stack assembled in 2025. Still early-stage but ambitious. Could offer startup-to-startup flexibility.
   - Action: https://www.prometheum.com -- jbrubaker@prometheum.com

**Tier C -- Monitor:**

8. **Securitize** -- The market leader, but likely too expensive and institutional-focused for PleoChrome's current stage. Revisit when PleoChrome has $50M+ in tokenized gemstones.
9. **Republic/INX** -- Mid-merger integration. Revisit Q2 2026 when platform stabilizes.
10. **ApexInvest Markets** -- New launch. Monitor their traction and pricing.

### The Recommended Initial Configuration

For PleoChrome's first Reg D 506(c) gemstone token offering:

```
[PleoChrome] -- orchestration platform
    |
    v
[Brickken] -- ERC-3643 token deployment on Polygon
    |
    v
[Dalmore Group] -- BD of record (primary issuance compliance)
    |
    +---> [Accredited Investor Verification] (handled by BD or VerifyInvestor)
    +---> [FINRA Filing] (Form 5123)
    +---> [KYC/AML] (integrated or third-party)
    |
    v
[North Capital PPEX ATS or tZERO ATS] -- secondary trading
    |
    v
[Vertalo or Brickken] -- transfer agent / cap table
```

Cost estimate for this configuration:
- Brickken tokenization: ~$25K-$50K (estimate, custom pricing)
- Dalmore BD of record: ~$25K-$55K setup + 1-3% of raise
- ATS listing: ~$10K-$50K setup + transaction fees
- Transfer agent: ~$10K-$25K/year
- Legal (PPM, Form D, subscription agreements): $50K-$150K
- **Total first-year: ~$120K-$330K + percentage of capital raised**

---

## Part 10: Comparison Matrix

| Platform | Type | BD | ATS | TA | ERC-3643 | Polygon | Reg D | Pricing | Fit |
|----------|------|-----|-----|-----|----------|---------|-------|---------|-----|
| Securitize | Full-stack | Yes | Yes | Yes | No (proprietary) | Yes | Yes | Enterprise | Low (too big) |
| tZERO | Full-stack | Yes | Yes | Yes | YES | No (expanding) | Yes | 7% primary | HIGH |
| Republic/INX | Full-stack | Yes | Yes | Yes | Unclear | No | Yes | Custom | Moderate |
| Prometheum | Full-stack | Yes | Yes | Yes | Unclear | No | Yes | Custom | Moderate |
| Ondo/Oasis Pro | Full-stack | Yes | Yes | Yes | No | Unclear | Yes | Custom | Low |
| Dalmore Group | BD only | Yes | No | No | No (2026) | N/A | YES | $5K-55K + 1-3% | HIGH |
| North Capital | BD + ATS | Yes | Yes | No | Unclear | Unclear | Yes | Custom | HIGH |
| Texture Capital | BD + ATS + TA | Yes | Yes | Yes | Unclear | Unclear | Yes | Custom | Moderate |
| Rialto Markets | BD + ATS | Yes | Yes | No | Unclear | Unclear | Yes | Custom/WL | HIGH |
| StartEngine | BD + ATS | Yes | Yes | No | No (ERC-1450) | No | Yes | Success-based | Low |
| ApexInvest | BD + ATS | Yes | Yes | No | Yes (via Tokeny) | Likely | Yes | Enterprise | Moderate |
| Tokeny | Infra | No | No | No | CREATOR | Yes | N/A | Enterprise | HIGH (tech) |
| Brickken | Infra | No | No | No | Yes | YES | N/A | Custom | ENGAGED |
| Vertalo | TA | No | No | Yes | No | No | N/A | Custom | Moderate |
| Fireblocks | Custody/Infra | No | No | No | Yes (via Tokeny) | Yes | N/A | Enterprise | Moderate |
| DigiShares | Infra | No | No | No | Unclear | Unclear | N/A | WL license | Low |
| Polymesh | Blockchain | No | No | No | No (not EVM) | No | N/A | POLYX fees | None |
| Archax | Exchange (UK) | FCA | FCA | FCA | No | No | No (UK) | Custom | Low |
| SDX | Exchange (CH) | FINMA | FINMA | FINMA | No | No | No (CH) | Custom | Low |
| ADDX | Exchange (SG) | MAS | MAS | MAS | No | No | No (SG) | Custom | Low |
| Swarm Markets | DeFi (DE) | BaFin | BaFin | No | No | YES | No (DE) | Custom | Low |

---

## Key Takeaways

1. **tZERO is the strongest single-platform fit** -- it explicitly supports ERC-3643, has full BD/ATS/TA capabilities, and is building multi-chain infrastructure. The Polygon gap is the main concern.

2. **Dalmore Group is the easiest first step** -- engage them as BD of record for the Reg D 506(c) offering. They are the most accessible, lowest-cost option and have the most experience with online capital formation.

3. **North Capital PPEX ATS is the most accessible secondary trading venue** -- mid-market, startup-friendly, and building tokenization infrastructure. The Agora network with tZERO expands liquidity.

4. **The Tokeny / Apex Group connection is the most ERC-3643-native option** -- Tokeny created the standard, Apex now owns Tokeny and has ApexInvest Markets (US BD/ATS). This is the cleanest end-to-end ERC-3643 path, but may be too institutional for PleoChrome's current stage.

5. **Brickken remains the right tokenization partner** -- they support ERC-3643 on Polygon, which is PleoChrome's exact stack.

6. **The regulatory tailwind is real** -- SEC January 2026 guidance, DTC tokenization pilot, DTCC joining ERC-3643, NYSE tokenized ATS -- all of this validates PleoChrome's thesis.

7. **Budget $120K-$330K+ for first-year infrastructure** -- this is on top of legal costs and does not include the capital being raised.

---

## Sources

- [Securitize](https://securitize.io/)
- [Securitize IPO Announcement](https://www.prnewswire.com/news-releases/securitize-the-leading-tokenization-platform-to-become-a-public-company-at-1-25b-valuation-via-business-combination-with-cantor-equity-partners-ii-302596208.html)
- [tZERO](https://www.tzero.com/)
- [tZERO Connect Launch](https://www.tzero.com/news/tzero-launches-tzero-connect-to-power-institutional-access-to-tokenized-markets)
- [tZERO 2026 IPO Plans](https://www.tzero.com/media/tokenized-securities-market-tzero-is-readying-2026-ipo)
- [tZERO Extended Trading Hours](https://www.tzero.com/news/tzero-to-launch-24-7-order-entry-and-extended-ats-trading-hours-enhancing-interoperability-with)
- [tZERO Multi-Chain Expansion](https://www.tzero.com/news/tzero-expands-multi-chain-tokenization-infrastructure-to-include-stellar-xdc-and-algorand)
- [INX One Platform](https://www.inx.co/)
- [Republic INX Acquisition](https://www.newswire.ca/news-releases/the-inx-digital-company-inc-announces-successful-closing-of-transaction-with-republic-814440580.html)
- [Tokeny](https://tokeny.com/)
- [ERC-3643 Association](https://www.erc3643.org/)
- [ERC-3643 Association Members](https://www.erc3643.org/members)
- [DTCC Joins ERC-3643](https://www.dtcc.com/news/2025/march/20/dtcc-joins-erc3643-association)
- [Fireblocks + Tokeny on Polygon](https://polygon.technology/blog/fireblocks-and-tokeny-drive-adoption-of-permissioned-tokens-on-polygon)
- [Brickken on Polygon](https://www.brickken.com/post/brickken-is-live-on-polygon-pos)
- [Vertalo](https://www.vertalo.com/)
- [North Capital](https://www.northcapital.com/)
- [North Capital PPEX ATS](https://www.ppex.com/)
- [North Capital Token Services Launch](https://www.einpresswire.com/article/889135381/north-capital-launches-tokenization-subsidiary)
- [North Capital + tZERO Agora Network](https://www.tzero.com/news/tzero-and-north-capital-move-to-unite-tokenized-securities-ecosystem-in-the-us)
- [Dalmore Group](https://dalmoregroup.com/)
- [Dalmore BD of Record](https://dalmoregroup.com/broker-dealer-of-record)
- [Dalmore Fee Structure (SEC Filing)](https://www.sec.gov/Archives/edgar/data/1830166/000119312522071463/d243306daddexhb7.htm)
- [Texture Capital](https://www.texture.capital/)
- [Texture Capital Canton Network](https://www.prnewswire.com/news-releases/texture-capital-joins-canton-network-in-preparation-for-deployment-of-its-alternative-trading-system-and-transfer-agent-to-facilitate-institutional-digital-securities-transactions-302363221.html)
- [Rialto Markets](https://rialtomarkets.com/)
- [Rialto + Inveniam Partnership](https://www.prnewswire.com/news-releases/inveniam-and-rialto-markets-unite-to-lead-the-next-era-of-private-market-trading-302556608.html)
- [Oasis Pro / Ondo Finance Acquisition](https://ondo.finance/blog/ondo-acquires-oasis-pro)
- [Prometheum](https://www.prometheum.com/)
- [Prometheum Full Stack Announcement](https://www.businesswire.com/news/home/20250527397917/en/Prometheum-Expands-End-to-End-Blockchain-Securities-Infrastructure-with-SEC-Registered-Digital-Transfer-Agent-and-Primary-Issuance-Broker-Dealer)
- [ApexInvest Markets Launch](https://www.apexgroup.com/insights/apex-group-launches-us-broker-dealer-apexinvest-markets/)
- [StartEngine](https://www.startengine.com/)
- [Polymesh](https://polymesh.network/)
- [Archax](https://archax.com/)
- [SDX Swiss Digital Exchange](https://www.sdx.com/)
- [ADDX Singapore](https://addx.co/)
- [Swarm Markets](https://swarm.com/)
- [Backed Finance](https://backed.fi/)
- [Matrixdock](https://www.matrixdock.com/)
- [MANTRA Chain](https://mantrachain.io/)
- [Centrifuge](https://centrifuge.io/)
- [RealT](https://realt.co/)
- [DigiShares](https://digishares.io/)
- [Zoniqx](https://www.zoniqx.com/)
- [KS GEMS on XT.COM](https://www.globenewswire.com/news-release/2025/04/15/3061421/0/en/KSGEMS-Token-Debuts-on-XT-COM-Empowering-Global-Access-to-Tokenized-Gemstone-Ownership.html)
- [SEC Statement on Tokenized Securities (Jan 2026)](https://www.sec.gov/newsroom/speeches-statements/corp-fin-statement-tokenized-securities-012826)
- [SEC BD Custody Guidance (Dec 2025)](https://www.sec.gov/newsroom/speeches-statements/trading-markets-121725-statement-custody-crypto-asset-securities-broker-dealers)
- [DTC Tokenization No-Action Letter](https://www.sec.gov/files/tm/no-action/dtc-nal-121125.pdf)
- [NYSE Tokenized Equities Platform](https://ir.theice.com/press/news-details/2026/The-New-York-Stock-Exchange-Develops-Tokenized-Securities-Platform/default.aspx)
- [SEC Reg D 506(c) Guidance (Mar 2025)](https://www.sec.gov/resources-small-businesses/exempt-offerings/general-solicitation-rule-506c)
- [FINRA Private Placement Fee Changes](https://www.alston.com/en/insights/publications/2025/02/finra-fees-public-offering-private-placement)
- [North Capital BD vs Placement Agent](https://www.northcapital.com/post/broker-dealer-vs-placement-agent)
- [Private Placement Fees Explained](https://blog.factright.com/private-placements-explained-part-4-fees-and-expenses)
