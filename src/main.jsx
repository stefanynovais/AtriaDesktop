import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './assets/global.css';
import { AppRouter } from './routes/AppRouter.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  </StrictMode>,
);
