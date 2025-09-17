import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Button,
  TextField,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  Link
} from '@mui/material';
import {
  Close as CloseIcon,
  School as SchoolIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import communityAuthApi from '../utils/communityAuthApi';
import { apiUrl } from '../config/api';

const CourseLoginModal = ({ open, onClose, courseData }) => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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

    if (error) setError('');
    
    if (name === 'email' && value.includes('@')) {
      checkEmailCommunity(value);
    }
  };

  const checkEmailCommunity = async (email) => {
    if (!email || !email.includes('@')) return;
    
    setIsCheckingEmail(true);
    setDetectedCommunity(null);
    
    try {
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
          setDetectedCommunity(data);
        }
      }
    } catch (error) {
      console.error('Error checking email:', error);
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

      if (detectedCommunity) {
        userType = detectedCommunity.userType;
        
        if (detectedCommunity.userType === 'admin') {
          loginResult = await communityAuthApi.login(formData.email, formData.password);
        } else {
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

          localStorage.setItem('communityUserToken', userData.data.token);
          localStorage.setItem('communityUser', JSON.stringify(userData.data.user));
          localStorage.setItem('communityId', userData.data.user.community.id);
          
          loginResult = userData;
        }
      } else {
        // Try both login types automatically
        try {
          loginResult = await communityAuthApi.login(formData.email, formData.password);
          userType = 'admin';
        } catch (adminError) {
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

          localStorage.setItem('communityUserToken', userData.data.token);
          localStorage.setItem('communityUser', JSON.stringify(userData.data.user));
          localStorage.setItem('communityId', userData.data.user.community.id);
          
          loginResult = userData;
          userType = 'user';
        }
      }

      // Success - redirect to course
      setSuccess('Login successful! Redirecting to course...');

      let communityForRedirect = null;
      
      if (detectedCommunity) {
        communityForRedirect = detectedCommunity.community;
      } else if (userType === 'admin') {
        communityForRedirect = communityAuthApi.getCurrentCommunity();
      } else {
        const userData = JSON.parse(localStorage.getItem('communityUser'));
        communityForRedirect = userData?.community;
      }
      
      if (communityForRedirect && communityForRedirect.name) {
        const communityUrlName = communityForRedirect.name.toLowerCase().replace(/\s+/g, '-');
        
        if (userType === 'admin') {
          const courseUrl = `/${communityUrlName}/admin/course-viewer/${courseData?.id}`;
          setTimeout(() => {
            navigate(courseUrl);
            onClose();
          }, 1500);
        } else {
          const courseUrl = `/${communityUrlName}/student/course-viewer/${courseData?.id}`;
          setTimeout(() => {
            navigate(courseUrl);
            onClose();
          }, 1500);
        }
      } else {
        setError('Login successful but unable to redirect. Please try again.');
      }

    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          minHeight: 400
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SchoolIcon />
            Access Course
          </Typography>
          <CloseIcon 
            onClick={onClose}
            sx={{ 
              cursor: 'pointer',
              '&:hover': { opacity: 0.7 }
            }}
          />
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 0 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 1, color: 'text.primary' }}>
            {courseData?.title || 'This Course'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please log in to access this course content
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
              background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Login'
            )}
          </Button>

          {/* Signup Link */}
          <Box textAlign="center" mt={1}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Link
                component="button"
                variant="body2"
                onClick={() => {
                  onClose();
                  navigate('/community-user-signup');
                }}
                style={{ 
                  textDecoration: 'none',
                  color: '#1976d2',
                  fontWeight: 500
                }}
              >
                Sign up here
              </Link>
            </Typography>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CourseLoginModal;