// The front door: what Astodesign is, and the idea behind each thing built with it.
import { createRoot } from 'react-dom/client';
import { Scene, Nav, Button, Surface, Tag } from '../design-system/components';
import './styles.css';

const WORK = [
  { n: '01', href: './products/chat/00-parity-channel/', kind: 'Team chat, the familiar version', name: 'Parity channel', question: 'Can the style carry a real product without changing how it works?', concept: 'A normal channel-first chat: pick a channel, read, open a thread, reply. It is the control in the experiment. Only the skin changes, so anyone who has used a team chat already knows their way around.' },
  { n: '02', href: './products/chat/02-unified-inbox/', kind: 'Team chat, the new idea', name: 'Unified inbox', question: 'What if you stopped checking channels, and the work came to you?', concept: 'The same people and messages as Parity channel, reorganised around one question: what needs me? Everything lands in one list, sorted into Needs you, Threads that moved and Catch up. Reply, and the item is done.' },
  { n: '03', href: './products/habits/01-week-ledger/', kind: 'Habit tracker', name: 'Week ledger', question: 'Does the language hold for something that is not chat?', concept: 'A week set out like a paper ledger: habits are rows, days are columns, today is gold. It swaps streak counters for a week total against a target, so a missed day costs less.' },
  { n: '04', href: './products/reader/03-stats-first/', kind: 'Reader profile', name: 'Stats first', question: 'What if a reader’s profile led with the year in numbers?', concept: 'A book lover’s profile turned upside down: the challenge ring and charts come first, with reading now, shelves and reviews underneath. Finish a book and the ring, charts and shelf counts all move with it.' },
];
const OPTION = { n: '05', href: './products/reader/03-start-reading/', kind: 'Reader profile, second option', name: 'Start reading', question: 'What if a reader’s home opened on a book they have not read yet?', concept: 'A profile led by a powerful quote from a book picked for you, with its cover, why it was chosen, and buttons to keep reading or save it. Reading now, shelves, a small challenge and reviews stay quieter below.' };
const IDEAS = [
  ['chat/03-decision-ledger', 'Team chat', 'Decision ledger', 'Every channel opens on what was decided and what is still open; the talk is the evidence.'],
  ['chat/04-morning-paper', 'Team chat', 'Morning paper', 'The workspace arrives as a morning edition: headlines first, replies on every story.'],
  ['chat/05-people-first', 'Team chat', 'People first', 'You go to a person, not a channel, and see everything you share with them.'],
  ['chat/06-day-river', 'Team chat', 'Day river', 'The day is a timeline: conversations sit at the hour they happened, with now marked.'],
  ['reader/04-year-as-book', 'Reader profile', 'The year as a book', 'The profile is an open book: a year of reading told spread by spread.'],
  ['reader/05-cover-wall', 'Reader profile', 'Cover wall', 'A wall of covers grouped by shelf, with reading now on top.'],
  ['reader/06-reading-diary', 'Reader profile', 'Reading diary', 'A year as a dated diary: what you read, when, and what you thought.'],
  ['reader/07-taste-map', 'Reader profile', 'Taste map', 'Every book placed by length and rating, so your taste shows as a pattern.'],
];
const JOBS = [
  { cls: 'is-gold', name: 'Gold', job: 'Where you are, and progress toward a goal' },
  { cls: 'is-lacquer', name: 'Lacquer', job: 'Selected, mentioned or done' },
  { cls: 'is-sakura', name: 'Sakura', job: 'Unread, new or happening now' },
];

