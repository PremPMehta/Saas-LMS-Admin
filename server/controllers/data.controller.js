const Industry = require('../models/Industry.model');
const TargetAudience = require('../models/TargetAudience.model');

// @desc    Get all active industries
// @route   GET /api/data/industries
// @access  Public
const getIndustries = async (req, res) => {
  try {
    const industries = await Industry.find({ isActive: true })
      .sort({ sortOrder: 1, name: 1 })
      .select('name description icon color');

    res.status(200).json({
      success: true,
      data: industries
    });

  } catch (error) {
    console.error('Get industries error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

// @desc    Get all active target audiences
// @route   GET /api/data/target-audiences
// @access  Public
const getTargetAudiences = async (req, res) => {
  try {
    const targetAudiences = await TargetAudience.find({ isActive: true })
      .sort({ sortOrder: 1, name: 1 })
      .select('name description category icon color');

    res.status(200).json({
      success: true,
      data: targetAudiences
    });

  } catch (error) {
    console.error('Get target audiences error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

// @desc    Get target audiences by category
// @route   GET /api/data/target-audiences/:category
// @access  Public
const getTargetAudiencesByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const targetAudiences = await TargetAudience.find({ 
      isActive: true,
      category: category 
    })
      .sort({ sortOrder: 1, name: 1 })
      .select('name description category icon color');

    res.status(200).json({
      success: true,
      data: targetAudiences
    });

  } catch (error) {
    console.error('Get target audiences by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

// @desc    Get all form data (industries and target audiences)
// @route   GET /api/data/form-data
// @access  Public
const getFormData = async (req, res) => {
  try {
    const [industries, targetAudiences] = await Promise.all([
      Industry.find({ isActive: true }).sort({ sortOrder: 1, name: 1 }).select('name description icon color'),
      TargetAudience.find({ isActive: true }).sort({ sortOrder: 1, name: 1 }).select('name description category icon color')
    ]);

    res.status(200).json({
      success: true,
      data: {
        industries,
        targetAudiences
      }
    });

  } catch (error) {
    console.error('Get form data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

module.exports = {
  getIndustries,
  getTargetAudiences,
  getTargetAudiencesByCategory,
  getFormData
};
