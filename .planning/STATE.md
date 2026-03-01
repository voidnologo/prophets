# Project State

## Current Position
- **Milestone:** 1 — v1
- **Phase:** Not started
- **Status:** Planning complete, ready to begin Phase 1

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

## Blockers
(none)

## Notes
- All v2 features (seniority ordering game, typed name entry, trivia, extended accessibility, high score persistence) are explicitly deferred out of v1 scope.
- Every internal link and asset path must use SvelteKit's `base` export from `$app/paths` — never a root-relative path.
- Flash card and biography work must be tested on a real iOS device, not Chrome DevTools emulation.

---
*Last updated: 2026-03-01*
