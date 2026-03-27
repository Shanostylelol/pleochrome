# Tokenized Gemstone Operations: Exhaustive Research Report

**Purpose:** Critical operational planning reference for maintaining tokenized real-world gemstone assets over the long term.

**Research Date:** March 17, 2026

---

## Table of Contents

1. [SPV Ongoing Costs -- Who Pays What After Tokenization?](#1-spv-ongoing-costs----who-pays-what-after-tokenization)
2. [Vault Insurance -- What Is Actually Covered?](#2-vault-insurance----what-is-actually-covered)
3. [Ongoing Costs Breakdown for a Tokenized Gemstone Asset](#3-ongoing-costs-breakdown-for-a-tokenized-gemstone-asset)
4. [Annual Reappraisal -- Is It Required?](#4-annual-reappraisal----is-it-required)
5. [Gemstone Value Tracking and Appreciation Data](#5-gemstone-value-tracking-and-appreciation-data)
6. [Token Value vs Stone Value -- How Are They Connected?](#6-token-value-vs-stone-value----how-are-they-connected)
7. [ERC-3643 -- Detailed Operational Breakdown](#7-erc-3643----detailed-operational-breakdown)
8. [Risk Scenarios -- What Could Go Wrong Long-Term?](#8-risk-scenarios----what-could-go-wrong-long-term)

---

## 1. SPV Ongoing Costs -- Who Pays What After Tokenization?

### Who Pays for Vault Custody Going Forward?

The SPV is the legal entity that owns the gemstone and therefore is the party contractually obligated to pay vault custody fees. Token holders do NOT pay custody fees directly. Instead, these costs are deducted from the SPV's operating budget, which ultimately reduces the net value of the tokens.

The typical flow is:

1. **At token sale:** A percentage of the offering proceeds (typically 5-15%) is retained as an **operating reserve** within the SPV to fund ongoing expenses
2. **Ongoing:** The SPV pays vault custody, insurance, compliance, and administration from this reserve
3. **If reserve depletes:** The SPV must either (a) assess additional fees to token holders, (b) the management company (PleoChrome) absorbs costs, or (c) the asset is liquidated

### How Comparable Platforms Handle This

**Masterworks (Art Tokenization)**
- Charges a **1.5% annual management fee** covering storage, insurance (Lloyd's of London), and ongoing appraisals
- Takes a **20% commission on profits** at sale
- Investors do NOT make direct fee payments -- Masterworks grants itself additional shares, diluting existing shareholders
- Paintings stored at Delaware Freeport LLC in climate-controlled facilities
- Upfront syndication/setup costs run 10-11% per offering, absorbed into the offering structure
- Source: [Masterworks FAQ](https://insights.masterworks.com/masterworks-faq/faq/)

**RealT (Real Estate Tokenization)**
- Performance results shown **net of all fees, costs, and expenses** associated with the token
- Ongoing asset management fees typically **0.5-2% of AUM**
- Platform maintenance costs: $2,000-$20,000/month for infrastructure, regulatory updates, investor management, security monitoring
- Distributions paid in USDC from the asset management company
- Source: [RealT](https://realt.co/)

**Paxos Gold (PAXG -- Tokenized Gold)**
- **Zero storage fees** to customers -- Paxos absorbs custody costs as part of service
- **Zero insurance costs** passed to token holders
- Revenue model: creation/destruction fees (0.02%) and spread on purchases (12.5-100 bps depending on size)
- Gold custodied in LBMA vaults, audited monthly
- Regulated by the OCC (Office of the Comptroller of the Currency)
- Source: [PAX Gold Fees](https://help.paxos.com/hc/en-us/articles/360041903832-PAX-Gold-Fees)

### Standard Fee Models for Tokenized Physical Assets

| Model | How It Works | Used By |
|-------|-------------|---------|
| **Management fee (deducted from NAV)** | 1-2% annual fee reduces token value over time | Masterworks, most SPV structures |
| **Absorbed by platform** | Platform covers costs from spread/transaction fees | Paxos (PAXG) |
| **Charged as separate fee** | Token holders billed directly (rare for retail) | Some institutional structures |
| **Funded from reserves** | Offering retains 5-15% reserve for ongoing costs | Most Reg D/Reg A+ offerings |
| **Share dilution** | Management company grants itself additional tokens | Masterworks |

### What Happens If the SPV Runs Out of Money?

This is a critical risk. If the SPV's operating reserve is exhausted:

1. **Clawback provisions:** The fund may require a clawback of distributions previously made to investors
2. **Manager absorption:** The fund manager (PleoChrome) may be required to absorb costs -- this is the undesirable scenario
3. **Capital call:** Some SPV structures allow the manager to issue a capital call to investors, though this is unusual for tokenized assets
4. **Forced liquidation:** The asset must be sold to cover obligations, potentially at a distressed price
5. **"Zombie entity":** Without proper wind-down, the SPV could become a "zombie entity" that exists legally but cannot function

**Best practice:** Retain sufficient reserves (12-24 months of operating expenses) and include clear provisions in the operating agreement for what happens when reserves run low.

Sources:
- [SPV for Tokenized Assets: Setup and Governance](https://www.rwa.io/post/spv-for-tokenized-assets-setup-and-governance)
- [How Much Does It Cost to Create an SPV in 2026?](https://www.allocations.com/blog/how-much-does-it-cost-to-create-an-spv-in-2026)
- [Fund SPV Lifecycle](https://www.qapita.com/blog/fund-spv-lifecycle-structure-exit-scenarios)
- [Unravelling the Intricacies of Closing a Capital-Raising SPV](https://www.syndicately.com/blog/unravelling-the-intricacies-of-closing-a-capital-raising-spv/)

---

## 2. Vault Insurance -- What Is Actually Covered?

### What Specie Insurance Covers

Specie insurance protects "high-value, portable items -- such as precious metals, gems, securities, cash and even cryptocurrency." Coverage is provided on an **"all risks of physical loss or damage"** basis with customized policy wording.

**Covered perils typically include:**

| Peril | Covered? | Notes |
|-------|----------|-------|
| Theft / robbery | Yes | Primary peril -- most common claim |
| Employee infidelity (insider theft) | Yes | Prominent risk; requires adequate limits |
| Fire | Yes | Standard property peril |
| Flood | Yes | Standard property peril |
| Windstorm | Yes | Standard natural disaster |
| Earthquake | Yes | Usually covered, may require endorsement |
| Mysterious disappearance | Yes | Common claim type for gems |
| Transit damage/accidents | Yes | Vehicle accidents, shipping incidents |
| Accidental damage in vault | Yes | Physical damage from handling, etc. |

### What Is Typically EXCLUDED

| Exclusion | Details |
|-----------|---------|
| **War** | Formally declared war, insurrection, military action -- standard exclusion |
| **Nuclear/Chemical/Biological/Radiological (NCBR)** | Material used as a weapon -- Lloyd's requires special agreement to cover |
| **Cyber attacks** | Ransomware, hacking -- typically excluded for physical specie |
| **State-sponsored attacks** | Lloyd's 2023+ mandates expanded war exclusion to include state-sponsored cyber |
| **Gradual deterioration** | Wear and tear, inherent vice -- not sudden loss |
| **Confiscation by government** | Seizure by lawful authority |
| **Pre-existing conditions** | Damage that existed before policy inception |

### "Acts of God" -- Natural Disasters

Natural disasters (fire, flood, earthquake, windstorm) are generally covered under specie insurance, as they are considered standard insurable perils. However:

- **Earthquake** may require a separate endorsement or higher deductible in seismically active zones
- **Flood** coverage may have sublimits in flood-prone areas
- **Power outages** that lead to environmental control failure (humidity, temperature) could cause gradual damage -- coverage depends on policy wording (sudden vs. gradual)

### What Happens If the Stone Is Damaged in the Vault?

1. **Notification:** Policyholder notifies insurer immediately
2. **Investigation:** Insurer sends specialist adjuster (specie claims require specialized expertise -- "claims typically are significant" given asset values)
3. **Appraisal:** Independent gemological appraisal of damage vs. pre-loss condition (this is why having a pre-insurance independent appraisal with high-resolution photography and documentation is critical)
4. **Settlement:** Claim settled up to the agreed sum insured amount
5. **Subrogation:** Insurer may pursue the vault operator for negligence if applicable

### The Insurance Gap Problem: Appreciation vs. Insured Value

**This is a critical risk for tokenized gemstones.**

If the stone is insured for $10M at tokenization but tokens appreciate to reflect a $12M valuation:

- A **total loss claim will only pay $10M** -- the agreed sum insured
- The **$2M gap is uninsured** and must be borne by token holders
- The policyholder (SPV) is responsible for maintaining adequate insurance limits
- **Underinsurance penalty:** Some policies apply a proportional reduction -- if you insured for $10M but the stone was worth $12M, the insurer may only pay 10/12 (83.3%) of any partial loss claim

**Mitigation:** Annual reappraisal with insurance coverage adjusted annually to match current value. The SPV operating agreement should mandate this.

### Who Is the Beneficiary of the Insurance Policy?

- The **SPV** is the named insured and beneficiary (as the legal owner of the stone)
- Token holders benefit indirectly as equity holders of the SPV
- The **vault operator** is NOT the beneficiary -- they carry their own liability insurance
- If a claim is paid, proceeds go to the SPV, which then either (a) purchases a replacement asset, (b) distributes proceeds to token holders, or (c) reinvests per the operating agreement

### What Happens If the Vault Operator Goes Bankrupt?

**Under proper bailment (allocated, segregated storage):**
- The gemstone is NOT part of the vault operator's bankruptcy estate
- The SPV retains legal ownership under bailment law -- "you (the bailor) entrust your property to the custodian (the bailee) for safekeeping, but you never relinquish ownership"
- The SPV simply arranges transfer to a new vault
- Source: [Strategic Gold FAQ](https://www.strategicgold.com/faq-items/what-happens-if-strategic-gold-or-the-vault-custodian-goes-bankrupt/)

**Risk with commingled/unallocated storage:**
- If storage is not segregated, the SPV may be treated as an unsecured creditor
- Recovery rate for unsecured creditors is historically "pennies on the dollar"
- **This is why allocated, segregated storage is non-negotiable for tokenized gemstones**

### Brink's and Malca-Amit Standard Arrangements

**Brink's:**
- State-of-the-art vaulting facilities across the globe
- Comprehensive cargo insurance policies for all shipments
- Storage options from individual safety deposit boxes to entire dedicated vaults
- Custody fees for precious metals via intermediaries: ~0.12% annually (gold) via BullionVault
- Direct fee structures for high-value single items are negotiated privately
- Source: [Brink's US](https://us.brinks.com/precious-metals)

**Malca-Amit:**
- Founded 1963 (Tel Aviv), now HQ in Hong Kong
- Free Trade Zone facilities worldwide (duty-free storage)
- Full liability insurance coverage included with storage
- 24/7 monitored CCTV, alarm, climate, and fire control systems
- London facility: only commercial facility in UK meeting Grade XII (EX) (CD) and EN 1143-1 vault standards
- Storage options from safety deposit boxes to entire dedicated vaults for institutions
- Source: [Malca-Amit Vaults](https://malca-amit.com/precious-metals/vaults-ftz-facilities)

Sources:
- [Specie Insurance Complete Guide](https://www.meslee.com/jewelry-art-insurance/specie-insurance-for-jewelers-the-complete-guide-to-jewelers-block-coverage/)
- [What is Specie Insurance?](https://www.insurancebusinessmag.com/us/guides/what-is-specie-insurance-214564.aspx)
- [AXA XL Specie Insurance](https://axaxl.com/fast-fast-forward/articles/specie-insurance_a-valuable-form-of-coverage)
- [Gold Specie Insurance](https://seasia-consulting.com/gold-specie-insurance/)
- [Gemstone Insurance Explained](https://www.onceinsurance.com/blog/gemstone-insurance-explained)
- [Lloyd's War and NCBR Exposures](https://assets.lloyds.com/assets/y4972-war-and-ncbr-exposures/1/Y4972%20-%20War%20and%20NCBR%20Exposures.pdf)

---

## 3. Ongoing Costs Breakdown for a Tokenized Gemstone Asset

### Model: Single $10M Gemstone Held in SPV (Delaware LLC)

| Cost Category | Annual Cost (Est.) | Notes |
|--------------|-------------------|-------|
| **Vault custody fees** | $10,000 - $50,000 | 0.10-0.50% of value; depends on provider and negotiation. Brink's/Malca-Amit rates are custom-quoted for high-value single items. Some include insurance. |
| **Specie insurance premium** | $100,000 - $200,000 | 1-2% of insured value is industry standard for high-value gemstones. Premium decreases with better security (vault grade, location, controls). |
| **Chainlink oracle maintenance** | $10,000 - $50,000 | Chainlink PoR pricing is enterprise/custom-quoted; not publicly disclosed. Includes LINK token costs for on-chain updates. Update frequency affects cost (daily vs. monthly). |
| **Brickken platform subscription** | $5,000 - $25,000 | Enterprise pricing not publicly disclosed; requires direct quote. Includes token management dashboard, compliance tools. |
| **Compliance monitoring** | $5,000 - $15,000 | Quarterly sanctions re-screening of all token holders, ongoing AML monitoring. Cost depends on number of investors. Per-check costs: varies by provider. Bulk annual monitoring tools: $3,000-10,000/year. |
| **Annual independent reappraisal** | $2,000 - $10,000 | High-value gemstone appraisal by GIA-credentialed or NAJA-certified appraiser. Simple appraisals start at $150; complex multi-stone or exceptional single-stone appraisals with market analysis cost significantly more. |
| **Tax preparation (K-1 generation)** | $3,000 - $15,000 | Base partnership return (Form 1065): $800-$2,650. Additional K-1 per investor: $70-$150 each. For 50 investors: ~$6,000-$10,000+. For 200 investors: $15,000-$30,000+. |
| **State LLC annual filing** | $60 - $300 | Wyoming: $60/year. Delaware: $300/year. Plus registered agent: $150-$300/year. |
| **Transfer agent / cap table** | $5,000 - $20,000 | Securitize, Vertalo, or similar SEC-registered digital transfer agent. Covers shareholder onboarding, recordkeeping, transfers, communications. |
| **Legal / regulatory counsel** | $5,000 - $20,000 | Annual review of compliance posture, regulatory updates, operating agreement amendments as needed. |
| **Accounting / audit** | $3,000 - $10,000 | Annual financial statements for SPV, expense tracking, distribution calculations. |
| **Website / investor portal** | $1,000 - $5,000 | Hosting, maintenance, and security for investor-facing reporting portal. |

### Total Annual Cost Estimate

| Scenario | Annual Cost | As % of $10M Asset |
|----------|-------------|---------------------|
| **Minimum (lean operation)** | ~$150,000 | 1.5% |
| **Moderate (standard institutional)** | ~$250,000 | 2.5% |
| **Maximum (premium full-service)** | ~$400,000+ | 4.0%+ |

### Critical Insight: The "Drag" on Token Returns

At a 2.5% annual cost, the gemstone must appreciate at least 2.5% per year just for token holders to break even. Over a 10-year hold period, cumulative costs would consume 25%+ of the original asset value (before compounding). This is the fundamental tension in tokenized physical asset models -- the ongoing carrying costs create a meaningful drag on returns.

**Comparison to Masterworks:** Their 1.5% annual management fee plus 20% profit share is a lower drag, but art storage is significantly cheaper than insured vault custody for gemstones.

**Comparison to Paxos Gold:** PAXG absorbs ALL custody costs, funded by transaction fees. This is possible because gold has massive, liquid markets creating ongoing transaction volume. A single gemstone token may not generate enough secondary market volume to fund operations from transaction fees alone.

Sources:
- [SPV Creation Costs 2026](https://www.allocations.com/blog/how-much-does-it-cost-to-create-an-spv-in-2026)
- [Wyoming LLC Annual Fees](https://wyomingllcattorney.com/Form-a-Wyoming-LLC/Annual-Fees-and-Requirements)
- [Delaware LLC Annual Fee](https://www.delawareinc.com/llc/delaware-llc-annual-fee/)
- [Average Cost of Tax Preparation by CPA](https://dimovtax.com/average-cost-of-tax-preparation-by-cpa/)
- [Securitize Transfer Agent](https://securitize.io/transfer-agent-services/tokenize-your-assets-with-securitize-transfer)
- [Chainlink Functions Billing](https://docs.chain.link/chainlink-functions/resources/billing)

---

## 4. Annual Reappraisal -- Is It Required?

### Securities Regulation Requirements

There is no explicit SEC regulation that mandates a specific reappraisal frequency for tokenized physical assets. However, practical and legal requirements effectively make annual reappraisal mandatory:

1. **Fiduciary duty:** The SPV manager has a fiduciary duty to token holders to maintain accurate valuation
2. **Insurance adequacy:** If the stone appreciates above the insured value, token holders are exposed to an insurance gap (see Section 2)
3. **Tax basis:** K-1 reporting requires accurate valuation for partnership tax purposes
4. **Secondary market pricing:** Without updated valuations, tokens may trade at significant premiums or discounts to actual value
5. **SEC fair value guidance:** While not specific to tokenized assets, the SEC's guidance on valuation of portfolio securities requires "good faith" determination of fair value for illiquid assets

### What Comparable Platforms Do

**Masterworks:**
- Artworks appraised **6 months after first close** of offering
- Then revalued **each quarter** (subject to comparable sale data)
- At minimum, every investment appraised **at least every 12 months**
- Valuation based on **Fair Market Value** using comparable sales approach
- Masterworks employs USPAP-certified appraisers; independent appraiser reviews annually
- If no comparable sales exist, value assumed unchanged from prior quarter
- Source: [How Often Are Investments Valued?](https://knowledge.masterworks.com/en/knowledge/how-often-are-my-investments-valued)

**Paxos Gold (PAXG):**
- Gold price updated effectively in real-time via market data
- Monthly third-party audits of physical gold reserves
- No "appraisal" needed -- gold has liquid, transparent market pricing

### Who Pays for the Annual Reappraisal?

The SPV pays for reappraisal from operating reserves. This cost ($2,000-$10,000 per stone) is part of the ongoing expense structure.

### What If the Reappraisal Shows Depreciation?

**Impact on token value:**
- The SPV's NAV decreases proportionally
- Token value on secondary markets should adjust to reflect new NAV
- There is no "floor" or protection -- token holders bear the full loss
- The SPV continues operating; depreciation alone does not trigger dissolution

**Impact on insurance:**
- Insurance coverage may be reduced to match new value (reducing premiums)
- Or coverage maintained at original level as protection against future recovery

**Disclosure obligations:**
- Material depreciation must be disclosed to token holders
- May trigger reporting requirements depending on offering structure (Reg D vs Reg A+)

### What If the Stone Has Appreciated?

**Impact on token value:**
- NAV increases, which should increase secondary market token prices
- **Token value does NOT automatically adjust** -- it adjusts when:
  - NAV is recalculated and published
  - The Chainlink PoR oracle is updated with new valuation data
  - Secondary market participants price in the new information

**Insurance gap risk:**
- If the stone appreciates but insurance is not updated, an underinsurance gap exists
- **The operating agreement should mandate automatic insurance adjustment upon reappraisal**

### How NAV Calculation Works for Tokenized Physical Assets

**NAV Formula:**
```
NAV Per Token = (Asset Value - SPV Liabilities) / Total Tokens Outstanding
```

Where:
- **Asset Value** = Most recent independent appraisal value of the gemstone
- **SPV Liabilities** = Outstanding costs, accrued management fees, accounts payable
- **Total Tokens Outstanding** = Fixed at issuance (minus any burned tokens)

**Example for a $10M gemstone with 10,000 tokens:**
```
Year 1: ($10,000,000 - $250,000 expenses) / 10,000 = $975 per token
Year 2: ($10,500,000 appreciation - $500,000 cumulative expenses) / 10,000 = $1,000 per token
Year 3: ($11,000,000 appreciation - $750,000 cumulative expenses) / 10,000 = $1,025 per token
```

**Update frequency:** For illiquid assets like gemstones, NAV is realistically updated quarterly or annually (not daily like mutual funds). More frequent updates (monthly) may be provided if market data supports it, but gemstones lack the price transparency of gold or equities.

Sources:
- [SEC Statement on Tokenized Securities](https://www.sec.gov/newsroom/speeches-statements/corp-fin-statement-tokenized-securities-012826)
- [Masterworks Valuation](https://knowledge.masterworks.com/en/knowledge/how-are-my-investment-valued)
- [Net Asset Value Definition](https://www.investor.gov/introduction-investing/investing-basics/glossary/net-asset-value)

---

## 5. Gemstone Value Tracking and Appreciation Data

### Major Indices and Databases

#### 1. Gemval Aggregate Index (GVA)
- **What it is:** Calculated as the total value of 26 standard gemstone specimens; represents overall pricing trends in the jewelry market
- **Data since:** July 1, 2005
- **Current value:** 225.85% (August 2025), meaning gemstones have more than doubled since 2005
- **Methodology:** Machine learning model trained on collected pricing data from online gem retailers; prices rejected if they appear as outliers
- **Website:** [gemval.com/gva/](https://gemval.com/gva/)

#### 2. GemGuide (by Gemworld International)
- **What it is:** 40+ years of wholesale gemstone price trend research; industry standard for independent, market-driven pricing
- **Published:** Bimonthly with online updates when market volatility warrants
- **Coverage:** Most comprehensive pricing publication in the industry including colored stones, opals, pearls
- **Pricing:** Subscription-based (2,250 or 5,000 pricing lookups per year)
- **Website:** [gemguide.com](https://www.gemguide.com/the-gemguide/)

#### 3. Rapaport Diamond Price List
- **What it is:** International benchmark for diamond pricing; updated weekly (Thursdays at 11:59 PM EST)
- **Scope:** Prices diamonds by size, color (D-M), and clarity (IF-I3)
- **Note:** Diamonds only -- does NOT cover colored gemstones (ruby, sapphire, emerald)
- **History:** Founded by Martin Rapaport; recognized as most dependable source in the diamond industry
- **Website:** [rapaport.com/diamond-price-list/](https://rapaport.com/diamond-price-list/)

#### 4. Gemfields Auction Data
- **What it is:** Actual wholesale auction results from the world's largest colored gemstone mining company
- **Coverage:** Emerald auctions (from Kagem mine, Zambia) and ruby auctions (from Montepuez, Mozambique)
- **History:** 53 auctions since July 2009 generating $1.147 billion in total emerald revenues
- **Recent data (2025):**
  - Higher-quality emerald auction (Aug-Sep 2025): $32M revenue, $160.78/ct average
  - Commercial emerald auction (Apr 2025): $16.4M revenue, $6.87/ct average
  - Mixed-quality ruby auction (Jun 2025): $31.7M revenue, $461.48/ct average
- **Website:** [gemfieldsgroup.com/category/new-and-announcements/auction-update/](https://www.gemfieldsgroup.com/category/new-and-announcements/auction-update/)

#### 5. Christie's and Sotheby's Auction Records
- **What it is:** The definitive price benchmark for exceptional individual stones
- **Provides:** Per-carat records and total sale records for the highest-quality gems
- **Limitation:** Only captures the very top end of the market; not representative of "average" gemstones

#### 6. Knight Frank Luxury Investment Index (KFLII)
- **What it is:** Tracks luxury asset classes including jewelry, art, wine, watches, and colored diamonds
- **Relevance:** Reports colored gemstones at ~9% average annual return over the past decade
- **Published:** Annually in the Knight Frank Wealth Report

### Historical Appreciation Data

#### Long-Term (Since 1995)
| Gemstone | Appreciation Since 1995 | Source |
|----------|------------------------|--------|
| Ruby | +1,200% | The Natural Gem |
| Sapphire | Approximately tripled+ | The Natural Gem |
| Emerald | Approximately tripled+ | The Natural Gem |

#### 10-Year Performance (2013-2023)
| Gemstone | Appreciation | Annual Return (CAGR) |
|----------|-------------|---------------------|
| Ruby (Mozambique, 3.577 ct) | +550% | 18.41% |
| Blue Sapphire (6.142 ct) | +250% | 11.24% |
| Emerald (Zambia, 1.477 ct) | +60% | 2.92% |

Source: [The Natural Gem Performance](https://thenaturalgem.com/en/performance-of-gemstones/)

#### Average Annual Returns (Market-Wide)
| Gemstone | Annual Average Appreciation |
|----------|---------------------------|
| Ruby | 8% |
| Sapphire | 6% |
| Emerald | 5% |
| Fine/rare specimens | 10-12% |

#### Price Per Carat Trends (Historical)

| Era | Burmese Ruby ($/ct) | Kashmir Sapphire ($/ct) | Colombian Emerald ($/ct) |
|-----|--------------------|-----------------------|-------------------------|
| 1900-1950 | $100-200 | $100-200 | $50-150 |
| 1950-1980 | $5,000-10,000 | $5,000-10,000 | $3,000-8,000 |
| 1980-2000 | $50,000-100,000 | $40,000-80,000 | $30,000-60,000 |
| 2015+ (auction records) | $1,266,901/ct (Sunrise Ruby) | $200,000+/ct | $305,516/ct (Rockefeller) |

Source: [Investment-Grade Gemstones: Historical Prices](https://news.mineralogicalsocietyofdc.org/investment-grade-gemstones/)

#### Record Auction Prices

| Stone | Size | Price | Per Carat | Year | House |
|-------|------|-------|-----------|------|-------|
| Sunrise Ruby | 25.59 ct | $30.3M | $1,266,901 | 2015 | Sotheby's Geneva |
| Crimson Flame Ruby | 15.04 ct | ~$18M | $1,200,000 | -- | Auction record/ct |
| Blue Belle of Asia Sapphire | 392.52 ct | $17.3M | -- | 2014 | Christie's Geneva |
| Rockefeller Emerald | 18.04 ct | $5.5M | $305,516 | 2017 | Christie's |
| "Agha Khan" Emerald | 37 ct | $8.8M | ~$238,000 | 2024 | Christie's Geneva |

### Factors That Cause Appreciation

1. **Mine closures / deposit exhaustion** -- Kashmir sapphire deposits are exhausted; Burmese ruby mines face sanctions
2. **Increased demand** -- Growing wealth in Asia and Middle East
3. **Provenance discovery** -- If origin is confirmed as prestigious (Kashmir, Burma, Colombia)
4. **Supply sanctions** -- U.S. sanctions on Myanmar gem mining have made Burmese rubies/sapphires 2-3x pricier than pre-COVID levels
5. **Treatment revelation (positive)** -- Confirmation that a stone is untreated increases value significantly
6. **Auction attention** -- Record-breaking sales create awareness and demand for similar stones
7. **Certified Kashmir sapphires** -- 25-30% annual appreciation (2021-2024) due to extreme scarcity

### Factors That Cause Depreciation

1. **Treatment revelation (negative)** -- Discovery that a "natural" stone was heated or treated can dramatically reduce value; "treatment status matters because it cannot be reversed"
2. **Origin dispute** -- "The colored stone trade wants laboratories to determine gemstone origins with 100% accuracy, but science cannot provide this." If a Kashmir origin attribution is later questioned, value can drop 5-10x
3. **New source discovery** -- A large new deposit of similar quality stones increases supply
4. **Market fashion shifts** -- Demand for specific gemstone types can change over time
5. **Lab-grown competition** -- For diamonds, lab-grown stones have caused significant natural diamond price declines; for colored stones, this risk is currently lower but growing
6. **Economic downturns** -- Luxury goods spending contracts in recessions; 2018 total fine jewelry auction sales fell ~15% from 2017
7. **Fraud / authenticity questions** -- If a stone's certification is ever questioned, value impact is immediate and severe

### Academic Research

**"Hard Assets: The Returns on Rare Diamonds and Gems"** (Renneboog & Spaenjers, Finance Research Letters, 2012)
- Examined auction data 1999-2010
- Annualized real returns: white diamonds 10.0%, colored diamonds 5.5%, other gems 6.8% (2003-2010)
- Full period 1999-2010: white diamonds 6.4%, colored diamonds 2.9%
- Both diamond categories outperformed stocks over this period
- Diamond returns below gold over same period
- Reward-to-volatility of white diamonds similar to government bonds
- **Key finding:** Gem returns covary positively with stock returns, underlining wealth-driven demand
- Source: [ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/S1544612312000323)

### Comparison to Traditional Assets

| Asset Class | Long-Term Annualized Return | Source Period |
|-------------|---------------------------|--------------|
| S&P 500 (Stocks) | 8.2-9.9% | 30-year / since 1928 |
| Investment-grade gemstones | 5-8% (standard) / 10-12% (exceptional) | Various |
| Gold | 5.0-6.8% | 30-year / since 1928 |
| Corporate bonds | 4.6-7.2% | 30-year / since 1928 |
| Real estate | 4.3-4.8% | 30-year / since 1928 |
| Cash | 3.3% | Since 1928 |

**Key insight:** From 2020 to 2023, "appreciation in the prices of sapphires, emeralds, rubies, opals, pearls, and tourmalines beat the S&P by substantial margins." However, gemstones are illiquid (30-45 days to find a specialized buyer vs. near-instant for gold), and collectibles face a maximum federal capital gains tax of 28% (vs. 0-20% for most other capital assets).

Sources:
- [Gemval Charts](https://gemval.com/chart/)
- [Colored Gemstones as Alternative Investment (Nasdaq)](https://www.nasdaq.com/articles/colored-gemstones-as-an-alternative-investment)
- [The Natural Gem Performance](https://thenaturalgem.com/en/performance-of-gemstones/)
- [Investment-Grade Gemstones](https://news.mineralogicalsocietyofdc.org/investment-grade-gemstones/)
- [Gemfields Auction Results](https://www.gemfieldsgroup.com/auction-results-higher-quality-emeralds-12-9-25/)
- [Ceylons Munich Wealth Management Guide](https://www.ceylons.de/blog-en/gemstones-alternative-assets-wealth-management)

---

## 6. Token Value vs Stone Value -- How Are They Connected?

### Does the Token Automatically Appreciate When the Stone Does?

**No.** Token appreciation is NOT automatic. The connection works through a series of steps:

1. **Stone appreciates** (determined by independent appraisal or market data)
2. **NAV is recalculated** (SPV manager updates the books)
3. **Oracle updated** (Chainlink PoR feed reflects new valuation)
4. **Information published** (investor reports, on-chain data)
5. **Market reprices** (secondary market participants adjust buy/sell prices)

Each step introduces a delay. For a quarterly-appraised gemstone, token value may lag actual stone value by weeks to months.

### The NAV Mechanism

**NAV Per Token = (Current Stone Value - SPV Liabilities) / Tokens Outstanding**

- Updated at reappraisal intervals (quarterly or annually for gemstones)
- Published to token holders and on-chain via oracle
- Represents the "fundamental" value of each token
- Does NOT prevent tokens from trading at different prices on secondary markets

### Can Tokens Trade at a Premium or Discount to NAV?

**Yes -- exactly like a closed-end fund.**

Tokenized physical assets behave like closed-end funds because:
- Fixed number of tokens outstanding (like fixed shares)
- No daily creation/redemption mechanism (unlike ETFs or mutual funds)
- Secondary market price determined by supply and demand

| Scenario | Premium/Discount | Why It Happens |
|----------|-----------------|----------------|
| Strong demand, limited supply | **Premium to NAV** | Buyers willing to pay above NAV for exposure; scarcity of available tokens |
| Weak demand, forced sellers | **Discount to NAV** | More sellers than buyers; illiquidity forces sellers to accept lower prices |
| Uncertainty about stone value | **Discount to NAV** | "Trust discount" -- if investors cannot verify asset value in real-time, they price in uncertainty |
| Recent positive reappraisal | **Temporary premium** | Market excitement; buyers front-run anticipated NAV increase |
| Approaching liquidation event | **Converges to NAV** | As the stone approaches sale, discount/premium narrows |

**Historical data from closed-end funds:** Traditional closed-end funds routinely trade at 5-15% discounts to NAV. For illiquid, opaque underlying assets like gemstones, the discount could be even wider.

### What Determines Secondary Market Price?

Secondary market token price is influenced by:

1. **Published NAV** -- the anchor value
2. **Liquidity** -- how many buyers/sellers are active
3. **Time since last appraisal** -- older appraisals create more uncertainty
4. **Market sentiment** -- overall crypto/RWA market conditions
5. **Comparable sales** -- if similar gemstones sell at auction, it affects perceived value
6. **Platform reputation** -- trust in the issuer, custodian, and oracle reliability
7. **Time to expected liquidation** -- closer to sale date typically means narrower spread

### How Comparable Platforms Handle NAV vs Market Price

**Masterworks:**
- Quarterly reappraisal based on comparable art sales
- Secondary market trading available (with 90-day lock-up)
- Shares can trade at premium or discount to NAV
- If no comparable sales, NAV assumed unchanged

**Closed-End Funds (Traditional):**
- "Shares of closed-end funds may trade above (a premium) or below (a discount) to NAV"
- Prices determined by supply and demand
- Market prices may fluctuate through the trading day at different levels than NAV
- Source: [BlackRock CEF Guide](https://www.blackrock.com/us/individual/literature/investor-education/understanding-closed-end-fund-premiums-and-discounts.pdf)

**Tokenized Funds Generally:**
- "Tokenisation of a fund does not change the way a fund is valued -- NAV per token rather than NAV per share"
- Secondary market trading should increase liquidity vs. traditional alternatives
- Source: [Investment Association Tokenised Funds](https://www.theia.org/sites/default/files/2020-11/Tokenised%20funds%201%20-%20What%20why%20how.pdf)

Sources:
- [Understanding Closed-End Fund Premiums and Discounts (BlackRock)](https://www.blackrock.com/us/individual/literature/investor-education/understanding-closed-end-fund-premiums-and-discounts.pdf)
- [Closed-End Fund Discounts and Premiums (Fidelity)](https://www.fidelity.com/learning-center/investment-products/closed-end-funds/discounts-and-premiums)
- [Financial Stability Implications of Tokenization (FSB)](https://www.fsb.org/uploads/P221024-2.pdf)
- [Tokenized Investment Funds (NY Fed)](https://libertystreeteconomics.newyorkfed.org/2025/09/tokenized-investment-funds/)

---

## 7. ERC-3643 -- Detailed Operational Breakdown

### Complete Architecture (from EIP-3643 Specification)

ERC-3643 consists of 7 interconnected smart contracts:

```
Token Contract (IERC3643)
    |
    |-- Identity Registry
    |       |-- Identity Registry Storage
    |       |-- Trusted Issuers Registry
    |       |-- Claim Topics Registry
    |
    |-- Compliance Module (Modular Compliance)
    |
    |-- Agent Role Management (IAgentRole)
```

### What PleoChrome Needs to Manage vs What Partners Handle

| Responsibility | Who Manages | Details |
|---------------|-------------|---------|
| Token contract deployment | Brickken (initial) / PleoChrome (ongoing) | Brickken deploys via factory contract; PleoChrome owns the deployed contract |
| Identity Registry | PleoChrome (or delegated agent) | Adding/removing investors from the whitelist |
| Compliance Module | PleoChrome (with legal counsel) | Updating transfer rules, jurisdiction restrictions |
| Trusted Issuers Registry | PleoChrome (Owner) | Adding/removing KYC verification providers |
| Claim Topics Registry | PleoChrome (Owner) | Defining what claims are required (e.g., KYC, accredited investor) |
| Oracle (PoR) | Chainlink (decentralized) | PleoChrome provides data source; Chainlink network delivers it on-chain |
| KYC/AML verification | Third-party claim issuer (e.g., Synaps, Jumio) | Issues on-chain claims to investor identities |
| Cap table / Transfer agent | PleoChrome or Securitize | Maintains investor records, handles distributions |

### Identity Registry Management After Launch

**Who can add/remove investors?**
- The **Owner** role (PleoChrome's admin wallet) can add/remove agents
- **Agents** (designated wallets/contracts) execute day-to-day operations:
  - `registerIdentity(address, ONCHAINID, countryCode)` -- Add new investor
  - `deleteIdentity(address)` -- Remove investor
  - `updateIdentity(address, newONCHAINID)` -- Update investor's identity contract
  - `updateCountry(address, newCountryCode)` -- Change investor's jurisdiction
  - `batchRegisterIdentity(addresses, ONCHAINIDs, countryCodes)` -- Bulk enrollment

**Ongoing management tasks:**
- Process new investor onboarding (register identity after KYC/AML clearance)
- Remove investors who fail ongoing compliance (sanctions hit, expired KYC)
- Update investor details when personal information changes
- Country code management for jurisdiction-based rules

### Compliance Module Management

**What the Compliance Module does:**
- Checks every transfer via `canTransfer(from, to, amount)` before execution
- Enforces rules like: max token holders, max tokens per holder, geographic restrictions, lock-up periods, transfer volume limits
- Returns true/false -- if false, the transfer reverts on-chain

**How rules are updated:**
- The Compliance contract "allows for dynamic addition and modification of compliance rules"
- Rules are implemented as **modular compliance modules** that can be added/removed
- Example modules: `MaxBalanceModule`, `CountryRestrictionsModule`, `ExchangeMonthlyLimitsModule`
- PleoChrome (as Owner) calls `addModule()` or `removeModule()` to change rules

**When rules need updating:**
- New jurisdiction restrictions (e.g., OFAC adds a country)
- Regulatory changes requiring new investor qualification criteria
- Adding new qualified investors from new jurisdictions
- Modifying transfer limits or lock-up periods

### Trusted Issuers Registry Management

**What it is:** A whitelist of entities authorized to issue identity claims.

**Functions:**
- `addTrustedIssuer(issuerAddress, claimTopics[])` -- Add a new verification provider
- `removeTrustedIssuer(issuerAddress)` -- Remove a verification provider
- `updateIssuerClaimTopics(issuerAddress, newTopics[])` -- Change what claims an issuer can validate
- `getTrustedIssuersForClaimTopic(topicId)` -- Look up who can issue a specific claim type

**Ongoing decisions:**
- Which KYC providers to trust? (If Synaps shuts down, add a replacement)
- Which claim topics to require? (E.g., accredited investor status, country of residence)
- Periodically review issuer list to ensure all issuers are still operational and trustworthy

### Administrative Functions -- Complete List

#### Owner-Level Functions (PleoChrome Admin)
| Function | What It Does | When Used |
|----------|-------------|-----------|
| `addAgent(address)` | Grant agent privileges | Onboarding new operational wallets |
| `removeAgent(address)` | Revoke agent privileges | Decommissioning old wallets, security breach |
| `setIdentityRegistry(address)` | Change the identity registry contract | Registry upgrade or migration |
| `setCompliance(address)` | Change the compliance contract | Compliance module upgrade |
| `setOnchainID(address)` | Set the token's on-chain identity | Initial setup, identity migration |
| `setName(string)` | Update token name | Rebranding (rare) |
| `setSymbol(string)` | Update token symbol | Rebranding (rare) |
| Trusted Issuers Registry management | Add/remove/update trusted KYC issuers | Ongoing |
| Claim Topics Registry management | Add/remove required claim types | Regulatory changes |

#### Agent-Level Functions (Automated or Operational)
| Function | What It Does | When Used |
|----------|-------------|-----------|
| `mint(to, amount)` | Create new tokens | Initial distribution, additional issuance |
| `burn(from, amount)` | Destroy tokens | Redemption, token buyback |
| `forcedTransfer(from, to, amount)` | Transfer without compliance check | Court order, regulatory action, estate settlement |
| `pause()` / `unpause()` | Halt/resume ALL transfers | Emergency (hack, regulatory freeze, security breach) |
| `setAddressFrozen(address, bool)` | Freeze/unfreeze entire wallet | Sanctions hit, fraud investigation |
| `freezePartialTokens(address, amount)` | Lock specific amount in a wallet | Partial compliance action, escrow |
| `unfreezePartialTokens(address, amount)` | Unlock specific frozen amount | Resolution of compliance issue |
| Batch variants of all above | Execute operations in bulk | Efficiency for multiple investors |

### Legal Implications of the "Agent" Role

The Agent role in ERC-3643 carries significant legal implications:

1. **Fiduciary responsibility:** Whoever controls agent wallets has the power to freeze, force-transfer, and burn investor tokens -- this must be clearly disclosed in the offering documents
2. **Key management:** Agent private keys must be secured with institutional-grade custody (hardware wallets, multisig, time-locks)
3. **Regulatory authority:** The ability to pause the entire token or freeze individual wallets makes the agent effectively a "regulatory enforcement mechanism" -- regulators may view this as a positive compliance feature OR as a centralization risk
4. **Automation risk:** If agents are automated (smart contracts), bugs in the automation could freeze legitimate investors or allow non-compliant transfers
5. **Succession planning:** If PleoChrome ceases operations, who inherits the agent keys? This must be addressed in the operating agreement

### How Regulatory Changes Get Implemented

**Process for implementing a regulatory change:**

1. **Detection:** Legal counsel identifies new regulation affecting token operations
2. **Analysis:** Determine which compliance module(s) need updating
3. **Development:** Code new module or update existing module parameters
4. **Testing:** Deploy and test on testnet
5. **Governance review:** PleoChrome management approves the change
6. **Deployment:** Deploy new module to mainnet
7. **Integration:** Owner calls `addModule()` to activate, or `removeModule()` + `addModule()` to replace
8. **Communication:** Notify all token holders of compliance change

**Chainlink integration:** The Chainlink Automated Compliance Engine can be connected directly to ERC-3643, enabling "plug-and-play" compliance templates that can be deployed and reused across multiple tokens.

Sources:
- [ERC-3643 EIP Specification](https://eips.ethereum.org/EIPS/eip-3643)
- [ERC-3643 Documentation](https://docs.erc3643.org/erc-3643)
- [Identity Registry Documentation](https://docs.erc3643.org/erc-3643/smart-contracts-library/onchain-identities/identity-registry)
- [Compliance Management Documentation](https://docs.erc3643.org/erc-3643/smart-contracts-library/compliance-management)
- [Permissioned Tokens Documentation](https://docs.erc3643.org/erc-3643/smart-contracts-library/permissioned-tokens)
- [ERC-3643 Explained (QuillAudits)](https://www.quillaudits.com/blog/rwa/erc-3643-explained)
- [Introduction to ERC-3643 (Chainalysis)](https://www.chainalysis.com/blog/introduction-to-erc-3643-ethereum-rwa-token-standard/)
- [ERC-3643 Presented to SEC](https://www.erc3643.org/news/erc-3643-presented-to-the-sec-crypto-task-force)

---

## 8. Risk Scenarios -- What Could Go Wrong Long-Term?

### Scenario 1: Vault Robbery

**Likelihood:** Low (Brink's/Malca-Amit Grade XII vaults)
**Impact:** Total loss of underlying asset

**What happens:**
1. Specie insurance claim filed immediately
2. Insurer investigates (specialized specie claims adjusters)
3. If covered: insurer pays claim to SPV up to insured value
4. SPV distributes insurance proceeds to token holders (or reinvests per operating agreement)
5. If theft was due to vault negligence: insurer may subrogate against vault operator

**Residual risks:**
- Insurance gap if stone appreciated above insured value
- Investigation delays (could take months)
- Insurer may dispute claim if security protocols were not maintained
- Token holders may panic-sell on secondary market before claim is settled

### Scenario 2: Natural Disaster at Vault Location

**Likelihood:** Very low (Grade XII vaults are hardened against most threats)
**Impact:** Potentially total loss

**What happens:**
1. Most natural disasters (fire, flood, earthquake, windstorm) ARE covered by specie insurance
2. Vault operators maintain business continuity plans
3. If vault is destroyed: insurance claim processed; specie insurance covers physical loss

**Residual risks:**
- Earthquake coverage may have high deductible in seismic zones
- "Acts of war" exclusion could apply if disaster is terrorism-related
- Recovery of the physical stone from rubble may take time
- Extended outage of vault access does NOT affect on-chain token functionality

### Scenario 3: Insurance Company Goes Bankrupt

**Likelihood:** Very low for A-rated insurers; moderate for niche underwriters
**Impact:** Loss of coverage; potential uninsured total loss

**What happens:**
1. State insurance guarantee associations may cover claims up to certain limits
2. SPV must immediately secure replacement coverage
3. During gap period, stone is uninsured -- catastrophic risk

**Mitigation strategies:**
- Use only A-rated or better insurance carriers
- Consider split coverage across multiple insurers
- Maintain "excess and surplus" layer with separate carrier
- Operating agreement should mandate minimum insurer credit rating

### Scenario 4: Brickken Ceases Operations

**Likelihood:** Moderate (startup risk)
**Impact:** Loss of management tools, NOT loss of tokens or assets

**What happens:**
1. ERC-3643 tokens exist independently on the blockchain -- they persist regardless of Brickken
2. Smart contract code is immutable once deployed (though proxy patterns allow upgrades)
3. PleoChrome retains Owner and Agent keys to all contracts
4. Management dashboard/tools become unavailable

**Required actions:**
- PleoChrome must maintain backup ability to interact with contracts directly (via Etherscan, custom UI, or Hardhat scripts)
- Identity Registry, Compliance Module, and Trusted Issuers Registry continue operating on-chain
- A replacement management interface must be built or sourced

**Mitigation:**
- Maintain complete contract ABIs and deployment records off-chain
- Keep Owner/Agent wallet private keys in institutional custody independent of Brickken
- Document all contract addresses and interaction procedures

### Scenario 5: Chainlink Ceases Operations

**Likelihood:** Very low (largest oracle network, $10B+ market cap)
**Impact:** Loss of on-chain Proof of Reserve verification

**What happens:**
1. PoR oracle feed stops updating -- smart contracts that read PoR may behave unpredictably
2. If token minting is gated by PoR, new minting may be impossible
3. Existing tokens continue to function (transfers, trading)
4. Compliance checks continue to function (identity-based, not oracle-dependent)

**Required actions:**
- Implement fallback oracle mechanism (Band Protocol, API3, Pyth, or Tellor)
- Or switch to a different attestation mechanism (e.g., manual attestation with multisig)

**Mitigation:**
- Design smart contracts with oracle fallback logic
- Maintain the option to update the oracle address in the contract
- Consider multi-oracle architecture from the start (Chainlink primary, API3 backup)
- Source: [Top Blockchain Oracles Comparison](https://ecoinimist.com/2025/07/13/top-5-blockchain-oracles-chainlink-band-api3-pyth-and-tellor/)

### Scenario 6: Stone Authenticity Later Questioned

**Likelihood:** Low with proper initial due diligence; non-zero
**Impact:** Potentially catastrophic (total loss of perceived value)

**What happens:**
1. If a lab later disputes origin (e.g., "probably Kashmir" vs. "definitely Kashmir"), value could drop 5-10x
2. If stone discovered to be treated when certified as untreated, value impact is severe and permanent -- "treatment status matters because it cannot be reversed"
3. GIA acknowledges "science cannot provide 100% accuracy" for origin determination of some stones
4. Token holders suffer immediate secondary market price collapse
5. Insurance does NOT cover authenticity disputes -- this is a title/provenance risk, not physical loss

**Mitigation:**
- Multiple independent lab certifications (GIA, Gubelin, SSEF, Lotus Gemology)
- Detailed provenance documentation and chain of custody
- Operating agreement should address authenticity dispute procedures
- Consider "authenticity insurance" or "title insurance" equivalent if available
- Source: [The Geographic Origin Dilemma (GIA)](https://www.gia.edu/gems-gemology/winter-2019-geographic-origin-dilemma)

### Scenario 7: Regulatory Change Makes Tokens Non-Compliant

**Likelihood:** Moderate (regulatory landscape is actively evolving)
**Impact:** Ranges from operational adjustment to forced delisting

**What happens:**
- SEC has confirmed: "A tokenized security is still a security, and the federal securities laws apply in the same way"
- ERC-3643's modular compliance is specifically designed to adapt to regulatory changes
- If new jurisdiction restrictions are imposed: add new compliance module
- If token structure becomes non-compliant: may require token migration, additional disclosures, or new registrations

**Possible regulatory risks:**
- New accredited investor rules that disqualify existing holders
- New jurisdiction-specific requirements (e.g., EU MiCA regulations)
- Changes to Reg D or Reg A+ that affect the offering exemption
- Reclassification of tokens as different type of security
- Source: [SEC Statement on Tokenized Securities](https://www.sec.gov/newsroom/speeches-statements/corp-fin-statement-tokenized-securities-012826)

**ERC-3643 response capabilities:**
- Freeze non-compliant wallets via `setAddressFrozen()`
- Pause all trading via `pause()` while implementing changes
- Force-transfer tokens from non-compliant to compliant wallets
- Update compliance module to enforce new rules
- Add new trusted issuers for new verification requirements

### Scenario 8: All Token Holders Want to Redeem Simultaneously

**Likelihood:** Low but possible during market stress
**Impact:** Severe -- gemstones are illiquid

**What happens:**
1. Gemstones take 30-45 days minimum to find a specialized buyer
2. Forced/rushed sale could result in significant discount to appraised value
3. Research shows: "The transparency of blockchain-based transactions acts as a coordination device among investors, and as redemptions are immediately visible to all market participants, the risk of runs may be exacerbated"
4. Unlike gold or stocks, a single gemstone cannot be partially liquidated
5. The SPV would need to sell the entire stone and distribute proceeds pro rata
- Source: [Financial Stability Implications of Tokenized Funds (NY Fed)](https://libertystreeteconomics.newyorkfed.org/2025/09/tokenized-investment-funds/)

**Structural protections:**
- Operating agreement should specify redemption procedures and timelines
- Lock-up periods prevent immediate redemption demands
- Redemption windows (e.g., quarterly) limit frequency of redemption requests
- Queue-based redemption with notice period (e.g., 90 days)
- Secondary market trading provides an alternative exit without requiring actual redemption
- The SPV manager has discretion to delay redemption if forced sale would harm remaining holders

### Scenario 9: Stone Depreciates Significantly Below Offering Price

**Likelihood:** Moderate (depends on gemstone type, market conditions, hold period)
**Impact:** Direct financial loss for all token holders

**What happens:**
1. NAV per token drops below offering price
2. Tokens trade at a loss on secondary markets
3. No "floor" or protection exists -- token holders bear the full loss
4. SPV continues operating (depreciation alone does not trigger dissolution)
5. Ongoing costs continue to accrue, further reducing NAV
6. If costs exceed remaining value, SPV may need to wind down

**Key insight:** Unlike Masterworks (which claims all paintings sold to date have earned some profit), gemstones carry real depreciation risk, particularly for:
- Stones from disputed origins
- Stones later found to be treated
- Market segments that fall out of fashion
- Stones purchased at the peak of a demand cycle

**Mitigation:**
- Rigorous initial selection of investment-grade, untreated stones with undisputed provenance
- Conservative initial pricing (below current market to provide margin of safety)
- Diversification across multiple stones (if feasible)
- Clear disclosure of risks in offering documents

Sources:
- [Tokenized Asset Risks (Taurus)](https://www.taurushq.com/legal/regulatory-risk/risks-digitalassets/)
- [Legal Guide to RWA Tokenization (Buzko Krasnov)](https://www.buzko.legal/content-eng/legal-guide-to-real-world-assets-rwa-tokenization)
- [Munich Re Digital Asset Protection](https://www.munichre.com/en/solutions/for-industry-clients/crypto-cover.html)
- [ISDA Bankruptcy in Digital Asset Markets](https://www.isda.org/a/CrLgE/Navigating-Bankruptcy-in-Digital-Asset-Markets-Digital-Asset-Intermediaries-and-Customer-Asset-Protection.pdf)
- [Tokenize Everything, But Can You Sell It?](https://arxiv.org/html/2508.11651v1)
- [BIS Bulletin on Tokenization](https://www.bis.org/publ/bisbull115.pdf)

---

## Summary: Critical Decisions PleoChrome Must Make

### Immediate Decisions (Before First Offering)

1. **Fee model:** Management fee (1.5-2.5% annual)? Reserve fund? Share dilution? Combination?
2. **Reserve sizing:** How many months of operating expenses to retain from offering proceeds?
3. **Insurance structure:** Which carrier? Agreed value or market value? Annual revaluation trigger?
4. **Vault selection:** Brink's vs. Malca-Amit vs. other? Allocated/segregated mandatory
5. **Oracle architecture:** Chainlink-only or multi-oracle with fallback?
6. **Compliance module design:** Which jurisdictions? Which investor qualifications? Lock-up period?
7. **Redemption procedures:** Quarterly windows? Notice period? Queue mechanism?
8. **Key management:** Who holds Owner keys? Agent keys? Succession plan?

### Ongoing Operational Responsibilities

1. **Quarterly:** Publish NAV, file compliance reports, review investor eligibility
2. **Annually:** Independent reappraisal, insurance renewal/adjustment, tax preparation (K-1s), state filing
3. **As needed:** Process new investor onboarding, handle redemption requests, update compliance modules for regulatory changes, manage oracle feeds
4. **Continuously:** Monitor sanctions lists, manage Identity Registry, process secondary market transfers

### Cost Planning

For a single $10M gemstone asset, plan for **$150,000-$400,000 annually** in operating costs (1.5-4.0% of asset value). This cost must be clearly disclosed to investors and funded either through:
- Upfront reserve from offering proceeds
- Annual management fee deducted from NAV
- Or a combination of both
