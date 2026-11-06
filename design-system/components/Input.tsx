import { useId } from 'react';
import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cx } from './util';

type Shared = { label: string; hint?: string; error?: string; compact?: boolean; hideLabel?: boolean; className?: string };
export type InputProps = Shared & ({ multiline?: false } & InputHTMLAttributes<HTMLInputElement> | { multiline: true } & TextareaHTMLAttributes<HTMLTextAreaElement>);

export function Input(props: InputProps) {
  const { label, hint, error, compact, hideLabel, className, multiline, ...rest } = props as Shared & { multiline?: boolean } & Record<string, unknown>;
  const id = useId();
  const hintId = hint || error ? `${id}-hint` : undefined;
  const common = { id, className: 'ds-field__input', 'aria-describedby': hintId, 'aria-invalid': error ? true : undefined };
  return (
    <div className={cx('ds-field', compact && 'ds-field--compact', error && 'ds-field--error', className)}>
      <label htmlFor={id} className={cx('ds-field__label', hideLabel && 'ds-sr-only')}>{label}</label>
      {multiline ? <textarea {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)} {...common} /> : <input {...(rest as InputHTMLAttributes<HTMLInputElement>)} {...common} />}
      {(error || hint) && <p id={hintId} className="ds-field__hint">{error ?? hint}</p>}
    </div>
  );
}
