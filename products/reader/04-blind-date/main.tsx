// Judge a book by one line: the card flips to reveal the book, and your profile and books sit below
import { useCallback, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Surface, Avatar, Button, CoverTile, Ring, Bars, Progress, Tabs, Toast } from '../../../design-system/components';
import { RECS, rec } from '../_shared/books';
import { START, ME, GOALS, THIS_YEAR, THIS_MONTH, MONTHS } from '../library';
import type { Book } from '../library';
import { coverFor } from '../covers';
import { ReaderNav } from '../ReaderNav';
import { Stars } from '../kit';
import './styles.css';

// One line per book, in a mixed order so one deal is not all one mood.
const DECK = RECS.map((_, k) => RECS[(k * 5) % RECS.length]).map((r) => ({ r, q: r.quotes[r.quotes.length - 1] }));
const DEAL = 9;
// Sample community figures, stable per book.
const seed = (t: string) => [...t].reduce((n, c) => (n * 31 + c.charCodeAt(0)) >>> 0, 7);
const scoreOf = (t: string) => 3.6 + (seed(t) % 12) / 10;
const likesOf = (t: string) => 240 + (seed(t) % 5200);

const year = START.filter((b) => b.shelf === 'read' && b.year === THIS_YEAR);
const reading = START.filter((b) => b.shelf === 'reading');
const reviews = START.filter((b) => b.review);
const goal = GOALS[THIS_YEAR], pages = year.reduce((n, b) => n + b.pages, 0);
const perMonth = MONTHS.map((label, i) => ({ label, value: year.filter((b) => b.month === i).length, current: i === THIS_MONTH }));
type Tab = 'list' | 'read' | 'want' | 'fav';
type Tile = { id: string; title: string; author: string; rating?: number };

