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
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  School as AcademiesIcon,
  Assignment as PlansIcon,
  People as UsersIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  Person as ProfileIcon,
} from '@mui/icons-material';
import { useTheme } from '../../contexts/ThemeContext';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Academies', icon: <AcademiesIcon />, path: '/academies' },
  { text: 'Plans', icon: <PlansIcon />, path: '/plans' },
  { text: 'Users', icon: <UsersIcon />, path: '/users' },
  { text: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  { text: 'Profile', icon: <ProfileIcon />, path: '/profile' },
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
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 2,
          minHeight: 64,
          borderBottom: `1px solid ${mode === 'light' ? '#e0e0e0' : '#333333'}`,
        }}
      >
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontWeight: 700,
            color: 'primary.main',
            fontSize: '1.5rem',
          }}
        >
          BBR Tek
        </Typography>
      </Box>
      
      <Divider />
      
      <List sx={{ paddingTop: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              sx={{
                margin: '4px 8px',
                borderRadius: '8px',
                '&:hover': {
                  backgroundColor: mode === 'light' ? 'rgba(255, 111, 12, 0.08)' : 'rgba(255, 111, 12, 0.12)',
                },
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: mode === 'light' ? '#666666' : '#b0b0b0',
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                sx={{
                  '& .MuiTypography-root': {
                    fontWeight: 500,
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar; 