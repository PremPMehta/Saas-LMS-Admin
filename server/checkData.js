const mongoose = require('mongoose');
const Course = require('./models/Course.model');
const Community = require('./models/Community.model');
const CommunityAdmin = require('./models/CommunityAdmin.model');
const Academy = require('./models/Academy.model');
require('dotenv').config();

const checkAllData = async () => {
  try {
    console.log('🔍 Checking all your data...');
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    
    // Check Courses
    const courses = await Course.find({});
    console.log(`\n📚 COURSES: ${courses.length}`);
    if (courses.length > 0) {
      courses.slice(0, 5).forEach((course, index) => {
        console.log(`   ${index + 1}. ${course.title} (${course.status})`);
      });
      if (courses.length > 5) console.log(`   ... and ${courses.length - 5} more`);
    }
    
    // Check Communities
    const communities = await Community.find({});
    console.log(`\n🏘️ COMMUNITIES: ${communities.length}`);
    communities.forEach((community, index) => {
      console.log(`   ${index + 1}. ${community.name} (${community.status}) - ${community.ownerEmail}`);
    });
    
    // Check Community Admins
    const communityAdmins = await CommunityAdmin.find({});
    console.log(`\n👨‍💼 COMMUNITY ADMINS: ${communityAdmins.length}`);
    communityAdmins.forEach((admin, index) => {
      console.log(`   ${index + 1}. ${admin.name} (${admin.email}) - ${admin.role}`);
    });
    
    // Check Academies
    const academies = await Academy.find({});
    console.log(`\n🎓 ACADEMIES: ${academies.length}`);
    academies.forEach((academy, index) => {
      console.log(`   ${index + 1}. ${academy.name} (${academy.status})`);
    });
    
    console.log('\n=== SUMMARY ===');
    console.log(`📊 Total Data: ${courses.length} courses, ${communities.length} communities, ${communityAdmins.length} admins, ${academies.length} academies`);
    
  } catch (error) {
    console.error('❌ Error checking data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

checkAllData();
