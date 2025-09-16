const mongoose = require('mongoose');
const CommunityUser = require('./models/CommunityUser.model');
const Community = require('./models/Community.model');
require('dotenv').config();

const checkCommunityUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://premarch567:YOUR_PASSWORD_HERE@cluster0.z1nwp7a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
    console.log('Connected to MongoDB');

    // Check communities
    const communities = await Community.find({});
    console.log(`\nFound ${communities.length} communities:`);
    communities.forEach(community => {
      console.log(`- ${community.name} (ID: ${community._id})`);
    });

    // Check community users
    const communityUsers = await CommunityUser.find({}).populate('communityId', 'name');
    console.log(`\nFound ${communityUsers.length} community users:`);
    
    if (communityUsers.length === 0) {
      console.log('No community users found in the database.');
      console.log('\nPossible reasons:');
      console.log('1. No users have signed up yet');
      console.log('2. Users are in a different collection');
      console.log('3. Database connection issue');
    } else {
      communityUsers.forEach(user => {
        console.log(`- ${user.firstName} ${user.lastName} (${user.email}) - Status: ${user.approvalStatus} - Community: ${user.communityId?.name || 'Unknown'}`);
      });
    }

    // Check for crypto-manji-academy specifically
    const cryptoManjiCommunity = await Community.findOne({ name: { $regex: /crypto.*manji/i } });
    if (cryptoManjiCommunity) {
      console.log(`\nFound crypto-manji community: ${cryptoManjiCommunity.name} (ID: ${cryptoManjiCommunity._id})`);
      
      const cryptoManjiUsers = await CommunityUser.find({ communityId: cryptoManjiCommunity._id });
      console.log(`Found ${cryptoManjiUsers.length} users for crypto-manji community`);
      
      cryptoManjiUsers.forEach(user => {
        console.log(`- ${user.firstName} ${user.lastName} (${user.email}) - Status: ${user.approvalStatus}`);
      });
    } else {
      console.log('\nNo crypto-manji community found');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
};

checkCommunityUsers();
