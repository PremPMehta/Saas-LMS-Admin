import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Chip,
  Card,
  CardMedia,
  CardContent,
  Avatar,
  Button,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Search as SearchIcon,
  People as PeopleIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  PlayArrow as PlayIcon,
  Description as DescriptionIcon,
  TextFields as TextIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getCommunityUrls } from '../utils/communityUrlUtils';
import { courseApi } from '../utils/courseApi';
import { DETAILED_CATEGORIES } from '../config/categories';
import CourseLoginModal from '../components/CourseLoginModal';

const communities = [
  {
    id: 1,
    name: "Modern Web Development",
    description: "Learn modern web development with React, Node.js, and the latest technologies! 🚀 Join thousands of developers.",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=200&fit=crop",
    members: 2400,
    price: "$29/month",
    category: "Tech",
    featured: true
  },
  {
    id: 2,
    name: "Digital Marketing Masters",
    description: "Master digital marketing strategies, SEO, social media, and grow your business online! 📈",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop",
    members: 1800,
    price: "Free",
    category: "Money"
  },
  {
    id: 3,
    name: "Fitness & Wellness Community",
    description: "Transform your health with our supportive fitness community. Workouts, nutrition, and motivation! 💪",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop",
    members: 3200,
    price: "$19/month",
    category: "Health"
  },
  {
    id: 4,
    name: "Creative Photography Hub",
    description: "Elevate your photography skills with tips, challenges, and a community of passionate photographers! 📸",
    image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400&h=200&fit=crop",
    members: 1500,
    price: "$15/month",
    category: "Hobbies"
  },
  {
    id: 5,
    name: "Mindfulness & Meditation",
    description: "Find inner peace and spiritual growth through guided meditation and mindfulness practices. 🧘‍♀️",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop",
    members: 2100,
    price: "Free",
    category: "Spirituality"
  },
  {
    id: 6,
    name: "Music Production Academy",
    description: "Create amazing music! Learn production, mixing, and collaborate with fellow music creators. 🎵",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=200&fit=crop",
    members: 980,
    price: "$39/month",
    category: "Music"
  },
  {
    id: 7,
    name: "Entrepreneurship Bootcamp",
    description: "Build your startup from idea to launch! Get mentorship, funding tips, and network with founders. 🚀",
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=200&fit=crop",
    members: 1750,
    price: "$49/month",
    category: "Money"
  },
  {
    id: 8,
    name: "Digital Art & Design",
    description: "Master digital art, UI/UX design, and creative tools. Showcase your work and get feedback! 🎨",
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=200&fit=crop",
    members: 2800,
    price: "$25/month",
    category: "Hobbies"
  },
  {
    id: 9,
    name: "Personal Development Hub",
    description: "Transform your life with proven strategies for success, productivity, and personal growth. 📈",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=200&fit=crop",
    members: 3500,
    price: "Free",
    category: "Self-improvement"
  }
];

// Use centralized categories from config - convert to chip format
const categories = [
  { label: 'All', value: 'all', color: 'default' },
  ...DETAILED_CATEGORIES.map(category => ({
    label: category,
    value: category.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    color: 'primary'
  }))
];

