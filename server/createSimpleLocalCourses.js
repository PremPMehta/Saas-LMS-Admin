const mongoose = require('mongoose');
const Course = require('./models/Course.model');

// Use local MongoDB
const LOCAL_MONGO_URI = 'mongodb://localhost:27017/saasLmsAdmin';

const createSimpleLocalCourses = async () => {
  try {
    console.log('🚀 Creating simple courses in LOCAL MongoDB...');
    console.log('🔗 Connecting to:', LOCAL_MONGO_URI);
    
    await mongoose.connect(LOCAL_MONGO_URI);
    console.log('✅ Connected to LOCAL MongoDB');
    
    // Use a simple ObjectId for community and instructor
    const dummyId = new mongoose.Types.ObjectId();
    
    // Check if courses already exist
    const existingCourses = await Course.find({});
    if (existingCourses.length > 0) {
      console.log(`📚 Found ${existingCourses.length} existing courses, skipping creation`);
      return;
    }
    
    // Course 1: Cryptocurrency Mastery
    const cryptoCourse = new Course({
      title: 'Cryptocurrency Mastery: From Beginner to Expert',
      description: 'Master the world of cryptocurrencies with this comprehensive course covering Bitcoin, Ethereum, DeFi, and blockchain technology.',
      category: 'Finance',
      targetAudience: 'Intermediate',
      contentType: 'video',
      status: 'published',
      publishedAt: new Date(),
      thumbnail: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=300&fit=crop',
      instructor: dummyId,
      community: dummyId,
      students: [],
      rating: 4.8,
      totalRatings: 127,
      price: 0,
      isFree: true,
      tags: ['cryptocurrency', 'bitcoin', 'ethereum', 'blockchain'],
      chapters: [
        {
          title: 'Introduction to Cryptocurrencies',
          description: 'Learn the basics of digital currencies',
          order: 0,
          videos: [
            {
              title: 'What is Cryptocurrency?',
              description: 'Introduction to digital currencies',
              videoUrl: 'https://www.youtube.com/watch?v=1YyAzVmP9xQ',
              videoType: 'youtube',
              duration: '8:45',
              order: 0
            }
          ]
        }
      ]
    });
    
    // Course 2: Personal Finance Mastery
    const financeCourse = new Course({
      title: 'Personal Finance Mastery: Build Wealth and Financial Freedom',
      description: 'Transform your financial future with this comprehensive course on budgeting, investing, saving, and building wealth.',
      category: 'Finance',
      targetAudience: 'Beginners',
      contentType: 'video',
      status: 'published',
      publishedAt: new Date(),
      thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop',
      instructor: dummyId,
      community: dummyId,
      students: [],
      rating: 4.9,
      totalRatings: 203,
      price: 0,
      isFree: true,
      tags: ['personal finance', 'investing', 'budgeting', 'saving'],
      chapters: [
        {
          title: 'Financial Foundation',
          description: 'Building a solid financial foundation',
          order: 0,
          videos: [
            {
              title: 'Why Financial Education Matters',
              description: 'The importance of financial literacy',
              videoUrl: 'https://www.youtube.com/watch?v=Gc2i6L0xqpw',
              videoType: 'youtube',
              duration: '9:15',
              order: 0
            }
          ]
        }
      ]
    });
    
    // Save both courses
    const savedCryptoCourse = await cryptoCourse.save();
    const savedFinanceCourse = await financeCourse.save();
    
    console.log('✅ Courses created successfully in LOCAL MongoDB!');
    console.log('\n📚 Course 1: Cryptocurrency Mastery');
    console.log(`   ID: ${savedCryptoCourse._id}`);
    
    console.log('\n💰 Course 2: Personal Finance Mastery');
    console.log(`   ID: ${savedFinanceCourse._id}`);
    
    console.log('\n🎯 Total: 2 courses created in local database');
    console.log('🚀 Now restart your server and check /courses');
    
  } catch (error) {
    console.error('❌ Error creating courses:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from LOCAL MongoDB');
  }
};

createSimpleLocalCourses();
