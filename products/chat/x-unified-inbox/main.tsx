// Every channel in one inbox, triaged by what needs me
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode, RefObject } from 'react';
import { createRoot } from 'react-dom/client';
import { AppShell, Rail, RailSection, RailItem, Button, Tag, Avatar, Input, Card, Modal, EmptyState, Toolbar, Segmented, Tabs, Message, Mention, StreamDivider, Ring, Toast } from '../../../design-system/components';
import './styles.css';

// ---------- Data. Every count on screen is computed from this. ----------
const ME = 'Abhinav Singh';
const NOW = '16:40'; // Friday afternoon
type File = { name: string; meta: string };
type Reaction = { label: string; count: number; mine?: boolean };
type Msg = { id: string; who: string; time: string; yesterday?: boolean; text: string; isNew?: boolean; reactions?: Reaction[]; file?: File; replies?: Msg[] };
type Conv = { id: string; kind: 'channel' | 'dm'; name: string; topic: string; members?: number; online?: boolean; messages: Msg[] };

const CONVS: Conv[] = [
  { id: 'launch-week', kind: 'channel', name: 'launch-week', topic: 'Everything for the launch on Saturday 14 November', members: 14, messages: [
    { id: 'lw2', who: 'Manav Jain', time: '11:10', text: 'Launch-day rota is up. I have put you on the 08:00 to 11:00 shift.', replies: [
      { id: 'lw2a', who: ME, time: '11:30', text: 'Works for me.' },
      { id: 'lw2b', who: 'Ife Adeyemi', time: '15:20', isNew: true, text: 'Swapping with Noor on the late shift, rota updated.' },
      { id: 'lw2c', who: 'Noor Haddad', time: '15:48', isNew: true, text: 'Confirmed. Paging now points at me after 18:00.' },
    ] },
    { id: 'lw1', who: 'Kavya Reddy', time: '13:05', text: 'Pricing page copy is final from my side. @Abhinav can you sign it off by 17:00? Legal is waiting on your word before they close their review.', file: { name: 'pricing-page-v6.pdf', meta: 'PDF, 4 pages' }, reactions: [{ label: '+1', count: 3 }], replies: [
      { id: 'lw1a', who: 'Manav Jain', time: '13:22', text: 'The annual toggle copy changed too, worth a second look.' },
      { id: 'lw1b', who: 'Kavya Reddy', time: '13:40', text: 'Good catch. That is in **v6** as well.' },
      { id: 'lw1c', who: 'Ritu Sharma', time: '14:31', isNew: true, text: '@Abhinav legal just asked again.' },
    ] },
    { id: 'lw3', who: 'Ife Adeyemi', time: '15:02', isNew: true, text: 'Status page copy is merged.', reactions: [{ label: 'Done', count: 2 }] },
    { id: 'lw4', who: 'Tomas Lindqvist', time: '15:50', isNew: true, text: 'Press embargo confirmed for Saturday 09:00.' },
    { id: 'lw5', who: 'Tomas Lindqvist', time: '15:52', isNew: true, text: 'Briefing doc is in the launch folder if anyone gets a call before then.' },
  ] },
  { id: 'support-escalations', kind: 'channel', name: 'support-escalations', topic: 'Tickets that need someone senior', members: 7, messages: [
    { id: 'se1', who: 'Noor Haddad', time: '14:10', isNew: true, text: '@Abhinav Meridian Freight is asking whether deleted channels can be exported for their audit. Do we commit to that this quarter? They want an answer today.' },
    { id: 'se2', who: 'Mei Tanaka', time: '15:30', isNew: true, text: 'Two more tickets on login loops, both on Safari 19. Linked in the tracker.' },
  ] },
  { id: 'hiring', kind: 'channel', name: 'hiring', topic: 'Open roles and panels', members: 5, messages: [
    { id: 'hi1', who: 'Mei Tanaka', time: '09:40', isNew: true, text: 'The panel is split on Lena Okafor for the product design role. @Abhinav we need your yes or no today so we can reply before the weekend.', file: { name: 'lena-okafor-panel-notes.pdf', meta: 'PDF, 2 pages' }, replies: [
      { id: 'hi1a', who: 'Ritu Sharma', time: '10:15', text: 'Strong portfolio, weaker on systems. I would still hire.' },
    ] },
  ] },
  { id: 'design-crit', kind: 'channel', name: 'design-crit', topic: 'Work in progress, Mondays at 12:00', members: 9, messages: [
    { id: 'dc1', who: 'Ritu Sharma', time: '12:20', isNew: true, text: 'Composer v3 is ready. @Abhinav you asked to see the slash-command states before the crit, can you review?', file: { name: 'composer-v3.fig', meta: 'Design file, 12 frames' }, replies: [
      { id: 'dc1a', who: 'Kavya Reddy', time: '12:41', text: 'The send hint is much clearer now.' },
    ] },
    { id: 'dc2', who: 'Kavya Reddy', time: '14:05', isNew: true, text: 'Crit moved to Monday 12:00, room two.', reactions: [{ label: '+1', count: 4 }] },
  ] },
  { id: 'eng-platform', kind: 'channel', name: 'eng-platform', topic: 'Search, infrastructure and on-call', members: 18, messages: [
    { id: 'ep1', who: 'Tomas Lindqvist', time: '17:50', yesterday: true, text: 'Search index rebuild starts tonight. Expect stale results until morning.', replies: [
      { id: 'ep1a', who: ME, time: '18:02', yesterday: true, text: 'Please tell support before it starts.' },
      { id: 'ep1b', who: 'Tomas Lindqvist', time: '09:12', isNew: true, text: 'Rebuild finished at 06:40, 2.1 million messages.' },
      { id: 'ep1c', who: 'Manav Jain', time: '10:48', isNew: true, text: 'Some channels still return old results.' },
      { id: 'ep1d', who: 'Tomas Lindqvist', time: '16:05', isNew: true, text: 'Found it: archived channels were skipped. Re-running those tonight.' },
    ] },
    { id: 'ep2', who: 'Manav Jain', time: '13:15', isNew: true, text: 'Deploy freeze from Thursday 18:00 until launch.' },
  ] },
  { id: 'billing-migration', kind: 'channel', name: 'billing-migration', topic: 'Moving 2,400 accounts to the new invoices', members: 6, messages: [
    { id: 'bm2', who: 'Ife Adeyemi', time: '16:00', yesterday: true, text: 'Is the invoice email copy final?', replies: [
      { id: 'bm2a', who: ME, time: '16:20', yesterday: true, text: 'Final. Send it.' },
    ] },
    { id: 'bm1', who: 'Ife Adeyemi', time: '10:02', text: 'Test invoices for 40 accounts went out clean.', replies: [
      { id: 'bm1a', who: ME, time: '10:30', text: 'Did the tax lines match?' },
      { id: 'bm1b', who: 'Ife Adeyemi', time: '15:10', isNew: true, text: 'They match for all but three. Looking at those now.' },
    ] },
  ] },
  { id: 'announcements', kind: 'channel', name: 'announcements', topic: 'Company news, few posts', members: 42, messages: [
    { id: 'an1', who: 'Noor Haddad', time: '09:00', isNew: true, text: 'All-hands moved to Tuesday 11:00.', reactions: [{ label: '+1', count: 12 }] },
    { id: 'an2', who: 'Mei Tanaka', time: '12:30', isNew: true, text: 'The office is closed next Wednesday for the floor refit.' },
  ] },
  { id: 'random', kind: 'channel', name: 'random', topic: 'Tarts, books and everything else', members: 38, messages: [
    { id: 'ra1', who: 'Tomas Lindqvist', time: '13:00', isNew: true, text: 'Who left a whole persimmon tart in the kitchen? Asking as someone who ate a slice.' },
    { id: 'ra2', who: 'Mei Tanaka', time: '13:04', isNew: true, text: 'That was me. There is a second one.' },
    { id: 'ra3', who: 'Ritu Sharma', time: '13:06', isNew: true, text: 'On my way.' },
    { id: 'ra4', who: 'Manav Jain', time: '14:40', isNew: true, text: 'Book club is picking The Dispossessed next. Thoughts by next Friday.' },
  ] },
  { id: 'dm-manav', kind: 'dm', name: 'Manav Jain', topic: 'Direct message', online: true, messages: [
    { id: 'mj1', who: 'Manav Jain', time: '15:32', isNew: true, text: 'Do you have 15 minutes before the crit on Monday? I want to talk through the on-call load.' },
  ] },
  { id: 'dm-kavya', kind: 'dm', name: 'Kavya Reddy', topic: 'Direct message', online: true, messages: [
    { id: 'ky1', who: 'Kavya Reddy', time: '15:00', yesterday: true, text: 'Sending v6 of the pricing copy tomorrow morning.' },
    { id: 'ky2', who: ME, time: '15:04', yesterday: true, text: 'Thanks. Tag me in the channel so legal can see it.' },
  ] },
  { id: 'dm-noor', kind: 'dm', name: 'Noor Haddad', topic: 'Direct message', online: true, messages: [
    { id: 'nh1', who: 'Noor Haddad', time: '18:30', yesterday: true, text: 'Thanks for covering Tuesday.' },
    { id: 'nh2', who: ME, time: '18:40', yesterday: true, text: 'Any time.' },
  ] },
  { id: 'dm-tomas', kind: 'dm', name: 'Tomas Lindqvist', topic: 'Direct message', online: false, messages: [
    { id: 'tl1', who: 'Tomas Lindqvist', time: '11:50', text: 'No rush: can you read my launch postmortem template next week?' },
  ] },
];
const conv = (id: string) => CONVS.find((c) => c.id === id)!;
const convTitle = (c: Conv) => (c.kind === 'channel' ? `# ${c.name}` : c.name);

