/** "2010-07-15" -> "2010". Returns "TBA" when the date is missing. */
export const getYear = (releaseDate) => (releaseDate ? releaseDate.slice(0, 4) : 'TBA');

/** 8.7654 -> "8.8". Returns "N/A" for unrated movies (TMDb uses 0). */
export const formatRating = (voteAverage) =>
  voteAverage && voteAverage > 0 ? voteAverage.toFixed(1) : 'N/A';

/** Colour for the rating badge: green = good, amber = ok, red = poor, grey = none. */
export const getRatingColor = (voteAverage) => {
  if (!voteAverage) return '#757575';
  if (voteAverage >= 7) return '#2e7d32';
  if (voteAverage >= 5) return '#ed6c02';
  return '#d32f2f';
};

/** 148 -> "2h 28m". Returns null when TMDb has no runtime. */
export const formatRuntime = (minutes) => {
  if (!minutes) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

/** "2010-07-15" -> "15 July 2010". Returns "TBA" when missing. */
export const formatDate = (dateString) => {
  if (!dateString) return 'TBA';
  const date = new Date(`${dateString}T00:00:00`); // avoid timezone shifting the day
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
};

/**
 * Pick the best YouTube video from TMDb's videos list.
 * Preference: official Trailer > any Trailer > Teaser > any YouTube video.
 * @returns {object|null} the video ({ key, name, ... }) or null if none
 */
export const getTrailer = (videos = []) => {
  const youtube = videos.filter((v) => v.site === 'YouTube');
  return (
    youtube.find((v) => v.type === 'Trailer' && v.official) ||
    youtube.find((v) => v.type === 'Trailer') ||
    youtube.find((v) => v.type === 'Teaser') ||
    youtube[0] ||
    null
  );
};

/**
 * Trim a TMDb movie down to the fields a MovieCard needs.
 * Favorites are saved in localStorage, so we keep them small.
 */
export const toFavoriteMovie = (movie) => ({
  id: movie.id,
  title: movie.title,
  poster_path: movie.poster_path,
  release_date: movie.release_date,
  vote_average: movie.vote_average,
});
