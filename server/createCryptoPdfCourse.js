const mongoose = require('mongoose');
const Course = require('./models/Course.model');
const Community = require('./models/Community.model');

// MongoDB connection
const MONGODB_URI = process.env.MONGO_URI || 'mongodb+srv://premarch567:Z6qcWJ8m6iv4ZqRW@cluster0.lyzxobt.mongodb.net/saas-lms-admin?retryWrites=true&w=majority&appName=Cluster0';

async function createCryptoPdfCourse() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find the existing community
    const community = await Community.findOne({ name: 'Crypto Manji' });
    if (!community) {
      console.log('❌ Community not found. Please create a community first.');
      return;
    }

    console.log('✅ Found community:', community.name);

    // Create the Crypto Video course
    const cryptoVideoCourse = new Course({
      title: 'Cryptocurrency Mastery Course',
      description: 'Comprehensive cryptocurrency learning with video tutorials covering Bitcoin, Ethereum, DeFi, and blockchain technology',
      thumbnail: 'https://via.placeholder.com/300x200/34a853/ffffff?text=Crypto+Course',
      status: 'published',
      community: community._id,
      category: 'Cryptocurrency',
      targetAudience: 'Beginners to Advanced',
      contentType: 'video',
      instructor: community._id, // Using community ID as instructor for now
      chapters: [
        {
          title: 'Cryptocurrency Fundamentals',
          description: 'Basic concepts and understanding of digital currencies',
          videos: [
            {
              title: 'Introduction to Cryptocurrency',
              description: 'What is cryptocurrency and how does it work?',
              type: 'VIDEO',
              content: 'https://www.youtube.com/watch?v=1YyAzVmP9xQ',
              videoUrl: 'https://www.youtube.com/watch?v=1YyAzVmP9xQ',
              videoType: 'youtube',
              duration: '8:45',
              completed: false
            },
            {
              title: 'Blockchain Technology Explained',
              description: 'Understanding the technology behind cryptocurrencies',
              type: 'VIDEO',
              content: 'https://www.youtube.com/watch?v=SSo_EIwHSd4',
              videoUrl: 'https://www.youtube.com/watch?v=SSo_EIwHSd4',
              videoType: 'youtube',
              duration: '6:00',
              completed: false
            },
            {
              title: 'Bitcoin Basics',
              description: 'The first and most popular cryptocurrency',
              type: 'VIDEO',
              content: 'https://www.youtube.com/watch?v=Gc2i6L0xqpw',
              videoUrl: 'https://www.youtube.com/watch?v=Gc2i6L0xqpw',
              videoType: 'youtube',
              duration: '9:15',
              completed: false
            }
          ]
        },
        {
          title: 'Trading and Investment',
          description: 'Strategies for trading and investing in crypto',
          videos: [
            {
              title: 'Crypto Trading Fundamentals',
              description: 'Basic trading concepts and strategies',
              type: 'VIDEO',
              content: 'https://www.youtube.com/watch?v=1YyAzVmP9xQ',
              videoUrl: 'https://www.youtube.com/watch?v=1YyAzVmP9xQ',
              videoType: 'youtube',
              duration: '12:30',
              completed: false
            },
            {
              title: 'Risk Management in Crypto',
              description: 'How to manage risks when investing in cryptocurrencies',
              type: 'VIDEO',
              content: 'https://www.youtube.com/watch?v=SSo_EIwHSd4',
              videoUrl: 'https://www.youtube.com/watch?v=SSo_EIwHSd4',
              videoType: 'youtube',
              duration: '10:45',
              completed: false
            },
            {
              title: 'Portfolio Diversification',
              description: 'Building a diversified cryptocurrency portfolio',
              type: 'VIDEO',
              content: 'https://www.youtube.com/watch?v=Gc2i6L0xqpw',
              videoUrl: 'https://www.youtube.com/watch?v=Gc2i6L0xqpw',
              videoType: 'youtube',
              duration: '11:20',
              completed: false
            }
          ]
        },
        {
          title: 'Advanced Topics',
          description: 'Advanced concepts and future trends',
          videos: [
            {
              title: 'DeFi and Smart Contracts',
              description: 'Decentralized Finance and smart contract technology',
              type: 'VIDEO',
              content: 'https://www.youtube.com/watch?v=1YyAzVmP9xQ',
              videoUrl: 'https://www.youtube.com/watch?v=1YyAzVmP9xQ',
              videoType: 'youtube',
              duration: '15:30',
              completed: false
            },
            {
              title: 'NFTs and Digital Assets',
              description: 'Non-Fungible Tokens and digital asset ownership',
              type: 'VIDEO',
              content: 'https://www.youtube.com/watch?v=SSo_EIwHSd4',
              videoUrl: 'https://www.youtube.com/watch?v=SSo_EIwHSd4',
              videoType: 'youtube',
              duration: '13:45',
              completed: false
            },
            {
              title: 'Future of Cryptocurrency',
              description: 'Emerging trends and future developments',
              type: 'VIDEO',
              content: 'https://www.youtube.com/watch?v=Gc2i6L0xqpw',
              videoUrl: 'https://www.youtube.com/watch?v=Gc2i6L0xqpw',
              videoType: 'youtube',
              duration: '14:20',
              completed: false
            }
          ]
        }
      ]
    });

    // Save the course
    await cryptoVideoCourse.save();
    console.log('✅ Cryptocurrency Mastery course created successfully!');
    console.log('📊 Course ID:', cryptoVideoCourse._id);
    console.log('📚 Chapters:', cryptoVideoCourse.chapters.length);
    console.log('🎥 Total Videos:', cryptoVideoCourse.chapters.reduce((total, chapter) => total + chapter.videos.length, 0));

    // Verify the course was created
    const savedCourse = await Course.findById(cryptoVideoCourse._id);
    console.log('🔍 Verification - Course title:', savedCourse.title);
    console.log('🔍 Verification - Chapters count:', savedCourse.chaptersCount);
    console.log('🔍 Verification - Videos count:', savedCourse.videosCount);

  } catch (error) {
    console.error('❌ Error creating Cryptocurrency Mastery course:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
}

// Run the script
createCryptoPdfCourse();
