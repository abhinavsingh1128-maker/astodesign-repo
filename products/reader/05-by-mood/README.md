# Reader 05: by mood

**Idea:** Pick a mood on the rail and read one line from each book that fits it.

**Intensity:** Low (asked earlier in this session; reused for this set). Main device: desktop only (asked). The 390px view passes the screenshot check but was not reviewed.

**Reference:** none (asked). Structure comes from the reader-profile archetype, reframed around one job: getting Kavya to open a book she has not read.

**Mode:** VARIANT (the order is mood)

**Shape:** `AppShell` with a Night `Rail` (moods with counts), a Paper main column of quote rows, and "Your reading" in the aside (hidden under 1100px).

## Anatomy

| Region | Objects | Actions | States |
| --- | --- | --- | --- |
| Rail | 5 moods with counts, Your shelves | pick a mood (applies at once) | current mood = gold bar |
| Header | kicker + mood, the one primary | Surprise me | picked row gets a gold inset bar and "Tonight's pick" |
| Rows | line, citation, cover, title, pages, hook | Another line from it (ghost), Save for later (secondary) | line fades in on change |
| Aside | Your reading | none | none |

## Must-keep

- [x] Moods as navigation with counts — `RailItem`
- [x] Rail becomes a sheet on small screens — `AppShell`
- [x] One line per book, more on request — `Another line from it`
- [x] Cover and hook beside each line — `CoverTile`
- [x] One primary: Surprise me — `Surprise me`
- [x] The picked book is marked as current — `is-pick`
- [x] Save without leaving — `Save for later`
- [x] Reading now and ring — `YourReading`
- [x] Citation for every line — `cite`

## Translation

- Goodreads-style recommendation rows → Paper cards and rows with `CoverTile`; covers are pigment tiles, never real cover art
- Want-to-read button → `Button variant="secondary"` on every item, never primary
- Reading challenge widget → `Ring` in the shared panel

## Surfaces

Night: the nav strip only and the rail. Paper: the page, every card and panel. Paper grain only (Low).

## Content

Quotes and data live in `products/reader/_shared/books.ts`, shared by layouts 04–09. Every quote is public-domain text published before 1929; the Anna Karenina and Crime and Punishment lines are Constance Garnett's translations (1901, 1914) and Monte Cristo is the anonymous 1846 translation, credited on the page. Quotes were typed from memory: check them against an edition before shipping. Hooks, ratings, reviews, page counts and the 40-pages-an-hour pace are sample content, marked on the page. Screenshots were taken offline, so the serif is Georgia, not Cormorant Garamond.

## System tension

- `CoverTile` titles drop below 10.5px when a cover is narrower than about 81px, so small covers here are 88px or wider. Bylines are hidden on covers under 120px (scoped) because they render at 9px.
- Shared frame (`_shared/frame.tsx`, prefix `.xrs-`) holds the nav, the "Your reading" panel and Save for later so the six layouts stay comparable. The checker only reads each layout's own files.

## New patterns

- Quotes under 90 characters are set one step larger, so short lines don't look lost.

## Kept / changed / dropped

- Kept: Reading now, challenge ring, shelf counts in the rail.
- Changed: Navigation is by mood; the passage page is replaced by a list of lines.
- Dropped: Cover grid and reviews.

## Gives up

One mood at a time: you can't compare an eerie book with a tender one without switching. Mood labels are editorial and can feel wrong for a book.
- Added later: Open Library cover images and the shared full nav (`products/reader/ReaderNav.tsx`), both as asked for the earlier reader layouts.
