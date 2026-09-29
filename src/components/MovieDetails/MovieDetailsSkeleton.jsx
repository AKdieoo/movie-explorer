import React from 'react';
import { Box, Container, Skeleton } from '@mui/material';

/** Grey placeholder shaped like the details page, shown while loading. */
export default function MovieDetailsSkeleton() {
  return (
    <Box aria-busy="true" aria-label="Loading movie details">
      <Skeleton variant="rectangular" sx={{ height: { xs: 200, sm: 300, md: 400 } }} />
      <Container maxWidth="lg" sx={{ mt: { xs: -10, sm: -14, md: -20 }, position: 'relative' }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          <Skeleton
            variant="rounded"
            sx={{ alignSelf: { xs: 'center', md: 'flex-start' }, width: { xs: 180, sm: 220, md: 300 }, height: { xs: 270, sm: 330, md: 450 }, flexShrink: 0 }}
          />
          <Box sx={{ flex: 1, mt: { md: 12 } }}>
            <Skeleton width="60%" height={48} />
            <Skeleton width="30%" />
            <Skeleton width="40%" sx={{ mt: 1 }} />
            <Skeleton height={20} sx={{ mt: 3 }} />
            <Skeleton height={20} />
            <Skeleton height={20} width="80%" />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
