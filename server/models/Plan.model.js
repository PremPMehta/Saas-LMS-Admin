const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Plan name is required'],
    trim: true,
    maxlength: [50, 'Plan name cannot exceed 50 characters']
  },
  price: {
    type: String,
    required: [true, 'Price is required'],
    trim: true
  },
  period: {
    type: String,
    required: [true, 'Billing period is required'],
    enum: ['month', 'year', 'quarter'],
    default: 'month'
  },
  features: [{
    type: String,
    required: [true, 'Features are required'],
    trim: true
  }],
  limits: {
    type: String,
    required: [true, 'Limits are required'],
    trim: true,
    maxlength: [100, 'Limits cannot exceed 100 characters']
  },
  // New limitation fields
  maxAcademies: {
    type: Number,
    required: [true, 'Maximum academies is required'],
    min: [1, 'Maximum academies must be at least 1']
  },
  maxStudentsPerAcademy: {
    type: Number,
    required: [true, 'Maximum students per academy is required'],
    min: [1, 'Maximum students per academy must be at least 1']
  },
  maxEducatorsPerAcademy: {
    type: Number,
    required: [true, 'Maximum educators per academy is required'],
    min: [1, 'Maximum educators per academy must be at least 1']
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Onhold'],
    default: 'Active'
  },
  popular: {
    type: Boolean,
    default: false
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
planSchema.index({ status: 1 });
planSchema.index({ popular: 1 });
planSchema.index({ name: 1 });

// Virtual for getting total plans count
planSchema.statics.getTotalPlans = function() {
  return this.countDocuments({ status: 'Active' });
};

// Virtual for getting plans by status
planSchema.statics.getPlansByStatus = function() {
  return this.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);
};

const Plan = mongoose.model('Plan', planSchema);

module.exports = Plan; 