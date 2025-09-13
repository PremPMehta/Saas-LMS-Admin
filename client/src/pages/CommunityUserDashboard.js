import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FocusedSidebar from '../components/FocusedSidebar';
import FocusedTopBar from '../components/FocusedTopBar';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Grid,
  Button,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Paper,
  CircularProgress,
} from '@mui/material';
import {
  Person as PersonIcon,
  School as SchoolIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  Bookmark as BookmarkIcon,
  PlayCircle as PlayCircleIcon,
  Logout as LogoutIcon,
  Home as HomeIcon,
  Dashboard as DashboardIcon,
  Description as DescriptionIcon,
  People as PeopleIcon,
  Add as AddIcon,
} from '@mui/icons-material';

const CommunityUserDashboard = () => {
  const { communityName } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [activeNav, setActiveNav] = useState('home');

  useEffect(() => {
    // Get user data from localStorage or API
    const userData = localStorage.getItem('communityUserData');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
    
    // Redirect students directly to courses instead of showing dashboard
    if (userData) {
      navigate(`/${communityName}/student/courses`);
    }
  }, [navigate, communityName]);

  const handleLogout = () => {
    localStorage.removeItem('communityUserToken');
    localStorage.removeItem('communityUserData');
    navigate('/community-user-signup');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      background: darkMode ? '#1a1a1a' : '#f8f9fa',
      display: 'flex'
    }}>
      {/* Common Focused Sidebar */}
      <FocusedSidebar darkMode={darkMode} />

      {/* Main Content Area */}
      <Box sx={{
        flex: 1,
        ml: 10, // Account for fixed sidebar
        mt: 9, // Account for fixed top bar (70px height) + padding
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Common Focused Top Bar */}
        <FocusedTopBar darkMode={darkMode} setDarkMode={setDarkMode} />

        {/* Main Content */}
        <Box sx={{ flex: 1, p: 4 }}>
          {/* Home/Dashboard View */}
          {activeNav === 'home' ? (
            <Box>
              <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, color: darkMode ? '#ffffff' : '#000000', fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem', lg: '1.5rem' } }}>
                Welcome, {user?.firstName} {user?.lastName}!
              </Typography>

              <Grid container spacing={3} sx={{ mb: 4 }}>
                {/* Enrolled Courses */}
                <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card
                    sx={{
                      p: 3,
                      display: 'flex',
                      alignItems: 'center',
                      background: 'linear-gradient(45deg,rgb(255, 255, 255) 30%,rgb(237, 235, 255) 90%)',
                      borderRadius: 3,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: '50%',
                          bgcolor: '#e8f0fe',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <BookmarkIcon sx={{ color: '#4285f4' }} />
                      </Box>
                      <Box>
                        <Typography variant="h4" sx={{ color: '#4285f4', mb: 0 }}>
                          0
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Enrolled Courses
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </Grid>

                {/* Completed Lessons */}
                <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card
                    sx={{
                      p: 3,
                      display: 'flex',
                      alignItems: 'center',
                      background: 'linear-gradient(45deg,rgb(255, 255, 255) 30%,rgb(232, 248, 235) 90%)',
                      borderRadius: 3,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: '50%',
                          bgcolor: '#e6f4ea',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <PlayCircleIcon sx={{ color: '#34a853' }} />
                      </Box>
                      <Box>
                        <Typography variant="h4" sx={{ color: '#34a853', mb: 0 }}>
                          0
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Completed Lessons
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </Grid>

                {/* Progress */}
                <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card
                    sx={{
                      p: 3,
                      display: 'flex',
                      alignItems: 'center',
                      background: 'linear-gradient(45deg,rgb(255, 255, 255) 30%,rgb(255, 249, 225) 90%)',
                      borderRadius: 3,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: '50%',
                          bgcolor: '#fef7e0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <TrendingUpIcon sx={{ color: '#fbbc04' }} />
                      </Box>
                      <Box>
                        <Typography variant="h4" sx={{ color: '#fbbc04', mb: 0 }}>
                          0%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Progress
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </Grid>

                {/* Hours Studied */}
                <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card
                    sx={{
                      p: 3,
                      display: 'flex',
                      alignItems: 'center',
                      background: 'linear-gradient(45deg,rgb(255, 255, 255) 30%,rgb(255, 235, 232) 90%)',
                      borderRadius: 3,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: '50%',
                          bgcolor: '#fce8e6',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <ScheduleIcon sx={{ color: '#ea4335' }} />
                      </Box>
                      <Box>
                        <Typography variant="h4" sx={{ color: '#ea4335', mb: 0 }}>
                          0
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Hours Studied
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </Grid>
              </Grid>

              <Box sx={{ textAlign: 'end', py: 4 }}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'end', flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    startIcon={<SchoolIcon />}
                    onClick={() => navigate(`/${communityName}/student/courses`)}
                    sx={{ mb: 2 }}
                  >
                    Browse Courses
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<PersonIcon />}
                    onClick={handleLogout}
                    sx={{ mb: 2 }}
                  >
                    Logout
                  </Button>
                </Box>
              </Box>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h5" sx={{ mb: 2 }}>
                {activeNav.charAt(0).toUpperCase() + activeNav.slice(1)} Section
              </Typography>
              <Typography variant="body1" color="text.secondary">
                This section is coming soon...
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default CommunityUserDashboard;
