const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

const protect = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token - prioritize demo user for faster loading
      if (decoded.id === 'demo-admin-id') {
        req.user = {
          _id: 'demo-admin-id',
          id: 'demo-admin-id',
          email: 'admin@multi-admin.com',
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin',
          isActive: true
        };
      } else if (decoded.type === 'community') {
        // Handle community authentication
        try {
          const Community = require('../models/Community.model');
          const community = await Community.findById(decoded.id).select('-ownerPassword');
          if (community) {
            req.user = {
              _id: community._id,
              id: community._id,
              email: community.ownerEmail,
              name: community.ownerName,
              type: 'community',
              communityId: community._id,
              isActive: community.status === 'active' || community.status === 'pending'
            };
          } else {
            req.user = null;
          }
        } catch (dbError) {
          console.warn('Database error in community auth middleware:', dbError.message);
          req.user = null;
        }
      } else {
        // Try database for regular users
        try {
          req.user = await User.findById(decoded.id).select('-password');
        } catch (dbError) {
          console.warn('Database error in auth middleware:', dbError.message);
          req.user = null;
        }
      }

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      // Check if user is active
      if (!req.user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Account is deactivated'
        });
      }

      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token'
    });
  }
};

module.exports = {
  protect
}; 