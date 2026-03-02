---
phase: 01-foundation
plan: 01
subsystem: data
tags: [leaders.json, json, data-layer, church-data, verification]

# Dependency graph
requires: []
provides:
  - "src/lib/data/leaders.json — 15 verified leader records with full schema"
  - ".planning/phases/01-foundation/DATA-VERIFICATION.md — PM-reviewable verification table"
  - ".github/ISSUE_TEMPLATE/leadership-change.yml — structured issue template for future changes"
affects: [01-02-scaffold, 01-03-deploy, 02-flip-card-grid, 03-flash-cards, 04-biographies]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "leaders.json as single source of truth for all 15 leader records"
    - "quorum field values: first-presidency | quorum-of-twelve (drives grouping across app)"
    - "seniority integers 1–15 as the canonical ordering key"
    - "stub arrays for future data: conferenceTalks: [], triviaFacts: []"
    - "photo.filename stores slug only (no path) — path constructed at render time with base"
    - "bio.narrativeFile stores slug only — resolves to src/lib/data/bios/<slug>.md in Phase 4"

key-files:
  created:
    - src/lib/data/leaders.json
    - .planning/phases/01-foundation/DATA-VERIFICATION.md
    - .github/ISSUE_TEMPLATE/leadership-change.yml
  modified: []

key-decisions:
  - "quorum values are kebab-case strings (first-presidency, quorum-of-twelve) not enums — simpler for JSON consumers"
  - "id and slug are identical fields — both kept for future-proofing (slug for routes, id for lookups)"
  - "photo stores filename only, not full path — SvelteKit base path applied at render time"
  - "bio.narrativeFile stores slug only — avoids hardcoding path depth that may change"
  - "conferenceTalks and triviaFacts are empty arrays in Phase 1, not null — consumers can iterate safely"

patterns-established:
  - "Data layer pattern: static JSON at src/lib/data/ imported directly in Svelte components"
  - "Verification pattern: DATA-VERIFICATION.md in .planning/ for PM review before phase close"
  - "Change management: GitHub issue template at .github/ISSUE_TEMPLATE/ with ordered checklist"

requirements-completed: [INFRA-01]

# Metrics
duration: 3min
completed: 2026-03-01
---

# Phase 1 Plan 1: Leader Data Layer Summary

**15-record leaders.json with full schema (id/slug/name/title/quorum/seniority/dates/photo/family/career/bio stubs), sourced from churchofjesuschrist.org, with PM verification table and GitHub issue template for future leadership changes.**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-02T01:31:13Z
- **Completed:** 2026-03-02T01:33:55Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- Created `src/lib/data/leaders.json` with all 15 leaders in seniority order (Nelson=1, Kearon=15), every record has the complete schema including empty-array stubs for conferenceTalks and triviaFacts
- Created `DATA-VERIFICATION.md` with a clickable-URL Markdown table for PM sign-off — 15 rows, 15 unchecked PM checkboxes, separated into First Presidency and Quorum of the Twelve sections
- Created `.github/ISSUE_TEMPLATE/leadership-change.yml` with ordered checklist of exactly which files to update when leadership changes, preventing update order mistakes

## Task Commits

Each task was committed atomically:

1. **Task 1: Create leaders.json with all 15 leader records** - `1da9aab` (feat)
2. **Task 2: Create DATA-VERIFICATION.md and leadership-change issue template** - `43cc453` (feat)

## Files Created/Modified

- `src/lib/data/leaders.json` — Complete leader data for all 15 leaders; the authoritative source for all downstream phases
- `.planning/phases/01-foundation/DATA-VERIFICATION.md` — PM review table with source URLs, calling dates, birth dates, and unchecked checkboxes (requires PM sign-off before Phase 1 closes)
- `.github/ISSUE_TEMPLATE/leadership-change.yml` — GitHub issue template with ordered file update checklist for future leadership changes

## Decisions Made

- **quorum values:** Used kebab-case strings (`first-presidency`, `quorum-of-twelve`) rather than display strings — consistent with slug conventions, safe for switch/filter logic in all phases
- **id === slug:** Both fields kept even though they are identical — `id` for map lookups and keying, `slug` for route params; eliminates ambiguity downstream
- **photo.filename format:** Stored as `"{slug}.jpg"` only (no path) — the SvelteKit `base` path must be prepended at render time; hardcoding paths in JSON would break GitHub Pages deployment
- **bio.narrativeFile:** Stored slug only (e.g., `"russell-m-nelson"`) — Phase 4 will resolve this to `src/lib/data/bios/<slug>.md`; storing the full path now would couple the JSON to the file structure
- **Stub arrays:** `conferenceTalks` and `triviaFacts` initialized as `[]` not `null` — downstream consumers can call `.length` and `.map()` without null checks

## Deviations from Plan

None — plan executed exactly as written. All 15 records match the data specified in the plan's Task 1 action block. No schema changes were needed.

## Issues Encountered

Minor: The Node.js verification scripts from the plan used `require()` syntax, but the project's `package.json` sets `"type": "module"`, causing an ESM/CJS conflict. Resolved by saving scripts as `.cjs` files for verification, then deleted after use. No impact on production files.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- `leaders.json` is ready for Phase 1 Plan 2 (SvelteKit scaffold) — the home page can import it directly
- PM should review and check all 15 rows in `DATA-VERIFICATION.md` against churchofjesuschrist.org before Phase 1 closes
- All photo filenames in leaders.json follow the `{slug}.jpg` convention — photos need to be placed at `static/images/leaders/{slug}.jpg` (handled in Phase 1 Plan 2)

## Self-Check: PASSED

- FOUND: `src/lib/data/leaders.json`
- FOUND: `.planning/phases/01-foundation/DATA-VERIFICATION.md`
- FOUND: `.github/ISSUE_TEMPLATE/leadership-change.yml`
- FOUND: `.planning/phases/01-foundation/01-01-SUMMARY.md`
- Commit `1da9aab` (Task 1): verified present
- Commit `43cc453` (Task 2): verified present
- Full data integrity check: All checks passed (15 leaders, 3 FP, 12 Q12, unique seniority 1-15, all sourceUrls from churchofjesuschrist.org, conferenceTalks and triviaFacts are arrays)

---
*Phase: 01-foundation*
*Completed: 2026-03-01*
