const express = require('express');
const router = express.Router();
const { loginUser, getCurrentUser, logoutUser, changeFirstPassword } = require('../controllers/auth.controller');
const { 
  studentSignup, 
  studentLogin, 
  communitySignup, 
  communityLogin, 
  getCurrentUser: getClientCurrentUser 
} = require('../controllers/clientAuth.controller');
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

// Client Authentication Routes
// @route   POST /api/auth/student-signup
// @desc    Student signup
// @access  Public
router.post('/student-signup', studentSignup);

// @route   POST /api/auth/student-login
// @desc    Student login
// @access  Public
router.post('/student-login', studentLogin);

// @route   POST /api/auth/community-signup
// @desc    Community signup
// @access  Public
router.post('/community-signup', communitySignup);

// @route   POST /api/auth/community-login
// @desc    Community login
// @access  Public
router.post('/community-login', communityLogin);

// @route   GET /api/auth/client-me
// @desc    Get current client user (student or community)
// @access  Private
router.get('/client-me', protect, getClientCurrentUser);

module.exports = router; 