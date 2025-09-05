import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import communityAuthApi from '../utils/communityAuthApi';

const CommunityRoute = ({ children }) => {
  const { communityName } = useParams();
  const [isValidating, setIsValidating] = useState(true);
  const [isValidCommunity, setIsValidCommunity] = useState(false);
  const [currentCommunity, setCurrentCommunity] = useState(null);

  useEffect(() => {
    const validateCommunity = async () => {
      try {
        // Check if user is authenticated
        if (!communityAuthApi.isAuthenticated()) {
          setIsValidating(false);
          return;
        }

        // Get current community from auth
        const community = communityAuthApi.getCurrentCommunity();
        if (!community) {
          setIsValidating(false);
          return;
        }

        // Convert community name to URL format for comparison
        const communityUrlName = community.name.toLowerCase().replace(/\s+/g, '-');
        
        // Validate that the URL community name matches the authenticated user's community
        if (communityUrlName === communityName) {
          setCurrentCommunity(community);
          setIsValidCommunity(true);
        } else {
          console.log('Community name mismatch:', {
            urlCommunity: communityName,
            authCommunity: communityUrlName,
            originalName: community.name
          });
          setIsValidCommunity(false);
        }
      } catch (error) {
        console.error('Error validating community:', error);
        setIsValidCommunity(false);
      } finally {
        setIsValidating(false);
      }
    };

    validateCommunity();
  }, [communityName]);

  if (isValidating) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        gap: 2
      }}>
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Validating community access...
        </Typography>
      </Box>
    );
  }

  if (!isValidCommunity) {
    // Redirect to community login if not authenticated or community doesn't match
    return <Navigate to="/community-login" replace />;
  }

  // Set community ID in localStorage for API calls
  if (currentCommunity) {
    localStorage.setItem('communityId', currentCommunity._id);
  }

  return children;
};

export default CommunityRoute;
