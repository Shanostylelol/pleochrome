# The Liquidity Paradox: Why Tokenizing Real-World Assets Is Only Half the Battle

**By Shane Pierson, CEO — PleoChrome**
**Published: April 2026**

---

## Executive Summary

The promise of tokenization — that any real-world asset can be divided into digital tokens and traded globally around the clock — has attracted institutional capital at an extraordinary pace. By early 2026, over $36 billion in real-world assets exist on-chain, spanning U.S. Treasuries, private credit, commodities, real estate, and alternative investments. BlackRock's BUIDL fund alone holds nearly $2 billion in tokenized Treasury instruments.

Yet beneath these headline numbers lies a structural problem that the industry has been slow to address: most tokenized assets cannot be easily sold once purchased. The infrastructure to create tokens has outpaced the infrastructure to trade them.

This analysis draws heavily on the research of Rischan Mafrur of Macquarie University, whose 2025 paper *"Tokenize Everything, But Can You Sell It?"* (arXiv:2508.11651) provides the most comprehensive empirical examination of RWA liquidity to date. We extend his findings with current market data, practical examples, and forward-looking analysis relevant to asset orchestrators, issuers, and investors.

---

## The Scale of Tokenization in 2026

To understand the liquidity problem, it helps to first understand the scale of what has been built.

According to data aggregated by RWA.xyz and CoinGecko, the non-stablecoin tokenized RWA market has grown from roughly $5 billion in 2022 to over $36 billion by late 2025 — a more than sevenfold increase in three years. Analysts from BCG and Ripple project this market could reach $18.9 trillion by 2033, representing a compound annual growth rate of approximately 53%.

The composition of this market is heavily skewed toward institutional yield instruments:

| Asset Category | Approximate Market Cap (Mid-2025) | Liquidity Profile |
|---------------|----------------------------------|-------------------|
| Private Credit | $14–17 billion | Low |
| Tokenized U.S. Treasuries | $7.4 billion | Medium |
| Gold (Commodities) | $1.7 billion | High |
| Tokenized Stocks | $0.5 billion | Low |
| Real Estate | $0.3 billion | Low |
| Carbon Credits | $0.1 billion | Low |
| Fine Art | $0.1 billion | Low |

*Data sourced from RWA.xyz and Mafrur (2025), Table 1*

The dominant categories — private credit and U.S. Treasuries — collectively represent over 85% of all tokenized RWA value. These instruments are typically held to maturity by institutional investors and traded infrequently if at all. The asset classes that would benefit most from tokenization's liquidity promise — real estate, fine art, commodities beyond gold — represent less than 3% of the total market.

---

## The Liquidity Gap: What the Data Actually Shows

Mafrur's research provides the empirical backbone for understanding this gap. His analysis draws on on-chain data from platforms including RWA.xyz and Etherscan, examining metrics that matter for real liquidity: monthly active addresses, transfer counts, and holding durations.

### Finding 1: High Market Cap Does Not Mean Active Trading

Consider BlackRock's BUIDL fund, the single largest tokenized RWA by market capitalization. Despite holding over $2 billion in assets, the fund had only 85 unique token holders and 30 monthly active addresses as of mid-2025 (Mafrur, Table 2). Compare this to Paxos Gold (PAXG), a tokenized commodity with less than half the market cap, which supports over 69,000 holders and 5,678 monthly active addresses.

The disparity reveals a fundamental characteristic: tokenized yield instruments are designed for buy-and-hold, not for trading. An investor who purchases BUIDL tokens does so for the yield, not to speculate on price movement. The token functions as a digital certificate of deposit, not a tradable instrument.

### Finding 2: Most Tokens Change Hands Rarely

Mafrur documents that on the RealT platform — one of the earliest tokenized real estate marketplaces — token ownership changed hands on average only once per year. By comparison, equities in developed markets typically see multiple turnovers annually (Mafrur, citing Swinkels 2024).

This is not merely a technology problem. Even tokens listed on decentralized exchanges like Uniswap showed only approximately 25% higher turnover than those traded peer-to-peer or via over-the-counter channels (Swinkels 2024, as cited in Mafrur). Automated market makers can offer marginal improvements, but they cannot solve the fundamental challenge of trading heterogeneous, non-fungible assets.

### Finding 3: Transfer Activity Is Concentrated and Sporadic

