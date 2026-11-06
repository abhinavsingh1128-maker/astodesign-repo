import { Children, useCallback, useLayoutEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

/* The book and page display from astodesign.com (About, Research, Contact).
   <Book> holds spreads; each <Spread> has a left and a right <Page>.
   Desktop: two pages side by side with a spine; "← Flip back" on the left page footer,
   "Next →" on the right. Turning swings a two-sided leaf over the spine.
   Phones (< 900px) and reduced motion: one page at a time, cross-fade, swipe or buttons. */

export type PageProps = {
  side: 'left' | 'right';
  /** Running head, set as a kicker: the chapter name. */
  kicker?: ReactNode;
  /** Page number shown at the bottom outer corner. */
  folio?: number;
  children: ReactNode;
};
export function Page({ side, kicker, folio, children }: PageProps) {
  return (
    <section className={`ds-page ds-page--${side}`} data-surface="paper">
      {kicker && <p className="ds-kicker ds-page__head">{kicker}</p>}
      <div className="ds-page__body">{children}</div>
      {folio !== undefined && <span className="ds-page__folio" aria-hidden="true">{folio}</span>}
    </section>
  );
}

export type SpreadProps = { title: string; left: ReactNode; right: ReactNode };
/** One open spread. `title` names the chapter for the contents and screen readers. */
export function Spread({ left, right }: SpreadProps) {
  return <>{left}{right}</>;
}

export type BookProps = {
  children: ReactNode; // <Spread> elements
  /** Controlled spread index (optional). */
  index?: number;
  onIndexChange?: (i: number) => void;
  /** Labels for the turn buttons. */
  backLabel?: string;
  nextLabel?: string;
  /** Show chapter tabs (the contents) above the book. */
  contents?: boolean;
};

export function Book({ children, index, onIndexChange, backLabel = '← Flip back', nextLabel = 'Next →', contents = true }: BookProps) {
  const spreads = Children.toArray(children) as Array<React.ReactElement<SpreadProps>>;
  const [own, setOwn] = useState(0);
  const i = index ?? own;
  const set = useCallback((n: number) => { const c = Math.max(0, Math.min(spreads.length - 1, n)); onIndexChange ? onIndexChange(c) : setOwn(c); }, [spreads.length, onIndexChange]);
  // The leaf, as on astodesign.com: a two-sided page swings over the spine while the next spread waits beneath.
  const [turn, setTurn] = useState<{ from: number; to: number; go: boolean } | null>(null);
  const prev = useRef(i);
  useLayoutEffect(() => {
    if (prev.current === i) return;
    const from = prev.current; prev.current = i;
    const flat = matchMedia('(max-width: 900px), (prefers-reduced-motion: reduce)').matches;
    setTurn({ from, to: i, go: false });
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setTurn((t) => (t ? { ...t, go: true } : t))));
    const t = setTimeout(() => setTurn(null), flat ? 460 : 900);
    return () => { cancelAnimationFrame(raf); clearTimeout(t); };
  }, [i]);
  const go = (n: number) => { if (!turn) set(n); };
  // swipe on touch
  const x0 = useRef<number | null>(null);
  const cur = spreads[i];
  const from = turn ? spreads[turn.from] : undefined;
  const fwd = turn ? turn.to > turn.from : true;
  return (
    <div className="ds-book">
      {contents && spreads.length > 1 && (
        <nav className="ds-book__contents" aria-label="Chapters">
          {spreads.map((s, n) => (
            <button key={n} type="button" className="ds-book__chapter" aria-current={n === i ? 'page' : undefined} onClick={() => go(n)}>{s.props.title}</button>
          ))}
        </nav>
      )}
      <div className={`ds-book__spread${turn ? ' is-turning' : ''}`} role="group" aria-roledescription="book spread" aria-label={cur?.props.title}
        onTouchStart={(e) => { x0.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => { if (x0.current === null) return; const dx = e.changedTouches[0].clientX - x0.current; if (Math.abs(dx) > 50) go(i + (dx < 0 ? 1 : -1)); x0.current = null; }}
        onKeyDown={(e) => { if (e.key === 'ArrowRight') go(i + 1); if (e.key === 'ArrowLeft') go(i - 1); }}>
        {!turn && cur}
        {turn && (fwd ? <>{from?.props.left}{cur?.props.right}</> : <>{cur?.props.left}{from?.props.right}</>)}
        {turn && (
          <div className={`ds-book__leaf ${fwd ? 'is-fwd' : 'is-bwd'}${turn.go ? ' is-go' : ''}`} aria-hidden="true" inert>
            <div className="ds-book__face">{fwd ? from?.props.right : from?.props.left}</div>
            <div className="ds-book__face ds-book__face--back">{fwd ? cur?.props.left : cur?.props.right}</div>
          </div>
        )}
        <span className="ds-book__spine" aria-hidden="true" />
        <div className="ds-book__foot ds-book__foot--left" data-surface="paper">
          {!turn && i > 0 && <button type="button" className="ds-btn ds-btn--ghost" onClick={() => go(i - 1)}>{backLabel}</button>}
        </div>
        <div className="ds-book__foot ds-book__foot--right" data-surface="paper">
          {!turn && i < spreads.length - 1 && <button type="button" className="ds-btn ds-btn--ghost" onClick={() => go(i + 1)}>{nextLabel}</button>}
        </div>
      </div>
      <p className="ds-sr-only" aria-live="polite">{cur?.props.title}, spread {i + 1} of {spreads.length}</p>
    </div>
  );
}
