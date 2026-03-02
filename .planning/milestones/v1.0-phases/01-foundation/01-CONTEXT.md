# Phase 1: Foundation - Context

**Gathered:** 2026-03-01
**Status:** Ready for planning

<domain>
## Phase Boundary

Establish the project's data layer, SvelteKit scaffold, and live deployment pipeline. By the end of this phase: a real URL (voidnologo.com/prophets) is live, all 15 leader records are verified and committed, and the site shows a simple list of names/titles. No game UI, no flip cards — just a working foundation the rest of the project builds on.

</domain>

<decisions>
## Implementation Decisions

### Data Verification
- Each leader record in `leaders.json` must include a `sourceUrl` field pointing to their official profile on churchofjesuschrist.org
- Build a human-readable summary doc (table format) for PM review — not the raw JSON. PM signs off on the table before Phase 1 closes.
- Seniority order will be researched from churchofjesuschrist.org directly; PM trusts this research but will confirm before locking
- A GitHub issue template will be created for leadership change updates (walks through which files to edit and in what order)

### Placeholder Home Page
- The app name in the UI is **"Know Your Prophets"**
- Phase 1 placeholder shows a simple, clean list of all 15 leaders with name and title
- Full navigation is wired up from day one, with greyed-out/disabled links for unbuilt modes (Flash Cards, Biographies); this shows the intended structure and makes the app feel purposeful from the start

### Photos
- **Source:** https://www.churchofjesuschrist.org/media/collection/first-presidency-and-quorum-of-the-twelve-apostles-images?lang=eng
- **Hosting:** Download and host in the repo at `static/images/leaders/`
- **Licensing:** Proceed under educational non-commercial use; add attribution comment in code and a note in README crediting The Church of Jesus Christ of Latter-day Saints / Intellectual Reserve, Inc.
- **Optimization:** Done in Phase 1 — resize to 400×500px headshots (grid/game) and 600×800px heroes (bio pages); compress under 80KB per headshot

### Repository & Deployment
- **Repo:** `github.com/voidnologo/prophets`
- **Live URL:** `voidnologo.com/prophets`
- **SvelteKit base path:** `paths.base = '/prophets'`
- **Branch strategy:** Feature branches per phase (e.g., `phase/01-foundation`); merged to `main` when phase is verified
- **Deploy:** GitHub Actions → `gh-pages` branch; GitHub Pages serves from `gh-pages`; custom domain `voidnologo.com` is already configured on the account
- **Planning docs:** `.planning/` committed to `main` ✓ (already done)

### Claude's Discretion
- Exact GitHub Actions workflow file structure (standard `peaceiris/actions-gh-pages@v4` pattern)
- CSS styling of the Phase 1 placeholder list page (clean and minimal is fine)
- Exact JSON schema field names beyond what's documented in ARCHITECTURE.md

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- None yet — greenfield project

### Established Patterns
- None yet — patterns will be established in this phase

### Integration Points
- `voidnologo.com` custom domain: already configured in GitHub Pages for the voidnologo account; adding a new repo `prophets` with a `gh-pages` branch will automatically be served at `voidnologo.com/prophets` without additional DNS config

</code_context>

<specifics>
## Specific Details

- Photo source page: https://www.churchofjesuschrist.org/media/collection/first-presidency-and-quorum-of-the-twelve-apostles-images?lang=eng
- GitHub username: `voidnologo`
- Final URL: `voidnologo.com/prophets`
- App title: "Know Your Prophets"
- leaders.json field for sourcing: `sourceUrl` (string, URL to the leader's official profile)
- PM review format: a Markdown table (name | title | seniority | calling date | source URL) — not raw JSON

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within Phase 1 scope.

</deferred>

---

*Phase: 01-foundation*
*Context gathered: 2026-03-01*
