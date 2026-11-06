# Reader 02: cover wall

**Idea:** A wall of covers grouped by shelf, with reading now on top

**Intensity:** Medium (assumed: not set in this request; the default)

**Reference:** none. Device assumed: both, desktop first.

**Mode:** VARIANT of the profile and media library archetype. One axis changed: density: covers are the page.

**Shape:** AppShell with a shelf rail, Night wall of covers, Paper details in the aside or a sheet.

## Anatomy

| Region | Objects | Actions | States |
| --- | --- | --- | --- |
| Rail | Shiori, search, you, Discover links, inbox, shelves with counts, reviews, challenge ring | search, filter, open stubs | current (gold), inbox counts (sakura) |
| Wall | reading now with progress, sort, covers by shelf | pick a cover, sort | selected (lacquer), empty result |
| Reviews view | 5 reviews with covers and stars | pick a cover | |
| Details (sheet at 1100px and below) | cover, likes, community and own rating, shelf, time to read, tags, friends, progress, review | like | liked |

## Must-keep

- [x] Shelves with counts — `RailItem`
- [x] Reading now on top — `xre05-now`
- [x] Wall of covers — `xre05-covers`
- [x] Progress — `Progress`
- [x] Search and site links in the left rail — `Search books`, `Discover`, `Recommendations`, `Community`
- [x] Sort — `Segmented`
- [x] Book details: likes, rating, tags, friends, time to read — `xre05-detail`, `likesOf`, `tagsOf`, `friendsOf`, `xre05-facts`
- [x] Challenge in the rail — `Ring`
- [x] Reviews view — `xre05-revs`
- [x] Empty result — `EmptyState`

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
- Changed: density: covers are the page.
- Dropped: add channel, huddles and slash commands, follow actions and the activity feed. Nothing persists on refresh.

## Gives up

Numbers and writing take a back seat, and book names are hidden until you pick a cover on those with images.

## System tension

- `Message`, `Modal` and `AppShell` needed the same scoped fixes as earlier layouts (Tab trap, phone rail shadow, tighter messages). Covers use Open Library images, an owner-approved exception to the rule on real cover art, and `CoverTile` text sizes stay below the minimum without them at small sizes.

Community figures (likes, community rating, friends) are sample data derived from each title. Browse genres, Community, Discussions and the inbox items only show a toast.
