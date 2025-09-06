const mongoose = require('mongoose');
const Community = require('./models/Community.model');
require('dotenv').config();

const checkLoginCredentials = async () => {
  try {
    console.log('🔍 Checking community login credentials...');
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    
    const communities = await Community.find({});
    console.log(`\n📊 Found ${communities.length} communities`);
    
    communities.forEach((community, index) => {
      console.log(`\n${index + 1}. Community: ${community.name}`);
      console.log(`   Email: ${community.ownerEmail}`);
      console.log(`   Status: ${community.status}`);
      console.log(`   Has Password: ${!!community.ownerPassword}`);
      if (community.ownerPassword) {
        console.log(`   Password Hash: ${community.ownerPassword.substring(0, 20)}...`);
      }
    });
    
    console.log('\n=== LOGIN INSTRUCTIONS ===');
    console.log('1. Go to /community-login in your app');
    console.log('2. Try these credentials:');
    communities.forEach(c => {
      console.log(`   Email: ${c.ownerEmail}`);
      console.log(`   Password: Try "Password@123" or "123456"`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

checkLoginCredentials();
