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
  Chip,
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

const drawerWidth = 80; // Updated to match collapsed sidebar

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: 25,
  backgroundColor: theme.palette.mode === 'light' 
    ? alpha(theme.palette.common.white, 0.15)
    : alpha(theme.palette.common.black, 0.15),
  '&:hover': {
    backgroundColor: theme.palette.mode === 'light'
      ? alpha(theme.palette.common.white, 0.25)
      : alpha(theme.palette.common.black, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
  border: '1px solid',
  borderColor: theme.palette.mode === 'light'
    ? alpha(theme.palette.common.white, 0.2)
    : alpha(theme.palette.common.black, 0.2),
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
  color: theme.palette.mode === 'light'
    ? alpha(theme.palette.common.white, 0.8)
    : alpha(theme.palette.common.black, 0.8),
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '40ch',
    },
    [theme.breakpoints.up('lg')]: {
      width: '50ch',
    },
    '&::placeholder': {
      color: theme.palette.mode === 'light'
        ? alpha(theme.palette.common.white, 0.7)
        : alpha(theme.palette.common.black, 0.7),
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
    logout();
    handleMenuClose();
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const currentUser = getCurrentUser();

  return (
    <AppBar
      position="fixed"
      sx={{
        width: `calc(100% - ${drawerWidth}px)`,
        ml: `${drawerWidth}px`,
        background: (theme) => theme.palette.mode === 'light'
          ? 'rgba(255, 255, 255, 0.95)'
          : 'rgba(26, 26, 26, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid',
        borderColor: (theme) => theme.palette.mode === 'light' 
          ? 'rgba(0, 0, 0, 0.08)' 
          : 'rgba(255, 255, 255, 0.08)',
        boxShadow: (theme) => theme.palette.mode === 'light'
          ? '0 2px 8px rgba(0, 0, 0, 0.05)'
          : '0 2px 8px rgba(0, 0, 0, 0.2)',
      }}
    >
      <Toolbar sx={{ px: 3, py: 1 }}>
        {/* Search Bar */}
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search academies, plans, users..."
            value={searchQuery}
            onChange={handleSearchChange}
            inputProps={{ 'aria-label': 'search' }}
          />
        </Search>

        <Box sx={{ flexGrow: 1 }} />

        {/* Right Side Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Notifications */}
          <Tooltip title="Notifications" arrow>
            <IconButton
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Theme Toggle */}
          <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`} arrow>
            <IconButton
              onClick={toggleTheme}
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Tooltip>

          {/* User Menu */}
          <Tooltip title="Account settings" arrow>
            <IconButton
              onClick={handleMenuOpen}
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: 'primary.main',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                }}
              >
                {currentUser?.firstName?.charAt(0) || currentUser?.email?.charAt(0) || 'U'}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>

        {/* User Menu Dropdown */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 200,
              borderRadius: 2,
              background: (theme) => theme.palette.mode === 'light'
                ? 'rgba(255, 255, 255, 0.98)'
                : 'rgba(26, 26, 26, 0.98)',
              backdropFilter: 'blur(20px)',
              border: '1px solid',
              borderColor: (theme) => theme.palette.mode === 'light' 
                ? 'rgba(0, 0, 0, 0.08)' 
                : 'rgba(255, 255, 255, 0.08)',
              boxShadow: (theme) => theme.palette.mode === 'light'
                ? '0 8px 32px rgba(0, 0, 0, 0.1)'
                : '0 8px 32px rgba(0, 0, 0, 0.3)',
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          {/* User Info */}
          <Box sx={{ p: 2, pb: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary' }}>
              {currentUser?.firstName} {currentUser?.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
              {currentUser?.email}
            </Typography>
            <Chip
              label={currentUser?.role === 'admin' ? 'Administrator' : 'User'}
              size="small"
              sx={{
                mt: 1,
                backgroundColor: currentUser?.role === 'admin' 
                  ? 'rgba(25, 118, 210, 0.1)' 
                  : 'rgba(76, 175, 80, 0.1)',
                color: currentUser?.role === 'admin' ? 'primary.main' : 'success.main',
                fontWeight: 600,
                fontSize: '0.75rem',
              }}
            />
          </Box>

          <Divider sx={{ my: 1 }} />

          {/* Menu Items */}
          <MenuItem onClick={handleMenuClose} sx={{ py: 1.5, px: 2 }}>
            <AccountCircleIcon sx={{ mr: 2, fontSize: 20, color: 'text.secondary' }} />
            <Typography variant="body2">Profile</Typography>
          </MenuItem>

          <MenuItem onClick={handleMenuClose} sx={{ py: 1.5, px: 2 }}>
            <SettingsIcon sx={{ mr: 2, fontSize: 20, color: 'text.secondary' }} />
            <Typography variant="body2">Settings</Typography>
          </MenuItem>

          <Divider sx={{ my: 1 }} />

          <MenuItem onClick={handleLogout} sx={{ py: 1.5, px: 2, color: 'error.main' }}>
            <LogoutIcon sx={{ mr: 2, fontSize: 20 }} />
            <Typography variant="body2">Logout</Typography>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 