import { cx, initials } from './util';
import { pigmentFor } from './pigments';

export type AvatarProps = {
  name: string;
  src?: string;
  size?: 's' | 'm' | 'l' | 'xl';
  /** Gold ring: the current user or the featured person. */
  gold?: boolean;
  presence?: 'on' | 'off';
  className?: string;
};
export function Avatar({ name, src, size = 'm', gold, presence, className }: AvatarProps) {
  return (
    <span className={cx('ds-avatar ds-grain', `ds-avatar--${size}`, gold && 'ds-avatar--gold', className)} style={{ ['--pigment' as string]: pigmentFor(name) }} role="img" aria-label={name + (presence ? (presence === 'on' ? ', online' : ', away') : '')}>
      {src ? <img src={src} alt="" /> : <span aria-hidden="true">{initials(name)}</span>}
      {presence && <span className={cx('ds-avatar__presence', presence === 'on' && 'ds-avatar__presence--on')} aria-hidden="true" />}
    </span>
  );
}
