# Astodesign: design system + skill

Pazcare Product Designer assignment, by Abhinav Singh Tomar.

| Part | Where |
| --- | --- |
| 1. Design system from my portfolio (astodesign.com) | `design-system/` (tokens, styles, React components, gallery) and the Figma file *Astodesign — Design System* |
| 2. A Claude Code skill that builds with it | `skills/astodesign/` (also linked at `.claude/skills/astodesign`) |
| 3. Two products, three layouts each | `products/` (see `products/README.md`) |

## Run it

```
npm install            # offline here: scripts fall back to /opt/npm-tools
npm run tokens         # tokens.json -> tokens.css + tokens.ts
npm run build          # every page into dist/
python3 -m http.server -d dist 4321   # then open /design-system/gallery/
```

One layout: `node scripts/build.mjs products/<product>/<NN-slug>`, then
`node skills/astodesign/scripts/check-layout.mjs products/<product>/<NN-slug>` and
`node skills/astodesign/scripts/shoot.mjs <product>/<NN-slug> shots/<product>`.

## The system in one breath

Two surfaces: **Night** (the painted teal scene, for shells and rails) and **Paper** (washi, for anything read or written), switched by `data-surface`. Washi texture is built into every surface: light fibres on Night, grain and faint dark fibres on Paper. Cormorant Garamond speaks (titles, names), Helvetica Neue works (everything long). Gold means current, lacquer means selected or done, sakura means new. The portfolio's open-book pages are a component (`Book`, `Spread`, `Page`).

Fonts: Cormorant loads from Google Fonts; offline it falls back to Georgia.

## Using the skill elsewhere

Copy `skills/astodesign/` into any project's `.claude/skills/`. It carries the whole system in `bundle/` and sets the project up on first run (see Setup in its SKILL.md). After changing `design-system/`, run `node skills/astodesign/scripts/sync-bundle.mjs`.
