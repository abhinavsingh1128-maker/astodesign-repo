# Components

Written from `design-system/components/*.tsx`. If this file and the source ever disagree, the source wins. `node skills/astodesign/scripts/check-docs.mjs` compares them.

Import from the design system (path from `products/<p>/<layout>/main.tsx`). The checker needs this exact ending:

    import { Button, Input, AppShell } from '../../../design-system/components';

Importing it loads all the CSS. Class names start with `ds-`, and you can use them on plain elements.

# Core

## Surface

    <Surface tone="night" backdrop className="x-page">…</Surface>
    <Surface tone="paper" as="section" id="reviews">…</Surface>

`tone`: night | paper. `texture` (fibres, on by default). `backdrop` (Night shade behind dense content). `as`, `className`, plus HTML props.

## Scene

One per screen, for a hero or first run. Never behind dense UI.

    <Scene nav={<Nav items={items} />} height="60vh" quiet>…</Scene>

`nav`, `quiet` (dims the art so text stays readable), `height`, `className`.

## Nav

    <Nav layout="bar" brand="Shiori" items={[{ label: 'Home', href: '#', current: true }, { label: 'Stats', onClick: open }]} end={<Avatar name="Kavya Reddy" size="s" gold />} />

`layout`: pill (portfolio, up to 4 links) | bar (products). `brand`, `brandHref`, `mark`, `items`, `end`, `label`, `className`. Each item: `label`, `href` or `onClick`, `current`. Links collapse to a Menu button under 900px. There are no dropdowns: put your own panel beside it (`references/findings.md`).

## Button

    <Button variant="primary">Start reading</Button>
    <Button variant="secondary" size="sm" onClick={go}>Add</Button>
    <Button variant="ghost" href="#back">← Flip back</Button>

`variant`: primary | secondary (default) | ghost. `size`: md | sm. `float`, `icon` (boolean: icon-only, needs `aria-label`), `href` (renders a link), `className`, plus button props such as `disabled` and `type`. Labels are uppercase. `href` drops other button props, including `onClick`.

## Tag

    <Tag>Fiction</Tag>
    <Tag variant="accent">New</Tag>
    <Tag onClick={toggle} pressed={on}>Fantasy</Tag>

`variant`: outline (default) | solid | accent (gold) | selected (lacquer). `onClick` makes it a toggle button, and `pressed` is its state. `className`. No count prop: put a count in the label.

## Avatar

    <Avatar name="Kavya Reddy" size="s" gold presence="on" />

`name`, `src`, `size`: s 28 | m 40 | l 64 | xl 96. `gold` (the current user), `presence`: on | off, `className`.

## Input

    <Input label="Email" placeholder="name@company.com" hint="We reply in two days." />
    <Input label="Search" hideLabel compact value={q} onChange={(e) => setQ(e.target.value)} />
    <Input label="Your review" compact multiline rows={6} error={err} />

`label` (required), `hint`, `error`, `compact` (sans value, for tools), `hideLabel`, `multiline`, `className`, plus input or textarea props. It doesn't forward a ref: to reach the field, wrap it and use `querySelector`.

## Card (always Paper)

    <Card title="Piranesi" cover={{ color: PIGMENTS.teal, mark: 'Piranesi' }} tags={['Fantasy']} note="Susanna Clarke" href="#" />
    <Card variant="compact" title="report.pdf" note="PDF, 4 pages" />

`variant`: project (default) | plain | compact. `title`, `cover` (`src` or `color`, `mark`), `tags` (strings), `note`, `href` or `onClick`, `className`, `children`.

## List

    <List compact label="Channels">
      <ListSection title="Channels">
        <ListItem title="# design-crit" end="12" selected onClick={go} />
        <ListItem lead={<Avatar name="Ritu Sharma" size="s" />} title="Ritu Sharma" meta="typing…" />
      </ListSection>
    </List>

`List`: `compact`, `label`, `className`. `ListSection`: `title`. `ListItem`: `title`, `meta`, `lead`, `end`, `selected`, `href` or `onClick`.

## Modal

    <Modal open={open} onClose={close} title="Add a book" actions={<><Button variant="ghost" onClick={close}>Cancel</Button><Button variant="primary" onClick={save}>Save</Button></>}>
      <Input label="Title" compact />
    </Modal>
    <Modal open={open} onClose={close} variant="sheet" title="Details">…</Modal>

`open`, `onClose`, `title`, `actions`, `variant`: dialog (default) | wide | sheet | sheet-left, `children`. It moves focus in (to the built-in Close button, so focus your first field yourself in a form), traps Tab, closes on Esc and the scrim, and returns focus. Don't stack two: one Esc closes both, so close a sheet before opening a dialog. `actions` sits outside `children`, so its state must live in the parent. It has a built-in Close button. No `kicker`: put one in the body. A sheet has padding: to run content edge to edge, override `.ds-sheet` under your own prefix.

## EmptyState

    <EmptyState title="Nothing here yet" body="Add a book." action={<Button size="sm">Add</Button>} />

`title`, `body`, `action`. It shows the moon, which counts as the screen's motif.

## Text and layout classes

`ds-display-xl`, `ds-display-l`, `ds-h2`, `ds-h3`, `ds-h4`, `ds-tagline`, `ds-whisper`, `ds-kicker`, `ds-label`, `ds-caption`, `ds-body-l`, `ds-body-m`, `ds-body-s`, `ds-muted`, `ds-num`, `ds-rule`, `ds-container`, `ds-stack` (`--gap`), `ds-row`, `ds-spacer`, `ds-enter`, `ds-grain`, `ds-washi`, `ds-sr-only`.

