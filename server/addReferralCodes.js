const mongoose = require('mongoose');
const Community = require('./models/Community.model');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://premarch567:Z6qcWJ8m6iv4ZqRW@cluster0.lyzxobt.mongodb.net/saas-lms-admin?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const generateReferralCode = () => {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
};

const addReferralCodes = async () => {
  try {
    console.log('🔍 Adding referral codes to existing communities...');
    
    // Find all communities without referral codes
    const communities = await Community.find({ referralCode: { $exists: false } });
    
    if (communities.length === 0) {
      console.log('✅ All communities already have referral codes');
      return;
    }
    
    console.log(`📊 Found ${communities.length} communities without referral codes`);
    
    // Add referral codes to each community
    for (const community of communities) {
      let referralCode;
      let isUnique = false;
      
      // Generate unique referral code
      while (!isUnique) {
        referralCode = generateReferralCode();
        const existingCommunity = await Community.findOne({ referralCode });
        if (!existingCommunity) {
          isUnique = true;
        }
      }
      
      community.referralCode = referralCode;
      await community.save();
      
      console.log(`✅ Added referral code ${referralCode} to community: ${community.name}`);
    }
    
    console.log(`🎉 Successfully added referral codes to ${communities.length} communities`);
    
    // Show all communities with their referral codes
    const allCommunities = await Community.find({});
    console.log('\n📋 All communities with referral codes:');
    allCommunities.forEach(community => {
      console.log(`- ${community.name}: ${community.referralCode}`);
    });
    
  } catch (error) {
    console.error('❌ Error adding referral codes:', error);
  } finally {
    mongoose.connection.close();
  }
};

addReferralCodes();
