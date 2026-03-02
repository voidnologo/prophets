# Phase 2: Flip Card Grid (MVP) - Context

**Gathered:** 2026-03-01
**Status:** Ready for planning

<domain>
## Phase Boundary

Replace the current placeholder list view with a responsive grid of all 15 leaders where each card shows a portrait photo on the front and flips to reveal the leader's name and title on the back. No new routes — this replaces the home page (`+page.svelte`). Flash cards, biographies, and search are out of scope.

</domain>

<decisions>
## Implementation Decisions

### Grid organization
- Two sections: **First Presidency** (3 cards) then **Quorum of the Twelve Apostles** (12 cards)
- Each section has a visible heading
- Leaders sorted by `seniority` within each section (matches existing pattern)

### Card front face
- Portrait photo only — no text overlaid on the front
- Full-bleed portrait image fills the card face

### Card back face
- Shows: small photo thumbnail + leader's full display name + title
- No quorum label (title already implies quorum — e.g. "President of the Church")
- Thumbnail uses the same portrait photo (`*.jpg`), not the hero image

### Column count
- Mobile (< 640px): **2 columns**
- Tablet (640–1024px): **3 columns**
- Desktop (> 1024px): **4 columns**
- Cards are portrait orientation (taller than wide) — maximize face size for memorization

### Flip trigger & return
- **Desktop:** hover flips card → unhover returns to front
- **Mobile/touch:** tap flips card → tap again returns to front
- Cards flip independently (flipping one does not affect others)

### Claude's Discretion
- Exact card aspect ratio (portrait — Claude picks what best fits leader photos)
- CSS 3D flip animation timing/easing
- Gap between cards in the grid
- Typography sizing on the card back
- Shadow/border treatment on cards

</decisions>

<specifics>
## Specific Ideas

- "Use as much of the screen as possible" — cards should be large and generous, not cramped thumbnails
- The grid replaces the existing `+page.svelte` list — no list view fallback needed

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/lib/data/leaders.json` — all 15 leaders with `quorum`, `seniority`, `name.display`, `title`, `photo.filename`, `photo.alt`; filter + sort pattern already used in existing page
- `static/images/leaders/*.jpg` — portrait photos exist for all 15 leaders
- `static/images/leaders/*-hero.jpg` — hero images also exist (not used for this phase)
- `src/lib/components/Nav.svelte` — reused as-is

### Established Patterns
- `import { base } from '$app/paths'` — required for all asset/link paths (GitHub Pages); already used in every component
- Data access: `import leaders from '$lib/data/leaders.json'`
- Filter + sort: `.filter(l => l.quorum === 'first-presidency').sort((a, b) => a.seniority - b.seniority)`
- Tailwind v4 for layout and typography
- Component-scoped `<style>` blocks for CSS that Tailwind doesn't handle (3D transforms must be scoped — `perspective`, `transform-style: preserve-3d`, `backface-visibility: hidden`)

### Integration Points
- `src/routes/+page.svelte` — replace list markup with flip card grid
- New `src/lib/components/LeaderCard.svelte` — encapsulates the 3D flip card (photo, back face, animation)
- `src/routes/+layout.svelte` — unchanged; Nav and footer wrap the page automatically

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 02-flip-card-grid-mvp*
*Context gathered: 2026-03-01*
