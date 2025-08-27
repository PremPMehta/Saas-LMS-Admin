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
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const CreateCourse = () => {
  const navigate = useNavigate();
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
    { value: 'video', label: 'Video Based', icon: <VideoIcon /> },
    { value: 'text', label: 'Text Based', icon: <TextIcon /> },
  ];

  const handleInputChange = (field, value) => {
    setCourseData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCourseThumbnailUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCourseData(prev => ({ ...prev, thumbnail: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateStep = (step) => {
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
    setSelectedChapter(chapters.find(ch => ch.id === chapterId));
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

  const handleSaveVideo = (videoData) => {
    if (editingVideo) {
      setChapters(prev => prev.map(chapter => {
        if (chapter.id === selectedChapter.id) {
          return {
            ...chapter,
            videos: chapter.videos.map(video => 
              video.id === editingVideo.id ? { ...video, ...videoData } : video
            )
          };
        }
        return chapter;
      }));
    } else {
      const newVideo = {
        id: Date.now().toString(),
        ...videoData
      };
      setChapters(prev => prev.map(chapter => {
        if (chapter.id === selectedChapter.id) {
          return {
            ...chapter,
            videos: [...chapter.videos, newVideo]
          };
        }
        return chapter;
      }));
    }
    setOpenVideoDialog(false);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirect to dashboard with success message
      navigate('/community-dashboard', { 
        state: { 
          message: 'Course created successfully!' 
        }
      });
    } catch (error) {
      console.error('Error creating course:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                Course Basic Information
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
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

            <Grid item xs={12}>
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

            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.targetAudience} sx={{ mb: 3 }}>
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

            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.category} sx={{ mb: 3 }}>
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

            {/* Course Thumbnail */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Course Thumbnail
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                {courseData.thumbnail && (
                  <Box
                    component="img"
                    src={courseData.thumbnail}
                    alt="Course thumbnail"
                    sx={{
                      width: 200,
                      height: 120,
                      objectFit: 'cover',
                      borderRadius: 2,
                      border: '2px solid #e0e0e0'
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
                  <Typography variant="caption" color="text.secondary">
                    Recommended size: 1200x675 pixels (16:9 ratio)
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Content Type
              </Typography>
              <Grid container spacing={2}>
                {contentTypes.map((type) => (
                  <Grid item xs={12} md={6} key={type.value}>
                    <Card
                      sx={{
                        cursor: 'pointer',
                        border: courseData.contentType === type.value ? '2px solid #4285f4' : '1px solid #e0e0e0',
                        background: courseData.contentType === type.value ? '#f8f9ff' : '#ffffff',
                        '&:hover': {
                          borderColor: '#4285f4',
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
        );

      case 1:
        return (
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
                  onClick={handleAddChapter}
                >
                  Add First Chapter
                </Button>
              </Card>
            ) : (
              <List sx={{ p: 0 }}>
                {chapters.map((chapter, index) => (
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
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleEditChapter(chapter)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteChapter(chapter.id)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
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
                                  <IconButton
                                    size="small"
                                    onClick={() => handleEditVideo(video, chapter.id)}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    onClick={() => handleDeleteVideo(video.id, chapter.id)}
                                    color="error"
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Box>
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
        );

      case 2:
        return (
          <Box>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
              Review & Publish
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ mb: 3 }}>
                  <CardContent>
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
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Category
                      </Typography>
                      <Chip label={courseData.category} size="small" />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Target Audience
                      </Typography>
                      <Chip label={courseData.targetAudience} size="small" />
                    </Box>
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
                     {courseData.thumbnail && (
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
                             height: 120,
                             objectFit: 'cover',
                             borderRadius: 1,
                             border: '1px solid #e0e0e0'
                           }}
                         />
                       </Box>
                     )}
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Course Structure
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Total Chapters
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#4285f4' }}>
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
    <Box sx={{ 
      minHeight: '100vh',
      background: '#f8f9fa',
      py: 4
    }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <IconButton onClick={() => navigate('/community-dashboard')} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Create New Course
          </Typography>
        </Box>

        {/* Stepper */}
        <Card sx={{ mb: 4 }}>
          <CardContent sx={{ p: 3 }}>
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {/* Step Content */}
            <Box sx={{ mb: 4 }}>
              {getStepContent(activeStep)}
            </Box>

            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                startIcon={<ArrowBackIcon />}
                sx={{ px: 3 }}
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
                      background: '#34a853',
                      '&:hover': { background: '#2d8f47' },
                      px: 4
                    }}
                  >
                    {isSubmitting ? 'Publishing...' : 'Publish Course'}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      background: '#4285f4',
                      '&:hover': { background: '#3367d6' },
                      px: 4
                    }}
                  >
                    Next
                  </Button>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>

      {/* Chapter Dialog */}
      <ChapterDialog
        open={openChapterDialog}
        onClose={() => setOpenChapterDialog(false)}
        onSave={handleSaveChapter}
        chapter={editingChapter}
      />

      {/* Video Dialog */}
      <VideoDialog
        open={openVideoDialog}
        onClose={() => setOpenVideoDialog(false)}
        onSave={handleSaveVideo}
        video={editingVideo}
        contentType={courseData.contentType}
        chapter={selectedChapter}
      />
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
  }, [chapter]);

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
    if (video) {
      setFormData({
        title: video.title,
        description: video.description,
        content: video.content || '',
        thumbnail: video.thumbnail || '',
        videoType: video.videoType || 'upload',
        videoUrl: video.videoUrl || '',
        videoFile: video.videoFile || null,
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
      });
    }
  }, [video]);

  const handleSubmit = () => {
    if (formData.title.trim() && formData.description.trim()) {
      onSave(formData);
    }
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
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getVimeoVideoId = (url) => {
    const regExp = /vimeo\.com\/([0-9]+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
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
                  {[
                    { 
                      value: 'upload', 
                      label: 'Upload Video', 
                      icon: <UploadIcon />,
                      description: 'Upload video file directly',
                      color: '#4285f4'
                    },
                    { 
                      value: 'youtube', 
                      label: 'YouTube Link', 
                      icon: <PlayIcon />,
                      description: 'Paste YouTube video URL',
                      color: '#ff0000'
                    },
                    { 
                      value: 'loom', 
                      label: 'Loom Link', 
                      icon: <PlayIcon />,
                      description: 'Paste Loom video URL',
                      color: '#625df5'
                    },
                    { 
                      value: 'vimeo', 
                      label: 'Vimeo Link', 
                      icon: <PlayIcon />,
                      description: 'Paste Vimeo video URL',
                      color: '#1ab7ea'
                    },
                  ].map((type) => (
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
                            {React.cloneElement(type.icon, { fontSize: 32 })}
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
                  ))}
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
                              {formData.title || `${formData.videoType} Video`}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {formData.videoUrl}
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
                          {formData.videoType === 'youtube' && (
                            <iframe
                              width="100%"
                              height="100%"
                              src={`https://www.youtube.com/embed/${getYouTubeVideoId(formData.videoUrl)}`}
                              title="YouTube video player"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          )}
                          {formData.videoType === 'vimeo' && (
                            <iframe
                              width="100%"
                              height="100%"
                              src={`https://player.vimeo.com/video/${getVimeoVideoId(formData.videoUrl)}`}
                              title="Vimeo video player"
                              frameBorder="0"
                              allow="autoplay; fullscreen; picture-in-picture"
                              allowFullScreen
                            />
                          )}
                          {formData.videoType === 'loom' && (
                            <iframe
                              width="100%"
                              height="100%"
                              src={formData.videoUrl.replace('/share/', '/embed/')}
                              title="Loom video player"
                              frameBorder="0"
                              allowFullScreen
                            />
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
        <Button onClick={handleSubmit} variant="contained">
          {video ? 'Update' : 'Add'} {contentType === 'video' ? 'Video' : 'Lesson'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateCourse;
