import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeModeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { MovieProvider } from './context/MovieContext';
import AppRoutes from './routes/AppRoutes';
import './App.css';

/**
 * Root component.
 * ThemeModeProvider: light/dark mode (also applies the Material UI theme + CssBaseline).
 * AuthProvider: local demo login session (Phase 9).
 * MovieProvider: shared movie state (trending, search, favorites) for every page.
 */
export default function App() {
  return (
    <ThemeModeProvider>
      <AuthProvider>
        <BrowserRouter>
          <MovieProvider>
            <AppRoutes />
          </MovieProvider>
        </BrowserRouter>
      </AuthProvider>
    </ThemeModeProvider>
  );
}
