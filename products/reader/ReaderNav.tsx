// The full top bar for reader layouts: section links, two menus, search, four inboxes and a profile menu.
import { useEffect, useRef, useState } from 'react';
import type { MouseEvent as ClickEvent, ReactNode } from 'react';
import { Nav, Input, Avatar, Toast } from '../../design-system/components';
import './ReaderNav.css';

const MENUS: Record<string, string[]> = {
  Browse: ['Recommendations', 'New releases', 'Genres', 'Lists', 'Reading challenges', 'Explore'],
  Community: ['Groups', 'Discussions', 'Quotes', 'Ask an author', 'People'],
  Profile: ['Profile', 'Friends', 'Groups', 'Comments', 'Account settings', 'Help', 'Sign out'],
};
type Note = { who: string; text: string; when: string };
const INBOX: Array<{ id: string; label: string; icon: ReactNode; items: Note[] }> = [
  { id: 'Notifications', label: 'Notifications', icon: <path d="M6 16V10a6 6 0 0 1 12 0v6l2 2H4l2-2ZM10 21h4" />, items: [
    { who: 'Ritu Sharma', text: 'liked your review of Piranesi', when: '2h' },
    { who: 'Manav Jain', text: 'started following you', when: '5h' },
    { who: 'Book club', text: 'picked The Dispossessed for December', when: '1d' },
  ] },
  { id: 'Discussions', label: 'Discussions', icon: <path d="M4 5h16v10H9l-5 4V5ZM8 9h8M8 12h5" />, items: [
    { who: 'Slow Readers', text: 'Is Middlemarch worth a second read?', when: '3h' },
    { who: 'Le Guin Circle', text: 'Where to start with Earthsea', when: '1d' },
  ] },
  { id: 'Messages', label: 'Messages', icon: <path d="M3 6h18v12H3V6Zm0 1 9 6 9-6" />, items: [
    { who: 'Noor Haddad', text: 'Can I borrow your copy of Circe?', when: '4h' },
  ] },
  { id: 'Friends', label: 'Friends', icon: <path d="M9 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM2 20c1-4 4-6 7-6s6 2 7 6M16 5a3.5 3.5 0 0 1 0 7M18 14c2 .6 3.4 2.6 4 6" />, items: [
    { who: 'Ife Adeyemi', text: 'wants to be friends', when: '6h' },
    { who: 'Tomas Lindqvist', text: 'wants to be friends', when: '2d' },
  ] },
];

export function ReaderNav({ me, homeHref, booksHref, query, onQuery }: { me: string; homeHref: string; booksHref: string; query: string; onQuery: (q: string) => void }) {
  const [open, setOpen] = useState<string | null>(null);
  const [seen, setSeen] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState<string | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const clearToast = useRef(() => setToast(null)).current;
  const opener = useRef<HTMLElement | null>(null);
  const [x, setX] = useState(0);
  const [hash, setHash] = useState(() => location.hash);
  useEffect(() => { const on = () => setHash(location.hash); addEventListener('hashchange', on); return () => removeEventListener('hashchange', on); }, []);
  // Remember the clicked control: Safari does not focus buttons on click.
  const capture = (e: ClickEvent<HTMLDivElement>) => { const b = (e.target as HTMLElement).closest<HTMLElement>('.ds-nav button'); if (b && !b.classList.contains('ds-nav__toggle')) opener.current = b; };
  const toggle = (id: string) => {
    const w = MENUS[id] ? 260 : 360;
    const left = opener.current?.getBoundingClientRect().left ?? 0;
    setX(Math.max(16, Math.min(left, document.documentElement.clientWidth - w - 16)));
    setOpen((o) => (o === id ? null : id)); setSeen((s) => (INBOX.some((i) => i.id === id) ? { ...s, [id]: true } : s)); };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(null); opener.current?.focus(); } };
    const onDown = (e: MouseEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(null); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('mousedown', onDown); };
  }, [open]);

  const inbox = INBOX.find((i) => i.id === open);
  const menu = open && MENUS[open];
  const pick = (name: string) => { setOpen(null); setToast(`${name} is not built in this prototype`); };
  return (
    <div className="xrn" ref={root} onClickCapture={capture}>
      <Nav layout="bar" brand="Shiori" label="Main"
        items={[
          { label: 'Home', href: homeHref, current: !open && hash !== booksHref },
          { label: 'My Books', href: booksHref, current: !open && hash === booksHref },
          { label: 'Browse ▾', current: open === 'Browse', onClick: () => toggle('Browse') },
          { label: 'Community ▾', current: open === 'Community', onClick: () => toggle('Community') },
        ]}
        end={<>
          <Input className="xrn-search" compact label="Search books" hideLabel placeholder="Search books" value={query} onChange={(e) => onQuery(e.target.value)} />
          {INBOX.map((i) => (
            <button key={i.id} type="button" className="xrn-icon" aria-label={`${i.label}${!seen[i.id] ? `, ${i.items.length} new` : ''}`} aria-expanded={open === i.id} onClick={() => toggle(i.id)}>
              <svg viewBox="0 0 24 24" aria-hidden="true">{i.icon}</svg>
              {!seen[i.id] && <span className="xrn-count ds-grain" aria-hidden="true">{i.items.length}</span>}
            </button>
          ))}
          <button type="button" className="xrn-icon" aria-label="Profile menu" aria-expanded={open === 'Profile'} onClick={() => toggle('Profile')}><Avatar name={me} size="s" gold /></button>
        </>} />
      {open && (
        <div className={`xrn-panel ds-washi${menu ? ' is-menu' : ''}`} data-surface="paper" style={{ ['--xrn-x' as string]: `${x}px` }}>
          <p className="ds-kicker">{open}</p>
          {menu && <ul className="xrn-list">{menu.map((m) => <li key={m}><button type="button" className="xrn-row" onClick={() => pick(m)}>{m}</button></li>)}</ul>}
          {inbox && <ul className="xrn-list">{inbox.items.map((n) => (
            <li key={n.who + n.text}><button type="button" className="xrn-row xrn-row--note" onClick={() => pick(open)}><Avatar name={n.who} size="s" /><span><strong>{n.who}</strong> {n.text}</span><time>{n.when}</time></button></li>
          ))}</ul>}
        </div>
      )}
      {toast && <Toast onDone={clearToast}>{toast}</Toast>}
    </div>
  );
}
