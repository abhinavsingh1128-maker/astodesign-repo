import { useEffect } from 'react';
import type { ReactNode } from 'react';

/** A short confirmation at the bottom. Leaves on its own after 4s. */
export function Toast({ children, action, onDone, duration = 4000 }: { children: ReactNode; action?: ReactNode; onDone: () => void; duration?: number }) {
  useEffect(() => { const t = setTimeout(onDone, duration); return () => clearTimeout(t); }, [onDone, duration]);
  return <div className="ds-toast" role="status" data-surface="night">{children}{action}</div>;
}
