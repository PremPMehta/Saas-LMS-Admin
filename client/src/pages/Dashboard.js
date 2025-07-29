import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
} from '@mui/material';
import {
  People as PeopleIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { useTheme } from '../contexts/ThemeContext';

const Dashboard = () => {
  const { mode } = useTheme();
  
  const stats = [
    {
      title: 'Total Users',
      value: '1,234',
      icon: <PeopleIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      color: '#1976d2',
    },
    {
      title: 'Active Academies',
      value: '56',
      icon: <SchoolIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      color: '#42a5f5',
    },
    {
      title: 'Active Plans',
      value: '89',
      icon: <AssignmentIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      color: '#2196F3',
    },
    {
      title: 'Growth Rate',
      value: '+12.5%',
      icon: <TrendingUpIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      color: '#64b5f6',
    },
  ];

  return (
    <Box sx={{ 
      p: 3,
      backgroundColor: 'background.default',
      minHeight: '100vh',
      color: 'text.primary'
    }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
        Dashboard
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Welcome to BBR Tek Admin Panel. Here's an overview of your system.
      </Typography>

      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: '100%',
                transition: 'transform 0.2s ease-in-out',
                backgroundColor: 'background.paper',
                border: `1px solid ${mode === 'light' ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)'}`,
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: mode === 'light' 
                    ? '0 8px 24px rgba(0,0,0,0.1)'
                    : '0 8px 24px rgba(0,0,0,0.3)',
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 700, color: stat.color }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {stat.title}
                    </Typography>
                  </Box>
                  {stat.icon}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ 
            p: 3, 
            height: 300,
            backgroundColor: 'background.paper',
            border: `1px solid ${mode === 'light' ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)'}`,
          }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'text.primary' }}>
              Recent Activity
            </Typography>
            <Typography variant="body2" color="text.secondary">
              No recent activity to display.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ 
            p: 3, 
            height: 300,
            backgroundColor: 'background.paper',
            border: `1px solid ${mode === 'light' ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)'}`,
          }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'text.primary' }}>
              Quick Actions
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Quick action buttons will be added here.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 