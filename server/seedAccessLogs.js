const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User.model');
const AccessLog = require('./models/AccessLog.model');

// Load environment variables
dotenv.config();

// Connect to database
const connectDB = require('./config/db');
connectDB();

const seedAccessLogs = async () => {
  try {
    console.log('🌱 Seeding access logs...');

    // Get all users
    const users = await User.find();
    
    if (users.length === 0) {
      console.log('❌ No users found. Please seed users first.');
      return;
    }

    // Clear existing access logs
    await AccessLog.deleteMany({});
    console.log('🧹 Cleared existing access logs');

    // Generate sample access logs for the last 30 days
    const accessLogs = [];
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Sample IP addresses and locations
    const sampleIPs = [
      '192.168.1.100',
      '10.0.0.50',
      '172.16.0.25',
      '203.0.113.45',
      '198.51.100.123',
      '127.0.0.1',
      '::1'
    ];

    const sampleLocations = [
      'New York, NY, USA',
      'London, UK',
      'Tokyo, Japan',
      'Sydney, Australia',
      'Toronto, Canada',
      'Berlin, Germany',
      'Mumbai, India',
      'São Paulo, Brazil'
    ];

    const sampleUserAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1',
      'Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1'
    ];

    // Generate logs for each user
    for (const user of users) {
      // Generate 5-15 login attempts per user over the last 30 days
      const numLogs = Math.floor(Math.random() * 11) + 5;
      
      for (let i = 0; i < numLogs; i++) {
        const loginTime = new Date(thirtyDaysAgo.getTime() + Math.random() * (now.getTime() - thirtyDaysAgo.getTime()));
        const isSuccess = Math.random() > 0.1; // 90% success rate
        
        const log = {
          userId: user._id,
          loginTime,
          ipAddress: sampleIPs[Math.floor(Math.random() * sampleIPs.length)],
          location: sampleLocations[Math.floor(Math.random() * sampleLocations.length)],
          userAgent: sampleUserAgents[Math.floor(Math.random() * sampleUserAgents.length)],
          status: isSuccess ? 'success' : 'failed',
          failureReason: isSuccess ? null : ['Invalid password', 'Account locked', 'Invalid email'][Math.floor(Math.random() * 3)],
          sessionDuration: isSuccess ? Math.floor(Math.random() * 180) + 30 : null, // 30-210 minutes
          logoutTime: isSuccess ? new Date(loginTime.getTime() + (Math.floor(Math.random() * 180) + 30) * 60 * 1000) : null
        };
        
        accessLogs.push(log);
      }
    }

    // Insert all access logs
    await AccessLog.insertMany(accessLogs);
    
    console.log(`✅ Successfully seeded ${accessLogs.length} access logs`);
    console.log(`📊 Users: ${users.length}`);
    console.log(`🔐 Successful logins: ${accessLogs.filter(log => log.status === 'success').length}`);
    console.log(`❌ Failed logins: ${accessLogs.filter(log => log.status === 'failed').length}`);

    // Update user lastLoginAt fields based on their most recent successful login
    for (const user of users) {
      const lastSuccessfulLogin = await AccessLog.findOne({
        userId: user._id,
        status: 'success'
      }).sort({ loginTime: -1 });

      if (lastSuccessfulLogin) {
        await User.findByIdAndUpdate(user._id, {
          lastLoginAt: lastSuccessfulLogin.loginTime
        });
      }
    }

    console.log('✅ Updated user lastLoginAt fields');

  } catch (error) {
    console.error('❌ Error seeding access logs:', error);
  } finally {
    // Close database connection
    mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run the seed function
seedAccessLogs();
