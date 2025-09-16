import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Tabs,
  Tab,
  Divider,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
  IconButton
} from '@mui/material';
import {
  Close as CloseIcon,
  School as SchoolIcon,
  Business as BusinessIcon,
  Visibility,
  VisibilityOff,
  Google as GoogleIcon,
  Facebook as FacebookIcon
} from '@mui/icons-material';

// API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://saas-lms-admin-1.onrender.com' 
    : (process.env.NODE_ENV === 'production' ? 'https://saas-lms-admin-1.onrender.com' : 'http://localhost:5001'));

const LoginModal = ({ open, onClose, onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [industries, setIndustries] = useState([]);
  const [targetAudiences, setTargetAudiences] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(false);
  
  // Community onboarding states
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [isPlansLoading, setIsPlansLoading] = useState(false);

  // Fetch industries and target audiences when modal opens
  useEffect(() => {
    if (open) {
      fetchFormData();
    }
  }, [open]);

  const fetchFormData = async () => {
    setIsDataLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/data/form-data`);
      if (response.ok) {
        const data = await response.json();
        setIndustries(data.data.industries || []);
        setTargetAudiences(data.data.targetAudiences || []);
      } else {
        console.error('Failed to fetch form data');
        // Fallback data
        setIndustries([
          { name: 'Technology', description: 'Software development, IT services' },
          { name: 'Healthcare', description: 'Medical and health services' },
          { name: 'Finance', description: 'Banking and financial services' },
          { name: 'Education', description: 'Schools and training' },
          { name: 'Marketing', description: 'Digital marketing and advertising' },
          { name: 'Design', description: 'Creative and design services' },
          { name: 'Other', description: 'Other industries' }
        ]);
        setTargetAudiences([
          { name: 'Student', description: 'Students pursuing education' },
          { name: 'Professional', description: 'Working professionals' },
          { name: 'Entrepreneur', description: 'Business owners' },
          { name: 'Developer', description: 'Software developers' },
          { name: 'Designer', description: 'Creative professionals' },
          { name: 'Other', description: 'Other roles' }
        ]);
      }
    } catch (error) {
      console.error('Error fetching form data:', error);
      // Fallback data on error
      setIndustries([
        { name: 'Technology', description: 'Software development, IT services' },
        { name: 'Healthcare', description: 'Medical and health services' },
        { name: 'Finance', description: 'Banking and financial services' },
        { name: 'Education', description: 'Schools and training' },
        { name: 'Marketing', description: 'Digital marketing and advertising' },
        { name: 'Design', description: 'Creative and design services' },
        { name: 'Other', description: 'Other industries' }
      ]);
      setTargetAudiences([
        { name: 'Student', description: 'Students pursuing education' },
        { name: 'Professional', description: 'Working professionals' },
        { name: 'Entrepreneur', description: 'Business owners' },
        { name: 'Developer', description: 'Software developers' },
        { name: 'Designer', description: 'Creative professionals' },
        { name: 'Other', description: 'Other roles' }
      ]);
    } finally {
      setIsDataLoading(false);
    }
  };

  // Student form data
  const [studentForm, setStudentForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: '',
    industry: '',
    phoneNumber: ''
  });

  // Community form data
  const [communityForm, setCommunityForm] = useState({
    email: '',
    password: '',
    communityName: '',
    description: '',
    category: '',
    phoneNumber: '',
    ownerPassword: '' // Password for community owner
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setIsSignup(false);
    setError('');
  };

  const handleStudentInputChange = (field, value) => {
    setStudentForm(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  const handleCommunityInputChange = (field, value) => {
    setCommunityForm(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/student-signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentForm),
      });

      if (response.ok) {
        const data = await response.json();
        // Redirect to student dashboard
        window.location.href = '/student-dashboard';
        onLoginSuccess(data);
        onClose();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Signup failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommunitySubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/community-signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: communityForm.email,
          password: communityForm.ownerPassword,
          communityName: communityForm.communityName,
          description: communityForm.description,
          category: communityForm.category,
          phoneNumber: communityForm.phoneNumber
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Redirect to community dashboard
        window.location.href = '/community-dashboard';
        onLoginSuccess(data);
        onClose();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Signup failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStudentLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/student-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: studentForm.email,
          password: studentForm.password
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Redirect to student dashboard
        window.location.href = '/student-dashboard';
        onLoginSuccess(data);
        onClose();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommunityLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/community-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: communityForm.email,
          password: communityForm.password
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Store token and community data properly
        if (data.data && data.data.token) {
          localStorage.setItem('communityToken', data.data.token);
          localStorage.setItem('communityData', JSON.stringify(data.data.user));
          console.log('✅ Community token stored:', data.data.token);
          console.log('✅ Community data stored:', data.data.user);
        }
        
        // Redirect to community dashboard
        window.location.href = '/community-dashboard';
        onLoginSuccess(data);
        onClose();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStudentForm = () => (
    <Box component="form" onSubmit={isSignup ? handleStudentSubmit : handleStudentLogin}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <TextField
        fullWidth
        label="Email"
        type="email"
        value={studentForm.email}
        onChange={(e) => handleStudentInputChange('email', e.target.value)}
        required
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Password"
        type={showPassword ? 'text' : 'password'}
        value={studentForm.password}
        onChange={(e) => handleStudentInputChange('password', e.target.value)}
        required
        InputProps={{
          endAdornment: (
            <IconButton
              onClick={() => setShowPassword(!showPassword)}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          ),
        }}
        sx={{ mb: 2 }}
      />

      {isSignup && (
        <>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="First Name"
              value={studentForm.firstName}
              onChange={(e) => handleStudentInputChange('firstName', e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Last Name"
              value={studentForm.lastName}
              onChange={(e) => handleStudentInputChange('lastName', e.target.value)}
              required
            />
          </Box>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Current Role</InputLabel>
            <Select
              value={studentForm.role}
              onChange={(e) => handleStudentInputChange('role', e.target.value)}
              required
              disabled={isDataLoading}
            >
              {targetAudiences.map((audience) => (
                <MenuItem key={audience.name} value={audience.name}>
                  {audience.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Industry</InputLabel>
            <Select
              value={studentForm.industry}
              onChange={(e) => handleStudentInputChange('industry', e.target.value)}
              required
              disabled={isDataLoading}
            >
              {industries.map((industry) => (
                <MenuItem key={industry.name} value={industry.name}>
                  {industry.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Phone Number"
            value={studentForm.phoneNumber}
            onChange={(e) => handleStudentInputChange('phoneNumber', e.target.value)}
            sx={{ mb: 2 }}
          />
        </>
      )}

      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={isLoading}
        sx={{ mb: 2 }}
      >
        {isLoading ? <CircularProgress size={24} /> : (isSignup ? 'Sign Up' : 'Log In')}
      </Button>

      <Box sx={{ textAlign: 'center' }}>
        <Button
          variant="text"
          onClick={() => setIsSignup(!isSignup)}
          sx={{ textTransform: 'none' }}
        >
          {isSignup ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
        </Button>
      </Box>
    </Box>
  );

  const renderCommunityForm = () => (
    <Box component="form" onSubmit={isSignup ? handleCommunitySubmit : handleCommunityLogin}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <TextField
        fullWidth
        label="Email"
        type="email"
        value={communityForm.email}
        onChange={(e) => handleCommunityInputChange('email', e.target.value)}
        required
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Password"
        type={showPassword ? 'text' : 'password'}
        value={communityForm.password}
        onChange={(e) => handleCommunityInputChange('password', e.target.value)}
        required
        InputProps={{
          endAdornment: (
            <IconButton
              onClick={() => setShowPassword(!showPassword)}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          ),
        }}
        sx={{ mb: 2 }}
      />

      {isSignup && (
        <>
          <TextField
            fullWidth
            label="Community Name"
            value={communityForm.communityName}
            onChange={(e) => handleCommunityInputChange('communityName', e.target.value)}
            required
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Description"
            multiline
            rows={3}
            value={communityForm.description}
            onChange={(e) => handleCommunityInputChange('description', e.target.value)}
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={communityForm.category}
              onChange={(e) => handleCommunityInputChange('category', e.target.value)}
              required
              disabled={isDataLoading}
            >
              {industries.map((industry) => (
                <MenuItem key={industry.name} value={industry.name}>
                  {industry.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Phone Number"
            value={communityForm.phoneNumber}
            onChange={(e) => handleCommunityInputChange('phoneNumber', e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Owner Password"
            type={showPassword ? 'text' : 'password'}
            value={communityForm.ownerPassword}
            onChange={(e) => handleCommunityInputChange('ownerPassword', e.target.value)}
            required
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
            sx={{ mb: 2 }}
          />
        </>
      )}

      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={isLoading}
        sx={{ mb: 2 }}
      >
        {isLoading ? <CircularProgress size={24} /> : (isSignup ? 'Create Community' : 'Log In')}
      </Button>

      <Box sx={{ textAlign: 'center' }}>
        <Button
          variant="text"
          onClick={() => setIsSignup(!isSignup)}
          sx={{ textTransform: 'none' }}
        >
          {isSignup ? 'Already have a community? Log In' : "Don't have a community? Create One"}
        </Button>
      </Box>
    </Box>
  );

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
          <Typography variant="h5" fontWeight={600}>
            {isSignup ? 'Join Our Platform' : 'Welcome Back'}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 0 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          sx={{ mb: 3 }}
          centered
        >
          <Tab 
            icon={<SchoolIcon />} 
            label="Student" 
            iconPosition="start"
            sx={{ textTransform: 'none', fontWeight: 500 }}
          />
          <Tab 
            icon={<BusinessIcon />} 
            label="Community" 
            iconPosition="start"
            sx={{ textTransform: 'none', fontWeight: 500 }}
          />
        </Tabs>

        <Divider sx={{ mb: 3 }} />

        {activeTab === 0 ? renderStudentForm() : renderCommunityForm()}

        <Divider sx={{ my: 3 }}>
          <Chip label="OR" size="small" />
        </Divider>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            sx={{ textTransform: 'none' }}
          >
            Continue with Google
          </Button>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<FacebookIcon />}
            sx={{ textTransform: 'none' }}
          >
            Continue with Facebook
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
