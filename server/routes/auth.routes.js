const express = require('express');
const router = express.Router();
const { loginUser, getCurrentUser, logoutUser } = require('../controllers/auth.controller');

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', loginUser);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', getCurrentUser);

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', logoutUser);

module.exports = router; 