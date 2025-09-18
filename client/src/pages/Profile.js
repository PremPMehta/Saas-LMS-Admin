import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
  TextField,
  MenuItem,
  IconButton,
  Divider,
  Alert,
  Chip,
  CircularProgress,
  Paper
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  PhotoCamera as PhotoCameraIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationOnIcon,
  Security as SecurityIcon,
  Add as AddIcon
} from '@mui/icons-material';
import FirstTimeProfileModal from '../components/profile/FirstTimeProfileModal';
import useDocumentTitle from '../contexts/useDocumentTitle';

// Country codes data (same as in modal)
const countryCodes = [
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+1', country: 'USA/Canada', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
  { code: '+86', country: 'China', flag: '🇨🇳' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { code: '+82', country: 'South Korea', flag: '🇰🇷' },
  { code: '+55', country: 'Brazil', flag: '🇧🇷' },
  { code: '+7', country: 'Russia', flag: '🇷🇺' },
  { code: '+39', country: 'Italy', flag: '🇮🇹' },
  { code: '+34', country: 'Spain', flag: '🇪🇸' }
];

const Profile = () => {
  useDocumentTitle('My Profile - Bell n Desk');
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFirstTimeModal, setShowFirstTimeModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [hasShownModal, setHasShownModal] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    countryCode: '+91',
    address: {
      street: '',
      city: '',
      state: '',
      country: 'India',
      zipCode: ''
    }
  });

  useEffect(() => {
    // Get user data from localStorage (from AuthContext)
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    
    if (userData) {
      setFormData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        phoneNumber: userData.phoneNumber || '',
        countryCode: userData.countryCode || '+91',
        address: {
          street: userData.address?.street || '',
          city: userData.address?.city || '',
          state: userData.address?.state || '',
          country: userData.address?.country || 'India',
          zipCode: userData.address?.zipCode || ''
        }
      });
      setPreviewUrl(userData.profilePicture || '');
      
      // Show first-time modal ONLY if profile is truly incomplete
      // Check if user has essential profile data filled
      const hasEssentialProfileData = userData.firstName && userData.lastName && userData.phoneNumber;
      const hasAddressData = userData.address?.street && userData.address?.city && userData.address?.state && userData.address?.country && userData.address?.zipCode;
      
      // Only show modal if profile is truly incomplete AND we haven't shown it before
      // Check if user came from login (which means they're not a first-time user)
      const cameFromLogin = location.state?.from === '/login' || location.state?.from === '/';
      const hasRecentLogin = sessionStorage.getItem('recentLogin') === 'true';
      const isFirstTimeUser = !userData.isProfileComplete && !cameFromLogin && !hasRecentLogin;
      
      // Show modal only if: profile incomplete + first time user + haven't shown modal + missing essential data
      if (isFirstTimeUser && !hasShownModal && (!hasEssentialProfileData || !hasAddressData)) {
        setShowFirstTimeModal(true);
        setHasShownModal(true);
      }
    }
    
    // Cleanup function to remove recent login flag when component unmounts
    return () => {
      sessionStorage.removeItem('recentLogin');
    };
  }, []);

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    // Also clear nested address errors
    if (field.startsWith('address.') && errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validation
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    
    if (file.size > maxSize) {
      setErrors({ image: 'Image size must be less than 5MB' });
      return;
    }
    
    if (!allowedTypes.includes(file.type)) {
      setErrors({ image: 'Only JPEG, PNG, and WebP images are allowed' });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target.result);
      setProfilePicture(file);
      setErrors({ image: '' });
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10,15}$/.test(formData.phoneNumber.replace(/\s/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }
    if (!formData.address.street.trim()) {
      newErrors['address.street'] = 'Street address is required';
    }
    if (!formData.address.city.trim()) {
      newErrors['address.city'] = 'City is required';
    }
    if (!formData.address.state.trim()) {
      newErrors['address.state'] = 'State is required';
    }
    if (!formData.address.country.trim()) {
      newErrors['address.country'] = 'Country is required';
    }
    if (!formData.address.zipCode.trim()) {
      newErrors['address.zipCode'] = 'Zip code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        // Here you would typically upload the image and get the URL
        const finalProfilePicture = profilePicture ? previewUrl : user?.profilePicture;

        const updatedUser = {
          ...user,
          ...formData,
          profilePicture: finalProfilePicture,
          isProfileComplete: true
        };

        // Update user data (this would typically be an API call)
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setIsEditing(false);
        
        // Show success message
        setErrors({ success: 'Profile updated successfully!' });
        setTimeout(() => setErrors({}), 3000);
      } catch (error) {
        console.error('Error updating profile:', error);
        setErrors({ submit: 'Failed to update profile. Please try again.' });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
      countryCode: user?.countryCode || '+91',
      address: {
        street: user?.address?.street || '',
        city: user?.address?.city || '',
        state: user?.address?.state || '',
        country: user?.address?.country || 'India',
        zipCode: user?.address?.zipCode || ''
      }
    });
    setPreviewUrl(user?.profilePicture || '');
    setProfilePicture(null);
    setErrors({});
    setIsEditing(false);
  };

  const handleFirstTimeComplete = async (profileData) => {
    try {
      const updatedUser = {
        ...user,
        ...profileData,
        isProfileComplete: true
      };

      // Update user data in localStorage (same key used by AuthContext)
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setFormData({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        phoneNumber: profileData.phoneNumber,
        countryCode: profileData.countryCode,
        address: profileData.address
      });
      setPreviewUrl(profileData.profilePicture);
      
      setShowFirstTimeModal(false);
      setErrors({ success: 'Profile completed successfully!' });
      setTimeout(() => setErrors({}), 3000);
    } catch (error) {
      console.error('Error completing profile:', error);
    }
  };

  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Banner Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
          height: 300,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          overflow: 'hidden'
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            pointerEvents: 'none'
          }}
        />
        
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
              Welcome, {user.firstName || 'User'}
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'short', 
                day: '2-digit', 
                month: 'long', 
                year: 'numeric' 
              })}
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: -8, position: 'relative', zIndex: 2 }}>
        {/* Success/Error Messages */}
        {errors.success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {errors.success}
          </Alert>
        )}
        {errors.submit && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errors.submit}
          </Alert>
        )}

        {/* Main Profile Card */}
        <Card sx={{ 
          borderRadius: 3, 
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          overflow: 'visible'
        }}>
          <CardContent sx={{ p: 0 }}>
            {/* Profile Header */}
            <Box sx={{ 
              p: 4, 
              pb: 6, 
              // textAlign: 'center',
              background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
              borderRadius: '12px 12px 0 0'
            }}>
              {/* Profile Picture */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' , gap: 2}}>
                  <Box sx={{ position: 'relative', display: 'inline-block'}}>
                    <Avatar
                      src={previewUrl}
                      sx={{ 
                        width: 150, 
                        height: 150, 
                        border: '6px solid white',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                        fontSize: '3rem',
                        cursor: isEditing ? 'pointer' : 'default'
                      }}
                      onClick={() => isEditing && document.getElementById('profile-picture-input').click()}
                    />
                    {isEditing && (
                      <IconButton
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          right: 0,
                          backgroundColor: 'primary.main',
                          color: 'white',
                          border: '3px solid white',
                          '&:hover': { backgroundColor: 'primary.dark' }
                        }}
                        onClick={() => document.getElementById('profile-picture-input').click()}
                      >
                        <PhotoCameraIcon />
                      </IconButton>
                    )}
                    <input
                      id="profile-picture-input"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                  </Box>

                  {/* User Info */}
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
                      {user.firstName} {user.lastName}
                    </Typography>
                    <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 400 }}>
                      {user.email}
                    </Typography>
                  </Box>
                </Box>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                  {!isEditing ? (
                    <Button
                      startIcon={<EditIcon />}
                      onClick={() => setIsEditing(true)}
                      variant="contained"
                      size="large"
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 4,
                        py: 1.5,
                        background: 'linear-gradient(135deg, #0F3C60 0%, #42a5f5 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #1565c0 0%, #0F3C60 100%)',
                        },
                      }}
                    >
                      Edit Profile
                    </Button>
                  ) : (
                    <>
                      <Button
                        startIcon={<CancelIcon />}
                        onClick={handleCancel}
                        variant="outlined"
                        size="large"
                        sx={{
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 600,
                          px: 4,
                          py: 1.5,
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        startIcon={<SaveIcon />}
                        onClick={handleSave}
                        variant="contained"
                        size="large"
                        disabled={isSubmitting}
                        sx={{
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 600,
                          px: 4,
                          py: 1.5,
                          background: 'linear-gradient(135deg, #0F3C60 0%, #42a5f5 100%)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #1565c0 0%, #0F3C60 100%)',
                          },
                        }}
                      >
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </>
                  )}
                </Box>
              </Box>

              {/* Profile Status */}
              <Box sx={{ ml: 2, mt: 2, textAlign: 'start'}}>
                <Chip 
                  label={user.isProfileComplete ? 'Profile Complete' : 'Profile Incomplete'} 
                  color={user.isProfileComplete ? 'success' : 'warning'}
                  size="medium"
                  sx={{ fontWeight: 600 }}
                />
              </Box>
            </Box>

            {/* Profile Form */}
            <Box sx={{ p: 4 }}>
              <Grid container spacing={4}>
                {/* Left Column */}
                <Grid size={{ xs: 12, md: 4}}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                    Personal Information
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12}}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        value={`${formData.firstName} ${formData.lastName}`}
                        onChange={(e) => {
                          const names = e.target.value.split(' ');
                          handleInputChange('firstName', names[0] || '');
                          handleInputChange('lastName', names.slice(1).join(' ') || '');
                        }}
                        error={!!errors.firstName || !!errors.lastName}
                        helperText={errors.firstName || errors.lastName}
                        variant="outlined"
                        disabled={!isEditing}
                        placeholder="Your Full Name"
                      />
                    </Grid>
                    
                    {/* <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Gender"
                        select
                        value=""
                        variant="outlined"
                        disabled={!isEditing}
                        placeholder="Select Gender"
                      >
                        <MenuItem value="male">Male</MenuItem>
                        <MenuItem value="female">Female</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                      </TextField>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Language"
                        select
                        value=""
                        variant="outlined"
                        disabled={!isEditing}
                        placeholder="Select Language"
                      >
                        <MenuItem value="en">English</MenuItem>
                        <MenuItem value="hi">Hindi</MenuItem>
                        <MenuItem value="es">Spanish</MenuItem>
                        <MenuItem value="fr">French</MenuItem>
                      </TextField>
                    </Grid> */}
                  </Grid>
                </Grid>

                {/* Right Column */}
                <Grid size={{ xs: 12, md: 8}}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                    Contact & Preferences
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item size={6}>
                      <TextField
                        fullWidth
                        label="Nick Name"
                        value=""
                        variant="outlined"
                        disabled={!isEditing}
                        placeholder="Your Nick Name"
                      />
                    </Grid>
                    
                    <Grid item size={6}>
                      <TextField
                        fullWidth
                        label="Country"
                        value={formData.address.country}
                        onChange={(e) => handleInputChange('address.country', e.target.value)}
                        variant="outlined"
                        disabled={!isEditing}
                        placeholder="Your Country"
                      />
                    </Grid>
                    
                    {/* <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Time Zone"
                        select
                        value=""
                        variant="outlined"
                        disabled={!isEditing}
                        placeholder="Select Time Zone"
                      >
                        <MenuItem value="utc+5:30">UTC +5:30 (India)</MenuItem>
                        <MenuItem value="utc-5">UTC -5 (Eastern US)</MenuItem>
                        <MenuItem value="utc+0">UTC +0 (London)</MenuItem>
                        <MenuItem value="utc+1">UTC +1 (Central Europe)</MenuItem>
                      </TextField>
                    </Grid> */}
                  </Grid>
                </Grid>
                <Grid item size={6}>
                  <Box sx={{ mb: 4 }}>
                      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EmailIcon color="primary" />
                        My Email Address
                      </Typography>
                      
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 2, 
                        p: 3, 
                        backgroundColor: 'rgba(25, 118, 210, 0.05)',
                        borderRadius: 2,
                        border: '1px solid rgba(25, 118, 210, 0.1)'
                      }}>
                        <EmailIcon color="primary" />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {user.email}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            1 month ago
                          </Typography>
                        </Box>
                        <Button
                          startIcon={<AddIcon />}
                          variant="outlined"
                          size="small"
                          sx={{ borderRadius: 2, textTransform: 'none' }}
                        >
                          +Add Email Address
                        </Button>
                      </Box>
                    </Box>
                </Grid>
                <Grid item size={6}>
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PhoneIcon color="primary" />
                    Phone Number
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        select
                        label="Country Code"
                        value={formData.countryCode}
                        onChange={(e) => handleInputChange('countryCode', e.target.value)}
                        variant="outlined"
                        disabled={!isEditing}
                      >
                        {countryCodes.map((option) => (
                          <MenuItem key={option.code} value={option.code}>
                            {option.flag} {option.code}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        value={formData.phoneNumber}
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                        error={!!errors.phoneNumber}
                        helperText={errors.phoneNumber}
                        variant="outlined"
                        disabled={!isEditing}
                        placeholder="Your Phone Number"
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              </Grid>

              {/* <Divider sx={{ my: 4 }} /> */}

              {/* Email Section */}
              

              {/* Phone Number Section */}

              {/* Address Section */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOnIcon color="primary" />
                  Address Information
                </Typography>
                
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Street Address"
                        value={formData.address.street}
                        onChange={(e) => handleInputChange('address.street', e.target.value)}
                        error={!!errors['address.street']}
                        helperText={errors['address.street']}
                        variant="outlined"
                        disabled={!isEditing}
                        placeholder="Your Street Address"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="City"
                        value={formData.address.city}
                        onChange={(e) => handleInputChange('address.city', e.target.value)}
                        error={!!errors['address.city']}
                        helperText={errors['address.city']}
                        variant="outlined"
                        disabled={!isEditing}
                        placeholder="Your City"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="State"
                        value={formData.address.state}
                        onChange={(e) => handleInputChange('address.state', e.target.value)}
                        error={!!errors['address.state']}
                        helperText={errors['address.state']}
                        variant="outlined"
                        disabled={!isEditing}
                        placeholder="Your State"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Country"
                        value={formData.address.country}
                        onChange={(e) => handleInputChange('address.country', e.target.value)}
                        error={!!errors['address.country']}
                        helperText={errors['address.country']}
                        variant="outlined"
                        disabled={!isEditing}
                        placeholder="Your Country"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Zip Code"
                        value={formData.address.zipCode}
                        onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
                        error={!!errors['address.zipCode']}
                        helperText={errors['address.zipCode']}
                        variant="outlined"
                        disabled={!isEditing}
                        placeholder="Your Zip Code"
                      />
                    </Grid>
                  </Grid>
              </Box>

              {/* Image Validation Error */}
              {errors.image && (
                <Alert severity="error" sx={{ mt: 3 }}>
                  {errors.image}
                </Alert>
              )}
            </Box>
          </CardContent>
        </Card>
      </Container>

      {/* First Time Profile Modal */}
      <FirstTimeProfileModal
        open={showFirstTimeModal}
        onComplete={handleFirstTimeComplete}
        user={user}
      />
    </Box>
  );
};

export default Profile;
