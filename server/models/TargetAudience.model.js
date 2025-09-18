const mongoose = require('mongoose');

const targetAudienceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Target audience name is required'],
    unique: true,
    trim: true,
    maxlength: [100, 'Target audience name cannot exceed 100 characters'],
    index: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: String,
    enum: [
      'Student',
      'Professional',
      'Entrepreneur',
      'Freelancer',
      'Teacher/Instructor',
      'Manager',
      'Developer',
      'Designer',
      'Marketing Specialist',
      'Other'
    ],
    required: true
  },
  icon: {
    type: String, // Icon class or URL
    default: null
  },
  color: {
    type: String,
    default: '#0F3C60'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
targetAudienceSchema.index({ category: 1 });
targetAudienceSchema.index({ isActive: 1 });
targetAudienceSchema.index({ sortOrder: 1 });

const TargetAudience = mongoose.model('TargetAudience', targetAudienceSchema);

module.exports = TargetAudience;