type Bucket = 'needs' | 'following' | 'catchup';
type Status = 'open' | 'later' | 'done';
type Item = { id: string; conv: string; root?: string; bucket: Bucket; reason: string; mention?: boolean; blocking?: boolean; status: Status };
const ITEMS: Item[] = [
  { id: 'i1', conv: 'launch-week', root: 'lw1', bucket: 'needs', reason: 'Asked you', mention: true, blocking: true, status: 'open' },
  { id: 'i2', conv: 'support-escalations', root: 'se1', bucket: 'needs', reason: 'Mentioned you', mention: true, status: 'open' },
  { id: 'i3', conv: 'hiring', root: 'hi1', bucket: 'needs', reason: 'Decision', mention: true, status: 'open' },
  { id: 'i4', conv: 'design-crit', root: 'dc1', bucket: 'needs', reason: 'Review', mention: true, status: 'open' },
  { id: 'i5', conv: 'dm-manav', bucket: 'needs', reason: 'Direct message', status: 'open' },
  { id: 'i6', conv: 'eng-platform', root: 'ep1', bucket: 'following', reason: 'Your thread', status: 'open' },
  { id: 'i7', conv: 'launch-week', root: 'lw2', bucket: 'following', reason: 'Your thread', status: 'open' },
  { id: 'i8', conv: 'billing-migration', root: 'bm1', bucket: 'following', reason: 'Your thread', status: 'open' },
  { id: 'i9', conv: 'launch-week', bucket: 'catchup', reason: 'Channel', status: 'open' },
  { id: 'i10', conv: 'support-escalations', bucket: 'catchup', reason: 'Channel', status: 'open' },
  { id: 'i11', conv: 'design-crit', bucket: 'catchup', reason: 'Channel', status: 'open' },
  { id: 'i12', conv: 'eng-platform', bucket: 'catchup', reason: 'Channel', status: 'open' },
  { id: 'i13', conv: 'announcements', bucket: 'catchup', reason: 'Channel', status: 'open' },
  { id: 'i14', conv: 'random', bucket: 'catchup', reason: 'Channel', status: 'open' },
  { id: 'i15', conv: 'dm-tomas', bucket: 'needs', reason: 'Direct message', status: 'later' },
  { id: 'i16', conv: 'billing-migration', root: 'bm2', bucket: 'following', reason: 'Your thread', status: 'done' },
  { id: 'i17', conv: 'dm-noor', bucket: 'needs', reason: 'Direct message', status: 'done' },
  { id: 'i18', conv: 'dm-kavya', bucket: 'needs', reason: 'Direct message', status: 'done' },
];
const OWNED_ROOTS = new Set(ITEMS.map((i) => i.root).filter(Boolean));

