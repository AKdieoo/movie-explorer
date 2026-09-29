import React, { useEffect, useMemo, useState } from 'react';
import { Box, Button, CircularProgress, Container, Typography } from '@mui/material';
import useMovies from '../../hooks/useMovies';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';
import SearchBar from '../../components/SearchBar/SearchBar';
import FilterBar from '../../components/FilterBar/FilterBar';
import MovieGrid from '../../components/MovieGrid/MovieGrid';
import Loading from '../../components/Loading/Loading';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import EmptyState from '../../components/EmptyState/EmptyState';
import usePageTitle from '../../hooks/usePageTitle';
import { filterMovies, hasActiveFilters } from '../../utils/filterHelpers';

// When genre / rating are applied in the browser, the page keeps loading TMDb pages by itself
// until it has scanned this many. After that the user presses "Load more results".
const AUTO_SCAN_PAGES = 5;

/**
 * Search page: search bar, genre / year / rating filters, results grid, infinite scroll.
 *   - Type a title -> TMDb search (year filtered by TMDb, genre and rating in the browser).
 *   - No title but a filter chosen -> "browse mode" (TMDb discover does all the filtering).
 * On first visit it restores the last search saved in localStorage.
 */
export default function Search() {
  const {
    searchQuery, searchResults, searchTotalResults, searchPage, searchHasMore,
    searchLoading, searchLoadingMore, searchError, searchMoreError,
    lastSearch, search, loadMore, filters, applyFilters, clearFilters,
  } = useMovies();

  const [restored, setRestored] = useState(false);
  usePageTitle(searchQuery ? `Search: ${searchQuery}` : 'Search');

  const filtersActive = hasActiveFilters(filters);
  const querying = Boolean(searchQuery);           // search mode
  const browsing = !querying && filtersActive;     // browse mode
  const active = querying || browsing;             // is there anything to show?

  // Restore the last search when nothing is being shown yet
  useEffect(() => {
    if (!searchQuery && lastSearch && !filtersActive) {
      setRestored(true);
      search(lastSearch);
    }
    // Run once on mount only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (query) => {
    setRestored(false);
    search(query);
  };

  // The X button in the search box: forget the title (browse mode if filters are set)
  const handleClearQuery = () => {
    setRestored(false);
    search('');
  };

  // Genre and rating cannot be sent to TMDb together with a title, so they are applied here
  const clientFilterActive = querying && (filters.genre !== '' || filters.minRating !== '');
  const visibleMovies = useMemo(
    () => filterMovies(searchResults, { genre: filters.genre, minRating: filters.minRating }),
    [searchResults, filters.genre, filters.minRating]
  );

  // Auto-scan budget (only used while filtering in the browser, see AUTO_SCAN_PAGES)
  const [scanUntilPage, setScanUntilPage] = useState(AUTO_SCAN_PAGES);
  useEffect(() => {
    setScanUntilPage(AUTO_SCAN_PAGES);
  }, [searchQuery, filters.genre, filters.year, filters.minRating]);
  const budgetLeft = !clientFilterActive || searchPage < scanUntilPage;

  // Infinite scroll: pause while loading, when no more pages, after a failed page, or when
  // the auto-scan budget is used up
  const canLoadMore =
    searchHasMore && !searchLoading && !searchLoadingMore && !searchMoreError && budgetLeft;
  const sentinelRef = useInfiniteScroll(loadMore, canLoadMore, searchResults.length);

  const needsManualLoad =
    clientFilterActive && searchHasMore && !budgetLeft && !searchLoadingMore && !searchMoreError;
  const handleScanMore = () => {
    setScanUntilPage(searchPage + AUTO_SCAN_PAGES);
    loadMore();
  };

  const hasResults = searchResults.length > 0;      // what TMDb returned
  const hasVisible = visibleMovies.length > 0;      // what is left after our own filtering
  const idle = !searchLoading && !searchError;
  const nothingFound = active && idle && !hasResults;
  const nothingMatches = active && idle && hasResults && !hasVisible;

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
      <Typography variant="h4" component="h1" fontWeight={700} textAlign="center" gutterBottom>
        Search Movies
      </Typography>
      <SearchBar
        onSearch={handleSearch}
        onClear={handleClearQuery}
        initialValue={searchQuery}
        autoFocus={!lastSearch}
      />

      <Box sx={{ maxWidth: 900, mx: 'auto', mt: 2 }}>
        <FilterBar filters={filters} onChange={applyFilters} onClear={clearFilters} />
      </Box>

      {/* Status line */}
      {active && idle && (
        <>
          {querying && hasResults && !clientFilterActive && (
            <Typography color="text.secondary" sx={{ mt: 3, mb: 2 }} role="status" aria-live="polite">
              {searchTotalResults.toLocaleString()} results for <strong>"{searchQuery}"</strong>
              {restored && ' (restored from your last search)'}
            </Typography>
          )}
          {clientFilterActive && hasVisible && (
            <Typography color="text.secondary" sx={{ mt: 3, mb: 2 }} role="status" aria-live="polite">
              Showing {visibleMovies.length} movies matching your filters, out of {searchResults.length} loaded
              results for <strong>"{searchQuery}"</strong>
            </Typography>
          )}
          {browsing && hasResults && (
            <Typography color="text.secondary" sx={{ mt: 3, mb: 2 }} role="status" aria-live="polite">
              {searchTotalResults.toLocaleString()} movies match your filters
            </Typography>
          )}
        </>
      )}

      <Box sx={{ mt: hasVisible ? 0 : 4 }}>
        {/* 1. Nothing typed and no filter chosen */}
        {!active && !searchLoading && (
          <EmptyState
            title="Find a movie"
            message="Type a title above, for example Batman or Inception, or pick a genre, year or rating to browse."
          />
        )}

        {/* 2. First page loading */}
        {searchLoading && <Loading count={10} />}

        {/* 3. First page failed */}
        {!searchLoading && searchError && (
          <ErrorMessage message={searchError} onRetry={() => search(searchQuery)} />
        )}

        {/* 4. TMDb found nothing */}
        {nothingFound && (
          <EmptyState
            title={querying ? `No movies found for "${searchQuery}"` : 'No movies match these filters'}
            message={
              querying && filtersActive
                ? 'Check the spelling, or try a different year.'
                : querying
                  ? 'Check the spelling or try a different title.'
                  : 'Try a different genre, year or rating.'
            }
            action={
              filtersActive && (
                <Button variant="contained" onClick={clearFilters}>
                  Clear filters
                </Button>
              )
            }
          />
        )}

        {/* 5. Movies were loaded, but the genre / rating filter hides all of them (so far) */}
        {nothingMatches && (
          <EmptyState
            title="No movies match your filters yet"
            message={
              searchHasMore
                ? 'Only some of the results have been checked so far. Load more, or clear your filters.'
                : 'None of the results match. Try a different genre or rating.'
            }
            action={
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                {needsManualLoad && (
                  <Button variant="contained" onClick={handleScanMore}>
                    Load more results
                  </Button>
                )}
                <Button onClick={clearFilters}>Clear filters</Button>
              </Box>
            }
          />
        )}

        {/* 6. Results */}
        {!searchLoading && hasVisible && <MovieGrid movies={visibleMovies} />}

        {/* Infinite scroll area (also present while the filter hides everything, so more pages can load) */}
        {!searchLoading && hasResults && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            {searchLoadingMore && <CircularProgress aria-label="Loading more movies" />}

            {searchMoreError && (
              <Box sx={{ maxWidth: 480, mx: 'auto' }}>
                <ErrorMessage message={searchMoreError} onRetry={loadMore} />
              </Box>
            )}

            {needsManualLoad && hasVisible && (
              <>
                <Typography color="text.secondary" sx={{ mb: 1 }}>
                  Genre and rating are checked on the results loaded so far.
                </Typography>
                <Button variant="outlined" onClick={handleScanMore}>
                  Load more results
                </Button>
              </>
            )}

            {!searchHasMore && !searchLoadingMore && !searchMoreError && hasVisible && (
              <Typography color="text.secondary">You have reached the end of the results.</Typography>
            )}

            {/* Invisible marker: when it scrolls into view the next page loads */}
            <div ref={sentinelRef} style={{ height: 1 }} />
          </Box>
        )}
      </Box>
    </Container>
  );
}
