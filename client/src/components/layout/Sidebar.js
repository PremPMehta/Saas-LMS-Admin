import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  Avatar,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  People as PeopleIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useTheme } from '../../contexts/ThemeContext';

const drawerWidth = 280;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Academies', icon: <SchoolIcon />, path: '/academies' },
  { text: 'Plans', icon: <AssignmentIcon />, path: '/plans' },
  { text: 'Users', icon: <PeopleIcon />, path: '/users' },
  { text: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
];

const Sidebar = () => {
  const { mode } = useTheme();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          background: mode === 'light' 
            ? 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)'
            : 'linear-gradient(180deg, #1a202c 0%, #2d3748 100%)',
          borderRight: '1px solid',
          borderColor: mode === 'light' ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(10px)',
        },
      }}
    >
      {/* Logo Section */}
      <Box
        sx={{
          p: 3,
          background: 'linear-gradient(135deg, rgb(255, 111, 12) 0%, rgba(255, 111, 12, 0.8) 100%)',
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
            variant="h4"
            component="div"
            sx={{
              fontWeight: 800,
              color: 'white',
              textAlign: 'center',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              letterSpacing: '-0.5px',
            }}
          >
            BBR Tek
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              textAlign: 'center',
              display: 'block',
              mt: 0.5,
              fontWeight: 500,
              letterSpacing: '0.5px',
            }}
          >
            ADMIN PANEL
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: mode === 'light' ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.06)' }} />

      {/* Navigation Menu */}
      <Box sx={{ flexGrow: 1, py: 2 }}>
        <List sx={{ px: 2 }}>
          {menuItems.map((item, index) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  px: 2,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, rgba(255, 111, 12, 0.1) 0%, rgba(255, 111, 12, 0.05) 100%)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease-in-out',
                  },
                  '&:hover': {
                    background: mode === 'light' 
                      ? 'rgba(255, 111, 12, 0.08)' 
                      : 'rgba(255, 111, 12, 0.15)',
                    transform: 'translateX(4px)',
                    '&::before': {
                      opacity: 1,
                    },
                    '& .menu-icon': {
                      transform: 'scale(1.1)',
                      color: 'rgb(255, 111, 12)',
                    },
                    '& .menu-text': {
                      color: 'rgb(255, 111, 12)',
                      fontWeight: 600,
                    },
                  },
                  '&.Mui-selected': {
                    background: 'linear-gradient(135deg, rgba(255, 111, 12, 0.15) 0%, rgba(255, 111, 12, 0.08) 100%)',
                    border: '1px solid rgba(255, 111, 12, 0.2)',
                    '& .menu-icon': {
                      color: 'rgb(255, 111, 12)',
                    },
                    '& .menu-text': {
                      color: 'rgb(255, 111, 12)',
                      fontWeight: 600,
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      right: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 4,
                      height: 20,
                      background: 'rgb(255, 111, 12)',
                      borderRadius: '2px 0 0 2px',
                    },
                  },
                }}
              >
                <ListItemIcon
                  className="menu-icon"
                  sx={{
                    minWidth: 40,
                    transition: 'all 0.3s ease-in-out',
                    color: mode === 'light' ? 'text.secondary' : 'text.primary',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  className="menu-text"
                  primaryTypographyProps={{
                    sx: {
                      fontWeight: 500,
                      fontSize: '0.95rem',
                      transition: 'all 0.3s ease-in-out',
                      color: mode === 'light' ? 'text.primary' : 'text.primary',
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* User Profile Section */}
      <Box sx={{ p: 3, borderTop: '1px solid', borderColor: mode === 'light' ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.06)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              background: 'linear-gradient(135deg, rgb(255, 111, 12) 0%, rgba(255, 111, 12, 0.8) 100%)',
              fontWeight: 600,
              fontSize: '1.1rem',
              boxShadow: '0 4px 12px rgba(255, 111, 12, 0.3)',
            }}
          >
            A
          </Avatar>
          <Box>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: mode === 'light' ? 'text.primary' : 'text.primary',
                mb: 0.5,
              }}
            >
              Admin User
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: mode === 'light' ? 'text.secondary' : 'text.secondary',
                fontWeight: 500,
              }}
            >
              Super Administrator
            </Typography>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar; 