const mongoose = require('mongoose');
const Course = require('./models/Course.model');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://premarch567:Z6qcWJ8m6iv4ZqRW@cluster0.lyzxobt.mongodb.net/saasLmsAdmin?retryWrites=true&w=majority&appName=Cluster0')
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    
    // Target the specific community ID from the frontend logs
    const communityId = '68bae2a8807f3a3bb8ac6307';
    
    // Get courses for this specific community
    const courses = await Course.find({ community: communityId });
    console.log(`📊 Found ${courses.length} courses for community ${communityId}`);
    
    let fixedCount = 0;
    let errorCount = 0;
    
    // Available thumbnails that actually exist on the server
    const availableThumbnails = [
      '/uploads/crypto-thumbnail-1.jpg',
      '/uploads/crypto-thumbnail-2.jpg', 
      '/uploads/crypto-thumbnail-3.jpg',
      '/uploads/crypto-thumbnail-4.jpg',
      '/uploads/crypto-thumbnail-5.jpg',
      '/uploads/default-course-thumbnail.jpg'
    ];
    
    for (const course of courses) {
      try {
        let needsUpdate = false;
        let currentThumbnail = course.thumbnail;
        
        console.log(`🔍 Checking course: "${course.title}"`);
        console.log(`   Current thumbnail: "${currentThumbnail}"`);
        
        // Check if the current thumbnail is a broken URL (contains the problematic pattern)
        const isBrokenUrl = currentThumbnail && (
          currentThumbnail.includes('thumbnail-1757149540281-983901521.png') ||
          currentThumbnail.includes('thumbnail-1757147736443-745359706.png') ||
          currentThumbnail.includes('thumbnail-1757145203292-784952158.png') ||
          currentThumbnail.startsWith('https://saas-lms-admin-1.onrender.com/uploads/thumbnail-')
        );
        
        if (isBrokenUrl || !currentThumbnail) {
          // Assign a random thumbnail from the available ones
          const randomIndex = Math.floor(Math.random() * availableThumbnails.length);
          const newThumbnail = availableThumbnails[randomIndex];
          course.thumbnail = newThumbnail;
          needsUpdate = true;
          console.log(`🔄 Fixing thumbnail for "${course.title}"`);
          console.log(`   Old: "${currentThumbnail || 'N/A'}"`);
          console.log(`   New: "${newThumbnail}"`);
        } else {
          console.log(`✅ Course "${course.title}" already has a valid thumbnail`);
        }
        
        if (needsUpdate) {
          await course.save();
          fixedCount++;
          console.log(`✅ Updated course "${course.title}"`);
        }
        
        console.log('---');
      } catch (err) {
        console.error(`❌ Error fixing course "${course.title}":`, err.message);
        errorCount++;
      }
    }
    
    console.log(`✨ Fix complete for community ${communityId}`);
    console.log(`📊 Fixed ${fixedCount} courses. Encountered ${errorCount} errors.`);
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
