const mongoose = require('mongoose');
const Course = require('./models/Course.model');

// MongoDB connection string
const MONGODB_URI = process.env.MONGO_URI || 'mongodb+srv://premarch567:reGzH94BB9DmqLPJ@cluster0.lyzxobt.mongodb.net/saas-lms-admin?retryWrites=true&w=majority&appName=Cluster0';

async function checkThumbnails() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully!');

    console.log('\n🖼️ Checking course thumbnails...\n');

    // Get all courses with thumbnail information
    const courses = await Course.find({}, { title: 1, thumbnail: 1, status: 1 })
      .sort({ createdAt: -1 });

    console.log(`📚 Total courses found: ${courses.length}`);
    
    if (courses.length > 0) {
      console.log('\n📋 Course Thumbnails:');
      console.log('='.repeat(120));
      console.log(`${'Title'.padEnd(30)} | ${'Status'.padEnd(10)} | ${'Thumbnail URL'.padEnd(60)}`);
      console.log('-'.repeat(120));
      
      courses.forEach(course => {
        const title = (course.title || 'Untitled').substring(0, 30);
        const status = course.status || 'unknown';
        const thumbnail = course.thumbnail || 'No thumbnail';
        
        console.log(
          `${title.padEnd(30)} | ${status.padEnd(10)} | ${thumbnail.substring(0, 60).padEnd(60)}`
        );
      });
      console.log('-'.repeat(120));

      // Check thumbnail URL patterns
      console.log('\n🔍 Thumbnail URL Analysis:');
      const thumbnailPatterns = {
        'No thumbnail': 0,
        'localhost URLs': 0,
        'Production URLs': 0,
        'Relative paths': 0,
        'Data URLs': 0,
        'Other': 0
      };

      courses.forEach(course => {
        const thumbnail = course.thumbnail;
        if (!thumbnail || thumbnail.trim() === '') {
          thumbnailPatterns['No thumbnail']++;
        } else if (thumbnail.includes('localhost')) {
          thumbnailPatterns['localhost URLs']++;
        } else if (thumbnail.startsWith('https://saas-lms-admin-1.onrender.com')) {
          thumbnailPatterns['Production URLs']++;
        } else if (thumbnail.startsWith('/uploads/')) {
          thumbnailPatterns['Relative paths']++;
        } else if (thumbnail.startsWith('data:')) {
          thumbnailPatterns['Data URLs']++;
        } else {
          thumbnailPatterns['Other']++;
        }
      });

      Object.entries(thumbnailPatterns).forEach(([pattern, count]) => {
        if (count > 0) {
          console.log(`   ${pattern}: ${count} courses`);
        }
      });

    } else {
      console.log('❌ No courses found in the database');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the script
checkThumbnails();
