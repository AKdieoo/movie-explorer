import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import OfflineBanner from '../components/OfflineBanner/OfflineBanner';
import ScrollToTop from '../components/ScrollToTop/ScrollToTop';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute';
import Login from '../pages/Login/Login';
import Home from '../pages/Home/Home';
import Search from '../pages/Search/Search';
import MovieDetailsPage from '../pages/MovieDetails/MovieDetailsPage';
import Favorites from '../pages/Favorites/Favorites';
import NotFound from '../pages/NotFound/NotFound';

// Layout used by every page except Login:
// skip link, navbar, offline warning, page content, footer.
function MainLayout() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Accessibility: keyboard users can jump past the navbar. Visible only when focused. */}
      <Box
        component="a"
        href="#main-content"
        sx={{
          position: 'absolute',
          left: 8,
          top: -60,
          zIndex: (theme) => theme.zIndex.tooltip,
          px: 2,
          py: 1,
          borderRadius: 1,
          bgcolor: 'secondary.main',
          color: '#fff',
          fontWeight: 600,
          textDecoration: 'none',
          '&:focus': { top: 8 },
        }}
      >
        Skip to main content
      </Box>

      <Navbar />
      <OfflineBanner />

      <Box component="main" id="main-content" tabIndex={-1} sx={{ flexGrow: 1, outline: 'none' }}>
        <Outlet />
      </Box>

      <Footer />
    </Box>
  );
}

/**
 * All application routes.
 *   /login       Login (no navbar)
 *   /            Home
 *   /search      Search
 *   /movie/:id   Movie details
 *   /favorites   Favorites
 *   *            Page not found
 * Every route except /login is protected: signed-out users are sent to /login.
 */
export default function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Everything below needs a signed-in user */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/movie/:id" element={<MovieDetailsPage />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}
