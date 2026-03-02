# Phase 1: Foundation — Research

## RESEARCH COMPLETE

---

## 1. SvelteKit Project Initialization

### Commands

```bash
npm create svelte@latest .
# In the current directory:
# - Template: Skeleton project
# - Type checking: No (keep it simple; add JSDoc types in leaders.ts if desired)
# - ESLint: Yes
# - Prettier: Yes
# - Playwright: No
# - Vitest: No (added later if needed)

npm install
npm install -D tailwindcss @tailwindcss/vite
```

### svelte.config.js (critical — paths.base)

```js
import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: '404.html',
      precompress: false,
      strict: true
    }),
    paths: {
      base: process.env.NODE_ENV === 'production' ? '/prophets' : ''
    }
  }
};

export default config;
```

**Critical:** The `fallback: '404.html'` generates a copy of the 404 page for GitHub Pages to serve on unknown routes.

### vite.config.js — Tailwind v4

```js
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
    sveltekit()
  ]
});
```

### src/app.css — Tailwind v4 import

```css
@import "tailwindcss";
```

**Tailwind v4 change:** No `tailwind.config.js` needed. No `@tailwind base/components/utilities` directives. Just `@import "tailwindcss"` in your global CSS. All utilities are available automatically. Custom config goes in `@theme {}` blocks inside CSS if needed.

### src/app.html

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%sveltekit.assets%/favicon.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="Learn the names and faces of the First Presidency and Quorum of the Twelve Apostles" />
    %sveltekit.head%
  </head>
  <body data-sveltekit-preload-data="hover">
    <div style="display: contents">%sveltekit.body%</div>
  </body>
</html>
```

**Note:** `%sveltekit.assets%` resolves to the base path automatically — use this instead of hardcoded `/`.

---

## 2. GitHub Actions Deployment

### .github/workflows/deploy.yml

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: write

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          NODE_ENV: production

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build
          cname: voidnologo.com
```

**`cname: voidnologo.com`** — This writes a `CNAME` file into the build output each deploy. Required when using a custom domain; without it, GitHub Pages resets the custom domain setting after each deploy and the site breaks.

**Permissions:** `contents: write` is needed for `peaceiris/actions-gh-pages` to push to the `gh-pages` branch.

### Custom domain notes

- The `CNAME` file in the `gh-pages` branch root must contain `voidnologo.com`
- DNS must already have a CNAME or A record pointing to GitHub Pages (assumed already set up since other sites work)
- GitHub Pages settings for the repo: set Source to `gh-pages` branch, custom domain to `voidnologo.com`
- Once the CNAME is in the workflow, GitHub won't reset the domain setting after deploys

### Branch strategy

```bash
# Start each phase on a feature branch
git checkout -b phase/01-foundation

# Work and commit on the feature branch
# When phase is verified and approved, merge to main:
git checkout main
git merge --no-ff phase/01-foundation
git push origin main
# GitHub Actions auto-deploys from main push
```

---

## 3. The 15 Leaders — Data

**⚠️ CRITICAL:** Seniority integers and exact details MUST be verified against churchofjesuschrist.org before committing. The data below is research-quality but requires PM confirmation. The seniority order is the answer key for the ordering game (v2) — errors here will silently produce wrong game results.

### First Presidency (as of early 2026)

| Seniority | Name | Title | Source |
|---|---|---|---|
| 1 | Russell M. Nelson | President of the Church | https://www.churchofjesuschrist.org/learn/russell-m-nelson |
| 2 | Dallin H. Oaks | First Counselor in the First Presidency | https://www.churchofjesuschrist.org/learn/dallin-h-oaks |
| 3 | Henry B. Eyring | Second Counselor in the First Presidency | https://www.churchofjesuschrist.org/learn/henry-b-eyring |

### Quorum of the Twelve Apostles (in seniority order, as of early 2026)

