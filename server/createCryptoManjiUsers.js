const mongoose = require('mongoose');
const Community = require('./models/Community.model');
const CommunityAdmin = require('./models/CommunityAdmin.model');
const Student = require('./models/Student.model');
require('dotenv').config();

const createCryptoManjiUsers = async () => {
  try {
    console.log('🚀 Creating Crypto Manji test users...');
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    
    // Find or create Crypto Manji community
    let community = await Community.findOne({ 
      $or: [
        { name: 'Crypto Manji' },
        { ownerEmail: 'owner@cryptomanji.com' }
      ]
    });
    
    if (!community) {
      console.log('🏘️ Creating Crypto Manji community...');
      community = new Community({
        name: 'Crypto Manji',
        description: 'Leading cryptocurrency education platform',
        category: 'Technology',
        ownerName: 'John Doe',
        ownerEmail: 'owner@cryptomanji.com',
        ownerPassword: 'password123',
        status: 'active',
        isVerified: true,
        features: {
          hasCourses: true,
          hasLiveSessions: true,
          hasDiscussions: true,
          hasCertificates: true,
          hasMentorship: false
        }
      });
      await community.save();
      console.log('✅ Crypto Manji community created:', community._id);
    } else {
      console.log('✅ Using existing Crypto Manji community:', community._id);
    }
    
    // Test users for Crypto Manji community
    const testUsers = [
      {
        // Community Admin 1
        name: 'Alice Johnson',
        email: 'alice@cryptomanji.com',
        phone: '+1-555-0101',
        password: 'Crypto123!',
        role: 'admin',
        permissions: {
          canCreateCourses: true,
          canEditCourses: true,
          canDeleteCourses: true
        }
      },
      {
        // Community Admin 2
        name: 'Bob Smith',
        email: 'bob@cryptomanji.com',
        phone: '+1-555-0102',
        password: 'Crypto123!',
        role: 'moderator',
        permissions: {
          canCreateCourses: true,
          canEditCourses: true,
          canDeleteCourses: false
        }
      },
      {
        // Student User
        name: 'Charlie Brown',
        email: 'charlie@cryptomanji.com',
        phone: '+1-555-0103',
        password: 'Crypto123!',
        role: 'student'
      }
    ];
    
    console.log('\n👥 Creating test users...');
    
    for (const userData of testUsers) {
      try {
        if (userData.role === 'student') {
          // Create Student
          const existingStudent = await Student.findOne({ email: userData.email });
          if (existingStudent) {
            console.log(`⚠️ Student ${userData.name} already exists`);
            continue;
          }
          
          const student = new Student({
            firstName: userData.name.split(' ')[0],
            lastName: userData.name.split(' ')[1] || '',
            email: userData.email,
            password: userData.password,
            phoneNumber: userData.phone,
            countryCode: '+1',
            currentRole: 'Professional',
            industry: 'Finance',
            experienceLevel: 'Intermediate',
            interests: ['Cryptocurrency', 'Trading', 'Blockchain'],
            enrolledCommunities: [{
              communityId: community._id,
              enrolledAt: new Date(),
              status: 'active'
            }],
            isProfileComplete: true,
            status: 'active'
          });
          
          await student.save();
          console.log(`✅ Student created: ${userData.name} (${userData.email})`);
          
        } else {
          // Create Community Admin
          const existingAdmin = await CommunityAdmin.findOne({ email: userData.email });
          if (existingAdmin) {
            console.log(`⚠️ Admin ${userData.name} already exists`);
            continue;
          }
          
          const admin = new CommunityAdmin({
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            password: userData.password,
            communityId: community._id,
            role: userData.role,
            permissions: userData.permissions,
            status: 'active'
          });
          
          await admin.save();
          console.log(`✅ Community Admin created: ${userData.name} (${userData.email})`);
        }
        
      } catch (userError) {
        console.error(`❌ Error creating user ${userData.name}:`, userError.message);
      }
    }
    
    // Update community member count
    const studentCount = await Student.countDocuments({
      'enrolledCommunities.communityId': community._id
    });
    const adminCount = await CommunityAdmin.countDocuments({
      communityId: community._id
    });
    
    community.memberCount = studentCount + adminCount;
    await community.save();
    
    console.log('\n📊 Crypto Manji Community Summary:');
    console.log(`   Community ID: ${community._id}`);
    console.log(`   Community Name: ${community.name}`);
    console.log(`   Total Members: ${community.memberCount}`);
    console.log(`   Students: ${studentCount}`);
    console.log(`   Admins: ${adminCount}`);
    
    console.log('\n🔑 Test User Credentials:');
    console.log('=== COMMUNITY OWNER ===');
    console.log(`Email: owner@cryptomanji.com`);
    console.log(`Password: password123`);
    console.log(`Role: Community Owner`);
    
    console.log('\n=== COMMUNITY ADMINS ===');
    console.log(`Email: alice@cryptomanji.com`);
    console.log(`Password: Crypto123!`);
    console.log(`Role: Admin (Full Access)`);
    
    console.log(`\nEmail: bob@cryptomanji.com`);
    console.log(`Password: Crypto123!`);
    console.log(`Role: Moderator (Limited Access)`);
    
    console.log('\n=== STUDENT USER ===');
    console.log(`Email: charlie@cryptomanji.com`);
    console.log(`Password: Crypto123!`);
    console.log(`Role: Student`);
    
    console.log('\n🌐 Community URL Structure:');
    console.log(`Community Name: ${community.name.toLowerCase().replace(/\s+/g, '-')}`);
    console.log(`Suggested URL: /crypto-manji/dashboard`);
    console.log(`Login URL: /crypto-manji/login`);
    
  } catch (error) {
    console.error('❌ Error creating Crypto Manji users:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
};

createCryptoManjiUsers();
