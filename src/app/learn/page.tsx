"use client";

import { useState } from "react";
import Image from "next/image";

const PASSCODE = "pleo123";

/* ═══════════════════════════════════════════════════════
   PleoChrome — Masterclass: How Gemstone Value Creation Works
   /learn
   ═══════════════════════════════════════════════════════ */

// ── Icons (SVG) ───────────────────────────────

function Icon({ name, size = 20, className = "" }: { name: string; size?: number; className?: string }) {
  const s = { width: size, height: size };
  const paths: Record<string, React.ReactNode> = {
    gem: <><path d="M6 3h12l4 6-10 13L2 9z"/><path d="M2 9h20M12 22L6 9M12 22l6-13M6 3l6 6M18 3l-6 6"/></>,
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></>,
    search: <><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></>,
    lock: <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></>,
    building: <><path d="M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1"/><path d="M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16"/></>,
    link: <><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></>,
    users: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></>,
    dollar: <><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></>,
    file: <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></>,
    scale: <><path d="M12 3v18M4 7l8-4 8 4M4 7v4l8 4M20 7v4l-8 4"/></>,
    vault: <><rect x="2" y="4" width="20" height="16" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M12 9v6M9 12h6"/></>,
    chain: <><path d="M13 2L3 14h9l-1 8 10-12h-9z"/></>,
    globe: <><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></>,
    check: <><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></>,
    layers: <><path d="M12 2L2 7l10 5 10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></>,
    send: <><path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/></>,
    key: <><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></>,
    refresh: <><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></>,
    book: <><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></>,
    arrow: <><path d="M5 12h14M12 5l7 7-7 7"/></>,
    clipboard: <><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></>,
    eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
    award: <><circle cx="12" cy="8" r="7"/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12"/></>,
  };
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={s} className={className}>
      {paths[name] || paths.gem}
    </svg>
  );
}

// ── Data ──────────────────────────────────────

interface Section {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  intro: string;
  content: { heading: string; body: string; visual?: string }[];
}

