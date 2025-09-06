const mongoose = require('mongoose');
const Course = require('./models/Course.model');
require('dotenv').config();

const testCourseCreation = async () => {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Create a test course directly
    const testCourse = new Course({
      title: 'Test Course for Publishing',
      description: 'This is a test course to check if publishing works',
      category: 'Technology',
      targetAudience: 'Beginners',
      contentType: 'video',
      status: 'published',
      thumbnail: 'https://via.placeholder.com/300x200/4285f4/ffffff?text=Test+Course',
      instructor: new mongoose.Types.ObjectId(), // Dummy instructor ID
      community: new mongoose.Types.ObjectId(), // Dummy community ID
      chapters: [
        {
          title: 'Test Chapter 1',
          description: 'Test chapter description',
          order: 0,
          videos: [
            {
              title: 'Test Video 1',
              description: 'Test video description',
              videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
              videoType: 'youtube',
              duration: '10:00',
              order: 0
            }
          ]
        }
      ]
    });

    console.log('📝 Attempting to save test course...');
    const savedCourse = await testCourse.save();
    console.log('✅ Test course created successfully!');
    console.log('📊 Course ID:', savedCourse._id);
    console.log('📝 Title:', savedCourse.title);
    console.log('📊 Status:', savedCourse.status);
    console.log('📚 Chapters:', savedCourse.chapters.length);

    // Try to find the course
    const foundCourse = await Course.findById(savedCourse._id);
    console.log('🔍 Found course:', foundCourse ? 'YES' : 'NO');

    // Clean up - delete the test course
    await Course.findByIdAndDelete(savedCourse._id);
    console.log('🧹 Test course cleaned up');

  } catch (error) {
    console.error('❌ Error testing course creation:', error);
    
    if (error.name === 'ValidationError') {
      console.log('📋 Validation errors:');
      Object.keys(error.errors).forEach(key => {
        console.log(`  - ${key}: ${error.errors[key].message}`);
      });
    }
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

testCourseCreation();
