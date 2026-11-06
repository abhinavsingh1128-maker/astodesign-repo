// Start reading: the home page opens on a quote from a recommended book the reader hasn't read, with the cover and a quiet Keep reading button beside it; reading-now, shelves and a small stats section sit in a quieter strip below.
import { useCallback, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Surface, Button, Tag, Avatar, Input, CoverTile, Tabs, Progress, Ring, EmptyState, Toast, Modal } from '../../../design-system/components';
import { coverFor } from '../covers';
import { ReaderNav } from '../ReaderNav';
import './styles.css';

// ---------------------------------------------------------------- data
// Sample profile. Excerpts are public-domain text, published before 1929.
type Book = { id: string; title: string; author: string; year: number; pages: number; page: number };
const B = (id: string, title: string, author: string, year: number, pages: number, page = 0): Book => ({ id, title, author, year, pages, page });

// Not read, not on a shelf: recommended for Kavya.
const RECOMMENDED: Book[] = [
  B('frankenstein', 'Frankenstein', 'Mary Shelley', 1818, 280),
  B('wuthering', 'Wuthering Heights', 'Emily Brontë', 1847, 416),
  B('karenina', 'Anna Karenina', 'Leo Tolstoy', 1878, 864),
  B('greatexp', 'Great Expectations', 'Charles Dickens', 1861, 505),
  B('alice', "Alice's Adventures in Wonderland", 'Lewis Carroll', 1865, 200),
  B('twocities', 'A Tale of Two Cities', 'Charles Dickens', 1859, 380),
  B('heart', 'Heart of Darkness', 'Joseph Conrad', 1899, 96),
  B('treasure', 'Treasure Island', 'Robert Louis Stevenson', 1883, 292),
];
const READING: Book[] = [
  B('pride', 'Pride and Prejudice', 'Jane Austen', 1813, 432, 212),
  B('moby', 'Moby-Dick', 'Herman Melville', 1851, 635, 118),
  B('middlemarch', 'Middlemarch', 'George Eliot', 1871, 812, 340),
];
const WANT: Book[] = [
  B('dracula', 'Dracula', 'Bram Stoker', 1897, 418),
  B('montecristo', 'The Count of Monte Cristo', 'Alexandre Dumas', 1844, 1276),
  B('crime', 'Crime and Punishment', 'Fyodor Dostoevsky', 1866, 545),
  B('emma', 'Emma', 'Jane Austen', 1815, 474),
  B('littlewomen', 'Little Women', 'Louisa May Alcott', 1868, 449),
  B('secretgarden', 'The Secret Garden', 'Frances Hodgson Burnett', 1911, 331),
  B('karamazov', 'The Brothers Karamazov', 'Fyodor Dostoevsky', 1880, 824),
  B('lesmis', 'Les Misérables', 'Victor Hugo', 1862, 1232),
];
const READ: Book[] = [
  B('janeeyre', 'Jane Eyre', 'Charlotte Brontë', 1847, 532, 532),
  B('persuasion', 'Persuasion', 'Jane Austen', 1817, 249, 249),
  B('dorian', 'The Picture of Dorian Gray', 'Oscar Wilde', 1890, 254, 254),
  B('sense', 'Sense and Sensibility', 'Jane Austen', 1811, 409, 409),
  B('northanger', 'Northanger Abbey', 'Jane Austen', 1817, 250, 250),
  B('gatsby', 'The Great Gatsby', 'F. Scott Fitzgerald', 1925, 180, 180),
  B('dalloway', 'Mrs Dalloway', 'Virginia Woolf', 1925, 216, 216),
  B('timemachine', 'The Time Machine', 'H. G. Wells', 1895, 118, 118),
  B('war', 'The War of the Worlds', 'H. G. Wells', 1898, 192, 192),
  B('jekyll', 'Dr Jekyll and Mr Hyde', 'Robert Louis Stevenson', 1886, 96, 96),
  B('silas', 'Silas Marner', 'George Eliot', 1861, 224, 224),
  B('screw', 'The Turn of the Screw', 'Henry James', 1898, 128, 128),
  B('tess', "Tess of the d'Urbervilles", 'Thomas Hardy', 1891, 432, 432),
  B('innocence', 'The Age of Innocence', 'Edith Wharton', 1920, 362, 362),
  B('antonia', 'My Ántonia', 'Willa Cather', 1918, 238, 238),
  B('ethan', 'Ethan Frome', 'Edith Wharton', 1911, 99, 99),
  B('wild', 'The Call of the Wild', 'Jack London', 1903, 232, 232),
  B('kidnapped', 'Kidnapped', 'Robert Louis Stevenson', 1886, 288, 288),
];
const LIBRARY = [...RECOMMENDED, ...READING, ...WANT, ...READ];
const book = (id: string) => LIBRARY.find((b) => b.id === id)!;

