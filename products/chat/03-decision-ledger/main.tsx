// Every channel opens on what was decided and what is still open; the talk is the evidence
import { useCallback, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AppShell, RailSection, RailItem, Button, Tag, Input, Modal, EmptyState, Segmented, Avatar, StreamDivider, Toast } from '../../../design-system/components';
import { ChatRail, Composer, Talk, conv, title, mine, useNarrow, useTabTrap, ME } from '../kit';
import type { Msg } from '../kit';
import './styles.css';

type Dec = { id: string; conv: string; root: string; q: string; owner: string; due: string; answer?: string };
const START: Dec[] = [
  { id: 'd1', conv: 'launch-week', root: 'lw1', q: 'Is the pricing page copy approved?', owner: ME, due: 'Today, 17:00' },
  { id: 'd2', conv: 'support-escalations', root: 'se1', q: 'Do we commit to exporting deleted channels this quarter?', owner: ME, due: 'Today' },
  { id: 'd3', conv: 'hiring', root: 'hi1', q: 'Yes or no on Lena Okafor?', owner: ME, due: 'Before the weekend' },
  { id: 'd4', conv: 'design-crit', root: 'dc1', q: 'Are the composer v3 slash states ready for crit?', owner: ME, due: 'Monday 12:00' },
  { id: 'd5', conv: 'eng-platform', root: 'ep1', q: 'Do we re-run search on archived channels tonight?', owner: 'Tomas Lindqvist', due: 'Tonight' },
  { id: 'd6', conv: 'billing-migration', root: 'bm1', q: 'What do we do about the three tax mismatches?', owner: 'Ife Adeyemi', due: 'Monday' },
  { id: 'd7', conv: 'launch-week', root: 'lw2', q: 'Who covers the late launch shift?', owner: 'Manav Jain', due: 'Done', answer: 'Noor takes it; paging points at Noor after 18:00.' },
  { id: 'd8', conv: 'billing-migration', root: 'bm2', q: 'Is the invoice email copy final?', owner: ME, due: 'Done', answer: 'Final. Sent as written.' },
  { id: 'd9', conv: 'eng-platform', root: 'ep2', q: 'When does the deploy freeze start?', owner: 'Manav Jain', due: 'Done', answer: 'Thursday 18:00, until launch.' },
  { id: 'd10', conv: 'design-crit', root: 'dc2', q: 'When is the next crit?', owner: 'Kavya Reddy', due: 'Done', answer: 'Monday 12:00, room two.' },
];
const rootOf = (d: Dec) => conv(d.conv).messages.find((m) => m.id === d.root)!;

