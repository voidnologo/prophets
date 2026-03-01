# Architecture Research

## Recommended Architecture

A SvelteKit static app with `@sveltejs/adapter-static`. SvelteKit pre-renders biography pages at build time (pure HTML), while game pages ship as reactive Svelte components. All leader data lives in `src/lib/data/leaders.json` as a single source of truth. Game modes are isolated Svelte page components that import from a shared data module. No server, no API, no database — just `npm run build` → flat files deployed to GitHub Pages.

## Data Schema

A single `src/lib/data/leaders.json` file drives every feature. Schema per leader:

```json
{
  "leaders": [
    {
      "id": "russell-m-nelson",
      "slug": "russell-m-nelson",
      "name": {
        "full": "Russell Marion Nelson",
        "display": "Russell M. Nelson",
        "last": "Nelson"
      },
      "title": "President of the Church",
      "quorum": "first-presidency",
      "seniority": 1,
      "callingDate": "2018-01-14",
      "birthDate": "1924-09-09",
      "birthPlace": "Salt Lake City, Utah, USA",
      "photo": {
        "filename": "russell-m-nelson.jpg",
        "alt": "President Russell M. Nelson"
      },
      "family": {
        "spouseName": "Wendy Watson Nelson",
        "children": 10
      },
      "preCallingCareer": "Cardiothoracic surgeon; professor at University of Utah",
      "education": ["University of Utah (BS, MD)", "University of Minnesota (PhD)"],
      "bio": {
        "summary": "Pioneer heart surgeon who became the 17th President of the Church.",
        "narrativeFile": "russell-m-nelson"
      },
      "conferenceTalks": [
        {
          "title": "The Correct Name of the Church",
          "date": "2018-10",
          "url": "https://www.churchofjesuschrist.org/study/general-conference/2018/10/the-correct-name-of-the-church"
        }
      ],
      "triviaFacts": [
        {
          "id": "rnelson-t1",
          "question": "Before his Church calling, what was President Nelson's profession?",
          "answer": "Cardiothoracic surgeon",
          "distractors": ["Attorney", "Educator", "Businessman"],
          "source": "https://www.churchofjesuschrist.org/learn/russell-m-nelson"
        }
      ]
    }
  ]
}
```

**Schema notes:**
- `quorum`: `"first-presidency"` or `"quorum-of-twelve"` — drives grouping + ordering game answer key
- `seniority`: integer 1–15 (1 = President) — **must be verified against churchofjesuschrist.org** — this is the answer key for the drag game
- `bio.narrativeFile`: slug only (no path/extension) — resolved to `src/lib/data/bios/<slug>.md` at build time
- `triviaFacts.distractors`: exactly 3 per fact — correct answer added at runtime, all 4 shuffled
- `conferenceTalks`: sorted newest-to-oldest at authoring time; no runtime sort needed

## Routing Strategy

SvelteKit file-based routing — each route is a `+page.svelte` file. No hash router needed. All pages pre-render to static HTML.

```
src/routes/
  +layout.svelte              ← Shared nav, global styles
  +page.svelte                ← Home / flip-card grid (MVP)
  games/
    flashcards/+page.svelte   ← Multiple-choice flash cards
    order/+page.svelte        ← Drag-to-order seniority game
    typed/+page.svelte        ← Typed name entry + hints
    trivia/+page.svelte       ← Trivia pursuit
  bios/
    +page.svelte              ← Browse all leaders
    [slug]/+page.svelte       ← Individual bio (pre-rendered ×15)
```

**GitHub Pages 404 handling:** With `adapter-static`, SvelteKit generates a `404.html` page. Configure GitHub Pages to use it. All routes are real files — no need for the fragile SPA redirect trick.

**Base path:** Set `paths.base = '/prophets'` in `svelte.config.js` for GitHub Pages deployment. Use SvelteKit's `$app/paths` `base` export in all internal links: `href="{base}/games/flashcards"`.

## Game Mode Architecture

All game modes share a single data module. Each game page is fully isolated.

**Shared data layer** (`src/lib/`):

```
src/lib/
  data/
    leaders.json          ← Single source of truth
    bios/
      russell-m-nelson.md ← Narrative bio (Markdown)
      ... (14 more)
  leaders.ts              ← Typed data loader + helpers
  utils.ts                ← shuffle(), pickRandom(), levenshtein()
```

```typescript
// src/lib/leaders.ts
import leadersData from './data/leaders.json';

export type Leader = typeof leadersData.leaders[0];

export const leaders: Leader[] = leadersData.leaders;

export const firstPresidency = leaders.filter(l => l.quorum === 'first-presidency');
export const quorumOfTwelve = leaders.filter(l => l.quorum === 'quorum-of-twelve');
export const allLeaders = [...firstPresidency, ...quorumOfTwelve];

export function sortBySeniority(list: Leader[]) {
  return [...list].sort((a, b) => a.seniority - b.seniority);
}
```

Each game `+page.svelte` imports from `$lib/leaders` and `$lib/utils`. Game state lives in Svelte 5 `$state()` runes local to each component — no global store needed.

