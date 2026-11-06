import type { ReactNode } from 'react';

export function EmptyState({ title, body, action }: { title: ReactNode; body?: ReactNode; action?: ReactNode }) {
  return (
    <div className="ds-empty">
      <div className="ds-empty__moon" aria-hidden="true" />
      <p className="ds-empty__title">{title}</p>
      {body && <p className="ds-empty__body">{body}</p>}
      {action}
    </div>
  );
}
