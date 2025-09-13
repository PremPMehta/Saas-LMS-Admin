import React, { useEffect, useState, useRef } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import communityAuthApi from '../utils/communityAuthApi';

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
        console.log('CommunityRoute validation started for:', communityName);
        
        // Check if user is authenticated (either community admin or community user)
        const isCommunityAdmin = communityAuthApi.isAuthenticated();
        const isCommunityUser = !!(localStorage.getItem('communityUserToken') && localStorage.getItem('communityUserData'));
        
        if (!isCommunityAdmin && !isCommunityUser) {
          console.log('User not authenticated, redirecting to login');
          setIsValidating(false);
          return;
        }
        
        console.log('Authentication status:', { isCommunityAdmin, isCommunityUser });
        
        console.log('User is authenticated, proceeding with community validation');

        // Get current community from auth (try both admin and user)
        let community = communityAuthApi.getCurrentCommunity();
        
        // If no community from admin auth, try community user auth
        if (!community && isCommunityUser) {
          const communityUserData = localStorage.getItem('communityUserData');
          if (communityUserData) {
            try {
              const userData = JSON.parse(communityUserData);
              // For community users, we need to get the community data
              // For now, we'll use a hardcoded community for Crypto Manji Academy
              if (communityName === 'crypto-manji-academy') {
                community = {
                  _id: '68bae2a8807f3a3bb8ac6307',
                  name: 'Crypto Manji Academy',
                  id: '68bae2a8807f3a3bb8ac6307'
                };
                console.log('Using hardcoded community for community user:', community);
              }
            } catch (e) {
              console.error('Error parsing community user data:', e);
            }
          }
        }
        
        console.log('Current community from auth:', community);
        
        if (!community) {
          console.log('No community data found, redirecting to login');
          setIsValidating(false);
          return;
        }

        // Convert community name to URL format for comparison
        const communityUrlName = community.name.toLowerCase().replace(/\s+/g, '-');
        console.log('Community validation:', {
          urlCommunity: communityName,
          authCommunity: communityUrlName,
          originalName: community.name,
          match: communityUrlName === communityName
        });
        
        // Validate that the URL community name matches the authenticated user's community
        if (communityUrlName === communityName) {
          console.log('Community validation successful');
          setCurrentCommunity(community);
          setIsValidCommunity(true);
        } else {
          console.log('Community name mismatch, redirecting to login');
          console.log('URL community:', communityName);
          console.log('Auth community:', communityUrlName);
          console.log('Original name:', community.name);
          setIsValidCommunity(false);
        }
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

  return children;
};

export default CommunityRoute;
