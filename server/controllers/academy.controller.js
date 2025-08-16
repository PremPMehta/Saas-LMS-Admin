const Academy = require('../models/Academy.model');
const User = require('../models/User.model');

// Create a new academy
const createAcademy = async (req, res) => {
  try {
    const {
      name,
      description,
      address,
      contactName,
      contactNumber,
      countryCode,
      subdomain,
      logo,
      subscriptionPlan,
      status,
      students,
      courses
    } = req.body;

    // Check if subdomain already exists
    const existingAcademy = await Academy.findOne({ subdomain: subdomain.toLowerCase() });
    if (existingAcademy) {
      return res.status(400).json({
        success: false,
        message: 'Subdomain already exists'
      });
    }

    // Create new academy
    const academy = new Academy({
      name,
      address,
      contactName,
      contactNumber,
      countryCode,
      subdomain: subdomain.toLowerCase(),
      fullDomain: `${subdomain.toLowerCase()}.bbrtek-lms.com`,
      logo,
      subscriptionPlan,
      status: status || 'Active',
      students: students || 0,
      courses: courses || 0,
      createdBy: req.user.id
    });

    const savedAcademy = await academy.save();

    res.status(201).json({
      success: true,
      message: 'Academy created successfully',
      data: savedAcademy
    });

  } catch (error) {
    console.error('Error creating academy:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get all academies
const getAllAcademies = async (req, res) => {
  try {
    const academies = await Academy.find()
      .populate('createdBy', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: academies,
      message: 'Academies retrieved successfully'
    });

  } catch (error) {
    console.error('Error fetching academies:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get academy by ID
const getAcademyById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const academy = await Academy.findById(id)
      .populate('createdBy', 'firstName lastName email');
    
    if (!academy) {
      return res.status(404).json({
        success: false,
        message: 'Academy not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: academy
    });

  } catch (error) {
    console.error('Error fetching academy:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update academy
const updateAcademy = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove fields that shouldn't be updated directly
    delete updateData._id;
    delete updateData.createdBy;
    delete updateData.createdAt;

    const academy = await Academy.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('createdBy', 'firstName lastName email');

    if (!academy) {
      return res.status(404).json({
        success: false,
        message: 'Academy not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Academy updated successfully',
      data: academy
    });

  } catch (error) {
    console.error('Error updating academy:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Delete academy
const deleteAcademy = async (req, res) => {
  try {
    const { id } = req.params;

    const academy = await Academy.findByIdAndDelete(id);

    if (!academy) {
      return res.status(404).json({
        success: false,
        message: 'Academy not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Academy deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting academy:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get academy statistics
const getAcademyStats = async (req, res) => {
  try {
    const totalAcademies = await Academy.countDocuments();
    const activeAcademies = await Academy.countDocuments({ status: 'active' });
    const inactiveAcademies = await Academy.countDocuments({ status: 'inactive' });

    res.status(200).json({
      success: true,
      data: {
        totalAcademies,
        activeAcademies,
        inactiveAcademies
      }
    });

  } catch (error) {
    console.error('Error fetching academy stats:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  createAcademy,
  getAllAcademies,
  getAcademyById,
  updateAcademy,
  deleteAcademy,
  getAcademyStats
};