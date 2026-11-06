# Reader 06: reading diary

> Extra, not one of the final six. Kept as an earlier test.

**Idea:** A reader's year as a dated diary: what you read, when, and what you thought

**Intensity:** Medium (assumed: not set in this request; the default)

**Reference:** none. Device assumed: both, desktop first.

**Mode:** VARIANT of the profile and media library archetype. One axis changed: the unit is a dated entry.

**Shape:** Night page with a sticky stats column beside a long Paper diary.

## Anatomy

| Region | Objects | Actions | States |
| --- | --- | --- | --- |
| Profile | sample data | see Must-keep | |
| Today and reading now | sample data | see Must-keep | |
| Write a line | sample data | see Must-keep | |
| Entries by month | sample data | see Must-keep | |
| Reviews inside entries | sample data | see Must-keep | |
| Challenge | sample data | see Must-keep | |
| Month chart | sample data | see Must-keep | |
| Jump to a month | sample data | see Must-keep | |
| Next-up shelves | sample data | see Must-keep | |
| Empty filter | sample data | see Must-keep | |

## Must-keep

- [x] Profile — `Avatar`
- [x] Today and reading now — `xre06-today`
- [x] Write a line — `Add line`
- [x] Entries by month — `xre06-month`
- [x] Reviews inside entries — `xre06-review`
- [x] Challenge — `Ring`
- [x] Month chart — `Bars`
- [x] Jump to a month — `xre06-months`
- [x] Next-up shelves — `Tabs`
- [x] Empty filter — `Clear all filters`

## Translation

- brand-colour button → the ink pill, one per view
- current item → gold; selected or done → lacquer; unread or new → sakura
- icons → text labels, except the shared nav

## Surfaces

Night: page, nav, stats. Paper: anything read, plus modals.

## New patterns

- Prefixed classes in `styles.css`, tokens only; shared pieces in `products/reader/kit`.

## Kept / changed / dropped

- Kept: the archetype's core regions.
- Changed: the unit is a dated entry.
- Dropped: add channel, huddles and slash commands, follow actions and the activity feed. Nothing persists on refresh.

## Gives up

Browsing by shelf is secondary, and books only appear by when they were finished. Dates are by month in this sample data.

## System tension

- `Message`, `Modal` and `AppShell` needed the same scoped fixes as earlier layouts (Tab trap, phone rail shadow, tighter messages). Covers use Open Library images, an owner-approved exception to the rule on real cover art, and `CoverTile` text sizes stay below the minimum without them at small sizes.
