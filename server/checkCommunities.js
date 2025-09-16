const mongoose = require('mongoose');
const Community = require('./models/Community.model');
require('dotenv').config();

const checkCommunities = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Get all communities
    const communities = await Community.find({}, 'name ownerEmail status');
    console.log('Found communities:');
    communities.forEach(community => {
      console.log(`- Name: ${community.name}, Email: ${community.ownerEmail}, Status: ${community.status}`);
    });

    // Check specifically for cryptomanji
    const cryptoManji = await Community.findOne({ 
      $or: [
        { name: /cryptomanji/i },
        { ownerEmail: 'admin@cryptomanji.com' }
      ]
    });
    
    if (cryptoManji) {
      console.log('\nCryptoManji community found:');
      console.log(`- ID: ${cryptoManji._id}`);
      console.log(`- Name: ${cryptoManji.name}`);
      console.log(`- Email: ${cryptoManji.ownerEmail}`);
      console.log(`- Status: ${cryptoManji.status}`);
    } else {
      console.log('\nNo CryptoManji community found');
    }

  } catch (error) {
    console.error('Error checking communities:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
};

checkCommunities();