"use client";

import { useState } from "react";
import Image from "next/image";

const PASSCODE = "pleo123";

/* ═══════════════════════════════════════════════════════
   PleoChrome — Learn: How It All Works
   A plain-English guide to gemstone tokenization
   /learn
   ═══════════════════════════════════════════════════════ */

// ── Types ─────────────────────────────────────

interface Term {
  word: string;
  simple: string;
  detail: string;
  emoji: string;
  category: "money" | "legal" | "tech" | "process" | "people";
}

interface Step {
  num: number;
  title: string;
  analogy: string;
  detail: string;
  emoji: string;
}

// ── Data ──────────────────────────────────────

const categories = {
  money: { label: "Money & Fees", color: "#1B6B4A", bg: "rgba(27,107,74,0.1)" },
  legal: { label: "Legal & Compliance", color: "#5B2D8E", bg: "rgba(91,45,142,0.1)" },
  tech: { label: "Technology", color: "#1E3A6E", bg: "rgba(30,58,110,0.1)" },
  process: { label: "The Process", color: "#C47A1A", bg: "rgba(196,122,26,0.1)" },
  people: { label: "People & Partners", color: "#A61D3A", bg: "rgba(166,29,58,0.1)" },
};

const glossary: Term[] = [
  // MONEY
  { word: "Tokenization", simple: "Turning a physical thing into digital shares people can buy", detail: "Imagine you own a painting worth $1 million. You can't sell half a painting. But you COULD create 1,000 digital certificates, each worth $1,000, and sell those. That's tokenization. The painting stays in a vault. The certificates (tokens) trade digitally. Each token represents real ownership of a piece of that painting. PleoChrome does this with gemstones instead of paintings.", emoji: "\uD83D\uDCB0", category: "money" },
  { word: "Offering Value", simple: "The price we're selling the stone for (not what the owner claims it's worth)", detail: "If you want to sell your house, you might think it's worth $500K. But we get 3 independent appraisers, take the two lowest values, and average them. If they say $430K, $440K, and $480K \u2014 we average the two lowest: $435K. That's the offering value. It's intentionally conservative to protect buyers.", emoji: "\uD83C\uDFF7\uFE0F", category: "money" },
  { word: "Setup Fee", simple: "PleoChrome's upfront payment for starting the whole process", detail: "Like hiring a general contractor to build a house. You pay them upfront to get the project started \u2014 they'll coordinate all the subcontractors, permits, and inspections. PleoChrome's setup fee (typically 2% of the stone's value) covers the cost of coordinating all the specialists needed to prepare the stone for tokenization.", emoji: "\uD83D\uDD27", category: "money" },
  { word: "Success Fee", simple: "PleoChrome's bonus when the tokens actually sell", detail: "Like a real estate agent's commission \u2014 they only get paid when the house actually sells. PleoChrome's success fee (typically 1.5% of the offering) is only collected when the token sale closes and investors have actually wired money. If the offering fails, this fee is $0.", emoji: "\uD83C\uDF89", category: "money" },
  { word: "Admin Fee", simple: "PleoChrome's annual payment for managing everything after the sale", detail: "After you buy a condo, you pay monthly HOA fees for someone to manage the building, maintain common areas, and handle problems. PleoChrome's annual admin fee (typically 0.75% of offering value) covers: keeping the vault custody verified, maintaining the oracle connection, filing regulatory reports, distributing investor updates, and managing the shareholder records.", emoji: "\uD83D\uDCC5", category: "money" },
  { word: "BD Placement Fee", simple: "Commission paid to the licensed sales team that finds investors", detail: "A broker-dealer (BD) is a company with a special license from FINRA (the financial industry's regulator) that allows them to legally sell securities to investors. They take a commission (typically 5-7%) for finding buyers and handling the sale. Think of them as the real estate agents of the investment world \u2014 they have the license, the network, and the legal authority to sell.", emoji: "\uD83E\uDD1D", category: "money" },
  { word: "Pass-Through Costs", simple: "Expenses the stone owner pays directly (not PleoChrome)", detail: "When you sell a house, YOU pay for the home inspection, the title search, and staging. Those costs pass through to you, the seller. Same here \u2014 the stone owner pays for lab reports, appraisals, vault storage, and insurance. PleoChrome coordinates these services but doesn't pay for them. These are clearly labeled in the model.", emoji: "\u27A1\uFE0F", category: "money" },
  { word: "Take Rate", simple: "The percentage PleoChrome keeps from each deal", detail: "If Uber charges you $20 for a ride and pays the driver $15, Uber's take rate is 25% ($5/$20). PleoChrome's take rate is the combined setup fee + success fee + annual admin, expressed as a percentage of the total deal value. A higher take rate means more revenue per deal. Marketplace take rates typically range from 3-30% depending on the industry.", emoji: "\uD83C\uDFAF", category: "money" },
  { word: "AUM", simple: "Assets Under Management \u2014 the total value of everything on the platform", detail: "If PleoChrome has tokenized 5 stones worth $10M, $20M, $30M, $15M, and $25M, the AUM is $100M. This is the number investors care about most because it represents the scale of the business. More AUM = more annual admin fees = more recurring revenue. It's like a property manager \u2014 the more buildings they manage, the more monthly fees they collect.", emoji: "\uD83D\uDCCA", category: "money" },
  { word: "ARR", simple: "Annual Recurring Revenue \u2014 money that comes in every year automatically", detail: "Like a Netflix subscription \u2014 once someone subscribes, they pay every month without you having to re-sell them. PleoChrome's ARR comes from the annual admin fee on every tokenized stone. If you have $100M in AUM at 0.75%, that's $750K in ARR. Investors LOVE recurring revenue because it's predictable.", emoji: "\uD83D\uDD04", category: "money" },
  { word: "CAC", simple: "Customer Acquisition Cost \u2014 how much it costs to get one new customer", detail: "If you spend $3,000 on LinkedIn ads and get 2 stone owners to sign up, your CAC is $1,500. If you spend $0 because a friend referred them, your CAC is $0. Investors want this number to be LOW and FALLING over time. It shows your marketing is getting more efficient.", emoji: "\uD83D\uDCE3", category: "money" },
  { word: "LTV", simple: "Lifetime Value \u2014 how much revenue one customer generates over their entire relationship", detail: "If a stone owner pays a $100K setup fee in Year 1, then you earn $30K/year in admin fees for 5 years, the LTV is $100K + (5 x $30K) = $250K. Investors compare LTV to CAC \u2014 if it costs $1,500 to acquire a customer worth $250K, that's a 167x return. The magic ratio: LTV should be at least 3x CAC.", emoji: "\uD83D\uDCB5", category: "money" },
  // LEGAL
  { word: "Reg D 506(c)", simple: "The legal permission slip that lets us sell investments to rich people and advertise it publicly", detail: "In America, you can't just sell investments to anyone \u2014 the SEC (Securities and Exchange Commission) has rules. Reg D 506(c) is a specific set of rules that says: you CAN sell to 'accredited investors' (people with $200K+ income or $1M+ net worth), you CAN advertise publicly (websites, LinkedIn, events), BUT you MUST verify every buyer is actually accredited. This is the legal foundation for PleoChrome's offerings.", emoji: "\uD83D\uDCDC", category: "legal" },
  { word: "Accredited Investor", simple: "A person rich enough (by law) to invest in private deals", detail: "The government decided that certain investments are too risky for regular people, so they created rules about who can invest. An accredited investor must have: $200K+ annual income ($300K with spouse), OR $1M+ net worth (not counting their house), OR certain professional certifications. In 2025, the SEC made it easier: if you're investing $200K+, you can just sign a letter saying you qualify (self-certification).", emoji: "\uD83D\uDD11", category: "legal" },
  { word: "PPM", simple: "Private Placement Memorandum \u2014 the big legal document investors read before buying", detail: "Think of it as the nutritional label on food, but for investments. It tells investors everything: what the stone is, what could go wrong (risk factors), exactly what fees they'll pay, how the legal structure works, who's managing it, and how taxes work. A securities attorney writes it. It's typically 30-80 pages. If an investor loses money and sues, the first thing the court asks is: 'Did the PPM disclose this risk?'", emoji: "\uD83D\uDCD6", category: "legal" },
  { word: "SPV / Series LLC", simple: "A mini-company created just to hold one stone", detail: "Imagine a row of safety deposit boxes. Each box is completely separate from the others. If one box gets damaged, the others are fine. An SPV (Special Purpose Vehicle) works the same way \u2014 we create a separate legal entity for each stone. If there's ever a legal problem with one stone, it can't spread to the others. It's like building a firewall between each investment. Wyoming lets us create these cheaply ($100).", emoji: "\uD83C\uDFE6", category: "legal" },
  { word: "Form D", simple: "A one-page form we file with the SEC saying 'we're selling an investment'", detail: "It's like a marriage license \u2014 you need it to be legal, but it's just a form, not an approval. The SEC doesn't review or approve the offering. They just want to know it's happening. We file electronically, there's no fee, and it must be done within 15 days of the first sale. It takes about 15 minutes to complete.", emoji: "\uD83D\uDCE4", category: "legal" },
  { word: "Blue Sky Filing", simple: "Telling each state 'we're selling investments to people in your state'", detail: "In addition to the federal Form D, most states want a notice filing too. These are called 'blue sky' filings (named after early fraud laws meant to stop people from selling 'the blue sky'). Each state charges a small fee ($100-$500). You only need to file in states where your actual investors live \u2014 not all 50.", emoji: "\uD83C\uDF24\uFE0F", category: "legal" },
  { word: "KYC / KYB", simple: "Know Your Customer / Know Your Business \u2014 checking that people are who they say they are", detail: "Before a bank opens your account, they check your ID. That's KYC. Before they work with a business, they check the company's paperwork. That's KYB. PleoChrome does both: we verify the identity of every stone owner and every investor. This includes: government ID check, address verification, sanctions screening, and checking for 'Politically Exposed Persons' (politicians, diplomats, their families).", emoji: "\uD83D\uDD0D", category: "legal" },
  { word: "AML", simple: "Anti-Money Laundering \u2014 making sure nobody uses our system to hide dirty money", detail: "Money laundering is when criminals disguise illegal money as legitimate. AML is the set of procedures we follow to prevent this: screening everyone against sanctions lists, monitoring transactions for suspicious patterns, filing reports with the government if something looks wrong, and training our team to spot red flags. We also get audited annually by an independent firm to prove we're doing this properly.", emoji: "\uD83D\uDEE1\uFE0F", category: "legal" },
  { word: "OFAC / Sanctions", simple: "The US government's list of people and countries we're not allowed to do business with", detail: "OFAC (Office of Foreign Assets Control) maintains a list of people, companies, and countries that the US has sanctioned. If someone on that list tries to buy tokens or sell us a stone, we MUST say no. A single violation can result in millions in fines or criminal charges. We screen every person and entity before doing any business with them.", emoji: "\uD83D\uDEAB", category: "legal" },
  // TECH
  { word: "ERC-3643", simple: "The specific type of digital token we use \u2014 one with built-in rules about who can own and trade it", detail: "Regular crypto tokens (like Bitcoin) can be sent to anyone, anytime. That doesn't work for securities \u2014 you need rules about who can own them (accredited investors only), where they can be traded (compliant exchanges), and when they can be transferred (after lock-up periods). ERC-3643 bakes ALL of these rules directly into the token itself. If someone who isn't verified tries to receive a token, the transfer automatically fails. $32 billion in assets have been tokenized using this standard.", emoji: "\uD83E\uDDE9", category: "tech" },
  { word: "Polygon", simple: "The specific blockchain (digital ledger) where the tokens live", detail: "Think of a blockchain as a shared Google Sheet that nobody can edit or delete \u2014 only add new rows. Polygon is one of these shared ledgers. We chose it because: transactions cost less than $0.01 (vs. $5-$50 on Ethereum), it processes transactions in 2 seconds, it's compatible with all the tools we need, and major institutions already use it.", emoji: "\u26D3\uFE0F", category: "tech" },
  { word: "Smart Contract", simple: "A program that lives on the blockchain and automatically enforces rules", detail: "Imagine a vending machine: you put in money, it gives you a snack. No human needed. A smart contract works the same way but for financial rules: 'If this investor is verified AND the stone is in the vault AND they've sent money, THEN create their tokens.' The rules execute automatically. No one can change them after they're deployed. This is why we don't need a human to approve every transfer.", emoji: "\uD83E\uDD16", category: "tech" },
  { word: "Chainlink Proof of Reserve", simple: "An independent system that publicly proves the stone is still in the vault", detail: "Here's the problem: how does an investor KNOW the stone is really in the vault? They could call the vault, but that's slow and they have to trust whoever answers. Chainlink solves this by connecting the vault's computer system to the blockchain. Multiple independent computers (nodes) check the vault data and publish it publicly. Anyone can verify the stone's status 24/7. And here's the key part: the smart contract checks this BEFORE creating any new tokens. If the stone isn't confirmed in custody, no new tokens can be created. Period.", emoji: "\uD83D\uDD17", category: "tech" },
  { word: "Oracle", simple: "A bridge that brings real-world information onto the blockchain", detail: "Blockchains are like sealed rooms \u2014 they can't see the outside world on their own. An oracle is like a window. Chainlink is the world's largest oracle network. It brings data from the real world (like 'Is this stone in the vault?' or 'What's the current gold price?') onto the blockchain where smart contracts can use it to make decisions.", emoji: "\uD83D\uDD2E", category: "tech" },
  { word: "Mint / Minting", simple: "Creating new tokens \u2014 like printing new shares of stock", detail: "When a company does an IPO, they 'issue' new shares. When PleoChrome creates new tokens for an offering, we 'mint' them. Each token is created on the blockchain with a unique record. Importantly, our minting is 'oracle-gated' \u2014 the smart contract checks with Chainlink that the stone is in the vault BEFORE it will create any new tokens. No vault confirmation = no new tokens. Ever.", emoji: "\u2728", category: "tech" },
  { word: "Brickken", simple: "The company whose software we use to actually create and manage the tokens", detail: "PleoChrome doesn't build blockchain software from scratch. Brickken is a Barcelona-based company that provides a ready-made tokenization platform. Think of it like using Shopify to build an online store instead of coding one from scratch. Brickken handles: deploying the smart contracts, managing investor KYC, tracking the cap table, and processing transfers. Their contracts are already security-audited.", emoji: "\uD83C\uDFED", category: "tech" },
  // PROCESS
  { word: "3-Appraisal Rule", simple: "We get 3 separate experts to value the stone, then use the 2 lowest to set the price", detail: "This is PleoChrome's signature investor protection. Three independent appraisers (who don't know each other and have no connection to the stone owner) each evaluate the stone separately. If they say $50M, $48M, and $52M \u2014 we average the two lowest ($48M + $50M = $49M). This ensures the offering price is always conservative, never inflated. It's like getting 3 quotes for a car repair and going with the average of the two cheapest.", emoji: "\uD83D\uDD22", category: "process" },
  { word: "7-Gate Framework", simple: "7 checkpoints a stone must pass before it can be tokenized \u2014 fail any one and it stops", detail: "Think of airport security: you pass through multiple checkpoints (ID check, bag scan, metal detector, boarding pass). If you fail ANY one, you don't fly. PleoChrome's 7 gates work the same way: (1) Intake \u2014 seller verified, (2) Evidence \u2014 legal clearance, (3) Verification \u2014 labs + appraisals, (4) Custody \u2014 in the vault, (5) Issuer \u2014 legal docs ready, (6) Platform \u2014 token deployed, (7) Sale \u2014 investors verified. Every gate is binary: pass or fail. No exceptions.", emoji: "\uD83D\uDEA7", category: "process" },
  { word: "GIA Report", simple: "A scientific ID card for the stone from the world's most trusted gem lab", detail: "GIA (Gemological Institute of America) is like the FBI fingerprint database for gemstones. They measure exactly what the stone is: its type, weight, color grade, clarity, any treatments, and where it was mined. Every major auction house and dealer in the world accepts GIA reports. Without one, a stone cannot be credibly valued. Most high-value stones already have one \u2014 it travels with the stone for life.", emoji: "\uD83D\uDD2C", category: "process" },
  { word: "USPAP", simple: "The rulebook appraisers must follow \u2014 like GAAP for accountants", detail: "USPAP (Uniform Standards of Professional Appraisal Practice) is the set of rules that all professional appraisers in the US must follow. It requires: independence (no conflicts of interest), competence (proper qualifications), and transparency (show your work). One critical rule: appraisers CANNOT charge a percentage of the appraised value. This prevents them from inflating values to earn bigger fees.", emoji: "\uD83D\uDCCF", category: "process" },
  { word: "Provenance", simple: "The complete ownership history of the stone \u2014 where it's been and who's owned it", detail: "Like a car's CARFAX report, but for a gemstone. It traces the stone from the mine where it was dug up, through every owner, dealer, and auction, all the way to the person who's bringing it to PleoChrome. Clean provenance means: no stolen property, no conflict zones, no sanctions violations, no competing ownership claims. Without clean provenance, a stone cannot be tokenized.", emoji: "\uD83D\uDCDC", category: "process" },
  // PEOPLE
  { word: "Broker-Dealer (BD)", simple: "A company with a government license to legally sell investments", detail: "Just like you need a real estate license to sell houses and a medical license to practice medicine, you need a FINRA license to sell securities (investments). A broker-dealer has this license. PleoChrome itself does NOT have this license \u2014 and intentionally doesn't want one (it comes with heavy regulation). Instead, we partner with a licensed BD who handles the actual sale to investors. They earn a commission (5-7%) for this service.", emoji: "\uD83C\uDFE2", category: "people" },
  { word: "Transfer Agent", simple: "The official recordkeeper of who owns which tokens", detail: "In the old world, a transfer agent was a company that kept a master list of who owned which shares of stock. In PleoChrome's world, the blockchain itself IS the transfer agent \u2014 the ERC-3643 smart contract maintains a permanent, transparent record of every token holder. Per the SEC's January 2026 guidance, blockchain can serve as the official shareholder record. No separate company needed.", emoji: "\uD83D\uDCDD", category: "people" },
  { word: "Compliance Officer", simple: "The person responsible for making sure we follow all the rules", detail: "Every company that deals with investments or money needs a designated person who is responsible for compliance with all regulations. This person writes the AML policies, oversees KYC procedures, ensures regulatory filings happen on time, and handles any suspicious activity reports. Regulators expect this person to be named from day one. It's not optional.", emoji: "\uD83D\uDC68\u200D\u2696\uFE0F", category: "people" },
  { word: "Vault Custodian", simple: "The company that physically guards the stone (Brink's or Malca-Amit)", detail: "These are the same companies that transport cash for banks, guard gold for central governments, and protect diamonds for De Beers. Brink's and Malca-Amit operate fortress-level vaults with 24/7 armed security, biometric access, climate control, and comprehensive insurance. When we say a stone is in 'institutional custody,' we mean it's behind the same security that protects billions in assets worldwide.", emoji: "\uD83D\uDD12", category: "people" },
];

