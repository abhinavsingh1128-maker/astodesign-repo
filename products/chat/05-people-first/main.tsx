// You go to a person: your personal chat opens first, and any thread with them opens beside it
import { useCallback, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AppShell, Rail, RailSection, RailItem, Tag, Banner, Avatar, Button, Input, Modal, EmptyState, StreamDivider } from '../../../design-system/components';
import { CONVS, ME, Composer, Talk, title, mine, first, rich, useNarrow } from '../kit';
import type { Conv, Msg } from '../kit';
import './styles.css';

// Sample replies so personal messages can have threads too.
const DM_REPLIES: Record<string, Msg[]> = {
  ky1: [{ id: 'ky1a', who: 'Kavya Reddy', time: '15:02', yesterday: true, text: 'Do you want the annual toggle copy in the same file?' }, { id: 'ky1b', who: ME, time: '15:03', yesterday: true, text: 'Yes, keep it all together.' }],
  mj1: [{ id: 'mj1a', who: 'Manav Jain', time: '15:34', isNew: true, text: 'Mainly the weekend rota. Tomas has been paged four times this month.' }],
  nh1: [{ id: 'nh1a', who: ME, time: '18:35', yesterday: true, text: 'How did the Meridian call go?' }, { id: 'nh1b', who: 'Noor Haddad', time: '18:38', yesterday: true, text: 'Fine, they only want an answer on exports.' }],
  tl1: [{ id: 'tl1a', who: 'Tomas Lindqvist', time: '11:55', text: 'It is one page. The doc is in the launch folder.' }],
};
type Thread = { key: string; conv: Conv; root: Msg; replies: Msg[] };
const threadsOf = (c: Conv): Thread[] => c.messages.map((m) => ({ key: m.id, conv: c, root: m, replies: c.kind === 'dm' ? DM_REPLIES[m.id] ?? [] : m.replies ?? [] }));
const dmOf = (p: string) => CONVS.find((c) => c.kind === 'dm' && c.name === p);
const PEOPLE = [...new Set(CONVS.flatMap((c) => threadsOf(c).flatMap((t) => [t.root, ...t.replies]).map((m) => m.who)))].filter((p) => p !== ME).sort();
const online = (p: string) => dmOf(p)?.online ?? !/Mei|Ife/.test(p);
const headline = (t: string) => { const s = t.replace(/@[A-Z][a-z]+\s*/g, '').split(/(?<=[.?!])\s/)[0]; return s.length > 70 ? `${s.slice(0, 68)}…` : s; };
// Threads this person is part of: group threads they spoke in, and personal threads with replies.
const withPerson = (p: string) => CONVS.filter((c) => c.kind === 'channel' || c.name === p).flatMap(threadsOf).filter((t) => (t.conv.kind === 'dm' ? t.replies.length > 0 : [t.root, ...t.replies].some((m) => m.who === p)));
const isNewFor = (t: Thread, p: string) => [t.root, ...t.replies].filter((m) => m.who === p && m.isNew).length;

