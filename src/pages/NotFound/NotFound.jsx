import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container } from '@mui/material';
import EmptyState from '../../components/EmptyState/EmptyState';
import usePageTitle from '../../hooks/usePageTitle';

/** Shown for any URL that does not exist (for example /abc). */
export default function NotFound() {
  usePageTitle('Page not found');
  return (
    <Container maxWidth="sm">
      <EmptyState
        title="Page not found"
        message="The page you are looking for does not exist."
        action={
          <Button component={Link} to="/" variant="contained">
            Go to Home
          </Button>
        }
      />
    </Container>
  );
}
