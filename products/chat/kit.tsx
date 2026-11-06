// Shared pieces for chat layouts: message text, a composer, a rail and the width check.
import { useEffect, useRef, useState } from 'react';
import type { ReactNode, RefObject } from 'react';
import { Button, Input, Tag, Toolbar, Mention, Message, Card, Rail, RailSection, RailItem, Avatar } from '../../design-system/components';
import { CONVS, ME, NOW } from './x-parity-channel/data';
import type { Conv, File, Msg } from './x-parity-channel/data';
import './kit.css';

export { CONVS, ME, NOW };
export type { Conv, Msg, File };
export const first = (w: string) => w.split(' ')[0];
export const conv = (id: string) => CONVS.find((c) => c.id === id)!;
export const title = (c: Conv) => (c.kind === 'channel' ? `# ${c.name}` : c.name);
export const allMsgs = (c: Conv) => c.messages.flatMap((m) => [m, ...(m.replies ?? [])]);
export const newCount = (c: Conv) => allMsgs(c).filter((m) => m.isNew).length;
export const mine = (text: string, file?: File): Msg => ({ id: `s${Date.now()}`, who: ME, time: NOW, text: text || 'Shared a file.', file });
export function rich(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|_[^_\s][^_]*_|`[^`]+`|@[A-Z][a-z]+)/g).filter(Boolean).map((p, i) => {
    if (p.startsWith('**')) return <strong key={i}>{p.slice(2, -2)}</strong>;
    if (p.startsWith('`')) return <code key={i}>{p.slice(1, -1)}</code>;
    if (p.startsWith('_') && p.endsWith('_') && p.length > 2) return <em key={i}>{p.slice(1, -1)}</em>;
    if (p.startsWith('@')) return <Mention key={i} me={p.slice(1) === first(ME)}>{p.slice(1)}</Mention>;
    return <span key={i}>{p}</span>;
  });
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

/** Bold, Italic, Code and Attach for any reply box. Wraps the selection in the box inside `box`. */
export function FormatBar({ box, value, onChange, onFile }: { box: RefObject<HTMLElement | null>; value: string; onChange: (v: string) => void; onFile: (f: File) => void }) {
  const picker = useRef<HTMLInputElement>(null);
  const wrap = (mark: string) => {
    const el = box.current?.querySelector('textarea');
    if (!el) return;
    const { selectionStart: a, selectionEnd: b } = el;
    const inner = value.slice(a, b) || 'text';
    onChange(value.slice(0, a) + mark + inner + mark + value.slice(b));
    requestAnimationFrame(() => { el.focus(); el.setSelectionRange(a + mark.length, a + mark.length + inner.length); });
  };
  return (
    <Toolbar label="Formatting">
      <Button variant="ghost" size="sm" aria-label="Bold" onClick={() => wrap('**')}><strong>B</strong></Button>
      <Button variant="ghost" size="sm" aria-label="Italic" onClick={() => wrap('_')}><em>I</em></Button>
      <Button variant="ghost" size="sm" aria-label="Code" onClick={() => wrap('`')}>Code</Button>
      <Button variant="ghost" size="sm" onClick={() => picker.current?.click()}>Attach</Button>
      <input ref={picker} type="file" hidden aria-label="Attach a file" onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile({ name: f.name, meta: `${Math.max(1, Math.round(f.size / 1024))} KB, attached just now` }); e.target.value = ''; }} />
    </Toolbar>
  );
}
export function Composer({ placeholder, onSend, primary = true }: { placeholder: string; onSend: (text: string, file?: File) => void; primary?: boolean }) {
  const [value, setValue] = useState('');
  const [file, setFile] = useState<File | undefined>();
  const box = useRef<HTMLDivElement>(null);
  const can = !!value.trim() || !!file;
  const send = () => { if (can) { onSend(value.trim(), file); setValue(''); setFile(undefined); } };
  return (
    <form className="xck-composer" onSubmit={(e) => { e.preventDefault(); send(); }}>
      <div ref={box}><Input compact multiline rows={2} label={placeholder} hideLabel placeholder={placeholder} value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }} /></div>
      {file && <div><Tag onClick={() => setFile(undefined)}>{`${file.name} ×`}</Tag></div>}
      <div className="xck-composer__foot">
        <FormatBar box={box} value={value} onChange={setValue} onFile={setFile} />
        <Button variant={primary ? 'primary' : 'secondary'} size="sm" type="submit" disabled={!can}>Send</Button>
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
export function Talk({ list, reactable, threadFor }: { list: Msg[]; reactable?: boolean; threadFor?: (m: Msg) => { count: number; last?: string; onOpen?: () => void } | undefined }) {
  const [on, setOn] = useState<Record<string, boolean>>({});
  return <>{list.map((m, i) => (
    <Message key={m.id} who={m.who} time={m.time} mine={m.who === ME} grouped={list[i - 1]?.who === m.who && !m.file}
      reactions={reactable === false ? undefined : (m.reactions ?? []).map((r) => ({ ...r, mine: !!on[m.id + r.label], count: r.count + (on[m.id + r.label] ? 1 : 0) }))}
      thread={threadFor?.(m)}
      onReact={(l) => setOn((x) => ({ ...x, [m.id + l]: !x[m.id + l] }))}
      attachments={m.file && <Card variant="compact" title={m.file.name} note={m.file.meta} />}>{rich(m.text)}</Message>
  ))}</>;
}