function People() {
  const narrow = useNarrow();
  const [who, setWho] = useState('Kavya Reddy');
  const [open, setOpen] = useState<string | null>(null);
  const [sheet, setSheet] = useState(false);
  const [place, setPlace] = useState<string | null>(null);
  const [railOpen, setRailOpen] = useState(true);
  const [chan, setChan] = useState<string | null>(null);
  const [read, setRead] = useState<Record<string, boolean>>({});
  const [q, setQ] = useState('');
  const [extra, setExtra] = useState<Record<string, Msg[]>>({});
  const stream = useRef<HTMLDivElement>(null);
  const closeSheet = useCallback(() => setSheet(false), []);
  const channel = chan ? CONVS.find((c) => c.id === chan)! : null;
  const threads = channel ? threadsOf(channel) : withPerson(who);
  const shown = threads.filter((t) => !place || (place === 'personal' ? t.conv.kind === 'dm' : t.conv.id === place));
  const placesShared = [...new Map(threads.filter((t) => t.conv.kind === 'channel').map((t) => [t.conv.id, t.conv])).values()];
  const countIn = (id: string) => threads.filter((t) => t.conv.id === id).length;
  const unread = (p: string) => withPerson(p).reduce((n, t) => n + (read[t.key] ? 0 : isNewFor(t, p)), 0);
  const dm = dmOf(who);
  const personal = [...(channel ? channel.messages : dm?.messages ?? []), ...(extra[chan ?? who] ?? [])];
  const current = threads.find((t) => t.key === open);
  const ask = threads.find((t) => [t.root, ...t.replies].some((m) => m.who === who && m.text.includes(`@${first(ME)}`)));
  const list = PEOPLE.filter((p) => p.toLowerCase().includes(q.trim().toLowerCase()));
  const repliesFor = (t: Thread) => [...t.replies, ...(extra[t.key] ?? [])];
  const go = (p: string) => { setWho(p); setChan(null); setOpen(null); setPlace(null); };
  const goChan = (id: string) => { setChan(id); setOpen(null); setPlace(null); };
  const openThread = (key: string) => { setOpen(key); setRead((r) => ({ ...r, [key]: true })); if (narrow) setSheet(true); };
  useEffect(() => { const el = stream.current; if (el) el.scrollTop = el.scrollHeight; }, [who, personal.length]);

  const panel = current ? (
    <div className="xch05-thread">
      <header className="xch05-thread__head">
        <Button variant="ghost" size="sm" onClick={() => setOpen(null)}>← All threads</Button>
        <p className="ds-kicker">{title(current.conv)}</p>
        <h2 className="ds-h4">{headline(current.root.text)}</h2>
      </header>
      <div className="xch05-thread__stream">
        <Talk list={[current.root]} />
        <StreamDivider>{repliesFor(current).length} {repliesFor(current).length === 1 ? 'reply' : 'replies'}</StreamDivider>
        <Talk list={repliesFor(current)} />
      </div>
      <Composer primary={false} placeholder="Reply in this thread" onSend={(t, f) => setExtra((x) => ({ ...x, [current.key]: [...(x[current.key] ?? []), mine(t, f)] }))} />
    </div>
  ) : (
    <div className="xch05-threads">
      <p className="ds-kicker">{channel ? `In ${title(channel)}` : `With ${first(who)}`}</p>
      <h2 className="ds-h4">Threads <span className="ds-caption">{shown.length}</span></h2>
      {!channel && <div className="xch05-filter" role="group" aria-label="Filter threads">
        <Tag pressed={!place} onClick={() => setPlace(null)}>{`All ${threads.length}`}</Tag>
        <Tag pressed={place === 'personal'} onClick={() => setPlace('personal')}>{`Personal ${threads.filter((t) => t.conv.kind === 'dm').length}`}</Tag>
        {placesShared.map((c) => <Tag key={c.id} pressed={place === c.id} onClick={() => setPlace(c.id)}>{`${title(c)} ${countIn(c.id)}`}</Tag>)}
      </div>}
      {shown.length ? <ul>{shown.map((t) => { const n = read[t.key] ? 0 : isNewFor(t, who); return (
        <li key={t.key}><button type="button" className="xch05-row" onClick={() => openThread(t.key)}>
          <span className="ds-caption">{t.conv.kind === 'dm' ? 'Personal' : title(t.conv)}</span>
          <span className="xch05-row__title">{headline(t.root.text)}</span>
          <span className="ds-caption">{repliesFor(t).length ? `${repliesFor(t).length} ${repliesFor(t).length === 1 ? 'reply' : 'replies'}` : 'No replies yet'}{n > 0 && <span className="xch05-new ds-grain">{n}<span className="ds-sr-only"> new</span></span>}</span>
        </button></li>
      ); })}</ul> : <p className="ds-caption">No personal threads with {first(who)} yet.</p>}
    </div>
  );

  return (
    <div className="xch05-root" data-rail={railOpen ? 'open' : 'closed'}><AppShell
      sidebar={<Rail label="People" header={<><p className="xch05-brand">Harbour Studio</p><Input compact label="Find a person" hideLabel placeholder="Find a person" value={q} onChange={(e) => setQ(e.target.value)} /></>}
        footer={<div className="xch05-me"><Avatar name={ME} size="s" gold presence="on" /><span className="ds-caption">{ME}</span></div>}>
        <RailSection title="People">
          {list.map((p) => { const n = unread(p); return <RailItem key={p} lead={{ avatar: p, presence: online(p) ? 'on' : 'off' }} label={p} current={!chan && who === p} unread={n > 0} count={n} onClick={() => go(p)} />; })}
          {!list.length && <li className="ds-caption xch05-none">Nobody by that name.</li>}
        </RailSection>
        <RailSection title="Channels">{CONVS.filter((c) => c.kind === 'channel').map((c) => <RailItem key={c.id} lead="#" label={c.name} current={chan === c.id} onClick={() => goChan(c.id)} />)}</RailSection>
      </Rail>}
      header={<><Button className="xch05-railbtn" variant="ghost" size="sm" aria-expanded={railOpen} onClick={() => setRailOpen(!railOpen)}>{railOpen ? '← Hide people' : 'Show people →'}</Button>{!channel && <Avatar name={who} size="m" presence={online(who) ? 'on' : 'off'} />}<div><p className="ds-kicker">{channel ? `${channel.members} members` : online(who) ? 'Around now' : 'Away'}</p><h1 className="ds-h4">{channel ? title(channel) : who}</h1></div><span className="ds-spacer" />{narrow && <Button variant="secondary" size="sm" onClick={() => setSheet(true)}>{`Threads ${threads.length}`}</Button>}</>}
      aside={narrow ? undefined : panel}>
      <div className="xch05-main">
        <div className="xch05-stream" ref={stream}>
          {!channel && ask && !read[ask.key] && <div className="xch05-ask"><Banner title={`${first(who)} is waiting on you`} action={<Button variant="secondary" size="sm" onClick={() => openThread(ask.key)}>Open thread</Button>}>{rich(headline(ask.root.text))}</Banner></div>}
          {personal.length ? <Talk list={personal} threadFor={(m) => { const t = threads.find((x) => x.key === m.id); return t && repliesFor(t).length ? { count: repliesFor(t).length, last: repliesFor(t)[repliesFor(t).length - 1].time, onOpen: () => openThread(t.key) } : undefined; }} />
            : <EmptyState title={`Say hello to ${first(who)}`} body="You have no personal chat yet. Your first message starts one." />}
        </div>
        <Composer key={chan ?? who} placeholder={channel ? `Message ${title(channel)}` : `Message ${first(who)}`} onSend={(t, f) => { const k = chan ?? who; setExtra((x) => ({ ...x, [k]: [...(x[k] ?? []), mine(t, f)] })); }} />
      </div>
      {narrow && <Modal open={sheet} onClose={closeSheet} variant="sheet" title="Threads">{panel}</Modal>}
    </AppShell></div>
  );
}
createRoot(document.getElementById('root')!).render(<People />);