The Ethereum on-chain data tells a striking story about consistency of activity. While PAXG has been continuously active for over five years with a 304-day longest active streak, institutional tokens like WTGXX (WisdomTree) show a longest streak of only 4 days, and JTRSY (Centrifuge) just 3 days (Mafrur, Table 3). Most activity occurs in bursts — during initial issuance, administrative rebalancing, or redemption events — rather than in sustained market trading.

### What This Means in Practice

To put this in concrete terms: if you tokenize a $12.5 million gemstone lot into 1,250 fractional tokens at $10,000 each, the data suggests that fewer than 50 investors would hold these tokens at any given time, perhaps 5–10 would be actively considering transactions in any given month, and the average holder would keep their position for over a year. This is not the 24/7 liquid global market that tokenization marketing materials often promise.

This does not mean tokenization is without value — far from it. But it means that issuers and orchestrators must plan for illiquidity rather than assuming it away.

---

## Why Liquidity Remains Constrained: Five Structural Barriers

Mafrur identifies five categories of structural barriers. Each operates independently, but together they create a reinforcing cycle of illiquidity.

### 1. Fragmented Marketplaces

Unlike equities traded on centralized exchanges like NYSE or NASDAQ, tokenized RWAs are scattered across decentralized platforms (Uniswap, Aave), specialized custodial systems (tZERO), and informal over-the-counter channels. This fragmentation prevents liquidity aggregation and efficient price discovery. An investor seeking to sell a tokenized real estate position has no single venue to find a buyer.

### 2. Regulatory Gating

Many tokenized assets are issued under exemptions (such as Regulation D, Rule 506(c) in the United States) that restrict participation to accredited or KYC-verified investors. While necessary for investor protection, these restrictions dramatically reduce the pool of potential buyers. The SEC's January 2026 statement on tokenized securities reinforced that a tokenized security remains a security — all existing regulations apply regardless of the token wrapper.

### 3. Valuation Opacity

Publicly traded stocks have transparent, continuous pricing. Tokenized real estate or private credit positions often lack comparable benchmarks. Without reliable pricing, bid-ask spreads widen, and investors apply a liquidity discount — paying less for an asset simply because they are uncertain about its fair value and their ability to exit.

### 4. Absence of Market Makers

Traditional financial markets rely on designated market makers who commit capital to ensuring continuous two-sided markets. In the tokenized RWA space, such actors are rare. While DeFi protocols attempt to incentivize liquidity provision through yield farming and fee sharing, these mechanisms are often insufficient for non-fungible, low-volume tokens tied to unique underlying assets.

### 5. Technology and Operational Friction

Wallet management, gas fees, cross-chain interoperability challenges, and the learning curve of blockchain interactions create barriers for both retail and institutional investors. Assets issued on private or permissioned blockchains may lack compatibility with DeFi protocols entirely, further fragmenting potential liquidity.

---

## Emerging Solutions: The Path Forward

Despite these challenges, the research points to credible pathways for improvement. The RWA ecosystem is actively iterating on solutions across legal, technical, and institutional domains.

### Hybrid Market Structures

Mafrur advocates for hybrid models that combine regulated, centralized platforms for primary issuance and compliance with decentralized protocols for secondary trading. This mirrors the approach that traditional securities markets have used for decades — regulated exchanges for primary offerings, combined with electronic networks for secondary trading.

The Depository Trust Company (DTC) received SEC approval in late 2025 to offer tokenization services, marking the first time in the U.S. that tokenized security entitlements held through a central securities depository can be held on public and private-permissioned blockchains. Similarly, Nasdaq has filed proposed rule changes to enable trading of tokenized securities on its exchange.

### Collateral-Based Liquidity

Not all liquidity needs to come from direct secondary trading. MakerDAO (now Sky) has integrated over $2 billion in tokenized Treasuries and structured credit products as collateral for its DAI stablecoin. BlackRock's BUIDL fund is now accepted as collateral on Binance for institutional trading. This means investors can access liquidity — borrowing against their tokenized holdings — without needing to find a buyer in a secondary market.

For asset classes with inherently long holding periods (real estate, private credit, fine art), this collateral-based approach may prove more practical than attempting to build deep secondary trading markets.

### Regulatory Modernization

The SEC's March 2025 guidance on Rule 506(c) expanded the definition of "reasonable steps" for accredited investor verification, making it easier for smaller issuers to conduct compliant offerings. The January 2026 statement on tokenized securities, while reaffirming that securities laws apply, provided a clearer playbook for how issuers can structure tokenized offerings within existing frameworks.

In Europe, the EU Pilot Regime and the Markets in Crypto-Assets Regulation (MiCA) are creating regulatory sandboxes for tokenized securities, potentially broadening the eligible investor base and enabling cross-border participation.

