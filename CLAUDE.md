# PleoChrome — Project Governance & Build Rules

## ⛔ MANDATORY PRE-FLIGHT CHECK

**BEFORE writing ANY code — even a single line, even a "quick fix" — you MUST:**

1. **Read this entire CLAUDE.md file** to load project context
2. **Read `DECISION-AUDIT-LOG.md`** to understand current strategic state
3. **Read `src/lib/portal-data.ts`** if touching portal/CRM pages (for path/partner/workflow data)
4. **Read `src/lib/design-system.ts`** if touching any UI (for neumorphic tokens — when it exists; until then, check `wireframe-prototype.html` CSS variables)
5. **Check `src/components/ui/`** for existing components before creating new ones

**This applies to:**
- New features
- Bug fixes (even one-line)
- Refactors
- Style changes
- Content updates
- ANY code change whatsoever

**Why:** Context loss causes inconsistency. A "quick fix" that ignores the design system breaks visual consistency. A content update that ignores the Decision Audit Log contradicts strategic decisions. Every change must be informed by the full project state.

---

## What PleoChrome Is

PleoChrome is a real-world asset (RWA) value orchestration platform. Tagline: **"Value from Every Angle."**

Three paths to value:
1. **Fractional Securities** — Reg D 506(c), fractional LLC units, lower minimums
2. **Tokenization** — ERC-3643 or ERC-7518 security tokens on Polygon, Chainlink PoR
3. **Debt Instruments** — Asset-backed lending, UCC Article 9, collateral-based

We are the **orchestrator** — we don't own, hold, or sell. We coordinate every specialist in the pipeline. We are **partner-agnostic** and **asset-agnostic** (gemstones first, but the system handles any RWA).

---

## Code Architecture Rules

### Stack
- Next.js 16 + React 19 + TypeScript strict + Tailwind v4
- tRPC for typed API layer
- Supabase (PostgreSQL + Auth + Storage + Realtime)
- TanStack Query for server state
- motion (Framer Motion) for animations
- Deployed on Vercel at pleochrome.com

### File Structure (Feature-Based Modules)
```
src/
  app/
    page.tsx                    ← Public landing page
    layout.tsx                  ← Root layout
    crm/                        ← CRM application (auth-gated)
      layout.tsx                ← CRM shell (sidebar + header + auth)
      page.tsx                  ← Pipeline Board
      assets/                   ← Asset pages
      partners/                 ← Partner pages
      documents/                ← Document library
      tasks/                    ← Task dashboard
      meetings/                 ← Meetings
      activity/                 ← Audit trail
      team/                     ← Team directory
      templates/                ← Governance templates
      compliance/               ← Compliance dashboard
      settings/                 ← Settings
    portal/                     ← Legacy portal pages (partner prep, learn, etc.)
  components/
    ui/                         ← Atomic neumorphic primitives (NeuCard, NeuButton, etc.)
    portal/                     ← Portal-specific components (PathSelector, etc.)
    crm/                        ← CRM-specific composite components
  lib/
    portal-data.ts              ← Workflow paths, phases, steps, partners, costs
    design-system.ts            ← Neumorphic tokens, theme, colors
    utils.ts                    ← Shared utilities (cn, formatting, etc.)
    database.types.ts           ← Auto-generated from Supabase (DO NOT EDIT MANUALLY)
  server/
    trpc.ts                     ← tRPC initialization
    routers/                    ← API routers per domain
  styles/
    neumorphic.css              ← Global neumorphic utility classes
    globals.css                 ← Base styles + Tailwind
```

### Component Rules

1. **Check `src/components/ui/` BEFORE creating any new component.** If a primitive exists, use it. If it doesn't, create it as a reusable primitive first, then use it.

2. **Every visual component MUST use the neumorphic design system.** No inline `box-shadow`, no hardcoded colors. Use the CSS custom properties (`--neu-shadow-raised`, `--neu-shadow-pressed`, etc.) or the Tailwind utility classes.

3. **Every component MUST support dark AND light mode.** Use CSS custom properties that switch automatically via `[data-theme]`. Never hardcode `text-white` or `bg-black` — use `var(--text-primary)`, `var(--bg-surface)`, etc.

4. **Component naming:** `Neu` prefix for neumorphic primitives (NeuCard, NeuButton). Domain prefix for feature components (AssetCard, GateCheck, StepDetail).

5. **No prop drilling beyond 2 levels.** Use React Context or TanStack Query for shared state.

### Design System — Neumorphic Standard

**Surfaces:**
- Raised (cards, buttons, badges): `box-shadow: var(--neu-shadow-raised)`
- Pressed/concave (inputs, troughs, kanban columns): `box-shadow: var(--neu-shadow-pressed)`
- Flat (backgrounds, page surfaces): no shadow

