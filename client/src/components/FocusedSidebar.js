import React from 'react';
import { Box, IconButton, Typography, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
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
      width: 240,
      background: '#0F3C60',
      borderRight: '1px solid rgba(255, 255, 255, 0.2)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      py: 2,
      position: 'fixed',
      height: '100vh',
      zIndex: 1000
    }}>
      {/* Logo */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'flex-start', alignItems: 'center', pl: 2 }}>
        <img
          src="/bell-desk-logo.webp"
          alt="Bell & Desk"
          style={{
            height: '50px',
            width: '100px',
            // maxWidth: '180px',
            objectFit: 'contain',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            // filter: 'brightness(0) invert(1)' // Logo is already white
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.filter = 'brightness(1.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.filter = 'brightness(1)';
          }}
          onError={(e) => {
            // If image fails, replace with text
            e.target.style.display = 'none';
            const textLogo = document.createElement('div');
            textLogo.textContent = 'Bell & Desk';
            textLogo.style.cssText = `
              font-weight: 800;
              color: #ffffff;
              font-size: 1.1rem;
              letter-spacing: -0.5px;
              text-align: center;
              cursor: pointer;
              transition: all 0.2s ease;
            `;
            e.target.parentNode.appendChild(textLogo);
          }}
        />
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
        // If on student path, definitely a community user
        // If on admin path, definitely a community admin
        // If on neither, check tokens (communityUserToken = student, communityToken = admin)
        const isCommunityUser = isOnStudentPath || (!isOnAdminPath && !isOnStudentPath && !!communityUserToken && !communityToken);
        
        console.log('🔍 FocusedSidebar Debug:', {
          communityUserData: communityUserData ? 'EXISTS' : 'NULL',
          communityData: communityData ? 'EXISTS' : 'NULL',
          communityToken: communityToken ? 'EXISTS' : 'NULL',
          communityUserToken: communityUserToken ? 'EXISTS' : 'NULL',
          isOnAdminPath: isOnAdminPath,
          isOnStudentPath: isOnStudentPath,
          isCommunityUser: isCommunityUser,
          currentPath: window.location.pathname,
          userType: isCommunityUser ? 'STUDENT' : 'ADMIN'
        });
        
        const navItems = isCommunityUser ? [
          // Navigation for community users (students) - only show Courses
          { icon: <VideoIcon />, label: 'Courses', path: `/${communityName}/student/courses` }
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
            <ListItem key={index} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
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
                  borderRadius: 2,
                  mx: 1,
                  py: 1.5,
                  color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
                  backgroundColor: isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                  '&:hover': {
                    backgroundColor: isActive ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                  }
                }}
              >
                <ListItemIcon sx={{ 
                  minWidth: 40,
                  color: 'inherit'
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.9rem',
                    fontWeight: isActive ? 600 : 400,
                    color: 'inherit'
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        });
      })()}

      {/* Logout Button */}
      <Box sx={{ mt: 'auto', mb: 2, width: '100%' }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              // Check if we're in community user context using same logic
              const communityUserToken = localStorage.getItem('communityUserToken');
              const communityToken = localStorage.getItem('communityToken');
              const isOnAdminPath = window.location.pathname.includes('/admin/');
              const isOnStudentPath = window.location.pathname.includes('/student/');
              
              const isCommunityUser = isOnStudentPath || (!isOnAdminPath && !isOnStudentPath && !!communityUserToken && !communityToken);
              
              if (isCommunityUser) {
                // Logout community user
                localStorage.removeItem('communityUserToken');
                localStorage.removeItem('communityUserData');
                navigate('/discovery');
              } else {
                // Logout community admin
                communityAuthApi.logout();
                navigate('/discovery');
              }
            }}
            sx={{
              borderRadius: 2,
              mx: 1,
              py: 1.5,
              color: 'rgba(255, 255, 255, 0.7)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
              }
            }}
          >
            <ListItemIcon sx={{ 
              minWidth: 40,
              color: 'inherit'
            }}>
              <ArrowBackIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Logout"
              primaryTypographyProps={{
                fontSize: '0.9rem',
                fontWeight: 400,
                color: 'inherit'
              }}
            />
          </ListItemButton>
        </ListItem>
      </Box>
    </Box>
  );
};

export default FocusedSidebar;
