"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import {
  ShieldCheck,
  FileCheck2,
  Gem,
  Lock,
  Building2,
  Link2,
  Users,
  Layers,
  Hexagon,
  Landmark,
  BadgeCheck,
  ArrowRight,
  Handshake,
} from "lucide-react";
import { ShaderAnimation } from "@/components/ui/shader-animation";
import { cn } from "@/lib/utils";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "motion/react";

/* ═══════════════════════════════════════════════════════
   PleoChrome Landing Page
   "Value from Every Angle"
   ═══════════════════════════════════════════════════════ */

// ── Workflow step type ───────────────────────

interface WorkflowStep {
  title: string;
  description: string;
  compliance: string;
  partner?: string;
  icon: React.ReactNode;
}

// ── Five Paths data ──────────────────────────

const paths = [
  {
    id: "fractional",
    icon: <Layers className="h-5 w-5" />,
    title: "Fractional Securities",
    tagline: "Divide and Distribute",
    color: "#1B6B4A",
    description:
      "Split a high-value asset into affordable, SEC-compliant fractional shares. Lower minimums open the door to a broader investor base while maintaining full regulatory compliance.",
    steps: [
      {
        title: "Asset Intake & Verification",
        description: "KYC/KYB on every asset holder. Full provenance chain verified from mine to present. OFAC sanctions and PEP screening. Clear title and legal transferability confirmed.",
        compliance: "BSA/AML \u00b7 OFAC \u00b7 Kimberley Process",
        icon: <ShieldCheck className="h-4 w-4" />,
      },
      {
        title: "Independent Certification & Valuation",
        description: "GIA-certified lab grading with origin determination. Three independent USPAP-compliant appraisals. Two-lowest average defines offering value \u2014 structurally conservative, investor-protective.",
        compliance: "USPAP \u00b7 FTC Jewelry Guides",
        partner: "GIA",
        icon: <Gem className="h-4 w-4" />,
      },
      {
        title: "Institutional Custody",
        description: "Segregated storage at an institutional-grade vault with active specie insurance. Insured chain-of-custody transport. Real-time inventory verification protocols.",
        compliance: "Bailee Standards \u00b7 Lloyd\u2019s Coverage",
        partner: "Brink\u2019s",
        icon: <Lock className="h-4 w-4" />,
      },
      {
        title: "SPV Formation & Unit Structuring",
        description: "Dedicated Series LLC per asset. Offering divided into fractional units with defined rights and obligations. Operating agreement, PPM, and subscription documents drafted by securities counsel.",
        compliance: "SEC Reg D 506(c) \u00b7 State Blue Sky",
        icon: <Building2 className="h-4 w-4" />,
      },
      {
        title: "Securities Filing & Distribution",
        description: "Form D filed with SEC within 15 days of first sale. Accredited investor onboarding with verification, sanctions screening, and subscription processing. General solicitation permitted under 506(c).",
        compliance: "Form D \u00b7 Accredited Verification",
        icon: <Users className="h-4 w-4" />,
      },
      {
        title: "Ongoing Management & Reporting",
        description: "Quarterly NAV updates and investor communications. Annual independent re-appraisal. K-1 tax distribution. Compliance monitoring and regulatory filings maintained throughout the asset lifecycle.",
        compliance: "Annual Audit \u00b7 K-1 \u00b7 Form D Amendment",
        icon: <FileCheck2 className="h-4 w-4" />,
      },
    ] as WorkflowStep[],
  },
  {
    id: "tokenization",
    icon: <Hexagon className="h-5 w-5" />,
    title: "Tokenization",
    tagline: "Programmable Ownership",
    color: "#1A8B7A",
    description:
      "Convert full asset value into ERC-3643 security tokens on Polygon. Compliance is embedded at the smart contract level \u2014 every transfer is validated before execution. Settlement in seconds, not days.",
    steps: [
      {
        title: "Asset Intake & Verification",
        description: "KYC/KYB on every asset holder. Full provenance chain verified from mine to present. OFAC sanctions and PEP screening. Clear title and legal transferability confirmed.",
        compliance: "BSA/AML \u00b7 OFAC \u00b7 Kimberley Process",
        icon: <ShieldCheck className="h-4 w-4" />,
      },
      {
        title: "Independent Certification & Valuation",
        description: "GIA-certified lab grading with origin determination. Three independent USPAP-compliant appraisals. Two-lowest average defines offering value \u2014 structurally conservative, investor-protective.",
        compliance: "USPAP \u00b7 FTC Jewelry Guides",
        partner: "GIA",
        icon: <Gem className="h-4 w-4" />,
      },
      {
        title: "Institutional Custody",
        description: "Segregated storage at an institutional-grade vault with active specie insurance. Insured chain-of-custody transport. Real-time inventory verification protocols.",
        compliance: "Bailee Standards \u00b7 Lloyd\u2019s Coverage",
        partner: "Brink\u2019s",
        icon: <Lock className="h-4 w-4" />,
      },
      {
        title: "Legal Structuring & SEC Filing",
        description: "Dedicated SPV (Series LLC) per asset. PPM, subscription agreement, and securities opinion drafted by counsel. Form D filed with SEC. Blue Sky notices in applicable states.",
        compliance: "SEC Reg D 506(c) \u00b7 Blue Sky",
        icon: <Building2 className="h-4 w-4" />,
      },
      {
        title: "Token Deployment & Smart Contract Audit",
        description: "ERC-3643 compliant security token deployed on Polygon. Built-in KYC, accreditation, and jurisdiction controls enforced at the protocol level. Smart contract independently audited before mainnet.",
        compliance: "ERC-3643 \u00b7 Transfer Restrictions",
        icon: <Hexagon className="h-4 w-4" />,
      },
      {
        title: "Oracle-Verified Reserves",
        description: "Chainlink Proof of Reserve connects physical vault inventory to on-chain records in real time. Token minting is programmatically blocked unless reserves are independently confirmed.",
        compliance: "On-Chain Attestation",
        partner: "Chainlink",
        icon: <Link2 className="h-4 w-4" />,
      },
      {
        title: "Investor Distribution",
        description: "Accredited investor onboarding with KYC, verification, and sanctions screening. Tokens minted only upon confirmed and funded subscription. General solicitation permitted under 506(c).",
        compliance: "KYC/AML \u00b7 Accredited Verification",
        icon: <Users className="h-4 w-4" />,
      },
    ] as WorkflowStep[],
  },
  {
    id: "debt",
    icon: <Landmark className="h-5 w-5" />,
    title: "Debt Instruments",
    tagline: "Borrow Against Value",
    color: "#1E3A6E",
    description:
      "Use verified, vaulted gemstones as collateral for asset-backed loans. The holder retains full ownership while unlocking immediate capital. The fastest path from asset to liquidity.",
    steps: [
      {
        title: "Borrower Intake & Verification",
        description: "KYC/KYB on the borrower and all beneficial owners. Financial capacity assessment. OFAC sanctions and PEP screening. Asset provenance and clear title confirmed.",
        compliance: "BSA/AML \u00b7 OFAC \u00b7 Kimberley Process",
        icon: <ShieldCheck className="h-4 w-4" />,
      },
      {
        title: "Independent Certification & LTV Determination",
        description: "GIA-certified lab grading with origin determination. Three independent USPAP-compliant appraisals. Loan-to-value ratio set conservatively at 50\u201370% of the two-lowest average.",
        compliance: "USPAP \u00b7 FTC Jewelry Guides",
        partner: "GIA",
        icon: <Gem className="h-4 w-4" />,
      },
      {
        title: "Custody & Collateral Perfection",
        description: "Gemstones transferred to institutional vault under segregated custody. UCC-1 financing statement filed to perfect the security interest. Collateral insured throughout the loan term.",
        compliance: "UCC Article 9 \u00b7 Bailee Standards",
        partner: "Brink\u2019s",
        icon: <Lock className="h-4 w-4" />,
      },
      {
        title: "Loan Structuring & Documentation",
        description: "Terms, rate, and maturity defined. Security agreement, promissory note, and guaranty drafted by counsel. Borrower representations and covenants documented.",
        compliance: "State Lending Regulations \u00b7 Usury Laws",
        icon: <Building2 className="h-4 w-4" />,
      },
      {
        title: "Capital Deployment",
        description: "Lender matching or participation note offering under Reg D 506(c). Funds disbursed to borrower upon executed documentation. Loan activated and servicing begins.",
        compliance: "Reg D 506(c) if participation notes",
        icon: <Landmark className="h-4 w-4" />,
      },
      {
        title: "Servicing, Maturity & Release",
        description: "Payment collection, compliance monitoring, and quarterly reporting throughout the loan term. Upon maturity: payoff confirmed, collateral released, UCC termination filed.",
        compliance: "Ongoing Servicing \u00b7 UCC Termination",
        icon: <FileCheck2 className="h-4 w-4" />,
      },
    ] as WorkflowStep[],
  },
  {
    id: "broker",
    icon: <Handshake className="h-5 w-5" />,
    title: "Broker Sale",
    tagline: "Identify, Negotiate, Close",
    color: "#C47A1A",
    description:
      "When a buyer is identified or the asset has strong market demand, a direct sale through regulated broker-dealer channels is the fastest path to value. No fractionalization, no token creation. Clean exit.",
    steps: [
      {
        title: "Asset Appraisal & Packaging",
        description: "Independent valuation with GIA certification and market comparables analysis. Professional offering materials prepared for qualified buyers.",
        compliance: "USPAP · FTC Jewelry Guides",
        icon: <Gem className="h-4 w-4" />,
      },
      {
        title: "Broker-Dealer Engagement",
        description: "Engage a SEC/FINRA-registered broker-dealer with expertise in the relevant asset class. Broker manages buyer identification, qualification, and negotiation.",
        compliance: "SEC · FINRA Registration",
        icon: <ShieldCheck className="h-4 w-4" />,
      },
      {
        title: "Buyer Qualification & Escrow",
        description: "Buyer verified as accredited or qualified. Purchase agreement executed. Funds placed in escrow. Custody transfer arranged through bonded logistics.",
        compliance: "KYC/AML · Escrow Standards",
        icon: <Lock className="h-4 w-4" />,
      },
      {
        title: "Settlement & Transfer",
        description: "Final inspection, ownership transfer, and settlement. All regulatory filings completed. Clean title delivered. Proceeds disbursed.",
        compliance: "UCC Transfer · Tax Reporting",
        icon: <FileCheck2 className="h-4 w-4" />,
      },
    ] as WorkflowStep[],
  },
  {
    id: "barter",
    icon: <Building2 className="h-5 w-5" />,
    title: "Barter Exchange",
    tagline: "Trade Asset for Asset",
    color: "#5B2D8E",
    description:
      "When cash buyers are scarce or tax-advantaged structures apply, a structured asset-for-asset exchange lets holders swap value directly. Both sides get what they need without the friction of liquidation.",
    steps: [
      {
        title: "Asset Valuation (Both Sides)",
        description: "Independent appraisal of both assets in the exchange. Both parties must agree on fair market values before proceeding. Multiple appraisals for high-value items.",
        compliance: "USPAP · IRS Fair Market Value",
        icon: <Gem className="h-4 w-4" />,
      },
      {
        title: "Exchange Agreement & Structure",
        description: "Formal exchange contract documenting asset descriptions, agreed valuations, representations, warranties, conditions, and closing mechanics. Legal review by both parties.",
        compliance: "Contract Law · IRC Section 1031 (if applicable)",
        icon: <ShieldCheck className="h-4 w-4" />,
      },
      {
        title: "Intermediary & Custody",
        description: "Qualified intermediary facilitates the exchange. Both assets placed in custody or escrow. Simultaneous or staged closing arranged based on logistics.",
        compliance: "Escrow Standards · Custody Protocols",
        icon: <Lock className="h-4 w-4" />,
      },
      {
        title: "Transfer & Tax Reporting",
        description: "Simultaneous transfer of both assets. IRS Form 8824 filed for like-kind exchanges where applicable. Fair market value of received property reported as required.",
        compliance: "IRS Reporting · State Tax Compliance",
        icon: <FileCheck2 className="h-4 w-4" />,
      },
    ] as WorkflowStep[],
  },
];

