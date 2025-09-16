import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Container,
  CircularProgress,
  Fade,
  Grow,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Pagination,
  InputAdornment,
  Tooltip,
} from '@mui/material';
import {
  People as PeopleIcon,
  AdminPanelSettings as AdminIcon,
  Person as PersonIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Block as BlockIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  HourglassEmpty as HourglassIcon,
} from '@mui/icons-material';
import { useTheme } from '../contexts/ThemeContext';
import FocusedSidebar from '../components/FocusedSidebar';
import FocusedTopBar from '../components/FocusedTopBar';
import '../App.css';
import axios from 'axios';
import useDocumentTitle from '../contexts/useDocumentTitle';

const CommunityUsers = () => {
  useDocumentTitle('Community Users - Bell & Desk');
  const { mode } = useTheme();
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionDialog, setActionDialog] = useState({
    open: false,
    type: '', // 'approve', 'reject', 'deactivate'
    title: '',
    content: '',
  });
  const [rejectionReason, setRejectionReason] = useState('');
  const [deactivationReason, setDeactivationReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Fetch users from backend
  const fetchUsers = async (page = 1, status = null, search = '') => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('communityToken');
      if (!token) {
        console.error('No community authentication token found');
        return;
      }

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
      });

      if (status) {
        params.append('status', status);
      }

      if (search) {
        params.append('search', search);
      }

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'https://saas-lms-admin-1.onrender.com'}/api/community-user/admin/users?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setUsers(response.data.data.users);
        setPagination(response.data.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setMessage({ type: 'error', text: 'Failed to fetch users' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1, tabValue === 0 ? null : 'pending', searchTerm);
  }, [tabValue, searchTerm]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setSearchTerm('');
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (event, page) => {
    fetchUsers(page, tabValue === 0 ? null : 'pending', searchTerm);
  };

  const handleAction = (user, action) => {
    setSelectedUser(user);
    setActionDialog({
      open: true,
      type: action,
      title: action === 'approve' ? 'Approve User' : action === 'reject' ? 'Reject User' : 'Deactivate User',
      content: action === 'approve'
        ? `Are you sure you want to approve ${user.firstName} ${user.lastName}?`
        : action === 'reject'
          ? `Are you sure you want to reject ${user.firstName} ${user.lastName}?`
          : `Are you sure you want to deactivate ${user.firstName} ${user.lastName}?`,
    });
  };

  const handleConfirmAction = async () => {
    if (!selectedUser) return;

    setActionLoading(true);
    try {
      const token = localStorage.getItem('communityToken');
      let response;

      switch (actionDialog.type) {
        case 'approve':
          response = await axios.put(
            `${process.env.REACT_APP_API_URL || 'https://saas-lms-admin-1.onrender.com'}/api/community-user/admin/approve/${selectedUser._id}`,
            {},
            { headers: { 'Authorization': `Bearer ${token}` } }
          );
          break;
        case 'reject':
          response = await axios.put(
            `${process.env.REACT_APP_API_URL || 'https://saas-lms-admin-1.onrender.com'}/api/community-user/admin/reject/${selectedUser._id}`,
            { rejectionReason },
            { headers: { 'Authorization': `Bearer ${token}` } }
          );
          break;
        case 'deactivate':
          response = await axios.put(
            `${process.env.REACT_APP_API_URL || 'https://saas-lms-admin-1.onrender.com'}/api/community-user/admin/deactivate/${selectedUser._id}`,
            { deactivationReason },
            { headers: { 'Authorization': `Bearer ${token}` } }
          );
          break;
        default:
          throw new Error('Invalid action type');
      }

      if (response.data.success) {
        setMessage({ type: 'success', text: response.data.message });
        fetchUsers(pagination.currentPage, tabValue === 0 ? null : 'pending', searchTerm);
        setActionDialog({ open: false, type: '', title: '', content: '' });
        setRejectionReason('');
        setDeactivationReason('');
      }
    } catch (error) {
      console.error('Error performing action:', error);
      setMessage({ type: 'error', text: error.response?.data?.message || 'Action failed' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setActionDialog({ open: false, type: '', title: '', content: '' });
    setRejectionReason('');
    setDeactivationReason('');
  };

  const getStatusChip = (user) => {
    if (user.isDeactivated) {
      return <Chip label="Deactivated" color="error" size="small" />;
    }
    if (user.approvalStatus === 'approved') {
      return <Chip label="Approved" color="success" size="small" />;
    }
    if (user.approvalStatus === 'rejected') {
      return <Chip label="Rejected" color="error" size="small" />;
    }
    return <Chip label="Pending" color="warning" size="small" />;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box className="bg-black">
      {/* Common Focused Sidebar */}
      <FocusedSidebar darkMode={darkMode} />

      {/* Main Content Area */}
      <Box sx={{
        flex: 1,
        ml: (localStorage.getItem('sidebarCollapsed') !== 'false') ? 7.5 : 30, // default collapsed
        mt: 9, // Account for fixed top bar (70px height) + padding
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Common Focused Top Bar */}
        <FocusedTopBar darkMode={darkMode} setDarkMode={setDarkMode} />

        {/* Main Content */}
        <Box sx={{ flex: 1, px: 1, py: 4 }}>
          <Container maxWidth="xl">
            {/* Page Header */}
            {/* <Fade in timeout={800}>
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="h3"
                  component="h1"
                  sx={{
                    fontWeight: 800,
                    color: 'text.primary',
                    mb: 1,
                    textAlign: { xs: 'center', md: 'left' },
                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                    textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  }}
                >
                  Community Users
                </Typography>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{
                    fontWeight: 500,
                    textAlign: { xs: 'center', md: 'left' },
                    mb: 3,
                  }}
                >
                  Manage community users and approvals
                </Typography>
              </Box>
            </Fade> */}

            {/* Message Alert */}
            {message.text && (
              <Alert
                severity={message.type}
                sx={{ mb: 3 }}
                onClose={() => setMessage({ type: '', text: '' })}
              >
                {message.text}
              </Alert>
            )}

            {/* Tabs */}
            <Grow in timeout={1000}>
              <Paper
                sx={{
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  overflow: 'hidden',
                  mb: 4,
                }}
              >
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  sx={{
                    borderBottom: 1,
                    borderColor: 'divider',
                    '& .MuiTab-root': {
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '1.1rem',
                    },
                  }}
                >
                  <Tab
                    icon={<PeopleIcon />}
                    label="All Users"
                    iconPosition="start"
                  />
                  <Tab
                    icon={<AdminIcon />}
                    label="Approval Pending Users"
                    iconPosition="start"
                  />
                </Tabs>

                {/* Search Bar */}
                <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
                  <TextField
                    fullWidth
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ maxWidth: 400 }}
                  />
                </Box>

                {/* Users Table */}
                <Box sx={{ overflow: "auto" }}>
                  <Box sx={{ width: "100%", display: "table", tableLayout: "fixed" }}>
                    <TableContainer component={Paper} sx={{ boxShadow: 'none', overflowX: 'auto' }}>
                      <Table sx={{ minWidth: 650 }} aria-label="users table">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ minWidth: 200 }}>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell sx={{ minWidth: 200 }}>Community</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell sx={{ minWidth: 200 }}>Created</TableCell>
                            <TableCell>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {users.length > 0 ? (
                            users.map((user) => (
                              <TableRow key={user._id} hover>
                                <TableCell>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                    {user.firstName} {user.lastName}
                                  </Box>
                                </TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.communityId?.name || 'N/A'}</TableCell>
                                <TableCell>{getStatusChip(user)}</TableCell>
                                <TableCell>{formatDate(user.createdAt)}</TableCell>
                                <TableCell>
                                  <Box sx={{ display: 'flex', gap: 1 }}>
                                    {user.approvalStatus === 'pending' && (
                                      <>
                                        <Tooltip title="Approve">
                                          <IconButton
                                            color="success"
                                            onClick={() => handleAction(user, 'approve')}
                                            size="small"
                                          >
                                            <CheckIcon />
                                          </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Reject">
                                          <IconButton
                                            color="error"
                                            onClick={() => handleAction(user, 'reject')}
                                            size="small"
                                          >
                                            <CancelIcon />
                                          </IconButton>
                                        </Tooltip>
                                      </>
                                    )}
                                    {user.approvalStatus === 'approved' && !user.isDeactivated && (
                                      <Tooltip title="Deactivate">
                                        <IconButton
                                          color="warning"
                                          onClick={() => handleAction(user, 'deactivate')}
                                          size="small"
                                        >
                                          <BlockIcon />
                                        </IconButton>
                                      </Tooltip>
                                    )}
                                  </Box>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={6} sx={{ textAlign: 'center', py: 8 }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                  {tabValue === 1 ? (
                                    <>
                                      <HourglassIcon sx={{ fontSize: 64, color: 'text.secondary', opacity: 0.5 }} />
                                      <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                                        No Pending Approvals
                                      </Typography>
                                      <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 400, textAlign: 'center' }}>
                                        All user registrations have been reviewed. New approval requests will appear here.
                                      </Typography>
                                    </>
                                  ) : (
                                    <>
                                      <PeopleIcon sx={{ fontSize: 64, color: 'text.secondary', opacity: 0.5 }} />
                                      <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                                        No Users Found
                                      </Typography>
                                      <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 400, textAlign: 'center' }}>
                                        {searchTerm ? 'No users match your search criteria. Try adjusting your search terms.' : 'No users have registered yet.'}
                                      </Typography>
                                    </>
                                  )}
                                </Box>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    </Box>
                  </Box>

                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                      <Pagination
                        count={pagination.totalPages}
                        page={pagination.currentPage}
                        onChange={handlePageChange}
                        color="primary"
                        size="large"
                      />
                    </Box>
                  )}
              </Paper>
            </Grow>

            {/* Action Confirmation Dialog */}
            <Dialog open={actionDialog.open} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
              <DialogTitle>{actionDialog.title}</DialogTitle>
              <DialogContent>
                <Typography sx={{ mb: 2 }}>{actionDialog.content}</Typography>
                {actionDialog.type === 'reject' && (
                  <TextField
                    fullWidth
                    label="Rejection Reason"
                    multiline
                    rows={3}
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    sx={{ mt: 2 }}
                  />
                )}
                {actionDialog.type === 'deactivate' && (
                  <TextField
                    fullWidth
                    label="Deactivation Reason"
                    multiline
                    rows={3}
                    value={deactivationReason}
                    onChange={(e) => setDeactivationReason(e.target.value)}
                    sx={{ mt: 2 }}
                  />
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>Cancel</Button>
                <Button
                  onClick={handleConfirmAction}
                  variant="contained"
                  color={actionDialog.type === 'approve' ? 'success' : actionDialog.type === 'reject' ? 'error' : 'warning'}
                  disabled={actionLoading}
                >
                  {actionLoading ? <CircularProgress size={20} /> : 'Confirm'}
                </Button>
              </DialogActions>
            </Dialog>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default CommunityUsers;
