// The workspace arrives as a morning edition: headlines first, replies on every story
import { useCallback, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AppShell, Button, Tag, Segmented, EmptyState, Toast } from '../../../design-system/components';
import { ChatRail, Composer, Talk, conv, title, allMsgs, first, mine, rich } from '../kit';
import type { Msg } from '../kit';
import './styles.css';

const STORIES = [
  { id: 'launch', conv: 'launch-week', head: 'Legal waits on your word as pricing copy goes final', lead: true },
  { id: 'hiring', conv: 'hiring', head: 'Panel splits on the product design hire' },
  { id: 'support', conv: 'support-escalations', head: 'Meridian Freight wants deleted channels for an audit' },
  { id: 'crit', conv: 'design-crit', head: 'Composer v3 ready, crit moves to Monday' },
  { id: 'search', conv: 'eng-platform', head: 'Search rebuilt, but archived channels were skipped' },
  { id: 'billing', conv: 'billing-migration', head: 'Test invoices clean, three tax lines still off' },
  { id: 'all', conv: 'announcements', head: 'All-hands moves to Tuesday, office closed Wednesday' },
  { id: 'manav', conv: 'dm-manav', head: 'Manav wants 15 minutes about on-call' },
  { id: 'random', conv: 'random', head: 'A second persimmon tart has been confirmed' },
];
const fresh = (id: string) => { const m = allMsgs(conv(id)).filter((x) => x.isNew); return m.length ? m : allMsgs(conv(id)); };

function Paper() {
  const [section, setSection] = useState<string | undefined>();
  const [view, setView] = useState<'all' | 'unread'>('all');
  const [read, setRead] = useState<Record<string, boolean>>({});
  const [open, setOpen] = useState<string | null>(null);
  const [extra, setExtra] = useState<Record<string, Msg[]>>({});
  const [toast, setToast] = useState<string | null>(null);
  const clear = useCallback(() => setToast(null), []);
  const list = STORIES.filter((s) => (!section || s.conv === section) && (view === 'all' || !read[s.id]));
  const unread = STORIES.filter((s) => !read[s.id]).length;
  const count = (id: string) => { const s = STORIES.find((x) => x.conv === id); return s && !read[s.id] ? fresh(id).length : 0; };
  return (
    <AppShell
      sidebar={<ChatRail current={section} onPick={(id) => setSection(section === id ? undefined : id)} counts={(c) => count(c.id)} />}
      header={<><Button variant="primary" size="sm" disabled={!unread} onClick={() => { setRead(Object.fromEntries(STORIES.map((s) => [s.id, true]))); setToast('Edition read. Nothing else until the afternoon.'); }}>Mark edition read</Button><span className="ds-spacer" /><Segmented label="Stories" value={view} onChange={setView} options={[{ value: 'all', label: `All ${STORIES.length}` }, { value: 'unread', label: `Unread ${unread}` }]} /></>}>
      <div className="xch04-paper">
        <header className="xch04-mast">
          <p className="ds-kicker">Harbour Studio · Friday 6 November</p>
          <h1 className="ds-display-l">The Morning Edition</h1>
          <p className="xch04-mast__sub">{STORIES.length} stories from {new Set(STORIES.map((s) => s.conv)).size} conversations since you left.</p>
        </header>
        {list.length === 0 && <EmptyState title="You are all caught up" body="The next edition lands this afternoon." action={<Button variant="secondary" size="sm" onClick={() => { setView('all'); setSection(undefined); }}>Show every story</Button>} />}
        <div className="xch04-grid">
          {list.map((s) => {
            const c = conv(s.conv), msgs = fresh(s.conv), ppl = [...new Set(msgs.map((m) => first(m.who)))], isOpen = open === s.id;
            return (
              <article key={s.id} className={`xch04-story${s.lead && !section ? ' is-lead' : ''}${isOpen ? ' is-open' : ''}${read[s.id] ? ' is-read' : ''}`}>
                <p className="ds-kicker">{title(c)}</p>
                <h2 className={s.lead && !section ? 'ds-h2' : 'ds-h3'}>{s.head}</h2>
                <p className="xch04-deck">{rich((allMsgs(c).find((m) => m.text.includes('@Abhinav')) ?? msgs[0]).text)}</p>
                <p className="ds-caption">{ppl.join(', ')} · {msgs.length} new {msgs.length === 1 ? 'message' : 'messages'}</p>
                <div className="xch04-actions">
                  <Button variant="secondary" size="sm" aria-expanded={isOpen} onClick={() => { setOpen(isOpen ? null : s.id); setRead((r) => ({ ...r, [s.id]: true })); }}>{isOpen ? 'Close' : 'Read and reply'}</Button>
                  {read[s.id] ? <Tag variant="selected">Read</Tag> : <Button variant="ghost" size="sm" onClick={() => setRead((r) => ({ ...r, [s.id]: true }))}>Mark read</Button>}
                </div>
                {isOpen && <div className="xch04-talk"><Talk list={[...allMsgs(c), ...(extra[s.conv] ?? [])]} /><Composer primary={false} placeholder={`Reply in ${title(c)}`} onSend={(t) => setExtra((x) => ({ ...x, [s.conv]: [...(x[s.conv] ?? []), mine(t)] }))} /></div>}
              </article>
            );
          })}
        </div>
      </div>
      {toast && <Toast onDone={clear}>{toast}</Toast>}
    </AppShell>
  );
}
createRoot(document.getElementById('root')!).render(<Paper />);
