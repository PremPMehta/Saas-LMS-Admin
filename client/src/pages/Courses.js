import React, { useState, useEffect } from 'react';
import courseApi from '../utils/courseApi';
import communityAuthApi from '../utils/communityAuthApi';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Avatar,
  Tooltip,
  Alert,
  CircularProgress,
  Badge,
  Switch,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  MoreVert as MoreIcon,
  VideoLibrary as VideoIcon,
  TextFields as TextIcon,
  People as PeopleIcon,
  Schedule as ScheduleIcon,
  Star as StarIcon,
  CloudUpload as UploadIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Search as SearchIcon,
  WbSunny as SunIcon,
  DarkMode as DarkIcon,
  Menu as MenuIcon,
  Home as HomeIcon,
  Dashboard as DashboardIcon,
  FlashOn as FlashIcon,
  Description as DescriptionIcon,
  ArrowBack as ArrowBackIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

const Courses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [openCourseDialog, setOpenCourseDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [communityData, setCommunityData] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Mock data for fallback
  const mockCourses = [
    {
      _id: '1',
      title: 'Complete Web Development Bootcamp',
      description: 'Learn HTML, CSS, JavaScript, React, Node.js and become a full-stack developer',
      category: 'Technology',
      status: 'published',
      instructor: 'John Doe',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: '2',
      title: 'React.js Masterclass',
      description: 'Master React.js with hooks, context, and modern development practices',
      category: 'Technology',
      status: 'published',
      instructor: 'Jane Smith',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: '3',
      title: 'Node.js Backend Development',
      description: 'Build scalable backend applications with Node.js and Express',
      category: 'Technology',
      status: 'draft',
      instructor: 'Mike Johnson',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  // Load courses from API
  useEffect(() => {
    let isMounted = true;
    let abortController = new AbortController();
    
    const loadCourses = async () => {
      try {
        setLoading(true);
        
        // Add timeout to prevent infinite loading
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 15000)
        );
        
        // Get community ID from localStorage or use a fallback
        const communityId = localStorage.getItem('communityId') || '68b03c92fac3b1af515ccc69';
        console.log('🔍 Loading courses for community:', communityId);
        
        // Try to fetch all courses first (without community filter)
        let response;
        try {
          response = await Promise.race([courseApi.getCourses({ community: communityId }), timeoutPromise]);
        } catch (communityError) {
          console.log('⚠️ Community-specific fetch failed, trying without filter:', communityError.message);
          // If community-specific fetch fails, try without community filter
          response = await Promise.race([courseApi.getCourses({}), timeoutPromise]);
        }
        
        if (!isMounted) return;
        
        let coursesData = response.courses || [];
        console.log('📊 Courses loaded:', coursesData.length, 'courses');
        console.log('📋 Course IDs:', coursesData.map(c => c._id || c.id));
        
        // If we got courses but they don't match the community, log it
        if (coursesData.length > 0) {
          const communityCourses = coursesData.filter(c => c.community === communityId);
          console.log('🏘️ Courses matching community:', communityCourses.length, 'out of', coursesData.length);
        }
        
        // Ensure we have consistent data structure
        const normalizedCourses = coursesData.map(course => ({
          _id: course._id || course.id,
          title: course.title || 'Untitled Course',
          description: course.description || '',
          category: course.category || 'Uncategorized',
          status: course.status || 'draft',
          instructor: course.instructor || 'Unknown',
          community: course.community || communityId,
          createdAt: course.createdAt || new Date().toISOString(),
          updatedAt: course.updatedAt || new Date().toISOString()
        }));
        
        // Always update with the latest data from API
        console.log('✅ Updating courses with fresh data from API');
        setCourses(normalizedCourses);
        
      } catch (error) {
        console.error('❌ Error loading courses:', error);
        if (isMounted) {
          // Use mock data as fallback
          console.log('⚠️ Using mock data due to API error:', error.message);
          console.log('📊 Mock courses loaded:', mockCourses.length, 'courses');
          setCourses(mockCourses);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Load courses immediately
    loadCourses();
    
    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, []);

  // Manual refresh function
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const communityId = localStorage.getItem('communityId') || '68b03c92fac3b1af515ccc69';
      console.log('🔄 Manual refresh: Loading courses for community:', communityId);
      
      const response = await courseApi.getCourses({ community: communityId });
      let coursesData = response.courses || [];
      
      console.log('📊 Manual refresh: Courses loaded:', coursesData.length, 'courses');
      
      const normalizedCourses = coursesData.map(course => ({
        _id: course._id || course.id,
        title: course.title || 'Untitled Course',
        description: course.description || '',
        category: course.category || 'Uncategorized',
        status: course.status || 'draft',
        instructor: course.instructor || 'Unknown',
        community: course.community || communityId,
        createdAt: course.createdAt || new Date().toISOString(),
        updatedAt: course.updatedAt || new Date().toISOString()
      }));
      
      setCourses(normalizedCourses);
      console.log('✅ Manual refresh: Courses updated successfully');
    } catch (error) {
      console.error('❌ Manual refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Course management functions
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'success';
      case 'draft':
        return 'warning';
      case 'archived':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'published':
        return <CheckCircleIcon />;
      case 'draft':
        return <WarningIcon />;
      case 'archived':
        return <ErrorIcon />;
      default:
        return <ScheduleIcon />;
    }
  };

  const handleViewCourse = (course) => {
    // Navigate to course viewer instead of opening dialog
    navigate(`/course-viewer/${course._id || course.id}`);
  };

  const handleEditCourse = (course) => {
    navigate(`/edit-course/${course._id || course.id}`);
  };

  const handleDeleteCourse = (course) => {
    setCourseToDelete(course);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!courseToDelete) return;
    
    setIsDeleting(true);
    try {
      // Delete from database
      await courseApi.deleteCourse(courseToDelete._id || courseToDelete.id);
      
      // Update local state
      setCourses(prev => prev.filter(course => (course._id || course.id) !== (courseToDelete._id || courseToDelete.id)));
      
      console.log('Course deleted successfully');
      setDeleteDialogOpen(false);
      setCourseToDelete(null);
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Failed to delete course. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setCourseToDelete(null);
  };

  // Filter courses based on search and status
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || course.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading courses...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: darkMode ? '#1a1a1a' : '#f5f5f5' }}>
      {/* Sidebar */}
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
        zIndex: 1000
      }}>
        {/* Logo */}
        <Box sx={{ mb: 4 }}>
          <Avatar sx={{ 
            bgcolor: '#4285f4', 
            width: 50, 
            height: 50,
            fontSize: '1.5rem',
            fontWeight: 'bold'
          }}>
            {communityData?.name?.charAt(0) || 'C'}
          </Avatar>
        </Box>

        {/* Navigation Items */}
        {[
          { icon: <HomeIcon />, label: 'Home', path: '/community-dashboard' },
          { icon: <VideoIcon />, label: 'Courses', path: '/courses' },
          { icon: <DashboardIcon />, label: 'Dashboard', path: '/dashboard' },
          { icon: <FlashIcon />, label: 'Analytics', path: '/analytics' },
          { icon: <DescriptionIcon />, label: 'Reports', path: '/reports' }
        ].map((item, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <IconButton
              onClick={() => navigate(item.path)}
              sx={{
                color: window.location.pathname === item.path 
                  ? (darkMode ? '#ffffff' : '#000000')
                  : (darkMode ? '#404040' : '#f0f0f0'),
              }}
            >
              {item.icon}
            </IconButton>
          </Box>
        ))}

        {/* Logout Button */}
        <Box sx={{ mt: 'auto', mb: 2 }}>
          <IconButton 
            onClick={() => {
              communityAuthApi.logout();
              navigate('/community-login');
            }}
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
              <VideoIcon />
            </Avatar>
            <Typography variant="h6" sx={{ 
              fontWeight: 700,
              color: darkMode ? '#ffffff' : '#000000'
            }}>
              {communityData?.name || 'Community'} Hub
            </Typography>
          </Box>

          {/* Right - Theme Toggle */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              onClick={() => setDarkMode(!darkMode)}
              sx={{ color: darkMode ? '#ffffff' : '#000000' }}
            >
              {darkMode ? <SunIcon /> : <DarkIcon />}
            </IconButton>
          </Box>
        </Box>

        {/* Main Content */}
        <Box sx={{ flex: 1, p: 4 }}>
          <Container maxWidth="xl">
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Loading courses from database...</Typography>
              </Box>
            ) : (
              <Box>
                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                      My Courses
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Manage and track all your created courses ({courses.length} courses)
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <IconButton
                      onClick={handleRefresh}
                      disabled={refreshing}
                      sx={{ 
                        color: '#4285f4',
                        '&:hover': { backgroundColor: 'rgba(66, 133, 244, 0.1)' }
                      }}
                      title="Refresh courses"
                    >
                      <RefreshIcon sx={{ 
                        animation: refreshing ? 'spin 1s linear infinite' : 'none',
                        '@keyframes spin': {
                          '0%': { transform: 'rotate(0deg)' },
                          '100%': { transform: 'rotate(360deg)' }
                        }
                      }} />
                    </IconButton>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => navigate('/create-course')}
                      sx={{
                        background: '#4285f4',
                        '&:hover': { background: '#3367d6' }
                      }}
                    >
                      Create New Course
                    </Button>
                  </Box>
                </Box>

                {/* Stats Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: '#4285f4' }}>
                              {courses.length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Total Courses
                            </Typography>
                          </Box>
                          <VideoIcon sx={{ fontSize: 40, color: '#4285f4' }} />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: '#34a853' }}>
                              {courses.filter(c => c.status === 'published').length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Published
                            </Typography>
                          </Box>
                          <CheckCircleIcon sx={{ fontSize: 40, color: '#34a853' }} />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: '#fbbc04' }}>
                              {courses.filter(c => c.status === 'draft').length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Drafts
                            </Typography>
                          </Box>
                          <WarningIcon sx={{ fontSize: 40, color: '#fbbc04' }} />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: '#ea4335' }}>
                              {String(courses.reduce((total, course) => total + (course.students || 0), 0))}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Total Students
                            </Typography>
                          </Box>
                          <PeopleIcon sx={{ fontSize: 40, color: '#ea4335' }} />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                {/* Filters and Search */}
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          placeholder="Search courses..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          InputProps={{
                            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <FormControl fullWidth>
                          <InputLabel>Status</InputLabel>
                          <Select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            label="Status"
                          >
                            <MenuItem value="all">All Status</MenuItem>
                            <MenuItem value="published">Published</MenuItem>
                            <MenuItem value="draft">Draft</MenuItem>
                            <MenuItem value="archived">Archived</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Typography variant="body2" color="text.secondary">
                          Showing {filteredCourses.length} of {courses.length} courses
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                {/* Courses Grid */}
                <Box sx={{ 
                  '& .MuiGrid-container': {
                    margin: 0,
                    width: '100%'
                  },
                  '& .MuiGrid-item': {
                    padding: '12px !important'
                  }
                }}>
                  <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                    {communityData?.name || 'My'} Courses ({filteredCourses.length})
                  </Typography>
                  
                  {/* Debug Info */}
                  <Box sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Debug: {courses.length} total courses, {filteredCourses.length} filtered, Loading: {loading.toString()}, Refreshing: {refreshing.toString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Community ID: {localStorage.getItem('communityId') || '68b03c92fac3b1af515ccc69'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Course IDs: {courses.map(c => c._id).join(', ')}
                    </Typography>
                  </Box>

                  {filteredCourses.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        No courses found
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 3 }}>
                        {searchTerm || filterStatus !== 'all' 
                          ? 'Try adjusting your search or filters' 
                          : 'Create your first course to get started'
                        }
                      </Typography>
                      {!searchTerm && filterStatus === 'all' && (
                        <Button
                          variant="contained"
                          startIcon={<AddIcon />}
                          onClick={() => navigate('/create-course')}
                        >
                          Create First Course
                        </Button>
                      )}
                    </Box>
                  ) : (
                    <Grid container spacing={3} sx={{ justifyContent: 'flex-start' }}>
                      {filteredCourses.map((course) => (
                        <Grid item xs={12} sm={6} lg={3} key={course._id || course.id}>
                          <Card sx={{ 
                            cursor: 'pointer',
                            background: darkMode ? '#2d2d2d' : '#ffffff',
                            border: `1px solid ${darkMode ? '#404040' : '#e0e0e0'}`,
                            borderRadius: 3,
                            transition: 'all 0.3s ease',
                            overflow: 'hidden',
                            height: 450, // Fixed height for consistent card size
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
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
                              {course.thumbnail && course.thumbnail !== 'https://via.placeholder.com/300x200/4285f4/ffffff?text=Course' && course.thumbnail !== 'https://via.placeholder.com/300x200/4285f4/ffffff?text=Test+Course' ? (
                                <img 
                                  src={course.thumbnail} 
                                  alt={course.title}
                                  style={{ 
                                    width: '100%', 
                                    height: '100%', 
                                    objectFit: 'cover' 
                                  }}
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
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
                            
                            <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
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
                                  <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>
                                    {course.category.charAt(0)}
                                  </Typography>
                                </Box>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                  {course.category}
                                </Typography>
                              </Box>
                              
                              {/* Course Title */}
                              <Typography variant="h6" sx={{ 
                                fontWeight: 600, 
                                mb: 1,
                                color: darkMode ? '#ffffff' : '#000000',
                                lineHeight: 1.3
                              }}>
                                {course.title}
                              </Typography>
                              
                              {/* Course Description */}
                              <Typography variant="body2" sx={{ 
                                color: 'text.secondary',
                                mb: 2,
                                flexGrow: 1,
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                              }}>
                                {course.description}
                              </Typography>
                              
                              {/* Course Meta */}
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                  By {course.instructor}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                  {new Date(course.createdAt).toLocaleDateString()}
                                </Typography>
                              </Box>
                              
                              {/* Action Buttons */}
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewCourse(course);
                                  }}
                                  sx={{ flex: 1 }}
                                >
                                  View
                                </Button>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditCourse(course);
                                  }}
                                  sx={{ flex: 1 }}
                                >
                                  Edit
                                </Button>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  color="error"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteCourse(course._id || course.id);
                                  }}
                                  sx={{ flex: 1 }}
                                >
                                  Delete
                                </Button>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Box>
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
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Course Details
                      </Typography>
                      <Chip
                        icon={getStatusIcon(selectedCourse.status)}
                        label={selectedCourse.status.charAt(0).toUpperCase() + selectedCourse.status.slice(1)}
                        color={getStatusColor(selectedCourse.status)}
                      />
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
                            <Typography variant="subtitle2" color="text.secondary">
                              Category
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {selectedCourse.category}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Target Audience
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {selectedCourse.targetAudience}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Content Type
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {selectedCourse.contentType === 'video' ? (
                                <VideoIcon sx={{ fontSize: 20, color: '#4285f4' }} />
                              ) : (
                                <TextIcon sx={{ fontSize: 20, color: '#34a853' }} />
                              )}
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {selectedCourse.contentType === 'video' ? 'Video Based' : 'Text Based'}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Duration
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {selectedCourse.duration || 'Not specified'}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Students Enrolled
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {selectedCourse.students?.toLocaleString() || '0'}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Rating
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <StarIcon sx={{ fontSize: 16, color: '#fbbc04' }} />
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {selectedCourse.rating || '0'}/5.0
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setOpenCourseDialog(false)}>Close</Button>
                    <Button
                      variant="contained"
                      onClick={() => handleEditCourse(selectedCourse)}
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

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={cancelDelete} maxWidth="sm" fullWidth>
              <DialogTitle>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Delete Course
                </Typography>
              </DialogTitle>
              <DialogContent>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Are you sure you want to delete the course "{courseToDelete?.title}"?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This action cannot be undone. All course content, chapters, and videos will be permanently deleted.
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={cancelDelete} disabled={isDeleting}>
                  Cancel
                </Button>
                <Button
                  onClick={confirmDelete}
                  variant="contained"
                  color="error"
                  disabled={isDeleting}
                  startIcon={isDeleting ? <CircularProgress size={20} /> : <DeleteIcon />}
                >
                  {isDeleting ? 'Deleting...' : 'Delete Course'}
                </Button>
              </DialogActions>
            </Dialog>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default Courses;
