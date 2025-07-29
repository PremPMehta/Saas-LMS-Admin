import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Container,
  CircularProgress,
  Fade,
  Grow,
  Divider,
  Button,
} from '@mui/material';
import {
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  People as PeopleIcon,
  Book as BookIcon,
  TrendingUp as TrendingUpIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useTheme } from '../contexts/ThemeContext';
import KPICard from '../components/dashboard/KPICard';
import AcademiesList from '../components/dashboard/AcademiesList';
import AddAcademyModal from '../components/dashboard/AddAcademyModal';

const DashboardOverview = () => {
  const { mode } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAcademy, setEditingAcademy] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    kpis: {
      totalAcademies: 0,
      totalPlans: 3,
      totalUsers: 5,
      coursesOffered: '~5,000',
    },
    academies: [],
    plans: [
      {
        id: 1,
        name: 'Basic',
        price: '$29',
        period: 'month',
        features: ['Up to 100 students', 'Basic analytics', 'Email support'],
        limits: '1 academy',
        popular: false,
      },
      {
        id: 2,
        name: 'Standard',
        price: '$79',
        period: 'month',
        features: ['Up to 500 students', 'Advanced analytics', 'Priority support', 'Custom branding'],
        limits: '3 academies',
        popular: true,
      },
      {
        id: 3,
        name: 'Premium',
        price: '$199',
        period: 'month',
        features: ['Unlimited students', 'Full analytics suite', '24/7 support', 'White-label solution', 'API access'],
        limits: 'Unlimited academies',
        popular: false,
      },
    ],
  });

  // Fetch academies from backend
  const fetchAcademies = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const response = await fetch('http://localhost:5001/api/academies', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          console.error('Authentication failed - token may be expired');
          // Optionally redirect to login
          return;
        }
        throw new Error(`Failed to fetch academies: ${response.status}`);
      }
      
      const data = await response.json();
      setDashboardData(prev => ({
        ...prev,
        academies: data.data || data,
        kpis: {
          ...prev.kpis,
          totalAcademies: (data.data || data).length,
        },
      }));
    } catch (err) {
      console.error('Error fetching academies:', err);
      // Keep existing data if fetch fails
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAcademies();
  }, []);

  const handleAddAcademy = () => {
    // After modal closes, refresh academies from backend
    fetchAcademies();
  };

  const handleEditAcademy = (academy) => {
    setEditingAcademy(academy);
    setIsEditModalOpen(true);
  };

  const handleUpdateAcademy = () => {
    setIsEditModalOpen(false);
    setEditingAcademy(null);
    fetchAcademies(); // Refresh the list
  };

  const handleDeleteAcademy = (academyId) => {
    setDashboardData(prev => ({
      ...prev,
      academies: prev.academies.filter(academy => academy._id !== academyId),
      kpis: {
        ...prev.kpis,
        totalAcademies: prev.kpis.totalAcademies - 1,
      },
    }));
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
          background: (theme) => theme.palette.mode === 'light'
            ? 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
            : 'linear-gradient(135deg, #1a1a1a 0%, #2d3748 100%)',
        }}
      >
        <CircularProgress 
          size={60} 
          sx={{ 
            color: 'primary.main',
            mb: 2,
          }} 
        />
        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
          Loading your dashboard...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: (theme) => theme.palette.mode === 'light'
          ? 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
          : 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        {/* Page Header */}
        <Fade in timeout={800}>
          <Box sx={{ mb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TrendingUpIcon 
                sx={{ 
                  fontSize: 32, 
                  color: 'primary.main', 
                  mr: 2,
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                }} 
              />
              <Typography 
                variant="h3" 
                component="h1" 
                sx={{ 
                  fontWeight: 800,
                  background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
              >
                Dashboard Overview
              </Typography>
            </Box>
            <Typography 
              variant="h6" 
              color="text.secondary" 
              sx={{ 
                fontWeight: 400,
                maxWidth: 600,
                lineHeight: 1.6,
              }}
            >
              Welcome back! Here's what's happening with your LMS platform. 
              Monitor your academies, track performance, and manage your learning ecosystem.
            </Typography>
          </Box>
        </Fade>

        {/* KPI Cards - All in one line */}
        <Grow in timeout={1000}>
          <Grid container spacing={3} sx={{ mb: 6 }}>
            <Grid item xs={12} sm={6} md={3} lg={3}>
              <KPICard
                title="Total Academies"
                value={dashboardData.kpis.totalAcademies.toString()}
                subtitle="6 active, 2 inactive"
                icon={<SchoolIcon />}
                color="#4CAF50"
                trend="+12%"
                trendDirection="up"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3} lg={3}>
              <KPICard
                title="Total Plans"
                value={dashboardData.kpis.totalPlans.toString()}
                subtitle="Including free and premium tiers"
                icon={<AssignmentIcon />}
                color="#2196F3"
                trend="+5%"
                trendDirection="up"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3} lg={3}>
              <KPICard
                title="Total Users"
                value={dashboardData.kpis.totalUsers.toString()}
                subtitle="2 educators, 2 students"
                icon={<PeopleIcon />}
                color="#FF9800"
                trend="+18%"
                trendDirection="up"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3} lg={3}>
              <KPICard
                title="Courses Offered"
                value={dashboardData.kpis.coursesOffered}
                subtitle="Across all active academies"
                icon={<BookIcon />}
                color="#9C27B0"
                trend="+25%"
                trendDirection="up"
              />
            </Grid>
          </Grid>
        </Grow>

        {/* Academies Data Table - Full Width */}
        <Grow in timeout={1200}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              mb: 4,
              background: (theme) => theme.palette.mode === 'light'
                ? 'rgba(255, 255, 255, 0.9)'
                : 'rgba(26, 26, 26, 0.9)',
              backdropFilter: 'blur(10px)',
              border: (theme) => `1px solid ${theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'}`,
              borderRadius: 3,
              '&:hover': {
                boxShadow: (theme) => theme.palette.mode === 'light'
                  ? '0 8px 32px rgba(0, 0, 0, 0.1)'
                  : '0 8px 32px rgba(0, 0, 0, 0.3)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease-in-out',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <SchoolIcon 
                  sx={{ 
                    fontSize: 28, 
                    color: 'primary.main', 
                    mr: 2,
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                  }} 
                />
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 700,
                    background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Recent Academies
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setIsModalOpen(true)}
                sx={{
                  background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                  borderRadius: 2,
                  px: 3,
                  py: 1.5,
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  textTransform: 'none',
                  boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 24px rgba(25, 118, 210, 0.4)',
                  },
                }}
              >
                Add Academy
              </Button>
            </Box>
                          <AcademiesList 
                academies={dashboardData.academies} 
                onAcademyUpdate={handleEditAcademy}
                onAcademyDelete={handleDeleteAcademy}
              />
          </Paper>
        </Grow>

        {/* Subscription Plans - Horizontal Cards */}
        <Grow in timeout={1400}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <AssignmentIcon 
                sx={{ 
                  fontSize: 28, 
                  color: 'primary.main', 
                  mr: 2,
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                }} 
              />
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Subscription Plans
              </Typography>
            </Box>
            <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
              {dashboardData.plans.map((plan, index) => (
                <Grid item xs={12} sm={6} md={4} key={plan.id} sx={{ minWidth: { md: 320 } }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      height: '100%',
                      minHeight: 280,
                      background: (theme) => theme.palette.mode === 'light'
                        ? 'rgba(255, 255, 255, 0.9)'
                        : 'rgba(26, 26, 26, 0.9)',
                      backdropFilter: 'blur(10px)',
                      border: (theme) => `1px solid ${theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'}`,
                      borderRadius: 3,
                      display: 'flex',
                      flexDirection: 'column',
                      '&:hover': {
                        boxShadow: (theme) => theme.palette.mode === 'light'
                          ? '0 8px 32px rgba(0, 0, 0, 0.1)'
                          : '0 8px 32px rgba(0, 0, 0, 0.3)',
                        transform: 'translateY(-4px)',
                      },
                      transition: 'all 0.3s ease-in-out',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flex: '0 0 auto' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 48,
                            height: 48,
                            borderRadius: '50%',
                            background: plan.popular 
                              ? 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)'
                              : 'rgba(25, 118, 210, 0.1)',
                          }}
                        >
                          <AssignmentIcon sx={{ color: plan.popular ? 'white' : 'primary.main' }} />
                        </Box>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                            {plan.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                            {plan.limits}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography 
                          variant="h4" 
                          sx={{ 
                            fontWeight: 800,
                            background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 0.5,
                          }}
                        >
                          {plan.price}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                          per {plan.period}
                        </Typography>
                      </Box>
                    </Box>

                    <Divider sx={{ my: 2, opacity: 0.6, flex: '0 0 auto' }} />

                    <Box sx={{ mb: 2, flex: '1 1 auto' }}>
                      {plan.features.slice(0, 3).map((feature, featureIndex) => (
                        <Box key={featureIndex} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Box
                            sx={{
                              width: 16,
                              height: 16,
                              borderRadius: '50%',
                              background: 'linear-gradient(45deg, #4CAF50, #66BB6A)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mr: 1.5,
                              flexShrink: 0,
                            }}
                          >
                            <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: 'white' }} />
                          </Box>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                            {feature}
                          </Typography>
                        </Box>
                      ))}
                      {plan.features.length > 3 && (
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                          +{plan.features.length - 3} more features
                        </Typography>
                      )}
                    </Box>

                    {plan.popular && (
                      <Box sx={{ mt: 'auto', pt: 2, flex: '0 0 auto' }}>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                            color: 'white',
                            px: 2,
                            py: 0.5,
                            borderRadius: 1,
                            fontWeight: 600,
                            fontSize: '0.75rem',
                          }}
                        >
                          Most Popular
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grow>
      </Container>

      {/* Add Academy Modal */}
      <AddAcademyModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddAcademy}
      />

      {/* Edit Academy Modal */}
      {editingAcademy && (
        <AddAcademyModal
          open={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingAcademy(null);
          }}
          onSave={handleUpdateAcademy}
          editingAcademy={editingAcademy}
        />
      )}
    </Box>
  );
};

export default DashboardOverview; 