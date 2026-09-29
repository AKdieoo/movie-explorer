import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

/** Convenience hook: const { mode, toggleTheme } = useThemeMode(); */
export default function useThemeMode() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeMode must be used inside <ThemeModeProvider>');
  return ctx;
}
