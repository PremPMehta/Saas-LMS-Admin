const mongoose = require('mongoose');
const Course = require('./models/Course.model');
const Community = require('./models/Community.model');
require('dotenv').config();

const createCryptoFinanceCourses = async () => {
  try {
    console.log('🚀 Creating Crypto & Finance courses...');
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    
    // Get the community ID (using Prem Test Community)
    const community = await Community.findOne({ ownerEmail: 'prem@gmail.com' });
    if (!community) {
      console.log('❌ Community not found. Please create a community first.');
      return;
    }
    
    console.log(`🏘️ Using community: ${community.name} (${community._id})`);
    
    // Course 1: Cryptocurrency Mastery
    const cryptoCourse = new Course({
      title: 'Cryptocurrency Mastery: From Beginner to Expert',
      description: 'Master the world of cryptocurrencies with this comprehensive course covering Bitcoin, Ethereum, DeFi, and blockchain technology. Learn trading strategies, security best practices, and investment fundamentals.',
      category: 'Finance',
      targetAudience: 'Intermediate',
      contentType: 'video',
      status: 'published',
      publishedAt: new Date(),
      thumbnail: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=300&fit=crop',
      instructor: community._id, // Using community as instructor
      community: community._id,
      students: [],
      rating: 4.8,
      totalRatings: 127,
      price: 0,
      isFree: true,
      tags: ['cryptocurrency', 'bitcoin', 'ethereum', 'blockchain', 'defi', 'trading'],
      requirements: [
        'Basic understanding of financial markets',
        'Computer with internet connection',
        'Willingness to learn new concepts'
      ],
      learningOutcomes: [
        'Understand blockchain technology fundamentals',
        'Master cryptocurrency trading strategies',
        'Learn DeFi protocols and yield farming',
        'Implement security best practices',
        'Analyze market trends and patterns'
      ],
      chapters: [
        {
          title: 'Introduction to Cryptocurrencies',
          description: 'Learn the basics of digital currencies and blockchain technology',
          order: 0,
          videos: [
            {
              title: 'What is Cryptocurrency?',
              description: 'Introduction to digital currencies and their benefits',
              videoUrl: 'https://www.youtube.com/watch?v=1YyAzVmP9xQ',
              videoType: 'youtube',
              duration: '8:45',
              order: 0
            },
            {
              title: 'Blockchain Technology Explained',
              description: 'Understanding the technology behind cryptocurrencies',
              videoUrl: 'https://www.youtube.com/watch?v=SSo_EIwHSd4',
              videoType: 'youtube',
              duration: '12:30',
              order: 1
            }
          ]
        },
        {
          title: 'Bitcoin Fundamentals',
          description: 'Deep dive into the world\'s first cryptocurrency',
          order: 1,
          videos: [
            {
              title: 'Bitcoin: Digital Gold',
              description: 'Why Bitcoin is considered digital gold',
              videoUrl: 'https://www.youtube.com/watch?v=41JCpzvnn_0',
              videoType: 'youtube',
              duration: '15:20',
              order: 0
            },
            {
              title: 'Bitcoin Mining Process',
              description: 'How Bitcoin mining works and its importance',
              videoUrl: 'https://vimeo.com/123456789',
              videoType: 'vimeo',
              duration: '18:15',
              order: 1
            }
          ]
        },
        {
          title: 'Ethereum and Smart Contracts',
          description: 'Understanding Ethereum and programmable money',
          order: 2,
          videos: [
            {
              title: 'Ethereum vs Bitcoin',
              description: 'Key differences between the two major cryptocurrencies',
              videoUrl: 'https://www.youtube.com/watch?v=0UBk1e5qmr4',
              videoType: 'youtube',
              duration: '14:30',
              order: 0
            },
            {
              title: 'Smart Contracts Explained',
              description: 'How smart contracts work on Ethereum',
              videoUrl: 'https://vimeo.com/987654321',
              videoType: 'vimeo',
              duration: '16:45',
              order: 1
            }
          ]
        },
        {
          title: 'DeFi and Yield Farming',
          description: 'Decentralized Finance and earning passive income',
          order: 3,
          videos: [
            {
              title: 'Introduction to DeFi',
              description: 'What is Decentralized Finance?',
              videoUrl: 'https://www.youtube.com/watch?v=H-O0QtsL6V0',
              videoType: 'youtube',
              duration: '13:20',
              order: 0
            },
            {
              title: 'Yield Farming Strategies',
              description: 'Advanced strategies for earning yield in DeFi',
              videoUrl: 'https://vimeo.com/456789123',
              videoType: 'vimeo',
              duration: '22:10',
              order: 1
            }
          ]
        },
        {
          title: 'Trading and Investment',
          description: 'Practical trading strategies and investment advice',
          order: 4,
          videos: [
            {
              title: 'Technical Analysis Basics',
              description: 'Reading charts and identifying patterns',
              videoUrl: 'https://www.youtube.com/watch?v=RTn77uCYU_8',
              videoType: 'youtube',
              duration: '19:30',
              order: 0
            },
            {
              title: 'Risk Management in Crypto',
              description: 'Protecting your investments and managing risk',
              videoUrl: 'https://vimeo.com/789123456',
              videoType: 'vimeo',
              duration: '17:25',
              order: 1
            }
          ]
        }
      ]
    });
    
    // Course 2: Personal Finance Mastery
    const financeCourse = new Course({
      title: 'Personal Finance Mastery: Build Wealth and Financial Freedom',
      description: 'Transform your financial future with this comprehensive course on budgeting, investing, saving, and building wealth. Learn practical strategies used by millionaires and financial experts.',
      category: 'Finance',
      targetAudience: 'Beginners',
      contentType: 'video',
      status: 'published',
      publishedAt: new Date(),
      thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop',
      instructor: community._id,
      community: community._id,
      students: [],
      rating: 4.9,
      totalRatings: 203,
      price: 0,
      isFree: true,
      tags: ['personal finance', 'investing', 'budgeting', 'saving', 'wealth building', 'financial planning'],
      requirements: [
        'No prior financial knowledge required',
        'Open mind and willingness to learn',
        'Basic math skills'
      ],
      learningOutcomes: [
        'Create and stick to a personal budget',
        'Build an emergency fund',
        'Understand different investment options',
        'Plan for retirement effectively',
        'Manage debt and improve credit score'
      ],
      chapters: [
        {
          title: 'Financial Foundation',
          description: 'Building a solid financial foundation for success',
          order: 0,
          videos: [
            {
              title: 'Why Financial Education Matters',
              description: 'The importance of financial literacy in today\'s world',
              videoUrl: 'https://www.youtube.com/watch?v=Gc2i6L0xqpw',
              videoType: 'youtube',
              duration: '9:15',
              order: 0
            },
            {
              title: 'Setting Financial Goals',
              description: 'How to set and achieve your financial goals',
              videoUrl: 'https://vimeo.com/111222333',
              videoType: 'vimeo',
              duration: '11:30',
              order: 1
            }
          ]
        },
        {
          title: 'Budgeting and Saving',
          description: 'Master the art of budgeting and saving money',
          order: 1,
          videos: [
            {
              title: '50/30/20 Budget Rule',
              description: 'Simple budgeting method that works',
              videoUrl: 'https://www.youtube.com/watch?v=Uzji2n6V0Gg',
              videoType: 'youtube',
              duration: '12:45',
              order: 0
            },
            {
              title: 'Automating Your Savings',
              description: 'Set up automatic savings to build wealth',
              videoUrl: 'https://vimeo.com/222333444',
              videoType: 'vimeo',
              duration: '14:20',
              order: 1
            }
          ]
        },
        {
          title: 'Emergency Fund and Insurance',
          description: 'Protecting yourself from financial emergencies',
          order: 2,
          videos: [
            {
              title: 'Building Your Emergency Fund',
              description: 'How much to save and where to keep it',
              videoUrl: 'https://www.youtube.com/watch?v=JAfYOjqjLhI',
              videoType: 'youtube',
              duration: '13:10',
              order: 0
            },
            {
              title: 'Insurance Basics',
              description: 'Understanding different types of insurance',
              videoUrl: 'https://vimeo.com/333444555',
              videoType: 'vimeo',
              duration: '16:35',
              order: 1
            }
          ]
        },
        {
          title: 'Investing Fundamentals',
          description: 'Getting started with investing and building wealth',
          order: 3,
          videos: [
            {
              title: 'Investing for Beginners',
              description: 'Understanding stocks, bonds, and mutual funds',
              videoUrl: 'https://www.youtube.com/watch?v=0TCAUElAsVY',
              videoType: 'youtube',
              duration: '18:20',
              order: 0
            },
            {
              title: 'Dollar-Cost Averaging',
              description: 'Smart investment strategy for beginners',
              videoUrl: 'https://vimeo.com/444555666',
              videoType: 'vimeo',
              duration: '15:45',
              order: 1
            }
          ]
        },
        {
          title: 'Retirement Planning',
          description: 'Securing your financial future',
          order: 4,
          videos: [
            {
              title: '401(k) and IRA Basics',
              description: 'Understanding retirement accounts',
              videoUrl: 'https://www.youtube.com/watch?v=WfaRqtLqN6E',
              videoType: 'youtube',
              duration: '16:30',
              order: 0
            },
            {
              title: 'Social Security Explained',
              description: 'How Social Security works and when to claim',
              videoUrl: 'https://vimeo.com/555666777',
              videoType: 'vimeo',
              duration: '19:15',
              order: 1
            }
          ]
        }
      ]
    });
    
    // Save both courses
    const savedCryptoCourse = await cryptoCourse.save();
    const savedFinanceCourse = await financeCourse.save();
    
    console.log('✅ Courses created successfully!');
    console.log('\n📚 Course 1: Cryptocurrency Mastery');
    console.log(`   ID: ${savedCryptoCourse._id}`);
    console.log(`   Chapters: ${savedCryptoCourse.chapters.length}`);
    console.log(`   Videos: ${savedCryptoCourse.chapters.reduce((total, ch) => total + ch.videos.length, 0)}`);
    
    console.log('\n💰 Course 2: Personal Finance Mastery');
    console.log(`   ID: ${savedFinanceCourse._id}`);
    console.log(`   Chapters: ${savedFinanceCourse.chapters.length}`);
    console.log(`   Videos: ${savedFinanceCourse.chapters.reduce((total, ch) => total + ch.videos.length, 0)}`);
    
    console.log('\n🎯 Total: 2 courses, 10 chapters, 20 videos');
    console.log('🚀 Your courses are now available in the system!');
    
  } catch (error) {
    console.error('❌ Error creating courses:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

createCryptoFinanceCourses();
