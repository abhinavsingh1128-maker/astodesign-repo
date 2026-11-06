import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from './util';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** One primary per view. Repeated row actions are secondary or ghost. */
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'md' | 'sm';
  float?: boolean;
  /** Icon-only button. Needs aria-label. */
  icon?: boolean;
  href?: string;
  children: ReactNode;
};
export function Button({ variant = 'secondary', size = 'md', float, icon, href, className, children, type = 'button', ...rest }: ButtonProps) {
  const cls = cx('ds-btn', `ds-btn--${variant}`, size === 'sm' && 'ds-btn--sm', float && 'ds-btn--float', icon && 'ds-btn--icon', className);
  if (href) return <a className={cls} href={href}>{children}</a>;
  return <button type={type} className={cls} {...rest}>{children}</button>;
}
