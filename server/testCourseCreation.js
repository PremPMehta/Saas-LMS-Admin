const mongoose = require('mongoose');
const Course = require('./models/Course.model');
const Community = require('./models/Community.model');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/saasLmsAdmin', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const testCourseCreation = async () => {
  try {
    console.log('🔍 Testing course creation...');
    
    // First, let's check if we have any communities
    const communities = await Community.find().limit(1);
    console.log('📊 Found communities:', communities.length);
    
    if (communities.length === 0) {
      console.log('❌ No communities found. Please create a community first.');
      return;
    }
    
    const testCommunity = communities[0];
    console.log('✅ Using community:', testCommunity.name);
    
    // Create a test course
    const testCourse = new Course({
      title: 'Test Course - API Check',
      description: 'This is a test course to verify the API is working',
      category: 'Technology',
      targetAudience: 'Beginners',
      contentType: 'video',
      thumbnail: 'https://via.placeholder.com/300x200/4285f4/ffffff?text=Test+Course',
      status: 'draft',
      instructor: testCommunity._id, // Use community as instructor for now
      community: testCommunity._id,
      chapters: [
        {
          title: 'Introduction',
          description: 'Welcome to the course',
          order: 0,
          videos: [
            {
              title: 'Getting Started',
              description: 'Learn the basics',
              videoUrl: 'https://example.com/video1',
              videoType: 'youtube',
              duration: '10:00',
              order: 0
            }
          ]
        }
      ],
      tags: ['test', 'api'],
      requirements: ['Basic knowledge'],
      learningOutcomes: ['Understand the system'],
      price: 0,
      isFree: true
    });
    
    const savedCourse = await testCourse.save();
    console.log('✅ Test course created successfully!');
    console.log('📝 Course ID:', savedCourse._id);
    console.log('📝 Course Title:', savedCourse.title);
    
    // Now let's test fetching courses
    const allCourses = await Course.find({ community: testCommunity._id });
    console.log('📚 Total courses for this community:', allCourses.length);
    
    // Clean up - delete the test course
    await Course.findByIdAndDelete(savedCourse._id);
    console.log('🧹 Test course cleaned up');
    
  } catch (error) {
    console.error('❌ Error testing course creation:', error);
  } finally {
    mongoose.connection.close();
  }
};

testCourseCreation();