const sections: Section[] = [
  {
    id: "what", title: "What Is Gemstone Value Creation?", subtitle: "The Big Picture", icon: "gem", color: "#1A8B7A",
    intro: "Before we get into the details, let\u2019s understand the fundamental concept. PleoChrome unlocks value from gemstones through three paths: Fractional Securities, Tokenization, and Debt Instruments. Each path lets multiple people participate in something that used to be all-or-nothing.",
    content: [
      { heading: "The Problem", body: "Imagine you own a rare ruby worth $55 million. You want to sell it, but finding ONE person with $55 million in cash who wants exactly your ruby is nearly impossible. The market for ultra-high-value gemstones is tiny \u2014 maybe a few dozen potential buyers in the entire world. Your stone is valuable, but it\u2019s stuck. Illiquid. You can\u2019t sell half of it. You can\u2019t take a loan against it easily. Your wealth is locked in a rock." },
      { heading: "The Solution: Three Paths to Value", body: "PleoChrome offers three ways to unlock that value: (1) Fractional Securities \u2014 split the stone into fractional LLC units under Reg D 506(c), allowing multiple accredited investors to own a share without blockchain complexity. (2) Tokenization \u2014 convert those units into digital security tokens (ERC-3643 or ERC-7518) on Polygon, adding programmable compliance and 24/7 transferability. (3) Debt Instruments \u2014 use the stone as collateral for asset-backed lending under UCC Article 9, letting the owner borrow against value without selling. In the tokenization path, a $55M ruby becomes 550 tokens at $100,000 each. The physical ruby stays safely locked in a vault. The tokens trade digitally. All three paths share the same rigorous verification pipeline." },
      { heading: "What Makes It Real (Not Just Crypto Hype)", body: "Here\u2019s what separates PleoChrome from crypto speculation: every token is backed by an actual gemstone sitting in an actual vault, verified by actual independent experts, insured by actual insurance companies, and structured under actual US securities law. The stone doesn\u2019t disappear. It doesn\u2019t exist only on a computer. It\u2019s a physical object in a Brink\u2019s vault with 24/7 security, and an independent oracle network (Chainlink) that publicly verifies its custody status every single day." },
      { heading: "Who Is This For?", body: "Three groups: (1) Stone owners who want to unlock the value of their assets without selling outright \u2014 through fractional ownership, tokenization, or borrowing against their stones. (2) Accredited investors (people with $200K+ income or $1M+ net worth) who want exposure to an asset class that historically appreciates 12-15% annually, retains 95% of value in downturns, and is completely uncorrelated with stocks and bonds. (3) Lenders who want to participate in asset-backed lending secured by independently verified, institutionally vaulted gemstones." },
    ]
  },
  {
    id: "pleochrome", title: "What Does PleoChrome Actually Do?", subtitle: "Our Role in Plain English", icon: "layers", color: "#1B6B4A",
    intro: "PleoChrome is not a bank, not an exchange, not a vault, and not a crypto company. We\u2019re the orchestra conductor \u2014 a gemstone value orchestration platform. We coordinate all the specialists who each handle one piece of the process across all three value creation paths.",
    content: [
      { heading: "The Orchestration Model", body: "Think of building a house. You don\u2019t need the general contractor to be the electrician, the plumber, AND the roofer. You need them to hire the right specialists, manage the schedule, inspect the work, and make sure everything comes together correctly. PleoChrome is the general contractor of gemstone value creation. We coordinate: lab certification (GIA), independent appraisal, vault custody (Brink\u2019s/Malca-Amit), blockchain verification (Chainlink), tokenization platforms (evaluating both Brickken and Zoniqx), legal structuring (securities attorneys), and investor distribution (broker-dealers). We are platform-agnostic \u2014 we select the best partner for each role." },
      { heading: "Why Not Just Do Everything Ourselves?", body: "Because specialization creates credibility. If PleoChrome certified its OWN stones, appraised its OWN stones, stored them in its OWN vault, and sold them through its OWN sales team \u2014 would you trust that? Of course not. By using independent, best-in-class specialists at every step (GIA for certification, independent appraisers for valuation, Brink\u2019s for custody, Chainlink for verification), every claim is independently verified. No one has to trust PleoChrome\u2019s word alone. Every fact is proven by someone else." },
      { heading: "How PleoChrome Makes Money", body: "Three ways: (1) A setup fee (typically 2% of the stone\u2019s value) paid upfront when the stone owner engages us. This covers the cost of coordinating the entire pipeline. (2) A success fee (typically 1.5% of the offering) paid only when tokens actually sell. If the offering fails, this fee is zero. (3) An annual administration fee (typically 0.75% of the offering value) for ongoing management: vault verification, investor reporting, compliance monitoring, and record-keeping. The third one is the most important to investors because it\u2019s recurring revenue \u2014 like a subscription that compounds as more stones are added to the platform." },
      { heading: "What We Don\u2019t Touch", body: "PleoChrome never holds investor money (it goes directly to the SPV escrow via the broker-dealer). PleoChrome never physically possesses the stone (it goes directly from the owner to the vault). PleoChrome never gives investment advice (the PPM and broker-dealer handle that). This is intentional \u2014 by not touching money, stones, or giving advice, PleoChrome avoids the heaviest regulatory requirements and stays focused on what it does best: orchestrating the process." },
    ]
  },
  {
    id: "process", title: "The 9-Step Process", subtitle: "From Stone to Tokens", icon: "clipboard", color: "#1E3A6E",
    intro: "Every stone follows the same path. No shortcuts, no exceptions. Each step produces documented evidence that feeds into the next. Think of it as an assembly line for trust.",
    content: [
      { heading: "Step 1: A Stone Owner Comes to PleoChrome", body: "Someone with a valuable colored gemstone (ruby, emerald, sapphire, alexandrite) worth $100K or more contacts PleoChrome. They fill out an intake questionnaire: who they are, what the stone is, where they got it, and what documentation they already have (GIA reports, prior appraisals, purchase receipts). This is like bringing your car to a dealership and saying \u2018I want to sell this.\u2019 The first thing they do is check what you\u2019ve got.\n\nAnalogy: Like listing your house with a real estate agent. They need to see the deed, know the history, and assess the property before they\u2019ll agree to list it." },
      { heading: "Step 2: We Verify the Owner and the Stone\u2019s History", body: "Before we do anything, we need to know: Is this person really the owner? Are they legally allowed to sell? Is the stone\u2019s history clean? We run KYC (Know Your Customer) \u2014 checking their government ID, verifying their identity with facial recognition technology, and screening them against every major sanctions list in the world (OFAC, EU, UN). We also research the stone\u2019s provenance \u2014 its complete chain of ownership from the mine to today. If the stone was mined in a conflict zone, stolen, or has competing ownership claims, we stop here.\n\nAnalogy: Like a title search when you buy a house. Before any money changes hands, a lawyer checks that the seller actually owns it and there are no liens, lawsuits, or claims against it." },
      { heading: "Step 3: The Stone Gets Scientifically Certified", body: "The stone is sent to GIA (Gemological Institute of America) \u2014 the world\u2019s most trusted gemological laboratory. They use scientific instruments to determine exactly what the stone is: its type, carat weight, color grade, clarity, any treatments (like heat treatment), and geographic origin. For high-value colored stones, we also get reports from SSEF (Swiss Gemmological Institute) and sometimes Gub\u00e9lin. These labs use spectroscopy and other advanced techniques to determine where on Earth the stone was mined \u2014 because origin dramatically affects value. A Burmese ruby can be worth 2-5x more than an identical-looking Mozambican ruby.\n\nAnalogy: Like getting your diamond independently certified before selling your engagement ring. Without the certificate, it\u2019s just a shiny rock with a story. With the certificate, it\u2019s a scientifically verified asset." },
      { heading: "Step 4: Three Independent Experts Value the Stone", body: "This is PleoChrome\u2019s signature investor protection: the 3-Appraisal Rule. We select three certified gemologist appraisers (CGA or MGA credentials) from our approved panel. Each appraiser: (a) has zero connection to the stone owner, to PleoChrome, or to each other, (b) physically inspects the stone, (c) writes a formal valuation following USPAP standards (the same professional rules real estate appraisers follow), (d) doesn\u2019t know what the other two valued it at. Once all three reports are in, we average the two LOWEST values. This is the offering price.\n\nWhy the two lowest? Because if one appraiser says $55M, another says $48M, and another says $50M \u2014 using only the two lowest ($48M + $50M = $49M average) ensures the price is structurally conservative. The stone owner might be disappointed, but every investor is protected from overpaying.\n\nAnalogy: Like getting three quotes for a car repair and going with the average of the two cheapest. It protects the person paying." },
      { heading: "Step 5: The Stone Goes Into a Fortress", body: "The stone is transported (with specialized transit insurance) to an institutional vault operated by Brink\u2019s or Malca-Amit \u2014 the same companies that guard gold for central banks and cash for major banks worldwide. The stone is stored in segregated custody, meaning it\u2019s in its own compartment, never mixed with other assets. The vault provides: 24/7 armed security, biometric access controls, climate control (temperature and humidity), comprehensive insurance (through Lloyd\u2019s of London or equivalent), and an inventory management system connected to PleoChrome\u2019s platform.\n\nThe vault issues a Custody Receipt \u2014 an official document confirming they are holding this specific stone, identified by its GIA report number.\n\nAnalogy: Like putting gold in Fort Knox. It\u2019s not in someone\u2019s safe at home. It\u2019s in one of the most secure facilities on Earth, professionally insured, and independently verified." },
      { heading: "Step 6: Chainlink Connects the Vault to the Blockchain", body: "Here\u2019s where technology makes this fundamentally different from traditional investments. Chainlink is the world\u2019s largest blockchain oracle network (think of it as a bridge between the real world and the digital world). PleoChrome connects the vault\u2019s inventory system to Chainlink\u2019s network. Multiple independent computers (called nodes) regularly check the vault\u2019s data and publish the custody status on the public blockchain. This means anyone \u2014 an investor in Tokyo, a regulator in Washington, a journalist in London \u2014 can verify in real time that the stone is in the vault.\n\nBut the most important part is this: the smart contract (the program that creates tokens) is programmed to CHECK Chainlink\u2019s custody data BEFORE it will create any new tokens. If the oracle can\u2019t confirm the stone is in the vault, the smart contract will not mint new tokens. Period. This is called \u2018oracle-gated minting\u2019 and it\u2019s the technological backbone of PleoChrome\u2019s credibility.\n\nAnalogy: Like a live security camera feed that the whole world can watch, combined with a lock on the cash register that only opens when the camera confirms the inventory is there." },
      { heading: "Step 7: A Lawyer Creates the Legal Wrapper", body: "A securities attorney creates three key legal documents: (1) The SPV \u2014 a Special Purpose Vehicle, which is a mini-company (Series LLC) created specifically to hold this one stone. If there\u2019s ever a legal problem with this stone, it can\u2019t affect other stones or PleoChrome itself. It\u2019s a legal firewall. (2) The PPM \u2014 the Private Placement Memorandum, a 30-80 page document that tells investors everything: what the stone is, what could go wrong, what fees they\u2019ll pay, how the legal structure works, and how taxes apply. This is like the nutritional label on food, but for investments. (3) The Subscription Agreement \u2014 the contract each investor signs, confirming they understand the risks and are qualified to invest.\n\nAll of this is reviewed for compliance with Reg D 506(c) \u2014 the specific SEC regulation that allows PleoChrome to sell securities to accredited investors and advertise publicly.\n\nAnalogy: Like creating a deed for a house, combined with a full disclosure packet, combined with a purchase contract. The legal foundation that makes everything enforceable." },
      { heading: "Step 8: Digital Tokens Are Created on the Blockchain (Tokenization Path)", body: "For the tokenization path, PleoChrome deploys a compliant security token on the Polygon blockchain using a tokenization platform. We are currently evaluating two leading platforms: Brickken (ERC-3643 standard) and Zoniqx (ERC-7518 standard). Both standards are designed for regulated securities with built-in compliance rules: only investors who have been verified (KYC\u2019d and accredited) can hold them. If someone who isn\u2019t verified tries to receive a token, the transfer automatically fails at the code level. No human intervention needed.\n\nPolygon is the specific blockchain (digital ledger) where the tokens live. We chose it because transactions cost less than a penny (vs. $5-$50 on Ethereum), it processes in 2 seconds, and it\u2019s compatible with all institutional tools.\n\nThe tokenization platform handles the actual deployment \u2014 like using Shopify to build an online store instead of coding from scratch. The smart contracts are pre-audited, meaning security experts have already checked the code for vulnerabilities.\n\nNote: For the fractional securities path, tokens are not required \u2014 investors hold traditional LLC units. For the debt instruments path, the stone serves as collateral under UCC Article 9.\n\nAnalogy: Like printing stock certificates, except they\u2019re digital, they have built-in rules about who can own them, and they\u2019re recorded on a public ledger that can never be altered." },
      { heading: "Step 9: Investors Buy Tokens and PleoChrome Manages Ongoing", body: "Accredited investors who pass KYC verification and accreditation checks can purchase tokens. They review the PPM, sign the subscription agreement electronically, wire funds to the SPV\u2019s escrow account (the money never touches PleoChrome), and receive tokens in their digital wallet. A licensed broker-dealer handles the actual sale for regulatory compliance.\n\nAfter the sale, PleoChrome\u2019s work continues indefinitely: monitoring the Chainlink vault verification 24/7, filing quarterly investor reports, coordinating annual re-appraisals, managing compliance (re-screening investors against sanctions lists quarterly), filing tax documents (K-1s), handling any secondary transfers between token holders, and maintaining the complete audit trail.\n\nIf an investor (or group of investors holding 100% of tokens) ever wants the physical stone, they can redeem: all tokens are burned (destroyed), the vault releases the stone, it\u2019s shipped with insurance to the holder, and the SPV dissolves. Full circle.\n\nAnalogy: Like an IPO (Initial Public Offering) for a gemstone, followed by ongoing property management. The sale is the beginning, not the end." },
    ]
  },
  {
    id: "money", title: "The Money: How Everyone Gets Paid", subtitle: "Following Every Dollar", icon: "dollar", color: "#C47A1A",
    intro: "The most common question: \u2018Where does the money go?\u2019 Here\u2019s a complete breakdown of who pays what, when, and why.",
    content: [
      { heading: "What the Stone Owner Pays (Pass-Through Costs)", body: "The stone owner pays for everything related to THEIR stone\u2019s certification and custody. These are called \u2018pass-through costs\u2019 because PleoChrome coordinates them but doesn\u2019t pay for them. Think of it like selling a house \u2014 the seller pays for the home inspection, staging, and any repairs.\n\nTypical pass-through costs:\n\u2022 Lab reports (GIA, SSEF): $0-$5,000 (most high-value stones already have these)\n\u2022 Three independent appraisals: $7,500 each ($22,500 total)\n\u2022 Transit insurance: $10,000 (insuring shipments between labs/vault)\n\u2022 Vault custody: 0.10-0.15% of stone value per year\n\u2022 Specie insurance: 0.10-0.15% of stone value per year\n\u2022 Photography/media: $2,000\n\nFor a $55M stone, total pass-through costs are approximately $150,000-$200,000 \u2014 which sounds like a lot until you realize it\u2019s only 0.3% of the stone\u2019s value." },
      { heading: "What PleoChrome Charges (Platform Fees)", body: "PleoChrome earns revenue three ways:\n\n1. Setup Fee (2% of asset value) \u2014 Paid upfront when the engagement begins. On a $55M stone: $1,100,000. This covers PleoChrome\u2019s cost of coordinating the entire pipeline plus profit margin.\n\n2. Success Fee (1.5% of offering value) \u2014 Paid only when the token sale actually closes. On a $48M offering: $720,000. If the offering fails, this is $0. This aligns PleoChrome\u2019s incentives with the stone owner\u2019s.\n\n3. Annual Admin Fee (0.75% of offering value) \u2014 Paid every year for ongoing management. On a $48M offering: $360,000/year. This is PleoChrome\u2019s recurring revenue \u2014 it grows with every new stone added to the platform.\n\nTotal Year 1 revenue from one $55M stone: approximately $1.8M." },
      { heading: "What the Broker-Dealer Takes (Distribution Fees)", body: "The broker-dealer is the licensed company that actually sells the tokens to investors. They earn a commission of 5-7% of the amount raised. On a $48M offering at 7%: $3,360,000.\n\nWhy so much? Because they carry the regulatory burden of the actual sale, maintain expensive FINRA licenses, provide the investor network, and assume legal liability for the distribution. Think of it like a real estate agent\u2019s 6% commission \u2014 it seems high until you consider what they do.\n\nImportant: For the first offering, PleoChrome plans to do direct distribution (no BD) using its own network under 506(c) general solicitation rules. This would eliminate the BD fee entirely and increase net proceeds to the stone owner significantly." },
      { heading: "What the Investor Gets", body: "After all fees and costs, the stone owner receives approximately 77% of their claimed value as net proceeds. For a $55M stone:\n\n\u2022 Claimed value: $55,000,000\n\u2022 Offering value (after appraisal discount): ~$48,000,000\n\u2022 Minus BD placement (7%): -$3,360,000\n\u2022 Minus PleoChrome fees (3.5%): -$1,820,000\n\u2022 Minus pass-through costs: -$200,000\n\u2022 Net to stone owner: ~$42,620,000 (77.5%)\n\nThe investor buys tokens at the conservative offering price and owns a proportional share of the stone. If the stone appreciates (colored gemstones average 12-15% annually), the token value increases proportionally. Investors also benefit from PleoChrome\u2019s ongoing vault verification, insurance, and compliance monitoring." },
    ]
  },
  {
    id: "tech", title: "The Technology Stack", subtitle: "Blockchain Without the Buzzwords", icon: "chain", color: "#1E3A6E",
    intro: "The technology behind PleoChrome is sophisticated but the concepts aren\u2019t. Here\u2019s what each piece does and why it matters, explained without any technical jargon.",
    content: [
      { heading: "Blockchain: The Shared Notebook Nobody Can Erase", body: "A blockchain is like a shared Google Sheet that the whole world can see but nobody can edit or delete \u2014 you can only add new rows. Every transaction (every time a token is created, transferred, or destroyed) is recorded permanently. This means: no one can fake ownership (the record is public), no one can double-sell (the system prevents it), and no one can delete the history (it\u2019s permanent). PleoChrome uses Polygon, a specific blockchain that processes transactions in 2 seconds for less than $0.01 each." },
      { heading: "Smart Contracts: Vending Machines for Financial Rules", body: "A smart contract is a program that lives on the blockchain and automatically enforces rules. Put in the right inputs, get the right outputs. No human needed.\n\nPleoChrome\u2019s smart contract enforces these rules automatically:\n\u2022 Only verified, accredited investors can hold tokens (verified = passed KYC + accreditation)\n\u2022 Transfers to unverified wallets are blocked at the code level\n\u2022 New tokens can ONLY be created if Chainlink confirms the stone is in the vault\n\u2022 Maximum number of holders can be capped\n\u2022 Lock-up periods prevent selling for a set time after purchase\n\u2022 Jurisdiction restrictions block investors in sanctioned countries\n\nAll of these rules execute automatically. No one at PleoChrome has to approve each transfer \u2014 the code handles it." },
      { heading: "Security Token Standards: ERC-3643 and ERC-7518", body: "Regular crypto tokens (like Bitcoin) can be sent to anyone, anytime, with no rules. That doesn\u2019t work for securities \u2014 securities have legal requirements about who can own them and how they can be traded.\n\nPleoChrome is evaluating two leading compliance token standards:\n\n\u2022 ERC-3643 \u2014 The most widely adopted standard for regulated securities ($32B+ tokenized). Identity is decoupled from the wallet via ONCHAINID. The DTCC joined the ERC-3643 ecosystem in 2025.\n\u2022 ERC-7518 \u2014 A newer standard designed specifically for multi-party regulatory compliance with built-in dividend distribution and more granular transfer controls.\n\nBoth standards bake compliance rules directly into the token itself, ensuring only verified investors can hold and transfer tokens. PleoChrome will select the standard that best serves our regulatory and operational needs." },
      { heading: "Chainlink Proof of Reserve: The Trust Machine", body: "This is the most important technology in the entire PleoChrome stack. Here\u2019s exactly how it works:\n\n1. The vault (Brink\u2019s or Malca-Amit) has a computer system that tracks what\u2019s stored inside.\n2. PleoChrome builds a connection (called an External Adapter) between that vault system and Chainlink.\n3. Multiple independent computers in Chainlink\u2019s network (called nodes) independently check the vault data.\n4. These nodes reach consensus (agreement) on what\u2019s in the vault and publish that information on the blockchain.\n5. The smart contract that creates tokens is programmed to call this Chainlink data feed BEFORE minting.\n6. If the data feed says \u2018stone is in custody\u2019 \u2192 minting is allowed.\n7. If the data feed says anything else \u2192 minting is blocked. Automatically. No override possible.\n\nThis is what makes the system trustworthy: no single party can lie about the stone\u2019s status. Multiple independent computers verify it. And the minting lock is in the code itself \u2014 not dependent on anyone\u2019s honesty." },
      { heading: "Tokenization Platforms: The Engine Under Evaluation", body: "PleoChrome doesn\u2019t build blockchain software from scratch. That would be like building your own car engine instead of buying a Toyota. We are platform-agnostic and currently evaluating two leading tokenization platforms:\n\n\u2022 Brickken (Barcelona) \u2014 Uses ERC-3643 token standard. Pre-audited smart contracts, built-in KYC, investor management, compliance guidance. Advanced tier ~$5,500/year.\n\u2022 Zoniqx (US-based) \u2014 Uses ERC-7518 token standard. Institutional-grade infrastructure, multi-chain support, regulatory compliance tools.\n\nBoth provide:\n\u2022 Pre-built, pre-audited smart contracts (security experts have already checked the code)\n\u2022 A dashboard for deploying and managing tokens\n\u2022 Built-in KYC verification\n\u2022 Investor management tools\n\u2022 Compliance guidance\n\nPleoChrome will select the best platform based on our specific needs \u2014 US regulatory compliance, Chainlink PoR integration capability, investor experience, and scalability. Using a proven platform is dramatically cheaper than building custom blockchain infrastructure, which could cost $100K-$500K+." },
    ]
  },
  {
    id: "legal", title: "The Legal Framework", subtitle: "Securities Law Made Simple", icon: "scale", color: "#5B2D8E",
    intro: "Securities law sounds intimidating, but the core concepts are straightforward. Here\u2019s what you need to know about how PleoChrome operates legally in the United States.",
    content: [
      { heading: "Why Are Tokens \u2018Securities\u2019?", body: "In the US, a \u2018security\u2019 is any investment where: (1) you invest money, (2) in a common enterprise, (3) with the expectation of profit, (4) primarily from the efforts of others. This is called the Howey Test (from a 1946 Supreme Court case). PleoChrome\u2019s tokens clearly meet all four: investors put in money, into a shared stone, expecting it to appreciate in value, with PleoChrome managing everything. So yes, these tokens are securities. And that\u2019s a GOOD thing \u2014 it means real investor protections apply." },
      { heading: "Reg D 506(c): Our Permission Slip", body: "Normally, selling securities requires registering with the SEC (a months-long, expensive process). But the SEC provides exemptions for certain types of offerings. Reg D 506(c) is the specific exemption PleoChrome uses. It allows:\n\n\u2022 Raising unlimited amounts of money (no cap)\n\u2022 General solicitation \u2014 meaning we CAN advertise publicly (websites, LinkedIn, events)\n\u2022 Selling to accredited investors only (income $200K+ or net worth $1M+)\n\u2022 Self-certification for investments of $200K+ (simplified verification as of 2025)\n\nThe tradeoff: we MUST verify that every single investor is actually accredited. No exceptions. This protects less sophisticated investors from risks they may not understand." },
      { heading: "SPV: The Legal Firewall", body: "Each stone gets its own legal entity \u2014 a Series LLC (Limited Liability Company). Think of it as a row of safety deposit boxes: each box is completely separate from the others. If something goes wrong with Box A, it cannot affect Box B, C, or D.\n\nWyoming is the preferred state for forming these because:\n\u2022 Formation cost: $100 (one-time)\n\u2022 Annual fee: $60\n\u2022 Strong privacy protections\n\u2022 No state income tax\n\u2022 Series LLC law allows creating sub-series without additional filings\n\nThe SPV\u2019s Operating Agreement defines exactly what rights token holders have: economic rights (share of value), governance rights (if any), transfer restrictions, and dissolution procedures." },
      { heading: "Compliance: The Ongoing Obligation", body: "Compliance isn\u2019t a one-time event \u2014 it\u2019s ongoing. After the offering, PleoChrome must:\n\n\u2022 Re-screen all investors against sanctions lists quarterly\n\u2022 Monitor transactions for suspicious patterns\n\u2022 File annual Form D amendments with the SEC\n\u2022 Get an independent AML (Anti-Money Laundering) audit every year\n\u2022 Maintain complete audit trails (every action documented)\n\u2022 Issue K-1 tax documents to investors annually\n\u2022 File reports with FinCEN if suspicious activity is detected\n\nThis is what separates a legitimate tokenized offering from a crypto scam. It\u2019s expensive and time-consuming, but it\u2019s what makes the system trustworthy." },
    ]
  },
  {
    id: "safety", title: "Investor Protections", subtitle: "How We Protect Every Stakeholder", icon: "shield", color: "#A61D3A",
    intro: "The entire PleoChrome system is designed around one principle: nobody should have to trust anyone\u2019s word. Every claim is independently verified, every risk is disclosed, and every protection is structural \u2014 meaning it\u2019s built into the system, not dependent on anyone\u2019s good intentions.",
    content: [
      { heading: "The 3-Appraisal Rule", body: "Three independent appraisers. Two lowest values averaged. This means the offering price is ALWAYS below at least two experts\u2019 opinions of what the stone is worth. The stone owner can\u2019t inflate the price. PleoChrome can\u2019t inflate the price. The math does the protecting." },
      { heading: "Oracle-Gated Minting", body: "The smart contract checks Chainlink\u2019s Proof of Reserve data feed before creating any new tokens. If the stone isn\u2019t confirmed in vault custody, no tokens can be created. This is enforced by code, not by promises. No one at PleoChrome can override it." },
      { heading: "ERC-3643 Compliance", body: "Every token transfer is automatically verified against compliance rules at the smart contract level. Non-verified wallets simply cannot hold the tokens. This prevents: unauthorized transfers, sales to non-accredited investors, transfers to sanctioned individuals, and exceeding holder limits." },
      { heading: "Segregated Custody + Insurance", body: "The stone is stored alone (not mixed with other assets) in an institutional vault, covered by specie insurance from Lloyd\u2019s of London or equivalent. If the vault is robbed, if there\u2019s a natural disaster, if anything happens \u2014 the insurance covers the stone\u2019s full appraised value." },
      { heading: "Bankruptcy Remoteness", body: "Each stone is in its own Series LLC. If PleoChrome goes bankrupt, the stones in their individual SPVs are legally untouchable \u2014 they belong to the token holders through the SPV, not to PleoChrome. If another stone has a legal problem, it can\u2019t spread to your stone\u2019s SPV." },
      { heading: "Full Disclosure (PPM)", body: "The Private Placement Memorandum discloses every risk, every fee, and every potential problem. Investors can\u2019t say they weren\u2019t warned. This document is their protection in court if anything goes wrong \u2014 and it\u2019s PleoChrome\u2019s protection that it was transparent from the start." },
    ]
  },
];

