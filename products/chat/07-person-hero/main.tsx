// Your personal chat is always open; one small button shows what this person said in your groups
import { useCallback, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AppShell, Rail, RailSection, RailItem, Avatar, Button, Input, EmptyState, Toast } from '../../../design-system/components';
import { CONVS, ME, Composer, Talk, allMsgs, title, first, mine, rich } from '../kit';
import type { Conv, Msg } from '../kit';
import './styles.css';

const ROLES: Record<string, string> = { 'Kavya Reddy': 'Product designer', 'Manav Jain': 'Engineering lead', 'Noor Haddad': 'Head of support', 'Tomas Lindqvist': 'Platform engineer', 'Ritu Sharma': 'Design lead', 'Ife Adeyemi': 'Billing engineer', 'Mei Tanaka': 'People and hiring' };
const PEOPLE = Object.keys(ROLES);
const dmOf = (p: string) => CONVS.find((c) => c.kind === 'dm' && c.name === p);
const online = (p: string) => dmOf(p)?.online ?? p !== 'Mei Tanaka';
const groups = (p: string): Array<{ c: Conv; msgs: Msg[] }> => CONVS.filter((c) => c.kind === 'channel').map((c) => ({ c, msgs: allMsgs(c).filter((m) => m.who === p) })).filter((g) => g.msgs.length);
const fresh = (p: string) => groups(p).flatMap((g) => g.msgs).filter((m) => m.isNew).length;
const filesOf = (p: string) => CONVS.flatMap((c) => allMsgs(c)).filter((m) => m.who === p && m.file).map((m) => m.file!);

