// How long have you got? Choose an evening, a weekend, a week or a season, and get books that fit
import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Button, CoverTile, Surface, Segmented, Tag } from '../../../design-system/components';
import { ReaderFrame, YourReading, useSaved } from '../_shared/frame';
import { RECS, cite, hours, PAGES_PER_HOUR } from '../_shared/books';
import type { Rec } from '../_shared/books';
import { coverFor } from '../covers';
import './styles.css';

type Slot = 'evening' | 'weekend' | 'week' | 'season';
const SLOTS: Record<Slot, { label: string; max: number; min: number; line: string }> = {
  evening: { label: 'One evening', min: 0, max: 160, line: 'Done before bed. Under four hours.' },
  weekend: { label: 'A weekend', min: 161, max: 320, line: 'Saturday and Sunday, with tea. Five to eight hours.' },
  week: { label: 'A week', min: 321, max: 600, line: 'An hour or two a night for a week.' },
  season: { label: 'A season', min: 601, max: 99999, line: 'Something to live inside for a month or more.' },
};
const inSlot = (r: Rec, s: Slot) => r.pages >= SLOTS[s].min && r.pages <= SLOTS[s].max;
const best = (r: Rec) => r.quotes.reduce((a, b) => (b.text.length < a.text.length ? b : a));
const time = (pages: number) => { const h = hours(pages); return h <= 4 ? `About ${h} hour${h === 1 ? '' : 's'}` : `About ${h} hours · ${Math.ceil(h / 1.5)} evenings`; };

function ByTime() {
  const [slot, setSlot] = useState<Slot>('weekend');
  const s = useSaved();
  const books = RECS.filter((r) => inSlot(r, slot)).sort((a, b) => a.pages - b.pages);
  const [lead, ...rest] = books;
  const q = best(lead);

  return (
    <ReaderFrame toast={s.toast} onToastDone={s.clearToast}>
      <header className="xre08-ask">
        <p className="ds-kicker">Picked for Kavya</p>
        <h1 className="ds-h2">How long have you got?</h1>
        <Segmented label="Time you have" value={slot} onChange={setSlot} options={(Object.keys(SLOTS) as Slot[]).map((k) => ({ value: k, label: `${SLOTS[k].label} · ${RECS.filter((r) => inSlot(r, k)).length}` }))} />
        <p className="ds-body-m ds-muted">{SLOTS[slot].line} Times use your pace of {PAGES_PER_HOUR} pages an hour.</p>
      </header>

      <Surface tone="paper" texture as="section" className="xre08-lead" aria-labelledby="xre08-lead" key={slot}>
        <div className="xre08-lead__quote">
          <p className="ds-label">Fits {SLOTS[slot].label.toLowerCase()} · {time(lead.pages)}</p>
          <blockquote><p className={q.text.length < 90 ? 'is-short' : ''}>{q.text}</p></blockquote>
          <p className="ds-caption ds-muted">{cite(lead, q)}</p>
        </div>
        <div className="xre08-lead__book">
          <CoverTile src={coverFor(lead.title)} title={lead.title} byline={lead.author} size="m" />
          <div className="ds-stack" style={{ ['--gap' as string]: 'var(--space-2)' }}>
            <h2 className="ds-h3" id="xre08-lead">{lead.title}</h2>
            <p className="ds-body-s ds-muted">{lead.author} · {lead.pages} pages</p>
            <p className="ds-body-s">{lead.hook}</p>
            <div className="xre08-actions">
              <Button variant="primary" href={`#read-${lead.id}`}>Start reading</Button>
              <Button variant="ghost" size="sm" onClick={() => s.toggle(lead.id)}>{s.isSaved(lead.id) ? 'Saved' : 'Save for later'}</Button>
            </div>
          </div>
        </div>
      </Surface>

      {rest.length > 0 && (
        <section className="xre08-more" aria-labelledby="xre08-more">
          <h2 className="ds-h4" id="xre08-more">Also fits {SLOTS[slot].label.toLowerCase()}</h2>
          <ul className="xre08-list">
            {rest.map((r) => { const rq = best(r); return (
              <li key={r.id} className="xre08-item">
                <p className="xre08-item__time ds-label">{time(r.pages)}</p>
                <blockquote className="xre08-item__quote"><p>{rq.text}</p></blockquote>
                <div className="xre08-item__book">
                  <p className="xre08-item__title">{r.title}</p>
                  <p className="ds-body-s ds-muted">{r.author} · {r.pages} pages</p>
                  <div className="ds-row" style={{ ['--gap' as string]: '6px' }}><Tag variant="outline">{r.mood}</Tag></div>
                </div>
                <Button variant="secondary" size="sm" onClick={() => s.toggle(r.id)}>{s.isSaved(r.id) ? 'Saved' : 'Save for later'}</Button>
              </li>
            ); })}
          </ul>
        </section>
      )}

      <YourReading saved={s.saved} wide />
    </ReaderFrame>
  );
}
createRoot(document.getElementById('root')!).render(<ByTime />);
