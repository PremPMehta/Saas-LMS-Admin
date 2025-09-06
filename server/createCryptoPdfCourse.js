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

    // Create the Crypto PDF course
    const cryptoPdfCourse = new Course({
      title: 'Crypto PDF',
      description: 'Comprehensive cryptocurrency learning materials in PDF format',
      thumbnail: 'https://via.placeholder.com/300x200/34a853/ffffff?text=Crypto+PDF',
      status: 'published',
      community: community._id,
      category: 'Cryptocurrency',
      targetAudience: 'Beginners to Advanced',
      contentType: 'text', // Using 'text' since 'pdf' is not in enum
      instructor: community._id, // Using community ID as instructor for now
      chapters: [
        {
          title: 'Cryptocurrency Fundamentals',
          description: 'Basic concepts and understanding of digital currencies',
          videos: [
            {
              title: 'Introduction to Cryptocurrency',
              description: 'What is cryptocurrency and how does it work?',
              type: 'PDF',
              content: '/sample-lorem-ipsum.pdf', // Local PDF file for testing
              duration: 'PDF Document',
              completed: false
            },
            {
              title: 'Blockchain Technology Explained',
              description: 'Understanding the technology behind cryptocurrencies',
              type: 'PDF',
              content: '/sample-lorem-ipsum.pdf', // Local PDF file for testing
              duration: 'PDF Document',
              completed: false
            },
            {
              title: 'Bitcoin Basics',
              description: 'The first and most popular cryptocurrency',
              type: 'PDF',
              content: '/sample-lorem-ipsum.pdf', // Local PDF file for testing
              duration: 'PDF Document',
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
              type: 'PDF',
              content: '/sample-lorem-ipsum.pdf', // Local PDF file for testing
              duration: 'PDF Document',
              completed: false
            },
            {
              title: 'Risk Management in Crypto',
              description: 'How to manage risks when investing in cryptocurrencies',
              type: 'PDF',
              content: '/sample-lorem-ipsum.pdf', // Local PDF file for testing
              duration: 'PDF Document',
              completed: false
            },
            {
              title: 'Portfolio Diversification',
              description: 'Building a diversified cryptocurrency portfolio',
              type: 'PDF',
              content: '/sample-lorem-ipsum.pdf', // Local PDF file for testing
              duration: 'PDF Document',
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
              type: 'PDF',
              content: '/sample-lorem-ipsum.pdf', // Local PDF file for testing
              duration: 'PDF Document',
              completed: false
            },
            {
              title: 'NFTs and Digital Assets',
              description: 'Non-Fungible Tokens and digital asset ownership',
              type: 'PDF',
              content: '/sample-lorem-ipsum.pdf', // Local PDF file for testing
              duration: 'PDF Document',
              completed: false
            },
            {
              title: 'Future of Cryptocurrency',
              description: 'Emerging trends and future developments',
              type: 'PDF',
              content: '/sample-lorem-ipsum.pdf', // Local PDF file for testing
              duration: 'PDF Document',
              completed: false
            }
          ]
        }
      ]
    });

    // Save the course
    await cryptoPdfCourse.save();
    console.log('✅ Crypto PDF course created successfully!');
    console.log('📊 Course ID:', cryptoPdfCourse._id);
    console.log('📚 Chapters:', cryptoPdfCourse.chapters.length);
    console.log('📄 Total PDFs:', cryptoPdfCourse.chapters.reduce((total, chapter) => total + chapter.videos.length, 0));

    // Verify the course was created
    const savedCourse = await Course.findById(cryptoPdfCourse._id);
    console.log('🔍 Verification - Course title:', savedCourse.title);
    console.log('🔍 Verification - Chapters count:', savedCourse.chaptersCount);
    console.log('🔍 Verification - Videos count:', savedCourse.videosCount);

  } catch (error) {
    console.error('❌ Error creating Crypto PDF course:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
}

// Run the script
createCryptoPdfCourse();
