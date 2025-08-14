import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LoginTransition = ({ user, redirectPath, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Start the transition sequence
    const timer = setTimeout(() => {
      setShowVideo(true);
    }, 500);

    // Simulate loading progress
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    return () => {
      clearTimeout(timer);
      clearInterval(progressTimer);
    };
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      // Wait a bit more for video to complete, then redirect
      const redirectTimer = setTimeout(() => {
        if (onComplete) {
          onComplete();
        } else {
          navigate(redirectPath, { replace: true });
        }
      }, 2000);

      return () => clearTimeout(redirectTimer);
    }
  }, [progress, redirectPath, navigate, onComplete]);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: '#000',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Background Video */}
      {showVideo && (
        <video
          autoPlay
          muted
          playsInline
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
          }}
        >
          <source src="/5716233-uhd_2160_3840_30fps.mp4" type="video/mp4" />
        </video>
      )}

      {/* Dark overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          zIndex: 1,
        }}
      />

      {/* Content */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          color: 'white',
        }}
      >
        {/* Welcome Message */}
        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            mb: 2,
            textShadow: '0 2px 4px rgba(0,0,0,0.8)',
            animation: 'fadeInUp 1s ease-out',
            '@keyframes fadeInUp': {
              '0%': {
                opacity: 0,
                transform: 'translateY(30px)',
              },
              '100%': {
                opacity: 1,
                transform: 'translateY(0)',
              },
            },
          }}
        >
          Welcome, {user?.firstName || 'Admin'}!
        </Typography>

        {/* Subtitle */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: 400,
            mb: 4,
            opacity: 0.9,
            textShadow: '0 1px 2px rgba(0,0,0,0.8)',
            animation: 'fadeInUp 1s ease-out 0.3s both',
            '@keyframes fadeInUp': {
              '0%': {
                opacity: 0,
                transform: 'translateY(30px)',
              },
              '100%': {
                opacity: 1,
                transform: 'translateY(0)',
              },
            },
          }}
        >
          Initializing your Command Center...
        </Typography>

        {/* Progress Bar */}
        <Box
          sx={{
            width: 300,
            height: 4,
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: 2,
            overflow: 'hidden',
            mb: 3,
            animation: 'fadeInUp 1s ease-out 0.6s both',
            '@keyframes fadeInUp': {
              '0%': {
                opacity: 0,
                transform: 'translateY(30px)',
              },
              '100%': {
                opacity: 1,
                transform: 'translateY(0)',
              },
            },
          }}
        >
          <Box
            sx={{
              width: `${progress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #ff6f0c 0%, #ff8f2e 100%)',
              borderRadius: 2,
              transition: 'width 0.3s ease',
            }}
          />
        </Box>

        {/* Progress Text */}
        <Typography
          variant="body1"
          sx={{
            opacity: 0.8,
            animation: 'fadeInUp 1s ease-out 0.9s both',
            '@keyframes fadeInUp': {
              '0%': {
                opacity: 0,
                transform: 'translateY(30px)',
              },
              '100%': {
                opacity: 1,
                transform: 'translateY(0)',
              },
            },
          }}
        >
          {progress}% Complete
        </Typography>

        {/* Loading Spinner */}
        {progress < 100 && (
          <Box sx={{ mt: 3 }}>
            <CircularProgress
              size={40}
              sx={{
                color: '#ff6f0c',
                animation: 'fadeInUp 1s ease-out 1.2s both',
                '@keyframes fadeInUp': {
                  '0%': {
                    opacity: 0,
                    transform: 'translateY(30px)',
                  },
                  '100%': {
                    opacity: 1,
                    transform: 'translateY(0)',
                  },
                },
              }}
            />
          </Box>
        )}
      </Box>

      {/* Company Logo */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 40,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2,
          animation: 'fadeInUp 1s ease-out 1.5s both',
          '@keyframes fadeInUp': {
            '0%': {
              opacity: 0,
              transform: 'translateX(-50%) translateY(30px)',
            },
            '100%': {
              opacity: 1,
              transform: 'translateX(-50%) translateY(0)',
            },
          },
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: '#ff6f0c',
            textShadow: '0 2px 4px rgba(0,0,0,0.8)',
          }}
        >
          BBR Tek
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginTransition;
