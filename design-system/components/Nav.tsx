import { useState } from 'react';
import type { ReactNode } from 'react';
import { cx } from './util';

export type NavItem = { label: string; href?: string; onClick?: () => void; current?: boolean };
export type NavProps = {
  brand?: ReactNode;
  brandHref?: string;
  /** Show the flower mark beside the brand. */
  mark?: boolean;
  items?: NavItem[];
  end?: ReactNode;
  /** "pill" floats over the scene; "bar" is an app header on the surface. */
  layout?: 'pill' | 'bar';
  label?: string;
  className?: string;
};
export function Nav({ brand = 'Abhinav', brandHref = '#', mark = true, items = [], end, layout = 'pill', label = 'Main', className }: NavProps) {
  const [open, setOpen] = useState(false);
  return (
    <nav className={cx('ds-nav', layout === 'bar' && 'ds-nav--bar', className)} aria-label={label} data-open={open}>
      <a className="ds-nav__brand" href={brandHref}>
        {mark && <span className="ds-nav__mark" aria-hidden="true" />}
        {brand}
      </a>
      {items.length > 0 && (
        <>
          <button type="button" className="ds-btn ds-btn--ghost ds-btn--sm ds-nav__toggle" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? 'Close' : 'Menu'}</button>
          <ul className="ds-nav__links">
            {items.map((it) => (
              <li key={it.label}>
                {it.href
                  ? <a className="ds-nav__link" href={it.href} aria-current={it.current ? 'page' : undefined}>{it.label}</a>
                  : <button type="button" className="ds-nav__link" aria-current={it.current ? 'page' : undefined} onClick={() => { it.onClick?.(); setOpen(false); }}>{it.label}</button>}
              </li>
            ))}
          </ul>
        </>
      )}
      {end && <div className="ds-nav__end">{end}</div>}
    </nav>
  );
}
