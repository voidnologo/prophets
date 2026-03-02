---
phase: 04-biographies
plan: 02
subsystem: ui
tags: [svelte, sveltekit, tailwind, biography, static-prerender, accessibility]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: leaders.json data model with slug/birthDate/callingDate/family/preCallingCareer/sourceUrl fields
  - phase: 04-01
    provides: /bios directory page with leader card links to /bios/[slug]
provides:
  - +page.js with prerender=true, entries(), and load() for 15 static bio detail pages
  - /bios/[slug] detail page with breadcrumb, quick-facts panel, and two outbound links per leader
  - 15 pre-rendered HTML files in build/bios/[slug]/ (one per leader slug)
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "SvelteKit entries() + load() pattern for dynamic static routes"
    - "Age calculation from ISO date string components to avoid UTC/local mismatch"
    - "formatDate using T12:00:00 suffix to prevent UTC boundary date display errors"
    - "Conference talks URL: https://www.churchofjesuschrist.org/study/general-conference/speakers/${slug}?lang=eng"
    - "Outbound links always include target=_blank rel=noopener noreferrer and sr-only (opens in new tab)"
    - "Conditional quick-facts: {#if leader.family?.spouseName} guards optional fields"

key-files:
  created:
    - src/routes/bios/[slug]/+page.js
    - src/routes/bios/[slug]/+page.svelte

key-decisions:
  - "entries() derives slugs from leaders.leaders.map — never hard-coded, stays in sync with data changes"
  - "const leader = data.leader captured at module scope — correct for static prerender, Svelte warning is advisory only"
  - "Conference talks URL uses leader.slug uniformly — Caussé URL resolution is the Church site's responsibility"

patterns-established:
  - "Bio detail quick-facts: <dl> grid with conditional {#if} for spouse/children/career"
  - "Breadcrumb: <nav aria-label=Breadcrumb> with parent <a> and <span aria-current=page> for current"

requirements-completed: [BIO-02, BIO-03, BIO-04]

# Metrics
duration: 3min
completed: 2026-03-02
---

# Phase 4 Plan 2: Bio Detail Pages Summary

**15 pre-rendered biography detail pages at /bios/[slug] with quick-facts panel (born, age, called, spouse, children, career) and outbound links to Official Biography and Conference Talks on churchofjesuschrist.org.**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-03-02T15:24:05Z
- **Completed:** 2026-03-02T15:27:00Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- Created `src/routes/bios/[slug]/+page.js` with `prerender = true`, `entries()` deriving slugs from leaders.json, and `load()` returning the leader object by slug
- Created `src/routes/bios/[slug]/+page.svelte` with breadcrumb nav, photo + name header, quick-facts `<dl>` grid, and two outbound link buttons
- Build produces all 15 pre-rendered HTML files at `build/bios/[slug].html` — one per leader
- Removed the forward-reference 404 whitelist dependency — actual routes now exist so the build naturally succeeds

## Task Commits

Each task was committed atomically:

1. **Task 1: Create +page.js for static prerendering** - `a58611b` (feat)
2. **Task 2: Build bio detail page component** - `d28e596` (feat)

**Plan metadata:** (docs commit follows)

## Files Created/Modified

- `src/routes/bios/[slug]/+page.js` - prerender=true, entries() from leaders.leaders, load() by slug with descriptive error throw
- `src/routes/bios/[slug]/+page.svelte` - Svelte 5 $props(), breadcrumb, photo+name header, quick-facts dl panel, Official Biography and Conference Talks outbound links

## Decisions Made

- `const leader = data.leader` captured at module scope — this is correct for a prerendered static page where `data` is populated once at build time. The Svelte `state_referenced_locally` advisory warning does not apply to prerendered pages and can be safely ignored.
- Conference talks URL constructed as `https://www.churchofjesuschrist.org/study/general-conference/speakers/${leader.slug}?lang=eng` uniformly for all leaders. If Caussé's talks page uses a different slug on the Church's site, that is outside our control.
- `entries()` derives slugs from `leaders.leaders.map` — hard-coding would cause silent breakage when leaders.json is updated.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None — build succeeded on first attempt with 15 HTML files produced.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All 15 bio detail pages are live and navigable from the /bios directory
- Breadcrumb links back to /bios correctly using {base} prefix
- Both outbound links (Official Biography, Conference Talks) open in new tabs with accessible sr-only text
- Phase 4 (Biographies) is now complete — no further plans in this phase

---
*Phase: 04-biographies*
*Completed: 2026-03-02*
