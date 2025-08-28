const jwt = require('jsonwebtoken');
const Student = require('../models/Student.model');
const Community = require('../models/Community.model');
const AccessLog = require('../models/AccessLog.model');

// Generate JWT Token
const generateToken = (id, type) => {
  return jwt.sign({ id, type }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token expires in 30 days
  });
};

// @desc    Student signup
// @route   POST /api/auth/student-signup
// @access  Public
const studentSignup = async (req, res) => {
  try {
    const { 
      email, 
      password, 
      firstName, 
      lastName, 
      currentRole, 
      industry, 
      phoneNumber 
    } = req.body;

    // Validation
    if (!email || !password || !firstName || !lastName || !currentRole || !industry) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if student already exists
    const existingStudent = await Student.findOne({ email: email.toLowerCase() });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'Student with this email already exists'
      });
    }

    // Create new student
    const student = await Student.create({
      email: email.toLowerCase(),
      password,
      firstName,
      lastName,
      currentRole,
      industry,
      phoneNumber: phoneNumber || '',
      isProfileComplete: true
    });

    // Generate token
    const token = generateToken(student._id, 'student');

    // Log access
    try {
      await AccessLog.create({
        userId: student._id,
        action: 'student_signup',
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
        timestamp: new Date()
      });
    } catch (logError) {
      console.log('Access log error (non-critical):', logError.message);
    }

    res.status(201).json({
      success: true,
      message: 'Student account created successfully',
      data: {
        user: {
          id: student._id,
          email: student.email,
          firstName: student.firstName,
          lastName: student.lastName,
          currentRole: student.currentRole,
          industry: student.industry,
          phoneNumber: student.phoneNumber,
          isProfileComplete: student.isProfileComplete,
          status: student.status,
          isFirstLogin: student.isFirstLogin
        },
        token,
        userType: 'student'
      }
    });

  } catch (error) {
    console.error('Student signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

// @desc    Student login
// @route   POST /api/auth/student-login
// @access  Public
const studentLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password'
      });
    }

    // Find student in database
    const student = await Student.findOne({ email: email.toLowerCase() }).select('+password');
    
    if (!student) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordMatch = await student.comparePassword(password);
    
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login time
    student.lastLoginAt = new Date();
    await student.save();

    // Generate token
    const token = generateToken(student._id, 'student');
    
    // Log access
    try {
      await AccessLog.create({
        userId: student._id,
        action: 'student_login',
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
        timestamp: new Date()
      });
    } catch (logError) {
      console.log('Access log error (non-critical):', logError.message);
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: student._id,
          email: student.email,
          firstName: student.firstName,
          lastName: student.lastName,
          currentRole: student.currentRole,
          industry: student.industry,
          phoneNumber: student.phoneNumber,
          isProfileComplete: student.isProfileComplete,
          status: student.status,
          isFirstLogin: student.isFirstLogin,
          lastLoginAt: student.lastLoginAt,
          enrolledCommunities: student.enrolledCommunities.length,
          totalCoursesCompleted: student.totalCoursesCompleted,
          totalHoursLearned: student.totalHoursLearned
        },
        token,
        userType: 'student'
      }
    });

  } catch (error) {
    console.error('Student login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

// @desc    Community signup
// @route   POST /api/auth/community-signup
// @access  Public
const communitySignup = async (req, res) => {
  try {
    const { 
      email, 
      password, 
      communityName, 
      description, 
      category, 
      phoneNumber 
    } = req.body;

    // Validation
    if (!email || !password || !communityName || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if community owner already exists
    const existingCommunity = await Community.findOne({ ownerEmail: email.toLowerCase() });
    if (existingCommunity) {
      return res.status(400).json({
        success: false,
        message: 'Community owner with this email already exists'
      });
    }

    // Create new community
    const community = await Community.create({
      ownerEmail: email.toLowerCase(),
      ownerPassword: password,
      ownerName: communityName, // Using community name as owner name for now
      ownerPhoneNumber: phoneNumber || '',
      name: communityName,
      description,
      category,
      status: 'pending' // Will be reviewed by admin
    });

    // Generate token
    const token = generateToken(community._id, 'community');

    // Log access
    try {
      await AccessLog.create({
        userId: community._id,
        action: 'community_signup',
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
        timestamp: new Date()
      });
    } catch (logError) {
      console.log('Access log error (non-critical):', logError.message);
    }

    res.status(201).json({
      success: true,
      message: 'Community account created successfully',
      data: {
        user: {
          id: community._id,
          email: community.ownerEmail,
          name: community.name,
          description: community.description,
          category: community.category,
          status: community.status,
          isFirstLogin: community.ownerIsFirstLogin,
          memberCount: community.memberCount,
          courseCount: community.courseCount
        },
        token,
        userType: 'community'
      }
    });

  } catch (error) {
    console.error('Community signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

// @desc    Community login
// @route   POST /api/auth/community-login
// @access  Public
const communityLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password'
      });
    }

    // Find community in database
    const community = await Community.findOne({ ownerEmail: email.toLowerCase() }).select('+ownerPassword');
    
    if (!community) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordMatch = await community.comparePassword(password);
    
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login time
    community.ownerLastLoginAt = new Date();
    await community.save();

    // Generate token
    const token = generateToken(community._id, 'community');
    
    // Log access
    try {
      await AccessLog.create({
        userId: community._id,
        action: 'community_login',
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
        timestamp: new Date()
      });
    } catch (logError) {
      console.log('Access log error (non-critical):', logError.message);
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: community._id,
          email: community.ownerEmail,
          name: community.name,
          description: community.description,
          category: community.category,
          status: community.status,
          isFirstLogin: community.ownerIsFirstLogin,
          lastLoginAt: community.ownerLastLoginAt,
          memberCount: community.memberCount,
          courseCount: community.courseCount,
          totalRevenue: community.totalRevenue,
          features: community.features,
          pricing: community.pricing
        },
        token,
        userType: 'community'
      }
    });

  } catch (error) {
    console.error('Community login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

// @desc    Get current user (student or community)
// @route   GET /api/auth/me
// @access  Private
const getCurrentUser = async (req, res) => {
  try {
    const { id, type } = req.user;

    let user;
    if (type === 'student') {
      user = await Student.findById(id);
    } else if (type === 'community') {
      user = await Community.findById(id);
    } else {
      return res.status(401).json({
        success: false,
        message: 'Invalid user type'
      });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user,
        userType: type
      }
    });

  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

module.exports = {
  studentSignup,
  studentLogin,
  communitySignup,
  communityLogin,
  getCurrentUser
};
