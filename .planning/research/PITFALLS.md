# Pitfalls Research

## Critical Pitfalls (Must Address)

### C1 — Native HTML Drag-and-Drop Fails Completely on iOS Safari

**The problem:** The HTML5 DnD API (`draggable="true"`, `ondragstart`, `ondrop`) does not fire events on iOS Safari. The ordering game will be **completely broken** for iPhone and iPad users if built with the native API.

**Warning signs:** Works fine in Chrome DevTools mobile emulation but fails on a real iPhone. DevTools emulation does not replicate iOS's touch event model.

**Prevention:** Use **SortableJS** (or the Pointer Events API) for the drag-to-order game from day one. Do not build with the native API and plan to "fix it later" — it requires a complete rewrite.

**Phase:** Phase 3 (ordering game) — must be addressed at the start of that phase.

---

### C2 — `transform-style: preserve-3d` Silently Destroyed by Common CSS

**The problem:** Applying `overflow: hidden`, any `filter`, `opacity < 1`, `clip-path`, or `will-change: opacity` to a card that uses `transform-style: preserve-3d` forces the browser to flatten it — the 3D flip just stops working with no error or warning.

**Warning signs:** Flip animation degrades to a 2D squish/scale effect instead of a true 3D rotation. Often introduced when adding a box shadow, hover filter, or other visual effect to the card wrapper.

**Prevention:** Use a strict three-layer structure:
```html
<!-- Outer wrapper: sizing, position, visual effects (no 3D transforms) -->
<div class="card">
  <!-- Middle layer: the 3D transform ONLY — no other CSS here -->
  <div class="card-inner">
    <!-- Faces: backface-visibility: hidden on these only -->
    <div class="card-front">...</div>
    <div class="card-back">...</div>
  </div>
</div>
```
Only `card-inner` gets `transform-style: preserve-3d` and the `rotateY` transition. Visual effects (shadow, border radius, overflow) go on the outer `.card` only.

**Phase:** Phase 1 (MVP flip grid) — must be designed correctly from the start.

---

### C3 — Static Data Goes Stale When Leadership Changes

**The problem:** When a leader is called or released (or passes away), the app continues to show outdated data indefinitely. There is no automatic notification mechanism.

**Warning signs:** General Conference announces a change; app still shows old data. Photos, seniority order, titles all become wrong at once.

**Prevention:**
1. Display a visible "Data current as of [date]" note in the UI footer
2. Document a concrete update checklist in the repo README (what files to update after a change)
3. Consider a GitHub issue template: "Leadership change — update required"
4. Keep `leaders.json` fields explicit (dates, not ages) so age-calculation errors are caught

**Phase:** Phase 1 — add the "last updated" display. Document the process before shipping.

---

### C4 — GitHub Pages Base URL Breaks Asset Paths

**The problem:** GitHub Pages serves the site at `https://username.github.io/prophets/`, not at `/`. Root-relative paths like `/images/nelson.jpg` or `/games/flashcards` will 404 on production but work perfectly in local development.

**Warning signs:** Works locally with `npm run dev`; images and navigation break after deploying to GitHub Pages.

**Prevention:** Configure SvelteKit's `paths.base`:
```js
// svelte.config.js
paths: {
  base: process.env.NODE_ENV === 'production' ? '/prophets' : ''
}
```
Use `$app/paths`'s `base` in all internal links. **Validate the real deployment URL in Phase 1** — don't discover this in Phase 4.

**Phase:** Phase 1 — set up and verify before any other feature is built.

---

### C5 — Factual Errors in Biographies of Living Religious Leaders

**The problem:** AI-assisted biography writing carries real hallucination risk. Incorrect birth years, wrong spouse names, fabricated career details, or errors in calling dates damage credibility in a context where accuracy is sacred.

**Warning signs:** Any unverified "fact" in a biography is a potential error. No warning exists at runtime.

**Prevention:**
- Every specific fact (date, name, place, career, family detail) must be individually sourced from `churchofjesuschrist.org` before committing
- Add a `source` URL to every `triviaFact` in `leaders.json`
- Do not write bios from memory or "common knowledge" — look up each fact
- Have the PM (user) review each biography before it's committed
- Prefer omitting uncertain facts over including unverified ones

**Phase:** Phase 5 (biographies) — this is the highest-risk phase for content accuracy.

---

## Important Pitfalls (Should Address)

### I1 — Missing Safari Prefix on `backface-visibility`

Always include both prefixed and unprefixed:
```css
.card-front, .card-back {
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}
```
Safari still requires the `-webkit-` prefix as of 2026 for this property. Without it, the back face shows through during the flip on Safari/iOS.

**Phase:** Phase 1 — include in initial card CSS.

---

### I2 — Tap-to-Flip Conflicts with Tap-to-Navigate on Mobile

If the flip card is also a link to the biography page, a single tap triggers both the flip and navigation — the user never sees the name reveal.

**Prevention:** Separate the gestures. Tap = flip (reveal name). On the bio page link, use a dedicated visible "Learn More →" button on the card back, not the whole card as a link.

