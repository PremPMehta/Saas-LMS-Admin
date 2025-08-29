import React, { useState, useEffect } from 'react';
import communityAuthApi from '../utils/communityAuthApi';
import communityAdminApi from '../utils/communityAdminApi';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
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
  TableSortLabel,
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
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  
  // Table pagination and sorting
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState('name');
  const [order, setOrder] = useState('asc');
  
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
    permissions: {
      canCreateCourses: true,
      canEditCourses: true,
      canDeleteCourses: false
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
        canDeleteCourses: false
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
        
        if (!communityData?._id) {
          console.log('❌ No community ID available');
          setAdmins([]);
          setInitialLoadComplete(true);
          return;
        }

        console.log('🔄 Loading admins for community:', communityData._id);
        const response = await communityAdminApi.getCommunityAdmins(communityData._id);
        
        if (response.success) {
          setAdmins(response.data);
          console.log('📊 Admins loaded from API:', response.data.length, 'admins');
        } else {
          console.log('⚠️ No admins found, using empty array');
          setAdmins([]);
        }
        
        setInitialLoadComplete(true);
      } catch (error) {
        console.error('❌ Error loading admins:', error);
        // Fallback to mock data for development
        setAdmins(mockAdmins);
        setInitialLoadComplete(true);
      } finally {
        setLoading(false);
      }
    };

    if (communityData && !initialLoadComplete) {
      loadAdmins();
    }
  }, [communityData, initialLoadComplete]);

  // Manual refresh function
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      if (!communityData?._id) {
        console.log('❌ No community ID available for refresh');
        return;
      }

      console.log('🔄 Refreshing admins for community:', communityData._id);
      const response = await communityAdminApi.getCommunityAdmins(communityData._id);
      
      if (response.success) {
        setAdmins(response.data);
        console.log('✅ Admins refreshed from database:', response.data.length, 'admins');
      } else {
        console.log('⚠️ No admins found during refresh');
        setAdmins([]);
      }
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
      if (!communityData?._id) {
        console.error('❌ No community ID available');
        return;
      }

      const adminData = {
        communityId: communityData._id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: password,
        permissions: formData.permissions
      };

      console.log('🔄 Creating admin:', adminData);
      const response = await communityAdminApi.createCommunityAdmin(adminData);
      
      if (response.success) {
        // Add the new admin to the list
        setAdmins(prev => [...prev, response.data]);
        handleCloseDialogs();
        resetForm();
        console.log('✅ Admin added successfully to database');
      } else {
        console.error('❌ Failed to create admin:', response.message);
      }
    } catch (error) {
      console.error('❌ Error adding admin:', error);
      // Fallback to local state for development
      const newAdmin = {
        _id: Date.now().toString(),
        ...formData,
        role: 'admin',
        status: 'active',
        joinedDate: new Date().toISOString().split('T')[0],
        lastLogin: null
      };
      
      setAdmins(prev => [...prev, newAdmin]);
      handleCloseDialogs();
      resetForm();
      console.log('✅ Admin added to local state (fallback)');
    }
  };

  // Handle edit admin
  const handleEditAdmin = async () => {
    if (!selectedAdmin) return;

    try {
      const adminData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        permissions: formData.permissions
      };

      console.log('🔄 Updating admin:', selectedAdmin._id, adminData);
      const response = await communityAdminApi.updateCommunityAdmin(selectedAdmin._id, adminData);
      
      if (response.success) {
        // Update the admin in the list
        setAdmins(prev => prev.map(admin => 
          admin._id === selectedAdmin._id ? { ...admin, ...response.data } : admin
        ));
        handleCloseDialogs();
        resetForm();
        console.log('✅ Admin updated successfully in database');
      } else {
        console.error('❌ Failed to update admin:', response.message);
      }
    } catch (error) {
      console.error('❌ Error updating admin:', error);
      // Fallback to local state for development
      setAdmins(prev => prev.map(admin => 
        admin._id === selectedAdmin._id ? { ...admin, ...formData } : admin
      ));
      handleCloseDialogs();
      resetForm();
      console.log('✅ Admin updated in local state (fallback)');
    }
  };

  // Handle delete admin
  const handleDeleteAdmin = async () => {
    if (!selectedAdmin) return;

    try {
      console.log('🔄 Deleting admin:', selectedAdmin._id);
      const response = await communityAdminApi.deleteCommunityAdmin(selectedAdmin._id);
      
      if (response.success) {
        // Remove the admin from the list
        setAdmins(prev => prev.filter(admin => admin._id !== selectedAdmin._id));
        handleCloseDialogs();
        console.log('✅ Admin deleted successfully from database');
      } else {
        console.error('❌ Failed to delete admin:', response.message);
      }
    } catch (error) {
      console.error('❌ Error deleting admin:', error);
      // Fallback to local state for development
      setAdmins(prev => prev.filter(admin => admin._id !== selectedAdmin._id));
      handleCloseDialogs();
      console.log('✅ Admin deleted from local state (fallback)');
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
      permissions: {
        canCreateCourses: true,
        canEditCourses: true,
        canDeleteCourses: false
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

  // Handle permission toggle changes
  const handlePermissionChange = (key, checked) => {
    const newPermissions = {
      ...formData.permissions,
      [key]: checked
    };
    console.log(`🔄 Permission "${key}" changed to: ${checked}`);
    console.log('📋 Updated permissions:', newPermissions);
    setFormData({
      ...formData,
      permissions: newPermissions
    });
  };

  // Sorting function
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Pagination functions
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Sort admins
  const sortedAdmins = React.useMemo(() => {
    const sorted = [...admins].sort((a, b) => {
      let aValue = a[orderBy];
      let bValue = b[orderBy];
      
      // Handle nested properties
      if (orderBy === 'permissions') {
        aValue = Object.values(a.permissions).filter(Boolean).length;
        bValue = Object.values(b.permissions).filter(Boolean).length;
      }
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (order === 'desc') {
        return bValue > aValue ? 1 : -1;
      }
      return aValue > bValue ? 1 : -1;
    });
    
    return sorted;
  }, [admins, orderBy, order]);

  // Paginate admins
  const paginatedAdmins = React.useMemo(() => {
    const startIndex = page * rowsPerPage;
    return sortedAdmins.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedAdmins, page, rowsPerPage]);

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
          <Box key={index} sx={{ mb: 2, position: 'relative' }}>
            <IconButton
              onClick={() => navigate(item.path)}
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                backgroundColor: window.location.pathname === item.path 
                  ? (darkMode ? '#404040' : '#000000')
                  : 'transparent',
                color: window.location.pathname === item.path 
                  ? '#ffffff' 
                  : (darkMode ? '#ffffff' : '#000000'),
                '&:hover': {
                  backgroundColor: window.location.pathname === item.path 
                    ? (darkMode ? '#404040' : '#000000')
                    : (darkMode ? '#404040' : '#f0f0f0'),
                }
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

            {/* Admins Data Table */}
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
                  <>
                    <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
                      <Table sx={{ minWidth: 650 }} aria-label="admin table">
                        <TableHead>
                          <TableRow sx={{ backgroundColor: 'background.default' }}>
                            <TableCell sx={{ fontWeight: 600 }}>
                              <TableSortLabel
                                active={orderBy === 'name'}
                                direction={orderBy === 'name' ? order : 'asc'}
                                onClick={() => handleRequestSort('name')}
                              >
                                Admin Name
                              </TableSortLabel>
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>
                              <TableSortLabel
                                active={orderBy === 'email'}
                                direction={orderBy === 'email' ? order : 'asc'}
                                onClick={() => handleRequestSort('email')}
                              >
                                Email
                              </TableSortLabel>
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>
                              <TableSortLabel
                                active={orderBy === 'role'}
                                direction={orderBy === 'role' ? order : 'asc'}
                                onClick={() => handleRequestSort('role')}
                              >
                                Role
                              </TableSortLabel>
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>
                              <TableSortLabel
                                active={orderBy === 'status'}
                                direction={orderBy === 'status' ? order : 'asc'}
                                onClick={() => handleRequestSort('status')}
                              >
                                Status
                              </TableSortLabel>
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>
                              <TableSortLabel
                                active={orderBy === 'joinedDate'}
                                direction={orderBy === 'joinedDate' ? order : 'asc'}
                                onClick={() => handleRequestSort('joinedDate')}
                              >
                                Joined Date
                              </TableSortLabel>
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600, textAlign: 'center' }}>
                              Actions
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {paginatedAdmins.map((admin) => (
                            <TableRow
                              key={admin._id}
                              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                  <Avatar sx={{ bgcolor: getRoleColor(admin.role), width: 32, height: 32 }}>
                                    {admin.name.charAt(0)}
                                  </Avatar>
                                  <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                      {admin.name}
                                    </Typography>
                                    {admin.phone && (
                                      <Typography variant="caption" color="text.secondary">
                                        {admin.phone}
                                      </Typography>
                                    )}
                                  </Box>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">
                                  {admin.email}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Chip 
                                  label={admin.role} 
                                  size="small" 
                                  color={getRoleColor(admin.role)}
                                  sx={{ textTransform: 'capitalize' }}
                                />
                              </TableCell>
                              <TableCell>
                                <Chip 
                                  label={admin.status} 
                                  size="small" 
                                  color={getStatusColor(admin.status)}
                                  sx={{ textTransform: 'capitalize' }}
                                />
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">
                                  {admin.joinedDate}
                                </Typography>
                                {admin.lastLogin && (
                                  <Typography variant="caption" color="text.secondary" display="block">
                                    Last: {admin.lastLogin}
                                  </Typography>
                                )}
                              </TableCell>
                                                             <TableCell align="center">
                                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                  <Tooltip title="Edit admin">
                                    <IconButton
                                      onClick={() => handleEditAdminClick(admin)}
                                      size="small"
                                      sx={{ color: '#4285f4' }}
                                    >
                                      <EditIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Delete admin">
                                    <IconButton
                                      onClick={() => handleDeleteAdminClick(admin)}
                                      size="small"
                                      sx={{ color: '#ea4335' }}
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    
                    {/* Pagination */}
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25]}
                      component="div"
                      count={admins.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      sx={{ mt: 2 }}
                    />
                  </>
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
                          onChange={(e) => handlePermissionChange(key, e.target.checked)}
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
                          onChange={(e) => handlePermissionChange(key, e.target.checked)}
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
