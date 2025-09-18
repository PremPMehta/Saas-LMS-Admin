const mongoose = require('mongoose');
const Industry = require('./models/Industry.model');
const TargetAudience = require('./models/TargetAudience.model');
const User = require('./models/User.model');
require('dotenv').config();

const seedIndustriesAndAudiences = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Get admin user
    const adminUser = await User.findOne({ email: 'admin@multi-admin.com' });
    if (!adminUser) {
      console.log('Admin user not found. Please run seed.js first.');
      return;
    }

    // Clear existing data
    await Industry.deleteMany({});
    await TargetAudience.deleteMany({});
    console.log('Cleared existing industries and target audiences');

    // Seed Industries one by one
    const industries = [
      {
        name: 'Technology',
        description: 'Software development, IT services, and digital innovation',
        icon: 'computer',
        color: '#0F3C60',
        sortOrder: 1,
        createdBy: adminUser._id
      },
      {
        name: 'Healthcare',
        description: 'Medical, pharmaceutical, and health services',
        icon: 'local_hospital',
        color: '#d32f2f',
        sortOrder: 2,
        createdBy: adminUser._id
      },
      {
        name: 'Finance',
        description: 'Banking, investment, and financial services',
        icon: 'account_balance',
        color: '#388e3c',
        sortOrder: 3,
        createdBy: adminUser._id
      },
      {
        name: 'Education',
        description: 'Schools, universities, and training institutions',
        icon: 'school',
        color: '#7b1fa2',
        sortOrder: 4,
        createdBy: adminUser._id
      },
      {
        name: 'Marketing',
        description: 'Digital marketing, advertising, and brand management',
        icon: 'trending_up',
        color: '#f57c00',
        sortOrder: 5,
        createdBy: adminUser._id
      },
      {
        name: 'Design',
        description: 'Graphic design, UI/UX, and creative services',
        icon: 'palette',
        color: '#c2185b',
        sortOrder: 6,
        createdBy: adminUser._id
      },
      {
        name: 'Sales',
        description: 'Sales, business development, and customer relations',
        icon: 'people',
        color: '#0F3C60',
        sortOrder: 7,
        createdBy: adminUser._id
      },
      {
        name: 'Consulting',
        description: 'Business consulting and advisory services',
        icon: 'business',
        color: '#388e3c',
        sortOrder: 8,
        createdBy: adminUser._id
      },
      {
        name: 'Manufacturing',
        description: 'Production, manufacturing, and industrial services',
        icon: 'build',
        color: '#f57c00',
        sortOrder: 9,
        createdBy: adminUser._id
      },
      {
        name: 'Retail',
        description: 'E-commerce, retail, and consumer goods',
        icon: 'shopping_cart',
        color: '#7b1fa2',
        sortOrder: 10,
        createdBy: adminUser._id
      },
      {
        name: 'Real Estate',
        description: 'Property, construction, and real estate services',
        icon: 'home',
        color: '#388e3c',
        sortOrder: 11,
        createdBy: adminUser._id
      },
      {
        name: 'Entertainment',
        description: 'Media, entertainment, and creative industries',
        icon: 'movie',
        color: '#c2185b',
        sortOrder: 12,
        createdBy: adminUser._id
      },
      {
        name: 'Non-profit',
        description: 'Charitable organizations and social impact',
        icon: 'volunteer_activism',
        color: '#d32f2f',
        sortOrder: 13,
        createdBy: adminUser._id
      },
      {
        name: 'Government',
        description: 'Public sector and government services',
        icon: 'account_balance',
        color: '#0F3C60',
        sortOrder: 14,
        createdBy: adminUser._id
      },
      {
        name: 'Other',
        description: 'Other industries and sectors',
        icon: 'more_horiz',
        color: '#757575',
        sortOrder: 15,
        createdBy: adminUser._id
      }
    ];

    console.log('Creating industries...');
    for (const industryData of industries) {
      try {
        await Industry.create(industryData);
        console.log(`✅ Created industry: ${industryData.name}`);
      } catch (error) {
        console.log(`⚠️  Industry ${industryData.name} already exists or error: ${error.message}`);
      }
    }

    // Seed Target Audiences one by one
    const targetAudiences = [
      {
        name: 'Student',
        description: 'Students pursuing education and learning',
        category: 'Student',
        icon: 'school',
        color: '#0F3C60',
        sortOrder: 1,
        createdBy: adminUser._id
      },
      {
        name: 'Professional',
        description: 'Working professionals in various industries',
        category: 'Professional',
        icon: 'work',
        color: '#388e3c',
        sortOrder: 2,
        createdBy: adminUser._id
      },
      {
        name: 'Entrepreneur',
        description: 'Business owners and startup founders',
        category: 'Entrepreneur',
        icon: 'business',
        color: '#f57c00',
        sortOrder: 3,
        createdBy: adminUser._id
      },
      {
        name: 'Freelancer',
        description: 'Independent contractors and freelancers',
        category: 'Freelancer',
        icon: 'person',
        color: '#7b1fa2',
        sortOrder: 4,
        createdBy: adminUser._id
      },
      {
        name: 'Teacher/Instructor',
        description: 'Educators and training professionals',
        category: 'Teacher/Instructor',
        icon: 'person_add',
        color: '#d32f2f',
        sortOrder: 5,
        createdBy: adminUser._id
      },
      {
        name: 'Manager',
        description: 'Team leaders and management professionals',
        category: 'Manager',
        icon: 'supervisor_account',
        color: '#0F3C60',
        sortOrder: 6,
        createdBy: adminUser._id
      },
      {
        name: 'Developer',
        description: 'Software developers and programmers',
        category: 'Developer',
        icon: 'code',
        color: '#388e3c',
        sortOrder: 7,
        createdBy: adminUser._id
      },
      {
        name: 'Designer',
        description: 'Creative professionals and designers',
        category: 'Designer',
        icon: 'palette',
        color: '#c2185b',
        sortOrder: 8,
        createdBy: adminUser._id
      },
      {
        name: 'Marketing Specialist',
        description: 'Marketing and advertising professionals',
        category: 'Marketing Specialist',
        icon: 'trending_up',
        color: '#f57c00',
        sortOrder: 9,
        createdBy: adminUser._id
      },
      {
        name: 'Other',
        description: 'Other professional roles and categories',
        category: 'Other',
        icon: 'more_horiz',
        color: '#757575',
        sortOrder: 10,
        createdBy: adminUser._id
      }
    ];

    console.log('Creating target audiences...');
    for (const audienceData of targetAudiences) {
      try {
        await TargetAudience.create(audienceData);
        console.log(`✅ Created target audience: ${audienceData.name}`);
      } catch (error) {
        console.log(`⚠️  Target audience ${audienceData.name} already exists or error: ${error.message}`);
      }
    }

    // Get final counts
    const industryCount = await Industry.countDocuments();
    const audienceCount = await TargetAudience.countDocuments();

    console.log('✅ Industries and Target Audiences seeded successfully!');
    console.log(`📊 Created ${industryCount} industries and ${audienceCount} target audiences`);

  } catch (error) {
    console.error('❌ Error seeding industries and audiences:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the seeding
seedIndustriesAndAudiences();
