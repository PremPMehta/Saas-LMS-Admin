const CommunityAbout = require('../models/CommunityAbout');

// Get About Us settings for a community
const getAboutUsSettings = async (req, res) => {
  try {
    const { communityName } = req.params;
    
    let settings = await CommunityAbout.findOne({ communityName });
    
    if (!settings) {
      // Create default settings if none exist
      settings = new CommunityAbout({
        communityName,
        communityBrandName: communityName,
        communityDescription: `Welcome to ${communityName} community`,
        pageStatus: 'draft'
      });
      await settings.save();
    }
    
    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Error getting About Us settings:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving About Us settings',
      error: error.message
    });
  }
};

// Update About Us settings for a community
const updateAboutUsSettings = async (req, res) => {
  try {
    const { communityName } = req.params;
    const updateData = req.body;
    
    const settings = await CommunityAbout.findOneAndUpdate(
      { communityName },
      { ...updateData, updatedAt: new Date() },
      { new: true, upsert: true }
    );
    
    res.json({
      success: true,
      data: settings,
      message: 'About Us settings updated successfully'
    });
  } catch (error) {
    console.error('Error updating About Us settings:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating About Us settings',
      error: error.message
    });
  }
};

// Get videos for a community
const getVideos = async (req, res) => {
  try {
    const { communityName } = req.params;
    
    const settings = await CommunityAbout.findOne({ communityName });
    const videos = settings ? settings.videos || [] : [];
    
    res.json({
      success: true,
      data: videos
    });
  } catch (error) {
    console.error('Error getting videos:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving videos',
      error: error.message
    });
  }
};

// Upload/Add video for a community
const uploadVideo = async (req, res) => {
  try {
    const { communityName } = req.params;
    const videoData = req.body;
    
    const settings = await CommunityAbout.findOne({ communityName });
    if (!settings) {
      return res.status(404).json({
        success: false,
        message: 'Community not found'
      });
    }
    
    settings.videos.push(videoData);
    await settings.save();
    
    res.json({
      success: true,
      data: settings.videos,
      message: 'Video added successfully'
    });
  } catch (error) {
    console.error('Error uploading video:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading video',
      error: error.message
    });
  }
};

// Update video for a community
const updateVideo = async (req, res) => {
  try {
    const { communityName, videoId } = req.params;
    const updateData = req.body;
    
    const settings = await CommunityAbout.findOne({ communityName });
    if (!settings) {
      return res.status(404).json({
        success: false,
        message: 'Community not found'
      });
    }
    
    const videoIndex = settings.videos.findIndex(video => video._id.toString() === videoId);
    if (videoIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }
    
    settings.videos[videoIndex] = { ...settings.videos[videoIndex], ...updateData };
    await settings.save();
    
    res.json({
      success: true,
      data: settings.videos,
      message: 'Video updated successfully'
    });
  } catch (error) {
    console.error('Error updating video:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating video',
      error: error.message
    });
  }
};

// Delete video for a community
const deleteVideo = async (req, res) => {
  try {
    const { communityName, videoId } = req.params;
    
    const settings = await CommunityAbout.findOne({ communityName });
    if (!settings) {
      return res.status(404).json({
        success: false,
        message: 'Community not found'
      });
    }
    
    settings.videos = settings.videos.filter(video => video._id.toString() !== videoId);
    await settings.save();
    
    res.json({
      success: true,
      data: settings.videos,
      message: 'Video deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting video:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting video',
      error: error.message
    });
  }
};

// Get thumbnails for a community
const getThumbnails = async (req, res) => {
  try {
    const { communityName } = req.params;
    
    const settings = await CommunityAbout.findOne({ communityName });
    const thumbnails = settings ? settings.thumbnails || {} : {};
    
    res.json({
      success: true,
      data: thumbnails
    });
  } catch (error) {
    console.error('Error getting thumbnails:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving thumbnails',
      error: error.message
    });
  }
};

// Update thumbnails for a community
const updateThumbnails = async (req, res) => {
  try {
    const { communityName } = req.params;
    const thumbnailData = req.body;
    
    const settings = await CommunityAbout.findOneAndUpdate(
      { communityName },
      { thumbnails: thumbnailData, updatedAt: new Date() },
      { new: true, upsert: true }
    );
    
    res.json({
      success: true,
      data: settings.thumbnails,
      message: 'Thumbnails updated successfully'
    });
  } catch (error) {
    console.error('Error updating thumbnails:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating thumbnails',
      error: error.message
    });
  }
};

// Get published About Us page (public route)
const getPublishedAboutUs = async (req, res) => {
  try {
    const { communityName } = req.params;
    
    const settings = await CommunityAbout.findOne({ 
      communityName, 
      pageStatus: 'published' 
    });
    
    if (!settings) {
      return res.status(404).json({
        success: false,
        message: 'Published About Us page not found'
      });
    }
    
    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Error getting published About Us:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving published About Us page',
      error: error.message
    });
  }
};

module.exports = {
  getAboutUsSettings,
  updateAboutUsSettings,
  getVideos,
  uploadVideo,
  updateVideo,
  deleteVideo,
  getThumbnails,
  updateThumbnails,
  getPublishedAboutUs
};