function Person() {
  const [who, setWho] = useState('Kavya Reddy');
  const [q, setQ] = useState('');
  const [peek, setPeek] = useState(false);
  const [seen, setSeen] = useState<Record<string, boolean>>({});
  const [extra, setExtra] = useState<Record<string, Msg[]>>({});
  const [quote, setQuote] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const clear = useCallback(() => setToast(null), []);
  const box = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLDivElement>(null);
  const stream = useRef<HTMLDivElement>(null);
  const shared = groups(who);
  const said = shared.flatMap((g) => g.msgs).length;
  const files = filesOf(who);
  const ask = shared.flatMap((g) => g.msgs).find((m) => m.text.includes(`@${first(ME)}`));
  const chat = [...(dmOf(who)?.messages ?? []), ...(extra[who] ?? [])];
  const unread = seen[who] ? 0 : fresh(who);
  const list = PEOPLE.filter((p) => p.toLowerCase().includes(q.trim().toLowerCase()));
  const closePeek = useCallback(() => { setPeek(false); trigger.current?.querySelector('button')?.focus(); }, []);
  useEffect(() => {
    if (!peek) return;
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') closePeek(); };
    const down = (e: MouseEvent) => { const t = e.target as Node; if (!box.current?.contains(t) && !trigger.current?.contains(t)) setPeek(false); };
    document.addEventListener('keydown', key); document.addEventListener('mousedown', down);
    box.current?.querySelector('button')?.focus();
    return () => { document.removeEventListener('keydown', key); document.removeEventListener('mousedown', down); };
  }, [peek, closePeek]);
  useEffect(() => { const s = stream.current; if (s) s.scrollTop = s.scrollHeight; }, [who, chat.length]);
  const open = (p: string) => { setWho(p); setPeek(false); setQuote(null); };
  return (
    <div className="xch07-root"><AppShell
      sidebar={<Rail label="People" header={<Input compact label="Find a person" hideLabel placeholder="Find a person" value={q} onChange={(e) => setQ(e.target.value)} />}
        footer={<div className="xch07-me"><Avatar name={ME} size="s" gold presence="on" /><span className="ds-caption">{ME}</span></div>}>
        <RailSection title="People">
          {list.map((p) => { const n = seen[p] ? 0 : fresh(p); return <RailItem key={p} lead={{ avatar: p, presence: online(p) ? 'on' : 'off' }} label={p} current={who === p} unread={n > 0} count={n} onClick={() => open(p)} />; })}
          {!list.length && <li className="ds-caption xch07-none">Nobody by that name.</li>}
        </RailSection>
      </Rail>}
      aside={<div className="xch07-side">
        <h2 className="ds-h4">Shared with {first(who)}</h2>
        <p className="ds-label">Files {files.length}</p>
        {files.length ? <ul className="xch07-files">{files.map((f) => <li key={f.name}><span>{f.name}</span><span className="ds-caption">{f.meta}</span></li>)}</ul> : <p className="ds-caption">No files from {first(who)} yet.</p>}
      </div>}>
      <div className="xch07-main">
        <header className="xch07-hero">
          <Avatar name={who} size="xl" presence={online(who) ? 'on' : 'off'} />
          <div className="xch07-hero__text">
            <p className="ds-kicker">{online(who) ? 'Around now' : 'Away'}</p>
            <h1 className="ds-h2">{who}</h1>
            <p className="xch07-role">{ROLES[who]}</p>
            {ask && <p className="xch07-ask"><strong>Waiting on you:</strong> {rich(ask.text)}</p>}
          </div>
          <div className="xch07-peek" ref={trigger}>
            <Button variant="secondary" size="sm" aria-expanded={peek} disabled={!shared.length} onClick={() => { if (peek) setPeek(false); else { setPeek(true); setSeen((s) => ({ ...s, [who]: true })); } }}>
              {shared.length ? `In ${shared.length} ${shared.length === 1 ? 'group' : 'groups'}` : 'No shared groups'}
              {unread > 0 && <span className="xch07-count ds-grain">{unread}<span className="ds-sr-only"> new</span></span>}
            </Button>
          </div>
          {peek && (
            <div className="xch07-panel ds-washi" data-surface="paper" ref={box} role="dialog" aria-label={`What ${first(who)} said in groups`}>
              <div className="xch07-panel__head"><p className="ds-label">{first(who)} said {said} {said === 1 ? 'thing' : 'things'} in groups</p><Button variant="ghost" size="sm" onClick={closePeek}>Close</Button></div>
              {shared.map((g) => (
                <section key={g.c.id}>
                  <h3 className="xch07-group">{title(g.c)}</h3>
                  <ul className="xch07-said">{g.msgs.map((m) => (
                    <li key={m.id}>
                      <p>{rich(m.text)}</p>
                      <div className="xch07-said__foot"><time className="ds-caption">{m.yesterday ? 'Yesterday' : m.time}</time><Button variant="ghost" size="sm" aria-label={`Reply here about ${title(g.c)}, ${m.time}`} onClick={() => { setQuote(`${title(g.c)}: “${m.text.replace(/\*\*/g, '')}”`); closePeek(); }}>Reply here</Button></div>
                    </li>
                  ))}</ul>
                </section>
              ))}
            </div>
          )}
        </header>
        <div className="xch07-chat" ref={stream}>
          {chat.length ? <Talk list={chat} /> : <EmptyState title={`Say hello to ${first(who)}`} body="You have no personal chat yet. Your first message starts one." />}
        </div>
        {quote && <div className="xch07-quote"><p>{quote}</p><Button variant="ghost" size="sm" onClick={() => setQuote(null)}>Remove</Button></div>}
        <Composer placeholder={`Message ${first(who)}`} onSend={(t, f) => { setExtra((x) => ({ ...x, [who]: [...(x[who] ?? []), mine(quote ? `${quote}\n${t}` : t, f)] })); setQuote(null); setToast(`Sent to ${first(who)}, only you two can see it`); }} />
      </div>
      {toast && <Toast onDone={clear}>{toast}</Toast>}
    </AppShell></div>
  );
}
createRoot(document.getElementById('root')!).render(<Person />);
