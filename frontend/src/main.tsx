import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AnalysisProvider } from './contexts/AnalysisContext';
import { router } from './routes';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AnalysisProvider>
        <RouterProvider router={router} />
      </AnalysisProvider>
    </ThemeProvider>
  </StrictMode>
);