# Reader 08: by time

**Idea:** How long have you got? Choose an evening, a weekend, a week or a season, and get books that fit.

**Intensity:** Low (asked earlier in this session; reused for this set). Main device: desktop only (asked). The 390px view passes the screenshot check but was not reviewed.

**Reference:** none (asked). Structure comes from the reader-profile archetype, reframed around one job: getting Kavya to open a book she has not read.

**Mode:** VARIANT (the unit is the time you have)

**Shape:** Shared frame; a centred question with a `Segmented` control, one lead book on a large Paper panel, a ruled list of the rest, then "Your reading" full width.

## Anatomy

| Region | Objects | Actions | States |
| --- | --- | --- | --- |
| Question | kicker + title, 4 time slots with counts, pace note | choose a slot (applies at once) | selected slot = lacquer |
| Lead | time label, the line, citation, cover, title, hook, the one primary | Start reading, Save for later (ghost) | shortest book in the slot; fades in on change |
| List | reading time, line, title, author, mood | Save for later (secondary) | sorted by length |
| Your reading | reading now, ring | none | none |

## Must-keep

- [x] Choose by the time you have — `Segmented`
- [x] Reading time in hours and evenings at your pace — `PAGES_PER_HOUR`
- [x] One book leads, with its strongest line — `xre08-lead`
- [x] One primary: Start reading — `Start reading`
- [x] The rest in a quiet list — `xre08-list`
- [x] Mood on every book — `Tag`
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

- Kept: Reading now, ring, save to want to read.
- Changed: The first question is time, not taste.
- Dropped: Cover grid and reviews.

## Gives up

Length decides before taste does, so the best match for her mood may sit in another slot. The pace is one sample number, not measured.
- Added later: Open Library cover images and the shared full nav (`products/reader/ReaderNav.tsx`), both as asked for the earlier reader layouts.
