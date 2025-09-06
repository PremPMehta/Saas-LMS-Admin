const mongoose = require('mongoose');
const Community = require('./models/Community.model');
const Course = require('./models/Course.model');

// MongoDB connection string
const MONGODB_URI = process.env.MONGO_URI || 'mongodb+srv://premarch567:Z6qcWJ8m6iv4ZqRW@cluster0.lyzxobt.mongodb.net/saas-lms-admin?retryWrites=true&w=majority&appName=Cluster0';

async function listCommunitiesWithCourses() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully!');

    console.log('\n📊 Fetching communities with course counts...\n');

    // Get all communities
    const communities = await Community.find({}, {
      _id: 1,
      name: 1,
      courseCount: 1,
      status: 1,
      createdAt: 1
    }).sort({ createdAt: -1 });

    if (communities.length === 0) {
      console.log('❌ No communities found in the database.');
      return;
    }

    console.log('='.repeat(80));
    console.log('📋 COMMUNITIES WITH COURSE COUNTS');
    console.log('='.repeat(80));
    console.log(`${'ID'.padEnd(25)} | ${'Name'.padEnd(30)} | ${'Courses'.padEnd(8)} | ${'Status'.padEnd(10)} | ${'Created'}`);
    console.log('-'.repeat(80));

    let totalCommunities = 0;
    let totalCourses = 0;

    for (const community of communities) {
      // Get actual course count from the Course collection
      const actualCourseCount = await Course.countDocuments({ 
        community: community._id,
        status: { $in: ['published', 'draft'] } // Count both published and draft courses
      });

      const communityId = community._id.toString();
      const communityName = community.name || 'Unnamed Community';
      const courseCount = actualCourseCount;
      const status = community.status || 'unknown';
      const createdDate = community.createdAt ? community.createdAt.toISOString().split('T')[0] : 'Unknown';

      console.log(
        `${communityId.padEnd(25)} | ${communityName.padEnd(30)} | ${courseCount.toString().padEnd(8)} | ${status.padEnd(10)} | ${createdDate}`
      );

      totalCommunities++;
      totalCourses += courseCount;
    }

    console.log('-'.repeat(80));
    console.log(`📊 SUMMARY:`);
    console.log(`   Total Communities: ${totalCommunities}`);
    console.log(`   Total Courses: ${totalCourses}`);
    console.log(`   Average Courses per Community: ${totalCommunities > 0 ? (totalCourses / totalCommunities).toFixed(2) : 0}`);
    console.log('='.repeat(80));

    // Additional detailed analysis
    console.log('\n🔍 DETAILED ANALYSIS:');
    
    // Communities with most courses
    const communitiesWithCourseCounts = await Promise.all(
      communities.map(async (community) => {
        const courseCount = await Course.countDocuments({ 
          community: community._id,
          status: { $in: ['published', 'draft'] }
        });
        return {
          id: community._id.toString(),
          name: community.name,
          courseCount,
          status: community.status
        };
      })
    );

    const topCommunities = communitiesWithCourseCounts
      .sort((a, b) => b.courseCount - a.courseCount)
      .slice(0, 5);

    console.log('\n🏆 TOP 5 COMMUNITIES BY COURSE COUNT:');
    topCommunities.forEach((community, index) => {
      console.log(`   ${index + 1}. ${community.name} (${community.courseCount} courses) - ${community.status}`);
    });

    // Status breakdown
    const statusBreakdown = communitiesWithCourseCounts.reduce((acc, community) => {
      acc[community.status] = (acc[community.status] || 0) + 1;
      return acc;
    }, {});

    console.log('\n📈 COMMUNITY STATUS BREAKDOWN:');
    Object.entries(statusBreakdown).forEach(([status, count]) => {
      console.log(`   ${status}: ${count} communities`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the script
listCommunitiesWithCourses();
