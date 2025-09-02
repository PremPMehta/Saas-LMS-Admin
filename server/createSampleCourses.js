const mongoose = require('mongoose');
const Course = require('./models/Course.model');
const Community = require('./models/Community.model');
const User = require('./models/User.model');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/lms_admin', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const createSampleCourses = async () => {
  try {
    console.log('🔍 Creating sample courses...');
    
    // Get or create a community
    let community = await Community.findOne({});
    if (!community) {
      console.log('Creating a sample community...');
      community = new Community({
        name: 'Crypto Manji',
        description: 'Leading cryptocurrency education platform',
        category: 'Technology',
        ownerName: 'John Doe',
        ownerEmail: 'owner@cryptomanji.com',
        ownerPassword: 'password123',
        status: 'active'
      });
      await community.save();
    }
    
    console.log('✅ Using community:', community.name);
    
    // Get or create an instructor user
    let instructor = await User.findOne({});
    if (!instructor) {
      console.log('Creating a sample instructor...');
      instructor = new User({
        email: 'instructor@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        role: 'admin',
        status: 'active'
      });
      await instructor.save();
    }
    
    console.log('✅ Using instructor:', instructor.firstName, instructor.lastName);
    
    // Sample courses data
    const sampleCourses = [
      {
        title: 'Introduction to Cryptocurrency',
        description: 'Learn the basics of cryptocurrency, blockchain technology, and digital assets. Perfect for beginners who want to understand the future of money.',
        category: 'Technology',
        targetAudience: 'Beginners',
        contentType: 'video',
        thumbnail: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=200&fit=crop',
        status: 'published',
        instructor: instructor._id,
        community: community._id,
        chapters: [
          {
            title: 'What is Cryptocurrency?',
            description: 'Understanding the basics of digital currency',
            order: 0,
            videos: [
              {
                title: 'Introduction to Digital Money',
                description: 'Learn what makes cryptocurrency different from traditional money',
                videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                videoType: 'youtube',
                duration: '15:30',
                order: 0
              }
            ]
          }
        ],
        tags: ['cryptocurrency', 'blockchain', 'beginners'],
        requirements: ['Basic computer knowledge'],
        learningOutcomes: ['Understand cryptocurrency basics', 'Know how blockchain works'],
        price: 0,
        isFree: true
      },
      {
        title: 'Advanced Trading Strategies',
        description: 'Master advanced cryptocurrency trading techniques including technical analysis, risk management, and portfolio optimization.',
        category: 'Finance',
        targetAudience: 'Intermediate',
        contentType: 'video',
        thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop',
        status: 'published',
        instructor: instructor._id,
        community: community._id,
        chapters: [
          {
            title: 'Technical Analysis Fundamentals',
            description: 'Learn to read charts and identify patterns',
            order: 0,
            videos: [
              {
                title: 'Chart Patterns and Indicators',
                description: 'Understanding support, resistance, and trend lines',
                videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                videoType: 'youtube',
                duration: '22:15',
                order: 0
              }
            ]
          }
        ],
        tags: ['trading', 'technical-analysis', 'finance'],
        requirements: ['Basic cryptocurrency knowledge'],
        learningOutcomes: ['Master trading strategies', 'Understand risk management'],
        price: 99,
        isFree: false
      },
      {
        title: 'Blockchain Development Basics',
        description: 'Learn to build your own blockchain applications and smart contracts using Solidity and Ethereum.',
        category: 'Technology',
        targetAudience: 'Advanced',
        contentType: 'video',
        thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=200&fit=crop',
        status: 'published',
        instructor: instructor._id,
        community: community._id,
        chapters: [
          {
            title: 'Smart Contract Development',
            description: 'Building decentralized applications',
            order: 0,
            videos: [
              {
                title: 'Solidity Programming Basics',
                description: 'Learn the fundamentals of smart contract development',
                videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                videoType: 'youtube',
                duration: '35:20',
                order: 0
              }
            ]
          }
        ],
        tags: ['blockchain', 'development', 'solidity'],
        requirements: ['Programming experience', 'Basic cryptography knowledge'],
        learningOutcomes: ['Build smart contracts', 'Deploy DApps'],
        price: 199,
        isFree: false
      },
      {
        title: 'DeFi Fundamentals',
        description: 'Explore Decentralized Finance (DeFi) protocols, yield farming, and liquidity provision strategies.',
        category: 'Finance',
        targetAudience: 'Intermediate',
        contentType: 'video',
        thumbnail: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=400&h=200&fit=crop',
        status: 'published',
        instructor: instructor._id,
        community: community._id,
        chapters: [
          {
            title: 'Understanding DeFi Protocols',
            description: 'How decentralized finance works',
            order: 0,
            videos: [
              {
                title: 'Yield Farming and Liquidity Pools',
                description: 'Maximizing returns in DeFi',
                videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                videoType: 'youtube',
                duration: '28:45',
                order: 0
              }
            ]
          }
        ],
        tags: ['defi', 'yield-farming', 'liquidity'],
        requirements: ['Basic cryptocurrency knowledge'],
        learningOutcomes: ['Understand DeFi protocols', 'Master yield farming'],
        price: 149,
        isFree: false
      },
      {
        title: 'NFT Creation and Trading',
        description: 'Learn to create, mint, and trade Non-Fungible Tokens (NFTs) on various blockchain platforms.',
        category: 'Creative',
        targetAudience: 'All Levels',
        contentType: 'video',
        thumbnail: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=400&h=200&fit=crop',
        status: 'published',
        instructor: instructor._id,
        community: community._id,
        chapters: [
          {
            title: 'NFT Basics and Creation',
            description: 'Understanding and creating NFTs',
            order: 0,
            videos: [
              {
                title: 'Creating Your First NFT',
                description: 'Step-by-step guide to NFT creation',
                videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                videoType: 'youtube',
                duration: '18:30',
                order: 0
              }
            ]
          }
        ],
        tags: ['nft', 'digital-art', 'blockchain'],
        requirements: ['Basic computer skills'],
        learningOutcomes: ['Create and mint NFTs', 'Trade NFTs effectively'],
        price: 79,
        isFree: false
      }
    ];
    
    // Create courses
    const createdCourses = [];
    for (const courseData of sampleCourses) {
      const course = new Course(courseData);
      const savedCourse = await course.save();
      createdCourses.push(savedCourse);
      console.log(`✅ Created course: ${savedCourse.title}`);
    }
    
    console.log(`\n🎉 Successfully created ${createdCourses.length} sample courses!`);
    console.log('📚 Courses are now available on:');
    console.log('- Discovery page: http://localhost:3000/');
    console.log('- Courses page: http://localhost:3000/courses');
    
    // Verify courses were created
    const totalCourses = await Course.countDocuments();
    console.log(`\n📊 Total courses in database: ${totalCourses}`);
    
  } catch (error) {
    console.error('❌ Error creating sample courses:', error);
  } finally {
    mongoose.connection.close();
  }
};

createSampleCourses();
