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
    
    for (let i = 0; i < courses.length; i++) {
      const course = courses[i];
      try {
        // Check if thumbnail is broken (404 or localhost or non-existent files)
        const isBroken = !course.thumbnail || 
                        course.thumbnail.includes('localhost') ||
                        course.thumbnail.includes('thumbnail-1757149540281') ||
                        course.thumbnail.includes('thumbnail-1757147736443') ||
                        course.thumbnail.includes('thumbnail-1757145203292') ||
                        course.thumbnail.includes('thumbnail-1757149540281') ||
                        course.thumbnail.includes('thumbnail-1757147736443') ||
                        course.thumbnail.includes('thumbnail-1757145203292') ||
                        course.thumbnail.includes('thumbnail-1757149540281') ||
                        course.thumbnail.includes('thumbnail-1757147736443') ||
                        course.thumbnail.includes('thumbnail-1757145203292');
        
        if (isBroken) {
          // Assign a random available thumbnail
          const randomThumbnail = availableThumbnails[Math.floor(Math.random() * availableThumbnails.length)];
          
          await Course.findByIdAndUpdate(course._id, {
            thumbnail: randomThumbnail
          });
          
          console.log(`✅ Fixed course "${course.title}" - assigned ${randomThumbnail}`);
          fixedCount++;
        } else {
          console.log(`⏭️  Course "${course.title}" already has valid thumbnail: ${course.thumbnail}`);
        }
      } catch (error) {
        console.error(`❌ Error fixing course "${course.title}":`, error.message);
        errorCount++;
      }
    }
    
    console.log(`\n🎉 EMERGENCY FIX COMPLETE!`);
    console.log(`✅ Fixed: ${fixedCount} courses`);
    console.log(`❌ Errors: ${errorCount} courses`);
    console.log(`📊 Total: ${courses.length} courses`);
    
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
