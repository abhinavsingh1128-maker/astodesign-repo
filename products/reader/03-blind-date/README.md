# Reader 03: blind date

**Idea:** Judge a book by one line: every card flips to reveal the book, and your profile and books sit below.

**Intensity:** Medium (assumed: the page now follows Stats first, which used Medium). Device: both, desktop first (assumed).

**Reference:** none (asked). Structure comes from the reader-profile archetype, reframed around one job: getting Kavya to open a book she has not read.

**Mode:** VARIANT (the unit is a line, not a book)

**Shape:** Night page styled after Stats first: full nav, profile header, nine flip cards, then My books (challenge, chart, figures, reading now, shelves) and reviews.

## Anatomy

| Region | Objects | Actions | States |
| --- | --- | --- | --- |
| Nav | Home, My Books, Browse, Community, search, 4 inboxes, profile | open menus, search shelves | current (gold) |
| Profile | avatar, name, counts | | |
| Blind date | 9 cards with one line, mood, pages; count revealed | deal, reveal, flip back, add to my list | flipped, on my list |
| My books | ring, month chart, figures, reading now, shelf tabs, covers | switch shelf | empty shelf, empty search |
| Reviews | 5 reviews with stars | | |

## Must-keep

- [x] Lines with the book hidden, all one text size — `xre04-line`
- [x] Card flips to reveal the book — `xre04-flip`
- [x] Cover, stars and likes on the back — `CoverTile`, `Stars`, `likesOf`
- [x] Add to my list — `toggleList`
- [x] Deal new lines — `deal`
- [x] Profile identity and counts — `xre04-me`, `Avatar`
- [x] Challenge and stats — `Ring`, `Bars`, `xre04-figs`
- [x] Reading now with progress — `Progress`
- [x] Shelves with counts, including My list — `Tabs`, `xre04-shelf`
- [x] Reviews — `xre04-revs`

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

- Kept: Reading now, challenge ring, save to want to read.
- Changed: The page leads with nine hidden-title lines instead of one passage.
- Dropped: Shelves grid and reviews (they live on 03 and My books).

## Gives up

You can't scan by title or author, and a revealed card grows taller than its neighbours. It's a game for browsing, not for finding a known book.
- Added later: Open Library cover images and the shared full nav (`products/reader/ReaderNav.tsx`), both as asked for the earlier reader layouts.
- Changed after review: no quote on the back of the card, one text size for every line, and My books added. Stars and likes on the back are sample figures derived from the title.
