import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box, Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography,
} from '@mui/material';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import useMovies from '../../hooks/useMovies';
import MovieGrid from '../../components/MovieGrid/MovieGrid';
import EmptyState from '../../components/EmptyState/EmptyState';
import usePageTitle from '../../hooks/usePageTitle';

/** Route /favorites - shows every movie saved in localStorage. */
export default function Favorites() {
  const { favorites, clearFavorites } = useMovies();
  const [confirmOpen, setConfirmOpen] = useState(false);
  usePageTitle('Favorites');

  const handleClear = () => {
    clearFavorites();
    setConfirmOpen(false);
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight={700}>
            My Favorites
          </Typography>
          {favorites.length > 0 && (
            <Typography color="text.secondary">
              {favorites.length} {favorites.length === 1 ? 'movie' : 'movies'} saved on this device
            </Typography>
          )}
        </Box>
        {favorites.length > 0 && (
          <Button color="error" startIcon={<DeleteSweepIcon />} onClick={() => setConfirmOpen(true)}>
            Clear all
          </Button>
        )}
      </Box>

      {favorites.length === 0 ? (
        <EmptyState
          title="No favorites yet"
          message="Tap the heart on any movie to save it here."
          action={
            <Button component={Link} to="/" variant="contained">
              Browse trending movies
            </Button>
          }
        />
      ) : (
        <MovieGrid movies={favorites} />
      )}

      {/* Confirmation before deleting everything */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} aria-labelledby="clear-title">
        <DialogTitle id="clear-title">Remove all favorites?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This removes all {favorites.length} saved movies from this device. This cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button color="error" onClick={handleClear}>
            Remove all
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
