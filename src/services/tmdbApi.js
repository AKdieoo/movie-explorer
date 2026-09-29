import api from './apiConfig';

/**
 * All TMDb requests live here. Components never call Axios directly.
 * Every function returns the response data (response.data) or throws a
 * friendly Error (see apiConfig.js).
 */

/** Trending movies. timeWindow: "day" or "week". */
export const getTrending = async (timeWindow = 'week', page = 1) => {
  const { data } = await api.get(`/trending/movie/${timeWindow}`, { params: { page } });
  return data; // { page, results, total_pages, total_results }
};

/**
 * Search movies by title. Paginated (used for infinite scroll).
 * @param {object} options  { year } - optional release year (TMDb filters this on their side)
 */
export const searchMovies = async (query, page = 1, { year } = {}) => {
  const { data } = await api.get('/search/movie', {
    params: {
      query,
      page,
      include_adult: false,
      ...(year ? { primary_release_year: year } : {}),
    },
  });
  return data;
};

/**
 * Browse movies by filters without typing a title (TMDb "discover").
 * Used when the user picks a genre / year / rating but has not searched for a name.
 * @param {object} filters  { genre, year, minRating } - empty string = not set
 */
export const discoverMovies = async (page = 1, { genre = '', year = '', minRating = '' } = {}) => {
  const { data } = await api.get('/discover/movie', {
    params: {
      page,
      include_adult: false,
      sort_by: 'popularity.desc',
      ...(genre !== '' ? { with_genres: genre } : {}),
      ...(year !== '' ? { primary_release_year: year } : {}),
      // A minimum vote count keeps obscure 10/10 films with 2 votes out of the list
      ...(minRating !== '' ? { 'vote_average.gte': minRating, 'vote_count.gte': 100 } : {}),
    },
  });
  return data;
};

/** Full details for one movie: title, poster, overview, rating, runtime, genres... */
export const getMovieDetails = async (movieId) => {
  const { data } = await api.get(`/movie/${movieId}`);
  return data;
};

/** Cast and crew for one movie. */
export const getMovieCredits = async (movieId) => {
  const { data } = await api.get(`/movie/${movieId}/credits`);
  return data; // { cast: [...], crew: [...] }
};

/** Trailers, teasers and clips for one movie (YouTube keys). */
export const getMovieVideos = async (movieId) => {
  const { data } = await api.get(`/movie/${movieId}/videos`);
  return data; // { results: [...] }
};

/** List of all movie genres (used by the genre filter). */
export const getGenres = async () => {
  const { data } = await api.get('/genre/movie/list');
  return data; // { genres: [{ id, name }] }
};
