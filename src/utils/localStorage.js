/**
 * Small safe wrappers around localStorage.
 * localStorage can throw (private mode, storage full, blocked by the browser)
 * and stored JSON can be corrupted, so every call is wrapped in try/catch.
 */

/** Read a value. Returns `fallback` when the key is missing or unreadable. */
export const getItem = (key, fallback = null) => {
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
};

/** Save a value (any JSON-serialisable value). Returns true on success. */
export const setItem = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

/** Delete a key. */
export const removeItem = (key) => {
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
};
