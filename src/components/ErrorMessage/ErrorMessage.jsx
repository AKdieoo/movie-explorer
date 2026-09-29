import React from 'react';
import { Alert, Button } from '@mui/material';

/** Friendly error box with an optional "Try again" button. */
export default function ErrorMessage({ message, onRetry }) {
  return (
    <Alert
      severity="error"
      sx={{ alignItems: 'center' }}
      action={
        onRetry && (
          <Button color="inherit" size="small" onClick={onRetry}>
            Try again
          </Button>
        )
      }
    >
      {message || 'Something went wrong. Please try again.'}
    </Alert>
  );
}
