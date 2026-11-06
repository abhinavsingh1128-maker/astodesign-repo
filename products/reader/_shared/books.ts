// Shared sample data for the reader layouts 04–09.
// Every quote is public-domain text published before 1929. Hooks, reviews and page counts are sample content.
export type Mood = 'Eerie' | 'Tender' | 'Adventurous' | 'Curious' | 'Restless';
export type Quote = { text: string; where: string; opening?: boolean };
export type Rec = {
  id: string; title: string; author: string; year: number; pages: number;
  mood: Mood; because: string; hook: string; credit?: string; quotes: Quote[];
};

export const RECS: Rec[] = [
  { id: 'frankenstein', title: 'Frankenstein', author: 'Mary Shelley', year: 1818, pages: 280, mood: 'Eerie', because: 'jekyll', hook: 'A maker, the thing he made, and which of them is the monster.', quotes: [
    { text: 'You will rejoice to hear that no disaster has accompanied the commencement of an enterprise which you have regarded with such evil forebodings.', where: 'Letter 1', opening: true },
    { text: 'Beware; for I am fearless, and therefore powerful.', where: 'Chapter XX' },
  ] },
  { id: 'dracula', title: 'Dracula', author: 'Bram Stoker', year: 1897, pages: 418, mood: 'Eerie', because: 'jekyll', hook: 'Told in diaries and letters, so you learn the truth one page behind the people living it.', quotes: [
    { text: '3 May. Bistritz.—Left Munich at 8:35 P.M., on 1st May, arriving at Vienna early next morning; should have arrived at 6:46, but train was an hour late.', where: 'Chapter I', opening: true },
    { text: 'Listen to them—the children of the night. What music they make!', where: 'Chapter II' },
  ] },
  { id: 'hound', title: 'The Hound of the Baskervilles', author: 'Arthur Conan Doyle', year: 1902, pages: 256, mood: 'Eerie', because: 'jekyll', hook: 'A moor, a family curse, and Holmes mostly out of sight.', quotes: [
    { text: 'Mr. Sherlock Holmes, who was usually very late in the mornings, save upon those not infrequent occasions when he was up all night, was seated at the breakfast table.', where: 'Chapter I', opening: true },
    { text: 'Mr. Holmes, they were the footprints of a gigantic hound!', where: 'Chapter II' },
  ] },
  { id: 'heart', title: 'Heart of Darkness', author: 'Joseph Conrad', year: 1899, pages: 96, mood: 'Restless', because: 'screw', hook: 'A river journey told on a boat at dusk, darker with every mile.', quotes: [
    { text: 'The Nellie, a cruising yawl, swung to her anchor without a flutter of the sails, and was at rest.', where: 'Part I', opening: true },
    { text: 'We live, as we dream—alone.', where: 'Part I' },
  ] },
  { id: 'wuthering', title: 'Wuthering Heights', author: 'Emily Brontë', year: 1847, pages: 416, mood: 'Tender', because: 'janeeyre', hook: 'A love so fierce it ruins two houses and two generations.', quotes: [
    { text: '1801.—I have just returned from a visit to my landlord—the solitary neighbour that I shall be troubled with.', where: 'Chapter I', opening: true },
    { text: 'Whatever our souls are made of, his and mine are the same.', where: 'Chapter IX' },
  ] },
  { id: 'littlewomen', title: 'Little Women', author: 'Louisa May Alcott', year: 1868, pages: 449, mood: 'Tender', because: 'janeeyre', hook: 'Four sisters, one winter without money, and Jo deciding who she will be.', quotes: [
    { text: '“Christmas won’t be Christmas without any presents,” grumbled Jo, lying on the rug.', where: 'Chapter I', opening: true },
    { text: 'I’m not afraid of storms, for I’m learning how to sail my ship.', where: 'Chapter XLIV' },
  ] },
  { id: 'secretgarden', title: 'The Secret Garden', author: 'Frances Hodgson Burnett', year: 1911, pages: 331, mood: 'Tender', because: 'janeeyre', hook: 'A sour child, a locked garden, and a spring that changes both.', quotes: [
    { text: 'When Mary Lennox was sent to Misselthwaite Manor to live with her uncle everybody said she was the most disagreeable-looking child ever seen.', where: 'Chapter I', opening: true },
  ] },
  { id: 'greatexp', title: 'Great Expectations', author: 'Charles Dickens', year: 1861, pages: 505, mood: 'Tender', because: 'janeeyre', hook: 'A boy, a convict in the marshes, and a fortune from nowhere.', quotes: [
    { text: 'My father’s family name being Pirrip, and my Christian name Philip, my infant tongue could make of both names nothing longer or more explicit than Pip.', where: 'Chapter I', opening: true },
  ] },
  { id: 'awakening', title: 'The Awakening', author: 'Kate Chopin', year: 1899, pages: 140, mood: 'Tender', because: 'innocence', hook: 'One summer by the sea, and a woman who stops pretending.', quotes: [
    { text: 'A green and yellow parrot, which hung in a cage outside the door, kept repeating over and over: “Allez vous-en! Allez vous-en! Sapristi! That’s all right!”', where: 'Chapter I', opening: true },
    { text: 'The voice of the sea is seductive; never ceasing, whispering, clamoring, murmuring, inviting the soul to wander for a spell in abysses of solitude.', where: 'Chapter VI' },
  ] },
  { id: 'karenina', title: 'Anna Karenina', author: 'Leo Tolstoy', year: 1878, pages: 864, mood: 'Restless', because: 'innocence', credit: 'translated by Constance Garnett, 1901', hook: 'Society, a train station, and a love that costs everything.', quotes: [
    { text: 'Happy families are all alike; every unhappy family is unhappy in its own way.', where: 'Part One, Chapter I', opening: true },
  ] },
  { id: 'crime', title: 'Crime and Punishment', author: 'Fyodor Dostoevsky', year: 1866, pages: 545, mood: 'Restless', because: 'innocence', credit: 'translated by Constance Garnett, 1914', hook: 'A student does the unthinkable, then has to live inside his own head.', quotes: [
    { text: 'On an exceptionally hot evening early in July a young man came out of the garret in which he lodged in S. Place and walked slowly, as though in hesitation, towards K. bridge.', where: 'Part I, Chapter I', opening: true },
  ] },
  { id: 'walden', title: 'Walden', author: 'Henry David Thoreau', year: 1854, pages: 320, mood: 'Restless', because: 'dalloway', hook: 'Two years in a hut by a pond, and what is left when you need less.', quotes: [
    { text: 'When I wrote the following pages, or rather the bulk of them, I lived alone, in the woods, a mile from any neighbor, in a house which I had built myself, on the shore of Walden Pond, in Concord, Massachusetts, and earned my living by the labor of my hands only.', where: 'Economy', opening: true },
    { text: 'I went to the woods because I wished to live deliberately, to front only the essential facts of life, and see if I could not learn what it had to teach, and not, when I came to die, discover that I had not lived.', where: 'Where I Lived, and What I Lived For' },
  ] },
  { id: 'twocities', title: 'A Tale of Two Cities', author: 'Charles Dickens', year: 1859, pages: 380, mood: 'Restless', because: 'dalloway', hook: 'London, Paris and a revolution, with one man quietly deciding what he is worth.', quotes: [
    { text: 'It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity.', where: 'Book the First, Chapter I', opening: true },
  ] },
  { id: 'treasure', title: 'Treasure Island', author: 'Robert Louis Stevenson', year: 1883, pages: 292, mood: 'Adventurous', because: 'kidnapped', hook: 'An inn boy, a map, and a cook with one leg you can’t help liking.', quotes: [
    { text: 'Squire Trelawney, Dr. Livesey, and the rest of these gentlemen having asked me to write down the whole particulars about Treasure Island, from the beginning to the end, keeping nothing back but the bearings of the island…', where: 'Chapter I', opening: true },
    { text: 'Fifteen men on the dead man’s chest— Yo-ho-ho, and a bottle of rum!', where: 'Chapter I' },
  ] },
  { id: 'montecristo', title: 'The Count of Monte Cristo', author: 'Alexandre Dumas', year: 1844, pages: 1276, mood: 'Adventurous', because: 'kidnapped', credit: 'anonymous translation, 1846', hook: 'Fourteen years in prison, an escape, and a very patient revenge.', quotes: [
    { text: 'All human wisdom is contained in these two words,—“Wait and hope.”', where: 'Chapter CXVII' },
  ] },
  { id: 'willows', title: 'The Wind in the Willows', author: 'Kenneth Grahame', year: 1908, pages: 260, mood: 'Curious', because: 'kidnapped', hook: 'A river, four friends, and a toad who cannot be trusted with a motor-car.', quotes: [
    { text: 'The Mole had been working very hard all the morning, spring-cleaning his little home.', where: 'Chapter I', opening: true },
    { text: 'Believe me, my young friend, there is nothing—absolutely nothing—half so much worth doing as simply messing about in boats.', where: 'Chapter I' },
  ] },
  { id: 'alice', title: "Alice's Adventures in Wonderland", author: 'Lewis Carroll', year: 1865, pages: 200, mood: 'Curious', because: 'screw', hook: 'A rabbit hole, and logic that bends exactly as far as it can.', quotes: [
    { text: 'Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do.', where: 'Chapter I', opening: true },
    { text: '“Who in the world am I?” Ah, that’s the great puzzle!', where: 'Chapter II' },
  ] },
  { id: 'peterpan', title: 'Peter Pan', author: 'J. M. Barrie', year: 1911, pages: 192, mood: 'Curious', because: 'kidnapped', hook: 'Flying children, pirates, and an ending sadder than you remember.', quotes: [
    { text: 'All children, except one, grow up.', where: 'Chapter I', opening: true },
    { text: 'To die will be an awfully big adventure.', where: 'Chapter VIII' },
  ] },
];
export const rec = (id: string) => RECS.find((r) => r.id === id)!;
export const MOODS: Mood[] = ['Eerie', 'Tender', 'Adventurous', 'Curious', 'Restless'];
export const cite = (r: Rec, q: Quote) => `${r.title}, ${r.author} · ${q.where} · public domain, ${r.year}${r.credit ? `, ${r.credit}` : ''}`;

