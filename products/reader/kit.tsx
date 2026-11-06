// Shared pieces for reader layouts.
import { useEffect } from 'react';
import './kit.css';
export const Stars = ({ n }: { n: number }) => <span className="xrk-stars" role="img" aria-label={`${n} out of 5`}><span aria-hidden="true">{'★'.repeat(n)}<span className="xrk-stars__off">{'★'.repeat(5 - n)}</span></span></span>;
export const useTabTrap = () => useEffect(() => {
  const on = (e: KeyboardEvent) => {
    const d = document.querySelector<HTMLElement>('.ds-modal, .ds-sheet');
    if (!d || e.key !== 'Tab') return;
    const f = [...d.querySelectorAll<HTMLElement>('button:not(:disabled), input, textarea')];
    if (!f.length) return;
    const a = f[0], z = f[f.length - 1], c = document.activeElement;
    if (e.shiftKey && (c === a || c === d)) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && c === z) { e.preventDefault(); a.focus(); }
  };
  document.addEventListener('keydown', on);
  return () => document.removeEventListener('keydown', on);
}, []);
