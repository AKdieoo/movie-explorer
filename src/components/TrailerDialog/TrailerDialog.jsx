import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Box, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

/**
 * Pop-up player for a YouTube trailer (TMDb gives us the YouTube video key).
 * The iframe only exists while the dialog is open, so closing it stops the video.
 */
export default function TrailerDialog({ open, onClose, videoKey, title }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" aria-labelledby="trailer-title">
      <DialogTitle id="trailer-title" sx={{ pr: 6 }}>
        {title} - Trailer
        <IconButton
          aria-label="Close trailer"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 0, bgcolor: 'black' }}>
        {/* 16:9 responsive video box */}
        <Box sx={{ position: 'relative', pt: '56.25%' }}>
          <iframe
            title={`${title} trailer`}
            src={`https://www.youtube-nocookie.com/embed/${videoKey}?autoplay=1&rel=0`}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
          />
        </Box>
        <Box sx={{ p: 1.5, textAlign: 'right', bgcolor: 'background.paper' }}>
          <Button
            size="small"
            endIcon={<OpenInNewIcon />}
            href={`https://www.youtube.com/watch?v=${videoKey}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Watch on YouTube
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
