const CommunityAdmin = require('../models/CommunityAdmin.model');
const Community = require('../models/Community.model');

// Get all admins for a community
const getCommunityAdmins = async (req, res) => {
  try {
    const { communityId } = req.params;
    
    if (!communityId) {
      return res.status(400).json({
        success: false,
        message: 'Community ID is required'
      });
    }

    // Verify community exists
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({
        success: false,
        message: 'Community not found'
      });
    }

    const admins = await CommunityAdmin.findByCommunity(communityId);
    
    console.log(`📊 Found ${admins.length} admins for community ${communityId}`);
    
    res.status(200).json({
      success: true,
      data: admins,
      count: admins.length
    });
  } catch (error) {
    console.error('❌ Error getting community admins:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get community admins',
      error: error.message
    });
  }
};

// Get single admin by ID
const getCommunityAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    
    const admin = await CommunityAdmin.findById(id).select('-password');
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.status(200).json({
      success: true,
      data: admin
    });
  } catch (error) {
    console.error('❌ Error getting community admin:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get community admin',
      error: error.message
    });
  }
};

// Create new admin
const createCommunityAdmin = async (req, res) => {
  try {
    const { communityId, name, email, phone, password, permissions } = req.body;
    
    // Validate required fields
    if (!communityId || !name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Community ID, name, email, and password are required'
      });
    }

    // Verify community exists
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({
        success: false,
        message: 'Community not found'
      });
    }

    // Check if admin already exists with this email
    const existingAdmin = await CommunityAdmin.findByEmailAndCommunity(email, communityId);
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin with this email already exists in this community'
      });
    }

    // Create new admin
    const adminData = {
      communityId,
      name,
      email,
      phone,
      password,
      permissions: permissions || {
        canCreateCourses: true,
        canEditCourses: true,
        canDeleteCourses: false
      }
    };

    const newAdmin = new CommunityAdmin(adminData);
    await newAdmin.save();

    console.log(`✅ Created new admin: ${name} (${email}) for community ${communityId}`);

    res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      data: newAdmin.toJSON()
    });
  } catch (error) {
    console.error('❌ Error creating community admin:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create community admin',
      error: error.message
    });
  }
};

// Update admin
const updateCommunityAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, permissions } = req.body;
    
    const admin = await CommunityAdmin.findById(id);
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    // Check if email is being changed and if it already exists
    if (email && email !== admin.email) {
      const existingAdmin = await CommunityAdmin.findByEmailAndCommunity(email, admin.communityId);
      if (existingAdmin) {
        return res.status(400).json({
          success: false,
          message: 'Admin with this email already exists in this community'
        });
      }
    }

    // Update fields
    if (name) admin.name = name;
    if (email) admin.email = email;
    if (phone !== undefined) admin.phone = phone;
    if (permissions) admin.permissions = { ...admin.permissions, ...permissions };

    await admin.save();

    console.log(`✅ Updated admin: ${admin.name} (${admin.email})`);

    res.status(200).json({
      success: true,
      message: 'Admin updated successfully',
      data: admin.toJSON()
    });
  } catch (error) {
    console.error('❌ Error updating community admin:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update community admin',
      error: error.message
    });
  }
};

// Delete admin
const deleteCommunityAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    
    const admin = await CommunityAdmin.findById(id);
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    await CommunityAdmin.findByIdAndDelete(id);

    console.log(`✅ Deleted admin: ${admin.name} (${admin.email})`);

    res.status(200).json({
      success: true,
      message: 'Admin deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting community admin:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete community admin',
      error: error.message
    });
  }
};

// Admin login
const adminLogin = async (req, res) => {
  try {
    const { email, password, communityId } = req.body;
    
    if (!email || !password || !communityId) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and community ID are required'
      });
    }

    // Find admin by email and community
    const admin = await CommunityAdmin.findByEmailAndCommunity(email, communityId);
    
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if admin is active
    if (admin.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Admin account is not active'
      });
    }

    // Verify password
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update login tracking
    admin.lastLoginAt = new Date();
    admin.loginCount += 1;
    admin.isFirstLogin = false;
    await admin.save();

    console.log(`✅ Admin login successful: ${admin.name} (${admin.email})`);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: admin.toJSON()
    });
  } catch (error) {
    console.error('❌ Error in admin login:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};

module.exports = {
  getCommunityAdmins,
  getCommunityAdmin,
  createCommunityAdmin,
  updateCommunityAdmin,
  deleteCommunityAdmin,
  adminLogin
};
