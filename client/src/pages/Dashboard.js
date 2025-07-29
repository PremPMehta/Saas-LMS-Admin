import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  Chip,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  People as PeopleIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
  LocalFireDepartment as PopularIcon,
  Check as CheckIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useTheme } from '../contexts/ThemeContext';
import KPICard from '../components/dashboard/KPICard';
import axios from 'axios';

// Configure axios base URL
axios.defaults.baseURL = 'http://localhost:5001';

const Dashboard = () => {
  const { mode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    users: { total: 0, active: 0, inactive: 0 },
    academies: { totalAcademies: 0, activeAcademies: 0, inactiveAcademies: 0 },
    plans: { totalPlans: 0, activePlans: 0, inactivePlans: 0 },
  });
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(true);

  // Fetch dashboard statistics
  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch user stats
      const userResponse = await axios.get('/api/users/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Fetch academy stats
      const academyResponse = await axios.get('/api/academies/stats/summary', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Fetch plan stats
      const planResponse = await axios.get('/api/plans/stats/summary', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setStats({
        users: userResponse.data.data,
        academies: academyResponse.data.data,
        plans: planResponse.data.data,
      });
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  // Fetch subscription plans
  const fetchSubscriptionPlans = async () => {
    try {
      setPlansLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/plans?limit=6', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubscriptionPlans(response.data.data.plans || []);
    } catch (err) {
      console.error('Error fetching subscription plans:', err);
    } finally {
      setPlansLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
    fetchSubscriptionPlans();
  }, []);

  const kpiData = [
    {
      title: 'Total Users',
      value: stats.users.total || 0,
      description: `${stats.users.active || 0} active users`,
      icon: <PeopleIcon />,
      color: 'primary',
      trend: '+12.5%',
      trendDirection: 'up'
    },
    {
      title: 'Active Academies',
      value: stats.academies.activeAcademies || 0,
      description: `${stats.academies.totalAcademies || 0} total academies`,
      icon: <SchoolIcon />,
      color: 'success',
      trend: '+8.2%',
      trendDirection: 'up'
    },
    {
      title: 'Subscription Plans',
      value: stats.plans.activePlans || 0,
      description: `${stats.plans.totalPlans || 0} total plans available`,
      icon: <AssignmentIcon />,
      color: 'info',
      trend: '+15.3%',
      trendDirection: 'up'
    },
    {
      title: 'Growth Rate',
      value: '+12.5%',
      description: 'Monthly growth rate',
      icon: <TrendingUpIcon />,
      color: 'warning',
      trend: '+2.1%',
      trendDirection: 'up'
    },
  ];

  const getPlanGradient = (planName) => {
    const name = planName.toLowerCase();
    if (name.includes('basic')) return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    if (name.includes('pro')) return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
    if (name.includes('premium')) return 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
    if (name.includes('enterprise')) return 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)';
    return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  };

  const getPlanIcon = (planName) => {
    const name = planName.toLowerCase();
    if (name.includes('basic')) return <AssignmentIcon />;
    if (name.includes('pro')) return <StarIcon />;
    if (name.includes('premium')) return <PopularIcon />;
    if (name.includes('enterprise')) return <CheckIcon />;
    return <AssignmentIcon />;
  };

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

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {kpiData.map((kpi, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <KPICard
              title={kpi.title}
              value={kpi.value}
              description={kpi.description}
              icon={kpi.icon}
              color={kpi.color}
              trend={kpi.trend}
              trendDirection={kpi.trendDirection}
              isLoading={loading}
            />
          </Grid>
        ))}
      </Grid>

      {/* Subscription Plans Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
            Subscription Plans
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
              },
            }}
          >
            Add New Plan
          </Button>
        </Box>

        {plansLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {subscriptionPlans.map((plan) => (
              <Grid item xs={12} sm={6} md={4} key={plan._id}>
                <Card
                  sx={{
                    height: '100%',
                    background: getPlanGradient(plan.name),
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'rgba(0,0,0,0.1)',
                      zIndex: 1,
                    },
                  }}
                >
                  <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 2 }}>
                    {/* Header */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getPlanIcon(plan.name)}
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {plan.name}
                        </Typography>
                      </Box>
                      {plan.popular && (
                        <Chip
                          label="Popular"
                          size="small"
                          sx={{
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            color: 'white',
                            fontWeight: 600,
                          }}
                        />
                      )}
                    </Box>

                    {/* Price */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                        ${plan.price}/{plan.period}
                      </Typography>
                    </Box>

                    {/* Features */}
                    <Box sx={{ flex: 1, mb: 3 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, opacity: 0.9 }}>
                        Plan Features
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {plan.features.slice(0, 3).map((feature, index) => (
                          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CheckIcon sx={{ fontSize: 16, opacity: 0.8 }} />
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                              {feature}
                            </Typography>
                          </Box>
                        ))}
                        {plan.features.length > 3 && (
                          <Typography variant="body2" sx={{ opacity: 0.7, fontStyle: 'italic' }}>
                            +{plan.features.length - 3} more features
                          </Typography>
                        )}
                      </Box>
                    </Box>

                    {/* Limits */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Chip 
                        label={`${plan.maxAcademies} Academies`} 
                        size="small" 
                        sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }} 
                      />
                      <Chip 
                        label={`${plan.maxStudentsPerAcademy} Students/Academy`} 
                        size="small" 
                        sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }} 
                      />
                    </Box>

                    {/* Status */}
                    <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                      <Chip
                        label={plan.status}
                        size="small"
                        sx={{
                          backgroundColor: plan.status === 'Active' ? 'rgba(76, 175, 80, 0.8)' : 'rgba(244, 67, 54, 0.8)',
                          color: 'white',
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {!plansLoading && subscriptionPlans.length === 0 && (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No subscription plans found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create your first subscription plan to get started.
            </Typography>
          </Paper>
        )}
      </Box>

      {/* Additional Dashboard Sections */}
      <Grid container spacing={3}>
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