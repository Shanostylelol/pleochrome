# PleoChrome Powerhouse CRM — Error Log

**Purpose:** Record every error, blocker, and issue encountered during the build. Each entry includes the root cause and resolution. This becomes a learning knowledge base that prevents repeat mistakes.

---

## Format

```
### ERR-[NNN] — [Title]
**Date:** YYYY-MM-DD
**Phase:** [which build phase]
**Severity:** BLOCKER / ERROR / WARNING
**Description:** (what went wrong)
**Root Cause:** (why it happened)
**Resolution:** (how it was fixed)
**Prevention:** (what to do differently next time)
**Related Files:** (files affected)
```

---

## Known Issues (Pre-Build)

### ERR-001 — Schema stone→asset rename was incomplete
**Date:** 2026-03-29
**Phase:** Pre-build (schema audit)
**Severity:** ERROR
**Description:** Migration 001 still has index names and function names using "stones" instead of "assets". Migration 002 fixed the table/column references but 001's cosmetic names remain.
**Root Cause:** sed rename was applied to 002 but not thoroughly to 001
**Resolution:** Documented. Will create migration 003 to rename indexes/functions if needed. Functionally works as-is.
**Prevention:** Always run a full grep for old naming after any rename operation.

### ERR-002 — Duplicate sort_order values in governance seed data
**Date:** 2026-03-29
**Phase:** Pre-build (schema audit)
**Severity:** WARNING
**Description:** Steps 4.11 and 4.12 have colliding sort_order values between shared and path-specific governance requirements.
**Root Cause:** Shared steps (value_path=NULL) and tokenization-specific steps assigned the same sort_order numbers.
**Resolution:** Will be fixed when running migrations — renumber tokenization-specific steps to 417, 418.
**Prevention:** Always assign unique sort_order values across all paths for the same phase.

### ERR-003 — SEC No-Action Letter citation unverified
**Date:** 2026-03-29
**Phase:** Pre-build (validation audit)
**Severity:** WARNING
**Description:** The "March 12, 2025 SEC No-Action Letter" for accredited investor self-certification at $200K+ may not exist as cited.
**Root Cause:** Potentially hallucinated citation in research docs.
**Resolution:** Must verify with securities counsel before using in any investor-facing material. Do NOT display in CRM UI.
**Prevention:** All regulatory citations must be verified against primary sources before deployment.

---

## Build Errors

### ERR-004 — Serwist (PWA service worker) incompatible with Turbopack
**Date:** 2026-03-29
**Phase:** 0.7 (PWA Setup)
**Severity:** WARNING
**Description:** `@serwist/next` v9 does not support Next.js 16's default Turbopack bundler. Build fails with "This build is using Turbopack, with a webpack config and no turbopack config."
**Root Cause:** Serwist wraps next.config.ts with a webpack plugin. Next.js 16 defaults to Turbopack, which doesn't support webpack plugins.
**Resolution:** Set `disable: true` in Serwist config. All other PWA infrastructure (manifest, icons, offline page, meta tags) works without the service worker. The app is installable as a PWA but doesn't have offline caching yet.
**Prevention:** In Phase 8, either: (1) Build with `--webpack` flag, (2) Migrate to `@serwist/turbopack` when stable, or (3) Use Serwist configurator mode. Track: https://github.com/serwist/serwist/issues/54
**Related Files:** `next.config.ts`, `src/app/sw.ts`