const Discovery = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const [showUserSignIn, setShowUserSignIn] = useState(true);
  const [courses, setCourses] = useState([]);
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [categoryScrollPosition, setCategoryScrollPosition] = useState(0);
  
  // Category slider functions
  const scrollCategories = (direction) => {
    const container = document.getElementById('category-slider');
    if (container) {
      const scrollAmount = 200; // Adjust scroll distance
      const newPosition = direction === 'left' 
        ? Math.max(0, categoryScrollPosition - scrollAmount)
        : categoryScrollPosition + scrollAmount;
      
      container.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
      setCategoryScrollPosition(newPosition);
    }
  };
  
  // Get community URLs for proper navigation
  const communityUrls = getCommunityUrls();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (loginDropdownOpen && !event.target.closest('[data-login-dropdown]')) {
        setLoginDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [loginDropdownOpen]);

  // Handle course click
  const handleCourseClick = (course) => {
    setSelectedCourse({
      id: course.id,
      name: course.name,
      communityName: course.communityName || 'crypto-manji-academy'
    });
    setCourseModalOpen(true);
  };

  const [filteredCommunities, setFilteredCommunities] = useState([]);

  // Fetch courses from database
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        // Fetch all published courses for discovery
        const response = await courseApi.getCourses({ discovery: 'true' });
        if (response.success && response.courses) {
          // Normalize course data for display
          const normalizedCourses = response.courses.map(course => {
            
            return {
              id: course._id || course.id,
              title: course.title || 'Untitled Course',
              description: course.description || 'No description available',
              category: course.category || 'Uncategorized',
              status: course.status || 'published',
              thumbnail: course.thumbnail || '', // Keep empty string instead of null
              targetAudience: course.targetAudience || null,
              contentType: course.contentType || 'video',
              subType: course.subType || null,
              chapters: course.chapters || [],
              createdAt: course.createdAt || new Date().toISOString(),
              updatedAt: course.updatedAt || new Date().toISOString()
            };
          });
          
          setCourses(normalizedCourses);
          setFilteredCommunities(normalizedCourses);
        } else {
          setError('Failed to fetch courses');
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        setError('Failed to load courses. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Filter courses based on search and category
  useEffect(() => {
    let filtered = courses;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(course => course.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCommunities(filtered);
  }, [searchTerm, selectedCategory, courses]);

  const formatMemberCount = (count) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ bgcolor: 'white', borderBottom: '1px solid #e9ecef', py: 2 }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1, #96CEB4)',
                backgroundSize: '400% 400%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'gradient 3s ease infinite',
                '@keyframes gradient': {
                  '0%': { backgroundPosition: '0% 50%' },
                  '50%': { backgroundPosition: '100% 50%' },
                  '100%': { backgroundPosition: '0% 50%' }
                }
              }}
            >
              Bell & Desk
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Box sx={{ position: 'relative' }} data-login-dropdown>
                <Button 
                  variant="outlined" 
                  onClick={() => {
                    setLoginDropdownOpen(!loginDropdownOpen);
                    setShowUserSignIn(false);
                  }}
                  endIcon={<KeyboardArrowDownIcon sx={{ 
                    transition: 'transform 0.2s ease',
                    transform: loginDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                  }} />}
                  sx={{ 
                    textTransform: 'none',
                    borderRadius: '25px',
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    borderColor: '#667eea',
                    color: '#667eea',
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: '#667eea',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                      '& .MuiSvgIcon-root': {
                        color: 'white'
                      }
                    }
                  }}
                >
                  LOG IN
                </Button>
              
              {loginDropdownOpen && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    mt: 1.5,
                    bgcolor: 'white',
                    borderRadius: 3,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)',
                    border: '1px solid rgba(0,0,0,0.08)',
                    zIndex: 1000,
                    minWidth: 240,
                    overflow: 'hidden',
                    backdropFilter: 'blur(10px)',
                    animation: 'fadeInScale 0.2s ease-out',
                    '@keyframes fadeInScale': {
                      '0%': {
                        opacity: 0,
                        transform: 'translateY(-8px) scale(0.95)'
                      },
                      '100%': {
                        opacity: 1,
                        transform: 'translateY(0) scale(1)'
                      }
                    }
                  }}
                >
                  <Button
                    fullWidth
                    onClick={() => {
                      navigate('/community-login');
                      setLoginDropdownOpen(false);
                    }}
                    sx={{
                      textTransform: 'none',
                      justifyContent: 'flex-start',
                      px: 3,
                      py: 2.5,
                      borderRadius: 0,
                      color: '#2c3e50',
                      fontWeight: 500,
                      fontSize: '0.95rem',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        transform: 'translateX(4px)',
                        '& .MuiSvgIcon-root': {
                          color: 'white'
                        }
                      }
                    }}
                  >
                    <BusinessIcon sx={{ 
                      mr: 2.5, 
                      fontSize: 22,
                      color: '#667eea',
                      transition: 'color 0.2s ease'
                    }} />
                    Login as Community
                  </Button>
                  
                  <Box sx={{ 
                    height: '1px', 
                    background: 'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.1) 50%, transparent 100%)',
                    mx: 2
                  }} />
                  
                  <Button
                    fullWidth
                    onClick={() => {
                      navigate('/community-user-login');
                      setLoginDropdownOpen(false);
                    }}
                    sx={{
                      textTransform: 'none',
                      justifyContent: 'flex-start',
                      px: 3,
                      py: 2.5,
                      borderRadius: 0,
                      color: '#2c3e50',
                      fontWeight: 500,
                      fontSize: '0.95rem',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        color: 'white',
                        transform: 'translateX(4px)',
                        '& .MuiSvgIcon-root': {
                          color: 'white'
                        }
                      }
                    }}
                  >
                    <PersonIcon sx={{ 
                      mr: 2.5, 
                      fontSize: 22,
                      color: '#f093fb',
                      transition: 'color 0.2s ease'
                    }} />
                    Login as Community User
                  </Button>
                  
                  {showUserSignIn && (
                    <>
                      <Box sx={{ 
                        height: '1px', 
                        background: 'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.1) 50%, transparent 100%)',
                        mx: 2
                      }} />
                      <Button
                        fullWidth
                        onClick={() => {
                          navigate('/login');
                          setLoginDropdownOpen(false);
                        }}
                        sx={{
                          textTransform: 'none',
                          justifyContent: 'flex-start',
                          px: 3,
                          py: 2.5,
                          borderRadius: 0,
                          color: '#2c3e50',
                          fontWeight: 500,
                          fontSize: '0.95rem',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            bgcolor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                            color: 'white',
                            transform: 'translateX(4px)',
                            '& .MuiSvgIcon-root': {
                              color: 'white'
                            }
                          }
                        }}
                      >
                        <PersonIcon sx={{ 
                          mr: 2.5, 
                          fontSize: 22,
                          color: '#4facfe',
                          transition: 'color 0.2s ease'
                        }} />
                        Sign in as User
                      </Button>
                    </>
                  )}
                </Box>
              )}
              </Box>
              
              <Button 
                variant="contained" 
                onClick={() => navigate('/community-user-signup')}
                sx={{ 
                  textTransform: 'none',
                  borderRadius: '20px',
                  px: 3,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                  }
                }}
              >
                SIGN UP
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Hero Section */}
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 'bold', 
              mb: 2,
              fontSize: { xs: '2rem', md: '3rem' }
            }}
          >
            Discover courses
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            or{' '}
            <Button
              variant="text"
              disabled
              sx={{ 
                color: '#0F3C60',
                textTransform: 'none',
                fontSize: '1.25rem',
                fontWeight: 400,
                p: 0,
                minWidth: 'auto',
                opacity: 0.6,
                cursor: 'not-allowed',
                '&:hover': {
                  backgroundColor: 'transparent',
                  color: '#0F3C60',
                  textDecoration: 'none'
                }
              }}
            >
              Create Your Own Community
            </Button>
          </Typography>

          {/* Search Bar */}
          <Paper 
            elevation={1}
            sx={{ 
              maxWidth: 600, 
              mx: 'auto', 
              mb: 4,
              borderRadius: '50px',
              overflow: 'hidden'
            }}
          >
            <TextField
              fullWidth
              placeholder="Search for courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                sx: { 
                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                  py: 1.5,
                  px: 2
                }
              }}
              variant="outlined"
            />
          </Paper>

          {/* Category Filters with Slider */}
          <Box sx={{ position: 'relative', width: '100%', maxWidth: '800px', mx: 'auto' }}>
            {/* Left Arrow */}
            <Button
              onClick={() => scrollCategories('left')}
              disabled={categoryScrollPosition === 0}
              sx={{
                position: 'absolute',
                left: -50,
                top: '50%',
                transform: 'translateY(-50%)',
                minWidth: 40,
                height: 40,
                borderRadius: '50%',
                bgcolor: 'background.paper',
                boxShadow: 2,
                zIndex: 2,
                '&:hover': { bgcolor: 'action.hover' },
                '&:disabled': { opacity: 0.3 }
              }}
            >
              <ChevronLeftIcon />
            </Button>

            {/* Right Arrow */}
            <Button
              onClick={() => scrollCategories('right')}
              sx={{
                position: 'absolute',
                right: -50,
                top: '50%',
                transform: 'translateY(-50%)',
                minWidth: 40,
                height: 40,
                borderRadius: '50%',
                bgcolor: 'background.paper',
                boxShadow: 2,
                zIndex: 2,
                '&:hover': { bgcolor: 'action.hover' }
              }}
            >
              <ChevronRightIcon />
            </Button>

            {/* Scrollable Category Container */}
            <Box
              id="category-slider"
              sx={{
                display: 'flex',
                gap: 1,
                overflowX: 'auto',
                scrollbarWidth: 'none', // Firefox
                '&::-webkit-scrollbar': { display: 'none' }, // Chrome/Safari
                px: 1,
                py: 1
              }}
            >
              {categories.map((category) => (
                <Chip
                  key={category.value}
                  label={category.label}
                  onClick={() => setSelectedCategory(category.value)}
                  variant={selectedCategory === category.value ? 'filled' : 'outlined'}
                  color={selectedCategory === category.value ? 'primary' : 'default'}
                  sx={{ 
                    borderRadius: '20px',
                    px: 1,
                    flexShrink: 0, // Prevent chips from shrinking
                    '&:hover': { bgcolor: selectedCategory === category.value ? undefined : '#f5f5f5' }
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>

        {/* Loading and Error States */}
        {loading && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
              Loading courses...
            </Typography>
          </Box>
        )}

        {error && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Alert severity="error" sx={{ maxWidth: 600, mx: 'auto' }}>
              {error}
            </Alert>
          </Box>
        )}

        {/* Communities Grid - Force 3 cards per row */}
        {!loading && !error && (
          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(3, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(3, 1fr)',
                xl: 'repeat(3, 1fr)'
              },
              gap: 3,
              maxWidth: '1400px',
              mx: 'auto'
            }}
          >
            {filteredCommunities.map((community, index) => (
              <Card 
                key={community.id || index}
                onClick={() => handleCourseClick(community)}
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3,
                  overflow: 'hidden',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                  },
                  position: 'relative'
                }}
              >
                {/* Ranking Badge */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 12,
                    left: 12,
                    bgcolor: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    borderRadius: '50%',
                    width: 32,
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                    zIndex: 1
                  }}
                >
                  #{index + 1}
                </Box>

                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="160"
                    image={(() => {
                      // If no thumbnail, create a custom SVG placeholder
                      if (!community.thumbnail || community.thumbnail.trim() === '') {
                        const title = community.title || 'Course';
                        const category = community.category || 'Education';
                        const truncatedTitle = title.length > 25 ? title.substring(0, 25) + '...' : title;
                        
                        const svgContent = `
                          <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                              <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style="stop-color:#4285f4;stop-opacity:1" />
                                <stop offset="100%" style="stop-color:#34a853;stop-opacity:1" />
                              </linearGradient>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#grad)"/>
                            <text x="50%" y="45%" font-family="Arial, sans-serif" font-size="18" font-weight="bold" 
                                  text-anchor="middle" dominant-baseline="middle" fill="white" 
                                  text-shadow="2px 2px 4px rgba(0,0,0,0.5)">
                              ${truncatedTitle}
                            </text>
                            <text x="50%" y="65%" font-family="Arial, sans-serif" font-size="12" 
                                  text-anchor="middle" dominant-baseline="middle" fill="white" 
                                  opacity="0.9">
                              ${category}
                            </text>
                            <circle cx="50%" cy="80%" r="8" fill="white" opacity="0.3"/>
                            <polygon points="46%,78% 46%,82% 50%,80%" fill="white" opacity="0.7"/>
                          </svg>
                        `;
                        return `data:image/svg+xml;base64,${btoa(svgContent)}`;
                      }
                      
                      // If it's a data URL, use it directly
                      if (community.thumbnail.startsWith('data:')) {
                        return community.thumbnail;
                      }
                      
                      // If it's already a full URL (http/https), use it directly
                      if (community.thumbnail.startsWith('http')) {
                        return community.thumbnail;
                      }
                      
                      // If it's a localhost URL, replace with production URL
                      if (community.thumbnail.includes('localhost')) {
                        const filename = community.thumbnail.split('/').pop();
                        return `${process.env.REACT_APP_API_URL || 'https://saas-lms-admin-1.onrender.com'}/uploads/${filename}`;
                      }
                      
                      // If it starts with /uploads, construct the full URL
                      if (community.thumbnail.startsWith('/uploads/')) {
                        return `${process.env.REACT_APP_API_URL || 'https://saas-lms-admin-1.onrender.com'}${community.thumbnail}`;
                      }
                      
                      // If it's just a filename, add /uploads/ prefix
                      return `${process.env.REACT_APP_API_URL || 'https://saas-lms-admin-1.onrender.com'}/uploads/${community.thumbnail}`;
                    })()}
                    alt={community.title}
                    sx={{
                      objectFit: 'cover',
                      objectPosition: 'center'
                    }}
                    onError={(e) => {
                      // If external thumbnail fails, show a simple fallback
                      e.target.style.display = 'none';
                      const fallbackDiv = e.target.parentElement.querySelector('.thumbnail-fallback');
                      if (!fallbackDiv) {
                        const newFallback = document.createElement('div');
                        newFallback.className = 'thumbnail-fallback';
                        newFallback.style.cssText = `
                          display: flex;
                          align-items: center;
                          justify-content: center;
                          height: 160px;
                          background: linear-gradient(135deg, #4285f4 0%, #34a853 100%);
                          color: white;
                          font-weight: bold;
                          font-size: 14px;
                          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
                          text-align: center;
                          padding: 10px;
                          word-break: break-word;
                        `;
                        newFallback.textContent = community.title;
                        e.target.parentElement.appendChild(newFallback);
                      }
                    }}
                  />
                  
                  {/* Play Button Overlay */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      background: 'rgba(0,0,0,0.7)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s ease',
                      opacity: 0,
                      '&:hover': {
                        opacity: 1,
                        transform: 'translate(-50%, -50%) scale(1.1)'
                      }
                    }}
                  >
                    <PlayIcon sx={{ color: 'white', fontSize: 24, ml: 0.5 }} />
                  </Box>
                </Box>
                
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar 
                      sx={{ 
                        width: 24, 
                        height: 24, 
                        mr: 1,
                        bgcolor: 'primary.main',
                        fontSize: '0.75rem'
                      }}
                    >
                      {community.title.charAt(0)}
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {community.title}
                    </Typography>
                  </Box>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ mb: 3, lineHeight: 1.5 }}
                  >
                    {community.description}
                  </Typography>
                  
                  {/* Course Tags */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {/* Target Audience Tag */}
                    {community.targetAudience && (
                      <Chip
                        label={community.targetAudience}
                        size="small"
                        variant="outlined"
                        sx={{
                          fontSize: '0.75rem',
                          height: 24,
                          borderColor: '#e0e0e0',
                          color: '#666',
                          '& .MuiChip-label': {
                            px: 1
                          }
                        }}
                      />
                    )}
                    
                    {/* Category Tag */}
                    {community.category && (
                      <Chip
                        label={community.category}
                        size="small"
                        variant="outlined"
                        sx={{
                          fontSize: '0.75rem',
                          height: 24,
                          borderColor: '#0F3C60',
                          color: '#0F3C60',
                          backgroundColor: '#0F3C6015',
                          '& .MuiChip-label': {
                            px: 1
                          }
                        }}
                      />
                    )}
                    
                    {/* Course Type Tag */}
                    {community.contentType && (
                      <Chip
                        icon={community.contentType === 'video' ? <PlayIcon /> : <TextIcon />}
                        label={community.contentType === 'video' ? 'Video' : 'Text'}
                        size="small"
                        variant="outlined"
                        sx={{
                          fontSize: '0.75rem',
                          height: 24,
                          borderColor: community.contentType === 'video' ? '#0F3C60' : '#34a853',
                          color: community.contentType === 'video' ? '#0F3C60' : '#34a853',
                          backgroundColor: community.contentType === 'video' ? '#0F3C6015' : '#34a85315',
                          '& .MuiChip-label': {
                            px: 1
                          }
                        }}
                      />
                    )}
                    
                    {/* Sub Type Tag */}
                    {community.subType && (
                      <Chip
                        label={community.subType}
                        size="small"
                        variant="outlined"
                        sx={{
                          fontSize: '0.75rem',
                          height: 24,
                          borderColor: '#9c27b0',
                          color: '#9c27b0',
                          backgroundColor: '#9c27b015',
                          '& .MuiChip-label': {
                            px: 1
                          }
                        }}
                      />
                    )}
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PeopleIcon sx={{ fontSize: '1rem', mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {community.chapters?.length || 0} Chapters
                      </Typography>
                    </Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 'bold',
                        color: 'success.main'
                      }}
                    >
                      Free
                    </Typography>
                  </Box>
                  
                  {/* Click to Preview Button */}
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<PlayIcon />}
                    sx={{
                      textTransform: 'none',
                      borderRadius: 2,
                      borderColor: '#0F3C60',
                      color: '#0F3C60',
                      '&:hover': {
                        borderColor: '#3367d6',
                        backgroundColor: '#0F3C6015'
                      }
                    }}
                  >
                    View Preview
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}

        {/* No Results */}
        {!loading && !error && filteredCommunities.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No courses found matching your criteria
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Try adjusting your search or category filter
            </Typography>
          </Box>
        )}
      </Container>

      {/* Course Login Modal */}
      <CourseLoginModal
        open={courseModalOpen}
        onClose={() => setCourseModalOpen(false)}
        courseData={selectedCourse}
      />

    </Box>
  );
};

export default Discovery;
