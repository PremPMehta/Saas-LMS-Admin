import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Box,
  Typography,
  Divider,
  Avatar,
  Tooltip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  People as PeopleIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

const drawerWidth = 80; // Collapsed width

const Sidebar = () => {
  const { mode } = useTheme();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Get user role, default to 'user' if not set
  const userRole = user?.role || 'user';

  // Define menu items based on user role
  const getMenuItems = () => {
    const allMenuItems = [
      { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard', roles: ['admin'] },
      { text: 'Academies', icon: <SchoolIcon />, path: '/academies', roles: ['admin', 'user'] },
      { text: 'Plans', icon: <AssignmentIcon />, path: '/plans', roles: ['admin', 'user'] },
      { text: 'Users', icon: <PeopleIcon />, path: '/users', roles: ['admin'] },
      { text: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics', roles: ['admin'] },
      { text: 'Settings', icon: <SettingsIcon />, path: '/settings', roles: ['admin'] },
    ];

    // Filter menu items based on user role
    return allMenuItems.filter(item => item.roles.includes(userRole));
  };

  const menuItems = getMenuItems();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          background: (theme) => theme.palette.mode === 'light' 
            ? 'rgba(255, 255, 255, 0.98)'
            : 'rgba(26, 26, 26, 0.98)',
          borderRight: '1px solid',
          borderColor: (theme) => theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(20px)',
          overflow: 'hidden',
          boxShadow: (theme) => theme.palette.mode === 'light'
            ? '2px 0 8px rgba(0, 0, 0, 0.05)'
            : '2px 0 8px rgba(0, 0, 0, 0.2)',
        },
      }}
    >
      {/* Logo Section */}
      <Box
        sx={{
          p: 2,
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
            pointerEvents: 'none',
          },
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 800,
              color: 'white',
              fontSize: '1.25rem',
              textAlign: 'center',
              letterSpacing: '-0.5px',
            }}
          >
            BBR
          </Typography>
        </Box>
      </Box>

      {/* Navigation Menu */}
      <List sx={{ p: 1, mt: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <Tooltip title={item.text} placement="right" arrow>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    minHeight: 48,
                    borderRadius: 2,
                    mx: 0.5,
                    backgroundColor: isActive 
                      ? (theme) => theme.palette.mode === 'light'
                        ? 'rgba(25, 118, 210, 0.1)'
                        : 'rgba(25, 118, 210, 0.2)'
                      : 'transparent',
                    border: isActive 
                      ? '1px solid rgba(25, 118, 210, 0.2)'
                      : '1px solid transparent',
                    '&:hover': {
                      backgroundColor: isActive 
                        ? (theme) => theme.palette.mode === 'light'
                          ? 'rgba(25, 118, 210, 0.15)'
                          : 'rgba(25, 118, 210, 0.25)'
                        : (theme) => theme.palette.mode === 'light'
                          ? 'rgba(0, 0, 0, 0.04)'
                          : 'rgba(255, 255, 255, 0.04)',
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      color: isActive ? 'primary.main' : 'text.secondary',
                      '& .MuiSvgIcon-root': {
                        fontSize: 24,
                      },
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>

      {/* User Profile Section */}
      <Box sx={{ mt: 'auto', p: 2 }}>
        <Divider sx={{ mb: 2, opacity: 0.6 }} />
        <Tooltip 
          title={`${userRole === 'admin' ? 'Administrator' : 'User'}: ${user?.email || 'user@example.com'}`} 
          placement="right" 
          arrow
        >
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                backgroundColor: userRole === 'admin' 
                  ? 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)'
                  : 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
                color: 'white',
                fontWeight: 700,
                fontSize: '1rem',
                boxShadow: (theme) => theme.palette.mode === 'light'
                  ? '0 4px 12px rgba(0, 0, 0, 0.15)'
                  : '0 4px 12px rgba(0, 0, 0, 0.3)',
                border: '2px solid',
                borderColor: (theme) => theme.palette.mode === 'light'
                  ? 'rgba(255, 255, 255, 0.8)'
                  : 'rgba(255, 255, 255, 0.2)',
              }}
            >
              {userRole === 'admin' ? 'A' : 'U'}
            </Avatar>
          </Box>
        </Tooltip>
      </Box>
    </Drawer>
  );
};

export default Sidebar; 