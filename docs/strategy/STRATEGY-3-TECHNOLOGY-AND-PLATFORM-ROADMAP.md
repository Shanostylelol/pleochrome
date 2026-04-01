# PleoChrome Strategy Document 3: Technology & Platform Roadmap

**Document Version:** 1.1
**Date:** March 19, 2026
**Last Updated:** 2026-03-27
**Prepared for:** Shane Pierson (CEO), David Whiting (CTO/COO)
**Audience:** Technical and business leadership -- written to be understood by both

### Recent Changes (2026-03-27)
- Added Zoniqx (ERC-7518) as parallel evaluation alongside Brickken (ERC-3643) per Decisions #003, #004
- Removed Brickken-only language; tokenization platform references are now platform-agnostic
- Added platform evaluation note to Section 5 (Brickken Integration Roadmap renamed)
- Updated tagline references to "Value from Every Angle" per Decision #001
- Previously corrected: Compliance Officer references (Chris to Shane, interim) per audit findings

---

## Table of Contents

1. [Current State Assessment](#1-current-state-assessment)
2. [Platform Architecture (Target State)](#2-platform-architecture-target-state)
3. [Build vs Buy Analysis](#3-build-vs-buy-analysis)
4. [Technology Stack Recommendation](#4-technology-stack-recommendation)
5. [Brickken Integration Roadmap](#5-brickken-integration-roadmap)
6. [Chainlink PoR Integration](#6-chainlink-por-integration)
7. [David's Learning Path](#7-davids-learning-path)
8. [Security Requirements](#8-security-requirements)
9. [MVP vs Full Platform](#9-mvp-vs-full-platform)
10. [Development Timeline](#10-development-timeline)

---

## 1. Current State Assessment

### 1.1 What Exists Today

| Component | Detail | Condition |
|-----------|--------|-----------|
| **Website** | Next.js 16 + React 19 + TypeScript + Tailwind v4, deployed on Vercel at pleochrome.com | Production-grade frontend framework. Solid foundation. |
| **Landing page** | Public-facing at `/` with Three.js shader animation, brand design system (Cormorant Garamond + DM Sans), gem-facet accent palette | Well-designed, functional. Good first impression. |
| **Partner portal** | 6 passcode-protected routes at `/portal`, `/architecture`, `/financial-model`, `/learn`, `/partner-prep`, `/workflow-mapping` | Working internal tools. Passcode (`pleo123`) is hardcoded in client-side JavaScript -- NOT secure. |
| **Spreadsheet** | `/spreadsheet` route using Univerjs for embedded spreadsheets | Functional. Niche use case. |
| **UI components** | Glowing effect component, shader animation (Three.js), utility functions (clsx + tailwind-merge) | Minimal component library. No shared design system beyond CSS variables. |
| **Dependencies** | motion (Framer Motion), Three.js, lucide-react icons, rxjs | Reasonable for a marketing site. Over-engineered for current use. Three.js adds ~500KB to the bundle. |
| **Dev tooling** | ESLint (Next.js config), TypeScript strict, Tailwind v4 with PostCSS, Vercel deployment | Modern, maintainable. No testing framework, no CI/CD beyond Vercel. |
| **GitHub** | Shanostylelol/pleochrome, 20+ commits | Active repository. No branch protection, no PR workflow, no automated checks. |
| **Google Workspace** | team@, shane@, chris@, david@ pleochrome.com | Operational. DKIM pending (DNS TXT record not yet added in GoDaddy). |
| **Research corpus** | 8 documents totaling 100,000+ words covering blockchain, SEC compliance, distribution platforms, operations, GIA certification | Exceptional knowledge base. This IS the competitive advantage of the team's preparation. |
| **Tokenization platform** | Brickken intro call completed, Zoniqx intro call completed (2026-03-26). Both sandbox access pending. Per Decisions #003/#004, evaluating in parallel. | Pre-integration. No code written, no API tested, no contracts deployed. |

### 1.2 What Is Completely Missing

These are not "nice to have" items. Each one is a prerequisite for processing a single tokenized gemstone.

| Missing Capability | Why It Matters | Blocks |
|-------------------|---------------|--------|
| **Backend / API layer** | No server-side logic exists. Cannot process data, authenticate users, store records, or integrate with any external system. | Everything below. |
| **Database** | No data persistence whatsoever. Cannot track assets, investors, compliance records, or operational state. | Asset pipeline, investor management, compliance, reporting. |
| **Authentication system** | The portal uses a hardcoded passcode in client-side JavaScript. Anyone who views source can bypass it. No user accounts, no roles, no sessions. | Multi-user access, partner portal, investor portal, admin dashboard. |
| **API routes** | Zero Next.js API routes or server actions. No backend endpoints. | Brickken integration, vault API connection, KYC provider integration, any external service. |
| **Supabase or equivalent** | No database, no auth provider, no file storage, no real-time subscriptions. | See above -- database, auth, and storage are all blocked. |
| **Investor portal** | Nothing for investors to log into, view their holdings, access the data room, or download documents. | Investor onboarding, data room access, ongoing communications. |
| **Admin dashboard** | No internal tools for managing the asset pipeline, tracking gate progress, viewing compliance status, or managing operations. | Operational management of any asset. |
| **Compliance engine** | No KYC/AML tracking, no sanctions screening records, no audit trail, no document management. | Cannot onboard a single investor or asset holder. |
| **Reporting engine** | No NAV calculations, no quarterly report generation, no investor statement production. | Post-investment obligations. |
| **Integration layer** | No API connections to Brickken, Chainlink, vault systems, KYC providers, or document signing services. | Token deployment, reserve verification, investor verification. |
| **Testing** | No unit tests, no integration tests, no end-to-end tests. Zero test coverage. | Cannot verify that changes do not break existing functionality. |
| **CI/CD** | No GitHub Actions, no pre-commit hooks, no automated quality checks. Deployment is manual via Vercel git integration. | Code quality assurance, deployment confidence. |
| **Monitoring** | No error tracking (Sentry), no uptime monitoring, no performance metrics, no security alerts. | Cannot detect or respond to failures, attacks, or degradation. |

### 1.3 Technical Debt and Risks

| Risk | Severity | Detail |
|------|----------|--------|
| **Hardcoded passcode in client JS** | CRITICAL | `const PASSCODE = "pleo123"` in `src/app/portal/page.tsx`. This is visible to anyone who opens browser dev tools. The localStorage persistence (`pleo-auth`) means anyone who sets that key can bypass the gate entirely. This must be replaced before any sensitive information is placed behind it. |
| **No environment variables** | HIGH | No `.env` file, no `NEXT_PUBLIC_*` variables, no secrets management. When tokenization platform API keys, Supabase credentials, and other secrets are needed, there is no infrastructure to store them. |
| **No error boundaries** | MEDIUM | If any component throws, the entire page crashes with a white screen. No error boundary components, no fallback UI. |
| **Three.js bundle size** | LOW | Three.js adds approximately 500KB to the client bundle. Acceptable for the landing page but should be code-split so it does not load on every route. |
| **No TypeScript strict mode enforcement** | MEDIUM | `tsconfig.json` exists but no evidence of `strict: true` being enforced across the codebase. No type-checking CI step. |
| **No accessibility** | LOW (for now) | No ARIA labels, no keyboard navigation testing, no screen reader support. Becomes relevant when the investor portal is built. |
| **Single-developer architecture** | MEDIUM | All code was written by one person (via Claude Code). No code review process, no PR approvals, no pair programming. When David begins contributing, merge conflicts and architectural disagreements are likely without clear conventions. |

### 1.4 What the Current Codebase IS Good For

The existing site serves three legitimate purposes well:

1. **Brand presence**: pleochrome.com establishes credibility. The design is polished, the copy is professional, and the Three.js animation creates a memorable first impression. Keep it.

2. **Internal knowledge sharing**: The portal routes (architecture, financial model, workflow mapping, partner prep, learning) are effective onboarding tools for the founding team. They contain real strategic value. However, they must be properly secured before adding sensitive content.

3. **Foundation for expansion**: Next.js 16, React 19, TypeScript, and Tailwind v4 are the correct technology choices for what comes next. The framework does not need to change. The gap is entirely in the backend and integrations.

---

## 2. Platform Architecture (Target State)

### 2.1 Architecture Overview

The PleoChrome platform will consist of six application layers plus an integration layer connecting to external services. Each layer has a clear responsibility boundary.

```
                    +-------------------------------------------+
                    |            VERCEL EDGE NETWORK             |
                    |     (CDN, Edge Middleware, SSL/TLS)        |
                    +-------------------------------------------+
                              |                    |
              +---------------+----+    +----------+----------+
              |   PUBLIC WEBSITE   |    |   APPLICATION SHELL  |
              |   (Marketing)      |    |   (Authenticated)    |
              +--------------------+    +-----------+----------+
                                                    |
                    +-------------------------------+-------------------------------+
                    |                               |                               |
          +---------v---------+          +----------v----------+         +----------v----------+
          |  ADMIN DASHBOARD  |          |  INVESTOR PORTAL    |         |  PARTNER PORTAL     |
          |  (Internal ops)   |          |  (Token holders)    |         |  (Appraisers, vaults|
          +-------------------+          +---------------------+         |   legal, BD)        |
                    |                               |                    +---------------------+
                    +-------------------------------+-------------------------------+
                                                    |
                    +-------------------------------v-------------------------------+
                    |                     SUPABASE BACKEND                          |
                    |  Auth | Database | Storage | Realtime | Edge Functions        |
                    +-------------------------------+-------------------------------+
                                                    |
                    +-------------------------------v-------------------------------+
                    |                   INTEGRATION LAYER                           |
                    |  Tokenization API | Chainlink | Vault API | KYC | DocuSign    |
                    +--------------------------------------------------------------+
```

### 2.2 Admin Dashboard

**Purpose:** Internal tool for the PleoChrome team to manage the entire asset pipeline, monitor compliance, and run operations.

**Core capabilities:**

| Feature | Description | Priority |
|---------|-------------|----------|
| **Asset pipeline** | Kanban-style board showing each asset's progress through the 5-gate process (intake -> GIA -> appraisal -> tokenization -> distribution) | P0 (MVP) |
| **Gate tracking** | Each asset has a gate checklist. Gates cannot be "passed" until all required items are verified and documented. Visual status: red/yellow/green. | P0 (MVP) |
| **Document management** | Upload, organize, and track all documents per asset: GIA reports, appraisals, custody receipts, insurance certificates, engagement agreements | P0 (MVP) |
| **Compliance dashboard** | View all KYC/AML records, sanctions screening results, and compliance dates. Flag items approaching expiration (KYC refreshes, insurance renewals, OFAC re-screens). | P0 (MVP) |
| **Investor list** | View all investors, their KYC status, accreditation verification status, token holdings, and communication history | P1 |
| **Reporting** | Generate quarterly NAV reports, investor statements, and compliance summaries | P1 |
| **Activity log** | Immutable audit trail of every action taken by every team member: who uploaded what, who approved what, who changed what, when | P0 (MVP) |
| **Token operations** | Interface to trigger tokenization platform operations: deploy tokens, whitelist investors, mint, burn, freeze, pause | P2 |
| **Chainlink monitoring** | Real-time view of PoR feed status: last update timestamp, current reserve value, feed health | P2 |

**Access:** Shane, Chris, David. Future: fractional CFO, operations analyst, investor relations manager.

**Role-based access control (RBAC):**

| Role | Permissions |
|------|------------|
| **Admin** (Shane) | Full access. Can create users, modify roles, approve gate transitions, manage billing. |
| **Compliance Officer** (Shane, interim) | Full read access. Can approve/reject KYC, run sanctions screens, approve gate transitions requiring compliance sign-off, manage investor verification records. |
| **CTO/Operations** (David) | Full read access. Can manage assets, upload documents, trigger token operations, manage vault and Chainlink integrations. Cannot approve compliance gates. |
| **Viewer** | Read-only access to dashboards and reports. For fractional CFO, external auditors. |

### 2.3 Investor Portal

**Purpose:** Secure, authenticated portal where accredited investors access offering materials, manage their investment, and view their holdings.

**Core capabilities:**

| Feature | Description | Priority |
|---------|-------------|----------|
| **Data room** | Secure document access: PPM, subscription agreement, GIA reports (summary), appraisal summaries, vault custody confirmation, insurance verification, team bios | P0 (MVP) |
| **Subscription flow** | Digital workflow: review PPM -> complete investor questionnaire -> sign subscription agreement (DocuSign) -> receive wire instructions -> confirm funding | P1 |
| **Holdings dashboard** | View token balance, current NAV per token, total portfolio value, transaction history (mints, transfers) | P1 |
| **Quarterly reports** | Access and download quarterly investor reports: NAV update, custody verification, market commentary, PoR verification | P1 |
| **Communications** | Receive and view announcements, updates, and notices from PleoChrome | P2 |
| **Wallet connection** | Connect MetaMask or WalletConnect to verify on-chain token ownership | P2 |
| **Redemption requests** | Submit redemption requests through the portal (triggers internal workflow) | P3 |
| **Tax documents** | Access K-1 forms and other tax documents when available | P3 |

**Access:** Verified accredited investors only. KYC + accreditation must be confirmed before data room access is granted.

**Authentication flow:**
1. Investor receives invitation email from PleoChrome
2. Creates account with email + password (Supabase Auth)
3. Completes KYC through integrated provider (Sumsub or equivalent)
4. Accreditation verified (self-certification for $200K+ investments per March 2025 SEC guidance, or third-party via VerifyInvestor)
5. Upon verification, investor gains access to the data room and subscription flow
6. After subscription and funding, investor gains access to holdings dashboard

### 2.4 Partner Portal

**Purpose:** Secure access for external partners (appraisers, vault operators, legal counsel, broker-dealer) to submit documents, view relevant asset information, and communicate with the PleoChrome team.

**Core capabilities:**

| Feature | Description | Priority |
|---------|-------------|----------|
| **Appraiser submission** | Appraisers upload USPAP-compliant reports directly. Submission includes metadata (effective date, type of value, methodology used). | P1 |
| **Vault status** | Vault operators confirm custody status, upload inventory confirmations, report any incidents | P1 |
| **Legal document management** | Counsel uploads draft and final versions of legal documents. Version tracking. | P1 |
| **BD reporting** | Broker-dealer accesses offering status, investor counts, compliance records needed for FINRA supervision | P2 |
| **Communication** | Threaded messaging between partner and PleoChrome team, organized by asset/topic | P2 |

**Access:** Invitation-only. Each partner sees ONLY the assets and documents relevant to their engagement. An appraiser cannot see the vault operator's submissions. A vault operator cannot see the appraisals.

**RBAC by partner type:**

| Partner Type | Can See | Can Upload | Cannot See |
|-------------|---------|------------|-----------|
| Appraiser | GIA reports (read-only), asset summary | Appraisal reports | Other appraisals, investor info, financial model |
| Vault Operator | Custody agreement, insurance requirements | Custody confirmations, inventory reports | Appraisals, investor info, financial terms |
| Legal Counsel | All documents for their engagement | Legal drafts, opinion letters, final documents | Other assets (unless engaged on multiple) |
| Broker-Dealer | PPM, offering docs, investor pipeline stats | Compliance reports, FINRA filings | Raw appraisals, vault inventory details |

### 2.5 Compliance Engine

**Purpose:** Centralized system for tracking all compliance obligations, maintaining an audit trail, and ensuring nothing falls through the cracks.

**Core capabilities:**

| Feature | Description | Priority |
|---------|-------------|----------|
| **KYC/AML tracking** | Record and track KYC status for every investor and asset holder. Store verification dates, provider used, result, expiration date. | P0 (MVP) |
| **Sanctions screening** | Log all OFAC/SDN/PEP screening results. Quarterly re-screening schedule with automated reminders. | P0 (MVP) |
| **Audit trail** | Every action in the system is logged with timestamp, user, action type, and before/after values. Immutable (append-only, no deletes). | P0 (MVP) |
| **Document versioning** | Track every version of every document with upload date, uploader, and status (draft/review/approved/superseded). | P1 |
| **Compliance calendar** | Dashboard showing upcoming compliance deadlines: KYC refresh dates, insurance renewals, annual re-appraisals, state filing deadlines, OFAC re-screens. | P1 |
| **Accreditation verification records** | Store verification method (self-cert, third-party letter, CPA letter), verification date, expiration, and supporting documentation. | P0 (MVP) |
| **Regulatory filing tracker** | Track Form D filing date, CIK number, blue sky filings per state with dates and confirmation numbers. | P1 |
| **SAR preparation** | If suspicious activity is detected, system provides workflow for documenting and preparing SAR filings per FinCEN requirements. | P3 |

**Critical design principle:** The compliance engine is NOT a separate application. It is a set of database tables, policies, and UI views that are woven throughout the admin dashboard, investor portal, and partner portal. Every action that has compliance implications automatically creates a compliance record.

### 2.6 Reporting Engine

**Purpose:** Generate, store, and distribute all reports required for investors, regulators, and internal operations.

**Report types:**

| Report | Frequency | Recipients | Content |
|--------|-----------|------------|---------|
| **NAV report** | Quarterly | Investors, internal | Current appraised value, token price, total AUM, changes from prior quarter |
| **Custody verification** | Quarterly | Investors, internal | Vault confirmation that all assets are in custody, insurance status, any incidents |
| **Chainlink PoR status** | Quarterly | Investors, internal | Oracle feed health, last N updates, reserve verification confirmations |
| **Investor statement** | Quarterly | Individual investors | Personal holdings, current value, distributions received, transaction history |
| **Compliance summary** | Quarterly | Internal, counsel | KYC status of all investors, sanctions screening results, any flags |
| **Annual reappraisal** | Annual | Investors, internal | Updated independent appraisal, comparison to prior year, market commentary |
| **K-1 preparation data** | Annual | CPA/accountant | SPV financial data needed for K-1 generation |
| **Board/management report** | Monthly | Founders | Pipeline status, capital raised, burn rate, upcoming milestones, blockers |

**Implementation:** Reports are generated from database queries, formatted as PDFs using a templating engine (React-PDF or similar), stored in Supabase Storage, and distributed through the investor portal and email.

### 2.7 Integration Layer

**Purpose:** Connect PleoChrome's platform to all external services through a unified, auditable integration layer.

```
INTEGRATION LAYER ARCHITECTURE
================================

PleoChrome Platform
       |
       v
+------+------+
| API Gateway  |  (Next.js API Routes + Supabase Edge Functions)
| Rate Limit   |
| Auth Check   |
| Audit Log    |
+------+------+
       |
       +------- Tokenization Platform API (Token deployment, KYC whitelisting, escrow management)
       |          - Evaluating: Brickken (ERC-3643) and Zoniqx (ERC-7518) per Decision #003
       |
       +------- Chainlink (PoR feed reading, oracle status monitoring)
       |
       +------- Vault API (Custody confirmations, inventory status)
       |          - If vault has API: direct REST integration
       |          - If vault has no API: manual upload with digital signature verification
       |
       +------- KYC Provider (Sumsub, Onfido, or Jumio -- investor identity verification)
       |
       +------- DocuSign / PandaDoc (Subscription agreement signing)
       |
       +------- Email (Resend or SendGrid -- investor communications, notifications)
       |
       +------- OFAC API (sanctionssearch.ofac.treas.gov -- sanctions screening)
       |
       +------- Stripe (PleoChrome subscription billing -- if/when offering a SaaS tier)
       |
       +------- VerifyInvestor API (Accredited investor verification)
```

**Design principles:**
- Every external API call is logged (request timestamp, response status, latency)
- Every integration has a health check that runs every 5 minutes
- Every integration has a fallback (manual process documented) in case the API is down
- Credentials are stored in Supabase vault (encrypted) or Vercel environment variables, NEVER in code
- Rate limiting is applied to prevent runaway API costs

### 2.8 Data Architecture

**What goes where:**

| Data Category | Storage Location | Reason |
|--------------|-----------------|--------|
| **User accounts and auth** | Supabase Auth | Built-in auth with MFA, social login, magic links. Row-level security (RLS) for data access control. |
| **Asset records** | Supabase PostgreSQL | Relational data: assets, gates, checklists, statuses, relationships. Needs joins, queries, aggregations. |
| **Investor records** | Supabase PostgreSQL | Investor profiles, KYC status, accreditation records, holdings. RLS ensures investors see only their own data. |
| **Compliance records** | Supabase PostgreSQL | KYC results, screening logs, audit trail. Append-only tables (no UPDATE, no DELETE policies). |
| **Documents (PDFs, images)** | Supabase Storage | GIA reports, appraisals, legal documents, custody confirmations. Organized by asset and type. |
| **Generated reports** | Supabase Storage | Quarterly reports, investor statements, NAV reports. Generated as PDFs, stored for access. |
| **Real-time notifications** | Supabase Realtime | Gate status changes, new document uploads, compliance alerts. Push to connected clients. |
| **On-chain data** | Polygon blockchain (via selected tokenization platform) | Token balances, transfer history, compliance contract state. Read via platform API or direct RPC. |
| **Oracle data** | Polygon blockchain (via Chainlink) | Reserve verification values, update timestamps. Read via Chainlink aggregator contract. |
| **Email templates** | Supabase PostgreSQL or code | Investor communications, notifications, system alerts. |
| **Secrets and API keys** | Vercel env vars + Supabase Vault | Never in code, never in database tables, never in localStorage. |

**Security tiers:**

| Tier | Data | Protection |
|------|------|-----------|
| **PUBLIC** | Marketing content, public landing page | None needed. Served by Vercel CDN. |
| **INTERNAL** | Asset pipeline, gate statuses, partner info | Supabase RLS. Only authenticated PleoChrome team members. |
| **CONFIDENTIAL** | Investor PII (name, address, SSN), KYC documents, financial data | Supabase RLS + column-level encryption for SSN/financial fields. Access logged. |
| **RESTRICTED** | Private keys, API secrets, wallet mnemonics | Supabase Vault or HSM. Never stored in application database. Never logged. |

---

## 3. Build vs Buy Analysis

For each major capability, the recommendation is one of:
- **BUILD**: Write custom code. PleoChrome owns and controls it entirely.
- **BUY**: Purchase a SaaS product. Someone else maintains it.
- **INTEGRATE**: Use an external service's API within PleoChrome's platform. PleoChrome builds the connection but relies on the external service for the core capability.

### 3.1 Analysis Matrix

| Capability | Recommendation | Vendor/Approach | Rationale | Estimated Cost |
|-----------|---------------|-----------------|-----------|---------------|
| **Tokenization (ERC-3643/7518 deployment, escrow, minting)** | BUY | **Brickken or Zoniqx** (evaluating both -- see Decisions #003/#004) | Building and auditing security token contracts from scratch would cost $200K+ and take 6+ months. Both Brickken (ERC-3643) and Zoniqx (ERC-7518) provide pre-audited, factory-deployed contracts with integrated KYC whitelisting and escrow. This is the single most important buy decision. Platform selection in progress. | ~$2,000/mo (~$24K/yr) |
| **Chainlink PoR oracle** | INTEGRATE | **Chainlink BUILD program** | Chainlink is the only credible decentralized oracle network for institutional-grade reserve verification. The external adapter is custom code (BUILD), but the oracle infrastructure is theirs. No realistic alternative exists. | $5K-20K development + ongoing LINK costs |
| **Cap table management** | BUY (platform built-in) | **Tokenization platform** (built-in) | The selected platform's dashboard manages the on-chain cap table. The security token contract IS the cap table. Supplemental off-chain records stored in Supabase for legal/tax purposes. | Included in platform subscription |
| **Investor communications** | BUILD + INTEGRATE | **Custom UI + Resend/SendGrid** | The investor portal (custom) is where investors view communications. Email delivery via Resend or SendGrid API. No need for a dedicated investor comms platform at this scale (< 50 investors initially). | Resend: free tier (3K emails/mo) then $20/mo |
| **Document management / data room** | BUILD (simple) or BUY (expedient) | **Supabase Storage** (build) or **DocSend** (buy initially) | For MVP, DocSend ($45/mo) provides a data room immediately with tracking analytics. Longer-term, build the data room into the investor portal using Supabase Storage for full control and branding. | DocSend: $45/mo; Custom: dev time only |
| **CRM** | BUY | **HubSpot Free** or **Attio** | PleoChrome needs to track investor leads, meeting notes, and pipeline. At < 100 contacts, HubSpot Free CRM is sufficient. Do not build a CRM. | HubSpot Free: $0; Attio: $29/user/mo |
| **Compliance monitoring** | BUILD | **Custom (Supabase)** | No off-the-shelf compliance platform is tailored to tokenized gemstone securities. Build compliance tracking tables, audit trail logging, and compliance calendar into the admin dashboard. This is core IP. | Dev time only |
| **Reporting / analytics** | BUILD | **Custom (React-PDF + Supabase)** | Reports are too domain-specific (NAV calculations, PoR verification, gemstone market data) for any generic reporting tool. Build templated PDF generation using React-PDF or Puppeteer. | Dev time + React-PDF (open source) |
| **Email marketing** | BUY | **Resend** or **Mailchimp** | For investor newsletters and market updates. Do not build an email marketing system. | Resend: $20/mo; Mailchimp: free tier |
| **Payment processing** | INTEGRATE | **Wire transfer** (primary) + **Stablecoin** (via platform escrow) | Institutional investors wire funds to the SPV bank account. The tokenization platform's escrow handles on-chain USDC deposits. PleoChrome does not need Stripe for investor payments. Stripe might be used later for PleoChrome's own SaaS billing if it offers a platform tier. | Wire: $0 (bank fees); escrow: included in platform |
| **KYC/AML verification** | INTEGRATE | **Platform built-in** or **Sumsub** | Both Brickken and Zoniqx include KYC/AML verification. If the selected platform's KYC is insufficient, integrate Sumsub ($1.50-2.50/verification) or Onfido as a supplemental provider. | Platform: included; Sumsub: ~$2/verification |
| **Accredited investor verification** | INTEGRATE | **VerifyInvestor** or **self-certification** | For investments $200K+, March 2025 SEC guidance allows self-certification. For smaller investments or belt-and-suspenders, integrate VerifyInvestor ($50-150/investor). | $0-150/investor |
| **Document signing** | INTEGRATE | **DocuSign** or **PandaDoc** | Subscription agreements, engagement letters, and other legal documents need legally binding e-signatures. Do not build this. | DocuSign: $25/mo (starter); PandaDoc: $35/mo |
| **Sanctions screening** | BUILD + INTEGRATE | **OFAC SDN search** (free) + **custom logging** | Use the free OFAC SDN search API for screening. Build logging and scheduling into the compliance engine. At scale (100+ investors), consider paid providers like ComplyAdvantage or Chainalysis KYT. | $0 (free tier); ComplyAdvantage: $500+/mo at scale |

### 3.2 Total SaaS Cost Estimate (Monthly)

| Service | Monthly Cost | Annual Cost |
|---------|-------------|------------|
| Tokenization platform (Brickken or Zoniqx) | $2,000 | $24,000 (estimated; final cost depends on platform selection) |
| Supabase Pro | $25 | $300 |
| Vercel Pro | $20 | $240 |
| Resend (email) | $20 | $240 |
| DocSend (data room, temporary) | $45 | $540 |
| HubSpot CRM | $0 | $0 |
| DocuSign Starter | $25 | $300 |
| Domain + DNS (GoDaddy) | ~$2 | ~$24 |
| **Total** | **~$2,137/mo** | **~$25,644/yr** |

This is manageable. The dominant cost is the tokenization platform, which is essential for the tokenization infrastructure. [UPDATED 2026-03-27: Final platform cost depends on Brickken vs. Zoniqx selection per Decision #003.]

---

## 4. Technology Stack Recommendation

### 4.1 Frontend: Keep Next.js (Yes, Definitively)

**Decision: Keep Next.js 16 + React 19 + TypeScript + Tailwind v4.**

Rationale:
- The existing site is already built on this stack and working well
- Next.js provides server-side rendering (SEO for the public site), API routes (backend), and server actions (form handling) in one framework
- React 19 server components reduce client-side JavaScript, improving performance for the investor portal
- The team (Shane via Claude Code, David learning) does not need to learn a new framework
- Vercel deployment is already configured and provides edge functions, analytics, and preview deployments
- Every other tool in the ecosystem (Supabase client, tokenization platform SDKs, ethers.js) has first-class React/Next.js support

**Do NOT switch to:**
- Python/Django: David's strength, but would mean running two separate systems (marketing site + backend). Next.js API routes + Supabase Edge Functions cover the backend needs.
- SvelteKit/Nuxt/Remix: No advantage over Next.js for this use case. Ecosystem is smaller.
- Raw Node/Express: Would lose SSR, file-based routing, and Vercel integration.

**Additions to the frontend stack:**

| Package | Purpose | Why |
|---------|---------|-----|
| `@supabase/supabase-js` | Database client, auth, storage, realtime | The backend. |
| `@supabase/ssr` | Server-side Supabase auth in Next.js | Secure auth with cookies, not localStorage. |
| `react-hook-form` + `zod` | Form handling + validation | Every portal needs forms (investor onboarding, document upload, KYC submission). |
| `@tanstack/react-query` | Server state management | Cache and synchronize data from Supabase. Prevents redundant fetches. |
| `react-pdf` or `@react-pdf/renderer` | PDF generation | Quarterly reports, investor statements. |
| `ethers` (v6) | Ethereum/Polygon RPC interaction | Read token balances, PoR feed values, transaction history from Polygon. |
| `recharts` or `@tremor/react` | Charts and data visualization | NAV charts, portfolio performance, dashboard metrics. |
| `sonner` | Toast notifications | User feedback for async operations. |
| `nuqs` | URL search params state | Filter and search in admin tables. |
| `vitest` + `@testing-library/react` | Testing | Unit and component tests. |
| `playwright` | E2E testing | Critical flow testing (login, subscription, document access). |

### 4.2 Backend: Supabase

**Decision: Use Supabase as the primary backend.**

Rationale:
- PostgreSQL database with row-level security (RLS) -- investors can only see their own data by design
- Built-in auth with email/password, magic links, and MFA
- File storage with access policies (GIA reports, legal documents)
- Realtime subscriptions (gate status updates, new document notifications)
- Edge Functions (Deno-based serverless functions for integrations)
- Database migrations (version-controlled schema changes)
- Dashboard for quick database inspection during development
- Free tier is sufficient for development; Pro tier ($25/mo) handles production

**What Supabase replaces:**
- Custom auth server (Supabase Auth)
- Custom file server (Supabase Storage)
- Custom database server (Supabase PostgreSQL)
- Custom realtime server (Supabase Realtime)
- Custom serverless functions (Supabase Edge Functions)

**What Supabase does NOT replace:**
- Tokenization platform (tokenization is a separate domain)
- Chainlink (oracle network is a separate domain)
- Next.js API routes (used for server-side rendering logic, webhook handlers, and middleware)

### 4.3 Database Schema (High-Level)

The database schema is organized into six domains. Each domain has its own set of tables with clear foreign key relationships.

```
DOMAIN 1: USERS & AUTH
=======================
profiles
  - id (uuid, FK to auth.users)
  - email
  - full_name
  - role (admin | compliance | operations | investor | partner)
  - partner_type (appraiser | vault | legal | bd | null)
  - organization
  - phone
  - created_at, updated_at

DOMAIN 2: ASSETS
=======================
assets
  - id (uuid)
  - name ("Emerald Series A")
  - asset_type (emerald | sapphire | ruby | alexandrite | mixed)
  - description
  - estimated_value_low, estimated_value_high
  - final_appraised_value
  - current_status (intake | gia | appraisal | tokenization | distribution | active | redeemed)
  - current_gate (1 | 2 | 3 | 4 | 5)
  - spv_name ("PleoChrome Holdings LLC - Series A")
  - token_contract_address
  - token_symbol
  - token_supply
  - token_price_usd
  - vault_id (FK to vaults)
  - created_at, updated_at

asset_gates
  - id (uuid)
  - asset_id (FK)
  - gate_number (1-5)
  - gate_name
  - status (pending | in_progress | passed | failed | blocked)
  - approved_by (FK to profiles)
  - approved_at
  - notes
  - created_at

gate_checklist_items
  - id (uuid)
  - asset_gate_id (FK)
  - item_description
  - required (boolean)
  - completed (boolean)
  - completed_by (FK to profiles)
  - completed_at
  - evidence_document_id (FK to documents)

DOMAIN 3: DOCUMENTS
=======================
documents
  - id (uuid)
  - asset_id (FK, nullable -- some docs are global)
  - document_type (gia_report | appraisal | custody_receipt | insurance_cert |
                    engagement_agreement | ppm | subscription_agreement |
                    legal_opinion | compliance_report | investor_statement |
                    k1 | quarterly_report | other)
  - file_name
  - file_path (Supabase Storage path)
  - file_size_bytes
  - mime_type
  - version (integer)
  - status (draft | review | approved | superseded)
  - uploaded_by (FK to profiles)
  - approved_by (FK to profiles, nullable)
  - approved_at
  - created_at

DOMAIN 4: INVESTORS
=======================
investors
  - id (uuid, FK to profiles)
  - kyc_status (pending | submitted | verified | expired | rejected)
  - kyc_provider (brickken | sumsub | manual)
  - kyc_verified_at
  - kyc_expires_at
  - accreditation_status (pending | verified | expired)
  - accreditation_method (self_cert | third_party | cpa_letter | broker_letter)
  - accreditation_verified_at
  - accreditation_expires_at
  - wallet_address
  - subscription_status (invited | reviewing | signed | funded | active)
  - investment_amount_usd
  - tokens_held
  - created_at, updated_at

investor_assets  (junction table: investor <-> asset)
  - investor_id (FK)
  - asset_id (FK)
  - tokens_owned
  - investment_date
  - subscription_agreement_id (FK to documents)

DOMAIN 5: COMPLIANCE
=======================
compliance_screenings
  - id (uuid)
  - subject_type (investor | asset_holder | team_member | partner)
  - subject_id (FK to profiles)
  - screening_type (ofac_sdn | pep | criminal_background | credit)
  - provider (ofac_gov | complyadvantage | manual)
  - result (clear | hit | pending | inconclusive)
  - result_detail (text)
  - screened_by (FK to profiles)
  - screened_at
  - next_screening_due
  - created_at

audit_trail  (append-only -- NO UPDATE or DELETE)
  - id (uuid)
  - user_id (FK to profiles)
  - action_type (create | update | delete | approve | reject | upload | download |
                  login | logout | screen | mint | burn | transfer | freeze | pause)
  - entity_type (asset | investor | document | gate | screening | token)
  - entity_id (uuid)
  - old_values (jsonb, nullable)
  - new_values (jsonb, nullable)
  - ip_address
  - user_agent
  - created_at

regulatory_filings
  - id (uuid)
  - asset_id (FK)
  - filing_type (form_d | blue_sky | finra_5123)
  - jurisdiction (federal | state code)
  - filed_at
  - confirmation_number
  - document_id (FK to documents)
  - created_at

DOMAIN 6: PARTNERS
=======================
vaults
  - id (uuid)
  - name
  - location
  - contact_name, contact_email, contact_phone
  - has_api (boolean)
  - api_endpoint (encrypted, nullable)
  - insurance_coverage_usd
  - insurance_provider
  - insurance_policy_number
  - ftz_available (boolean)
  - created_at, updated_at

appraisers
  - id (uuid, FK to profiles)
  - credential (cga | mga | asa | other)
  - uspap_current (boolean)
  - uspap_last_updated
  - specialty (emerald | sapphire | ruby | colored_gemstones | all)
  - eo_insurance_provider
  - eo_coverage_usd
  - created_at, updated_at

appraisals
  - id (uuid)
  - asset_id (FK)
  - appraiser_id (FK)
  - appraised_value_usd
  - effective_date
  - methodology (market_comparison | cost | income)
  - uspap_compliant (boolean)
  - document_id (FK to documents)
  - sequence_number (1, 2, or 3 -- which appraiser in the chain)
  - created_at
```

**RLS policy examples:**
- Investors can SELECT their own row in `investors` and their own rows in `investor_assets`
- Investors CANNOT see other investors' data
- Partners can SELECT documents where `document_type` matches their partner type AND `asset_id` matches their engagement
- Only `compliance` and `admin` roles can INSERT into `compliance_screenings`
- Nobody can UPDATE or DELETE from `audit_trail` (enforced at the database level)

### 4.4 Auth Architecture

**Three authentication paths, one Supabase Auth instance:**

| User Type | Auth Method | Post-Auth Experience |
|-----------|------------|---------------------|
| **Admin team** (Shane, Chris, David) | Email + password + MFA (TOTP) | Admin dashboard |
| **Investors** | Email magic link (preferred) or email + password | Investor portal |
| **Partners** | Email magic link (invitation-only) | Partner portal (scoped to their type) |

**Why magic links for investors and partners:**
- Investors and partners are not daily users. They log in occasionally (quarterly reports, document uploads).
- Magic links eliminate password management headaches for infrequent users.
- Magic links are inherently MFA (access requires control of the email inbox).
- Phishing resistance is higher than password-based auth for this user profile.

**Middleware:**
Next.js middleware runs on every request and checks:
1. Is the route protected? (everything under `/admin/*`, `/investor/*`, `/partner/*`)
2. Is there a valid Supabase session cookie?
3. Does the user's role match the required role for this route?
4. If any check fails, redirect to `/login`

### 4.5 File Storage

**Supabase Storage with bucket-level access policies:**

| Bucket | Contents | Access |
|--------|----------|--------|
| `gia-reports` | GIA Identification & Origin Reports | Admin, compliance, assigned appraisers |
| `appraisals` | USPAP-compliant appraisal reports | Admin, compliance (NOT other appraisers) |
| `legal` | PPM, subscription agreements, engagement agreements, legal opinions | Admin, compliance, assigned counsel, investors (PPM only) |
| `custody` | Vault receipts, insurance certificates, custody confirmations | Admin, compliance, assigned vault operator |
| `investor-docs` | Investor-submitted KYC documents, accreditation letters | Admin, compliance, the submitting investor only |
| `reports` | Generated quarterly reports, investor statements | Admin, compliance, the relevant investor |
| `internal` | Internal operational documents, SOPs, team docs | Admin, compliance, operations |

### 4.6 Monitoring

| Tool | Purpose | Cost |
|------|---------|------|
| **Sentry** | Error tracking (frontend + API routes) | Free tier (5K events/mo) |
| **Vercel Analytics** | Web vitals, page views, visitor metrics | Included in Vercel Pro ($20/mo) |
| **Checkly** or **Better Uptime** | Uptime monitoring with alerting (Slack/SMS) | Free tier (5 monitors) |
| **Supabase Dashboard** | Database metrics, auth logs, storage usage | Included |
| **Chainlink feed monitoring** | Custom: poll PoR aggregator contract, alert if stale or anomalous | Built into admin dashboard |
| **GitHub Actions** | CI/CD: type-checking, linting, testing on every PR | Free for public repos, 2000 min/mo for private |

---

## 5. Tokenization Platform Integration Roadmap

> **[UPDATED 2026-03-27]** This section was originally written for Brickken as the sole platform. Per Decisions #003 and #004, PleoChrome is now evaluating both Brickken (ERC-3643) and Zoniqx (ERC-7518) in parallel. The sandbox testing plan below should be executed for both platforms during the 30-day evaluation period. Brickken-specific references below are retained for specificity but apply equally to the Zoniqx evaluation track.
>
> **Zoniqx differentiators to evaluate:** Chainlink PoR already integrated, physical asset experience (Serenity precious metals), white-label portals, Z-Connect distribution network, ERC-7518 (proprietary Draft-status standard). Key risk: ERC-7518 is not yet ratified -- verify ERC-3643 compatibility.

### 5.1 What the Tokenization Platform Provides

The tokenization platform is the infrastructure layer. It provides:

1. **Factory-deployed ERC-3643 contracts** -- pre-audited smart contracts deployed on Polygon
2. **KYC/AML integration** -- investor identity verification and on-chain whitelisting
3. **Escrow contracts** -- hold investor funds until soft cap or conditions are met
4. **Cap table management** -- real-time view of all token holders and their balances
5. **Dashboard** -- web interface for token management (mint, burn, freeze, pause, whitelist)
6. **API and SDK** -- programmatic access to all platform capabilities
7. **Investor-facing interface** -- optional whitelabel investor portal (may or may not be used)

### 5.2 Sandbox Testing Plan

**Phase 1: Account and Environment Setup (Days 1-3)**

| Task | Owner | Deliverable |
|------|-------|-------------|
| Confirm sandbox access with Brickken account manager | Shane | Login credentials for sandbox environment |
| Create test wallets in MetaMask (3 minimum: issuer, investor_1, investor_2) | David | 3 wallet addresses with Polygon Mumbai/Amoy testnet MATIC |
| Document Brickken sandbox URL, API endpoint, and SDK version | David | Written environment configuration |
| Review Brickken API documentation cover to cover | David | List of all available endpoints, parameters, and response formats |
| Identify Brickken SDK npm package and install in PleoChrome project | David | `package.json` updated, SDK imported |

**Phase 2: Token Configuration and Deployment (Days 4-7)**

| Task | Owner | Deliverable |
|------|-------|-------------|
| Configure token in Brickken dashboard: name, symbol, total supply, compliance rules | David + Shane | Token configuration saved in dashboard |
| Deploy token to Polygon testnet via Brickken factory | David | Deployed token contract address |
| Verify contract on Polygonscan (testnet): read contract, check parameters | David | Verified contract matching configuration |
| Record all deployed contract addresses: token, identity registry, compliance, escrow | David | Address inventory document |

**Phase 3: Compliance Configuration Testing (Days 8-12)**

| Task | Owner | Deliverable |
|------|-------|-------------|
| Configure KYC claim topics in Brickken: KYC_VALIDATED + ACCREDITED_INVESTOR | David | Claim topics registered |
| Test KYC flow: submit test investor through Brickken's KYC process | David | KYC verification completed for test wallet |
| Test whitelisting: verify test investor's wallet is whitelisted on-chain | David | `isVerified(testWallet)` returns `true` |
| Test compliance rules: attempt transfer to non-whitelisted wallet (should FAIL) | David | Transaction reverted with compliance error |
| Test compliance rules: transfer between two whitelisted wallets (should PASS) | David | Transfer succeeded, balances updated |

**Phase 4: Token Operations Testing (Days 13-17)**

| Task | Owner | Deliverable |
|------|-------|-------------|
| Test minting: mint tokens to whitelisted investor wallet | David | Token balance reflects mint |
| Test burning: burn tokens from investor wallet | David | Token balance and total supply reduced |
| Test freezing: freeze an investor address, attempt transfer (should FAIL) | David | Transfer reverted |
| Test pausing: pause token, attempt any transfer (should FAIL) | David | All transfers blocked |
| Test forced transfer: force-transfer tokens between wallets | David | Tokens moved regardless of sender approval |
| Test batch operations: batch mint to multiple wallets | David | All wallets received tokens |
| Test escrow: deposit testnet USDC into escrow, verify lock/release | David | Escrow holds and releases funds correctly |

**Phase 5: API Integration Testing (Days 18-22)**

| Task | Owner | Deliverable |
|------|-------|-------------|
| Call every Brickken API endpoint from PleoChrome Next.js API route | David | Working API integration for each endpoint |
| Build a minimal admin page that calls Brickken API to display token info | David | Admin page showing token name, supply, holder count |
| Test API rate limits: how many calls/second before throttling | David | Rate limit documentation |
| Test webhook integration: configure Brickken webhooks to hit PleoChrome endpoint | David | Webhook handler receiving and logging events |
| Document all API quirks, limitations, and undocumented behaviors | David | Integration notes document |

**Phase 6: End-to-End Flow (Days 23-25)**

| Task | Owner | Deliverable |
|------|-------|-------------|
| Full flow test: KYC -> whitelist -> mint -> transfer -> burn | David + Shane | End-to-end test passing |
| Document the complete happy path with screenshots | David | Integration guide |
| Document every error case encountered and how to handle it | David | Error handling guide |
| Identify gaps between Brickken's capabilities and PleoChrome's needs | David + Shane | Gap analysis with mitigation plan |

### 5.3 Custom Configuration for Gemstone-Specific Compliance

PleoChrome's gemstone tokenization has compliance requirements beyond standard Brickken defaults:

| Requirement | Brickken Feature | Custom Configuration |
|-------------|-----------------|---------------------|
| Accredited investors only (Reg D 506(c)) | Claim Topics Registry | Add claim topic: `ACCREDITED_INVESTOR` (required) |
| KYC/AML verification | Built-in KYC | Configure: full identity verification (not simplified) |
| US jurisdiction only (initially) | Compliance Contract | Set allowed country codes: US (840) only. Expand later. |
| Maximum holder count | Compliance Contract | Set `maxHolderCount` (e.g., 2,000 to stay under SEC reporting thresholds) |
| Lock-up period | Compliance Contract | Set 12-month lock-up from mint date (standard for Reg D) |
| Per-investor maximum | Compliance Contract | Optional: cap at 10-20% of total supply per investor |
| Daily transfer limit | Compliance Contract | Optional: limit daily transfer volume for risk management |

### 5.4 Token Deployment Workflow (Mainnet)

This is the production deployment sequence. It happens ONCE per asset, after all legal documents are finalized and the smart contract audit is passed.

```
PRE-DEPLOYMENT CHECKLIST (all must be true):
[x] PPM is finalized and signed off by counsel and Compliance Officer
[x] Smart contract audit passed with no critical/high findings
[x] Token parameters match legal documents exactly (name, symbol, supply, price)
[x] Compliance rules match PPM restrictions exactly
[x] Multi-sig wallet created for admin operations (3-of-5)
[x] Mainnet MATIC funded in deployment wallet
[x] Form D filed or ready to file within 15 days of first sale

DEPLOYMENT SEQUENCE:
1. Shane, Chris, and David review all parameters together (30-minute call)
2. David deploys via Brickken dashboard (or API)
3. David records all mainnet contract addresses
4. David verifies each contract on Polygonscan
5. Shane independently verifies parameters match legal docs
6. Chris independently verifies compliance rules match regulatory requirements
7. David connects Chainlink PoR feed to the token contract (if ready)
8. David runs a smoke test: whitelist a test wallet, mint 1 token, verify balance, burn 1 token
9. ALL THREE confirm in writing (email or signed document): "Parameters verified. Proceed."
10. Token is live. No further configuration changes without 2-of-3 approval.
```

### 5.5 Investor Onboarding Flow Through Brickken

```
INVESTOR ONBOARDING (per investor):

1. INVITATION
   - PleoChrome sends invitation email with data room access link
   - Investor reviews PPM and offering materials

2. ACCOUNT CREATION
   - Investor creates PleoChrome account (Supabase Auth)
   - Investor indicates interest in subscribing

3. KYC/AML
   - PleoChrome triggers Brickken KYC flow for the investor
   - Investor submits identity documents through Brickken's KYC provider
   - KYC provider verifies identity, screens against sanctions lists
   - Result recorded in PleoChrome compliance database AND Brickken

4. ACCREDITATION
   - For investments >= $200K: investor self-certifies (per March 2025 SEC guidance)
   - For investments < $200K: third-party verification via VerifyInvestor
   - Result recorded in PleoChrome compliance database

5. WHITELISTING
   - Once KYC + accreditation pass, David (or automated process) triggers
     Brickken whitelisting for the investor's wallet address
   - Brickken adds the investor's ONCHAINID to the Identity Registry
   - `isVerified(investorWallet)` now returns `true`

6. SUBSCRIPTION
   - Investor signs Subscription Agreement via DocuSign
   - Investor wires funds to SPV bank account (or sends USDC to Brickken escrow)
   - PleoChrome confirms fund receipt

7. TOKEN MINTING
   - David triggers mint through Brickken dashboard/API
   - Brickken mints tokens to the investor's whitelisted wallet
   - Token balance appears in investor's MetaMask
   - PleoChrome updates investor portal with holding details
   - Audit trail entry created

8. CONFIRMATION
   - Investor receives confirmation email with transaction hash
   - Investor can verify on Polygonscan
   - Holdings visible in PleoChrome investor portal
```

---

## 6. Chainlink PoR Integration

### 6.1 Technical Architecture

```
VAULT INFRASTRUCTURE                    CHAINLINK ORACLE NETWORK
=====================                   ========================

Institutional Vault                     Chainlink Node 1
  |                                       |
  +-- Inventory DB                        +-- External Adapter
  |   (GIA certs, weights,                |   (Node.js service
  |    values, locations)                 |    hosted on AWS/GCP)
  |                                       |
  +-- REST API (or manual feed)     +--> Chainlink Node 2
       |                            |      |
       +----------------------------+      +-- External Adapter
       |                            |
       |                            +--> Chainlink Node 3
       |                            |      |
       |                            |      +-- External Adapter
       |                            |
       |                            +-->  ... (5-7 nodes total)
       |                                       |
       |                              +--------v--------+
       |                              | AGGREGATOR       |
       |                              | CONTRACT         |
       |                              | (on Polygon)     |
       |                              |                  |
       |                              | Computes median  |
       |                              | of all node      |
       |                              | submissions      |
       |                              +--------+---------+
       |                                       |
       |                              +--------v---------+
       |                              | PUBLISHED FEED   |
       |                              | reserveValue =   |
       |                              | $X,XXX,XXX       |
       |                              | lastUpdate =     |
       |                              | timestamp        |
       |                              +--------+---------+
       |                                       |
       |                              +--------v---------+
PLEOCHROME PLATFORM                   | ERC-3643 TOKEN    |
       |                              | CONTRACT          |
       +-- Admin Dashboard            |                  |
       |   (monitors feed health)     | mint() checks:   |
       |                              | totalSupply +    |
       +-- Investor Portal            | newMint <=       |
           (displays reserve          | reserveValue     |
            verification status)      +------------------+
```

### 6.2 External Adapter: Development Requirements

The external adapter is a small Node.js or Python web service that Chainlink nodes call to fetch vault inventory data.

**If the vault HAS an API (best case):**

```javascript
// Simplified external adapter (Node.js)
const express = require('express');
const app = express();

app.post('/adapter', async (req, res) => {
  try {
    // 1. Authenticate with vault API
    const vaultResponse = await fetch(process.env.VAULT_API_URL, {
      headers: { 'Authorization': `Bearer ${process.env.VAULT_API_KEY}` }
    });

    const vaultData = await vaultResponse.json();

    // 2. Calculate total reserve value
    const totalReserveUSD = vaultData.stones.reduce(
      (sum, stone) => sum + stone.appraised_value_usd, 0
    );

    // 3. Return in Chainlink-expected format
    res.json({
      jobRunID: req.body.id,
      data: {
        total_reserve_usd: totalReserveUSD,
        stone_count: vaultData.stones.length,
        last_physical_audit: vaultData.last_audit_date,
        result: totalReserveUSD
      },
      result: totalReserveUSD,
      statusCode: 200
    });
  } catch (error) {
    res.json({
      jobRunID: req.body.id,
      status: 'errored',
      error: { message: error.message },
      statusCode: 500
    });
  }
});

app.listen(8080);
```

**If the vault has NO API (likely case for Olympic Vault and possibly Brink's):**

PleoChrome builds a manual verification bridge:

1. Vault issues a signed custody confirmation (PDF or email) on a regular schedule (weekly or monthly)
2. PleoChrome team uploads the confirmation to the platform
3. A PleoChrome-operated API endpoint serves the latest confirmed reserve value
4. Chainlink nodes read this endpoint

This is less decentralized (the data source is PleoChrome, not the vault directly), but it is an acceptable starting point. The alternative is no PoR at all.

**Mitigation for the trust gap:**
- Independent auditors periodically verify PleoChrome's reported values match physical reality
- The custody confirmation documents are stored in Supabase Storage and accessible to investors
- Chainlink's multi-node aggregation still catches anomalies (if PleoChrome's feed disagrees with other data sources, the median filters it)

### 6.3 Development Requirements

| Component | Language | Hosting | Estimated Dev Time |
|-----------|---------|---------|-------------------|
| External Adapter | Node.js (or Python) | AWS Lambda or GCP Cloud Run | 2-3 weeks |
| Aggregator contract deployment configuration | Solidity (template from Chainlink) | Polygon mainnet | 1 week (mostly configuration) |
| PoR consumer integration in ERC-3643 | Solidity (Brickken may support this natively or need a custom module) | Polygon mainnet | 1-2 weeks |
| Monitoring dashboard component | React/TypeScript | Vercel (part of PleoChrome admin) | 1 week |
| Health check and alerting | Node.js or Supabase Edge Function | Vercel Cron or Supabase scheduled function | 0.5 weeks |

**Total estimated development time:** 5-7 weeks (David's primary focus for Phase 3)

### 6.4 Testing Strategy

| Test | Method | Pass Criteria |
|------|--------|---------------|
| External adapter returns correct data format | Unit test (Jest/Vitest) | Response matches Chainlink schema, `result` is a number |
| External adapter handles vault API errors gracefully | Unit test | Returns `statusCode: 500` with error message, does not crash |
| External adapter handles authentication failures | Unit test | Returns error without exposing credentials |
| PoR feed updates on deviation threshold | Testnet integration test | When reserve value changes by >1%, feed updates within 5 minutes |
| PoR feed updates on heartbeat | Testnet integration test | Feed updates at least once per 24 hours even with no change |
| Oracle-gated minting allows mint when reserves sufficient | Testnet integration test | `mint(100)` succeeds when `totalSupply + 100 <= reserveValue` |
| Oracle-gated minting blocks mint when reserves insufficient | Testnet integration test | `mint(100)` reverts when `totalSupply + 100 > reserveValue` |
| Stale data detection | Integration test | If feed has not updated in >48 hours, admin dashboard shows alert |
| Multi-node agreement | Testnet with 3+ simulated nodes | Aggregated value is median of node submissions; outliers discarded |

### 6.5 Fallback if Chainlink BUILD Program is Rejected

If Chainlink does not accept PleoChrome into the BUILD program, there are three alternatives:

| Option | Description | Cost | Credibility |
|--------|------------|------|-------------|
| **A: Manual PoR with public attestation** | PleoChrome publishes vault custody confirmations on-chain (Polygon) as signed attestations. No oracle network, no decentralized verification. Custody documents accessible in the investor portal. | $2K-5K (development only) | LOW. It is a trust-me model. Acceptable for first asset if clearly disclosed. |
| **B: Chainlink commercial engagement (outside BUILD)** | Engage Chainlink directly as a paying customer. More expensive but does not require acceptance into the free BUILD program. | $20K-50K/year for a dedicated feed | HIGH. Same technology, just not subsidized. |
| **C: Chronicle Protocol or API3 (alternative oracle)** | Use a different oracle provider. API3 has a first-party oracle model (the vault operator runs the node). Chronicle is MakerDAO's oracle. Neither has Chainlink's brand recognition. | $10K-30K development | MEDIUM. Technically equivalent but less recognized by institutional investors. |

**Recommendation:** Apply to BUILD (free). If rejected, pursue Option A for the first asset (manual attestation) and Option B for the second asset (commercial Chainlink engagement once revenue is flowing).

### 6.6 Timeline and Cost Estimate

| Item | Timeline | Cost |
|------|----------|------|
| Chainlink BUILD application | Week 6 (already planned) | $0 |
| BUILD program response | 2-4 weeks after application | $0 |
| External adapter development | Weeks 10-12 | $5K-10K (David's time or contractor) |
| Testnet deployment and testing | Weeks 12-13 | $0 (testnet gas) |
| Mainnet deployment | Week 14 | <$100 (Polygon gas) |
| Ongoing LINK token costs (node payments) | Monthly after launch | $100-500/month |
| **Total first-year PoR cost** | | **$6K-12K** (BUILD accepted) or **$25K-55K** (commercial) |

---

## 7. David's Learning Path

David's background: MS Statistics, data engineering (Python, SQL, Dash apps), introductory blockchain certificate. He is technically strong but has not built on Ethereum/Polygon or written Solidity.

### 7.1 Learning Sequence

The order matters. Each topic builds on the previous one. Estimated times assume 10-15 hours per week dedicated to learning alongside operational work.

**Tier 1: Must Know Before Sandbox Testing (Weeks 1-3)**

| Topic | Resources | Time | Why Now |
|-------|-----------|------|---------|
| **MetaMask setup and usage** | Install MetaMask, create wallet, connect to Polygon Amoy testnet, get testnet MATIC from faucet | 2 hours | Cannot interact with any blockchain tool without a wallet |
| **Ethereum/Polygon fundamentals** | The PleoChrome BLOCKCHAIN-TOKENIZATION-DEEP-DIVE.md (Sections 1, 7, 8) | 4 hours | David helped write this document. Re-read it now as a practitioner, not a researcher. |
| **Supabase fundamentals** | Supabase official tutorial: database, auth, storage, RLS (supabase.com/docs) | 8 hours | The entire backend is Supabase. David must be comfortable with PostgreSQL, RLS policies, and the client SDK before building anything. |
| **Next.js API routes and server actions** | Next.js docs: Route Handlers, Server Actions (nextjs.org/docs) | 6 hours | David will build API endpoints that connect PleoChrome to external services. |
| **Brickken dashboard and docs** | Walk through every page of Brickken's dashboard and API docs when sandbox is available | 4 hours | The first integration David builds is Brickken. |

**Tier 2: Must Know Before Token Testing (Weeks 4-6)**

| Topic | Resources | Time | Why Now |
|-------|-----------|------|---------|
| **ERC-3643 standard (deep dive)** | Re-read BLOCKCHAIN-TOKENIZATION-DEEP-DIVE.md Sections 3-6. Then read the actual EIP: eips.ethereum.org/EIPS/eip-3643 | 6 hours | David needs to understand every contract in the ERC-3643 stack to configure Brickken correctly and debug issues. |
| **ethers.js v6** | Official docs (docs.ethers.org/v6). Focus on: providers, signers, contract instances, reading events. | 8 hours | ethers.js is how PleoChrome reads on-chain data (token balances, PoR values, transaction history). David does NOT need to write Solidity. |
| **Polygonscan usage** | Practice on testnet: read contracts, verify contracts, search transactions, read events | 2 hours | Polygonscan is the primary debugging tool for blockchain interactions. |
| **Smart contract interaction (read-only)** | Use ethers.js to call `balanceOf()`, `totalSupply()`, `isVerified()` on testnet contracts | 4 hours | David needs to build admin dashboard components that display on-chain data. |

**Tier 3: Must Know Before Chainlink Integration (Weeks 7-10)**

| Topic | Resources | Time | Why Now |
|-------|-----------|------|---------|
| **Chainlink architecture** | Re-read BLOCKCHAIN-TOKENIZATION-DEEP-DIVE.md Section 5. Then: docs.chain.link/architecture-overview | 4 hours | Understanding DON, aggregators, and external adapters is prerequisite for building PoR. |
| **Building Chainlink External Adapters** | Chainlink docs: External Adapters tutorial. Build a simple adapter that returns a hardcoded value, then one that calls a REST API. | 12 hours | This is the core technical work David owns for Chainlink PoR. Python or Node.js -- David's choice. |
| **Chainlink Proof of Reserve specifics** | Cyfrin Updraft PoR course (free): updraft.cyfrin.io/courses/chainlink-fundamentals/chainlink-proof-of-reserve | 4 hours | The specific PoR implementation pattern. |

**Tier 4: Nice to Know (Ongoing, Lower Priority)**

| Topic | Resources | Time | Why Now |
|-------|-----------|------|---------|
| **Solidity fundamentals** | CryptoZombies (cryptozombies.io) -- gamified Solidity course | 10 hours | David does NOT need to write Solidity for PleoChrome (Brickken handles contract deployment). But reading Solidity helps debug and understand what Brickken deploys. |
| **Smart contract testing (Hardhat/Foundry)** | Hardhat tutorial (hardhat.org/tutorial) | 8 hours | Useful if PleoChrome ever writes custom smart contracts. Not needed if using Brickken exclusively. |
| **Web3 security patterns** | Cyfrin Updraft Security course, OWASP Smart Contract Top 10 | 6 hours | Background knowledge for smart contract audit review. |
| **Polygon infrastructure** | Polygon docs: running a node, checkpoint system, bridge (docs.polygon.technology) | 4 hours | Infrastructure knowledge. Not operationally needed since Brickken handles deployment. |

### 7.2 Recommended Courses (Ranked)

| # | Course | Platform | Cost | Time | Priority |
|---|--------|----------|------|------|----------|
| 1 | **Supabase Full Course** | YouTube (The Net Ninja or Traversy Media) | Free | 4 hours | CRITICAL |
| 2 | **Next.js 15/16 Full Course** | YouTube (Traversy Media or Fireship) | Free | 3 hours | CRITICAL |
| 3 | **Chainlink Fundamentals** | Cyfrin Updraft (updraft.cyfrin.io) | Free | 8 hours | HIGH |
| 4 | **CryptoZombies** | cryptozombies.io | Free | 10 hours | MEDIUM |
| 5 | **Alchemy University: Ethereum Developer Bootcamp** | university.alchemy.com | Free | 20 hours | MEDIUM |
| 6 | **ethers.js v6 Documentation** | docs.ethers.org/v6 | Free | 6 hours | HIGH |
| 7 | **Hardhat Tutorial** | hardhat.org/tutorial | Free | 4 hours | LOW |
| 8 | **Patrick Collins' Blockchain Course** | YouTube / Cyfrin Updraft | Free | 32 hours (full) | LOW (watch selectively) |

### 7.3 Practical Milestones (David Should Be Able To)

| Week | Milestone |
|------|-----------|
| Week 2 | Create a Supabase project, define tables with RLS, authenticate users, upload files |
| Week 3 | Build a Next.js page that reads and writes to Supabase with proper auth |
| Week 4 | Set up MetaMask, connect to testnet, read a contract value using ethers.js |
| Week 6 | Navigate Brickken sandbox, deploy a test token, whitelist a wallet, mint tokens |
| Week 8 | Call Brickken API from a Next.js API route, display token info on an admin page |
| Week 10 | Build and deploy a Chainlink External Adapter that returns vault data |
| Week 12 | Full end-to-end: Brickken token + Chainlink PoR feed, both on testnet, both reading from PleoChrome |

---

## 8. Security Requirements

### 8.1 Smart Contract Security

| Requirement | Implementation | When |
|-------------|---------------|------|
| **Professional audit** | Engage CertiK, QuillAudits, Quantstamp, or Sherlock to audit deployed contracts | Before mainnet deployment |
| **Use pre-audited contracts** | Brickken's factory contracts are pre-audited. Custom modules need separate audit. | Ongoing |
| **Multi-sig admin wallet** | Deploy a Gnosis Safe (now "Safe") multi-sig wallet requiring 2-of-3 founders to approve admin operations (mint, burn, pause, freeze, upgrade) | Before mainnet deployment |
| **Timelock on admin functions** | 24-48 hour delay on critical operations (gives time to detect malicious transactions) | Phase 2 or 3 |
| **Upgrade key management** | Document who holds upgrade authority. Consider eventual renunciation once contracts are mature. | Pre-mainnet |
| **Bug bounty** | After mainnet deployment, consider Immunefi or HackerOne program ($10K-50K bounty pool) | Post-launch |

### 8.2 Data Security (Investor PII and Financial Data)

| Requirement | Implementation | When |
|-------------|---------------|------|
| **Encryption at rest** | Supabase encrypts all data at rest (AES-256). Column-level encryption for SSN and financial fields. | Database setup |
| **Encryption in transit** | All connections over TLS 1.3. Vercel handles SSL for the frontend. Supabase handles SSL for the database. | Default with both platforms |
| **Row-level security (RLS)** | Every table has RLS policies. Investors see only their own data. Partners see only their engaged assets. Admins see everything. | Database setup |
| **Access logging** | Every data access (read, write, delete) is logged in the audit trail with user ID, timestamp, IP, and user agent. | Database setup |
| **Data retention policy** | Define how long investor PII is retained after account closure. Comply with state privacy laws (CCPA, etc.). | Before first investor |
| **Backup and recovery** | Supabase automated backups. Additional manual backup schedule for critical data. Test recovery procedure quarterly. | Database setup |
| **PII minimization** | Only collect PII that is legally required. Do not store unnecessary personal data. | Design phase |

### 8.3 Wallet Management

| Requirement | Implementation | When |
|-------------|---------------|------|
| **Admin operations wallet** | Gnosis Safe multi-sig (2-of-3). Hardware wallet (Ledger) for each signer. | Before token deployment |
| **Deployment wallet** | Separate from admin wallet. Used only for contract deployment. Minimal MATIC balance. | Before deployment |
| **Treasury wallet** | If PleoChrome receives any cryptocurrency (fees, LINK for oracle), held in separate multi-sig. | When needed |
| **Investor wallets** | Non-custodial. Investors manage their own wallets. PleoChrome NEVER holds investor private keys. | Architecture decision (now) |
| **Key backup procedure** | Hardware wallet recovery phrases stored in bank safe deposit boxes (different banks for different signers). | Before deployment |
| **Wallet documentation** | Written procedures for: signing transactions, adding/removing signers, recovering from lost hardware wallet. | Before deployment |

### 8.4 API Security

| Requirement | Implementation | When |
|-------------|---------------|------|
| **API authentication** | All API routes require valid Supabase session token. No anonymous API access. | API development |
| **Rate limiting** | Max 100 requests/minute per authenticated user. Max 10 requests/minute for sensitive operations (KYC, mint). | API development |
| **Input validation** | Every API input validated with Zod schemas. No raw user input reaches the database. | API development |
| **CORS configuration** | Only pleochrome.com origin allowed. No wildcard CORS. | API development |
| **Webhook verification** | Brickken and other webhook sources verified by signature/secret validation. | Integration development |
| **Secret management** | All API keys in Vercel environment variables (encrypted) or Supabase Vault. Never in code, never in client-side JavaScript, never in git. | Now |
| **Dependency scanning** | GitHub Dependabot enabled. Review and merge security patches within 48 hours. | Now |

### 8.5 SOC 2 Preparation Roadmap

SOC 2 Type II is the gold standard for demonstrating security to institutional partners. PleoChrome should begin preparing now, even though the formal engagement is 12-18 months away.

| Phase | Timeline | Activities |
|-------|----------|------------|
| **Phase 0: Foundation** | Now - Month 3 | Establish security policies: access control, change management, incident response. Document all procedures as SOPs. Use audit trail from Day 1. |
| **Phase 1: Readiness Assessment** | Month 6-8 | Engage a SOC 2 readiness assessment firm ($5K-10K). They identify gaps against Trust Service Criteria (security, availability, processing integrity, confidentiality, privacy). |
| **Phase 2: Gap Remediation** | Month 8-12 | Address all findings from readiness assessment. Implement missing controls. Train team. |
| **Phase 3: Type I Audit** | Month 12-14 | SOC 2 Type I: point-in-time assessment. Costs $15K-25K. Proves controls exist at a specific date. |
| **Phase 4: Observation Period** | Month 14-20 | Operate under audited controls for 6+ months. The auditor observes. |
| **Phase 5: Type II Audit** | Month 20-24 | SOC 2 Type II: assessment over a period (6-12 months). Costs $20K-50K. Proves controls work consistently over time. |

**Total SOC 2 investment: $40K-85K over 24 months.** This is budgeted in the long-term plan, not the MVP.

---

## 9. MVP vs Full Platform

### 9.1 MVP: What Is Needed to Process Stone #1?

The minimum viable platform to process the first gemstone through to the first investor receiving tokens.

| Component | MVP Scope | What Can Wait |
|-----------|-----------|---------------|
| **Website** | Keep current landing page and portal as-is. Add proper auth to portal. | Full redesign, public investor pages |
| **Auth** | Supabase Auth for admin team (3 users). Email + password + MFA. | Investor auth, partner auth, magic links |
| **Admin dashboard** | Simple asset tracker: one asset, 5 gates, checklist items, document uploads. No fancy UI -- functional tables and forms. | Kanban board, real-time updates, charts |
| **Database** | Supabase with core tables: assets, gates, checklists, documents, compliance_screenings, audit_trail | Full schema from Section 4.3 |
| **Document storage** | Supabase Storage with manual organization. Upload GIA reports, appraisals, legal docs. | Automated categorization, version control |
| **Compliance tracking** | Spreadsheet-grade: table of KYC records, screening results, dates. Manual entry. | Automated reminders, calendar integration |
| **Investor data room** | DocSend ($45/mo). Upload PPM and supporting documents. Track who views what. | Custom-built data room in investor portal |
| **Investor onboarding** | Manual process: email PPM, process KYC through Brickken dashboard, whitelist wallet manually, mint through Brickken dashboard | Automated flow, self-service portal |
| **Brickken** | Dashboard usage only. Configure token, deploy, whitelist, mint through the Brickken web interface. No API integration. | API integration, automated workflows |
| **Chainlink PoR** | Manual attestation (Option A from Section 6.5). Vault issues custody confirmation. PleoChrome publishes on the website. No oracle feed. | Full Chainlink integration |
| **Reporting** | Manual: create quarterly reports in Google Docs/Sheets, export as PDF, email to investors | Automated report generation, investor portal access |
| **Monitoring** | Sentry free tier for error tracking. Manual Polygonscan checks for on-chain status. | Automated health checks, real-time alerts |

**MVP development time:** 4-6 weeks (David + Claude Code)
**MVP cost:** Supabase free tier, Vercel free tier, DocSend ($45/mo), tokenization platform (~$2,000/mo). Total: ~$2,100/mo in SaaS.

### 9.2 Stone #2-3: What Gets Built Next?

Once the first stone is live and generating revenue, the platform expands:

| Priority | Component | Why Now |
|----------|-----------|--------|
| P1 | **Investor portal** | 10+ investors need self-service access to holdings, reports, and documents |
| P1 | **Brickken API integration** | Multiple assets means manual dashboard clicks do not scale |
| P1 | **Automated compliance calendar** | More investors = more KYC expirations, more re-screenings, more deadlines |
| P2 | **Chainlink PoR (full integration)** | Revenue from first stone funds the development. Institutional credibility for second stone. |
| P2 | **Partner portal** | Multiple appraisers and vault partners need structured access |
| P2 | **Automated reporting** | Quarterly reports for 20+ investors across 2+ assets must be automated |
| P3 | **Multi-asset admin dashboard** | 3+ assets need a pipeline view, not individual asset tracking |
| P3 | **Secondary market prep** | Investigate ATS listing with tZERO or North Capital |
| P3 | **SOC 2 preparation** | Institutional partners will ask for it |

### 9.3 Institutional Credibility: What Must Exist for First Impressions

When a sophisticated investor, broker-dealer, or institutional partner evaluates PleoChrome, they will check:

| Credibility Marker | MVP Status | Full Platform Status |
|-------------------|-----------|---------------------|
| Professional website | YES (exists) | YES |
| Data room with PPM and supporting docs | YES (DocSend) | YES (custom portal) |
| Secure investor login | NO (manual process) | YES (Supabase Auth portal) |
| On-chain reserve verification | NO (manual attestation) | YES (Chainlink PoR) |
| Compliance documentation | YES (manual, but documented) | YES (automated, auditable) |
| Smart contract audit report | YES (Brickken pre-audited) | YES + custom audit |
| Multi-sig admin controls | YES (Gnosis Safe) | YES |
| Insurance certificates | YES (bound policies) | YES |
| SOC 2 report | NO | YES (12-18 months) |
| ATS secondary liquidity | NO | FUTURE (post-launch) |

**The MVP is sufficient for first-stone credibility IF:**
- The PPM is excellent (this is counsel's job)
- The Brickken pre-audited contracts provide audit assurance
- Multi-sig is in place for admin operations
- Insurance is bound and documented
- Manual processes are DOCUMENTED (written SOPs show intentionality)

---

## 10. Development Timeline

### Phase 1: Foundation (Weeks 1-4)

**Theme:** Backend infrastructure. David's learning. Security fundamentals.

| Week | Task | Owner | Deliverable |
|------|------|-------|-------------|
| 1 | Set up Supabase project (database, auth, storage) | David | Live Supabase project with test tables |
| 1 | Complete Supabase tutorial (database + auth + RLS) | David | Working knowledge of Supabase |
| 1 | Add environment variables to Vercel (Supabase URL, anon key, service key) | David | Env vars configured, not in code |
| 1 | Remove hardcoded passcode from portal. Replace with Supabase Auth. | David | Portal requires real login, not `pleo123` |
| 1 | Enable GitHub branch protection and basic CI (TypeScript check on PR) | David | Protected main branch, CI running |
| 2 | Implement core database schema: profiles, assets, gates, checklists, documents | David | Tables created with RLS policies |
| 2 | Build admin login page with MFA enrollment | David | Admin team can log in securely |
| 2 | Build document upload component (Supabase Storage) | David | Can upload and retrieve files |
| 2 | Complete Next.js API routes tutorial | David | Can build authenticated API endpoints |
| 3 | Build asset detail page: view asset, gate statuses, checklist items | David | Single-asset admin view |
| 3 | Build audit trail: automatic logging of all write operations | David | `audit_trail` table populating |
| 3 | Install and configure Sentry for error tracking | David | Error monitoring active |
| 3 | Set up MetaMask, connect to testnet, basic ethers.js reading | David | Can read a test contract from code |
| 4 | Build compliance screening log: input form + table view | David | Can record and view screening results |
| 4 | Build document management: list, filter, download per asset | David | Documents organized by asset and type |
| 4 | Complete DKIM setup (GoDaddy DNS record) | David | Authenticated email from @pleochrome.com |
| 4 | Integration test: end-to-end auth flow + data write + audit log | David | Smoke test passing |

**Phase 1 Gate:** Admin dashboard exists with auth, asset tracking, document management, and audit trail. David is comfortable with Supabase, Next.js API routes, and MetaMask.

### Phase 2: Core Integrations (Weeks 5-8)

**Theme:** Brickken sandbox. DocSend data room. Investor data model.

| Week | Task | Owner | Deliverable |
|------|------|-------|-------------|
| 5 | Begin Brickken sandbox testing (Phase 1-2 from Section 5.2) | David | Sandbox access, test wallets, environment documented |
| 5 | Set up DocSend data room with placeholder documents | David | Data room URL ready for counsel-provided documents |
| 5 | Build investor table in database: KYC status, accreditation, wallet, subscription | David | Investor records can be tracked |
| 6 | Brickken sandbox testing (Phase 3-4): compliance configuration, token operations | David | All Brickken features tested on testnet |
| 6 | Build compliance calendar: table of upcoming deadlines with status indicators | David | Compliance deadlines visible |
| 6 | Research and select email provider (Resend recommended) for transactional email | David | Email sending configured |
| 7 | Brickken sandbox testing (Phase 5): API integration from PleoChrome API routes | David | Can call Brickken API from Next.js |
| 7 | Build token status component: display token name, supply, holders from Brickken API or ethers.js | David | Admin dashboard shows on-chain data |
| 7 | Set up DocuSign or PandaDoc for subscription agreement signing | David | E-signature flow working |
| 8 | Brickken sandbox testing (Phase 6): full end-to-end flow | David | Complete flow documented |
| 8 | Build investor onboarding workflow in admin dashboard: track each investor's progress | David | Can manage investor pipeline |
| 8 | Integration testing: Supabase + Brickken testnet + DocSend + email | David | All systems talking to each other |

**Phase 2 Gate:** Brickken integration tested on testnet. Admin dashboard manages assets, investors, documents, and compliance. DocSend data room ready. E-signature flow working. The team can process an investor manually using the admin tools.

### Phase 3: Investor-Facing (Weeks 9-12)

**Theme:** Chainlink PoR development. Investor portal (if building). Mainnet preparation.

| Week | Task | Owner | Deliverable |
|------|------|-------|-------------|
| 9 | Begin Chainlink External Adapter development | David | Basic adapter returning hardcoded data |
| 9 | Build investor portal login (Supabase Auth, magic links) | David | Investors can create accounts and log in |
| 9 | Build data room page in investor portal (replaces DocSend over time) | David | Investors can view and download offering documents |
| 10 | Connect External Adapter to vault data source (API or manual feed) | David | Adapter returns real reserve data |
| 10 | Build holdings page in investor portal: token balance, value, transaction history | David | Investors see their holdings |
| 10 | Deploy Chainlink PoR feed on Polygon testnet | David | PoR feed live on testnet |
| 11 | Test oracle-gated minting on testnet | David | Minting blocked when reserves insufficient |
| 11 | Build quarterly report template (React-PDF or manual) | David | Can generate investor statement PDFs |
| 11 | Security review: audit all RLS policies, API auth, input validation | David | Security checklist passed |
| 12 | Deploy PoR feed to Polygon mainnet (if Chainlink BUILD accepted) | David | PoR feed live on mainnet |
| 12 | Mainnet token deployment preparation: parameter checklist, multi-sig setup | David + Shane | Deployment checklist complete |
| 12 | Load testing and performance review | David | Platform handles expected traffic |

**Phase 3 Gate:** Chainlink PoR working (testnet or mainnet). Investor portal functional. Mainnet deployment parameters prepared and reviewed by all three founders.

### Phase 4: Testing and Hardening (Weeks 13-16)

**Theme:** Smart contract audit review. Mainnet deployment. First investor processing.

| Week | Task | Owner | Deliverable |
|------|------|-------|-------------|
| 13 | Review smart contract audit report (from external auditor) | David + Shane | All findings addressed |
| 13 | Set up Gnosis Safe multi-sig wallet (2-of-3, hardware wallets) | David + Shane | Multi-sig ready for mainnet operations |
| 13 | Final parameter review with all three founders | All | Written confirmation from all three |
| 14 | **MAINNET DEPLOYMENT** | David (with Shane and Chris confirming) | Token live on Polygon mainnet |
| 14 | Connect PoR feed to mainnet (if ready) | David | PoR monitoring live |
| 14 | End-to-end test on mainnet: whitelist test wallet, mint 1 token, verify, burn | David | Smoke test passed |
| 15 | Process first real investor through the full pipeline | Shane + David | First investor holds tokens |
| 15 | Verify all compliance records are captured correctly | Chris | Compliance audit passing |
| 16 | Process second and third investors | Shane + David | Multiple investors onboarded |
| 16 | First investor report generated and distributed | David | Reporting pipeline working |

**Phase 4 Gate:** Token live on mainnet. First investors processed. Compliance records complete. Reporting working.

### Phase 5: Iteration and Scaling (Ongoing)

**Theme:** Refine based on operational experience. Prepare for second asset.

| Month | Focus |
|-------|-------|
| Month 5 | Process remaining investor pipeline for first asset. Refine admin workflows based on operational friction. |
| Month 6 | Begin second asset intake. Apply all SOPs from first asset. Evaluate whether partner portal is needed. |
| Month 7 | If 10+ investors: automate quarterly reporting. If multiple assets: build multi-asset dashboard view. |
| Month 8 | SOC 2 readiness assessment engagement. Begin documenting all controls formally. |
| Month 9 | Evaluate ATS listing for secondary trading (tZERO, North Capital). |
| Month 10 | If not yet done: full Chainlink PoR on mainnet. |
| Month 11 | Consider hiring: fractional CFO for SPV financial management and K-1 preparation. |
| Month 12 | Annual review: platform performance, security posture, roadmap for Year 2. |

### Development Effort Summary

| Phase | Duration | Primary Developer | Key Output |
|-------|----------|-------------------|-----------|
| Phase 1: Foundation | 4 weeks | David (+ Claude Code) | Admin dashboard, auth, database, documents, audit trail |
| Phase 2: Core Integrations | 4 weeks | David (+ Claude Code) | Brickken testnet, investor tracking, data room, e-signatures |
| Phase 3: Investor-Facing | 4 weeks | David (+ Claude Code) | Chainlink PoR, investor portal, holdings, reports |
| Phase 4: Testing/Hardening | 4 weeks | David + Shane + Chris | Mainnet deployment, first investors, compliance verification |
| Phase 5: Iteration | Ongoing | David (+ future hires) | Multi-asset, ATS, SOC 2, automation |

**Total to first investor:** 14-16 weeks of development, aligned with the operational timeline in CRITICAL-NEXT-STEPS-AND-ACTION-PLAN.md.

---

## Appendix A: Technology Decision Log

Every major technology decision should be recorded here as it is made. Format:

```
DECISION: [What was decided]
DATE: [When]
DECIDED BY: [Who]
ALTERNATIVES CONSIDERED: [What else was evaluated]
RATIONALE: [Why this choice]
REVERSIBILITY: [Easy/Medium/Hard to change later]
```

**Decision 1: Supabase as Backend**
- Date: March 2026 (recommendation)
- Alternatives: Firebase, custom Node/Express + PostgreSQL, PocketBase
- Rationale: PostgreSQL with RLS for security-sensitive financial data. Built-in auth, storage, and realtime. Lower cost than Firebase at scale. Better SQL support than Firebase (which uses NoSQL). David's SQL expertise maps directly.
- Reversibility: Medium. Database schema and RLS policies are portable to any PostgreSQL. Auth would require migration.

**Decision 2: Keep Next.js**
- Date: March 2026 (confirmation)
- Alternatives: SvelteKit, Remix, Python/Django + React SPA
- Rationale: Already built, working, deployed. Full-stack (SSR + API routes). Vercel deployment. React ecosystem compatibility.
- Reversibility: Hard. Would require full rewrite.

**Decision 3: Tokenization Platform Selection** [SUPERSEDED -- see Decisions #003, #004]
- Date: March 2026 (original recommendation: Brickken); 2026-03-27 (updated to platform-agnostic)
- Alternatives under evaluation: Brickken (ERC-3643), Zoniqx (ERC-7518), Securitize, Tokeny, custom deployment
- Rationale for platform-agnostic approach: (a) Zoniqx call (2026-03-26) revealed compelling alternative with Chainlink PoR already integrated; (b) ERC-7518 vs ERC-3643 is fundamental architectural choice; (c) Platform agnosticism is itself a competitive advantage -- PleoChrome as orchestration layer above any tokenization platform.
- Reversibility: Medium. Token contracts are on-chain and platform-agnostic. Either platform's contracts function independently of the dashboard.
- Timeline: 30-day parallel evaluation, then commit.

---

## Appendix B: Glossary for David

| Term | What It Means for PleoChrome Development |
|------|------------------------------------------|
| **RLS (Row-Level Security)** | Supabase feature where database access rules are defined per-row. Example: `SELECT * FROM investors WHERE id = auth.uid()` -- each investor sees only their own row. This is the foundation of PleoChrome's data security. |
| **Edge Function** | A serverless function that runs on Supabase's infrastructure (Deno runtime). Used for integrations that cannot run in the browser (API keys, vault API calls, webhook processing). |
| **Server Action** | A Next.js feature where a function runs on the server but is called from a client component. Used for form submissions and data mutations. Simpler than API routes for straightforward operations. |
| **Middleware** | Code that runs BEFORE every request to a Next.js page. Used for auth checks: "Is this user logged in? Do they have the right role? If not, redirect to /login." |
| **Provider (ethers.js)** | A connection to a blockchain node. `new ethers.JsonRpcProvider("https://polygon-rpc.com")` gives you read access to Polygon. You call `provider.getBalance(address)` to check balances. |
| **Signer (ethers.js)** | A provider plus a private key. Signers can WRITE to the blockchain (send transactions). Used when PleoChrome triggers on-chain operations (minting, whitelisting). |
| **Contract Instance (ethers.js)** | A JavaScript object representing a deployed smart contract. Created with: `new ethers.Contract(address, abi, providerOrSigner)`. You call functions on it like `contract.balanceOf(wallet)`. |
| **ABI** | The "interface definition" of a smart contract. A JSON file that tells ethers.js what functions the contract has, what parameters they take, and what they return. The tokenization platform provides ABIs for their deployed contracts. |
| **Testnet** | A practice blockchain where tokens have no real value. Polygon Amoy is the testnet. Use it to test everything before deploying to mainnet with real money. |
| **Gas** | The fee paid for blockchain transactions. On Polygon, gas costs fractions of a penny. David's deployment wallet needs a small amount of MATIC to pay gas. |

---

*This document was prepared on March 19, 2026. It should be reviewed and updated monthly as technology decisions are made and the platform evolves.*

*Last updated: March 19, 2026*
