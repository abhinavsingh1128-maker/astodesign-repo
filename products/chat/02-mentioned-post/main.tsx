// Groups are the columns of a newspaper; every story opens as a floating chat, and several can sit open at once
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Button, Tag, Input, Modal, Toast, EmptyState, Segmented, Avatar, StreamDivider } from '../../../design-system/components';
import { CONVS, ME, NOW, Talk, FormatBar, title, first, rich, useTabTrap } from '../kit';
import type { Conv, File, Msg } from '../kit';
import './styles.css';

// Everyone in the data gets a personal chat, even if you have not messaged them yet.
const EVERYONE = [...new Set(CONVS.flatMap((c) => c.messages.flatMap((m) => [m.who, ...(m.replies ?? []).map((r) => r.who)])))].filter((p) => p !== ME).sort();
const ALL: Conv[] = [...CONVS, ...EVERYONE.filter((p) => !CONVS.some((c) => c.kind === 'dm' && c.name === p)).map((p): Conv => ({ id: `dm-${p}`, kind: 'dm', name: p, topic: 'Direct message', online: p !== 'Mei Tanaka', messages: [] }))];
const conv = (id: string) => ALL.find((c) => c.id === id)!;
const ROLES: Record<string, string> = { 'Kavya Reddy': 'Product designer', 'Manav Jain': 'Engineering lead', 'Noor Haddad': 'Head of support', 'Tomas Lindqvist': 'Platform engineer', 'Ritu Sharma': 'Design lead', 'Ife Adeyemi': 'Billing engineer', 'Mei Tanaka': 'People and hiring' };

// Saved between visits; survives a blocked or cleared store by falling back to the start state.
const KEY = 'broadsheet-v1';
type Saved = { read: Record<string, boolean>; extra: Record<string, Msg[]>; drafts: Record<string, string>; hidden: string[] };
const EMPTY: Saved = { read: {}, extra: {}, drafts: {}, hidden: [] };
const load = (): Saved => { try { return { ...EMPTY, ...JSON.parse(localStorage.getItem(KEY) ?? '{}') }; } catch { return EMPTY; } };
const save = (s: Saved) => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* still works for this visit */ } };

type Story = { key: string; conv: string; root: Msg; thread: Msg[]; unread: number; mentions: boolean; last: Msg };
const mins = (m: Msg) => Number(m.time.slice(0, 2)) * 60 + Number(m.time.slice(3)) - (m.yesterday ? 1440 : 0);
const headline = (text: string) => { const t = text.replace(/@[A-Z][a-z]+\s*/g, '').replace(/\*\*/g, ''); const s = t.split(/(?<=[.?!])\s/)[0]; return s.length > 90 ? `${s.slice(0, 88)}…` : s; };
// Sample follow-ups so a channel can mention you more than once.
const SEED: Record<string, Msg[]> = {
  lw1: [{ id: 'sd1', who: 'Manav Jain', time: '15:05', isNew: true, text: '@Abhinav the toggle copy needs your eye too.' }, { id: 'sd2', who: 'Kavya Reddy', time: '15:41', isNew: true, text: '@Abhinav ten minutes would do it.' }, { id: 'sd3', who: 'Ritu Sharma', time: '16:22', isNew: true, text: '@Abhinav legal closes their review at 17:00, are you signing it off?' }],
  se1: [{ id: 'sd4', who: 'Mei Tanaka', time: '15:44', isNew: true, text: '@Abhinav Meridian has emailed again about the export.' }, { id: 'sd5', who: 'Noor Haddad', time: '16:10', isNew: true, text: '@Abhinav can I tell them yes or no before 18:00?' }],
  hi1: [{ id: 'sd6', who: 'Mei Tanaka', time: '14:50', isNew: true, text: '@Abhinav still need your call on Lena today.' }],
};
const isExtra = (k: string) => k.startsWith('m:') || k.startsWith('c:');
const MAX = () => (matchMedia('(max-width: 760px)').matches ? 1 : matchMedia('(max-width: 1100px)').matches ? 2 : 3);

