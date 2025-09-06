const express = require('express');
const router = express.Router();
const { 
  getIndustries, 
  getTargetAudiences, 
  getTargetAudiencesByCategory, 
  getFormData 
} = require('../controllers/data.controller');

// @route   GET /api/data/industries
// @desc    Get all active industries
// @access  Public
router.get('/industries', getIndustries);

// @route   GET /api/data/target-audiences
// @desc    Get all active target audiences
// @access  Public
router.get('/target-audiences', getTargetAudiences);

// @route   GET /api/data/target-audiences/:category
// @desc    Get target audiences by category
// @access  Public
router.get('/target-audiences/:category', getTargetAudiencesByCategory);

// @route   GET /api/data/form-data
// @desc    Get all form data (industries and target audiences)
// @access  Public
router.get('/form-data', getFormData);

module.exports = router;
