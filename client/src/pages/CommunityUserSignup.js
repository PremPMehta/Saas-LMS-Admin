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
  Checkbox,
  FormControlLabel,
  Grid,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  School,
  CheckCircle,
} from '@mui/icons-material';
import loginImage from '../assets/view-building-with.jpg';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useDocumentTitle from '../contexts/useDocumentTitle';

const CommunityUserSignup = () => {
  useDocumentTitle('Community User Signup - Bell & Desk');
  console.log('CommunityUserSignup component rendered!');

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showSuccessPage, setShowSuccessPage] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    const { firstName, lastName, email, password, confirmPassword, termsAccepted } = formData;

    // Required fields validation
    if (!firstName.trim()) {
      setError('First name is required');
      return false;
    }
    if (!lastName.trim()) {
      setError('Last name is required');
      return false;
    }
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!password) {
      setError('Password is required');
      return false;
    }
    if (!confirmPassword) {
      setError('Please confirm your password');
      return false;
    }
    if (!termsAccepted) {
      setError('You must accept the terms and conditions');
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Password validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    // Password match validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'https://saas-lms-admin-1.onrender.com';
      console.log('API URL:', apiUrl);
      console.log('Full URL:', `${apiUrl}/api/community-user/signup`);
      const response = await axios.post(`${apiUrl}/api/community-user/signup`, formData);

      if (response.data.success) {
        setSuccess('Registration request sent successfully! Admin will approve your account.');
        setShowSuccessPage(true);
      } else {
        setError(response.data.message || 'Signup failed. Please try again.');
      }

    } catch (error) {
      console.error('Signup error:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Signup failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckStatus = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'https://saas-lms-admin-1.onrender.com';
      const response = await axios.get(`${apiUrl}/api/community-user/status/${formData.email}`);

      if (response.data.success) {
        const { approvalStatus } = response.data.data;

        if (approvalStatus === 'approved') {
          setSuccess('Your account has been approved! You can now log in.');
          // Redirect to login page after a short delay
          setTimeout(() => {
            navigate('/community-user-login');
          }, 2000);
        } else if (approvalStatus === 'rejected') {
          setError('Your account has been rejected. Please contact support for more information.');
        } else {
          setError('Your account is still pending approval. Please wait for admin approval.');
        }
      }
    } catch (error) {
      console.error('Status check error:', error);
      setError('Failed to check status. Please try again.');
    }
  };

  const handleGoToLogin = () => {
    navigate('/community-user-login');
  };

  if (showSuccessPage) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
           
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Container maxWidth="sm">
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              overflow: 'hidden',
            }}
          >
            {/* Success Header */}
            <Box
              sx={{
                background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
                color: 'white',
                p: 4,
                textAlign: 'center',
              }}
            >
              <CheckCircle sx={{ fontSize: 64, mb: 2 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                Registration Successful!
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Your request has been submitted
              </Typography>
            </Box>

            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
                Registration request sent successfully!
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
                Admin will approve your account. You will be notified once approved.
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                  Approval Status: <span style={{ color: '#ff9800' }}>Pending</span>
                </Typography>
              </Box>

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

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="outlined"
                  onClick={handleCheckStatus}
                  sx={{ minWidth: 120 }}
                >
                  Check Status
                </Button>
                <Button
                  variant="contained"
                  onClick={handleGoToLogin}
                  sx={{
                    background: '#0F3C60',
                    color: 'white',
                    minWidth: 120,
                  }}
                >
                  Let's Go
                </Button>
              </Box>

              <Typography variant="body2" sx={{ mt: 3, color: 'text.secondary' }}>
                Already have an account?{' '}
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => navigate('/community-user-login')}
                  sx={{ textDecoration: 'none' }}
                >
                  Sign in here
                </Link>
              </Typography>
            </CardContent>
          </Card>
        </Container>
      </Box>
    );
  }

  return (
    <Box>

      <Box className="login-card">
        <Grid container spacing={2} sx={{ alignItems: 'center', height: '100vh', alignItems: 'center' }}>
          <Grid size={{ xs:12, md: 6, lg: 6 }}>
            <Box className="login_box">
              <Box>
                <School sx={{ fontSize: 48, mb: 2 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  Community User Signup
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Join a learning community and start your journey
                </Typography>
              </Box>
              <CardContent sx={{ p: 0 }}>
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
                  <Grid container spacing={2}>
                    <Grid  size={{ xs: 12, sm: 6, lg: 6 }}>
                      <TextField
                        fullWidth
                        label="First Name"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        margin="normal"
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Person sx={{ color: 'text.secondary' }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid  size={{ xs: 12, sm: 6, lg: 6 }}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        margin="normal"
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Person sx={{ color: 'text.secondary' }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                  </Grid>

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
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
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
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 3 }}
                  />

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.termsAccepted}
                        onChange={(e) => handleInputChange('termsAccepted', e.target.checked)}
                        color="#0F3C60"
                      />
                    }
                    label={
                      <Typography variant="body2">
                        I have read and agree to the{' '}
                        <Link href="#" sx={{ textDecoration: 'none', color: '#020617' }}>
                          Terms and Conditions
                        </Link>
                      </Typography>
                    }
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
                        background: '#020617',
                      },
                      '&:disabled': {
                        background: '#ccc',
                        color: '#666',
                      },
                    }}
                  >
                    {isLoading ? (
                      <CircularProgress size={24} color="#020617" />
                    ) : (
                      'Create Account'
                    )}
                  </Button>

                  <Typography variant="body2" sx={{ mt: 3, color: '#020617' }}>
                    Already have an account?{' '}
                    <Link
                      component="button"
                      variant="body2"
                      onClick={() => navigate('/community-user-login')}
                      sx={{ textDecoration: 'none', color: '#020617', fontWeight: 600 }}
                    >
                      Sign in here
                    </Link>
                  </Typography>
                </Box>
              </CardContent>
            </Box>
          </Grid>
          <Grid size={{ xs:12, md: 6, lg: 6 }} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Box className="login_image_box">
              <img src={loginImage} alt="login" />
            </Box>
          </Grid>
        </Grid>
      </Box>

    </Box>
  );
};

export default CommunityUserSignup;
