const mongoose = require('mongoose');
const Plan = require('./models/Plan.model');
const User = require('./models/User.model');
require('dotenv').config();

const seedPlans = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Get admin user for createdBy field
    const adminUser = await User.findOne({ email: 'admin@bbrtek.com' });
    if (!adminUser) {
      console.log('Admin user not found. Please run seed.js first.');
      return;
    }

    // Check if plans already exist
    const existingPlans = await Plan.find();
    if (existingPlans.length > 0) {
      console.log('Plans already exist in database');
      return;
    }

    // Create default plans
    const defaultPlans = [
      {
        name: 'Basic',
        price: '$29',
        period: 'month',
        features: [
          'Up to 100 students',
          'Basic analytics',
          'Email support',
          'Standard templates'
        ],
        limits: '1 academy',
        maxAcademies: 1,
        maxStudentsPerAcademy: 100,
        maxEducatorsPerAcademy: 5,
        status: 'Active',
        popular: false,
        createdBy: adminUser._id
      },
      {
        name: 'Standard',
        price: '$79',
        period: 'month',
        features: [
          'Up to 500 students',
          'Advanced analytics',
          'Priority support',
          'Custom branding',
          'API access'
        ],
        limits: '3 academies',
        maxAcademies: 3,
        maxStudentsPerAcademy: 500,
        maxEducatorsPerAcademy: 20,
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
          'API access',
          'Custom integrations',
          'Dedicated account manager'
        ],
        limits: 'Unlimited academies',
        maxAcademies: 999999, // Unlimited
        maxStudentsPerAcademy: 999999, // Unlimited
        maxEducatorsPerAcademy: 999999, // Unlimited
        status: 'Active',
        popular: false,
        createdBy: adminUser._id
      }
    ];

    // Insert plans
    await Plan.insertMany(defaultPlans);
    console.log('✅ Default plans created successfully');
    console.log('📋 Plans created:');
    defaultPlans.forEach(plan => {
      console.log(`   - ${plan.name}: ${plan.price}/${plan.period}`);
    });

  } catch (error) {
    console.error('❌ Error seeding plans:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

seedPlans(); 