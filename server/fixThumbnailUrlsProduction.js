const mongoose = require('mongoose');
const Course = require('./models/Course.model');

// MongoDB connection string
const MONGODB_URI = process.env.MONGO_URI || 'mongodb+srv://premarch567:reGzH94BB9DmqLPJ@cluster0.lyzxobt.mongodb.net/saas-lms-admin?retryWrites=true&w=majority&appName=Cluster0';

async function fixThumbnailUrls() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully!');

    console.log('\n🖼️ Fixing course thumbnail URLs for production...\n');

    // Get all courses
    const courses = await Course.find({});
    console.log(`📚 Found ${courses.length} courses to check`);

    let updatedCount = 0;

    for (const course of courses) {
      let needsUpdate = false;
      let newThumbnail = course.thumbnail;

      // Check if thumbnail needs fixing
      if (!course.thumbnail || course.thumbnail.trim() === '') {
        // No thumbnail - use default
        newThumbnail = 'https://via.placeholder.com/400x225/4285f4/ffffff?text=' + encodeURIComponent(course.title || 'Course');
        needsUpdate = true;
        console.log(`📝 ${course.title}: Adding default placeholder thumbnail`);
      } else if (course.thumbnail.includes('localhost')) {
        // Localhost URL - convert to production
        const filename = course.thumbnail.split('/').pop();
        newThumbnail = `https://saas-lms-admin-1.onrender.com/uploads/${filename}`;
        needsUpdate = true;
        console.log(`📝 ${course.title}: Converting localhost URL to production`);
      } else if (course.thumbnail.startsWith('/uploads/')) {
        // Relative path - convert to full URL
        newThumbnail = `https://saas-lms-admin-1.onrender.com${course.thumbnail}`;
        needsUpdate = true;
        console.log(`📝 ${course.title}: Converting relative path to full URL`);
      } else if (course.thumbnail.startsWith('https://saas-lms-admin-1.onrender.com/uploads/')) {
        // Check if the file exists by trying to extract a valid filename
        const filename = course.thumbnail.split('/').pop();
        
        // If the filename looks like it might be truncated or invalid, use a default
        if (filename.length < 10 || !filename.includes('.')) {
          newThumbnail = 'https://via.placeholder.com/400x225/4285f4/ffffff?text=' + encodeURIComponent(course.title || 'Course');
          needsUpdate = true;
          console.log(`📝 ${course.title}: Replacing invalid filename with placeholder`);
        }
      }

      // Update the course if needed
      if (needsUpdate) {
        await Course.findByIdAndUpdate(course._id, { thumbnail: newThumbnail });
        updatedCount++;
        console.log(`✅ Updated: ${course.title}`);
        console.log(`   Old: ${course.thumbnail}`);
        console.log(`   New: ${newThumbnail}`);
        console.log('');
      }
    }

    console.log(`\n🎉 Thumbnail fix completed!`);
    console.log(`📊 Updated ${updatedCount} out of ${courses.length} courses`);

    // Show final status
    console.log('\n📋 Final thumbnail status:');
    const finalCourses = await Course.find({}, { title: 1, thumbnail: 1 });
    finalCourses.forEach(course => {
      const thumbnailType = course.thumbnail.includes('placeholder') ? 'Placeholder' : 
                           course.thumbnail.includes('onrender.com') ? 'Production URL' : 'Other';
      console.log(`   ${course.title}: ${thumbnailType}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the script
fixThumbnailUrls();
