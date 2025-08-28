const express = require('express');
const router = express.Router();
const communityAuthController = require('../controllers/communityAuth.controller');
const auth = require('../middleware/auth');

// Public routes (no authentication required)
router.post('/login', communityAuthController.communityLogin);
router.post('/forgot-password', communityAuthController.forgotPassword);
router.post('/reset-password', communityAuthController.resetPassword);

// Protected routes (authentication required)
router.get('/profile', auth.protect, communityAuthController.getCommunityProfile);
router.put('/profile', auth.protect, communityAuthController.updateCommunityProfile);
router.post('/change-password', auth.protect, communityAuthController.changePassword);

module.exports = router;
