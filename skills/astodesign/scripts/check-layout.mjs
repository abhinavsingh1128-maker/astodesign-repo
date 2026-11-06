// Lints a layout against the hard rules: node skills/astodesign/scripts/check-layout.mjs products/<product>/<NN-slug>
// Errors must be 0. Warnings need a look and, if kept, a line in the README (System tension).
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const dir = resolve(process.argv[2] ?? '');
if (!process.argv[2] || !existsSync(join(dir, 'main.tsx'))) { console.error('Usage: check-layout.mjs <layout folder with main.tsx>'); process.exit(2); }
const read = (f) => (existsSync(join(dir, f)) ? readFileSync(join(dir, f), 'utf8') : '');
const tsx = read('main.tsx'), css = read('styles.css'), md = read('README.md'), html = read('index.html');
const errors = [], warns = [];
const err = (rule, msg) => errors.push(`${rule}: ${msg}`);
const warn = (rule, msg) => warns.push(`${rule}: ${msg}`);
const lineOf = (src, i) => src.slice(0, i).split('\n').length;
const stripComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' ')).replace(/(^|[^:])\/\/.*$/gm, (m, p) => p + ' '.repeat(m.length - p.length));
const code = stripComments(tsx), style = stripComments(css);

// 1. Colour: semantic tokens only. Pigments go through PIGMENTS / var(--pigment-*).
for (const [name, src] of [['main.tsx', code], ['styles.css', style]]) {
  for (const m of src.matchAll(/#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\)/g)) {
    if (name === 'main.tsx' && /['"`]#\w+['"`]/.test(src.slice(m.index - 1, m.index + m[0].length + 1)) && /href|id|key|label/.test(src.slice(m.index - 12, m.index))) continue;
    if (/rgba?\(0,\s*0,\s*0/.test(m[0]) || /rgba?\(255,\s*255,\s*255/.test(m[0])) { warn('colour', `${name}:${lineOf(src, m.index)} raw ${m[0]}; prefer a token (shadows/tints: color-mix with a token)`); continue; }
    err('colour', `${name}:${lineOf(src, m.index)} raw colour ${m[0]}. Use a semantic token, or PIGMENTS for covers.`);
  }
  for (const m of src.matchAll(/var\(--(night|paper|ink|gold|lacquer|sakura|red|green)-\d+\)/g))
    warn('colour', `${name}:${lineOf(src, m.index)} primitive ${m[0]}; components should use semantic names (--text-primary, --bg-surface...)`);
}

// 2. Fonts, sizes, radii, shadows in layout CSS (and inline styles).
const both = style + '\n' + code;
for (const m of both.matchAll(/font-family\s*:\s*([^;}]+)/g)) if (!/var\(--font-/.test(m[1]) && !/inherit/.test(m[1])) err('fonts', `font-family ${m[1].trim()}: use var(--font-serif|sans|mono)`);
for (const m of both.matchAll(/fontFamily\s*:\s*['"]([^'"]+)['"]/g)) if (!/var\(--font-/.test(m[1])) err('fonts', `fontFamily ${m[1]}: use var(--font-...)`);
const checkSize = (val, where) => {
  const px = /^([\d.]+)px$/.exec(val.trim()); const rem = /^([\d.]+)rem$/.exec(val.trim());
  const n = px ? +px[1] : rem ? +rem[1] * 16 : null;
  if (n != null && n < 10.5) err('size', `${where}: font-size ${val} is under 10.5px (labels) / 13.5px (body)`);
  else if (n != null && n < 13.5) warn('size', `${where}: font-size ${val}; fine only for uppercase labels, never body or captions`);
};
for (const m of style.matchAll(/font-size\s*:\s*([^;}]+)/g)) checkSize(m[1], `styles.css:${lineOf(style, m.index)}`);
for (const m of code.matchAll(/fontSize\s*:\s*['"]?([\d.]+(?:px|rem)?)['"]?/g)) checkSize(/\d$/.test(m[1]) ? m[1] + 'px' : m[1], `main.tsx:${lineOf(code, m.index)}`);
for (const m of style.matchAll(/border-radius\s*:\s*([^;}]+)/g)) if (/\d+px/.test(m[1]) && !/var\(--radius/.test(m[1]) && !/^0(px)?$/.test(m[1].trim())) err('radius', `styles.css:${lineOf(style, m.index)} border-radius ${m[1].trim()}: use var(--radius-*)`);
for (const m of style.matchAll(/box-shadow\s*:\s*([^;}]+)/g)) {
  const sel = style.slice(style.lastIndexOf('}', m.index) + 1, m.index).split('{')[0];
  if (!/var\(--elevation|none|inset/.test(m[1])) err('shadow', `styles.css:${lineOf(style, m.index)} box-shadow ${m[1].trim()}: use var(--elevation-*)`);
  else if (/elevation-[234]/.test(m[1]) && !/:hover|:focus|float|modal|sheet|menu|popover|drop/i.test(sel)) warn('shadow', `styles.css:${lineOf(style, m.index)} shadow at rest on "${sel.trim()}"; elevation 2 is for hover/float, 4 for modal/sheet`);
}
for (const m of style.matchAll(/(?:transition|animation)[^;]*?(\d+(?:\.\d+)?m?s)/g)) if (!/var\(--duration/.test(m[0])) warn('motion', `styles.css:${lineOf(style, m.index)} raw duration ${m[1]}; use var(--duration-*)`);

// 3. Prefixed classes; system classes only scoped under the prefix.
const prefixes = new Set();
for (const m of style.matchAll(/(^|[},]\s*)([^{}@]+)\{/g)) {
  const sel = m[2].trim();
  if (!sel || /^(from|to|\d+%)/.test(sel)) continue;
  for (const part of sel.split(',')) {
    const first = /\.([a-z][\w-]*)/.exec(part);
    if (!first) { if (/^\s*(html|body|:root|\*)/.test(part)) err('css', `styles.css: global selector "${part.trim()}"`); continue; }
    if (first[1].startsWith('ds-')) err('css', `styles.css: "${part.trim()}" restyles a system class globally; scope it under your prefix and note it as a System tension`);
    else prefixes.add(first[1].split('-')[0]);
  }
}
if (prefixes.size > 1) warn('css', `more than one class prefix in styles.css: ${[...prefixes].join(', ')}`);
if (/position\s*:\s*fixed[^}]*inset\s*:\s*0[^}]*(washi|grain|noise)|((washi|grain|noise)[^}]*position\s*:\s*fixed[^}]*inset\s*:\s*0)/s.test(style)) err('texture', 'a fixed full-page texture layer; texture is built into surfaces, never laid over the page');

// 4. Components.
if (!/from\s+['"][^'"]*design-system\/components['"]/.test(tsx)) err('components', 'main.tsx does not import from design-system/components');
const scenes = (code.match(/<Scene\b/g) || []).length;
if (scenes > 1) err('scene', `${scenes} <Scene> elements; at most one per screen`);
for (const m of code.matchAll(/<Input\b([^>]*)>/g)) if (!/\blabel=/.test(m[1])) err('a11y', `main.tsx:${lineOf(code, m.index)} <Input> without label`);
if (/<input\b/.test(code) && !/aria-label|<label/.test(code)) warn('a11y', 'raw <input> found; use Input, or give it a label');
const primaries = (code.match(/variant=["']primary["']/g) || []).length;
if (primaries > 2) warn('primary', `${primaries} primary buttons in code. One primary per view; repeated row/tile actions are secondary or ghost`);
// A primary inside the span of a .map( ... ) call is a repeated action.
const mapSpans = [];
for (const m of code.matchAll(/\.map\(/g)) {
  let depth = 0, x = m.index + 4;
  for (; x < code.length; x++) { if (code[x] === '(') depth++; else if (code[x] === ')' && --depth === 0) break; }
  mapSpans.push([m.index, x]);
}
for (const m of code.matchAll(/variant=["']primary["']/g))
  if (mapSpans.some(([a, b]) => a < m.index && m.index < b)) err('primary', `main.tsx:${lineOf(code, m.index)} a primary Button inside .map(): repeated actions are secondary or ghost`);
if (/lorem ipsum/i.test(tsx)) err('content', 'lorem ipsum; use real content');
if (/Replace with the layout/.test(tsx)) err('content', 'the template placeholder is still in main.tsx');
if (/[\u{1F300}-\u{1FAFF}]/u.test(code.replace(/reactions?=\{[^]*?\}\]/g, '').replace(/label:\s*['"][^'"]*['"]/g, ''))) warn('emoji', 'emoji outside reactions; no emoji as UI');
if (/<i class(Name)?=["'](fa|material|bi)\b/.test(code)) err('icons', 'icon font; draw icons with inline SVG at --icon-* sizes');
const intensityAttr = /data-intensity="(low|medium|high)"/.exec(html);
if (!intensityAttr) warn('intensity', 'index.html has no data-intensity on <html>');

// 5. README.
const fields = ['Idea', 'Intensity', 'Reference', 'Mode', 'Shape', 'Anatomy', 'Must-keep', 'Translation', 'Surfaces', 'New patterns', 'Kept / changed / dropped', 'Gives up', 'System tension'];
if (!md) err('readme', 'README.md missing');
else {
  for (const f of fields) if (!new RegExp(`(\\*\\*${f.replace(/[/]/g, '\\/')}:?\\*\\*|^#+\\s*${f.replace(/[/]/g, '\\/')})`, 'mi').test(md)) err('readme', `field "${f}" missing`);
  const intensity = /\*\*Intensity:\*\*\s*(Low|Medium|High)/i.exec(md);
  if (!intensity) err('readme', 'Intensity must start with Low, Medium or High');
  else if (intensityAttr && intensity[1].toLowerCase() !== intensityAttr[1]) err('intensity', `README says ${intensity[1]}, index.html says ${intensityAttr[1]}`);
  if (/Example item|reference style → system token\s*$/m.test(md)) err('readme', 'template text still in README');
  const mk = md.split(/^#+\s*Must-keep/mi)[1]?.split(/^#+\s/m)[0] ?? '';
  const items = mk.split('\n').filter((l) => /^\s*-\s*\[[ x]\]/.test(l));
  if (items.length < 8) err('must-keep', `${items.length} items; 8–12 required`);
  for (const l of items) {
    const names = [...l.matchAll(/`([^`]+)`/g)].map((m) => m[1]);
    if (/^\s*-\s*\[ \]/.test(l)) { if (!/dropped:/i.test(l)) err('must-keep', `unchecked item needs "dropped:" and a reason: ${l.trim()}`); continue; }
    if (!names.length) { err('must-keep', `no component named in: ${l.trim()}`); continue; }
    for (const n of names) {
      const bare = n.replace(/^[<.]/, '').replace(/[>(].*$/, '').replace(/=.*$/, '').trim();
      if (!tsx.includes(bare) && !css.includes(bare)) err('must-keep', `\`${n}\` is not in main.tsx or styles.css (${l.trim().slice(6, 70)})`);
    }
  }
  if (/\b(high)\b/i.test(intensity?.[1] ?? '') && !/<Book\b|ds-washi|<Scene\b/.test(code)) warn('intensity', 'High intensity but no Book, Scene or washi surface; see references/intensity.md');
  if (/\blow\b/i.test(intensity?.[1] ?? '') && /<Book\b|<Scene\b/.test(code)) err('intensity', 'Low intensity uses Book or Scene; Low keeps tokens and format only');
}

console.log(`check ${process.argv[2]}`);
for (const e of errors) console.log(`  ✗ ${e}`);
for (const w of warns) console.log(`  ! ${w}`);
console.log(`${errors.length} error(s), ${warns.length} warning(s)`);
process.exit(errors.length ? 1 : 0);
