# Findings: gaps already met and the agreed fix

Add to this file when a layout finds something the system doesn't cover. Format: what happened → fix → where it lives now.

| # | Found while | Problem | Fix (status) |
| --- | --- | --- | --- |
| 1 | First chat layouts | Agents hand-built a sidebar and lost the phone sheet | `AppShell` + `Rail`; only frame that becomes a sheet under 760px (in system) |
| 2 | Shelf layouts | Coloured covers looked flat and digital | `ds-grain` on every coloured block; `CoverTile` grains by default (in system) |
| 3 | Washi feedback | Texture not felt: the portfolio's washi has **fibre lines**, not just grain | `washi-glow` (Night, screen) + `washi-fibre-ink` over `washi-paper` (Paper); built into surfaces (in system) |
| 4 | Washi feedback | An agent laid a fixed grain layer over the whole page; it covered modals | Banned; the checker flags it (rule) |
| 5 | Product grids | Item info sat straight on Night and read poorly | Info under a cover goes on Paper (rule, Step 3) |
| 6 | Promo bars | Solid lacquer/gold bars used for promos | Notices are `Banner tone="note"` (rule) |
| 7 | Rows with actions | "Add" primary on every row | Repeated actions secondary/ghost; checker errors on primary inside `.map()` |
| 8 | Product nav | Centred pill collided with search | `Nav layout="bar"` for products (in system) |
| 9 | Book | Ghost foot buttons vanished on Paper; folio overlapped "Next" on phones | Foot is `data-surface="paper"`; folios hidden under 900px (in system) |
| 10 | Offline builds | Google Fonts blocked → Georgia | Expected; say so when reporting screenshots (rule) |
| 11 | Tables on phones | Columns squeezed into 4-line cells | Table has a 520px min width and scrolls sideways (in system) |
| 12 | Elevation | `--elevation-1` resolved once at :root and kept Night colours on Paper | Re-declared per surface in tokens.css (in system) |
