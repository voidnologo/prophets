# Phase 3: Flash Cards - Research

**Researched:** 2026-03-02
**Domain:** Svelte 5 game state management, multiple-choice quiz UX, accessible feedback
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Session flow:**
- Start screen: title + "Start" button only — no instructions text
- First card shows immediately after pressing Start
- Manual "Next" button advances to the next card (no auto-advance)
- "Next" is only available after the correct answer has been identified
- Score summary screen shown when all cards are complete

**Answer feedback & elimination mechanic:**
- Wrong answer selected: that choice is greyed out/disabled (visually eliminated)
- User continues picking from remaining choices until they select the correct one
- Correct answer: highlighted with color + icon + text label (must satisfy ACCESS-01 — not color alone)
- Tone is encouraging throughout — never "Wrong" or "Nope" (per success criteria)
- "Next" button appears once the correct answer is found

**Scoring:**
- First-try correct = success — only counts toward score if picked right on the first attempt
- Subsequent attempts after eliminating wrong choices are for learning only (not penalized, just not counted)
- Score is tracked per session as a running "first-try correct" count

**Score summary screen:**
- Shows "X / 15 first try" (e.g., "12 / 15")
- Two replay options:
  - "Play Again" — reshuffles all 15 cards for a new session
  - "Replay Missed" — reshuffles only cards NOT first-try correct
  - "Replay Missed" is hidden/disabled if user got all 15 on first try

### Claude's Discretion
- Exact color/icon choices for correct answer highlight (must pass colorblind check)
- Specific encouraging phrases to show after correct/incorrect attempts
- Visual treatment of greyed-out eliminated choices
- Card shuffle algorithm
- Loading/transition between cards

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| FLASH-01 | User is shown a photo of one leader and must select the correct name from 4 options, where all 4 options are plausible leaders (not obviously wrong distractors) | Distractor algorithm: shuffle all 15 leaders, pick 3 that are NOT the correct answer; with only 15 leaders all distractors are inherently plausible real leaders |
| FLASH-02 | User sees immediate feedback when they answer — the correct name is revealed, with color + icon + text (never color alone) | Three-channel feedback pattern: green background + checkmark SVG icon + "Correct!" text; wrong attempts show muted/struck styling only on the eliminated button |
| FLASH-03 | When a user answers incorrectly, the card is reshuffled back into the remaining deck so they encounter it again before the session ends | Queue management: on first wrong guess, push card index to end of deck array; re-encounters use same card object with state reset |
| ACCESS-01 | All feedback (correct/incorrect, score) uses color + icon + text — never color alone — so colorblind users receive equivalent information | Every state change shows: (1) color shift, (2) SVG icon (check/x), (3) text label — verified pattern from WCAG 1.4.1 (Use of Color) |
</phase_requirements>

---

## Summary

Phase 3 adds a self-contained flash card game at a new SvelteKit route (`/games/flashcards`). The entire game is driven by client-side Svelte 5 `$state` — no server calls, no persistence, no new dependencies. The tech stack (SvelteKit 2, Svelte 5, Tailwind v4) is already installed and working.

The core implementation challenge is the card queue algorithm: maintaining an ordered deck, inserting missed cards back into the queue, tracking first-try correctness, and generating 3 plausible distractors from the 15-leader pool. With only 15 leaders all distractors are real leaders, satisfying FLASH-01 automatically. FLASH-03 (reappear after wrong guess) is implemented by mutating the deck array and re-rendering the same component — no separate "missed" state needed until end-of-round.

The accessibility requirement (ACCESS-01) shapes every feedback UI decision: every state — eliminated choice, correct answer, score — must combine color + a visual icon + text. Tailwind v4 utility classes handle all visual states; no new CSS animation work is needed beyond what Phase 2 established.

**Primary recommendation:** Build everything as a single `+page.svelte` file with clearly separated view states (`start | playing | summary`) driven by a handful of `$state` variables. No sub-components are required, though a `FlashCard.svelte` component can be extracted if the markup grows large.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Svelte 5 | ^5.51.0 (installed) | Reactive game state via `$state`, `$derived` | Already in project; runes provide fine-grained reactivity ideal for step-by-step game state |
| SvelteKit 2 | ^2.50.2 (installed) | File-based routing for `/games/flashcards` | Already configured with `prerender = true` and `adapter-static` |
| Tailwind v4 | ^4.2.1 (installed) | Utility classes for all button states and feedback colors | Already in project; v4 uses CSS `@theme` — no config file needed |

