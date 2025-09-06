const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const communitySchema = new mongoose.Schema({
  // Community owner information
  ownerEmail: {
    type: String,
    required: [true, 'Owner email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  ownerPassword: {
    type: String,
    required: [true, 'Owner password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  ownerName: {
    type: String,
    required: [true, 'Owner name is required'],
    trim: true,
    maxlength: [100, 'Owner name cannot exceed 100 characters']
  },
  ownerPhoneNumber: {
    type: String,
    trim: true,
    maxlength: [15, 'Phone number cannot exceed 15 characters']
  },
  ownerCountryCode: {
    type: String,
    default: '+91',
    trim: true
  },
  
  // Community information
  name: {
    type: String,
    required: [true, 'Community name is required'],
    trim: true,
    maxlength: [100, 'Community name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Community description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Technology',
      'Healthcare',
      'Finance',
      'Education',
      'Marketing',
      'Design',
      'Sales',
      'Consulting',
      'Manufacturing',
      'Retail',
      'Real Estate',
      'Entertainment',
      'Non-profit',
      'Government',
      'Other'
    ]
  },
  
  // Community media
  logo: {
    type: String, // URL to stored image
    default: null
  },
  banner: {
    type: String, // URL to stored image
    default: null
  },
  
  // Community settings
  isPublic: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending', 'suspended'],
    default: 'pending'
  },
  
  // Pricing and subscription
  pricing: {
    type: {
      type: String,
      enum: ['free', 'paid', 'freemium'],
      default: 'free'
    },
    price: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'USD'
    },
    billingPeriod: {
      type: String,
      enum: ['monthly', 'yearly', 'one-time'],
      default: 'monthly'
    }
  },
  
  // Community statistics
  memberCount: {
    type: Number,
    default: 0
  },
  courseCount: {
    type: Number,
    default: 0
  },
  totalRevenue: {
    type: Number,
    default: 0
  },
  
  // Community features
  features: {
    hasCourses: {
      type: Boolean,
      default: false
    },
    hasLiveSessions: {
      type: Boolean,
      default: false
    },
    hasDiscussions: {
      type: Boolean,
      default: true
    },
    hasCertificates: {
      type: Boolean,
      default: false
    },
    hasMentorship: {
      type: Boolean,
      default: false
    }
  },
  
  // Social media and contact
  website: {
    type: String,
    trim: true
  },
  socialMedia: {
    facebook: String,
    twitter: String,
    linkedin: String,
    instagram: String,
    youtube: String
  },
  
  // Location
  location: {
    country: String,
    city: String,
    timezone: {
      type: String,
      default: 'UTC'
    }
  },
  
  // Analytics and tracking
  views: {
    type: Number,
    default: 0
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  
  // Owner login tracking
  ownerLastLoginAt: {
    type: Date,
    default: null
  },
  ownerIsFirstLogin: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Hash password before saving
communitySchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('ownerPassword')) return next();

  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.ownerPassword = await bcrypt.hash(this.ownerPassword, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
communitySchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.ownerPassword);
};

// Method to get community without password
communitySchema.methods.toJSON = function() {
  const community = this.toObject();
  delete community.ownerPassword;
  return community;
};

// Method to increment member count
communitySchema.methods.addMember = async function() {
  this.memberCount += 1;
  await this.save();
  return this;
};

// Method to remove member
communitySchema.methods.removeMember = async function() {
  if (this.memberCount > 0) {
    this.memberCount -= 1;
    await this.save();
  }
  return this;
};

// Method to update last activity
communitySchema.methods.updateActivity = async function() {
  this.lastActivity = new Date();
  await this.save();
  return this;
};

// Method to get public community data
communitySchema.methods.getPublicData = function() {
  return {
    id: this._id,
    name: this.name,
    description: this.description,
    category: this.category,
    logo: this.logo,
    banner: this.banner,
    memberCount: this.memberCount,
    courseCount: this.courseCount,
    pricing: this.pricing,
    features: this.features,
    isVerified: this.isVerified,
    status: this.status,
    createdAt: this.createdAt,
    lastActivity: this.lastActivity
  };
};

const Community = mongoose.model('Community', communitySchema);

module.exports = Community;
