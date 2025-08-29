import React, { useState, useEffect } from 'react';
import courseApi from '../utils/courseApi';
import communityAuthApi from '../utils/communityAuthApi';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Avatar,
  IconButton,
  Switch,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Paper,
  InputBase,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Dashboard as DashboardIcon,
  FlashOn as FlashIcon,
  Description as DescriptionIcon,
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  Chat as ChatIcon,
  AttachFile as AttachFileIcon,
  EmojiEmotions as EmojiIcon,
  Mic as MicIcon,
  FilterList as FilterIcon,
  KeyboardArrowUp as ArrowUpIcon,
  WbSunny as SunIcon,
  DarkMode as DarkIcon,
  Star as StarIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PlayCircleOutline as PlayCircleOutlineIcon,
  VideoLibrary as VideoLibraryIcon,
} from '@mui/icons-material';

const CommunityDashboard = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [activeNav, setActiveNav] = useState('home');
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [openCourseDialog, setOpenCourseDialog] = useState(false);
  const [communityData, setCommunityData] = useState(null);
  
  console.log('🎯 CommunityDashboard rendered with courses:', courses.length);

  // Check authentication on component mount
  useEffect(() => {
    if (!communityAuthApi.isAuthenticated()) {
      console.log('❌ User not authenticated, redirecting to login...');
      navigate('/community-login');
      return;
    }

    // Get community data
    const currentCommunity = communityAuthApi.getCurrentCommunity();
    if (!currentCommunity) {
      console.log('❌ No community data found, redirecting to login...');
      navigate('/community-login');
      return;
    }
    
    setCommunityData(currentCommunity);
    console.log('✅ User authenticated, community data loaded:', currentCommunity);
  }, [navigate]);

  // Load courses from API
  useEffect(() => {
    const loadCourses = async () => {
      try {
        // Check authentication first
        if (!communityAuthApi.isAuthenticated()) {
          console.log('❌ Not authenticated, redirecting to login...');
          navigate('/community-login');
          return;
        }

        const currentCommunity = communityAuthApi.getCurrentCommunity();
        if (!currentCommunity) {
          console.log('❌ No community data, redirecting to login...');
          navigate('/community-login');
          return;
        }

        console.log('🔄 Loading courses for community:', currentCommunity.id);
        
        // Load courses for the authenticated community
        const response = await courseApi.getCourses({ community: currentCommunity.id });
        console.log('✅ API Response:', response);
        console.log('📚 Courses loaded:', response.courses?.length || 0);
        setCourses(response.courses || []);
        
      } catch (error) {
        console.error('❌ Error loading courses:', error);
        
        // If it's an authentication error, redirect to login
        if (error.message.includes('unauthorized') || error.message.includes('token')) {
          console.log('❌ Authentication error, redirecting to login...');
          communityAuthApi.logout();
          navigate('/community-login');
          return;
        }
        
        setCourses([]);
      }
    };

    // Only load courses if authenticated
    if (communityAuthApi.isAuthenticated()) {
      console.log('🚀 Loading courses for authenticated user...');
      loadCourses();
    }
  }, [navigate]);

  // Handle new course from navigation state
  React.useEffect(() => {
    const location = window.location;
    if (location.state?.newCourse) {
      console.log('New course received:', location.state.newCourse);
      setCourses(prev => {
        const updatedCourses = [...prev, location.state.newCourse];
        // Also update localStorage
        localStorage.setItem('courses', JSON.stringify(updatedCourses));
        return updatedCourses;
      });
      // Clear the state
      window.history.replaceState({}, document.title);
    }
  }, []);

  // Course management functions
  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return '#34a853';
      case 'draft':
        return '#fbbc04';
      case 'archived':
        return '#ea4335';
      default:
        return '#666666';
    }
  };

  const getCategoryColor = (category, isSecondary = false) => {
    const colors = {
      'Technology': isSecondary ? '#4f46e5' : '#3b82f6',
      'Design': isSecondary ? '#ec4899' : '#f59e0b',
      'Marketing': isSecondary ? '#ef4444' : '#dc2626',
      'Business': isSecondary ? '#10b981' : '#059669',
      'Health': isSecondary ? '#8b5cf6' : '#7c3aed',
      'Education': isSecondary ? '#06b6d4' : '#0891b2',
      'Finance': isSecondary ? '#f97316' : '#ea580c',
      'default': isSecondary ? '#6b7280' : '#4b5563'
    };
    return colors[category] || colors.default;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'published':
        return '✓';
      case 'draft':
        return '⚠';
      case 'archived':
        return '✗';
      default:
        return '⏱';
    }
  };

  const handleViewCourse = (course) => {
    setSelectedCourse(course);
    setOpenCourseDialog(true);
  };

  const handleEditCourse = (courseId) => {
    navigate(`/edit-course/${courseId}`);
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        // Delete from database
        await courseApi.deleteCourse(courseId);
        
        // Update local state
        setCourses(prev => prev.filter(course => course._id !== courseId));
        
        console.log('Course deleted successfully');
      } catch (error) {
        console.error('Error deleting course:', error);
        alert('Failed to delete course. Please try again.');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleLogout = () => {
    communityAuthApi.logout();
    navigate('/community-login');
  };
  const navItems = [
    { id: 'home', icon: <HomeIcon />, label: 'Home' },
    { id: 'dashboard', icon: <DashboardIcon />, label: 'Dashboard' },
    { id: 'courses', icon: <DescriptionIcon />, label: 'Courses' },
    { id: 'admins', icon: <PeopleIcon />, label: 'Admins' },
    { id: 'analytics', icon: <FlashIcon />, label: 'Analytics' },
    { id: 'content', icon: <DescriptionIcon />, label: 'Content' },
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: darkMode ? '#1a1a1a' : '#f8f9fa',
      display: 'flex'
    }}>
      {/* Left Navigation Bar */}
      <Box sx={{
        width: 80,
        background: darkMode ? '#2d2d2d' : '#ffffff',
        borderRight: `1px solid ${darkMode ? '#404040' : '#e0e0e0'}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: 2,
        position: 'fixed',
        height: '100vh',
        zIndex: 1000,
      }}>
        {/* Hamburger Menu */}
        <IconButton sx={{ mb: 4, color: darkMode ? '#ffffff' : '#000000' }}>
          <MenuIcon />
        </IconButton>

        {/* Navigation Items */}
        {navItems.map((item) => (
          <Box key={item.id} sx={{ mb: 2, position: 'relative' }}>
            <IconButton
              onClick={() => {
                if (item.id === 'courses') {
                  navigate('/courses');
                } else if (item.id === 'admins') {
                  navigate('/community-admins');
                } else {
                  setActiveNav(item.id);
                }
              }}
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                backgroundColor: activeNav === item.id 
                  ? (darkMode ? '#404040' : '#000000')
                  : 'transparent',
                color: activeNav === item.id 
                  ? '#ffffff' 
                  : (darkMode ? '#ffffff' : '#000000'),
                '&:hover': {
                  backgroundColor: activeNav === item.id 
                    ? (darkMode ? '#404040' : '#000000')
                    : (darkMode ? '#404040' : '#f0f0f0'),
                }
              }}
            >
              {item.icon}
            </IconButton>
          </Box>
        ))}

        {/* Logout Button */}
        <Box sx={{ mt: 'auto', mb: 2 }}>
          <IconButton 
            onClick={handleLogout}
            sx={{ color: darkMode ? '#ffffff' : '#000000' }}
            title="Logout"
          >
            <ArrowBackIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ 
        flex: 1, 
        ml: 10, // Account for fixed sidebar
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Top Header */}
        <Box sx={{
          height: 80,
          background: darkMode ? '#2d2d2d' : '#ffffff',
          borderBottom: `1px solid ${darkMode ? '#404040' : '#e0e0e0'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 4,
          position: 'sticky',
          top: 0,
          zIndex: 999,
        }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ 
              bgcolor: '#4285f4', 
              mr: 2,
              width: 40,
              height: 40
            }}>
              <DashboardIcon />
            </Avatar>
            <Typography variant="h6" sx={{ 
              fontWeight: 700,
              color: darkMode ? '#ffffff' : '#000000'
            }}>
              Community Hub
            </Typography>
          </Box>

          {/* Center - Theme Toggle */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SunIcon sx={{ fontSize: 20, color: darkMode ? '#666666' : '#ffd700' }} />
            <Switch
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: '#4285f4',
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: '#4285f4',
                },
              }}
            />
            <DarkIcon sx={{ fontSize: 20, color: darkMode ? '#4285f4' : '#666666' }} />
          </Box>

          {/* Right - Search and Profile */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton sx={{ color: darkMode ? '#ffffff' : '#000000' }}>
              <SearchIcon />
            </IconButton>
            <IconButton sx={{ color: darkMode ? '#ffffff' : '#000000' }}>
              <NotificationsIcon />
            </IconButton>
            <Avatar sx={{ 
              width: 40, 
              height: 40,
              bgcolor: '#34a853'
            }}>
              <PeopleIcon />
            </Avatar>
          </Box>
        </Box>

        {/* Main Content */}
        <Box sx={{ flex: 1, p: 4 }}>
          {/* Home/Dashboard View */}
          {activeNav === 'home' ? (
            <Box>
              <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
                Welcome to {communityData?.name || 'Your'} Dashboard
              </Typography>
              
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ color: '#4285f4', mb: 1 }}>
                      {courses.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Courses
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ color: '#34a853', mb: 1 }}>
                      {courses.filter(c => c.status === 'published').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Published
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ color: '#fbbc04', mb: 1 }}>
                      {courses.filter(c => c.status === 'draft').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Drafts
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ color: '#ea4335', mb: 1 }}>
                      {courses.filter(c => c.status === 'archived').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Archived
                    </Typography>
                  </Card>
                </Grid>
              </Grid>

              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Quick Actions
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/create-course')}
                    sx={{ mb: 2 }}
                  >
                    Create New Course
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/courses')}
                    sx={{ mb: 2 }}
                  >
                    View All Courses
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

          {/* Course Details Dialog */}
          <Dialog
            open={openCourseDialog}
            onClose={() => setOpenCourseDialog(false)}
            maxWidth="md"
            fullWidth
          >
            {selectedCourse && (
              <>
                <DialogTitle>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {selectedCourse.title}
                  </Typography>
                </DialogTitle>
                <DialogContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" sx={{ color: '#666666' }}>
                        Description
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {selectedCourse.description}
                      </Typography>
                      
                      <Typography variant="subtitle2" sx={{ color: '#666666' }}>
                        Category
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {selectedCourse.category}
                      </Typography>
                      
                      <Typography variant="subtitle2" sx={{ color: '#666666' }}>
                        Target Audience
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {selectedCourse.targetAudience}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" sx={{ color: '#666666' }}>
                        Created
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {formatDate(selectedCourse.createdAt)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" sx={{ color: '#666666' }}>
                        Status
                      </Typography>
                      <Box sx={{ 
                        display: 'inline-flex',
                        alignItems: 'center',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1,
                        bgcolor: getStatusColor(selectedCourse.status),
                        color: 'white',
                        fontSize: '0.75rem',
                        fontWeight: 600
                      }}>
                        {selectedCourse.status}
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Chapters and Videos Section */}
                  {selectedCourse.chapters && selectedCourse.chapters.length > 0 && (
                    <Box sx={{ mt: 4 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                        Course Content
                      </Typography>
                      {selectedCourse.chapters.map((chapter, chapterIndex) => (
                        <Box key={chapterIndex} sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                            Chapter {chapterIndex + 1}: {chapter.title}
                          </Typography>
                          {chapter.description && (
                            <Typography variant="body2" sx={{ color: '#666666', mb: 2 }}>
                              {chapter.description}
                            </Typography>
                          )}
                          {chapter.videos && chapter.videos.length > 0 && (
                            <Box>
                              <Typography variant="subtitle2" sx={{ color: '#666666', mb: 1 }}>
                                Videos ({chapter.videos.length}):
                              </Typography>
                              {chapter.videos.map((video, videoIndex) => (
                                <Box key={videoIndex} sx={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  gap: 1, 
                                  p: 1, 
                                  bgcolor: '#f5f5f5', 
                                  borderRadius: 1, 
                                  mb: 0.5 
                                }}>
                                  <PlayCircleOutlineIcon sx={{ fontSize: 16, color: '#666' }} />
                                  <Typography variant="body2" sx={{ flex: 1 }}>
                                    {video.title}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: '#666' }}>
                                    {video.duration}
                                  </Typography>
                                </Box>
                              ))}
                            </Box>
                          )}
                        </Box>
                      ))}
                    </Box>
                  )}
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpenCourseDialog(false)}>Close</Button>
                  <Button
                    variant="contained"
                    onClick={() => handleEditCourse(selectedCourse._id || selectedCourse.id)}
                    sx={{
                      background: '#4285f4',
                      '&:hover': { background: '#3367d6' }
                    }}
                  >
                    Edit Course
                  </Button>
                </DialogActions>
              </>
            )}
          </Dialog>
        </Box>
      </Box>
    </Box>
  );
};

export default CommunityDashboard;