## State Management

| State | Scope | Where |
|---|---|---|
| Current card / question index | Session | `$state()` in page component |
| Score | Session | `$state()` in page component |
| Drag card order | Session | `$state()` in `order/+page.svelte` |
| Hint revealed positions | Session | `$state(Set<number>)` in `typed/+page.svelte` |
| High scores (optional) | Cross-session | `localStorage` |
| "Instructions seen" flag | Cross-session | `localStorage` |

No global store. No Pinia/Zustand. Svelte 5 `$state` runes in each page component are enough.

```svelte
<!-- Example: flashcards/+page.svelte -->
<script>
  import { shuffle } from '$lib/utils';
  import { allLeaders } from '$lib/leaders';

  let deck = $state(shuffle([...allLeaders]));
  let currentIndex = $state(0);
  let score = $state(0);
  let selected = $state(null);

  const current = $derived(deck[currentIndex]);
</script>
```

## Image Strategy

- **Format:** JPEG for all leader photos (photo-type content compresses poorly as PNG)
- **Sizes:** `400×500px` for grid/game use (displayed at ≤200×250px CSS, 2× for HiDPI); `600×800px` hero for bio pages
- **Target size:** Under 80KB per headshot; 15 headshots ≈ 1.2MB total
- **Directory:** `static/images/leaders/<slug>.jpg` and `static/images/leaders/<slug>-hero.jpg`
- **Loading:** `loading="lazy"` on all below-fold images; `loading="eager"` on first 6 cards
- **Layout shift prevention:** CSS `aspect-ratio: 4/5` on photo wrappers with a warm neutral background color
- **Preloading in flash card mode:** After answer submitted, prefetch next image:
  ```js
  function prefetchNext(leader) {
    const img = new Image();
    img.src = `${base}/images/leaders/${leader.photo.filename}`;
  }
  ```

## Folder Structure

```
prophets/
├── src/
│   ├── app.html                       ← HTML shell (sets lang, meta)
│   ├── app.css                        ← Global reset, CSS variables
│   ├── lib/
│   │   ├── leaders.ts                 ← Data loader + typed helpers
│   │   ├── utils.ts                   ← shuffle, pickRandom, levenshtein
│   │   ├── data/
│   │   │   ├── leaders.json           ← Single source of truth
│   │   │   └── bios/
│   │   │       ├── russell-m-nelson.md
│   │   │       └── ... (14 more)
│   │   └── components/
│   │       ├── LeaderCard.svelte      ← Flip card component
│   │       ├── Nav.svelte             ← Navigation bar
│   │       └── GameProgress.svelte    ← "Card 7 of 15" indicator
│   └── routes/
│       ├── +layout.svelte             ← Nav + global layout
│       ├── +page.svelte               ← Home: flip-card grid
│       ├── games/
│       │   ├── flashcards/+page.svelte
│       │   ├── order/+page.svelte
│       │   ├── typed/+page.svelte
│       │   └── trivia/+page.svelte
│       └── bios/
│           ├── +page.svelte           ← Browse all leaders
│           └── [slug]/
│               └── +page.svelte       ← Individual bio (×15 pre-rendered)
├── static/
│   └── images/
│       └── leaders/
│           ├── russell-m-nelson.jpg   ← 400×500px headshot
│           ├── russell-m-nelson-hero.jpg ← 600×800px bio hero
│           └── ... (28 more files, 14 leaders)
├── .github/
│   └── workflows/
│       └── deploy.yml
├── .planning/
│   └── ...                            ← Planning docs (not deployed)
├── svelte.config.js
├── vite.config.ts
└── package.json
```

## Build Order Implications

```
Step 0:  Verify leaders.json data from churchofjesuschrist.org (seniority order, names, dates)
         ↓ (everything depends on correct data)
Step 1:  leaders.json schema + all 15 leader records (stubs OK, photos can come later)
         ↓
Step 2:  SvelteKit project setup, svelte.config.js with paths.base, GitHub Actions deploy
         ↓
Step 3:  LeaderCard.svelte flip animation + CSS; +layout.svelte with Nav
         ↓
Step 4:  +page.svelte (home flip-card grid) ← MVP SHIP POINT
         ↓
Step 5:  games/flashcards/+page.svelte (establishes game page pattern)
         ↓
Step 6:  games/order/+page.svelte + SortableJS integration
         ↓
Step 7:  games/typed/+page.svelte + hint system (needs utils.ts levenshtein)
         ↓
Step 8:  bios/[slug]/+page.svelte + all 15 narrative bio .md files
         ↓ (trivia facts sourced from bios)
Step 9:  Populate triviaFacts in leaders.json from bio content
         ↓
Step 10: games/trivia/+page.svelte
```

**Key dependency:** Trivia content must come from bio content — build bios (Step 8) before trivia (Step 10). Seniority integers must be correct before the ordering game can be tested. Lock the `leaders.json` schema at Step 1 — schema changes cascade everywhere.

---
*Research completed: 2026-03-01*
