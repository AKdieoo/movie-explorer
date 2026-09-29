import { useState, useEffect, useCallback } from 'react';
import { getMovieDetails, getMovieCredits, getMovieVideos } from '../services/tmdbApi';
import { getTrailer } from '../utils/movieHelpers';

/**
 * Loads everything the details page needs for one movie id:
 * details (required), plus cast and trailer (optional extras).
 * @returns {{ movie, cast, trailer, loading, error, retry }}
 */
export default function useMovieDetails(movieId) {
  const [state, setState] = useState({ movie: null, cast: [], trailer: null, loading: true, error: null });
  const [attempt, setAttempt] = useState(0); // bump to re-run the effect (retry button)

  useEffect(() => {
    let cancelled = false; // ignore the response if the user already left / changed movie
    setState({ movie: null, cast: [], trailer: null, loading: true, error: null });
    window.scrollTo(0, 0);

    (async () => {
      try {
        // Three requests in parallel. Cast and videos are optional, so their
        // failure must not break the whole page.
        const [movie, credits, videos] = await Promise.all([
          getMovieDetails(movieId),
          getMovieCredits(movieId).catch(() => ({ cast: [] })),
          getMovieVideos(movieId).catch(() => ({ results: [] })),
        ]);
        if (cancelled) return;
        setState({
          movie,
          cast: credits.cast || [],
          trailer: getTrailer(videos.results),
          loading: false,
          error: null,
        });
      } catch (err) {
        if (cancelled) return;
        const message =
          err.status === 404 ? 'Movie details could not be found.' : err.message;
        setState({ movie: null, cast: [], trailer: null, loading: false, error: message });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [movieId, attempt]);

  const retry = useCallback(() => setAttempt((a) => a + 1), []);
  return { ...state, retry };
}
