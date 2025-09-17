import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import {
  Save as SaveIcon,
  Preview as PreviewIcon,
  Upload as UploadIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Edit as EditIcon,
  PlayArrow as PlayIcon,
  VideoLibrary as VideoLibraryIcon
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { useResponsiveLayout } from '../utils/responsiveLayout';
import FocusedSidebar from '../components/FocusedSidebar';
import FocusedTopBar from '../components/FocusedTopBar';
import useDocumentTitle from '../contexts/useDocumentTitle';

const AboutUsAdmin = () => {
  useDocumentTitle('About Us Management - Bell & Desk');
  const { communityName } = useParams();
  const { isMobile, getMainContentMargin } = useResponsiveLayout();

  // State for form data
  const [formData, setFormData] = useState({
    // Basic Info
    communityName: '',
    communityBrandName: '',
    communityDescription: '',
    communityLogoUrl: '',
    
    // Header
    loginButtonText: 'LOG IN',
    loginButtonUrl: '',
    
    // Video Settings
    mainVideoId: null,
    mainVideoTitle: '',
    escButtonText: 'esc',
    speedIndicator: '1.2×',
    additionalControlText: '1dd',
    originalDuration: '2 min 57 sec',
    currentDuration: '2 min 28 sec',
    autoplay: false,
    muteDefault: false,
    
    // Page Status
    pageStatus: 'draft'
  });

  // State for videos
  const [videos, setVideos] = useState([]);
  const [thumbnails, setThumbnails] = useState([]);
  
  // UI State
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [videoUploadOpen, setVideoUploadOpen] = useState(false);
  const [newVideo, setNewVideo] = useState({ title: '', description: '', file: null });
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });

  // Load existing data
  useEffect(() => {
    loadAboutUsData();
    loadVideos();
    loadThumbnails();
  }, [communityName]);

  const loadAboutUsData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('communityToken');
      
      const response = await fetch(`/api/about-us/${communityName}/settings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setFormData(result.data);
        } else {
          showAlert(result.message || 'Error loading data', 'error');
        }
      } else {
        showAlert('Error loading data', 'error');
      }
    } catch (error) {
      console.error('Error loading about us data:', error);
      showAlert('Error loading data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadVideos = async () => {
    try {
      const token = localStorage.getItem('communityToken');
      
      const response = await fetch(`/api/about-us/${communityName}/videos`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setVideos(result.data);
        }
      }
    } catch (error) {
      console.error('Error loading videos:', error);
    }
  };

  const loadThumbnails = async () => {
    try {
      const token = localStorage.getItem('communityToken');
      
      const response = await fetch(`/api/about-us/${communityName}/thumbnails`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setThumbnails(result.data);
        }
      }
    } catch (error) {
      console.error('Error loading thumbnails:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async (status = 'draft') => {
    try {
      setSaving(true);
      const token = localStorage.getItem('communityToken');
      
      const dataToSave = {
        ...formData,
        pageStatus: status
      };

      const response = await fetch(`/api/about-us/${communityName}/settings`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(dataToSave)
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          showAlert(`Settings ${status === 'published' ? 'published' : 'saved as draft'} successfully!`, 'success');
        } else {
          showAlert(result.message || 'Error saving settings', 'error');
        }
      } else {
        showAlert('Error saving settings', 'error');
      }
    } catch (error) {
      console.error('Error saving data:', error);
      showAlert('Error saving settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleVideoUpload = async () => {
    try {
      if (!newVideo.file || !newVideo.title) {
        showAlert('Please provide video file and title', 'error');
        return;
      }

      // TODO: Implement actual video upload
      console.log('Uploading video:', newVideo);
      
      const newVideoData = {
        id: videos.length + 1,
        title: newVideo.title,
        description: newVideo.description,
        videoUrl: URL.createObjectURL(newVideo.file),
        duration: 0, // Will be calculated
        status: 'active'
      };

      setVideos(prev => [...prev, newVideoData]);
      setNewVideo({ title: '', description: '', file: null });
      setVideoUploadOpen(false);
      showAlert('Video uploaded successfully!', 'success');
    } catch (error) {
      console.error('Error uploading video:', error);
      showAlert('Error uploading video', 'error');
    }
  };

  const handleDeleteVideo = (videoId) => {
    setVideos(prev => prev.filter(video => video.id !== videoId));
    showAlert('Video deleted successfully!', 'success');
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: 'success' }), 3000);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <FocusedSidebar />
      <Box sx={{ flexGrow: 1, marginLeft: getMainContentMargin() }}>
        <FocusedTopBar />
        
        <Container maxWidth="lg" sx={{ py: 3 }}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
            About Us Management
          </Typography>

          {alert.show && (
            <Alert severity={alert.type} sx={{ mb: 3 }} onClose={() => setAlert({ show: false, message: '', type: 'success' })}>
              {alert.message}
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* Basic Info Tab */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Basic Information
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Community Name"
                        value={formData.communityName}
                        onChange={(e) => handleInputChange('communityName', e.target.value)}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Community Brand Name"
                        value={formData.communityBrandName}
                        onChange={(e) => handleInputChange('communityBrandName', e.target.value)}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Community Description"
                        value={formData.communityDescription}
                        onChange={(e) => handleInputChange('communityDescription', e.target.value)}
                        multiline
                        rows={4}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Community Logo URL"
                        value={formData.communityLogoUrl}
                        onChange={(e) => handleInputChange('communityLogoUrl', e.target.value)}
                        margin="normal"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Header Settings */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Header Settings
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Login Button Text"
                        value={formData.loginButtonText}
                        onChange={(e) => handleInputChange('loginButtonText', e.target.value)}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Login Button URL"
                        value={formData.loginButtonUrl}
                        onChange={(e) => handleInputChange('loginButtonUrl', e.target.value)}
                        margin="normal"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Video Management */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                      Video Management
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => setVideoUploadOpen(true)}
                    >
                      Upload Video
                    </Button>
                  </Box>

                  {/* Video Library */}
                  <Paper sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                      Video Library
                    </Typography>
                    <List>
                      {videos.map((video) => (
                        <ListItem key={video.id}>
                          <PlayIcon sx={{ mr: 2, color: 'primary.main' }} />
                          <ListItemText
                            primary={video.title}
                            secondary={`${video.description} • ${Math.floor(video.duration / 60)}:${(video.duration % 60).toString().padStart(2, '0')}`}
                          />
                          <ListItemSecondaryAction>
                            <IconButton
                              edge="end"
                              onClick={() => handleInputChange('mainVideoId', video.id)}
                              color={formData.mainVideoId === video.id ? 'primary' : 'default'}
                            >
                              <Chip
                                label={formData.mainVideoId === video.id ? 'Main Video' : 'Set as Main'}
                                color={formData.mainVideoId === video.id ? 'primary' : 'default'}
                                size="small"
                              />
                            </IconButton>
                            <IconButton
                              edge="end"
                              onClick={() => handleDeleteVideo(video.id)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  </Paper>

                  {/* Video Player Settings */}
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Main Video Title Override"
                        value={formData.mainVideoTitle}
                        onChange={(e) => handleInputChange('mainVideoTitle', e.target.value)}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth margin="normal">
                        <InputLabel>Speed Indicator</InputLabel>
                        <Select
                          value={formData.speedIndicator}
                          onChange={(e) => handleInputChange('speedIndicator', e.target.value)}
                        >
                          <MenuItem value="1.0×">1.0×</MenuItem>
                          <MenuItem value="1.2×">1.2×</MenuItem>
                          <MenuItem value="1.5×">1.5×</MenuItem>
                          <MenuItem value="2.0×">2.0×</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="ESC Button Text"
                        value={formData.escButtonText}
                        onChange={(e) => handleInputChange('escButtonText', e.target.value)}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Additional Control Text"
                        value={formData.additionalControlText}
                        onChange={(e) => handleInputChange('additionalControlText', e.target.value)}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Original Duration"
                        value={formData.originalDuration}
                        onChange={(e) => handleInputChange('originalDuration', e.target.value)}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Current Duration"
                        value={formData.currentDuration}
                        onChange={(e) => handleInputChange('currentDuration', e.target.value)}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={formData.autoplay}
                              onChange={(e) => handleInputChange('autoplay', e.target.checked)}
                            />
                          }
                          label="Autoplay"
                        />
                        <FormControlLabel
                          control={
                            <Switch
                              checked={formData.muteDefault}
                              onChange={(e) => handleInputChange('muteDefault', e.target.checked)}
                            />
                          }
                          label="Mute by Default"
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Action Buttons */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button
                      variant="outlined"
                      startIcon={<PreviewIcon />}
                      onClick={() => setPreviewOpen(true)}
                    >
                      Preview
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<SaveIcon />}
                      onClick={() => handleSave('draft')}
                      disabled={saving}
                    >
                      {saving ? <CircularProgress size={20} /> : 'Save as Draft'}
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={() => handleSave('published')}
                      disabled={saving}
                    >
                      {saving ? <CircularProgress size={20} /> : 'Publish Changes'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Video Upload Dialog */}
      <Dialog open={videoUploadOpen} onClose={() => setVideoUploadOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload New Video</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Video Title"
            value={newVideo.title}
            onChange={(e) => setNewVideo(prev => ({ ...prev, title: e.target.value }))}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Video Description"
            value={newVideo.description}
            onChange={(e) => setNewVideo(prev => ({ ...prev, description: e.target.value }))}
            multiline
            rows={3}
            margin="normal"
          />
          <Box sx={{ mt: 2 }}>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setNewVideo(prev => ({ ...prev, file: e.target.files[0] }))}
              style={{ display: 'none' }}
              id="video-upload"
            />
            <label htmlFor="video-upload">
              <Button variant="outlined" component="span" startIcon={<UploadIcon />}>
                Choose Video File
              </Button>
            </label>
            {newVideo.file && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Selected: {newVideo.file.name}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVideoUploadOpen(false)}>Cancel</Button>
          <Button onClick={handleVideoUpload} variant="contained">Upload</Button>
        </DialogActions>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Preview About Us Page</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Preview functionality will be implemented to show how the page will look with current settings.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AboutUsAdmin;
