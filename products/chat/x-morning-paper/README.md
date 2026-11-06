# Chat 04: morning paper

> Extra, not one of the final six. Kept as an earlier test.

**Idea:** The workspace arrives as a morning edition: headlines first, replies on every story

**Intensity:** Medium (assumed: not set in this request; the default)

**Reference:** none. Device assumed: both, desktop first.

**Mode:** VARIANT of the team chat archetype. One axis changed: the moment: catching up after being away.

**Shape:** AppShell with a channel rail, Paper newspaper grid with a masthead and a lead story.

## Anatomy

| Region | Objects | Actions | States |
| --- | --- | --- | --- |
| Channels with unread counts | sample data | see Must-keep | |
| Masthead with date | sample data | see Must-keep | |
| Lead story and columns | sample data | see Must-keep | |
| Headlines in serif | sample data | see Must-keep | |
| Unread and read states | sample data | see Must-keep | |
| Read state in lacquer | sample data | see Must-keep | |
| Thread opens in place | sample data | see Must-keep | |
| Composer on each story | sample data | see Must-keep | |
| One primary action | sample data | see Must-keep | |
| All caught up state | sample data | see Must-keep | |

## Must-keep

- [x] Channels with unread counts — `ChatRail`
- [x] Masthead with date — `xch04-mast`
- [x] Lead story and columns — `xch04-grid`
- [x] Headlines in serif — `ds-h3`
- [x] Unread and read states — `Segmented`
- [x] Read state in lacquer — `variant="selected"`
- [x] Thread opens in place — `Talk`
- [x] Composer on each story — `Composer`
- [x] One primary action — `variant="primary"`
- [x] All caught up state — `EmptyState`

## Translation

- brand-colour button → the ink pill, one per view
- current item → gold; selected or done → lacquer; unread or new → sakura
- icons → text labels, except the shared rail

## Surfaces

Night: rail. Paper: main column, aside, sheets.

## New patterns

- Prefixed classes in `styles.css`, tokens only; shared pieces in `products/chat/kit`.

## Kept / changed / dropped

- Kept: the archetype's core regions.
- Changed: the moment: catching up after being away.
- Dropped: add channel, huddles and slash commands . Nothing persists on refresh.

## Gives up

Bad for live back-and-forth, since it reads as a digest. Headlines are written by hand here; a real product would have to generate them and could get them wrong.

## System tension

- `Message`, `Modal` and `AppShell` needed the same scoped fixes as earlier layouts (Tab trap, phone rail shadow, tighter messages).
