# Theme intensity: Low, Medium, High

Asked at the start (Step −1). **Medium is the default.** Intensity changes how much of the portfolio shows, never the quality rules: every level passes the same hygiene checks (tokens only, type minimums, focus, 390px, real content). Set it on the page root so the CSS can follow it: `<html data-intensity="medium">` (or on the layout's top element).

| | **Low**: tokens and format | **Medium**: the essence (default) | **High**: follow it like a rule |
|---|---|---|---|
| Who it's for | A product that must feel like *its own* brand, with this system's craft underneath | Most products: clearly Astodesign, but the product comes first | Showpieces, portfolios, launches, anything where the mood is the point |
| Colour, type, radius, spacing, buttons, inputs | ✓ all tokens | ✓ | ✓ |
| Surfaces | Paper-first. Night only for the nav/rail | Night page or rail, Paper for what is read | Night-led; Paper only as cards, pages and the book |
| Washi texture | Paper grain only (no fibres, no Night texture) | Grain + faint fibres on Paper and Night | Same, plus the night-pond backdrop on large Night areas |
| Kicker → serif title pair | Page title only | Every section header | Every section header, plus `ds-tagline` standfirsts |
| Serif use | Titles only | Titles, names, short display lines | Also stat numbers, folios, pull quotes |
| Motifs (moon, lantern, cat, petal, gold rule) | None (the gold rule under the page title is allowed) | **One** per screen, doing a job (progress ring, unread glow, empty state) | Several, each doing a job, never two in one region |
| Illustration (`Scene`) | None | None on dense screens. `Scene quiet` or the backdrop for a hero or empty state | Full `Scene` on the hero or first screen |
| Book and page display | No | At most **one flow** as a book | Can be the main structure |
| Motion | Feedback only (`--duration-fast`) | + entrance rise (`ds-enter`) | + page turns, ambient sway, staggered reveals |
| Copy voice | Plain | Plain, with one warm line (a tagline or empty state) | Warm and a little poetic, like the portfolio ("Flip back", "/Konbanwa/") |
| Identity checklist: signature items needed | 3 of 7 | 5 of 7 | 7 of 7 |

## Choosing intensity across several layouts

When asked for three layouts and nobody chose an intensity, keep **Medium for all three** and vary the *idea* (Step 0 VARIANT). If the user asks to "show range", spread them as Low / Medium / High, still from three different ideas. Never use intensity as the *only* difference between layouts.

## How each level fails (watch for these)

- **Low done wrong:** a generic, flat UI. It still needs the charcoal uppercase buttons, the square corners, the paper grain and the kicker on the page title. Without those it isn't the system at all.
- **Medium done wrong:** two motifs, a full scene behind a chat, or the book used for a list.
- **High done wrong:** the theme gets in the way of the job, for example illustration behind text, a page turn on every click, or poetic copy on error messages. Even at High, errors, money and safety copy stay plain.
