import React, { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import {
  Box, Card, CardContent, Typography, TextField, Button, Alert,
  InputAdornment, IconButton, Divider,
} from '@mui/material';
import MovieIcon from '@mui/icons-material/Movie';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import useAuth from '../../hooks/useAuth';
import ThemeToggle from '../../components/ThemeToggle/ThemeToggle';
import { DEMO_USER } from '../../utils/constants';
import usePageTitle from '../../hooks/usePageTitle';

/**
 * Login page: username + password form (local demo login, see AuthContext).
 * After a successful login the user goes back to the page they originally asked for.
 */
export default function Login() {
  const { isAuthenticated, login } = useAuth();
  usePageTitle('Login');
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Where to go after login (set by ProtectedRoute), default Home
  const from = location.state?.from;
  const redirectTo = from ? `${from.pathname}${from.search || ''}` : '/';

  // Already signed in -> no need to see the login form
  if (isAuthenticated) return <Navigate to={redirectTo} replace />;

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = login(username, password);
    if (result.ok) {
      navigate(redirectTo, { replace: true });
    } else {
      setError(result.error);
    }
  };

  // One click fills in the demo account (handy for evaluators)
  const fillDemo = () => {
    setUsername(DEMO_USER.username);
    setPassword(DEMO_USER.password);
    setError('');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        position: 'relative',
      }}
    >
      <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
        <ThemeToggle />
      </Box>

      <Card sx={{ width: '100%', maxWidth: 420, boxShadow: 6 }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <MovieIcon color="primary" sx={{ fontSize: 48 }} />
            <Typography variant="h5" component="h1" fontWeight={700}>
              Movie Explorer
            </Typography>
            <Typography color="text.secondary">Sign in to discover your favorite films</Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }} role="alert">
                {error}
              </Alert>
            )}

            <TextField
              label="Username"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(''); }}
              fullWidth
              margin="normal"
              autoFocus
              autoComplete="username"
            />
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              fullWidth
              margin="normal"
              autoComplete="current-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((s) => !s)}
                      edge="end"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button type="submit" variant="contained" size="large" fullWidth sx={{ mt: 2 }}>
              Login
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Demo account hint */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Demo account: <strong>{DEMO_USER.username}</strong> / <strong>{DEMO_USER.password}</strong>
            </Typography>
            <Button size="small" onClick={fillDemo} sx={{ mt: 1 }}>
              Use demo account
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
