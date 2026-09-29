// Shared responsive grid layout for movie posters (mobile-first).
// Mobile: 2 columns | Tablet: 3-4 | Desktop: 5-6
export const MOVIE_GRID_SX = {
  display: 'grid',
  gap: { xs: 1.5, sm: 2, md: 3 },
  gridTemplateColumns: {
    xs: 'repeat(2, 1fr)',
    sm: 'repeat(3, 1fr)',
    md: 'repeat(4, 1fr)',
    lg: 'repeat(5, 1fr)',
    xl: 'repeat(6, 1fr)',
  },
};

// Keys used in the browser's localStorage (one place, so they never get mistyped)
export const STORAGE_KEYS = {
  LAST_SEARCH: 'movieExplorer.lastSearch',
  FAVORITES: 'movieExplorer.favorites',
  THEME: 'movieExplorer.theme', // "light" or "dark"
  SESSION: 'movieExplorer.session', // signed-in demo user
};

// Demo account for the local login (there is no backend - see AuthContext)
export const DEMO_USER = {
  username: 'demo',
  password: 'movie123',
};
