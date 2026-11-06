---
name: astodesign
description: Design and build any interface (app screens, product layouts, prototypes, a known product reskinned) in Abhinav Singh Tomar's Astodesign system, the night-teal and washi-paper language of astodesign.com. Use it whenever asked for a UI, a product screen, a "copy/alternative of X", or several layout options "in my style" / "in Astodesign" / with this repo's design-system, including products the system was never designed for.
---

# Astodesign: build any product in this system

**The look:** a deep Night teal page with washi grain, content on washi Paper, Cormorant Garamond for titles and names over a plain sans for everything read in bulk, almost-square corners, **gold = where you are** (current nav, tab, row; progress; the gold `Tag variant="accent"` for a highlight like "Bestseller"), **lacquer red = selected / mentioned / done**, **sakura = unread or now** (unread counts, the current bar in a chart). Nothing is ever a flat, grainless block of colour.

**Source of truth:** the Figma file *Astodesign — Design System* (`figma.com/design/gWtwt2oDOQM8KbBNiCARFo`): pages Foundations, Illustration, Components. Figma variable names map 1:1 to CSS tokens (`text/primary` → `--text-primary`, `night/700` → `--night-700`). The code in `design-system/` implements it. **Never re-create tokens or components by hand, and never edit `design-system/` to make one layout work.**

**First:** if your project has no `design-system/` folder, do **Setup** (near the end of this file) before anything else. The skill ships the whole system in `bundle/`.

**The system is a theme layer, not a product.** A Slack alternative must still look and work like a team chat; a book profile must still have shelves and covers. Your job is to keep the product's anatomy and change its skin, then (if asked) vary the idea.

## Step −1: ask before building (two questions, one backup)

Ask in **one** message, all multiple choice, each with a default (in Claude Code use one AskUserQuestion card). Skip any question the brief already answers.

1. **Reference?** "Do you have a reference to paste (a link or an image)?" Options: *Paste a link or image* / *No reference*. Default: none.
2. **Theme intensity?** "How strongly should Astodesign show?" Options:
   - *Low*: tokens and format only
   - *Medium* (recommended): the essence, but the theme shouldn't take over
   - *High*: follow it like a rule

   Default: **Medium**. The exact rules for each level are in `references/intensity.md`.
3. **Backup, only if the brief doesn't make it clear:** "Main device?" Options: *Both, desktop first* (default) / *Phone first* / *Desktop only*.

**If nobody answers** (an unattended run, or the brief says "don't ask"): use no reference, Medium, and both devices desktop-first. Say so in the first line of your reply and in each layout README.

**Using a reference:**
- Take its **structure only**: what regions it has, which objects and actions, the order, how dense it is. Add those to the anatomy and must-keeps.
- **Never** take its look (colours, fonts, logos, illustration, copy). The look always comes from this system at the chosen intensity.
- If the reference is an image, list what you counted on it in the README.

## Step 0: pick the mode (decision tree)

```
Does the brief come with a screenshot / URL, or name a product people know
("a Slack alternative", "like Goodreads", "a Swiggy restaurant page")?
├── YES ─▶ TRANSLATE. Build 00-parity-<screen> first: same regions, same must-keeps, all working.
│          Asked for several layouts / options? ─▶ then VARIANT on top of the parity layout.
└── NO ──▶ Is it a recognisable category (chat, shop, dashboard, settings, feed, docs, map, form,
           calendar, mail, booking, media library, profile, delivery…)?
           ├── YES ─▶ TRANSLATE THE ARCHETYPE: use that category's must-keep list from
           │          references/translate-a-product.md as the "reference". Then VARIANT if asked.
           └── NO ──▶ DERIVE: answer the eight questions (Step 1). The answers are your anatomy
                      and must-keeps; build it like a parity layout. Then VARIANT if asked.
```

- **TRANSLATE** = faithful. You may not drop a must-keep; you may not invent a new concept.
- **VARIANT** = one idea changed (main object, who acts first, input device, time frame, density). Every variant still has every must-keep, maybe moved. A variant that loses must-keeps is a different product: wrong.
- **DERIVE** = a product nobody has listed (most new briefs). The eight questions replace the reference; everything else is the same as TRANSLATE. The product names in this skill are examples only: the method, components and rules apply to any product.

**Before building:** check `products/*/00-parity-*` for a parity layout of the same product or screen. If one exists, read its README and reuse its must-keep list and data instead of starting over.

## Step 1: the eight questions (works for any product)

Whatever the brief is (a ride app, a clinic queue, a fitness log, a CRM), answer these about the screen before any code. The answers are its anatomy and must-keep list.

