"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { PARTNER_STACKS, type PartnerStackInfo } from "@/lib/portal-data";

const PASSCODE = "pleo123";

export default function PartnerPrep() {
  const [unlocked, setUnlocked] = useState(false);
  const [dark, setDark] = useState(true);
  const [code, setCode] = useState("");
  const [err, setErr] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem("pleo-auth") === "true") setUnlocked(true);
      const saved = localStorage.getItem("pleo-dark");
      if (saved !== null) setDark(saved === "true");
    }
  }, []);

  const go = (e: React.FormEvent) => { e.preventDefault(); if (code === PASSCODE) { setUnlocked(true); localStorage.setItem("pleo-auth", "true"); } else { setErr(true); setTimeout(() => setErr(false), 1500); } };

  if (!unlocked) return (
    <div className="min-h-screen flex items-center justify-center bg-[#030712] px-4">
      <form onSubmit={go} className="text-center max-w-sm w-full">
        <Image src="/favicon.png" alt="" width={48} height={48} className="mx-auto mb-6 opacity-60" />
        <h1 className="font-[family-name:var(--font-cormorant)] text-2xl font-light text-white/80 mb-2">Partner Prep</h1>
        <p className="text-xs tracking-[0.2em] uppercase text-white/30 mb-8">Enter passcode</p>
        <input type="password" value={code} onChange={e => setCode(e.target.value)} placeholder="Passcode" autoFocus className={`w-full bg-white/[0.04] border rounded-xl px-5 py-3.5 text-sm text-white/80 placeholder:text-white/20 outline-none ${err ? "border-[#A61D3A]" : "border-white/[0.08] focus:border-white/20"}`} />
        <button type="submit" className="mt-4 w-full bg-gradient-to-r from-[#1A8B7A] to-[#1E3A6E] text-white text-xs tracking-[0.2em] uppercase py-3.5 rounded-xl">Enter</button>
      </form>
    </div>
  );

  const bg = dark ? "bg-[#030712]" : "bg-[#F8F9FA]";
  const tx = dark ? "text-[#FAFBFC]" : "text-[#1a1a1a]";
  const cd = dark ? "bg-[rgba(10,17,32,0.92)] border-white/[0.04]" : "bg-white border-gray-200 shadow-sm";
  const s1 = dark ? "text-white/25" : "text-gray-400";
  const s2 = dark ? "text-white/50" : "text-gray-600";
  const s3 = dark ? "text-white/70" : "text-gray-800";
  const dv = dark ? "border-white/[0.04]" : "border-gray-100";
  const hv = dark ? "hover:bg-white/[0.02]" : "hover:bg-gray-50";

  type QA = { q: string; why: string; ourAnswer?: string };

  /* ═══════════════════════════════════════════════════════
     Section 1: Platform Evaluation (16 Q&As — unchanged)
     ═══════════════════════════════════════════════════════ */
  const platformQuestions: QA[] = [
    { q: "What token standard do you deploy? (ERC-3643, ERC-7518, other?)", why: "We need a permissioned, compliance-embedded token standard suitable for US Reg D 506(c) securities. We are evaluating both ERC-3643 (Brickken) and ERC-7518 (Zoniqx).", ourAnswer: "We need a compliance token on Polygon with built-in KYC whitelisting, transfer restrictions, and institutional credibility. We're evaluating multiple standards." },
    { q: "Which tier should we start with for our first $10M offering?", why: "We need to understand entry-level pricing and whether it covers a ~$10M first offering. Our pipeline is $1B+.", ourAnswer: "We're starting with one $10M offering but our pipeline is $1B+. We want to understand the upgrade path as we scale." },
    { q: "Does your platform handle compliance for US Reg D 506(c) offerings?", why: "We need to know if the platform can enforce accredited investor requirements and transfer restrictions at the smart contract level.", ourAnswer: "We're offering exclusively under Reg D 506(c) to accredited investors. We need on-chain KYC whitelisting and transfer restrictions." },
    { q: "How does your KYC integration work? Is it included in the subscription?", why: "We need to understand KYC capacity, what providers are used, and whether it covers accredited investor verification.", ourAnswer: "We expect 50-200 investors across our first few offerings. We need KYC + accredited investor verification." },
    { q: "Can we connect Chainlink Proof of Reserve to gate the minting process?", why: "Oracle-gated minting is our key differentiator. The smart contract must check PoR before creating tokens.", ourAnswer: "We're integrating Chainlink PoR to verify vault custody. We need the mint function to check the oracle feed before executing." },
    { q: "Which blockchains do you support? Can we deploy on Polygon?", why: "We chose Polygon for low gas costs and institutional adoption.", ourAnswer: "Polygon is our target chain. Low gas, institutional adoption, Chainlink PoR available." },
    { q: "Are your smart contracts already audited? By whom?", why: "If pre-audited, we only need a config review ($3-5K), not a full audit ($50-100K).", ourAnswer: "We want to leverage pre-audited contracts to avoid the cost of a full custom audit." },
    { q: "How do you handle the cap table / shareholder registry?", why: "We need to know if the platform can serve as the transfer agent function via on-chain registry.", ourAnswer: "Per the SEC's January 2026 statement, blockchain can serve as the master securityholder file. Can your platform fulfill this role?" },
    { q: "What does the investor onboarding flow look like from their perspective?", why: "We need a smooth experience for accredited investors — not a crypto-native UX.", ourAnswer: "Our investors are high-net-worth individuals, not crypto natives. The onboarding needs to feel like a premium investment experience, not a DeFi app." },
    { q: "Can we white-label the investor-facing interface?", why: "We need PleoChrome branding, not the platform's branding, on what investors see.", ourAnswer: "Our brand is 'institutional luxury.' The investor portal needs to match our design system — navy + gem accents." },
    { q: "How do you handle dividend/distribution payments to token holders?", why: "If stones are ever sold or generate income, we need to distribute to holders.", ourAnswer: "We may need to distribute proceeds if a stone is redeemed or the offering is liquidated." },
    { q: "What's the process for secondary transfers between token holders?", why: "Need to understand how holder-to-holder transfers work within the compliance framework.", ourAnswer: "We need compliant secondary transfers — only between verified, accredited wallets." },
    { q: "What's your sandbox/testnet environment like? Can we test before going live?", why: "We must test everything before deploying real tokens with real investor money.", ourAnswer: "We want to run a complete end-to-end test: deploy, mint, transfer, block non-compliant, verify PoR gate — all on testnet first." },
    { q: "What does your pricing look like for our scale? $1B+ pipeline over 3-5 years?", why: "Need to understand volume pricing and whether there are per-token or per-offering fees beyond the subscription.", ourAnswer: "We have $1B+ in potential assets from multiple holders in Tacoma WA, Newport Beach CA, and Sarasota FL. We're starting with one $10M offering but expect to scale rapidly." },
    { q: "What ongoing support do you provide? Dedicated account manager?", why: "For our first offering, we'll need hands-on support.", ourAnswer: "This is our first tokenization. We need a partner who will walk us through the first deployment, not just hand us documentation." },
    { q: "Can you provide references from other US-based issuers who have done Reg D offerings on your platform?", why: "Social proof and validation that you've done this before in the US regulatory context.", ourAnswer: "We're building for US institutional credibility. We need to know you've successfully supported US Reg D offerings." },
  ];

  /* ═══════════════════════════════════════════════════════
     Section 2: Our Story (6 scripts — updated content)
     ═══════════════════════════════════════════════════════ */
  const whatWeTell: { topic: string; script: string }[] = [
    { topic: "Who We Are", script: "PleoChrome is the orchestration platform for unlocking value from high-value colored gemstones through three paths: Fractional Securities, Tokenization, and Debt Instruments. We have over $103 million in GIA-certified colored gemstones currently vaulted across our network. We coordinate every specialist in the pipeline — GIA for certification, independent appraisers for valuation, Brink's and Malca-Amit for custody, Chainlink for reserve verification, and tokenization platforms for digital securities. We don't hold stones, we don't hold investor money, and we don't give investment advice. We orchestrate the trust infrastructure that makes gemstone value creation possible." },
    { topic: "Our Pipeline", script: "We currently have 7 barrels of GIA-certified colored gemstones representing over $103 million in vaulted assets, with access to a broader pipeline exceeding $1 billion from multiple asset holders across Tacoma WA, Newport Beach CA, and Sarasota FL. Our first offering will be approximately $10 million in certified emeralds — a controlled proof-of-concept to validate the end-to-end process before scaling into the rest of the pipeline." },
    { topic: "Our Differentiator", script: "Four things make PleoChrome different: (1) Three Value Paths — Fractional Securities for simplicity, Tokenization (ERC-3643 or ERC-7518) for programmable compliance, and Debt Instruments for borrowing against verified assets. We're platform-agnostic, evaluating both Brickken and Zoniqx for tokenization. (2) The 3-Appraisal Rule — every stone gets three independent USPAP-compliant appraisals and we use the two lowest to set the offering price. Structurally conservative. (3) Oracle-gated minting via Chainlink Proof of Reserve — tokens physically cannot be created unless the oracle confirms vault custody. (4) The 7-Gate Framework — every asset passes through seven governance gates from sourcing through distribution, with documented go/no-go decisions at each stage." },
    { topic: "Our Team", script: "Shane Pierson — 20 years in financial services, SBA lending national sales manager, building the orchestration platform. Chris Ramsey — operations and legal strategy, decades of experience in capital markets. David Whiting — data engineering, MS in Statistics from Texas A&M, building the analytics and governance infrastructure." },
    { topic: "What We Need from Partners", script: "We need a distribution partner, not a vendor. On the BD/ATS side, we need: a registered broker-dealer to manage our Reg D 506(c) offerings, an ATS for compliant secondary trading, a registered transfer agent for cap table management, and ideally a white-label portal like RiMES so our investors see PleoChrome branding — not the partner's. On the tokenization side, we need: compliant security token deployment on Polygon, built-in KYC/accreditation verification, and Chainlink PoR integration for mint-gating. We're evaluating Rialto Markets for full-stack distribution and both Brickken and Zoniqx for tokenization." },
    { topic: "Our Timeline", script: "We want our first token deployed within 90-120 days. The legal structuring and appraisal process is already in motion. We need the tokenization platform configured and tested within the next 60 days so we're ready when the legal and custody gates clear." },
  ];

  /* ═══════════════════════════════════════════════════════
     Section 3: Universal Partner Questions (12 Q&As — unchanged)
     ═══════════════════════════════════════════════════════ */
  const genericPartnerQs: QA[] = [
    { q: "What services do you provide end-to-end?", why: "Understand scope — what's included vs. what we need elsewhere" },
    { q: "What are your certifications/licenses/registrations?", why: "Verify they're authorized to do what they claim" },
    { q: "What security certifications do you have? (SOC 2, ISO 27001?)", why: "We're handling $10M+ assets — security is non-negotiable" },
    { q: "Can you provide references from similar clients?", why: "Social proof from companies like ours" },
    { q: "What's your pricing structure? Any hidden fees?", why: "Full cost transparency" },
    { q: "What's your onboarding timeline?", why: "We need to move within 60-90 days" },
    { q: "What happens if we need to switch providers later?", why: "Data portability and lock-in risk" },
    { q: "What's your insurance coverage?", why: "E&O, cyber, professional liability" },
    { q: "Who would be our point of contact?", why: "Dedicated support vs. ticket queue" },
    { q: "What's your company's financial stability? Funding status?", why: "We can't build on a platform that might disappear" },
    { q: "Do you have an API? What documentation exists?", why: "We need programmatic integration for our governance engine" },
    { q: "What compliance frameworks do you support? US Reg D? EU MiCA?", why: "Multi-jurisdiction capability" },
  ];

  /* ═══════════════════════════════════════════════════════
     Section 4: Distribution Partner Evaluation (NEW — 14 Q&As)
     ═══════════════════════════════════════════════════════ */
  const distributionQuestions: QA[] = [
    { q: "What is your FINRA registration status and CRD number? Any regulatory actions or disclosures?", why: "Must verify active BD registration and clean regulatory history before any engagement.", ourAnswer: "We need a FINRA-registered BD with a clean record. We're building an institutional platform — any regulatory blemishes disqualify a partner." },
    { q: "Do you operate a registered ATS? What are your current trading volumes and number of listed securities?", why: "We need compliant secondary trading. Volume and liquidity matter for investor confidence.", ourAnswer: "Secondary liquidity is important to our investors. We need to understand how active your ATS is and what kind of securities trade on it." },
    { q: "Are you a registered transfer agent with the SEC? How do you handle cap table management and shareholder communications?", why: "Transfer agent function is critical for cap table integrity and regulatory compliance.", ourAnswer: "We need a registered TA that can maintain the master securityholder file — ideally with blockchain-native record-keeping per the SEC's January 2026 guidance." },
    { q: "Do you offer a white-label investor portal? Can we deploy under PleoChrome branding?", why: "Our brand is institutional luxury — investors must see PleoChrome, not the partner's brand.", ourAnswer: "Brand experience is critical. We're evaluating RiMES and similar platforms. Our investors need to see a PleoChrome-branded portal with our design language." },
    { q: "Walk us through your complete fee schedule: setup fees, monthly platform fees, per-transaction fees, and any percentage-based fees by exemption type.", why: "Full cost transparency is required for our financial model. Hidden fees are a deal-breaker.", ourAnswer: "We're modeling costs across multiple stack options. We need the complete fee picture — setup, monthly, per-transaction, and success-based fees — broken out by exemption type." },
    { q: "Do you have SOC 2 Type II certification? When was your last audit completed?", why: "We're handling $10M+ offerings with accredited investors. Security certifications are non-negotiable.", ourAnswer: "Our investors and their counsel will ask about security certifications. SOC 2 Type II is our minimum bar for any partner handling investor data or funds." },
    { q: "What is your company's financial stability? Funding runway? Revenue model?", why: "We're building a multi-year pipeline. We need partners that will be around for the long term.", ourAnswer: "We have a $1B+ pipeline over 3-5 years. We can't build critical infrastructure on a partner that might not be here in 18 months." },
    { q: "Which securities exemptions do you support? Reg D 506(b), 506(c), Reg A+, Reg CF, Reg S?", why: "We're starting with Reg D 506(c) but may expand to Reg A+ for broader access.", ourAnswer: "Our first offerings are Reg D 506(c) — accredited investors only. But we want a partner who can also support Reg A+ as we scale to retail." },
    { q: "Can you support international investors? What jurisdictions are covered?", why: "Some of our asset holders and potential investors are international.", ourAnswer: "We may have international accredited investors. We need to understand what KYC/AML and jurisdictional support you provide outside the US." },
    { q: "How do you integrate with external tokenization platforms? Can you work alongside Brickken, Zoniqx, or other token issuance platforms?", why: "We may use a separate tokenization layer. The distribution partner needs to work with our chosen token standard.", ourAnswer: "We're platform-agnostic on tokenization — evaluating both ERC-3643 (Brickken) and ERC-7518 (Zoniqx). Our distribution partner needs to integrate cleanly with whichever we choose." },
    { q: "What is your technology architecture? On-chain token registry vs. book-entry with blockchain settlement?", why: "Need to understand whether the partner uses true on-chain records or maintains a parallel off-chain system.", ourAnswer: "We prefer on-chain cap table management per SEC January 2026 guidance. We need to understand how your system reconciles with our Chainlink PoR oracle." },
    { q: "Do you offer volume discounts for multi-asset pipelines? What does pricing look like at 10, 50, 100+ offerings?", why: "Our pipeline is $1B+ across dozens of assets. We need to model costs at scale.", ourAnswer: "We're starting with one $10M offering but expect to scale rapidly — potentially dozens of offerings over 3-5 years. We need to understand how pricing evolves at volume." },
    { q: "What is your investor verification process? How do you handle accredited investor checks for 506(c)?", why: "506(c) requires 'reasonable steps' to verify accredited status — self-certification is not sufficient.", ourAnswer: "We need third-party verification of accredited investor status, not self-certification. How do you handle this, and which verification providers do you use?" },
    { q: "What does your investor onboarding flow look like end-to-end? From first click to funded subscription?", why: "Investor experience is a conversion driver. Complex onboarding kills deal flow.", ourAnswer: "Our investors are high-net-worth individuals buying into gemstone-backed securities. The onboarding experience needs to feel premium and simple — not like a compliance obstacle course." },
  ];

  /* ═══════════════════════════════════════════════════════
     Section 5: Lending Partner Evaluation (NEW — 12 Q&As)
     ═══════════════════════════════════════════════════════ */
  const lendingQuestions: QA[] = [
    { q: "What is your expertise with UCC Article 9 secured transactions? How do you handle filing and perfection for alternative asset collateral?", why: "Gemstone-backed lending requires UCC-1 filing expertise for non-traditional collateral. Improperly perfected liens are worthless.", ourAnswer: "Our collateral is GIA-certified colored gemstones held in institutional vaults. We need a lender who understands how to perfect a security interest in high-value movable goods under UCC Article 9." },
    { q: "In which jurisdictions do you hold lending licenses? Are there any exemptions you operate under?", why: "State-by-state licensing requirements vary. We need to know where we can operate.", ourAnswer: "Our asset holders are in Washington, California, and Florida. We need lending coverage in at least those states, with the ability to expand." },
    { q: "What collateral custody and monitoring infrastructure do you use or require?", why: "The lender needs confidence that collateral is secure, verified, and accessible for liquidation if needed.", ourAnswer: "Our stones are held at Brink's or Malca-Amit with Chainlink Proof of Reserve providing real-time verification. We need a lender comfortable with institutional vault custody and oracle-verified collateral." },
    { q: "What LTV ratios do you offer for alternative or luxury asset collateral? Specifically for gemstones?", why: "LTV directly impacts how much capital our holders can unlock. Industry ranges vary widely for non-traditional collateral.", ourAnswer: "We expect conservative LTVs — 40-60% against the appraised value using our 3-Appraisal Rule (average of two lowest). We need to understand your comfort level with gemstone collateral specifically." },
    { q: "What are your default and foreclosure procedures for alternative asset collateral?", why: "We need to understand the worst-case scenario — how quickly and through what process would collateral be liquidated?", ourAnswer: "Our holders need to understand the consequences of default before they borrow. Walk us through the timeline from first missed payment to collateral liquidation." },
    { q: "What servicing capabilities do you offer? Payment processing, escrow, investor reporting?", why: "If we're packaging debt instruments as securities, the servicing function is critical.", ourAnswer: "We may structure debt instruments as securities offered to investors. We need full-service loan servicing — payment collection, escrow management, and investor-grade reporting." },
    { q: "What interest rate structures do you offer? Fixed, variable, hybrid? How do you handle usury compliance across states?", why: "Rate structures affect investor returns and borrower economics. Usury laws vary by state.", ourAnswer: "We need competitive rates that work for both the borrower (asset holder) and potential debt instrument investors. We also need confidence that the rate structure complies with usury laws in WA, CA, and FL." },
    { q: "What are your minimum and maximum loan sizes? Is there a sweet spot for your operations?", why: "Our individual assets range from $1M to $50M+. We need to know if there's a floor or ceiling.", ourAnswer: "Our first loan would likely be $3-5M against a $10M asset. Over time, individual loans could range from $1M to $20M+. We need a partner comfortable across that range." },
    { q: "Do you have any experience with gemstone, precious metal, or luxury asset collateral?", why: "Gemstone lending is niche. A lender with experience in alternative luxury assets has a massive head start.", ourAnswer: "We understand that gemstone-backed lending is unusual. We're looking for a partner who has at minimum worked with precious metals, fine art, or other non-standard luxury collateral." },
    { q: "What insurance requirements do you impose on collateralized assets? Do you require the borrower to maintain separate coverage?", why: "Insurance is a critical component of the collateral protection framework.", ourAnswer: "Our stones carry full specie insurance through the vault (Brink's/Malca-Amit). We need to understand if additional coverage is required by the lender and how that cost is allocated." },
    { q: "Can you integrate with Chainlink Proof of Reserve for real-time collateral monitoring?", why: "Our oracle infrastructure provides continuous vault verification. A lending partner who can consume this data has a real-time view of collateral status.", ourAnswer: "We have Chainlink PoR set up to verify vault custody in real time. Can your systems consume an oracle feed to monitor collateral status automatically, rather than relying on periodic manual audits?" },
    { q: "How do you handle loan restructuring if collateral value changes significantly — either up or down?", why: "Gemstone values can appreciate or shift based on market conditions. We need flexibility.", ourAnswer: "If an asset appreciates significantly after the initial loan, we'd want to discuss releasing excess collateral or increasing the line. Conversely, we need to understand margin call procedures if values decline." },
  ];

  /* ═══════════════════════════════════════════════════════
     Section Definitions
     ═══════════════════════════════════════════════════════ */
  const sections = [
    { id: "platform", title: "Tokenization Platform Evaluation", subtitle: "16 questions for Brickken, Zoniqx, or any platform", color: "#1A8B7A", count: platformQuestions.length },
    { id: "distribution", title: "Distribution Partner Evaluation", subtitle: "14 questions for Rialto, Dalmore, or any BD/ATS", color: "#1E3A6E", count: distributionQuestions.length },
    { id: "lending", title: "Lending Partner Evaluation", subtitle: "12 questions for debt instrument partners", color: "#5B2D8E", count: lendingQuestions.length },
    { id: "ourStory", title: "What We Tell Partners", subtitle: "Scripted talking points about PleoChrome", color: "#1B6B4A", count: whatWeTell.length },
    { id: "stacks", title: "Partner Stack Options", subtitle: "4 stack configurations compared side-by-side", color: "#C47A1A", count: Object.keys(PARTNER_STACKS).length },
    { id: "generic", title: "Universal Partner Questions", subtitle: "Works for any partner meeting", color: "#A61D3A", count: genericPartnerQs.length },
  ];

  const fmt = (n: number) => n >= 1000 ? `$${(n / 1000).toFixed(0)}K` : `$${n}`;

  /* ═══════════════════════════════════════════════════════
     Shared QA Renderer
     ═══════════════════════════════════════════════════════ */
  const renderQASection = (title: string, subtitle: string, items: QA[], accentColor: string) => (
    <>
      <button onClick={() => setActiveSection(null)} className={`text-[10px] ${s1} flex items-center gap-1 mb-4 hover:${s2}`}>
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        Back to Hub
      </button>
      <div className={`${cd} border rounded-2xl p-4 sm:p-5 mb-4`}>
        <h2 className={`text-sm font-semibold ${s3} mb-1`}>{title}</h2>
        <p className={`text-[10px] ${s2} leading-relaxed`}>{subtitle}</p>
      </div>
      {items.map((qa, i) => (
        <details key={i} className={`${cd} border rounded-xl mb-2 overflow-hidden`}>
          <summary className={`flex items-start gap-2 p-3 sm:p-4 cursor-pointer ${hv} transition-colors`}>
            <span className="text-[10px] font-mono w-5 shrink-0 mt-0.5" style={{ color: accentColor }}>{i + 1}.</span>
            <span className={`text-xs sm:text-sm font-semibold ${s3} flex-1`}>{qa.q}</span>
          </summary>
          <div className={`px-4 sm:px-5 pb-4 pl-9 sm:pl-10 border-t ${dv}`}>
            <div className="mt-3">
              <p className={`text-[9px] tracking-wider uppercase ${s1} mb-1`}>Why We Ask This</p>
              <p className={`text-[11px] ${s2} leading-relaxed`}>{qa.why}</p>
            </div>
            {qa.ourAnswer && (
              <div className="mt-3">
                <p className="text-[9px] tracking-wider uppercase mb-1" style={{ color: accentColor }}>Our Talking Point</p>
                <p className={`text-[11px] ${s3} leading-relaxed italic`}>&ldquo;{qa.ourAnswer}&rdquo;</p>
              </div>
            )}
          </div>
        </details>
      ))}
    </>
  );

  return (
    <div className={`min-h-screen ${bg} ${tx} transition-colors duration-300`}>
      <header className="text-center pt-6 pb-5 sm:pt-10 sm:pb-7 relative px-4">
        <div className="flex items-center justify-center gap-2 mb-3">
          <a href="/portal" className={`text-[9px] sm:text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full border flex items-center gap-1 ${dark ? "border-white/10 text-white/30 hover:text-white/50" : "border-gray-300 text-gray-400 hover:text-gray-600"}`}>
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Portal
          </a>
          <Image src={dark ? "/logo-white.png" : "/logo.png"} alt="PleoChrome" width={160} height={40} className="opacity-50 h-5 sm:h-6 w-auto" />
          <button onClick={() => { setDark(!dark); localStorage.setItem("pleo-dark", String(!dark)); }}
            className={`text-[9px] sm:text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full border ${dark ? "border-white/10 text-white/30" : "border-gray-300 text-gray-400"}`}>
            {dark ? "Light" : "Dark"}
          </button>
        </div>
        <h1 className="font-[family-name:var(--font-cormorant)] text-lg sm:text-2xl font-light tracking-wider">Partner Meeting Prep</h1>
        <p className={`mt-1 text-[10px] tracking-[0.25em] uppercase ${s1}`}>Questions, Scripts, and Strategy</p>
      </header>

      <div className="max-w-4xl mx-auto px-3 sm:px-5 pb-16">

        {/* Hub */}
        {!activeSection && (
          <>
            <div className={`${cd} border rounded-2xl p-4 sm:p-5 mb-5`}>
              <p className={`text-xs sm:text-sm ${s2} leading-relaxed`}>
                Use this before ANY partner meeting. It has: evaluation questions for tokenization platforms
                (Brickken, Zoniqx, or others), distribution partners (Rialto, Dalmore), lending partners,
                scripted talking points about PleoChrome&apos;s three value paths, partner stack comparisons,
                and a universal question set that works for any partner (appraisers, vaults, broker-dealers, attorneys).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {sections.map(sec => (
                <button key={sec.id} onClick={() => { setActiveSection(sec.id); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className={`w-full ${cd} border rounded-2xl p-4 sm:p-5 flex items-center gap-3 text-left ${hv} transition-colors group`}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-sm" style={{ background: sec.color }}>
                    {sec.count}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold ${s3} truncate`}>{sec.title}</p>
                    <p className={`text-[10px] ${s1} truncate`}>{sec.subtitle}</p>
                  </div>
                  <svg className={`w-4 h-4 ${s1} group-hover:translate-x-1 transition-transform shrink-0`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Platform Evaluation */}
        {activeSection === "platform" && renderQASection(
          "Tokenization Platform — Evaluation Playbook",
          "Ask these questions in order. For each one, there\u2019s a \u201cWhy We Ask\u201d (your internal reason) and \u201cOur Answer\u201d (what to say when they ask us the same topic). Tap each to expand.",
          platformQuestions,
          "#1A8B7A",
        )}

        {/* Distribution Partner Evaluation */}
        {activeSection === "distribution" && renderQASection(
          "Distribution Partner — Evaluation Playbook",
          "For evaluating broker-dealers, ATS operators, and transfer agents (Rialto Markets, Dalmore Group, etc.). Covers FINRA registration, ATS capabilities, white-label portals, fees, and integration with our tokenization layer.",
          distributionQuestions,
          "#1E3A6E",
        )}

        {/* Lending Partner Evaluation */}
        {activeSection === "lending" && renderQASection(
          "Lending Partner — Evaluation Playbook",
          "For evaluating debt instrument partners. Covers UCC Article 9, collateral custody, LTV ratios, servicing capabilities, and integration with Chainlink PoR for real-time collateral monitoring.",
          lendingQuestions,
          "#5B2D8E",
        )}

        {/* Our Story */}
        {activeSection === "ourStory" && (
          <>
            <button onClick={() => setActiveSection(null)} className={`text-[10px] ${s1} flex items-center gap-1 mb-4`}>
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Back to Hub
            </button>
            <div className={`${cd} border rounded-2xl p-4 sm:p-5 mb-4`}>
              <h2 className={`text-sm font-semibold ${s3} mb-1`}>What We Tell Partners About PleoChrome</h2>
              <p className={`text-[10px] ${s2}`}>Memorize these talking points. They make you sound like you&apos;ve been doing this for years.</p>
            </div>
            {whatWeTell.map((item, i) => (
              <div key={i} className={`${cd} border rounded-xl p-4 sm:p-5 mb-3`}>
                <p className="text-[9px] tracking-wider uppercase text-[#1B6B4A] mb-2 font-semibold">{item.topic}</p>
                <p className={`text-xs sm:text-sm ${s3} leading-[1.8] italic`}>&ldquo;{item.script}&rdquo;</p>
              </div>
            ))}
          </>
        )}

        {/* Partner Stack Comparison */}
        {activeSection === "stacks" && (
          <>
            <button onClick={() => setActiveSection(null)} className={`text-[10px] ${s1} flex items-center gap-1 mb-4`}>
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Back to Hub
            </button>
            <div className={`${cd} border rounded-2xl p-4 sm:p-5 mb-4`}>
              <h2 className={`text-sm font-semibold ${s3} mb-1`}>Partner Stack Comparison</h2>
              <p className={`text-[10px] ${s2} leading-relaxed`}>
                Four configurations we&apos;re evaluating. Each stack trades off simplicity (fewer partners) against flexibility (best-of-breed components).
                Costs shown are estimates based on published pricing and initial conversations.
              </p>
            </div>

            {(Object.entries(PARTNER_STACKS) as [string, PartnerStackInfo][]).map(([key, stack]) => (
              <details key={key} className={`${cd} border rounded-xl mb-3 overflow-hidden`}>
                <summary className={`flex items-start gap-3 p-4 sm:p-5 cursor-pointer ${hv} transition-colors`}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-xs bg-[#C47A1A]">
                    {stack.shortLabel.split(" ")[0]?.charAt(0) ?? "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold ${s3}`}>{stack.label}</p>
                    <p className={`text-[10px] ${s2} mt-0.5`}>{stack.description}</p>
                    <div className="flex gap-3 mt-2">
                      <span className={`text-[10px] ${s1}`}>Setup: <span className={`font-semibold ${s3}`}>{fmt(stack.setupCost)}</span></span>
                      <span className={`text-[10px] ${s1}`}>Annual: <span className={`font-semibold ${s3}`}>{fmt(stack.annualCost)}/yr</span></span>
                    </div>
                  </div>
                  <svg className={`w-4 h-4 ${s1} shrink-0 mt-1`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M6 9l6 6 6-6"/></svg>
                </summary>
                <div className={`border-t ${dv} px-4 sm:px-5 pb-4`}>
                  <div className="mt-3">
                    <p className={`text-[9px] tracking-wider uppercase ${s1} mb-2`}>Components</p>
                    <div className="space-y-2">
                      {stack.components.map((comp, ci) => (
                        <div key={ci} className={`flex items-start justify-between gap-2 py-1.5 ${ci > 0 ? `border-t ${dv}` : ""}`}>
                          <div className="flex-1 min-w-0">
                            <p className={`text-[11px] font-semibold ${s3}`}>{comp.role}</p>
                            <p className={`text-[10px] ${s2}`}>{comp.provider}</p>
                          </div>
                          <p className={`text-[10px] font-mono ${s2} shrink-0`}>{comp.cost}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </details>
            ))}
          </>
        )}

        {/* Generic */}
        {activeSection === "generic" && renderQASection(
          "Universal Partner Interview Questions",
          "Use these for ANY partner: appraisers, vaults, broker-dealers, attorneys, tech partners.",
          genericPartnerQs,
          "#A61D3A",
        )}

      </div>

      <footer className={`text-center py-6 border-t ${dv}`}>
        <p className={`text-[9px] tracking-[0.15em] ${s1}`}>PleoChrome &mdash; Confidential</p>
      </footer>
    </div>
  );
}
