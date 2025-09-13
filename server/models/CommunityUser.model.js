const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const communityUserSchema = new mongoose.Schema({
  // Basic user information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  
  // Community association
  communityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community',
    required: [true, 'Community ID is required']
  },
  
  // Approval system
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  approvedAt: {
    type: Date,
    default: null
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to admin who approved
    default: null
  },
  rejectionReason: {
    type: String,
    trim: true,
    maxlength: [500, 'Rejection reason cannot exceed 500 characters']
  },
  
  // User status
  isActive: {
    type: Boolean,
    default: true
  },
  isDeactivated: {
    type: Boolean,
    default: false
  },
  deactivatedAt: {
    type: Date,
    default: null
  },
  deactivatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to admin who deactivated
    default: null
  },
  deactivationReason: {
    type: String,
    trim: true,
    maxlength: [500, 'Deactivation reason cannot exceed 500 characters']
  },
  
  // Login tracking
  lastLoginAt: {
    type: Date,
    default: null
  },
  isFirstLogin: {
    type: Boolean,
    default: true
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date,
    default: null
  },
  
  // Terms and conditions
  termsAccepted: {
    type: Boolean,
    required: [true, 'Terms and conditions must be accepted'],
    default: false
  },
  termsAcceptedAt: {
    type: Date,
    default: Date.now
  },
  
  // Profile information
  profilePicture: {
    type: String, // URL to stored image
    default: null
  },
  
  // Additional fields for future use
  phoneNumber: {
    type: String,
    trim: true,
    maxlength: [15, 'Phone number cannot exceed 15 characters']
  },
  countryCode: {
    type: String,
    default: '+91',
    trim: true
  }
}, {
  timestamps: true
});

// Hash password before saving
communityUserSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
communityUserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get user without password
communityUserSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

// Method to check if user is locked
communityUserSchema.methods.isLocked = function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

// Method to increment login attempts
communityUserSchema.methods.incLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  // Lock account after 5 failed attempts for 2 hours
  if (this.loginAttempts + 1 >= 5 && !this.isLocked()) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
  }
  
  return this.updateOne(updates);
};

// Method to reset login attempts
communityUserSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 }
  });
};

// Method to approve user
communityUserSchema.methods.approve = function(approvedBy) {
  this.approvalStatus = 'approved';
  this.approvedAt = new Date();
  this.approvedBy = approvedBy;
  this.isActive = true;
  return this.save();
};

// Method to reject user
communityUserSchema.methods.reject = function(rejectionReason, rejectedBy) {
  this.approvalStatus = 'rejected';
  this.rejectionReason = rejectionReason;
  this.isActive = false;
  return this.save();
};

// Method to deactivate user
communityUserSchema.methods.deactivate = function(deactivationReason, deactivatedBy) {
  this.isDeactivated = true;
  this.deactivatedAt = new Date();
  this.deactivatedBy = deactivatedBy;
  this.deactivationReason = deactivationReason;
  this.isActive = false;
  return this.save();
};

// Method to reactivate user
communityUserSchema.methods.reactivate = function() {
  this.isDeactivated = false;
  this.deactivatedAt = null;
  this.deactivatedBy = null;
  this.deactivationReason = null;
  this.isActive = true;
  return this.save();
};

// Static method to find users by approval status
communityUserSchema.statics.findByApprovalStatus = function(status) {
  return this.find({ approvalStatus: status }).populate('communityId', 'name');
};

// Static method to find users by community
communityUserSchema.statics.findByCommunity = function(communityId) {
  return this.find({ communityId }).populate('communityId', 'name');
};

// Index for better query performance
communityUserSchema.index({ email: 1 });
communityUserSchema.index({ communityId: 1 });
communityUserSchema.index({ approvalStatus: 1 });
communityUserSchema.index({ isActive: 1 });
communityUserSchema.index({ createdAt: -1 });

const CommunityUser = mongoose.model('CommunityUser', communityUserSchema);

module.exports = CommunityUser;
