import React from 'react';
import { Box, Avatar, IconButton } from '@mui/material';
import {
  VideoLibrary as VideoIcon,
  ArrowBack as ArrowBackIcon,
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

      {/* Navigation Items - COURSES ONLY */}
      {[
        { icon: <VideoIcon />, label: 'Courses', path: communityUrls?.courses || '/courses' }
      ].map((item, index) => {
        // Check if we're currently on the courses page
        const isActive = window.location.pathname.includes('/courses');
        
        return (
          <Box key={index} sx={{ mb: 2 }}>
            <IconButton
              onClick={() => {
                // If already on courses page, just refresh
                if (isActive) {
                  window.location.reload();
                } else {
                  navigate(item.path);
                }
              }}
              sx={{
                color: isActive
                  ? (darkMode ? '#ffffff' : '#000000')
                  : (darkMode ? '#404040' : '#f0f0f0'),
                backgroundColor: isActive 
                  ? (darkMode ? '#404040' : '#e3f2fd')
                  : 'transparent',
                '&:hover': {
                  backgroundColor: isActive 
                    ? (darkMode ? '#505050' : '#bbdefb')
                    : (darkMode ? '#404040' : '#f0f0f0'),
                }
              }}
              title={item.label}
            >
              {item.icon}
            </IconButton>
          </Box>
        );
      })}

      {/* Logout Button */}
      <Box sx={{ mt: 'auto', mb: 2 }}>
        <IconButton
          onClick={() => {
            communityAuthApi.logout();
            navigate('/community-login');
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
