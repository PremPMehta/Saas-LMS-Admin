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
} from '@mui/material';
import {
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
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

  if (!academies || academies.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body2" color="text.secondary">
          No academies found
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
      <Table sx={{ minWidth: 300 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
              Academy Name
            </TableCell>
            <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
              Subdomain
            </TableCell>
            <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
              Plan
            </TableCell>
            <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
              Status
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {academies.map((academy) => (
            <TableRow
              key={academy.id}
              sx={{
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
                cursor: 'pointer',
              }}
            >
              <TableCell>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {academy.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Created {new Date(academy.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Link
                  href={`https://${academy.subdomain}.yourdomain.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    textDecoration: 'none',
                    color: 'primary.main',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  {academy.subdomain}
                </Link>
              </TableCell>
              <TableCell>
                <Chip
                  label={academy.plan}
                  size="small"
                  color={getPlanColor(academy.plan)}
                  variant="outlined"
                  sx={{ fontWeight: 500 }}
                />
              </TableCell>
              <TableCell>
                <Chip
                  icon={getStatusIcon(academy.status)}
                  label={academy.status}
                  size="small"
                  color={getStatusColor(academy.status)}
                  sx={{ fontWeight: 500 }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AcademiesList; 