function BlindDate() {
  const [start, setStart] = useState(0);
  const [open, setOpen] = useState<string[]>([]);
  const [list, setList] = useState<string[]>([]);
  const [tab, setTab] = useState<Tab>('list');
  const [q, setQ] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const clear = useCallback(() => setToast(null), []);
  const hand = Array.from({ length: DEAL }, (_, k) => DECK[(start + k) % DECK.length]);
  const shown = hand.filter((h) => open.includes(h.r.id)).length;
  const deal = () => { setStart((n) => (n + DEAL) % DECK.length); setOpen([]); };
  const toggleList = (id: string) => {
    const on = list.includes(id);
    setList((l) => (on ? l.filter((x) => x !== id) : [...l, id]));
    setToast(on ? `Removed ${rec(id).title} from My list` : `Added ${rec(id).title} to My list`);
  };
  const fromLib = (f: (b: Book) => boolean): Tile[] => START.filter(f).map((b) => ({ id: b.id, title: b.title, author: b.author, rating: b.rating }));
  const shelves: Record<Tab, Tile[]> = {
    list: list.map((id) => ({ id, title: rec(id).title, author: rec(id).author })),
    read: fromLib((b) => b.shelf === 'read'),
    want: fromLib((b) => b.shelf === 'want'),
    fav: fromLib((b) => !!b.fav),
  };
  const needle = q.trim().toLowerCase();
  const tiles = shelves[tab].filter((t) => !needle || `${t.title} ${t.author}`.toLowerCase().includes(needle));
  const onQuery = (v: string) => { setQ(v); if (v && tab === 'list') setTab('read'); };

  return (
    <Surface tone="night" backdrop className="xre04-page">
      <ReaderNav me={ME} homeHref="#top" booksHref="#mybooks" query={q} onQuery={onQuery} />
      <main id="top" className="ds-container xre04-wrap">
        <header className="xre04-me">
          <Avatar name={ME} size="l" gold />
          <div className="xre04-me__text">
            <p className="ds-kicker">Reader in Bengaluru</p>
            <h1 className="ds-h2">{ME}</h1>
            <p className="xre04-me__meta">{shelves.read.length} books read · {reviews.length} reviews · 212 following · 348 followers</p>
          </div>
        </header>

        <section className="xre04-sec" aria-label="Blind date">
          <div className="xre04-sec__head">
            <div><p className="ds-kicker">Blind date</p><h2 className="ds-h3">Judge a book by one line</h2></div>
            <div className="xre04-sec__end"><p className="ds-label" role="status">{shown} of {DEAL} revealed</p><Button variant="primary" onClick={deal}>Deal new lines</Button></div>
          </div>
          <ul className="xre04-grid">
            {hand.map(({ r, q: line }) => {
              const isOpen = open.includes(r.id), added = list.includes(r.id), score = scoreOf(r.title);
              return (
                <li key={r.id} className={`xre04-flip${isOpen ? ' is-open' : ''}`}>
                  <div className="xre04-flip__in">
                    <article className="xre04-face ds-washi" data-surface="paper" inert={isOpen} aria-label="A hidden book">
                      <p className="ds-label">{r.mood} · {r.pages} pages</p>
                      <blockquote className="xre04-line">{line.text}</blockquote>
                      <Button variant="ghost" size="sm" onClick={() => setOpen((o) => [...o, r.id])}>Reveal the book</Button>
                    </article>
                    <article className="xre04-face xre04-face--back ds-washi" data-surface="paper" inert={!isOpen} aria-label={r.title}>
                      <div className="xre04-book">
                        <CoverTile src={coverFor(r.title)} title={r.title} />
                        <div className="xre04-book__text">
                          <h3 className="ds-h4">{r.title}</h3>
                          <p className="ds-caption">{r.author}, {r.year}</p>
                          <p className="xre04-stars"><Stars n={Math.round(score)} /> {score.toFixed(1)}</p>
                          <p className="ds-caption">{likesOf(r.title).toLocaleString('en-IN')} readers like this</p>
                          <p className="ds-caption">{r.pages} pages · {r.mood}</p>
                        </div>
                      </div>
                      <div className="xre04-face__foot">
                        <Button variant="secondary" size="sm" aria-pressed={added} onClick={() => toggleList(r.id)}>{added ? 'On my list' : 'Add to my list'}</Button>
                        <Button variant="ghost" size="sm" onClick={() => setOpen((o) => o.filter((x) => x !== r.id))}>Flip back</Button>
                      </div>
                    </article>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <section id="mybooks" className="xre04-sec" aria-label="My books">
          <div className="xre04-sec__head"><div><p className="ds-kicker">My books</p><h2 className="ds-h3">{THIS_YEAR} in reading</h2></div></div>
          <div className="xre04-stats">
            <div className="xre04-ring"><Ring size={170} value={year.length} max={goal} label={`${THIS_YEAR} reading challenge`} /><p className="ds-caption">{goal - year.length} to go in the {THIS_YEAR} challenge</p></div>
            <div><h3 className="ds-label">Books per month</h3><Bars label={`Books per month in ${THIS_YEAR}`} data={perMonth} height={130} /></div>
            <dl className="xre04-figs">
              <div><dt>Books</dt><dd>{year.length}</dd></div>
              <div><dt>Pages</dt><dd>{pages.toLocaleString('en-IN')}</dd></div>
              <div><dt>Average</dt><dd>★ {(year.reduce((n, b) => n + (b.rating ?? 0), 0) / year.length).toFixed(1)}</dd></div>
              <div><dt>On my list</dt><dd>{list.length}</dd></div>
            </dl>
          </div>
          <ul className="xre04-now" aria-label="Reading now">
            {reading.map((b) => <li key={b.id} className="ds-washi" data-surface="paper"><CoverTile src={coverFor(b.title)} title={b.title} /><div><p className="xre04-name">{b.title}</p><p className="ds-caption">{b.author}</p><Progress value={b.page ?? 0} max={b.pages} label={`${b.title} progress`} showLabel /><p className="ds-caption">Page {b.page} of {b.pages}</p></div></li>)}
          </ul>
          <Tabs label="Shelves" value={tab} onChange={setTab} tabs={[{ value: 'list', label: 'My list', count: shelves.list.length }, { value: 'read', label: 'Read', count: shelves.read.length }, { value: 'want', label: 'Want to read', count: shelves.want.length }, { value: 'fav', label: 'Favourites', count: shelves.fav.length }]} />
          {tiles.length ? <ul className="xre04-shelf">{tiles.map((t) => <li key={t.id} className="ds-washi" data-surface="paper"><CoverTile src={coverFor(t.title)} title={t.title} /><p className="xre04-tile">{t.title}</p><p className="ds-caption">{t.author}</p>{t.rating && <Stars n={t.rating} />}</li>)}</ul>
            : <p className="xre04-empty">{needle ? `No books match “${q.trim()}” on this shelf.` : 'Nothing here yet. Reveal a book above and add it to your list.'}</p>}
        </section>

        <section className="xre04-revs ds-washi" data-surface="paper" aria-label="Reviews">
          <p className="ds-kicker">In Kavya’s words</p><h2 className="ds-h3">Reviews <span className="ds-caption">{reviews.length}</span></h2>
          <ul>{reviews.map((b) => <li key={b.id}><p className="xre04-name">{b.title} <Stars n={b.rating ?? 0} /></p><p className="xre04-rev">{b.review}</p></li>)}</ul>
        </section>
      </main>
      {toast && <Toast onDone={clear}>{toast}</Toast>}
    </Surface>
  );
}
createRoot(document.getElementById('root')!).render(<BlindDate />);
