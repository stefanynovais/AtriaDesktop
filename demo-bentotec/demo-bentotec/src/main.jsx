import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/outfit/400.css';
import '@fontsource/outfit/500.css';
import '@fontsource/outfit/600.css';
import '@fontsource/outfit/700.css';
import './index.css';
import QuizBentotec from './pages/QuizBentotec/QuizBentotec';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QuizBentotec />
  </StrictMode>,
);
