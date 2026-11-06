// The team chat everyone knows: channels, a stream, a thread and a composer
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode, RefObject } from 'react';
import { createRoot } from 'react-dom/client';
import { AppShell, Rail, RailSection, RailItem, Button, Tag, Avatar, Input, Card, Modal, EmptyState, Toolbar, List, ListItem, Message, Mention, StreamDivider, Toast } from '../../../design-system/components';
import { CONVS, ME, NOW } from './data';
import type { Conv, File, Msg } from './data';
import './styles.css';

const WORKSPACES = ['Harbour Studio', 'Tidewater Press', 'Open Type Guild'];
const first = (who: string) => who.split(' ')[0];
const conv = (id: string) => CONVS.find((c) => c.id === id)!;
const title = (c: Conv) => (c.kind === 'channel' ? `# ${c.name}` : c.name);
const plain = (t: string) => t.replace(/\*\*|`/g, '');

function rich(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|_[^_\s][^_]*_|`[^`]+`|@[A-Z][a-z]+)/g).filter(Boolean).map((p, i) => {
    if (p.startsWith('**')) return <strong key={i}>{p.slice(2, -2)}</strong>;
    if (p.startsWith('`')) return <code key={i}>{p.slice(1, -1)}</code>;
    if (p.startsWith('@')) return <Mention key={i} me={p.slice(1) === first(ME)}>{p.slice(1)}</Mention>;
    if (p.startsWith('_') && p.endsWith('_') && p.length > 2) return <em key={i}>{p.slice(1, -1)}</em>;
    return <span key={i}>{p}</span>;
  });
}
const useNarrow = () => {
  const q = '(max-width: 1100px)';
  const [narrow, set] = useState(() => matchMedia(q).matches);
  useEffect(() => { const m = matchMedia(q); const on = () => set(m.matches); m.addEventListener('change', on); return () => m.removeEventListener('change', on); }, []);
  return narrow;
};

function Composer({ placeholder, value, onChange, onSend, primary, boxRef }: { placeholder: string; value: string; onChange: (v: string) => void; onSend: (text: string, files: File[]) => void; primary: boolean; boxRef?: RefObject<HTMLDivElement | null> }) {
  const [files, setFiles] = useState<File[]>([]);
  const own = useRef<HTMLDivElement>(null);
  const box = boxRef ?? own;
  const picker = useRef<HTMLInputElement>(null);
  const can = value.trim().length > 0 || files.length > 0;
  const send = () => { if (can) { onSend(value.trim(), files); setFiles([]); } };
  const wrap = (mark: string) => {
    const el = box.current?.querySelector('textarea');
    if (!el) return;
    const { selectionStart: a, selectionEnd: b } = el;
    const inner = value.slice(a, b) || 'text';
    onChange(value.slice(0, a) + mark + inner + mark + value.slice(b));
    requestAnimationFrame(() => { el.focus(); el.setSelectionRange(a + mark.length, a + mark.length + inner.length); });
  };
  return (
    <form className="xch00-composer" onSubmit={(e) => { e.preventDefault(); send(); }}>
      <div ref={box}>
        <Input compact multiline rows={2} label={placeholder} hideLabel placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }} />
      </div>
      {files.length > 0 && <div className="xch00-composer__files">{files.map((f) => <Tag key={f.name} onClick={() => setFiles((fs) => fs.filter((x) => x !== f))}>{f.name} ×</Tag>)}</div>}
      <div className="xch00-composer__foot">
        <Toolbar label="Formatting">
          <Button variant="ghost" size="sm" aria-label="Bold" onClick={() => wrap('**')}><strong>B</strong></Button>
          <Button variant="ghost" size="sm" aria-label="Italic" onClick={() => wrap('_')}><em>I</em></Button>
          <Button variant="ghost" size="sm" aria-label="Code" onClick={() => wrap('`')}>Code</Button>
          <Button variant="ghost" size="sm" onClick={() => picker.current?.click()}>Attach</Button>
          <input ref={picker} type="file" hidden aria-label="Attach a file" onChange={(e) => { const f = e.target.files?.[0]; if (f) setFiles((fs) => [...fs, { name: f.name, meta: 'Attached just now' }]); e.target.value = ''; }} />
        </Toolbar>
        <Button variant={primary ? 'primary' : 'secondary'} size="sm" type="submit" disabled={!can}>Send</Button>
      </div>
    </form>
  );
}

type Panel = { kind: 'thread'; root: string } | { kind: 'details' } | null;
type ListView = 'threads' | 'mentions' | 'drafts';

