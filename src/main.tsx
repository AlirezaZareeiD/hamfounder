import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx'
import './index.css'

// Corrected import path to UserProvider.tsx
import { UserProvider } from './contexts/UserProvider';
// Ensure all Firebase initialization happens in firebase.ts, not here

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Wrap App with UserProvider */}
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>,
);
