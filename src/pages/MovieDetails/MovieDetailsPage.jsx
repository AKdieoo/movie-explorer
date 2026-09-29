import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Container } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import useMovieDetails from '../../hooks/useMovieDetails';
import MovieDetails from '../../components/MovieDetails/MovieDetails';
import MovieDetailsSkeleton from '../../components/MovieDetails/MovieDetailsSkeleton';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import usePageTitle from '../../hooks/usePageTitle';

/** Route /movie/:id - loads the movie and shows loading / error / details. */
export default function MovieDetailsPage() {
  const { id } = useParams(); // value of :id from the URL
  const navigate = useNavigate();
  const { movie, cast, trailer, loading, error, retry } = useMovieDetails(id);
  usePageTitle(movie ? movie.title : 'Movie details');

  return (
    <Box>
      {/* Back button (goes to the previous page: search results, home or favorites) */}
      <Container maxWidth="lg" sx={{ pt: 2, position: 'relative', zIndex: 1 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} color="inherit">
          Back
        </Button>
      </Container>

      {loading && <MovieDetailsSkeleton />}

      {!loading && error && (
        <Container maxWidth="sm" sx={{ py: 6 }}>
          <ErrorMessage message={error} onRetry={retry} />
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Button component={Link} to="/" variant="outlined">
              Go to Home
            </Button>
          </Box>
        </Container>
      )}

      {!loading && movie && <MovieDetails movie={movie} cast={cast} trailer={trailer} />}
    </Box>
  );
}
