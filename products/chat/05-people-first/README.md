# Chat 05: people first

**Idea:** You go to a person, not a channel, and see everything you share with them

**Intensity:** Medium (assumed: not set in this request; the default)

**Reference:** none. Device assumed: both, desktop first.

**Mode:** VARIANT of the team chat archetype. One axis changed: the unit is a person, not a channel.

**Shape:** AppShell with a people rail, merged Paper stream grouped by place, overlap and files in the aside.

## Anatomy

| Region | Objects | Actions | States |
| --- | --- | --- | --- |
| People with presence and unread | sample data | see Must-keep | |
| Find a person | sample data | see Must-keep | |
| Channels still reachable | sample data | see Must-keep | |
| Everything shared with one person | sample data | see Must-keep | |
| Grouped by place | sample data | see Must-keep | |
| Filter by shared place | sample data | see Must-keep | |
| Waiting-on-you notice | sample data | see Must-keep | |
| Composer to that person | sample data | see Must-keep | |
| Files from this person | sample data | see Must-keep | |
| Empty place offers the fix | sample data | see Must-keep | |

## Must-keep

- [x] People with presence and unread — `RailItem`
- [x] Find a person — `Find a person`
- [x] Channels still reachable — `RailSection`
- [x] Everything shared with one person — `shared`
- [x] Grouped by place — `StreamDivider`
- [x] Filter by shared place — `Tag`
- [x] Waiting-on-you notice — `Banner`
- [x] Composer to that person — `Composer`
- [x] Files from this person — `xch05-files`
- [x] Empty place offers the fix — `EmptyState`

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
- Changed: the unit is a person, not a channel.
- Dropped: add channel, huddles and slash commands . Nothing persists on refresh.

## Gives up

Weak for broadcast channels and topics nobody owns. Following a whole channel means leaving the main model. Sending always goes to a direct conversation.

## System tension

- `Message`, `Modal` and `AppShell` needed the same scoped fixes as earlier layouts (Tab trap, phone rail shadow, tighter messages).
