# Module 4: Chainlink Proof of Reserve (The Trust Machine)

## The One-Sentence Version
Chainlink is an independent network of computers that checks if the stone is really in the vault and publishes the answer on the blockchain where everyone can see it.

---

## The Simple Version (Like You're 12)

Imagine you're buying a house, but you can't visit it. You just have to trust the seller that it exists.

That's scary, right? So you hire a home inspector. But what if the inspector is the seller's friend? You can't trust that either.

**Chainlink solves this by hiring MULTIPLE independent inspectors who don't know each other:**

1. Inspector 1 (a computer in New York) checks the vault's records: "Is the stone there?"
2. Inspector 2 (a computer in London) checks the same records independently
3. Inspector 3 (a computer in Singapore) also checks
4. They all report their findings publicly
5. If at least 2 out of 3 agree "yes, the stone is there" → the answer is published on the blockchain
6. Anyone in the world can read this answer at any time

**No single inspector can lie** — because the others would disagree and the lie would be obvious. No single inspector can be bribed — because you'd have to bribe a majority, and they don't know each other.

This is what makes PleoChrome's tokenization fundamentally different from someone just saying "trust me, the stone is in a vault."

---

## What Is an Oracle? (And Why Blockchains Need Them)

### The Oracle Problem

Blockchains have a superpower: everything on them is verified by thousands of computers and can't be faked. But they also have a fundamental limitation: **they can't see the real world.**

A blockchain knows:
- Who sent tokens to whom
- When it happened
- What the code says to do

A blockchain does NOT know:
- Is there a stone in a vault in Newport Beach?
- What's the current price of gold?
- Did the insurance policy renew?
- Is this person on the OFAC sanctions list?

**An oracle is a bridge between the real world and the blockchain.** It takes information from outside (the "off-chain" world) and delivers it on-chain where smart contracts can use it.

**Chainlink is the world's largest oracle network.** It currently secures over $75 billion in value across hundreds of protocols. When we say "Chainlink Proof of Reserve," we're using the most trusted oracle network in existence.

### Why Not Just Have the Vault Post Updates Directly?

Good question. Why not have Brink's publish "yes, the stone is here" directly to the blockchain?

Because then you're trusting ONE source. If Brink's database has a bug, or their employee lies, or their system gets hacked — the blockchain would record false information.

