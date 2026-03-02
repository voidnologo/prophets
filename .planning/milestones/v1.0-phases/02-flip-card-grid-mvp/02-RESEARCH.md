# Phase 2: Flip Card Grid (MVP) - Research

**Researched:** 2026-03-01
**Domain:** CSS 3D flip cards, Svelte 5 component reactivity, Tailwind v4 3D utilities, responsive grid layout
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Grid organization**
- Two sections: First Presidency (3 cards) then Quorum of the Twelve Apostles (12 cards)
- Each section has a visible heading
- Leaders sorted by `seniority` within each section (matches existing pattern)

**Card front face**
- Portrait photo only — no text overlaid on the front
- Full-bleed portrait image fills the card face

**Card back face**
- Shows: small photo thumbnail + leader's full display name + title
- No quorum label (title already implies quorum)
- Thumbnail uses the same portrait photo (`*.jpg`), not the hero image

**Column count**
- Mobile (< 640px): 2 columns
- Tablet (640–1024px): 3 columns
- Desktop (> 1024px): 4 columns
- Cards are portrait orientation (taller than wide)

**Flip trigger and return**
- Desktop: hover flips card → unhover returns to front
- Mobile/touch: tap flips card → tap again returns to front
- Cards flip independently (flipping one does not affect others)

### Claude's Discretion
- Exact card aspect ratio (portrait — pick what best fits leader photos)
- CSS 3D flip animation timing/easing
- Gap between cards in the grid
- Typography sizing on the card back
- Shadow/border treatment on cards

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| GRID-01 | User can see a responsive grid of all 15 leaders (First Presidency and Quorum of the Twelve displayed on the home page) | Tailwind v4 grid classes `grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4`, existing data filter/sort pattern, `LeaderCard` component pattern |
| GRID-02 | User can hover over a card (desktop) and it flips with a CSS 3D rotation revealing the leader's name and title | CSS 3D flip via `perspective-midrange`, `transform-3d`, `backface-hidden`, `rotate-y-180`; `@media (hover: hover)` CSS-only hover trigger |
| GRID-03 | User can tap a card (mobile/touch) and it flips to reveal the leader's name and title; tapping again unflips it | Svelte 5 `$state(false)` toggle on `onclick`; `@media (hover: none)` suppresses hover; class binding `class:flipped={flipped}` drives rotation |
</phase_requirements>

---

## Summary

