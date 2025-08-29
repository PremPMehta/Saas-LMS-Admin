const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const communityAdminSchema = new mongoose.Schema({
  // Admin information
  name: {
    type: String,
    required: [true, 'Admin name is required'],
    trim: true,
    maxlength: [100, 'Admin name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Admin email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    trim: true,
    maxlength: [15, 'Phone number cannot exceed 15 characters']
  },
  password: {
    type: String,
    required: [true, 'Admin password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  
  // Community association
  communityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community',
    required: [true, 'Community ID is required']
  },
  
  // Role and status
  role: {
    type: String,
    enum: ['admin', 'moderator'],
    default: 'admin'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  
  // Permissions
  permissions: {
    canCreateCourses: {
      type: Boolean,
      default: true
    },
    canEditCourses: {
      type: Boolean,
      default: true
    },
    canDeleteCourses: {
      type: Boolean,
      default: false
    }
  },
  
  // Login tracking
  lastLoginAt: {
    type: Date,
    default: null
  },
  loginCount: {
    type: Number,
    default: 0
  },
  
  // Activity tracking
  isFirstLogin: {
    type: Boolean,
    default: true
  },
  lastActivityAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
communityAdminSchema.index({ communityId: 1, email: 1 });
communityAdminSchema.index({ email: 1 });

// Hash password before saving
communityAdminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
communityAdminSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get admin info without password
communityAdminSchema.methods.toJSON = function() {
  const admin = this.toObject();
  delete admin.password;
  return admin;
};

// Static method to find admin by email and community
communityAdminSchema.statics.findByEmailAndCommunity = function(email, communityId) {
  return this.findOne({ email: email.toLowerCase(), communityId });
};

// Static method to find all admins for a community
communityAdminSchema.statics.findByCommunity = function(communityId) {
  return this.find({ communityId }).select('-password');
};

module.exports = mongoose.model('CommunityAdmin', communityAdminSchema);
