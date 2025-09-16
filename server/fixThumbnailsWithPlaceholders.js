const mongoose = require('mongoose');
const Course = require('./models/Course.model');

// MongoDB connection string
const MONGODB_URI = process.env.MONGO_URI || 'mongodb+srv://premarch567:reGzH94BB9DmqLPJ@cluster0.lyzxobt.mongodb.net/saas-lms-admin?retryWrites=true&w=majority&appName=Cluster0';

async function fixThumbnailsWithPlaceholders() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully!');

    console.log('\n🖼️ Updating course thumbnails to use reliable placeholder images...\n');

    // Get all courses
    const courses = await Course.find({});
    console.log(`📚 Found ${courses.length} courses to update`);

    let updatedCount = 0;

    for (const course of courses) {
      // Create a placeholder thumbnail URL based on course title
      const courseTitle = course.title || 'Course';
      const placeholderUrl = `https://via.placeholder.com/400x225/4285f4/ffffff?text=${encodeURIComponent(courseTitle)}`;
      
      // Update the course with the placeholder
      await Course.findByIdAndUpdate(course._id, { thumbnail: placeholderUrl });
      updatedCount++;
      
      console.log(`✅ Updated: ${courseTitle}`);
      console.log(`   New thumbnail: ${placeholderUrl}`);
    }

    console.log(`\n🎉 Thumbnail update completed!`);
    console.log(`📊 Updated ${updatedCount} courses with placeholder thumbnails`);

    // Show final status
    console.log('\n📋 Final thumbnail status:');
    const finalCourses = await Course.find({}, { title: 1, thumbnail: 1 });
    finalCourses.forEach(course => {
      console.log(`   ${course.title}: Placeholder thumbnail`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the script
fixThumbnailsWithPlaceholders();
