const db = require('../config/db');

// Get About Us settings for a community
const getAboutUsSettings = async (req, res) => {
  try {
    const { communityName } = req.params;
    
    const [settings] = await db.execute(
      'SELECT * FROM community_about_settings WHERE community_id = ?',
      [communityName]
    );
    
    if (settings.length === 0) {
      // Create default settings if none exist
      await db.execute(
        `INSERT INTO community_about_settings 
         (community_id, community_name, community_brand_name, community_description, page_status)
         VALUES (?, ?, ?, ?, 'draft')`,
        [communityName, communityName, communityName, `Welcome to ${communityName} community`]
      );
      
      const [newSettings] = await db.execute(
        'SELECT * FROM community_about_settings WHERE community_id = ?',
        [communityName]
      );
      
      return res.json({
        success: true,
        data: newSettings[0]
      });
    }
    
    res.json({
      success: true,
      data: settings[0]
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

// Update About Us settings
const updateAboutUsSettings = async (req, res) => {
  try {
    const { communityName } = req.params;
    const settingsData = req.body;
    
    // Check if settings exist
    const [existing] = await db.execute(
      'SELECT id FROM community_about_settings WHERE community_id = ?',
      [communityName]
    );
    
    if (existing.length === 0) {
      // Create new settings
      const fields = Object.keys(settingsData);
      const values = Object.values(settingsData);
      const placeholders = fields.map(() => '?').join(', ');
      
      await db.execute(
        `INSERT INTO community_about_settings (community_id, ${fields.join(', ')}) 
         VALUES (?, ${placeholders})`,
        [communityName, ...values]
      );
    } else {
      // Update existing settings
      const fields = Object.keys(settingsData);
      const setClause = fields.map(field => `${field} = ?`).join(', ');
      const values = Object.values(settingsData);
      
      await db.execute(
        `UPDATE community_about_settings SET ${setClause} WHERE community_id = ?`,
        [...values, communityName]
      );
    }
    
    res.json({
      success: true,
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
    
    const [videos] = await db.execute(
      'SELECT * FROM community_videos WHERE community_id = ? ORDER BY upload_date DESC',
      [communityName]
    );
    
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

// Upload a new video
const uploadVideo = async (req, res) => {
  try {
    const { communityName } = req.params;
    const { title, description, videoUrl, thumbnailUrl, duration, fileSize } = req.body;
    
    const [result] = await db.execute(
      `INSERT INTO community_videos 
       (community_id, title, description, video_url, thumbnail_url, duration, file_size, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'active')`,
      [communityName, title, description, videoUrl, thumbnailUrl, duration || 0, fileSize || 0]
    );
    
    res.json({
      success: true,
      message: 'Video uploaded successfully',
      data: { id: result.insertId }
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

// Update video
const updateVideo = async (req, res) => {
  try {
    const { communityName, videoId } = req.params;
    const { title, description, status } = req.body;
    
    await db.execute(
      'UPDATE community_videos SET title = ?, description = ?, status = ? WHERE id = ? AND community_id = ?',
      [title, description, status, videoId, communityName]
    );
    
    res.json({
      success: true,
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

// Delete video
const deleteVideo = async (req, res) => {
  try {
    const { communityName, videoId } = req.params;
    
    await db.execute(
      'DELETE FROM community_videos WHERE id = ? AND community_id = ?',
      [videoId, communityName]
    );
    
    // Also remove from thumbnails if it was being used
    await db.execute(
      'UPDATE community_video_thumbnails SET video_id = NULL WHERE video_id = ? AND community_id = ?',
      [videoId, communityName]
    );
    
    res.json({
      success: true,
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

// Get thumbnails configuration
const getThumbnails = async (req, res) => {
  try {
    const { communityName } = req.params;
    
    const [thumbnails] = await db.execute(
      `SELECT t.*, v.title as video_title, v.video_url, v.thumbnail_url as video_thumbnail_url
       FROM community_video_thumbnails t
       LEFT JOIN community_videos v ON t.video_id = v.id
       WHERE t.community_id = ?
       ORDER BY t.position`,
      [communityName]
    );
    
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

// Update thumbnails configuration
const updateThumbnails = async (req, res) => {
  try {
    const { communityName } = req.params;
    const { thumbnails } = req.body;
    
    // Delete existing thumbnails for this community
    await db.execute(
      'DELETE FROM community_video_thumbnails WHERE community_id = ?',
      [communityName]
    );
    
    // Insert new thumbnails
    for (const thumbnail of thumbnails) {
      await db.execute(
        `INSERT INTO community_video_thumbnails 
         (community_id, position, video_id, custom_thumbnail_url, show_play_button, thumbnail_title)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          communityName,
          thumbnail.position,
          thumbnail.videoId || null,
          thumbnail.customThumbnailUrl || null,
          thumbnail.showPlayButton !== false,
          thumbnail.thumbnailTitle || null
        ]
      );
    }
    
    res.json({
      success: true,
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

// Get published About Us page data (for public viewing)
const getPublishedAboutUs = async (req, res) => {
  try {
    const { communityName } = req.params;
    
    // Get published settings
    const [settings] = await db.execute(
      'SELECT * FROM community_about_settings WHERE community_id = ? AND page_status = "published"',
      [communityName]
    );
    
    if (settings.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'About Us page not found or not published'
      });
    }
    
    // Get main video if specified
    let mainVideo = null;
    if (settings[0].main_video_id) {
      const [videos] = await db.execute(
        'SELECT * FROM community_videos WHERE id = ? AND status = "active"',
        [settings[0].main_video_id]
      );
      mainVideo = videos[0] || null;
    }
    
    // Get thumbnails
    const [thumbnails] = await db.execute(
      `SELECT t.*, v.title as video_title, v.video_url, v.thumbnail_url as video_thumbnail_url
       FROM community_video_thumbnails t
       LEFT JOIN community_videos v ON t.video_id = v.id AND v.status = "active"
       WHERE t.community_id = ?
       ORDER BY t.position`,
      [communityName]
    );
    
    res.json({
      success: true,
      data: {
        settings: settings[0],
        mainVideo,
        thumbnails
      }
    });
  } catch (error) {
    console.error('Error getting published About Us:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving About Us page',
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