# App components

## AppShell

    <AppShell switcher={workspaces} sidebar={<Rail label="Channels">…</Rail>} header={<h1 className="ds-h4"># design</h1>} aside={details} mainTone="paper">…</AppShell>

`switcher`, `sidebar`, `header`, `aside`, `mainTone`: paper | night, `menuLabel`. The sidebar becomes a sheet under 760px. **`aside` is hidden at 1100px and below**, so anything in it needs another route: a `Modal variant="sheet"` is the usual one. CSS only hides the aside, so a form in both places mounts twice: check `matchMedia('(max-width: 1100px)')` and pass `aside` only when wide. The aside has no padding, and a sheet does. The header row shows whenever there is a sidebar, even if `header` is empty. It takes no `className`: wrap it in your own div to scope overrides.

## Rail

    <Rail label="Channels" header={brand} footer={me}>
      <RailSection title="Channels" action={<button type="button">Add</button>}>
        <RailItem lead="#" label="design" current onClick={go} />
        <RailItem lead="presence-on" label="Kavya Reddy" unread count={3} onClick={go} />
        <RailItem lead={{ avatar: 'Ritu Sharma', presence: 'on' }} label="Ritu Sharma" onClick={go} />
      </RailSection>
    </Rail>

`RailItem`: `lead` (# | presence-on | presence-off | `{ avatar, presence }` | a node), `label`, `current`, `unread`, `count` (hidden at 0; muted unless `unread`), `onClick` or `href`.

## Toolbar, ToolbarDivider, Segmented

    <Toolbar label="Shelf tools" className="x-tools" end={<Segmented label="View" value={view} onChange={setView} options={[{ value: 'grid', label: 'Grid' }, { value: 'list', label: 'List' }]} />}>
      <Button variant="ghost" size="sm">Edit</Button><ToolbarDivider />
    </Toolbar>

## Tabs

    <Tabs label="Profile" value={tab} onChange={setTab} tabs={[{ value: 'shelf', label: 'Shelf', count: 24 }]} />

Arrow keys move between tabs.

## Banner

    <Banner title="Add your books." tone="note" action={<Button size="sm">Connect</Button>} onDismiss={hide}>Details.</Banner>

`tone`: note | info | success | error. `title`, `action`, `onDismiss`, `children`.

## Message, Mention, StreamDivider

    <StreamDivider>Today</StreamDivider>
    <StreamDivider tone="new">New</StreamDivider>
    <Message who="Kavya Reddy" time="10:12" reactions={[{ label: '+1', count: 3, mine: true }]} onReact={toggle} thread={{ count: 3, last: '10:40', onOpen: open }} actions={<Button variant="ghost" size="sm">Reply</Button>} attachments={<Card variant="compact" title="a.pdf" />}>
      Draft is up. <Mention me>Abhinav</Mention>
    </Message>

`Message`: `who`, `time`, `grouped`, `mine`, `reactions`, `onReact`, `thread`, `actions` (hover or focus only, hidden on touch), `attachments`. `Mention`: `me` makes it lacquer, and it adds the @ itself.

## CoverTile, PIGMENTS, pigmentFor

    <CoverTile title="Piranesi" byline="Susanna Clarke" size="m" onClick={open} badge={<Tag variant="accent">Favourite</Tag>} />

`title`, `byline`, `ratio`: 2:3 | 1:1 | 4:3, `pigment`, `src`, `badge`, `selected`, `onClick`, `size`: s 72 | m 120 | l 180. With `src`, the title isn't drawn, and nothing shows until the image loads. The badge can cover the title: prefer putting it in the Paper block below. Width is fixed by size, or set `--w` under your prefix.

## Ring, Bars, Progress

    <Ring value={8} max={24} label="2026 challenge" size={140} />
    <Bars label="Books per month" height={120} data={[{ label: 'J', value: 1 }, { label: 'N', value: 2, current: true }]} />
    <Progress value={212} max={607} label="Reading progress" showLabel />

`Ring` also takes `children` for its centre. Its default number is 38px, so pass your own at sizes under about 100. `Bars` takes `format`.

## Table

    <Table caption="Your order" showCaption density="compact" rowKey={(r) => r.id} rows={rows} sort={{ key: 'qty', dir: 'asc' }} onSort={setKey} onRowClick={open} selectedKey={id}
      columns={[{ key: 'item', label: 'Item' }, { key: 'qty', label: 'Qty', numeric: true, render: (r) => r.qty }]} />

Columns: `key`, `label`, `numeric`, `sortable`, `render`, `width`. A column with no `render` prints `row[key]`. `onSort` gets only the key, so flip `dir` yourself. It has `--elevation-2` at rest, and a 520px minimum width that scrolls sideways on phones: for a work queue, drop columns and set `min-width: 0` under your prefix.

## Toast

    {toast && <Toast onDone={clear} action={<Button variant="ghost" size="sm" onClick={undo}>Undo</Button>}>Added</Toast>}

`onDone`, `action`, `duration` (default 4000). `onDone` can be inline.

## Book, Spread, Page

    <Book index={i} onIndexChange={setI} contents backLabel="← Flip back" nextLabel="Next →">
      <Spread title="Reading now" left={<Page side="left" kicker="Chapter one" folio={1}>…</Page>} right={<Page side="right" folio={2}>…</Page>} />
    </Book>

When to use it: `references/book.md`. On phones it shows both pages stacked or one at a time depending on width, so check your screenshot.
