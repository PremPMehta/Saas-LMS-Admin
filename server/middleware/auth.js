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
      } else {
        // Try database for non-demo users
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