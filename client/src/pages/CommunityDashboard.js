import React, { useState, useEffect } from 'react';
import courseApi from '../utils/courseApi';
import communityAuthApi from '../utils/communityAuthApi';
import { useNavigate, useParams } from 'react-router-dom';
import { getCommunityUrls } from '../utils/communityUrlUtils';
import FocusedSidebar from '../components/FocusedSidebar';
import FocusedTopBar from '../components/FocusedTopBar';
import '../App.css';
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
import SchoolIcon from '@mui/icons-material/School';
import PublicIcon from '@mui/icons-material/Public';
import EditNoteIcon from '@mui/icons-material/EditNote';
import ArchiveIcon from '@mui/icons-material/Archive';
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
  const { communityName } = useParams();
  
  // Get community-specific URLs
  const communityUrls = communityName ? getCommunityUrls(communityName) : null;
  const [darkMode, setDarkMode] = useState(false);
  const [activeNav, setActiveNav] = useState('home');
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [openCourseDialog, setOpenCourseDialog] = useState(false);
  const [communityData, setCommunityData] = useState(null);

  console.log('🎯 CommunityDashboard rendered with courses:', courses.length);

  // Check authentication on component mount - TEMPORARILY DISABLED FOR TESTING
  useEffect(() => {
    // TEMPORARILY DISABLED AUTH CHECK
    console.log('🔓 Auth check temporarily disabled for testing');
    
    // Set mock community data for testing
    const mockCommunityData = {
      id: 'test-community-123',
      name: 'Test Community',
      description: 'This is a test community for development purposes',
      logo: 'https://via.placeholder.com/100x100/4285f4/ffffff?text=TC',
      memberCount: 150,
      courseCount: 12
    };
    
    setCommunityData(mockCommunityData);
    console.log('✅ Mock community data loaded for testing:', mockCommunityData);
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
    if (communityUrls) {
      navigate(communityUrls.editCourse(courseId));
    } else {
      navigate(`/edit-course/${courseId}`);
    }
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
    // { id: 'analytics', icon: <FlashIcon />, label: 'Analytics' },
    // { id: 'content', icon: <DescriptionIcon />, label: 'Content' },
  ];

  return (
    <Box className="bg-black">
      {/* Common Focused Sidebar */}
      <FocusedSidebar darkMode={darkMode} />

      {/* Main Content Area */}
      <Box sx={{
        flex: 1,
        ml: (localStorage.getItem('sidebarCollapsed') !== 'false') ? 7.5 : 30, // default collapsed
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
                Welcome to {communityData?.name || 'Your'} Dashboard
              </Typography>

              <Grid container spacing={3} sx={{ mb: 4 }}>
                {/* Total Courses */}
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
                        <SchoolIcon sx={{ color: '#0F3C60' }} />
                      </Box>
                      <Box>
                        <Typography variant="h4" sx={{ color: '#0F3C60', mb: 0 }}>
                          {courses.length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total Courses
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </Grid>

                {/* Published */}
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
                        <PublicIcon sx={{ color: '#34a853' }} />
                      </Box>
                      <Box>
                        <Typography variant="h4" sx={{ color: '#34a853', mb: 0 }}>
                          {courses.filter(c => c.status === 'published').length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Published
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </Grid>

                {/* Archived */}
                <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card
                    sx={{
                      p: 3,
                      display: 'flex',
                      alignItems: 'center',
                      background: 'linear-gradient(45deg,rgb(255, 255, 255) 30%,rgb(255, 236, 236) 90%)',
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
                        <ArchiveIcon sx={{ color: '#ea4335' }} />
                      </Box>
                      <Box>
                        <Typography variant="h4" sx={{ color: '#ea4335', mb: 0 }}>
                          {courses.filter(c => c.status === 'archived').length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Archived
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </Grid>

              </Grid>


              <Box sx={{ textAlign: 'end', py: 4 }}>
                {/* <Typography variant="h6" sx={{ mb: 2 }}>
                  Quick Actions
                </Typography> */}
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'end', flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => {
                      console.log('🎯 CommunityDashboard Create Course Button Clicked');
                      console.log('🎯 communityName:', communityName);
                      console.log('🎯 communityUrls:', communityUrls);
                      console.log('🎯 createCourse URL:', communityUrls?.createCourse);
                      
                      if (communityUrls) {
                        console.log('🎯 Navigating to:', communityUrls.createCourse);
                        navigate(communityUrls.createCourse);
                      } else {
                        console.log('🎯 Fallback: Navigating to /create-course');
                        navigate('/create-course');
                      }
                    }}
                    sx={{ mb: 2 }}
                  >
                    Create New Course
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      if (communityUrls) {
                        navigate(communityUrls.courses);
                      } else {
                        navigate('/courses');
                      }
                    }}
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
                    variant="outlined"
                    onClick={() => {
                      setOpenCourseDialog(false);
                      if (communityUrls) {
                        navigate(communityUrls.courseViewer(selectedCourse._id || selectedCourse.id));
                      } else {
                        navigate(`/course-viewer/${selectedCourse._id || selectedCourse.id}`);
                      }
                    }}
                    sx={{
                      borderColor: '#0F3C60',
                      color: '#0F3C60',
                      '&:hover': { 
                        borderColor: '#3367d6',
                        color: '#3367d6',
                        backgroundColor: 'rgba(15, 60, 96, 0.04)'
                      }
                    }}
                  >
                    View Course
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => handleEditCourse(selectedCourse._id || selectedCourse.id)}
                    sx={{
                      background: '#0F3C60',
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
