import type { ReactNode } from 'react';
import { cx } from './util';

export function List({ compact, label, className, children }: { compact?: boolean; label?: string; className?: string; children: ReactNode }) {
  return <ul className={cx('ds-list', compact && 'ds-list--compact', className)} aria-label={label}>{children}</ul>;
}
export function ListSection({ title, children }: { title: string; children: ReactNode }) {
  return <li><div className="ds-list__section">{title}</div><ul className="ds-list">{children}</ul></li>;
}
export type ListItemProps = {
  lead?: ReactNode;
  title: ReactNode;
  meta?: ReactNode;
  end?: ReactNode;
  selected?: boolean;
  onClick?: () => void;
  href?: string;
};
export function ListItem({ lead, title, meta, end, selected, onClick, href }: ListItemProps) {
  const inner = (
    <>
      {lead}
      <span className="ds-list-item__main">
        <span className="ds-list-item__title">{title}</span>
        {meta && <span className="ds-list-item__meta">{meta}</span>}
      </span>
      {end && <span className="ds-list-item__end">{end}</span>}
    </>
  );
  return (
    <li>
      {href ? <a className="ds-list-item" href={href} aria-current={selected ? 'true' : undefined}>{inner}</a>
        : onClick ? <button type="button" className="ds-list-item" aria-current={selected ? 'true' : undefined} onClick={onClick}>{inner}</button>
        : <div className="ds-list-item" aria-selected={selected || undefined}>{inner}</div>}
    </li>
  );
}
