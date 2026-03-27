# Module 8: Brickken Meeting Masterclass — Everything You Need to Know

## What This Module Is

You have a meeting with Brickken. They are a tokenization platform based in Barcelona, Spain. They are one of the companies that could be PleoChrome's technology partner — the company whose software actually creates and manages the digital tokens that represent ownership of your gemstones.

This module will teach you:
1. What Brickken actually does (in plain English)
2. Every acronym and term they'll use
3. What questions to ask and why
4. What answers to have ready when they ask YOU questions
5. Red flags to watch for
6. How to compare them to alternatives

**Read time:** 30 minutes. Read this before the call.

---

## Part 1: What Is Brickken and What Do They Do?

### The Simple Explanation

Brickken is like Shopify, but for creating investment tokens instead of online stores.

When you want to sell products online, you don't build Amazon from scratch. You use Shopify — they give you a website builder, payment processing, inventory tracking, and shipping tools. You just configure it for YOUR products.

Brickken works the same way for tokenization:
- They give you the smart contracts (pre-built, pre-tested, pre-audited code)
- They give you a dashboard to configure your token (name, supply, rules)
- They give you KYC/investor onboarding tools
- They give you an investor management interface
- They handle the blockchain deployment
- You just configure it for YOUR gemstone offering

**PleoChrome does NOT build blockchain technology.** We use Brickken's technology. We are the orchestrator — we coordinate the whole process. Brickken is one of our specialist partners.

### What Brickken Is NOT

