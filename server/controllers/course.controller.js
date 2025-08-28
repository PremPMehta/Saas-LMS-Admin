const Course = require('../models/Course.model');
const User = require('../models/User.model');
const Community = require('../models/Community.model');

// Create a new course
exports.createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      targetAudience,
      contentType,
      thumbnail,
      chapters,
      tags,
      requirements,
      learningOutcomes,
      price,
      isFree
    } = req.body;

    // Get instructor and community from authenticated user
    const instructor = req.user.id;
    let communityId;
    
    // Check if this is a community user or regular user
    if (req.user.type === 'community') {
      // For community authentication, use the community ID directly
      communityId = req.user.communityId;
    } else {
      // For regular user authentication, get community from user record
      const user = await User.findById(instructor);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      communityId = user.community || req.body.community;
    }

    // Clean and validate chapters data
    const cleanChapters = (chapters || []).map(chapter => ({
      ...chapter,
      videos: (chapter.videos || []).map(video => ({
        ...video,
        videoUrl: video.videoUrl || 'https://example.com/placeholder-video', // Provide default if empty
        videoType: video.videoType || 'youtube',
        duration: video.duration || '0:00',
        order: video.order || 0
      }))
    }));

    // Create the course
    const course = new Course({
      title,
      description,
      category,
      targetAudience,
      contentType,
      thumbnail,
      chapters: cleanChapters,
      instructor,
      community: communityId,
      tags: tags || [],
      requirements: requirements || [],
      learningOutcomes: learningOutcomes || [],
      price: price || 0,
      isFree: isFree !== undefined ? isFree : true
    });

    const savedCourse = await course.save();
    
    // Populate instructor and community details
    await savedCourse.populate('instructor', 'name email');
    await savedCourse.populate('community', 'name');

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      course: savedCourse
    });

  } catch (error) {
    console.error('Error creating course:', error);
    
    // Provide more detailed error information
    if (error.name === 'ValidationError') {
      const validationErrors = Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating course',
      error: error.message
    });
  }
};

// Get all courses for a community
exports.getCourses = async (req, res) => {
  try {
    const { community, status, category, instructor } = req.query;
    const filter = {};

    if (community) filter.community = community;
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (instructor) filter.instructor = instructor;

    const courses = await Course.find(filter)
      .populate('instructor', 'name email')
      .populate('community', 'name')
      .populate('students', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      courses,
      count: courses.length
    });

  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching courses',
      error: error.message
    });
  }
};

// Get a single course by ID
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name email')
      .populate('community', 'name')
      .populate('students', 'name email');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.status(200).json({
      success: true,
      course
    });

  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching course',
      error: error.message
    });
  }
};

// Update a course
exports.updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const updateData = req.body;

    // Remove fields that shouldn't be updated directly
    delete updateData.instructor;
    delete updateData.community;
    delete updateData.students;

    const course = await Course.findByIdAndUpdate(
      courseId,
      updateData,
      { new: true, runValidators: true }
    ).populate('instructor', 'name email')
     .populate('community', 'name');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      course
    });

  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating course',
      error: error.message
    });
  }
};

// Delete a course
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting course',
      error: error.message
    });
  }
};

// Publish a course
exports.publishCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'published',
        publishedAt: new Date()
      },
      { new: true }
    ).populate('instructor', 'name email')
     .populate('community', 'name');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Course published successfully',
      course
    });

  } catch (error) {
    console.error('Error publishing course:', error);
    res.status(500).json({
      success: false,
      message: 'Error publishing course',
      error: error.message
    });
  }
};

// Enroll a student in a course
exports.enrollStudent = async (req, res) => {
  try {
    const { courseId, studentId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if student is already enrolled
    if (course.students.includes(studentId)) {
      return res.status(400).json({
        success: false,
        message: 'Student is already enrolled in this course'
      });
    }

    course.students.push(studentId);
    await course.save();

    res.status(200).json({
      success: true,
      message: 'Student enrolled successfully'
    });

  } catch (error) {
    console.error('Error enrolling student:', error);
    res.status(500).json({
      success: false,
      message: 'Error enrolling student',
      error: error.message
    });
  }
};

// Rate a course
exports.rateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { rating, studentId } = req.body;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Update rating (this is a simplified version - you might want to store individual ratings)
    const newTotalRatings = course.totalRatings + 1;
    const newRating = ((course.rating * course.totalRatings) + rating) / newTotalRatings;

    course.rating = newRating;
    course.totalRatings = newTotalRatings;
    await course.save();

    res.status(200).json({
      success: true,
      message: 'Course rated successfully',
      course: {
        rating: course.rating,
        totalRatings: course.totalRatings
      }
    });

  } catch (error) {
    console.error('Error rating course:', error);
    res.status(500).json({
      success: false,
      message: 'Error rating course',
      error: error.message
    });
  }
};
