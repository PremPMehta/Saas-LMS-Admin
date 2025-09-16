import React, { useState, useEffect } from 'react';
import {
  Box, IconButton, Typography, ListItem, ListItemButton,
  ListItemIcon, ListItemText, AppBar, Toolbar, Avatar
} from '@mui/material';
import {
  VideoLibrary as VideoIcon,
  ArrowBack as ArrowBackIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate, useParams } from 'react-router-dom';
import { getCommunityUrls } from '../utils/communityUrlUtils';
import { communityAuthApi } from '../utils/communityAuthApi';
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
  const [collapsed, setCollapsed] = useState(() => (localStorage.getItem('sidebarCollapsed') !== 'false'));

  useEffect(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    if (saved === 'true') {
      setCollapsed(true);
    }
  }, []);

  const communityUrls = communityName ? getCommunityUrls(communityName) : null;
  const communityData = communityAuthApi.getCurrentCommunity();

  const toggleSidebar = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('sidebarCollapsed', String(next));
      window.dispatchEvent(new CustomEvent('sidebar-toggle', { detail: { collapsed: next } }));
      return next;
    });
  };

  return (
    <Box sx={{
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

      {/* Logo + Collapse Icon */}
      <Box
        sx={{
          mb: 4,
          mx: 2,
          display: 'flex',
          justifyContent: collapsed ? 'center' : 'space-between',
          alignItems: 'center'
        }}
      >
        {!collapsed && (
          <img
            src="/bell-desk-logo.png"
            alt="Bell & Desk"
            style={{
              width: '130px',
              objectFit: 'contain',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          />
        )}

        <IconButton
          onClick={toggleSidebar}
          sx={{
            color: '#ffffff',
            backgroundColor: 'transparent',
            transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.1)'
            }
          }}
        >
          <ArrowBackIcon />
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
                onClick={() => !isActive && navigate(item.path)}
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
                  justifyContent: collapsed ? 'center' : 'flex-start'
                }}
              >
                <ListItemIcon sx={{ 
                  minWidth: 0,
                  color: 'inherit',
                  mr: collapsed ? 0 : 1.5,
                  display: 'flex',
                  justifyContent: 'center'
                }}>
                  {item.icon}
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText 
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: '0.9rem',
                      fontWeight: isActive ? 600 : 400,
                      color: 'inherit'
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        });
      })()}

      {/* Bottom Avatar Section */}
      {/* <Box sx={{ mt: 'auto', mb: 2, width: '100%' }}>
        <AppBar position="static" sx={{ backgroundColor: "#0F3C60" , boxShadow: 'none' , border: 'none' }}>
          <Toolbar className='sidebar_profile' sx={{ display: "flex", justifyContent: "space-between"}}>
            <Box sx={{ display: "flex", alignItems: "center", gap: collapsed ? 0 : 1.5 }}>
              <Avatar
                alt="Profile"
                src="https://via.placeholder.com/40"
                sx={{ width: 40, height: 40 }}
              />
              {!collapsed && (
                <Typography variant="subtitle1" sx={{ color: "#fff" }}>
                  Hi, John
                </Typography>
              )}
            </Box>
            {!collapsed && (
              <IconButton edge="end" sx={{ color: "#ffffff" }}>
                <MenuIcon sx={{ color: "#ffffff" }} />
              </IconButton>
            )}
          </Toolbar>
        </AppBar>
      </Box> */}
    </Box>
  );
};

export default FocusedSidebar;
