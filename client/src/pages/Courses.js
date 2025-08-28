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
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Courses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCourseDialog, setOpenCourseDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [communityData, setCommunityData] = useState(null);

  // Check authentication on component mount
  useEffect(() => {
    if (!communityAuthApi.isAuthenticated()) {
      console.log('❌ User not authenticated, redirecting to login...');
      navigate('/community-login');
      return;
    }

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
        
        const response = await courseApi.getCourses({ community: currentCommunity.id });
        console.log('✅ API Response:', response);
        console.log('📚 Courses loaded:', response.courses?.length || 0);
        setCourses(response.courses || []);
        
      } catch (error) {
        console.error('❌ Error loading courses:', error);
        
        if (error.message.includes('unauthorized') || error.message.includes('token')) {
          console.log('❌ Authentication error, redirecting to login...');
          communityAuthApi.logout();
          navigate('/community-login');
          return;
        }
        
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    if (communityAuthApi.isAuthenticated()) {
      console.log('🚀 Loading courses for authenticated user...');
      loadCourses();
    }
  }, [navigate]);

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
    {
      id: '1',
      title: 'Complete React Development Course',
      description: 'Learn React from scratch to advanced concepts',
      category: 'Development',
      targetAudience: 'Intermediate',
      contentType: 'video',
      status: 'published',
      thumbnail: 'https://via.placeholder.com/300x200/4285f4/ffffff?text=React+Course',
      chapters: 12,
      totalVideos: 45,
      totalLessons: 45,
      duration: '15h 30m',
      students: 1250,
      rating: 4.8,
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20',
      instructor: 'John Doe',
    },
    {
      id: '2',
      title: 'UI/UX Design Fundamentals',
      description: 'Master the basics of user interface and user experience design',
      category: 'Design',
      targetAudience: 'Beginners',
      contentType: 'video',
      status: 'draft',
      thumbnail: 'https://via.placeholder.com/300x200/34a853/ffffff?text=UI+UX+Design',
      chapters: 8,
      totalVideos: 32,
      totalLessons: 32,
      duration: '12h 15m',
      students: 890,
      rating: 4.6,
      createdAt: '2024-01-10',
      updatedAt: '2024-01-18',
      instructor: 'Jane Smith',
    },
    {
      id: '3',
      title: 'Digital Marketing Masterclass',
      description: 'Comprehensive guide to digital marketing strategies',
      category: 'Marketing',
      targetAudience: 'Advanced',
      contentType: 'text',
      status: 'published',
      thumbnail: 'https://via.placeholder.com/300x200/ea4335/ffffff?text=Marketing',
      chapters: 15,
      totalVideos: 0,
      totalLessons: 60,
      duration: '20h 45m',
      students: 2100,
      rating: 4.9,
      createdAt: '2024-01-05',
      updatedAt: '2024-01-22',
      instructor: 'Mike Johnson',
    },
    {
      id: '4',
      title: 'Data Science for Beginners',
      description: 'Introduction to data science and machine learning',
      category: 'Data Science',
      targetAudience: 'Beginners',
      contentType: 'video',
      status: 'archived',
      thumbnail: 'https://via.placeholder.com/300x200/ff6b35/ffffff?text=Data+Science',
      chapters: 10,
      totalVideos: 38,
      totalLessons: 38,
      duration: '18h 20m',
      students: 750,
      rating: 4.7,
      createdAt: '2023-12-20',
      updatedAt: '2024-01-15',
      instructor: 'Sarah Wilson',
    },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCourses(mockCourses);
      setLoading(false);
    }, 1000);
  }, []);

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
    setSelectedCourse(course);
    setOpenCourseDialog(true);
  };

  const handleEditCourse = (courseId) => {
    navigate(`/edit-course/${courseId}`);
  };

  const handleDeleteCourse = (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      setCourses(prev => prev.filter(course => course.id !== courseId));
    }
  };

  const handleStatusChange = (courseId, newStatus) => {
    setCourses(prev => prev.map(course => 
      course.id === courseId ? { ...course, status: newStatus } : course
    ));
  };

  const filteredCourses = courses.filter(course => {
    const matchesStatus = filterStatus === 'all' || course.status === filterStatus;
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            My Courses
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and track all your created courses
          </Typography>
        </Box>
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
                    {courses.reduce((total, course) => total + course.students, 0)}
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
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search courses by title, description, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status Filter</InputLabel>
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  label="Status Filter"
                >
                  <MenuItem value="all">All Courses</MenuItem>
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
      <Box>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          {communityData?.name || 'My'} Courses ({filteredCourses.length})
        </Typography>
        
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
          <Grid container spacing={3}>
            {filteredCourses.map((course) => (
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
                        <VideoIcon sx={{ fontSize: 16, color: '#666' }} />
                        <Typography variant="caption" sx={{ color: '#666' }}>
                          {course.chaptersCount || course.chapters?.length || 0} chapters
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <PlayIcon sx={{ fontSize: 16, color: '#666' }} />
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
                        {selectedCourse.duration}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Students Enrolled
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {selectedCourse.students.toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Rating
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <StarIcon sx={{ fontSize: 16, color: '#fbbc04' }} />
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {selectedCourse.rating}/5.0
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
                onClick={() => handleEditCourse(selectedCourse.id)}
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
    </Container>
  );
};

export default Courses;
