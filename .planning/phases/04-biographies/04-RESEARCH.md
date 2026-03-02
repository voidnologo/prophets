# Phase 4: Biographies - Research

**Researched:** 2026-03-02
**Domain:** SvelteKit dynamic routing, static prerendering, directory + detail page pattern
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Directory page (/bios)**
- Show all 15 leaders as photo thumbnail + name cards
- Group by quorum: First Presidency, then Quorum of the Twelve (same grouping as home page)
- Clicking any card navigates to `/bios/[slug]`
- Home page (`/`) flip cards remain flip-only — no bio link added there
- Visual reference: Church's group pages (churchofjesuschrist.org/learn/first-presidency)

**Bio page (/bios/[slug])**
- Prominent photo at the top
- Leader's full name and title
- Key facts panel: date of birth, calling date — minimum; spouse, children, pre-calling career included at Claude's discretion if layout allows cleanly
- Link to official Church biography (`sourceUrl` field — already in leaders.json for all 15)
- Link to their Conference talks index page (constructed from slug: `https://www.churchofjesuschrist.org/study/general-conference/speakers/[slug]?lang=eng`)
- No custom-written narrative — the Church bio link IS the narrative destination

**No custom narratives**
- Original plan for 300–600 word PM-reviewed bios is replaced by linking to the Church's own biography pages
- BIO-02 requirement is fulfilled by the outbound link, not self-written content

**Conference talks**
- Single "Conference Talks" link per leader, not a list of individual talks
- URL constructed from slug: `https://www.churchofjesuschrist.org/study/general-conference/speakers/[slug]?lang=eng`
- No `conferenceTalks` data entry needed in leaders.json — URL is always derivable
- Opens in new tab

**Navigation & links**
- All outbound Church links open in a new tab (`target="_blank" rel="noopener noreferrer"`)
- Breadcrumb on bio page: "Biographies → [Leader Name]" — allows easy return to /bios
- Goal: drive users to the official Church website; the app is the discovery/learning layer

**Activate nav**
- "Biographies" nav link is currently `active: false` — must be flipped to `true` and pointed at `/bios`

### Claude's Discretion
- Exact card layout style on /bios directory (grid vs list, column count)
- Whether to show `bio.summary` one-liner on directory cards
- Whether to display spouse/children/pre-calling career on bio page (data exists; include if clean)
- Styling and typography choices

### Deferred Ideas (OUT OF SCOPE)
- None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| BIO-01 | User can browse a directory page listing all 15 leaders with photos and names, each linking to an individual biography page | `src/routes/bios/+page.svelte` with leader grid grouped by quorum; each card links to `/bios/[slug]` |
| BIO-02 | Each of the 15 leaders has a dedicated biography page; requirement fulfilled by outbound link to Church's authoritative page (per CONTEXT.md decision) | `src/routes/bios/[slug]/+page.svelte` with prominent `sourceUrl` link; no custom narrative needed |
| BIO-03 | Each biography page includes a quick-facts panel: age (from birthDate), calling date, spouse name, number of children, pre-calling career | All data fields present in leaders.json; age computed from `birthDate` using JS `Date` arithmetic |
| BIO-04 | Each biography page includes Conference talks section with link to churchofjesuschrist.org | URL constructed as `https://www.churchofjesuschrist.org/study/general-conference/speakers/[slug]?lang=eng`; opens in new tab |
</phase_requirements>

---

## Summary

Phase 4 adds a biography directory (`/bios`) and 15 individual bio pages (`/bios/[slug]`), all pre-rendered at build time by SvelteKit's adapter-static. The phase is essentially a data-display exercise: all required information already lives in `leaders.json`, no new data sources are needed, and no custom narrative content is written. The Church's official pages serve as the authoritative content destination; this app is the discovery layer.

The primary technical challenge is setting up SvelteKit's static prerendering for dynamic routes correctly. The `[slug]` segment requires an `entries()` export in `+page.js` so adapter-static knows which 15 slugs to emit as HTML files at build time. This pattern is already used (or directly analogous to) the rest of the project, so it follows established conventions.

The secondary challenge is computing age from `birthDate` accurately: birth dates are ISO strings in leaders.json, and age must be calculated from today's date, accounting for whether the birthday has occurred yet this calendar year. Everything else — grouping by quorum, rendering photos with `base` path, Tailwind layout — is a direct reuse of existing home-page patterns.

