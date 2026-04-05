import { Layers, Coins, Landmark, Handshake, ArrowLeftRight, Search, DollarSign, Shield, BookOpen, Droplets } from 'lucide-react'

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
  category?: 'model' | 'research'
}

export const VALUE_MODEL_ARTICLES: Article[] = [
  {
    slug: 'tokenization',
    title: 'The Liquidity Paradox of Tokenized Real-World Assets',
    subtitle: 'Why creating a token is only half the battle, and what the data says about the road ahead',
    author: 'Shane Pierson',
    date: 'April 2026',
    readTime: '12 min read',
    model: 'Tokenization',
    modelColor: '#1A8B7A',
    icon: Coins,
    excerpt: 'Real-world asset tokenization grew past $36 billion by late 2025, but RWA liquidity still trails far behind issuance. This analysis explains why tokenized assets remain hard to trade and what owners should expect.',
    content: `## Tokenization Has Scaled Faster Than Liquidity

Real-world asset tokenization has moved from fringe idea to serious market category. The sector grew from roughly $5 billion in 2022 to over $36 billion by late 2025, a sevenfold increase in three years. Analysts project the market could reach $18.9 trillion by 2033, according to BCG and Ripple forecasts.

Those numbers get attention, and they should. But I have found that owners often hear "tokenization" and mentally substitute the word "liquidity." That is where expectations start to drift. Creating a digital wrapper around ownership is one thing. Creating a market where someone can actually sell that position at a fair price is something else entirely.

Rischan Mafrur of Macquarie University made that distinction unavoidable in his 2025 paper, "Tokenize Everything, But Can You Sell It?" The paper is valuable because it looks past the issuance announcement and asks the only question that matters after launch: can the asset trade?

## What the On-Chain Data Actually Shows

Mafrur's analysis uses data from RWA.xyz and Etherscan to examine what happens after assets are tokenized. Four patterns stand out, and none of them look like the frictionless market many people imagine.

**Market cap does not guarantee trading activity.** BlackRock's BUIDL fund, the largest tokenized RWA at nearly $2 billion, had only 85 unique holders and 30 monthly active addresses as of mid-2025. Paxos Gold (PAXG), meanwhile, had a smaller market cap but more than 69,000 holders. Bigger is not the same as more liquid.

**Most tokenized assets barely trade after purchase.** On RealT, one of the earliest tokenized real estate platforms, token ownership changed hands on average only once per year. That is not an active secondary market. It is closer to buy-and-hold with occasional transfer activity.

**Transfer activity is episodic.** Most institutional tokens showed longest active streaks of only 3-13 days. Activity tends to spike during issuance and redemption windows, then fade. The token exists, the legal wrapper exists, but continuous market participation often does not.

**Many platforms are excellent at onboarding and weak at exits.** Most RWA protocols still prioritize primary issuance and asset onboarding over secondary liquidity. Maple facilitates tokenized loan origination but lacks integrated exit mechanisms. RealT restricts trading to platform-managed OTC channels. That can work, but it is not the same as deep two-sided trading.

## Why RWA Liquidity Still Breaks Down

The research points to five reinforcing barriers, and in practice they compound each other.

**Fragmented marketplaces.** There is no central exchange for RWA tokens where serious buyers, serious sellers, and credible price discovery all meet in one place.

**Regulatory gating.** Accredited investor requirements narrow the buyer pool. That may be appropriate from a compliance standpoint, but it still reduces turnover.

**Valuation opacity.** A one-of-one asset does not have the pricing clarity of Apple stock or a Treasury bill. If the underlying asset is a 47-carat Paraiba tourmaline, a rare sculpture, or a 200-acre mineral rights parcel in the Permian Basin, valuation often feels more like negotiation than consensus.

**Absence of market makers.** Without dedicated participants quoting both sides of the market, every sale can become a custom transaction.

**Technological friction.** Wallet setup, gas fees, and cross-chain incompatibility are still enough to lose otherwise interested buyers, especially institutional buyers who are not looking for operational novelty.

## The Infrastructure Gap Is Starting to Close

None of this means the thesis is dead. It means the missing layer is market structure, not token issuance.

There were meaningful signals in late 2025 and early 2026. The Depository Trust Company received SEC approval to offer tokenization services. Nasdaq has proposed rule changes to enable tokenized securities trading. MakerDAO has integrated over $2 billion in tokenized assets as collateral for its DAI stablecoin. The SEC's January 2026 statement also gave the market clearer guidance on how tokenized securities fit within existing regulatory frameworks.

That matters because liquidity usually arrives after legal clarity, institutional participation, and standardized infrastructure show up together. Technology alone rarely gets it there.

## What Asset Owners Should Take From This

If you are considering tokenization for a high-value physical asset, the tech works. That part is settled. What matters now is what kind of liquidity timeline is realistic for your asset, with your buyer pool, under your regulatory constraints.

In practical terms, that means planning for slower exits than a marketing deck may imply. It means asking whether a hybrid approach, such as tokenization combined with collateral-based lending or broker channels, gives you more flexibility. And it means investing heavily in evidence: GIA certification, independent appraisals, and on-chain proof of reserve. The research keeps circling back to the same point. When investors cannot trust valuation, they hesitate.

Tokenization is a better ownership rail. It can be a better transfer rail. It can absolutely become a better governance rail. But it is not a shortcut to liquidity, at least not yet. The opportunity is real, but the smarter posture today is optimism with discipline.`,
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
    title: 'Fractional Securities for High-Value Assets',
    subtitle: 'How Regulation D 506(c) makes fractional ownership possible, and what issuers need to get right',
    author: 'Shane Pierson',
    date: 'April 2026',
    readTime: '10 min read',
    model: 'Fractional Securities',
    modelColor: '#1B6B4A',
    icon: Layers,
    excerpt: 'Fractional securities and Rule 506(c) let issuers divide high-value assets into private placement interests for accredited investors. The real work is legal structure, diligence, governance, and trust.',
    content: `## Why Fractional Securities Keep Coming Up

A $10 million emerald lot or a $50 million commercial property is too large for most individual investors to buy outright. Fractional securities solve that by dividing ownership into smaller interests, usually through an LLC or limited partnership, so qualified investors can participate at lower minimums.

That basic structure is familiar to anyone who has spent time around real estate syndications or private placements. What has changed is the level of clarity around how certain offerings can be marketed, how investors can be verified, and how issuers can approach distribution without guessing where the compliance line is.

For owners of unusual assets, this matters. A single asset may be too valuable, too specialized, or too illiquid to sell cleanly to one buyer. Breaking it into securities can widen the capital base without forcing an outright sale.

## What Rule 506(c) Actually Opens Up

Under Rule 506(c) of SEC Regulation D, issuers can broadly solicit and advertise an offering to the general public, provided that all purchasers are verified accredited investors. That is the key difference from Rule 506(b), which prohibits general solicitation.

That distinction sounds technical, but it changes the go-to-market playbook. An issuer using 506(c) can speak publicly about the deal through digital advertising, social media, webinars, and industry events. An issuer relying on 506(b) cannot do that in the same way.

The SEC's March 2025 guidance made 506(c) more workable for smaller issuers. Verification used to feel invasive and clumsy because it often required reviewing tax returns or bank statements. The updated guidance allows issuers to rely on written confirmations from registered broker-dealers, investment advisers, or licensed attorneys who have verified the investor's status within the prior three months. That is still a regulated process, but it is a much more usable one.

## How a Fractional Securities Offering Gets Built

A serious offering has structure underneath it. In my experience, this is where inexperienced issuers usually underestimate the work.

**1. SPV formation.** A Special Purpose Vehicle, typically a Delaware LLC, is created to hold the asset. Its sole purpose is to own, manage, and eventually monetize that specific asset.

**2. Offering documentation.** Securities counsel prepares the Private Placement Memorandum (PPM), operating agreement, and subscription agreement. Those documents define investor rights, management authority, fee structures, distribution waterfalls, and exit mechanisms.

**3. Valuation and diligence.** The asset needs independent appraisal, and high-value assets often require more than one appraisal. For gemstones, that means GIA certification. For real estate, it means items such as environmental assessments and title searches. If the asset is unusual, diligence quality becomes part of the investment thesis.

**4. Form D filing.** The issuer files Form D with the SEC within 15 days of the first sale. It is a notice filing, not a registration statement, because the offering is exempt from registration.

**5. General solicitation.** Once the framework is in place, 506(c) allows the issuer to market the offering publicly.

**6. Investor verification and subscription.** Each investor's accredited status is verified through an approved method, then the investor signs the subscription agreement and funds the investment.

## Where Issuers Usually Get Tested

**Minimum investment size.** Fractional ownership lowers the entry point, but it does not make administration free. Most offerings still set minimums between $25,000 and $100,000 because a cap table full of tiny positions can become expensive to manage.

**Liquidity expectations.** These interests are restricted securities under the Securities Act. Investors should expect limited liquidity. There is no public market for these shares, and transfer restrictions typically apply for at least 12 months under Rule 144.

**Management and governance.** The operating agreement decides who controls the asset, how decisions are made, and how proceeds are distributed. Investors are usually passive. They are buying exposure, not operational control.

**Exit planning.** Sale of the underlying asset, buyback by the manager, or eventual ATS listing are all possible exit routes. The right answer depends on the asset and the investor base, but the exit needs to be thought through before the first dollar comes in, not after.

## Why Trust Matters More Than Structure Alone

Fractional securities can absolutely help monetize assets that were previously available only to ultra-high-net-worth buyers or institutions. A GIA-certified gemstone parcel, a commercial property, or a mineral rights position can be made investable for a broader accredited audience.

Still, legal viability is only the starting line. Smart investors will ask whether the valuation is credible, whether governance is clear, whether reporting will be disciplined, and whether the sponsor has thought honestly about liquidity. That is where good offerings separate themselves from forgettable ones. The structure can open the door, but trust is what gets investors to walk through it.`,
    sources: [
      { label: 'SEC Rule 506(c) — General Solicitation', url: 'https://www.sec.gov/resources-small-businesses/exempt-offerings/general-solicitation-rule-506c' },
      { label: 'SEC Eases Verification Burdens (Mar 2025)', url: 'https://www.regulatoryandcompliance.com/2025/03/sec-eases-verification-burdens-in-rule-506c-offerings/' },
      { label: 'Rule 506 of Regulation D — Investor.gov', url: 'https://www.investor.gov/introduction-investing/investing-basics/glossary/rule-506-regulation-d' },
      { label: '506(b) vs 506(c): A Guide for Private Funds — Carta', url: 'https://carta.com/learn/private-funds/regulations/regulation-d/506b-vs-506c/' },
    ],
  },
  {
    slug: 'debt',
    title: 'Asset-Backed Debt Instruments: Borrowing Against High-Value Assets Without Selling',
    subtitle: 'How UCC Article 9 collateral structures enable lending against high-value physical assets',
    author: 'Shane Pierson',
    date: 'April 2026',
    readTime: '9 min read',
    model: 'Debt Instruments',
    modelColor: '#1E3A6E',
    icon: Landmark,
    excerpt: 'Asset-backed lending under UCC Article 9 lets owners borrow against gemstones, art, or mineral rights without selling. The trade-off is disciplined collateral control, conservative LTVs, and real default risk.',
    content: `## When the Goal Is Liquidity, Not a Sale

Not every owner wants an exit. Quite often, the real objective is access to capital while keeping the asset. Asset-backed debt instruments address that directly by using the physical asset as collateral for a loan.

That logic is completely ordinary in traditional finance. Banks lend against real estate, inventory, and receivables every day. What is more specialized is extending the same discipline to alternative assets such as gemstones, fine art, and mineral rights. If the collateral is a 22-carat unmounted sapphire, a museum-quality painting, or a producing royalty interest, the mechanics get more bespoke, but the legal foundation is still recognizable.

## The Legal Backbone Is UCC Article 9

In the United States, secured lending against personal property is governed by Article 9 of the Uniform Commercial Code. It defines how a lender takes a security interest in property, how that interest is made effective against third parties, and what remedies exist if the borrower defaults.

There are a few pieces every serious borrower should understand.

**Security Agreement.** This written agreement identifies the collateral, the obligation being secured, and the rights and remedies of both sides.

**UCC-1 Financing Statement.** This is the public filing that puts third parties on notice of the lender's security interest. It establishes priority, and in most cases the first to file has the first claim on the collateral.

**Perfection.** Perfection is what makes the security interest enforceable against third parties. For most personal property, filing the UCC-1 does the job. For some assets, such as certificated securities or negotiable instruments, physical possession may also matter.

**Default and remediation.** If the borrower defaults, Article 9 gives the secured party defined remedies, including the right to repossess and sell the collateral in a commercially reasonable manner.

As of 2025, more than half of U.S. states had adopted the 2022 UCC amendments, including the new Article 12 provisions that address digital assets. That matters because the legal system is slowly catching up to structures that bridge physical collateral and digital representations of ownership.

## What a Loan Against a High-Value Asset Looks Like

For a gemstone-backed loan, the process is usually more disciplined than people expect.

**1. Appraisal and certification.** The asset is independently appraised, often more than once, and certified by a recognized authority such as GIA for gemstones.

**2. Custody transfer.** The asset moves into institutional custody, often a bonded vault operated by a recognized custodian like Brink's or Malca-Amit. That protects the asset and helps establish the lender's control over the collateral.

**3. Loan-to-value determination.** The lender sets an LTV ratio based on the appraised value. With alternative assets, those ratios are usually conservative because valuation can move and liquidation can take time.

**4. Loan documentation.** The promissory note, security agreement, UCC-1 filing, and custody agreement are executed. Insurance naming the lender as loss payee is commonly required.

**5. Servicing and monitoring.** The borrower makes interest payments, and the lender may require periodic reappraisal to confirm the collateral still supports the loan balance.

## Why Borrowers Choose This Route

**Retained ownership.** If the loan is repaid, the asset comes back. That is a meaningful advantage when the owner believes the asset may appreciate or simply does not want to part with it.

**No securities registration.** A loan secured by personal property is not a securities offering. There is no Form D filing, no PPM, and no accredited investor verification requirement. That usually reduces legal complexity and cost.

**Tax treatment.** Loan proceeds are generally not taxable income. Depending on the borrower's situation, interest may be deductible. Tax treatment always depends on the facts and should be reviewed with a qualified tax advisor.

## Where the Risk Really Sits

The risk is not theoretical. If the borrower defaults, the lender may sell the collateral. With illiquid assets, that sale can happen at a discount to appraised value, which is exactly why conservative LTV ratios are common. The lender is underwriting not just the object, but also the speed and certainty of an eventual liquidation.

That is the part many borrowers miss. A lender does not lend against what the asset might be worth in a patient private negotiation. A lender lends against what it can recover under pressure.

## Why This Market Is Expanding

The private credit market has grown substantially, with tokenized private credit alone reaching $14-17 billion by mid-2025. Most of that volume sits in corporate lending and structured finance, but the legal concepts and servicing infrastructure carry over directly to loans secured by physical collateral.

From where I sit, that is why asset-backed lending deserves more attention. It gives owners a way to unlock liquidity without triggering a sale, and it does so inside a legal framework that lenders already understand. For the right asset and the right borrower, that is often a more practical answer than trying to manufacture a market from scratch.`,
    sources: [
      { label: 'UCC Article 9: Secured Transactions Overview', url: 'https://www.lorman.com/resources/what-is-ucc-article-9-and-what-is-it-used-for-17413' },
      { label: 'UCC Articles 9 and 12: Digital Asset Framework — Lowenstein Sandler', url: 'https://www.lowenstein.com/news-insights/publications/articles/ucc-articles-9-and-12-a-modern-legal-framework-for-secured-transactions-and-digital-assets-citron-caporale-podolnyy' },
      { label: 'UCC Article 9 Compliance Guide — CSC Global', url: 'https://www.cscglobal.com/service/business-administration/ucc-services/guide-to-uniform-commercial-code-ucc/' },
      { label: 'IMF Fintech Note: Tokenization and Financial Market Inefficiencies (2025)', url: 'https://www.imf.org/en/Publications/fintech-notes/Issues/2025/01/29/Tokenization-and-Financial-Market-Inefficiencies-561256' },
    ],
  },
  {
    slug: 'broker-sale',
    title: 'Broker Sale: When a Direct Exit Is the Best Answer',
    subtitle: 'How broker-dealers and alternative trading systems support direct sales of high-value assets',
    author: 'Shane Pierson',
    date: 'April 2026',
    readTime: '8 min read',
    model: 'Broker Sale',
    modelColor: '#C47A1A',
    icon: Handshake,
    excerpt: 'Broker-dealer and ATS channels can be the fastest way to sell a high-value asset when a buyer exists and timing matters. The appeal is simplicity, regulated execution, and a cleaner path to settlement.',
    content: `## Sometimes the Straight Line Is the Best Line

Not every monetization strategy needs a token, an SPV, and a long distribution process. Sometimes the best answer is a direct sale.

That is especially true when the asset already has a likely buyer, when market comparables are reasonably clear, or when timing matters more than long-term upside participation. If someone is holding a GIA-certified gemstone with active buyer interest or a commercial property with an identified institutional counterparty, a regulated broker-led process can be the cleanest way to realize value.

## What Broker-Dealers Actually Add

The broker sale model sits inside a familiar regulatory framework. Broker-dealers are registered with the SEC and FINRA, operate under extensive compliance requirements, and bring the kind of process discipline institutional and accredited buyers expect.

A broker-dealer buys and sells securities on behalf of customers as a broker and for its own account as a dealer. In alternative asset transactions, that often means something very practical: sourcing qualified buyers, managing documentation, coordinating diligence, and reducing compliance mistakes that can slow or kill a deal.

For assets classified as securities, transactions generally need to go through a registered broker-dealer unless an exemption applies. Even when the asset is not itself a security, working through a broker channel can still add credibility, access, and execution discipline.

## Where Alternative Trading Systems Fit

Alternative Trading Systems, or ATS platforms, are SEC-regulated electronic venues that match buyers and sellers of securities outside traditional exchanges. For digital securities and other alternative instruments, they have become the primary venue for secondary trading.

tZERO is one of the clearest examples of that evolution. In December 2025, tZERO received FINRA approval to offer retail access to tokenized mutual funds and for secondary trading in corporate debt securities. The platform also moved to 24/7 order entry with near-continuous trading hours of 23.5 hours per business day.

Its March 2026 partnership with Nomyx matters for a different reason. It creates a more direct path from issuance to trading, which is exactly where many tokenized asset structures have historically broken down. Creating the security is not usually the hard part. Creating the compliant route to a trade is.

## When a Broker Sale Is Usually the Better Answer

**A buyer has already surfaced.** If a collector, fund, family office, or strategic buyer is already engaged, a broker can move the transaction forward with proper qualification, documentation, and escrow.

**The asset has reliable comparables.** Precious metals, investment-grade gemstones with GIA certification, and commercial real estate in established markets are easier to sell directly because the buyer has enough pricing context to make a decision.

**Time matters.** A tokenized or fractional structure can take months to prepare. A broker-assisted sale can close in weeks if the buyer is qualified and the diligence package is ready.

**The owner wants a clean exit.** Some holders do not want future administration, ongoing reporting, or shared upside structures. They want proceeds and finality.

## What the Process Looks Like

A typical broker-assisted sale moves through appraisal and due diligence, engagement of a broker-dealer with relevant domain expertise, preparation of offering materials and buyer qualification documents, buyer identification and negotiation, escrow and settlement, then final transfer with the required regulatory filings completed.

In practice, the process is less glamorous than people think. It is mostly about getting the evidence right, controlling the buyer process, and closing without surprises.

## The Trade-Offs Are Straightforward

**Broker-dealer fees.** Commissions vary with asset value, complexity, and market conditions. Those fees need to be weighed against the cost and time of more elaborate structures.

**Buyer concentration risk.** A direct sale depends on a small number of buyers being willing to pay fair value. If the market is thin, the seller can lose negotiating power quickly.

**No participation after the sale.** Unlike tokenized or fractional models, a broker sale is typically a one-time monetization event. Once the asset is sold, the holder does not participate in future appreciation.

That trade-off is not a flaw. It is simply the nature of the strategy. If the priority is certainty, speed, and a clean realization of value, direct sale often deserves more respect than it gets.`,
    sources: [
      { label: 'tZERO: SEC and FINRA Regulated Trading Platform', url: 'https://www.tzero.com/' },
      { label: 'tZERO Launches 24/7 Order Entry (Dec 2025)', url: 'https://www.tzero.com/news/tzero-to-launch-24-7-order-entry-and-extended-ats-trading-hours-enhancing-interoperability-with' },
      { label: 'FINRA Grants tZERO Corporate Debt Approval', url: 'https://www.theblock.co/post/372025/finra-grants-tokenization-firm-tzero-approval-to-trade-corporate-debt' },
      { label: 'tZERO + Nomyx Partnership (Mar 2026)', url: 'https://www.tzero.com/news/tzero-nomyx-partner-to-provide-issuers-a-direct-regulated-route-from-tokenization-to-trading' },
    ],
  },
  {
    slug: 'barter',
    title: 'Barter and Asset Exchange for High-Value Assets',
    subtitle: 'How structured asset-for-asset exchanges create value when cash sales are impractical',
    author: 'Shane Pierson',
    date: 'April 2026',
    readTime: '7 min read',
    model: 'Barter',
    modelColor: '#5B2D8E',
    icon: ArrowLeftRight,
    excerpt: 'Structured barter and asset exchange still matter when high-value assets are hard to sell for cash. The model is most useful in thin markets, portfolio swaps, cross-border deals, and qualifying 1031 real property exchanges.',
    content: `## Barter Sounds Old Until You Need It

Barter is the direct exchange of one asset for another without cash acting as the middle step. It is ancient, but that does not make it obsolete.

In high-value markets, barter usually appears when conventional liquidity is weak. If there is no deep buyer pool, if both parties would rather swap than sell, or if a tax-advantaged real property exchange is available, asset-for-asset deals can solve a problem that a cash sale does not solve well.

The commercial barter market in the United States is larger than most people assume. The International Reciprocal Trade Association estimates that hundreds of thousands of businesses participate in organized barter exchanges each year, with transactions valued in the billions of dollars.

## Where Asset Exchange Creates Real Value

**Illiquid markets.** Some assets are simply hard to sell for cash at a reasonable price. If the buyer universe is tiny, a direct exchange with a party holding a complementary asset can unlock value that would otherwise stay frozen.

**Portfolio rebalancing.** An investor concentrated in one category, say a parcel of gemstones, may prefer to trade into another category such as real estate rather than sell, hold cash, and re-enter a different market with another round of fees and friction.

**Tax-advantaged exchanges.** Section 1031 of the Internal Revenue Code still allows certain like-kind exchanges of real property to defer capital gains taxes. The Tax Cuts and Jobs Act of 2017 narrowed 1031 treatment to real property, which means personal property such as gemstones no longer qualifies. Even so, for real estate holders, the tax deferral can be a decisive reason to structure an exchange instead of a sale.

**Cross-border transactions.** In situations where currency conversion costs, capital controls, or local restrictions make cash movement difficult, asset-for-asset structures can keep a transaction alive.

## What a Properly Structured Barter Deal Requires

A real barter transaction is not a handshake and a hope. It needs structure.

**Independent valuation of both assets.** Each side needs a credible view of what is being given and what is being received. Without that, the deal becomes an argument over numbers instead of an exchange.

**Exchange agreement.** The contract has to describe the assets, document the agreed values, lay out representations and warranties, define the closing conditions, and specify remedies if something goes wrong.

**Simultaneous or staged closing.** Some exchanges close in one step. Others use an intermediary or escrow structure so both sides can transfer safely without taking unnecessary counterparty risk.

**Tax reporting.** Barter transactions are taxable events. The IRS requires the fair market value of property received in exchange to be reported as income if it exceeds the basis of the property given up. That is why tax advice is not optional here.

## Why Intermediaries Matter

For high-value exchanges, intermediaries often make the difference between a workable deal and a stalled one. They can help identify counterparties, coordinate valuation, manage custody and transfer logistics, and keep the documentation tight enough for tax and regulatory review.

In some cases the intermediary is a formal barter exchange that maintains trade credits or units of account. In others, it is simply a deal professional who knows two parties with matching needs. Either way, the value is usually in lowering friction and reducing mistrust.

## The Limits Are Real

Barter is harder than cash sale for one obvious reason: both sides have to want what the other side has at roughly the same time and at roughly compatible values. That is a narrow target.

Valuation disputes can sink the transaction. So can mismatched timing, incomplete diligence, or tax assumptions that do not survive professional review. And because non-like-kind exchanges do not automatically produce tax advantages, many barter deals should be evaluated purely on commercial logic, not on hoped-for tax benefits.

Still, I would not dismiss the strategy. When liquidity is constrained, when a real property 1031 exchange is on the table, or when two sophisticated holders have genuinely complementary assets, a structured barter deal can simply be the most practical way to get the transaction done.`,
    sources: [
      { label: 'IRS: Like-Kind Exchanges Under IRC Section 1031', url: 'https://www.irs.gov/newsroom/like-kind-exchanges-under-irc-section-1031' },
      { label: 'International Reciprocal Trade Association (IRTA)', url: 'https://www.irta.com/' },
      { label: 'Tax Cuts and Jobs Act — 1031 Exchange Changes', url: 'https://www.irs.gov/newsroom/tax-cuts-and-jobs-act-provision-11045-section-1031-like-kind-exchanges' },
    ],
  },
]

