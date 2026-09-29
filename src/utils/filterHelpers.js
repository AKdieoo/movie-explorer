/**
 * Helpers for the genre / year / rating filters.
 * An empty string ('') means "not set" for every filter.
 */

export const EMPTY_FILTERS = { genre: '', year: '', minRating: '' };

/** true when at least one filter is set */
export const hasActiveFilters = (f) => f.genre !== '' || f.year !== '' || f.minRating !== '';

/**
 * Filter a list of TMDb movies in the browser.
 * Used for Trending (TMDb cannot filter it) and for search results (TMDb cannot filter
 * a text search by genre or rating).
 */
export const filterMovies = (movies, { genre = '', year = '', minRating = '' } = {}) =>
  movies.filter((m) => {
    if (genre !== '' && !(m.genre_ids || []).includes(genre)) return false;
    if (year !== '' && !(m.release_date || '').startsWith(String(year))) return false;
    if (minRating !== '' && (m.vote_average || 0) < minRating) return false;
    return true;
  });

/** Years for the dropdown: next year down to 1950 (newest first). */
export const getYearOptions = () => {
  const latest = new Date().getFullYear() + 1;
  const years = [];
  for (let y = latest; y >= 1950; y -= 1) years.push(String(y));
  return years;
};

/** "Minimum rating" dropdown choices (TMDb ratings go from 0 to 10). */
export const RATING_OPTIONS = [5, 6, 7, 8, 9];

/**
 * TMDb's standard genre list. Used only if the live /genre/movie/list request fails,
 * so the genre filter always works.
 */
export const FALLBACK_GENRES = [
  { id: 28, name: 'Action' }, { id: 12, name: 'Adventure' }, { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' }, { id: 80, name: 'Crime' }, { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' }, { id: 10751, name: 'Family' }, { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' }, { id: 27, name: 'Horror' }, { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' }, { id: 10749, name: 'Romance' }, { id: 878, name: 'Science Fiction' },
  { id: 10770, name: 'TV Movie' }, { id: 53, name: 'Thriller' }, { id: 10752, name: 'War' },
  { id: 37, name: 'Western' },
];
