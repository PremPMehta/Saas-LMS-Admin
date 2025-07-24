import React from 'react';
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
} from '@mui/material';
import {
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  School as SchoolIcon,
  People as PeopleIcon,
  Book as BookIcon,
} from '@mui/icons-material';

const AcademiesList = ({ academies }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <ActiveIcon fontSize="small" />;
      case 'inactive':
        return <InactiveIcon fontSize="small" />;
      default:
        return null;
    }
  };

  const getPlanColor = (plan) => {
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

  return (
    <TableContainer 
      component={Paper} 
      sx={{ 
        boxShadow: 'none',
        background: 'transparent',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <Table sx={{ minWidth: 300 }}>
        <TableHead>
          <TableRow sx={{ background: 'rgba(25, 118, 210, 0.04)' }}>
            <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', color: 'primary.main', py: 2 }}>
              Academy
            </TableCell>
            <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', color: 'primary.main', py: 2 }}>
              Subdomain
            </TableCell>
            <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', color: 'primary.main', py: 2 }}>
              Plan
            </TableCell>
            <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', color: 'primary.main', py: 2 }}>
              Status
            </TableCell>
            <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', color: 'primary.main', py: 2 }}>
              Stats
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {academies.map((academy, index) => (
            <TableRow
              key={academy.id}
              sx={{
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.04)',
                  transform: 'translateX(4px)',
                  '& .academy-avatar': {
                    transform: 'scale(1.1)',
                  },
                },
                cursor: 'pointer',
                borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
              }}
            >
              <TableCell sx={{ py: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    className="academy-avatar"
                    sx={{
                      bgcolor: 'primary.main',
                      width: 48,
                      height: 48,
                      fontSize: '1rem',
                      fontWeight: 600,
                      transition: 'transform 0.2s ease-in-out',
                      boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
                    }}
                  >
                    {getAcademyInitials(academy.name)}
                  </Avatar>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {academy.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                      Created {new Date(academy.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell sx={{ py: 2.5 }}>
                <Link
                  href={`https://${academy.subdomain}.yourdomain.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    textDecoration: 'none',
                    color: 'primary.main',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    '&:hover': {
                      textDecoration: 'underline',
                      color: 'primary.dark',
                    },
                  }}
                >
                  {academy.subdomain}
                </Link>
              </TableCell>
              <TableCell sx={{ py: 2.5 }}>
                <Chip
                  label={academy.plan}
                  size="small"
                  color={getPlanColor(academy.plan)}
                  variant="outlined"
                  sx={{ 
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    height: 28,
                    borderWidth: 2,
                  }}
                />
              </TableCell>
              <TableCell sx={{ py: 2.5 }}>
                <Chip
                  icon={getStatusIcon(academy.status)}
                  label={academy.status}
                  size="small"
                  color={getStatusColor(academy.status)}
                  sx={{ 
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    height: 28,
                  }}
                />
              </TableCell>
              <TableCell sx={{ py: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Tooltip title={`${academy.students} students`} arrow>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <PeopleIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        {academy.students?.toLocaleString() || '0'}
                      </Typography>
                    </Box>
                  </Tooltip>
                  <Tooltip title={`${academy.courses} courses`} arrow>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <BookIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        {academy.courses || '0'}
                      </Typography>
                    </Box>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AcademiesList; 