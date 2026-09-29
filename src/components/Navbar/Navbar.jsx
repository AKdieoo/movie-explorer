import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, IconButton, Box, Badge, Tooltip } from '@mui/material';
import MovieIcon from '@mui/icons-material/Movie';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LogoutIcon from '@mui/icons-material/Logout';
import useMovies from '../../hooks/useMovies';
import useAuth from '../../hooks/useAuth';
import ThemeToggle from '../ThemeToggle/ThemeToggle';

// Single source of truth for the navigation links
const links = [
  { to: '/', label: 'Home', icon: <HomeIcon />, end: true },
  { to: '/search', label: 'Search', icon: <SearchIcon /> },
  { to: '/favorites', label: 'Favorites', icon: <FavoriteIcon /> },
];

/**
 * Top navigation bar (mobile-first).
 * - xs screens: icon buttons only
 * - sm and up: icon + text buttons
 * Has the light/dark toggle (Phase 8), the signed-in username and a logout button (Phase 9).
 */
export default function Navbar() {
  const { favorites } = useMovies();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  // Show how many favorites are saved on the Favorites link
  const iconFor = (l) =>
    l.to === '/favorites' ? (
      <Badge badgeContent={favorites.length} color="secondary" max={99}>
        {l.icon}
      </Badge>
    ) : (
      l.icon
    );

  // Highlights the link that matches the current route
  const activeStyle = ({ isActive }) => ({
    textDecoration: 'none',
    color: 'inherit',
    opacity: isActive ? 1 : 0.7,
    borderBottom: isActive ? '2px solid currentColor' : '2px solid transparent',
  });

  return (
    <AppBar position="sticky" elevation={1}>
      <Toolbar sx={{ gap: 1 }}>
        <MovieIcon sx={{ mr: 0.5 }} />
        <Typography
          variant="h6"
          component={NavLink}
          to="/"
          sx={{ textDecoration: 'none', color: 'inherit', fontWeight: 700, flexGrow: 1 }}
        >
          Movie Explorer
        </Typography>

        <Box component="nav" aria-label="Main navigation" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {links.map((l) => (
            <React.Fragment key={l.to}>
              {/* Icon-only on phones */}
              <IconButton
                component={NavLink}
                to={l.to}
                end={l.end}
                aria-label={l.label}
                color="inherit"
                style={activeStyle}
                sx={{ display: { xs: 'inline-flex', sm: 'none' } }}
              >
                {iconFor(l)}
              </IconButton>
              {/* Icon + text on tablets and desktops */}
              <Button
                component={NavLink}
                to={l.to}
                end={l.end}
                color="inherit"
                startIcon={iconFor(l)}
                style={activeStyle}
                sx={{ display: { xs: 'none', sm: 'inline-flex' }, borderRadius: 0 }}
              >
                {l.label}
              </Button>
            </React.Fragment>
          ))}
        </Box>

        <Box sx={{ ml: 0.5, display: 'flex', alignItems: 'center' }}>
          <ThemeToggle />
          {/* Username is hidden on phones to save space */}
          <Typography variant="body2" sx={{ mx: 1, display: { xs: 'none', md: 'block' } }}>
            {user?.username}
          </Typography>
          <Tooltip title="Logout">
            <IconButton color="inherit" onClick={handleLogout} aria-label="Logout">
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
