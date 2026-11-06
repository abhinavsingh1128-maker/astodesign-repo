# Messaging 01: decision ledger

**Idea:** Every channel opens on what was decided and what is still open; the talk is the evidence

**Intensity:** Medium (assumed: not set in this request; the default)

**Reference:** none. Device assumed: both, desktop first.

**Mode:** VARIANT of the team chat archetype. One axis changed: the main object is a decision, not a message.

**Shape:** AppShell with a channel rail, Paper ledger of open and decided questions, and the talk, composer and attachments open in the aside or a sheet only after you click a decision.

## Anatomy

| Region | Objects | Actions | States |
| --- | --- | --- | --- |
| Rail | all decisions, 8 channels with open counts, 4 direct messages, you | filter by channel | current (gold), open count (sakura), presence |
| Header | title, owner filter | Everyone or Mine | selected (lacquer) |
| Still open | 6 questions with owner, due date, channel, message count | open a decision | current (gold) |
| Decided | 4 questions with their answers | open a decision | decided (lacquer) |
| Talk panel, only after a click (sheet at 1100px and below) | question, messages, reactions, files, composer | record decision, reply, format, attach, close | |
| Record modal and toast (click only) | answer field | save, cancel, undo | Save disabled when empty |

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
