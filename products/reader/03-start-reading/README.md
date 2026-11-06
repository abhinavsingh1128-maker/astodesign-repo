# Reader 03: start reading

**Idea:** The home page opens on a powerful quote from a book picked for the reader that they have not read. The excerpt leads on a Paper page, with the cover and a quiet Keep reading button beside it ("keep reading" = read on past the teaser). Reading-now, shelves (Recommended first) and a small stats section sit in a quieter strip below.

**Intensity:** Low (asked: you chose it). Main device: desktop only (asked). No reference (asked). The responsive CSS from the first pass is still there but the 390px view was not reviewed or tuned.

**Reference:** none (asked). Structure comes from the profile and library archetype in `references/translate-a-product.md` (avatar and name, currently-reading strip, shelves with covers, reviews, a reading challenge).

**Mode:** DERIVE from the profile archetype, as a VARIANT idea (the main object is a passage, not the shelf). No `00-parity-*` layout exists for this product, so the must-keep list below comes from the archetype.

**Shape:** Paper page (`Surface tone="paper"`), with Night only on the top strip that holds `Nav layout="bar"`, then `ds-container`. No rail. A raised Paper page holds the excerpt, with the cover and a Paper info block beside it.

## Anatomy

| Region | Objects | Actions | States |
| --- | --- | --- | --- |
| Nav bar | brand, 4 links, search, avatar | go to a section; filter shelves by search | Home is current (gold underline) |
| From a book picked for you | quote (all sans; short quotes set larger), citation with "public domain, year" and translator when there is one, passage counter | Another book, Next passage | passage 1 of 10; fades in on change |
| Cover and info | cover, title, author, pages, why it was recommended ("You finished Jane Eyre"), the one primary button | Keep reading, Save for later (secondary) | Save for later becomes "Saved to want to read", the book leaves Recommended and joins Want to read, and a Toast confirms |
| Profile line | avatar, name, tagline, two tags | none | counts computed from the data (35 books) |
| Reading now | cover, title, author, progress with percentage, page x of y | Resume (secondary) | 3 books in progress |
| Shelves | tabs with counts (Recommended, Reading now, Want to read, Read in 2026), cover grid | switch tab; on Recommended, click a cover to open its passage on the page | opens on Recommended; empty result: message and Clear search; search filters the grid |
| This year | moon ring, read / reading / waiting numbers, pace line | none | 18 of 24; "2 books behind the pace of 20" computed from the day of the year |
| Reviews | 3 reviews: stars as text, one-line title, body, book | none | none |

## Must-keep

- [x] A quote from an unread, recommended book on a Paper page that leads the screen — `Surface`
- [x] A way to see the next passage — `Next passage →`
- [x] A way to switch to another book — `Another book`
- [x] The book's cover next to the passage — `CoverTile`
- [x] One quiet primary action (Keep reading) and a secondary Save for later — `Button variant="primary"`
- [x] Why this book was recommended — `WHY`
- [x] Saved-confirmation — `Toast`
- [x] Reading-now with progress per book — `Progress`
- [x] Shelves with counts, Recommended first, and enough covers to look real — `Tabs`
- [x] A reading challenge — `Ring`
- [x] Reviews with ratings — `ds-h4`
- [x] Search across the shelves — `Input`
- [x] Empty state when the search matches nothing — `EmptyState`
- [x] Profile identity — `Avatar`

## Translation

- Goodreads-style "Currently reading" list → Paper panel with `CoverTile`, `Progress`, one secondary `Button` per row
- Shelf tabs (Want to read, Read) → `Tabs` with counts
- Reading challenge widget → `Ring`. Low allows no motifs, but you asked for the challenge ring, so it stays as a small progress chart in a panel and nothing else is decorative
- Review cards → Paper `Surface`, serif title, sans body
- Page-turn feel → a single Paper page with folio ("Passage 1 of 8") and a ghost foot; no `Book` (Low never uses it)

## Surfaces

Night: the nav strip only. Paper: the page, the excerpt page (raised), the cover info block, every panel and review. Paper grain only; Night fibres are off at Low.

## New patterns

- Excerpt page: a raised Paper `Surface` (`--bg-raised`) with a `ds-label` head, folio, the passage in sans at `--type-heading-4-size`, citation in `ds-body-s` italic, and a ghost foot. Tokens only.
- "Another book" jumps to the next passage from a different book; "Next passage" goes to the next passage in order, which may be the same book.
- Recommendation line under the cover: always names a book the reader has finished (sample logic, hand-written in `WHY`).
- Save for later moves a book from Recommended to Want to read; counts and the ring's "Waiting" number are computed.

## Kept / changed / dropped

- Kept: currently-reading strip with progress, shelves with counts, challenge ring, reviews, search.
- Changed: the excerpt is the first thing on the page and the shelf is below it; the profile header is a quiet line, not the hero.
- Dropped: follow and message actions, friends' activity feed, recommendations. They don't serve "make people want to read this book".

## Low intensity: what was dropped from the Medium pass

- Section kickers (only the page title "Kavya Reddy" keeps one), the serif opening line of each passage, the tagline, serif stat numbers, Night page and Night fibres.

## Gives up

Browsing is slower than on a shelf-first page. Finding a specific book means scrolling past the page. Only recommended books have a passage; covers on the other shelves do nothing when clicked.

## System tension

- Bylines on 120px covers render at 9px, below the 10.5px minimum. Hidden with a scoped override (`.xre03-covers`, `.xre03-now`); the author stays in the cover's accessible label and next to it in Reading now. Suggested fix in the system: `CoverTile size="m"` should hide or enlarge the byline.
- `CoverTile size="s"` (72px) puts the title at 9.4px, so the layout uses `size="m"` for reading-now and shelves.
- `components.md` describes `Card` with `summary`, `variant="note"` and `cover`; the bundled `Card` has no `summary` prop and no note variant. Reviews are Paper `Surface` blocks instead.

## Content

All 10 passages come from 8 books the reader has not read, all public domain and published before 1929: Frankenstein (1818, two passages), Wuthering Heights (1847, two), Anna Karenina (1878, Constance Garnett's 1901 translation), Great Expectations (1861), Alice's Adventures in Wonderland (1865), A Tale of Two Cities (1859), Heart of Darkness (1899), Treasure Island (1883). "Next passage" steps through the list in order, so it can land on another book. The reader, the recommendations, the reviews and the page counts are sample content, marked on the page. Passages were typed from memory, so check them against an edition before shipping. Fonts: Cormorant Garamond loads from Google Fonts, and screenshots taken offline fall back to Georgia.

## Added after v3

- Cover images from Open Library, hosted in `products/reader/covers/` at the owner's request, an exception to the skill's ban on real cover art. Many are copyrighted editions.
- Shared full nav, `products/reader/ReaderNav.tsx`: menus, search and inboxes use sample content, and their rows only show a toast.
- Keep reading opens this book's passages in a read-only `Modal`, and Resume shows a toast, so neither is a dead link. The cover is centred over its info card.
