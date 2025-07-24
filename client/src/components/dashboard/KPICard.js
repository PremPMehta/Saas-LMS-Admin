import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Avatar,
} from '@mui/material';

const KPICard = ({ title, value, subtitle, icon, color = '#1976d2' }) => {
  return (
    <Card
      sx={{
        height: '100%',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
        cursor: 'pointer',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography
              variant="h4"
              component="div"
              sx={{
                fontWeight: 700,
                color: color,
                fontSize: { xs: '1.75rem', sm: '2rem' },
                lineHeight: 1.2,
              }}
            >
              {value}
            </Typography>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                fontSize: { xs: '0.875rem', sm: '1rem' },
                mt: 0.5,
              }}
            >
              {title}
            </Typography>
          </Box>
          <Avatar
            sx={{
              bgcolor: color,
              width: { xs: 48, sm: 56 },
              height: { xs: 48, sm: 56 },
              '& .MuiSvgIcon-root': {
                fontSize: { xs: '1.5rem', sm: '1.75rem' },
              },
            }}
          >
            {icon}
          </Avatar>
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            fontWeight: 500,
          }}
        >
          {subtitle}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default KPICard; 