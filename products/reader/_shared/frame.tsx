// Shared frame for reader layouts 04–09: the Night nav strip, the Paper page, the "your reading" panel and Save for later.
import { useState } from 'react';
import type { ReactNode } from 'react';
import { Surface, Progress, Ring, Toast } from '../../../design-system/components';
import { READING, READ_COUNT, GOAL, rec } from './books';
import { ReaderNav } from '../ReaderNav';
import './shared.css';

export function ReaderFrame({ children, toast, onToastDone }: { children: ReactNode; toast?: string | null; onToastDone?: () => void }) {
  const [q, setQ] = useState('');
  return (
    <Surface tone="paper" texture className="xrs-page">
      <Surface tone="night" as="header" className="xrs-top">
        <ReaderNav me="Kavya Reddy" homeHref="#top" booksHref="#mine" query={q} onQuery={setQ} />
      </Surface>
      <main id="top" className="ds-container xrs-main">{children}</main>
      <p className="ds-container xrs-note ds-caption">Sample profile, recommendations, hooks and page counts written for these layouts. Every quote is public-domain text published before 1929.</p>
      {toast && <Toast onDone={() => onToastDone?.()}>{toast}</Toast>}
    </Surface>
  );
}

/** Saved-for-later list with a toast message. */
export function useSaved() {
  const [saved, setSaved] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const toggle = (id: string) => {
    const on = saved.includes(id);
    setSaved((s) => (on ? s.filter((x) => x !== id) : [...s, id]));
    setToast(on ? `Removed “${rec(id).title}” from want to read` : `Saved “${rec(id).title}” to want to read`);
  };
  return { saved, isSaved: (id: string) => saved.includes(id), toggle, toast, clearToast: () => setToast(null) };
}

/** The quiet "your reading" panel: reading now, the challenge ring, and what you saved. */
export function YourReading({ saved, wide }: { saved: string[]; wide?: boolean }) {
  return (
    <Surface tone="paper" texture as="section" className={`xrs-yours${wide ? ' is-wide' : ''}`} aria-labelledby="xrs-yours" id="mine">
      <h2 className="ds-h4" id="xrs-yours">Your reading</h2>
      <ul className="xrs-yours__now">
        {READING.map((b) => (
          <li key={b.id}>
            <p className="xrs-yours__title">{b.title}</p>
            <Progress value={b.page} max={b.pages} label={`${b.title} progress`} showLabel />
          </li>
        ))}
      </ul>
      <div className="xrs-yours__ring" id="year">
        <Ring value={READ_COUNT} max={GOAL} label="Books read in 2026" size={88} />
        <div>
          <p className="ds-label">2026 challenge</p>
          <p className="ds-body-s ds-muted">{GOAL - READ_COUNT} to go</p>
          <p className="ds-body-s ds-muted">{saved.length} saved today</p>
        </div>
      </div>
      {saved.length > 0 && <p className="ds-caption ds-muted">Saved: {saved.map((id) => rec(id).title).join(', ')}</p>}
    </Surface>
  );
}
