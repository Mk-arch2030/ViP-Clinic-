import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { OuterDoctorGate } from './components/OuterDoctorGate.tsx';
import './index.css';

// Stage 8 acceptance-only entry.
// Explicit opt-in; never changes the default clinic entry.
createRoot(document.getElementById('root')!).render(
  <OuterDoctorGate>
    <App caseCreateEnabled={true} />
  </OuterDoctorGate>
);