- They are NOT a broker-dealer (they don't sell your tokens to investors)
- They are NOT a custodian (they don't hold your stones)
- They are NOT a legal firm (they don't write your PPM)
- They are NOT an oracle (they don't verify vault custody — that's Chainlink)
- They ARE the platform that creates and manages the digital tokens

### Brickken's Products

**Issuer Studio** — Their main product. A dashboard where you:
1. Create a token (set name, supply, rules)
2. Deploy it to a blockchain (they handle the technical part)
3. Manage investors (KYC, whitelisting, distributions)
4. Track everything (cap table, transfers, compliance)

**Whitelabel** — Their premium product. Same technology but with YOUR branding. Investors see "PleoChrome" not "Brickken." This is what we eventually want.

**API** — For developers. Instead of using their dashboard, you can do everything programmatically. This is what our governance engine would connect to.

---

## Part 2: Every Acronym and Term They'll Use

### Blockchain & Token Terms

| Term | What It Means | Simple Analogy |
|------|--------------|----------------|
| **ERC-3643** | The specific type of token standard for regulated securities. Has built-in compliance rules (who can hold, who can transfer). $32 billion tokenized using this standard. | A stock certificate with a built-in bouncer that checks ID before every transfer |
| **ERC-20** | The basic token standard. No built-in rules — anyone can send to anyone. Used for most cryptocurrencies. NOT what we want. | A dollar bill — no restrictions on who can hold it |
| **Polygon** | The blockchain (digital ledger) where tokens will live. Fast (2 seconds) and cheap ($0.01 per transaction). | The highway our tokens travel on |
| **Ethereum** | The original smart contract blockchain. Slow and expensive. Polygon is built on top of it for speed. | The main highway — Polygon is the express lane |
| **Smart Contract** | A program on the blockchain that automatically enforces rules. Once deployed, the rules can't be changed. | A vending machine — put in the right inputs, get the right outputs, no human needed |
| **Solidity** | The programming language smart contracts are written in. You'll never write it, but Brickken's contracts are in Solidity. | The language the vending machine's instructions are written in |
| **Gas** | The fee paid to the blockchain network to process a transaction. On Polygon it's under $0.01. | Postage for sending a letter |
| **Mainnet** | The real, live blockchain where actual tokens with real value exist. | The real highway with real cars |
| **Testnet** | A practice blockchain for testing. Tokens here have no value. | A simulator — looks real but nothing counts |
| **Deploy** | The act of publishing a smart contract to the blockchain. Permanent and irreversible on mainnet. | Publishing a book that can never be edited |
| **Mint** | Creating new tokens. Like the Treasury printing new money. | Printing new stock certificates |
| **Burn** | Destroying tokens permanently. Reduces total supply. | Shredding stock certificates |
| **Wallet** | A digital address that can hold tokens + a private key to access them. The address is public, the key is private. | A mailbox (anyone can see the address and send mail) + a key (only you can open it) |
| **Whitelist** | A list of approved wallet addresses that are allowed to hold the token. Only people on this list can receive tokens. | The guest list at a private event |

### Compliance & Regulatory Terms

| Term | What It Means | Why It Matters |
|------|--------------|----------------|
| **KYC** | Know Your Customer. Verifying someone's identity (government ID, liveness check, address). | Required by law before any financial transaction. Brickken includes this in their platform. |
| **KYB** | Know Your Business. Same as KYC but for companies — verifying the entity is real, who owns it, etc. | If the asset holder is a company (not an individual), we need KYB. |
| **AML** | Anti-Money Laundering. The set of procedures to prevent criminals from using the system to hide dirty money. | Every financial platform must have AML procedures. Brickken's KYC is part of this. |
| **Reg D 506(c)** | The US securities law exemption that allows us to sell tokens to accredited investors and advertise publicly. | This is the legal framework our offerings operate under. Brickken needs to support it. |
| **Accredited Investor** | A person with $200K+ annual income or $1M+ net worth (excluding their home). Only these people can buy our tokens. | Brickken's compliance module must verify this before allowing someone to hold tokens. |
| **PPM** | Private Placement Memorandum. The big legal document that describes the investment — risks, fees, structure, everything. | We write this with our attorney. Brickken attaches a hash (digital fingerprint) of it to the token on-chain. |
| **SPV** | Special Purpose Vehicle. A mini-company (Series LLC) created to hold one specific asset. Each stone gets its own SPV. | Brickken's tokens represent ownership in the SPV, not the stone directly. |
| **Transfer Agent** | The official recordkeeper of who owns which tokens. The blockchain + Brickken's platform can serve this role. | Per SEC Jan 2026 guidance, blockchain can be the master shareholder record. Ask Brickken if they support this. |

### Brickken-Specific Terms

| Term | What It Means | Why It Matters |
|------|--------------|----------------|
| **Issuer Studio** | Brickken's dashboard product for creating and managing tokens | This is what we'll use to configure our offerings |
| **Factory Contract** | A pre-built smart contract template that Brickken uses to create new tokens. Like a cookie cutter — same shape every time. | This is why we don't need a custom audit — the "cookie cutter" has already been audited |
| **Whitelabel** | Brickken's technology with YOUR branding. Investors see "PleoChrome" not "Brickken." | We want this eventually for the investor-facing experience |
| **Sandbox** | Brickken's testing environment where you can practice deploying tokens without real money. URL: dapp.sandbox.brickken.com | We MUST test here before going live |
| **Claim** | A verified piece of information about an investor. Example: "KYC verified" is a claim. "Accredited investor" is another claim. | In ERC-3643, investors must have the right claims to hold tokens |
| **Trusted Issuer** | An entity authorized to issue claims. Brickken (for KYC), VerifyInvestor.com (for accreditation), PleoChrome (for approvals). | Only claims from trusted issuers count. Random people can't just say "I'm accredited." |
| **Compliance Module** | The part of the smart contract that enforces rules (who can hold, transfer limits, jurisdiction blocks, lock-up periods). | This is where we configure our Reg D 506(c) rules |
| **Identity Registry** | The on-chain database mapping wallet addresses to verified identities. If you're not in the registry, you can't hold tokens. | The guest list. If you're not on it, you can't get in. |
| **Cap Table** | The record of who owns how many tokens. In traditional finance, this is a spreadsheet. On blockchain, it's the token contract's internal ledger. | Brickken's platform shows this in real-time. Every transfer updates it automatically. |
| **Escrow** | A holding account where investor money or tokens are held temporarily during a transaction. | Brickken deploys an escrow contract alongside the token contract for managing the offering flow. |

### Chainlink Terms (They May Come Up)

| Term | What It Means | Context |
|------|--------------|---------|
| **Proof of Reserve (PoR)** | An oracle service that verifies physical asset custody and publishes it on-chain. | We need Brickken's mint function to check Chainlink's PoR feed before creating tokens. |
| **Oracle** | A service that brings real-world data onto the blockchain. | Chainlink is the oracle. We need Brickken to support oracle integration. |
| **Oracle-Gated Minting** | A mint function that checks an oracle before executing. If the oracle says "no verified reserves" → no tokens created. | Our #1 technical requirement from Brickken. |
| **External Adapter** | A small program we build that connects the vault's API to Chainlink. | This is our responsibility, not Brickken's. But the token contract needs a hook for it. |

---

## Part 3: The Questions to Ask (and Why)

### Tier 1: Must-Ask Questions (Deal-Breakers)

**Q1: "Does your platform support ERC-3643 token deployment on Polygon?"**
- Why: If no, it's a deal-breaker. We specifically need ERC-3643 on Polygon.
- What to listen for: "Yes, we deploy ERC-3643 on Polygon, Ethereum, and BSC."
- Red flag: If they say "we use our own proprietary standard" — that means no interoperability and vendor lock-in.

**Q2: "Can we integrate Chainlink Proof of Reserve into the mint function?"**
- Why: This is PleoChrome's core differentiator. Without oracle-gated minting, we're just another tokenization platform.
- What to listen for: "Yes, we support custom pre-mint checks" or "Our contracts have hooks for oracle integration."
- Red flag: "We don't support external oracle integration" — this means we can't do oracle-gated minting through their platform.

**Q3: "Are your smart contracts pre-audited? By whom? Can we see the audit report?"**
- Why: Pre-audited contracts mean we only need a $3K-$5K configuration review, not a $50K-$100K full audit.
- What to listen for: Name of the audit firm, date of audit, link to the report.
- Red flag: "We haven't had a formal audit" — this is a serious concern for institutional credibility.

**Q4: "What tier do we need for a ~$10M offering? Walk us through pricing."**
- Why: We need to know the exact cost. Their published tiers are Core ($3K/yr), Advanced ($5K/yr), Professional ($9K/yr), Enterprise ($22K/yr).
- What to listen for: Which tier covers our needs. Are there per-token or per-transaction fees beyond the subscription?
- Red flag: Hidden fees, unclear pricing, or costs that scale with offering size (we want flat pricing).

**Q5: "How does your KYC integration work? Can it verify US accredited investors?"**
- Why: Reg D 506(c) requires accredited investor verification. We need this built in.
- What to listen for: "We include KYC and can integrate with accredited investor verification providers."
- Red flag: "KYC is basic identity only, no accreditation verification" — we'd need a separate service.

### Tier 2: Important Questions

**Q6: "Can we whitelabel the investor-facing experience?"**
- Why: Our investors should see PleoChrome branding, not Brickken branding.
- What to listen for: "Our Whitelabel tier lets you fully customize the investor portal."
- Note: This might be a future upgrade, not Day 1.

**Q7: "What does the investor onboarding experience look like from their perspective?"**
- Why: Our investors are high-net-worth individuals, not crypto natives. The UX must be premium.
- What to listen for: Ask for a demo or screenshots. Is it clean and professional?
- Red flag: If it looks like a crypto exchange or DeFi app — our audience won't engage.

**Q8: "What's your process from sandbox testing to mainnet deployment?"**
- Why: We MUST test everything before going live with real investor money.
- What to listen for: A clear staging → testing → review → deployment pipeline.
- Red flag: "You just deploy directly to mainnet" — no, we need a test environment.

**Q9: "How do secondary transfers work between verified token holders?"**
- Why: After the initial sale, investors may want to sell their tokens to other investors.
- What to listen for: ERC-3643 compliance module automatically verifies the recipient before allowing transfer.
- Bonus question: "Do you support integration with secondary trading venues like tZERO ATS?"

**Q10: "What happens to our tokens if Brickken goes out of business?"**
- Why: We need to understand platform risk and data portability.
- What to listen for: "Smart contracts live on the blockchain permanently — they don't depend on our servers."
- Red flag: "All data is only on our centralized servers" — this would be a single point of failure.

### Tier 3: Nice-to-Know

**Q11: "Can you provide references from US-based issuers who have done Reg D offerings?"**
- Why: Social proof. Have they actually done this in the US regulatory context?

**Q12: "What support do you provide for first-time issuers?"**
- Why: This is our first tokenization. We need hands-on guidance.

**Q13: "Do you have an API for programmatic integration?"**
- Why: Our governance engine will eventually connect to Brickken via API, not just the dashboard.

**Q14: "What's your roadmap for the next 12 months?"**
- Why: Are they building features we'll need (advanced compliance, multi-jurisdiction, analytics)?

**Q15: "What blockchain analytics or reporting tools do you provide?"**
- Why: We need to generate quarterly reports for investors and regulatory filings.

**Q16: "How do you handle dividend/distribution payments to token holders?"**
- Why: If the stone is ever sold or generates income, we need to distribute to all holders.

---

## Part 4: What They'll Ask US (And Exactly What to Say)

### "Tell us about PleoChrome."

**Say this:**
"PleoChrome is the orchestration platform for tokenizing high-value colored gemstones into compliant digital securities. We coordinate every specialist in the pipeline — GIA for certification, independent appraisers for valuation, institutional vaults like Brink's and Malca-Amit for custody, Chainlink for reserve verification, and a tokenization platform for token issuance. We don't build blockchain technology — we orchestrate the trust infrastructure that makes tokenization of physical assets possible, credible, and compliant."

### "How big is your pipeline?"

**Say this:**
"We currently have access to over $1 billion in GIA-certified colored gemstones from multiple asset holders across Tacoma, Washington, Newport Beach, California, and Sarasota, Florida. Our first offering will be approximately $10 million in certified emeralds — a controlled proof-of-concept to validate the end-to-end process. Once validated, we plan to scale rapidly through the pipeline."

### "What makes you different from other tokenization projects?"

**Say this:**
"Three things: First, the 3-Appraisal Rule — every stone gets three independent USPAP-compliant appraisals and we use the two lowest to set the offering price. Structurally conservative by design. Second, oracle-gated minting via Chainlink Proof of Reserve — tokens physically cannot be created unless the oracle confirms vault custody. Third, ERC-3643 compliance — every transfer is verified at the smart contract level. This isn't about our good intentions. It's about structural verification at every step."

### "Why colored gemstones?"

**Say this:**
"Constrained supply — mines are depleting and colored gemstones can't be lab-grown at investment quality. Consistent appreciation — 12-15% annually on average. Downside protection — investment-grade stones retain 95% of value during economic downturns. And genuine white space — of the $21 billion currently tokenized on-chain, virtually zero represents colored gemstones. We're building the category leader."

### "What regulatory framework are you using?"

**Say this:**
"Regulation D, Rule 506(c) — which permits general solicitation to verified accredited investors with no cap on the raise amount. Each offering is structured through a dedicated Special Purpose Vehicle — specifically a Wyoming Series LLC — for bankruptcy remoteness. We file Form D with the SEC and blue sky notices in applicable states. Our securities counsel is engaged for PPM drafting and ongoing compliance."

### "Why Brickken and not Securitize or Tokeny?"

**Say this (carefully — this is a negotiating moment):**
"We're evaluating multiple platforms. What draws us to Brickken is the combination of ERC-3643 compliance, pre-audited contracts that reduce our audit costs, and pricing that works for an early-stage platform. We're also interested in the whitelabel capability as we scale. What we need to understand today is whether Brickken can support our specific requirements — particularly Chainlink PoR integration and US Reg D 506(c) compliance enforcement."

**Why say this:** Mentioning Securitize and Tokeny creates competitive tension. They know you have alternatives. This gives you negotiating leverage on pricing and support level.

### "When do you want to launch?"

**Say this:**
"We want our first token deployed within 90-120 days. The legal structuring, appraisal process, and vault custody arrangements are already in motion. We need the tokenization platform configured and tested within the next 60 days so we're ready when the legal and custody gates clear."

---

## Part 5: Comparing Brickken to Alternatives

### The Three Main Options

| Feature | Brickken | Securitize | Tokeny |
|---------|----------|------------|--------|
| **HQ** | Barcelona, Spain | Miami, FL / NYC | Luxembourg |
| **Token Standard** | ERC-3643 | Proprietary (DS Protocol) + ERC-3643 | ERC-3643 (they created it) |
| **Pricing** | $3K-$22K/yr | Enterprise custom (not published) | Enterprise custom |
| **KYC Included** | Yes (150-2500/yr) | Yes | Yes |
| **Whitelabel** | Yes ($22K-$45K/yr) | Yes | Yes |
| **US Reg D Support** | Yes | Yes (strongest — they're a registered TA and BD) | Limited (EU-focused) |
| **AUM** | Smaller | $4B+ | $32B+ via partners |
| **Audit Status** | Audited | Audited | Audited (they wrote ERC-3643) |
| **Going Public?** | No | Yes ($1.25B SPAC) | No |
| **Best For** | Cost-effective first offering | Full-service institutional | EU/MiCA compliance |

### Why Brickken Might Win

1. **Price:** At $5K-$22K/yr vs Securitize's enterprise custom pricing (likely $50K+), Brickken is dramatically cheaper for a first offering.
2. **Speed:** Brickken's dashboard lets us configure and deploy without months of enterprise sales cycles.
3. **Included KYC:** 150 verifications included at the Advanced tier covers our first offering.
4. **ERC-3643:** They deploy the institutional standard, not a proprietary format.

### Why Securitize Might Win Later

1. **US Regulatory:** Securitize is an SEC-registered Transfer Agent AND has a broker-dealer affiliate. They're the most US-regulation-ready.
2. **Scale:** $4B+ AUM and going public at $1.25B. They're not going anywhere.
3. **Secondary Trading:** They have their own secondary marketplace for tokenized securities.
4. **Institutional Trust:** BlackRock uses them for BUIDL. That's the ultimate social proof.

### The Smart Strategy

**Start with Brickken** for the first 1-3 offerings (cost-effective, fast, good enough). **Evaluate Securitize** when you need secondary trading, Transfer Agent services, or institutional-scale compliance. You can always migrate tokens later — the blockchain is portable.

---

## Part 6: Red Flags to Watch For

During the Brickken call, watch for these warning signs:

1. **"We can't do that"** regarding oracle integration → Potential deal-breaker for our core differentiator
2. **"That's not our responsibility"** regarding compliance → They should at minimum SUPPORT our compliance needs
3. **Vague pricing** → "It depends" without specifics means surprise fees later
4. **No US client references** → They might not have experience with US Reg D offerings
5. **Pushing their highest tier** → If they push Enterprise ($22K) when Advanced ($5K) works, they're not listening
6. **Can't explain their audit** → If they can't name the auditor and provide the report, the "pre-audited" claim is weak
7. **No testnet/sandbox** → If they expect us to deploy to mainnet without testing, run away
8. **Centralized single point of failure** → If all token functionality depends on their servers (not the blockchain), that's platform risk

---

## Part 7: After the Call — What to Do Next

1. **Write meeting notes immediately** — Use the Meeting Notes Template from PleoChrome-Drive
2. **Score Brickken against the criteria:**
   - [ ] ERC-3643 on Polygon? ✓/✗
   - [ ] Chainlink PoR integration possible? ✓/✗
   - [ ] Pre-audited contracts with named auditor? ✓/✗
   - [ ] Pricing clear and acceptable? ✓/✗
   - [ ] KYC + accreditation support? ✓/✗
   - [ ] Whitelabel available? ✓/✗
   - [ ] US Reg D experience? ✓/✗
   - [ ] Sandbox for testing? ✓/✗
   - [ ] API available? ✓/✗
   - [ ] Investor UX acceptable for HNW audience? ✓/✗
3. **Request sandbox access** if the call goes well
4. **Request their audit report** and review it
5. **Update the Partner Tracker** in Google Drive
6. **Schedule follow-up** if needed — ideally a technical deep-dive with their engineering team

---

## Quick Reference Card (Print This for the Call)

### OUR KEY REQUIREMENTS
1. ERC-3643 on Polygon
2. Chainlink PoR integration (oracle-gated minting)
3. US Reg D 506(c) compliance enforcement
4. KYC + accredited investor verification
5. Pre-audited contracts
6. Sandbox testing environment
7. API access for governance engine integration

### OUR TALKING POINTS
- $1B+ pipeline across Tacoma, Newport Beach, Sarasota
- First offering: ~$10M emerald collection
- 3-Appraisal Rule for conservative pricing
- 90-120 day deployment timeline
- Evaluating Brickken, Securitize, and Tokeny

### THEIR PRICING (FROM WEBSITE)
- Core: EUR 3,000/yr (EUR 250K cap)
- Advanced: EUR 5,000/yr (EUR 5M cap, 150 KYCs)
- Professional: EUR 9,000/yr (unlimited, 500 KYCs)
- Enterprise: EUR 22,000/yr (unlimited, 1,000 KYCs)
- Whitelabel Standard: EUR 22,500/yr
- Whitelabel Premium: EUR 45,000/yr
