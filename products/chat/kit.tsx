// Shared pieces for chat layouts: message text, a composer, a rail and the width check.
import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Button, Input, Toolbar, Mention, Message, Card, Rail, RailSection, RailItem, Avatar } from '../../design-system/components';
import { CONVS, ME, NOW } from './00-parity-channel/data';
import type { Conv, Msg } from './00-parity-channel/data';
import './kit.css';

export { CONVS, ME, NOW };
export type { Conv, Msg };
export const first = (w: string) => w.split(' ')[0];
export const conv = (id: string) => CONVS.find((c) => c.id === id)!;
export const title = (c: Conv) => (c.kind === 'channel' ? `# ${c.name}` : c.name);
export const allMsgs = (c: Conv) => c.messages.flatMap((m) => [m, ...(m.replies ?? [])]);
export const newCount = (c: Conv) => allMsgs(c).filter((m) => m.isNew).length;
export const mine = (text: string): Msg => ({ id: `s${Date.now()}`, who: ME, time: NOW, text });
export function rich(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|@[A-Z][a-z]+)/g).filter(Boolean).map((p, i) => (p.startsWith('**') ? <strong key={i}>{p.slice(2, -2)}</strong> : p.startsWith('@') ? <Mention key={i} me={p.slice(1) === first(ME)}>{p.slice(1)}</Mention> : <span key={i}>{p}</span>));
}
export const useNarrow = () => {
  const q = '(max-width: 1100px)';
  const [n, set] = useState(() => matchMedia(q).matches);
  useEffect(() => { const m = matchMedia(q); const on = () => set(m.matches); m.addEventListener('change', on); return () => m.removeEventListener('change', on); }, []);
  return n;
};
/** Modals trap Tab: the system Modal moves focus in but does not hold it. */
export const useTabTrap = () => useEffect(() => {
  const on = (e: KeyboardEvent) => {
    const d = document.querySelector<HTMLElement>('.ds-modal, .ds-sheet');
    if (!d || e.key !== 'Tab') return;
    const f = [...d.querySelectorAll<HTMLElement>('button:not(:disabled), [href], input, textarea')];
    if (!f.length) return;
    const a = f[0], z = f[f.length - 1], c = document.activeElement;
    if (e.shiftKey && (c === a || c === d)) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && c === z) { e.preventDefault(); a.focus(); }
  };
  document.addEventListener('keydown', on);
  return () => document.removeEventListener('keydown', on);
}, []);

export function Composer({ placeholder, onSend, primary = true }: { placeholder: string; onSend: (text: string) => void; primary?: boolean }) {
  const [value, setValue] = useState('');
  const box = useRef<HTMLDivElement>(null);
  const send = () => { if (value.trim()) { onSend(value.trim()); setValue(''); } };
  const bold = () => {
    const el = box.current?.querySelector('textarea');
    if (!el) return;
    const { selectionStart: a, selectionEnd: b } = el;
    setValue(`${value.slice(0, a)}**${value.slice(a, b) || 'text'}**${value.slice(b)}`);
    el.focus();
  };
  return (
    <form className="xck-composer" onSubmit={(e) => { e.preventDefault(); send(); }}>
      <div ref={box}><Input compact multiline rows={2} label={placeholder} hideLabel placeholder={placeholder} value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }} /></div>
      <div className="xck-composer__foot">
        <Toolbar label="Formatting"><Button variant="ghost" size="sm" aria-label="Bold" onClick={bold}><strong>B</strong></Button></Toolbar>
        <Button variant={primary ? 'primary' : 'secondary'} size="sm" type="submit" disabled={!value.trim()}>Send</Button>
      </div>
    </form>
  );
}
export function ChatRail({ current, onPick, counts, top }: { current?: string; onPick: (id: string) => void; counts?: (c: Conv) => number; top?: ReactNode }) {
  const n = counts ?? newCount;
  return (
    <Rail label="Channels and people" header={<><p className="xck-brand">Harbour Studio</p><p className="ds-caption">Kaiwa, team chat</p></>}
      footer={<div className="xck-me"><Avatar name={ME} size="s" gold presence="on" /><span className="ds-caption">{ME}</span></div>}>
      {top}
      <RailSection title="Channels">{CONVS.filter((c) => c.kind === 'channel').map((c) => <RailItem key={c.id} lead="#" label={c.name} current={current === c.id} unread={n(c) > 0} count={n(c)} onClick={() => onPick(c.id)} />)}</RailSection>
      <RailSection title="Direct messages">{CONVS.filter((c) => c.kind === 'dm').map((c) => <RailItem key={c.id} lead={c.online ? 'presence-on' : 'presence-off'} label={c.name} current={current === c.id} unread={n(c) > 0} count={n(c)} onClick={() => onPick(c.id)} />)}</RailSection>
    </Rail>
  );
}
export function Talk({ list, reactable }: { list: Msg[]; reactable?: boolean }) {
  const [on, setOn] = useState<Record<string, boolean>>({});
  return <>{list.map((m, i) => (
    <Message key={m.id} who={m.who} time={m.time} mine={m.who === ME} grouped={list[i - 1]?.who === m.who && !m.file}
      reactions={reactable === false ? undefined : (m.reactions ?? []).map((r) => ({ ...r, mine: !!on[m.id + r.label], count: r.count + (on[m.id + r.label] ? 1 : 0) }))}
      onReact={(l) => setOn((x) => ({ ...x, [m.id + l]: !x[m.id + l] }))}
      attachments={m.file && <Card variant="compact" title={m.file.name} note={m.file.meta} />}>{rich(m.text)}</Message>
  ))}</>;
}
