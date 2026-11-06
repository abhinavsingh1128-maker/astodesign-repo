import type { ElementType, ReactNode, CSSProperties } from 'react';
import { cx } from './util';

export type SurfaceProps = {
  tone?: 'night' | 'paper';
  /** Washi fibres built into the surface (on by default). */
  texture?: boolean;
  /** A soft night-shade gradient behind content (Night only). */
  backdrop?: boolean;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  [key: string]: unknown;
};
export function Surface({ tone = 'night', texture = true, backdrop, as: As = 'div', className, children, ...rest }: SurfaceProps) {
  return (
    <As data-surface={tone} className={cx(texture && 'ds-washi', backdrop && 'ds-surface--backdrop', className)} {...rest}>
      {children}
    </As>
  );
}
