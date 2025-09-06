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
        let newThumbnail = null;
        
        // Check if current thumbnail is broken
        if (!course.thumbnail || 
            course.thumbnail.includes('localhost') ||
            course.thumbnail.includes('thumbnail-1757149540281') ||
            course.thumbnail.includes('thumbnail-1757147736443') ||
            course.thumbnail.includes('thumbnail-1757145203292') ||
            course.thumbnail.includes('thumbnail-1757131752515') ||
            course.thumbnail.includes('thumbnail-1757137507882') ||
            course.thumbnail.includes('thumbnail-1757129780508')) {
          
          // Assign appropriate thumbnail based on course content
          if (course.title.toLowerCase().includes('crypto') || 
              course.category.toLowerCase().includes('crypto') ||
              course.title.toLowerCase().includes('bitcoin') ||
              course.title.toLowerCase().includes('trading')) {
            newThumbnail = '/uploads/crypto-thumbnail-1.jpg';
          } else if (course.title.toLowerCase().includes('web') ||
                     course.title.toLowerCase().includes('development') ||
                     course.title.toLowerCase().includes('react') ||
                     course.title.toLowerCase().includes('javascript')) {
            newThumbnail = '/uploads/crypto-thumbnail-2.jpg';
          } else if (course.title.toLowerCase().includes('finance') ||
                     course.title.toLowerCase().includes('investment') ||
                     course.title.toLowerCase().includes('money')) {
            newThumbnail = '/uploads/crypto-thumbnail-3.jpg';
          } else if (course.title.toLowerCase().includes('blockchain') ||
                     course.title.toLowerCase().includes('defi') ||
                     course.title.toLowerCase().includes('nft')) {
            newThumbnail = '/uploads/crypto-thumbnail-4.jpg';
          } else {
            newThumbnail = '/uploads/default-course-thumbnail.jpg';
          }
          
          // Update the course
          await Course.findByIdAndUpdate(course._id, {
            thumbnail: newThumbnail
          });
          
          console.log(`✅ Fixed course "${course.title}" with thumbnail: ${newThumbnail}`);
          fixedCount++;
        } else {
          console.log(`✅ Course "${course.title}" already has valid thumbnail: ${course.thumbnail}`);
        }
      } catch (error) {
        console.error(`❌ Error processing course "${course.title}":`, error.message);
        errorCount++;
      }
    }
    
    console.log('\n🎉 Emergency thumbnail fix completed!');
    console.log(`✅ Fixed: ${fixedCount} courses`);
    console.log(`❌ Errors: ${errorCount} courses`);
    
    // Test the API endpoint
    console.log('\n🧪 Testing API endpoint...');
    const testCourses = await Course.find({ status: 'published' }).limit(3);
    testCourses.forEach(course => {
      console.log(`📋 Course: "${course.title}"`);
      console.log(`   Thumbnail: ${course.thumbnail}`);
    });
    
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
