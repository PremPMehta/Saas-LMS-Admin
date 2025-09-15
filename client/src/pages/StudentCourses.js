import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FocusedSidebar from '../components/FocusedSidebar';
import FocusedTopBar from '../components/FocusedTopBar';
import { courseApi } from '../utils/courseApi';
import '../App.css';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Grid,
  Button,
  CircularProgress,
  IconButton,
  InputBase,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  PlayCircle as PlayCircleIcon,
  School as SchoolIcon,
  FilterList as FilterIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';

const StudentCourses = () => {
  const navigate = useNavigate();
  const { communityName } = useParams();
  
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [openCourseDialog, setOpenCourseDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    categories: [],
    audiences: []
  });
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    categories: false,
    audiences: false
  });

  // Mock data for testing
  const mockCourses = [
    {
      _id: '1',
      title: 'Introduction to Cryptocurrency',
      description: 'Learn the basics of cryptocurrency and blockchain technology',
      category: 'Technology',
      targetAudience: 'Beginners',
      status: 'published',
      thumbnailUrl: 'https://via.placeholder.com/300x200/4285f4/ffffff?text=Crypto+101',
      createdAt: new Date().toISOString(),
      chapters: [
        {
          title: 'What is Cryptocurrency?',
          videos: [
            { title: 'Introduction to Digital Currency', duration: '10:30' },
            { title: 'How Blockchain Works', duration: '15:45' }
          ]
        }
      ]
    },
    {
      _id: '2',
      title: 'Advanced Trading Strategies',
      description: 'Master advanced trading techniques and market analysis',
      category: 'Finance',
      targetAudience: 'Advanced',
      status: 'published',
      thumbnailUrl: 'https://via.placeholder.com/300x200/34a853/ffffff?text=Trading',
      createdAt: new Date().toISOString(),
      chapters: [
        {
          title: 'Technical Analysis',
          videos: [
            { title: 'Chart Patterns', duration: '20:15' },
            { title: 'Indicators and Oscillators', duration: '18:30' }
          ]
        }
      ]
    }
  ];

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        console.log('🎓 StudentCourses: Loading courses for community:', communityName);
        
        // Get the community ID for Crypto Manji Academy
        const communityId = '68bae2a8807f3a3bb8ac6307'; // Crypto Manji Academy ID
        
        const response = await courseApi.getCourses({ 
          community: communityId,
          status: 'published'
        });
        
        console.log('📚 StudentCourses: Fetched courses:', response);
        
        if (response.success && response.courses) {
          // Filter out test courses and normalize data
          const filteredCourses = response.courses.filter(course => {
            return course.title && 
                   course.title.trim() !== '' && 
                   course.chapters && 
                   course.chapters.length > 0 &&
                   !course.title.toLowerCase().includes('test') &&
                   !course.title.toLowerCase().includes('sample') &&
                   !course.title.toLowerCase().includes('duplicate');
          });

          const normalizedCourses = filteredCourses.map(course => ({
            _id: course._id || course.id,
            title: course.title || 'Untitled Course',
            description: course.description || 'No description available',
            category: course.category || 'Uncategorized',
            targetAudience: course.targetAudience || 'General',
            status: course.status || 'published',
            thumbnailUrl: course.thumbnail ? getThumbnailUrl(course) : 'https://via.placeholder.com/300x200/4285f4/ffffff?text=Course',
            createdAt: course.createdAt || new Date().toISOString(),
            chapters: course.chapters || []
          }));
          
          setCourses(normalizedCourses);
          console.log('✅ StudentCourses: Loaded', normalizedCourses.length, 'courses');
        } else {
          console.log('⚠️ StudentCourses: No courses found, using mock data');
          setCourses(mockCourses); // Fallback to mock data
        }
      } catch (error) {
        console.error('❌ StudentCourses: Error loading courses:', error);
        setCourses(mockCourses); // Fallback to mock data
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, [communityName]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Reload courses from API
      const communityId = '68bae2a8807f3a3bb8ac6307';
      const response = await courseApi.getCourses({ 
        community: communityId,
        status: 'published'
      });
      
      if (response.success && response.courses) {
        const filteredCourses = response.courses.filter(course => {
          return course.title && 
                 course.title.trim() !== '' && 
                 course.chapters && 
                 course.chapters.length > 0 &&
                 !course.title.toLowerCase().includes('test') &&
                 !course.title.toLowerCase().includes('sample') &&
                 !course.title.toLowerCase().includes('duplicate');
        });

        const normalizedCourses = filteredCourses.map(course => ({
          _id: course._id || course.id,
          title: course.title || 'Untitled Course',
          description: course.description || 'No description available',
          category: course.category || 'Uncategorized',
          targetAudience: course.targetAudience || 'General',
          status: course.status || 'published',
          thumbnailUrl: course.thumbnail ? getThumbnailUrl(course) : 'https://via.placeholder.com/300x200/4285f4/ffffff?text=Course',
          createdAt: course.createdAt || new Date().toISOString(),
          chapters: course.chapters || []
        }));
        
        setCourses(normalizedCourses);
        console.log('🔄 StudentCourses: Refreshed', normalizedCourses.length, 'courses');
      }
    } catch (error) {
      console.error('❌ StudentCourses: Error refreshing courses:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleViewCourse = (course) => {
    setSelectedCourse(course);
    setOpenCourseDialog(true);
  };

  const handleEnrollCourse = (course) => {
    // Navigate to course viewer for students
    console.log('🎓 StudentCourses: Enrolling in course:', course.title);
    navigate(`/${communityName}/student/course-viewer/${course._id}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getThumbnailUrl = (course) => {
    if (!course.thumbnail || course.thumbnail.trim() === '') {
      return `https://via.placeholder.com/400x225/4285f4/ffffff?text=${encodeURIComponent(course.title)}`;
    }
    
    if (course.thumbnail.startsWith('data:')) {
      return course.thumbnail;
    }
    
    if (course.thumbnail.includes('localhost')) {
      const filename = course.thumbnail.split('/').pop();
      return `${process.env.REACT_APP_API_URL || 'https://saas-lms-admin-1.onrender.com'}/uploads/${filename}`;
    }
    
    if (course.thumbnail.startsWith('https://saas-lms-admin-1.onrender.com')) {
      return course.thumbnail;
    }
    
    if (course.thumbnail.startsWith('/uploads/')) {
      return `${process.env.REACT_APP_API_URL || 'https://saas-lms-admin-1.onrender.com'}${course.thumbnail}`;
    }
    
    return `${process.env.REACT_APP_API_URL || 'https://saas-lms-admin-1.onrender.com'}/uploads/${course.thumbnail}`;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Technology': '#0F3C60',
      'Finance': '#34a853',
      'Design': '#fbbc04',
      'Marketing': '#ea4335',
      'Business': '#9c27b0',
      'Health': '#ff9800',
      'Education': '#00bcd4'
    };
    return colors[category] || '#666666';
  };

  // Filter courses based on search and selected filters
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const hasCategoryFilters = selectedFilters.categories.length > 0;
    const hasAudienceFilters = selectedFilters.audiences.length > 0;
    
    const matchesCategory = !hasCategoryFilters || selectedFilters.categories.includes(course.category);
    const matchesAudience = !hasAudienceFilters || selectedFilters.audiences.includes(course.targetAudience);
    
    return matchesSearch && matchesCategory && matchesAudience;
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading courses...</Typography>
      </Box>
    );
  }

  return (
    <Box className="bg-black">
      {/* Common Focused Sidebar */}
      <FocusedSidebar darkMode={darkMode} />

      {/* Main Content Area */}
      <Box sx={{
        flex: 1,
        ml: 30, // Account for fixed sidebar (240px)
        mt: 9, // Account for fixed top bar (70px height) + padding
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Common Focused Top Bar */}
        <FocusedTopBar darkMode={darkMode} setDarkMode={setDarkMode} />

        {/* Main Content */}
        <Box sx={{ flex: 1, px: 1, py: 4, overflow: 'visible' }}>
          <Container maxWidth="xl" sx={{ overflow: 'visible' }}>
            <Box>
              {/* Header */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem', lg: '1.5rem' } }}>
                    Available Courses
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Browse and enroll in courses ({courses.length} courses available)
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <IconButton
                    onClick={handleRefresh}
                    disabled={refreshing}
                    sx={{
                      color: '#0F3C60',
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
                </Box>
              </Box>

              {/* Stats Cards */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                {/* Total Courses */}
                <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card
                    sx={{
                      p: 3,
                      display: 'flex',
                      alignItems: 'center',
                      background: 'linear-gradient(45deg, #ffffff 30%, #edf3ff 90%)',
                      borderRadius: 3,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#0F3C60', mb: 0 }}>
                          {courses.length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total Courses
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </Grid>

                {/* Available Courses */}
                <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card
                    sx={{
                      p: 3,
                      display: 'flex',
                      alignItems: 'center',
                      background: 'linear-gradient(45deg, #ffffff 30%, #e9fbea 90%)',
                      borderRadius: 3,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#34a853', mb: 0 }}>
                          {courses.filter(c => c.status === 'published').length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Available
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </Grid>

                {/* Categories */}
                <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card
                    sx={{
                      p: 3,
                      display: 'flex',
                      alignItems: 'center',
                      background: 'linear-gradient(45deg, #ffffff 30%, #fff9e5 90%)',
                      borderRadius: 3,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
                        <FilterIcon sx={{ color: '#fbbc04' }} />
                      </Box>
                      <Box>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#fbbc04', mb: 0 }}>
                          {new Set(courses.map(c => c.category)).size}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Categories
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </Grid>

                {/* Learning Hours */}
                <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card
                    sx={{
                      p: 3,
                      display: 'flex',
                      alignItems: 'center',
                      background: 'linear-gradient(45deg, #ffffff 30%, #ffecec 90%)',
                      borderRadius: 3,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#ea4335', mb: 0 }}>
                          {courses.reduce((total, course) => {
                            const chapterCount = course.chapters?.length || 0;
                            return total + (chapterCount * 2); // Estimate 2 hours per chapter
                          }, 0)}+
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Learning Hours
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </Grid>
              </Grid>

              {/* Search and Filter Bar */}
              <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
                <Paper
                  component="form"
                  sx={{
                    p: '2px 4px',
                    display: 'flex',
                    alignItems: 'center',
                    flex: 1,
                    minWidth: 300
                  }}
                >
                  <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <IconButton type="button" sx={{ p: '10px' }}>
                    <SearchIcon />
                  </IconButton>
                </Paper>
              </Box>

              {/* Courses Grid */}
              <Box sx={{
                '& .MuiGrid-container': {
                  margin: 0,
                  width: '100%'
                },
                '& .MuiGrid-item': {
                  padding: '12px !important'
                },
                overflow: 'visible'
              }}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                  Available Courses ({filteredCourses.length})
                </Typography>

                {filteredCourses.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 8 }}>
                    <SchoolIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      No courses found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Try adjusting your search or filters
                    </Typography>
                  </Box>
                ) : (
                  <Grid container spacing={3} sx={{ justifyContent: 'flex-start' }}>
                    {filteredCourses.map((course) => (
                      <Grid item size={{ xs: 12, sm: 6, md: 6, lg: 4 }} key={course._id || course.id}>
                        <Card sx={{
                          cursor: 'pointer',
                          background: darkMode ? '#2d2d2d' : '#ffffff',
                          border: `1px solid ${darkMode ? '#404040' : '#e0e0e0'}`,
                          borderRadius: 3,
                          transition: 'all 0.3s ease',
                          overflow: 'hidden',
                          height: 520, // Fixed height for consistent alignment
                          width: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                          }
                        }} onClick={() => handleEnrollCourse(course)}>

                          {/* Course Thumbnail */}
                          <Box sx={{
                            height: 200,
                            width: '100%',
                            background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
                            flexShrink: 0 // Prevent thumbnail from shrinking
                          }}>
                            {course.thumbnailUrl && course.thumbnailUrl.trim() !== '' ? (
                              <img
                                src={course.thumbnailUrl}
                                alt={course.title}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                  objectPosition: 'center',
                                  display: 'block'
                                }}
                                onError={(e) => {
                                  // Prevent multiple error logs for the same image
                                  if (!e.target.dataset.errorLogged) {
                                    console.warn('🖼️ StudentCourses: Thumbnail failed to load for', course.title, ':', e.target.src);
                                    e.target.dataset.errorLogged = 'true';
                                  }
                                  e.target.style.display = 'none';
                                }}
                              />
                            ) : (
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  width: '100%',
                                  height: '100%',
                                  background: `linear-gradient(135deg, ${getCategoryColor(course.category)} 0%, ${getCategoryColor(course.category, true)} 100%)`
                                }}
                              >
                                <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
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
                              bgcolor: '#34a853',
                              color: 'white',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              backdropFilter: 'blur(10px)',
                              backgroundColor: '#34a853CC'
                            }}>
                              Available
                            </Box>
                          </Box>

                          <CardContent sx={{ 
                            p: 2, 
                            display: 'flex', 
                            flexDirection: 'column',
                            flex: 1,
                            justifyContent: 'space-between',
                            minHeight: 0 // Allow content to shrink if needed
                          }}>

                            {/* Top Content Section */}
                            <Box sx={{ flex: 1 }}>
                            {/* Course Title */}
                            <Typography variant="h6" sx={{
                              fontWeight: 600,
                              mb: 1,
                              color: darkMode ? '#ffffff' : '#000000',
                              lineHeight: 1.3,
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              minHeight: '2.6em', // Ensure consistent height for 2 lines
                              maxHeight: '2.6em'  // Prevent expansion beyond 2 lines
                            }}>
                              {course.title}
                            </Typography>

                            {/* Course Tags - Fixed Layout */}
                            <Box sx={{ 
                              mb: 2,
                              minHeight: '64px', // Fixed height for 2 rows of tags
                              maxHeight: '64px',
                              overflow: 'hidden'
                            }}>
                              {/* First Row - Primary Tags */}
                              <Box sx={{ 
                                display: 'flex', 
                                gap: 0.5, 
                                mb: 0.5,
                                overflow: 'hidden'
                              }}>
                                {/* Target Audience Tag */}
                                {course.targetAudience && (
                                  <Chip
                                    label={course.targetAudience}
                                    size="small"
                                    variant="outlined"
                                    sx={{
                                      fontSize: '0.7rem',
                                      height: 24,
                                      fontWeight: 500,
                                      borderColor: '#6366f1',
                                      color: '#6366f1',
                                      backgroundColor: '#6366f115',
                                      borderRadius: 2,
                                      maxWidth: '120px',
                                      '& .MuiChip-label': {
                                        px: 1,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                      },
                                      '&:hover': {
                                        backgroundColor: '#6366f125'
                                      }
                                    }}
                                  />
                                )}
                                
                                {/* Course Type Tag */}
                                {course.contentType && (
                                  <Chip
                                    label={course.contentType === 'video' ? 'Video' : 'Text'}
                                    size="small"
                                    variant="outlined"
                                    sx={{
                                      fontSize: '0.7rem',
                                      height: 24,
                                      fontWeight: 500,
                                      borderColor: course.contentType === 'video' ? '#f59e0b' : '#10b981',
                                      color: course.contentType === 'video' ? '#f59e0b' : '#10b981',
                                      backgroundColor: course.contentType === 'video' ? '#f59e0b15' : '#10b98115',
                                      borderRadius: 2,
                                      '& .MuiChip-label': {
                                        px: 1
                                      },
                                      '&:hover': {
                                        backgroundColor: course.contentType === 'video' ? '#f59e0b25' : '#10b98125'
                                      }
                                    }}
                                  />
                                )}
                              </Box>
                              
                              {/* Second Row - Category Tag */}
                              <Box sx={{ 
                                display: 'flex', 
                                gap: 0.5,
                                overflow: 'hidden'
                              }}>
                                {/* Category Tag */}
                                {course.category && (
                                  <Chip
                                    label={course.category}
                                    size="small"
                                    variant="outlined"
                                    sx={{
                                      fontSize: '0.7rem',
                                      height: 24,
                                      fontWeight: 500,
                                      borderColor: getCategoryColor(course.category),
                                      color: getCategoryColor(course.category),
                                      backgroundColor: `${getCategoryColor(course.category)}15`,
                                      borderRadius: 2,
                                      maxWidth: '200px',
                                      '& .MuiChip-label': {
                                        px: 1,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                      },
                                      '&:hover': {
                                        backgroundColor: `${getCategoryColor(course.category)}25`
                                      }
                                    }}
                                  />
                                )}
                              </Box>
                            </Box>

                            {/* Course Description */}
                            <Typography variant="body2" sx={{
                              color: 'text.secondary',
                              mb: 2,
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              lineHeight: 1.4,
                              minHeight: '2.8em', // Ensure consistent height for 2 lines
                              maxHeight: '2.8em'  // Prevent expansion beyond 2 lines
                            }}>
                              {course.description || 'No description available'}
                            </Typography>
                            </Box>

                            {/* Bottom Section - Meta and Buttons */}
                            <Box sx={{ 
                              flexShrink: 0, // Prevent this section from shrinking
                              mt: 'auto' // Push to bottom
                            }}>
                            {/* Course Meta */}
                              <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'space-between', 
                                mb: 2,
                                py: 1,
                                px: 1.5,
                                backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                                borderRadius: 1.5,
                                border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`
                              }}>
                                <Typography variant="body2" sx={{ 
                                  color: 'text.secondary',
                                  fontWeight: 500,
                                  fontSize: '0.8rem'
                                }}>
                                  Crypto Manji Academy
                                </Typography>
                                <Typography variant="body2" sx={{ 
                                  color: 'text.secondary',
                                  fontWeight: 500,
                                  fontSize: '0.8rem'
                                }}>
                                  {formatDate(course.createdAt)}
                                </Typography>
                              </Box>

                              {/* Action Buttons */}
                                <Box sx={{ 
                                  display: 'flex', 
                                  gap: 1,
                                  mt: 1,
                                  pb: 1 // Add bottom padding to ensure buttons are fully visible
                                }}>
                                <Button
                                  size="small"
                                  variant="contained"
                                  color="primary"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEnrollCourse(course);
                                  }}
                                  sx={{ flex: 1 }}
                                >
                                  Start Learning
                                </Button>
                                </Box>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
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
                                    <PlayCircleIcon sx={{ fontSize: 16, color: '#666' }} />
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
                      onClick={() => {
                        setOpenCourseDialog(false);
                        handleEnrollCourse(selectedCourse);
                      }}
                      sx={{
                        background: '#0F3C60',
                        '&:hover': { background: '#3367d6' }
                      }}
                    >
                      Start Learning
                    </Button>
                  </DialogActions>
                </>
              )}
            </Dialog>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default StudentCourses;
