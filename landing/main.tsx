// The way in: what this is, how to get it, and every screen it produced.
import { useCallback, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Button, Modal, Tag } from '../design-system/components';
import { MESSAGING, READER, OTHERS } from './data';
import type { Screen } from './data';
import { THUMBS } from './thumbs';
import './styles.css';

const REPO = 'https://github.com/abhinavsingh1128-maker/astodesign-repo';
const thumb = (s: Screen) => THUMBS[s.path.replace('/', '-')];

function Landing() {
  const [open, setOpen] = useState<Screen | null>(null);
  const close = useCallback(() => setOpen(null), []);
  const tile = (s: Screen) => (
    <li key={s.path}>
      <button type="button" className="xlan-tile" aria-label={`About ${s.name}`} onClick={() => setOpen(s)}>
        <span className="xlan-tile__img"><img src={thumb(s)} alt="" loading="lazy" /></span>
        <span className="xlan-tile__text"><span className="xlan-tile__name">{s.name}{s.pick && <Tag variant="accent">My pick</Tag>}</span><span className="xlan-tile__line">{s.line}</span></span>
      </button>
    </li>
  );
  return (
    <div className="xlan-root">
      <header className="xlan-hero ds-washi" data-surface="paper">
        <h1 className="ds-display-l">I taught Claude to design the way my portfolio looks</h1>
        <p className="ds-tagline">Then I asked it to build two products I never designed for.</p>
        <p className="xlan-by">A design assignment for Pazcare, by Abhinav Singh Tomar</p>
      </header>

      <section className="xlan-idea ds-washi" data-surface="paper" aria-label="The idea">
        <div className="xlan-idea__grid">
          <div className="xlan-idea__copy">
            <h2 className="ds-h2">It’s a look, not a product</h2>
            <p>My portfolio has a mood: night teal, handmade paper, a serif that feels written by someone. I pulled that out into a design system and wrote it down as a Claude skill, so an agent can use it on something it has never seen.</p>
            <p>The rule I kept coming back to: a chat app still has to work like a chat app. The structure comes from the product, and only the feel comes from me. Each screen below is a test of where that holds up, and where it doesn’t.</p>
          </div>
          <div className="xlan-get">
            <ul className="xlan-links">
              <li><a href={`${REPO}/tree/main/skills/astodesign`}>Read the skill</a></li>
              <li><a href={`${REPO}/tree/main/design-system`}>See the design system</a></li>
              <li><a href={REPO}>Open the repository</a></li>
            </ul>
            <div className="xlan-zip ds-washi" data-surface="night">
              <p>Prefer everything in one file? This is all the code. The history and screenshots are in the repository.</p>
              <Button variant="secondary" href="./astodesign-project.zip">Download the zip</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="xlan-band ds-washi" data-surface="night" aria-labelledby="xlan-m">
        <h2 className="ds-h2" id="xlan-m">A messaging app</h2>
        <p className="xlan-band__sub">Three ideas about what a team chat is really for. Pick one to see the thinking.</p>
        <ul className="xlan-tiles">{MESSAGING.map(tile)}</ul>
      </section>

      <section className="xlan-band ds-washi" data-surface="night" aria-labelledby="xlan-r">
        <h2 className="ds-h2" id="xlan-r">A reader’s profile</h2>
        <p className="xlan-band__sub">In the spirit of Goodreads: three ideas about what a profile should say about someone.</p>
        <ul className="xlan-tiles">{READER.map(tile)}</ul>
      </section>

      <section className="xlan-band xlan-band--paper ds-washi" data-surface="paper" aria-labelledby="xlan-o">
        <h2 className="ds-h2" id="xlan-o">Other tests</h2>
        <p className="xlan-band__sub">Everything else I tried along the way. Some of these fed the final six, and some just didn’t work out.</p>
        <ul className="xlan-tiles xlan-tiles--row" tabIndex={0} aria-label="Other tests, scrolls sideways">{OTHERS.map(tile)}</ul>
      </section>

      <Modal open={!!open} onClose={close} variant="sheet" title={open?.name}>
        {open && <>
          <p className="ds-tagline xlan-panel__line">{open.line}</p>
          {open.notes.map((n) => <p key={n} className="xlan-panel__note">{n}</p>)}
          <div className="xlan-wire" role="img" aria-label={`Wireframe of ${open.name}: ${open.wire.flat().join(', ')}`}>
            {open.wire.map((col, i) => <div key={i} className="xlan-wire__col">{col.map((b) => <span key={b} className="xlan-wire__box">{b}</span>)}</div>)}
          </div>
          <Button variant="primary" href={`./products/${open.path}/`}>Open the layout</Button>
        </>}
      </Modal>
    </div>
  );
}
createRoot(document.getElementById('root')!).render(<Landing />);
