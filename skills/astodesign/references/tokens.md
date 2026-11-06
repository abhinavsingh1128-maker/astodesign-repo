# Tokens

Source: `design-system/tokens/tokens.json` → `tokens.css` / `tokens.ts` (`npm run tokens`). Figma variables map 1:1 (`text/primary` → `--text-primary`). Layout CSS uses only these names.

## Colour (semantic: the value changes with `data-surface`)

| Token | Night | Paper | Job |
| --- | --- | --- | --- |
| `--bg-canvas` | #163f52 | #f6f0e2 | page / surface background |
| `--bg-surface` | #123a4c | #f3ecdc | rails, cards, panels |
| `--bg-raised` | #1d5064 | #fffdf8 | a slip on top (banner, popover) |
| `--bg-sunken` | #0e2a36 | #efe6d2 | wells, code, inputs inside a panel |
| `--text-primary` | #f6ead0 | #1f1a17 | body and titles |
| `--text-secondary` | #c9bfae | #5c5652 | meta, help |
| `--text-muted` | #6fa8c7 | #8a8074 | timestamps, section titles in rails |
| `--text-accent` | #d8a44a | #8a6a2e | kickers, links, thread counts |
| `--border-subtle` / `--border-strong` | | | hairlines / underlines, headers |
| `--focus` | gold | lacquer | focus ring |
| `--action-bg/-text/-bg-hover/-text-hover` | | | the primary button (ink pill → white) |
| `--accent-gold` | #d8a44a | | current, progress, highlight tag |
| `--accent-lacquer` | #8b2722 | | selected, mentioned, done |
| `--accent-sakura` | #eaa3b4 | #d9708b | unread, new, now |
| `--status-error/-success/-warning/-info` | | | status only |

Pigments (covers only, through `PIGMENTS` / `pigmentFor()` or `var(--pigment-*)`): lacquer, teal, moss, plum, ochre, ink.

Tints: `color-mix(in srgb, var(--accent-gold) 12%, transparent)`, never a new hex.

## Type

Fonts: `--font-serif` (Cormorant Garamond → Georgia offline), `--font-sans` (Helvetica Neue / Inter / Arial), `--font-mono`.

| Class | Size | Use |
| --- | --- | --- |
| `ds-display-xl` | 40–80px serif | one hero line |
| `ds-display-l` | 34–56px | page title |
| `ds-h2` | 30–44px | section |
| `ds-h3` | 22–26px | card / panel title |
| `ds-h4` | 21px | header bar title, small headings |
| `ds-tagline` | 21–28px italic | one line under a title |
| `ds-whisper` | 18px italic | asides |
| `ds-body-l/m/s` | 17 / 15 / 13.5px sans | reading / UI / meta |
| `ds-caption` | 13.5px | captions (never smaller) |
| `ds-kicker` | 11px uppercase .2em gold | running heads |
| `ds-label` | 11px uppercase .14em | field and column labels |

Variables: `--type-<name>-size/-line/-weight/-tracking`.

## Space, radius, elevation, motion, layout

- Space: `--space-0,1,2,3,4,5,6,8,10,12,16,24` = 0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 96px.
- Radius: `--radius-none 0, xs 2, sm 3, md 4, lg 6, xl 14, full 999`. Layout blocks stay almost square. Round (full) is for avatars, rings, dots, count badges, buttons, segmented and toast; `xl` is for modals.
- `--white` is the text colour on lacquer.
- Elevation: `--elevation-1` hairline (inset), `-2` lift (hover / cards), `-3` float (nav pill, floating button), `-4` book / modal / sheet.
- Duration: `--duration-instant 120, fast 200, base 350, enter 450, turn 800, slow 1000, scene 1200, sway 7000` (ms). Easing: `--easing-standard`, `--easing-settle` (things arriving), `--easing-turn` (page turn), `--easing-sway`. Reduced motion zeroes them.
- Layout: `--content-max 1280px`, `--reading-max 66ch`, `--gutter clamp(16px, 4vw, 64px)`, `--hit-min 44px`, `--z-base/scene/content/sticky/menu/overlay/toast`, `--icon-s/m/l` (16/20/24), `--icon-stroke 1.6`.
- Breakpoints (in CSS, not variables): 560 phone, 760 rail becomes a sheet, 900 tablet / book stacks, 1100 aside hides, 1200 desktop.

## Texture classes

- `ds-washi` on a `[data-surface]` element: fibres built in (Night: light fibres; Paper: grain + dark fibres). `ds-washi-night` / `ds-washi-paper` force one.
- `ds-grain` on any coloured block (cover, chip, bar, avatar).
- `data-intensity="low|medium|high"` on `<html>`: Low turns Night fibres off and leaves Paper grain only.
