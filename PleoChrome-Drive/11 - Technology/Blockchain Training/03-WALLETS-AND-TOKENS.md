# Module 3: Wallets, Tokens, Keys, and What Investors Actually Experience

## The One-Sentence Version
A wallet is like a mailbox with a lock — anyone can see the address and send you mail, but only you have the key to open it.

---

## The Simple Version (Like You're 12)

You know how a house has an address (123 Main St) and a key to the front door?

- **Your wallet address** = your house address. Anyone can see it. Anyone can send things to it. It's public.
- **Your private key** = the key to the front door. Only you have it. If you lose it, you're locked out forever. If someone copies it, they can walk in and take everything.

That's literally it. A "wallet" is just an address + a key pair. It doesn't actually "hold" your tokens the way a wallet holds cash. Your tokens live on the blockchain (in the shared notebook). Your wallet address is the label that says "these tokens belong to this address." Your private key proves you're the owner of that address.

---

## How Keys Work (The Magic of Cryptography)

### Public Key vs Private Key

These work like a special kind of lock:

**Private Key:** A random string of characters (like a really long password). You generate it once and NEVER share it.
```
Example: 5Kb8kLf9zgWQnogidDA76MzPL6TsZZY36hWXMssSzNydYXYB9KF
```

**Public Key:** Mathematically derived from the private key. You CAN share it. But — and this is the magic — you CANNOT reverse-engineer the private key from the public key. The math only works one direction.

**Wallet Address:** A shortened, human-readable version of the public key.
```
Example: 0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18
```

**Analogy:** Think of a mailbox at the post office:
- The mailbox number (wallet address) is posted publicly — anyone can see it
- Anyone can drop a letter in (send tokens to it)
- But only the person with the mailbox key (private key) can open it and take things out

### What Happens When an Investor "Receives Tokens"

When we mint tokens for an investor, here's what actually happens on the blockchain:

1. The smart contract updates its internal ledger:
   ```
   Before: { "0x742d...": 0 tokens }
   After:  { "0x742d...": 5 tokens }
   ```
2. That's it. There's no "file" that moves. No "coin" that travels. The smart contract's ledger simply records that address 0x742d... now has 5 tokens.

3. When the investor opens their wallet app (MetaMask, Coinbase Wallet, etc.), the app reads the blockchain and says "you have 5 PCEA tokens."

**The tokens don't live IN the wallet. They live ON the blockchain. The wallet is just a window to see them and a key to move them.**

---

## What Is a Token vs a Coin?

| | Coin | Token |
|---|---|---|
| **Example** | ETH, BTC, MATIC | PleoChrome's PCEA, USDC, any ERC-20 |
| **Has its own blockchain?** | Yes — ETH runs on Ethereum, BTC on Bitcoin | No — tokens live ON someone else's blockchain |
| **Created by** | The blockchain network itself | A smart contract deployed by someone |
| **Analogy** | The currency of a country (USD) | A gift card or voucher that works in that country |

**PleoChrome creates TOKENS, not coins.** Our tokens live on the Polygon blockchain (which has its own coin called MATIC/POL used for gas fees). We don't create a blockchain — we create tokens ON an existing blockchain.

### Why NOT NFTs?

You might ask: "If each emerald is unique, shouldn't each token be unique too (NFT)?"

**No, and here's why:**

- **NFT (Non-Fungible Token):** Each token is unique and different. Token #1 ≠ Token #2. Like baseball cards — each is one-of-a-kind.
- **Fungible Token (ERC-20/ERC-3643):** Every token is identical and interchangeable. Token #1 = Token #2. Like dollar bills — a $100 bill is worth the same as any other $100 bill.

**PleoChrome uses fungible tokens because:**
1. We're creating fractional ownership. Each investor gets an equal share.
2. Token #47 represents the exact same thing as Token #48 — a 1/96th ownership stake in the same barrel of emeralds.
3. For trading on secondary markets, tokens MUST be interchangeable. If every token were unique, you'd need to evaluate each one individually — killing liquidity.
4. The stone itself is unique. But the ownership SHARES of that stone are all identical.

**Analogy:** If you and 96 friends buy a Ferrari together, each person owns 1/96th. Your 1/96th share is identical to everyone else's 1/96th share. You don't each own a different tire — you each own an equal piece of the whole car.

---

## What Does MetaMask / a Wallet App Look Like?

When an investor sets up a wallet and receives tokens, here's their experience:

### Step 1: Create a Wallet
- Download MetaMask (browser extension or mobile app)
- The app generates a private key + public key + wallet address
- The app gives them a "seed phrase" — 12-24 random words that can regenerate their key if lost
  ```
  abandon ability able about above absent absorb abstract absurd abuse access accident
  ```
- **CRITICAL:** If they lose this seed phrase AND lose access to the device, their tokens are gone forever. There is no "forgot password" button on the blockchain.