const VIEWS = [
  { id: 'everything', label: 'Everything', kicker: 'Harbour Studio, Friday' },
  { id: 'needs', label: 'Needs you', kicker: 'Reply or decide' },
  { id: 'mentions', label: 'Mentions', kicker: 'Someone said your name' },
  { id: 'threads', label: 'Threads', kicker: 'Threads you are in' },
  { id: 'drafts', label: 'Drafts', kicker: 'Not sent yet' },
  { id: 'later', label: 'Later', kicker: 'Set aside' },
];
const WORKSPACES = [{ id: 'harbour', name: 'Harbour Studio' }, { id: 'press', name: 'Tidewater Press' }, { id: 'guild', name: 'Open Type Guild' }];

// ---------- Helpers ----------
const toMin = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
const age = (m: Msg) => toMin(NOW) - toMin(m.time) + (m.yesterday ? 1440 : 0);
const ago = (mins: number) => (mins < 60 ? `${Math.max(mins, 1)}m` : mins < 1440 ? `${Math.round(mins / 60)}h` : 'a day');
const first = (who: string) => who.split(' ')[0];

/** Small inline format: **bold**, _italic_, `code` and @mentions. */
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

// ---------- Conversation: thread, channel stream, details, composer ----------
type Store = {
  extra: Record<string, Msg[]>;
  reacts: Record<string, boolean>;
  toggleReact: (msgId: string, label: string) => void;
  drafts: Record<string, string>;
  setDraft: (itemId: string, text: string) => void;
  send: (item: Item, key: string, text: string, files: File[]) => void;
};
function Composer({ item, target, placeholder, store, boxRef }: { item: Item; target: string; placeholder: string; store: Store; boxRef: RefObject<HTMLDivElement | null> }) {
  const value = store.drafts[item.id] ?? '';
  const [files, setFiles] = useState<File[]>([]);
  const picker = useRef<HTMLInputElement>(null);
  const can = value.trim().length > 0 || files.length > 0;
  const send = () => { if (!can) return; store.send(item, target, value.trim(), files); setFiles([]); };
  const wrap = (open: string, close = open) => {
    const el = boxRef.current?.querySelector('textarea');
    if (!el) return;
    const { selectionStart: a, selectionEnd: b } = el;
    const inner = value.slice(a, b) || 'text';
    store.setDraft(item.id, value.slice(0, a) + open + inner + close + value.slice(b));
    requestAnimationFrame(() => { el.focus(); el.setSelectionRange(a + open.length, a + open.length + inner.length); });
  };
  return (
    <form className="xch02-composer" onSubmit={(e) => { e.preventDefault(); send(); }}>
      <div ref={boxRef}>
        <Input compact multiline rows={2} label={placeholder} hideLabel placeholder={placeholder} value={value}
          onChange={(e) => store.setDraft(item.id, e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }} />
      </div>
      {files.length > 0 && <div className="xch02-composer__files">{files.map((f) => <Tag key={f.name} onClick={() => setFiles((fs) => fs.filter((x) => x !== f))}>{f.name} ×</Tag>)}</div>}
      <div className="xch02-composer__foot">
        <Toolbar label="Formatting">
          <Button variant="ghost" size="sm" aria-label="Bold" onClick={() => wrap('**')}><strong>B</strong></Button>
          <Button variant="ghost" size="sm" aria-label="Italic" onClick={() => wrap('_')}><em>I</em></Button>
          <Button variant="ghost" size="sm" aria-label="Code" onClick={() => wrap('`')}>Code</Button>
          <Button variant="ghost" size="sm" onClick={() => picker.current?.click()}>Attach</Button>
          <input ref={picker} type="file" hidden aria-label="Attach a file" onChange={(e) => { const f = e.target.files?.[0]; if (f) setFiles((fs) => [...fs, { name: f.name, meta: 'Attached just now' }]); e.target.value = ''; }} />
        </Toolbar>
        <Button variant="primary" size="sm" type="submit" disabled={!can}>Send</Button>
      </div>
    </form>
  );
}

