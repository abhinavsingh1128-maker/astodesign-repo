// Generates design-system/tokens/tokens.css and tokens.ts from tokens.json. Run: npm run tokens
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'design-system', 'tokens');
const t = JSON.parse(readFileSync(join(root, 'tokens.json'), 'utf8'));
const clean = (o) => Object.fromEntries(Object.entries(o).filter(([k]) => !k.startsWith('$')));
const ref = (v) => (v.startsWith('#') ? v : `var(--${v})`);
const L = [];
const out = (s = '') => L.push(s);
out('/* Generated from tokens.json by scripts/build-tokens.mjs. Do not edit by hand. */');
out(':root {');
out('  /* primitives: never use these in components; use the semantic names below */');
for (const [k, v] of Object.entries(t.color.primitive)) out(`  --${k}: ${v};`);
for (const [k, v] of Object.entries(clean(t.color.pigment))) out(`  --pigment-${k}: ${v};`);
for (const [k, v] of Object.entries(t.font)) out(`  --font-${k}: ${v};`);
for (const [n, s] of Object.entries(clean(t.type))) {
  out(`  --type-${n}-size: ${s.fluid ?? `${s.size}px`};`);
  out(`  --type-${n}-line: ${(s.line / s.size).toFixed(3)};`);
  out(`  --type-${n}-weight: ${s.weight};`);
  out(`  --type-${n}-tracking: ${s.tracking ?? 0}em;`);
}
for (const [k, v] of Object.entries(t.space)) out(`  --space-${k}: ${v}px;`);
for (const [k, v] of Object.entries(t.radius)) out(`  --radius-${k}: ${v}px;`);
for (const [k, v] of Object.entries(t.elevation)) out(`  --elevation-${k.split('-')[0]}: ${v};`);
for (const [k, v] of Object.entries(t.motion.duration)) out(`  --duration-${k}: ${v}ms;`);
for (const [k, v] of Object.entries(t.motion.easing)) out(`  --easing-${k}: ${v};`);
out(`  --enter-distance: ${t.motion['enter-distance']}px;`);
const Y = t.layout;
out(`  --content-max: ${Y['content-max']}px;`);
out(`  --reading-max: ${Y['reading-max']};`);
out(`  --gutter: ${Y.gutter};`);
for (const [k, v] of Object.entries(Y.z)) out(`  --z-${k}: ${v};`);
for (const [k, v] of Object.entries(Y.icon)) out(`  --icon-${k}: ${v}${k === 'stroke' ? '' : 'px'};`);
out(`  --hit-min: ${Y['hit-min']}px;`);
out('}');
out('');
const sem = clean(t.color.semantic);
for (const mode of ['night', 'paper']) {
  out(mode === 'night' ? ':root, [data-surface="night"] {' : '[data-surface="paper"] {');
  out(`  color-scheme: ${mode === 'night' ? 'dark' : 'light'};`);
  for (const [k, v] of Object.entries(sem)) out(`  --${k}: ${ref(v[mode])};`);
  // Re-declared per surface: it reads a surface colour, and custom properties resolve where they are declared.
  out(`  --elevation-1: ${t.elevation['1-hairline']};`);
  out('}');
  out('');
}
out('@media (prefers-reduced-motion: reduce) {');
out('  :root { --duration-enter: 1ms; --duration-turn: 1ms; --duration-slow: 1ms; --duration-scene: 1ms; --duration-sway: 0ms; --enter-distance: 0px; }');
out('}');
writeFileSync(join(root, 'tokens.css'), L.join('\n') + '\n');
writeFileSync(join(root, 'tokens.ts'), `// Generated from tokens.json by scripts/build-tokens.mjs. Do not edit by hand.
export const tokens = ${JSON.stringify(t, null, 2)} as const;

export type SurfaceTone = 'night' | 'paper';
export type SemanticColor = ${Object.keys(sem).map((k) => `'${k}'`).join(' | ')};
export type Space = ${Object.keys(t.space).map((k) => `'${k}'`).join(' | ')};
export const cssVar = (name: SemanticColor) => \`var(--\${name})\`;
export const space = (step: Space) => \`var(--space-\${step})\`;
`);
console.log('tokens.css and tokens.ts written');
