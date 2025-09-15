import React, { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
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
import { apiUrl } from '../config/api';
import { DETAILED_CATEGORIES } from '../config/categories';
import FocusedSidebar from '../components/FocusedSidebar';

const CreateCourse = () => {
  const navigate = useNavigate();
  const { communityName } = useParams();

  // Get community-specific URLs
  const communityUrls = communityName ? getCommunityUrls(communityName) : null;

  // Debug logging
  console.log('CreateCourse component loaded:', { communityName, communityUrls });
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
  const [openChapterDialog, setOpenChapterDialog] = useState(false);
  const [openVideoDialog, setOpenVideoDialog] = useState(false);
  const [editingChapter, setEditingChapter] = useState(null);
  const [editingVideo, setEditingVideo] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);

  const steps = ['Basic Information', 'Content Structure', 'Review & Publish'];

  // Use centralized categories from config
  const categories = DETAILED_CATEGORIES;

  const targetAudiences = [
    'Complete Beginners',
    'Aspiring Traders',
    'Long-term Investors',
    'Advanced Traders/Professionals',
  ];

  const contentTypes = [
    { value: 'video', label: 'Video Based', icon: <VideoIcon /> },
    { value: 'text', label: 'Text Based', icon: <TextIcon /> },
  ];

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

      try {
        // Upload thumbnail to server
        const formData = new FormData();
        formData.append('thumbnail', file);

        const response = await fetch(apiUrl('/api/upload/thumbnail'), {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to upload thumbnail');
        }

        const result = await response.json();
        if (result.success) {
          // Store the server URL instead of base64
          setCourseData(prev => ({ ...prev, thumbnail: `${apiUrl('')}${result.url}` }));
        } else {
          throw new Error(result.message || 'Failed to upload thumbnail');
        }
      } catch (error) {
        console.error('Thumbnail upload error:', error);
        alert('Failed to upload thumbnail: ' + error.message);
      }
    }
  };

  const validateStep = (step) => {
    console.log('🔍 Validating step:', step);
    console.log('📋 Course data:', courseData);
    console.log('📚 Chapters:', chapters);

    const newErrors = {};

    if (step === 0) {
      if (!courseData.title.trim()) newErrors.title = 'Course title is required';
      if (!courseData.description.trim()) newErrors.description = 'Course description is required';
      if (!courseData.targetAudience) newErrors.targetAudience = 'Target audience is required';
      if (!courseData.category) newErrors.category = 'Category is required';
      if (!courseData.contentType) newErrors.contentType = 'Content type is required';
    }

    if (step === 1) {
      if (chapters.length === 0) newErrors.chapters = 'At least one chapter is required';
    }

    // For final step (step 2), we don't need additional validation
    // The course can be published even without chapters

    console.log('❌ Validation errors:', newErrors);
    console.log('✅ Validation passed:', Object.keys(newErrors).length === 0);

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleAddChapter = () => {
    setEditingChapter(null);
    setOpenChapterDialog(true);
  };

  const handleEditChapter = (chapter) => {
    setEditingChapter(chapter);
    setOpenChapterDialog(true);
  };

  const handleDeleteChapter = (chapterId) => {
    setChapters(prev => prev.filter(chapter => chapter.id !== chapterId));
  };

  const handleAddVideo = (chapterId) => {
    console.log('Adding video to chapter:', chapterId);
    const chapter = chapters.find(ch => ch.id === chapterId);
    console.log('Found chapter:', chapter);
    setSelectedChapter(chapter);
    setEditingVideo(null);
    setOpenVideoDialog(true);
  };

  const handleEditVideo = (video, chapterId) => {
    setSelectedChapter(chapters.find(ch => ch.id === chapterId));
    setEditingVideo(video);
    setOpenVideoDialog(true);
  };

  const handleDeleteVideo = (videoId, chapterId) => {
    setChapters(prev => prev.map(chapter => {
      if (chapter.id === chapterId) {
        return {
          ...chapter,
          videos: chapter.videos.filter(video => video.id !== videoId)
        };
      }
      return chapter;
    }));
  };

  const handleSaveChapter = (chapterData) => {
    if (editingChapter) {
      setChapters(prev => prev.map(chapter =>
        chapter.id === editingChapter.id ? { ...chapter, ...chapterData } : chapter
      ));
    } else {
      const newChapter = {
        id: Date.now().toString(),
        ...chapterData,
        videos: []
      };
      setChapters(prev => [...prev, newChapter]);
    }
    setOpenChapterDialog(false);
  };

  const handleSaveVideo = async (videoData) => {
    console.log('handleSaveVideo called with:', videoData);
    console.log('selectedChapter:', selectedChapter);
    console.log('editingVideo:', editingVideo);

    let processedVideoData = { ...videoData };

    // If it's an uploaded video file, upload it to the server first
    if (videoData.videoType === 'upload' && videoData.videoFile) {
      try {
        console.log('Uploading video file to server...');
        const formData = new FormData();
        formData.append('video', videoData.videoFile);

        const response = await fetch(apiUrl('/api/upload/video'), {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to upload video');
        }

        const result = await response.json();
        console.log('Video uploaded successfully:', result);

        // Update video data with the server URL
        processedVideoData = {
          ...videoData,
          videoUrl: `${apiUrl('')}${result.url}`,
          videoFile: null // Clear the file object since we now have a URL
        };
      } catch (error) {
        console.error('Error uploading video:', error);
        console.error('Error details:', error.message);
        alert(`Failed to upload video: ${error.message || 'Unknown error'}. Please try again.`);
        return;
      }
    }

    if (editingVideo) {
      setChapters(prev => prev.map(chapter => {
        if (chapter.id === selectedChapter.id) {
          return {
            ...chapter,
            videos: chapter.videos.map(video =>
              video.id === editingVideo.id ? { ...video, ...processedVideoData } : video
            )
          };
        }
        return chapter;
      }));
    } else {
      const newVideo = {
        id: Date.now().toString(),
        ...processedVideoData
      };
      console.log('Creating new video:', newVideo);
      setChapters(prev => {
        const updatedChapters = prev.map(chapter => {
          if (chapter.id === selectedChapter.id) {
            console.log('Adding video to chapter:', chapter.title);
            return {
              ...chapter,
              videos: [...chapter.videos, newVideo]
            };
          }
          return chapter;
        });
        console.log('Updated chapters:', updatedChapters);
        return updatedChapters;
      });
    }
    setOpenVideoDialog(false);
  };

  const handleSubmit = async () => {
    console.log('🚀 handleSubmit called');
    console.log('📋 courseData:', courseData);
    console.log('📚 chapters:', chapters);
    console.log('📍 activeStep:', activeStep);

    // Validate final step
    if (!validateStep(activeStep)) {
      console.log('❌ Validation failed - stopping course creation');
      setIsSubmitting(false);
      return;
    }

    console.log('✅ Validation passed - proceeding with course creation');

    setIsSubmitting(true);
    try {
      // Get community ID for course association
      // Try to get from localStorage first, then from URL params, then fallback
      let communityId = localStorage.getItem('communityId');
      console.log('🔍 localStorage communityId:', communityId);
      console.log('🔍 communityName from URL:', communityName);

      // If no communityId in localStorage (null or undefined), try to get it from the community name
      if ((!communityId || communityId === 'null' || communityId === 'undefined') && communityName) {
        console.log('🔍 No valid communityId in localStorage, checking communityName...');
        // For now, use the Crypto Manji community ID
        if (communityName === 'crypto-manji-academy') {
          communityId = '68bae2a8807f3a3bb8ac6307';
          console.log('🔍 Set communityId from communityName:', communityId);
        }
      }

      // Final fallback
      if (!communityId || communityId === 'null' || communityId === 'undefined') {
        communityId = '68bae2a8807f3a3bb8ac6307';
        console.log('🔍 Using final fallback communityId:', communityId);
      }

      console.log('✅ Final communityId for course creation:', communityId);

      // Create the course object for database
      const courseDataForApi = {
        title: courseData.title,
        description: courseData.description,
        category: courseData.category,
        targetAudience: courseData.targetAudience,
        contentType: courseData.contentType,
        thumbnail: courseData.thumbnail || `${apiUrl('')}/uploads/default-course-thumbnail.jpg`,
        status: 'published', // Set status to published directly
        publishedAt: new Date().toISOString(), // Set publish date
        community: communityId, // Associate course with community
        chapters: chapters.map((chapter, index) => ({
          title: chapter.title,
          description: chapter.description,
          order: index,
          videos: chapter.videos.map((video, videoIndex) => ({
            title: video.title,
            description: video.description,
            content: video.content || video.videoUrl || '', // Send content for text/PDF
            videoUrl: video.videoUrl || video.content || '', // Send videoUrl for videos
            videoType: video.videoType || 'youtube',
            contentType: video.contentType || 'video', // Include the contentType field
            type: video.contentType === 'pdf' ? 'PDF' :
              video.contentType === 'write' ? 'TEXT' : 'VIDEO', // Properly map content type
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

      // Debug: Log the final course data being sent to API
      console.log('🚀 Final courseDataForApi being sent to API:', JSON.stringify(courseDataForApi, null, 2));

      // Save to database via API
      const response = await courseApi.createCourse(courseDataForApi);
      console.log('Course saved to database:', response.course);

      // Redirect to courses page with success message
      console.log('Redirecting after course creation:', { communityName, communityUrls });
      let redirectUrl;
      if (communityUrls) {
        redirectUrl = communityUrls.courses;
      } else if (communityName) {
        // Fallback: construct URL manually if communityUrls is not available
        redirectUrl = `/${communityName}/courses`;
      } else {
        // Last resort: redirect to courses page
        redirectUrl = '/courses';
      }
      console.log('Redirect URL:', redirectUrl);
      navigate(redirectUrl, {
        state: {
          message: 'Course published successfully!',
          newCourse: response.course
        }
      });
    } catch (error) {
      console.error('Error creating course:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitDraft = async () => {
    console.log('handleSubmitDraft called');
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
      // Get community ID for course association
      // Try to get from localStorage first, then from URL params, then fallback
      let communityId = localStorage.getItem('communityId');
      console.log('🔍 localStorage communityId (draft):', communityId);
      console.log('🔍 communityName from URL (draft):', communityName);

      // If no communityId in localStorage (null or undefined), try to get it from the community name
      if ((!communityId || communityId === 'null' || communityId === 'undefined') && communityName) {
        console.log('🔍 No valid communityId in localStorage, checking communityName (draft)...');
        // For now, use a known community ID for crypto-manji-academy
        if (communityName === 'crypto-manji-academy') {
          communityId = '68b03c92fac3b1af515ccc69';
          console.log('🔍 Set communityId from communityName (draft):', communityId);
        }
      }

      // Final fallback
      if (!communityId || communityId === 'null' || communityId === 'undefined') {
        communityId = '68b03c92fac3b1af515ccc69';
        console.log('🔍 Using final fallback communityId (draft):', communityId);
      }

      console.log('✅ Final communityId for draft course creation:', communityId);

      // Create the course object for database (as draft)
      const courseDataForApi = {
        title: courseData.title,
        description: courseData.description,
        category: courseData.category,
        targetAudience: courseData.targetAudience,
        contentType: courseData.contentType,
        thumbnail: courseData.thumbnail || 'https://via.placeholder.com/300x200/4285f4/ffffff?text=Course',
        status: 'draft', // Set status to draft
        community: communityId, // Associate course with community
        chapters: chapters.map((chapter, index) => ({
          title: chapter.title,
          description: chapter.description,
          order: index,
          videos: chapter.videos.map((video, videoIndex) => ({
            title: video.title,
            description: video.description,
            content: video.content || video.videoUrl || '', // Send content for text/PDF
            videoUrl: video.videoUrl || video.content || '', // Send videoUrl for videos
            videoType: video.videoType || 'youtube',
            contentType: video.contentType || 'video', // Include the contentType field
            type: video.contentType === 'pdf' ? 'PDF' :
              video.contentType === 'write' ? 'TEXT' : 'VIDEO', // Properly map content type
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

      // Save to database via API
      const response = await courseApi.createCourse(courseDataForApi);
      console.log('Course saved as draft:', response.course);

      // Redirect to courses page with success message
      console.log('Redirecting after draft save:', { communityName, communityUrls });
      let redirectUrl;
      if (communityUrls) {
        redirectUrl = communityUrls.courses;
      } else if (communityName) {
        // Fallback: construct URL manually if communityUrls is not available
        redirectUrl = `/${communityName}/courses`;
      } else {
        // Last resort: redirect to courses page
        redirectUrl = '/courses';
      }
      console.log('Redirect URL:', redirectUrl);
      navigate(redirectUrl, {
        state: {
          message: 'Course saved as draft successfully!',
          newCourse: response.course
        }
      });
    } catch (error) {
      console.error('Error saving course as draft:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 8, lg: 8 }}>
              <Grid spacing={3}>
                <Grid size={{ xs: 12, md: 12 }}>
                  <Typography variant="h5" sx={{
                    mb: 1,
                    fontWeight: 700,
                    color: '#0F3C60',
                    textAlign: 'left'
                  }}>
                    Course Basic Information
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: 'left' }}>
                    Provide the essential details to set up your course foundation.
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, md: 12 }}>
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
                        borderRadius: 3,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 20px rgba(102, 126, 234, 0.1)',
                        },
                        '&.Mui-focused': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 20px rgba(102, 126, 234, 0.2)',
                        }
                      },
                      '& .MuiInputLabel-root': {
                        fontWeight: 500,
                      }
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 12 }}>
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
                        borderRadius: 3,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 20px rgba(102, 126, 234, 0.1)',
                        },
                        '&.Mui-focused': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 20px rgba(102, 126, 234, 0.2)',
                        }
                      },
                      '& .MuiInputLabel-root': {
                        fontWeight: 500,
                      }
                    }}
                  />
                </Grid>

                <Grid container spacing={3}>
                  <Grid item size={{ xs: 12, md: 6 }}>
                    <FormControl
                      fullWidth
                      error={!!errors.targetAudience}
                      sx={{
                        mb: 3,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 20px rgba(102, 126, 234, 0.1)',
                          },
                          '&.Mui-focused': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 20px rgba(102, 126, 234, 0.2)',
                          }
                        },
                        '& .MuiInputLabel-root': {
                          fontWeight: 500,
                        }
                      }}
                    >
                      <InputLabel>Target Audience</InputLabel>
                      <Select
                        value={courseData.targetAudience}
                        onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                        label="Target Audience"
                      >
                        {targetAudiences.map((audience) => (
                          <MenuItem key={audience} value={audience}>
                            {audience}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.targetAudience && (
                        <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                          {errors.targetAudience}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item size={{ xs: 12, md: 6 }}>
                    <FormControl
                      fullWidth
                      error={!!errors.category}
                      sx={{
                        mb: 3,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 20px rgba(102, 126, 234, 0.1)',
                          },
                          '&.Mui-focused': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 20px rgba(102, 126, 234, 0.2)',
                          }
                        },
                        '& .MuiInputLabel-root': {
                          fontWeight: 500,
                        }
                      }}
                    >
                      <InputLabel>Category</InputLabel>
                      <Select
                        value={courseData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        label="Category"
                      >
                        {categories.map((category) => (
                          <MenuItem key={category} value={category}>
                            {category}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.category && (
                        <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                          {errors.category}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>
                </Grid>


                {/* Course Thumbnail - Only show if no lessons are added */}
                {!chapters.some(chapter => chapter.videos.length > 0) && (
                  <Grid item size={{ xs: 12, md: 12 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Course Thumbnail
                    </Typography>
                    <Box>
                      {courseData.thumbnail && (
                        <Box
                          component="img"
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
                          sx={{
                            width: 200,
                            height: 120,
                            objectFit: 'cover',
                            borderRadius: 2,
                            border: '2px solid #e0e0e0'
                          }}
                          onError={(e) => {
                            console.error('🖼️ CreateCourse: Thumbnail failed to load:', e.target.src);
                            e.target.style.display = 'none';
                          }}
                        />
                      )}
                      <Box>
                        <Button
                          variant="outlined"
                          component="label"
                          startIcon={<UploadIcon />}
                          sx={{ mb: 1 }}
                        >
                          Upload Course Thumbnail
                          <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={handleCourseThumbnailUpload}
                          />
                        </Button>
                      </Box>
                      <Typography variant="caption" color="text.secondary" sx={{ marginLeft: "5px" }}>
                        Recommended size: 1200x675 pixels (16:9 ratio)
                      </Typography>
                    </Box>
                  </Grid>
                )}

                <Grid item size={{ xs: 12, md: 12 }}>
                  <Typography variant="h6" sx={{ mb: 2, mt: 3 }}>
                    Content Type
                  </Typography>
                  <Grid container spacing={2}>
                    {contentTypes.map((type) => (
                      <Grid item size={{ xs: 12, md: 6 }} key={type.value}>
                        <Card
                          sx={{
                            cursor: 'pointer',
                            border: courseData.contentType === type.value ? '2px solid #0F3C60' : '1px solid #e0e0e0',
                            background: courseData.contentType === type.value ? '#f8f9ff' : '#ffffff',
                            '&:hover': {
                              borderColor: '#0F3C60',
                              background: '#f8f9ff',
                            }
                          }}
                          onClick={() => handleInputChange('contentType', type.value)}
                        >
                          <CardContent sx={{ p: 3, textAlign: 'center' }}>
                            <Box sx={{ mb: 2 }}>
                              {type.icon}
                            </Box>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {type.label}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {type.value === 'video'
                                ? 'Create video-based lessons with chapters'
                                : 'Create text-based lessons with chapters'
                              }
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                  {errors.contentType && (
                    <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                      {errors.contentType}
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item size={{ xs: 12, md: 8, lg: 8 }}>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    Course Structure
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddChapter}
                    sx={{
                      background: '#0F3C60',
                      '&:hover': { background: '#3367d6' }
                    }}
                  >
                    Add Chapter
                  </Button>
                </Box>

                {errors.chapters && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {errors.chapters}
                  </Alert>
                )}

                {chapters.length === 0 ? (
                  <Card sx={{ p: 4, textAlign: 'center', background: '#f8f9fa' }}>
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                      No chapters added yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Start by adding your first chapter to organize your course content
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={handleAddChapter}
                    >
                      Add First Chapter
                    </Button>
                  </Card>
                ) : (
                  <List sx={{ p: 0 }}>
                    <Grid container spacing={2}>
                      {chapters.map((chapter, index) => (
                        <Grid item size={{ xs: 12, md: 6 }}>
                          <Card key={chapter.id} sx={{ mb: 2 }}>
                            <CardContent sx={{ p: 3 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                  <DragIcon sx={{ color: 'text.secondary', cursor: 'grab' }} />
                                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Chapter {index + 1}: {chapter.title}
                                  </Typography>
                                  <Chip
                                    label={`${chapter.videos.length} ${courseData.contentType === 'video' ? 'videos' : 'lessons'}`}
                                    size="small"
                                    color="primary"
                                  />
                                </Box>

                              </Box>

                              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                {chapter.description}
                              </Typography>

                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="caption" color="text.secondary">
                                  {chapter.videos.length} {courseData.contentType === 'video' ? 'videos' : 'lessons'}
                                </Typography>
                                <Button
                                  size="small"
                                  startIcon={<AddIcon />}
                                  onClick={() => handleAddVideo(chapter.id)}
                                  disabled={!courseData.contentType}
                                >
                                  Add {courseData.contentType === 'video' ? 'Video' : 'Lesson'}
                                </Button>
                              </Box>


                              {chapter.videos.length > 0 && (
                                <List sx={{ mt: 2, p: 0 }}>
                                  {chapter.videos.map((video, videoIndex) => (
                                    <ListItem key={video.id} sx={{ px: 0, py: 1 }}>
                                      <ListItemText
                                        primary={`${videoIndex + 1}. ${video.title}`}
                                        secondary={video.videoType === 'upload' ? 'Uploaded Video' : `${video.videoType} video`}
                                      />
                                      <ListItemSecondaryAction>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                          <Button
                                            size="small"
                                            variant='outlined'
                                            onClick={() => handleEditVideo(video, chapter.id)}
                                          >
                                            Edit
                                          </Button>
                                          <Button
                                            size="small"
                                            variant='outlined'
                                            onClick={() => handleDeleteVideo(video.id, chapter.id)}
                                            color="error"
                                          >
                                             Delete 
                                          </Button>
                                        </Box>
                                      </ListItemSecondaryAction>
                                    </ListItem>
                                  ))}
                                </List>
                              )}

                              <Divider />
                              <Box sx={{ display: 'flex', gap: 1, mt: 2, justifyContent: 'flex-end' }}>
                                <Button
                                  size="small"
                                  variant='outlined'
                                  onClick={() => handleEditChapter(chapter)}
                                >
                                  Edit
                                </Button>
                                <Button variant='outlined' size="small" onClick={() => handleDeleteChapter(chapter.id)} color="error">
                                  Delete
                                </Button>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </List>
                )}
              </Box>
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
              Review & Publish
            </Typography>

            <Grid container spacing={3}>
              <Grid item size={{ xs: 12, md: 6 }}>
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    {courseData.thumbnail && !chapters.some(chapter => chapter.videos.length > 0) && (
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                          Course Thumbnail
                        </Typography>
                        <Box
                          component="img"
                          src={courseData.thumbnail}
                          alt="Course thumbnail"
                          sx={{
                            width: '100%',
                            height: 200,
                            borderRadius: 2,
                            objectFit: 'cover',
                            borderRadius: 1,
                            border: '1px solid #e0e0e0'
                          }}
                        />
                      </Box>
                    )}
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Course Details
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Title
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {courseData.title}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Description
                      </Typography>
                      <Typography variant="body1">
                        {courseData.description}
                      </Typography>
                    </Box>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Category
                          </Typography>
                          <Chip label={courseData.category} size="small" />
                        </Box>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Target Audience
                          </Typography>
                          <Chip label={courseData.targetAudience} size="small" />
                        </Box>
                      </Grid>
                    </Grid>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Content Type
                      </Typography>
                      <Chip
                        label={courseData.contentType === 'video' ? 'Video Based' : 'Text Based'}
                        size="small"
                        icon={courseData.contentType === 'video' ? <VideoIcon /> : <TextIcon />}
                      />
                    </Box>

                  </CardContent>
                </Card>
              </Grid>

              <Grid item size={{ xs: 12, md: 6 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Course Structure
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'space-between' }}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Total Chapters
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#0F3C60' }}>
                          {chapters.length}
                        </Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Total {courseData.contentType === 'video' ? 'Videos' : 'Lessons'}
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#34a853' }}>
                          {chapters.reduce((total, chapter) => total + chapter.videos.length, 0)}
                        </Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Course Type
                        </Typography>
                        <Chip
                          label={courseData.contentType === 'video' ? 'Video Course' : 'Text Course'}
                          size="small"
                          color="primary"
                        />
                      </Box>
                    </Box>

                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box className="bg-black">

      <FocusedSidebar />

      <Box sx={{
        flex: 1,
        ml: 30,
        mt: 0,
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <Box className="header_box" >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0 }}>
            <IconButton onClick={() => {
              let backUrl;
              if (communityUrls) {
                backUrl = communityUrls.courses;
              } else if (communityName) {
                // Fallback: construct URL manually if communityUrls is not available
                backUrl = `/${communityName}/courses`;
              } else {
                // Last resort: redirect to courses page
                backUrl = '/courses';
              }
              console.log('Back button navigation:', { communityName, communityUrls, backUrl });
              navigate(backUrl);
            }} sx={{ mr: 2 }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 700, marginBottom: 0 }}>
              Create New Course
            </Typography>
          </Box>
        </Box>
        <Box sx={{ flex: 1, px: 0, py: 0, overflow: 'visible' }}>
          <Container maxWidth="xl" sx={{ overflow: 'visible' }}>
            <Card sx={{
              mb: 4,
              borderRadius: 4,
              border: 'none',
              boxShadow: 'none',
            }}>
              <CardContent sx={{ p: 0 }} >
                <Stepper
                  activeStep={activeStep}
                  sx={{
                    mb: 4,
                    justifyContent: 'start',
                    '& .MuiStepLabel-root': {
                      padding: '0',
                      '& .MuiStepLabel-label': {
                        color: '#0f3b609e',
                        fontWeight: 600,
                        fontSize: '1rem',
                        '&.Mui-active': {
                          color: '#0F3C60',
                          fontWeight: 700,
                          padding: '8px 20px',
                          borderBottom: '2px solid #0F3C60',
                        },
                        '&.Mui-completed': {
                          color: '#16A34A',
                        }
                      },
                      '& .MuiStepLabel-iconContainer': {
                        display: 'none',
                        '& .MuiSvgIcon-root': {
                          color: 'rgba(255, 255, 255, 0.5)',
                          fontSize: '2rem',
                          '&.Mui-active': {
                            color: '#ffffff',
                            filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.5))',
                          },
                          '&.Mui-completed': {
                            color: '#ffffff',
                          }
                        }
                      }
                    },
                    '& .MuiStepConnector-root': {
                      display: 'none',
                      '& .MuiStepConnector-line': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        borderWidth: 2,
                      }
                    }
                  }}
                >
                  {steps.map((label, index) => (
                    <Step key={label}>
                      <StepLabel
                        StepIconComponent={({ active, completed }) => (
                          <Box
                            sx={{
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: active
                                ? 'linear-gradient(135deg, #0F3C60 0%, #0F3C60 100%)'
                                : completed
                                  ? 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)'
                                  : 'rgba(255, 255, 255, 0.2)',
                              color: active ? '#ffffff' : completed ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
                              fontWeight: 'bold',
                              fontSize: '1.2rem',
                              boxShadow: active
                                ? '0 4px 20px rgba(255, 255, 255, 0.3)'
                                : completed
                                  ? '0 4px 20px rgba(76, 175, 80, 0.3)'
                                  : 'none',
                              transition: 'all 0.3s ease',
                              transform: active ? 'scale(1.1)' : 'scale(1)',
                            }}
                          >
                            {/* {completed ? <CheckCircleIcon /> : index + 1} */}
                          </Box>
                        )}
                      >
                        {label}
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>

                {/* Enhanced Step Content */}
                <Card sx={{
                  mb: 4,
                  p: 0,
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  boxShadow: 'none',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  overflow: 'hidden',
                  position: 'relative',

                }}>
                  <CardContent sx={{ p: 0, }}>

                    {getStepContent(activeStep)}
                  </CardContent>
                </Card>

                {/* Enhanced Navigation Buttons */}
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  pt: 2,
                  borderTop: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    startIcon={<ArrowBackIcon />}
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 3,
                      background: activeStep === 0
                        ? 'rgba(255, 255, 255, 0.1)'
                        : 'rgba(255, 255, 255, 0.2)',
                      color: activeStep === 0
                        ? 'rgba(255, 255, 255, 0.5)'
                        : '#ffffff',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.3)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 20px rgba(255, 255, 255, 0.2)',
                      },
                      transition: 'all 0.3s ease',
                      '&:disabled': {
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'rgba(255, 255, 255, 0.3)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }
                    }}
                  >
                    Back
                  </Button>

                  <Box>
                    {activeStep === steps.length - 1 ? (
                      <Box sx={{ display: 'flex', gap: 3 }}>
                        <Button
                          variant="outlined"
                          onClick={() => {
                            console.log('Save as Draft clicked!');
                            handleSubmitDraft();
                          }}
                          disabled={isSubmitting}
                          startIcon={isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />}
                          sx={{
                            px: 4,
                            py: 1.5,
                            borderRadius: 3,
                            borderColor: 'rgba(255, 255, 255, 0.5)',
                            color: '#ffffff',
                            background: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)',
                            '&:hover': {
                              borderColor: '#ffffff',
                              backgroundColor: 'rgba(255, 255, 255, 0.2)',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 4px 20px rgba(255, 255, 255, 0.2)',
                            },
                            '&:disabled': {
                              borderColor: 'rgba(255, 255, 255, 0.2)',
                              color: 'rgba(255, 255, 255, 0.5)',
                              background: 'rgba(255, 255, 255, 0.05)',
                            },
                            transition: 'all 0.3s ease',
                          }}
                        >
                          {isSubmitting ? 'Saving...' : 'Save as Draft'}
                        </Button>
                        <Button
                          variant="contained"
                          onClick={() => {
                            console.log('Publish Course clicked!');
                            console.log('Current step:', activeStep);
                            console.log('Total steps:', steps.length);
                            handleSubmit();
                          }}
                          disabled={isSubmitting}
                          startIcon={isSubmitting ? <CircularProgress size={20} /> : <PublishIcon />}
                          sx={{
                            px: 4,
                            py: 1.5,
                            borderRadius: 3,
                            background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                            boxShadow: '0 4px 20px rgba(76, 175, 80, 0.3)',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #45a049 0%, #3d8b40 100%)',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 6px 25px rgba(76, 175, 80, 0.4)',
                            },
                            '&:disabled': {
                              background: 'rgba(76, 175, 80, 0.3)',
                              boxShadow: 'none',
                            },
                            transition: 'all 0.3s ease',
                          }}
                        >
                          {isSubmitting ? 'Publishing...' : 'Publish Course'}
                        </Button>
                      </Box>
                    ) : (
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        endIcon={<ArrowForwardIcon />}

                      >
                        Next
                      </Button>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Container>
        </Box>
      </Box>
      {/* Chapter Dialog */}
      <ChapterDialog
        open={openChapterDialog}
        onClose={() => setOpenChapterDialog(false)}
        onSave={handleSaveChapter}
        chapter={editingChapter}
      />

      {/* Video Dialog */}
      {courseData.contentType && (
        <VideoDialog
          open={openVideoDialog}
          onClose={() => setOpenVideoDialog(false)}
          onSave={handleSaveVideo}
          video={editingVideo}
          contentType={courseData.contentType}
          chapter={selectedChapter}
        />
      )}
    </Box>
  );
};

// Chapter Dialog Component
const ChapterDialog = ({ open, onClose, onSave, chapter }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });

  useEffect(() => {
    if (open) {
      if (chapter) {
        setFormData({
          title: chapter.title,
          description: chapter.description,
        });
      } else {
        setFormData({
          title: '',
          description: '',
        });
      }
    }
  }, [open, chapter]);

  const handleSubmit = () => {
    if (formData.title.trim() && formData.description.trim()) {
      onSave(formData);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {chapter ? 'Edit Chapter' : 'Add New Chapter'}
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Chapter Title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          sx={{ mb: 3, mt: 1 }}
        />
        <TextField
          fullWidth
          label="Chapter Description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          multiline
          rows={3}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {chapter ? 'Update' : 'Add'} Chapter
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Video Dialog Component
const VideoDialog = ({ open, onClose, onSave, video, contentType, chapter }) => {
  console.log('VideoDialog props:', { open, video, contentType, chapter });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    thumbnail: '',
    videoType: 'upload', // 'upload', 'youtube', 'loom', 'vimeo'
    videoUrl: '',
    videoFile: null,
    pdfFile: null, // For PDF uploads
    contentType: 'video', // 'video', 'text', 'pdf'
  });
  const [editorError, setEditorError] = useState(false);

  // TinyMCE editor configuration
  const handleEditorChange = (content) => {
    setFormData(prev => ({ ...prev, content }));
  };

  // Fallback textarea handler
  const handleTextareaChange = (event) => {
    setFormData(prev => ({ ...prev, content: event.target.value }));
  };

  useEffect(() => {
    if (open) {
      if (video) {
        setFormData({
          title: video.title,
          description: video.description,
          content: video.content || '',
          thumbnail: video.thumbnail || '',
          videoType: video.videoType || 'upload',
          videoUrl: video.videoUrl || '',
          videoFile: video.videoFile || null,
          pdfFile: video.pdfFile || null,
          contentType: video.contentType || 'video',
        });
      } else {
        setFormData({
          title: '',
          description: '',
          content: '',
          thumbnail: '',
          videoType: 'upload',
          videoUrl: '',
          videoFile: null,
          pdfFile: null,
          contentType: contentType === 'video' ? 'video' : contentType,
        });

      }
    }
  }, [open, video, contentType]);

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.title.trim()) {
      alert(`Please enter a ${contentType} title`);
      return;
    }
    if (!formData.description.trim()) {
      alert(`Please enter a ${contentType} description`);
      return;
    }

    // Validate content based on type
    if (contentType === 'video') {
      // Video validation
      if (formData.videoType === 'upload' && !formData.videoFile) {
        alert('Please upload a video file');
        return;
      }
      if (formData.videoType !== 'upload' && !formData.videoUrl.trim()) {
        alert('Please enter a video URL');
        return;
      }
    } else if (contentType === 'text') {
      // Text validation - check if it's write content or PDF
      if (formData.contentType === 'write' && !formData.content.trim()) {
        alert('Please enter some content for the text lecture');
        return;
      }
      if (formData.contentType === 'pdf' && !formData.pdfFile) {
        alert('Please upload a PDF file');
        return;
      }
    }

    console.log(`Saving ${contentType} data:`, formData);
    onSave(formData);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, videoFile: file }));
    }
  };

  const handleContentTypeChange = (newContentType) => {
    console.log('Content type changed to:', newContentType);
    setFormData(prev => ({
      ...prev,
      contentType: newContentType,
      // Clear content when switching types
      content: newContentType === 'pdf' ? '' : prev.content,
      pdfFile: newContentType === 'pdf' ? prev.pdfFile : null
    }));
  };

  const handlePdfUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type === 'application/pdf') {
        try {
          // Create FormData for file upload
          const formData = new FormData();
          formData.append('pdf', file);

          // Upload PDF to server
          console.log('Uploading PDF file:', file.name, file.size, file.type);

          const response = await fetch(apiUrl('/api/upload/pdf'), {
            method: 'POST',
            body: formData,
          });

          console.log('Upload response status:', response.status);

          if (!response.ok) {
            const errorText = await response.text();
            console.error('Upload response error:', errorText);
            throw new Error(`PDF upload failed: ${response.status} ${errorText}`);
          }

          const result = await response.json();
          console.log('Upload response result:', result);

          // Update form data with PDF URL and set content type
          setFormData(prev => ({
            ...prev,
            pdfFile: file,
            content: result.url, // Store the uploaded PDF URL (using 'url' from response)
            contentType: 'pdf' // Ensure content type is set
          }));

          console.log('PDF uploaded successfully:', result.url);
          alert(`PDF uploaded successfully: ${file.name}`);
        } catch (error) {
          console.error('Error uploading PDF:', error);
          console.error('Error details:', error.message);
          alert(`Failed to upload PDF: ${error.message || 'Unknown error'}. Please try again.`);
        }
      } else {
        alert('Please upload a PDF file');
      }
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
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
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


          {/* Content Type Specific Sections */}
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
                              '&:hover': { background: '#3367d6' }
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
                      Examples: {
                        formData.videoType === 'youtube' ?
                          'https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID' :
                          formData.videoType === 'vimeo' ?
                            'https://vimeo.com/VIDEO_ID or https://player.vimeo.com/video/VIDEO_ID' :
                            formData.videoType === 'loom' ?
                              'https://www.loom.com/share/VIDEO_ID or https://useloom.com/share/VIDEO_ID' :
                              ''
                      }
                    </Typography>
                  </Box>
                )}
              </Grid>

              {/* Video Preview */}
              {(formData.videoUrl || formData.videoFile) && (
                <Grid item size={12}>
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
            <>
              {/* Content Type Selection for Text Courses */}
              <Grid item size={12}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Choose Content Type
                </Typography>
                <Grid container spacing={2}>
                  {[
                    {
                      value: 'write',
                      label: 'Write Own Content',
                      icon: TextIcon,
                      description: 'Use rich text editor to write your lesson',
                      color: '#0F3C60',
                      disabled: true,
                      comingSoon: true
                    },
                    {
                      value: 'pdf',
                      label: 'Upload PDF',
                      icon: DescriptionIcon,
                      description: 'Upload a PDF document as lesson content',
                      color: '#34a853'
                    }
                  ].map((type) => (
                    <Grid item size={{ xs: 12, sm: 6 }} key={type.value}>
                      <Card
                        onClick={() => {
                          if (type.disabled) {
                            // Show "still under development" message
                            alert('This feature is still under development. Please use "Upload PDF" option for now.');
                            return;
                          }
                          handleContentTypeChange(type.value);
                        }}
                        sx={{
                          cursor: type.disabled ? 'not-allowed' : 'pointer',
                          border: formData.contentType === type.value ? `2px solid ${type.color}` : '1px solid #e0e0e0',
                          background: type.disabled ? '#f5f5f5' : (formData.contentType === type.value ? '#f8f9ff' : '#ffffff'),
                          opacity: type.disabled ? 0.6 : 1,
                          transition: 'all 0.3s ease',
                          position: 'relative',
                          '&:hover': type.disabled ? {} : {
                            borderColor: type.color,
                            background: '#f8f9ff',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          }
                        }}
                      >
                        {type.comingSoon && (
                          <Box sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            background: '#ff9800',
                            color: 'white',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            fontSize: '0.7rem',
                            fontWeight: 'bold',
                            zIndex: 1
                          }}>
                            Coming Soon
                          </Box>
                        )}
                        <CardContent sx={{ p: 3, textAlign: 'center' }}>
                          <Box sx={{
                            mb: 2,
                            color: type.disabled ? '#999999' : (formData.contentType === type.value ? type.color : '#666666')
                          }}>
                            <type.icon sx={{ fontSize: 32 }} />
                          </Box>
                          <Typography variant="body1" sx={{
                            fontWeight: 600,
                            color: type.disabled ? '#999999' : (formData.contentType === type.value ? type.color : '#000000'),
                            mb: 1
                          }}>
                            {type.label}
                          </Typography>
                          <Typography variant="caption" color={type.disabled ? 'text.disabled' : 'text.secondary'}>
                            {type.disabled ? 'Still under development' : type.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>

              {/* Write Own Content Section */}
              {formData.contentType === 'write' && (
                <Grid item size={12}>
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                    Write Your Lesson Content
                  </Typography>
                  <Card sx={{ p: 2, border: '1px solid #e0e0e0' }}>
                    {!editorError ? (
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
                          value={formData.content}
                          onEditorChange={handleEditorChange}
                          onInit={(evt, editor) => {
                            console.log('TinyMCE editor initialized successfully');
                          }}
                          onLoadContent={(editor) => {
                            console.log('TinyMCE content loaded');
                          }}
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
                            placeholder: 'Enter your lesson content here...',
                            // Use CDN without API key validation
                            base_url: 'https://cdnjs.cloudflare.com/ajax/libs/tinymce/6.7.0',
                            suffix: '.min',
                            // Disable API key validation
                            license_key: 'gpl',
                            // Add error handling
                            setup: (editor) => {
                              editor.on('LoadError', (e) => {
                                console.error('TinyMCE load error:', e);
                                setEditorError(true);
                              });
                            }
                          }}
                        />
                      </Box>
                    ) : (
                      <Box>
                        <Typography variant="body2" color="warning.main" sx={{ mb: 2 }}>
                          ⚠️ Rich text editor failed to load. Using fallback text editor.
                        </Typography>
                        <TextField
                          fullWidth
                          multiline
                          rows={12}
                          value={formData.content}
                          onChange={handleTextareaChange}
                          placeholder="Enter your lesson content here... You can use HTML tags for formatting: &lt;h1&gt;Title&lt;/h1&gt;, &lt;p&gt;Paragraph&lt;/p&gt;, &lt;strong&gt;Bold&lt;/strong&gt;, &lt;em&gt;Italic&lt;/em&gt;, &lt;ul&gt;&lt;li&gt;List item&lt;/li&gt;&lt;/ul&gt;"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              fontFamily: 'monospace',
                              fontSize: '14px'
                            }
                          }}
                        />
                        <Button
                          size="small"
                          onClick={() => setEditorError(false)}
                          sx={{ mt: 1 }}
                        >
                          Try Rich Text Editor Again
                        </Button>
                      </Box>
                    )}
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      💡 Tip: Use the professional toolbar above to format your content with headers, bold, italic, lists, alignment, links, emojis, and more!
                    </Typography>
                    <Typography variant="caption" color="warning.main" sx={{ mt: 1, display: 'block' }}>
                      ⚠️ If the editor doesn't load, you can use HTML tags directly: &lt;h1&gt;Title&lt;/h1&gt;, &lt;p&gt;Paragraph&lt;/p&gt;, &lt;strong&gt;Bold&lt;/strong&gt;, &lt;em&gt;Italic&lt;/em&gt;, &lt;ul&gt;&lt;li&gt;List item&lt;/li&gt;&lt;/ul&gt;
                    </Typography>
                  </Card>
                </Grid>
              )}

              {/* PDF Upload Section for Text Courses */}
              {formData.contentType === 'pdf' && (
                <Grid item size={12}>
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                    Upload PDF Document
                  </Typography>
                  <Card
                    sx={{
                      border: '2px dashed #e0e0e0',
                      borderRadius: 2,
                      p: 3,
                      textAlign: 'center',
                      background: formData.pdfFile ? '#f8f9ff' : '#fafafa',
                      borderColor: formData.pdfFile ? '#0F3C60' : '#e0e0e0',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: '#0F3C60',
                        background: '#f8f9ff',
                      }
                    }}
                  >
                    {formData.pdfFile ? (
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <CheckCircleIcon sx={{ color: '#34a853', fontSize: 32 }} />
                          <Box sx={{ textAlign: 'left' }}>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              {formData.pdfFile.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {(formData.pdfFile.size / (1024 * 1024)).toFixed(2)} MB
                            </Typography>
                          </Box>
                        </Box>
                        <Button
                          variant="outlined"
                          component="label"
                          startIcon={<UploadIcon />}
                          size="small"
                        >
                          Change PDF
                          <input
                            type="file"
                            hidden
                            accept=".pdf"
                            onChange={handlePdfUpload}
                          />
                        </Button>
                      </Box>
                    ) : (
                      <Box>
                        <DescriptionIcon sx={{ fontSize: 48, color: '#0F3C60', mb: 2 }} />
                        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                          Upload PDF Document
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          Supported format: PDF (Max 50MB)
                        </Typography>
                        <Button
                          variant="contained"
                          component="label"
                          startIcon={<UploadIcon />}
                          sx={{
                            background: '#0F3C60',
                            '&:hover': { background: '#3367d6' }
                          }}
                        >
                          Choose PDF File
                          <input
                            type="file"
                            hidden
                            accept=".pdf"
                            onChange={handlePdfUpload}
                          />
                        </Button>
                      </Box>
                    )}
                  </Card>
                </Grid>
              )}
            </>
          )}

          {/* PDF Upload Section for Video Dialog */}
          {(contentType === 'pdf' || formData.contentType === 'pdf') && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                Upload PDF Document
              </Typography>
              <Card
                sx={{
                  border: '2px dashed #e0e0e0',
                  borderRadius: 2,
                  p: 3,
                  textAlign: 'center',
                  background: formData.pdfFile ? '#f8f9ff' : '#fafafa',
                  borderColor: formData.pdfFile ? '#0F3C60' : '#e0e0e0',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: '#0F3C60',
                    background: '#f8f9ff',
                  }
                }}
              >
                {formData.pdfFile ? (
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <CheckCircleIcon sx={{ color: '#34a853', fontSize: 32 }} />
                      <Box sx={{ textAlign: 'left' }}>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {formData.pdfFile.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {(formData.pdfFile.size / (1024 * 1024)).toFixed(2)} MB
                        </Typography>
                      </Box>
                    </Box>
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<UploadIcon />}
                      size="small"
                    >
                      Change PDF
                      <input
                        type="file"
                        hidden
                        accept=".pdf"
                        onChange={handlePdfUpload}
                      />
                    </Button>
                  </Box>
                ) : (
                  <Box>
                    <DescriptionIcon sx={{ fontSize: 48, color: '#0F3C60', mb: 2 }} />
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                      Upload PDF Document
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Supported format: PDF (Max 50MB)
                    </Typography>
                    <Button
                      variant="contained"
                      component="label"
                      startIcon={<UploadIcon />}
                      sx={{
                        background: '#0F3C60',
                        '&:hover': { background: '#3367d6' }
                      }}
                    >
                      Choose PDF File
                      <input
                        type="file"
                        hidden
                        accept=".pdf"
                        onChange={handlePdfUpload}
                      />
                    </Button>
                  </Box>
                )}
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

export default CreateCourse;
