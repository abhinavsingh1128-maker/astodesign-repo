// Scaffold a layout: node skills/astodesign/scripts/new-layout.mjs <product> <NN-slug> "<one-line idea>" [low|medium|high]
import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const [product, slug, idea, intensity = 'medium'] = process.argv.slice(2);
if (!product || !slug || !idea || !/^\d\d-[a-z0-9-]+$/.test(slug)) {
  console.error('Usage: new-layout.mjs <product> <NN-slug> "<one-line idea>" [low|medium|high]\n  e.g. new-layout.mjs chat 01-unified-inbox "Every channel in one triaged inbox"');
  process.exit(1);
}
if (!['low', 'medium', 'high'].includes(intensity)) { console.error('Intensity must be low, medium or high'); process.exit(1); }
const skill = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const root = process.cwd();
if (!existsSync(join(root, 'design-system/components/index.ts'))) {
  console.error('No design-system/ here. Run this from the project root, after Setup in SKILL.md.'); process.exit(1);
}
const dir = join(root, 'products', product, slug);
if (existsSync(dir)) { console.error(`${relative(root, dir)} already exists`); process.exit(1); }
mkdirSync(dir, { recursive: true });
const title = `${product[0].toUpperCase()}${product.slice(1)} ${slug.slice(0, 2)}: ${slug.slice(3).replace(/-/g, ' ')}`;
const prefix = (product.slice(0, 2) + slug.slice(0, 2)).toLowerCase().replace(/[^a-z0-9]/g, '');
const ds = relative(dir, join(root, 'design-system/components')).split('\\').join('/');
const vars = {
  TITLE: title, TITLE_JS: JSON.stringify(title).slice(1, -1), IDEA: idea, PREFIX: `x${prefix}`, DS: ds,
  INTENSITY: intensity, INTENSITY_LABEL: intensity[0].toUpperCase() + intensity.slice(1),
};
for (const f of readdirSync(join(skill, 'template'))) {
  const src = readFileSync(join(skill, 'template', f), 'utf8').replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? `{{${k}}}`);
  writeFileSync(join(dir, f), src);
}
console.log(`Created ${relative(root, dir)}/ (index.html, main.tsx, styles.css, README.md). Class prefix: .${vars.PREFIX}-
Next: fill README Anatomy and Must-keep, then compose main.tsx. Build: node scripts/build.mjs ${relative(root, dir)}`);
