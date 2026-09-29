import React from 'react';
import { Box } from '@mui/material';
import MovieCard from '../MovieCard/MovieCard';
import { MOVIE_GRID_SX } from '../../utils/constants';

/** Responsive grid of MovieCards. Used by Trending, Search and Favorites. */
export default function MovieGrid({ movies }) {
  return (
    <Box sx={MOVIE_GRID_SX}>
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </Box>
  );
}
