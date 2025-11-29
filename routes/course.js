const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudConfig');
const upload = multer({ storage });

const courseController = require('../controllers/courseController');
const { isAuthenticated, isInstructor, isCourseInstructor } = require('../middleware/auth');
const { validateCourse } = require('../middleware/validation');

// Get all courses (with search, filter, pagination)
router.get('/courses', courseController.getAllCourses);

// Show new course form
router.get('/courses/new', isAuthenticated, isInstructor, courseController.showNewCourseForm);

// Create new course
router.post('/courses', isAuthenticated, isInstructor, validateCourse, courseController.createCourse);

// Show course details
router.get('/courses/:id', isAuthenticated, courseController.showCourse);

// Show edit form
router.get('/courses/:id/edit', isAuthenticated, isCourseInstructor, courseController.showEditForm);

// Update course
router.patch('/courses/:id', isAuthenticated, isCourseInstructor, validateCourse, courseController.updateCourse);

// Delete course
router.delete('/courses/:id', isAuthenticated, isCourseInstructor, courseController.deleteCourse);

// Show add lesson form
router.get('/courses/:id/lesson/new', isAuthenticated, isInstructor, courseController.showAddLessonForm);

// Add lesson
router.post('/courses/:id/lesson', isAuthenticated, isInstructor, upload.single('video'), courseController.addLesson);

// Delete lesson
router.delete('/courses/:id/lessons/:lessonId', isAuthenticated, isCourseInstructor, courseController.deleteLesson);

// Mark lesson as completed
router.post('/courses/:id/lessons/:lessonId/complete', isAuthenticated, courseController.completeLesson);

module.exports = router;
