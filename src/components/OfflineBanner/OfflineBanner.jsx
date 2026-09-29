import React from 'react';
import { Alert } from '@mui/material';
import useOnlineStatus from '../../hooks/useOnlineStatus';

/** Thin warning strip shown under the navbar while the device is offline. */
export default function OfflineBanner() {
  const online = useOnlineStatus();
  if (online) return null;
  return (
    <Alert severity="warning" variant="filled" sx={{ borderRadius: 0, justifyContent: 'center' }}>
      You are offline. Movies cannot load until your internet connection is back.
    </Alert>
  );
}
