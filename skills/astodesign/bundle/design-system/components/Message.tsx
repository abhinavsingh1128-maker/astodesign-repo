import type { ReactNode } from 'react';
import { Avatar } from './Avatar';
import { cx } from './util';

export type MessageProps = {
  who: string;
  time: string;
  /** Same author within a few minutes: no avatar or name. */
  grouped?: boolean;
  mine?: boolean;
  reactions?: Array<{ label: string; count: number; mine?: boolean }>;
  onReact?: (label: string) => void;
  /** Thread summary, e.g. { count: 4, last: '2m ago', onOpen } */
  thread?: { count: number; last?: string; onOpen?: () => void };
  /** Hover/focus actions (reply, react, more). Ghost buttons. */
  actions?: ReactNode;
  attachments?: ReactNode;
  children: ReactNode;
};
/** A message in a stream: serif name, sans body, no bubbles. */
export function Message({ who, time, grouped, mine, reactions, onReact, thread, actions, attachments, children }: MessageProps) {
  return (
    <article className={cx('ds-msg', grouped && 'ds-msg--grouped', mine && 'ds-msg--mine')} aria-label={`${who}, ${time}`}>
      <div className="ds-msg__lead">{grouped ? <span className="ds-msg__time-hover">{time}</span> : <Avatar name={who} size="m" />}</div>
      <div className="ds-msg__main">
        {!grouped && <header className="ds-msg__head"><span className="ds-msg__who">{who}</span><time className="ds-msg__time">{time}</time></header>}
        <div className="ds-msg__body">{children}</div>
        {attachments && <div className="ds-msg__attachments">{attachments}</div>}
        {reactions && reactions.length > 0 && (
          <div className="ds-msg__reactions">
            {reactions.map((r) => (
              <button key={r.label} type="button" className="ds-reaction" aria-pressed={!!r.mine} onClick={() => onReact?.(r.label)}>{r.label}<span>{r.count}</span></button>
            ))}
          </div>
        )}
        {thread && (
          <button type="button" className="ds-msg__thread" onClick={thread.onOpen}>
            {thread.count} {thread.count === 1 ? 'reply' : 'replies'}{thread.last && <span className="ds-muted"> · last {thread.last}</span>}
          </button>
        )}
      </div>
      {actions && <div className="ds-msg__actions">{actions}</div>}
    </article>
  );
}
export const Mention = ({ children, me }: { children: ReactNode; me?: boolean }) => <span className={cx('ds-mention', me && 'ds-mention--me')}>@{children}</span>;
/** A day break or "New" marker in a stream. */
export const StreamDivider = ({ children, tone }: { children: ReactNode; tone?: 'new' }) => <div className={cx('ds-divider ds-stream-divider', tone === 'new' && 'ds-stream-divider--new')} role="separator">{children}</div>;
