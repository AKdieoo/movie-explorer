import React, { createContext, useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { getTrending, searchMovies, discoverMovies, getGenres } from '../services/tmdbApi';
import { getItem, setItem } from '../utils/localStorage';
import { STORAGE_KEYS } from '../utils/constants';
import { toFavoriteMovie } from '../utils/movieHelpers';
import { EMPTY_FILTERS, FALLBACK_GENRES, hasActiveFilters } from '../utils/filterHelpers';

export const MovieContext = createContext(null);

/**
 * Fetch one page of whatever is currently shown.
 * Title typed -> TMDb search (year filtered by TMDb). No title -> TMDb discover (all filters).
 * Lives outside the component so it never changes between renders.
 */
const fetchPage = (s, page) =>
  s.query
    ? searchMovies(s.query, page, { year: s.filters.year })
    : discoverMovies(page, s.filters);

/**
 * Shared movie state for the whole app (Context API).
 *   Phase 4: trending movies
 *   Phase 5: search results, infinite scroll, last search (localStorage)
 *   Phase 7: favorites (localStorage)
 *   Phase 11: genre / year / rating filters for search (and "browse by filters")
 */
export function MovieProvider({ children }) {
  // ---------------- Trending ----------------
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingLoading, setTrendingLoading] = useState(false);
  const [trendingError, setTrendingError] = useState(null);
  const latestTrendingRequest = useRef(0); // ignore outdated responses

  const fetchTrending = useCallback(async (timeWindow = 'week') => {
    const requestId = ++latestTrendingRequest.current;
    setTrendingLoading(true);
    setTrendingError(null);
    try {
      const data = await getTrending(timeWindow, 1);
      if (requestId !== latestTrendingRequest.current) return;
      setTrendingMovies(data.results);
    } catch (err) {
      if (requestId !== latestTrendingRequest.current) return;
      setTrendingError(err.message);
    } finally {
      if (requestId === latestTrendingRequest.current) setTrendingLoading(false);
    }
  }, []);

  // ---------------- Filters (Phase 11) ----------------
  // The Search page has two modes:
  //   * search mode  - the user typed a title. TMDb filters by year; genre and rating are
  //                    applied in the browser (TMDb cannot filter a text search by them).
  //   * browse mode  - no title, but a filter is set. TMDb "discover" does all the filtering.
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const filtersRef = useRef(EMPTY_FILTERS); // latest filters for async code

  const [genres, setGenres] = useState(FALLBACK_GENRES);
  const genresRequested = useRef(false);

  /** Load the genre list from TMDb once. On failure the built-in list stays in use. */
  const fetchGenres = useCallback(async () => {
    if (genresRequested.current) return;
    genresRequested.current = true;
    try {
      const data = await getGenres();
      if (Array.isArray(data.genres) && data.genres.length > 0) setGenres(data.genres);
    } catch {
      /* keep FALLBACK_GENRES */
    }
  }, []);

  // ---------------- Search ----------------
  const [searchQuery, setSearchQuery] = useState('');           // the query currently shown
  const [searchResults, setSearchResults] = useState([]);       // all pages loaded so far
  const [searchTotalResults, setSearchTotalResults] = useState(0);
  const [searchPage, setSearchPage] = useState(0);              // last page loaded
  const [searchHasMore, setSearchHasMore] = useState(false);    // is there another page?
  const [searchLoading, setSearchLoading] = useState(false);    // first page loading
  const [searchLoadingMore, setSearchLoadingMore] = useState(false); // next pages loading
  const [searchError, setSearchError] = useState(null);         // first page failed
  const [searchMoreError, setSearchMoreError] = useState(null); // a later page failed

  // Last searched movie, restored from localStorage on app start
  const [lastSearch, setLastSearch] = useState(() => getItem(STORAGE_KEYS.LAST_SEARCH, ''));

  // Pagination bookkeeping in a ref so loadMore always sees fresh values
  const searchRef = useRef({
    query: '', filters: EMPTY_FILTERS, page: 0, totalPages: 0, busy: false, requestId: 0,
  });

  /** Start a brand-new search or browse (page 1). */
  const runSearch = useCallback(async (rawQuery, activeFilters) => {
    const query = (rawQuery || '').trim();
    const s = searchRef.current;
    const requestId = ++s.requestId;
    Object.assign(s, { query, filters: activeFilters, page: 0, totalPages: 0, busy: false });

    setSearchQuery(query);
    setSearchResults([]);
    setSearchTotalResults(0);
    setSearchPage(0);
    setSearchHasMore(false);
    setSearchError(null);
    setSearchMoreError(null);
    setSearchLoadingMore(false);

    // Nothing typed and no filter chosen -> nothing to show
    if (!query && !hasActiveFilters(activeFilters)) {
      setSearchLoading(false);
      return;
    }

    if (query) {
      setLastSearch(query);
      setItem(STORAGE_KEYS.LAST_SEARCH, query); // persist
    }

    setSearchLoading(true);
    try {
      const data = await fetchPage(s, 1);
      if (requestId !== s.requestId) return; // user searched again meanwhile
      s.page = 1;
      s.totalPages = data.total_pages;
      setSearchResults(data.results);
      setSearchTotalResults(data.total_results);
      setSearchPage(1);
      setSearchHasMore(s.page < s.totalPages);
    } catch (err) {
      if (requestId !== s.requestId) return;
      setSearchError(err.message);
    } finally {
      if (requestId === s.requestId) setSearchLoading(false);
    }
  }, []);

  /** Search by title with the current filters. An empty title switches to browse mode. */
  const search = useCallback((rawQuery) => runSearch(rawQuery, filtersRef.current), [runSearch]);

  /** Change one or more filters, e.g. applyFilters({ genre: 28 }). */
  const applyFilters = useCallback(
    (patch) => {
      const prev = filtersRef.current;
      const next = { ...prev, ...patch };
      filtersRef.current = next;
      setFilters(next);

      // Only ask TMDb again when the change affects what TMDb filters:
      //   search mode -> year only | browse mode -> genre, year and rating
      const serverKey = (q, f) => (q ? `s|${f.year}` : `d|${f.genre}|${f.year}|${f.minRating}`);
      const query = searchRef.current.query;
      if (serverKey(query, prev) !== serverKey(query, next)) runSearch(query, next);
    },
    [runSearch]
  );

  const clearFilters = useCallback(() => applyFilters(EMPTY_FILTERS), [applyFilters]);

  /** Load the next page and APPEND it to the current results (infinite scroll). */
  const loadMore = useCallback(async () => {
    const s = searchRef.current;
    const showingSomething = Boolean(s.query) || hasActiveFilters(s.filters);
    if (!showingSomething || s.busy || s.page === 0 || s.page >= s.totalPages) return;

    s.busy = true;
    const requestId = s.requestId;
    setSearchLoadingMore(true);
    setSearchMoreError(null);
    try {
      const data = await fetchPage(s, s.page + 1);
      if (requestId !== s.requestId) return;
      s.page += 1;
      s.totalPages = data.total_pages;
      // Append, and skip any movie already in the list (TMDb pages can overlap)
      setSearchResults((prev) => {
        const seen = new Set(prev.map((m) => m.id));
        return [...prev, ...data.results.filter((m) => !seen.has(m.id))];
      });
      setSearchPage(s.page);
      setSearchHasMore(s.page < s.totalPages);
    } catch (err) {
      if (requestId !== s.requestId) return;
      setSearchMoreError(err.message);
    } finally {
      if (requestId === s.requestId) {
        s.busy = false;
        setSearchLoadingMore(false);
      }
    }
  }, []);

  // ---------------- Favorites ----------------
  // Read from localStorage on start. Validate the data in case it was edited or corrupted.
  const [favorites, setFavorites] = useState(() => {
    const saved = getItem(STORAGE_KEYS.FAVORITES, []);
    return Array.isArray(saved) ? saved.filter((m) => m && m.id) : [];
  });

  // Save every change to localStorage
  useEffect(() => {
    setItem(STORAGE_KEYS.FAVORITES, favorites);
  }, [favorites]);

  // Keep several open tabs in sync: when another tab changes favorites, update here too
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== STORAGE_KEYS.FAVORITES) return;
      try {
        const next = JSON.parse(e.newValue || '[]');
        if (Array.isArray(next)) setFavorites(next);
      } catch {
        /* ignore corrupted data */
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const favoriteIds = useMemo(() => new Set(favorites.map((m) => m.id)), [favorites]);
  const isFavorite = useCallback((movieId) => favoriteIds.has(movieId), [favoriteIds]);

  /** Add the movie if it is not a favorite yet, otherwise remove it. Newest first. */
  const toggleFavorite = useCallback((movie) => {
    setFavorites((prev) =>
      prev.some((m) => m.id === movie.id)
        ? prev.filter((m) => m.id !== movie.id)
        : [toFavoriteMovie(movie), ...prev]
    );
  }, []);

  const clearFavorites = useCallback(() => setFavorites([]), []);

  const value = useMemo(
    () => ({
      // trending
      trendingMovies,
      trendingLoading,
      trendingError,
      fetchTrending,
      // search
      searchQuery,
      searchResults,
      searchTotalResults,
      searchPage,
      searchHasMore,
      searchLoading,
      searchLoadingMore,
      searchError,
      searchMoreError,
      lastSearch,
      search,
      loadMore,
      // filters
      filters,
      applyFilters,
      clearFilters,
      genres,
      fetchGenres,
      // favorites
      favorites,
      isFavorite,
      toggleFavorite,
      clearFavorites,
    }),
    [
      trendingMovies, trendingLoading, trendingError, fetchTrending,
      searchQuery, searchResults, searchTotalResults, searchPage, searchHasMore, searchLoading,
      searchLoadingMore, searchError, searchMoreError, lastSearch, search, loadMore,
      filters, applyFilters, clearFilters, genres, fetchGenres,
      favorites, isFavorite, toggleFavorite, clearFavorites,
    ]
  );

  return <MovieContext.Provider value={value}>{children}</MovieContext.Provider>;
}