**Primary recommendation:** Build two route files (`+page.svelte` for directory, `+page.svelte` + `+page.js` for bio detail), reuse all existing data, and link outward to the Church's website for narrative content.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| SvelteKit | 2.50.2 (installed) | File-based routing, SSG output | Already in project; `prerender = true` in layout |
| `@sveltejs/adapter-static` | 3.0.10 (installed) | Emit static HTML per route | Required for GitHub Pages; already configured |
| Svelte 5 | 5.51.0 (installed) | `$props()`, `$state()`, `$derived()` reactivity | Already used project-wide |
| Tailwind CSS v4 | 4.2.1 (installed) | Utility-first layout and spacing | Already used project-wide |
| `$app/paths` (`base`) | Built-in to SvelteKit | Prefix asset/link paths for GitHub Pages | Critical — all image srcs and internal hrefs must use `base` |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| JS `Date` (built-in) | N/A | Calculate age from `birthDate` | For BIO-03 age field in quick-facts panel |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Deriving Conference talks URL from slug | Storing URL in leaders.json | Storing it is redundant — URL pattern is stable and 100% derivable; no data entry needed |
| `+page.js` with `entries()` | `prerender = true` at layout level only | Layout-level `prerender = true` alone is insufficient for dynamic `[slug]` routes — adapter-static needs explicit slug enumeration via `entries()` |

**Installation:** No new packages needed. All dependencies are already installed.

---

## Architecture Patterns

### Recommended Project Structure

New files to create:

```
src/routes/bios/
├── +page.svelte          # Directory page — all 15 leaders, grouped by quorum
├── [slug]/
│   ├── +page.js          # load() + entries() for static prerendering
│   └── +page.svelte      # Individual bio page
```

No changes to existing files except:
- `src/lib/components/Nav.svelte` — flip `active: false` to `active: true` for Biographies link

### Pattern 1: Static Prerendering of Dynamic Routes

**What:** For each slug in leaders.json, adapter-static must generate a separate HTML file. Without `entries()`, the prerender pass cannot discover which slugs exist.

**When to use:** Required for any `[param]` route in a fully-static SvelteKit site.

**Example:**

```javascript
// src/routes/bios/[slug]/+page.js
// Source: SvelteKit docs — https://kit.svelte.dev/docs/page-options#entries

import leaders from '$lib/data/leaders.json';

export const prerender = true;

// Tell adapter-static which slugs to emit as HTML files
export function entries() {
  return leaders.leaders.map(leader => ({ slug: leader.slug }));
}

export function load({ params }) {
  const leader = leaders.leaders.find(l => l.slug === params.slug);
  if (!leader) {
    throw new Error(`Leader not found: ${params.slug}`);
  }
  return { leader };
}
```

### Pattern 2: Directory Page — Grouping by Quorum

**What:** The home page already demonstrates this exact pattern. Reuse it.

**Example:**

```javascript
// src/routes/bios/+page.svelte  <script> block
import leaders from '$lib/data/leaders.json';
import { base } from '$app/paths';

const firstPresidency = leaders.leaders
  .filter(l => l.quorum === 'first-presidency')
  .sort((a, b) => a.seniority - b.seniority);

const quorumOfTwelve = leaders.leaders
  .filter(l => l.quorum === 'quorum-of-twelve')
  .sort((a, b) => a.seniority - b.seniority);
```

### Pattern 3: Age Calculation from ISO Date String

**What:** Convert `birthDate` (e.g., `"1932-08-12"`) to a current age integer.

**When to use:** BIO-03 quick-facts panel age display.

**Example:**

```javascript
// Pure function — safe to place in a lib utility or inline in the component
function calculateAge(birthDateIso) {
  const today = new Date();
  const birth = new Date(birthDateIso);
  let age = today.getFullYear() - birth.getFullYear();
  const hasHadBirthdayThisYear =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());
  if (!hasHadBirthdayThisYear) age--;
  return age;
}
```

Note: `new Date(birthDateIso)` with an ISO-format `YYYY-MM-DD` string parses as UTC midnight. Comparing `.getMonth()` / `.getDate()` against a local-time `today` can produce off-by-one errors on the birthday itself in non-UTC timezones. The safest approach is to compare year/month/day integers extracted from the ISO string directly:

```javascript
function calculateAge(birthDateIso) {
  const [birthYear, birthMonth, birthDay] = birthDateIso.split('-').map(Number);
  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth() + 1; // getMonth() is 0-indexed
  const todayDay = today.getDate();
  let age = todayYear - birthYear;
  const hasHadBirthday =
    todayMonth > birthMonth ||
    (todayMonth === birthMonth && todayDay >= birthDay);
  if (!hasHadBirthday) age--;
  return age;
}
```

