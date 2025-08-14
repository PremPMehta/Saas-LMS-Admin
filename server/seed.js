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

    // Create default admin user with complete profile
    const adminUser = new User({
      email: 'admin@bbrtek.com',
      password: 'Password@123',
      firstName: 'Prem',
      lastName: 'Mehta',
      phoneNumber: '9879228567',
      countryCode: '+91',
      address: {
        street: '123 Main Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
        zipCode: '400001'
      },
      profilePicture: 'https://ui-avatars.com/api/?name=Prem+Mehta&background=1976d2&color=fff&size=200',
      isProfileComplete: true,
      role: 'admin',
      status: 'active',
      isActive: true
    });

    await adminUser.save();
    console.log('Default admin user created successfully');
    console.log('Email: admin@bbrtek.com');
    console.log('Password: Password@123');
    console.log('Name: Prem Mehta');
    console.log('Phone: +91 9879228567');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

seedDatabase(); 