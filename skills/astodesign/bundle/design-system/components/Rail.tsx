import type { ReactNode } from 'react';
import { Avatar } from './Avatar';
import { cx } from './util';

export function Rail({ label, header, footer, children }: { label: string; header?: ReactNode; footer?: ReactNode; children: ReactNode }) {
  return (
    <nav className="ds-rail" aria-label={label}>
      {header && <div className="ds-rail__header">{header}</div>}
      <div className="ds-rail__body">{children}</div>
      {footer && <div className="ds-rail__footer">{footer}</div>}
    </nav>
  );
}
export function RailSection({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="ds-rail__section">
      <div className="ds-rail__section-head"><h2 className="ds-rail__title">{title}</h2>{action}</div>
      <ul className="ds-rail__list">{children}</ul>
    </section>
  );
}
export type RailItemProps = {
  /** '#' for a channel, a name for an avatar, or presence for a person. */
  lead?: '#' | 'presence-on' | 'presence-off' | { avatar: string; presence?: 'on' | 'off' } | ReactNode;
  label: string;
  /** Where you are: gold inset bar. */
  current?: boolean;
  /** Unread: bold label and a sakura count. */
  unread?: boolean;
  count?: number;
  onClick?: () => void;
  href?: string;
};
export function RailItem({ lead, label, current, unread, count, onClick, href }: RailItemProps) {
  let leadEl: ReactNode = null;
  if (lead === '#') leadEl = <span className="ds-rail__hash" aria-hidden="true">#</span>;
  else if (lead === 'presence-on' || lead === 'presence-off') leadEl = <span className={cx('ds-rail__dot', lead === 'presence-on' && 'ds-rail__dot--on')} aria-hidden="true" />;
  else if (lead && typeof lead === 'object' && 'avatar' in (lead as object)) { const l = lead as { avatar: string; presence?: 'on' | 'off' }; leadEl = <Avatar name={l.avatar} size="s" presence={l.presence} />; }
  else leadEl = lead as ReactNode;
  const inner = (
    <>
      {leadEl}
      <span className="ds-rail__label">{label}</span>
      {count != null && count > 0 && <span className={cx('ds-rail__count', unread && 'ds-rail__count--unread')}>{count}<span className="ds-sr-only">{unread ? ' unread' : ''}</span></span>}
    </>
  );
  const cls = cx('ds-rail__item', current && 'is-current', unread && 'is-unread');
  return (
    <li>
      {href ? <a className={cls} href={href} aria-current={current ? 'page' : undefined}>{inner}</a>
        : <button type="button" className={cls} aria-current={current ? 'page' : undefined} onClick={onClick}>{inner}</button>}
    </li>
  );
}
