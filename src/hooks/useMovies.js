import { useContext } from 'react';
import { MovieContext } from '../context/MovieContext';

/** Convenience hook: const { trendingMovies, ... } = useMovies(); */
export default function useMovies() {
  const ctx = useContext(MovieContext);
  if (!ctx) throw new Error('useMovies must be used inside <MovieProvider>');
  return ctx;
}
