const mongoose = require('mongoose');
const Course = require('./models/Course.model');

// Initialize course orders for existing courses
async function initializeCourseOrders() {
  try {
    console.log('🔄 Initializing course orders...');
    
    // Get all courses grouped by community
    const courses = await Course.find({}).sort({ community: 1, createdAt: 1 });
    
    const communityGroups = {};
    courses.forEach(course => {
      const communityId = course.community.toString();
      if (!communityGroups[communityId]) {
        communityGroups[communityId] = [];
      }
      communityGroups[communityId].push(course);
    });
    
    // Update order for each community
    for (const [communityId, communityCourses] of Object.entries(communityGroups)) {
      console.log(`📚 Processing community ${communityId} with ${communityCourses.length} courses`);
      
      for (let i = 0; i < communityCourses.length; i++) {
        const course = communityCourses[i];
        const newOrder = i + 1;
        
        if (course.order !== newOrder) {
          await Course.findByIdAndUpdate(course._id, { order: newOrder });
          console.log(`✅ Updated course "${course.title}" order to ${newOrder}`);
        }
      }
    }
    
    console.log('✅ Course order initialization completed');
    
  } catch (error) {
    console.error('❌ Error initializing course orders:', error);
  }
}

// Run if called directly
if (require.main === module) {
  // Connect to MongoDB
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/saas-lms-admin', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(async () => {
    console.log('🔗 Connected to MongoDB');
    await initializeCourseOrders();
    process.exit(0);
  }).catch(error => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });
}

module.exports = initializeCourseOrders;
