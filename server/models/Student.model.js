const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema({
  // Inherit from User model
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
  phoneNumber: {
    type: String,
    trim: true,
    maxlength: [15, 'Phone number cannot exceed 15 characters']
  },
  countryCode: {
    type: String,
    default: '+91',
    trim: true
  },
  
  // Student-specific fields
  currentRole: {
    type: String,
    required: [true, 'Current role is required'],
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
    ]
  },
  industry: {
    type: String,
    required: [true, 'Industry is required'],
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
  
  // Profile and status
  profilePicture: {
    type: String, // URL to stored image
    default: null
  },
  isProfileComplete: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'active'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLoginAt: {
    type: Date,
    default: null
  },
  isFirstLogin: {
    type: Boolean,
    default: true
  },
  
  // Student-specific tracking
  enrolledCommunities: [{
    communityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Community'
    },
    enrolledAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'dropped'],
      default: 'active'
    }
  }],
  
  // Learning preferences
  interests: [{
    type: String,
    trim: true
  }],
  
  // Progress tracking
  totalCoursesCompleted: {
    type: Number,
    default: 0
  },
  totalHoursLearned: {
    type: Number,
    default: 0
  },
  
  // Social features
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }]
}, {
  timestamps: true
});

// Hash password before saving
studentSchema.pre('save', async function(next) {
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
studentSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get student without password
studentSchema.methods.toJSON = function() {
  const student = this.toObject();
  delete student.password;
  return student;
};

// Method to check if profile is complete
studentSchema.methods.checkProfileComplete = function() {
  return !!(this.firstName && this.lastName && this.phoneNumber && this.currentRole && this.industry);
};

// Method to enroll in a community
studentSchema.methods.enrollInCommunity = async function(communityId) {
  const existingEnrollment = this.enrolledCommunities.find(
    enrollment => enrollment.communityId.toString() === communityId.toString()
  );
  
  if (!existingEnrollment) {
    this.enrolledCommunities.push({
      communityId,
      enrolledAt: new Date(),
      status: 'active'
    });
    await this.save();
  }
  
  return this;
};

// Method to get enrollment status
studentSchema.methods.getEnrollmentStatus = function(communityId) {
  const enrollment = this.enrolledCommunities.find(
    enrollment => enrollment.communityId.toString() === communityId.toString()
  );
  return enrollment ? enrollment.status : null;
};

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
