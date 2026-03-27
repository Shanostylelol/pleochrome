# Module 2: Smart Contracts (The Robot That Enforces the Rules)

## The One-Sentence Version
A smart contract is a program that lives on the blockchain and automatically enforces rules — like a vending machine that nobody can tamper with.

---

## The Simple Version (Like You're 12)

You know how a vending machine works:
1. You put in $1.50
2. You press B4 (Doritos)
3. The machine checks: "Did they put in enough money? Is B4 in stock?"
4. If yes → Doritos drop. If no → money comes back.

Nobody is inside the machine deciding whether to give you the Doritos. It's automatic. The rules are programmed in. You can't sweet-talk the machine into giving you free chips.

**A smart contract is a vending machine for financial rules.** Instead of "put in money, get chips," it's:
- "If this investor is verified AND the stone is in the vault AND they've sent money → create their tokens"
- "If someone who isn't verified tries to receive tokens → block the transfer"
- "If the Chainlink oracle says the stone is NOT in the vault → no new tokens can be created"

These rules run automatically. No human at PleoChrome pushes a button to approve each transfer. The code handles it. And just like you can't reach into a vending machine and grab chips without paying, nobody can reach into the smart contract and bypass the rules.

---

## How Smart Contracts Actually Work

### What Language Are They Written In?

Smart contracts on Ethereum and Polygon are written in a programming language called **Solidity**. It looks like this:

```solidity
// This is a simplified example — real contracts are more complex
function mint(address investor, uint256 amount) public {
    // CHECK 1: Is the caller authorized to mint?
    require(hasRole(MINTER_ROLE, msg.sender), "Not authorized");

    // CHECK 2: Does the Chainlink oracle confirm custody?
    require(proofOfReserve.isVerified(), "Reserve not verified");

    // CHECK 3: Is the investor on the whitelist?
    require(identityRegistry.isVerified(investor), "Investor not verified");

    // If ALL checks pass, create the tokens
    _mint(investor, amount);
}
```

**You don't need to read code.** But understand the concept: every action has conditions that must be met. The `require` statements are like bouncers at a club — if you don't meet the requirement, you're not getting in.

### What Happens When You "Deploy" a Contract?

Deploying is like publishing a book that can never be edited:

1. **Developer writes the code** (Solidity, tested on a practice network first)
2. **Developer compiles it** — turns human-readable code into machine instructions (called "bytecode")
3. **Developer sends a special transaction** to the blockchain saying "here's a new contract, please store it"
4. **The network processes it** — validators verify the code is valid, deduct gas fees, and assign the contract its own permanent address
5. **The contract now exists at that address forever** — anyone can interact with it by sending transactions to that address

**It costs gas to deploy** because the network has to store the code permanently across thousands of computers. On Polygon, this costs $0.50-$2.00. On Ethereum, it could cost $50-$500+.

### Can You Change a Smart Contract After Deployment?

**Short answer: No.** Once deployed, the code is immutable — it cannot be modified. This is a feature, not a bug. It means nobody can secretly change the rules after the fact.

**But there are workarounds:**
- **Proxy patterns:** The contract points to another contract that CAN be updated. The "pointer" is permanent, but what it points to can change. This is how Brickken's contracts work — they can upgrade the logic while keeping the same address.
- **Parameters:** Some values (like the Chainlink oracle address, or the compliance rules) can be changed by authorized administrators. The core logic can't, but the settings can.
- **Emergency functions:** Well-designed contracts include a "pause" button that an admin can trigger to freeze all activity. This is like a fire alarm — it doesn't change the rules, it just stops everything until the emergency is resolved.

### What Does "Pre-Audited" Mean?

When Brickken says their contracts are "pre-audited," it means:
1. A professional security firm (like CertiK, Hacken, or OpenZeppelin) reviewed every line of code
2. They looked for: bugs, vulnerabilities, backdoors, logic errors, and attack vectors
3. They wrote a report documenting what they found
4. The developers fixed every issue
5. The auditors confirmed the fixes

**Why this matters for PleoChrome:** We don't write our own smart contracts. We use Brickken's pre-audited contracts. This means we don't need a $50K-$100K custom audit. We just need a $3K-$5K configuration review to verify our specific settings are correct.

**In meetings, say this:** "We leverage Brickken's pre-audited ERC-3643 factory contracts. The underlying code has been security-audited. Our deployment requires a configuration review to verify parameters match our legal documents — not a full code audit."

---

## The ERC-3643 Standard (The Rules for Security Tokens)

### Why Regular Tokens Don't Work for Securities

A regular token (ERC-20, like most cryptocurrencies) is like cash — anyone can send it to anyone, anytime, for any reason. There are no rules about who can hold it.

