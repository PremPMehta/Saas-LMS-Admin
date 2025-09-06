const mongoose = require('mongoose');
const Community = require('./models/Community.model');
const Course = require('./models/Course.model');

// MongoDB connection string
const MONGODB_URI = process.env.MONGO_URI || 'mongodb+srv://premarch567:Z6qcWJ8m6iv4ZqRW@cluster0.lyzxobt.mongodb.net/saas-lms-admin?retryWrites=true&w=majority&appName=Cluster0';

async function checkCryptoManjiCourses() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully!');

    console.log('\n🔍 Checking Crypto Manji Academy courses...\n');

    // Find Crypto Manji Academy community
    const cryptoManjiCommunity = await Community.findOne({
      name: { $regex: /crypto.*manji/i }
    });

    if (!cryptoManjiCommunity) {
      console.log('❌ Crypto Manji Academy community not found.');
      
      // Let's list all communities to see what's available
      console.log('\n📋 All communities in database:');
      const allCommunities = await Community.find({}, { _id: 1, name: 1, status: 1 });
      allCommunities.forEach(community => {
        console.log(`   - ${community.name} (ID: ${community._id}, Status: ${community.status})`);
      });
      return;
    }

    console.log(`✅ Found Crypto Manji Academy community:`);
    console.log(`   ID: ${cryptoManjiCommunity._id}`);
    console.log(`   Name: ${cryptoManjiCommunity.name}`);
    console.log(`   Status: ${cryptoManjiCommunity.status}`);
    console.log(`   Stored courseCount: ${cryptoManjiCommunity.courseCount}`);

    // Get all courses for this community
    const courses = await Course.find({ 
      community: cryptoManjiCommunity._id 
    }, {
      _id: 1,
      title: 1,
      status: 1,
      createdAt: 1
    }).sort({ createdAt: -1 });

    console.log(`\n📚 Actual courses found: ${courses.length}`);
    
    if (courses.length > 0) {
      console.log('\n📋 Course Details:');
      console.log('='.repeat(80));
      console.log(`${'ID'.padEnd(25)} | ${'Title'.padEnd(30)} | ${'Status'.padEnd(10)} | ${'Created'}`);
      console.log('-'.repeat(80));
      
      courses.forEach(course => {
        const courseId = course._id.toString();
        const title = course.title || 'Untitled';
        const status = course.status || 'unknown';
        const createdDate = course.createdAt ? course.createdAt.toISOString().split('T')[0] : 'Unknown';
        
        console.log(
          `${courseId.padEnd(25)} | ${title.padEnd(30)} | ${status.padEnd(10)} | ${createdDate}`
        );
      });
      console.log('-'.repeat(80));
    } else {
      console.log('❌ No courses found for Crypto Manji Academy');
    }

    // Check course counts by status
    const publishedCount = await Course.countDocuments({ 
      community: cryptoManjiCommunity._id,
      status: 'published'
    });
    
    const draftCount = await Course.countDocuments({ 
      community: cryptoManjiCommunity._id,
      status: 'draft'
    });

    const totalCount = await Course.countDocuments({ 
      community: cryptoManjiCommunity._id
    });

    console.log(`\n📊 Course Count Breakdown:`);
    console.log(`   Published: ${publishedCount}`);
    console.log(`   Drafts: ${draftCount}`);
    console.log(`   Total: ${totalCount}`);

    // Check if there's a mismatch between stored courseCount and actual count
    if (cryptoManjiCommunity.courseCount !== totalCount) {
      console.log(`\n⚠️  MISMATCH DETECTED:`);
      console.log(`   Stored courseCount: ${cryptoManjiCommunity.courseCount}`);
      console.log(`   Actual course count: ${totalCount}`);
      console.log(`   Difference: ${totalCount - cryptoManjiCommunity.courseCount}`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the script
checkCryptoManjiCourses();
