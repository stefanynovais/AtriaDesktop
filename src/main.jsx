import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './assets/global.css';
import { AppRouter } from './routes/AppRouter.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import logo from './assets/logo_window.png';

document.getElementById('favicon').setAttribute('href', logo);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  </StrictMode>,
);
