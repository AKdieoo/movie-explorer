import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { getItem, setItem, removeItem } from '../utils/localStorage';
import { STORAGE_KEYS, DEMO_USER } from '../utils/constants';

export const AuthContext = createContext(null);

/**
 * Local demo login (Context API).
 * The assignment asks for a login *interface* but no backend, so credentials are checked
 * against one demo account in the browser. This is NOT real security - it only shows
 * the login flow. The session is saved in localStorage so a refresh keeps you signed in.
 */
export function AuthProvider({ children }) {
  // Read the saved session once, synchronously, so a refresh never flashes the login page
  const [user, setUser] = useState(() => {
    const saved = getItem(STORAGE_KEYS.SESSION);
    return saved && typeof saved.username === 'string' ? saved : null;
  });

  /** Returns { ok: true } or { ok: false, error: "message" } */
  const login = useCallback((username, password) => {
    const name = username.trim();
    if (!name || !password) {
      return { ok: false, error: 'Please enter your username and password.' };
    }
    // Username is not case-sensitive, password is
    if (name.toLowerCase() !== DEMO_USER.username || password !== DEMO_USER.password) {
      return { ok: false, error: 'Incorrect username or password.' };
    }
    const session = { username: DEMO_USER.username, loggedInAt: Date.now() };
    setItem(STORAGE_KEYS.SESSION, session);
    setUser(session);
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    removeItem(STORAGE_KEYS.SESSION);
    setUser(null);
  }, []);

  // Sign in / out in one tab -> the other tabs follow
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== STORAGE_KEYS.SESSION) return;
      if (e.newValue === null) return setUser(null);
      try {
        const next = JSON.parse(e.newValue);
        setUser(next && typeof next.username === 'string' ? next : null);
      } catch {
        setUser(null);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), login, logout }),
    [user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