export const RESEARCH_ARTICLES: Article[] = [
  {
    slug: 'testing-interest',
    title: 'How to Test Investor Interest for Alternative Asset Offerings',
    subtitle: 'Four regulatory pathways to validate demand before committing six figures to legal fees',
    author: 'Shane Pierson',
    date: 'April 2026',
    readTime: '11 min read',
    model: 'Research',
    modelColor: '#1A8B7A',
    icon: Search,
    category: 'research',
    excerpt: 'Before spending $80K-$150K on legal and compliance for a private placement, there are four proven ways to test whether real investor demand exists for your asset class.',
    content: `## The Most Expensive Mistake in Alternative Investments

The most common and most costly mistake in alternative asset offerings is building something nobody wants to buy. Legal fees for a Reg D 506(c) private placement run $80,000 to $150,000 before a single dollar is raised. Add appraisals, custody, broker-dealer engagement, and marketing, and you are looking at six figures committed before you know whether investors will show up.

There are four ways to test the thesis before making that commitment. Each operates under different rules, costs different amounts, and produces different quality of data.

## Pathway 1: Educational Content and Interest Capture ($5K-$15K)

This is the lightest touch. You are not describing a specific offering. You are publishing research about the asset class, building an email list, and tracking who engages.

What you do: publish articles about the asset class, create a landing page with a "learn more" form, run targeted LinkedIn ads, host an educational webinar. What you track: email signups, webinar attendance, inbound inquiries, content engagement.

What you cannot do: describe a specific security, accept money, quote returns.

This approach costs $5,000 to $15,000 and produces directional data. If 200 accredited investors sign up to learn more about gemstone-backed securities over 60 days, that is a signal. If 3 people sign up, that is also a signal.

## Pathway 2: Reg CF Testing the Waters ($10K-$25K)

Regulation Crowdfunding has a formal "Testing the Waters" provision under Rule 206. Before filing Form C, you can publicly solicit interest as long as your materials include required disclaimers stating that no money is being solicited and no offer can be accepted until the exemption requirements are met.

This gives you permission to collect non-binding indications of interest with dollar amounts. Real demand data, not guesses.

The cost is $10,000 to $25,000 for legal review of TTW materials, landing page development, and a 30-60 day campaign. If the data supports proceeding, you file Form C and launch the offering. If it does not, you have spent $15K instead of $150K learning the same lesson.

Reg CF caps raises at $5 million per year, which may be too small for high-value asset offerings. But the TTW provision is useful as a demand validation tool even if the actual raise happens under a different exemption.

## Pathway 3: Reg A+ Testing the Waters ($15K-$35K)

Regulation A+ has the same TTW concept but at a larger scale. You can raise up to $75 million per year and include non-accredited (retail) investors. The TTW provision under Rule 255 lets you gauge interest before filing Form 1-A with the SEC.

The cost is higher because Reg A+ materials tend to be more detailed, and the eventual filing requires audited financials (Tier 2). But the TTW phase itself costs $15,000 to $35,000, which is still a fraction of the full offering cost of $150,000 to $350,000.

This pathway makes sense when you want to validate demand from a broader investor base, including retail investors who are not accredited.

## Pathway 4: Direct Conversations (Free)

Talk to 20 people who match your target investor profile. Not a pitch. A conversation. Ask what would make them allocate to this asset class. Ask what would make them pass. Ask what information they would need to feel confident.

This produces qualitative data that surveys and landing pages cannot capture. The body language when someone says "I would be interested at $100K minimums" tells you more than a form submission.

## Which Path Should You Choose?

For most issuers targeting accredited investors with offerings above $1 million, the practical sequence is: start with Pathway 1 (educational content) to build an audience, then run a Reg CF TTW campaign (Pathway 2) to collect hard interest data, then use that data to decide whether to proceed with a full Reg D 506(c) offering.

The SEC's March 2025 guidance makes this sequence even more practical. If your minimum investment is $200,000 or above, investor self-certification is now sufficient for 506(c) verification. That eliminates the most burdensome compliance step and lowers the cost of the actual offering launch.

Test before you build.`,
    sources: [
      { label: 'SEC Rule 506(c) General Solicitation', url: 'https://www.sec.gov/resources-small-businesses/exempt-offerings/general-solicitation-rule-506c' },
      { label: 'SEC Regulation Crowdfunding Guidance', url: 'https://www.sec.gov/resources-small-businesses/regulation-crowdfunding-guidance-issuers' },
      { label: 'Gibson Dunn: SEC Bright-Line Test for 506(c)', url: 'https://www.gibsondunn.com/sec-provides-bright-line-test-for-investor-verification-under-rule-506c/' },
      { label: 'Syndicationattorneys.com: Testing the Waters', url: 'https://syndicationattorneys.com/articles/testing-the-waters/' },
    ],
  },
  {
    slug: 'offering-costs',
    title: 'What Does It Actually Cost to Launch a Reg D 506(c) Offering?',
    subtitle: 'A line-by-line breakdown of real costs, from SPV formation to first subscription',
    author: 'Shane Pierson',
    date: 'April 2026',
    readTime: '9 min read',
    model: 'Research',
    modelColor: '#C47A1A',
    icon: DollarSign,
    category: 'research',
    excerpt: 'Legal fees, appraisals, custody, broker-dealers, verification, marketing. Here is what a Reg D 506(c) offering actually costs, broken down by line item.',
    content: `## Nobody Talks About the Real Numbers

Most articles about tokenization or fractional securities describe the process in conceptual terms. Form the SPV. Draft the PPM. File with the SEC. What they rarely include is what each of those steps actually costs.

I am going to lay out the real numbers based on our research across multiple service providers, legal counsel consultations, and platform evaluations. These are ranges, not quotes. Your specific costs will depend on asset complexity, counsel choice, and offering structure.

## The Line Items

**SPV Formation: $2,000-$5,000**
A Delaware LLC is the standard vehicle. Filing fees are minimal. The cost is primarily legal counsel to draft the operating agreement with proper investor protections, distribution waterfalls, and management authority provisions.

**Securities Counsel (PPM, Operating Agreement, Subscription Docs): $15,000-$35,000**
This is typically the largest single line item. The Private Placement Memorandum alone runs 50-100+ pages and must accurately describe the offering, the risks, the asset, the management team, and the use of proceeds. Cutting corners here is not advisable.

**Asset Appraisals: $5,000-$15,000**
For high-value physical assets, best practice is three independent USPAP-compliant appraisals. The two-lowest average establishes the offering value. For gemstones, add GIA certification at $100-$500 per stone.

**Institutional Custody Setup: $5,000-$15,000**
Bonded vault storage with a recognized custodian (Brink's, Malca-Amit). Includes initial transport, inventory verification, and insurance setup. Ongoing custody fees are separate.

**Broker-Dealer Engagement: $5,000-$15,000 setup + 1-7% of capital raised**
A FINRA-registered broker-dealer supervises the offering, manages compliance, and may provide investor transaction infrastructure. Dalmore Group, North Capital, and Rialto Markets are active in this space. Setup fees vary; the percentage of capital raised is the larger ongoing cost.

**Investor Verification: $50-$500 per investor**
Under 506(c), every investor must be verified as accredited. Third-party services like Parallel Markets (formerly Accredify) charge $50-$100 per verification. CPA or attorney letters run $250-$500. The SEC's March 2025 guidance allows self-certification at $200K+ minimums, potentially eliminating this cost for higher-minimum offerings.

**Transfer Agent: $5,000-$10,000/year**
Manages the cap table, processes transfers, and maintains shareholder records. KoreConX offers a free base platform; traditional transfer agents charge annual fees.

**Investor Portal Technology: $5,000-$15,000**
Online subscription flow, document delivery, e-signature, and investor dashboard. DealMaker, KoreConX, and Securitize all offer this functionality at different price points.

**Marketing and Advertising: $10,000-$30,000**
Landing pages, content marketing, LinkedIn ads, webinars, conference attendance. Under 506(c), you can advertise publicly, but the quality of materials matters. Cheap marketing signals cheap operations.

**Insurance: $5,000-$15,000**
Errors and omissions coverage for the manager, plus specie insurance for the physical asset. Coverage amounts depend on asset value and offering structure.

**Blue Sky Filings: $2,000-$5,000**
State-level notice filings required in each state where you sell. Filing fees vary by state. Some states require additional filings or disclosures.

**Form D Filing: $0**
The SEC does not charge a fee for Form D. The filing itself is a notice, not a registration.

## Total Range

Adding it all up: $80,000 to $150,000 to reach offering launch, before a single dollar is raised from investors.

For a $5 million offering, that represents 1.6% to 3% of the raise in upfront costs. For a $10 million offering, it is 0.8% to 1.5%. For a $1 million offering, it is 8% to 15%, which starts to strain the economics.

The practical minimum offering size for a full 506(c) structure is roughly $3-5 million. Below that, the fixed costs eat too much of the raise.

## Where to Save (and Where Not To)

You can save money on marketing by starting with organic content before paid ads. You can save on technology by using simpler portal solutions. You can save on appraisals by limiting to two instead of three (though three is best practice).

Do not save money on securities counsel. Do not save money on custody. Do not save money on compliance. These are the areas where cutting corners creates regulatory risk, investor distrust, and potential personal liability.`,
    sources: [
      { label: 'Manhattan Street Capital: Reg D Offering Costs', url: 'https://www.manhattanstreetcapital.com/faq/for-fundraisers/how-much-does-regulation-d-offering-cost' },
      { label: 'Accredify/Parallel Markets Pricing', url: 'https://parallelmarkets.com' },
      { label: 'Dalmore Group Pricing', url: 'https://dalmoregroup.com/pricing' },
      { label: 'KoreConX Platform', url: 'https://koreconx.com/pricing/' },
    ],
  },
  {
    slug: 'broker-landscape',
    title: 'Broker-Dealers and ATS Platforms for Tokenized Securities in 2026',
    subtitle: 'Who the key players are, what they offer, and how to evaluate them',
    author: 'Shane Pierson',
    date: 'April 2026',
    readTime: '10 min read',
    model: 'Research',
    modelColor: '#1E3A6E',
    icon: Shield,
    category: 'research',
    excerpt: 'Broker-dealers and alternative trading systems are the regulated infrastructure that connects tokenized securities to actual investors. Here is who does what and how to choose.',
    content: `## Why Broker-Dealers Matter More Than Platforms

In the tokenized securities conversation, most of the attention goes to the technology platforms: which blockchain, which token standard, which smart contract framework. But the regulated infrastructure that actually enables securities to be sold and traded runs through broker-dealers and alternative trading systems.

A broker-dealer is a firm registered with the SEC and FINRA that can legally buy and sell of securities. An ATS (Alternative Trading System) is a SEC-regulated electronic venue where securities can be matched and traded outside of traditional exchanges like NYSE or NASDAQ.

For tokenized real-world assets, these are not optional. If your token is a security (and under most structures, it is), it must be distributed through or supervised by a registered broker-dealer.

## The Key Players

**tZERO**
tZERO operates as a SEC/FINRA-regulated broker-dealer, ATS, and special purpose broker-dealer. They received FINRA approval in December 2025 to offer retail access to tokenized mutual funds and for secondary trading in corporate debt securities. Their ATS now supports 23.5 hours of trading per business day with 24/7 order entry. In March 2026, their partnership with Nomyx created an integrated issuance-to-trading pipeline.

tZERO is the closest thing to a full-stack regulated exchange for digital securities in the United States. If secondary trading is a priority, they are the most established venue.

**Securitize Markets**
Securitize operates both an issuance platform and a registered broker-dealer/ATS. They are most notable for tokenizing BlackRock's BUIDL fund, which holds nearly $2 billion in assets. Their end-to-end approach covers issuance, compliance, cap table management, and secondary trading.

For issuers who want a single platform handling everything from token creation to investor onboarding to secondary market access, Securitize is the most integrated option.

**Dalmore Group**
Dalmore is a FINRA-registered broker-dealer that acts as broker-dealer of record for Reg A+, Reg CF, and Reg D offerings. They have helped over 1,000 clients raise more than $2 billion. Their model is compliance supervision: they oversee the offering, manage KYC/AML, verify accreditation, and can license your own sales team under their broker-dealer umbrella.

For issuers who want to maintain their own investor relationships and marketing while having a regulated BD supervise the compliance layer, Dalmore is the most flexible option.

**North Capital Private Securities**
North Capital is a registered broker-dealer that also operates the PPEX Alternative Trading System for secondary trading of private and exempt securities. Their TransactAPI platform enables broker-dealers and funding platforms to conduct online private securities offerings with standards-based API integration.

For issuers with existing technology infrastructure who need a broker-dealer and ATS that integrates via API rather than requiring a platform switch, North Capital offers the most modular approach.

**Rialto Markets**
Rialto is a FINRA member broker-dealer and SEC-registered ATS focused on primary issuance and secondary trading for Reg A+, Reg CF, and Reg D securities. Their DATS (Decentralized Automated Trading System) embeds ATS logic into smart contracts for on-chain matching and settlement.

Their 2025 partnership with Inveniam positions them for tokenized private market derivatives, futures, and swaps. For issuers interested in more sophisticated secondary market structures beyond simple buy-sell matching, Rialto is worth evaluating.

## How to Evaluate a Broker-Dealer

Three criteria separate the serious players:

**Regulatory track record.** Have they actually supervised a compliant offering that closed? Ask for references from issuers, not just platform demos. Check their FINRA BrokerCheck record for any disclosures or disciplinary history.

**Integration architecture.** Can they work with your existing workflow, or do they require you to rebuild everything around their platform? Some BDs require exclusive use of their technology. Others operate as a compliance overlay on your existing systems.

**Fee transparency.** Setup fees, percentage of capital raised, per-investor costs, ongoing compliance fees, ATS listing fees. If they cannot give you a clear cost estimate before engagement, that is worth questioning.

## Choosing a Partner

The broker-dealer you choose becomes a permanent part of your offering's infrastructure. Investors see the BD's name on the subscription documents. Regulators hold the BD responsible for compliance supervision. Secondary trading happens (or does not) based on the ATS's liquidity and reach.

This is not a vendor selection. It is a partnership decision. Treat it accordingly.`,
    sources: [
      { label: 'tZERO Regulated Platform', url: 'https://www.tzero.com' },
      { label: 'Securitize Platform', url: 'https://securitize.io' },
      { label: 'Dalmore Group', url: 'https://dalmoregroup.com' },
      { label: 'North Capital', url: 'https://www.northcapital.com' },
      { label: 'Rialto Markets', url: 'https://rialtomarkets.com' },
      { label: 'FINRA BrokerCheck', url: 'https://brokercheck.finra.org' },
    ],
  },
  {
    slug: 'sec-guidance',
    title: "What Changed for Private Placements in 2025-2026",
    subtitle: 'The SEC guidance that matters for anyone structuring tokenized or fractional offerings',
    author: 'Shane Pierson',
    date: 'April 2026',
    readTime: '8 min read',
    model: 'Research',
    modelColor: '#1B6B4A',
    icon: BookOpen,
    category: 'research',
    excerpt: 'Two SEC actions in 2025-2026 changed the practical reality of private placements. Here is what they mean for issuers working with real-world assets.',
    content: `## Two Actions That Matter

The SEC publishes guidance regularly, and most of it is incremental. Two actions in the 2025-2026 period stand out because they change the practical cost and feasibility of structuring tokenized and fractional asset offerings.

## Action 1: The March 2025 Rule 506(c) Verification Guidance

On March 12, 2025, the SEC's Division of Corporation Finance published new Compliance and Disclosure Interpretations for Rule 506(c) of Regulation D. The core change: issuers can now satisfy accredited investor verification through self-certification when the minimum investment meets certain thresholds.

For individual investors, the threshold is $200,000. For entity investors, it is $1,000,000. Below these amounts, traditional verification methods are still required (tax returns, bank statements, third-party letters, or broker-dealer/attorney confirmations).

Why this matters practically: before this guidance, many issuers avoided 506(c) in favor of 506(b) specifically because of the verification burden. The cost of collecting and reviewing financial documents from each investor added $250-$500 per person to the offering cost. For an offering with 50 investors, that is $12,500-$25,000 in verification costs alone, plus the friction that causes some investors to drop out of the process entirely.

With self-certification at $200K+ minimums, the verification cost drops to essentially zero for those investors. A written representation from the investor is sufficient.

For PleoChrome's typical use case, where minimum investments are likely in the $100,000-$500,000 range, this guidance means offerings at the $200K+ level have a meaningfully lower compliance cost and faster investor onboarding.

## Action 2: The January 2026 Tokenized Securities Statement

On January 28, 2026, staff from three SEC divisions (Corporation Finance, Trading and Markets, and Investment Management) issued a joint statement on tokenized securities.

The headline is simple: a tokenized security is still a security. All existing federal securities laws apply regardless of whether ownership is recorded on a blockchain, in a traditional book-entry system, or on paper.

But the statement goes further by drawing a distinction between two types of tokenized products:

**Issuer-sponsored tokenized securities** are digital representations of actual equity or debt interests issued directly by the company. These are the same securities that would exist in traditional form, just represented differently. The existing regulatory framework applies cleanly.

**Third-party tokenized products** are created by someone other than the issuer, often providing synthetic exposure to an underlying asset rather than direct ownership. These face heightened scrutiny, particularly when offered to retail investors.

For issuers structuring compliant offerings, the practical implication is clarity. If you are issuing LLC membership interests (fractional securities) and representing them as tokens, you follow the same rules as any other private placement. No new exemption is needed. No new compliance framework is required. The rules are the same. The record-keeping technology is different.

## What This Means Together

These two actions create a clearer, lower-friction path for compliant tokenized offerings:

The verification simplification (March 2025) reduces the cost and friction of 506(c) offerings at higher minimums. The tokenized securities statement (January 2026) confirms that the regulatory framework works for digital representations without requiring new exemptions.

For asset holders considering their first offering: the regulatory environment is more favorable now than it was 18 months ago. Not because the rules have changed, but because the guidance on how to follow them has gotten more practical.`,
    sources: [
      { label: 'SEC Statement on Tokenized Securities (Jan 2026)', url: 'https://www.sec.gov/newsroom/speeches-statements/corp-fin-statement-tokenized-securities-012826' },
      { label: 'Gibson Dunn: SEC Bright-Line Test for 506(c)', url: 'https://www.gibsondunn.com/sec-provides-bright-line-test-for-investor-verification-under-rule-506c/' },
      { label: 'Kirkland & Ellis: SEC No-Action Letter on 506(c)', url: 'https://www.kirkland.com/publications/kirkland-aim/2025/03/sec-no-action-letter-opens-the-door-wider-on-rule-506c-offerings' },
      { label: 'Sidley Austin: SEC Tokenized Securities Playbook', url: 'https://www.sidley.com/en/insights/newsupdates/2026/01/sec-staff-unveils-a-playbook-for-tokenized-securities' },
    ],
  },
  {
    slug: 'collateral-liquidity',
    title: "Collateral-Based Liquidity: Why You Don't Always Need to Sell",
    subtitle: 'How DeFi lending, MakerDAO, and institutional collateral frameworks create liquidity without secondary markets',
    author: 'Shane Pierson',
    date: 'April 2026',
    readTime: '9 min read',
    model: 'Research',
    modelColor: '#5B2D8E',
    icon: Droplets,
    category: 'research',
    excerpt: 'When secondary trading markets are thin, collateral-based lending offers an alternative path to liquidity. MakerDAO, Binance, and institutional lenders are already accepting tokenized assets as collateral.',
    content: `## The Liquidity Problem Has More Than One Solution

Most discussions about RWA liquidity focus on secondary trading: building exchanges, attracting market makers, creating order books. These are important. But they are not the only way for token holders to access capital.

Collateral-based liquidity allows investors to borrow against their tokenized holdings without selling them. Instead of finding a buyer, you find a lender. The token stays in your wallet (or a smart contract), and you receive a loan denominated in stablecoins or fiat.

This is not a theoretical concept. It is already happening at institutional scale.

## MakerDAO and the RWA Collateral Model

MakerDAO (now rebranded as Sky) is the largest DeFi consumer of tokenized real-world assets. The protocol's RWA vaults hold over $2 billion in tokenized Treasuries, money market funds, and structured credit products as collateral backing the DAI stablecoin.

In early 2025, MakerDAO's Spark protocol allocated $1 billion to tokenized asset investments, with BlackRock's BUIDL, Superstate, and Centrifuge selected as recipients. This is institutional-grade capital flowing into tokenized assets specifically for their collateral utility.

The model works because MakerDAO does not need the underlying assets to trade actively. It needs them to maintain their value and generate yield. Tokenized Treasuries earning 4-5% annual yield are ideal collateral: stable value, predictable income, and transparent on-chain accounting.

## BlackRock BUIDL as Collateral

In November 2025, Binance listed BlackRock's BUIDL fund as off-exchange collateral for institutional trading. BUIDL holders can now use their tokenized Treasury positions to collateralize trading activity on Binance without liquidating the underlying position.

This is significant because it demonstrates that the largest crypto exchange and the largest asset manager in the world both view tokenized securities as viable collateral. The collateral utility creates demand for the token independent of secondary market trading volume.

## What This Means for Less Liquid Asset Classes

For tokenized real estate, gemstones, or mineral rights, where secondary trading volumes may be thin for years, collateral-based liquidity offers a bridge.

Consider a scenario: you hold $500,000 in tokenized fractional interests in a gemstone-backed SPV. The secondary market for these tokens is illiquid. Finding a buyer at fair value could take months. But if a lending protocol or institutional lender accepts these tokens as collateral at a 50% loan-to-value ratio, you can access $250,000 in capital without selling.

This is structurally identical to how traditional asset-backed lending works. A homeowner borrows against their house. A business borrows against its inventory. A collector borrows against their art through services like Athena Art Finance. The asset stays in the borrower's possession (or custody), and the lender has a secured claim.

The difference with tokenized assets is that the collateral can be locked in a smart contract with automated liquidation logic, reducing the lender's operational risk and potentially enabling lower interest rates.

## The Infrastructure Is Being Built

Several trends are converging to make collateral-based liquidity more accessible for tokenized RWAs:

The 2022 UCC amendments, now adopted by more than half of U.S. states, include Article 12 provisions that address digital assets. This creates a more coherent legal framework for using tokenized assets as collateral in secured transactions.

DeFi lending protocols are expanding beyond crypto-native collateral. Centrifuge, Maple Finance, and Goldfinch already support lending against tokenized private credit and real-world receivables.

Institutional custody solutions from providers like Fireblocks, BitGo, and Copper support the segregated custody arrangements that lenders require before accepting alternative collateral.

## The Practical Takeaway

If you are structuring a tokenized offering and worried about secondary market liquidity, consider this: your investors may not need an exchange to trade their tokens. They may need a lending facility that accepts them as collateral.

Building collateral utility into your token design from the start, through compatible custody arrangements, transparent valuation, and smart contract standards that lending protocols can integrate with, may prove more valuable than chasing secondary market depth.

Not all liquidity needs to come from a trade. Sometimes the best liquidity is a loan.`,
    sources: [
      { label: 'BlackRock BUIDL on Binance as Collateral (Nov 2025)', url: 'https://www.coindesk.com/business/2025/11/14/blackrock-s-usd2-5b-tokenized-fund-gets-listed-as-collateral-on-binance-expands-to-bnb-chain' },
      { label: 'MakerDAO Spark $1B Tokenized Asset Allocation', url: 'https://www.coindesk.com/business/2025/03/18/blackrock-s-buidl-superstate-and-centrifuge-win-spark-s-usd1b-tokenized-asset-windfall-report' },
      { label: 'UCC Articles 9 and 12: Digital Asset Framework', url: 'https://www.lowenstein.com/news-insights/publications/articles/ucc-articles-9-and-12-a-modern-legal-framework-for-secured-transactions-and-digital-assets-citron-caporale-podolnyy' },
      { label: 'Mafrur, R. (2025). arXiv:2508.11651', url: 'https://arxiv.org/abs/2508.11651' },
    ],
  },
]

export const ALL_ARTICLES = [...VALUE_MODEL_ARTICLES, ...RESEARCH_ARTICLES]

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
