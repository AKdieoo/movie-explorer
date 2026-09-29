import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import useThemeMode from '../../hooks/useThemeMode';

/** Round button that switches between light and dark mode. */
export default function ThemeToggle(props) {
  const { mode, toggleTheme } = useThemeMode();
  const isDark = mode === 'dark';
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <Tooltip title={label}>
      <IconButton color="inherit" onClick={toggleTheme} aria-label={label} {...props}>
        {/* Show the icon of the mode you will switch TO */}
        {isDark ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>
    </Tooltip>
  );
}