### Pattern 4: Outbound Link Safety

**What:** All links to churchofjesuschrist.org must open in new tab with security attributes.

**Example:**

```svelte
<a
  href={leader.sourceUrl}
  target="_blank"
  rel="noopener noreferrer"
  class="..."
>
  Read full biography
</a>

<a
  href="https://www.churchofjesuschrist.org/study/general-conference/speakers/{leader.slug}?lang=eng"
  target="_blank"
  rel="noopener noreferrer"
  class="..."
>
  Conference Talks
</a>
```

### Pattern 5: Internal Links with `base`

**What:** Every `href` pointing to an internal route must be prefixed with `base` from `$app/paths`. Without this, links break on GitHub Pages (`/prophets/bios/...` vs `/bios/...`).

**Example:**

```svelte
<script>
  import { base } from '$app/paths';
</script>

<!-- Directory card linking to bio page -->
<a href="{base}/bios/{leader.slug}">...</a>

<!-- Breadcrumb back link on bio page -->
<a href="{base}/bios">Biographies</a>
```

### Pattern 6: Image Paths with `base`

**What:** Image `src` attributes follow the same `base` prefix rule, identical to LeaderCard.svelte.

**Example:**

```svelte
<img
  src="{base}/images/leaders/{leader.photo.filename}"
  alt={leader.photo.alt}
/>
```

### Anti-Patterns to Avoid

- **Root-relative hrefs without base:** `href="/bios/dallin-h-oaks"` — produces 404 on GitHub Pages. Always use `{base}/bios/...`.
- **Root-relative image srcs:** `src="/images/leaders/..."` — same GitHub Pages 404 issue.
- **Omitting `entries()` for dynamic routes:** Without it, adapter-static generates no HTML files for `/bios/[slug]`. The route silently produces nothing.
- **Relying on layout-level `prerender = true` alone for dynamic routes:** The layout sets the default, but dynamic `[slug]` routes still need `entries()` to enumerate their paths.
- **Using `new Date("YYYY-MM-DD")` and comparing local time:** Parses as UTC, `.getDate()` returns UTC date — comparing against local `today.getDate()` produces wrong age on the birthday in non-UTC timezones. Parse the components from the string directly.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Slug-to-leader lookup | Custom routing/lookup logic | `leaders.json` `find()` by slug in `load()` | Already one source of truth; 15 records, no perf concern |
| Conference talks URL | Storing full URL per leader in JSON | Derive from slug: `https://www.churchofjesuschrist.org/study/general-conference/speakers/${leader.slug}?lang=eng` | URL pattern is stable; no data entry needed |
| Static HTML per slug | Custom build script | SvelteKit `entries()` export in `+page.js` | SvelteKit handles all prerender orchestration |
| Photo path construction | Hard-coded paths | `${base}/images/leaders/${leader.photo.filename}` | `base` handles environment-correct prefixing |

**Key insight:** Every piece of data needed for Phase 4 already exists in `leaders.json`. No new data collection, no new assets, no new build tooling — this phase is 100% presentation work on existing data.

---

## Common Pitfalls

### Pitfall 1: Missing `entries()` on Dynamic Route

**What goes wrong:** `vite build` completes without error but `/bios/dallin-h-oaks/index.html` (and all other bio pages) are not emitted to the `build/` directory. The deployed site has no bio pages despite a clean build.

**Why it happens:** `adapter-static` only generates HTML for routes it can discover. Static routes are discovered automatically. Dynamic `[slug]` routes require explicit enumeration.

**How to avoid:** Always export `entries()` from `src/routes/bios/[slug]/+page.js`:

```javascript
export function entries() {
  return leaders.leaders.map(leader => ({ slug: leader.slug }));
}
```

**Warning signs:** Build completes but `ls build/bios/` only shows `index.html`, no subdirectories.

### Pitfall 2: Internal Links Without `base`

**What goes wrong:** Navigation between `/bios` and `/bios/[slug]` works in `dev` but 404s in production on GitHub Pages.

**Why it happens:** Dev server serves at `/`; GitHub Pages serves at `/prophets/`. Root-relative `/bios/...` resolves to `yourdomain.com/bios/...`, not `yourdomain.com/prophets/bios/...`.