1. **Main object:** what is this screen about (a ride, a workout, a patient, an invoice, a dish)?
2. **Primary action:** what does the user come here to do (book, log, approve, pay, add)? That is the one primary `Button`.
3. **Finding:** how do they find the right thing (search, filters, categories, map, date, sort)?
4. **Status:** what state is each item in (pending, live, done, overdue, sold out), and how is "now" shown?
5. **Numbers:** what figures do they check (price, time, distance, count, progress, score)?
6. **Navigation:** where can they go from here? (`Rail`, `Nav layout="bar"`, `Tabs`, bottom tabs)
7. **Feedback:** what confirms or warns (`Toast`, `Banner`, inline error, sticky summary bar)?
8. **Context:** who else is involved (people, assignees, comments, a driver or doctor)?

Map each answer to a component (Step 2) using the style-to-token table in `references/translate-a-product.md`. With a screenshot, also count what is on it. If the product matches an example in that file, start from its row.

## Step 1b: write the anatomy before any code

In the layout README (template has the fields):

1. **Anatomy:** a short table, region → objects → actions → states. Count what is on the reference screen. **NEW:** include regions that only appear on hover, click or scroll (mega menus, dropdowns, tooltips, sticky bars). They are part of the screen even if a screenshot doesn't show them.
2. **Must-keep:** 8–12 items a regular user would miss in five seconds, each with the component or class that delivers it in backticks: `- [x] Channel list with unread counts — \`RailItem\``. The linter checks every backticked name appears in `main.tsx`.
3. **Translation:** reference style → system token, one line each (`references/translate-a-product.md` has the full map).

## Step 2: compose from components, in this order

1. **Frame.**
   - Any screen with a **side rail** (chat, mail, dashboards, settings, editors, calendars, **and shelf/catalogue pages with a filter or shelf rail**): `AppShell` with `Rail` (+ `switcher`, `aside`). Use `mainTone="night"` for grids and dashboards, `"paper"` for streams, forms and docs. AppShell is the only frame that turns the rail into a phone sheet; don't hand-build that.
   - Pages with no rail (product detail, profile, landing, article): `Surface tone="night" backdrop` + `Nav` + `ds-container`.
   - **Nav:** `layout="bar"` for products (brand left, 4+ links, search, notifications, avatar on the right). The default centred pill is for the portfolio and ≤ 4 links; it collides with a search box.
2. **App components:** `Rail/RailSection/RailItem`, `Toolbar/ToolbarDivider/Segmented`, `Tabs`, `Banner`, `Message/Mention/StreamDivider`, `CoverTile` (2:3, 1:1, 4:3), `Ring/Bars/Progress`, `Table`, `Toast`.
3. **Core components:** `Surface, Scene, Nav, Button, Tag, Avatar, Input, Card, List/ListItem/ListSection, Modal (`variant`: dialog, wide, sheet, sheet-left), EmptyState`.
4. **Classes:** `ds-display-xl/l`, `ds-h2/3/4`, `ds-kicker`, `ds-tagline`, `ds-caption`, `ds-label`, `ds-rule`, `ds-container`, `ds-stack`, `ds-row`, `ds-enter`, `ds-grain`.
5. **Only then** your own CSS in the layout's `styles.css`, with a prefix (`.fd-…`), tokens only. You may adjust a system class only when scoped under your prefix (`.fd-cart .ds-btn--sm { … }`), never globally, and write it in the README as a system tension so it can be fixed in the system. Recipes for things with no component (switch, checkbox, quantity stepper, select, bottom tab bar, map, calendar grid) are in `references/patterns.md`.

Props and snippets for every component: `references/components.md`. Gaps already met and their agreed fixes: `references/findings.md`.

## Step 3: surfaces, grain and density

- **Night** (`backdrop`, or `AppShell`) for pages, rails, shells, things you scan. **Paper** for what is read or written: streams, forms, tables, reviews, cards, modals. Never alternate Night/Paper more than twice across a screen.
- **NEW: item info under a cover goes on Paper.** A product, dish or book tile = `CoverTile` on top, then name, price and meta on a Paper block (`Card` or `Surface tone="paper"`), never straight on Night.
- **NEW: promos and notices are `Banner tone="note"`** (Paper with a lacquer rule), also when they run full width at the top of the page. Never a solid lacquer, gold or sakura bar.
- **Washi texture everywhere, built into each surface, with fibres.** The portfolio's washi has two layers: a cloudy grain and **faint fibre lines**.
  - Night surfaces show light fibres (`washi-glow`, screen blend).
  - Paper surfaces show the grain plus faint dark fibres (`washi-paper` + `washi-fibre-ink`).
  - Paper, Card, Modal, Sheet, Page, Table, Banner and CoverTile have this built in. A Night page or shell gets `className="ds-washi"` (or uses `backdrop`/`AppShell`).
  - If you can't see fibre lines in your screenshot at 100%, the texture is missing; fix that before anything else. Any coloured block you make gets `className="ds-grain"`. A flat colour block with no grain is a bug (the screenshot check flags it). **NEW: never lay one grain overlay over the whole page** (a fixed full-screen layer): it covers modals and text and fakes the texture instead of building it in.
