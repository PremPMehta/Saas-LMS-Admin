import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Avatar,
  IconButton,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Chip,
} from '@mui/material';
import {
  Business as BusinessIcon,
  Web as WebIcon,
  Security as SecurityIcon,
  Image as ImageIcon,
  CloudUpload as CloudUploadIcon,
  AddPhotoAlternate as AddPhotoAlternateIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { getCommunityUrl } from '../utils/communityUrlUtils';
import useDocumentTitle from '../contexts/useDocumentTitle';

const CommunitySetup = () => {
  useDocumentTitle('Community Setup - Bell n Desk');
  console.log('CommunitySetup: Component is loading');
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get community data from location state or localStorage
  const getCommunityData = () => {
    if (location.state?.communityData) {
      // Store in localStorage for persistence
      localStorage.setItem('communitySetupData', JSON.stringify(location.state.communityData));
      return location.state.communityData;
    }
    
    // Try to get from localStorage if no state
    const storedData = localStorage.getItem('communitySetupData');
    if (storedData) {
      try {
        return JSON.parse(storedData);
      } catch (error) {
        console.error('Error parsing stored community data:', error);
        localStorage.removeItem('communitySetupData');
      }
    }
    
    // For testing - add some sample data if nothing is found
    const testData = {
      name: 'Test Community',
      description: 'A test community for development',
      category: 'Technology',
      plan: 'Basic',
      price: '$29',
      period: 'month'
    };
    
    console.log('CommunitySetup: No data found, using test data');
    return testData;
  };
  
  const communityData = getCommunityData();
  
  // Debug logging
  console.log('CommunitySetup: communityData =', communityData);
  
  // Redirect to create community if no data found
  useEffect(() => {
    console.log('CommunitySetup: useEffect triggered, communityData.name =', communityData.name);
    if (!communityData.name) {
      // Don't redirect immediately, let the user see the message first
      console.log('CommunitySetup: No community data found, showing message');
    }
  }, [communityData.name, navigate]);

  const [formData, setFormData] = useState({
    subdomain: '',
    ownerEmail: '',
    ownerPassword: '',
    confirmPassword: '',
    logo: null,
  });

  const [errors, setErrors] = useState({});
  const [logoPreview, setLogoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [subdomainAvailable, setSubdomainAvailable] = useState(null);
  const [checkingSubdomain, setCheckingSubdomain] = useState(false);

  // Generate subdomain from community name
  useEffect(() => {
    if (communityData.name && !formData.subdomain) {
      const generatedSubdomain = communityData.name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .substring(0, 20);
      setFormData(prev => ({ ...prev, subdomain: generatedSubdomain }));
    }
  }, [communityData.name]);

  // Check subdomain availability
  useEffect(() => {
    if (formData.subdomain && formData.subdomain.length >= 3) {
      const checkSubdomain = async () => {
        setCheckingSubdomain(true);
        try {
          // Simulate API call to check subdomain availability
          await new Promise(resolve => setTimeout(resolve, 1000));
          // For demo purposes, assume subdomain is available if it's not 'admin' or 'test'
          const isAvailable = !['admin', 'test', 'demo'].includes(formData.subdomain.toLowerCase());
          setSubdomainAvailable(isAvailable);
        } catch (error) {
          setSubdomainAvailable(false);
        } finally {
          setCheckingSubdomain(false);
        }
      };
      
      const timeoutId = setTimeout(checkSubdomain, 500);
      return () => clearTimeout(timeoutId);
    } else {
      setSubdomainAvailable(null);
    }
  }, [formData.subdomain]);

  const validateForm = () => {
    const newErrors = {};

    // Subdomain validation
    if (!formData.subdomain.trim()) {
      newErrors.subdomain = 'Subdomain is required';
    } else if (formData.subdomain.length < 3) {
      newErrors.subdomain = 'Subdomain must be at least 3 characters long';
    } else if (formData.subdomain.length > 20) {
      newErrors.subdomain = 'Subdomain must be less than 20 characters';
    } else if (!/^[a-z0-9-]+$/.test(formData.subdomain.toLowerCase())) {
      newErrors.subdomain = 'Subdomain can only contain lowercase letters, numbers, and hyphens';
    } else if (subdomainAvailable === false) {
      newErrors.subdomain = 'This subdomain is not available';
    }

    // Email validation
    if (!formData.ownerEmail.trim()) {
      newErrors.ownerEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.ownerEmail)) {
      newErrors.ownerEmail = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.ownerPassword) {
      newErrors.ownerPassword = 'Password is required';
    } else if (formData.ownerPassword.length < 8) {
      newErrors.ownerPassword = 'Password must be at least 8 characters long';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.ownerPassword)) {
      newErrors.ownerPassword = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.ownerPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Logo validation
    if (!formData.logo) {
      newErrors.logo = 'Community logo is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, logo: 'Logo file size must be less than 2MB' }));
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, logo: 'Please upload a valid image file (JPEG, PNG, GIF, or WebP)' }));
        return;
      }

      setFormData(prev => ({ ...prev, logo: file }));
      setLogoPreview(URL.createObjectURL(file));
      if (errors.logo) {
        setErrors(prev => ({ ...prev, logo: '' }));
      }
    }
  };

  const getCommunityInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        // Convert logo to base64
        let logoData = formData.logo;
        if (formData.logo instanceof File) {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const img = new Image();

          logoData = await new Promise((resolve) => {
            img.onload = () => {
              const maxSize = 200;
              let { width, height } = img;

              if (width > height) {
                if (width > maxSize) {
                  height = (height * maxSize) / width;
                  width = maxSize;
                }
              } else {
                if (height > maxSize) {
                  width = (width * maxSize) / height;
                  height = maxSize;
                }
              }

              canvas.width = width;
              canvas.height = height;
              ctx.drawImage(img, 0, 0, width, height);
              const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
              resolve(compressedDataUrl);
            };
            img.src = URL.createObjectURL(formData.logo);
          });
        }

        const setupData = {
          ...communityData,
          ownerEmail: formData.ownerEmail.trim(),
          ownerPassword: formData.ownerPassword,
          logo: logoData,
        };

        // Send to backend API
        console.log('Community setup data:', setupData);

        const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://saas-lms-admin-1.onrender.com'}/api/auth/community-signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: setupData.ownerEmail,
            password: setupData.ownerPassword,
            communityName: setupData.name,
            description: setupData.description,
            category: setupData.category,
            phoneNumber: formData.ownerPhoneNumber || '',
            logo: setupData.logo,
            plan: setupData.plan,
            price: setupData.price,
            period: setupData.period
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Failed to create community');
        }

        console.log('Community created successfully:', result);

        // Clear stored data
        localStorage.removeItem('communitySetupData');
        
        // Redirect to community dashboard
        const communityUrl = getCommunityUrl(setupData.name, 'dashboard');
        console.log('Redirecting to community URL after setup:', communityUrl);
        navigate(communityUrl, { 
          state: { 
            communityData: setupData,
            message: 'Community setup completed successfully!' 
          }
        });

      } catch (error) {
        console.error('Error setting up community:', error);
        setErrors({ submit: 'Failed to setup community. Please try again.' });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Show loading message if no data (but we have test data now)
  if (!communityData.name) {
    console.log('CommunitySetup: Rendering no data screen');
    return (
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Container maxWidth="sm">
          <Box sx={{ textAlign: 'center', color: 'white' }}>
            <CircularProgress sx={{ color: 'white', mb: 3 }} />
            <Typography variant="h5" sx={{ mb: 2 }}>
              Loading Community Setup...
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/create-community')}
              sx={{
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                '&:hover': {
                  background: 'rgba(255,255,255,0.3)',
                }
              }}
            >
              Create New Community
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      py: 4
    }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" sx={{ 
            fontWeight: 700, 
            color: 'white', 
            mb: 2 
          }}>
            Complete Your Community Setup
          </Typography>
          <Typography variant="h6" sx={{ 
            color: 'rgba(255,255,255,0.9)',
            maxWidth: 600,
            mx: 'auto'
          }}>
            Set up your subdomain, login credentials, and branding to launch your community
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Left Side - Form */}
          <Grid item size={{xs:12, md:7}} >
            <Card sx={{
              borderRadius: 3,
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.2)',
            }}>
              <CardContent sx={{ p: 4 }}>
                {/* Community Info */}
                <Box sx={{ mb: 4, p: 3, bgcolor: 'rgba(25, 118, 210, 0.1)', borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BusinessIcon color="primary" />
                    Community Information
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                    {communityData.name || 'Your Community'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {communityData.description || 'Community description'}
                  </Typography>
                  <Chip 
                    label={communityData.category || 'General'} 
                    size="small" 
                    sx={{ mt: 1 }}
                  />
                </Box>

                {/* Subdomain Setup */}
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WebIcon color="primary" />
                  Subdomain Setup
                </Typography>
                <TextField
                  fullWidth
                  label="Subdomain"
                  placeholder="Enter subdomain (e.g., mycommunity)"
                  value={formData.subdomain}
                  onChange={(e) => handleInputChange('subdomain', e.target.value.toLowerCase())}
                  error={!!errors.subdomain}
                  helperText={
                    errors.subdomain || 
                    (formData.subdomain ? `Your community will be available at: ${formData.subdomain}.bbrtek-lms.com` : '')
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {checkingSubdomain ? (
                          <CircularProgress size={20} />
                        ) : subdomainAvailable === true ? (
                          <CheckCircleIcon color="success" />
                        ) : subdomainAvailable === false ? (
                          <Typography color="error" variant="caption">Not available</Typography>
                        ) : null}
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 3 }}
                />

                {/* Login Credentials */}
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SecurityIcon color="primary" />
                  Login Credentials
                </Typography>
                <TextField
                  fullWidth
                  label="Owner Email"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.ownerEmail}
                  onChange={(e) => handleInputChange('ownerEmail', e.target.value)}
                  error={!!errors.ownerEmail}
                  helperText={errors.ownerEmail}
                  sx={{ mb: 3 }}
                />
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={formData.ownerPassword}
                  onChange={(e) => handleInputChange('ownerPassword', e.target.value)}
                  error={!!errors.ownerPassword}
                  helperText={errors.ownerPassword || 'Must be at least 8 characters with uppercase, lowercase, and number'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 3 }}
                />
                <TextField
                  fullWidth
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 4 }}
                />

                {/* Logo Upload */}
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ImageIcon color="primary" />
                  Community Logo
                </Typography>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                  p: 3,
                  border: '2px dashed rgba(0, 0, 0, 0.2)',
                  borderRadius: 2,
                  mb: 3,
                }}>
                  <Box sx={{
                    width: 80,
                    height: 80,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid rgba(0, 0, 0, 0.1)',
                    overflow: 'hidden',
                  }}>
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Community Logo"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {communityData.name ? (
                          <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                            {getCommunityInitials(communityData.name)}
                          </Typography>
                        ) : (
                          <AddPhotoAlternateIcon sx={{ fontSize: 32, color: 'text.secondary' }} />
                        )}
                      </Box>
                    )}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="logo-upload"
                      type="file"
                      onChange={handleLogoUpload}
                    />
                    <label htmlFor="logo-upload">
                      <Button
                        component="span"
                        variant="outlined"
                        startIcon={<CloudUploadIcon />}
                        sx={{ mb: 1 }}
                      >
                        {formData.logo ? 'Change Logo' : 'Upload Logo'}
                      </Button>
                    </label>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      Recommended: 200x200px, PNG/JPG (max 2MB)
                    </Typography>
                    {errors.logo && (
                      <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
                        {errors.logo}
                      </Typography>
                    )}
                  </Box>
                </Box>

                {/* Submit Button */}
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={isSubmitting || subdomainAvailable === false}
                  startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <ArrowForwardIcon />}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
                    },
                  }}
                >
                  {isSubmitting ? 'Setting up community...' : 'Complete Setup & Launch'}
                </Button>

                {errors.submit && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {errors.submit}
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Right Side - Preview */}
          <Grid item size={{xs:12, md:5}}>
            <Card sx={{
              height: 'fit-content',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.1)',
                zIndex: 1,
              },
            }}>
              <CardContent sx={{ p: 3, position: 'relative', zIndex: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, opacity: 0.9 }}>
                  Community Preview
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  {logoPreview ? (
                    <Avatar
                      src={logoPreview}
                      sx={{
                        width: 60,
                        height: 60,
                        border: '3px solid rgba(255,255,255,0.3)',
                      }}
                    >
                      {getCommunityInitials(communityData.name)}
                    </Avatar>
                  ) : (
                    <Avatar
                      sx={{
                        width: 60,
                        height: 60,
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        border: '3px solid rgba(255,255,255,0.3)',
                      }}
                    >
                      <BusinessIcon sx={{ fontSize: 30 }} />
                    </Avatar>
                  )}
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                      {communityData.name || 'Your Community'}
                    </Typography>
                    <Chip
                      label="SETUP"
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <WebIcon sx={{ fontSize: 20, opacity: 0.8 }} />
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {formData.subdomain ? `${formData.subdomain}.bbrtek-lms.com` : 'your-subdomain.bbrtek-lms.com'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <SecurityIcon sx={{ fontSize: 20, opacity: 0.8 }} />
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Owner: {formData.ownerEmail || 'your-email@example.com'}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    Preview • {formData.subdomain && formData.ownerEmail && formData.logo ? 'Ready to launch' : 'Complete the setup'}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CommunitySetup;
