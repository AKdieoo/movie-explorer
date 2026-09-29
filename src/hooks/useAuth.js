import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/** Convenience hook: const { user, isAuthenticated, login, logout } = useAuth(); */
export default function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
