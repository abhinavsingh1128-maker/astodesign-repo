import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Avatar, Banner, Bars, Book, Button, Card, CoverTile, EmptyState, Input, List, ListItem, Mention, Message, Modal, Nav, Page,
  Progress, Ring, Scene, Segmented, Spread, StreamDivider, Surface, Table, Tabs, Tag, Toast, Toolbar, ToolbarDivider, AppShell, Rail, RailItem, RailSection,
} from '../components';

const books = [
  { title: 'The Remains of the Day', by: 'Ishiguro', pages: 258, rating: 5 },
  { title: 'Pachinko', by: 'Min Jin Lee', pages: 496, rating: 4 },
  { title: 'A Tale for the Time Being', by: 'Ozeki', pages: 422, rating: 5 },
  { title: 'Kitchen', by: 'Yoshimoto', pages: 152, rating: 4 },
];

function Section({ kicker, title, children }: { kicker: string; title: string; children: React.ReactNode }) {
  return (
    <section className="ds-stack" style={{ ['--gap' as string]: 'var(--space-5)', padding: 'var(--space-16) 0', borderTop: '1px solid var(--border-subtle)' }}>
      <div className="ds-stack" style={{ ['--gap' as string]: 'var(--space-2)' }}>
        <p className="ds-kicker">{kicker}</p>
        <h2 className="ds-h2">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Gallery() {
  const [modal, setModal] = useState(false);
  const [toast, setToast] = useState(false);
  const [seg, setSeg] = useState('all');
  const [tab, setTab] = useState('shelves');
  const [page, setPage] = useState(0);
  const [sel, setSel] = useState('Pachinko');
  return (
    <>
      <Scene nav={<Nav items={[{ label: 'Work', href: '#work', current: true }, { label: 'About', href: '#about' }, { label: 'Contact', href: '#contact' }]} end={<Button variant="primary" size="sm">Connect</Button>} />} height="92vh">
        <div className="ds-container ds-stack" style={{ ['--gap' as string]: 'var(--space-4)' }}>
          <p className="ds-kicker">Astodesign · design system</p>
          <h1 className="ds-display-xl" style={{ maxWidth: '12ch' }}><strong>Product designer</strong> who makes complex products feel simple.</h1>
          <p className="ds-tagline ds-muted">Night for the shell, Paper for the page.</p>
        </div>
      </Scene>

      <Surface tone="night" as="main" backdrop>
        <div className="ds-container">
          <Section kicker="Type" title="Serif speaks, sans works">
            <div className="ds-stack">
              <p className="ds-display-l">Display L · Cormorant</p>
              <p className="ds-h3">Heading 3 for card titles</p>
              <p className="ds-whisper">a whisper, for asides</p>
              <p className="ds-body-l ds-reading">Body L in Helvetica Neue. The serif carries the voice, the sans carries the work. Labels are uppercase and tracked.</p>
              <div className="ds-row"><span className="ds-kicker">Kicker</span><span className="ds-label">Field label</span><Tag>Tag</Tag><Tag variant="solid">Solid</Tag><Tag variant="accent">Accent</Tag><Tag variant="selected">Selected</Tag></div>
            </div>
          </Section>

          <Section kicker="Actions" title="One primary per view">
            <div className="ds-row"><Button variant="primary">Connect</Button><Button>Secondary</Button><Button variant="ghost">Ghost</Button><Button size="sm">Small</Button><Button disabled>Disabled</Button></div>
            <div className="ds-row">
              <Avatar name="Abhinav Singh" gold presence="on" size="l" /><Avatar name="Mira Rao" presence="off" /><Avatar name="Kenji Mori" size="s" /><Avatar name="Leela Iyer" size="xl" />
            </div>
          </Section>

          <Section kicker="Cards" title="Paper on Night">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 'var(--space-6)' }}>
              <Card title="Pazcare benefits" tags={['B2B', 'Fintech']} cover={{ color: 'var(--pigment-lacquer)', mark: 'P' }} href="#" note="Cut claim time by 40%">Making benefits feel simple for 2M employees.</Card>
              <Card title="Night garden" tags={['Brand']} cover={{ color: 'var(--pigment-teal)', mark: 'N' }} href="#">The portfolio scene, drawn by hand.</Card>
              <Card variant="plain" title="A plain card">No cover. Used for notes and forms.</Card>
            </div>
          </Section>

          <Section kicker="Paper" title="Forms, lists and tables live on paper">
            <Surface tone="paper" className="ds-stack" style={{ padding: 'var(--space-8)', borderRadius: 'var(--radius-lg)', ['--gap' as string]: 'var(--space-6)' }}>
              <Toolbar label="Filters" end={<Button variant="primary" size="sm" onClick={() => setModal(true)}>Open modal</Button>}>
                <Segmented label="Show" value={seg} onChange={setSeg} options={[{ value: 'all', label: 'All' }, { value: 'unread', label: 'Unread' }, { value: 'mine', label: 'Mine' }]} />
                <ToolbarDivider />
                <Button variant="ghost" size="sm" onClick={() => setToast(true)}>Show toast</Button>
              </Toolbar>
              <Tabs label="Profile" value={tab} onChange={setTab} tabs={[{ value: 'shelves', label: 'Shelves', count: 4 }, { value: 'reviews', label: 'Reviews', count: 12 }, { value: 'stats', label: 'Stats' }]} />
              <Banner title="Reading challenge" action={<Button size="sm">See goal</Button>}>You are 3 books ahead of schedule.</Banner>
              <Banner tone="error" title="Couldn't sync" onDismiss={() => {}}>Your last review is saved on this device.</Banner>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-8)' }}>
                <Input label="Your name" placeholder="Abhinav" />
                <Input label="Email" error="That doesn't look like an email" defaultValue="abhinav@" />
                <Input label="Message" multiline placeholder="Say hello" />
              </div>
              <List label="People">
                <ListItem lead={<Avatar name="Mira Rao" />} title="Mira Rao" meta="Design lead" end="2m" selected />
                <ListItem lead={<Avatar name="Kenji Mori" />} title="Kenji Mori" meta="Engineering" end="1h" onClick={() => {}} />
              </List>
              <Table caption="Books this year" showCaption rowKey={(r) => r.title} selectedKey={sel} onRowClick={(r) => setSel(r.title)}
                columns={[{ key: 'title', label: 'Title' }, { key: 'by', label: 'Author' }, { key: 'pages', label: 'Pages', numeric: true }, { key: 'rating', label: 'Rating', numeric: true, render: (r) => '★'.repeat(r.rating) }]} rows={books} />
            </Surface>
          </Section>

          <Section kicker="Covers & numbers" title="Pigment, grain, the moon">
            <div className="ds-row" style={{ ['--gap' as string]: 'var(--space-5)', alignItems: 'flex-end' }}>
              {books.map((b) => <CoverTile key={b.title} title={b.title} byline={b.by} selected={sel === b.title} onClick={() => setSel(b.title)} />)}
              <CoverTile title="Square album" ratio="1:1" pigment="plum" />
            </div>
            <div className="ds-row" style={{ ['--gap' as string]: 'var(--space-10)', alignItems: 'center' }}>
              <Ring value={18} max={30} label="2026 reading challenge" />
              <div style={{ width: 320 }}><Bars label="Books per month" data={['J', 'F', 'M', 'A', 'M', 'J'].map((m, i) => ({ label: m, value: [2, 3, 1, 4, 2, 3][i], current: i === 5 }))} /></div>
              <div style={{ width: 240 }}><Progress value={62} label="Pachinko progress" showLabel /></div>
            </div>
          </Section>

          <Section kicker="Stream" title="Messages without bubbles">
            <Surface tone="paper" style={{ borderRadius: 'var(--radius-lg)', padding: 'var(--space-4) 0' }}>
              <StreamDivider>Today</StreamDivider>
              <Message who="Mira Rao" time="10:42" reactions={[{ label: '🌸', count: 3, mine: true }]} thread={{ count: 4, last: '2m ago' }} actions={<Button variant="ghost" size="sm">Reply</Button>}>
                Shipping the new onboarding today. <Mention me>Abhinav</Mention> can you look at the empty states?
              </Message>
              <Message who="Mira Rao" time="10:43" grouped>Figma link is in the canvas.</Message>
              <StreamDivider tone="new">New</StreamDivider>
              <Message who="Kenji Mori" time="10:51">On it. The moon empty state reads well on paper.</Message>
            </Surface>
          </Section>

          <Section kicker="Book" title="The diary spread">
            <Book index={page} onIndexChange={setPage}>
              <Spread title="Preface" left={<Page side="left" kicker="Preface" folio={1}><h3 className="ds-h2">A year in books</h3><p className="ds-body-l">Each spread is a chapter. Flip with the buttons, arrow keys or a swipe.</p></Page>} right={<Page side="right" kicker="Preface" folio={2}><p className="ds-whisper">read slowly</p><Ring value={18} max={30} label="Challenge" /></Page>} />
              <Spread title="Favourites" left={<Page side="left" kicker="Favourites" folio={3}><h3 className="ds-h2">Favourites</h3></Page>} right={<Page side="right" kicker="Favourites" folio={4}><div className="ds-row">{books.slice(0, 2).map((b) => <CoverTile key={b.title} title={b.title} byline={b.by} />)}</div></Page>} />
            </Book>
          </Section>

          <Section kicker="Empty" title="Nothing here yet">
            <EmptyState title="No books on this shelf" body="Add one from search, or move a book here from Reading now." action={<Button>Find a book</Button>} />
          </Section>

          <Section kicker="Shell" title="AppShell: Night rail, Paper main">
            <div style={{ height: 420, borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--elevation-4)', transform: 'translateZ(0)' }}>
              <AppShell sidebar={<Rail label="Channels" header={<p className="ds-h4">Astodesign</p>}><RailSection title="Channels"><RailItem lead="#" label="design" current /><RailItem lead="#" label="launch" unread count={3} /><RailItem lead="#" label="random" count={12} /></RailSection><RailSection title="People"><RailItem lead={{ avatar: 'Mira Rao', presence: 'on' }} label="Mira Rao" /></RailSection></Rail>}
                header={<h2 className="ds-h4"># design</h2>}>
                <Message who="Mira Rao" time="10:42">Rail on Night, stream on Paper.</Message>
              </AppShell>
            </div>
          </Section>
        </div>
      </Surface>
      <Modal open={modal} onClose={() => setModal(false)} title="Add to shelf" actions={<><Button variant="ghost" onClick={() => setModal(false)}>Cancel</Button><Button variant="primary" onClick={() => setModal(false)}>Add</Button></>}>
        <Input label="Shelf name" placeholder="Summer 2026" />
      </Modal>
      {toast && <Toast onDone={() => setToast(false)} action={<Button variant="ghost" size="sm">Undo</Button>}>Moved to Read</Toast>}
    </>
  );
}
createRoot(document.getElementById('root')!).render(<Gallery />);
