import React, { useState, useEffect } from 'react';
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

const EditCourse = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
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
  const [openChapterDialog, setOpenChapterDialog] = useState(false);
  const [openVideoDialog, setOpenVideoDialog] = useState(false);
  const [editingChapter, setEditingChapter] = useState(null);
  const [editingVideo, setEditingVideo] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);

  const steps = ['Course Information', 'Course Structure', 'Review & Update'];

  const categories = [
    'Technology',
    'Business',
    'Design',
    'Marketing',
    'Development',
    'Data Science',
    'Product Management',
    'Finance',
    'Healthcare',
    'Education',
  ];

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

  const handleSaveVideo = (formData) => {
    console.log('🎬 handleSaveVideo called with formData:', formData);
    
    if (!formData?.title?.trim()) {
      alert('Video title is required');
      return;
    }

    const videoData = {
      title: formData.title,
      description: formData.description,
      videoUrl: formData.videoUrl,
      videoType: formData.videoType || 'youtube',
      duration: formData.duration || '0:00'
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
        thumbnail: courseData.thumbnail || 'https://via.placeholder.com/300x200/4285f4/ffffff?text=Course',
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
      navigate('/courses', { 
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
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton onClick={() => navigate('/courses')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Edit Course
        </Typography>
      </Box>

      {/* Stepper */}
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Step Content */}
      {activeStep === 0 && (
        <Grid container spacing={3}>
          <Grid item size={12}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Edit Course Information
            </Typography>
          </Grid>
          
          <Grid item size={12}>
            <TextField
              fullWidth
              label="Course Title"
              placeholder="Enter course title"
              value={courseData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              error={!!errors.title}
              helperText={errors.title}
              sx={{ mb: 3 }}
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
              sx={{ mb: 3 }}
            />
          </Grid>

          {/* Show read-only information for restricted fields */}
          <Grid item size={12}>
            <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary' }}>
              Course Settings (Read Only)
            </Typography>
            <Grid container spacing={2}>
              <Grid item size={{xs:12 , md:4}}>
                <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1, backgroundColor: '#f8f9fa' }}>
                  <Typography variant="subtitle2" color="text.secondary">Category</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>{courseData.category}</Typography>
                </Box>
              </Grid>
              <Grid item size={{xs:12 , md:4}}>
                <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1, backgroundColor: '#f8f9fa' }}>
                  <Typography variant="subtitle2" color="text.secondary">Target Audience</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>{courseData.targetAudience}</Typography>
                </Box>
              </Grid>
              <Grid item size={{xs:12 , md:4}}>
                <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1, backgroundColor: '#f8f9fa' }}>
                  <Typography variant="subtitle2" color="text.secondary">Content Type</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {contentTypes.find(type => type.value === courseData.contentType)?.label || courseData.contentType}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              These settings cannot be changed after course creation
            </Typography>
          </Grid>
        </Grid>
      )}

      {activeStep === 1 && (
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
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
                background: '#4285f4',
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
                onClick={() => {
                  console.log('🆕 Adding first chapter - resetting state');
                  setEditingChapter(null);
                  setSelectedChapter({ title: '', description: '' });
                  setOpenChapterDialog(true);
                }}
              >
                Add First Chapter
              </Button>
            </Card>
          ) : (
            <List sx={{ p: 0 }}>
              {chapters.map((chapter, index) => (
                <Card key={chapter._id} sx={{ mb: 2 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <DragIcon sx={{ color: 'text.secondary', cursor: 'grab' }} />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          Chapter {index + 1}: {chapter.title}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton onClick={() => handleEditChapter(chapter)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteChapter(chapter._id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {chapter.description}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Chip
                        icon={<VideoIcon />}
                        label={`${chapter.videos?.length || 0} ${courseData.contentType === 'video' ? 'videos' : 'lessons'}`}
                        size="small"
                        variant="outlined"
                      />
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
                      >
                        Add {courseData.contentType === 'video' ? 'Video' : 'Lesson'}
                      </Button>
                    </Box>

                    {chapter.videos && chapter.videos.length > 0 && (
                      <List dense sx={{ mt: 2 }}>
                        {chapter.videos.map((video, videoIndex) => (
                          <ListItem key={video._id} sx={{ pl: 2, pr: 0 }}>
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  {video.videoType === 'youtube' ? <VideoIcon /> : <TextIcon />}
                                  <Typography variant="body2">
                                    {videoIndex + 1}. {video.title}
                                  </Typography>
                                </Box>
                              }
                              secondary={video.description}
                            />
                            <ListItemSecondaryAction>
                              <IconButton
                                size="small"
                                onClick={() => handleEditVideo(video, chapter._id)}
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteVideo(video._id, chapter._id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </CardContent>
                </Card>
              ))}
            </List>
          )}
        </Box>
      )}

      {activeStep === 2 && (
        <Box>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            Review & Update Course
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                    Course Information
                  </Typography>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                      Course Title
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 500 }}>
                      {courseData.title}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                      Description
                    </Typography>
                    <Typography variant="body1">
                      {courseData.description}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                      Category
                    </Typography>
                    <Chip label={courseData.category} color="primary" />
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                      Target Audience
                    </Typography>
                    <Typography variant="body1">
                      {courseData.targetAudience}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                      Content Type
                    </Typography>
                    <Chip 
                      icon={courseData.contentType === 'video' ? <VideoIcon /> : <TextIcon />}
                      label={courseData.contentType === 'video' ? 'Video Based' : 'Text Based'} 
                      color="secondary"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                    Content Summary
                  </Typography>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                      Total Chapters
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 600, color: '#4285f4' }}>
                      {chapters.length}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                      Total {courseData.contentType === 'video' ? 'Videos' : 'Lessons'}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 600, color: '#34a853' }}>
                      {chapters.reduce((total, chapter) => total + (chapter.videos?.length || 0), 0)}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                      Course Type
                    </Typography>
                    <Chip 
                      label={courseData.contentType === 'video' ? 'Video Course' : 'Text Course'}
                      color="success"
                      variant="outlined"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          startIcon={<ArrowBackIcon />}
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
            >
              {isSubmitting ? 'Updating...' : 'Update Course'}
            </Button>
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

          // Helper functions to extract video IDs from URLs
          const getYouTubeVideoId = (url) => {
            if (!url) return null;
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
            const match = url.match(regExp);
            return (match && match[2].length === 11) ? match[2] : null;
          };

          const getVimeoVideoId = (url) => {
            if (!url) return null;
            const regExp = /vimeo\.com\/([0-9]+)/;
            const match = url.match(regExp);
            return match ? match[1] : null;
          };

          const getLoomVideoId = (url) => {
            if (!url) return null;
            const regExp = /loom\.com\/share\/([a-zA-Z0-9]+)/;
            const match = url.match(regExp);
            return match ? match[1] : null;
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
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={`${contentType === 'video' ? 'Video' : 'Lesson'} Title`}
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
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
                  <Grid item xs={12}>
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
                      <Grid item xs={12}>
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
                                color: '#4285f4'
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
                            <Grid item xs={12} sm={6} md={3} key={type.value}>
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
                      <Grid item xs={12}>
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
                                borderColor: formData.videoFile ? '#4285f4' : '#e0e0e0',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  borderColor: '#4285f4',
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
                                  <UploadIcon sx={{ fontSize: 48, color: '#4285f4', mb: 2 }} />
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
                                      background: '#4285f4',
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
                              error={formData.videoUrl && !(
                                (formData.videoType === 'youtube' && getYouTubeVideoId(formData.videoUrl)) ||
                                (formData.videoType === 'vimeo' && getVimeoVideoId(formData.videoUrl)) ||
                                (formData.videoType === 'loom' && getLoomVideoId(formData.videoUrl))
                              )}
                              helperText={
                                formData.videoUrl && !(
                                  (formData.videoType === 'youtube' && getYouTubeVideoId(formData.videoUrl)) ||
                                  (formData.videoType === 'vimeo' && getVimeoVideoId(formData.videoUrl)) ||
                                  (formData.videoType === 'loom' && getLoomVideoId(formData.videoUrl))
                                ) ? `Invalid ${formData.videoType} URL format` : ''
                              }
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <PlayIcon sx={{ color: '#4285f4' }} />
                                  </InputAdornment>
                                ),
                              }}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  '&:hover fieldset': {
                                    borderColor: '#4285f4',
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderColor: '#4285f4',
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
                                  <PlayIcon sx={{ color: '#4285f4', fontSize: 24 }} />
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
                                  <PlayIcon sx={{ color: '#4285f4', fontSize: 24 }} />
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
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Lesson Content"
                        placeholder="Enter lesson content or upload document"
                        value={formData.content}
                        onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                        multiline
                        rows={4}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <TextIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
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