function Ledger() {
  const narrow = useNarrow(); useTabTrap();
  const [decs, setDecs] = useState(START);
  const [where, setWhere] = useState('all');
  const [who, setWho] = useState<'all' | 'mine'>('all');
  const [sel, setSel] = useState<string | null>(null);
  const [sheet, setSheet] = useState(false);
  const [recording, setRecording] = useState(false);
  const [answer, setAnswer] = useState('');
  const [extra, setExtra] = useState<Record<string, Msg[]>>({});
  const [toast, setToast] = useState<{ t: string; undo?: () => void } | null>(null);
  const clear = useCallback(() => setToast(null), []);
  const closeSheet = useCallback(() => setSheet(false), []);
  const closeRec = useCallback(() => setRecording(false), []);
  const shown = decs.filter((d) => (where === 'all' || d.conv === where) && (who === 'all' || d.owner === ME));
  const open = shown.filter((d) => !d.answer), done = shown.filter((d) => d.answer);
  const d = decs.find((x) => x.id === sel);
  const pick = (id: string) => { setSel(id); if (narrow) setSheet(true); };
  const record = () => {
    if (!answer.trim()) return;
    setDecs((x) => x.map((v) => (v.id === sel ? { ...v, answer: answer.trim() } : v)));
    const id = sel; setAnswer(''); setRecording(false);
    setToast({ t: 'Decision recorded', undo: () => { setDecs((x) => x.map((v) => (v.id === id ? { ...v, answer: undefined } : v))); setToast(null); } });
  };
  const row = (x: Dec) => (
    <li key={x.id} className={`xch03-row${x.id === sel ? ' is-current' : ''}`}>
      <button type="button" className="xch03-row__open" aria-current={x.id === sel ? 'true' : undefined} onClick={() => pick(x.id)}>
        <span className="xch03-row__q">{x.q}</span>
        {x.answer ? <span className="xch03-row__a"><Tag variant="selected">Decided</Tag> {x.answer}</span> : <span className="xch03-row__meta"><Avatar name={x.owner} size="s" gold={x.owner === ME} /> {x.owner === ME ? 'Yours' : x.owner} · due {x.due}</span>}
        <span className="ds-caption">{title(conv(x.conv))} · {(rootOf(x).replies?.length ?? 0) + 1} {rootOf(x).replies?.length ? 'messages' : 'message'} of talk</span>
      </button>
    </li>
  );
  const talk = d && (
    <div className="xch03-talk">
      <div className="xch03-talk__head">
        <div className="xch03-talk__top"><p className="ds-kicker">{title(conv(d.conv))}</p><Button variant="ghost" size="sm" onClick={() => setSel(null)}>Close</Button></div>
        <h2 className="ds-h4">{d.q}</h2>
        {d.answer ? <p className="xch03-talk__a"><Tag variant="selected">Decided</Tag> {d.answer}</p> : <Button variant="secondary" size="sm" onClick={() => setRecording(true)}>Record decision</Button>}
      </div>
      <div className="xch03-talk__stream">
        <StreamDivider>The talk behind it</StreamDivider>
        <Talk list={[rootOf(d), ...(rootOf(d).replies ?? []), ...(extra[d.root] ?? [])]} />
      </div>
      <Composer placeholder="Add to this decision" primary={narrow || true} onSend={(t, f) => setExtra((x) => ({ ...x, [d.root]: [...(x[d.root] ?? []), mine(t, f)] }))} />
    </div>
  );
  const opens = (id: string) => decs.filter((x) => x.conv === id && !x.answer).length;
  return (
    <div className="xch03-root">
      <AppShell
        sidebar={<ChatRail current={where} onPick={setWhere} counts={(c) => opens(c.id)} top={<RailSection title="Ledger"><RailItem label="All decisions" current={where === 'all'} count={decs.filter((x) => !x.answer).length} unread onClick={() => setWhere('all')} /></RailSection>} />}
        header={<><div><p className="ds-kicker">{where === 'all' ? 'Across the workspace' : conv(where).topic}</p><h1 className="ds-h4">{where === 'all' ? 'Decision ledger' : title(conv(where))}</h1></div><span className="ds-spacer" /><Segmented label="Owner" value={who} onChange={setWho} options={[{ value: 'all', label: 'Everyone' }, { value: 'mine', label: 'Mine' }]} /></>}
        aside={narrow || !d ? undefined : talk}>
        <div className="xch03-main">
          {shown.length === 0 && <EmptyState title="Nothing decided here yet" body="Decisions land here when someone records one." action={<Button variant="secondary" size="sm" onClick={() => { setWhere('all'); setWho('all'); }}>Show all decisions</Button>} />}
          {open.length > 0 && <section><p className="ds-kicker">Waiting on someone</p><h2 className="ds-h3">Still open <span className="xch03-n">{open.length}</span></h2><ul className="xch03-list">{open.map(row)}</ul></section>}
          {done.length > 0 && <section><p className="ds-kicker">On the record</p><h2 className="ds-h3">Decided <span className="xch03-n">{done.length}</span></h2><ul className="xch03-list">{done.map(row)}</ul></section>}
        </div>
      </AppShell>
      {narrow && d && <Modal open={sheet} onClose={closeSheet} variant="sheet" title="The decision">{talk}</Modal>}
      <Modal open={recording} onClose={closeRec} title="Record the decision" actions={<><Button variant="ghost" onClick={closeRec}>Cancel</Button><Button variant="primary" disabled={!answer.trim()} onClick={record}>Save</Button></>}>
        <p className="ds-caption">{d?.q}</p>
        <Input compact multiline rows={3} label="What was decided" value={answer} onChange={(e) => setAnswer(e.target.value)} />
      </Modal>
      {toast && <Toast onDone={clear} action={toast.undo && <Button variant="ghost" size="sm" onClick={toast.undo}>Undo</Button>}>{toast.t}</Toast>}
    </div>
  );
}
createRoot(document.getElementById('root')!).render(<Ledger />);