**How to avoid:** Import `base` from `$app/paths` and prefix every internal `href` and `src` with it.

**Warning signs:** Links work at `localhost:5173` but produce 404 after `gh-pages` deployment.

### Pitfall 3: Age Off-by-One on Birthday

**What goes wrong:** A leader born on the current date shows as one year younger than they actually are.

**Why it happens:** `new Date("YYYY-MM-DD")` parses as UTC midnight. In a UTC-negative timezone, `today.getDate()` returns the previous calendar day, making `todayDay >= birthDay` false on the birth date itself.

**How to avoid:** Parse year/month/day integers from the ISO string directly (see Pattern 3 above). Do not use `Date` object comparison for the same-day test.

**Warning signs:** Age displays correctly for most leaders but is wrong by 1 for leaders whose birthday is today or in the first few days of a month.

### Pitfall 4: `[slug]` Not Found Causes Build Failure

**What goes wrong:** If `entries()` returns a slug that doesn't match any leader in `leaders.json`, the `load()` function throws, and the prerender build fails hard.

**Why it happens:** `entries()` must return exactly the slugs that exist in the data. If the data and the entries list get out of sync (e.g., during leader updates), the build breaks.

**How to avoid:** Derive `entries()` directly from `leaders.json` so they are always in sync (as shown in Pattern 1). Never hard-code the slug list.

### Pitfall 5: `aria-current` on Breadcrumb vs. Nav

**What goes wrong:** Both the Nav's Biographies link and the breadcrumb "Biographies" link display `aria-current="page"` on bio detail pages, confusing screen reader users.

**Why it happens:** Nav checks `$page.url.pathname === link.href`. On `/bios/dallin-h-oaks`, the Nav's Biographies link href is `/prophets/bios` — these do not match, so this is actually safe. But the breadcrumb's top-level link should NOT get `aria-current="page"` — it's a parent, not the current page.

**How to avoid:** Only the bio detail page link (if breadcrumb renders a non-linked current page label) should have `aria-current`. The "Biographies" breadcrumb link is a parent; omit `aria-current` on it.

---

## Code Examples

Verified patterns from the existing codebase:

### Directory Page — Complete Skeleton

```svelte
<!-- src/routes/bios/+page.svelte -->
<script>
  import leaders from '$lib/data/leaders.json';
  import { base } from '$app/paths';

  const firstPresidency = leaders.leaders
    .filter(l => l.quorum === 'first-presidency')
    .sort((a, b) => a.seniority - b.seniority);

  const quorumOfTwelve = leaders.leaders
    .filter(l => l.quorum === 'quorum-of-twelve')
    .sort((a, b) => a.seniority - b.seniority);
</script>

<svelte:head>
  <title>Biographies — Know Your Prophets</title>
</svelte:head>

<main class="max-w-7xl mx-auto px-4 py-8">
  <section class="mb-10">
    <h2 class="text-xl font-semibold text-gray-700 mb-4">First Presidency</h2>
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {#each firstPresidency as leader (leader.id)}
        <a href="{base}/bios/{leader.slug}" class="group block rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <img
            src="{base}/images/leaders/{leader.photo.filename}"
            alt={leader.photo.alt}
            class="w-full aspect-[4/5] object-cover object-top"
            loading="lazy"
          />
          <div class="p-2 bg-white">
            <p class="font-semibold text-gray-900 text-sm leading-tight">{leader.name.display}</p>
            <p class="text-xs text-gray-500 mt-0.5">{leader.title}</p>
          </div>
        </a>
      {/each}
    </div>
  </section>

  <section>
    <h2 class="text-xl font-semibold text-gray-700 mb-4">Quorum of the Twelve Apostles</h2>
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {#each quorumOfTwelve as leader (leader.id)}
        <a href="{base}/bios/{leader.slug}" class="group block rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <img
            src="{base}/images/leaders/{leader.photo.filename}"
            alt={leader.photo.alt}
            class="w-full aspect-[4/5] object-cover object-top"
            loading="lazy"
          />
          <div class="p-2 bg-white">
            <p class="font-semibold text-gray-900 text-sm leading-tight">{leader.name.display}</p>
            <p class="text-xs text-gray-500 mt-0.5">{leader.title}</p>
          </div>
        </a>
      {/each}
    </div>
  </section>
</main>
```

### Bio Detail Page Load Function

