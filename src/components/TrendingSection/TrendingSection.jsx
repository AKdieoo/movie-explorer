import React, { useEffect, useMemo, useState } from 'react';
import { Box, Button, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';
import useMovies from '../../hooks/useMovies';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loading from '../Loading/Loading';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import EmptyState from '../EmptyState/EmptyState';
import FilterBar from '../FilterBar/FilterBar';
import { EMPTY_FILTERS, filterMovies, hasActiveFilters } from '../../utils/filterHelpers';

/**
 * "Trending Movies" block for the Home page.
 * Fetches through MovieContext and lets the user switch Today / This Week.
 * Genre / year / rating filters are applied in the browser (TMDb cannot filter trending).
 */
export default function TrendingSection() {
  const { trendingMovies, trendingLoading, trendingError, fetchTrending } = useMovies();
  const [timeWindow, setTimeWindow] = useState('week'); // "day" | "week"
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  const filtersActive = hasActiveFilters(filters);
  const visibleMovies = useMemo(() => filterMovies(trendingMovies, filters), [trendingMovies, filters]);

  // Fetch on first render and whenever the toggle changes
  useEffect(() => {
    fetchTrending(timeWindow);
  }, [timeWindow, fetchTrending]);

  return (
    <Box component="section" aria-labelledby="trending-heading">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2, flexWrap: 'wrap' }}>
        <Typography id="trending-heading" variant="h5" component="h2" fontWeight={700}>
          Trending Movies
        </Typography>
        <ToggleButtonGroup
          size="small"
          exclusive
          value={timeWindow}
          onChange={(_, value) => value && setTimeWindow(value)} // ignore click on the already-selected button
          aria-label="Trending time window"
        >
          <ToggleButton value="day">Today</ToggleButton>
          <ToggleButton value="week">This Week</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box sx={{ mb: 3 }}>
        <FilterBar
          filters={filters}
          onChange={(patch) => setFilters((prev) => ({ ...prev, ...patch }))}
          onClear={() => setFilters(EMPTY_FILTERS)}
        />
      </Box>

      {trendingLoading && <Loading count={10} />}

      {!trendingLoading && trendingError && (
        <ErrorMessage message={trendingError} onRetry={() => fetchTrending(timeWindow)} />
      )}

      {!trendingLoading && !trendingError && trendingMovies.length === 0 && (
        <EmptyState title="No trending movies right now" message="Please check back later." />
      )}

      {/* Trending loaded, but the filters hide everything */}
      {!trendingLoading && !trendingError && trendingMovies.length > 0 && visibleMovies.length === 0 && (
        <EmptyState
          title="No trending movies match your filters"
          message="Try a different genre, year or rating."
          action={
            <Button variant="contained" onClick={() => setFilters(EMPTY_FILTERS)}>
              Clear filters
            </Button>
          }
        />
      )}

      {!trendingLoading && !trendingError && visibleMovies.length > 0 && (
        <>
          {filtersActive && (
            <Typography color="text.secondary" sx={{ mb: 2 }} role="status" aria-live="polite">
              Showing {visibleMovies.length} of {trendingMovies.length} trending movies
            </Typography>
          )}
          <MovieGrid movies={visibleMovies} />
        </>
      )}
    </Box>
  );
}
