import React, { useEffect, useState, useRef } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import communityAuthApi from '../utils/communityAuthApi';
import { validateCommunityNameForAPI } from '../utils/securityUtils';
import { apiUrl } from '../config/api';

const CommunityRoute = ({ children }) => {
  const { communityName } = useParams();
  const [isValidating, setIsValidating] = useState(true);
  const [isValidCommunity, setIsValidCommunity] = useState(false);
  const [currentCommunity, setCurrentCommunity] = useState(null);
  const hasValidated = useRef(false);

  // Set community ID in localStorage for API calls (only once)
  useEffect(() => {
    if (currentCommunity && localStorage.getItem('communityId') !== currentCommunity._id) {
      localStorage.setItem('communityId', currentCommunity._id);
    }
  }, [currentCommunity]);

  useEffect(() => {
    const validateCommunity = async () => {
      try {
        console.log('🔍 CommunityRoute validation started for:', communityName);
        
        // STEP 1: SECURITY CHECK - Validate community name format first
        if (!validateCommunityNameForAPI(communityName, 'CommunityRoute')) {
          console.log('🚫 Invalid community name format, redirecting to 404');
          setIsValidating(false);
          setIsValidCommunity(false);
          return;
        }

        // STEP 2: Check if community actually exists in database
        console.log('🔍 Checking if community exists in database for:', communityName);
        try {
          const response = await fetch(apiUrl(`/api/communities/check/${communityName}`), {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });

          console.log('🔍 Database check response status:', response.status);

          if (!response.ok) {
            console.log('🚫 Community not found in database, status:', response.status);
            setIsValidating(false);
            setIsValidCommunity(false);
            return;
          }

          const communityData = await response.json();
          console.log('🔍 Database check response data:', communityData);
          
          if (!communityData.success || !communityData.community) {
            console.log('🚫 Community not found in database response');
            setIsValidating(false);
            setIsValidCommunity(false);
            return;
          }

          console.log('✅ Community found in database:', communityData.community.name);
          setCurrentCommunity(communityData.community);
        } catch (dbError) {
          console.error('❌ Error checking community in database:', dbError);
          console.log('🚫 Database check failed, redirecting to 404');
          setIsValidating(false);
          setIsValidCommunity(false);
          return;
        }

        // STEP 3: Check authentication after community validation
        console.log('✅ Community exists in database, checking authentication...');
        
        // Check if user is authenticated (either community admin or community user)
        const isCommunityAdmin = communityAuthApi.isAuthenticated();
        const isCommunityUser = !!(localStorage.getItem('communityUserToken') && localStorage.getItem('communityUser'));
        
        if (!isCommunityAdmin && !isCommunityUser) {
          console.log('🚫 User not authenticated, redirecting to login');
          setIsValidating(false);
          setIsValidCommunity(false);
          return;
        }
        
        console.log('✅ User is authenticated, community validation successful');
        setIsValidCommunity(true);
      } catch (error) {
        console.error('Error validating community:', error);
        setIsValidCommunity(false);
      } finally {
        setIsValidating(false);
      }
    };

    // Only validate if we haven't already validated for this community
    if (!hasValidated.current) {
      validateCommunity();
      hasValidated.current = true;
    } else {
      console.log('Community already validated, skipping validation');
      setIsValidating(false);
      setIsValidCommunity(true);
    }
  }, [communityName]);

  // Don't render children until validation is complete
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
    // Redirect to 404 page for invalid community names or authentication issues
    return <Navigate to="/404" replace />;
  }

  // Only render children after successful validation
  return children;
};

export default CommunityRoute;
