import axios from 'axios';

/**
 * TMDb API configuration.
 * Values come from the .env file (Create React App only exposes variables
 * that start with REACT_APP_). Restart `npm start` after changing .env.
 */
const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = process.env.REACT_APP_TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = process.env.REACT_APP_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p';

// True only when the user has replaced the placeholder with a real key
export const hasApiKey = Boolean(API_KEY) && API_KEY !== 'your_tmdb_api_key_here';

// TMDb gives two credentials. A v3 key is short (32 chars) and goes in the URL.
// A v4 "Read Access Token" is a long JWT starting with "eyJ" and goes in a header.
const isBearerToken = Boolean(API_KEY) && API_KEY.startsWith('eyJ');

/** Shared Axios instance used by every TMDb request. */
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // fail after 10s instead of hanging forever
  params: {
    language: 'en-US',
    ...(isBearerToken ? {} : { api_key: API_KEY }),
  },
  headers: isBearerToken ? { Authorization: `Bearer ${API_KEY}` } : {},
});

/**
 * Turn any Axios error into a friendly Error message the UI can show directly.
 * The original status code is kept on error.status.
 */
function toFriendlyError(error) {
  let message = 'Something went wrong. Please try again.';
  const status = error.response ? error.response.status : null;

  if (!hasApiKey) {
    message = 'TMDb API key is missing. Add it to the .env file and restart the app.';
  } else if (error.code === 'ECONNABORTED') {
    message = 'The request took too long. Please try again.';
  } else if (!error.response) {
    message = 'Network error. Check your internet connection and try again.';
  } else if (status === 401) {
    message = 'TMDb rejected the API key. Check the key in your .env file.';
  } else if (status === 404) {
    message = 'We could not find what you were looking for.';
  } else if (status === 429) {
    message = 'Too many requests. Please wait a moment and try again.';
  } else if (status >= 500) {
    message = 'TMDb is having problems right now. Please try again later.';
  }

  const friendly = new Error(message);
  friendly.status = status;
  return friendly;
}

// Every failed request is converted here, so components never see raw Axios errors
api.interceptors.response.use((response) => response, (error) => Promise.reject(toFriendlyError(error)));

/**
 * Build a full image URL from a TMDb image path.
 * @param {string|null} path  e.g. "/abc123.jpg"
 * @param {string} size       e.g. "w342" (poster), "w1280" (backdrop), "w185" (profile)
 * @returns {string|null}     null when the movie has no image
 */
export const getImageUrl = (path, size = 'w342') => (path ? `${IMAGE_BASE_URL}/${size}${path}` : null);

export default api;
