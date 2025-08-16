const express = require('express');
const router = express.Router();
const { loginUser, getCurrentUser, logoutUser, changeFirstPassword } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', loginUser);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, getCurrentUser);

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', protect, logoutUser);

// @route   POST /api/auth/change-first-password
// @desc    Change password for first-time login
// @access  Private
router.post('/change-first-password', protect, changeFirstPassword);

module.exports = router; 