import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import communityAuthApi from '../utils/communityAuthApi';
import CommunityLayout from '../components/layout/CommunityLayout';
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
  Paper,
  InputAdornment,
  Tooltip
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  PhotoCamera as PhotoCameraIcon,
  Business as BusinessIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationOnIcon,
  ContentCopy as CopyIcon,
  CheckCircle as CheckCircleIcon,
  School as SchoolIcon,
  Code as CodeIcon
} from '@mui/icons-material';
import useDocumentTitle from '../contexts/useDocumentTitle';

const CommunityProfile = () => {
  useDocumentTitle('Community Profile - Bell & Desk');
  const navigate = useNavigate();
  const [community, setCommunity] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [copied, setCopied] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    ownerName: '',
    ownerEmail: '',
    ownerPhoneNumber: '',
    ownerCountryCode: '+91',
    website: '',
    location: {
      country: '',
      city: '',
      timezone: 'UTC'
    }
  });

  useEffect(() => {
    // Check authentication
    if (!communityAuthApi.isAuthenticated()) {
      navigate('/community-login');
      return;
    }

    // Get community data
    const currentCommunity = communityAuthApi.getCurrentCommunity();
    if (!currentCommunity) {
      navigate('/community-login');
      return;
    }

    setCommunity(currentCommunity);
    setFormData({
      name: currentCommunity.name || '',
      description: currentCommunity.description || '',
      category: currentCommunity.category || '',
      ownerName: currentCommunity.ownerName || '',
      ownerEmail: currentCommunity.ownerEmail || '',
      ownerPhoneNumber: currentCommunity.ownerPhoneNumber || '',
      ownerCountryCode: currentCommunity.ownerCountryCode || '+91',
      website: currentCommunity.website || '',
      location: {
        country: currentCommunity.location?.country || '',
        city: currentCommunity.location?.city || '',
        timezone: currentCommunity.location?.timezone || 'UTC'
      }
    });
  }, [navigate]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleLocationChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    setErrors({});
    setSuccess('');

    try {
      // Here you would typically call an API to update the community profile
      // For now, we'll just simulate success
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      
      // Update local state
      setCommunity(prev => ({
        ...prev,
        ...formData
      }));
    } catch (error) {
      setErrors({ general: error.message || 'Failed to update profile' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrors({});
    // Reset form data to original values
    if (community) {
      setFormData({
        name: community.name || '',
        description: community.description || '',
        category: community.category || '',
        ownerName: community.ownerName || '',
        ownerEmail: community.ownerEmail || '',
        ownerPhoneNumber: community.ownerPhoneNumber || '',
        ownerCountryCode: community.ownerCountryCode || '+91',
        website: community.website || '',
        location: {
          country: community.location?.country || '',
          city: community.location?.city || '',
          timezone: community.location?.timezone || 'UTC'
        }
      });
    }
  };

  const copyReferralCode = async () => {
    if (community?.referralCode) {
      try {
        await navigator.clipboard.writeText(community.referralCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy: ', err);
      }
    }
  };

  if (!community) {
    return (
      <CommunityLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </CommunityLayout>
    );
  }

  return (
    <CommunityLayout>
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Community Profile
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your community settings and information
            </Typography>
          </Box>

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}

          {errors.general && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errors.general}
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* Main Profile Card */}
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Community Information
                    </Typography>
                    {!isEditing ? (
                      <Button
                        startIcon={<EditIcon />}
                        onClick={() => setIsEditing(true)}
                        variant="outlined"
                      >
                        Edit Profile
                      </Button>
                    ) : (
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          startIcon={<CancelIcon />}
                          onClick={handleCancel}
                          variant="outlined"
                          color="error"
                        >
                          Cancel
                        </Button>
                        <Button
                          startIcon={isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />}
                          onClick={handleSave}
                          variant="contained"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </Button>
                      </Box>
                    )}
                  </Box>

                  <Grid container spacing={3}>
                    {/* Community Name */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Community Name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        disabled={!isEditing}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <BusinessIcon sx={{ color: 'text.secondary' }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    {/* Category */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        select
                        label="Category"
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        disabled={!isEditing}
                      >
                        <MenuItem value="Technology">Technology</MenuItem>
                        <MenuItem value="Healthcare">Healthcare</MenuItem>
                        <MenuItem value="Finance">Finance</MenuItem>
                        <MenuItem value="Education">Education</MenuItem>
                        <MenuItem value="Marketing">Marketing</MenuItem>
                        <MenuItem value="Design">Design</MenuItem>
                        <MenuItem value="Sales">Sales</MenuItem>
                        <MenuItem value="Consulting">Consulting</MenuItem>
                        <MenuItem value="Manufacturing">Manufacturing</MenuItem>
                        <MenuItem value="Retail">Retail</MenuItem>
                        <MenuItem value="Real Estate">Real Estate</MenuItem>
                        <MenuItem value="Entertainment">Entertainment</MenuItem>
                        <MenuItem value="Non-profit">Non-profit</MenuItem>
                        <MenuItem value="Government">Government</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </TextField>
                    </Grid>

                    {/* Description */}
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Description"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        disabled={!isEditing}
                      />
                    </Grid>

                    {/* Website */}
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Website"
                        value={formData.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        disabled={!isEditing}
                        placeholder="https://yourwebsite.com"
                      />
                    </Grid>

                    {/* Location */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Country"
                        value={formData.location.country}
                        onChange={(e) => handleLocationChange('country', e.target.value)}
                        disabled={!isEditing}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocationOnIcon sx={{ color: 'text.secondary' }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="City"
                        value={formData.location.city}
                        onChange={(e) => handleLocationChange('city', e.target.value)}
                        disabled={!isEditing}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Referral Code Card */}
            <Grid item xs={12} md={4}>
              <Card sx={{ height: 'fit-content' }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <CodeIcon sx={{ mr: 2, color: 'primary.main' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Referral Code
                    </Typography>
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Share this code with students to give them access to your academy courses.
                  </Typography>

                  <Paper
                    sx={{
                      p: 3,
                      bgcolor: 'primary.main',
                      color: 'white',
                      textAlign: 'center',
                      position: 'relative'
                    }}
                  >
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, letterSpacing: 2 }}>
                      {community.referralCode || 'GENERATE'}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      8-Character Code
                    </Typography>
                    
                    <Tooltip title={copied ? "Copied!" : "Copy to clipboard"}>
                      <IconButton
                        onClick={copyReferralCode}
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          color: 'white',
                          '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                        }}
                      >
                        {copied ? <CheckCircleIcon /> : <CopyIcon />}
                      </IconButton>
                    </Tooltip>
                  </Paper>

                  <Box sx={{ mt: 3 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      <strong>How it works:</strong>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      • Students enter this code during signup
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      • They get access to all your academy courses
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      • You can track their progress and engagement
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              {/* Stats Card */}
              <Card sx={{ mt: 3 }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    Community Stats
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Total Courses
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {community.courseCount || 0}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Total Members
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {community.memberCount || 0}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Status
                    </Typography>
                    <Chip
                      label={community.status || 'Active'}
                      color={community.status === 'active' ? 'success' : 'warning'}
                      size="small"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </CommunityLayout>
  );
};

export default CommunityProfile;
