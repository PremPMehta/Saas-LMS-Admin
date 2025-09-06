const mongoose = require('mongoose');
const Course = require('./models/Course.model');
require('dotenv').config();

const checkCourses = async () => {
  try {
    console.log('🔍 Checking courses in database...');
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    
    const courses = await Course.find({});
    console.log(`\n📊 Found ${courses.length} courses in database`);
    
    if (courses.length > 0) {
      courses.forEach((course, index) => {
        console.log(`\n${index + 1}. Course: ${course.title}`);
        console.log(`   ID: ${course._id}`);
        console.log(`   Status: ${course.status}`);
        console.log(`   Community: ${course.community}`);
        console.log(`   Instructor: ${course.instructor}`);
        console.log(`   Chapters: ${course.chapters?.length || 0}`);
        console.log(`   Videos: ${course.chapters?.reduce((total, ch) => total + (ch.videos?.length || 0), 0) || 0}`);
      });
    } else {
      console.log('❌ No courses found in database');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

checkCourses();
