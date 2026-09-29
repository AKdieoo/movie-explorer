import React from 'react';
import { Box, Container, Link, Typography } from '@mui/material';

/**
 * Page footer. TMDb's terms of use require showing this attribution
 * wherever their data is displayed.
 */
export default function Footer() {
  return (
    <Box component="footer" sx={{ mt: 6, py: 3, borderTop: 1, borderColor: 'divider' }}>
      <Container maxWidth="xl">
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Movie data provided by{' '}
          <Link href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer">
            TMDb
          </Link>
          . This product uses the TMDb API but is not endorsed or certified by TMDb.
        </Typography>
      </Container>
    </Box>
  );
}
