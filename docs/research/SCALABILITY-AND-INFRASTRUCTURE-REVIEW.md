# PleoChrome Scalability and Infrastructure Review

**Date:** 2026-03-27
**Prepared for:** Shane Pierson (CEO), David Whiting (CTO/COO), Chris Ramsey (CRO)
**Classification:** Internal Strategic Document
**Purpose:** Infrastructure roadmap from 3-founder startup to $500M+ AUM enterprise platform

---

## EXECUTIVE SUMMARY

PleoChrome's current architecture (Next.js 16 + Supabase + Vercel) is the correct foundation for Phases 1-2. The stack is inexpensive, developer-friendly, and fast to iterate on. It does NOT need to change today.

However, the trajectory from "3 founders managing 1 asset" to "25-40 people managing 50+ assets across 4 jurisdictions with white-label licensing" requires specific architectural decisions to be made NOW --- not because you need to build them now, but because building the wrong abstractions today creates expensive migrations later.

This document identifies exactly which decisions are load-bearing now, which should be deferred, and when each infrastructure transition needs to happen.

**The single most important finding:** PleoChrome should adopt an API-first architecture from Day 1 of CRM development. Every feature built for the admin dashboard should be a documented API endpoint that happens to have a Next.js frontend. This one decision enables the investor portal, partner portal, white-label platform, and mobile app without rewriting anything.

---

## TABLE OF CONTENTS

