const express = require('express');
const router = express.Router();
const Community = require('../models/Community.model');
const CommunityUser = require('../models/CommunityUser.model');

// Check if a community exists by name (for security validation)
router.get('/check/:communityName', async (req, res) => {
  try {
    const { communityName } = req.params;
    
    console.log('🔍 Checking if community exists:', communityName);
    
    // Convert URL format to database format
    // e.g., "crypto-manji-academy" -> "Crypto Manji Academy"
    const communityDisplayName = communityName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    console.log('🔍 Looking for community with name:', communityDisplayName);
    
    // Search for community by name (case insensitive)
    const community = await Community.findOne({
      name: { $regex: new RegExp(`^${communityDisplayName}$`, 'i') }
    });
    
    if (!community) {
      console.log('🚫 Community not found:', communityDisplayName);
      return res.status(404).json({
        success: false,
        message: 'Community not found'
      });
    }
    
    console.log('✅ Community found:', community.name);
    
    res.json({
      success: true,
      community: {
        _id: community._id,
        name: community.name,
        id: community._id
      }
    });
    
  } catch (error) {
    console.error('❌ Error checking community:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking community',
      error: error.message
    });
  }
});

// Check which community an email belongs to
router.post('/check-email', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }
    
    console.log('🔍 Checking which community email belongs to:', email);
    
    // First check if email is a community admin (owner)
    const communityAdmin = await Community.findOne({
      ownerEmail: { $regex: new RegExp(`^${email}$`, 'i') }
    });
    
    if (communityAdmin) {
      console.log('✅ Email found as community admin for:', communityAdmin.name);
      return res.json({
        success: true,
        userType: 'admin',
        community: {
          _id: communityAdmin._id,
          name: communityAdmin.name,
          id: communityAdmin._id
        }
      });
    }
    
    // If not admin, check if email is a community user
    const communityUser = await CommunityUser.findOne({
      email: { $regex: new RegExp(`^${email}$`, 'i') }
    }).populate('communityId');
    
    if (communityUser && communityUser.communityId) {
      console.log('✅ Email found as community user for:', communityUser.communityId.name);
      return res.json({
        success: true,
        userType: 'user',
        community: {
          _id: communityUser.communityId._id,
          name: communityUser.communityId.name,
          id: communityUser.communityId._id
        }
      });
    }
    
    // Email not found in any community
    console.log('🚫 Email not found in any community:', email);
    return res.status(404).json({
      success: false,
      message: 'Email not found in any community'
    });
    
  } catch (error) {
    console.error('❌ Error checking email:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking email',
      error: error.message
    });
  }
});

module.exports = router;