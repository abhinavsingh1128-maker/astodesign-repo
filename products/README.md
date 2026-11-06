# Products

Every product built with the `astodesign` skill lives here in its own folder. New ones can be added at any time, and `npm run build` picks them up.

# Assignment layouts

The submission: two products, three layouts each, every one starting from a different idea.

## Messaging: a Slack alternative

| Layout | The idea |
| --- | --- |
| [01-decision-ledger](chat/01-decision-ledger/) **(take forward)** | Most of what you scroll chat for is one thing: what did we decide? Channels open on decisions, and the talk is the evidence. |
| [02-mentioned-post](chat/02-mentioned-post/) | A morning paper where every headline is somewhere you were needed, with people, channels and chats as popups. |
| [03-people-first](chat/03-people-first/) | You usually want a person, not a channel, so your personal chat opens first and threads sit beside it. |

**Why 01:** chat's real failure is that answers get lost in the flow, and this makes the outcome the main object. Paper and rails also suit a record you read and scan, which is where the system is strongest.

## Reader profile: in the spirit of Goodreads

| Layout | The idea |
| --- | --- |
| [01-year-as-book](reader/01-year-as-book/) **(take forward)** | A profile is a story about someone, so it is one you page through, spread by spread. |
| [02-cover-wall](reader/02-cover-wall/) | You can tell a lot about someone from their bookshelf, so covers are the page. |
| [03-blind-date](reader/03-blind-date/) | Meet a book by one line before you see its cover, with the full profile underneath. |

**Why 01:** a profile is personal and meant to be shown off, and the open book is where the system does something a default interface can't.

## Where the system stretches and breaks

- **Holds up:** Night and Paper, the colour jobs and the serif and sans split carried a dense chat and a cover wall without new tokens.
- **Breaks:** the book is slow to scan, floating chats cover content on small laptops, and there is no system component for popovers, chat windows or status marks.
- **Real content:** likes, ratings and all people are sample data. Covers come from Open Library as an exception to the skill's rule against real cover art, and many are copyrighted editions.

## Extras

Folders starting `x-` are earlier tests, not part of the six. `habits/01-week-ledger` is the skill's worked example.
