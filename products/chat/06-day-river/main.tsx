// The day is a timeline: conversations sit at the hour they happened, with now marked
import { useCallback, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AppShell, Segmented, Modal, EmptyState, Button, Avatar, StreamDivider } from '../../../design-system/components';
import { ChatRail, CONVS, NOW, Composer, Talk, title, first, mine, rich, useNarrow, useTabTrap, conv } from '../kit';
import type { Msg } from '../kit';
import './styles.css';

type Beat = { id: string; conv: string; hour: number; msgs: Msg[]; root?: Msg };
const hourOf = (m: Msg) => Number(m.time.slice(0, 2));
const beats = (day: 'today' | 'yesterday') => CONVS.flatMap((c) => {
  const hits = (m: Msg) => (day === 'yesterday') === !!m.yesterday;
  const out: Beat[] = [];
  c.messages.forEach((t) => {
    const group = [t, ...(t.replies ?? [])].filter(hits);
    const byHour = new Map<number, Msg[]>();
    group.forEach((m) => byHour.set(hourOf(m), [...(byHour.get(hourOf(m)) ?? []), m]));
    byHour.forEach((msgs, hour) => out.push({ id: `${t.id}-${hour}`, conv: c.id, hour, msgs, root: t }));
  });
  return out;
});
const nowHour = Number(NOW.slice(0, 2));

function River() {
  const narrow = useNarrow(); useTabTrap();
  const [day, setDay] = useState<'today' | 'yesterday'>('today');
  const [where, setWhere] = useState<string | undefined>();
  const [sel, setSel] = useState<string | null>('lw1-14');
  const [sheet, setSheet] = useState(false);
  const [extra, setExtra] = useState<Record<string, Msg[]>>({});
  const close = useCallback(() => setSheet(false), []);
  const all = beats(day).filter((b) => !where || b.conv === where);
  const hours = [...new Set(all.map((b) => b.hour))].sort((a, b) => b - a);
  const b = beats('today').concat(beats('yesterday')).find((x) => x.id === sel);
  const open = (id: string) => { setSel(id); if (narrow) setSheet(true); };
  const counts = (id: string) => beats('today').filter((x) => x.conv === id).flatMap((x) => x.msgs).filter((m) => m.isNew).length;
  const panel = b && (
    <div className="xch06-panel">
      <header className="xch06-panel__head"><p className="ds-kicker">{title(conv(b.conv))} · {b.hour}:00</p><h2 className="ds-h4">{first(b.root!.who)} started this at {b.root!.time}</h2></header>
      <div className="xch06-panel__stream"><Talk list={[b.root!, ...(b.root!.replies ?? []), ...(extra[b.root!.id] ?? [])]} /></div>
      <Composer placeholder={`Reply to ${first(b.root!.who)}`} onSend={(t) => setExtra((x) => ({ ...x, [b.root!.id]: [...(x[b.root!.id] ?? []), mine(t)] }))} />
    </div>
  );
  return (
    <div className="xch06-root">
      <AppShell
        sidebar={<ChatRail current={where} onPick={(id) => setWhere(where === id ? undefined : id)} counts={(c) => counts(c.id)} />}
        header={<><div><p className="ds-kicker">{where ? title(conv(where)) : 'All conversations'}</p><h1 className="ds-h4">{day === 'today' ? 'Today, Friday 6 November' : 'Yesterday, Thursday'}</h1></div><span className="ds-spacer" /><Segmented label="Day" value={day} onChange={setDay} options={[{ value: 'today', label: 'Today' }, { value: 'yesterday', label: 'Yesterday' }]} /></>}
        aside={narrow ? undefined : panel}>
        <div className="xch06-river">
          {day === 'today' && <StreamDivider tone="new">Now, {NOW}</StreamDivider>}
          {hours.length === 0 && <EmptyState title="Quiet here that day" body="Nothing was said in this conversation." action={<Button variant="secondary" size="sm" onClick={() => setWhere(undefined)}>Show all conversations</Button>} />}
          {hours.map((h) => (
            <section key={h} className={`xch06-hour${day === 'today' && h === nowHour ? ' is-now' : ''}`} aria-label={`${h}:00`}>
              <h2 className="xch06-time">{String(h).padStart(2, '0')}:00</h2>
              <ul className="xch06-beats">
                {all.filter((x) => x.hour === h).sort((p, n) => n.msgs[n.msgs.length - 1].time.localeCompare(p.msgs[p.msgs.length - 1].time)).map((x) => (
                  <li key={x.id}>
                    <button type="button" className={`xch06-beat${sel === x.id ? ' is-current' : ''}`} aria-current={sel === x.id ? 'true' : undefined} onClick={() => open(x.id)}>
                      <span className="xch06-beat__top"><Avatar name={x.msgs[x.msgs.length - 1].who} size="s" /><strong>{title(conv(x.conv))}</strong><time className="ds-caption">{x.msgs[x.msgs.length - 1].time}</time>{x.msgs.some((m) => m.isNew) && <span className="xch06-new ds-grain">New</span>}</span>
                      <span className="xch06-beat__text">{rich(x.msgs[x.msgs.length - 1].text)}</span>
                      <span className="ds-caption">{[...new Set(x.msgs.map((m) => first(m.who)))].join(', ')} · {x.msgs.length} {x.msgs.length === 1 ? 'message' : 'messages'}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </AppShell>
      {narrow && <Modal open={sheet} onClose={close} variant="sheet" title="Conversation">{panel}</Modal>}
    </div>
  );
}
createRoot(document.getElementById('root')!).render(<River />);
