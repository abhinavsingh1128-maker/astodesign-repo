# Translate a product into the theme

Use this in TRANSLATE and VARIANT mode (see the decision tree in
`SKILL.md`). The product\'s structure and behaviour stay; the skin
changes. Build `00-parity-<screen>` first, unless the brief names a specific layout; then build that and say so in the README.

## 1. Anatomy inventory

Look at the reference (or the archetype below) and fill this in the
README. Be literal: count.

  -----------------------------------------------------------------------
  Region            Objects           Actions           States
  ----------------- ----------------- ----------------- -----------------
  left rail         shelves + counts, switch shelf,     current shelf
                    add shelf, tools  edit              

  main              24 covers, 6 per  open,             selected, hover
                    row               batch-select      
  -----------------------------------------------------------------------

Proportions to keep: rail 200--260px, details panel 280--320px, content
max \~1200px, grids at the reference\'s column count (±1).

## 2. Must-keep list

8--12 items a regular user would notice missing within five seconds.
Each gets evidence: the component, class or label in `main.tsx` that
delivers it.

    **Must-keep:**
    - [x] Shelf rail with counts — `RailItem`
    - [x] Cover grid, 6 across — `CoverTile`
    - [x] Toolbar: search, batch edit, stats, view toggle — `Toolbar`, `Segmented`
    - [ ] Real cover art — dropped: no brand art allowed; pigment + title instead

Rules: every item is `[x]` with backticked evidence, or `[ ]` with
`dropped:` and a reason. The linter fails a `[ ]` without a reason and
any evidence name not found in `main.tsx`. If the reference screen works
(filters filter, send sends), your parity layout works too.

## 3. Any product: the eight questions

**For any product, including one nobody has listed:** answer these eight
questions about the screen you are building. The answers are your
anatomy and must-keep list.

1.  **Main object:** what is the one thing this screen is about (a ride,
    a workout, a patient, an invoice, a dish)?
2.  **Primary action:** what does the user come here to do (book, log,
    approve, pay, add)? That is the single primary `Button`.
3.  **Finding:** how do they find the right object (search, filters,
    categories, a map, a date, a list sorted by what)?
4.  **Status:** what state is each object in (pending, live, done,
    overdue, out of stock) and how is \"now\" shown?
5.  **Numbers:** what figures does the user check (price, time,
    distance, count, progress, score)?
6.  **Navigation:** where can they go from here (app sections, back,
    related screens)? Rail, `Nav layout="bar"`, `Tabs`, bottom tabs.
7.  **Feedback:** what confirms an action or warns them (toast, banner,
    inline error, sticky summary bar)?
8.  **Context:** who else is involved (people, avatars, comments,
    assignees, a driver or doctor)?

Then map each answer to a component with the style-to-token table. The
archetype table below is a set of worked examples, **not a list of
supported products**.

## 3b. Archetype examples