function Stream({ list, store, onReply, onOpenThread, days }: { list: Msg[]; store: Store; onReply: () => void; onOpenThread?: (m: Msg) => void; days?: boolean }) {
  let seenNew = false;
  return (
    <>
      {list.map((m, i) => {
        const prev = list[i - 1];
        const dayBreak = days && (!prev || !!prev.yesterday !== !!m.yesterday);
        const newBreak = !!m.isNew && !seenNew;
        if (newBreak) seenNew = true;
        const replies = [...(m.replies ?? []), ...(store.extra[m.id] ?? [])];
        const reactions = (m.reactions ?? []).map((r) => { const on = !!store.reacts[`${m.id}:${r.label}`]; return { ...r, mine: on, count: r.count + (on ? 1 : 0) }; });
        return (
          <div key={m.id}>
            {dayBreak && <StreamDivider>{m.yesterday ? 'Yesterday' : 'Today'}</StreamDivider>}
            {newBreak && <StreamDivider tone="new">New</StreamDivider>}
            <Message who={m.who} time={m.time} mine={m.who === ME} grouped={!dayBreak && !newBreak && prev?.who === m.who && !m.file}
              reactions={reactions} onReact={(l) => store.toggleReact(m.id, l)}
              thread={onOpenThread && replies.length > 0 ? { count: replies.length, last: replies[replies.length - 1].time, onOpen: () => onOpenThread(m) } : undefined}
              attachments={m.file && <Card variant="compact" title={m.file.name} note={m.file.meta} />}
              actions={<Button variant="ghost" size="sm" onClick={onReply}>Reply</Button>}>
              {rich(m.text)}
            </Message>
          </div>
        );
      })}
    </>
  );
}

function Details({ c, store }: { c: Conv; store: Store }) {
  const all = [...c.messages, ...(store.extra[c.id] ?? [])].flatMap((m) => [m, ...(m.replies ?? []), ...(store.extra[m.id] ?? [])]);
  const people = [...new Set(all.map((m) => m.who))];
  const files = all.flatMap((m) => (m.file ? [m.file] : []));
  return (
    <div className="xch02-details">
      <section>
        <p className="ds-kicker">About</p>
        <p className="ds-body-s">{c.topic}</p>
        {c.members && <p className="ds-caption">{c.members} members, {people.length} active today</p>}
      </section>
      <section>
        <p className="ds-kicker">People here</p>
        <ul className="xch02-people">{people.map((p) => <li key={p}><Avatar name={p} size="s" gold={p === ME} /><span>{p}</span></li>)}</ul>
      </section>
      <section>
        <p className="ds-kicker">Files</p>
        {files.length ? <ul className="xch02-files">{files.map((f) => <li key={f.name}><span>{f.name}</span><span className="ds-caption">{f.meta}</span></li>)}</ul> : <p className="ds-caption">No files shared yet.</p>}
      </section>
    </div>
  );
}

type Tab = 'thread' | 'channel' | 'details';
function Conversation({ item, store, compactHead, onTriage }: { item: Item; store: Store; compactHead?: boolean; onTriage: (id: string, s: Status) => void }) {
  const c = conv(item.conv);
  const [rootId, setRootId] = useState(item.root);
  const [tab, setTab] = useState<Tab>(item.root ? 'thread' : 'channel');
  const box = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const top = [...c.messages, ...(store.extra[c.id] ?? [])];
  const root = top.find((m) => m.id === rootId);
  const replies = root ? [...(root.replies ?? []), ...(store.extra[root.id] ?? [])] : [];
  const focusComposer = () => box.current?.querySelector('textarea')?.focus();
  useEffect(() => { const s = scroller.current; if (s) s.scrollTop = s.scrollHeight; }, [tab, rootId, replies.length, top.length]);
  const tabs: Array<{ value: Tab; label: string; count?: number }> = [
    ...(root ? [{ value: 'thread' as const, label: 'Thread', count: replies.length }] : []),
    { value: 'channel', label: c.kind === 'channel' ? 'Channel' : 'Messages' },
    { value: 'details', label: 'Details' },
  ];
  const inThread = tab === 'thread' && !!root;
  return (
    <div className="xch02-conv">
      <header className={`xch02-conv__head${compactHead ? ' is-compact' : ''}`}>
        {!compactHead && <>
          <p className="ds-kicker">{inThread ? 'Thread in' : c.kind === 'channel' ? 'Channel' : 'Direct message'}</p>
          <h2 className="ds-h4">{convTitle(c)}</h2>
        </>}
        <p className="ds-caption xch02-conv__topic">{c.members ? `${c.members} members. ${c.topic}` : c.online ? 'Active now' : 'Away'}</p>
        <div className="xch02-conv__triage">
          {item.status === 'done'
            ? <Button variant="ghost" size="sm" onClick={() => onTriage(item.id, 'open')}>Back to inbox</Button>
            : <><Button variant="secondary" size="sm" onClick={() => onTriage(item.id, 'done')}>Done</Button>
              <Button variant="ghost" size="sm" onClick={() => onTriage(item.id, item.status === 'later' ? 'open' : 'later')}>{item.status === 'later' ? 'Back to inbox' : 'Later'}</Button></>}
        </div>
        <Tabs label="Conversation" value={tab} onChange={setTab} tabs={tabs} />
      </header>
      <div className="xch02-conv__stream" ref={scroller}>
        {tab === 'thread' && root && <>
          <Stream list={[root]} store={store} onReply={focusComposer} />
          <StreamDivider>{replies.length} {replies.length === 1 ? 'reply' : 'replies'}</StreamDivider>
          <Stream list={replies} store={store} onReply={focusComposer} />
        </>}
        {tab === 'channel' && <Stream list={top} store={store} days onReply={focusComposer} onOpenThread={(m) => { setRootId(m.id); setTab('thread'); }} />}
        {tab === 'details' && <Details c={c} store={store} />}
      </div>
      {tab !== 'details' && <Composer item={item} target={inThread ? root!.id : c.id} placeholder={inThread ? `Reply to ${first(root!.who)}` : `Message ${convTitle(c)}`} store={store} boxRef={box} />}
    </div>
  );
}

