import React from 'react';
import { Box, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { getImageUrl } from '../../services/apiConfig';

const MAX_CAST = 15; // top-billed actors only

/** Horizontally scrollable row of cast members (photo, name, character). */
export default function CastList({ cast }) {
  const people = cast.slice(0, MAX_CAST);

  if (people.length === 0) {
    return <Typography color="text.secondary">Cast information is not available.</Typography>;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        overflowX: 'auto', // scrolls sideways inside this box, the page itself never scrolls sideways
        pb: 1.5,
        scrollSnapType: 'x proximity',
      }}
    >
      {people.map((person) => {
        const photo = getImageUrl(person.profile_path, 'w185');
        return (
          <Box key={person.cast_id ?? person.credit_id ?? person.id} sx={{ width: 110, flexShrink: 0, scrollSnapAlign: 'start' }}>
            {photo ? (
              <Box
                component="img"
                src={photo}
                alt={person.name}
                loading="lazy"
                sx={{ width: '100%', aspectRatio: '2 / 3', objectFit: 'cover', borderRadius: 2, bgcolor: 'action.hover' }}
              />
            ) : (
              <Box
                sx={{
                  width: '100%', aspectRatio: '2 / 3', borderRadius: 2, bgcolor: 'action.hover',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.disabled',
                }}
              >
                <PersonIcon sx={{ fontSize: 40 }} />
              </Box>
            )}
            <Typography variant="body2" fontWeight={600} sx={{ mt: 0.75, lineHeight: 1.25 }}>
              {person.name}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2, display: 'block' }}>
              {person.character}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}
