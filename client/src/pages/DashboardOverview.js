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
} from '@mui/material';
import {
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  People as PeopleIcon,
  Book as BookIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import KPICard from '../components/dashboard/KPICard';
import AcademiesList from '../components/dashboard/AcademiesList';
import PlansList from '../components/dashboard/PlansList';

const DashboardOverview = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [dashboardData] = useState({
    kpis: {
      totalAcademies: 8,
      totalPlans: 3,
      totalUsers: 5,
      coursesOffered: '~5,000',
    },
    academies: [
      {
        id: 1,
        name: 'Global Tech Academy',
        subdomain: 'globaltech',
        plan: 'Premium',
        status: 'Active',
        createdAt: '2024-01-15',
        students: 1250,
        courses: 45,
      },
      {
        id: 2,
        name: 'Digital Marketing Institute',
        subdomain: 'digitalmarketing',
        plan: 'Standard',
        status: 'Active',
        createdAt: '2024-02-20',
        students: 890,
        courses: 32,
      },
      {
        id: 3,
        name: 'Data Science Hub',
        subdomain: 'datascience',
        plan: 'Premium',
        status: 'Active',
        createdAt: '2024-03-10',
        students: 2100,
        courses: 78,
      },
      {
        id: 4,
        name: 'Creative Arts Academy',
        subdomain: 'creativearts',
        plan: 'Basic',
        status: 'Inactive',
        createdAt: '2024-01-30',
        students: 320,
        courses: 15,
      },
    ],
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

  // Placeholder for future API integration
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // TODO: Replace with actual API call
        // const response = await fetch('/api/dashboard');
        // const data = await response.json();
        // setDashboardData(data);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
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
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
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

        {/* KPI Cards */}
        <Grow in timeout={1000}>
          <Grid container spacing={4} sx={{ mb: 6 }}>
            <Grid item xs={12} sm={6} md={3}>
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
            <Grid item xs={12} sm={6} md={3}>
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
            <Grid item xs={12} sm={6} md={3}>
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
            <Grid item xs={12} sm={6} md={3}>
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

        {/* Dashboard Lists */}
        <Grid container spacing={4}>
          {/* Recent Academies */}
          <Grid item xs={12} lg={6}>
            <Grow in timeout={1200}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: 'fit-content',
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 3,
                  '&:hover': {
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease-in-out',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
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
                <AcademiesList academies={dashboardData.academies} />
              </Paper>
            </Grow>
          </Grid>

          {/* Active Plans */}
          <Grid item xs={12} lg={6}>
            <Grow in timeout={1400}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: 'fit-content',
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 3,
                  '&:hover': {
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease-in-out',
                }}
              >
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
                <PlansList plans={dashboardData.plans} />
              </Paper>
            </Grow>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default DashboardOverview; 