function Landing() {
  return (
    <>
      <Scene quiet height="min(100svh, 760px)" nav={<Nav brand="Astodesign" items={[{ label: 'The idea', href: '#idea' }, { label: 'Screens', href: '#screens' }, { label: 'Second option', href: '#option' }, { label: 'More ideas', href: '#ideas' }, { label: 'Gallery', href: './design-system/gallery/' }]} />}>
        <div className="xlan-hero">
          <p className="ds-kicker">A design system and its screens</p>
          <h1 className="ds-display-xl">One language, tested on real products</h1>
          <p className="ds-tagline">Night teal, washi paper, and the quiet of a pond after dark.</p>
          <Button variant="primary" href="#screens">See the screens</Button>
        </div>
      </Scene>

      <Surface tone="paper" as="section" id="idea" className="xlan-band">
        <div className="ds-container xlan-idea">
          <div className="xlan-idea__lead">
            <p className="ds-kicker">The idea</p>
            <h2 className="ds-h2">A theme, not a product</h2>
            <p className="ds-body-l">Astodesign turns the look of a portfolio into a system any product can wear. A chat app still has to work like a chat app. So the structure stays true to the product, the skin comes from the system, and each build shows where that holds up.</p>
          </div>
          <dl className="xlan-rules">
            <div><dt className="ds-h4">Two surfaces</dt><dd>Night for what you scan: shells, rails, navigation. Paper for what you read or write.</dd></div>
            <div><dt className="ds-h4">Two voices</dt><dd>A serif for titles and names. A plain sans for everything read in bulk.</dd></div>
            <div><dt className="ds-h4">Colour has a job</dt><dd>
              <ul className="xlan-jobs">{JOBS.map((j) => <li key={j.name}><span className={`xlan-dot ds-grain ${j.cls}`} aria-hidden="true" /><span><strong>{j.name}:</strong> {j.job}</span></li>)}</ul>
            </dd></div>
          </dl>
        </div>
      </Surface>

      <Surface tone="night" as="section" id="screens" className="xlan-band" backdrop>
        <div className="ds-container">
          <header className="xlan-head">
            <p className="ds-kicker">Screens</p>
            <h2 className="ds-h2">Four screens, four questions</h2>
          </header>
          <ul className="xlan-work">
            {WORK.map((w) => (
              <li key={w.n}>
                <a className="xlan-item ds-washi" href={w.href} data-surface="paper">
                  <span className="xlan-item__n" aria-hidden="true">{w.n}</span>
                  <span className="xlan-item__main">
                    <Tag>{w.kind}</Tag>
                    <span className="ds-h3 xlan-item__name">{w.name}</span>
                    <span className="xlan-item__q">{w.question}</span>
                    <span className="xlan-item__c">{w.concept}</span>
                  </span>
                  <span className="xlan-item__go">Open →</span>
                </a>
              </li>
            ))}
          </ul>
          <section id="option" className="xlan-option" aria-labelledby="xlan-option-title">
            <header className="xlan-head">
              <p className="ds-kicker">Second option</p>
              <h2 className="ds-h2" id="xlan-option-title">Another way into the reader</h2>
            </header>
            <a className="xlan-item ds-washi" href={OPTION.href} data-surface="paper">
              <span className="xlan-item__n" aria-hidden="true">{OPTION.n}</span>
              <span className="xlan-item__main">
                <Tag>{OPTION.kind}</Tag>
                <span className="ds-h3 xlan-item__name">{OPTION.name}</span>
                <span className="xlan-item__q">{OPTION.question}</span>
                <span className="xlan-item__c">{OPTION.concept}</span>
              </span>
              <span className="xlan-item__go">Open →</span>
            </a>
          </section>
          <section id="ideas" className="xlan-option" aria-labelledby="xlan-ideas-title">
            <header className="xlan-head">
              <p className="ds-kicker">More ideas</p>
              <h2 className="ds-h2" id="xlan-ideas-title">Eight more starting points</h2>
            </header>
            <ul className="xlan-ideas">
              {IDEAS.map(([path, kind, name, idea]) => (
                <li key={path}><a className="xlan-idea-card ds-washi" data-surface="paper" href={`./products/${path}/`}><Tag>{kind}</Tag><span className="ds-h3">{name}</span><span className="xlan-item__c">{idea}</span><span className="xlan-item__go">Open →</span></a></li>
              ))}
            </ul>
          </section>
          <p className="xlan-gallery">Want the parts? <a href="./design-system/gallery/">The design system gallery</a> shows every colour, typeface and component these are built from.</p>
          <p className="ds-caption xlan-foot">By Abhinav Singh Tomar. These are working prototypes with made-up content: nothing is saved or sent.</p>
        </div>
      </Surface>
    </>
  );
}
createRoot(document.getElementById('root')!).render(<Landing />);
