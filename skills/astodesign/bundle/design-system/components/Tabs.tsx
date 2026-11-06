import { useId, useRef } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

export type TabsProps<T extends string> = { label: string; value: T; onChange: (v: T) => void; tabs: Array<{ value: T; label: ReactNode; count?: number }> };
/** Section tabs with a gold underline. Arrow keys move between tabs. */
export function Tabs<T extends string>({ label, value, onChange, tabs }: TabsProps<T>) {
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  const onKey = (e: KeyboardEvent) => {
    const i = tabs.findIndex((t) => t.value === value);
    let n = i;
    if (e.key === 'ArrowRight') n = (i + 1) % tabs.length;
    else if (e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') n = 0;
    else if (e.key === 'End') n = tabs.length - 1;
    else return;
    e.preventDefault();
    onChange(tabs[n].value);
    ref.current?.querySelectorAll<HTMLButtonElement>('[role=tab]')[n]?.focus();
  };
  return (
    <div className="ds-tabs" role="tablist" aria-label={label} ref={ref} onKeyDown={onKey}>
      {tabs.map((t) => (
        <button key={t.value} id={`${id}-${t.value}`} type="button" role="tab" aria-selected={t.value === value} tabIndex={t.value === value ? 0 : -1} className="ds-tabs__tab" onClick={() => onChange(t.value)}>
          {t.label}{t.count != null && <span className="ds-tabs__count">{t.count}</span>}
        </button>
      ))}
    </div>
  );
}
