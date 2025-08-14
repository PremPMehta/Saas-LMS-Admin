import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  MenuItem,
  Avatar,
  IconButton,
  Alert,
  CircularProgress,
  Chip
} from '@mui/material';
import {
  Close as CloseIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  PhotoCamera as PhotoCameraIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from '@mui/icons-material';

// Country codes data
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

const FirstTimeProfileModal = ({ open, onComplete, user }) => {
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
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

  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.profilePicture || '');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef();

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

    // Required fields validation
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

  const handleSubmit = async () => {
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        // Here you would typically upload the image and get the URL
        // For now, we'll use the preview URL or a default avatar
        const finalProfilePicture = profilePicture ? previewUrl : 
          `https://ui-avatars.com/api/?name=${formData.firstName}+${formData.lastName}&background=1976d2&color=fff&size=200`;

        const profileData = {
          ...formData,
          profilePicture: finalProfilePicture,
          isProfileComplete: true
        };

        // Call the onComplete callback
        await onComplete(profileData);
      } catch (error) {
        console.error('Error updating profile:', error);
        setErrors({ submit: 'Failed to update profile. Please try again.' });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Dialog 
      open={open} 
      maxWidth="md"
      fullWidth
      disableEscapeKeyDown
      disableBackdropClick
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        }
      }}
    >
      <DialogTitle sx={{
        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
        color: 'white',
        borderRadius: '12px 12px 0 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 3,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{
            p: 1,
            borderRadius: 2,
            background: 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <PersonIcon sx={{ fontSize: 24, color: 'white' }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Complete Your Profile
          </Typography>
        </Box>
        <Chip 
          label="Required" 
          color="warning" 
          size="small"
          sx={{ color: 'white', backgroundColor: 'rgba(255,255,255,0.2)' }}
        />
      </DialogTitle>

      <DialogContent sx={{ p: 4 }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          Please complete your profile information to continue using the platform.
        </Alert>

        <Grid container spacing={3}>
          {/* Profile Picture Section */}
          <Grid item xs={12} sx={{ textAlign: 'center', mb: 2 }}>
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              <Avatar
                src={previewUrl}
                sx={{ 
                  width: 120, 
                  height: 120, 
                  border: '4px solid #e3f2fd',
                  cursor: 'pointer'
                }}
                onClick={() => fileInputRef.current?.click()}
              />
              <IconButton
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': { backgroundColor: 'primary.dark' }
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <PhotoCameraIcon />
              </IconButton>
            </Box>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Click to upload profile picture (Max 5MB, JPEG/PNG/WebP)
            </Typography>
            {errors.image && (
              <Alert severity="error" sx={{ mt: 1, maxWidth: 300, mx: 'auto' }}>
                {errors.image}
              </Alert>
            )}
          </Grid>

          {/* Personal Information */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="First Name *"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              error={!!errors.firstName}
              helperText={errors.firstName}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Last Name *"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              error={!!errors.lastName}
              helperText={errors.lastName}
              variant="outlined"
            />
          </Grid>

          {/* Phone Number */}
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              select
              label="Country Code *"
              value={formData.countryCode}
              onChange={(e) => handleInputChange('countryCode', e.target.value)}
              variant="outlined"
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
              label="Phone Number *"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber}
              variant="outlined"
              placeholder="9879228567"
            />
          </Grid>

          {/* Address Information */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
              Address Information
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Street Address *"
              value={formData.address.street}
              onChange={(e) => handleInputChange('address.street', e.target.value)}
              error={!!errors.street}
              helperText={errors.street}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="City *"
              value={formData.address.city}
              onChange={(e) => handleInputChange('address.city', e.target.value)}
              error={!!errors.city}
              helperText={errors.city}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="State *"
              value={formData.address.state}
              onChange={(e) => handleInputChange('address.state', e.target.value)}
              error={!!errors.state}
              helperText={errors.state}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Country *"
              value={formData.address.country}
              onChange={(e) => handleInputChange('address.country', e.target.value)}
              error={!!errors.country}
              helperText={errors.country}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Zip Code *"
              value={formData.address.zipCode}
              onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
              error={!!errors.zipCode}
              helperText={errors.zipCode}
              variant="outlined"
            />
          </Grid>
        </Grid>

        {errors.submit && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {errors.submit}
          </Alert>
        )}
      </DialogContent>

      <Box sx={{ 
        p: 3, 
        borderTop: '1px solid rgba(0, 0, 0, 0.08)',
        display: 'flex',
        justifyContent: 'center',
      }}>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <CheckCircleIcon />}
          size="large"
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            px: 4,
            py: 1.5,
            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
            },
          }}
        >
          {isSubmitting ? 'Saving Profile...' : 'Complete Profile'}
        </Button>
      </Box>
    </Dialog>
  );
};

export default FirstTimeProfileModal;
