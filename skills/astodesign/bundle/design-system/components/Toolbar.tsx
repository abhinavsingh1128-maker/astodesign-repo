import type { ReactNode } from 'react';
import { cx } from './util';

export function Toolbar({ label, end, className, children }: { label: string; end?: ReactNode; className?: string; children?: ReactNode }) {
  return (
    <div className={cx('ds-toolbar', className)} role="toolbar" aria-label={label}>
      <div className="ds-toolbar__start">{children}</div>
      {end && <div className="ds-toolbar__end">{end}</div>}
    </div>
  );
}
export const ToolbarDivider = () => <span className="ds-toolbar__divider" aria-hidden="true" />;

export type SegmentedProps<T extends string> = { label: string; value: T; onChange: (v: T) => void; options: Array<{ value: T; label: ReactNode }> };
/** A choice of views or filters. Selected = lacquer. */
export function Segmented<T extends string>({ label, value, onChange, options }: SegmentedProps<T>) {
  return (
    <div className="ds-segmented" role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button key={o.value} type="button" role="radio" aria-checked={o.value === value} className={cx('ds-segmented__opt', o.value === value && 'ds-grain')} onClick={() => onChange(o.value)}>{o.label}</button>
      ))}
    </div>
  );
}
