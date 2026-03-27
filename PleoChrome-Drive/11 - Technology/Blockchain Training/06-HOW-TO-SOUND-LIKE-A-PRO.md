# Module 6: How to Sound Like a Pro in Every Meeting

## The Cheat Sheet You Actually Need

This is the module you read 10 minutes before every call. It has the exact phrases to use with each audience so you sound like you've been doing this for a decade.

---

## WITH BRICKKEN (Tokenization Platform)

### Words that make you sound smart:
- "ERC-3643 factory deployment" (not "make us a token")
- "Compliance module configuration" (not "set up the rules")
- "Identity Registry whitelisting" (not "approve investors")
- "Oracle-gated mint function" (not "check the vault before making tokens")
- "Reg D 506(c) compliance enforcement" (not "only sell to rich people")

### Key phrases:
- "We need the mint function to include a Chainlink PoR check as a prerequisite — if the oracle returns zero reserves, the mint should revert."
- "Our compliance module needs to validate two claim topics: KYC verification and accredited investor status, both from trusted issuers in the registry."
- "We'll be configuring transfer restrictions for lock-up periods and jurisdiction blocking. Can your compliance module handle country-level whitelisting?"
- "What's your deployment flow from sandbox to mainnet? We want a full end-to-end test before going live."
- "We're evaluating Brickken alongside Securitize and Tokeny for our tokenization layer."

### What NOT to say:
- "We're new to this" → Instead say "We've spent months architecting the pipeline and we're ready to execute"
- "How does blockchain work?" → Instead ask specific questions about THEIR implementation
- "Is this safe?" → Instead ask "What's your audit history and who performed the security review?"

---

## WITH CHAINLINK (Oracle Network)

### Words that make you sound smart:
- "External Adapter for vault custody attestation" (not "connect to the vault")
- "Decentralized Oracle Network" or "DON" (not "the computers that check")
- "Proof of Reserve data feed" (not "the custody checker")
- "Secure Mint integration" (not "checking before making tokens")
- "Heartbeat interval" (how often the feed updates — "What heartbeat do you recommend for our PoR feed?")

### Key phrases:
- "We're building an External Adapter to connect institutional vault APIs — Brink's and Malca-Amit — to a Chainlink PoR feed on Polygon."
- "We need the feed to support both custody confirmation and appraised value reporting."
- "Our smart contract's mint function will call the PoR feed and revert if reserves are insufficient to cover the requested mint."
- "We're interested in the BUILD program for early-stage access. Our pipeline is $1B+ in GIA-certified colored gemstones."
- "Can you share any reference implementations for physical asset PoR? We've studied the Serenity Labs precious metals framework."

### What NOT to say:
- "What's an oracle?" → You already know this. Ask about THEIR specific implementation.
- "Is Chainlink expensive?" → Instead ask "What's the LINK cost structure for a monthly PoR attestation feed?"

---

## WITH INVESTORS

### Words that make you sound smart:
- "Oracle-verified reserve backing" (not "we check that the stone is there")
- "Structurally conservative valuation methodology" (not "we price it low")
- "Bankruptcy-remote SPV structure" (not "each stone has its own company")
- "On-chain compliance enforcement" (not "the computer checks who can buy")
- "Institutional-grade custody with cryptographic attestation" (not "it's in a safe vault")

### Key phrases:
- "Every token is backed by a physical gemstone in institutional vault custody, independently verified by Chainlink's decentralized oracle network."
- "Our 3-Appraisal Rule — three independent USPAP-compliant valuations, two lowest averaged — ensures you're buying at a structurally conservative price."
- "The smart contract programmatically blocks token creation unless the oracle confirms custody. This isn't policy — it's math."
- "Colored gemstones have appreciated 12-15% annually and retained 95% of value during market downturns. This is an uncorrelated alternative asset class."
- "Your ownership is recorded on the public blockchain — you can verify it independently at any time on Polygonscan."

