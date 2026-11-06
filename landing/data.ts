// Everything shown on the landing page. Each wireframe is a list of columns; each column is a stack of labelled boxes.
export type Screen = { path: string; name: string; line: string; notes: string[]; wire: string[][]; pick?: boolean };

export const MESSAGING: Screen[] = [
  { path: 'chat/03-decision-ledger', pick: true, name: 'Decision ledger', line: 'Most of what you scroll chat for is one thing: what did we decide?',
    notes: ['A channel opens on its decisions, not its messages. You see what is settled and what is still waiting on someone.', 'Click a decision and the conversation behind it opens beside it, so the talk becomes the evidence.', 'This is the one I would take forward. Chat loses answers in the flow, and this fixes that directly.'],
    wire: [['Channels', 'Open counts'], ['Still open', 'Decided'], ['The talk', 'Reply']] },
  { path: 'chat/08-broadsheet', name: 'The Mentioned Post', line: 'A morning paper, except every headline is somewhere you were needed.',
    notes: ['Each channel that tagged you becomes a box with the number of mentions and the latest one.', 'Open a box and you get only those messages, not the whole conversation.', 'People and channels sit on the left, and you can keep several chats open at once.'],
    wire: [['People', 'Channels'], ['Mention boxes', 'Newspaper columns'], ['Chat popup']] },
  { path: 'chat/05-people-first', name: 'People first', line: 'You usually want a person, not a channel.',
    notes: ['Pick someone and your personal chat is already open.', 'Everything else you share with them lives in a thread panel beside it, filtered by personal or group.', 'It suits one-to-ones and handovers, but it is the weakest of the three for following a busy channel.'],
    wire: [['People', 'Channels'], ['Person', 'Personal chat', 'Reply'], ['Filters', 'Threads']] },
];

export const READER: Screen[] = [
  { path: 'reader/04-year-as-book', pick: true, name: 'The year as a book', line: 'A reading profile is a story about someone, so I made it one you can page through.',
    notes: ['The profile, reading now, the yearly challenge, shelves and reviews each get a spread.', 'Pages turn the way they do on my portfolio, with a real two-sided leaf.', 'This is the one I would take forward. A profile is meant to be shown off, and nothing else feels this personal.'],
    wire: [['Name', 'Avatar', 'Stats'], ['Reading now', 'Next page']] },
  { path: 'reader/05-cover-wall', name: 'Cover wall', line: 'You can tell a lot about someone from their bookshelf.',
    notes: ['Covers fill the page, grouped by shelf, with what you are reading now on top.', 'Pick a cover to see likes, ratings, tags and which friends have read it.', 'The most familiar of the three, and the quickest way to take in someone’s taste.'],
    wire: [['Search', 'Shelves', 'Challenge'], ['Reading now', 'Wall of covers'], ['Book details', 'Tags']] },
  { path: 'reader/04-blind-date', name: 'Blind date', line: 'What if you met a book by one line, before you saw its cover?',
    notes: ['Nine lines from books you have not read. Flip a card when one pulls you in.', 'The back shows the book, its stars and its likes, with a button to add it to your list.', 'Your profile, stats, shelves and reviews sit below, so it still works as a full reader profile.'],
    wire: [['Profile'], ['Nine flip cards'], ['My books', 'Shelves', 'Reviews']] },
];

const other = (path: string, name: string, line: string): Screen => ({ path, name, line, notes: ['An earlier test I learned from, and not part of the final six.'], wire: [['Open it to see the layout']] });
export const OTHERS: Screen[] = [
  other('chat/00-parity-channel', 'Parity channel', 'A normal team chat in my style, to check the system could carry one at all.'),
  other('chat/02-unified-inbox', 'Unified inbox', 'Every channel in one list, sorted by what needs you.'),
  other('chat/04-morning-paper', 'Morning paper', 'The first newspaper version, before mentions took over.'),
  other('chat/06-day-river', 'Day river', 'Your day as a timeline, with conversations at the hour they happened.'),
  other('chat/07-person-hero', 'Person hero', 'A plainer take on people first, with groups behind one small button.'),
  other('reader/03-stats-first', 'Stats first', 'A profile that leads with the numbers.'),
  other('reader/03-start-reading', 'Start reading', 'A home page that opens on a line from a book picked for you.'),
  other('reader/06-reading-diary', 'Reading diary', 'A year of reading written up as dated entries.'),
  other('reader/07-taste-map', 'Taste map', 'Books placed by length and rating, to see what you actually like.'),
  other('reader/05-by-mood', 'By mood', 'Choose how you feel, and read a line from each book that fits.'),
  other('reader/06-first-lines', 'First lines', 'A ledger of opening sentences to scan.'),
  other('reader/07-because-you-read', 'Because you read', 'Each book you loved leads to the next ones.'),
  other('reader/08-by-time', 'By time', 'Start from how long you have got.'),
  other('reader/09-this-or-that', 'This or that', 'Two unnamed passages at a time, until one book is left.'),
];
