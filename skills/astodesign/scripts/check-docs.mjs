// Fails when the skill's docs use a component prop the source does not have.
//   node skills/astodesign/scripts/check-docs.mjs   (run from the repo root)
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const skill = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const src = [join(skill, '../../design-system/components'), join(skill, 'bundle/design-system/components')].find(existsSync);
if (!src) { console.error('No design-system/components found.'); process.exit(2); }

// Component name → the props its function destructures.
const props = {};
for (const f of readdirSync(src).filter((n) => n.endsWith('.tsx'))) {
  const code = readFileSync(join(src, f), 'utf8');
  for (const m of code.matchAll(/export (?:function (\w+)(?:<[^>]*>)?\(\{([^}]*)\}|const (\w+) = \(\{([^}]*)\})/g)) {
    props[m[1] ?? m[3]] = new Set((m[2] ?? m[4]).split(',').map((p) => p.trim().split(/[=:\s]/)[0].replace('...', '')).filter(Boolean));
  }
  // Named prop types add anything the function does not destructure.
  for (const m of code.matchAll(/export type (\w+)Props(?:<[^>]*>)? = (?:[^{]*)\{([^]*?)\n?\};/g)) {
    props[m[1]] = new Set([...(props[m[1]] ?? []), ...[...m[2].matchAll(/(?:^|[;{\n]\s*)(\w+)\??:/g)].map((x) => x[1])]);
  }
  // Input reads its props from a Shared type.
  const shared = /type Shared = \{([^}]*)\}/.exec(code);
  if (shared && /function Input/.test(code)) props.Input = new Set([...shared[1].matchAll(/(\w+)\??:/g)].map((m) => m[1]).concat('multiline'));
}
// Spread only reads `title` through its parent, so it is not destructured.
(props.Spread ??= new Set()).add('title');
// These pass the rest on to a real HTML element.
const html = /^(id|as|style|type|disabled|value|onChange|onKeyDown|onClick|placeholder|rows|list|inputMode|aria-.*|data-.*|key)$/;
const open = new Set(['Button', 'Input', 'Surface']);

// Reads the attribute names of one tag, skipping anything inside quotes or braces.
function attrs(text, start) {
  const names = []; let i = start;
  while (i < text.length) {
    while (/\s/.test(text[i] ?? '')) i++;
    if (text[i] === '>' || text.startsWith('/>', i) || text.startsWith('…', i) || i >= text.length) break;
    const m = /^[A-Za-z][\w-]*/.exec(text.slice(i));
    if (!m) break;
    names.push(m[0]); i += m[0].length;
    if (text[i] !== '=') continue;
    i++;
    if (text[i] === '"') { i = text.indexOf('"', i + 1) + 1; continue; }
    if (text[i] !== '{') break;
    let d = 0;
    do { if (text[i] === '{') d++; else if (text[i] === '}') d--; i++; } while (d > 0 && i < text.length);
  }
  return names;
}
const only = process.argv[2];
const files = only ? [resolve(only)] : [join(skill, 'SKILL.md'), ...readdirSync(join(skill, 'references')).filter((n) => n.endsWith('.md')).map((n) => join(skill, 'references', n))];
let bad = 0, seen = 0;
for (const file of files) {
  const text = readFileSync(file, 'utf8');
  for (const m of text.matchAll(/<([A-Z]\w+)(?=[\s>/])/g)) {
    const known = props[m[1]];
    if (!known) continue;
    seen++;
    for (const a of attrs(text, m.index + m[0].length)) {
      if (known.has(a) || (open.has(m[1]) && html.test(a)) || a === 'key') continue;
      console.log(`  ✗ ${file.split('/').pop()}: <${m[1]} ${a}> is not a prop in the source`);
      bad++;
    }
  }
}
console.log(`${seen} component uses checked against ${Object.keys(props).length} components, ${bad} problem(s)`);
process.exit(bad ? 1 : 0);
