import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Material-UI
import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
  Container
} from '@mui/material';
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Visibility, VisibilityOff } from '@mui/icons-material';

// Project imports
import Logo from 'ui-component/Logo';
import useAdminAuth from 'hooks/useAdminAuth';

// ==============================|| ADMIN LOGIN PAGE ||============================== //

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, isLoading, error: authError } = useAdminAuth();

  const downMD = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // Validation
    if (!username.trim()) {
      setError('Username is required');
      setIsSubmitting(false);
      return;
    }

    if (!password.trim()) {
      setError('Password is required');
      setIsSubmitting(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsSubmitting(false);
      return;
    }

    try {
      await login(username, password);
      navigate('/dashboard/default', { replace: true });
    } catch (err: any) {
      console.error('Login failed:', err);
      setError(err?.message || 'Login failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.dark} 100%)`
            : `linear-gradient(135deg, ${theme.palette.primary[200]} 0%, ${theme.palette.primary.light} 100%)`,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2
      }}
    >
      <Container maxWidth="sm">
        <Grid container spacing={0} justifyContent="center">
          <Grid size={12}>
            <Card
              sx={{
                boxShadow: (theme) => (theme.palette.mode === 'dark' ? 'none' : '0px 10px 30px rgba(0,0,0,0.1)'),
                background: (theme) => (theme.palette.mode === 'dark' ? theme.palette.background.paper : '#ffffff'),
                borderRadius: 2,
                padding: 4
              }}
            >
              <Stack spacing={3} alignItems="center">
                {/* Logo */}
                <Box
                  sx={{
                    mb: 2,
                    display: 'flex',
                    justifyContent: 'center'
                  }}
                >
                  <Logo />
                </Box>

                {/* Welcome Text */}
                <Stack spacing={1} alignItems="center" sx={{ textAlign: 'center' }}>
                  <Typography
                    variant={downMD ? 'h4' : 'h3'}
                    sx={{
                      color: (theme) => theme.palette.secondary.main,
                      fontWeight: 700
                    }}
                  >
                    Hi, Welcome Back
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: (theme) => theme.palette.text.secondary,
                      fontSize: '14px'
                    }}
                  >
                    Enter your credentials to access admin dashboard
                  </Typography>
                </Stack>

                <Divider sx={{ width: '100%' }} />

                {/* Error Alert */}
                {(error || authError) && (
                  <Alert severity="error" sx={{ width: '100%' }}>
                    {error || authError}
                  </Alert>
                )}

                {/* Login Form */}
                <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mt: 2 }}>
                  <Stack spacing={2.5}>
                    {/* Username Field */}
                    <TextField
                      fullWidth
                      id="username"
                      type="text"
                      label="Username"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={isSubmitting || isLoading}
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          transition: 'all 0.3s ease'
                        }
                      }}
                    />

                    {/* Password Field */}
                    <TextField
                      fullWidth
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      label="Password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isSubmitting || isLoading}
                      variant="outlined"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                              disabled={isSubmitting || isLoading}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          transition: 'all 0.3s ease'
                        }
                      }}
                    />

                    {/* Login Button */}
                    <Button
                      fullWidth
                      size="large"
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={isSubmitting || isLoading}
                      sx={{
                        padding: '12px 24px',
                        fontSize: '16px',
                        fontWeight: 600,
                        textTransform: 'none',
                        borderRadius: 1.5,
                        boxShadow: (theme) => `0px 4px 15px ${theme.palette.primary.main}33`,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: (theme) => `0px 6px 20px ${theme.palette.primary.main}55`,
                          transform: 'translateY(-2px)'
                        },
                        '&:disabled': {
                          opacity: 0.7
                        }
                      }}
                    >
                      {isSubmitting || isLoading ? (
                        <Stack direction="row" spacing={1} alignItems="center">
                          <CircularProgress size={20} color="inherit" />
                          <span>Logging in...</span>
                        </Stack>
                      ) : (
                        'Login to Dashboard'
                      )}
                    </Button>
                  </Stack>
                </Box>

                {/* Footer Info */}
                <Stack spacing={1} alignItems="center" sx={{ mt: 3 }}>
                  <Typography variant="caption" sx={{ color: (theme) => theme.palette.text.secondary }}>
                    © {new Date().getFullYear()} IBL Fintech. All rights reserved.
                  </Typography>
                </Stack>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
