// A ledger of first lines: scan the opening sentence of every recommended book, open the one that hooks you
import { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Button, CoverTile, Surface, Table, Toolbar, Segmented, Tag } from '../../../design-system/components';
import { ReaderFrame, YourReading, useSaved } from '../_shared/frame';
import { RECS, cite, hours } from '../_shared/books';
import type { Rec } from '../_shared/books';
import { coverFor } from '../covers';
import './styles.css';

type Len = 'all' | 'short' | 'mid' | 'long';
const LEN: Record<Len, (r: Rec) => boolean> = { all: () => true, short: (r) => r.pages < 300, mid: (r) => r.pages >= 300 && r.pages <= 600, long: (r) => r.pages > 600 };
const ROWS = RECS.filter((r) => r.quotes.some((q) => q.opening)).map((r) => ({ ...r, first: r.quotes.find((q) => q.opening)! }));
type Row = (typeof ROWS)[number];

function FirstLines() {
  const [len, setLen] = useState<Len>('all');
  const [sort, setSort] = useState<{ key: string; dir: 'asc' | 'desc' }>({ key: 'pages', dir: 'asc' });
  const [sel, setSel] = useState<string>('peterpan');
  const s = useSaved();

  const rows = useMemo(() => {
    const out = ROWS.filter(LEN[len]);
    const k = sort.key as 'pages' | 'year' | 'title';
    out.sort((a, b) => (k === 'title' ? a.title.localeCompare(b.title) : a[k] - b[k]) * (sort.dir === 'asc' ? 1 : -1));
    return out;
  }, [len, sort]);
  const r: Row = ROWS.find((x) => x.id === sel)!;
  const more = r.quotes.find((q) => !q.opening);
  const onSort = (key: string) => setSort((p) => ({ key, dir: p.key === key && p.dir === 'asc' ? 'desc' : 'asc' }));

  return (
    <ReaderFrame toast={s.toast} onToastDone={s.clearToast}>
      <header className="ds-stack" style={{ ['--gap' as string]: 'var(--space-1)' }}>
        <p className="ds-kicker">Picked for Kavya</p>
        <h1 className="ds-h2">First lines</h1>
        <p className="ds-body-m ds-muted">The opening sentence of {ROWS.length} books you haven’t read. Most books decide whether you stay in the first line.</p>
      </header>

      <div className="xre06-body">
        <section className="xre06-ledger" aria-label="First lines">
          <Toolbar label="Filter first lines" end={<span className="ds-body-s ds-muted">{rows.length} books</span>}>
            <Segmented label="Length" value={len} onChange={(v) => setLen(v)} options={[{ value: 'all', label: 'Any length' }, { value: 'short', label: 'Under 300 pages' }, { value: 'mid', label: '300–600' }, { value: 'long', label: '600+' }]} />
          </Toolbar>
          <Table caption="Recommended books by first line" rows={rows} rowKey={(x) => x.id} selectedKey={sel} onRowClick={(x) => setSel(x.id)} sort={sort} onSort={onSort}
            columns={[
              { key: 'first', label: 'First line', sortable: false, render: (x) => <span className="xre06-line">{x.first.text}</span> },
              { key: 'title', label: 'Book', render: (x) => <span className="xre06-book"><span className="xre06-book__t">{x.title}</span><span className="xre06-book__a">{x.author}</span></span>, width: '210px' },
              { key: 'pages', label: 'Pages', numeric: true, width: '90px' },
            ]} />
        </section>

        <aside className="xre06-side">
          <Surface tone="paper" texture as="section" className="xre06-detail" aria-live="polite" aria-labelledby="xre06-title">
            <div className="xre06-detail__top">
              <CoverTile src={coverFor(r.title)} title={r.title} byline={r.author} size="m" />
              <div className="ds-stack" style={{ ['--gap' as string]: 'var(--space-1)' }}>
                <h2 className="ds-h3" id="xre06-title">{r.title}</h2>
                <p className="ds-body-s ds-muted">{r.author} · {r.year}</p>
                <div className="ds-row" style={{ ['--gap' as string]: '6px' }}><Tag variant="outline">{r.mood}</Tag><Tag variant="outline">{r.pages} pages</Tag></div>
              </div>
            </div>
            <p className="ds-body-m">{r.hook}</p>
            {more && <blockquote className="xre06-more"><p>{more.text}</p><footer className="ds-caption ds-muted">{cite(r, more)}</footer></blockquote>}
            <p className="ds-caption ds-muted">About {hours(r.pages)} hours at your pace. First line: {r.first.where}.</p>
            <div className="xre06-detail__actions">
              <Button variant="primary" href={`#read-${r.id}`}>Read on</Button>
              <Button variant="secondary" size="sm" onClick={() => s.toggle(r.id)}>{s.isSaved(r.id) ? 'Saved' : 'Save for later'}</Button>
            </div>
          </Surface>
          <YourReading saved={s.saved} />
        </aside>
      </div>
    </ReaderFrame>
  );
}
createRoot(document.getElementById('root')!).render(<FirstLines />);
