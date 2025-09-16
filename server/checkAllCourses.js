const mongoose = require('mongoose');
const Community = require('./models/Community.model');
const Course = require('./models/Course.model');

// MongoDB connection string
const MONGODB_URI = process.env.MONGO_URI || 'mongodb+srv://premarch567:reGzH94BB9DmqLPJ@cluster0.lyzxobt.mongodb.net/saas-lms-admin?retryWrites=true&w=majority&appName=Cluster0';

async function checkAllCourses() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully!');

    console.log('\n🔍 Checking ALL courses in database...\n');

    // Get all courses with their community information
    const courses = await Course.find({})
      .populate('community', 'name _id')
      .sort({ createdAt: -1 });

    console.log(`📚 Total courses found: ${courses.length}`);
    
    if (courses.length > 0) {
      console.log('\n📋 All Courses with Community Details:');
      console.log('='.repeat(100));
      console.log(`${'Course ID'.padEnd(25)} | ${'Title'.padEnd(25)} | ${'Community'.padEnd(25)} | ${'Status'.padEnd(10)} | ${'Created'}`);
      console.log('-'.repeat(100));
      
      courses.forEach(course => {
        const courseId = course._id.toString();
        const title = course.title || 'Untitled';
        const communityName = course.community ? course.community.name : 'No Community';
        const communityId = course.community ? course.community._id.toString() : 'N/A';
        const status = course.status || 'unknown';
        const createdDate = course.createdAt ? course.createdAt.toISOString().split('T')[0] : 'Unknown';
        
        console.log(
          `${courseId.padEnd(25)} | ${title.padEnd(25)} | ${communityName.padEnd(25)} | ${status.padEnd(10)} | ${createdDate}`
        );
      });
      console.log('-'.repeat(100));

      // Group courses by community
      const coursesByCommunity = {};
      courses.forEach(course => {
        const communityName = course.community ? course.community.name : 'No Community';
        if (!coursesByCommunity[communityName]) {
          coursesByCommunity[communityName] = [];
        }
        coursesByCommunity[communityName].push(course);
      });

      console.log('\n📊 Courses grouped by Community:');
      Object.entries(coursesByCommunity).forEach(([communityName, communityCourses]) => {
        console.log(`\n🏢 ${communityName}: ${communityCourses.length} courses`);
        communityCourses.forEach(course => {
          console.log(`   - ${course.title} (${course.status})`);
        });
      });

    } else {
      console.log('❌ No courses found in the entire database');
    }

    // Also check if there are any courses with community IDs that don't match existing communities
    console.log('\n🔍 Checking for orphaned courses...');
    const allCommunities = await Community.find({}, { _id: 1, name: 1 });
    const communityIds = allCommunities.map(c => c._id.toString());
    
    const orphanedCourses = await Course.find({
      community: { $nin: allCommunities.map(c => c._id) }
    });

    if (orphanedCourses.length > 0) {
      console.log(`⚠️  Found ${orphanedCourses.length} orphaned courses (courses with invalid community references):`);
      orphanedCourses.forEach(course => {
        console.log(`   - ${course.title} (Community ID: ${course.community})`);
      });
    } else {
      console.log('✅ No orphaned courses found');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the script
checkAllCourses();
