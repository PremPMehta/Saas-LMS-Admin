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
        message: 'Plan name already exists'
      });
    }

    // Create new plan
    const plan = new Plan({
      name: name.trim(),
      price: price || '$0',
      period: period || 'month',
      features: features || [],
      limits: limits || `${maxAcademies || 1} academy, ${maxStudentsPerAcademy || 100} students`,
      maxAcademies: maxAcademies || 1,
      maxStudentsPerAcademy: maxStudentsPerAcademy || 100,
      maxEducatorsPerAcademy: maxEducatorsPerAcademy || 10,
      status: status || 'Active',
      popular: popular || false,
      createdBy: req.user.id
    });

    const savedPlan = await plan.save();

    res.status(201).json({
      success: true,
      message: 'Plan created successfully',
      data: savedPlan
    });

  } catch (error) {
    console.error('Error creating plan:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get all plans
const getAllPlans = async (req, res) => {
  try {
    const { limit, page, status } = req.query;
    
    let query = {};
    if (status) {
      query.status = status;
    }

    let plansQuery = Plan.find(query)
      .populate('createdBy', 'firstName lastName email')
      .sort({ popular: -1, createdAt: -1 });

    if (limit) {
      plansQuery = plansQuery.limit(parseInt(limit));
    }

    if (page && limit) {
      const skip = (parseInt(page) - 1) * parseInt(limit);
      plansQuery = plansQuery.skip(skip);
    }

    const plans = await plansQuery;
    const total = await Plan.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        plans,
        total,
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : plans.length
      },
      message: 'Plans retrieved successfully'
    });

  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get plan by ID
const getPlanById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const plan = await Plan.findById(id)
      .populate('createdBy', 'firstName lastName email');
    
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
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update plan
const updatePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove fields that shouldn't be updated directly
    delete updateData._id;
    delete updateData.createdBy;
    delete updateData.createdAt;

    const plan = await Plan.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('createdBy', 'firstName lastName email');

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Plan updated successfully',
      data: plan
    });

  } catch (error) {
    console.error('Error updating plan:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Delete plan
const deletePlan = async (req, res) => {
  try {
    const { id } = req.params;

    const plan = await Plan.findByIdAndDelete(id);

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
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get plan statistics
const getPlanStats = async (req, res) => {
  try {
    const totalPlans = await Plan.countDocuments();
    const activePlans = await Plan.countDocuments({ status: 'active' });
    const inactivePlans = await Plan.countDocuments({ status: 'inactive' });
    const popularPlans = await Plan.countDocuments({ popular: true });

    res.status(200).json({
      success: true,
      data: {
        totalPlans,
        activePlans,
        inactivePlans,
        popularPlans
      }
    });

  } catch (error) {
    console.error('Error fetching plan stats:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  createPlan,
  getAllPlans,
  getPlanById,
  updatePlan,
  deletePlan,
  getPlanStats
};