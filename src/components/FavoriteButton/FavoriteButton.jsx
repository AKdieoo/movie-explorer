import React from 'react';
import { Button, IconButton, Tooltip } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import useMovies from '../../hooks/useMovies';

/**
 * Heart button that adds / removes a movie from favorites.
 * @param {object} movie     any TMDb movie object (needs id, title, poster_path...)
 * @param {"icon"|"button"} variant  "icon" = round heart on a card, "button" = text button
 */
export default function FavoriteButton({ movie, variant = 'icon' }) {
  const { isFavorite, toggleFavorite } = useMovies();
  const active = isFavorite(movie.id);
  const label = active ? 'Remove from favorites' : 'Add to favorites';

  if (variant === 'button') {
    return (
      <Button
        variant={active ? 'contained' : 'outlined'}
        color="error"
        size="large"
        startIcon={active ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        onClick={() => toggleFavorite(movie)}
        aria-pressed={active}
      >
        {active ? 'In Favorites' : 'Add to Favorites'}
      </Button>
    );
  }

  return (
    <Tooltip title={label}>
      <IconButton
        aria-label={label}
        aria-pressed={active}
        onClick={() => toggleFavorite(movie)}
        size="small"
        sx={{
          bgcolor: 'rgba(0,0,0,0.55)',
          color: active ? '#ff4d6d' : '#fff',
          '&:hover': { bgcolor: 'rgba(0,0,0,0.75)' },
        }}
      >
        {active ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
      </IconButton>
    </Tooltip>
  );
}
