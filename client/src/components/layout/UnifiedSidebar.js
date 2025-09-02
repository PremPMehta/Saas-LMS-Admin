import React, { useState, useEffect } from 'react';
import {
  Box,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  VideoLibrary as VideoLibraryIcon,
  People as PeopleIcon,
  AccountCircle as ProfileIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import communityAuthApi from '../../utils/communityAuthApi';

const UnifiedSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [activeNav, setActiveNav] = useState('home');

  // Check if user is community user or admin
  const isCommunityUser = !!localStorage.getItem('communityToken');
  const isAdmin = user?.role === 'admin';

  // Navigation items - unified for both admin and community
  const getNavItems = () => {
    const baseItems = [
      { id: 'home', icon: <HomeIcon />, label: 'Home', path: isCommunityUser ? '/community-dashboard' : '/dashboard' },
      { id: 'courses', icon: <VideoLibraryIcon />, label: 'Courses', path: isCommunityUser ? '/courses' : '/courses' },
      { id: 'admins', icon: <PeopleIcon />, label: 'Admins', path: isCommunityUser ? '/community-admins' : '/users' },
      { id: 'profile', icon: <ProfileIcon />, label: 'Profile', path: isCommunityUser ? '/community-profile' : '/profile' },
    ];

    return baseItems;
  };

  const navItems = getNavItems();

  // Determine active nav based on current path
  const getActiveNav = () => {
    const currentPath = location.pathname;
    const activeItem = navItems.find(item => item.path === currentPath);
    return activeItem ? activeItem.id : 'home';
  };

  // Set community ID in localStorage when component mounts (for community users)
  useEffect(() => {
    if (isCommunityUser) {
      const community = communityAuthApi.getCurrentCommunity();
      if (community && community._id) {
        localStorage.setItem('communityId', community._id);
      }
    }
  }, [isCommunityUser]);

  const handleLogout = () => {
    if (isCommunityUser) {
      communityAuthApi.logout();
      navigate('/community-login');
    } else {
      logout();
      navigate('/login');
    }
  };

  const handleNavClick = (item) => {
    setActiveNav(item.id);
    navigate(item.path);
  };

  return (
    <Box sx={{
      width: 80,
      background: darkMode ? '#2d2d2d' : '#ffffff',
      borderRight: `1px solid ${darkMode ? '#404040' : '#e0e0e0'}`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      py: 2,
      position: 'fixed',
      height: '100vh',
      zIndex: 1000,
    }}>
      {/* Hamburger Menu */}
      <IconButton sx={{ mb: 4, color: darkMode ? '#ffffff' : '#000000' }}>
        <MenuIcon />
      </IconButton>

      {/* Navigation Items */}
      {navItems.map((item) => (
        <Box key={item.id} sx={{ mb: 2, position: 'relative' }}>
          <IconButton
            onClick={() => handleNavClick(item)}
            sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              backgroundColor: getActiveNav() === item.id 
                ? (darkMode ? '#404040' : '#000000')
                : 'transparent',
              color: getActiveNav() === item.id 
                ? '#ffffff' 
                : (darkMode ? '#ffffff' : '#000000'),
              '&:hover': {
                backgroundColor: getActiveNav() === item.id 
                  ? (darkMode ? '#404040' : '#000000')
                  : (darkMode ? '#404040' : '#f0f0f0'),
              }
            }}
            title={item.label}
          >
            {item.icon}
          </IconButton>
        </Box>
      ))}

      {/* Logout Button */}
      <Box sx={{ mt: 'auto', mb: 2 }}>
        <IconButton 
          onClick={handleLogout}
          sx={{ color: darkMode ? '#ffffff' : '#000000' }}
          title="Logout"
        >
          <ArrowBackIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default UnifiedSidebar;