// Why each book was recommended: always a book Kavya has read.
const WHY: Record<string, string> = {
  frankenstein: 'You finished Dr Jekyll and Mr Hyde',
  wuthering: 'You finished Jane Eyre',
  karenina: 'You finished The Age of Innocence',
  greatexp: 'You finished Silas Marner',
  alice: 'A short one for your pace',
  twocities: "You finished Tess of the d'Urbervilles",
  heart: 'You finished The Turn of the Screw',
  treasure: 'You finished Kidnapped',
};

type Excerpt = { bookId: string; chapter: string; text: string; credit?: string };
const EXCERPTS: Excerpt[] = [
  { bookId: 'frankenstein', chapter: 'Chapter V', text: 'It was on a dreary night of November that I beheld the accomplishment of my toils. With an anxiety that almost amounted to agony, I collected the instruments of life around me, that I might infuse a spark of being into the lifeless thing that lay at my feet.' },
  { bookId: 'wuthering', chapter: 'Chapter IX', text: 'Whatever our souls are made of, his and mine are the same.' },
  { bookId: 'karenina', chapter: 'Part One · Chapter I', text: 'Happy families are all alike; every unhappy family is unhappy in its own way.', credit: 'translated by Constance Garnett, 1901' },
  { bookId: 'greatexp', chapter: 'Chapter I', text: 'My father’s family name being Pirrip, and my Christian name Philip, my infant tongue could make of both names nothing longer or more explicit than Pip.' },
  { bookId: 'frankenstein', chapter: 'Chapter XX', text: 'Beware; for I am fearless, and therefore powerful.' },
  { bookId: 'alice', chapter: 'Chapter II · The Pool of Tears', text: '“Curiouser and curiouser!” cried Alice (she was so much surprised, that for the moment she quite forgot how to speak good English).' },
  { bookId: 'wuthering', chapter: 'Chapter I', text: '1801.—I have just returned from a visit to my landlord—the solitary neighbour that I shall be troubled with. This is certainly a beautiful country! In all England, I do not believe that I could have fixed on a situation so completely removed from the stir of society.' },
  { bookId: 'twocities', chapter: 'Book the First · Chapter I', text: 'It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness.' },
  { bookId: 'heart', chapter: 'Part II', text: 'We live, as we dream—alone.' },
  { bookId: 'treasure', chapter: 'Chapter I · The Old Sea-dog at the Admiral Benbow', text: 'Fifteen men on the dead man’s chest— Yo-ho-ho, and a bottle of rum!' },
];

const REVIEWS = [
  { id: 'r1', bookId: 'janeeyre', stars: 5, line: 'She says no, and means it.', body: 'I kept waiting for the book to ask Jane to shrink, and it never does. The last third felt like exhaling after a very long held breath.', when: 'Read in March' },
  { id: 'r2', bookId: 'persuasion', stars: 4, line: 'A second chance, told quietly.', body: 'Nothing happens for two hundred pages and then one letter undoes me. Austen at her most patient, and the better for it.', when: 'Read in June' },
  { id: 'r3', bookId: 'jekyll', stars: 4, line: 'Shorter than its reputation.', body: 'Everyone knows the twist, so the surprise is how much of it is a street-by-street mystery about a door. Read it in one evening.', when: 'Read in September' },
];

const GOAL = 24;
const DAY_OF_YEAR = 310; // 6 November
type ShelfKey = 'rec' | 'reading' | 'want' | 'read';
const stars = (n: number) => `${n} of 5 stars`;

