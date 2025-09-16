import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Box,
  Typography,
  Link,
  Avatar,
  Tooltip,
  TablePagination,
  TextField,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  Divider,
  Grid,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import {
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  School as SchoolIcon,
  People as PeopleIcon,
  Book as BookIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
  Close as CloseIcon,
  Preview as PreviewIcon,
  Language as LanguageIcon,
} from '@mui/icons-material';

const AcademiesList = ({ academies, onAcademyUpdate, onAcademyDelete, defaultRowsPerPage = 5 }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAcademy, setSelectedAcademy] = useState(null);
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
  const handleViewAcademy = (academy) => {
    setSelectedAcademy(academy);
    setViewDialogOpen(true);
  };

  const handleEditAcademy = (academy) => {
    if (onAcademyUpdate) {
      onAcademyUpdate(academy);
    }
  };

  const handleDeleteClick = (academy) => {
    setSelectedAcademy(academy);
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

      const response = await fetch(`${process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? 'https://saas-lms-admin-1.onrender.com' : 'http://localhost:5001')}/api/academies/${selectedAcademy._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete academy');
      }

      // Call the parent callback to refresh the list
      if (onAcademyDelete) {
        onAcademyDelete(selectedAcademy._id);
      }

      setDeleteDialogOpen(false);
      setSelectedAcademy(null);
      setDeleteConfirmation('');
    } catch (error) {
      console.error('Error deleting academy:', error);
      setDeleteError(error.message || 'Failed to delete academy. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    setSelectedAcademy(null);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedAcademy(null);
    setDeleteConfirmation('');
    setDeleteError('');
  };

  // Filter academies based on search query
  const filteredAcademies = academies.filter(academy =>
    (academy.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (academy.subdomain || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (academy.subscriptionPlan || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (academy.status || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status) => {
    if (!status) return 'default';
    switch (status.toLowerCase()) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      case 'onhold':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    if (!status) return null;
    switch (status.toLowerCase()) {
      case 'active':
        return <ActiveIcon fontSize="small" />;
      case 'inactive':
        return <InactiveIcon fontSize="small" />;
      case 'onhold':
        return <WarningIcon fontSize="small" />;
      default:
        return null;
    }
  };

  const getPlanColor = (plan) => {
    if (!plan) return 'default';
    switch (plan.toLowerCase()) {
      case 'premium':
        return 'primary';
      case 'standard':
        return 'secondary';
      case 'basic':
        return 'default';
      default:
        return 'default';
    }
  };

  const getAcademyInitials = (name) => {
    if (!name) return 'AC';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!academies || academies.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <SchoolIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
          No academies found
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Create your first academy to get started
        </Typography>
      </Box>
    );
  }

  // Calculate pagination
  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedAcademies = filteredAcademies.slice(startIndex, endIndex);

  return (
    <Box sx={{ p: 3 }}>
      {/* Search Bar */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search academies by name, subdomain, plan, or status..."
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
                Academy
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
                Subdomain
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
                Plan
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
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                Stats
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
            {paginatedAcademies.map((academy, index) => (
              <TableRow
                key={academy.id}
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
                    '& .academy-avatar': {
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
                      src={academy.logo}
                      className="academy-avatar"
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
                      {getAcademyInitials(academy.name)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
                        {academy.name || 'Unnamed Academy'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SchoolIcon sx={{ fontSize: 16 }} />
                        Created {academy.createdAt ? new Date(academy.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        }) : 'Unknown date'}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell sx={{ py: 3, px: 3 }}>
                  <Link
                    href={`https://${academy.subdomain || 'example'}.bbrtek-lms.com`}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      textDecoration: 'none',
                      color: 'primary.main',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        color: 'primary.dark',
                        textDecoration: 'underline',
                        transform: 'translateX(4px)',
                      },
                    }}
                  >
                    <LanguageIcon sx={{ fontSize: 18 }} />
                    {academy.subdomain || 'N/A'}
                  </Link>
                </TableCell>
                <TableCell sx={{ py: 3, px: 3 }}>
                  <Chip
                    label={academy.subscriptionPlan || 'N/A'}
                    size="medium"
                    color={getPlanColor(academy.subscriptionPlan)}
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
                    icon={getStatusIcon(academy.status)}
                    label={academy.status || 'Unknown'}
                    size="medium"
                    color={getStatusColor(academy.status)}
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
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Tooltip title={`${academy.students} students`} arrow placement="top">
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1,
                        p: 1,
                        borderRadius: 2,
                        backgroundColor: 'rgba(25, 118, 210, 0.08)',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: 'rgba(25, 118, 210, 0.12)',
                          transform: 'scale(1.05)',
                        },
                      }}>
                        <PeopleIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                        <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                          {academy.students?.toLocaleString() || '0'}
                        </Typography>
                      </Box>
                    </Tooltip>
                    <Tooltip title={`${academy.courses} courses`} arrow placement="top">
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1,
                        p: 1,
                        borderRadius: 2,
                        backgroundColor: 'rgba(156, 39, 176, 0.08)',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: 'rgba(156, 39, 176, 0.12)',
                          transform: 'scale(1.05)',
                        },
                      }}>
                        <BookIcon sx={{ fontSize: 18, color: 'secondary.main' }} />
                        <Typography variant="body2" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                          {academy.courses || '0'}
                        </Typography>
                      </Box>
                    </Tooltip>
                  </Box>
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
                    <Tooltip title="View Academy Details" arrow placement="top">
                      <IconButton
                        size="medium"
                        onClick={() => handleViewAcademy(academy)}
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
                    <Tooltip title="Edit Academy" arrow placement="top">
                      <IconButton
                        size="medium"
                        onClick={() => handleEditAcademy(academy)}
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
                    <Tooltip title="Delete Academy" arrow placement="top">
                      <IconButton
                        size="medium"
                        onClick={() => handleDeleteClick(academy)}
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
        count={filteredAcademies.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
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

      {/* View Academy Dialog */}
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
            <SchoolIcon />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Academy Details
            </Typography>
          </Box>
          <IconButton onClick={handleCloseViewDialog} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {selectedAcademy && (
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 0,
                background: 'transparent',
                width: '100%',
              }}
            >
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1, textAlign: 'center', justifyContent: 'center' }}>
                  <PreviewIcon />
                  Preview Card
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, justifyContent: 'center' }}>
                  <Avatar
                    src={selectedAcademy.logo}
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
                    {getAcademyInitials(selectedAcademy.name)}
                  </Avatar>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                      {selectedAcademy.name || 'Academy Name'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                      {selectedAcademy.subdomain ? `${selectedAcademy.subdomain}.bbrtek-lms.com` : 'your-subdomain.bbrtek-lms.com'}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, textAlign: 'center' }}>
                    Contact Information
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, textAlign: 'center' }}>
                    <strong>Contact:</strong> {selectedAcademy.contactName || 'Contact Name'}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, textAlign: 'center' }}>
                    <strong>Phone:</strong> {selectedAcademy.contactNumber || 'Contact Number'}
                  </Typography>
                  <Typography variant="body2" sx={{ textAlign: 'center' }}>
                    <strong>Address:</strong> {selectedAcademy.address || 'Academy Address'}
                  </Typography>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip
                    label={selectedAcademy.subscriptionPlan || 'N/A'}
                    color={getPlanColor(selectedAcademy.subscriptionPlan)}
                    variant="filled"
                    sx={{ fontWeight: 600 }}
                  />
                  <Chip
                    label={selectedAcademy.status || 'Unknown'}
                    color={getStatusColor(selectedAcademy.status)}
                    icon={getStatusIcon(selectedAcademy.status)}
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                                 </Box>
               </Paper>
           )}
         </DialogContent>
        <DialogActions sx={{ p: 3}}>
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
            Delete Academy
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 4 , mt: 4 }}>
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
              This action cannot be undone!
            </Typography>
            <Typography variant="body2">
              You are about to permanently delete <strong>{selectedAcademy?.name || 'this academy'}</strong> and all its associated data.
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
            This academy will be permanently removed from the system.
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
            {isDeleting ? 'Deleting...' : 'Delete Academy'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AcademiesList; 