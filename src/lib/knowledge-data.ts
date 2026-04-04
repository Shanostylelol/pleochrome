import { Layers, Coins, Landmark, Handshake, ArrowLeftRight } from 'lucide-react'

export interface Article {
  slug: string
  title: string
  subtitle: string
  author: string
  date: string
  readTime: string
  model: string
  modelColor: string
  icon: typeof Layers
  excerpt: string
  content: string
  sources: { label: string; url: string }[]
}

export const VALUE_MODEL_ARTICLES: Article[] = [
  {
    slug: 'tokenization',
    title: 'The Liquidity Paradox of Tokenized Real-World Assets',
    subtitle: 'Why creating a token is only half the battle — and what the data tells us about the road ahead',
    author: 'Shane Pierson',
    date: 'April 2026',
    readTime: '12 min read',
    model: 'Tokenization',
    modelColor: '#1A8B7A',
    icon: Coins,
    excerpt: 'Over $36 billion in real-world assets exist on-chain as of 2026. Yet most tokenized assets cannot be easily sold once purchased. We analyze the empirical data behind the liquidity gap.',
    content: `## The Scale of What Has Been Built

The tokenization of real-world assets has grown from roughly $5 billion in 2022 to over $36 billion by late 2025 — a sevenfold increase in three years. Analysts project this market could reach $18.9 trillion by 2033, according to BCG and Ripple forecasts.

But scale of issuance does not equal scale of liquidity. As Rischan Mafrur of Macquarie University documented in his 2025 research paper "Tokenize Everything, But Can You Sell It?", the gap between tokenization and tradability remains the industry's defining challenge.

## What the On-Chain Data Reveals

Mafrur's analysis draws on data from RWA.xyz and Etherscan to examine what happens after assets are tokenized. Four findings stand out:

**Market cap does not correlate with trading activity.** BlackRock's BUIDL fund — the largest tokenized RWA at nearly $2 billion — had only 85 unique holders and 30 monthly active addresses as of mid-2025. Compare this to Paxos Gold (PAXG), which supports over 69,000 holders despite a smaller market cap.

**Most tokens change hands rarely.** On the RealT platform, one of the earliest tokenized real estate markets, token ownership changed hands on average only once per year.

**Transfer activity is sporadic, not sustained.** Most institutional tokens show longest active streaks of only 3-13 days. Activity spikes during issuance and redemption events, then goes quiet.

**Platforms are built for issuance, not trading.** Most RWA protocols prioritize primary issuance and asset onboarding over secondary liquidity. Maple facilitates tokenized loan origination but lacks integrated exit mechanisms. RealT restricts trading to platform-managed OTC channels.

## Five Structural Barriers

The research identifies five reinforcing barriers to liquidity: fragmented marketplaces (no central exchange for RWA tokens), regulatory gating (accredited investor requirements reduce the buyer pool), valuation opacity (no continuous pricing benchmarks for unique assets), absence of market makers (no dedicated actors providing two-sided markets), and technological friction (wallet management, gas fees, cross-chain incompatibility).

## The Path Forward

Despite these challenges, meaningful progress is underway. The Depository Trust Company received SEC approval in late 2025 to offer tokenization services. Nasdaq has proposed rule changes to enable tokenized securities trading. MakerDAO has integrated over $2 billion in tokenized assets as collateral for its DAI stablecoin. And the SEC's January 2026 statement provided clearer guidance on how tokenized securities fit within existing regulatory frameworks.

The future of RWA tokenization depends not on the technology — that works — but on building the legal, institutional, and market infrastructure that transforms a token from a digital certificate into a tradable financial instrument.

## What This Means for Asset Holders

If you hold a high-value physical asset and are considering tokenization, the data suggests you should plan for longer liquidity timelines than marketing materials may imply, evaluate whether a hybrid approach (combining tokenization with collateral-based lending or broker channels) better serves your needs, and invest in transparency — GIA certification, independent appraisals, on-chain proof of reserve — because the research consistently shows that valuation opacity is the primary barrier investors cite.

Tokenization is not a shortcut to liquidity. It is a structural improvement in how assets are represented, transferred, and governed. The liquidity will follow as the surrounding infrastructure matures — but asset holders should enter with realistic expectations.`,
    sources: [
      { label: 'Mafrur, R. (2025). "Tokenize Everything, But Can You Sell It?" arXiv:2508.11651', url: 'https://arxiv.org/abs/2508.11651' },
      { label: 'SEC Statement on Tokenized Securities (Jan 2026)', url: 'https://www.sec.gov/newsroom/speeches-statements/corp-fin-statement-tokenized-securities-012826' },
      { label: 'CoinGecko 2025 RWA Report', url: 'https://assets.coingecko.com/reports/2025/CoinGecko-2025-RWA-Report.pdf' },
      { label: 'RWA.xyz Market Data', url: 'https://app.rwa.xyz' },
      { label: 'BlackRock BUIDL on Binance (Nov 2025)', url: 'https://www.coindesk.com/business/2025/11/14/blackrock-s-usd2-5b-tokenized-fund-gets-listed-as-collateral-on-binance-expands-to-bnb-chain' },
    ],
  },
  {
    slug: 'fractional',
    title: 'Fractional Securities: Democratizing Access to High-Value Assets',
    subtitle: 'How Regulation D 506(c) enables fractional ownership of previously inaccessible assets — and what issuers need to know',
    author: 'Shane Pierson',
    date: 'April 2026',
    readTime: '10 min read',
    model: 'Fractional Securities',
    modelColor: '#1B6B4A',
    icon: Layers,
    excerpt: 'Fractional securities allow high-value assets to be split into affordable, SEC-compliant shares. We examine the regulatory framework, SPV structures, and practical considerations for issuers.',
    content: `## The Problem Fractional Securities Solve

A $10 million emerald lot or a $50 million commercial property is, by its nature, inaccessible to all but the wealthiest investors. Fractional securities change this equation by dividing ownership of a single asset into smaller units — shares in an LLC or limited partnership — that can be offered to qualified investors at substantially lower minimums.

This is not a new concept. Real estate syndications have used fractional ownership structures for decades. What has changed is the regulatory clarity around how these offerings can be marketed and sold.

## The Regulation D 506(c) Framework

Under Rule 506(c) of SEC Regulation D, issuers can broadly solicit and advertise an offering to the general public, provided that all purchasers are verified accredited investors. This is a critical distinction from Rule 506(b), which prohibits general solicitation entirely.

The SEC's March 2025 guidance expanded the definition of "reasonable steps" for accredited investor verification, making 506(c) more practical for smaller issuers. Previously, verification often required reviewing tax returns or bank statements. The updated guidance allows issuers to rely on written confirmations from registered broker-dealers, investment advisers, or licensed attorneys who have verified the investor's status within the prior three months.

## How the Structure Works

A typical fractional securities offering proceeds through these steps:

**1. SPV Formation.** A Special Purpose Vehicle — usually a Delaware LLC — is created to hold the asset. The SPV's sole purpose is to own, manage, and eventually monetize the specific asset.

**2. Offering Documentation.** A Private Placement Memorandum (PPM), operating agreement, and subscription agreement are prepared by securities counsel. These documents define investor rights, management authority, fee structures, distribution waterfalls, and exit mechanisms.

**3. Valuation and Diligence.** The asset undergoes independent appraisal (often multiple appraisals for high-value items). For gemstones, this includes GIA certification. For real estate, this includes environmental assessments and title searches.

**4. Form D Filing.** The issuer files Form D with the SEC within 15 days of the first sale. This is a notice filing, not a registration — the offering itself is exempt from registration.

**5. General Solicitation.** With 506(c), the issuer can publicly market the offering through digital advertising, social media, webinars, and industry events.

**6. Investor Verification and Subscription.** Each investor's accredited status is verified through one of the SEC-approved methods. Upon verification, the investor subscribes by executing the subscription agreement and funding their investment.

## Practical Considerations

**Minimum investment size.** While fractional securities lower the barrier to entry, they do not eliminate it. Most offerings set minimums between $25,000 and $100,000 to balance accessibility with the administrative cost of managing a larger investor base.

**Liquidity expectations.** Fractional securities in private placements are restricted securities under the Securities Act. Investors should expect limited liquidity — there is no public market for these shares, and transfer restrictions typically apply for at least 12 months under Rule 144.

**Management and governance.** The SPV's operating agreement determines who manages the asset, how decisions are made, and how proceeds are distributed. Investors are typically passive — they provide capital but do not participate in day-to-day management.

**Exit mechanisms.** Common exit strategies include sale of the underlying asset, buyback by the manager, or eventual listing on an Alternative Trading System (ATS) for secondary trading.

## The Opportunity

For asset holders, fractional securities offer a path to monetize high-value assets without selling them outright. For investors, they provide access to asset classes — fine gemstones, commercial real estate, mineral rights — that were previously available only to ultra-high-net-worth individuals or institutional buyers.

The regulatory framework exists. The verification processes have been simplified. The question is no longer whether fractional securities are legally viable — it is whether issuers can build the trust and transparency that investors require.`,
    sources: [
      { label: 'SEC Rule 506(c) — General Solicitation', url: 'https://www.sec.gov/resources-small-businesses/exempt-offerings/general-solicitation-rule-506c' },
      { label: 'SEC Eases Verification Burdens (Mar 2025)', url: 'https://www.regulatoryandcompliance.com/2025/03/sec-eases-verification-burdens-in-rule-506c-offerings/' },
      { label: 'Rule 506 of Regulation D — Investor.gov', url: 'https://www.investor.gov/introduction-investing/investing-basics/glossary/rule-506-regulation-d' },
      { label: '506(b) vs 506(c): A Guide for Private Funds — Carta', url: 'https://carta.com/learn/private-funds/regulations/regulation-d/506b-vs-506c/' },
    ],
  },
  {
    slug: 'debt',
    title: 'Asset-Backed Debt Instruments: Unlocking Liquidity Without Selling',
    subtitle: 'How UCC Article 9 collateral structures enable lending against high-value physical assets',
    author: 'Shane Pierson',
    date: 'April 2026',
    readTime: '9 min read',
    model: 'Debt Instruments',
    modelColor: '#1E3A6E',
    icon: Landmark,
    excerpt: 'Debt instruments allow asset holders to access capital by using their assets as collateral rather than selling them. We explore the legal framework, mechanics, and considerations.',
    content: `## When Selling Is Not the Goal

Not every asset holder wants to sell. Some want to retain ownership while accessing the capital their asset represents. Asset-backed debt instruments — structured lending where the physical asset serves as collateral — address this need directly.

This model is well-established in traditional finance. Banks lend against real estate (mortgages), inventory (commercial lines of credit), and receivables (factoring). What is newer is applying these structures to alternative assets like gemstones, fine art, and mineral rights.

## The UCC Article 9 Framework

In the United States, secured lending against personal property is governed by Article 9 of the Uniform Commercial Code. This framework establishes how a lender can take a security interest in property to secure a loan, and what happens if the borrower defaults.

Key elements of a UCC Article 9 secured transaction include:

**Security Agreement.** A written agreement between borrower and lender that identifies the collateral, the obligation being secured, and the rights and remedies of each party.

**UCC-1 Financing Statement.** A public filing with the state that puts third parties on notice of the lender's security interest. This filing establishes priority — the first to file generally has the first claim on the collateral.

**Perfection.** The process of making the security interest enforceable against third parties. For most personal property, perfection is achieved by filing the UCC-1. For certain assets (like certificated securities or negotiable instruments), physical possession by the lender may be required.

**Default and Remediation.** If the borrower defaults, Article 9 provides the secured party with specific remedies, including the right to repossess and sell the collateral in a commercially reasonable manner.

As of 2025, more than half of U.S. states have adopted the 2022 UCC amendments, including the new Article 12 provisions that address digital assets — creating a more coherent legal framework for asset-backed lending that bridges physical and digital representations.

## How It Works for Alternative Assets

For a gemstone-backed loan, the typical structure involves:

**1. Appraisal and Certification.** The asset is independently appraised (often three appraisals for cross-validation) and certified by a recognized authority (GIA for gemstones).

**2. Custody Transfer.** The asset is placed in institutional custody — a bonded vault operated by a recognized custodian like Brink's or Malca-Amit. This serves both as physical security and as the lender's constructive possession of the collateral.

**3. Loan-to-Value Determination.** The lender establishes a loan-to-value (LTV) ratio — the maximum loan amount as a percentage of the appraised value. For alternative assets, LTV ratios are typically conservative, reflecting the illiquidity and valuation uncertainty of the collateral.

**4. Loan Documentation.** The security agreement, promissory note, UCC-1 filing, and custody agreement are executed. Insurance coverage naming the lender as loss payee is typically required.

**5. Servicing and Monitoring.** The loan is serviced with regular interest payments. Periodic reappraisal may be required to ensure the collateral value supports the outstanding loan balance.

## Advantages and Considerations

**Retained ownership.** The borrower maintains ownership of the asset. If the loan is repaid, the asset is returned. This is particularly valuable for assets with sentimental significance or expected appreciation.

**No securities registration.** A loan secured by personal property is not a securities offering. There is no Form D filing, no PPM, and no accredited investor verification required. This simplifies the process and reduces legal costs.

**Tax treatment.** Loan proceeds are generally not taxable income. Depending on the borrower's circumstances, interest payments may be deductible. However, tax treatment depends on individual circumstances and should be evaluated with a qualified tax advisor.

**Liquidity risk.** If the borrower defaults, the lender may sell the collateral. For illiquid assets, this sale may occur at a discount to appraised value — a reality that informs the conservative LTV ratios applied to alternative collateral.

## The Market Context

The private credit market has grown substantially, with tokenized private credit alone reaching $14-17 billion by mid-2025. While most of this volume is in corporate lending and structured finance, the infrastructure and legal frameworks are directly applicable to asset-backed lending against physical collateral. The growing familiarity of lenders with alternative collateral structures suggests this market will continue to expand.`,
    sources: [
      { label: 'UCC Article 9: Secured Transactions Overview', url: 'https://www.lorman.com/resources/what-is-ucc-article-9-and-what-is-it-used-for-17413' },
      { label: 'UCC Articles 9 and 12: Digital Asset Framework — Lowenstein Sandler', url: 'https://www.lowenstein.com/news-insights/publications/articles/ucc-articles-9-and-12-a-modern-legal-framework-for-secured-transactions-and-digital-assets-citron-caporale-podolnyy' },
      { label: 'UCC Article 9 Compliance Guide — CSC Global', url: 'https://www.cscglobal.com/service/business-administration/ucc-services/guide-to-uniform-commercial-code-ucc/' },
      { label: 'IMF Fintech Note: Tokenization and Financial Market Inefficiencies (2025)', url: 'https://www.imf.org/en/Publications/fintech-notes/Issues/2025/01/29/Tokenization-and-Financial-Market-Inefficiencies-561256' },
    ],
  },
  {
    slug: 'broker-sale',
    title: 'Broker Sale: The Direct Path to Value Realization',
    subtitle: 'How regulated broker-dealer channels and alternative trading systems enable direct sales of high-value assets',
    author: 'Shane Pierson',
    date: 'April 2026',
    readTime: '8 min read',
    model: 'Broker Sale',
    modelColor: '#C47A1A',
    icon: Handshake,
    excerpt: 'Sometimes the most effective path to value is a direct sale through regulated channels. We examine the broker-dealer framework, ATS platforms, and when direct sale is the right strategy.',
    content: `## When Direct Sale Is the Right Path

Not every asset needs to be fractionalized or tokenized. For some assets — particularly those with identified buyers, strong market demand, or time-sensitive value considerations — a direct sale through regulated broker-dealer channels is the most efficient path to value realization.

The broker sale model works within well-established regulatory frameworks. Broker-dealers are registered with the SEC and FINRA, operate under extensive compliance requirements, and provide the investor protections that institutional and accredited buyers expect.

## The Broker-Dealer Framework

A broker-dealer is a firm that buys and sells securities on behalf of its customers (broker function) and for its own account (dealer function). In the context of alternative assets, broker-dealers serve as intermediaries that connect sellers with qualified buyers, handle transaction documentation, and ensure regulatory compliance.

For assets classified as securities, transactions must generally be conducted through a registered broker-dealer or through an exemption. Even for assets not classified as securities, engaging a broker-dealer provides credibility, compliance infrastructure, and access to qualified buyer networks.

## Alternative Trading Systems

Alternative Trading Systems (ATS) are SEC-regulated electronic trading platforms that match buyers and sellers of securities outside of traditional exchanges. For digital and alternative securities, ATS platforms have become the primary venue for secondary trading.

tZERO, one of the leading ATS platforms for digital securities, has expanded significantly through 2025-2026. In December 2025, tZERO received FINRA approval to offer retail access to tokenized mutual funds and to facilitate secondary trading in corporate debt securities. The platform now supports 24/7 order entry and near-continuous trading hours — 23.5 hours per business day.

tZERO's partnership with Nomyx, announced in March 2026, enables issuers to move seamlessly from primary issuance to secondary trading within a compliant market environment. This integration addresses one of the key friction points identified in RWA liquidity research: the disconnect between issuance platforms and trading venues.

## When Broker Sale Makes Sense

The broker sale model is typically most appropriate when:

**A buyer has been identified.** If a collector, institution, or fund has expressed interest in acquiring the asset, a broker facilitates the transaction with proper documentation, escrow, and compliance.

**The asset has established market comparables.** Assets with readily available pricing data (precious metals, investment-grade gemstones with GIA certification, commercial real estate in established markets) are easier to sell directly because buyers can independently verify fair value.

**Time is a factor.** Structuring a tokenized offering or fractional securities placement takes months. A broker sale can close in weeks if the buyer is qualified and the documentation is prepared.

**The holder prefers a clean exit.** Some holders want a complete, one-time transaction rather than ongoing management responsibilities associated with fractional ownership structures or token-based models.

## The Transaction Process

A typical broker-assisted sale follows these steps: asset appraisal and due diligence, engagement of a broker-dealer with relevant market expertise, preparation of offering materials and buyer qualification documentation, buyer identification and negotiation, escrow and settlement, and transfer of ownership with all regulatory filings completed.

## Considerations

**Broker-dealer fees.** Commissions typically range based on asset value, complexity, and market conditions. These costs should be evaluated against the time and expense of alternative monetization paths.

**Buyer concentration risk.** A direct sale depends on finding a single buyer (or small group) willing to pay fair value. If the buyer pool is thin, the seller may face price pressure.

**No ongoing revenue.** Unlike fractional securities or tokenized models that generate management fees, a broker sale is a one-time transaction. The holder receives proceeds but does not participate in future appreciation.`,
    sources: [
      { label: 'tZERO: SEC and FINRA Regulated Trading Platform', url: 'https://www.tzero.com/' },
      { label: 'tZERO Launches 24/7 Order Entry (Dec 2025)', url: 'https://www.tzero.com/news/tzero-to-launch-24-7-order-entry-and-extended-ats-trading-hours-enhancing-interoperability-with' },
      { label: 'FINRA Grants tZERO Corporate Debt Approval', url: 'https://www.theblock.co/post/372025/finra-grants-tokenization-firm-tzero-approval-to-trade-corporate-debt' },
      { label: 'tZERO + Nomyx Partnership (Mar 2026)', url: 'https://www.tzero.com/news/tzero-nomyx-partner-to-provide-issuers-a-direct-regulated-route-from-tokenization-to-trading' },
    ],
  },
  {
    slug: 'barter',
    title: 'Barter and Asset Exchange: Ancient Commerce Meets Modern Structure',
    subtitle: 'How asset-for-asset exchanges can unlock value when traditional sales channels are impractical',
    author: 'Shane Pierson',
    date: 'April 2026',
    readTime: '7 min read',
    model: 'Barter',
    modelColor: '#5B2D8E',
    icon: ArrowLeftRight,
    excerpt: 'Barter — the direct exchange of assets without cash intermediation — remains relevant for high-value assets where traditional markets are thin or where tax-advantaged exchanges apply.',
    content: `## Why Barter Still Matters

Barter — the direct exchange of one asset for another without cash as an intermediary — is the oldest form of commerce. While it may seem anachronistic in an era of digital finance, structured barter transactions remain relevant for high-value assets, particularly when traditional markets are thin, buyers prefer asset-for-asset swaps, or tax-advantaged exchange structures apply.

The commercial barter industry in the United States represents a significant market. The International Reciprocal Trade Association (IRTA) estimates that hundreds of thousands of businesses participate in organized barter exchanges annually, with transactions valued in the billions of dollars.

## When Barter Creates Value

Asset-for-asset exchanges are most valuable in specific circumstances:

**Illiquid markets.** When an asset cannot be easily sold for cash — perhaps because the buyer pool is extremely small or the asset is highly specialized — a direct exchange with a holder of a complementary asset can unlock value that would otherwise remain trapped.

**Portfolio rebalancing.** An investor holding a concentrated position in one asset class (e.g., gemstones) may prefer to exchange for a different asset class (e.g., real estate) rather than selling and reinvesting, particularly when transaction costs of sale and reinvestment would be significant.

**Tax-advantaged exchanges.** Under Section 1031 of the Internal Revenue Code, certain "like-kind" exchanges of real property allow investors to defer capital gains taxes. While the Tax Cuts and Jobs Act of 2017 limited 1031 exchanges to real property (excluding personal property like gemstones), the principle of tax-deferred exchange remains powerful for real estate transactions.

**Cross-border transactions.** When currency conversion costs, capital controls, or regulatory restrictions make cash transactions impractical, asset-for-asset exchanges can facilitate international deals.

## Structure and Considerations

A structured barter transaction typically involves:

**Independent valuation of both assets.** Each party must understand the fair market value of both what they are giving and what they are receiving. Independent appraisals are essential to ensure neither party is disadvantaged.

**Exchange agreement.** A formal contract documenting the exchange terms, including asset descriptions, agreed valuations, representations and warranties, conditions to closing, and remedies for breach.

**Simultaneous or staged closing.** The exchange may occur simultaneously (both assets transfer at once) or through a staged process using an intermediary or escrow arrangement.

**Tax reporting.** Barter transactions are taxable events. The IRS requires that the fair market value of property received in exchange be reported as income if it exceeds the basis of the property given up. Participants should consult with tax professionals to understand their specific obligations.

## The Role of Intermediaries

Structured barter transactions often benefit from intermediaries who facilitate matching, valuation, and closing. These intermediaries may operate formal barter exchanges (which maintain trade credits or units of account) or may serve as deal brokers who identify complementary parties.

For high-value assets, the intermediary role includes ensuring proper due diligence on both sides of the transaction, managing custody and transfer logistics, and documenting the transaction for regulatory and tax purposes.

## Practical Limitations

Barter is not a universal solution. Finding a counterparty with a complementary asset and complementary needs is inherently more difficult than finding a cash buyer. Valuation disputes can derail transactions when parties disagree on relative values. And the tax treatment of non-like-kind exchanges means that barter does not necessarily provide tax advantages over cash sales for most asset categories.

However, for specific situations — particularly where liquidity is constrained, where 1031 exchanges apply, or where parties have complementary holdings — structured barter remains a viable and sometimes optimal path to value realization.`,
    sources: [
      { label: 'IRS: Like-Kind Exchanges Under IRC Section 1031', url: 'https://www.irs.gov/newsroom/like-kind-exchanges-under-irc-section-1031' },
      { label: 'International Reciprocal Trade Association (IRTA)', url: 'https://www.irta.com/' },
      { label: 'Tax Cuts and Jobs Act — 1031 Exchange Changes', url: 'https://www.irs.gov/newsroom/tax-cuts-and-jobs-act-provision-11045-section-1031-like-kind-exchanges' },
    ],
  },
]

// Orbital timeline data derived from articles
export const ORBITAL_TIMELINE_DATA = VALUE_MODEL_ARTICLES.map((article, i) => ({
  id: i + 1,
  title: article.model,
  date: article.date,
  content: article.excerpt,
  category: article.model,
  icon: article.icon,
  relatedIds: i === 0 ? [2, 3] : i === 1 ? [1, 3] : i === 2 ? [1, 2, 5] : i === 3 ? [1, 4] : [3, 4],
  status: (i < 3 ? 'in-progress' : 'pending') as 'completed' | 'in-progress' | 'pending',
  energy: [85, 75, 70, 50, 30][i],
  href: `/knowledge/${article.slug}`,
}))
