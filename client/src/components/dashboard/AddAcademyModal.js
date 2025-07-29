import React, { useState, useEffect } from 'react';
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
  Chip,
  Alert,
  IconButton,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import {
  Close as CloseIcon,
  School as SchoolIcon,
  Preview as PreviewIcon,
  CheckCircle as CheckCircleIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Image as ImageIcon,
  CloudUpload as CloudUploadIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Web as WebIcon,
  Assignment as AssignmentIcon,
  AddPhotoAlternate as AddPhotoAlternateIcon,
} from '@mui/icons-material';

// Country codes for phone validation
const countryCodes = [
  { code: '+1', country: 'US/Canada', pattern: /^\+1\s?\(\d{3}\)\s?\d{3}-\d{4}$/ },
  { code: '+44', country: 'UK', pattern: /^\+44\s?\d{4}\s?\d{6}$/ },
  { code: '+91', country: 'India', pattern: /^\+91\s?\d{10}$/ },
  { code: '+61', country: 'Australia', pattern: /^\+61\s?\d{1}\s?\d{4}\s?\d{4}$/ },
  { code: '+49', country: 'Germany', pattern: /^\+49\s?\d{2,4}\s?\d{3,4}\s?\d{4}$/ },
  { code: '+33', country: 'France', pattern: /^\+33\s?\d{1}\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}$/ },
  { code: '+81', country: 'Japan', pattern: /^\+81\s?\d{1,4}\s?\d{1,4}\s?\d{4}$/ },
  { code: '+86', country: 'China', pattern: /^\+86\s?\d{3}\s?\d{4}\s?\d{4}$/ },
  { code: '+507', country: 'Panama', pattern: /^\+507\s?\d{7,8}$/ },
];

const subscriptionPlans = [
  { id: 1, name: 'Basic', price: '$29', limits: '1 academy', color: '#4CAF50', features: ['Basic features', 'Email support', '1 academy limit'] },
  { id: 2, name: 'Standard', price: '$79', limits: '3 academies', color: '#2196F3', features: ['All Basic features', 'Priority support', '3 academies limit', 'Advanced analytics'] },
  { id: 3, name: 'Premium', price: '$199', limits: 'Unlimited academies', color: '#9C27B0', features: ['All Standard features', '24/7 support', 'Unlimited academies', 'Custom branding', 'API access'] },
];

