import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography } from '@mui/material';
import useMovies from '../../hooks/useMovies';
import SearchBar from '../../components/SearchBar/SearchBar';
import TrendingSection from '../../components/TrendingSection/TrendingSection';
import usePageTitle from '../../hooks/usePageTitle';

/** Home page: hero with search bar + trending movies. */
export default function Home() {
  const { search, lastSearch } = useMovies();
  const navigate = useNavigate();
  usePageTitle('');

  // Run the search, then show the results on the Search page
  const handleSearch = (query) => {
    search(query);
    navigate('/search');
  };

  return (
    <>
      <Box
        sx={{
          py: { xs: 5, md: 8 },
          px: 2,
          textAlign: 'center',
          background: (theme) =>
            `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
          color: 'primary.contrastText',
        }}
      >
        <Typography variant="h3" component="h1" fontWeight={800} sx={{ fontSize: { xs: '2rem', md: '3rem' } }}>
          Discover Your Favorite Movies
        </Typography>
        <Typography sx={{ mt: 1, mb: 3, opacity: 0.9 }}>
          Search thousands of films, see what is trending and save your favorites.
        </Typography>
        <SearchBar onSearch={handleSearch} initialValue={lastSearch} />
      </Box>

      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
        <TrendingSection />
      </Container>
    </>
  );
}
