const mongoose = require('mongoose');
const Community = require('./models/Community.model');

// Connect to MongoDB
mongoose.connect('mongodb+srv://premarch567:Z6qcWJ8m6iv4ZqRW@cluster0.lyzxobt.mongodb.net/saasLmsAdmin?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const checkCommunities = async () => {
  try {
    console.log('🔍 Checking communities in database...');
    
    const communities = await Community.find({});
    console.log('📊 Found communities:', communities.length);
    
    communities.forEach((community, index) => {
      console.log(`\n${index + 1}. Community Details:`);
      console.log(`   Name: ${community.name}`);
      console.log(`   Email: ${community.ownerEmail}`);
      console.log(`   ID: ${community._id}`);
      console.log(`   Status: ${community.status}`);
      console.log(`   Has Password: ${!!community.ownerPassword}`);
      if (community.ownerPassword) {
        console.log(`   Password Hash: ${community.ownerPassword.substring(0, 20)}...`);
      }
    });
    
  } catch (error) {
    console.error('❌ Error checking communities:', error);
  } finally {
    mongoose.connection.close();
  }
};

checkCommunities();
