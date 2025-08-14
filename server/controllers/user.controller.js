const User = require('../models/User.model');
const bcrypt = require('bcryptjs');

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    
    res.status(200).json({
      success: true,
      data: users,
      message: 'Users retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get single user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user,
      message: 'User retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Create new user
const createUser = async (req, res) => {
  try {
    const { 
      email, 
      role, 
      status, 
      password,
      firstName,
      lastName,
      phoneNumber,
      countryCode,
      address,
      profilePicture
    } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }
    
    // Create new user
    const userData = {
      email: email.toLowerCase(),
      role: role || 'admin',
      status: status || 'active',
      password: password || 'Password@123', // Default password
      isActive: status === 'active',
      // Profile fields
      firstName: firstName || '',
      lastName: lastName || '',
      phoneNumber: phoneNumber || '',
      countryCode: countryCode || '+91',
      address: address || {
        street: '',
        city: '',
        state: '',
        country: 'India',
        zipCode: ''
      },
      profilePicture: profilePicture || null,
      isProfileComplete: !!(firstName && lastName && phoneNumber && countryCode)
    };
    
    const newUser = new User(userData);
    await newUser.save();
    
    // Return user without password
    const userResponse = newUser.toJSON();
    
    res.status(201).json({
      success: true,
      data: userResponse,
      message: 'User created successfully'
    });
  } catch (error) {
    console.error('Error creating user:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validationErrors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      email, 
      role, 
      status, 
      password,
      firstName,
      lastName,
      phoneNumber,
      countryCode,
      address,
      profilePicture,
      isProfileComplete
    } = req.body;
    
    // Check if user exists
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if email is being changed and if it already exists
    if (email && email.toLowerCase() !== existingUser.email.toLowerCase()) {
      const emailExists = await User.findOne({ 
        email: email.toLowerCase(),
        _id: { $ne: id } // Exclude current user
      });
      
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists'
        });
      }
    }
    
    // Prepare update data
    const updateData = {};
    if (email) updateData.email = email.toLowerCase();
    if (role) updateData.role = role;
    if (status) {
      updateData.status = status;
      updateData.isActive = status === 'active';
    }
    if (password) updateData.password = password;
    
    // Profile fields
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
    if (countryCode !== undefined) updateData.countryCode = countryCode;
    if (address) updateData.address = address;
    if (profilePicture !== undefined) updateData.profilePicture = profilePicture;
    if (isProfileComplete !== undefined) updateData.isProfileComplete = isProfileComplete;
    
    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
    
    res.status(200).json({
      success: true,
      data: updatedUser,
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error('Error updating user:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validationErrors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update user profile (for profile page)
const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      firstName,
      lastName,
      phoneNumber,
      countryCode,
      address,
      profilePicture
    } = req.body;
    
    // Check if user exists
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Prepare update data
    const updateData = {};
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
    if (countryCode !== undefined) updateData.countryCode = countryCode;
    if (address) updateData.address = address;
    if (profilePicture !== undefined) updateData.profilePicture = profilePicture;
    
    // Check if profile is complete
    updateData.isProfileComplete = !!(firstName && lastName && phoneNumber && countryCode);
    
    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
    
    res.status(200).json({
      success: true,
      data: updatedUser,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validationErrors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user exists
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Prevent deletion of the last admin user
    if (existingUser.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete the last admin user'
        });
      }
    }
    
    // Delete user
    await User.findByIdAndDelete(id);
    
    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get user statistics
const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });
    const inactiveUsers = await User.countDocuments({ status: 'inactive' });
    const pendingUsers = await User.countDocuments({ status: 'pending' });
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const regularUsers = await User.countDocuments({ role: 'user' });
    const completeProfiles = await User.countDocuments({ isProfileComplete: true });
    const incompleteProfiles = await User.countDocuments({ isProfileComplete: false });
    
    res.status(200).json({
      success: true,
      data: {
        total: totalUsers,
        active: activeUsers,
        inactive: inactiveUsers,
        pending: pendingUsers,
        admins: adminUsers,
        users: regularUsers,
        completeProfiles,
        incompleteProfiles
      },
      message: 'User statistics retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching user statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserProfile,
  deleteUser,
  getUserStats
}; 