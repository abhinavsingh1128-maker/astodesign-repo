import type { ReactNode } from 'react';
import { pigmentFor, PIGMENTS } from './pigments';
import type { Pigment } from './pigments';
import { cx } from './util';

export type CoverTileProps = {
  title: string;
  byline?: string;
  ratio?: '2:3' | '1:1' | '4:3';
  /** Defaults to a stable pigment from the title. */
  pigment?: Pigment;
  src?: string;
  badge?: ReactNode;
  /** Lacquer outline: picked / in a selection. */
  selected?: boolean;
  onClick?: () => void;
  size?: 's' | 'm' | 'l';
};
/** A book, album or project cover: grained pigment with the title set in serif. */
export function CoverTile({ title, byline, ratio = '2:3', pigment, src, badge, selected, onClick, size = 'm' }: CoverTileProps) {
  const bg = pigment ? PIGMENTS[pigment] : pigmentFor(title);
  const face = (
    <span className={cx('ds-cover ds-grain', `ds-cover--${ratio.replace(':', 'x')}`, `ds-cover--${size}`, selected && 'is-selected')} style={{ ['--pigment' as string]: bg }}>
      {src ? <img src={src} alt="" /> : (
        <span className="ds-cover__face" aria-hidden="true">
          <span className="ds-cover__title">{title}</span>
          {byline && <span className="ds-cover__byline">{byline}</span>}
        </span>
      )}
      {badge && <span className="ds-cover__badge">{badge}</span>}
    </span>
  );
  const label = byline ? `${title} by ${byline}` : title;
  if (onClick) return <button type="button" className="ds-cover-btn" aria-label={label} aria-pressed={selected} onClick={onClick}>{face}</button>;
  return <span role="img" aria-label={label} className="ds-cover-wrap">{face}</span>;
}
