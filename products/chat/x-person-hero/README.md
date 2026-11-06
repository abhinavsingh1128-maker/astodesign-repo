# Chat 07: person hero

> Extra, not one of the final six. Kept as an earlier test.

**Idea:** Your personal chat is always open; one small button shows what this person said in your groups

**Intensity:** Low (asked: "low function", read as Low intensity)

**Reference:** a chat app screenshot from the owner. Structure taken: a large person header above the conversation, and a column of shared files. No colours, type, images or copy taken.

**Mode:** VARIANT of the team chat archetype. One axis changed: the unit is a person, and the personal chat is the default view.

**Shape:** AppShell with a Night people rail, Paper main with a person hero and personal chat, shared files in the aside, group messages in a small popover.

## Anatomy

| Region | Objects | Actions | States |
| --- | --- | --- | --- |
| Rail | 7 people, search, you | switch person, find | current (gold), new in groups (sakura), presence |
| Hero | large avatar, name, role, what is waiting on you | open groups button | around or away, new count, no shared groups |
| Group popover (click only) | their messages by group | Reply here, close by Esc, outside click or button | focus moves in and returns |
| Chat | personal messages, or a first-message empty state | read, react | |
| Composer | field, Bold, Send, quoted group message | send, remove quote | Send disabled when empty |
| Aside | files from this person | | hidden at 1100px and below |

## Must-keep

- [x] People with presence and counts — `RailItem`
- [x] Find a person — `Find a person`
- [x] Person hero — `xch07-hero`
- [x] What is waiting on you — `xch07-ask`
- [x] Personal chat always open — `xch07-chat`, `Talk`
- [x] Small button into groups — `xch07-peek`
- [x] Their group messages in seconds — `xch07-panel`
- [x] Reply here with the group message quoted — `xch07-quote`
- [x] Composer — `Composer`
- [x] Shared files — `xch07-files`
- [x] First message state — `EmptyState`

## Translation

- portrait photo header → large initials `Avatar`
- coloured selected row → gold `RailItem current`
- icon action row → one text button

## Surfaces

Night: rail only. Paper: everything else, at Low with grain and no fibres.

## New patterns

- Group popover (`.xch07-panel`): Paper raised, `--elevation-2`, closes on Esc or an outside click.

## Kept / changed / dropped

- Kept: the reference's person header, and files beside the chat.
- Changed: groups are not destinations; they open as a quick look over the personal chat.
- Dropped: videos and images shelves, call buttons, categories, full channel view, and replying inside a group.

## Gives up

You cannot follow or reply in a group here, only see one person's messages and answer privately. Whole group context is missing. Files are not reachable at 1100px and below.

## System tension

- `Avatar` xl is too large for phones; reduced in a scoped rule.
- `Message` has no way to display a quoted message, so a quote is sent as plain text in the body.
