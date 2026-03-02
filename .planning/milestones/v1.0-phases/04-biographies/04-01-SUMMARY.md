---
phase: 04-biographies
plan: 01
subsystem: ui
tags: [svelte, sveltekit, tailwind, biography, directory]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: leaders.json data model with quorum/slug/photo/bio fields
  - phase: 02-flip-card-grid-mvp
    provides: base path conventions and Nav.svelte active link pattern
provides:
  - Biography directory page at /bios showing all 15 leaders grouped by quorum
  - Active Biographies nav link enabling navigation to /bios
  - /bios/[slug] 404 whitelist in svelte.config.js for forward-compatible builds
affects:
  - 04-02 (bio detail pages — links from directory land here)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "base-prefixed hrefs for internal links: {base}/bios/{leader.slug}"
    - "Keyed {#each} with leader.id for Svelte list diffing"
    - "Quorum filter+sort reused from home page: filter(quorum) + sort(seniority)"
    - "handleHttpError whitelist pattern for forward-referenced routes"

key-files:
  created:
    - src/routes/bios/+page.svelte
  modified:
    - src/lib/components/Nav.svelte
    - svelte.config.js

key-decisions:
  - "Whitelist /bios/[slug] 404s in handleHttpError — detail pages built in Plan 04-02, build must not fail on linked-but-unbuilt routes"
  - "No +page.js needed for /bios — layout-level prerender=true in +layout.js covers this static route"

patterns-established:
  - "Bio directory cards: anchor wrapping img + name + title + bio.summary (line-clamp-2)"
  - "First Presidency: lg:grid-cols-3; Quorum of Twelve: lg:grid-cols-6"

requirements-completed: [BIO-01]

# Metrics
duration: 5min
completed: 2026-03-02
---

# Phase 4 Plan 1: Biography Directory Summary

**Responsive /bios directory page listing all 15 leaders grouped by quorum with photo cards linking to individual bio detail pages.**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-03-02T15:20:25Z
- **Completed:** 2026-03-02T15:25:00Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- Activated Biographies nav link (active: false -> active: true) so /bios is reachable from the nav
- Created src/routes/bios/+page.svelte rendering all 15 leaders in two quorum-grouped sections with correct grid breakpoints
- Each leader card is a clickable anchor linking to {base}/bios/{slug} with photo, name, title, and bio.summary (clamped)
- Extended svelte.config.js handleHttpError whitelist to allow /bios/[slug] 404s during build (detail pages not yet created)

## Task Commits

Each task was committed atomically:

1. **Task 1: Activate Biographies nav link** - `5d338b7` (feat)
2. **Task 2: Build biography directory page** - `efda020` (feat, includes Rule 3 auto-fix to svelte.config.js)

**Plan metadata:** (docs commit follows)

## Files Created/Modified

- `src/routes/bios/+page.svelte` - Directory page showing all 15 leaders in two quorum sections; each card is an anchor to /bios/[slug]
- `src/lib/components/Nav.svelte` - Biographies link changed from active: false to active: true
- `svelte.config.js` - Added regex whitelist for /bios/[slug] 404s in handleHttpError

## Decisions Made

- No `+page.js` created for /bios — layout-level `prerender = true` in `+layout.js` already covers all child routes
- Whitelist `/bios/[slug]` 404s in `handleHttpError` using regex `path.match(/\/bios\/[^/]+$/)` — build must not error on forward references to Plan 04-02 routes

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Whitelisted /bios/[slug] 404s in svelte.config.js**
- **Found during:** Task 2 (Build biography directory page)
- **Issue:** Build failed because the prerenderer follows href links from /bios to /bios/[slug] routes which don't exist yet (built in Plan 04-02). The existing handleHttpError only whitelisted static asset extensions, not page routes.
- **Fix:** Added regex check `path.match(/\/bios\/[^/]+$/)` to handleHttpError, returning early (ignoring) for any missing /bios/[slug] path
- **Files modified:** svelte.config.js
- **Verification:** npm run build completes with exit code 0; /bios/[slug] 404s appear in output but no longer throw
- **Committed in:** efda020 (part of Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Essential forward-compatibility fix. The plan notes "404 is expected until Plan 02 builds the detail page" — the whitelist enforces exactly that expectation in the build system. No scope creep.

## Issues Encountered

None beyond the blocking build error resolved above.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- /bios directory page is live and fully navigable
- All 15 leader cards link to /bios/[slug] — those routes will 404 until Plan 04-02 creates the detail page template
- svelte.config.js whitelist is ready and will not interfere when the [slug] route is added

---
*Phase: 04-biographies*
*Completed: 2026-03-02*
