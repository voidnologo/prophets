# Research Summary

A synthesis of STACK.md, FEATURES.md, ARCHITECTURE.md, and PITFALLS.md for the Prophets & Apostles learning app.

---

## Recommended Stack

- **SvelteKit 2 + Svelte 5** (`@sveltejs/kit@^2.x`, `svelte@^5.x`) with `@sveltejs/adapter-static` — pre-renders bio pages to flat HTML at build time; game pages ship as reactive Svelte components with minimal JS bundle; Svelte 5 runes (`$state`, `$derived`, `$effect`) replace any need for a global state library
- **Tailwind CSS v4** for layout, spacing, responsive grid, and typography; scoped `<style>` blocks inside Svelte components for the 3D flip animation (`transform-style: preserve-3d`, `backface-visibility`) where Tailwind arbitrary syntax would be unreadable
- **SortableJS `^1.15.x`** for the drag-to-order seniority game — mandatory because the native HTML5 DnD API does not fire events on iOS Safari; there is no acceptable alternative for a mobile-first app
- **Vite 6** included via SvelteKit — no additional configuration; `npm run dev`, `npm run build`, `npm run preview`
- **GitHub Actions + `peaceiris/actions-gh-pages@v4`** for CI/CD — deploys the `/build` directory to the `gh-pages` branch on every push to `main`; `paths.base: '/prophets'` must be set in `svelte.config.js` or all assets 404 in production

---

## Architecture Overview

The app is a fully static SvelteKit site: biography pages pre-render to real HTML files at build time, and each game mode is an isolated `+page.svelte` component that imports from a single shared data module (`src/lib/data/leaders.json`). All leader data — names, seniority order, photos, bio slugs, conference talk links, and trivia facts — lives in that one JSON file, which is the single source of truth for every feature. There is no server, no API, no database, and no runtime data fetching; the entire app is `npm run build` → flat files deployed to GitHub Pages.

---

## Key Feature Decisions

- **Flip card trigger:** `mouseenter`/`mouseleave` on pointer devices; tap-to-toggle on touch devices (detect via `@media (hover: none)`). Tap = flip only — the bio page link must be a separate "Learn More" button on the card back, not the whole card, to prevent tap conflicts
- **Reduced motion:** Respect `prefers-reduced-motion` — fall back to an instant reveal with no animation
- **Flash card wrong answers:** Shuffle missed cards back into the remaining deck (simple spaced repetition); show score + full review at round end
- **Ordering game:** Do not auto-evaluate on every card drop; require an explicit "Check My Order" button so users can rethink freely; show correct vs. placed positions in the result, not just a count
- **Typed name entry:** Case-insensitive, Levenshtein distance ≤ 2 for "close enough" acceptance; hint button reveals one random unrevealed character per press, capped at `floor(name_length / 3)` hints; add `autocorrect="off" autocomplete="off" spellcheck="false"` to the input
- **Biography pages:** 300–600 word narratives at 6th–8th grade reading level; quick-facts sidebar; conference talks newest-to-oldest; "Data current as of [date]" visible in the footer
- **Tone throughout:** Neutral, encouraging feedback language — never "Wrong!" or "Nope!"; the subject matter calls for respectful presentation
- **Deliberately avoided:** Countdown timers, lives/failure punishment, user accounts, leaderboards, ads, autoplay audio/video, and complex onboarding — all are anti-features for this audience and context
- **Accessibility non-negotiables:** All images have `alt` text (empty in game modes to avoid revealing the answer); color is never the only feedback indicator (icon + color + text); `aria-live="polite"` region announces quiz results; flip cards use `role="button"` + `tabindex="0"` + keyboard handler; drag-and-drop has an arrow key + Space alternative

---

## Critical Gotchas

1. **iOS Safari DnD is completely broken (C1).** The native HTML5 `draggable` API fires no events on iOS Safari — it looks fine in Chrome DevTools mobile emulation but fails on a real iPhone. Use SortableJS from the first line of the ordering game; do not plan to retrofit it later, as that requires a full rewrite of the game component.

2. **`transform-style: preserve-3d` is silently destroyed by common CSS (C2).** Applying `overflow: hidden`, `filter`, `opacity < 1`, `clip-path`, or `will-change: opacity` to a 3D card flattens the context and the flip degrades to a 2D squish with no error or warning. Use a strict three-layer structure: outer `.card` holds sizing and visual effects only; `.card-inner` holds the `preserve-3d` transform only; `.card-front` and `.card-back` hold `backface-visibility: hidden`. Always include `-webkit-backface-visibility: hidden` — Safari still requires the prefix.