### Transparency and Standardized Valuation

The absence of standardized pricing for many tokenized assets creates information asymmetry that investors rightly penalize with liquidity discounts. Projects that publish on-chain performance metrics, regular third-party appraisals, and transparent fund documentation can narrow bid-ask spreads and build the trust necessary for active secondary markets.

---

## What This Means for PleoChrome's Approach

PleoChrome operates as an asset-agnostic orchestration platform — we coordinate the specialists, compliance workflows, and value creation processes that transform physical assets into investment-grade instruments. Our five value creation models (tokenization, fractional securities, debt instruments, broker sale, and barter) reflect the reality documented in this research: no single monetization path is optimal for every asset.

Several implications from Mafrur's findings inform our strategy:

**Liquidity planning begins at origination, not at distribution.** The choice of value creation model, regulatory structure, and distribution platform must be made with realistic liquidity expectations. A gemstone tokenized under Reg D 506(c) will have a different liquidity profile than one structured as a debt instrument with scheduled repayment.

**Hybrid approaches may serve assets better than pure tokenization.** For certain assets, a traditional broker sale or asset-backed lending structure may deliver faster value realization than a tokenized offering that requires building secondary market depth.

**Transparency is a competitive advantage.** Mafrur's research underscores that valuation opacity is a primary barrier to liquidity. Issuers who invest in GIA certification, independent appraisals, on-chain proof of reserve, and continuous performance reporting will attract more participation than those who treat compliance as a checkbox exercise.

**The infrastructure is maturing.** The convergence of institutional custody solutions (Binance accepting BUIDL as collateral), regulatory clarity (SEC and DTC guidance), and DeFi integration (MakerDAO's RWA collateral framework) suggests that the structural barriers Mafrur identifies are being actively addressed. The question is not whether these problems will be solved, but when — and which asset orchestrators will be positioned to benefit.

---

## Conclusion

The tokenization of real-world assets represents one of the most significant structural innovations in capital markets since the electronic trading revolution of the 1990s. The $36 billion already on-chain demonstrates that the technology works and institutional adoption is real.

But as Mafrur's research makes clear, tokenization alone is not sufficient to create liquid markets. The gap between issuance and tradability remains wide, and closing it requires coordinated progress across legal frameworks, market infrastructure, valuation standards, and investor education.

For asset holders, investors, and orchestrators, the practical takeaway is straightforward: approach tokenization with realistic expectations about liquidity timelines, choose value creation models that match the asset's characteristics and the investor base's needs, and invest in the transparency and compliance infrastructure that builds the trust necessary for markets to develop.

The future of RWA tokenization is not in question. The timing, however, depends on the industry's willingness to solve the hard structural problems that this research has documented.

---

## References

1. Mafrur, R. (2025). "Tokenize Everything, But Can You Sell It? RWA Liquidity Challenges and the Road Ahead." arXiv:2508.11651 [q-fin.GN]. Department of Applied Finance, Macquarie University.

2. Swinkels, L. (2024). "Liquidity Mechanisms in Real-World Assets: The Empirical Case of Real Estate Tokenization." SSRN Preprint.

3. Cervellati, T. (2025). "Tokenization of Private Assets: Unlocking Liquidity, Transparency, & Access." CAIA Association.

4. Agur, I., Bauer, G.V., et al. (2025). "Tokenization and Financial Market Inefficiencies." Fintech Notes 2025/001, International Monetary Fund.

5. Laschinger, R., et al. (2024). "Liquidity Mechanisms in Real-World Assets." SSRN Working Paper.

6. U.S. Securities and Exchange Commission (2026). "Statement on Tokenized Securities." Division of Corporation Finance, January 28, 2026.

7. U.S. Securities and Exchange Commission (2025). "Compliance and Disclosure Interpretations: Rule 506(c) Verification." March 12, 2025.

8. CoinGecko (2025). "2025 RWA Report."

9. RWA.xyz (2025). Market data as of July 31, 2025.

---

*This article represents the analysis and opinions of the author and does not constitute investment advice, an offer to sell, or a solicitation of an offer to buy any securities. Past performance is not indicative of future results. All investments involve risk, including the possible loss of principal. Tokenized securities are subject to regulatory restrictions and may not be suitable for all investors. Consult with qualified legal and financial advisors before making investment decisions.*

*PleoChrome is a real-world asset orchestration platform. We do not provide investment advice, broker securities, or hold client assets. "Value from Every Angle."*
