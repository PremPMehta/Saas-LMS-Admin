const mongoose = require('mongoose');
const Course = require('./models/Course.model');
const Community = require('./models/Community.model');
require('dotenv').config();

const createNewCryptoCourses = async () => {
  try {
    console.log('🚀 Creating 2 new Crypto courses...');
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    
    // Get the community ID (using existing Crypto Manji community)
    const community = await Community.findOne({ name: 'Crypto Manji' });
    if (!community) {
      console.log('❌ Community not found. Please create a community first.');
      return;
    }
    
    console.log(`🏘️ Using community: ${community.name} (${community._id})`);
    
    // Course 1: Crypto Trading Mastery (Vimeo-focused)
    const cryptoVimeoCourse = new Course({
      title: 'Crypto Trading Mastery: Advanced Strategies',
      description: 'Master advanced cryptocurrency trading strategies with professional insights. Learn technical analysis, risk management, and profitable trading techniques through high-quality Vimeo content.',
      category: 'Cryptocurrency',
      targetAudience: 'Advanced',
      contentType: 'video',
      status: 'published',
      publishedAt: new Date(),
      thumbnail: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=300&fit=crop',
      instructor: community._id,
      community: community._id,
      students: [],
      rating: 4.9,
      totalRatings: 89,
      price: 0,
      isFree: true,
      tags: ['cryptocurrency', 'trading', 'technical analysis', 'risk management', 'advanced strategies', 'vimeo'],
      requirements: [
        'Basic understanding of cryptocurrencies',
        'Experience with trading platforms',
        'Understanding of market fundamentals'
      ],
      learningOutcomes: [
        'Master advanced technical analysis techniques',
        'Implement professional risk management strategies',
        'Develop profitable trading systems',
        'Understand market psychology and sentiment',
        'Build a sustainable trading career'
      ],
      chapters: [
        {
          title: 'Advanced Technical Analysis',
          description: 'Master complex chart patterns and indicators',
          order: 0,
          videos: [
            {
              title: 'Elliott Wave Theory Mastery',
              description: 'Understanding Elliott Wave patterns for crypto markets',
              videoUrl: 'https://vimeo.com/123456789',
              videoType: 'vimeo',
              duration: '25:30',
              order: 0
            },
            {
              title: 'Fibonacci Retracement Strategies',
              description: 'Using Fibonacci levels for entry and exit points',
              videoUrl: 'https://vimeo.com/987654321',
              videoType: 'vimeo',
              duration: '22:15',
              order: 1
            }
          ]
        },
        {
          title: 'Risk Management Excellence',
          description: 'Professional risk management techniques',
          order: 1,
          videos: [
            {
              title: 'Position Sizing Strategies',
              description: 'How to size positions for optimal risk/reward',
              videoUrl: 'https://vimeo.com/456789123',
              videoType: 'vimeo',
              duration: '28:45',
              order: 0
            },
            {
              title: 'Stop Loss Optimization',
              description: 'Advanced stop loss placement techniques',
              videoUrl: 'https://vimeo.com/789123456',
              videoType: 'vimeo',
              duration: '31:20',
              order: 1
            }
          ]
        },
        {
          title: 'Market Psychology',
          description: 'Understanding crowd behavior and sentiment',
          order: 2,
          videos: [
            {
              title: 'Fear and Greed Index Analysis',
              description: 'Using market sentiment indicators',
              videoUrl: 'https://vimeo.com/111222333',
              videoType: 'vimeo',
              duration: '26:10',
              order: 0
            },
            {
              title: 'Contrarian Trading Strategies',
              description: 'Going against the crowd for profit',
              videoUrl: 'https://vimeo.com/222333444',
              videoType: 'vimeo',
              duration: '24:35',
              order: 1
            }
          ]
        }
      ]
    });
    
    // Course 2: Forex Trading Fundamentals (YouTube-focused)
    const forexYouTubeCourse = new Course({
      title: 'Forex Trading Fundamentals: Complete Guide',
      description: 'Learn the fundamentals of foreign exchange trading through comprehensive YouTube content. Master currency pairs, market analysis, and trading psychology for consistent profits.',
      category: 'Forex',
      targetAudience: 'Beginners',
      contentType: 'video',
      status: 'published',
      publishedAt: new Date(),
      thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop',
      instructor: community._id,
      community: community._id,
      students: [],
      rating: 4.8,
      totalRatings: 156,
      price: 0,
      isFree: true,
      tags: ['forex', 'currency trading', 'foreign exchange', 'trading basics', 'market analysis', 'youtube'],
      requirements: [
        'No prior trading experience required',
        'Basic understanding of financial markets',
        'Computer with internet connection'
      ],
      learningOutcomes: [
        'Understand how forex markets work',
        'Master currency pair analysis',
        'Learn fundamental and technical analysis',
        'Develop proper trading psychology',
        'Create a personal trading plan'
      ],
      chapters: [
        {
          title: 'Forex Market Basics',
          description: 'Understanding the foreign exchange market',
          order: 0,
          videos: [
            {
              title: 'What is Forex Trading?',
              description: 'Introduction to foreign exchange markets',
              videoUrl: 'https://www.youtube.com/watch?v=1YyAzVmP9xQ',
              videoType: 'youtube',
              duration: '12:30',
              order: 0
            },
            {
              title: 'Major Currency Pairs Explained',
              description: 'Understanding the most traded currency pairs',
              videoUrl: 'https://www.youtube.com/watch?v=SSo_EIwHSd4',
              videoType: 'youtube',
              duration: '15:45',
              order: 1
            }
          ]
        },
        {
          title: 'Fundamental Analysis',
          description: 'Using economic data for trading decisions',
          order: 1,
          videos: [
            {
              title: 'Economic Indicators in Forex',
              description: 'Key economic data that moves currencies',
              videoUrl: 'https://www.youtube.com/watch?v=41JCpzvnn_0',
              videoType: 'youtube',
              duration: '18:20',
              order: 0
            },
            {
              title: 'Central Bank Policies',
              description: 'How central banks affect currency values',
              videoUrl: 'https://www.youtube.com/watch?v=0UBk1e5qmr4',
              videoType: 'youtube',
              duration: '21:15',
              order: 1
            }
          ]
        },
        {
          title: 'Technical Analysis for Forex',
          description: 'Chart analysis and trading signals',
          order: 2,
          videos: [
            {
              title: 'Support and Resistance Levels',
              description: 'Identifying key price levels',
              videoUrl: 'https://www.youtube.com/watch?v=H-O0QtsL6V0',
              videoType: 'youtube',
              duration: '16:30',
              order: 0
            },
            {
              title: 'Moving Averages Strategy',
              description: 'Using moving averages for entry signals',
              videoUrl: 'https://www.youtube.com/watch?v=RTn77uCYU_8',
              videoType: 'youtube',
              duration: '19:45',
              order: 1
            }
          ]
        },
        {
          title: 'Trading Psychology',
          description: 'Mental aspects of successful trading',
          order: 3,
          videos: [
            {
              title: 'Emotional Control in Trading',
              description: 'Managing emotions for better decisions',
              videoUrl: 'https://www.youtube.com/watch?v=Gc2i6L0xqpw',
              videoType: 'youtube',
              duration: '14:20',
              order: 0
            },
            {
              title: 'Building Trading Discipline',
              description: 'Creating consistent trading habits',
              videoUrl: 'https://www.youtube.com/watch?v=Uzji2n6V0Gg',
              videoType: 'youtube',
              duration: '17:10',
              order: 1
            }
          ]
        }
      ]
    });
    
    // Save both courses
    const savedVimeoCourse = await cryptoVimeoCourse.save();
    const savedYouTubeCourse = await forexYouTubeCourse.save();
    
    console.log('✅ New courses created successfully!');
    console.log('\n🎯 Course 1: Crypto Trading Mastery (Vimeo-focused)');
    console.log(`   ID: ${savedVimeoCourse._id}`);
    console.log(`   Chapters: ${savedVimeoCourse.chapters.length}`);
    console.log(`   Videos: ${savedVimeoCourse.chapters.reduce((total, ch) => total + ch.videos.length, 0)}`);
    console.log(`   Platform: Vimeo`);
    
    console.log('\n💱 Course 2: Forex Trading Fundamentals (YouTube-focused)');
    console.log(`   ID: ${savedYouTubeCourse._id}`);
    console.log(`   Chapters: ${savedYouTubeCourse.chapters.length}`);
    console.log(`   Videos: ${savedYouTubeCourse.chapters.reduce((total, ch) => total + ch.videos.length, 0)}`);
    console.log(`   Platform: YouTube`);
    
    console.log('\n🎯 Total: 2 new courses, 7 chapters, 14 videos');
    console.log('🚀 Your new crypto courses are now available in the system!');
    
  } catch (error) {
    console.error('❌ Error creating courses:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

createNewCryptoCourses();
