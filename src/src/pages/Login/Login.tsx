import { useState } from 'react';
import {
  Container,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import LockIcon from '@mui/icons-material/Lock';

const VALID_USERNAME = 'admin';
const VALID_PASSWORD = 'admin_ai@plat';

export const Login = () => {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      setIsLoggedIn(true);
      navigate('/');
    } else {
      setError('Invalid username or password');
      setPassword('');
    }

    setLoading(false);
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <Card sx={{ width: '100%', boxShadow: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                }}
              >
                <LockIcon sx={{ color: 'white', fontSize: 32 }} />
              </Box>
            </Box>

            <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
              Enterprise AI Platform
            </Typography>

            <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
              Sign in to your account
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="Username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                placeholder=""
                autoComplete="username"
                required
              />

              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                placeholder=""
                autoComplete="current-password"
                required
              />

              <Button
                fullWidth
                variant="contained"
                size="large"
                type="submit"
                disabled={loading || !username || !password}
                sx={{ mt: 2, py: 1.5 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Sign In'}
              </Button>
            </Box>

            <Typography variant="caption" align="center" display="block" sx={{ mt: 3, color: 'text.secondary' }}>
              Demo Credentials:
              <br />
              Username: admin
              <br />
              Password: admin_ai@plat
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};
