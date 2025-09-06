const mongoose = require('mongoose');
const Community = require('./models/Community.model');
const Course = require('./models/Course.model');
const Student = require('./models/Student.model');
const User = require('./models/User.model');

// MongoDB connection string
const MONGODB_URI = process.env.MONGO_URI || 'mongodb+srv://premarch567:Z6qcWJ8m6iv4ZqRW@cluster0.lyzxobt.mongodb.net/saas-lms-admin?retryWrites=true&w=majority&appName=Cluster0';

async function dropTestCommunity() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully!');

    console.log('\n🗑️  Dropping Test Community and all associated data...\n');

    const testCommunityId = '68bae05ab5603323d61220a8';

    // First, let's see what we're about to delete
    console.log('🔍 Analyzing Test Community data...');
    
    const testCommunity = await Community.findById(testCommunityId);
    if (!testCommunity) {
      console.log('❌ Test Community not found!');
      return;
    }

    console.log(`📋 Test Community Details:`);
    console.log(`   Name: ${testCommunity.name}`);
    console.log(`   Status: ${testCommunity.status}`);
    console.log(`   Created: ${testCommunity.createdAt}`);
    console.log(`   Owner Email: ${testCommunity.ownerEmail}`);

    // Count associated data
    const courseCount = await Course.countDocuments({ community: testCommunityId });
    const studentCount = await Student.countDocuments({ community: testCommunityId });
    const userCount = await User.countDocuments({ community: testCommunityId });

    console.log(`\n📊 Associated Data:`);
    console.log(`   Courses: ${courseCount}`);
    console.log(`   Students: ${studentCount}`);
    console.log(`   Users: ${userCount}`);

    if (courseCount > 0) {
      console.log(`\n📚 Courses to be deleted:`);
      const courses = await Course.find({ community: testCommunityId }, { title: 1, status: 1 });
      courses.forEach(course => {
        console.log(`   - ${course.title} (${course.status})`);
      });
    }

    // Confirmation prompt (in a real scenario, you'd want user confirmation)
    console.log(`\n⚠️  WARNING: This will permanently delete:`);
    console.log(`   - Test Community (${testCommunity.name})`);
    console.log(`   - ${courseCount} courses`);
    console.log(`   - ${studentCount} students`);
    console.log(`   - ${userCount} users`);
    console.log(`\n🔄 Proceeding with deletion...`);

    // Delete in order to respect foreign key constraints
    console.log(`\n1️⃣ Deleting courses...`);
    const deletedCourses = await Course.deleteMany({ community: testCommunityId });
    console.log(`   ✅ Deleted ${deletedCourses.deletedCount} courses`);

    console.log(`\n2️⃣ Deleting students...`);
    const deletedStudents = await Student.deleteMany({ community: testCommunityId });
    console.log(`   ✅ Deleted ${deletedStudents.deletedCount} students`);

    console.log(`\n3️⃣ Deleting users...`);
    const deletedUsers = await User.deleteMany({ community: testCommunityId });
    console.log(`   ✅ Deleted ${deletedUsers.deletedCount} users`);

    console.log(`\n4️⃣ Deleting community...`);
    const deletedCommunity = await Community.findByIdAndDelete(testCommunityId);
    if (deletedCommunity) {
      console.log(`   ✅ Deleted community: ${deletedCommunity.name}`);
    } else {
      console.log(`   ❌ Failed to delete community`);
    }

    // Verify deletion
    console.log(`\n🔍 Verifying deletion...`);
    const remainingCommunity = await Community.findById(testCommunityId);
    const remainingCourses = await Course.countDocuments({ community: testCommunityId });
    const remainingStudents = await Student.countDocuments({ community: testCommunityId });
    const remainingUsers = await User.countDocuments({ community: testCommunityId });

    if (!remainingCommunity && remainingCourses === 0 && remainingStudents === 0 && remainingUsers === 0) {
      console.log(`✅ SUCCESS: Test Community and all associated data deleted successfully!`);
    } else {
      console.log(`⚠️  WARNING: Some data may still remain:`);
      console.log(`   Community: ${remainingCommunity ? 'Still exists' : 'Deleted'}`);
      console.log(`   Courses: ${remainingCourses}`);
      console.log(`   Students: ${remainingStudents}`);
      console.log(`   Users: ${remainingUsers}`);
    }

    // Show remaining communities
    console.log(`\n📋 Remaining communities:`);
    const remainingCommunities = await Community.find({}, { _id: 1, name: 1, status: 1 });
    remainingCommunities.forEach(community => {
      console.log(`   - ${community.name} (${community._id}) - ${community.status}`);
    });

  } catch (error) {
    console.error('❌ Error during deletion:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the deletion
dropTestCommunity();