// ---------- The inbox ----------
function Inbox() {
  const [status, setStatus] = useState<Record<string, Status>>(() => Object.fromEntries(ITEMS.map((i) => [i.id, i.status])));
  const [read, setRead] = useState<Record<string, boolean>>({});
  const [extra, setExtra] = useState<Record<string, Msg[]>>({});
  const [reacts, setReacts] = useState<Record<string, boolean>>({});
  const [drafts, setDrafts] = useState<Record<string, string>>({ i4: 'Slash-command states look right, one note on the ' });
  const [view, setView] = useState('everything');
  const [order, setOrder] = useState<'need' | 'time'>('need');
  const [query, setQuery] = useState('');
  const [showDone, setShowDone] = useState(false);
  const [sel, setSel] = useState<string | null>(null);
  const [sheet, setSheet] = useState(false);
  const [composing, setComposing] = useState(false);
  const [to, setTo] = useState('');
  const [body, setBody] = useState('');
  const [toErr, setToErr] = useState<string>();
  const [toast, setToast] = useState<{ text: string; undo?: () => void } | null>(null);
  const focusAfter = useRef<string | null>(null);
  const narrow = useNarrow();

  // What each item owns, computed from the messages.
  const msgsOf = useCallback((i: Item): Msg[] => {
    const c = conv(i.conv);
    if (i.root) { const r = c.messages.find((m) => m.id === i.root)!; return [r, ...(r.replies ?? []), ...(extra[r.id] ?? [])]; }
    return [...c.messages.filter((m) => !OWNED_ROOTS.has(m.id)), ...(extra[c.id] ?? [])];
  }, [extra]);
  const unreadOf = useCallback((i: Item) => (read[i.id] || status[i.id] === 'done' ? 0 : msgsOf(i).filter((m) => m.isNew).length), [read, status, msgsOf]);

  const isOpen = (i: Item) => status[i.id] === 'open';
  const inView = useCallback((i: Item, v: string) => {
    const s = status[i.id];
    if (v === 'everything') return s === 'open';
    if (v === 'needs') return s === 'open' && i.bucket === 'needs';
    if (v === 'mentions') return s === 'open' && !!i.mention;
    if (v === 'threads') return s === 'open' && i.bucket === 'following';
    if (v === 'drafts') return s !== 'done' && !!drafts[i.id]?.trim();
    if (v === 'later') return s === 'later';
    return i.conv === v && s !== 'done';
  }, [status, drafts]);
  const q = query.trim().toLowerCase();
  const matches = useCallback((i: Item) => !q || `${conv(i.conv).name} ${msgsOf(i).map((m) => `${m.who} ${m.text}`).join(' ')}`.toLowerCase().includes(q), [q, msgsOf]);
  const waited = (i: Item) => age(i.root ? msgsOf(i)[0] : msgsOf(i)[msgsOf(i).length - 1] ?? { time: NOW } as Msg);
  const latest = (i: Item) => Math.min(...msgsOf(i).map(age));

  const shown = ITEMS.filter((i) => inView(i, view) && matches(i));
  const needRows = shown.filter((i) => i.bucket === 'needs').sort((a, b) => Number(!!b.blocking) - Number(!!a.blocking) || waited(b) - waited(a));
  const followRows = shown.filter((i) => i.bucket === 'following').sort((a, b) => latest(a) - latest(b));
  const catchRows = shown.filter((i) => i.bucket === 'catchup').sort((a, b) => latest(a) - latest(b));
  const timeRows = [...shown].sort((a, b) => latest(a) - latest(b));
  const ordered = order === 'time' ? timeRows : [...needRows, ...followRows, ...catchRows];
  const doneRows = ITEMS.filter((i) => status[i.id] === 'done' && matches(i) && (view === 'everything' || i.conv === view));

  const openNeeds = ITEMS.filter((i) => isOpen(i) && i.bucket === 'needs').length;
  const openThreads = ITEMS.filter((i) => isOpen(i) && i.bucket === 'following').length;
  const openCatch = ITEMS.filter((i) => isOpen(i) && i.bucket === 'catchup').length;
  const cleared = ITEMS.filter((i) => status[i.id] === 'done').length;
  const unreadWhere = (f: (i: Item) => boolean) => ITEMS.filter((i) => status[i.id] === 'open' && f(i)).reduce((n, i) => n + unreadOf(i), 0);

  // Wide screens always have a conversation open; start on what needs you most.
  useEffect(() => { if (!narrow && !sel) setSel(needRows[0]?.id ?? ordered[0]?.id ?? null); }, [narrow, sel]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (sel && (!narrow || sheet)) setRead((r) => (r[sel] ? r : { ...r, [sel]: true })); }, [sel, narrow, sheet]);
  useEffect(() => { if (focusAfter.current) { document.getElementById(`row-${focusAfter.current}`)?.focus(); focusAfter.current = null; } });

  const closeSheet = useCallback(() => setSheet(false), []);
  const closeComposing = useCallback(() => { setComposing(false); setToErr(undefined); }, []);
  const clearToast = useCallback(() => setToast(null), []);
  const openItem = (id: string) => { setSel(id); if (narrow) setSheet(true); };

  const triage = (id: string, next: Status, fromRow = false) => {
    const before = status[id];
    const at = ordered.findIndex((i) => i.id === id);
    const neighbour = ordered[at + 1]?.id ?? ordered[at - 1]?.id ?? null;
    setStatus((s) => ({ ...s, [id]: next }));
    if (next !== 'open' && before === 'open') {
      if (sel === id) { setSel(neighbour); if (narrow) setSheet(false); }
      if (fromRow) focusAfter.current = neighbour;
    }
    const c = conv(ITEMS.find((i) => i.id === id)!.conv);
    setToast({ text: next === 'done' ? `Done: ${convTitle(c)}` : next === 'later' ? `Later: ${convTitle(c)}` : `Back in the inbox: ${convTitle(c)}`, undo: () => { setStatus((s) => ({ ...s, [id]: before })); setToast(null); } });
  };
  const markCaughtUp = () => {
    const ids = catchRows.map((i) => i.id);
    const prior = ids.map((id) => status[id]);
    setStatus((s) => { const n = { ...s }; ids.forEach((id) => { n[id] = 'done'; }); return n; });
    if (sel && ids.includes(sel)) setSel(needRows[0]?.id ?? followRows[0]?.id ?? null);
    setToast({ text: `Caught up on ${ids.length} ${ids.length === 1 ? 'channel' : 'channels'}`, undo: () => { setStatus((s) => { const n = { ...s }; ids.forEach((id, k) => { n[id] = prior[k]; }); return n; }); setToast(null); } });
  };

  const store: Store = {
    extra, reacts, drafts,
    toggleReact: (m, l) => setReacts((r) => ({ ...r, [`${m}:${l}`]: !r[`${m}:${l}`] })),
    setDraft: (id, text) => setDrafts((d) => ({ ...d, [id]: text })),
    send: (item, key, text, files) => {
      const msg: Msg = { id: `s${Date.now()}`, who: ME, time: NOW, text: text || 'Shared a file.', file: files[0] };
      setExtra((x) => ({ ...x, [key]: [...(x[key] ?? []), msg] }));
      setDrafts((d) => ({ ...d, [item.id]: '' }));
      const before = status[item.id];
      setStatus((s) => ({ ...s, [item.id]: 'done' }));
      setToast({ text: 'Sent, and moved to Done', undo: () => { setStatus((s) => ({ ...s, [item.id]: before })); setToast(null); } });
    },
  };

  const sendNew = () => {
    const name = to.trim().replace(/^#\s*/, '').toLowerCase();
    const c = CONVS.find((x) => x.name.toLowerCase() === name);
    if (!c) { setToErr('Pick a channel or person from the list.'); return; }
    if (!body.trim()) return;
    setExtra((x) => ({ ...x, [c.id]: [...(x[c.id] ?? []), { id: `s${Date.now()}`, who: ME, time: NOW, text: body.trim() }] }));
    setComposing(false); setTo(''); setBody(''); setToErr(undefined);
    setToast({ text: `Sent to ${convTitle(c)}` });
  };

  // Keyboard triage: J / K move, E done, L later. Modals trap Tab.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const dialog = document.querySelector<HTMLElement>('.ds-modal, .ds-sheet');
      if (dialog) {
        if (e.key !== 'Tab') return;
        const f = [...dialog.querySelectorAll<HTMLElement>('button:not(:disabled), [href], input:not([hidden]), textarea')];
        if (!f.length) return;
        const a = f[0], z = f[f.length - 1], cur = document.activeElement;
        if (e.shiftKey && (cur === a || cur === dialog)) { e.preventDefault(); z.focus(); }
        else if (!e.shiftKey && cur === z) { e.preventDefault(); a.focus(); }
        return;
      }
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.metaKey || e.ctrlKey || e.altKey || narrow) return;
      const at = ordered.findIndex((i) => i.id === sel);
      if (e.key === 'j' || e.key === 'k') { const n = ordered[at + (e.key === 'j' ? 1 : -1)]; if (n) { setSel(n.id); focusAfter.current = n.id; } }
      else if (e.key === 'e' && sel && status[sel] === 'open') triage(sel, 'done', true);
      else if (e.key === 'l' && sel && status[sel] === 'open') triage(sel, 'later', true);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  });

  const selItem = ITEMS.find((i) => i.id === sel) ?? null;
  const currentConv = CONVS.find((c) => c.id === view);
  const currentView = VIEWS.find((v) => v.id === view);
  const title = currentConv ? convTitle(currentConv) : currentView!.label;
  const kicker = currentConv ? (currentConv.members ? `${currentConv.members} members. ${currentConv.topic}` : currentConv.topic) : currentView!.kicker;
  const pick = (v: string) => { setView(v); };

  const Row = ({ i, done }: { i: Item; done?: boolean }) => {
    const c = conv(i.conv);
    const msgs = msgsOf(i);
    const lead = i.root ? (i.bucket === 'needs' ? msgs[0] : msgs[msgs.length - 1]) : msgs[msgs.length - 1];
    if (!lead) return null;
    const unread = unreadOf(i);
    const hasDraft = !!drafts[i.id]?.trim();
    const current = sel === i.id && (!narrow || sheet);
    const digest = i.bucket === 'catchup';
    const names = [...new Set(msgs.filter((m) => m.isNew).map((m) => first(m.who)))];
    const channelLabel = c.kind === 'channel' ? `# ${c.name}` : 'Direct message';
    return (
      <li key={i.id} className={`xch02-row${current ? ' is-current' : ''}${unread ? ' is-unread' : ''}${digest ? ' is-digest' : ''}`}>
        <button id={`row-${i.id}`} type="button" className="xch02-row__open" aria-current={current ? 'true' : undefined} onClick={() => openItem(i.id)}>
          {!digest && <Avatar name={lead.who} size="s" />}
          <span className="xch02-row__text">
            <span className="xch02-row__top">
              {digest
                ? <span className="xch02-row__who"># {c.name}</span>
                : <><span className="xch02-row__who">{lead.who}</span><span className="xch02-row__where">{channelLabel}</span></>}
              <time className="xch02-row__time">{latest(i) >= 1440 ? 'Yesterday' : msgs.reduce((a, m) => (age(m) < age(a) ? m : a)).time}</time>
              {unread > 0 && <span className="xch02-row__unread">{unread}<span className="ds-sr-only"> unread</span></span>}
            </span>
            <span className="xch02-row__snippet">{digest ? <>{names.length ? `${names.join(', ')}: ` : ''}{rich(lead.text)}</> : rich(lead.text)}</span>
            {!digest && (
              <span className="xch02-row__why">
                <Tag>{i.reason}</Tag>
                {i.blocking && <span>Someone is blocked on this</span>}
                {i.bucket === 'needs' && !done && <span>Waiting {ago(waited(i))}</span>}
                {i.root && msgs.length > 1 && <span>{msgs.length - 1} {msgs.length === 2 ? 'reply' : 'replies'}</span>}
                {hasDraft && <span className="xch02-row__draft">Draft</span>}
              </span>
            )}
          </span>
        </button>
        <div className="xch02-row__act">
          {done || status[i.id] !== 'open'
            ? <Button variant="ghost" size="sm" aria-label={`Back to inbox: ${convTitle(c)}`} onClick={() => triage(i.id, 'open')}>Undo</Button>
            : <><Button variant="ghost" size="sm" aria-label={`Done: ${convTitle(c)}`} onClick={() => triage(i.id, 'done', true)}>Done</Button>
              {!digest && <Button variant="ghost" size="sm" aria-label={`Later: ${convTitle(c)}`} onClick={() => triage(i.id, 'later', true)}>Later</Button>}</>}
        </div>
      </li>
    );
  };
  const Section = ({ kicker: k, name, rows, end }: { kicker: string; name: string; rows: Item[]; end?: ReactNode }) => rows.length === 0 ? null : (
    <section className="xch02-sec" aria-label={name}>
      <header className="xch02-sec__head">
        <div><p className="ds-kicker">{k}</p><h2 className="ds-h4">{name} <span className="xch02-sec__n">{rows.length}</span></h2></div>
        {end}
      </header>
      <ul className="xch02-rows">{rows.map((i) => Row({ i }))}</ul>
    </section>
  );

  const nothing = shown.length === 0;
  const needsEmptyHere = view === 'everything' && !q && order === 'need' && needRows.length === 0 && !nothing;
  const moonShowing = nothing || needsEmptyHere;

  const sidebar = (
    <Rail label="Inbox and channels"
      header={<><p className="xch02-brand">Harbour Studio</p><p className="ds-caption">Kaiwa, team chat</p></>}
      footer={<div className="xch02-me"><Avatar name={ME} size="s" gold presence="on" /><span><strong>{ME}</strong><span className="ds-caption">Active, quiet after 18:00</span></span></div>}>
      <RailSection title="Inbox">
        {VIEWS.map((v) => {
          const n = v.id === 'everything' ? unreadWhere(() => true)
            : v.id === 'needs' ? unreadWhere((i) => i.bucket === 'needs')
            : v.id === 'mentions' ? unreadWhere((i) => !!i.mention)
            : v.id === 'threads' ? unreadWhere((i) => i.bucket === 'following')
            : v.id === 'drafts' ? ITEMS.filter((i) => inView(i, 'drafts')).length
            : ITEMS.filter((i) => status[i.id] === 'later').length;
          const quiet = v.id === 'drafts' || v.id === 'later';
          return <RailItem key={v.id} label={v.label} current={view === v.id} unread={!quiet && n > 0} count={n} onClick={() => pick(v.id)} />;
        })}
      </RailSection>
      <RailSection title="Channels">
        {CONVS.filter((c) => c.kind === 'channel').map((c) => { const n = unreadWhere((i) => i.conv === c.id); return <RailItem key={c.id} lead="#" label={c.name} current={view === c.id} unread={n > 0} count={n} onClick={() => pick(c.id)} />; })}
      </RailSection>
      <RailSection title="Direct messages">
        {CONVS.filter((c) => c.kind === 'dm').map((c) => { const n = unreadWhere((i) => i.conv === c.id); return <RailItem key={c.id} lead={c.online ? 'presence-on' : 'presence-off'} label={c.name} current={view === c.id} unread={n > 0} count={n} onClick={() => pick(c.id)} />; })}
      </RailSection>
    </Rail>
  );

  return (
    <div className="xch02-root">
      <AppShell
        switcher={WORKSPACES.map((w, i) => (
          <button key={w.id} type="button" className={`xch02-ws${i === 0 ? ' is-current' : ''}`} aria-label={`Workspace: ${w.name}`} aria-current={i === 0 ? 'true' : undefined}
            onClick={() => { if (i > 0) setToast({ text: `Nothing waiting in ${w.name}` }); }}>
            <Avatar name={w.name} size="s" />
          </button>
        ))}
        sidebar={sidebar}
        header={<>
          <div className="xch02-title"><p className="ds-kicker">{kicker}</p><h1 className="ds-h4">{title}</h1></div>
          <span className="ds-spacer" />
          <Input className="xch02-search" compact label="Search the inbox" hideLabel placeholder="Search the inbox" value={query} onChange={(e) => setQuery(e.target.value)} />
          <Button variant="secondary" size="sm" onClick={() => setComposing(true)}>New message</Button>
        </>}
        aside={narrow ? undefined : (selItem
          ? <Conversation key={selItem.id} item={selItem} store={store} onTriage={(id, s) => triage(id, s)} />
          : <p className="ds-caption xch02-pick">Pick something from the inbox and it opens here.</p>)}
      >
        <div className="xch02-inbox">
          <Toolbar className="xch02-summary" label="Triage summary"
            end={<Segmented label="Order" value={order} onChange={setOrder} options={[{ value: 'need', label: 'By need' }, { value: 'time', label: 'By time' }]} />}>
            {!moonShowing && <Ring size={48} value={cleared} max={ITEMS.length} label="Cleared today"><span className="xch02-ringnum">{cleared}</span></Ring>}
            <p className="xch02-tally"><strong>{openNeeds} {openNeeds === 1 ? 'needs' : 'need'} you.</strong> {openThreads} {openThreads === 1 ? 'thread' : 'threads'} moved, {openCatch} {openCatch === 1 ? 'channel' : 'channels'} to catch up. {cleared} of {ITEMS.length} cleared today.</p>
          </Toolbar>

          {nothing && (q
            ? <EmptyState title={`Nothing matches “${query.trim()}”`} body="Search looks through every channel in this view." action={<Button variant="secondary" size="sm" onClick={() => setQuery('')}>Clear search</Button>} />
            : <EmptyState title={view === 'drafts' ? 'No drafts' : view === 'later' ? 'Nothing set aside' : `Nothing waiting in ${title}`} body="Anything you are asked will land in Needs you." action={<Button variant="secondary" size="sm" onClick={() => pick('everything')}>Back to Everything</Button>} />)}

          {needsEmptyHere && <EmptyState title="Nothing needs you" body="Go and look at the moon. Anyone who asks will land here." />}

          {!nothing && order === 'need' && <>
            {Section({ kicker: 'Reply or decide', name: 'Needs you', rows: needRows })}
            {Section({ kicker: 'You are in these', name: 'Threads that moved', rows: followRows })}
            {Section({ kicker: 'No one is waiting', name: 'Catch up when you can', rows: catchRows, end: <Button variant="ghost" size="sm" onClick={markCaughtUp}>Mark all done</Button> })}
          </>}
          {!nothing && order === 'time' && Section({ kicker: 'Latest first', name: 'By time', rows: timeRows })}

          {doneRows.length > 0 && order === 'need' && (
            <section className="xch02-sec xch02-done" aria-label="Done today">
              <button type="button" className="xch02-done__toggle" aria-expanded={showDone} onClick={() => setShowDone(!showDone)}>
                <span className="ds-label">Done today</span><span className="xch02-sec__n">{doneRows.length}</span><span aria-hidden="true">{showDone ? '−' : '+'}</span>
              </button>
              {showDone && <ul className="xch02-rows">{doneRows.map((i) => Row({ i, done: true }))}</ul>}
            </section>
          )}
          <p className="ds-caption xch02-keys">Keys: J and K move, E done, L later</p>
        </div>
      </AppShell>

      {narrow && selItem && (
        <Modal open={sheet} onClose={closeSheet} variant="sheet" title={convTitle(conv(selItem.conv))}>
          <Conversation key={selItem.id} item={selItem} store={store} compactHead onTriage={(id, s) => triage(id, s)} />
        </Modal>
      )}

      <Modal open={composing} onClose={closeComposing} title="New message"
        actions={<><Button variant="ghost" onClick={closeComposing}>Cancel</Button><Button variant="primary" disabled={!body.trim() || !to.trim()} onClick={sendNew}>Send</Button></>}>
        <Input compact label="To" placeholder="A channel or a person" list="xch02-to" value={to} error={toErr} onChange={(e) => { setTo(e.target.value); setToErr(undefined); }} />
        <datalist id="xch02-to">{CONVS.map((c) => <option key={c.id} value={c.kind === 'channel' ? `# ${c.name}` : c.name} />)}</datalist>
        <Input compact multiline rows={4} label="Message" value={body} onChange={(e) => setBody(e.target.value)} />
      </Modal>

      {toast && <Toast onDone={clearToast} action={toast.undo && <Button variant="ghost" size="sm" onClick={toast.undo}>Undo</Button>}>{toast.text}</Toast>}
    </div>
  );
}
createRoot(document.getElementById('root')!).render(<Inbox />);
