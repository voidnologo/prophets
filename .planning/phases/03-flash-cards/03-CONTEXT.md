# Phase 3: Flash Cards - Context

**Gathered:** 2026-03-02
**Status:** Ready for planning

<domain>
## Phase Boundary

Interactive multiple-choice photo-ID game mode. User sees a leader photo and picks from 4 name options. Wrong choices are eliminated inline until correct. First-try correct answers count toward score. A score summary with replay options is shown at the end. Creating data, biographies, and other game modes are separate phases.

</domain>

<decisions>
## Implementation Decisions

### Session flow
- Start screen: title + "Start" button only — no instructions text
- First card shows immediately after pressing Start
- Manual "Next" button advances to the next card (no auto-advance)
- "Next" is only available after the correct answer has been identified
- Score summary screen shown when all cards are complete

### Answer feedback & elimination mechanic
- Wrong answer selected: that choice is greyed out/disabled (visually eliminated)
- User continues picking from remaining choices until they select the correct one
- Correct answer: highlighted with color + icon + text label (must satisfy ACCESS-01 — not color alone)
- Tone is encouraging throughout — never "Wrong" or "Nope" (per success criteria)
- "Next" button appears once the correct answer is found

### Scoring
- **First-try correct = success** — only counts toward score if picked right on the first attempt
- Subsequent attempts after eliminating wrong choices are for learning only (not penalized in score, just not counted as first-try)
- Score is tracked per session as a running "first-try correct" count

### Score summary screen
- Shows "X / 15 first try" (e.g., "12 / 15")
- Two replay options:
  - "Play Again" — reshuffles all 15 cards for a new session
  - "Replay Missed" — reshuffles only the cards that were NOT first-try correct
  - "Replay Missed" is hidden or disabled if the user got all 15 on the first try

### Claude's Discretion
- Exact color/icon choices for correct answer highlight (must pass colorblind check)
- Specific encouraging phrases to show after correct/incorrect attempts
- Visual treatment of greyed-out eliminated choices
- Card shuffle algorithm
- Loading/transition between cards

</decisions>

<specifics>
## Specific Ideas

- Wrong choices get "greyed out" as they are eliminated — process-of-elimination feel
- Score summary language should feel rewarding, not clinical (e.g., "12 out of 15 on your first try!")
- Replay Missed is a meaningful learning loop — if you got them all right, only "Play Again" appears

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `LeaderCard.svelte` — photo rendering pattern (`{base}/images/leaders/{leader.photo.filename}`) and accessible role/aria attributes can be referenced for the photo display in game mode
- `leaders.json` — 15 leaders with `id`, `name.display`, `title`, `quorum`, `photo.filename`; already imported in +page.svelte — same import pattern applies

### Established Patterns
- **Svelte 5 runes**: `$state`, `$props` used in LeaderCard — flash cards game logic should use same runes pattern
- **Tailwind v4**: all existing styling uses Tailwind utility classes; component-scoped `<style>` blocks only for things Tailwind can't express (e.g., animations)
- **`base` path prefix**: all asset URLs use `import { base } from '$app/paths'` — required for GitHub Pages deploy

### Integration Points
- **Nav.svelte**: Flash Cards link already exists pointing to `/games/flashcards`, currently `active: false` — Phase 3 must set `active: true`
- **New route**: create `src/routes/games/flashcards/+page.svelte` (SvelteKit file-based routing)
- **No existing game/session pattern** — session state, scoring, and card queue logic all need to be built fresh

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 03-flash-cards*
*Context gathered: 2026-03-02*
