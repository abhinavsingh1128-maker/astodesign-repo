# The book and page display

From astodesign.com: About, Research and Contact are **open books**. Two washi Paper pages sit side by side with a spine. Each page has a running head (kicker), a big serif title, a short italic standfirst and a page number. "← Flip back" sits at the foot of the left page and "Next →" at the foot of the right. Turning animates the leaf from the spine with a soft shade sweep.

## When to use it

| Use it for | Never for |
|---|---|
| Profiles ("a reader's year"), personal stories | Chat streams, feeds, notifications |
| Onboarding / a guided first run (one idea per spread) | Tables, dashboards, lists you scan |
| Reading one long thing: a review, a recap, a report | Anything real-time or needing quick comparison |
| A year-in-review or a "wrapped" summary | Forms with more than ~6 fields (use the Modal or a page) |
| Chapters of one person's or one thing's content | Search results, catalogues |

Intensity: **Low** never uses it. **Medium** uses it for at most one flow, opened from the normal UI (e.g. "Read Kavya's 2026 in books →"). **High** can use it as the main structure.

## Anatomy

```tsx
import { Book, Spread, Page } from '../../../design-system';

<Book>                                            // chapter tabs on top (contents), arrows, swipe
  <Spread title="Reading now"
    left={<Page side="left" kicker="Chapter one · Reading now" folio={1}>
      <h2 className="ds-h2">Piranesi</h2>
      <p className="ds-tagline">Page 142 of 245.</p>
    </Page>}
    right={<Page side="right" kicker="Notes" folio={2}>…</Page>} />
  <Spread title="Shelves" left={…} right={…} />
</Book>
```

- **One idea per spread.** The left page introduces it (kicker, serif title, standfirst, maybe a portrait or cover). The right page holds the detail (list, quote, stats, a form). That is how the portfolio's About page reads.
- **Running head:** a `ds-kicker` with the chapter name. **Folio:** the page number, in serif italic at the outer bottom corner.
- **Navigation:** "← Flip back" (ghost) on the left page and "Next →" on the right. There is no primary button unless the spread's job is an action (then the primary goes on the right page). Chapter tabs above the book act as the contents. Arrow keys turn pages; swipe on touch.
- **Size:** about 1120px wide, `min(78vh, 720px)` tall. Content that overflows a page scrolls inside the page; prefer moving it to the next spread.
- **Surroundings:** the book sits on Night with the backdrop (`Surface tone="night" backdrop` or `ds-washi`) and Elevation 4. Never put a book on Paper.
- **Phones (< 900px):** one page at a time, stacked, with a dashed tear line between left and right, no folios, and the turn becomes a fade.
- **Reduced motion:** no leaf turn; the content swaps.

## If `Book` is not in your design-system yet

It ships in this skill under `drop-in/design-system/` (`components/Book.tsx`, `styles/book.css`, `styles/washi.css`, the fibre textures). Copy those into `design-system/`, export `Book, Spread, Page` from `components/index.ts`, and import `book.css` and `washi.css` in `design-system/index.ts` after `components.css`. Maintainers then run `sync-bundle.mjs`.
