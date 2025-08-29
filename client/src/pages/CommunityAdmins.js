import React, { useState, useEffect } from 'react';
import communityAuthApi from '../utils/communityAuthApi';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Tooltip,
  Badge,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Security as SecurityIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  ArrowBack as ArrowBackIcon,
  Home as HomeIcon,
  Dashboard as DashboardIcon,
  FlashOn as FlashIcon,
  Description as DescriptionIcon,
  VideoLibrary as VideoIcon,
  People as PeopleIcon,
  WbSunny as SunIcon,
  DarkMode as DarkIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';

const CommunityAdmins = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [communityData, setCommunityData] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Dialog states
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'admin',
    permissions: {
      canCreateCourses: true,
      canEditCourses: true,
      canDeleteCourses: false,
      canManageAdmins: false,
      canViewAnalytics: true,
      canManageStudents: true
    }
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formErrors, setFormErrors] = useState({});

  // Mock data for demonstration
  const mockAdmins = [
    {
      _id: '1',
      name: 'John Doe',
      email: 'john.doe@academy.com',
      phone: '+1 (555) 123-4567',
      role: 'admin',
      status: 'active',
      joinedDate: '2024-01-15',
      lastLogin: '2024-01-20',
      permissions: {
        canCreateCourses: true,
        canEditCourses: true,
        canDeleteCourses: false,
        canManageAdmins: false,
        canViewAnalytics: true,
        canManageStudents: true
      }
    },
    {
      _id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@academy.com',
      phone: '+1 (555) 987-6543',
      role: 'admin',
      status: 'active',
      joinedDate: '2024-01-10',
      lastLogin: '2024-01-19',
      permissions: {
        canCreateCourses: true,
        canEditCourses: true,
        canDeleteCourses: true,
        canManageAdmins: false,
        canViewAnalytics: true,
        canManageStudents: true
      }
    },
    {
      _id: '3',
      name: 'Mike Johnson',
      email: 'mike.johnson@academy.com',
      phone: '+1 (555) 456-7890',
      role: 'moderator',
      status: 'inactive',
      joinedDate: '2024-01-05',
      lastLogin: '2024-01-15',
      permissions: {
        canCreateCourses: false,
        canEditCourses: true,
        canDeleteCourses: false,
        canManageAdmins: false,
        canViewAnalytics: false,
        canManageStudents: true
      }
    }
  ];

  // Check authentication on component mount
  useEffect(() => {
    if (!communityAuthApi.isAuthenticated()) {
      console.log('❌ User not authenticated, redirecting to login...');
      navigate('/community-login');
      return;
    }

    // Get community data
    const currentCommunity = communityAuthApi.getCurrentCommunity();
    if (!currentCommunity) {
      console.log('❌ No community data found, redirecting to login...');
      navigate('/community-login');
      return;
    }
    
    setCommunityData(currentCommunity);
    console.log('✅ User authenticated, community data loaded:', currentCommunity);
  }, [navigate]);

  // Load admins
  useEffect(() => {
    const loadAdmins = async () => {
      try {
        setLoading(true);
        // For now, using mock data. In production, this would be an API call
        // const response = await adminApi.getCommunityAdmins(communityData.id);
        // setAdmins(response.admins);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setAdmins(mockAdmins);
        console.log('📊 Admins loaded:', mockAdmins.length, 'admins');
      } catch (error) {
        console.error('❌ Error loading admins:', error);
        setAdmins(mockAdmins); // Fallback to mock data
      } finally {
        setLoading(false);
      }
    };

    if (communityData) {
      loadAdmins();
    }
  }, [communityData]);

  // Manual refresh function
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setAdmins(mockAdmins);
      console.log('✅ Admins refreshed successfully');
    } catch (error) {
      console.error('❌ Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Form validation
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newAdmin = {
        _id: Date.now().toString(),
        ...formData,
        status: 'active',
        joinedDate: new Date().toISOString().split('T')[0],
        lastLogin: null
      };
      
      setAdmins(prev => [...prev, newAdmin]);
      handleCloseDialogs();
      resetForm();
      console.log('✅ Admin added successfully');
    } catch (error) {
      console.error('❌ Error adding admin:', error);
    }
  };

  // Handle edit admin
  const handleEditAdmin = async () => {
    if (!selectedAdmin) return;

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAdmins(prev => prev.map(admin => 
        admin._id === selectedAdmin._id ? { ...admin, ...formData } : admin
      ));
      
      handleCloseDialogs();
      resetForm();
      console.log('✅ Admin updated successfully');
    } catch (error) {
      console.error('❌ Error updating admin:', error);
    }
  };

  // Handle delete admin
  const handleDeleteAdmin = async () => {
    if (!selectedAdmin) return;

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAdmins(prev => prev.filter(admin => admin._id !== selectedAdmin._id));
      handleCloseDialogs();
      console.log('✅ Admin deleted successfully');
    } catch (error) {
      console.error('❌ Error deleting admin:', error);
    }
  };

  // Handle dialog operations
  const handleAddAdmin = () => {
    setSelectedAdmin(null);
    resetForm();
    setOpenAddDialog(true);
  };

  const handleEditAdminClick = (admin) => {
    setSelectedAdmin(admin);
    setFormData({
      name: admin.name,
      email: admin.email,
      phone: admin.phone,
      role: admin.role,
      permissions: { ...admin.permissions }
    });
    setPassword('');
    setConfirmPassword('');
    setOpenEditDialog(true);
  };

  const handleDeleteAdminClick = (admin) => {
    setSelectedAdmin(admin);
    setOpenDeleteDialog(true);
  };

  const handleCloseDialogs = () => {
    setOpenAddDialog(false);
    setOpenEditDialog(false);
    setOpenDeleteDialog(false);
    setSelectedAdmin(null);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'admin',
      permissions: {
        canCreateCourses: true,
        canEditCourses: true,
        canDeleteCourses: false,
        canManageAdmins: false,
        canViewAnalytics: true,
        canManageStudents: true
      }
    });
    setPassword('');
    setConfirmPassword('');
    setFormErrors({});
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'success' : 'error';
  };

  const getRoleColor = (role) => {
    return role === 'admin' ? 'primary' : 'secondary';
  };

  const getPermissionIcon = (permission) => {
    return permission ? <CheckCircleIcon color="success" /> : <WarningIcon color="disabled" />;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading community admins...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: darkMode ? '#1a1a1a' : '#f5f5f5' }}>
      {/* Sidebar */}
      <Box sx={{
        width: 80,
        background: darkMode ? '#2d2d2d' : '#ffffff',
        borderRight: `1px solid ${darkMode ? '#404040' : '#e0e0e0'}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: 2,
        position: 'fixed',
        height: '100vh',
        zIndex: 1000
      }}>
        {/* Logo */}
        <Box sx={{ mb: 4 }}>
          <Avatar sx={{ 
            bgcolor: '#4285f4', 
            width: 50, 
            height: 50,
            fontSize: '1.5rem',
            fontWeight: 'bold'
          }}>
            {communityData?.name?.charAt(0) || 'C'}
          </Avatar>
        </Box>

        {/* Navigation Items */}
        {[
          { icon: <HomeIcon />, label: 'Home', path: '/community-dashboard' },
          { icon: <VideoIcon />, label: 'Courses', path: '/courses' },
          { icon: <PeopleIcon />, label: 'Admins', path: '/community-admins' },
          { icon: <DashboardIcon />, label: 'Dashboard', path: '/dashboard' },
          { icon: <FlashIcon />, label: 'Analytics', path: '/analytics' },
          { icon: <DescriptionIcon />, label: 'Reports', path: '/reports' }
        ].map((item, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <IconButton
              onClick={() => navigate(item.path)}
              sx={{
                color: window.location.pathname === item.path 
                  ? (darkMode ? '#ffffff' : '#000000')
                  : (darkMode ? '#404040' : '#f0f0f0'),
              }}
            >
              {item.icon}
            </IconButton>
          </Box>
        ))}

        {/* Logout Button */}
        <Box sx={{ mt: 'auto', mb: 2 }}>
          <IconButton 
            onClick={() => {
              communityAuthApi.logout();
              navigate('/community-login');
            }}
            sx={{ color: darkMode ? '#ffffff' : '#000000' }}
            title="Logout"
          >
            <ArrowBackIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ 
        flex: 1, 
        ml: 10, // Account for fixed sidebar
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Top Header */}
        <Box sx={{
          height: 80,
          background: darkMode ? '#2d2d2d' : '#ffffff',
          borderBottom: `1px solid ${darkMode ? '#404040' : '#e0e0e0'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 4,
          position: 'sticky',
          top: 0,
          zIndex: 999,
        }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ 
              bgcolor: '#4285f4', 
              mr: 2,
              width: 40,
              height: 40
            }}>
              <AdminIcon />
            </Avatar>
            <Typography variant="h6" sx={{ 
              fontWeight: 700,
              color: darkMode ? '#ffffff' : '#000000'
            }}>
              {communityData?.name || 'Community'} Admins
            </Typography>
          </Box>

          {/* Right - Theme Toggle */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              onClick={handleRefresh}
              disabled={refreshing}
              sx={{ color: darkMode ? '#ffffff' : '#000000' }}
              title="Refresh admins"
            >
              <RefreshIcon sx={{ 
                animation: refreshing ? 'spin 1s linear infinite' : 'none',
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' }
                }
              }} />
            </IconButton>
            <IconButton
              onClick={() => setDarkMode(!darkMode)}
              sx={{ color: darkMode ? '#ffffff' : '#000000' }}
            >
              {darkMode ? <SunIcon /> : <DarkIcon />}
            </IconButton>
          </Box>
        </Box>

        {/* Main Content */}
        <Box sx={{ flex: 1, p: 4 }}>
          <Container maxWidth="xl">
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  Community Admins
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Manage administrators for {communityData?.name || 'your community'} ({admins.length} admins)
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddAdmin}
                sx={{
                  background: '#4285f4',
                  '&:hover': { background: '#3367d6' }
                }}
              >
                Add Admin
              </Button>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#4285f4' }}>
                          {admins.length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total Admins
                        </Typography>
                      </Box>
                      <AdminIcon sx={{ fontSize: 40, color: '#4285f4' }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#34a853' }}>
                          {admins.filter(a => a.status === 'active').length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Active Admins
                        </Typography>
                      </Box>
                      <CheckCircleIcon sx={{ fontSize: 40, color: '#34a853' }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#fbbc04' }}>
                          {admins.filter(a => a.role === 'admin').length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Full Admins
                        </Typography>
                      </Box>
                      <SecurityIcon sx={{ fontSize: 40, color: '#fbbc04' }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#ea4335' }}>
                          {admins.filter(a => a.role === 'moderator').length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Moderators
                        </Typography>
                      </Box>
                      <PersonIcon sx={{ fontSize: 40, color: '#ea4335' }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Admins List */}
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Admin List
                </Typography>
                
                {admins.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      No admins found
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 3 }}>
                      Add your first admin to start managing your community together
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={handleAddAdmin}
                    >
                      Add First Admin
                    </Button>
                  </Box>
                ) : (
                  <List>
                    {admins.map((admin, index) => (
                      <React.Fragment key={admin._id}>
                        <ListItem sx={{ py: 2 }}>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: getRoleColor(admin.role) }}>
                              {admin.name.charAt(0)}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                  {admin.name}
                                </Typography>
                                <Chip 
                                  label={admin.role} 
                                  size="small" 
                                  color={getRoleColor(admin.role)}
                                />
                                <Chip 
                                  label={admin.status} 
                                  size="small" 
                                  color={getStatusColor(admin.status)}
                                />
                              </Box>
                            }
                            secondary={
                              <Box sx={{ mt: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <EmailIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                    <Typography variant="body2" color="text.secondary">
                                      {admin.email}
                                    </Typography>
                                  </Box>
                                  {admin.phone && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                      <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                      <Typography variant="body2" color="text.secondary">
                                        {admin.phone}
                                      </Typography>
                                    </Box>
                                  )}
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography variant="caption" color="text.secondary">
                                    Joined: {admin.joinedDate}
                                  </Typography>
                                  {admin.lastLogin && (
                                    <>
                                      <Typography variant="caption" color="text.secondary">•</Typography>
                                      <Typography variant="caption" color="text.secondary">
                                        Last login: {admin.lastLogin}
                                      </Typography>
                                    </>
                                  )}
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                  <Typography variant="caption" color="text.secondary">
                                    Permissions:
                                  </Typography>
                                  {Object.entries(admin.permissions).map(([key, value]) => (
                                    <Tooltip key={key} title={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}>
                                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        {getPermissionIcon(value)}
                                      </Box>
                                    </Tooltip>
                                  ))}
                                </Box>
                              </Box>
                            }
                          />
                          <ListItemSecondaryAction>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <IconButton
                                onClick={() => handleEditAdminClick(admin)}
                                sx={{ color: '#4285f4' }}
                                title="Edit admin"
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton
                                onClick={() => handleDeleteAdminClick(admin)}
                                sx={{ color: '#ea4335' }}
                                title="Delete admin"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          </ListItemSecondaryAction>
                        </ListItem>
                        {index < admins.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Container>
        </Box>
      </Box>

      {/* Add Admin Dialog */}
      <Dialog open={openAddDialog} onClose={handleCloseDialogs} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Add New Admin
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={!!formErrors.name}
                helperText={formErrors.name}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={!!formErrors.email}
                helperText={formErrors.email}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  label="Role"
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="moderator">Moderator</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!formErrors.password}
                helperText={formErrors.password}
                required
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={!!formErrors.confirmPassword}
                helperText={formErrors.confirmPassword}
                required
              />
            </Grid>
            
            {/* Permissions Section */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Permissions
              </Typography>
              <Grid container spacing={2}>
                {Object.entries(formData.permissions).map(([key, value]) => (
                  <Grid item xs={12} sm={6} md={4} key={key}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={value}
                          onChange={(e) => setFormData({
                            ...formData,
                            permissions: {
                              ...formData.permissions,
                              [key]: e.target.checked
                            }
                          })}
                        />
                      }
                      label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Add Admin
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Admin Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseDialogs} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Edit Admin: {selectedAdmin?.name}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={!!formErrors.name}
                helperText={formErrors.name}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={!!formErrors.email}
                helperText={formErrors.email}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  label="Role"
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="moderator">Moderator</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {/* Permissions Section */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Permissions
              </Typography>
              <Grid container spacing={2}>
                {Object.entries(formData.permissions).map(([key, value]) => (
                  <Grid item xs={12} sm={6} md={4} key={key}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={value}
                          onChange={(e) => setFormData({
                            ...formData,
                            permissions: {
                              ...formData.permissions,
                              [key]: e.target.checked
                            }
                          })}
                        />
                      }
                      label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs}>Cancel</Button>
          <Button onClick={handleEditAdmin} variant="contained">
            Update Admin
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDialogs} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Delete Admin
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to delete the admin "{selectedAdmin?.name}"?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This action cannot be undone. The admin will lose access to all community features.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs}>Cancel</Button>
          <Button onClick={handleDeleteAdmin} variant="contained" color="error">
            Delete Admin
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CommunityAdmins;
