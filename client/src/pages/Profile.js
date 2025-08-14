import React, { useState, useEffect } from 'react';
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
  LocationOn as LocationIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
import FirstTimeProfileModal from '../components/profile/FirstTimeProfileModal';

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
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFirstTimeModal, setShowFirstTimeModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

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
    // Get user data from localStorage or context
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
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
      
      // Show first-time modal if profile is incomplete
      if (!userData.isProfileComplete) {
        setShowFirstTimeModal(true);
      }
    }
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
      newErrors.street = 'Street address is required';
    }
    if (!formData.address.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!formData.address.state.trim()) {
      newErrors.state = 'State is required';
    }
    if (!formData.address.country.trim()) {
      newErrors.country = 'Country is required';
    }
    if (!formData.address.zipCode.trim()) {
      newErrors.zipCode = 'Zip code is required';
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
        localStorage.setItem('userData', JSON.stringify(updatedUser));
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

      // Update user data (this would typically be an API call)
      localStorage.setItem('userData', JSON.stringify(updatedUser));
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
          Profile Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your account information and preferences
        </Typography>
      </Box>

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

      <Grid container spacing={3}>
        {/* Profile Picture Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: 'fit-content' }}>
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <Box sx={{ position: 'relative', display: 'inline-block', mb: 3 }}>
                <Avatar
                  src={previewUrl}
                  sx={{ 
                    width: 150, 
                    height: 150, 
                    border: '4px solid #e3f2fd',
                    fontSize: '3rem'
                  }}
                />
                {isEditing && (
                  <IconButton
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      backgroundColor: 'primary.main',
                      color: 'white',
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
              
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                {user.firstName} {user.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {user.role === 'admin' ? 'Administrator' : 'Standard User'}
              </Typography>
              
              <Chip 
                label={user.isProfileComplete ? 'Profile Complete' : 'Profile Incomplete'} 
                color={user.isProfileComplete ? 'success' : 'warning'}
                size="small"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Profile Information Card */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Personal Information
                </Typography>
                {!isEditing ? (
                  <Button
                    startIcon={<EditIcon />}
                    onClick={() => setIsEditing(true)}
                    variant="outlined"
                    size="small"
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      startIcon={<CancelIcon />}
                      onClick={handleCancel}
                      variant="outlined"
                      size="small"
                    >
                      Cancel
                    </Button>
                    <Button
                      startIcon={<SaveIcon />}
                      onClick={handleSave}
                      variant="contained"
                      size="small"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </Box>
                )}
              </Box>

              <Grid container spacing={3}>
                {/* First Name */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                    variant="outlined"
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>

                {/* Last Name */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                    variant="outlined"
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>

                {/* Email */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    value={formData.email}
                    variant="outlined"
                    disabled={true}
                    InputProps={{
                      startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                    helperText="Email address cannot be changed"
                  />
                </Grid>

                {/* Phone Number */}
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
                    InputProps={{
                      startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 4 }} />

              {/* Address Section */}
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
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
                    error={!!errors.street}
                    helperText={errors.street}
                    variant="outlined"
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="City"
                    value={formData.address.city}
                    onChange={(e) => handleInputChange('address.city', e.target.value)}
                    error={!!errors.city}
                    helperText={errors.city}
                    variant="outlined"
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="State"
                    value={formData.address.state}
                    onChange={(e) => handleInputChange('address.state', e.target.value)}
                    error={!!errors.state}
                    helperText={errors.state}
                    variant="outlined"
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Country"
                    value={formData.address.country}
                    onChange={(e) => handleInputChange('address.country', e.target.value)}
                    error={!!errors.country}
                    helperText={errors.country}
                    variant="outlined"
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Zip Code"
                    value={formData.address.zipCode}
                    onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
                    error={!!errors.zipCode}
                    helperText={errors.zipCode}
                    variant="outlined"
                    disabled={!isEditing}
                  />
                </Grid>
              </Grid>

              {/* Image Validation Error */}
              {errors.image && (
                <Alert severity="error" sx={{ mt: 3 }}>
                  {errors.image}
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* First Time Profile Modal */}
      <FirstTimeProfileModal
        open={showFirstTimeModal}
        onComplete={handleFirstTimeComplete}
        user={user}
      />
    </Container>
  );
};

export default Profile;