// ── Gem accent colors ────────────────────────

const gemColors = [
  "bg-[#1B6B4A]",
  "bg-[#1A8B7A]",
  "bg-[#1E3A6E]",
  "bg-[#5B2D8E]",
  "bg-[#A61D3A]",
  "bg-[#C47A1A]",
  "bg-[#7BA31E]",
];

// ── Shared spring config ─────────────────────

const springTab = { type: "spring" as const, stiffness: 400, damping: 30 };
const easeSmooth = [0.25, 0.1, 0.25, 1] as const;

// ── Hero Section ─────────────────────────────

function HeroSection() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 600),
      setTimeout(() => setStage(2), 1800),
      setTimeout(() => setStage(3), 2800),
      setTimeout(() => setStage(4), 4000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      <ShaderAnimation />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 z-[1]" />

      {/* Top bar — navigation */}
      <nav className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-4">
        <span />
        <div className="flex items-center gap-3">
          <a href="/about"
            className="hidden sm:inline-flex items-center px-4 py-2 text-xs tracking-[0.15em] uppercase text-white/50 hover:text-white transition-colors duration-300">
            About
          </a>
          <a href="/knowledge"
            className="hidden sm:inline-flex items-center px-4 py-2 text-xs tracking-[0.15em] uppercase text-white/50 hover:text-white transition-colors duration-300">
            Knowledge
          </a>
          <a href="/login"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs tracking-[0.15em] uppercase text-white/70 hover:text-white border border-white/10 hover:border-white/25 bg-white/[0.04] hover:bg-white/[0.08] backdrop-blur-sm transition-all duration-300">
            Sign In
          </a>
        </div>
      </nav>

      <div className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 w-full">
        <div className={cn(
          "transition-all duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] w-full flex justify-center",
          stage >= 1 ? "opacity-100 scale-100" : "opacity-0 scale-[0.85]"
        )}>
          <Image src="/logo-white.png" alt="PleoChrome" width={840} height={200} priority
            className="max-w-[85vw] sm:max-w-[75vw] md:w-[760px] lg:w-[840px] h-auto drop-shadow-[0_0_40px_rgba(26,139,122,0.15)]" />
        </div>

        <p className={cn(
          "text-[11px] sm:text-sm md:text-base tracking-[0.2em] sm:tracking-[0.35em] uppercase text-white/50 mt-8 sm:mt-10 transition-all duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)]",
          stage >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        )}>
          Value from Every Angle
        </p>

        <h1 className={cn(
          "font-display font-light text-white/80 mt-4 sm:mt-5 transition-all duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)]",
          "text-lg sm:text-xl md:text-2xl lg:text-[1.75rem] tracking-[0.02em] max-w-2xl leading-relaxed",
          stage >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        )}>
          The orchestration platform that unlocks fractional ownership,
          tokenized securities, and asset-backed lending for high-value gemstones.
        </h1>

        <div className={cn(
          "gem-bar mt-6 sm:mt-8 w-32 sm:w-48 transition-all duration-[1s] ease-[cubic-bezier(0.16,1,0.3,1)]",
          stage >= 3 ? "opacity-100" : "opacity-0"
        )}>
          <span className="bg-[#1B6B4A]" /><span className="bg-[#1A8B7A]" /><span className="bg-[#1E3A6E]" />
          <span className="bg-[#5B2D8E]" /><span className="bg-[#A61D3A]" /><span className="bg-[#C47A1A]" /><span className="bg-[#7BA31E]" />
        </div>

        <div className={cn(
          "mt-8 sm:mt-12 transition-all duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)]",
          stage >= 4 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <div className="flex items-center gap-4">
            <a href="#paths" className="group relative inline-flex items-center gap-2 sm:gap-3 border border-white/15 rounded-full px-6 py-3 sm:px-8 sm:py-3.5
              text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] uppercase text-white/70 hover:text-white
              bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-sm
              transition-all duration-500 hover:border-white/25 hover:shadow-[0_0_30px_rgba(26,139,122,0.1)]">
              <span>Explore the Paths</span>
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
              </svg>
            </a>
            <a href="/login" className="inline-flex items-center gap-2 rounded-full px-6 py-3 sm:px-8 sm:py-3.5
              text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] uppercase text-white
              bg-[#1A8B7A]/80 hover:bg-[#1A8B7A] backdrop-blur-sm
              transition-all duration-500 shadow-[0_0_20px_rgba(26,139,122,0.2)] hover:shadow-[0_0_30px_rgba(26,139,122,0.4)]">
              <span>Team Login</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className={cn("w-[1px] h-12 bg-gradient-to-b from-transparent to-white/20 transition-opacity duration-1000", stage >= 4 ? "opacity-100" : "opacity-0")} />
      </div>
    </section>
  );
}

