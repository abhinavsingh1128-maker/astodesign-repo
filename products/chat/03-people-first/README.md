# Messaging 03: people first

**Idea:** You go to a person: your personal chat opens first, and any thread with them opens beside it

**Intensity:** Medium (assumed: not set in this request; the default)

**Reference:** none. Device assumed: both, desktop first.

**Mode:** VARIANT of the team chat archetype. One axis changed: the unit is a person, not a channel.

**Shape:** AppShell with a people rail, merged Paper stream grouped by place, overlap and files in the aside.

## Anatomy

| Region | Objects | Actions | States |
| --- | --- | --- | --- |
| Rail | people, search, channels | switch person, open a channel | current, unread, presence |
| Header | person, presence | Threads button at 1100px and below | |
| Main | waiting notice, personal chat, composer | send, format, attach, open a thread | first-message state |
| Aside or sheet | Personal and group filters, thread list, or one open thread with replies and composer | open, back, reply | new count |

## Must-keep

- [x] People with presence and unread — `RailItem`
- [x] Find a person — `Find a person`
- [x] Channels below the people, each opening its chat — `goChan`
- [x] Close and reopen the left panel — `railOpen`
- [x] Personal chat is the default — `personal`
- [x] Threads with this person in one panel — `xch05-threads`
- [x] A thread opens beside the chat — `xch05-thread`, `openThread`
- [x] Threads in personal messages open too — `threadFor`
- [x] Personal and group filters in the Threads panel — `xch05-filter`, `setPlace`
- [x] Waiting-on-you notice — `Banner`
- [x] Composer with formatting and attach — `Composer`
- [x] First message state — `EmptyState`

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

Weak for broadcast channels and topics nobody owns. Following a whole channel means leaving the main model. You cannot read a whole group here, only the threads this person is in. Personal threads use sample replies written for this layout.

## System tension

- `Message`, `Modal` and `AppShell` needed the same scoped fixes as earlier layouts (Tab trap, phone rail shadow, tighter messages).
