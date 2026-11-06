# Reader 07: taste map

> Extra, not one of the final six. Kept as an earlier test.

**Idea:** A map of your taste: every book plotted by length and rating

**Intensity:** Medium (assumed: not set in this request; the default)

**Reference:** none. Device assumed: both, desktop first.

**Mode:** VARIANT of the profile and media library archetype. One axis changed: the main object is the pattern across books.

**Shape:** Night page with the full nav, a rating-by-length grid of covers beside a Paper detail card, profile content below.

## Anatomy

| Region | Objects | Actions | States |
| --- | --- | --- | --- |
| Headline computed from ratings | sample data | see Must-keep | |
| Covers placed by rating and length | sample data | see Must-keep | |
| Genre filters | sample data | see Must-keep | |
| Live count | sample data | see Must-keep | |
| Book detail | sample data | see Must-keep | |
| Reading now | sample data | see Must-keep | |
| Challenge | sample data | see Must-keep | |
| Shelves | sample data | see Must-keep | |
| Reviews | sample data | see Must-keep | |
| Empty filter | sample data | see Must-keep | |

## Must-keep

- [x] Headline computed from ratings — `xre07-sub`
- [x] Covers placed by rating and length — `xre07-pin`
- [x] Genre filters — `pressed`
- [x] Live count — `xre07-count`
- [x] Book detail — `xre07-card`
- [x] Reading now — `Progress`
- [x] Challenge — `Ring`
- [x] Shelves — `Tabs`
- [x] Reviews — `xre07-revs`
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
- Changed: the main object is the pattern across books.
- Dropped: add channel, huddles and slash commands, follow actions and the activity feed. Nothing persists on refresh.

## Gives up

Unrated books are off the map, and the insight is thin with few ratings. It is a little analytical for someone who just wants to show their taste.

## System tension

- `Message`, `Modal` and `AppShell` needed the same scoped fixes as earlier layouts (Tab trap, phone rail shadow, tighter messages). Covers use Open Library images, an owner-approved exception to the rule on real cover art, and `CoverTile` text sizes stay below the minimum without them at small sizes.
