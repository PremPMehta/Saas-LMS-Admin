import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  InputAdornment,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginTransition from '../components/LoginTransition';
import "../index.css";
import useDocumentTitle from '../contexts/useDocumentTitle';

const Login = () => {
  useDocumentTitle('Login - Bell n Desk');
  const { mode } = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [showTransition, setShowTransition] = useState(false);
  const [userData, setUserData] = useState(null);
  const [redirectPath, setRedirectPath] = useState('/dashboard');

  // Validation rules
  const validateField = (name, value) => {
    
    switch (name) {
      case 'email':
        if (!value) {
          return 'Email is required';
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Please enter a valid email address';
        }
        return '';
      case 'password':
        if (!value) {
          return 'Password is required';
        }
        if (value.length < 6) {
          return 'Password must be at least 6 characters long';
        }
        return '';
      default:
        return '';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Clear API error when user starts typing
    if (apiError) {
      setApiError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setApiError('');
    
    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(formData.email.toLowerCase(), formData.password);
      
      if (result.success) {
        // Get the user data to determine redirect based on role
        const userData = JSON.parse(localStorage.getItem('user'));
        const userRole = userData?.role || 'user';
        
        // Set redirect path based on user role
        let redirectPath = '/academies'; // Default for regular users
        
        if (userRole === 'admin') {
          redirectPath = '/discovery'; // Admin users go to courses page
        }
        
        // Check if there's an intended page from location state
        const from = location.state?.from?.pathname;
        if (from && from !== '/login') {
          // Only redirect to intended page if user has access to it
          if (userRole === 'admin' || (from === '/academies' || from === '/plans' || from === '/profile')) {
            redirectPath = from;
          }
        }
        
        // Set session flag to indicate recent login
        sessionStorage.setItem('recentLogin', 'true');
        
        // Show transition instead of immediate redirect
        setUserData(userData);
        setRedirectPath(redirectPath);
        setShowTransition(true);
      } else {
        setApiError(result.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      setApiError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        background: mode === 'light' 
          ? 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
          : 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
      }}
    >
      {/* Left Column - Video Background */}
      <Box
        sx={{
          flex: 1,
          display: { xs: 'none', lg: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          background: '#000',
        }}
      >
        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
          }}
        >
          <source src="/5716233-uhd_2160_3840_30fps.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Black translucent overlay for better text readability */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            zIndex: 1,
          }}
        />

        {/* Content overlay */}
        <Box
          sx={{
            position: 'relative',
            zIndex: 2,
            textAlign: 'center',
            maxWidth: 500,
            color: 'white',
            padding: 4,
          }}
        >
          {/* Logo */}
          <Typography
            variant="h3"
            component="div"
            sx={{
              fontWeight: 800,
              color: 'rgb(255, 111, 12)',
              fontSize: { lg: '3rem', xl: '3.5rem' },
              mb: 3,
              textShadow: '0 2px 4px rgba(0,0,0,0.8)',
            }}
          >
            BBR Tek
          </Typography>

          {/* Headline */}
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 700,
              fontSize: { lg: '2.5rem', xl: '3rem' },
              mb: 3,
              lineHeight: 1.2,
              textShadow: '0 2px 4px rgba(0,0,0,0.8)',
            }}
          >
            Welcome to the Command Center
          </Typography>

          {/* Subtext */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 400,
              opacity: 0.95,
              lineHeight: 1.6,
              maxWidth: 400,
              mx: 'auto',
              textShadow: '0 1px 2px rgba(0,0,0,0.8)',
            }}
          >
            Manage, analyze, and scale your entire learning ecosystem from one powerful platform.
          </Typography>
        </Box>
      </Box>

      {/* Right Column - Login Form */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: { xs: 2, sm: 4, md: 6 },
          background: mode === 'light' ? '#ffffff' : '#1a202c',
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            maxWidth: 400,
            padding: { xs: 3, sm: 4 },
            background: 'transparent',
          }}
        >
          {/* Mobile Logo (only visible on small screens) */}
          <Box
            sx={{
              display: { xs: 'block', lg: 'none' },
              textAlign: 'center',
              mb: 4,
            }}
          >
            <Typography
              variant="h4"
              component="div"
              sx={{
                fontWeight: 800,
                color: 'primary.main',
                mb: 2,
              }}
            >
              BBR Tek
            </Typography>
          </Box>

          {/* Form Title */}
          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontWeight: 700,
              mb: 1,
              color: 'text.primary',
              textAlign: { xs: 'center', lg: 'left' },
            }}
          >
            Admin Sign In
          </Typography>

          <Typography
            variant="body1"
            sx={{
              mb: 4,
              color: 'text.secondary',
              textAlign: { xs: 'center', lg: 'left' },
            }}
          >
            Enter your credentials to access the admin panel
          </Typography>

          {/* API Error Alert */}
          {apiError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {apiError}
            </Alert>
          )}

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            {/* Email Field */}
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleInputChange}
              error={!!errors.email}
              helperText={errors.email}
              disabled={isLoading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: errors.email ? 'error.main' : 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: errors.email ? 'error.main' : 'primary.main',
                  },
                },
              }}
            />

            {/* Password Field */}
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleInputChange}
              error={!!errors.password}
              helperText={errors.password}
              disabled={isLoading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: errors.password ? 'error.main' : 'text.secondary' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      onClick={handleTogglePasswordVisibility}
                      disabled={isLoading}
                      sx={{
                        minWidth: 'auto',
                        p: 0.5,
                        color: errors.password ? 'error.main' : 'text.secondary',
                        '&:hover': {
                          backgroundColor: 'transparent',
                        },
                      }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </Button>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: errors.password ? 'error.main' : 'primary.main',
                  },
                },
              }}
            />

            {/* Login Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{
                mt: 2,
                mb: 2,
                py: 1.5,
                borderRadius: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 4px 12px rgba(255, 111, 12, 0.3)',
                '&:hover': {
                  boxShadow: '0 6px 20px rgba(255, 111, 12, 0.4)',
                  transform: 'translateY(-1px)',
                },
                '&:disabled': {
                  boxShadow: 'none',
                  transform: 'none',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Login Now'
              )}
            </Button>

            {/* Forgot Password Link */}
            <Box sx={{ textAlign: 'center' }}>
              <Link
                href="#"
                variant="body2"
                sx={{
                  color: 'primary.main',
                  textDecoration: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Forgot Password?
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Login Transition */}
      {showTransition && (
        <LoginTransition
          user={userData}
          redirectPath={redirectPath}
          onComplete={() => {
            setShowTransition(false);
            navigate(redirectPath, { replace: true });
          }}
        />
      )}
    </Box>
  );
};

export default Login; 