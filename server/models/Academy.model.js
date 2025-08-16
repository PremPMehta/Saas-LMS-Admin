const mongoose = require('mongoose');

const academySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Academy name is required'],
    trim: true,
    maxlength: [100, 'Academy name cannot exceed 100 characters']
  },
  address: {
    type: String,
    required: [true, 'Academy address is required'],
    trim: true,
    maxlength: [500, 'Address cannot exceed 500 characters']
  },
  contactName: {
    type: String,
    required: [true, 'Contact name is required'],
    trim: true,
    maxlength: [100, 'Contact name cannot exceed 100 characters']
  },
  contactNumber: {
    type: String,
    required: [true, 'Contact number is required'],
    trim: true
  },
  countryCode: {
    type: String,
    required: [true, 'Country code is required'],
    default: '+1'
  },
  subdomain: {
    type: String,
    required: [true, 'Subdomain is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[a-z0-9-]+$/, 'Subdomain can only contain lowercase letters, numbers, and hyphens'],
    minlength: [3, 'Subdomain must be at least 3 characters long'],
    maxlength: [20, 'Subdomain must be less than 20 characters']
  },
  fullDomain: {
    type: String,
    required: [true, 'Full domain is required'],
    unique: true,
    trim: true,
    lowercase: true
  },
  logo: {
    type: String, // URL to stored logo
    required: [true, 'Academy logo is required']
  },
  subscriptionPlan: {
    type: String,
    required: [true, 'Subscription plan is required']
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Onhold'],
    default: 'Active'
  },
  students: {
    type: Number,
    default: 0,
    min: [0, 'Students count cannot be negative']
  },
  courses: {
    type: Number,
    default: 0,
    min: [0, 'Courses count cannot be negative']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for better query performance
academySchema.index({ status: 1 });
academySchema.index({ subscriptionPlan: 1 });

// Pre-save middleware to ensure fullDomain is set
academySchema.pre('save', function(next) {
  if (this.subdomain && !this.fullDomain) {
    this.fullDomain = `${this.subdomain}.bbrtek-lms.com`;
  }
  next();
});

// Virtual for getting total academies count
academySchema.statics.getTotalAcademies = function() {
  return this.countDocuments({ status: 'Active' });
};

// Virtual for getting academies by plan
academySchema.statics.getAcademiesByPlan = function() {
  return this.aggregate([
    { $group: { _id: '$subscriptionPlan', count: { $sum: 1 } } }
  ]);
};

module.exports = mongoose.model('Academy', academySchema); 