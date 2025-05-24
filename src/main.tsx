import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx'
import './index.css'

import { UserProvider } from './contexts/UserProvider'; // Import UserProvider
// Ensure all Firebase initialization happens in firebase.ts, not here

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);