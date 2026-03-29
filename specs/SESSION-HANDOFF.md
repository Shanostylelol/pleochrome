# Session Handoff — PleoChrome Powerhouse CRM Build

**Last Updated:** 2026-03-29
**Purpose:** This file ensures any new Claude Code session can pick up the build exactly where the last one left off. Read this FIRST in any new session.

---

## CURRENT STATE

### What Exists
- **Landing page:** Live at pleochrome.com with interactive three-path workflow, neumorphic design
- **Portal pages:** 7 pages updated with three-path support, path selector, platform-agnostic language
- **Supabase schema:** 2 migrations ready (001 + 002), NOT yet deployed to Supabase
- **Wireframe prototype:** `wireframe-prototype.html` — 4,990-line interactive prototype with all 13 pages
- **Build specs:** 23 files in `/specs/` — complete page-by-page build instructions
- **Feature map:** 118 features mapped with priorities (44 P0 MVP must-haves)
- **Research corpus:** 300K+ words of strategy, compliance, workflow, and partner DD docs
- **Decision Audit Log:** 7 strategic decisions tracked
- **CLAUDE.md:** Complete governance rules with mandatory pre-flight check

### What Does NOT Exist Yet
- CRM application code (no `/crm` routes built)
- Supabase project initialized (migrations not run)
- tRPC API layer
- Neumorphic component library
- Auth system
- Any production CRM functionality

---

## TO RESUME BUILDING

### Step 1: Read the governance
```
Read: CLAUDE.md (mandatory pre-flight)
Read: specs/MASTER-BUILD-PLAN.md (build sequence)
Read: specs/BUILD-LOG.md (what's been done)
Read: specs/ERROR-LOG.md (known issues)
```

### Step 2: Check current phase status
The MASTER-BUILD-PLAN.md has a status table at the bottom showing which phases are complete.

### Step 3: Read the next spec
Each phase and step has a specific spec file. Read it completely before writing any code.

### Step 4: Execute the build cycle
```
Plan → Validate (against CLAUDE.md rules) → Build → Test (npm run build) → Log (BUILD-LOG.md) → Commit
```

### Step 5: Autonomous mode
When the user says "Go", follow the MASTER-BUILD-PLAN phase sequence, executing each step's spec file in order.

---

## KEY FILES

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Governance rules — read before ANY code change |
| `specs/MASTER-BUILD-PLAN.md` | Build sequence (8 phases) |
| `specs/BUILD-LOG.md` | What was built and when |
| `specs/ERROR-LOG.md` | Issues and resolutions |
| `specs/foundation/*.md` | Phase 0 specs (6 files) |
| `specs/pages/*.md` | Phase 1-7 page specs (11 files) |
| `specs/api/*.md` | API router specs |
| `specs/features/*.md` | Feature specs (Quick Add, Search) |
| `.env.local` | Supabase credentials (NOT in git) |
| `supabase/migrations/001*.sql` | Base schema (13 tables) |
| `supabase/migrations/002*.sql` | Governance layer (6 tables, 68 requirements) |
| `wireframe-prototype.html` | Visual reference for all pages |
| `POWERHOUSE-CRM-FEATURE-MAP.md` | 118 features with priorities |
| `DECISION-AUDIT-LOG.md` | Strategic decision history |

---

## SUPABASE PROJECT

- **URL:** https://satrlfdnevquvnozhlvn.supabase.co
- **Project Ref:** satrlfdnevquvnozhlvn
- **Credentials:** In `.env.local` (not in git)
- **Status:** Project exists, migrations NOT yet deployed

---

## BUILD PHASE STATUS

| Phase | Status | Next Action |
|-------|--------|-------------|
| 0: Foundation | NOT STARTED | Run spec `00-supabase-init.md` |
| 1: Pipeline Board | NOT STARTED | Depends on Phase 0 |
| 2: Asset Detail | NOT STARTED | Depends on Phase 1 |
| 3: Documents | NOT STARTED | Depends on Phase 2 |
| 4: Tasks + Activity | NOT STARTED | Depends on Phase 2 |
| 5: Partners + Meetings | NOT STARTED | Depends on Phase 2 |
| 6: Search + Filters | NOT STARTED | Depends on Phases 1-5 |
| 7: Templates + Compliance | NOT STARTED | Depends on Phase 2 |
| 8: Polish + Deploy | NOT STARTED | Depends on all phases |

---

## CRITICAL REMINDERS

1. **Pre-flight check is MANDATORY** — read CLAUDE.md before any code
2. **"asset" not "stone"** — everywhere in code
3. **Platform-agnostic** — no Brickken/Zoniqx commitment
4. **Neumorphic design system** — raised buttons, pressed inputs, CSS variables only
5. **Dark + light mode** — every component must support both
6. **Immutable audit trail** — never write to activity_log from frontend
7. **Test after every step** — `npm run build` must pass
8. **Log after every step** — update BUILD-LOG.md
