// Screenshots a built layout at 1280, 1100 and 390 and runs the checks a linter can't:
// sideways overflow, overlapping controls, tiny text, flat colour blocks without grain, small touch targets, density.
//   node scripts/build.mjs products/<product>/<NN-slug>
//   node skills/astodesign/scripts/shoot.mjs <product>/<NN-slug> shots/<product>
import { createServer } from 'node:http';
import { createReadStream, existsSync, mkdirSync, statSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import { createRequire } from 'node:module';

const [target, outDir = 'shots'] = process.argv.slice(2);
if (!target) { console.error('Usage: shoot.mjs <product>/<NN-slug> [outDir]'); process.exit(2); }
const rel = target.replace(/^products\//, '');
const dist = resolve('dist');
const pageDir = join(dist, 'products', rel);
if (!existsSync(join(pageDir, 'index.html'))) { console.error(`Not built: dist/products/${rel}. Run: node scripts/build.mjs products/${rel}`); process.exit(2); }
const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = require('/opt/npm-tools/node_modules/playwright')); }

const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2' };
const server = createServer((req, res) => {
  let p = join(dist, decodeURIComponent(req.url.split('?')[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, 'index.html');
  if (!p.startsWith(dist) || !existsSync(p)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': types[extname(p)] ?? 'application/octet-stream' });
  createReadStream(p).pipe(res);
});
await new Promise((r) => server.listen(0, r));
const url = `http://localhost:${server.address().port}/products/${rel}/`;
mkdirSync(outDir, { recursive: true });
const name = rel.replace(/\//g, '-');
let browser;
try { browser = await chromium.launch(); }
catch {
  try { browser = await chromium.launch({ channel: 'chrome' }); console.log('Using the installed Chrome.'); }
  catch { console.error('No browser found. Run: npx playwright install chromium'); server.close(); process.exit(2); }
}
let problems = 0;

for (const [label, width, height] of [['desktop', 1280, 800], ['laptop', 1100, 760], ['phone', 390, 844]]) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error' && !/fonts\.(googleapis|gstatic)|ERR_TUNNEL|ERR_NAME|net::ERR/.test(m.text() + (m.location()?.url ?? ''))) errs.push(m.text()); });
  await page.goto(url, { waitUntil: 'networkidle' }).catch(() => page.goto(url));
  await page.waitForTimeout(700);
  const file = join(outDir, `${name}-${label}.png`);
  await page.screenshot({ path: file, fullPage: true });
  const r = await page.evaluate(({ phone }) => {
    const out = { overflow: document.documentElement.scrollWidth - innerWidth, tiny: [], flat: [], overlaps: [], small: [], counts: {} };
    const vis = (el) => { const s = getComputedStyle(el); const b = el.getBoundingClientRect(); return s.visibility !== 'hidden' && s.display !== 'none' && +s.opacity > 0.05 && b.width > 0 && b.height > 0; };
    const desc = (el) => (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : el.tagName.toLowerCase()) + (el.textContent ? ` "${el.textContent.trim().slice(0, 28)}"` : '');
    for (const el of document.querySelectorAll('body *')) {
      if (!vis(el) || el.closest('.ds-sr-only, svg')) continue;
      const s = getComputedStyle(el);
      const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      if (own && parseFloat(s.fontSize) < 10.5) out.tiny.push(`${desc(el)} ${s.fontSize}`);
      const b = el.getBoundingClientRect();
      const bg = s.backgroundColor.match(/[\d.]+/g)?.map(Number) ?? [0, 0, 0, 0];
      if (b.width >= 48 && b.height >= 48 && (bg[3] ?? 1) > 0.9) {
        const [R, G, B] = bg; const max = Math.max(R, G, B), min = Math.min(R, G, B);
        const sat = max ? (max - min) / max : 0;
        const textured = s.backgroundImage !== 'none' || el.closest('.ds-grain, [class*="washi"], .ds-card, .ds-page, .ds-modal, .ds-sheet, .ds-app__main, .ds-app__sidebar, .ds-app__aside, .ds-table-wrap') ;
        if (sat > 0.35 && !textured && !el.querySelector(':scope > img')) out.flat.push(desc(el));
      }
    }
    const ctrls = [...document.querySelectorAll('button, a[href], input, select, textarea, [role=tab], [role=radio]')].filter((e) => vis(e) && !e.closest('[aria-hidden=true], .ds-sr-only, .ds-app__sidebar:not([data-open=true])') && e.getBoundingClientRect().right > 0 && e.getBoundingClientRect().left < innerWidth);
    // A control scrolled out of its pane is not on screen: measure only the part that shows.
    const clipped = (e) => {
      const r = e.getBoundingClientRect(); let { left, top, right, bottom } = r;
      for (let a = e.parentElement; a; a = a.parentElement) {
        const s = getComputedStyle(a);
        if (s.overflow === 'visible' && s.overflowX === 'visible' && s.overflowY === 'visible') continue;
        const c = a.getBoundingClientRect();
        left = Math.max(left, c.left); top = Math.max(top, c.top); right = Math.min(right, c.right); bottom = Math.min(bottom, c.bottom);
      }
      return { left, top, right, bottom, width: r.width, height: r.height };
    };
    const boxes = ctrls.map((e) => [e, clipped(e)]).filter(([, b]) => b.right > b.left && b.bottom > b.top);
    for (let i = 0; i < boxes.length; i++) {
      const [e, b] = boxes[i];
      if (phone && (b.height < 32 || b.width < 32) && !e.matches('a:not([class]), .ds-msg__thread, .ds-table__rowbtn, .ds-table__sort, .ds-tag')) out.small.push(`${desc(e)} ${Math.round(b.width)}×${Math.round(b.height)}`);
      for (let j = i + 1; j < boxes.length; j++) {
        const [f, c] = boxes[j];
        if (e.contains(f) || f.contains(e)) continue;
        const ox = Math.min(b.right, c.right) - Math.max(b.left, c.left), oy = Math.min(b.bottom, c.bottom) - Math.max(b.top, c.top);
        if (ox > 6 && oy > 6) out.overlaps.push(`${desc(e)} × ${desc(f)}`);
      }
    }
    const q = (s) => document.querySelectorAll(s).length;
    out.counts = { messages: q('.ds-msg'), covers: q('.ds-cover'), rows: q('tbody tr, .ds-list-item'), railItems: q('.ds-rail__item'), primary: [...document.querySelectorAll('.ds-btn--primary')].filter((e) => { const b = e.getBoundingClientRect(); return vis(e) && b.top < innerHeight && b.bottom > 0; }).length, scenes: q('.ds-scene'), books: q('.ds-book, .ds-spread') };
    return out;
  }, { phone: width < 500 });
  const issues = [];
  if (errs.length) issues.push(`runtime errors: ${errs.slice(0, 3).join(' | ')}`);
  if (r.overflow > 1) issues.push(`sideways scroll: ${r.overflow}px wider than the viewport`);
  if (r.tiny.length) issues.push(`text under 10.5px: ${r.tiny.slice(0, 4).join('; ')}`);
  if (r.flat.length) issues.push(`flat colour blocks without grain: ${r.flat.slice(0, 4).join('; ')}`);
  if (r.overlaps.length) issues.push(`overlapping controls: ${r.overlaps.slice(0, 4).join('; ')}`);
  if (r.small.length > 2) issues.push(`touch targets under 32px: ${r.small.slice(0, 4).join('; ')}`);
  if (r.counts.primary > 1) issues.push(`${r.counts.primary} primary buttons in the first screen (one primary per view)`);
  problems += issues.length;
  console.log(`${label} ${width}px → ${file}`);
  console.log(`  density: ${Object.entries(r.counts).filter(([k]) => k !== 'primary').map(([k, v]) => `${k} ${v}`).join(', ')}`);
  for (const i of issues) console.log(`  ✗ ${i}`);
  if (!issues.length) console.log('  ✓ no overflow, overlaps, tiny text or flat blocks');
  await page.close();
}
await browser.close();
server.close();
console.log(problems ? `${problems} issue(s). Fix them, then look at every screenshot yourself.` : 'Automated checks pass. Now look at every screenshot yourself (fibres visible? one primary? density real?).');
process.exit(problems ? 1 : 0);