- **Counts are computed from your data** (a shelf says 12 if 12 books are on it), so filters stay true. Use enough records to look real; don't print the reference's 356.
- **Density matches the real product.** Chat streams, shelves, menus, tables are dense: 20+ covers, 4+ messages with reactions and files, full menus. Use `List compact`, `Table density="compact"`; drop avatars on repeated rows before you shrink text. Never below 13.5px body / 10.5px labels.
- **Illustration:** at most one `<Scene>` per screen, only for a hero or first-run moment, never behind dense UI.

## Step 3c (NEW): the book and page display

The portfolio's About, Research and Contact pages are **open books**: two Paper pages with a spine, a running head, page numbers, "← Flip back" on the left page and "Next →" on the right, and a page-turn animation. It is the system's strongest signature. Use `Book`, `Spread` and `Page` (see `references/book.md`) when content is **sequential and personal**, such as a profile, a story, onboarding, a long review, a year in review or a portfolio.
- **Never** use it for live streams, chat, tables, dashboards or anything scanned quickly.
- **Low:** no book.
- **Medium:** at most one flow in book form, for example "read the whole review" or the profile's year in reading.
- **High:** the book can be the main structure of the product.
- **Phones:** one page at a time; the turn becomes a fade.

## Step 3b (NEW): behaviour rules

- **One apply model per filter set.** Either every filter applies live (checkboxes, price, chips), or all of them wait for one Apply. Never mix. On a phone sheet, the close button says what you'll get: "Show 12 chairs".
- **Nothing important is hover-only.** Anything that appears on hover (Quick view, row actions, mega menus) must also open on click or tap and be visible on touch screens (`@media (hover: none)`).
- **Modals and sheets** move focus in, trap Tab inside, close on Esc and on the scrim, and return focus to the control that opened them. `Modal` does all of this for you; your own popovers must do the Esc, outside-click and focus parts themselves.
- **Mega menus and dropdowns** open on click (and hover on pointer devices), close on Esc and on an outside click, and become inline lists in the phone menu.
- **Empty results** say what happened and offer the fix ("No chairs match. Clear all filters.").

## Step 4: build and check (every layout)

```
node skills/astodesign/scripts/new-layout.mjs <product> <NN-slug> "<one-line idea>"   # scaffold
node scripts/build.mjs products/<product>/<NN-slug>                                    # builds just this layout (npm run build = everything)
node skills/astodesign/scripts/check-layout.mjs products/<product>/<NN-slug>           # 0 errors required
node skills/astodesign/scripts/shoot.mjs <product>/<NN-slug> shots/<product>           # 1280, 1100, 390: overflow, overlaps, flat blocks, density
python3 skills/astodesign/scripts/compare.py <reference.png> shots/<product>/<product>-<NN-slug>-desktop.png shots/<product>/compare.png   # only with a reference; needs Pillow
```

**If `shoot.mjs` can't launch:** it tries Playwright's browser, then an installed Chrome. If neither exists, run `npx playwright install chromium` or say plainly that the screenshots were not taken.

**The source wins.** If `references/components.md` and `design-system/components/*.tsx` ever disagree, follow the source and note it in System tension. `node skills/astodesign/scripts/check-docs.mjs` compares them.

**The scripts miss a lot:** they don't see collapsed elements, awkward wrapping, or anything below the fold inside `AppShell`, because panes scroll inside the viewport. Scroll, click and screenshot those states too.

**Look at every screenshot yourself**, and click through what shoot.mjs can't see (menus, sheets, modals, the phone rail). Then go through `references/identity-checklist.md`. The serif (Cormorant Garamond) loads from Google Fonts; if the network is blocked it falls back to Georgia, so shapes and spacing are right but the serif looks plainer. Say so when you report screenshots taken offline; if the build cannot run at all, write the layout anyway and say plainly it was not built.

## Step 5: README and choosing

README fields (template): Idea, **Intensity (Low/Medium/High, and whether you were asked or assumed it)**, **Reference (structure taken, or none)**, Mode, Shape, Anatomy, Must-keep (with evidence), Translation, Surfaces, New patterns (with tokens), Kept / changed / dropped (vs the reference), Gives up, System tension. When asked which layout to take forward: pick one, two sentences, in terms of the user's main job and where the system holds up.

## Hard rules (⚙ = the linter or screenshot check enforces it)

