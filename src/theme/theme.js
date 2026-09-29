import { createTheme } from '@mui/material/styles';

/**
 * Builds the Material UI theme for "light" or "dark" mode.
 * Every component in the app reads colours from this theme (palette tokens such as
 * text.secondary, background.paper, action.hover), so switching `mode` restyles the whole app.
 */
export const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      primary: { main: mode === 'dark' ? '#90caf9' : '#1565c0' },
      secondary: { main: '#ff4d6d' },
      background:
        mode === 'dark'
          ? { default: '#0b1120', paper: '#131c31' }
          : { default: '#f4f6fa', paper: '#ffffff' },
    },
    shape: { borderRadius: 12 },
    typography: {
      fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
      button: { textTransform: 'none', fontWeight: 600 },
    },
    components: {
      // Visible keyboard focus on links (movie cards, footer...)
      MuiCssBaseline: {
        styleOverrides: {
          'a:focus-visible': { outline: '3px solid #ff4d6d', outlineOffset: 2 },
        },
      },
      // Navbar: solid brand colour in light mode, dark surface in dark mode
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'dark' ? '#131c31' : '#1565c0',
            color: '#ffffff',
            backgroundImage: 'none',
          },
        },
      },
      // Cards get a subtle border so they stay visible on dark backgrounds
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            border: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
          },
        },
      },
    },
  });
