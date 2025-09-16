const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course.controller');
const auth = require('../middleware/auth');

// All routes require authentication (temporarily disabled for testing)
// router.use(auth.protect);

// Course CRUD operations
router.post('/', courseController.createCourse);
router.get('/', courseController.getCourses);
router.get('/:id', courseController.getCourseById);
router.put('/:id', courseController.updateCourse);
router.delete('/:id', courseController.deleteCourse);

// Course actions
router.patch('/:id/publish', courseController.publishCourse);
router.post('/:courseId/enroll/:studentId', courseController.enrollStudent);
router.post('/:courseId/rate', courseController.rateCourse);
router.patch('/reorder', courseController.reorderCourses);

module.exports = router;