| Seniority | Name | Title | Notes |
|---|---|---|---|
| 4 | Jeffrey R. Holland | Acting President of the Quorum of the Twelve Apostles | Senior apostle after First Presidency members |
| 5 | Dieter F. Uchtdorf | Quorum of the Twelve | |
| 6 | David A. Bednar | Quorum of the Twelve | |
| 7 | Quentin L. Cook | Quorum of the Twelve | |
| 8 | D. Todd Christofferson | Quorum of the Twelve | |
| 9 | Neil L. Andersen | Quorum of the Twelve | |
| 10 | Ronald A. Rasband | Quorum of the Twelve | |
| 11 | Gary E. Stevenson | Quorum of the Twelve | |
| 12 | Dale G. Renlund | Quorum of the Twelve | |
| 13 | Gerrit W. Gong | Quorum of the Twelve | |
| 14 | Ulisses Soares | Quorum of the Twelve | |
| 15 | Patrick Kearon | Quorum of the Twelve | Called April 2024; replaced M. Russell Ballard (d. Nov 2023) |

**Source page for all:** https://www.churchofjesuschrist.org/learn/quorum-of-the-twelve-apostles

**Photo collection:** https://www.churchofjesuschrist.org/media/collection/first-presidency-and-quorum-of-the-twelve-apostles-images?lang=eng

### PM Verification Table format

The Phase 1 plan should produce a Markdown table for PM review in this format:

```markdown
## Leader Data Verification Checklist

| # | Display Name | Title | Quorum | Calling Date | Birth Date | Source URL | PM Check |
|---|---|---|---|---|---|---|---|
| 1 | Russell M. Nelson | President of the Church | first-presidency | 2018-01-14 | 1924-09-09 | [link] | [ ] |
| 2 | Dallin H. Oaks | First Counselor | first-presidency | 2018-01-14 | 1932-08-12 | [link] | [ ] |
...
```

This goes in a file `.planning/phases/01-foundation/DATA-VERIFICATION.md` — PM checks each row before approving Phase 1.

---

## 4. leaders.json Schema

Full schema supporting all 4 phases (Bio and Trivia fields are stubs in Phase 1, populated in later phases):

```json
{
  "lastVerified": "2026-03-01",
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
      "sourceUrl": "https://www.churchofjesuschrist.org/learn/russell-m-nelson",
      "photo": {
        "filename": "russell-m-nelson.jpg",
        "alt": "President Russell M. Nelson"
      },
      "family": {
        "spouseName": "Wendy Watson Nelson",
        "children": 10
      },
      "preCallingCareer": "Cardiothoracic surgeon; professor at University of Utah School of Medicine",
      "education": ["University of Utah (BS, MD)", "University of Minnesota (PhD)"],
      "bio": {
        "summary": "Pioneer heart surgeon who became the 17th President of the Church.",
        "narrativeFile": "russell-m-nelson"
      },
      "conferenceTalks": [],
      "triviaFacts": []
    }
  ]
}
```

**Field notes:**
- `id` and `slug`: same value, kebab-case; used as route param and image filename
- `quorum`: `"first-presidency"` or `"quorum-of-twelve"` — drives grouping
- `seniority`: integer 1–15; **must be verified** — this is the ordering game answer key
- `lastVerified`: top-level field updated whenever any record is checked
- `conferenceTalks` and `triviaFacts`: empty arrays in Phase 1, populated in Phases 4 and beyond
- `bio.narrativeFile`: slug only (no path/extension) — resolves to `src/lib/data/bios/<slug>.md` in Phase 4

---

## 5. Image Optimization

### Sourcing

Download from: https://www.churchofjesuschrist.org/media/collection/first-presidency-and-quorum-of-the-twelve-apostles-images?lang=eng

Each image on that page has download options (usually multiple sizes). Download the highest resolution available.

### Optimization approach

Use `sharp` (Node.js) for batch processing:

```bash
npm install --save-dev sharp
```

