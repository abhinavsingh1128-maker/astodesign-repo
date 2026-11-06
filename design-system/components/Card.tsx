import type { ReactNode } from 'react';
import { cx } from './util';

export type CardProps = {
  title?: ReactNode;
  /** Cover: an image URL, or a pigment colour with a serif mark. */
  cover?: { src?: string; color?: string; mark?: string };
  tags?: string[];
  note?: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'project' | 'plain' | 'compact';
  className?: string;
  children?: ReactNode;
};
/** Always Paper: cards are the washi pages of the portfolio. */
export function Card({ title, cover, tags, note, href, onClick, variant = 'project', className, children }: CardProps) {
  const interactive = !!(href || onClick);
  const body = (
    <>
      {cover && (
        <div className="ds-card__cover ds-grain" style={{ ['--cover' as string]: cover.color }}>
          {cover.src ? <img src={cover.src} alt="" /> : cover.mark && <span className="ds-card__mark" aria-hidden="true">{cover.mark}</span>}
        </div>
      )}
      <div className="ds-card__body">
        {tags && tags.length > 0 && <div className="ds-card__tags">{tags.map((t) => <span key={t} className="ds-tag">{t}</span>)}</div>}
        {title && <h3 className="ds-card__title">{title}</h3>}
        {children}
        {note && <div className="ds-card__note">{note}</div>}
      </div>
    </>
  );
  const cls = cx('ds-card', variant !== 'project' && `ds-card--${variant}`, interactive && 'ds-card--interactive', className);
  if (href) return <a className={cls} href={href} data-surface="paper">{body}</a>;
  if (onClick) return <button type="button" className={cls} onClick={onClick} data-surface="paper" style={{ border: 0, padding: 0, textAlign: 'left', font: 'inherit' }}>{body}</button>;
  return <article className={cls} data-surface="paper">{body}</article>;
}