const AddAcademyModal = ({ open, onClose, onSave, editingAcademy }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contactName: '',
    contactNumber: '',
    countryCode: '+1',
    subdomain: '',
    logo: null,
    subscriptionPlan: '',
    status: 'Active',
  });

  const [errors, setErrors] = useState({});
  const [logoPreview, setLogoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (editingAcademy) {
      setFormData({
        name: editingAcademy.name || '',
        address: editingAcademy.address || '',
        contactName: editingAcademy.contactName || '',
        contactNumber: editingAcademy.contactNumber || '',
        countryCode: editingAcademy.countryCode || '+1',
        subdomain: editingAcademy.subdomain || '',
        logo: editingAcademy.logo || null,
        subscriptionPlan: editingAcademy.subscriptionPlan || '',
        status: editingAcademy.status || 'Active',
      });
      setLogoPreview(editingAcademy.logo || null);
    } else {
      // Reset form for new academy
      setFormData({
        name: '',
        address: '',
        contactName: '',
        contactNumber: '',
        countryCode: '+1',
        subdomain: '',
        logo: null,
        subscriptionPlan: '',
        status: 'Active',
      });
      setLogoPreview(null);
    }
    setErrors({});
  }, [editingAcademy, open]);

  const validateForm = () => {
    const newErrors = {};

    // Required field validations
    if (!formData.name.trim()) newErrors.name = 'Academy name is required';
    if (!formData.address.trim()) newErrors.address = 'Academy address is required';
    if (!formData.contactName.trim()) newErrors.contactName = 'Contact name is required';
    if (!formData.subdomain.trim()) newErrors.subdomain = 'Subdomain is required';
    if (!formData.subscriptionPlan) newErrors.subscriptionPlan = 'Please select a subscription plan';
    if (!formData.logo) newErrors.logo = 'Academy logo is required';

    // Subdomain validation
    if (formData.subdomain.trim()) {
      const subdomainRegex = /^[a-z0-9-]+$/;
      if (!subdomainRegex.test(formData.subdomain.toLowerCase())) {
        newErrors.subdomain = 'Subdomain can only contain lowercase letters, numbers, and hyphens';
      }
      if (formData.subdomain.length < 3) {
        newErrors.subdomain = 'Subdomain must be at least 3 characters long';
      }
      if (formData.subdomain.length > 20) {
        newErrors.subdomain = 'Subdomain must be less than 20 characters';
      }
    }

    // Phone number validation
    if (formData.contactNumber.trim()) {
      const selectedCountry = countryCodes.find(c => c.code === formData.countryCode);
      if (selectedCountry) {
        const phoneWithoutSpaces = formData.contactNumber.replace(/\s/g, '');
        const expectedLength = selectedCountry.code.length + (selectedCountry.country === 'India' ? 10 : selectedCountry.country === 'Panama' ? 7 : 10);
        
        if (!phoneWithoutSpaces.startsWith(selectedCountry.code)) {
          newErrors.contactNumber = `Phone number must start with ${selectedCountry.code}`;
        } else if (phoneWithoutSpaces.length < expectedLength - 2 || phoneWithoutSpaces.length > expectedLength + 2) {
          const digitsNeeded = expectedLength - selectedCountry.code.length;
          newErrors.contactNumber = `Phone number should be approximately ${digitsNeeded} digits for ${selectedCountry.country}`;
        }
      }
    } else {
      newErrors.contactNumber = 'Contact number is required';
    }

    // Logo validation
    if (formData.logo) {
      const maxSize = 2 * 1024 * 1024; // 2MB (reduced from 5MB)
      if (formData.logo.size > maxSize) {
        newErrors.logo = 'Logo file size must be less than 2MB';
      }
      
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(formData.logo.type)) {
        newErrors.logo = 'Please upload a valid image file (JPEG, PNG, GIF, or WebP)';
      }
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

  const handleCountryCodeChange = (countryCode) => {
    setFormData(prev => ({ 
      ...prev, 
      countryCode,
      contactNumber: prev.contactNumber ? 
        (prev.contactNumber.match(/^\+\d+/) ? 
          prev.contactNumber.replace(/^\+\d+/, countryCode) : 
          countryCode + prev.contactNumber.replace(/^\+\d+/, '')
        ) : 
        countryCode
    }));
    
    if (errors.contactNumber) {
      setErrors(prev => ({ ...prev, contactNumber: '' }));
    }
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, logo: file }));
      
      const reader = new FileReader();
      reader.onload = (e) => setLogoPreview(e.target.result);
      reader.readAsDataURL(file);
      
      if (errors.logo) {
        setErrors(prev => ({ ...prev, logo: '' }));
      }
    }
  };

  const handleSave = async () => {
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        // Convert logo to base64 if it's a file
        let logoData = formData.logo;
        if (formData.logo instanceof File) {
          // Compress image before converting to base64
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const img = new Image();
          
          logoData = await new Promise((resolve) => {
            img.onload = () => {
              // Set canvas size (max 200x200 for smaller payload)
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
              
              // Draw and compress
              ctx.drawImage(img, 0, 0, width, height);
              const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7); // 70% quality
              resolve(compressedDataUrl);
            };
            img.src = URL.createObjectURL(formData.logo);
          });
        }

        const academyData = {
          name: formData.name.trim(),
          address: formData.address.trim(),
          contactName: formData.contactName.trim(),
          contactNumber: formData.contactNumber.trim(),
          countryCode: formData.countryCode,
          subdomain: formData.subdomain.toLowerCase().trim(),
          fullDomain: `${formData.subdomain.toLowerCase().trim()}.bbrtek-lms.com`,
          logo: logoData,
          subscriptionPlan: formData.subscriptionPlan,
          status: formData.status,
          students: 0,
          courses: 0,
        };

        // Send to backend API
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('Authentication token not found. Please login again.');
        }

        const url = editingAcademy 
          ? `http://localhost:5001/api/academies/${editingAcademy._id}`
          : 'http://localhost:5001/api/academies';
        
        const method = editingAcademy ? 'PUT' : 'POST';

        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(academyData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('API Error:', errorData);
          if (response.status === 401) {
            throw new Error('Authentication failed. Please login again.');
          } else if (response.status === 400) {
            throw new Error(errorData.message || 'Invalid data provided');
          } else {
            throw new Error(errorData.message || `Server error (${response.status})`);
          }
        }

        const savedAcademy = await response.json();
        
        // Call the onSave callback with the saved academy data
        onSave(savedAcademy.data || savedAcademy);
        
        // Close modal and reset form
        handleClose();
      } catch (error) {
        console.error('Error creating academy:', error);
        setErrors({ submit: error.message || 'Failed to create academy. Please try again.' });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      address: '',
      contactName: '',
      contactNumber: '',
      countryCode: '+1',
      subdomain: '',
      logo: null,
      subscriptionPlan: '',
      status: 'Active',
    });
    setErrors({});
    setLogoPreview(null);
    onClose();
  };

  const getAcademyInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Preview Card Component
  const PreviewCard = () => (
    <Card
      sx={{
        height: '100%',
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
      }}
    >
      <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 2 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          {logoPreview ? (
            <Avatar
              src={logoPreview}
              sx={{
                width: 60,
                height: 60,
                border: '3px solid rgba(255,255,255,0.3)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              }}
            >
              {getAcademyInitials(formData.name)}
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
              <SchoolIcon sx={{ fontSize: 30 }} />
            </Avatar>
          )}
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              {formData.name || 'Academy Name'}
            </Typography>
            <Chip
              label={formData.status || 'Active'}
              size="small"
              sx={{
                backgroundColor: 
                  formData.status === 'Active' ? 'rgba(76, 175, 80, 0.8)' : 
                  formData.status === 'Inactive' ? 'rgba(244, 67, 54, 0.8)' :
                  'rgba(255, 152, 0, 0.8)',
                color: 'white',
                fontWeight: 600,
              }}
            />
          </Box>
        </Box>

        {/* Academy Details */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, opacity: 0.9 }}>
            Academy Preview
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Domain */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <WebIcon sx={{ fontSize: 20, opacity: 0.8 }} />
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {formData.subdomain ? `${formData.subdomain}.bbrtek-lms.com` : 'your-subdomain.bbrtek-lms.com'}
              </Typography>
            </Box>

            {/* Address */}
            {formData.address && (
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <LocationIcon sx={{ fontSize: 20, opacity: 0.8, mt: 0.2 }} />
                <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.4 }}>
                  {formData.address}
                </Typography>
              </Box>
            )}

            {/* Contact */}
            {formData.contactName && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonIcon sx={{ fontSize: 20, opacity: 0.8 }} />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {formData.contactName}
                </Typography>
              </Box>
            )}

            {/* Phone */}
            {formData.contactNumber && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon sx={{ fontSize: 20, opacity: 0.8 }} />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {formData.contactNumber}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Subscription Plan */}
          {formData.subscriptionPlan && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, opacity: 0.9 }}>
                Subscription Plan
              </Typography>
              <Chip
                label={formData.subscriptionPlan}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 600,
                  border: '1px solid rgba(255,255,255,0.3)',
                }}
              />
            </Box>
          )}
        </Box>

        {/* Footer */}
        <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
          <Typography variant="caption" sx={{ opacity: 0.7 }}>
            Preview • {formData.name ? 'Ready to create' : 'Fill in the details'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="xl"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: (theme) => theme.palette.mode === 'light'
            ? 'rgba(255, 255, 255, 0.98)'
            : 'rgba(26, 26, 26, 0.98)',
          backdropFilter: 'blur(20px)',
          border: (theme) => `1px solid ${theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)'}`,
          boxShadow: (theme) => theme.palette.mode === 'light'
            ? '0 20px 40px rgba(0,0,0,0.1)'
            : '0 20px 40px rgba(0,0,0,0.3)',
        }
      }}
    >
      <DialogTitle sx={{
        background: (theme) => theme.palette.mode === 'light'
          ? 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
          : 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
        borderBottom: (theme) => `1px solid ${theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)'}`,
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
            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <SchoolIcon sx={{ fontSize: 24, color: 'white' }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
            {editingAcademy ? 'Edit Academy' : 'Create New Academy'}
          </Typography>
        </Box>
        <IconButton 
          onClick={handleClose} 
          sx={{ 
            color: 'text.secondary',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Grid container sx={{ minHeight: 600 }}>
          {/* Left Side - Form */}
          <Grid item xs={12} md={7} sx={{ p: 4 }}>
            <Box sx={{ maxWidth: 600 }}>
              {/* Basic Information Section */}
              <Typography variant="h6" sx={{ 
                mb: 3, 
                fontWeight: 600, 
                color: 'text.primary',
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5,
                fontSize: '1.125rem'
              }}>
                <Box sx={{
                  p: 0.5,
                  borderRadius: 1,
                  background: 'rgba(25, 118, 210, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <BusinessIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                </Box>
                Basic Information
              </Typography>
              
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Academy Name *"
                    placeholder="Enter academy name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    error={!!errors.name}
                    helperText={errors.name}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        },
                        '&.Mui-focused': {
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        fontWeight: 500,
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Subdomain *"
                    placeholder="Enter subdomain (e.g., myacademy)"
                    value={formData.subdomain}
                    onChange={(e) => handleInputChange('subdomain', e.target.value.toLowerCase())}
                    error={!!errors.subdomain}
                    helperText={errors.subdomain || `Your academy will be available at: ${formData.subdomain ? formData.subdomain.toLowerCase() + '.bbrtek-lms.com' : 'your-subdomain.bbrtek-lms.com'}`}
                    variant="outlined"
                    InputProps={{
                      endAdornment: (
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1, fontWeight: 500 }}>
                          .bbrtek-lms.com
                        </Typography>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        },
                        '&.Mui-focused': {
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        fontWeight: 500,
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Academy Address *"
                    placeholder="Enter complete address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    error={!!errors.address}
                    helperText={errors.address}
                    variant="outlined"
                    multiline
                    rows={2}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        },
                        '&.Mui-focused': {
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        fontWeight: 500,
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Status *"
                    placeholder="Select status"
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    select
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        },
                        '&.Mui-focused': {
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        fontWeight: 500,
                      },
                    }}
                  >
                    <MenuItem value="Active">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#4CAF50' }} />
                        Active
                      </Box>
                    </MenuItem>
                    <MenuItem value="Inactive">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#F44336' }} />
                        Inactive
                      </Box>
                    </MenuItem>
                    <MenuItem value="On Hold">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#FF9800' }} />
                        On Hold
                      </Box>
                    </MenuItem>
                  </TextField>
                </Grid>
              </Grid>

              {/* Contact Information Section */}
              <Typography variant="h6" sx={{ 
                mb: 3, 
                fontWeight: 600, 
                color: 'text.primary',
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5,
                fontSize: '1.125rem'
              }}>
                <Box sx={{
                  p: 0.5,
                  borderRadius: 1,
                  background: 'rgba(25, 118, 210, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <PersonIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                </Box>
                Contact Information
              </Typography>
              
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Contact Person *"
                    placeholder="Enter contact person name"
                    value={formData.contactName}
                    onChange={(e) => handleInputChange('contactName', e.target.value)}
                    error={!!errors.contactName}
                    helperText={errors.contactName}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        },
                        '&.Mui-focused': {
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        fontWeight: 500,
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Country Code"
                    placeholder="Select country code"
                    value={formData.countryCode}
                    onChange={(e) => handleCountryCodeChange(e.target.value)}
                    select
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        },
                        '&.Mui-focused': {
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        fontWeight: 500,
                      },
                    }}
                  >
                    {countryCodes.map((country) => (
                      <MenuItem key={country.code} value={country.code}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {country.code}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {country.country}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={8}>
                  <TextField
                    fullWidth
                    label="Phone Number *"
                    placeholder="Enter phone number"
                    value={formData.contactNumber}
                    onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                    error={!!errors.contactNumber}
                    helperText={errors.contactNumber}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        },
                        '&.Mui-focused': {
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        fontWeight: 500,
                      },
                    }}
                  />
                </Grid>
              </Grid>

              {/* Subscription Plan Section */}
              <Typography variant="h6" sx={{ 
                mb: 3, 
                fontWeight: 600, 
                color: 'text.primary',
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5,
                fontSize: '1.125rem'
              }}>
                <Box sx={{
                  p: 0.5,
                  borderRadius: 1,
                  background: 'rgba(25, 118, 210, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <AssignmentIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                </Box>
                Subscription & Branding
              </Typography>
              
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Subscription Plan *"
                    placeholder="Select subscription plan"
                    value={formData.subscriptionPlan}
                    onChange={(e) => handleInputChange('subscriptionPlan', e.target.value)}
                    error={!!errors.subscriptionPlan}
                    helperText={errors.subscriptionPlan}
                    select
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        },
                        '&.Mui-focused': {
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        fontWeight: 500,
                      },
                    }}
                  >
                    <MenuItem value="Basic">Basic Plan</MenuItem>
                    <MenuItem value="Standard">Standard Plan</MenuItem>
                    <MenuItem value="Premium">Premium Plan</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: 2,
                    p: 3,
                    borderRadius: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                  }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                      Academy Logo
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{
                        width: 60,
                        height: 60,
                        borderRadius: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px dashed rgba(0, 0, 0, 0.2)',
                        overflow: 'hidden',
                      }}>
                        {formData.logo ? (
                          <img
                            src={formData.logo instanceof File ? URL.createObjectURL(formData.logo) : formData.logo}
                            alt="Academy Logo"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {formData.name ? (
                              <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                                {getAcademyInitials(formData.name)}
                              </Typography>
                            ) : (
                              <AddPhotoAlternateIcon sx={{ fontSize: 24, color: 'text.secondary' }} />
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
                            size="small"
                            sx={{
                              borderRadius: 2,
                              textTransform: 'none',
                              fontWeight: 500,
                            }}
                          >
                            {formData.logo ? 'Change Logo' : 'Upload Logo'}
                          </Button>
                        </label>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                          Recommended: 200x200px, PNG/JPG
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          {/* Right Side - Preview */}
          <Grid item xs={12} md={5} sx={{ 
            p: 4, 
            background: (theme) => theme.palette.mode === 'light'
              ? 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
              : 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
            borderLeft: (theme) => `1px solid ${theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)'}`,
          }}>
            <PreviewCard />
          </Grid>
        </Grid>
      </DialogContent>

      {/* Action Buttons */}
      <Box sx={{ 
        p: 3, 
        borderTop: (theme) => `1px solid ${theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)'}`,
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 2,
      }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 500,
            px: 3,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
            },
          }}
        >
          {isSubmitting ? 'Saving...' : (editingAcademy ? 'Update Academy' : 'Create Academy')}
        </Button>
      </Box>
    </Dialog>
  );
};

export default AddAcademyModal; 