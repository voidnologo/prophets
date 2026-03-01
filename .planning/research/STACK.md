# Stack Research

## Recommended Stack

A SvelteKit app with the static adapter — pre-renders biography pages to flat HTML, compiles interactive game components to minimal JS, deploys cleanly to GitHub Pages. SortableJS handles drag-and-drop on iOS (native HTML5 DnD is broken on iOS Safari). Tailwind v4 for layout; scoped CSS within Svelte components for the 3D flip animation.

## Framework

**SvelteKit 2 + Svelte 5** — `@sveltejs/kit@^2.x`, `svelte@^5.x`

Svelte 5 compiles to minimal JS (no virtual DOM, no runtime shipped). SvelteKit's `@sveltejs/adapter-static` pre-renders all bio pages at build time. The six interactive game modes are Svelte components — clean, composable, AI-friendly. Svelte 5 runes (`$state`, `$derived`, `$effect`) replace verbose store boilerplate.

**Why not vanilla JS:** Six interactive game modes benefit heavily from reactive state management. Managing drag state, quiz round state, scored results, and hint-character tracking with raw DOM manipulation leads to tangled imperative code that is hard to maintain or extend with AI assistance.

**Why not React/Next.js:** Heavier than needed, larger bundle, and Next.js's server features don't apply to a static GitHub Pages deploy.

**Why not Astro:** Astro's zero-JS philosophy is a poor fit for an app that is entirely games and interactions. You'd fight the framework on every game page.

**Confidence: High**

## CSS Strategy

**Tailwind CSS v4** for layout, spacing, responsive grid, colors, and typography.
**Scoped CSS within Svelte `<style>` blocks** for the 3D flip animation and any complex keyframe animations.

The flip animation requires `transform-style: preserve-3d`, `backface-visibility: hidden`, and `perspective` — these look unreadable in Tailwind's arbitrary value syntax and belong in component CSS.

```css
/* Inside LeaderCard.svelte <style> */
.card-inner {
  transform-style: preserve-3d;
  transition: transform 0.4s ease;
}
.card-inner.flipped {
  transform: rotateY(180deg);
}
.card-front, .card-back {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}
.card-back {
  transform: rotateY(180deg);
}
```

**Confidence: High**

## Build Tooling

**Vite 6** (included via SvelteKit — no separate configuration needed)

Zero config required. `npm run dev` for local development with HMR. `npm run build` for production static output. `npm run preview` to verify the built output before deploying.

```bash
npm create svelte@latest prophets
# Choose: Skeleton project, TypeScript: No, ESLint: Yes, Prettier: Yes
```

**Confidence: High**

## Drag & Drop

**SortableJS** `sortablejs@^1.15.x`

**Critical:** Native HTML5 Drag and Drop API does not fire events on iOS Safari. This is a known, longstanding bug. Any app targeting mobile must not rely on the native DnD API for the seniority ordering game.

SortableJS handles `touchstart`/`touchmove`/`touchend` correctly on all major mobile browsers, including iOS Safari. It is well-maintained (8M weekly npm downloads), small (~20KB gzipped), and integrates cleanly with Svelte.

```js
import Sortable from 'sortablejs';

// Inside onMount() in the Order.svelte component
const sortable = Sortable.create(gridEl, {
  animation: 150,
  ghostClass: 'sortable-ghost',
  onEnd: checkOrder
});
```

**Confidence: High**

## Deployment

**GitHub Actions + `peaceiris/actions-gh-pages@v4`**

Automatically deploys on every push to `main`. The built `/build` directory is pushed to the `gh-pages` branch.

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build
```

**Critical configuration — `svelte.config.js`:**

```js
import adapter from '@sveltejs/adapter-static';

export default {
  kit: {
    adapter: adapter(),
    paths: {
      base: process.env.NODE_ENV === 'production' ? '/prophets' : ''
    }
  }
};
```

The `paths.base` setting is mandatory. Without it, all asset paths will 404 on GitHub Pages because the repo is served at `username.github.io/prophets/`, not the root.

**Confidence: High**

## What NOT to Use

| Technology | Reason to Avoid |
|---|---|
| Native HTML5 DnD API | Broken on iOS Safari — fatal for mobile |
| Astro | Zero-JS philosophy fights interactive game pages |
| React + Vite | More complex than needed, larger bundle |
| jQuery | Dead dependency; Svelte handles everything |
| Bootstrap | Tailwind is superior for custom designs |
| Webpack/Parcel | Vite supersedes both |
| Redux/Zustand/Pinia | Svelte 5 `$state` runes handle local state cleanly |
| Node.js backend | Explicitly out of scope; GitHub Pages is static-only |

## Confidence Levels

| Decision | Confidence | Notes |
|---|---|---|
| SvelteKit + Svelte 5 | High | Stable v2/v5 releases, widely used |
| Tailwind CSS v4 | High | Released early 2025, stable |
| Vite 6 | High | Included with SvelteKit, no separate config |
| SortableJS | High | Industry standard for touch DnD |
| GitHub Actions deploy | High | Documented, widely used pattern |
| `paths.base` configuration | High | Required for GitHub Pages subdirectory |

---
*Research completed: 2026-03-01*
