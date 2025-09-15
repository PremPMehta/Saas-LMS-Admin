const mongoose = require('mongoose');
const Course = require('./models/Course.model');

// MongoDB connection string
const MONGODB_URI = process.env.MONGO_URI || 'mongodb+srv://premarch567:reGzH94BB9DmqLPJ@cluster0.lyzxobt.mongodb.net/saas-lms-admin?retryWrites=true&w=majority&appName=Cluster0';

async function fixThumbnailsWithFallback() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully!');

    console.log('\n🖼️ Updating course thumbnails with reliable fallback system...\n');

    // Get all courses
    const courses = await Course.find({});
    console.log(`📚 Found ${courses.length} courses to update`);

    let updatedCount = 0;

    for (const course of courses) {
      // Use a simple fallback - just set to empty string so frontend can handle it
      // The frontend will show a gradient background with course title
      await Course.findByIdAndUpdate(course._id, { thumbnail: '' });
      updatedCount++;
      
      console.log(`✅ Updated: ${course.title} - Set to empty (frontend will handle fallback)`);
    }

    console.log(`\n🎉 Thumbnail update completed!`);
    console.log(`📊 Updated ${updatedCount} courses with empty thumbnails (frontend fallback)`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the script
fixThumbnailsWithFallback();
