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
  const [activeNav, setActiveNav] = useState('courses');
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
              onClick={() => setActiveNav(item.id)}
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
          {/* Courses View */}
          {(activeNav === 'courses' || activeNav === 'home') ? (
            <Box>
              <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
                {communityData?.name || 'My'} Courses ({courses.length})
              </Typography>
              
              {courses.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    No courses yet
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 3 }}>
                    Create your first course to get started
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/create-course')}
                  >
                    Create First Course
                  </Button>
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {courses.map((course) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={course._id || course.id}>
                      <Card sx={{ 
                        cursor: 'pointer',
                        background: darkMode ? '#2d2d2d' : '#ffffff',
                        border: `1px solid ${darkMode ? '#404040' : '#e0e0e0'}`,
                        borderRadius: 3,
                        transition: 'all 0.3s ease',
                        overflow: 'hidden',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                        }
                      }} onClick={() => handleViewCourse(course)}>
                        
                        {/* Course Thumbnail */}
                        <Box sx={{ 
                          height: 200, 
                          background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
                          position: 'relative',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden'
                        }}>
                          {course.thumbnail && course.thumbnail !== 'https://via.placeholder.com/300x200/4285f4/ffffff?text=Course' ? (
                            <img 
                              src={course.thumbnail} 
                              alt={course.title}
                              style={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover' 
                              }}
                            />
                          ) : (
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              width: '100%',
                              height: '100%',
                              background: `linear-gradient(135deg, ${getCategoryColor(course.category)} 0%, ${getCategoryColor(course.category, true)} 100%)`
                            }}>
                              <Typography variant="h2" sx={{ 
                                color: 'white', 
                                fontWeight: 'bold',
                                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                              }}>
                                {course.title.charAt(0).toUpperCase()}
                              </Typography>
                            </Box>
                          )}
                          
                          {/* Status Badge */}
                          <Box sx={{ 
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            px: 1.5, 
                            py: 0.5, 
                            borderRadius: 2,
                            bgcolor: getStatusColor(course.status),
                            color: 'white',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            backdropFilter: 'blur(10px)',
                            backgroundColor: `${getStatusColor(course.status)}CC`
                          }}>
                            {course.status}
                          </Box>
                        </Box>
                        
                        <CardContent sx={{ p: 3 }}>
                          {/* Course Header */}
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Box sx={{ 
                              width: 32, 
                              height: 32, 
                              borderRadius: '50%', 
                              bgcolor: getCategoryColor(course.category),
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mr: 2
                            }}>
                              <Typography variant="body2" sx={{ 
                                color: 'white', 
                                fontWeight: 'bold',
                                fontSize: '1rem'
                              }}>
                                {course.title.charAt(0).toUpperCase()}
                              </Typography>
                            </Box>
                            <Typography variant="h6" sx={{ 
                              fontWeight: 600,
                              color: darkMode ? '#ffffff' : '#000000',
                              flex: 1
                            }}>
                              {course.title}
                            </Typography>
                          </Box>

                          {/* Course Description */}
                          <Typography variant="body2" sx={{ 
                            mb: 3,
                            color: darkMode ? '#cccccc' : '#666666',
                            lineHeight: 1.6,
                            fontSize: '0.9rem'
                          }}>
                            {course.description.length > 120 
                              ? `${course.description.substring(0, 120)}...` 
                              : course.description
                            }
                          </Typography>

                          {/* Course Stats */}
                          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <PlayCircleOutlineIcon sx={{ fontSize: 16, color: '#666' }} />
                              <Typography variant="caption" sx={{ color: '#666' }}>
                                {course.chaptersCount || course.chapters?.length || 0} chapters
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <VideoLibraryIcon sx={{ fontSize: 16, color: '#666' }} />
                              <Typography variant="caption" sx={{ color: '#666' }}>
                                {course.videosCount || course.chapters?.reduce((total, ch) => total + (ch.videos?.length || 0), 0) || 0} videos
                              </Typography>
                            </Box>
                          </Box>

                          {/* Course Meta */}
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <PeopleIcon sx={{ fontSize: 16, color: '#666' }} />
                              <Typography variant="caption" sx={{ 
                                color: darkMode ? '#cccccc' : '#666666'
                              }}>
                                {Math.floor(Math.random() * 3000) + 500} Members
                              </Typography>
                            </Box>
                            <Typography variant="caption" sx={{ 
                              color: course.isFree ? '#34a853' : '#f59e0b',
                              fontWeight: 600
                            }}>
                              {course.isFree ? 'Free' : `$${course.price || 29}/month`}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
              
              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/create-course')}
                >
                  Create New Course
                </Button>
              </Box>
            </Box>
          ) : (
            <>
              {/* Default Dashboard View */}
              {/* Top Section - Greeting and Metrics */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                {/* Greeting */}
                <Grid item xs={12} md={4}>
                  <Card sx={{
                    background: darkMode ? '#2d2d2d' : '#ffffff',
                    border: `1px solid ${darkMode ? '#404040' : '#e0e0e0'}`,
                    borderRadius: 3,
                    height: '100%'
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h4" sx={{ 
                        fontWeight: 700,
                        color: darkMode ? '#ffffff' : '#000000',
                        mb: 1
                      }}>
                        Good morning, {communityData?.ownerName || 'Community Owner'}!
                      </Typography>
                      <Typography variant="body1" sx={{ 
                        color: darkMode ? '#cccccc' : '#666666'
                      }}>
                        Let's make this day productive for your community.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Metrics */}
                <Grid item xs={12} md={4}>
                  <Card sx={{
                    background: darkMode ? '#2d2d2d' : '#ffffff',
                    border: `1px solid ${darkMode ? '#404040' : '#e0e0e0'}`,
                    borderRadius: 3,
                    height: '100%'
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h3" sx={{ 
                              fontWeight: 700,
                              color: '#34a853',
                              mb: 0.5
                            }}>
                              1,247
                            </Typography>
                            <Typography variant="body2" sx={{ 
                              color: darkMode ? '#cccccc' : '#666666'
                            }}>
                              Total Members
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                              <TrendingUpIcon sx={{ fontSize: 16, color: '#34a853', mr: 0.5 }} />
                              <Typography variant="caption" sx={{ color: '#34a853' }}>
                                +12%
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h3" sx={{ 
                              fontWeight: 700,
                              color: '#4285f4',
                              mb: 0.5
                            }}>
                              89%
                            </Typography>
                            <Typography variant="body2" sx={{ 
                              color: darkMode ? '#cccccc' : '#666666'
                            }}>
                              Engagement Rate
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                              <TrendingUpIcon sx={{ fontSize: 16, color: '#4285f4', mr: 0.5 }} />
                              <Typography variant="caption" sx={{ color: '#4285f4' }}>
                                +5%
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Add Course Button */}
                <Grid item xs={12} md={4}>
                  <Card sx={{
                    background: darkMode ? '#2d2d2d' : '#ffffff',
                    border: `1px solid ${darkMode ? '#404040' : '#e0e0e0'}`,
                    borderRadius: 3,
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <CardContent sx={{ p: 3, textAlign: 'center' }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Button
                          variant="contained"
                          startIcon={<AddIcon />}
                          onClick={() => navigate('/create-course')}
                          sx={{
                            background: '#000000',
                            color: '#ffffff',
                            px: 4,
                            py: 1.5,
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            '&:hover': {
                              background: '#333333',
                            }
                          }}
                        >
                          Add Course
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
          </Grid>

              {/* Middle Section - Chat and Activity */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                {/* Virtual Assistant Chat */}
                <Grid item xs={12} md={6}>
                  <Card sx={{
                background: darkMode ? '#2d2d2d' : '#ffffff',
                border: `1px solid ${darkMode ? '#404040' : '#e0e0e0'}`,
                borderRadius: 3,
                height: 400
              }}>
                <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {/* Header */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h6" sx={{ 
                      fontWeight: 600,
                      color: darkMode ? '#ffffff' : '#000000'
                    }}>
                      Community Assistant
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton size="small" sx={{ color: darkMode ? '#ffffff' : '#000000' }}>
                        <HelpIcon />
                      </IconButton>
                      <IconButton size="small" sx={{ color: darkMode ? '#ffffff' : '#000000' }}>
                        <ChatIcon />
                      </IconButton>
                      <IconButton size="small" sx={{ color: darkMode ? '#ffffff' : '#000000' }}>
                        <SettingsIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Chat Content */}
                  <Box sx={{ flex: 1, mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                      <Avatar sx={{ 
                        bgcolor: '#9c27b0',
                        width: 32,
                        height: 32
                      }}>
                        <ChatIcon />
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ 
                          color: darkMode ? '#ffffff' : '#000000',
                          mb: 0.5
                        }}>
                          Hi there! I'm your community assistant. How can I help you today?
                        </Typography>
                        <Typography variant="caption" sx={{ 
                          color: darkMode ? '#cccccc' : '#666666'
                        }}>
                          9:32 AM
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Input Area */}
                  <Paper sx={{
                    p: 2,
                    background: darkMode ? '#404040' : '#f5f5f5',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <InputBase
                      placeholder="Write a message..."
                      sx={{
                        flex: 1,
                        color: darkMode ? '#ffffff' : '#000000',
                        '& input::placeholder': {
                          color: darkMode ? '#cccccc' : '#666666',
                        }
                      }}
                    />
                    <IconButton size="small" sx={{ color: darkMode ? '#ffffff' : '#000000' }}>
                      <AttachFileIcon />
                    </IconButton>
                    <IconButton size="small" sx={{ color: darkMode ? '#ffffff' : '#000000' }}>
                      <EmojiIcon />
                    </IconButton>
                    <IconButton size="small" sx={{ color: darkMode ? '#ffffff' : '#000000' }}>
                      <MicIcon />
                    </IconButton>
                  </Paper>
                </CardContent>
              </Card>
            </Grid>

            {/* Activity Timeline */}
            <Grid item xs={12} md={6}>
              <Card sx={{
                background: darkMode ? '#2d2d2d' : '#ffffff',
                border: `1px solid ${darkMode ? '#404040' : '#e0e0e0'}`,
                borderRadius: 3,
                height: 400
              }}>
                <CardContent sx={{ p: 3, height: '100%' }}>
                  {/* Header */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Box>
                      <Typography variant="h6" sx={{ 
                        fontWeight: 600,
                        color: darkMode ? '#ffffff' : '#000000'
                      }}>
                        Community Activity
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: darkMode ? '#cccccc' : '#666666'
                      }}>
                        What's happening today
                      </Typography>
                    </Box>
                    <IconButton sx={{ color: darkMode ? '#ffffff' : '#000000' }}>
                      <ScheduleIcon />
                    </IconButton>
                  </Box>

                  {/* Timeline */}
                  <Box sx={{ position: 'relative' }}>
                    {/* Time markers */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      {['07:00', '09:00', '11:00', '13:00', '15:00', '17:00'].map((time) => (
                        <Typography key={time} variant="caption" sx={{ 
                          color: darkMode ? '#cccccc' : '#666666'
                        }}>
                          {time}
                        </Typography>
                      ))}
                    </Box>

                    {/* Timeline line */}
                    <Box sx={{
                      height: 4,
                      background: darkMode ? '#404040' : '#e0e0e0',
                      borderRadius: 2,
                      position: 'relative',
                      mb: 3
                    }}>
                      {/* Current time indicator */}
                      <Box sx={{
                        position: 'absolute',
                        left: '50%',
                        top: -4,
                        width: 12,
                        height: 12,
                        background: '#4285f4',
                        borderRadius: '50%',
                        border: '2px solid #ffffff'
                      }} />
                    </Box>

                    {/* Events */}
                    <List sx={{ p: 0 }}>
                      <ListItem sx={{ px: 0, py: 1 }}>
                        <Box sx={{
                          width: '100%',
                          p: 2,
                          background: '#e8f5e8',
                          borderRadius: 2,
                          border: '1px solid #4caf50'
                        }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                            New Course Published
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#666666' }}>
                            "Advanced React Patterns" by John Doe
                          </Typography>
                        </Box>
                      </ListItem>
                      <ListItem sx={{ px: 0, py: 1 }}>
                        <Box sx={{
                          width: '100%',
                          p: 2,
                          background: '#fff3e0',
                          borderRadius: 2,
                          border: '1px solid #ff9800'
                        }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                            Community Meeting
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#666666' }}>
                            Weekly Q&A Session - 45 members joined
                          </Typography>
                        </Box>
                      </ListItem>
                    </List>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Bottom Section - Tasks and Analytics */}
          <Grid container spacing={3}>
            {/* To-do List */}
            <Grid item xs={12} md={6}>
              <Card sx={{
                background: darkMode ? '#2d2d2d' : '#ffffff',
                border: `1px solid ${darkMode ? '#404040' : '#e0e0e0'}`,
                borderRadius: 3
              }}>
                <CardContent sx={{ p: 3 }}>
                  {/* Header */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Box>
                      <Typography variant="h6" sx={{ 
                        fontWeight: 600,
                        color: darkMode ? '#ffffff' : '#000000'
                      }}>
                        To-do List
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: darkMode ? '#cccccc' : '#666666'
                      }}>
                        Wednesday, 27 Aug
                      </Typography>
                    </Box>
                    <IconButton sx={{ color: darkMode ? '#ffffff' : '#000000' }}>
                      <ArrowUpIcon />
                    </IconButton>
                  </Box>

                  {/* Tasks */}
                  <List sx={{ p: 0 }}>
                    <ListItem sx={{ px: 0, py: 1 }}>
                      <ListItemIcon>
                        <CheckCircleIcon sx={{ color: '#4caf50' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Review Course Content"
                        secondary="Landing page redesign feedback"
                        sx={{
                          '& .MuiListItemText-primary': {
                            color: darkMode ? '#ffffff' : '#000000',
                            fontWeight: 500
                          },
                          '& .MuiListItemText-secondary': {
                            color: darkMode ? '#cccccc' : '#666666'
                          }
                        }}
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="caption" sx={{ 
                          color: darkMode ? '#cccccc' : '#666666'
                        }}>
                          Today 2:00 PM
                        </Typography>
                        <Avatar sx={{ width: 24, height: 24, bgcolor: '#4285f4' }}>
                          <PeopleIcon sx={{ fontSize: 14 }} />
                        </Avatar>
                      </Box>
                    </ListItem>
                    <Divider sx={{ my: 1 }} />
                    <ListItem sx={{ px: 0, py: 1 }}>
                      <ListItemIcon>
                        <Box sx={{
                          width: 20,
                          height: 20,
                          border: '2px solid #e0e0e0',
                          borderRadius: '50%'
                        }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Update Community Guidelines"
                        secondary="Review and publish new rules"
                        sx={{
                          '& .MuiListItemText-primary': {
                            color: darkMode ? '#ffffff' : '#000000',
                            fontWeight: 500
                          },
                          '& .MuiListItemText-secondary': {
                            color: darkMode ? '#cccccc' : '#666666'
                          }
                        }}
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="caption" sx={{ 
                          color: darkMode ? '#cccccc' : '#666666'
                        }}>
                          Tomorrow 10:00 AM
                        </Typography>
                        <Avatar sx={{ width: 24, height: 24, bgcolor: '#ff9800' }}>
                          <PeopleIcon sx={{ fontSize: 14 }} />
                        </Avatar>
                      </Box>
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Analytics Summary */}
            <Grid item xs={12} md={6}>
              <Card sx={{
                background: darkMode ? '#2d2d2d' : '#ffffff',
                border: `1px solid ${darkMode ? '#404040' : '#e0e0e0'}`,
                borderRadius: 3
              }}>
                <CardContent sx={{ p: 3 }}>
                  {/* Header */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Box>
                      <Typography variant="h6" sx={{ 
                        fontWeight: 600,
                        color: darkMode ? '#ffffff' : '#000000'
                      }}>
                        Summary
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: darkMode ? '#cccccc' : '#666666'
                      }}>
                        Track your performance
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton size="small" sx={{ color: darkMode ? '#ffffff' : '#000000' }}>
                        <FilterIcon />
                      </IconButton>
                      <IconButton size="small" sx={{ color: darkMode ? '#ffffff' : '#000000' }}>
                        <ArrowUpIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Performance Graph */}
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ 
                        color: darkMode ? '#cccccc' : '#666666'
                      }}>
                        Member Growth
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: '#34a853',
                        fontWeight: 600
                      }}>
                        +15%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={75}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: darkMode ? '#404040' : '#e0e0e0',
                        '& .MuiLinearProgress-bar': {
                          background: 'linear-gradient(90deg, #34a853, #4285f4)',
                          borderRadius: 4,
                        }
                      }}
                    />
                  </Box>

                  {/* Stats */}
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center', p: 2, background: darkMode ? '#404040' : '#f5f5f5', borderRadius: 2 }}>
                        <Typography variant="h4" sx={{ 
                          fontWeight: 700,
                          color: '#4285f4',
                          mb: 0.5
                        }}>
                          24
                        </Typography>
                        <Typography variant="caption" sx={{ 
                          color: darkMode ? '#cccccc' : '#666666'
                        }}>
                          Active Courses
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center', p: 2, background: darkMode ? '#404040' : '#f5f5f5', borderRadius: 2 }}>
                        <Typography variant="h4" sx={{ 
                          fontWeight: 700,
                          color: '#34a853',
                          mb: 0.5
                        }}>
                          156
                        </Typography>
                        <Typography variant="caption" sx={{ 
                          color: darkMode ? '#cccccc' : '#666666'
                        }}>
                          New Members
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
            </>
          )}


                  </Box>
        </Box>

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
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Course Details
                  </Typography>
                  <Box sx={{
                    backgroundColor: getStatusColor(selectedCourse.status),
                    color: 'white',
                    borderRadius: '50%',
                    width: 24,
                    height: 24,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 'bold',
                  }}>
                    {getStatusIcon(selectedCourse.status)}
                  </Box>
                </Box>
              </DialogTitle>
              <DialogContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Box
                      component="img"
                      src={selectedCourse.thumbnail}
                      alt={selectedCourse.title}
                      sx={{
                        width: '100%',
                        height: 200,
                        objectFit: 'cover',
                        borderRadius: 2,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                      {selectedCourse.title}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3 }}>
                      {selectedCourse.description}
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" sx={{ color: '#666666' }}>
                          Category
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {selectedCourse.category}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" sx={{ color: '#666666' }}>
                          Target Audience
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {selectedCourse.targetAudience}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" sx={{ color: '#666666' }}>
                          Chapters
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {selectedCourse.chaptersCount || selectedCourse.chapters?.length || 0}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" sx={{ color: '#666666' }}>
                          Total Videos
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {selectedCourse.videosCount || selectedCourse.chapters?.reduce((total, ch) => total + (ch.videos?.length || 0), 0) || 0}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" sx={{ color: '#666666' }}>
                          Students Enrolled
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {selectedCourse.studentsCount || selectedCourse.students?.length || 0}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" sx={{ color: '#666666' }}>
                          Rating
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <StarIcon sx={{ fontSize: 16, color: '#fbbc04' }} />
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {selectedCourse.rating || 0}/5.0
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
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
                  </Grid>
                </Grid>
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
    );
  };

export default CommunityDashboard;
