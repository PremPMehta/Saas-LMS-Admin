const Plan = require('../models/Plan.model');
const User = require('../models/User.model');

// Create a new plan
const createPlan = async (req, res) => {
  try {
    const {
      name,
      price,
      period,
      features,
      limits,
      maxAcademies,
      maxStudentsPerAcademy,
      maxEducatorsPerAcademy,
      status,
      popular
    } = req.body;

    // Check if plan name already exists
    const existingPlan = await Plan.findOne({ name: name.trim() });
    if (existingPlan) {
      return res.status(400).json({
        success: false,
        message: 'Plan name already exists. Please choose a different name.'
      });
    }

    // Create new plan
    const plan = new Plan({
      name: name.trim(),
      price,
      period,
      features: features.filter(feature => feature.trim() !== ''),
      limits: limits.trim(),
      maxAcademies: parseInt(maxAcademies),
      maxStudentsPerAcademy: parseInt(maxStudentsPerAcademy),
      maxEducatorsPerAcademy: parseInt(maxEducatorsPerAcademy),
      status,
      popular: popular || false,
      createdBy: req.user.id, // From auth middleware
    });

    await plan.save();

    res.status(201).json({
      success: true,
      message: 'Plan created successfully',
      data: plan
    });

  } catch (error) {
    console.error('Error creating plan:', error);
    
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
      message: 'Error creating plan',
      error: error.message
    });
  }
};

// Get all plans with pagination and search
const getPlans = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = '' } = req.query;
    
    const skip = (page - 1) * limit;
    
    // Build search query
    let searchQuery = {};
    if (search) {
      searchQuery = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { price: { $regex: search, $options: 'i' } },
          { period: { $regex: search, $options: 'i' } },
          { status: { $regex: search, $options: 'i' } }
        ]
      };
    }

    if (status) {
      searchQuery.status = status;
    }

    // Get plans with pagination
    const plans = await Plan.find(searchQuery)
      .populate('createdBy', 'email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Plan.countDocuments(searchQuery);

    res.status(200).json({
      success: true,
      data: plans,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching plans',
      error: error.message
    });
  }
};

// Get single plan by ID
const getPlanById = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id)
      .populate('createdBy', 'email');

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found'
      });
    }

    res.status(200).json({
      success: true,
      data: plan
    });

  } catch (error) {
    console.error('Error fetching plan:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching plan',
      error: error.message
    });
  }
};

// Update plan
const updatePlan = async (req, res) => {
  try {
    const {
      name,
      price,
      period,
      features,
      limits,
      maxAcademies,
      maxStudentsPerAcademy,
      maxEducatorsPerAcademy,
      status,
      popular
    } = req.body;

    // Check if plan exists
    const existingPlan = await Plan.findById(req.params.id);
    if (!existingPlan) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found'
      });
    }

    // Check if name is being changed and if it already exists
    if (name && name.trim() !== existingPlan.name) {
      const nameExists = await Plan.findOne({ 
        name: name.trim(),
        _id: { $ne: req.params.id }
      });
      if (nameExists) {
        return res.status(400).json({
          success: false,
          message: 'Plan name already exists. Please choose a different name.'
        });
      }
    }

    // Update plan
    const updatedPlan = await Plan.findByIdAndUpdate(
      req.params.id,
      {
        name: name ? name.trim() : existingPlan.name,
        price: price || existingPlan.price,
        period: period || existingPlan.period,
        features: features ? features.filter(feature => feature.trim() !== '') : existingPlan.features,
        limits: limits ? limits.trim() : existingPlan.limits,
        maxAcademies: maxAcademies ? parseInt(maxAcademies) : existingPlan.maxAcademies,
        maxStudentsPerAcademy: maxStudentsPerAcademy ? parseInt(maxStudentsPerAcademy) : existingPlan.maxStudentsPerAcademy,
        maxEducatorsPerAcademy: maxEducatorsPerAcademy ? parseInt(maxEducatorsPerAcademy) : existingPlan.maxEducatorsPerAcademy,
        status: status || existingPlan.status,
        popular: popular !== undefined ? popular : existingPlan.popular,
      },
      { new: true, runValidators: true }
    ).populate('createdBy', 'email');

    res.status(200).json({
      success: true,
      message: 'Plan updated successfully',
      data: updatedPlan
    });

  } catch (error) {
    console.error('Error updating plan:', error);
    
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
      message: 'Error updating plan',
      error: error.message
    });
  }
};

// Delete plan
const deletePlan = async (req, res) => {
  try {
    const plan = await Plan.findByIdAndDelete(req.params.id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Plan deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting plan:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting plan',
      error: error.message
    });
  }
};

// Get plan statistics for KPI cards
const getPlanStats = async (req, res) => {
  try {
    const totalPlans = await Plan.countDocuments();
    const activePlans = await Plan.countDocuments({ status: 'Active' });
    const inactivePlans = await Plan.countDocuments({ status: 'Inactive' });
    const onholdPlans = await Plan.countDocuments({ status: 'Onhold' });

    res.status(200).json({
      success: true,
      data: {
        totalPlans,
        activePlans,
        inactivePlans,
        onholdPlans
      }
    });

  } catch (error) {
    console.error('Error fetching plan stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching plan statistics',
      error: error.message
    });
  }
};

module.exports = {
  createPlan,
  getPlans,
  getPlanById,
  updatePlan,
  deletePlan,
  getPlanStats
}; 