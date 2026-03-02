# Prophets & Apostles Learning App

## Vision

A web application that helps people of all ages (10 to adult) learn the names, faces, and stories of the First Presidency and Quorum of the Twelve Apostles of The Church of Jesus Christ of Latter-day Saints. The app is built for members, investigators, and curious learners alike — from children studying with their families to adults who want to deepen their familiarity with Church leadership.

## Core Value

**Learn the people who lead the Church** — connecting faces to names, names to stories, and stories to testimonies. Every feature must serve this one goal.

## Who It's For

- Primary audience: All ages (10 to adult)
- Church members who want to know their leaders better
- Investigators and newcomers learning about Church structure
- Families studying together (Primary-aged children through parents)
- Youth preparing for lessons, activities, or personal study

## What It Does

### Shipped — v1.0 MVP

**Flip Card Grid** — Home page grid of all 15 leaders. Hover on desktop or tap on mobile flips each card to reveal the leader's full name and title.

**Flash Cards** — Multiple-choice photo ID game. A leader photo appears with 4 name options; immediate accessible feedback on selection; missed cards reappear later in the session (spaced repetition).

**Biographies** — Browsable directory at `/bios` listing all 15 leaders with photos, grouped by quorum. Each leader links to a dedicated page showing a quick-facts panel (age, calling date, spouse, children, pre-calling career) and outbound links to their official Church biography and Conference Talks index.

### Planned — v1.1+

**Put In Order** — Drag-and-drop game where a randomized grid of leaders must be sorted by seniority. Tests deeper knowledge and reinforces Church leadership structure.

**Advanced Flash Cards** — Harder mode: photo shown, user types the name. A "hint" button fills in a few random letters to help get unstuck.

**Trivia Pursuit** — Multiple-choice trivia questions based on biographical facts. Tests and reinforces knowledge discovered in the Biographies section.

## Data Strategy

**All data is static and checked into the repository.** No database. No runtime scraping.

- **Images**: Official photos sourced from churchofjesuschrist.org, stored as static assets (400×500px headshots, sharp-optimized, <80KB each)
- **Leader data**: `leaders.json` — 15 verified records with name, title, seniority, calling date, birth date, family, career, slug, and sourceUrl
- **Biographies**: Outbound link to the Church's authoritative biography page (`sourceUrl`) — no custom-written narratives (PM decision, v1.0)
- **Conference talks**: Constructed URL to Church's speaker index (`/study/general-conference/speakers/{slug}?lang=eng`)

**CRITICAL ACCURACY REQUIREMENT**: All factual content must be sourced exclusively from:
1. Primary: https://www.churchofjesuschrist.org (authoritative)
2. Secondary: https://grokipedia.com (aggregation/quick reference)

## Hosting

**GitHub Pages** — fully static site at `/prophets`. No server-side logic. No database.

## Technical Constraints

- Must work without a backend or database
- Must be deployable to GitHub Pages (static files only, `paths.base = '/prophets'`)
- Must be mobile-friendly (tap = hover for flip cards; real iOS testing required)
- Must load reasonably fast even with 15 photos
- `adapter-static` requires `prerender = true` + `entries()` for dynamic routes like `/bios/[slug]`

## Out of Scope

- User accounts or progress tracking
- Backend of any kind
- Admin interface for updating leader data
- Localization / multi-language
- Live data fetching from Church website at runtime
- Native HTML5 drag-and-drop (broken on iOS; SortableJS required for any future DnD feature)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Static data only | No database needed; leadership changes infrequently | ✓ Good |
| GitHub Pages hosting | Free, simple, fits static-only constraint | ✓ Good |
| Audience: all ages 10+ | Broad reach; narrative bios, clean UI | ✓ Good |
| MVP = flip-card grid only | Ship small, validate core concept | ✓ Good |
| Primary source = churchofjesuschrist.org | Data accuracy is a primary requirement | ✓ Good |
| Three-layer flip structure (scene > card > faces) | Two-layer approach breaks backface-visibility in Safari | ✓ Good |
| `@media (hover: hover)` for desktop/touch duality | Prevents desktop cards locking open; CSS-only hover on desktop, JS toggle on touch | ✓ Good |
| Bio "narratives" = outbound link to sourceUrl | PM decided outbound link to authoritative Church page is better than AI-written text | ✓ Good |
| Single Conference Talks link per leader | PM simplified from "sorted list of all talks" to a single link to the speaker index | ✓ Good |
| `handleHttpError` whitelist for `/bios/[slug]` | Prerenderer follows links before target routes exist; whitelist allows forward references during phased build | ✓ Good |

## Requirements

### Validated

- ✓ INFRA-01: 15 verified leader records in `leaders.json` — v1.0
- ✓ INFRA-02: GitHub Actions deploy pipeline to GitHub Pages — v1.0
- ✓ INFRA-03: Nav, layout shell, leader photos optimized and deployed — v1.0
- ✓ GRID-01: Responsive flip card grid, all 15 leaders — v1.0
- ✓ GRID-02: CSS 3D flip on hover (desktop) and tap (mobile/iOS) — v1.0
- ✓ GRID-03: PM-verified on desktop and real iOS device — v1.0
- ✓ FLASH-01: Multiple-choice game, 4 options per card, no obviously wrong distractors — v1.0
- ✓ FLASH-02: Accessible feedback (color + icon + text; no "Wrong"/"Nope") — v1.0
- ✓ FLASH-03: Missed-card spaced repetition requeue — v1.0
- ✓ ACCESS-01: Color never the only feedback indicator — v1.0
- ✓ BIO-01: Biography directory listing all 15 leaders with photos and names — v1.0
- ✓ BIO-02: Each bio page links to authoritative Church biography (sourceUrl) — v1.0 (scope: outbound link, not custom narrative)
- ✓ BIO-03: Quick-facts panel (age, calling date, spouse, children, career) — v1.0
- ✓ BIO-04: Conference Talks link per leader (speaker index URL) — v1.0 (scope: single link, not sorted list)

### Active

- [ ] Drag-and-drop seniority ordering game (SortableJS — not native HTML5 DnD)
- [ ] Advanced flash cards with typed name entry and hint system
- [ ] Trivia game drawing from biographical facts

### Out of Scope

- User authentication — no accounts needed for this use case
- Backend/database — static only
- Live data syncing — manual updates when leadership changes
- Admin CMS — too complex for v1
- Native HTML5 DnD — broken on iOS; SortableJS required

## Current State (after v1.0)

- **Stack:** SvelteKit 2 + Svelte 5 + adapter-static + Tailwind v4 + Vite 6
- **Source:** 716 LOC (Svelte/JS/TS), 96 files total
- **Live at:** GitHub Pages (`/prophets`)
- **Data:** `src/lib/data/leaders.json` — single source of truth for all features
- **Routes:** `/` (flip grid), `/games/flashcards` (game), `/bios` (directory), `/bios/[slug]` (15 pre-rendered pages)

---
*Last updated: 2026-03-02 after v1.0 milestone*
