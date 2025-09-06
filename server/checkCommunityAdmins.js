const mongoose = require('mongoose');
const CommunityAdmin = require('./models/CommunityAdmin.model');
require('dotenv').config();

const checkCommunityAdmins = async () => {
  try {
    console.log('🔍 Checking community admins in database...');
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    
    const admins = await CommunityAdmin.find({});
    console.log(`📊 Found ${admins.length} community admins`);
    
    admins.forEach((admin, index) => {
      console.log(`\n${index + 1}. Admin Details:`);
      console.log(`   Name: ${admin.name}`);
      console.log(`   Email: ${admin.email}`);
      console.log(`   Phone: ${admin.phone || 'N/A'}`);
      console.log(`   Role: ${admin.role}`);
      console.log(`   Status: ${admin.status}`);
      console.log(`   Community ID: ${admin.communityId}`);
      console.log(`   Has Password: ${!!admin.password}`);
      if (admin.password) {
        console.log(`   Password Hash: ${admin.password.substring(0, 20)}...`);
      }
    });
    
  } catch (error) {
    console.error('❌ Error checking community admins:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

checkCommunityAdmins();
