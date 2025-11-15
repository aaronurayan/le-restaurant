import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initConsoleSuppression } from './utils/consoleSuppressor';

// Suppress network errors in console during development
initConsoleSuppression();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
