import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { OuterDoctorGate } from './components/OuterDoctorGate.tsx';
import './index.css';

// The gate owns the protected-origin entrance before App or clinicStore can mount.
createRoot(document.getElementById('root')!).render(
  <OuterDoctorGate><App /></OuterDoctorGate>
);
