const mongoose = require('mongoose');
const Course = require('./models/Course.model');

// MongoDB connection
const MONGODB_URI = process.env.MONGO_URI || 'mongodb+srv://premarch567:Z6qcWJ8m6iv4ZqRW@cluster0.lyzxobt.mongodb.net/saas-lms-admin?retryWrites=true&w=majority&appName=Cluster0';

async function fixCourseContent() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find all courses
    const courses = await Course.find({});
    console.log(`📚 Found ${courses.length} courses to check`);

    let updatedCount = 0;

    for (const course of courses) {
      let courseUpdated = false;
      const updatedChapters = course.chapters.map(chapter => {
        const updatedVideos = chapter.videos.map(video => {
          // Check if video has the problematic sample PDF content
          if (video.content === '/sample-lorem-ipsum.pdf' || 
              video.videoUrl === '/sample-lorem-ipsum.pdf' ||
              (video.content && video.content.includes('sample-lorem-ipsum.pdf')) ||
              (video.videoUrl && video.videoUrl.includes('sample-lorem-ipsum.pdf'))) {
            
            console.log(`🔧 Fixing content for video: ${video.title} in course: ${course.title}`);
            
            // Replace with proper YouTube video content
            const updatedVideo = {
              ...video,
              content: 'https://www.youtube.com/watch?v=1YyAzVmP9xQ',
              videoUrl: 'https://www.youtube.com/watch?v=1YyAzVmP9xQ',
              videoType: 'youtube',
              type: 'VIDEO',
              duration: video.duration || '10:00'
            };
            
            courseUpdated = true;
            return updatedVideo;
          }
          return video;
        });

        return {
          ...chapter,
          videos: updatedVideos
        };
      });

      if (courseUpdated) {
        // Update the course with fixed content
        await Course.findByIdAndUpdate(course._id, {
          chapters: updatedChapters
        });
        
        console.log(`✅ Updated course: ${course.title}`);
        updatedCount++;
      }
    }

    console.log(`🎉 Fixed content for ${updatedCount} courses`);
    console.log('✅ All courses now have proper video content instead of sample PDFs');

  } catch (error) {
    console.error('❌ Error fixing course content:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
}

// Run the script
fixCourseContent();
