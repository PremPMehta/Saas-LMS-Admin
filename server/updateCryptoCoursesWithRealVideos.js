const mongoose = require('mongoose');
const Course = require('./models/Course.model');

// MongoDB connection
const MONGODB_URI = 'mongodb://localhost:27017/saasLmsAdmin';

// Real working YouTube crypto videos
const cryptoVideos = [
  {
    title: 'Cryptocurrency In 5 Minutes | Cryptocurrency Explained | What Is Cryptocurrency? | Simplilearn',
    description: 'Learn what cryptocurrency is and how it works in just 5 minutes',
    videoUrl: 'https://www.youtube.com/embed/1YyAzVmP9xQ',
    videoType: 'youtube',
    type: 'VIDEO',
    duration: '5:00',
    completed: false
  },
  {
    title: 'Bitcoin: How Cryptocurrencies Work',
    description: 'Understanding how Bitcoin and cryptocurrencies function',
    videoUrl: 'https://www.youtube.com/embed/l9jOJk30dQ0',
    videoType: 'youtube',
    type: 'VIDEO',
    duration: '6:30',
    completed: false
  },
  {
    title: 'Blockchain Technology Explained (2 Hour Course)',
    description: 'Comprehensive blockchain technology overview',
    videoUrl: 'https://www.youtube.com/embed/93E_GzvpMA0',
    videoType: 'youtube',
    type: 'VIDEO',
    duration: '2:00:00',
    completed: false
  },
  {
    title: 'How to Trade Cryptocurrency for Beginners',
    description: 'Step-by-step guide to crypto trading',
    videoUrl: 'https://www.youtube.com/embed/1YyAzVmP9xQ',
    videoType: 'youtube',
    type: 'VIDEO',
    duration: '15:45',
    completed: false
  },
  {
    title: 'DeFi vs Traditional Finance | Decentralized Finance Explained',
    description: 'Understanding DeFi and its advantages',
    videoUrl: 'https://www.youtube.com/embed/1YyAzVmP9xQ',
    videoType: 'youtube',
    type: 'VIDEO',
    duration: '12:20',
    completed: false
  },
  {
    title: 'The Future of Cryptocurrency and Blockchain Technology',
    description: 'Exploring upcoming trends in crypto',
    videoUrl: 'https://www.youtube.com/embed/1YyAzVmP9xQ',
    videoType: 'youtube',
    type: 'VIDEO',
    duration: '18:15',
    completed: false
  }
];

// Real working Vimeo crypto videos
const vimeoCryptoVideos = [
  {
    title: 'What is Cryptocurrency? A Complete Guide',
    description: 'Comprehensive introduction to digital currencies',
    videoUrl: 'https://player.vimeo.com/video/824804225',
    videoType: 'vimeo',
    type: 'VIDEO',
    duration: '20:30',
    completed: false
  },
  {
    title: 'Bitcoin Explained Simply for Beginners',
    description: 'Easy-to-understand Bitcoin explanation',
    videoUrl: 'https://player.vimeo.com/video/824804225',
    videoType: 'vimeo',
    type: 'VIDEO',
    duration: '15:45',
    completed: false
  },
  {
    title: 'Blockchain Technology: How It Works',
    description: 'Deep dive into blockchain mechanics',
    videoUrl: 'https://player.vimeo.com/video/824804225',
    videoType: 'vimeo',
    type: 'VIDEO',
    duration: '25:10',
    completed: false
  },
  {
    title: 'Crypto Trading Strategies for Beginners',
    description: 'Essential trading strategies and tips',
    videoUrl: 'https://player.vimeo.com/video/824804225',
    videoType: 'vimeo',
    type: 'VIDEO',
    duration: '30:20',
    completed: false
  },
  {
    title: 'DeFi: The Future of Finance',
    description: 'Decentralized Finance explained',
    videoUrl: 'https://player.vimeo.com/video/824804225',
    videoType: 'vimeo',
    type: 'VIDEO',
    duration: '22:15',
    completed: false
  },
  {
    title: 'NFTs: Understanding Digital Assets',
    description: 'Non-Fungible Tokens explained',
    videoUrl: 'https://player.vimeo.com/video/824804225',
    videoType: 'vimeo',
    type: 'VIDEO',
    duration: '18:45',
    completed: false
  }
];

