const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User.model');

// Load environment variables
dotenv.config();

// Set MongoDB URI if not provided
if (!process.env.MONGO_URI) {
  process.env.MONGO_URI = 'mongodb+srv://premarch567:reGzH94BB9DmqLPJ@cluster0.lyzxobt.mongodb.net/saas-lms-admin?retryWrites=true&w=majority&appName=Cluster0';
  console.log('🔗 Using MongoDB Atlas connection');
}

// Set default JWT_SECRET if not provided
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'your-super-secret-jwt-key-change-this-in-production';
  console.log('⚠️  Using default JWT_SECRET - change this in production');
}

// Connect to database
let dbConnection = null;
connectDB().then(conn => {
  dbConnection = conn;
});

const app = express();

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow all origins for development
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
  preflightContinue: false,
  optionsSuccessStatus: 200
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Handle preflight requests globally
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(200);
});

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/academies', require('./routes/academy.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/plans', require('./routes/plan.routes'));
app.use('/api/settings', require('./routes/settings.routes'));
app.use('/api/data', require('./routes/data.routes'));
app.use('/api/courses', require('./routes/course.routes'));
app.use('/api/community-auth', require('./routes/communityAuth.routes'));
app.use('/api/community-admins', require('./routes/communityAdmin.routes'));
app.use('/api/community-user', require('./routes/communityUser.routes'));
app.use('/api/communities', require('./routes/communities.routes'));
app.use('/api/about-us', require('./routes/aboutUs.routes'));
app.use('/api/upload', require('./routes/upload.routes'));

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'BBR Tek Admin Server is running',
    timestamp: new Date().toISOString()
  });
});

// Default route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to BBR Tek Admin API',
    version: '1.0.2',
    cors: 'ALL_ORIGINS_ALLOWED',
    timestamp: new Date().toISOString()
  });
});

// Create default admin user
const createDefaultAdmin = async () => {
  try {
    // Only try to create admin user if database is connected
    if (!dbConnection) {
      console.log('⚠️  Skipping admin user creation - database not connected');
      return;
    }

    const adminEmail = 'admin@multi-admin.com';
    const adminPassword = 'Password@123';

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      // Create new admin user
      const adminUser = new User({
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        isActive: true
      });

      await adminUser.save();
      console.log('✅ Default admin user created successfully');
      console.log(`📧 Email: ${adminEmail}`);
      console.log(`🔑 Password: ${adminPassword}`);
    } else {
      console.log('✅ Default admin user already exists');
      console.log(`📧 Email: ${adminEmail}`);
    }
  } catch (error) {
    console.error('❌ Error creating default admin user:', error.message);
  }
};

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      success: false,
      message: 'File size too large. Please use a smaller image.',
      error: 'Payload too large'
    });
  }
  
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5001;

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`📊 Database: ${process.env.MONGO_URI}`);
  
  // Create default admin user after server starts
  await createDefaultAdmin();
  
  console.log('🎯 BBR Tek Admin Server is ready!');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`❌ Unhandled Promise Rejection: ${err.message}`);
  // Don't exit the process, just log the error
  console.log('⚠️  Server will continue running');
}); 