// ── Intro Section ────────────────────────────

function IntroSection() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    const el = document.getElementById("intro");
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="intro" className="relative py-20 sm:py-32 md:py-40 vault-texture">
      <div className="relative z-10 max-w-3xl mx-auto px-5 sm:px-6 text-center">
        <p className={cn(
          "text-[10px] sm:text-xs tracking-[0.3em] sm:tracking-[0.4em] uppercase text-[#1A8B7A] mb-4 sm:mb-6 transition-all duration-700",
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>What We Do</p>
        <h2 className={cn(
          "font-display text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-light leading-[1.3] sm:leading-[1.25] text-white/90 transition-all duration-1000 delay-200",
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        )}>
          One asset. Five paths to value.
          PleoChrome orchestrates them all.
        </h2>
        <p className={cn(
          "mt-5 sm:mt-6 text-sm sm:text-base text-white/40 max-w-xl mx-auto leading-relaxed transition-all duration-700 delay-400",
          visible ? "opacity-100" : "opacity-0"
        )}>
          Whether you choose fractional ownership, full tokenization, or
          asset-backed lending &mdash; we coordinate every specialist,
          every gate, and every compliance requirement from intake to capital.
        </p>
        <div className={cn("gem-bar mt-10 w-32 mx-auto transition-all duration-700 delay-500", visible ? "opacity-100" : "opacity-0")}>
          <span className="bg-[#1B6B4A]" /><span className="bg-[#1A8B7A]" /><span className="bg-[#1E3A6E]" />
          <span className="bg-[#5B2D8E]" /><span className="bg-[#A61D3A]" /><span className="bg-[#C47A1A]" /><span className="bg-[#7BA31E]" />
        </div>
      </div>
    </section>
  );
}