// ── Password Gate ─────────────────────────────

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [code, setCode] = useState("");
  const [err, setErr] = useState(false);
  const go = (e: React.FormEvent) => { e.preventDefault(); if (code === PASSCODE) onUnlock(); else { setErr(true); setTimeout(() => setErr(false), 1500); } };
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030712] px-4">
      <form onSubmit={go} className="text-center max-w-sm w-full">
        <Image src="/favicon.png" alt="" width={48} height={48} className="mx-auto mb-6 opacity-60" />
        <h1 className="font-[family-name:var(--font-cormorant)] text-2xl font-light text-white/80 mb-2">Masterclass</h1>
        <p className="text-xs tracking-[0.2em] uppercase text-white/30 mb-8">Enter passcode</p>
        <input type="password" value={code} onChange={e => setCode(e.target.value)} placeholder="Passcode" autoFocus
          className={`w-full bg-white/[0.04] border rounded-xl px-5 py-3.5 text-sm text-white/80 placeholder:text-white/20 outline-none ${err ? "border-[#A61D3A]" : "border-white/[0.08] focus:border-white/20"}`} />
        <button type="submit" className="mt-4 w-full bg-gradient-to-r from-[#1A8B7A] to-[#1E3A6E] text-white text-xs tracking-[0.2em] uppercase py-3.5 rounded-xl">Enter</button>
      </form>
    </div>
  );
}

