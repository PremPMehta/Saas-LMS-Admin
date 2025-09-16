import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Box,
  Typography,
  TablePagination,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Assignment as AssignmentIcon,
  Star as StarIcon,
  LocalFireDepartment as PopularIcon,
} from '@mui/icons-material';
import { useTheme } from '../../contexts/ThemeContext';

const PlansTable = ({ 
  plans, 
  onPlanUpdate, 
  onPlanDelete, 
  defaultRowsPerPage = 10 
}) => {
  const { mode } = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [isDeleting, setIsDeleting] = useState(null);

  // Filter and sort plans
  const filteredPlans = plans
    .filter(plan => {
      const matchesSearch = 
        plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.price.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.period.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || plan.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      // Handle price sorting (remove $ and convert to number)
      if (sortBy === 'price') {
        aValue = parseFloat(aValue.replace('$', ''));
        bValue = parseFloat(bValue.replace('$', ''));
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const paginatedPlans = filteredPlans.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handleDelete = async (planId) => {
    if (window.confirm('Are you sure you want to delete this plan? This action cannot be undone.')) {
      setIsDeleting(planId);
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? 'https://saas-lms-admin-1.onrender.com' : 'http://localhost:5001')}/api/plans/${planId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          onPlanDelete(planId);
        } else {
          console.error('Failed to delete plan');
        }
      } catch (error) {
        console.error('Error deleting plan:', error);
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Inactive':
        return 'error';
      case 'Onhold':
        return 'warning';
      default:
        return 'default';
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

  if (!plans || plans.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <AssignmentIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500, mb: 1 }}>
          No plans found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Create subscription plans to get started
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Search and Filter Controls */}
      <Box sx={{ p: 3, pb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="Search plans..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 250 }}
          />
          
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
              <MenuItem value="Onhold">Onhold</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: mode === 'light' ? 'rgba(25, 118, 210, 0.08)' : 'rgba(25, 118, 210, 0.16)' }}>
              <TableCell 
                sx={{ 
                  fontWeight: 700, 
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.12)' }
                }}
                onClick={() => handleSort('name')}
              >
                Plan Name
                {sortBy === 'name' && (
                  <Typography component="span" sx={{ ml: 1, fontSize: '0.75rem' }}>
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </Typography>
                )}
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: 700, 
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.12)' }
                }}
                onClick={() => handleSort('price')}
              >
                Price
                {sortBy === 'price' && (
                  <Typography component="span" sx={{ ml: 1, fontSize: '0.75rem' }}>
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </Typography>
                )}
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Period</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Features</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Limits</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Max Academies</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Max Students/Academy</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Max Educators/Academy</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Popular</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedPlans.map((plan) => (
              <TableRow
                key={plan._id || plan.id}
                sx={{
                  '&:hover': {
                    backgroundColor: mode === 'light' ? 'rgba(25, 118, 210, 0.04)' : 'rgba(25, 118, 210, 0.08)',
                  },
                }}
              >
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getPlanIcon(plan.name)}
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {plan.name}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                    {plan.price}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    per {plan.period}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {plan.features?.slice(0, 2).map((feature, index) => (
                      <Typography key={index} variant="body2" sx={{ fontSize: '0.75rem' }}>
                        • {feature}
                      </Typography>
                    ))}
                    {plan.features?.length > 2 && (
                      <Typography variant="body2" sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                        +{plan.features.length - 2} more
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={plan.limits}
                    size="small"
                    variant="outlined"
                    sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                    {plan.maxAcademies || 'N/A'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'secondary.main' }}>
                    {plan.maxStudentsPerAcademy || 'N/A'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                    {plan.maxEducatorsPerAcademy || 'N/A'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={plan.status}
                    size="small"
                    color={getStatusColor(plan.status)}
                    sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                  />
                </TableCell>
                <TableCell>
                  {plan.popular ? (
                    <Chip
                      icon={<PopularIcon />}
                      label="Popular"
                      size="small"
                      color="primary"
                      sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                    />
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                      -
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Edit Plan">
                      <IconButton
                        size="small"
                        onClick={() => onPlanUpdate(plan)}
                        sx={{ color: 'primary.main' }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Plan">
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(plan._id || plan.id)}
                        disabled={isDeleting === (plan._id || plan.id)}
                        sx={{ color: 'error.main' }}
                      >
                        {isDeleting === (plan._id || plan.id) ? (
                          <CircularProgress size={16} />
                        ) : (
                          <DeleteIcon fontSize="small" />
                        )}
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
        count={filteredPlans.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
        labelRowsPerPage="Rows per page:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
      />
    </Box>
  );
};

export default PlansTable; 