1. [Stage-by-Stage Infrastructure Analysis](#1-stage-by-stage-infrastructure-analysis)
2. [Architecture Decisions to Make NOW](#2-architecture-decisions-to-make-now)
3. [What to Explicitly Defer](#3-what-to-explicitly-defer)
4. [Technology Stack Evolution](#4-technology-stack-evolution)
5. [Cost Projections at Each Stage](#5-cost-projections-at-each-stage)
6. [Risk Factors for Each Transition](#6-risk-factors-for-each-transition)

---

## 1. STAGE-BY-STAGE INFRASTRUCTURE ANALYSIS

### Stage 0: Today (3 founders, 1 asset, $0 revenue)

**Current state:** Static marketing site on Vercel. No backend, no database, no auth beyond a hardcoded passcode. Zero infrastructure.

**What infrastructure is needed:**
- Supabase project (Pro plan, $25/month) with the Powerhouse CRM schema
- Proper authentication (Supabase Auth with MFA for the 3 founders)
- Document storage (Supabase Storage --- 5 buckets as designed)
- Basic admin dashboard (Next.js pages reading/writing Supabase)
- Error monitoring (Sentry free tier)
- CI/CD (GitHub Actions for type-checking and linting)

**What breaks at this stage:** Nothing breaks. The entire Powerhouse CRM schema fits on Supabase's $25/month Pro plan. Year 1 estimates: 13 tables, ~70,000 rows max, ~500MB storage including documents. Supabase Pro gives you 8GB database, 100GB storage, and 250GB bandwidth. You will use less than 10% of capacity.

**What should be built now to avoid pain later:**
1. API-first architecture (see Section 2.2)
2. Tenant ID column on every table (see Section 2.1)
3. Immutable audit trail with the exact structure in the CRM schema (already designed correctly)
4. Environment variable management (Vercel env vars from Day 1 --- no secrets in code, ever)

---

### Stage 1: 6 Months (3-5 assets, securities counsel engaged, first offering live)

**What changes:** The CRM has real data. 15-40 investor records with PII (names, addresses, KYC documents, accreditation records). Documents are flowing (GIA reports, appraisals, legal docs). The compliance engine needs to actually work --- not just exist as schema.

**Infrastructure changes needed:**
- **Upgrade Supabase compute:** Move from Starter to Small compute ($50-75/month) if you see any latency on queries. Unlikely at this scale, but monitor.
- **Column-level encryption for PII:** Implement `pgcrypto` extension for SSN, financial fields. Supabase encrypts at rest (AES-256) but column-level encryption adds defense-in-depth for CCPA/state privacy compliance.
- **Backup validation:** Supabase Pro includes daily backups with 7-day retention. Test a restore. Document the procedure. You need to know your RPO (Recovery Point Objective) and RTO (Recovery Time Objective) before you have real investor money.
- **DocSend for investor data room:** $45/month. Do NOT build a custom data room yet. DocSend gives you document analytics (who viewed what, for how long) that are valuable for sales intelligence.
- **Task queue for async operations:** Add Inngest (free tier: 25,000 runs/month) for background jobs --- compliance screening reminders, insurance expiry notifications, KYC refresh scheduling. Do NOT put cron logic in Vercel serverless functions.

**What breaks at this stage:** Nothing breaks architecturally. The stress is operational, not technical. The risk is human: 3 founders manually managing 15-40 investor KYC records, quarterly re-screenings, insurance renewals, and document expirations across 3-5 assets. The compliance calendar becomes the most important feature.

**What should be built now:**
1. Automated compliance reminders via Inngest (event-driven, not cron-based)
2. Investor portal v1 (read-only: data room access, holdings display, quarterly reports)
3. Tokenization platform API integration (replace manual dashboard clicks)

---

### Stage 2: 12 Months (10+ assets, $20M+ AUM, 15-35 investors, 1-2 employees)

**What changes:** This is the first real infrastructure inflection point. The team grows beyond 3 people. The platform processes multiple stones simultaneously. New employees need role-based access. Investors expect a professional portal. Partners (appraisers, vault operators, counsel) need structured access instead of email attachments.

**Infrastructure changes needed:**
- **Upgrade Supabase to Team plan ($599/month):** You now need SOC 2 Type II compliance from your infrastructure provider. Supabase Team plan provides this. You also get priority support, which matters when your database holds $20M+ AUM worth of records.
- **Separate API layer (tRPC or Hono):** At 10+ assets, the admin dashboard, investor portal, and partner portal all need the same data through different lenses. A shared API layer prevents duplicate business logic across three UIs. tRPC is ideal because it provides end-to-end type safety with TypeScript and works seamlessly with Next.js.
- **Partner portal (v1):** Appraisers, vault operators, and counsel need scoped access. This is NOT a separate application --- it is the same Next.js app with different RLS policies and route groups. See Section 2.5.
- **Investor portal (v2):** Add subscription flow, holdings dashboard, wallet connection. This is where API-first pays off --- the investor portal is a different UI on the same API.
- **Automated reporting:** React-PDF for quarterly reports. Generate in Inngest background job, store in Supabase Storage, notify investor via email (Resend).
- **SOC 2 readiness assessment:** Engage a readiness firm ($5K-10K). This is not the audit itself --- it is the gap analysis. Your audit trail, RLS policies, and encryption are already designed correctly. The gaps will be in operational procedures (change management, incident response, access reviews).

**What breaks at this stage:**
- **Manual investor onboarding.** At 15+ investors across 3+ offerings, manually emailing PPMs, tracking KYC through spreadsheets, and minting tokens through the tokenization platform dashboard is unsustainable. The investor portal with self-service KYC and subscription flow becomes P0.
- **Manual quarterly reporting.** 35 investors x 3 assets = 105 individual investor statements per quarter. This MUST be automated.
- **Partner communication via email.** Appraisers emailing reports, vault operators emailing custody confirmations, counsel emailing draft PPMs --- all of this needs to flow through the platform for audit trail completeness.

**What should be built now:**
1. The shared API layer (tRPC)
2. Automated quarterly report generation pipeline
3. Partner document submission portal

---

### Stage 3: 24 Months (50+ assets, $100M+ AUM, 100+ investors, partner portals, white-label potential)

**What changes:** This is the major infrastructure transition. PleoChrome goes from "startup" to "platform." The data volumes increase by 10x. International jurisdictions add compliance complexity. White-label licensing requires multi-tenancy.

**Infrastructure changes needed:**
- **Upgrade to Supabase Enterprise ($2,000+/month):** You need dedicated infrastructure, private VPC, custom SLAs, and HIPAA-grade isolation. At $100M+ AUM with 100+ investors' PII, shared infrastructure is no longer acceptable to institutional partners or auditors. Enterprise plan also gives you regional replication for EU expansion (MiCA requires data to remain in EU jurisdiction).
- **Multi-tenancy architecture activation:** The `tenant_id` columns you added in Stage 0 now activate. See Section 2.1 for details. Each white-label licensee gets a tenant ID. Their data is isolated by RLS. Their UI is branded via configuration, not separate deployments.
- **White-label API:** The tRPC API layer from Stage 2 gets documented as an OpenAPI spec. Licensees integrate via API. Their investor portals call your API with their tenant credentials. Revenue: $5,000-15,000/month per licensee.
- **EU data residency:** MiCA requires EU investor data to reside in the EU. Supabase Enterprise supports regional deployment. Create a second Supabase project in EU region (Frankfurt or London). Route EU investors to the EU project. This is the one scenario where self-hosting Supabase might be worth evaluating --- but likely overkill. Supabase's EU region options should suffice.
- **Advanced monitoring:** Move beyond Sentry free tier. Datadog or Grafana Cloud for infrastructure monitoring, custom dashboards, and compliance-grade logging. Budget: $200-500/month.
- **SOC 2 Type II audit:** The formal audit ($20K-50K). By Month 24, you should have been operating under audited controls for 6+ months. The report is a prerequisite for institutional partnerships, white-label licensing, and any enterprise sales motion.

**What breaks at this stage:**
- **Supabase Pro/Team plan performance.** At 50+ assets with full JSONB metadata, 100+ investors with KYC records, 500+ partner document submissions, and 50,000+ audit trail entries, query performance on shared infrastructure becomes unpredictable. The `metadata` JSONB field on `stones` is the specific bottleneck --- GIN index scans on large JSONB documents are compute-intensive. Dedicated compute eliminates noisy-neighbor issues.
- **Single-region deployment.** EU/UAE/Singapore expansion means data must be close to users for both latency and regulatory reasons. Multi-region is not optional at this stage.
- **Manual white-label onboarding.** If you are licensing the platform, each licensee needs automated provisioning (database tenant creation, branding configuration, API key generation, SSL for custom domains). This is the "zero-touch provisioning" that enterprise SaaS requires.

**What should be built now:**
1. White-label tenant provisioning system
2. OpenAPI documentation for partner/licensee API
3. EU-region database deployment
4. SOC 2 Type II evidence collection pipeline

---

### Stage 4: 36 Months ($500M+ AUM, international jurisdictions, technology licensing)

**What changes:** PleoChrome is now a regulated financial technology company operating across 4+ jurisdictions. The platform is the product. The question shifts from "does Supabase work?" to "should we own our infrastructure?"

**Infrastructure changes needed:**
- **Evaluate self-hosted Supabase or managed PostgreSQL (AWS RDS/Aurora):** At $500M+ AUM, the business-critical question is: "What happens if Supabase has a multi-hour outage?" Supabase's Enterprise SLA covers this to a degree, but at this scale, some compliance-heavy fintech companies prefer to own the database layer entirely. The evaluation criteria:
  - If Supabase Enterprise SLA meets your compliance requirements AND the cost is reasonable: stay on Supabase. The operational overhead of self-hosting is significant and requires a dedicated DevOps hire ($150K-200K/year).
  - If regulatory requirements in any jurisdiction mandate that you demonstrate full infrastructure control: migrate to self-hosted Supabase (Docker) on AWS/GCP within a VPC, or to AWS RDS PostgreSQL with your own auth layer.
  - **Key finding from research:** Supabase's PostgreSQL is standard PostgreSQL. There is NO proprietary lock-in. A migration to self-hosted or AWS RDS is a configuration change, not a rewrite, IF you have been using standard PostgreSQL features (which the Powerhouse CRM schema does). The RLS policies, triggers, functions, and indexes all transfer directly.

- **Dedicated API infrastructure:** If white-label licensing generates significant revenue (5-10 licensees at $10K/month = $600K-1.2M/year), the API layer may need to move off Vercel serverless functions onto dedicated infrastructure (AWS ECS, Railway, or Fly.io) for predictable latency and cost. Vercel's 900-second function timeout (Enterprise plan) and 4.5MB request body limit become constraints for heavy report generation and batch operations.

- **Cross-region active-active deployment:** Not just "EU data in EU region" but true active-active where any region can serve any request with low latency. This is complex, expensive, and likely unnecessary until $1B+ AUM. Defer unless a specific regulatory requirement demands it.

- **Dedicated security team or outsourced SOC:** With $500M+ AUM, you are a target. 24/7 security monitoring, penetration testing (quarterly), and incident response capability are non-negotiable.

**What breaks at this stage:**
- **Vercel pricing at scale.** Vercel Enterprise pricing is opaque, but at 100+ licensees, thousands of daily API calls, and multiple regions, costs can become significant. Evaluate whether the DX benefits of Vercel justify the premium over a self-managed deployment to AWS/GCP.
- **Supabase Edge Functions for complex integrations.** Edge Functions are Deno-based and have cold start times. At this scale, complex integration workflows (tokenization platform API + Chainlink + vault API + KYC provider in a single transaction) may need a more robust serverless or container-based approach.

---

## 2. ARCHITECTURE DECISIONS TO MAKE NOW

These are the decisions that must be made before writing the first line of CRM code. Getting these wrong creates migrations that cost months, not days.

### 2.1 Multi-Tenancy: Row-Level Security Per Tenant (RLS, NOT Schema-Per-Tenant)

**Decision: Use a shared database with RLS-based tenant isolation.**

**Rationale:**
- PleoChrome's white-label scenario is 5-10 licensees, not 10,000. RLS handles this scale trivially.
- Schema-per-tenant creates N copies of every migration, N copies of every index, and N times the operational complexity. It is designed for scenarios with 1,000+ tenants, strict per-tenant backup requirements, or tenants that need completely different schemas. PleoChrome has none of these.
- PostgreSQL's RLS adds 1-5% overhead on queries (research confirmed). At PleoChrome's data volumes, this is negligible.
- Supabase's RLS is battle-tested and the entire Powerhouse CRM schema already uses it.

**Implementation (do NOW, costs nothing):**

Add a `tenant_id UUID DEFAULT 'pleochrome-default'` column to every table in the CRM schema. Today, all data gets the default tenant ID. When white-label arrives (Month 24+), new tenants get their own UUID. RLS policies filter by tenant automatically.

```sql
-- Example: Add tenant_id to stones table
ALTER TABLE stones ADD COLUMN tenant_id UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001';

-- RLS policy becomes:
CREATE POLICY "tenant_isolation" ON stones
  USING (tenant_id = current_setting('app.tenant_id')::uuid);
```

**What this enables later:** A white-label licensee's admin dashboard, investor portal, and partner portal all run on the same codebase. The difference is a single session variable (`app.tenant_id`) that gates ALL data access. Zero code changes for multi-tenancy --- only configuration.

**AWS research confirms this approach:** "Multi-tenant data isolation with PostgreSQL Row Level Security" is AWS's recommended pattern for SaaS applications with < 1,000 tenants.

**Cost of getting this wrong:** If you build without `tenant_id` and later need multi-tenancy, you must add the column to every table, backfill every row, rewrite every RLS policy, and test every query. For 13 tables with 50+ RLS policies, this is a 2-4 week migration with high risk of data leakage bugs.

---

### 2.2 API-First Architecture: tRPC as the Shared API Layer

**Decision: Build the CRM as a typed API layer (tRPC) with Next.js as one of potentially many frontends.**

**Rationale:**
- The Powerhouse CRM schema already defines the data model. The missing piece is the business logic layer --- the code that enforces gate conditions, validates compliance state, manages document versions, and orchestrates token operations.
- If this logic lives in Next.js server actions scattered across page components, it CANNOT be reused by the investor portal, partner portal, white-label API, or future mobile app without duplication.
- tRPC provides end-to-end TypeScript type safety (changes to the API schema cause compile-time errors in all consumers), which is critical for a compliance platform where a mistyped field can mean a regulatory violation.

**Implementation architecture:**

```
/src
  /server
    /trpc              <-- tRPC router definitions
      /routers
        stones.ts      <-- Asset CRUD, gate progression, metadata updates
        investors.ts   <-- Investor onboarding, KYC tracking, holdings
        documents.ts   <-- Upload, version, lock, legal hold
        compliance.ts  <-- Screenings, audit trail, calendar
        partners.ts    <-- Partner management, scoped access
        reports.ts     <-- NAV calculation, quarterly reports
        tokens.ts      <-- Mint, burn, freeze, whitelist (via platform API)
        notifications.ts
      context.ts       <-- Auth context, tenant context, Supabase client
      trpc.ts          <-- tRPC instance configuration
    /services          <-- Business logic (pure functions, testable)
      gate-engine.ts   <-- Gate condition validation
      compliance.ts    <-- KYC/AML business rules
      valuation.ts     <-- Variance analysis, NAV calculation
      notifications.ts <-- Event-to-notification mapping
    /integrations      <-- External service clients
      tokenization.ts  <-- Brickken/Zoniqx API client (abstracted)
      chainlink.ts     <-- PoR feed reader
      kyc-provider.ts  <-- Sumsub/platform KYC client
      docusign.ts      <-- E-signature client
      email.ts         <-- Resend client
  /app
    /admin             <-- Admin dashboard (calls tRPC)
    /investor          <-- Investor portal (calls tRPC with investor context)
    /partner           <-- Partner portal (calls tRPC with partner context)
    /api
      /trpc/[trpc]     <-- tRPC HTTP handler (enables external API access)
```

**What this enables later:**
- **Investor portal:** Same API, different UI, different auth context (investor sees only their own data via RLS).
- **Partner portal:** Same API, scoped by partner type (appraiser sees GIA reports + can upload appraisals; vault operator sees custody docs + can upload confirmations).
- **White-label API:** The tRPC router is already an HTTP API via the `/api/trpc/[trpc]` handler. Add API key auth and rate limiting = external API.
- **Mobile app:** React Native calls the same tRPC endpoints. No backend rewrite.

**Cost of NOT doing this:** Building admin pages with inline server actions works for Phase 1 but requires a complete rewrite when the investor portal needs the same business logic. Every "quick" server action becomes a migration liability.

---

### 2.3 Document Storage: Supabase Storage Now, Evaluate at 50+ Assets

**Decision: Use Supabase Storage for Phases 1-3. Evaluate S3/GCS/dedicated DMS at Phase 4 only if specific requirements emerge.**

**Rationale for Supabase Storage:**
- Integrated with Supabase RLS (same access policies as database tables)
- S3-compatible API (migration to raw S3 is straightforward if needed)
- Supports signed URLs for time-limited document access (critical for investor data room)
- Pro plan: 100GB storage included, $0.021/GB/month after
- The CRM schema already designs 5 storage buckets with mime type restrictions and size limits

**Scale analysis (worst case, 36 months):**

| Asset Count | Docs/Asset | Avg Doc Size | Total Storage | Monthly Cost |
|-------------|-----------|-------------|---------------|--------------|
| 5 | 50 | 5MB | 1.25 GB | $0 (within Pro tier) |
| 20 | 60 | 5MB | 6 GB | $0 (within Pro tier) |
| 50 | 75 | 5MB | 18.75 GB | $0 (within 100GB) |
| 100 | 80 | 5MB | 40 GB | $0 (within 100GB) |
| 500 | 100 | 5MB | 250 GB | ~$3/month overage |

**Conclusion:** Document storage is NOT the bottleneck. Even at 500 assets with 100 documents each (an aggressive estimate), you are at 250GB. Supabase handles this trivially. The 500GB per-file limit (Pro plan) also means meeting recordings and large appraisal files are fine.

**When to reconsider:**
- If a regulatory requirement mandates documents be stored in a specific geographic region that Supabase doesn't support (unlikely --- Supabase supports AWS us-east, eu-west, ap-southeast)
- If you need advanced DMS features (OCR, full-text search across documents, automated classification). These are better handled by a separate service (e.g., AWS Textract for OCR) that stores results in your database while documents remain in Supabase Storage.
- If white-label licensees require completely segregated storage (different S3 buckets per tenant). This is solvable with path-based isolation within Supabase Storage.

**Do NOT use Box, Google Cloud Storage, or Dropbox Business as a DMS.** These add a second auth system, a second access control model, and a second audit trail. The entire point of the Powerhouse CRM is unified compliance tracking. Splitting documents into a separate system breaks that guarantee.

---

### 2.4 Investor Portal: Build at Month 6, Not Before

**Decision: Do NOT build the investor portal for Stone 1. Use DocSend ($45/month) for the data room. Build the investor portal when Stone 2-3 pipeline is confirmed and first revenue is collected.**

**Rationale:**
- Stone 1 has 1-3 investors. Manual onboarding (email, DocuSign, manual KYC through tokenization platform dashboard) is sufficient and actually preferable --- you learn the friction points before automating them.
- Building an investor portal before you have a single investor is premature optimization. You don't yet know what investors actually need to see, how they interact with documents, or what questions they ask.
- DocSend provides document analytics (time spent per page, re-visits) that inform the eventual custom portal design.

**When the investor portal becomes P0:**
- 10+ investors across 2+ offerings (Month 8-10)
- Quarterly reporting obligations kick in (3 months after first close)
- BD partner (Dalmore/Rialto) requires a branded investor experience

**Investor portal data exposure (progressive):**

| Phase | Data Exposed | Auth Level |
|-------|-------------|-----------|
| v1 (Month 6-8) | Data room (PPM, GIA summaries), holdings balance, quarterly reports, K-1 downloads | Magic link + MFA |
| v2 (Month 12-18) | + Subscription flow, real-time NAV, distribution history, wallet connection, Chainlink PoR status | Magic link + MFA + KYC verified |
| v3 (Month 24+) | + Secondary market access (ATS link), multi-asset portfolio view, push notifications, redemption requests | Magic link + MFA + KYC verified + accreditation current |

**Relationship to CRM:** The investor portal reads the SAME database as the admin dashboard. The difference is RLS: investors see only their own records (their `investor_id` matches). The tRPC API serves both UIs. Zero data duplication.

---

### 2.5 Partner Portal: Scoped Access Within the Same Application

**Decision: The partner portal is NOT a separate application. It is a route group within the same Next.js app with partner-type-scoped RLS policies.**

**Architecture:**

```
/app
  /partner
    /layout.tsx                    <-- Partner shell (branded, scoped nav)
    /(appraiser)
      /assets/[id]/page.tsx        <-- Asset view (GIA reports only, no financials)
      /upload/page.tsx             <-- Appraisal upload form
    /(vault)
      /assets/[id]/page.tsx        <-- Asset view (custody docs only)
      /confirm/page.tsx            <-- Custody confirmation upload
    /(legal)
      /assets/[id]/page.tsx        <-- Full doc view for engaged assets
      /upload/page.tsx             <-- Legal document upload
    /(bd)
      /offerings/page.tsx          <-- Active offerings, investor pipeline stats
      /compliance/page.tsx         <-- BD compliance reports
```

**RLS implementation:**

```sql
-- Partners see only assets they are engaged on
CREATE POLICY "partner_asset_access" ON stones
  FOR SELECT
  USING (
    id IN (
      SELECT ap.stone_id FROM asset_partners ap
      JOIN partners p ON ap.partner_id = p.id
      JOIN contacts c ON p.primary_contact_id = c.id
      WHERE c.auth_user_id = auth.uid()
    )
  );

-- Appraisers cannot see other appraisals (only GIA reports and their own submissions)
CREATE POLICY "appraiser_document_access" ON documents
  FOR SELECT
  USING (
    document_category IN ('certification', 'engagement')
    OR uploaded_by_id = (SELECT id FROM team_members WHERE auth_user_id = auth.uid())
  );
```

**What this enables:** Each partner type sees exactly the data they should see, nothing more. An appraiser cannot see financial terms, investor information, or other appraisers' reports. A vault operator cannot see appraisals. A BD partner sees offering stats but not raw vault inventory. All enforced at the database level --- not application logic that can be bypassed.

---

### 2.6 Reporting and Export: React-PDF + Inngest Pipeline

**Decision: Build automated report generation using React-PDF templates triggered by Inngest scheduled events.**

**Architecture:**

```
Inngest Cron (quarterly)
  -> Generate NAV report per asset (React-PDF)
  -> Generate investor statement per investor per asset (React-PDF)
  -> Store PDFs in Supabase Storage (/exports/{year}/{quarter}/{asset_id}/)
  -> Update investor portal (mark report as available)
  -> Send notification email via Resend
  -> Log in audit trail
```

**Report types and automation timeline:**

| Report | Automation Priority | Template Complexity | When |
|--------|-------------------|-------------------|------|
| Quarterly NAV report | P0 (Month 8) | Medium (charts, tables) | Before first quarterly deadline |
| Individual investor statement | P0 (Month 8) | Low (holdings + value) | Before first quarterly deadline |
| Custody verification summary | P1 (Month 10) | Low (status table) | Before second quarterly cycle |
| Compliance summary (internal) | P1 (Month 10) | Medium (screening results) | Before SOC 2 readiness |
| K-1 data package | P2 (Month 12) | High (tax-specific formatting) | Before first tax year deadline |
| Annual reappraisal summary | P2 (Month 14) | Medium (year-over-year) | Before first annual cycle |

**K-1 specifically:** PleoChrome does NOT generate K-1s directly. The fractional CFO/CPA generates K-1s using SPV financial data. PleoChrome's role is to produce the data package (investor holdings, distribution history, cost basis) in a format the CPA can consume. This is a CSV/Excel export, not a PDF.

---

### 2.7 AI Integration: What Adds Value vs. Noise

**High value (build in Phase 2-3):**

| Feature | Value | Implementation | Cost |
|---------|-------|---------------|------|
| **Document classification** | Auto-categorize uploaded documents (GIA report, appraisal, insurance cert, legal doc) based on content | OpenAI API + Supabase Edge Function on upload trigger | $0.01-0.05/document |
| **Compliance gap detection** | Flag missing documents, expired screenings, overdue re-appraisals | Rule-based engine (NOT AI --- this is deterministic logic). AI adds risk of false negatives in compliance. | Dev time only |
| **Meeting transcription + summary** | Transcribe partner/investor calls, extract action items, link to relevant assets | Whisper API + GPT-4 summarization via Inngest background job | $0.10-0.50/meeting |
| **Anomaly flagging on financial data** | Alert when an appraisal value deviates significantly from historical pattern or market benchmarks | Statistical model (David's strength) --- rolling z-score on valuation data | Dev time only |

**Low value (defer or skip):**

| Feature | Why It's Noise |
|---------|---------------|
| AI chatbot for investors | Investors holding $100K+ in tokenized gemstones want to talk to a human, not a chatbot. The risk of an AI hallucinating about their holdings or regulatory status is catastrophic. |
| AI-generated compliance reports | Regulators and auditors want deterministic, auditable reports. An AI-generated compliance summary that is 99% accurate is 100% unacceptable. |
| AI-powered investor matching | At 15-35 investors, Shane knows every one personally. AI matching is for platforms with 10,000+ investors. |
| Predictive gemstone pricing | The gemstone market lacks the data density for ML models. Auction records are sparse, private sales are unreported, and each stone is unique. Statistical analysis (David's background) is more appropriate than ML. |

**Critical principle:** In compliance-critical features, use deterministic rule engines, not probabilistic AI. AI is valuable for unstructured data processing (document classification, transcription) and pattern detection (anomaly flagging). It is dangerous for compliance decisions (KYC pass/fail, gate passage approval, regulatory filing).

---

### 2.8 Blockchain Integration: Read-Only Until You Need Write

**Decision: The CRM reads from the blockchain. It does NOT write to it directly (except through the tokenization platform API).**

**Architecture:**

```
WRITE PATH (PleoChrome -> Blockchain):
  Admin dashboard -> tRPC API -> Tokenization Platform API (Brickken/Zoniqx)
                                  -> Smart Contract on Polygon

READ PATH (Blockchain -> PleoChrome):
  Polygon RPC (via ethers.js v6) -> tRPC API -> Admin/Investor dashboard
  Chainlink PoR Feed (via ethers.js) -> tRPC API -> Admin/Investor dashboard
```

**What the CRM needs to read from the blockchain:**
- Token balances per investor wallet (`balanceOf()`)
- Total token supply (`totalSupply()`)
- Chainlink PoR reserve value (aggregator `latestAnswer()`)
- PoR last update timestamp (aggregator `latestTimestamp()`)
- Transfer events for investor transaction history (`Transfer` event logs)
- Compliance status per wallet (`isVerified()` on Identity Registry)

**What the CRM needs to write to the blockchain (via platform API):**
- Deploy new token contracts (per asset)
- Whitelist investor wallets (post-KYC)
- Mint tokens (post-subscription)
- Burn tokens (redemption)
- Freeze/unfreeze wallets (compliance action)
- Pause/unpause token (emergency)
- Force transfer (regulatory order)

**Implementation:** Use `ethers.js v6` for all read operations. Use the tokenization platform's SDK/API for all write operations. This abstraction layer means switching tokenization platforms (Brickken to Zoniqx, or to Rialto) does not require rewriting the CRM --- only the integration client in `/server/integrations/tokenization.ts`.

**When direct blockchain writes are needed:** Only if PleoChrome deploys custom smart contracts outside of the tokenization platform (e.g., a custom Chainlink PoR consumer contract, a custom escrow, or a custom distribution contract). This is Phase 3+ at the earliest.

---

### 2.9 Event-Driven Architecture: Inngest from Day 1

**Decision: Use Inngest for all asynchronous operations, automation, and scheduled tasks.**

**Why Inngest over alternatives:**
- **vs. Vercel Cron:** Vercel Cron is limited to 2 cron jobs on Pro (20 on Enterprise). Inngest handles unlimited scheduled + event-driven functions. Vercel Cron also has no retry logic, no error handling, and no event chaining.
- **vs. Trigger.dev:** Trigger.dev runs on their servers (external execution), which means PII and compliance data leaves your infrastructure. Inngest invokes YOUR functions via HTTP --- data stays within your Vercel/Supabase boundary. This matters for SOC 2 and data sovereignty.
- **vs. Supabase Edge Functions + pg_cron:** pg_cron is limited to database-level scheduling (SQL queries). It cannot call external APIs, generate PDFs, or send emails. Edge Functions lack retry logic and event chaining.

**Event-driven automations to implement:**

| Trigger | Action | Priority |
|---------|--------|----------|
| Insurance expiry approaching (30 days) | Notify compliance officer + asset lead | P0 |
| KYC expiration approaching (60 days) | Trigger re-screening, notify investor | P0 |
| Gate condition met (all checklist items complete) | Notify team, create gate review task | P0 |
| Document uploaded | Auto-classify (AI), log in audit trail, notify relevant parties | P1 |
| Investor subscription funded | Trigger whitelist + mint workflow | P1 |
| Quarterly deadline approaching | Generate all reports, distribute to investors | P1 |
| OFAC/SDN list updated | Re-screen all active investors and holders | P1 |
| Chainlink PoR feed stale (>48 hours) | Alert admin team | P2 |
| Appraisal variance exceeds threshold | Flag for review, halt gate progression | P2 |

**Inngest pricing reality check:**
- Free tier: 25,000 runs/month (sufficient through Phase 2)
- Pro: $50/month for 100,000 runs (sufficient through Phase 3)
- At Phase 4 (50+ assets, 100+ investors, white-label): likely $150-300/month

---

### 2.10 Backup and Disaster Recovery

**Current plan (Supabase Pro):**
- Daily automated backups with 7-day retention
- Point-in-time recovery (PITR) available on Team plan ($599/month) with 7-day window
- No cross-region replication on Pro/Team

**What PleoChrome needs at each stage:**

| Stage | RPO | RTO | Solution | Cost |
|-------|-----|-----|----------|------|
| Phase 1 (1 asset) | 24 hours | 4 hours | Supabase Pro daily backups + manual weekly export | $0 (included) |
| Phase 2 (5 assets, $20M AUM) | 1 hour | 1 hour | Supabase Team with PITR | $599/month (Team plan) |
| Phase 3 (20 assets, $100M AUM) | 15 minutes | 30 minutes | Supabase Enterprise with PITR + regional replication | $2,000+/month |
| Phase 4 (50+ assets, $500M AUM) | 5 minutes | 15 minutes | Enterprise + cross-region failover OR self-hosted PostgreSQL with streaming replication | $3,000-5,000/month |

**Critical action for TODAY:** Implement a weekly manual backup export. Use `pg_dump` via Supabase CLI to create a full database dump. Store in a SEPARATE location (not Supabase --- use Google Drive encrypted folder or AWS S3 with a different account). This protects against the scenario where Supabase itself has a catastrophic failure.

```bash
# Weekly backup script (add to Inngest or local cron)
supabase db dump --project-ref YOUR_PROJECT_REF > backup-$(date +%Y%m%d).sql
# Upload to separate storage
```

**What happens if Supabase has a multi-hour outage:**
- Phase 1-2: The CRM is unusable but no investor funds are at risk (tokens live on Polygon, which is independent). Manual processes can continue via email and spreadsheets for the outage duration. Unpleasant but survivable.
- Phase 3+: With 100+ investors and partner portals depending on the platform, a multi-hour outage is a material business event. This is when the Enterprise SLA (99.95% uptime = max 22 minutes downtime/month) becomes worth the premium.

---

## 3. WHAT TO EXPLICITLY DEFER

These are features that are tempting to build now but will waste time and create maintenance burden without delivering value at current scale.

### Defer Until Phase 2 (Month 6-12)

| Feature | Why Defer | When to Build |
|---------|-----------|--------------|
| **Custom investor portal** | Use DocSend for Stone 1. Learn what investors actually need before building. | Month 8-10, after first 10 investors |
| **Partner portal** | Partners submit via email for Stone 1. There are 3-5 partners max. | Month 10-12, when partner count reaches 8+ |
| **Automated KYC integration** | Run KYC through tokenization platform dashboard manually for first 3-5 investors. | Month 8, when investor pipeline exceeds 10 |
| **Chainlink PoR (full integration)** | Use manual attestation (Option A) for Stone 1. Investors accept this if clearly disclosed. | Month 10-14, funded by Stone 1 revenue |
| **Secondary market / ATS integration** | No investor will ask about secondary trading until they have held tokens for 6+ months. | Month 14-18 |
| **Mobile app** | Investors and admin team can use the responsive web app. Native app adds zero value at < 100 users. | Month 24+ (if ever --- responsive web may be sufficient) |

### Defer Until Phase 3 (Month 12-24)

| Feature | Why Defer | When to Build |
|---------|-----------|--------------|
| **White-label platform** | You need to prove the platform works for PleoChrome before licensing it. A buggy white-label damages your brand. | Month 18-24, after 10+ stones processed |
| **Custom blockchain smart contracts** | Use the tokenization platform's pre-audited contracts. Custom contracts require a $15K-50K audit per contract. | Only if tokenization platform cannot meet a specific requirement |
| **International compliance modules** | US Reg D 506(c) first. EU/UAE/Singapore add complexity that distracts from proving the core model. | Month 18+, after Reg S is added |
| **AI-powered document classification** | Manual document categorization works fine at 5-20 assets. The AI adds value at 50+ assets with 75+ docs each. | Month 18-20 |
| **Real-time Polygon event indexing** | Read on-demand (ethers.js `balanceOf()` calls) is sufficient for < 50 investors. Real-time event indexing (The Graph or custom indexer) is needed at 100+ investors. | Month 18+, based on investor count |

### Defer Indefinitely (Do Not Build Unless Explicitly Required)

| Feature | Why Never |
|---------|-----------|
| **Custom CRM (replacing HubSpot Free)** | The Powerhouse CRM manages the ASSET pipeline, not the SALES pipeline. Investor leads, meeting tracking, and deal flow belong in a purpose-built CRM. HubSpot Free handles this at 0 cost with better UX than anything you would build. |
| **Custom email marketing platform** | Use Resend or Mailchimp. Building email delivery, bounce handling, unsubscribe management, and deliverability monitoring is years of work for a solved problem. |
| **Custom KYC/AML platform** | Use Sumsub or the tokenization platform's built-in KYC. Building identity verification from scratch requires biometric processing, document OCR, sanctions database licensing, and regulatory approval. |
| **In-house smart contract development** | Unless PleoChrome hires a Solidity engineer and commits to a $50K+ annual audit budget, always use pre-audited contracts from the tokenization platform. The liability of a custom smart contract bug at $100M+ AUM is existential. |
| **GPU/ML infrastructure** | Gemstone valuation does not benefit from deep learning. Statistical analysis (David's strength) is the correct tool. Do not invest in ML infrastructure. |

---

## 4. TECHNOLOGY STACK EVOLUTION

### Phase 1 Stack (Today - Month 5): The MVP

| Layer | Technology | Cost/Month |
|-------|-----------|-----------|
| Frontend | Next.js 16 + React 19 + TypeScript + Tailwind v4 + shadcn/ui | $0 |
| Hosting | Vercel Pro | $20 |
| Database | Supabase Pro | $25 |
| Auth | Supabase Auth | Included |
| Storage | Supabase Storage | Included |
| Email | Resend (free tier) | $0 |
| Error tracking | Sentry (free tier) | $0 |
| Data room | DocSend | $45 |
| Tokenization | Brickken/Zoniqx/Rialto | ~$2,000 |
| CI/CD | GitHub Actions (free tier) | $0 |
| **TOTAL** | | **~$2,090/month** |

**Additions to make now:**
- tRPC (open source, $0)
- React Query / TanStack Query (open source, $0)
- Zod (open source, $0)
- Inngest (free tier)

### Phase 2 Stack (Month 6-12): The Platform

| Layer | Technology | Cost/Month |
|-------|-----------|-----------|
| Frontend | Same + React-PDF + recharts | $0 |
| Hosting | Vercel Pro | $20 |
| Database | Supabase Team | $599 |
| Auth | Supabase Auth + MFA | Included |
| Storage | Supabase Storage | Included |
| Task Queue | Inngest (Pro) | $50 |
| Email | Resend (Pro) | $20 |
| Error tracking | Sentry (Team) | $26 |
| E-signatures | DocuSign (Standard) | $45 |
| KYC | Sumsub (pay-per-verification) | ~$100-300 |
| Tokenization | Platform subscription | ~$2,000 |
| CI/CD | GitHub Actions | $0 |
| **TOTAL** | | **~$2,860-3,060/month** |

**Key additions:**
- tRPC API layer (already in codebase from Phase 1)
- React-PDF for automated reports
- Inngest Pro for compliance automation
- DocuSign for subscription agreements

### Phase 3 Stack (Month 12-24): The Enterprise Platform

| Layer | Technology | Cost/Month |
|-------|-----------|-----------|
| Frontend | Same + OpenAPI docs (via tRPC-openapi) | $0 |
| Hosting | Vercel Enterprise | ~$500-1,000 (custom) |
| Database | Supabase Enterprise | ~$2,000-3,000 (custom) |
| Auth | Supabase Auth + SSO (Enterprise) | Included |
| Storage | Supabase Storage (multi-region) | Included |
| Task Queue | Inngest (Pro) | $150-300 |
| Email | Resend (Business) | $100 |
| Error tracking | Sentry (Business) | $80 |
| Monitoring | Datadog or Grafana Cloud | $200-500 |
| E-signatures | DocuSign (Business) | $65 |
| KYC | Sumsub or ComPilot | ~$500-1,000 |
| Tokenization | Platform subscription | ~$3,000-5,000 |
| SOC 2 tooling | Drata or Vanta | ~$500-1,000 |
| CI/CD | GitHub Actions | $0 |
| **TOTAL** | | **~$7,100-12,000/month** |

**Key additions:**
- Supabase Enterprise (dedicated infrastructure, PITR, multi-region)
- Vercel Enterprise (VPC, SSO, compliance features)
- SOC 2 continuous compliance tooling (Drata or Vanta)
- Advanced monitoring (Datadog/Grafana)
- OpenAPI documentation for white-label API

### Phase 4 Stack (Month 24-36): Evaluate Transition

| Decision Point | Stay | Migrate | Trigger |
|---------------|------|---------|---------|
| **Supabase** | Enterprise plan meets SLA + compliance | Self-hosted Supabase or AWS RDS | Regulatory requirement for full infra control, OR cost exceeds $5K/month with equivalent self-hosted at $2K |
| **Vercel** | Enterprise plan meets function limits | AWS ECS + CloudFront, or Railway | API response latency requirements exceed Vercel's serverless model, OR white-label volume makes per-request pricing uneconomical |
| **Inngest** | Pro plan handles volume | Temporal or custom queue on AWS SQS | Workflow complexity requires saga pattern with compensation, OR multi-region execution needed |

**Critical point:** There is NO reason to migrate off the current stack before Phase 4. The evaluation at Month 24-30 should be data-driven, not speculative. If Supabase Enterprise meets your needs at $3K/month, the operational cost of self-hosting (DevOps hire at $150K-200K/year) makes self-hosting MORE expensive, not less.

### Should You Add a Separate API Layer?

**Yes, tRPC, from Day 1 of CRM development.** (See Section 2.2)

tRPC is NOT a "separate API layer" in the traditional sense (no separate server, no separate deployment). It is a TypeScript library that organizes your server-side logic into typed procedures. It runs INSIDE your Next.js application. The output is both:
1. A type-safe internal API (for the admin dashboard, investor portal, partner portal)
2. An HTTP API (for external consumers, white-label partners, mobile apps)

**Do NOT use Hono.** Hono is excellent for standalone API servers, but PleoChrome does not need a separate server. tRPC gives you the API layer without the operational overhead of a second deployment.

### Should You Use a Task Queue?

**Yes, Inngest, from the first compliance automation feature.** (See Section 2.9)

### Should You Plan for a Mobile App?

**No. Not until Month 24+ at the earliest, and possibly never.**

- PleoChrome's users (investors, admin team, partners) are low-frequency users (weekly/monthly logins)
- A responsive web application served over HTTPS provides the same functionality as a native app for this use case
- The tokenization platform handles wallet connection (MetaMask mobile browser)
- Building and maintaining iOS + Android apps doubles the frontend surface area for a team that is already stretched thin
- If a mobile app becomes necessary (e.g., push notifications for compliance alerts), use Capacitor or React Native with the same tRPC API

### Is Vercel the Right Hosting Long-Term?

**Yes through Phase 3. Evaluate at Phase 4.**

Vercel's strengths for PleoChrome:
- Zero-config deployment from GitHub
- Edge network for global latency (important for EU/UAE/Singapore investors)
- Preview deployments for PR review (compliance team can review changes before production)
- Enterprise plan includes SOC 2 compliance, audit logs, SAML SSO

Vercel's limitations that could matter at Phase 4:
- Multi-tenant PaaS (some regulated industries require dedicated infrastructure)
- 900-second function timeout (even on Enterprise) limits complex batch operations
- 4.5MB request body limit affects large document uploads (but documents go to Supabase Storage, not Vercel)
- No GPU instances (irrelevant for PleoChrome)
- Pricing opacity at scale (Enterprise is custom-quoted)

**Mitigation:** Keep the compute-intensive work (report generation, batch compliance screening, blockchain indexing) in Inngest or Supabase Edge Functions. Vercel serves the UI and thin API layer. This architecture is portable --- moving from Vercel to AWS ECS requires changing the deployment target, not the application code.

---

## 5. COST PROJECTIONS AT EACH STAGE

### Infrastructure Cost Summary

| Stage | Timeline | Monthly Infra Cost | Annual Infra Cost | AUM | Revenue |
|-------|----------|-------------------|------------------|-----|---------|
| Phase 1 | Month 1-5 | $2,100 | $12,600 | $0-10M | $0-193K |
| Phase 2 | Month 6-12 | $3,000 | $36,000 | $10-50M | $500K-1M |
| Phase 3 | Month 12-24 | $10,000 | $120,000 | $50-250M | $2-5M |
| Phase 4 | Month 24-36 | $15,000-25,000 | $180,000-300,000 | $250M-1B | $10-20M |

### Infrastructure as Percentage of Revenue

| Stage | Infra Cost | Revenue | Infra % of Revenue |
|-------|-----------|---------|-------------------|
| Phase 1 | $12,600 | $193K | 6.5% |
| Phase 2 | $36,000 | $750K (base) | 4.8% |
| Phase 3 | $120,000 | $3.5M (base) | 3.4% |
| Phase 4 | $240,000 | $15M (base) | 1.6% |

**Conclusion:** Infrastructure costs are well within acceptable bounds at every stage. They decrease as a percentage of revenue as the business scales. There is no stage where infrastructure costs threaten the business model.

### SOC 2 Cost Trajectory

| Activity | Timeline | One-Time Cost | Annual Recurring |
|---------|----------|--------------|-----------------|
| Readiness assessment | Month 6-8 | $5,000-10,000 | -- |
| Gap remediation | Month 8-12 | $10,000-20,000 | -- |
| SOC 2 Type I audit | Month 12-14 | $15,000-25,000 | -- |
| SOC 2 Type II audit | Month 20-24 | $20,000-50,000 | $20,000-50,000/year |
| Continuous compliance tooling (Drata/Vanta) | Month 12+ | -- | $6,000-12,000/year |
| **TOTAL (through first Type II)** | | **$50,000-105,000** | **$26,000-62,000/year** |

---

## 6. RISK FACTORS FOR EACH GROWTH TRANSITION

### Phase 1 -> Phase 2 Transition Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|-----------|
| **David cannot build fast enough** | HIGH | HIGH | Shane continues building via Claude Code. Prioritize ruthlessly: admin dashboard > investor portal > partner portal. |
| **Supabase free/Pro tier outage at critical moment** | LOW | MEDIUM | Weekly manual backups. Manual process fallback documented. Supabase has 99.9% uptime track record. |
| **First investor finds security vulnerability** | LOW | CRITICAL | Security audit before investor portal goes live. Engage pen tester ($2K-5K) for the investor-facing surfaces. |
| **Tokenization platform API is inadequate** | MEDIUM | HIGH | The 30-day parallel evaluation (Brickken vs. Zoniqx vs. Rialto) should surface API limitations. If ALL platforms are inadequate, manual dashboard operations continue (slower but workable). |

### Phase 2 -> Phase 3 Transition Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|-----------|
| **SOC 2 audit reveals major gaps** | MEDIUM | HIGH | The readiness assessment at Month 6-8 catches these early. Budget $10-20K for remediation. The CRM's immutable audit trail and RLS design address the hardest controls. |
| **Supabase Team plan performance limits** | LOW | MEDIUM | Monitor query latency and database CPU. If p95 latency exceeds 200ms, upgrade to Enterprise before it becomes a user-visible issue. |
| **White-label architecture not ready when first licensee appears** | MEDIUM | MEDIUM | The `tenant_id` column and RLS-based isolation (designed now) means the architecture is ready. The gap is operational: provisioning, billing, support SLAs. |
| **EU data residency requirement conflicts with current architecture** | MEDIUM | HIGH | Supabase Enterprise supports EU regions. The tRPC API layer is region-agnostic. The main work is splitting investor records by jurisdiction and routing to the correct Supabase project. |
| **Junior engineer hire writes insecure code** | HIGH | HIGH | Code review process via GitHub PRs (required, not optional). RLS policies mean even buggy application code cannot leak data across tenants or between investors. This is the entire point of database-level security. |

### Phase 3 -> Phase 4 Transition Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|-----------|
| **Supabase Enterprise pricing exceeds budget** | MEDIUM | MEDIUM | Self-hosted Supabase is a real option. The PostgreSQL database migrates directly. The risk is operational (you now own the infrastructure), not architectural. Budget for a DevOps hire. |
| **Vercel pricing at white-label scale** | MEDIUM | MEDIUM | The tRPC API layer is deployment-agnostic. Moving to Railway, Fly.io, or AWS ECS is a deployment change, not a code change. Keep deployment configuration separate from application logic. |
| **International regulatory requirement demands infrastructure control** | MEDIUM | HIGH | Some jurisdictions (particularly Singapore's MAS TRMG) require documented infrastructure ownership. Self-hosted Supabase or AWS RDS in the relevant region satisfies this. Budget 3-month migration timeline. |
| **Supabase as a company fails or is acquired** | LOW | CRITICAL | Supabase is open-source. The entire stack can be self-hosted. The database is standard PostgreSQL. The auth layer can be replaced with Auth0 or Clerk. The storage layer is S3-compatible. This is the strongest argument for Supabase --- zero lock-in. |
| **Scaling from 100 to 1,000+ investors overwhelms Supabase Realtime** | LOW | MEDIUM | Supabase Realtime supports millions of connections. But the concurrent connection count on lower-tier plans is limited. Enterprise plan removes these limits. If necessary, replace Supabase Realtime with a dedicated WebSocket service (Ably, Pusher, or self-hosted) for the investor portal. |

---

## SUMMARY: THE 10 DECISIONS

| # | Decision | Do Now | Build Now | Build Later |
|---|---------|--------|-----------|-------------|
| 1 | Multi-tenancy: RLS with `tenant_id` | DECIDE NOW | ADD COLUMN NOW | Activate at Phase 4 |
| 2 | API-first: tRPC | DECIDE NOW | BUILD NOW | Expand as portals are added |
| 3 | Document storage: Supabase Storage | DECIDE NOW | CONFIGURE NOW | Re-evaluate at 500+ assets |
| 4 | Investor portal: DocSend first | DECIDE NOW | USE DOCSEND | Build custom at Month 8-10 |
| 5 | Partner portal: Same app, scoped RLS | DECIDE NOW | RLS POLICIES NOW | Build UI at Month 10-12 |
| 6 | Reporting: React-PDF + Inngest | DECIDE NOW | -- | Build at Month 8 |
| 7 | AI: Classification + transcription only | DECIDE NOW | -- | Build at Month 12-18 |
| 8 | Blockchain: Read-only, via ethers.js | DECIDE NOW | -- | Build at Month 4-5 |
| 9 | Event-driven: Inngest | DECIDE NOW | INSTALL NOW | Build automations incrementally |
| 10 | Backup: Weekly manual + Supabase auto | DECIDE NOW | IMPLEMENT NOW | Upgrade to PITR at Phase 2 |

**The bottom line:** PleoChrome's current stack is correct. The infrastructure scales to $100M+ AUM without fundamental changes. The decisions above ensure that when changes ARE needed (Phase 3-4), they are configuration changes and plan upgrades --- not rewrites.

Build the right abstractions now. Build the features when the business needs them. Do not let architecture anxiety delay shipping the CRM that the team needs today.

---

*This document should be reviewed quarterly against actual growth metrics and updated when infrastructure transitions occur. Each transition should be recorded in the Decision Audit Log.*

Sources:
- [Supabase Pricing 2026: Plans, Costs & Hidden Fees](https://www.metacto.com/blogs/the-true-cost-of-supabase-a-comprehensive-guide-to-pricing-integration-and-maintenance)
- [Supabase Compute and Disk Limits](https://supabase.com/docs/guides/platform/compute-and-disk)
- [Multi-tenant data isolation with PostgreSQL RLS (AWS)](https://aws.amazon.com/blogs/database/multi-tenant-data-isolation-with-postgresql-row-level-security/)
- [Shipping multi-tenant SaaS using Postgres RLS](https://www.thenile.dev/blog/multi-tenant-rls)
- [White-Label SaaS Architecture & Growth Strategy Guide 2026](https://developex.com/blog/building-scalable-white-label-saas/)
- [SOC 2 Compliance for Financial Institutions 2026](https://www.fraxtional.co/blog/soc-2-compliance-guide-principles-importance)
- [SOC 2 What Changed in 2026](https://www.konfirmity.com/blog/soc-2-what-changed-in-2026)
- [Next.js 16: Best Enterprise Web Framework in 2026](https://www.mtouchlabs.com/next-js-16-the-best-enterprise-web-framework-in-2026)
- [Vercel Enterprise Compliance and Security](https://vercel.com/docs/security/compliance)
- [RWA Tokenization Platform Architecture 2026](https://community.nasscom.in/communities/blockchain/rwa-tokenization-platform-development-practical-roadmap-2026)
- [BDO Tokenization Trends for Real-World Assets 2026](https://www.bdo.com/insights/industries/fintech/trends-in-tokenization-reimagining-real-world-assets)
- [Next.js Background Jobs: Inngest vs Trigger.dev vs Vercel Cron](https://www.hashbuilds.com/articles/next-js-background-jobs-inngest-vs-trigger-dev-vs-vercel-cron)
- [Compliance Automation for Fintech](https://logic.inc/resources/compliance-automation-fintech)
- [Fintech Compliance - Data Security from Day One](https://medium.com/@FintegrationFS/top-soc-2-pci-and-data-security-what-your-fintech-dev-team-must-build-from-day-one-9402bad20643)
- [Supabase vs AWS Pricing Comparison 2026](https://www.bytebase.com/blog/supabase-vs-aws-pricing/)