// ── Interactive Paths + Workflow Section ──────

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const stepVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: easeSmooth },
  },
};

function PathsSection() {
  const [visible, setVisible] = useState(false);
  const [activePath, setActivePath] = useState(0);
  const [direction, setDirection] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start center", "end center"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.05 }
    );
    const el = document.getElementById("paths");
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handlePathChange = useCallback((index: number) => {
    if (index !== activePath) {
      setDirection(index > activePath ? 1 : -1);
      setActivePath(index);
    }
  }, [activePath]);

  const active = paths[activePath];

  return (
    <section id="paths" className="relative py-20 sm:py-28 md:py-36">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] max-w-4xl h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="text-center mb-12 md:mb-16">
          <p className={cn(
            "text-xs tracking-[0.4em] uppercase text-[#C47A1A] mb-4 transition-all duration-700",
            visible ? "opacity-100" : "opacity-0"
          )}>Three Levels of Value Creation</p>
          <h2 className={cn(
            "font-display text-3xl md:text-4xl lg:text-5xl font-light text-white/90 transition-all duration-1000 delay-100",
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          )}>Choose Your Path</h2>
          <p className={cn(
            "mt-5 text-sm sm:text-base md:text-lg text-white/40 max-w-2xl mx-auto leading-relaxed transition-all duration-700 delay-300",
            visible ? "opacity-100" : "opacity-0"
          )}>
            Every verified gemstone can unlock value in multiple ways. Select a path
            to explore the complete orchestration workflow.
          </p>
        </div>

        {/* Pill bar tab selector */}
        <div className={cn(
          "flex justify-center mb-12 md:mb-16 transition-all duration-700 delay-200",
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        )}>
          <div className="inline-flex bg-white/[0.03] border border-white/[0.06] rounded-full p-1 sm:p-1.5">
            {paths.map((path, i) => (
              <button
                key={path.id}
                onClick={() => handlePathChange(i)}
                className={cn(
                  "relative flex items-center gap-2 sm:gap-2.5 rounded-full px-4 py-2.5 sm:px-6 sm:py-3 transition-colors duration-300 cursor-pointer",
                  "text-[10px] sm:text-xs tracking-[0.15em] uppercase font-medium",
                  activePath === i ? "text-white" : "text-white/35 hover:text-white/55"
                )}
              >
                {/* Sliding active indicator */}
                {activePath === i && (
                  <motion.div
                    layoutId="activePathPill"
                    className="absolute inset-0 rounded-full border border-white/[0.1]"
                    style={{ backgroundColor: `${path.color}20` }}
                    transition={springTab}
                  />
                )}

                {/* Dot + label */}
                <span className="relative z-10 flex items-center gap-2 sm:gap-2.5">
                  <span
                    className="w-2 h-2 rounded-full transition-all duration-300 shrink-0"
                    style={{
                      backgroundColor: activePath === i ? path.color : "rgba(255,255,255,0.15)",
                      boxShadow: activePath === i ? `0 0 8px ${path.color}40` : "none",
                    }}
                  />
                  <span className="hidden sm:inline">{path.title}</span>
                  <span className="sm:hidden">{path.title.split(" ")[0]}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Animated workflow content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, x: direction * 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -20 }}
            transition={{ duration: 0.3, ease: easeSmooth }}
          >
            {/* Path description */}
            <p className="text-center text-[15px] sm:text-base text-white/45 max-w-2xl mx-auto leading-relaxed mb-12 md:mb-16">
              {active.description}
            </p>

            {/* Timeline */}
            <div ref={timelineRef} className="relative max-w-3xl mx-auto">
              {/* Scroll-linked vertical line */}
              <motion.div
                className="absolute left-[15px] sm:left-[23px] top-3 bottom-3 w-px origin-top"
                style={{
                  background: `linear-gradient(to bottom, transparent, ${active.color}50 8%, ${active.color}50 92%, transparent)`,
                  scaleY: lineScale,
                }}
              />

              {/* Steps */}
              <motion.div
                className="space-y-2"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {active.steps.map((step, i) => (
                  <motion.div
                    key={`${active.id}-step-${i}`}
                    variants={stepVariants}
                    className="relative flex gap-6 sm:gap-10 group"
                  >
                    {/* Timeline node */}
                    <div className="relative shrink-0 flex flex-col items-center pt-1 z-10">
                      {/* Glow ring */}
                      <div
                        className="absolute w-7 h-7 sm:w-8 sm:h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -top-0.5 sm:-top-0.5"
                        style={{
                          background: `radial-gradient(circle, ${active.color}25, transparent 70%)`,
                          left: "50%",
                          transform: "translateX(-50%)",
                        }}
                      />
                      {/* Dot */}
                      <div
                        className="w-[11px] h-[11px] sm:w-[13px] sm:h-[13px] rounded-full border-2 transition-all duration-200 group-hover:scale-[1.35]"
                        style={{
                          borderColor: active.color,
                          backgroundColor: `${active.color}30`,
                        }}
                      />
                    </div>

                    {/* Step content — editorial floating text */}
                    <div className="flex-1 pb-10 sm:pb-12">
                      <p
                        className="text-[10px] tracking-[0.2em] uppercase font-medium mb-1.5"
                        style={{ color: `${active.color}90` }}
                      >
                        Step {String(i + 1).padStart(2, "0")}
                      </p>
                      <h3 className="text-base sm:text-lg font-semibold tracking-tight text-white/85 group-hover:text-white transition-colors duration-300 mb-2">
                        {step.title}
                      </h3>
                      <p className="text-sm text-white/40 leading-relaxed mb-4 max-w-xl">
                        {step.description}
                      </p>

                      {/* Tags — stagger after content */}
                      <motion.div
                        className="flex flex-wrap gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.15 + i * 0.08, duration: 0.4 }}
                      >
                        <span className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.12em] uppercase px-2.5 py-1 rounded-full border border-white/[0.06] bg-white/[0.02] text-white/30">
                          <BadgeCheck className="w-3 h-3" />
                          {step.compliance}
                        </span>
                        {step.partner && (
                          <span
                            className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.12em] uppercase px-2.5 py-1 rounded-full border"
                            style={{
                              borderColor: `${active.color}30`,
                              backgroundColor: `${active.color}08`,
                              color: `${active.color}cc`,
                            }}
                          >
                            <Handshake className="w-3 h-3" />
                            {step.partner}
                          </span>
                        )}
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Bottom note */}
        <motion.div
          className="mt-14 md:mt-20 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: visible ? 1 : 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-3 rounded-full border border-white/[0.06] bg-white/[0.02] px-6 py-3">
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-full bg-[#1B6B4A]" />
              <span className="w-2 h-2 rounded-full bg-[#1A8B7A]" />
              <span className="w-2 h-2 rounded-full bg-[#1E3A6E]" />
            </div>
            <span className="text-xs sm:text-sm tracking-wide text-white/40">
              All paths share the same institutional verification infrastructure
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Value Proposition Section ────────────────

function ValueSection() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    const el = document.getElementById("value");
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const pillars = [
    {
      label: "Institutional Orchestration",
      text: "Every function \u2014 gemological certification, independent appraisal, vault custody, legal structuring, and capital deployment \u2014 is handled by a licensed, best-in-class specialist.",
    },
    {
      label: "Oracle-Verified Reserves",
      text: "Chainlink Proof of Reserve connects physical vault inventory to on-chain records in real time. Token minting and loan collateral status are programmatically verified.",
    },
    {
      label: "Compliance-First Architecture",
      text: "ERC-3643 security tokens with built-in KYC, accreditation, and jurisdiction controls. Reg D 506(c) compliant. Every transfer and lending event validated at the protocol level.",
    },
  ];

  return (
    <section id="value" className="relative py-16 sm:py-28 md:py-36">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] max-w-4xl h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-6">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className={cn(
            "font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-white/90 transition-all duration-1000",
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          )}>
            Value, Revealed<br className="hidden md:block" />
            from Every Angle
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {pillars.map((pillar, i) => (
            <div key={pillar.label} className={cn(
              "transition-all duration-700",
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )} style={{ transitionDelay: `${200 + i * 150}ms` }}>
              <div className="flex items-center gap-3 mb-4">
                <div className={cn("w-1.5 h-1.5 rounded-full", gemColors[i * 2])} />
                <span className="text-xs tracking-[0.3em] uppercase text-white/50">{pillar.label}</span>
              </div>
              <p className="text-white/60 leading-relaxed text-[15px]">{pillar.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Partners Section ─────────────────────────

const partners = [
  { name: "GIA", role: "Gemological Certification", logo: "/partners/gia.svg" },
  { name: "Chainlink", role: "Oracle Infrastructure", logo: "/partners/chainlink.png" },
  { name: "Brink\u2019s", role: "Vault & Custody", logo: "/partners/brinks.png" },
  { name: "Malca-Amit", role: "Precious Asset Logistics", logo: "/partners/malca-amit.svg" },
];

function PartnersSection() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    const el = document.getElementById("partners");
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="partners" className="relative py-16 sm:py-28 md:py-36">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] max-w-4xl h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <p className={cn(
            "text-[10px] sm:text-xs tracking-[0.3em] sm:tracking-[0.4em] uppercase text-[#1A8B7A] mb-3 sm:mb-4 transition-all duration-700",
            visible ? "opacity-100" : "opacity-0"
          )}>Infrastructure Partners</p>
          <h2 className={cn(
            "font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-white/90 transition-all duration-1000 delay-100",
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          )}>Built on the Shoulders of Giants</h2>
          <p className={cn(
            "mt-4 sm:mt-5 text-sm sm:text-base md:text-lg text-white/40 max-w-2xl mx-auto leading-relaxed transition-all duration-700 delay-300",
            visible ? "opacity-100" : "opacity-0"
          )}>
            PleoChrome is building its stack on institutional-grade infrastructure
            &mdash; partnering with the names that secure and verify billions in assets worldwide.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 items-center">
          {partners.map((partner, i) => (
            <div key={partner.name} className={cn(
              "group flex flex-col items-center gap-4 transition-all duration-700",
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )} style={{ transitionDelay: `${200 + i * 120}ms` }}>
              <div className="relative w-full h-16 sm:h-20 flex items-center justify-center px-4 rounded-xl border border-white/[0.04] bg-white/[0.02] group-hover:border-white/[0.08] group-hover:bg-white/[0.04] transition-all duration-500">
                <Image src={partner.logo} alt={partner.name} width={160} height={50}
                  className="max-h-8 sm:max-h-10 w-auto object-contain brightness-0 invert opacity-40 group-hover:opacity-70 transition-all duration-500" />
              </div>
              <div className="text-center">
                <p className="text-xs sm:text-sm font-medium text-white/50 group-hover:text-white/70 transition-colors duration-300">{partner.name}</p>
                <p className="text-[10px] sm:text-xs text-white/25 tracking-wider mt-0.5">{partner.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Contact / CTA Section ────────────────────

function ContactSection() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    const el = document.getElementById("contact");
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="contact" className="relative py-20 sm:py-32 md:py-44 vault-texture">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] max-w-4xl h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      <div className="relative z-10 max-w-2xl mx-auto px-5 sm:px-6 text-center">
        <div className={cn("transition-all duration-1000", visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
          <Image src="/favicon.png" alt="PleoChrome" width={56} height={56}
            className="mx-auto mb-8 drop-shadow-[0_0_20px_rgba(26,139,122,0.2)]" />
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-white/90 mb-4 sm:mb-5">
            Ready to Unlock<br />the Full Value?
          </h2>
          <p className="text-white/40 text-sm sm:text-base md:text-lg leading-relaxed mb-8 sm:mb-10 max-w-lg mx-auto">
            Whether you hold a high-value gemstone, operate custody infrastructure,
            represent qualified investors, or provide lending capital &mdash;
            let&apos;s discuss the right path forward.
          </p>
          <a href="mailto:team@pleochrome.com"
            className="group relative inline-flex items-center gap-2 sm:gap-3 rounded-full px-7 py-3.5 sm:px-10 sm:py-4
              text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] uppercase font-medium
              bg-gradient-to-r from-[#1A8B7A] to-[#1E3A6E]
              text-white shadow-[0_0_40px_rgba(26,139,122,0.2)]
              hover:shadow-[0_0_60px_rgba(26,139,122,0.35)]
              transition-all duration-500 hover:scale-[1.02]">
            <span>Contact Us</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
          <p className="mt-6 text-xs tracking-[0.2em] text-white/20">team@pleochrome.com</p>
        </div>
      </div>
    </section>
  );
}

// ── Footer ───────────────────────────────────

function Footer() {
  return (
    <footer className="relative py-12 border-t border-white/[0.04]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Image src="/logo-white.png" alt="PleoChrome" width={140} height={34}
            className="opacity-40 hover:opacity-60 transition-opacity" />
          <div className="gem-bar w-28">
            <span className="bg-[#1B6B4A]" /><span className="bg-[#1A8B7A]" /><span className="bg-[#1E3A6E]" />
            <span className="bg-[#5B2D8E]" /><span className="bg-[#A61D3A]" /><span className="bg-[#C47A1A]" /><span className="bg-[#7BA31E]" />
          </div>
          <div className="flex items-center gap-6 text-xs tracking-wider text-white/25">
            <span>Florida</span>
            <span className="w-px h-3 bg-white/10" />
            <span>&copy; {new Date().getFullYear()} PleoChrome</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ── Main Page ────────────────────────────────

export default function HomePage() {
  return (
    <main className="bg-[#030712] min-h-screen">
      <HeroSection />
      <IntroSection />
      <PathsSection />
      <ValueSection />
      <PartnersSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
