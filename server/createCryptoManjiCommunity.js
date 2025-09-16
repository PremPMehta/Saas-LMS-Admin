const mongoose = require('mongoose');
const Community = require('./models/Community.model');
require('dotenv').config();

const createCryptoManjiCommunity = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if CryptoManji community already exists
    const existingCommunity = await Community.findOne({ name: /cryptomanji/i });
    
    if (existingCommunity) {
      console.log('CryptoManji community already exists:', existingCommunity._id);
      return existingCommunity._id;
    }

    // Also check by owner email
    const existingByEmail = await Community.findOne({ ownerEmail: 'admin@cryptomanji.com' });
    if (existingByEmail) {
      console.log('CryptoManji community found by email:', existingByEmail._id);
      return existingByEmail._id;
    }

    // Create CryptoManji community
    const cryptoManjiCommunity = await Community.create({
      ownerEmail: 'admin@cryptomanji.com',
      ownerPassword: 'admin123456',
      ownerName: 'CryptoManji Admin',
      ownerPhoneNumber: '+1234567890',
      name: 'CryptoManji',
      description: 'The ultimate crypto learning community for beginners and experts alike. Learn blockchain, DeFi, NFTs, and trading strategies.',
      category: 'Technology',
      pricing: {
        type: 'free',
        price: 0,
        currency: 'USD',
        billingPeriod: 'monthly'
      },
      features: {
        hasCourses: true,
        hasLiveSessions: true,
        hasDiscussions: true,
        hasCertificates: true,
        hasMentorship: true
      },
      isPublic: true,
      isVerified: true,
      status: 'active',
      memberCount: 0,
      courseCount: 0,
      totalRevenue: 0
    });

    console.log('CryptoManji community created successfully:', cryptoManjiCommunity._id);
    return cryptoManjiCommunity._id;

  } catch (error) {
    console.error('Error creating CryptoManji community:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the script
createCryptoManjiCommunity()
  .then(communityId => {
    console.log('✅ CryptoManji Community ID:', communityId);
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
