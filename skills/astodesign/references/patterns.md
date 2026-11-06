# Extending the system: patterns the portfolio never had

> **Components first.** These now exist as real components (see
> `components.md`) and replace the hand-built recipes further down:
> `AppShell`, `Rail` (channel sidebar, shelves, settings sections),
> `Message`/`Mention`/`StreamDivider` (message row),
> `Toolbar`/`Segmented`, `Tabs`, `Banner` (inline notice, promo),
> `CoverTile` (shelf, product tile, dish), `Ring`/`Bars`/`Progress`,
> `Table`, `Toast`. Use a recipe below only for what has no component:
> switch, checkbox, quantity stepper, select, star rating, price block,
> veg mark, stat card, bottom tabs, sticky action bar, map, calendar
> grid, command palette.

The portfolio is built for reading. Products also need to chat, track,
compare and act fast. Use the recipes below; each is built only from
existing tokens. When you need something not listed, follow the rules
first.

## Extension rules (apply to anything new)

1.  **Start from the nearest existing component** and change as little
    as possible.
    -   A message is a `ListItem` that lets its text wrap.
    -   A stat is a `Card variant="plain"`.
    -   A tab bar is the Nav\'s link style without the pill.
2.  **Pick the surface by the job.** Things you read for a while go on
    Paper. Things you scan, navigate or monitor can stay on Night.
3.  **Density ladder.** Comfortable (portfolio default) → Compact →
    Dense.
    -   Compact: rows padded 8--10px, sans titles, `caption` meta.
    -   Dense: 4--6px rows, 13.5px body, no avatars on repeated rows.
    -   Never shrink labels below 10.5px or body below 13.5px.
4.  **Serif budget.** Per screen: one serif display line, serif for
    names and titles in lists, and nothing longer than about 12 words in
    the serif. Messages, reviews and descriptions use the sans.
5.  **Colour budget.**
    -   One gold mark per region (the current item).
    -   Lacquer for selected or mentioned.
    -   Sakura for unread or new.
    -   Status colours only for status.
    -   New hues are never allowed. A product with categories uses the
        cover colours, not new UI colours.
6.  **Shape.**
    -   New containers use `--radius-sm` or `--radius-md`. Pills and
        full radius are only for avatars, progress rings, presence dots
        and count bubbles.
    -   Dividers are 1px `--border-subtle`, never boxed borders around
        every item.
7.  **Elevation.** New floating things (popover, toast, palette) use
    Elevation 2. A full takeover uses the Modal (Elevation 4). Nothing
    has a shadow at rest.
8.  **Motion.** Arrivals use `--duration-enter`/`--easing-settle` with a
    short rise. Feedback uses `--duration-fast`. Never animate layout in
    a dense stream (no sliding messages). Fade only.
9.  **Name it.** Prefix the layout\'s own classes (e.g. `.msg-`,
    `.shelf-`) and list each new pattern in the layout README.

## Converse: chat and comment streams

### Message row

Use `<Message>` (with `grouped`, `reactions`, `attachments`, `thread`,
`actions`), `<Mention>` and `<StreamDivider>`. See components.md.

### Composer

Sits in `--bg-sunken` at the bottom of the thread on the same surface,
with `--radius-md`. Use a compact `Input multiline hideLabel` (2--8 rows
auto) and, on the right, a small primary `Button` \"Send\". The toolbar
row above uses ghost icon buttons (20px line icons).

    .composer { margin: var(--space-3) var(--space-4) var(--space-4); padding: var(--space-3); border-radius: var(--radius-md); background: var(--bg-sunken); box-shadow: var(--elevation-1); }
    .composer:focus-within { box-shadow: inset 0 0 0 2px var(--focus); }

### Threads panel

