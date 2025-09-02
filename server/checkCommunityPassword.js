const mongoose = require('mongoose');
const Community = require('./models/Community.model');
require('dotenv').config();

const checkCommunityPassword = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const community = await Community.findOne({ name: 'Crypto Manji' });
    if (community) {
      console.log('✅ Community found:', community.name);
      console.log('📧 Email:', community.ownerEmail);
      console.log('🔑 Has password:', !!community.ownerPassword);
      console.log('📊 Status:', community.status);
    } else {
      console.log('❌ Community not found');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

checkCommunityPassword();
