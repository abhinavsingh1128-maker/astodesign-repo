// Because you finished: each book you loved leads to three you haven't read, with a line from each
import { createRoot } from 'react-dom/client';
import { Button, CoverTile, Surface } from '../../../design-system/components';
import { ReaderFrame, YourReading, useSaved } from '../_shared/frame';
import { RECS, FINISHED, cite } from '../_shared/books';
import { coverFor } from '../covers';
import './styles.css';

// Highest-rated finished books first; each row shows up to four books it led to.
const ROWS = Object.entries(FINISHED)
  .map(([id, f]) => ({ id, ...f, recs: RECS.filter((r) => r.because === id).slice(0, 4) }))
  .filter((row) => row.recs.length > 0)
  .sort((a, b) => b.stars - a.stars || b.recs.length - a.recs.length);
const shortest = (qs: { text: string }[]) => qs.reduce((a, b) => (b.text.length < a.text.length ? b : a));
const TOP = ROWS[0].recs[0];

function BecauseYouRead() {
  const s = useSaved();
  return (
    <ReaderFrame toast={s.toast} onToastDone={s.clearToast}>
      <header className="xre07-head">
        <div className="ds-stack" style={{ ['--gap' as string]: 'var(--space-1)' }}>
          <p className="ds-kicker">Picked for Kavya</p>
          <h1 className="ds-h2">Because you finished…</h1>
          <p className="ds-body-m ds-muted">Each book you loved, and the unread books it points to. One line from each, so you can hear the voice first.</p>
        </div>
        <div className="xre07-head__top">
          <p className="ds-label">Top pick tonight</p>
          <p className="ds-body-s"><strong>{TOP.title}</strong>, because you gave {ROWS[0].title} {ROWS[0].stars} of 5</p>
          <Button variant="primary" href={`#read-${TOP.id}`}>Start {TOP.title.split(' ').slice(0, 2).join(' ')}</Button>
        </div>
      </header>

      <ol className="xre07-rows">
        {ROWS.map((row) => (
          <li key={row.id} className="xre07-row">
            <div className="xre07-from">
              <p className="ds-label xre07-from__label">You finished</p>
              <CoverTile src={coverFor(row.title)} title={row.title} byline={row.author} size="m" />
              <h2 className="ds-h4">{row.title}</h2>
              <p className="ds-label">{row.stars} of 5 stars</p>
              <p className="ds-body-s xre07-from__line">“{row.line}”<span className="ds-muted"> your review</span></p>
            </div>
            <ul className="xre07-recs" aria-label={`Books that follow ${row.title}`}>
              {row.recs.map((r) => {
                const q = shortest(r.quotes);
                return (
                  <li key={r.id}>
                    <Surface tone="paper" texture as="article" className="xre07-rec">
                      <blockquote className="xre07-rec__quote"><p>{q.text}</p></blockquote>
                      <div className="xre07-rec__book">
                        <CoverTile src={coverFor(r.title)} title={r.title} byline={r.author} size="m" />
                        <div className="xre07-rec__meta">
                          <h3 className="xre07-rec__title">{r.title}</h3>
                          <p className="ds-body-s ds-muted">{r.author} · {r.pages} pages</p>
                        </div>
                      </div>
                      <p className="ds-caption ds-muted">{cite(r, q)}</p>
                      <Button variant="secondary" size="sm" onClick={() => s.toggle(r.id)}>{s.isSaved(r.id) ? 'Saved' : 'Save for later'}</Button>
                    </Surface>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ol>

      <YourReading saved={s.saved} wide />
    </ReaderFrame>
  );
}
createRoot(document.getElementById('root')!).render(<BecauseYouRead />);