```js
// scripts/optimize-images.js
import sharp from 'sharp';
import { readdirSync } from 'fs';
import { join } from 'path';

const INPUT_DIR = './scripts/raw-photos';
const OUTPUT_DIR = './static/images/leaders';

for (const file of readdirSync(INPUT_DIR)) {
  if (!file.match(/\.(jpg|jpeg|png|webp)$/i)) continue;
  const slug = file.replace(/\.[^.]+$/, '').toLowerCase().replace(/\s+/g, '-');

  // Headshot (grid + games): 400×500px
  await sharp(join(INPUT_DIR, file))
    .resize(400, 500, { fit: 'cover', position: 'top' })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(join(OUTPUT_DIR, `${slug}.jpg`));

  // Hero (bio pages): 600×800px
  await sharp(join(INPUT_DIR, file))
    .resize(600, 800, { fit: 'cover', position: 'top' })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(join(OUTPUT_DIR, `${slug}-hero.jpg`));
}
```

```bash
node scripts/optimize-images.js
```

**Target:** Under 80KB per headshot. `mozjpeg: true` typically achieves 60–75KB at quality 82 for portrait photos.

**Alternative (no Node script):** Use Squoosh CLI or ImageMagick:
```bash
# ImageMagick batch resize
mogrify -path static/images/leaders -resize 400x500^ -gravity North -extent 400x500 -quality 82 scripts/raw-photos/*.jpg
```

---

## 6. Placeholder Home Page & Navigation

### Nav with greyed-out future links

```svelte
<!-- src/lib/components/Nav.svelte -->
<script>
  import { base } from '$app/paths';
  import { page } from '$app/stores';

  const links = [
    { href: `${base}/`, label: 'Leaders', active: true },
    { href: `${base}/games/flashcards`, label: 'Flash Cards', active: false },
    { href: `${base}/bios`, label: 'Biographies', active: false },
  ];
</script>

<nav class="flex gap-6 items-center px-6 py-4 border-b border-gray-200">
  <span class="font-bold text-lg text-gray-900">Know Your Prophets</span>
  <div class="flex gap-4 ml-auto">
    {#each links as link}
      {#if link.active}
        <a href={link.href}
           class="text-blue-600 hover:text-blue-800 font-medium"
           aria-current={$page.url.pathname === link.href ? 'page' : undefined}>
          {link.label}
        </a>
      {:else}
        <span class="text-gray-400 cursor-not-allowed" aria-disabled="true"
              title="Coming soon">
          {link.label}
        </span>
      {/if}
    {/each}
  </div>
</nav>
```

**Key detail:** Use `<span>` (not `<a>`) for unbuilt links — a disabled `<a href="">` still gets focus and confuses screen readers. A `<span>` with `aria-disabled` and `cursor-not-allowed` is cleaner.

As each phase ships, flip `active: false` to `active: true` and provide the real `href`.

### Placeholder home page

```svelte
<!-- src/routes/+page.svelte -->
<script>
  import { base } from '$app/paths';
  import leaders from '$lib/data/leaders.json';

  const firstPresidency = leaders.leaders.filter(l => l.quorum === 'first-presidency');
  const quorumOfTwelve = leaders.leaders.filter(l => l.quorum === 'quorum-of-twelve');
</script>

<svelte:head>
  <title>Know Your Prophets</title>
</svelte:head>

<main class="max-w-3xl mx-auto px-6 py-10">
  <h1 class="text-3xl font-bold text-gray-900 mb-8">Know Your Prophets</h1>

  <section class="mb-10">
    <h2 class="text-xl font-semibold text-gray-700 mb-4">First Presidency</h2>
    <ul class="space-y-3">
      {#each firstPresidency as leader}
        <li class="flex items-center gap-4 p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
          <img src="{base}/images/leaders/{leader.photo.filename}"
               alt={leader.photo.alt}
               width="48" height="60"
               class="rounded object-cover" />
          <div>
            <p class="font-semibold text-gray-900">{leader.name.display}</p>
            <p class="text-sm text-gray-500">{leader.title}</p>
          </div>
        </li>
      {/each}
    </ul>
  </section>

  <section>
    <h2 class="text-xl font-semibold text-gray-700 mb-4">Quorum of the Twelve Apostles</h2>
    <ul class="space-y-3">
      {#each quorumOfTwelve as leader}
        <li class="flex items-center gap-4 p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
          <img src="{base}/images/leaders/{leader.photo.filename}"
               alt={leader.photo.alt}
               width="48" height="60"
               class="rounded object-cover"
               loading="lazy" />
          <div>
            <p class="font-semibold text-gray-900">{leader.name.display}</p>
            <p class="text-sm text-gray-500">{leader.title}</p>
          </div>
        </li>
      {/each}
    </ul>
  </section>
</main>
```

