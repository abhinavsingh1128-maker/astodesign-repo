# Chat 00: parity channel

**Idea:** The team chat everyone knows: channels, a stream, a thread and a composer

**Intensity:** Medium (assumed: carried over from 02-unified-inbox, which asked for Medium)

**Reference:** none. Named category only ("a Slack alternative"); structure comes from the team chat archetype in `translate-a-product.md`. No identity taken. Device assumed: both, desktop first.

**Mode:** TRANSLATE (the archetype). The baseline that 02-unified-inbox varies; same people and messages, in `data.ts`.

**Shape:** AppShell with a workspace switcher and Night rail, Paper stream with a pinned composer, thread or details in the aside. At 1100px and below the thread and details open as a sheet.

## Anatomy

| Region | Objects | Actions | States |
| --- | --- | --- | --- |
| Switcher | 3 workspaces | switch (others stubbed) | current (gold) |
| Rail | Threads, Mentions, Drafts, 8 channels, 4 DMs, you | go to a view or conversation | current (gold), unread (sakura count), presence |
| Header | name, topic, members, search | open details, search live | |
| Stream | messages, files, reactions, thread summaries | react, reply, open thread | day and New dividers, grouped |
| Composer | field, Bold, Italic, Code, Attach, Send | write, format, attach, send | draft kept per conversation, Send disabled when empty |
| Aside or sheet | thread with its own composer, or details | reply, close | |
| Work lists | threads, mentions, drafts | jump to the conversation | empty state |
| Hover and focus only | message +1 and Reply; the same jobs stay on reaction chips, thread links and composers on touch | | |

## Must-keep

- [x] Workspace switcher — `xch00-ws`
- [x] Sidebar: threads, mentions, drafts — `Threads`, `Mentions`, `Drafts`
- [x] Channels with unread counts — `RailItem`, `lead="#"`
- [x] DMs with presence — `presence-on`
- [x] Channel header: name, topic, members, search — `xch00-topic`, `members`, `Search this conversation`
- [x] Stream with name, time, reactions, files — `Message`, `attachments`
- [x] Thread summaries that open the thread — `openThread`
- [x] Day and new markers — `StreamDivider`
- [x] Mentions stand out — `Mention`
- [x] Composer with formatting and send — `xch00-composer`, `variant={primary`
- [x] Details panel: about, people, files — `xch00-details`

## Translation

- brand-colour send button → the ink pill; the thread's Send is secondary beside it, so one primary shows
- bold unread channel + badge → `RailItem unread`, sakura count
- emoji reactions → text chips (`+1 3`)
- icon formatting bar → ghost text buttons (B, I, Code, Attach)
- active channel highlight → gold bar

## Surfaces

Night: switcher, rail. Paper: stream, aside, sheet.

## New patterns

- None beyond the composer form, which repeats 02's. Motif: the `EmptyState` moon, only on empty views.

## Kept / changed / dropped

- Kept: every archetype must-keep.
- Changed: details share the aside with the thread, one at a time.
- Dropped: add channel, huddles, slash commands, @-autocomplete.

## Gives up

Nothing is triaged: finding what needs you means walking the channels, which is what 02 sets out to fix. Workspace switching only shows a toast.

## System tension

- Same as 02: `Modal` does not trap Tab (handled here), the closed `AppShell` rail leaks a shadow on phones, `Message` actions clip in a scrolling stream, sheet padding overrides need a wrapper. All scoped under `.xch00-root` or `.xch00-*`.
- New: `AppShell` lets the page scroll under 760px, which pushes a pinned composer off screen. Scoped a fixed height under `.xch00-root` for this layout.
- The composer now exists in 00 and 02, a candidate for a system component.
- Checker warnings: none expected from this layout's colours.
- `shoot.mjs` reports overlaps here that are not visible: it measures controls scrolled out of the stream and clipped behind the composer or header, because it ignores scroll clipping. Checked by clipping each control's box to its scroll area: none overlap at 1280, 1100 or 390. The script should skip clipped controls.
- `ds-reaction` is 28px tall; raised to 32px on phones in this layout.