Phase 2 replaces the existing placeholder list view with a responsive flip-card grid. The implementation has two distinct concerns: grid layout (solved entirely with Tailwind v4 utility classes) and the CSS 3D flip animation with hover/tap duality (solved with Tailwind v4's 3D utilities for static structure plus a scoped `<style>` block for the transition and class-driven flip).

Tailwind v4 ships native utilities for every 3D transform property needed: `perspective-midrange` (800px), `transform-3d` (`transform-style: preserve-3d`), `backface-hidden` (`backface-visibility: hidden`), and `rotate-y-180`. The hover vs. tap duality is best handled by splitting concerns: hover is a pure CSS `@media (hover: hover)` rule in the scoped style block, and tap is a Svelte 5 `$state` boolean toggled on `onclick`. No JavaScript detects the device type — the media query handles it correctly for both cases.

The existing codebase is in excellent shape. `leaders.json`, the filter/sort pattern, all 15 portrait images (`static/images/leaders/*.jpg`), the `base` path pattern, and the layout shell (`+layout.svelte`) are all already in place. Phase 2 only touches `src/routes/+page.svelte` (replace list with grid) and creates one new component `src/lib/components/LeaderCard.svelte`.

**Primary recommendation:** Use Tailwind v4's built-in 3D utilities (`perspective-midrange`, `transform-3d`, `backface-hidden`, `rotate-y-180`) for structural CSS in markup, and a scoped `<style>` block in `LeaderCard.svelte` only for the `transition` declaration and the `@media (hover: hover)` flip rule. This keeps the animation concerns clearly separated from layout concerns.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Svelte 5 | ^5.51.0 | Component model, `$state` reactivity | Already installed; `$state` + `onclick` is canonical Svelte 5 pattern |
| SvelteKit 2 | ^2.50.2 | Routing, prerender, `$app/paths` | Already installed; `base` export required for all asset paths |
| Tailwind CSS v4 | ^4.2.1 | Grid layout, spacing, typography, 3D utilities | Already installed; v4 ships `perspective-*`, `transform-3d`, `backface-hidden`, `rotate-y-*` natively |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@sveltejs/adapter-static` | ^3.0.10 | Static prerender to `/build` | Already installed; no change needed |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| CSS `@media (hover: hover)` for hover detection | JavaScript `'ontouchstart' in window` | Media query is CSS-only, no JS; JS approach is unreliable (some touch laptops) |
| Tailwind v4 `perspective-midrange` (800px) | Scoped CSS `perspective: 800px` | Tailwind v4 native utility is cleaner; scoped style only needed for `transition` |
| `rotate-y-180` Tailwind class | Scoped CSS `transform: rotateY(180deg)` | Tailwind v4 utility works; but scoped style still needed for `.flipped { transform: rotateY(180deg); }` triggered by state |

**Installation:** No new packages — all dependencies already installed in Phase 1.

---

## Architecture Patterns

### Recommended Project Structure

```
src/
├── routes/
│   └── +page.svelte          # Replaced: list → two-section flip card grid
└── lib/
    └── components/
        ├── Nav.svelte         # Unchanged
        └── LeaderCard.svelte  # New: encapsulates the 3D flip card
```

No new routes. No new dependencies. No changes to `+layout.svelte`, `svelte.config.js`, `leaders.json`, or static images.

---

### Pattern 1: Three-Layer CSS 3D Flip Card Structure

**What:** The canonical CSS 3D flip requires exactly three nested elements: (1) a scene/wrapper that sets `perspective`, (2) an inner card element that performs the `rotateY` transform with `transform-style: preserve-3d`, and (3) two absolutely-positioned face elements each with `backface-visibility: hidden`.

**When to use:** Always — any variation (two-layer, using pseudo-elements) breaks in Safari or produces visible back-face bleed.

**Structure:**
```html
<!-- Scene: sets perspective, defines card dimensions -->
<div class="perspective-midrange">
  <!-- Inner card: rotates, preserves 3D space -->
  <div class="card transform-3d relative w-full h-full transition-transform duration-500"
       class:flipped={flipped}>
    <!-- Front face -->
    <div class="face front absolute inset-0 backface-hidden">
      <img ... />
    </div>
    <!-- Back face: pre-rotated 180° so it starts facing away -->
    <div class="face back absolute inset-0 backface-hidden rotate-y-180">
      <img ... /><p>Name</p><p>Title</p>
    </div>
  </div>
</div>
```

**CSS in scoped `<style>` block (the parts Tailwind can't do):**
```css
/* Source: 3dtransforms.desandro.com/card-flip */
.card {
  transition: transform 0.5s ease;
}
.card.flipped {
  transform: rotateY(180deg);
}

/* Hover flip: desktop only */
@media (hover: hover) {
  .scene:hover .card {
    transform: rotateY(180deg);
  }
}
```

**Note on Tailwind vs scoped style:** `perspective-midrange`, `transform-3d`, `backface-hidden`, `rotate-y-180` all work as Tailwind v4 classes. However, the `transition` + `.flipped` selector-based transform and `@media (hover: hover)` pseudo-class rule MUST live in the scoped `<style>` block — Tailwind cannot target a class+state combination dynamically.

---

### Pattern 2: Svelte 5 `$state` Toggle for Tap

**What:** Each `LeaderCard` component holds its own `flipped` state. On tap, `onclick` toggles it. The class binding drives the CSS rotation.

**When to use:** Mobile tap interaction — hover is handled by CSS alone.

```svelte
<!-- Source: svelte.dev/docs/svelte/$state -->
<script>
  let { leader } = $props();
  let flipped = $state(false);

  function toggleFlip() {
    flipped = !flipped;
  }
</script>

<div class="scene perspective-midrange ..."
     onclick={toggleFlip}
     role="button"
     tabindex="0"
     aria-label="Flip card for {leader.name.display}"
     aria-pressed={flipped}>
  <div class="card transform-3d ..." class:flipped>
    <!-- faces -->
  </div>
</div>
```

**Key Svelte 5 syntax notes (confirmed via official docs):**
- `let { leader } = $props()` — replaces `export let leader`
- `let flipped = $state(false)` — replaces `let flipped = false`
- `onclick={toggleFlip}` — replaces `on:click={toggleFlip}`
- `class:flipped` is shorthand for `class:flipped={flipped}` — unchanged from Svelte 4

---

### Pattern 3: Hover vs. Tap Duality via CSS Media Query

**What:** `@media (hover: hover)` targets devices that support true hover (mice, trackpads). `@media (hover: none)` targets touch-only devices. This is the correct CSS-native approach — no JavaScript device detection.

**When to use:** Any component that needs different behavior on hover vs. tap.

```css
/* In LeaderCard.svelte <style> block */

/* Desktop hover: CSS-only, no JS state needed */
@media (hover: hover) {
  .scene:hover .card {
    transform: rotateY(180deg);
  }
  /* On desktop, suppress JavaScript toggle (hover already handles it) */
  .scene {
    cursor: default;
  }
}

/* Touch: no hover, so .card.flipped class drives the flip */
@media (hover: none) {
  .scene {
    cursor: pointer;
  }
}
```

**Caveat (MEDIUM confidence):** Some Samsung Android devices misreport their pointer type as `fine` (mouse-like). This means a small fraction of Android touch users may get hover behavior instead of tap behavior. This is an acceptable edge case — both behaviors flip the card. Verified in multiple sources.

---

### Pattern 4: Responsive Grid with Tailwind v4

**What:** Tailwind's `grid` + responsive `grid-cols-*` utilities. Mobile-first: 2 columns base, 3 at `sm` (640px), 4 at `lg` (1024px). The CONTEXT.md breakpoints map precisely to Tailwind's `sm` and `lg` defaults.

```svelte
<!-- In +page.svelte -->
<section>
  <h2 class="text-xl font-semibold text-gray-700 mb-4">First Presidency</h2>
  <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
    {#each firstPresidency as leader (leader.id)}
      <LeaderCard {leader} />
    {/each}
  </div>
</section>
```

**Breakpoint alignment (confirmed via tailwindcss.com):**
- `sm` = 640px — matches CONTEXT.md "< 640px = 2 columns, 640–1024px = 3 columns"
- `lg` = 1024px — matches CONTEXT.md "> 1024px = 4 columns"
- No `md` breakpoint needed — `sm` to `lg` covers tablet range

---

### Pattern 5: Card Aspect Ratio

**What:** Portrait-oriented cards for maximizing face size. The recommended aspect ratio for head-and-shoulders leader portraits is `3/4` (75% width to height). The existing image pipeline from Phase 1 crops at 4:5 ratio with `cover+top` crop — using `aspect-[4/5]` aligns with the processed images.

**Recommendation:** Use `aspect-[4/5]` Tailwind arbitrary class on the scene wrapper (confirmed: arbitrary values work in Tailwind v4).

```html
<div class="perspective-midrange aspect-[4/5] w-full rounded-lg overflow-hidden shadow-md">
```

This matches the existing image dimensions and prevents any letterboxing.

---

### Anti-Patterns to Avoid

- **Two-layer flip (no inner wrapper):** Applying `rotateY` directly to the card element without an inner wrapper breaks `backface-visibility` — both faces remain visible simultaneously. Always use the three-layer structure.
- **Applying `perspective` to the flipping element itself:** Perspective must be on the *parent* of the rotating element. Setting `perspective` on the same element as `transform` is ignored by browsers.
- **Using `transform-style: preserve-3d` on face elements:** Only the inner card (the rotating element) needs `preserve-3d`, not its children (the faces). The faces need `backface-visibility: hidden`.
- **Omitting `-webkit-` prefix for `backface-visibility`:** Older iOS Safari (pre-15) requires `-webkit-backface-visibility: hidden`. Since we must support iOS, include it. However, since this project's scoped CSS will be processed by Vite/PostCSS with autoprefixer, this may be handled automatically.
- **Root-relative image paths:** Always `{base}/images/leaders/{leader.photo.filename}` — never `/images/leaders/...`. This is a locked project rule.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| 3D perspective depth | Custom CSS `perspective: 600px` in scoped style | Tailwind v4 `perspective-midrange` (800px) | Native utility, no magic numbers in scoped style |
| preserve-3d on inner card | Custom CSS `transform-style: preserve-3d` in scoped style | Tailwind v4 `transform-3d` class | Native utility |
| Back-face hiding | Custom CSS `backface-visibility: hidden` in scoped style | Tailwind v4 `backface-hidden` class | Native utility |
| Back face initial rotation | Custom scoped CSS `transform: rotateY(180deg)` on back face | Tailwind v4 `rotate-y-180` class | Native utility |
| Device type detection | JavaScript `window.ontouchstart` or `navigator.maxTouchPoints` | CSS `@media (hover: hover)` | CSS-native, no JS, no hydration issues on static site |

**Key insight:** Tailwind v4's 3D transform utilities cover almost everything. Scoped CSS is only strictly needed for the `.card.flipped { transform: rotateY(180deg); }` selector pattern and the `@media (hover: hover)` rule — two things that require CSS selectors rather than class composition.

---

## Common Pitfalls

### Pitfall 1: Back Face Text Appears Mirrored

**What goes wrong:** The back face content (name, title) appears mirrored/backwards when flipped.

**Why it happens:** The back face is pre-rotated 180° with `rotateY(180deg)`. When the inner card also rotates 180°, the content is right-side up, but if `transform-style: preserve-3d` is not set on the inner card, or if the back face's initial rotation is missing, the content renders incorrectly.

**How to avoid:** Always apply `rotate-y-180` (or its CSS equivalent) to the back face element as a *starting state*, not as the flipped state. The flip happens on the inner card wrapper, not on the faces.

**Warning signs:** Mirrored text on the back face immediately tells you `backface-hidden` is missing on the front face or the back face lacks its initial 180° pre-rotation.

---

### Pitfall 2: Both Faces Visible Simultaneously (Flicker or Bleed)

**What goes wrong:** During the flip animation, or in the fully-flipped state, parts of both faces are visible at the same time.

**Why it happens:** `backface-visibility: hidden` is not applied to both face elements, or `transform-style: preserve-3d` is missing from the inner card.

**How to avoid:** Apply `backface-hidden` to *both* `.face--front` and `.face--back`. Apply `transform-3d` only to the inner card (rotating element), not to the scene or the faces.

**Warning signs:** A brief flash of the front face during the flip, or the back content visible through the front at rest.

---

### Pitfall 3: iOS Safari Flickering During Animation

**What goes wrong:** On iOS Safari, the flip animation stutters, flickers, or shows artifacts — especially on older devices.

**Why it happens:** iOS Safari's compositing engine sometimes drops layers during 3D transforms, causing repaints. Historically, `-webkit-backface-visibility: hidden` was required; modern iOS Safari (17+) is more reliable but edge cases remain.

**How to avoid:**
1. Add `-webkit-backface-visibility: hidden` alongside `backface-visibility: hidden` in the scoped style block (Vite/PostCSS may handle this automatically, but explicit is safer).
2. Force GPU layer promotion on the scene wrapper: add `will-change: transform` or `transform: translateZ(0)` to the inner card.
3. Test on a real iOS device — Chrome DevTools mobile emulation does not replicate this bug.

**Warning signs:** Smooth in Chrome DevTools emulation, broken on actual iPhone.

---

### Pitfall 4: Hover Fires on Touch Devices (Sticky Hover)

**What goes wrong:** On iOS Safari, tapping a card triggers the `:hover` state and it stays "stuck" — the card flips on tap but never unflips because hover state persists until another element is tapped.

**Why it happens:** iOS Safari emulates hover on tap and keeps the hover state active until focus moves away. Using `:hover` directly on the card causes this.

**How to avoid:** Gate the CSS hover flip behind `@media (hover: hover)`. This media query evaluates to `false` on touch-primary devices (iOS, Android). The Svelte `$state` toggle handles tap.

**Warning signs:** Works on desktop but acts erratically on iPhone — cards flip but cannot unflip with a second tap.

---

### Pitfall 5: `base` Path Missing on Image Src

**What goes wrong:** Images render locally in dev but 404 in production on GitHub Pages.

**Why it happens:** The app is served from `/prophets/` in production. A root-relative path `/images/leaders/foo.jpg` becomes `https://user.github.io/images/leaders/foo.jpg` (wrong). With `base`, it becomes `https://user.github.io/prophets/images/leaders/foo.jpg` (correct).

**How to avoid:** Always: `src="{base}/images/leaders/{leader.photo.filename}"`. This pattern is already used in every existing component — maintain it in `LeaderCard.svelte`.

**Warning signs:** Images work in `npm run dev` but show broken image icons after `npm run build && npm run preview` on the production URL.

---

### Pitfall 6: `{#each}` Without a Key

**What goes wrong:** Svelte re-renders cards incorrectly when the list changes (e.g., future data updates), and `$state` flip state can bleed across card positions.

**Why it happens:** Without a key, Svelte reuses DOM nodes by position, not by identity. If a leader is inserted at position 3, all cards at position 3+ get wrong state.

**How to avoid:** Always: `{#each firstPresidency as leader (leader.id)}` — the `leader.id` field exists in `leaders.json`.

**Warning signs:** Flip state appears on wrong card after any list manipulation.

---

## Code Examples

Verified patterns from official sources:

### Full LeaderCard.svelte Structure

```svelte
<!-- Source: svelte.dev/docs/svelte/$state, tailwindcss.com/docs/perspective -->
<script>
  import { base } from '$app/paths';

  let { leader } = $props();
  let flipped = $state(false);

  function toggleFlip() {
    flipped = !flipped;
  }
</script>

<!-- scene: sets perspective, defines card box -->
<div
  class="scene perspective-midrange aspect-[4/5] w-full cursor-pointer"
  onclick={toggleFlip}
  onkeydown={(e) => e.key === 'Enter' || e.key === ' ' ? toggleFlip() : null}
  role="button"
  tabindex="0"
  aria-label="Flip card for {leader.name.display}"
  aria-pressed={flipped}
>
  <!-- inner card: rotates, preserves 3D -->
  <div class="card transform-3d relative w-full h-full rounded-lg shadow-md"
       class:flipped>
    <!-- Front face: photo only, no text -->
    <div class="face-front absolute inset-0 backface-hidden overflow-hidden rounded-lg">
      <img
        src="{base}/images/leaders/{leader.photo.filename}"
        alt={leader.photo.alt}
        class="w-full h-full object-cover object-top"
        loading="lazy"
      />
    </div>

    <!-- Back face: thumbnail + name + title -->
    <div class="face-back absolute inset-0 backface-hidden rotate-y-180
                overflow-hidden rounded-lg bg-white flex flex-col items-center
                justify-center gap-3 p-4">
      <img
        src="{base}/images/leaders/{leader.photo.filename}"
        alt={leader.photo.alt}
        class="w-16 h-20 object-cover object-top rounded"
        aria-hidden="true"
      />
      <p class="text-center font-semibold text-gray-900 text-sm leading-tight">
        {leader.name.display}
      </p>
      <p class="text-center text-xs text-gray-500 leading-tight">
        {leader.title}
      </p>
    </div>
  </div>
</div>

<style>
  /* Transition must be in scoped CSS — Tailwind cannot express selector-driven state */
  .card {
    transition: transform 0.5s ease;
    -webkit-backface-visibility: hidden; /* iOS Safari extra safety */
  }

  /* Tap/click flip state — class applied by Svelte $state binding */
  .card.flipped {
    transform: rotateY(180deg);
  }

  /* Desktop hover flip — CSS media query, no JS needed */
  @media (hover: hover) {
    .scene:hover .card {
      transform: rotateY(180deg);
    }
    /* On hover-capable devices, cursor should be default not pointer */
    .scene {
      cursor: default;
    }
  }
</style>
```

### +page.svelte Grid Replacement

```svelte
<!-- Source: tailwindcss.com/docs/grid-template-columns -->
<script>
  import { base } from '$app/paths';
  import leaders from '$lib/data/leaders.json';
  import LeaderCard from '$lib/components/LeaderCard.svelte';

  const firstPresidency = leaders.leaders
    .filter(l => l.quorum === 'first-presidency')
    .sort((a, b) => a.seniority - b.seniority);

  const quorumOfTwelve = leaders.leaders
    .filter(l => l.quorum === 'quorum-of-twelve')
    .sort((a, b) => a.seniority - b.seniority);
</script>

<svelte:head>
  <title>Know Your Prophets</title>
</svelte:head>

<main class="max-w-7xl mx-auto px-4 py-8">
  <section class="mb-10">
    <h2 class="text-xl font-semibold text-gray-700 mb-4">First Presidency</h2>
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {#each firstPresidency as leader (leader.id)}
        <LeaderCard {leader} />
      {/each}
    </div>
  </section>

  <section>
    <h2 class="text-xl font-semibold text-gray-700 mb-4">Quorum of the Twelve Apostles</h2>
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {#each quorumOfTwelve as leader (leader.id)}
        <LeaderCard {leader} />
      {/each}
    </div>
  </section>
</main>
```

### Tailwind v4 3D Utilities Reference

```html
<!-- Source: tailwindcss.com/docs/perspective, /docs/transform-style, /docs/backface-visibility -->

<!-- Perspective classes (applied to parent/scene element) -->
perspective-dramatic   → perspective: 100px   (very strong depth)
perspective-near       → perspective: 300px
perspective-normal     → perspective: 500px
perspective-midrange   → perspective: 800px   ← recommended for cards
perspective-distant    → perspective: 1200px
perspective-[750px]    → perspective: 750px   (arbitrary, also works)

<!-- preserve-3d (applied to rotating element) -->
transform-3d  → transform-style: preserve-3d

<!-- backface-visibility (applied to each face element) -->
backface-hidden   → backface-visibility: hidden
backface-visible  → backface-visibility: visible

<!-- Rotation (applied to back face for initial pre-rotation) -->
rotate-y-180  → transform: rotateY(180deg)
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Scoped CSS for all 3D properties | Tailwind v4 native utilities for perspective, transform-3d, backface-hidden, rotate-y-* | Tailwind v4.0 (2025) | Dramatically less custom CSS needed in style blocks |
| Svelte 4 `export let` + `on:click` | Svelte 5 `$props()` + `onclick` | Svelte 5.0 (2024) | Cleaner syntax; no behavioral change |
| JS device detection for touch vs. hover | CSS `@media (hover: hover)` | CSS Interaction Media Features (2022+, widely adopted) | No JS needed; more reliable |
| `@sveltejs/adapter-static` v2 | v3 | 2024 | Already on v3; no change |

**Deprecated/outdated:**
- `on:click` directive syntax: replaced by `onclick` in Svelte 5 (still works via compatibility mode, but project is on Svelte 5 — use new syntax)
- `export let prop`: replaced by `let { prop } = $props()` in Svelte 5
- `transform-style: preserve-3d` in scoped CSS: now expressible as Tailwind `transform-3d` utility class
- JavaScript touch detection for flip behavior: CSS media query is the correct modern approach

---

## Open Questions

1. **`-webkit-backface-visibility` in Vite/PostCSS pipeline**
   - What we know: Vite uses PostCSS; `@tailwindcss/vite` plugin handles CSS processing
   - What's unclear: Whether autoprefixer is included and will auto-add `-webkit-` prefixes to the scoped `<style>` block
   - Recommendation: Explicitly write `-webkit-backface-visibility: hidden` in the scoped style block. Cost is one extra line; benefit is iOS reliability. Don't rely on autoprefixer being configured.

2. **Hover suppression on desktop for `$state` toggle**
   - What we know: `@media (hover: hover)` will apply the CSS hover flip on desktop, but `onclick` toggle will also be wired to the element. On desktop, a single click will toggle `flipped = true`, but `@media (hover: hover)` CSS hover will already show the back face — the two interact.
   - What's unclear: Whether the Svelte `$state` toggle on desktop creates any visual conflict with the CSS hover flip (both trying to flip the card)
   - Recommendation: On hover-capable devices, the CSS hover handles the flip. The `onclick` handler still fires but the `class:flipped` state won't matter because the CSS hover rule has higher specificity during hover. When the user moves the mouse away, the hover flip resets. The JS-driven `.flipped` class would need to be suppressed on desktop — simplest solution: `@media (hover: hover) { .card.flipped { transform: none; } }` to prevent JS state from locking the card open on desktop.

---

## Validation Architecture

`workflow.nyquist_validation` is not present in `.planning/config.json`, so this section is skipped.

---

## Sources

### Primary (HIGH confidence)
- `tailwindcss.com/docs/perspective` — perspective utility classes and values confirmed
- `tailwindcss.com/docs/transform-style` — `transform-3d` and `transform-flat` utilities confirmed
- `tailwindcss.com/docs/backface-visibility` — `backface-hidden` and `backface-visible` confirmed
- `tailwindcss.com/docs/responsive-design` — breakpoint values (sm=640px, lg=1024px) confirmed
- `svelte.dev/docs/svelte/$state` — `$state` rune syntax confirmed
- `svelte.dev/docs/svelte/v5-migration-guide` — `$props()` and `onclick` syntax confirmed
- `3dtransforms.desandro.com/card-flip` — three-layer CSS 3D flip structure, canonical reference

### Secondary (MEDIUM confidence)
- `smashingmagazine.com/2022/03/guide-hover-pointer-media-queries` — `@media (hover: hover)` behavior and Samsung caveat, verified with MDN pattern
- `w3schools.com/howto/howto_css_flip_card.asp` — HTML structure cross-reference
- Svelte playground `dbdad7821bff445ab806fa608a6aac9f` — Svelte flip card reference implementation

### Tertiary (LOW confidence)
- Multiple WebSearch results on iOS Safari flickering — consistent across sources but not verified against current Apple developer docs; treat as "be aware, test on device"

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages already installed, versions confirmed in `package.json`
- CSS 3D flip structure: HIGH — verified via canonical reference (desandro.com) and Tailwind official docs
- Tailwind v4 3D utilities: HIGH — confirmed via official tailwindcss.com docs pages
- Svelte 5 syntax: HIGH — confirmed via official svelte.dev docs
- Hover/tap duality via `@media (hover: hover)`: MEDIUM-HIGH — widely documented; Samsung edge case noted
- iOS Safari flickering: MEDIUM — consistent across community sources but not verified against current Apple docs

**Research date:** 2026-03-01
**Valid until:** 2026-06-01 (stable libraries; Tailwind v4 and Svelte 5 unlikely to break these APIs within 90 days)
