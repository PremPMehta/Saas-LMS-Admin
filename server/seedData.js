const mongoose = require('mongoose');
const Academy = require('./models/Academy.model');
const Plan = require('./models/Plan.model');
const User = require('./models/User.model');
require('dotenv').config();

const seedData = async () => {
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
    await Academy.deleteMany({});
    await Plan.deleteMany({});
    console.log('Cleared existing academies and plans');

    // Seed Plans
    const plans = [
      {
        name: 'Basic',
        price: '$29',
        period: 'month',
        features: [
          'Up to 100 students',
          'Basic analytics',
          'Email support',
          '5GB storage',
          'Basic themes'
        ],
        limits: '1 academy, 100 students',
        maxAcademies: 1,
        maxStudentsPerAcademy: 100,
        maxEducatorsPerAcademy: 5,
        status: 'Active',
        popular: false,
        createdBy: adminUser._id
      },
      {
        name: 'Pro',
        price: '$79',
        period: 'month',
        features: [
          'Up to 500 students',
          'Advanced analytics',
          'Priority support',
          'Custom branding',
          '50GB storage',
          'Advanced themes',
          'API access'
        ],
        limits: '3 academies, 500 students each',
        maxAcademies: 3,
        maxStudentsPerAcademy: 500,
        maxEducatorsPerAcademy: 25,
        status: 'Active',
        popular: true,
        createdBy: adminUser._id
      },
      {
        name: 'Premium',
        price: '$199',
        period: 'month',
        features: [
          'Unlimited students',
          'Full analytics suite',
          '24/7 support',
          'White-label solution',
          'Unlimited storage',
          'Custom themes',
          'Full API access',
          'Advanced integrations'
        ],
        limits: 'Unlimited academies and students',
        maxAcademies: 999,
        maxStudentsPerAcademy: 999999,
        maxEducatorsPerAcademy: 999,
        status: 'Active',
        popular: false,
        createdBy: adminUser._id
      }
    ];

    const savedPlans = await Plan.insertMany(plans);
    console.log(`Created ${savedPlans.length} plans`);

    // Seed Academies
    const academies = [
      {
        name: 'Tech Academy Pro',
        description: 'Leading technology education platform',
        address: '123 Silicon Valley Blvd, San Francisco, CA 94105, USA',
        contactName: 'John Smith',
        contactNumber: '+1234567890',
        countryCode: 'US',
        subdomain: 'techacademy',
        fullDomain: 'techacademy.bbrtek-lms.com',
        logo: 'https://ui-avatars.com/api/?name=Tech+Academy&background=1976d2&color=fff&size=200',
        subscriptionPlan: 'Premium',
        maxStudents: 500,
        maxEducators: 25,
        status: 'Active',
        students: 450,
        courses: 35,
        createdBy: adminUser._id
      },
      {
        name: 'Digital Learning Hub',
        description: 'Comprehensive digital education solutions',
        address: '456 Education Ave, New York, NY 10001, USA',
        contactName: 'Sarah Johnson',
        contactNumber: '+1234567891',
        countryCode: 'US',
        subdomain: 'digitallearning',
        fullDomain: 'digitallearning.bbrtek-lms.com',
        logo: 'https://ui-avatars.com/api/?name=Digital+Learning&background=9c27b0&color=fff&size=200',
        subscriptionPlan: 'Premium',
        maxStudents: 1000,
        maxEducators: 50,
        status: 'Active',
        students: 780,
        courses: 42,
        createdBy: adminUser._id
      },
      {
        name: 'Future Skills Institute',
        description: 'Preparing students for tomorrow\'s challenges',
        address: '789 Innovation Dr, Austin, TX 73301, USA',
        contactName: 'Michael Brown',
        contactNumber: '+1234567892',
        countryCode: 'US',
        subdomain: 'futureskills',
        fullDomain: 'futureskills.bbrtek-lms.com',
        logo: 'https://ui-avatars.com/api/?name=Future+Skills&background=4caf50&color=fff&size=200',
        subscriptionPlan: 'Basic',
        maxStudents: 100,
        maxEducators: 5,
        status: 'Active',
        students: 85,
        courses: 18,
        createdBy: adminUser._id
      },
      {
        name: 'Global Academy Network',
        description: 'International education platform',
        address: '321 Global Plaza, London, England SW1A 1AA, UK',
        contactName: 'Emma Wilson',
        contactNumber: '+44123456789',
        countryCode: 'UK',
        subdomain: 'globalacademy',
        fullDomain: 'globalacademy.bbrtek-lms.com',
        logo: 'https://ui-avatars.com/api/?name=Global+Academy&background=ff9800&color=fff&size=200',
        subscriptionPlan: 'Premium',
        maxStudents: 500,
        maxEducators: 25,
        status: 'Inactive',
        students: 320,
        courses: 28,
        createdBy: adminUser._id
      }
    ];

    const savedAcademies = await Academy.insertMany(academies);
    console.log(`Created ${savedAcademies.length} academies`);

    console.log('✅ Sample data seeded successfully!');
    console.log(`📊 Created ${savedPlans.length} plans and ${savedAcademies.length} academies`);

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the seeding
seedData();
