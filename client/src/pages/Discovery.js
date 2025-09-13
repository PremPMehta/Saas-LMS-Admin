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
  TextFields as TextIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getCommunityUrls } from '../utils/communityUrlUtils';
import { courseApi } from '../utils/courseApi';

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

const categories = [
  { label: 'All', value: 'all', color: 'default' },
  { label: '🎨 Hobbies', value: 'Hobbies', color: 'warning' },
  { label: '🎵 Music', value: 'Music', color: 'secondary' },
  { label: '💰 Money', value: 'Money', color: 'success' },
  { label: '🙏 Spirituality', value: 'Spirituality', color: 'info' },
  { label: '💻 Tech', value: 'Tech', color: 'primary' },
  { label: '🏃 Health', value: 'Health', color: 'error' },
  { label: '⚽ Sports', value: 'Sports', color: 'default' },
  { label: '📚 Self-improvement', value: 'Self-improvement', color: 'default' },
  { label: '❤️ Relationships', value: 'Relationships', color: 'secondary' }
];

const Discovery = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const [showUserSignIn, setShowUserSignIn] = useState(true);
  const [courses, setCourses] = useState([]);
  
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
  const [filteredCommunities, setFilteredCommunities] = useState([]);

  // Fetch courses from database
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        // Fetch all published courses for discovery
        const response = await courseApi.getCourses({ discovery: 'true' });
        console.log('Fetched courses for discovery:', response);
        
        if (response.success && response.courses) {
          // Normalize course data for display
          const normalizedCourses = response.courses.map(course => ({
            id: course._id || course.id,
            title: course.title || 'Untitled Course',
            description: course.description || 'No description available',
            category: course.category || 'Uncategorized',
            status: course.status || 'published',
            thumbnail: course.thumbnail || null,
            targetAudience: course.targetAudience || null,
            contentType: course.contentType || 'video',
            subType: course.subType || null,
            chapters: course.chapters || [],
            createdAt: course.createdAt || new Date().toISOString(),
            updatedAt: course.updatedAt || new Date().toISOString()
          }));
          
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
                  endIcon={<KeyboardArrowDownIcon />}
                  sx={{ 
                    textTransform: 'none',
                    borderRadius: '20px',
                    px: 3
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
                    mt: 1,
                    bgcolor: 'white',
                    borderRadius: 2,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    border: '1px solid #e0e0e0',
                    zIndex: 1000,
                    minWidth: 200
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
                      py: 2,
                      borderRadius: 0,
                      borderBottom: '1px solid #f0f0f0',
                      '&:hover': {
                        bgcolor: '#f5f5f5'
                      }
                    }}
                  >
                    <BusinessIcon sx={{ mr: 2, fontSize: 20 }} />
                    Sign in as Community
                  </Button>
                  
                  <Button
                    fullWidth
                    onClick={() => {
                      navigate('/community-user-signup');
                      setLoginDropdownOpen(false);
                    }}
                    sx={{
                      textTransform: 'none',
                      justifyContent: 'flex-start',
                      px: 3,
                      py: 2,
                      borderRadius: 0,
                      borderBottom: '1px solid #f0f0f0',
                      '&:hover': {
                        bgcolor: '#f5f5f5'
                      }
                    }}
                  >
                    <PersonIcon sx={{ mr: 2, fontSize: 20 }} />
                    Join as Community User
                  </Button>
                  
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
                      py: 2,
                      borderRadius: 0,
                      borderBottom: '1px solid #f0f0f0',
                      '&:hover': {
                        bgcolor: '#f5f5f5'
                      }
                    }}
                  >
                    <PersonIcon sx={{ mr: 2, fontSize: 20 }} />
                    Community User Login
                  </Button>
                  
                  <Button
                    fullWidth
                    onClick={() => {
                      navigate('/create-community');
                      setLoginDropdownOpen(false);
                    }}
                    sx={{
                      textTransform: 'none',
                      justifyContent: 'flex-start',
                      px: 3,
                      py: 2,
                      borderRadius: 0,
                      borderBottom: '1px solid #f0f0f0',
                      '&:hover': {
                        bgcolor: '#f5f5f5'
                      }
                    }}
                  >
                    <BusinessIcon sx={{ mr: 2, fontSize: 20 }} />
                    Create Community
                  </Button>
                  {showUserSignIn && (
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
                        py: 2,
                        borderRadius: 0,
                        '&:hover': {
                          bgcolor: '#f5f5f5'
                        }
                      }}
                    >
                      <PersonIcon sx={{ mr: 2, fontSize: 20 }} />
                      Sign in as User
                    </Button>
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
                color: '#4285f4',
                textTransform: 'none',
                fontSize: '1.25rem',
                fontWeight: 400,
                p: 0,
                minWidth: 'auto',
                opacity: 0.6,
                cursor: 'not-allowed',
                '&:hover': {
                  backgroundColor: 'transparent',
                  color: '#4285f4',
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

          {/* Category Filters */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
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
                  '&:hover': { bgcolor: selectedCategory === category.value ? undefined : '#f5f5f5' }
                }}
              />
            ))}
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
                onClick={() => navigate(`/discover-courseViewer/${community.id}`)}
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
                      if (!community.thumbnail || community.thumbnail.trim() === '') {
                        return `https://via.placeholder.com/400x200/4285f4/ffffff?text=${encodeURIComponent(community.title)}`;
                      }
                      
                      // If it's a data URL, use it directly
                      if (community.thumbnail.startsWith('data:')) {
                        return community.thumbnail;
                      }
                      
                      // If it's a localhost URL, replace with production URL
                      if (community.thumbnail.includes('localhost')) {
                        const filename = community.thumbnail.split('/').pop();
                        return `${process.env.REACT_APP_API_URL || 'https://saas-lms-admin-1.onrender.com'}/uploads/${filename}`;
                      }
                      
                      // If it's already a full production URL, use it directly
                      if (community.thumbnail.startsWith('https://saas-lms-admin-1.onrender.com')) {
                        return community.thumbnail;
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
                      console.error('🖼️ Discovery: Thumbnail failed to load for', community.title, ':', e.target.src);
                      e.target.src = `https://via.placeholder.com/400x200/4285f4/ffffff?text=${encodeURIComponent(community.title)}`;
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
                          borderColor: '#4285f4',
                          color: '#4285f4',
                          backgroundColor: '#4285f415',
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
                          borderColor: community.contentType === 'video' ? '#4285f4' : '#34a853',
                          color: community.contentType === 'video' ? '#4285f4' : '#34a853',
                          backgroundColor: community.contentType === 'video' ? '#4285f415' : '#34a85315',
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
                      borderColor: '#4285f4',
                      color: '#4285f4',
                      '&:hover': {
                        borderColor: '#3367d6',
                        backgroundColor: '#4285f415'
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


    </Box>
  );
};

export default Discovery;
