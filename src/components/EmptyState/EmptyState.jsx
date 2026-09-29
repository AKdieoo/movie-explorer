import React from 'react';
import { Box, Typography } from '@mui/material';
import MovieFilterIcon from '@mui/icons-material/MovieFilter';

/**
 * Shown when a list has nothing to display (no results, no favorites...).
 * @param {node} action  optional button or link shown under the message
 */
export default function EmptyState({ title, message, action }) {
  return (
    <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
      <MovieFilterIcon sx={{ fontSize: 64, mb: 1, opacity: 0.6 }} />
      <Typography variant="h6" color="text.primary">
        {title}
      </Typography>
      {message && <Typography>{message}</Typography>}
      {action && <Box sx={{ mt: 3 }}>{action}</Box>}
    </Box>
  );
}
