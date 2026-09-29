import React from 'react';
import { Box, Skeleton } from '@mui/material';
import { MOVIE_GRID_SX } from '../../utils/constants';

/**
 * Skeleton placeholders shaped like movie cards, shown while data loads.
 * @param {number} count how many placeholder cards to show
 */
export default function Loading({ count = 10 }) {
  return (
    <Box sx={MOVIE_GRID_SX} aria-busy="true" aria-label="Loading movies">
      {Array.from({ length: count }).map((_, i) => (
        <Box key={i}>
          <Skeleton variant="rounded" sx={{ width: '100%', aspectRatio: '2 / 3', height: 'auto' }} />
          <Skeleton width="80%" sx={{ mt: 1 }} />
          <Skeleton width="40%" />
        </Box>
      ))}
    </Box>
  );
}
