# Components

Import everything from the design system (path from a layout folder
`products/<p>/<layout>/main.tsx`):

    import { Surface, Scene, Nav, Button, Tag, Avatar, Input, Card, List, ListItem, ListSection, Modal, EmptyState } from '../../../design-system';

Importing the package loads `tokens.css`, `base.css` and
`components.css`. Class names all start with `ds-`; you can use them
directly on plain elements when a component is too much.

## Surface

    <Surface tone="night">…</Surface>                 // default page
    <Surface tone="paper" texture>…</Surface>         // washi paper with grain
    <Surface tone="night" backdrop>…</Surface>        // soft night-shade gradient behind dense content (no image)

Props: `tone: 'night' | 'paper'`, `texture?`, `backdrop?`, `as?`
(`div | section | main | aside | header | footer`), plus normal HTML
props. Nest Paper inside Night for panels, and Night inside Paper for a
dark sidebar.

## Scene

The full illustration. One per screen, for hero/first-run moments.

    <Scene nav={<Nav items={items} />} height="100svh">
      <h1 className="ds-display-xl">Good evening, Kavya</h1>
      <p className="ds-whisper">/Konbanwa/</p>
      <hr className="ds-rule" />
      <Button float>Continue reading</Button>
    </Scene>
    <Scene quiet height="60vh">…</Scene>   // blurred, dimmed: sign-in, empty states

Children render centred in the sky. Keep sky content short: title, rule,
one line, at most two buttons.

## Nav

    <Nav items={[{ label: 'Home', href: '#', active: true }, { label: 'Shelves', href: '#s' }]}
         end={<Avatar name="Kavya Reddy" size="s" tone="gold" />} />

Floating charcoal pill, centred. The active item gets a gold underline.
It collapses to a menu button under 560px. `brand` replaces the flower
logo; `end` is a right-hand slot. The Nav is for top-level destinations
only (3--6). In-page switching uses tabs (see patterns).

## Button

    <Button>Start reading</Button>                       // primary, once per view
    <Button variant="secondary">Add to shelf</Button>    // outline
    <Button variant="ghost">← Flip back</Button>         // text only, back/cancel/inline
    <Button size="sm" icon={<PlusIcon/>}>New</Button>
    <Button float href="#start">Explore now</Button>     // over the scene

Props: `variant`, `size: 'md' | 'sm'`, `float`, `icon`, `iconEnd`,
`href` (renders `<a>`), `disabled`. Labels are uppercase automatically.
Keep them to 1--3 words.

## Tag

    <Tag>UX/UI Design</Tag>                              // solid category
    <Tag variant="outline">Fiction</Tag>
    <Tag variant="accent">New</Tag>
    <Tag onClick={() => set('UX')} pressed={f === 'UX'} count={12}>UX</Tag>   // filter chip

Max three on a card. Filter chips sit in a `ds-row` with `--gap: 6px`.

## Avatar

    <Avatar name="Kavya Reddy" />                 // initials, serif
    <Avatar name="Me" tone="gold" size="s" />     // the current user
    <Avatar name="Manav Jain" src={url} size="l" online />

Sizes `s 28`, `m 40`, `l 64`, `xl 96`.

## Input

    <Input label="Email" placeholder="name@company.com" hint="We reply in two days." />
    <Input label="Email" error="Please enter a valid email." />
    <Input label="Search" hideLabel density="compact" placeholder="Search books" />
    <Input label="Your review" multiline rows={6} />

An underline field. The default value is set in the serif, as if written
on paper. `density="compact"` switches to a sans value for dense tools
(search, composer, settings). All normal input/textarea props pass
through.

## Card (always Paper)

    <Card href="#" title="Piranesi" summary="Susanna Clarke · 2020" cover={{ color: '#1d5064', mark: 'Piranesi' }} tags={<Tag>Fantasy</Tag>} />
    <Card cover={{ src: '/cover.jpg', alt: '' }} title="…" />
    <Card variant="note" kicker="Review" title="A house of endless halls" summary="…" footer={<span className="ds-kicker">Read →</span>} />
    <Card variant="plain" title="Pages this year" compact>…</Card>

Props:

-   `variant: 'project' | 'note' | 'plain'`
-   `title`, `summary`, `kicker`
-   `cover { src | color, mark }` (project only, 4:3)
-   `tags`, `footer`, `children`
-   `href | onClick`, `compact`

Hover lifts 4px with Elevation 2. Put cards in a CSS grid:
`grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: var(--space-8)`.

