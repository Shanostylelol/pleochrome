# PleoChrome Infrastructure Research — Complete Analysis

**Date:** 2026-03-14
**Status:** Initial Research Complete

---

## Key Strategic Recommendations

1. **Engage securities counsel immediately** — every decision flows from the legal structure. Budget $50K-$150K for initial legal setup
2. **Start with Reg D 506(c)** — allows marketing, unlimited raise, simplified self-certification for $200K+ investments
3. **Delaware Series LLC** for SPVs — cost-effective, one per stone, isolated liability
4. **Get formal legal opinion on MSB status** — determines FinCEN registration + state licensing needs ($500K+ if required)
5. **ERC-3643 on Polygon** — built-in compliance, permissioned transfers, low gas
6. **Build Chainlink PoR from day one** — key differentiator
7. **SOC 2 Type II first-year goal** — no institutional partner works without it
8. **Hire/contract a CCO before launching** — regulators expect a named compliance officer from day one

---

## Regulatory Framework

### SEC Exemptions
- **Primary path: Reg D 506(c)** — general solicitation permitted, ALL investors must be accredited, unlimited raise
- **International: Reg S** — for non-U.S. persons
- **Form D filing** within 15 days of first sale + blue sky filings per state

### Licenses PleoChrome May Need
- FinCEN MSB Registration (if handling value transfer)
- State Money Transmitter Licenses (47+ states, $5K-$100K per state)
- SEC Transfer Agent Registration (or use Brickken/Securitize)
- SOC 2 Type II Certification

### Partner-Handled Registrations
- Broker-Dealer: FINRA-registered BD for distribution
- Transfer Agent: SEC-registered TA for shareholder records
- Custodian: State/federal regulated vault (Brink's/Malca-Amit)
- Brickken: Token issuance platform
- Chainlink: Decentralized oracle network

---

## Legal Structure

### SPV: Delaware Series LLC
```
PleoChrome Holdings LLC (Delaware Master)
├── Series A: [Stone 1] — e.g., 5.02ct Burmese Ruby
├── Series B: [Stone 2] — e.g., 3.15ct Colombian Emerald
└── Series C: [Stone 3] — e.g., 8.71ct Kashmir Sapphire
```

### Required Documents Per Offering
1. Private Placement Memorandum (PPM) — $15K-$50K per
2. Subscription Agreement
3. Operating Agreement (per Series)
4. Token Purchase Agreement
5. Custody Agreement

---

## Technology Stack

### Recommended
- **Blockchain:** Polygon (primary) + Ethereum (settlement)
- **Token Standard:** ERC-3643 (T-REX — built-in compliance)
- **Tokenization:** Brickken API
- **Oracle:** Chainlink Proof of Reserve
- **KYC/AML:** Sumsub or Jumio
- **Accreditation:** VerifyInvestor.com
- **Sanctions:** Chainalysis or TRM Labs
- **Document Signing:** OneSpan Sign (WORM-compliant)

### Chainlink PoR Flow
Vault API → External Adapter → Chainlink Oracle Network → On-Chain PoR Feed → Token Contract (mint-gating)

---

## 7-Gate Workflow Timeline

| Phase | Duration | Overlap? |
|-------|----------|----------|
| 1. Asset Submission & Screening | 1-2 weeks | No |
| 2. Gemological Certification | 2-3 weeks | No |
| 3. Independent Appraisal (3x) | 3-4 weeks | Partial |
| 4. Vault Intake | 1-2 weeks | After appraisal |
| 5. Legal Structuring | 3-4 weeks | Parallel with 3-4 |
| 6. Token Creation & PoR | 1-2 weeks | After vault |
| 7. Offering & Distribution | 2+ weeks | After all above |
| **Total: First Stone** | **10-14 weeks** | |
| **Subsequent Stones** | **8-10 weeks** | |

---

## Insurance Required
- Errors & Omissions (E&O)
- Directors & Officers (D&O)
- Cyber Liability
- General Liability
- Crime/Fidelity Bond
- Professional Liability
- Verify vault partner coverage adequacy

---

## Compliance Program (10 Components)
1. Written AML/KYC/Sanctions Policy
2. Designated Compliance Officer
3. Risk Assessment (annual)
4. Customer Due Diligence Program
5. Transaction Monitoring
6. Sanctions Screening (real-time)
7. SAR Filing Procedures
8. Training Program (annual)
9. Independent Testing (annual audit)
10. Record Retention (5-7 years)
