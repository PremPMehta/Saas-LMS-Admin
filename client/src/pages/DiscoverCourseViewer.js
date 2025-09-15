import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardMedia,
  CardContent,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  Avatar,
  Paper,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Fade,
  Grow
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Lock as LockIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  VideoLibrary as VideoLibraryIcon,
  Description as DescriptionIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { courseApi } from '../utils/courseApi';

const DiscoverCourseViewer = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [hoveredVideo, setHoveredVideo] = useState(null);
  const [allEpisodes, setAllEpisodes] = useState([]);

  // Fetch courses from database
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        console.log('🎯 Course ID from URL:', courseId);
        
        let response;
        
        if (courseId) {
          // Fetch specific course by ID
          console.log('🔍 Fetching specific course:', courseId);
          response = await courseApi.getCourseById(courseId);
          console.log('📊 Specific course response:', response);
          
          if (response.success && response.course) {
            // Convert single course to array format
            response = {
              success: true,
              courses: [response.course],
              count: 1
            };
          }
        } else {
          // Fallback: Get all courses from Crypto Manji Academy
          console.log('🌍 Fetching all courses from Crypto Manji Academy');
          const communityId = '68bae2a8807f3a3bb8ac6307'; // Crypto Manji Academy ID
          response = await courseApi.getCourses({ 
            community: communityId,
            status: 'published'
          });
        }
        
        console.log('Fetched courses for discover viewer:', response);
        
        if (response.success && response.courses) {
          // Filter out test courses and duplicates
          const filteredCourses = response.courses.filter(course => {
            // Only include courses with actual content
            return course.title && 
                   course.title.trim() !== '' && 
                   course.chapters && 
                   course.chapters.length > 0 &&
                   !course.title.toLowerCase().includes('test') &&
                   !course.title.toLowerCase().includes('sample') &&
                   !course.title.toLowerCase().includes('duplicate');
          });

          const normalizedCourses = filteredCourses.map(course => ({
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
          
          console.log('✅ Filtered courses:', normalizedCourses.length);
          console.log('📚 Course titles:', normalizedCourses.map(c => c.title));
          
          // Collect all episodes from all courses
          const allEpisodesList = [];
          console.log('🔍 Debug: Processing courses:', normalizedCourses.length);
          
          normalizedCourses.forEach((course, courseIndex) => {
            console.log(`📚 Course ${courseIndex + 1}: ${course.title}`);
            console.log('   Chapters:', course.chapters?.length || 0);
            
            if (course.chapters && course.chapters.length > 0) {
              course.chapters.forEach((chapter, chapterIndex) => {
                console.log(`   📖 Chapter ${chapterIndex + 1}: ${chapter.title}`);
                console.log('      Videos:', chapter.videos?.length || 0);
                
                if (chapter.videos && chapter.videos.length > 0) {
                  chapter.videos.forEach((video, videoIndex) => {
                    console.log(`      🎬 Video ${videoIndex + 1}: ${video.title || 'Untitled'}`);
                    
                    allEpisodesList.push({
                      id: `${course.id}-${chapterIndex}-${videoIndex}`,
                      courseId: course.id,
                      courseTitle: course.title,
                      courseDescription: course.description,
                      courseCategory: course.category,
                      courseTargetAudience: course.targetAudience,
                      chapterTitle: chapter.title || `Chapter ${chapterIndex + 1}`,
                      chapterIndex: chapterIndex + 1,
                      videoIndex: videoIndex + 1,
                      title: video.title || `Episode ${videoIndex + 1}`,
                      description: video.description || chapter.description || course.description,
                      url: video.url || video.videoUrl || video.src,
                      duration: video.duration || 'Unknown',
                      thumbnail: course.thumbnail
                    });
                  });
                }
              });
            }
          });
          
          console.log('🎬 Total episodes collected:', allEpisodesList.length);
          
          setAllEpisodes(allEpisodesList);
          
          // Set first episode as selected by default
          if (allEpisodesList.length > 0) {
            setSelectedEpisode(allEpisodesList[0]);
            setSelectedCourse(normalizedCourses.find(c => c.id === allEpisodesList[0].courseId));
          }
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
  }, [courseId]);


  const handleEpisodeClick = (episode) => {
    setSelectedEpisode(episode);
    setSelectedCourse(courses.find(c => c.id === episode.courseId));
    setLoginModalOpen(true);
  };

  const handleEpisodeSelect = (episode) => {
    setSelectedEpisode(episode);
    setSelectedCourse(courses.find(c => c.id === episode.courseId));
  };

  const handleCloseModal = () => {
    setLoginModalOpen(false);
    setSelectedCourse(null);
  };

  const handleLoginRedirect = (type) => {
    if (type === 'community') {
      navigate('/community-login');
    } else if (type === 'user') {
      navigate('/community-user-signup');
    }
    handleCloseModal();
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

  const getVideoUrl = (episode) => {
    if (!episode || !episode.url) return null;
    
    let videoUrl = episode.url;
    
    // Handle different URL formats
    if (videoUrl.includes('localhost')) {
      const filename = videoUrl.split('/').pop();
      return `${process.env.REACT_APP_API_URL || 'https://saas-lms-admin-1.onrender.com'}/uploads/${filename}`;
    }
    
    if (videoUrl.startsWith('/uploads/')) {
      return `${process.env.REACT_APP_API_URL || 'https://saas-lms-admin-1.onrender.com'}${videoUrl}`;
    }
    
    if (!videoUrl.startsWith('http')) {
      return `${process.env.REACT_APP_API_URL || 'https://saas-lms-admin-1.onrender.com'}/uploads/${videoUrl}`;
    }
    
    return videoUrl;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Box sx={{  minHeight: '100vh' }}>
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
              <Button 
                variant="outlined" 
                onClick={() => navigate('/community-login')}
                sx={{ 
                  textTransform: 'none',
                  borderRadius: '20px',
                  px: 3
                }}
              >
                LOG IN
              </Button>
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
            {selectedCourse ? `Preview: ${selectedCourse.title}` : 'Preview Our Courses'}
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            {selectedCourse 
              ? `Watch previews of ${selectedCourse.title}. Sign up to access the full course!`
              : 'Watch previews of our amazing content. Sign up to access full courses!'
            }
          </Typography>

          {/* Back Button */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/discovery')}
              sx={{
                textTransform: 'none',
                borderRadius: '20px',
                px: 3
              }}
            >
              Back to Discovery
            </Button>
          </Box>
        </Box>

        {/* Loading and Error States */}
        {loading && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
              Loading course previews...
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

        {/* Main Video Player Layout */}
        {!loading && !error && selectedEpisode && (
          <Box sx={{ display: 'flex', gap: 3, maxWidth: '1400px', mx: 'auto' }}>
            {/* Main Video Area (Left) */}
            <Box sx={{ flex: 2 }}>
              <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
                {/* Main Video Player */}
                <Box sx={{ position: 'relative', height: 400 }}>
                  <Box
                    component="video"
                    height="400"
                    width="100%"
                    poster={getThumbnailUrl(selectedCourse)}
                    muted
                    loop
                    playsInline
                    preload="none"
                    sx={{
                      objectFit: 'cover',
                      objectPosition: 'center',
                      filter: 'blur(2px)',
                      width: '100%',
                      height: '100%'
                    }}
                    onMouseEnter={(e) => {
                      e.target.load();
                      e.target.play().catch(() => {
                        // Ignore play errors
                      });
                    }}
                    onMouseLeave={(e) => {
                      e.target.pause();
                      e.target.currentTime = 0;
                    }}
                    onClick={() => handleEpisodeClick(selectedEpisode)}
                  >
                    {getVideoUrl(selectedEpisode) && (
                      <source src={getVideoUrl(selectedEpisode)} type="video/mp4" />
                    )}
                    <img
                      src={getThumbnailUrl(selectedCourse)}
                      alt={selectedEpisode.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </Box>
                  
                  {/* Blur Overlay */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'rgba(0,0,0,0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    {/* Play Button */}
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.9)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'transform 0.2s ease',
                        '&:hover': {
                          transform: 'scale(1.1)'
                        }
                      }}
                    >
                      <PlayIcon sx={{ fontSize: 40, color: '#0F3C60', ml: 0.5 }} />
                    </Box>
                  </Box>

                  {/* Lock Icon */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      background: 'rgba(0,0,0,0.7)',
                      borderRadius: '50%',
                      width: 40,
                      height: 40,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <LockIcon sx={{ color: 'white', fontSize: 20 }} />
                  </Box>
                </Box>
                
                {/* Video Info */}
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {selectedEpisode.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {selectedEpisode.courseTitle} • Chapter {selectedEpisode.chapterIndex} • Episode {selectedEpisode.videoIndex}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedEpisode.description}
                  </Typography>
                  
                  {/* Course Tags */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedEpisode.courseCategory && (
                      <Chip
                        label={selectedEpisode.courseCategory}
                        size="small"
                        color="primary"
                      />
                    )}
                    {selectedEpisode.courseTargetAudience && (
                      <Chip
                        label={selectedEpisode.courseTargetAudience}
                        size="small"
                        variant="outlined"
                      />
                    )}
                    <Chip
                      label={`${selectedEpisode.duration}`}
                      size="small"
                      variant="outlined"
                      color="secondary"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Box>

            {/* Episodes Sidebar (Right) */}
            <Box sx={{ flex: 1, maxHeight: '600px', overflowY: 'auto' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                All Episodes ({allEpisodes.length})
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {allEpisodes.slice(0, 20).map((episode, index) => (
                  <Card
                    key={episode.id}
                    sx={{
                      cursor: 'pointer',
                      border: selectedEpisode?.id === episode.id ? '2px solid #0F3C60' : '1px solid #e0e0e0',
                      borderRadius: 2,
                      overflow: 'hidden',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }
                    }}
                    onClick={() => handleEpisodeSelect(episode)}
                  >
                    <Box sx={{ display: 'flex', height: 80 }}>
                      {/* Episode Thumbnail */}
                      <Box sx={{ position: 'relative', width: 120, height: 80 }}>
                        <img
                          src={getThumbnailUrl(selectedCourse)}
                          alt={episode.title}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            filter: 'blur(1px)'
                          }}
                        />
                        
                        {/* Small Play Button */}
                        <Box
                          sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            background: 'rgba(0,0,0,0.7)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <PlayIcon sx={{ color: 'white', fontSize: 12, ml: 0.5 }} />
                        </Box>
                      </Box>
                      
                      {/* Episode Info */}
                      <Box sx={{ flex: 1, p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5, lineHeight: 1.2 }}>
                          {episode.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
                          {episode.courseTitle} • Ch {episode.chapterIndex}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {episode.duration}
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                ))}
              </Box>
            </Box>
          </Box>
        )}

      </Container>

      {/* Login/Signup Modal */}
      <Dialog 
        open={loginModalOpen} 
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Access Required
          </Typography>
          <IconButton onClick={handleCloseModal}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <LockIcon sx={{ fontSize: 60, color: '#0F3C60', mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 2 }}>
              {selectedEpisode?.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {selectedEpisode?.courseTitle} • Chapter {selectedEpisode?.chapterIndex} • Episode {selectedEpisode?.videoIndex}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontStyle: 'italic' }}>
              {selectedEpisode?.description}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
              {selectedEpisode?.courseCategory && (
                <Chip label={selectedEpisode.courseCategory} size="small" color="primary" />
              )}
              {selectedEpisode?.courseTargetAudience && (
                <Chip label={selectedEpisode.courseTargetAudience} size="small" variant="outlined" />
              )}
              <Chip label={selectedEpisode?.duration} size="small" variant="outlined" color="secondary" />
            </Box>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Sign up or log in to access this episode and unlock all premium content!
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<PersonIcon />}
                onClick={() => handleLoginRedirect('user')}
                sx={{
                  py: 1.5,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                  }
                }}
              >
                Sign Up as Student
              </Button>
              
              <Button
                variant="outlined"
                fullWidth
                startIcon={<BusinessIcon />}
                onClick={() => handleLoginRedirect('community')}
                sx={{ py: 1.5 }}
              >
                Sign In as Community Admin
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default DiscoverCourseViewer;
