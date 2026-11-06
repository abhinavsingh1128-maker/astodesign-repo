# Chat 06: day river

**Idea:** The day is a timeline: conversations sit at the hour they happened, with now marked

**Intensity:** Medium (assumed: not set in this request; the default)

**Reference:** none. Device assumed: both, desktop first.

**Mode:** VARIANT of the team chat archetype. One axis changed: the order is time of day, with now marked.

**Shape:** AppShell with a channel rail, Paper hour-by-hour timeline, thread and composer in the aside or a sheet.

## Anatomy

| Region | Objects | Actions | States |
| --- | --- | --- | --- |
| Channels with new counts | sample data | see Must-keep | |
| Switch day | sample data | see Must-keep | |
| Now marker | sample data | see Must-keep | |
| Hours as the structure | sample data | see Must-keep | |
| Conversation at each hour | sample data | see Must-keep | |
| New marker in sakura | sample data | see Must-keep | |
| Open the thread | sample data | see Must-keep | |
| Composer | sample data | see Must-keep | |
| Sheet below 1100px | sample data | see Must-keep | |
| Quiet day state | sample data | see Must-keep | |

## Must-keep

- [x] Channels with new counts — `ChatRail`
- [x] Switch day — `Segmented`
- [x] Now marker — `tone="new"`
- [x] Hours as the structure — `xch06-hour`
- [x] Conversation at each hour — `xch06-beat`
- [x] New marker in sakura — `xch06-new`
- [x] Open the thread — `Talk`
- [x] Composer — `Composer`
- [x] Sheet below 1100px — `variant="sheet"`
- [x] Quiet day state — `EmptyState`

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
- Changed: the order is time of day, with now marked.
- Dropped: add channel, huddles and slash commands . Nothing persists on refresh.

## Gives up

A long thread appears once per hour it was active, so one conversation is split up, and urgent items get no priority.

## System tension

- `Message`, `Modal` and `AppShell` needed the same scoped fixes as earlier layouts (Tab trap, phone rail shadow, tighter messages).
