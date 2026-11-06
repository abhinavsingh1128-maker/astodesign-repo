// Stats first: the challenge ring and charts lead, with shelves and reviews underneath
import { useCallback, useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Surface, Avatar, Button, Tag, Input, Modal, Tabs, Toolbar, Segmented, CoverTile, Ring, Bars, Progress, Table, Toast } from '../../../design-system/components';
import { coverFor } from '../covers';
import { ReaderNav } from '../ReaderNav';
import './styles.css';

type Shelf = 'reading' | 'read' | 'want';
type Book = { id: string; title: string; author: string; genre: string; pages: number; shelf: Shelf; fav?: boolean; rating?: number; year?: number; month?: number; page?: number; review?: string; likes?: number };
const ME = 'Kavya Reddy';
const THIS_YEAR = 2026;
const THIS_MONTH = 10; // November, zero-based
const DAY_OF_YEAR = 310; // 6 November
const GOALS: Record<number, number> = { 2026: 30, 2025: 12 };
const MONTHS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
const GENRES = ['Fiction', 'Fantasy', 'Science fiction', 'Non-fiction'];

const r = (id: string, title: string, author: string, genre: string, pages: number, rating: number, year: number, month: number, extra: Partial<Book> = {}): Book => ({ id, title, author, genre, pages, shelf: 'read', rating, year, month, ...extra });
const w = (id: string, title: string, author: string, genre: string, pages: number): Book => ({ id, title, author, genre, pages, shelf: 'want' });
const START: Book[] = [
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

const Stars = ({ n }: { n: number }) => <span className="xre03-stars" role="img" aria-label={`${n} out of 5`}><span aria-hidden="true">{'★'.repeat(n)}<span className="xre03-stars__off">{'★'.repeat(5 - n)}</span></span></span>;
type Tab = 'all' | 'read' | 'want' | 'fav';
type Draft = { shelf: Shelf; page: string; rating: number; review: string; fav: boolean };

function Profile() {
  const [books, setBooks] = useState(START);
  const [year, setYear] = useState(String(THIS_YEAR));
  const [tab, setTab] = useState<Tab>('all');
  const [genres, setGenres] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('title');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [reviewMin, setReviewMin] = useState('all');
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [openId, setOpenId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<Draft>({ shelf: 'want', page: '', rating: 0, review: '', fav: false });
  const [form, setForm] = useState({ title: '', author: '', pages: '' });
  const [err, setErr] = useState<string>();
  const [toast, setToast] = useState<string | null>(null);
  const clearToast = useCallback(() => setToast(null), []);
  const close = useCallback(() => { setOpenId(null); setAdding(false); setErr(undefined); }, []);
  const book = books.find((b) => b.id === openId);
  const modalOpen = adding || !!book;

  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      const d = document.querySelector<HTMLElement>('.ds-modal');
      if (!d || e.key !== 'Tab') return;
      const f = [...d.querySelectorAll<HTMLElement>('button:not(:disabled), input, textarea')];
      const a = f[0], z = f[f.length - 1], cur = document.activeElement;
      if (e.shiftKey && (cur === a || cur === d)) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && cur === z) { e.preventDefault(); a.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [modalOpen]);

  // Stats: everything from the books.
  const y = Number(year);
  const done = books.filter((b) => b.shelf === 'read' && b.year === y);
  const goal = GOALS[y];
  const pagesRead = done.reduce((n, b) => n + b.pages, 0);
  const avgRating = done.length ? done.reduce((n, b) => n + (b.rating ?? 0), 0) / done.length : 0;
  const longest = done.reduce<Book | null>((a, b) => (!a || b.pages > a.pages ? b : a), null);
  const perMonth = MONTHS.map((label, i) => ({ label, value: done.filter((b) => b.month === i).length, current: y === THIS_YEAR && i === THIS_MONTH }));
  const byRating = [5, 4, 3, 2, 1].map((s) => ({ label: `${s}★`, value: done.filter((b) => b.rating === s).length }));
  const pace = Math.round((goal * DAY_OF_YEAR) / 365);
  const paceLine = y !== THIS_YEAR
    ? (done.length >= goal ? `Goal met, with ${done.length - goal} to spare.` : `Finished ${goal - done.length} short of the goal.`)
    : done.length >= goal ? 'Goal met. The rest of the year is free reading.'
    : done.length >= pace ? `${done.length - pace} ahead of pace. ${goal - done.length} to go.`
    : `${pace - done.length} behind pace. ${goal - done.length} to go by December.`;

  const reading = books.filter((b) => b.shelf === 'reading');
  const counts = { all: books.length, read: books.filter((b) => b.shelf === 'read').length, want: books.filter((b) => b.shelf === 'want').length, fav: books.filter((b) => b.fav).length };
  const shelved = books.filter((b) => (tab === 'all' ? true : tab === 'fav' ? b.fav : b.shelf === tab));
  const q = query.trim().toLowerCase();
  const shown = useMemo(() => {
    const out = shelved.filter((b) => (!genres.length || genres.includes(b.genre)) && (!q || `${b.title} ${b.author}`.toLowerCase().includes(q)));
    const by: Record<string, (a: Book, b: Book) => number> = {
      title: (a, b) => a.title.localeCompare(b.title),
      rating: (a, b) => (b.rating ?? 0) - (a.rating ?? 0),
      pages: (a, b) => b.pages - a.pages,
      recent: (a, b) => (b.year ?? 0) * 12 + (b.month ?? 0) - (a.year ?? 0) * 12 - (a.month ?? 0),
    };
    return [...out].sort(by[sort]);
  }, [shelved, genres, q, sort]); // eslint-disable-line react-hooks/exhaustive-deps
  const clearFilters = () => { setGenres([]); setQuery(''); };
  const reviews = books.filter((b) => b.review).sort((a, b) => (b.year ?? 0) * 12 + (b.month ?? 0) - (a.year ?? 0) * 12 - (a.month ?? 0));
  const shownReviews = reviews.filter((b) => reviewMin === 'all' || b.rating === Number(reviewMin));

  const open = (b: Book) => { setDraft({ shelf: b.shelf, page: String(b.page ?? 0), rating: b.rating ?? 0, review: b.review ?? '', fav: !!b.fav }); setErr(undefined); setOpenId(b.id); };
  const save = () => {
    if (adding) {
      const pages = Number(form.pages);
      if (!form.title.trim() || !form.author.trim()) { setErr('Add a title and an author.'); return; }
      if (!Number.isInteger(pages) || pages < 1) { setErr('Pages must be a whole number above 0.'); return; }
      setBooks((bs) => [...bs, { id: `n${Date.now()}`, title: form.title.trim(), author: form.author.trim(), genre: 'Fiction', pages, shelf: 'want' }]);
      setToast(`Added ${form.title.trim()} to Want to read`);
      setForm({ title: '', author: '', pages: '' }); close(); return;
    }
    if (!book) return;
    const page = Number(draft.page);
    if (draft.shelf === 'reading' && (!Number.isInteger(page) || page < 0 || page > book.pages)) { setErr(`Enter a page from 0 to ${book.pages}.`); return; }
    const finished = draft.shelf === 'read' || (draft.shelf === 'reading' && page === book.pages);
    const newlyDone = finished && book.shelf !== 'read';
    setBooks((bs) => bs.map((b) => (b.id !== book.id ? b : {
      ...b, shelf: finished ? 'read' : draft.shelf, page: finished ? undefined : page, fav: draft.fav,
      rating: draft.rating || undefined, review: draft.review.trim() || undefined,
      year: finished ? (b.year ?? THIS_YEAR) : undefined, month: finished ? (b.month ?? THIS_MONTH) : undefined,
    })));
    setToast(newlyDone ? `Finished ${book.title}. It counts toward the challenge.` : `Saved ${book.title}`);
    close();
  };

  return (
    <Surface tone="night" backdrop className="xre03-page">
      <ReaderNav me={ME} homeHref="#stats" booksHref="#shelves" query={query} onQuery={setQuery} />
      <div className="ds-container xre03-wrap">
        <header className="xre03-me">
          <Avatar name={ME} size="l" gold />
          <div className="xre03-me__text">
            <p className="ds-kicker">Reader in Bengaluru</p>
            <h1 className="ds-h2">{ME}</h1>
            <p className="xre03-me__meta">{counts.read} books read · {books.filter((b) => b.review).length} reviews · 212 following · 348 followers</p>
          </div>
          <Button variant="primary" onClick={() => { setErr(undefined); setAdding(true); }}>Add a book</Button>
        </header>

        <section id="stats" className="xre03-sec" aria-label="Stats and challenge">
          <div className="xre03-sec__head">
            <div><p className="ds-kicker">The year so far</p><h2 className="ds-h3">{y} in reading</h2></div>
            <Segmented label="Year" value={year} onChange={setYear} options={[{ value: '2026', label: '2026' }, { value: '2025', label: '2025' }]} />
          </div>
          <div className="xre03-stats">
            <div className="xre03-ring">
              <Ring size={190} value={done.length} max={goal} label={`${y} reading challenge`} />
              <div><p className="xre03-ring__title">{y} challenge</p><p className="xre03-ring__pace">{paceLine}</p></div>
            </div>
            <div className="xre03-chart">
              <h3 className="ds-label">Books per month</h3>
              <Bars label={`Books per month in ${y}`} data={perMonth} height={150} />
            </div>
            <div className="xre03-chart">
              <h3 className="ds-label">How you rated them</h3>
              <Bars label={`Ratings given in ${y}`} data={byRating} height={150} />
            </div>
            <dl className="xre03-figures">
              <div><dt>Books</dt><dd>{done.length}</dd></div>
              <div><dt>Pages</dt><dd>{pagesRead.toLocaleString('en-IN')}</dd></div>
              <div><dt>Average rating</dt><dd>{avgRating.toFixed(1)}</dd></div>
              <div><dt>Longest</dt><dd className="xre03-figures__text">{longest ? `${longest.title}, ${longest.pages} pages` : 'None yet'}</dd></div>
            </dl>
          </div>
        </section>

        <section id="reading" className="xre03-sec" aria-label="Reading now">
          <div className="xre03-sec__head"><div><p className="ds-kicker">On the bedside table</p><h2 className="ds-h3">Reading now <span className="xre03-n">{reading.length}</span></h2></div></div>
          {reading.length ? (
            <ul className="xre03-reading">
              {reading.map((b) => (
                <li key={b.id} className="xre03-now ds-washi" data-surface="paper">
                  <CoverTile src={coverFor(b.title)} title={b.title} />
                  <div className="xre03-now__main">
                    <p className="xre03-name">{b.title}</p>
                    <p className="ds-caption">{b.author}</p>
                    <Progress value={b.page ?? 0} max={b.pages} label={`${b.title} progress`} showLabel />
                    <p className="ds-caption">Page {b.page} of {b.pages}</p>
                    <Button variant="secondary" size="sm" aria-label={`Update progress: ${b.title}`} onClick={() => open(b)}>Update</Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : <p className="xre03-empty">Nothing on the go. Pick something from Want to read.</p>}
        </section>

        <section id="shelves" className="xre03-sec" aria-label="Shelves">
          <div className="xre03-sec__head"><div><p className="ds-kicker">The library</p><h2 className="ds-h3">Shelves</h2></div></div>
          <Tabs label="Shelves" value={tab} onChange={setTab} tabs={[{ value: 'all', label: 'All', count: counts.all }, { value: 'read', label: 'Read', count: counts.read }, { value: 'want', label: 'Want to read', count: counts.want }, { value: 'fav', label: 'Favourites', count: counts.fav }]} />
          <Toolbar className="xre03-tools" label="Shelf tools" end={<Segmented label="View" value={view} onChange={setView} options={[{ value: 'grid', label: 'Covers' }, { value: 'list', label: 'List' }]} />}>
            <Input className="xre03-search" compact label="Search this shelf" hideLabel placeholder="Search title or author" value={query} onChange={(e) => setQuery(e.target.value)} />
            <label className="xre03-sort"><span className="ds-sr-only">Sort by</span>
              <select className="xre03-select" value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="title">Title A to Z</option><option value="recent">Recently read</option><option value="rating">Highest rated</option><option value="pages">Longest</option>
              </select>
            </label>
          </Toolbar>
          <div className="xre03-chips" role="group" aria-label="Filter by genre">
            {GENRES.map((g) => <Tag key={g} pressed={genres.includes(g)} onClick={() => setGenres((x) => (x.includes(g) ? x.filter((v) => v !== g) : [...x, g]))}>{`${g} ${shelved.filter((b) => b.genre === g).length}`}</Tag>)}
            <span className="xre03-result" role="status">{shown.length} {shown.length === 1 ? 'book' : 'books'}</span>
          </div>
          {shown.length === 0 ? (
            <div className="xre03-empty"><p>No books match on this shelf.</p><Button variant="secondary" size="sm" onClick={clearFilters}>Clear all filters</Button></div>
          ) : view === 'grid' ? (
            <ul className="xre03-grid">
              {shown.map((b) => (
                <li key={b.id} className="xre03-tile ds-washi" data-surface="paper">
                  <CoverTile src={coverFor(b.title)} title={b.title} onClick={() => open(b)} />
                  <p className="xre03-name">{b.title}</p>
                  <p className="ds-caption">{b.author}</p>
                  {b.fav && <Tag variant="accent">Favourite</Tag>}
                  {b.rating ? <Stars n={b.rating} /> : <p className="ds-caption">{b.shelf === 'want' ? 'Want to read' : b.shelf === 'reading' ? `Page ${b.page}` : 'Not rated'}</p>}
                </li>
              ))}
            </ul>
          ) : (
            <Table caption="Books on this shelf" rowKey={(b: Book) => b.id} rows={shown} onRowClick={open}
              columns={[{ key: 'title', label: 'Title' }, { key: 'author', label: 'Author' }, { key: 'genre', label: 'Genre' }, { key: 'pages', label: 'Pages', numeric: true }, { key: 'rating', label: 'Rating', numeric: true, render: (b: Book) => (b.rating ? `★ ${b.rating}` : '') }]} />
          )}
        </section>

        <Surface tone="paper" as="section" id="reviews" className="xre03-reviews" aria-label="Reviews">
          <div className="xre03-sec__head">
            <div><p className="ds-kicker">In Kavya’s words</p><h2 className="ds-h3">Reviews <span className="xre03-n">{reviews.length}</span></h2></div>
            <Segmented label="Filter reviews by rating" value={reviewMin} onChange={setReviewMin} options={[{ value: 'all', label: 'All' }, { value: '5', label: '5★' }, { value: '4', label: '4★' }, { value: '3', label: '3★' }]} />
          </div>
          {shownReviews.length ? (
            <ul className="xre03-revlist">
              {shownReviews.map((b) => (
                <li key={b.id} className="xre03-rev">
                  <CoverTile src={coverFor(b.title)} title={b.title} onClick={() => open(b)} />
                  <div className="xre03-rev__main">
                    <p className="xre03-name">{b.title}</p>
                    <p className="ds-caption">{b.author} · {b.rating ? <Stars n={b.rating} /> : 'Not rated'}</p>
                    <p className="xre03-rev__text">{b.review}</p>
                    <button type="button" className="ds-reaction" aria-pressed={!!liked[b.id]} onClick={() => setLiked((l) => ({ ...l, [b.id]: !l[b.id] }))}>Like<span>{(b.likes ?? 0) + (liked[b.id] ? 1 : 0)}</span></button>
                  </div>
                </li>
              ))}
            </ul>
          ) : <div className="xre03-empty"><p>No reviews with that rating.</p><Button variant="secondary" size="sm" onClick={() => setReviewMin('all')}>Show all reviews</Button></div>}
        </Surface>
      </div>

      <Modal open={modalOpen} onClose={close} title={adding ? 'Add a book' : book?.title}
        actions={<><Button variant="ghost" onClick={close}>Cancel</Button><Button variant="primary" onClick={save}>Save</Button></>}>
        {adding ? <>
          <Input compact label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Input compact label="Author" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
          <Input compact label="Pages" inputMode="numeric" value={form.pages} error={err} onChange={(e) => setForm({ ...form, pages: e.target.value })} />
        </> : book && <>
          <p className="ds-caption">{book.author} · {book.genre} · {book.pages} pages</p>
          <Segmented label="Shelf" value={draft.shelf} onChange={(s) => setDraft({ ...draft, shelf: s })} options={[{ value: 'reading', label: 'Reading' }, { value: 'read', label: 'Read' }, { value: 'want', label: 'Want' }]} />
          {draft.shelf === 'reading' && <Input compact label={`Current page, out of ${book.pages}`} inputMode="numeric" value={draft.page} error={err} onChange={(e) => setDraft({ ...draft, page: e.target.value })} />}
          {draft.shelf !== 'want' && <div className="xre03-rate" role="group" aria-label="Your rating">
            {[1, 2, 3, 4, 5].map((n) => <button key={n} type="button" className={`xre03-star${n <= draft.rating ? ' is-on' : ''}`} aria-label={`${n} out of 5`} aria-pressed={n === draft.rating} onClick={() => setDraft({ ...draft, rating: n === draft.rating ? 0 : n })}>★</button>)}
          </div>}
          {draft.shelf !== 'want' && <Input compact multiline rows={4} label="Your review" value={draft.review} onChange={(e) => setDraft({ ...draft, review: e.target.value })} />}
          <div><Tag pressed={draft.fav} onClick={() => setDraft({ ...draft, fav: !draft.fav })}>Favourite</Tag></div>
        </>}
      </Modal>
      {toast && <Toast onDone={clearToast}>{toast}</Toast>}
    </Surface>
  );
}
createRoot(document.getElementById('root')!).render(<Profile />);
