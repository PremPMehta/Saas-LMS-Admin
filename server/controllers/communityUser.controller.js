const jwt = require('jsonwebtoken');
const CommunityUser = require('../models/CommunityUser.model');
const Community = require('../models/Community.model');
const AccessLog = require('../models/AccessLog.model');

// Generate JWT Token
const generateToken = (id, type) => {
  return jwt.sign({ id, type }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token expires in 30 days
  });
};

// @desc    Community User Signup
// @route   POST /api/community-user/signup
// @access  Public
const communityUserSignup = async (req, res) => {
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      password, 
      confirmPassword,
      termsAccepted 
    } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    if (!termsAccepted) {
      return res.status(400).json({
        success: false,
        message: 'You must accept the terms and conditions'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check if user already exists
    const existingUser = await CommunityUser.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists. Please sign in instead.'
      });
    }

    // Get CryptoManji community ID (hardcoded for now)
    // In production, you might want to make this configurable
    const cryptoManjiCommunity = await Community.findOne({ 
      $or: [
        { name: /cryptomanji/i },
        { ownerEmail: 'admin@cryptomanji.com' }
      ]
    });
    if (!cryptoManjiCommunity) {
      return res.status(500).json({
        success: false,
        message: 'Community not found. Please contact support.'
      });
    }

    // Create new community user
    const communityUser = await CommunityUser.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      password,
      communityId: cryptoManjiCommunity._id,
      termsAccepted: true,
      termsAcceptedAt: new Date()
    });

    // Log the signup attempt
    await AccessLog.create({
      userId: communityUser._id,
      userType: 'community_user',
      action: 'signup',
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      details: {
        communityId: cryptoManjiCommunity._id,
        communityName: cryptoManjiCommunity.name
      }
    });

    res.status(201).json({
      success: true,
      message: 'Registration request sent successfully. Admin will approve your account.',
      data: {
        id: communityUser._id,
        firstName: communityUser.firstName,
        lastName: communityUser.lastName,
        email: communityUser.email,
        approvalStatus: communityUser.approvalStatus,
        communityName: cryptoManjiCommunity.name
      }
    });

  } catch (error) {
    console.error('Community User Signup Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during signup',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Community User Login
// @route   POST /api/community-user/login
// @access  Public
const communityUserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user and populate community info
    const user = await CommunityUser.findOne({ email: email.toLowerCase() })
      .populate('communityId', 'name status');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if user is locked
    if (user.isLocked()) {
      return res.status(423).json({
        success: false,
        message: 'Account is temporarily locked due to too many failed login attempts. Please try again later.'
      });
    }

    // Check if user is deactivated
    if (user.isDeactivated) {
      return res.status(403).json({
        success: false,
        message: 'Account has been deactivated. Please contact support.'
      });
    }

    // Check approval status - allow login but return status
    if (user.approvalStatus === 'pending') {
      return res.status(200).json({
        success: true,
        message: 'Login successful, but account is pending approval.',
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          approvalStatus: user.approvalStatus,
          communityName: user.communityId?.name || 'Unknown Community'
        }
      });
    }

    if (user.approvalStatus === 'rejected') {
      return res.status(200).json({
        success: true,
        message: 'Login successful, but account has been rejected.',
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          approvalStatus: user.approvalStatus,
          communityName: user.communityId?.name || 'Unknown Community'
        }
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is not active. Please contact support.'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      // Increment login attempts
      await user.incLoginAttempts();
      
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Reset login attempts on successful login
    await user.resetLoginAttempts();

    // Update last login
    user.lastLoginAt = new Date();
    user.isFirstLogin = false;
    await user.save();

    // Generate token
    const token = generateToken(user._id, 'community_user');

    // Log the login
    await AccessLog.create({
      userId: user._id,
      userType: 'community_user',
      action: 'login',
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      details: {
        communityId: user.communityId._id,
        communityName: user.communityId.name
      }
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          approvalStatus: user.approvalStatus,
          isFirstLogin: user.isFirstLogin,
          community: {
            id: user.communityId._id,
            name: user.communityId.name
          }
        }
      }
    });

  } catch (error) {
    console.error('Community User Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get User Approval Status
// @route   GET /api/community-user/status/:email
// @access  Public
const getUserApprovalStatus = async (req, res) => {
  try {
    const { email } = req.params;

    const user = await CommunityUser.findOne({ email: email.toLowerCase() })
      .populate('communityId', 'name');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        approvalStatus: user.approvalStatus,
        isActive: user.isActive,
        isDeactivated: user.isDeactivated,
        communityName: user.communityId.name,
        createdAt: user.createdAt,
        approvedAt: user.approvedAt,
        rejectionReason: user.rejectionReason
      }
    });

  } catch (error) {
    console.error('Get User Status Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get All Community Users (Admin)
// @route   GET /api/community-user/admin/users
// @access  Private (Admin)
const getAllCommunityUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const skip = (page - 1) * limit;

    // Build query
    let query = {};
    
    if (status) {
      query.approvalStatus = status;
    }
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Get users with pagination
    const users = await CommunityUser.find(query)
      .populate('communityId', 'name')
      .populate('approvedBy', 'firstName lastName')
      .populate('deactivatedBy', 'firstName lastName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await CommunityUser.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalUsers: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get All Users Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Approve User (Admin)
// @route   PUT /api/community-user/admin/approve/:userId
// @access  Private (Admin)
const approveUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const adminId = req.user?.id || '68c509d4f3adb322939400a2'; // Use test admin ID if no auth

    const user = await CommunityUser.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.approvalStatus === 'approved') {
      return res.status(400).json({
        success: false,
        message: 'User is already approved'
      });
    }

    // Approve the user
    await user.approve(adminId);

    // Log the approval
    await AccessLog.create({
      userId: user._id,
      userType: 'community_user',
      action: 'approved',
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      details: {
        approvedBy: adminId,
        communityId: user.communityId
      }
    });

    res.status(200).json({
      success: true,
      message: 'User approved successfully',
      data: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        approvalStatus: user.approvalStatus,
        approvedAt: user.approvedAt
      }
    });

  } catch (error) {
    console.error('Approve User Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Reject User (Admin)
// @route   PUT /api/community-user/admin/reject/:userId
// @access  Private (Admin)
const rejectUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { rejectionReason } = req.body;
    const adminId = req.user?.id || '68c509d4f3adb322939400a2'; // Use test admin ID if no auth

    const user = await CommunityUser.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.approvalStatus === 'rejected') {
      return res.status(400).json({
        success: false,
        message: 'User is already rejected'
      });
    }

    // Reject the user
    await user.reject(rejectionReason, adminId);

    // Log the rejection
    await AccessLog.create({
      userId: user._id,
      userType: 'community_user',
      action: 'rejected',
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      details: {
        rejectedBy: adminId,
        rejectionReason,
        communityId: user.communityId
      }
    });

    res.status(200).json({
      success: true,
      message: 'User rejected successfully',
      data: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        approvalStatus: user.approvalStatus,
        rejectionReason: user.rejectionReason
      }
    });

  } catch (error) {
    console.error('Reject User Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Deactivate User (Admin)
// @route   PUT /api/community-user/admin/deactivate/:userId
// @access  Private (Admin)
const deactivateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { deactivationReason } = req.body;
    const adminId = req.user?.id || '68c509d4f3adb322939400a2'; // Use test admin ID if no auth

    const user = await CommunityUser.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.isDeactivated) {
      return res.status(400).json({
        success: false,
        message: 'User is already deactivated'
      });
    }

    // Deactivate the user
    await user.deactivate(deactivationReason, adminId);

    // Log the deactivation
    await AccessLog.create({
      userId: user._id,
      userType: 'community_user',
      action: 'deactivated',
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      details: {
        deactivatedBy: adminId,
        deactivationReason,
        communityId: user.communityId
      }
    });

    res.status(200).json({
      success: true,
      message: 'User deactivated successfully',
      data: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isDeactivated: user.isDeactivated,
        deactivatedAt: user.deactivatedAt
      }
    });

  } catch (error) {
    console.error('Deactivate User Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Reactivate User (Admin)
// @route   PUT /api/community-user/admin/reactivate/:userId
// @access  Private (Admin)
const reactivateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const adminId = req.user?.id || '68c509d4f3adb322939400a2'; // Use test admin ID if no auth

    const user = await CommunityUser.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.isDeactivated) {
      return res.status(400).json({
        success: false,
        message: 'User is not deactivated'
      });
    }

    // Reactivate the user
    await user.reactivate();

    // Log the reactivation
    await AccessLog.create({
      userId: user._id,
      userType: 'community_user',
      action: 'reactivated',
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      details: {
        reactivatedBy: adminId,
        communityId: user.communityId
      }
    });

    res.status(200).json({
      success: true,
      message: 'User reactivated successfully',
      data: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isDeactivated: user.isDeactivated,
        isActive: user.isActive
      }
    });

  } catch (error) {
    console.error('Reactivate User Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  communityUserSignup,
  communityUserLogin,
  getUserApprovalStatus,
  getAllCommunityUsers,
  approveUser,
  rejectUser,
  deactivateUser,
  reactivateUser
};
