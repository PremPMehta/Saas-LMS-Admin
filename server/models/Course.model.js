const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  content: {
    type: String,
    required: false,
    default: ''
  },
  videoUrl: {
    type: String,
    required: false,
    default: ''
  },
  videoType: {
    type: String,
    enum: ['upload', 'youtube', 'vimeo', 'loom'],
    required: false,
    default: 'youtube'
  },
  type: {
    type: String,
    enum: ['VIDEO', 'TEXT', 'PDF'],
    required: false,
    default: 'VIDEO'
  },
  duration: {
    type: String,
    default: '0:00'
  },
  order: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const chapterSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  videos: [videoSchema],
  order: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  targetAudience: {
    type: String,
    required: true,
    trim: true
  },
  contentType: {
    type: String,
    enum: ['video', 'text', 'pdf'],
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  publishedAt: {
    type: Date,
    default: null
  },
  archivedAt: {
    type: Date,
    default: null
  },
  thumbnail: {
    type: String,
    default: ''
  },
  chapters: [chapterSchema],
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community',
    required: true
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    default: 0
  },
  isFree: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  requirements: [{
    type: String,
    trim: true
  }],
  learningOutcomes: [{
    type: String,
    trim: true
  }],
  publishedAt: {
    type: Date
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for better query performance
courseSchema.index({ instructor: 1, status: 1 });
courseSchema.index({ community: 1, status: 1 });
courseSchema.index({ category: 1, status: 1 });
// courseSchema.index({ title: 'text', description: 'text' }); // Temporarily disabled to fix memory issue

// Virtual for total students count
courseSchema.virtual('studentsCount').get(function() {
  return this.students ? this.students.length : 0;
});

// Virtual for total chapters count
courseSchema.virtual('chaptersCount').get(function() {
  return this.chapters ? this.chapters.length : 0;
});

// Virtual for total videos count
courseSchema.virtual('videosCount').get(function() {
  if (!this.chapters) return 0;
  return this.chapters.reduce((total, chapter) => {
    return total + (chapter.videos ? chapter.videos.length : 0);
  }, 0);
});

// Ensure virtual fields are serialized
courseSchema.set('toJSON', { virtuals: true });
courseSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Course', courseSchema);