**Phase:** Phase 1 (MVP) — design the card interaction model carefully.

---

### I3 — Official Church Photos Require Permission for Re-Hosting

**The problem:** Photos on churchofjesuschrist.org belong to Intellectual Reserve, Inc. Re-hosting them in a GitHub repository may violate the Church's intellectual property terms.

**Prevention:**
- Review the Church's media guidelines at churchofjesuschrist.org before downloading photos
- Consider hotlinking to photos served from the official LDS media library (if permitted and stable)
- Or reach out to the Church's media contact for educational use permission
- Document the source of each photo in the repo

**Phase:** Phase 1 — research photo licensing before sourcing images.

---

### I4 — Quiz Feedback Not Announced to Screen Readers

If correct/wrong feedback is shown only visually (color change, icon), screen reader users get no feedback.

**Prevention:** Use an `aria-live="polite"` region that announces the result:
```html
<div aria-live="polite" class="sr-only" id="feedback-announcer"></div>
```
Update its text content (not innerHTML) when feedback is shown.

**Phase:** All game phases — build this into the game component pattern from Phase 2.

---

### I5 — Flip Cards Are Keyboard-Inaccessible if Built as `div`

`div` elements are not in the tab order and don't respond to keyboard events by default.

**Prevention:**
```html
<div role="button" tabindex="0" aria-pressed={isFlipped}
     onkeydown={(e) => e.key === 'Enter' || e.key === ' ' ? flip() : null}>
```
Or use a real `<button>` element styled to look like a card.

**Phase:** Phase 1 — design cards as keyboard-accessible from the start.

---

### I6 — Unoptimized Images Cause Slow Load on Mobile

15 unoptimized JPEG photos from an official website can easily total 5–15MB — unusably slow on mobile data connections.

**Prevention:**
- Resize to max 400×500px (grid/game) and 600×800px (bio hero)
- Compress to JPEG quality 80–85; target under 80KB per headshot
- Use `loading="lazy"` on below-fold cards
- Use `width` and `height` attributes on `<img>` to prevent layout shift

**Phase:** Phase 1 (source + optimize images before shipping MVP).

---

### I7 — Feedback Language Must Match the Subject Matter

Language like "Wrong!", "Nope!", or "❌ Incorrect!" is tonally jarring in an app about revered religious leaders.

**Prevention:** Use neutral, encouraging language:
- ✓ "The correct answer is President [Name]"
- ✓ "Try again!"
- ✓ "Not quite — here's the right answer"
- ✗ "Wrong!", "Nope!", "Fail"

**Phase:** All game phases — set this standard in Phase 2.

---

## Minor Pitfalls (Nice to Avoid)

### M1 — Permanent `will-change: transform` Wastes GPU Memory
Apply `will-change: transform` only on hover/focus, not statically on all 15 cards. Remove it after the animation completes.

### M2 — Deep-Linking to Bio Pages on GitHub Pages
SvelteKit's static adapter generates real `.html` files for each route, so deep links work correctly. Confirm the `404.html` fallback is configured in GitHub Pages settings.

### M3 — Quiz Mode Alt Text Cannot Reveal the Answer
In flash card and typed modes, `alt="Photo of President Russell M. Nelson"` reveals the answer. Use `alt=""` (empty, not missing) in game modes to hide the name from screen reader users, or `alt="Leader photo — identify this person"`. Bio pages should use the full descriptive alt text.

### M4 — Keyboard Alternative for Drag-and-Drop
Provide arrow key reordering as an alternative for users who cannot drag. Select a card with Space; move it with arrow keys; confirm with Enter.

### M5 — iOS Autocorrect Mangles Names in Typed-Name Mode
Add `autocorrect="off" autocomplete="off" spellcheck="false"` to the typed-name input field. Without this, iOS will "correct" "Oaks" to "Oats" or similar.

### M6 — Conference Talk URLs Will Rot
External links to churchofjesuschrist.org can change. Check links before each release. Consider adding a "report broken link" mechanism in a later milestone.

### M7 — No "Last Updated" Date Erodes Trust
Without a visible update date, users can't tell if the app is current. Add a footer: "Leader data last verified: March 2026". Update this date when `leaders.json` is updated.

---

## Phase Mapping

| Phase | Top Pitfalls to Watch |
|---|---|
| Phase 1 — MVP Grid | C2 (3D CSS), C4 (base URL), I3 (photo licensing), I5 (keyboard), I6 (image size) |
| Phase 2 — Flash Cards | I4 (aria-live), I7 (language tone), M3 (alt text in game mode) |
| Phase 3 — Ordering Game | C1 (iOS DnD), M4 (keyboard alt) |
| Phase 4 — Typed Entry | M5 (autocorrect off) |
| Phase 5 — Biographies | C5 (accuracy), C3 (staleness), I3 (photo rights) |
| Phase 6 — Trivia | C5 (accuracy — facts sourced from bios), M6 (link rot) |

---
*Research completed: 2026-03-01*