// ── Main ──────────────────────────────────────

export default function LearnPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [dark, setDark] = useState(true);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [openContent, setOpenContent] = useState<Set<string>>(new Set());

  useState(() => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem("pleo-auth") === "true") setUnlocked(true);
      const saved = localStorage.getItem("pleo-dark");
      if (saved !== null) setDark(saved === "true");
    }
  });

  const toggleContent = (key: string) => setOpenContent(prev => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n; });

  if (!unlocked) return <PasswordGate onUnlock={() => setUnlocked(true)} />;

  const bg = dark ? "bg-[#030712]" : "bg-[#F8F9FA]";
  const tx = dark ? "text-[#FAFBFC]" : "text-[#1a1a1a]";
  const cd = dark ? "bg-[rgba(10,17,32,0.92)] border-white/[0.04]" : "bg-white border-gray-200 shadow-sm";
  const s1 = dark ? "text-white/25" : "text-gray-400";
  const s2 = dark ? "text-white/50" : "text-gray-600";
  const s3 = dark ? "text-white/70" : "text-gray-800";
  const dv = dark ? "border-white/[0.04]" : "border-gray-100";
  const hv = dark ? "hover:bg-white/[0.02]" : "hover:bg-gray-50";

  const currentSection = sections.find(s => s.id === activeSection);

  return (
    <div className={`min-h-screen ${bg} ${tx} transition-colors duration-300`}>
      <header className="text-center pt-6 pb-5 sm:pt-10 sm:pb-7 relative px-4">
        <div className="flex items-center justify-center gap-2 mb-3">
          {activeSection ? (
            <button onClick={() => setActiveSection(null)} className={`text-[9px] sm:text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full border transition-colors flex items-center gap-1 ${dark ? "border-white/10 text-white/30 hover:text-white/50" : "border-gray-300 text-gray-400 hover:text-gray-600"}`}>
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Back
            </button>
          ) : (
            <a href="/portal" className={`text-[9px] sm:text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full border transition-colors flex items-center gap-1 ${dark ? "border-white/10 text-white/30 hover:text-white/50" : "border-gray-300 text-gray-400 hover:text-gray-600"}`}>
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Portal
            </a>
          )}
          <Image src={dark ? "/logo-white.png" : "/logo.png"} alt="PleoChrome" width={160} height={40} className="opacity-50 h-5 sm:h-6 w-auto" />
          <button onClick={() => { setDark(!dark); localStorage.setItem("pleo-dark", String(!dark)); }}
            className={`text-[9px] sm:text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full border transition-colors ${dark ? "border-white/10 text-white/30" : "border-gray-300 text-gray-400"}`}>
            {dark ? "Light" : "Dark"}
          </button>
        </div>
        <h1 className="font-[family-name:var(--font-cormorant)] text-lg sm:text-2xl font-light tracking-wider">
          {activeSection ? currentSection?.title : "PleoChrome Masterclass"}
        </h1>
        <p className={`mt-1 text-[10px] tracking-[0.25em] uppercase ${s1}`}>
          {activeSection ? currentSection?.subtitle : "Everything You Need to Know"}
        </p>
        <div className="flex gap-[2px] justify-center mt-3">
          {["#1B6B4A","#1A8B7A","#1E3A6E","#5B2D8E","#A61D3A","#C47A1A","#7BA31E"].map(c => (
            <span key={c} className="h-[2px] w-4 rounded-sm" style={{ background: c }} />
          ))}
        </div>
        <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] max-w-md h-px bg-gradient-to-r from-transparent ${dark ? "via-white/[0.06]" : "via-gray-200"} to-transparent`} />
      </header>

      <div className="max-w-3xl mx-auto px-3 sm:px-5 pb-16">

        {/* ── Hub View ─────────────────────── */}
        {!activeSection && (
          <>
            <div className={`${cd} border rounded-2xl p-4 sm:p-5 mb-5`}>
              <p className={`text-xs sm:text-sm ${s2} leading-relaxed`}>
                This is your complete guide to understanding how PleoChrome works. No finance degree required.
                Each chapter explains a different aspect of gemstone value creation in plain language, with real-world
                analogies and visual examples. PleoChrome offers three paths: Fractional Securities, Tokenization, and Debt Instruments. Start from the top or jump to any topic.
              </p>
            </div>

            <div className="space-y-2.5">
              {sections.map((section, i) => (
                <button key={section.id} onClick={() => { setActiveSection(section.id); setOpenContent(new Set()); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className={`w-full ${cd} border rounded-2xl p-4 sm:p-5 flex items-start gap-3 sm:gap-4 text-left transition-all duration-300 group ${hv}`}>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                    style={{ background: section.color + "15", color: section.color }}>
                    <Icon name={section.icon} size={22} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-[9px] font-mono ${s1}`}>{String(i + 1).padStart(2, "0")}</span>
                      <h2 className={`text-sm sm:text-base font-semibold ${s3}`}>{section.title}</h2>
                    </div>
                    <p className={`text-[10px] sm:text-xs tracking-wider uppercase ${s1} mb-1`}>{section.subtitle}</p>
                    <p className={`text-[10px] sm:text-xs ${s2} leading-relaxed line-clamp-2`}>{section.intro}</p>
                  </div>
                  <svg className={`w-4 h-4 ${s1} shrink-0 mt-1 transition-transform group-hover:translate-x-1`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          </>
        )}

        {/* ── Section View ─────────────────── */}
        {activeSection && currentSection && (
          <>
            {/* Section Intro */}
            <div className={`${cd} border rounded-2xl p-4 sm:p-5 mb-4`}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: currentSection.color + "15", color: currentSection.color }}>
                  <Icon name={currentSection.icon} size={22} />
                </div>
                <div>
                  <p className={`text-[9px] font-mono ${s1}`}>Chapter {sections.findIndex(s => s.id === activeSection) + 1} of {sections.length}</p>
                  <p className={`text-xs sm:text-sm font-semibold ${s3}`}>{currentSection.title}</p>
                </div>
              </div>
              <p className={`text-xs sm:text-sm ${s2} leading-relaxed`}>{currentSection.intro}</p>
            </div>

            {/* Content Items */}
            <div className="space-y-2">
              {currentSection.content.map((item, i) => {
                const key = currentSection.id + "-" + i;
                const isOpen = openContent.has(key);
                return (
                  <div key={key} className={`${cd} border rounded-xl overflow-hidden`}>
                    <button onClick={() => toggleContent(key)} className={`w-full flex items-start gap-3 p-3.5 sm:p-4 text-left ${hv} transition-colors`}>
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 font-mono text-[10px] font-bold text-white"
                        style={{ background: currentSection.color }}>
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs sm:text-sm font-semibold ${isOpen ? s3 : s2}`}>{item.heading}</p>
                        {!isOpen && <p className={`text-[10px] ${s1} mt-0.5 line-clamp-1`}>{item.body.slice(0, 100)}...</p>}
                      </div>
                      <svg className={`w-4 h-4 ${s1} shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M6 9l6 6 6-6" /></svg>
                    </button>
                    <div className={`transition-all duration-400 overflow-hidden ${isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}`}>
                      <div className="px-4 sm:px-5 pb-4 pl-[52px] sm:pl-[56px]">
                        {item.body.split("\n\n").map((para, pi) => (
                          <p key={pi} className={`text-[11px] sm:text-xs ${s2} leading-[1.85] ${pi > 0 ? "mt-3" : ""}`}>
                            {para.split("\n").map((line, li) => (
                              <span key={li}>{line}{li < para.split("\n").length - 1 && <br />}</span>
                            ))}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-6">
              {(() => {
                const idx = sections.findIndex(s => s.id === activeSection);
                const prev = idx > 0 ? sections[idx - 1] : null;
                const next = idx < sections.length - 1 ? sections[idx + 1] : null;
                return (
                  <>
                    {prev ? (
                      <button onClick={() => { setActiveSection(prev.id); setOpenContent(new Set()); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                        className={`text-[10px] sm:text-xs ${s1} flex items-center gap-1 hover:${dark ? "text-white/40" : "text-gray-500"} transition-colors`}>
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                        {prev.title}
                      </button>
                    ) : <div />}
                    {next ? (
                      <button onClick={() => { setActiveSection(next.id); setOpenContent(new Set()); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                        className={`text-[10px] sm:text-xs flex items-center gap-1 transition-colors`} style={{ color: next.color }}>
                        {next.title}
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                      </button>
                    ) : <div />}
                  </>
                );
              })()}
            </div>
          </>
        )}

      </div>

      <footer className={`text-center py-6 border-t ${dv}`}>
        <div className="flex gap-[2px] justify-center mb-2">
          {["#1B6B4A","#1A8B7A","#1E3A6E","#5B2D8E","#A61D3A","#C47A1A","#7BA31E"].map(c => (
            <span key={c} className="h-[2px] w-4 rounded-sm" style={{ background: c }} />
          ))}
        </div>
        <p className={`text-[10px] tracking-[0.15em] ${s1}`}>PleoChrome &mdash; Confidential</p>
      </footer>
    </div>
  );
}