**That doesn't work for securities** because securities law says:
- Only certain people can buy them (accredited investors in our case)
- Transfers must be compliant with regulations (can't sell to someone in a sanctioned country)
- There might be lock-up periods (can't sell for 6-12 months after purchase)
- There might be limits on how many people can hold them

**ERC-3643 is a token standard specifically designed for regulated securities.** It bakes ALL of these rules directly into the token. They're not suggestions — they're enforced by code.

### The 5 Components of ERC-3643

Think of it like a building with 5 security systems that all work together:

**1. The Token Contract** (The building itself)
- This is the actual token — it tracks who owns how many
- It's an ERC-20 at its core (compatible with standard wallets and tools)
- But before ANY transfer happens, it checks with the other 4 systems

**2. The Identity Registry** (The guest list)
- A database mapping wallet addresses to verified identities
- Every holder must be registered here with their verified identity
- If your wallet isn't in the registry → you cannot receive tokens. Period.
- **Think of it like:** The bouncer at an exclusive club with a guest list. If your name isn't on the list, you're not getting in.

**3. The Compliance Module** (The rules engine)
- Contains the actual rules: who can hold, how many holders max, which countries allowed, lock-up periods
- Every transfer is checked against these rules BEFORE it executes
- If ANY rule fails → the transfer is blocked
- **Think of it like:** The metal detector at the airport. Even if you're on the flight list (Identity Registry), you still have to pass through security (Compliance Module).

**4. The Trusted Issuers Registry** (Who can vouch for people)
- Lists which entities are authorized to verify investors
- For PleoChrome: Brickken (for KYC), VerifyInvestor.com (for accreditation), PleoChrome itself (for approvals)
- Only claims from trusted issuers are accepted
- **Think of it like:** Not just anyone can say "this person is verified." Only the designated gatekeepers can.

**5. The Claim Topics Registry** (What verification is required)
- Defines WHAT claims an investor must have to hold tokens
- For PleoChrome: "KYC verified" (Topic 1) + "Accredited investor" (Topic 2)
- An investor must have ALL required claims from a trusted issuer
- **Think of it like:** The list of documents you need to apply for a passport. You need the birth certificate AND the photo AND the application. Missing any one = rejected.

### What Happens When Someone Tries to Transfer a Token (Step by Step)

Let's say Investor A wants to transfer 5 tokens to Investor B:

```
1. Investor A initiates transfer: "Send 5 tokens to Investor B's wallet"

2. Token Contract asks Identity Registry: "Is Investor B's wallet registered?"
   → If NO: Transfer BLOCKED. Error: "Recipient not verified."
   → If YES: Continue...

3. Token Contract asks Identity Registry: "Does Investor B have all required claims?"
   → Check: KYC verified? (Claim from trusted issuer)
   → Check: Accredited investor? (Claim from trusted issuer)
   → If ANY missing: Transfer BLOCKED. Error: "Missing required claims."
   → If ALL present: Continue...

4. Token Contract asks Compliance Module: "Does this transfer comply with all rules?"
   → Check: Would this exceed the maximum holder limit?
   → Check: Is Investor B's country allowed?
   → Check: Is the lock-up period still active?
   → Check: Would this violate any custom rules?
   → If ANY rule fails: Transfer BLOCKED. Error: "Compliance check failed."
   → If ALL rules pass: Continue...

5. Transfer executes:
   → Investor A's balance: decreased by 5
   → Investor B's balance: increased by 5
   → Transaction recorded permanently on the blockchain
```

**This entire process takes about 2 seconds on Polygon and costs less than $0.01.**

The key insight: **No human approves this.** The code runs the checks automatically. If Investor B isn't verified, the code physically cannot transfer the tokens. It's not a matter of someone forgetting to check — the math won't allow it.

---

## What Brickken Actually Does (The Factory)

### What's a "Factory Contract"?

Imagine a car factory. Instead of building each car from scratch, the factory has a template — a design that's been tested, crash-certified, and approved. Every car that rolls off the line follows the same design.

Brickken's "factory contract" works the same way:
1. Brickken created the ERC-3643 template (token contract + identity registry + compliance + all components)
2. That template was security-audited
3. When PleoChrome says "create a token for our emerald offering," Brickken's factory contract deploys a NEW instance of the template with our specific settings
4. Our token has all the same security properties as the template — because it IS the template, just with our parameters

**Why this is better than writing custom contracts:**
- Cheaper (we're configuring, not coding)
- Safer (the template has been audited; custom code hasn't)
- Faster (deployment in hours, not months)
- Maintainable (Brickken can upgrade the template for everyone)

### What Happens When PleoChrome Creates a Token on Brickken

1. **We log into Brickken's dashboard** (or use their API)
2. **We configure the token:**
   - Name: "PleoChrome Emerald Series A"
   - Symbol: "PCEA"
   - Total supply: 96 tokens
   - Blockchain: Polygon
   - Compliance rules: KYC required, accredited investor required, US jurisdiction
3. **We attach legal documents** (PPM, Operating Agreement) — these get hashed and stored on-chain
4. **We click "Deploy"** (or call the API)
5. **Brickken's factory contract:**
   - Deploys a new Token Contract
   - Deploys a new Identity Registry
   - Deploys a new Compliance Module
   - Connects them all together
   - Assigns PleoChrome as the administrator
6. **We get back contract addresses** — permanent locations on Polygon where these contracts live
7. **We connect our Chainlink PoR feed** to the mint function
8. **Done.** The token exists. Now we can start whitelisting investors and minting tokens.

---

## Key Things to Say in Meetings

**When talking to Brickken:** "We need your ERC-3643 factory deployment with Chainlink PoR integration on the mint function. Our compliance module needs KYC + accredited investor claim validation. We'll be doing US Reg D 506(c) offerings."

**When talking to investors:** "Every transfer is verified at the smart contract level before it executes. Only verified, accredited investors can hold these tokens. This isn't enforced by our good intentions — it's enforced by immutable code on the blockchain."

**When talking to regulators:** "The compliance rules are embedded in the token itself. Non-compliant transfers are programmatically blocked. Every action creates a permanent, timestamped audit trail on the public blockchain."

**When someone asks 'but what if someone hacks it?':** "The smart contracts are pre-audited by professional security firms. The blockchain itself is secured by thousands of independent validators. To tamper with our records, you'd need to compromise a majority of Polygon's entire network — which has never happened and would cost billions to attempt."