A right-hand Paper panel (`Surface tone="paper"`) about 380--440px wide.
It has a kicker (\"Thread\"), a serif title (the channel name), the
parent message, a hairline, then the replies and their own composer. On
phones it becomes a `Modal as="sheet"`.

### Channel sidebar

Use `<Rail>` / `<RailSection>` /
`<RailItem lead="#" unread count current>` inside `<AppShell sidebar>`.

### Presence and typing

`Avatar online` for presence. The typing line is a `ds-caption` in
`--text-muted` italic sans (\"Ritu is typing...\").

## Browse: grids and shelves

### Book or product shelf (covers instead of 4:3)

Use `<CoverTile>` in a grid:
`grid-template-columns: repeat(auto-fill, minmax(120px, 1fr))` for books
(about 6 across at 1280), `minmax(180px, 1fr)` for products and dishes.
Pigments from `PIGMENTS`; no shadow at rest (the tile lifts on hover by
itself).

### Filters

A `ds-row` of `Tag onClick pressed count`. For more than 7 options, show
the top 5 and a `Tag variant="outline"` \"More\" that opens a sheet.

### Long lists (hundreds of rows)

-   Use `List density="compact"`.
-   Add a sticky header row in `ds-label` caps
    (`position: sticky; top: 0; background: var(--bg-canvas)`).
-   Keep 13.5px sans meta.
-   Don\'t animate entries.
-   Virtualize past about 200 rows.

## Monitor: stats, progress, data

### Stat card

    <Card variant="plain" compact kicker="Pages this year" title={<span className="ds-display-l">8,412</span>} summary="↑ 1,240 on last year" />

The number is in the serif (it is a display line). The label is a
kicker. The change is a `body-s` line. Use `--status-success` only for
the arrow.

### Progress ring (the moon)

Use `<Ring value max label>`.

### Bar or month chart

Use `<Bars data label>` (gold bars, sakura for the current one). Lines
and stacked charts: same colours, hairline axes, labels in `ds-caption`.

### Table

Use
`<Table columns rows rowKey caption sort onSort onRowClick selectedKey>`.

## Do: forms and flows

-   **Short forms:** use the Modal or a Paper panel, with underline
    inputs.
-   **Steps:** a row of `ds-label` items joined by hairlines. The
    current step is gold with an underline; done steps are
    `--text-secondary` with a ✓. This is the same idea as the Nav
    underline.
-   **Settings:** a Paper surface with `List` rows. The trailing slot
    holds a switch, a `Tag` or the value text.
-   **Done / completed state:** the check box (26px, `--radius-sm`)
    fills with `--accent-lacquer` and a white ✓, and the item\'s title
    drops to `--text-secondary`. Never use gold for \"done\": gold means
    *current*. Progress *towards* a goal is gold; a finished item is
    lacquer.
-   **Switch:** 36×20 track, `--radius-full`. Off is `--border-subtle`;
    on is `--accent-gold` with an `--ink-900` knob.

## Navigation inside a page

-   **Tabs:** use `<Tabs>`.
-   **Table of contents / side index:** a list of `ds-label` links with
    a 3px left rule. The current one is gold, which copies the
    case-study contents. It is good for long profiles.
-   **Breadcrumb:** `ds-body-s`, separated by \"/\", with the current
    item in `--text-primary`.

## Keyboard-first UI

-   **Command palette:**
    -   A Paper panel at the top third, 560px wide, Elevation 4,
        `--radius-md`.
    -   Search is a compact `Input hideLabel`; results are a compact
        `List` with the selected row as the gold rule.
    -   Grouping uses `ListSection`. A footer of key hints in
        `ds-caption`.
-   **Key hint** `kbd`**:**

```{=html}
<!-- -->
```
-   kbd { font: 700 10.5px/1 var(--font-sans); letter-spacing: .04em; padding: 3px 6px; border-radius: var(--radius-xs); box-shadow: var(--elevation-1); color: var(--text-secondary); background: var(--bg-raised); }

```{=html}
<!-- -->
```
-   **Focus is the selection:**
    -   Use roving `tabindex` in lists.
    -   The current row shows the gold rule *and* the focus ring.
    -   Show shortcuts next to actions in `kbd`.

## Feedback

-   **Toast:** use `<Toast>`. (Spec: bottom centre, `--z-toast`, a
    charcoal (`--action-bg`) block with white sans 13.5px,
    `--radius-sm`, Elevation 2. It enters with a 12px rise,
    `--duration-enter`. One action at most, as a gold ghost text
    button.)
-   **Inline notice:** `--bg-sunken` box with a 3px left rule in the
    status colour and a sans body.
-   **Loading:** a skeleton of `--bg-surface` blocks with the real
    radii; no spinners on content. For a full-screen wait, use the
    portfolio\'s \"LOADING n%\" kicker on Night.

## Motifs (one per screen, as an accent)

  ----------------------------------------------------------------------------------------
  Motif                   Use as                  How
  ----------------------- ----------------------- ----------------------------------------
  Moon                    progress, empty state,  `EmptyState` moon or the progress ring,
                          \"complete\"            gold

  Lantern                 notification and unread a 6--8px sakura/gold dot with a soft
                          glow                    `box-shadow: 0 0 12px` of the same
                                                  colour

  Cat                     helper, onboarding      crop of
                          hint, 404               `design-system/assets/scene-night.svg`
                                                  or a simple black silhouette; one line
                                                  of `ds-whisper` text (\"psst... press /
                                                  to search\")

  Sakura petal            new or favourite        `--accent-sakura` dot or small petal
                                                  shape

  Gold rule               under any page title    `<hr className="ds-rule" />`

  Washi grain             every surface           automatic on Paper, cards, modals,
                                                  tables, covers, the Night backdrop;
                                                  `className="ds-grain"` on anything
                                                  coloured you build
  ----------------------------------------------------------------------------------------

Never place two motifs in the same region, and never put motifs behind
text.

## Controls with no component (copy these, tokens only)

    /* Switch: 36x20, gold = on (it is a "current" state) */
    .x-switch { position: relative; width: 36px; height: 20px; border: 0; border-radius: var(--radius-full); background: var(--border-subtle); cursor: pointer; transition: background-color var(--duration-fast) var(--easing-standard); }
    .x-switch::after { content: ""; position: absolute; top: 3px; left: 3px; width: 14px; height: 14px; border-radius: var(--radius-full); background: var(--text-primary); transition: transform var(--duration-fast) var(--easing-standard); }
    .x-switch[aria-checked="true"] { background: var(--accent-gold); }
    .x-switch[aria-checked="true"]::after { transform: translateX(16px); background: var(--ink-900); }
    /* <button role="switch" aria-checked={on} aria-label="Veg only" className="x-switch" /> plus a visible text label */

    /* Checkbox: 20px, lacquer when checked (selected / done) */
    .x-check { appearance: none; width: 20px; height: 20px; margin: 0; border-radius: var(--radius-sm); box-shadow: inset 0 0 0 1.5px var(--border-strong); background: transparent; cursor: pointer; display: inline-grid; place-items: center; }
    .x-check:checked { background: var(--accent-lacquer); box-shadow: none; }
    .x-check:checked::after { content: "✓"; color: var(--action-text); font: 700 13px/1 var(--font-sans); }

    /* Quantity stepper (cart, menu ADD): charcoal block, 3px corners */
    .x-stepper { display: inline-flex; align-items: center; height: 34px; border-radius: var(--radius-sm); background: var(--action-bg); color: var(--action-text); font: 700 var(--type-label-button-size)/1 var(--font-sans); }
    .x-stepper button { width: 32px; height: 100%; border: 0; background: none; color: inherit; font: inherit; cursor: pointer; }
    .x-stepper output { min-width: 22px; text-align: center; font-variant-numeric: tabular-nums; }
    /* At zero, show one charcoal "ADD" Button size="sm" instead. Both buttons need aria-labels ("Remove one Paneer tikka"). */

    /* Select: the native element, styled like the compact Input */
    .x-select { appearance: none; min-height: 34px; padding: 6px 28px 6px 0; border: 0; border-bottom: 1px solid var(--border-subtle); border-radius: 0; background: transparent; color: var(--text-primary); font: 400 var(--type-body-s-size)/1.3 var(--font-sans); cursor: pointer; }

-   **Star rating:** `★` glyphs, `--accent-lacquer` on Paper,
    `--accent-gold` on Night, empty ones `--border-strong`. Always pair
    with the number: `4.3 · 2.1k ratings` in `ds-caption`. In tight rows
    show `★ 4.3` only.
-   **Price block:** current price in sans 700 tabular figures; MRP
    struck through in `--text-muted`; discount as
    `<Tag variant="accent">20% off</Tag>`. Currency symbol stays with
    the number (`₹209`).
-   **Veg / non-veg / stock mark:** a 12px square with a 1.5px border
    and a 6px centre dot in `--status-success` (veg) or `--status-error`
    (non-veg), with `aria-label`. Never colour alone: the dish name also
    carries \"(veg)\" for screen readers.
-   **Stat card:** `Card variant="plain" compact` with kicker (metric
    name), serif value (`ds-h2`), and a delta line in `ds-caption`:
    `▲ 12% vs last week` in `--status-success`, `▼` in `--status-error`.

## App chrome

-   **Sticky action bar (mobile cart, checkout, compose):** fixed
    bottom, full width, `--action-bg` with `className="ds-grain"`,
    `--elevation-2`, padding includes `env(safe-area-inset-bottom)`.
    Left: summary (`2 items · ₹627`); right: one gold ghost action
    (`View cart →`). On desktop it becomes a right-hand summary `Card`.
-   **Bottom tabs (phone apps):** 4--5 uppercase text labels (no icons),
    `--type-label-tag-size`, on a Night bar with grain; current tab gold
    with a 2px top rule. Hide the top `Nav` links when bottom tabs
    exist.
-   **Sticky category index (menus, long settings, docs):** a `Rail`
    (desktop) or horizontal `Tabs` (phone) that tracks the section in
    view (IntersectionObserver), current = gold.
-   **Map:** a Night panel with `ds-grain`; streets as hairline
    `--border-subtle` SVG paths; pins as 10px dots in `--text-primary`,
    selected pin gold with a soft glow (the lantern motif). Selected
    place shows as a Paper `Card` on top. Never embed third-party tiles
    in their brand colours; if a real map is required, use a
    dark/greyscale style and say so.
-   **Calendar grid:** time labels in `ds-caption`, hour lines
    `--border-subtle`, today\'s column header gold; events are grained
    pigment blocks (`ds-grain`, `--radius-sm`) with sans title and time,
    one pigment per calendar from `PIGMENTS`. Now-line: 2px sakura.