### No New Dependencies
All game logic can be implemented with native JavaScript (array shuffle, queue management) and the existing stack. Zero new npm packages required for this phase.

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Plain `$state` array as queue | XState finite state machine | XState adds 10KB+, overkill for a 3-state game (start/playing/summary); `$state` is sufficient |
| Inline SVG icons | Heroicons / Lucide package | Adding an icon library adds dependency churn; inline SVG for 2 icons (check, x-mark) is preferable |
| Single-file page component | Multiple sub-components | Extractable later; single file is simpler to plan and execute for this scope |

---

## Architecture Patterns

### Recommended Project Structure
```
src/routes/games/flashcards/
└── +page.svelte          # Entire flash card game — start, playing, summary views

src/lib/components/
└── Nav.svelte            # UPDATE: set Flash Cards link active: true
```

No new `$lib` utilities are needed — the deck/distractor logic lives inline in the page component and is simple enough not to warrant extraction.

### Pattern 1: View State Machine with `$state`

**What:** A single `view` variable controls which UI panel renders (`'start' | 'playing' | 'summary'`). All game state is co-located in `$state` variables at the top of `<script>`.

**When to use:** Any multi-screen flow with < 5 screens and no async operations. Avoids routing complexity.

**Example:**
```typescript
// Svelte 5 runes — matches established project pattern (see LeaderCard.svelte)
let view = $state<'start' | 'playing' | 'summary'>('start');
let deck = $state<typeof leaders[0][]>([]);
let currentIndex = $state(0);
let choices = $state<typeof leaders[0][]>([]);
let eliminated = $state<Set<string>>(new Set());
let firstTryUsed = $state(false);   // true once user has made ANY guess this card
let firstTryCorrect = $state(0);    // running count of first-try successes
let missedCards = $state<typeof leaders[0][]>([]);
let answered = $state(false);       // true once correct answer found
```

### Pattern 2: Fisher-Yates Shuffle

**What:** Standard in-place array shuffle. Produces unbiased random ordering. Used for both the deck shuffle and distractor selection.

**When to use:** Any time you need random ordering of a fixed array.

**Example:**
```typescript
// Source: Fisher-Yates (Knuth) algorithm — standard JavaScript idiom
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];  // copy — do not mutate source
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
```

### Pattern 3: Distractor Selection (FLASH-01)

**What:** For a given correct leader, pick 3 random distractors from the remaining 14. Shuffle all 4 so correct answer position is random.

**When to use:** Every card render — recalculate choices when `currentIndex` changes.

**Example:**
```typescript
function buildChoices(correct: Leader, allLeaders: Leader[]): Leader[] {
  const pool = allLeaders.filter(l => l.id !== correct.id);
  const distractors = shuffle(pool).slice(0, 3);
  return shuffle([correct, ...distractors]);
}
```

With 15 leaders, all distractors are real leaders — FLASH-01 ("plausible, not obviously wrong") is inherently satisfied.

### Pattern 4: Missed-Card Requeue (FLASH-03)

**What:** On the first wrong guess for a card, append that card to the end of the `deck` array. The card will reappear after all remaining original cards.

**When to use:** Only on the FIRST wrong guess — do not re-append on subsequent wrong guesses for the same card.

**Example:**
```typescript
function handleGuess(choice: Leader) {
  if (answered) return;  // guard: ignore clicks after correct answer found

  if (choice.id === currentCard.id) {
    // Correct answer found
    if (!firstTryUsed) {
      firstTryCorrect++;  // only count if no wrong guess yet this card
    } else {
      missedCards = [...missedCards, currentCard];  // track for "Replay Missed"
    }
    answered = true;
  } else {
    // Wrong guess
    eliminated = new Set([...eliminated, choice.id]);
    if (!firstTryUsed) {
      // First wrong guess: requeue this card at end of deck
      deck = [...deck, currentCard];
    }
    firstTryUsed = true;
  }
}
```

Note: `missedCards` tracks cards where the user was NOT first-try correct, for use in the "Replay Missed" button on the summary screen.

### Pattern 5: Advancing to Next Card

