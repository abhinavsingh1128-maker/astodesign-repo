import type { ReactNode } from 'react';
import { cx } from './util';

export type BannerProps = { title?: ReactNode; tone?: 'note' | 'info' | 'success' | 'error'; action?: ReactNode; onDismiss?: () => void; children?: ReactNode };
/** An inline notice. "note" is a Paper slip with a lacquer rule. Errors are announced. */
export function Banner({ title, tone = 'note', action, onDismiss, children }: BannerProps) {
  return (
    <div className={cx('ds-banner', `ds-banner--${tone}`)} role={tone === 'error' ? 'alert' : 'status'} data-surface={tone === 'note' ? 'paper' : undefined}>
      <div className="ds-banner__body">
        {title && <p className="ds-banner__title">{title}</p>}
        {children && <div className="ds-banner__text">{children}</div>}
      </div>
      {action}
      {onDismiss && <button type="button" className="ds-btn ds-btn--ghost ds-btn--sm" onClick={onDismiss} aria-label="Dismiss">Dismiss</button>}
    </div>
  );
}
