const mongoose = require('mongoose');
const User = require('./models/User.model');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const createTestAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if test admin already exists
    const existingAdmin = await User.findOne({ email: 'testadmin@example.com' });
    if (existingAdmin) {
      console.log('Test admin already exists:', existingAdmin._id);
      return existingAdmin._id;
    }

    // Create test admin
    const hashedPassword = await bcrypt.hash('admin123', 12);
    const testAdmin = await User.create({
      email: 'testadmin@example.com',
      password: hashedPassword,
      firstName: 'Test',
      lastName: 'Admin',
      role: 'admin',
      isActive: true
    });

    console.log('Test admin created successfully:', testAdmin._id);
    return testAdmin._id;

  } catch (error) {
    console.error('Error creating test admin:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

createTestAdmin()
  .then(adminId => {
    console.log('✅ Test Admin ID:', adminId);
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