**Chainlink's value is decentralization of trust:**
- Multiple independent nodes check the data
- They reach consensus (agreement) before publishing
- No single node can influence the result
- The network has economic incentives (nodes stake collateral and lose it if they're dishonest)

---

## How Chainlink Proof of Reserve Actually Works (Step by Step)

Here's the exact technical flow for PleoChrome:

### The Setup (One-Time)

```
Step 1: PleoChrome builds an "External Adapter"
        ↓
This is a small program that can:
- Connect to the vault's inventory system (API)
- Fetch specific data: "Is stone STONE-001 in custody?"
- Format the answer in a way Chainlink nodes understand
        ↓
Step 2: PleoChrome registers this adapter with Chainlink
        ↓
Step 3: Multiple Chainlink nodes are configured to use this adapter
        ↓
Step 4: A "PoR Feed Contract" is deployed on Polygon
        This smart contract stores the latest custody status
        Anyone can read it at any time
        ↓
Step 5: PleoChrome's token contract is programmed to CHECK
        this PoR Feed Contract before minting
```

### The Ongoing Verification (Automatic, Recurring)

```
Every [day/week/hour — configurable]:

1. Chainlink scheduler triggers an update
        ↓
2. Multiple Chainlink nodes (say 5 of them) independently:
   - Call the External Adapter
   - External Adapter connects to Brink's/Malca-Amit API
   - Fetches: "Is stone STONE-001 in segregated custody?"
   - Returns: { stoneId: "STONE-001", inCustody: true, value: 9650000, lastVerified: "2026-03-17T10:00:00Z" }
        ↓
3. Each node reports its answer to the Chainlink aggregator
   - Node 1: "inCustody: true, value: $9.65M" ✓
   - Node 2: "inCustody: true, value: $9.65M" ✓
   - Node 3: "inCustody: true, value: $9.65M" ✓
   - Node 4: "inCustody: true, value: $9.65M" ✓
   - Node 5: (timeout — didn't respond)
        ↓
4. Aggregator: 4 out of 5 agree. Consensus reached.
        ↓
5. The aggregated answer is written to the PoR Feed Contract on Polygon:
   {
     reserves: 9650000,
     timestamp: 1742209200,
     status: "confirmed"
   }
        ↓
6. This update is now publicly visible on the blockchain
   Anyone can read it at polygonscan.com
```

### What Happens When the Token Contract Checks the Oracle

```
PleoChrome: "Mint 5 tokens to Investor A's wallet"
        ↓
Token Contract's mint function executes:

1. require(proofOfReserve.latestAnswer() > 0)
   Translation: "Is the oracle reporting positive reserves?"
   Oracle says: reserves = $9,650,000
   ✓ PASS
        ↓
2. require(totalSupply() + 5 <= maxSupply)
   Translation: "Would this mint exceed the maximum allowed?"
   Current supply: 91 tokens. After mint: 96. Max: 96.
   ✓ PASS
        ↓
3. require(identityRegistry.isVerified(investorA))
   Translation: "Is this investor verified?"
   Identity Registry says: Yes, KYC + accredited investor claims present.
   ✓ PASS
        ↓
All checks pass → 5 tokens minted to Investor A.
Recorded permanently on the blockchain.
```

### What Happens If the Stone Is REMOVED From the Vault

```
Scenario: Stone is removed for reappraisal or (worst case) stolen

1. Vault's inventory system updates: "STONE-001 no longer in custody"
        ↓
2. Next Chainlink update cycle:
   - Nodes query the External Adapter
   - Adapter returns: { inCustody: false, value: 0 }
        ↓
3. Nodes reach consensus: "Reserves: $0"
        ↓
4. PoR Feed Contract on Polygon updates: reserves = 0
        ↓
5. Someone tries to mint new tokens:
   Token Contract checks: proofOfReserve.latestAnswer() > 0?
   Oracle says: reserves = 0
   ✗ FAIL — "Reserve not verified"
   Transaction REVERTED. No tokens created.
        ↓
6. PleoChrome receives Level 4 CRITICAL alert:
   "PoR feed reports zero reserves for STONE-001"
   Email + SMS + Phone to all team members
        ↓
7. All minting is automatically blocked until custody is restored
```

**This is the nuclear option that protects investors.** If the stone leaves the vault for ANY reason — legitimate or not — the oracle catches it and the system locks down. No human intervention required. No possibility of "oops we forgot to check."

---

## What Is an External Adapter?

The External Adapter is the piece we (PleoChrome) build. It's the translator between the vault's computer system and Chainlink.

**Think of it like a translator at the UN:**
- The vault speaks "vault language" (their proprietary API format)
- The blockchain speaks "blockchain language" (Solidity data types)
- The External Adapter translates between them

**It's a simple program that:**
1. Receives a request from a Chainlink node: "What's the custody status?"
2. Calls the vault's API with the right credentials
3. Gets back the vault's response (in whatever format they use)
4. Translates it into a standardized format Chainlink understands
5. Returns the answer to the Chainlink node

**This is the ONLY custom code PleoChrome writes** for the Chainlink integration. Everything else (the oracle network, the consensus mechanism, the on-chain feed) is Chainlink's existing infrastructure.

**Estimated cost:** $2,500-$5,000 for a developer to build and test the adapter. Or potentially $0 if the Chainlink BUILD program provides support.

---

## Chainlink BUILD Program (How We Get This Cheap/Free)

Chainlink runs a program called BUILD specifically for early-stage projects:

**What we get:**
- Access to Chainlink products (including PoR) at no cash cost
- Dedicated technical support
- Co-marketing and ecosystem introductions
- Discounts on audits and partner services

**What they get:**
- If we issue a token, they want 3-7% of the token supply committed to the Chainlink ecosystem
- Since PleoChrome's tokens represent gemstone ownership (not a utility token), this model may need to be adapted through direct negotiation

**The alternative:** Pay for the oracle network directly. For a monthly vault attestation (not real-time), the LINK token fees are approximately $100-$200/month. Very affordable.

---

## What to Say in Meetings About Chainlink

**To Chainlink:** "We're building an orchestration platform for tokenizing high-value colored gemstones. We need Proof of Reserve to verify vault custody before any tokens can be minted. Our first offering is a $10M emerald collection. Our pipeline is $1B+. We're interested in the BUILD program or direct enterprise engagement."

**To investors:** "Every token we issue is backed by a physically verified asset. Chainlink's Proof of Reserve — the same technology used by Paxos Gold (PAXG) to verify gold reserves — independently confirms vault custody. The smart contract checks this verification before creating any tokens. This isn't trust-based — it's mathematically enforced."

**To regulators:** "We use Chainlink's decentralized oracle network to independently verify physical asset custody. Multiple independent nodes query the vault's inventory system and reach consensus before publishing the custody status on the public blockchain. This provides a continuous, auditable, tamper-proof verification trail."

**When someone asks 'what if Chainlink goes down?':** "Chainlink has been operating since 2017 and currently secures over $75 billion in value. If the oracle feed stops updating temporarily, our smart contract is designed to halt minting automatically — it defaults to safety. No feed update = no new tokens. We also monitor the feed with automated alerts."

---

## Quick Reference: The Chainlink Terminology

| Term | What It Means | Analogy |
|------|--------------|---------|
| **Oracle** | Bridge between real world and blockchain | A translator at the UN |
| **Node** | One computer in Chainlink's network | One inspector in a team |
| **External Adapter** | Custom code connecting to the vault's API | A phone adapter for international plugs |
| **PoR Feed** | The on-chain data feed showing custody status | A live scoreboard that anyone can read |
| **Consensus** | Multiple nodes agreeing on the answer | A jury reaching a verdict |
| **Staking** | Nodes lock up LINK tokens as collateral | A security deposit — lose it if you lie |
| **LINK** | Chainlink's native token, used to pay nodes | The currency of Chainlink's economy |
| **Data Feed** | Any stream of data published on-chain | A live news ticker |
| **Circuit Breaker** | Automated emergency halt if data is abnormal | A fuse that blows to protect the circuit |
| **BUILD Program** | Chainlink's program for early-stage projects | An incubator/accelerator program |
