const express = require('express');
const router = express.Router();
const {
  communityUserSignup,
  communityUserLogin,
  getUserApprovalStatus,
  getAllCommunityUsers,
  approveUser,
  rejectUser,
  deactivateUser,
  reactivateUser
} = require('../controllers/communityUser.controller');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/signup', communityUserSignup);
router.post('/login', communityUserLogin);
router.get('/status/:email', getUserApprovalStatus);

// Admin routes (temporarily unprotected for testing)
router.get('/admin/users', getAllCommunityUsers);
router.put('/admin/approve/:userId', approveUser);
router.put('/admin/reject/:userId', rejectUser);
router.put('/admin/deactivate/:userId', deactivateUser);
router.put('/admin/reactivate/:userId', reactivateUser);

module.exports = router;
