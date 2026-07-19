import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './assets/global.css';
import { AppRouter } from './routes/AppRouter.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>,
);
