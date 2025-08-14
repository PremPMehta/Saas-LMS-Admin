const mongoose = require('mongoose');

const accessLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  loginTime: {
    type: Date,
    default: Date.now,
    required: true
  },
  ipAddress: {
    type: String,
    required: true
  },
  location: {
    type: String,
    default: 'Unknown'
  },
  userAgent: {
    type: String,
    default: 'Unknown'
  },
  status: {
    type: String,
    enum: ['success', 'failed'],
    default: 'success',
    required: true
  },
  failureReason: {
    type: String,
    default: null
  },
  sessionDuration: {
    type: Number, // in minutes
    default: null
  },
  logoutTime: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better query performance
accessLogSchema.index({ userId: 1, loginTime: -1 });
accessLogSchema.index({ status: 1, loginTime: -1 });
accessLogSchema.index({ ipAddress: 1, loginTime: -1 });

// Virtual for formatted username
accessLogSchema.virtual('formattedUsername').get(function() {
  if (this.populated('userId')) {
    return `${this.userId.firstName} ${this.userId.lastName}`;
  }
  return 'Unknown User';
});

// Method to calculate session duration
accessLogSchema.methods.calculateSessionDuration = function() {
  if (this.logoutTime && this.loginTime) {
    return Math.round((this.logoutTime - this.loginTime) / (1000 * 60)); // Convert to minutes
  }
  return null;
};

// Static method to get recent failed attempts for an IP
accessLogSchema.statics.getRecentFailedAttempts = function(ipAddress, minutes = 15) {
  const cutoffTime = new Date(Date.now() - minutes * 60 * 1000);
  return this.countDocuments({
    ipAddress,
    status: 'failed',
    loginTime: { $gte: cutoffTime }
  });
};

// Static method to get user login history
accessLogSchema.statics.getUserLoginHistory = function(userId, limit = 10) {
  return this.find({ userId })
    .sort({ loginTime: -1 })
    .limit(limit)
    .populate('userId', 'email firstName lastName');
};

// Static method to get suspicious activity
accessLogSchema.statics.getSuspiciousActivity = function(hours = 24) {
  const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000);
  
  return this.aggregate([
    {
      $match: {
        loginTime: { $gte: cutoffTime },
        status: 'failed'
      }
    },
    {
      $group: {
        _id: '$ipAddress',
        failedAttempts: { $sum: 1 },
        lastAttempt: { $max: '$loginTime' }
      }
    },
    {
      $match: {
        failedAttempts: { $gte: 5 } // 5 or more failed attempts
      }
    },
    {
      $sort: { failedAttempts: -1 }
    }
  ]);
};

const AccessLog = mongoose.model('AccessLog', accessLogSchema);

module.exports = AccessLog;
