const mongoose = require('mongoose');

const communityAboutSchema = new mongoose.Schema({
  communityName: {
    type: String,
    required: true,
    unique: true
  },
  communityBrandName: {
    type: String,
    required: true
  },
  communityDescription: {
    type: String,
    required: true
  },
  pageStatus: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  videos: [{
    title: String,
    url: String,
    thumbnail: String,
    description: String,
    order: Number
  }],
  thumbnails: {
    heroImage: String,
    logo: String,
    favicon: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
communityAboutSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('CommunityAbout', communityAboutSchema);
