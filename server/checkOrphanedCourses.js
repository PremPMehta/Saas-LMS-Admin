const mongoose = require('mongoose');
const Community = require('./models/Community.model');
const Course = require('./models/Course.model');

// MongoDB connection string
const MONGODB_URI = process.env.MONGO_URI || 'mongodb+srv://premarch567:Z6qcWJ8m6iv4ZqRW@cluster0.lyzxobt.mongodb.net/saas-lms-admin?retryWrites=true&w=majority&appName=Cluster0';

async function checkOrphanedCourses() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully!');

    console.log('\n🔍 Investigating orphaned courses...\n');

    const orphanedCommunityId = '68b684467fd9b766dc7cc337';
    
    // Get the orphaned courses
    const orphanedCourses = await Course.find({
      community: orphanedCommunityId
    });

    console.log(`📚 Found ${orphanedCourses.length} orphaned courses with community ID: ${orphanedCommunityId}`);
    
    if (orphanedCourses.length > 0) {
      console.log('\n📋 Orphaned Course Details:');
      console.log('='.repeat(80));
      console.log(`${'Course ID'.padEnd(25)} | ${'Title'.padEnd(25)} | ${'Status'.padEnd(10)} | ${'Created'}`);
      console.log('-'.repeat(80));
      
      orphanedCourses.forEach(course => {
        const courseId = course._id.toString();
        const title = course.title || 'Untitled';
        const status = course.status || 'unknown';
        const createdDate = course.createdAt ? course.createdAt.toISOString().split('T')[0] : 'Unknown';
        
        console.log(
          `${courseId.padEnd(25)} | ${title.padEnd(25)} | ${status.padEnd(10)} | ${createdDate}`
        );
      });
      console.log('-'.repeat(80));
    }

    // Check if this community ID exists in any other collections or if it was deleted
    console.log('\n🔍 Checking if community ID exists anywhere...');
    
    // Check if there's a community with this ID (maybe it was deleted)
    const communityExists = await Community.findById(orphanedCommunityId);
    if (communityExists) {
      console.log(`✅ Community with ID ${orphanedCommunityId} exists:`);
      console.log(`   Name: ${communityExists.name}`);
      console.log(`   Status: ${communityExists.status}`);
    } else {
      console.log(`❌ Community with ID ${orphanedCommunityId} does not exist (likely deleted)`);
    }

    // Get current Crypto Manji Academy community
    const cryptoManjiCommunity = await Community.findOne({
      name: { $regex: /crypto.*manji/i }
    });

    if (cryptoManjiCommunity) {
      console.log(`\n🏢 Current Crypto Manji Academy:`);
      console.log(`   ID: ${cryptoManjiCommunity._id}`);
      console.log(`   Name: ${cryptoManjiCommunity.name}`);
      console.log(`   Status: ${cryptoManjiCommunity.status}`);
      
      // Check if we should migrate the orphaned courses to the current Crypto Manji Academy
      console.log(`\n💡 SUGGESTION: These orphaned courses likely belong to Crypto Manji Academy.`);
      console.log(`   You can migrate them by updating their community reference from:`);
      console.log(`   ${orphanedCommunityId} → ${cryptoManjiCommunity._id}`);
      
      console.log(`\n🔧 To fix this, you could run:`);
      console.log(`   await Course.updateMany(`);
      console.log(`     { community: ObjectId('${orphanedCommunityId}') },`);
      console.log(`     { community: ObjectId('${cryptoManjiCommunity._id}') }`);
      console.log(`   );`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the script
checkOrphanedCourses();
