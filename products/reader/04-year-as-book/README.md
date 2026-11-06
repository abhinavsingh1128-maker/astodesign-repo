# Reader 04: year as book

**Idea:** The profile is an open book: a year of reading told spread by spread

**Intensity:** Medium (assumed: not set in this request; the default)

**Reference:** none. Device assumed: both, desktop first.

**Mode:** VARIANT of the profile and media library archetype. One axis changed: the structure: a year told in sequence, using the system signature.

**Shape:** Night page with the full nav, one open Book of four spreads.

## Anatomy

| Region | Objects | Actions | States |
| --- | --- | --- | --- |
| Profile on the frontispiece | sample data | see Must-keep | |
| Reading now with progress | sample data | see Must-keep | |
| Challenge ring | sample data | see Must-keep | |
| Stats | sample data | see Must-keep | |
| Page turns and chapters | sample data | see Must-keep | |
| Shelves with counts | sample data | see Must-keep | |
| Covers | sample data | see Must-keep | |
| Shelf paging | sample data | see Must-keep | |
| Reviews | sample data | see Must-keep | |
| Search jumps to shelves | sample data | see Must-keep | |

## Must-keep

- [x] Profile on the frontispiece — `Avatar`
- [x] Reading now with progress — `Progress`
- [x] Challenge ring — `Ring`
- [x] Stats — `Bars`
- [x] Page turns and chapters — `Book`
- [x] Shelves with counts — `Tabs`
- [x] Covers — `CoverTile`
- [x] Shelf paging — `More books`
- [x] Reviews — `xre04-rev`
- [x] Search jumps to shelves — `onQuery`

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
- Changed: the structure: a year told in sequence, using the system signature.
- Dropped: add channel, huddles and slash commands, follow actions and the activity feed. Nothing persists on refresh.

## Gives up

Slow to scan: nothing is more than a spread or two away, but you cannot see it all at once. Few covers fit per leaf.

## System tension

- `Message`, `Modal` and `AppShell` needed the same scoped fixes as earlier layouts (Tab trap, phone rail shadow, tighter messages). Covers use Open Library images, an owner-approved exception to the rule on real cover art, and `CoverTile` text sizes stay below the minimum without them at small sizes.
