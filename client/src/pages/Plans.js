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
  Button,
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  Pause as OnHoldIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useTheme } from '../contexts/ThemeContext';
import KPICard from '../components/dashboard/KPICard';
import PlansTable from '../components/dashboard/PlansTable';
import AddPlanModal from '../components/dashboard/AddPlanModal';

const Plans = () => {
  const { mode } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [plansData, setPlansData] = useState({
    plans: [],
    kpis: {
      totalPlans: 0,
      activePlans: 0,
      inactivePlans: 0,
      onHoldPlans: 0,
    },
  });

  // Fetch plans from backend
  const fetchPlans = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      // Fetch plans list
      const plansResponse = await fetch(`${process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? 'https://saas-lms-admin-1.onrender.com' : 'http://localhost:5001')}/api/plans`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!plansResponse.ok) {
        if (plansResponse.status === 401) {
          console.error('Authentication failed - token may be expired');
          // Clear invalid token and redirect to login
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return;
        }
        throw new Error(`Failed to fetch plans: ${plansResponse.status}`);
      }
      
      const plansData = await plansResponse.json();
      const plans = plansData.data?.plans || plansData.plans || [];

      // Fetch KPI statistics
      const statsResponse = await fetch(`${process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? 'https://saas-lms-admin-1.onrender.com' : 'http://localhost:5001')}/api/plans/stats/summary`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      let kpis = {
        totalPlans: plans.length,
        activePlans: plans.filter(plan => plan.status === 'Active').length,
        inactivePlans: plans.filter(plan => plan.status === 'Inactive').length,
        onHoldPlans: plans.filter(plan => plan.status === 'Onhold').length,
      };

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        kpis = statsData.data;
      }

      setPlansData({
        plans,
        kpis,
      });
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleAddPlan = () => {
    setIsModalOpen(true);
  };



  const handleUpdatePlan = () => {
    fetchPlans();
    setIsEditModalOpen(false);
    setEditingPlan(null);
  };

  const handleDeletePlan = (planId) => {
    fetchPlans();
  };

  const handleSavePlan = () => {
    fetchPlans();
    setIsModalOpen(false);
  };

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
    <Box
      sx={{
        minHeight: '100vh',
        background: mode === 'light' 
          ? 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
          : 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        {/* Page Header */}
        <Fade in timeout={800}>
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 800,
                color: 'text.primary',
                mb: 1,
                textAlign: { xs: 'center', md: 'left' },
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              Subscription Plans
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                fontWeight: 500,
                textAlign: { xs: 'center', md: 'left' },
                mb: 3,
              }}
            >
              Manage and monitor all your subscription plans in one place
            </Typography>
          </Box>
        </Fade>

        {/* KPI Cards */}
        <Grow in timeout={1000}>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{xs:12,sm:6, lg:3}}>
              <KPICard
                title="Total Plans"
                value={plansData.kpis.totalPlans}
                subtitle="All plans in the system"
                icon={<AssignmentIcon />}
                color="#1976d2"
              />
            </Grid>
            <Grid size={{xs:12,sm:6, lg:3}}>
              <KPICard
                title="Active Plans"
                value={plansData.kpis.activePlans}
                subtitle="Currently available"
                icon={<ActiveIcon />}
                color="#4CAF50"
              />
            </Grid>
            <Grid size={{xs:12,sm:6, lg:3}}>
              <KPICard
                title="Inactive Plans"
                value={plansData.kpis.inactivePlans}
                subtitle="Temporarily disabled"
                icon={<InactiveIcon />}
                color="#F44336"
              />
            </Grid>
            <Grid size={{xs:12,sm:6, lg:3}}>
              <KPICard
                title="Onhold Plans"
                value={plansData.kpis.onHoldPlans}
                subtitle="Pending activation"
                icon={<OnHoldIcon />}
                color="#FF9800"
              />
            </Grid>
          </Grid>
        </Grow>

        {/* Add Plan Button */}
        <Grow in timeout={1200}>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddPlan}
              sx={{
                background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                px: 4,
                py: 1.5,
                borderRadius: 3,
                fontWeight: 600,
                fontSize: '1rem',
                boxShadow: '0 8px 24px rgba(25, 118, 210, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 32px rgba(25, 118, 210, 0.4)',
                },
                transition: 'all 0.3s ease-in-out',
              }}
            >
              Add New Plan
            </Button>
          </Box>
        </Grow>

        {/* Plans Table */}
        <Grow in timeout={1400}>
          <Paper
            elevation={0}
            sx={{
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
            <PlansTable
              plans={plansData.plans}
              onPlanUpdate={handleUpdatePlan}
              onPlanDelete={handleDeletePlan}
              defaultRowsPerPage={10}
            />
          </Paper>
        </Grow>
      </Container>

      {/* Add Plan Modal */}
      <AddPlanModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePlan}
      />

      {/* Edit Plan Modal */}
      {editingPlan && (
        <AddPlanModal
          open={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingPlan(null);
          }}
          onSave={handleUpdatePlan}
          editingPlan={editingPlan}
        />
      )}
    </Box>
  );
};

export default Plans; 