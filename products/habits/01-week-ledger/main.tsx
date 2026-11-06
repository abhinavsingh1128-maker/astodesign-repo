// A week as a ledger: habits are rows, days are columns, today is gold
import { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AppShell, Rail, RailSection, RailItem, Button, Banner, Bars, Ring, Segmented, Toolbar, Modal, Input, Toast, EmptyState, Avatar } from '../../../design-system/components';
import './styles.css';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const TODAY = 3; // Thursday
type Habit = { id: string; name: string; area: 'Body' | 'Mind' | 'Home'; target: number; done: boolean[] };
const START: Habit[] = [
  { id: 'walk', name: 'Walk 6,000 steps', area: 'Body', target: 7, done: [true, true, false, true, false, false, false] },
  { id: 'stretch', name: 'Stretch for 10 minutes', area: 'Body', target: 5, done: [true, false, true, false, false, false, false] },
  { id: 'water', name: 'Two litres of water', area: 'Body', target: 7, done: [true, true, true, false, false, false, false] },
  { id: 'read', name: 'Read 20 pages', area: 'Mind', target: 6, done: [true, true, true, true, false, false, false] },
  { id: 'journal', name: 'Three lines in the journal', area: 'Mind', target: 7, done: [false, true, true, false, false, false, false] },
  { id: 'sketch', name: 'One sketch', area: 'Mind', target: 3, done: [false, false, true, false, false, false, false] },
  { id: 'plants', name: 'Water the plants', area: 'Home', target: 2, done: [true, false, false, false, false, false, false] },
  { id: 'tidy', name: 'Clear the desk', area: 'Home', target: 5, done: [true, true, false, true, false, false, false] },
];
const LAST_WEEKS = [{ label: 'W24', value: 31 }, { label: 'W25', value: 36 }, { label: 'W26', value: 28 }, { label: 'W27', value: 40 }, { label: 'W28', value: 33 }];

