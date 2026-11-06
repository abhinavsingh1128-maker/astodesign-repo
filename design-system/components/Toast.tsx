import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

/** A short confirmation at the bottom. Leaves on its own after 4s. */
export function Toast({ children, action, onDone, duration = 4000 }: { children: ReactNode; action?: ReactNode; onDone: () => void; duration?: number }) {
  // Held in a ref so an inline onDone does not restart the timer on every render.
  const done = useRef(onDone);
  done.current = onDone;
  useEffect(() => { const t = setTimeout(() => done.current(), duration); return () => clearTimeout(t); }, [duration]);
  return <div className="ds-toast" role="status" data-surface="night">{children}{action}</div>;
}
