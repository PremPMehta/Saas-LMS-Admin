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
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import communityAuthApi from '../../utils/communityAuthApi';
import { getCommunityUrls } from '../../utils/communityUrlUtils';

const CommunityLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { communityName } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [darkMode, setDarkMode] = useState(false);
  const [activeNav, setActiveNav] = useState('home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(localStorage.getItem('sidebarCollapsed') !== 'false');

  useEffect(() => {
    const handler = (e) => setSidebarCollapsed(e.detail?.collapsed ?? (localStorage.getItem('sidebarCollapsed') !== 'false'));
    window.addEventListener('sidebar-toggle', handler);
    return () => window.removeEventListener('sidebar-toggle', handler);
  }, []);

  // Get community-specific URLs
  const communityUrls = communityName ? getCommunityUrls(communityName) : null;

  // Navigation items - using community-specific URLs
  const navItems = communityUrls ? [
    { id: 'home', icon: <HomeIcon />, label: 'Home', path: communityUrls.dashboard },
    { id: 'courses', icon: <VideoLibraryIcon />, label: 'Courses', path: communityUrls.courses },
    { id: 'admins', icon: <PeopleIcon />, label: 'Admins', path: communityUrls.admins },
    { id: 'profile', icon: <ProfileIcon />, label: 'Profile', path: '/community-profile' },
  ] : [];

  // Determine active nav based on current path
  const getActiveNav = () => {
    const currentPath = location.pathname;
    const activeItem = navItems.find(item => item.path === currentPath);
    return activeItem ? activeItem.id : 'home';
  };

  // Set community ID in localStorage when component mounts
  useEffect(() => {
    const community = communityAuthApi.getCurrentCommunity();
    if (community && community._id) {
      localStorage.setItem('communityId', community._id);
    }
  }, []);

  const handleLogout = () => {
    communityAuthApi.logout();
    navigate('/community-login');
  };

  const handleNavClick = (item) => {
    setActiveNav(item.id);
    navigate(item.path);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: darkMode ? '#1a1a1a' : '#f8f9fa',
      display: 'flex'
    }}>
      {/* Left Navigation Bar */}
      <Box sx={{
        width: sidebarCollapsed ? 60 : 240,
        background: darkMode ? '#2d2d2d' : '#ffffff',
        borderRight: `1px solid ${darkMode ? '#404040' : '#e0e0e0'}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: 2,
        position: 'fixed',
        height: '100vh',
        zIndex: 1000,
        transition: 'width 0.3s ease'
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

      {/* Main Content Area */}
      <Box sx={{ 
        flex: 1, 
        ml: sidebarCollapsed ? 7.5 : 30, // 60px or 240px
        display: 'flex',
        flexDirection: 'column',
        transition: 'margin-left 0.3s ease'
      }}>
        {/* Top Header */}
        <Box sx={{
          height: 80,
          background: darkMode ? '#2d2d2d' : '#ffffff',
          borderBottom: `1px solid ${darkMode ? '#404040' : '#e0e0e0'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 4,
          position: 'sticky',
          top: 0,
          zIndex: 999,
        }}>
          {/* Page Title */}
          <Box>
            <h1 style={{ 
              margin: 0, 
              fontSize: '24px', 
              fontWeight: 'bold',
              color: darkMode ? '#ffffff' : '#000000'
            }}>
              Bell & Desk - {navItems.find(item => item.id === getActiveNav())?.label || 'Community Dashboard'}
            </h1>
          </Box>

          {/* Right side actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Add any additional header actions here */}
          </Box>
        </Box>

        {/* Page Content */}
        <Box sx={{ flex: 1, p: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default CommunityLayout;
