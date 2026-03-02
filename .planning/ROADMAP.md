# Roadmap — Prophets & Apostles Learning App

## Milestone 1 — v1

### Phase 1: Foundation
**Goal:** Establish verified data, a deployable SvelteKit scaffold, and a live GitHub Pages URL with a placeholder home page so every downstream phase builds on a proven pipeline.
**Requirements:** INFRA-01, INFRA-02, INFRA-03
**Plans:** 3 plans

Plans:
- [x] 01-01-PLAN.md — Data layer: leaders.json (15 verified records), DATA-VERIFICATION.md for PM, GitHub issue template
- [x] 01-02-PLAN.md — Project scaffold: SvelteKit + adapter-static + Tailwind v4 + GitHub Actions deploy pipeline
- [ ] 01-03-PLAN.md — Placeholder UI: Nav, layout with verified-date footer, home page leader list, photo optimization

**Success Criteria:**
1. A PM can open `leaders.json` and confirm all 15 leaders (3 First Presidency + 12 Apostles) are present with name, title, seniority order, and calling date, each traceable to a churchofjesuschrist.org source.
2. Pushing a commit to `main` automatically triggers a GitHub Actions run that deploys to GitHub Pages — a PM can observe the green Actions check and load the live URL.
3. A visible "Leader data last verified: [date]" note appears in the footer of the deployed site.

---

### Phase 2: Flip Card Grid (MVP)
**Goal:** Ship the core learning experience — a responsive grid of all 15 leaders where each card flips on hover or tap to reveal the leader's name and title.
**Requirements:** GRID-01, GRID-02, GRID-03
**Success Criteria:**
1. A user visiting the home page on a desktop browser sees all 15 leader photos arranged in a responsive grid with no broken images or layout overflow.
2. Hovering over any card on a desktop browser causes a smooth 3D flip animation revealing the leader's full name and title.
3. Tapping a card on a real iOS or Android device flips it to reveal the name and title; tapping it again unflips it — with no mis-triggers or layout shifts.

---

### Phase 3: Flash Cards
**Goal:** Add an interactive multiple-choice game mode where users are shown a photo and must identify the leader, with immediate accessible feedback and a spaced-repetition retry for missed cards.
**Requirements:** FLASH-01, FLASH-02, FLASH-03, ACCESS-01
**Success Criteria:**
1. A user can start a Flash Cards session and be shown a leader photo with exactly 4 name options, all of which are real leaders from the dataset (no obviously wrong distractors).
2. After selecting an answer, the correct name is revealed with a distinct color, icon, and text label — a colorblind user receives the same information as a sighted user with normal color vision.
3. A card answered incorrectly reappears later in the same session before the round ends — a tester can verify this by deliberately answering one card wrong and observing it recur.
4. A PM reviewing the UI confirms that no feedback text uses the words "Wrong" or "Nope" — language is neutral and encouraging throughout.

---

### Phase 4: Biographies
**Goal:** Deliver a browsable biography directory with a dedicated page for each leader, including a PM-reviewed narrative, a quick-facts panel, and a sorted list of General Conference addresses.
**Requirements:** BIO-01, BIO-02, BIO-03, BIO-04
**Success Criteria:**
1. A user can navigate to the Biographies directory and see all 15 leaders listed with photos and names, each linking to a dedicated biography page.
2. Each biography page contains a narrative of 300–600 words; a PM can read any bio and confirm it is written at an accessible reading level with no jargon and no unverified factual claims.
3. Each biography page displays a quick-facts panel showing the leader's age (calculated from birth date), calling date, spouse name, number of children, and pre-calling career summary.
4. Each biography page lists all of the leader's General Conference addresses sorted newest to oldest, with working links to churchofjesuschrist.org.
