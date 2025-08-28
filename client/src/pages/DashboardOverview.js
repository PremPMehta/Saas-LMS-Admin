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
  Alert,
} from '@mui/material';
import {
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  People as PeopleIcon,
  Book as BookIcon,
  TrendingUp as TrendingUpIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useTheme } from '../contexts/ThemeContext';
import KPICard from '../components/dashboard/KPICard';
import AcademiesList from '../components/dashboard/AcademiesList';
import AddAcademyModal from '../components/dashboard/AddAcademyModal';

const DashboardOverview = () => {
  const { mode } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [isPlansLoading, setIsPlansLoading] = useState(false);
  const [plansError, setPlansError] = useState(null);
  const [plansSuccess, setPlansSuccess] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAcademy, setEditingAcademy] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    kpis: {
      totalAcademies: 0,
      totalPlans: 0,
      totalUsers: 5,
      coursesOffered: '~5,000',
    },
    academies: [],
    plans: [],
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

              const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/academies`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          console.error('Authentication failed - token may be expired');
          // Clear invalid token and redirect to login
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return;
        }
        throw new Error(`Failed to fetch academies: ${response.status}`);
      }
      
      const data = await response.json();
      const academies = data.data || data;
      
      setDashboardData(prev => ({
        ...prev,
        academies: academies,
        kpis: {
          ...prev.kpis,
          totalAcademies: academies.length,
        },
      }));
    } catch (err) {
      console.error('Error fetching academies:', err);
      // Keep existing data if fetch fails
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch subscription plans from backend
  const fetchSubscriptionPlans = async () => {
    setIsPlansLoading(true);
    setPlansError(null);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No authentication token found');
        setPlansError('Authentication token not found');
        return;
      }

              const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/plans`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          console.error('Authentication failed - token may be expired');
          // Clear invalid token and redirect to login
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return;
        }
        throw new Error(`Failed to fetch plans: ${response.status}`);
      }
      
      const data = await response.json();
      const plans = data.data?.plans || data.plans || [];
      
      // Transform the plans data to match the expected format
      const transformedPlans = plans.map(plan => ({
        id: plan._id || plan.id,
        name: plan.name,
        price: plan.price,
        period: plan.period,
        features: plan.features || [],
        limits: plan.limits || `${plan.maxAcademies || 1} academy${plan.maxAcademies > 1 ? 's' : ''}`,
        popular: plan.popular || false,
      }));

      setDashboardData(prev => ({
        ...prev,
        plans: transformedPlans,
        kpis: {
          ...prev.kpis,
          totalPlans: transformedPlans.length,
        },
      }));
      
      // Set success message
      setPlansSuccess(`Successfully loaded ${transformedPlans.length} subscription plans`);
      
      // Clear success message after 3 seconds
      setTimeout(() => setPlansSuccess(null), 3000);
    } catch (err) {
      console.error('Error fetching subscription plans:', err);
      setPlansError(err.message);
      // If no plans exist, create some default plans as fallback
      const defaultPlans = [
        {
          id: 'default-basic',
          name: 'Basic',
          price: '$29',
          period: 'month',
          features: ['Up to 100 students', 'Basic analytics', 'Email support'],
          limits: '1 academy',
          popular: false,
        },
        {
          id: 'default-standard',
          name: 'Standard',
          price: '$79',
          period: 'month',
          features: ['Up to 500 students', 'Advanced analytics', 'Priority support', 'Custom branding'],
          limits: '3 academies',
          popular: true,
        },
        {
          id: 'default-premium',
          name: 'Premium',
          price: '$199',
          period: 'month',
          features: ['Unlimited students', 'Full analytics suite', '24/7 support', 'White-label solution', 'API access'],
          limits: 'Unlimited academies',
          popular: false,
        },
      ];
      
      setDashboardData(prev => ({
        ...prev,
        plans: defaultPlans,
        kpis: {
          ...prev.kpis,
          totalPlans: defaultPlans.length,
        },
      }));
    } finally {
      setIsPlansLoading(false);
    }
  };

  useEffect(() => {
    fetchAcademies();
    fetchSubscriptionPlans();
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

  // Function to refresh plans (can be called from other components)
  const refreshPlans = () => {
    fetchSubscriptionPlans();
  };

  // Function to handle plan updates (can be called from other components)
  const handlePlanUpdate = () => {
    refreshPlans();
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
            <Grid size={{xs:12,sm:6, lg:3}}>
              <KPICard
                title="Total Academies"
                value={dashboardData.kpis.totalAcademies.toString()}
                description={`${dashboardData.academies.filter(a => a.status === 'Active').length} active, ${dashboardData.academies.filter(a => a.status === 'Inactive').length} inactive`}
                icon={<SchoolIcon />}
                color="#4CAF50"
              />
            </Grid>
            <Grid size={{xs:12,sm:6, lg:3}}>
              <KPICard
                title="Total Plans"
                value={dashboardData.kpis.totalPlans.toString()}
                description={`${dashboardData.plans.filter(p => p.popular).length} popular, ${dashboardData.plans.length - dashboardData.plans.filter(p => p.popular).length} standard`}
                icon={<AssignmentIcon />}
                color="#2196F3"
              />
            </Grid>
            <Grid size={{xs:12,sm:6, lg:3}}>
              <KPICard
                title="Total Users"
                value={dashboardData.kpis.totalUsers.toString()}
                description="2 educators, 2 students"
                icon={<PeopleIcon />}
                color="#FF9800"
              />
            </Grid>
            <Grid size={{xs:12,sm:6, lg:3}}>
              <KPICard
                title="Courses Offered"
                value={dashboardData.kpis.coursesOffered}
                description="Across all active academies"
                icon={<BookIcon />}
                color="#9C27B0"
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
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={refreshPlans}
                disabled={isPlansLoading}
                sx={{
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  textTransform: 'none',
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  '&:hover': {
                    borderColor: 'primary.dark',
                    backgroundColor: 'rgba(25, 118, 210, 0.04)',
                  },
                }}
              >
                {isPlansLoading ? 'Refreshing...' : 'Refresh'}
              </Button>
            </Box>
            
            {/* Success/Error Messages */}
            {plansSuccess && (
              <Alert severity="success" sx={{ mb: 3, maxWidth: 'fit-content' }}>
                {plansSuccess}
              </Alert>
            )}
            {plansError && (
              <Alert severity="error" sx={{ mb: 3, maxWidth: 'fit-content' }}>
                {plansError}
              </Alert>
            )}
            <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
              {isPlansLoading ? (
                // Loading state for plans
                <Grid item xs={12} sx={{ textAlign: 'center', py: 6 }}>
                  <CircularProgress size={40} sx={{ mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    Loading subscription plans...
                  </Typography>
                </Grid>
              ) : dashboardData.plans.length === 0 ? (
                // Empty state for plans
                <Grid item xs={12} sx={{ textAlign: 'center', py: 6 }}>
                  <AssignmentIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                  <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500, mb: 1 }}>
                    No subscription plans found
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Create subscription plans to get started
                  </Typography>
                  {plansError && (
                    <Alert severity="error" sx={{ maxWidth: 400, mx: 'auto' }}>
                      {plansError}
                    </Alert>
                  )}
                </Grid>
              ) : (
                // Render plans
                dashboardData.plans.map((plan, index) => (
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
                ))
              )}
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