import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  InputBase,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Tooltip,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
} from '@mui/icons-material';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

const drawerWidth = 280;

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: 25,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
  border: '1px solid',
  borderColor: alpha(theme.palette.common.white, 0.2),
  backdropFilter: 'blur(10px)',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: alpha(theme.palette.common.white, 0.8),
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
    '&::placeholder': {
      color: alpha(theme.palette.common.white, 0.7),
      opacity: 1,
    },
  },
}));

const Navbar = () => {
  const { mode, toggleTheme } = useTheme();
  const { logout, getCurrentUser } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const isMenuOpen = Boolean(anchorEl);

  return (
    <AppBar
      position="fixed"
      sx={{
        width: `calc(100% - ${drawerWidth}px)`,
        ml: `${drawerWidth}px`,
        background: 'linear-gradient(135deg, rgba(255, 111, 12, 0.95) 0%, rgba(255, 111, 12, 0.85) 100%)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: 3 }}>
        {/* Search Bar */}
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search academies, users, plans..."
            inputProps={{ 'aria-label': 'search' }}
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </Search>

        {/* Right Side Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Theme Toggle */}
          <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
            <IconButton
              onClick={toggleTheme}
              sx={{
                color: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  transform: 'scale(1.05)',
                },
              }}
            >
              {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Tooltip>

          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton
              sx={{
                color: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  transform: 'scale(1.05)',
                },
              }}
            >
              <Badge badgeContent={4} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* User Profile */}
          <Tooltip title="Account settings">
            <IconButton
              onClick={handleMenuOpen}
              sx={{
                color: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  transform: 'scale(1.05)',
                },
              }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                }}
              >
                {getCurrentUser()?.email?.charAt(0).toUpperCase() || 'A'}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>

        {/* User Menu */}
        <Menu
          anchorEl={anchorEl}
          open={isMenuOpen}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 200,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              borderRadius: 2,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          {/* User Info */}
          <Box sx={{ p: 2, pb: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary' }}>
              {getCurrentUser()?.email || 'Admin User'}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Super Administrator
            </Typography>
          </Box>
          
          <Divider sx={{ my: 1 }} />
          
          <MenuItem onClick={handleMenuClose} sx={{ py: 1.5 }}>
            <AccountCircleIcon sx={{ mr: 2, fontSize: 20 }} />
            <Typography variant="body2">Profile</Typography>
          </MenuItem>
          
          <MenuItem onClick={handleMenuClose} sx={{ py: 1.5 }}>
            <SettingsIcon sx={{ mr: 2, fontSize: 20 }} />
            <Typography variant="body2">Settings</Typography>
          </MenuItem>
          
          <Divider sx={{ my: 1 }} />
          
          <MenuItem 
            onClick={handleLogout} 
            sx={{ 
              py: 1.5,
              color: 'error.main',
              '&:hover': {
                backgroundColor: 'error.light',
                color: 'white',
              },
            }}
          >
            <LogoutIcon sx={{ mr: 2, fontSize: 20 }} />
            <Typography variant="body2">Logout</Typography>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 