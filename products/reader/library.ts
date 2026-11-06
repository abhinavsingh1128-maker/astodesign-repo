// Shared sample library for reader layouts.
export type Shelf = 'reading' | 'read' | 'want';
export type Book = { id: string; title: string; author: string; genre: string; pages: number; shelf: Shelf; fav?: boolean; rating?: number; year?: number; month?: number; page?: number; review?: string; likes?: number };
export const ME = 'Kavya Reddy';
export const THIS_YEAR = 2026;
export const THIS_MONTH = 10; // November, zero-based
export const DAY_OF_YEAR = 310; // 6 November
export const GOALS: Record<number, number> = { 2026: 30, 2025: 12 };
export const MONTHS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
export const GENRES = ['Fiction', 'Fantasy', 'Science fiction', 'Non-fiction'];

const r = (id: string, title: string, author: string, genre: string, pages: number, rating: number, year: number, month: number, extra: Partial<Book> = {}): Book => ({ id, title, author, genre, pages, shelf: 'read', rating, year, month, ...extra });
const w = (id: string, title: string, author: string, genre: string, pages: number): Book => ({ id, title, author, genre, pages, shelf: 'want' });
export const START: Book[] = [
  { id: 'b1', title: 'The Left Hand of Darkness', author: 'Ursula K. Le Guin', genre: 'Science fiction', pages: 304, shelf: 'reading', page: 212 },
  { id: 'b2', title: 'Pachinko', author: 'Min Jin Lee', genre: 'Fiction', pages: 496, shelf: 'reading', page: 88 },
  { id: 'b3', title: 'The Overstory', author: 'Richard Powers', genre: 'Fiction', pages: 502, shelf: 'reading', page: 341 },
  r('b4', 'Piranesi', 'Susanna Clarke', 'Fantasy', 272, 5, 2026, 0, { fav: true, likes: 14, review: 'A house of endless halls that I did not want to leave. The narrator’s calm is the whole trick: you work out what is wrong long before he does, and it hurts more for it.' }),
  r('b5', 'Kitchen', 'Banana Yoshimoto', 'Fiction', 152, 4, 2026, 0),
  r('b6', 'The Remains of the Day', 'Kazuo Ishiguro', 'Fiction', 258, 5, 2026, 1, { fav: true, likes: 22, review: 'Every polite sentence is hiding a wasted life. I finished it on a train and sat through my stop. Nobody writes regret as quietly as this.' }),
  r('b7', 'Braiding Sweetgrass', 'Robin Wall Kimmerer', 'Non-fiction', 408, 4, 2026, 2),
  r('b8', 'A Wizard of Earthsea', 'Ursula K. Le Guin', 'Fantasy', 183, 5, 2026, 2, { fav: true }),
  r('b9', 'Station Eleven', 'Emily St. John Mandel', 'Science fiction', 333, 4, 2026, 3, { likes: 6, review: 'Better on the small things than on the collapse. The travelling orchestra stays with me; some of the plotting at the end felt too neat.' }),
  r('b10', 'The Dispossessed', 'Ursula K. Le Guin', 'Science fiction', 387, 5, 2026, 4, { fav: true }),
  r('b11', 'Educated', 'Tara Westover', 'Non-fiction', 334, 3, 2026, 4, { likes: 3, review: 'Gripping for two thirds. The later chapters repeat themselves, but the question of who gets to tell a family’s story is worth the sag.' }),
  r('b12', 'Circe', 'Madeline Miller', 'Fantasy', 393, 4, 2026, 5),
  r('b13', 'Convenience Store Woman', 'Sayaka Murata', 'Fiction', 163, 4, 2026, 5),
  r('b14', 'Exhalation', 'Ted Chiang', 'Science fiction', 350, 5, 2026, 6, { fav: true, likes: 9, review: 'Each story is one good idea followed honestly to the end. The title piece made me look at my own breath differently, which is a lot to ask of twenty pages.' }),
  r('b15', 'The Wager', 'David Grann', 'Non-fiction', 352, 3, 2026, 7),
  r('b16', 'Tomorrow, and Tomorrow, and Tomorrow', 'Gabrielle Zevin', 'Fiction', 416, 4, 2026, 7),
  r('b17', 'Klara and the Sun', 'Kazuo Ishiguro', 'Science fiction', 303, 4, 2026, 8),
  r('b18', 'The Name of the Rose', 'Umberto Eco', 'Fiction', 536, 4, 2026, 9),
  r('b19', 'Babel', 'R. F. Kuang', 'Fantasy', 545, 3, 2026, 9),
  r('b20', 'Small Things Like These', 'Claire Keegan', 'Fiction', 128, 5, 2026, 10, { fav: true }),
  r('b21', 'The Goldfinch', 'Donna Tartt', 'Fiction', 771, 4, 2025, 1),
  r('b22', 'Project Hail Mary', 'Andy Weir', 'Science fiction', 476, 4, 2025, 3),
  r('b23', 'Gilead', 'Marilynne Robinson', 'Fiction', 247, 5, 2025, 5, { fav: true }),
  r('b24', 'The Fifth Season', 'N. K. Jemisin', 'Fantasy', 468, 5, 2025, 8),
  r('b25', 'Sapiens', 'Yuval Noah Harari', 'Non-fiction', 443, 3, 2025, 10),
  w('b26', 'Middlemarch', 'George Eliot', 'Fiction', 880),
  w('b27', 'The Master and Margarita', 'Mikhail Bulgakov', 'Fiction', 384),
  w('b28', 'Dune', 'Frank Herbert', 'Science fiction', 688),
  w('b29', 'Jonathan Strange & Mr Norrell', 'Susanna Clarke', 'Fantasy', 782),
  w('b30', 'H is for Hawk', 'Helen Macdonald', 'Non-fiction', 300),
  w('b31', 'The Tale of Genji', 'Murasaki Shikibu', 'Fiction', 1216),
];

