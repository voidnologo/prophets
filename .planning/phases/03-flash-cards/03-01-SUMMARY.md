---
phase: 03-flash-cards
plan: "01"
subsystem: game-pages
tags: [flash-cards, svelte5-runes, state-machine, accessibility, tdd]

# Dependency graph
requires:
  - phase: 02-01
    provides: leaders.json data (15 leaders) and LeaderCard photo pattern
  - phase: 01-02
    provides: SvelteKit scaffold with base path configured for GitHub Pages
provides:
  - Complete flash card game at /games/flashcards (start, playing, summary views)
  - Flash card business logic extracted to testable flashcard-logic.ts module
  - Active Flash Cards nav link
affects: []

# Tech tracking
tech-stack:
  added:
    - vitest ^4.0.18 (unit testing)
  patterns:
    - Business logic extracted to pure-function module for unit testability
    - Svelte 5 $state/$derived runes driving view state machine
    - Three-channel feedback pattern (color + SVG icon + text label) for accessibility

key-files:
  created:
    - src/routes/games/flashcards/+page.svelte
    - src/lib/flashcard-logic.ts
    - src/lib/flashcard-logic.test.ts
  modified:
    - src/lib/components/Nav.svelte
    - package.json

key-decisions:
  - "Business logic (shuffle, buildChoices) extracted to flashcard-logic.ts — testable with vitest without needing a browser environment"
  - "firstTryUsed flag prevents multiple requeues — card appended to deck only on first wrong guess, not every subsequent wrong guess (FLASH-03 anti-pattern avoided)"
  - "Feedback text: 'Yes! That's right.' on first try, 'You found it!' after wrong guess(es) — no negative language ('Wrong', 'Nope') anywhere"
  - "buildChoices always draws distractors from allLeaders (full 15) not current deck subset — ensures variety even in Replay Missed sessions"
  - "Score denominator in summary uses allLeaders.length (15) not deck.length — matches expected 'out of 15' wording in requirements"

patterns-established:
  - "Pure-function module pattern for game logic — extract to .ts file, import in Svelte page, test with vitest"
  - "Three-channel accessible feedback: bg-green-600 + SVG checkmark (aria-hidden) + encouraging text label"
  - "Eliminated choices: opacity-50 + line-through + disabled attribute — visual + semantic + interaction all disabled"

requirements-completed: [FLASH-01, FLASH-02, FLASH-03, ACCESS-01]

# Metrics
duration: 2 min
completed: 2026-03-02
---

# Phase 3 Plan 1: Flash Cards Game Summary

**Complete flash card game at /games/flashcards with Fisher-Yates shuffle, 4-choice photo ID, elimination feedback, missed-card requeue, and score summary — built with Svelte 5 runes state machine and pure-function logic tested by vitest.**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-03-02
- **Completed:** 2026-03-02
- **Tasks:** 2 (Task 1: flash card game page; Task 2: activate nav link)
- **Files created:** 3 (page component, logic module, test file)
- **Files modified:** 2 (Nav.svelte, package.json)

## Accomplishments

- Flash card game page created at `src/routes/games/flashcards/+page.svelte` (193 lines)
- Full session state machine: start screen → card-by-card photo ID → score summary
- Business logic extracted to `src/lib/flashcard-logic.ts` with 10 unit tests (all passing)
- Fisher-Yates shuffle is pure (never mutates input), returns new array
- `buildChoices` always returns exactly 4 distinct choices: correct + 3 random distractors
- Wrong guess: adds choice to eliminated Set, requeues card at deck end on first miss only
- Correct guess: green background + inline SVG checkmark + encouraging text feedback
- Eliminated choices: opacity-50 + line-through + `disabled` attribute (visual + semantic + interaction)
- `Next` button appears only when `answered === true`
- Score summary: "Perfect score!" for 15/15, else "X out of 15 on your first try!"
- "Replay Missed (N)" button hidden when user scores perfect
- Flash Cards nav link activated (`active: true`) — renders as `<a>` not `<span>`
- Production build passes with zero TypeScript errors
- Vitest installed; unit test suite included in project going forward

## Task Commits

1. **TDD infrastructure** — vitest + logic module + 10 unit tests
   - `172d090` — test(03-01): add vitest + unit tests for flash card logic (shuffle, buildChoices)
2. **Task 1: Flash card game page** — full Svelte 5 page component
   - `452b8f6` — feat(03-01): build flash card game page with full session state machine
3. **Task 2: Activate nav link** — one-line change
   - `0472398` — feat(03-01): activate Flash Cards nav link

## Files Created/Modified

**Created:**
- `src/routes/games/flashcards/+page.svelte` — 193-line Svelte 5 page component; start/playing/summary view states; imports from flashcard-logic.ts; photo src uses `{base}` for GitHub Pages
- `src/lib/flashcard-logic.ts` — Pure-function business logic: `shuffle<T>`, `buildChoices`, `Leader` type; exported for testing and page use
- `src/lib/flashcard-logic.test.ts` — 10 vitest unit tests covering: shuffle returns same elements, no mutation, new reference; buildChoices returns 4 distinct items including correct, all from pool

**Modified:**
- `src/lib/components/Nav.svelte` — Flash Cards item: `active: false` → `active: true`
- `package.json` — Added vitest devDependency + `"test": "vitest run"` script

## Decisions Made

- **Logic module extraction:** `shuffle` and `buildChoices` extracted to `flashcard-logic.ts` so they can be unit-tested without a browser or Svelte component rendering environment. Vitest runs them as plain TypeScript.
- **Requeue guard uses firstTryUsed flag:** The FLASH-03 requirement says wrong guess on first try causes requeue. The flag prevents subsequent wrong guesses from appending the card again — critical correctness detail that the plan explicitly called out as an anti-pattern to avoid.
- **Distractors drawn from allLeaders (full pool), not current deck:** Even in Replay Missed sessions (where the deck might be 3–5 leaders), distractors still come from all 15. This keeps choices challenging and prevents trivially easy sessions where the user only sees the same small group.
- **Summary denominator is allLeaders.length (15):** Shows "3 out of 15" not "3 out of 5" in Replay Missed sessions — matches the user's mental model of the full game.

## Deviations from Plan

None — plan executed exactly as written.

The TDD flow added a test file and logic module not explicitly in the plan's file list, but these are additive (new infrastructure) rather than deviations from the specified behavior.

## Issues Encountered

None.

## User Setup Required

None — no external services or environment changes required.

## Next Phase Readiness

- Plan 03-01 complete. Requirements FLASH-01, FLASH-02, FLASH-03, and ACCESS-01 satisfied.
- Phase 3 Plan 02 (visual verification checkpoint) is the next step — involves starting dev server, navigating to `/games/flashcards`, and playing through a full session to confirm all game mechanics work in-browser.
- Vitest is now available for future plans that need unit testing (biography helpers, etc.).

---
*Phase: 03-flash-cards*
*Completed: 2026-03-02*
