const express = require('express');
const router = express.Router();
const aboutUsController = require('../controllers/aboutUs.controller');
const auth = require('../middleware/auth');

// Admin routes (protected)
router.get('/:communityName/settings', auth, aboutUsController.getAboutUsSettings);
router.post('/:communityName/settings', auth, aboutUsController.updateAboutUsSettings);

// Video management routes (protected)
router.get('/:communityName/videos', auth, aboutUsController.getVideos);
router.post('/:communityName/videos', auth, aboutUsController.uploadVideo);
router.put('/:communityName/videos/:videoId', auth, aboutUsController.updateVideo);
router.delete('/:communityName/videos/:videoId', auth, aboutUsController.deleteVideo);

// Thumbnails management routes (protected)
router.get('/:communityName/thumbnails', auth, aboutUsController.getThumbnails);
router.post('/:communityName/thumbnails', auth, aboutUsController.updateThumbnails);

// Public route for viewing published About Us page
router.get('/:communityName/published', aboutUsController.getPublishedAboutUs);

module.exports = router;
