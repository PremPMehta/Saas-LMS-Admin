import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  AdminPanelSettings as AdminIcon,
  Person as UserIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  Warning as WarningIcon,
  Person as PersonIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { useTheme } from '../../contexts/ThemeContext';

const UsersList = ({ users, onUserUpdate, onUserDelete, defaultRowsPerPage = 10 }) => {
  const { mode } = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0); // Reset to first page when searching
  };

  // Action handlers
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setViewDialogOpen(true);
  };

  const handleEditUser = (user) => {
    if (onUserUpdate) {
      onUserUpdate(user);
    }
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
    setDeleteConfirmation('');
    setDeleteError('');
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirmation !== 'DELETE') {
      setDeleteError('Please type DELETE exactly as shown to confirm deletion.');
      return;
    }

    setIsDeleting(true);
    setDeleteError('');

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication token not found. Please login again.');
      }

      const response = await fetch(`http://localhost:5001/api/users/${selectedUser._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete user');
      }

      // Call the parent callback to refresh the list
      if (onUserDelete) {
        onUserDelete(selectedUser._id);
      }

      setDeleteDialogOpen(false);
      setSelectedUser(null);
      setDeleteConfirmation('');
    } catch (error) {
      console.error('Error deleting user:', error);
      setDeleteError(error.message || 'Failed to delete user. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    setSelectedUser(null);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedUser(null);
    setDeleteConfirmation('');
    setDeleteError('');
  };

  // Filter users based on search query
  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.status?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Paginate users
  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Helper functions
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return <ActiveIcon />;
      case 'inactive':
        return <InactiveIcon />;
      case 'pending':
        return <WarningIcon />;
      default:
        return null;
    }
  };

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'primary';
      case 'user':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getRoleIcon = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return <AdminIcon />;
      case 'user':
        return <UserIcon />;
      default:
        return <UserIcon />;
    }
  };

  const getUserInitials = (email) => {
    if (!email) return 'U';
    const parts = email.split('@')[0];
    return parts
      .split(/[._-]/)
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Box>
      {/* Search Bar */}
      <Box sx={{ mb: 3, p: 3, pb: 0 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search users by email, role, or status..."
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              backgroundColor: (theme) => theme.palette.mode === 'light' 
                ? 'rgba(255, 255, 255, 0.9)'
                : 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(10px)',
              border: (theme) => `2px solid ${theme.palette.mode === 'light' ? 'rgba(25, 118, 210, 0.15)' : 'rgba(25, 118, 210, 0.2)'}`,
              '&:hover': {
                borderColor: 'primary.main',
                backgroundColor: (theme) => theme.palette.mode === 'light'
                  ? 'rgba(255, 255, 255, 0.95)'
                  : 'rgba(255, 255, 255, 0.12)',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.15)',
              },
              '&.Mui-focused': {
                borderColor: 'primary.main',
                backgroundColor: (theme) => theme.palette.mode === 'light'
                  ? 'rgba(255, 255, 255, 1)'
                  : 'rgba(255, 255, 255, 0.15)',
                boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.2)',
                transform: 'translateY(-1px)',
              },
            },
            '& .MuiInputBase-input': {
              fontSize: '0.95rem',
              fontWeight: 500,
              padding: '16px 20px',
            },
          }}
        />
      </Box>

      <TableContainer 
        component={Paper} 
        sx={{ 
          boxShadow: (theme) => theme.palette.mode === 'light'
            ? '0 8px 32px rgba(0, 0, 0, 0.08)'
            : '0 8px 32px rgba(0, 0, 0, 0.3)',
          background: (theme) => theme.palette.mode === 'light'
            ? 'rgba(255, 255, 255, 0.95)'
            : 'rgba(255, 255, 255, 0.05)',
          borderRadius: 3,
          overflow: 'hidden',
          border: (theme) => `1px solid ${theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.08)'}`,
        }}
      >
        <Table sx={{ minWidth: 300 }}>
          <TableHead>
            <TableRow sx={{ 
              background: (theme) => theme.palette.mode === 'light' 
                ? 'linear-gradient(135deg, rgba(25, 118, 210, 0.08) 0%, rgba(25, 118, 210, 0.04) 100%)'
                : 'linear-gradient(135deg, rgba(25, 118, 210, 0.15) 0%, rgba(25, 118, 210, 0.08) 100%)',
              borderBottom: (theme) => `2px solid ${theme.palette.mode === 'light' ? 'rgba(25, 118, 210, 0.1)' : 'rgba(25, 118, 210, 0.2)'}`,
            }}>
              <TableCell sx={{ 
                fontWeight: 800, 
                fontSize: '0.9rem', 
                color: 'primary.main', 
                py: 3,
                px: 3,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                User
              </TableCell>
              <TableCell sx={{ 
                fontWeight: 800, 
                fontSize: '0.9rem', 
                color: 'primary.main', 
                py: 3,
                px: 3,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                Email
              </TableCell>
              <TableCell sx={{ 
                fontWeight: 800, 
                fontSize: '0.9rem', 
                color: 'primary.main', 
                py: 3,
                px: 3,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                Role
              </TableCell>
              <TableCell sx={{ 
                fontWeight: 800, 
                fontSize: '0.9rem', 
                color: 'primary.main', 
                py: 3,
                px: 3,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                Status
              </TableCell>
              <TableCell sx={{ 
                fontWeight: 800, 
                fontSize: '0.9rem', 
                color: 'primary.main', 
                py: 3,
                px: 3,
                textAlign: 'center',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.map((user, index) => (
              <TableRow
                key={user.id || user._id || index}
                sx={{
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    backgroundColor: (theme) => theme.palette.mode === 'light'
                      ? 'rgba(25, 118, 210, 0.06)'
                      : 'rgba(25, 118, 210, 0.12)',
                    transform: 'translateX(8px) scale(1.01)',
                    boxShadow: (theme) => theme.palette.mode === 'light'
                      ? '0 8px 24px rgba(0, 0, 0, 0.12)'
                      : '0 8px 24px rgba(0, 0, 0, 0.4)',
                    '& .user-avatar': {
                      transform: 'scale(1.15) rotate(5deg)',
                      boxShadow: '0 8px 24px rgba(25, 118, 210, 0.3)',
                    },
                    '& .action-buttons': {
                      opacity: 1,
                      transform: 'translateX(0)',
                    },
                  },
                  cursor: 'pointer',
                  borderBottom: (theme) => `1px solid ${theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.04)'}`,
                  '&:last-child': {
                    borderBottom: 'none',
                  },
                }}
              >
                <TableCell sx={{ py: 3, px: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Avatar
                      className="user-avatar"
                      sx={{
                        bgcolor: 'primary.main',
                        width: 56,
                        height: 56,
                        fontSize: '1.2rem',
                        fontWeight: 700,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: '0 4px 16px rgba(25, 118, 210, 0.25)',
                        border: '3px solid',
                        borderColor: (theme) => theme.palette.mode === 'light' 
                          ? 'rgba(255, 255, 255, 0.9)' 
                          : 'rgba(255, 255, 255, 0.15)',
                      }}
                    >
                      {getUserInitials(user.email)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
                        {user.email ? user.email.split('@')[0] : 'Unknown User'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonIcon sx={{ fontSize: 16 }} />
                        Created {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        }) : 'Unknown date'}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell sx={{ py: 3, px: 3 }}>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmailIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                    {user.email || 'N/A'}
                  </Typography>
                </TableCell>
                <TableCell sx={{ py: 3, px: 3 }}>
                  <Chip
                    icon={getRoleIcon(user.role)}
                    label={user.role || 'N/A'}
                    size="medium"
                    color={getRoleColor(user.role)}
                    variant="filled"
                    sx={{ 
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      height: 32,
                      px: 2,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    }}
                  />
                </TableCell>
                <TableCell sx={{ py: 3, px: 3 }}>
                  <Chip
                    icon={getStatusIcon(user.status)}
                    label={user.status || 'Unknown'}
                    size="medium"
                    color={getStatusColor(user.status)}
                    variant="filled"
                    sx={{ 
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      height: 32,
                      px: 2,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    }}
                  />
                </TableCell>
                <TableCell sx={{ py: 3, px: 3, textAlign: 'center' }}>
                  <Box 
                    className="action-buttons"
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      gap: 1,
                      opacity: 0.7,
                      transform: 'translateX(10px)',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <Tooltip title="View User Details" arrow placement="top">
                      <IconButton
                        size="medium"
                        onClick={() => handleViewUser(user)}
                        sx={{
                          color: 'primary.main',
                          backgroundColor: 'rgba(25, 118, 210, 0.1)',
                          '&:hover': {
                            backgroundColor: 'rgba(25, 118, 210, 0.2)',
                            transform: 'scale(1.1)',
                            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                          },
                        }}
                      >
                        <ViewIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit User" arrow placement="top">
                      <IconButton
                        size="medium"
                        onClick={() => handleEditUser(user)}
                        sx={{
                          color: 'secondary.main',
                          backgroundColor: 'rgba(156, 39, 176, 0.1)',
                          '&:hover': {
                            backgroundColor: 'rgba(156, 39, 176, 0.2)',
                            transform: 'scale(1.1)',
                            boxShadow: '0 4px 12px rgba(156, 39, 176, 0.3)',
                          },
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete User" arrow placement="top">
                      <IconButton
                        size="medium"
                        onClick={() => handleDeleteClick(user)}
                        sx={{
                          color: 'error.main',
                          backgroundColor: 'rgba(211, 47, 47, 0.1)',
                          '&:hover': {
                            backgroundColor: 'rgba(211, 47, 47, 0.2)',
                            transform: 'scale(1.1)',
                            boxShadow: '0 4px 12px rgba(211, 47, 47, 0.3)',
                          },
                        }}
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
        component="div"
        count={filteredUsers.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
        sx={{
          '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
            color: 'text.secondary',
            fontWeight: 600,
            fontSize: '0.9rem',
          },
          '.MuiTablePagination-select': {
            color: 'primary.main',
            fontWeight: 700,
            fontSize: '0.9rem',
          },
          '.MuiIconButton-root': {
            color: 'primary.main',
            '&:hover': {
              backgroundColor: 'rgba(25, 118, 210, 0.1)',
              transform: 'scale(1.1)',
            },
            '&.Mui-disabled': {
              color: 'text.disabled',
            },
          },
        }}
      />

      {/* View User Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={handleCloseViewDialog}
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: (theme) => theme.palette.mode === 'light'
              ? 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
              : 'linear-gradient(135deg, #1a1a1a 0%, #2d3748 100%)',
            width: '100%',
            maxWidth: 450,
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
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <UserIcon />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              User Details
            </Typography>
          </Box>
          <IconButton onClick={handleCloseViewDialog} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {selectedUser && (
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 0,
                background: 'transparent',
                width: '100%',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, justifyContent: 'center' }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: 'primary.main',
                    fontSize: '2rem',
                    fontWeight: 600,
                    mr: 2,
                    border: '3px solid white',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  }}
                >
                  {getUserInitials(selectedUser.email)}
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {selectedUser.email ? selectedUser.email.split('@')[0] : 'Unknown User'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    {selectedUser.email || 'No email provided'}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, textAlign: 'center' }}>
                  User Information
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, textAlign: 'center' }}>
                  <strong>Email:</strong> {selectedUser.email || 'N/A'}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, textAlign: 'center' }}>
                  <strong>Role:</strong> {selectedUser.role || 'N/A'}
                </Typography>
                <Typography variant="body2" sx={{ textAlign: 'center' }}>
                  <strong>Status:</strong> {selectedUser.status || 'N/A'}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Chip
                  icon={getRoleIcon(selectedUser.role)}
                  label={selectedUser.role || 'N/A'}
                  color={getRoleColor(selectedUser.role)}
                  variant="filled"
                  sx={{ fontWeight: 600 }}
                />
                <Chip
                  icon={getStatusIcon(selectedUser.status)}
                  label={selectedUser.status || 'Unknown'}
                  color={getStatusColor(selectedUser.status)}
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
              </Box>
            </Paper>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={handleCloseViewDialog} variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: (theme) => theme.palette.mode === 'light'
              ? 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
              : 'linear-gradient(135deg, #1a1a1a 0%, #2d3748 100%)',
          }
        }}
      >
        <DialogTitle sx={{
          background: 'linear-gradient(135deg, #d32f2f 0%, #f44336 100%)',
          color: 'white',
          borderRadius: '12px 12px 0 0',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}>
          <WarningIcon />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Delete User
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
              This action cannot be undone!
            </Typography>
            <Typography variant="body2">
              You are about to permanently delete <strong>{selectedUser?.email || 'this user'}</strong> and all their associated data.
            </Typography>
          </Alert>
          
          <Typography variant="body1" sx={{ mb: 2 }}>
            To confirm deletion, please type <strong>DELETE</strong> exactly as shown:
          </Typography>
          
          <TextField
            fullWidth
            value={deleteConfirmation}
            onChange={(e) => setDeleteConfirmation(e.target.value)}
            placeholder="Type DELETE to confirm"
            variant="outlined"
            error={deleteError !== ''}
            helperText={deleteError}
            sx={{ mb: 2 }}
          />
          
          <Typography variant="body2" color="text.secondary">
            This user will be permanently removed from the system.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={handleCloseDeleteDialog} 
            variant="outlined"
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            disabled={deleteConfirmation !== 'DELETE' || isDeleting}
            startIcon={isDeleting ? <CircularProgress size={20} color="inherit" /> : <DeleteIcon />}
          >
            {isDeleting ? 'Deleting...' : 'Delete User'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersList; 