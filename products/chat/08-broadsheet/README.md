# Chat 08: the mentioned post

**Idea:** A newspaper led by where you were mentioned, with people and channels beside it, and every chat a popup

**Intensity:** Medium (assumed: not set in this request; the default)

**Reference:** none. Device assumed: both, desktop first.

**Mode:** VARIANT of the team chat archetype. Two things change: groups are columns you scan, and chats are windows over the page instead of a single pane.

**Shape:** Night top bar, full-width Paper newspaper with flowing columns, floating Paper chat windows docked at the bottom right, and a tray for hidden ones.

## Anatomy

| Region | Objects | Actions | States |
| --- | --- | --- | --- |
| Top bar | brand, search, All or Unread, New message, you | search live, filter live, start a chat | |
| Masthead | date, title, tally, section toggles | mark edition read with undo, reset, show or hide a group | |
| Mention boxes | one per channel that tagged you, mention count, latest mention | pop up only the mentions, reply | unread (lacquer edge), open (gold) |
| Channels list | 8 channels with new counts | open the whole channel as a chat, collapse the list | open (gold) |
| Columns | 8 groups, each with a lead and its stories | open a chat, expand or collapse one or all | For you (lacquer), unread count (sakura), draft, open (gold), no unread |
| People panel | everyone, role, presence, new count | open a personal chat, expand to see where they asked for you and where they are active, collapse the panel | open (gold), new (sakura) |
| Chat windows (click only) | header, messages, reactions, reply | format (Bold, Italic, Code), attach, send, hide, close, Esc | up to 3 on desktop, 2 on tablet, 1 full screen on phones |
| Tray (click only) | hidden and overflow chats | reopen | draft marker |
| New message modal (click only) | to field | open chat | inline error |

Rules: opening a story marks it read and moves focus to its reply box. Opening one already open brings it to the front instead of duplicating it. Past the limit, the oldest chat moves to the tray. Drafts, read state and sent replies are saved in the browser; an attachment waits only until the page is closed, and still work for the visit if storage is blocked.

## Must-keep

- [x] Mention boxes with counts and the latest mention — `xch08-box`, `xch08-box__n`
- [x] Groups as columns — `xch08-columns`, `xch08-col`
- [x] People with personal chats, expandable — `xch08-people`, `xch08-person__detail`
- [x] Channels you can chat in — `channelsShown`
- [x] Columns expand and collapse — `xch08-fold`, `folded`
- [x] Unread counts from the data — `xch08-count`, `unread`
- [x] Search — `Search the paper`
- [x] Stories in a thread with replies — `thread`, `Talk`
- [x] Composing, with Enter to send — `xch08-win__form`
- [x] Several chats at once — `xch08-windows`
- [x] Hide and reopen with the draft kept — `xch08-tray`, `drafts`
- [x] Start a new message — `Modal`, `startNew`
- [x] Mark read with undo — `markAll`, `Toast`
- [x] Empty results offer the fix — `EmptyState`

## Translation

- channel sidebar → newspaper columns on Paper
- single message pane → floating chat windows, `--elevation-4`
- unread badge → sakura; mention → lacquer "For you"; open story → gold bar

## Surfaces

Night: top bar. Paper: the newspaper, windows, modal.

## New patterns

- Chat window (`.xch08-win`) and tray (`.xch08-tray`): docked at the bottom, tokens only. Candidate for a system component.
- Windows are non-modal, so the page stays usable behind them; on phones one fills the screen.

## Kept / changed / dropped

- Kept: channels, DMs, threads, composer, unread counts.
- Changed: no rail. Headlines are the first sentence of each thread, so they are plain rather than written.
- Dropped: members panel, and creating channels. A new story in a group starts with a placeholder title.

## Gives up

Windows cover the paper on small laptops, three at once take most of the width, and following a long discussion is cramped. There is no way to see a group as one long stream. Sample messages do not change, so no new messages arrive on their own. Extra mentions are sample data written for this layout, and a reply from a mention box stays in that popup rather than joining the group thread.

## System tension

- `AppShell` assumes one main pane, so this layout composes its own top bar and has no rail. Phones have no sheet to manage because windows take over the screen.
- No system window or dock component; built with tokens.
- `ds-msg` and `ds-card` needed scoped tightening inside a 360px window.
