const mongoose = require('mongoose');
const Community = require('./models/Community.model');
require('dotenv').config();

const createCommunity = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if community already exists
    const existingCommunity = await Community.findOne({ name: 'Prem Test Community' });
    if (existingCommunity) {
      console.log('Community already exists:', existingCommunity.name);
      return existingCommunity;
    }

    // Create a new community
    const community = new Community({
      name: 'Prem Test Community',
      description: 'Test community for course creation',
      ownerEmail: 'prem@gmail.com',
      ownerPassword: 'Password@123',
      ownerName: 'Prem Mehta',
      category: 'Technology',
      status: 'active'
    });

    const savedCommunity = await community.save();
    console.log('✅ Community created successfully:', savedCommunity.name);
    console.log('📧 Owner Email:', savedCommunity.ownerEmail);
    console.log('🔑 Owner Password:', savedCommunity.ownerPassword);

    return savedCommunity;

  } catch (error) {
    console.error('❌ Error creating community:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

createCommunity();
