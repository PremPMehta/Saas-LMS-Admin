const express = require('express');
const router = express.Router();
const aboutUsController = require('../controllers/aboutUs.controller');
const { protect } = require('../middleware/auth');

// Admin routes (protected)
router.get('/:communityName/settings', protect, aboutUsController.getAboutUsSettings);
router.post('/:communityName/settings', protect, aboutUsController.updateAboutUsSettings);

// Video management routes (protected)
router.get('/:communityName/videos', protect, aboutUsController.getVideos);
router.post('/:communityName/videos', protect, aboutUsController.uploadVideo);
router.put('/:communityName/videos/:videoId', protect, aboutUsController.updateVideo);
router.delete('/:communityName/videos/:videoId', protect, aboutUsController.deleteVideo);

// Thumbnails management routes (protected)
router.get('/:communityName/thumbnails', protect, aboutUsController.getThumbnails);
router.post('/:communityName/thumbnails', protect, aboutUsController.updateThumbnails);

// Public route for viewing published About Us page
router.get('/:communityName/published', aboutUsController.getPublishedAboutUs);

module.exports = router;
