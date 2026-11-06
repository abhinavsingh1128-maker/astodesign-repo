import type { ReactNode } from 'react';
import { cx } from './util';

export type Column<R> = { key: string; label: string; numeric?: boolean; sortable?: boolean; render?: (row: R) => ReactNode; width?: string };
export type TableProps<R> = {
  caption: string;
  showCaption?: boolean;
  columns: Column<R>[];
  rows: R[];
  rowKey: (row: R) => string;
  sort?: { key: string; dir: 'asc' | 'desc' };
  onSort?: (key: string) => void;
  onRowClick?: (row: R) => void;
  selectedKey?: string;
  density?: 'comfortable' | 'compact';
};
/** A Paper ledger: uppercase headers, tabular numbers, gold bar on the selected row. Scrolls sideways on phones. */
export function Table<R>({ caption, showCaption, columns, rows, rowKey, sort, onSort, onRowClick, selectedKey, density = 'comfortable' }: TableProps<R>) {
  return (
    <div className="ds-table-wrap ds-washi" data-surface="paper" tabIndex={0} role="region" aria-label={caption}>
      <table className={cx('ds-table', density === 'compact' && 'ds-table--compact')}>
        <caption className={showCaption ? 'ds-table__caption' : 'ds-sr-only'}>{caption}</caption>
        <thead>
          <tr>
            {columns.map((c) => {
              const s = sort?.key === c.key ? (sort.dir === 'asc' ? 'ascending' : 'descending') : undefined;
              return (
                <th key={c.key} scope="col" aria-sort={s} className={cx(c.numeric && 'is-num')} style={c.width ? { width: c.width } : undefined}>
                  {onSort && c.sortable !== false ? <button type="button" className="ds-table__sort" onClick={() => onSort(c.key)}>{c.label}<span aria-hidden="true">{s === 'ascending' ? ' ↑' : s === 'descending' ? ' ↓' : ''}</span></button> : c.label}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const k = rowKey(r);
            return (
              <tr key={k} className={cx(onRowClick && 'is-clickable', selectedKey === k && 'is-selected')} onClick={onRowClick ? () => onRowClick(r) : undefined} aria-selected={selectedKey === k || undefined}>
                {columns.map((c, i) => (
                  <td key={c.key} className={cx(c.numeric && 'is-num')}>
                    {i === 0 && onRowClick ? <button type="button" className="ds-table__rowbtn" onClick={(e) => { e.stopPropagation(); onRowClick(r); }}>{c.render ? c.render(r) : String((r as Record<string, unknown>)[c.key] ?? '')}</button>
                      : c.render ? c.render(r) : String((r as Record<string, unknown>)[c.key] ?? '')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