const howItWorks: Step[] = [
  { num: 1, title: "Someone has a valuable stone", analogy: "Like someone who owns a rare baseball card worth millions but can't find one buyer with that much cash", detail: "A stone owner has a certified, high-value colored gemstone (ruby, emerald, sapphire) worth $1M or more. They want to unlock its value but the market for single ultra-expensive stones is tiny. There might only be a handful of people in the world who can write a check that big. Tokenization solves this by letting HUNDREDS of investors each buy a small piece.", emoji: "\uD83D\uDC8E" },
  { num: 2, title: "PleoChrome verifies everything about the stone and owner", analogy: "Like a car dealership inspecting a trade-in before they'll put it on the lot", detail: "We check: Is the owner really the owner? (KYC) Is the stone real? (GIA lab report) Where did it come from? (provenance) Is anyone sanctioned? (OFAC screening) Is there clean legal title? (no liens or disputes) \u2014 This is Gates 1 and 2 of our 7-Gate Framework. If anything fails, we stop here.", emoji: "\uD83D\uDD0D" },
  { num: 3, title: "Three independent experts value the stone", analogy: "Like getting 3 home appraisals before listing your house", detail: "Three certified appraisers who don't know each other, have no connection to the owner, and can't see each other's work each independently evaluate the stone. We take the two lowest values and average them. This is the 3-Appraisal Rule \u2014 it guarantees the price is conservative. This is Gate 3.", emoji: "\uD83D\uDD22" },
  { num: 4, title: "The stone goes into an institutional vault", analogy: "Like putting gold in Fort Knox", detail: "The stone is transported (with insurance) to Brink's or Malca-Amit \u2014 the same companies that guard gold for central banks. It's stored separately from everything else (segregated custody), with 24/7 security and full insurance. A vault receipt is issued. This is Gate 4.", emoji: "\uD83C\uDFE6" },
  { num: 5, title: "Chainlink connects the vault to the internet so anyone can verify", analogy: "Like a live security camera feed that the whole world can watch", detail: "Chainlink's oracle network connects to the vault's computer system and publishes the custody status on the blockchain. Multiple independent computers verify the data. Anyone \u2014 investors, regulators, the public \u2014 can check that the stone is in the vault 24/7. If the stone ever leaves, the system immediately flags it.", emoji: "\uD83D\uDD17" },
  { num: 6, title: "A lawyer creates the legal wrapper", analogy: "Like creating a deed for a house", detail: "A securities attorney creates: the SPV (a mini-company that legally holds the stone), the PPM (the disclosure document investors read), and the subscription agreement (the contract investors sign). Everything is reviewed for compliance with SEC regulations. This is Gate 5.", emoji: "\uD83D\uDCDC" },
  { num: 7, title: "Digital tokens are created on the blockchain", analogy: "Like printing stock certificates, but digital and with built-in rules", detail: "Using Brickken's platform, we deploy an ERC-3643 token on the Polygon blockchain. The token has built-in rules: only verified accredited investors can hold it, transfers to non-verified wallets are automatically blocked, and new tokens can ONLY be created if Chainlink confirms the stone is in the vault. This is Gate 6.", emoji: "\u2728" },
  { num: 8, title: "Verified investors buy the tokens", analogy: "Like an IPO, but for a gemstone", detail: "Accredited investors who pass KYC and accreditation verification can purchase tokens. They review the PPM, sign the subscription agreement, wire funds, and receive tokens in their digital wallet. The broker-dealer handles the legal sale. This is Gate 7 \u2014 the offering is open.", emoji: "\uD83D\uDCB0" },
  { num: 9, title: "PleoChrome manages everything ongoing", analogy: "Like a property management company for a rental building", detail: "After the sale: PleoChrome monitors the Chainlink vault verification 24/7, files quarterly investor reports, coordinates annual re-appraisals, manages compliance (sanctions re-screening), files tax documents (K-1s), and handles any secondary transfers. The stone sits in the vault. The tokens represent ownership. PleoChrome keeps the system running.", emoji: "\uD83D\uDD04" },
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
        <h1 className="font-[family-name:var(--font-cormorant)] text-2xl font-light text-white/80 mb-2">Learn</h1>
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
  const [expandedTerms, setExpandedTerms] = useState<Set<string>>(new Set());
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set());
  const [filterCat, setFilterCat] = useState<string | null>(null);

  // Check portal auth + dark mode
  useState(() => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem("pleo-auth") === "true") setUnlocked(true);
      const saved = localStorage.getItem("pleo-dark");
      if (saved !== null) setDark(saved === "true");
    }
  });

  const toggleTerm = (word: string) => setExpandedTerms(prev => { const n = new Set(prev); n.has(word) ? n.delete(word) : n.add(word); return n; });
  const toggleStep = (num: number) => setExpandedSteps(prev => { const n = new Set(prev); n.has(num) ? n.delete(num) : n.add(num); return n; });

  if (!unlocked) return <PasswordGate onUnlock={() => setUnlocked(true)} />;

  const filteredGlossary = filterCat ? glossary.filter(t => t.category === filterCat) : glossary;

  const bg = dark ? "bg-[#030712]" : "bg-[#F8F9FA]";
  const tx = dark ? "text-[#FAFBFC]" : "text-[#1a1a1a]";
  const cd = dark ? "bg-[rgba(10,17,32,0.92)] border-white/[0.04]" : "bg-white border-gray-200 shadow-sm";
  const s1 = dark ? "text-white/25" : "text-gray-400";
  const s2 = dark ? "text-white/50" : "text-gray-600";
  const s3 = dark ? "text-white/70" : "text-gray-800";

  return (
    <div className={`min-h-screen ${bg} ${tx} transition-colors duration-300`}>
      <header className="text-center pt-8 pb-6 sm:pt-12 sm:pb-8 relative px-4">
        <div className="flex items-center justify-center gap-2 mb-3">
          <a href="/portal" className={`text-[9px] sm:text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full border transition-colors flex items-center gap-1 ${dark ? "border-white/10 text-white/30 hover:text-white/50" : "border-gray-300 text-gray-400 hover:text-gray-600"}`}>
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Portal
          </a>
          <Image src={dark ? "/logo-white.png" : "/logo.png"} alt="PleoChrome" width={160} height={40} className="opacity-50 h-5 sm:h-6 w-auto" />
          <button onClick={() => { setDark(!dark); localStorage.setItem("pleo-dark", String(!dark)); }}
            className={`text-[9px] sm:text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full border transition-colors ${dark ? "border-white/10 text-white/30" : "border-gray-300 text-gray-400"}`}>
            {dark ? "Light" : "Dark"}
          </button>
        </div>
        <h1 className="font-[family-name:var(--font-cormorant)] text-xl sm:text-2xl font-light tracking-wider">How It All Works</h1>
        <p className={`mt-1 text-[10px] tracking-[0.25em] uppercase ${s1}`}>Plain English. No jargon. No BS.</p>
        <div className="flex gap-[2px] justify-center mt-3">
          {["#1B6B4A","#1A8B7A","#1E3A6E","#5B2D8E","#A61D3A","#C47A1A","#7BA31E"].map(c => (
            <span key={c} className="h-[2px] w-4 rounded-sm" style={{ background: c }} />
          ))}
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] max-w-md h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      </header>

      <div className="max-w-3xl mx-auto px-3 sm:px-5 pb-16">

        {/* ── Intro ────────────────────────── */}
        <div className="bg-[rgba(10,17,32,0.92)] border border-white/[0.04] rounded-2xl p-4 sm:p-5 mb-6">
          <p className="text-xs sm:text-sm text-white/50 leading-relaxed">
            This page explains everything PleoChrome does in plain language. No finance degree required.
            There are two sections: <strong className="text-white/70">How It Works</strong> (the 9-step process from stone to tokens)
            and the <strong className="text-white/70">Glossary</strong> (every term you'll encounter, explained simply).
            Tap any item to expand the full explanation.
          </p>
        </div>

        {/* ── How It Works ─────────────────── */}
        <h2 className="text-[10px] sm:text-xs tracking-[0.25em] uppercase text-[#1A8B7A] font-semibold mb-3 px-1">The 9-Step Process</h2>
        <p className="text-[10px] sm:text-xs text-white/30 mb-4 px-1">From physical stone to digital investment. Tap each step to learn more.</p>

        <div className="space-y-2 mb-10">
          {howItWorks.map(step => {
            const isOpen = expandedSteps.has(step.num);
            return (
              <div key={step.num} className="bg-[rgba(10,17,32,0.92)] border border-white/[0.04] rounded-xl overflow-hidden">
                <button onClick={() => toggleStep(step.num)} className="w-full flex items-center gap-3 p-3 sm:p-4 text-left hover:bg-white/[0.02] transition-colors">
                  <span className="text-xl sm:text-2xl shrink-0">{step.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-white/20">Step {step.num}</span>
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-white/70 mt-0.5">{step.title}</p>
                    <p className="text-[10px] sm:text-xs text-white/30 mt-0.5 italic">{step.analogy}</p>
                  </div>
                  <svg className={`w-4 h-4 shrink-0 transition-transform text-white/15 ${isOpen ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M6 9l6 6 6-6" /></svg>
                </button>
                <div className={`transition-all duration-400 overflow-hidden ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
                  <div className="px-4 sm:px-5 pb-4 pl-12 sm:pl-14">
                    <p className="text-[11px] sm:text-xs text-white/40 leading-[1.8]">{step.detail}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Glossary ─────────────────────── */}
        <h2 className="text-[10px] sm:text-xs tracking-[0.25em] uppercase text-[#C47A1A] font-semibold mb-3 px-1">Glossary — Every Term Explained</h2>
        <p className="text-[10px] sm:text-xs text-white/30 mb-3 px-1">Tap any term to expand the full explanation. Filter by category.</p>

        {/* Category Filters */}
        <div className="flex gap-1.5 flex-wrap mb-4">
          <button onClick={() => setFilterCat(null)}
            className={`text-[9px] sm:text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full border transition-colors ${!filterCat ? "border-white/20 text-white/60 bg-white/[0.05]" : "border-white/[0.06] text-white/25"}`}>
            All ({glossary.length})
          </button>
          {(Object.entries(categories) as [string, typeof categories.money][]).map(([key, cat]) => {
            const count = glossary.filter(t => t.category === key).length;
            return (
              <button key={key} onClick={() => setFilterCat(filterCat === key ? null : key)}
                className={`text-[9px] sm:text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full border transition-colors ${filterCat === key ? "bg-white/[0.05]" : ""}`}
                style={{ borderColor: filterCat === key ? cat.color + "50" : "rgba(255,255,255,0.04)", color: filterCat === key ? cat.color : "rgba(255,255,255,0.25)" }}>
                {cat.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Term Cards */}
        <div className="space-y-1.5">
          {filteredGlossary.map(term => {
            const isOpen = expandedTerms.has(term.word);
            const cat = categories[term.category];
            return (
              <div key={term.word} className="bg-[rgba(10,17,32,0.92)] border border-white/[0.04] rounded-xl overflow-hidden">
                <button onClick={() => toggleTerm(term.word)} className="w-full flex items-center gap-2.5 p-3 sm:p-3.5 text-left hover:bg-white/[0.02] transition-colors">
                  <span className="text-lg sm:text-xl shrink-0">{term.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs sm:text-sm font-semibold text-white/70">{term.word}</span>
                      <span className="text-[7px] sm:text-[8px] tracking-wider uppercase px-1.5 py-[1px] rounded" style={{ color: cat.color, background: cat.bg }}>{cat.label}</span>
                    </div>
                    <p className="text-[10px] sm:text-xs text-white/35 mt-0.5">{term.simple}</p>
                  </div>
                  <svg className={`w-3.5 h-3.5 shrink-0 transition-transform text-white/15 ${isOpen ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M6 9l6 6 6-6" /></svg>
                </button>
                <div className={`transition-all duration-400 overflow-hidden ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
                  <div className="px-4 sm:px-5 pb-4 pl-11 sm:pl-12">
                    <p className="text-[11px] sm:text-xs text-white/40 leading-[1.8]">{term.detail}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      <footer className="text-center py-8 border-t border-white/[0.03]">
        <div className="flex gap-[2px] justify-center mb-2">
          {["#1B6B4A","#1A8B7A","#1E3A6E","#5B2D8E","#A61D3A","#C47A1A","#7BA31E"].map(c => (
            <span key={c} className="h-[2px] w-4 rounded-sm" style={{ background: c }} />
          ))}
        </div>
        <p className="text-[10px] tracking-[0.15em] text-white/10">PleoChrome &mdash; Confidential</p>
      </footer>
    </div>
  );
}
