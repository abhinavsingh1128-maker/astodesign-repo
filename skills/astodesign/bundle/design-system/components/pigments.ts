/** The six cover pigments. The only raw colours a layout may use, and only through these names. */
export const PIGMENTS = {
  lacquer: 'var(--pigment-lacquer)',
  teal: 'var(--pigment-teal)',
  moss: 'var(--pigment-moss)',
  plum: 'var(--pigment-plum)',
  ochre: 'var(--pigment-ochre)',
  ink: 'var(--pigment-ink)',
} as const;
export type Pigment = keyof typeof PIGMENTS;
const ORDER = Object.keys(PIGMENTS) as Pigment[];
/** Stable pigment per item: the same title always gets the same colour. */
export function pigmentFor(key: string): string {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return PIGMENTS[ORDER[h % ORDER.length]];
}
