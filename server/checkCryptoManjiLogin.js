const mongoose = require('mongoose');
const Community = require('./models/Community.model');
require('dotenv').config();

const checkCryptoManjiLogin = async () => {
  try {
    console.log('🔍 Checking Crypto Manji login credentials...');
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    
    // Find Crypto Manji community
    const community = await Community.findOne({ 
      $or: [
        { name: 'Crypto Manji' },
        { ownerEmail: 'owner@cryptomanji.com' }
      ]
    });
    
    if (!community) {
      console.log('❌ Crypto Manji community not found');
      return;
    }
    
    console.log('\n📊 Crypto Manji Community Details:');
    console.log(`   Community ID: ${community._id}`);
    console.log(`   Community Name: ${community.name}`);
    console.log(`   Owner Email: ${community.ownerEmail}`);
    console.log(`   Owner Name: ${community.ownerName}`);
    console.log(`   Status: ${community.status}`);
    console.log(`   Category: ${community.category}`);
    console.log(`   Created: ${community.createdAt}`);
    
    // Test password verification
    console.log('\n🔐 Testing Password Verification:');
    
    const testPasswords = [
      'password123',
      'Password@123',
      'Crypto123!',
      '123456',
      'password',
      'admin123'
    ];
    
    for (const testPassword of testPasswords) {
      try {
        const isValid = await community.comparePassword(testPassword);
        console.log(`   Password "${testPassword}": ${isValid ? '✅ VALID' : '❌ Invalid'}`);
        if (isValid) {
          console.log(`   🎉 CORRECT PASSWORD FOUND: "${testPassword}"`);
          break;
        }
      } catch (error) {
        console.log(`   Password "${testPassword}": ❌ Error - ${error.message}`);
      }
    }
    
    console.log('\n🔑 Login Instructions:');
    console.log('1. Go to: /community-login');
    console.log(`2. Email: ${community.ownerEmail}`);
    console.log('3. Try the passwords listed above');
    console.log('4. After login, you should be redirected to: /crypto-manji/dashboard');
    
  } catch (error) {
    console.error('❌ Error checking Crypto Manji login:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
};

checkCryptoManjiLogin();
