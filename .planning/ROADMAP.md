# Roadmap — Prophets & Apostles Learning App

## Milestone 1 — v1

### Phase 1: Foundation
**Goal:** Establish verified data, a deployable SvelteKit scaffold, and a live GitHub Pages URL with a placeholder home page so every downstream phase builds on a proven pipeline.
**Requirements:** INFRA-01, INFRA-02, INFRA-03
**Plans:** 3/3 plans complete

Plans:
- [x] 01-01-PLAN.md — Data layer: leaders.json (15 verified records), DATA-VERIFICATION.md for PM, GitHub issue template
- [x] 01-02-PLAN.md — Project scaffold: SvelteKit + adapter-static + Tailwind v4 + GitHub Actions deploy pipeline
- [x] 01-03-PLAN.md — Placeholder UI: Nav, layout with verified-date footer, home page leader list, photo optimization

**Success Criteria:**
1. A PM can open `leaders.json` and confirm all 15 leaders (3 First Presidency + 12 Apostles) are present with name, title, seniority order, and calling date, each traceable to a churchofjesuschrist.org source.
2. Pushing a commit to `main` automatically triggers a GitHub Actions run that deploys to GitHub Pages — a PM can observe the green Actions check and load the live URL.
3. A visible "Leader data last verified: [date]" note appears in the footer of the deployed site.

---

### Phase 2: Flip Card Grid (MVP) — COMPLETE
**Goal:** Ship the core learning experience — a responsive grid of all 15 leaders where each card flips on hover or tap to reveal the leader's name and title.
**Requirements:** GRID-01, GRID-02, GRID-03
**Plans:** 2/2 plans complete

Plans:
- [x] 02-01-PLAN.md — LeaderCard component (CSS 3D flip) + home page grid rewrite
- [x] 02-02-PLAN.md — Visual and touch verification checkpoint (PM sign-off)

**Success Criteria:**
1. A user visiting the home page on a desktop browser sees all 15 leader photos arranged in a responsive grid with no broken images or layout overflow.
2. Hovering over any card on a desktop browser causes a smooth 3D flip animation revealing the leader's full name and title.
3. Tapping a card on a real iOS or Android device flips it to reveal the name and title; tapping it again unflips it — with no mis-triggers or layout shifts.

---

### Phase 3: Flash Cards — IN PROGRESS
**Goal:** Add an interactive multiple-choice game mode where users are shown a photo and must identify the leader, with immediate accessible feedback and a spaced-repetition retry for missed cards.
**Requirements:** FLASH-01, FLASH-02, FLASH-03, ACCESS-01
**Plans:** 1/2 plans complete

Plans:
- [x] 03-01-PLAN.md — Flash card game page (state machine, distractor algorithm, elimination feedback, missed-card requeue) + Nav activation
- [ ] 03-02-PLAN.md — Deployment and PM verification checkpoint (desktop + real iOS device)

**Success Criteria:**
1. A user can start a Flash Cards session and be shown a leader photo with exactly 4 name options, all of which are real leaders from the dataset (no obviously wrong distractors).
2. After selecting an answer, the correct name is revealed with a distinct color, icon, and text label — a colorblind user receives the same information as a sighted user with normal color vision.
3. A card answered incorrectly reappears later in the same session before the round ends — a tester can verify this by deliberately answering one card wrong and observing it recur.
4. A PM reviewing the UI confirms that no feedback text uses the words "Wrong" or "Nope" — language is neutral and encouraging throughout.

---

### Phase 4: Biographies
**Goal:** Deliver a browsable biography directory with a dedicated page per leader, showing a quick-facts panel and outbound links to the Church's authoritative biography and Conference talks pages.
**Requirements:** BIO-01, BIO-02, BIO-03, BIO-04
**Plans:** 3 plans

Plans:
- [ ] 04-01-PLAN.md — Biography directory page (/bios) + nav activation
- [ ] 04-02-PLAN.md — Individual bio detail pages (/bios/[slug]) with quick-facts and outbound links
- [ ] 04-03-PLAN.md — Build verification + PM sign-off (desktop + real iOS)

**Success Criteria:**
1. A user can navigate to the Biographies directory and see all 15 leaders listed with photos and names, each linking to a dedicated biography page.
2. Each biography page links to the official Church biography page (sourceUrl) which serves as the authoritative narrative destination — no custom-written narrative is needed.
3. Each biography page displays a quick-facts panel showing the leader's age (calculated from birth date), calling date, spouse name, number of children, and pre-calling career summary.
4. Each biography page includes a Conference Talks link to churchofjesuschrist.org, constructed from the leader's slug, opening in a new tab.
