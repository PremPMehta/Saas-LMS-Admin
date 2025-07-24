import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';

const drawerWidth = 240;

// Layout component for pages that need sidebar and navbar
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

const AppRoutes = () => {
  return (
    <Routes>
      {/* Login route - no layout */}
      <Route path="/login" element={<Login />} />
      
      {/* Main app routes with layout */}
      <Route
        path="/dashboard"
        element={
          <MainLayout>
            <Dashboard />
          </MainLayout>
        }
      />
      <Route
        path="/academies"
        element={
          <MainLayout>
            <div style={{ padding: '24px' }}>Academies Page - Coming Soon</div>
          </MainLayout>
        }
      />
      <Route
        path="/plans"
        element={
          <MainLayout>
            <div style={{ padding: '24px' }}>Plans Page - Coming Soon</div>
          </MainLayout>
        }
      />
      <Route
        path="/users"
        element={
          <MainLayout>
            <div style={{ padding: '24px' }}>Users Page - Coming Soon</div>
          </MainLayout>
        }
      />
      <Route
        path="/analytics"
        element={
          <MainLayout>
            <div style={{ padding: '24px' }}>Analytics Page - Coming Soon</div>
          </MainLayout>
        }
      />
      <Route
        path="/settings"
        element={
          <MainLayout>
            <div style={{ padding: '24px' }}>Settings Page - Coming Soon</div>
          </MainLayout>
        }
      />
      <Route
        path="/profile"
        element={
          <MainLayout>
            <div style={{ padding: '24px' }}>Profile Page - Coming Soon</div>
          </MainLayout>
        }
      />
      
      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes; 