**What:** Increment `currentIndex`, then reset per-card state (`eliminated`, `firstTryUsed`, `answered`, `choices`).

**Example:**
```typescript
function nextCard() {
  currentIndex++;
  eliminated = new Set();
  firstTryUsed = false;
  answered = false;
  if (currentIndex < deck.length) {
    choices = buildChoices(deck[currentIndex], allLeaders);
  } else {
    view = 'summary';
  }
}
```

### Pattern 6: Accessible Feedback (ACCESS-01)

**What:** Every state communicates through THREE channels simultaneously: color, icon, text. Applies to: eliminated choices, correct answer, score display.

**Color choices that work for colorblindness:**
- Correct: green (`bg-green-600 text-white`) — safe for protanopia/deuteranopia when paired with icon + text
- Eliminated: gray (`bg-gray-200 text-gray-400 line-through opacity-60`) — communicates "inactive" without relying on red
- Active/unselected: white with border (`bg-white border-2 border-gray-300`)

**Icon choices (inline SVG, no library needed):**
- Correct: checkmark (`<svg>` path for check icon, `aria-label="Correct"`)
- Eliminated: does NOT need an error X — greying out communicates elimination

**Text label examples (encouraging, per CONTEXT.md):**
- Correct first try: "Yes! That's right."
- Correct after eliminating: "You found it!"
- After wrong guess (on the eliminated button label): no extra text needed — the button is just greyed

**Example — answer button rendering:**
```svelte
{#each choices as choice}
  {@const isEliminated = eliminated.has(choice.id)}
  {@const isCorrect = answered && choice.id === currentCard.id}
  <button
    onclick={() => handleGuess(choice)}
    disabled={isEliminated || answered}
    class:bg-green-600={isCorrect}
    class:text-white={isCorrect}
    class:opacity-50={isEliminated}
    class:line-through={isEliminated}
    class:cursor-not-allowed={isEliminated || answered}
    aria-disabled={isEliminated}
    class="w-full px-4 py-3 rounded-lg border-2 text-left font-medium transition-colors"
  >
    {#if isCorrect}
      <!-- Inline SVG checkmark -->
      <svg class="inline w-5 h-5 mr-2" aria-hidden="true" ...>...</svg>
    {/if}
    {choice.name.display}
  </button>
{/each}
```

### Anti-Patterns to Avoid

- **Auto-advancing after correct answer:** Breaks the deliberate "Next" button flow the user decided. Users need time to register the correct answer.
- **Using `red` for eliminated choices:** Red implies "error/alarm"; grey is correct — elimination is neutral, not bad.
- **Re-appending missed card on every wrong guess:** Only append on the FIRST wrong guess. Appending again on second/third wrong guess would cause a card to appear multiple extra times.
- **Mutating the `allLeaders` source array in shuffle:** Always copy before shuffling — `[...arr]` — to avoid scrambling the original data.
- **Using `<a>` tags for the answer buttons:** These are actions, not navigation. Use `<button>` elements for correct semantics and keyboard behavior.
- **Storing `firstTryCorrect` in the eliminated `Set`:** Keep scoring state separate from UI state. `firstTryUsed` is per-card; `firstTryCorrect` is session-total.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Array shuffling | Custom swap loops | Fisher-Yates (standard JS idiom, 8 lines) | Well-known, unbiased; don't reinvent |
| Icon rendering | PNG/image icons | Inline SVG (2 icons, ~10 lines each) | No network request, scalable, colorable via CSS, no package needed |
| Distractor deduplication | Complex filtering | `filter(l => l.id !== correct.id)` | ID uniqueness already guaranteed by `leaders.json` |
| State persistence | localStorage for session | None — session is ephemeral by design (v2 deferred) | Out of scope for v1; in-memory `$state` is correct |

**Key insight:** With only 15 leaders and no async operations, this game needs zero external dependencies. The complexity is in the state sequencing, not the infrastructure.

---

## Common Pitfalls

### Pitfall 1: Re-appending Missed Card Multiple Times
**What goes wrong:** If `deck.push(currentCard)` is called on every wrong guess (not just the first), a single difficult card could appear 3+ extra times in one session.
**Why it happens:** Naive "wrong answer → requeue" logic without tracking whether the card was already requeued.
**How to avoid:** Use the `firstTryUsed` boolean — only append when transitioning from `firstTryUsed === false` to `true`.
**Warning signs:** QA session where one card appears far more than twice.

