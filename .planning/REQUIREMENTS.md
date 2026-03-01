# Requirements

## v1 Requirements

### Infrastructure & Data (INFRA)

- [ ] **INFRA-01**: A `leaders.json` file exists with all 15 leaders (3 First Presidency + 12 Quorum of the Twelve), where every name, title, seniority integer, calling date, and supporting fact is verified against churchofjesuschrist.org before being committed
- [ ] **INFRA-02**: The project is scaffolded as a SvelteKit app with `@sveltejs/adapter-static`, `paths.base` correctly configured for GitHub Pages, and a GitHub Actions workflow that deploys the `/build` output to GitHub Pages on every push to `main`
- [ ] **INFRA-03**: A visible "Leader data last verified: [date]" note appears in the app footer so users can judge data freshness

### Grid — Flip Cards (GRID)

- [ ] **GRID-01**: User can see a responsive grid of all 15 leaders (First Presidency and Quorum of the Twelve displayed on the home page)
- [ ] **GRID-02**: User can hover over a card (desktop) and it flips with a CSS 3D rotation revealing the leader's name and title
- [ ] **GRID-03**: User can tap a card (mobile/touch) and it flips to reveal the leader's name and title; tapping again unflips it

### Flash Cards — Multiple Choice (FLASH)

- [ ] **FLASH-01**: User is shown a photo of one leader and must select the correct name from 4 options, where all 4 options are plausible leaders (not obviously wrong distractors)
- [ ] **FLASH-02**: User sees immediate feedback when they answer — the correct name is revealed, with color + icon + text (never color alone)
- [ ] **FLASH-03**: When a user answers incorrectly, the card is reshuffled back into the remaining deck so they encounter it again before the session ends

### Biographies (BIO)

- [ ] **BIO-01**: User can browse a directory page listing all 15 leaders with photos and names, each linking to an individual biography page
- [ ] **BIO-02**: Each of the 15 leaders has a dedicated biography page with a narrative (300–600 words, written at a 6th–8th grade reading level, PM-reviewed, all facts sourced from churchofjesuschrist.org)
- [ ] **BIO-03**: Each biography page includes a quick-facts panel showing: age (calculated from birth date), calling date, spouse name, number of children, and pre-calling career summary
- [ ] **BIO-04**: Each biography page includes a section listing all of the leader's General Conference addresses, sorted newest to oldest, with direct links to churchofjesuschrist.org

### Accessibility (ACCESS)

- [ ] **ACCESS-01**: All feedback (correct/incorrect, score) uses color + icon + text — never color alone — so colorblind users receive equivalent information

---

## v2 Requirements (Deferred)

These are scoped for a later milestone.

- **Seniority Ordering Game** — Drag-and-drop game where user sorts all 15 leaders by seniority; requires SortableJS for iOS touch support
- **Typed Name Entry Game** — User types the leader's name from memory; includes fuzzy matching and a letter-reveal hint system
- **Trivia Pursuit Mode** — Multiple-choice trivia questions drawn from the biography content (requires biographies to be complete first)
- **Keyboard navigation** for all interactive elements (Tab + Enter/Space for card flip)
- **Screen reader support** (ARIA live regions, descriptive labels)
- **Reduced motion fallback** for flip animations
- **End-of-round review screen** for flash cards (see all correct answers after finishing the deck)
- **High score persistence** via localStorage

---

## Out of Scope

- **User accounts or authentication** — no login, no profiles, no progress tracking across devices
- **Backend of any kind** — static files only; no server, no database, no API
- **Live data fetching** from churchofjesuschrist.org at runtime — data is curated and checked into the repo
- **Admin interface** for updating leader data — updates are manual edits to `leaders.json`
- **Localization** — English only
- **Countdown timers** — inappropriate for this context and audience
- **Leaderboards or social features** — privacy concern, especially for minors
- **Ads or monetization** — misaligned with the educational, faith-based context

---

## Traceability

*(To be filled in by roadmapper)*

| Requirement | Phase |
|---|---|
| INFRA-01 | Phase 1: Foundation |
| INFRA-02 | Phase 1: Foundation |
| INFRA-03 | Phase 1: Foundation |
| GRID-01 | Phase 2: Flip Card Grid |
| GRID-02 | Phase 2: Flip Card Grid |
| GRID-03 | Phase 2: Flip Card Grid |
| FLASH-01 | Phase 3: Flash Cards |
| FLASH-02 | Phase 3: Flash Cards |
| FLASH-03 | Phase 3: Flash Cards |
| BIO-01 | Phase 4: Biographies |
| BIO-02 | Phase 4: Biographies |
| BIO-03 | Phase 4: Biographies |
| BIO-04 | Phase 4: Biographies |
| ACCESS-01 | Phase 3: Flash Cards |
