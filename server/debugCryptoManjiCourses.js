const mongoose = require('mongoose');
const Community = require('./models/Community.model');
const Course = require('./models/Course.model');

// MongoDB connection string
const MONGODB_URI = process.env.MONGO_URI || 'mongodb+srv://premarch567:Z6qcWJ8m6iv4ZqRW@cluster0.lyzxobt.mongodb.net/saas-lms-admin?retryWrites=true&w=majority&appName=Cluster0';

async function debugCryptoManjiCourses() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully!');

    console.log('\n🔍 Debugging Crypto Manji Academy courses...\n');

    // Method 1: Find by exact name match
    console.log('1️⃣ Searching by exact name "Crypto Manji Academy"...');
    const exactMatch = await Community.findOne({ name: 'Crypto Manji Academy' });
    if (exactMatch) {
      console.log(`   ✅ Found: ${exactMatch._id} - ${exactMatch.name}`);
    } else {
      console.log('   ❌ No exact match found');
    }

    // Method 2: Find by case-insensitive regex
    console.log('\n2️⃣ Searching by case-insensitive regex...');
    const regexMatch = await Community.find({ name: { $regex: /crypto.*manji/i } });
    console.log(`   Found ${regexMatch.length} communities:`);
    regexMatch.forEach(community => {
      console.log(`   - ${community._id} - ${community.name} (${community.status})`);
    });

    // Method 3: Find by partial name match
    console.log('\n3️⃣ Searching by partial name "manji"...');
    const partialMatch = await Community.find({ name: { $regex: /manji/i } });
    console.log(`   Found ${partialMatch.length} communities:`);
    partialMatch.forEach(community => {
      console.log(`   - ${community._id} - ${community.name} (${community.status})`);
    });

    // Method 4: Get ALL communities and check manually
    console.log('\n4️⃣ All communities in database:');
    const allCommunities = await Community.find({}, { _id: 1, name: 1, status: 1, createdAt: 1 });
    allCommunities.forEach(community => {
      console.log(`   - ${community._id} - "${community.name}" (${community.status}) - Created: ${community.createdAt.toISOString().split('T')[0]}`);
    });

    // Method 5: Check if there are multiple Crypto Manji communities
    console.log('\n5️⃣ Checking for multiple Crypto Manji communities...');
    const cryptoCommunities = allCommunities.filter(c => 
      c.name.toLowerCase().includes('crypto') || 
      c.name.toLowerCase().includes('manji')
    );
    
    if (cryptoCommunities.length > 0) {
      console.log(`   Found ${cryptoCommunities.length} crypto-related communities:`);
      cryptoCommunities.forEach(community => {
        console.log(`   - ${community._id} - "${community.name}" (${community.status})`);
        
        // Check courses for each crypto community
        Course.countDocuments({ community: community._id })
          .then(count => {
            console.log(`     📚 Courses: ${count}`);
          });
      });
    }

    // Method 6: Check the specific courses mentioned in the frontend
    console.log('\n6️⃣ Checking specific courses from frontend...');
    const frontendCourseTitles = ['Sample', 'sample', 'SAmple 123'];
    
    for (const title of frontendCourseTitles) {
      const courses = await Course.find({ title: { $regex: new RegExp(title, 'i') } })
        .populate('community', 'name _id');
      
      console.log(`   Courses matching "${title}":`);
      courses.forEach(course => {
        const communityName = course.community ? course.community.name : 'No Community';
        const communityId = course.community ? course.community._id.toString() : 'N/A';
        console.log(`     - ${course._id} - "${course.title}" -> Community: ${communityName} (${communityId})`);
      });
    }

    // Method 7: Check if there's a different database or collection
    console.log('\n7️⃣ Database and collection info:');
    console.log(`   Database: ${mongoose.connection.db.databaseName}`);
    console.log(`   Collections: ${(await mongoose.connection.db.listCollections().toArray()).map(c => c.name).join(', ')}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the script
debugCryptoManjiCourses();
