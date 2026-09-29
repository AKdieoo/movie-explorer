import React, { useEffect, useMemo } from 'react';
import { Box, Button, MenuItem, TextField } from '@mui/material';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import useMovies from '../../hooks/useMovies';
import { getYearOptions, RATING_OPTIONS, hasActiveFilters } from '../../utils/filterHelpers';

// Shared props: small outlined dropdowns that show "Any ..." when nothing is chosen
const dropdown = {
  select: true,
  size: 'small',
  fullWidth: true,
  InputLabelProps: { shrink: true },
  SelectProps: { displayEmpty: true },
};

/**
 * Genre / Year / Minimum rating dropdowns. Reusable on Home (trending) and Search.
 * It only shows the controls; the parent decides what to do with the values.
 * @param {object}   filters   { genre, year, minRating } ('' = not set)
 * @param {Function} onChange  called with the changed part, e.g. { genre: 28 }
 * @param {Function} onClear   called by the "Clear filters" button
 */
export default function FilterBar({ filters, onChange, onClear }) {
  const { genres, fetchGenres } = useMovies();
  const years = useMemo(() => getYearOptions(), []);

  // Load the genre list once (falls back to a built-in list if the request fails)
  useEffect(() => {
    fetchGenres();
  }, [fetchGenres]);

  return (
    <Box
      role="group"
      aria-label="Filter movies"
      sx={{
        display: 'grid',
        gap: 1.5,
        alignItems: 'center',
        gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(3, minmax(0, 1fr)) auto' },
      }}
    >
      <TextField
        {...dropdown}
        label="Genre"
        value={filters.genre}
        onChange={(e) => onChange({ genre: e.target.value })}
        sx={{ gridColumn: { xs: '1 / -1', sm: 'auto' } }}
      >
        <MenuItem value="">Any genre</MenuItem>
        {genres.map((g) => (
          <MenuItem key={g.id} value={g.id}>
            {g.name}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        {...dropdown}
        label="Release year"
        value={filters.year}
        onChange={(e) => onChange({ year: e.target.value })}
        SelectProps={{ ...dropdown.SelectProps, MenuProps: { PaperProps: { sx: { maxHeight: 320 } } } }}
      >
        <MenuItem value="">Any year</MenuItem>
        {years.map((y) => (
          <MenuItem key={y} value={y}>
            {y}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        {...dropdown}
        label="Minimum rating"
        value={filters.minRating}
        onChange={(e) => onChange({ minRating: e.target.value })}
      >
        <MenuItem value="">Any rating</MenuItem>
        {RATING_OPTIONS.map((r) => (
          <MenuItem key={r} value={r}>
            {r}+ stars
          </MenuItem>
        ))}
      </TextField>

      <Button
        onClick={onClear}
        startIcon={<FilterAltOffIcon />}
        disabled={!hasActiveFilters(filters)}
        sx={{ gridColumn: { xs: '1 / -1', sm: 'auto' } }}
      >
        Clear filters
      </Button>
    </Box>
  );
}