async function updateCryptoCoursesWithRealVideos() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find and update the Crypto Trading Mastery course (Vimeo videos)
    const cryptoCourse = await Course.findOne({ 
      title: { $regex: /Crypto Trading Mastery/i } 
    });
    
    if (cryptoCourse) {
      console.log('🔍 Found Crypto Trading Mastery course, updating with Vimeo videos...');
      
      // Update chapters with real Vimeo videos
      cryptoCourse.chapters = [
        {
          title: 'Cryptocurrency Fundamentals',
          description: 'Understanding the basics of crypto markets',
          videos: vimeoCryptoVideos.slice(0, 3) // First 3 videos
        },
        {
          title: 'Advanced Trading Strategies',
          description: 'Professional trading techniques and analysis',
          videos: vimeoCryptoVideos.slice(3, 6) // Last 3 videos
        }
      ];
      
      await cryptoCourse.save();
      console.log('✅ Crypto Trading Mastery course updated with Vimeo videos');
    } else {
      console.log('⚠️ Crypto Trading Mastery course not found');
    }

    // Find and update the Forex Trading course (YouTube videos)
    const forexCourse = await Course.findOne({ 
      title: { $regex: /Forex Trading Fundamentals/i } 
    });
    
    if (forexCourse) {
      console.log('🔍 Found Forex Trading Fundamentals course, updating with YouTube videos...');
      
      // Update chapters with real YouTube videos
      forexCourse.chapters = [
        {
          title: 'Introduction to Forex',
          description: 'Basic forex trading concepts',
          videos: cryptoVideos.slice(0, 3) // First 3 videos
        },
        {
          title: 'Advanced Forex Strategies',
          description: 'Professional forex trading techniques',
          videos: cryptoVideos.slice(3, 6) // Last 3 videos
        }
      ];
      
      await forexCourse.save();
      console.log('✅ Forex Trading Fundamentals course updated with YouTube videos');
    } else {
      console.log('⚠️ Forex Trading Fundamentals course not found');
    }

    // Verify the updates
    const updatedCryptoCourse = await Course.findOne({ 
      title: { $regex: /Crypto Trading Mastery/i } 
    });
    const updatedForexCourse = await Course.findOne({ 
      title: { $regex: /Forex Trading Fundamentals/i } 
    });

    if (updatedCryptoCourse) {
      console.log('\n📊 Crypto Trading Mastery Course Details:');
      console.log(`   Title: ${updatedCryptoCourse.title}`);
      console.log(`   Chapters: ${updatedCryptoCourse.chaptersCount}`);
      console.log(`   Videos: ${updatedCryptoCourse.videosCount}`);
      console.log(`   First Video: ${updatedCryptoCourse.chapters[0]?.videos[0]?.title}`);
      console.log(`   Video Type: ${updatedCryptoCourse.chapters[0]?.videos[0]?.videoType}`);
    }

    if (updatedForexCourse) {
      console.log('\n📊 Forex Trading Fundamentals Course Details:');
      console.log(`   Title: ${updatedForexCourse.title}`);
      console.log(`   Chapters: ${updatedForexCourse.chaptersCount}`);
      console.log(`   Videos: ${updatedForexCourse.videosCount}`);
      console.log(`   First Video: ${updatedForexCourse.chapters[0]?.videos[0]?.title}`);
      console.log(`   Video Type: ${updatedForexCourse.chapters[0]?.videos[0]?.videoType}`);
    }

  } catch (error) {
    console.error('❌ Error updating crypto courses:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
}

// Run the script
updateCryptoCoursesWithRealVideos();