function Chat() {
  const narrow = useNarrow();
  const [current, setCurrent] = useState<string>('launch-week');
  const [listView, setListView] = useState<ListView | null>(null);
  const [panel, setPanel] = useState<Panel>({ kind: 'thread', root: 'lw1' });
  const [sheet, setSheet] = useState(false);
  const [seen, setSeen] = useState<Record<string, boolean>>({});
  const [extra, setExtra] = useState<Record<string, Msg[]>>({});
  const [reacts, setReacts] = useState<Record<string, boolean>>({});
  const [drafts, setDrafts] = useState<Record<string, string>>({ dc1: 'Slash-command states look right, one note on the ' });
  const [query, setQuery] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const clearToast = useCallback(() => setToast(null), []);
  const closeSheet = useCallback(() => setSheet(false), []);
  const mainBox = useRef<HTMLDivElement>(null);
  const threadBox = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);

  const c = conv(current);
  const tops = (id: string) => [...conv(id).messages, ...(extra[id] ?? [])];
  const repliesOf = (m: Msg) => [...(m.replies ?? []), ...(extra[m.id] ?? [])];
  const allOf = (id: string) => tops(id).flatMap((m) => [m, ...repliesOf(m)]);
  const unread = (id: string) => (seen[id] || (id === current && !listView) ? 0 : allOf(id).filter((m) => m.isNew).length);
  const findTop = (id: string) => { for (const x of CONVS) { const m = tops(x.id).find((t) => t.id === id); if (m) return { conv: x, msg: m }; } return null; };

  const threads = CONVS.flatMap((x) => tops(x.id).filter((m) => repliesOf(m).length > 0 && [m, ...repliesOf(m)].some((r) => r.who === ME)).map((m) => ({ conv: x, msg: m })));
  const mentions = CONVS.flatMap((x) => allOf(x.id).filter((m) => m.text.includes(`@${first(ME)}`)).map((m) => ({ conv: x, msg: m, root: tops(x.id).find((t) => t === m || repliesOf(t).includes(m))! })));
  const draftKeys = Object.keys(drafts).filter((k) => drafts[k].trim());
  const threadUnread = threads.reduce((n, t) => n + (seen[t.conv.id] ? 0 : repliesOf(t.msg).filter((r) => r.isNew).length), 0);
  const mentionUnread = mentions.filter((m) => m.msg.isNew && !seen[m.conv.id]).length;

  const go = (id: string) => { if (!listView && id !== current) setSeen((s) => ({ ...s, [current]: true })); setCurrent(id); setListView(null); setQuery(''); setPanel(null); setSheet(false); };
  const openThread = (root: string) => { setPanel({ kind: 'thread', root }); if (narrow) setSheet(true); };
  const openDetails = () => { setPanel({ kind: 'details' }); if (narrow) setSheet(true); };
  const jump = (id: string, root?: string) => { go(id); if (root) openThread(root); };

  const q = query.trim().toLowerCase();
  const list = tops(current).filter((m) => !q || `${m.who} ${m.text}`.toLowerCase().includes(q));
  useEffect(() => { const s = scroller.current; if (s && !q) s.scrollTop = s.scrollHeight; }, [current, list.length, listView, q]);

  const send = (key: string, draftKey: string, text: string, files: File[]) => {
    setExtra((x) => ({ ...x, [key]: [...(x[key] ?? []), { id: `s${Date.now()}`, who: ME, time: NOW, text: text || 'Shared a file.', file: files[0] }] }));
    setDrafts((d) => ({ ...d, [draftKey]: '' }));
  };

  // Modals trap Tab: the system Modal moves focus in but does not hold it.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const d = document.querySelector<HTMLElement>('.ds-sheet');
      if (!d || e.key !== 'Tab') return;
      const f = [...d.querySelectorAll<HTMLElement>('button:not(:disabled), [href], textarea')];
      if (!f.length) return;
      const a = f[0], z = f[f.length - 1], cur = document.activeElement;
      if (e.shiftKey && (cur === a || cur === d)) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && cur === z) { e.preventDefault(); a.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const stream = (msgs: Msg[], opts: { days?: boolean; threads?: boolean; box: RefObject<HTMLDivElement | null>; showNew?: boolean }) => {
    let newDone = false;
    return msgs.map((m, i) => {
      const prev = msgs[i - 1];
      const dayBreak = opts.days && (!prev || !!prev.yesterday !== !!m.yesterday);
      const newBreak = !!opts.showNew && !!m.isNew && !newDone;
      if (newBreak) newDone = true;
      const reps = repliesOf(m);
      const labels = [...(m.reactions ?? [])];
      if (reacts[`${m.id}:+1`] && !labels.some((r) => r.label === '+1')) labels.push({ label: '+1', count: 0 });
      const reactions = labels.map((r) => { const on = !!reacts[`${m.id}:${r.label}`]; return { ...r, mine: on, count: r.count + (on ? 1 : 0) }; });
      const toggle = (l: string) => setReacts((x) => ({ ...x, [`${m.id}:${l}`]: !x[`${m.id}:${l}`] }));
      return (
        <div key={m.id}>
          {dayBreak && <StreamDivider>{m.yesterday ? 'Yesterday' : 'Today'}</StreamDivider>}
          {newBreak && <StreamDivider tone="new">New</StreamDivider>}
          <Message who={m.who} time={m.time} mine={m.who === ME} grouped={!dayBreak && !newBreak && prev?.who === m.who && !m.file}
            reactions={reactions} onReact={toggle}
            thread={opts.threads && reps.length > 0 ? { count: reps.length, last: reps[reps.length - 1].time, onOpen: () => openThread(m.id) } : undefined}
            attachments={m.file && <Card variant="compact" title={m.file.name} note={m.file.meta} />}
            actions={<>
              <Button variant="ghost" size="sm" aria-label={`React +1 to ${m.who}`} onClick={() => toggle('+1')}>+1</Button>
              <Button variant="ghost" size="sm" onClick={() => (opts.threads ? openThread(m.id) : opts.box.current?.querySelector('textarea')?.focus())}>Reply</Button>
            </>}>
            {rich(m.text)}
          </Message>
        </div>
      );
    });
  };

  const threadFound = panel?.kind === 'thread' ? findTop(panel.root) : null;
  const panelTitle = threadFound ? 'Thread' : 'Details';
  const panelBody = threadFound ? (
    <div className="xch00-panel__body">
      <div className="xch00-panel__stream">
        {stream([threadFound.msg], { box: threadBox })}
        <StreamDivider>{repliesOf(threadFound.msg).length} {repliesOf(threadFound.msg).length === 1 ? 'reply' : 'replies'}</StreamDivider>
        {stream(repliesOf(threadFound.msg), { box: threadBox, showNew: !seen[threadFound.conv.id] })}
      </div>
      <Composer key={threadFound.msg.id} placeholder={`Reply to ${first(threadFound.msg.who)}`} value={drafts[threadFound.msg.id] ?? ''} onChange={(v) => setDrafts((d) => ({ ...d, [threadFound.msg.id]: v }))}
        onSend={(t, f) => send(threadFound.msg.id, threadFound.msg.id, t, f)} primary={narrow} boxRef={threadBox} />
    </div>
  ) : panel?.kind === 'details' ? (() => {
    const all = allOf(current);
    const people = [...new Set(all.map((m) => m.who))];
    const files = all.flatMap((m) => (m.file ? [m.file] : []));
    return (
      <div className="xch00-details">
        <section><p className="ds-kicker">About</p><p className="ds-body-s">{c.topic}</p>{c.members && <p className="ds-caption">{c.members} members, {people.length} active lately</p>}</section>
        <section><p className="ds-kicker">People here</p><ul className="xch00-people">{people.map((p) => <li key={p}><Avatar name={p} size="s" gold={p === ME} /><span>{p}</span></li>)}</ul></section>
        <section><p className="ds-kicker">Files</p>{files.length ? <ul className="xch00-files">{files.map((f) => <li key={f.name}><span>{f.name}</span><span className="ds-caption">{f.meta}</span></li>)}</ul> : <p className="ds-caption">No files shared yet.</p>}</section>
      </div>
    );
  })() : null;

  const aside = !narrow && panel ? (
    <div className="xch00-panel">
      <header className="xch00-panel__head">
        <div><p className="ds-kicker">{threadFound ? title(threadFound.conv) : title(c)}</p><h2 className="ds-h4">{panelTitle}</h2></div>
        <Button variant="ghost" size="sm" onClick={() => setPanel(null)}>Close</Button>
      </header>
      {panelBody}
    </div>
  ) : undefined;

  const listRows = listView === 'threads'
    ? threads.map((t) => <ListItem key={t.msg.id} lead={<Avatar name={t.msg.who} size="s" />} title={`${title(t.conv)}: ${t.msg.who}`} meta={plain(t.msg.text)} end={`${repliesOf(t.msg).length} replies`} onClick={() => jump(t.conv.id, t.msg.id)} />)
    : listView === 'mentions'
    ? mentions.map((m) => <ListItem key={m.msg.id} lead={<Avatar name={m.msg.who} size="s" />} title={`${title(m.conv)}: ${m.msg.who}`} meta={plain(m.msg.text)} end={m.msg.time} onClick={() => jump(m.conv.id, m.root.id)} />)
    : draftKeys.map((k) => { const channel = CONVS.find((x) => x.id === k); const found = findTop(k); const home = channel ?? found!.conv; return <ListItem key={k} title={`${title(home)}${found ? ', in a thread' : ''}`} meta={drafts[k]} onClick={() => jump(home.id, found?.msg.id)} />; });
  const listNames = { threads: 'Threads', mentions: 'Mentions', drafts: 'Drafts' };

  const sidebar = (
    <Rail label="Channels and messages"
      header={<><p className="xch00-brand">Harbour Studio</p><p className="ds-caption">Kaiwa, team chat</p></>}
      footer={<div className="xch00-me"><Avatar name={ME} size="s" gold presence="on" /><span><strong>{ME}</strong><span className="ds-caption">Active, quiet after 18:00</span></span></div>}>
      <RailSection title="Your work">
        <RailItem label="Threads" current={listView === 'threads'} unread={threadUnread > 0} count={threadUnread} onClick={() => setListView('threads')} />
        <RailItem label="Mentions" current={listView === 'mentions'} unread={mentionUnread > 0} count={mentionUnread} onClick={() => setListView('mentions')} />
        <RailItem label="Drafts" current={listView === 'drafts'} count={draftKeys.length} onClick={() => setListView('drafts')} />
      </RailSection>
      <RailSection title="Channels">
        {CONVS.filter((x) => x.kind === 'channel').map((x) => { const n = unread(x.id); return <RailItem key={x.id} lead="#" label={x.name} current={!listView && current === x.id} unread={n > 0} count={n} onClick={() => go(x.id)} />; })}
      </RailSection>
      <RailSection title="Direct messages">
        {CONVS.filter((x) => x.kind === 'dm').map((x) => { const n = unread(x.id); return <RailItem key={x.id} lead={x.online ? 'presence-on' : 'presence-off'} label={x.name} current={!listView && current === x.id} unread={n > 0} count={n} onClick={() => go(x.id)} />; })}
      </RailSection>
    </Rail>
  );

  return (
    <div className="xch00-root">
      <AppShell
        switcher={WORKSPACES.map((w, i) => (
          <button key={w} type="button" className={`xch00-ws${i === 0 ? ' is-current' : ''}`} aria-label={`Workspace: ${w}`} aria-current={i === 0 ? 'true' : undefined} onClick={() => { if (i > 0) setToast(`${w} is not set up in this prototype`); }}>
            <Avatar name={w} size="s" />
          </button>
        ))}
        sidebar={sidebar}
        header={listView ? <div className="xch00-title"><p className="ds-kicker">Your work</p><h1 className="ds-h4">{listNames[listView]}</h1></div> : <>
          <div className="xch00-title"><p className="ds-kicker">{c.kind === 'channel' ? 'Channel' : 'Direct message'}</p><h1 className="ds-h4">{title(c)}</h1></div>
          <p className="ds-caption xch00-topic">{c.kind === 'channel' ? c.topic : c.online ? 'Active now' : 'Away'}</p>
          <Button variant="ghost" size="sm" onClick={openDetails}>{c.members ? `${c.members} members` : 'Details'}</Button>
          <Input className="xch00-search" compact label="Search this conversation" hideLabel placeholder="Search here" value={query} onChange={(e) => setQuery(e.target.value)} />
        </>}
        aside={aside}
      >
        {listView ? (
          <div className="xch00-listview">
            {listRows.length ? <List label={listNames[listView]}>{listRows}</List>
              : <EmptyState title={`No ${listNames[listView].toLowerCase()}`} body="Quiet as the moon. New ones will show up here." />}
          </div>
        ) : (
          <div className="xch00-channel">
            <div className="xch00-stream" ref={scroller}>
              {list.length ? stream(list, { days: true, threads: true, box: mainBox, showNew: !seen[current] && !q })
                : <EmptyState title={`Nothing matches “${query.trim()}”`} body="Search looks through this conversation." action={<Button variant="secondary" size="sm" onClick={() => setQuery('')}>Clear search</Button>} />}
            </div>
            <Composer key={current} placeholder={`Message ${title(c)}`} value={drafts[current] ?? ''} onChange={(v) => setDrafts((d) => ({ ...d, [current]: v }))} onSend={(t, f) => send(current, current, t, f)} primary boxRef={mainBox} />
          </div>
        )}
      </AppShell>

      {narrow && panel && (
        <Modal open={sheet} onClose={closeSheet} variant="sheet" title={panelTitle}>
          <div className="xch00-panel">{panelBody}</div>
        </Modal>
      )}
      {toast && <Toast onDone={clearToast}>{toast}</Toast>}
    </div>
  );
}
createRoot(document.getElementById('root')!).render(<Chat />);
