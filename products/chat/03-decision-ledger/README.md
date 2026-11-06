# Chat 03: decision ledger

**Idea:** Every channel opens on what was decided and what is still open; the talk is the evidence

**Intensity:** Medium (assumed: not set in this request; the default)

**Reference:** none. Device assumed: both, desktop first.

**Mode:** VARIANT of the team chat archetype. One axis changed: the main object is a decision, not a message.

**Shape:** AppShell with a channel rail, Paper ledger of open and decided questions, and the talk, composer and attachments open in the aside or a sheet only after you click a decision.

## Anatomy

| Region | Objects | Actions | States |
| --- | --- | --- | --- |
| Workspace rail with channels and open counts | sample data | see Must-keep | |
| Filter by owner | sample data | see Must-keep | |
| Open and decided lists | sample data | see Must-keep | |
| Done state in lacquer | sample data | see Must-keep | |
| The talk behind each decision | sample data | see Must-keep | |
| Composer on every decision | sample data | see Must-keep | |
| Record a decision | sample data | see Must-keep | |
| Undo | sample data | see Must-keep | |
| Sheet below 1100px | sample data | see Must-keep | |
| Empty channel offers the fix | sample data | see Must-keep | |

## Must-keep

- [x] Workspace rail with channels and open counts — `ChatRail`
- [x] Filter by owner — `Segmented`
- [x] Open and decided lists — `xch03-list`
- [x] Done state in lacquer — `variant="selected"`
- [x] The talk behind each decision — `Talk`
- [x] Composer on every decision — `Composer`
- [x] Record a decision — `Modal`
- [x] Undo — `Toast`
- [x] Sheet below 1100px — `variant="sheet"`
- [x] Empty channel offers the fix — `EmptyState`

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
- Changed: the main object is a decision, not a message.
- Dropped: add channel, huddles and slash commands . Nothing persists on refresh.

## Gives up

Reading the chat as it flows is secondary; someone must record decisions or the ledger stays thin. Decisions here are authored sample data, not inferred.

## System tension

- `Message`, `Modal` and `AppShell` needed the same scoped fixes as earlier layouts (Tab trap, phone rail shadow, tighter messages).
