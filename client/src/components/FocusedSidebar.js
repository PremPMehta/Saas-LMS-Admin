import React from 'react';
import { Box, Avatar, IconButton } from '@mui/material';
import {
  VideoLibrary as VideoIcon,
  ArrowBack as ArrowBackIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { getCommunityUrls } from '../utils/communityUrlUtils';
import { communityAuthApi } from '../utils/communityAuthApi';

const FocusedSidebar = ({ darkMode }) => {
  const navigate = useNavigate();
  const { communityName } = useParams();
  
  // Get community-specific URLs
  const communityUrls = communityName ? getCommunityUrls(communityName) : null;
  
  // Get community data
  const communityData = communityAuthApi.getCurrentCommunity();

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
      zIndex: 1000
    }}>
      {/* Logo */}
      <Box sx={{ mb: 4 }}>
        <Avatar sx={{
          bgcolor: '#4285f4',
          width: 50,
          height: 50,
          fontSize: '1.2rem',
          fontWeight: 'bold',
          color: '#ffffff',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: '0 4px 12px rgba(66, 133, 244, 0.3)'
          }
        }}>
          {communityData?.name?.charAt(0) || 'C'}
        </Avatar>
      </Box>

      {/* Navigation Items */}
      {(() => {
        // Check if we're in community user context
        const communityUserData = localStorage.getItem('communityUserData');
        const communityData = localStorage.getItem('communityData');
        const communityToken = localStorage.getItem('communityToken');
        const communityUserToken = localStorage.getItem('communityUserToken');
        
        // Determine user type based on current path and available tokens
        // If we're on an admin path, we're an admin regardless of localStorage
        const isOnAdminPath = window.location.pathname.includes('/admin/');
        const isOnStudentPath = window.location.pathname.includes('/student/');
        
        // Priority: 1) Current path, 2) Available tokens
        const isCommunityUser = isOnStudentPath || (!isOnAdminPath && !!communityUserToken && !communityToken);
        
        console.log('🔍 FocusedSidebar Debug:', {
          communityUserData: communityUserData ? 'EXISTS' : 'NULL',
          communityData: communityData ? 'EXISTS' : 'NULL',
          communityToken: communityToken ? 'EXISTS' : 'NULL',
          communityUserToken: communityUserToken ? 'EXISTS' : 'NULL',
          isOnAdminPath: isOnAdminPath,
          isOnStudentPath: isOnStudentPath,
          isCommunityUser: isCommunityUser,
          currentPath: window.location.pathname
        });
        
        const navItems = isCommunityUser ? [
          // Navigation for community users
          { icon: <VideoIcon />, label: 'Courses', path: `/${communityName}/student/courses` },
          { icon: <PeopleIcon />, label: 'Profile', path: `/${communityName}/student/profile` }
        ] : [
          // Navigation for community admins
          { icon: <VideoIcon />, label: 'Courses', path: `/${communityName}/admin/courses` },
          { icon: <PeopleIcon />, label: 'Community Users', path: `/${communityName}/admin/community-users` }
        ];
        
        return navItems.map((item, index) => {
          // Check if we're currently on this page
          const isActive = window.location.pathname.includes(item.path.split('/').pop()) || 
            (isCommunityUser && item.label === 'Courses' && window.location.pathname.includes('/student/'));
        
          return (
            <Box key={index} sx={{ mb: 2 }}>
              <IconButton
                onClick={() => {
                  console.log('Navigation clicked:', {
                    label: item.label,
                    path: item.path,
                    isActive: isActive,
                    currentPath: window.location.pathname
                  });
                  
                  // If already on this page, do nothing
                  if (isActive) {
                    console.log('Already on this page, no action needed');
                  } else {
                    console.log('Navigating to:', item.path);
                    navigate(item.path);
                  }
                }}
                sx={{
                  color: isActive
                    ? (darkMode ? '#ffffff' : '#000000')
                    : (darkMode ? '#b0b0b0' : '#666666'),
                  backgroundColor: isActive 
                    ? (darkMode ? '#404040' : '#e3f2fd')
                    : 'transparent',
                  '&:hover': {
                    backgroundColor: isActive 
                      ? (darkMode ? '#505050' : '#bbdefb')
                      : (darkMode ? '#404040' : '#f0f0f0'),
                    color: isActive
                      ? (darkMode ? '#ffffff' : '#000000')
                      : (darkMode ? '#ffffff' : '#000000'),
                  }
                }}
                title={item.label}
              >
                {item.icon}
              </IconButton>
            </Box>
          );
        });
      })()}

      {/* Logout Button */}
      <Box sx={{ mt: 'auto', mb: 2 }}>
        <IconButton
          onClick={() => {
            // Check if we're in community user context using same logic
            const communityUserToken = localStorage.getItem('communityUserToken');
            const communityToken = localStorage.getItem('communityToken');
            const isOnAdminPath = window.location.pathname.includes('/admin/');
            const isOnStudentPath = window.location.pathname.includes('/student/');
            
            const isCommunityUser = isOnStudentPath || (!isOnAdminPath && !!communityUserToken && !communityToken);
            
            if (isCommunityUser) {
              // Logout community user
              localStorage.removeItem('communityUserToken');
              localStorage.removeItem('communityUserData');
              navigate('/community-user-signup');
            } else {
              // Logout community admin
              communityAuthApi.logout();
              navigate('/community-login');
            }
          }}
          sx={{ color: darkMode ? '#ffffff' : '#000000' }}
          title="Logout"
        >
          <ArrowBackIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default FocusedSidebar;
