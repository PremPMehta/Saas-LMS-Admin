import React from 'react';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const drawerWidth = 80; // Collapsed sidebar width

const MainLayout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: `calc(100% - ${drawerWidth}px)`,
          minHeight: '100vh',
          backgroundColor: 'background.default',
        }}
      >
        <Navbar />
        <Box
          sx={{
            pt: 8, // Account for the fixed navbar
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout; 