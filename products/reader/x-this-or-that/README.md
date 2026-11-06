# Reader 09: this or that

> Extra, not one of the final six. Kept as an earlier test.

**Idea:** This or that: two unnamed passages at a time, keep the one you'd read on, until one book is left.

**Intensity:** Low (asked earlier in this session; reused for this set). Main device: desktop only (asked). The 390px view passes the screenshot check but was not reviewed.

**Reference:** none (asked). Structure comes from the reader-profile archetype, reframed around one job: getting Kavya to open a book she has not read.

**Mode:** VARIANT (who acts first: you choose, then the book is named)

**Shape:** Shared frame; two Paper passage cards side by side for 7 rounds, then a winner panel, a list of the books you passed, and "Your reading" full width.

## Anatomy

| Region | Objects | Actions | States |
| --- | --- | --- | --- |
| Header | kicker + title, round counter, progress | none | Round 3 of 7; Finished |
| Duel | two unnamed lines with page counts | I'd read on (secondary, one each); ← and → keys | winner stays, the other is passed |
| Winner | cover, title, line, hook, the one primary | Start reading, Save for later, Play eight more | shows after round 7 |
| Passed | titles you passed on | Save anyway (ghost) | grows each round |
| Your reading | reading now, ring | none | none |

## Must-keep

- [x] Two passages with no titles — `xre09-duel`
- [x] Choose with a click or the arrow keys — `ArrowLeft`
- [x] Progress through the rounds — `Progress`
- [x] Winner named with cover and hook — `CoverTile`
- [x] One primary at the end: Start reading — `Start reading`
- [x] Nothing is lost: passed books stay listed — `xre09-passed`
- [x] Save without leaving — `Save anyway`
- [x] Reading now and ring — `YourReading`
- [x] Citation for the winning line — `cite`

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

- Kept: Reading now, ring, save to want to read.
- Changed: Discovery is a sequence of choices instead of a page to browse.
- Dropped: Cover grid and reviews.

## Gives up

Seven clicks before you learn a title, and the winner can depend on the order of the pairs. Fun once or twice a week, tiring as a daily home page.
- Added later: Open Library cover images and the shared full nav (`products/reader/ReaderNav.tsx`), both as asked for the earlier reader layouts.
