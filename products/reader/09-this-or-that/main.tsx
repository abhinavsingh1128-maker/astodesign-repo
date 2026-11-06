// This or that: two unnamed passages at a time, keep the one you'd read on, until one book is left
import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Button, CoverTile, Surface, Progress } from '../../../design-system/components';
import { ReaderFrame, YourReading, useSaved } from '../_shared/frame';
import { RECS, cite, rec } from '../_shared/books';
import type { Rec } from '../_shared/books';
import { coverFor } from '../covers';
import './styles.css';

// Two rounds of eight; each uses one line per book and mixes moods.
const POOLS = [
  ['wuthering', 'hound', 'willows', 'karenina', 'awakening', 'treasure', 'heart', 'secretgarden'],
  ['frankenstein', 'littlewomen', 'alice', 'crime', 'montecristo', 'dracula', 'walden', 'peterpan'],
];
const line = (r: Rec) => r.quotes[r.quotes.length - 1];

function ThisOrThat() {
  const [pool, setPool] = useState(0);
  const [champ, setChamp] = useState(POOLS[0][0]);
  const [next, setNext] = useState(1);
  const [passed, setPassed] = useState<string[]>([]);
  const s = useSaved();
  const ids = POOLS[pool];
  const rounds = ids.length - 1;
  const done = next >= ids.length;
  const challenger = done ? null : ids[next];

  const keep = (winner: string, loser: string) => { setChamp(winner); setPassed((p) => [loser, ...p]); setNext((n) => n + 1); };
  const again = () => { const p = (pool + 1) % POOLS.length; setPool(p); setChamp(POOLS[p][0]); setNext(1); setPassed([]); };

  useEffect(() => {
    if (!challenger) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest('input, textarea')) return;
      if (e.key === 'ArrowLeft') keep(champ, challenger);
      if (e.key === 'ArrowRight') keep(challenger, champ);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  });

  const side = (id: string, other: string, label: string) => {
    const r = rec(id); const q = line(r);
    return (
      <Surface tone="paper" texture as="article" className="xre09-side" key={id} aria-label={`${label}: an unnamed book`}>
        <p className="ds-label xre09-side__label">{label} · {r.pages} pages</p>
        <blockquote className="xre09-side__quote"><p className={q.text.length < 90 ? 'is-short' : ''}>{q.text}</p></blockquote>
        <Button variant="secondary" onClick={() => keep(id, other)}>I’d read on</Button>
      </Surface>
    );
  };

  const w = rec(champ);
  return (
    <ReaderFrame toast={s.toast} onToastDone={s.clearToast}>
      <header className="xre09-head">
        <div className="ds-stack" style={{ ['--gap' as string]: 'var(--space-1)' }}>
          <p className="ds-kicker">Picked for Kavya</p>
          <h1 className="ds-h2">This or that</h1>
          <p className="ds-body-m ds-muted">Two passages, no titles. Keep the one you’d read on. The book that survives is yours for tonight.</p>
        </div>
        <div className="xre09-progress">
          <p className="ds-label">{done ? 'Finished' : `Round ${next} of ${rounds}`}</p>
          <Progress value={next - 1} max={rounds} label="Rounds played" />
        </div>
      </header>

      {challenger ? (
        <section className="xre09-duel" aria-label={`Round ${next}`}>
          {side(champ, challenger, 'This')}
          <p className="xre09-or" aria-hidden="true">or</p>
          {side(challenger, champ, 'That')}
        </section>
      ) : (
        <Surface tone="paper" texture as="section" className="xre09-win" aria-labelledby="xre09-win" aria-live="polite">
          <CoverTile src={coverFor(w.title)} title={w.title} byline={w.author} size="l" />
          <div className="xre09-win__text">
            <p className="ds-label xre09-win__label">Your pick from {ids.length} passages</p>
            <h2 className="ds-h2" id="xre09-win">{w.title}</h2>
            <p className="ds-body-s ds-muted">{w.author} · {w.year} · {w.pages} pages</p>
            <blockquote className="xre09-win__quote"><p>{line(w).text}</p><footer className="ds-caption ds-muted">{cite(w, line(w))}</footer></blockquote>
            <p className="ds-body-m">{w.hook}</p>
            <div className="xre09-actions">
              <Button variant="primary" href={`#read-${w.id}`}>Start reading</Button>
              <Button variant="secondary" size="sm" onClick={() => s.toggle(w.id)}>{s.isSaved(w.id) ? 'Saved' : 'Save for later'}</Button>
              <Button variant="ghost" size="sm" onClick={again}>Play eight more</Button>
            </div>
          </div>
        </Surface>
      )}

      <section className="xre09-passed" aria-labelledby="xre09-passed">
        <h2 className="ds-h4" id="xre09-passed">{passed.length ? 'The ones you passed on' : 'Use ← and → to choose'}</h2>
        {passed.length > 0 ? (
          <ul className="xre09-passed__list">
            {passed.map((id) => { const r = rec(id); return (
              <li key={id} className="xre09-passed__item">
                <span className="xre09-passed__title">{r.title}</span>
                <span className="ds-body-s ds-muted">{r.author}</span>
                <Button variant="ghost" size="sm" onClick={() => s.toggle(id)}>{s.isSaved(id) ? 'Saved' : 'Save anyway'}</Button>
              </li>
            ); })}
          </ul>
        ) : <p className="ds-body-s ds-muted">Titles you pass on appear here, so nothing is lost.</p>}
      </section>

      <YourReading saved={s.saved} wide />
    </ReaderFrame>
  );
}
createRoot(document.getElementById('root')!).render(<ThisOrThat />);
