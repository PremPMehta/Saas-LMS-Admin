# 🗄️ Database Documentation - SaaS LMS Admin

## 📋 Overview
This document provides a complete overview of all database tables, their structures, and the data stored in each table for the SaaS LMS Admin system.

---

## 🏗️ Database Schema

### 1. **Users Table** (`users`)
**Purpose:** Store admin and regular user accounts

```javascript
{
  _id: ObjectId,
  email: String (required, unique),
  password: String (hashed, required),
  firstName: String,
  lastName: String,
  role: String (enum: ['admin', 'user']),
  isActive: Boolean (default: true),
  isFirstLogin: Boolean (default: true),
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Data Stored:**
- User authentication credentials
- Personal information (name, email)
- Role-based access control
- Login tracking and status

---

### 2. **Communities Table** (`communities`)
**Purpose:** Store community information and owner details

```javascript
{
  _id: ObjectId,
  // Owner Information
  ownerEmail: String (required, unique),
  ownerPassword: String (hashed, required),
  ownerName: String (required),
  ownerPhoneNumber: String,
  ownerCountryCode: String (default: '+91'),
  
  // Community Information
  name: String (required),
  description: String (required),
  category: String (enum: ['Technology', 'Healthcare', 'Finance', 'Education', 'Marketing', 'Design', 'Sales', 'Consulting', 'Manufacturing', 'Retail', 'Real Estate', 'Entertainment', 'Non-profit', 'Government', 'Other']),
  
  // Media
  logo: String (URL),
  banner: String (URL),
  
  // Settings
  isPublic: Boolean (default: true),
  isVerified: Boolean (default: false),
  status: String (enum: ['active', 'inactive', 'pending', 'suspended'], default: 'pending'),
  
  // Pricing & Subscription
  pricing: {
    type: String (enum: ['free', 'paid', 'freemium']),
    amount: Number,
    currency: String,
    billingCycle: String
  },
  
  // Statistics
  memberCount: Number (default: 0),
  courseCount: Number (default: 0),
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

**Data Stored:**
- Community owner authentication (email/password)
- Community details (name, description, category)
- Media assets (logo, banner)
- Status and verification information
- Pricing and subscription details
- Member and course statistics

---

### 3. **Courses Table** (`courses`)
**Purpose:** Store course information, chapters, and videos

```javascript
{
  _id: ObjectId,
  
  // Basic Course Info
  title: String (required),
  description: String (required),
  category: String (required),
  targetAudience: String (required),
  contentType: String (enum: ['video', 'text'], required),
  
  // Status & Media
  status: String (enum: ['draft', 'published', 'archived'], default: 'draft'),
  thumbnail: String (URL),
  
  // Chapters (Nested Schema)
  chapters: [{
    title: String (required),
    description: String,
    order: Number (default: 0),
    
    // Videos (Nested Schema)
    videos: [{
      title: String (required),
      description: String,
      videoUrl: String (required),
      videoType: String (enum: ['upload', 'youtube', 'vimeo', 'loom'], required),
      duration: String (default: '0:00'),
      order: Number (default: 0)
    }],
    
    createdAt: Date,
    updatedAt: Date
  }],
  
  // Relationships
  instructor: ObjectId (ref: 'User', required),
  community: ObjectId (ref: 'Community', required),
  students: [ObjectId] (ref: 'Student'),
  
  // Ratings & Reviews
  rating: Number (default: 0, min: 0, max: 5),
  totalRatings: Number (default: 0),
  
  // Pricing
  price: Number (default: 0),
  isFree: Boolean (default: true),
  
  // Metadata
  tags: [String],
  requirements: [String],
  learningOutcomes: [String],
  
  // Timestamps
  publishedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Data Stored:**
- Complete course structure with chapters and videos
- Video URLs and types (YouTube, Vimeo, Loom, uploaded)
- Video durations and ordering
- Instructor and community relationships
- Student enrollments
- Ratings and reviews
- Pricing information
- Course metadata (tags, requirements, outcomes)

---

### 4. **Students Table** (`students`)
**Purpose:** Store student information and enrollments

```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  phoneNumber: String,
  dateOfBirth: Date,
  gender: String (enum: ['male', 'female', 'other']),
  
  // Address
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  
  // Education
  education: {
    level: String,
    institution: String,
    graduationYear: Number
  },
  
  // Preferences
  interests: [String],
  learningGoals: [String],
  
  // Status
  isActive: Boolean (default: true),
  enrollmentDate: Date,
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

**Data Stored:**
- Student personal information
- Contact details
- Educational background
- Learning preferences and goals
- Enrollment status and history

---

### 5. **Academies Table** (`academies`)
**Purpose:** Store academy/training center information

```javascript
{
  _id: ObjectId,
  name: String (required),
  description: String,
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  
  // Contact
  email: String,
  phoneNumber: String,
  website: String,
  
  // Media
  logo: String (URL),
  banner: String (URL),
  
  // Settings
  isActive: Boolean (default: true),
  capacity: Number,
  
  // Relationships
  community: ObjectId (ref: 'Community'),
  courses: [ObjectId] (ref: 'Course'),
  students: [ObjectId] (ref: 'Student'),
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

**Data Stored:**
- Academy details and location
- Contact information
- Media assets
- Capacity and status
- Relationships with communities, courses, and students

---

### 6. **Plans Table** (`plans`)
**Purpose:** Store subscription plans and pricing

```javascript
{
  _id: ObjectId,
  name: String (required),
  description: String,
  price: Number (required),
  currency: String (default: 'USD'),
  billingCycle: String (enum: ['monthly', 'yearly', 'one-time']),
  
  // Features
  features: [String],
  limits: {
    maxMembers: Number,
    maxCourses: Number,
    maxAcademies: Number,
    storage: String,
    bandwidth: String
  },
  
  // Status
  isActive: Boolean (default: true),
  isPopular: Boolean (default: false),
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

**Data Stored:**
- Plan details and pricing
- Feature lists and limitations
- Billing cycle information
- Popularity and status flags

---

### 7. **Access Logs Table** (`accesslogs`)
**Purpose:** Track user access and authentication events

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User'),
  action: String (required),
  ipAddress: String,
  userAgent: String,
  timestamp: Date (default: Date.now),
  
  // Additional Data
  metadata: {
    success: Boolean,
    errorMessage: String,
    sessionId: String
  }
}
```

**Data Stored:**
- User authentication events
- Login/logout tracking
- IP addresses and user agents
- Success/failure status
- Session information

---

### 8. **Industries Table** (`industries`)
**Purpose:** Store industry categories for communities

```javascript
{
  _id: ObjectId,
  name: String (required, unique),
  description: String,
  icon: String,
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

**Data Stored:**
- Industry names and descriptions
- Icons for UI display
- Active status

---

### 9. **Target Audiences Table** (`targetaudiences`)
**Purpose:** Store target audience categories

```javascript
{
  _id: ObjectId,
  name: String (required, unique),
  description: String,
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

**Data Stored:**
- Target audience names and descriptions
- Active status

---

## 🎥 Video Storage Details

### **Video Data Storage:**
✅ **YES - Videos are stored in the database!**

**What's Stored:**
- **Video URLs**: Links to YouTube, Vimeo, Loom, or uploaded videos
- **Video Types**: `upload`, `youtube`, `vimeo`, `loom`
- **Video Metadata**: Title, description, duration, order
- **Video Organization**: Nested within chapters within courses

**Example Video Object:**
```javascript
{
  title: "Introduction to React",
  description: "Learn the basics of React framework",
  videoUrl: "https://youtube.com/watch?v=abc123",
  videoType: "youtube",
  duration: "15:30",
  order: 0
}
```

**Video Sources Supported:**
1. **YouTube**: Direct video URLs
2. **Vimeo**: Direct video URLs  
3. **Loom**: Direct video URLs
4. **Uploaded**: File uploads (stored as URLs)

---

## 🔗 Relationships

### **Key Relationships:**
- **User** → **Community** (One-to-Many)
- **Community** → **Courses** (One-to-Many)
- **Course** → **Chapters** (One-to-Many)
- **Chapter** → **Videos** (One-to-Many)
- **Community** → **Academies** (One-to-Many)
- **Course** → **Students** (Many-to-Many)
- **Academy** → **Students** (Many-to-Many)

---

## 📊 Database Indexes

### **Performance Indexes:**
- `users.email` (unique)
- `communities.ownerEmail` (unique)
- `courses.instructor` + `courses.status`
- `courses.community` + `courses.status`
- `courses.category` + `courses.status`
- `courses.title` + `courses.description` (text search)

---

## 🔐 Security Features

### **Data Protection:**
- **Password Hashing**: All passwords stored as bcrypt hashes
- **JWT Tokens**: Secure authentication tokens
- **Input Validation**: All data validated before storage
- **Access Control**: Role-based permissions

---

## 📈 Statistics & Analytics

### **Virtual Fields (Computed):**
- `course.studentsCount`: Number of enrolled students
- `course.chaptersCount`: Number of chapters
- `course.videosCount`: Total videos across all chapters
- `community.memberCount`: Total community members
- `community.courseCount`: Total community courses

---

## 🚀 API Endpoints

### **Main API Routes:**
- `/api/auth` - Authentication
- `/api/community-auth` - Community authentication
- `/api/courses` - Course management
- `/api/communities` - Community management
- `/api/users` - User management
- `/api/academies` - Academy management
- `/api/plans` - Subscription plans
- `/api/data` - General data endpoints

---

## 📝 Notes

1. **All timestamps** are automatically managed by Mongoose
2. **Virtual fields** are computed on-the-fly
3. **Relationships** are maintained through ObjectId references
4. **Data validation** occurs at both application and database levels
5. **Indexes** optimize query performance for common operations

---

*Last Updated: August 28, 2025*
*Database: MongoDB with Mongoose ODM*
