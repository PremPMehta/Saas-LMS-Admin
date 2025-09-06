import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import communityAuthApi from '../utils/communityAuthApi';
import { Box, CircularProgress, Typography } from '@mui/material';

const CommunityProtectedRoute = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = communityAuthApi.isAuthenticated();

  if (!isAuthenticated) {
    // Redirect to community login page with the return url
    return <Navigate to="/community-login" state={{ from: location }} replace />;
  }

  return children;
};

export default CommunityProtectedRoute;
