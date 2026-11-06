// A reader's year as a dated diary: what you read, when, and what you thought
import { useCallback, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Surface, Avatar, Tabs, Tag, Input, Button, CoverTile, Ring, Bars, Progress, Toast } from '../../../design-system/components';
import { START, ME, GOALS, THIS_YEAR, THIS_MONTH, MONTHS } from '../library';
import { coverFor } from '../covers';
import { ReaderNav } from '../ReaderNav';
import { Stars } from '../kit';
import './styles.css';

const NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
type Note = { id: string; text: string };
const finished = START.filter((b) => b.shelf === 'read');
const reading = START.filter((b) => b.shelf === 'reading');

function Diary() {
  const [q, setQ] = useState('');
  const [year, setYear] = useState(THIS_YEAR);
  const [only, setOnly] = useState(false);
  const [month, setMonth] = useState<number | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [line, setLine] = useState('');
  const [shelf, setShelf] = useState<'want' | 'fav'>('want');
  const [toast, setToast] = useState<string | null>(null);
  const clear = useCallback(() => setToast(null), []);
  const inYear = finished.filter((b) => b.year === year);
  const match = q.trim().toLowerCase();
  const months = [...Array(12).keys()].reverse().filter((m) => month === null || m === month).map((m) => ({ m, books: inYear.filter((b) => b.month === m && (!only || b.review) && (!match || `${b.title} ${b.author}`.toLowerCase().includes(match))) })).filter((x) => x.books.length);
  const next = START.filter((b) => (shelf === 'fav' ? b.fav : b.shelf === 'want'));
  const add = () => { if (!line.trim()) return; setNotes((n) => [{ id: `n${Date.now()}`, text: line.trim() }, ...n]); setLine(''); setToast('Added to today'); };
  return (
    <Surface tone="night" backdrop className="xre06-page">
      <ReaderNav me={ME} homeHref="#top" booksHref="#next" query={q} onQuery={setQ} />
      <div id="top" className="ds-container xre06-grid">
        <aside className="xre06-side">
          <div className="xre06-me"><Avatar name={ME} size="l" gold /><div><p className="ds-kicker">The diary of</p><h1 className="ds-h3">{ME}</h1></div></div>
          <div className="xre06-ring"><Ring size={150} value={inYear.length} max={GOALS[year]} label={`${year} reading challenge`} /><p className="ds-caption">{year} challenge · {inYear.reduce((n, b) => n + b.pages, 0).toLocaleString('en-IN')} pages</p></div>
          <div className="xre06-years">{[2026, 2025].map((y) => <Tag key={y} pressed={year === y} onClick={() => { setYear(y); setMonth(null); }}>{String(y)}</Tag>)}</div>
          <Bars label={`Books per month in ${year}`} height={90} data={MONTHS.map((label, i) => ({ label, value: inYear.filter((b) => b.month === i).length, current: year === THIS_YEAR && i === THIS_MONTH }))} />
          <div className="xre06-months" role="group" aria-label="Jump to a month">{NAMES.map((n, i) => <Tag key={n} pressed={month === i} onClick={() => setMonth(month === i ? null : i)}>{n.slice(0, 3)}</Tag>)}</div>
        </aside>
        <main className="xre06-book ds-washi" data-surface="paper">
          {year === THIS_YEAR && month === null && <section className="xre06-today">
            <p className="ds-kicker">Today, Friday 6 November</p>
            <h2 className="ds-h3">On the go</h2>
            <ul className="xre06-now">{reading.map((b) => <li key={b.id}><p className="xre06-name">{b.title}</p><p className="ds-caption">{b.author} · page {b.page} of {b.pages}</p><Progress value={b.page ?? 0} max={b.pages} label={`${b.title} progress`} showLabel /></li>)}</ul>
            {notes.map((n) => <p key={n.id} className="xre06-note">{n.text}</p>)}
            <div className="xre06-add"><Input compact label="One line for today" placeholder="What stayed with you?" value={line} onChange={(e) => setLine(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') add(); }} /><Button variant="primary" size="sm" disabled={!line.trim()} onClick={add}>Add line</Button></div>
          </section>}
          <div className="xre06-filter"><Tag pressed={only} onClick={() => setOnly(!only)}>Only entries with a review</Tag></div>
          {months.length === 0 && <div className="xre06-empty"><p>No entries match.</p><Button variant="secondary" size="sm" onClick={() => { setOnly(false); setMonth(null); setQ(''); }}>Clear all filters</Button></div>}
          {months.map(({ m, books }) => (
            <section key={m} className="xre06-month" aria-label={NAMES[m]}>
              <h2 className="ds-h3">{NAMES[m]} <span className="ds-caption">{books.length} {books.length === 1 ? 'book' : 'books'}</span></h2>
              {books.map((b) => <article key={b.id} className="xre06-entry"><CoverTile src={coverFor(b.title)} title={b.title} /><div><p className="xre06-name">Finished {b.title}</p><p className="ds-caption">{b.author} · {b.pages} pages</p>{b.rating && <Stars n={b.rating} />}{b.review && <p className="xre06-review">{b.review}</p>}</div></article>)}
            </section>
          ))}
          <section id="next" className="xre06-next">
            <p className="ds-kicker">Pages not yet written</p>
            <h2 className="ds-h3">Next up</h2>
            <Tabs label="Shelves" value={shelf} onChange={setShelf} tabs={[{ value: 'want', label: 'Want to read', count: START.filter((b) => b.shelf === 'want').length }, { value: 'fav', label: 'Favourites', count: START.filter((b) => b.fav).length }]} />
            <ul className="xre06-covers">{next.map((b) => <li key={b.id}><CoverTile src={coverFor(b.title)} title={b.title} /></li>)}</ul>
          </section>
        </main>
      </div>
      {toast && <Toast onDone={clear}>{toast}</Toast>}
    </Surface>
  );
}
createRoot(document.getElementById('root')!).render(<Diary />);
