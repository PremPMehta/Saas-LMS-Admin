const mongoose = require('mongoose');
const Course = require('./models/Course.model');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://premarch567:Z6qcWJ8m6iv4ZqRW@cluster0.lyzxobt.mongodb.net/saasLmsAdmin?retryWrites=true&w=majority&appName=Cluster0')
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    
    // Get all courses
    const courses = await Course.find({});
    console.log(`📊 Found ${courses.length} courses to fix`);
    
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
        
        // Check if the current thumbnail is one of the known good ones
        const isKnownGood = availableThumbnails.some(goodThumb => 
          currentThumbnail && currentThumbnail.includes(goodThumb)
        );
        
        if (!currentThumbnail || !isKnownGood) {
          // Assign a random thumbnail from the available ones
          const randomIndex = Math.floor(Math.random() * availableThumbnails.length);
          const newThumbnail = availableThumbnails[randomIndex];
          course.thumbnail = newThumbnail;
          needsUpdate = true;
          console.log(`🔄 Fixing thumbnail for "${course.title}". Old: "${currentThumbnail || 'N/A'}", New: "${newThumbnail}"`);
        }
        
        if (needsUpdate) {
          await course.save();
          fixedCount++;
        }
      } catch (err) {
        console.error(`❌ Error fixing course "${course.title}":`, err.message);
        errorCount++;
      }
    }
    
    console.log(`✨ Emergency fix complete. Fixed ${fixedCount} courses. Encountered ${errorCount} errors.`);
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
