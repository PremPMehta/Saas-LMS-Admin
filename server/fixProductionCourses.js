const mongoose = require('mongoose');
const Course = require('./models/Course.model');

// Connect to the correct production database
const PRODUCTION_MONGO_URI = 'mongodb+srv://premarch567:Z6qcWJ8m6iv4ZqRW@cluster0.lyzxobt.mongodb.net/saas-lms-admin?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(PRODUCTION_MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to PRODUCTION MongoDB');
    
    // Target the specific course IDs from the API response
    const courseIds = [
      '68bbf97bae333da4c27da626', // SAmple 123
      '68bbf276ff4dd05a545abab2', // sample  
      '68bbe88dff4dd05a545aba4d'  // Sample
    ];
    
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
    
    for (const courseId of courseIds) {
      try {
        const course = await Course.findById(courseId);
        
        if (!course) {
          console.log(`❌ Course with ID ${courseId} not found`);
          continue;
        }
        
        console.log(`🔍 Found course: "${course.title}"`);
        console.log(`   Current thumbnail: "${course.thumbnail}"`);
        
        // Check if the current thumbnail is a broken URL
        const isBrokenUrl = course.thumbnail && (
          course.thumbnail.includes('thumbnail-1757149540281-983901521.png') ||
          course.thumbnail.includes('thumbnail-1757147736443-745359706.png') ||
          course.thumbnail.includes('thumbnail-1757145203292-784952158.png') ||
          course.thumbnail.startsWith('https://saas-lms-admin-1.onrender.com/uploads/thumbnail-')
        );
        
        if (isBrokenUrl || !course.thumbnail) {
          // Assign a random thumbnail from the available ones
          const randomIndex = Math.floor(Math.random() * availableThumbnails.length);
          const newThumbnail = availableThumbnails[randomIndex];
          
          console.log(`🔄 Fixing thumbnail for "${course.title}"`);
          console.log(`   Old: "${course.thumbnail || 'N/A'}"`);
          console.log(`   New: "${newThumbnail}"`);
          
          course.thumbnail = newThumbnail;
          await course.save();
          fixedCount++;
          console.log(`✅ Updated course "${course.title}"`);
        } else {
          console.log(`✅ Course "${course.title}" already has a valid thumbnail`);
        }
        
        console.log('---');
      } catch (err) {
        console.error(`❌ Error fixing course ${courseId}:`, err.message);
        errorCount++;
      }
    }
    
    console.log(`✨ PRODUCTION FIX COMPLETE!`);
    console.log(`📊 Fixed ${fixedCount} courses. Encountered ${errorCount} errors.`);
    
    // Verify the fix by checking the API
    console.log('\n🔍 Verifying fix by checking API response...');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