### Layout with footer

```svelte
<!-- src/routes/+layout.svelte -->
<script>
  import Nav from '$lib/components/Nav.svelte';
  import '../app.css';
</script>

<Nav />

<slot />

<footer class="mt-16 border-t border-gray-100 py-6 text-center text-sm text-gray-400">
  Leader data last verified: {new Date(leaders.lastVerified).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
  &nbsp;·&nbsp;
  Photos courtesy of The Church of Jesus Christ of Latter-day Saints
</footer>
```

---

## 7. Tailwind v4 — Key Changes from v3

| What changed | v3 | v4 |
|---|---|---|
| Config file | `tailwind.config.js` | None (CSS-based) |
| Import directives | `@tailwind base/components/utilities` | `@import "tailwindcss"` |
| Vite integration | `postcss-tailwindcss` in PostCSS | `@tailwindcss/vite` Vite plugin |
| Custom theme | `theme.extend` in config | `@theme {}` block in CSS |
| Arbitrary values | Same | Same |

**SvelteKit-specific:** Add the Vite plugin in `vite.config.js`, not in a postcss config. Do NOT add `tailwindcss` to `postcss.config.js` — it conflicts.

---

## 8. GitHub Issue Template — Leadership Change

Create `.github/ISSUE_TEMPLATE/leadership-change.yml`:

```yaml
name: Leadership Change
description: Update app data when First Presidency or Q12 membership changes
title: "[DATA] Leadership change: "
labels: ["data-update"]
body:
  - type: markdown
    value: |
      Use this template whenever a change occurs in the First Presidency or Quorum of the Twelve.

  - type: input
    id: change-description
    attributes:
      label: What changed?
      placeholder: "e.g. Elder Kearon released, Elder [Name] called as new Apostle"
    validations:
      required: true

  - type: checkboxes
    id: files-to-update
    attributes:
      label: Files to update
      options:
        - label: "`src/lib/data/leaders.json` — update/add/remove leader record, fix seniority integers for all affected leaders"
        - label: "`static/images/leaders/` — add/remove photo file(s)"
        - label: "`.planning/phases/01-foundation/DATA-VERIFICATION.md` — update verification table"
        - label: "`src/lib/data/bios/<slug>.md` — add bio for new leader (Phase 4)"
        - label: "Footer `lastVerified` date in `leaders.json`"

  - type: textarea
    id: source-urls
    attributes:
      label: Source URLs (churchofjesuschrist.org)
      placeholder: "List the official profile URLs for all changed leaders"
    validations:
      required: true

  - type: input
    id: effective-date
    attributes:
      label: Effective date of change
      placeholder: "YYYY-MM-DD"
    validations:
      required: true
```

---

## 9. Pitfalls to Watch in Phase 1

| Pitfall | Prevention |
|---|---|
| `paths.base` not set — assets 404 on prod | Set in `svelte.config.js` day one; test with `npm run preview` before pushing |
| CNAME file wiped on each deploy | Add `cname: voidnologo.com` to the GitHub Actions workflow |
| Seniority order wrong in leaders.json | PM verifies DATA-VERIFICATION.md before Phase 1 closes |
| Photo paths hardcoded as `/images/...` | Always use `{base}/images/...` or `%sveltekit.assets%/images/...` |
| Tailwind v4 config conflicts | No `tailwind.config.js`, no PostCSS config — Vite plugin only |
| `conferenceTalks` data for all leaders | Leave as empty arrays `[]` in Phase 1; populated in Phase 4 |

---

*Phase 1 Research — 2026-03-01*
