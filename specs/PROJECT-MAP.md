# PleoChrome Project Map

## Root
```
pleochrome/
├── CLAUDE.md                    ← PROJECT RULES (read before ANY code change)
├── DECISION-AUDIT-LOG.md        ← Strategic decisions with rationale
├── README.md                    ← Project overview
│
├── specs/                       ← ALL specifications and planning docs
│   ├── SESSION-HANDOFF.md       ← READ THIS FIRST every session
│   ├── PROJECT-MAP.md           ← THIS FILE — where everything is
│   ├── DIRECTION.md             ← WHAT TO BUILD NEXT (context + plan)
│   │
│   ├── v2-architecture/         ← V2 SOURCE OF TRUTH (14 spec files)
│   │   ├── V2-POWERHOUSE-BLUEPRINT.md     ← Master schema + routers + pages (~2,500 lines)
│   │   ├── V2-ARCHITECTURE-RULES.md       ← Code standards, CSS, testing
│   │   ├── V2-MASTER-BUILD-PLAN.md        ← 9-phase build sequence
│   │   ├── V2-BUILD-READINESS-AUDIT.md    ← 14 feature wiring gaps
│   │   ├── V2-COMPLETE-TASK-DENSITY.md    ← 175 tasks, 656 subtasks for templates
│   │   ├── V2-FEATURES-AND-WORKFLOWS-ADDENDUM.md ← Meetings, SOPs, reminders
│   │   ├── V2-UNIFIED-PHASE-MAPPING.md    ← 6 phases × 5 models
│   │   ├── V2-MIGRATION-ADDENDUM.md       ← Schema fixes
│   │   ├── V2-PARTNER-AND-CUSTOMER-DESIGN.md
│   │   ├── V2-OWNERSHIP-AND-KYC-DESIGN.md
│   │   ├── V2-IMPLEMENTATION-PLAN.md
│   │   ├── V2-RETROFIT-ANALYSIS.md
│   │   ├── V2-REGULATORY-VALIDATION-REPORT.md
│   │   ├── V2-DRIVE-RESEARCH-CONSOLIDATED.md
│   │   └── DEBT-INSTRUMENT-WORKFLOW-COMPLETE.md
│   │
│   ├── v2-testing/              ← Test plans, results, issue tracking
│   │   ├── V2-GAP-AUDIT-2026-03-31.md    ← LATEST: spec vs reality gaps
│   │   ├── MASTER-ISSUE-LOG.md            ← 30 issues by tier
│   │   ├── COMPLETE-FIX-AND-TEST-PLAN.md  ← 104 untested elements
│   │   ├── E2E-TEST-CHECKLIST.md          ← 140-item checklist
│   │   ├── E2E-TEST-PROGRESS.md           ← What's been tested
│   │   ├── E2E-TEST-FINDINGS.md           ← Bugs found
│   │   └── GAP-ANALYSIS.md               ← Earlier gap analysis
│   │
│   ├── v2-session-logs/         ← Build history
│   │   ├── BUILD-LOG.md
│   │   ├── ERROR-LOG.md
│   │   └── MASTER-BUILD-PLAN.md
│   │
│   └── v1-legacy/               ← Old V1 specs (reference only)
│       ├── api/
│       ├── features/
│       ├── foundation/
│       └── pages/
│
├── docs/                        ← Business strategy & research (NOT code)
│   ├── strategy/                ← STRATEGY-1 through STRATEGY-6
│   ├── research/                ← Blockchain, SEC, infrastructure research
│   └── v1-legacy/               ← Old execution plans, audits, wireframes
│
├── src/                         ← APPLICATION CODE
│   ├── app/crm/                 ← 18 CRM pages
│   ├── components/
│   │   ├── ui/                  ← 18 neumorphic primitives
│   │   └── crm/                 ← 35+ CRM components
│   │       └── asset-detail/    ← Tab components + hooks
│   ├── lib/                     ← Utils, constants, validation, types
│   └── server/routers/          ← 23 tRPC routers
│
├── supabase/migrations/         ← 12 migrations (V1 + V2 + fixes)
└── public/                      ← Static assets
```

## Memory Files (Claude persistent memory)
```
~/.claude/projects/-Users-shanepierson-Projects/memory/
├── MEMORY.md                              ← Master index (auto-loaded)
├── pleochrome-project.md                  ← Team, partners, revenue model
├── pleochrome-v2-architecture.md          ← Architecture direction
├── pleochrome-feedback-2026-03-31.md      ← CRITICAL: Shane's interaction rework feedback
├── pleochrome-session-2026-03-31-state.md ← LATEST session state
├── pleochrome-session-2026-03-30-fixes.md ← Tier 1+2 fix details
├── pleochrome-session-2026-03-30-deep.md  ← Deep build + E2E history
├── pleochrome-session-2026-03-29-30.md    ← V1→V2 build history
└── pleochrome-session-2026-03-27-29.md    ← Initial build history
```

## Key Principle
- **specs/SESSION-HANDOFF.md** → What phase you're on, what to read
- **specs/DIRECTION.md** → What to build next with full context
- **specs/v2-architecture/** → The source of truth for what SHOULD exist
- **specs/v2-testing/** → What's been tested and what's broken
- **CLAUDE.md** → Code rules (NEVER skip)
