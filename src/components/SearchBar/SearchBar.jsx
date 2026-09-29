import React, { useState, useEffect } from 'react';
import { Paper, InputBase, IconButton, Divider } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

/**
 * Search input with a submit button. Reusable on Home and Search pages.
 * @param {Function} onSearch      called with the trimmed text on submit (Enter or button)
 * @param {string}   initialValue  text shown in the box; updates when it changes
 * @param {boolean}  autoFocus
 * @param {Function} onClear       optional; also called when the X button empties the box
 */
export default function SearchBar({ onSearch, onClear, initialValue = '', autoFocus = false }) {
  const [text, setText] = useState(initialValue);

  // Keep the box in sync when the parent restores a previous search
  useEffect(() => {
    setText(initialValue);
  }, [initialValue]);

  const handleSubmit = (e) => {
    e.preventDefault(); // stop the page from reloading
    const query = text.trim();
    if (query) onSearch(query); // ignore empty searches
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      role="search"
      elevation={3}
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        maxWidth: 640,
        mx: 'auto',
        px: 1,
        py: 0.25,
        // Clear focus ring so keyboard users can see where they are
        '&:focus-within': { boxShadow: '0 0 0 3px #ff4d6d' },
      }}
    >
      <InputBase
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Search for a movie..."
        autoFocus={autoFocus}
        sx={{ ml: 1, flex: 1 }}
        inputProps={{ 'aria-label': 'Search for a movie' }}
      />
      {text && (
        <IconButton
          aria-label="Clear search text"
          onClick={() => {
            setText('');
            if (onClear) onClear();
          }}
          size="small"
        >
          <ClearIcon fontSize="small" />
        </IconButton>
      )}
      <Divider orientation="vertical" flexItem sx={{ my: 1, mx: 0.5 }} />
      <IconButton type="submit" color="primary" aria-label="Search" disabled={!text.trim()}>
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}