// ---------------------------------------------------------------- page
function Home() {
  const [i, setI] = useState(0);
  const [shelf, setShelf] = useState<ShelfKey>('rec');
  const [q, setQ] = useState('');
  const [saved, setSaved] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [reading, setReading] = useState(false);
  const closeReading = useCallback(() => setReading(false), []);

  const ex = EXCERPTS[i];
  const feat = book(ex.bookId);
  const isSaved = saved.includes(feat.id);
  const next = () => setI((n) => (n + 1) % EXCERPTS.length);
  const other = () => setI((n) => { for (let k = 1; k <= EXCERPTS.length; k++) { const j = (n + k) % EXCERPTS.length; if (EXCERPTS[j].bookId !== ex.bookId) return j; } return n; });
  const save = () => { if (isSaved) return; setSaved((s) => [...s, feat.id]); setToast(`Saved “${feat.title}” to want to read`); };

  const rec = RECOMMENDED.filter((b) => !saved.includes(b.id));
  const want = [...saved.map(book), ...WANT];
  const shelves: Array<{ value: ShelfKey; label: string; books: Book[] }> = [
    { value: 'rec', label: 'Recommended', books: rec },
    { value: 'reading', label: 'Reading now', books: READING },
    { value: 'want', label: 'Want to read', books: want },
    { value: 'read', label: 'Read in 2026', books: READ },
  ];
  const pace = Math.round((GOAL * DAY_OF_YEAR) / 365);
  const behind = Math.max(0, pace - READ.length);
  const current = shelves.find((s) => s.value === shelf)!;
  const shown = useMemo(() => current.books.filter((b) => !q.trim() || `${b.title} ${b.author}`.toLowerCase().includes(q.trim().toLowerCase())), [current, q]);
  const onShelves = READING.length + want.length + READ.length;

  return (
    <Surface tone="paper" texture className="xre03-page">
      <Surface tone="night" as="header" className="xre03-top">
        <ReaderNav me="Kavya Reddy" homeHref="#top" booksHref="#shelves" query={q} onQuery={setQ} />
      </Surface>

      <main id="top" className="ds-container xre03-main">
        {/* ---- the page: a quote from a book you haven't read leads ---- */}
        <section className="xre03-spread ds-enter" aria-labelledby="xre03-from">
          <Surface tone="paper" texture className="xre03-leaf" as="section">
            <header className="xre03-leaf__head">
              <p className="ds-label" id="xre03-from">From a book picked for you</p>
              <p className="ds-label xre03-folio">Passage {i + 1} of {EXCERPTS.length}</p>
            </header>
            <blockquote className="xre03-excerpt" key={i} aria-live="polite">
              <p className={`xre03-excerpt__text ds-body-l${ex.text.length < 90 ? ' is-short' : ''}`}>{ex.text}</p>
              <footer className="xre03-excerpt__cite ds-body-s">{feat.title}, {feat.author} · {ex.chapter} · public domain, {feat.year}{ex.credit ? `, ${ex.credit}` : ''}</footer>
            </blockquote>
            <div className="xre03-leaf__foot">
              <Button variant="ghost" size="sm" onClick={other}>Another book</Button>
              <Button variant="ghost" size="sm" onClick={next}>Next passage →</Button>
            </div>
          </Surface>

          <aside className="xre03-cover" aria-label={`${feat.title}, the book on this page`}>
            <CoverTile src={coverFor(feat.title)} title={feat.title} byline={feat.author} size="l" />
            <div className="xre03-cover__info ds-washi ds-stack" data-surface="paper" style={{ ['--gap' as string]: 'var(--space-2)' }}>
              <h2 className="ds-h3">{feat.title}</h2>
              <p className="ds-body-s ds-muted">{feat.author} · {feat.year} · {feat.pages} pages</p>
              <p className="ds-caption ds-muted">{WHY[feat.id]}. Not on your shelves yet.</p>
              <Button variant="primary" onClick={() => setReading(true)}>Keep reading</Button>
              <Button variant="secondary" size="sm" onClick={save} disabled={isSaved}>{isSaved ? 'Saved to want to read' : 'Save for later'}</Button>
            </div>
          </aside>
        </section>

        {/* ---- the quieter strip ---- */}
        <div className="xre03-strip">
          <header className="xre03-strip__intro">
            <Avatar name="Kavya Reddy" size="l" gold />
            <div className="ds-stack" style={{ ['--gap' as string]: 'var(--space-1)' }}>
              <p className="ds-kicker">Kavya’s shelf</p>
              <h1 className="ds-h2">Kavya Reddy</h1>
            </div>
            <div className="xre03-strip__tags"><Tag variant="outline">Reading since 2019</Tag><Tag variant="outline">{onShelves} books on shelves</Tag></div>
          </header>

          <Surface tone="paper" texture className="xre03-panel" as="section" aria-labelledby="xre03-now">
            <h2 className="ds-h3" id="xre03-now">{READING.length} books open</h2>
            <ul className="xre03-now">
              {READING.map((b) => (
                <li key={b.id} className="xre03-now__row">
                  <CoverTile src={coverFor(b.title)} title={b.title} byline={b.author} size="m" />
                  <div className="xre03-now__body">
                    <p className="xre03-now__title">{b.title}</p>
                    <p className="ds-body-s ds-muted">{b.author}</p>
                    <Progress value={b.page} max={b.pages} label={`${b.title} progress`} showLabel />
                    <p className="ds-caption ds-muted">Page {b.page} of {b.pages}</p>
                  </div>
                  <Button variant="secondary" size="sm" onClick={() => setToast(`Resume from page ${b.page}: the reading view is not built in this prototype`)}>Resume</Button>
                </li>
              ))}
            </ul>
          </Surface>

          <div className="xre03-two">
            <Surface tone="paper" texture className="xre03-panel" as="section" aria-labelledby="xre03-shelves" id="shelves">
              <h2 className="ds-h3" id="xre03-shelves">{current.label}</h2>
              <Tabs label="Shelves" value={shelf} onChange={setShelf} tabs={shelves.map((s) => ({ value: s.value, label: s.label, count: s.books.length }))} />
              {shown.length === 0 ? (
                <EmptyState title="Nothing matches" body={q.trim() ? `No book on this shelf matches “${q}”.` : 'Nothing on this shelf yet.'} action={q.trim() ? <Button variant="secondary" size="sm" onClick={() => setQ('')}>Clear search</Button> : undefined} />
              ) : (
                <ul className="xre03-covers" aria-label={`${current.label}: ${shown.length} books`}>
                  {shown.map((b) => <li key={b.id}><CoverTile src={coverFor(b.title)} title={b.title} byline={b.author} size="m" onClick={shelf === 'rec' ? () => { setI(EXCERPTS.findIndex((e) => e.bookId === b.id)); window.scrollTo({ top: 0, behavior: 'smooth' }); } : undefined} /></li>)}
                </ul>
              )}
              {shelf === 'rec' && <p className="ds-caption ds-muted">Pick a cover to read its page above.</p>}
            </Surface>

            <Surface tone="paper" texture className="xre03-panel xre03-stats" as="section" aria-labelledby="xre03-year" id="year">
              <h2 className="ds-h3" id="xre03-year">2026 reading challenge</h2>
              <div className="xre03-stats__body">
                <Ring value={READ.length} max={GOAL} label="Books read in 2026" size={116} />
                <dl className="xre03-stats__list">
                  <div><dt className="ds-label">Read</dt><dd>{READ.length}</dd></div>
                  <div><dt className="ds-label">Reading</dt><dd>{READING.length}</dd></div>
                  <div><dt className="ds-label">Waiting</dt><dd>{want.length}</dd></div>
                </dl>
              </div>
              <p className="ds-body-s ds-muted">{behind > 0 ? `${behind} book${behind === 1 ? '' : 's'} behind the pace of ${pace}.` : 'On pace for the year.'}</p>
            </Surface>
          </div>

          <section aria-labelledby="xre03-reviews" id="reviews" className="xre03-reviews">
            <h2 className="ds-h3" id="xre03-reviews">What Kavya wrote</h2>
            <ul className="xre03-reviews__list">
              {REVIEWS.map((r) => { const b = book(r.bookId); return (
                <li key={r.id}>
                  <Surface tone="paper" texture className="xre03-review" as="section">
                    <p className="ds-label">{stars(r.stars)} · {r.when}</p>
                    <h3 className="ds-h4">{r.line}</h3>
                    <p className="ds-body-m">{r.body}</p>
                    <p className="ds-caption ds-muted">{b.title}, {b.author}</p>
                  </Surface>
                </li>
              ); })}
            </ul>
          </section>

          <p className="xre03-note ds-caption">Sample profile, recommendations and reviews written for this layout. Passages are public-domain texts published before 1929.</p>
        </div>
      </main>
      {toast && <Toast onDone={() => setToast(null)}>{toast}</Toast>}
      <Modal open={reading} onClose={closeReading} title={feat.title}>
        <p className="ds-caption">{feat.author} · passages picked from this book</p>
        {EXCERPTS.filter((e) => e.bookId === feat.id).map((e) => <blockquote key={e.text} className="xre03-more"><p>{e.text}</p><footer className="ds-caption">{e.chapter}</footer></blockquote>)}
        <p className="ds-caption">The full book is not part of this prototype.</p>
      </Modal>
    </Surface>
  );
}
createRoot(document.getElementById('root')!).render(<Home />);
