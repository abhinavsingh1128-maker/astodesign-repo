import type { ReactNode } from 'react';
import { cx } from './util';

export type SceneProps = {
  /** Nav slot: sits at the top, above the art. */
  nav?: ReactNode;
  /** Dim the art when content needs the room (forms, long text). */
  quiet?: boolean;
  /** Min height, any CSS length. Default 100vh. */
  height?: string;
  className?: string;
  children?: ReactNode;
};
/** The painted night: pond, cat, sakura. Use once per page at most, as a hero or a shell backdrop. */
export function Scene({ nav, quiet, height, className, children }: SceneProps) {
  return (
    <section className={cx('ds-scene', quiet && 'ds-scene--quiet', className)} data-surface="night" style={height ? { ['--scene-height' as string]: height } : undefined}>
      <div className="ds-scene__art" aria-hidden="true" />
      {nav && <div className="ds-scene__nav">{nav}</div>}
      <div className="ds-scene__content">{children}</div>
    </section>
  );
}