function Check({ on, today, future, label, onToggle }: { on: boolean; today: boolean; future: boolean; label: string; onToggle: () => void }) {
  return (
    <button type="button" className={`xha01-check${on ? ' is-on ds-grain' : ''}${today ? ' is-today' : ''}`} aria-pressed={on} aria-label={label} disabled={future} onClick={onToggle}>
      {on && <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" /></svg>}
    </button>
  );
}

function Ledger() {
  const [habits, setHabits] = useState(START);
  const [area, setArea] = useState<'All' | Habit['area']>('All');
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const [notice, setNotice] = useState(true);

  const shown = area === 'All' ? habits : habits.filter((h) => h.area === area);
  const doneThisWeek = habits.reduce((n, h) => n + h.done.filter(Boolean).length, 0);
  const goal = habits.reduce((n, h) => n + h.target, 0);
  const todayLeft = habits.filter((h) => !h.done[TODAY]).length;
  const perDay = DAYS.map((d, i) => ({ label: d[0], value: habits.filter((h) => h.done[i]).length, current: i === TODAY }));
  const areas = useMemo(() => (['Body', 'Mind', 'Home'] as const).map((a) => ({ a, n: habits.filter((h) => h.area === a).length })), [habits]);

  const toggle = (id: string, day: number) => setHabits((hs) => hs.map((h) => (h.id === id ? { ...h, done: h.done.map((v, i) => (i === day ? !v : v)) } : h)));
  const add = () => {
    if (!name.trim()) return;
    setHabits((hs) => [...hs, { id: name, name: name.trim(), area: area === 'All' ? 'Mind' : area, target: 7, done: DAYS.map(() => false) }]);
    setAdding(false); setToast(`Added “${name.trim()}”`); setName('');
  };

  return (
    <>
      <AppShell
        sidebar={
          <Rail label="Habits" header={<div className="ds-stack" style={{ ['--gap' as string]: 'var(--space-1)' }}><p className="ds-kicker">Week 29</p><p className="ds-h4">Small things, daily</p></div>}
            footer={<div className="ds-row"><Avatar name="Abhinav Singh" size="s" gold /><span className="ds-body-s">Abhinav</span></div>}>
            <RailSection title="Areas">
              <RailItem label="All habits" count={habits.length} current={area === 'All'} onClick={() => setArea('All')} />
              {areas.map(({ a, n }) => <RailItem key={a} label={a} count={n} current={area === a} onClick={() => setArea(a)} />)}
            </RailSection>
            <RailSection title="Today">
              <RailItem lead="presence-on" label="Left today" count={todayLeft} unread={todayLeft > 0} onClick={() => setArea('All')} />
            </RailSection>
          </Rail>
        }
        header={<><div className="ds-stack" style={{ ['--gap' as string]: '2px' }}><p className="ds-kicker">This week</p><h1 className="ds-h4">The ledger</h1></div><span className="ds-spacer" /><Button variant="primary" onClick={() => setAdding(true)}>Add habit</Button></>}
      >
        <div className="xha01-page">
          {notice && <Banner title="Thursday is your quiet day" onDismiss={() => setNotice(false)}>Last month you finished the fewest habits on Thursdays. Two are left before evening.</Banner>}

          <section className="xha01-summary" aria-label="Week summary">
            <Ring value={doneThisWeek} max={goal} label="Habits done this week" size={132} />
            <div className="ds-stack xha01-summary__text" style={{ ['--gap' as string]: 'var(--space-2)' }}>
              <p className="ds-kicker">Week so far</p>
              <p className="ds-h3">{doneThisWeek} of {goal} ticks</p>
              <p className="ds-body-s ds-muted">{todayLeft} habit{todayLeft === 1 ? '' : 's'} left today. Ticks are your own; nothing is marked for you.</p>
            </div>
            <div className="xha01-summary__bars"><p className="ds-label">Per day</p><Bars label="Habits done per day" data={perDay} height={84} /></div>
            <div className="xha01-summary__bars"><p className="ds-label">Last five weeks</p><Bars label="Ticks per week" data={LAST_WEEKS} height={84} /></div>
          </section>

          <Toolbar label="Filter habits" end={<span className="ds-body-s ds-muted">{shown.length} shown</span>}>
            <Segmented label="Area" value={area} onChange={setArea} options={[{ value: 'All', label: 'All' }, { value: 'Body', label: 'Body' }, { value: 'Mind', label: 'Mind' }, { value: 'Home', label: 'Home' }]} />
          </Toolbar>

          {shown.length === 0 ? <EmptyState title="No habits here" body="Nothing in this area yet. Add one, or show all habits." action={<Button onClick={() => setArea('All')}>Show all</Button>} /> : (
            <div className="xha01-ledger ds-washi" data-surface="paper" role="region" aria-label="Habit ledger" tabIndex={0}>
              <table className="xha01-table">
                <caption className="ds-sr-only">Habits by day, this week</caption>
                <thead><tr><th scope="col">Habit</th>{DAYS.map((d, i) => <th key={d} scope="col" className={i === TODAY ? 'is-today' : ''}>{d}</th>)}<th scope="col" className="is-num">Week</th></tr></thead>
                <tbody>
                  {shown.map((h) => {
                    const n = h.done.filter(Boolean).length;
                    return (
                      <tr key={h.id}>
                        <th scope="row"><span className="xha01-name">{h.name}</span><span className="xha01-area">{h.area}</span></th>
                        {DAYS.map((d, i) => <td key={d} className={i === TODAY ? 'is-today' : ''}><Check on={h.done[i]} today={i === TODAY} future={i > TODAY} label={`${h.name}, ${d}`} onToggle={() => toggle(h.id, i)} /></td>)}
                        <td className="is-num"><span className={n >= h.target ? 'xha01-met' : ''}>{n}/{h.target}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </AppShell>
      <Modal open={adding} onClose={() => setAdding(false)} title="Add a habit" actions={<><Button variant="ghost" onClick={() => setAdding(false)}>Cancel</Button><Button variant="primary" onClick={add} disabled={!name.trim()}>Add</Button></>}>
        <Input label="Habit" placeholder="Make the bed" value={name} onChange={(e) => setName((e.target as HTMLInputElement).value)} hint={`Goes into ${area === 'All' ? 'Mind' : area}, every day.`} />
      </Modal>
      {toast && <Toast onDone={() => setToast(null)}>{toast}</Toast>}
    </>
  );
}
createRoot(document.getElementById('root')!).render(<Ledger />);
