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
  School as SchoolIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  Pause as OnHoldIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useTheme } from '../contexts/ThemeContext';
import KPICard from '../components/dashboard/KPICard';
import AcademiesList from '../components/dashboard/AcademiesList';
import AddAcademyModal from '../components/dashboard/AddAcademyModal';

const Academies = () => {
  const { mode } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAcademy, setEditingAcademy] = useState(null);
  const [academiesData, setAcademiesData] = useState({
    academies: [],
    kpis: {
      totalAcademies: 0,
      activeAcademies: 0,
      inactiveAcademies: 0,
      onHoldAcademies: 0,
    },
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

      // Fetch academies list
      const academiesResponse = await fetch('http://localhost:5001/api/academies', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!academiesResponse.ok) {
        if (academiesResponse.status === 401) {
          console.error('Authentication failed - token may be expired');
          return;
        }
        throw new Error(`Failed to fetch academies: ${academiesResponse.status}`);
      }
      
      const academiesData = await academiesResponse.json();
      const academies = academiesData.data || academiesData;

      // Fetch KPI statistics
      const statsResponse = await fetch('http://localhost:5001/api/academies/stats/summary', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      let kpis = {
        totalAcademies: academies.length,
        activeAcademies: academies.filter(academy => academy.status === 'Active').length,
        inactiveAcademies: academies.filter(academy => academy.status === 'Inactive').length,
        onHoldAcademies: academies.filter(academy => academy.status === 'Onhold').length,
      };

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        kpis = statsData.data;
      }

      setAcademiesData({
        academies,
        kpis,
      });
    } catch (error) {
      console.error('Error fetching academies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAcademies();
  }, []);

  const handleAddAcademy = () => {
    setIsModalOpen(true);
  };

  const handleEditAcademy = (academy) => {
    setEditingAcademy(academy);
    setIsEditModalOpen(true);
  };

  const handleUpdateAcademy = () => {
    fetchAcademies();
    setIsEditModalOpen(false);
    setEditingAcademy(null);
  };

  const handleDeleteAcademy = (academyId) => {
    fetchAcademies();
  };

  const handleSaveAcademy = () => {
    fetchAcademies();
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
    <Box sx={{ 
      minHeight: '100vh',
      background: (theme) => theme.palette.mode === 'light'
        ? 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
        : 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
      pt: 2,
      pb: 4,
    }}>
      <Container maxWidth="xl">
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            mb: 3,
          }}>
            <Box>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700, 
                  color: 'text.primary',
                  mb: 1,
                  background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Academies
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: 'text.secondary',
                  fontSize: '1.125rem',
                  fontWeight: 500,
                }}
              >
                Manage and monitor all your academies in one place
              </Typography>
            </Box>
            
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddAcademy}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                py: 1.5,
                background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
                  boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              Add New Academy
            </Button>
          </Box>
        </Box>

        {/* KPI Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <KPICard
              title="Total Academies"
              value={academiesData.kpis.totalAcademies}
              description="All academies in the system"
              icon={<SchoolIcon />}
              color="primary"
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KPICard
              title="Active Academies"
              value={academiesData.kpis.activeAcademies}
              description="Currently operational"
              icon={<ActiveIcon />}
              color="success"
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KPICard
              title="Inactive Academies"
              value={academiesData.kpis.inactiveAcademies}
              description="Temporarily disabled"
              icon={<InactiveIcon />}
              color="error"
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KPICard
              title="Onhold Academies"
              value={academiesData.kpis.onHoldAcademies}
              description="Pending activation"
              icon={<OnHoldIcon />}
              color="warning"
              isLoading={isLoading}
            />
          </Grid>
        </Grid>

        {/* Academies List */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            background: (theme) => theme.palette.mode === 'light'
              ? 'rgba(255, 255, 255, 0.8)'
              : 'rgba(26, 26, 26, 0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid',
            borderColor: (theme) => theme.palette.mode === 'light' 
              ? 'rgba(0, 0, 0, 0.08)' 
              : 'rgba(255, 255, 255, 0.08)',
            overflow: 'hidden',
          }}
        >
          <AcademiesList
            academies={academiesData.academies}
            isLoading={isLoading}
            onEdit={handleEditAcademy}
            onDelete={handleDeleteAcademy}
            onRefresh={fetchAcademies}
          />
        </Paper>

        {/* Add Academy Modal */}
        <AddAcademyModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveAcademy}
        />

        {/* Edit Academy Modal */}
        <AddAcademyModal
          open={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleUpdateAcademy}
          editingAcademy={editingAcademy}
        />
      </Container>
    </Box>
  );
};

export default Academies; 