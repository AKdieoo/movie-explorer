import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardActionArea, CardContent, CardMedia, Box, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import MovieIcon from '@mui/icons-material/Movie';
import { getImageUrl } from '../../services/apiConfig';
import FavoriteButton from '../FavoriteButton/FavoriteButton';
import { getYear, formatRating, getRatingColor } from '../../utils/movieHelpers';

/**
 * One movie: poster, title, release year and rating.
 * Reusable on Home, Search and Favorites. Clicking opens /movie/:id.
 * Has a heart button to add / remove it from favorites.
 */
export default function MovieCard({ movie }) {
  const poster = getImageUrl(movie.poster_path, 'w342');

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        // Hover effects only on devices with a mouse (touch screens would "stick")
        '@media (hover: hover)': {
          '&:hover': { transform: 'translateY(-4px)', boxShadow: 8 },
          '&:hover img': { transform: 'scale(1.04)' },
        },
        '@media (prefers-reduced-motion: reduce)': {
          transition: 'none',
          '&:hover': { transform: 'none' },
          '&:hover img': { transform: 'none' },
        },
      }}
    >
      <CardActionArea
        component={Link}
        to={`/movie/${movie.id}`}
        sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
      >
        {poster ? (
          <CardMedia
            component="img"
            image={poster}
            alt={`${movie.title} poster`}
            loading="lazy"
            sx={{ aspectRatio: '2 / 3', objectFit: 'cover', bgcolor: 'action.hover', transition: 'transform 0.3s ease' }}
          />
        ) : (
          // Fallback when TMDb has no poster for this movie
          <Box
            sx={{
              aspectRatio: '2 / 3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'action.hover',
              color: 'text.disabled',
            }}
          >
            <MovieIcon sx={{ fontSize: 48 }} />
          </Box>
        )}

        <CardContent sx={{ flexGrow: 1, p: { xs: 1.25, sm: 1.5 } }}>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            title={movie.title}
            sx={{
              lineHeight: 1.25,
              // Limit the title to 2 lines so all cards stay the same height
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {movie.title}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
            <Typography variant="body2" color="text.secondary">
              {getYear(movie.release_date)}
            </Typography>
            <Box
              sx={{ display: 'flex', alignItems: 'center', gap: 0.25, color: getRatingColor(movie.vote_average) }}
              aria-label={`Rating ${formatRating(movie.vote_average)}`}
            >
              <StarIcon sx={{ fontSize: 16 }} />
              <Typography variant="body2" fontWeight={700} color="inherit">
                {formatRating(movie.vote_average)}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>

      {/* Sits on top of the poster. It is a sibling of the link (not inside it),
          so clicking the heart does not open the details page. */}
      <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
        <FavoriteButton movie={movie} />
      </Box>
    </Card>
  );
}