**Interactions:**
- Buttons: raised at rest → pressed on click (with translateY shift)
- Inputs: always pressed/concave, focus adds accent ring
- Cards: raised at rest → stronger raised on hover
- Tabs: pressed container, raised active tab
- Checkboxes: pressed at rest, raised+colored when checked
- Toggles: pressed track, raised knob

**Colors:**
- Background dark: `#0A0F1A` / light: `#E8EDF2`
- Surface dark: `#141B2D` / light: `#E0E5EC`
- Emerald `#1B6B4A` = Fractional Securities / Phase 1 / Success
- Teal `#1A8B7A` = Tokenization / Phase 2 / Primary accent
- Sapphire `#1E3A6E` = Debt Instruments
- Amber `#C47A1A` = Distribution / Warning
- Ruby `#A61D3A` = Risk / Error / Blocked
- Amethyst `#5B2D8E` = Partner indicators
- Chartreuse `#7BA31E` = Complete / Positive trend

**Typography:**
- Display: Cormorant Garamond (headings, hero text)
- Body: DM Sans (all UI, data, labels)
- Mono: SF Mono / Fira Code (reference numbers, timestamps, step numbers)

### API Rules

1. **All data mutations go through tRPC.** No direct Supabase client calls from components (except Realtime subscriptions and Storage uploads).

2. **Every mutation must invalidate affected queries.** Complete a task → invalidate step progress, activity feed, compliance score.

3. **Activity logging is automatic.** Database triggers handle audit trail entries. Do NOT manually insert activity_log rows from the frontend — that's the database's job.

4. **Auth context flows through tRPC middleware.** Every router procedure gets `ctx.user` with the authenticated user's ID and role.

### Database Rules

1. **Never modify `001_powerhouse_crm_schema.sql` or `002_modular_governance_schema.sql` directly.** Create new migration files for changes.

2. **Run `npx supabase gen types typescript` after any migration** to regenerate `database.types.ts`.

3. **The `activity_log` table is IMMUTABLE.** No UPDATE or DELETE operations. Ever. This is enforced at the database trigger level.

4. **Documents with `is_locked = true` cannot be deleted.** Enforced at the database level.

5. **Governance requirements can only be modified by CEO, CTO, or Compliance Officer.** Enforced by RLS.

### Authentication

- **Google OAuth via Supabase Auth** — all users authenticate with their @pleochrome.com Google Workspace accounts
- **No email/password auth** — Google OAuth is the only login method
- **Three users only** (all Admin): shane@pleochrome.com, david@pleochrome.com, chris@pleochrome.com
- **Future Google integrations:** OAuth scope will expand to include Drive, Calendar, and Gmail when ready
- **Dev/test mode:** Use Supabase test users that simulate Shane, Chris, and David for local development. Auth bypass in dev mode still applies, but test users should have realistic team_members rows.
- **Production:** OAuth enforced, no bypass. Deploy to pleochrome.com/crm behind Google OAuth gate.

### Security Rules

1. **All pages under `/crm/` require Google OAuth authentication.** Enforced in `crm/layout.tsx`.
2. **Only @pleochrome.com Google Workspace accounts are allowed.** Reject any other domain.
3. **PII fields (SSN, financial data) must be encrypted** using pgcrypto before storage.
4. **File uploads must validate MIME type** before storing in Supabase Storage.
5. **No secrets in client-side code.** All API keys go in `.env.local` and are only accessed in server-side code (tRPC routers, Edge Functions).

### Progressive Web App (PWA)

- The CRM MUST be installable as a PWA on mobile and desktop
- Use `@serwist/next` for service worker integration (Turbopack-compatible, successor to next-pwa)
- Service worker caches the app shell, static assets, and recent data for offline access
- `manifest.webmanifest` with PleoChrome branding (name, icons, theme color, background color)
- Add to Home Screen support on iOS and Android
- Offline indicator banner when connection is lost
- Background sync for mutations made while offline (queue and replay)
- Push notification support (future — registered in manifest now)
- Cache strategies: app shell = cache-first, API data = network-first, documents = stale-while-revalidate
- iOS meta tags required: `apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style`

### Data Validation

- ALL form inputs validated on BOTH client-side (React Hook Form + Zod) AND server-side (Zod in tRPC)
- Client-side: immediate inline error messages below each field
- Server-side: Zod schemas on every tRPC mutation — reject invalid data before it hits the DB
- Shared Zod schemas between client and server (single source of truth in `src/lib/validation/`)
- Financial values: must be positive numbers, max 15 digits, 2 decimal places
- Email: validated format (Zod `.email()`)
- Phone: validated format (allow international with +country code, regex pattern)
- Required fields: visually marked with asterisk, empty submission shows error state on all missing fields
- Text fields: min/max length constraints appropriate to the field
- Select/dropdown: must be a valid enum value from the DB schema
- File uploads: validate MIME type AND file size (max 50MB per file, max 500MB per asset)
- Date fields: must be valid date, cannot be in the future for historical events
- Currency fields: formatted with $ prefix, commas, 2 decimal places on blur
- Reference codes: auto-generated, read-only, unique (checked via `assets.checkReferenceUnique`)
- Custom `.refine()` validators for cross-field rules (e.g., offering_value <= claimed_value)
- Error messages MUST be user-friendly (not technical Zod internals)

