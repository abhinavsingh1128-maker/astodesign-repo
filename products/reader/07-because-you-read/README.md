# Reader 07: because you read

**Idea:** Because you finished: each book you loved leads to the unread books it points to, with a line from each.

**Intensity:** Low (asked earlier in this session; reused for this set). Main device: desktop only (asked). The 390px view passes the screenshot check but was not reviewed.

**Reference:** none (asked). Structure comes from the reader-profile archetype, reframed around one job: getting Kavya to open a book she has not read.

**Mode:** VARIANT (the order is your own history)

**Shape:** Shared frame; one row per finished book (her cover, rating and review line on the left, up to four recommended cards on the right), then "Your reading" full width.

## Anatomy

| Region | Objects | Actions | States |
| --- | --- | --- | --- |
| Header | kicker + title, top pick line, the one primary | Start the top pick | top pick = first book of the highest-rated row |
| Row: you finished | cover, title, stars, her review line | none | ordered by rating |
| Row: recommendations | shortest strong line, cover, title, author, pages, citation | Save for later (secondary) | Saved; Toast confirms |
| Your reading | reading now, ring | none | none |

## Must-keep

- [x] The reason is visible: the book you finished — `xre07-from`
- [x] Your own rating and review line — `FINISHED`
- [x] A line from each recommended book — `xre07-rec__quote`
- [x] Cover and title for each — `CoverTile`
- [x] One primary: start the top pick — `Button variant="primary"`
- [x] Save without leaving — `Save for later`
- [x] Reading now and ring — `YourReading`
- [x] Citation for every line — `cite`

## Translation

- Goodreads-style recommendation rows → Paper cards and rows with `CoverTile`; covers are pigment tiles, never real cover art
- Want-to-read button → `Button variant="secondary"` on every item, never primary
- Reading challenge widget → `Ring` in the shared panel

## Surfaces

Night: the nav strip only. Paper: the page, every card and panel. Paper grain only (Low).

## Content

Quotes and data live in `products/reader/_shared/books.ts`, shared by layouts 04–09. Every quote is public-domain text published before 1929; the Anna Karenina and Crime and Punishment lines are Constance Garnett's translations (1901, 1914) and Monte Cristo is the anonymous 1846 translation, credited on the page. Quotes were typed from memory: check them against an edition before shipping. Hooks, ratings, reviews, page counts and the 40-pages-an-hour pace are sample content, marked on the page. Screenshots were taken offline, so the serif is Georgia, not Cormorant Garamond.

## System tension

- `CoverTile` titles drop below 10.5px when a cover is narrower than about 81px, so small covers here are 88px or wider. Bylines are hidden on covers under 120px (scoped) because they render at 9px.
- Shared frame (`_shared/frame.tsx`, prefix `.xrs-`) holds the nav, the "Your reading" panel and Save for later so the six layouts stay comparable. The checker only reads each layout's own files.

## New patterns

- Quotes under 90 characters are set one step larger, so short lines don't look lost.

## Kept / changed / dropped

- Kept: Reviews (as the reason for each row), reading now, ring.
- Changed: Recommendations are grouped by the book that caused them.
- Dropped: Shelf tabs and cover grid.

## Gives up

Long page (six rows, 18 cards), and it only works once a reader has finished and rated books. A new reader would see nothing.
- Added later: Open Library cover images and the shared full nav (`products/reader/ReaderNav.tsx`), both as asked for the earlier reader layouts.
