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
  Alert,
  IconButton,
  CircularProgress,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import {
  Close as CloseIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  Lock as LockIcon,
  Email as EmailIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';

const AddUserModal = ({ open, onClose, onSave, editingUser }) => {
  const [formData, setFormData] = useState({
    email: '',
    role: 'admin',
    status: 'active',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Default password
  const defaultPassword = 'Password@123';

  // Populate form when editing
  useEffect(() => {
    if (editingUser) {
      setFormData({
        email: editingUser.email || '',
        role: editingUser.role || 'admin',
        status: editingUser.status || 'active',
      });
    } else {
      // Reset form for new user
      setFormData({
        email: '',
        role: 'admin',
        status: 'active',
      });
    }
    setErrors({});
  }, [editingUser, open]);

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    // Role validation
    if (!formData.role) {
      newErrors.role = 'Please select a role';
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

  const handleSave = async () => {
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const userData = {
          email: formData.email.trim().toLowerCase(),
          role: formData.role,
          status: formData.status,
          password: defaultPassword, // Always use default password for new users
        };

        // Send to backend API
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          throw new Error('Authentication token not found. Please login again.');
        }

        const url = editingUser 
          ? `http://localhost:5001/api/users/${editingUser._id}`
          : 'http://localhost:5001/api/users';
        
        const method = editingUser ? 'PUT' : 'POST';

        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(userData),
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

        const savedUser = await response.json();
        
        // Call the onSave callback with the saved user data
        onSave(savedUser.data || savedUser);
        
        // Close modal and reset form
        handleClose();
      } catch (error) {
        console.error('Error creating user:', error);
        setErrors({ submit: error.message || 'Failed to create user. Please try again.' });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleClose = () => {
    setFormData({
      email: '',
      role: 'admin',
      status: 'active',
    });
    setErrors({});
    onClose();
  };

  // User Role Preview Card
  const RolePreviewCard = () => (
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
          <Chip
            label={formData.role === 'admin' ? 'Administrator' : 'Standard User'}
            size="small"
            sx={{
              backgroundColor: formData.role === 'admin' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
              color: 'white',
              fontWeight: 600,
            }}
          />
          <Chip
            label={formData.status === 'active' ? 'Active' : 'Inactive'}
            size="small"
            sx={{
              backgroundColor: formData.status === 'active' ? 'rgba(76, 175, 80, 0.8)' : 'rgba(244, 67, 54, 0.8)',
              color: 'white',
              fontWeight: 600,
            }}
          />
        </Box>

        {/* User Details */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, opacity: 0.9 }}>
            User Preview
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Email */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EmailIcon sx={{ fontSize: 20, opacity: 0.8 }} />
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {formData.email || 'user@example.com'}
              </Typography>
            </Box>

            {/* Role */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SecurityIcon sx={{ fontSize: 20, opacity: 0.8 }} />
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Role: {formData.role === 'admin' ? 'Administrator' : 'Standard User'}
              </Typography>
            </Box>

            {/* Access Level */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, opacity: 0.9 }}>
                Access Level
              </Typography>
              {formData.role === 'admin' ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Chip label="Full System Access" size="small" sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }} />
                  <Chip label="All Pages" size="small" sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }} />
                  <Chip label="User Management" size="small" sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }} />
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Chip label="Limited Access" size="small" sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }} />
                  <Chip label="Academies Only" size="small" sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }} />
                  <Chip label="Plans Only" size="small" sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }} />
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        {/* Footer */}
        <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
          <Typography variant="caption" sx={{ opacity: 0.7 }}>
            Preview • {formData.email ? 'Ready to create' : 'Fill in the details'}
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
            <PersonIcon sx={{ fontSize: 24, color: 'white' }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
            {editingUser ? 'Edit User' : 'Create New User'}
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
                  <PersonIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                </Box>
                User Information
              </Typography>
              
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name *"
                    placeholder="Enter first name"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    error={!!errors.firstName}
                    helperText={errors.firstName}
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
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name *"
                    placeholder="Enter last name"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    error={!!errors.lastName}
                    helperText={errors.lastName}
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
                    label="Email Address *"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    error={!!errors.email}
                    helperText={errors.email}
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

              {/* Access Control Section */}
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
                Access Control
              </Typography>
              
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="User Role *"
                    placeholder="Select user role"
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    error={!!errors.role}
                    helperText={errors.role}
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
                    <MenuItem value="admin">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#1976d2' }} />
                        Administrator
                      </Box>
                    </MenuItem>
                    <MenuItem value="user">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#4CAF50' }} />
                        Standard User
                      </Box>
                    </MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Account Status *"
                    placeholder="Select account status"
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    error={!!errors.status}
                    helperText={errors.status}
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
                    <MenuItem value="active">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#4CAF50' }} />
                        Active
                      </Box>
                    </MenuItem>
                    <MenuItem value="inactive">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#F44336' }} />
                        Inactive
                      </Box>
                    </MenuItem>
                  </TextField>
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
            <RolePreviewCard />
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
          {isSubmitting ? 'Saving...' : (editingUser ? 'Update User' : 'Create User')}
        </Button>
      </Box>
    </Dialog>
  );
};

export default AddUserModal; 