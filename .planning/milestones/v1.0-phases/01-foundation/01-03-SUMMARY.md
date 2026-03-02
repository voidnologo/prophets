---
phase: 01-foundation
plan: 03
subsystem: ui
tags: [svelte5, sveltekit, tailwindcss, sharp, image-optimization, static-site]

# Dependency graph
requires:
  - phase: 01-01
    provides: leaders.json with all 15 verified leader records, quorum/seniority fields, photo.filename convention
  - phase: 01-02
    provides: SvelteKit scaffold with adapter-static, paths.base='/prophets', Tailwind v4, GitHub Actions pipeline
provides:
  - Nav.svelte with "Know Your Prophets" title, active/disabled link states using aria patterns
  - +layout.svelte app shell with footer reading lastVerified date from leaders.json
  - +page.svelte home page listing all 15 leaders grouped by quorum with optimized photos
  - scripts/optimize-images.js — sharp-based batch optimizer producing headshots and hero images
  - static/images/leaders/ — 15 headshots (400x500px, <80KB) and 15 hero images (600x800px)
  - Phase 1 complete: live-deployable site with all leaders, photos, and verified footer
affects: [02-flip-card-grid, 03-flash-cards, 04-biographies]

# Tech tracking
tech-stack:
  added:
    - "sharp ^0.34.x (devDependency) — image resizing and JPEG optimization"
  patterns:
    - "base path pattern: import { base } from '$app/paths'; use {base}/images/leaders/{filename}"
    - "Inactive nav items are <span> elements with aria-disabled=true, not <a> — avoids keyboard focus on disabled links"
    - "lastVerified sourced from leaders.json at layout level, formatted with toLocaleDateString"
    - "Leader lists filtered by quorum field and sorted by seniority field"
    - "Image paths: headshot = {slug}.jpg (400x500), hero = {slug}-hero.jpg (600x800)"

key-files:
  created:
    - src/lib/components/Nav.svelte
    - scripts/optimize-images.js
    - static/images/leaders/ (30 optimized JPEGs)
  modified:
    - src/routes/+layout.svelte
    - src/routes/+page.svelte
    - .gitignore

key-decisions:
  - "Inactive nav links use <span> not <a> — a disabled anchor still receives keyboard focus and confuses screen readers; spans correctly exclude the item from tab order"
  - "lastVerified read in +layout.svelte, not page — footer is a layout concern shared across all routes"
  - "Image optimizer uses cover+top crop — leader portraits are head-and-shoulders; top crop keeps the face in frame"
  - "scripts/raw-photos/ excluded from git — large source files not needed in repo; optimized outputs in static/ are the production artifacts"
  - "March 2026 data correction applied: Oaks (President), Eyring (First Counselor), Christofferson (Second Counselor), Caussé and Gilbert (new apostles) — sourced from churchofjesuschrist.org"

patterns-established:
  - "All asset URLs: import { base } from '$app/paths'; use as prefix — never root-relative /images/"
  - "Leader filtering: .filter(l => l.quorum === 'first-presidency').sort((a,b) => a.seniority - b.seniority)"
  - "Photo markup: src={base}/images/leaders/{leader.photo.filename} width=48 height=60 — fixed aspect for list view"
  - "Adding a new route: create src/routes/name/+page.svelte; prerender=true inherited from +layout.js"

requirements-completed: [INFRA-03]

# Metrics
duration: 15min
completed: 2026-03-01
---

# Phase 1 Plan 3: Placeholder UI + Image Optimization Summary

**Nav.svelte, layout shell with lastVerified footer, home page listing 15 leaders by quorum with 400x500px sharp-optimized photos — Phase 1 foundation complete with PM-approved March 2026 leadership lineup**

## Performance

- **Duration:** ~15 min (including PM verification checkpoint)
- **Started:** 2026-03-01
- **Completed:** 2026-03-01
- **Tasks:** 3 (2 auto + 1 checkpoint)
- **Files modified:** 7 (+ 30 image files)

## Accomplishments

