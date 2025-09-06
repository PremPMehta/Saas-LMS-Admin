const mongoose = require('mongoose');
const Community = require('./models/Community.model');
const Course = require('./models/Course.model');

// MongoDB connection string
const MONGODB_URI = process.env.MONGO_URI || 'mongodb+srv://premarch567:Z6qcWJ8m6iv4ZqRW@cluster0.lyzxobt.mongodb.net/saas-lms-admin?retryWrites=true&w=majority&appName=Cluster0';

async function migrateOrphanedCourses() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully!');

    console.log('\n🔄 Migrating orphaned courses to Crypto Manji Academy...\n');

    const oldCommunityId = '68b684467fd9b766dc7cc337';
    const newCommunityId = '68bae2a8807f3a3bb8ac6307';

    // Verify the new community exists
    const cryptoManjiCommunity = await Community.findById(newCommunityId);
    if (!cryptoManjiCommunity) {
      console.log('❌ Crypto Manji Academy community not found!');
      return;
    }

    console.log(`✅ Found Crypto Manji Academy: ${cryptoManjiCommunity.name}`);

    // Find orphaned courses
    const orphanedCourses = await Course.find({
      community: oldCommunityId
    });

    console.log(`📚 Found ${orphanedCourses.length} orphaned courses to migrate:`);
    orphanedCourses.forEach(course => {
      console.log(`   - ${course.title} (${course.status})`);
    });

    if (orphanedCourses.length === 0) {
      console.log('✅ No orphaned courses found to migrate.');
      return;
    }

    // Migrate the courses
    console.log('\n🔄 Migrating courses...');
    const updateResult = await Course.updateMany(
      { community: oldCommunityId },
      { community: newCommunityId }
    );

    console.log(`✅ Successfully migrated ${updateResult.modifiedCount} courses`);

    // Update the community's course count
    const newCourseCount = await Course.countDocuments({ 
      community: newCommunityId,
      status: { $in: ['published', 'draft'] }
    });

    await Community.findByIdAndUpdate(newCommunityId, {
      courseCount: newCourseCount
    });

    console.log(`✅ Updated Crypto Manji Academy course count to: ${newCourseCount}`);

    // Verify the migration
    console.log('\n🔍 Verifying migration...');
    const migratedCourses = await Course.find({ community: newCommunityId });
    console.log(`📚 Crypto Manji Academy now has ${migratedCourses.length} courses:`);
    migratedCourses.forEach(course => {
      console.log(`   - ${course.title} (${course.status})`);
    });

    console.log('\n✅ Migration completed successfully!');

  } catch (error) {
    console.error('❌ Error during migration:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the migration
migrateOrphanedCourses();
