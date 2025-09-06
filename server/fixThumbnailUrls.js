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
      .filter(file => file.match(/\.(jpg|jpeg|png)$/i))
      .map(file => `/uploads/${file}`);
    
    console.log(`📁 Available thumbnails: ${availableThumbnails.length}`);
    console.log('Available files:', availableThumbnails.slice(0, 5));
    
    let fixedCount = 0;
    let errorCount = 0;
    
    for (const course of courses) {
      try {
        // Check if current thumbnail URL is broken
        if (course.thumbnail && course.thumbnail.includes('/uploads/')) {
          const filename = course.thumbnail.split('/').pop();
          const localPath = path.join(uploadsDir, filename);
          
          if (!fs.existsSync(localPath)) {
            console.log(`❌ Broken thumbnail for course "${course.title}": ${course.thumbnail}`);
            
            // Try to find a suitable replacement
            let replacementThumbnail = null;
            
            // First, try to find a crypto thumbnail
            if (course.title.toLowerCase().includes('crypto') || course.category.toLowerCase().includes('crypto')) {
              replacementThumbnail = '/uploads/crypto-thumbnail-1.jpg';
            } else {
              // Use default thumbnail
              replacementThumbnail = '/uploads/default-course-thumbnail.jpg';
            }
            
            // Update the course
            await Course.findByIdAndUpdate(course._id, {
              thumbnail: replacementThumbnail
            });
            
            console.log(`✅ Fixed course "${course.title}" with thumbnail: ${replacementThumbnail}`);
            fixedCount++;
          } else {
            console.log(`✅ Course "${course.title}" has valid thumbnail: ${course.thumbnail}`);
          }
        } else if (!course.thumbnail) {
          // Course has no thumbnail, assign default
          await Course.findByIdAndUpdate(course._id, {
            thumbnail: '/uploads/default-course-thumbnail.jpg'
          });
          console.log(`✅ Assigned default thumbnail to course "${course.title}"`);
          fixedCount++;
        }
      } catch (error) {
        console.error(`❌ Error processing course "${course.title}":`, error.message);
        errorCount++;
      }
    }
    
    console.log('\n🎉 Thumbnail fix completed!');
    console.log(`✅ Fixed: ${fixedCount} courses`);
    console.log(`❌ Errors: ${errorCount} courses`);
    
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
