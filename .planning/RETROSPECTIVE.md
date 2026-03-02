# Project Retrospective

*A living document updated after each milestone. Lessons feed forward into future planning.*

## Milestone: v1.0 — MVP

**Shipped:** 2026-03-02
**Phases:** 4 | **Plans:** 9 (10 planned, 1 checkpoint skipped)
**Timeline:** 2 days | **Commits:** 55

### What Was Built

1. `leaders.json` — 15 verified leader records, all sourced from churchofjesuschrist.org, with DATA-VERIFICATION.md and GitHub issue template for leadership changes
2. SvelteKit 2 + Svelte 5 scaffold — adapter-static, Tailwind v4, GitHub Actions deploy to gh-pages with conditional `paths.base`
3. Nav + layout shell — home page listing all 15 leaders with optimized photos (sharp, 400×500px headshots, <80KB)
4. CSS 3D flip card grid — three-layer flip structure for Safari, `@media (hover: hover)` duality for desktop/iOS, PM-verified on real device
5. Flash card game — state machine, distractor algorithm, spaced-repetition missed-card requeue, accessible feedback (color + icon + text)
6. Biography directory + 15 pre-rendered static detail pages — quick-facts panel, outbound Church bio + Conference Talks links

### What Worked

- **GSD plan-phase → execute-phase pipeline** ran smoothly end-to-end; research → plan → verify → execute all produced useful artifacts
- **CONTEXT.md from discuss-phase** was the most valuable document — PM decisions captured upfront (outbound links instead of custom narratives, single Conference Talks link) saved significant rework
- **Checkpoint plans** (02-02, 04-03) worked well as explicit PM sign-off gates; the formal checkpoint format with a numbered checklist made it easy for the PM to know exactly what to verify
- **`entries()` pattern** for static prerendering of 15 dynamic `/bios/[slug]` routes worked cleanly; research caught this pitfall before planning
- **Three-layer flip structure** (scene > card > faces) caught early in research — saved a cross-browser Safari debugging session

### What Was Inefficient

- **03-02 checkpoint skipped** — Flash Cards were PM-reviewed through informal feedback commits instead of the formal checkpoint plan. Left a dangling plan with no SUMMARY. For v1.1, run all checkpoint plans formally.
- **Phase 3 ROADMAP never updated to "COMPLETE"** despite STATE.md showing completion — the roadmap and state drifted. The `roadmap analyze` command caught this during complete-milestone.
- **svelte.config.js `handleHttpError` whitelist** was an unplanned fix (Plan 04-01 auto-fix) because the prerenderer followed `/bios/[slug]` links before those routes existed. Could have been anticipated in research.

### Patterns Established

- `@media (hover: hover)` for CSS hover vs JS toggle duality on flip cards — use this pattern for any future interactive card component
- `handleHttpError` whitelist in `svelte.config.js` for forward-reference routes during phased builds
- `entries()` derived from `leaders.leaders.map()` — standard pattern for all future dynamic prerendered routes in this app
- Age calculation: parse ISO string components (year/month/day) directly rather than `new Date()` to avoid UTC/local off-by-one on birthdays
- `bio.summary` stripping trailing "who serves as..." clause — display pre-calling identity only when title is already shown

### Key Lessons

1. **Run discuss-phase before every phase** — PM decisions captured in CONTEXT.md were the highest-leverage input to the planners
2. **Don't skip checkpoint plans** — they exist to formally close the loop; informal PM feedback is not a substitute
3. **Research catches static-site adapter pitfalls** — `entries()`, `prerender`, `handleHttpError` are all easy to miss without a dedicated research pass
4. **Real iOS testing matters** — DevTools mobile emulation hides flip card and tap bugs; the iOS verification requirement in every checkpoint plan was correct

### Cost Observations

- Model mix: 100% sonnet (balanced profile)
- Sessions: ~4-5 sessions across 2 days
- Notable: Research agent caught 3 concrete pitfalls (entries(), base prefix, UTC date) that would each have caused build failures or incorrect output

---

## Cross-Milestone Trends

| Trend | v1.0 |
|-------|------|
| Checkpoint compliance | 2/3 (1 skipped) |
| Research confidence | HIGH |
| Verification status | passed (human_needed → approved) |
| PM feedback rounds | ~3 (Phase 3 layout fixes) |
| Auto-fixes during execution | 1 (svelte.config.js whitelist) |
