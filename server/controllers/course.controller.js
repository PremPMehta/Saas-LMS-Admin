const Course = require('../models/Course.model');
const User = require('../models/User.model');
const Community = require('../models/Community.model');
const pdfGenerator = require('../services/pdfGenerator');

// Helper function to process text content and generate PDF
const processTextContent = async (chapters, courseTitle) => {
  const processedChapters = [];
  
  for (const chapter of chapters) {
    const processedVideos = [];
    
    for (const video of chapter.videos) {
      let processedVideo = { ...video };
      
      // If this is a text-based video with HTML content, generate PDF
      if (video.content && video.content.trim() && 
          (video.contentType === 'write' || 
           (video.contentType === undefined && video.content.includes('<')))) {
        try {
          console.log(`📄 Generating PDF for video: ${video.title}`);
          
          const pdfResult = await pdfGenerator.generateAndSavePDF(
            video.content,
            {
              title: `${courseTitle} - ${video.title}`,
              pdfOptions: {
                format: 'A4',
                printBackground: true
              }
            }
          );
          
          // Update video content to point to the generated PDF
          processedVideo.content = pdfResult.url;
          processedVideo.contentType = 'pdf'; // Change type to PDF
          processedVideo.type = 'PDF'; // Set type to PDF for proper display
          processedVideo.generatedPDF = true; // Flag to indicate this was generated
          processedVideo.originalContent = video.content; // Keep original for editing
          
          console.log(`✅ PDF generated: ${pdfResult.filename}`);
          
        } catch (error) {
          console.error(`❌ Failed to generate PDF for video ${video.title}:`, error);
          // Keep original content if PDF generation fails
          processedVideo.content = video.content;
        }
      }
      
      processedVideos.push(processedVideo);
    }
    
    processedChapters.push({
      ...chapter,
      videos: processedVideos
    });
  }
  
  return processedChapters;
};

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
      isFree,
      community,
      status,
      publishedAt
    } = req.body;

    // Get instructor and community from authenticated user (or use defaults for testing)
    let instructor = req.user?.id;
    let communityId = req.user?.communityId;
    
    // PRIORITY: Use community from request body if provided
    if (community) {
      communityId = community;
      console.log('🎯 Using community from request body:', communityId);
    }
    
    // For testing purposes, use default values if no user is authenticated
    if (!instructor) {
      // Find the first available community to use as instructor
      const defaultCommunity = await Community.findOne({});
      instructor = defaultCommunity ? defaultCommunity._id : null;
      console.log('🔧 Using default instructor:', instructor);
    }
    if (!communityId) {
      // Find the first available community to use
      const defaultCommunity = await Community.findOne({});
      communityId = defaultCommunity ? defaultCommunity._id : null;
      console.log('🔧 Using default community:', communityId);
    }
    
    // SECURITY: Ensure proper community assignment
    if (req.user && req.user.type === 'community') {
      // For community authentication, use the community ID directly
      communityId = req.user.communityId;
      console.log('🔒 Security: Course assigned to community:', communityId);
    } else if (req.user) {
      // For regular user authentication, get community from user record
      const user = await User.findById(instructor);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      communityId = user.community || req.body.community;
    } else {
      // For testing purposes, allow course creation without authentication
      console.log('🔧 No authenticated user, using default community for testing');
    }

    // Ensure we have a valid community ID
    if (!communityId) {
      return res.status(400).json({
        success: false,
        message: 'No valid community found. Please contact administrator.'
      });
    }

    // Use the provided community ID (removed the "wrong community ID" check)
    console.log('✅ Using community ID:', communityId);

    // Clean and validate chapters data
    const cleanChapters = (chapters || []).map(chapter => ({
      ...chapter,
      videos: (chapter.videos || []).map(video => ({
        ...video,
        content: video.content || video.videoUrl || '', // Handle both content and videoUrl
        videoUrl: video.videoUrl || video.content || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Use a real YouTube video as default
        videoType: video.videoType || 'youtube',
        type: video.type || 'VIDEO', // Set type field
        duration: video.duration || '0:00',
        order: video.order || 0
      }))
    }));

    // Process text content and generate PDFs
    console.log('🔄 Processing text content for PDF generation...');
    const processedChapters = await processTextContent(cleanChapters, title);
    console.log('✅ Text content processing completed');

    // Debug logging
    console.log('📝 Creating course with data:', {
      title,
      community: communityId,
      status,
      publishedAt,
      instructor
    });

    // Set order to be the next available order for this community
    let order = 1;
    if (!req.body.order) {
      const lastCourse = await Course.findOne({ community: communityId })
        .sort({ order: -1 });
      order = lastCourse ? (lastCourse.order || 0) + 1 : 1;
    } else {
      order = req.body.order;
    }

    // Create the course
    const course = new Course({
      title,
      description,
      category,
      targetAudience,
      contentType,
      thumbnail,
      status: status || 'draft', // Set status from request body or default to draft
      publishedAt: status === 'published' ? (publishedAt ? new Date(publishedAt) : new Date()) : null, // Set publishedAt if status is published
      chapters: processedChapters,
      instructor,
      community: communityId,
      tags: tags || [],
      requirements: requirements || [],
      learningOutcomes: learningOutcomes || [],
      price: price || 0,
      isFree: isFree !== undefined ? isFree : true,
      order: order
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
    const { community, status, category, instructor, discovery } = req.query;
    const filter = {};

    // Check if this is a discovery request (public course listing)
    if (discovery === 'true') {
      // For discovery, only show published courses from all communities
      filter.status = 'published';
      console.log('🌍 Discovery mode: Fetching all published courses');
    } else {
      // SECURITY: ALWAYS require community filter for authenticated requests
      if (community) {
        // Use the provided community filter
        filter.community = community;
      } else {
        // CRITICAL: If no community specified, return empty - no courses should be visible
        console.log('🚨 SECURITY: No community filter provided - returning empty result');
        return res.status(200).json({
          success: true,
          courses: [],
          count: 0,
          message: 'Community filter is required for security'
        });
      }
    }

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (instructor) filter.instructor = instructor;

    console.log('🔍 Backend: Fetching courses with filter:', filter);

    const courses = await Course.find(filter)
      .populate('community')
      .sort({ order: 1, createdAt: -1 }) // Sort by order first, then by creation date
      .limit(50); // Add limit to prevent memory issues

    console.log('📊 Backend: Found', courses.length, 'courses');
    console.log('📋 Backend: Course IDs:', courses.map(c => c._id));
    
    // Debug: Check community information
    if (courses.length > 0) {
      console.log('🔍 Debug: First course community info:', {
        community: courses[0].community,
        communityType: typeof courses[0].community,
        communityName: courses[0].community?.name
      });
    }
    
    // Debug: Check if crypto course has chapters
    const cryptoCourse = courses.find(c => c.title && c.title.includes('Crypto Trading Mastery'));
    if (cryptoCourse) {
      console.log('🔍 Debug: Crypto course chapters length:', cryptoCourse.chapters ? cryptoCourse.chapters.length : 'null');
      console.log('🔍 Debug: Crypto course chaptersCount virtual:', cryptoCourse.chaptersCount);
      console.log('🔍 Debug: Crypto course videosCount virtual:', cryptoCourse.videosCount);
      console.log('🔍 Debug: Crypto course community:', cryptoCourse.community);
    }

    res.status(200).json({
      success: true,
      courses: courses || [],
      count: courses ? courses.length : 0
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

    // SECURITY: Check if user can update this course
    const existingCourse = await Course.findById(courseId);
    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // SECURITY: Ensure community users can only update their own courses
    if (req.user && req.user.type === 'community') {
      if (existingCourse.community.toString() !== req.user.communityId.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: You can only update courses from your community'
        });
      }
    }

    // Remove fields that shouldn't be updated directly
    delete updateData.instructor;
    delete updateData.community;
    delete updateData.students;

    // If chapters are being updated, process text content for PDF generation
    if (updateData.chapters) {
      console.log('🔄 Processing updated chapters for PDF generation...');
      updateData.chapters = await processTextContent(updateData.chapters, existingCourse.title);
      console.log('✅ Updated chapters processing completed');
    }

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

// Delete a course (Soft Delete - Archive)
exports.deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;

    // SECURITY: Check if user can delete this course
    const existingCourse = await Course.findById(courseId);
    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // SECURITY: Ensure community users can only delete their own courses
    if (req.user && req.user.type === 'community') {
      if (existingCourse.community.toString() !== req.user.communityId.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: You can only delete courses from your community'
        });
      }
    }

    // Soft delete: Update status to 'archived' instead of physically deleting
    const course = await Course.findByIdAndUpdate(
      courseId,
      { 
        status: 'archived',
        archivedAt: new Date()
      },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Course archived successfully',
      course
    });

  } catch (error) {
    console.error('Error archiving course:', error);
    res.status(500).json({
      success: false,
      message: 'Error archiving course',
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

// Reorder courses
exports.reorderCourses = async (req, res) => {
  try {
    const { courseOrder, communityId } = req.body;

    if (!courseOrder || !Array.isArray(courseOrder)) {
      return res.status(400).json({
        success: false,
        message: 'Course order array is required'
      });
    }

    if (!communityId) {
      return res.status(400).json({
        success: false,
        message: 'Community ID is required'
      });
    }

    console.log('🔄 Reordering courses:', {
      communityId,
      courseCount: courseOrder.length,
      courseIds: courseOrder.map(c => c.id || c._id),
      fullCourseOrder: courseOrder
    });

    // Validate that all courses exist and belong to the community
    const courseIds = courseOrder.map(c => c.id || c._id);
    const existingCourses = await Course.find({
      _id: { $in: courseIds },
      community: communityId
    });

    if (existingCourses.length !== courseIds.length) {
      return res.status(400).json({
        success: false,
        message: 'Some courses not found or do not belong to the specified community'
      });
    }

    // Update each course with its new order
    const updatePromises = courseOrder.map((courseData, index) => {
      const courseId = courseData.id || courseData._id;
      console.log(`🔄 Updating course ${index + 1}:`, { courseId, title: courseData.title });
      
      return Course.findByIdAndUpdate(
        courseId,
        { 
          order: index + 1, // Start order from 1
          updatedAt: new Date()
        },
        { new: true }
      ).catch(error => {
        console.error(`❌ Failed to update course ${courseId}:`, error);
        throw error;
      });
    });

    await Promise.all(updatePromises);

    console.log('✅ Courses reordered successfully');

    res.status(200).json({
      success: true,
      message: 'Courses reordered successfully',
      courseCount: courseOrder.length
    });

  } catch (error) {
    console.error('Error reordering courses:', error);
    res.status(500).json({
      success: false,
      message: 'Error reordering courses',
      error: error.message
    });
  }
};
