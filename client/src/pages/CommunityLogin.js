import React, { useState } from 'react';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  Link,
  CircularProgress,
  InputAdornment,
  IconButton,
  Grid,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  School,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import communityAuthApi from '../utils/communityAuthApi';
import loginImage from '../assets/login-image.jpg'; 
import { getCommunityUrl } from '../utils/communityUrlUtils';

const CommunityLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await communityAuthApi.login(formData.email, formData.password);
      console.log('Login response:', response);

      setSuccess('Login successful! Redirecting to your dashboard...');

      // Get community name and redirect to admin dashboard
      const community = communityAuthApi.getCurrentCommunity();
      console.log('Current community data:', community);

      if (community && community.name) {
        const communityUrlName = community.name.toLowerCase().replace(/\s+/g, '-');
        const adminDashboardUrl = `/${communityUrlName}/admin/dashboard`;
        console.log('Redirecting to admin dashboard URL:', adminDashboardUrl);

        // Redirect to admin dashboard after a short delay
        setTimeout(() => {
          navigate(adminDashboardUrl);
        }, 1500);
      } else {
        // Fallback - this shouldn't happen but just in case
        console.error('No community data found after login');
        console.log('Available localStorage keys:', Object.keys(localStorage));
        setError('Login successful but unable to redirect. Please try again.');
      }

    } catch (error) {
      setError(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // Navigate to forgot password page
    navigate('/forgot-password');
  };

  return (
    <Box>

      <Box className="login-card" >
        <Grid container spacing={2} sx={{alignItems: 'center'}}>
          <Grid size={{  lg:8 }}>
            <Box className="login_box">
              <Box sx={{ mb: 4 }}>
                <School sx={{ fontSize: 48, mb: 2 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  Community Login
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Access your community dashboard
                </Typography>
              </Box>
              <CardContent  sx={{p:0}}>
                {error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                )}

                {success && (
                  <Alert severity="success" sx={{ mb: 3 }}>
                    {success}
                  </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    margin="normal"
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    margin="normal"
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 3 }}
                  />

                  <Button
                    type="submit"
                     
                    variant="contained"
                    size="large"
                    disabled={isLoading}
                    sx={{
                      background: '#020617',
                      color: 'white',
                      py: 1.5,
                      fontSize: '14px',
                      textTransform: 'none',
                      borderRadius: 2,
                      '&:hover': {
                          background: '#020512ff',
                      },
                      '&:disabled': {
                        background: '#ccc',
                      },
                    }}
                  >
                    {isLoading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      'Sign In to Community'
                    )}
                  </Button>
                </Box>

                <Box sx={{ mt: 3, }}>
                  <Link
                    component="button"
                    variant="body2"
                    disabled
                    sx={{
                      color: '#000',
                      textDecoration: 'none',
                       
                      cursor: 'not-allowed',
                      '&:hover': {
                        textDecoration: 'none',
                      },
                    }}
                  >
                    Forgot your password?
                  </Link>
                </Box>

                <Box sx={{ mt: 1}}>
                  <Typography variant="body2" color="text.secondary">
                    Don't have a community yet?{' '}
                    <Link
                      component="span"
                      sx={{
                        color: '#000',
                        textDecoration: 'none',
                        fontWeight: 600,
                         
                        cursor: 'not-allowed',
                        '&:hover': {
                          textDecoration: 'none',
                        },
                      }}
                    >
                      Create one now
                    </Link>
                  </Typography>
                </Box>
              </CardContent>
            </Box>
          </Grid>
          <Grid size={{ lg: 4 }}>
            <Box className="login_image_box">
              <img src={loginImage} alt="login" />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default CommunityLogin;
