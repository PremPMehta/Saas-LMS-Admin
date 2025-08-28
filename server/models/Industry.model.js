const mongoose = require('mongoose');

const industrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Industry name is required'],
    unique: true,
    trim: true,
    maxlength: [100, 'Industry name cannot exceed 100 characters'],
    index: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  icon: {
    type: String, // Icon class or URL
    default: null
  },
  color: {
    type: String,
    default: '#1976d2'
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
industrySchema.index({ isActive: 1 });
industrySchema.index({ sortOrder: 1 });

const Industry = mongoose.model('Industry', industrySchema);

module.exports = Industry;