## List

    <List label="Channels" density="compact">
      <ListSection>Channels</ListSection>
      <ListItem title="# design-crit" trailing="12" selected onClick={…} />
      <ListItem leading={<Avatar name="Ritu Sharma" size="s" />} title="Ritu Sharma" meta="typing…" />
    </List>

`ListItem` props: `title`, `meta`, `leading`, `trailing` (string or
`<Tag/>`), `selected` (gold left rule), `href | onClick`. Comfortable
rows use serif titles; compact rows use sans titles. Long text
ellipsizes.

## Modal / Sheet (the book page)

    <Modal open={open} onClose={close} kicker="New review" title="What did you think?"
      actions={<><Button variant="ghost" onClick={close}>← Flip back</Button><Button>Post review</Button></>}>
      <Input label="Your review" multiline />
    </Modal>
    <Modal as="sheet" …/>      // bottom sheet on phones
    <Modal wide …/>            // 880px for previews

Esc and clicking the scrim close it, and focus moves in. The layout is
always: kicker, serif title, short body, then ghost-left and
primary-right actions.

## EmptyState

    <EmptyState title="Nothing on this shelf yet" body="Add a book and it will sit here under the moon." action={<Button size="sm">Add a book</Button>} />

## Type and layout classes (no component needed)

    <header className="ds-stack" style={{ '--gap': '8px' } as CSSProperties}>
      <p className="ds-kicker">Reading challenge</p>
      <h2 className="ds-h2">24 of 40 books</h2>
      <p className="ds-tagline">Ahead of pace by three.</p>
    </header>

# App components (for products, not portfolios)

These exist so layouts stop hand-building the same pieces. **Reach for
them before writing any CSS.** All are token-only and carry the washi
grain where they are paper or pigment.

    import { AppShell, Rail, RailSection, RailItem, Toolbar, ToolbarDivider, Segmented, Tabs, Banner,
      Message, Mention, StreamDivider, CoverTile, PIGMENTS, pigmentFor, Ring, Bars, Progress, Table, Toast } from '../../../design-system';

## AppShell: the frame for any all-day tool

