const Academy = require('../models/Academy.model');
const User = require('../models/User.model');

// Create a new academy
const createAcademy = async (req, res) => {
  try {
    const {
      name,
      address,
      contactName,
      contactNumber,
      countryCode,
      subdomain,
      logo,
      subscriptionPlan
    } = req.body;

    // Check if subdomain already exists
    const existingAcademy = await Academy.findOne({ subdomain: subdomain.toLowerCase() });
    if (existingAcademy) {
      return res.status(400).json({
        success: false,
        message: 'Subdomain already exists. Please choose a different one.'
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
      createdBy: req.user.id, // From auth middleware
      status: 'Active',
      students: 0,
      courses: 0
    });

    await academy.save();

    res.status(201).json({
      success: true,
      message: 'Academy created successfully',
      data: academy
    });

  } catch (error) {
    console.error('Error creating academy:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating academy',
      error: error.message
    });
  }
};

// Get all academies with pagination and search
const getAcademies = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = '' } = req.query;
    
    const skip = (page - 1) * limit;
    
    // Build search query
    let searchQuery = {};
    if (search) {
      searchQuery = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { subdomain: { $regex: search, $options: 'i' } },
          { subscriptionPlan: { $regex: search, $options: 'i' } },
          { status: { $regex: search, $options: 'i' } }
        ]
      };
    }

    if (status) {
      searchQuery.status = status;
    }

    // Get academies with pagination
    const academies = await Academy.find(searchQuery)
      .populate('createdBy', 'email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Academy.countDocuments(searchQuery);

    res.status(200).json({
      success: true,
      data: academies,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error fetching academies:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching academies',
      error: error.message
    });
  }
};

// Get academy by ID
const getAcademyById = async (req, res) => {
  try {
    const academy = await Academy.findById(req.params.id)
      .populate('createdBy', 'email');

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
      message: 'Error fetching academy',
      error: error.message
    });
  }
};

// Update academy
const updateAcademy = async (req, res) => {
  try {
    const academyId = req.params.id;
    const updateData = req.body;

    // Check if subdomain is being updated and if it's unique
    if (updateData.subdomain) {
      const existingAcademy = await Academy.findOne({ 
        subdomain: updateData.subdomain.toLowerCase(),
        _id: { $ne: academyId }
      });
      
      if (existingAcademy) {
        return res.status(400).json({
          success: false,
          message: 'Subdomain already exists. Please choose a different one.'
        });
      }

      // Update fullDomain if subdomain changes
      updateData.fullDomain = `${updateData.subdomain.toLowerCase()}.bbrtek-lms.com`;
    }

    const academy = await Academy.findByIdAndUpdate(
      academyId,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'email');

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
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating academy',
      error: error.message
    });
  }
};

// Delete academy
const deleteAcademy = async (req, res) => {
  try {
    const academy = await Academy.findByIdAndDelete(req.params.id);

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
      message: 'Error deleting academy',
      error: error.message
    });
  }
};

// Get academy statistics for KPI cards
const getAcademyStats = async (req, res) => {
  try {
    const totalAcademies = await Academy.countDocuments();
    const activeAcademies = await Academy.countDocuments({ status: 'Active' });
    const inactiveAcademies = await Academy.countDocuments({ status: 'Inactive' });
    const onholdAcademies = await Academy.countDocuments({ status: 'Onhold' });

    res.status(200).json({
      success: true,
      data: {
        totalAcademies,
        activeAcademies,
        inactiveAcademies,
        onholdAcademies
      }
    });

  } catch (error) {
    console.error('Error fetching academy stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching academy statistics',
      error: error.message
    });
  }
};

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const totalAcademies = await Academy.countDocuments({ status: 'Active' });
    const academiesByPlan = await Academy.aggregate([
      { $group: { _id: '$subscriptionPlan', count: { $sum: 1 } } }
    ]);

    const recentAcademies = await Academy.find({ status: 'Active' })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('createdBy', 'email');

    res.status(200).json({
      success: true,
      data: {
        totalAcademies,
        academiesByPlan,
        recentAcademies
      }
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message
    });
  }
};

// Check subdomain availability
const checkSubdomainAvailability = async (req, res) => {
  try {
    const { subdomain } = req.params;
    
    const existingAcademy = await Academy.findOne({ 
      subdomain: subdomain.toLowerCase() 
    });

    res.status(200).json({
      success: true,
      available: !existingAcademy,
      message: existingAcademy ? 'Subdomain already taken' : 'Subdomain available'
    });

  } catch (error) {
    console.error('Error checking subdomain:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking subdomain availability',
      error: error.message
    });
  }
};

module.exports = {
  createAcademy,
  getAcademies,
  getAcademyById,
  updateAcademy,
  deleteAcademy,
  getDashboardStats,
  checkSubdomainAvailability,
  getAcademyStats
}; 