const mongoose = require('mongoose');
const User = require('./models/User.model');
require('dotenv').config();

const checkAdminUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Get all users
    const users = await User.find({}, 'email role firstName lastName');
    console.log('Found users:');
    users.forEach(user => {
      console.log(`- Email: ${user.email}, Role: ${user.role}, Name: ${user.firstName} ${user.lastName}`);
    });

    // Check for admin users
    const adminUsers = await User.find({ role: 'admin' });
    console.log('\nAdmin users:');
    adminUsers.forEach(user => {
      console.log(`- Email: ${user.email}, Name: ${user.firstName} ${user.lastName}`);
    });

  } catch (error) {
    console.error('Error checking users:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
};

checkAdminUsers();