When the product is close to one of these, start from its row and add
what the brief names. Frame = what to compose first.

  ---------------------------------------------------------------------------------
  Archetype               Frame                          Must-keep (core)
  ----------------------- ------------------------------ --------------------------
  **Team chat**           `AppShell` + switcher, `Rail`, workspace switcher;
                          aside, main Paper              sidebar: unreads,
                                                         mentions, drafts; channels
                                                         with unread counts; DMs
                                                         with presence; channel
                                                         header (name, topic,
                                                         members, search); stream
                                                         with `Message` (name,
                                                         time, reactions, files,
                                                         threads); `StreamDivider`;
                                                         composer with formatting +
                                                         send; details panel

  **Mail / inbox**        `AppShell`, `Rail` (folders +  compose (primary); folders
                          counts), main Paper            with unread counts; list
                                                         rows (sender, subject,
                                                         snippet, time, unread
                                                         bold, star); bulk select
                                                         toolbar; reading pane or
                                                         sheet; reply/forward

  **Social feed**         Night page, centre column      composer at top; posts
                          \~640px of `Card`s, side       (author avatar, name,
                          columns                        time, body, media,
                                                         like/comment/share with
                                                         counts); comments preview;
                                                         who-to-follow / trends;
                                                         nav with notifications
                                                         count

  **E-commerce listing**  Night page, `Toolbar` + filter search; category
                          `Rail` + grid                  breadcrumbs; filters
                                                         (price, brand, rating)
                                                         with counts; sort
                                                         `Segmented`/select; result
                                                         count; product tiles
                                                         (`CoverTile 1:1`, name,
                                                         price, discount, rating,
                                                         add button); pagination /
                                                         load more; cart count in
                                                         nav

  **Product detail**      Night page, gallery + Paper    gallery with thumbnails;
                          buy panel                      title, rating + count;
                                                         price, MRP struck,
                                                         discount; variant pickers
                                                         (size, colour) as
                                                         `Segmented`/Tags; quantity
                                                         stepper; add to cart
                                                         (primary) + buy now;
                                                         delivery/pincode check;
                                                         description, specs
                                                         `Table`, reviews

  **Cart / checkout**     Paper column + summary `Card`  line items (image, name,
                                                         variant, qty stepper,
                                                         price, remove); coupon
                                                         `Input`; price breakdown
                                                         (subtotal, fees, discount,
                                                         total) `Table`; address;
                                                         payment options; place
                                                         order (primary, sticky on
                                                         phone)

  **Food delivery         Night page, sticky menu        restaurant header (name,
  (restaurant page)**     `Rail`/`Tabs`, Paper menu list cuisines, rating, delivery
                                                         time, distance, cost for
                                                         two); offers strip;
                                                         veg-only toggle + search;
                                                         menu categories with
                                                         counts; dishes
                                                         (veg/non-veg mark, name,
                                                         price, description,
                                                         rating, image,
                                                         ADD/stepper); bestseller
                                                         badge; sticky cart bar
                                                         (items, total, View cart)

  **Dashboard /           `AppShell` (night main)        date range `Segmented`;
  analytics**                                            KPI stat cards (value,
                                                         delta, sparkline); main
                                                         chart (`Bars`); breakdown
                                                         `Table` with sort;
                                                         filters; last-updated
                                                         time; export

  **Settings**            `AppShell`, `Rail` of          sections list (current =
                          sections, Paper main           gold); grouped rows
                                                         (label, description,
                                                         control);
                                                         switches/selects/inputs;
                                                         save (primary) or autosave
                                                         note; danger zone
                                                         (status-error)

  **Docs / editor**       `AppShell`, page tree `Rail`,  page tree; breadcrumb;
                          Paper main \~72ch              title (serif) + body
                                                         (sans) at reading width;
                                                         formatting toolbar; share
                                                         button; comments/aside;
                                                         last edited by/at

  **Map / local search**  split: list Paper left, map    search + filters (open
                          Night right                    now, rating, price);
                                                         result list (name, rating,
                                                         category, distance,
                                                         open/closed); map with
                                                         pins (selected = gold);
                                                         selected-place card;
                                                         directions

  **Form / onboarding**   Paper column ≤ 560px over      step indicator
                          Night                          (`Progress` + \"Step 2 of
                                                         4\"); grouped fields with
                                                         labels and hints; inline
                                                         errors; back (ghost) +
                                                         continue (primary);
                                                         save-and-exit

  **Calendar**            `AppShell`, mini-month in      today button, prev/next,
                          `Rail`                         view `Segmented`
                                                         (day/week/month); time
                                                         grid; events (title, time,
                                                         colour by calendar via
                                                         pigments); create
                                                         (primary); calendars list
                                                         with toggles; event detail
                                                         sheet

  **Booking / travel      Night page, search bar Paper,  search form (from, to,
  search**                results list                   dates, guests); filters
                                                         `Rail`; sort; result cards
                                                         (time, duration, price,
                                                         badges); price calendar
                                                         strip; selected summary +
                                                         continue

  **Media library /       `AppShell mainTone="night"`,   shelves/playlists with
  shelf**                 `Rail` of shelves, `CoverTile` counts; toolbar (search,
                          grid; `Nav layout="bar"` if it sort, view toggle, batch
                          needs a site nav               edit); covers at real
                                                         density; list view as
                                                         `Table`; now-playing /
                                                         currently-reading strip

  **Profile (person)**    Night page, header + `Tabs`    avatar, name, bio, stats
                                                         (followers, books, posts);
                                                         follow/message actions;
                                                         tabs for content types;
                                                         activity list; pinned
                                                         items
  ---------------------------------------------------------------------------------

## 4. Style-to-token map

  -----------------------------------------------------------------------
  In the reference                    In Astodesign
  ----------------------------------- -----------------------------------
  Page background (white, cream,      `Surface tone="night" backdrop` or
  grey, brand)                        `AppShell`

  White content panes, cards, message Paper (`mainTone="paper"`, `Card`,
  area                                `Surface tone="paper"`)

  Brand-colour primary button         charcoal `Button` (one per view)

  Secondary / outline buttons         `Button variant="secondary"`; text
                                      links and inline actions
                                      `variant="ghost"`

  Links                               `--text-secondary`, underline on
                                      hover

  Active nav item / current row       gold: `Nav` active,
  (bold, tint)                        `RailItem current`, `Tabs`,
                                      `Table selectedKey`

  Top bar with logo, many links,      `Nav layout="bar"`; search and
  search, icons                       avatar in `end`

  Selected chip / filter / toggle     lacquer: `Tag pressed`,
  option / batch-selected item        `Segmented`, `CoverTile selected`

  Unread / notification badge         sakura: `RailItem unread count`, a
                                      sakura dot

  \"New\", \"Bestseller\", highlight  gold `Tag variant="accent"`
  label                               

  \@mention, highlight                `Mention`

  Success / error / warning           `--status-success`,
                                      `--status-error`; `Banner tone`

  Icons in nav / buttons              uppercase text labels; `#` and
                                      presence dots in rails. No icon
                                      font, no emoji

  Emoji reactions                     text `Reaction` chips (`+1 3`,
                                      `Done 1`)

  Product photos, cover art, dish     `CoverTile` (pigment + grain +
  images                              serif title); `src` only for the
                                      user\'s own images

  Star ratings                        `★` glyphs in lacquer on Paper /
                                      gold on Night with a number (\"4.3
                                      · 2.1k\")

  Price, discount                     sans tabular figures; struck MRP in
                                      `--text-muted`; discount as
                                      `Tag variant="accent"`

  Veg / non-veg, stock, status dots   small square or dot in
                                      `--status-success` /
                                      `--status-error`, always with a
                                      text label for screen readers

  Promo strip / notice                `Banner`

  Toolbars                            `Toolbar` + ghost small buttons +
                                      `Segmented`

  Data tables                         `Table`

  Charts                              `Bars`, `Ring`, `Progress`;
                                      anything else per `patterns.md` →
                                      Monitor

  Drop shadows, pill shapes, big      none at rest; 3--4px radii
  radii                               

  Brand sans headings                 Cormorant for titles and names
                                      only; body stays sans

  Bottom tab bar (mobile app)         `patterns.md` → Bottom tabs

  Sticky bottom CTA / cart bar        charcoal bar with grain,
  (mobile)                            `--elevation-2`, safe-area padding
                                      (`patterns.md` → Sticky action bar)

  Toggles, checkboxes, steppers,      `patterns.md` recipes
  selects                             

  Maps                                `patterns.md` → Map: Night grained
                                      panel with hairline streets, gold
                                      pins. Never a third-party tile in
                                      brand colours
  -----------------------------------------------------------------------

## 5. Variants keep the anatomy

A variant changes one axis: the main object (thread, inbox item, book,
review, dish), who acts first, the input device (keys, touch, voice),
the time frame (now / today / year), or density. It reuses the parity
layout\'s data and components and keeps every must-keep item (it may
move one; say where). If a variant needs to drop a must-keep, it is not
a variant.

## 6. Compare

`python3 skills/astodesign/scripts/compare.py <reference> <your-desktop.png> <out.png>`
and look at the pair. In the README write **Kept / changed on purpose /
dropped and why**. Put back anything you dropped that is on the
must-keep list.

## Brand rule

Copy structure and behaviour, never identity: no logos, product names,
wordmarks, brand colours, real cover or product art, or marketing copy
from the reference. Neutral product name (Yomu, Hearth, Tiffin...).
Real-world content is fine (real book titles, real dishes); use your own
set rather than the reference\'s exact items.