3. **GitHub Pages base URL breaks all asset paths (C4).** The site is served at `username.github.io/prophets/`, not `/`. Root-relative paths like `/images/nelson.jpg` work locally but 404 in production. Set `paths.base` in `svelte.config.js` on day one and use SvelteKit's `base` export from `$app/paths` in every internal link. Verify the real deployment URL during Phase 1 — not Phase 4.

4. **Factual errors in biographies of living religious leaders destroy credibility (C5).** AI-assisted bio writing carries hallucination risk; incorrect birth years, wrong spouse names, or fabricated career details are not recoverable in this context. Every specific fact must be individually sourced from `churchofjesuschrist.org` before committing. Add a `source` URL to every `triviaFact`. Have the PM review each biography before it is committed. Omit uncertain facts rather than include unverified ones.

5. **Static data goes stale when leadership changes (C3).** When a leader is called, released, or passes away, the app shows outdated data with no automatic alert. Display a visible "Leader data last verified: [date]" in the footer from Phase 1, and document a concrete update checklist in the repo (which files change, in what order) before shipping.

---

## Build Order

1. **Verify and write `leaders.json`** — confirm all 15 leaders, seniority integers, calling dates, and names against `churchofjesuschrist.org`; lock the schema; everything downstream depends on correct data
2. **SvelteKit project scaffold** — init project, configure `@sveltejs/adapter-static`, set `paths.base = '/prophets'`, wire up GitHub Actions deploy workflow, and validate the live GitHub Pages URL with a placeholder home page
3. **Source and optimize all 15 photos** — resize to 400×500px headshots and 600×800px bio heroes, compress under 80KB each, place in `static/images/leaders/`; research Church photo licensing before committing
4. **`LeaderCard.svelte` flip component + `+layout.svelte` nav** — implement the three-layer 3D CSS structure, `mouseenter`/`mouseleave` and tap-to-toggle triggers, `prefers-reduced-motion` fallback, keyboard accessibility (`role="button"`, `tabindex`, `onkeydown`), and Safari `-webkit-` prefix
5. **`+page.svelte` home flip-card grid** — responsive grid of 15 cards using `LeaderCard`; add "last verified" date to footer; add "Data current as of" note — **this is the MVP ship point**
6. **`games/flashcards/+page.svelte`** — multiple-choice flash card mode; establishes the reusable game page pattern (progress indicator, `aria-live` feedback region, score display, end-of-round review, respectful language); missed cards re-enter the deck
7. **`games/order/+page.svelte` + SortableJS** — drag-to-order seniority game using SortableJS touch-compatible library; explicit "Check My Order" submit; result view showing correct vs. placed positions; keyboard arrow key alternative
8. **`games/typed/+page.svelte` + `utils.ts` helpers** — typed name entry with Levenshtein fuzzy matching, hint system, `autocorrect="off"` input attributes
9. **`bios/[slug]/+page.svelte` + all 15 narrative `.md` files** — biography pages pre-rendered at build time; each fact sourced and PM-reviewed before commit; conference talks section newest-to-oldest
10. **Populate `triviaFacts` in `leaders.json` from bio content, then build `games/trivia/+page.svelte`** — trivia questions sourced exclusively from the verified bio content written in Step 9; add `source` URLs to every fact

---

## Watch Out For

- **Always test on a real iOS device, not DevTools emulation.** Chrome's mobile emulation does not replicate iOS Safari's touch event model. The DnD game and flip card tap behavior must be verified on an actual iPhone before each phase ships.
- **Never use a root-relative path for assets or links.** Every internal `href` and every image `src` must go through SvelteKit's `base` export. One hard-coded `/images/...` path will silently break in production while working perfectly in development.
- **Every fact in a biography or trivia question must have a source URL.** There is no runtime check for accuracy. The only protection against hallucinated content is a discipline of sourcing every specific claim to `churchofjesuschrist.org` at authoring time and PM review before commit.
- **Tone and accessibility are not afterthoughts.** The `aria-live` region, keyboard handlers, color-plus-icon feedback, and respectful language should be built into the first game component as a pattern — retrofitting accessibility across six game modes after the fact is significantly harder than establishing the pattern once in Phase 2.