// Books Kavya has finished, with her sample rating and review line.
export const FINISHED: Record<string, { title: string; author: string; stars: number; line: string }> = {
  janeeyre: { title: 'Jane Eyre', author: 'Charlotte Brontë', stars: 5, line: 'She says no, and means it.' },
  jekyll: { title: 'Dr Jekyll and Mr Hyde', author: 'Robert Louis Stevenson', stars: 4, line: 'Shorter than its reputation.' },
  kidnapped: { title: 'Kidnapped', author: 'Robert Louis Stevenson', stars: 4, line: 'A long walk across Scotland with the wrong friend.' },
  innocence: { title: 'The Age of Innocence', author: 'Edith Wharton', stars: 5, line: 'Every dinner party is a battle.' },
  screw: { title: 'The Turn of the Screw', author: 'Henry James', stars: 4, line: 'I still don’t know what I saw.' },
  dalloway: { title: 'Mrs Dalloway', author: 'Virginia Woolf', stars: 5, line: 'One day in June, and a whole life inside it.' },
};
export const READ_COUNT = 18;
export const GOAL = 24;
export const READING = [
  { id: 'pride', title: 'Pride and Prejudice', author: 'Jane Austen', page: 212, pages: 432 },
  { id: 'moby', title: 'Moby-Dick', author: 'Herman Melville', page: 118, pages: 635 },
  { id: 'middlemarch', title: 'Middlemarch', author: 'George Eliot', page: 340, pages: 812 },
];
export const PAGES_PER_HOUR = 40; // Kavya's sample pace
export const hours = (pages: number) => Math.max(1, Math.round(pages / PAGES_PER_HOUR));
