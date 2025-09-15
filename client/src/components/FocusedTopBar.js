import React, { useState } from 'react';
import { Box, Avatar, IconButton, Tooltip, Menu, MenuItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import {
  WbSunny as SunIcon,
  DarkMode as DarkIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { communityAuthApi } from '../utils/communityAuthApi';

const FocusedTopBar = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  // Check if user is a community user (student) or admin
  const communityUserData = localStorage.getItem('communityUser');
  const isCommunityUser = !!communityUserData;
  
  // Debug logging
  console.log('🔍 FocusedTopBar Debug:', {
    communityUserData: communityUserData ? 'present' : 'null',
    isCommunityUser,
    communityUserToken: localStorage.getItem('communityUserToken') ? 'present' : 'null',
    communityToken: localStorage.getItem('communityToken') ? 'present' : 'null'
  });
  
  // Get appropriate data based on user type
  const communityData = communityAuthApi.getCurrentCommunity();
  const studentData = isCommunityUser ? JSON.parse(communityUserData) : null;
  
  console.log('🔍 FocusedTopBar User Data:', {
    studentData: studentData ? { firstName: studentData.firstName, lastName: studentData.lastName, email: studentData.email } : null,
    communityData: communityData ? { name: communityData.name, ownerEmail: communityData.ownerEmail } : null
  });

  // Function to get page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    
    // Community Admin routes
    if (path.includes('/community-dashboard')) return 'Dashboard';
    if (path.includes('/community-courses')) return 'Courses';
    if (path.includes('/community-users')) return 'Community-Users';
    if (path.includes('/community-admins')) return 'Community-Admins';
    if (path.includes('/community-settings')) return 'Settings';
    
    // Student routes
    if (path.includes('/student-dashboard')) return 'My Dashboard';
    if (path.includes('/student-courses')) return 'My Courses';
    if (path.includes('/discovery')) return 'Discover Courses';
    if (path.includes('/course-viewer')) return 'Course Viewer';
    if (path.includes('/discover-course-viewer')) return 'Course Viewer';
    
    // General routes
    if (path.includes('/dashboard')) return 'Dashboard';
    if (path.includes('/courses')) return 'Courses';
    if (path.includes('/users')) return 'Users';
    if (path.includes('/academies')) return 'Academies';
    if (path.includes('/plans')) return 'Plans';
    if (path.includes('/settings')) return 'Settings';
    if (path.includes('/profile')) return 'Profile';
    
    // Default fallback
    return isCommunityUser ? 'Courses' : 'Community';
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleMenuClose();
    // Navigate to profile page or show profile modal
    console.log('Profile clicked');
  };

  const handleLogout = () => {
    handleMenuClose();
    if (isCommunityUser) {
      // Clear student data and redirect to discovery page
      localStorage.removeItem('communityUserToken');
      localStorage.removeItem('communityUser');
      navigate('/discovery');
    } else {
      // Clear admin data and redirect to discovery
      communityAuthApi.logout();
      navigate('/discovery');
    }
  };

  return (
    <Box sx={{
      height: 70, // Increased height for better proportions
      background: darkMode ? '#2d2d2d' : '#ffffff',
      // borderBottom: `1px solid ${darkMode ? '#404040' : '#e0e0e0'}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      px: 3,
      position: 'fixed',
      top: 0,
      left: 240, // Start right after sidebar (240px width)
      right: 0, // Extend to right edge
      zIndex: 1000,
    }}>
      {/* Left side - Page Title */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography 
          variant="h5" 
          component="h1"
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
            letterSpacing: '-0.5px',
            // background: darkMode 
            //   ? 'linear-gradient(45deg, #ffffff, #e0e0e0)' 
            //   : 'linear-gradient(45deg, #0F3C60, #1976d2)',
            backgroundClip: 'text',            // textShadow: darkMode ? '0 2px 4px rgba(0,0,0,0.3)' : '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          {getPageTitle()}
        </Typography>
      </Box>

      {/* Right side - User Profile */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ textAlign: 'right' }}>
          <Box sx={{ 
            fontSize: '0.875rem', 
            fontWeight: 600, 
            color: darkMode ? '#ffffff' : '#000000',
            lineHeight: 1.2
          }}>
            {isCommunityUser ? 
              (studentData?.firstName && studentData?.lastName ? 
                `${studentData.firstName} ${studentData.lastName}` : 
                (studentData?.firstName || studentData?.email || 'Student')
              ) : 
              (communityData?.name || 'Community')
            }
          </Box>
          <Box sx={{ 
            fontSize: '0.75rem', 
            color: darkMode ? '#b0b0b0' : '#666666',
            lineHeight: 1.2
          }}>
            {isCommunityUser ? 'Student' : (communityData?.ownerEmail || 'Admin')}
          </Box>
        </Box>
        
        <Tooltip title={`${isCommunityUser ? 
          (studentData?.firstName && studentData?.lastName ? 
            `${studentData.firstName} ${studentData.lastName}` : 
            (studentData?.firstName || studentData?.email || 'Student')
          ) : 
          (communityData?.name || 'Community')
        } Profile`}>
          <IconButton
            onClick={handleAvatarClick}
            sx={{
              p: 0,
              '&:hover': {
                transform: 'scale(1.05)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            <Avatar
              sx={{
                bgcolor: isCommunityUser ? '#34a853' : '#0F3C60', // Green for students, blue for admins
                width: 50, // Match sidebar circle size
                height: 50, // Match sidebar circle size
                fontSize: '1.2rem', // Match sidebar font size
                fontWeight: 'bold',
                color: '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  boxShadow: isCommunityUser ? '0 4px 12px rgba(52, 168, 83, 0.3)' : '0 4px 12px rgba(15, 60, 96, 0.3)',
                }
              }}
            >
              {isCommunityUser ? 
                (studentData?.firstName?.charAt(0) || studentData?.email?.charAt(0) || 'S') : 
                (communityData?.name?.charAt(0) || 'C')
              }
            </Avatar>
          </IconButton>
        </Tooltip>
      </Box>

      {/* Profile Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        PaperProps={{
          elevation: 8,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 4px 20px rgba(0,0,0,0.15))',
            mt: 2,
            minWidth: 200,
            borderRadius: 3,
            border: `1px solid ${darkMode ? '#404040' : '#e0e0e0'}`,
            background: darkMode ? '#2d2d2d' : '#ffffff',
            '& .MuiMenuItem-root': {
              px: 3,
              py: 2,
              borderRadius: 2,
              mx: 1,
              my: 0.5,
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: darkMode ? '#404040' : '#f5f5f5',
                transform: 'translateX(4px)',
              },
              '&:first-of-type': {
                mt: 1,
              },
              '&:last-of-type': {
                mb: 1,
              }
            },
            '& .MuiListItemIcon-root': {
              minWidth: 40,
              color: darkMode ? '#ffffff' : '#666666',
            },
            '& .MuiListItemText-root': {
              '& .MuiTypography-root': {
                fontSize: '0.95rem',
                fontWeight: 500,
                color: darkMode ? '#ffffff' : '#333333',
              }
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: -6,
              right: 20,
              width: 12,
              height: 12,
              bgcolor: darkMode ? '#2d2d2d' : '#ffffff',
              border: `1px solid ${darkMode ? '#404040' : '#e0e0e0'}`,
              borderBottom: 'none',
              borderRight: 'none',
              transform: 'rotate(45deg)',
              zIndex: 1,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(4px)',
            }
          }
        }}
      >
        <MenuItem onClick={handleProfile} sx={{ 
          '&:hover .MuiListItemIcon-root': { 
            color: '#0F3C60' 
          } 
        }}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Profile Settings</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleLogout} sx={{ 
          '&:hover .MuiListItemIcon-root': { 
            color: '#ea4335' 
          } 
        }}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Sign Out</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default FocusedTopBar;
