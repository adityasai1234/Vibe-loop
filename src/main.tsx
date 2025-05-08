import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { app } from './firebaseConfig';

// Ensure Firebase is initialized
console.log('Firebase initialized:', app.name);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);