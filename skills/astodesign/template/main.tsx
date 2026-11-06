// {{IDEA}}
import { createRoot } from 'react-dom/client';
import { AppShell, Rail, RailSection, RailItem, Button } from '{{DS}}';
import './styles.css';

// Real content only. Counts come from this data.
const items = [
  { id: 'a', name: 'First item' },
];

function Layout() {
  return (
    <AppShell
      sidebar={<Rail label="Sections"><RailSection title="Sections">{items.map((i) => <RailItem key={i.id} label={i.name} current={i.id === 'a'} />)}</RailSection></Rail>}
      header={<><h1 className="ds-h4">{{TITLE_JS}}</h1><span className="ds-spacer" /><Button variant="primary">Primary action</Button></>}
    >
      <div className="{{PREFIX}}-main">Replace with the layout.</div>
    </AppShell>
  );
}
createRoot(document.getElementById('root')!).render(<Layout />);
