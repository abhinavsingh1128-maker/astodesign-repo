import type { ReactNode } from 'react';
import { cx } from './util';

export type TagProps = {
  variant?: 'outline' | 'solid' | 'accent' | 'selected';
  /** When given, the tag is a toggle chip (a button with aria-pressed). */
  onClick?: () => void;
  pressed?: boolean;
  className?: string;
  children: ReactNode;
};
export function Tag({ variant = 'outline', onClick, pressed, className, children }: TagProps) {
  const cls = cx('ds-tag', variant !== 'outline' && `ds-tag--${variant}`, (variant === 'accent' || variant === 'selected') && 'ds-grain', className);
  if (onClick) return <button type="button" className={cls} aria-pressed={!!pressed} onClick={onClick}>{children}</button>;
  return <span className={cls}>{children}</span>;
}
