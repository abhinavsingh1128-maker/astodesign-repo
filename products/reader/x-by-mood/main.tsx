// Pick a mood on the rail and read one line from each book that fits it
import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AppShell, Rail, RailSection, RailItem, Button, CoverTile, Surface, Avatar, Toast } from '../../../design-system/components';
import { YourReading, useSaved } from '../_shared/frame';
import { RECS, MOODS, cite } from '../_shared/books';
import type { Mood } from '../_shared/books';
import { coverFor } from '../covers';
import './styles.css';

const BLURB: Record<Mood, string> = {
  Eerie: 'For a dark evening with the lamp on.',
  Tender: 'Love, family and the people we can’t stop thinking about.',
  Adventurous: 'Maps, ships and somebody running.',
  Curious: 'Rabbit holes, riverbanks and logic that bends.',
  Restless: 'Books for when you can’t sit still in your own life.',
};

function ByMood() {
  const [mood, setMood] = useState<Mood>('Eerie');
  const [line, setLine] = useState<Record<string, number>>({});
  const [pick, setPick] = useState<string | null>(null);
  const s = useSaved();
  const books = RECS.filter((r) => r.mood === mood);
  const rowRefs = useRef<Record<string, HTMLLIElement | null>>({});

  const surprise = () => { const others = books.filter((b) => b.id !== pick); setPick(others[Math.floor(Math.random() * others.length)].id); };
  useEffect(() => { if (pick) rowRefs.current[pick]?.scrollIntoView({ block: 'center', behavior: 'smooth' }); }, [pick]);
  const choose = (m: Mood) => { setMood(m); setPick(null); };

  return (
    <>
      <AppShell mainTone="paper"
        sidebar={
          <Rail label="Moods" header={<p className="ds-h4">Shiori</p>} footer={<div className="ds-row"><Avatar name="Kavya Reddy" size="s" gold /><span className="ds-body-s">Kavya</span></div>}>
            <RailSection title="Read something">
              {MOODS.map((m) => <RailItem key={m} label={m} count={RECS.filter((r) => r.mood === m).length} current={m === mood} onClick={() => choose(m)} />)}
            </RailSection>
            <RailSection title="Your shelves">
              <RailItem label="Want to read" count={8 + s.saved.length} href="#mine" />
              <RailItem label="Read in 2026" count={18} href="#mine" />
            </RailSection>
          </Rail>
        }
        header={<><div className="ds-stack" style={{ ['--gap' as string]: '2px' }}><p className="ds-kicker">Picked for Kavya</p><h1 className="ds-h4">{mood}</h1></div><span className="ds-spacer" /><Button variant="primary" onClick={surprise}>Surprise me</Button></>}
        aside={<div className="xre05-aside"><YourReading saved={s.saved} /></div>}
      >
        <div className="xre05-page">
          <header className="xre05-intro">
            <h2 className="ds-h2">{books.length} books feel {mood.toLowerCase()}</h2>
            <p className="ds-body-m ds-muted">{BLURB[mood]} One line from each. Haven’t read any of them yet.</p>
          </header>
          <ul className="xre05-list" aria-label={`${mood} books`}>
            {books.map((r) => {
              const n = (line[r.id] ?? r.quotes.length - 1) % r.quotes.length;
              const q = r.quotes[n];
              return (
                <li key={r.id} ref={(el) => { rowRefs.current[r.id] = el; }}>
                  <Surface tone="paper" texture as="article" className={`xre05-row${pick === r.id ? ' is-pick' : ''}`} aria-current={pick === r.id ? 'true' : undefined}>
                    <div className="xre05-row__quote">
                      {pick === r.id && <p className="ds-label xre05-pick">Tonight’s pick</p>}
                      <blockquote key={n}><p className={q.text.length < 90 ? 'is-short' : ''}>{q.text}</p></blockquote>
                      <p className="ds-caption ds-muted">{cite(r, q)}</p>
                      {r.quotes.length > 1 && <Button variant="ghost" size="sm" onClick={() => setLine((l) => ({ ...l, [r.id]: n + 1 }))}>Another line from it</Button>}
                    </div>
                    <div className="xre05-row__book">
                      <CoverTile src={coverFor(r.title)} title={r.title} byline={r.author} size="m" />
                      <div className="xre05-row__meta">
                        <h3 className="ds-h4">{r.title}</h3>
                        <p className="ds-body-s ds-muted">{r.author} · {r.pages} pages</p>
                      </div>
                      <p className="ds-body-s xre05-row__hook">{r.hook}</p>
                      <Button variant="secondary" size="sm" onClick={() => s.toggle(r.id)}>{s.isSaved(r.id) ? 'Saved' : 'Save for later'}</Button>
                    </div>
                  </Surface>
                </li>
              );
            })}
          </ul>
          <p className="ds-caption ds-muted">Sample hooks and page counts. Every quote is public-domain text published before 1929.</p>
        </div>
      </AppShell>
      {s.toast && <Toast onDone={s.clearToast}>{s.toast}</Toast>}
    </>
  );
}
createRoot(document.getElementById('root')!).render(<ByMood />);
