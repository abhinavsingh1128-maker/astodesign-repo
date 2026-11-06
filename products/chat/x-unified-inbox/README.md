# Chat 02: unified inbox

> Extra, not one of the final six. Kept as an earlier test.

**Idea:** Every channel in one inbox, triaged by what needs me

**Intensity:** Medium (asked)

**Reference:** none. Named category only ("a Slack alternative"); structure comes from the team chat archetype in `translate-a-product.md`. No identity taken. Device assumed: both, desktop first.

**Mode:** VARIANT of the team chat archetype. One axis changed: the main object is an inbox item instead of a channel. Built before `00-parity-channel`, which now holds the baseline; both use the same people and messages, and must-keeps come from the archetype row.

**Shape:** AppShell with a workspace switcher and Night rail, Paper triage list in main, Paper conversation (thread, channel, details, composer) in the aside. At 1100px and below the conversation opens as a sheet.

## Anatomy

| Region | Objects | Actions | States |
| --- | --- | --- | --- |
| Switcher | 3 workspaces | switch (others stubbed, see Gives up) | current (gold) |
| Rail | 6 inbox views, 8 channels, 4 DMs, you | filter the inbox | current (gold), unread (sakura count), presence |
| Header | kicker, title or channel topic and members, search | search live, New message | |
| Summary | moon ring, tally, order | By need / By time | selected (lacquer) |
| Needs you | 5 rows: who, channel, ask, reason, wait, replies, draft | open, Done, Later | current, unread, blocked, draft |
| Threads that moved | 3 rows | open, Done, Later | unread |
| Catch up | 6 one-line channel digests | open, Done, Mark all done | unread |
| Done today | collapsed list | expand, Undo | |
| Conversation | channel header, Thread / Channel / Details tabs, messages, files, reactions | Done, Later, react, reply, open thread | New divider |
| Composer | field, Bold, Italic, Code, Attach, Send | write, format, attach, send (sending moves the item to Done) | draft kept per item, Send disabled when empty |
| Hover and click only | row actions, message Reply, New message modal, conversation sheet, phone rail sheet, Toast with Undo | | |

## Must-keep

- [x] Workspace switcher — `xch02-ws`
- [x] Sidebar with mentions, threads, drafts and unread counts — `RailItem`
- [x] Channels with unread counts — `lead="#"`
- [x] DMs with presence — `presence-on`
- [x] Channel header: name, topic, members, search — `xch02-conv__topic`, `Search the inbox`
- [x] Stream with name, time, reactions, files — `Message`, `attachments`
- [x] Threads open from the channel — `onOpenThread`
- [x] Day and new markers — `StreamDivider`
- [x] Mentions of you stand out — `Mention`
- [x] Composer with formatting and send — `xch02-composer`, `variant="primary"`
- [x] Details panel: about, people, files — `Details`, `Tabs`
- [x] Triage: reason, wait, Done, Later, Undo — `xch02-row__why`, `triage`, `Toast`

## Translation

- brand-colour send button → the ink pill, the one primary in view
- bold unread channel + badge → `RailItem unread`, sakura count
- emoji reactions → text chips (`+1 3`)
- icon formatting bar → ghost text buttons (B, I, Code, Attach)
- highlighted active channel → gold bar, also on the current inbox row

## Surfaces

Night: switcher, rail. Paper: inbox, conversation, sheet, modal.

## New patterns

- Triage row (`.xch02-row`): open button and actions are siblings; gold inset when current, sakura count when unread. Tokens: `--accent-gold`, `--accent-sakura`, `--border-subtle`. Candidate for the system.
- Motif: the moon `Ring` tracks items cleared today. When nothing needs you the `EmptyState` moon replaces it, so only one shows.

## Kept / changed / dropped

- Kept: every archetype must-keep, including channels, thread, composer and details.
- Changed: channels filter the inbox rather than being the destination. Replying clears the item. Details moved to a tab, because the aside holds the conversation.
- Dropped: add-channel, huddles, slash commands and @-autocomplete, none of them needed to test the idea. Screen-wide channel stream: it lives in the 340px aside.

## Gives up

Long reading in a channel is cramped in 340px, and someone who likes to browse channels by hand loses the wide stream. Triage is authored in the data here, not inferred, so a wrong triage guess is untested. Switching workspace only shows a toast; this prototype has data for one workspace.

## System tension

- Docs and code disagree: `components.md` documents `Input density`, `Modal as`, `Avatar tone`, a string `Message thread`; the source has `compact`, `variant`, `gold`, an object. Built against the source.
- `Modal` does not trap Tab, though the skill requires it. Added in this layout's key handler; belongs in the system.
- `AppShell` closed rail leaks its shadow onto the phone screen's left edge. Scoped off under `.xch02-root`; belongs in the system.
- `Message` actions sit at `top: -14px` and clip in a scrolling stream. Scoped `.xch02-conv .ds-msg__actions`, along with tighter `ds-msg` padding, `ds-card` title and `ds-sheet` padding for the 340px column.
- No `Modal` className, so sheet overrides hang from a wrapper, `.xch02-root`.
- Layouts have no favicon, so `shoot.mjs` reports a 404 on all of them (habits too). Added a blank icon in this layout's `index.html`.
- Checker warning kept: the unread count uses `--ink-900` for its text, matching the system's own `ds-rail__count--unread`. There is no semantic token for text on sakura.
