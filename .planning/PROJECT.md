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

### MVP — Face/Name Grid
A grid of cards showing photos of the First Presidency (3 members) and Quorum of the Twelve Apostles (12 members). On mouse hover (or tap on mobile), each card flips like a playing card to reveal the person's full name and title. Simple. Elegant. The foundation.

### Phase 2 — Flash Cards (Multiple Choice)
A game mode: a photo appears and the user must select the correct name from 4 options. Flash-card style, randomized. Immediate feedback on right/wrong.

### Phase 3 — Put In Order
A drag-and-drop game where a randomized grid of leaders must be sorted by seniority. Tests deeper knowledge and reinforces the structure of Church leadership.

### Phase 4 — Advanced Flash Cards (Name Entry)
A harder flash-card mode: photo shown, user types the name. A "hint" button fills in a few random letters to help get unstuck.

### Phase 5 — Learn About (Biographies)
A browsable directory. Clicking any leader opens a dedicated page with:
- A biography written in narrative style (accessible to ages 10 and up)
- Key facts: age, family, pre-calling career, calling date
- Links to all their General Conference addresses (newest to oldest)

### Phase 6 — Trivia Pursuit
Multiple-choice trivia questions based on biographical facts. Tests and reinforces knowledge discovered in the Learn About section.

## Data Strategy

**All data is static and checked into the repository.** No database. No runtime scraping.

- **Images**: Official photos sourced from churchofjesuschrist.org, stored as static assets
- **Leader data**: JSON file with name, title, seniority order, calling date, and bio facts
- **Biographies**: Written by Claude in narrative style, rigorously sourced from churchofjesuschrist.org and grokipedia.com — no hallucinated content
- **Conference talks**: Linked (not scraped) from churchofjesuschrist.org

**CRITICAL ACCURACY REQUIREMENT**: All factual content must be sourced exclusively from:
1. Primary: https://www.churchofjesuschrist.org (authoritative)
2. Secondary: https://grokipedia.com (aggregation/quick reference)
No information should be generated or assumed. If uncertain, verify against the primary source.

## Hosting

**GitHub Pages** — a fully static site. No server-side logic. No database.

## Technical Constraints

- Must work without a backend or database
- Must be deployable to GitHub Pages (static files only)
- Must be mobile-friendly (tap = hover for flip cards)
- Must load reasonably fast even with 15 photos
- Biographies are static HTML/markdown, not dynamically fetched

## Out of Scope (v1)

- User accounts or progress tracking
- Backend of any kind
- Admin interface for updating leader data
- Localization / multi-language
- Live data fetching from LDS website at runtime

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Static data only | No database needed; leadership changes infrequently | ✓ Locked |
| GitHub Pages hosting | Free, simple, fits static-only constraint | ✓ Locked |
| Audience: all ages 10+ | Broad reach; narrative bios, clean UI | ✓ Locked |
| MVP = flip-card grid only | Ship small, validate core concept | ✓ Locked |
| Primary source = churchofjesuschrist.org | Data accuracy is a primary requirement | ✓ Locked |

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Grid of 15 leaders (3 First Presidency + 12 Apostles) with flip-card hover effect
- [ ] Flash card multiple-choice game
- [ ] Drag-and-drop seniority ordering game
- [ ] Advanced flash cards with typed name entry and hint system
- [ ] Biography pages in narrative style with links to Conference talks
- [ ] Trivia game drawing from biographical facts

### Out of Scope

- User authentication — no accounts needed for this use case
- Backend/database — static only
- Live data syncing — manual updates when leadership changes
- Admin CMS — too complex for v1

---
*Last updated: 2026-03-01 after initialization*
