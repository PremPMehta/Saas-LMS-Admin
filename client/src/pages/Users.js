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
} from '@mui/material';
import {
  People as PeopleIcon,
  Add as AddIcon,
  AdminPanelSettings as AdminIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useTheme } from '../contexts/ThemeContext';
import UsersList from '../components/users/UsersList';
import AddUserModal from '../components/users/AddUserModal';
import KPICard from '../components/dashboard/KPICard';
import useDocumentTitle from '../contexts/useDocumentTitle';

const Users = () => {
  useDocumentTitle('Users - Bell n Desk');
  const { mode } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [usersData, setUsersData] = useState({
    users: [],
  });

  // Fetch users from backend
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? 'https://saas-lms-admin-1.onrender.com' : 'http://localhost:5001')}/api/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          console.error('Authentication failed - token may be expired');
          return;
        }
        throw new Error(`Failed to fetch users: ${response.status}`);
      }
      
      const data = await response.json();
      const users = data.data || data;
      
      setUsersData({
        users,
      });
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = () => {
    setIsModalOpen(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = () => {
    fetchUsers();
    setIsEditModalOpen(false);
    setEditingUser(null);
  };

  const handleDeleteUser = (userId) => {
    fetchUsers();
  };

  const handleSaveUser = () => {
    fetchUsers();
    setIsModalOpen(false);
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
    <Box
      sx={{
        minHeight: '100vh',
        background: mode === 'light' 
          ? 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
          : 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        {/* Page Header */}
        <Fade in timeout={800}>
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
              Bell n Desk - Users
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
              Manage system users and their access permissions
            </Typography>
          </Box>
        </Fade>

        {/* KPI Cards */}
        <Fade in timeout={1000}>
          <Box sx={{ mb: 4 }}>
            <Grid container spacing={3}>
              {/* Total Users Card */}
              <Grid size={{xs:12,md:6, lg:4}}>
                <KPICard
                  title="Total Users"
                  value={usersData.users.length}
                  description="Total number of registered users in the system"
                  icon={<PeopleIcon />}
                  color="primary"
                  isLoading={isLoading}
                />
              </Grid>

              {/* Admin Users Card */}
              <Grid size={{xs:12,md:6, lg:4}}>
                <KPICard
                  title="Admin Users"
                  value={usersData.users.filter(user => user.role === 'admin').length}
                  description="Users with administrative privileges"
                  icon={<AdminIcon />}
                  color="error"
                  isLoading={isLoading}
                />
              </Grid>

              {/* Standard Users Card */}
              <Grid size={{xs:12,sm:12, lg:4}}>
                <KPICard
                  title="Standard Users"
                  value={usersData.users.filter(user => user.role === 'user').length}
                  description="Regular users with standard access"
                  icon={<PersonIcon />}
                  color="success"
                  isLoading={isLoading}
                />
              </Grid>
            </Grid>
          </Box>
        </Fade>

        {/* Add User Button */}
        <Grow in timeout={1200}>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddUser}
              sx={{
                background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                px: 4,
                py: 1.5,
                borderRadius: 3,
                fontWeight: 600,
                fontSize: '1rem',
                boxShadow: '0 8px 24px rgba(25, 118, 210, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 32px rgba(25, 118, 210, 0.4)',
                },
                transition: 'all 0.3s ease-in-out',
              }}
            >
              Add New User
            </Button>
          </Box>
        </Grow>

        {/* Users List */}
        <Grow in timeout={1400}>
          <Paper
            elevation={0}
            sx={{
              background: (theme) => theme.palette.mode === 'light'
                ? 'rgba(255, 255, 255, 0.9)'
                : 'rgba(26, 26, 26, 0.9)',
              backdropFilter: 'blur(10px)',
              border: (theme) => `1px solid ${theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'}`,
              borderRadius: 3,
              '&:hover': {
                boxShadow: (theme) => theme.palette.mode === 'light'
                  ? '0 8px 32px rgba(0, 0, 0, 0.1)'
                  : '0 8px 32px rgba(0, 0, 0, 0.3)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease-in-out',
            }}
          >
            <UsersList
              users={usersData.users}
              onUserUpdate={handleUpdateUser}
              onUserDelete={handleDeleteUser}
              defaultRowsPerPage={10}
            />
          </Paper>
        </Grow>
      </Container>

      {/* Add User Modal */}
      <AddUserModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveUser}
      />

      {/* Edit User Modal */}
      {editingUser && (
        <AddUserModal
          open={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingUser(null);
          }}
          onSave={handleUpdateUser}
          editingUser={editingUser}
        />
      )}
    </Box>
  );
};

export default Users; 