### Mobile-First Design

- All pages MUST be designed mobile-first, then enhanced for larger screens
- Minimum touch target: 44x44px for all interactive elements
- Minimum 8px gap between adjacent touch targets
- No horizontal scroll on any viewport
- Below 768px: sidebar collapses to bottom navigation bar
- Bottom nav: 5 items (Pipeline, Assets, Tasks, Activity, More)
- "More" opens a slide-up sheet with remaining nav items
- FAB (Floating Action Button) for Quick Add on Pipeline page

---

## Strategic Governance Rules

### Decision Audit Log

**CRITICAL RULE:** Every time a strategic decision, pivot, partner evaluation outcome, or structural change is made in conversation, you MUST:
1. Append the decision to `DECISION-AUDIT-LOG.md` with: date, decision, rationale, impact, and who decided
2. Update ALL affected documents to reflect the change
3. If it affects Google Drive, update files there too

The audit log is the investor-facing record. Every entry shows diligence.

### Document Update Protocol

When updating any strategic document:
- Add "Last Updated" header with date and summary
- Never delete historical content — mark superseded sections with `[SUPERSEDED — see Decision #X]`
- Cross-reference the Decision Audit Log entry number

### Naming Conventions (Google Drive)
- Documents: `YYYY-MM-DD DESCRIPTION - Source.ext`
- DD Reports: `DD-Report-Entity-Name.md` or `.pdf`
- Strategic Reports: `Strategic-Partner-Report-Entity-Name.md` or `.pdf`
- Strategy docs: `STRATEGY-N-TITLE.md` (numbered sequentially)

---

## Key Directories
- **Repo:** `~/Projects/pleochrome`
- **Google Drive (local):** `~/Library/CloudStorage/GoogleDrive-shane@pleochrome.com/Shared drives/Pleochrome/`
- **Supabase Migrations:** `~/Projects/pleochrome/supabase/migrations/`
- **Wireframe Prototype:** `~/Projects/pleochrome/wireframe-prototype.html`
- **Schema Design:** `~/Projects/pleochrome/POWERHOUSE-CRM-SCHEMA-DESIGN.md`
- **Wireframe Spec:** `~/Projects/pleochrome/POWERHOUSE-CRM-WIREFRAME-SPEC.md`

---

## Platform Partners (Evaluating — None Contracted)
- **Distribution/BD/ATS:** Rialto Markets (primary evaluation — $50K+$5K/mo full-stack) — Decision #006
- **Tokenization:** Evaluating Brickken (ERC-3643) AND Zoniqx (ERC-7518) — platform-agnostic — Decision #003, #004
- **Oracle:** Chainlink (Proof of Reserve)
- **Certification:** GIA (industry standard)
- **Custody:** Brink's, Malca-Amit (evaluating both)
- **Legal:** Bull Blockchain Law (evaluating) — Decision #005
- **BD (backup):** Dalmore Group (recommended, not engaged)

---

## CRM Architecture — Three-Layer Governance Model

The Powerhouse CRM operates on three layers:

1. **Governance Layer** (immutable) — Regulatory requirements stored in `governance_requirements` table. These define WHAT must happen and WHY. They cannot be changed by normal users. Only CEO/CTO/Compliance Officer can modify.

2. **Template Layer** (configurable) — Partner modules stored in `partner_modules` and `module_tasks`. These define HOW governance requirements are fulfilled by a specific partner. Swapping partners swaps the template layer; governance stays intact.

3. **Instance Layer** (execution) — Actual task records in `asset_task_instances`. These are created by the `assemble_asset_workflow()` function and track what actually happened, when, and by whom.

**When building CRM features, always ask:** "Am I building for Layer 1, 2, or 3?" The answer determines which table to read/write and what permissions apply.

---

## DO NOT — Hard Rules

- Reference Brickken as the committed tokenization partner (we are platform-agnostic)
- Use "Verified from Every Angle" anywhere (tagline is "Value from Every Angle")
- Assume the Kandi/first emerald asset is confirmed (provenance issues unresolved)
- Claim any partner is "locked in" — all are in evaluation/partnership-building stage
- Use "stone" or "stones" as a data model term — use "asset" or "assets"
- Hardcode colors or shadows — use design system variables
- Skip the pre-flight check for "quick fixes"
- Manually insert activity_log entries from the frontend
- Delete or modify existing migration files
- Store secrets in client-side code
