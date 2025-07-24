import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Container,
  CircularProgress,
} from '@mui/material';
import {
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  People as PeopleIcon,
  Book as BookIcon,
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
      },
      {
        id: 2,
        name: 'Digital Marketing Institute',
        subdomain: 'digitalmarketing',
        plan: 'Standard',
        status: 'Active',
        createdAt: '2024-02-20',
      },
      {
        id: 3,
        name: 'Data Science Hub',
        subdomain: 'datascience',
        plan: 'Premium',
        status: 'Active',
        createdAt: '2024-03-10',
      },
      {
        id: 4,
        name: 'Creative Arts Academy',
        subdomain: 'creativearts',
        plan: 'Basic',
        status: 'Inactive',
        createdAt: '2024-01-30',
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
      },
      {
        id: 2,
        name: 'Standard',
        price: '$79',
        period: 'month',
        features: ['Up to 500 students', 'Advanced analytics', 'Priority support', 'Custom branding'],
        limits: '3 academies',
      },
      {
        id: 3,
        name: 'Premium',
        price: '$199',
        period: 'month',
        features: ['Unlimited students', 'Full analytics suite', '24/7 support', 'White-label solution', 'API access'],
        limits: 'Unlimited academies',
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
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          Dashboard Overview
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back! Here's what's happening with your LMS platform.
        </Typography>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Total Academies"
            value={dashboardData.kpis.totalAcademies.toString()}
            subtitle="6 active"
            icon={<SchoolIcon />}
            color="#4CAF50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Total Plans"
            value={dashboardData.kpis.totalPlans.toString()}
            subtitle="Including free and premium tiers"
            icon={<AssignmentIcon />}
            color="#2196F3"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Total Users"
            value={dashboardData.kpis.totalUsers.toString()}
            subtitle="2 educators, 2 students"
            icon={<PeopleIcon />}
            color="#FF9800"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Courses Offered"
            value={dashboardData.kpis.coursesOffered}
            subtitle="Across all active academies"
            icon={<BookIcon />}
            color="#9C27B0"
          />
        </Grid>
      </Grid>

      {/* Dashboard Lists */}
      <Grid container spacing={3}>
        {/* Recent Academies */}
        <Grid item xs={12} lg={6}>
          <Paper
            sx={{
              p: 3,
              height: 'fit-content',
              '&:hover': {
                boxShadow: 3,
              },
              transition: 'box-shadow 0.2s ease-in-out',
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              Recent Academies
            </Typography>
            <AcademiesList academies={dashboardData.academies} />
          </Paper>
        </Grid>

        {/* Active Plans */}
        <Grid item xs={12} lg={6}>
          <Paper
            sx={{
              p: 3,
              height: 'fit-content',
              '&:hover': {
                boxShadow: 3,
              },
              transition: 'box-shadow 0.2s ease-in-out',
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              Subscription Plans
            </Typography>
            <PlansList plans={dashboardData.plans} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardOverview; 