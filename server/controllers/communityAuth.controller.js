const Community = require('../models/Community.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Community login
exports.communityLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find community by owner email
    const community = await Community.findOne({ 
      ownerEmail: email.toLowerCase(),
      status: { $in: ['active', 'pending'] } // Allow login for active and pending communities
    });

    if (!community) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if password matches
    const isPasswordValid = await bcrypt.compare(password, community.ownerPassword);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: community._id,
        email: community.ownerEmail,
        type: 'community',
        communityId: community._id
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      community: {
        id: community._id,
        name: community.name,
        ownerName: community.ownerName,
        ownerEmail: community.ownerEmail,
        status: community.status,
        isVerified: community.isVerified,
        logo: community.logo,
        banner: community.banner
      }
    });

  } catch (error) {
    console.error('Community login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};

// Get community profile (protected route)
exports.getCommunityProfile = async (req, res) => {
  try {
    const communityId = req.user.communityId;

    const community = await Community.findById(communityId)
      .select('-ownerPassword'); // Don't send password

    if (!community) {
      return res.status(404).json({
        success: false,
        message: 'Community not found'
      });
    }

    res.status(200).json({
      success: true,
      community
    });

  } catch (error) {
    console.error('Get community profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get community profile',
      error: error.message
    });
  }
};

// Update community profile
exports.updateCommunityProfile = async (req, res) => {
  try {
    const communityId = req.user.communityId;
    const updateData = req.body;

    // Don't allow updating sensitive fields
    delete updateData.ownerEmail;
    delete updateData.ownerPassword;
    delete updateData.status;
    delete updateData.isVerified;

    const community = await Community.findByIdAndUpdate(
      communityId,
      updateData,
      { new: true, runValidators: true }
    ).select('-ownerPassword');

    if (!community) {
      return res.status(404).json({
        success: false,
        message: 'Community not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Community profile updated successfully',
      community
    });

  } catch (error) {
    console.error('Update community profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update community profile',
      error: error.message
    });
  }
};

// Change community password
exports.changePassword = async (req, res) => {
  try {
    const communityId = req.user.communityId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({
        success: false,
        message: 'Community not found'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, community.ownerPassword);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    community.ownerPassword = hashedNewPassword;
    await community.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password',
      error: error.message
    });
  }
};

// Forgot password (send reset email)
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const community = await Community.findOne({ ownerEmail: email.toLowerCase() });
    if (!community) {
      return res.status(404).json({
        success: false,
        message: 'No community found with this email'
      });
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { id: community._id, type: 'password_reset' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // In a real application, you would send an email here
    // For now, we'll just return the token (in production, send via email)
    res.status(200).json({
      success: true,
      message: 'Password reset instructions sent to your email',
      resetToken // Remove this in production
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process password reset',
      error: error.message
    });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Reset token and new password are required'
      });
    }

    // Verify reset token
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    if (decoded.type !== 'password_reset') {
      return res.status(401).json({
        success: false,
        message: 'Invalid reset token'
      });
    }

    const community = await Community.findById(decoded.id);
    if (!community) {
      return res.status(404).json({
        success: false,
        message: 'Community not found'
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    community.ownerPassword = hashedPassword;
    await community.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset password',
      error: error.message
    });
  }
};
