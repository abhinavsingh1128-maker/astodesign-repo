export const cx = (...parts: Array<string | false | null | undefined>) => parts.filter(Boolean).join(' ');
export const initials = (name: string) =>
  name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('');
