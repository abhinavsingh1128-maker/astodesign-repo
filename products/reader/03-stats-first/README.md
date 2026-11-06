# Reader 03: stats first

**Idea:** Stats first: the challenge ring and charts lead, with shelves and reviews underneath

**Intensity:** Medium (assumed: not stated in this brief; the default, and what the previous reader brief used)

**Reference:** none. Device assumed: both, desktop first.

**Mode:** VARIANT of the profile and media-library archetypes in `translate-a-product.md`. One axis changed: what comes first. No reader `00-parity` layout exists, because the brief asked for this layout only.

**Shape:** Night page with a bar Nav and container: profile header, stats, reading-now cards, shelf tabs over a Paper-tile cover grid, Paper reviews panel.

## Anatomy

| Region | Objects | Actions | States |
| --- | --- | --- | --- |
| Nav | brand, Home, My Books, Browse and Community menus, search, 4 inboxes with counts, profile menu | jump, search shelves, open panels (rows only show a toast) | current (gold), phone menu |
| Profile | avatar, name, counts | Add a book (primary) | |
| Stats | ring, pace line, 2 bar charts, 4 figures | switch year | current month (gold), ahead or behind pace |
| Reading now | 3 cards with cover, progress, page | Update | |
| Shelves | 4 tabs with counts, search, sort, view, genre chips, result count, 31 books | switch, filter live, open a book | current tab (gold), pressed chip (lacquer), favourite tag, empty result |
| Reviews | 5 reviews with cover, stars, text, likes | filter by rating, like, open a book | liked (lacquer), empty result |
| Click only | book modal (shelf, page, rating, review, favourite), add modal, Toast | save, cancel | inline error |

## Must-keep

- [x] Avatar, name, bio line and stats — `xre03-me`, `Avatar`
- [x] Challenge progress against a goal — `Ring`
- [x] Reading stats that follow the data — `Bars`, `xre03-figures`
- [x] Reading now with progress — `Progress`
- [x] Shelves with counts — `Tabs`, `counts`
- [x] Wall of covers at real density — `CoverTile`, `xre03-grid`
- [x] Search, sort and view toggle — `Search this shelf`, `xre03-select`, `Segmented`
- [x] Genre filters that apply live — `pressed`
- [x] List view — `Table`
- [x] Reviews with rating, text and likes — `xre03-rev`, `Stars`
- [x] Update progress and rate a book — `Modal`, `xre03-star`
- [x] Empty results offer the fix — `Clear all filters`

## Translation

- brand-colour add button → the ink pill, once per view
- star ratings → lacquer `★` on Paper, always with an accessible number
- cover art → `CoverTile src` from Open Library, pigment and serif title when a book has none
- current shelf underline → gold `Tabs`

## Surfaces

Night: page, nav, stats, section heads. Paper: reading cards, book tiles, reviews, modals.

## New patterns

- Stat figures (`.xre03-figures`): label over sans tabular number, hairline above. Tokens: `--type-heading-3-size`, `--border-subtle`.
- Motif: the moon `Ring`, doing the challenge. Empty states are plain text so only one moon shows.

## Kept / changed / dropped

- Kept: profile, reading now, shelves, covers, reviews, list view.
- Changed: stats moved from a sidebar widget to the top of the page; reading now sits below them.
- Dropped: activity feed, friends list, pinned items, follow and message buttons (this is your own profile). Follower numbers are static sample figures. The Book display is unused.

## Gives up

Covers, the most personal part of a reader's profile, start below the fold, and a visitor sees numbers before taste. Someone with few books gets sparse charts. Added books always go to Want to read as Fiction, and nothing persists on refresh.

## System tension

- `Ring`, `Bars` and `Progress` are all gold for the current item, while the skill's colour table says the "now" bar in a chart is sakura. Followed the component.
- `Modal` does not trap Tab; handled in this layout. It has no way to show a cover beside the title.
- `CoverTile` has fixed widths, so tiles centre a 120px cover rather than filling the column.
- No `Select` or rating component; used the `patterns.md` select and `.xre03-star`.
- `CoverTile` sets its byline at 9px at every size, and its title under 10.5px at size s, both below the type minimum. Used size m with no byline; the author sits on the Paper block, so covers show the title only.
- `ds-reaction` is 28px tall; raised to 32px on phones here.
- Cover images: the skill bans real cover art, but the owner asked for Open Library covers on this layout, so this is a deliberate exception. Images are copied from Open Library into `products/reader/covers/` and served from this site. Many are copyrighted editions, so check rights before wider use.
- `Nav` items have no dropdown or `aria-expanded`, so the shared `products/reader/ReaderNav.tsx` opens panels beside it, on click only.