### Step 2: Add Polygon Network
- MetaMask defaults to Ethereum mainnet
- They need to add the Polygon network (Brickken's onboarding may handle this automatically)

### Step 3: Receive Tokens
- PleoChrome (via Brickken) mints tokens to their wallet address
- In MetaMask, they add the custom token contract address
- They see: "5 PCEA — PleoChrome Emerald Series A"

### Step 4: View Their Holdings
- Open MetaMask → See token balance
- Or visit polygonscan.com and enter their wallet address to see all transactions
- Everything is publicly verifiable

**For non-crypto-native investors (most of PleoChrome's audience):**
Brickken may offer a custodial wallet solution where the investor doesn't need to manage their own keys. The platform holds the keys on their behalf, similar to how a stock brokerage holds your shares. This is a key question for the Brickken call.

---

## What Is Minting? (Creating New Tokens)

Minting is the act of creating new tokens. It's like the US Treasury printing new dollar bills — except it's controlled by code, not humans.

### What Happens Technically When Tokens Are Minted

1. **An authorized address** (PleoChrome's admin wallet, via Brickken) calls the `mint` function on the smart contract
2. **The smart contract checks:**
   - Is the caller authorized? (Only approved minters can mint)
   - Is the Chainlink PoR feed confirming custody? (Oracle gate)
   - Is the recipient wallet verified? (Identity Registry check)
3. **If all checks pass:**
   - The total supply counter increases (e.g., from 0 to 5)
   - The recipient's balance increases (e.g., from 0 to 5)
   - A `Transfer` event is emitted (publicly logged on the blockchain)
   - The transaction is recorded in the next block
4. **If any check fails:**
   - The entire transaction is **reverted** — nothing changes
   - The gas fee is still paid (the network processed the request, even though it was rejected)
   - An error message explains why it failed

### Oracle-Gated Minting (PleoChrome's Key Feature)

Here's the exact sequence for our oracle-gated minting:

```
PleoChrome says: "Mint 5 tokens to Investor A"
        ↓
Smart Contract asks: "Let me check the Chainlink oracle..."
        ↓
Smart Contract reads Chainlink PoR Feed Contract
        ↓
Chainlink PoR Feed says: "As of 2 hours ago, 1 barrel of emeralds
                          verified in vault custody. Value: $9.65M.
                          Status: CONFIRMED."
        ↓
Smart Contract checks: Current total supply (91 tokens) + requested mint (5)
                       = 96 tokens total × $100K each = $9.6M
                       ≤ $9.65M verified reserve? YES.
        ↓
Smart Contract: "All checks passed. Minting 5 tokens."
        ↓
Investor A's wallet now shows: 5 PCEA tokens
```

**What if the oracle says custody is NOT confirmed?**

```
Smart Contract reads Chainlink PoR Feed: "Status: NOT CONFIRMED"
        ↓
Smart Contract: "REVERT. Cannot mint. Reserve not verified."
        ↓
No tokens are created. The transaction fails.
No human intervention possible. The code won't allow it.
```

**This is the single most important thing PleoChrome offers.** We can't accidentally (or intentionally) create tokens that aren't backed by a real, verified asset. The math prevents it.

---

## What Is Burning? (Destroying Tokens)

Burning is the opposite of minting — destroying tokens permanently.

**When does this happen?**
- When an investor (or group holding 100%) redeems the physical stone
- The tokens are "burned" (sent to a special address that nobody can access: 0x000...dead)
- The total supply decreases
- The blockchain records the burn permanently
- The vault releases the stone

**It's like shredding stock certificates when a company is dissolved.** The certificates no longer exist, and the rights they represented are extinguished.

---

## What Could Go Wrong? (Real Risks, Honestly)

### Smart Contract Bugs
- **Risk:** Code has a vulnerability that allows unauthorized minting or transfers
- **Mitigation:** Pre-audited contracts (Brickken), configuration review, testnet testing
- **Historical example:** The DAO hack (2016) — $60M stolen due to a reentrancy bug. This led to better auditing practices. ERC-3643 contracts benefit from years of lessons learned.

### Key Management
- **Risk:** Someone loses their private key or it gets stolen
- **Mitigation:** For PleoChrome admin keys — use multi-signature wallets (require 2-of-3 signatures). For investors — Brickken may offer custodial solutions.
- **Reality:** This is the #1 real-world risk. More crypto has been lost to lost keys than to hacking.

### Oracle Failure
- **Risk:** Chainlink PoR feed stops updating or reports incorrect data
- **Mitigation:** Multiple independent nodes verify data. Automatic alerts if feed goes stale. Emergency pause function.
- **Reality:** Chainlink has processed billions in oracle queries without a major failure. But we build in safeguards anyway.

### Regulatory Changes
- **Risk:** SEC changes rules about tokenized securities
- **Mitigation:** ERC-3643's compliance module can be updated with new rules. Our legal structure (Reg D 506(c)) is well-established law.
- **Reality:** Regulatory trend is TOWARD clarity and support for tokenization (SEC Jan 2026 statement, DTC pilot, SEC/CFTC MOU March 2026).

### Platform Risk (Brickken)
- **Risk:** Brickken goes out of business
- **Mitigation:** Smart contracts live on the blockchain permanently — they don't depend on Brickken's servers to exist. Our tokens would continue to function even if Brickken disappears. We'd need a new admin interface, but the tokens themselves are safe.

---

## Summary: What You Need to Know for Any Meeting

1. **Blockchain = permanent, shared record** that nobody can change
2. **Smart contract = automated rule enforcement** — no human needed for each transaction
3. **ERC-3643 = security token standard** with built-in compliance (KYC, accreditation, transfer restrictions)
4. **Brickken = the factory** that deploys pre-audited smart contracts for us
5. **Wallet = address + key** — the address is public, the key is private
6. **Minting = creating tokens** — oracle-gated so it only works when the stone is verified in custody
7. **Gas fees on Polygon = under a penny** — negligible
8. **Everything is permanent** — the ultimate audit trail
