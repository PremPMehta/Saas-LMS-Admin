const express = require('express');
const router = express.Router();
const {
  getCommunityAdmins,
  getCommunityAdmin,
  createCommunityAdmin,
  updateCommunityAdmin,
  deleteCommunityAdmin,
  adminLogin
} = require('../controllers/communityAdmin.controller');

// Get all admins for a community
router.get('/community/:communityId', getCommunityAdmins);

// Get single admin by ID
router.get('/:id', getCommunityAdmin);

// Create new admin
router.post('/', createCommunityAdmin);

// Update admin
router.put('/:id', updateCommunityAdmin);

// Delete admin
router.delete('/:id', deleteCommunityAdmin);

// Admin login
router.post('/login', adminLogin);

module.exports = router;
