---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
current_plan: Not started
status: completed
stopped_at: Completed 04-03-PLAN.md
last_updated: "2026-03-02T16:04:56.946Z"
progress:
  total_phases: 4
  completed_phases: 3
  total_plans: 10
  completed_plans: 9
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-02)

**Core value:** Learn the people who lead the Church
**Current focus:** Planning next milestone (v1.1)

## Current Position
- **Milestone:** v1.0 — ARCHIVED
- **Phase:** 4 — Biographies — COMPLETE
- **Current Plan:** N/A — v1.0 milestone complete
- **Status:** Ready for v1.1 planning

## Last Session
- **Stopped at:** complete-milestone v1.0
- **Resume with:** /gsd:new-milestone

## Key Decisions
| Decision | Rationale | Decided |
|---|---|---|
| SvelteKit + adapter-static | Pre-renders bios, minimal JS, GitHub Pages compatible | Phase 0 |
| SortableJS for DnD | Native HTML5 DnD broken on iOS Safari | Phase 0 |
| Static leaders.json | No backend needed; leadership changes infrequently | Phase 0 |
| GitHub Pages hosting | Free, static-only, no server required | Phase 0 |
| Data sourced from churchofjesuschrist.org only | Accuracy is a primary requirement | Phase 0 |
| Tailwind CSS v4 + scoped styles for 3D flip | Tailwind handles layout; scoped CSS handles preserve-3d where arbitrary syntax would be unreadable | Phase 0 |
| paths.base = '/prophets' set on day one | GitHub Pages serves at /prophets/; root-relative paths 404 in production | Phase 0 |
| Biographies PM-reviewed before commit | Hallucinated facts about living religious leaders are not recoverable; sourcing discipline enforced at authoring time | Phase 0 |
| quorum values as kebab-case strings | Consistent with slug conventions; safe for switch/filter logic in all phases | Plan 01-01 |
| id === slug (both fields kept) | id for map lookups/keying, slug for route params; eliminates ambiguity downstream | Plan 01-01 |
| photo.filename stores slug only (no path) | SvelteKit base path applied at render time; hardcoding breaks GitHub Pages deployment | Plan 01-01 |
| conferenceTalks/triviaFacts initialized as [] not null | Downstream consumers can iterate safely without null checks | Plan 01-01 |
| prerender=true in +layout.js | adapter-static skips index.html without explicit prerender; must be set at layout level to cover all routes | Plan 01-02 |
| handleHttpError in svelte.config.js | Prerender server can't serve /prophets/ static assets; whitelist image/icon 404s to prevent build failure | Plan 01-02 |
| Use sv CLI (not npm create svelte) | create-svelte is deprecated as of 2025; sv provides non-interactive flags for automation | Plan 01-02 |
| Inactive nav links use span not a | Disabled anchor tags still receive keyboard focus; span elements correctly exclude items from tab order | Plan 01-03 |
| March 2026 lineup correction applied | Oaks as President, Eyring as First Counselor, Christofferson as Second Counselor, Caussé and Gilbert as new apostles — sourced from churchofjesuschrist.org | Plan 01-03 |
| Image optimizer uses cover+top crop | Leader portraits are head-and-shoulders; top crop keeps face in frame when forcing 4:5 aspect ratio | Plan 01-03 |
| Hover/tap duality via @media (hover: hover) | Desktop uses CSS-only hover, touch uses $state toggle — JS-driven .flipped suppressed on hover-capable devices to prevent desktop lock-open bug | Plan 02-01 |
| Three-layer flip structure required | Scene > card > faces required for backface-visibility to work in Safari; two-layer approach breaks cross-browser | Plan 02-01 |
| Keyed {#each} with leader.id | Prevents flip state bleeding when card positions reorder in future phases | Plan 02-01 |
| Large back-face photo replaces thumbnail | Thumbnail-only back face too small on mobile; redesign uses large photo (~75% card height) + bold name for immediate identification on flip | Plan 02-02 |
| Dev server host binding via vite.config.js | `server: { host: true }` binds to 0.0.0.0 so real iOS devices on LAN can connect without ngrok/tunnel | Plan 02-02 |
| PM verifies on live GitHub Pages URL for iOS | Avoids localhost tunnel complexity; tests the actual production deployment path | Plan 02-02 |
| flashcard-logic.ts extracts pure functions for testability | shuffle/buildChoices tested with vitest without browser; Svelte page imports from module | Plan 03-01 |
| firstTryUsed flag prevents multiple requeues | Card appended to deck only on first wrong guess — re-appending on every wrong guess would inflate deck size indefinitely | Plan 03-01 |
| Distractors drawn from allLeaders (full pool) not deck subset | Keeps choices challenging even in Replay Missed sessions with small deck | Plan 03-01 |
| /bios/[slug] 404s whitelisted in handleHttpError | Detail pages built in Plan 04-02; build must not fail on forward references from directory page links | Plan 04-01 |
| No +page.js for /bios route | Layout-level prerender=true in +layout.js already covers all child static routes; separate +page.js is redundant | Plan 04-01 |
| entries() derives slugs from leaders.leaders.map | Never hard-coded — stays in sync with data changes; hard-coding breaks silently on leadership changes | Plan 04-02 |
| Conference talks URL uses leader.slug uniformly | Consistent pattern across all leaders; if Caussé's talks page uses a different slug that is the Church site's responsibility | Plan 04-02 |

## Blockers
(none)

## Notes
- All v2 features (seniority ordering game, typed name entry, trivia, extended accessibility, high score persistence) are explicitly deferred out of v1 scope.
- Every internal link and asset path must use SvelteKit's `base` export from `$app/paths` — never a root-relative path.
- Flash card and biography work must be tested on a real iOS device, not Chrome DevTools emulation.

## Performance Metrics

| Phase | Plan | Duration | Tasks | Files |
|---|---|---|---|---|
| 01-foundation | 01 | 3 min | 2 | 3 |
| 01-foundation | 02 | 3 min | 2 | 15 |
| 01-foundation | 03 | 15 min | 3 | 37 |
| 02-flip-card-grid-mvp | 01 | 2 min | 2 | 2 |
| 02-flip-card-grid-mvp | 02 | ~30 min | 2 | 2 |
| 03-flash-cards | 01 | 2 min | 2 | 5 |
| 04-biographies | 01 | 5 min | 2 | 3 |
| 04-biographies | 02 | 3 min | 2 | 2 |
| 04-biographies | 03 | ~1 min | 2 | 0 |

---
*Last updated: 2026-03-02 after v1.0 milestone archived*