function Broadsheet() {
  useTabTrap();
  const [data, setData] = useState<Saved>(load);
  const { read, extra, drafts, hidden } = data;
  const put = useCallback((f: (d: Saved) => Saved) => setData((d) => { const n = f(d); save(n); return n; }), []);
  const [attached, setAttached] = useState<Record<string, File | undefined>>({});
  const forms = useRef<Record<string, HTMLFormElement | null>>({});
  const [windows, setWindows] = useState<string[]>([]); // open, newest last
  const [mini, setMini] = useState<string[]>([]);
  const [max, setMax] = useState(MAX);
  const [q, setQ] = useState('');
  const [view, setView] = useState<'all' | 'unread'>('all');
  const [composing, setComposing] = useState(false);
  const [folded, setFolded] = useState<Record<string, boolean>>({});
  const [person, setPerson] = useState<string | null>(null);
  const [peopleOpen, setPeopleOpen] = useState(true);
  const [chansOpen, setChansOpen] = useState(true);
  const [to, setTo] = useState('');
  const [toErr, setToErr] = useState<string>();
  const [toast, setToast] = useState<{ t: string; undo?: () => void } | null>(null);
  const clear = useCallback(() => setToast(null), []);
  const closeCompose = useCallback(() => { setComposing(false); setToErr(undefined); }, []);
  const origin = useRef<Record<string, HTMLElement | null>>({});
  const focusKey = useRef<string | null>(null);

  const stories = useMemo(() => {
    const out: Story[] = [];
    for (const c of ALL) {
      if (c.kind === 'dm') {
        const thread = [...c.messages, ...(extra[c.id] ?? [])];
        const key = `dm:${c.id}`;
        const blank: Msg = { id: `${c.id}-0`, who: c.name, time: NOW, text: '' };
        out.push({ key, conv: c.id, root: thread[0] ?? blank, thread, unread: read[key] ? 0 : thread.filter((m) => m.isNew).length, mentions: false, last: thread[thread.length - 1] ?? blank });
        continue;
      }
      for (const m of [...c.messages, ...(extra[c.id] ?? [])]) {
        const thread = [m, ...(m.replies ?? []), ...(SEED[m.id] ?? []), ...(extra[m.id] ?? [])];
        const key = `${c.id}:${m.id}`;
        out.push({ key, conv: c.id, root: m, thread, unread: read[key] ? 0 : thread.filter((x) => x.isNew).length, mentions: thread.some((x) => x.text.includes(`@${first(ME)}`)), last: thread[thread.length - 1] });
      }
    }
    // Each channel can also open as one chat, with everything said in it.
    for (const c of CONVS.filter((x) => x.kind === 'channel')) {
      const key = `c:${c.id}`;
      const thread = [...c.messages.flatMap((m) => [m, ...(m.replies ?? []), ...(SEED[m.id] ?? []), ...(extra[m.id] ?? [])]), ...(extra[c.id] ?? []), ...(extra[key] ?? [])];
      out.push({ key, conv: c.id, root: c.messages[0], thread, unread: 0, mentions: false, last: thread[thread.length - 1] });
    }
    // One box per channel that tagged you. Opening it shows only those mentions.
    for (const c of ALL) {
      const hits = out.filter((s) => s.conv === c.id && !isExtra(s.key)).flatMap((s) => s.thread.filter((m) => m.who !== ME && m.text.includes(`@${first(ME)}`)).map((m) => ({ m, root: s.root })));
      if (!hits.length) continue;
      const sorted = [...hits].sort((a, b) => mins(a.m) - mins(b.m));
      const lastHit = sorted[sorted.length - 1];
      const key = `m:${c.id}`;
      const mySent = extra[key] ?? [];
      out.push({ key, conv: c.id, root: lastHit.root, thread: [...sorted.map((h) => h.m), ...mySent], unread: read[key] ? 0 : sorted.filter((h) => h.m.isNew).length, mentions: true, last: lastHit.m });
    }
    return out;
  }, [extra, read]);
  const byKey = (k: string) => stories.find((s) => s.key === k);

  // A narrower screen holds fewer windows: the oldest move down to the tray.
  const fit = useCallback((list: string[], m: number) => {
    if (list.length <= m) return list;
    const spill = list.slice(0, list.length - m);
    setMini((x) => [...new Set([...x, ...spill])]);
    return list.slice(-m);
  }, []);
  useEffect(() => { const on = () => { const m = MAX(); setMax(m); setWindows((w) => fit(w, m)); }; addEventListener('resize', on); return () => removeEventListener('resize', on); }, [fit]);
  useEffect(() => { const k = focusKey.current; if (k) { focusKey.current = null; document.getElementById(`win-${k}`)?.querySelector('textarea')?.focus(); } });

  const open = (key: string, from?: HTMLElement | null) => {
    if (from) origin.current[key] = from;
    put((d) => ({ ...d, read: { ...d.read, [key]: true, ...(key.startsWith('m:') ? Object.fromEntries(stories.filter((s) => s.conv === key.slice(2) && s.mentions).map((s) => [s.key, true])) : {}), ...(key.startsWith('c:') ? Object.fromEntries(stories.filter((s) => s.conv === key.slice(2)).map((s) => [s.key, true])) : {}) } }));
    setMini((x) => x.filter((k) => k !== key));
    setWindows((w) => fit([...w.filter((k) => k !== key), key], max));
    focusKey.current = key;
  };
  const minimise = (key: string) => { setWindows((w) => w.filter((k) => k !== key)); setMini((x) => [...x, key]); };
  const close = (key: string) => {
    setWindows((w) => w.filter((k) => k !== key)); setMini((x) => x.filter((k) => k !== key));
    const el = origin.current[key]; if (el?.isConnected) el.focus();
  };
  const send = (s: Story) => {
    const text = (drafts[s.key] ?? '').trim();
    const file = attached[s.key];
    if (!text && !file) return;
    const msg: Msg = { id: `s${Date.now()}`, who: ME, time: NOW, text: text || 'Shared a file.', file };
    setAttached((x) => ({ ...x, [s.key]: undefined }));
    const bucket = s.key.startsWith('dm:') ? s.conv : isExtra(s.key) ? s.key : s.root.id;
    put((d) => ({ ...d, extra: { ...d.extra, [bucket]: [...(d.extra[bucket] ?? []), msg] }, drafts: { ...d.drafts, [s.key]: '' } }));
  };
  const markAll = () => {
    const before = read;
    put((d) => ({ ...d, read: Object.fromEntries(stories.map((s) => [s.key, true])) }));
    setToast({ t: 'Edition marked read', undo: () => { put((d) => ({ ...d, read: before })); setToast(null); } });
  };
  const startNew = () => {
    const name = to.trim().replace(/^#\s*/, '').toLowerCase();
    const c = ALL.find((x) => x.name.toLowerCase() === name);
    if (!c) { setToErr('Pick a group or person from the list.'); return; }
    setComposing(false); setTo(''); setToErr(undefined);
    if (c.kind === 'dm') { open(`dm:${c.id}`); return; }
    const m: Msg = { id: `s${Date.now()}`, who: ME, time: NOW, text: `New story in ${title(c)}` };
    put((d) => ({ ...d, extra: { ...d.extra, [c.id]: [...(d.extra[c.id] ?? []), m] } }));
    setTimeout(() => open(`${c.id}:${m.id}`), 0);
  };
  const reset = () => { put(() => EMPTY); setWindows([]); setMini([]); setQ(''); setView('all'); setToast({ t: 'Edition reset to the start' }); };

  // Esc closes the window you are in.
  const onWinKey = (key: string) => (e: React.KeyboardEvent) => { if (e.key === 'Escape') { e.stopPropagation(); close(key); } };

  const needle = q.trim().toLowerCase();
  const fits = (s: Story) => (view === 'all' || s.unread > 0) && (!needle || `${conv(s.conv).name} ${s.thread.map((m) => `${m.who} ${m.text}`).join(' ')}`.toLowerCase().includes(needle));
  // Rank from the edition itself, not read state, so stories never jump while you read.
  const fresh = (x: Story) => x.thread.filter((m) => m.isNew).length;
  const order = (l: Story[]) => [...l].sort((a, b) => Number(b.mentions && fresh(b) > 0) - Number(a.mentions && fresh(a) > 0) || fresh(b) - fresh(a) || mins(b.root) - mins(a.root));
  const groups = CONVS.filter((c) => c.kind === 'channel');
  const columns = groups.filter((c) => !hidden.includes(c.id)).map((c) => ({ c, list: order(stories.filter((s) => s.conv === c.id && !isExtra(s.key) && fits(s))) })).filter((x) => !needle && view === 'all' ? true : x.list.length);
  const paperStories = stories.filter((s) => !isExtra(s.key));
  const totalUnread = paperStories.reduce((n, s) => n + s.unread, 0);
  const boxes = stories.filter((s) => s.key.startsWith('m:') && (!needle || `${conv(s.conv).name} ${s.thread.map((m) => m.text).join(' ')}`.toLowerCase().includes(needle)) && (view === 'all' || s.unread > 0)).sort((a, b) => b.thread.filter((m) => m.who !== ME).length - a.thread.filter((m) => m.who !== ME).length);
  const asks = stories.filter((s) => s.key.startsWith('m:') && s.unread > 0).length;
  const nothing = !columns.length && !boxes.length;
  const people = EVERYONE.filter((p) => !needle || p.toLowerCase().includes(needle) || (ROLES[p] ?? '').toLowerCase().includes(needle));
  const dmStory = (p: string) => stories.find((s) => s.key.startsWith('dm:') && conv(s.conv).name === p)!;
  // Where a person asked for you, per channel.
  const askedBy = (p: string) => stories.filter((s) => s.key.startsWith('m:')).map((s) => ({ s, n: s.thread.filter((m) => m.who === p).length })).filter((x) => x.n > 0);
  const inGroups = (p: string) => groups.filter((c) => c.messages.some((m) => [m, ...(m.replies ?? [])].some((x) => x.who === p)));
  const newFrom = (p: string) => dmStory(p).unread + askedBy(p).reduce((n, x) => n + (x.s.unread ? x.s.thread.filter((m) => m.who === p && m.isNew).length : 0), 0);
  const channelsShown = groups.filter((c) => !needle || c.name.includes(needle));
  const allFolded = columns.every(({ c }) => folded[c.id]);
  const toggleGroup = (id: string) => put((d) => ({ ...d, hidden: d.hidden.includes(id) ? d.hidden.filter((x) => x !== id) : [...d.hidden, id] }));

  const row = (s: Story, lead: boolean) => (
    <li key={s.key} className={`xch08-story${lead ? ' is-lead' : ''}${s.unread ? ' is-unread' : ''}${windows.includes(s.key) ? ' is-open' : ''}`}>
      <button type="button" className="xch08-story__btn" aria-expanded={windows.includes(s.key)} onClick={(e) => open(s.key, e.currentTarget)}>
        <span className="xch08-story__head">{s.key.startsWith('dm:') ? `A letter from ${first(conv(s.conv).name)}` : headline(s.root.text)}</span>
        {lead && s.thread.length > 1 && <span className="xch08-story__deck">{rich(s.last.text)}</span>}
        <span className="xch08-story__meta">
          {s.mentions && s.unread > 0 && <Tag variant="selected">For you</Tag>}
          <span>{first(s.last.who)} · {s.last.yesterday ? 'Yesterday' : s.last.time}</span>
          {s.thread.length > 1 && <span>{s.thread.length} messages</span>}
          {s.unread > 0 && <span className="xch08-count ds-grain">{s.unread}<span className="ds-sr-only"> unread</span></span>}
          {drafts[s.key]?.trim() && <span className="xch08-draft">Draft</span>}
        </span>
      </button>
    </li>
  );

  return (
    <div className="xch08-root" data-surface="paper">
      <header className="xch08-top ds-washi" data-surface="night">
        <span className="xch08-brand">Kaiwa</span>
        <Input className="xch08-search" compact label="Search the paper" hideLabel placeholder="Search the paper" value={q} onChange={(e) => setQ(e.target.value)} />
        <Segmented label="Stories" value={view} onChange={setView} options={[{ value: 'all', label: 'All' }, { value: 'unread', label: `Unread ${totalUnread}` }]} />
        <Button variant="primary" size="sm" onClick={() => setComposing(true)}>New message</Button>
        <Avatar name={ME} size="s" gold />
      </header>
      <main className="xch08-paper ds-washi" data-surface="paper">
        <div className="xch08-mast">
          <p className="ds-kicker">Harbour Studio · Friday 6 November</p>
          <h1 className="ds-display-l">The Mentioned Post</h1>
          <p className="xch08-mast__sub" role="status">{asks > 0 ? `${asks} ${asks === 1 ? 'channel is' : 'channels are'} asking for you. ` : 'Nobody is waiting on you. '}{totalUnread} unread across {groups.length} groups.</p>
          <div className="xch08-mast__tools">
            <Button variant="ghost" size="sm" disabled={!totalUnread} onClick={markAll}>Mark edition read</Button>
            <Button variant="ghost" size="sm" onClick={reset}>Reset demo</Button>
          </div>
          <div className="xch08-sections" role="group" aria-label="Choose which groups run as columns">
            {groups.map((c) => <Tag key={c.id} pressed={!hidden.includes(c.id)} onClick={() => toggleGroup(c.id)}>{c.name}</Tag>)}
          </div>
        </div>
        <div className="xch08-layout">
        <aside className="xch08-people" aria-label="People">
          <button type="button" className="xch08-people__toggle" aria-expanded={peopleOpen} onClick={() => setPeopleOpen(!peopleOpen)}><span className="ds-kicker">People {people.length}</span><span aria-hidden="true">{peopleOpen ? '−' : '+'}</span></button>
          {peopleOpen && (people.length ? <ul>{people.map((p) => {
            const dm = dmStory(p), n = newFrom(p), isOn = person === p, asked = askedBy(p), places = inGroups(p);
            return (
              <li key={p} className={`xch08-person${windows.includes(dm.key) ? ' is-open' : ''}`}>
                <div className="xch08-person__row">
                  <button type="button" className="xch08-person__chat" aria-label={`Chat with ${p}`} onClick={(e) => open(dm.key, e.currentTarget)}>
                    <Avatar name={p} size="s" presence={conv(dm.conv).online ? 'on' : 'off'} />
                    <span className="xch08-person__text"><strong>{p}</strong><span className="ds-caption">{ROLES[p]}</span></span>
                    {n > 0 && <span className="xch08-count ds-grain">{n}<span className="ds-sr-only"> new</span></span>}
                  </button>
                  <button type="button" className="xch08-fold xch08-person__more" aria-expanded={isOn} aria-label={`${isOn ? 'Hide' : 'Show'} where ${first(p)} is active`} onClick={() => setPerson(isOn ? null : p)}><span aria-hidden="true">{isOn ? '−' : '+'}</span></button>
                </div>
                {isOn && <div className="xch08-person__detail">
                  {asked.length > 0 && <><p className="ds-label">Asked for you in</p><ul>{asked.map(({ s, n: c }) => <li key={s.key}><button type="button" className="xch08-link" onClick={(e) => open(s.key, e.currentTarget)}>{title(conv(s.conv))} · {c} {c === 1 ? 'mention' : 'mentions'}</button></li>)}</ul></>}
                  <p className="ds-label">Active in</p>
                  {places.length ? <ul>{places.map((c) => <li key={c.id}><button type="button" className="xch08-link" onClick={() => { setFolded((f) => ({ ...f, [c.id]: false })); document.getElementById(`col-${c.id}`)?.scrollIntoView({ block: 'center' }); }}>{title(c)}</button></li>)}</ul> : <p className="ds-caption">No shared groups.</p>}
                  <Button variant="secondary" size="sm" onClick={(e) => open(dm.key, e.currentTarget as HTMLElement)}>Open chat</Button>
                </div>}
              </li>
            );
          })}</ul> : <p className="ds-caption">Nobody by that name.</p>)}
          <button type="button" className="xch08-people__toggle" aria-expanded={chansOpen} onClick={() => setChansOpen(!chansOpen)}><span className="ds-kicker">Channels {channelsShown.length}</span><span aria-hidden="true">{chansOpen ? '−' : '+'}</span></button>
          {chansOpen && <ul>{channelsShown.map((c) => { const n = paperStories.filter((s) => s.conv === c.id).reduce((t, s) => t + s.unread, 0), key = `c:${c.id}`; return (
            <li key={c.id} className={`xch08-person${windows.includes(key) ? ' is-open' : ''}`}><button type="button" className="xch08-person__chat" aria-label={`Chat in ${c.name}`} onClick={(e) => open(key, e.currentTarget)}>
              <span className="xch08-person__text"><strong>{title(c)}</strong><span className="ds-caption">{c.members} members</span></span>
              {n > 0 && <span className="xch08-count ds-grain">{n}<span className="ds-sr-only"> new</span></span>}
            </button></li>
          ); })}</ul>}
        </aside>
        <div className="xch08-content">
        {boxes.length > 0 && <section className="xch08-boxes" aria-label="Where you were mentioned">
          <p className="ds-kicker">Where they asked for you</p>
          <ul>{boxes.map((s) => { const count = s.thread.filter((m) => m.who !== ME).length; return (
            <li key={s.key}><button type="button" className={`xch08-box${s.unread ? ' is-unread' : ''}${windows.includes(s.key) ? ' is-open' : ''}`} aria-expanded={windows.includes(s.key)} onClick={(e) => open(s.key, e.currentTarget)}>
              <span className="xch08-box__top"><span className="xch08-box__chan">{title(conv(s.conv))}</span><span className="xch08-box__n">{count} {count === 1 ? 'mention' : 'mentions'}</span></span>
              <span className="xch08-box__last">{rich(s.last.text)}</span>
              <span className="ds-caption">{first(s.last.who)} · {s.last.yesterday ? 'Yesterday' : s.last.time}{s.unread > 0 ? ` · ${s.unread} new` : ''}</span>
            </button></li>
          ); })}</ul>
        </section>}
        {nothing ? (
          <EmptyState title={needle ? `Nothing matches “${q.trim()}”` : 'Nothing left to read'} body={needle ? 'Search looks through every story and letter.' : 'Every story in this view has been read.'}
            action={<Button variant="secondary" size="sm" onClick={() => { setQ(''); setView('all'); put((d) => ({ ...d, hidden: [] })); }}>Show every story</Button>} />
        ) : (
          <>
          {columns.length > 0 && <div className="xch08-foldall"><Button variant="ghost" size="sm" onClick={() => setFolded(allFolded ? {} : Object.fromEntries(columns.map(({ c }) => [c.id, true])))}>{allFolded ? 'Expand all columns' : 'Collapse all columns'}</Button></div>}
          <div className="xch08-columns">
            {columns.map(({ c, list }) => (
              <section key={c.id} id={`col-${c.id}`} className="xch08-col" aria-label={c.name}>
                <header className="xch08-col__head"><h2 className="ds-h4"><button type="button" className="xch08-fold" aria-expanded={!folded[c.id]} onClick={() => setFolded((f) => ({ ...f, [c.id]: !f[c.id] }))}><span aria-hidden="true">{folded[c.id] ? '+' : '−'}</span> {title(c)}</button></h2><span className="ds-caption">{list.length} {list.length === 1 ? 'story' : 'stories'}</span></header>
                {folded[c.id] ? null : list.length ? <ul>{list.map((s, i) => row(s, i === 0))}</ul> : <p className="ds-caption">No unread stories.</p>}
              </section>
            ))}
          </div>
          </>
        )}
        </div>
        </div>
      </main>

      <div className="xch08-dock" aria-label="Open chats">
        {mini.length > 0 && <div className="xch08-tray" role="group" aria-label="Minimised chats">
          {mini.map((k) => { const s = byKey(k); if (!s) return null; return <Button key={k} variant="secondary" size="sm" onClick={() => open(k)}>{title(conv(s.conv))}{drafts[k]?.trim() ? ', draft' : ''}</Button>; })}
        </div>}
        <div className="xch08-windows">
          {windows.map((k) => { const s = byKey(k); if (!s) return null; const draft = drafts[k] ?? ''; return (
            <section key={k} id={`win-${k}`} className="xch08-win ds-washi" data-surface="paper" role="dialog" aria-label={`Chat in ${title(conv(s.conv))}`} onKeyDown={onWinKey(k)}>
              <header className="xch08-win__head">
                <div><p className="ds-kicker">{s.key.startsWith('dm:') ? 'Personal' : title(conv(s.conv))}</p><p className="xch08-win__title">{s.key.startsWith('dm:') ? conv(s.conv).name : s.key.startsWith('c:') ? `${conv(s.conv).members} members` : s.key.startsWith('m:') ? `${s.thread.filter((m) => m.who !== ME).length} mentions` : headline(s.root.text)}</p></div>
                <Button variant="ghost" size="sm" aria-label={`Minimise ${title(conv(s.conv))}`} onClick={() => minimise(k)}>Hide</Button>
                <Button variant="ghost" size="sm" aria-label={`Close ${title(conv(s.conv))}`} onClick={() => close(k)}>Close</Button>
              </header>
              <WinStream length={s.thread.length}>{!s.thread.length && <p className="ds-caption xch08-hello">Say hello to {first(conv(s.conv).name)}. Your first message starts this chat.</p>}{s.key.startsWith('dm:') && <StreamDivider>Only you two can see this</StreamDivider>}{s.key.startsWith('m:') && <StreamDivider>Only the messages that mention you</StreamDivider>}<Talk list={s.thread} /></WinStream>
              <form className="xch08-win__form" ref={(el) => { forms.current[k] = el; }} onSubmit={(e) => { e.preventDefault(); send(s); }}>
                <Input compact multiline rows={2} label={`Reply in ${title(conv(s.conv))}`} hideLabel placeholder="Reply" value={draft}
                  onChange={(e) => { const v = e.target.value; put((d) => ({ ...d, drafts: { ...d.drafts, [k]: v } })); }}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(s); } }} />
                {attached[k] && <div><Tag onClick={() => setAttached((x) => ({ ...x, [k]: undefined }))}>{`${attached[k]!.name} ×`}</Tag></div>}
                <div className="xch08-win__foot">
                  <FormatBar box={{ get current() { return forms.current[k] ?? null; } }} value={draft} onChange={(v) => put((d) => ({ ...d, drafts: { ...d.drafts, [k]: v } }))} onFile={(f) => setAttached((x) => ({ ...x, [k]: f }))} />
                  <Button variant="secondary" size="sm" type="submit" disabled={!draft.trim() && !attached[k]}>Send</Button>
                </div>
              </form>
            </section>
          ); })}
        </div>
      </div>

      <Modal open={composing} onClose={closeCompose} title="New message" actions={<><Button variant="ghost" onClick={closeCompose}>Cancel</Button><Button variant="primary" disabled={!to.trim()} onClick={startNew}>Open chat</Button></>}>
        <Input compact label="To a group or person" list="xch08-to" value={to} error={toErr} onChange={(e) => { setTo(e.target.value); setToErr(undefined); }} onKeyDown={(e) => { if (e.key === 'Enter') startNew(); }} />
        <datalist id="xch08-to">{ALL.map((c) => <option key={c.id} value={c.kind === 'channel' ? `# ${c.name}` : c.name} />)}</datalist>
      </Modal>
      {toast && <Toast onDone={clear} action={toast.undo && <Button variant="ghost" size="sm" onClick={toast.undo}>Undo</Button>}>{toast.t}</Toast>}
    </div>
  );
}
function WinStream({ length, children }: { length: number; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { const el = ref.current; if (el) el.scrollTop = el.scrollHeight; }, [length]);
  return <div className="xch08-win__stream" ref={ref}>{children}</div>;
}
createRoot(document.getElementById('root')!).render(<Broadsheet />);