### The 30-Second Elevator Pitch:
"PleoChrome transforms high-value colored gemstones into compliant digital securities. Each token is backed by a certified, independently appraised gemstone in institutional vault custody, verified 24/7 by Chainlink's oracle network. We handle the entire process — certification, appraisal, custody, legal structuring, and tokenization — so investors get institutional-grade access to an asset class that appreciates 12-15% annually at a $100K minimum entry point."

---

## WITH REGULATORS / LEGAL COUNSEL

### Words that make you sound smart:
- "Regulation D, Rule 506(c) exemption" (not "the rule that lets us sell to rich people")
- "Accredited investor verification via reasonable steps" (not "we check if they're rich")
- "Form D filing with subsequent blue sky notices" (not "the government paperwork")
- "Private placement memorandum with complete risk disclosure" (not "the big legal document")
- "Immutable on-chain audit trail" (not "the blockchain keeps records")

### Key phrases:
- "We're conducting our offerings under Reg D 506(c), which permits general solicitation to verified accredited investors."
- "Per the March 2025 SEC guidance, we utilize self-certification for investments exceeding $200,000."
- "Our ERC-3643 security tokens enforce compliance at the smart contract level — non-verified wallets physically cannot receive tokens."
- "The SEC's January 2026 statement on tokenized securities confirms that our approach aligns with existing securities framework."
- "Every state transition in our 7-gate pipeline creates a permanent, timestamped audit log. This evidence trail exceeds the requirements of SEC Rule 17a-4."

---

## WITH VAULT PARTNERS (Brink's / Malca-Amit)

### Key phrases:
- "We require segregated custody with API-accessible inventory reporting."
- "We're integrating Chainlink Proof of Reserve, which requires programmatic access to your custody status — either via API or periodic attestation reports."
- "What's your standard for issuing Custody Acknowledgment receipts?"
- "We need to verify that your insurance coverage meets or exceeds the appraised value of each asset. What's your per-item sublimit for colored gemstones?"
- "Our regulatory framework requires continuous custody verification. What reporting frequency can your systems support?"

---

## WITH APPRAISERS

### Key phrases:
- "We require USPAP-compliant written appraisal reports with full methodology documentation."
- "Our 3-Appraisal Rule means we use three independent appraisers. You cannot have any affiliation with the other two appraisers, the asset holder, or PleoChrome."
- "We average the two lowest appraisals to set the offering price. This structurally conservative approach protects our investors."
- "What comparable sales data do you reference for Colombian emeralds in this value range?"
- "What's your professional liability (E&O) insurance coverage? We need to verify coverage before engagement."

---

## UNIVERSAL PHRASES THAT WORK EVERYWHERE

**When you don't know the answer to a question:**
- "That's a great question. Let me check with our technical team and get you a precise answer." (Never guess.)

**When someone challenges the concept:**
- "We're building on the same infrastructure that BlackRock uses for BUIDL, that Paxos uses for PAXG gold tokens, and that the DTCC is piloting for tokenized securities. This isn't experimental — it's institutional adoption."

**When someone asks about the market:**
- "The tokenized real-world asset market has grown 308% in three years to over $21 billion. BCG projects $16 trillion by 2030. Colored gemstones are currently zero percent of that market — which is exactly why we're building PleoChrome."

**When someone asks 'why gemstones?':**
- "Three reasons: constrained supply (mines are depleting, unlike lab-grown diamonds), consistent appreciation (12-15% annually), and downside protection (95% value retention in recessions). Plus, there's no credible tokenization platform in this space — it's genuine white space."

**When someone asks 'why should I trust you?':**
- "You shouldn't have to trust us. That's the entire point. Every claim we make is independently verified: GIA certifies the stone, three independent appraisers value it, Brink's or Malca-Amit custody it, Chainlink verifies custody on the public blockchain, and the smart contract enforces compliance rules automatically. Trust is replaced by verification at every step."

---

## THE #1 RULE

**When in doubt, default to:** "Our process is designed so that nobody has to trust anyone's word. Every claim is independently verified by a specialist, and the evidence is permanently recorded on the blockchain."

This single concept — trust replaced by verification — is what makes PleoChrome different from every other gemstone deal in history. Say it early. Say it often. Say it with confidence.
