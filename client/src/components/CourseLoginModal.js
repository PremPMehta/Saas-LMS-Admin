import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  Tabs,
  Tab,
  Divider,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Person as PersonIcon,
  Business as BusinessIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Close as CloseIcon,
  School as SchoolIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import googleLogo from '../assets/google-logo.png';

const CourseLoginModal = ({ open, onClose, courseData }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  
  // Community User Login State
  const [userFormData, setUserFormData] = useState({
    email: '',
    password: '',
  });
  const [showUserPassword, setShowUserPassword] = useState(false);
  const [isUserLoading, setIsUserLoading] = useState(false);
  const [userError, setUserError] = useState('');
  const [showUserApprovalStatus, setShowUserApprovalStatus] = useState(false);
  const [userStatus, setUserStatus] = useState(null);
  const [showSignupForm, setShowSignupForm] = useState(false);

  // Community Admin Login State
  const [adminFormData, setAdminFormData] = useState({
    email: '',
    password: '',
  });
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [isAdminLoading, setIsAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState('');

  // Signup State
  const [signupData, setSignupData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSignupLoading, setIsSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState('');

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    // Clear all errors when switching tabs
    setUserError('');
    setAdminError('');
    setSignupError('');
    setSignupSuccess('');
    setShowUserApprovalStatus(false);
    setShowSignupForm(false);
  };

  // Community User Login Functions
  const handleUserInputChange = (e) => {
    const { name, value } = e.target;
    setUserFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (userError) setUserError('');
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    setIsUserLoading(true);
    setUserError('');
    setShowUserApprovalStatus(false);

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'https://saas-lms-admin-1.onrender.com';
      console.log('🔍 CourseLoginModal - Login attempt:', {
        apiUrl,
        email: userFormData.email,
        courseData,
        environment: process.env.NODE_ENV
      });
      
      const response = await axios.post(`${apiUrl}/api/community-user/login`, {
        email: userFormData.email,
        password: userFormData.password
      });

      if (response.data.success) {
        const { user, token } = response.data.data;
        
        // Check approval status
        if (user.approvalStatus === 'pending') {
          setUserStatus('pending');
          setShowUserApprovalStatus(true);
          setIsUserLoading(false);
          return;
        }

        // Store token and user data
        localStorage.setItem('communityUserToken', token);
        localStorage.setItem('communityUser', JSON.stringify(user));
        
        console.log('✅ CourseLoginModal - Login successful:', {
          user,
          token: token ? 'present' : 'missing',
          courseData,
          navigationUrl: `/${courseData?.communityName || 'crypto-manji-academy'}/student/course-viewer/${courseData?.id}`
        });
        
        // Navigate to course viewer
        navigate(`/${courseData?.communityName || 'crypto-manji-academy'}/student/course-viewer/${courseData?.id}`);
        onClose();
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response?.data?.message) {
        setUserError(error.response.data.message);
      } else {
        setUserError('Login failed. Please try again.');
      }
    } finally {
      setIsUserLoading(false);
    }
  };

  // Community Admin Login Functions
  const handleAdminInputChange = (field, value) => {
    setAdminFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (adminError) setAdminError('');
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    
    if (!adminFormData.email || !adminFormData.password) {
      setAdminError('Please fill in all fields');
      return;
    }

    setIsAdminLoading(true);
    setAdminError('');

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'https://saas-lms-admin-1.onrender.com';
      const response = await axios.post(`${apiUrl}/api/auth/community-login`, {
        email: adminFormData.email,
        password: adminFormData.password
      });
      
      if (response.data.success) {
        localStorage.setItem('communityToken', response.data.token);
        localStorage.setItem('community', JSON.stringify(response.data.community));
        
        // Navigate to admin course viewer
        navigate(`/${courseData?.communityName || 'crypto-manji-academy'}/admin/course-viewer/${courseData?.id}`);
        onClose();
      }
    } catch (error) {
      console.error('Admin login error:', error);
      setAdminError(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsAdminLoading(false);
    }
  };

  // Signup Functions
  const handleSignupInputChange = (e) => {
    const { name, value } = e.target;
    setSignupData(prev => ({
      ...prev,
      [name]: value
    }));
    if (signupError) setSignupError('');
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    
    if (signupData.password !== signupData.confirmPassword) {
      setSignupError('Passwords do not match');
      return;
    }

    if (signupData.password.length < 6) {
      setSignupError('Password must be at least 6 characters long');
      return;
    }

    setIsSignupLoading(true);
    setSignupError('');

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'https://saas-lms-admin-1.onrender.com';
      console.log('🔍 CourseLoginModal - Signup attempt:', {
        apiUrl,
        email: signupData.email,
        courseData,
        environment: process.env.NODE_ENV
      });
      
      const response = await axios.post(`${apiUrl}/api/community-user/signup`, {
        firstName: signupData.firstName,
        lastName: signupData.lastName,
        email: signupData.email,
        password: signupData.password,
        confirmPassword: signupData.confirmPassword,
        termsAccepted: true // Auto-accept terms for course access
      });

      if (response.data.success) {
        console.log('✅ CourseLoginModal - Signup successful:', response.data);
        setSignupSuccess('Registration successful! Please wait for admin approval.');
        setSignupData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      console.error('Signup error:', error);
      setSignupError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSignupLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          minHeight: '600px'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1,
        background: '#0F3C60',
        color: 'white'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <SchoolIcon sx={{ fontSize: 28 }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Access Course
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {courseData?.name || 'Course Name'}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem'
              }
            }}
          >
            <Tab 
              icon={<PersonIcon />} 
              label="Bell & Desk User Login" 
              iconPosition="start"
            />
            <Tab 
              icon={<BusinessIcon />} 
              label="Bell & Desk Login" 
              iconPosition="start"
            />
          </Tabs>
        </Box>

        <Box sx={{ p: 4 }}>
          {/* Community User Tab */}
          {activeTab === 0 && (
            <Box>
              {!showSignupForm ? (
                /* Login Form */
                <Card sx={{ border: '1px solid #e0e0e0' }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#2c3e50' }}>
                      Login to Access Course
                    </Typography>
                    
                    {userError && (
                      <Alert severity="error" sx={{ mb: 2 }}>
                        {userError}
                      </Alert>
                    )}

                    {showUserApprovalStatus && (
                      <Alert 
                        severity="warning" 
                        sx={{ mb: 2 }}
                        icon={<ScheduleIcon />}
                      >
                        <Typography variant="body2">
                          Your account is pending approval. Please wait for an admin to approve your access.
                        </Typography>
                      </Alert>
                    )}

                    <Box component="form" onSubmit={handleUserSubmit}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={userFormData.email}
                        onChange={handleUserInputChange}
                        margin="normal"
                        required
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
                        type={showUserPassword ? 'text' : 'password'}
                        value={userFormData.password}
                        onChange={handleUserInputChange}
                        margin="normal"
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
                                onClick={() => setShowUserPassword(!showUserPassword)}
                                edge="end"
                              >
                                {showUserPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={isUserLoading}
                        sx={{
                          mt: 3,
                          mb: 2,
                          py: 1.5,
                          background: '#0F3C60',
                          '&:hover': {
                            background: '#0F3C60',
                            opacity: 0.9
                          }
                        }}
                      >
                        {isUserLoading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
                      </Button>
                    </Box>

                    {/* Divider */}
                    <Box sx={{ display: 'flex', alignItems: 'center', my: 3 }}>
                      <Box sx={{ flex: 1, height: '1px', bgcolor: '#e0e0e0' }} />
                      <Typography variant="body2" sx={{ mx: 2, color: '#666' }}>
                        or
                      </Typography>
                      <Box sx={{ flex: 1, height: '1px', bgcolor: '#e0e0e0' }} />
                    </Box>

                    {/* Google Sign In Button */}
                    <Button
                      variant="outlined"
                      size="large"
                      fullWidth
                      sx={{
                        py: 1.5,
                        fontSize: '14px',
                        textTransform: 'none',
                        borderRadius: 2,
                        borderColor: '#dadce0',
                        color: '#3c4043',
                        backgroundColor: '#fff',
                        '&:hover': {
                          backgroundColor: '#f8f9fa',
                          borderColor: '#dadce0',
                        },
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                      startIcon={
                        <Box
                          component="img"
                          src={googleLogo}
                          alt="Google"
                          sx={{ width: 20, height: 20 }}
                        />
                      }
                    >
                      Sign in with Google
                    </Button>

                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Don't have an account?{' '}
                        <Button
                          variant="text"
                          onClick={() => setShowSignupForm(true)}
                          sx={{
                            textTransform: 'none',
                            color: '#0F3C60',
                            fontWeight: 600,
                            p: 0,
                            minWidth: 'auto',
                            '&:hover': {
                              backgroundColor: 'transparent',
                              textDecoration: 'underline'
                            }
                          }}
                        >
                          New User? Sign up here
                        </Button>
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ) : (
                /* Signup Form */
                <Card sx={{ border: '1px solid #e0e0e0' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Button
                        variant="text"
                        onClick={() => setShowSignupForm(false)}
                        sx={{
                          textTransform: 'none',
                          color: '#0F3C60',
                          fontWeight: 600,
                          p: 0,
                          minWidth: 'auto',
                          mr: 2,
                          '&:hover': {
                            backgroundColor: 'transparent',
                            textDecoration: 'underline'
                          }
                        }}
                      >
                        ← Back to Login
                      </Button>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                        Create New Account
                      </Typography>
                    </Box>
                    
                    {signupError && (
                      <Alert severity="error" sx={{ mb: 2 }}>
                        {signupError}
                      </Alert>
                    )}

                    {signupSuccess && (
                      <Alert severity="success" sx={{ mb: 2 }} icon={<CheckCircleIcon />}>
                        {signupSuccess}
                      </Alert>
                    )}

                    <Box component="form" onSubmit={handleSignupSubmit}>
                      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <TextField
                          fullWidth
                          label="First Name"
                          name="firstName"
                          value={signupData.firstName}
                          onChange={handleSignupInputChange}
                          required
                        />
                        <TextField
                          fullWidth
                          label="Last Name"
                          name="lastName"
                          value={signupData.lastName}
                          onChange={handleSignupInputChange}
                          required
                        />
                      </Box>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={signupData.email}
                        onChange={handleSignupInputChange}
                        margin="normal"
                        required
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
                        type={showSignupPassword ? 'text' : 'password'}
                        value={signupData.password}
                        onChange={handleSignupInputChange}
                        margin="normal"
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
                                onClick={() => setShowSignupPassword(!showSignupPassword)}
                                edge="end"
                              >
                                {showSignupPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                      <TextField
                        fullWidth
                        label="Confirm Password"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={signupData.confirmPassword}
                        onChange={handleSignupInputChange}
                        margin="normal"
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
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                edge="end"
                              >
                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={isSignupLoading}
                        sx={{
                          mt: 3,
                          mb: 2,
                          py: 1.5,
                          background: '#0F3C60',
                          '&:hover': {
                            background: '#0F3C60',
                            opacity: 0.9
                          }
                        }}
                      >
                        {isSignupLoading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              )}
            </Box>
          )}

          {/* Community Admin Tab */}
          {activeTab === 1 && (
            <Card sx={{ border: '1px solid #e0e0e0' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#2c3e50' }}>
                  Admin Login
                </Typography>
                
                {adminError && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {adminError}
                  </Alert>
                )}

                <Box component="form" onSubmit={handleAdminSubmit}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={adminFormData.email}
                    onChange={(e) => handleAdminInputChange('email', e.target.value)}
                    margin="normal"
                    required
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
                    type={showAdminPassword ? 'text' : 'password'}
                    value={adminFormData.password}
                    onChange={(e) => handleAdminInputChange('password', e.target.value)}
                    margin="normal"
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
                            onClick={() => setShowAdminPassword(!showAdminPassword)}
                            edge="end"
                          >
                            {showAdminPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={isAdminLoading}
                    sx={{
                      mt: 3,
                      mb: 2,
                      py: 1.5,
                      background: '#0F3C60',
                      '&:hover': {
                        background: '#0F3C60',
                        opacity: 0.9
                      }
                    }}
                  >
                    {isAdminLoading ? <CircularProgress size={24} color="inherit" /> : 'Login as Admin'}
                  </Button>
                </Box>

                {/* Divider */}
                <Box sx={{ display: 'flex', alignItems: 'center', my: 3 }}>
                  <Box sx={{ flex: 1, height: '1px', bgcolor: '#e0e0e0' }} />
                  <Typography variant="body2" sx={{ mx: 2, color: '#666' }}>
                    or
                  </Typography>
                  <Box sx={{ flex: 1, height: '1px', bgcolor: '#e0e0e0' }} />
                </Box>

                {/* Google Sign In Button */}
                <Button
                  variant="outlined"
                  size="large"
                  fullWidth
                  sx={{
                    py: 1.5,
                    fontSize: '14px',
                    textTransform: 'none',
                    borderRadius: 2,
                    borderColor: '#dadce0',
                    color: '#3c4043',
                    backgroundColor: '#fff',
                    '&:hover': {
                      backgroundColor: '#f8f9fa',
                      borderColor: '#dadce0',
                    },
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                  startIcon={
                    <Box
                      component="img"
                      src={googleLogo}
                      alt="Google"
                      sx={{ width: 20, height: 20 }}
                    />
                  }
                >
                  Sign in with Google
                </Button>
              </CardContent>
            </Card>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CourseLoginModal;
