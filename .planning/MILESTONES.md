# Milestones

## v1.0 MVP (Shipped: 2026-03-02)

**Phases:** 4 (Phases 1–4) | **Plans:** 9/10 complete | **Timeline:** 2 days
**Files changed:** 96 | **Source LOC:** 716 (Svelte/JS/TS) | **Git range:** feat(01-01) → feat(04-02)

**Key accomplishments:**
1. 15 verified leader records in `leaders.json` — all data sourced from churchofjesuschrist.org with PM-reviewable verification table and GitHub issue template for future leadership changes
2. SvelteKit 2 + Svelte 5 scaffold deployed to GitHub Pages via GitHub Actions (Tailwind v4, adapter-static, conditional `paths.base`)
3. CSS 3D flip card grid — hover on desktop, tap on iOS, three-layer structure required for cross-browser Safari support; `@media (hover: hover)` duality prevents desktop lock-open bug
4. Flash card game with state machine, four-option distractor algorithm, spaced-repetition missed-card requeue, fully accessible feedback (color + icon + text, no "Wrong"/"Nope" language)
5. Biography directory + 15 pre-rendered static detail pages — quick-facts panel (age, calling date, spouse, children, career), outbound links to Church bio and Conference Talks

**Known gaps:**
- 03-02-PLAN.md (Flash Cards PM verification checkpoint) has no SUMMARY.md — the Flash Cards were PM-reviewed through informal feedback iterations but the formal GSD checkpoint was not run. Accepted as tech debt.

---

