const mongoose = require('mongoose');
const Course = require('./models/Course.model');
const fs = require('fs');
const path = require('path');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://premarch567:Z6qcWJ8m6iv4ZqRW@cluster0.lyzxobt.mongodb.net/saasLmsAdmin?retryWrites=true&w=majority&appName=Cluster0')
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    
    // Get all courses
    const courses = await Course.find({});
    console.log(`📊 Found ${courses.length} courses to check`);
    
    // Get list of available thumbnail files
    const uploadsDir = path.join(__dirname, 'uploads');
    const availableThumbnails = fs.readdirSync(uploadsDir)
      .filter(file => file.match(/\.(jpg|jpeg|png)$/i));
    
    console.log(`📁 Available thumbnails: ${availableThumbnails.length}`);
    console.log('Available files:', availableThumbnails.slice(0, 5));
    
    let fixedCount = 0;
    let errorCount = 0;
    
    for (const course of courses) {
      try {
        let needsUpdate = false;
        let newThumbnail = course.thumbnail;
        
        if (!course.thumbnail || course.thumbnail.trim() === '') {
          // No thumbnail, assign default
          newThumbnail = '/uploads/default-course-thumbnail.jpg';
          needsUpdate = true;
          console.log(`❌ Course "${course.title}" has no thumbnail`);
        } else if (course.thumbnail.includes('localhost')) {
          // Localhost URL, convert to production URL
          const filename = course.thumbnail.split('/').pop();
          newThumbnail = `/uploads/${filename}`;
          needsUpdate = true;
          console.log(`❌ Course "${course.title}" has localhost URL: ${course.thumbnail}`);
        } else if (course.thumbnail.includes('/uploads/')) {
          // Check if the file actually exists
          const filename = course.thumbnail.split('/').pop();
          const localPath = path.join(uploadsDir, filename);
          
          if (!fs.existsSync(localPath)) {
            // File doesn't exist, assign default or crypto thumbnail
            if (course.title.toLowerCase().includes('crypto') || course.category.toLowerCase().includes('crypto')) {
              newThumbnail = '/uploads/crypto-thumbnail-1.jpg';
            } else {
              newThumbnail = '/uploads/default-course-thumbnail.jpg';
            }
            needsUpdate = true;
            console.log(`❌ Course "${course.title}" has broken thumbnail: ${course.thumbnail}`);
          }
        }
        
        if (needsUpdate) {
          await Course.findByIdAndUpdate(course._id, {
            thumbnail: newThumbnail
          });
          console.log(`✅ Fixed course "${course.title}" with thumbnail: ${newThumbnail}`);
          fixedCount++;
        } else {
          console.log(`✅ Course "${course.title}" has valid thumbnail: ${course.thumbnail}`);
        }
      } catch (error) {
        console.error(`❌ Error processing course "${course.title}":`, error.message);
        errorCount++;
      }
    }
    
    console.log('\n🎉 Thumbnail fix completed!');
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
