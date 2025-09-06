const mongoose = require('mongoose');
const Community = require('./models/Community.model');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const resetCommunityPassword = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const newPassword = 'Password@123';
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const community = await Community.findOneAndUpdate(
      { name: 'Crypto Manji' },
      { ownerPassword: hashedPassword },
      { new: true }
    );

    if (community) {
      console.log('✅ Password reset successfully!');
      console.log('📧 Email:', community.ownerEmail);
      console.log('🔑 New Password:', newPassword);
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

resetCommunityPassword();
