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
  Card,
  CardContent,
  Chip,
  Alert,
  CircularProgress,
  MenuItem,
  FormControlLabel,
  Switch,
  Divider,
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Star as StarIcon,
  LocalFireDepartment as PopularIcon,
  Check as CheckIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Security as SecurityIcon,
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useTheme } from '../../contexts/ThemeContext';

const AddPlanModal = ({ 
  open, 
  onClose, 
  onSave, 
  editingPlan = null 
}) => {
  const { mode } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    period: 'month',
    features: [''],
    limits: '',
    maxAcademies: 1,
    maxStudentsPerAcademy: 100,
    maxEducatorsPerAcademy: 10,
    status: 'Active',
    popular: false,
  });

  useEffect(() => {
    if (editingPlan) {
      setFormData({
        name: editingPlan.name || '',
        price: editingPlan.price || '',
        period: editingPlan.period || 'month',
        features: editingPlan.features || [''],
        limits: editingPlan.limits || '',
        maxAcademies: editingPlan.maxAcademies || 1,
        maxStudentsPerAcademy: editingPlan.maxStudentsPerAcademy || 100,
        maxEducatorsPerAcademy: editingPlan.maxEducatorsPerAcademy || 10,
        status: editingPlan.status || 'Active',
        popular: editingPlan.popular || false,
      });
    } else {
      setFormData({
        name: '',
        price: '',
        period: 'month',
        features: [''],
        limits: '',
        maxAcademies: 1,
        maxStudentsPerAcademy: 100,
        maxEducatorsPerAcademy: 10,
        status: 'Active',
        popular: false,
      });
    }
    setError('');
  }, [editingPlan, open]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({
      ...prev,
      features: newFeatures
    }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const removeFeature = (index) => {
    if (formData.features.length > 1) {
      const newFeatures = formData.features.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        features: newFeatures
      }));
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Plan name is required');
      return false;
    }
    if (!formData.price.trim()) {
      setError('Price is required');
      return false;
    }
    if (!formData.limits.trim()) {
      setError('Limits are required');
      return false;
    }
    if (!formData.maxAcademies || formData.maxAcademies < 1) {
      setError('Maximum academies must be at least 1');
      return false;
    }
    if (!formData.maxStudentsPerAcademy || formData.maxStudentsPerAcademy < 1) {
      setError('Maximum students per academy must be at least 1');
      return false;
    }
    if (!formData.maxEducatorsPerAcademy || formData.maxEducatorsPerAcademy < 1) {
      setError('Maximum educators per academy must be at least 1');
      return false;
    }
    if (formData.features.some(feature => !feature.trim())) {
      setError('All features must be filled');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('authToken');
      const url = editingPlan 
        ? `${process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? 'https://saas-lms-admin-1.onrender.com' : 'http://localhost:5001')}/api/plans/${editingPlan._id || editingPlan.id}`
        : `${process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? 'https://saas-lms-admin-1.onrender.com' : 'http://localhost:5001')}/api/plans`;
      
      const method = editingPlan ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        onSave();
      } else {
        setError(data.message || 'Failed to save plan');
      }
    } catch (error) {
      console.error('Error saving plan:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getPlanGradient = (planName) => {
    switch (planName.toLowerCase()) {
      case 'premium':
        return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      case 'standard':
        return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
      case 'basic':
        return 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
      default:
        return 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
    }
  };

  const getPlanIcon = (planName) => {
    switch (planName.toLowerCase()) {
      case 'premium':
        return <StarIcon sx={{ color: 'primary.main' }} />;
      case 'standard':
        return <StarIcon sx={{ color: 'secondary.main' }} />;
      case 'basic':
        return <StarIcon sx={{ color: 'text.secondary' }} />;
      default:
        return <AssignmentIcon />;
    }
  };

  // Plan Preview Card
  const PlanPreviewCard = () => (
    <Card
      sx={{
        height: '100%',
        background: getPlanGradient(formData.name),
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {getPlanIcon(formData.name)}
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {formData.name || 'Plan Name'}
            </Typography>
          </Box>
          {formData.popular && (
            <Chip
              label="Popular"
              size="small"
              sx={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontWeight: 600,
              }}
            />
          )}
        </Box>

        {/* Price */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            ${formData.price || '0'}/{formData.period}
          </Typography>
        </Box>

        {/* Plan Details */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, opacity: 0.9 }}>
            Plan Features
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
            {formData.features.filter(feature => feature.trim()).map((feature, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircleIcon sx={{ fontSize: 16, opacity: 0.8 }} />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {feature}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Limits */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, opacity: 0.9 }}>
              Plan Limits
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Chip 
                label={`${formData.maxAcademies} Academies`} 
                size="small" 
                sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }} 
              />
              <Chip 
                label={`${formData.maxStudentsPerAcademy} Students/Academy`} 
                size="small" 
                sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }} 
              />
              <Chip 
                label={`${formData.maxEducatorsPerAcademy} Educators/Academy`} 
                size="small" 
                sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }} 
              />
            </Box>
          </Box>
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
      onClose={onClose}
      maxWidth="lg"
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
            <AssignmentIcon sx={{ fontSize: 24, color: 'white' }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
            {editingPlan ? 'Edit Plan' : 'Add New Plan'}
          </Typography>
        </Box>
        <Button
          onClick={onClose}
          sx={{ minWidth: 'auto', p: 1, color: 'text.secondary' }}
        >
          <CloseIcon />
        </Button>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Grid container sx={{ minHeight: 600 }}>
          {/* Left Column - Form */}
          <Grid size={{ xs: 12, md: 7 }} sx={{ p: 4 }}>
            <Box sx={{ maxWidth: 600 }}>
              {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

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
                  <AssignmentIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                </Box>
                Plan Details
              </Typography>

              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Plan Name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g., Basic, Standard, Premium"
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: 'transparent',
                        '&:hover': {
                          backgroundColor: 'transparent',
                        },
                        '&.Mui-focused': {
                          backgroundColor: 'transparent',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        fontWeight: 500,
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Price"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="e.g., $29, $79, $199"
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: 'transparent',
                        '&:hover': {
                          backgroundColor: 'transparent',
                        },
                        '&.Mui-focused': {
                          backgroundColor: 'transparent',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        fontWeight: 500,
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Billing Period"
                    value={formData.period}
                    onChange={(e) => handleInputChange('period', e.target.value)}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: 'transparent',
                        '&:hover': {
                          backgroundColor: 'transparent',
                        },
                        '&.Mui-focused': {
                          backgroundColor: 'transparent',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        fontWeight: 500,
                      },
                    }}
                  >
                    <MenuItem value="month">Monthly</MenuItem>
                    <MenuItem value="year">Yearly</MenuItem>
                    <MenuItem value="quarter">Quarterly</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Limits"
                    value={formData.limits}
                    onChange={(e) => handleInputChange('limits', e.target.value)}
                    placeholder="e.g., 1 academy, 3 academies, Unlimited"
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: 'transparent',
                        '&:hover': {
                          backgroundColor: 'transparent',
                        },
                        '&.Mui-focused': {
                          backgroundColor: 'transparent',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        fontWeight: 500,
                      },
                    }}
                  />
                </Grid>
              </Grid>

              {/* Limitations Section */}
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
                  <SecurityIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                </Box>
                Limitations
              </Typography>

              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Maximum Academies"
                    type="number"
                    value={formData.maxAcademies}
                    onChange={(e) => handleInputChange('maxAcademies', parseInt(e.target.value) || 1)}
                    placeholder="e.g., 1, 5, 10"
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: 'transparent',
                        '&:hover': {
                          backgroundColor: 'transparent',
                        },
                        '&.Mui-focused': {
                          backgroundColor: 'transparent',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        fontWeight: 500,
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Maximum Students per Academy"
                    type="number"
                    value={formData.maxStudentsPerAcademy}
                    onChange={(e) => handleInputChange('maxStudentsPerAcademy', parseInt(e.target.value) || 1)}
                    placeholder="e.g., 100, 200, 500"
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: 'transparent',
                        '&:hover': {
                          backgroundColor: 'transparent',
                        },
                        '&.Mui-focused': {
                          backgroundColor: 'transparent',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        fontWeight: 500,
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Maximum Educators per Academy"
                    type="number"
                    value={formData.maxEducatorsPerAcademy}
                    onChange={(e) => handleInputChange('maxEducatorsPerAcademy', parseInt(e.target.value) || 1)}
                    placeholder="e.g., 10, 20, 50"
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: 'transparent',
                        '&:hover': {
                          backgroundColor: 'transparent',
                        },
                        '&.Mui-focused': {
                          backgroundColor: 'transparent',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        fontWeight: 500,
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Status"
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: 'transparent',
                        '&:hover': {
                          backgroundColor: 'transparent',
                        },
                        '&.Mui-focused': {
                          backgroundColor: 'transparent',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        fontWeight: 500,
                      },
                    }}
                  >
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                    <MenuItem value="Onhold">Onhold</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    height: '100%', 
                    pt: 2,
                    pl: 1
                  }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.popular}
                          onChange={(e) => handleInputChange('popular', e.target.checked)}
                          color="primary"
                        />
                      }
                      label="Mark as Popular"
                      sx={{
                        '& .MuiFormControlLabel-label': {
                          fontWeight: 500,
                          color: 'text.primary',
                        }
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              {/* Features Section */}
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
                  <CheckCircleIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                </Box>
                Features
              </Typography>
              
              {formData.features.map((feature, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <TextField
                    fullWidth
                    label={`Feature ${index + 1}`}
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    placeholder="e.g., Up to 100 students"
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: 'transparent',
                        '&:hover': {
                          backgroundColor: 'transparent',
                        },
                        '&.Mui-focused': {
                          backgroundColor: 'transparent',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        fontWeight: 500,
                      },
                    }}
                  />
                  <Button
                    onClick={() => removeFeature(index)}
                    variant="outlined"
                    color="error"
                    sx={{
                      minWidth: 'auto',
                      px: 2,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 500,
                    }}
                  >
                    <DeleteIcon />
                  </Button>
                </Box>
              ))}
              
              <Button
                onClick={addFeature}
                variant="outlined"
                startIcon={<AddIcon />}
                sx={{
                  mt: 2,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 500,
                }}
              >
                Add Feature
              </Button>
            </Box>
          </Grid>

          {/* Right Column - Preview */}
          <Grid size={{ xs: 12, md: 5 }} sx={{ 
            p: 4, 
            background: (theme) => theme.palette.mode === 'light'
              ? 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
              : 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
            borderLeft: (theme) => `1px solid ${theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)'}`,
          }}>
            <PlanPreviewCard />
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
          onClick={onClose}
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
          onClick={handleSubmit}
          variant="contained"
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
          {editingPlan ? 'Update Plan' : 'Create Plan'}
        </Button>
      </Box>
    </Dialog>
  );
};

export default AddPlanModal; 