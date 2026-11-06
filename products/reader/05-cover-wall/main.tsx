// A wall of covers grouped by shelf, with reading now on top
import { useCallback, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AppShell, Rail, RailSection, RailItem, Input, Modal, CoverTile, Progress, Ring, Tag, Button, Toolbar, Segmented, EmptyState, Avatar } from '../../../design-system/components';
import { START, ME, GOALS, THIS_YEAR } from '../library';
import type { Book } from '../library';
import { coverFor } from '../covers';
import { Stars, useTabTrap } from '../kit';
import './styles.css';

const NARROW = '(max-width: 1100px)';
const SHELVES = [{ id: 'read', label: 'Read', test: (b: Book) => b.shelf === 'read' }, { id: 'want', label: 'Want to read', test: (b: Book) => b.shelf === 'want' }, { id: 'fav', label: 'Favourites', test: (b: Book) => !!b.fav }];
const year = START.filter((b) => b.shelf === 'read' && b.year === THIS_YEAR);
const reviews = START.filter((b) => b.review);

function Wall() {
  useTabTrap();
  const [shelf, setShelf] = useState('all');
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<'title' | 'rating'>('title');
  const [sel, setSel] = useState<Book | null>(START[0]);
  const [sheet, setSheet] = useState(false);
  const close = useCallback(() => setSheet(false), []);
  const match = (b: Book) => !q || `${b.title} ${b.author}`.toLowerCase().includes(q.toLowerCase());
  const order = (l: Book[]) => [...l].sort((a, b) => (sort === 'title' ? a.title.localeCompare(b.title) : (b.rating ?? 0) - (a.rating ?? 0)));
  const groups = SHELVES.filter((s) => shelf === 'all' || shelf === s.id).map((s) => ({ ...s, books: order(START.filter(s.test).filter(match)) })).filter((g) => g.books.length);
  const pick = (b: Book) => { setSel(b); if (matchMedia(NARROW).matches) setSheet(true); };
  const detail = sel && (
    <div className="xre05-detail">
      <CoverTile src={coverFor(sel.title)} title={sel.title} size="l" />
      <h2 className="ds-h3">{sel.title}</h2>
      <p className="ds-caption">{sel.author} · {sel.genre} · {sel.pages} pages</p>
      {sel.rating && <Stars n={sel.rating} />}
      {sel.shelf === 'reading' && <><Progress value={sel.page ?? 0} max={sel.pages} label={`${sel.title} progress`} showLabel /><p className="ds-caption">Page {sel.page} of {sel.pages}</p></>}
      {sel.fav && <Tag variant="accent">Favourite</Tag>}
      {sel.review ? <p className="xre05-review">{sel.review}</p> : <p className="ds-caption">No review yet.</p>}
    </div>
  );
  return (
    <div className="xre05-root">
      <AppShell mainTone="night"
        sidebar={<Rail label="Shelves" header={<div className="xre05-me"><Avatar name={ME} size="m" gold /><div><p className="xre05-name">{ME}</p><p className="ds-caption">{START.filter((b) => b.shelf === 'read').length} read · {reviews.length} reviews</p></div></div>}
          footer={<div className="xre05-chal"><Ring size={84} value={year.length} max={GOALS[THIS_YEAR]} label={`${THIS_YEAR} reading challenge`}><span className="xre05-chal__n">{year.length}</span></Ring><div><p className="ds-kicker">{THIS_YEAR} challenge</p><p className="ds-caption">{year.length} of {GOALS[THIS_YEAR]} books, {year.reduce((n, b) => n + b.pages, 0).toLocaleString('en-IN')} pages</p></div></div>}>
          <RailSection title="Shelves"><RailItem label="The whole wall" current={shelf === 'all'} count={START.length} onClick={() => setShelf('all')} />{SHELVES.map((s) => <RailItem key={s.id} label={s.label} current={shelf === s.id} count={START.filter(s.test).length} onClick={() => setShelf(s.id)} />)}</RailSection>
          <RailSection title="Words"><RailItem label="Reviews" current={shelf === 'reviews'} count={reviews.length} onClick={() => setShelf('reviews')} /></RailSection>
        </Rail>}
        header={<><div><p className="ds-kicker">The wall</p><h1 className="ds-h4">{ME}’s books</h1></div><span className="ds-spacer" /><Input className="xre05-search" compact label="Search the wall" hideLabel placeholder="Search the wall" value={q} onChange={(e) => setQ(e.target.value)} /></>}
        aside={detail}>
        <div className="xre05-wall">
          {shelf !== 'reviews' && <section className="xre05-now" aria-label="Reading now">
            <p className="ds-kicker">Reading now</p>
            <ul>{START.filter((b) => b.shelf === 'reading').map((b) => <li key={b.id}><CoverTile src={coverFor(b.title)} title={b.title} selected={sel?.id === b.id} onClick={() => pick(b)} /><Progress value={b.page ?? 0} max={b.pages} label={`${b.title} progress`} showLabel /></li>)}</ul>
          </section>}
          {shelf === 'reviews' ? (
            <ul className="xre05-revs">{reviews.map((b) => <li key={b.id}><CoverTile src={coverFor(b.title)} title={b.title} onClick={() => pick(b)} /><div className="ds-washi" data-surface="paper"><p className="xre05-name">{b.title}</p><Stars n={b.rating ?? 0} /><p className="xre05-review">{b.review}</p></div></li>)}</ul>
          ) : <>
            <Toolbar label="Wall tools" end={<Segmented label="Sort" value={sort} onChange={setSort} options={[{ value: 'title', label: 'A to Z' }, { value: 'rating', label: 'Top rated' }]} />}><span className="ds-caption">{groups.reduce((n, g) => n + g.books.length, 0)} covers</span></Toolbar>
            {!groups.length && <EmptyState title="No covers match" body="Nothing on this wall has that title or author." action={<Button variant="secondary" size="sm" onClick={() => setQ('')}>Clear search</Button>} />}
            {groups.map((g) => <section key={g.id} aria-label={g.label}><h2 className="ds-h3 xre05-shelf">{g.label} <span className="ds-caption">{g.books.length}</span></h2><ul className="xre05-covers">{g.books.map((b) => <li key={b.id}><CoverTile src={coverFor(b.title)} title={b.title} selected={sel?.id === b.id} onClick={() => pick(b)} /></li>)}</ul></section>)}
          </>}
        </div>
      </AppShell>
      <Modal open={sheet} onClose={close} variant="sheet" title="The book">{detail}</Modal>
    </div>
  );
}
createRoot(document.getElementById('root')!).render(<Wall />);
