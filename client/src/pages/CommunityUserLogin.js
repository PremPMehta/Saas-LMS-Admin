import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import axios from 'axios';

const CommunityUserLogin = () => {
  const navigate = useNavigate();
  const { communityName } = useParams();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showApprovalStatus, setShowApprovalStatus] = useState(false);
  const [userStatus, setUserStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await axios.post(`${apiUrl}/api/community-user/login`, formData);
      
      if (response.data.success) {
        // Store user data and token
        localStorage.setItem('communityUserToken', response.data.data.token);
        localStorage.setItem('communityUserData', JSON.stringify(response.data.data.user));
        
        // Check if user is approved
        if (response.data.data.user.approvalStatus === 'approved') {
          // Redirect directly to courses listing for students
          const redirectPath = `/${communityName || 'crypto-manji-academy'}/student/courses`;
          console.log('🎯 Community User Login: Redirecting to:', redirectPath);
          console.log('🎯 Community Name from URL:', communityName);
          console.log('🎯 User data:', response.data.data.user);
          navigate(redirectPath);
        } else {
          // Show approval status page
          setUserStatus(response.data.data.user);
          setShowApprovalStatus(true);
        }
      } else {
        setError(response.data.message || 'Login failed. Please try again.');
      }

    } catch (error) {
      console.error('Login error:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };


  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircleIcon />;
      case 'rejected': return <ScheduleIcon />;
      case 'pending': return <ScheduleIcon />;
      default: return <ScheduleIcon />;
    }
  };

  if (showApprovalStatus && userStatus) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Container maxWidth="sm">
          <Card sx={{ borderRadius: 3, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Box sx={{ mb: 3 }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: userStatus.approvalStatus === 'approved' 
                      ? 'linear-gradient(135deg, #4caf50, #8bc34a)'
                      : userStatus.approvalStatus === 'rejected'
                      ? 'linear-gradient(135deg, #f44336, #ff5722)'
                      : 'linear-gradient(135deg, #ff9800, #ffc107)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                  }}
                >
                  {getStatusIcon(userStatus.approvalStatus)}
                </Box>
                
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: '#333' }}>
                  {userStatus.approvalStatus === 'approved' && 'Welcome!'}
                  {userStatus.approvalStatus === 'rejected' && 'Application Rejected'}
                  {userStatus.approvalStatus === 'pending' && 'Pending Approval'}
                </Typography>

                <Typography variant="h6" sx={{ mb: 1, color: '#666' }}>
                  {userStatus.firstName} {userStatus.lastName}
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, color: '#888' }}>
                  {userStatus.email}
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1" sx={{ mb: 2, color: '#666' }}>
                    <strong>Approval Status:</strong>
                  </Typography>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 1,
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      backgroundColor: userStatus.approvalStatus === 'approved' 
                        ? '#e8f5e8'
                        : userStatus.approvalStatus === 'rejected'
                        ? '#ffebee'
                        : '#fff3e0',
                      color: userStatus.approvalStatus === 'approved' 
                        ? '#2e7d32'
                        : userStatus.approvalStatus === 'rejected'
                        ? '#c62828'
                        : '#ef6c00',
                    }}
                  >
                    {getStatusIcon(userStatus.approvalStatus)}
                    <Typography variant="body2" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
                      {userStatus.approvalStatus}
                    </Typography>
                  </Box>
                </Box>

                {userStatus.approvalStatus === 'approved' && (
                  <Typography variant="body1" sx={{ mb: 3, color: '#666' }}>
                    Your account has been approved! You can now access the community dashboard.
                  </Typography>
                )}

                {userStatus.approvalStatus === 'pending' && (
                  <Typography variant="body1" sx={{ mb: 3, color: '#666' }}>
                    Your registration request is being reviewed by our admin team. 
                    You'll receive an email notification once your account is approved.
                  </Typography>
                )}

                {userStatus.approvalStatus === 'rejected' && (
                  <Typography variant="body1" sx={{ mb: 3, color: '#666' }}>
                    Unfortunately, your registration request has been rejected. 
                    Please contact support for more information.
                  </Typography>
                )}

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                  {userStatus.approvalStatus === 'approved' ? (
                    <Button
                      variant="contained"
                      onClick={() => navigate(`/${communityName || 'crypto-manji-academy'}/community-user-dashboard`)}
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        minWidth: 120,
                      }}
                    >
                      Go to Dashboard
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      onClick={() => navigate('/community-user-signup')}
                      sx={{ minWidth: 120 }}
                    >
                      Sign Up Instead
                    </Button>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Card sx={{ borderRadius: 3, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: '#333' }}>
                Community User Login
              </Typography>
              <Typography variant="body1" sx={{ color: '#666' }}>
                Sign in to access your community dashboard
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange}
                required
                sx={{ mb: 3 }}
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

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading}
                sx={{
                  py: 1.5,
                  mb: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                  },
                }}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
              </Button>

            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Don't have an account?{' '}
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => navigate('/community-user-signup')}
                  sx={{ textDecoration: 'none', fontWeight: 600 }}
                >
                  Sign up here
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default CommunityUserLogin;
