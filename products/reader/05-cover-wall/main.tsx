// A wall of covers grouped by shelf, with reading now on top
import { useCallback, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AppShell, Rail, RailSection, RailItem, Input, Modal, CoverTile, Progress, Ring, Tag, Button, Toolbar, Segmented, EmptyState, Avatar, Toast } from '../../../design-system/components';
import { START, ME, GOALS, THIS_YEAR } from '../library';
import type { Book } from '../library';
import { coverFor } from '../covers';
import { Stars, useTabTrap } from '../kit';
import './styles.css';

const NARROW = '(max-width: 1100px)';
const SHELVES = [{ id: 'read', label: 'Read', test: (b: Book) => b.shelf === 'read' }, { id: 'want', label: 'Want to read', test: (b: Book) => b.shelf === 'want' }, { id: 'fav', label: 'Favourites', test: (b: Book) => !!b.fav }];
const year = START.filter((b) => b.shelf === 'read' && b.year === THIS_YEAR);
const reviews = START.filter((b) => b.review);
// Sample community figures, stable per book so they do not change between visits.
const seed = (t: string) => [...t].reduce((n, c) => (n * 31 + c.charCodeAt(0)) >>> 0, 7);
const likesOf = (b: Book) => 180 + (seed(b.title) % 4200);
const ratingOf = (b: Book) => (3.5 + (seed(b.author + b.title) % 13) / 10).toFixed(1);
const FRIENDS = ['Ritu Sharma', 'Manav Jain', 'Noor Haddad', 'Ife Adeyemi', 'Mei Tanaka'];
const friendsOf = (b: Book) => FRIENDS.filter((_, i) => (seed(b.title) >> i) & 1).slice(0, 3);
const TONE: Record<string, string[]> = { Fiction: ['Literary', 'Character-led'], Fantasy: ['Mythic', 'World-building'], 'Science fiction': ['Big ideas', 'Speculative'], 'Non-fiction': ['True story', 'Ideas'] };
const tagsOf = (b: Book) => [b.genre, ...TONE[b.genre], b.pages < 250 ? 'Short read' : b.pages > 500 ? 'Long read' : 'Medium length'];
const shelfName = (b: Book) => (b.shelf === 'read' ? (b.year ? `Read in ${b.year}` : 'Read') : b.shelf === 'want' ? 'Want to read' : 'Reading now');
const NOTES = { Notifications: 3, Messages: 1, Friends: 2 };

function Wall() {
  useTabTrap();
  const [shelf, setShelf] = useState('all');
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<'title' | 'rating'>('title');
  const [sel, setSel] = useState<Book | null>(START[0]);
  const [sheet, setSheet] = useState(false);
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState<string | null>(null);
  const clearToast = useCallback(() => setToast(null), []);
  const stub = (n: string) => setToast(`${n} is not built in this prototype`);
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
      <div className="xre05-social">
        <Button variant="secondary" size="sm" aria-pressed={!!liked[sel.id]} onClick={() => setLiked((l) => ({ ...l, [sel.id]: !l[sel.id] }))}>{liked[sel.id] ? 'Liked' : 'Like'}</Button>
        <p className="ds-caption"><strong>{(likesOf(sel) + (liked[sel.id] ? 1 : 0)).toLocaleString('en-IN')}</strong> readers like this</p>
      </div>
      <dl className="xre05-facts">
        <div><dt>Community</dt><dd>★ {ratingOf(sel)}</dd></div>
        <div><dt>Yours</dt><dd>{sel.rating ? <Stars n={sel.rating} /> : 'Not rated'}</dd></div>
        <div><dt>Shelf</dt><dd>{shelfName(sel)}</dd></div>
        <div><dt>Time to read</dt><dd>About {Math.max(1, Math.round(sel.pages / 40))} hours</dd></div>
      </dl>
      <div className="xre05-tags">{tagsOf(sel).map((t) => <Tag key={t}>{t}</Tag>)}</div>
      {friendsOf(sel).length > 0 && <div className="xre05-friends"><div>{friendsOf(sel).map((f) => <Avatar key={f} name={f} size="s" />)}</div><p className="ds-caption">{friendsOf(sel).map((f) => f.split(' ')[0]).join(', ')} also read this</p></div>}
      {sel.shelf === 'reading' && <><Progress value={sel.page ?? 0} max={sel.pages} label={`${sel.title} progress`} showLabel /><p className="ds-caption">Page {sel.page} of {sel.pages}</p></>}
      {sel.fav && <Tag variant="accent">Favourite</Tag>}
      {sel.review ? <p className="xre05-review">{sel.review}</p> : <p className="ds-caption">No review yet.</p>}
    </div>
  );
  return (
    <div className="xre05-root">
      <AppShell mainTone="night"
        sidebar={<Rail label="Shelves" header={<><p className="xre05-brand">Shiori</p><Input compact label="Search books" hideLabel placeholder="Search books" value={q} onChange={(e) => setQ(e.target.value)} /><div className="xre05-me"><Avatar name={ME} size="m" gold /><div><p className="xre05-name">{ME}</p><p className="ds-caption">{START.filter((b) => b.shelf === 'read').length} read · {reviews.length} reviews</p></div></div></>}
          footer={<div className="xre05-chal"><Ring size={84} value={year.length} max={GOALS[THIS_YEAR]} label={`${THIS_YEAR} reading challenge`}><span className="xre05-chal__n">{year.length}</span></Ring><div><p className="ds-kicker">{THIS_YEAR} challenge</p><p className="ds-caption">{year.length} of {GOALS[THIS_YEAR]} books, {year.reduce((n, b) => n + b.pages, 0).toLocaleString('en-IN')} pages</p></div></div>}>
          <RailSection title="Discover">
            <RailItem label="Home" current={shelf === 'all' && !q} onClick={() => { setShelf('all'); setQ(''); }} />
            <RailItem label="Recommendations" current={shelf === 'want'} count={START.filter((b) => b.shelf === 'want').length} onClick={() => setShelf('want')} />
            <RailItem label="Browse genres" onClick={() => stub('Browse genres')} />
            <RailItem label="Community" onClick={() => stub('Community')} />
            <RailItem label="Discussions" onClick={() => stub('Discussions')} />
          </RailSection>
          <RailSection title="Inbox">{Object.entries(NOTES).map(([n, c]) => <RailItem key={n} label={n} unread count={c} onClick={() => stub(n)} />)}</RailSection>
          <RailSection title="Shelves"><RailItem label="The whole wall" current={shelf === 'all'} count={START.length} onClick={() => setShelf('all')} />{SHELVES.map((s) => <RailItem key={s.id} label={s.label} current={shelf === s.id} count={START.filter(s.test).length} onClick={() => setShelf(s.id)} />)}</RailSection>
          <RailSection title="Words"><RailItem label="Reviews" current={shelf === 'reviews'} count={reviews.length} onClick={() => setShelf('reviews')} /></RailSection>
        </Rail>}
        header={<><div><p className="ds-kicker">The wall</p><h1 className="ds-h4">{ME}’s books</h1></div></>}
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
      {toast && <Toast onDone={clearToast}>{toast}</Toast>}
    </div>
  );
}
createRoot(document.getElementById('root')!).render(<Wall />);
