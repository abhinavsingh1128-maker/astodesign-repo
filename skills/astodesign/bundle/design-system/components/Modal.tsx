import { useEffect, useId, useRef } from 'react';
import type { ReactNode } from 'react';
import { cx } from './util';

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  /** Buttons. A modal may have one primary, or ghost buttons only. */
  actions?: ReactNode;
  variant?: 'dialog' | 'wide' | 'sheet' | 'sheet-left';
  children?: ReactNode;
};
export function Modal({ open, onClose, title, actions, variant = 'dialog', children }: ModalProps) {
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  // Held in a ref so an inline onClose never re-runs the focus effect while someone types.
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { closeRef.current(); return; }
      if (e.key !== 'Tab' || !ref.current) return;
      // Keep Tab inside the dialog.
      const items = [...ref.current.querySelectorAll<HTMLElement>('button:not(:disabled), [href], input:not([hidden]), select, textarea, [tabindex]:not([tabindex="-1"])')];
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1], cur = document.activeElement;
      if (e.shiftKey && (cur === first || cur === ref.current)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && cur === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    const first = ref.current?.querySelector<HTMLElement>('input, textarea, select, button, [href]');
    (first ?? ref.current)?.focus();
    return () => { document.removeEventListener('keydown', onKey); prev?.focus?.(); };
  }, [open]);
  if (!open) return null;
  const sheet = variant === 'sheet' || variant === 'sheet-left';
  return (
    <div className={cx('ds-overlay', sheet && 'ds-overlay--sheet', variant === 'sheet-left' && 'ds-overlay--left')} onMouseDown={(e) => { if (e.target === e.currentTarget) closeRef.current(); }}>
      <div ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby={id} data-surface="paper" className={cx(sheet ? 'ds-sheet' : 'ds-modal', variant === 'wide' && 'ds-modal--wide')}>
        <div className="ds-modal__head">
          <h2 id={id} className="ds-modal__title">{title}</h2>
          <button type="button" className="ds-btn ds-btn--ghost ds-btn--sm" onClick={onClose} aria-label="Close">Close</button>
        </div>
        {children}
        {actions && <div className="ds-modal__actions">{actions}</div>}
      </div>
    </div>
  );
}
