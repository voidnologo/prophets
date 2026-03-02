# Phase 4: Biographies - Context

**Gathered:** 2026-03-02
**Status:** Ready for planning

<domain>
## Phase Boundary

A biography directory at `/bios` listing all 15 leaders, each linking to a
dedicated page showing photo, key facts, and outbound links to the official
Church website for full biography and Conference talks. No custom narratives
are written — the Church's authoritative pages serve that role.

</domain>

<decisions>
## Implementation Decisions

### Directory page (/bios)
- Show all 15 leaders as photo thumbnail + name cards
- Group by quorum: First Presidency, then Quorum of the Twelve (same grouping as home page)
- Clicking any card navigates to `/bios/[slug]`
- Home page (`/`) flip cards remain flip-only — no bio link added there
- Visual reference: Church's group pages (churchofjesuschrist.org/learn/first-presidency)

### Bio page (/bios/[slug])
- Prominent photo at the top
- Leader's full name and title
- Key facts panel: date of birth, calling date — these are the minimum; remaining
  data already in leaders.json (spouse, children, pre-calling career) may be
  included at Claude's discretion if layout allows cleanly
- Link to official Church biography (`sourceUrl` field — already in leaders.json for all 15)
- Link to their Conference talks index page (constructed from slug:
  `https://www.churchofjesuschrist.org/study/general-conference/speakers/[slug]?lang=eng`)
- No custom-written narrative — the Church bio link IS the narrative destination

### No custom narratives
- Original plan for 300–600 word PM-reviewed bios is replaced by linking to
  the Church's own biography pages
- Reason: authoritative, accurate, maintained by the Church — no accuracy risk,
  no maintenance burden
- BIO-02 requirement is fulfilled by the outbound link, not self-written content

### Conference talks
- Single "Conference Talks" link per leader, not a list of individual talks
- URL constructed from slug: `https://www.churchofjesuschrist.org/study/general-conference/speakers/[slug]?lang=eng`
- No `conferenceTalks` data entry needed in leaders.json — URL is always derivable
- Opens in new tab

### Navigation & links
- All outbound Church links open in a new tab (`target="_blank" rel="noopener noreferrer"`)
- Breadcrumb on bio page: "Biographies → [Leader Name]" — allows easy return to /bios
- Goal: drive users to the official Church website for authoritative content;
  the app is the discovery/learning layer, not the source of truth

### Activate nav
- "Biographies" nav link is currently `active: false` — must be flipped to `true`
  and pointed at `/bios` as part of this phase

### Claude's Discretion
- Exact card layout style on /bios directory (grid vs list, column count)
- Whether to show `bio.summary` one-liner on directory cards
- Whether to display spouse/children/pre-calling career on bio page (data exists; include if clean)
- Styling and typography choices

</decisions>

<specifics>
## Specific Ideas

- Reference design for directory: churchofjesuschrist.org/learn/first-presidency
  and churchofjesuschrist.org/learn/quorum-of-the-twelve-apostles
- Reference design for bio page: churchofjesuschrist.org/learn/dieter-f-uchtdorf
- Conference talks reference: churchofjesuschrist.org/study/general-conference/speakers/dallin-h-oaks
- "We want to drive traffic to the official church website — the URLs are safe and stable"
- "Open links in new tabs so our site stays accessible"
- "Clear and easy to follow breadcrumbs for navigation"

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `LeaderCard.svelte`: Existing flip card component — NOT reused for /bios directory
  cards (those are static nav cards, not flip cards). New simpler card needed.
- `leaders.json`: All required data already present — `birthDate`, `callingDate`,
  `sourceUrl`, `slug`, `photo`, `name`, `title`, `family`, `preCallingCareer`
- `$app/paths` base import: Used in LeaderCard for image paths — same pattern needed
  for bio page image

### Established Patterns
- SvelteKit file-based routing: bio pages → `src/routes/bios/[slug]/+page.svelte`
- Directory page → `src/routes/bios/+page.svelte`
- `+layout.js` with `export const prerender = true` for static adapter compatibility
- Tailwind v4 + scoped component CSS — existing pattern from LeaderCard
- Grouping by quorum: already done on home page with `.filter()` on `leaders.json`

### Integration Points
- `Nav.svelte`: `active: false` on Biographies link → flip to `true`, set href to `/bios`
- `src/routes/bios/+page.svelte`: New directory page
- `src/routes/bios/[slug]/+page.svelte`: New dynamic bio page
- `src/routes/bios/[slug]/+page.js`: Needs `load()` to find leader by slug, plus
  `export const prerender = true` and `entries()` for static generation of all 15 pages

</code_context>

<deferred>
## Deferred Ideas

- None — discussion stayed within phase scope

</deferred>

---

*Phase: 04-biographies*
*Context gathered: 2026-03-02*