- Nav.svelte built with accessibility-correct pattern: active link as `<a>`, disabled links as `<span aria-disabled="true">` — prevents keyboard focus on non-functional items
- +layout.svelte reads `lastVerified` from leaders.json and formats it via `toLocaleDateString` — footer date is always data-driven, never hardcoded
- +page.svelte groups leaders by quorum field and sorts by seniority — works with any lineup change requiring only a leaders.json update
- scripts/optimize-images.js produces headshots (400x500px, target <80KB) and hero images (600x800px) via sharp with mozjpeg encoding
- All 15 leader photos optimized and committed; all headshots confirmed under 80KB
- PM verified full UI and approved data accuracy; March 2026 lineup corrections applied (Oaks as President, Caussé/Gilbert added as new apostles)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create Nav.svelte, +layout.svelte, and +page.svelte** - `568e316` (feat)
2. **Task 2: Create image optimization script and optimize leader photos** - `dcaed15` (feat)
3. **Task 3: PM visual verification checkpoint — approved** - `91989c2` (docs)

**Data correction (separate commit):** `9642a7e` fix(data): update leaders to current March 2026 lineup

## Files Created/Modified

- `src/lib/components/Nav.svelte` — App title, active Leaders link, greyed-out Flash Cards and Biographies as aria-disabled spans
- `src/routes/+layout.svelte` — App shell with Nav, slot, and footer; imports leaders.json only for lastVerified date
- `src/routes/+page.svelte` — Home page grouping leaders into First Presidency and Quorum of Twelve sections with photos; uses {base}/images/ paths; attribution comment at top
- `scripts/optimize-images.js` — Node ES module using sharp; reads from scripts/raw-photos/, outputs headshots (400x500) and heroes (600x800) to static/images/leaders/
- `static/images/leaders/*.jpg` — 30 optimized JPEGs (15 headshots + 15 heroes)
- `.gitignore` — Added scripts/raw-photos/ exclusion rule

## Decisions Made

- Inactive nav links use `<span>` not `<a href="">` — a disabled anchor tag still receives keyboard focus via Tab and is announced by screen readers as a link, which is misleading; span elements correctly exclude the item from tab order
- `lastVerified` is read at layout level (not page level) — the footer is a global concern; if the date were loaded per-page it would need to be duplicated in every page's script block
- Image optimizer uses `fit: 'cover', position: 'top'` — leader portraits are head-and-shoulders shots; top crop keeps the face in frame when the aspect ratio is forced to 4:5

## Deviations from Plan

### Data Correction (PM-directed, committed separately)

**March 2026 leadership lineup update applied after PM checkpoint review:**
- President Russell M. Nelson passed away; Dallin H. Oaks became President of the Church
- Henry B. Eyring called as First Counselor, D. Todd Christofferson as Second Counselor
- Two new apostles sustained: Gerald Caussé and J. Anson Gilbert
- leaders.json updated with correct names, titles, quorum assignments, and seniority values
- Committed as: `9642a7e` fix(data): update leaders to current March 2026 lineup

This was not a code deviation — it was a data accuracy correction flagged during PM review of DATA-VERIFICATION.md, consistent with the project rule that data accuracy is paramount.

## Issues Encountered

None during code implementation. The PM checkpoint surfaced the need for a data accuracy correction to reflect the March 2026 leadership lineup, which was applied and committed separately.

## User Setup Required

None — all code changes self-contained. GitHub Actions pipeline from Plan 01-02 will deploy on next push to main.

## Next Phase Readiness

Phase 1 is complete. The live URL (voidnologo.com/prophets) will show all 15 leaders once the gh-pages deployment runs.

For Phase 2 (Flip Card Grid):
- leaders.json data contract is stable — all fields needed for flip cards are present
- `{base}/images/leaders/{slug}.jpg` pattern established for headshot display
- Tailwind v4 utility classes available; scoped CSS needed for CSS 3D flip (preserve-3d) on card components
- Pattern for filtering/sorting leaders by quorum is established in +page.svelte — reuse in grid component
- No blockers

## Self-Check: PASSED

- src/lib/components/Nav.svelte: FOUND
- src/routes/+layout.svelte: FOUND (modified)
- src/routes/+page.svelte: FOUND (modified)
- scripts/optimize-images.js: FOUND
- static/images/leaders/ (30 files): FOUND
- Task 1 commit 568e316: FOUND
- Task 2 commit dcaed15: FOUND
- Task 3 commit 91989c2: FOUND
- Data correction commit 9642a7e: FOUND
- Build passes (npm run build exit 0): VERIFIED
- All 15 headshots under 80KB: VERIFIED
- No hardcoded /images/ paths in src/: VERIFIED

---
*Phase: 01-foundation*
*Completed: 2026-03-01*