Chat, mail, dashboards, settings, editors, admin. Night shell with
grain; each column scrolls on its own. Sidebar becomes a slide-in sheet
under 760px (a MENU button appears in the header); `aside` hides under
1100px.

    <AppShell switcher={<WorkspaceButtons/>} sidebar={<Rail …/>} header={<><h1 className="ds-h3"># design</h1><Input label="Search" hideLabel density="compact"/></>}
      aside={<DetailsPanel/>} mainTone="paper">{/* stream, table, form… */}</AppShell>

`mainTone`: `paper` for reading/writing (chat, docs, forms, settings);
`night` for scanning (grids, dashboards, maps).

## Rail, RailSection, RailItem: side navigation

Shelves, channels, folders, settings sections, filters. Gold inset bar =
current. Unread = bold label + sakura count.

    <Rail label="Channels">
      <RailSection title="Channels" action={<button type="button">+ Add</button>}>
        <RailItem lead="#" label="design" current onClick={…} />
        <RailItem lead="#" label="launch-week" unread count={3} onClick={…} />
      </RailSection>
      <RailSection title="Direct messages"><RailItem lead="presence-on" label="Kavya Reddy" onClick={…} /></RailSection>
    </Rail>

`lead`: `"#"`, an `<Avatar size="s"/>`, `"presence-on"` /
`"presence-off"`. `count` without `unread` shows a muted number (shelf
counts).

## Toolbar, ToolbarDivider, Segmented

The row above content: search, ghost actions, view switches. Wraps on
phones.

    <Toolbar label="Shelf tools" end={<Segmented label="View" value={view} onChange={setView} options={[{value:'grid',label:'Grid'},{value:'list',label:'List'}]} />}>
      <Input label="Search" hideLabel density="compact" placeholder="Search and add books" />
      <Button variant="ghost" size="sm">Batch edit</Button><ToolbarDivider /><Button variant="ghost" size="sm">Print</Button>
    </Toolbar>

`Segmented` = 2--4 exclusive options (Grid/List, Day/Week/Month,
Delivery/Pickup). Selected = lacquer.

## Tabs

    <Tabs label="Profile" value={tab} onChange={setTab} tabs={[{ value: 'shelf', label: 'Shelf', count: 24 }, { value: 'reviews', label: 'Reviews' }]} />

Nav-link style, gold underline, arrow keys move. Use for sections of one
object; use `Rail` for app-level navigation.

## Banner

    <Banner title="Add your purchased books." onDismiss={…} action={<Button size="sm" variant="secondary">Connect</Button>}>See what you bought.</Banner>
    <Banner tone="error" title="Payment failed.">Try another card or UPI.</Banner>

`tone`: `note` (promo/tip, lacquer rule), `info`, `success`, `error`
(role=alert).

## Message, Mention, StreamDivider

Chat and comment streams. No bubbles; serif name, sans body (max 66ch),
time muted. Consecutive messages from one person use `grouped`.

    <StreamDivider>Today</StreamDivider>
    <Message who="Kavya Reddy" time="10:12" reactions={[{ label: '+1', count: 3 }]} onReact={toggle} thread="3 replies"
      actions={<Button variant="ghost" size="sm">Reply</Button>}>Draft is up. <Mention>@Abhinav</Mention> can you check?</Message>
    <Message who="Kavya Reddy" time="10:13" grouped>Also the Paper version.</Message>
    <Message who="Abhinav Singh" time="10:20" mine attachments={<Card variant="note" compact kicker="Event" title="Design crit" summary="Tue 12:00" />}>Sure.</Message>

Reactions are text chips (the system has no emoji or icon set).
Hover/focus shows actions.

## CoverTile, PIGMENTS, pigmentFor

Covers for books, albums, products, dishes, places, playlists: pigment +
washi grain + serif title.

    <CoverTile title="Piranesi" byline="Susanna Clarke" onClick={…} />                 // 2:3 book
    <CoverTile title="Blue Train" byline="Coltrane" ratio="1:1" pigment="teal" />      // album / product
    <CoverTile title="Paneer tikka bowl" byline="₹209" ratio="4:3" badge={<Tag variant="accent">Bestseller</Tag>} />

Pigment defaults to `pigmentFor(title)` (stable per item). `selected` =
lacquer outline (batch select). Badges sit at the top, title under them,
byline at the bottom. On Night each cover gets a hairline edge so teal
covers don\'t vanish into the page. Pass `src` for a real image. Never
invent other colours; `PIGMENTS` has the six.

## Ring, Bars, Progress

    <Ring value={8} max={24} label="2026 reading challenge" />                        // the moon
    <Bars label="Books per month" data={[{ label: 'J', value: 1 }, …, { label: 'N', value: 2, current: true }]} />
    <Progress value={212} max={607} label="Reading progress" />

Bars include a screen-reader table. For anything more complex (lines,
stacked), follow `patterns.md` → Monitor and keep the same colours: gold
series, sakura for \"now\", hairline axes.

## Table

    <Table caption="Your order" showCaption rowKey={(r) => r.id} rows={rows} sort={sort} onSort={setSortKey} onRowClick={open} selectedKey={id}
      columns={[{ key: 'item', label: 'Item' }, { key: 'qty', label: 'Qty', numeric: true }, { key: 'price', label: 'Price', numeric: true, render: (r) => `₹${r.price}` }]} />

Paper with grain, uppercase headers, tabular numbers, gold bar on the
selected row, scrolls sideways inside itself on phones.

## Toast

    {toast && <Toast onDone={() => setToast(null)}>Added to cart</Toast>}

## Nav: `layout="bar"` for products

    <Nav layout="bar" brand="Shiori" items={[{ label: 'Home', href: '#' }, { label: 'My Books', href: '#', active: true }, …]}
      end={<><Input label="Search" hideLabel density="compact" placeholder="Title, author, ISBN" /><Avatar name="Abhinav Singh" size="s" tone="gold" /></>} />

The default (pill) is the portfolio\'s centred menu for up to 4 links.
`bar` puts the brand left, the links next to it and `end` on the right
in normal flow, so search and actions never collide with the links;
under 900px the links collapse into the menu button.

## Modal without a primary action

Read-only modals (stats, details) pass
`actions={<Button variant="ghost" onClick={close}>Close</Button>}` or no
`actions` at all.


## Book, Spread, Page (the book and page display)

```tsx
<Book contents backLabel="← Flip back" nextLabel="Next →">
  <Spread title="Reading now" left={<Page side="left" kicker="Chapter one" folio={1}>…</Page>} right={<Page side="right" folio={2}>…</Page>} />
</Book>
```

`Book` props:
- `index` / `onIndexChange` (controlled, optional)
- `contents` (chapter tabs, default on)
- `backLabel`, `nextLabel`

`Page` props:
- `side`
- `kicker` (running head)
- `folio` (page number)

Paper with washi fibres and the gutter shadow are built in. On phones it shows one page at a time. When to use it and when not to: `references/book.md`.
