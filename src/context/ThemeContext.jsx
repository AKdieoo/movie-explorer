import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { getTheme } from '../theme/theme';
import { getItem, setItem } from '../utils/localStorage';
import { STORAGE_KEYS } from '../utils/constants';

export const ThemeContext = createContext(null);

/** Decide the first theme: saved choice -> else the device's preference -> else light. */
const getInitialMode = () => {
  const saved = getItem(STORAGE_KEYS.THEME);
  if (saved === 'light' || saved === 'dark') return saved;
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    return 'light';
  }
};

/**
 * Light / dark mode (Context API).
 * - Remembers the choice in localStorage (survives refresh).
 * - Wraps the app in the Material UI ThemeProvider so every component restyles.
 * - Stays in sync across browser tabs.
 */
export function ThemeModeProvider({ children }) {
  // Read once, synchronously, so there is no light->dark flash on refresh
  const [mode, setMode] = useState(getInitialMode);

  const toggleTheme = useCallback(() => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  // Save the choice and tell the browser (scrollbars, mobile address bar)
  useEffect(() => {
    setItem(STORAGE_KEYS.THEME, mode);
    document.documentElement.style.colorScheme = mode;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', mode === 'dark' ? '#131c31' : '#1565c0');
  }, [mode]);

  // Another tab changed the theme -> follow it
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== STORAGE_KEYS.THEME || e.newValue === null) return;
      try {
        const next = JSON.parse(e.newValue);
        if (next === 'light' || next === 'dark') setMode(next);
      } catch {
        /* ignore corrupted value */
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const theme = useMemo(() => getTheme(mode), [mode]);
  const value = useMemo(() => ({ mode, toggleTheme }), [mode, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}