### Pitfall 2: `currentCard` Computed Before `deck` is Populated
**What goes wrong:** `deck[currentIndex]` is `undefined` on first render if deck initialization is deferred.
**Why it happens:** `$derived` or direct access to array before `startGame()` populates it.
**How to avoid:** Either guard with `{#if view === 'playing' && currentCard}` or initialize deck in `startGame()` before changing `view`.

### Pitfall 3: Stale `choices` After Card Advance
**What goes wrong:** The choice buttons for card N still show when card N+1 is displayed.
**Why it happens:** `choices` is not recalculated in `nextCard()`.
**How to avoid:** Always call `choices = buildChoices(deck[currentIndex], allLeaders)` as the first line of `nextCard()` before any `view` change.

### Pitfall 4: `answered` Guard Missing on Button Click
**What goes wrong:** After finding the correct answer, a user can still click non-eliminated (but wrong) buttons if the handler doesn't guard.
**Why it happens:** Forgetting `if (answered) return;` at top of `handleGuess`.
**How to avoid:** Add the guard. Also set `disabled={answered}` on all buttons as a UI-level fallback.

### Pitfall 5: `base` Path Missing on Photo `src`
**What goes wrong:** Leader photos 404 in production (GitHub Pages at `/prophets/`).
**Why it happens:** Using `/images/leaders/...` instead of `{base}/images/leaders/...`.
**How to avoid:** Import `{ base } from '$app/paths'` — this is an established pattern in the project (see `LeaderCard.svelte` line 3).

### Pitfall 6: Nav Link Not Activated
**What goes wrong:** Flash Cards link in `Nav.svelte` remains greyed out (`active: false`) even though the route exists.
**Why it happens:** The CONTEXT.md explicitly calls this out — the nav link is currently a `<span>` (disabled).
**How to avoid:** In `Nav.svelte`, change `{ href: ..., label: 'Flash Cards', active: false }` to `active: true`.

### Pitfall 7: `missedCards` vs. `firstTryCorrect` Divergence
**What goes wrong:** `missedCards.length + firstTryCorrect !== 15` due to double-counting or wrong tracking.
**Why it happens:** Appending to `missedCards` at the wrong point in `handleGuess` (e.g., on each wrong guess vs. once at "correct found after wrong").
**How to avoid:** Only push to `missedCards` when `answered = true` AND `firstTryUsed === true`.

---

## Code Examples

### Complete Game State Initialization
```typescript
// Source: Svelte 5 runes pattern — matches existing project (LeaderCard.svelte)
import leaders from '$lib/data/leaders.json';
import { base } from '$app/paths';

const allLeaders = leaders.leaders;

// View state
let view = $state<'start' | 'playing' | 'summary'>('start');

// Deck state
let deck = $state<(typeof allLeaders)[0][]>([]);
let currentIndex = $state(0);
let choices = $state<(typeof allLeaders)[0][]>([]);

// Per-card state (reset on nextCard)
let eliminated = $state(new Set<string>());
let firstTryUsed = $state(false);
let answered = $state(false);

// Session scoring state
let firstTryCorrect = $state(0);
let missedCards = $state<(typeof allLeaders)[0][]>([]);

// Derived — safe because we only read when view === 'playing'
let currentCard = $derived(deck[currentIndex]);

function startGame(subset?: (typeof allLeaders)[0][]) {
  const source = subset ?? allLeaders;
  deck = shuffle(source);
  currentIndex = 0;
  firstTryCorrect = 0;
  missedCards = [];
  eliminated = new Set();
  firstTryUsed = false;
  answered = false;
  choices = buildChoices(deck[0], allLeaders);
  view = 'playing';
}
```

### Summary Screen Logic
```svelte
<!-- Summary screen — always shows "Play Again"; shows "Replay Missed" only if missedCards.length > 0 -->
{#if view === 'summary'}
  <div class="text-center space-y-6 py-12">
    <h2 class="text-3xl font-bold">
      {firstTryCorrect === allLeaders.length
        ? "Perfect score!"
        : `${firstTryCorrect} out of ${allLeaders.length} on your first try!`}
    </h2>
    <div class="flex gap-4 justify-center">
      <button onclick={() => startGame()} class="btn-primary">Play Again</button>
      {#if missedCards.length > 0}
        <button onclick={() => startGame(missedCards)} class="btn-secondary">
          Replay Missed ({missedCards.length})
        </button>
      {/if}
    </div>
  </div>
{/if}
```

