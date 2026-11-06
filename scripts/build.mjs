// Bundles pages. A page is a folder with index.html + main.tsx.
//   node scripts/build.mjs                         -> every page (gallery, examples, products)
//   node scripts/build.mjs products/chat/01-inbox  -> one page
// Output: dist/<same path>/  (open dist/<path>/index.html, or serve dist/ for the screenshot script)
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
let esbuild;
try { esbuild = require('esbuild'); } catch { esbuild = require('/opt/npm-tools/node_modules/esbuild'); }
const nodePaths = [join(root, 'node_modules'), '/opt/npm-tools/node_modules'].filter(existsSync);

function findPages(dir) {
  if (!existsSync(dir)) return [];
  const out = [];
  if (existsSync(join(dir, 'index.html')) && existsSync(join(dir, 'main.tsx'))) out.push(dir);
  for (const n of readdirSync(dir)) {
    if (n === 'node_modules' || n === 'dist' || n.startsWith('.')) continue;
    const p = join(dir, n);
    if (statSync(p).isDirectory()) out.push(...findPages(p));
  }
  return out;
}
const args = process.argv.slice(2);
const pages = args.length
  ? args.flatMap((a) => findPages(resolve(root, a)))
  : ['design-system/gallery', 'examples', 'products'].flatMap((d) => findPages(join(root, d)));
if (!pages.length) { console.error('No pages found (a page is a folder with index.html and main.tsx).'); process.exit(1); }

let failed = 0;
for (const page of pages) {
  const rel = relative(root, page);
  const out = join(root, 'dist', rel);
  mkdirSync(out, { recursive: true });
  try {
    await esbuild.build({
      entryPoints: [join(page, 'main.tsx')], bundle: true, outdir: out, entryNames: 'main', format: 'esm', target: 'es2020',
      jsx: 'automatic', minify: true, sourcemap: false, nodePaths, logLevel: 'error',
      loader: { '.webp': 'file', '.svg': 'file', '.png': 'file', '.jpg': 'file', '.woff2': 'file' }, assetNames: 'assets/[name]-[hash]',
      define: { 'process.env.NODE_ENV': '"production"' },
    });
    let html = readFileSync(join(page, 'index.html'), 'utf8');
    html = html.replace(/<script[^>]*src="\.\/main\.tsx"[^>]*><\/script>/, '<script type="module" src="./main.js"></script>');
    if (!html.includes('main.css')) html = html.replace('</head>', '  <link rel="stylesheet" href="./main.css">\n</head>');
    writeFileSync(join(out, 'index.html'), html);
    console.log(`built ${rel}`);
  } catch (e) { failed++; console.error(`FAILED ${rel}\n${e.message}`); }
}
process.exit(failed ? 1 : 0);
