
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Ensure all Firebase initialization happens in firebase.ts, not here
createRoot(document.getElementById("root")!).render(<App />);