### Inline Checkmark SVG (No Library)
```svelte
<!-- Accessible check icon — aria-hidden because sibling text conveys meaning -->
<svg
  xmlns="http://www.w3.org/2000/svg"
  class="inline w-5 h-5 mr-1 flex-shrink-0"
  aria-hidden="true"
  viewBox="0 0 20 20"
  fill="currentColor"
>
  <path fill-rule="evenodd"
    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 13.586l7.293-7.293a1 1 0 011.414 0z"
    clip-rule="evenodd" />
</svg>
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Svelte 4 `<slot />` in layouts | Svelte 5 `{@render children()}` snippets | Svelte 5 (2024) | Project currently uses legacy `<slot />` in `+layout.svelte` — this is valid, do not change it in this phase |
| Svelte 4 `export let prop` | Svelte 5 `$props()` rune | Svelte 5 (2024) | Project already uses `$props()` in `LeaderCard.svelte` — match this pattern in any new component |
| Svelte 4 `let count = 0` reactive via compiler | Svelte 5 `let count = $state(0)` | Svelte 5 (2024) | Project already uses `$state` in `LeaderCard.svelte` — match this pattern |

**Deprecated/outdated:**
- `$: derived = ...` (Svelte 4 reactive declarations): replaced by `$derived(...)` rune in Svelte 5. Use `$derived` for anything computed from `$state`.
- `createEventDispatcher()`: replaced by callback props in Svelte 5. Not needed for this phase (no child-to-parent events in the single-file design).

---

## Open Questions

1. **Tailwind v4 `disabled:` variant behavior on `<button disabled>`**
   - What we know: Tailwind v4 uses CSS `@layer` and first-party variant support; `disabled:` variant should work on native `disabled` attribute.
   - What's unclear: Whether `aria-disabled` (non-native) triggers `disabled:` Tailwind variant.
   - Recommendation: Use native `disabled` attribute on eliminated/post-correct buttons — this gives both Tailwind variant support AND correct browser behavior (keyboard, click prevention). Use `aria-disabled` as supplemental, not as the primary disable mechanism.

2. **Slot vs. snippet in layout.svelte**
   - What we know: The existing `+layout.svelte` uses `<slot />` (Svelte 4 legacy API), which Svelte 5 still supports.
   - What's unclear: Whether there's a planned migration to `{@render children()}`.
   - Recommendation: Do not change `+layout.svelte` in this phase. Consistency with existing code is more valuable than API modernization right now.

---

## Sources

### Primary (HIGH confidence)
- Direct code inspection of `LeaderCard.svelte`, `Nav.svelte`, `+page.svelte`, `+layout.svelte`, `+layout.js`, `svelte.config.js`, `package.json` — established project patterns
- `leaders.json` — confirmed data structure (id, slug, name.display, photo.filename, quorum, seniority — 15 leaders total)
- `.planning/phases/03-flash-cards/03-CONTEXT.md` — locked user decisions
- `.planning/REQUIREMENTS.md` — FLASH-01, FLASH-02, FLASH-03, ACCESS-01 requirement text
- Fisher-Yates shuffle — standard computer science algorithm, well-documented

### Secondary (MEDIUM confidence)
- WCAG 1.4.1 "Use of Color" — principle behind ACCESS-01 three-channel feedback rule (color + icon + text)
- Svelte 5 runes behavior (`$state`, `$derived`) — consistent with installed version ^5.51.0 and project's existing usage

### Tertiary (LOW confidence)
- None — all findings are grounded in direct code inspection or established algorithms.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all libraries already installed and in use; no new packages
- Architecture: HIGH — patterns derived directly from existing working code (LeaderCard.svelte) and locked user decisions (CONTEXT.md)
- Pitfalls: HIGH — derived from direct analysis of the state machine logic, not from hearsay
- Distractor algorithm: HIGH — Fisher-Yates is a well-known standard; 15-leader constraint makes FLASH-01 trivially satisfiable

**Research date:** 2026-03-02
**Valid until:** 2026-06-01 (stable stack — SvelteKit 2, Svelte 5, Tailwind v4 are stable releases)
