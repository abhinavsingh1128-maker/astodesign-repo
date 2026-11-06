import type { ReactNode } from 'react';
import { cx } from './util';

/** The moon ring: progress toward a goal (a reading challenge, a quota). */
export function Ring({ value, max, label, size = 140, children }: { value: number; max: number; label: string; size?: number; children?: ReactNode }) {
  const r = 44, c = 2 * Math.PI * r, p = Math.max(0, Math.min(1, value / max));
  return (
    <figure className="ds-ring" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" role="img" aria-label={`${label}: ${value} of ${max}`}>
        <circle cx="50" cy="50" r={r} className="ds-ring__track" />
        <circle cx="50" cy="50" r={r} className="ds-ring__value" strokeDasharray={`${c * p} ${c}`} transform="rotate(-90 50 50)" />
      </svg>
      <figcaption className="ds-ring__center">{children ?? <><span className="ds-ring__num">{value}</span><span className="ds-ring__of">of {max}</span></>}</figcaption>
    </figure>
  );
}

/** Vertical bars with a screen-reader table. The current bar is gold, the rest ink-quiet. */
export function Bars({ label, data, height = 120, format = String }: { label: string; data: Array<{ label: string; value: number; current?: boolean }>; height?: number; format?: (n: number) => string }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <figure className="ds-bars">
      <div className="ds-bars__plot" style={{ height }} aria-hidden="true">
        {data.map((d) => (
          <div key={d.label} className="ds-bars__col" title={`${d.label}: ${format(d.value)}`}>
            <span className={cx('ds-bars__bar ds-grain', d.current && 'is-current')} style={{ height: `${(d.value / max) * 100}%` }} />
            <span className="ds-bars__x">{d.label}</span>
          </div>
        ))}
      </div>
      <table className="ds-sr-only"><caption>{label}</caption><tbody>{data.map((d) => <tr key={d.label}><th scope="row">{d.label}</th><td>{format(d.value)}</td></tr>)}</tbody></table>
    </figure>
  );
}

/** A thin gold progress line (book progress, upload). */
export function Progress({ value, max = 100, label, showLabel }: { value: number; max?: number; label: string; showLabel?: boolean }) {
  const p = Math.round((Math.max(0, Math.min(max, value)) / max) * 100);
  return (
    <div className="ds-progress">
      <div className="ds-progress__track" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={value}>
        <span className="ds-progress__bar" style={{ width: `${p}%` }} />
      </div>
      {showLabel && <span className="ds-progress__label ds-num">{p}%</span>}
    </div>
  );
}