```javascript
// src/routes/bios/[slug]/+page.js
import leaders from '$lib/data/leaders.json';

export const prerender = true;

export function entries() {
  return leaders.leaders.map(leader => ({ slug: leader.slug }));
}

export function load({ params }) {
  const leader = leaders.leaders.find(l => l.slug === params.slug);
  if (!leader) {
    throw new Error(`No leader found for slug: ${params.slug}`);
  }
  return { leader };
}
```

### Bio Detail Page — Breadcrumb + Key Facts + Outbound Links

```svelte
<!-- src/routes/bios/[slug]/+page.svelte -->
<script>
  import { base } from '$app/paths';

  let { data } = $props();
  let { leader } = $derived(data);

  // Safely derive Conference talks URL
  const talksUrl = `https://www.churchofjesuschrist.org/study/general-conference/speakers/${leader.slug}?lang=eng`;

  // Age calculation — parse components from ISO string to avoid UTC/local mismatch
  function calculateAge(isoDate) {
    const [birthYear, birthMonth, birthDay] = isoDate.split('-').map(Number);
    const today = new Date();
    const y = today.getFullYear();
    const m = today.getMonth() + 1;
    const d = today.getDate();
    let age = y - birthYear;
    if (m < birthMonth || (m === birthMonth && d < birthDay)) age--;
    return age;
  }

  // Format ISO date as human-readable (e.g. "August 12, 1932")
  function formatDate(isoDate) {
    return new Date(isoDate + 'T12:00:00').toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  }
</script>

<svelte:head>
  <title>{leader.name.display} — Know Your Prophets</title>
</svelte:head>

