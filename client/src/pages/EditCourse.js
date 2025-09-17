import React, { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  VideoLibrary as VideoIcon,
  TextFields as TextIcon,
  Description as DescriptionIcon,
  PlayArrow as PlayIcon,
  DragIndicator as DragIcon,
  CloudUpload as UploadIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Publish as PublishIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import courseApi from '../utils/courseApi';
import { getCommunityUrls } from '../utils/communityUrlUtils';
import { GENERAL_CATEGORIES } from '../config/categories';
import useDocumentTitle from '../contexts/useDocumentTitle';

const EditCourse = () => {
  useDocumentTitle('Edit Course - Bell & Desk');
  const navigate = useNavigate();
  const { courseId, communityName } = useParams();

  // Get community-specific URLs
  const communityUrls = communityName ? getCommunityUrls(communityName) : null;
  const [activeStep, setActiveStep] = useState(0);
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    targetAudience: '',
    category: '',
    contentType: '', // 'text' or 'video'
    thumbnail: '',
  });
  const [chapters, setChapters] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const [openChapterDialog, setOpenChapterDialog] = useState(false);
  const [openVideoDialog, setOpenVideoDialog] = useState(false);
  const [editingChapter, setEditingChapter] = useState(null);
  const [editingVideo, setEditingVideo] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);

  const steps = ['Course Information', 'Course Structure', 'Review & Update'];

  // Use centralized categories from config
  const categories = GENERAL_CATEGORIES;

  const targetAudiences = [
    'Beginners',
    'Intermediate',
    'Advanced',
    'Professionals',
    'Students',
    'Entrepreneurs',
    'Developers',
    'Designers',
    'Managers',
    'Executives',
  ];

  const contentTypes = [
    { value: 'video', label: 'Video Based' },
    { value: 'text', label: 'Text Based' },
  ];

  // Load course data on component mount
  useEffect(() => {
    const loadCourse = async () => {
      try {
        console.log('🔄 Loading course data for ID:', courseId);
        setIsLoading(true);

        const response = await courseApi.getCourseById(courseId);
        console.log('📊 Course API response:', response);

        const course = response.course;
        console.log('📋 Course data:', course);

        if (!course) {
          console.error('❌ No course data received');
          return;
        }

        const updatedCourseData = {
          title: course.title || '',
          description: course.description || '',
          targetAudience: course.targetAudience || '',
          category: course.category || '',
          contentType: course.contentType || 'video',
          thumbnail: course.thumbnail || '',
        };

        console.log('✅ Setting course data:', updatedCourseData);
        setCourseData(updatedCourseData);

        const courseChapters = course.chapters || [];
        console.log('📚 Setting chapters:', courseChapters.length, 'chapters');
        setChapters(courseChapters);

      } catch (error) {
        console.error('❌ Error loading course:', error);
        console.error('Error details:', error.message);

        // Show error state but don't redirect
        alert(`Error loading course: ${error.message}`);

        // Set some default data so the form doesn't appear empty
        setCourseData({
          title: 'Error loading course',
          description: 'There was an error loading the course data. Please try again.',
          targetAudience: 'Unknown',
          category: 'Unknown',
          contentType: 'video',
          thumbnail: '',
        });
        setChapters([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (courseId) {
      loadCourse();
    } else {
      console.error('❌ No courseId provided');
    }
  }, [courseId]);

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 0:
        if (!courseData.title.trim()) newErrors.title = 'Title is required';
        if (!courseData.description.trim()) newErrors.description = 'Description is required';
        break;
      case 1:
        if (chapters.length === 0) newErrors.chapters = 'At least one chapter is required';
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleInputChange = (field, value) => {
    setCourseData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCourseThumbnailUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        alert('Invalid image format. Only JPEG, PNG, and GIF are allowed.');
        return;
      }

      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert('Image file too large. Maximum size is 5MB.');
        return;
      }

      // Create immediate preview using FileReader
      const reader = new FileReader();
      reader.onload = (e) => {
        // Show immediate preview with data URL
        setCourseData(prev => ({ ...prev, thumbnail: e.target.result }));
      };
      reader.readAsDataURL(file);

      setIsUploadingThumbnail(true);
      try {
        // Upload thumbnail to server
        const formData = new FormData();
        formData.append('thumbnail', file);

        const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://saas-lms-admin-1.onrender.com'}/api/upload/thumbnail`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to upload thumbnail');
        }

        const result = await response.json();
        if (result.success) {
          // Replace preview with server URL
          setCourseData(prev => ({ ...prev, thumbnail: `${process.env.REACT_APP_API_URL || 'https://saas-lms-admin-1.onrender.com'}${result.url}` }));
        } else {
          throw new Error(result.message || 'Failed to upload thumbnail');
        }
      } catch (error) {
        console.error('Thumbnail upload error:', error);
        alert('Failed to upload thumbnail: ' + error.message);
        // Keep the preview even if upload fails
      } finally {
        setIsUploadingThumbnail(false);
      }
    }
  };

  const handleSaveChapter = () => {
    console.log('📚 handleSaveChapter called with selectedChapter:', selectedChapter);

    if (!selectedChapter?.title?.trim()) {
      console.error('❌ Chapter title validation failed');
      alert('Chapter title is required');
      return;
    }

    if (editingChapter) {
      console.log('✏️ Updating existing chapter:', editingChapter._id);
      setChapters(prev => prev.map(chapter =>
        chapter._id === editingChapter._id
          ? { ...chapter, title: selectedChapter.title, description: selectedChapter.description }
          : chapter
      ));
    } else {
      console.log('➕ Adding new chapter');
      setChapters(prev => [...prev, {
        _id: Date.now().toString(),
        title: selectedChapter.title,
        description: selectedChapter.description,
        videos: []
      }]);
    }

    setOpenChapterDialog(false);
    setEditingChapter(null);
    setSelectedChapter(null);
  };

  const handleEditChapter = (chapter) => {
    setEditingChapter(chapter);
    setSelectedChapter({ title: chapter.title, description: chapter.description });
    setOpenChapterDialog(true);
  };

  const handleDeleteChapter = (chapterId) => {
    if (window.confirm('Are you sure you want to delete this chapter?')) {
      setChapters(prev => prev.filter(chapter => chapter._id !== chapterId));
    }
  };

  const handleSaveVideo = async (formData) => {
    console.log('🎬 handleSaveVideo called with formData:', formData);

    if (!formData?.title?.trim()) {
      alert('Video title is required');
      return;
    }

    let processedFormData = { ...formData };

    // If it's an uploaded video file, upload it to the server first
    if (formData.videoType === 'upload' && formData.videoFile) {
      try {
        console.log('Uploading video file to server...');
        const uploadFormData = new FormData();
        uploadFormData.append('video', formData.videoFile);

        const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://saas-lms-admin-1.onrender.com'}/api/upload/video`, {
          method: 'POST',
          body: uploadFormData,
        });

        if (!response.ok) {
          throw new Error('Failed to upload video');
        }

        const result = await response.json();
        console.log('Video uploaded successfully:', result);

        // Update form data with the server URL
        processedFormData = {
          ...formData,
          videoUrl: `${process.env.REACT_APP_API_URL || 'https://saas-lms-admin-1.onrender.com'}${result.url}`,
          videoFile: null // Clear the file object since we now have a URL
        };
      } catch (error) {
        console.error('Error uploading video:', error);
        alert('Failed to upload video. Please try again.');
        return;
      }
    }

    const videoData = {
      title: processedFormData.title,
      description: processedFormData.description,
      videoUrl: processedFormData.videoUrl,
      videoType: processedFormData.videoType || 'youtube',
      duration: processedFormData.duration || '0:00'
    };

    console.log('📝 Processing video data:', videoData);

    if (editingVideo) {
      console.log('✏️ Updating existing video:', editingVideo._id);
      setChapters(prev => prev.map(chapter => ({
        ...chapter,
        videos: chapter.videos.map(video =>
          video._id === editingVideo._id ? { ...video, ...videoData } : video
        )
      })));
    } else {
      console.log('➕ Adding new video to chapter:', selectedChapter?.chapterId);
      setChapters(prev => prev.map(chapter =>
        chapter._id === selectedChapter?.chapterId
          ? { ...chapter, videos: [...chapter.videos, { _id: Date.now().toString(), ...videoData }] }
          : chapter
      ));
    }

    setOpenVideoDialog(false);
    setEditingVideo(null);
    setSelectedChapter(null);
  };

  const handleEditVideo = (video, chapterId) => {
    setEditingVideo(video);
    setSelectedChapter({
      title: video.title,
      description: video.description,
      videoUrl: video.videoUrl,
      videoType: video.videoType,
      duration: video.duration,
      chapterId
    });
    setOpenVideoDialog(true);
  };

  const handleDeleteVideo = (videoId, chapterId) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      setChapters(prev => prev.map(chapter =>
        chapter._id === chapterId
          ? { ...chapter, videos: chapter.videos.filter(video => video._id !== videoId) }
          : chapter
      ));
    }
  };

  const handleSubmit = async () => {
    console.log('handleSubmit called');
    console.log('courseData:', courseData);
    console.log('chapters:', chapters);

    // Validate final step
    if (!validateStep(activeStep)) {
      console.log('Validation failed');
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);
    try {
      // Update the course object for database
      const courseDataForApi = {
        title: courseData.title,
        description: courseData.description,
        category: courseData.category,
        targetAudience: courseData.targetAudience,
        contentType: courseData.contentType,
        thumbnail: courseData.thumbnail || `${process.env.REACT_APP_API_URL || 'https://saas-lms-admin-1.onrender.com'}/uploads/default-course-thumbnail.jpg`,
        chapters: chapters.map((chapter, index) => ({
          title: chapter.title,
          description: chapter.description,
          order: index,
          videos: chapter.videos.map((video, videoIndex) => ({
            title: video.title,
            description: video.description,
            videoUrl: video.videoUrl,
            videoType: video.videoType,
            duration: video.duration || '0:00',
            order: videoIndex
          }))
        })),
        tags: [],
        requirements: [],
        learningOutcomes: [],
        price: 0,
        isFree: true
      };

      // Update course in database via API
      const response = await courseApi.updateCourse(courseId, courseDataForApi);
      console.log('Course updated in database:', response.course);

      // Redirect to courses list with success message
      let redirectUrl;
      if (communityUrls) {
        redirectUrl = communityUrls.courses;
      } else if (communityName) {
        redirectUrl = `/${communityName}/courses`;
      } else {
        redirectUrl = '/courses';
      }
      console.log('EditCourse redirect URL:', redirectUrl);
      navigate(redirectUrl, {
        state: {
          message: 'Course updated successfully!'
        }
      });
    } catch (error) {
      console.error('Error updating course:', error);
      alert('Failed to update course. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={60} sx={{ mb: 3 }} />
        <Typography variant="h6" sx={{ mb: 2 }}>
          Loading course data...
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Course ID: {courseId}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Please wait while we fetch your course information
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        mb: 4,
        py: 2,
        borderRadius: 3,
        color: 'white'
      }}>
        <IconButton
          onClick={() => {
            let backUrl;
            if (communityUrls) {
              backUrl = communityUrls.courses;
            } else if (communityName) {
              backUrl = `/${communityName}/courses`;
            } else {
              backUrl = '/courses';
            }
            console.log('EditCourse back button URL:', backUrl);
            navigate(backUrl);
          }}
          sx={{
            mr: 2,
            color: '#0F3C60',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
            }
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, color: '#0F3C60' , fontSize: { xs: '20px', sm: '30px' }}}>
            Edit Course
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, color: '#34495e' }}>
            Update your course content and structure
          </Typography>
        </Box>
      </Box>

      {/* Stepper */}
      <Card sx={{ mb: 4, p: 3 }}>
        <Stepper
          activeStep={activeStep}
          sx={{
            mb: 2,
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, md: 0 },
            alignItems: { xs: 'flex-start', sm: 'center' }
          }}
        >
          {/* Stepper Steps */}

          {steps.map((label) => (
            <Step key={label}>
              <StepLabel
                sx={{
                  '& .MuiStepLabel-label': {
                    fontWeight: 600,
                    fontSize: '0.95rem'
                  }
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
          Step {activeStep + 1} of {steps.length}: {steps[activeStep]}
        </Typography>
      </Card>

      {/* Step Content */}
      {activeStep === 0 && (
        <Card sx={{ p: { xs: 1.5, sm: 2, md: 4 } }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, color: '#2c3e50' }}>
              Edit Course Information
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Update your course details and thumbnail
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item size={12}>
              <TextField
                fullWidth
                label="Course Title"
                placeholder="Enter course title"
                value={courseData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                error={!!errors.title}
                helperText={errors.title}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#0F3C60',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#0F3C60',
                    },
                  },
                }}
              />
            </Grid>

            <Grid item size={12}>
              <TextField
                fullWidth
                label="Course Description"
                placeholder="Describe what students will learn in this course"
                value={courseData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                error={!!errors.description}
                helperText={errors.description}
                multiline
                rows={4}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#0F3C60',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#0F3C60',
                    },
                  },
                }}
              />
            </Grid>

            {/* Course Thumbnail Upload */}
            <Grid item size={{ xs: 12, md: 4 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#2c3e50' }}>
                Course Thumbnail
              </Typography>
              <Card sx={{ p: 3, border: '2px dashed #e0e0e0', }}>
                {/* Current Thumbnail Display */}
                {courseData.thumbnail && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, fontWeight: 600 }}>
                      Current Thumbnail:
                    </Typography>
                    <Box
                      sx={{
                        width: '100%',
                        height: 150,
                        border: '2px solid #e0e0e0',
                        borderRadius: 2,
                        overflow: 'hidden',
                        position: 'relative',
                        textAlign: 'center',
                        margin: '0 auto',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}
                    >
                      <img
                        src={(() => {
                          if (!courseData.thumbnail || courseData.thumbnail.trim() === '') {
                            return `${process.env.REACT_APP_API_URL || 'https://saas-lms-admin-1.onrender.com'}/uploads/default-course-thumbnail.jpg`;
                          }

                          // If it's already a full URL (data: or http), use it directly
                          if (courseData.thumbnail.startsWith('data:') || courseData.thumbnail.startsWith('http')) {
                            return courseData.thumbnail;
                          }

                          // If it starts with /uploads, construct the full URL
                          if (courseData.thumbnail.startsWith('/uploads/')) {
                            return `${process.env.REACT_APP_API_URL || 'https://saas-lms-admin-1.onrender.com'}${courseData.thumbnail}`;
                          }

                          // If it's just a filename, add /uploads/ prefix
                          return `${process.env.REACT_APP_API_URL || 'https://saas-lms-admin-1.onrender.com'}/uploads/${courseData.thumbnail}`;
                        })()}
                        alt="Course thumbnail"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          // Prevent multiple error logs for the same image
                          if (!e.target.dataset.errorLogged) {
                            console.warn('🖼️ EditCourse: Thumbnail failed to load:', e.target.src);
                            e.target.dataset.errorLogged = 'true';
                          }
                          e.target.style.display = 'none';
                          // Only add fallback if not already present
                          if (!e.target.parentElement.querySelector('.thumbnail-fallback')) {
                            e.target.parentElement.innerHTML = '<div class="thumbnail-fallback" style="display: flex; align-items: center; justify-content: center; height: 100%; color: #666; background: #f5f5f5;">No thumbnail</div>';
                          }
                        }}
                      />
                    </Box>
                  </Box>
                )}

                {/* Thumbnail Upload */}
                <Box sx={{ textAlign: 'center' }}>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="course-thumbnail-upload"
                    type="file"
                    onChange={handleCourseThumbnailUpload}
                  />
                  <label htmlFor="course-thumbnail-upload">
                    <Button
                      variant="contained"
                      component="span"
                      startIcon={isUploadingThumbnail ? <CircularProgress size={20} color="inherit" /> : <UploadIcon />}
                      disabled={isUploadingThumbnail}
                      sx={{
                        background: '#0F3C60',
                        '&:hover': {
                          background: '#30648e',
                        },
                        px: { xs: 2, sm: 3, md: 4 },
                        py: 1.5,
                        fontSize: '12px',
                        fontWeight: 600
                      }}
                    >
                      {isUploadingThumbnail ? 'Uploading...' : (courseData.thumbnail ? 'Change Thumbnail' : 'Upload Thumbnail')}
                    </Button>
                  </label>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
                    📎 Upload a thumbnail image (JPEG, PNG, GIF - Max 5MB)
                  </Typography>
                </Box>
              </Card>
            </Grid>

            {/* Show read-only information for restricted fields */}
            <Grid item size={{ xs: 12, md: 8 }}>
              <Typography variant="h6" sx={{ mb: 3, color: '#2c3e50', fontWeight: 600 }}>
                Course Settings (Read Only)
              </Typography>
              <Grid container spacing={3}>
                <Grid item size={{ xs: 12, sm: 6 }}>
                  <Card sx={{ p: 3, backgroundColor: '#f8f9fa', border: '1px solid #e0e0e0' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <DescriptionIcon sx={{ color: '#0F3C60', mr: 1 }} />
                      <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
                        Category
                      </Typography>
                    </Box>
                    <Chip
                      label={courseData.category}
                      color="primary"
                      variant="outlined"
                      sx={{ fontWeight: 500 }}
                    />
                  </Card>
                </Grid>
                <Grid item size={{ xs: 12, sm: 6 }}>
                  <Card sx={{ p: 3, backgroundColor: '#f8f9fa', border: '1px solid #e0e0e0' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <VideoIcon sx={{ color: '#0F3C60', mr: 1 }} />
                      <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
                        Target Audience
                      </Typography>
                    </Box>
                    <Chip
                      label={courseData.targetAudience}
                      color="secondary"
                      variant="outlined"
                      sx={{ fontWeight: 500 }}
                    />
                  </Card>
                </Grid>
                <Grid item size={{ xs: 12, md: 12 }}>
                  <Card sx={{ p: 3, backgroundColor: '#f8f9fa', border: '1px solid #e0e0e0' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {courseData.contentType === 'video' ? <VideoIcon /> : <TextIcon />}
                      <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600, ml: 1 }}>
                        Content Type
                      </Typography>
                    </Box>
                    <Chip
                      icon={courseData.contentType === 'video' ? <VideoIcon /> : <TextIcon />}
                      label={contentTypes.find(type => type.value === courseData.contentType)?.label || courseData.contentType}
                      color="success"
                      variant="outlined"
                      sx={{ fontWeight: 500 }}
                    />
                  </Card>
                </Grid>
              </Grid>
              <Alert severity="info" sx={{ mt: 3 }}>
                <Typography variant="body2">
                  These settings cannot be changed after course creation to maintain consistency.
                </Typography>
              </Alert>
            </Grid>
          </Grid>
        </Card>
      )}

      {activeStep === 1 && (
        <Card sx={{ p: 4 }}>
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                Course Structure
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => {
                  console.log('🆕 Adding new chapter - resetting state');
                  setEditingChapter(null);
                  setSelectedChapter({ title: '', description: '' });
                  setOpenChapterDialog(true);
                }}
                sx={{
                  background: '#0F3C60',
                  '&:hover': { background: '#30648e' },

                  fontWeight: 600
                }}
              >
                Add Chapter
              </Button>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Organize your course content into chapters and lessons
            </Typography>
          </Box>

          {errors.chapters && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errors.chapters}
            </Alert>
          )}

          {chapters.length === 0 ? (
            <Card sx={{
              p: 6,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
              border: '2px dashed #dee2e6',
              borderRadius: 3
            }}>
              <Box sx={{ mb: 3 }}>
                <VideoIcon sx={{ fontSize: 64, color: '#6c757d', mb: 2 }} />
                <Typography variant="h5" color="text.secondary" sx={{ mb: 2, fontWeight: 600 }}>
                  No chapters added yet
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
                  Start by adding your first chapter to organize your course content and create a structured learning experience
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => {
                  console.log('🆕 Adding first chapter - resetting state');
                  setEditingChapter(null);
                  setSelectedChapter({ title: '', description: '' });
                  setOpenChapterDialog(true);
                }}
                sx={{
                  background: '#0F3C60',
                  '&:hover': { background: '#30648e' },
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600
                }}
              >
                Add First Chapter
              </Button>
            </Card>
          ) : (
            <Grid container spacing={3}>
              {chapters.map((chapter, index) => (
                <Grid item size={{ xs: 12, md: 6 }} key={chapter._id}>
                  <Card sx={{
                    // mb: 3,
                    border: '1px solid #e0e0e0',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    boxShadow: 'none'
                  }}>
                    <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 4 } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',  flexWrap: 'wrap', gap: 2, mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            background: '#0F3C60',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            color: 'white',
                            fontWeight: 600,
                            fontSize: '1.1rem'
                          }}>
                            {index + 1}
                          </Box>
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50', mb: 0.5 , fontSize: '16px'}}>
                              {chapter.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Chapter {index + 1}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton
                            onClick={() => handleEditChapter(chapter)}
                            sx={{
                              color: '#0F3C60',
                              '&:hover': { backgroundColor: 'rgba(66, 133, 244, 0.1)' }
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDeleteChapter(chapter._id)}
                            sx={{
                              color: '#dc3545',
                              '&:hover': { backgroundColor: 'rgba(220, 53, 69, 0.1)' }
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                        {chapter.description}
                      </Typography>



                      {chapter.videos && chapter.videos.length > 0 && (
                        <Box sx={{ mt: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 2 }}>
                            <Typography variant="subtitle2" sx={{ mb: 0, fontWeight: 600, color: '#2c3e50' }}>
                              Lessons ({chapter.videos.length})
                            </Typography>
                            <Button
                              size="small"
                              startIcon={<AddIcon />}
                              onClick={() => {
                                console.log('🆕 Adding new video to chapter:', chapter._id);
                                setEditingVideo(null);
                                setSelectedChapter({ title: '', description: '', videoUrl: '', chapterId: chapter._id });
                                setOpenVideoDialog(true);
                              }}
                              disabled={!courseData.contentType}
                              sx={{
                                background: '#0F3C60',
                                color: 'white',
                                '&:hover': { background: '#30648e' },
                                '&:disabled': {
                                  background: '#e0e0e0',
                                  color: '#9e9e9e'
                                }
                              }}
                            >
                              Add {courseData.contentType === 'video' ? 'Video' : 'Lesson'}
                            </Button>
                          </Box>
                          <List dense sx={{ p: 0, m: 0 }}>
                            {chapter.videos.map((video, videoIndex) => (
                              <ListItem
                                key={video._id}
                                sx={{
                                  pl: 0,
                                  pr: 0,
                                  mb: 1,
                                  p: 2,
                                  flexWrap: 'wrap',
                                  justifyContent: 'center',
                                  border: '1px solid #f0f0f0',
                                  borderRadius: 2,
                                  backgroundColor: '#fafafa',
                                  '&:hover': {
                                    backgroundColor: '#f5f5f5'
                                  }
                                }}
                              >
                                <ListItemText
                                  primary={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                      <Box sx={{
                                        width: 24,
                                        height: 24,
                                        borderRadius: '50%',
                                        backgroundColor: '#0F3C60',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                        color: 'white',
                                        fontSize: '0.75rem',
                                        fontWeight: 600
                                      }}>
                                        {videoIndex + 1}
                                      </Box>
                                      {video.videoType === 'youtube' ? <VideoIcon sx={{ color: '#ff0000', fontSize: 20 }} /> : <TextIcon sx={{ color: '#0F3C60', fontSize: 20 }} />}
                                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                        {video.title}
                                      </Typography>
                                    </Box>
                                  }
                                  secondary={
                                    <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                                      {video.description}
                                    </Typography>
                                  }
                                />
                                <Box sx={{ display: 'flex', gap: 0.5 , gap: 1}}>
                                  <IconButton
                                    size="small"
                                    onClick={() => handleEditVideo(video, chapter._id)}
                                    sx={{
                                      color: '#0F3C60',
                                      '&:hover': { backgroundColor: 'rgba(66, 133, 244, 0.1)' }
                                    }}
                                  >
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    onClick={() => handleDeleteVideo(video._id, chapter._id)}
                                    sx={{
                                      color: '#dc3545',
                                      '&:hover': { backgroundColor: 'rgba(220, 53, 69, 0.1)' }
                                    }}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Box>
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Card>
      )}

      {activeStep === 2 && (
        <Card sx={{ p: 4 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ mb: 1, fontWeight: 600, color: '#2c3e50' }}>
              Review & Update Course
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Review your course details before updating
            </Typography>
          </Box>

          <Grid container spacing={4}>
            <Grid item size={{ xs: 12, md: 6 }}>
              <Card sx={{
                border: '1px solid #e0e0e0',
                borderRadius: 3,
                background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)'
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#2c3e50' }}>
                    Course Information
                  </Typography>

                  <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, fontWeight: 600 }}>
                      Course Title
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 500, color: '#2c3e50' }}>
                      {courseData.title}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, fontWeight: 600 }}>
                      Description
                    </Typography>
                    <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                      {courseData.description}
                    </Typography>
                  </Box>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, fontWeight: 600 }}>
                          Category
                        </Typography>
                        <Chip
                          label={courseData.category}
                          color="primary"
                          sx={{ fontWeight: 500 }}
                        />
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, fontWeight: 600 }}>
                          Target Audience
                        </Typography>
                        <Chip
                          label={courseData.targetAudience}
                          color="secondary"
                          sx={{ fontWeight: 500 }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, fontWeight: 600 }}>
                          Content Type
                        </Typography>
                        <Chip
                          icon={courseData.contentType === 'video' ? <VideoIcon /> : <TextIcon />}
                          label={courseData.contentType === 'video' ? 'Video Based' : 'Text Based'}
                          color="success"
                          sx={{ fontWeight: 500 }}
                        />
                      </Box>
                    </Grid>
                  </Grid>

                </CardContent>
              </Card>
            </Grid>

            <Grid item size={{ xs: 12, md: 6 }}>
              <Card sx={{
                border: '1px solid #e0e0e0',
                borderRadius: 3,
                background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)'
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#2c3e50' }}>
                    Content Summary
                  </Typography>

                  <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, fontWeight: 600 }}>
                      Total Chapters
                    </Typography>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      p: 2,
                      backgroundColor: 'rgba(66, 133, 244, 0.1)',
                      borderRadius: 2,
                      border: '1px solid rgba(66, 133, 244, 0.2)'
                    }}>
                      <Typography variant="h3" sx={{ fontWeight: 700, color: '#0F3C60' }}>
                        {chapters.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        chapters
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, fontWeight: 600 }}>
                      Total {courseData.contentType === 'video' ? 'Videos' : 'Lessons'}
                    </Typography>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      p: 2,
                      backgroundColor: 'rgba(52, 168, 83, 0.1)',
                      borderRadius: 2,
                      border: '1px solid rgba(52, 168, 83, 0.2)'
                    }}>
                      <Typography variant="h3" sx={{ fontWeight: 700, color: '#34a853' }}>
                        {chapters.reduce((total, chapter) => total + (chapter.videos?.length || 0), 0)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {courseData.contentType === 'video' ? 'videos' : 'lessons'}
                      </Typography>
                    </Box>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, fontWeight: 600 }}>
                      Course Type
                    </Typography>
                    <Chip
                      icon={courseData.contentType === 'video' ? <VideoIcon /> : <TextIcon />}
                      label={courseData.contentType === 'video' ? 'Video Course' : 'Text Course'}
                      color="success"
                      variant="outlined"
                      sx={{ fontWeight: 500 }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Card>
      )}

      {/* Navigation Buttons */}
      <Card sx={{ mt: 4, p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            startIcon={<ArrowBackIcon />}
            sx={{
              px: { xs: 2, sm: 3, md: 4 },
              py: 1,
              fontSize: '14px',
              fontWeight: 600,
              borderColor: '#0F3C60',
              color: '#0F3C60',
              '&:hover': {
                borderColor: '#30648e',
                backgroundColor: 'rgba(66, 133, 244, 0.04)'
              },
              '&:disabled': {
                borderColor: '#e0e0e0',
                color: '#9e9e9e'
              }
            }}
            variant="outlined"
          >
            Back
          </Button>

          <Box>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />}
                sx={{
                  background: '#0F3C60',
                  '&:hover': { background: '#30648e' },
                  px: { xs: 2, sm: 3, md: 4 },
                  py: 1,
                  fontSize: '14px',
                  fontWeight: 600,
                  '&:disabled': {
                    background: '#e0e0e0',
                    color: '#9e9e9e'
                  }
                }}
              >
                {isSubmitting ? 'Updating...' : 'Update Course'}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                endIcon={<ArrowForwardIcon />}
                sx={{
                  background: '#0F3C60',
                  '&:hover': { background: '#30648e' },
                  px: { xs: 2, sm: 3, md: 4 },
                  py: 1,
                  fontSize: '14px',
                  fontWeight: 600
                }}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Card>

      {/* Chapter Dialog */}
      <Dialog
        key={editingChapter ? `edit-chapter-${editingChapter._id}` : 'new-chapter'}
        open={openChapterDialog}
        onClose={() => setOpenChapterDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingChapter ? 'Edit Chapter' : 'Add Chapter'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Chapter Title"
            value={selectedChapter?.title || ''}
            onChange={(e) => {
              console.log('📝 Chapter Dialog: Title changed to:', e.target.value);
              setSelectedChapter(prev => ({ ...prev, title: e.target.value }));
            }}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            fullWidth
            label="Chapter Description"
            value={selectedChapter?.description || ''}
            onChange={(e) => {
              console.log('📝 Chapter Dialog: Description changed to:', e.target.value);
              setSelectedChapter(prev => ({ ...prev, description: e.target.value }));
            }}
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenChapterDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveChapter} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Video Dialog Component */}
      {(() => {
        const VideoDialog = ({ open, onClose, onSave, video, contentType, chapter }) => {
          const [formData, setFormData] = useState({
            title: '',
            description: '',
            content: '',
            thumbnail: '',
            videoType: 'upload', // 'upload', 'youtube', 'loom', 'vimeo'
            videoUrl: '',
            videoFile: null,
          });

          // TinyMCE editor configuration
          const handleEditorChange = (content) => {
            setFormData(prev => ({ ...prev, content }));
          };

          useEffect(() => {
            console.log('🎬 VideoDialog: video prop changed:', video);

            if (video) {
              console.log('📝 VideoDialog: Setting form data for editing video:', video.title);
              setFormData({
                title: video.title || '',
                description: video.description || '',
                content: video.content || '',
                thumbnail: video.thumbnail || '',
                videoType: video.videoType || 'upload',
                videoUrl: video.videoUrl || '',
                videoFile: video.videoFile || null,
              });


            } else {
              console.log('🆕 VideoDialog: Resetting form data for new video');
              setFormData({
                title: '',
                description: '',
                content: '',
                thumbnail: '',
                videoType: 'upload',
                videoUrl: '',
                videoFile: null,
              });

            }
          }, [video]);

          const handleSubmit = () => {
            console.log('🔍 VideoDialog: Validating form data:', formData);
            console.log('📝 VideoDialog: Title length:', formData.title?.length);
            console.log('📝 VideoDialog: Title trimmed:', formData.title?.trim()?.length);

            // Validate required fields
            if (!formData.title?.trim()) {
              console.error('❌ VideoDialog: Title validation failed');
              alert('Please enter a video title');
              return;
            }
            if (!formData.description?.trim()) {
              console.error('❌ VideoDialog: Description validation failed');
              alert('Please enter a video description');
              return;
            }

            // Validate video content based on type
            if (formData.videoType === 'upload' && !formData.videoFile) {
              console.error('❌ VideoDialog: Video file validation failed');
              alert('Please upload a video file');
              return;
            }
            if (formData.videoType !== 'upload' && !formData.videoUrl?.trim()) {
              console.error('❌ VideoDialog: Video URL validation failed');
              alert('Please enter a video URL');
              return;
            }

            console.log('✅ VideoDialog: Validation passed, saving video data:', formData);
            onSave(formData);
          };

          const handleFileUpload = (event) => {
            const file = event.target.files[0];
            if (file) {
              setFormData(prev => ({ ...prev, videoFile: file }));
            }
          };

          const handleThumbnailUpload = (event) => {
            const file = event.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (e) => {
                setFormData(prev => ({ ...prev, thumbnail: e.target.result }));
              };
              reader.readAsDataURL(file);
            }
          };

          // Enhanced helper functions to extract video IDs from URLs
          const getYouTubeVideoId = (url) => {
            if (!url) return null;

            // Handle various YouTube URL formats
            const patterns = [
              /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/watch\?.*&v=)([^#&?]{11})/,
              /youtube\.com\/watch\?.*v=([^#&?]{11})/,
              /youtu\.be\/([^#&?]{11})/,
              /youtube\.com\/embed\/([^#&?]{11})/,
              /youtube\.com\/v\/([^#&?]{11})/
            ];

            for (const pattern of patterns) {
              const match = url.match(pattern);
              if (match && match[1] && match[1].length === 11) {
                return match[1];
              }
            }
            return null;
          };

          const getVimeoVideoId = (url) => {
            if (!url) return null;

            // Handle various Vimeo URL formats
            const patterns = [
              /vimeo\.com\/([0-9]+)/,
              /vimeo\.com\/groups\/[^\/]+\/videos\/([0-9]+)/,
              /vimeo\.com\/channels\/[^\/]+\/([0-9]+)/,
              /player\.vimeo\.com\/video\/([0-9]+)/
            ];

            for (const pattern of patterns) {
              const match = url.match(pattern);
              if (match && match[1]) {
                return match[1];
              }
            }
            return null;
          };

          const getLoomVideoId = (url) => {
            if (!url) return null;

            // Handle various Loom URL formats
            const patterns = [
              /loom\.com\/share\/([a-zA-Z0-9]+)/,
              /loom\.com\/embed\/([a-zA-Z0-9]+)/,
              /useloom\.com\/share\/([a-zA-Z0-9]+)/,
              /useloom\.com\/embed\/([a-zA-Z0-9]+)/
            ];

            for (const pattern of patterns) {
              const match = url.match(pattern);
              if (match && match[1]) {
                return match[1];
              }
            }
            return null;
          };

          // Enhanced URL validation function
          const validateVideoUrl = (url, videoType) => {
            if (!url || !url.trim()) return false;

            const trimmedUrl = url.trim();

            switch (videoType) {
              case 'youtube':
                return getYouTubeVideoId(trimmedUrl) !== null;
              case 'vimeo':
                return getVimeoVideoId(trimmedUrl) !== null;
              case 'loom':
                return getLoomVideoId(trimmedUrl) !== null;
              case 'upload':
                return true; // File uploads are handled separately
              default:
                return false;
            }
          };

          // Get embed URL for preview
          const getEmbedUrl = (url, videoType) => {
            if (!url || !url.trim()) return '';

            const trimmedUrl = url.trim();

            switch (videoType) {
              case 'youtube':
                const youtubeId = getYouTubeVideoId(trimmedUrl);
                return youtubeId ? `https://www.youtube.com/embed/${youtubeId}` : '';
              case 'vimeo':
                const vimeoId = getVimeoVideoId(trimmedUrl);
                return vimeoId ? `https://player.vimeo.com/video/${vimeoId}` : '';
              case 'loom':
                const loomId = getLoomVideoId(trimmedUrl);
                return loomId ? `https://www.loom.com/embed/${loomId}` : '';
              default:
                return trimmedUrl;
            }
          };

          return (
            <Dialog
              key={video ? `edit-${video._id}` : 'new-video'}
              open={open}
              onClose={onClose}
              maxWidth="md"
              fullWidth
            >
              <DialogTitle>
                {video ? 'Edit' : 'Add'} {contentType === 'video' ? 'Video' : 'Lesson'}
                {chapter && ` - ${chapter.title}`}
              </DialogTitle>
              <DialogContent>
                <Grid container spacing={3} sx={{ mt: 1 }}>
                  <Grid item size={12}>
                    <TextField
                      fullWidth
                      label={`${contentType === 'video' ? 'Video' : 'Lesson'} Title`}
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </Grid>

                  <Grid item size={12}>
                    <TextField
                      fullWidth
                      label="Description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      multiline
                      rows={2}
                    />
                  </Grid>

                  {/* Course Thumbnail */}
                  <Grid item size={12}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                      Course Thumbnail
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {formData.thumbnail && (
                        <Box
                          component="img"
                          src={formData.thumbnail}
                          alt="Thumbnail preview"
                          sx={{
                            width: 100,
                            height: 60,
                            objectFit: 'cover',
                            borderRadius: 1,
                            border: '1px solid #e0e0e0'
                          }}
                        />
                      )}
                      <Button
                        variant="outlined"
                        component="label"
                        startIcon={<UploadIcon />}
                      >
                        Upload Thumbnail
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={handleThumbnailUpload}
                        />
                      </Button>
                    </Box>
                  </Grid>

                  {contentType === 'video' && (
                    <>
                      {/* Video Type Selection */}
                      <Grid item size={12}>
                        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                          Video Source
                        </Typography>
                        <Grid container spacing={2}>
                          {(() => {
                            const videoTypes = [
                              {
                                value: 'upload',
                                label: 'Upload Video',
                                icon: UploadIcon,
                                description: 'Upload video file directly',
                                color: '#0F3C60'
                              },
                              {
                                value: 'youtube',
                                label: 'YouTube Link',
                                icon: PlayIcon,
                                description: 'Paste YouTube video URL',
                                color: '#ff0000'
                              },
                              {
                                value: 'loom',
                                label: 'Loom Link',
                                icon: PlayIcon,
                                description: 'Paste Loom video URL',
                                color: '#625df5'
                              },
                              {
                                value: 'vimeo',
                                label: 'Vimeo Link',
                                icon: PlayIcon,
                                description: 'Paste Vimeo video URL',
                                color: '#1ab7ea'
                              },
                            ];
                            return videoTypes.map((type) => (
                              <Grid item size={{ xs: 12, sm: 6, md: 3 }} key={type.value}>
                                <Card
                                  sx={{
                                    cursor: 'pointer',
                                    border: formData.videoType === type.value ? `2px solid ${type.color}` : '1px solid #e0e0e0',
                                    background: formData.videoType === type.value ? '#f8f9ff' : '#ffffff',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                      borderColor: type.color,
                                      background: '#f8f9ff',
                                      transform: 'translateY(-2px)',
                                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    }
                                  }}
                                  onClick={() => setFormData(prev => ({ ...prev, videoType: type.value }))}
                                >
                                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                                    <Box sx={{
                                      mb: 2,
                                      color: formData.videoType === type.value ? type.color : '#666666'
                                    }}>
                                      <type.icon />
                                    </Box>
                                    <Typography variant="body1" sx={{
                                      fontWeight: 600,
                                      color: formData.videoType === type.value ? type.color : '#000000',
                                      mb: 1
                                    }}>
                                      {type.label}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {type.description}
                                    </Typography>
                                  </CardContent>
                                </Card>
                              </Grid>
                            ));
                          })()}
                        </Grid>
                      </Grid>

                      {/* Video Content Based on Type */}
                      <Grid item size={12}>
                        {formData.videoType === 'upload' ? (
                          <Box>
                            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                              Upload Video File
                            </Typography>
                            <Card
                              sx={{
                                border: '2px dashed #e0e0e0',
                                borderRadius: 2,
                                p: 3,
                                textAlign: 'center',
                                background: formData.videoFile ? '#f8f9ff' : '#fafafa',
                                borderColor: formData.videoFile ? '#0F3C60' : '#e0e0e0',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  borderColor: '#0F3C60',
                                  background: '#f8f9ff',
                                }
                              }}
                            >
                              {formData.videoFile ? (
                                <Box>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                    <CheckCircleIcon sx={{ color: '#34a853', fontSize: 32 }} />
                                    <Box sx={{ textAlign: 'left' }}>
                                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                        {formData.videoFile.name}
                                      </Typography>
                                      <Typography variant="body2" color="text.secondary">
                                        {(formData.videoFile.size / (1024 * 1024)).toFixed(2)} MB
                                      </Typography>
                                    </Box>
                                  </Box>
                                  <Button
                                    variant="outlined"
                                    component="label"
                                    startIcon={<UploadIcon />}
                                    size="small"
                                  >
                                    Change Video
                                    <input
                                      type="file"
                                      hidden
                                      accept="video/*"
                                      onChange={handleFileUpload}
                                    />
                                  </Button>
                                </Box>
                              ) : (
                                <Box>
                                  <UploadIcon sx={{ fontSize: 48, color: '#0F3C60', mb: 2 }} />
                                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                                    Upload Video File
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    Supported formats: MP4, MOV, AVI, WebM (Max 500MB)
                                  </Typography>
                                  <Button
                                    variant="contained"
                                    component="label"
                                    startIcon={<UploadIcon />}
                                    sx={{
                                      background: '#0F3C60',
                                      '&:hover': { background: '#30648e' }
                                    }}
                                  >
                                    Choose Video File
                                    <input
                                      type="file"
                                      hidden
                                      accept="video/*"
                                      onChange={handleFileUpload}
                                    />
                                  </Button>
                                </Box>
                              )}
                            </Card>
                          </Box>
                        ) : (
                          <Box>
                            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                              {formData.videoType.charAt(0).toUpperCase() + formData.videoType.slice(1)} Video URL
                            </Typography>
                            <TextField
                              fullWidth
                              placeholder={`Paste your ${formData.videoType} video URL here`}
                              value={formData.videoUrl}
                              onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
                              error={formData.videoUrl && !validateVideoUrl(formData.videoUrl, formData.videoType)}
                              helperText={
                                formData.videoUrl && !validateVideoUrl(formData.videoUrl, formData.videoType)
                                  ? `Invalid ${formData.videoType} URL format. Please check the URL and try again.`
                                  : ''
                              }
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <PlayIcon sx={{ color: '#0F3C60' }} />
                                  </InputAdornment>
                                ),
                              }}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  '&:hover fieldset': {
                                    borderColor: '#0F3C60',
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderColor: '#0F3C60',
                                  },
                                },
                              }}
                            />
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                              Example: {formData.videoType === 'youtube' ? 'https://www.youtube.com/watch?v=VIDEO_ID' :
                                formData.videoType === 'vimeo' ? 'https://vimeo.com/VIDEO_ID' :
                                  'https://www.loom.com/share/VIDEO_ID'}
                            </Typography>
                          </Box>
                        )}
                      </Grid>

                      {/* Video Preview */}
                      {(formData.videoUrl || formData.videoFile) && (
                        <Grid item xs={12}>
                          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                            Video Preview
                          </Typography>
                          <Card sx={{ p: 3, background: '#f8f9fa' }}>
                            {formData.videoType === 'upload' && formData.videoFile ? (
                              <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                  <PlayIcon sx={{ color: '#0F3C60', fontSize: 24 }} />
                                  <Box sx={{ flex: 1 }}>
                                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                      {formData.title || 'Uploaded Video'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      {formData.videoFile.name} • {(formData.videoFile.size / (1024 * 1024)).toFixed(2)} MB
                                    </Typography>
                                  </Box>
                                </Box>
                                <Box sx={{
                                  width: '100%',
                                  height: 200,
                                  background: '#000000',
                                  borderRadius: 2,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  position: 'relative',
                                  overflow: 'hidden'
                                }}>
                                  <video
                                    controls
                                    style={{
                                      width: '100%',
                                      height: '100%',
                                      objectFit: 'contain'
                                    }}
                                    src={URL.createObjectURL(formData.videoFile)}
                                  >
                                    Your browser does not support the video tag.
                                  </video>
                                </Box>
                              </Box>
                            ) : formData.videoUrl ? (
                              <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                  <PlayIcon sx={{ color: '#0F3C60', fontSize: 24 }} />
                                  <Box sx={{ flex: 1 }}>
                                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                      {formData.title || `${formData.videoType.charAt(0).toUpperCase() + formData.videoType.slice(1)} Video`}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      {formData.videoType === 'youtube' && getYouTubeVideoId(formData.videoUrl) ?
                                        `Video ID: ${getYouTubeVideoId(formData.videoUrl)}` :
                                        formData.videoType === 'vimeo' && getVimeoVideoId(formData.videoUrl) ?
                                          `Video ID: ${getVimeoVideoId(formData.videoUrl)}` :
                                          formData.videoType === 'loom' && getLoomVideoId(formData.videoUrl) ?
                                            `Video ID: ${getLoomVideoId(formData.videoUrl)}` :
                                            formData.videoUrl
                                      }
                                    </Typography>
                                  </Box>
                                </Box>
                                <Box sx={{
                                  width: '100%',
                                  height: 300,
                                  background: '#000000',
                                  borderRadius: 2,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  position: 'relative',
                                  overflow: 'hidden'
                                }}>
                                  {formData.videoType === 'youtube' && getYouTubeVideoId(formData.videoUrl) && (
                                    <iframe
                                      width="100%"
                                      height="100%"
                                      src={`https://www.youtube.com/embed/${getYouTubeVideoId(formData.videoUrl)}?rel=0&modestbranding=1`}
                                      title="YouTube video player"
                                      frameBorder="0"
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                      allowFullScreen
                                    />
                                  )}
                                  {formData.videoType === 'vimeo' && getVimeoVideoId(formData.videoUrl) && (
                                    <iframe
                                      width="100%"
                                      height="100%"
                                      src={`https://player.vimeo.com/video/${getVimeoVideoId(formData.videoUrl)}?title=0&byline=0&portrait=0`}
                                      title="Vimeo video player"
                                      frameBorder="0"
                                      allow="autoplay; fullscreen; picture-in-picture"
                                      allowFullScreen
                                    />
                                  )}
                                  {formData.videoType === 'loom' && getLoomVideoId(formData.videoUrl) && (
                                    <iframe
                                      width="100%"
                                      height="100%"
                                      src={`https://www.loom.com/embed/${getLoomVideoId(formData.videoUrl)}`}
                                      title="Loom video player"
                                      frameBorder="0"
                                      allowFullScreen
                                    />
                                  )}
                                  {((formData.videoType === 'youtube' && !getYouTubeVideoId(formData.videoUrl)) ||
                                    (formData.videoType === 'vimeo' && !getVimeoVideoId(formData.videoUrl)) ||
                                    (formData.videoType === 'loom' && !getLoomVideoId(formData.videoUrl))) && (
                                      <Box sx={{ textAlign: 'center', color: 'white' }}>
                                        <Typography variant="h6" sx={{ mb: 2 }}>
                                          Invalid {formData.videoType} URL
                                        </Typography>
                                        <Typography variant="body2">
                                          Please enter a valid {formData.videoType} video URL
                                        </Typography>
                                      </Box>
                                    )}
                                </Box>
                              </Box>
                            ) : null}
                          </Card>
                        </Grid>
                      )}
                    </>
                  )}

                  {contentType === 'text' && (
                    <Grid item size={12}>
                      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                        Lesson Content
                      </Typography>
                      <Card sx={{ p: 2, border: '1px solid #e0e0e0' }}>
                        <Box sx={{
                          '& .tox-tinymce': {
                            border: '1px solid #e0e0e0',
                            borderRadius: '4px',
                            fontSize: '14px',
                            fontFamily: 'inherit'
                          },
                          '& .tox-toolbar': {
                            backgroundColor: '#f8f9fa',
                            borderBottom: '1px solid #e0e0e0'
                          },
                          '& .tox-edit-area': {
                            minHeight: '200px'
                          }
                        }}>
                          <Editor
                            apiKey={process.env.REACT_APP_TINYMCE_API_KEY || "jss4rschit692k4livjyiwyrw43p0w47pc5x0z5os95ylrr5"}
                            value={formData.content}
                            onEditorChange={handleEditorChange}
                            init={{
                              height: 300,
                              menubar: false,
                              plugins: [
                                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                              ],
                              toolbar: 'undo redo | blocks | ' +
                                'bold italic forecolor | alignleft aligncenter ' +
                                'alignright alignjustify | bullist numlist outdent indent | ' +
                                'removeformat | help',
                              content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                              placeholder: 'Enter your lesson content here...'
                            }}
                          />
                        </Box>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                          💡 Tip: Use the professional toolbar above to format your content with headers, bold, italic, lists, alignment, links, emojis, and more!
                        </Typography>
                      </Card>
                    </Grid>
                  )}
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                  onClick={() => {
                    console.log('Add/Update button clicked');
                    handleSubmit();
                  }}
                  variant="contained"
                >
                  {video ? 'Update' : 'Add'} {contentType === 'video' ? 'Video' : 'Lesson'}
                </Button>
              </DialogActions>
            </Dialog>
          );
        };

        return <VideoDialog
          open={openVideoDialog}
          onClose={() => setOpenVideoDialog(false)}
          onSave={handleSaveVideo}
          video={editingVideo}
          contentType={courseData.contentType}
          chapter={chapters.find(ch => ch._id === selectedChapter?.chapterId)}
        />;
      })()}
    </Container>
  );
};

export default EditCourse;
