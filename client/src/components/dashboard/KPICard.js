import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Avatar,
  Chip,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';

const KPICard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  color = '#1976d2',
  trend,
  trendDirection = 'up'
}) => {
  const getTrendColor = (direction) => {
    return direction === 'up' ? '#4CAF50' : '#F44336';
  };

  const getTrendIcon = (direction) => {
    return direction === 'up' ? <TrendingUpIcon /> : <TrendingDownIcon />;
  };

  return (
    <Card
      sx={{
        height: '100%',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: 3,
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg, ${color} 0%, ${color}80 100%)`,
          transform: 'scaleX(0)',
          transition: 'transform 0.3s ease-in-out',
        },
        '&:hover': {
          transform: 'translateY(-8px) scale(1.02)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
          '&::before': {
            transform: 'scaleX(1)',
          },
          '& .kpi-icon': {
            transform: 'scale(1.1) rotate(5deg)',
          },
          '& .kpi-value': {
            transform: 'scale(1.05)',
          },
        },
        cursor: 'pointer',
      }}
    >
      <CardContent sx={{ p: 3.5, position: 'relative' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography
                variant="h3"
                component="div"
                className="kpi-value"
                sx={{
                  fontWeight: 800,
                  color: color,
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                  lineHeight: 1.1,
                  transition: 'transform 0.3s ease-in-out',
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
              >
                {value}
              </Typography>
              {trend && (
                <Chip
                  icon={getTrendIcon(trendDirection)}
                  label={trend}
                  size="small"
                  sx={{
                    ml: 1,
                    backgroundColor: getTrendColor(trendDirection),
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    height: 24,
                    '& .MuiChip-icon': {
                      color: 'white',
                      fontSize: '1rem',
                    },
                  }}
                />
              )}
            </Box>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                fontSize: { xs: '0.875rem', sm: '1rem' },
                mb: 0.5,
                textShadow: '0 1px 2px rgba(0,0,0,0.05)',
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                fontWeight: 500,
                opacity: 0.8,
              }}
            >
              {subtitle}
            </Typography>
          </Box>
          <Avatar
            className="kpi-icon"
            sx={{
              bgcolor: color,
              width: { xs: 56, sm: 64, md: 72 },
              height: { xs: 56, sm: 64, md: 72 },
              boxShadow: `0 8px 24px ${color}40`,
              transition: 'all 0.3s ease-in-out',
              '& .MuiSvgIcon-root': {
                fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
              },
            }}
          >
            {icon}
          </Avatar>
        </Box>
        
        {/* Decorative gradient overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '100px',
            height: '100px',
            background: `radial-gradient(circle, ${color}10 0%, transparent 70%)`,
            borderRadius: '50%',
            transform: 'translate(30px, -30px)',
            pointerEvents: 'none',
          }}
        />
      </CardContent>
    </Card>
  );
};

export default KPICard; 