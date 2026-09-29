import React, { useState } from 'react';
import { Box, Button, Chip, Container, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import MovieIcon from '@mui/icons-material/Movie';
import { getImageUrl } from '../../services/apiConfig';
import { getYear, formatRating, getRatingColor, formatRuntime, formatDate } from '../../utils/movieHelpers';
import CastList from '../CastList/CastList';
import TrailerDialog from '../TrailerDialog/TrailerDialog';
import FavoriteButton from '../FavoriteButton/FavoriteButton';

/**
 * Full movie view: backdrop, poster, facts, overview, trailer button and cast.
 * Purely presentational: the page passes in already-loaded data.
 */
export default function MovieDetails({ movie, cast, trailer }) {
  const [trailerOpen, setTrailerOpen] = useState(false);

  const backdrop = getImageUrl(movie.backdrop_path, 'w1280');
  const poster = getImageUrl(movie.poster_path, 'w500');
  const runtime = formatRuntime(movie.runtime);

  return (
    <Box>
      {/* Backdrop banner that fades into the page background */}
      <Box
        sx={{
          height: { xs: 200, sm: 300, md: 400 },
          backgroundColor: 'primary.dark',
          backgroundImage: (theme) =>
            `linear-gradient(to bottom, rgba(0,0,0,0.25), ${theme.palette.background.default})${
              backdrop ? `, url(${backdrop})` : ''
            }`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
      />

      <Container maxWidth="lg" sx={{ mt: { xs: -10, sm: -14, md: -20 }, position: 'relative', pb: 6 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 2, md: 4 } }}>
          {/* Poster */}
          <Box sx={{ alignSelf: { xs: 'center', md: 'flex-start' }, width: { xs: 180, sm: 220, md: 300 }, flexShrink: 0 }}>
            {poster ? (
              <Box
                component="img"
                src={poster}
                alt={`${movie.title} poster`}
                sx={{ width: '100%', aspectRatio: '2 / 3', objectFit: 'cover', borderRadius: 3, boxShadow: 6, bgcolor: 'action.hover' }}
              />
            ) : (
              <Box
                sx={{
                  width: '100%', aspectRatio: '2 / 3', borderRadius: 3, boxShadow: 6, bgcolor: 'action.hover',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.disabled',
                }}
              >
                <MovieIcon sx={{ fontSize: 64 }} />
              </Box>
            )}
          </Box>

          {/* Facts */}
          <Box sx={{ flex: 1, mt: { md: 12 }, textAlign: { xs: 'center', md: 'left' } }}>
            <Typography variant="h3" component="h1" fontWeight={800} sx={{ fontSize: { xs: '1.75rem', md: '2.5rem' } }}>
              {movie.title}{' '}
              <Typography component="span" color="text.secondary" sx={{ fontSize: 'inherit', fontWeight: 400 }}>
                ({getYear(movie.release_date)})
              </Typography>
            </Typography>

            {movie.tagline && (
              <Typography color="text.secondary" sx={{ fontStyle: 'italic', mt: 0.5 }}>
                {movie.tagline}
              </Typography>
            )}

            {/* Rating, release date, runtime */}
            <Box
              sx={{
                display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, mt: 2,
                justifyContent: { xs: 'center', md: 'flex-start' },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: getRatingColor(movie.vote_average) }}>
                <StarIcon />
                <Typography fontWeight={700} color="inherit">
                  {formatRating(movie.vote_average)}
                </Typography>
                {movie.vote_count > 0 && (
                  <Typography variant="body2" color="text.secondary">
                    ({movie.vote_count.toLocaleString()} votes)
                  </Typography>
                )}
              </Box>
              <Typography color="text.secondary">{formatDate(movie.release_date)}</Typography>
              {runtime && <Typography color="text.secondary">{runtime}</Typography>}
            </Box>

            {/* Genres */}
            {movie.genres?.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                {movie.genres.map((g) => (
                  <Chip key={g.id} label={g.name} variant="outlined" />
                ))}
              </Box>
            )}

            {/* Overview */}
            <Typography variant="h6" component="h2" fontWeight={700} sx={{ mt: 3 }}>
              Overview
            </Typography>
            <Typography sx={{ mt: 0.5, lineHeight: 1.7 }}>
              {movie.overview || 'No overview is available for this movie.'}
            </Typography>

            {/* Trailer */}
            <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
              {trailer ? (
                <Button variant="contained" size="large" startIcon={<PlayArrowIcon />} onClick={() => setTrailerOpen(true)}>
                  Watch Trailer
                </Button>
              ) : (
                <Button variant="outlined" size="large" disabled>
                  Trailer not available
                </Button>
              )}
              <FavoriteButton movie={movie} variant="button" />
            </Box>
          </Box>
        </Box>

        {/* Cast */}
        <Box component="section" sx={{ mt: 5 }} aria-labelledby="cast-heading">
          <Typography id="cast-heading" variant="h5" component="h2" fontWeight={700} sx={{ mb: 2 }}>
            Cast
          </Typography>
          <CastList cast={cast} />
        </Box>
      </Container>

      {trailer && (
        <TrailerDialog
          open={trailerOpen}
          onClose={() => setTrailerOpen(false)}
          videoKey={trailer.key}
          title={movie.title}
        />
      )}
    </Box>
  );
}