- ⚙ Only semantic tokens; the six cover pigments (`PIGMENTS`) are the single raw-colour exception. ⚙ No flat colour blocks without grain.
- ⚙ Only token fonts. Serif for titles, names, display lines ≤ ~12 words; sans for messages, reviews, descriptions, anything long. ⚙ Nothing under 10.5px (labels) / 13.5px (body). **NEW: this includes captions, legal lines, utility links, footer text, brand sublines and the "+ N more" meta under tiles.**
- ⚙ Radii from `--radius-*`; layout blocks almost square, with round for avatars, rings, dots, count badges, buttons, segmented and toast. ⚙ No shadow at rest in your own CSS (Elevation 2 on hover/float, 4 for modal/sheet).
- ⚙ One `<Scene>` per screen. ⚙ Every `Input` labelled. ⚙ README complete; ⚙ every must-keep has evidence in code.
- **One primary `Button` per view.** A view is what is on screen at once: the page around the fold, a modal, a sheet. **NEW: actions repeated on every tile or row (Add, Quick view, Edit) are `variant="secondary"` or `"ghost"`, never primary.** Back/cancel is ghost ("← Flip back"). A read-only Modal passes only a ghost close action (or none); it doesn't need a primary.
- **Colour jobs (NEW: with the cases agents get wrong):**

  | Colour | Means | Never |
  | --- | --- | --- |
  | Gold | Current (nav, tab, row), progress towards a goal, highlight tag | Promo bars, decoration, warnings, a finished item |
  | Lacquer | Selected, mentioned, done (checked filter, pressed chip, completed task) | Promo or sale bars, page backgrounds |
  | Sakura | Unread or new (unread count, "now" bar in a chart) | Cart counts, stock notes, warnings |
  | `status-*` | Success, error, warning only | Categories, decoration |

  No count badge shows 0; hide it. A cart count is a neutral Paper badge. No new hues, no icon font, no emoji as UI.
- Copy a reference's structure and function, never its identity: no logos, product names, brand colours, real cover art or marketing copy. Use a neutral name. Real-world content (book titles, dish names, cities) is fine and encouraged; just don't copy the reference's exact items or promo wording.
- Motion from `--duration-*` / `--easing-*` only; fades (not slides) in dense streams; respect reduced motion.
- Real buttons and links, visible focus, 44px touch targets for your own controls (`Tag`, `Segmented` and reactions are 32px by design; the screenshot check flags under 32px), 390px wide with no sideways scroll, sidebars become sheets.
- Real content only (names, titles, prices, times). No lorem ipsum.

## Setup: this skill folder is self-contained

The skill ships the whole system in `bundle/` (the `design-system/` code, fonts, washi texture, build scripts) and a one-file CSS in `bundle/standalone/`. Pick the first case that fits; never hand-build lookalike components.

1. **The project already has `design-system/`** (the repo this skill came from): use it. Run everything from the project root.
2. **You only have this skill folder** (installed in `~/.claude/skills/astodesign` or uploaded): set up a project once, then follow the steps as written.

   ```
   mkdir -p my-project && cd my-project
   cp -r <this-skill-folder>/bundle/. .              # design-system/, scripts/, package.json, tsconfig.json
   mkdir -p skills && cp -r <this-skill-folder> skills/astodesign   # so skills/astodesign/scripts/* paths work
   npm install                                        # offline: scripts/build.mjs falls back to /opt/npm-tools
   ```

3. **You can write files but can't run Node/React** (an HTML-only artifact, a plain web page): link `bundle/standalone/astodesign.css` (keep its `assets/` folder beside it) and write plain HTML with the `ds-` classes. For the exact markup and class names each component renders, read its source in `bundle/design-system/components/*.tsx`. Say in the README that it is the standalone CSS, not the React build.
4. **You only have the text of this skill, no files** (pasted into a chat, a document): you cannot meet "use the real components". Ask for the skill folder (zip of `skills/astodesign/` including `bundle/`). If the user wants to go on anyway, do Steps 0–1b and the layout ideas in text, and mark any visual you make as an approximation built from `references/tokens.md`.

Maintainers: after changing `design-system/`, run `node skills/astodesign/scripts/sync-bundle.mjs` so `bundle/` stays current.

## Reference files

| File | Read when |
| --- | --- |
| `references/intensity.md` | Always: what Low / Medium / High allow (read after the questions) |
| `references/book.md` | Content is sequential/personal, or intensity is High |
| `references/translate-a-product.md` | Always for TRANSLATE and VARIANT: archetype must-keeps, the style-to-token map |
| `references/components.md` | Composing a screen (every prop, with snippets) |
| `references/patterns.md` | Something has no component: switch, stepper, select, bottom tabs, map, calendar, motifs |
| `references/findings.md` | Something does not fit; gaps already met and the agreed fix |
| `references/layout-ideas.md` | Asked for several layouts (VARIANT mode) |
| `references/tokens.md` | Writing any CSS |
| `references/identity-checklist.md` | Before finishing |
| `scripts/` | `new-layout.mjs`, `check-layout.mjs`, `shoot.mjs`, `compare.py` |
| `examples/` | A worked layout (habits ledger) with its README and screenshot |
