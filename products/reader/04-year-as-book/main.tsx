// The profile is an open book: a year of reading told spread by spread
import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Surface, Book, Spread, Page, Avatar, Tabs, CoverTile, Ring, Bars, Progress, Button } from '../../../design-system/components';
import { START, ME, GOALS, THIS_YEAR, THIS_MONTH, DAY_OF_YEAR, MONTHS } from '../library';
import type { Book as B } from '../library';
import { coverFor } from '../covers';
import { ReaderNav } from '../ReaderNav';
import { Stars } from '../kit';
import './styles.css';

const year = START.filter((b) => b.shelf === 'read' && b.year === THIS_YEAR);
const reading = START.filter((b) => b.shelf === 'reading');
const reviews = START.filter((b) => b.review);
const goal = GOALS[THIS_YEAR], pace = Math.round((goal * DAY_OF_YEAR) / 365);
const pages = year.reduce((n, b) => n + b.pages, 0);
type T = 'read' | 'want' | 'fav';
const PER = 6;

function Year() {
  const [q, setQ] = useState('');
  const [index, setIndex] = useState(0);
  const [tab, setTab] = useState<T>('read');
  const [page, setPage] = useState(0);
  const list = START.filter((b) => (tab === 'fav' ? b.fav : b.shelf === tab) && (!q || `${b.title} ${b.author}`.toLowerCase().includes(q.toLowerCase())));
  const pagesCount = Math.max(1, Math.ceil(list.length / (PER * 2)));
  const at = Math.min(page, pagesCount - 1);
  const leaf = list.slice(at * PER * 2, at * PER * 2 + PER), leaf2 = list.slice(at * PER * 2 + PER, at * PER * 2 + PER * 2);
  const grid = (l: B[]) => <ul className="xre04-covers">{l.map((b) => <li key={b.id}><CoverTile src={coverFor(b.title)} title={b.title} /><p className="ds-caption">{b.rating ? <Stars n={b.rating} /> : b.author}</p></li>)}</ul>;
  const onQuery = (v: string) => { setQ(v); setPage(0); if (v) setIndex(2); };
  return (
    <Surface tone="night" backdrop className="xre04-page">
      <ReaderNav me={ME} homeHref="#top" booksHref="#top" query={q} onQuery={onQuery} />
      <main id="top" className="ds-container xre04-wrap">
        <Book index={index} onIndexChange={setIndex}>
          <Spread title="Frontispiece" left={<Page side="left" kicker="A year of reading" folio={1}>
            <div className="xre04-title"><Avatar name={ME} size="xl" gold /><h1 className="ds-display-l">{ME}</h1><p className="ds-tagline">{THIS_YEAR}, in {year.length} books so far.</p><p className="ds-caption">{START.filter((b) => b.shelf === 'read').length} books read · {reviews.length} reviews · 348 followers</p></div>
          </Page>} right={<Page side="right" kicker="On the bedside table" folio={2}>
            <h2 className="ds-h3">Reading now</h2>
            <ul className="xre04-now">{reading.map((b) => <li key={b.id}><CoverTile src={coverFor(b.title)} title={b.title} /><div><p className="xre04-name">{b.title}</p><p className="ds-caption">{b.author}</p><Progress value={b.page ?? 0} max={b.pages} label={`${b.title} progress`} showLabel /><p className="ds-caption">Page {b.page} of {b.pages}</p></div></li>)}</ul>
          </Page>} />
          <Spread title="The challenge" left={<Page side="left" kicker="The challenge" folio={3}>
            <div className="xre04-ring"><Ring size={200} value={year.length} max={goal} label={`${THIS_YEAR} reading challenge`} /><p className="ds-tagline">{pace > year.length ? `${pace - year.length} behind pace, and in no hurry.` : 'Ahead of pace.'}</p></div>
          </Page>} right={<Page side="right" kicker="The numbers" folio={4}>
            <h2 className="ds-h3">Month by month</h2>
            <Bars label={`Books per month in ${THIS_YEAR}`} height={160} data={MONTHS.map((label, i) => ({ label, value: year.filter((b) => b.month === i).length, current: i === THIS_MONTH }))} />
            <dl className="xre04-figs"><div><dt>Books</dt><dd>{year.length}</dd></div><div><dt>Pages</dt><dd>{pages.toLocaleString('en-IN')}</dd></div><div><dt>Average</dt><dd>★ {(year.reduce((n, b) => n + (b.rating ?? 0), 0) / year.length).toFixed(1)}</dd></div></dl>
          </Page>} />
          <Spread title="The shelves" left={<Page side="left" kicker="The shelves" folio={5}>
            <Tabs label="Shelves" value={tab} onChange={(t) => { setTab(t); setPage(0); }} tabs={[{ value: 'read', label: 'Read', count: START.filter((b) => b.shelf === 'read').length }, { value: 'want', label: 'Want', count: START.filter((b) => b.shelf === 'want').length }, { value: 'fav', label: 'Favourites', count: START.filter((b) => b.fav).length }]} />
            {list.length ? grid(leaf) : <div className="xre04-empty"><p>No books match “{q}”.</p><Button variant="secondary" size="sm" onClick={() => setQ('')}>Clear search</Button></div>}
          </Page>} right={<Page side="right" kicker={`Leaf ${at + 1} of ${pagesCount}`} folio={6}>
            {grid(leaf2)}
            {pagesCount > 1 && <div className="xre04-leaf"><Button variant="ghost" size="sm" disabled={at === 0} onClick={() => setPage(at - 1)}>Earlier books</Button><Button variant="ghost" size="sm" disabled={at >= pagesCount - 1} onClick={() => setPage(at + 1)}>More books</Button></div>}
          </Page>} />
          <Spread title="In Kavya’s words" left={<Page side="left" kicker="Margin notes" folio={7}>
            <h2 className="ds-h3">Recent reviews</h2>
            {reviews.slice(0, 2).map((b) => <article key={b.id} className="xre04-rev"><p className="xre04-name">{b.title} <Stars n={b.rating ?? 0} /></p><p>{b.review}</p></article>)}
          </Page>} right={<Page side="right" kicker="Margin notes" folio={8}>
            {reviews.slice(2).map((b) => <article key={b.id} className="xre04-rev"><p className="xre04-name">{b.title} <Stars n={b.rating ?? 0} /></p><p>{b.review}</p></article>)}
          </Page>} />
        </Book>
      </main>
    </Surface>
  );
}
createRoot(document.getElementById('root')!).render(<Year />);