<main class="max-w-2xl mx-auto px-4 py-8">

  <!-- Breadcrumb -->
  <nav aria-label="Breadcrumb" class="text-sm text-gray-500 mb-6">
    <a href="{base}/bios" class="hover:text-blue-600">Biographies</a>
    <span class="mx-2" aria-hidden="true">›</span>
    <span aria-current="page" class="text-gray-900">{leader.name.display}</span>
  </nav>

  <!-- Photo + name header -->
  <div class="flex flex-col sm:flex-row gap-6 mb-8">
    <img
      src="{base}/images/leaders/{leader.photo.filename}"
      alt={leader.photo.alt}
      class="w-40 h-auto rounded-lg shadow-md object-cover object-top flex-shrink-0"
    />
    <div>
      <h1 class="text-2xl font-bold text-gray-900">{leader.name.full}</h1>
      <p class="text-gray-600 mt-1">{leader.title}</p>
    </div>
  </div>

  <!-- Quick facts panel -->
  <section class="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-8">
    <h2 class="text-lg font-semibold text-gray-800 mb-3">Quick Facts</h2>
    <dl class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
      <div>
        <dt class="text-gray-500">Born</dt>
        <dd class="font-medium text-gray-900">{formatDate(leader.birthDate)}</dd>
      </div>
      <div>
        <dt class="text-gray-500">Age</dt>
        <dd class="font-medium text-gray-900">{calculateAge(leader.birthDate)}</dd>
      </div>
      <div>
        <dt class="text-gray-500">Called</dt>
        <dd class="font-medium text-gray-900">{formatDate(leader.callingDate)}</dd>
      </div>
      {#if leader.family?.spouseName}
      <div>
        <dt class="text-gray-500">Spouse</dt>
        <dd class="font-medium text-gray-900">{leader.family.spouseName}</dd>
      </div>
      {/if}
      {#if leader.family?.children != null}
      <div>
        <dt class="text-gray-500">Children</dt>
        <dd class="font-medium text-gray-900">{leader.family.children}</dd>
      </div>
      {/if}
      {#if leader.preCallingCareer}
      <div class="sm:col-span-2">
        <dt class="text-gray-500">Career</dt>
        <dd class="font-medium text-gray-900">{leader.preCallingCareer}</dd>
      </div>
      {/if}
    </dl>
  </section>

  <!-- Outbound Church links -->
  <section class="mb-8">
    <h2 class="text-lg font-semibold text-gray-800 mb-3">Learn More</h2>
    <div class="flex flex-col gap-3">
      <a
        href={leader.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-colors font-medium text-sm"
      >
        Official Biography
        <span aria-hidden="true">↗</span>
        <span class="sr-only">(opens in new tab)</span>
      </a>
      <a
        href={talksUrl}
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-colors font-medium text-sm"
      >
        Conference Talks
        <span aria-hidden="true">↗</span>
        <span class="sr-only">(opens in new tab)</span>
      </a>
    </div>
  </section>

</main>
```

### Nav Activation (One-Line Change)

```javascript
// src/lib/components/Nav.svelte — change this line:
{ href: `${base}/bios`, label: 'Biographies', active: false },
// to:
{ href: `${base}/bios`, label: 'Biographies', active: true },
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Svelte `export let` props | Svelte 5 `$props()` rune | Svelte 5 (2024) | Use `let { data } = $props()` in page components |
| Svelte `{#if data.x}` reactive vars | `$derived()` runes | Svelte 5 (2024) | Use `let { leader } = $derived(data)` or inline destructuring |
| `load()` in `+page.svelte` `<script context="module">` | Separate `+page.js` file | SvelteKit 1.0 (2023) | `load()` lives in `+page.js`, not the component file |

**Deprecated/outdated:**
- `<script context="module">` in Svelte for `load()`: Replaced by dedicated `+page.js` file. Do not use.
- `export let data` in Svelte 4 style: Replaced by `let { data } = $props()` in Svelte 5.

---

## Open Questions

1. **Conference talks URL slug for Gerald Caussé**
   - What we know: His `slug` in leaders.json is `gerald-causse` (ASCII-normalized, no accent). His `sourceUrl` uses `gerald-j-causse`.
   - What's unclear: Whether the Church's General Conference speaker index uses `gerald-causse` or `gerald-j-causse` as the URL slug.
   - Recommendation: Before finalizing the Conference talks URL construction, manually verify `https://www.churchofjesuschrist.org/study/general-conference/speakers/gerald-causse?lang=eng` and `https://www.churchofjesuschrist.org/study/general-conference/speakers/gerald-j-causse?lang=eng`. If one 404s, use the other. Consider adding an optional `conferenceTalksSlug` override field to his leaders.json entry if needed — or simply hard-code his talks URL as a `conferenceTalksUrl` override in his JSON entry.

2. **Clark G. Gilbert — Conference talks**
   - What we know: He was called February 2026 and has not yet delivered a General Conference address as an apostle.
   - What's unclear: Whether his speaker index page exists yet on churchofjesuschrist.org.
   - Recommendation: Render the Conference Talks link regardless — the Church may have past talks from his 70 service. If the page 404s, that is the Church's concern, not ours. The link pattern is still correct.

3. **`bio.summary` on directory cards**
   - What we know: Every leader has a `bio.summary` one-liner in leaders.json. Including it would add context to the directory cards. CONTEXT.md marks this as Claude's discretion.
   - What's unclear: Whether the summary text fits cleanly in a compact card without wrapping awkwardly for longer entries.
   - Recommendation: Include it as a third line below title, clamped to 2 lines with `line-clamp-2`. This adds useful context without disrupting the grid layout.

---

## Sources

### Primary (HIGH confidence)
- Codebase inspection — `src/lib/data/leaders.json`, `src/lib/components/LeaderCard.svelte`, `src/routes/+page.svelte`, `src/routes/+layout.js`, `src/routes/games/flashcards/+page.svelte`, `svelte.config.js`, `package.json` — all data fields confirmed present, all patterns confirmed in use
- `.planning/phases/04-biographies/04-CONTEXT.md` — locked PM decisions verified verbatim above

### Secondary (MEDIUM confidence)
- SvelteKit static adapter prerendering pattern with `entries()` — established pattern documented in SvelteKit docs and used identically in the existing project structure; `prerender = true` in `+layout.js` is already confirmed working
- Conference talks URL pattern (`/study/general-conference/speakers/[slug]?lang=eng`) — PM confirmed URL is safe and stable in CONTEXT.md

### Tertiary (LOW confidence)
- Gerald Caussé Conference talks URL slug — requires manual verification before implementation (see Open Questions)

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all dependencies already installed and in use; no new packages
- Architecture: HIGH — `entries()` pattern is SvelteKit-standard; all file locations are prescribed by SvelteKit routing conventions; home page provides direct precedent for quorum grouping
- Pitfalls: HIGH — missing `entries()`, missing `base` prefix, and UTC/local date arithmetic are confirmed real issues from the project's own decision log and established JS behavior
- Data completeness: HIGH — all 15 leaders have every required field (`birthDate`, `callingDate`, `sourceUrl`, `slug`, `photo`, `family`, `preCallingCareer`) verified by direct inspection of leaders.json

**Research date:** 2026-03-02
**Valid until:** 2026-04-02 (stable stack; Church URL patterns are unlikely to change)
