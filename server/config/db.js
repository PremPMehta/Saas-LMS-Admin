const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use default connection settings for reliability
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    console.log('⚠️  Server will continue running without database connection');
    console.log('⚠️  Some features may not work properly');
    // Don't exit the process, let the server continue running
    return null;
  }
};

module.exports = connectDB; 