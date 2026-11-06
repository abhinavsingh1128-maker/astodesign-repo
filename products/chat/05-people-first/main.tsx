// You go to a person, not a channel, and see everything you share with them
import { useCallback, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AppShell, Rail, RailSection, RailItem, Tag, Banner, Avatar, Button, Input, EmptyState, StreamDivider, Toast } from '../../../design-system/components';
import { CONVS, ME, Composer, Talk, title, mine, first } from '../kit';
import type { Conv, Msg } from '../kit';
import './styles.css';

type Item = { conv: Conv; msgs: Msg[] };
const threads = (c: Conv) => c.messages.map((m) => [m, ...(m.replies ?? [])]);
const PEOPLE = [...new Set(CONVS.flatMap((c) => threads(c).flat().map((m) => m.who)))].filter((p) => p !== ME).sort();
const online = (p: string) => CONVS.find((c) => c.kind === 'dm' && c.name === p)?.online ?? !/Mei|Ife/.test(p);
const shared = (p: string): Item[] => CONVS.map((c) => ({ conv: c, msgs: threads(c).filter((t) => t.some((m) => m.who === p)).flat() })).filter((i) => i.msgs.length);
const unread = (p: string) => shared(p).flatMap((i) => i.msgs).filter((m) => m.who === p && m.isNew).length;
const asks = (p: string) => shared(p).flatMap((i) => i.msgs.filter((m) => m.who === p && m.text.includes(`@${first(ME)}`)));

function People() {
  const [who, setWho] = useState('Kavya Reddy');
  const [place, setPlace] = useState<string | null>(null);
  const [seen, setSeen] = useState<Record<string, boolean>>({ 'Kavya Reddy': true });
  const [q, setQ] = useState('');
  const [extra, setExtra] = useState<Record<string, Msg[]>>({});
  const [toast, setToast] = useState<string | null>(null);
  const clear = useCallback(() => setToast(null), []);
  const items = shared(who);
  const shownItems = items.filter((i) => !place || i.conv.id === place);
  const files = items.flatMap((i) => i.msgs).flatMap((m) => (m.file ? [m.file] : []));
  const channels = CONVS.filter((c) => c.kind === 'channel');
  const go = (p: string) => { setWho(p); setPlace(null); setSeen((s) => ({ ...s, [p]: true })); };
  const list = PEOPLE.filter((p) => p.toLowerCase().includes(q.trim().toLowerCase()));
  const ask = asks(who)[0];
  return (
    <AppShell
      sidebar={<Rail label="People" header={<><p className="xch05-brand">Harbour Studio</p><Input compact label="Find a person" hideLabel placeholder="Find a person" value={q} onChange={(e) => setQ(e.target.value)} /></>}
        footer={<div className="xch05-me"><Avatar name={ME} size="s" gold presence="on" /><span className="ds-caption">{ME}</span></div>}>
        <RailSection title="People">
          {list.map((p) => { const n = seen[p] ? 0 : unread(p); return <RailItem key={p} lead={{ avatar: p, presence: online(p) ? 'on' : 'off' }} label={p} current={who === p} unread={n > 0} count={n} onClick={() => go(p)} />; })}
          {!list.length && <li className="ds-caption xch05-none">Nobody by that name.</li>}
        </RailSection>
        <RailSection title="Channels">{channels.map((c) => <RailItem key={c.id} lead="#" label={c.name} current={place === c.id} onClick={() => setPlace(place === c.id ? null : c.id)} />)}</RailSection>
      </Rail>}
      header={<><Avatar name={who} size="m" presence={online(who) ? 'on' : 'off'} /><div><p className="ds-kicker">{online(who) ? 'Around now' : 'Away'}</p><h1 className="ds-h4">{who}</h1></div><span className="ds-spacer" /><p className="ds-caption">{items.length} places you share</p></>}
      aside={<div className="xch05-side">
        <section><p className="ds-kicker">Where you overlap</p><div className="xch05-tags">{items.map((i) => <Tag key={i.conv.id} pressed={place === i.conv.id} onClick={() => setPlace(place === i.conv.id ? null : i.conv.id)}>{`${title(i.conv)} ${i.msgs.length}`}</Tag>)}</div></section>
        <section><p className="ds-kicker">Files from this person</p>{files.length ? <ul className="xch05-files">{files.map((f) => <li key={f.name}>{f.name}<span className="ds-caption">{f.meta}</span></li>)}</ul> : <p className="ds-caption">No files shared yet.</p>}</section>
      </div>}>
      <div className="xch05-main">
        <div className="xch05-stream">
          {ask && !place && <div className="xch05-ask"><Banner title={`${first(who)} is waiting on you`} action={<Button variant="secondary" size="sm" onClick={() => setToast('Pinned to the top until you reply')}>Keep on top</Button>}>Asked in the {items.find((i) => i.msgs.includes(ask))?.conv.name} conversation at {ask.time}.</Banner></div>}
          <div className="xch05-places">{items.map((i) => <Tag key={i.conv.id} pressed={place === i.conv.id} onClick={() => setPlace(place === i.conv.id ? null : i.conv.id)}>{title(i.conv)}</Tag>)}</div>
          {shownItems.length === 0 && <EmptyState title={`Nothing with ${first(who)} here`} body="You have no conversation together in that channel." action={<Button variant="secondary" size="sm" onClick={() => setPlace(null)}>Show everything</Button>} />}
          {shownItems.map((i) => <section key={i.conv.id}><StreamDivider>{title(i.conv)}</StreamDivider><Talk list={i.msgs} /></section>)}
          {(extra[who] ?? []).length > 0 && <section><StreamDivider>Just now, direct</StreamDivider><Talk list={extra[who]} /></section>}
        </div>
        <Composer placeholder={`Message ${first(who)}`} onSend={(t) => setExtra((x) => ({ ...x, [who]: [...(x[who] ?? []), mine(t)] }))} />
      </div>
      {toast && <Toast onDone={clear}>{toast}</Toast>}
    </AppShell>
  );
}
createRoot(document.getElementById('root')!).render(<People />);
