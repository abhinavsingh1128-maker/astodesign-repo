// Copies the design system into the skill so the skill folder is self-contained, and builds the standalone CSS.
//   node skills/astodesign/scripts/sync-bundle.mjs   (run from the repo root after changing design-system/)
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const skill = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const root = resolve(skill, '..', '..');
const bundle = join(skill, 'bundle');
if (!existsSync(join(root, 'design-system'))) { console.error('Run from the repo that has design-system/'); process.exit(1); }
rmSync(bundle, { recursive: true, force: true });
mkdirSync(join(bundle, 'scripts'), { recursive: true });
cpSync(join(root, 'design-system'), join(bundle, 'design-system'), { recursive: true, filter: (p) => !p.includes('/gallery') });
for (const f of ['build.mjs', 'build-tokens.mjs']) cpSync(join(root, 'scripts', f), join(bundle, 'scripts', f));
for (const f of ['package.json', 'tsconfig.json', 'types.d.ts']) cpSync(join(root, f), join(bundle, f));

const require = createRequire(import.meta.url);
let esbuild;
try { esbuild = require('esbuild'); } catch { esbuild = require('/opt/npm-tools/node_modules/esbuild'); }
await esbuild.build({
  entryPoints: [join(root, 'design-system/styles/index.css')], bundle: true, outfile: join(bundle, 'standalone/astodesign.css'),
  loader: { '.webp': 'file', '.svg': 'file' }, assetNames: 'assets/[name]', logLevel: 'error',
});
writeFileSync(join(bundle, 'standalone/README.md'), `# Standalone CSS

For places that can't run React: link \`astodesign.css\` (keep \`assets/\` beside it), put \`data-surface="night"\` on <body>, and write plain HTML with the \`ds-\` classes. The markup each component renders is in \`../design-system/components/*.tsx\`.
`);
console.log('bundle/ synced: design-system, scripts, package.json, tsconfig.json, types.d.ts, standalone/astodesign.css');
