import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Avatar,
  Skeleton,
} from '@mui/material';
import { useTheme } from '../../contexts/ThemeContext';

const KPICard = ({ 
  title, 
  value, 
  description, 
  icon, 
  color = 'primary',
  isLoading = false
}) => {
  const { mode } = useTheme();
  
  const getColorValue = (colorName) => {
    const colorMap = {
      primary: '#1976d2',
      secondary: '#9c27b0',
      success: '#4CAF50',
      error: '#F44336',
      warning: '#FF9800',
      info: '#2196F3',
    };
    return colorMap[colorName] || colorName;
  };

  const colorValue = getColorValue(color);
  


  if (isLoading) {
    return (
      <Card
        sx={{
          height: '100%',
          background: (theme) => theme.palette.mode === 'light'
            ? 'rgba(255, 255, 255, 0.8)'
            : 'rgba(26, 26, 26, 0.8)',
          backdropFilter: 'blur(20px)',
          border: '1px solid',
          borderColor: (theme) => theme.palette.mode === 'light' 
            ? 'rgba(0, 0, 0, 0.08)' 
            : 'rgba(255, 255, 255, 0.08)',
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="60%" height={48} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="80%" height={24} sx={{ mb: 0.5 }} />
              <Skeleton variant="text" width="60%" height={20} />
            </Box>
            <Skeleton variant="circular" width={56} height={56} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        height: '100%',
        background: (theme) => theme.palette.mode === 'light'
          ? 'rgba(255, 255, 255, 0.8)'
          : 'rgba(26, 26, 26, 0.8)',
        backdropFilter: 'blur(20px)',
        border: '1px solid',
        borderColor: (theme) => theme.palette.mode === 'light' 
          ? 'rgba(0, 0, 0, 0.08)' 
          : 'rgba(255, 255, 255, 0.08)',
        borderRadius: 3,
        transition: 'all 0.3s ease-in-out',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: `linear-gradient(90deg, ${colorValue} 0%, ${colorValue}80 100%)`,
          transform: 'scaleX(0)',
          transition: 'transform 0.3s ease-in-out',
        },
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) => theme.palette.mode === 'light'
            ? '0 12px 32px rgba(0, 0, 0, 0.1)'
            : '0 12px 32px rgba(0, 0, 0, 0.3)',
          '&::before': {
            transform: 'scaleX(1)',
          },
          '& .kpi-icon': {
            transform: 'scale(1.05)',
          },
          '& .kpi-value': {
            transform: 'scale(1.02)',
          },
        },
      }}
    >
      <CardContent sx={{ p: 3, position: 'relative' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography
                variant="h3"
                component="div"
                className="kpi-value"
                sx={{
                  fontWeight: 700,
                  color: colorValue,
                  fontSize: { xs: '2rem', sm: '2.25rem', md: '2.5rem' },
                  lineHeight: 1.1,
                  transition: 'transform 0.3s ease-in-out',
                }}
              >
                {value}
              </Typography>
            </Box>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                fontSize: '1rem',
                mb: 0.5,
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontSize: '0.875rem',
                fontWeight: 500,
                lineHeight: 1.4,
              }}
            >
              {description}
            </Typography>
          </Box>
          <Avatar
            className="kpi-icon"
            sx={{
              backgroundColor: colorValue,
              width: 56,
              height: 56,
              boxShadow: `0 4px 12px ${colorValue}40`,
              transition: 'transform 0.3s ease-in-out',
              '& .MuiSvgIcon-root': {
                fontSize: '1.75rem',
                color: 'white',
              },
            }}
          >
            {icon}
          </Avatar>
        </Box>
        
        {/* Subtle gradient overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '80px',
            height: '80px',
            background: `radial-gradient(circle, ${colorValue}08 0%, transparent 70%)`,
            borderRadius: '50%',
            transform: 'translate(20px, -20px)',
            pointerEvents: 'none',
          }}
        />
      </CardContent>
    </Card>
  );
};

export default KPICard; 