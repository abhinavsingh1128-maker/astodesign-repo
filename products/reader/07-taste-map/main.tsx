// A map of your taste: every book plotted by length and rating
import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Surface, Avatar, Tabs, Tag, Button, CoverTile, Ring, Progress } from '../../../design-system/components';
import { START, ME, GOALS, THIS_YEAR, GENRES } from '../library';
import type { Book } from '../library';
import { coverFor } from '../covers';
import { ReaderNav } from '../ReaderNav';
import { Stars } from '../kit';
import './styles.css';

const BANDS = [{ label: 'Under 250', lo: 0, hi: 250 }, { label: '250 to 350', lo: 250, hi: 350 }, { label: '350 to 450', lo: 350, hi: 450 }, { label: 'Over 450', lo: 450, hi: 9999 }];
const RATES = [5, 4, 3];
const rated = START.filter((b) => b.rating);
const avg = (l: Book[]) => (l.length ? l.reduce((n, b) => n + (b.rating ?? 0), 0) / l.length : 0);
const year = START.filter((b) => b.shelf === 'read' && b.year === THIS_YEAR);

function Map() {
  const [q, setQ] = useState('');
  const [genres, setGenres] = useState<string[]>([]);
  const [sel, setSel] = useState<Book>(rated[0]);
  const [tab, setTab] = useState<'want' | 'fav' | 'read'>('want');
  const visible = (b: Book) => (!genres.length || genres.includes(b.genre)) && (!q || `${b.title} ${b.author}`.toLowerCase().includes(q.toLowerCase()));
  const shown = rated.filter(visible);
  const short = avg(rated.filter((b) => b.pages < 350)), long = avg(rated.filter((b) => b.pages >= 350));
  const best = [...GENRES].sort((a, b) => avg(rated.filter((x) => x.genre === b)) - avg(rated.filter((x) => x.genre === a)))[0];
  const shelf = START.filter((b) => (tab === 'fav' ? b.fav : b.shelf === tab) && visible(b));
  const reviews = START.filter((b) => b.review);
  return (
    <Surface tone="night" backdrop className="xre07-page">
      <ReaderNav me={ME} homeHref="#top" booksHref="#shelves" query={q} onQuery={setQ} />
      <main id="top" className="ds-container xre07-wrap">
        <header className="xre07-head">
          <Avatar name={ME} size="l" gold />
          <div><p className="ds-kicker">The taste of {ME}</p><h1 className="ds-h2">Rates {best.toLowerCase()} highest, and {short >= long ? 'prefers them short' : 'does not mind them long'}</h1><p className="xre07-sub">Books under 350 pages average ★ {short.toFixed(1)}; longer ones ★ {long.toFixed(1)}. From {rated.length} rated books.</p></div>
        </header>
        <div className="xre07-chips" role="group" aria-label="Filter by genre">
          {GENRES.map((g) => <Tag key={g} pressed={genres.includes(g)} onClick={() => setGenres((x) => (x.includes(g) ? x.filter((v) => v !== g) : [...x, g]))}>{`${g} ${rated.filter((b) => b.genre === g).length}`}</Tag>)}
          <span className="ds-caption xre07-count" role="status">{shown.length} on the map</span>
        </div>
        <div className="xre07-layout">
          <section className="xre07-map" aria-label="Books by length and rating">
            <div className="xre07-scroll"><table>
              <caption className="ds-sr-only">Rated books grouped by rating and page count</caption>
              <thead><tr><td />{BANDS.map((b) => <th key={b.label} scope="col" className="ds-label">{b.label}</th>)}</tr></thead>
              <tbody>{RATES.map((r) => <tr key={r}><th scope="row"><Stars n={r} /></th>{BANDS.map((band) => <td key={band.label}><ul>{shown.filter((b) => b.rating === r && b.pages >= band.lo && b.pages < band.hi).map((b) => (
                <li key={b.id}><button type="button" className={`xre07-pin${sel.id === b.id ? ' is-on' : ''}`} aria-label={b.title} aria-pressed={sel.id === b.id} onClick={() => setSel(b)}>{coverFor(b.title) ? <img src={coverFor(b.title)} alt="" /> : <span className="ds-grain">{b.title}</span>}</button></li>
              ))}</ul></td>)}</tr>)}</tbody>
            </table></div>
            {shown.length === 0 && <div className="xre07-empty"><p>No books match.</p><Button variant="secondary" size="sm" onClick={() => { setGenres([]); setQ(''); }}>Clear all filters</Button></div>}
            <p className="ds-caption">Pages increase to the right. Pick a cover to read about it.</p>
          </section>
          <aside className="xre07-card ds-washi" data-surface="paper">
            <CoverTile src={coverFor(sel.title)} title={sel.title} />
            <h2 className="ds-h3">{sel.title}</h2>
            <p className="ds-caption">{sel.author} · {sel.genre} · {sel.pages} pages</p>
            <Stars n={sel.rating ?? 0} />
            <p className="xre07-text">{sel.review ?? 'No review written for this one.'}</p>
          </aside>
        </div>
        <div className="xre07-lower">
          <section className="xre07-panel ds-washi" data-surface="paper" aria-label="Reading now">
            <p className="ds-kicker">Testing the theory</p><h2 className="ds-h3">Reading now</h2>
            <ul className="xre07-now">{START.filter((b) => b.shelf === 'reading').map((b) => <li key={b.id}><p>{b.title}</p><Progress value={b.page ?? 0} max={b.pages} label={`${b.title} progress`} showLabel /></li>)}</ul>
          </section>
          <section className="xre07-panel ds-washi xre07-chal" data-surface="paper" aria-label="Challenge">
            <Ring size={110} value={year.length} max={GOALS[THIS_YEAR]} label={`${THIS_YEAR} reading challenge`} />
            <div><p className="ds-kicker">{THIS_YEAR} challenge</p><p className="ds-caption">{year.length} of {GOALS[THIS_YEAR]} books, {year.reduce((n, b) => n + b.pages, 0).toLocaleString('en-IN')} pages</p></div>
          </section>
        </div>
        <section id="shelves" className="xre07-shelves" aria-label="Shelves">
          <p className="ds-kicker">The library</p><h2 className="ds-h3">Shelves</h2>
          <Tabs label="Shelves" value={tab} onChange={setTab} tabs={[{ value: 'want', label: 'Want to read', count: START.filter((b) => b.shelf === 'want').length }, { value: 'fav', label: 'Favourites', count: START.filter((b) => b.fav).length }, { value: 'read', label: 'Read', count: START.filter((b) => b.shelf === 'read').length }]} />
          <ul className="xre07-covers">{shelf.map((b) => <li key={b.id}><CoverTile src={coverFor(b.title)} title={b.title} /></li>)}</ul>
        </section>
        <section className="xre07-panel ds-washi" data-surface="paper" aria-label="Reviews">
          <p className="ds-kicker">The evidence</p><h2 className="ds-h3">Reviews <span className="ds-caption">{reviews.length}</span></h2>
          <ul className="xre07-revs">{reviews.map((b) => <li key={b.id}><p className="xre07-title">{b.title} <Stars n={b.rating ?? 0} /></p><p className="xre07-text">{b.review}</p></li>)}</ul>
        </section>
      </main>
    </Surface>
  );
}
createRoot(document.getElementById('root')!).render(<Map />);
