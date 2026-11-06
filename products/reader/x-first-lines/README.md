# Reader 06: first lines

> Extra, not one of the final six. Kept as an earlier test.

**Idea:** A ledger of first lines: scan the opening sentence of every recommended book, open the one that hooks you.

**Intensity:** Low (asked earlier in this session; reused for this set). Main device: desktop only (asked). The 390px view passes the screenshot check but was not reviewed.

**Reference:** none (asked). Structure comes from the reader-profile archetype, reframed around one job: getting Kavya to open a book she has not read.

**Mode:** VARIANT (the density is scan-many)

**Shape:** Shared frame; a sortable Paper `Table` of first lines with a sticky detail panel and "Your reading" on the right.

## Anatomy

| Region | Objects | Actions | States |
| --- | --- | --- | --- |
| Toolbar | length filter, count | Any length / Under 300 / 300–600 / 600+ (applies at once) | count updates |
| Table | first line, book and author, pages | sort by book or pages; click a row | selected row = gold bar |
| Detail | cover, title, mood and pages tags, hook, a second line, reading time, the one primary | Read on, Save for later (secondary) | follows the selected row |
| Your reading | reading now, ring | none | none |

## Must-keep

- [x] Every book's first line in one scannable list — `Table`
- [x] Sort by pages or title — `onSort`
- [x] Filter by length, live — `Segmented`
- [x] Selected row is current — `selectedKey`
- [x] Detail with cover, hook and a second line — `xre06-more`
- [x] Reading time at your pace — `hours`
- [x] One primary: Read on — `Read on`
- [x] Save without leaving — `Save for later`
- [x] Reading now and ring — `YourReading`

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
- Changed: One passage at a time becomes 17 first lines at once.
- Dropped: Cover grid and reviews; Monte Cristo has no first line in the data, so it isn't listed.

## Gives up

Opening lines aren't always a book's best line (Dracula opens on a train timetable). Dense and text-heavy, so it suits readers who like to compare, less those who want to be swept up.
- Added later: Open Library cover images and the shared full nav (`products/reader/ReaderNav.tsx`), both as asked for the earlier reader layouts.
