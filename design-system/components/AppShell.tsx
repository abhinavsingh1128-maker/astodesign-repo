import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { cx } from './util';

export type AppShellProps = {
  /** Narrow far-left strip (workspaces, sections). Optional. */
  switcher?: ReactNode;
  /** The Rail. Becomes a slide-in sheet under 760px with a MENU button. */
  sidebar?: ReactNode;
  header?: ReactNode;
  /** Right column (details, thread, profile). Hidden under 1100px. */
  aside?: ReactNode;
  /** Main column tone. Paper for streams and reading, Night for dashboards. */
  mainTone?: 'paper' | 'night';
  menuLabel?: string;
  children: ReactNode;
};
/** App frame: Night shell (switcher, rail) around a Paper main. */
export function AppShell({ switcher, sidebar, header, aside, mainTone = 'paper', menuLabel = 'Menu', children }: AppShellProps) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);
  return (
    <div className={cx('ds-app ds-washi', switcher && 'ds-app--switcher', aside && 'ds-app--aside')} data-surface="night">
      {switcher && <div className="ds-app__switcher ds-washi-night">{switcher}</div>}
      {sidebar && (
        <div className="ds-app__sidebar ds-washi-night" data-open={open} onClick={(e) => { if ((e.target as HTMLElement).closest('button, a')) setOpen(false); }}>
          {sidebar}
        </div>
      )}
      {open && <div className="ds-app__scrim" onClick={() => setOpen(false)} aria-hidden="true" />}
      <div className="ds-app__main ds-washi" data-surface={mainTone}>
        {(header || sidebar) && (
          <div className="ds-app__header">
            {sidebar && <button type="button" className="ds-btn ds-btn--ghost ds-btn--sm ds-app__menu" aria-expanded={open} onClick={() => setOpen(!open)}>{menuLabel}</button>}
            {header}
          </div>
        )}
        <main className="ds-app__content">{children}</main>
      </div>
      {aside && <aside className="ds-app__aside ds-washi" data-surface="paper">{aside}</aside>}
    </div>
  );
}
