const mongoose = require('mongoose');
const CommunityUser = require('./models/CommunityUser.model');
const Community = require('./models/Community.model');
require('dotenv').config();

const debugDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://premarch567:YOUR_PASSWORD_HERE@cluster0.z1nwp7a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
    console.log('✅ Connected to MongoDB');

    // Check communities
    const communities = await Community.find({});
    console.log(`\n📊 Found ${communities.length} communities:`);
    communities.forEach(community => {
      console.log(`   - ${community.name} (ID: ${community._id})`);
    });

    // Check community users
    const communityUsers = await CommunityUser.find({}).populate('communityId', 'name');
    console.log(`\n👥 Found ${communityUsers.length} community users:`);
    communityUsers.forEach(user => {
      console.log(`   - ${user.firstName} ${user.lastName} (${user.email}) - Status: ${user.approvalStatus} - Community: ${user.communityId?.name || 'None'}`);
    });

    // If no data exists, create some test data
    if (communities.length === 0) {
      console.log('\n🔧 No communities found. Creating test community...');
      const testCommunity = new Community({
        name: 'Test Community',
        description: 'A test community for development',
        password: 'test123',
        isActive: true
      });
      await testCommunity.save();
      console.log('✅ Test community created');
    }

    if (communityUsers.length === 0) {
      console.log('\n🔧 No community users found. Creating test users...');
      const testCommunity = await Community.findOne({ name: 'Test Community' });
      
      if (testCommunity) {
        const testUsers = [
          {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@test.com',
            password: 'password123',
            communityId: testCommunity._id,
            approvalStatus: 'approved',
            isActive: true
          },
          {
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@test.com',
            password: 'password123',
            communityId: testCommunity._id,
            approvalStatus: 'pending',
            isActive: true
          }
        ];

        for (const userData of testUsers) {
          const user = new CommunityUser(userData);
          await user.save();
          console.log(`✅ Created user: ${userData.firstName} ${userData.lastName}`);
        }
      }
    }

    console.log('\n🎉 Database check complete!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Database check failed:', error.message);
    process.exit(1);
  }
};

debugDatabase();
