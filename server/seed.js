const mongoose = require('mongoose');
const User = require('./models/User.model');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@bbrtek.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create default admin user
    const adminUser = new User({
      email: 'admin@bbrtek.com',
      password: 'Password@123',
      role: 'admin',
      status: 'active',
      isActive: true
    });

    await adminUser.save();
    console.log('Default admin user created successfully');
    console.log('Email: admin@bbrtek.com');
    console.log('Password: Password@123');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

seedDatabase(); 