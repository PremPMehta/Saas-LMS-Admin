import React, { useState, useEffect } from 'react';
import {
  Box, IconButton, Typography, ListItem, ListItemButton,
  ListItemIcon, ListItemText, AppBar, Toolbar, Avatar,
  useMediaQuery, useTheme, Drawer, Backdrop
} from '@mui/material';
import {
  VideoLibrary as VideoIcon,
  ArrowBack as ArrowBackIcon,
  People as PeopleIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { getCommunityUrls } from '../utils/communityUrlUtils';
import { communityAuthApi } from '../utils/communityAuthApi';
import { useSidebar } from '../contexts/SidebarContext';
import '../App.css';

// Ensure a default collapsed state before first render
if (typeof window !== 'undefined') {
  const v = localStorage.getItem('sidebarCollapsed');
  if (v === null || v === undefined) {
    localStorage.setItem('sidebarCollapsed', 'true');
  }
}

const FocusedSidebar = ({ darkMode }) => {
  const navigate = useNavigate();
  const { communityName } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { collapsed, mobileOpen, toggleSidebar, toggleMobileSidebar, setMobileSidebarOpen } = useSidebar();

  // Close mobile sidebar when switching to desktop
  useEffect(() => {
    if (!isMobile && mobileOpen) {
      setMobileSidebarOpen(false);
    }
  }, [isMobile, mobileOpen, setMobileSidebarOpen]);

  const communityUrls = communityName ? getCommunityUrls(communityName) : null;
  const communityData = communityAuthApi.getCurrentCommunity();

  const handleToggleSidebar = () => {
    if (isMobile) {
      toggleMobileSidebar();
    } else {
      toggleSidebar(); // Use context toggle function
    }
  };

  const handleMobileClose = () => {
    setMobileSidebarOpen(false);
  };

  // Sidebar content component that can be reused for both desktop and mobile
  const SidebarContent = ({ isMobile = false }) => (
    <Box sx={{
      // width: isMobile ? 240 : (collapsed ? 60 : 240),
      width: '100%',
      background: '#0F3C60',
      borderRight: isMobile ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
      display: 'flex',
      flexDirection: 'column',
      py: 2,
      height: '100%',
      transition: 'width 0.3s ease',
    }}>
      {/* Logo + Collapse Icon */}
      <Box
        sx={{
          mb: 4,
          mx: 2,
          display: 'flex',
          justifyContent: (isMobile || !collapsed) ? 'space-between' : 'center',
          alignItems: 'center',

        }}
      >
        {(isMobile || !collapsed) && (
          <img
            src="/bell-desk-logo.png"
            alt="Bell & Desk"
            style={{
              width: '130px',
              objectFit: 'contain',
              cursor: 'pointer',
            }}
          />
        )}

        <IconButton
          onClick={isMobile ? handleMobileClose : handleToggleSidebar}
          sx={{
            color: '#ffffff',
            backgroundColor: 'transparent',
            transform: (isMobile || collapsed) ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.1)'
            }
          }}
        >
          {isMobile ? <ArrowBackIcon /> : <ArrowBackIcon />}
        </IconButton>
      </Box>

      {/* Navigation Items */}
      {(() => {
        const communityUserToken = localStorage.getItem('communityUserToken');
        const communityToken = localStorage.getItem('communityToken');
        const isOnAdminPath = window.location.pathname.includes('/admin/');
        const isOnStudentPath = window.location.pathname.includes('/student/');
        const isCommunityUser = isOnStudentPath || (!isOnAdminPath && !isOnStudentPath && !!communityUserToken && !communityToken);

        const navItems = isCommunityUser ? [
          // Navigation for community users (students) - only show Courses
          { icon: <VideoIcon />, label: 'Courses', path: `/${communityName}/student/courses` }
        ] : [
          { icon: <VideoIcon />, label: 'Courses', path: `/${communityName}/admin/courses` },
          { icon: <PeopleIcon />, label: 'Community Users', path: `/${communityName}/admin/community-users` }
        ];

        return navItems.map((item, index) => {
          const isActive = window.location.pathname.includes(item.path.split('/').pop());
          return (
            <ListItem key={index} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => {
                  if (!isActive) {
                    navigate(item.path);
                    if (isMobile) {
                      handleMobileClose();
                    }
                  }
                }}
                sx={{
                  borderRadius: 0,
                  py: 1.5,
                  borderLeft: isActive ? '4px solid #ffffff' : 'none',
                  color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
                  backgroundColor: isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                  '&:hover': {
                    backgroundColor: isActive ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                    color: '#ffffff'
                  },
                  justifyContent: (isMobile || !collapsed) ? 'flex-start' : 'center'
                }}
              >
                <ListItemIcon sx={{
                  minWidth: 0,
                  color: 'inherit',
                  mr: (isMobile || !collapsed) ? 1.5 : 0,
                  display: 'flex',
                  justifyContent: 'center'
                }}>
                  {item.icon}
                </ListItemIcon>

                <ListItemText
                  sx={{
                    minWidth: (isMobile || !collapsed) ? "200px" : 0,
                    mt: 0,  // 4px
                    mb: 0,  // 4px
                    opacity: (isMobile || !collapsed) ? 1 : 0,
                    display: (isMobile || !collapsed) ? 'block' : 'none',
                  }}
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
    </Box>
  );

  return (
    <>

      {/* Desktop sidebar */}
      {!isMobile && (
        <Box sx={{
          // width: collapsed ? 60 : 240,
          width: collapsed ? 60 : 240,
          background: '#0F3C60',
          borderRight: '1px solid rgba(255, 255, 255, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          py: 2,
          position: 'fixed',
          height: '100vh',
          zIndex: 1000,
          transition: 'width 0.3s ease'
        }}>
          <SidebarContent />
        </Box>
      )}

      {/* Mobile drawer */}
      {isMobile && (
        <Drawer
          anchor="left"
          open={mobileOpen}
          onClose={handleMobileClose}
          sx={{
            '& .MuiDrawer-paper': {
              width: 240,
              boxSizing: 'border-box',
              background: '#0F3C60',
              border: 'none',
              transition: 'width 0.3s ease'
            }
          }}
        >
          <SidebarContent isMobile={true} />
        </Drawer>
      )}
    </>
  );
};

export default FocusedSidebar;
