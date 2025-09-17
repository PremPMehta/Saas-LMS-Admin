import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
  Link,
  CircularProgress,
  Grid,
  Divider,
  Chip,
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  School as SchoolIcon,
  AdminPanelSettings as AdminIcon,
  Person as UserIcon,
} from '@mui/icons-material';
import loginImage from '../assets/view-building-with.jpg';
import useDocumentTitle from '../contexts/useDocumentTitle';
import communityAuthApi from '../utils/communityAuthApi';
import { apiUrl } from '../config/api';

const UnifiedLogin = () => {
  useDocumentTitle('Login - Bell n Desk');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'auto', // 'auto', 'admin', 'user'
  });

  const [detectedCommunity, setDetectedCommunity] = useState(null);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (error) setError('');

    // Check email when user types in email field
    if (name === 'email' && value.includes('@')) {
      checkEmailCommunity(value);
    }
  };

  const checkEmailCommunity = async (email) => {
    if (!email || !email.includes('@')) return;

    setIsCheckingEmail(true);
    setDetectedCommunity(null);

    try {
      console.log('🔍 Checking which community email belongs to:', email);

      const response = await fetch(apiUrl('/api/communities/check-email'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          console.log('✅ Email detected:', data.userType, 'for community:', data.community.name);
          setDetectedCommunity(data);

          // Auto-select the detected user type
          setFormData(prev => ({
            ...prev,
            userType: data.userType
          }));
        } else {
          console.log('❌ Email not found in any community');
          setDetectedCommunity(null);
        }
      } else {
        console.log('❌ Error checking email');
        setDetectedCommunity(null);
      }
    } catch (error) {
      console.error('❌ Error checking email:', error);
      setDetectedCommunity(null);
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      let loginResult;
      let userType;

      if (formData.userType === 'auto') {
        // Use detected community or try both login types
        if (detectedCommunity) {
          console.log('🎯 Using detected community:', detectedCommunity.community.name, 'as', detectedCommunity.userType);
          userType = detectedCommunity.userType;

          if (detectedCommunity.userType === 'admin') {
            // Community Admin login
            loginResult = await communityAuthApi.login(formData.email, formData.password);
            console.log('✅ Community Admin login successful');
          } else {
            // Community User login
            const response = await fetch(apiUrl('/api/community-user/login'), {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: formData.email,
                password: formData.password,
              }),
            });

            if (!response.ok) {
              throw new Error('Community User login failed');
            }

            const userData = await response.json();
            if (!userData.success) {
              throw new Error(userData.message || 'Login failed');
            }

            // Store community user data
            localStorage.setItem('communityUserToken', userData.data.token);
            localStorage.setItem('communityUser', JSON.stringify(userData.data.user));
            localStorage.setItem('communityId', userData.data.user.community.id);

            loginResult = userData;
            console.log('✅ Community User login successful');
          }
        } else {
          // Fallback: Try both login types automatically
          console.log('🔄 No community detected, trying both login types...');

          try {
            // First try Community Admin login
            console.log('🔍 Trying Community Admin login...');
            loginResult = await communityAuthApi.login(formData.email, formData.password);
            userType = 'admin';
            console.log('✅ Community Admin login successful');
          } catch (adminError) {
            console.log('❌ Community Admin login failed, trying Community User login...');

            // If admin login fails, try community user login
            try {
              const response = await fetch(apiUrl('/api/community-user/login'), {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  email: formData.email,
                  password: formData.password,
                }),
              });

              if (!response.ok) {
                throw new Error('Community User login failed');
              }

              const userData = await response.json();
              if (!userData.success) {
                throw new Error(userData.message || 'Login failed');
              }

              // Store community user data
              localStorage.setItem('communityUserToken', userData.data.token);
              localStorage.setItem('communityUser', JSON.stringify(userData.data.user));
              localStorage.setItem('communityId', userData.data.user.community.id);

              loginResult = userData;
              userType = 'user';
              console.log('✅ Community User login successful');
            } catch (userError) {
              console.log('❌ Both login attempts failed');
              throw new Error('Invalid credentials. Please check your email and password.');
            }
          }
        }
      } else if (formData.userType === 'admin') {
        // Community Admin login
        console.log('🔍 Community Admin login...');
        loginResult = await communityAuthApi.login(formData.email, formData.password);
        userType = 'admin';
        console.log('✅ Community Admin login successful');
      } else {
        // Community User login
        console.log('🔍 Community User login...');
        const response = await fetch(apiUrl('/api/community-user/login'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        if (!response.ok) {
          throw new Error('Login failed');
        }

        const userData = await response.json();
        if (!userData.success) {
          throw new Error(userData.message || 'Login failed');
        }

        // Store community user data
        localStorage.setItem('communityUserToken', userData.data.token);
        localStorage.setItem('communityUser', JSON.stringify(userData.data.user));
        localStorage.setItem('communityId', userData.data.user.community.id);

        loginResult = userData;
        userType = 'user';
        console.log('✅ Community User login successful');
      }

      // Success - redirect based on user type
      setSuccess(`Login successful! Redirecting to your ${userType === 'admin' ? 'admin courses' : 'student courses'}...`);

      // Use detected community for redirect if available
      let communityForRedirect = null;

      if (detectedCommunity) {
        communityForRedirect = detectedCommunity.community;
        console.log('🎯 Using detected community for redirect:', communityForRedirect.name);
      } else if (userType === 'admin') {
        communityForRedirect = communityAuthApi.getCurrentCommunity();
        console.log('🔍 Using admin community data:', communityForRedirect);
      } else {
        const userData = JSON.parse(localStorage.getItem('communityUser'));
        communityForRedirect = userData?.community;
        console.log('🔍 Using student community data:', communityForRedirect);
      }

      if (communityForRedirect && communityForRedirect.name) {
        // Convert community name to URL format (same logic as CommunityRoute expects)
        const communityUrlName = communityForRedirect.name.toLowerCase().replace(/\s+/g, '-');

        if (userType === 'admin') {
          const adminCoursesUrl = `/${communityUrlName}/admin/courses`;
          console.log('✅ Redirecting to admin courses URL:', adminCoursesUrl);

          setTimeout(() => {
            navigate(adminCoursesUrl);
          }, 1500);
        } else {
          const studentCoursesUrl = `/${communityUrlName}/student/courses`;
          console.log('✅ Redirecting to student courses URL:', studentCoursesUrl);

          setTimeout(() => {
            navigate(studentCoursesUrl);
          }, 1500);
        }
      } else {
        console.error('❌ No community data found for redirect');
        setError('Login successful but unable to redirect. Please try again.');
      }

    } catch (error) {
      console.error('Login error:', error);
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
      <Box className="login-card">
        <Grid container spacing={2} sx={{ alignItems: 'center', height: '100vh', alignItems: 'center' }}>
          <Grid size={{ xs: 12, md: 6, lg: 6 }}>
             <Box className="login_box" elevation={10}> 
              <Box style={{ padding: '40px' }}>
                {/* Header */}
                <Box textAlign="left" mb={4}>
                  <SchoolIcon style={{ fontSize: 60, color: '#0F3C60', marginBottom: '16px' }} />
                  <Typography variant="h4" component="h1" gutterBottom style={{
                    fontWeight: 'bold',
                    color: '#0F3C60',
                    marginBottom: '8px'
                  }}>
                    Bell n Desk
                  </Typography>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Unified Login Portal
                  </Typography>
                </Box>

                {/* Success Message */}
                {success && (
                  <Alert severity="success" style={{ marginBottom: '20px' }}>
                    {success}
                  </Alert>
                )}

                {/* Error Message */}
                {error && (
                  <Alert severity="error" style={{ marginBottom: '20px' }}>
                    {error}
                  </Alert>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit}>

                  {/* Email Field */}
                  <TextField
                    fullWidth
                    margin="normal"
                    name="email"
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    variant="outlined"
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: isCheckingEmail ? (
                        <InputAdornment position="end">
                          <CircularProgress size={20} />
                        </InputAdornment>
                      ) : null,
                    }}
                  />


                  {/* Password Field */}
                  <TextField
                    fullWidth
                    margin="normal"
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    variant="outlined"
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon color="action" />
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
                  />

                  {/* Login Button */}
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={isLoading}
                    style={{
                      marginTop: '24px',
                      marginBottom: '16px',
                      padding: '12px',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      borderRadius: '10px',
                      background: '#0F3C60',
                    }}
                  >
                    {isLoading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      'Login'
                    )}
                  </Button>

                  {/* Forgot Password Link */}
                  <Box textAlign="left" mt={2}>
                    <Link
                      component="button"
                      variant="body2"
                      onClick={handleForgotPassword}
                      style={{ textDecoration: 'none' }}
                    >
                      Forgot your password?
                    </Link>
                  </Box>

                  {/* Signup Link */}
                  <Box textAlign="left" mt={1}>
                    <Typography variant="body2" color="text.secondary">
                      Don't have an account?{' '}
                      <Link
                        component="button"
                        variant="body2"
                        onClick={() => navigate('/community-user-signup')}
                        style={{
                          textDecoration: 'none',
                          color: '#0F3C60',
                          fontWeight: 500
                        }}
                      >
                        Sign up here
                      </Link>
                    </Typography>
                  </Box>

                </form>
              </Box>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 6 }} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Box className="login_image_box">
              <img src={loginImage} alt="login" />
            </Box>
          </Grid>
        </Grid>

      </Box>
    </Box>
  );
};

export default UnifiedLogin;
