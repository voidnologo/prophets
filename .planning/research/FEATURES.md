# Features Research

## Table Stakes (Must Have)

Features users expect in a face-name learning app:

- **Photo grid** — See all leaders at once; essential for visual orientation
- **Name reveal** — The core learning loop: face → name
- **Mobile support** — Most users will be on phones, especially youth
- **Fast load** — Images load quickly; no spinner frustration
- **Correct data** — Accurate names and photos; errors destroy trust
- **Navigation** — Move between modes without losing context
- **Responsive layout** — Works on phone, tablet, desktop

## Differentiators (Nice to Have)

Features that make this app stand out:

- **Seniority ordering game** — Unique to Church leadership apps; tests deeper knowledge
- **Hint system in typed mode** — Reduces frustration; lowers barrier for younger users
- **Biography narrative style** — Personal stories, not dry facts; emotional connection
- **Links to Conference talks** — Directly connects learning to primary source material
- **Trivia from bios** — Discovery of surprising facts (career, family, background)
- **Progress feedback within session** — "Card 8 of 15" — keeps learner oriented
- **End-of-round review** — See what you got right/wrong; essential for learning

## Anti-Features (Deliberately Avoid)

Things that hurt educational apps of this type:

- **Countdown timers** — Creates anxiety; inappropriate for religious/reverent context; shuts out younger users
- **Lives/failure punishments** — A wrong answer is learning, not penalty
- **User accounts / leaderboards** — Privacy concern, especially for minors; adds complexity
- **Ads or monetization** — Misaligned with Church educational context
- **Complex onboarding** — Users should be able to start immediately
- **Autoplay audio/video** — Jarring; not expected in this context
- **Cluttered UI** — The subject matter calls for clean, respectful presentation

## Card Flip UX

Best practices for the flip-card interaction:

- **Animation:** Y-axis rotation (`rotateY(180deg)`), 300–400ms duration, `ease` easing
- **3D required properties:**
  ```css
  .card-inner { transform-style: preserve-3d; }
  .card-front, .card-back { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
  .card-back { transform: rotateY(180deg); }
  ```
- **Trigger:** `mouseenter`/`mouseleave` for pointer devices; `click`/`tap` for touch devices. Use `@media (hover: none)` or the `pointer` media query to differentiate.
- **Reduced motion:** Respect `prefers-reduced-motion` — fall back to an instant reveal instead of animation.
- **After flip:** Show full name + title; optionally a short one-line bio summary.
- **Unflip behavior:** On desktop, card returns to photo side on mouse leave. On mobile, second tap unflips — or navigate away to reset.
- **Card size:** Large enough to show a recognizable face — minimum 150×180px on mobile.

## Flash Card UX

Best practices for multiple-choice flash card mode:

- **Question format:** Large centered photo, 4 name options below as large tap targets (min 44×44px)
- **Option layout:** Vertical stack on mobile; 2×2 grid on tablet/desktop
- **Distractor quality:** Options must be plausible (same quorum, similar name length) — not obviously wrong
- **Immediate feedback:** On selection, reveal correct answer immediately. Color (green/red) + icon — never color alone (accessibility)
- **"Wrong cards back in deck":** When a user misses a card, shuffle it back into the remaining deck. This is the simplest form of spaced repetition and significantly aids retention.
- **Session end:** Show score (X out of 15), then offer "Review Round" (see all cards + correct answers) and "Play Again" (reshuffled)
- **Progress indicator:** "Card 7 of 15" in the header — never hidden

## Drag & Drop Ordering UX

Best practices for seniority ordering game:

- **Critical:** Use touch-compatible DnD library (SortableJS) — native HTML5 DnD doesn't work on iOS Safari
- **Initiation:** Long-press (300ms) to "pick up" a card on mobile; immediate click-drag on desktop
- **Visual feedback:** Ghost element (semi-transparent clone) follows finger/cursor; placeholder gap shows drop target
- **Auto-scroll:** If card is dragged near the top/bottom edge of the viewport, scroll the page
- **Submit explicitly:** Do NOT auto-evaluate on every drop. Let user arrange freely, then tap "Check My Order" button. This is gentler and allows rethinking.
- **Result display:** After checking, show correct vs. placed position with color coding. Don't just say "X wrong" — show the correct order.
- **Keyboard fallback:** Arrow keys to move selected card up/down; Space to pick up/drop (WCAG 2.1 SC 1.3.3)
- **Hint option:** Optional — show seniority numbers as a toggle ("Show Numbers") for learning mode

## Advanced Flash Card UX (Typed Name Entry)

- **Input field:** Auto-focused; large text; mobile keyboard should not obscure the photo
- **Case sensitivity:** Accept any casing (normalize to lowercase for comparison)
- **Partial credit:** Consider "close enough" — e.g., "Neal Maxwell" for "Neal A. Maxwell" — use Levenshtein distance ≤ 2
- **Hint system:** Each hint press reveals one random unrevealed character (preserve punctuation, spaces). Display as: `_ _ _ _ _ _   _ .   _ _ _ _ _ _` → `R _ _ _ _ _   _ .   _ _ _ _ _ _`
- **Limit hints:** Cap at (name_length / 3) hints to maintain challenge
- **Feedback timing:** Don't penalize typing speed — no character-by-character validation; only validate on "Submit" or Enter

## Biography Page UX

What should be on a leader bio page:

- **Header:** Large photo (hero) + name + title + seniority badge ("Quorum of the Twelve, #7")
- **Quick Facts panel:** (sidebar on desktop, stacked on mobile)
  - Born: date + place
  - Age: calculated automatically from birthDate
  - Called: date
  - Spouse: name
  - Children: number
  - Education: brief
  - Pre-call career: 1-2 sentences
- **Narrative biography:** 300–600 words, 6th–8th grade reading level (Flesch-Kincaid), past-tense for historical events, present-tense for current service
- **Conference Talks section:** Newest first; title, date (month + year), direct link to churchofjesuschrist.org
- **Navigation:** "← Back to All Leaders" at top and bottom of page
- **Consistent tone:** Respectful, warm, accessible — suitable for family reading

## Mobile Considerations

- `touch-action: manipulation` on interactive elements to eliminate 300ms tap delay
- Flip cards: large tap target (full card face), not a small button
- DnD: Pointer Events API or SortableJS (not mouse events) for reliable touch drag
- Typed input: test that mobile keyboard doesn't push photo off screen; use `position: sticky` for input or restructure layout
- Minimum tap target: 44×44px per Apple HIG / WCAG 2.5.5
- Avoid `hover`-only information: anything revealed on hover must be accessible by tap

## Accessibility

Key WCAG 2.2 requirements for this app:

| Requirement | Implementation |
|---|---|
| All images have alt text | `alt="Photo of President Russell M. Nelson"` |
| Color is not the only feedback | Correct/wrong uses icon + color + text |
| 4.5:1 contrast ratio | Verify with browser DevTools or Lighthouse |
| Keyboard navigation | Tab through all cards; Enter/Space to flip |
| ARIA for interactive cards | `role="button"`, `aria-pressed="true/false"`, `aria-label` |
| Quiz feedback announced | `aria-live="polite"` region for "Correct!" / "Incorrect" |
| Reduced motion | `@media (prefers-reduced-motion: reduce)` — instant reveal |
| Font sizing | `rem` units, no `px` font sizes |
| Language declaration | `<html lang="en">` |
| Drag-and-drop keyboard alt | Arrow key + Space pick-up/drop alternative |

---
*Research completed: 2026-03-01*
